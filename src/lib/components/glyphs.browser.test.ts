import { afterEach, describe, expect, it } from 'vitest';
import type { ComponentMetadata } from './metadata.js';

// Importing every component module registers it; its exported class then names its tag.
const modules = import.meta.glob<Record<string, unknown>>(
	['./*/*.ts', '!./*/*.stories.ts', '!./*/*.metadata.ts', '!./*/*.test.ts'],
	{ eager: true }
);
const metadataModules = import.meta.glob<Record<string, ComponentMetadata>>('./*/*.metadata.ts', {
	eager: true
});

const tagOf = (metadataPath: string) =>
	Object.values(modules[metadataPath.replace('.metadata.ts', '.ts')] ?? {})
		.map((value) =>
			typeof value === 'function' ? customElements.getName(value as CustomElementConstructor) : null
		)
		.find(Boolean);

const components = Object.entries(metadataModules).flatMap(([path, module]) =>
	Object.entries(module).map(([name, meta]) => ({ name, meta, tag: tagOf(path) }))
);

const host = document.body.appendChild(document.createElement('div'));
afterEach(() => host.replaceChildren());

/** Every element under `root`, through nested shadow roots. */
const deep = (root: ParentNode): Element[] =>
	[...root.querySelectorAll('*')].flatMap((el) => [
		el,
		...(el.shadowRoot ? deep(el.shadowRoot) : [])
	]);

/** Mounts `tag` with `attributes`, lets nested components render, and returns the glyphs drawn. */
const glyphsOf = async (tag: string, attributes: readonly (readonly [string, string])[] = []) => {
	const el = document.createElement(tag);
	for (const [name, value] of attributes) el.setAttribute(name, value);
	host.replaceChildren(el);
	for (let count = -1; count !== deep(host).length; ) {
		count = deep(host).length;
		await Promise.all(
			deep(host).map((node) => (node as { updateComplete?: unknown }).updateComplete)
		);
	}
	return new Set(
		deep(host)
			.map((node) => node.localName)
			.filter((name) => name.startsWith('ph-'))
			.map((name) => name.slice(3))
	);
};

/** One attribute per plain-token variant option, so a glyph fixed per variant is drawn too. */
const variantAttributes = (meta: ComponentMetadata) =>
	Object.entries(
		(meta.variants as Record<string, { options?: unknown[] }> | undefined) ?? {}
	).flatMap(([attribute, { options = [] }]) =>
		options
			.filter(
				(option): option is string => typeof option === 'string' && /^[a-z][a-z0-9-]*$/.test(option)
			)
			.map((option) => [attribute, option] as const)
	);

describe('the phosphor metadata matches what each component draws (#47)', () => {
	it('maps every metadata file to a registered tag', () => {
		expect(components).toHaveLength(15);
		expect(components.filter(({ tag }) => !tag).map(({ name }) => name)).toEqual([]);
	});

	it.each(components)('$name draws exactly its default and fixed glyphs', async ({ meta, tag }) => {
		const drawn = new Set<string>();
		for (const attributes of [[], ...variantAttributes(meta).map((pair) => [pair])])
			for (const glyph of await glyphsOf(tag!, attributes)) drawn.add(glyph);
		const declared = [meta.phosphor.default, ...meta.phosphor.fixed].filter((g) => g !== null);
		expect([...drawn].sort()).toEqual([...new Set(declared)].sort());
	});

	customElements.define('ph-metadata-probe', class extends HTMLElement {});

	it.each(components.filter(({ meta }) => meta.phosphor.prop !== null))(
		'$name draws the glyph its prop attribute names',
		async ({ meta, tag }) => {
			const drawn = await glyphsOf(tag!, [[meta.phosphor.prop!, 'metadata-probe']]);
			expect([...drawn]).toContain('metadata-probe');
		}
	);
});
