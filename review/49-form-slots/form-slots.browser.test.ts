import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { userEvent } from 'vitest/browser';
import { html, render } from 'lit';
import type { LitElement } from 'lit';
import '../../src/lib/components/FeedbackStrip/FeedbackStrip.js';
import '../../src/lib/components/Button/Button.js';
import { resetSlotWarnings } from '../../src/lib/utils/slot-content.js';
import {
	ActionsForm,
	AppForm,
	FormLayout,
	ShadowForm,
	SpikeButton,
	SpikeInput,
	SpikeLink,
	TemplateForm,
	flatTreeForm
} from './prototypes.js';

const host = document.body.appendChild(document.createElement('div'));
host.id = 'spike-host';
afterEach(() => render(html``, host));

const nextTask = () => new Promise((r) => setTimeout(r));
const ready = async (...els: LitElement[]) => {
	await Promise.all(els.map((el) => el.updateComplete));
	await nextTask();
};
const pressEnterIn = async (input: HTMLInputElement) => {
	input.focus();
	await userEvent.keyboard('{Enter}');
	await nextTask();
	await nextTask();
};
const clickReal = async (el: Element) => {
	await userEvent.click(el);
	await nextTask();
	await nextTask();
};
const counting = (form: HTMLFormElement) => {
	const log = { submits: 0, data: [] as [string, FormDataEntryValue][] };
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		log.submits++;
		log.data = [...new FormData(form)];
	});
	return log;
};

describe('A. Lit form owns <form> in its shadow root; button and inputs are slotted', () => {
	const mount = async () => {
		render(
			html`<spike-shadow-form>
				<spike-input id="email" name="email" required></spike-input>
				<spike-input name="name" value="Ada"></spike-input>
				<spike-button type="submit">Send</spike-button>
			</spike-shadow-form>`,
			host
		);
		const shell = host.querySelector('spike-shadow-form') as ShadowForm;
		const [email, name] = host.querySelectorAll('spike-input') as unknown as SpikeInput[];
		const button = host.querySelector('spike-button') as SpikeButton;
		await ready(shell, email, name, button);
		return { shell, email, name, button, form: shell.formEl };
	};

	it('A1 gives slotted controls no form owner and leaves them out of form.elements', async () => {
		const { form, email, name, button } = await mount();
		expect(button.form).toBeNull();
		expect(email.form).toBeNull();
		expect(name.form).toBeNull();
		expect(button.formAssociatedCalls).toEqual([]);
		expect([...form.elements].map((el) => el.localName)).toEqual(['fieldset']);
	});

	it('A2 a real click on the slotted submit button submits nothing, silently (FR-07)', async () => {
		const { shell, button } = await mount();
		const warn = vi.spyOn(console, 'warn');
		const error = vi.spyOn(console, 'error');
		await clickReal(button);
		expect(shell.submits).toBe(0);
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
		warn.mockRestore();
		error.mockRestore();
	});

	it('A3 Enter in a slotted field submits nothing: no keydown listener was ever attached', async () => {
		const { shell, name } = await mount();
		await pressEnterIn(name.inner);
		expect(shell.submits).toBe(0);
	});

	it('A4 the click and keydown do pass through the shadow <form> (composed path)', async () => {
		const { form, button, name } = await mount();
		const seen: string[] = [];
		form.addEventListener('click', () => seen.push('click'));
		form.addEventListener('keydown', () => seen.push('keydown'));
		await clickReal(button);
		await pressEnterIn(name.inner);
		expect(seen).toEqual(['click', 'keydown']);
	});

	it('A5 slotted values are not in FormData, and a required empty slotted field does not block', async () => {
		const { form, email } = await mount();
		expect([...new FormData(form)]).toEqual([]);
		expect(email.internals.validity.valueMissing).toBe(true);
		expect(form.checkValidity()).toBe(true);
	});

	it('A6 a button that found the form through the flat tree would submit an empty, unvalidated form', async () => {
		const { shell, form, button, email } = await mount();
		expect(flatTreeForm(button)).toBe(form);
		expect(email.internals.validity.valid).toBe(false);
		flatTreeForm(button)!.requestSubmit();
		expect(shell.submits).toBe(1);
		expect(shell.lastData).toEqual([]);
	});

	it('A7 the shadow <fieldset disabled> does not disable slotted controls', async () => {
		const { shell, button, email } = await mount();
		shell.locked = true;
		await ready(shell, button);
		expect(button.formDisabledCalls).toEqual([]);
		expect(email.formDisabledCalls).toEqual([]);
		expect(button.matches(':disabled')).toBe(false);
	});

	it('A8 form.reset() does not reach slotted controls', async () => {
		const { form, name } = await mount();
		name.value = 'Changed';
		await name.updateComplete;
		form.reset();
		await name.updateComplete;
		expect(name.resets).toBe(0);
		expect(name.value).toBe('Changed');
	});

	it('A9 form="inner" cannot reach the shadow form: the id is looked up in the button\'s own tree', async () => {
		const { button } = await mount();
		button.setAttribute('form', 'inner');
		expect(button.form).toBeNull();
	});

	it('A10 a <label> in the shadow root cannot label a slotted control', async () => {
		const { shell } = await mount();
		const label = shell.renderRoot.querySelector('label')!;
		expect(label.control).toBeNull();
	});

	it('A11 native controls slotted the same way behave the same: this is the platform rule', async () => {
		render(
			html`<spike-shadow-form>
				<input name="q" value="native" />
				<button type="submit">Go</button>
			</spike-shadow-form>`,
			host
		);
		const shell = host.querySelector('spike-shadow-form') as ShadowForm;
		await ready(shell);
		const input = host.querySelector('input')!;
		const button = host.querySelector('button')!;
		expect(input.form).toBeNull();
		expect(button.form).toBeNull();
		await clickReal(button);
		await pressEnterIn(input);
		expect(shell.submits).toBe(0);
	});
});

