/**
 * Throwaway prototypes for reviewing #49. Each one follows the spec text it cites, minus styling.
 * Not library code.
 */
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const BLOCKING_INPUT_TYPES = new Set([
	'text',
	'search',
	'url',
	'tel',
	'email',
	'password',
	'number',
	'date',
	'month',
	'week',
	'time',
	'datetime-local'
]);

/**
 * #40 decision 4 + #49 S2: with no native submit button in form.elements, the first rendered
 * type="submit" spike-button is the default button.
 */
export const defaultSpikeButton = (form: HTMLFormElement): SpikeButton | null => {
	const controls = [...form.elements];
	const nativeSubmit = controls.some(
		(el) =>
			(el instanceof HTMLButtonElement && el.type === 'submit') ||
			(el instanceof HTMLInputElement && (el.type === 'submit' || el.type === 'image'))
	);
	if (nativeSubmit) return null;
	return (
		(controls.find(
			(el) => el instanceof SpikeButton && el.type === 'submit' && el.checkVisibility()
		) as SpikeButton | undefined) ?? null
	);
};

/** Walks the flat tree (slot assignment, then shadow host) to the nearest <form>. */
export const flatTreeForm = (el: Element): HTMLFormElement | null => {
	let node: Node | null = el;
	while (node) {
		const next: Node | null =
			node instanceof Element && node.assignedSlot ? node.assignedSlot : node.parentNode;
		node = next instanceof ShadowRoot ? next.host : next;
		if (node instanceof HTMLFormElement) return node;
	}
	return null;
};

/** gv-button as #40 + its maintainer comment + #49 S1/S2 specify it (button mode). */
@customElement('spike-button')
export class SpikeButton extends LitElement {
	static formAssociated = true;
	readonly internals = this.attachInternals();
	@property() type: 'button' | 'submit' | 'reset' = 'button';
	@property({ type: Boolean, reflect: true }) disabled = false;
	@state() private _formDisabled = false;
	readonly formAssociatedCalls: (HTMLFormElement | null)[] = [];
	readonly formDisabledCalls: boolean[] = [];
	private _keyForm: HTMLFormElement | null = null;

	constructor() {
		super();
		// #40 OD2 (b): decide in the next task, once the click has finished propagating.
		this.addEventListener('click', (event) => setTimeout(() => this._activate(event)));
	}

	get form() {
		return this.internals.form;
	}

	get effectivelyDisabled() {
		return this.disabled || this._formDisabled;
	}

	connectedCallback() {
		super.connectedCallback();
		this._watch(this.internals.form);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._watch(null);
	}

	formAssociatedCallback(form: HTMLFormElement | null) {
		this.formAssociatedCalls.push(form);
		this._watch(form);
	}

	formDisabledCallback(disabled: boolean) {
		this.formDisabledCalls.push(disabled);
		this._formDisabled = disabled;
	}

	/** #40 decision 4: listen for keydown on the form owner, and only there (FR-27). */
	private _watch(form: HTMLFormElement | null) {
		if (this._keyForm === form) return;
		this._keyForm?.removeEventListener('keydown', this._onKeydown);
		this._keyForm = form;
		form?.addEventListener('keydown', this._onKeydown);
	}

	private _onKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' || event.isComposing || event.defaultPrevented) return;
		const target = event.target as Element;
		const field =
			(target instanceof HTMLInputElement && BLOCKING_INPUT_TYPES.has(target.type)) ||
			target instanceof SpikeInput;
		if (!field || !this.form || defaultSpikeButton(this.form) !== this) return;
		// #49 S1: synchronously, so the browser's own implicit submission can't also run.
		event.preventDefault();
		if (!this.effectivelyDisabled) this.click();
	};

	private _activate(event: Event) {
		// FR-07: without a form owner, nothing happens and nothing is logged.
		if (event.defaultPrevented || this.effectivelyDisabled || !this.form) return;
		if (this.type === 'submit') this.form.requestSubmit();
		else if (this.type === 'reset') this.form.reset();
	}

	render() {
		return html`<button type="button" ?disabled=${this.effectivelyDisabled}><slot></slot></button>`;
	}
}

/** gv-text-input as #18 (+ its comments) specifies the association: value, reset, validity. */
@customElement('spike-input')
export class SpikeInput extends LitElement {
	static formAssociated = true;
	readonly internals = this.attachInternals();
	@property({ reflect: true }) name = '';
	@property() value = '';
	@property({ type: Boolean }) required = false;
	readonly formDisabledCalls: boolean[] = [];
	resets = 0;
	private _default = '';

	get form() {
		return this.internals.form;
	}

	get inner() {
		return this.renderRoot.querySelector('input')!;
	}

