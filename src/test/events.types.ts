// Type-level fixture for #41 FR-E3 and FR-12, checked by `pnpm check`; never executed.
import type { Checkbox, ColorSwatchCopyDetail, TextInput, ToDoListItem } from '../lib/index.js';

document.addEventListener('gv-input', (e) => e.detail.toUpperCase());
document.addEventListener('gv-toggle', (e) => e.detail satisfies boolean);
document.addEventListener('gv-copy', (e) => e.detail satisfies ColorSwatchCopyDetail);
document.addEventListener('gv-change', (e) => e.detail satisfies string | boolean);
document.addEventListener('gv-back', (e) => e.preventDefault());
// The DOM's own entries are untouched.
document.addEventListener('input', (e) => e satisfies InputEvent);
// @ts-expect-error gv-input carries a string, not a boolean
document.addEventListener('gv-input', (e) => e.detail satisfies boolean);

// On an element reference, gv-change narrows to that element's payload (FR-12).
declare const input: TextInput;
declare const checkbox: Checkbox;
declare const item: ToDoListItem;
const onInputChange = (e: CustomEvent<string>) => e.detail.toUpperCase();
input.addEventListener('gv-change', onInputChange);
input.removeEventListener('gv-change', onInputChange);
input.addEventListener('gv-input', (e) => e.detail.toUpperCase());
checkbox.addEventListener('gv-change', (e) => e.detail satisfies boolean);
item.addEventListener('gv-change', (e) => e.detail satisfies boolean);
// @ts-expect-error gv-checkbox's gv-change carries a boolean
checkbox.addEventListener('gv-change', (e) => e.detail.toUpperCase());
// Other names keep their DOM types, and arbitrary names still take a plain listener.
input.addEventListener('click', (e) => e satisfies MouseEvent);
input.addEventListener('focus', (e) => e satisfies FocusEvent);
input.addEventListener('custom-thing', (e) => e satisfies Event);
