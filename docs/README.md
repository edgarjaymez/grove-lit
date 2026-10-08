# Grove maintainer's guide

This guide is for a developer who knows TypeScript, the DOM and a component framework such as React
or Vue, but has not worked with Lit or web components before. After reading it you should be able to
pick up a ticket in this repo, change a component, and know which checks prove the change is done.

## What Grove is

Grove is a design system published to npm as **`@edgarjaymez/grove`** (version `0.45.0` in
`package.json`). It ships:

- **15 custom elements**, all named `gv-*` (`gv-button`, `gv-checkbox`, `gv-tooltip`…). They are
  written with [Lit](https://lit.dev), a small library for building web components.
- **Design tokens**: colours, spacing, type and shadows as CSS custom properties, in `tokens.css`.
- **Global CSS**: fonts, typography classes, surface classes and shadow classes, bundled as
  `grove.css`.
- **A custom elements manifest** (`custom-elements.json`) and Astro typings, so editors and other
  tools know each element's attributes, events and slots.

The package is ES modules only. `lit` is a **peer dependency**: the app that installs Grove also
installs Lit, and Grove's build leaves Lit out so there is only one copy on the page.

Vercel publishes a static Storybook of every component (`vercel.json`). The `homepage` field in
`package.json` names `grove.edgarjaymez.com`, but that address did not resolve on 2026-10-07; ask the
maintainer for the current Storybook link, or run it locally with `pnpm storybook`.

## How to read this guide

Chapters 01–06 build on each other; read them in order. Chapters 07–11 are reference material you can
dip into when a task needs them. One component, `gv-button`
(`src/lib/components/Button/Button.ts`), is used as the example all the way through, and every
chapter ends with "Where to see it in Button.ts".

| #   | Chapter                                                                     | Read it to learn                                                   |
| --- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 01  | [Repo map](01-repo-map.md)                                                  | where everything lives, what is generated, what is published       |
| 02  | [Web components and Lit](02-web-components-and-lit.md)                      | the platform features and the Lit features this repo relies on     |
| 03  | [Anatomy of a component](03-anatomy-of-a-component.md)                      | `Button.ts` read top to bottom                                     |
| 04  | [Styling, surfaces and focus](04-styling-surfaces-and-focus.md)             | how CSS works inside a component, and the focus ring               |
| 05  | [Slots and events](05-slots-and-events.md)                                  | how content goes in and how events come out                        |
| 06  | [Tokens and theming](06-tokens-and-theming.md)                              | how `tokens.css` is built and how light, dark and print work       |
| 07  | [Metadata, manifest and AI tooling](07-metadata-manifest-and-ai-tooling.md) | the `*.metadata.ts` files and the manifest check that fails builds |
| 08  | [Storybook and tests](08-storybook-and-tests.md)                            | the four test projects and how stories are written                 |
| 09  | [Build, publish and conventions](09-build-publish-and-conventions.md)       | what `pnpm build` produces, how a release goes out, house rules    |
| 10  | [Cookbook](10-cookbook.md)                                                  | step-by-step recipes for common tasks                              |
| 11  | [Known drift](11-known-drift.md)                                            | where docs and code tend to disagree, and who wins                 |
| —   | [Glossary](glossary.md)                                                     | every term in plain words, plus the Lit docs pages used            |

## When two sources disagree

Trust them in this order:

1. **The code on `main`.** Components, scripts and tests are what actually runs.
2. **`src/lib/tokens/tokens.css`.** It is generated from the token JSON files and owns every token
   name and value.
3. **`DESIGN_SYSTEM.md`.** The design language in prose: intent, composition rules, examples. It can
   lag behind the tokens.
4. **Agent-facing notes** (`CLAUDE.md`, `AGENTS.md`). They are gitignored and written for AI
   assistants, so you may not have them.

This guide follows the same rule: it quotes code from the repo rather than paraphrasing it, so when
the code changes, the code wins.

## Day one

```sh
pnpm install                 # Node 20 or newer (see .node-version); pnpm is required
pnpm exec playwright install chromium   # once, for the browser tests
pnpm storybook               # http://localhost:6006
pnpm check                   # TypeScript
pnpm test                    # every test project, one run
pnpm build                   # tokens → bundle → manifest check
```

If those pass, you have a working setup. Chapter 10 has recipes for the common tasks.
