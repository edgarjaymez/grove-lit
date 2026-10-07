import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

/**
 * The #49 review experiments, kept out of `pnpm test`. Run from the repo root:
 * pnpm exec vitest --config review/49-form-slots/vitest.config.ts --run
 */
const browser = (args: string[] = []) => ({
	enabled: true,
	headless: true,
	provider: playwright({ launchOptions: { args } }),
	instances: [{ browser: 'chromium' as const }]
});

export default defineConfig({
	root: fileURLToPath(new URL('../..', import.meta.url)),
	optimizeDeps: {
		include: ['lit', 'lit/decorators.js', 'lit/directives/*.js', '@phosphor-icons/webcomponents/*']
	},
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'review-49',
					include: ['review/49-form-slots/form-slots.browser.test.ts'],
					setupFiles: ['src/test/browser-setup.ts'],
					browser: browser()
				}
			},
			{
				extends: true,
				test: {
					name: 'review-49-reference-target',
					include: ['review/49-form-slots/reference-target.browser.test.ts'],
					setupFiles: ['src/test/browser-setup.ts'],
					browser: browser(['--enable-blink-features=ShadowRootReferenceTarget'])
				}
			}
		]
	}
});
