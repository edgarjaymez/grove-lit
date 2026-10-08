import type { ComponentMetadata } from '../lib/components/metadata.js';

const metadataFiles = import.meta.glob<Record<string, ComponentMetadata>>(
	'../lib/components/*/*.metadata.ts',
	{ eager: true }
);
const componentSources = import.meta.glob<string>(
	['../lib/components/*/*.ts', '!**/*.{metadata,stories,test}.ts'],
	{ eager: true, query: '?raw', import: 'default' }
);

/** The tag a metadata file describes, from the `@customElement` decorator in the module next to it. */
const tagOf = (path: string) => {
	const source = componentSources[path.replace(/\.metadata\.ts$/, '.ts')];
	const tag = source?.match(/@customElement\('([a-z0-9-]+)'\)/)?.[1];
	if (!tag)
		throw new Error(`${path}: the component module next to it declares no @customElement tag`);
	return tag;
};

/**
 * Every component's metadata, keyed by the tag it describes. It reads the component sources, not the
 * custom element registry, so unit tests (Node) and browser tests share it.
 */
export const metadataByTag = new Map<string, ComponentMetadata>();
for (const [path, module] of Object.entries(metadataFiles))
	for (const meta of Object.values(module)) {
		const tag = tagOf(path);
		if (metadataByTag.has(tag)) throw new Error(`${path}: <${tag}> already has a metadata file`);
		metadataByTag.set(tag, meta);
	}
