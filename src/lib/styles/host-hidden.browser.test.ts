import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { groveTags } from '../../test/grove-tags.js';
import { applyTheme, themes } from '../../test/themes.js';

const FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

const mount = async (tag: string, hidden = false) => {
	const el = document.createElement(tag) as HTMLElement & { updateComplete?: Promise<unknown> };
	el.hidden = hidden;
	document.body.append(el);
	await el.updateComplete;
	return el;
};

const innerFocusable = (el: HTMLElement) =>
	el.shadowRoot?.querySelector<HTMLElement>(FOCUSABLE) ?? null;

const tryFocus = (el: HTMLElement) => {
	const inner = innerFocusable(el);
	inner?.focus();
	return el.shadowRoot?.activeElement === inner && inner !== null;
};

afterEach(() => {
	document.body.replaceChildren();
	document.head.querySelectorAll('style[data-test]').forEach((s) => s.remove());
});

afterAll(() => applyTheme(themes[0]));

it('covers every registered component', () => {
	expect(groveTags.length).toBe(15);
});

describe.each(themes)('hidden on every gv-* element ($name)', (theme) => {
	beforeAll(() => applyTheme(theme));

	it.each(groveTags)('%s hides with hidden and restores without it', async (tag) => {
		const el = await mount(tag);
		const display = getComputedStyle(el).display;
		const rect = el.getBoundingClientRect().toJSON();
		const focusableAtRest = innerFocusable(el) !== null;

		el.setAttribute('hidden', '');
		expect(getComputedStyle(el).display).toBe('none');
		expect(el.getClientRects().length).toBe(0);
		expect(tryFocus(el)).toBe(false);

		el.removeAttribute('hidden');
		expect(getComputedStyle(el).display).toBe(display);
		expect(el.getBoundingClientRect().toJSON()).toEqual(rect);
		expect(tryFocus(el)).toBe(focusableAtRest);
	});

	it.each(groveTags)('%s treats the hidden property like the attribute', async (tag) => {
		const el = await mount(tag);
		el.hidden = true;
		expect(el.hasAttribute('hidden')).toBe(true);
		expect(getComputedStyle(el).display).toBe('none');
		el.hidden = false;
		expect(getComputedStyle(el).display).not.toBe('none');
	});

	it.each(groveTags)('%s stays hidden when it upgrades with hidden already set', async (tag) => {
		const el = await mount(tag, true);
		expect(getComputedStyle(el).display).toBe('none');
	});

	it.each(groveTags)('%s beats a page display rule on the host', async (tag) => {
		const style = document.createElement('style');
		style.dataset.test = '';
		style.textContent = `${tag} { display: grid; }`;
		document.head.append(style);

		const el = await mount(tag, true);
		expect(getComputedStyle(el).display).toBe('none');
		el.hidden = false;
		expect(getComputedStyle(el).display).toBe('grid');
	});

	it.each(groveTags)('%s leaves hidden="until-found" to the browser', async (tag) => {
		const el = await mount(tag);
		el.setAttribute('hidden', 'until-found');
		expect(getComputedStyle(el).display).not.toBe('none');
	});
});
