# #49 review: gv-button form association inside Lit components that slot it

Adversarial review of [#49](https://github.com/edgarjaymez/grove-lit/issues/49), read with #14, #40 (and its maintainer comment), #18, #34, #50, #51, #53 and #54, against `main` @ 1ba7292 on 2026-10-07. #49 has no branch or PR yet, so the button was prototyped from the spec text and tested in Chromium.

The question: do the gv-button changes keep working when a Lit form component puts the button (and the inputs) in place through a `<slot>`, with **one** way to control buttons and inputs?

## Verdict

**Only when the `<form>` is in the same tree as the controls.**

- A Lit component that renders `<form>` in its own shadow root and receives gv-button or gv-text-input through a `<slot>` gets none of #40: no submit, reset or Enter, no `<fieldset disabled>`, no `FormData`, no validation, no `form="id"`, no `<label>`. It fails silently: FR-07 makes "no form owner" a no-op that "throws or logs nothing". That's the failure #40 was filed to end ("a contact form whose `<gv-button type="submit">` did nothing at all").
- The common shape fails too: a Lit form that renders its own fields and `<form>`, and takes its buttons through `<slot name="actions">` (B2). The fields work, the slotted button does nothing.
- It's the platform's form-owner rule, not a gv-button bug. Native `<button>` and `<input>` slotted the same way fail the same way (A11).
- Slotting itself is harmless. A component that sits inside a `<form>`, or wraps a `<form>` the consumer passes in, can slot every control with nothing lost (C, D, D5).
- #49 as written doesn't state the rule, doesn't diagnose the broken case, and its slot contract bans controls from every Grove slot once gv-button is form-associated. The fixes below keep one mechanism (form association through one shared base) plus a composition rule and a development warning. No bridges, no fallback lookups.

## Why: the node tree, not the flat tree

Every rule involved is defined on the node tree. A `<slot>` changes what renders (the flat tree); it never changes a node's parent or which tree it's in.

| Rule                  | HTML Standard                                                                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form owner            | "A form-associated element is, by default, associated with its nearest ancestor form element"                                                                                                                                                                                                                 |
| `form="id"`           | "that attribute's value must be the ID of a form element in the element's tree". Reset algorithm: "If the first element in element's tree, in tree order, to have an ID that is identical to element's form content attribute's value, is a form element, then associate the element with that form element." |
| `<fieldset disabled>` | "the element is a descendant of a fieldset element whose disabled attribute is specified"                                                                                                                                                                                                                     |
| `<label>`             | "the ID of a labelable element in the same tree as the label element"; without `for`, "a labelable element descendant"                                                                                                                                                                                        |
| Enter                 | "A form element's default button is the first submit button in tree order whose form owner is that form element."                                                                                                                                                                                             |

A light-DOM child slotted into a shadow `<form>` has no `<form>` ancestor, and its tree has no element with the shadow form's id. Events are the one thing that follows slots: a click or keydown from a slotted control passes through the shadow `<form>` on its composed path (A4). That's why consumer bridges appear to work, and why they are a second mechanism.

## Evidence

Chromium 141 (Playwright 1.56.1, the repo's Vitest browser harness), with trusted clicks and keys through `userEvent`. The prototypes in [`prototypes.ts`](./prototypes.ts) follow #40, its maintainer comment and #49 S1/S2 for the button, and #18's association for the input, without styling. 27 tests, all passing; every cell below is an assertion.

| #   | Composition                                                                                | `internals.form`     | Click / Enter         | FormData, validation                        | `reset()`, fieldset                              |
| --- | ------------------------------------------------------------------------------------------ | -------------------- | --------------------- | ------------------------------------------- | ------------------------------------------------ |
| A   | Lit form renders `<form>` in its shadow root; inputs and button slotted                    | `null`               | nothing / nothing     | empty; a required, empty field still passes | not reached; the shadow fieldset is ignored      |
| B2  | Lit form renders its fields and `<form>`; the button comes through `<slot name="actions">` | button: `null`       | nothing / nothing     | the template's fields only                  | not tested                                       |
| B1  | The same form with the button in its own template                                          | the form             | 1 submit / 1 submit   | every value                                 | not tested                                       |
| C   | Shell component; the consumer's light-DOM `<form>` is its slotted child (Lion's pattern)   | the form             | 1 / 1                 | every value; a required, empty field blocks | reaches; a light-DOM fieldset disables           |
| D   | Layout component inside a light-DOM `<form>`, controls in named slots                      | the form             | 1 / 1                 | every value                                 | the layout's own shadow fieldset is ignored (D2) |
| D5  | Consumer Lit form: `<form>` and controls in its own template, a slotting layout in between | the form             | 1 / 1                 | every value                                 | not tested                                       |
| RT  | Like A, with `referenceTarget` on the shadow root and `form="host-id"` (behind a flag)     | the host, not a form | TypeError / TypeError | every value; a required, empty field blocks | not tested                                       |

Also asserted: `form="inner"` can't reach the shadow form (A9); a shadow `<label>` can't label a slotted control (A10); a flat-tree lookup submits an empty, unvalidated form (A6); unassigned controls stay listed but unrendered (D3, D4); the slot warning (E1, E2); `display: contents` (F1); link mode in a disabled fieldset (G1, G2).

## Findings

Ranked by how much they block the requirement: one mechanism, and buttons and inputs that keep working through slots.

### R1. Slotting into a shadow-root form fails silently, and no spec mentions it (blocker)

- **Failure.** A and B2: a real click and Enter do nothing, and the console stays empty (A2).
- **Gap.** #40's out-of-scope line covers "a gv-button inside another component's shadow root", which is B1 and works. Slotted controls appear nowhere in #14, #40, #49 or #51. FR-07 ("throws or logs nothing") and FR-27 (no listener without an owner) guarantee the silence.
- **Fix.** C1 to C3 below: state the rule, test the supported compositions, and warn in development when a submit or reset button with no owner has a `<form>` among its flat-tree ancestors (`assignedSlot`, then the shadow host, repeated). Production keeps FR-07.

### R2. Don't fix R1 with a second path (high)

- A flat-tree form lookup in gv-button finds the shadow form (A6, B2), and `requestSubmit()` fires `submit`. With the inputs slotted too, the submission carries **no values** and skips validation (A6: `FormData` is empty while a required field is empty). That's worse than doing nothing.
- Inputs have no equivalent short of a parallel form system (`formdata` events, hand-made validation, reset and disabled): the second way.
- A click bridge on the shadow form would work (A4: the events arrive). It's the consumer bridge #40 exists to remove.
- **Fix.** #49 states both are out of scope. R1's warning plus the rule is the answer.

### R3. The slot contract bans the controls the requirement needs to slot (high)

- `DESIGN_SYSTEM.md:1190` ("Never a form control"), #53 ("Slots accept text and phrasing content, never form controls") and `slot-content.ts:74-93` (warns on `input, button, select, textarea` or any class with `formAssociated === true`) apply to every slot in the library.
- Once #49 sets `static formAssociated = true`, `<gv-feedback-strip><span slot="message">Saved. <gv-button>Undo</gv-button></span></gv-feedback-strip>` starts warning (E1 is quiet today; E2 warns with a form-associated button). gv-card (#15) and any form layout inherit the ban.
- The stated reason ("would take part in a surrounding form alongside the component") only holds when the slot's host is itself a control, such as a `<button type="submit">` projected into gv-button. In a container, a slotted control is simply a control in the form. Inside `<button>` and `<a>`, HTML already forbids interactive content.
- **Fix (C6).** Split the contract by slot, not library-wide.

### R4. One mechanism needs the shared base in #49, and it has to be a mixin (high)

- **Order today.** #49 hand-rolls association in `Button.ts`. #50 makes gv-checkbox form-associated. Only then does #51 F6 build "a small shared base (a controller or mixin)". That's up to three copies of owner tracking, the disabled merge, activation timing and Enter before a base exists, and a refactor of the first two after.
- **Not a ReactiveController alone.** `customElements.define()` reads `formAssociated` from the constructor and the form callbacks from the prototype: "If formAssociated is true, then for each callbackName of « "formAssociatedCallback", "formResetCallback", "formDisabledCallback", "formStateRestoreCallback" »: Let callbackValue be ? Get(prototype, callbackName)." A controller attached in the constructor can't supply them. It has to be a class mixin, which may delegate to a controller.
- **Not in `Button.ts`.** If S1's helper lives there, gv-text-input imports `Button.ts`, which registers gv-button and gv-icon as a side effect (`@customElement`, the package's `sideEffects`). The button also has to recognise gv-text-input targets without importing it. Both belong in the shared module, with roles marked by the mixin, not by tag names or class imports.
- **Fix (C5).** Move #51 F6 into #49.

