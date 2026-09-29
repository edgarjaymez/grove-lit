import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './FeedbackStrip.js';
import type { FeedbackStrip, FeedbackStripLive } from './FeedbackStrip.js';

interface Args {
	type: 'success' | 'danger' | 'information';
	heading: string;
	message: string;
	live?: FeedbackStripLive;
}

const meta: Meta<Args> = {
	title: 'Components/gv-feedback-strip',
	tags: ['autodocs'],
	render: ({ type, heading, message, live }) => html`
		<gv-feedback-strip
			type=${type}
			heading=${heading}
			message=${message}
			live=${ifDefined(live || undefined)}
		></gv-feedback-strip>
	`,
	argTypes: {
		type: { control: 'select', options: ['success', 'danger', 'information'] },
		live: { control: 'select', options: [undefined, 'polite', 'assertive', 'off'] },
		heading: { control: 'text' },
		message: { control: 'text' }
	},
	args: {
		type: 'success',
		heading: 'Changes saved',
		message: 'Your profile was updated.'
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const Danger: Story = {
	args: {
		type: 'danger',
		heading: 'Upload failed',
		message: 'The file exceeds the 10 MB limit.'
	}
};

export const Information: Story = {
	args: {
		type: 'information',
		heading: 'Scheduled maintenance',
		message: 'The service will be unavailable on Sunday from 02:00 to 04:00 UTC.'
	}
};

export const HeadingOnly: Story = {
	args: {
		heading: 'Changes saved',
		message: ''
	}
};

export const LongMessage: Story = {
	args: {
		type: 'information',
		heading: 'Your export is being prepared',
		message:
			'We are gathering every record that matches your filters, which can take a few minutes for large workspaces. You can keep working while this runs. When the archive is ready, we will email a download link to the address on your account, and the link will stay valid for seven days.'
	}
};

export const StaticNotice: Story = {
	args: {
		type: 'information',
		live: 'off',
		heading: 'Not connected yet',
		message: 'The contact form goes live next week.'
	}
};

export const QuietFailure: Story = {
	args: {
		type: 'danger',
		live: 'polite',
		heading: 'Draft not synced',
		message: 'We will retry in a minute.'
	}
};

const OUTCOMES = [
	{ type: 'success', heading: 'Changes saved', message: 'Your profile was updated.' },
	{ type: 'danger', heading: 'Upload failed', message: 'The file exceeds the 10 MB limit.' },
	{ type: 'information', heading: 'Sync paused', message: 'We will resume when you are online.' }
] as const;

/** One connected strip whose text changes from outside it: the manual screen-reader check for #37. */
export const Announce: Story = {
	args: { live: 'polite', heading: 'Nothing yet', message: '' },
	render: ({ live, heading, message }) => {
		let next = 0;
		const announce = (event: Event) => {
			const strip = (event.target as HTMLElement).parentElement!.querySelector(
				'gv-feedback-strip'
			) as FeedbackStrip;
			Object.assign(strip, OUTCOMES[next++ % OUTCOMES.length]);
		};
		return html`
			<div>
				<gv-feedback-strip
					type="information"
					heading=${heading}
					message=${message}
					live=${ifDefined(live || undefined)}
				></gv-feedback-strip>
				<button type="button" @click=${announce}>Change the message</button>
			</div>
		`;
	}
};

/** Heading and message as content, with inline emphasis. */
export const Slotted: Story = {
	render: ({ type, live }) => html`
		<gv-feedback-strip type=${type} live=${ifDefined(live || undefined)}>
			<span slot="heading">Changes saved</span>
			<span slot="message">Your <strong>profile</strong> was updated.</span>
		</gv-feedback-strip>
	`
};
