import { LitElement, css, nothing } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';
import { SlotContent } from '../../utils/slot-content.js';
import { GROVE_SURFACES } from '../../surfaces.js';
import type { GroveSurface } from '../../surfaces.js';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** The surface gv-title paints: any Grove surface, in token spelling. */
export type TitleSurface = GroveSurface;

/**
 * A static title block: a filled Phosphor icon beside a title-scale heading, painted on the Grove
 * surface named by `surface` (default `ground`) with that surface's paired text colour. Aurora values
 * are transient highlight sections, not nesting parents.
 *
 * Non-interactive page chrome — renders a real heading element whose level is a prop (default `h2`).
 *
 * @slot - The heading text, rendered inside the `h{level}`. Falls back to `heading` when empty.
 */
@customElement('gv-title')
export class Title extends LitElement {
	private readonly _slots = new SlotContent(this, [''], { phrasingOnly: true });

	@property({ type: String }) heading = '';
	@property({ type: Number }) level: HeadingLevel = 2;
	@property({ type: String }) icon = 'palette';
	/** Unknown values, including wrong case, render as `ground`. */
	@property({ type: String, reflect: true }) surface: TitleSurface = 'ground';

	static styles = [
		componentReset,
		css`
			:host {
				display: block;
			}

			.title {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				gap: var(--soft-grid-16);
				padding: var(--soft-grid-24);
			}

			/* One rule per surface: the surface and its base text-on pair, written out in full. */
			.title--ground {
				color: var(--semantic-color-text-on-ground-base);
				background: var(--semantic-color-surface-ground);
			}
			.title--accent-terrace {
				color: var(--semantic-color-text-on-accent-terrace-base);
				background: var(--semantic-color-surface-accent-terrace);
			}
			.title--brand-terrace {
				color: var(--semantic-color-text-on-brand-terrace-base);
				background: var(--semantic-color-surface-brand-terrace);
			}
			.title--danger-terrace {
				color: var(--semantic-color-text-on-danger-terrace-base);
				background: var(--semantic-color-surface-danger-terrace);
			}
			.title--gray-terrace {
				color: var(--semantic-color-text-on-gray-terrace-base);
				background: var(--semantic-color-surface-gray-terrace);
			}
			.title--information-terrace {
				color: var(--semantic-color-text-on-information-terrace-base);
				background: var(--semantic-color-surface-information-terrace);
			}
			.title--success-terrace {
				color: var(--semantic-color-text-on-success-terrace-base);
				background: var(--semantic-color-surface-success-terrace);
			}
			.title--brand-path {
				color: var(--semantic-color-text-on-brand-path-base);
				background: var(--semantic-color-surface-brand-path);
			}
			.title--gray-path {
				color: var(--semantic-color-text-on-gray-path-base);
				background: var(--semantic-color-surface-gray-path);
			}
			.title--accent-summit {
				color: var(--semantic-color-text-on-accent-summit-base);
				background: var(--semantic-color-surface-accent-summit);
			}
			.title--brand-summit {
				color: var(--semantic-color-text-on-brand-summit-base);
				background: var(--semantic-color-surface-brand-summit);
			}
			.title--danger-summit {
				color: var(--semantic-color-text-on-danger-summit-base);
				background: var(--semantic-color-surface-danger-summit);
			}
			.title--gray-summit {
				color: var(--semantic-color-text-on-gray-summit-base);
				background: var(--semantic-color-surface-gray-summit);
			}
			.title--information-summit {
				color: var(--semantic-color-text-on-information-summit-base);
				background: var(--semantic-color-surface-information-summit);
			}
			.title--success-summit {
				color: var(--semantic-color-text-on-success-summit-base);
				background: var(--semantic-color-surface-success-summit);
			}
			.title--accent-aurora {
				color: var(--semantic-color-text-on-accent-aurora-base);
				background: var(--semantic-color-surface-accent-aurora);
			}
			.title--brand-aurora {
				color: var(--semantic-color-text-on-brand-aurora-base);
				background: var(--semantic-color-surface-brand-aurora);
			}
			.title--danger-aurora {
				color: var(--semantic-color-text-on-danger-aurora-base);
				background: var(--semantic-color-surface-danger-aurora);
			}
			.title--gray-aurora {
				color: var(--semantic-color-text-on-gray-aurora-base);
				background: var(--semantic-color-surface-gray-aurora);
			}
			.title--information-aurora {
				color: var(--semantic-color-text-on-information-aurora-base);
				background: var(--semantic-color-surface-information-aurora);
			}
			.title--success-aurora {
				color: var(--semantic-color-text-on-success-aurora-base);
				background: var(--semantic-color-surface-success-aurora);
			}

			.title__icon {
				flex: none;
				font: var(--typography-single-line-title-base);
				letter-spacing: var(--typography-single-line-title-base-letter-spacing);
			}

			/* Keeps its natural width while it fits, so the row still centres it; when it doesn't, it
			   shrinks beside the icon and wraps, between words first. */
			.title__heading {
				min-width: 0;
				font: var(--typography-multi-line-title-emphasis);
				letter-spacing: var(--letter-spacing-base);
				overflow-wrap: anywhere;
			}
		`
	];

	render() {
		const level =
			Number.isInteger(this.level) && this.level >= 1 && this.level <= 6 ? this.level : 2;
		const tag = unsafeStatic(`h${level}`);
		const surface = GROVE_SURFACES.includes(this.surface) ? this.surface : 'ground';

		return staticHtml`
			<div class="title title--${surface}">
				${
					this.icon === ''
						? nothing
						: staticHtml`<gv-icon
								class="title__icon"
								name=${this.icon}
								is-filled
								aria-hidden="true"
							></gv-icon>`
				}
				<${tag} class="title__heading"><slot></slot>${this._slots.has() ? nothing : this.heading}</${tag}>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-title': Title;
	}
}
