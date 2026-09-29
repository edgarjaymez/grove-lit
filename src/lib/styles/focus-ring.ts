import { css } from 'lit';

/**
 * The Grove focus ring, for the element inside a shadow root that receives focus. Give that element
 * the `gv-focusable` class and adopt this fragment after `componentReset`.
 *
 * - The ring is the surface's `--ring-on-*` token, read from the inherited `--gv-focus-ring` that a
 *   surface declares. With none, the component's `--_ring-default`, else the Ground ring. The
 *   fallback resolves inside the component, so it follows the component's own theme.
 * - It is drawn on `:focus-visible` only, over the control's own drop shadow (`--_drop`), which
 *   components set instead of `box-shadow`.
 * - The transparent outline is invisible normally and becomes the indicator under forced colours,
 *   where box-shadow is dropped.
 */
export const focusRing = css`
	.gv-focusable:focus-visible {
		outline: var(--border-width-heavy, 2px) solid transparent;
		outline-offset: var(--soft-grid-4, 4px);
		box-shadow:
			var(--gv-focus-ring, var(--_ring-default, var(--ring-on-ground))), var(--_drop, 0 0 #0000);
	}
`;
