import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Texture.js';
import type { TextureColor } from './Texture.js';

interface Args {
	opacity: number;
	color?: TextureColor;
	tint?: string;
	frequency?: number;
}

const COLORS: TextureColor[] = ['brand', 'accent', 'gray', 'information', 'danger', 'success'];

const SURFACE_WRAPPER = (
	bg: string,
	{ opacity, color, tint, frequency }: Args,
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
			color=${ifDefined(color)}
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
		color: { control: 'select', options: COLORS },
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

/** A grain in the surface's own colour family instead of the default green (#20, #48). */
export const Tinted: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-accent-terrace)', args),
	args: { opacity: 0.55, color: 'accent' }
};

/** Every colour family on its own terrace, as the Figma variants. Switch the toolbar to Dark for the night tones. */
export const Colors: Story = {
	render: ({ opacity, frequency }) => html`
		<div
			style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--soft-grid-4); margin: var(--soft-grid-8)"
		>
			${COLORS.map(
				(color) => html`
					<div
						style="position: relative; overflow: hidden; height: 10rem; border-radius: var(--border-radius-2xl); background-color: var(--semantic-color-surface-${color}-terrace)"
					>
						<gv-texture
							opacity=${opacity}
							color=${color}
							frequency=${ifDefined(frequency)}
						></gv-texture>
					</div>
				`
			)}
		</div>
	`,
	args: { opacity: 0.55 }
};

/** A one-off tint from Grove tokens, paired in light-dark() so it changes with the theme. */
export const CustomTint: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-accent-terrace)', args),
	args: {
		opacity: 0.55,
		tint: 'light-dark(color-mix(in srgb, var(--color-accent-800) 12%, transparent), color-mix(in srgb, var(--color-accent-100) 12%, transparent))'
	}
};

/** The coarse grain for dark, low-detail scenes (#20). Switch the toolbar to Dark to see it at night. */
export const Coarse: Story = {
	render: (args) => SURFACE_WRAPPER('var(--semantic-color-surface-ground)', args),
	args: { opacity: 0.6, frequency: 0.12 }
};
