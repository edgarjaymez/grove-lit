import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './TextInput.js';

interface Args {
	color: 'brand' | 'gray';
	error: boolean;
	disabled: boolean;
	value: string;
	placeholder: string;
	type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
	label: string;
	description: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-text-input',
	tags: ['autodocs'],
	render: ({ color, error, disabled, value, placeholder, type, label, description }) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block; width: 300px"
		>
			<gv-text-input
				color=${color}
				?error=${error}
				?disabled=${disabled}
				value=${value}
				placeholder=${placeholder}
				type=${type}
				label=${label}
				description=${description}
			></gv-text-input>
		</span>
	`,
	argTypes: {
		color: { control: 'select', options: ['brand', 'gray'] },
		error: { control: 'boolean' },
		disabled: { control: 'boolean' },
		value: { control: 'text' },
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number']
		},
		label: { control: 'text', description: 'The accessible name. Never shown.' },
		description: {
			control: 'text',
			description: 'Hint or error text, read after the name. Never shown.'
		}
	},
	args: {
		color: 'brand',
		error: false,
		disabled: false,
		value: '',
		placeholder: 'Enter text…',
		type: 'text',
		label: 'Full name',
		description: ''
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const Filled: Story = {
	args: { value: 'Jane Smith' }
};

export const Gray: Story = {
	args: { color: 'gray' }
};

export const Error: Story = {
	args: { error: true, placeholder: 'Invalid value', description: 'Enter your full name' }
};

export const Disabled: Story = {
	args: { disabled: true, placeholder: 'Disabled field' }
};
