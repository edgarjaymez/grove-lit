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
				'src/lib/surfaces.ts'
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
						commands: { emulateMedia, ariaSnapshot }
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
