import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './ToDoListItem.js';

interface Args {
	heading: string;
	category: string;
	icon: string;
	isDone: boolean;
}

const meta: Meta<Args> = {
	title: 'Components/gv-todo-list-item',
	tags: ['autodocs'],
	render: ({ heading, category, icon, isDone }) => html`
		<gv-todo-list-item
			heading=${heading}
			category=${category}
			icon=${icon}
			?is-done=${isDone}
		></gv-todo-list-item>
	`,
	argTypes: {
		heading: { control: 'text' },
		category: { control: 'text' },
		icon: { control: 'text' },
		isDone: { control: 'boolean' }
	},
	args: {
		heading: 'Task',
		category: 'Category',
		icon: 'tree',
		isDone: false
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Done: Story = { args: { isDone: true } };
