import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GROVE_SURFACES, isAurora } from '../surfaces.js';

const sources = import.meta.glob<string>('../components/*/*.ts', {
	eager: true,
	query: '?raw',
	import: 'default'
});

describe('no component suppresses the focus indicator (#22 FR-04)', () => {
	it.each(
		Object.entries(sources).filter(
			([path]) => !/\.(stories|metadata|test|browser\.test)\.ts$/.test(path)
		)
	)('%s', (_, text) => {
		expect(text).not.toMatch(/outline(-style)?\s*:\s*(none|0)\b/);
	});
});

describe('surface classes (#22 OD3)', () => {
	const css = readFileSync(new URL('./surfaces.css', import.meta.url), 'utf-8');
	const rule = (surface: string) =>
		css.match(new RegExp(`\\.gv-surface-${surface} \\{([^}]*)\\}`))?.[1] ?? '';
	const tokens = readFileSync(new URL('../tokens/tokens.css', import.meta.url), 'utf-8');

	it.each(GROVE_SURFACES)('.gv-surface-%s paints the surface, its text and its ring', (surface) => {
		const body = rule(surface);
		expect(body).toContain(`var(--semantic-color-surface-${surface})`);
		expect(body).toContain(`var(--semantic-color-text-on-${surface}-base)`);
		for (const [, token] of body.matchAll(/var\((--[a-z0-9-]+)\)/g))
			expect(tokens, token).toContain(`${token}:`);
		if (isAurora(surface)) expect(body).not.toContain('--gv-focus-ring');
		else expect(body).toContain(`--gv-focus-ring: var(--ring-on-${surface});`);
	});

	it('declares no class for a surface outside GroveSurface', () => {
		const classes = [...css.matchAll(/\.gv-surface-([a-z-]+) \{/g)].map(([, name]) => name);
		expect(classes.sort()).toEqual([...GROVE_SURFACES].sort());
	});
});
