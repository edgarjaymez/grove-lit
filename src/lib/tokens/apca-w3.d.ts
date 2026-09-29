// apca-w3 ships no type declarations. Only the two functions the contrast gate calls are declared,
// in their default (numeric) form.
declare module 'apca-w3' {
	/** Linear luminance Y from 8-bit sRGB (0-255). */
	export function sRGBtoY(rgb: readonly number[]): number;
	/** Signed Lc: positive for dark text on a light background, negative for light on dark. */
	export function APCAcontrast(txtY: number, bgY: number): number;
}
