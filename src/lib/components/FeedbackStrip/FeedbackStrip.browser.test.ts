import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { html, render } from 'lit';
import './FeedbackStrip.js';
import type { FeedbackStrip } from './FeedbackStrip.js';

const host = document.body.appendChild(document.createElement('div'));
afterEach(() => render(html``, host));

const mount = async (template: unknown) => {
	render(template, host);
	const el = host.querySelector('gv-feedback-strip') as FeedbackStrip;
	await el.updateComplete;
	return el;
};

const strip = (el: FeedbackStrip) => el.shadowRoot!.querySelector<HTMLElement>('.strip')!;
const region = (el: FeedbackStrip) => [
	strip(el).getAttribute('role'),
	strip(el).getAttribute('aria-live')
];

const POLITE = ['status', 'polite'];
const ASSERTIVE = ['alert', 'assertive'];
const OFF = [null, null];
const TYPES = ['success', 'danger', 'information'] as const;
const byType = { success: POLITE, danger: ASSERTIVE, information: POLITE };

describe('gv-feedback-strip live (#37)', () => {
	for (const type of TYPES) {
		it(`follows type="${type}" when live is unset or unknown`, async () => {
			for (const live of [undefined, '', 'Polite', 'bogus', 'toString']) {
				const el = await mount(
					html`<gv-feedback-strip type=${type} live=${live ?? ''} heading="H"></gv-feedback-strip>`
				);
				if (live === undefined) el.removeAttribute('live');
				await el.updateComplete;
				expect(region(el)).toEqual(byType[type]);
			}
		});

		for (const [live, expected] of [
			['polite', POLITE],
			['assertive', ASSERTIVE],
			['off', OFF]
		] as const)
			it(`gives type="${type}" live="${live}" the ${live} region`, async () => {
				const el = await mount(
					html`<gv-feedback-strip
						type=${type}
						live=${live}
						heading="H"
						message="M"
					></gv-feedback-strip>`
				);
				expect(region(el)).toEqual(expected);
			});
	}

	it('keeps an unknown type on the success mapping', async () => {
		const el = await mount(html`<gv-feedback-strip type="nope" heading="H"></gv-feedback-strip>`);
		expect(region(el)).toEqual(POLITE);
	});

	it('leaves nothing live in the shadow root for live="off"', async () => {
		const el = await mount(
			html`<gv-feedback-strip type="danger" live="off" heading="H" message="M"></gv-feedback-strip>`
		);
		expect(el.shadowRoot!.querySelector('[role=status], [role=alert], [aria-live]')).toBeNull();
	});

	it('changes nothing visible', async () => {
		const shots: string[] = [];
		for (const live of [undefined, 'polite', 'assertive', 'off']) {
			await mount(
				html`<gv-feedback-strip
					type="danger"
					heading="Upload failed"
					message="Too big"
				></gv-feedback-strip>`
			);
			const el = host.querySelector('gv-feedback-strip') as FeedbackStrip;
			if (live) el.setAttribute('live', live);
			await el.updateComplete;
			shots.push(await page.screenshot({ element: el, save: false }));
		}
		expect(new Set(shots).size).toBe(1);
	});
});

describe('gv-feedback-strip live at runtime (#37 FR-08 to FR-11)', () => {
	it('updates the region in place when live changes, and restores the type mapping when removed', async () => {
		const el = await mount(html`<gv-feedback-strip type="danger" heading="H"></gv-feedback-strip>`);
		const node = strip(el);
		el.live = 'polite';
		await el.updateComplete;
		expect(region(el)).toEqual(POLITE);
		el.removeAttribute('live');
		await el.updateComplete;
		expect(region(el)).toEqual(ASSERTIVE);
		el.live = 'off';
		await el.updateComplete;
		expect(region(el)).toEqual(OFF);
		el.live = undefined;
		await el.updateComplete;
		expect(region(el)).toEqual(ASSERTIVE);
		expect(strip(el)).toBe(node);
	});

	it('ignores type changes while live is set, and follows them while it is unset', async () => {
		const el = await mount(
			html`<gv-feedback-strip type="success" live="polite" heading="H"></gv-feedback-strip>`
		);
		el.type = 'danger';
		await el.updateComplete;
		expect(region(el)).toEqual(POLITE);
		expect(strip(el).classList.contains('strip--danger')).toBe(true);
		el.live = undefined;
		await el.updateComplete;
		expect(region(el)).toEqual(ASSERTIVE);
	});

	it('changes heading and message inside the existing region element', async () => {
		const el = await mount(
			html`<gv-feedback-strip type="information" live="polite" heading="A"></gv-feedback-strip>`
		);
		const node = strip(el);
		el.heading = 'B';
		el.message = 'Now with a message';
		await el.updateComplete;
		expect(strip(el)).toBe(node);
		expect(node.textContent).toContain('B');
		expect(node.textContent).toContain('Now with a message');
	});
});
