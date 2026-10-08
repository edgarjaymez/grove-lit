// DOM-free helpers for gv-icon's registration check, kept apart so node tests can reach them.

/** How long a missing glyph may take to register, after the page has loaded, before it is reported. */
export const GRACE_MS = 2000;

/** `arrow-left` → `PhArrowLeft`, Phosphor's module and class naming. */
export const phosphorModule = (name: string) =>
	'Ph' +
	name
		.split('-')
		.filter(Boolean)
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join('');

/** `<gv-icon name>` → the `ph-*` tag it renders, or '' when nothing is rendered. */
export const phosphorTag = (name: string) => {
	const safe = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
	return safe ? `ph-${safe}` : '';
};

const reported = new Set<string>();

/** True once a tag has been reported on this page. */
export const wasReported = (tag: string) => reported.has(tag);

/** True the first time a tag is reported on this page, false after. */
export const claimReport = (tag: string) => {
	if (reported.has(tag)) return false;
	reported.add(tag);
	return true;
};

/** Test hook: forget which tags were reported. */
export const resetReports = () => reported.clear();

export { warningsEnabled } from '../../utils/dev.js';

/**
 * `hosts` are the elements whose shadow roots hold the icon, outermost first, so the chain reads
 * from the page's own markup inward: gv-color-swatch, then the gv-tooltip it renders.
 */
export const missingGlyphMessage = ({
	name,
	tag,
	hosts = []
}: {
	name: string;
	tag: string;
	hosts?: readonly string[];
}) => {
	const sanitized = tag.slice(3);
	const value = sanitized === name ? `name="${name}"` : `name="${name}" (read as "${sanitized}")`;
	const [outer, ...inner] = hosts;
	const inside = outer
		? ` (inside <${outer}>${inner.map((host) => `, in its <${host}>`).join('')})`
		: '';
	return (
		`[grove] <${tag}> is not registered, so gv-icon ${value} renders nothing${inside}. ` +
		`Import it once in your app:\n  import '@phosphor-icons/webcomponents/${phosphorModule(sanitized)}';`
	);
};
