import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';
import { focusRing } from '../../styles/focus-ring.js';
import { SlotContent } from '../../utils/slot-content.js';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'ghost';
type ButtonColor = 'accent' | 'gray';
type ButtonSize = 'lg' | 'md' | 'sm';
type ButtonType = 'button' | 'submit' | 'reset';

/**
 * @slot - The button text. Falls back to `text` when empty.
 */
@customElement('gv-button')
export class Button extends LitElement {
	private readonly _slots = new SlotContent(this, ['']);

	@property({ type: String }) text = '';
	@property({ type: String }) variant: ButtonVariant = 'filled';
	@property({ type: String }) color: ButtonColor = 'accent';
	@property({ type: String }) size: ButtonSize = 'md';
	@property({ type: String }) icon?: string;
	@property({ type: String }) type: ButtonType = 'button';
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;

	static styles = [
		componentReset,
		focusRing,
		css`
			.btn {
				box-shadow: var(--_drop, 0 0 #0000);
				display: inline-flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				border-radius: var(--border-radius-8xl);
				border: none;
				cursor: pointer;
				white-space: nowrap;
				letter-spacing: var(--letter-spacing-base);
				text-decoration: none;
				transition:
					background 300ms ease-in-out,
					color 300ms ease-in-out,
					box-shadow 300ms ease-in-out,
					border-color 300ms ease-in-out;
			}

			.btn--outlined {
				border: var(--border-width-base) solid transparent;
			}

			/* Sizes */
			.btn--lg {
				gap: var(--soft-grid-8);
				padding: var(--soft-grid-12) var(--soft-grid-20);
				font: var(--typography-single-line-base-base);
			}
			.btn--lg.btn--has-icon {
				padding-inline-start: var(--soft-grid-16);
			}

			.btn--md {
				gap: var(--soft-grid-6);
				padding: var(--soft-grid-8) var(--soft-grid-16);
				font: var(--typography-single-line-subtle-emphasis);
			}
			.btn--md.btn--has-icon {
				padding-inline-start: var(--soft-grid-12);
			}

			.btn--sm {
				gap: var(--soft-grid-4);
				padding: var(--soft-grid-4) var(--soft-grid-12);
				font: var(--typography-single-line-label-base);
			}
			.btn--sm.btn--has-icon {
				padding-inline-start: var(--soft-grid-8);
			}

			/* Outlined: compensate vertical padding for border to preserve height */
			.btn--outlined.btn--lg {
				padding-block: calc(var(--soft-grid-12) - var(--border-width-base));
			}
			.btn--outlined.btn--md {
				padding-block: calc(var(--soft-grid-8) - var(--border-width-base));
			}
			.btn--outlined.btn--sm {
				padding-block: calc(var(--soft-grid-4) - var(--border-width-base));
			}

			/* ---- Filled ---- */
			.btn--filled.btn--accent {
				background: var(--semantic-color-surface-accent-summit);
				color: var(--semantic-color-text-on-accent-summit-base);
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.btn--filled.btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
			}
			.btn--filled.btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: 0 0 #0000;
			}

			.btn--filled.btn--gray {
				background: var(--semantic-color-surface-gray-summit);
				color: var(--semantic-color-text-on-gray-summit-base);
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.btn--filled.btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
			}
			.btn--filled.btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: 0 0 #0000;
			}

			/* ---- Tonal ---- */
			.btn--tonal.btn--accent {
				background: var(--semantic-color-surface-accent-terrace);
				color: var(--semantic-color-text-on-accent-terrace-base);
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.btn--tonal.btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
			}
			.btn--tonal.btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: 0 0 #0000;
			}

			.btn--tonal.btn--gray {
				background: var(--semantic-color-surface-gray-terrace);
				color: var(--semantic-color-text-on-gray-terrace-base);
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.btn--tonal.btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
			}
			.btn--tonal.btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: 0 0 #0000;
			}

			/* ---- Outlined ---- */
			.btn--outlined.btn--accent {
				background: transparent;
				border-color: var(--semantic-color-border-around-accent-aurora);
				color: var(--semantic-color-text-on-accent-terrace-base);
			}
			/* Figma doesn't account for the border in its box model — on hover/active keep the
			 * border present but transparent (not removed) so the box dimensions stay constant;
			 * paired with the padding-block compensation above. */
			.btn--outlined.btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				border-color: transparent;
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.btn--outlined.btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				border-color: transparent;
				--_drop: 0 0 #0000;
			}

			.btn--outlined.btn--gray {
				background: transparent;
				border-color: var(--semantic-color-border-around-gray-aurora);
				color: var(--semantic-color-text-on-gray-terrace-base);
			}
			.btn--outlined.btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				border-color: transparent;
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.btn--outlined.btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				border-color: transparent;
				--_drop: 0 0 #0000;
			}

			/* ---- Ghost ---- */
			.btn--ghost.btn--accent {
				background: transparent;
				color: var(--semantic-color-text-on-accent-terrace-base);
			}
			.btn--ghost.btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.btn--ghost.btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: 0 0 #0000;
			}

			.btn--ghost.btn--gray {
				background: transparent;
				color: var(--semantic-color-text-on-gray-terrace-base);
			}
			.btn--ghost.btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.btn--ghost.btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: 0 0 #0000;
			}

			/* ---- Icon fill on hover (cross-shadow via inheriting custom properties) ---- */
			.btn:not(:disabled):hover gv-icon {
				--gv-icon-regular-display: none;
				--gv-icon-fill-display: inline-flex;
			}

			/* ---- Disabled ---- */
			.btn:disabled {
				opacity: 0.5;
			}
			.btn:disabled:hover {
				cursor: not-allowed;
			}
		`
	];

	render() {
		const hasIcon = Boolean(this.icon);
		return html`
			<button
				class=${classMap({
					btn: true,
					'gv-focusable': true,
					[`btn--${this.variant}`]: true,
					[`btn--${this.color}`]: true,
					[`btn--${this.size}`]: true,
					'btn--has-icon': hasIcon
				})}
				type=${this.type}
				?disabled=${this.disabled}
				aria-label=${this.ariaLabel ?? nothing}
			>
				${hasIcon ? html`<gv-icon name=${ifDefined(this.icon)} fill-in-hover></gv-icon>` : nothing}
				<slot></slot>${this._slots.has() ? nothing : this.text}
			</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-button': Button;
	}
}
