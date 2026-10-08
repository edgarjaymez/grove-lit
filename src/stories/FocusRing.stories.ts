import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import '../lib/components/Button/Button.js';
import '../lib/components/IconButton/IconButton.js';
import '../lib/components/BackButton/BackButton.js';
import '../lib/components/Checkbox/Checkbox.js';
import '../lib/components/ColorSwatch/ColorSwatch.js';
import '../lib/components/ToDoCategoryToggler/ToDoCategoryToggler.js';
import '../lib/components/MenuItem/MenuItem.js';
import '../lib/components/TextInput/TextInput.js';
import { GROVE_SURFACES, isAurora } from '../lib/surfaces.js';
import type { GroveSurface } from '../lib/surfaces.js';

/** Each focusable, as the host's data-focus and the focused part of its shadow root. */
const FOCUSABLES = {
	button: ['button', '.gv-focusable'],
	'icon-button': ['icon-button', '.gv-focusable'],
	'back-button': ['back-button', '.gv-focusable'],
	checkbox: ['checkbox', '.gv-focusable'],
	'color-swatch-oklch': ['color-swatch', '.oklch-group'],
	'color-swatch-hex': ['color-swatch', '.hex-value'],
	'todo-category-toggler': ['todo-category-toggler', '.gv-focusable'],
	'menu-item': ['menu-item', '.gv-focusable'],
	'text-input': ['text-input', '.gv-focusable']
} as const;
type Focusable = keyof typeof FOCUSABLES;

interface Args {
	surface: GroveSurface;
	focused: Focusable;
}

/* The swatch's copy tooltips float 80px to its left, hence the gutter. */
const controls = html`
	<gv-button data-focus="button">Save</gv-button>
	<gv-icon-button data-focus="icon-button" label="Close" icon="x"></gv-icon-button>
	<gv-back-button data-focus="back-button"></gv-back-button>
	<gv-checkbox data-focus="checkbox" label="Remember me"></gv-checkbox>
	<div style="padding-left: var(--soft-grid-80)">
		<gv-color-swatch
			data-focus="color-swatch"
			color="brand"
			shade="50"
			name="Brand 50"
			oklch="0.93 0.035 145"
			hex="#DAEFDA"
		></gv-color-swatch>
	</div>
	<gv-todo-category-toggler
		data-focus="todo-category-toggler"
		category="Garden"
		count="3"
	></gv-todo-category-toggler>
	<gv-menu-item data-focus="menu-item" href="#">Home</gv-menu-item>
	<gv-text-input data-focus="text-input" label="Name" placeholder="Name"></gv-text-input>
`;

/**
 * Every focusable Grove control on one surface, with one of them focused as the keyboard would focus
 * it (:focus-visible), so its ring shows without operating the page. Pick the control with `focused` and the surface with
 * `surface`; switch the Theme toolbar to review both themes (#22 FR-A16).
 */
const meta: Meta<Args> = {
	title: 'Foundations/Focus ring',
	argTypes: {
		surface: { control: 'select', options: GROVE_SURFACES.filter((s) => !isAurora(s)) },
		focused: { control: 'select', options: Object.keys(FOCUSABLES) }
	},
	args: { surface: 'ground', focused: 'button' },
	render: ({ surface }) => html`
		<div
			class="gv-surface-${surface}"
			style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--soft-grid-24); padding: var(--soft-grid-32)"
		>
			${controls}
		</div>
	`,
	play: async ({ canvasElement, args }) => {
		const [id, part] = FOCUSABLES[args.focused];
		const target = canvasElement
			.querySelector(`[data-focus="${id}"]`)!
			.shadowRoot!.querySelector<HTMLElement>(part)!;
		target.focus({ focusVisible: true });
		await expect(target.matches(':focus-visible')).toBe(true);
		await expect(getComputedStyle(target).boxShadow).not.toBe('none');
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Ground: Story = {};
export const BrandTerrace: Story = { args: { surface: 'brand-terrace' } };
export const GrayPath: Story = { args: { surface: 'gray-path' } };
export const AccentSummit: Story = { args: { surface: 'accent-summit' } };

export const FocusedIconButton: Story = { args: { focused: 'icon-button' } };
export const FocusedBackButton: Story = { args: { focused: 'back-button' } };
export const FocusedCheckbox: Story = { args: { focused: 'checkbox' } };
export const FocusedColorSwatchOklch: Story = { args: { focused: 'color-swatch-oklch' } };
export const FocusedColorSwatchHex: Story = { args: { focused: 'color-swatch-hex' } };
export const FocusedCategoryToggler: Story = { args: { focused: 'todo-category-toggler' } };
export const FocusedMenuItem: Story = { args: { focused: 'menu-item' } };
export const FocusedTextInput: Story = { args: { focused: 'text-input' } };

/** A control over an aurora highlight keeps the resting surface's ring. */
export const OverAurora: Story = {
	render: () => html`
		<div class="gv-surface-brand-terrace" style="padding: var(--soft-grid-32)">
			<div
				class="gv-surface-brand-aurora"
				style="display: flex; flex-wrap: wrap; gap: var(--soft-grid-24); padding: var(--soft-grid-24)"
			>
				${controls}
			</div>
		</div>
	`
};
