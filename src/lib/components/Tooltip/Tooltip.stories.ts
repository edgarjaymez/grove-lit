import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Tooltip.js';

interface Args {
	type: 'simple' | 'complete';
	color: 'accent' | 'gray';
	icon: string;
	heading: string;
	message: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-tooltip',
	tags: ['autodocs'],
	render: ({ type, color, icon, heading, message }) => html`
		<gv-tooltip
			type=${type}
			color=${color}
			icon=${ifDefined(icon || undefined)}
			heading=${heading}
			message=${message}
		></gv-tooltip>
	`,
	argTypes: {
		type: { control: 'select', options: ['simple', 'complete'] },
		color: { control: 'select', options: ['accent', 'gray'] },
		icon: { control: 'text' },
		heading: { control: 'text' },
		message: { control: 'text' }
	},
	args: {
		type: 'simple',
		color: 'accent',
		icon: 'info',
		heading: '',
		message: 'Copy to clipboard'
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const SimpleGray: Story = {
	args: {
		color: 'gray'
	}
};

export const Complete: Story = {
	args: {
		type: 'complete',
		icon: 'lightbulb',
		heading: 'Soft grid',
		message: 'Every spacing value in Grove is a multiple of four.'
	}
};

export const CompleteGray: Story = {
	args: {
		type: 'complete',
		color: 'gray',
		icon: 'lightbulb',
		heading: 'Soft grid',
		message: 'Every spacing value in Grove is a multiple of four.'
	}
};

export const WithoutIcon: Story = {
	args: {
		icon: '',
		message: 'Read only'
	}
};
