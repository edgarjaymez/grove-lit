import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import { html, render } from 'lit';
import type { LitElement } from 'lit';
import '../index.js';
import './effects.css';
import './surfaces.css';
import { applyTheme, themes } from '../../test/themes.js';

const host = document.body.appendChild(document.createElement('div'));
host.style.padding = '16px';

afterEach(() => render(html``, host));
// Buttons transition box-shadow over 300 ms; reduced motion (componentReset) makes that instant, so
// computed values are final one frame after an interaction.
beforeAll(() => commands.emulateMedia({ reducedMotion: 'reduce' }));
afterAll(async () => {
	await commands.emulateMedia({ reducedMotion: 'no-preference' });
	await applyTheme(themes[0]);
});

const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

const settle = async () => {
	const all = [...host.querySelectorAll('*')].filter((el) => el.localName.startsWith('gv-'));
	await Promise.all(all.map((el) => (el as LitElement).updateComplete));
	await Promise.all(all.map((el) => (el as LitElement).updateComplete));
};

/** The element inside a Grove control that receives focus. */
const inner = (el: Element): HTMLElement => {
	const focusable = el.shadowRoot!.querySelector<HTMLElement>('.gv-focusable');
	if (focusable) return focusable;
	return inner(el.shadowRoot!.querySelector('gv-checkbox')!);
};

/** The computed value of a ring token, resolved where `context` is. */
const ring = (token: string, context: Element = host) => {
	const probe = context.appendChild(document.createElement('span'));
	probe.style.boxShadow = `var(${token})`;
	const value = getComputedStyle(probe).boxShadow;
	probe.remove();
	return value;
};

const shadow = (el: Element) => getComputedStyle(inner(el)).boxShadow;

/** Tabs from a native button placed just before `target`, so focus arrives by keyboard. */
const tabTo = async (target: Element) => {
	const start = document.createElement('button');
	start.textContent = 'start';
	target.before(start);
	start.focus();
	await userEvent.keyboard('{Tab}');
	start.remove();
	await frame();
};

const CONTROLS = [
	['gv-button', html`<gv-button text="Save"></gv-button>`],
	['gv-icon-button', html`<gv-icon-button aria-label="Close"></gv-icon-button>`],
	['gv-back-button', html`<gv-back-button></gv-back-button>`],
	['gv-checkbox', html`<gv-checkbox></gv-checkbox>`],
	[
		'gv-todo-category-toggler',
		html`<gv-todo-category-toggler category="Garden"></gv-todo-category-toggler>`
	],
	['gv-text-input', html`<gv-text-input placeholder="Name"></gv-text-input>`],
	['gv-color-swatch', html`<gv-color-swatch></gv-color-swatch>`],
	['gv-todo-list-item', html`<gv-todo-list-item heading="Water"></gv-todo-list-item>`]
] as const;

