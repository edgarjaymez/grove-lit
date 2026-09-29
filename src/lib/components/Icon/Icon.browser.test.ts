import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import { html, render } from 'lit';
import './Icon.js';
import '../Button/Button.js';
import '../IconButton/IconButton.js';
import '../ToDoCategoryToggler/ToDoCategoryToggler.js';
import '../ToDoListItem/ToDoListItem.js';
import '../MenuItem/MenuItem.js';
import '../BackButton/BackButton.js';
import '../Title/Title.js';
import '../FeedbackStrip/FeedbackStrip.js';
import '../Tooltip/Tooltip.js';
import type { Icon } from './Icon.js';
import { GRACE_MS, resetReports } from './phosphor.js';

const host = document.body.appendChild(document.createElement('div'));
host.id = 'icon-host';

afterEach(() => render(html``, host));

const mount = async (template: unknown) => {
	render(template, host);
	const all = [...host.querySelectorAll('*')].filter((el) => el.localName.startsWith('gv-'));
	await Promise.all(all.map((el) => (el as Icon).updateComplete));
	return host.querySelector('gv-icon') as Icon;
};

/** The accessibility tree under the host, as Playwright computes it. */
const tree = () => commands.ariaSnapshot('#icon-host');
const images = async () => (await tree()).match(/- img\b.*/g) ?? [];

describe('gv-icon is decorative by default (#24 FR-01 to FR-03, FR-07)', () => {
	for (const variant of ['', 'is-filled', 'fill-in-hover'])
		it(`exposes nothing without a label${variant ? ` (${variant})` : ''}`, async () => {
			const el = await mount(
				html`<p>before</p>
					<gv-icon
						name="tree"
						?is-filled=${variant === 'is-filled'}
						?fill-in-hover=${variant === 'fill-in-hover'}
					></gv-icon>`
			);
			expect(await images()).toEqual([]);
			await userEvent.hover(el);
			expect(await images()).toEqual([]);
			await userEvent.unhover(el);
			expect(await images()).toEqual([]);
		});

	it.each(['', '   '])('treats label="%s" as no label', async (label) => {
		await mount(
			html`<p>before</p>
				<gv-icon name="tree" label=${label}></gv-icon>`
		);
		expect(await images()).toEqual([]);
	});

	it('renders and exposes nothing for an empty name, with or without a label', async () => {
		const el = await mount(
			html`<p>before</p>
				<gv-icon name="" label="Tree"></gv-icon><gv-icon name="!!"></gv-icon>`
		);
		expect(el.shadowRoot!.children).toHaveLength(0);
		expect(await images()).toEqual([]);
	});
});

describe('gv-icon with a label (#24 FR-04 to FR-06)', () => {
	for (const variant of ['', 'is-filled', 'fill-in-hover'])
		it(`is exactly one image named by the label${variant ? ` (${variant})` : ''}`, async () => {
			const el = await mount(
				html`<gv-icon
					name="warning-circle"
					label="Warning"
					?is-filled=${variant === 'is-filled'}
					?fill-in-hover=${variant === 'fill-in-hover'}
				></gv-icon>`
			);
			expect(await images()).toEqual(['- img "Warning"']);
			await userEvent.hover(el);
			expect(await images()).toEqual(['- img "Warning"']);
		});

	it('renames on change and returns to decorative when the label is removed', async () => {
		const el = await mount(
			html`<p>before</p>
				<gv-icon name="tree" label="Tree"></gv-icon>`
		);
		el.label = 'Oak';
		await el.updateComplete;
		expect(await images()).toEqual(['- img "Oak"']);
		el.removeAttribute('label');
		el.label = undefined;
		await el.updateComplete;
		expect(await images()).toEqual([]);
	});
});

describe('attributes the page sets on the host (#24 FR-08, FR-09)', () => {
	it('lets aria-hidden on the host hide a labelled glyph', async () => {
		await mount(
			html`<p>before</p>
				<gv-icon name="tree" label="Tree" aria-hidden="true"></gv-icon>`
		);
		expect(await images()).toEqual([]);
	});

	it('keeps a page-labelled host as one image, untouched', async () => {
		const el = await mount(html`<gv-icon name="tree" role="img" aria-label="Tree"></gv-icon>`);
		expect(await images()).toEqual(['- img "Tree"']);
		expect(el.getAttribute('role')).toBe('img');
		expect(el.getAttribute('aria-label')).toBe('Tree');
		expect(el.hasAttribute('aria-hidden')).toBe(false);
	});
});

