# 04 · Styling, surfaces and focus

> **What you need from this chapter**
>
> - How `static styles` works, what the shared fragments do, and the rules for CSS inside a component.
> - What a _surface_ is, and how the page tells a component which surface it sits on.
> - How the focus ring works, and the checklist for any new interactive component.

## `static styles`

A Lit component's CSS lives in a static class field:

```ts
static styles = [componentReset, focusRing, css`…`];
```

Lit's docs say three things that matter here (<https://lit.dev/docs/components/styles/>):

- **The value can be one `css` template or an array of them.** Grove always uses an array.
- **Static styles are evaluated once per class** and shared by every instance. Ten buttons on a page
  share one stylesheet.
- **The `css` tag only accepts other `css` values or numbers inside `${…}`.** You cannot put a
  property value into static CSS. Per-instance values go through classes (`classMap`), inline styles
  (`styleMap`), or custom properties.

How Lit attaches the CSS is not spelled out on that page; this comes from Lit's source
(`@lit/reactive-element`, `css-tag.js`). Each `css` value is turned into one `CSSStyleSheet` with
`replaceSync()`, and that sheet is added to every shadow root through `adoptedStyleSheets`. A browser
without `adoptedStyleSheets` gets a `<style>` element instead.

## The shared fragments

`src/lib/styles/` holds three Lit style fragments. They are exported from the package, so consumers
writing their own Lit components can reuse them.

### `componentReset` (always first)

Page CSS does not reach inside a shadow root, so a global reset on the page does nothing for a
component. `componentReset` repeats the basics inside every component: `box-sizing: border-box`,
`margin: 0`, `font: inherit` on form controls, block-level media. It also carries two guarantees for
the host:

```css
:host([hidden]:not([hidden='until-found'])) {
	display: none !important;
}

@media (prefers-reduced-motion: reduce) {
	:host,
	*,
	*::before,
	*::after {
		transition-duration: 0.01ms !important;
		transition-delay: 0s !important;
		animation-duration: 0.01ms !important;
		animation-delay: 0s !important;
		animation-iteration-count: 1 !important;
	}
}
```

- **`hidden` always hides the element**, even when the page gives the host a `display` value.
- **Reduced motion ends every transition almost instantly.** The duration is `0.01ms`, not `0s`, so
  the `transitionend` event still fires and code waiting for it does not hang.

Browser tests check both: `host-hidden.browser.test.ts` and `reduced-motion.browser.test.ts`.

### `focusRing` (interactive components, second)

