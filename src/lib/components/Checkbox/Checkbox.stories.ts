import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './Checkbox.js';

interface Args {
	checked: boolean;
	responsive: 'default' | 'xl';
	disabled: boolean;
	text: string;
	label: string;
	description: string;
}

const surface =
	'background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block';

const meta: Meta<Args> = {
	title: 'Components/gv-checkbox',
	tags: ['autodocs'],
	render: ({ checked, responsive, disabled, text, label, description }) => html`
		<span style=${surface}>
			<gv-checkbox
				?checked=${checked}
				responsive=${responsive}
				?disabled=${disabled}
				label=${label}
				description=${description}
				>${text}</gv-checkbox
			>
		</span>
	`,
	argTypes: {
		responsive: { control: 'select', options: ['default', 'xl'] },
		checked: { control: 'boolean' },
		disabled: { control: 'boolean' },
		text: {
			control: 'text',
			description: 'Slotted label text (the default slot): shown, and the name'
		},
		label: { control: 'text', description: 'The name when no text is slotted. Never shown.' },
		description: { control: 'text', description: 'Read after the name. Never shown.' }
	},
	args: {
		checked: false,
		responsive: 'default',
		disabled: false,
		text: '',
		label: 'Subscribe to the newsletter',
		description: ''
	}
};
export default meta;

type Story = StoryObj<Args>;

/** The bare box, named by `label`. */
export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const XL: Story = { args: { responsive: 'xl' } };
export const XLChecked: Story = { args: { responsive: 'xl', checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, checked: true } };
/** The slotted text shows next to the box, names the checkbox, and toggles it on click. */
export const Labelled: Story = { args: { text: 'Subscribe to the newsletter', label: '' } };
export const LabelledXL: Story = {
	args: { text: 'Subscribe to the newsletter', label: '', responsive: 'xl' }
};

/**
 * A page `<label>`, wrapping or pointing at the id, names the checkbox and toggles it on click. Use it
 * when the text needs a link, which the slot inside the control can't hold.
 */
export const PageLabel: Story = {
	render: () => html`
		<div style="${surface}; display: grid; gap: 12px">
			<span style="display: flex; align-items: center; gap: 8px">
				<gv-checkbox id="story-terms"></gv-checkbox>
				<label for="story-terms"
					>I agree to the <a href="#terms" style="color: inherit">terms and conditions</a></label
				>
			</span>
			<label style="display: flex; align-items: center; gap: 8px">
				<gv-checkbox></gv-checkbox>
				Remember this device
			</label>
		</div>
	`
};

/** With `name`, a checked box submits `value`; Reset restores the state it first connected with. */
export const InForm: Story = {
	render: () => html`
		<form
			style="${surface}; display: grid; gap: 12px; justify-items: start"
			@submit=${(e: SubmitEvent) => {
				e.preventDefault();
				const form = e.target as HTMLFormElement;
				const entries = [...new FormData(form).entries()].map(([k, v]) => `${k}=${v}`);
				form.querySelector('output')!.value = entries.join(', ') || '(nothing)';
			}}
		>
			<gv-checkbox name="newsletter" value="weekly" checked>Weekly newsletter</gv-checkbox>
			<gv-checkbox name="offers">Offers</gv-checkbox>
			<span style="display: flex; gap: 8px">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</span>
			<output aria-live="polite"></output>
		</form>
	`
};
