import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import dts from 'unplugin-dts/vite';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	},
	plugins: [
		dts({
			include: [
				'src/lib/index.ts',
				'src/lib/components/**/*.ts',
				'src/lib/styles/component-reset.ts'
			],
			exclude: ['src/lib/components/**/*.stories.ts', 'src/lib/components/**/*.metadata.ts'],
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
					include: ['src/**/*.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
