/** The six colour tracks a surface can belong to. */
export type GroveTrack = 'accent' | 'brand' | 'danger' | 'gray' | 'information' | 'success';

/**
 * Every Grove surface, in token spelling: `--semantic-color-surface-{surface}`. Aurora surfaces are
 * transient (a highlight, hover or press over a resting surface), never a resting container.
 */
export type GroveSurface =
	| 'ground'
	| `${GroveTrack}-terrace`
	| 'brand-path'
	| 'gray-path'
	| `${GroveTrack}-summit`
	| `${GroveTrack}-aurora`;

const TRACKS: readonly GroveTrack[] = [
	'accent',
	'brand',
	'danger',
	'gray',
	'information',
	'success'
];

/** Every GroveSurface, resting ones first. */
export const GROVE_SURFACES: readonly GroveSurface[] = [
	'ground',
	...TRACKS.map((t) => `${t}-terrace` as const),
	'brand-path',
	'gray-path',
	...TRACKS.map((t) => `${t}-summit` as const),
	...TRACKS.map((t) => `${t}-aurora` as const)
];

/** Whether a surface is a transient aurora highlight rather than a resting container. */
export const isAurora = (surface: GroveSurface) => surface.endsWith('-aurora');
