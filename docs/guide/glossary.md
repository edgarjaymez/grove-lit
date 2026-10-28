# Glossary

> **What you learn here**
>
> - The words that this guide uses, with one meaning for each word.
> - Which word to use when two words can have the same meaning.
> - Where the guide explains each term in context.
>
> **Read first:** nothing. **Time:** 10 minutes for a first look. Then use this page as a
> reference.

Each entry gives the term, its tag and one or two sentences. Then a link goes to the section that
explains the term. The tag is TN for a technical name or TV for a technical verb.
[Style rules](style-rules.md#words) tells how to use them. "Do not use" names a word with the same
meaning. Use the term of the entry in its place. The entries are in alphabetical order in each
group.

To find every place that mentions a term, use [the topic index](topic-index.md).

## Web platform

- **accessible description** (TN) — Extra text that assistive technology reads after the accessible
  name, for example from `aria-describedby`. See
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **accessible name** (TN) — The text that assistive technology announces for a control. See
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **activation behavior** (TN) — The action that the browser runs after a click event, when no
  listener cancelled it. A native submit button submits its form in it. See
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing).
- **ARIA element reflection** (TN) — Element properties, such as `ariaLabelledByElements`, that hold
  element references instead of ID strings. An element reference can point out of a shadow root, but
  not into one. See
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree).
- **ARIA reflection** (TN) — The link between a built-in ARIA property, such as `ariaLabel`, and its
  attribute, such as `aria-label`. See
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection).
- **attribute** (TN) — A name-value pair in the HTML markup, for example `is-selected="true"`.
  Always different from a property. See
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection).
- **browsing context** (TN) — The environment in which the browser shows a document. A document from
  `createHTMLDocument()` has none, so its custom elements do not upgrade. See
  [02 · Web components, Upgrade](02-web-components.md#upgrade).
- **bubbles** (TN) — An event option: the event goes up through the ancestors of its target. See
  [08 · Events, The event rules](08-events.md#the-event-rules).
- **cancelable event** (TN) — An event that a listener can cancel with `preventDefault()`, for
  example `gv-back`. See
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event).
- **`color-scheme`** (TN) — The CSS property that tells the browser which colour schemes an element
  supports. Native widgets use it for their own colours. See
  [13 · Themes and page CSS, Color scheme and native widgets](13-themes-and-page-css.md#color-scheme-and-native-widgets).
- **composed** (TN) — An event option: the event goes through shadow boundaries.
  [Source: MDN, Event.composed](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) See
  [08 · Events, The event rules](08-events.md#the-event-rules).
- **composed path** (TN) — The list of nodes that `event.composedPath()` returns, from the inner
  target to the window. See
  [08 · Events, Event targets across shadow roots](08-events.md#event-targets-across-shadow-roots).
- **constructable stylesheet** (TN) — A `CSSStyleSheet` that script makes. Lit adds each sheet to
  the shadow roots through `adoptedStyleSheets`, so many shadow roots share one sheet. See
  [06 · Styles inside a component, Static styles](06-styles-inside-a-component.md#static-styles).
- **custom element** (TN) — An HTML element that a class defines. Its tag must contain a hyphen.
  [Source: WHATWG HTML, Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#upgrades)
  See [02 · Web components, Custom elements](02-web-components.md#custom-elements).
- **custom property** (TN) — A CSS property with a name that starts with `--`, for example
  `--soft-grid-8`. Custom properties inherit into shadow roots, so the tokens get to each component.
  Do not use: CSS variable. See
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary).
- **custom state** (TN) — A name in `ElementInternals.states` that CSS selects with `:state(name)`.
  See [10 · Forms, ElementInternals](10-forms.md#elementinternals).
- **Declarative Shadow DOM** (TN) — A `<template shadowrootmode>` element in HTML that the HTML
  parser turns into a shadow root. See
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom).
- **default button** (TN) — The first submit button of a form in tree order. Enter in a text field
  activates it. See [10 · Forms, Implicit submission](10-forms.md#implicit-submission).
- **default slot** (TN) — The slot without a `name`. See
  [02 · Web components, Slots](02-web-components.md#slots).
- **delegated listener** (TN) — One listener on an ancestor, for example a form, that handles the
  events of many children. See [08 · Events, Events on a form](08-events.md#events-on-a-form).
- **dispatch** (TV) — Send an event from an element. See
  [08 · Events, The event rules](08-events.md#the-event-rules).
- **element reference** (TN) — An element object, not an ID string, in an ARIA property such as
  `ariaLabelledByElements`. Refer to "ARIA element reflection". See
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree).
- **`ElementInternals`** (TN) — The object from `attachInternals()` that connects a custom element
  to forms and to ARIA. See [10 · Forms, ElementInternals](10-forms.md#elementinternals).
- **field that blocks implicit submission** (TN) — A text-like `<input>` in a form. When a form has
  two or more of them and no submit button, Enter does nothing. See
  [10 · Forms, Implicit submission](10-forms.md#implicit-submission).
- **focus fixup rule** (TN) — The rule that the browser moves focus to the viewport when the focused
  element becomes disabled or hidden. See [10 · Forms, Self-disable](10-forms.md#self-disable).
- **`:focus-visible`** (TN) — A CSS pseudo-class that matches when the browser decides that the user
  must see focus, for example keyboard focus on a button. See
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism).
- **forced colours mode** (TN) — A browser mode that replaces author colours with the system colours
  of the user. It also sets `box-shadow` to `none`. See
  [09 · Accessibility, Forced colours](09-accessibility.md#forced-colours);
  [14 · The focus ring, Forced colours](14-the-focus-ring.md#forced-colours).
- **form callback** (TN) — One of `formAssociatedCallback`, `formDisabledCallback`,
  `formResetCallback` and `formStateRestoreCallback`, which the browser calls on a form-associated
  custom element. See [10 · Forms, The form callbacks](10-forms.md#the-form-callbacks).
- **form owner** (TN) — The `<form>` that a control belongs to. See
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today).
- **form-associated custom element** (TN) — A custom element with `static formAssociated = true`
  that takes part in a form.
  [Source: WHATWG HTML, Form-associated custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-elements)
  See [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements).
- **gamut mapping** (TV) — Change a colour so that it fits in a smaller colour gamut. See
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut).
- **generic element** (TN) — An element with the ARIA role `generic`. A host with no role is one,
  and WAI-ARIA 1.2 does not permit a name on it. A host with `aria-label` is a "named generic
  element". See
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **guaranteed-invalid value** (TN) — The initial value of a custom property. With this value,
  `var()` uses its fallback. See
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring).
- **host** (TN) — The custom element itself in the page, for example `<gv-button>`. Do not use:
  wrapper, outer element. See [02 · Web components, Shadow DOM](02-web-components.md#shadow-dom).
- **hydrate** (TV) — Connect the client code to a shadow root that a server rendered, with no new
  render. The noun is "hydration". See
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server).
- **ID reference** (TN) — An attribute, such as `for` or `aria-labelledby`, that names a different
  element by its `id`. It works only inside one tree. See
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree).
- **IME composition** (TN) — Text input through an input method editor. During it,
  `KeyboardEvent.isComposing` is `true`. See
  [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime).
- **implicit submission** (TN) — Enter in a text field submits the form.
  [Source: WHATWG HTML, Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission)
  See [10 · Forms, Implicit submission](10-forms.md#implicit-submission).
- **invalid at computed-value time** (TN) — The state of a declaration whose `var()` value does not
  exist or is not valid. Then the property acts as `unset`.
  [Source: CSS Variables 1, invalid at computed-value time](https://www.w3.org/TR/css-variables-1/#invalid-at-computed-value-time)
  See
  [06 · Styles inside a component, Invalid at computed-value time](06-styles-inside-a-component.md#invalid-at-computed-value-time).
- **labelable element** (TN) — An element that a `<label>` can name: a native form control or a
  form-associated custom element. See
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **labeled control** (TN) — The element that a `<label>` names, from its `for` attribute or from
  its first labelable descendant. See
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **light DOM** (TN) — The children that the page puts inside the host. Do not use: outer DOM. See
  [02 · Web components, Slots](02-web-components.md#slots).
- **`light-dark()`** (TN) — A CSS function that gives its first value in a light colour scheme and
  its second value in a dark colour scheme. See
  [13 · Themes and page CSS, The light-dark function](13-themes-and-page-css.md#the-light-dark-function).
- **live region** (TN) — An element whose changes the browser reports to assistive technology, with
  no move of focus. See [09 · Accessibility, Live regions](09-accessibility.md#live-regions).
- **microtask** (TN) — A job that the browser runs when the script stack becomes empty, before the
  next task. See
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task).
- **microtask checkpoint** (TN) — The point where the browser runs the queued microtasks. After a
  trusted click, a checkpoint comes between two listeners. See
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing).
- **named slot** (TN) — A slot with a `name`. Light DOM content goes into it through the `slot`
  attribute. See [02 · Web components, Slots](02-web-components.md#slots).
- **OKLCH** (TN) — A colour space with lightness, chroma and hue. Every Grove colour token uses it.
  [Source: CSS Color 4, OKLab and OKLCH](https://www.w3.org/TR/css-color-4/#ok-lab) See
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut).
- **phrasing content** (TN) — Text and the elements inside text, as HTML defines it, for example
  `span`, `strong` and `a`. See
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots).
- **politeness** (TN) — How a live region interrupts the user: `polite` or `assertive`. See
  [09 · Accessibility, Live regions](09-accessibility.md#live-regions).
- **property** (TN) — A JavaScript field on the element object, for example `isSelected`. Always
  different from an attribute. Do not use: prop, except in the fixed terms "fallback prop" and
  "required props". See
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties).
- **Reference Target** (TN) — A proposal, not shipped, that lets a shadow root forward ID references
  to an element inside it. See
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree).
- **register** (TV) — Connect a tag to a class with `customElements.define()` or `@customElement`.
  The noun is "registration". Do not use: declare. See
  [03 · Lit essentials, Tag registration and types](03-lit-essentials.md#tag-registration-and-types).
- **retarget** (TV) — The browser changes `event.target` to the host when an event leaves a shadow
  root. [Source: WHATWG DOM, retarget](https://dom.spec.whatwg.org/#retarget) See
  [08 · Events, Event targets across shadow roots](08-events.md#event-targets-across-shadow-roots).
- **shadow boundary** (TN) — The edge between a shadow root and the tree around it. See
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary).
- **shadow cascade** (TN) — The cascade rule for two trees: normal declarations from the page win,
  and important declarations from the shadow root win. See
  [06 · Styles inside a component, The shadow cascade](06-styles-inside-a-component.md#the-shadow-cascade).
- **shadow DOM** (TN) — The web platform feature that gives an element a shadow root, with its own
  DOM tree and its own styles. See
  [02 · Web components, Shadow DOM](02-web-components.md#shadow-dom).
- **shadow root** (TN) — The private DOM tree that a component renders into. Page CSS does not go
  into it. Do not use: shadow, alone.
  [Source: WHATWG DOM, Shadow trees](https://dom.spec.whatwg.org/#shadow-trees) See
  [02 · Web components, Shadow DOM](02-web-components.md#shadow-dom).
- **skip link** (TN) — A link, first in the page, that moves focus past repeated blocks. Grove has
  none on `main`. See
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links).
- **slot** (TN) — A `<slot>` element: a place in the shadow root where light DOM content shows. See
  [02 · Web components, Slots](02-web-components.md#slots).
- **slot forwarding** (TN) — A `<slot>` element that a parent puts in the light DOM of a child, so
  that page content goes one level deeper. See
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots).
- **tag** (TN) — The name of a custom element, for example `gv-button`. See
  [02 · Web components, Custom elements](02-web-components.md#custom-elements).
- **task** (TN) — A unit of work in the event loop, for example a `setTimeout()` callback. It runs
  after the current dispatch ends. See
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task).
- **trusted event** (TN) — An event that the browser makes from user input. Its `isTrusted` is
  `true`. See
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events).
- **undefined element** (TN) — An element with a custom tag that the browser parsed before the
  registration of its class. It shows only its light DOM. See
  [02 · Web components, Upgrade](02-web-components.md#upgrade).
- **untrusted event** (TN) — An event that script makes, for example with `el.click()` or
  `dispatchEvent()`. Its `isTrusted` is `false`. See
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events).
- **upgrade** (TV) — The browser turns an element that is already in the page into an instance of
  its class. See [02 · Web components, Upgrade](02-web-components.md#upgrade).
- **validation anchor** (TN) — The inner element that `setValidity()` names. The browser can focus
  it to show a validation message. See
  [10 · Forms, Hidden required fields](10-forms.md#hidden-required-fields).
- **WCAG 2.2 AA** (TN) — The accessibility target of Grove: the success criteria of levels A and AA
  in WCAG 2.2. [Source: W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/) See
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa).
- **wide gamut** (TN) — Colours outside sRGB that only a Display P3 or Rec. 2020 screen can show.
  See [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut).

## Lit

- **accessor** (TN) — A getter and setter pair for a property. Lit puts one on the prototype for
  each reactive property. See
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties).
- **binding** (TN) — An expression in a template: a child, an attribute, a `.property`, a `?boolean`
  or an `@event` binding. The prefix tells what the binding sets. See
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings).
- **controller** (TN) — A Lit reactive controller: an object that connects to the lifecycle of the
  host with `addController()`. `SlotContent` is one. See
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins);
  [07 · Slots, Reactive controllers](07-slots.md#reactive-controllers).
- **decorator** (TN) — A function that TypeScript applies to a class or to a class member, for
  example `@customElement` and `@property`. Grove uses the TypeScript experimental decorators. See
  [03 · Lit essentials, The decorator setup](03-lit-essentials.md#the-decorator-setup).
- **directive** (TN) — A Lit function that controls a binding, for example `classMap`, `ifDefined`
  and `styleMap`. See [03 · Lit essentials, Directives](03-lit-essentials.md#directives).
- **internal state** (TN) — A reactive field with `@state`. It has no attribute, and the manifest
  leaves it out. See [03 · Lit essentials, Internal state](03-lit-essentials.md#internal-state).
- **lifecycle hook** (TN) — A method that Lit or the browser calls at a fixed point, for example
  `connectedCallback()`, `willUpdate()` and `updated()`. See
  [03 · Lit essentials, Lifecycle hooks](03-lit-essentials.md#lifecycle-hooks).
- **Lit** (TN) — A small library for custom elements. A Lit component extends `LitElement`. See
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators).
- **Lit Labs** (TN) — Lit packages that are not stable yet, for example `@lit-labs/ssr`. See
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server).
- **Lit SSR** (TN) — The Lit Labs package `@lit-labs/ssr`, which renders Lit components to HTML on a
  server. Grove does not support it on `main` (#56). See
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server).
- **`LitElement`** (TN) — The base class of Lit. Each Grove component extends it. See
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators).
- **mixin** (TN) — A function that takes a class and returns a subclass, for example `FormControl`
  in PR #68. See
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins).
- **`nothing`** (TN) — A Lit value that renders nothing in a child binding and removes the attribute
  in an attribute binding. See
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings).
- **observed attribute** (TN) — An attribute that Lit reads into a reactive property. Its name is
  the property name in lowercase, or the value of the `attribute` option. See
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection).
- **reactive property** (TN) — A property that Lit watches with `@property`. When its value changes,
  Lit renders the component again. See
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties).
- **reflect** (TV) — Copy a property value to its attribute. The `@property` option `reflect: true`
  turns it on. See
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection).
- **render** (TV) — Make the DOM of the shadow root from the template. See
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings).
- **static expression** (TN) — A value from `lit/static-html.js`, such as `unsafeStatic()`, that Lit
  puts into the template text before it parses it, for example a tag name. It must never come from
  user input. See [03 · Lit essentials, Directives](03-lit-essentials.md#directives).
- **`static styles`** (TN) — The class field that holds the CSS of a Lit component. Lit evaluates it
  one time for each class, and all instances share it. See
  [06 · Styles inside a component, Static styles](06-styles-inside-a-component.md#static-styles).
- **template** (TN) — The `html` tagged template that `render()` returns. Lit updates only the
  `${…}` parts when values change. See
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings).
- **update cycle** (TN) — The batched work that Lit does after a property changes: `shouldUpdate()`,
  `willUpdate()`, `update()` with `render()`, then `firstUpdated()` and `updated()`. Many changes
  cause one render. See
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle).
- **`updateComplete`** (TN) — A promise on each Lit element that resolves when the current update
  ends. Tests wait for it before they read the DOM. See
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle).
- **`useDefault`** (TN) — A Lit property option: the default value does not reflect, and a removed
  attribute restores the default. See
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection).

## Grove

- **alias** (TN) — A token whose value is a reference to a different token, written in curly braces.
  See
  [11 · Design tokens, From JSON path to CSS name](11-design-tokens.md#from-json-path-to-css-name).
- **alias chain** (TN) — The path from a semantic token through its aliases to a raw value. See
  [11 · Design tokens, From JSON path to CSS name](11-design-tokens.md#from-json-path-to-css-name).
- **aurora** (TN) — The highlight state of a surface, for hover and press. It is not a container.
  See
  [12 · Surfaces and elevation, Aurora is a state](12-surfaces-and-elevation.md#aurora-is-a-state).
- **barrel** (TN) — An `index.ts` file that exports other modules, for example
  `src/lib/components/index.ts`. See
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists).
- **`componentReset`** (TN) — The style fragment that each component puts first in `static styles`.
  It resets browser defaults in the shadow root, hides a host that has `hidden` and shortens motion
  under reduced motion. See
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset).
- **composite** (TN) — A component that renders one or more other Grove tags in its shadow root. See
  [05 · Component catalogue, Leaves and composites](05-component-catalogue.md#leaves-and-composites).
- **composite token** (TN) — A typography token that holds a full `font` shorthand, for example a
  `--typography-*` token. See
  [11 · Design tokens, Typography composites](11-design-tokens.md#typography-composites).
- **container slot** (TN) — A slot that accepts any content, form controls included. See
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots).
- **currentColor fallback** (TN) — The `gv-texture` pattern that paints with `currentColor`, so that
  an invalid tint inherits the default colour and does not become black. See
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback).
- **default ring** (TN) — The private `--_ring-default` that a component sets when it nearly always
  sits on one surface. See
  [14 · The focus ring, The private default ring](14-the-focus-ring.md#the-private-default-ring).
- **depth** (TN) — The level of a surface: ground, terrace, path or summit. See
  [12 · Surfaces and elevation, Tracks and depths](12-surfaces-and-elevation.md#tracks-and-depths).
- **`--_drop`** (TN) — The private custom property that holds the own shadow of a control, so that
  the focus ring paints on top of it. Set `--_drop`, never `box-shadow`. See
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism).
- **event map** (TN) — A TypeScript interface that maps event names to event types, for example
  `GroveEventMap`. See [08 · Events, Event types](08-events.md#event-types).
- **fallback prop** (TN) — The property that a component shows when its slot is empty, for example
  `text`. See [07 · Slots, Prop or slot](07-slots.md#prop-or-slot).
- **focus ring** (TN) — The visible focus indicator: a `box-shadow` that the `focusRing` fragment
  draws. Do not use: outline, focus style. See
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism).
- **`focusRing`** (TN) — The style fragment that draws the focus ring on
  `.gv-focusable:focus-visible`. See
  [06 · Styles inside a component, The focus ring fragment](06-styles-inside-a-component.md#the-focus-ring-fragment).
- **form role** (TN) — The `formRole()` hook of the `FormControl` mixin (PR #68). It returns
  `'submit'`, `'reset'`, `'field'` or `null`. See
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin).
- **`FormControl`** (TN) — The mixin in PR #68 that makes a component form-associated and owns its
  `disabled` property. See [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin).
- **glyph** (TN) — One Phosphor icon, which a `ph-*` custom element draws. The app must import each
  glyph that it shows. See
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs).
- **glyph warning** (TN) — The development warning, with the prefix `[grove]`, that names the import
  for a glyph that is not registered. See
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs).
- **`gv-*`** (TN) — The prefix of each Grove tag, for example `gv-button`, and of each Grove event,
  for example `gv-change`. See
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names).
- **`gv-focusable`** (TN) — The class on the inner element that takes focus. The `focusRing`
  fragment selects it. See [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism).
- **layer** (TN) — One of the five parts of the repo: tokens, page CSS, components, metadata and
  manifest, and tools. See
  [00 · The whiteboard, The five layers](00-the-whiteboard.md#the-five-layers).
- **layout grid** (TN) — The `--grid-*` tokens: columns, margins and gutters for each breakpoint.
  See [11 · Design tokens, Spacing and grids](11-design-tokens.md#spacing-and-grids).
- **leaf** (TN) — A component that renders no other Grove tag. See
  [05 · Component catalogue, Leaves and composites](05-component-catalogue.md#leaves-and-composites).
- **ledger** (TN) — `components-since.json`, the file that records the first version of each
  component. Also: release ledger. See
  [19 · Release, The release ledger](19-release.md#the-release-ledger).
- **link mode** (TN) — A `gv-button` with `href` that renders a real `<a>` (PR #68 proposal). See
  [10 · Forms, Link mode](10-forms.md#link-mode).
- **literal** (TN) — A raw value in component code, such as `rgba(38, 77, 40, 0.1)`, in place of a
  token. See [11 · Design tokens, Literals and tokens](11-design-tokens.md#literals-and-tokens).
- **metadata** (TN) — The `*.metadata.ts` object, for example `ButtonMetadata`, that describes a
  component for tools and AI assistants. See
  [15 · Metadata and the manifest, Component metadata](15-metadata-and-the-manifest.md#component-metadata).
- **nesting rules** (TN) — The eight composition rules that tell which surface can go inside which
  surface. See
  [12 · Surfaces and elevation, The nesting rules](12-surfaces-and-elevation.md#the-nesting-rules).
- **OS dark** (TN) — The dark theme that applies when the operating system prefers dark and the page
  sets no theme. The `os-dark` browser instance tests it. Do not use: OS-dark. See
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file).
- **package entry** (TN) — `src/lib/index.ts`, the file from which Vite builds `dist/index.js`. It
  is the second export list, next to the barrel. See
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists).
- **page CSS** (TN) — The light-DOM CSS that `grove.css` imports for the page itself. Do not use:
  page-level CSS, except in the heading of chapter 13. See
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css).
- **painted box** (TN) — The element that has the background and the shadow. It is not always the
  host. See
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component).
- **phrasing-only slot** (TN) — A slot that accepts only text and phrasing content. See
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots).
- **primitive token** (TN) — A token that holds a raw value, for example `--color-gray-50`. See
  [11 · Design tokens, Primitive and semantic colours](11-design-tokens.md#primitive-and-semantic-colours).
- **private custom property** (TN) — A custom property with the prefix `--_` that only the component
  uses. It can change in any release. See
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties).
- **public custom property** (TN) — A custom property with the prefix `--gv-` that is part of the
  API and has a `@cssprop` tag. See
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties).
- **resting surface** (TN) — A surface that is not an aurora: Ground, a terrace, a path or a summit.
  See
  [12 · Surfaces and elevation, Aurora is a state](12-surfaces-and-elevation.md#aurora-is-a-state).
- **ring reset** (TN) — The rule `[data-theme] { --gv-focus-ring: initial; }` in `globals.css`. It
  stops the ring colour of the outer surface at a theme island. See
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring).
- **runtime map** (TN) — The diagram that shows what happens in the browser when a page uses Grove.
  See [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map).
- **self-disable** (TN) — A submit `gv-button` sets its own `disabled` after a submission that it
  started (PR #68 proposal). See [10 · Forms, Self-disable](10-forms.md#self-disable).
- **semantic token** (TN) — A token that names a role and points at a primitive token, for example
  `--semantic-color-surface-ground`. Components use semantic tokens. See
  [11 · Design tokens, Primitive and semantic colours](11-design-tokens.md#primitive-and-semantic-colours).
- **`SlotContent`** (TN) — The Grove reactive controller that records whether a slot has real
  content, so that the fallback prop shows only when the slot is empty. See
  [07 · Slots, The SlotContent controller](07-slots.md#the-slotcontent-controller).
- **soft grid** (TN) — The spacing scale `--soft-grid-*`, in rem. The number is the size in pixels
  at a 16 px root. See
  [11 · Design tokens, Spacing and grids](11-design-tokens.md#spacing-and-grids).
- **surface** (TN) — A painted area with a known background, text colour and ring colour. Each
  surface has a track and a depth. See
  [12 · Surfaces and elevation, Tracks and depths](12-surfaces-and-elevation.md#tracks-and-depths).
- **surface class** (TN) — A `.gv-surface-*` class in `surfaces.css` that paints a surface and sets
  its text colour and its ring colour. See
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes).
- **system map** (TN) — The diagram that shows the files you edit, the tools that read them and the
  files that go to npm. See [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard).
- **text-on pair** (TN) — A text token and the surface token that it goes on, as the contrast gate
  measures them. See
  [12 · Surfaces and elevation, Text on a surface](12-surfaces-and-elevation.md#text-on-a-surface).
- **theme** (TN) — Light or dark. See
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file).
- **theme island** (TN) — An element with `data-theme` that sets its own theme, inside a page in the
  other theme. See
  [13 · Themes and page CSS, Theme islands](13-themes-and-page-css.md#theme-islands).
- **token** (TN) — A named design value, for example a colour, a spacing or a type style. Grove
  publishes each token as a custom property in `tokens.css`. Also: design token. See
  [11 · Design tokens, What a token is](11-design-tokens.md#what-a-token-is).
- **token gap** (TN) — A design need that no token covers. See
  [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps).
- **tools** (TN) — The tests, Storybook, the build and the release, which check the library and
  send it to npm. See [00 · The whiteboard, The five layers](00-the-whiteboard.md#the-five-layers).
- **track** (TN) — A colour family of surfaces: accent, brand, danger, gray, information or success.
  See
  [12 · Surfaces and elevation, Tracks and depths](12-surfaces-and-elevation.md#tracks-and-depths).
- **tree rule** (TN) — The rule that form association follows the DOM tree, not the slots (#49 C1).
  See [10 · Forms, The tree rule](10-forms.md#the-tree-rule).
- **visually hidden text** (TN) — Text that a screen reader announces but that does not show, from
  the `.visually-hidden` class or the `visuallyHidden` fragment. See
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links).

## The package and the tools

- **a11y canary** (TN) — A story with planted axe failures that must fail in every theme. Its runner
  inverts the result. See
  [09 · Accessibility, The a11y canary](09-accessibility.md#the-a11y-canary).
- **a11y check** (TN) — The axe check that the Storybook a11y addon runs on each story. An "a11y
  gate" is an a11y check with `test: 'error'`, so that a violation fails the run. See
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook).
- **analyzer** (TN) — The tool `@custom-elements-manifest/analyzer`, which reads the component
  sources and writes the manifest. See
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built).
- **APCA** (TN) — A supplementary contrast measure. It is not a W3C standard. See
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate).
- **axe** (TN) — The rule engine that the Storybook a11y addon runs on each story. See
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook).
- **back-date** (TV) — Give a new ledger entry the version of the first git tag that contains the
  component directory. See
  [19 · Release, Dates from release tags](19-release.md#dates-from-release-tags).
- **browser instance** (TN) — One browser run of a test project, for example the `os-dark` instance.
  See [16 · Storybook, How a test picks a theme](16-storybook.md#how-a-test-picks-a-theme).
- **browser mode** (TN) — The Vitest mode that runs the tests in a real Chromium, which Playwright
  drives. See [17 · Tests, The four test projects](17-tests.md#the-four-test-projects).
- **change detector** (TN) — A test that pins the current values of a table, so that each change
  shows in the diff. See [17 · Tests, Change detectors](17-tests.md#change-detectors).
- **churn** (TN) — A change to the generated `tokens.css` with no change in a token source. See
  [11 · Design tokens, Churn in the generated file](11-design-tokens.md#churn-in-the-generated-file).
- **contrast gate** (TN) — The unit test `contrast.test.ts` that measures the colour tokens against
  WCAG 2.2 AA and APCA floors. See
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate).
- **declaration merging** (TN) — The TypeScript rule that joins two declarations with the same name,
  for example two interfaces, into one type. See
  [08 · Events, Event types](08-events.md#event-types).
- **dev server** (TN) — The Storybook server of `pnpm storybook`, which serves each module as it is.
  See [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds).
- **development warning** (TN) — A console warning that shows only in a development build, when
  `warningsEnabled()` in `src/lib/utils/dev.ts` returns `true`. See
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule).
- **DTCG** (TN) — The Design Tokens Community Group format, the JSON format of the token files
  (`$value`, `$type`).
  [Source: DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) See
  [11 · Design tokens, DTCG types](11-design-tokens.md#dtcg-types).
- **`exports`** (TN) — The `package.json` field that lists each path that an app can import. See
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields).
- **external** (TN) — A dependency that the bundle imports but does not contain, for example `lit`.
  See
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build).
- **flaky test** (TN) — A test that fails in some runs and passes in others with the same code. See
  [17 · Tests, Flaky tests](17-tests.md#flaky-tests).
- **framework types** (TN) — The file `dist/types/astro.d.ts`, which
  `scripts/generate-framework-types.mjs` writes. It gives Astro the attribute types of each tag.
  Chapter 20 calls it the Astro types. See
  [15 · Metadata and the manifest, Framework types](15-metadata-and-the-manifest.md#framework-types);
  [20 · Grove in an app, Astro types](20-grove-in-an-app.md#astro-types).
- **generated AI index** (TN) — The TOON files in `src/.ai/`, which the maintainer regenerates.
  Nobody edits them by hand. See
  [15 · Metadata and the manifest, The generated AI index](15-metadata-and-the-manifest.md#the-generated-ai-index).
- **git-ignored** (TN) — A path that `.gitignore` excludes, so git does not track it. See
  [01 · Repo map, The tree](01-repo-map.md#the-tree).
- **JSDoc tag** (TN) — A line such as `@slot`, `@fires` or `@cssprop` in the comment above a class.
  The analyzer reads it. See
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads).
- **library mode** (TN) — The Vite build mode that writes a package for other projects, not an app.
  See
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build).
- **manifest** (TN) — `custom-elements.json`, which the analyzer writes. It describes the elements,
  attributes, events, slots and CSS properties of the package. Also: custom elements manifest. See
  [15 · Metadata and the manifest, The custom elements manifest](15-metadata-and-the-manifest.md#the-custom-elements-manifest).
- **modifier** (TN) — A context in the resolver that swaps token files. Grove has three: `theme`,
  `breakpoint` and `media`. See
  [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers).
- **mutation check** (TN) — A small fault that you put in the code on purpose, to prove that a test
  can fail. See [17 · Tests, Mutation checks](17-tests.md#mutation-checks).
- **parity test** (TN) — A test that makes sure that two copies of the same rule or list agree. See
  [17 · Tests, Tests that keep two copies in step](17-tests.md#tests-that-keep-two-copies-in-step).
- **peer dependency** (TN) — A package that the app must install next to Grove, for example `lit`.
  Grove uses it but does not contain it. See
  [20 · Grove in an app, Install](20-grove-in-an-app.md#install);
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields).
- **permutation** (TN) — One combination of modifier contexts that Terrazzo writes into one CSS
  block. See [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers).
- **Playwright** (TN) — The browser automation tool that drives Chromium in the Vitest browser
  tests. See [17 · Tests, The test helpers](17-tests.md#the-test-helpers).
- **pnpm** (TN) — The package manager of this repo. See
  [01 · Repo map, The package and the tools](01-repo-map.md#the-package-and-the-tools).
- **`prepack`** (TN) — The package script that runs `check-ledger`, then `pnpm build`, then
  `publint`. The package manager runs it before it packs. See
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script).
- **`publint`** (TN) — A tool that checks that `exports`, `types` and `files` point to files that
  exist and have the correct form. See
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script).
- **resolver** (TN) — The file `main.resolver.json` that lists the token sets, the modifiers and the
  order of resolution. See [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline).
- **set** (TN) — A group of token files in the resolver that always loads. See
  [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline).
- **side-effect import** (TN) — An import with no names, which runs a module only for what it does
  when it loads, for example `import '../Icon/Icon.js';`. It registers a tag. See
  [05 · Component catalogue, How a composite registers its children](05-component-catalogue.md#how-a-composite-registers-its-children).
- **`sideEffects`** (TN) — The `package.json` field that tells a bundler which modules it must keep,
  also when nothing uses their exports. See
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields).
- **smoke test** (TN) — A quick test that opens each story of the static Storybook build and checks
  each registration. See
  [16 · Storybook, The static smoke test](16-storybook.md#the-static-smoke-test).
- **static build** (TN) — The production build of Storybook in `storybook-static/`, which Vercel
  deploys. See [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds).
- **stories file** (TN) — A `*.stories.ts` file in Component Story Format, next to its component.
  See [16 · Storybook, A story file](16-storybook.md#a-story-file).
- **story** (TN) — One named export of a stories file. It shows the component in one state. See
  [16 · Storybook, A story file](16-storybook.md#a-story-file).
- **Storybook** (TN) — The tool that shows each story in a browser and runs the a11y checks. Grove
  uses Storybook 10 with `@storybook/web-components-vite`. See
  [16 · Storybook, A story file](16-storybook.md#a-story-file).
- **Terrazzo** (TN) — The tool that turns the DTCG token JSON into `tokens.css`. `pnpm build-tokens`
  runs it. See [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline).
- **test project** (TN) — One entry of `test.projects` in `vite.config.ts`, with its own files and
  environment: `unit`, `browser`, `storybook` or `a11y-canary`. Do not use: Vitest project. See
  [17 · Tests, The four test projects](17-tests.md#the-four-test-projects).
- **TOON** (TN) — A compact text format for structured data. The generated AI index uses it. See
  [01 · Repo map, Generated but committed](01-repo-map.md#generated-but-committed).
- **trusted input** (TN) — Input that Playwright sends as real user input, so that the browser marks
  each event as trusted. See [17 · Tests, Trusted input](17-tests.md#trusted-input).
- **type alias** (TN) — A TypeScript name for a type, for example `ButtonSize`. The manifest plugin
  replaces it with its union. See
  [04 · Anatomy of a component, Stop 2 Local types](04-anatomy-of-a-component.md#stop-2-local-types).
- **type fixture** (TN) — A TypeScript file that only `pnpm check` reads, with lines that must
  compile and lines that must fail. See
  [17 · Tests, The test helpers](17-tests.md#the-test-helpers).
- **Vite** (TN) — The build tool that bundles the library in library mode. See
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build).
- **Vitest** (TN) — The test runner. Its four test projects are in `vite.config.ts`. See
  [17 · Tests, The four test projects](17-tests.md#the-four-test-projects).
- **watch mode** (TN) — The Vitest mode that runs the tests again when a file changes. See
  [17 · Tests, Watch mode and agents](17-tests.md#watch-mode-and-agents).

## Process

- **CI** (TN) — Continuous integration. This repo has none, so nothing runs on a PR or on a push.
  See [19 · Release, No CI](19-release.md#no-ci).
- **decision code** (TN) — A short code for a requirement or a decision, always written with its
  issue number, for example `#49 C1`. See
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes).
- **detached head** (TN) — A git state where `HEAD` points at a commit and not at a branch. See
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally).
- **drift** (TN) — A difference between two sources that must agree, for example a document and the
  code. See [23 · Known drift, The rule](23-known-drift.md#the-rule).
- **epic** (TN) — An issue that groups specs into one PR group. See
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves).
- **FR** (TN) — A functional requirement in a spec, for example `#14 FR-10`. See
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes).
- **house rule** (TN) — A convention of this repo that a reviewer checks in each change. See
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names).
- **lab** (TN) — A syllabus exercise about open work. It pins the item to a commit. See
  [Style rules, When open work lands](style-rules.md#when-open-work-lands).
- **Lit box** (TN) — A `> [!NOTE]` callout that explains one Lit idea at the place where Grove uses
  it. See [Style rules, Lit boxes](style-rules.md#lit-boxes).
- **merge train** (TN) — The recommended merge order of the open PRs. Also: merge order. See
  [21 · House rules and how work moves, Merge order](21-house-rules-and-how-work-moves.md#merge-order).
- **mergeable** (TN) — The GitHub state that tells only that a PR had no conflict with `main` when
  GitHub last computed it. It does not tell that the tests pass. See
  [21 · House rules and how work moves, Mergeable and approved](21-house-rules-and-how-work-moves.md#mergeable-and-approved).
- **modify/delete conflict** (TN) — A git conflict where one side changed a file and the other side
  deleted it. See
  [22 · Cookbook, Recipe 16 Rebase the guide over merged PRs](22-cookbook.md#recipe-16-rebase-the-guide-over-merged-prs).
- **Needs Figma Spec** (TN) — A GitHub label: the item waits for an answer from the Figma design.
  See
  [21 · House rules and how work moves, Needs Figma Spec](21-house-rules-and-how-work-moves.md#needs-figma-spec).
- **net diff** (TN) — The difference between the base and the head of a PR, without the history of
  its commits (`gh pr diff`). See
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally).
- **OD** (TN) — An open decision in a spec, for example `#40 OD2`. See
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes).
- **open work** (TN) — An open PR or an open issue. See
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion).
- **open-work box** (TN) — A `> [!IMPORTANT]` callout that connects a concept to an item of open
  work and tells what changes when it lands. See
  [Style rules, Open-work boxes](style-rules.md#open-work-boxes).
- **order of trust** (TN) — The order that settles drift: the code on `main`, then `tokens.css`,
  then `DESIGN_SYSTEM.md`. See [23 · Known drift, The rule](23-known-drift.md#the-rule).
- **PR group** (TN) — A set of specs that one PR implements, as epic #54 defines. See
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves).
- **practice branch** (TN) — A local branch for exercises that you delete after use. See
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally).
- **release by hand** (TN) — A release in which a person does each step, because the repo has no CI.
  See [19 · Release, Release by hand](19-release.md#release-by-hand).
- **release notes** (TN) — The text that tells consumers what changed in a version and what they
  must do. See [19 · Release, Release notes](19-release.md#release-notes).
- **release train** (TN) — The order of the versions that shipped and the version that comes next.
  It is not the merge train. See [19 · Release, The release train](19-release.md#the-release-train).
- **spec** (TN) — An issue that describes a change with requirements (FR) and open decisions (OD).
  See
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves).
- **STE** (TN) — Simplified Technical English (ASD-STE100), the rule set that this guide follows.
  See [Style rules, The STE standard](style-rules.md#the-ste-standard).
- **technical name** (TN) — A code identifier, a file name, a product name or a term from the web
  platform. The glossary tags it TN. See [Style rules, Words](style-rules.md#words).
- **technical verb** (TN) — A verb that names a process that a computer does, for example render or
  dispatch. The glossary tags it TV. See [Style rules, Words](style-rules.md#words).
- **wave** (TN) — A step of the roadmap in #54: a set of epics that can go in parallel. See
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions).

## Lit documentation used in this guide

The guide links only to the Lit 3 docs, under `https://lit.dev/docs/v3/`. This table lists each Lit
page and fragment that a chapter links to.

| Page                                                                  | What the guide uses it for                                                                             |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| <https://lit.dev/docs/v3/>                                            | The start page of the Lit 3 docs                                                                       |
| <https://lit.dev/docs/v3/components/defining/>                        | `@customElement`, `customElements.define()` and `HTMLElementTagNameMap`                                |
| <https://lit.dev/docs/v3/components/properties/>                      | Reactive properties, attributes and the property options                                               |
| <https://lit.dev/docs/v3/components/properties/#accessors>            | The accessor that Lit puts on the prototype for each reactive property                                 |
| <https://lit.dev/docs/v3/components/properties/#attributes>           | The `attribute` option, which sets the attribute name                                                  |
| <https://lit.dev/docs/v3/components/properties/#boolean-attributes>   | How a Boolean property reads its attribute                                                             |
| <https://lit.dev/docs/v3/components/properties/#haschanged>           | The `hasChanged` option, which controls change detection                                               |
| <https://lit.dev/docs/v3/components/properties/#reflected-attributes> | The `reflect` option                                                                                   |
| <https://lit.dev/docs/v3/components/properties/#use-default>          | The `useDefault` option                                                                                |
| <https://lit.dev/docs/v3/components/decorators/>                      | The decorator setup: experimental decorators and `useDefineForClassFields`                             |
| <https://lit.dev/docs/v3/components/lifecycle/>                       | The update cycle, the lifecycle hooks and `updateComplete`                                             |
| <https://lit.dev/docs/v3/components/shadow-dom/>                      | The shadow root of a Lit component and its slots                                                       |
| <https://lit.dev/docs/v3/components/styles/>                          | `static styles`, the `css` tag and custom properties                                                   |
| <https://lit.dev/docs/v3/components/events/>                          | Event dispatch, `composed` and listeners                                                               |
| <https://lit.dev/docs/v3/composition/controllers/>                    | Reactive controllers, for example `SlotContent`                                                        |
| <https://lit.dev/docs/v3/composition/mixins/>                         | Class mixins, for example `FormControl` in PR #68                                                      |
| <https://lit.dev/docs/v3/templates/expressions/>                      | Bindings and the `nothing` value                                                                       |
| <https://lit.dev/docs/v3/templates/expressions/#static-expressions>   | Static expressions and `unsafeStatic()`                                                                |
| <https://lit.dev/docs/v3/templates/directives/>                       | The built-in directives: `classMap`, `ifDefined`, `styleMap` and others                                |
| <https://lit.dev/docs/v3/frameworks/react/>                           | Lit elements in a React app                                                                            |
| <https://lit.dev/docs/v3/ssr/overview/>                               | Server rendering with Lit SSR                                                                          |
| <https://lit.dev/docs/v3/ssr/authoring/>                              | Components that must render on a server                                                                |
| <https://lit.dev/docs/v3/ssr/authoring/#lifecycle>                    | The lifecycle hooks that run on a server                                                               |
| <https://lit.dev/docs/v3/ssr/client-usage/>                           | Hydration in the browser                                                                               |
| <https://lit.dev/docs/v3/tools/publishing/>                           | Rules for a published package: Lit stays external, elements define themselves, imports have extensions |
| <https://lit.dev/docs/v3/tools/testing/>                              | Tests in a real browser                                                                                |

## Sources

**Standards**

- [WHATWG HTML, Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html).
  Read 2026-10-27.
- [WHATWG HTML, Form-associated custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-elements).
  Read 2026-10-27.
- [WHATWG HTML, Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission).
  Read 2026-10-27.
- [WHATWG DOM, Shadow trees](https://dom.spec.whatwg.org/#shadow-trees). Read 2026-10-27.
- [WHATWG DOM, retarget](https://dom.spec.whatwg.org/#retarget). Read 2026-10-27.
- [CSS Variables 1, invalid at computed-value time](https://www.w3.org/TR/css-variables-1/#invalid-at-computed-value-time).
  Read 2026-10-27.
- [CSS Color 4, OKLab and OKLCH](https://www.w3.org/TR/css-color-4/#ok-lab). Read 2026-10-27.
- [W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/). Read 2026-10-27.
- [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/). Read 2026-10-27.

**Platform reference**

- [MDN, Event.composed](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed). Read
  2026-10-27.

**Tool docs**

- Each Lit page in the table [Lit documentation used in this guide](#lit-documentation-used-in-this-guide).
  Read 2026-10-27.

[Index](README.md)
