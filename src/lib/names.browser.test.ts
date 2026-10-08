import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { commands, userEvent } from 'vitest/browser';
import type { AxNode } from 'vitest/browser';
import './index.js';
import type { Checkbox, ToDoListItem } from './index.js';
import { NAME_GRACE_MS, resetNameWarnings } from './utils/accessible-name.js';

/**
 * Accessible names and descriptions across the shadow boundary (#50: #21, #25, #26), read from
 * Chrome's own accessibility tree (#21 FR-17).
 */

const host = document.body.appendChild(document.createElement('div'));
host.id = 'names-host';

let warn: MockInstance<typeof console.warn>;
beforeEach(() => {
	resetNameWarnings();
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
	warn.mockRestore();
	host.replaceChildren();
});

type Updatable = HTMLElement & { updateComplete: Promise<unknown> };

const settle = async () => {
	for (const el of host.querySelectorAll<Updatable>('*'))
		if ('updateComplete' in el) await el.updateComplete;
	await new Promise((resolve) => requestAnimationFrame(resolve));
};

const mount = async <T extends HTMLElement = HTMLElement>(markup: string, selector?: string) => {
	host.innerHTML = markup;
	await settle();
	return (selector ? host.querySelector(selector) : host.firstElementChild) as T;
};

const ax = () => commands.axNodes('#names-host');
/** The names of the exposed nodes with this role. */
const names = (nodes: AxNode[], role: string) =>
	nodes.filter((n) => n.role === role).map((n) => n.name);
/** Every Grove host the tree exposes with a name: a named role-less host is a second copy (FR-04). */
const namedHosts = (nodes: AxNode[]) =>
	nodes.filter((n) => n.node.startsWith('gv-') && n.name).map((n) => `${n.node} "${n.name}"`);
const control = (el: Element) =>
	el.shadowRoot!.querySelector<HTMLElement>('button, a, input, [role="checkbox"]')!;

describe('names reach the focused control, once (#21 FR-03 to FR-07)', () => {
	it.each([
		['gv-icon-button', '<gv-icon-button icon="x" label="Close"></gv-icon-button>', 'button'],
		['gv-button, icon only', '<gv-button icon="x" label="Close"></gv-button>', 'button'],
		['gv-button, link mode', '<gv-button href="#" icon="x" label="Close"></gv-button>', 'link'],
		['gv-checkbox', '<gv-checkbox label="Close"></gv-checkbox>', 'checkbox'],
		['gv-text-input', '<gv-text-input label="Close"></gv-text-input>', 'textbox']
	])('%s: label names the control, never the host', async (_, markup, role) => {
		await mount(markup);
		const nodes = await ax();
		expect(names(nodes, role)).toEqual(['Close']);
		expect(nodes.find((n) => n.role === role)?.focusable).toBe(true);
		expect(namedHosts(nodes)).toEqual([]);
	});

	it('follows a changed label, and a removed one leaves nothing behind (FR-05, FR-06)', async () => {
		const el = await mount<Updatable & { label?: string }>(
			'<gv-icon-button icon="x" label="Close"></gv-icon-button>'
		);
		el.label = 'Dismiss';
		await settle();
		expect(names(await ax(), 'button')).toEqual(['Dismiss']);
		el.removeAttribute('label');
		el.label = undefined;
		await settle();
		expect(names(await ax(), 'button')).toEqual(['']);
		expect(control(el).hasAttribute('aria-label')).toBe(false);
		expect(el.hasAttribute('aria-label')).toBe(false);
	});

	it('takes the name from visible text, which label never overrides (FR-07)', async () => {
		await mount(`
			<gv-button label="Ignored">Save</gv-button>
			<gv-button text="Send" label="Ignored"></gv-button>
			<gv-checkbox label="Ignored">Subscribe</gv-checkbox>`);
		const nodes = await ax();
		expect(names(nodes, 'button')).toEqual(['Save', 'Send']);
		expect(names(nodes, 'checkbox')).toEqual(['Subscribe']);
		for (const el of host.children) expect(control(el).hasAttribute('aria-label')).toBe(false);
	});

	it('uses label when the slot holds an icon or hidden content, not text (review R3)', async () => {
		await mount(`
			<gv-button label="Plant"><gv-icon name="tree"></gv-icon></gv-button>
			<gv-button label="Star"><span aria-hidden="true">*</span></gv-button>`);
		expect(names(await ax(), 'button')).toEqual(['Plant', 'Star']);
	});
});

