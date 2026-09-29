import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { componentReset } from '../../styles/component-reset.js';
import '../Checkbox/Checkbox.js';
import '../Icon/Icon.js';

/**
 * A to-do row: a gv-checkbox, the task text and a category line.
 *
 * @fires {CustomEvent<boolean>} gv-change - with the new `isDone`, once per toggle.
 */
@customElement('gv-todo-list-item')
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging -- listener overloads, see ToDoListItemEventMap
export class ToDoListItem extends LitElement {
	/** The task text. Not `title`, which is the global HTML attribute (host tooltip and name). */
	@property({ type: String }) heading = 'Task';
	@property({ type: String }) category = 'Category';
	@property({ type: String }) icon = 'tree';
	@property({ type: Boolean, attribute: 'is-done', reflect: true }) isDone = false;

	static styles = [
		componentReset,
		css`
			:host {
				display: block;
			}

			.item {
				display: flex;
				flex-direction: row;
				gap: var(--soft-grid-8);
				align-items: flex-start;
				cursor: pointer;
			}

			.labels {
				display: flex;
				flex-direction: column;
				gap: var(--soft-grid-4);
				align-items: flex-start;
				justify-content: center;
				min-width: 0;
				flex: 1 0 0;
			}

			.title {
				font: var(--typography-single-line-base-base);
				letter-spacing: var(--letter-spacing-base);
				color: var(--semantic-color-text-on-ground-base);
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 100%;
			}

			.category-row {
				display: flex;
				flex-direction: row;
				gap: var(--soft-grid-4);
				align-items: flex-start;
				min-width: 0;
				width: 100%;
			}

			.category-icon {
				color: var(--semantic-color-text-on-ground-subtle);
				font-size: var(--font-size-base);
				flex-shrink: 0;
			}

			.category {
				font: var(--typography-single-line-subtle-base);
				letter-spacing: var(--letter-spacing-base);
				color: var(--semantic-color-text-on-ground-subtle);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: 1;
				min-width: 0;
			}

			.title--done {
				text-decoration: line-through;
			}

			.category--done {
				text-decoration: line-through;
			}
		`
	];

	private _onCheckboxChange(e: CustomEvent<boolean>) {
		// The inner checkbox's own composed gv-change would otherwise escape the host too, so each
		// toggle would reach the page twice.
		e.stopPropagation();
		this.isDone = e.detail;
		this.dispatchEvent(
			new CustomEvent('gv-change', { detail: this.isDone, bubbles: true, composed: true })
		);
	}

	private _handleItemClick(e: MouseEvent) {
		const checkbox = this.shadowRoot?.querySelector('gv-checkbox');
		if (checkbox && e.composedPath().includes(checkbox)) return;
		this.isDone = !this.isDone;
		this.dispatchEvent(
			new CustomEvent('gv-change', { detail: this.isDone, bubbles: true, composed: true })
		);
	}

	/* eslint-disable lit-a11y/click-events-have-key-events -- the row click is a pointer
	   convenience; the keyboard path is the focusable gv-checkbox inside it (Enter/Space), and a
	   focusable row would add a second tab stop for the same toggle. */
	render() {
		return html`
			<div class="item" @click=${this._handleItemClick}>
				<gv-checkbox ?checked=${this.isDone} @gv-change=${this._onCheckboxChange}></gv-checkbox>
				<div class="labels">
					<p class=${classMap({ title: true, 'title--done': this.isDone })}>${this.heading}</p>
					<div class="category-row">
						${this.icon
							? html`<gv-icon
									class="category-icon"
									name=${this.icon}
									?is-filled=${!this.isDone}
								></gv-icon>`
							: nothing}
						<p class=${classMap({ category: true, 'category--done': this.isDone })}>
							${this.category}
						</p>
					</div>
				</div>
			</div>
		`;
	}
	/* eslint-enable lit-a11y/click-events-have-key-events */
}

/**
 * gv-todo-list-item's events. `gv-change` is shared across Grove with different payloads, so the global map types
 * it `CustomEvent<string | boolean>`; a listener on a gv-todo-list-item reference gets the exact `detail`.
 */
export interface ToDoListItemEventMap extends HTMLElementEventMap {
	'gv-change': CustomEvent<boolean>;
}

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging -- typed listener overloads only */
export interface ToDoListItem {
	addEventListener<K extends keyof ToDoListItemEventMap>(
		type: K,
		listener: (this: ToDoListItem, event: ToDoListItemEventMap[K]) => unknown,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
	removeEventListener<K extends keyof ToDoListItemEventMap>(
		type: K,
		listener: (this: ToDoListItem, event: ToDoListItemEventMap[K]) => unknown,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions
	): void;
}
/* eslint-enable @typescript-eslint/no-unsafe-declaration-merging */

declare global {
	interface HTMLElementTagNameMap {
		'gv-todo-list-item': ToDoListItem;
	}
}