	connectedCallback() {
		super.connectedCallback();
		this._default = this.getAttribute('value') ?? '';
	}

	formResetCallback() {
		this.resets++;
		this.value = this._default;
	}

	formDisabledCallback(disabled: boolean) {
		this.formDisabledCalls.push(disabled);
	}

	protected updated() {
		this.internals.setFormValue(this.value);
		if (this.required && !this.value)
			this.internals.setValidity({ valueMissing: true }, 'Fill this in', this.inner);
		else this.internals.setValidity({});
	}

	render() {
		return html`<input
			.value=${this.value}
			@input=${(e: Event) => (this.value = (e.target as HTMLInputElement).value)}
		/>`;
	}
}

/** #14 link mode on a form-associated host (#49 L1-L3). */
@customElement('spike-link')
export class SpikeLink extends LitElement {
	static formAssociated = true;
	readonly internals = this.attachInternals();
	render() {
		return html`<a href="#l1-target">Docs</a>`;
	}
}

abstract class CountingForm extends LitElement {
	submits = 0;
	resets = 0;
	lastData: [string, FormDataEntryValue][] = [];
	get formEl() {
		return this.renderRoot.querySelector('form')!;
	}
	protected onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		this.submits++;
		this.lastData = [...new FormData(this.formEl)];
	};
	protected onReset = () => this.resets++;
}

/** A Lit form that owns its <form> in its shadow root and projects every control through a slot. */
@customElement('spike-shadow-form')
export class ShadowForm extends CountingForm {
	@property({ type: Boolean }) locked = false;
	render() {
		return html`<form id="inner" @submit=${this.onSubmit} @reset=${this.onReset}>
			<label for="email">Email</label>
			<fieldset ?disabled=${this.locked}><slot></slot></fieldset>
		</form>`;
	}
}

/** A Lit form that renders its own fields; its buttons come in through an `actions` slot. */
@customElement('spike-actions-form')
export class ActionsForm extends CountingForm {
	render() {
		return html`<form @submit=${this.onSubmit} @reset=${this.onReset}>
			<spike-input name="email" value="ada@example.com"></spike-input>
			<spike-input name="name" value="Ada"></spike-input>
			<slot name="actions"></slot>
		</form>`;
	}
}

/** The same form with the button in its own template: #40's "same shadow root" case. */
@customElement('spike-template-form')
export class TemplateForm extends CountingForm {
	render() {
		return html`<form @submit=${this.onSubmit} @reset=${this.onReset}>
			<spike-input name="email" value="ada@example.com"></spike-input>
			<spike-input name="name" value="Ada"></spike-input>
			<spike-button type="submit">Send</spike-button>
		</form>`;
	}
}

/** Lion-style shell: the consumer's own light-DOM <form> is its slotted child. */
@customElement('spike-form-shell')
export class FormShell extends LitElement {
	get formEl() {
		return this.querySelector(':scope > form');
	}
	render() {
		return html`<div class="frame"><slot></slot></div>`;
	}
}

/** A presentational layout used inside a light-DOM <form>: field and action slots, a shadow fieldset. */
@customElement('spike-form-layout')
export class FormLayout extends LitElement {
	@property({ type: Boolean }) locked = false;
	render() {
		return html`<fieldset ?disabled=${this.locked}><slot name="fields"></slot></fieldset>
			<div class="actions"><slot name="actions"></slot></div>`;
	}
}

/** A Lit form whose shadow root nominates its <form> as the reference target (experimental platform feature). */
@customElement('spike-rt-form')
export class ReferenceTargetForm extends LitElement {
	static shadowRootOptions = {
		...LitElement.shadowRootOptions,
		referenceTarget: 'inner'
	} as ShadowRootInit;
	submits = 0;
	lastData: [string, FormDataEntryValue][] = [];
	get formEl() {
		return this.renderRoot.querySelector('form')!;
	}
	render() {
		return html`<form
			id="inner"
			@submit=${(e: SubmitEvent) => {
				e.preventDefault();
				this.submits++;
				this.lastData = [...new FormData(this.formEl)];
			}}
		>
			<input name="own" value="from-shadow" />
			<slot></slot>
			<slot name="actions"></slot>
		</form>`;
	}
}

/** A consumer's Lit form done the supported way: <form> and controls in its own template, a layout in between. */
@customElement('spike-app-form')
export class AppForm extends CountingForm {
	render() {
		return html`<form @submit=${this.onSubmit} @reset=${this.onReset}>
			<spike-form-layout>
				<spike-input slot="fields" name="email" value="ada@example.com"></spike-input>
				<spike-input slot="fields" name="name" value="Ada"></spike-input>
				<spike-button slot="actions" type="submit">Send</spike-button>
			</spike-form-layout>
		</form>`;
	}
}
