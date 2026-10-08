# 06 · Tokens and theming

> **What you need from this chapter**
>
> - How the token JSON files become `tokens.css`, and how a JSON path becomes a CSS variable name.
> - How light, dark, OS dark, breakpoints and print are layered in one CSS file.
> - The page-level CSS files, how a consumer loads them, and the contrast test that guards colours.

## What a token is

A **design token** is a named design decision: "the Ground surface colour", "16 px of spacing", "the
body text style". Components never use raw values; they use tokens as CSS custom properties, such as
`var(--semantic-color-surface-ground)`. Changing a token changes every component that uses it.

## The pipeline

```
src/lib/tokens/**/*.tokens.json  ─┐
src/lib/tokens/main.resolver.json ┼─►  Terrazzo (pnpm build-tokens)  ─►  src/lib/tokens/tokens.css
terrazzo.config.js               ─┘
```

- The token files use the **DTCG** format (the W3C Design Tokens Community Group format): each token
  is an object with a `$value`, and groups nest by name.
- **`main.resolver.json`** says which files are always loaded (`sets`), which files swap depending on
  context (`modifiers`), and in what order they resolve.
- **Terrazzo** (`@terrazzo/cli`) reads the resolver and writes `tokens.css`.
- **`terrazzo.config.js`** decides how each combination of contexts is wrapped in CSS selectors and
  media queries.

`tokens.css` is generated. Never edit it; edit the JSON and run `pnpm build-tokens`. `pnpm build`
runs that step first.

## The folders

| Folder     | Holds                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `palette/` | `color.tokens.json` (primitives in OKLCH) and `semantic-color.{light,dark}.tokens.json`                                                        |
| `effects/` | drop shadows `drop-shadow-under.{light,dark}` and focus rings `ring-on.{light,dark}`                                                           |
| `spacing/` | the soft grid, breakpoints, and layout grids per breakpoint (`grid.{mobile,…}`)                                                                |
| `border/`  | radius and width                                                                                                                               |
| `text/`    | font families and weights; sizes, line heights and letter spacing in `digital` and `print` versions; `typography.tokens.json` (the composites) |

## Three modifiers

`main.resolver.json` has three **modifiers**. Each is a context with a default and alternatives:

| Modifier     | Default   | Alternatives                  | Swaps                                       |
| ------------ | --------- | ----------------------------- | ------------------------------------------- |
| `theme`      | `light`   | `dark`                        | semantic colours, drop shadows, focus rings |
| `breakpoint` | `mobile`  | `tablet`, `laptop`, `desktop` | the layout grid (columns, gutters, margins) |
| `media`      | `digital` | `print`                       | font sizes, line heights, letter spacing    |

## From JSON path to CSS name

A token's CSS name is its JSON path, with each camelCase segment turned into kebab-case and joined by
hyphens.

**A primitive** holds a raw value. `color.gray.50` in `palette/color.tokens.json`:

```json
"50": {
	"$value": {
		"colorSpace": "oklch",
		"components": [0.93, 0.006, 70],
```

becomes

```css
--color-gray-50: oklch(93% 0.006 70);
```

All colours are in **OKLCH**, a colour space where equal steps in lightness look equal to the eye.

**An alias** points at another token. `semanticColor.surface.ground` in
`semantic-color.light.tokens.json` has `"$value": "{color.base.light}"` and becomes

```css
--semantic-color-surface-ground: var(--color-base-light);
```

Components use the semantic names (`--semantic-color-*`), not primitives. That is what lets dark mode
swap the meaning without touching any component.

The semantic colour groups are `surface`, `textOn`, `borderAround`, `dividerOn` and
`selectedTextOn`, so the names read as sentences: _text on the accent summit, base weight_ is
`--semantic-color-text-on-accent-summit-base`.

## Typography composites

A **composite** token bundles several values. `typography.singleLine.base.base`:

```json
"$value": {
	"fontFamily": "{fontFamily.sansSerif}",
	"fontSize": "{fontSize.md}",
	"fontWeight": "{fontWeight.regular}",
	"letterSpacing": "{letterSpacing.base}",
	"lineHeight": "{lineHeight.singleLine.md}"
}
```

Terrazzo writes one variable per part, plus a value for the CSS `font` shorthand:

```css
--typography-single-line-base-base-font-family: var(--font-family-sans-serif);
--typography-single-line-base-base-font-size: var(--font-size-md);
--typography-single-line-base-base-font-weight: var(--font-weight-regular);
--typography-single-line-base-base-letter-spacing: var(--letter-spacing-base);
--typography-single-line-base-base-line-height: var(--line-height-single-line-md);
--typography-single-line-base-base: var(--typography-single-line-base-base-font-weight)
	var(--typography-single-line-base-base-font-size)/var(
		--typography-single-line-base-base-line-height
	)
	var(--typography-single-line-base-base-font-family);
```

The shorthand has no slot for letter-spacing, which is why CSS always pairs `font:` with the
`-letter-spacing` sub-token (chapter 04).

