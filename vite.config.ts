import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import dts from 'unplugin-dts/vite';
import { playwright } from '@vitest/browser-playwright';
import type { BrowserCommand } from 'vitest/node';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

interface MediaEmulation {
	reducedMotion?: 'reduce' | 'no-preference';
	colorScheme?: 'light' | 'dark';
	forcedColors?: 'active' | 'none';
}

/** Emulates user-preference media features for the page the browser tests run in. */
const emulateMedia: BrowserCommand<[MediaEmulation]> = async (ctx, media) => {
	if (ctx.provider.name !== 'playwright')
		throw new Error('emulateMedia needs the playwright provider');
	await ctx.page.emulateMedia(media);
};

/** Playwright's ARIA snapshot of an element in the test page: what the accessibility tree exposes. */
const ariaSnapshot: BrowserCommand<[selector: string]> = async (ctx, selector) => {
	if (ctx.provider.name !== 'playwright')
		throw new Error('ariaSnapshot needs the playwright provider');
	return ctx.iframe.locator(selector).ariaSnapshot();
};

interface AxNode {
	role: string;
	name: string;
	description: string;
	/** The DOM node the accessibility node belongs to: a tag name, or `#text`. */
	node: string;
	focusable?: boolean;
	focused?: boolean;
	checked?: string;
	disabled?: boolean;
}

interface DomNode {
	nodeType: number;
	nodeName: string;
	backendNodeId: number;
	attributes?: string[];
	children?: DomNode[];
	shadowRoots?: DomNode[];
	contentDocument?: DomNode;
	nodeValue?: string;
}

/**
 * Chrome's own accessibility tree for an element in the test page and everything under it, shadow roots
 * included: one entry per exposed node, in tree order. `ariaSnapshot` is Playwright's re-implementation
 * of name computation; this reads what Chrome computed, over the DevTools protocol.
 */
