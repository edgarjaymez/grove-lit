// Completes dist/custom-elements.json with what the analyzer leaves out (#41 FR-01, FR-02). The analyzer
// reads one file at a time, so a prop typed `ButtonSize` is written as that bare name; the TypeScript
// checker expands it to its union here. It also keeps @state fields, which are internal; they go.
import ts from 'typescript';

const FORMAT =
	ts.TypeFormatFlags.InTypeAlias |
	ts.TypeFormatFlags.NoTruncation |
	ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;

/** A program over the given module paths, compiled the way the library is. */
export const createProgram = (paths) =>
	ts.createProgram(paths, {
		strict: true,
		target: ts.ScriptTarget.ES2022,
		experimentalDecorators: true
	});

const isStateField = (node) =>
	(ts.getDecorators(node) ?? []).some(
		(d) =>
			ts.isCallExpression(d.expression) &&
			ts.isIdentifier(d.expression.expression) &&
			d.expression.expression.text === 'state'
	);

/**
 * A type's text with every alias spelled out, nested ones too: typeToString keeps a union's own
 * alias names (`'auto' | IsotypeFill`), so each member is printed on its own. `true | false` reads
 * as boolean, and null and undefined go last, as TypeScript prints them.
 */
const typeText = (checker, type, node) => {
	if (!type.isUnion()) return checker.typeToString(type, node, FORMAT);
	const parts = new Set();
	const empty = [];
	for (const member of type.types) {
		if (member.flags & ts.TypeFlags.BooleanLiteral) parts.add('boolean');
		else if (member.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined))
			empty.push(checker.typeToString(member));
		else parts.add(checker.typeToString(member, node, FORMAT));
	}
	return [...parts, ...empty].join(' | ');
};

/** The class's own property declarations, by name. */
const fieldsOf = (source, name) => {
	const node = source?.statements.find((s) => ts.isClassDeclaration(s) && s.name?.text === name);
	if (!node) throw new Error(`${name} not found in ${source?.fileName}`);
	return new Map(
		node.members
			.filter((m) => ts.isPropertyDeclaration(m) && m.name && ts.isIdentifier(m.name))
			.map((m) => [m.name.text, m])
	);
};

/**
 * Rewrites the manifest in place: drops @state fields and expands every public field's type, and the
 * attribute reflecting it, to the checker's text (`'sm' | 'md' | 'lg'` instead of `MenuItemSize`).
 */
export const expandManifest = (manifest, program) => {
	const checker = program.getTypeChecker();
	for (const mod of manifest.modules) {
		const source = program.getSourceFile(mod.path);
		for (const declaration of mod.declarations ?? []) {
			if (!declaration.customElement) continue;
			const fields = fieldsOf(source, declaration.name);
			const expanded = new Map();
			declaration.members = (declaration.members ?? []).filter((member) => {
				const node = member.kind === 'field' && fields.get(member.name);
				if (!node) return true;
				if (isStateField(node)) return false;
				if (member.privacy === 'private' || member.privacy === 'protected') return true;
				const text = typeText(checker, checker.getTypeAtLocation(node), node);
				member.type = { ...member.type, text };
				expanded.set(member.name, text);
				return true;
			});
			for (const attribute of declaration.attributes ?? []) {
				const text = expanded.get(attribute.fieldName);
				if (text) attribute.type = { ...attribute.type, text };
			}
		}
	}
	return manifest;
};

/** The analyzer plugin: runs once every module is analyzed, before the manifest is written. */
export const expandTypesPlugin = () => ({
	name: 'grove-expand-types',
	packageLinkPhase({ customElementsManifest }) {
		expandManifest(
			customElementsManifest,
			createProgram(customElementsManifest.modules.map((mod) => mod.path))
		);
	}
});
