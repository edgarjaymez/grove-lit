import { html, nothing } from 'lit';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { warningsEnabled } from './dev.js';

/** How long after the page's `load` a control may still receive its name before it counts as unnamed. */
export const NAME_GRACE_MS = 2000;

const reported = new Set<string>();

/** Test hook: forget which tags were warned about. */
export const resetNameWarnings = () => reported.clear();

const warnOnce = (key: string, message: string) => {
	if (!warningsEnabled() || reported.has(key)) return;
	reported.add(key);
	console.warn(message);
};

const pageLoaded = () =>
	document.readyState === 'complete'
		? Promise.resolve()
		: new Promise<void>((resolve) => addEventListener('load', () => resolve(), { once: true }));

const DESCRIPTION_ID = 'description';

const text = (value: string | null | undefined) => (value?.trim() ? value : undefined);

/**
 * The `aria-label` for a control's focusable element when no visible text names it: `label`, or for one
 * minor the host's legacy `aria-label`. Undefined when neither is set.
 */
export const invisibleName = (label: string | undefined, fallback: HostLabelFallback) =>
	text(label) ?? fallback.label;

/** The `aria-describedby` for a control's focusable element: the description below, when there is one. */
export const describedBy = (description: string | undefined) =>
	text(description) ? DESCRIPTION_ID : nothing;

/**
 * A control's description, in its own shadow root next to the focusable element. It is `hidden`, not
 * visually hidden: a referenced hidden element still describes, and isn't read a second time as text.
 */
export const descriptionNode = (description: string | undefined) =>
	text(description) ? html`<span id=${DESCRIPTION_ID} hidden>${description}</span>` : nothing;

/**
 * Reads the `aria-label` a page still puts on the host, for one minor after `label` replaced it as the
 * naming API. The host keeps it, so it is also named there: outside production builds, the first such
 * host of each tag logs one warning. Remove in the minor after the one that introduces `label`.
 */
export class HostLabelFallback implements ReactiveController {
	private readonly _host: ReactiveControllerHost & HTMLElement;
	private readonly _attributes: readonly string[];
	private _observer?: MutationObserver;

	/** `attributes` lists the host attributes that used to be forwarded; the first one is the name. */
	constructor(
		host: ReactiveControllerHost & HTMLElement,
		attributes: readonly string[] = ['aria-label']
	) {
		this._host = host;
		this._attributes = attributes;
		host.addController(this);
	}

	hostConnected() {
		this._observer = new MutationObserver(() => this._host.requestUpdate());
		this._observer.observe(this._host, {
			attributes: true,
			attributeFilter: [...this._attributes]
		});
	}

	hostDisconnected() {
		this._observer?.disconnect();
	}

	hostUpdated() {
		const tag = this._host.localName;
		for (const attribute of this._attributes) {
			if (!this._host.hasAttribute(attribute)) continue;
			warnOnce(
				`${tag}[${attribute}]`,
				attribute === 'aria-label'
					? `[grove] <${tag} aria-label> names the host, not the control. Use label="…" instead; ` +
							'the aria-label fallback is removed in the next minor.'
					: `[grove] <${tag} ${attribute}> can't reach the control inside the shadow root. ` +
							'Pass the text as description="…" instead.'
			);
		}
	}

	/** The host's non-blank `aria-label`, or undefined. */
	get label(): string | undefined {
		return text(this._host.getAttribute(this._attributes[0]));
	}
}

/**
 * Outside production builds, logs one warning per tag when a control is still unnamed a grace period
 * after the page has loaded. `isNamed` is read then, so a name set late doesn't trigger it.
 */
export const warnIfUnnamed = (host: HTMLElement, isNamed: () => boolean) => {
	const tag = host.localName;
	if (!warningsEnabled() || reported.has(tag)) return;
	void pageLoaded().then(() =>
		setTimeout(() => {
			if (!host.isConnected || isNamed()) return;
			warnOnce(
				tag,
				`[grove] <${tag}> has no accessible name. Give it visible text, a page <label> where the ` +
					'control supports one, or label="…".'
			);
		}, NAME_GRACE_MS)
	);
};
