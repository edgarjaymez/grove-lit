import { LitElement, html, css, nothing } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { componentReset } from '../../styles/component-reset.js';
import { focusRing } from '../../styles/focus-ring.js';
import {
	HostLabelFallback,
	describedBy,
	descriptionNode,
	invisibleName,
	warnIfUnnamed
} from '../../utils/accessible-name.js';
import { FormControl } from '../../utils/form-control.js';
import { SlotContent } from '../../utils/slot-content.js';

type CheckboxResponsive = 'default' | 'xl';

/**
 * A checkbox that takes part in its form: with `name`, a checked box submits `value`, and resetting the
 * form restores the state it had when it first connected. A page `<label>` around it, or `for` its id,
 * names it and toggles it.
 *
 * Its name is, in order: the slotted label text, a page `<label>`, then `label`.
 *
 * @slot - The label text, shown next to the box. It sits inside the focusable control, so it names
 * the checkbox and a click on it toggles. Text and phrasing content only, never a form control.
 * @attr {string} form - The id of the `<form>` this checkbox belongs to, when it isn't inside it.
 * @fires {CustomEvent<boolean>} gv-change - with the new `checked`.
 */
@customElement('gv-checkbox')
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging -- listener overloads, see CheckboxEventMap
export class Checkbox extends FormControl(LitElement) {
	@property({ type: Boolean, reflect: true }) checked = false;
	@property({ type: String }) responsive: CheckboxResponsive = 'default';
	@property({ type: Boolean, reflect: true }) disabled = false;
	/** The form data name a checked box submits `value` under. */
	@property({ type: String, reflect: true }) name?: string;
	/** Submitted under `name` while checked. */
	@property({ type: String }) value = 'on';
	/** The accessible name when no visible text or page `<label>` names the checkbox. Never shown. */
	@property({ type: String }) label?: string;
	/** Read after the name, as the checkbox's accessible description. Never shown. */
	@property({ type: String }) description?: string;

	private readonly _slots = new SlotContent(this, [''], { phrasingOnly: true });
	private readonly _hostLabel = new HostLabelFallback(this);
	private _defaultChecked?: boolean;

	constructor() {
		super();
		// A page label's click lands on the host; the box's own clicks come from inside and toggle there.
		this.addEventListener('click', (event) => {
			if (event.composedPath()[0] !== this || event.defaultPrevented) return;
			if (!this.effectivelyDisabled) this._toggle();
		});
	}

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

	/** @internal */
	protected renderedControl() {
		return this.renderRoot.querySelector<HTMLElement>('.control');
	}

	/** @internal */
	protected hasVisibleName() {
		return this._slots.hasText();
	}

	/** @internal */
	protected onFormReset() {
		this.checked = this._defaultChecked ?? false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._defaultChecked ??= this.checked;
	}

	protected firstUpdated() {
		warnIfUnnamed(
			this,
			() =>
				this.hasVisibleName() ||
				this.hasPageLabel() ||
				invisibleName(this.label, this._hostLabel) !== undefined
		);
	}

	protected override updated(changed: PropertyValues) {
		super.updated(changed);
		if (changed.has('checked') || changed.has('value'))
			this.internals.setFormValue(this.checked ? this.value : null);
	}

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
				aria-label=${this.hasVisibleName()
					? nothing
					: (this.pageLabelText() ?? invisibleName(this.label, this._hostLabel) ?? nothing)}
				aria-describedby=${describedBy(this.description)}
				?disabled=${this.effectivelyDisabled}
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
			${descriptionNode(this.description)}
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
