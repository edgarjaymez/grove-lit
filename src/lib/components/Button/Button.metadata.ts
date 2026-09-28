import type { ComponentMetadata } from '../metadata.js';

export const ButtonMetadata = {
	component: {
		name: 'Button',
		category: 'atoms',
		description:
			'Primary interactive element for triggering actions. Supports visual hierarchy through style and color variants, optional leading icon, and three sizes.',
		type: 'interactive',
		path: 'src/lib/components/Button/Button.ts',
		version: '1.1.1',
		created: '2026/03/08',
		modified: '2026/05/30'
	},
	phosphor: {
		prop: 'icon',
		default: null,
		fixed: []
	},

	usage: {
		useCases: [
			'primary-call-to-action',
			'secondary-action',
			'cancel-or-dismiss',
			'form-submission',
			'inline-action-in-card-or-modal',
			'toolbar-text-action'
		],

		requiredProps: ['text'],

		commonPatterns: [
			{
				name: 'page-level-cta',
				description: 'Primary action on a landing section or hero — highest visual prominence',
				composition: `<gv-button text="Get Started" variant="filled" color="accent" size="lg"></gv-button>`
			},
			{
				name: 'form-submit',
				description: 'Confirm or submit action in a form, matched to input height with md size',
				composition: `<gv-button text="Save changes" variant="filled" color="accent" size="md"></gv-button>`
			},
			{
				name: 'primary-action',
				description: 'Alternative action paired alongside a primary filled button',
				composition: `<gv-button text="Learn more" variant="tonal" color="accent" size="md"></gv-button>`
			},
			{
				name: 'secondary-button',
				description: 'Low-prominence dismiss or cancel action — should not compete visually',
				composition: `<gv-button text="Cancel" variant="outlined" color="gray" size="md"></gv-button>`
			},
			{
				name: 'tertiary-action',
				description: 'Tertiary or contextual action with minimal visual weight',
				composition: `<gv-button text="View details" variant="ghost" color="gray" size="sm"></gv-button>`
			}
		],

		antiPatterns: [
			{
				scenario: 'Multiple filled buttons competing in the same section',
				reason: 'Filled is the highest-prominence style — having two creates hierarchy confusion',
				alternative: 'Use one filled for the primary action; use tonal or outlined for others'
			},
			{
				scenario: 'Using Button for page navigation',
				reason: 'Buttons trigger actions; links navigate to new pages or routes',
				alternative: 'Use an anchor tag or a Link component styled as a button'
			},
			{
				scenario: 'Long or multi-clause text labels',
				reason: 'Buttons should be concise and scannable',
				alternative: 'Use short action verbs — ideally 1–4 words (e.g. "Save", "Get started")'
			},
			{
				scenario: 'Using ghost style for a primary action',
				reason: 'Ghost buttons have minimal affordance and can be missed by users',
				alternative:
					'Reserve ghost for tertiary or in-context utility actions; use filled or tonal for primary'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [{ name: 'Icon', source: '../Icon/Icon.js' }],
		commonPartners: ['IconButton', 'Input', 'Modal', 'Card', 'Form'],
		parentConstraints: null
	},

	behavior: {
		states: ['DEFAULT', 'hover', 'active', 'disabled'],

		interactions: {
			click: 'Triggers onclick handler',
			hover: 'Background transitions to aurora surface level; icon switches to filled variant',
			active: 'Background stays at aurora level; drop shadow removed',
			focus: 'Visible focus ring applied by global surface-scoped CSS — do not override',
			disabled: '50% opacity; cursor changes to not-allowed; pointer events blocked'
		}
	},

	variants: {
		style: {
			options: ['filled', 'tonal', 'outlined', 'ghost'],
			default: 'filled',
			purpose: {
				filled: 'Highest visual prominence with elevation shadow. Main CTA in a section.',
				tonal:
					'Medium prominence on a terrace surface. Secondary action that still needs visual weight.',
				outlined:
					'Low prominence with a border and transparent fill. Alternative or cancel actions.',
				ghost:
					'Minimal visual weight — no border or fill until hovered. Tertiary or in-context actions.'
			}
		},
		color: {
			options: ['accent', 'gray'],
			default: 'accent',
			purpose: {
				accent:
					'Primary brand emphasis. Default when the action is the main thing a user should do.',
				gray: 'Neutral emphasis. Use when the action is utility or should not compete with an accent action nearby.'
			}
		},
		size: {
			options: ['lg', 'md', 'sm'],
			default: 'md',
			purpose: {
				lg: 'Standalone or page-level primary actions with generous tap target.',
				md: 'Default for most contexts: forms, cards, modals, and grouped action rows.',
				sm: 'Compact UI such as table rows or inline controls where space is constrained.'
			}
		}
	},

	accessibility: {
		role: 'button',
		keyboardSupport: 'Native browser support — Space/Enter to activate',
		screenReader: 'Announces button role with visible text content as the accessible name',
		focusManagement:
			'Focus ring applied by global surface-scoped CSS; component must not declare its own focus styles',
		wcag: 'AA',
		notes: [
			'The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.',
			'text prop is the accessible name — keep it descriptive and action-oriented',
			'Disabled state uses the HTML disabled attribute; pointer events are blocked natively',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: ['button', 'cta', 'submit', 'action', 'click', 'trigger', 'call-to-action'],
		context:
			'Use for any user-initiated action. Choose style and color based on visual hierarchy: filled accent for primary, tonal for secondary, outlined/ghost for tertiary. Add icon for reinforcement, never as the sole label.'
	}
} satisfies ComponentMetadata;
