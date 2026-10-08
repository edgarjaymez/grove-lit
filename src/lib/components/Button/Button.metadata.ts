import type { ComponentMetadata } from '../metadata.js';

export const ButtonMetadata = {
	component: {
		name: 'Button',
		category: 'atoms',
		description:
			'Primary interactive element for triggering actions. Supports visual hierarchy through style and color variants, optional leading icon, and three sizes. In a form, type="submit" and type="reset" act on it; with href it renders a real link with the same look.',
		type: 'interactive',
		path: 'src/lib/components/Button/Button.ts',
		version: '1.3.0',
		created: '2026/03/08',
		modified: '2026/10/08'
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
			'form-reset',
			'link-styled-as-button',
			'inline-action-in-card-or-modal',
			'toolbar-text-action'
		],

		requiredProps: [],

		commonPatterns: [
			{
				name: 'slotted-text',
				description:
					'Pass the text as content; it names the button and is in the server HTML. The text prop is the fallback when the slot is empty.',
				composition: '<gv-button variant="filled">Save changes</gv-button>'
			},
			{
				name: 'page-level-cta',
				description: 'Primary action on a landing section or hero — highest visual prominence',
				composition: `<gv-button text="Get Started" variant="filled" color="accent" size="lg"></gv-button>`
			},
			{
				name: 'form-submit',
				description:
					'Submits its form like a native submit button: validation, then a cancelable submit event. With no native submit button in the form, Enter in a text field activates the first type="submit" gv-button. After its own submission it disables itself; a page that handles submit itself sets disabled = false when its request settles.',
				composition: `<form action="/contact" method="post">
	<label>Email <input name="email" type="email" required /></label>
	<gv-button type="submit">Send</gv-button>
</form>`
			},
			{
				name: 'form-reset',
				description: 'Resets its form to the initial values, through a cancelable reset event',
				composition: `<gv-button type="reset" variant="outlined" color="gray">Clear</gv-button>`
			},
			{
				name: 'named-submits',
				description:
					'Two submit buttons the handler tells apart: each adds its name and value to the form data its own submission builds. event.submitter stays null, so read new FormData(form) in the submit listener.',
				composition: `<form>
	<gv-button type="submit" name="intent" value="draft" variant="tonal">Save draft</gv-button>
	<gv-button type="submit" name="intent" value="publish">Publish</gv-button>
</form>`
			},
			{
				name: 'submit-from-outside-the-form',
				description: 'A submit button placed outside its form, pointing at it by id',
				composition: `<gv-button type="submit" form="checkout">Pay now</gv-button>`
			},
			{
				name: 'link-cta',
				description:
					'A call to action that navigates: href renders a real link with the button look, so middle click, modified clicks and the context menu work',
				composition: `<gv-button href="/contact" size="lg">Get in touch</gv-button>`
			},
			{
				name: 'external-link',
				description: 'Opens in a new tab; rel="noopener noreferrer" is added unless rel is set',
				composition: `<gv-button href="https://example.com/case" target="_blank" variant="outlined">Read the case</gv-button>`
			},
			{
				name: 'disabled-link',
				description:
					'A link that is not available yet: rendered without href, out of the tab order, announced as a disabled link',
				composition: `<gv-button href="/beta" disabled>Join the beta</gv-button>`
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
				scenario: 'Wrapping gv-button in an <a> to make a link',
				reason:
					'The button is interactive content inside the anchor, so it takes the click and the anchor never navigates (Firefox does nothing at all)',
				alternative: 'Set href on gv-button: it renders a real link with the same look'
			},
			{
				scenario: 'Slotting gv-button into a component that renders its <form> in its shadow root',
				reason:
					'Form association follows the DOM tree, not slots: the button has no form, so submit and reset do nothing. Development builds log one warning naming the component.',
				alternative:
					'Keep the <form> and its controls in one tree: render both in the same template, or slot the whole light-DOM <form> into the component'
			},
			{
				scenario: 'Handling submit yourself without re-enabling the button',
				reason:
					'After its own submission the button stays disabled until disabled is set back to false or the form is reset, so a form used twice without a page load keeps a dead button',
				alternative:
					'Set disabled = false when the request settles, in a finally block, or reset the form after a success'
			},
			{
				scenario:
					'Reading event.submitter, or building FormData after an await, to tell which button was pressed',
				reason:
					'submitter is null for gv-button, and its name and value are only in form data built during its own submission',
				alternative: 'Build new FormData(form) at the top of the submit listener'
			},
			{
				scenario: 'A native <button> or <input> as slotted or fallback content',
				reason:
					'A light-DOM submit button is a native submit button of the form: it takes Enter away from the gv-button, and nests one control inside another',
				alternative: 'Slot text and phrasing content only'
			},
			{
				scenario: 'Styling a link-mode gv-button through :disabled',
				reason:
					'In a disabled fieldset the host matches :disabled, but a link-mode gv-button stays a working link',
				alternative: 'Target the disabled attribute, gv-button[disabled]'
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
		slots: [
			{
				name: '',
				description:
					'The button text, or the link text in link mode. Text and phrasing content only, never a form control.',
				fallback: 'text'
			}
		],
		nestedComponents: [{ name: 'Icon', source: '../Icon/Icon.js' }],
		commonPartners: ['IconButton', 'Input', 'Modal', 'Card', 'Form'],
		parentConstraints: [
			'To take part in a form, gv-button must be in the same tree as the <form>: inside it, or pointing at it with form="id". A <form> in another component\'s shadow root does not own controls slotted into it.'
		]
	},

	behavior: {
		states: ['DEFAULT', 'hover', 'active', 'disabled', 'submitting'],

		interactions: {
			click:
				'Button mode: dispatches click; with type="submit" or "reset", submits or resets its form in the next task unless a listener cancelled the click. Link mode (href): the browser follows the link.',
			enter:
				'In a form with no native submit button, Enter in a text field activates the first rendered type="submit" gv-button; a disabled one blocks Enter',
			submitting:
				'After a submission it started, the button sets disabled and matches :state(submitting) until disabled is set back to false, the form is reset, or the page returns from the back/forward cache',
			hover: 'Background transitions to aurora surface level; icon switches to filled variant',
			active: 'Background stays at aurora level; drop shadow removed',
			focus:
				"Grove focus ring on :focus-visible: the surrounding surface's --gv-focus-ring, else the Ground ring; a system-colour outline under forced colours",
			disabled:
				'50% opacity, cursor not-allowed, no hover or active change. Also set by a <fieldset disabled> in button mode, without writing the disabled property.'
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
		role: 'button; link with href',
		keyboardSupport:
			'Native: Space and Enter activate a button, Enter follows a link. Enter in a text field submits through the default gv-button.',
		screenReader: 'Announces button role with visible text content as the accessible name',
		focusManagement:
			'Focus is native to the internal element, which draws the Grove focus ring on :focus-visible (the focusRing fragment). The ring comes from the surrounding surface (a .gv-surface-* class or --gv-focus-ring), else --ring-on-ground; under forced colours a system-colour outline shows instead. Do not suppress it.',
		wcag: 'AA',
		notes: [
			'The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.',
			'The slotted text, or the text prop, is the accessible name: keep it descriptive and action-oriented',
			'A disabled button sets disabled on its inner <button>, which leaves the tab order. A disabled link renders without href, with role="link" and aria-disabled="true", and leaves the tab order too.',
			'When the button disables itself after a submission, focus leaves its inner <button> for the page body. A page that handles the submission moves focus to its status message, and sets disabled = false when the request settles.',
			'In a <fieldset disabled>, a link-mode gv-button stays a working link, as a native <a> does.',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: [
			'button',
			'cta',
			'submit',
			'reset',
			'form',
			'link',
			'href',
			'action',
			'click',
			'trigger',
			'call-to-action'
		],
		context:
			'Use for any user-initiated action. Choose style and color based on visual hierarchy: filled accent for primary, tonal for secondary, outlined/ghost for tertiary. Add icon for reinforcement, never as the sole label. Use href for navigation. In a <form>, type="submit" and "reset" act on it; keep the button in the same tree as the <form>, and re-enable it after handling submit yourself.'
	}
} satisfies ComponentMetadata;
