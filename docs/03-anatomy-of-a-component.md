# 03 · Anatomy of a component

> **What you need from this chapter**
>
> - A full read of `src/lib/components/Button/Button.ts`, top to bottom, in eight stops.
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
import { SlotContent } from '../../utils/slot-content.js';
```

- **`import '../Icon/Icon.js';` imports nothing by name.** It is a _side-effect import_: loading the
  module runs `@customElement('gv-icon')`, which registers the tag. Button renders `<gv-icon>`, so it
  must make sure that tag exists. Any component that renders another Grove tag imports it this way.
- **Imports end in `.js`, even though the files are `.ts`.** TypeScript resolves `Icon.js` to
  `Icon.ts` while compiling, and the built output then has correct paths. Lit's publishing guide
  recommends file extensions on imports (<https://lit.dev/docs/tools/publishing/>).
- `componentReset`, `focusRing` and `SlotContent` are shared helpers covered in chapters 04 and 05.

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
 * @slot - The button text. Falls back to `text` when empty.
 */
```

This comment is read by tools, not just by people. `@slot -` declares the default slot. Components
that dispatch events also carry `@fires {CustomEvent<T>} gv-*` lines, and components with public
custom properties carry `@cssprop` lines. The build fails if these tags and the code disagree
(chapter 07).

## Stop 4 · Registration and the class

```ts
@customElement('gv-button')
export class Button extends LitElement {
	private readonly _slots = new SlotContent(this, ['']);
```

- `@customElement` registers the tag when the module loads. Lit's publishing guide asks components to
  define themselves and to export their class, so consumers can import or subclass it
  (<https://lit.dev/docs/tools/publishing/>).
- `_slots` is a **reactive controller** that tracks whether the default slot (`''`) has content. The
  leading underscore and `private` mark it as internal. Chapter 05 explains it.

## Stop 5 · Properties

```ts
	@property({ type: String }) text = '';
	@property({ type: String }) variant: ButtonVariant = 'filled';
	@property({ type: String }) color: ButtonColor = 'accent';
	@property({ type: String }) size: ButtonSize = 'md';
	@property({ type: String }) icon?: string;
	@property({ type: String }) type: ButtonType = 'button';
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
```

Each line is one public input. The patterns to notice:

| Property    | Pattern                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `text`      | the **fallback** for the slot: shown only when no content is slotted                                     |
| `icon?`     | **optional string**: typed `string \| undefined`, written with `ifDefined()` in the template             |
| `type`      | defaults to `'button'`, so a `gv-button` inside a form does not submit it by accident                    |
| `disabled`  | `reflect: true`, so page CSS can match `gv-button[disabled]`                                             |
| `ariaLabel` | **ARIA property**: `string \| null = null`, its attribute named explicitly, `?? nothing` in the template |

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
  .btn:not(:disabled):hover gv-icon {
  	--gv-icon-regular-display: none;
  	--gv-icon-fill-display: inline-flex;
  }
  ```

- Selectors are flat: `.btn--outlined.btn--lg`, never nested CSS. Nesting would work in today's
  browsers; flat selectors are a house convention because they are easy to search for and their
  specificity is obvious.

## Stop 7 · `render()`

```ts
	render() {
		const hasIcon = Boolean(this.icon);
		return html`
			<button
				class=${classMap({
					btn: true,
					'gv-focusable': true,
					[`btn--${this.variant}`]: true,
					[`btn--${this.color}`]: true,
					[`btn--${this.size}`]: true,
					'btn--has-icon': hasIcon
				})}
				type=${this.type}
				?disabled=${this.disabled}
				aria-label=${this.ariaLabel ?? nothing}
			>
				${hasIcon ? html`<gv-icon name=${ifDefined(this.icon)} fill-in-hover></gv-icon>` : nothing}
				<slot></slot>${this._slots.has() ? nothing : this.text}
			</button>
		`;
	}
```

- The host (`<gv-button>`) is not the button. A real `<button>` inside the shadow root is, so keyboard
  support, form behaviour and the accessibility role come from the browser for free.
- `classMap` builds the class list from the properties. The `gv-focusable` class is what the focus
  ring targets.
- `?disabled` adds or removes the native `disabled` attribute.
- The icon renders only when `icon` is set; `nothing` renders nothing otherwise.
- `<slot></slot>${this._slots.has() ? nothing : this.text}` shows slotted content when there is some,
  and the `text` property when there is none. Both `<gv-button>Save</gv-button>` and
  `<gv-button text="Save"></gv-button>` work.

## Stop 8 · The tag map

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

| File                          | What it adds                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `Button.metadata.ts`          | `ButtonMetadata`: use cases, anti-patterns, the slot list, states, accessibility notes (chapter 07) |
| `Button.stories.ts`           | ten stories, one per variant, colour, size, icon, disabled, and a slotted one (chapter 08)          |
| `src/lib/index.ts`            | exports `Button` and `ButtonMetadata` from the package                                              |
| `src/lib/components/index.ts` | `export * from './Button/Button.js';`                                                               |

## Where to see it in Button.ts

This whole chapter is Button.ts. To check yourself, find in the file: the side-effect import, the one
reflected property, the property whose attribute name is set by hand, the three entries of
`static styles`, and the class that the focus ring targets.
