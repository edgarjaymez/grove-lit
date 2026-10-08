import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { LitElement, html, render } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import './Button.js';
import type { Button } from './Button.js';

/** A page shell around a slotted light-DOM form: supported (#49 C2). */
@customElement('test-form-shell')
class TestFormShell extends LitElement {
	render() {
		return html`<section>
			<h2>Contact</h2>
			<slot></slot>
		</section>`;
	}
}

/** A layout used inside a form: supported (#49 C2). */
@customElement('test-form-layout')
class TestFormLayout extends LitElement {
	render() {
		return html`<div style="display: grid; gap: 8px"><slot></slot></div>`;
	}
}

/**
 * A Lit form that renders its <form> and controls in one template: supported (#49 C2). It handles the
 * submission itself, the common Lit way, and re-enables its button once the request settles (FR-34).
 */
@customElement('test-lit-form')
class TestLitForm extends LitElement {
	@query('gv-button[type=submit]') submitButton!: Button;
	readonly sent: [string, FormDataEntryValue][][] = [];
	request: Promise<void> = Promise.resolve();
	/** Settles the pending request, standing in for the server's answer. */
	respond = () => {};

	private _onSubmit(event: SubmitEvent) {
		event.preventDefault();
		this.sent.push([...new FormData(event.target as HTMLFormElement)]);
		const answer = new Promise<void>((resolve) => (this.respond = resolve));
		this.request = (async () => {
			try {
				await answer;
			} finally {
				this.submitButton.disabled = false;
			}
		})();
	}

	render() {
		return html`<form @submit=${this._onSubmit}>
			<input name="title" value="Notes" />
			<input name="tags" />
			<gv-button type="submit" name="intent" value="publish">Publish</gv-button>
			<gv-button type="reset">Clear</gv-button>
		</form>`;
	}
}

const host = document.body.appendChild(document.createElement('div'));

/** Submissions never navigate the test page; the counts come from listeners on each form. */
document.addEventListener('submit', (e) => e.preventDefault());

afterEach(() => render(html``, host));

const nextTask = () => new Promise((resolve) => setTimeout(resolve));

const settle = async () => {
	for (let i = 0; i < 2; i++) {
		const all = [...host.querySelectorAll('*')].filter((el) => el instanceof LitElement);
		await Promise.all(all.map((el) => (el as LitElement).updateComplete));
	}
};

const mount = async (template: unknown) => {
	render(template, host);
	await settle();
	return {
		form: host.querySelector('form')!,
		buttons: [...host.querySelectorAll<Button>('gv-button')],
		button: host.querySelector<Button>('gv-button')!
	};
};

const inner = (el: Button) => el.shadowRoot!.querySelector<HTMLElement>('.btn')!;

/** Counts submit events on a form and keeps each one's form data and submitter. */
const recordSubmits = (form: HTMLFormElement) => {
	const log: { data: [string, FormDataEntryValue][]; submitter: HTMLElement | null }[] = [];
	form.addEventListener('submit', (e) =>
		log.push({ data: [...new FormData(form)], submitter: (e as SubmitEvent).submitter })
	);
	return log;
};

/** Focuses a field the way a user would, then presses Enter. */
const enterIn = async (field: HTMLElement) => {
	await userEvent.click(field);
	await userEvent.keyboard('{Enter}');
	await nextTask();
};

