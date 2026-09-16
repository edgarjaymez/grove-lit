import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './BackButton.js';

interface Args {
	label: string;
	icon: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-back-button',
	tags: ['autodocs'],
	render: ({ label, icon }) => html`<gv-back-button label=${label} icon=${icon}></gv-back-button>`,
	argTypes: {
		label: { control: 'text' },
		icon: { control: 'text' }
	},
	args: {
		label: 'Go back',
		icon: 'arrow-left'
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The tile grows from 92×92 to 92×108 at viewport widths ≥ 1280px.'
			}
		}
	}
};

export const CustomIcon: Story = {
	args: { icon: 'caret-left' }
};

export const LogsBackEvent: Story = {
	render: () => html`
		<div>
			<gv-back-button
				@back=${(event: Event) => {
					event.preventDefault();
					const output = (event.currentTarget as HTMLElement).nextElementSibling;
					if (output) output.textContent = 'back event fired';
				}}
			></gv-back-button>
			<p>&nbsp;</p>
		</div>
	`
};
