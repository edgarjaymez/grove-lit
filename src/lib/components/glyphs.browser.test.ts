import { afterEach, describe, expect, it } from 'vitest';
import { metadataByTag } from '../../test/component-metadata.js';
import { groveTags } from '../../test/grove-tags.js';
import { deepElements, settleDeep } from '../../test/shadow.js';
import type { ComponentMetadata } from './metadata.js';

const metaOf = (tag: string) => metadataByTag.get(tag)!;

const host = document.body.appendChild(document.createElement('div'));
afterEach(() => host.replaceChildren());

/** Mounts `tag` with `attributes`, lets nested components render, and returns the glyphs drawn. */
const glyphsOf = async (tag: string, attributes: readonly (readonly [string, string])[] = []) => {
	const el = document.createElement(tag);
	for (const [name, value] of attributes) el.setAttribute(name, value);
	host.replaceChildren(el);
	await settleDeep(host);
	return new Set(
		deepElements(host)
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
	it('pairs every registered tag with one metadata file', () => {
		expect([...metadataByTag.keys()].sort()).toEqual([...groveTags].sort());
	});

	it.each(groveTags)('<%s> draws exactly its default and fixed glyphs', async (tag) => {
		const meta = metaOf(tag);
		const drawn = new Set<string>();
		for (const attributes of [[], ...variantAttributes(meta).map((pair) => [pair])])
			for (const glyph of await glyphsOf(tag, attributes)) drawn.add(glyph);
		const declared = [meta.phosphor.default, ...meta.phosphor.fixed].filter((g) => g !== null);
		expect([...drawn].sort()).toEqual([...new Set(declared)].sort());
	});

	customElements.define('ph-metadata-probe', class extends HTMLElement {});

	it.each(groveTags.filter((tag) => metaOf(tag).phosphor.prop !== null))(
		'<%s> draws the glyph its prop attribute names',
		async (tag) => {
			const drawn = await glyphsOf(tag, [[metaOf(tag).phosphor.prop!, 'metadata-probe']]);
			expect([...drawn]).toContain('metadata-probe');
		}
	);
});
