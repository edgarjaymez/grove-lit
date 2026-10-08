import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Button.js';
import type { Button } from './Button.js';

interface Args {
	text: string;
	variant: 'filled' | 'tonal' | 'outlined' | 'ghost';
	color: 'accent' | 'gray';
	size: 'lg' | 'md' | 'sm';
	icon: string;
	disabled: boolean;
	type: 'button' | 'submit' | 'reset';
	name: string;
	value: string;
	href: string;
	/** Any browsing context name; the select offers the keywords. */
	target: string;
	rel: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-button',
	tags: ['autodocs'],
	render: ({
		text,
		variant,
		color,
		size,
		icon,
		disabled,
		type,
		name,
		value,
		href,
		target,
		rel
	}) => html`
		<span
			style="background-color: var(--semantic-color-surface-ground); padding: 16px; display: inline-block"
		>
			<gv-button
				text=${text}
				variant=${variant}
				color=${color}
				size=${size}
				icon=${icon}
				?disabled=${disabled}
				type=${type}
				name=${ifDefined(name || undefined)}
				value=${ifDefined(value || undefined)}
				href=${ifDefined(href || undefined)}
				target=${ifDefined(target || undefined)}
				rel=${ifDefined(rel || undefined)}
			></gv-button>
		</span>
	`,
	argTypes: {
		text: { control: 'text' },
		variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'ghost'] },
		color: { control: 'select', options: ['accent', 'gray'] },
		size: { control: 'select', options: ['lg', 'md', 'sm'] },
		icon: { control: 'text' },
		disabled: { control: 'boolean' },
		type: { control: 'select', options: ['button', 'submit', 'reset'] },
		name: { control: 'text' },
		value: { control: 'text' },
		href: { control: 'text' },
		target: { control: 'select', options: ['', '_self', '_blank', '_parent', '_top'] },
		rel: { control: 'text' }
	},
	args: {
		text: 'Button',
		variant: 'filled',
		color: 'accent',
		size: 'md',
		disabled: false,
		type: 'button',
		name: '',
		value: '',
		href: '',
		target: '',
		rel: ''
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Gray: Story = { args: { color: 'gray' } };
export const Large: Story = { args: { size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
export const WithIcon: Story = { args: { icon: 'tree' } };
export const Disabled: Story = { args: { disabled: true } };

/** The text as content: it names the button and is in the server HTML. */
export const Slotted: Story = {
	render: ({ variant, color, size, icon, disabled }) => html`
		<gv-button
			variant=${variant}
			color=${color}
			size=${size}
			icon=${ifDefined(icon || undefined)}
			?disabled=${disabled}
			>Save changes</gv-button
		>
	`
};

/** With href, a real link with the button's look: middle click and the context menu work. */
export const Link: Story = { args: { text: 'Get in touch', href: '#get-in-touch' } };
export const LinkTonal: Story = { args: { ...Link.args, variant: 'tonal' } };
export const LinkOutlined: Story = { args: { ...Link.args, variant: 'outlined' } };
export const LinkGhost: Story = { args: { ...Link.args, variant: 'ghost' } };

/** target="_blank" without rel gets rel="noopener noreferrer". */
export const ExternalLink: Story = {
	args: { text: 'Read the case', href: '#read-the-case', target: '_blank', variant: 'outlined' }
};

/** Rendered without href, out of the tab order, announced as a disabled link. */
export const DisabledLink: Story = { args: { ...Link.args, disabled: true } };

/** Writes a line at the top of the log next to the story's form. */
const log = (from: Element, line: string) => {
	const output = from.closest('.story-form')!.querySelector('output')!;
	output.textContent = `${line}\n${output.textContent}`;
};

/**
 * Handles the submission the common Lit way: cancel it, read the form data at once, send it, and
 * re-enable the button that disabled itself once the request settles (here, a one-second stand-in).
 */
const handleSubmit = (event: SubmitEvent) => {
	event.preventDefault();
	const form = event.target as HTMLFormElement;
	const entries = [...new FormData(form)].map(([key, value]) => `${key}=${value}`);
	log(form, `submit: ${entries.join(', ') || 'no entries'}`);
	setTimeout(() => {
		for (const el of form.elements)
			if (el.matches(':state(submitting)')) (el as Button).disabled = false;
		log(form, 'request settled: button re-enabled');
	}, 1000);
};

const logReset = (event: Event) => log(event.target as Element, 'reset');

const toggleFieldset = (event: Event) => {
	const box = event.target as HTMLInputElement;
	box.closest('.story-form')!.querySelector('fieldset')!.disabled = box.checked;
};

/**
 * type="submit" and "reset" act on the form; "button" does nothing in it. Enter in either field
 * submits through the submit button. A button outside the form joins it with form="id", and a
 * disabled fieldset disables the buttons inside it.
 */
export const InForm: Story = {
	render: () => html`
		<div class="story-form" style="display: grid; gap: var(--soft-grid-12); max-width: 28rem">
			<form id="story-in-form" @submit=${handleSubmit} @reset=${logReset}>
				<fieldset style="display: grid; gap: var(--soft-grid-8)">
					<legend>Contact</legend>
					<label>Name <input name="name" value="Ada" /></label>
					<label>Email <input name="email" type="email" required /></label>
					<div style="display: flex; gap: var(--soft-grid-8); flex-wrap: wrap">
						<gv-button type="submit">Send</gv-button>
						<gv-button type="reset" variant="outlined" color="gray">Clear</gv-button>
						<gv-button variant="ghost" color="gray">Does nothing here</gv-button>
					</div>
				</fieldset>
			</form>
			<gv-button type="submit" form="story-in-form" variant="tonal">Send from outside</gv-button>
			<label><input type="checkbox" @change=${toggleFieldset} /> Disable the fieldset</label>
			<output
				style="white-space: pre-line; font: var(--typography-single-line-label-base)"
			></output>
		</div>
	`
};

/** Each submit button adds its name and value to the form data its own submission builds. */
export const NamedSubmits: Story = {
	render: () => html`
		<div class="story-form" style="display: grid; gap: var(--soft-grid-12); max-width: 28rem">
			<form @submit=${handleSubmit} style="display: grid; gap: var(--soft-grid-8)">
				<label>Title <input name="title" value="Field notes" /></label>
				<div style="display: flex; gap: var(--soft-grid-8)">
					<gv-button type="submit" name="intent" value="draft" variant="tonal"
						>Save draft</gv-button
					>
					<gv-button type="submit" name="intent" value="publish">Publish</gv-button>
				</div>
			</form>
			<output
				style="white-space: pre-line; font: var(--typography-single-line-label-base)"
			></output>
		</div>
	`
};
