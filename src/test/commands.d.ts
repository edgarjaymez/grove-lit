import 'vitest/browser';

declare module 'vitest/browser' {
	interface BrowserCommands {
		emulateMedia: (media: {
			reducedMotion?: 'reduce' | 'no-preference';
			colorScheme?: 'light' | 'dark';
		}) => Promise<void>;
	}
}