describe('gv-button type="submit" and "reset" (#40 FR-01 to FR-13)', () => {
	it('submits once per activation by pointer, Enter and Space (FR-01)', async () => {
		const { form, buttons } = await mount(html`
			<form>
				<gv-button type="submit">Pointer</gv-button>
				<gv-button type="submit">Enter</gv-button>
				<gv-button type="submit">Space</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		const [byPointer, byEnter, bySpace] = buttons;
		await userEvent.click(inner(byPointer));
		await nextTask();
		inner(byEnter).focus();
		await userEvent.keyboard('{Enter}');
		await nextTask();
		inner(bySpace).focus();
		await userEvent.keyboard('[Space]');
		await nextTask();
		expect(log).toHaveLength(3);
		expect(buttons.map((b) => b.disabled)).toEqual([true, true, true]);
	});

	it('fires invalid, not submit, when a control is invalid (FR-02)', async () => {
		const { form, button } = await mount(html`
			<form><input name="email" required /><gv-button type="submit">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		let invalid = 0;
		form.querySelector('input')!.addEventListener('invalid', () => invalid++);
		await userEvent.click(inner(button));
		await nextTask();
		expect([log.length, invalid]).toEqual([0, 1]);
	});

	it('submits a form with novalidate even when a control is invalid', async () => {
		const { form, button } = await mount(html`
			<form novalidate>
				<input name="email" required /><gv-button type="submit">Send</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		button.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('resets its form, through a cancelable reset event (FR-04)', async () => {
		const { form, button } = await mount(html`
			<form><input name="title" value="Draft" /><gv-button type="reset">Clear</gv-button></form>
		`);
		const input = form.querySelector('input')!;
		input.value = 'Edited';
		const cancel = (e: Event) => e.preventDefault();
		form.addEventListener('reset', cancel, { once: true });
		button.click();
		await nextTask();
		expect(input.value).toBe('Edited');
		button.click();
		await nextTask();
		expect(input.value).toBe('Draft');
	});

	it('does nothing in its form as type="button" or an unknown type (FR-05)', async () => {
		const { form, buttons } = await mount(html`
			<form>
				<input name="title" value="Draft" />
				<gv-button>Default</gv-button>
				<gv-button type="button">Button</gv-button>
				<gv-button type="submits">Typo</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		form.querySelector('input')!.value = 'Edited';
		for (const button of buttons) button.click();
		await nextTask();
		expect(log).toHaveLength(0);
		expect(form.querySelector('input')!.value).toBe('Edited');
	});

	it('takes a runtime type change on the next activation, both ways (FR-06)', async () => {
		const { form, button } = await mount(html`<form><gv-button>Send</gv-button></form>`);
		const log = recordSubmits(form);
		button.type = 'submit';
		button.click();
		await nextTask();
		expect(log).toHaveLength(1);
		button.disabled = false;
		button.type = 'button';
		await button.updateComplete;
		button.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('does nothing without a form owner (FR-07)', async () => {
		const { buttons } = await mount(html`
			<gv-button type="submit">Lost</gv-button>
			<form><gv-button type="submit" form="no-such-form">Pointed away</gv-button></form>
		`);
		for (const button of buttons) button.click();
		await nextTask();
		expect(buttons.map((b) => [b.form, b.disabled])).toEqual([
			[null, false],
			[null, false]
		]);
	});

	it('follows form="id" over its ancestor form, and re-associates when it changes (FR-08)', async () => {
		const { buttons } = await mount(html`
			<form id="near"><gv-button type="submit" form="far">Send</gv-button></form>
			<form id="far"></form>
		`);
		const [button] = buttons;
		const near = host.querySelector<HTMLFormElement>('#near')!;
		const far = host.querySelector<HTMLFormElement>('#far')!;
		const nearLog = recordSubmits(near);
		const farLog = recordSubmits(far);
		expect(button.form).toBe(far);
		button.click();
		await nextTask();
		expect([nearLog.length, farLog.length]).toEqual([0, 1]);
		button.disabled = false;
		button.removeAttribute('form');
		await button.updateComplete;
		expect(button.form).toBe(near);
		button.click();
		await nextTask();
		expect([nearLog.length, farLog.length]).toEqual([1, 1]);
	});

	it('acts on its new owner after moving between forms (FR-09)', async () => {
		const { buttons } = await mount(html`
			<form id="first"><gv-button type="submit">Send</gv-button></form>
			<form id="second"></form>
		`);
		const [button] = buttons;
		const second = host.querySelector<HTMLFormElement>('#second')!;
		const log = recordSubmits(second);
		second.append(button);
		button.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('is listed in form.elements and its fieldset, and adds no form data by itself (FR-10)', async () => {
		const { form, button } = await mount(html`
			<form>
				<fieldset><gv-button type="submit" name="intent" value="send">Send</gv-button></fieldset>
				<input name="title" value="Notes" />
			</form>
		`);
		expect([...form.elements]).toContain(button);
		expect([...form.querySelector('fieldset')!.elements]).toContain(button);
		expect([...new FormData(form)]).toEqual([['title', 'Notes']]);
	});

	it('is cancelled by preventDefault on a trusted click anywhere on its path (FR-11)', async () => {
		const { form, button } = await mount(html`
			<form><gv-button type="submit">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		const cancel = (e: Event) => e.preventDefault();
		for (const target of [button, form, document, window]) {
			target.addEventListener('click', cancel);
			await userEvent.click(inner(button));
			await nextTask();
			target.removeEventListener('click', cancel);
		}
		expect(log).toHaveLength(0);
		expect(button.disabled).toBe(false);
	});

	it('gives exactly one submit with or without a consumer click bridge (FR-12)', async () => {
		const { form, button } = await mount(html`
			<form><gv-button type="submit">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		const bridge = (e: Event) => {
			if ((e.target as Element).localName !== 'gv-button') return;
			e.preventDefault();
			form.requestSubmit();
		};
		form.addEventListener('click', bridge);
		await userEvent.click(inner(button));
		await nextTask();
		expect(log).toHaveLength(1);
		form.removeEventListener('click', bridge);
		await userEvent.click(inner(button));
		await nextTask();
		expect(log).toHaveLength(2);
	});

	it('submits from el.click(), in the next task (FR-13)', async () => {
		const { form, button } = await mount(html`
			<form><gv-button type="submit">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		button.click();
		expect(log).toHaveLength(0);
		await nextTask();
		expect(log).toHaveLength(1);
	});
});

describe('disabled (#40 FR-14, FR-15)', () => {
	it('blocks every path while disabled, and restores them when cleared (FR-14)', async () => {
		const { form, button } = await mount(html`
			<form>
				<label for="send">Send it</label>
				<gv-button id="send" type="submit" disabled>Send</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		const label = form.querySelector('label')!;
		await userEvent.click(button, { force: true });
		button.click();
		await userEvent.click(label);
		await nextTask();
		expect(log).toHaveLength(0);
		expect(inner(button).matches(':disabled')).toBe(true);
		button.disabled = false;
		await button.updateComplete;
		await userEvent.click(label);
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('renders disabled in a disabled fieldset without writing disabled (FR-15)', async () => {
		const { form, buttons } = await mount(html`
			<form>
				<fieldset disabled>
					<legend><gv-button type="submit">In the legend</gv-button></legend>
					<gv-button type="submit">In the fieldset</gv-button>
				</fieldset>
			</form>
		`);
		const [inLegend, inFieldset] = buttons;
		const log = recordSubmits(form);
		expect(inFieldset.matches(':disabled')).toBe(true);
		expect(inFieldset.disabled).toBe(false);
		expect(inner(inFieldset).matches(':disabled')).toBe(true);
		expect(inLegend.matches(':disabled')).toBe(false);
		inFieldset.click();
		await nextTask();
		expect(log).toHaveLength(0);
		form.querySelector('fieldset')!.disabled = false;
		await settle();
		expect(inner(inFieldset).matches(':disabled')).toBe(false);
		inFieldset.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('keeps its inner button type="button" and its classes, and reports no submitter (FR-16)', async () => {
		const { form, button } = await mount(html`
			<form><gv-button type="submit" variant="tonal" color="gray" size="sm">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		expect(inner(button).getAttribute('type')).toBe('button');
		expect([...inner(button).classList].sort()).toEqual(
			['btn', 'btn--gray', 'btn--sm', 'btn--tonal', 'gv-focusable'].sort()
		);
		button.click();
		await nextTask();
		expect(log[0].submitter).toBeNull();
	});
});

describe('Enter through the default gv-button (#40 FR-21 to FR-28, #49 S1)', () => {
	const twoFields = html`<input name="first" /><input name="second" />`;

	it('submits once on Enter in either of two fields (FR-21)', async () => {
		const { form } = await mount(
			html`<form>${twoFields}<gv-button type="submit">Send</gv-button></form>`
		);
		const log = recordSubmits(form);
		const [first, second] = form.querySelectorAll('input');
		await enterIn(first);
		form.querySelector<Button>('gv-button')!.disabled = false;
		await enterIn(second);
		expect(log).toHaveLength(2);
	});

	it('does not submit from a textarea, a select or a button, or while composing (FR-22)', async () => {
		const { form } = await mount(html`
			<form>
				<input name="first" />
				<textarea name="notes"></textarea>
				<select name="tone">
					<option>Calm</option>
				</select>
				<button type="button">Plain</button>
				<gv-button type="submit">Send</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		await enterIn(form.querySelector('textarea')!);
		form.querySelector('select')!.focus();
		await userEvent.keyboard('{Enter}');
		form.querySelector('button')!.focus();
		await userEvent.keyboard('{Enter}');
		await nextTask();
		const press = (isComposing: boolean) =>
			form.querySelector('input')!.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'Enter',
					isComposing,
					bubbles: true,
					composed: true,
					cancelable: true
				})
			);
		press(true);
		await nextTask();
		expect(log).toHaveLength(0);
		press(false);
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('lets a field listener veto Enter by cancelling the keydown (FR-22)', async () => {
		const { form } = await mount(
			html`<form>${twoFields}<gv-button type="submit">Send</gv-button></form>`
		);
		const log = recordSubmits(form);
		const first = form.querySelector('input')!;
		first.addEventListener('keydown', (e) => e.preventDefault());
		await enterIn(first);
		expect(log).toHaveLength(0);
	});

	it('leaves Enter to a native submit button, and takes it back when it goes (FR-23)', async () => {
		const { form, button } = await mount(html`
			<form>
				${twoFields}
				<button>Native</button>
				<gv-button type="submit">Send</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		const native = form.querySelector('button')!;
		await enterIn(form.querySelector('input')!);
		expect(log.map((entry) => entry.submitter)).toEqual([native]);
		expect(button.disabled).toBe(false);
		native.remove();
		await enterIn(form.querySelector('input')!);
		expect(log).toHaveLength(2);
		expect(button.disabled).toBe(true);
	});

	it('uses only the first submit gv-button in form.elements, and the next when it goes (FR-24)', async () => {
		const { form, buttons } = await mount(html`
			<form>
				${twoFields}
				<gv-button type="submit">First</gv-button>
				<gv-button type="submit">Second</gv-button>
			</form>
		`);
		const [first, second] = buttons;
		recordSubmits(form);
		await enterIn(form.querySelector('input')!);
		expect([first.disabled, second.disabled]).toEqual([true, false]);
		first.type = 'button';
		await enterIn(form.querySelector('input')!);
		expect(second.disabled).toBe(true);
	});

	it('blocks Enter with a disabled default, even on a single-field form (FR-25)', async () => {
		const { form, button } = await mount(html`
			<form>
				<input name="only" />
				<gv-button type="submit" disabled>Send</gv-button>
				<gv-button type="submit">Second</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		await enterIn(form.querySelector('input')!);
		expect(log).toHaveLength(0);
		button.disabled = false;
		await button.updateComplete;
		await enterIn(form.querySelector('input')!);
		expect(log).toHaveLength(1);
	});

	it('submits exactly once on Enter in a single-field form (#49 S1)', async () => {
		const { form, button } = await mount(html`
			<form><input name="only" /><gv-button type="submit">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		await enterIn(form.querySelector('input')!);
		await nextTask();
		expect(log).toHaveLength(1);
		expect(button.disabled).toBe(true);
	});

	it('submits once on a double click (FR-28)', async () => {
		const { form, button } = await mount(html`
			<form><gv-button type="submit">Send</gv-button></form>
		`);
		const log = recordSubmits(form);
		await userEvent.dblClick(inner(button));
		await nextTask();
		expect(log).toHaveLength(1);
	});
});

describe('name and value (#40 OD1 b)', () => {
	it('submits only the pressed named button', async () => {
		const { form, buttons } = await mount(html`
			<form>
				<input name="title" value="Notes" />
				<gv-button type="submit" name="intent" value="draft">Save draft</gv-button>
				<gv-button type="submit" name="intent" value="publish">Publish</gv-button>
			</form>
		`);
		const log = recordSubmits(form);
		await userEvent.click(inner(buttons[1]));
		await nextTask();
		expect(log[0].data).toEqual([
			['title', 'Notes'],
			['intent', 'publish']
		]);
		expect(buttons[0].getAttribute('name')).toBe('intent');
	});
});

describe('supported compositions (#49 C2)', () => {
	it('works in a shell around a slotted light-DOM form', async () => {
		const { form, buttons } = await mount(html`
			<test-form-shell>
				<form>
					<input name="first" value="Ada" />
					<input name="second" />
					<gv-button type="submit">Send</gv-button>
					<gv-button type="reset">Clear</gv-button>
				</form>
			</test-form-shell>
		`);
		const [send, clear] = buttons;
		const log = recordSubmits(form);
		const [first] = form.querySelectorAll('input');
		await userEvent.click(inner(send));
		await nextTask();
		send.disabled = false;
		await enterIn(first);
		expect(log.map((entry) => entry.data)).toEqual([
			[
				['first', 'Ada'],
				['second', '']
			],
			[
				['first', 'Ada'],
				['second', '']
			]
		]);
		first.value = 'Grace';
		clear.click();
		await nextTask();
		expect(first.value).toBe('Ada');
	});

	it('works for a layout used inside a form, including a disabled fieldset', async () => {
		const { form, buttons } = await mount(html`
			<form>
				<test-form-layout>
					<input name="first" value="Ada" />
					<input name="second" />
					<gv-button type="submit">Send</gv-button>
				</test-form-layout>
				<fieldset disabled>
					<test-form-layout><gv-button type="submit">Locked</gv-button></test-form-layout>
				</fieldset>
			</form>
		`);
		const [send, locked] = buttons;
		const log = recordSubmits(form);
		expect(send.form).toBe(form);
		await enterIn(form.querySelector('input')!);
		expect(log).toHaveLength(1);
		expect(locked.matches(':disabled')).toBe(true);
		locked.click();
		await nextTask();
		expect(log).toHaveLength(1);
	});

	it('works for a Lit form that renders its form and controls, and re-enables after its request', async () => {
		render(html`<test-lit-form></test-lit-form>`, host);
		const litForm = host.querySelector<TestLitForm>('test-lit-form')!;
		await litForm.updateComplete;
		await settle();
		const send = litForm.submitButton;
		await send.updateComplete;
		await userEvent.click(inner(send));
		await nextTask();
		expect(send.disabled).toBe(true);
		expect(send.matches(':state(submitting)')).toBe(true);
		litForm.respond();
		await litForm.request;
		expect(send.disabled).toBe(false);
		expect(send.matches(':state(submitting)')).toBe(false);
		await settle();
		expect(inner(send).matches(':disabled')).toBe(false);
		await userEvent.click(inner(send));
		await nextTask();
		expect(litForm.sent).toEqual([
			[
				['title', 'Notes'],
				['tags', ''],
				['intent', 'publish']
			],
			[
				['title', 'Notes'],
				['tags', ''],
				['intent', 'publish']
			]
		]);
	});
});

// Keep the element classes referenced: they register their tags.
void [TestFormShell, TestFormLayout];
