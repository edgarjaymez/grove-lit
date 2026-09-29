import type { ComponentMetadata } from '../metadata.js';

export const TitleMetadata = {
	component: {
		name: 'Title',
		tag: 'gv-title',
		path: 'src/lib/components/Title/Title.ts',
		category: 'atoms',
		description:
			'A static title block: a filled Phosphor icon beside a title-scale heading, painted on the Grove surface named by surface (default ground) with the base text colour of that surface. Non-interactive page chrome — renders a real heading element whose level is a prop (default h2).',
		type: 'display',
		version: '1.3.0',
		created: '2026/09/16',
		modified: '2026/09/28'
	},
	phosphor: {
		prop: 'icon',
		default: 'palette',
		fixed: []
	},

	usage: {
		useCases: ['page-title', 'section-heading', 'documentation-title', 'page-chrome'],
		requiredProps: [],
		commonPatterns: [
			{
				name: 'section-surface',
				description:
					'A title inside a coloured section: set surface to the section surface so the title paints the same colour, with its paired text. The gv-surface-* class paints the section and sets the focus ring for controls in it.',
				composition:
					'<section class="gv-surface-brand-terrace"><gv-title surface="brand-terrace" heading="Principles"></gv-title></section>'
			},
			{
				name: 'slotted-heading',
				description:
					'Pass the heading as content; level still sets the heading element. The heading prop is the fallback.',
				composition: '<gv-title level="1">Getting started</gv-title>'
			},
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
				scenario: 'Setting a surface that differs from the section the title sits in',
				reason:
					'The title paints its own surface, so it shows as a block of a different colour inside the section',
				alternative:
					'Set surface to the parent section\'s surface, e.g. both gv-surface-brand-terrace and surface="brand-terrace"'
			},
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
		slots: [
			{
				name: '',
				description:
					'The heading text, rendered inside the h{level}. Phrasing content only: the level still comes from level.',
				fallback: 'heading'
			}
		],
		nestedComponents: [
			{
				name: 'Icon',
				customElement: 'gv-icon',
				source: '../Icon/Icon.js',
				role: 'Leading filled glyph, aria-hidden. Hidden when icon="". The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute.'
			}
		],
		commonPartners: [],
		parentConstraints: null
	},

	behavior: {
		states: ['default'],
		interactions: null,
		layout: [
			'A heading that fits sits on one line, centred in the block after the icon.',
			'A longer heading wraps onto as many lines as it needs, start-aligned, with the icon centred on the whole heading; the block grows taller. Breaks fall between words; a word longer than the line breaks inside the word. Nothing is clipped at any width or text size (WCAG 2.2 1.4.10, 1.4.4).',
			'The icon keeps its 40 px glyph and never shrinks or moves to its own line.',
			'The heading uses the multi-line title token (40 px / 600, 1.2 line height).'
		]
	},

	variants: {
		surface: {
			options: [
				'ground',
				'<track>-terrace',
				'brand-path',
				'gray-path',
				'<track>-summit',
				'<track>-aurora'
			],
			default: 'ground',
			purpose: {
				ground: 'The page surface. Default.',
				resting:
					'Terrace, Path and Summit: a coloured section the title belongs to. Every track that has the depth; Path exists on brand and gray only.',
				aurora:
					'A transient highlight section, never a nesting parent. Aurora has no emphasis role, ring or shadow.',
				fallback: 'Any other value, including wrong case or accent-path, renders as ground.'
			}
		}
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
			'Use as static page or section chrome when a title needs a leading icon — e.g. a documentation page header, or a heading inside a coloured section with surface set to that section\'s surface. Set `level` to match the real document heading hierarchy, and pass icon="" to omit the icon when none is needed.'
	}
} satisfies ComponentMetadata;
