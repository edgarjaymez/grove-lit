import { LitElement, css, nothing } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * A static title block: a filled Phosphor icon beside a title-scale heading, on the ground surface.
 *
 * Non-interactive page chrome — renders a real heading element whose level is a prop (default `h2`).
 */
@customElement('gv-title')
export class Title extends LitElement {
	@property({ type: String }) heading = '';
	@property({ type: Number }) level: HeadingLevel = 2;
	@property({ type: String }) icon = 'palette';

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
				overflow: clip;
				color: var(--semantic-color-text-on-ground-base);
				background: var(--semantic-color-surface-ground);
			}

			.title__icon {
				font: var(--typography-single-line-title-base);
			}

			.title__heading {
				font: var(--typography-single-line-title-emphasis);
				letter-spacing: var(--letter-spacing-base);
				white-space: nowrap;
			}
		`
	];

	render() {
		const level =
			Number.isInteger(this.level) && this.level >= 1 && this.level <= 6 ? this.level : 2;
		const tag = unsafeStatic(`h${level}`);

		return staticHtml`
			<div class="title">
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
				<${tag} class="title__heading">${this.heading}</${tag}>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-title': Title;
	}
}
