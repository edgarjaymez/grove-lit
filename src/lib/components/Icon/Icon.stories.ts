import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Icon.js';

interface Args {
	name: string;
	isFilled: boolean;
	fillInHover: boolean;
	label?: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-icon',
	tags: ['autodocs'],
	render: ({ name, isFilled, fillInHover, label }) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); color: var(--semantic-color-text-on-ground-base)"
		>
			<gv-icon
				name=${name}
				?is-filled=${isFilled}
				?fill-in-hover=${fillInHover}
				label=${ifDefined(label || undefined)}
			></gv-icon>
		</span>
	`,
	argTypes: {
		name: { control: 'text' },
		isFilled: { control: 'boolean' },
		fillInHover: { control: 'boolean' },
		label: { control: 'text' }
	},
	args: {
		name: 'tree',
		isFilled: false,
		fillInHover: false
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const Filled: Story = {
	args: { isFilled: true }
};

export const FillOnHover: Story = {
	args: { fillInHover: true }
};

/** A glyph that means something on its own: one image named "Warning". */
export const Labelled: Story = {
	args: { name: 'warning-circle', isFilled: true, label: 'Warning' }
};

/**
 * A name Phosphor does not have. Storybook registers every glyph, so this is the only way to see the
 * missing-glyph warning here: the console logs it once, 2 s after load, with the import to add.
 */
export const Unregistered: Story = {
	tags: ['missing-glyph'],
	args: { name: 'not-a-phosphor-glyph' }
};
