import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';

/*
 * Theme cascade. Every permutation below re-declares the full token set at the same specificity
 * (0,1,0), so source order decides — and that shapes three selectors:
 *
 * - The OS-dark blocks select `:root:where(:not([data-theme="light"]))`. `:where()` adds no
 *   specificity, so `<html data-theme="light">` opts out of OS dark instead of losing to it (a
 *   plain `:root` there beat the earlier `[data-theme="light"]` block on every dark-OS machine).
 * - A nested `[data-theme="light"]` island only gets mobile values from its base block, so each
 *   breakpoint re-declares the breakpoint-dependent tokens (`grid.**`) for light islands too.
 * - Print always renders light — pages and `[data-theme]` islands alike, `color-scheme` included.
 */
const OS_DARK_ROOT = ':root:where(:not([data-theme="light"]))';

export default defineConfig({
	tokens: ['./src/lib/tokens/main.resolver.json'],
	outDir: './src/lib/tokens',

	lint: {
		rules: {
			'core/consistent-naming': ['error', { format: 'camelCase' }]
		}
	},

	plugins: [
		css({
			filename: 'tokens.css',
			// variableName: (token) => token.id.replace(/\./g, '-'),
			permutations: [
				// Base defaults (light + mobile + digital)
				{
					input: {},
					prepare: (css) =>
						`:root {
							color-scheme: light dark;
							${css}
						}`
				},

				// Theme: explicit light
				{
					input: { theme: 'light' },
					prepare: (css) =>
						`[data-theme="light"] {
							color-scheme: light;
							${css}
						}`
				},

				// Theme: dark
				{
					input: { theme: 'dark' },
					prepare: (css) =>
						`@media (prefers-color-scheme: dark) {
							${OS_DARK_ROOT} {
								color-scheme: dark;
								${css}
							}
						}

						[data-theme="dark"] {
							color-scheme: dark;
							${css}
						}`
				},

				// Breakpoint: tablet
				{
					input: { breakpoint: 'tablet' },
					prepare: (css) =>
						`@media (width >= 768px) {
							:root {
								${css}
							}
						}`
				},
				// Breakpoint: tablet + dark
				{
					input: { breakpoint: 'tablet', theme: 'dark' },
					prepare: (css) =>
						`@media (width >= 768px) and (prefers-color-scheme: dark) {
							${OS_DARK_ROOT} {
								${css}
							}
						}

						@media (width >= 768px) {
							[data-theme="dark"] {
								${css}
							}
						}`
				},
				// Breakpoint: tablet + light island (grid only — colors come from the base light block)
				{
					input: { breakpoint: 'tablet', theme: 'light' },
					include: ['grid.**'],
					prepare: (css) =>
						`@media (width >= 768px) {
							[data-theme="light"] {
								${css}
							}
						}`
				},

				// Breakpoint: laptop
				{
					input: { breakpoint: 'laptop' },
					prepare: (css) =>
						`@media (width >= 1280px) {
							:root {
								${css}
							}
						}`
				},
				// Breakpoint: laptop + dark
				{
					input: { breakpoint: 'laptop', theme: 'dark' },
					prepare: (css) =>
						`@media (width >= 1280px) and (prefers-color-scheme: dark) {
							${OS_DARK_ROOT} {
								${css}
							}
						}

						@media (width >= 1280px) {
							[data-theme="dark"] {
								${css}
							}
						}`
				},
				// Breakpoint: laptop + light island (grid only)
				{
					input: { breakpoint: 'laptop', theme: 'light' },
					include: ['grid.**'],
					prepare: (css) =>
						`@media (width >= 1280px) {
							[data-theme="light"] {
								${css}
							}
						}`
				},

				// Breakpoint: desktop
				{
					input: { breakpoint: 'desktop' },
					prepare: (css) =>
						`@media (width >= 1536px) {
							:root {
								${css}
							}
						}`
				},
				// Breakpoint: desktop + dark
				{
					input: { breakpoint: 'desktop', theme: 'dark' },
					prepare: (css) =>
						`@media (width >= 1536px) and (prefers-color-scheme: dark) {
							${OS_DARK_ROOT} {
								${css}
							}
						}

						@media (width >= 1536px) {
							[data-theme="dark"] {
								${css}
							}
						}`
				},
				// Breakpoint: desktop + light island (grid only)
				{
					input: { breakpoint: 'desktop', theme: 'light' },
					include: ['grid.**'],
					prepare: (css) =>
						`@media (width >= 1536px) {
							[data-theme="light"] {
								${css}
							}
						}`
				},

				// Media: print — always light, for pages and theme islands alike
				{
					input: { media: 'print' },
					prepare: (css) =>
						`@media print {
							:root, [data-theme] {
								color-scheme: light;
								${css}
							}
						}`
				},
				// Media: print + tablet
				{
					input: { media: 'print', breakpoint: 'tablet' },
					prepare: (css) =>
						`@media print and (width >= 768px) {
							:root, [data-theme] {
								${css}
							}
						}`
				},
				// Media: print + laptop
				{
					input: { media: 'print', breakpoint: 'laptop' },
					prepare: (css) =>
						`@media print and (width >= 1280px) {
							:root, [data-theme] {
								${css}
							}
						}`
				},
				// Media: print + desktop
				{
					input: { media: 'print', breakpoint: 'desktop' },
					prepare: (css) =>
						`@media print and (width >= 1536px) {
							:root, [data-theme] {
								${css}
							}
						}`
				}
			]
		})
	]
});
