import { css } from 'lit';

/**
 * `.visually-hidden` for shadow roots: the text stays in the accessibility tree and draws nothing.
 * The same declarations ship to light DOM as `.visually-hidden` in `grove.css` (`a11y.css`).
 * Never apply it to a focusable element.
 */
export const visuallyHidden = css`
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
`;
