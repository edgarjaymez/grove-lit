import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { commands } from 'vitest/browser';
import { groveTags } from '../../test/grove-tags.js';
import { applyTheme, themes } from '../../test/themes.js';

/** The components that animate a state change today (#42 Context table). */
const ANIMATED = [
	'gv-back-button',
	'gv-button',
	'gv-checkbox',
	'gv-color-swatch',
	'gv-icon-button',
	'gv-menu-item',
	'gv-text-input',
	'gv-todo-category-toggler',
	'gv-tooltip'
];

const seconds = (list: string) =>
	list.split(',').map((v) => parseFloat(v) / (v.trim().endsWith('ms') ? 1000 : 1));

/** The host plus every element in its shadow tree, descending into nested Grove shadow roots. */
const shadowElements = (host: Element): Element[] => {
	const root = host.shadowRoot;
	if (!root) return [host];
	return [
		host,
		...[...root.querySelectorAll('*')].flatMap((el) => (el.shadowRoot ? shadowElements(el) : [el]))
	];
};

/** The host plus its own shadow tree only, so a nested Grove element's fades aren't credited to its parent. */
const ownElements = (host: Element) => [host, ...(host.shadowRoot?.querySelectorAll('*') ?? [])];

const timings = (el: Element) => {
	const cs = getComputedStyle(el);
	return {
		transitionDuration: Math.max(...seconds(cs.transitionDuration)),
		transitionDelay: Math.max(...seconds(cs.transitionDelay)),
		animationDuration: Math.max(...seconds(cs.animationDuration)),
		animationDelay: Math.max(...seconds(cs.animationDelay))
	};
};

const mount = async (tag: string) => {
	const el = document.createElement(tag) as HTMLElement & { updateComplete?: Promise<unknown> };
	document.body.append(el);
	await el.updateComplete;
	return el;
};

afterEach(() => document.body.replaceChildren());
afterAll(async () => {
	await commands.emulateMedia({ reducedMotion: 'no-preference' });
	await applyTheme(themes[0]);
});

describe('without a motion preference', () => {
	beforeAll(() => commands.emulateMedia({ reducedMotion: 'no-preference' }));

	it('animates exactly the components that fade today', async () => {
		const animated: string[] = [];
		for (const tag of groveTags) {
			const el = await mount(tag);
			if (ownElements(el).some((node) => timings(node).transitionDuration > 0)) animated.push(tag);
		}
		expect(animated).toEqual(ANIMATED);
	});
});

describe.each(themes)('with prefers-reduced-motion: reduce ($name)', (theme) => {
	beforeAll(async () => {
		await applyTheme(theme);
		await commands.emulateMedia({ reducedMotion: 'reduce' });
	});

	it.each(groveTags)('%s transitions and animates in at most 1 ms with no delay', async (tag) => {
		const el = await mount(tag);
		for (const node of shadowElements(el)) {
			const t = timings(node);
			expect(t.transitionDuration, node.localName).toBeLessThanOrEqual(0.001);
			expect(t.transitionDelay, node.localName).toBe(0);
			expect(t.animationDuration, node.localName).toBeLessThanOrEqual(0.001);
			expect(t.animationDelay, node.localName).toBe(0);
		}
	});
});

it('follows a preference switched while the page is open', async () => {
	await commands.emulateMedia({ reducedMotion: 'reduce' });
	const el = await mount('gv-button');
	const btn = el.shadowRoot!.querySelector('button')!;
	expect(timings(btn).transitionDuration).toBeLessThanOrEqual(0.001);
	await commands.emulateMedia({ reducedMotion: 'no-preference' });
	expect(timings(btn).transitionDuration).toBe(0.3);
});
