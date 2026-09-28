import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect } from 'storybook/test';
import './Title.js';
import { GROVE_SURFACES } from '../../surfaces.js';
import type { GroveSurface } from '../../surfaces.js';

interface Args {
	heading: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	icon: string;
	surface: GroveSurface;
}

const meta: Meta<Args> = {
	title: 'Components/gv-title',
	tags: ['autodocs'],
	render: ({ heading, level, icon, surface }) => html`
		<gv-title heading=${heading} level=${level} icon=${icon} surface=${surface}></gv-title>
	`,
	argTypes: {
		heading: { control: 'text' },
		level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
		icon: { control: 'text' },
		surface: { control: 'select', options: GROVE_SURFACES }
	},
	args: {
		heading: 'Documentation',
		level: 2,
		icon: 'palette',
		surface: 'ground'
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

/** The heading as content; `level` still picks the heading element. */
export const Slotted: Story = {
	render: ({ level, icon }) =>
		html`<gv-title level=${level} icon=${icon}>Getting started</gv-title>`
};

/** One title per Grove surface, each inside a section painted with the same surface (#36). */
export const Surfaces: Story = {
	render: ({ level, icon }) => html`
		${GROVE_SURFACES.map(
			(surface) => html`
				<section class="gv-surface-${surface}">
					<gv-title heading=${surface} level=${level} icon=${icon} surface=${surface}></gv-title>
				</section>
			`
		)}
	`
};
