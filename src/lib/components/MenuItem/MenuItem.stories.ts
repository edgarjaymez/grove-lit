import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './MenuItem.js';

interface Args {
	label: string;
	href: string;
	hreflang: string;
	/** Any browsing context name; the select offers the keywords. */
	target: string;
	rel: string;
	icon: string;
	size: 'md' | 'sm';
	isActive: boolean;
}

/** The parent paints the brand terrace surface — gv-menu-item is transparent by design. */
const terrace = (story: () => unknown) => html`
	<div
		style="background: var(--semantic-color-surface-brand-terrace); padding: var(--soft-grid-16); width: 240px;"
	>
		${story()}
	</div>
`;

const meta: Meta<Args> = {
	title: 'Components/gv-menu-item',
	tags: ['autodocs'],
	decorators: [terrace],
	// Already clean, so it gates now: Sidebar locks SC 2.5.8 before the library-wide switch (#50).
	parameters: { a11y: { test: 'error' } },
	render: ({ label, href, hreflang, target, rel, icon, size, isActive }) => html`
		<gv-menu-item
			label=${label}
			href=${ifDefined(href || undefined)}
			hreflang=${ifDefined(hreflang || undefined)}
			target=${ifDefined(target || undefined)}
			rel=${ifDefined(rel || undefined)}
			icon=${icon}
			size=${size}
			?is-active=${isActive}
		></gv-menu-item>
	`,
	argTypes: {
		label: { control: 'text' },
		href: { control: 'text' },
		hreflang: { control: 'text' },
		target: { control: 'select', options: ['', '_self', '_blank', '_parent', '_top'] },
		rel: { control: 'text' },
		icon: { control: 'text' },
		size: { control: 'select', options: ['md', 'sm'] },
		isActive: { control: 'boolean' }
	},
	args: {
		label: 'Getting started',
		href: '#',
		hreflang: '',
		target: '',
		rel: '',
		icon: 'house',
		size: 'md',
		isActive: false
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Active: Story = { args: { isActive: true } };
export const Small: Story = { args: { size: 'sm', label: 'Color', icon: 'drop' } };
export const SmallActive: Story = {
	args: { size: 'sm', label: 'Color', icon: 'drop', isActive: true }
};

/** WCAG 2.2 SC 2.5.8 regression fixture: rows stay gap-free, so each `sm` row must reach 24 px alone. */
export const Sidebar: Story = {
	render: () => html`
		<gv-menu-item label="Getting started" href="#" icon="house"></gv-menu-item>
		<gv-menu-item label="Design tokens" href="#" icon="palette" is-active></gv-menu-item>
		<gv-menu-item size="sm" label="Color" href="#" icon="drop"></gv-menu-item>
		<gv-menu-item size="sm" label="Typography" href="#" icon="text-aa"></gv-menu-item>
		<gv-menu-item size="sm" label="Spacing" href="#" icon="ruler"></gv-menu-item>
		<gv-menu-item label="Components" href="#" icon="cube"></gv-menu-item>
	`
};

/** Each item marks its label's language with `lang` and its destination's with `hreflang`. */
export const LanguageSwitcher: Story = {
	render: () => html`
		<nav aria-label="Language">
			<gv-menu-item
				lang="en"
				hreflang="en"
				href="#"
				label="English"
				icon=""
				is-active
			></gv-menu-item>
			<gv-menu-item lang="es" hreflang="es" href="#" label="Español" icon=""></gv-menu-item>
		</nav>
	`
};

/** target="_blank" without rel gets rel="noopener noreferrer". */
export const External: Story = {
	args: { label: 'Status page', href: '#status', target: '_blank', icon: 'arrow-square-out' }
};

/** The label as content. */
export const Slotted: Story = {
	render: ({ href, icon, size, isActive }) => html`
		<gv-menu-item href=${ifDefined(href)} icon=${icon} size=${size} ?is-active=${isActive}
			>Work</gv-menu-item
		>
	`
};
