import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Button.js';

interface Args {
	text: string;
	variant: 'filled' | 'tonal' | 'outlined' | 'ghost';
	color: 'accent' | 'gray';
	size: 'lg' | 'md' | 'sm';
	icon: string;
	disabled: boolean;
}

const meta: Meta<Args> = {
	title: 'Components/gv-button',
	tags: ['autodocs'],
	render: ({ text, variant, color, size, icon, disabled }) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block"
		>
			<gv-button
				text=${text}
				variant=${variant}
				color=${color}
				size=${size}
				icon=${icon}
				?disabled=${disabled}
			></gv-button>
		</span>
	`,
	argTypes: {
		text: { control: 'text' },
		variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'ghost'] },
		color: { control: 'select', options: ['accent', 'gray'] },
		size: { control: 'select', options: ['lg', 'md', 'sm'] },
		icon: { control: 'text' },
		disabled: { control: 'boolean' }
	},
	args: {
		text: 'Button',
		variant: 'filled',
		color: 'accent',
		size: 'md',
		disabled: false
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Gray: Story = { args: { color: 'gray' } };
export const Large: Story = { args: { size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
export const WithIcon: Story = { args: { icon: 'tree' } };
export const Disabled: Story = { args: { disabled: true } };

/** The text as content: it names the button and is in the server HTML. */
export const Slotted: Story = {
	render: ({ variant, color, size, icon, disabled }) => html`
		<gv-button
			variant=${variant}
			color=${color}
			size=${size}
			icon=${ifDefined(icon || undefined)}
			?disabled=${disabled}
			>Save changes</gv-button
		>
	`
};
