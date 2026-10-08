import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentReset } from '../../styles/component-reset.js';
import type { GroveTrack } from '../../surfaces.js';

export type TextureColor = GroveTrack;

const DEFAULT_FREQUENCY = 0.25;

const night = (track: TextureColor, fallback: string) =>
	`color-mix(in srgb, var(--color-${track}-50, ${fallback}) 10%, transparent)`;

/**
 * The Figma Texture `color` variants. By day, {track}/700 at 10 %: Figma's own values, kept literal
 * because they are also the fallback where light-dark() and color-mix() are missing. At night,
 * {track}/50 at 10 %, the dark-theme rule in DESIGN_SYSTEM.md.
 */
const GRAIN: Record<TextureColor, { day: string; night: string }> = {
	accent: { day: 'rgba(98, 24, 122, 0.1)', night: night('accent', 'oklch(92.52% 0.066 325)') },
	brand: { day: 'rgba(38, 77, 40, 0.1)', night: night('brand', 'oklch(93% 0.035 145)') },
	danger: { day: 'rgba(128, 4, 26, 0.1)', night: night('danger', 'oklch(91.75% 0.0421 23.14)') },
	gray: { day: 'rgba(70, 66, 61, 0.1)', night: night('gray', 'oklch(93% 0.006 70)') },
	information: {
		day: 'rgba(0, 72, 113, 0.1)',
		night: night('information', 'oklch(92.57% 0.0498 223)')
	},
	success: { day: 'rgba(0, 82, 56, 0.1)', night: night('success', 'oklch(93% 0.06 168)') }
};

@customElement('gv-texture')
export class Texture extends LitElement {
	@property({ type: Number }) opacity = 1;
	/** The grain's colour family, as Figma's `color` variant. Anything else means brand. */
	@property({ type: String }) color: TextureColor = 'brand';
	/** Any CSS colour, including `var()` and `light-dark()`; overrides `color` in every theme. */
	@property({ type: String, reflect: true }) tint?: string;
	/** The noise `baseFrequency`: lower is coarser. Anything but a positive number means 0.25. */
	@property({ type: Number, reflect: true }) frequency?: number;

	static styles = [
		componentReset,
		css`
			:host {
				display: block;
				position: absolute;
				inset: 0;
				pointer-events: none;
				overflow: hidden;
				z-index: 0;
			}

			/* The grain is painted with currentColor: the tint on feFlood, else the colour's theme default
			   here. A tint that is invalid, even at computed-value time (var(--missing)), inherits the
			   default instead of turning black, because color is an inherited property. */
			svg {
				display: block;
				width: 100%;
				height: 100%;
				color: var(--_grain-day);
			}

			@supports (color: light-dark(#000, #fff)) {
				svg {
					color: light-dark(var(--_grain-day), var(--_grain-night));
				}
			}
		`
	];

	/**
	 * The tint if the browser parses it as a colour. styleMap edits the live declaration, and an
	 * invalid assignment is ignored there, so passing one on would keep the previous tint.
	 */
	private get _validTint() {
		const tint = this.tint;
		if (!tint) return undefined;
		return typeof CSS === 'undefined' || CSS.supports('color', tint) ? tint : undefined;
	}

	render() {
		const frequency =
			typeof this.frequency === 'number' && this.frequency > 0 ? this.frequency : DEFAULT_FREQUENCY;
		const grain = Object.hasOwn(GRAIN, this.color) ? GRAIN[this.color] : GRAIN.brand;
		return html`
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				aria-hidden="true"
				style=${styleMap({
					opacity: String(this.opacity),
					'--_grain-day': grain.day,
					'--_grain-night': grain.night
				})}
			>
				<g filter="url(#grove-noise)">
					<rect width="100%" height="100%" fill="black" />
				</g>
				<defs>
					<filter
						id="grove-noise"
						x="0"
						y="0"
						width="100%"
						height="100%"
						filterUnits="userSpaceOnUse"
						color-interpolation-filters="sRGB"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feTurbulence
							type="fractalNoise"
							baseFrequency="${frequency} ${frequency}"
							stitchTiles="stitch"
							numOctaves="3"
							result="noise"
							seed="7165"
						/>
						<feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
						<feComponentTransfer in="alphaNoise" result="coloredNoise1">
							<feFuncA
								type="discrete"
								tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
							/>
						</feComponentTransfer>
						<feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
						<feFlood
							flood-color="currentColor"
							style=${styleMap({ color: this._validTint })}
							result="color1Flood"
						/>
						<feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
						<feMerge>
							<feMergeNode in="color1" />
						</feMerge>
					</filter>
				</defs>
			</svg>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-texture': Texture;
	}
}
