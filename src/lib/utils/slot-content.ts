import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { warningsEnabled } from './dev.js';

const FORM_CONTROLS = 'input, button, select, textarea';
const warned = new Set<string>();

/** Test hook: forget which components were warned about. */
export const resetSlotWarnings = () => warned.clear();

/**
 * Knows which of a component's slots have content, straight from its light-DOM children, so the
 * component can render a prop as the fallback for an empty slot.
 *
 * A native `<slot>` fallback is not enough: the whitespace between a host's tags is assigned to the
 * default slot and would suppress it. Here whitespace-only text and comments don't count.
 *
 * Slots are containers by default and may hold controls. Pass `phrasingOnly` when the slots sit inside
 * an interactive element or a popup, or take phrasing content by design: outside production builds,
 * the component then logs one warning when a slot holds a form control.
 */
export class SlotContent implements ReactiveController {
	private readonly _host: ReactiveControllerHost & HTMLElement;
	private readonly _names: readonly string[];
	private readonly _phrasingOnly: boolean;
	private _observer?: MutationObserver;
	private _state = new Map<string, boolean>();

	/** `names` lists the slots to track; '' is the default slot. */
	constructor(
		host: ReactiveControllerHost & HTMLElement,
		names: readonly string[] = [''],
		{ phrasingOnly = false }: { phrasingOnly?: boolean } = {}
	) {
		this._host = host;
		this._names = names;
		this._phrasingOnly = phrasingOnly;
		host.addController(this);
	}

	/** Whether the named slot ('' for the default one) has content. */
	has(name = ''): boolean {
		return this._state.get(name) ?? false;
	}

	/**
	 * Also runs on reconnect, where children changed while detached must re-render. Before the first
	 * update one is already pending, so the request adds nothing.
	 */
	hostConnected() {
		this._refresh();
		this._observer = new MutationObserver(() => this._refresh());
		this._observer.observe(this._host, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['slot']
		});
	}

	hostDisconnected() {
		this._observer?.disconnect();
	}

	private _assigned(name: string) {
		return [...this._host.childNodes].filter((node) => {
			if (node instanceof Element) return (node.getAttribute('slot') ?? '') === name;
			return name === '' && node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim();
		});
	}

	private _refresh() {
		let changed = false;
		for (const name of this._names) {
			const nodes = this._assigned(name);
			const has = nodes.length > 0;
			if (this._state.get(name) !== has) changed = true;
			this._state.set(name, has);
			if (this._phrasingOnly) this._warnOnFormControls(name, nodes);
		}
		if (changed) this._host.requestUpdate();
	}

	/** A control can't sit inside the component's own control or popup, nor in a phrasing-only slot. */
	private _warnOnFormControls(name: string, nodes: Node[]) {
		const tag = this._host.localName;
		if (warned.has(tag) || !warningsEnabled()) return;
		const control = nodes
			.filter((node): node is Element => node instanceof Element)
			.flatMap((el) => [el, ...el.querySelectorAll('*')])
			.find(
				(el) =>
					el.matches(FORM_CONTROLS) ||
					(el.constructor as { formAssociated?: boolean }).formAssociated === true
			);
		if (!control) return;
		warned.add(tag);
		console.warn(
			`[grove] <${tag}> ${name ? `slot "${name}"` : 'default slot'} contains <${control.localName}>. ` +
				`<${tag}> slots take text and phrasing content only. Place controls next to the component instead.`
		);
	}
}
