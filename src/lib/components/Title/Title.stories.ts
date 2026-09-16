import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './Title.js';

interface Args {
	heading: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	icon: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-title',
	tags: ['autodocs'],
	render: ({ heading, level, icon }) => html`
		<gv-title heading=${heading} level=${level} icon=${icon}></gv-title>
	`,
	argTypes: {
		heading: { control: 'text' },
		level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
		icon: { control: 'text' }
	},
	args: {
		heading: 'Documentation',
		level: 2,
		icon: 'palette'
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Level1: Story = { args: { level: 1 } };
export const Level3: Story = { args: { level: 3 } };
export const NoIcon: Story = { args: { icon: '' } };
