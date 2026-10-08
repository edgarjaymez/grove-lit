import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import { LitElement, css, html } from 'lit';
import { componentReset } from '../index.js';
import { groveTags } from '../../test/grove-tags.js';
import { applyTheme, themes } from '../../test/themes.js';

interface Timing {
	property: string;
	duration: string;
	easing: string;
	delay: string;
}

const fade = (properties: string[], duration: string, easing: string, delay = '0s'): Timing[] =>
	properties.map((property) => ({ property, duration, easing, delay }));

/** gv-color-swatch's Figma pair: hiding waits for the fade before visibility flips; revealing doesn't. */
const swatchTip = {
	hiding: [
		...fade(['opacity'], '0.3s', 'ease-out'),
		...fade(['visibility'], '0s', 'linear', '0.3s')
	],
	revealing: [...fade(['opacity'], '0.3s', 'ease-in-out'), ...fade(['visibility'], '0s', 'ease')]
};

/**
 * #42's Context table as Chromium computes it, without a motion preference: every element in a
 * component's own shadow tree that transitions at rest. A timing change (#30, a motion-token pass)
 * is a change to this table.
 */
const AT_REST: Record<string, Record<string, Timing[]>> = {
	'gv-back-button': { '.tile': fade(['color'], '0.3s', 'ease-in-out') },
	'gv-button': {
		'.btn': fade(['background', 'color', 'box-shadow', 'border-color'], '0.3s', 'ease-in-out')
	},
	'gv-checkbox': { '.box': fade(['background-color', 'border-color', 'color'], '0.2s', 'ease') },
	'gv-color-swatch': { '.tip--oklch': swatchTip.hiding, '.tip--hex': swatchTip.hiding },
	'gv-icon-button': {
		'.icon-btn': fade(['background', 'color', 'box-shadow', 'border-color'], '0.3s', 'ease-in-out')
	},
	'gv-menu-item': { '.item': fade(['color'], '0.3s', 'ease-in-out') },
	'gv-text-input': {
		'.text-input': fade(['background', 'border-color', 'color'], '0.3s', 'ease-in-out')
	},
	'gv-todo-category-toggler': {
		'.btn': fade(['background', 'color', 'box-shadow'], '0.3s', 'ease-in-out')
	},
	'gv-tooltip': { '.tooltip': fade(['box-shadow'], '0.3s', 'ease-in-out') }
};

/** A consumer's own component on the public `componentReset`, which inherits both host rules. */
class ResetConsumer extends LitElement {
	static styles = [
		componentReset,
		css`
			:host {
				display: block;
				transition: opacity 300ms;
			}

			.box {
				transition: color 300ms 100ms;
				animation: spin 1s linear 200ms infinite;
			}

			.box::before {
				content: '';
				transition: opacity 300ms;
			}

			.gentle {
				transition: opacity 300ms;
			}

			@keyframes spin {
				to {
					rotate: 1turn;
				}
			}

			/* The escape hatch: a gentler alternative instead of none. */
			@media (prefers-reduced-motion: reduce) {
				:host(.gentle),
				.gentle {
					transition-duration: 150ms !important;
				}
			}
		`
	];

	render() {
		return html`<div class="box">box</div>
			<div class="gentle">gentle</div>`;
	}
}
customElements.define('reset-consumer', ResetConsumer);

const seconds = (list: string) =>
	list.split(',').map((v) => parseFloat(v) / (v.trim().endsWith('ms') ? 1000 : 1));

/** Splits a computed list on its top-level commas (`cubic-bezier()` has commas of its own). */
const items = (list: string) => list.split(/,(?![^(]*\))/).map((v) => v.trim());

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

const timings = (el: Element, pseudo: string | null = null) => {
	const cs = getComputedStyle(el, pseudo);
	return {
		transitionDuration: Math.max(...seconds(cs.transitionDuration)),
		transitionDelay: Math.max(...seconds(cs.transitionDelay)),
		animationDuration: Math.max(...seconds(cs.animationDuration)),
		animationDelay: Math.max(...seconds(cs.animationDelay))
	};
};

