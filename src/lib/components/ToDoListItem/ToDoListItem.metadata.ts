import type { ComponentMetadata } from '../metadata.js';

export const ToDoListItemMetadata = {
	component: {
		name: 'ToDoListItem',
		tag: 'gv-todo-list-item',
		path: 'src/lib/components/ToDoListItem/ToDoListItem.ts',
		category: 'molecules',
		description:
			'A to-do list entry composed of an interactive checkbox and a two-line label (heading + a category row with a leading Phosphor icon). Toggling the checkbox marks the item as done, applying strikethrough styling to both text lines; the category icon switches from filled (active) to outline (done).',
		type: 'interactive',
		version: '2.0.0',
		created: '2026/05/31',
		modified: '2026/09/28'
	},
	phosphor: {
		prop: 'icon',
		default: 'tree',
		fixed: []
	},

	usage: {
		useCases: ['task-list-item', 'checklist-entry', 'actionable-list-row', 'todo-feed-item'],
		requiredProps: [],
		commonPatterns: [
			{
				name: 'basic-task',
				description: 'Render a single unchecked task with a heading and category',
				composition:
					'<gv-todo-list-item heading="Buy groceries" category="Errands" icon="basket"></gv-todo-list-item>'
			},
			{
				name: 'completed-task',
				description: 'Render a task that is already marked as done',
				composition:
					'<gv-todo-list-item heading="Buy groceries" category="Errands" icon="basket" is-done></gv-todo-list-item>'
			},
			{
				name: 'match-category-icon',
				description:
					'Use the same icon as the category’s gv-todo-category-toggler so the list item and its filter share a glyph. Pass icon="" to hide the icon.',
				composition:
					'<gv-todo-list-item heading="Ship release" category="Dev" icon="code"></gv-todo-list-item>'
			},
			{
				name: 'controlled-toggle',
				description: 'Listen to gv-change events to react when the user checks/unchecks a task',
				composition: `<gv-todo-list-item id="my-item" heading="Buy groceries" category="Errands"></gv-todo-list-item>
<script>
  document.querySelector('#my-item').addEventListener('gv-change', (e) => {
    console.log('isDone:', e.detail);
  });
</script>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Passing the task text as title',
				reason:
					'title is the global HTML attribute: the host would get a native tooltip over the whole row and an accessible name, and the component no longer reads it.',
				alternative: 'Pass the task text as heading'
			},
			{
				scenario: 'Using as a non-interactive display-only row',
				reason:
					'The embedded checkbox is always interactive; use a plain layout with text elements instead if no toggle is needed.',
				alternative: 'Plain HTML with text styled via Grove typography tokens'
			},
			{
				scenario: 'Hardcoding a fixed width on the host element',
				reason:
					'gv-todo-list-item is fluid by default and adapts to its container. Constraining width externally is fine; constraining it internally breaks layouts.',
				alternative: 'Wrap in a container that provides the desired width constraint'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [
			{
				name: 'Checkbox',
				customElement: 'gv-checkbox',
				source: '../Checkbox/Checkbox.js',
				role: 'Interactive toggle that marks the task as done or not done'
			},
			{
				name: 'Icon',
				customElement: 'gv-icon',
				source: '../Icon/Icon.js',
				role: 'Leading category glyph; filled when active, outline when done. Hidden when icon="". The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.'
			}
		],
		commonPartners: [
			{
				name: 'ToDoCategoryToggler',
				customElement: 'gv-todo-category-toggler',
				source: '../ToDoCategoryToggler/ToDoCategoryToggler.js',
				relationship:
					'Category togglers filter which list items are visible; pass the toggler’s icon to the list item so a category and its tasks share a glyph'
			}
		],
		parentConstraints: []
	},

	behavior: {
		states: ['default', 'done'],
		interactions: {
			click:
				"Clicking the checkbox toggles the isDone state; the component dispatches one gv-change CustomEvent with detail: boolean (isDone value); the inner checkbox's own gv-change is stopped at the boundary"
		},
		responsive: {}
	},

	accessibility: {
		role: 'Inherits from gv-checkbox (role="checkbox") for the toggle; surrounding text is presentational',
		keyboardSupport:
			'Tab focuses the internal checkbox; Space toggles it — standard checkbox keyboard behavior',
		screenReader:
			'The checkbox announces its checked state via aria-checked; title and category text are read as adjacent content',
		focusManagement:
			'Focus is managed by the internal gv-checkbox element; the list item host itself is not focusable',
		wcag: 'AA',
		notes: [
			'State changes dispatch a gv-change CustomEvent (bubbles: true, composed: true) with detail: boolean — listen with addEventListener("gv-change", (e) => use(e.detail))'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: [
			'todo',
			'task',
			'checklist',
			'list item',
			'checkbox row',
			'done',
			'complete',
			'mark as done'
		],
		context:
			'Use when building a task list or checklist where each row needs an interactive checkbox, a primary task name, and a secondary category/subtitle. Prefer this over composing a raw gv-checkbox with text manually.'
	}
} satisfies ComponentMetadata;
