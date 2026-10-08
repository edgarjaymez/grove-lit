# 01 · Repo map

> **What you need from this chapter**
>
> - Which folders become the npm package and which are tooling around it.
> - Which files are written by hand, which are generated, and which are not in git at all.
> - The files every component directory has, and the two export lists a new component joins.

## The tree

`(gitignored)` means the path exists on a working machine but is not in the repo. `GENERATED` means
a tool writes the file; edit its source instead.

```
grove-lit/
├── package.json · pnpm-lock.yaml · pnpm-workspace.yaml · .npmrc · .node-version
├── tsconfig.json · vite.config.ts · eslint.config.js · .prettierrc · .prettierignore
├── terrazzo.config.js · custom-elements-manifest.config.mjs · vercel.json
├── components-since.json                 release ledger: component → first version
├── README                                an essay on systems thinking, not setup docs
├── LICENSE · DESIGN_SYSTEM.md            licence; the design language in prose
├── CLAUDE.md · AGENTS.md                 (gitignored) notes for AI assistants
├── docs/                                 this guide
├── .storybook/                           main.ts · preview.ts · vitest.setup.ts · globals.d.ts · tsconfig.json
├── .github/ISSUE_TEMPLATE/               an issue template; there are no workflows
├── scripts/                              build, release and test helpers (Node, .mjs)
│   ├── check-manifest.mjs                fails the build when manifest and sources disagree
│   ├── manifest-types.mjs (+ .test.mjs)  spells out type aliases in the manifest
│   ├── generate-framework-types.mjs      writes dist/types/astro.d.ts
│   ├── record-release.mjs · check-ledger.mjs · components-since.mjs (+ .test.mjs)
│   ├── a11y-canary.mjs · storybook-static-smoke.mjs
│   └── fixtures/
├── src/
│   ├── lib/                              THE PUBLISHED PACKAGE
│   │   ├── index.ts                      package entry: every public export, listed by name
│   │   ├── events.ts                     GroveEventMap: the type of every gv-* event
│   │   ├── surfaces.ts                   GroveSurface, GroveTrack, GROVE_SURFACES, isAurora
│   │   ├── events.browser.test.ts · slots.browser.test.ts
│   │   ├── components/                   15 component directories + index.ts, metadata.ts, metadata.test.ts
│   │   ├── styles/                       *.css for the page · *.ts Lit style fragments · their tests
│   │   ├── tokens/                       token JSON (border/ effects/ palette/ spacing/ text/),
│   │   │                                 main.resolver.json, tokens.css GENERATED, contrast.test.ts
│   │   ├── fonts/                        display/ (Cakra) · sans-serif/ (Inclusive Sans) · fonts.css
│   │   ├── utils/                        form-control.ts · slot-content.ts · dev.ts · link-attributes.ts
│   │   └── __screenshots__/              (gitignored) browser-test failure screenshots
│   ├── stories/                          repo-level Storybook pages: Home.mdx, Accessibility.mdx,
│   │                                     FocusRing.stories.ts, A11yCanary.stories.ts
│   ├── test/                             browser-setup.ts · commands.d.ts · events.types.ts ·
│   │                                     grove-tags.ts · themes.ts
│   └── .ai/                              GENERATED machine-readable index of components and tokens
├── static/                               Storybook favicons and webmanifest
├── dist/                                 (gitignored) build output: what npm receives
└── storybook-static/                     (gitignored) static Storybook: what Vercel deploys
```

## The package and the tooling around it

Only `dist/` is published. `package.json` says so with `"files": ["dist", …]`, and `dist/` is built
from `src/lib/` alone. Everything else (`scripts/`, `.storybook/`, `src/stories/`, `src/test/`) exists
to build, check and document `src/lib/`.

A good habit: before you edit a file, ask "does this end up in `dist/`?". If yes, a consumer will see
the change; if no, only maintainers will.

## One directory per component

Each component lives in `src/lib/components/<PascalName>/`:

| File                     | Required | What it is                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------ |
| `Button.ts`              | yes      | the Lit class and its `@customElement('gv-button')` registration   |
| `Button.metadata.ts`     | yes      | `ButtonMetadata`: usage, slots, states, accessibility (chapter 07) |
| `Button.stories.ts`      | yes      | the Storybook stories (chapter 08)                                 |
| `Button.browser.test.ts` | no       | tests that need a real browser (chapter 08)                        |

There is no per-component `index.ts`. Do not add one.

Directory names are PascalCase (`ToDoListItem`), class names match, and tags are kebab-case with the
`gv-` prefix (`gv-todo-list-item`).

## The two export lists

A new component is added to **both** of these files:

1. **`src/lib/components/index.ts`** is a list of `export * from './Button/Button.js';` lines, in
   alphabetical order. It is a convenience barrel. Nothing in the build or the tests imports it today,
   but the convention is to keep it complete.
2. **`src/lib/index.ts`** is the **package entry**. Vite builds `dist/index.js` from it, so a
   component missing here is missing from the package. It lists exports by name: each class, its
   `*Metadata`, its public types, plus the style fragments, surfaces and event types:

   ```ts
   export { Button } from './components/Button/Button.js';
   export { ButtonMetadata } from './components/Button/Button.metadata.js';
   ```

   The test helper `src/test/grove-tags.ts` builds the list of tags to test by reading these exports,
   so a component missing from `src/lib/index.ts` is also invisible to the test suite:

   ```ts
   import * as grove from '../lib/index.js';

   /** Every custom element the public entry registers, read from the registry so new components are covered. */
   export const groveTags = Object.values(grove)
   	.map((value) =>
   		typeof value === 'function'
   			? customElements.getName(value as CustomElementConstructor)
   			: null
   	)
   	.filter((tag): tag is string => !!tag)
   	.sort();
   ```

## Generated, but committed

Two generated outputs live in git, because other tools read them without running a build:

- **`src/lib/tokens/tokens.css`**, written by `pnpm build-tokens` from the token JSON (chapter 06).
  Never edit it by hand.
- **`src/.ai/`**, a machine-readable index of components, relationships and token use, in the TOON
  format. It is regenerated by maintainer tooling that lives outside this repo. Never edit it by
  hand; if it looks stale, ask the maintainer to regenerate it.

`dist/` and `storybook-static/` are generated too, but they are gitignored.

## Files that are not in git

`.gitignore` excludes `CLAUDE.md`, `AGENTS.md`, `MEMORY.md` and the whole `.claude/` folder. They hold
instructions and skills for AI coding assistants (chapter 07). A fresh clone does not have them, and
nothing in the build depends on them.

## The release ledger

`components-since.json` maps each component directory to the version it first shipped in:

```json
{
	"components": {
		"BackButton": "0.41.0",
		"Button": "0.28.0",
```

The build copies it to `dist/components-since.json`, so an installed package can tell which
components are new since a given version, with no network. Chapter 09 covers how it is updated at
release time.

## Where to see it in Button.ts

- `src/lib/components/Button/` holds `Button.ts`, `Button.metadata.ts`, `Button.stories.ts` and
  `Button.browser.test.ts`.
- `Button.ts` extends the form base in `src/lib/utils/form-control.ts`, the one module there that the
  manifest analyzer also reads.
- `gv-button` reaches the package through two lines in `src/lib/index.ts` (`Button` and
  `ButtonMetadata`) and one in `src/lib/components/index.ts`.
- `components-since.json` records that `Button` first shipped in `0.28.0`.
