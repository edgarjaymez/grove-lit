import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import './Title.js';

interface Args {
	heading: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	icon: string;
}

const meta: Meta<Args> = {
	title: 'Components/gv-title',
	tags: ['autodocs'],
	render: ({ heading, level, icon }) => html`
		<gv-title heading=${heading} level=${level} icon=${icon}></gv-title>
	`,
	argTypes: {
		heading: { control: 'text' },
		level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
		icon: { control: 'text' }
	},
	args: {
		heading: 'Documentation',
		level: 2,
		icon: 'palette'
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Level1: Story = { args: { level: 1 } };
export const Level3: Story = { args: { level: 3 } };
export const NoIcon: Story = { args: { icon: '' } };

/** Every rendered line of the heading, and the icon, lie inside the block, which does not overflow. */
const assertNothingClipped = async (canvasElement: HTMLElement) => {
	const title = canvasElement.querySelector('gv-title')!;
	await title.updateComplete;
	const block = title.shadowRoot!.querySelector<HTMLElement>('.title')!;
	const box = block.getBoundingClientRect();
	const heading = title.shadowRoot!.querySelector('.title__heading')!;
	const range = document.createRange();
	range.selectNodeContents(heading);
	const icon = title.shadowRoot!.querySelector('gv-icon');
	const rects = [...range.getClientRects(), ...(icon ? [icon.getBoundingClientRect()] : [])];
	for (const rect of rects) {
		expect(rect.left).toBeGreaterThanOrEqual(box.left - 0.5);
		expect(rect.right).toBeLessThanOrEqual(box.right + 0.5);
	}
	expect(block.scrollWidth).toBeLessThanOrEqual(block.clientWidth);
};

const NARROW = (story: () => unknown) => html`<div style="width: 320px">${story()}</div>`;

export const LongHeading: Story = {
	args: { heading: 'Getting started with the Grove design system' },
	play: ({ canvasElement }) => assertNothingClipped(canvasElement)
};

export const Narrow: Story = {
	decorators: [NARROW],
	play: ({ canvasElement }) => assertNothingClipped(canvasElement)
};

export const NarrowNoIcon: Story = {
	args: { icon: '' },
	decorators: [NARROW],
	play: ({ canvasElement }) => assertNothingClipped(canvasElement)
};
