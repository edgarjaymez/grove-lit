import * as grove from '../lib/index.js';

/** Every custom element the public entry registers, read from the registry so new components are covered. */
export const groveTags = Object.values(grove)
	.map((value) =>
		typeof value === 'function' ? customElements.getName(value as CustomElementConstructor) : null
	)
	.filter((tag): tag is string => !!tag)
	.sort();
