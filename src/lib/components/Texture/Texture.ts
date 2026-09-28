import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentReset } from '../../styles/component-reset.js';

const DEFAULT_FREQUENCY = 0.25;

/**
 * @cssprop --gv-texture-tint - Tints every gv-texture below the element that sets it; a `tint` attribute wins.
 */
@customElement('gv-texture')
export class Texture extends LitElement {
	@property({ type: Number }) opacity = 1;
	/** Any CSS colour, including `var()` and `light-dark()`. Unset, the grain follows the theme. */
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

			/* The grain is painted with currentColor, resolved in three steps: the per-instance tint on
			   feFlood, then --gv-texture-tint on the filter, then the theme default here. A colour that
			   is invalid at any step, even at computed-value time (var(--missing)), inherits the next
			   one instead of turning black, because color is an inherited property. */
			svg {
				display: block;
				width: 100%;
				height: 100%;
				color: rgba(38, 77, 40, 0.1);
			}

			@supports (color: light-dark(#000, #fff)) {
				svg {
					color: light-dark(
						rgba(38, 77, 40, 0.1),
						color-mix(in srgb, var(--color-brand-50, oklch(93% 0.035 145)) 10%, transparent)
					);
				}
			}

			filter {
				color: var(--gv-texture-tint);
			}
		`
	];

	render() {
		const frequency =
			typeof this.frequency === 'number' && this.frequency > 0 ? this.frequency : DEFAULT_FREQUENCY;
		return html`
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				aria-hidden="true"
				style="opacity: ${this.opacity}"
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
							style=${styleMap({ color: this.tint || undefined })}
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
