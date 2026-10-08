# 02 · Web components and Lit

> **What you need from this chapter**
>
> - The browser features Grove is built on: custom elements, Shadow DOM and slots.
> - What Lit adds on top: reactive properties, templates, scoped styles and an update cycle.
> - Which Lit features this repo uses, and which ones it does not, so you know what to expect.

## Part A · The web platform

### Custom elements

A **custom element** is an HTML tag you define yourself. You write a class that extends `HTMLElement`
and register it with a name that contains a hyphen. In plain JavaScript that is one call (Grove never
writes it by hand; Lit's `@customElement` decorator makes it, see Part B):

```ts
customElements.define('gv-button', Button);
```

From then on the browser treats `<gv-button>` like a built-in tag: it can appear in HTML, be created
with `document.createElement('gv-button')`, and be styled and queried like any other element. There is
no framework runtime; the browser itself creates the element and calls its methods.

The element on the page (`<gv-button>`) is called the **host**.

### Shadow DOM

Each Grove element renders its inner markup into a **shadow root**: a private DOM tree attached to the
host. Two things follow:

- **Styles are scoped.** CSS inside the shadow root applies only there, and the page's CSS does not
  reach in. A `.btn` rule in `gv-button` cannot collide with a `.btn` rule on the page.
- **Markup is hidden.** `document.querySelector('.btn')` does not find the button inside
  `gv-button`. You reach it through `element.shadowRoot`.

The page's normal DOM, including the children you write between `<gv-button>` and `</gv-button>`, is
called the **light DOM**.

Only a few things cross the shadow boundary:

| Crosses in         | How                                                                              |
| ------------------ | -------------------------------------------------------------------------------- |
| Inherited CSS      | Inherited properties (`color`, `font`) and **every CSS custom property** flow in |
| Light-DOM children | Through `<slot>` elements (next section)                                         |

| Crosses out | How                                                                             |
| ----------- | ------------------------------------------------------------------------------- |
| Events      | Only events dispatched with `composed: true` leave the shadow root (chapter 05) |

Grove depends on all of these. Tokens reach every component because custom properties inherit.
Surfaces set the focus-ring colour the same way (chapter 04). Components report changes with composed
events. Lit's docs: <https://lit.dev/docs/components/shadow-dom/>.

### Slots

A `<slot>` inside the shadow root is a placeholder where the host's light-DOM children appear. If a
page writes `<gv-button>Save</gv-button>`, the text `Save` stays in the light DOM but is _shown_ where
`gv-button` put its `<slot></slot>`.

A slot can have a name (`<slot name="heading">`), and a child picks it with `slot="heading"`. A slot
without a name is the **default slot**. Native slots can show fallback content when nothing is
assigned, but Grove does not rely on that, because the whitespace between a host's tags counts as
content (chapter 05).

### If you know React or Vue

| React / Vue idea            | Web component / Lit equivalent                                |
| --------------------------- | ------------------------------------------------------------- |
| Component function or SFC   | A class extending `LitElement`, registered as a tag           |
| Props                       | Reactive properties, which can also be set as HTML attributes |
| Local state                 | `@state()` fields                                             |
| JSX / template              | `html` tagged template returned from `render()`               |
| `children` / default slot   | `<slot>` (the content stays in the light DOM)                 |
| Emitting an event / `onX`   | `this.dispatchEvent(new CustomEvent('gv-*', …))`              |
| CSS modules / scoped styles | Shadow DOM plus `static styles`                               |
| Re-render on change         | Lit batches property changes and re-renders asynchronously    |

The big difference: a web component is a real DOM element. Any framework, or plain HTML, can use it.

## Part B · Lit

Lit is a thin layer over custom elements. A Lit component extends `LitElement`, declares its
properties, and returns a template from `render()`. Lit re-renders when a property changes, updating
only the parts of the DOM that depend on it.

### Reactive properties: `@property`

```ts
@property({ type: String }) variant: ButtonVariant = 'filled';
@property({ type: Boolean, reflect: true }) disabled = false;
```

A **reactive property** is a class field that triggers a re-render when it changes. `@property` also
links it to an HTML **attribute**, so `<gv-button variant="ghost">` sets `variant`.

Facts from <https://lit.dev/docs/components/properties/> that shape this repo:

- **The attribute name is the property name, lowercased.** A property `isSelected` reads the attribute
  `isselected`, not `is-selected`. That is why multi-word properties here always name their attribute:

  ```ts
  @property({ type: Boolean, attribute: 'is-filled' }) isFilled = false;
  ```

  (from `Icon.ts`). Markup and metadata always use the attribute name.

- **Boolean attributes work by presence.** If the attribute is there, the property is `true`; if not,
  `false`. So a boolean property must default to `false`, or markup cannot turn it off.
- **`reflect: true` copies the property back to the attribute** whenever it changes. Grove reflects
  `disabled` and toggled states so page CSS can target `gv-checkbox[checked]`.
- **`type`** tells Lit how to convert the attribute string (`String`, `Boolean`, `Number`).

### Internal state: `@state`

`@state()` declares a reactive field that is private to the component: it re-renders on change but has
no attribute. `ColorSwatch.ts` uses it to remember which value was just copied:

```ts
@state() private copied: ColorSpace | null = null;
```

The build rejects a `@state` field that leaks into the manifest (chapter 07).

### The decorator setup (do not change it)

`tsconfig.json` sets:

```json
"experimentalDecorators": true,
"useDefineForClassFields": false,
```

Lit supports two decorator styles. This repo uses the older "experimental" TypeScript decorators, and
Lit's docs say that with them you must keep `useDefineForClassFields` set to `false`
(<https://lit.dev/docs/components/decorators/>). If it were `true`, TypeScript would define each class
field directly on the instance, hiding the getter and setter Lit installs, and setting a property
would no longer re-render
(<https://lit.dev/docs/components/properties/#avoiding-issues-with-class-fields>). Because of this
setup the repo never uses the `accessor` keyword that standard decorators need.

### Templates: `html` and bindings

`render()` returns an `html` tagged template. Lit parses it once and on each update changes only the
values in `${…}`. The prefix before an expression decides what it binds to
(<https://lit.dev/docs/templates/expressions/>):

| Syntax            | Binds to            | Example from this repo                       |
| ----------------- | ------------------- | -------------------------------------------- |
| `${x}` in content | text or a template  | `${this._slots.has() ? nothing : this.text}` |
| `attr=${x}`       | an attribute        | `type=${this.type}`                          |
| `?attr=${x}`      | a boolean attribute | `?disabled=${this.disabled}`                 |
| `.prop=${x}`      | a DOM property      | `.value=${this.value}` (`TextInput.ts`)      |
| `@event=${fn}`    | an event listener   | `@click=${this._toggle}` (`Checkbox.ts`)     |

**`nothing`** is a special value: in an attribute it removes the attribute, and in content it renders
nothing at all. Button uses it to drop `aria-label` when visible text names the button:

```ts
aria-label=${name ?? nothing}
```

Listeners bound with `@` are automatically bound to the component, so `this` inside `_toggle` is the
element (<https://lit.dev/docs/components/events/>).

### Directives used here

A **directive** is a helper function you call inside a template to change how a value is applied
(<https://lit.dev/docs/templates/directives/>):

| Directive   | What it does                                                                          | Used in                       |
| ----------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| `ifDefined` | sets the attribute if the value is defined, removes it if `undefined` or `null`       | Button, TextInput, others     |
| `classMap`  | turns `{ name: boolean }` into a `class` list; must be the only expression in `class` | Button, Checkbox, others      |
| `styleMap`  | turns an object into inline styles; must be the only expression in `style`            | ColorSwatch, Isotype, Texture |

`Icon.ts` and `Title.ts` also use **static expressions** from `lit/static-html.js`: `unsafeStatic`
puts a tag name into the template before Lit parses it, so `Title` can render `<h1>`…`<h6>` from one
template. Lit's docs warn that the string must be developer-controlled, never user input, because it is
parsed as HTML with no sanitizing (<https://lit.dev/docs/templates/expressions/#static-expressions>).
Both components build the tag from a fixed pattern (`h${level}` after checking 1–6; a Phosphor tag
name derived from `name`).

### The update cycle

When a reactive property changes, Lit does not re-render immediately. It schedules one update and runs
it at **microtask timing**, before the next paint, so several changes in a row cause one render
(<https://lit.dev/docs/components/lifecycle/>). The order is:

1. `requestUpdate()` (called for you when a property changes)
2. `shouldUpdate()` → `willUpdate()` → `update()`, which calls `render()`
3. `firstUpdated()` (first time only) → `updated()`
4. the `updateComplete` promise resolves

Tests use that promise to wait for the DOM to settle:

```ts
md.isActive = sm.isActive = true;
await Promise.all([md.updateComplete, sm.updateComplete]);
```

(from `MenuItem.browser.test.ts`).

Lifecycle hooks this repo uses, so you know where to look:

| Hook                     | Where            | Why                                                             |
| ------------------------ | ---------------- | --------------------------------------------------------------- |
| `updated()`              | `Icon.ts`        | after `name` changes, check the glyph is registered             |
| `updated()`              | `Isotype.ts`     | after `size` changes, set `--gv-isotype-size` on the host       |
| `connectedCallback()`    | `Tooltip.ts`     | add `role="tooltip"` to the host if the page did not set a role |
| `disconnectedCallback()` | `ColorSwatch.ts` | clear a pending timer when the element leaves the page          |

Always call `super.connectedCallback()` / `super.disconnectedCallback()` when you override them; Lit
does its own work there.

### Registering and typing the tag

`@customElement('gv-button')` on the class calls `customElements.define` for you. Each component file
ends by telling TypeScript which class a tag maps to (<https://lit.dev/docs/components/defining/>):

```ts
declare global {
	interface HTMLElementTagNameMap {
		'gv-button': Button;
	}
}
```

With that, `document.querySelector('gv-button')` is typed as `Button`, not as a plain `Element`.

### Lit features this repo does not use

You will not find these in `src/lib/components/`. They are fine to learn about, but adding one is a
design decision, not a routine change:

- `@query` / `@queryAll` decorators (components use `this.shadowRoot?.querySelector` instead)
- `firstUpdated()` and `willUpdate()` hooks
- the `repeat`, `live` and `ref` directives
- form-associated custom elements (`static formAssociated`)
- `delegatesFocus` and other `shadowRootOptions`
- `::part()` and `::slotted()` styling

## Where to see it in Button.ts

- `@customElement('gv-button')` registers the tag; `HTMLElementTagNameMap` types it.
- Fourteen `@property` fields; `disabled` and `name` reflect. None is named after an ARIA attribute:
  `label` and `description` carry the name and description, so the built-in `ariaLabel` reflection
  on the host is left alone.
- `render()` uses a content binding, an attribute binding, `?disabled`, `classMap`, `ifDefined` and
  `nothing`.
- It overrides no lifecycle hooks itself. Its base, the `FormControl` mixin, extends
  `connectedCallback`, `disconnectedCallback` and `requestUpdate` and adds the browser's form
  callbacks (chapter 03).
