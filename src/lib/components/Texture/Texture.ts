import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentReset } from '../../styles/component-reset.js';

@customElement('gv-texture')
export class Texture extends LitElement {
	@property({ type: Number }) opacity = 1;

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

			svg {
				display: block;
				width: 100%;
				height: 100%;
			}
		`
	];

	render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" style="opacity: ${this.opacity}">
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
							baseFrequency="0.25 0.25"
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
						<feFlood flood-color="rgba(38, 77, 40, 0.1)" result="color1Flood" />
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
