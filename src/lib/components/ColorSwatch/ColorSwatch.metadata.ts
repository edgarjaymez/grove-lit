export const ColorSwatchMetadata = {
	component: {
		name: 'ColorSwatch',
		category: 'atoms',
		description:
			'Displays a primitive color token as a labeled swatch with color preview, OKLCH value, and hex value. Used in design system documentation and Storybook color pages.',
		type: 'documentation',
		path: 'src/lib/components/ColorSwatch/ColorSwatch.ts',
		version: '1.0.0',
		created: '2026/05/31',
		modified: '2026/05/31'
	},

	usage: {
		useCases: ['color-token-documentation', 'design-system-palette-page', 'storybook-color-story'],
		requiredProps: ['color', 'shade'],
		commonPatterns: [
			{
				name: 'light-swatch',
				description: 'Light shade with dark text — use for shades 50–400',
				composition: `<gv-color-swatch color="brand" shade="50" name="Brand 50" text="dark" oklch="0.93 0.035 145" hex="#DAEFDA"></gv-color-swatch>`
			},
			{
				name: 'dark-swatch',
				description: 'Dark shade with light text — use for shades 500–950',
				composition: `<gv-color-swatch color="brand" shade="700" name="Brand 700" text="light" oklch="0.38 0.075 145" hex="#214522"></gv-color-swatch>`
			},
			{
				name: 'base-swatch',
				description: 'Base color (light or dark variant)',
				composition: `<gv-color-swatch color="base" shade="dark" name="Base Dark" text="light" oklch="0.15 0 0" hex="#0B0B0B"></gv-color-swatch>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Using ColorSwatch in production UI',
				reason: 'This is a documentation-only component — it has no interactive states',
				alternative: 'Use semantic surface tokens and surface components for production UI'
			},
			{
				scenario: 'Passing a raw CSS color to background instead of color + shade props',
				reason:
					'The component resolves the background via --color-{family}-{shade} tokens for design system fidelity',
				alternative: 'Always pass color and shade props that correspond to a real Grove color token'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: null,
		commonPartners: null,
		parentConstraints: [
			'Should be placed inside a surface that loads tokens.css — the component relies on CSS custom properties from the Grove token system'
		]
	},

	behavior: {
		states: ['DEFAULT'],
		interactions: {}
	},

	variants: {
		text: {
			options: ['dark', 'light'],
			default: 'dark',
			purpose: {
				dark: 'Use --color-base-dark for the name label — suitable for light swatches (shades 50–400)',
				light:
					'Use --color-base-light for the name label — suitable for dark swatches (shades 500–950)'
			}
		}
	},

	accessibility: {
		role: 'presentation',
		keyboardSupport: 'None — decorative display component',
		screenReader:
			'Color values are rendered as plain text and are readable by assistive technology',
		wcag: 'AA',
		notes: [
			'The text prop must be set to ensure the color name meets AA contrast against the swatch background',
			'Use text="dark" (--color-base-dark) for light backgrounds and text="light" (--color-base-light) for dark backgrounds'
		]
	},

	aiHints: {
		priority: 'low',
		keywords: ['color', 'swatch', 'palette', 'token', 'documentation'],
		selectionCriteria: {
			use: 'When building a color palette documentation page or a Storybook story that showcases Grove color tokens',
			skip: 'Do not use in production UI — this component has no interactive states and is for documentation only'
		}
	}
};
