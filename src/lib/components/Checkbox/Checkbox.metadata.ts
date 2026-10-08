import type { ComponentMetadata } from '../metadata.js';

export const CheckboxMetadata = {
	component: {
		name: 'Checkbox',
		category: 'atoms',
		description:
			'A toggle input that represents a binary checked/unchecked state. Renders as a square button with a brand-green fill and white checkmark when checked, followed by the slotted label text, if any. Supports default (24px) and xl (28px) sizes. Form-associated: with name, a checked box submits value.',
		type: 'input',
		path: 'src/lib/components/Checkbox/Checkbox.ts',
		version: '1.4.0',
		created: '2026/05/20',
		modified: '2026/10/08'
	},
	phosphor: {
		prop: null,
		default: null,
		fixed: []
	},

	usage: {
		useCases: [
			'form-boolean-field',
			'multi-select-list-item',
			'toggle-setting-or-preference',
			'terms-and-conditions-agreement',
			'select-all-in-table-row',
			'filter-option'
		],

		requiredProps: [],

		commonPatterns: [
			{
				name: 'labeled-by-slot',
				description:
					'Slot the label text: it shows next to the box, names the checkbox, and a click on it toggles',
				composition: `<gv-checkbox>Subscribe to the newsletter</gv-checkbox>`
			},
			{
				name: 'labeled-by-page-label',
				description:
					'A page <label>, wrapping or pointing at the id, names the checkbox and a click on it toggles. Use it when the label text needs a link, which a slot inside the control cannot hold.',
				composition: `<gv-checkbox id="agree" name="terms"></gv-checkbox>
<label for="agree">I agree to the <a href="/terms">terms and conditions</a></label>`
			},
			{
				name: 'named-without-visible-text',
				description:
					'label names a checkbox whose visible text is elsewhere, such as a table row; it is never shown',
				composition: `<gv-checkbox label="Select row: Fern, Garden"></gv-checkbox>`
			},
			{
				name: 'form-field',
				description:
					'With name, a checked box submits value (default "on"); form.reset() restores the state it first connected with',
				composition: `<form>
  <gv-checkbox name="newsletter" value="weekly" checked>Weekly newsletter</gv-checkbox>
</form>`
			},
			{
				name: 'controlled-toggle',
				description:
					'Listen to the gv-change CustomEvent (detail: boolean) to react to state changes',
				composition: `<gv-checkbox id="my-check"></gv-checkbox>
<script>
  const el = document.querySelector('#my-check');
  el.addEventListener('gv-change', (e) => { isSelected = e.detail; });
</script>`
			},
			{
				name: 'xl-size-for-touch',
				description: 'Larger 28px size for mobile or touch-heavy contexts',
				composition: `<gv-checkbox responsive="xl"></gv-checkbox>`
			},
			{
				name: 'disabled-preset',
				description: 'Non-interactive pre-selected state for read-only displays',
				composition: `<gv-checkbox checked disabled></gv-checkbox>`
			}
		],

		antiPatterns: [
			{
				scenario: 'Using Checkbox for a single on/off toggle in settings',
				reason: 'A single binary setting is better represented by a Toggle/Switch component',
				alternative: 'Use a dedicated Toggle component for isolated on/off preference controls'
			},
			{
				scenario: 'Using Checkbox without an accessible label',
				reason: 'Screen readers will announce only the role with no meaningful name',
				alternative:
					'Slot the label text (<gv-checkbox>Subscribe</gv-checkbox>), pair it with a page <label>, or set label'
			},
			{
				scenario: 'Naming it with aria-label or aria-labelledby on the host',
				reason:
					"The host has no role, so a host aria-label names a generic element, and ids don't cross the shadow boundary. A host aria-label still names the checkbox for one minor, with a development warning.",
				alternative: 'Use the slot, a page <label>, or label'
			},
			{
				scenario: 'Slotting a link into the label text',
				reason:
					'The slot sits inside the focusable control, so a link there is a control inside a control: clicking it would also toggle',
				alternative: 'Put the text with the link in a page <label for> next to the checkbox'
			},
			{
				scenario: 'Controlling hover/focus state via the state prop',
				reason:
					'Hover and focus are CSS pseudo-class states, not props — forcing them creates incorrect behavior',
				alternative:
					"Let CSS handle :hover; the focus ring comes from the surrounding surface's --gv-focus-ring"
			}
		]
	},

	composition: {
		slots: [
			{
				name: '',
				description:
					'The label text, shown next to the box inside the focusable control: it names the checkbox and a click on it toggles. Text and phrasing content only, never a form control.',
				fallback: null
			}
		],
		nestedComponents: [],
		commonPartners: ['TextInput', 'Button', 'Form'],
		parentConstraints: null
	},

	behavior: {
		states: ['DEFAULT', 'checked', 'hover', 'active', 'disabled', 'disabled-checked'],

		interactions: {
			click:
				'Toggles checked state; dispatches a gv-change CustomEvent with detail: boolean. A click on its page <label> does the same, once.',
			hover:
				'Unchecked: border shifts to gray/aurora. Checked: background and edge shift from brand/summit to brand/aurora — the same as active until Grove has a press-state token',
			active: 'Checked: background and edge shift to brand/aurora',
			focus:
				"Grove focus ring on :focus-visible: the surrounding surface's --gv-focus-ring, else the Ground ring; a system-colour outline under forced colours",
			disabled: '50% opacity; cursor changes to not-allowed; toggle is blocked'
		}
	},

	variants: {
		responsive: {
			options: ['default', 'xl'],
			default: 'default',
			purpose: {
				default: '24×24px — standard size for desktop forms and lists.',
				xl: '28×28px — larger tap target for mobile, touch contexts, or prominent filter UIs.'
			}
		}
	},

	accessibility: {
		role: 'checkbox',
		keyboardSupport:
			'Tab to focus; Space or Enter to toggle checked state. Enter never submits the form.',
		screenReader:
			'Announces as a checkbox named by, in order, its slotted text, a page <label>, then label; then its description and checked state, which updates on toggle. The host itself is never named.',
		focusManagement:
			'Focus is native to the internal element, which draws the Grove focus ring on :focus-visible (the focusRing fragment). The ring comes from the surrounding surface (a .gv-surface-* class or --gv-focus-ring), else --ring-on-ground; under forced colours a system-colour outline shows instead. Do not suppress it.',
		wcag: 'AA',
		notes: [
			'Slotted label text names the checkbox (it sits inside the focusable control). Without it, a page <label> (wrapping, or for its id) names it, then label. A page label never overrides slotted text.',
			'description is read after the name, from a hidden element in the shadow root.',
			'Form-associated: name and value submit while checked, <fieldset disabled> disables it, and form.reset() restores the checked state it had when it first connected. The checked attribute reflects the current state, so it is not the reset default.',
			'Focus is delegated: a label click and focus() on the host reach the box.',
			'disabled prop sets the HTML disabled attribute — browser blocks pointer events natively',
			'State changes dispatch a gv-change CustomEvent (bubbles: true, composed: true) with detail: boolean — listen with addEventListener("gv-change", (e) => use(e.detail))',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: [
			'checkbox',
			'check',
			'toggle',
			'boolean',
			'select',
			'multi-select',
			'agree',
			'form-field',
			'filter'
		],
		context:
			'Use when the user needs to select or deselect a binary option, especially in lists or forms. For a single on/off toggle (like a feature switch), prefer a Toggle component. Always name it: slot the label text, use a page <label>, or set label. Use xl responsive size for touch-heavy or mobile-first contexts.'
	}
} satisfies ComponentMetadata;
