# Glossary

Plain-word definitions of the terms this guide uses, grouped by where they come from. The chapter in
brackets is where the term is explained in context.

## Web platform

**Custom element**: an HTML tag you define with a JavaScript class and register with
`customElements.define`. Its name must contain a hyphen. [02]

**Host**: the custom element itself on the page, for example the `<gv-button>` tag, as opposed to the
markup inside it. [02]

**Shadow DOM / shadow root**: a private DOM tree attached to a host. Its CSS does not leak out and
page CSS does not leak in. [02]

**Light DOM**: the normal DOM of the page, including the children written between a host's tags. [02]

**Slot**: a `<slot>` element in a shadow root that shows the host's light-DOM children in that spot.
The slot without a name is the **default slot**; others are **named slots**. [02, 05]

**CSS custom property**: a CSS variable such as `--soft-grid-8`. Custom properties inherit through
shadow roots, which is how tokens reach every component. [02, 04]

**Composed event**: an event dispatched with `composed: true`, which can leave the shadow root it was
dispatched in. **Bubbles** means it also travels up through the ancestors. [05]

**Retargeting**: when an event leaves a shadow root, listeners outside see the host as its `target`,
not the inner element. `event.composedPath()` lists the real path. [05]

**`:focus-visible`**: a CSS state that matches when the browser decides a focus indicator should show,
typically for keyboard focus but not for a mouse click. [04]

**Forced colours**: an operating-system mode (such as Windows High Contrast) where the browser
replaces page colours with a small system palette and drops `box-shadow`. [04]

**Constructable stylesheet**: a `CSSStyleSheet` created in JavaScript and attached to a shadow root
through `adoptedStyleSheets`, so many roots can share one sheet. [04]

## Lit

**Lit / `LitElement`**: a small library for writing custom elements. A component extends `LitElement`.
[02]

**Reactive property**: a class field declared with `@property()`. Changing it re-renders the
component, and it can be set from an HTML attribute. [02]

**Attribute vs property**: an attribute is the string in HTML (`is-selected`); a property is the
JavaScript field (`isSelected`). Lit links them; by default the attribute is the property name in
lowercase. [02]

**`reflect`**: a `@property` option that copies the property's value back to its attribute. [02]

**`@state()`**: a private reactive field with no attribute. [02]

**Decorator**: the `@name(...)` syntax above a class or field (`@customElement`, `@property`). This
repo uses TypeScript's "experimental" decorators. [02]

**`html` tagged template**: the template a component returns from `render()`. Lit updates only the
`${…}` parts when values change. [02]

**Binding**: one `${…}` in a template. Its prefix decides what it sets: text, an attribute, a boolean
attribute (`?`), a property (`.`) or an event listener (`@`). [02]

**`nothing`**: a Lit value that renders nothing in content and removes an attribute. [02]

**Directive**: a function used inside a template to control how a value is applied, such as
`ifDefined`, `classMap`, `styleMap`. [02]

**Static expression / `unsafeStatic`**: a value inserted into a template before Lit parses it, used to
choose a tag name. Must never come from user input. [02]

**Update cycle**: the sequence Lit runs after a property changes: `shouldUpdate`, `willUpdate`,
`update`/`render`, `firstUpdated`, `updated`. It runs asynchronously, so many changes cause one
render. [02]

**`updateComplete`**: a promise on every Lit element that resolves after its pending render is done.
Tests await it. [02, 08]

**Reactive controller**: an object that plugs into a component's lifecycle with
`host.addController(this)`, to share behaviour between components. Grove's `SlotContent` is one. [05]

**`static styles`**: the class field holding a Lit component's CSS. Evaluated once per class and
shared by every instance. [04]

## Grove

**`gv-*`**: the prefix of every Grove tag (`gv-button`) and every Grove event (`gv-change`). [01, 05]

**Design token**: a named design value, published as a CSS custom property in `tokens.css`. [06]

**Primitive token / semantic token**: a primitive holds a raw value (`--color-gray-50`); a semantic
token names a role and points at a primitive (`--semantic-color-surface-ground`). Components use
semantic tokens. [06]

**Composite token**: a token made of several values, such as a typography style with family, size,
weight, line height and letter spacing. [06]

**Surface**: the background a piece of UI sits on: Ground, Terrace, Path, Summit or Aurora, in one of
six colour tracks. [04]

