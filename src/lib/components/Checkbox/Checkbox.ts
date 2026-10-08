import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { componentReset } from '../../styles/component-reset.js';
import { focusRing } from '../../styles/focus-ring.js';
import { SlotContent } from '../../utils/slot-content.js';

type CheckboxResponsive = 'default' | 'xl';

/**
 * @slot - The label text, shown next to the box. It sits inside the focusable control, so it names
 * the checkbox and a click on it toggles. Text and phrasing content only, never a form control.
 * @fires {CustomEvent<boolean>} gv-change - with the new `checked`.
 */
@customElement('gv-checkbox')
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging -- listener overloads, see CheckboxEventMap
export class Checkbox extends LitElement {
	@property({ type: Boolean, reflect: true }) checked = false;
	@property({ type: String }) responsive: CheckboxResponsive = 'default';
	@property({ type: Boolean, reflect: true }) disabled = false;

	private readonly _slots = new SlotContent(this, [''], { phrasingOnly: true });

	static styles = [
		componentReset,
		focusRing,
		css`
			/* The focusable control: the box, then the label when one is slotted. Unlabelled, it is
			   exactly the box, so the ring hugs the box as before. Middle alignment keeps its line
			   box the same checked or not: on the baseline, the empty box sat 2px higher. */
			.control {
				display: inline-flex;
				vertical-align: middle;
				align-items: center;
				gap: var(--soft-grid-8);
				padding: 0;
				border: 0;
				border-radius: var(--border-radius-sm);
				background: none;
				color: inherit;
				text-align: start;
				cursor: pointer;
			}

			.control[disabled] {
				cursor: not-allowed;
				opacity: 0.5;
			}

			.box {
				position: relative;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				flex-shrink: 0;
				width: 24px;
				height: 24px;
				border-radius: var(--border-radius-sm);
				border: var(--border-width-base) solid var(--semantic-color-border-around-gray-summit);
				background: var(--semantic-color-surface-ground);
				color: transparent;
				transition:
					background-color 200ms,
					border-color 200ms,
					color 200ms;
			}

			.box.xl {
				width: 28px;
				height: 28px;
			}

			/* The edge carries border-around, not the fill: at night the brand fill alone is
			   under 3:1 against Ground, and the edge is what keeps the box visible. */
			.control[aria-checked='true'] .box {
				background: var(--semantic-color-surface-brand-summit);
				border-color: var(--semantic-color-border-around-brand-summit);
				color: var(--semantic-color-text-on-brand-summit-base);
			}

			.control:hover:not([aria-checked='true']):not([disabled]) .box {
				border-color: var(--semantic-color-border-around-gray-aurora);
			}

			/* Hover and press share Aurora until Grove has a dedicated press-state token. */
			.control:hover[aria-checked='true']:not([disabled]) .box,
			.control:active[aria-checked='true']:not([disabled]) .box {
				background: var(--semantic-color-surface-brand-aurora);
				border-color: var(--semantic-color-border-around-brand-aurora);
				color: var(--semantic-color-text-on-brand-aurora-base);
			}

			.control[disabled] .box {
				background: var(--semantic-color-surface-gray-terrace);
				border-color: var(--semantic-color-border-around-gray-summit);
			}

			.control[disabled][aria-checked='true'] .box {
				color: var(--semantic-color-text-on-gray-terrace-base);
			}

			.check {
				width: 12px;
				height: 8.862px;
			}

			.box.xl .check {
				width: 16px;
				height: 11.816px;
			}

			/* On the parent's surface, not the box's: the text colour is inherited from it. */
			.label {
				min-width: 0;
				font: var(--typography-single-line-base-base);
				letter-spacing: var(--letter-spacing-base);
			}
		`
	];

	private _toggle() {
		this.checked = !this.checked;
		this.dispatchEvent(
			new CustomEvent('gv-change', { detail: this.checked, bubbles: true, composed: true })
		);
	}

	render() {
		return html`
			<button
				type="button"
				role="checkbox"
				aria-checked=${this.checked ? 'true' : 'false'}
				?disabled=${this.disabled}
				class="control gv-focusable"
				@click=${this._toggle}
			>
				<span class=${classMap({ box: true, xl: this.responsive === 'xl' })} aria-hidden="true">
					${this.checked
						? html`<svg class="check" viewBox="0 0 12 8.862" fill="none">
								<path
									d="M1.5 4.431L4.5 7.431L10.5 1.431"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>`
						: nothing}
				</span>
				${this._slots.has() ? html`<span class="label"><slot></slot></span>` : nothing}
			</button>
		`;
	}
}

/**
 * gv-checkbox's events. `gv-change` is shared across Grove with different payloads, so the global map types
 * it `CustomEvent<string | boolean>`; a listener on a gv-checkbox reference gets the exact `detail`.
 */
export interface CheckboxEventMap extends HTMLElementEventMap {
	'gv-change': CustomEvent<boolean>;
}

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging -- typed listener overloads only */
export interface Checkbox {
	addEventListener<K extends keyof CheckboxEventMap>(
		type: K,
		listener: (this: Checkbox, event: CheckboxEventMap[K]) => unknown,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
	removeEventListener<K extends keyof CheckboxEventMap>(
		type: K,
		listener: (this: Checkbox, event: CheckboxEventMap[K]) => unknown,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions
	): void;
}
/* eslint-enable @typescript-eslint/no-unsafe-declaration-merging */

declare global {
	interface HTMLElementTagNameMap {
		'gv-checkbox': Checkbox;
	}
}
