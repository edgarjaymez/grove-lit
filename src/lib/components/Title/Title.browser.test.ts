import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { html, render } from 'lit';
import './Title.js';
import type { Title } from './Title.js';
import { GROVE_SURFACES } from '../../surfaces.js';
import { applyTheme, themes } from '../../../test/themes.js';

const host = document.body.appendChild(document.createElement('div'));
const LONG = 'Getting started with the Grove design system';

afterEach(async () => {
	render(html``, host);
	document.documentElement.style.fontSize = '';
	await page.viewport(414, 896);
});

/** Sets the viewport the way a consumer's page would see it, then renders. */
const mount = async (width: number, template: unknown) => {
	await page.viewport(width, 720);
	render(template, host);
	const el = host.querySelector('gv-title') as Title;
	await el.updateComplete;
	await document.fonts.ready;
	return el;
};

const parts = (el: Title) => {
	const root = el.shadowRoot!;
	return {
		block: root.querySelector<HTMLElement>('.title')!,
		heading: root.querySelector<HTMLElement>('.title__heading')!,
		icon: root.querySelector<HTMLElement>('gv-icon')
	};
};

/** Line boxes of the heading text, measured with a Range so a clipped glyph cannot hide. */
const lines = (heading: HTMLElement) => {
	const range = document.createRange();
	range.selectNodeContents(heading);
	const tops = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
	return { rects: [...range.getClientRects()], count: tops.size };
};

const expectInside = (el: Title) => {
	const { block, heading, icon } = parts(el);
	const box = block.getBoundingClientRect();
	for (const r of [...lines(heading).rects, ...(icon ? [icon.getBoundingClientRect()] : [])]) {
		expect(r.left).toBeGreaterThanOrEqual(box.left - 0.5);
		expect(r.right).toBeLessThanOrEqual(box.right + 0.5);
		expect(r.top).toBeGreaterThanOrEqual(box.top - 0.5);
		expect(r.bottom).toBeLessThanOrEqual(box.bottom + 0.5);
	}
	expect(block.scrollWidth).toBeLessThanOrEqual(block.clientWidth);
	expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(innerWidth);
};

describe('gv-title reflow at 320 px (#31, 1.4.10)', () => {
	for (const heading of ['Documentation', LONG])
		for (const icon of ['palette', ''])
			it(`keeps "${heading}" ${icon ? 'with' : 'without'} the icon fully inside the block`, async () => {
				const el = await mount(320, html`<gv-title heading=${heading} icon=${icon}></gv-title>`);
				expectInside(el);
			});

	it('breaks a multi-word heading between words', async () => {
		const el = await mount(320, html`<gv-title heading=${LONG}></gv-title>`);
		const { heading } = parts(el);
		expect(lines(heading).count).toBeGreaterThan(1);
		const range = document.createRange();
		const text = heading.firstChild?.nodeType === Node.TEXT_NODE ? heading.firstChild : null;
		const node = text ?? [...heading.childNodes].find((n) => n.nodeType === Node.TEXT_NODE)!;
		// Every word fits on a line of its own at 320 px, so no word may be split across lines.
		let offset = 0;
		for (const word of LONG.split(' ')) {
			range.setStart(node, (node.textContent ?? '').indexOf(word, offset));
			range.setEnd(node, (node.textContent ?? '').indexOf(word, offset) + word.length);
			expect(new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size).toBe(1);
			offset = (node.textContent ?? '').indexOf(word, offset) + word.length;
		}
	});

	it('keeps the 40 px icon, never shrunk, on the heading row', async () => {
		const el = await mount(320, html`<gv-title heading=${LONG}></gv-title>`);
		const { heading, icon } = parts(el);
		expect(icon!.getBoundingClientRect().width).toBeGreaterThanOrEqual(40);
		const h = heading.getBoundingClientRect();
		const i = icon!.getBoundingClientRect();
		expect(i.right).toBeLessThanOrEqual(h.left);
		// Vertically centred on the whole heading.
		expect(Math.abs(i.top + i.height / 2 - (h.top + h.height / 2))).toBeLessThanOrEqual(1);
	});

	it('grows the block with its lines, padding included', async () => {
		const el = await mount(320, html`<gv-title heading=${LONG}></gv-title>`);
		const { block, heading } = parts(el);
		const b = block.getBoundingClientRect();
		const h = heading.getBoundingClientRect();
		expect(h.top - b.top).toBeCloseTo(24, 0);
		expect(b.bottom - h.bottom).toBeCloseTo(24, 0);
	});

	it('returns to one centred line when space grows again', async () => {
		const el = await mount(320, html`<gv-title heading="Documentation"></gv-title>`);
		expect(lines(parts(el).heading).count).toBeGreaterThan(1);
		await page.viewport(1280, 720);
		const { block, heading, icon } = parts(el);
		expect(lines(heading).count).toBe(1);
		const b = block.getBoundingClientRect();
		const left = icon!.getBoundingClientRect().left - b.left;
		const right = b.right - heading.getBoundingClientRect().right;
		expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
		expect(heading.getBoundingClientRect().left - icon!.getBoundingClientRect().right).toBeCloseTo(
			16,
			0
		);
	});
});

