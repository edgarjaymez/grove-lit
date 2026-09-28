import { inject } from 'vitest';

declare module 'vitest' {
	export interface ProvidedContext {
		groveTheme: 'light' | 'dark' | 'system';
	}
}

// Read by the preview's theme decorator, so each browser instance renders every story in its theme.
globalThis.__GROVE_TEST_THEME__ = inject('groveTheme');
