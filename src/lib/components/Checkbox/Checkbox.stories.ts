import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './Checkbox.ts';

interface Args {
	checked: boolean;
	responsive: 'default' | 'xl';
	disabled: boolean;
	label: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-checkbox',
	tags: ['autodocs'],
	render: ({ checked, responsive, disabled, label }) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block"
		>
			<gv-checkbox ?checked=${checked} responsive=${responsive} ?disabled=${disabled}
				>${label}</gv-checkbox
			>
		</span>
	`,
	argTypes: {
		responsive: { control: 'select', options: ['default', 'xl'] },
		checked: { control: 'boolean' },
		disabled: { control: 'boolean' },
		label: { control: 'text', description: 'Slotted label text (the default slot)' }
	},
	args: {
		checked: false,
		responsive: 'default',
		disabled: false,
		label: ''
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const XL: Story = { args: { responsive: 'xl' } };
export const XLChecked: Story = { args: { responsive: 'xl', checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, checked: true } };
/** The slotted text shows next to the box, names the checkbox, and toggles it on click. */
export const Labelled: Story = { args: { label: 'Subscribe to the newsletter' } };
export const LabelledXL: Story = {
	args: { label: 'Subscribe to the newsletter', responsive: 'xl' }
};