describe('gv-title at 200 % text (#31, 1.4.4)', () => {
	for (const width of [640, 1280])
		it(`clips nothing at ${width} px`, async () => {
			document.documentElement.style.fontSize = '200%';
			const el = await mount(width, html`<gv-title heading=${LONG}></gv-title>`);
			expectInside(el);
		});

	it('restores one line when text returns to 100 %', async () => {
		document.documentElement.style.fontSize = '200%';
		const el = await mount(1280, html`<gv-title heading=${LONG}></gv-title>`);
		expect(lines(parts(el).heading).count).toBeGreaterThan(1);
		document.documentElement.style.fontSize = '';
		expect(lines(parts(el).heading).count).toBe(1);
	});
});

describe('gv-title semantics are unchanged (#31 FR-12, FR-14)', () => {
	it('renders h2 by default, the requested level, and h2 for anything else', async () => {
		const el = await mount(640, html`<gv-title heading="Docs"></gv-title>`);
		for (const [level, tag] of [
			[2, 'H2'],
			[1, 'H1'],
			[3, 'H3'],
			[9, 'H2']
		] as const) {
			el.level = level as Title['level'];
			await el.updateComplete;
			expect(parts(el).heading.tagName).toBe(tag);
		}
		expect(parts(el).icon!.getAttribute('aria-hidden')).toBe('true');
		expect(el.hasAttribute('title')).toBe(false);
	});

	it('renders an empty heading without overflow', async () => {
		const el = await mount(320, html`<gv-title heading=""></gv-title>`);
		expectInside(el);
	});
});

/** The computed colours of a probe painted with a surface's tokens, where `context` is. */
const expected = (surface: string, context: Element = host) => {
	const probe = context.appendChild(document.createElement('div'));
	probe.style.background = `var(--semantic-color-surface-${surface})`;
	probe.style.color = `var(--semantic-color-text-on-${surface}-base)`;
	const { backgroundColor, color } = getComputedStyle(probe);
	probe.remove();
	return { backgroundColor, color };
};

const painted = (el: Title) => {
	const { backgroundColor, color } = getComputedStyle(parts(el).block);
	return { backgroundColor, color };
};

describe('gv-title surface (#36)', () => {
	afterAll(() => applyTheme(themes[0]));

	for (const theme of themes)
		it(`paints every Grove surface with its base text-on pair in ${theme.name}`, async () => {
			await applyTheme(theme);
			const el = await mount(640, html`<gv-title heading="Principles"></gv-title>`);
			expect(painted(el)).toEqual(expected('ground'));
			for (const surface of GROVE_SURFACES) {
				el.surface = surface;
				await el.updateComplete;
				expect(painted(el), surface).toEqual(expected(surface));
				const icon = parts(el).icon!;
				expect(getComputedStyle(icon).color).toBe(getComputedStyle(parts(el).heading).color);
			}
		});

	it('switches at runtime and returns to ground when the attribute is removed', async () => {
		await applyTheme(themes[0]);
		const el = await mount(
			640,
			html`<gv-title heading="Principles" surface="brand-summit"></gv-title>`
		);
		expect(painted(el)).toEqual(expected('brand-summit'));
		el.surface = 'accent-terrace';
		await el.updateComplete;
		expect(painted(el)).toEqual(expected('accent-terrace'));
		el.removeAttribute('surface');
		await el.updateComplete;
		expect(painted(el)).toEqual(expected('ground'));
		expect(parts(el).block.className).toBe('title title--ground');
	});

	it.each(['bogus', 'accent-path', '', 'Brand-Terrace'])(
		'renders surface="%s" as ground',
		async (surface) => {
			await applyTheme(themes[0]);
			const el = await mount(
				640,
				html`<gv-title heading="Principles" surface=${surface}></gv-title>`
			);
			expect(painted(el)).toEqual(expected('ground'));
		}
	);

	it('paints an empty heading on a non-ground surface', async () => {
		const el = await mount(640, html`<gv-title heading="" surface="gray-path"></gv-title>`);
		expect(painted(el)).toEqual(expected('gray-path'));
		expect(parts(el).block.getBoundingClientRect().height).toBeGreaterThan(0);
	});

	it('follows a data-theme island', async () => {
		await applyTheme(themes[0]);
		render(
			html`<div data-theme="dark">
				<gv-title heading="Night" surface="brand-terrace"></gv-title>
			</div>`,
			host
		);
		const el = host.querySelector('gv-title') as Title;
		await el.updateComplete;
		const island = host.querySelector('[data-theme]')!;
		expect(painted(el)).toEqual(expected('brand-terrace', island));
		expect(painted(el)).not.toEqual(expected('brand-terrace'));
	});
});
