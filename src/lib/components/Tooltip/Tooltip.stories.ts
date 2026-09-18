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
	isPressed: boolean;
}

const meta: Meta<Args> = {
	title: 'Components/gv-tooltip',
	tags: ['autodocs'],
	render: ({ type, color, icon, heading, message, isPressed }) => html`
		<gv-tooltip
			type=${type}
			color=${color}
			icon=${ifDefined(icon || undefined)}
			heading=${heading}
			message=${message}
			?is-pressed=${isPressed}
		></gv-tooltip>
	`,
	argTypes: {
		type: { control: 'select', options: ['simple', 'complete'] },
		color: { control: 'select', options: ['accent', 'gray'] },
		icon: { control: 'text' },
		heading: { control: 'text' },
		message: { control: 'text' },
		isPressed: { control: 'boolean' }
	},
	args: {
		type: 'simple',
		color: 'accent',
		icon: 'info',
		heading: '',
		message: 'Copy to clipboard',
		isPressed: false
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

export const Pressed: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'is-pressed removes the summit drop shadow over 300ms, flattening the bubble against the surface so it reads as pushed down. It is presentational — the consumer sets it to echo a press it just handled, as gv-color-swatch does while its "Copied!" confirmation shows.'
			}
		}
	},
	args: {
		icon: 'copy',
		message: 'Copied!',
		isPressed: true
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
