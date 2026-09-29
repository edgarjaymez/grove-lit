import type { ComponentMetadata } from '../metadata.js';

export const IconButtonMetadata = {
	component: {
		name: 'IconButton',
		category: 'atoms',
		description: 'Icon-only button for triggering actions where a text label is not needed',
		type: 'interactive',
		path: 'src/lib/components/IconButton/IconButton.ts',
		version: '1.1.0',
		created: '2026/03/07',
		modified: '2026/09/28'
	},
	phosphor: {
		prop: 'icon',
		default: 'tree',
		fixed: []
	},

	usage: {
		useCases: [
			'toolbar-actions',
			'card-utility-actions',
			'modal-close',
			'media-controls',
			'inline-utility-actions',
			'floating-compact-actions'
		],

		requiredProps: ['icon', 'aria-label'],

		commonPatterns: [
			{
				name: 'toolbar-action',
				description: 'Compact action in a toolbar or action row',
				composition: `<gv-icon-button icon="tree" size="sm" variant="ghost" color="gray" aria-label="Underline text"></gv-icon-button>`
			},
			{
				name: 'card-close',
				description: 'Dismiss or close a card, modal, or panel',
				composition: `<gv-icon-button icon="tree" size="md" variant="ghost" color="gray" aria-label="Close"></gv-icon-button>`
			},
			{
				name: 'primary-icon-cta',
				description: 'Prominent icon action where color draws attention',
				composition: `<gv-icon-button icon="tree" size="lg" variant="filled" color="accent" aria-label="Add item"></gv-icon-button>`
			}
		],

		antiPatterns: [
			{
				scenario: 'Omitting aria-label',
				reason: 'Icon-only buttons have no visible text — screen readers have nothing to announce',
				alternative:
					'Always pass a descriptive aria-label matching the action (e.g. aria-label="Delete item")'
			},
			{
				scenario: 'Using IconButton for navigation',
				reason: 'Buttons trigger actions; links navigate to new pages or routes',
				alternative: 'Use an anchor tag or Link component styled as an icon button'
			},
			{
				scenario: 'Using IconButton when text would clarify the action',
				reason: 'Icon-only affordance can be ambiguous for non-standard actions',
				alternative: 'Use the Button component with an icon + text label'
			},
			{
				scenario: 'Multiple filled IconButtons competing in the same section',
				reason: 'Creates visual hierarchy confusion — filled is the highest prominence style',
				alternative: 'Use one filled for the primary action; use ghost or outlined for others'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [{ name: 'Icon', source: '../Icon/Icon.js' }],
		commonPartners: ['Button', 'Toolbar', 'Card', 'Modal', 'Input'],
		parentConstraints: null
	},

	behavior: {
		states: ['default', 'hover', 'active', 'focus', 'disabled'],

		interactions: {
			click: 'Triggers onclick handler',
			hover: 'Icon switches from DEFAULT to :hover state',
			active: 'Background stays at aurora level; drop shadow removed',
			focus:
				"Grove focus ring on :focus-visible: the surrounding surface's --gv-focus-ring, else the Ground ring; a system-colour outline under forced colours",
			disabled: '50% opacity; cursor changes to not-allowed; pointer events blocked'
		}
	},

	variants: {
		variant: {
			options: ['filled', 'tonal', 'outlined', 'ghost'],
			default: 'filled',
			purpose: {
				filled: 'Highest visual prominence with elevation shadow. Primary standalone action.',
				tonal:
					'Medium prominence using a terrace surface. Secondary action that still needs presence.',
				outlined:
					'Low prominence with a border and transparent fill. Alternative or cancel-adjacent actions.',
				ghost:
					'Minimal visual weight — no border or fill until interaction. Toolbar or in-context utility actions.'
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
			default: 'lg',
			purpose: {
				lg: 'Default size. Standalone or prominent actions.',
				md: 'Denser contexts such as toolbars, cards, or grouped action rows.',
				sm: 'Compact UI such as table rows or inline controls where space is constrained.'
			}
		}
	},

	accessibility: {
		role: 'button',
		keyboardSupport: 'Native browser support — Space/Enter to activate',
		screenReader: 'No visible text — aria-label is mandatory for an accessible name',
		focusManagement:
			'Focus is native to the internal element, which draws the Grove focus ring on :focus-visible (the focusRing fragment). The ring comes from the surrounding surface (a .gv-surface-* class or --gv-focus-ring), else --ring-on-ground; under forced colours a system-colour outline shows instead. Do not suppress it.',
		wcag: 'AA',
		notes: [
			'The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.',
			'aria-label is required on every instance — treat it as a required prop',
			'Disabled state uses both the HTML disabled attribute and aria-disabled for maximum AT compatibility',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: ['icon button', 'icon-only', 'toolbar', 'close', 'action', 'compact', 'utility'],
		context:
			'Use when an action is well-understood from its icon alone and a text label would clutter the UI. Always pair with aria-label.'
	}
} satisfies ComponentMetadata;
