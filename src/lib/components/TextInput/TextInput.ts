import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentReset } from '../../styles/component-reset.js';
import { focusRing } from '../../styles/focus-ring.js';
import {
	HostLabelFallback,
	describedBy,
	descriptionNode,
	invisibleName,
	warnIfUnnamed
} from '../../utils/accessible-name.js';

type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
type InputColor = 'brand' | 'gray';

/**
 * A single-line text field. `label` is its accessible name and `description` its accessible
 * description. A page `<label for>` can't reach the input inside the shadow root.
 *
 * @fires {CustomEvent<string>} gv-input - with the value, on every edit.
 * @fires {CustomEvent<string>} gv-change - with the value, when a change is committed.
 */
@customElement('gv-text-input')
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging -- listener overloads, see TextInputEventMap
export class TextInput extends LitElement {
	@property({ type: String }) value = '';
	@property({ type: String }) color: InputColor = 'brand';
	@property({ type: Boolean, reflect: true }) error = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: String }) placeholder: string | undefined;
	@property({ type: String, attribute: 'input-id' }) inputId: string | undefined;
	@property({ type: String }) name: string | undefined;
	@property({ type: String }) type: InputType = 'text';
	/** The field's accessible name. Never shown: show the visible label next to the field. */
	@property({ type: String }) label?: string;
	/** Read after the name, as the field's accessible description: hint or error text. Never shown. */
	@property({ type: String }) description?: string;

	private readonly _hostLabel = new HostLabelFallback(this, ['aria-label', 'aria-describedby']);

	static styles = [
		componentReset,
		focusRing,
		css`
			:host {
				display: block;
			}

			.text-input {
				display: block;
				width: 100%;
				border: none;
				border-bottom: var(--border-width-heavy) solid transparent;
				border-radius: 0;
				padding: var(--soft-grid-8) var(--soft-grid-12);
				font: var(--typography-single-line-subtle-base);
				letter-spacing: var(--letter-spacing-base);
				cursor: text;
				transition:
					background 300ms ease-in-out,
					border-color 300ms ease-in-out,
					color 300ms ease-in-out;
			}

			/* Resting underlines use the summit border: the input's boundary must hold 3:1 against
			   both its fill and Ground in both themes (WCAG 1.4.11). */

			/* ---- brand ---- */
			.text-input--brand {
				background: var(--semantic-color-surface-brand-terrace);
				border-bottom-color: var(--semantic-color-border-around-brand-summit);
				color: var(--semantic-color-text-on-brand-terrace-base);
			}
			.text-input--brand::placeholder {
				color: var(--semantic-color-text-on-brand-terrace-subtle);
			}
			.text-input--brand:not(.text-input--disabled):hover {
				background: var(--semantic-color-surface-brand-aurora);
				border-bottom-color: var(--semantic-color-border-around-brand-aurora);
				color: var(--semantic-color-text-on-brand-aurora-base);
			}
			.text-input--brand:not(.text-input--disabled):hover::placeholder {
				color: var(--semantic-color-text-on-brand-aurora-subtle);
			}
			.text-input--brand:not(.text-input--disabled):focus,
			.text-input--brand:not(.text-input--disabled):active {
				background: var(--semantic-color-surface-brand-summit);
				border-bottom-color: var(--semantic-color-border-around-brand-summit);
				color: var(--semantic-color-text-on-brand-summit-base);
			}
			.text-input--brand:not(.text-input--disabled):focus::placeholder,
			.text-input--brand:not(.text-input--disabled):active::placeholder {
				color: var(--semantic-color-text-on-brand-summit-subtle);
			}

			/* ---- gray ---- */
			.text-input--gray {
				background: var(--semantic-color-surface-ground);
				border-bottom-color: var(--semantic-color-border-around-gray-summit);
				color: var(--semantic-color-text-on-gray-terrace-base);
			}
			.text-input--gray::placeholder {
				color: var(--semantic-color-text-on-gray-terrace-subtle);
			}
			.text-input--gray:not(.text-input--disabled):hover {
				background: var(--semantic-color-surface-gray-aurora);
				border-bottom-color: var(--semantic-color-border-around-gray-aurora);
				color: var(--semantic-color-text-on-gray-aurora-base);
			}
			.text-input--gray:not(.text-input--disabled):hover::placeholder {
				color: var(--semantic-color-text-on-gray-aurora-subtle);
			}
			.text-input--gray:not(.text-input--disabled):focus,
			.text-input--gray:not(.text-input--disabled):active {
				background: var(--semantic-color-surface-gray-summit);
				border-bottom-color: var(--semantic-color-border-around-gray-summit);
				color: var(--semantic-color-text-on-gray-summit-base);
			}
			.text-input--gray:not(.text-input--disabled):focus::placeholder,
			.text-input--gray:not(.text-input--disabled):active::placeholder {
				color: var(--semantic-color-text-on-gray-summit-subtle);
			}

			/* ---- error (overrides color track) ----
			   Every state re-declares fill, text and placeholder: the track's hover and focus rules
			   have the same specificity and would otherwise repaint an errored field. */
			.text-input--error {
				background: var(--semantic-color-surface-danger-terrace);
				border-bottom-color: var(--semantic-color-border-around-danger-summit);
				color: var(--semantic-color-text-on-danger-terrace-base);
			}
			.text-input--error::placeholder {
				color: var(--semantic-color-text-on-danger-terrace-subtle);
			}
			.text-input--error:not(.text-input--disabled):hover {
				background: var(--semantic-color-surface-danger-terrace);
				border-bottom-color: var(--semantic-color-border-around-danger-aurora);
				color: var(--semantic-color-text-on-danger-terrace-base);
			}
			.text-input--error:not(.text-input--disabled):focus,
			.text-input--error:not(.text-input--disabled):active {
				background: var(--semantic-color-surface-danger-terrace);
				border-bottom-color: var(--semantic-color-border-around-danger-summit);
				color: var(--semantic-color-text-on-danger-terrace-base);
			}
			.text-input--error:not(.text-input--disabled):hover::placeholder,
			.text-input--error:not(.text-input--disabled):focus::placeholder,
			.text-input--error:not(.text-input--disabled):active::placeholder {
				color: var(--semantic-color-text-on-danger-terrace-subtle);
			}

			/* ---- disabled (static, track-agnostic; rendered as readonly + aria-disabled) ---- */
			.text-input--disabled {
				background: var(--semantic-color-surface-gray-terrace);
				border-bottom-color: var(--semantic-color-border-around-gray-terrace);
				color: var(--semantic-color-text-on-gray-terrace-base);
				cursor: not-allowed;
			}
			.text-input--disabled::placeholder {
				color: var(--semantic-color-text-on-gray-terrace-subtle);
			}
		`
	];

	private _handleInput(e: Event) {
		e.stopPropagation();
		this.value = (e.target as HTMLInputElement).value;
		this.dispatchEvent(
			new CustomEvent('gv-input', { detail: this.value, bubbles: true, composed: true })
		);
	}

	private _handleChange(e: Event) {
		e.stopPropagation();
		this.value = (e.target as HTMLInputElement).value;
		this.dispatchEvent(
			new CustomEvent('gv-change', { detail: this.value, bubbles: true, composed: true })
		);
	}

	protected firstUpdated() {
		warnIfUnnamed(this, () => invisibleName(this.label, this._hostLabel) !== undefined);
	}

	render() {
		return html`
			<input
				class=${classMap({
					'text-input': true,
					'gv-focusable': true,
					[`text-input--${this.color}`]: true,
					'text-input--error': this.error,
					'text-input--disabled': this.disabled
				})}
				.value=${this.value}
				?readonly=${this.disabled}
				placeholder=${ifDefined(this.placeholder)}
				id=${ifDefined(this.inputId)}
				name=${ifDefined(this.name)}
				type=${this.type}
				aria-invalid=${ifDefined(this.error ? 'true' : undefined)}
				aria-disabled=${this.disabled ? 'true' : nothing}
				aria-label=${invisibleName(this.label, this._hostLabel) ?? nothing}
				aria-describedby=${describedBy(this.description)}
				@input=${this._handleInput}
				@change=${this._handleChange}
			/>
			${descriptionNode(this.description)}
		`;
	}
}

/**
 * gv-text-input's events. `gv-change` is shared across Grove with different payloads, so the global map types
 * it `CustomEvent<string | boolean>`; a listener on a gv-text-input reference gets the exact `detail`.
 */
export interface TextInputEventMap extends HTMLElementEventMap {
	'gv-change': CustomEvent<string>;
}

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging -- typed listener overloads only */
export interface TextInput {
	addEventListener<K extends keyof TextInputEventMap>(
		type: K,
		listener: (this: TextInput, event: TextInputEventMap[K]) => unknown,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
	removeEventListener<K extends keyof TextInputEventMap>(
		type: K,
		listener: (this: TextInput, event: TextInputEventMap[K]) => unknown,
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
		'gv-text-input': TextInput;
	}
}