describe('B. Lit form renders its own fields; the button comes in through an actions slot', () => {
	it('B1 control: the button in the same template submits once, with every value', async () => {
		render(html`<spike-template-form></spike-template-form>`, host);
		const shell = host.querySelector('spike-template-form') as TemplateForm;
		await ready(shell);
		const button = shell.renderRoot.querySelector('spike-button') as SpikeButton;
		const [, name] = shell.renderRoot.querySelectorAll('spike-input') as unknown as SpikeInput[];
		await ready(button, name);
		expect(button.form).toBe(shell.formEl);
		await clickReal(button);
		expect(shell.submits).toBe(1);
		expect(shell.lastData).toEqual([
			['email', 'ada@example.com'],
			['name', 'Ada']
		]);
		await pressEnterIn(name.inner);
		expect(shell.submits).toBe(2);
	});

	it('B2 the slotted button has no owner: click and Enter submit nothing', async () => {
		render(
			html`<spike-actions-form
				><spike-button slot="actions" type="submit">Send</spike-button></spike-actions-form
			>`,
			host
		);
		const shell = host.querySelector('spike-actions-form') as ActionsForm;
		const button = host.querySelector('spike-button') as SpikeButton;
		await ready(shell, button);
		const [, name] = shell.renderRoot.querySelectorAll('spike-input') as unknown as SpikeInput[];
		await ready(name);
		expect(name.form).toBe(shell.formEl);
		expect(button.form).toBeNull();
		await clickReal(button);
		await pressEnterIn(name.inner);
		expect(shell.submits).toBe(0);
		expect(flatTreeForm(button)).toBe(shell.formEl);
	});
});

