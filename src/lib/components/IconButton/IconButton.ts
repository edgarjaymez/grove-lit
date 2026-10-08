import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';
import { focusRing } from '../../styles/focus-ring.js';
import {
	HostLabelFallback,
	describedBy,
	descriptionNode,
	invisibleName,
	warnIfUnnamed
} from '../../utils/accessible-name.js';

type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'ghost';
type IconButtonColor = 'accent' | 'gray';
type IconButtonSize = 'lg' | 'md' | 'sm';

/**
 * An icon-only button. It has no visible text, so `label` is its accessible name.
 */
@customElement('gv-icon-button')
export class IconButton extends LitElement {
	@property({ type: String }) icon = 'tree';
	@property({ type: String }) variant: IconButtonVariant = 'filled';
	@property({ type: String }) color: IconButtonColor = 'accent';
	@property({ type: String }) size: IconButtonSize = 'lg';
	@property({ type: Boolean, reflect: true }) disabled = false;
	/** The accessible name. Required: the button shows only its icon. Never shown. */
	@property({ type: String }) label?: string;
	/** Read after the name, as the button's accessible description. Never shown. */
	@property({ type: String }) description?: string;

	private readonly _hostLabel = new HostLabelFallback(this);

	static styles = [
		componentReset,
		focusRing,
		css`
			.icon-btn {
				box-shadow: var(--_drop, 0 0 #0000);
				display: inline-flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				border-radius: var(--border-radius-8xl);
				border: none;
				cursor: pointer;
				transition:
					background 300ms ease-in-out,
					color 300ms ease-in-out,
					box-shadow 300ms ease-in-out,
					border-color 300ms ease-in-out;
			}

			.icon-btn--outlined {
				border: var(--border-width-base) solid transparent;
			}

			/* Sizes — font shorthand sets the font-size that drives Icon's 1em SVG sizing */
			.icon-btn--lg {
				padding: var(--soft-grid-12);
				font: var(--typography-single-line-base-base);
				letter-spacing: var(--typography-single-line-base-base-letter-spacing);
			}
			.icon-btn--md {
				padding: var(--soft-grid-8);
				font: var(--typography-single-line-subtle-emphasis);
				letter-spacing: var(--typography-single-line-subtle-emphasis-letter-spacing);
			}
			.icon-btn--sm {
				padding: var(--soft-grid-4);
				font: var(--typography-single-line-label-base);
				letter-spacing: var(--typography-single-line-label-base-letter-spacing);
			}

			/* Outlined: compensate all-side padding for border to preserve dimensions */
			.icon-btn--outlined.icon-btn--lg {
				padding: calc(var(--soft-grid-12) - var(--border-width-base));
			}
			.icon-btn--outlined.icon-btn--md {
				padding: calc(var(--soft-grid-8) - var(--border-width-base));
			}
			.icon-btn--outlined.icon-btn--sm {
				padding: calc(var(--soft-grid-4) - var(--border-width-base));
			}

			/* ---- Filled ---- */
			.icon-btn--filled.icon-btn--accent {
				background: var(--semantic-color-surface-accent-summit);
				color: var(--semantic-color-text-on-accent-summit-base);
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.icon-btn--filled.icon-btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
			}
			.icon-btn--filled.icon-btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: 0 0 #0000;
			}

			.icon-btn--filled.icon-btn--gray {
				background: var(--semantic-color-surface-gray-summit);
				color: var(--semantic-color-text-on-gray-summit-base);
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.icon-btn--filled.icon-btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
			}
			.icon-btn--filled.icon-btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: 0 0 #0000;
			}

			/* ---- Tonal ---- */
			.icon-btn--tonal.icon-btn--accent {
				background: var(--semantic-color-surface-accent-terrace);
				color: var(--semantic-color-text-on-accent-terrace-base);
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.icon-btn--tonal.icon-btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
			}
			.icon-btn--tonal.icon-btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: 0 0 #0000;
			}

			.icon-btn--tonal.icon-btn--gray {
				background: var(--semantic-color-surface-gray-terrace);
				color: var(--semantic-color-text-on-gray-terrace-base);
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.icon-btn--tonal.icon-btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
			}
			.icon-btn--tonal.icon-btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: 0 0 #0000;
			}

			/* ---- Outlined ---- */
			.icon-btn--outlined.icon-btn--accent {
				background: transparent;
				border-color: var(--semantic-color-border-around-accent-aurora);
				color: var(--semantic-color-text-on-accent-terrace-base);
			}
			.icon-btn--outlined.icon-btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				border-color: transparent;
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.icon-btn--outlined.icon-btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				border-color: transparent;
				--_drop: 0 0 #0000;
			}

			.icon-btn--outlined.icon-btn--gray {
				background: transparent;
				border-color: var(--semantic-color-border-around-gray-aurora);
				color: var(--semantic-color-text-on-gray-terrace-base);
			}
			.icon-btn--outlined.icon-btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				border-color: transparent;
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.icon-btn--outlined.icon-btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				border-color: transparent;
				--_drop: 0 0 #0000;
			}

			/* ---- Ghost ---- */
			.icon-btn--ghost.icon-btn--accent {
				background: transparent;
				color: var(--semantic-color-text-on-accent-terrace-base);
			}
			.icon-btn--ghost.icon-btn--accent:not(:disabled):hover {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: var(--drop-shadow-under-accent-summit);
			}
			.icon-btn--ghost.icon-btn--accent:not(:disabled):active {
				background: var(--semantic-color-surface-accent-aurora);
				color: var(--semantic-color-text-on-accent-aurora-base);
				--_drop: 0 0 #0000;
			}

			.icon-btn--ghost.icon-btn--gray {
				background: transparent;
				color: var(--semantic-color-text-on-gray-terrace-base);
			}
			.icon-btn--ghost.icon-btn--gray:not(:disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: var(--drop-shadow-under-gray-summit);
			}
			.icon-btn--ghost.icon-btn--gray:not(:disabled):active {
				background: var(--semantic-color-surface-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
				--_drop: 0 0 #0000;
			}

			/* ---- Icon fill on hover (cross-shadow via inheriting custom properties) ---- */
			.icon-btn:not(:disabled):hover gv-icon {
				--gv-icon-regular-display: none;
				--gv-icon-fill-display: inline-flex;
			}

			/* ---- Disabled ---- */
			.icon-btn:disabled {
				opacity: 0.5;
			}
			.icon-btn:disabled:hover {
				cursor: not-allowed;
			}
		`
	];

	protected firstUpdated() {
		warnIfUnnamed(this, () => invisibleName(this.label, this._hostLabel) !== undefined);
	}

	render() {
		return html`
			<button
				class=${classMap({
					'icon-btn': true,
					'gv-focusable': true,
					[`icon-btn--${this.variant}`]: true,
					[`icon-btn--${this.color}`]: true,
					[`icon-btn--${this.size}`]: true
				})}
				?disabled=${this.disabled}
				aria-label=${invisibleName(this.label, this._hostLabel) ?? nothing}
				aria-describedby=${describedBy(this.description)}
			>
				<gv-icon name=${this.icon} fill-in-hover></gv-icon>
			</button>
			${descriptionNode(this.description)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-icon-button': IconButton;
	}
}
