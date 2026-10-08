import type { ComponentMetadata } from '../metadata.js';

export const IconButtonMetadata = {
	component: {
		name: 'IconButton',
		category: 'atoms',
		description: 'Icon-only button for triggering actions where a text label is not needed',
		type: 'interactive',
		path: 'src/lib/components/IconButton/IconButton.ts',
		version: '1.2.0',
		created: '2026/03/07',
		modified: '2026/10/08'
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

		requiredProps: ['icon', 'label'],

		commonPatterns: [
			{
				name: 'toolbar-action',
				description: 'Compact action in a toolbar or action row',
				composition: `<gv-icon-button icon="tree" size="sm" variant="ghost" color="gray" label="Underline text"></gv-icon-button>`
			},
			{
				name: 'card-close',
				description: 'Dismiss or close a card, modal, or panel',
				composition: `<gv-icon-button icon="tree" size="md" variant="ghost" color="gray" label="Close"></gv-icon-button>`
			},
			{
				name: 'primary-icon-cta',
				description: 'Prominent icon action where color draws attention',
				composition: `<gv-icon-button icon="tree" size="lg" variant="filled" color="accent" label="Add item"></gv-icon-button>`
			}
		],

		antiPatterns: [
			{
				scenario: 'Omitting label',
				reason: 'Icon-only buttons have no visible text — screen readers have nothing to announce',
				alternative:
					'Always pass a descriptive label matching the action (e.g. label="Delete item")'
			},
			{
				scenario: 'Naming it with aria-label or aria-labelledby on the host',
				reason:
					"The host has no role, so a host aria-label names a generic element as well as the button, and ids don't cross the shadow boundary. A host aria-label still names the button for one minor, with a development warning.",
				alternative: 'Use label for the name and description for extra text'
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
		screenReader:
			'Announced as a button named by label, then its description. label is the only name: the button shows no text.',
		focusManagement:
			'Focus is native to the internal element, which draws the Grove focus ring on :focus-visible (the focusRing fragment). The ring comes from the surrounding surface (a .gv-surface-* class or --gv-focus-ring), else --ring-on-ground; under forced colours a system-colour outline shows instead. Do not suppress it.',
		wcag: 'AA',
		notes: [
			'The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.',
			'label is required on every instance. It is the accessible name only and never shown.',
			'description is read after the name. It is a hidden element in the shadow root, wired with aria-describedby, so it is not read twice. To pair the button with a visual gv-tooltip, pass the same text as description and mark the tooltip aria-hidden="true".',
			'A page <label> does not name it: gv-icon-button is not a form control.',
			'Disabled uses the native disabled attribute, which exposes the disabled state.',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: ['icon button', 'icon-only', 'toolbar', 'close', 'action', 'compact', 'utility'],
		context:
			'Use when an action is well-understood from its icon alone and a text label would clutter the UI. Always set label.'
	}
} satisfies ComponentMetadata;