for (const theme of themes)
	describe(`focus ring in ${theme.name} (#22 Path A)`, () => {
		beforeEach(() => applyTheme(theme));

		for (const [tag, template] of CONTROLS)
			it(`<${tag}> draws the Ground ring on keyboard focus and drops it on blur`, async () => {
				render(template, host);
				await settle();
				const el = host.querySelector(tag)!;
				await tabTo(el);
				expect(shadow(el).startsWith(ring('--ring-on-ground'))).toBe(true);
				inner(el).blur();
				await frame();
				expect(shadow(el).startsWith(ring('--ring-on-ground'))).toBe(false);
			});

		it('<gv-menu-item> falls back to the brand-terrace ring', async () => {
			render(html`<gv-menu-item label="Home" href="#"></gv-menu-item>`, host);
			await settle();
			const el = host.querySelector('gv-menu-item')!;
			await tabTo(el);
			expect(shadow(el).startsWith(ring('--ring-on-brand-terrace'))).toBe(true);
		});

		it('takes the ring of the innermost surface, including through a nested shadow root', async () => {
			render(
				html`<div class="gv-surface-gray-terrace">
					<gv-button text="Outer"></gv-button>
					<div class="gv-surface-brand-summit">
						<gv-todo-list-item heading="Water"></gv-todo-list-item>
					</div>
				</div>`,
				host
			);
			await settle();
			const outer = host.querySelector('gv-button')!;
			const item = host.querySelector('gv-todo-list-item')!;
			await tabTo(outer);
			expect(shadow(outer).startsWith(ring('--ring-on-gray-terrace'))).toBe(true);
			await tabTo(item);
			expect(shadow(item).startsWith(ring('--ring-on-brand-summit'))).toBe(true);
		});

		it('takes a ring declared with the custom property, and returns to Ground without it', async () => {
			render(
				html`<div style="--gv-focus-ring: var(--ring-on-success-terrace)">
					<gv-button text="Save"></gv-button>
				</div>`,
				host
			);
			await settle();
			const wrapper = host.firstElementChild as HTMLElement;
			const el = host.querySelector('gv-button')!;
			await tabTo(el);
			expect(shadow(el).startsWith(ring('--ring-on-success-terrace'))).toBe(true);
			wrapper.style.removeProperty('--gv-focus-ring');
			await frame();
			expect(shadow(el).startsWith(ring('--ring-on-ground'))).toBe(true);
		});

		it('keeps the resting surface ring over an aurora highlight', async () => {
			render(
				html`<div class="gv-surface-brand-terrace">
					<div class="gv-surface-brand-aurora"><gv-button text="Save"></gv-button></div>
				</div>`,
				host
			);
			await settle();
			const el = host.querySelector('gv-button')!;
			await tabTo(el);
			expect(shadow(el).startsWith(ring('--ring-on-brand-terrace'))).toBe(true);
		});

		it('gives a [data-theme] island its own Ground ring', async () => {
			render(
				html`<div class="gv-surface-accent-summit">
					<div data-theme="dark"><gv-button text="Save"></gv-button></div>
				</div>`,
				host
			);
			await settle();
			const island = host.querySelector('[data-theme]')!;
			const el = host.querySelector('gv-button')!;
			await tabTo(el);
			expect(shadow(el).startsWith(ring('--ring-on-ground', island))).toBe(true);
		});

		it('draws the ring over the drop shadow, which stays', async () => {
			render(html`<gv-button text="Save"></gv-button>`, host);
			await settle();
			const el = host.querySelector('gv-button')!;
			await userEvent.hover(el);
			await frame();
			const drop = shadow(el);
			await userEvent.unhover(el);
			await tabTo(el);
			await userEvent.hover(el);
			await frame();
			const focused = shadow(el);
			expect(focused.startsWith(ring('--ring-on-ground'))).toBe(true);
			expect(focused.endsWith(drop)).toBe(true);
			await userEvent.unhover(el);
		});

		it('paints nothing on any host, even under the old .surface-ground class', async () => {
			render(
				html`<div class="surface-ground">
					${CONTROLS.map(([, template]) => template)}
					<gv-menu-item label="Home" href="#"></gv-menu-item>
				</div>`,
				host
			);
			await settle();
			for (const el of host.querySelectorAll('.surface-ground > *')) {
				await tabTo(el);
				expect(getComputedStyle(el).boxShadow).toBe('none');
			}
		});
	});

describe('focus ring behaviour', () => {
	beforeEach(() => applyTheme(themes[0]));

	it('draws no ring on pointer focus for buttons, but does for the text input', async () => {
		render(
			html`<gv-button text="Save"></gv-button><gv-checkbox></gv-checkbox>
				<gv-text-input placeholder="Name"></gv-text-input>`,
			host
		);
		await settle();
		const ground = ring('--ring-on-ground');
		for (const tag of ['gv-button', 'gv-checkbox']) {
			const el = host.querySelector(tag)!;
			await userEvent.click(inner(el));
			await frame();
			expect(shadow(el).startsWith(ground)).toBe(false);
		}
		const input = host.querySelector('gv-text-input')!;
		await userEvent.click(inner(input));
		await frame();
		expect(shadow(input).startsWith(ground)).toBe(true);
	});

	it('updates the ring colour when the theme changes while focused', async () => {
		render(html`<gv-button text="Save"></gv-button>`, host);
		await settle();
		const el = host.querySelector('gv-button')!;
		await tabTo(el);
		const light = shadow(el);
		await applyTheme(themes[1]);
		await frame();
		expect(shadow(el)).not.toBe(light);
		expect(shadow(el).startsWith(ring('--ring-on-ground'))).toBe(true);
	});

	it('keeps the ring on the text input when disabled (readonly) and in error', async () => {
		render(
			html`<gv-text-input disabled placeholder="A"></gv-text-input>
				<gv-text-input error placeholder="B"></gv-text-input>`,
			host
		);
		await settle();
		for (const el of host.querySelectorAll('gv-text-input')) {
			await tabTo(el);
			expect(shadow(el).startsWith(ring('--ring-on-ground'))).toBe(true);
		}
	});

	it('leaves natively disabled controls out of the tab order', async () => {
		render(
			html`<gv-button text="Off" disabled></gv-button><gv-button text="On"></gv-button>`,
			host
		);
		await settle();
		const [off, on] = host.querySelectorAll('gv-button');
		await tabTo(off);
		expect(on.shadowRoot!.activeElement).toBe(inner(on));
	});

	it('shows a system-colour outline under forced colours, and no outline otherwise', async () => {
		render(html`<gv-button text="Save"></gv-button>`, host);
		await settle();
		const el = host.querySelector('gv-button')!;
		await tabTo(el);
		expect(getComputedStyle(inner(el)).outlineColor).toBe('rgba(0, 0, 0, 0)');
		await commands.emulateMedia({ forcedColors: 'active' });
		const forced = getComputedStyle(inner(el));
		expect(forced.outlineStyle).toBe('solid');
		expect(forced.outlineColor).not.toBe('rgba(0, 0, 0, 0)');
		await commands.emulateMedia({ forcedColors: 'none' });
	});
});