### R5. `internals.form` isn't always an `HTMLFormElement` (medium, forward-looking)

- Reference Target is the only platform route to "a Lit form owns its `<form>` and takes slotted controls" with one mechanism. With it on (Chromium 141 needs `--enable-blink-features=ShadowRootReferenceTarget`; the WPT lives under `tentative/`), slotted controls with `form="host-id"` really join the shadow form: `form.elements`, `FormData` and validation all include them (RT).
- But `internals.form` returns the **host**, which the WPT also expects for native controls ("The reset button should show the shadow host as its form property."). #40's design calls `requestSubmit()`, `reset()`, `.elements` and `addEventListener` on it: a click throws `TypeError: this.form.requestSubmit is not a function`, and Enter in a field throws `TypeError: form.elements is not iterable`.
- **Fix (C4).** One owner accessor that only returns an `HTMLFormElement`. Supporting Reference Target later is then a one-place change, for example a form host that exposes `requestSubmit()`.

### R6. Self-disable writes the page's `disabled`, so a form component can't release the right button (medium)

- FR-28 writes the public `disabled`, and OD1 (a) leaves `SubmitEvent.submitter` `null`. A shell component (C) that sends with `fetch` and must re-enable on failure (FR-34) can't tell which slotted button disabled itself, or whether a disabled button is the page's (say "Publish", kept disabled until terms are accepted). Re-enabling every `type="submit"` gv-button re-enables the page's.
- Two writers to one property is two ways to control it.
- **Fix, keeping the maintainer's "public and undoable" decision.** Also set a custom state while self-disabled (`internals.states.add('submitting')`, matched by `gv-button:state(submitting)`), cleared whenever `disabled` returns to `false`. A shell then releases exactly `[...form.elements].filter((el) => el.matches(':state(submitting)'))`.

