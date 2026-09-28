/**
 * Resolves an anchor attribute that only means something on a real link (`hreflang`, `target`, `rel`).
 * Returns `undefined`, so `ifDefined` drops the attribute, when the anchor has no `href` or the value
 * is empty.
 */
export const linkAttribute = (href: string | undefined, value: string | undefined) =>
	href && value ? value : undefined;
