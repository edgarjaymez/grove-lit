import type { LitElement, PropertyDeclaration, PropertyValues } from 'lit';
import { warningsEnabled } from './dev.js';

/** A class constructor, as TypeScript's mixin pattern needs it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a mixin's base must take any[] (TS2545)
export type Constructor<T = object> = new (...args: any[]) => T;

/** What a control does in its form: submits it, resets it, or is a field Enter submits from. */
export type FormRole = 'submit' | 'reset' | 'field' | null;

/** Text-like input types that block implicit submission, so Enter in them looks for a default button. */
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

let warned = new WeakMap<Element, Set<string>>();

/** Test hook: forget which controls were warned about. */
export const resetFormControlWarnings = () => {
	warned = new WeakMap();
};

const warnOnce = (control: Element, kind: string, message: string) => {
	if (!warningsEnabled()) return;
	const kinds = warned.get(control) ?? new Set<string>();
	if (kinds.has(kind)) return;
	kinds.add(kind);
	warned.set(control, kinds);
	console.warn(message);
};

/**
 * The form a control belongs to. `ElementInternals.form` can name an element that isn't a `<form>`
 * (a shadow host with a reference target): that counts as no form, with one warning.
 */
export const formOwner = (form: unknown, control: Element): HTMLFormElement | null => {
	if (form == null) return null;
	if (form instanceof HTMLFormElement) return form;
	warnOnce(
		control,
		'owner',
		`[grove] <${control.localName}>'s form owner is <${(form as Element).localName}>, not a <form>. ` +
			'Grove treats the control as having no form.'
	);
	return null;
};

/** The nearest `<form>` up the flat tree: slot assignment first, then the parent, then the shadow host. */
const flatTreeForm = (el: Element): HTMLFormElement | null => {
	let node: Node | null = el;
	while (node) {
		const next: Node | null =
			node instanceof Element && node.assignedSlot ? node.assignedSlot : node.parentNode;
		node = next instanceof ShadowRoot ? next.host : next;
		if (node instanceof HTMLFormElement) return node;
	}
	return null;
};

/**
 * Whether a disabled fieldset disables the element: one of its ancestor fieldsets has `disabled`, and the
 * element isn't inside that fieldset's first legend. This is the platform's rule, minus the element's own
 * `disabled` attribute, which the component's property already covers.
 */
const inDisabledFieldset = (el: Element) => {
	for (
		let fieldset = el.parentElement?.closest('fieldset');
		fieldset;
		fieldset = fieldset.parentElement?.closest('fieldset')
	) {
		if (!fieldset.disabled) continue;
		const legend = [...fieldset.children].find((child) => child instanceof HTMLLegendElement);
		if (!legend?.contains(el)) return true;
	}
	return false;
};

/** What the module-level Enter listener needs from a member, captured with protected access. */
interface Member {
	role(): FormRole;
	control(): HTMLElement | null;
	disabled(): boolean;
	form(): HTMLFormElement | null;
	activate(): void;
}

const members = new WeakMap<Element, Member>();
const formMembers = new WeakMap<HTMLFormElement, Set<Element>>();
const enterListeners = new WeakMap<HTMLFormElement, { root: Node; listener: EventListener }>();

/** Test hook: the node a form's Enter listener sits on, or null when it has none. */
export const enterListenerRoot = (form: HTMLFormElement) => enterListeners.get(form)?.root ?? null;

/** Whether a native submit button owns Enter. `form.elements` doesn't list image buttons. */
const hasNativeSubmit = (form: HTMLFormElement) =>
	[...form.elements].some(
		(el) =>
			(el instanceof HTMLButtonElement && el.type === 'submit') ||
			(el instanceof HTMLInputElement && el.type === 'submit')
	) ||
	[...(form.getRootNode() as ParentNode).querySelectorAll('input[type=image i]')].some(
		(el) => (el as HTMLInputElement).form === form
	);

/** The first rendered submit member in tree order, as a native default button would be. */
const defaultButton = (form: HTMLFormElement): Member | null => {
	for (const el of form.elements) {
		const member = members.get(el);
		if (member?.role() === 'submit' && member.control()?.checkVisibility()) return member;
	}
	return null;
};

const blocksImplicitSubmission = (target: EventTarget | null, form: HTMLFormElement) => {
	if (target instanceof HTMLInputElement)
		return target.form === form && BLOCKING_INPUT_TYPES.has(target.type);
	const member = target instanceof Element ? members.get(target) : undefined;
	return member?.role() === 'field' && member.form() === form;
};

