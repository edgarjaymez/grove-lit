import 'vitest/browser';

declare module 'vitest/browser' {
	interface BrowserCommands {
		emulateMedia: (media: {
			reducedMotion?: 'reduce' | 'no-preference';
			colorScheme?: 'light' | 'dark';
			forcedColors?: 'active' | 'none';
		}) => Promise<void>;
		/** The YAML ARIA snapshot Playwright computes for the first element matching `selector`. */
		ariaSnapshot: (selector: string) => Promise<string>;
	}
}
