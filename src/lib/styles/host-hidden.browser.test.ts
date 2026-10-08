import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import { groveTags } from '../../test/grove-tags.js';
import { applyTheme, themes } from '../../test/themes.js';

type GroveElement = HTMLElement & { updateComplete?: Promise<unknown> };

const FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

/** The components that render a focusable control once given FIXTURE_ATTRS (#35 FR-02 names six). */
const INTERACTIVE = [
	'gv-back-button',
	'gv-button',
	'gv-checkbox',
	'gv-color-swatch',
	'gv-icon-button',
	'gv-menu-item',
	'gv-text-input',
	'gv-todo-category-toggler',
	'gv-todo-list-item'
];

/** Attributes a component needs before it renders its focusable control. */
const FIXTURE_ATTRS: Record<string, Record<string, string>> = {
	'gv-menu-item': { href: '#' }
};

/** Waits for the element and every Grove element nested in its shadow tree to render. */
const settle = async (host: Element): Promise<void> => {
	await (host as GroveElement).updateComplete;
	for (const el of host.shadowRoot?.querySelectorAll('*') ?? [])
		if (el.shadowRoot) await settle(el);
};

const frame = () => new Promise((r) => requestAnimationFrame(r));

/** Every focusable control in the shadow tree, nested Grove shadow roots included, in tree order. */
const focusables = (host: Element): HTMLElement[] =>
	[...(host.shadowRoot?.querySelectorAll<HTMLElement>('*') ?? [])].flatMap((el) =>
		el.shadowRoot ? focusables(el) : el.matches(FOCUSABLE) ? [el] : []
	);

const deepActiveElement = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

/** The controls Tab visits between the #before and #after buttons around the element. */
const tabStops = async (): Promise<Element[]> => {
	document.getElementById('before')!.focus();
	const stops: Element[] = [];
	for (let i = 0; i < 10; i++) {
		await userEvent.tab();
		const active = deepActiveElement();
		if (!active || active.id === 'after') return stops;
		stops.push(active);
	}
	throw new Error('Tab never reached #after');
};

/** Each Tab stop's position in `controls`, so the comparison is by identity, not by markup. */
const tabOrder = async (controls: Element[]) =>
	(await tabStops()).map((stop) => controls.indexOf(stop));

const inOrder = (controls: Element[]) => controls.map((_, i) => i);

const create = (tag: string) => {
	const el = document.createElement(tag) as GroveElement;
	for (const [name, value] of Object.entries(FIXTURE_ATTRS[tag] ?? {}))
		el.setAttribute(name, value);
	return el;
};

const mount = async (tag: string, hidden = false, parent: Element = document.body) => {
	const el = create(tag);
	el.hidden = hidden;
	parent.append(el);
	await settle(el);
	return el;
};

/** Mounts the element between two native buttons inside #probe, for Tab and the accessibility tree. */
const stage = async (tag: string) => {
	document.body.innerHTML =
		'<div id="probe"><button id="before">before</button><button id="after">after</button></div>';
	const empty = await commands.ariaSnapshot('#probe');
	const el = create(tag);
	document.getElementById('after')!.before(el);
	await settle(el);
	return { el, empty };
};

const pageStyle = (css: string) => {
	const style = document.createElement('style');
	style.dataset.test = '';
	style.textContent = css;
	document.head.append(style);
};

afterEach(() => {
	document.body.replaceChildren();
	document.head.querySelectorAll('style[data-test]').forEach((s) => s.remove());
});

afterAll(() => applyTheme(themes[0]));

it('renders a focusable control in exactly the interactive components', async () => {
	const interactive: string[] = [];
	for (const tag of groveTags) {
		const el = await mount(tag);
		if (focusables(el).length) interactive.push(tag);
		el.remove();
	}
	expect(interactive).toEqual(INTERACTIVE);
});

describe.each(themes)('hidden on every gv-* element ($name)', (theme) => {
	beforeAll(() => applyTheme(theme));

	it.each(groveTags)('%s hides with hidden and restores without it', async (tag) => {
		const { el, empty } = await stage(tag);
		const display = getComputedStyle(el).display;
		const rect = el.getBoundingClientRect().toJSON();
		const controls = focusables(el);
		const shown = await commands.ariaSnapshot('#probe');
		expect(await tabOrder(controls)).toEqual(inOrder(controls));

		el.setAttribute('hidden', '');
		expect(getComputedStyle(el).display).toBe('none');
		expect(el.getClientRects().length).toBe(0);
		expect(await commands.ariaSnapshot('#probe')).toBe(empty);
		expect(await tabOrder(controls)).toEqual([]);
		for (const control of controls) {
			control.focus();
			expect(deepActiveElement()).not.toBe(control);
		}

		el.removeAttribute('hidden');
		expect(getComputedStyle(el).display).toBe(display);
		expect(el.getBoundingClientRect().toJSON()).toEqual(rect);
		expect(await commands.ariaSnapshot('#probe')).toBe(shown);
		expect(await tabOrder(controls)).toEqual(inOrder(controls));
	});

	it.each(groveTags)('%s treats the hidden property like the attribute', async (tag) => {
		const el = await mount(tag);
		el.hidden = true;
		expect(el.hasAttribute('hidden')).toBe(true);
		expect(getComputedStyle(el).display).toBe('none');
		el.hidden = false;
		expect(getComputedStyle(el).display).not.toBe('none');
	});

	it.each(groveTags)('%s stays hidden through upgrade', async (tag) => {
		// A document with no browsing context never upgrades, so the element is parsed undefined, as
		// server HTML is before the bundle runs. Appending it here is what upgrades it.
		const inert = document.implementation.createHTMLDocument('');
		inert.body.innerHTML = `<${tag} hidden></${tag}>`;
		const el = inert.body.firstElementChild as GroveElement;
		expect(el.shadowRoot).toBeNull();

		document.body.append(el);
		// Upgraded and styled, not yet rendered.
		expect(el.shadowRoot).not.toBeNull();
		expect(getComputedStyle(el).display).toBe('none');
		await settle(el);
		expect(getComputedStyle(el).display).toBe('none');
		await frame();
		expect(getComputedStyle(el).display).toBe('none');
		expect(el.getClientRects().length).toBe(0);
	});

	it.each(groveTags)(
		'%s beats page display rules on the host, !important included',
		async (tag) => {
			const rules = [
				{ css: `${tag} { display: grid; }`, parent: '', display: 'grid' },
				{ css: '.stack > * { display: flex; }', parent: 'stack', display: 'flex' },
				{ css: `${tag} { display: flow-root !important; }`, parent: '', display: 'flow-root' }
			];
			for (const rule of rules) {
				pageStyle(rule.css);
				const parent = document.body.appendChild(document.createElement('div'));
				if (rule.parent) parent.className = rule.parent;

				const el = await mount(tag, true, parent);
				expect(getComputedStyle(el).display, rule.css).toBe('none');
				el.hidden = false;
				expect(getComputedStyle(el).display, rule.css).toBe(rule.display);

				parent.remove();
				document.head.querySelectorAll('style[data-test]').forEach((s) => s.remove());
			}
		}
	);

	it.each(groveTags)('%s leaves hidden="until-found" to the browser', async (tag) => {
		const el = await mount(tag);
		el.setAttribute('hidden', 'until-found');
		expect(getComputedStyle(el).display).not.toBe('none');
		expect(getComputedStyle(el).contentVisibility).toBe('hidden');
	});
});
