import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { userEvent } from 'storybook/test';
import '../lib/components/Button/Button.js';
import '../lib/components/IconButton/IconButton.js';
import '../lib/components/BackButton/BackButton.js';
import '../lib/components/Checkbox/Checkbox.js';
import '../lib/components/ToDoCategoryToggler/ToDoCategoryToggler.js';
import '../lib/components/MenuItem/MenuItem.js';
import '../lib/components/TextInput/TextInput.js';
import { GROVE_SURFACES, isAurora } from '../lib/surfaces.js';
import type { GroveSurface } from '../lib/surfaces.js';

interface Args {
	surface: GroveSurface;
}

const controls = html`
	<gv-button>Save</gv-button>
	<gv-icon-button aria-label="Close" icon="x"></gv-icon-button>
	<gv-back-button></gv-back-button>
	<gv-checkbox></gv-checkbox>
	<gv-todo-category-toggler category="Garden" count="3"></gv-todo-category-toggler>
	<gv-menu-item href="#">Home</gv-menu-item>
	<gv-text-input placeholder="Name"></gv-text-input>
`;

/**
 * Every focusable Grove control on one surface. The play function tabs into the first control; keep
 * pressing Tab to walk the rest. Switch the Theme toolbar to review both themes (#22 FR-A16).
 */
const meta: Meta<Args> = {
	title: 'Foundations/Focus ring',
	argTypes: {
		surface: { control: 'select', options: GROVE_SURFACES.filter((s) => !isAurora(s)) }
	},
	args: { surface: 'ground' },
	render: ({ surface }) => html`
		<div
			class="gv-surface-${surface}"
			style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--soft-grid-24); padding: var(--soft-grid-32)"
		>
			${controls}
		</div>
	`,
	play: async () => {
		await userEvent.tab();
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Ground: Story = {};
export const BrandTerrace: Story = { args: { surface: 'brand-terrace' } };
export const GrayPath: Story = { args: { surface: 'gray-path' } };
export const AccentSummit: Story = { args: { surface: 'accent-summit' } };

/** A control over an aurora highlight keeps the resting surface's ring. */
export const OverAurora: Story = {
	render: () => html`
		<div class="gv-surface-brand-terrace" style="padding: var(--soft-grid-32)">
			<div
				class="gv-surface-brand-aurora"
				style="display: flex; gap: var(--soft-grid-24); padding: var(--soft-grid-24)"
			>
				${controls}
			</div>
		</div>
	`
};
