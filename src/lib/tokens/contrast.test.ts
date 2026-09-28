/**
 * The contrast gate: Grove's colour tokens in both themes, measured from the generated `tokens.css`.
 *
 * WCAG 3 has no contrast measure yet (its Working Draft still reads "@@[contrast measure to be
 * determined]"), so this gates on what can be measured today: WCAG 2.2 AA ratios plus APCA ARC
 * Bronze floors as a supplementary measure. APCA is not a W3C standard.
 *
 * APCA comes from the unmodified `apca-w3` package by Andrew Somers (Myndex), © 2019-2022, under
 * the "W3 License for Compliant Code Only": it is used as published, its polarity (negative Lc for
 * light text on a dark background) is kept, and a newer non-breaking release is adopted when one
 * ships. The reference values below flag any change in the numbers. Its dependency `colorparsley`
 * (AGPL-3.0) is test-only and never reaches `dist/`.
 *
 * Colours come from the sRGB baseline blocks (the first `:root` and the first `[data-theme="dark"]`),
 * resolved inside their own block and rounded to 8-bit, as displayed. `tokens.css` is Terrazzo output
 * and is only ever read here: edit the JSON sources and run `pnpm build-tokens` — the sync tests fail
 * until you do.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { APCAcontrast, sRGBtoY } from 'apca-w3';
import semanticLight from './palette/semantic-color.light.tokens.json';
import semanticDark from './palette/semantic-color.dark.tokens.json';
import ringLight from './effects/ring-on.light.tokens.json';
import ringDark from './effects/ring-on.dark.tokens.json';
import shadowLight from './effects/drop-shadow-under.light.tokens.json';
import shadowDark from './effects/drop-shadow-under.dark.tokens.json';

type Rgb = [number, number, number];
type Tokens = Map<string, string>;
interface Oklch {
	l: number;
	c: number;
	h: number;
}

// Read from disk: Vitest blanks every `.css` import (`?raw` included) unless `test.css` opts in.
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

const OS_DARK = ':root:where(:not([data-theme="light"]))';
const GROUND = '--semantic-color-surface-ground';

// ---- tokens.css ----------------------------------------------------------------------------------

/** The custom properties of the first rule whose selector is exactly `selector`. */
function block(selector: string): Tokens {
	const open = css.indexOf(`${selector} {`);
	if (open === -1) throw new Error(`tokens.css has no "${selector}" block`);
	const start = css.indexOf('{', open) + 1;
	let depth = 1;
	let end = start;
	for (; depth > 0 && end < css.length; end++) {
		if (css[end] === '{') depth++;
		else if (css[end] === '}') depth--;
	}
	const body = css.slice(start, end - 1);
	return new Map([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

/** Replaces every `var(--x)` with its value from the same block, recursively. */
function resolve(tokens: Tokens, value: string, chain: string[] = []): string {
	return value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
		const next = tokens.get(name);
		if (next === undefined) throw new Error(`${[...chain, name].join(' → ')} is not declared`);
		return resolve(tokens, next, [...chain, name]);
	});
}

/** Splits a shadow list into its layers (commas only nest inside `var()` and `oklch()`). */
function layers(value: string): string[] {
	const parts: string[] = [];
	let depth = 0;
	let from = 0;
	for (let i = 0; i < value.length; i++) {
		if (value[i] === '(') depth++;
		else if (value[i] === ')') depth--;
		else if (value[i] === ',' && depth === 0) {
			parts.push(value.slice(from, i).trim());
			from = i + 1;
		}
	}
	return [...parts, value.slice(from).trim()];
}

// ---- colour maths --------------------------------------------------------------------------------

/** `oklch(48% 0.075 145)` or `oklch(48% 0.075 145 / 0.6)`; alpha is dropped. */
function parseOklch(value: string): Oklch {
	const m = /^oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)$/.exec(value.trim());
	if (!m) throw new Error(`not an oklch() colour: ${value}`);
	return { l: Number(m[1]) / 100, c: Number(m[2]), h: Number(m[3]) };
}

/** The one colour in a resolved shadow layer. */
function colourOf(layer: string): Oklch {
	const match = /oklch\([^)]*\)/.exec(layer);
	if (!match) throw new Error(`no colour in shadow layer: ${layer}`);
	return parseOklch(match[0]);
}

/** OKLCH → 8-bit sRGB through Ottosson's OKLab matrices, clipped per channel like an sRGB display. */
function toRgb({ l, c, h }: Oklch): Rgb {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const linear = [
		4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
		-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
		-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S
	];
	return linear.map((x) => {
		const v = Math.min(1, Math.max(0, x));
		return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
	}) as Rgb;
}