describe('descriptions (#21 FR-08 to FR-10, OD4)', () => {
	it.each([
		[
			'gv-icon-button',
			'<gv-icon-button icon="x" label="Copy" description="Copies the hex code"></gv-icon-button>',
			'button'
		],
		['gv-button', '<gv-button description="Copies the hex code">Copy</gv-button>', 'button'],
		[
			'gv-checkbox',
			'<gv-checkbox description="Copies the hex code">Copy</gv-checkbox>',
			'checkbox'
		],
		[
			'gv-text-input',
			'<gv-text-input label="Copy" description="Copies the hex code"></gv-text-input>',
			'textbox'
		]
	])(
		'%s: description describes the control, and is not read again as text',
		async (_, markup, role) => {
			await mount(markup);
			const nodes = await ax();
			expect(nodes.filter((n) => n.role === role).map((n) => n.description)).toEqual([
				'Copies the hex code'
			]);
			expect(nodes.some((n) => n.node === '#text' && n.name === 'Copies the hex code')).toBe(false);
		}
	);

	it('drops a removed description from the control (FR-09)', async () => {
		const el = await mount<Updatable & { description?: string }>(
			'<gv-icon-button icon="x" label="Copy" description="Copies the hex code"></gv-icon-button>'
		);
		el.removeAttribute('description');
		el.description = undefined;
		await settle();
		expect((await ax()).find((n) => n.role === 'button')?.description).toBe('');
		expect(control(el).hasAttribute('aria-describedby')).toBe(false);
	});

	it("describes a tooltip's trigger with the tooltip's visible text (FR-08, FR-10)", async () => {
		await mount(`
			<gv-icon-button icon="copy" label="Copy" description="Copy hex"></gv-icon-button>
			<gv-tooltip aria-hidden="true" type="simple" icon="copy" message="Copy hex"></gv-tooltip>`);
		const nodes = await ax();
		const trigger = nodes.find((n) => n.role === 'button');
		expect(trigger).toMatchObject({ name: 'Copy', description: 'Copy hex' });
		// The visual-only tooltip isn't read a second time.
		expect(nodes.filter((n) => n.name === 'Copy hex' || n.description === 'Copy hex')).toEqual([
			trigger
		]);
	});
});

