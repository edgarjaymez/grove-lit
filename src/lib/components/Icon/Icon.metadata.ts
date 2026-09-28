import type { ComponentMetadata } from '../metadata.js';

export const IconMetadata = {
	component: {
		name: 'Icon',
		category: 'atoms',
		description:
			'Phosphor icon rendered as an SVG via @phosphor-icons/webcomponents, supports regular and filled weights',
		type: 'display',
		path: 'src/lib/components/Icon/Icon.ts',
		version: '2.1.0',
		created: '2026/02/15',
		modified: '2026/09/28'
	},
	phosphor: {
		prop: 'name',
		default: null,
		fixed: []
	},

	usage: {
		useCases: [
			'inline-icon-in-button',
			'icon-in-navigation',
			'icon-in-form-field',
			'standalone-decorative-icon',
			'status-indicator'
		],
		requiredProps: ['name'],
		commonPatterns: [
			{
				name: 'regular',
				description: 'Default outlined weight — use in most contexts',
				composition: `<gv-icon name="tree"></gv-icon>`
			},
			{
				name: 'filled',
				description: 'Filled weight for selected, active, or toggled states',
				composition: `<gv-icon name="tree" is-filled></gv-icon>`
			},
			{
				name: 'fill-on-hover',
				description: 'Transitions from regular to filled on hover — use for interactive affordance',
				composition: `<gv-icon name="tree" fill-in-hover></gv-icon>`
			},
			{
				name: 'standalone-meaningful',
				description:
					'A glyph that carries meaning with no adjacent text, such as a status mark in a table cell: label names it',
				composition: `<gv-icon name="warning-circle" is-filled label="Warning"></gv-icon>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Setting color directly on the Icon component',
				reason: 'The icon uses color: inherit — color must be set on the parent element',
				alternative:
					'Wrap in a parent that carries the correct text token, or rely on the surface text color cascade'
			},
			{
				scenario: 'Using isFilled and fillInHover together',
				reason:
					'isFilled renders the fill weight unconditionally; fillInHover is redundant and misleading when isFilled is already true',
				alternative:
					'Use isFilled for persistent filled state, fillInHover for hover-only transitions'
			},
			{
				scenario: 'Forgetting to register the named icon in the consuming app',
				reason:
					'gv-icon only emits the <ph-{name}> tag; the SVG comes from @phosphor-icons/webcomponents, which the app must import. Outside production builds, a glyph still unregistered 2 s after the page loads logs one console warning with the import to add.',
				alternative:
					'Import the icon you use, e.g. `import \'@phosphor-icons/webcomponents/PhTree\'` for name="tree", plus the default and fixed glyphs listed in the `phosphor` field of each component you place'
			},
			{
				scenario: 'Putting aria-label on gv-icon, or a label on an icon inside a named control',
				reason:
					'aria-label on the host names nothing unless the page also sets a role; inside a button or link the control already carries the name, so a labelled glyph is announced twice',
				alternative:
					'Use label for a glyph that means something on its own; leave it unset inside a named control'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: null,
		commonPartners: [
			{ name: 'Button', source: '../Button/Button.js' },
			{ name: 'IconButton', source: '../IconButton/IconButton.js' }
		],
		parentConstraints: [
			'Parent must set a color token — Icon inherits color from its nearest colored ancestor'
		]
	},

	behavior: {
		states: ['DEFAULT', 'hover (fill-on-hover only)'],
		interactions: {
			hover: 'Switches from the regular to the fill weight when fillInHover is true'
		}
	},

	variants: {
		weight: {
			options: ['regular', 'filled'],
			default: 'regular',
			purpose: {
				regular: 'Outlined icon. Default for all static and non-selected states.',
				filled: 'Solid icon. Use for selected, active, toggled, or high-emphasis states.'
			}
		}
	},

	accessibility: {
		role: 'img when label is set; otherwise none (the glyph is aria-hidden)',
		keyboardSupport: 'None — not focusable',
		screenReader:
			'Decorative and hidden from assistive technology unless label is set. With label, the glyph is exactly one image named by it, for every weight and while hovered. An empty or blank label counts as none.',
		wcag: 'AA',
		notes: [
			'label, like gv-isotype’s, is the accessible name only; it is never shown.',
			'Leave label unset inside a named control (button, link, menu item): the control carries the meaning.',
			'Use label rather than aria-label on gv-icon. The component never touches host attributes, so a page’s own aria-hidden on the host still hides the glyph, and a page’s own role="img" + aria-label still work.',
			'The name string is never read aloud; only label is.'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: ['icon', 'symbol', 'glyph', 'phosphor', 'pictogram'],
		selectionCriteria: {
			use: 'Any time a Phosphor icon is needed — inside buttons, nav items, form fields, or as standalone decorative marks. Pass the kebab-case Phosphor icon name (e.g. "heart", "address-book", "gear").',
			skip: 'Do not render a raw <span> or <i> with a font class — always use this component to ensure correct sizing, color inheritance, and fill behavior'
		}
	}
} satisfies ComponentMetadata;
