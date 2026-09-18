import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../Tooltip/Tooltip.js';
import { componentReset } from '../../styles/component-reset.js';

export type ColorFamily =
	| 'brand'
	| 'accent'
	| 'gray'
	| 'information'
	| 'danger'
	| 'success'
	| 'base';
export type ColorShade =
	| '50'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900'
	| '950'
	| 'light'
	| 'dark';
export type ColorText = 'dark' | 'light';
export type ColorSpace = 'oklch' | 'hex';

/** Detail carried by the `gv-copy` CustomEvent. */
export interface ColorSwatchCopyDetail {
	space: ColorSpace;
	value: string;
}

/** Leading numeric part of a CSS component token — "145deg" -> 145, "93%" -> 93. */
const LEADING_NUMBER = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?/i;

function parseComponent(token: string): number | null {
	const match = LEADING_NUMBER.exec(token);
	if (!match) return null;

	const value = Number(match[0]);
	return Number.isFinite(value) ? value : null;
}

/**
 * Parse `oklch(L C H)` — or the bare `L C H` body the swatch is normally given —
 * into DTCG components. A percentage lightness becomes its 0–1 fraction. Returns
 * null when the string is not readable, so the caller can fall back.
 */
function parseOklch(raw: string): [number, number, number] | null {
	const body = raw
		.trim()
		.replace(/^oklch\s*\(/i, '')
		.replace(/\)$/, '')
		.split('/')[0];
	const parts = body
		.trim()
		.split(/[\s,]+/)
		.filter(Boolean);
	if (parts.length < 3) return null;

	const lightness = parseComponent(parts[0]);
	const chroma = parseComponent(parts[1]);
	const hue = parseComponent(parts[2]);
	if (lightness === null || chroma === null || hue === null) return null;

	return [parts[0].endsWith('%') ? lightness / 100 : lightness, chroma, hue];
}

@customElement('gv-color-swatch')
export class ColorSwatch extends LitElement {
	@property({ type: String }) color: ColorFamily = 'brand';
	@property({ type: String }) shade: ColorShade = '50';
	@property({ type: String }) name = '';
	@property({ type: String }) text: ColorText = 'dark';
	@property({ type: String }) oklch = '';
	@property({ type: String }) hex = '';

	static styles = [
		componentReset,
		css`
			:host {
				display: block;
			}

			.swatch {
				display: flex;
				flex-direction: column;
				gap: var(--soft-grid-16);
				width: 9rem;
			}

			.visualizer {
				height: 9rem;
				width: 100%;
				overflow: hidden;
				padding: var(--soft-grid-8);
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				box-sizing: border-box;
			}

			.name {
				font: var(--typography-single-line-base-base);
				letter-spacing: var(--letter-spacing-base);
				white-space: nowrap;
			}

			.name--dark {
				color: var(--color-base-dark);
			}

			.name--light {
				color: var(--color-base-light);
			}

			/* Anchors the hex bubble, which is pinned outside the column. */
			.color-spaces {
				display: flex;
				flex-direction: column;
				gap: var(--soft-grid-4);
				position: relative;
			}

			/* Anchors the oklch bubble, which is pinned over the value row. */
			.oklch-row {
				position: relative;
			}

			.oklch-group {
				display: flex;
				flex-direction: column;
				gap: var(--soft-grid-0);
				width: 100%;
				padding: var(--soft-grid-0);
				border: none;
				background: none;
				text-align: left;
				overflow: visible;
				cursor: pointer;
			}

			.oklch-label,
			.oklch-value {
				font: var(--typography-single-line-label-emphasis);
				letter-spacing: var(--letter-spacing-base);
				color: var(--semantic-color-text-on-ground-base);
				white-space: nowrap;
			}

			.hex-value {
				font: var(--typography-single-line-caption-base);
				letter-spacing: var(--letter-spacing-base);
				color: var(--semantic-color-text-on-ground-subtle);
				white-space: nowrap;
				width: 100%;
				padding: var(--soft-grid-0);
				border: none;
				background: none;
				text-align: left;
				overflow: visible;
				cursor: pointer;
			}

			/* visibility: hidden also keeps the bubble out of the a11y tree. */
			.tip {
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
			}

			.tip--oklch {
				position: absolute;
				left: calc(var(--soft-grid-80) + var(--soft-grid-10));
				top: var(--soft-grid-6);
			}

			.tip--hex {
				position: absolute;
				left: calc(-1 * (var(--soft-grid-56) + var(--soft-grid-6)));
				top: calc(var(--soft-grid-32) + var(--soft-grid-2));
			}

			.oklch-group:hover ~ .tip--oklch,
			.oklch-group:focus-visible ~ .tip--oklch,
			.oklch-group:focus-within ~ .tip--oklch,
			.hex-value:hover ~ .tip--hex,
			.hex-value:focus-visible ~ .tip--hex,
			.hex-value:focus-within ~ .tip--hex {
				opacity: 1;
				visibility: visible;
			}
		`
	];

	/** The DTCG (W3C Design Tokens) colour object for this swatch, 2-space indented. */
	private toDtcgColor(): string {
		const components = parseOklch(this.oklch);
		if (!components) return this.oklch.trim();

		const token: {
			colorSpace: string;
			components: number[];
			alpha: number;
			hex?: string;
		} = { colorSpace: 'oklch', components, alpha: 1 };

		const hex = this.hex.trim();
		if (hex) token.hex = hex;

		return JSON.stringify(token, null, 2);
	}

	private async copy(space: ColorSpace, value: string) {
		if (!value) return;

		const clipboard = navigator.clipboard as Clipboard | undefined;
		if (typeof clipboard?.writeText !== 'function') return;

		try {
			await clipboard.writeText(value);
		} catch {
			// Insecure origin or denied permission — stay quiet, never throw.
			return;
		}

		this.dispatchEvent(
			new CustomEvent<ColorSwatchCopyDetail>('gv-copy', {
				detail: { space, value },
				bubbles: true,
				composed: true
			})
		);
	}

	private onCopyOklch() {
		void this.copy('oklch', this.toDtcgColor());
	}

	private onCopyHex() {
		void this.copy('hex', this.hex.trim());
	}

	render() {
		return html`
			<div class="swatch">
				<div
					class="visualizer"
					style=${styleMap({ 'background-color': `var(--color-${this.color}-${this.shade})` })}
				>
					<p class="name name--${this.text}">${this.name}</p>
				</div>
				<div class="color-spaces">
					<div class="oklch-row">
						<button
							type="button"
							class="oklch-group"
							aria-label="Copy oklch value"
							aria-describedby="oklch-tip"
							@click=${this.onCopyOklch}
						>
							<span class="oklch-label">oklch</span>
							<span class="oklch-value">${this.oklch}</span>
						</button>
						<gv-tooltip
							id="oklch-tip"
							class="tip tip--oklch"
							type="simple"
							color="accent"
							icon="copy"
							message="Copy"
						></gv-tooltip>
					</div>
					<button
						type="button"
						class="hex-value"
						aria-label="Copy hex value"
						aria-describedby="hex-tip"
						@click=${this.onCopyHex}
					>
						${this.hex}
					</button>
					<gv-tooltip
						id="hex-tip"
						class="tip tip--hex"
						type="simple"
						color="gray"
						icon="copy"
						message="Copy"
					></gv-tooltip>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-color-swatch': ColorSwatch;
	}
}