Names follow `--typography-{single-line|multi-line}-{level}-{variant}`. The levels are `hero`,
`display`, `title`, `heading`, `subheading`, `base`, `subtle`, `quote`, `label`, `caption` and
`footnote`. **Single-line** composites have tight line heights for one-line UI text; **multi-line**
ones have looser leading for paragraphs.

## How themes and contexts layer in one file

`tokens.css` declares the full token set many times, once per context, and lets the CSS cascade pick.
`terrazzo.config.js` has a comment explaining why the selectors look the way they do; the short
version:

| Block in `tokens.css`                                                                   | Applies when                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `:root { color-scheme: light dark; … }`                                                 | always: light, mobile, digital                   |
| `[data-theme="light"] { … }`                                                            | an element sets `data-theme="light"`             |
| `@media (prefers-color-scheme: dark) { :root:where(:not([data-theme="light"])) { … } }` | the OS is dark and the page has not forced light |
| `[data-theme="dark"] { … }`                                                             | an element sets `data-theme="dark"`              |
| `@media (width >= 768px)`, `(width >= 1280px)`, `(width >= 1536px)`                     | tablet, laptop, desktop                          |
| `@media print { :root, [data-theme] { color-scheme: light; … } }`                       | printing: always light                           |

Every block has the same specificity, so **source order decides**. The `:where()` around the OS-dark
selector adds no specificity, so `<html data-theme="light">` opts out of OS dark instead of losing to
it.

For a consumer:

- Do nothing, and Grove follows the operating system's light or dark setting.
- Put `data-theme="light"` or `data-theme="dark"` on `<html>` to force one.
- Put `data-theme` on any inner element to make a **theme island**: a region in the other theme. The
  island repaints Ground and resets the focus ring (`globals.css`, chapter 04).

Storybook's theme toolbar does exactly this on `<html>` (chapter 08).

## The page-level CSS

`tokens.css` only defines variables. The package also ships CSS that the _page_ uses, bundled by
`src/lib/styles/grove.css`:

```css
@import '../tokens/tokens.css';
@import '../fonts/fonts.css';
@import './globals.css';
@import './typography.css';
@import './effects.css';
@import './surfaces.css';
@import './a11y.css';
```

| File             | Gives the page                                                                  |
| ---------------- | ------------------------------------------------------------------------------- |
| `fonts.css`      | `@font-face` for Cakra (display) and Inclusive Sans (body)                      |
| `globals.css`    | Ground background and text on `body` and on every `[data-theme]` island         |
| `typography.css` | classes such as `.base.multiline` that apply a composite and its letter-spacing |
| `effects.css`    | drop-shadow classes such as `.drop-shadow-under-accent-summit`                  |
| `surfaces.css`   | the `.gv-surface-*` classes (chapter 04)                                        |
| `a11y.css`       | `.visually-hidden`                                                              |

A consumer imports `@edgarjaymez/grove/grove.css` once, or the parts it wants
(`@edgarjaymez/grove/tokens.css`, `@edgarjaymez/grove/fonts.css`). Components still render without
it, but every `var(--…)` would be empty, so they would look unstyled.

## The contrast gate

`src/lib/tokens/contrast.test.ts` reads the generated `tokens.css` and checks, in light and dark:

- every text-on pair is readable (WCAG 2.2 AA, 4.5:1, plus APCA as an extra measure);
- every focus ring has 3:1 contrast against the surface it sits on;
- the theme cascade behaves as the table above says;
- `tokens.css` matches the JSON sources, so if you edit JSON and forget `pnpm build-tokens`, it fails.

Run it on its own with the unit project:

```sh
pnpm vitest run --project unit src/lib/tokens/contrast.test.ts
```

## `tokens.css` churn

`pnpm build` always regenerates `tokens.css`. Sometimes the generator rewrites it with no real change
(ordering or formatting). Before committing, look at `git diff src/lib/tokens/tokens.css`. If you did
not edit any token JSON, throw the change away:

```sh
git checkout -- src/lib/tokens/tokens.css
```

## `DESIGN_SYSTEM.md` and `tokens.css`

`DESIGN_SYSTEM.md` explains the design language: when to use which surface, how elevation works,
which text level fits where. Use it for intent. When it names a token or a value that `tokens.css`
does not have, `tokens.css` is right, and the doc needs a fix: report it rather than copying the doc's
value into code.

## Where to see it in Button.ts

- Backgrounds and text use semantic tokens: `--semantic-color-surface-accent-summit`,
  `--semantic-color-text-on-accent-summit-base`.
- Shadows use `--drop-shadow-under-accent-summit`, which swaps in dark mode with no change to Button.
- Spacing uses the soft grid (`--soft-grid-8`), radius uses `--border-radius-8xl`, and each size uses a
  typography composite and its letter-spacing sub-token.
- Button contains no `[data-theme]` or `prefers-color-scheme` rule. Theming happens entirely in
  `tokens.css`.
