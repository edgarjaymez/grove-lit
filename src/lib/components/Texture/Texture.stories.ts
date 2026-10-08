import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Texture.js';

interface Args {
	opacity: number;
	tint?: string;
	frequency?: number;
}

const SURFACE_WRAPPER = (
	bg: string,
	{ opacity, tint, frequency }: Args,
	content: TemplateResult | typeof nothing = nothing
) => html`
	<div
		style="
			height: calc(100svh - var(--soft-grid-8) * 2);
			margin: var(--soft-grid-8);
			padding: var(--grid-landing-margin);
			border-radius: var(--border-radius-2xl);
			background-color: ${bg};
			position: relative;
			overflow: hidden;
		"
	>
		<gv-texture
			opacity=${opacity}
			tint=${ifDefined(tint || undefined)}
			frequency=${ifDefined(frequency)}
		></gv-texture>
		${content}
	</div>
`;

const meta: Meta<Args> = {
	title: 'Components/gv-texture',
	tags: ['autodocs'],
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-brand-summit)', args),
	argTypes: {
		opacity: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
		tint: { control: 'text' },
		frequency: { control: { type: 'range', min: 0.05, max: 0.5, step: 0.01 } }
	},
	args: { opacity: 1 }
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const OnTerrace: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-accent-terrace)', args),
	args: { opacity: 0.4 }
};

export const OnGround: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-ground)', args),
	args: { opacity: 0.25 }
};

/** Content is positioned and follows the texture, so it paints above the grain (#32). */
export const WithContent: Story = {
	render: (args) =>
		SURFACE_WRAPPER(
			'var(--semantic-color-surface-brand-summit)',
			args,
			html`<div
				style="position: relative; color: var(--semantic-color-text-on-brand-summit-base); letter-spacing: var(--letter-spacing-base)"
			>
				<h2
					style="font: var(--typography-single-line-heading-emphasis); letter-spacing: var(--typography-single-line-heading-emphasis-letter-spacing)"
				>
					Grain behind content
				</h2>
				<p
					style="font: var(--typography-multi-line-base-base); letter-spacing: var(--typography-multi-line-base-base-letter-spacing)"
				>
					Positioned content placed after the texture paints above it.
					<a href="#" style="color: inherit">A link stays clickable.</a>
				</p>
			</div>`
		)
};

/** A grain in the surface's own colour family instead of the default green (#20). */
export const Tinted: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-accent-terrace)', args),
	args: {
		opacity: 0.55,
		tint: 'color-mix(in srgb, var(--color-accent-700) 12%, transparent)'
	}
};

/** The coarse grain for dark, low-detail scenes (#20). Switch the toolbar to Dark to see it at night. */
export const Coarse: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-ground)', args),
	args: { opacity: 0.6, frequency: 0.12 }
};
