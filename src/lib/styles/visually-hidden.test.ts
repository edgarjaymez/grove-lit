import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { visuallyHidden } from './visually-hidden.js';

const declarations = (cssText: string) => {
	const body = /\.visually-hidden\s*\{([^}]*)\}/.exec(cssText.replace(/\/\*[\s\S]*?\*\//g, ''));
	if (!body) throw new Error('no .visually-hidden rule');
	return body[1]
		.split(';')
		.map((d) => d.trim().replace(/\s+/g, ' '))
		.filter(Boolean)
		.sort();
};

describe('visually-hidden', () => {
	const light = declarations(readFileSync(new URL('./a11y.css', import.meta.url), 'utf-8'));

	it('ships the same declarations to light DOM and to shadow roots', () => {
		expect(declarations(visuallyHidden.cssText)).toEqual(light);
	});

	it('never removes the content from the accessibility tree', () => {
		expect(light.join(';')).not.toMatch(/display:\s*none|visibility:\s*hidden/);
	});

	it('is imported by grove.css', () => {
		const grove = readFileSync(new URL('./grove.css', import.meta.url), 'utf-8');
		expect(grove).toContain("@import './a11y.css';");
	});
});
