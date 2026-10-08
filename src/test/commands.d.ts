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
		/**
		 * Chrome's own accessibility nodes for the first element matching `selector` and everything under
		 * it, shadow roots included, in tree order. Ignored nodes are left out.
		 */
		axNodes: (selector: string) => Promise<AxNode[]>;
	}

	interface AxNode {
		role: string;
		name: string;
		description: string;
		/** The DOM node the accessibility node belongs to: a tag name, or `#text`. */
		node: string;
		focusable?: boolean;
		focused?: boolean;
		/** `'true'`, `'false'` or `'mixed'` on checkable roles. */
		checked?: string;
		disabled?: boolean;
	}
}
