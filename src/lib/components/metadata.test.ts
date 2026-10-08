import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { phosphorModule } from './Icon/phosphor.js';
import type { ComponentMetadata } from './metadata.js';

const require = createRequire(import.meta.url);
const icons = join(dirname(require.resolve('@phosphor-icons/webcomponents')), 'icons');

const modules = import.meta.glob<Record<string, ComponentMetadata>>('./*/*.metadata.ts', {
	eager: true
});
const metadata = Object.values(modules).flatMap((module) => Object.entries(module));

describe('component metadata glyphs (#38 FR-12, FR-13)', () => {
	it('covers all 15 components', () => expect(metadata).toHaveLength(15));

	it.each(metadata)('%s declares its Phosphor glyphs, and each one exists', (_, meta) => {
		const { prop, default: fallback, fixed } = meta.phosphor;
		expect(prop === null || typeof prop === 'string').toBe(true);
		for (const glyph of [fallback, ...fixed].filter((g): g is string => g !== null))
			expect(existsSync(join(icons, `${phosphorModule(glyph)}.mjs`)), glyph).toBe(true);
	});
});

/** The tag a metadata file describes, from the component module next to it. */
const tagOf = (path: string) =>
	readFileSync(new URL(path.replace('.metadata.ts', '.ts'), import.meta.url), 'utf-8').match(
		/@customElement\('([a-z0-9-]+)'\)/
	)?.[1];

/** `<tag> <PhModule>` for every default and fixed glyph the metadata declares. */
const declaredPairs = Object.entries(modules)
	.flatMap(([path, module]) =>
		Object.values(module).flatMap(({ phosphor }) =>
			[phosphor.default, ...phosphor.fixed]
				.filter((glyph) => glyph !== null)
				.map((glyph) => `${tagOf(path)} ${phosphorModule(glyph)}`)
		)
	)
	.sort();

const phosphorImports = (file: string) =>
	[
		...readFileSync(new URL(file, import.meta.url), 'utf-8').matchAll(
			/^import '@phosphor-icons\/webcomponents\/(Ph\w+)';(.*)$/gm
		)
	].map(([, module, comment]) => ({ module, comment }));

describe('glyph lists copied from the metadata (#47)', () => {
	it('the Home.mdx recipe pairs each component with exactly the glyphs it declares', () => {
		const documented = phosphorImports('../../stories/Home.mdx')
			.flatMap(({ module, comment }) =>
				[...comment.matchAll(/gv-[a-z0-9-]+/g)].map(([tag]) => `${tag} ${module}`)
			)
			.sort();
		expect([...new Set(documented)]).toEqual([...new Set(declaredPairs)]);
	});

	it('the browser test setup registers exactly the declared glyphs', () => {
		const registered = phosphorImports('../../test/browser-setup.ts').map(({ module }) => module);
		const declared = new Set(declaredPairs.map((pair) => pair.split(' ')[1]));
		expect(registered.sort()).toEqual([...declared].sort());
	});
});

const compositions = (meta: ComponentMetadata) =>
	(
		(meta.usage as { commonPatterns?: { composition?: string }[] } | undefined)?.commonPatterns ??
		[]
	)
		.map((p) => p.composition ?? '')
		.filter(Boolean);

const attributeNames = (snippet: string) =>
	[...snippet.matchAll(/<gv-[a-z0-9-]+\b((?:"[^"]*"|'[^']*'|[^>"'])*)>/g)].flatMap(([, attrs]) =>
		[...attrs.matchAll(/([^\s=/"'>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?/g)].map(([, n]) => n)
	);

describe('metadata speaks in attribute names (#41 FR-17)', () => {
	it.each(metadata)('%s snippets use no camelCase attribute', (_, meta) => {
		const names = compositions(meta).flatMap(attributeNames);
		expect(names.filter((name) => !/^[a-z0-9-]+$/.test(name))).toEqual([]);
	});

	it.each(metadata)('%s keys its variants by attribute name', (_, meta) => {
		const keys = Object.keys((meta.variants as object | undefined) ?? {});
		expect(keys.filter((key) => !/^[a-z0-9-]+$/.test(key))).toEqual([]);
	});
});
