import { describe, expect, it } from 'vitest';
import { linkAttribute } from './link-attributes.js';

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
