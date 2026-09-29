import type { ComponentMetadata } from '../metadata.js';

export const BackButtonMetadata = {
	component: {
		name: 'BackButton',
		tag: 'gv-back-button',
		path: 'src/lib/components/BackButton/BackButton.ts',
		category: 'atoms',
		description:
			'A square gray tile with a title-scale icon (default arrow-left) that navigates back one entry in browser history when activated. The icon fills on hover; the tile grows taller at wide viewports via an internal padding step.',
		type: 'interactive',
		version: '1.1.0',
		created: '2026/09/16',
		modified: '2026/09/28'
	},
	phosphor: {
		prop: 'icon',
		default: 'arrow-left',
		fixed: []
	},

	usage: {
		useCases: ['back-navigation', 'history-back-tile', 'breadcrumb-back-control'],
		requiredProps: [],
		commonPatterns: [
			{
				name: 'basic-back-tile',
				description: 'Render the default back tile with the standard label and icon',
				composition: '<gv-back-button></gv-back-button>'
			},
			{
				name: 'custom-label',
				description: 'Override the accessible name announced to assistive technology',
				composition: '<gv-back-button label="Return to previous page"></gv-back-button>'
			},
			{
				name: 'custom-icon',
				description:
					'Use a different Phosphor glyph; the consumer must import the matching icon component (see the phosphor field)',
				composition: '<gv-back-button icon="caret-left"></gv-back-button>'
			},
			{
				name: 'listen-for-back',
				description:
					'Listen to the gv-back event to run custom logic before (or instead of) history.back()',
				composition: `<gv-back-button id="my-back"></gv-back-button>
<script>
  document.querySelector('#my-back').addEventListener('gv-back', (e) => {
    console.log('navigating back');
  });
</script>`
			},
			{
				name: 'suppress-navigation',
				description:
					'Call preventDefault() in a gv-back listener to stop history.back() from firing',
				composition: `<gv-back-button id="guarded-back"></gv-back-button>
<script>
  document.querySelector('#guarded-back').addEventListener('gv-back', (e) => {
    e.preventDefault();
  });
</script>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Using gv-back-button as a generic link or href-driven navigation control',
				reason:
					'It has no href/link mode — it only calls window.history.back() and has no fallback for an empty history stack.',
				alternative: 'Use a plain anchor (or gv-menu-item) for link-style navigation'
			},
			{
				scenario: 'Disabling the tile',
				reason: 'There is no disabled state — it does not exist in the Figma source.',
				alternative: 'Conditionally render the component instead of disabling it'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [
			{
				name: 'Icon',
				customElement: 'gv-icon',
				source: '../Icon/Icon.js',
				role: 'Renders the glyph (regular weight at rest, fill weight on hover via the parent-driven custom-property swap); aria-hidden since the button carries the accessible name. The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.'
			}
		],
		commonPartners: [],
		parentConstraints: null
	},

	behavior: {
		states: ['default', 'hover'],
		interactions: {
			click:
				'Activating the button (click, Enter, or Space — native button behavior) dispatches a cancelable gv-back CustomEvent (bubbles: true, composed: true); unless a listener calls preventDefault(), window.history.back() is then invoked.',
			'gv-back':
				'Cancelable CustomEvent dispatched on activation, before window.history.back() runs; calling preventDefault() on it suppresses the navigation.'
		},
		responsive: {
			note: "Padding-block steps from --soft-grid-24 (92x92 tile) to --soft-grid-32 (92x108 tile) at a min-width: 1280px media query (Grove's laptop breakpoint, --breakpoints-laptop); padding-inline stays --soft-grid-24 throughout. This is a plain CSS media query, not a responsive prop."
		}
	},

	accessibility: {
		role: 'button (native <button> element)',
		keyboardSupport:
			'Tab focuses the button; Enter or Space activates it — standard native button keyboard behavior, no custom key handling',
		screenReader:
			'The button exposes label (default "Go back") as its accessible name via aria-label; the icon is aria-hidden="true" so it is not announced separately',
		focusManagement: 'Focus is native to the button element; no focus is managed programmatically',
		wcag: 'AA',
		notes: [
			'Focus is native to the internal element, which draws the Grove focus ring on :focus-visible (the focusRing fragment). The ring comes from the surrounding surface (a .gv-surface-* class or --gv-focus-ring), else --ring-on-ground; under forced colours a system-colour outline shows instead. Do not suppress it.',
			"Under Astro's <ClientRouter />, window.history.back() is intercepted by the router and rendered as a client-side view transition rather than a full page navigation — no Astro-specific code is required in this component",
			'There is no fallback behavior when there is no previous history entry (out of scope per the SDD spec)',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'medium',
		keywords: [
			'back button',
			'go back',
			'history back',
			'navigate back',
			'back tile',
			'previous page'
		],
		context:
			'Use for a square "go back" control that calls window.history.back(). Prefer over gv-icon-button for navigation-back use cases — gv-icon-button is pill-shaped, shadowed, tops out at a 20px icon, and its metadata forbids navigation use.'
	}
} satisfies ComponentMetadata;
