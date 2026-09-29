import { describe, expect, it } from 'vitest';
import { createProgram, expandManifest } from './manifest-types.mjs';

const PATH = 'scripts/fixtures/aliased-union.ts';

/** What the analyzer writes for the fixture: alias names as given, and the @state field kept. */
const analyzed = () => ({
	schemaVersion: '1.0.0',
	modules: [
		{
			kind: 'javascript-module',
			path: PATH,
			declarations: [
				{
					kind: 'class',
					name: 'Fixture',
					tagName: 'gv-fixture',
					customElement: true,
					members: [
						{ kind: 'field', name: 'size', type: { text: 'FixtureSize' } },
						{ kind: 'field', name: 'tone', type: { text: "'auto' | FixtureTone" } },
						{ kind: 'field', name: 'isOpen', type: { text: 'boolean' } },
						{ kind: 'field', name: 'label', type: { text: 'string | undefined' } },
						{ kind: 'field', name: 'busy', privacy: 'private', type: { text: 'boolean' } }
					],
					attributes: [
						{ name: 'size', fieldName: 'size', type: { text: 'FixtureSize' } },
						{ name: 'tone', fieldName: 'tone', type: { text: "'auto' | FixtureTone" } },
						{ name: 'is-open', fieldName: 'isOpen', type: { text: 'boolean' } },
						{ name: 'label', fieldName: 'label', type: { text: 'string | undefined' } }
					]
				}
			]
		}
	]
});

describe('expandManifest (#41 FR-01, FR-02)', () => {
	const manifest = expandManifest(analyzed(), createProgram([PATH]));
	const [declaration] = manifest.modules[0].declarations;
	const types = (list) => Object.fromEntries(list.map((entry) => [entry.name, entry.type.text]));

	it('spells out aliased unions, nested ones included, on fields and attributes', () => {
		const expected = {
			size: "'sm' | 'md'",
			tone: expect.toSatisfy((text) =>
				['auto', 'light', 'dark'].every((value) => text.split(' | ').includes(`'${value}'`))
			),
			label: 'string | undefined'
		};
		expect(types(declaration.members)).toMatchObject({ ...expected, isOpen: 'boolean' });
		expect(types(declaration.attributes)).toMatchObject({ ...expected, 'is-open': 'boolean' });
		expect(JSON.stringify(manifest)).not.toMatch(/Fixture(Size|Tone)/);
	});

	it('drops @state fields', () => {
		expect(declaration.members.map((member) => member.name)).not.toContain('busy');
	});
});