/** One entry per transitioned property, lists repeated as CSS repeats them. */
const transitionTimings = (el: Element): Timing[] => {
	const cs = getComputedStyle(el);
	const durations = items(cs.transitionDuration);
	const easings = items(cs.transitionTimingFunction);
	const delays = items(cs.transitionDelay);
	return items(cs.transitionProperty).map((property, i) => ({
		property,
		duration: durations[i % durations.length],
		easing: easings[i % easings.length],
		delay: delays[i % delays.length]
	}));
};

const mount = async (tag: string) => {
	const el = document.createElement(tag) as HTMLElement & { updateComplete?: Promise<unknown> };
	document.body.append(el);
	await el.updateComplete;
	return el;
};

const frames = async (count: number) => {
	for (let i = 0; i < count; i++) await new Promise((r) => requestAnimationFrame(r));
};

/** Whether `event` arrives within `ms`: long enough for a frame or two, far short of 300 ms. */
const within = (ms: number, event: Promise<unknown>) =>
	Promise.race([event.then(() => true), new Promise((r) => setTimeout(() => r(false), ms))]);

const reduce = () => commands.emulateMedia({ reducedMotion: 'reduce' });
const noPreference = () => commands.emulateMedia({ reducedMotion: 'no-preference' });

afterEach(() => document.body.replaceChildren());
afterAll(async () => {
	await noPreference();
	await applyTheme(themes[0]);
});

describe('without a motion preference', () => {
	beforeAll(noPreference);

	it('animates exactly the components in the timing table', async () => {
		const animated: string[] = [];
		for (const tag of groveTags) {
			const el = await mount(tag);
			if (ownElements(el).some((node) => timings(node).transitionDuration > 0)) animated.push(tag);
			el.remove();
		}
		expect(animated).toEqual(Object.keys(AT_REST));
	});

	it.each(Object.keys(AT_REST))('%s keeps its timings at rest', async (tag) => {
		const el = await mount(tag);
		const transitioned = ownElements(el).filter((node) => timings(node).transitionDuration > 0);
		const expected = Object.entries(AT_REST[tag]);
		expect(transitioned).toHaveLength(expected.length);
		for (const [selector, timing] of expected) {
			const node = el.shadowRoot!.querySelector(selector)!;
			expect(transitioned).toContain(node);
			expect(transitionTimings(node), selector).toEqual(timing);
		}
	});

	it('gv-color-swatch reveals and dismisses its bubbles with the Figma timings', async () => {
		const el = await mount('gv-color-swatch');
		const root = el.shadowRoot!;
		const trigger = root.querySelector('.oklch-group')!;
		const tip = root.querySelector('.tip--oklch')!;

		await userEvent.hover(trigger);
		expect(transitionTimings(tip)).toEqual(swatchTip.revealing);
		// The dismissed state follows the copy hold; setting its attribute skips the clipboard.
		root.querySelector('.color-spaces')!.setAttribute('data-dismissed', 'oklch');
		expect(transitionTimings(tip)).toEqual(swatchTip.hiding);
		await userEvent.unhover(trigger);
	});
});

describe.each(themes)('with prefers-reduced-motion: reduce ($name)', (theme) => {
	beforeAll(async () => {
		await applyTheme(theme);
		await reduce();
	});

	it.each(groveTags)('%s transitions and animates in at most 1 ms with no delay', async (tag) => {
		const el = await mount(tag);
		for (const node of shadowElements(el)) {
			for (const pseudo of [null, '::before', '::after']) {
				const t = timings(node, pseudo);
				const where = `${node.localName}${pseudo ?? ''}`;
				expect(t.transitionDuration, where).toBeLessThanOrEqual(0.001);
				expect(t.transitionDelay, where).toBe(0);
				expect(t.animationDuration, where).toBeLessThanOrEqual(0.001);
				expect(t.animationDelay, where).toBe(0);
			}
		}
	});
});

