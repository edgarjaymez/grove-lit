import { describe, expect, it } from 'vitest';
import { linkAttribute, linkRel } from './link-attributes.js';

describe('linkAttribute', () => {
	it('keeps a value only on a real link', () => {
		expect(linkAttribute('/es/', 'es')).toBe('es');
		expect(linkAttribute(undefined, 'es')).toBeUndefined();
		expect(linkAttribute('', 'es')).toBeUndefined();
		expect(linkAttribute('/es/', '')).toBeUndefined();
	});
});

describe('linkRel (#14 FR-04, FR-05)', () => {
	it('adds noopener noreferrer to target="_blank" without rel', () => {
		expect(linkRel('https://example.com', '_blank', undefined)).toBe('noopener noreferrer');
		expect(linkRel('https://example.com', '_blank', '')).toBe('noopener noreferrer');
	});

	it('passes an explicit rel through untouched', () => {
		expect(linkRel('https://example.com', '_blank', 'external')).toBe('external');
		expect(linkRel('https://example.com', undefined, 'author')).toBe('author');
	});

	it('adds nothing for other targets, or without an href', () => {
		expect(linkRel('https://example.com', '_self', undefined)).toBeUndefined();
		expect(linkRel('https://example.com', undefined, undefined)).toBeUndefined();
		expect(linkRel(undefined, '_blank', 'external')).toBeUndefined();
		expect(linkRel('', '_blank', undefined)).toBeUndefined();
	});
});