describe('consumers expose no glyph (#24 FR-10 to FR-12)', () => {
	it('hides the glyph in controls without changing their names', async () => {
		await mount(html`
			<gv-button icon="tree">Plant</gv-button>
			<gv-icon-button aria-label="Plant a tree"></gv-icon-button>
			<gv-todo-category-toggler label="Category" count="3"></gv-todo-category-toggler>
			<gv-todo-list-item heading="Water the tree" category="Garden"></gv-todo-list-item>
		`);
		// Before the fix gv-button and gv-icon-button each held an unnamed image. gv-button is named by
		// its slotted text (#34).
		expect((await tree()).split('\n')).toEqual([
			'- button "Plant"',
			'- button "Plant a tree"',
			'- button "3 Category"',
			'- checkbox',
			'- paragraph: Water the tree',
			'- paragraph: Garden'
		]);
	});

	it('stays hidden where the consumer already hid it', async () => {
		await mount(html`
			<gv-menu-item label="Home" href="#"></gv-menu-item>
			<gv-back-button></gv-back-button>
			<gv-title heading="Docs"></gv-title>
			<gv-feedback-strip heading="Saved"></gv-feedback-strip>
			<gv-tooltip icon="info" text="Tip"></gv-tooltip>
		`);
		expect(await tree()).not.toMatch(/- img\b/);
	});
});

describe('missing-glyph warning (#38 FR-01 to FR-11)', () => {
	let warn: MockInstance<typeof console.warn>;

	beforeEach(() => {
		resetReports();
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.useFakeTimers({ toFake: ['setTimeout'] });
	});
	afterEach(() => {
		vi.useRealTimers();
		warn.mockRestore();
	});

	const settle = () => vi.advanceTimersByTimeAsync(GRACE_MS + 10);

	it('warns once per tag with the import to add', async () => {
		await mount(html`
			<gv-icon name="no-such-glyph"></gv-icon>
			<gv-icon name="no-such-glyph"></gv-icon>
			<gv-icon name="no-such-glyph" fill-in-hover></gv-icon>
		`);
		await settle();
		expect(warn).toHaveBeenCalledTimes(1);
		const [message] = warn.mock.calls[0] as [string];
		expect(message).toContain('<ph-no-such-glyph>');
		expect(message).toContain('name="no-such-glyph"');
		expect(message).toContain("import '@phosphor-icons/webcomponents/PhNoSuchGlyph';");
	});

	it('schedules nothing for a registered glyph', async () => {
		const whenDefined = vi.spyOn(customElements, 'whenDefined');
		await mount(html`<gv-icon name="tree"></gv-icon>`);
		await settle();
		expect(whenDefined).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		whenDefined.mockRestore();
	});

	it('stays quiet when the glyph registers during the grace period, and upgrades in place', async () => {
		const el = await mount(html`<gv-icon name="late-glyph"></gv-icon>`);
		const glyph = el.shadowRoot!.querySelector('ph-late-glyph')!;
		customElements.define('ph-late-glyph', class extends HTMLElement {});
		await settle();
		expect(warn).not.toHaveBeenCalled();
		expect(el.shadowRoot!.querySelector('ph-late-glyph')).toBe(glyph);
		expect(glyph.matches(':defined')).toBe(true);
	});

	it('upgrades in place when the glyph registers after the warning', async () => {
		const el = await mount(html`<gv-icon name="later-glyph"></gv-icon>`);
		const glyph = el.shadowRoot!.querySelector('ph-later-glyph')!;
		await settle();
		expect(warn).toHaveBeenCalledTimes(1);
		customElements.define('ph-later-glyph', class extends HTMLElement {});
		expect(el.shadowRoot!.querySelector('ph-later-glyph')).toBe(glyph);
		expect(glyph.matches(':defined')).toBe(true);
	});

	it('checks a new name after a change, and never repeats a reported tag', async () => {
		const el = await mount(html`<gv-icon name="missing-one"></gv-icon>`);
		await settle();
		el.name = 'missing-two';
		await el.updateComplete;
		await settle();
		el.name = 'missing-one';
		await el.updateComplete;
		await settle();
		expect(warn.mock.calls.map(([m]) => String(m).match(/<ph-[a-z-]+>/)![0])).toEqual([
			'<ph-missing-one>',
			'<ph-missing-two>'
		]);
	});

	it('does not report a name that changed before the grace period ended', async () => {
		const el = await mount(html`<gv-icon name="missing-typo"></gv-icon>`);
		el.name = 'tree';
		await el.updateComplete;
		await settle();
		expect(warn).not.toHaveBeenCalled();
	});

	it('logs nothing for an empty name', async () => {
		await mount(html`<gv-icon name=""></gv-icon><gv-icon name="__"></gv-icon>`);
		await settle();
		expect(warn).not.toHaveBeenCalled();
	});

	it('shows the original value when sanitising changed it', async () => {
		await mount(html`<gv-icon name="NoSuch_Thing"></gv-icon>`);
		await settle();
		expect(String(warn.mock.calls[0][0])).toContain('name="NoSuch_Thing" (read as "nosuchthing")');
	});

	it('names the component whose shadow root holds the icon', async () => {
		await mount(html`<gv-back-button icon="missing-back"></gv-back-button>`);
		await settle();
		expect(String(warn.mock.calls[0][0])).toContain('(inside <gv-back-button>)');
	});
});
