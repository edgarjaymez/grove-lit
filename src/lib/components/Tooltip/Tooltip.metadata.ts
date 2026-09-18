export const TooltipMetadata = {
	component: {
		name: 'Tooltip',
		tag: 'gv-tooltip',
		path: 'src/lib/components/Tooltip/Tooltip.ts',
		category: 'molecules',
		description:
			'A floating hint bubble at summit depth, carrying the summit drop shadow as its attention cue. The simple type is a single nowrap line of icon + message; the complete type stacks an emphasized heading over a wrapping message. Accent and gray swap the surface, both text roles, and the shadow together. The is-pressed flag drops the shadow so the bubble reads as pushed down against the surface. It is the bubble only — it does not anchor, position, open, or close itself.',
		type: 'display',
		version: '1.1.0',
		created: '2026/09/16',
		modified: '2026/09/18'
	},

	usage: {
		useCases: [
			'icon-button-label',
			'copy-to-clipboard-confirmation',
			'truncated-text-reveal',
			'inline-term-definition',
			'field-level-hint'
		],
		requiredProps: ['message'],
		commonPatterns: [
			{
				name: 'simple-hint',
				description:
					'A one-line hint beside a control. Stays on one line — keep the message to a few words.',
				composition:
					'<gv-tooltip type="simple" color="accent" icon="info" message="Copy to clipboard"></gv-tooltip>'
			},
			{
				name: 'neutral-hint',
				description: 'The gray bubble for utility hints that should not read as brand emphasis.',
				composition:
					'<gv-tooltip type="simple" color="gray" icon="check" message="Copied"></gv-tooltip>'
			},
			{
				name: 'explanatory-bubble',
				description:
					'The complete type when the hint needs a titled explanation — the heading sits over a wrapping message.',
				composition:
					'<gv-tooltip type="complete" color="accent" icon="lightbulb" heading="Soft grid" message="Every spacing value is a multiple of four."></gv-tooltip>'
			},
			{
				name: 'text-only-bubble',
				description: 'Omit icon when the message carries the meaning on its own.',
				composition: '<gv-tooltip type="simple" message="Read only"></gv-tooltip>'
			},
			{
				name: 'anchored-by-the-consumer',
				description:
					'The consumer owns placement and visibility. Wrap the trigger in a positioned container and point aria-describedby at the bubble.',
				composition: `<span style="position: relative">
  <gv-icon-button icon="copy" aria-describedby="copy-tip"></gv-icon-button>
  <gv-tooltip id="copy-tip" type="simple" icon="copy" message="Copy hex"></gv-tooltip>
</span>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Expecting the component to show, hide, or position itself on hover',
				reason:
					'gv-tooltip has no open/close state, no timers, and no anchoring — it is a presentational bubble.',
				alternative:
					'Own visibility and placement in the consumer (CSS anchor positioning, a popover, or a positioning library) and render gv-tooltip inside it.'
			},
			{
				scenario: 'A long sentence in a type="simple" bubble',
				reason:
					'The simple message is white-space: nowrap, so it stretches the bubble off-screen instead of wrapping.',
				alternative: 'Use type="complete", whose message wraps under the heading.'
			},
			{
				scenario: 'Putting essential information only in a tooltip',
				reason:
					'Tooltips are transient and are not reliably reachable on touch or by all assistive tech.',
				alternative:
					'Keep critical content in the page; reserve the tooltip for supplementary hints.'
			},
			{
				scenario: 'Passing a title attribute to label the bubble',
				reason:
					'title is a global HTML attribute and renders a second, native browser tooltip on the host.',
				alternative: 'Use the heading prop (Grove standard: heading + message).'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [{ name: 'Icon', source: '../Icon/Icon.js' }],
		commonPartners: ['ColorSwatch', 'IconButton', 'Button', 'TextInput'],
		parentConstraints: [
			'Place on a positioned ancestor — the consumer owns anchoring, offset, and visibility.',
			'Lives on a floating layer above the parent surface; do not nest it inside another summit container.'
		]
	},

	behavior: {
		states: ['DEFAULT', 'PRESSED'],
		interactions: {
			'is-pressed':
				'A presentational flag, not an interaction the bubble detects — the consumer sets it. It removes the summit drop shadow over 300ms so the bubble flattens against the surface, reading as pressed. Pair it with the press it reflects (gv-color-swatch sets it while its copy confirmation shows).'
		}
	},

	variants: {
		type: {
			options: ['simple', 'complete'],
			default: 'simple',
			purpose: {
				simple:
					'A single nowrap line of optional icon + message at footnote scale. For short labels and confirmations.',
				complete:
					'An emphasized caption heading (with the icon trailing it) over a wrapping footnote message in the subtle text role. For hints that need a title and a sentence.'
			}
		},
		color: {
			options: ['accent', 'gray'],
			default: 'accent',
			purpose: {
				accent: 'Brand emphasis. Default when the hint should draw the eye.',
				gray: 'Neutral emphasis. Use for utility hints that should not compete with nearby accent UI.'
			}
		},
		isPressed: {
			options: [false, true],
			default: false,
			purpose: {
				false: 'The resting bubble, floating at summit depth on its drop shadow.',
				true: 'Shadow removed, so the bubble sits flat on the surface. Use it to echo a press the consumer just handled — not as a permanent flat style.'
			}
		}
	},

	accessibility: {
		role: 'tooltip',
		keyboardSupport:
			'None — the bubble is not focusable. The consumer keeps focus on the trigger and toggles the bubble from there (including dismissal on Escape).',
		screenReader:
			'Announced as the accessible description of its trigger when the trigger sets aria-describedby to the tooltip id. The icon is aria-hidden, so heading and message carry the text.',
		wcag: 'AA',
		notes: [
			'role="tooltip" is set on the host in connectedCallback unless the consumer already set a role.',
			'The consumer must wire aria-describedby from the trigger to the tooltip id — the component cannot do it.',
			'The decorative gv-icon is aria-hidden="true"; never put meaning in the icon alone.',
			'Never pass a title attribute — it is a global HTML attribute and would render a native browser tooltip on the host.',
			'The consuming app must import the Phosphor glyph it names, e.g. @phosphor-icons/webcomponents/PhCopy for icon="copy".'
		]
	},

	aiHints: {
		priority: 'medium',
		keywords: ['tooltip', 'hint', 'bubble', 'popover', 'hover-label', 'description', 'callout'],
		selectionCriteria: {
			use: 'When a control or value needs a short supplementary hint rendered in a floating bubble, and the consumer already owns when and where it appears.',
			skip: 'When you need anchoring, hover timing, or open/close behavior — gv-tooltip provides none of it. Also skip for persistent page-level status, which is gv-feedback-strip.'
		}
	}
};
