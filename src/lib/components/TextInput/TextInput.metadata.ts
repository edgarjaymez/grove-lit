export const TextInputMetadata = {
	component: {
		name: 'TextInput',
		category: 'atoms',
		description:
			'Single-line text field with bottom-border styling. Supports brand and gray color tracks, error state, and disabled state. Renders a native <input> element for full browser and assistive-technology compatibility.',
		type: 'input',
		path: 'src/lib/components/TextInput/TextInput.ts',
		version: '1.2.0',
		created: '2026/05/20',
		modified: '2026/09/27'
	},

	usage: {
		useCases: [
			'form-text-field',
			'search-input',
			'login-email-or-password-field',
			'inline-edit',
			'filter-input',
			'registration-form-field'
		],

		requiredProps: [],

		commonPatterns: [
			{
				name: 'labeled-form-field',
				description: 'Standard labeled input — always pair with a <label> for accessibility',
				composition: `<label for="name-input">Full name</label>\n<gv-text-input input-id="name-input" placeholder="Jane Smith"></gv-text-input>`
			},
			{
				name: 'error-field',
				description:
					'Validation error — pair with a message element linked via aria-describedby so screen readers announce the error',
				composition: `<label for="email-input">Email</label>\n<gv-text-input input-id="email-input" error aria-describedby="email-error"></gv-text-input>\n<span id="email-error">Enter a valid email address</span>`
			},
			{
				name: 'gray-track',
				description:
					'Neutral track for surfaces where brand warmth would clash — e.g. inside a gray card or on a ground surface alongside brand content',
				composition: `<gv-text-input color="gray" placeholder="Search…"></gv-text-input>`
			},
			{
				name: 'email-field',
				description: 'Email input — use type="email" for mobile keyboard and browser validation',
				composition: `<gv-text-input type="email" input-id="email" placeholder="you@example.com" autocomplete="email"></gv-text-input>`
			},
			{
				name: 'password-field',
				description: 'Password input with browser autofill support',
				composition: `<gv-text-input type="password" input-id="password" placeholder="Password" autocomplete="current-password"></gv-text-input>`
			}
		],

		antiPatterns: [
			{
				scenario: 'Using TextInput without a label',
				reason:
					'Screen readers have no accessible name for the field — users cannot understand what to type',
				alternative:
					'Always pair with a <label for="..."> or an explicit aria-label prop on the TextInput'
			},
			{
				scenario: 'Using TextInput for multi-line content',
				reason: 'Single-line <input> — content overflows horizontally, no line wrapping',
				alternative: 'Use a Textarea component for multi-line text entry'
			},
			{
				scenario: 'Setting error and disabled simultaneously',
				reason:
					'Disabled inputs cannot be corrected — showing an error state is semantically misleading',
				alternative: 'Only set error on fields the user can currently interact with'
			},
			{
				scenario: 'Hardcoding a fixed width on TextInput',
				reason:
					'TextInput is width: 100% by default to fill its container — constraining width belongs on the parent element',
				alternative: 'Wrap TextInput in a container or form group and constrain width there'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [],
		commonPartners: ['Button', 'Form', 'Card'],
		parentConstraints: null
	},

	behavior: {
		states: ['DEFAULT', 'hover', 'focus', 'active', 'disabled', 'error'],

		interactions: {
			hover:
				'Field elevates to the aurora surface — background, bottom-border, and text all step to the aurora track (light text on a dark surface). Applies to both color tracks.',
			focus:
				'Background and text step to the summit track; the underline is already the summit border at rest; the native focus indicator shows',
			active: 'Same visual treatment as focus — active and focus share identical surface tokens',
			disabled:
				'Track-agnostic gray-terrace surface, border, and text (regardless of color prop). Cursor changes to not-allowed. Rendered as readonly + aria-disabled (not native disabled) so the field stays focusable and announced, but not editable.',
			error:
				'Danger-terrace surface and text over a danger-summit underline, regardless of color prop. Hover keeps the surface and text and steps the underline to danger-aurora. Focus keeps the surface, text and underline, so the native focus indicator is the focus cue.',
			input:
				'Dispatches a gv-input CustomEvent (detail: string) on every keystroke and a gv-change CustomEvent (detail: string) when a changed value is committed; the native input and change events are stopped at the shadow boundary. Placeholder-vs-typed-value color is handled natively (::placeholder vs the input color).'
		}
	},

	variants: {
		color: {
			options: ['brand', 'gray'],
			default: 'brand',
			purpose: {
				brand:
					'Warm brand surface — use on ground or neutral surfaces where brand emphasis is appropriate. Default for most forms.',
				gray: 'Neutral gray surface — use when the field sits on a brand-colored parent or where brand warmth would be visually excessive.'
			}
		},
		error: {
			options: [true, false],
			default: false,
			purpose: {
				true: 'Signals validation failure — overrides the color track with danger tokens. Always pair with a visible error message linked via aria-describedby.',
				false: 'Normal field state.'
			}
		},
		type: {
			options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
			default: 'text',
			purpose: {
				text: 'General single-line text entry.',
				email:
					'Email address — triggers email keyboard on mobile and enables browser email validation.',
				password:
					'Password entry — masks characters. Supports autocomplete="current-password" or "new-password".',
				search: 'Search query — may show a clear button in some browsers.',
				tel: 'Phone number — triggers numeric keyboard on mobile.',
				url: 'URL entry — triggers URL keyboard on mobile.',
				number: 'Numeric entry — triggers numeric keyboard and adds browser step controls.'
			}
		}
	},

	accessibility: {
		role: 'textbox',
		keyboardSupport: 'Native browser support — Tab to focus, type to input, Shift+Tab to move back',
		screenReader:
			'Associates accessible name via <label for> or aria-label; announces aria-invalid when error=true; links error message via aria-describedby',
		focusManagement:
			'The component declares no focus styles, so the browser’s native focus indicator shows on the inner <input> — it adapts to dark mode and forced colors. In the error state it is the only focus cue.',
		wcag: 'AA',
		notes: [
			'Always pair with a <label> element or aria-label prop — use input-id (not id) on the custom element to set the inner <input> id for <label for="..."> association',
			'When error=true, link a visible error message via aria-describedby so assistive technologies announce it',
			'aria-invalid is set automatically when error=true — do not set it manually',
			'Disabled state is implemented via readonly + aria-disabled="true" (not the native disabled attribute) so the field stays focusable and is announced by assistive technology as disabled; it is not editable',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: [
			'input',
			'text field',
			'form field',
			'text input',
			'entry',
			'type',
			'search',
			'email',
			'password',
			'login',
			'register',
			'filter'
		],
		context:
			'Use for any single-line text entry in a form or UI. Default color=brand fits most surfaces. Switch to color=gray when the parent background is brand-colored or the field should feel neutral. Set error=true with a linked aria-describedby message for validation feedback. Always wrap with a <label> or provide aria-label.'
	}
};