const axNodes: BrowserCommand<[selector: string]> = async (ctx, selector) => {
	if (ctx.provider.name !== 'playwright') throw new Error('axNodes needs the playwright provider');
	const frame = await ctx.frame();
	const token = `ax-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	const host = frame.locator(selector).first();
	await host.evaluate((el, t) => el.setAttribute('data-ax-probe', t), token);
	const cdp = await ctx.context.newCDPSession(ctx.page);
	try {
		const { root } = (await cdp.send('DOM.getDocument', { depth: -1, pierce: true })) as {
			root: DomNode;
		};
		const find = (node: DomNode): DomNode | undefined => {
			const attrs = node.attributes ?? [];
			for (let i = 0; i < attrs.length; i += 2)
				if (attrs[i] === 'data-ax-probe' && attrs[i + 1] === token) return node;
			for (const child of [
				...(node.shadowRoots ?? []),
				...(node.contentDocument ? [node.contentDocument] : []),
				...(node.children ?? [])
			]) {
				const found = find(child);
				if (found) return found;
			}
		};
		const start = find(root);
		if (!start) throw new Error(`axNodes: nothing matches ${selector}`);
		const nodes: DomNode[] = [];
		const walk = (node: DomNode) => {
			if (node.nodeType === 1 || (node.nodeType === 3 && node.nodeValue?.trim())) nodes.push(node);
			for (const child of [...(node.shadowRoots ?? []), ...(node.children ?? [])]) walk(child);
		};
		walk(start);
		const out: AxNode[] = [];
		for (const node of nodes) {
			const { nodes: ax } = (await cdp.send('Accessibility.getPartialAXTree', {
				backendNodeId: node.backendNodeId,
				fetchRelatives: false
			})) as {
				nodes: {
					backendDOMNodeId?: number;
					ignored: boolean;
					role?: { value: string };
					name?: { value: string };
					description?: { value: string };
					properties?: { name: string; value: { value: unknown } }[];
				}[];
			};
			const own = ax.find((n) => n.backendDOMNodeId === node.backendNodeId);
			if (!own || own.ignored) continue;
			const props = Object.fromEntries((own.properties ?? []).map((p) => [p.name, p.value.value]));
			out.push({
				role: own.role?.value ?? '',
				name: own.name?.value ?? '',
				description: own.description?.value ?? '',
				node: node.nodeType === 3 ? '#text' : node.nodeName.toLowerCase(),
				...(props.focusable !== undefined && { focusable: Boolean(props.focusable) }),
				...(props.focused !== undefined && { focused: Boolean(props.focused) }),
				...(props.checked !== undefined && { checked: String(props.checked) }),
				...(props.disabled !== undefined && { disabled: Boolean(props.disabled) })
			});
		}
		return out;
	} finally {
		await cdp.detach();
		await host.evaluate((el) => el.removeAttribute('data-ax-probe'));
	}
};

/**
 * Every story runs once per Grove theme. OS dark leaves `data-theme` off and sets the browser's colour
 * scheme, so the `prefers-color-scheme` block of tokens.css is what gets tested.
 */
const themeInstances = [
	{ name: 'light', theme: 'light', colorScheme: 'light' },
	{ name: 'dark', theme: 'dark', colorScheme: 'light' },
	{ name: 'os-dark', theme: 'system', colorScheme: 'dark' }
].map(({ name, theme, colorScheme }) => ({
	browser: 'chromium' as const,
	name,
	provide: { groveTheme: theme },
	provider: playwright({ contextOptions: { colorScheme: colorScheme as 'light' | 'dark' } })
}));

/** A Storybook project over the stories selected by tag, in all three themes. */
const storybookProject = (name: string, tags: { include?: string[]; exclude?: string[] }) => ({
	extends: true as const,
	plugins: [storybookTest({ configDir: '.storybook', tags })],
	test: {
		name,
		// An empty collection means the plugin found no stories: that must fail, not pass.
		passWithNoTests: false,
		// The a11y addon only calls expect() when it finds a violation.
		expect: { requireAssertions: false },
		setupFiles: ['.storybook/vitest.setup.ts'],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: themeInstances
		}
	}
});

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	},
	plugins: [
		dts({
			include: [
				'src/lib/index.ts',
				'src/lib/events.ts',
				'src/lib/components/**/*.ts',
				'src/lib/styles/component-reset.ts',
				'src/lib/styles/visually-hidden.ts',
				'src/lib/styles/focus-ring.ts',
				'src/lib/surfaces.ts',
				'src/lib/utils/form-control.ts'
			],
			exclude: ['src/lib/components/**/*.stories.ts', 'src/lib/components/**/*.test.ts'],
			outDirs: 'dist',
			entryRoot: 'src/lib'
		}),
		{
			name: 'copy-static-assets',
			apply: 'build' as const,
			async closeBundle() {
				const { copyFile, cp, mkdir } = await import('node:fs/promises');
				await mkdir('dist/tokens', { recursive: true });
				await copyFile('src/lib/tokens/tokens.css', 'dist/tokens/tokens.css');
				await copyFile('components-since.json', 'dist/components-since.json');
				await cp('src/lib/fonts', 'dist/fonts', { recursive: true });
				await mkdir('dist/styles', { recursive: true });
				const { readdir } = await import('node:fs/promises');
				const styleFiles = (await readdir('src/lib/styles')).filter((f) => f.endsWith('.css'));
				await Promise.all(
					styleFiles.map((f) => copyFile(`src/lib/styles/${f}`, `dist/styles/${f}`))
				);
			}
		}
	],
	build: {
		lib: {
			entry: 'src/lib/index.ts',
			formats: ['es'],
			fileName: 'index'
		},
		rollupOptions: {
			external: ['lit', /^lit\//]
		},
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true
	},
	test: {
		passWithNoTests: true,
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'unit',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.test.mjs'],
					exclude: ['src/**/*.browser.test.ts']
				}
			},
			{
				extends: './vite.config.ts',
				// Pre-bundled up front so a test importing a new directive doesn't trigger a mid-run reload.
				optimizeDeps: {
					include: [
						'lit',
						'lit/decorators.js',
						'lit/directives/*.js',
						'lit/static-html.js',
						'@phosphor-icons/webcomponents/*'
					]
				},
				test: {
					name: 'browser',
					include: ['src/**/*.browser.test.ts'],
					setupFiles: ['src/test/browser-setup.ts'],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
						commands: { emulateMedia, ariaSnapshot, axNodes }
					}
				}
			},
			storybookProject('storybook', { exclude: ['a11y-canary'] }),
			// Fails by design, so only `pnpm test:a11y-canary` turns it on (and inverts the result).
			...(process.env.GROVE_A11Y_CANARY
				? [storybookProject('a11y-canary', { include: ['a11y-canary'] })]
				: [])
		]
	}
});
