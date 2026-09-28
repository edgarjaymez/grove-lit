export const TextureMetadata = {
	component: {
		name: 'Texture',
		category: 'atoms',
		description:
			'Absolutely positioned SVG noise overlay that adds organic grain to surfaces. The grain colour follows the theme and can be tinted; its coarseness is tunable.',
		type: 'display',
		path: 'src/lib/components/Texture/Texture.ts',
		version: '1.2.0',
		created: '2026/02/18',
		modified: '2026/09/28'
	},

	usage: {
		useCases: [
			'surface-texture-on-summit',
			'surface-texture-on-terrace',
			'surface-texture-on-ground'
		],
		requiredProps: [],
		commonPatterns: [
			{
				name: 'on-brand',
				description: 'Full-strength grain on the darkest brand surface',
				composition: `<div style="position: relative; overflow: hidden; background-color: var(--semantic-color-surface-brand-summit);">
  <gv-texture></gv-texture>
  <div style="position: relative;">
    <h2>Heading</h2>
    <p>Content paints above the grain because it is positioned and comes after the texture.</p>
  </div>
</div>`
			},
			{
				name: 'on-accent',
				description: 'Reduced grain on terrace surfaces to avoid overpowering the surface',
				composition: `<div style="position: relative; overflow: hidden; background-color: var(--semantic-color-surface-accent-terrace);">
  <gv-texture opacity="0.4"></gv-texture>
  <div style="position: relative;">
    <p>Content</p>
  </div>
</div>`
			},
			{
				name: 'on-ground',
				description: 'Subtle grain on light ground surfaces',
				composition: `<div style="position: relative; overflow: hidden; background-color: var(--semantic-color-surface-ground);">
  <gv-texture opacity="0.25"></gv-texture>
  <div style="position: relative;">
    <p>Content</p>
  </div>
</div>`
			},
			{
				name: 'tinted',
				description:
					'Grain in the surface’s own colour family, from a token, with a light-dark() pair when it must change with the theme',
				composition: `<gv-texture opacity="0.55" tint="color-mix(in srgb, var(--color-accent-700) 12%, transparent)"></gv-texture>`
			},
			{
				name: 'coarse',
				description: 'A coarser grain for dark, low-detail scenes',
				composition: `<gv-texture opacity="0.6" frequency="0.12"></gv-texture>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Parent container lacks position: relative and overflow: hidden',
				reason:
					'Texture uses position: absolute; inset: 0 — without a positioned ancestor it escapes its intended bounds',
				alternative:
					'Always wrap Texture inside a container with position: relative and overflow: hidden'
			},
			{
				scenario: 'Text or other content placed in the surface without position',
				reason:
					'The texture host is positioned (z-index: 0), and CSS paints positioned layers after in-flow content, so the grain is drawn over unpositioned text',
				alternative:
					'Wrap content in an element with position: relative that comes after gv-texture in DOM order'
			},
			{
				scenario: 'Passing an opaque colour as tint',
				reason:
					'The tint is painted as given, so an opaque colour turns the grain into solid speckles',
				alternative:
					'Give the tint an alpha, e.g. color-mix(in srgb, var(--token) 10%, transparent)'
			},
			{
				scenario: 'Using full opacity (1) on light surfaces',
				reason:
					'The green-tinted grain is too heavy on light backgrounds and dominates the surface',
				alternative: 'Scale opacity down — 0.4 for Accent, 0.25 or lower for Ground'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: null,
		parentConstraints: [
			'Parent must have position: relative',
			'Parent must have overflow: hidden to clip the SVG to its shape',
			'Content that must sit above the grain is positioned (e.g. position: relative) and comes after gv-texture in DOM order. Unpositioned content paints under the grain whatever its order.'
		]
	},

	behavior: {
		states: ['DEFAULT'],
		interactions: {
			pointer: 'None — pointer-events: none ensures the texture never blocks clicks'
		}
	},

	variants: {
		tint: {
			options: ['any CSS colour, including var() and light-dark()'],
			default: 'theme default',
			purpose: {
				default:
					'Unset: green at 10 % by day, brand-50 at 10 % at night (light-dark(); browsers without it keep the day value).',
				custom:
					'Painted as given, so include the alpha. An invalid colour, or a var() that does not resolve, falls back to the next source instead of turning black.',
				'--gv-texture-tint':
					'CSS custom property that tints every gv-texture below the element that sets it, so a theme or scene can retint without markup. A tint attribute wins over it.'
			}
		},
		frequency: {
			options: ['positive number'],
			default: 0.25,
			purpose: {
				default: 'The daytime grain.',
				coarse:
					'0.12: a coarser grain for dark, low-detail scenes. Anything that is not a positive number means 0.25.'
			}
		}
	},

	accessibility: {
		role: 'none (the rendered svg is aria-hidden="true"; the host gets no role)',
		keyboardSupport: 'None — decorative element with no interactive role',
		screenReader:
			'Hidden from assistive technology: the only thing it renders, its svg, carries aria-hidden="true". Attributes a page sets on the host are left alone.',
		wcag: 'AA',
		notes: [
			'pointer-events: none ensures the overlay never interferes with interactive elements beneath it'
		]
	},

	aiHints: {
		priority: 'low',
		keywords: [
			'texture',
			'noise',
			'grain',
			'overlay',
			'decorative',
			'surface',
			'background',
			'depth'
		],
		selectionCriteria: {
			use: 'When a surface needs tactile, organic depth — especially Summit or Terrace surfaces in hero or feature sections',
			skip: 'Content-heavy surfaces where the grain could reduce legibility of small text or fine graphics'
		}
	}
};