/**
 * Enter in a field of a form with no native submit button activates its default member. The keydown
 * is cancelled synchronously, or the browser would also submit a single-field form on its own. A page
 * vetoes Enter by cancelling the keydown before it reaches the form's root, or in the capture phase.
 */
const onEnter = (form: HTMLFormElement) => (event: Event) => {
	const key = event as KeyboardEvent;
	if (key.key !== 'Enter' || key.isComposing || key.defaultPrevented) return;
	if (!blocksImplicitSubmission(key.target, form) || hasNativeSubmit(form)) return;
	const member = defaultButton(form);
	if (!member) return;
	key.preventDefault();
	if (!member.disabled()) member.activate();
};

/** Keeps one Enter listener per form, on the form's root node, while the form has members. */
const listenForEnter = (form: HTMLFormElement) => {
	const root = form.getRootNode();
	const current = enterListeners.get(form);
	if (current?.root === root) return;
	current?.root.removeEventListener('keydown', current.listener);
	const listener = onEnter(form);
	root.addEventListener('keydown', listener);
	enterListeners.set(form, { root, listener });
};

const join = (form: HTMLFormElement, el: Element) => {
	const set = formMembers.get(form) ?? new Set<Element>();
	set.add(el);
	formMembers.set(form, set);
	listenForEnter(form);
};

const leave = (form: HTMLFormElement, el: Element) => {
	const set = formMembers.get(form);
	set?.delete(el);
	if (set?.size) return;
	const current = enterListeners.get(form);
	current?.root.removeEventListener('keydown', current.listener);
	enterListeners.delete(form);
	formMembers.delete(form);
};

/** Something that re-reads its page labels when the labels in its tree may have changed. */
interface LabelReader {
	syncLabels(): void;
}

const labelWatchers = new WeakMap<
	Node,
	{ observer: MutationObserver; readers: Set<LabelReader> }
>();

/**
 * A label's text as it names its control: the control itself, and anything `hidden` or `aria-hidden`,
 * add nothing; an image adds its `alt`.
 */
const labelText = (node: Node, control: Element): string => {
	if (node === control) return '';
	if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
	if (!(node instanceof Element)) return '';
	if (node.hasAttribute('hidden') || node.getAttribute('aria-hidden') === 'true') return '';
	if (node instanceof HTMLImageElement) return node.alt;
	return [...node.childNodes].map((child) => labelText(child, control)).join('');
};

const insideLabel = (node: Node) =>
	(node instanceof Element ? node : node.parentElement)?.closest('label') != null;

const touchesLabels = (record: MutationRecord) =>
	record.type === 'attributes' ||
	insideLabel(record.target) ||
	[...record.addedNodes, ...record.removedNodes].some(
		(node) =>
			node instanceof HTMLLabelElement ||
			(node instanceof Element && node.querySelector('label') !== null)
	);

/**
 * One observer per tree root, shared by the controls in it: a label added, removed, re-pointed
 * (`for`, `id`) or edited resyncs them.
 */
const watchLabels = (root: Node, reader: LabelReader) => {
	let watcher = labelWatchers.get(root);
	if (!watcher) {
		const readers = new Set<LabelReader>();
		const observer = new MutationObserver((records) => {
			if (records.some(touchesLabels)) for (const r of readers) r.syncLabels();
		});
		observer.observe(root, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['for', 'id']
		});
		watcher = { observer, readers };
		labelWatchers.set(root, watcher);
	}
	watcher.readers.add(reader);
};

const unwatchLabels = (root: Node, reader: LabelReader) => {
	const watcher = labelWatchers.get(root);
	if (!watcher) return;
	watcher.readers.delete(reader);
	if (watcher.readers.size) return;
	watcher.observer.disconnect();
	labelWatchers.delete(root);
};

/**
 * The members a component inherits from `FormControl`. Types only, so the manifest leaves it out.
 *
 * @internal
 */
export declare class FormControlInterface {
	/** The form this control belongs to, or null. */
	readonly form: HTMLFormElement | null;
	protected readonly internals: ElementInternals;
	protected get effectivelyDisabled(): boolean;
	protected formRole(): FormRole;
	protected renderedControl(): HTMLElement | null;
	protected submissionValue(): string | null;
	protected honoursFormDisabled(): boolean;
	protected onFormReset(): void;
	protected hasVisibleName(): boolean;
	protected hasPageLabel(): boolean;
	protected pageLabelText(): string | undefined;
	syncLabels(): void;
	formAssociatedCallback(form: HTMLFormElement | null): void;
	formDisabledCallback(disabled: boolean): void;
	formResetCallback(): void;
}

