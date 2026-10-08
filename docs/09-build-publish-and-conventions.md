# 09 · Build, publish and conventions

> **What you need from this chapter**
>
> - What `pnpm build` does, step by step, and what ends up in `dist/` and on npm.
> - How a release goes out today: by hand, with the release ledger.
> - The house rules a reviewer will check, in one list.

## `pnpm build`

```json
"build": "pnpm build-tokens && vite build && node scripts/check-dist.mjs && pnpm build-manifest",
```

1. **`pnpm build-tokens`** runs Terrazzo: token JSON → `src/lib/tokens/tokens.css` (chapter 06).
2. **`vite build`** bundles the library in Vite's library mode (`vite.config.ts`):
   - the entry is `src/lib/index.ts`, the output is ES modules only (`formats: ['es']`);
   - **`lit` stays external** (`external: ['lit', /^lit\//]`): the bundle imports Lit instead of
     including it. Lit's publishing guide warns that bundling Lit into a library can put several
     copies of Lit on one page (<https://lit.dev/docs/tools/publishing/>);
   - `unplugin-dts` writes the `.d.ts` type files, rooted at `src/lib`;
   - a small `copy-static-assets` plugin copies `tokens.css`, `fonts/`, every
     `src/lib/styles/*.css` and `components-since.json` into `dist/`.
3. **`node scripts/check-dist.mjs`** fails the build when the bundle no longer reads
   `process.env.NODE_ENV`, so the consumer's bundler still decides on the development warnings
   (chapter 07).
4. **`pnpm build-manifest`** writes the manifest and Astro types and runs the manifest check
   (chapter 07). A component that breaks the manifest rules fails the build here.

### What `dist/` holds

| Path                           | From                                 |
| ------------------------------ | ------------------------------------ |
| `index.js` (+ source map)      | the bundled components and helpers   |
| `index.d.ts` and other `.d.ts` | types, one per source file           |
| `tokens/tokens.css`            | the generated tokens                 |
| `fonts/`                       | font files and `fonts.css`           |
| `styles/*.css`                 | `grove.css` and the files it imports |
| `components-since.json`        | the release ledger                   |
| `custom-elements.json`         | the manifest                         |
| `types/astro.d.ts`             | Astro attribute types                |

### The `package.json` fields that matter

- **`exports`** is the public surface. Only these paths can be imported:
  `@edgarjaymez/grove`, `/grove.css`, `/tokens.css`, `/fonts.css`, `/fonts/*`,
  `/custom-elements.json`, `/astro` (types only), `/package.json`. A new public file needs an entry.
- **`files: ["dist", …]`** limits what npm receives to the build output (test files excluded).
- **`sideEffects`** lists CSS and JS as having side effects, so a consumer's bundler never drops a
  module whose only job is to register a tag.
- **`peerDependencies`**: `lit ^3` (required) and `@phosphor-icons/webcomponents` (optional, needed
  only for icons).
- **`engines`**: Node 20 or newer.

### `pnpm prepack`

`pnpm prepack` runs `pnpm check-ledger && pnpm build && publint`:

- **`check-ledger`** fails if a component has no entry in the release ledger (below), so a release
  cannot ship a component it has not recorded;
- **`build`** is the full build above;
- **publint** checks that `exports`, `types` and `files` point at files that exist and are shaped
  correctly.

npm runs `prepack` automatically before it packs or publishes, so any of these failing stops a
publish.

## Releasing by hand

There is no CI: no GitHub Actions run on a pull request or a push, and nothing publishes
automatically. Pull requests are merged on GitHub with a merge commit. A release goes out like this:

**On a branch, as part of the pull request:**

1. Check what npm has: `pnpm view @edgarjaymez/grove version`. The version in `package.json` may
   already be ahead of npm (bumped but not yet published); in that case publish that version rather
   than bumping again.
2. Record the release in the ledger: `pnpm record-release <version>`. It adds an entry for every
   component directory that has none, and never changes an existing one, so running it twice is
   safe.
3. Set `"version"` in `package.json` by editing it, if it needs to change.
4. Verify: `pnpm check`, `pnpm lint`, `pnpm prepack` (which runs `check-ledger` first).
5. Commit the ledger and the version, push, open the pull request, and merge it.

**On `main`, after the merge:**

6. Pull `main`, run `pnpm publish`. You need to be logged in to npm with publish rights.

### The release ledger

`components-since.json` answers "which components are new since version N?" for anyone holding the
package, offline. Two scripts manage it (shared logic in `scripts/components-since.mjs`):

- **`pnpm record-release <version>`** adds missing entries. When releases went out without being
  recorded, it uses the old `v*` git tags to stamp each component with the release it really first
  shipped in, not the version being recorded.
- **`pnpm check-ledger`** fails when a component directory has no entry, or an entry has no
  directory.

`check-ledger` **is expected to fail between releases** whenever a new component exists: the new
component has no entry until the next release records it. That failure is the reminder. Because
`prepack` runs it first, `pnpm prepack` fails the same way until the release step records the
component; use `pnpm build` to check your work in between.

## House rules

A reviewer will check these. Most are enforced by a tool; the tool is named where there is one.

**Formatting and lint**

- Prettier: tabs, single quotes, no trailing commas, 100 characters per line (`.prettierrc`).
- `pnpm lint` runs `prettier --check .` and `eslint .` over the **whole repo**, so it can fail on files
  you never touched. Do not fix that with `prettier --write .`; it reformats unrelated files and
  bloats your diff. Format and lint only the files you changed:
  `pnpm exec prettier --write <paths>` and `pnpm exec eslint <paths>`.
- ESLint includes `eslint-plugin-lit` (template mistakes) and `eslint-plugin-lit-a11y` (accessibility
  in templates).

**Components**

- PascalCase directory and class; tag `gv-kebab-case`; no per-component `index.ts`.
- Added to both export lists (chapter 01).
- `static styles` is an array, `componentReset` first, `focusRing` second in interactive components.
- Block-level components start their CSS with `:host { display: block; }`.
- Flat selectors, no CSS nesting.
- Tokens for every value. Typography through the `font` shorthand plus its letter-spacing token.
- Shadows through `--_drop`; never `outline: none` (`focus.test.ts`).
- Private custom properties `--_*`; public ones `--gv-*` with a `@cssprop` tag.
- Multi-word properties name their attribute in kebab-case (`attribute: 'is-selected'`).
- `disabled` and toggled states use `reflect: true`.
- ARIA properties are `string | null = null`; optional strings use `ifDefined()`.
- Never a property called `title`; use `heading` and `message`.
- Imports end in `.js`; child components are imported for their side effect.
- Every file ends with the `HTMLElementTagNameMap` entry.
- JSDoc `@slot`, `@fires {CustomEvent<T>}` and `@cssprop` match the code (`pnpm build`).

**Checks before you call a change done**

- `pnpm check` (TypeScript, including the event type fixtures);
- `pnpm build` (the manifest check), and revert `tokens.css` churn afterwards (chapter 06);
- the tests that cover what you touched (chapter 08);
- Prettier and ESLint on your changed files.

## Where to see it in Button.ts

- `import { LitElement, html, css, nothing } from 'lit';` stays an import in `dist/index.js`, because
  Lit is external.
- `Button` and `ButtonMetadata` reach consumers only because `src/lib/index.ts` exports them.
- The file follows every component rule above; it is a good template to copy from.
