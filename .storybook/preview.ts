import { html } from 'lit';
import type { Decorator, Preview } from '@storybook/web-components';
import '../src/lib/tokens/tokens.css';
import '../src/lib/styles/globals.css';
import '../src/lib/styles/typography.css';
import '../src/lib/styles/effects.css';
import '../src/lib/fonts/fonts.css';
import '@phosphor-icons/webcomponents';

/**
 * Applies the toolbar theme where a consumer would, on `<html>`; "System" removes the attribute so
 * `prefers-color-scheme` decides. The `display: contents` wrapper hands Ground's text colour to
 * story copy without adding a box — docs mode would otherwise inherit Storybook's own text colour.
 */
const withTheme: Decorator = (story, { globals }) => {
	const root = document.documentElement;
	if (globals.theme === 'light' || globals.theme === 'dark') root.dataset.theme = globals.theme;
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
