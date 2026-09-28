import { existsSync } from 'node:fs';
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
