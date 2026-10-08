/**
 * Resolves an anchor attribute that only means something on a real link (`hreflang`, `target`, `rel`).
 * Returns `undefined`, so `ifDefined` drops the attribute, when the anchor has no `href` or the value
 * is empty.
 */
export const linkAttribute = (href: string | undefined, value: string | undefined) =>
	href && value ? value : undefined;

/**
 * The `rel` for a link: an explicit value passes through untouched, and `target="_blank"` without one
 * gets `noopener noreferrer`. `undefined` (no attribute) without an `href`.
 */
export const linkRel = (
	href: string | undefined,
	target: string | undefined,
	rel: string | undefined
) => {
	if (!href) return undefined;
	if (rel) return rel;
	return target === '_blank' ? 'noopener noreferrer' : undefined;
};