The shared focus indicator; see [The focus ring](#the-focus-ring) below.

### `visuallyHidden`

A `.visually-hidden` class that keeps text in the accessibility tree while drawing nothing. The same
rule ships to the page as `.visually-hidden` in `a11y.css`; `visually-hidden.test.ts` checks the two
copies match. Never put it on a focusable element.

## Rules for CSS inside a component

- **Block-level components start with `:host { display: block; }`.** A custom element is `inline` by
  default. `MenuItem.ts` is an example; inline components such as Button leave the host alone.
- **Use tokens for every value**: `var(--soft-grid-16)`, `var(--semantic-color-text-on-ground-base)`,
  `var(--border-radius-8xl)`. No hex colours, no raw font sizes.
- **Typography uses the `font` shorthand with a composite token, plus its own letter-spacing token.**
  The shorthand cannot carry letter-spacing, so each composite comes with a `-letter-spacing`
  sub-token:

  ```css
  .btn--md {
  	gap: var(--soft-grid-6);
  	padding: var(--soft-grid-8) var(--soft-grid-16);
  	font: var(--typography-single-line-subtle-emphasis);
  	letter-spacing: var(--typography-single-line-subtle-emphasis-letter-spacing);
  }
  ```

  Never set `font-size`, `line-height` or `font-family` one by one.

- **Flat selectors only**: `.btn--outlined.btn--sm`, not nested rules. This is a house convention for
  readability, not a browser limit.
- **Custom properties do not work inside `@media` conditions.** Breakpoints are written as numbers,
  with a comment naming the token:

  ```css
  /* --breakpoints-laptop (1280px) — custom properties cannot be used in media queries */
  @media (min-width: 1280px) {
  ```

  (from `BackButton.ts`).

- **Private custom properties start with `--_`** (`--_drop`, `--_ring-default`, `--_fill-light`).
  They are internal and may change. **Public** ones (`--gv-icon-fill-display`, `--gv-isotype-size`)
  are part of the API and are documented with a `@cssprop` tag in the class's JSDoc.
- **Never write `outline: none`** on a focusable element. `focus.test.ts` scans every component and
  fails if it finds one.

## Surfaces

Grove's colour system is built on **surfaces**: the background a piece of UI sits on. Each surface has
matching text, border, shadow and focus-ring tokens, so content placed on it stays readable.

The surface names are listed as a TypeScript type in `src/lib/surfaces.ts`:

```ts
export type GroveSurface =
	| 'ground'
	| `${GroveTrack}-terrace`
	| 'brand-path'
	| 'gray-path'
	| `${GroveTrack}-summit`
	| `${GroveTrack}-aurora`;
```

- **Ground** is the page.
- **Terrace**, **Path** and **Summit** are raised levels (a card, a panel, a filled button).
- **Aurora** is not a resting surface. It is a short-lived highlight: a hover, a press, a selection.
- A **track** is a colour family: `accent`, `brand`, `danger`, `gray`, `information`, `success`.

`DESIGN_SYSTEM.md` explains when to use each level. For code, the important part is that each surface
has a token named `--semantic-color-surface-<surface>`, and a class in `surfaces.css`.

### Surface classes

`src/lib/styles/surfaces.css` (in `grove.css`) has one class per surface. A page uses them on its own
containers:

```css
.gv-surface-accent-terrace {
	background-color: var(--semantic-color-surface-accent-terrace);
	color: var(--semantic-color-text-on-accent-terrace-base);
	--gv-focus-ring: var(--ring-on-accent-terrace);
}
```

The class paints the background, sets the text colour, and declares `--gv-focus-ring`, the ring that
every Grove control inside the container will draw. Aurora classes leave `--gv-focus-ring` out on
purpose: a control focused over a highlight keeps the ring of the surface underneath.

## The focus ring

The ring that shows when you Tab to a control is the same in every component. It is one shared
fragment, `src/lib/styles/focus-ring.ts`:

```ts
export const focusRing = css`
	.gv-focusable:focus-visible {
		outline: var(--border-width-heavy, 2px) solid transparent;
		outline-offset: var(--soft-grid-4, 4px);
		box-shadow:
			var(--gv-focus-ring, var(--_ring-default, var(--ring-on-ground))), var(--_drop, 0 0 #0000);
	}
`;
```

Read the `box-shadow` line from left to right:

1. **`--gv-focus-ring`**: the ring set by the nearest `.gv-surface-*` class, inherited into the
   component. A button on an accent terrace gets the accent-terrace ring.
2. **`--_ring-default`**: used when no surface class is around. A component sets it when it knows the
   surface it normally sits on. `MenuItem.ts` sets `--_ring-default: var(--ring-on-brand-terrace);`
   because menus sit on the brand terrace.
3. **`--ring-on-ground`**: the last fallback, the Ground ring.
4. **`--_drop`**: after the comma, the control's own drop shadow, so the ring is drawn on top of it
   instead of replacing it.

That last point is why components set `--_drop` and never `box-shadow`. If a component wrote
`box-shadow` on the control, the focus rule would replace it while focused, and the shadow would vanish.

The **transparent outline** draws nothing normally. Under forced-colours mode (for example Windows High
Contrast), browsers drop `box-shadow` and paint outlines in a system colour, so the outline becomes the
visible indicator.

### Theme islands

An element with `data-theme="light"` or `data-theme="dark"` starts a fresh Ground inside the page
(chapter 06). `globals.css` resets the ring there, so controls inside fall back to the island's own
Ground ring rather than inheriting a surface ring from outside:

```css
[data-theme] {
	--gv-focus-ring: initial;
}
```

### Checks

- `src/lib/styles/focus.test.ts`: no component has `outline: none`; every surface class paints its
  surface, its text and (except aurora) its ring, and there is no class for a surface outside
  `GroveSurface`.
- `src/lib/styles/focus-ring.browser.test.ts`: the ring renders as described, in real Chromium.
- The `FocusRing` story in `src/stories/` lets you see it.

### Checklist for a new interactive component

1. Add `focusRing` to `static styles`, right after `componentReset`.
2. Put the class `gv-focusable` on the inner element that receives focus (the `<button>`, `<a>`,
   `<input>`).
3. Set the control's shadow with `--_drop`, never `box-shadow`.
4. If the component always sits on one surface, set `--_ring-default` to that surface's ring.
5. Never write `outline: none`.

## Where to see it in Button.ts

- `static styles = [componentReset, focusRing, css…]` in that order.
- `'gv-focusable': true` in the `classMap`.
- Every variant sets `--_drop` (and `--_drop: 0 0 #0000` on `:active` to remove the shadow when
  pressed).
- Each size class pairs `font: var(--typography-…)` with its `-letter-spacing` token.
- Button sets no `--_ring-default`, so outside any surface class it draws the Ground ring.
