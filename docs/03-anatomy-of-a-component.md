# 03 · Anatomy of a component

> **What you need from this chapter**
>
> - A full read of `src/lib/components/Button/Button.ts`, top to bottom, in nine stops.
> - Why each part is written the way it is, so you can copy the pattern into another component.
> - How the two sibling files (metadata and stories) and the two export lists fit around it.

Every excerpt below is copied from `Button.ts`. Open the file next to this chapter.

## Stop 1 · Imports

```ts
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';
import { focusRing } from '../../styles/focus-ring.js';
import { FormControl } from '../../utils/form-control.js';
import type { FormRole } from '../../utils/form-control.js';
import { linkAttribute, linkRel } from '../../utils/link-attributes.js';
import { SlotContent } from '../../utils/slot-content.js';
```

- **`import '../Icon/Icon.js';` imports nothing by name.** It is a _side-effect import_: loading the
  module runs `@customElement('gv-icon')`, which registers the tag. Button renders `<gv-icon>`, so it
  must make sure that tag exists. Any component that renders another Grove tag imports it this way.
- **Imports end in `.js`, even though the files are `.ts`.** TypeScript resolves `Icon.js` to
  `Icon.ts` while compiling, and the built output then has correct paths. Lit's publishing guide
  recommends file extensions on imports (<https://lit.dev/docs/tools/publishing/>).
- **`import type` brings in a type only.** `FormRole` exists for the compiler and leaves nothing in
  the built JavaScript.
- `componentReset`, `focusRing` and `SlotContent` are shared helpers covered in chapters 04 and 05.
  `FormControl` is the form base (Stop 4 and Stop 7), and `linkAttribute` and `linkRel` resolve the
  link attributes (Stop 8).

## Stop 2 · Local types

```ts
type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'ghost';
type ButtonColor = 'accent' | 'gray';
type ButtonSize = 'lg' | 'md' | 'sm';
type ButtonType = 'button' | 'submit' | 'reset';
```

Each type alias lists the allowed values of one property. The manifest generator would otherwise
write the bare name `ButtonSize`, which tells a consumer nothing, so a build step spells each alias
out as its union of values (chapter 07).

## Stop 3 · The JSDoc block

```ts
/**
 * A button that takes part in its form: `type="submit"` submits it and `type="reset"` resets it, after
 * the click has finished propagating, so any listener can cancel. Form association follows the DOM
 * tree, so the button and its `<form>` must be in the same tree (a slot doesn't carry it across).
 *
 * With `href`, it renders a real link with the same look instead, and takes no part in its form.
 *
 * @slot - The button text. Falls back to `text` when empty.
 * @attr {string} form - The id of the `<form>` this button belongs to, when it isn't inside it.
 */
```

This comment is read by tools, not just by people. The prose becomes the component's description in
the manifest. `@slot -` declares the default slot. `@attr` declares an attribute the class has no
`@property` for: `form` is handled by the browser, and declaring it lets the Astro types accept
`form="checkout"`. Components that dispatch events also carry `@fires {CustomEvent<T>} gv-*` lines,
and components with public custom properties carry `@cssprop` lines. The build fails if these tags
and the code disagree (chapter 07).

## Stop 4 · Registration and the class

```ts
@customElement('gv-button')
export class Button extends FormControl(LitElement) {
	private readonly _slots = new SlotContent(this, [''], { phrasingOnly: true });
```

- `@customElement` registers the tag when the module loads. Lit's publishing guide asks components to
  define themselves and to export their class, so consumers can import or subclass it
  (<https://lit.dev/docs/tools/publishing/>).
- **`FormControl(LitElement)` is a class mixin**: a function that takes a base class and returns a
  subclass of it (<https://lit.dev/docs/composition/mixins/>). `FormControl` makes the host a
  form-associated custom element, so the button has a form owner, is listed in `form.elements` and
  is disabled by a `<fieldset disabled>`. It also runs submit, reset, Enter and self-disable. It has
  to be a mixin, not a controller: the browser reads `static formAssociated` and the `form*Callback`
  methods from the element's own class when the tag is defined. Every Grove control that takes part
  in forms extends it (chapter 10, recipe 14).
- `_slots` is a **reactive controller** that tracks whether the default slot (`''`) has content.
  `phrasingOnly` says the slot takes text, never a control: it sits inside the button. The leading
  underscore and `private` mark it as internal. Chapter 05 explains it.

## Stop 5 · Properties

```ts
	@property({ type: String }) text = '';
	@property({ type: String }) variant: ButtonVariant = 'filled';
	@property({ type: String }) color: ButtonColor = 'accent';
	@property({ type: String }) size: ButtonSize = 'md';
	@property({ type: String }) icon?: string;
	@property({ type: String }) type: ButtonType = 'button';
	@property({ type: Boolean, reflect: true }) disabled = false;
	/** With `type="submit"`, the form data name this button's `value` is submitted under. */
	@property({ type: String, reflect: true }) name?: string;
	/** Submitted under `name`, in the form data its own submission builds. */
	@property({ type: String }) value = '';
	/** Renders a real link to this URL, with the button's look, instead of a button. */
	@property({ type: String }) href?: string;
	/** Where the link opens. `_blank` without `rel` gets `rel="noopener noreferrer"`. */
	@property({ type: String }) target?: '_blank' | '_self';
	/** The link's relationship to its target; passed through untouched when set. */
	@property({ type: String }) rel?: string;
	/** The accessible name of an icon-only button, with no slotted text or `text`. Never shown. */
	@property({ type: String }) label?: string;
	/** Read after the name, as the button's accessible description. Never shown. */
	@property({ type: String }) description?: string;
```

Each line is one public input. The patterns to notice:

| Property      | Pattern                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `text`        | the **fallback** for the slot: shown only when no content is slotted                                             |
| `icon?`       | **optional string**: typed `string \| undefined`, written with `ifDefined()` in the template                     |
| `type`        | defaults to `'button'`, so a `gv-button` inside a form does not submit it by accident                            |
| `disabled`    | `reflect: true`, so page CSS can match `gv-button[disabled]`; the button also sets it on itself after it submits |
| `name`        | `reflect: true`: the form data entry is named by the `name` attribute, as on a native control                    |
| `href`        | switches the render to a link (Stop 8); `target` and `rel` only mean something with it                           |
| `label`       | the **invisible name** of an icon-only button; visible text always wins, and it is never shown                   |
| `description` | read after the name, from a `hidden` element in the shadow root (`descriptionNode`)                              |

Properties come before `static styles`, and styles come before methods. That is the order in every
component.

Grove never names a property `title`. `title` is a global HTML attribute, so a `title` property would
also show a native tooltip on the host. Components with a heading and a body use `heading` and
`message` instead.

## Stop 6 · Styles

```ts
	static styles = [
		componentReset,
		focusRing,
		css`
			.btn {
				box-shadow: var(--_drop, 0 0 #0000);
				display: inline-flex;
```

- `static styles` is **an array**, and the order matters: `componentReset` first (browser defaults
  reset inside the shadow root), then `focusRing` (the shared focus indicator), then the component's
  own `css`.
- Every value is a token: `var(--soft-grid-8)`, `var(--semantic-color-surface-accent-summit)`. There
  are no raw colours or pixel paddings.
- The control's shadow is set through a private custom property, `--_drop`, never with `box-shadow`
  directly:

  ```css
  .btn--filled.btn--accent {
  	background: var(--semantic-color-surface-accent-summit);
  	color: var(--semantic-color-text-on-accent-summit-base);
  	--_drop: var(--drop-shadow-under-accent-summit);
  }
  ```

  The focus ring reads `--_drop` and stacks on top of it. Chapter 04 explains why.

- Hovering the button fills its icon by setting two custom properties that `gv-icon` reads. Custom
  properties inherit into the child's shadow root, so the parent can steer the child without reaching
  into it:

  ```css
  .btn:not(.btn--disabled):hover gv-icon {
  	--gv-icon-regular-display: none;
  	--gv-icon-fill-display: inline-flex;
  }
  ```

- Disabled is a class, `btn--disabled`, not the `:disabled` pseudo-class. An `<a>` can't be
  `:disabled`, so one class lets both renders (Stop 8) dim and freeze the same way.

- Selectors are flat: `.btn--outlined.btn--lg`, never nested CSS. Nesting would work in today's
  browsers; flat selectors are a house convention because they are easy to search for and their
  specificity is obvious.

## Stop 7 · The form hooks

```ts
	/** @internal */
	protected formRole(): FormRole {
		if (this._isLink) return null;
		return this.type === 'submit' || this.type === 'reset' ? this.type : null;
	}

	/** @internal */
	protected renderedControl() {
		return this.renderRoot.querySelector<HTMLElement>('.btn');
	}

	/** @internal */
	protected submissionValue() {
		return this.name ? this.value : null;
	}

	/** @internal A link stays a working link inside a disabled fieldset, as a native `<a>` does. */
	protected honoursFormDisabled() {
		return !this._isLink;
	}
```

`FormControl` does the form work; these `protected` methods tell it what this component is.

- `formRole()` says what the button does in its form: submit, reset, or nothing.
- `renderedControl()` is the element checked for visibility, so a hidden button never becomes the
  form's Enter button.
- `submissionValue()` is what a named submit adds to the form data.
- `honoursFormDisabled()` lets link mode ignore a disabled fieldset.

`@internal` keeps them out of the manifest: they are for subclasses, not page authors.

Form behaviour does **not** come from the inner `<button>`. A button in a shadow root has no form
owner in the page's tree, which is why the inner button is always `type="button"` and the host does
the form work. The host and its `<form>` must be in the same tree: a slot doesn't carry a control
into a `<form>` in another component's shadow root (chapter 05).

## Stop 8 · `render()`

```ts
	render() {
		const hasIcon = Boolean(this.icon);
		const disabled = this.effectivelyDisabled;
		const classes = classMap({
			btn: true,
			'gv-focusable': true,
			[`btn--${this.variant}`]: true,
			[`btn--${this.color}`]: true,
			[`btn--${this.size}`]: true,
			'btn--has-icon': hasIcon,
			'btn--disabled': disabled
		});
		const content = html`
			${hasIcon ? html`<gv-icon name=${ifDefined(this.icon)} fill-in-hover></gv-icon>` : nothing}
			<slot></slot>${this._slots.has() ? nothing : this.text}
		`;
		const name = this.hasVisibleName() ? undefined : invisibleName(this.label, this._hostLabel);
		if (this._isLink) {
			// A link can't be disabled natively: without href it leaves the tab order and goes nowhere.
			const href = disabled ? undefined : this.href;
			return html`<a
				class=${classes}
				href=${ifDefined(href)}
				target=${ifDefined(linkAttribute(href, this.target))}
				rel=${ifDefined(linkRel(href, this.target, this.rel))}
				role=${disabled ? 'link' : nothing}
				aria-disabled=${disabled ? 'true' : nothing}
				aria-label=${name ?? nothing}
				aria-describedby=${describedBy(this.description)}
				>${content}</a
			>${descriptionNode(this.description)}`;
		}
		return html`
			<button
				class=${classes}
				type="button"
				?disabled=${disabled}
				aria-label=${name ?? nothing}
				aria-describedby=${describedBy(this.description)}
			>
				${content}
			</button>
			${descriptionNode(this.description)}
		`;
	}
```

- The host (`<gv-button>`) is not the button. A real `<button>`, or a real `<a>` with `href`, inside
  the shadow root is, so keyboard support and the accessibility role come from the browser. A link
  keeps everything a native link does: middle click, modified clicks, the context menu.
- `classMap` builds the class list once, and both renders use it, so the two modes look identical. The
  `gv-focusable` class is what the focus ring targets.
- `effectivelyDisabled` comes from `FormControl`: the `disabled` property, or a disabled fieldset
  around the button. `?disabled` adds or removes the native `disabled` attribute.
- A disabled link drops `href`, which takes it out of the tab order, and says it is a disabled link
  with `role="link"` and `aria-disabled`. `linkAttribute` and `linkRel` return `undefined` without an
  `href`, so `ifDefined` drops `target` and `rel` too.
- The icon renders only when `icon` is set; `nothing` renders nothing otherwise.
- `<slot></slot>${this._slots.has() ? nothing : this.text}` shows slotted content when there is some,
  and the `text` property when there is none. Both `<gv-button>Save</gv-button>` and
  `<gv-button text="Save"></gv-button>` work.
- `name` is the inner element's `aria-label`, only when no visible text names the button
  (`hasVisibleName()`, which reads slotted _text_: an icon alone doesn't count). It is `label`, or for
  one minor a legacy host `aria-label` (`invisibleName`). A page `<label>`'s text comes first, from
  `pageLabelText()`, which `FormControl` keeps in step with the page. See `DESIGN_SYSTEM.md` › Names
  and Descriptions.
- `describedBy` and `descriptionNode` (`src/lib/utils/accessible-name.ts`) add the description: an
  `aria-describedby` to a `hidden` element next to the control, rendered only when there is one.

## Stop 9 · The tag map

```ts
declare global {
	interface HTMLElementTagNameMap {
		'gv-button': Button;
	}
}
```

This tells TypeScript that `<gv-button>` is a `Button` (<https://lit.dev/docs/components/defining/>).
Every component file ends with it.

## The files around it

| File                          | What it adds                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Button.metadata.ts`          | `ButtonMetadata`: use cases, anti-patterns, the slot list, states, accessibility notes (chapter 07)           |
| `Button.stories.ts`           | stories per variant, colour, size, icon and disabled, a slotted one, links, and two in-form ones (chapter 08) |
| `Button.browser.test.ts`      | the form and link behaviour, with real clicks and keys (chapter 08)                                           |
| `src/lib/index.ts`            | exports `Button` and `ButtonMetadata` from the package                                                        |
| `src/lib/components/index.ts` | `export * from './Button/Button.js';`                                                                         |

## Where to see it in Button.ts

This whole chapter is Button.ts. To check yourself, find in the file: the side-effect import, the two
reflected properties, the property whose attribute name is set by hand, the three entries of
`static styles`, the class that the focus ring targets, the mixin the class extends, and the one line
that decides between a link and a button.
