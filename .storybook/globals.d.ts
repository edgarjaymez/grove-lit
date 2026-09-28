declare module '*.css' {}
declare module '*?raw' {
	const content: string;
	export default content;
}

/** Set by .storybook/vitest.setup.ts: the theme a Storybook test run renders every story in. */
// eslint-disable-next-line no-var
declare var __GROVE_TEST_THEME__: 'light' | 'dark' | 'system' | undefined;
