# 05 · Slots and events

> **What you need from this chapter**
>
> - How text and markup get into a component (slots), and why Grove tracks slots with a helper class.
> - How a component tells the page something happened (`gv-*` events), and how those events are typed.
> - The tests and build checks that keep slots and events honest.

## Slots: content in

### The whitespace problem

A native `<slot>` can hold fallback content, shown when nothing is assigned to it. It looks like the
obvious way to support both `<gv-button>Save</gv-button>` and `<gv-button text="Save">`. It does not
work reliably, because **whitespace counts as content**. In

```html
<gv-button text="Save"> </gv-button>
```

the line break between the tags is a text node, the browser assigns it to the default slot, and the
fallback never shows. Grove needs to know whether a slot has _real_ content: an element, or text that
is not just whitespace.

### Reactive controllers

Lit's answer to "reusable logic that hooks into a component's lifecycle" is a **reactive controller**:
a plain object that registers itself with `host.addController(this)` and then receives callbacks such
as `hostConnected()` and `hostDisconnected()`. It can ask the host to re-render with
`host.requestUpdate()` (<https://lit.dev/docs/composition/controllers/>). It is the Lit equivalent of
a custom hook in React.

### `SlotContent`

`src/lib/utils/slot-content.ts` is the controller Grove uses for slots:

```ts
export class SlotContent implements ReactiveController {
	…
	/** `names` lists the slots to track; '' is the default slot. */
	constructor(host: ReactiveControllerHost & HTMLElement, names: readonly string[] = ['']) {
		this._host = host;
		this._names = names;
		host.addController(this);
	}

	/** Whether the named slot ('' for the default one) has content. */
	has(name = ''): boolean {
		return this._state.get(name) ?? false;
	}
```

When the host connects, it reads the host's light-DOM children, ignores whitespace-only text and
comments, and records which tracked slots have content. A `MutationObserver` repeats that whenever the
children change, and it calls `requestUpdate()` only when the answer changes.

A component uses it in two lines:

```ts
private readonly _slots = new SlotContent(this, ['']);
…
<slot></slot>${this._slots.has() ? nothing : this.text}
```

A component with a named slot tracks it too, for example `new SlotContent(this, ['', 'heading'])`, and
asks `this._slots.has('heading')`.

### What may go in a slot

Slots take **text and phrasing content** (text, `<strong>`, `<em>`, `<span>`, links where the
component allows them). Never a form control. A slotted `<input>` stays in the page's light DOM, so it
would join the surrounding form on its own, next to the component's own control. In development,
`SlotContent` logs one console warning per component when it sees a form control in a slot. The
warning turns off when the consumer's bundler sets `process.env.NODE_ENV` to `"production"`
(`src/lib/utils/dev.ts`).

### How slots are checked

- Each component's JSDoc lists its slots with `@slot` tags.
- Each component's metadata lists the same slots in `composition.slots`.
- `pnpm build` fails if the two lists differ (chapter 07).
- `src/lib/slots.browser.test.ts` renders every component and compares the slots it actually renders
  with the metadata.

## Events: news out

### The rules

Every Grove event:

- is a **`CustomEvent`** whose name starts with **`gv-`** (`gv-change`, `gv-toggle`, `gv-input`,
  `gv-copy`, `gv-back`);
- carries its data in **`detail`** (the new value);
- is dispatched with **`bubbles: true, composed: true`**.

`composed: true` is what lets the event leave the shadow root; `bubbles: true` lets every ancestor
hear it (<https://lit.dev/docs/components/events/>). Together they mean a listener on a `<form>` or on
`document` receives the event.

```ts
private _toggle() {
	this.checked = !this.checked;
	this.dispatchEvent(
		new CustomEvent('gv-change', { detail: this.checked, bubbles: true, composed: true })
	);
}
```

(from `Checkbox.ts`).

The `gv-` prefix keeps Grove's events apart from native ones. Earlier versions used unprefixed names
(`change`, `toggle`, `input`, `back`); `events.browser.test.ts` listens for those too and fails if one
escapes a Grove element.

### Retargeting

When a composed event leaves a shadow root, the browser **retargets** it: listeners outside see
`event.target` as the host (`gv-checkbox`), not the inner `<button>`. If you need the real origin,
`event.composedPath()` lists every node the event passed through
(<https://lit.dev/docs/components/events/>). `ToDoListItem.ts` uses `composedPath()` to ignore row
clicks that came from its own checkbox.

### Listening

On the page, or in any framework, a consumer writes something like this (an illustration, not repo
code):

```ts
document.querySelector('gv-checkbox')!.addEventListener('gv-change', (e) => {
	console.log(e.detail); // true or false
});
```

Inside a Lit template, with the `@` binding:

```ts
<gv-checkbox ?checked=${this.isDone} @gv-change=${this._onCheckboxChange}></gv-checkbox>
```

(from `ToDoListItem.ts`).

### Three patterns you will meet

**1. A component that wraps another one stops the inner event and sends its own.** Otherwise the page
would receive two events for one click: the inner checkbox's, and the item's.

```ts
private _onCheckboxChange(e: CustomEvent<boolean>) {
	// The inner checkbox's own composed gv-change would otherwise escape the host too, so each
	// toggle would reach the page twice.
	e.stopPropagation();
	this.isDone = e.detail;
	this.dispatchEvent(
		new CustomEvent('gv-change', { detail: this.isDone, bubbles: true, composed: true })
	);
}
```

(from `ToDoListItem.ts`).

**2. A component that wraps a native input turns `input` and `change` into `gv-input` and
`gv-change`.** `TextInput.ts` stops the native event and re-dispatches it with the value as `detail`.

**3. An event that guards a default action is `cancelable`.** `gv-back` fires before
`gv-back-button` calls `history.back()`. A listener that calls `event.preventDefault()` cancels the
navigation:

```ts
const event = new CustomEvent('gv-back', {
	bubbles: true,
	composed: true,
	cancelable: true
});
if (this.dispatchEvent(event)) {
	window.history.back();
}
```

(from `BackButton.ts`). Only add `cancelable` when there is a default action to skip.

### Typing events

TypeScript should know that `gv-change` carries a `CustomEvent<boolean>`. Two layers do that.

**The global map**, `src/lib/events.ts`, lists every Grove event and merges the list into the DOM's
own event maps, so `addEventListener('gv-copy', …)` is typed on any element and on `document`:

```ts
export interface GroveEventMap {
	'gv-back': CustomEvent<void>;
	'gv-change': CustomEvent<string | boolean>;
	'gv-copy': CustomEvent<ColorSwatchCopyDetail>;
	'gv-input': CustomEvent<string>;
	'gv-toggle': CustomEvent<boolean>;
}
```

`gv-change` is shared: it carries a `boolean` from `gv-checkbox` and `gv-todo-list-item`, and a
`string` from `gv-text-input`. So the global map can only say `string | boolean`.

**A per-element map** gives the exact type when you hold a reference to one element.
`Checkbox.ts` declares `CheckboxEventMap` and adds `addEventListener` / `removeEventListener`
overloads to the class through interface merging:

```ts
export interface CheckboxEventMap extends HTMLElementEventMap {
	'gv-change': CustomEvent<boolean>;
}
```

The `/* eslint-disable … no-unsafe-declaration-merging */` comments around that block are expected:
merging an interface into a class is exactly what the overloads need.

### How events are checked

- Each dispatched event needs a typed JSDoc tag on the class:
  `@fires {CustomEvent<boolean>} gv-change - with the new checked.` `pnpm build` fails without it
  (chapter 07).
- `src/lib/events.browser.test.ts` clicks and types in each component and records what reaches
  `document`.
- `src/test/events.types.ts` is never run. It holds typed listener calls, some marked
  `// @ts-expect-error`, so `pnpm check` fails if the event types get looser or wrong.

## Where to see it in Button.ts

- `private readonly _slots = new SlotContent(this, ['']);` tracks the default slot.
- `<slot></slot>${this._slots.has() ? nothing : this.text}` renders the slot with `text` as fallback.
- The JSDoc has one `@slot -` tag, matching `composition.slots` in `Button.metadata.ts`.
- Button dispatches **no** custom events. A click is the native `click` event from the inner
  `<button>`, which bubbles and is composed by the browser, so the page hears it on `gv-button`.