const hex = (rgb: Rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

/** WCAG 2.2 contrast ratio. */
function ratio(a: Rgb, b: Rgb): number {
	const luminance = (rgb: Rgb) => {
		const [r, g, bl] = rgb.map((v) => {
			const s = v / 255;
			return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** Signed APCA Lc from the unmodified apca-w3: text first, then background (polarity matters). */
const lc = (text: Rgb, bg: Rgb) => APCAcontrast(sRGBtoY(text), sRGBtoY(bg));

// ---- token JSON ----------------------------------------------------------------------------------

interface Leaf {
	path: string[];
	value: unknown;
}

/** Every `$value` leaf under `node`, with its token path. */
function leaves(node: unknown, path: string[] = []): Leaf[] {
	if (typeof node !== 'object' || node === null) return [];
	if ('$value' in node) return [{ path, value: node.$value }];
	return Object.entries(node)
		.filter(([key]) => !key.startsWith('$'))
		.flatMap(([key, child]) => leaves(child, [...path, key]));
}

const kebab = (segment: string) => segment.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** A token path → the custom property Terrazzo emits for it. */
const cssVar = (path: string[]) => `--${path.map(kebab).join('-')}`;

/** Every `{alias}` inside a JSON value → the `var()` Terrazzo emits for it, sorted. */
const aliases = (value: unknown) =>
	[...JSON.stringify(value).matchAll(/"\{([^}]+)\}"/g)]
		.map((m) => `var(${cssVar(m[1].split('.'))})`)
		.sort();

// ---- what the gate measures ----------------------------------------------------------------------

interface Pair {
	text: string;
	surface: string;
	minLc: number;
}

/** Body text (base on Ground or a terrace) takes APCA's body floor; everything else, content text. */
const floor = (role: string, level: string) =>
	role === 'base' && (level === 'ground' || level === 'terrace') ? 75 : 60;

const PAIRS: Pair[] = leaves(semanticLight.semanticColor.textOn, [
	'semanticColor',
	'textOn'
]).flatMap(({ path }) => {
	const [family, level, role] = path.length === 4 ? ['ground', 'ground', path[3]] : path.slice(2);
	const text = cssVar(path);
	const surface =
		family === 'ground' ? GROUND : cssVar(['semanticColor', 'surface', family, level]);
	const pairs = [{ text, surface, minLc: floor(role, level) }];
	// Terrace text also sits straight on Ground: transparent buttons, the gray text input.
	if (level === 'terrace' && (role === 'base' || role === 'subtle')) {
		pairs.push({ text, surface: GROUND, minLc: floor(role, level) });
	}
	return pairs;
});

const RINGS = leaves(ringLight.ringOn, ['ringOn']).map(({ path }) => cssVar(path));

/** gv-text-input's resting fill per track; its resting underline is `border-around-<track>-summit`. */
const INPUT_FILLS = {
	brand: '--semantic-color-surface-brand-terrace',
	gray: GROUND,
	danger: '--semantic-color-surface-danger-terrace'
};

const THEMES = { light: block(':root'), dark: block('[data-theme="dark"]') };

// ---- the gate ------------------------------------------------------------------------------------

describe('colour maths', () => {
	it('reproduces known values', () => {
		expect(hex(toRgb(parseOklch('oklch(48% 0.075 145)')))).toBe('#416943'); // brand-500
		// apca-w3 0.1.9 reference values
		expect(lc([0, 0, 0], [255, 255, 255])).toBeCloseTo(106.0407, 3);
		expect(lc([255, 255, 255], [0, 0, 0])).toBeCloseTo(-107.8847, 3);
		expect(lc([136, 136, 136], [255, 255, 255])).toBeCloseTo(63.0565, 3);
		expect(ratio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 6);
	});
});

describe('coverage', () => {
	it('measures every text-on token and every focus ring', () => {
		const measured = new Set([...PAIRS.map((p) => p.text), ...RINGS]);
		const declared = [...THEMES.light.keys()].filter((n) =>
			/^--(semantic-color-text-on|ring-on)-/.test(n)
		);
		expect(declared.length).toBeGreaterThan(0);
		expect(declared.filter((n) => !measured.has(n))).toEqual([]);
	});
});

describe.each(Object.entries(THEMES))('%s theme', (_theme, tokens) => {
	const rgb = (name: string) => toRgb(parseOklch(resolve(tokens, `var(${name})`)));

	it('keeps every text-on pair readable: APCA Bronze and WCAG 2.2 AA (4.5:1)', () => {
		const failures = PAIRS.flatMap(({ text, surface, minLc }) => {
			// The floor compares the magnitude; the message keeps the sign.
			const signed = lc(rgb(text), rgb(surface));
			const cr = ratio(rgb(text), rgb(surface));
			return Math.abs(signed) >= minLc && cr >= 4.5
				? []
				: [`${text} on ${surface}: Lc ${signed.toFixed(1)} (needs ${minLc}), ${cr.toFixed(2)}:1`];
		});
		expect(failures).toEqual([]);
	});

	it('keeps every focus ring at 3:1 against the surface it sits on (SC 1.4.11)', () => {
		const failures = RINGS.flatMap((ring) => {
			const [gap, stroke] = layers(resolve(tokens, `var(${ring})`)).map((l) => toRgb(colourOf(l)));
			const cr = ratio(stroke, gap);
			return cr >= 3 ? [] : [`${ring}: ${cr.toFixed(2)}:1`];
		});
		expect(failures).toEqual([]);
	});

	it('keeps the text-input underline at 3:1 against its fill and against Ground (SC 1.4.11)', () => {
		const failures = Object.entries(INPUT_FILLS).flatMap(([track, fill]) => {
			const underline = `--semantic-color-border-around-${track}-summit`;
			return [...new Set([fill, GROUND])].flatMap((bg) => {
				const cr = ratio(rgb(underline), rgb(bg));
				return cr >= 3 ? [] : [`${underline} on ${bg}: ${cr.toFixed(2)}:1`];
			});
		});
		expect(failures).toEqual([]);
	});

	it('draws every shadow in a palette colour (drift guard)', () => {
		const palette = [...tokens]
			.filter(([name]) => name.startsWith('--color-'))
			.map(([, value]) => parseOklch(value));
		const inPalette = ({ l, c, h }: Oklch) =>
			palette.some((p) => p.l === l && p.c === c && p.h === h);
		const failures = [...tokens]
			.filter(([name]) => name.startsWith('--drop-shadow-under-'))
			.flatMap(([name, value]) =>
				layers(resolve(tokens, value))
					.map(colourOf)
					.filter((colour) => !inPalette(colour))
					.map(({ l, c, h }) => `${name}: oklch(${l} ${c} ${h}) is not a palette colour`)
			);
		expect(failures).toEqual([]);
	});
});

describe('the built CSS matches the JSON sources (run pnpm build-tokens after editing them)', () => {
	it.each([
		['light', [semanticLight, ringLight, shadowLight]],
		['dark', [semanticDark, ringDark, shadowDark]]
	] as const)('%s', (theme, docs) => {
		const tokens = THEMES[theme];
		const drift = docs
			.flatMap((doc) => leaves(doc))
			.flatMap(({ path, value }) => {
				const name = cssVar(path);
				const built = tokens.get(name);
				if (built === undefined) return [`${name} is not built`];
				const got = [...built.matchAll(/var\(--[\w-]+\)/g)].map((m) => m[0]).sort();
				const want = aliases(value);
				return got.join() === want.join() ? [] : [`${name}: built ${got}, source ${want}`];
			});
		expect(drift).toEqual([]);
	});
});

describe('theme cascade (terrazzo.config.js)', () => {
	it('declares the same tokens in dark as in light', () => {
		expect([...THEMES.dark.keys()].sort()).toEqual([...THEMES.light.keys()].sort());
	});

	it('gives OS dark and [data-theme="dark"] identical values', () => {
		expect(block(OS_DARK)).toEqual(THEMES.dark);
	});

	it('lets <html data-theme="light"> opt out of OS dark at every breakpoint', () => {
		const selectors = [...css.matchAll(/prefers-color-scheme: dark\)\s*\{\s*([^{]+?)\s*\{/g)].map(
			(m) => m[1]
		);
		expect(selectors.length).toBeGreaterThan(0);
		expect(new Set(selectors)).toEqual(new Set([OS_DARK]));
	});

	it('keeps nested light islands on their breakpoint grid, ahead of print', () => {
		const islands = [
			...css.matchAll(/@media \(width >= (\d+)px\) \{\s*\[data-theme="light"\] \{([^}]*)\}/g)
		];
		expect(islands.map((m) => m[1])).toEqual(['768', '1280', '1536']);
		const names = islands.map(([, , body]) =>
			[...body.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1])
		);
		expect(names.every((n) => n.length > 0 && n.every((name) => name.startsWith('--grid-')))).toBe(
			true
		);
		expect(islands.at(-1)?.index ?? Infinity).toBeLessThan(css.indexOf('@media print'));
	});

	it('gives every theme block its color-scheme, and prints light', () => {
		expect(css).toMatch(/^:root \{\s*color-scheme: light dark;/m);
		expect(css).toMatch(/^\[data-theme="light"\] \{\s*color-scheme: light;/m);
		expect(css).toMatch(/:where\(:not\(\[data-theme="light"\]\)\) \{\s*color-scheme: dark;/);
		expect(css).toMatch(/\[data-theme="dark"\] \{\s*color-scheme: dark;/);
		expect(css).toMatch(/@media print \{\s*:root, \[data-theme\] \{\s*color-scheme: light;/);
	});
});
