import { afterEach, describe, expect, it } from 'vitest';
import type { LitElement } from 'lit';
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

/**
 * Metadata variant keys that are not the attribute of the same name, as `<tag> <key>`. A string is
 * the attribute that takes the variant's options; null marks a variant that no attribute takes.
 */
const variantAliases: Record<string, string | null> = {
	'gv-button style': 'variant',
	// regular or filled is the boolean is-filled, which changes the weight, not the glyph.
	'gv-icon weight': null
};

/** Each metadata variant with its plain-token options, the ones an attribute can take. */
const tokenVariants = (meta: ComponentMetadata) =>
	Object.entries((meta.variants as Record<string, { options?: unknown[] }> | undefined) ?? {})
		.map(
			([key, { options = [] }]) =>
				[
					key,
					options.filter(
						(option): option is string =>
							typeof option === 'string' && /^[a-z][a-z0-9-]*$/.test(option)
					)
				] as const
		)
		.filter(([, tokens]) => tokens.length > 0);

/** The attribute a variant key stands for on `tag`: its alias, or else the key itself. */
const attributeOf = (tag: string, key: string) =>
	`${tag} ${key}` in variantAliases ? variantAliases[`${tag} ${key}`] : key;

const observed = (tag: string) =>
	(customElements.get(tag) as unknown as typeof LitElement).observedAttributes;

/** One attribute per plain-token variant option, so a glyph fixed per variant is drawn too. */
const variantAttributes = (tag: string) =>
	tokenVariants(metaOf(tag)).flatMap(([key, tokens]) => {
		const attribute = attributeOf(tag, key);
		return attribute && observed(tag).includes(attribute)
			? tokens.map((token) => [attribute, token] as const)
			: [];
	});

describe('the phosphor metadata matches what each component draws (#47)', () => {
	it('pairs every registered tag with one metadata file', () => {
		expect([...metadataByTag.keys()].sort()).toEqual([...groveTags].sort());
		expect(
			groveTags.map((tag) => [tag, metaOf(tag).component.name]),
			'component.name is the class registered for the tag'
		).toEqual(groveTags.map((tag) => [tag, customElements.get(tag)!.name]));
	});

	it.each(groveTags)('<%s> keys each plain-token variant by an attribute it observes', (tag) => {
		const unmatched = tokenVariants(metaOf(tag))
			.map(([key]) => key)
			.filter((key) => {
				const attribute = attributeOf(tag, key);
				return attribute !== null && !observed(tag).includes(attribute);
			});
		expect(unmatched, 'not an observed attribute: add it to variantAliases').toEqual([]);
	});

	it.each(groveTags)('<%s> draws exactly its default and fixed glyphs', async (tag) => {
		const meta = metaOf(tag);
		const drawn = new Set<string>();
		for (const attributes of [[], ...variantAttributes(tag).map((pair) => [pair])])
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
