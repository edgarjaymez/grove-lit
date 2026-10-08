# 10 · Cookbook

> **What you need from this chapter**
>
> - Step-by-step recipes for the tasks you will meet in your first sprint.
> - For each step, what breaks if you skip it, so you know which steps are optional (none, mostly).
> - Pointers back to the chapter that explains the why.

## 1 · Set up and run

1. Install Node 20 or newer, and pnpm.
2. `pnpm install`
3. `pnpm exec playwright install chromium`
4. `pnpm storybook` and open <http://localhost:6006>.

| Skip   | What fails                                                         |
| ------ | ------------------------------------------------------------------ |
| step 3 | the `browser` and `storybook` test projects cannot start a browser |

## 2 · Add a component

Say the new component is `gv-badge`.

1. Create `src/lib/components/Badge/Badge.ts`. Copy the shape of `Button.ts` (chapter 03):
   `@customElement('gv-badge')`, `export class Badge extends LitElement`,
   `static styles = [componentReset, …]`, and the `HTMLElementTagNameMap` entry at the end.
2. If it is interactive, add `focusRing` after `componentReset` and `gv-focusable` on the focusable
   element (chapter 04).
3. If it shows text, add a slot with a property fallback through `SlotContent`, and a `@slot` JSDoc
   tag (chapter 05).
4. If it dispatches events, follow recipe 4.
5. Create `Badge.metadata.ts` with a `BadgeMetadata` that `satisfies ComponentMetadata`. Copy an
   existing one and replace every section. List the same slots as the `@slot` tags, and the glyphs it
   renders under `phosphor` (chapter 07). A default or fixed glyph also goes into the `Home.mdx`
   recipe and `src/test/browser-setup.ts`.
6. Create `Badge.stories.ts` (recipe 6).
7. Add `export * from './Badge/Badge.js';` to `src/lib/components/index.ts`, in alphabetical order.
8. Add the class, `BadgeMetadata` and any public types to `src/lib/index.ts`.
9. Run `pnpm check`, `pnpm build` and `pnpm test`.

