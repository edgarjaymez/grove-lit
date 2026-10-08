import type { ComponentMetadata } from '../metadata.js';

export const MenuItemMetadata = {
	component: {
		name: 'MenuItem',
		tag: 'gv-menu-item',
		path: 'src/lib/components/MenuItem/MenuItem.ts',
		category: 'molecules',
		description:
			'A sidebar/docs navigation item rendered as a native anchor with a leading Phosphor icon and a wrapping label. Two sizes model the two navigation levels: md for primary entries and sm for sub-entries. The item is transparent — its parent paints the brand terrace surface — and it has four visual states driven by hover and the is-active attribute.',
		type: 'navigation',
		version: '1.2.1',
		created: '2026/09/16',
		modified: '2026/10/08'
	},
	phosphor: {
		prop: 'icon',
		default: 'house',
		fixed: []
	},

	usage: {
		useCases: [
			'docs-sidebar-navigation',
			'primary-nav-item',
			'sub-navigation-item',
			'table-of-contents-link',
			'language-switcher'
		],
		requiredProps: ['href'],
		commonPatterns: [
			{
				name: 'slotted-label',
				description: 'Pass the label as content; label is the fallback.',
				composition: '<gv-menu-item href="/work/">Work</gv-menu-item>'
			},
			{
				name: 'primary-nav-item',
				description: 'A top-level sidebar entry linking to a docs page',
				composition:
					'<gv-menu-item label="Getting started" href="/start" icon="house"></gv-menu-item>'
			},
			{
				name: 'current-page',
				description:
					'Mark the entry matching the current route; the anchor gains aria-current="page", the icon fills and the label switches to the emphasis weight',
				composition:
					'<gv-menu-item label="Tokens" href="/tokens" icon="palette" is-active></gv-menu-item>'
			},
			{
				name: 'sub-item',
				description: 'A secondary-level entry nested under a primary one, using the subtle scale',
				composition:
					'<gv-menu-item size="sm" label="Color" href="/tokens/color" icon="drop"></gv-menu-item>'
			},
			{
				name: 'no-icon',
				description: 'Pass an empty icon to render the label alone (project precedent)',
				composition: '<gv-menu-item label="Changelog" href="/changelog" icon=""></gv-menu-item>'
			},
			{
				name: 'sidebar-stack',
				description:
					'A navigation list on a container that paints the brand terrace surface; the item itself is transparent',
				composition: `<nav style="background: var(--semantic-color-surface-brand-terrace);">
  <gv-menu-item label="Components" href="/components" icon="cube" is-active></gv-menu-item>
  <gv-menu-item size="sm" label="Button" href="/components/button" icon="cursor-click"></gv-menu-item>
</nav>`
			},
			{
				name: 'language-switcher',
				description:
					'Links to the same page in other languages. lang on each item marks the language of its label (the shadow link inherits it); hreflang names the language of the destination',
				composition: `<nav aria-label="Language" style="background: var(--semantic-color-surface-brand-terrace);">
  <gv-menu-item lang="en" hreflang="en" href="/" label="English" icon="" is-active></gv-menu-item>
  <gv-menu-item lang="es" hreflang="es" href="/es/" label="Español" icon=""></gv-menu-item>
</nav>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Using it as a button or click handler for a non-navigation action',
				reason:
					'The root element is a native anchor; activation is link navigation and there are no custom events.',
				alternative: 'gv-button or gv-icon-button'
			},
			{
				scenario: 'Placing it on a surface other than the brand terrace',
				reason:
					'All four state colors come from the text-on-brand-terrace family, so contrast is only guaranteed on that surface.',
				alternative:
					'Wrap the navigation in a container with background: var(--semantic-color-surface-brand-terrace)'
			},
			{
				scenario: 'Giving the host a background, border, shadow, or padding from outside',
				reason:
					'The item is deliberately transparent and unpadded so the parent owns the surface and rhythm.',
				alternative: 'Apply padding and surface styling to the navigation container'
			},
			{
				scenario: 'Truncating the label with an ellipsis',
				reason: 'The label is specified to wrap; truncation hides navigation targets.',
				alternative: 'Let the label wrap, or widen the container'
			},
			{
				scenario: 'Omitting href',
				reason:
					'The <a> then has no href, so it is neither a link nor focusable, and nothing announces it as navigation.',
				alternative: 'Always pass the destination in href'
			},
			{
				scenario: 'Putting lang only on a wrapper around both links, or leaving it off',
				reason:
					"Each language-switcher link's text is in its own language; one lang for the whole list mispronounces every label but one.",
				alternative: 'Set lang on each gv-menu-item'
			}
		]
	},

	composition: {
		slots: [
			{
				name: '',
				description:
					'The link label. Phrasing content only, never a link or control: it is already inside the <a>.',
				fallback: 'label'
			}
		],
		nestedComponents: [
			{
				name: 'Icon',
				source: '../Icon/Icon.js',
				role: 'Decorative leading glyph rendered with fill-in-hover; regular weight at rest, fill weight on hover and when active. The host app must register the glyph it renders: see the phosphor field for the default and fixed glyphs, plus any it names through the icon attribute. Hidden when icon="".'
			}
		],
		commonPartners: ['Icon'],
		parentConstraints: [
			'The parent must paint the brand terrace surface (background: var(--semantic-color-surface-brand-terrace)) — the item is transparent by design.',
			'The parent owns layout: padding, vertical rhythm/gap between items, and the width of the navigation column.',
			'Sub-items (size="sm") are laid out by the parent; the component adds no indentation of its own.'
		]
	},

	behavior: {
		states: ['default', 'hover', 'active', 'active-hover'],
		interactions: {
			hover:
				'The icon swaps to the fill weight and the color moves to text-on-brand-terrace-base; no event is dispatched.',
			click: 'Native link navigation to href; the component dispatches no custom events.'
		}
	},

	variants: {
		size: {
			options: ['md', 'sm'],
			default: 'md',
			purpose: {
				md: 'Primary navigation level — base typography scale (20px/24px)',
				sm: 'Secondary navigation level (sub-item) — subtle typography scale (16px/20px type) in a 24px minimum row'
			}
		}
	},

	accessibility: {
		role: 'link (native <a>)',
		keyboardSupport:
			'Native anchor behavior — Tab focuses the link, Enter activates it. No custom key handling.',
		screenReader:
			'The accessible name is the slotted content when present, else label; the icon is aria-hidden="true" and is not announced. When active, aria-current="page" announces the entry as the current page.',
		focusManagement:
			"The internal anchor receives focus and draws the Grove focus ring on :focus-visible: the surrounding surface's --gv-focus-ring, else --ring-on-brand-terrace, the surface its parent paints.",
		wcag: 'AA',
		notes: [
			'The anchor carries aria-current="page" only while is-active is set; the attribute is absent otherwise.',
			'is-active reflects to the host, so gv-menu-item[is-active] is styleable and queryable from outside the shadow root.',
			'The icon is decorative (aria-hidden="true") — never rely on it to convey the destination.',
			'The label wraps rather than truncating, so long navigation targets stay fully readable.',
			'parentConstraints: the parent must paint the brand terrace surface; the text-on-brand-terrace color family only meets contrast on that surface.',
			'Under forced colours a system-colour outline replaces the ring.',
			"Every row is at least 24 CSS px tall (`min-block-size: var(--soft-grid-24)`), so it meets WCAG 2.2 SC 2.5.8 without relying on the parent's spacing.",
			"Put lang on the element when the label is in another language: the shadow link inherits the host's language (WCAG 3.1.2). hreflang is advisory metadata about the destination and is rendered only when href is set.",
			'Honours prefers-reduced-motion: reduce — every state change lands instantly with the same end state (componentReset).'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: [
			'menu item',
			'nav item',
			'navigation',
			'sidebar',
			'docs nav',
			'sub item',
			'link',
			'current page',
			'active link',
			'language-switcher',
			'hreflang'
		],
		context:
			'Use for entries in a documentation or app sidebar where each row is a link with an icon and a label. Pick size="md" for top-level entries and size="sm" for the nested level, and set is-active on the entry matching the current route. Always place it inside a container that paints var(--semantic-color-surface-brand-terrace).'
	}
} satisfies ComponentMetadata;
