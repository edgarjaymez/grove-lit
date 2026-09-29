import type { ComponentMetadata } from '../metadata.js';

export const IsotypeMetadata = {
	component: {
		name: 'Isotype',
		category: 'atoms',
		description:
			'Brand logo mark rendered as an inline SVG; its fill follows the theme or a pinned tone',
		type: 'display',
		path: 'src/lib/components/Isotype/Isotype.ts',
		version: '1.1.0',
		created: '2026/02/15',
		modified: '2026/09/27'
	},
	phosphor: {
		prop: null,
		default: null,
		fixed: []
	},

	usage: {
		useCases: [
			'navbar-brand-mark',
			'hero-logo',
			'footer-logo',
			'loading-screen',
			'favicon-substitute'
		],
		requiredProps: ['color', 'size'],
		commonPatterns: [
			{
				name: 'brand-follows-theme',
				description:
					'Default tone="auto" on Ground, Terrace or Path: the 500-level fill by day, the 50-level fill at night',
				composition: `<gv-isotype color="brand" size="176"></gv-isotype>`
			},
			{
				name: 'brand-on-summit',
				description: 'Brand isotype on a Summit or Aurora surface, which is dark in both themes',
				composition: `<gv-isotype color="brand" size="176" tone="dark"></gv-isotype>`
			},
			{
				name: 'accent-on-light',
				description: 'Accent color variant for branded accent surfaces on light backgrounds',
				composition: `<gv-isotype color="accent" size="176" tone="light"></gv-isotype>`
			},
			{
				name: 'base-neutral',
				description: 'Neutral monochrome isotype for low-emphasis contexts',
				composition: `<gv-isotype color="base" size="40" tone="light"></gv-isotype>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Using tone="light" on a dark background',
				reason:
					'Light-tone fills (500-level colors) are designed for light surfaces — they lose contrast on dark backgrounds',
				alternative:
					'Use tone="dark" on Summit and Aurora; leave the default tone="auto" on Ground, Terrace and Path'
			},
			{
				scenario: 'Using tone="dark" on a light background',
				reason:
					'Dark-tone fills (50-level colors) are near-white and become invisible on light surfaces',
				alternative:
					'Leave the default tone="auto" on Ground, Terrace and Path — it picks the light fill by day'
			},
			{
				scenario: 'Leaving tone="auto" on a Summit or Aurora surface',
				reason:
					'Summit and Aurora are dark in both themes, so by day auto picks the 500-level fill and it disappears into a 500-level surface',
				alternative: 'Pin tone="dark" on Summit and Aurora'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: null,
		parentConstraints: null
	},

	behavior: {
		states: ['DEFAULT'],
		interactions: null
	},

	variants: {
		color: {
			options: ['brand', 'accent', 'base'],
			default: 'brand',
			purpose: {
				brand: 'Primary brand identity. Default for most logo placements.',
				accent: 'Accent palette variant for surfaces where the brand color would clash.',
				base: 'Neutral monochrome. Use when color should not compete with surrounding content.'
			}
		},
		tone: {
			options: ['auto', 'light', 'dark'],
			default: 'auto',
			purpose: {
				auto: 'Follows the theme through light-dark(): the light fill by day, the dark fill at night. For Ground, Terrace and Path. Browsers without light-dark() keep the light fill.',
				light:
					'Pins the high-saturation fills (500-level; base: base/dark) in both themes, for surfaces that stay light.',
				dark: 'Pins the low-saturation fills (50-level; base: base/light) in both themes, for Summit and Aurora, which are dark in both.'
			}
		}
	},

	accessibility: {
		role: 'img when label is provided, otherwise aria-hidden="true"',
		keyboardSupport: 'None — decorative or static brand mark',
		screenReader:
			'Pass label="Grove" for a standalone logo; omit label when the isotype is decorative or sits next to a visible wordmark',
		wcag: 'AA',
		notes: [
			'label prop drives semantics: provided → role="img" + aria-label; omitted → aria-hidden="true"',
			'Match tone to the surface contrast ratio to satisfy WCAG 1.4.3'
		]
	},

	aiHints: {
		priority: 'medium',
		keywords: ['logo', 'isotype', 'brand', 'mark', 'symbol', 'wordmark', 'identity'],
		selectionCriteria: {
			use: 'Whenever a brand logo mark is needed — navbars, hero sections, footers, loading states',
			skip: 'Do not recreate with a raw SVG or img tag — always use this component to ensure correct token-driven fill colors'
		}
	}
} satisfies ComponentMetadata;