describe('page labels name form controls (#21 FR-11 to FR-14, #25 FR-11, FR-12)', () => {
	it.each([
		['for', '<label for="agree">Agree to terms</label><gv-checkbox id="agree"></gv-checkbox>'],
		['wrapping', '<label>Agree to terms <gv-checkbox></gv-checkbox></label>']
	])('a %s label names the checkbox, not the host', async (_, markup) => {
		await mount(markup);
		const nodes = await ax();
		expect(names(nodes, 'checkbox').map((n) => n.trim())).toEqual(['Agree to terms']);
		expect(namedHosts(nodes)).toEqual([]);
		// The same text as aria-label, for checkers that can't follow element references.
		expect(control(host.querySelector('gv-checkbox')!).ariaLabel).toBe('Agree to terms');
	});

	it('a label names an icon-only gv-button', async () => {
		await mount('<label for="send">Send it</label><gv-button id="send" icon="x"></gv-button>');
		const nodes = await ax();
		expect(names(nodes, 'button')).toEqual(['Send it']);
		expect(namedHosts(nodes)).toEqual([]);
	});

	it("the control's own text wins over a page label, and a page label over label", async () => {
		await mount(`
			<label for="a">Page</label><gv-checkbox id="a" label="Prop">Own</gv-checkbox>
			<label for="b">Page</label><gv-checkbox id="b" label="Prop"></gv-checkbox>
			<label for="c">Page</label><gv-button id="c" label="Prop">Own</gv-button>`);
		const nodes = await ax();
		expect(names(nodes, 'checkbox')).toEqual(['Own', 'Page']);
		expect(names(nodes, 'button')).toEqual(['Own']);
	});

	it('reads a label the way it names: hidden parts left out, image alt text in', async () => {
		await mount(`
			<label for="x"><img alt="Terms" src="data:," /> agree <span hidden>no</span><span aria-hidden="true">*</span></label>
			<gv-checkbox id="x"></gv-checkbox>`);
		expect(names(await ax(), 'checkbox')).toEqual(['Terms agree']);
	});

	it('follows label text edits, and labels added or removed later', async () => {
		const el = await mount('<gv-checkbox id="later"></gv-checkbox>');
		/** Chrome's name, and the aria-label a checker that reads attributes (axe-core) sees. */
		const state = async () => [names(await ax(), 'checkbox')[0], control(el).ariaLabel];
		expect(await state()).toEqual(['', null]);
		const label = document.createElement('label');
		label.htmlFor = 'later';
		label.textContent = 'Agree';
		host.prepend(label);
		await settle();
		expect(await state()).toEqual(['Agree', 'Agree']);
		label.firstChild!.textContent = 'Accept';
		await settle();
		expect(await state()).toEqual(['Accept', 'Accept']);
		label.htmlFor = 'elsewhere';
		await settle();
		expect(await state()).toEqual(['', null]);
		label.htmlFor = 'later';
		await settle();
		label.remove();
		await settle();
		expect(await state()).toEqual(['', null]);
		// Labels are read before render: no update is scheduled from inside one.
		expect(warn.mock.calls.flat().join(' ')).not.toContain('change-in-update');
	});

	it('a label click toggles once and focuses the checkbox; a click beside it does nothing', async () => {
		const el = await mount<Checkbox>(
			'<label for="agree">Agree</label><p id="beside">Beside</p><gv-checkbox id="agree"></gv-checkbox>',
			'gv-checkbox'
		);
		const changes: boolean[] = [];
		const clicks: EventTarget[] = [];
		el.addEventListener('gv-change', (e) => changes.push(e.detail));
		document.addEventListener('click', (e) => clicks.push(e.target!), { capture: true });
		await userEvent.click(host.querySelector('label')!);
		await settle();
		expect(el.checked).toBe(true);
		expect(changes).toEqual([true]);
		expect(el.shadowRoot!.activeElement).toBe(control(el));
		expect(clicks.filter((t) => t === el)).toHaveLength(1);
		await userEvent.click(host.querySelector('#beside')!);
		expect(el.checked).toBe(true);
		expect(changes).toEqual([true]);
	});

	it('a click on a checkbox inside its wrapping label toggles once', async () => {
		const el = await mount<Checkbox>(
			'<label>Agree <gv-checkbox></gv-checkbox></label>',
			'gv-checkbox'
		);
		const changes: boolean[] = [];
		el.addEventListener('gv-change', (e) => changes.push(e.detail));
		await userEvent.click(control(el));
		await userEvent.click(host.querySelector('label')!, { position: { x: 2, y: 2 } });
		expect(changes).toEqual([true, false]);
	});

	it('a disabled checkbox, or one in a disabled fieldset, ignores its label (#25 FR-09)', async () => {
		await mount(`
			<label for="d">Disabled</label><gv-checkbox id="d" disabled></gv-checkbox>
			<fieldset disabled><label for="f">In fieldset</label><gv-checkbox id="f"></gv-checkbox></fieldset>`);
		const [disabled, inFieldset] = host.querySelectorAll<Checkbox>('gv-checkbox');
		for (const label of host.querySelectorAll('label'))
			await userEvent.click(label, { force: true });
		expect([disabled.checked, inFieldset.checked]).toEqual([false, false]);
		const nodes = await ax();
		expect(nodes.filter((n) => n.role === 'checkbox').map((n) => [n.name, n.disabled])).toEqual([
			['Disabled', true],
			['In fieldset', true]
		]);
	});

	it('focus() on the host reaches the control, and Tab stops once (#21 FR-14)', async () => {
		await mount(`
			<button id="before">Before</button>
			<gv-checkbox>One</gv-checkbox>
			<gv-button>Two</gv-button>
			<button id="after">After</button>`);
		const [checkbox, button] = host.querySelectorAll<HTMLElement>('gv-checkbox, gv-button');
		button.focus();
		expect(button.shadowRoot!.activeElement).toBe(control(button));
		host.querySelector<HTMLElement>('#before')!.focus();
		await userEvent.tab();
		expect(checkbox.shadowRoot!.activeElement).toBe(control(checkbox));
		await userEvent.tab();
		expect(button.shadowRoot!.activeElement).toBe(control(button));
		await userEvent.tab();
		expect(document.activeElement?.id).toBe('after');
	});
});

