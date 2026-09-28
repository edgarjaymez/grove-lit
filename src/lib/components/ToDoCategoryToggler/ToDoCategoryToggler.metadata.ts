import type { ComponentMetadata } from '../metadata.js';

export const ToDoCategoryTogglerMetadata = {
	component: {
		name: 'ToDoCategoryToggler',
		category: 'atoms',
		description:
			'A color-coded toggle button that displays a task count and category label. Pressing it toggles a selected state and dispatches a gv-toggle CustomEvent. Used in dashboards and overview surfaces to filter or highlight task categories.',
		type: 'interactive',
		path: 'src/lib/components/ToDoCategoryToggler/ToDoCategoryToggler.ts',
		version: '1.1.0',
		created: '2026/02/18',
		modified: '2026/06/24'
	},
	phosphor: {
		prop: 'icon',
		default: 'tree',
		fixed: []
	},

	usage: {
		useCases: [
			'task-category-filter-bar',
			'dashboard-category-summary',
			'task-overview-panel',
			'multi-select-category-toggle-group'
		],

		requiredProps: ['category', 'count'],

		commonPatterns: [
			{
				name: 'category-filter-row',
				description: 'A row of togglers, one per task category, for filtering a task list',
				composition: `<gv-todo-category-toggler color="brand" category="Design" count="5"></gv-todo-category-toggler>
<gv-todo-category-toggler color="accent" category="Copy" count="2"></gv-todo-category-toggler>
<gv-todo-category-toggler color="information" category="Dev" count="8"></gv-todo-category-toggler>
<gv-todo-category-toggler color="gray" category="Other" count="1"></gv-todo-category-toggler>`
			},
			{
				name: 'pre-selected',
				description: 'Start a toggler in the selected state on mount',
				composition: `<gv-todo-category-toggler color="brand" category="Design" count="5" is-selected></gv-todo-category-toggler>`
			},
			{
				name: 'with-icon',
				description:
					'Pass a Phosphor icon name to the icon prop to render a filled glyph in the header',
				composition: `<gv-todo-category-toggler color="brand" category="Design" count="5" icon="tree"></gv-todo-category-toggler>`
			},
			{
				name: 'controlled-toggle',
				description: 'React to toggle state changes via the CustomEvent',
				composition: `<gv-todo-category-toggler id="design-cat" color="brand" category="Design" count="5"></gv-todo-category-toggler>
<script>
  document.querySelector('#design-cat').addEventListener('gv-toggle', (e) => { isActive = e.detail; });
</script>`
			},
			{
				name: 'disabled',
				description: 'Non-interactive locked state for unavailable categories',
				composition: `<gv-todo-category-toggler color="gray" category="Archived" count="0" disabled></gv-todo-category-toggler>`
			}
		],

		antiPatterns: [
			{
				scenario: 'Using ToDoCategoryToggler as a read-only count display',
				reason:
					'The component renders a <button> with aria-pressed — screen readers announce it as an interactive toggle, not a static label',
				alternative:
					'If you need a non-interactive count badge, build a dedicated display-only component'
			},
			{
				scenario: 'Mixing color tracks to convey semantic meaning (e.g. gray = inactive)',
				reason:
					'Color tracks in Grove communicate identity/branding, not status. Do not use color to imply urgency or completion.',
				alternative:
					'Use separate status indicators alongside the toggler if status must be conveyed'
			},
			{
				scenario: 'Hardcoding a numeric count without binding to data',
				reason: 'count is a numeric display value; it should reflect live data, not a static label',
				alternative: 'Pass a derived count value: count="${tasks.length}"'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [{ name: 'Icon', source: '../Icon/Icon.js' }],
		commonPartners: ['Checkbox', 'Button'],
		parentConstraints: [
			'Best placed on a Ground surface — the component provides its own Terrace elevation',
			'Avoid placing on Terrace or Summit — the drop shadow conflicts with an already-elevated parent'
		]
	},

	behavior: {
		states: ['default', 'selected', 'focus', 'disabled'],

		interactions: {
			click: 'Toggles isSelected state; dispatches a gv-toggle CustomEvent with detail: boolean',
			hover:
				'No surface change on hover — the toggler shows only its two states (Terrace when off, Summit when on)',
			active:
				'No dedicated pressed surface (deferred to a maintainer); active/pressed is conveyed by the global default focus ring',
			selected:
				'Toggled-on state: Summit surface with summit-level drop shadow; count uses summit-base, label and icon use summit-subtle',
			focus: 'Visible focus ring applied by global surface-scoped CSS — do not override',
			disabled: '50% opacity; cursor changes to not-allowed; toggle blocked'
		},

		responsive: {
			note: 'Width is auto-sized to content. Wrap multiple togglers in a flex container with wrapping enabled for narrow viewports.'
		}
	},

	variants: {
		color: {
			options: ['brand', 'accent', 'information', 'gray'],
			default: 'brand',
			purpose: {
				brand: 'Primary brand identity. Default for the main task category.',
				accent: 'Secondary brand emphasis. Use for a complementary category.',
				information: 'Informational blue. Use for reference or knowledge categories.',
				gray: 'Neutral. Use for miscellaneous or low-priority categories.'
			}
		}
	},

	accessibility: {
		role: 'button',
		keyboardSupport: 'Tab to focus; Space or Enter to toggle selected state',
		screenReader:
			'Announces as a button with aria-pressed="true/false" reflecting current state; updates on toggle',
		focusManagement:
			'Focus ring applied by global surface-scoped CSS; component must not declare its own focus styles',
		wcag: 'AA',
		notes: [
			'The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.',
			'aria-pressed is set automatically from isSelected — do not set it manually',
			'disabled prop sets the HTML disabled attribute; browser blocks pointer events natively',
			'State changes dispatch a gv-toggle CustomEvent (bubbles: true, composed: true) with detail: boolean — listen with addEventListener("gv-toggle", (e) => use(e.detail))',
			'Group multiple togglers in a <div role="group" aria-label="Filter by category"> for screen reader context',
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'medium',
		keywords: [
			'todo',
			'task',
			'category',
			'filter',
			'toggle',
			'dashboard',
			'count',
			'summary',
			'selected',
			'overview',
			'icon'
		],
		context:
			'Use when the UI needs a compact, color-coded toggle button for filtering or selecting a task category. Choose the color track that matches the surrounding design language — brand (green) for primary, accent (purple) for secondary, information (blue) for informational, gray for neutral. Pass a Phosphor icon name to the optional icon prop to show a filled glyph in the header (e.g. icon="tree"); omit it to leave the icon slot empty. Always listen to the gv-toggle CustomEvent to react to state changes.'
	}
} satisfies ComponentMetadata;
