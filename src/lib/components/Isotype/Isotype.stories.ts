import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Isotype.js';

interface Args {
	color: 'base' | 'brand' | 'accent';
	size: number;
	tone: 'light' | 'dark';
	label: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-isotype',
	tags: ['autodocs'],
	render: ({ color, size, tone, label }) => {
		const bg =
			tone === 'dark'
				? 'var(--semantic-color-surface-brand-summit)'
				: 'var(--semantic-color-surface-ground)';
		return html`
			<span style="background-color: ${bg}; padding: 16px; display: inline-block">
				<gv-isotype
					color=${color}
					size=${size}
					tone=${tone}
					label=${ifDefined(label || undefined)}
				></gv-isotype>
			</span>
		`;
	},
	argTypes: {
		color: { control: 'select', options: ['base', 'brand', 'accent'] },
		tone: { control: 'select', options: ['light', 'dark'] },
		size: { control: 'number' },
		label: { control: 'text' }
	},
	args: {
		color: 'brand',
		tone: 'light',
		size: 80,
		label: ''
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const BrandDark: Story = { args: { tone: 'dark' } };
export const Accent: Story = { args: { color: 'accent' } };
export const AccentDark: Story = { args: { color: 'accent', tone: 'dark' } };
export const Base: Story = { args: { color: 'base' } };
export const Small: Story = { args: { size: 32 } };
export const Large: Story = { args: { size: 176 } };
export const WithLabel: Story = { args: { label: 'Grove' } };
