import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';
import { SlotContent } from '../../utils/slot-content.js';
import { linkAttribute } from '../../utils/link-attributes.js';

type MenuItemSize = 'md' | 'sm';

/**
 * A docs/sidebar navigation item: a native `<a>` with a leading Phosphor icon and a
 * wrapping label.
 *
 * The item is transparent — its parent paints the brand terrace surface
 * (`--semantic-color-surface-brand-terrace`). `size="md"` is the primary level,
 * `size="sm"` the secondary (sub-item) level.
 *
 * The consuming app must register the Phosphor icon it uses, e.g.
 * `import '@phosphor-icons/webcomponents/PhHouse'` for `icon="house"`.
 *
 * `hreflang` names the destination's language and is forwarded to the link only when `href` is set.
 * When the label itself is in another language, put `lang` on the element
 * (`<gv-menu-item lang="es" hreflang="es" …>`): the shadow link inherits the host's language, so
 * screen readers switch voice (WCAG 3.1.2). `lang` is deliberately not a property.
 *
 * @slot - The link label. Falls back to `label` when empty.
 */
@customElement('gv-menu-item')
export class MenuItem extends LitElement {
	private readonly _slots = new SlotContent(this, ['']);

	@property({ type: String }) label = '';
	@property({ type: String }) href?: string;
	@property({ type: String }) hreflang?: string;
	@property({ type: String }) icon = 'house';
	@property({ type: String }) size: MenuItemSize = 'md';
	@property({ type: Boolean, attribute: 'is-active', reflect: true }) isActive = false;

	static styles = [
		componentReset,
		css`
			:host {
				display: block;
			}

			/* Transparent row — the parent paints the brand terrace surface. */
			.item {
				display: flex;
				align-items: center;
				width: 100%;
				gap: var(--soft-grid-8);
				/* WCAG 2.2 SC 2.5.8: every row is at least 24 CSS px tall, at either size. */
				min-block-size: var(--soft-grid-24);
				text-decoration: none;
				letter-spacing: var(--letter-spacing-base);
				color: var(--semantic-color-text-on-brand-terrace-subtle);
				transition: color 300ms ease-in-out;
			}

			/* Sizes — the row font drives gv-icon's 1em glyph sizing. */
			.item--md {
				font: var(--typography-single-line-base-base);
			}
			.item--sm {
				font: var(--typography-single-line-subtle-base);
			}

			.label {
				flex: 1 0 0;
				min-width: 0;
				overflow-wrap: anywhere;
			}

			/* Label emphasis when active. */
			.item--md.item--active .label {
				font: var(--typography-single-line-base-emphasis);
			}
			.item--sm.item--active .label {
				font: var(--typography-single-line-subtle-emphasis);
			}

			/* Colors — order matters: active+hover must come last. */
			.item:hover {
				color: var(--semantic-color-text-on-brand-terrace-base);
			}
			.item--active {
				color: var(--semantic-color-text-on-brand-terrace-emphasis);
			}
			.item--active:hover {
				color: var(--semantic-color-text-on-brand-terrace-base);
			}

			/* Icon fill weight on hover AND when active — gv-icon ignores is-filled
			   while fill-in-hover is set, so the swap is driven from here. */
			.item:hover gv-icon,
			.item--active gv-icon {
				--gv-icon-regular-display: none;
				--gv-icon-fill-display: inline-flex;
			}
		`
	];

	render() {
		return html`
			<a
				class=${classMap({
					item: true,
					[`item--${this.size}`]: true,
					'item--active': this.isActive
				})}
				href=${ifDefined(this.href)}
				hreflang=${ifDefined(linkAttribute(this.href, this.hreflang))}
				aria-current=${this.isActive ? 'page' : nothing}
			>
				${this.icon
					? html`<gv-icon name=${this.icon} fill-in-hover aria-hidden="true"></gv-icon>`
					: nothing}
				<span class="label"><slot></slot>${this._slots.has() ? nothing : this.label}</span>
			</a>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-menu-item': MenuItem;
	}
}