describe("C. Shell component around the consumer's light-DOM <form> (Lion pattern)", () => {
	const mount = async () => {
		render(
			html`<spike-form-shell>
				<form id="f">
					<spike-input name="email" value="ada@example.com"></spike-input>
					<spike-input name="name" value="Ada"></spike-input>
					<spike-button type="reset">Clear</spike-button>
					<spike-button type="submit">Send</spike-button>
				</form>
			</spike-form-shell>`,
			host
		);
		const form = host.querySelector('form')!;
		const [email, name] = host.querySelectorAll('spike-input') as unknown as SpikeInput[];
		const [reset, submit] = host.querySelectorAll('spike-button') as unknown as SpikeButton[];
		await ready(host.querySelector('spike-form-shell') as LitElement, email, name, reset, submit);
		return { form, email, name, reset, submit, log: counting(form) };
	};

	it('C1 associates every control, slotted or not', async () => {
		const { form, email, submit } = await mount();
		expect(submit.form).toBe(form);
		expect(email.form).toBe(form);
		expect([...form.elements].map((el) => el.localName)).toEqual([
			'spike-input',
			'spike-input',
			'spike-button',
			'spike-button'
		]);
	});

	it('C2 click and Enter each submit once, with every value', async () => {
		const { submit, name, log } = await mount();
		await clickReal(submit);
		expect(log.submits).toBe(1);
		expect(log.data).toEqual([
			['email', 'ada@example.com'],
			['name', 'Ada']
		]);
		await pressEnterIn(name.inner);
		expect(log.submits).toBe(2);
	});

	it('C3 reset, validation and a light-DOM disabled fieldset all reach the controls', async () => {
		const { form, name, reset, submit } = await mount();
		name.value = 'Changed';
		await name.updateComplete;
		await clickReal(reset);
		await name.updateComplete;
		expect(name.resets).toBe(1);
		expect(name.value).toBe('Ada');

		name.required = true;
		name.value = '';
		await name.updateComplete;
		expect(form.checkValidity()).toBe(false);

		const fieldset = document.createElement('fieldset');
		fieldset.disabled = true;
		form.append(fieldset);
		fieldset.append(submit);
		await submit.updateComplete;
		expect(submit.formDisabledCalls.at(-1)).toBe(true);
		expect(submit.matches(':disabled')).toBe(true);
	});
});

describe("D. Layout component used inside the consumer's light-DOM <form>", () => {
	const mount = async () => {
		render(
			html`<form>
				<spike-form-layout>
					<spike-input slot="fields" name="email" value="ada@example.com"></spike-input>
					<spike-input slot="fields" name="name" value="Ada"></spike-input>
					<spike-button slot="actions" type="submit">Send</spike-button>
				</spike-form-layout>
			</form>`,
			host
		);
		const form = host.querySelector('form')!;
		const layout = host.querySelector('spike-form-layout') as FormLayout;
		const [, name] = host.querySelectorAll('spike-input') as unknown as SpikeInput[];
		const button = host.querySelector('spike-button') as SpikeButton;
		await ready(layout, name, button);
		return { form, layout, name, button, log: counting(form) };
	};

	it('D1 slotting changes nothing: click and Enter submit once, with every value', async () => {
		const { button, name, log } = await mount();
		await clickReal(button);
		await pressEnterIn(name.inner);
		expect(log.submits).toBe(2);
		expect(log.data).toEqual([
			['email', 'ada@example.com'],
			['name', 'Ada']
		]);
	});

	it("D2 the layout's own shadow <fieldset disabled> does not disable slotted controls", async () => {
		const { layout, button, log } = await mount();
		layout.locked = true;
		await ready(layout, button);
		expect(button.formDisabledCalls).toEqual([]);
		expect(button.matches(':disabled')).toBe(false);
		await clickReal(button);
		expect(log.submits).toBe(1);
	});

	it('D3 a control assigned to no slot stays listed, but is not rendered', async () => {
		const { form, layout } = await mount();
		const stray = document.createElement('spike-button') as SpikeButton;
		stray.type = 'submit';
		stray.slot = 'footer';
		layout.append(stray);
		await ready(stray);
		expect(stray.form).toBe(form);
		expect([...form.elements]).toContain(stray);
		expect(stray.checkVisibility()).toBe(false);
	});
});

describe('D (cont.)', () => {
	it('D4 a required field assigned to no slot blocks submit with nothing on screen', async () => {
		render(
			html`<form>
				<spike-form-layout>
					<spike-input slot="nowhere" name="hidden-twin" required></spike-input>
					<spike-input slot="fields" name="name" value="Ada"></spike-input>
					<spike-button slot="actions" type="submit">Send</spike-button>
				</spike-form-layout>
			</form>`,
			host
		);
		const form = host.querySelector('form')!;
		const [stray] = host.querySelectorAll('spike-input') as unknown as SpikeInput[];
		const button = host.querySelector('spike-button') as SpikeButton;
		await ready(host.querySelector('spike-form-layout') as LitElement, stray, button);
		const log = counting(form);
		expect(stray.checkVisibility()).toBe(false);
		expect(form.checkValidity()).toBe(false);
		await clickReal(button);
		expect(log.submits).toBe(0);
	});

	it('D5 a consumer Lit form that renders <form> and controls in its own template can slot them freely', async () => {
		render(html`<spike-app-form></spike-app-form>`, host);
		const app = host.querySelector('spike-app-form') as AppForm;
		await ready(app);
		const layout = app.renderRoot.querySelector('spike-form-layout') as FormLayout;
		const [, name] = app.renderRoot.querySelectorAll('spike-input') as unknown as SpikeInput[];
		const button = app.renderRoot.querySelector('spike-button') as SpikeButton;
		await ready(layout, name, button);
		expect(button.form).toBe(app.formEl);
		await clickReal(button);
		await pressEnterIn(name.inner);
		expect(app.submits).toBe(2);
		expect(app.lastData).toEqual([
			['email', 'ada@example.com'],
			['name', 'Ada']
		]);
	});
});

