export const MenuItemMetadata = {
	component: {
		name: 'MenuItem',
		tag: 'gv-menu-item',
		path: 'src/lib/components/MenuItem/MenuItem.ts',
		category: 'molecules',
		description:
			'A sidebar/docs navigation item rendered as a native anchor with a leading Phosphor icon and a wrapping label. Two sizes model the two navigation levels: md for primary entries and sm for sub-entries. The item is transparent — its parent paints the brand terrace surface — and it has four visual states driven by hover and the is-active attribute.',
		type: 'navigation',
		version: '1.0.0',
		created: '2026/09/16',
		modified: '2026/09/16'
	},

	usage: {
		useCases: [
			'docs-sidebar-navigation',
			'primary-nav-item',
			'sub-navigation-item',
			'table-of-contents-link'
		],
		requiredProps: ['label'],
		commonPatterns: [
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
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [
			{
				name: 'Icon',
				source: '../Icon/Icon.js',
				role: 'Decorative leading glyph rendered with fill-in-hover; regular weight at rest, fill weight on hover and when active. The host app must import the Phosphor icon used (e.g. @phosphor-icons/webcomponents/PhHouse). Hidden when icon="".'
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
				sm: 'Secondary navigation level (sub-item) — subtle typography scale (16px/20px)'
			}
		}
	},

	accessibility: {
		role: 'link (native <a>)',
		keyboardSupport:
			'Native anchor behavior — Tab focuses the link, Enter activates it. No custom key handling.',
		screenReader:
			'The accessible name is the label text; the icon is aria-hidden="true" and is not announced. When active, aria-current="page" announces the entry as the current page.',
		focusManagement:
			'The internal anchor receives focus; the focus ring comes from the global surface-scoped system and is never declared in the component.',
		wcag: 'AA',
		notes: [
			'The anchor carries aria-current="page" only while is-active is set; the attribute is absent otherwise.',
			'is-active reflects to the host, so gv-menu-item[is-active] is styleable and queryable from outside the shadow root.',
			'The icon is decorative (aria-hidden="true") — never rely on it to convey the destination.',
			'The label wraps rather than truncating, so long navigation targets stay fully readable.',
			'parentConstraints: the parent must paint the brand terrace surface; the text-on-brand-terrace color family only meets contrast on that surface.',
			'The component declares no focus-ring CSS — the global surface-scoped *:focus-visible system supplies the ring.'
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
			'active link'
		],
		context:
			'Use for entries in a documentation or app sidebar where each row is a link with an icon and a label. Pick size="md" for top-level entries and size="sm" for the nested level, and set is-active on the entry matching the current route. Always place it inside a container that paints var(--semantic-color-surface-brand-terrace).'
	}
};
