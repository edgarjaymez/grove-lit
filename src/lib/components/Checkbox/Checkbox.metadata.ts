export const CheckboxMetadata = {
	component: {
		name: 'Checkbox',
		category: 'atoms',
		description:
			'A toggle input that represents a binary checked/unchecked state. Renders as a square button with a brand-green fill and white checkmark when checked. Supports default (24px) and xl (28px) sizes.',
		type: 'input',
		path: 'src/lib/components/Checkbox/Checkbox.ts',
		version: '1.1.0',
		created: '2026/05/20',
		modified: '2026/09/27'
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
				name: 'labeled-form-field',
				description: 'Pair with a label element for accessible form inputs',
				composition: `<label style="display:flex;align-items:center;gap:8px">
  <gv-checkbox id="agree"></gv-checkbox>
  <span>I agree to the terms and conditions</span>
</label>`
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
				alternative: 'Always pair with a visible <label> or aria-label on the wrapping element'
			},
			{
				scenario: 'Controlling hover/focus state via the state prop',
				reason:
					'Hover and focus are CSS pseudo-class states, not props — forcing them creates incorrect behavior',
				alternative:
					'Let CSS handle :hover; focus ring is managed by the global surface-scoped system'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [],
		commonPartners: ['TextInput', 'Button', 'Form'],
		parentConstraints: null
	},

	behavior: {
		states: ['DEFAULT', 'checked', 'hover', 'active', 'disabled', 'disabled-checked'],

		interactions: {
			click: 'Toggles checked state; dispatches a gv-change CustomEvent with detail: boolean',
			hover:
				'Unchecked: border shifts to gray/aurora. Checked: background and edge shift from brand/summit to brand/aurora — the same as active until Grove has a press-state token',
			active: 'Checked: background and edge shift to brand/aurora',
			focus: 'Visible focus ring applied by global surface-scoped CSS — do not override',
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
		keyboardSupport: 'Tab to focus; Space to toggle checked state',
		screenReader:
			'Announces as checkbox with aria-checked=true/false reflecting current state; updates on toggle',
		focusManagement:
			'Focus ring applied by global surface-scoped CSS; component must not declare its own focus styles',
		wcag: 'AA',
		notes: [
			'Always wrap in a <label> or use aria-label/aria-labelledby for an accessible name',
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
			'Use when the user needs to select or deselect a binary option, especially in lists or forms. For a single on/off toggle (like a feature switch), prefer a Toggle component. Always pair with a label for accessibility. Use xl responsive size for touch-heavy or mobile-first contexts.'
	}
};