### R7. S2 reads `display: contents` as "not rendered" (low)

- F1: with `gv-button { display: contents }` (a way to let the inner button join a parent grid or flex row), the host's `checkVisibility()` is `false` while its button is visible and clickable, so it is never the Enter default.
- An unassigned slot correctly reads `false` (D3).
- **Fix (C7).** Call `checkVisibility()` on the rendered `<button>` or `<a>`: `false` for `hidden`, `display: none` and unassigned hosts, `true` for `display: contents`.

### R8. Unrendered required fields block submit with nothing on screen; slots add a way in (low here, medium for #51)

- D4: a required field assigned to no slot (a layout that renders a slot conditionally, a collapsed section) stays in `form.elements`, `checkValidity()` is `false`, a click submits nothing, and nothing is visible.
- #51 F3 covers `hidden` only. **Fix:** "not rendered for any reason: `hidden`, `display: none`, an unassigned slot".

### R9. Tree order picks the Enter button, not slot order (low, docs)

- FR-24 uses `form.elements` order, which is source order. A layout's named slots can render the actions in a different order. Native default buttons behave the same; say so in the metadata and the forms docs.

### R10. FR-22 still promises a veto S1 can't honour (low, docs)

- #40's decision 4 checks `defaultPrevented` "after the keydown has finished propagating", and FR-22 says a cancelling listener stops Enter. S1 cancels synchronously at the form, so a `document` listener is too late, as S1 notes. #49's effective contract doesn't list FR-22 as amended.
- For form components the consequence is concrete: a shell that wants to veto Enter must listen on the `<form>`, or in the capture phase on its host, because its host sits above the form.

## Cross-epic notes

