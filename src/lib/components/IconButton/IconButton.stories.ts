import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './IconButton.js';

interface Args {
	icon: string;
	variant: 'filled' | 'tonal' | 'outlined' | 'ghost';
	color: 'accent' | 'gray';
	size: 'lg' | 'md' | 'sm';
	disabled: boolean;
	ariaLabel: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-icon-button',
	tags: ['autodocs'],
	render: ({ icon, variant, color, size, disabled, ariaLabel }) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block"
		>
			<gv-icon-button
				icon=${icon}
				variant=${variant}
				color=${color}
				size=${size}
				?disabled=${disabled}
				aria-label=${ariaLabel}
			></gv-icon-button>
		</span>
	`,
	argTypes: {
		variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'ghost'] },
		color: { control: 'select', options: ['accent', 'gray'] },
		size: { control: 'select', options: ['lg', 'md', 'sm'] },
		disabled: { control: 'boolean' },
		icon: { control: 'text' }
	},
	args: {
		icon: 'tree',
		variant: 'filled',
		color: 'accent',
		size: 'lg',
		disabled: false,
		ariaLabel: 'Icon button'
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
