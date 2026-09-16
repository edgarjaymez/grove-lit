export const TitleMetadata = {
	component: {
		name: 'Title',
		tag: 'gv-title',
		path: 'src/lib/components/Title/Title.ts',
		category: 'atoms',
		description:
			'A static title block: a filled Phosphor icon beside a title-scale heading, painted on the ground surface. Non-interactive page chrome — renders a real heading element whose level is a prop (default h2).',
		type: 'display',
		version: '1.0.0',
		created: '2026/09/16',
		modified: '2026/09/16'
	},

	usage: {
		useCases: ['page-title', 'section-heading', 'documentation-title', 'page-chrome'],
		requiredProps: [],
		commonPatterns: [
			{
				name: 'basic-title',
				description: 'Render a page title with the default palette icon and h2 level',
				composition: '<gv-title heading="Documentation"></gv-title>'
			},
			{
				name: 'custom-level',
				description: 'Render as an h1 for a top-level page title',
				composition: '<gv-title heading="Getting Started" level="1"></gv-title>'
			},
			{
				name: 'custom-icon',
				description: 'Pair the title with a Phosphor icon relevant to the section',
				composition: '<gv-title heading="Settings" icon="gear"></gv-title>'
			},
			{
				name: 'no-icon',
				description: 'Hide the icon entirely by passing an empty icon attribute',
				composition: '<gv-title heading="Overview" icon=""></gv-title>'
			}
		],
		antiPatterns: [
			{
				scenario: 'Using gv-title as an interactive button or link',
				reason:
					'gv-title is static page chrome with no events, focus management, or interactive role',
				alternative:
					'Wrap a gv-title-like heading and icon in a native <a> or <button> if interactivity is needed'
			},
			{
				scenario: 'Setting a `title` attribute expecting it to control the heading text',
				reason:
					'`title` is a global HTML attribute and renders a native tooltip on the host — the text prop is `heading`',
				alternative: 'Use the `heading` property'
			},
			{
				scenario: 'Using gv-title for a subtitle/description pair',
				reason: 'gv-title has no message/description slot — it renders a single heading only',
				alternative: 'Compose a separate typography element below gv-title for supporting text'
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
				role: 'Leading filled glyph, aria-hidden. Hidden when icon="". The host app must import the Phosphor icon used (e.g. @phosphor-icons/webcomponents/PhPalette).'
			}
		],
		commonPartners: [],
		parentConstraints: null
	},

	behavior: {
		states: ['default'],
		interactions: null
	},

	accessibility: {
		role: 'None — the host has no interactive or landmark role; the rendered heading carries native heading semantics',
		keyboardSupport: 'None — the component is not focusable and has no keyboard interactions',
		screenReader:
			'The icon is aria-hidden="true" and skipped; the heading text is the only accessible content, announced per its level in the document outline',
		wcag: 'AA',
		notes: [
			'Never set a `title` attribute on the host — it is a global HTML attribute and renders a native tooltip, shadowing the intended heading text',
			'The `level` prop controls the semantic heading level (h1–h6); choose it to match the document outline, not for visual sizing',
			'No CustomEvents are dispatched — this component is purely presentational'
		]
	},

	aiHints: {
		priority: 'medium',
		keywords: [
			'title',
			'heading',
			'page title',
			'section title',
			'icon heading',
			'page chrome',
			'documentation header'
		],
		context:
			'Use as static page or section chrome when a title needs a leading icon on the ground surface — e.g. a documentation page header. Set `level` to match the real document heading hierarchy, and pass icon="" to omit the icon when none is needed.'
	}
};