describe('gv-checkbox (#25)', () => {
	it('exposes one named, focusable checkbox that keeps its name when toggled (FR-01 to FR-04)', async () => {
		const el = await mount<Checkbox>('<gv-checkbox>Subscribe</gv-checkbox>');
		let [box] = (await ax()).filter((n) => n.role === 'checkbox');
		expect(box).toMatchObject({ name: 'Subscribe', checked: 'false', focusable: true });
		expect(namedHosts(await ax())).toEqual([]);
		control(el).focus();
		await userEvent.keyboard(' ');
		await settle();
		[box] = (await ax()).filter((n) => n.role === 'checkbox');
		expect(box).toMatchObject({ name: 'Subscribe', checked: 'true' });
		await userEvent.keyboard('{Enter}');
		await settle();
		[box] = (await ax()).filter((n) => n.role === 'checkbox');
		expect(box).toMatchObject({ name: 'Subscribe', checked: 'false' });
	});

	it('invents no name, and a disabled box keeps its own (FR-07, FR-08)', async () => {
		await mount('<gv-checkbox></gv-checkbox><gv-checkbox disabled>Subscribe</gv-checkbox>');
		const boxes = (await ax()).filter((n) => n.role === 'checkbox');
		expect(boxes.map((n) => [n.name, n.disabled ?? false])).toEqual([
			['', false],
			['Subscribe', true]
		]);
		expect(control(host.firstElementChild!).hasAttribute('aria-label')).toBe(false);
	});

	it('submits value under name while checked, and reset restores the first state', async () => {
		const form = await mount<HTMLFormElement>(`
			<form>
				<gv-checkbox name="news" checked>News</gv-checkbox>
				<gv-checkbox name="terms" value="yes">Terms</gv-checkbox>
				<gv-checkbox>Unnamed</gv-checkbox>
			</form>`);
		const [news, terms] = form.querySelectorAll<Checkbox>('gv-checkbox');
		const entries = () => [...new FormData(form).entries()];
		expect(entries()).toEqual([['news', 'on']]);
		await userEvent.click(control(news));
		await userEvent.click(control(terms));
		await settle();
		expect(entries()).toEqual([['terms', 'yes']]);
		const changes: boolean[] = [];
		form.addEventListener('gv-change', (e) => changes.push((e as CustomEvent<boolean>).detail));
		form.reset();
		await settle();
		expect([news.checked, terms.checked]).toEqual([true, false]);
		expect(entries()).toEqual([['news', 'on']]);
		expect(changes).toEqual([]);
	});

	it('toggles on Enter and never submits its form (review R9)', async () => {
		const form = await mount<HTMLFormElement>(
			'<form><gv-checkbox>Subscribe</gv-checkbox><gv-button type="submit">Send</gv-button></form>'
		);
		let submits = 0;
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			submits++;
		});
		const box = form.querySelector<Checkbox>('gv-checkbox')!;
		control(box).focus();
		await userEvent.keyboard('{Enter}');
		await new Promise((resolve) => setTimeout(resolve));
		expect(box.checked).toBe(true);
		expect(submits).toBe(0);
	});
});

describe('gv-todo-list-item (#26)', () => {
	it('names its checkbox after the heading and leaves the host unnamed (FR-01, FR-07, FR-08)', async () => {
		await mount(
			'<gv-todo-list-item heading="Water the ferns" category="Garden"></gv-todo-list-item>'
		);
		const nodes = await ax();
		expect(nodes.filter((n) => n.role === 'checkbox')).toMatchObject([
			{ name: 'Water the ferns', checked: 'false', focusable: true }
		]);
		expect(namedHosts(nodes)).toEqual([]);
		expect(nodes.some((n) => n.role === 'image')).toBe(false);
	});

	it('follows heading changes, defaults to Task, and invents nothing for "" (FR-02, FR-05, FR-06)', async () => {
		const el = await mount<ToDoListItem>('<gv-todo-list-item></gv-todo-list-item>');
		expect(names(await ax(), 'checkbox')).toEqual(['Task']);
		el.heading = 'Repot the fig';
		await settle();
		expect(names(await ax(), 'checkbox')).toEqual(['Repot the fig']);
		expect(el.shadowRoot!.querySelector('.title')!.textContent).toBe('Repot the fig');
		el.heading = '';
		await settle();
		expect(names(await ax(), 'checkbox')).toEqual(['']);
	});

	it('keeps the name through toggles, each one firing gv-change once (FR-03, FR-04, FR-13, FR-15)', async () => {
		const el = await mount<ToDoListItem>('<gv-todo-list-item heading="Water"></gv-todo-list-item>');
		const changes: boolean[] = [];
		el.addEventListener('gv-change', (e) => changes.push(e.detail));
		const box = el.shadowRoot!.querySelector('gv-checkbox')!;
		await userEvent.click(control(box));
		await userEvent.click(el.shadowRoot!.querySelector('.category')!);
		await settle();
		expect(changes).toEqual([true, false]);
		expect(names(await ax(), 'checkbox')).toEqual(['Water']);
	});
});

