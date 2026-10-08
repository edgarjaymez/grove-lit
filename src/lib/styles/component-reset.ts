import { css } from 'lit';

/**
 * The shared reset every Grove shadow root adopts first. Besides box-model and form-font defaults it
 * carries two host-level guarantees, which components (and consumers reusing this export) inherit:
 *
 * - `hidden` hides the element. `!important` lets the shadow rule beat a page `display` rule on the
 *   host; `until-found` keeps the browser's own behaviour, which does nothing on an `inline` host.
 * - Under `prefers-reduced-motion: reduce` every transition and animation ends instantly. `0.01ms`
 *   (not `0s`) keeps `transitionend` firing. Delays drop to `0s`, timers included, and an animation
 *   keeps its last keyframe only with a `forwards` or `both` fill mode. A component that wants a
 *   gentler alternative instead of none declares its own `!important` rule inside the same media
 *   query, on a class selector (more specific than `*`) or on `:host(…)` (more specific than
 *   `:host`), so it wins. Slotted light DOM is the page's and keeps its own transitions.
 */
export const componentReset = css`
	:host([hidden]:not([hidden='until-found'])) {
		display: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		:host,
		*,
		*::before,
		*::after {
			transition-duration: 0.01ms !important;
			transition-delay: 0s !important;
			animation-duration: 0.01ms !important;
			animation-delay: 0s !important;
			animation-iteration-count: 1 !important;
		}
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	* {
		margin: 0;
	}

	img,
	picture,
	video,
	canvas,
	svg {
		display: block;
		max-width: 100%;
	}

	input,
	button,
	textarea,
	select {
		font: inherit;
	}

	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		overflow-wrap: break-word;
	}
`;
