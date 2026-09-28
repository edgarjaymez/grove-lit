import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import dts from 'unplugin-dts/vite';
import { playwright } from '@vitest/browser-playwright';
import type { BrowserCommand } from 'vitest/node';

interface MediaEmulation {
	reducedMotion?: 'reduce' | 'no-preference';
	colorScheme?: 'light' | 'dark';
}

/** Emulates user-preference media features for the page the browser tests run in. */
const emulateMedia: BrowserCommand<[MediaEmulation]> = async (ctx, media) => {
	if (ctx.provider.name !== 'playwright')
		throw new Error('emulateMedia needs the playwright provider');
	await ctx.page.emulateMedia(media);
};

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
				'src/lib/styles/visually-hidden.ts'
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
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.browser.test.ts']
				}
			},
			{
				extends: './vite.config.ts',
				// Pre-bundled up front so a test importing a new directive doesn't trigger a mid-run reload.
				optimizeDeps: {
					include: ['lit', 'lit/decorators.js', 'lit/directives/*.js', 'lit/static-html.js']
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
						commands: { emulateMedia }
					}
				}
			}
		]
	}
});