/**
 * The one way a Grove control takes part in a form. The host is a form-associated custom element: it
 * has a form owner, `<fieldset disabled>` disables it, and the form lists it. A submit or reset member
 * acts on its form after its click has finished propagating, so any listener can cancel it. The first
 * rendered submit member is the form's default button for Enter when the form has no native one. A
 * submit member disables itself once a submission it started has fired `submit`, until `disabled`
 * returns to `false`, the form is reset, or the page comes back from the back/forward cache.
 *
 * Form association follows the DOM tree, not slots: a control slotted into a `<form>` in another
 * tree has no form. Outside production builds it says so once, on its first activation.
 *
 * A page `<label>` (wrapping, or `for` the host's id) names the control inside the shadow root, not the
 * host. The host has no role, so it is never left named; the component renders the labels' text
 * (`pageLabelText()`) as its control's name, unless its own visible text names it; and focus is
 * delegated to it.
 *
 * The component declares the reactive `disabled` property and overrides the hooks for its role.
 */
export const FormControl = <T extends Constructor<LitElement>>(Base: T) => {
	class FormControlElement extends Base {
		static formAssociated = true;

		/** A label click and `focus()` on the host reach the control inside. */
		static shadowRootOptions: ShadowRootInit = {
			...(Base as unknown as { shadowRootOptions: ShadowRootInit }).shadowRootOptions,
			delegatesFocus: true
		};

		/** @internal */
		declare disabled: boolean;

		/** @internal */
		protected readonly internals = this.attachInternals();

		private _registered: HTMLFormElement | null = null;
		private _submitting = false;
		private _dispatching = false;
		private _disabledWritten = false;
		private _selfWrite = false;
		private _labelRoot: Node | null = null;
		private _labelText?: string;

		private readonly _onPageshow = (event: PageTransitionEvent) => {
			if (event.persisted && this._submitting) this.disabled = false;
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a mixin's constructor (TS2545)
		constructor(...args: any[]) {
			super(...args);
			// The control inside carries the role and the name; a named role-less host would be a second,
			// generic copy (#21 FR-04).
			this.internals.role = 'none';
			members.set(this, {
				role: () => this.formRole(),
				control: () => this.renderedControl(),
				disabled: () => this.effectivelyDisabled,
				form: () => this.form,
				activate: () => this.click()
			});
			this.addEventListener('click', (event) => {
				// A plain Event named click doesn't activate a native button either.
				if (event instanceof MouseEvent) setTimeout(() => this._activate(event));
			});
		}

		get form(): HTMLFormElement | null {
			return formOwner(this.internals.form, this);
		}

		/** @internal */
		protected get effectivelyDisabled() {
			return this.disabled || (this.honoursFormDisabled() && inDisabledFieldset(this));
		}

		/** @internal What the control does in its form. */
		protected formRole(): FormRole {
			return null;
		}

		/** @internal The element that shows the control, checked for visibility. */
		protected renderedControl(): HTMLElement | null {
			return this;
		}

		/** @internal The value a submit member adds under its `name`, or null for none. */
		protected submissionValue(): string | null {
			return null;
		}

		/** @internal Whether `<fieldset disabled>` disables the control. */
		protected honoursFormDisabled() {
			return true;
		}

		/** @internal Runs on every uncancelled reset of the form. */
		protected onFormReset() {}

		/** @internal Whether the control's own visible text names it, which page labels don't override. */
		protected hasVisibleName() {
			return false;
		}

		/** @internal Whether a page `<label>` names the control. */
		protected hasPageLabel() {
			return this._pageLabels().length > 0;
		}

		/**
		 * The page labels' text, which the component renders as its control's `aria-label`. It is
		 * copied rather than referenced: a checker that reads attributes (axe-core) can't follow an
		 * element reference across the shadow boundary, and a wrapping label referenced from the control
		 * inside it would name the control twice.
		 *
		 * @internal
		 */
		protected pageLabelText() {
			return this._labelText;
		}

		/**
		 * Re-reads the page labels that label the host after a change in its tree, and re-renders when
		 * their text changed. None count while the control's own text names it.
		 *
		 * @internal
		 */
		syncLabels() {
			if (this._readLabels() !== this._labelText) this.requestUpdate();
		}

		private _pageLabels() {
			if (this.hasVisibleName()) return [];
			return [...(this.internals.labels ?? [])].filter((node) => node instanceof Element);
		}

		private _readLabels() {
			return (
				this._pageLabels()
					.map((label) => labelText(label, this).replace(/\s+/g, ' ').trim())
					.filter(Boolean)
					.join(' ') || undefined
			);
		}

		connectedCallback() {
			super.connectedCallback();
			this._syncMembership();
			if (this._submitting) window.addEventListener('pageshow', this._onPageshow);
			this._labelRoot = this.getRootNode();
			watchLabels(this._labelRoot, this);
			if (this.hasUpdated) this.syncLabels();
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this._syncMembership();
			window.removeEventListener('pageshow', this._onPageshow);
			if (this._labelRoot) unwatchLabels(this._labelRoot, this);
			this._labelRoot = null;
		}

		/** @internal */
		protected override willUpdate(changed: PropertyValues) {
			super.willUpdate(changed);
			this._labelText = this._readLabels();
		}

		/** @internal */
		formAssociatedCallback() {
			this._syncMembership();
		}

		/**
		 * A fieldset around the element changed its disabled state. The platform also calls this when the
		 * element's own `disabled` attribute is reflected, mid-update, where the request is dropped; the
		 * render already reads the property then.
		 *
		 * @internal
		 */
		formDisabledCallback() {
			this.requestUpdate();
		}

		/** @internal */
		formResetCallback() {
			if (this._submitting) this.disabled = false;
			this.onFormReset();
		}

		/**
		 * Lit's property setters call this synchronously on every write, attribute changes included, so
		 * it sees each write to `disabled` as it happens.
		 *
		 * @internal
		 */
		override requestUpdate(
			name?: PropertyKey,
			oldValue?: unknown,
			options?: PropertyDeclaration,
			useNewValue?: boolean,
			newValue?: unknown
		) {
			super.requestUpdate(name, oldValue, options, useNewValue, newValue);
			if (name !== 'disabled' || this._selfWrite) return;
			if (this._dispatching) this._disabledWritten = true;
			if (!this.disabled && this._submitting) this._release();
		}

		private _syncMembership() {
			const form = this.isConnected ? this.form : null;
			if (form !== this._registered) {
				if (this._registered) leave(this._registered, this);
				this._registered = form;
				if (form) join(form, this);
			} else if (form) {
				listenForEnter(form);
			}
		}

		private _activate(event: MouseEvent) {
			const role = this.formRole();
			if (event.defaultPrevented || (role !== 'submit' && role !== 'reset')) return;
			if (this.effectivelyDisabled) return;
			const form = this.form;
			if (!form) this._warnIfSlottedIntoForm();
			else if (role === 'reset') form.reset();
			else this._submit(form);
		}

		/**
		 * Submits through the form, so validation and a cancelable `submit` run as for a native button.
		 * The named value is in the form data only while that submission builds it. Self-disabling waits
		 * until `requestSubmit()` returns: the entry list skips disabled controls, and a page that set
		 * `disabled` in its own `submit` listener keeps its value.
		 */
		private _submit(form: HTMLFormElement) {
			let fired = false;
			const onSubmit = () => (fired = true);
			const value = this.submissionValue();
			form.addEventListener('submit', onSubmit, { capture: true });
			if (value !== null) this.internals.setFormValue(value);
			this._dispatching = true;
			this._disabledWritten = false;
			try {
				form.requestSubmit();
			} finally {
				this._dispatching = false;
				form.removeEventListener('submit', onSubmit, { capture: true });
				if (value !== null) this.internals.setFormValue(null);
			}
			if (fired && !this._disabledWritten) this._selfDisable();
		}

		private _selfDisable() {
			this._selfWrite = true;
			this.disabled = true;
			this._selfWrite = false;
			this._submitting = true;
			this._setSubmittingState(true);
			if (this.isConnected) window.addEventListener('pageshow', this._onPageshow);
		}

		private _release() {
			this._submitting = false;
			this._setSubmittingState(false);
			window.removeEventListener('pageshow', this._onPageshow);
		}

		/** Mirrors the self-disabled state as `:state(submitting)` where CustomStateSet exists. */
		private _setSubmittingState(on: boolean) {
			try {
				if (on) this.internals.states.add('submitting');
				else this.internals.states.delete('submitting');
			} catch {
				// Engines without CustomStateSet still release through _submitting.
			}
		}

		private _warnIfSlottedIntoForm() {
			const form = flatTreeForm(this);
			const root = form?.getRootNode();
			if (!form || root === this.getRootNode()) return;
			const where =
				root instanceof ShadowRoot
					? `inside <${root.host.localName}>'s shadow root`
					: 'in the page';
			warnOnce(
				this,
				'slotted',
				`[grove] <${this.localName} type="${this.formRole()}"> has no form: the <form> it appears in ` +
					`is ${where}, a different tree. Form association follows the DOM tree, not slots or ` +
					'shadow roots, so the control does nothing. Render the <form> and its controls in the same tree.'
			);
		}
	}
	// Protected members make the two classes nominally distinct, so the cast goes through unknown.
	return FormControlElement as unknown as Constructor<FormControlInterface> & T;
};
