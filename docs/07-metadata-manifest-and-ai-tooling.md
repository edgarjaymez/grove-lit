# 07 · Metadata, manifest and AI tooling

> **What you need from this chapter**
>
> - What a `*.metadata.ts` file is for, and the parts of it that tests and the build check.
> - How the custom elements manifest is built, and how to fix each error `check-manifest` can raise.
> - Where the AI-facing files live, and which of them you can ignore day to day.

## Component metadata

Every component has a `*.metadata.ts` file next to it, exporting a `*Metadata` object. It is a
structured description written for tools, AI assistants included: what the component is for, when not
to use it, its slots, states, keyboard behaviour and example markup. It is exported from the package
(`ButtonMetadata`), so tools in a consuming project can read it too.

The shape is checked by TypeScript. Each file ends with `satisfies ComponentMetadata`, and the type in
`src/lib/components/metadata.ts` requires three sections; the rest are free-form:

```ts
export interface ComponentMetadata {
	component: {
		name: string;
		tag?: string;
		category: string;
		description: string;
		type: string;
		path: string;
		version: string;
		created: string;
		modified: string;
	};
	phosphor: PhosphorGlyphs;
	composition: {
		/** Every slot the component renders; null when it projects nothing. */
		slots: readonly GroveSlot[] | null;
		[key: string]: unknown;
	};
	[section: string]: unknown;
}
```

- **`component`**: identity, including its own `version` and `modified` date. Bump them when you
  change the component.
- **`phosphor`**: which icons the component can render. Grove draws icons with
  `@phosphor-icons/webcomponents`, and the **consuming app must register each glyph it uses** (for
  example `import '@phosphor-icons/webcomponents/PhTree'`). This field tells the app which ones: the
  attribute that picks a glyph (`prop`), the one shown when it is not set (`default`), and any that are
  always shown (`fixed`).
- **`composition.slots`**: every slot, with its fallback property. It must match the `@slot` tags
  (below).

Button's other sections (`usage`, `behavior`, `variants`, `accessibility`, `aiHints`) are free-form
but follow the same pattern across components; copy an existing file when you add one.

Example markup in metadata is written in **attribute names**, the way HTML would have it. The
`page-level-cta` pattern in `ButtonMetadata` has this `composition`:

```html
<gv-button text="Get Started" variant="filled" color="accent" size="lg"></gv-button>
```

### Metadata tests

`src/lib/components/metadata.test.ts` (unit project) checks that:

- there are metadata files for all 15 components;
- every glyph named in `phosphor` exists in the Phosphor package;
- the glyph imports in the `Home.mdx` recipe pair each component with exactly the `default` and
  `fixed` glyphs its `phosphor` field declares, and `src/test/browser-setup.ts` registers exactly
  that set;
- example snippets use attribute names (`is-selected`), never camelCase property names (`isSelected`).

`src/lib/components/glyphs.browser.test.ts` (browser project) renders every component with no glyph
attribute, and once per variant value, and requires the glyphs it draws to be exactly `default` plus
`fixed`. It also checks that `prop` is the attribute that changes the glyph. When you change a
component's default glyph, these two tests name every copy left to update.

## The custom elements manifest

A **custom elements manifest** (`custom-elements.json`) is a standard JSON description of a package's
elements: tags, attributes, properties, events, slots, CSS custom properties. Editors, Storybook and
framework tooling read it. Grove ships it at `dist/custom-elements.json` and points to it from
`package.json` (`"customElements"`).

### How it is built

`pnpm build-manifest` (the last step of `pnpm build`) runs four things in order:

```sh
cem analyze --config custom-elements-manifest.config.mjs
node scripts/generate-framework-types.mjs
node scripts/check-manifest.mjs
node scripts/check-dist.mjs
```

1. **The analyzer** (`@custom-elements-manifest/analyzer`) reads the component sources listed in
   `custom-elements-manifest.config.mjs`, with Lit support on, and writes `dist/custom-elements.json`.
   It learns attributes and properties from `@property`, and events, slots and CSS properties from the
   JSDoc tags.
   While it runs, a plugin from `scripts/manifest-types.mjs` fixes two gaps: it spells out type
   aliases (so `size` is typed `'lg' | 'md' | 'sm'`, not `ButtonSize`), and it drops `@state` fields,
   which are internal.
