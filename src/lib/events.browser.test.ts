import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './index.js';
import type { ToDoListItem } from './index.js';

const OLD = ['input', 'change', 'toggle', 'back'];
const NEW = ['gv-input', 'gv-change', 'gv-toggle', 'gv-back'];

let seen: { type: string; detail: unknown; target: string }[] = [];
const record = (e: Event) => {
	// Only events that escaped a Grove host reach the document with a gv-* target.
	const target = (e.target as Element).localName;
	if (!target.startsWith('gv-')) return;
	if (e.type === 'gv-back') e.preventDefault(); // keep the test runner's history intact
	seen.push({ type: e.type, detail: (e as CustomEvent).detail, target });
};

beforeEach(() => {
	seen = [];
	for (const type of [...OLD, ...NEW]) document.addEventListener(type, record);
});

afterEach(() => {
	for (const type of [...OLD, ...NEW]) document.removeEventListener(type, record);
	document.body.replaceChildren();
});

const mount = async <T extends HTMLElement>(markup: string) => {
	document.body.innerHTML = markup;
	const el = document.body.firstElementChild as T & { updateComplete: Promise<unknown> };
	await el.updateComplete;
	return el;
};

const inner = (el: Element, selector: string) =>
	el.shadowRoot!.querySelector<HTMLElement>(selector)!;

describe('gv- event names (#41 FR-E1, FR-E2)', () => {
	it('gv-checkbox dispatches gv-change with the new checked state', async () => {
		const el = await mount('<gv-checkbox></gv-checkbox>');
		inner(el, 'button').click();
		expect(seen).toEqual([{ type: 'gv-change', detail: true, target: 'gv-checkbox' }]);
	});

	it('gv-todo-category-toggler dispatches gv-toggle', async () => {
		const el = await mount('<gv-todo-category-toggler></gv-todo-category-toggler>');
		inner(el, 'button').click();
		expect(seen).toEqual([{ type: 'gv-toggle', detail: true, target: 'gv-todo-category-toggler' }]);
	});

	it('gv-back-button dispatches a cancelable gv-back that stops history.back()', async () => {
		const el = await mount('<gv-back-button></gv-back-button>');
		let cancelable = false;
		let prevented = false;
		el.addEventListener('gv-back', (e) => {
			cancelable = e.cancelable;
			queueMicrotask(() => (prevented = e.defaultPrevented));
		});
		const before = history.length;
		inner(el, 'button').click();
		await Promise.resolve();
		expect(seen.map((e) => e.type)).toEqual(['gv-back']);
		expect(cancelable).toBe(true);
		expect(prevented).toBe(true);
		expect(history.length).toBe(before);
	});

	it('gv-text-input dispatches gv-input per edit and gv-change on commit, never the native names', async () => {
		const el = await mount('<gv-text-input></gv-text-input>');
		const input = inner(el, 'input') as HTMLInputElement;
		await userEvent.type(input, 'ab');
		input.blur();
		expect(seen).toEqual([
			{ type: 'gv-input', detail: 'a', target: 'gv-text-input' },
			{ type: 'gv-input', detail: 'ab', target: 'gv-text-input' },
			{ type: 'gv-change', detail: 'ab', target: 'gv-text-input' }
		]);
	});
});

describe('gv-todo-list-item dispatches exactly one gv-change per toggle', () => {
	it('on a checkbox click', async () => {
		const el = await mount<ToDoListItem>(
			'<gv-todo-list-item heading="Water the ferns"></gv-todo-list-item>'
		);
		inner(inner(el, 'gv-checkbox'), 'button').click();
		expect(seen).toEqual([{ type: 'gv-change', detail: true, target: 'gv-todo-list-item' }]);
		expect(el.isDone).toBe(true);
	});

	it('on a row click', async () => {
		const el = await mount(
			'<gv-todo-list-item heading="Water the ferns" is-done></gv-todo-list-item>'
		);
		inner(el, '.title').click();
		expect(seen).toEqual([{ type: 'gv-change', detail: false, target: 'gv-todo-list-item' }]);
	});
});

describe('gv-todo-list-item heading (#26 FR-07, FR-08)', () => {
	it('reads the task text from heading and leaves title to the browser', async () => {
		const el = await mount('<gv-todo-list-item heading="Water the ferns"></gv-todo-list-item>');
		expect(inner(el, '.title').textContent).toBe('Water the ferns');
		expect(el.hasAttribute('title')).toBe(false);
		expect(el.title).toBe('');
	});

	it('no longer treats a title attribute as the task text', async () => {
		const el = await mount('<gv-todo-list-item title="Old"></gv-todo-list-item>');
		expect(inner(el, '.title').textContent).toBe('Task');
	});
});
