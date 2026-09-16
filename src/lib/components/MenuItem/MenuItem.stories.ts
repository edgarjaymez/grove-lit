import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './MenuItem.js';

interface Args {
	label: string;
	href: string;
	icon: string;
	size: 'md' | 'sm';
	isActive: boolean;
}

/** The parent paints the brand terrace surface — gv-menu-item is transparent by design. */
const terrace = (story: () => unknown) => html`
	<div
		style="background: var(--semantic-color-surface-brand-terrace); padding: var(--soft-grid-16); width: 240px;"
	>
		${story()}
	</div>
`;

const meta: Meta<Args> = {
	title: 'Components/gv-menu-item',
	tags: ['autodocs'],
	decorators: [terrace],
	render: ({ label, href, icon, size, isActive }) => html`
		<gv-menu-item
			label=${label}
			href=${ifDefined(href || undefined)}
			icon=${icon}
			size=${size}
			?is-active=${isActive}
		></gv-menu-item>
	`,
	argTypes: {
		label: { control: 'text' },
		href: { control: 'text' },
		icon: { control: 'text' },
		size: { control: 'select', options: ['md', 'sm'] },
		isActive: { control: 'boolean' }
	},
	args: {
		label: 'Getting started',
		href: '#',
		icon: 'house',
		size: 'md',
		isActive: false
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Active: Story = { args: { isActive: true } };
export const Small: Story = { args: { size: 'sm', label: 'Color', icon: 'drop' } };
export const SmallActive: Story = {
	args: { size: 'sm', label: 'Color', icon: 'drop', isActive: true }
};

export const Sidebar: Story = {
	render: () => html`
		<gv-menu-item label="Getting started" href="#" icon="house"></gv-menu-item>
		<gv-menu-item label="Design tokens" href="#" icon="palette" is-active></gv-menu-item>
		<gv-menu-item size="sm" label="Color" href="#" icon="drop"></gv-menu-item>
		<gv-menu-item size="sm" label="Typography" href="#" icon="text-aa"></gv-menu-item>
		<gv-menu-item size="sm" label="Spacing" href="#" icon="ruler"></gv-menu-item>
		<gv-menu-item label="Components" href="#" icon="cube"></gv-menu-item>
	`
};
