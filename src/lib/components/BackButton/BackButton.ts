import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';

@customElement('gv-back-button')
export class BackButton extends LitElement {
	@property({ type: String }) label = 'Go back';
	@property({ type: String }) icon = 'arrow-left';

	static styles = [
		componentReset,
		css`
			:host {
				display: inline-block;
			}

			.tile {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				overflow: clip;
				cursor: pointer;
				border: none;
				border-radius: var(--border-radius-none);
				background: var(--semantic-color-surface-gray-terrace);
				color: var(--semantic-color-text-on-gray-terrace-base);
				padding-inline: var(--soft-grid-24);
				padding-block: var(--soft-grid-24);
				font: var(--typography-single-line-title-base);
				transition: color 300ms ease-in-out;
			}

			/* --breakpoints-laptop (1280px) — custom properties cannot be used in media queries */
			@media (min-width: 1280px) {
				.tile {
					padding-block: var(--soft-grid-32);
				}
			}

			.tile:hover gv-icon {
				--gv-icon-regular-display: none;
				--gv-icon-fill-display: inline-flex;
			}
		`
	];

	private handleClick() {
		const event = new CustomEvent('back', {
			bubbles: true,
			composed: true,
			cancelable: true
		});
		if (this.dispatchEvent(event)) {
			window.history.back();
		}
	}

	render() {
		return html`
			<button type="button" class="tile" aria-label=${this.label} @click=${this.handleClick}>
				<gv-icon name=${this.icon} fill-in-hover aria-hidden="true"></gv-icon>
			</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-back-button': BackButton;
	}
}
