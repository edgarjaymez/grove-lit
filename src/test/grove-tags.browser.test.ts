import { expect, it } from 'vitest';
import { groveTags } from './grove-tags.js';

/** One metadata file per component directory, so this counts components without naming them. */
const componentDirs = Object.keys(import.meta.glob('../lib/components/*/*.metadata.ts'));

it('registers a tag for every component directory', () => {
	expect(componentDirs.length).toBeGreaterThan(0);
	expect(groveTags).toHaveLength(componentDirs.length);
});