- **D1 labels (#50, #51).** "A page `<label for>` or a wrapping `<label>` names and activates them" holds only when the label and the control share a tree. A field component with a `<label>` in its shadow root can't label a slotted control (A10); it has to label its own inner input (#18's `label`).
- **gv-todo-list-item** renders gv-checkbox inside its own shadow root (`ToDoListItem.ts:120`). Once #50 makes gv-checkbox form-associated, that checkbox can never join a page form. Same rule; #50 should state it.
- **L1 holds in Chromium** (G2): inside `<fieldset disabled>`, the link-mode anchor still takes Tab and a trusted click. The host still matches `:disabled`, so page CSS such as `gv-button:disabled { opacity: 0.5 }` dims a working link; document it with L1. Firefox and WebKit can't run in the Chromium-only harness (D5), so #14 FR-10's three-browser check needs a manual pass.

## Proposed additions to #49's effective contract

**Forms and slots.** Form association follows the DOM tree. A `<slot>` changes what renders, never which form a control belongs to.

- [ ] **C1. The rule.** A Grove control joins the `<form>` that is its ancestor in its own tree, or the one its `form` attribute names in that tree. Components between that `<form>` and the control may slot it freely. Stated in a new "Forms and slots" section of `DESIGN_SYSTEM.md` and in `Button.metadata.ts` `composition.parentConstraints`.
- [ ] **C2. Supported compositions, each a browser test.** Click and Enter submit once with every value, `reset()` reaches the fields, and a light-DOM `<fieldset disabled>` disables them:
  - a component that wraps a `<form>` the consumer passes in;
  - a layout component inside a `<form>`;
  - a Lit component that renders the `<form>` and the controls in its own template.
- [ ] **C3. Unsupported, and loud in development.** A component that renders `<form>` in its shadow root and receives controls through a slot. In production, FR-07 stands. Otherwise, the first activation or Enter of a `type="submit"` or `"reset"` gv-button with no owner but a `<form>` among its flat-tree ancestors logs one warning naming the host and the rule. No flat-tree fallback, no click bridge.
- [ ] **C4. One owner accessor.** All form access goes through one accessor that returns `internals.form` only when it's an `HTMLFormElement`. Anything else, such as a Reference Target host, counts as no owner and warns in development.
- [ ] **C5. The shared base lands here.** #51 F6 moves into this PR as a class mixin in `src/lib/utils/`. gv-button is its first consumer; gv-checkbox (#50), gv-text-input (#51) and gv-textarea (#17) adopt it. It holds the S1 helper, the owner accessor, the disabled merge, activation after propagation (OD2), one Enter listener per form (keyed by form, instead of one per button plus one per field) and C3's warning.
- [ ] **C6. Split the slot contract.** Slots inside an interactive element or a non-interactive popup (gv-button, gv-checkbox's label, gv-menu-item, gv-tooltip) take phrasing content with no interactive or form-associated elements. Every other slot may hold Grove controls. `SlotContent` warns only for the first kind. S3, #34's guard text and #53's slot bullet follow.
- [ ] **C7. S2 checks the rendered control,** not the host.

**For the maintainer** (they change decisions already taken): R6's custom state alongside the public `disabled`, and R10's FR-22 wording.

## Rerun

From the repo root:

```sh
pnpm install
pnpm exec vitest --config review/49-form-slots/vitest.config.ts --run
```

Two projects: `review-49` (26 tests, stock Chromium) and `review-49-reference-target` (1 test, Chromium with `ShadowRootReferenceTarget`). The second logs two uncaught TypeErrors; they are R5, captured and asserted by the test. Neither project runs in `pnpm test`.

## Sources

- HTML Standard: [association of controls and forms](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#association-of-controls-and-forms), [disabled form controls](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-disabled), [implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission), [labeled control](https://html.spec.whatwg.org/multipage/forms.html#labeled-control), [`customElements.define()`](https://html.spec.whatwg.org/multipage/custom-elements.html#dom-customelementregistry-define).
- WPT, Reference Target and forms: [shadow-dom/reference-target/tentative/form.html](https://github.com/web-platform-tests/wpt/blob/master/shadow-dom/reference-target/tentative/form.html).
- [Reference Target: having your encapsulation and eating it too](https://blogs.igalia.com/alice/reference-target-having-your-encapsulation-and-eating-it-too/) (Igalia; found by search, not readable from this environment).