**Track**: a colour family: `accent`, `brand`, `danger`, `gray`, `information`, `success`. [04]

**Aurora**: a short-lived highlight surface (hover, press, selection), never a resting container. [04]

**`.gv-surface-*` class**: a page CSS class that paints a surface and sets the focus-ring colour for
everything inside. [04]

**Theme island**: an element with `data-theme="light"` or `"dark"` that shows a region in that theme,
inside a page in the other. [06]

**`componentReset`**: the shared style fragment every component lists first in `static styles`. [04]

**`focusRing` / `gv-focusable`**: the shared focus-indicator fragment, and the class that marks which
element inside a component draws it. [04]

**`--_drop`**: the private custom property a component sets for its control's drop shadow, so the focus
ring can stack on top. [04]

**`--_` / `--gv-` properties**: `--_name` is private to one component; `--gv-name` is public API,
documented with `@cssprop`. [04]

**`SlotContent`**: Grove's reactive controller that knows whether a slot has real content, so a
property can be shown as the fallback. [05]

**Metadata (`*Metadata`)**: the structured description exported from each `*.metadata.ts` file, for
tools and AI assistants. [07]

**Release ledger**: `components-since.json`, mapping each component to the version it first shipped
in. [09]

## Packaging and tooling

**pnpm**: the package manager this repo uses.

**Vite library mode**: Vite's build mode for packages: one entry, no HTML app. [09]

**Peer dependency**: a package the consuming app must install itself (`lit`). The library imports it
but does not bundle it. [09]

**`exports` map**: the `package.json` field that lists which paths a consumer may import. [09]

**`sideEffects`**: a `package.json` hint telling bundlers which files must not be dropped even if
nothing is imported from them. [09]

**publint**: a tool that checks a package's `exports`, `types` and `files` before publishing. [09]

**DTCG**: the W3C Design Tokens Community Group format for token JSON (`$value`, `$type`). [06]

**Terrazzo**: the tool that turns DTCG token JSON into `tokens.css`. [06]

**Resolver / modifier**: `main.resolver.json` lists token files; a modifier is a context (theme,
breakpoint, media) that swaps some of them. [06]

**OKLCH**: a colour space with lightness, chroma and hue, used for every Grove colour. [06]

**Custom elements manifest**: `custom-elements.json`, a standard description of a package's elements,
attributes, events, slots and CSS properties. [07]

**JSDoc tags (`@slot`, `@fires`, `@cssprop`)**: comments on a component class that the manifest
analyzer reads. [07]

**Vitest project**: one named group of tests with its own files and environment (`unit`, `browser`,
`storybook`, `a11y-canary`). [08]

**Browser mode / Playwright**: Vitest running tests in a real Chromium, driven by Playwright. [08]

**axe**: the accessibility checker the Storybook a11y addon runs on every story. [08]

**a11y canary**: a story with planted accessibility faults, used to prove the checker still catches
them. [08]

**TOON**: a compact text format for structured data, used by the generated `src/.ai/` index. [01, 07]

## Lit documentation used in this guide

Every Lit claim in this guide links to one of these pages. All were checked on 2026-10-07.

| Page                                            | Covers                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| <https://lit.dev/docs/components/shadow-dom/>   | shadow DOM, slots and scoping                                      |
| <https://lit.dev/docs/components/properties/>   | reactive properties, attributes, `reflect`, `@state`, class fields |
| <https://lit.dev/docs/components/decorators/>   | decorator setup, `useDefineForClassFields`                         |
| <https://lit.dev/docs/components/lifecycle/>    | the update cycle and `updateComplete`                              |
| <https://lit.dev/docs/templates/expressions/>   | bindings, `nothing`, static expressions                            |
| <https://lit.dev/docs/templates/directives/>    | `ifDefined`, `classMap`, `styleMap`                                |
| <https://lit.dev/docs/components/defining/>     | `@customElement` and `HTMLElementTagNameMap`                       |
| <https://lit.dev/docs/components/styles/>       | `static styles`, custom properties                                 |
| <https://lit.dev/docs/composition/controllers/> | reactive controllers                                               |
| <https://lit.dev/docs/components/events/>       | dispatching, `composed`, retargeting, listener binding             |
| <https://lit.dev/docs/tools/publishing/>        | not bundling Lit, self-defining elements, import extensions        |
| <https://lit.dev/docs/tools/testing/>           | testing in a real browser                                          |
