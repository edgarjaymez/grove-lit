import { commands } from 'vitest/browser';

/** The three theme runs every visual guarantee must hold in: forced light, forced dark, OS dark. */
export const themes = [
	{ name: 'light', attr: 'light', colorScheme: 'light' },
	{ name: 'dark', attr: 'dark', colorScheme: 'light' },
	{ name: 'OS dark', attr: undefined, colorScheme: 'dark' }
] as const;

export const applyTheme = async (theme: (typeof themes)[number]) => {
	const root = document.documentElement;
	if (theme.attr) root.dataset.theme = theme.attr;
	else delete root.dataset.theme;
	await commands.emulateMedia({ colorScheme: theme.colorScheme });
};