describe('host aria-label, one minor after label replaced it (#21 OD3, amended)', () => {
	it.each([
		['gv-icon-button', '<gv-icon-button icon="x" aria-label="Close"></gv-icon-button>', 'button'],
		['gv-button', '<gv-button icon="x" aria-label="Close"></gv-button>', 'button'],
		['gv-checkbox', '<gv-checkbox aria-label="Close"></gv-checkbox>', 'checkbox'],
		['gv-text-input', '<gv-text-input aria-label="Close"></gv-text-input>', 'textbox']
	])('%s still names its control from it, and warns once', async (tag, markup, role) => {
		await mount(markup + markup);
		expect(names(await ax(), role)).toEqual(['Close', 'Close']);
		const warnings = warn.mock.calls.map(([message]) => String(message));
		expect(warnings.filter((m) => m.includes(`<${tag} aria-label>`))).toHaveLength(1);
		expect(warnings.find((m) => m.includes(`<${tag} aria-label>`))).toContain('label="');
	});

	it('label wins over it, and it follows the native ariaLabel property', async () => {
		const [labelled, scripted] = await mount(
			'<gv-icon-button icon="x" aria-label="Old" label="New"></gv-icon-button><gv-icon-button icon="x"></gv-icon-button>'
		).then(() => [...host.children] as HTMLElement[]);
		scripted.ariaLabel = 'Scripted';
		await settle();
		expect(names(await ax(), 'button')).toEqual(['New', 'Scripted']);
		expect(labelled.getAttribute('aria-label')).toBe('Old');
	});

	it("gv-text-input's aria-describedby warns: a page id can't reach the input", async () => {
		await mount(
			'<gv-text-input label="Email" aria-describedby="hint"></gv-text-input><p id="hint">Hint</p>'
		);
		expect((await ax()).find((n) => n.role === 'textbox')?.description).toBe('');
		expect(warn.mock.calls.map(([m]) => String(m))).toContainEqual(
			expect.stringContaining('description="')
		);
	});
});

describe('missing-name warning (#21 OD5)', () => {
	beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout'] }));
	afterEach(() => vi.useRealTimers());

	const unnamedWarnings = () =>
		warn.mock.calls.map(([m]) => String(m)).filter((m) => m.includes('has no accessible name'));

	it('warns once per tag about controls still unnamed after the grace period', async () => {
		await mount(`
			<gv-icon-button icon="x"></gv-icon-button>
			<gv-icon-button icon="x"></gv-icon-button>
			<gv-checkbox></gv-checkbox>
			<gv-button>Named</gv-button>
			<label>Labelled <gv-checkbox></gv-checkbox></label>`);
		await vi.advanceTimersByTimeAsync(NAME_GRACE_MS - 1);
		expect(unnamedWarnings()).toEqual([]);
		await vi.advanceTimersByTimeAsync(1);
		expect(unnamedWarnings()).toHaveLength(2);
		expect(unnamedWarnings()[0]).toContain('<gv-icon-button>');
		expect(unnamedWarnings()[1]).toContain('<gv-checkbox>');
	});

	it('stays quiet about a name set during the grace period', async () => {
		const el = await mount<Updatable & { label?: string }>(
			'<gv-icon-button icon="x"></gv-icon-button>'
		);
		await vi.advanceTimersByTimeAsync(NAME_GRACE_MS / 2);
		el.label = 'Close';
		await vi.advanceTimersByTimeAsync(NAME_GRACE_MS);
		expect(unnamedWarnings()).toEqual([]);
	});
});
