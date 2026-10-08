import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../Icon/Icon.js';
import { componentReset } from '../../styles/component-reset.js';
import { SlotContent } from '../../utils/slot-content.js';

export type FeedbackStripType = 'success' | 'danger' | 'information';
/** How the strip announces itself; `off` renders no live region. */
export type FeedbackStripLive = 'polite' | 'assertive' | 'off';

const TYPES = {
	success: { icon: 'check-circle', live: 'polite' },
	danger: { icon: 'warning-circle', live: 'assertive' },
	information: { icon: 'info', live: 'polite' }
} as const;

const REGIONS = {
	polite: { role: 'status', ariaLive: 'polite' },
	assertive: { role: 'alert', ariaLive: 'assertive' },
	off: { role: undefined, ariaLive: undefined }
} as const;

/**
 * A full-width status strip: a summit-depth band with a filled status icon,
 * a subheading-scale heading, and an indented message.
 *
 * The consuming app must import the Phosphor icons it renders:
 * `PhCheckCircle`, `PhWarningCircle`, `PhInfo`.
 *
 * @slot heading - The strip heading. Falls back to `heading` when empty.
 * @slot message - The message line. Falls back to `message`; with neither, the row is not rendered.
 */
@customElement('gv-feedback-strip')
export class FeedbackStrip extends LitElement {
	private readonly _slots = new SlotContent(this, ['heading', 'message'], { phrasingOnly: true });

	@property({ type: String, reflect: true }) type: FeedbackStripType = 'success';
	@property({ type: String }) heading = '';
	@property({ type: String }) message = '';
	/** Announcement politeness, independent of `type`. Unset (or unknown), it follows `type`. */
	@property({ type: String, reflect: true }) live?: FeedbackStripLive;

	static styles = [
		componentReset,
		css`
			:host {
				display: block;
			}

			.strip {
				display: flex;
				flex-direction: column;
				gap: var(--soft-grid-16);
				padding-inline: var(--grid-system-margin);
				padding-block: var(--soft-grid-24);
				border-block: var(--border-width-base) solid;
				border-inline: 0;
			}

			.header {
				display: flex;
				align-items: center;
				gap: var(--soft-grid-16);
				font: var(--typography-single-line-subheading-emphasis);
				letter-spacing: var(--letter-spacing-base);
			}

			.heading {
				flex: 1 0 0;
				min-width: 0;
				overflow-wrap: anywhere;
			}

			.body {
				padding-inline-start: var(--soft-grid-44);
			}

			.message {
				font: var(--typography-single-line-subtle-base);
				letter-spacing: var(--letter-spacing-base);
				overflow-wrap: anywhere;
			}

			/* Success */
			.strip--success {
				background: var(--semantic-color-surface-success-summit);
				border-color: var(--semantic-color-border-around-success-summit);
				color: var(--semantic-color-text-on-success-summit-base);
			}
			.strip--success .message {
				color: var(--semantic-color-text-on-success-summit-subtle);
			}

			/* Danger */
			.strip--danger {
				background: var(--semantic-color-surface-danger-summit);
				border-color: var(--semantic-color-border-around-danger-summit);
				color: var(--semantic-color-text-on-danger-summit-base);
			}
			.strip--danger .message {
				color: var(--semantic-color-text-on-danger-summit-subtle);
			}

			/* Information */
			.strip--information {
				background: var(--semantic-color-surface-information-summit);
				border-color: var(--semantic-color-border-around-information-summit);
				color: var(--semantic-color-text-on-information-summit-base);
			}
			.strip--information .message {
				color: var(--semantic-color-text-on-information-summit-subtle);
			}
		`
	];

	render() {
		const t: FeedbackStripType = Object.hasOwn(TYPES, this.type) ? this.type : 'success';
		const live = this.live && Object.hasOwn(REGIONS, this.live) ? this.live : TYPES[t].live;
		const region = REGIONS[live];
		const heading = this._slots.has('heading') ? nothing : this.heading;
		const message = this._slots.has('message') ? nothing : this.message;

		return html`
			<div
				class=${classMap({ strip: true, [`strip--${t}`]: true })}
				role=${ifDefined(region.role)}
				aria-live=${ifDefined(region.ariaLive)}
			>
				<div class="header">
					<gv-icon name=${TYPES[t].icon} is-filled aria-hidden="true"></gv-icon>
					<p class="heading"><slot name="heading"></slot>${heading}</p>
				</div>
				${this.message || this._slots.has('message')
					? html`<div class="body">
							<p class="message"><slot name="message"></slot>${message}</p>
						</div>`
					: nothing}
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-feedback-strip': FeedbackStrip;
	}
}
