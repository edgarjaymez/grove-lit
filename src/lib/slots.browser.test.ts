import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { commands } from 'vitest/browser';
import { html, render } from 'lit';
import type { LitElement } from 'lit';
import { groveTags } from '../test/grove-tags.js';
import type { ComponentMetadata } from './components/metadata.js';
import { resetSlotWarnings } from './utils/slot-content.js';

const modules = import.meta.glob<Record<string, ComponentMetadata>>(
	'./components/*/*.metadata.ts',
	{ eager: true }
);
/** composition.slots by component name, as the metadata declares them. */
const declaredSlots = new Map(
	Object.values(modules)
		.flatMap((module) => Object.values(module))
		.map((meta) => [meta.component.name, (meta.composition.slots ?? []).map((s) => s.name)])
);

const host = document.body.appendChild(document.createElement('div'));
host.id = 'slots-host';
afterEach(() => render(html``, host));

const mount = async <T extends LitElement>(template: unknown, selector: string) => {
	render(template, host);
	const el = host.querySelector(selector) as T;
	await el.updateComplete;
	return el;
};

/** The rendered text of an element's flat tree: its shadow tree, with slots replaced by what they show. */
const flatText = (node: Node): string => {
	if (node instanceof HTMLSlotElement)
		return node.assignedNodes({ flatten: true }).map(flatText).join('');
	if (node instanceof HTMLStyleElement) return '';
	if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
	const root = node instanceof Element && node.shadowRoot ? node.shadowRoot : node;
	return [...root.childNodes].map(flatText).join('');
};
const shown = (el: Element) => flatText(el).replace(/\s+/g, ' ').trim();

describe('slot allowlist (#34 FR-05, inverted)', () => {
	it('declares every slot a fully populated component renders', async () => {
		render(
			html`<gv-feedback-strip heading="H" message="M"></gv-feedback-strip>
				<gv-tooltip type="complete" heading="H" message="M"></gv-tooltip>`,
			host
		);
		for (const el of host.children as HTMLCollectionOf<LitElement>) {
			await el.updateComplete;
			const rendered = [...el.shadowRoot!.querySelectorAll('slot')].map((s) => s.name).sort();
			expect(rendered).toEqual([...declaredSlots.get(el.constructor.name)!].sort());
		}
	});

	it.each(groveTags)('<%s> renders only the slots its metadata declares', async (tag) => {
		const el = document.createElement(tag) as LitElement;
		host.append(el);
		await el.updateComplete;
		const name = el.constructor.name;
		const declared = declaredSlots.get(name) ?? [];
		const rendered = [...el.shadowRoot!.querySelectorAll('slot')].map((s) => s.name);
		expect(rendered.filter((slot) => !declared.includes(slot))).toEqual([]);
		el.remove();
	});
});