describe('with prefers-reduced-motion: reduce', () => {
	beforeAll(reduce);

	it('still fires transitionend', async () => {
		const el = await mount('gv-tooltip');
		const bubble = el.shadowRoot!.querySelector('.tooltip')!;
		// Reading it settles the summit shadow the transition starts from.
		expect(getComputedStyle(bubble).boxShadow).not.toBe('none');
		const ended = new Promise((r) => bubble.addEventListener('transitionend', r, { once: true }));
		el.setAttribute('is-pressed', '');
		expect(await within(150, ended)).toBe(true);
	});

	it('gv-color-swatch drops a dismissed bubble from the accessibility tree at once', async () => {
		const el = await mount('gv-color-swatch');
		el.id = 'swatch';
		const root = el.shadowRoot!;
		const trigger = root.querySelector('.oklch-group')!;
		const tip = root.querySelector('.tip--oklch')!;

		await userEvent.hover(trigger);
		await frames(2);
		expect(getComputedStyle(tip).visibility).toBe('visible');
		expect(await commands.ariaSnapshot('#swatch')).toContain('tooltip');

		await userEvent.unhover(trigger);
		await frames(2);
		expect(getComputedStyle(tip).visibility).toBe('hidden');
		expect(await commands.ariaSnapshot('#swatch')).not.toContain('tooltip');
	});

	it("leaves the page's light DOM alone, slotted content included", async () => {
		document.body.innerHTML =
			'<div id="page" style="transition: opacity 300ms"></div>' +
			'<gv-button><span id="slotted" style="transition: opacity 300ms">Save</span></gv-button>';
		await (document.querySelector('gv-button') as LitElement).updateComplete;
		const slotted = document.getElementById('slotted')!;
		expect(slotted.assignedSlot).not.toBeNull();
		expect(timings(document.getElementById('page')!).transitionDuration).toBe(0.3);
		expect(timings(slotted).transitionDuration).toBe(0.3);
	});
});

describe('a consumer component that adopts componentReset', () => {
	const parts = (el: Element) => ({
		box: el.shadowRoot!.querySelector('.box')!,
		gentle: el.shadowRoot!.querySelector('.gentle')!
	});

	it('keeps its own timings without a motion preference', async () => {
		await noPreference();
		const el = await mount('reset-consumer');
		const { box, gentle } = parts(el);
		expect(timings(el).transitionDuration).toBe(0.3);
		expect(timings(box)).toEqual({
			transitionDuration: 0.3,
			transitionDelay: 0.1,
			animationDuration: 1,
			animationDelay: 0.2
		});
		expect(getComputedStyle(box).animationIterationCount).toBe('infinite');
		expect(timings(box, '::before').transitionDuration).toBe(0.3);
		expect(timings(gentle).transitionDuration).toBe(0.3);
	});

	it('inherits reduced motion, and its escape hatch wins', async () => {
		await reduce();
		const el = document.createElement('reset-consumer');
		document.body.append(el);
		const ended = new Promise((r) =>
			el.shadowRoot!.addEventListener('animationend', r, { once: true })
		);
		await (el as ResetConsumer).updateComplete;
		const { box, gentle } = parts(el);

		expect(timings(el).transitionDuration).toBeLessThanOrEqual(0.001);
		const t = timings(box);
		expect(t.transitionDuration).toBeLessThanOrEqual(0.001);
		expect(t.transitionDelay).toBe(0);
		expect(t.animationDuration).toBeLessThanOrEqual(0.001);
		expect(t.animationDelay).toBe(0);
		expect(getComputedStyle(box).animationIterationCount).toBe('1');
		expect(timings(box, '::before').transitionDuration).toBeLessThanOrEqual(0.001);
		expect(await within(150, ended)).toBe(true);
		expect(timings(gentle).transitionDuration).toBe(0.15);
		el.classList.add('gentle');
		expect(timings(el).transitionDuration).toBe(0.15);
	});

	it('inherits hidden, against a page !important rule too', async () => {
		const style = document.head.appendChild(document.createElement('style'));
		style.textContent = 'reset-consumer { display: grid !important; }';
		const el = await mount('reset-consumer');
		el.hidden = true;
		expect(getComputedStyle(el).display).toBe('none');
		el.hidden = false;
		expect(getComputedStyle(el).display).toBe('grid');
		style.remove();
	});
});

it('follows a preference switched while the page is open, both ways', async () => {
	await noPreference();
	const el = await mount('gv-button');
	const btn = el.shadowRoot!.querySelector('button')!;
	expect(timings(btn).transitionDuration).toBe(0.3);
	await reduce();
	expect(timings(btn).transitionDuration).toBeLessThanOrEqual(0.001);
	await noPreference();
	expect(timings(btn).transitionDuration).toBe(0.3);
});
