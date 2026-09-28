// DOM-free helpers for gv-icon's registration check, kept apart so node tests can reach them.

declare const process: { env: { NODE_ENV?: string } };

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

/** True the first time a tag is reported on this page, false after. */
export const claimReport = (tag: string) => {
	if (reported.has(tag)) return false;
	reported.add(tag);
	return true;
};

/** Test hook: forget which tags were reported. */
export const resetReports = () => reported.clear();

/**
 * The check is off only when the consumer's bundler has replaced `process.env.NODE_ENV` with
 * "production". Grove's own library build leaves the expression alone, and an unbundled page (a CDN
 * import) has no `process`, so both keep the warning.
 */
export const warningsEnabled = () => {
	try {
		return process.env.NODE_ENV !== 'production';
	} catch {
		return true;
	}
};

export const missingGlyphMessage = ({
	name,
	tag,
	host
}: {
	name: string;
	tag: string;
	host?: string;
}) => {
	const sanitized = tag.slice(3);
	const value = sanitized === name ? `name="${name}"` : `name="${name}" (read as "${sanitized}")`;
	const inside = host ? ` (inside <${host}>)` : '';
	return (
		`[grove] <${tag}> is not registered, so gv-icon ${value} renders nothing${inside}. ` +
		`Import it once in your app:\n  import '@phosphor-icons/webcomponents/${phosphorModule(sanitized)}';`
	);
};