describe('precedence: a slotted child wins, removing it falls back to the prop', () => {
	const cases = [
		['gv-button', 'text', ''],
		['gv-title', 'heading', ''],
		['gv-menu-item', 'label', ''],
		['gv-feedback-strip', 'heading', 'heading'],
		['gv-feedback-strip', 'message', 'message'],
		['gv-tooltip', 'message', 'message']
	] as const;

	for (const [tag, prop, slot] of cases)
		it(`<${tag}> ${slot ? `slot "${slot}"` : 'default slot'} over ${prop}`, async () => {
			const el = document.createElement(tag) as unknown as LitElement & Record<string, unknown>;
			el[prop] = 'From prop';
			const child = document.createElement('span');
			if (slot) child.slot = slot;
			child.textContent = 'From slot';
			el.append(child);
			host.append(el);
			await el.updateComplete;
			expect(shown(el)).toContain('From slot');
			expect(shown(el)).not.toContain('From prop');

			child.remove();
			await new Promise((r) => setTimeout(r));
			await el.updateComplete;
			expect(shown(el)).toContain('From prop');

			el.append(child);
			await new Promise((r) => setTimeout(r));
			await el.updateComplete;
			expect(shown(el)).not.toContain('From prop');
		});

	it('re-renders when a child is added while detached', async () => {
		const el = await mount<LitElement>(html`<gv-button text="Fallback"></gv-button>`, 'gv-button');
		el.remove();
		el.append('Slotted');
		host.append(el);
		await el.updateComplete;
		expect(shown(el)).toBe('Slotted');
	});

	it('falls back to the prop when a child is removed while detached', async () => {
		const el = await mount<LitElement>(
			html`<gv-button text="Fallback">Slotted</gv-button>`,
			'gv-button'
		);
		el.remove();
		el.replaceChildren();
		host.append(el);
		await el.updateComplete;
		expect(shown(el)).toBe('Fallback');
	});

	it('shows a feedback-strip message slotted while detached', async () => {
		const el = await mount<LitElement>(
			html`<gv-feedback-strip></gv-feedback-strip>`,
			'gv-feedback-strip'
		);
		el.remove();
		const message = document.createElement('span');
		message.slot = 'message';
		message.textContent = 'Details';
		el.append(message);
		host.append(el);
		await el.updateComplete;
		expect(el.shadowRoot!.querySelector('.body')).not.toBeNull();
		expect(shown(el)).toContain('Details');
	});

	it('ignores whitespace between the tags, so the prop still renders', async () => {
		const el = await mount<LitElement>(html`<gv-button text="Save"> </gv-button>`, 'gv-button');
		expect(shown(el)).toBe('Save');
	});

	it('renders the feedback-strip message row for a slotted message alone', async () => {
		const el = await mount<LitElement>(
			html`<gv-feedback-strip heading="Saved"
				><span slot="message">Details</span></gv-feedback-strip
			>`,
			'gv-feedback-strip'
		);
		expect(el.shadowRoot!.querySelector('.body')).not.toBeNull();
		const bare = await mount<LitElement>(
			html`<gv-feedback-strip heading="Saved"></gv-feedback-strip>`,
			'gv-feedback-strip'
		);
		expect(bare.shadowRoot!.querySelector('.body')).toBeNull();
	});

	it('keeps the heading level from level, with slotted text inside it', async () => {
		const el = await mount<LitElement>(
			html`<gv-title level="1">Getting started</gv-title>`,
			'gv-title'
		);
		const heading = el.shadowRoot!.querySelector('h1')!;
		expect(heading.querySelector('slot')!.assignedNodes()[0].textContent).toBe('Getting started');
	});
});

describe('slotted text reaches the accessibility tree', () => {
	it('names the button and the link, and fills the heading', async () => {
		render(
			html`<gv-button>Save changes</gv-button>
				<gv-menu-item href="#">Work</gv-menu-item>
				<gv-title level="2">Docs</gv-title>`,
			host
		);
		await Promise.all([...host.children].map((el) => (el as LitElement).updateComplete));
		const tree = await commands.ariaSnapshot('#slots-host');
		expect(tree).toContain('button "Save changes"');
		expect(tree).toContain('link "Work"');
		expect(tree).toContain('heading "Docs" [level=2]');
	});
});

describe('slots take no form controls (#34 slot contract)', () => {
	let warn: MockInstance<typeof console.warn>;
	beforeEach(() => {
		resetSlotWarnings();
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('warns once per component when a slot holds a form control', async () => {
		render(
			html`<gv-button><input name="q" /></gv-button>
				<gv-button
					><span><button type="submit">Go</button></span></gv-button
				>
				<gv-feedback-strip><span slot="message">Plain text</span></gv-feedback-strip>`,
			host
		);
		await Promise.all([...host.children].map((el) => (el as LitElement).updateComplete));
		expect(warn).toHaveBeenCalledTimes(1);
		expect(String(warn.mock.calls[0][0])).toContain('<gv-button> default slot contains <input>');
	});

	it('stays quiet for text and phrasing content', async () => {
		await mount(
			html`<gv-feedback-strip
				><span slot="heading">Saved</span
				><span slot="message"><strong>Done</strong>, <a href="#">view</a></span></gv-feedback-strip
			>`,
			'gv-feedback-strip'
		);
		expect(warn).not.toHaveBeenCalled();
	});
});
