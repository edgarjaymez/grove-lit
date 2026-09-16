import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { ColorFamily, ColorShade, ColorText } from './ColorSwatch.js';
import './ColorSwatch.js';

interface Args {
	color: ColorFamily;
	shade: ColorShade;
	name: string;
	text: ColorText;
	oklch: string;
	hex: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-color-swatch',
	tags: ['autodocs'],
	render: ({ color, shade, name, text, oklch, hex }) => html`
		<gv-color-swatch
			color=${color}
			shade=${shade}
			name=${name}
			text=${text}
			oklch=${oklch}
			hex=${hex}
		></gv-color-swatch>
	`,
	argTypes: {
		color: {
			control: 'select',
			options: ['brand', 'accent', 'gray', 'information', 'danger', 'success', 'base']
		},
		shade: {
			control: 'select',
			options: [
				'50',
				'100',
				'200',
				'300',
				'400',
				'500',
				'600',
				'700',
				'800',
				'900',
				'950',
				'light',
				'dark'
			]
		},
		name: { control: 'text' },
		text: { control: 'radio', options: ['dark', 'light'] },
		oklch: { control: 'text' },
		hex: { control: 'text' }
	},
	args: {
		color: 'brand',
		shade: '50',
		name: 'Brand 50',
		text: 'dark',
		oklch: '0.93 0.035 145',
		hex: '#DAEFDA'
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const DarkShade: Story = {
	args: {
		color: 'brand',
		shade: '700',
		name: 'Brand 700',
		text: 'light',
		oklch: '0.38 0.075 145',
		hex: '#214522'
	}
};

export const Accent: Story = {
	args: {
		color: 'accent',
		shade: '200',
		name: 'Accent 200',
		text: 'dark',
		oklch: '0.78 0.1045 322',
		hex: '#E8A8DF'
	}
};

export const Danger: Story = {
	args: {
		color: 'danger',
		shade: '100',
		name: 'Danger 100',
		text: 'dark',
		oklch: '0.88 0.06 22',
		hex: '#F9D4C8'
	}
};

export const BaseDark: Story = {
	args: {
		color: 'base',
		shade: 'dark',
		name: 'Base Dark',
		text: 'light',
		oklch: '0.15 0 0',
		hex: '#0B0B0B'
	}
};

export const BaseLight: Story = {
	args: {
		color: 'base',
		shade: 'light',
		name: 'Base Light',
		text: 'dark',
		oklch: '0.98 0.008 91',
		hex: '#FAF8F2'
	}
};
