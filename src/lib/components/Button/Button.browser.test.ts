import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import { LitElement, html, render } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import './Button.js';
import type { Button } from './Button.js';
import { cancelFormSubmits, nextTask, recordSubmits, settle } from '../../../test/forms.js';
import { applyTheme, themes } from '../../../test/themes.js';

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
host.id = 'button-host';

cancelFormSubmits();

afterEach(() => render(html``, host));

const mount = async (template: unknown) => {
	render(template, host);
	await settle(host);
	return {
		form: host.querySelector('form')!,
		buttons: [...host.querySelectorAll<Button>('gv-button')],
		button: host.querySelector<Button>('gv-button')!
	};
};

const inner = (el: Button) => el.shadowRoot!.querySelector<HTMLElement>('.btn')!;

/** Records, once each click has finished dispatching, whether anything cancelled it at the anchor. */
const recordLinkClicks = (anchor: HTMLElement) => {
	const prevented: boolean[] = [];
	anchor.addEventListener('click', (e) => setTimeout(() => prevented.push(e.defaultPrevented)));
	return prevented;
};

/** Link tests follow #hash links in place; each one leaves the page at the URL it started on. */
const startUrl = location.href;
afterEach(() => {
	if (location.href !== startUrl) history.replaceState(history.state, '', startUrl);
});

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
		await settle(host);
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

	it('reflects value like a native button, with no attribute until it is set', async () => {
		const { button } = await mount(html`<gv-button type="submit">Send</gv-button>`);
		expect(button.hasAttribute('value')).toBe(false);
		button.value = 'send';
		await button.updateComplete;
		expect(button.getAttribute('value')).toBe('send');
		button.removeAttribute('value');
		expect(button.value).toBe('');
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
		await settle(host);
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
		await settle(host);
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

describe('link mode (#14)', () => {
	beforeAll(() => commands.emulateMedia({ reducedMotion: 'reduce' }));
	afterAll(async () => {
		await commands.emulateMedia({ reducedMotion: 'no-preference' });
		await applyTheme(themes[0]);
	});

	const STYLE_KEYS = [
		'backgroundColor',
		'color',
		'borderTopColor',
		'borderTopStyle',
		'borderTopWidth',
		'borderRadius',
		'boxShadow',
		'paddingTop',
		'paddingLeft',
		'height',
		'width',
		'fontSize',
		'fontWeight',
		'letterSpacing',
		'textDecorationLine',
		'opacity'
	] as const;
	const look = (el: Button) => {
		const cs = getComputedStyle(inner(el));
		return Object.fromEntries(STYLE_KEYS.map((key) => [key, cs[key]]));
	};

	it('renders exactly one <a> with href, and the button without it (FR-01, FR-02)', async () => {
		const { buttons } = await mount(html`
			<gv-button href="/contact">Get in touch</gv-button>
			<gv-button>Save</gv-button>
		`);
		const [link, button] = buttons;
		expect(link.shadowRoot!.querySelectorAll('a')).toHaveLength(1);
		expect(link.shadowRoot!.querySelector('button')).toBeNull();
		expect(inner(link).getAttribute('href')).toBe('/contact');
		expect(button.shadowRoot!.querySelectorAll('button')).toHaveLength(1);
		expect(button.shadowRoot!.querySelector('a')).toBeNull();
		link.href = undefined;
		await link.updateComplete;
		expect(link.shadowRoot!.querySelector('a')).toBeNull();
	});

	it('gives both modes the same classes for every variant, colour and size (FR-03)', async () => {
		const combos = ['filled', 'tonal', 'outlined', 'ghost'].flatMap((variant) =>
			['accent', 'gray'].flatMap((color) =>
				['lg', 'md', 'sm'].map((size) => ({ variant, color, size }))
			)
		);
		const { buttons } = await mount(
			combos.map(
				({ variant, color, size }) => html`
					<gv-button variant=${variant} color=${color} size=${size} icon="tree">Go</gv-button>
					<gv-button variant=${variant} color=${color} size=${size} icon="tree" href="#go"
						>Go</gv-button
					>
				`
			)
		);
		for (let i = 0; i < buttons.length; i += 2)
			expect(inner(buttons[i + 1]).className, combos[i / 2].variant).toBe(
				inner(buttons[i]).className
			);
	});

	it('adds rel="noopener noreferrer" to target="_blank" without rel, and passes rel through (FR-04, FR-05)', async () => {
		const { buttons } = await mount(html`
			<gv-button href="https://example.com" target="_blank">New tab</gv-button>
			<gv-button href="https://example.com" target="_self">Same tab</gv-button>
			<gv-button href="https://example.com">No target</gv-button>
			<gv-button href="https://example.com" target="_blank" rel="external">Explicit</gv-button>
		`);
		const attrs = buttons.map((el) => [
			inner(el).getAttribute('target'),
			inner(el).getAttribute('rel')
		]);
		expect(attrs).toEqual([
			['_blank', 'noopener noreferrer'],
			['_self', null],
			[null, null],
			['_blank', 'external']
		]);
		buttons[0].target = undefined;
		await buttons[0].updateComplete;
		expect(inner(buttons[0]).hasAttribute('rel')).toBe(false);
	});

	it('renders a disabled link without href, out of the tab order, going nowhere (FR-06)', async () => {
		const { buttons } = await mount(html`
			<button type="button">Before</button>
			<gv-button href="#disabled-target" target="_blank" disabled>Docs</gv-button>
			<gv-button href="#after">After</gv-button>
		`);
		const [disabled, after] = buttons;
		const anchor = inner(disabled);
		expect(anchor.hasAttribute('href')).toBe(false);
		expect(anchor.hasAttribute('target')).toBe(false);
		expect(anchor.hasAttribute('rel')).toBe(false);
		expect(anchor.getAttribute('aria-disabled')).toBe('true');
		expect(anchor.getAttribute('role')).toBe('link');
		expect(await commands.ariaSnapshot('#button-host')).toContain('link "Docs" [disabled]');
		host.querySelector('button')!.focus();
		await userEvent.keyboard('{Tab}');
		expect(after.shadowRoot!.activeElement).toBe(inner(after));
		await userEvent.click(anchor, { force: true });
		await nextTask();
		expect(location.href).toBe(startUrl);
	});

	it('restores href, focus and navigation when disabled is cleared (FR-07)', async () => {
		const { button } = await mount(html`<gv-button href="#restored" disabled>Docs</gv-button>`);
		button.disabled = false;
		await button.updateComplete;
		const anchor = inner(button);
		expect(anchor.getAttribute('href')).toBe('#restored');
		expect(anchor.hasAttribute('aria-disabled')).toBe(false);
		expect(anchor.hasAttribute('role')).toBe(false);
		anchor.focus();
		expect(button.shadowRoot!.activeElement).toBe(anchor);
		const prevented = recordLinkClicks(anchor);
		await userEvent.click(anchor);
		await nextTask();
		expect(prevented).toEqual([false]);
		expect(location.hash).toBe('#restored');
	});

	it('renders no type in link mode (FR-08)', async () => {
		const { button } = await mount(html`<gv-button href="#x" type="submit">Docs</gv-button>`);
		expect(inner(button).hasAttribute('type')).toBe(false);
	});

	it('follows Enter, not Space, and never cancels the click itself (FR-09, FR-10)', async () => {
		const { button } = await mount(html`<gv-button href="#keyboard">Docs</gv-button>`);
		const prevented = recordLinkClicks(inner(button));
		inner(button).focus();
		await userEvent.keyboard('[Space]');
		await nextTask();
		expect(prevented).toEqual([]);
		await userEvent.keyboard('{Enter}');
		await nextTask();
		expect(prevented).toEqual([false]);
		expect(location.hash).toBe('#keyboard');
	});

	it('has the anchor as its only focusable element (FR-11)', async () => {
		const { button } = await mount(html`<gv-button href="#x" icon="tree">Docs</gv-button>`);
		const focusable = button.shadowRoot!.querySelectorAll(
			'a[href], button, input, select, textarea, [tabindex]'
		);
		expect([...focusable]).toEqual([inner(button)]);
	});

	for (const theme of themes)
		it(`looks the same as the button in every variant and colour in ${theme.name} (FR-DT1)`, async () => {
			await applyTheme(theme);
			const pairs = ['filled', 'tonal', 'outlined', 'ghost'].flatMap((variant) =>
				['accent', 'gray'].map((color) => ({ variant, color }))
			);
			const { buttons } = await mount(
				pairs.map(
					({ variant, color }) => html`
						<gv-button variant=${variant} color=${color}>Go</gv-button>
						<gv-button variant=${variant} color=${color} href="#go">Go</gv-button>
					`
				)
			);
			for (let i = 0; i < buttons.length; i += 2)
				expect(look(buttons[i + 1]), `${pairs[i / 2].variant} ${pairs[i / 2].color}`).toEqual(
					look(buttons[i])
				);
		});

	it('dims a disabled link like a disabled button, with no hover change (FR-DT3)', async () => {
		await applyTheme(themes[0]);
		const { buttons } = await mount(html`
			<gv-button disabled>Off</gv-button>
			<gv-button href="#off" disabled>Off</gv-button>
		`);
		const [button, link] = buttons;
		expect(look(link)).toEqual(look(button));
		expect(look(link).opacity).toBe('0.5');
		const resting = look(link);
		await userEvent.hover(inner(link));
		expect(look(link)).toEqual(resting);
	});
});

describe('link mode in a form (#49 L1 to L3)', () => {
	it('stays a working link inside a disabled fieldset (L1)', async () => {
		const { form, button } = await mount(html`
			<form>
				<fieldset disabled>
					<button type="button">Before</button>
					<gv-button href="#help">Help</gv-button>
				</fieldset>
			</form>
		`);
		const log = recordSubmits(form);
		expect(button.matches(':disabled')).toBe(true);
		expect(inner(button).getAttribute('href')).toBe('#help');
		expect(inner(button).classList.contains('btn--disabled')).toBe(false);
		inner(button).focus();
		expect(button.shadowRoot!.activeElement).toBe(inner(button));
		const prevented = recordLinkClicks(inner(button));
		// Playwright counts the anchor as disabled through its :disabled host; a user can click it.
		await userEvent.click(inner(button), { force: true });
		await nextTask();
		expect(prevented).toEqual([false]);
		expect(location.hash).toBe('#help');
		expect(log).toHaveLength(0);
	});

	it('never submits and is never the Enter default, whatever its type (L2)', async () => {
		const { form, buttons } = await mount(html`
			<form>
				<input name="first" />
				<input name="second" />
				<gv-button href="#docs" type="submit">Docs</gv-button>
				<gv-button type="submit">Send</gv-button>
			</form>
		`);
		const [link, send] = buttons;
		const log = recordSubmits(form);
		link.click();
		await nextTask();
		expect(log).toHaveLength(0);
		await enterIn(form.querySelector('input')!);
		expect(log).toHaveLength(1);
		expect([link.disabled, send.disabled]).toEqual([false, true]);
	});

	it('is still listed in form.elements (L3)', async () => {
		const { form, button } = await mount(html`<form><gv-button href="#x">Docs</gv-button></form>`);
		expect([...form.elements]).toContain(button);
	});
});

// Keep the element classes referenced: they register their tags.
void [TestFormShell, TestFormLayout];
