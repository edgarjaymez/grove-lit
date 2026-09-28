// Fails the build when dist/custom-elements.json and the sources disagree:
// - a @customElement tag missing from the manifest;
// - an `attribute: '…'` mapping missing from that element's attributes;
// - a dispatched CustomEvent without a typed @fires tag (CustomEvent<…>);
// - a metadata composition snippet using an attribute the manifest does not declare for that tag;
// - metadata composition.slots that differ from the element's @slot tags.
import { globSync, readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('dist/custom-elements.json', 'utf-8'));
const declarations = new Map(
	manifest.modules.flatMap((mod) =>
		(mod.declarations ?? []).filter((d) => d.tagName).map((d) => [d.tagName, d])
	)
);

const GLOBAL =
	/^(class|id|style|slot|hidden|lang|dir|title|role|tabindex|part|inert|aria-[a-z-]+|data-[a-z0-9-]+)$/;
const problems = [];

/** The tag a metadata file describes, from the component module next to it. */
const tagOf = (file) =>
	readFileSync(file.replace('.metadata.ts', '.ts'), 'utf-8').match(
		/@customElement\('([a-z0-9-]+)'\)/
	)?.[1];

const sources = globSync('src/lib/components/*/*.ts').filter(
	(f) => !/\.(stories|metadata|test|browser\.test)\.ts$/.test(f)
);

for (const file of sources) {
	const text = readFileSync(file, 'utf-8');
	const tag = text.match(/@customElement\('([a-z0-9-]+)'\)/)?.[1];
	if (!tag) continue;
	const declaration = declarations.get(tag);
	if (!declaration) {
		problems.push(`${file}: <${tag}> is missing from the manifest`);
		continue;
	}
	const attributes = new Set((declaration.attributes ?? []).map((a) => a.name));
	for (const [, attribute] of text.matchAll(/attribute:\s*'([a-z0-9-]+)'/g))
		if (!attributes.has(attribute))
			problems.push(`${file}: attribute "${attribute}" is missing from <${tag}> in the manifest`);
	const events = new Map((declaration.events ?? []).map((e) => [e.name, e.type?.text ?? '']));
	for (const [, event] of text.matchAll(/new CustomEvent(?:<[^>]*>)?\(\s*'([a-z0-9-]+)'/g))
		if (!/^CustomEvent<.+>$/.test(events.get(event) ?? ''))
			problems.push(
				`${file}: <${tag}> dispatches "${event}" without a typed @fires tag (@fires {CustomEvent<…>} ${event})`
			);
}

for (const file of globSync('src/lib/components/*/*.metadata.ts')) {
	const text = readFileSync(file, 'utf-8');
	const tag = text.match(/tag: '(gv-[a-z0-9-]+)'/)?.[1] ?? tagOf(file);
	const slotsBlock = text.match(/slots: (null|\[[\s\S]*?\n\t\t\])/)?.[1];
	const declared =
		slotsBlock && slotsBlock !== 'null'
			? [...slotsBlock.matchAll(/name: '([a-z0-9-]*)'/g)].map(([, n]) => n).sort()
			: [];
	const manifestSlots = (declarations.get(tag)?.slots ?? []).map((slot) => slot.name).sort();
	if (JSON.stringify(declared) !== JSON.stringify(manifestSlots))
		problems.push(
			`${file}: composition.slots [${declared.map((n) => `"${n}"`)}] differ from <${tag}>'s @slot tags [${manifestSlots.map((n) => `"${n}"`)}]`
		);
	for (const [, tag, attrs] of text.matchAll(/<(gv-[a-z0-9-]+)\b((?:"[^"]*"|'[^']*'|[^>"'])*)>/g)) {
		const declaration = declarations.get(tag);
		if (!declaration) {
			problems.push(`${file}: snippet uses unknown element <${tag}>`);
			continue;
		}
		const known = new Set((declaration.attributes ?? []).map((a) => a.name));
		for (const [, name] of attrs.matchAll(
			/([^\s=/"'>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?/g
		))
			if (!known.has(name) && !GLOBAL.test(name))
				problems.push(
					`${file}: snippet sets "${name}" on <${tag}>, which declares no such attribute`
				);
	}
}

if (problems.length) {
	console.error(`[grove] manifest drift:\n  ${problems.join('\n  ')}`);
	process.exit(1);
}
console.log(`[grove] manifest matches the sources (${declarations.size} elements)`);
