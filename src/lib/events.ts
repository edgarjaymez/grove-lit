import type { ColorSwatchCopyDetail } from './components/ColorSwatch/ColorSwatch.js';

/**
 * Every event a Grove component dispatches. All bubble and are composed, so a listener on a form or
 * on `document` receives them. `gv-change` is shared by gv-checkbox and gv-todo-list-item (`boolean`)
 * and gv-text-input (`string`).
 */
export interface GroveEventMap {
	'gv-back': CustomEvent<void>;
	'gv-change': CustomEvent<string | boolean>;
	'gv-copy': CustomEvent<ColorSwatchCopyDetail>;
	'gv-input': CustomEvent<string>;
	'gv-toggle': CustomEvent<boolean>;
}

/* eslint-disable @typescript-eslint/no-empty-object-type -- merges Grove's events into the DOM maps */
declare global {
	interface HTMLElementEventMap extends GroveEventMap {}
	interface DocumentEventMap extends GroveEventMap {}
	interface WindowEventMap extends GroveEventMap {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
