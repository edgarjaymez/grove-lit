import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { action } from 'storybook/actions';
import { expect, waitFor } from 'storybook/test';
import type { ColorFamily, ColorShade, ColorText } from './ColorSwatch.js';
import './ColorSwatch.js';

/** Logs the gv-copy CustomEvent (detail: { space, value }) into the Actions panel. */
const logCopy = action('gv-copy');

interface Args {
	color: ColorFamily;
	shade: ColorShade;
	name: string;
	text: ColorText;
	oklch: string;
	hex: string;
}

/**
 * Both tooltips float to the left of the column — 62px out for "Copy", 75px for
 * the wider "Copied!" — so reserve an 80px gutter or the confirmation clips.
 */
const meta: Meta<Args> = {
	title: 'Components/gv-color-swatch',
	tags: ['autodocs'],
	render: ({ color, shade, name, text, oklch, hex }) => html`
		<div style="padding-left: var(--soft-grid-80)">
			<gv-color-swatch
				color=${color}
				shade=${shade}
				name=${name}
				text=${text}
				oklch=${oklch}
				hex=${hex}
				@gv-copy=${logCopy}
			></gv-color-swatch>
		</div>
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

async function swatchShadow(canvasElement: HTMLElement): Promise<ShadowRoot> {
	const swatch = canvasElement.querySelector('gv-color-swatch');
	if (!swatch) throw new Error('gv-color-swatch did not render');

	await swatch.updateComplete;
	if (!swatch.shadowRoot) throw new Error('gv-color-swatch has no shadow root');

	return swatch.shadowRoot;
}

function required<T extends HTMLElement>(root: ShadowRoot, selector: string): T {
	const element = root.querySelector<T>(selector);
	if (!element) throw new Error(`gv-color-swatch is missing ${selector}`);

	return element;
}

/** Focus the copy button, assert its bubble appears, activate it, then blur and assert it hides. */
async function exerciseCopyRow(canvasElement: HTMLElement, button: string, tip: string) {
	const shadow = await swatchShadow(canvasElement);
	const trigger = required<HTMLButtonElement>(shadow, button);
	const bubble = required(shadow, tip);

	await expect(getComputedStyle(bubble).visibility).toBe('hidden');

	trigger.focus();
	await waitFor(() => expect(getComputedStyle(bubble).visibility).toBe('visible'));

	trigger.click();

	trigger.blur();
	await waitFor(() => expect(getComputedStyle(bubble).visibility).toBe('hidden'));
}

/**
 * Storybook may run where the real clipboard is unavailable or permission-blocked,
 * and the component swallows that by design — so the confirmation would never
 * appear. Swap in a resolving writeText for the duration of the assertion.
 */
async function withStubbedClipboard(run: () => Promise<void>): Promise<string[]> {
	const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
	const writes: string[] = [];

	Object.defineProperty(navigator, 'clipboard', {
		configurable: true,
		value: {
			writeText: async (text: string) => {
				writes.push(text);
			}
		}
	});

	try {
		await run();
	} finally {
		if (original) Object.defineProperty(navigator, 'clipboard', original);
		else Reflect.deleteProperty(navigator, 'clipboard');
	}

	return writes;
}

/** Copy a row, assert it confirms, then assert the hold returns it to default. */
async function exerciseCopiedState(canvasElement: HTMLElement, button: string, tip: string) {
	const shadow = await swatchShadow(canvasElement);
	const trigger = required<HTMLButtonElement>(shadow, button);
	const bubble = required(shadow, tip);

	const writes = await withStubbedClipboard(async () => {
		trigger.focus();
		await waitFor(() => expect(getComputedStyle(bubble).visibility).toBe('visible'));
		await expect(bubble.getAttribute('message')).toBe('Copy');

		trigger.click();

		await waitFor(() => expect(bubble.getAttribute('message')).toBe('Copied!'));
		await expect(bubble.hasAttribute('is-pressed')).toBe(true);
	});

	await expect(writes).toHaveLength(1);

	// Figma holds the confirmation for 3s, then returns the swatch to default —
	// the bubble goes down rather than reverting to the "Copy" hint in place.
	await waitFor(() => expect(getComputedStyle(bubble).visibility).toBe('hidden'), {
		timeout: 4000
	});
	await expect(bubble.getAttribute('message')).toBe('Copied!');
}

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

export const OklchCopyFocused: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Keyboard path for the OKLCH row: focusing the button reveals the accent bubble off the left edge of the column, activating it copies the DTCG colour object, and blurring hides the bubble again. Hovering the row does the same with a pointer. A successful copy logs gv-copy in the Actions panel — the clipboard write is guarded, so a blocked clipboard simply produces no event.'
			}
		}
	},
	play: async ({ canvasElement }) => {
		await exerciseCopyRow(canvasElement, '.oklch-group', '.tip--oklch');
	}
};

export const HexCopyFocused: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Keyboard path for the hex row: focusing the button reveals the gray bubble pinned to the left of the column, activating it copies the plain #rrggbb string, and blurring hides the bubble again. A successful copy logs gv-copy in the Actions panel.'
			}
		}
	},
	play: async ({ canvasElement }) => {
		await exerciseCopyRow(canvasElement, '.hex-value', '.tip--hex');
	}
};

export const OklchCopied: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The full confirmation cycle on the OKLCH row. A successful copy flips the accent bubble to "Copied!" and sets is-pressed, dropping its summit shadow so it reads as pushed down against the surface. The bubble is wider in this state and grows leftward, ending 8px clear of the column either way. Three seconds later the swatch returns to its default state — the bubble fades out still reading "Copied!" rather than reverting to the hint in place, and stays down until the pointer or focus leaves and comes back.'
			}
		}
	},
	play: async ({ canvasElement }) => {
		await exerciseCopiedState(canvasElement, '.oklch-group', '.tip--oklch');
	}
};

export const HexCopied: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The same confirmation cycle on the hex row, in gray. Copying the plain #rrggbb string flips the bubble to "Copied!", drops its shadow, and dismisses it after the three-second hold.'
			}
		}
	},
	play: async ({ canvasElement }) => {
		await exerciseCopiedState(canvasElement, '.hex-value', '.tip--hex');
	}
};
