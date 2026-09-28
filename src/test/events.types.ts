// Type-level fixture for #41 FR-E3, checked by `pnpm check`; never executed.
import type { ColorSwatchCopyDetail } from '../lib/index.js';

document.addEventListener('gv-input', (e) => e.detail.toUpperCase());
document.addEventListener('gv-toggle', (e) => e.detail satisfies boolean);
document.addEventListener('gv-copy', (e) => e.detail satisfies ColorSwatchCopyDetail);
document.addEventListener('gv-change', (e) => e.detail satisfies string | boolean);
document.addEventListener('gv-back', (e) => e.preventDefault());
// The DOM's own entries are untouched.
document.addEventListener('input', (e) => e satisfies InputEvent);
// @ts-expect-error gv-input carries a string, not a boolean
document.addEventListener('gv-input', (e) => e.detail satisfies boolean);
