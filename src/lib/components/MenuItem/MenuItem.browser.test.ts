import { afterEach, describe, expect, it } from 'vitest';
import { html, render } from 'lit';
import './MenuItem.js';
import type { MenuItem } from './MenuItem.js';

const host = document.body.appendChild(document.createElement('div'));
host.style.width = '240px';

afterEach(() => render(html``, host));

const mount = async (template: unknown) => {
	render(template, host);
	const items = [...host.querySelectorAll('gv-menu-item')] as MenuItem[];
	await Promise.all(items.map((el) => el.updateComplete));
	return items;
};

const anchor = (el: MenuItem) => el.shadowRoot!.querySelector('a')!;
const height = (el: MenuItem) => anchor(el).getBoundingClientRect().height;

describe('gv-menu-item target size (#28)', () => {
	it('keeps a one-line sm row at least 24 px tall, with or without an icon', async () => {
		const [withIcon, noIcon, unregistered] = await mount(html`
			<gv-menu-item size="sm" label="Color" href="#"></gv-menu-item>
			<gv-menu-item size="sm" label="Color" href="#" icon=""></gv-menu-item>
			<gv-menu-item size="sm" label="Color" href="#" icon="not-a-glyph"></gv-menu-item>
		`);
		for (const el of [withIcon, noIcon, unregistered])
			expect(height(el)).toBeGreaterThanOrEqual(24);
	});

	it('leaves a one-line md row at exactly 24 px', async () => {
		const [el] = await mount(html`<gv-menu-item label="Tokens" href="#"></gv-menu-item>`);
		expect(height(el)).toBe(24);
	});

	it('does not change height when is-active toggles', async () => {
		const [md, sm] = await mount(html`
			<gv-menu-item label="Tokens" href="#"></gv-menu-item>
			<gv-menu-item size="sm" label="Color" href="#"></gv-menu-item>
		`);
		const before = [height(md), height(sm)];
		md.isActive = sm.isActive = true;
		await Promise.all([md.updateComplete, sm.updateComplete]);
		expect([height(md), height(sm)]).toEqual(before);
	});

	it('grows a wrapped label past the floor', async () => {
		const [el] = await mount(
			html`<gv-menu-item
				size="sm"
				label=${'A long navigation label '.repeat(4)}
				href="#"
			></gv-menu-item>`
		);
		expect(height(el)).toBeGreaterThan(24);
	});
});

describe('gv-menu-item hreflang and lang (#43)', () => {
	it('forwards hreflang when href is set, and drops it when absent or empty', async () => {
		const [set, unset, empty] = await mount(html`
			<gv-menu-item label="Español" href="/es/" hreflang="es"></gv-menu-item>
			<gv-menu-item label="English" href="/"></gv-menu-item>
			<gv-menu-item label="English" href="/" hreflang=""></gv-menu-item>
		`);
		expect(anchor(set).getAttribute('hreflang')).toBe('es');
		expect(anchor(unset).hasAttribute('hreflang')).toBe(false);
		expect(anchor(empty).hasAttribute('hreflang')).toBe(false);
	});

	it('renders hreflang only while href is set', async () => {
		const [el] = await mount(html`<gv-menu-item label="Español" hreflang="es"></gv-menu-item>`);
		expect(anchor(el).hasAttribute('hreflang')).toBe(false);
		el.href = '/es/';
		await el.updateComplete;
		expect(anchor(el).getAttribute('hreflang')).toBe('es');
		el.href = undefined;
		await el.updateComplete;
		expect(anchor(el).hasAttribute('hreflang')).toBe(false);
	});

	it('treats the property and the attribute alike', async () => {
		const [byProp, byAttr] = await mount(html`
			<gv-menu-item label="Español" href="/es/"></gv-menu-item>
			<gv-menu-item label="Español" href="/es/"></gv-menu-item>
		`);
		byProp.hreflang = 'es';
		byAttr.setAttribute('hreflang', 'es');
		await Promise.all([byProp.updateComplete, byAttr.updateComplete]);
		expect(anchor(byProp).getAttribute('hreflang')).toBe('es');
		expect(anchor(byAttr).getAttribute('hreflang')).toBe('es');
		byAttr.removeAttribute('hreflang');
		await byAttr.updateComplete;
		expect(anchor(byAttr).hasAttribute('hreflang')).toBe(false);
	});

	it('gives the shadow link the host language, through the native lang accessor', async () => {
		const [el] = await mount(html`<gv-menu-item label="Español" href="/es/"></gv-menu-item>`);
		el.lang = 'es';
		expect(el.getAttribute('lang')).toBe('es');
		expect(anchor(el).matches(':lang(es)')).toBe(true);
		el.removeAttribute('lang');
		expect(anchor(el).matches(':lang(es)')).toBe(false);
	});
});
