import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './FeedbackStrip.js';

interface Args {
	type: 'success' | 'danger' | 'information';
	heading: string;
	message: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-feedback-strip',
	tags: ['autodocs'],
	render: ({ type, heading, message }) => html`
		<gv-feedback-strip type=${type} heading=${heading} message=${message}></gv-feedback-strip>
	`,
	argTypes: {
		type: { control: 'select', options: ['success', 'danger', 'information'] },
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