2. **`generate-framework-types.mjs`** writes `dist/types/astro.d.ts`, typed attributes for Astro
   projects (`@edgarjaymez/grove/astro` in `package.json` exports).
3. **`check-manifest.mjs`** compares the manifest with the sources and **fails the build** if they
   disagree.
4. **`check-dist.mjs`** fails the build when no `dist/*.js` reads `process.env.NODE_ENV`. The
   development warnings (`src/lib/utils/dev.ts`) stay on unless the consumer's bundler replaces that
   expression with `"production"`. If Grove's own build replaced it, the library would decide for
   every consumer. Never add `process.env.NODE_ENV` to the `define` in `vite.config.ts`.

### JSDoc tags the manifest reads

| Tag                            | Example                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `@slot`                        | `@slot - The button text. Falls back to \`text\` when empty.`                              |
| `@slot name`                   | `@slot heading - The strip heading. Falls back to \`heading\` when empty.` (FeedbackStrip) |
| `@fires {CustomEvent<T>} gv-*` | `@fires {CustomEvent<boolean>} gv-change - with the new \`checked\`.`                      |
| `@cssprop --gv-*`              | `@cssprop --gv-icon-fill-display - \`display\` of the fill weight; …`                      |

### When `check-manifest` fails

It prints `[grove] manifest drift:` and a list. Each kind of problem and its fix:

| Message says                                                    | Fix                                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `<gv-*> is missing from the manifest`                           | the file is not matched by the analyzer's globs, or `@customElement` is malformed |
| `attribute "…" is missing from <gv-*>`                          | the `attribute: '…'` mapping is not picked up; check the `@property` options      |
| `dispatches "gv-*" without a typed @fires tag`                  | add `@fires {CustomEvent<T>} gv-* - description` to the class JSDoc               |
| `snippet sets "…" on <gv-*>, which declares no such attribute`  | a metadata example uses a property name or a typo; use the real attribute name    |
| `composition.slots [...] differ from <gv-*>'s @slot tags [...]` | make the metadata's slot list and the class's `@slot` tags name the same slots    |
| `… is typed SomeAlias, not its union`                           | the alias could not be expanded; check the type is a plain union of literals      |
| `@state field "…" is in <gv-*>'s manifest entry`                | the field is not a proper `@state()` private field                                |

**`pnpm check` does not run any of this.** TypeScript is happy with a missing `@fires` tag. That is why
`pnpm build`, not `pnpm check`, is the test that a component change is done.

### Manifest tests

`scripts/manifest-types.test.mjs` (unit project) tests the alias expansion against
`scripts/fixtures/aliased-union.ts`.

## The AI layer

This repo is often worked on together with AI coding assistants, and several files exist for them.
You do not need any of them to build, test or release.

- **Component metadata and the manifest** (above) are what assistants, and other tools, read to
  understand a component. Keeping them accurate is part of every component change.
- **`CLAUDE.md` and `AGENTS.md`** at the root are instructions for assistants: conventions, commands
  and checklists. They are gitignored, so a fresh clone does not have them. When present, they cover
  the same rules as this guide.
- **The `.claude/` folder** (gitignored) holds the assistants' skills and plans: step-by-step
  procedures for tasks like creating a component from a Figma design or writing its stories. Some
  components are specified in Figma with Dev Mode annotations that those procedures read.
- **`src/.ai/`** is a generated, committed index of components, their relationships and token use,
  in the compact TOON format. Tools read it instead of crawling the source. It is regenerated by
  maintainer tooling outside this repo; never edit it by hand.

If a rule in an agent file and this guide disagree, check the code. The code wins.

## Where to see it in Button.ts

- The JSDoc `@slot -` tag and `ButtonMetadata.composition.slots` both declare one default slot with
  fallback `text`; `check-manifest` compares them.
- `ButtonMetadata.phosphor` has `prop: 'icon'`, no default and no fixed glyphs: Button only shows a
  glyph when the `icon` attribute names one, and the page must register that glyph.
- The manifest types `variant` as `'filled' | 'tonal' | 'outlined' | 'ghost'` because the plugin
  expands `ButtonVariant`.
- Button dispatches no custom event, so it needs no `@fires` tag.
