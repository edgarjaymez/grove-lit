import { describe, expect, it } from 'vitest';
import { linkAttribute, linkRel } from './link-attributes.js';

describe('linkAttribute (#43 FR-02 to FR-04)', () => {
	it.each([
		['/es/', 'es', 'es'],
		[undefined, 'es', undefined],
		['', 'es', undefined],
		['/es/', '', undefined],
		['/es/', undefined, undefined]
	])('href %j, value %j → %j', (href, value, expected) =>
		expect(linkAttribute(href, value)).toBe(expected)
	);
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
