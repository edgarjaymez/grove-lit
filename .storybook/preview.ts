import { html } from 'lit';
import type { Decorator, Preview } from '@storybook/web-components';
import '../src/lib/tokens/tokens.css';
import '../src/lib/styles/globals.css';
import '../src/lib/styles/typography.css';
import '../src/lib/styles/effects.css';
import '../src/lib/styles/surfaces.css';
import '../src/lib/styles/a11y.css';
import '../src/lib/fonts/fonts.css';
import '@phosphor-icons/webcomponents';

/**
 * Applies the toolbar theme where a consumer would, on `<html>`; "System" removes the attribute so
 * `prefers-color-scheme` decides. The `display: contents` wrapper hands Ground's text colour to
 * story copy without adding a box — docs mode would otherwise inherit Storybook's own text colour.
 */
const withTheme: Decorator = (story, { globals }) => {
	const root = document.documentElement;
	const theme = globalThis.__GROVE_TEST_THEME__ ?? globals.theme;
	if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
	else delete root.dataset.theme;
	return html`<div style="display: contents; color: var(--semantic-color-text-on-ground-base)">
		${story()}
	</div>`;
};

const preview: Preview = {
	decorators: [withTheme],
	globalTypes: {
		theme: {
			description: 'Grove theme — System follows prefers-color-scheme',
			toolbar: {
				title: 'Theme',
				icon: 'mirror',
				items: [
					{ value: 'system', title: 'System', icon: 'browser' },
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' }
				],
				dynamicTitle: true
			}
		}
	},
	initialGlobals: {
		theme: 'system',
		backgrounds: { value: 'ground' }
	},
	parameters: {
		// Report-only until the known violations are fixed (#50: checkbox names); then 'error'.
		// Meanwhile a component whose stories are already clean can opt in with
		// `parameters: { a11y: { test: 'error' } }` in its stories file, as gv-menu-item does.
		// The rule set matches the audit in #33, so results compare one to one.
		a11y: {
			test: 'todo',
			options: {
				runOnly: {
					type: 'tag',
					values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
				}
			}
		},
		// A single background drawn from the theme itself, so canvas and docs previews always sit on
		// the active Ground (Storybook paints docs previews white otherwise).
		backgrounds: {
			options: { ground: { name: 'Ground', value: 'var(--semantic-color-surface-ground)' } }
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		options: {
			storySort: {
				order: ['Home', 'Components', 'Primitives', 'Layout', '*']
			}
		}
	}
};

export default preview;
