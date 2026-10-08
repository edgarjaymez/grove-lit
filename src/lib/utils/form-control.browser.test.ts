import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { userEvent } from 'vitest/browser';
import { LitElement, html, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
	enterListenerRoot,
	FormControl,
	formOwner,
	resetFormControlWarnings
} from './form-control.js';
import type { FormRole } from './form-control.js';
import { cancelFormSubmits, nextTask, recordSubmits, settle } from '../../test/forms.js';

/** A submit, reset or plain button, by its `type`, like gv-button in button mode. */
@customElement('test-submitter')
class TestSubmitter extends FormControl(LitElement) {
	@property({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';
	@property({ reflect: true }) name?: string;
	@property() value = '';

	protected formRole(): FormRole {
		return this.type === 'submit' || this.type === 'reset' ? this.type : null;
	}

	protected renderedControl() {
		return this.renderRoot.querySelector('button');
	}

	protected submissionValue() {
		return this.name ? this.value : null;
	}

	get inner() {
		return this.renderRoot.querySelector('button')!;
	}

	render() {
		return html`<button type="button" ?disabled=${this.effectivelyDisabled}><slot></slot></button>`;
	}
}

/** A text field that blocks implicit submission, like gv-text-input will. */
@customElement('test-field')
class TestField extends FormControl(LitElement) {
	protected formRole(): FormRole {
		return 'field';
	}

	get inner() {
		return this.renderRoot.querySelector('input')!;
	}

	render() {
		return html`<input />`;
	}
}

/** A component that renders its <form> in its shadow root and slots its controls: unsupported. */
@customElement('test-shadow-form')
class TestShadowForm extends LitElement {
	render() {
		return html`<form><slot></slot></form>`;
	}
}

/** A component with no slot: a child of it is never rendered. */
@customElement('test-no-slot')
class TestNoSlot extends LitElement {
	render() {
		return html`<span>Nothing slotted</span>`;
	}
}

const host = document.body.appendChild(document.createElement('div'));

cancelFormSubmits();

afterEach(() => render(html``, host));

const mount = async (template: unknown) => {
	render(template, host);
	await settle(host);
	return {
		form: host.querySelector('form')!,
		submitter: host.querySelector<TestSubmitter>('test-submitter')!,
		submitters: [...host.querySelectorAll<TestSubmitter>('test-submitter')],
		field: host.querySelector<TestField>('test-field')!
	};
};

const submitting = (el: Element) => el.matches(':state(submitting)');

describe('form owner (#49 C4)', () => {
	let warn: MockInstance<typeof console.warn>;
	beforeEach(() => {
		resetFormControlWarnings();
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('reports the enclosing form, or null without one', async () => {
		const { form, submitter } = await mount(html`<form><test-submitter></test-submitter></form>`);
		expect(submitter.form).toBe(form);
		form.after(submitter);
		expect(submitter.form).toBeNull();
	});

	it('counts an owner that is not a <form> as none, with one warning', () => {
		const control = document.createElement('test-submitter');
		const notAForm = document.createElement('x-form-host');
		expect(formOwner(notAForm, control)).toBeNull();
		expect(formOwner(notAForm, control)).toBeNull();
		expect(warn).toHaveBeenCalledTimes(1);
		expect(String(warn.mock.calls[0][0])).toContain(
			"<test-submitter>'s form owner is <x-form-host>"
		);
	});
});

describe('one Enter listener per form (#40 FR-27)', () => {
	it('adds one keydown listener on the form root, however many members join', async () => {
		const add = vi.spyOn(document, 'addEventListener');
		const { form } = await mount(html`
			<form>
				<test-submitter type="submit"></test-submitter>
				<test-submitter type="reset"></test-submitter>
				<test-field></test-field>
			</form>
		`);
		expect(add.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(1);
		expect(enterListenerRoot(form)).toBe(document);
		add.mockRestore();
	});

	it('removes the listener when the last member leaves', async () => {
		const { form, submitters } = await mount(html`
			<form><test-submitter type="submit"></test-submitter><test-field></test-field></form>
		`);
		submitters[0].remove();
		expect(enterListenerRoot(form)).toBe(document);
		host.querySelector('test-field')!.remove();
		expect(enterListenerRoot(form)).toBeNull();
	});

	it('adds no listener for a control without a form', async () => {
		const add = vi.spyOn(document, 'addEventListener');
		await mount(html`<test-submitter type="submit"></test-submitter>`);
		expect(add.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(0);
		add.mockRestore();
	});

	it('listens on the shadow root when the form lives in one', async () => {
		const shadowHost = host.appendChild(document.createElement('div'));
		const root = shadowHost.attachShadow({ mode: 'open' });
		render(html`<form><test-submitter type="submit"></test-submitter></form>`, root);
		await root.querySelector<TestSubmitter>('test-submitter')!.updateComplete;
		expect(enterListenerRoot(root.querySelector('form')!)).toBe(root);
		shadowHost.remove();
	});
});

describe('activation after propagation (#40 OD2 b)', () => {
	it('submits in the next task, not during the click', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		submitter.click();
		expect(log).toHaveLength(0);
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('lets a window listener added later still cancel the click (FR-11)', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		const cancel = (e: Event) => e.preventDefault();
		window.addEventListener('click', cancel);
		submitter.click();
		await nextTask();
		window.removeEventListener('click', cancel);
		expect(log).toHaveLength(0);
	});

	it('still submits when a listener stops the click propagating', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		form.addEventListener('click', (e) => e.stopPropagation());
		submitter.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('ignores a click that is not a mouse event, as a native button does', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		submitter.dispatchEvent(new Event('click', { bubbles: true }));
		await nextTask();
		expect(log).toHaveLength(0);
	});

	it('reads the type after the click, so a listener that changes it decides', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		submitter.addEventListener('click', () => (submitter.type = 'button'), { once: true });
		submitter.click();
		await nextTask();
		expect(log).toHaveLength(0);
	});
});

describe('name and value (#40 OD1 b)', () => {
	it('adds name=value to form data built during its own submission only', async () => {
		const { form, submitter } = await mount(html`
			<form>
				<input name="title" value="Notes" />
				<test-submitter type="submit" name="intent" value="publish"></test-submitter>
			</form>
		`);
		const log = recordSubmits(form);
		submitter.click();
		await nextTask();
		expect(log[0].data).toEqual([
			['title', 'Notes'],
			['intent', 'publish']
		]);
		expect(log[0].submitter).toBeNull();
		expect([...new FormData(form)]).toEqual([['title', 'Notes']]);
	});

	it('adds nothing without a name', async () => {
		const { form, submitter } = await mount(html`
			<form><test-submitter type="submit" value="publish"></test-submitter></form>
		`);
		const log = recordSubmits(form);
		submitter.click();
		await nextTask();
		expect(log[0].data).toEqual([]);
	});

	it('fires no submit and stays enabled when validation blocks it (FR-29)', async () => {
		const { form, submitter } = await mount(html`
			<form>
				<input name="email" required />
				<test-submitter type="submit" name="intent" value="send"></test-submitter>
			</form>
		`);
		const log = recordSubmits(form);
		submitter.click();
		await nextTask();
		expect(log).toHaveLength(0);
		expect(submitter.disabled).toBe(false);
		expect([...new FormData(form)]).toEqual([['email', '']]);
	});
});

describe('self-disable and release (#40 FR-28 to FR-33, #49 R6)', () => {
	const submitOnce = async () => {
		const mounted = await mount(html`
			<form>
				<input name="title" value="Notes" />
				<test-submitter type="submit"></test-submitter>
			</form>
		`);
		mounted.submitter.click();
		await nextTask();
		return mounted;
	};

	it('disables itself and matches :state(submitting) after its submission', async () => {
		const { submitter } = await submitOnce();
		expect(submitter.disabled).toBe(true);
		await submitter.updateComplete;
		expect(submitter.hasAttribute('disabled')).toBe(true);
		expect(submitting(submitter)).toBe(true);
	});

	it('releases when the page sets disabled to false (FR-30)', async () => {
		const { submitter } = await submitOnce();
		await submitter.updateComplete;
		expect(submitter.inner.disabled).toBe(true);
		submitter.disabled = false;
		expect(submitting(submitter)).toBe(false);
		await submitter.updateComplete;
		expect(submitter.inner.disabled).toBe(false);
		submitter.disabled = true;
		submitter.disabled = false;
		expect(submitter.disabled).toBe(false);
	});

	it('releases when the page removes the disabled attribute', async () => {
		const { submitter } = await submitOnce();
		await submitter.updateComplete;
		submitter.removeAttribute('disabled');
		expect(submitter.disabled).toBe(false);
		expect(submitting(submitter)).toBe(false);
	});

	it('stays disabled, no longer submitting, after false then true in one task', async () => {
		const { form, submitter } = await submitOnce();
		submitter.disabled = false;
		submitter.disabled = true;
		expect(submitting(submitter)).toBe(false);
		form.reset();
		expect(submitter.disabled).toBe(true);
	});

	it('releases on an uncancelled reset, not on a cancelled one (FR-31)', async () => {
		const { form, submitter } = await submitOnce();
		const cancel = (e: Event) => e.preventDefault();
		form.addEventListener('reset', cancel, { once: true });
		form.reset();
		expect(submitter.disabled).toBe(true);
		form.reset();
		expect(submitter.disabled).toBe(false);
		expect(submitting(submitter)).toBe(false);
	});

	it('releases when the page comes back from the back/forward cache (FR-32)', async () => {
		const { submitter } = await submitOnce();
		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
		expect(submitter.disabled).toBe(true);
		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
		expect(submitter.disabled).toBe(false);
	});

	it('drops its pageshow listener while removed, and takes it back when reinserted', async () => {
		const { form, submitter } = await submitOnce();
		submitter.remove();
		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
		expect(submitter.disabled).toBe(true);
		form.append(submitter);
		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
		expect(submitter.disabled).toBe(false);
	});

	it('keeps the value a submit listener writes to disabled during the submission (FR-34)', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		form.addEventListener('submit', () => (submitter.disabled = false), { once: true });
		submitter.click();
		await nextTask();
		expect(submitter.disabled).toBe(false);
		expect(submitting(submitter)).toBe(false);
	});

	it('is never disabled by a submission the page starts (FR-33)', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		form.requestSubmit();
		expect(log).toHaveLength(1);
		expect(submitter.disabled).toBe(false);
	});

	it('ignores a second click while it is submitting (FR-28)', async () => {
		const { form, submitter } = await mount(
			html`<form><test-submitter type="submit"></test-submitter></form>`
		);
		const log = recordSubmits(form);
		submitter.click();
		submitter.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});
});

describe('Enter through the default member (#40 FR-21 to FR-27, #49 S1)', () => {
	it('submits once on Enter in a field member (FR-26)', async () => {
		const { form, field } = await mount(html`
			<form>
				<test-field></test-field>
				<input name="other" />
				<test-submitter type="submit"></test-submitter>
			</form>
		`);
		const log = recordSubmits(form);
		await userEvent.click(field.inner);
		await userEvent.keyboard('{Enter}');
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('submits once on Enter in native fields associated from outside the form', async () => {
		// Two fields, so the browser's own implicit submission can't submit: only the member can.
		render(
			html`<form id="outside-form"><test-submitter type="submit"></test-submitter></form>
				<input form="outside-form" name="a" />
				<input form="outside-form" name="b" />`,
			host
		);
		const form = host.querySelector('form')!;
		await host.querySelector<TestSubmitter>('test-submitter')!.updateComplete;
		const log = recordSubmits(form);
		await userEvent.click(host.querySelector('input')!);
		await userEvent.keyboard('{Enter}');
		await nextTask();
		expect(log).toHaveLength(1);
		expect(log[0].data).toEqual([
			['a', ''],
			['b', '']
		]);
	});

	it('leaves Enter to a native image button, which form.elements does not list (FR-23)', async () => {
		const { form } = await mount(html`
			<form>
				<input name="a" />
				<input name="b" />
				<input type="image" alt="Send" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
				<test-submitter type="submit"></test-submitter>
			</form>
		`);
		const log = recordSubmits(form);
		await userEvent.click(form.querySelector('input')!);
		await userEvent.keyboard('{Enter}');
		await nextTask();
		expect(log).toHaveLength(1);
		expect(log[0].submitter).toBeInstanceOf(HTMLInputElement);
	});

	it('treats a display: contents host as rendered (#49 C7)', async () => {
		const { form } = await mount(html`
			<form>
				<input name="a" />
				<input name="b" />
				<test-submitter type="submit" style="display: contents"></test-submitter>
			</form>
		`);
		const log = recordSubmits(form);
		await userEvent.click(form.querySelector('input')!);
		await userEvent.keyboard('{Enter}');
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('skips hidden and unassigned members when picking the default (#49 S2, C7)', async () => {
		const { form, submitters } = await mount(html`
			<form>
				<input name="a" />
				<input name="b" />
				<test-submitter type="submit" hidden></test-submitter>
				<test-no-slot><test-submitter type="submit"></test-submitter></test-no-slot>
				<test-submitter type="submit"></test-submitter>
			</form>
		`);
		const [hidden, unassigned, rendered] = submitters;
		recordSubmits(form);
		await userEvent.click(form.querySelector('input')!);
		await userEvent.keyboard('{Enter}');
		await nextTask();
		expect([hidden.disabled, unassigned.disabled, rendered.disabled]).toEqual([false, false, true]);
	});
});

describe('controls slotted into a shadow-root form (#49 C3)', () => {
	let warn: MockInstance<typeof console.warn>;
	beforeEach(() => {
		resetFormControlWarnings();
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('does nothing and warns once, naming the host', async () => {
		const { submitter } = await mount(html`
			<test-shadow-form><test-submitter type="submit">Send</test-submitter></test-shadow-form>
		`);
		const shadowForm = host.querySelector<TestShadowForm>('test-shadow-form')!;
		await shadowForm.updateComplete;
		const log = recordSubmits(shadowForm.renderRoot.querySelector('form')!);
		submitter.click();
		submitter.click();
		await nextTask();
		expect(log).toHaveLength(0);
		expect(submitter.form).toBeNull();
		expect(warn).toHaveBeenCalledTimes(1);
		expect(String(warn.mock.calls[0][0])).toContain("inside <test-shadow-form>'s shadow root");
	});

	it('stays quiet for a control in a light-DOM form, or with no form at all', async () => {
		const { submitters } = await mount(html`
			<form><test-submitter type="submit" form="no-such-form"></test-submitter></form>
			<test-submitter type="submit"></test-submitter>
		`);
		for (const submitter of submitters) submitter.click();
		await nextTask();
		expect(warn).not.toHaveBeenCalled();
	});

	it('only warns for submit and reset members', async () => {
		const { submitter } = await mount(html`
			<test-shadow-form><test-submitter>Plain</test-submitter></test-shadow-form>
		`);
		submitter.click();
		await nextTask();
		expect(warn).not.toHaveBeenCalled();
	});
});

// Keep the element classes referenced: they register their tags.
void [TestSubmitter, TestField, TestShadowForm, TestNoSlot];
