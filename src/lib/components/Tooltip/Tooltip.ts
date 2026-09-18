import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';

export type TooltipType = 'simple' | 'complete';
export type TooltipColor = 'accent' | 'gray';

/**
 * A floating hint bubble at summit depth, carrying the summit drop shadow as
 * the attention cue that pulls the eye to it. `is-pressed` drops that shadow —
 * the bubble reads as pushed down against the surface, which is how a consumer
 * reflects the press that produced it.
 *
 * `gv-tooltip` is the bubble **only**: it does not anchor or position itself,
 * has no open/close state and no timers — the consumer places it.
 *
 * `type="simple"` is a single nowrap line; `type="complete"` stacks a heading
 * over a wrapping message.
 *
 * The consuming app must import the Phosphor icon it names, e.g.
 * `import '@phosphor-icons/webcomponents/PhCopy'` for `icon="copy"`.
 */
@customElement('gv-tooltip')
export class Tooltip extends LitElement {
	@property({ type: String, reflect: true }) type: TooltipType = 'simple';
	@property({ type: String, reflect: true }) color: TooltipColor = 'accent';
	@property({ type: String }) icon: string | undefined;
	@property({ type: String }) heading = '';
	@property({ type: String }) message = '';
	@property({ type: Boolean, attribute: 'is-pressed', reflect: true }) isPressed = false;

	static styles = [
		componentReset,
		css`
			:host {
				display: inline-flex;
			}

			.tooltip {
				display: flex;
				overflow: hidden;
				transition: box-shadow 300ms ease-in-out;
			}

			/* ---- Simple ---- */
			.tooltip--simple {
				flex-direction: row;
				align-items: center;
				gap: var(--soft-grid-4);
				padding: var(--soft-grid-4) var(--soft-grid-8) var(--soft-grid-4) var(--soft-grid-6);
				border-radius: var(--border-radius-base);
			}

			/* ---- Complete ---- */
			.tooltip--complete {
				flex-direction: column;
				gap: var(--soft-grid-0);
				padding: var(--soft-grid-8) var(--soft-grid-12);
				border-radius: var(--border-radius-md);
			}

			.header {
				display: flex;
				align-items: center;
				gap: var(--soft-grid-4);
			}

			/* The glyph sizes off inherited font-size — gv-icon has no size prop. */
			.icon {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: none;
			}

			.tooltip--simple .icon {
				width: var(--soft-grid-12);
				height: var(--soft-grid-12);
				font-size: var(--font-size-2xs);
			}

			.tooltip--complete .icon {
				width: var(--soft-grid-20);
				height: var(--soft-grid-20);
				font-size: var(--font-size-xs);
			}

			.heading {
				font: var(--typography-multi-line-caption-emphasis);
				letter-spacing: var(--letter-spacing-base);
			}

			.message {
				font: var(--typography-single-line-footnote-base);
				letter-spacing: var(--letter-spacing-base);
				white-space: nowrap;
			}

			/* min-content + min-width:100% makes the body wrap under the header
			   instead of stretching the bubble to one long line. */
			.body {
				font: var(--typography-multi-line-footnote-base);
				letter-spacing: var(--letter-spacing-base);
				width: min-content;
				min-width: 100%;
			}

			/* ---- Accent ---- */
			.tooltip--accent {
				background: var(--semantic-color-surface-accent-summit);
				box-shadow: var(--drop-shadow-under-accent-summit);
				color: var(--semantic-color-text-on-accent-summit-base);
			}
			.tooltip--accent .body {
				color: var(--semantic-color-text-on-accent-summit-subtle);
			}

			/* ---- Gray ---- */
			.tooltip--gray {
				background: var(--semantic-color-surface-gray-summit);
				box-shadow: var(--drop-shadow-under-gray-summit);
				color: var(--semantic-color-text-on-gray-summit-base);
			}
			.tooltip--gray .body {
				color: var(--semantic-color-text-on-gray-summit-subtle);
			}

			/* ---- Pressed ---- */
			/* Same specificity as the colour rules above, so source order decides —
			   keep this last. */
			.tooltip--pressed {
				box-shadow: none;
			}
		`
	];

	connectedCallback() {
		super.connectedCallback();
		if (!this.hasAttribute('role')) this.setAttribute('role', 'tooltip');
	}

	private renderIcon() {
		if (!this.icon) return nothing;

		return html`
			<span class="icon">
				<gv-icon name=${this.icon} is-filled aria-hidden="true"></gv-icon>
			</span>
		`;
	}

	render() {
		const type: TooltipType = this.type === 'complete' ? 'complete' : 'simple';
		const color: TooltipColor = this.color === 'gray' ? 'gray' : 'accent';

		const classes = classMap({
			tooltip: true,
			[`tooltip--${type}`]: true,
			[`tooltip--${color}`]: true,
			'tooltip--pressed': this.isPressed
		});

		if (type === 'complete') {
			return html`
				<div class=${classes}>
					<div class="header">
						<p class="heading">${this.heading}</p>
						${this.renderIcon()}
					</div>
					<p class="body">${this.message}</p>
				</div>
			`;
		}

		return html`
			<div class=${classes}>
				${this.renderIcon()}
				<p class="message">${this.message}</p>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-tooltip': Tooltip;
	}
}
