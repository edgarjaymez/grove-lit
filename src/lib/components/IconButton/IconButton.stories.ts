import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './IconButton.js';
import '../Tooltip/Tooltip.js';

interface Args {
	icon: string;
	variant: 'filled' | 'tonal' | 'outlined' | 'ghost';
	color: 'accent' | 'gray';
	size: 'lg' | 'md' | 'sm';
	disabled: boolean;
	label: string;
	description: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-icon-button',
	tags: ['autodocs'],
	render: ({ icon, variant, color, size, disabled, label, description }) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block"
		>
			<gv-icon-button
				icon=${icon}
				variant=${variant}
				color=${color}
				size=${size}
				?disabled=${disabled}
				label=${label}
				description=${description}
			></gv-icon-button>
		</span>
	`,
	argTypes: {
		variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'ghost'] },
		color: { control: 'select', options: ['accent', 'gray'] },
		size: { control: 'select', options: ['lg', 'md', 'sm'] },
		disabled: { control: 'boolean' },
		icon: { control: 'text' },
		label: { control: 'text', description: 'The accessible name. Never shown.' },
		description: { control: 'text', description: 'Read after the name. Never shown.' }
	},
	args: {
		icon: 'tree',
		variant: 'filled',
		color: 'accent',
		size: 'lg',
		disabled: false,
		label: 'Icon button',
		description: ''
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Gray: Story = { args: { color: 'gray' } };
export const Medium: Story = { args: { size: 'md' } };
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };

/** A visual tooltip next to the button: its text reaches the button as `description`, given once. */
export const WithTooltip: Story = {
	render: () => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-flex; gap: 8px; align-items: center"
		>
			<gv-icon-button icon="copy" variant="ghost" color="gray" label="Copy" description="Copy hex">
			</gv-icon-button>
			<gv-tooltip aria-hidden="true" type="simple" icon="copy" message="Copy hex"></gv-tooltip>
		</span>
	`
};