describe("E. The slot contract's form-control warning, once gv-button is form-associated", () => {
	let warn: MockInstance<typeof console.warn>;
	beforeEach(() => {
		resetSlotWarnings();
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('E1 today: a gv-button in a feedback-strip message is quiet', async () => {
		render(
			html`<gv-feedback-strip heading="Draft saved"
				><span slot="message">Saved. <gv-button>Undo</gv-button></span></gv-feedback-strip
			>`,
			host
		);
		await ready(host.querySelector('gv-feedback-strip') as LitElement);
		expect(warn).not.toHaveBeenCalled();
	});

	it('E2 after #49: the same markup with a form-associated button warns', async () => {
		render(
			html`<gv-feedback-strip heading="Draft saved"
				><span slot="message">Saved. <spike-button>Undo</spike-button></span></gv-feedback-strip
			>`,
			host
		);
		await ready(host.querySelector('gv-feedback-strip') as LitElement);
		expect(warn).toHaveBeenCalledTimes(1);
		expect(String(warn.mock.calls[0][0])).toContain(
			'<gv-feedback-strip> slot "message" contains <spike-button>'
		);
	});
});

describe('F. #49 S2: checkVisibility() as the "rendered" test', () => {
	it('F1 is false for a host with display: contents, so Enter skips a visible, clickable button', async () => {
		render(
			html`<form>
				<spike-input name="email" value="ada@example.com"></spike-input>
				<spike-input name="name" value="Ada"></spike-input>
				<spike-button type="submit" style="display: contents">Send</spike-button>
			</form>`,
			host
		);
		const form = host.querySelector('form')!;
		const [, name] = host.querySelectorAll('spike-input') as unknown as SpikeInput[];
		const button = host.querySelector('spike-button') as SpikeButton;
		await ready(name, button);
		const log = counting(form);
		expect(button.checkVisibility()).toBe(false);
		expect(button.renderRoot.querySelector('button')!.checkVisibility()).toBe(true);
		await pressEnterIn(name.inner);
		expect(log.submits).toBe(0);
		await clickReal(button.renderRoot.querySelector('button')!);
		expect(log.submits).toBe(1);
	});
});

describe('G. #49 L1: link mode on a form-associated host inside <fieldset disabled>', () => {
	const mount = async (disabled: boolean) => {
		render(
			html`<form>
				<button type="button" id="before">before</button>
				<fieldset ?disabled=${disabled}><spike-link></spike-link></fieldset>
			</form>`,
			host
		);
		const link = host.querySelector('spike-link') as SpikeLink;
		await ready(link);
		return { link, anchor: link.renderRoot.querySelector('a')! };
	};

	for (const disabled of [false, true])
		it(`G${disabled ? 2 : 1} ${disabled ? 'disabled' : 'enabled'} fieldset: the anchor still takes Tab and a trusted click`, async () => {
			const { link, anchor } = await mount(disabled);
			const clicks: boolean[] = [];
			anchor.addEventListener('click', (e) => {
				clicks.push(e.isTrusted);
				e.preventDefault();
			});
			(host.querySelector('#before') as HTMLButtonElement).focus();
			await userEvent.keyboard('{Tab}');
			expect(link.shadowRoot!.activeElement).toBe(anchor);
			await userEvent.click(anchor, { force: true });
			await nextTask();
			expect(clicks).toEqual([true]);
			// The host still matches :disabled, so page CSS written for disabled buttons dims a working link.
			expect(link.matches(':disabled')).toBe(disabled);
		});
});
