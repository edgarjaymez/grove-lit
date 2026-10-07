import { afterEach, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { html, render } from 'lit';
import './prototypes.js';
import type { ReferenceTargetForm, SpikeButton, SpikeInput } from './prototypes.js';

const host = document.body.appendChild(document.createElement('div'));
afterEach(() => render(html``, host));
const nextTask = () => new Promise((r) => setTimeout(r));

it('referenceTarget: slotted controls with form="cf" join the shadow form, but internals.form is the host', async () => {
	expect('referenceTarget' in ShadowRoot.prototype).toBe(true);
	render(
		html`<spike-rt-form id="cf">
			<spike-input form="cf" name="email" value="ada@example.com"></spike-input>
			<spike-input form="cf" name="name" value="Ada"></spike-input>
			<spike-button form="cf" slot="actions" type="submit">Send</spike-button>
		</spike-rt-form>`,
		host
	);
	const shell = host.querySelector('spike-rt-form') as ReferenceTargetForm;
	const [email, name] = host.querySelectorAll('spike-input') as unknown as SpikeInput[];
	const button = host.querySelector('spike-button') as SpikeButton;
	await Promise.all([shell, email, name, button].map((el) => el.updateComplete));
	await nextTask();

	const form = shell.formEl;
	expect([...form.elements].map((el) => (el as HTMLInputElement).name || el.localName)).toEqual([
		'own',
		'email',
		'name',
		'spike-button'
	]);
	expect([...new FormData(form)]).toEqual([
		['own', 'from-shadow'],
		['email', 'ada@example.com'],
		['name', 'Ada']
	]);
	email.required = true;
	email.value = '';
	await email.updateComplete;
	expect(form.checkValidity()).toBe(false);
	email.required = false;
	email.value = 'ada@example.com';
	await email.updateComplete;

	// The association is real, but the owner the control sees is the host, not an HTMLFormElement.
	expect(button.form).toBe(shell);
	expect(button.form instanceof HTMLFormElement).toBe(false);

	const errors: string[] = [];
	const onError = (e: ErrorEvent) => {
		errors.push(e.message);
		e.preventDefault();
	};
	window.addEventListener('error', onError);
	await userEvent.click(button);
	await nextTask();
	await nextTask();
	name.inner.focus();
	await userEvent.keyboard('{Enter}');
	await nextTask();
	window.removeEventListener('error', onError);
	expect(shell.submits).toBe(0);
	expect(errors).toEqual([
		expect.stringContaining('this.form.requestSubmit is not a function'),
		expect.stringContaining('form.elements is not iterable')
	]);

	// The page (or the form component) can still submit the inner form, with every slotted value.
	form.requestSubmit();
	expect(shell.submits).toBe(1);
	expect(shell.lastData).toEqual([
		['own', 'from-shadow'],
		['email', 'ada@example.com'],
		['name', 'Ada']
	]);
});
