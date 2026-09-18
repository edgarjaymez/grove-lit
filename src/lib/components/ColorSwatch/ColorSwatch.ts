import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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

/**
 * How long the "Copied!" confirmation holds before the swatch returns to its
 * default state. Figma pins an AFTER_TIMEOUT of 3s on both copied variants,
 * each routed back to the default variant — not back to the "Copy" hint.
 */
const COPIED_HOLD_MS = 3000;

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

	/** Which row is showing its "Copied!" confirmation, if any. */
	@state() private copied: ColorSpace | null = null;
	/**
	 * Which row has had its bubble dismissed by the hold expiring. Suppresses the
	 * hover reveal so the swatch stays in its default state until the pointer (or
	 * focus) leaves and comes back — otherwise the CSS reveal would immediately
	 * pop "Copy" back up under a pointer that never moved.
	 */
	@state() private dismissed: ColorSpace | null = null;

	private resetTimer?: ReturnType<typeof setTimeout>;

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

			/* visibility: hidden also keeps the bubble out of the a11y tree.
			   Figma returns a copied swatch to its default state with a 0.3s
			   EASE_OUT, which is the direction this base rule animates. */
			.tip {
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
				transition:
					opacity 300ms ease-out,
					visibility 0s linear 300ms;
			}

			/* Both bubbles hang off the left edge of the column with their right
			   edge 8px clear of it, so each grows leftward as its text widens —
			   "Copy" is 54px, "Copied!" 67px, and both end at the same -8px. */
			.tip--oklch,
			.tip--hex {
				position: absolute;
				right: calc(100% + var(--soft-grid-8));
			}

			.tip--oklch {
				top: var(--soft-grid-6);
			}

			.tip--hex {
				top: calc(var(--soft-grid-32) + var(--soft-grid-2));
			}

			/* Revealing is the 0.3s EASE_IN_AND_OUT half of the same pair. */
			.oklch-group:hover ~ .tip--oklch,
			.oklch-group:focus-visible ~ .tip--oklch,
			.oklch-group:focus-within ~ .tip--oklch,
			.hex-value:hover ~ .tip--hex,
			.hex-value:focus-visible ~ .tip--hex,
			.hex-value:focus-within ~ .tip--hex {
				opacity: 1;
				visibility: visible;
				transition:
					opacity 300ms ease-in-out,
					visibility 0s;
			}

			/* Once the hold expires the swatch is back to its default state, so the
			   bubble stays down even though the pointer never left. Identical
			   specificity to the reveal above — source order decides, keep last. */
			.color-spaces[data-dismissed='oklch'] .tip--oklch,
			.color-spaces[data-dismissed='hex'] .tip--hex {
				opacity: 0;
				visibility: hidden;
				transition:
					opacity 300ms ease-out,
					visibility 0s linear 300ms;
			}

			.sr-only {
				position: absolute;
				width: 1px;
				height: 1px;
				margin: -1px;
				padding: 0;
				overflow: hidden;
				clip-path: inset(50%);
				white-space: nowrap;
				border: 0;
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

		this.confirm(space);

		this.dispatchEvent(
			new CustomEvent<ColorSwatchCopyDetail>('gv-copy', {
				detail: { space, value },
				bubbles: true,
				composed: true
			})
		);
	}

	/**
	 * Flip the row's bubble to its confirmation, then dismiss it once the hold
	 * expires. `copied` is deliberately left set when the timer fires so the
	 * bubble fades out still reading "Copied!" rather than flickering back to
	 * "Copy" mid-fade; both fields clear together in `reset`.
	 */
	private confirm(space: ColorSpace) {
		this.copied = space;
		this.dismissed = null;

		clearTimeout(this.resetTimer);
		this.resetTimer = setTimeout(() => {
			this.dismissed = space;
		}, COPIED_HOLD_MS);
	}

	/**
	 * Entering or leaving the column returns the swatch to its default state,
	 * re-arming the hover reveal. Entry resets too, not just exit: a pointer that
	 * leaves while the clipboard write is still in flight would otherwise come
	 * back to a stale confirmation, or to a `dismissed` flag that swallows the
	 * next reveal entirely. Focus mirrors the pointer for keyboard parity.
	 */
	private reset() {
		clearTimeout(this.resetTimer);
		this.resetTimer = undefined;
		this.copied = null;
		this.dismissed = null;
	}

	disconnectedCallback() {
		clearTimeout(this.resetTimer);
		this.resetTimer = undefined;
		super.disconnectedCallback();
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
				<div
					class="color-spaces"
					data-dismissed=${ifDefined(this.dismissed ?? undefined)}
					@pointerenter=${this.reset}
					@pointerleave=${this.reset}
					@focusin=${this.reset}
					@focusout=${this.reset}
				>
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
							?is-pressed=${this.copied === 'oklch'}
							message=${this.copied === 'oklch' ? 'Copied!' : 'Copy'}
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
						?is-pressed=${this.copied === 'hex'}
						message=${this.copied === 'hex' ? 'Copied!' : 'Copy'}
					></gv-tooltip>
				</div>
				<p class="sr-only" role="status" aria-live="polite">
					${this.copied ? `Copied ${this.copied} value` : ''}
				</p>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-color-swatch': ColorSwatch;
	}
}