| Skip               | What fails                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| step 5             | `slots.browser.test.ts`: a component that renders a slot its metadata does not declare fails; tools get no description of it                                   |
| step 5's slot list | `pnpm build`: `composition.slots … differ from <gv-badge>'s @slot tags`                                                                                        |
| step 5's glyphs    | `glyphs.browser.test.ts`: the glyphs it draws differ from `phosphor`; `metadata.test.ts`: the Home.mdx recipe or browser-setup.ts list differs                 |
| step 8             | the component is missing from the package and from `groveTags`: `glyphs.browser.test.ts` fails on its unpaired metadata, though the other shared tests skip it |
| step 9             | nothing fails yet, which is the problem: the manifest check only runs in `pnpm build`                                                                          |

After this recipe, raise the hard-coded component count of 15 in `metadata.test.ts` and
`host-hidden.browser.test.ts`; both fail until you do. `pnpm check-ledger` will fail until the next release records the new
component; that is expected (chapter 09).

## 3 · Add a property

1. Add the field with `@property`, in the property block, before `static styles`.
   - Multi-word name: give the attribute in kebab-case, `attribute: 'is-compact'`.
   - Boolean: default to `false`. Add `reflect: true` if page CSS should be able to select on it.
   - Optional string: type it `string | undefined` and use `ifDefined()` in the template.
   - A fixed set of values: declare a `type` alias union above the class.
2. Use it in `render()` or in a class name through `classMap`.
3. Update the metadata: `variants`, `usage.commonPatterns` snippets (in attribute names), and bump
   `component.version` and `component.modified`.
4. Add the control to the story's `argTypes` and `args`.
5. Run `pnpm build`.

| Skip                                  | What fails                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------- |
| the `attribute:` on a multi-word name | markup `is-compact` silently does nothing; Lit listens for `iscompact`      |
| attribute names in snippets           | `metadata.test.ts` (no camelCase) and `pnpm build` (unknown attribute)      |
| `pnpm build`                          | a type alias the manifest cannot expand goes unnoticed until someone builds |

## 4 · Add an event

1. Pick a `gv-` name. Reuse an existing one if the meaning is the same (`gv-change` for a committed
   value change).
2. Dispatch it with `new CustomEvent('gv-name', { detail, bubbles: true, composed: true })`. Add
   `cancelable: true` only if a listener should be able to stop a default action.
3. Add `@fires {CustomEvent<T>} gv-name - description` to the class JSDoc.
4. Add it to `GroveEventMap` in `src/lib/events.ts`.
5. For a precise type on element references, add a `*EventMap` and listener overloads, copying
   `CheckboxEventMap` in `Checkbox.ts`, and export the map from `src/lib/index.ts`.
6. If the component wraps another Grove component that already fires the event, call
   `e.stopPropagation()` on the inner event before dispatching your own (chapter 05).
7. Add a case to `events.browser.test.ts` and a typed line to `src/test/events.types.ts`.

| Skip       | What fails                                                      |
| ---------- | --------------------------------------------------------------- |
| `composed` | listeners outside the component never hear it                   |
| step 3     | `pnpm build`: `dispatches "gv-name" without a typed @fires tag` |
| step 4     | `addEventListener('gv-name', …)` is untyped for consumers       |
| step 6     | the page receives the event twice for one action                |

## 5 · Add or change a token

1. Edit the JSON under `src/lib/tokens/`, never `tokens.css`. Every token is an object with a
   `$value`; follow the shape of its neighbours.
2. If the token differs in dark mode, edit both `*.light.tokens.json` and `*.dark.tokens.json`.
3. `pnpm build-tokens`
4. Read `git diff src/lib/tokens/tokens.css`: the new or changed variable should appear in each block
   that declares it.
5. `pnpm vitest run --project unit src/lib/tokens/contrast.test.ts`
6. If `DESIGN_SYSTEM.md` describes the token, update it to match.

| Skip     | What fails                                                                   |
| -------- | ---------------------------------------------------------------------------- |
| `$value` | Terrazzo skips the entry and emits no variable at all, with no error         |
| step 3   | `contrast.test.ts`: the built CSS no longer matches the JSON                 |
| step 5   | a colour change can break text contrast in one theme without anyone noticing |

## 6 · Add a story

1. In `<Name>.stories.ts`: `import './<Name>.js';`, a `meta` with `title: 'Components/gv-<tag>'`
   and `tags: ['autodocs']`, a `render` that returns `html`, `argTypes` and `args`.
2. Export one story per meaningful state.
3. If the component has slots, add a story that passes light-DOM children.
4. Check it in all three themes with the toolbar.

The `storybook` test project picks up the new stories automatically.

## 7 · Add a browser test

1. Create `<Name>.browser.test.ts` next to the component.
2. Import the component for its side effect and its type.
3. Render into a host element with Lit's `render`, and `await el.updateComplete`.
4. Assert on `el.shadowRoot`, on layout (`getBoundingClientRect()`), or on the accessibility tree
   (`commands.ariaSnapshot`).
5. Clear the host in `afterEach`.
6. `pnpm vitest run --project browser src/lib/components/<Name>/<Name>.browser.test.ts`

Copy `MenuItem.browser.test.ts` as a starting point (chapter 08).

## 8 · Run tests selectively

```sh
pnpm vitest run --project unit
pnpm vitest run --project browser src/lib/slots.browser.test.ts
pnpm vitest run --project storybook
pnpm test:unit                       # watch mode
```

If a browser test times out in the full run, run its file alone first (chapter 08).

## 9 · Format and lint only what you touched

```sh
git diff --name-only
pnpm exec prettier --write <those paths>
pnpm exec eslint <those .ts paths>
```

Do not run `pnpm format` or `prettier --write .` to make `pnpm lint` pass; see chapter 09.

## 10 · Release by hand

See [Releasing by hand](09-build-publish-and-conventions.md#releasing-by-hand) in chapter 09.

## 11 · Undo `tokens.css` churn

After `pnpm build`, if you changed no token JSON:

```sh
git diff --stat src/lib/tokens/tokens.css
git checkout -- src/lib/tokens/tokens.css
```

## 12 · Regenerate the manifest only

```sh
pnpm build-manifest
```

Writes `dist/custom-elements.json` and `dist/types/astro.d.ts` and runs the manifest check, without
rebuilding tokens or the bundle. Useful while fixing JSDoc tags.

## 13 · `src/.ai/` looks stale

It is regenerated by maintainer tooling that is not part of this repo. Don't edit it by hand; ask the
maintainer to regenerate it, and commit the result on its own.
