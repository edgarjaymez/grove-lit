import { LitElement, css, nothing } from 'lit';
import type { PropertyValues } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { componentReset } from '../../styles/component-reset.js';
import {
	GRACE_MS,
	claimReport,
	missingGlyphMessage,
	phosphorTag,
	warningsEnabled,
	wasReported
} from './phosphor.js';

const pageLoaded = () =>
	document.readyState === 'complete'
		? Promise.resolve()
		: new Promise<void>((resolve) => addEventListener('load', () => resolve(), { once: true }));

/**
 * Renders a Phosphor icon as an SVG via `@phosphor-icons/webcomponents`.
 *
 * The consuming app must register the icons it uses, e.g.
 * `import '@phosphor-icons/webcomponents/PhHeart'` for `name="heart"`.
 * An un-imported (or empty) name renders nothing; outside production builds, an un-imported name
 * logs one console warning with the import to add.
 *
 * Decorative unless `label` is set: without it the glyph is hidden from assistive technology, and
 * with it the glyph is one image named by `label`.
 *
 * @cssprop --gv-icon-regular-display - `display` of the regular weight; an ancestor sets it to swap weights.
 * @cssprop --gv-icon-fill-display - `display` of the fill weight; an ancestor sets it to swap weights.
 */
@customElement('gv-icon')
export class Icon extends LitElement {
	@property({ type: String }) name = '';
	@property({ type: Boolean, attribute: 'is-filled' }) isFilled = false;
	@property({ type: Boolean, attribute: 'fill-in-hover' }) fillInHover = false;
	/** Names a glyph that carries meaning on its own. Unset, empty or blank: decorative. */
	@property({ type: String }) label?: string;

	static styles = [
		componentReset,
		css`
			:host,
			.glyph {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				color: inherit;
			}

			/* Two stacked weights, toggled by inheriting custom properties so an
			   ancestor (e.g. a hovered button) can drive the regular→fill swap. */
			.regular {
				display: var(--gv-icon-regular-display, inline-flex);
			}
			.fill {
				display: var(--gv-icon-fill-display, none);
			}

			:host(:hover) {
				--gv-icon-regular-display: none;
				--gv-icon-fill-display: inline-flex;
			}
		`
	];

	updated(changed: PropertyValues<this>) {
		if (changed.has('name')) this._checkRegistration();
	}

	render() {
		const tagName = phosphorTag(this.name);
		if (!tagName) return nothing;

		const tag = unsafeStatic(tagName);
		const glyph = this.fillInHover
			? staticHtml`
				<${tag} class="regular" weight="regular" aria-hidden="true"></${tag}>
				<${tag} class="fill" weight="fill" aria-hidden="true"></${tag}>
			`
			: staticHtml`<${tag} weight=${this.isFilled ? 'fill' : 'regular'} aria-hidden="true"></${tag}>`;

		// The glyphs themselves are always hidden; a label names the one wrapper around both stacked
		// weights, so a labelled glyph is exactly one image node.
		const label = this.label?.trim() ? this.label : undefined;
		return staticHtml`<span
			class="glyph"
			role=${label ? 'img' : nothing}
			aria-label=${label ?? nothing}
		>${glyph}</span>`;
	}

	/** Reads state and logs; never throws and never changes what renders. */
	private async _checkRegistration() {
		const tag = phosphorTag(this.name);
		if (!tag || typeof customElements === 'undefined' || customElements.get(tag)) return;
		if (!warningsEnabled() || wasReported(tag)) return;
		const name = this.name;
		const hosts: string[] = [];
		for (let root = this.getRootNode(); root instanceof ShadowRoot; root = root.host.getRootNode())
			hosts.unshift(root.host.localName);
		try {
			const registered = await Promise.race([
				customElements.whenDefined(tag).then(() => true),
				pageLoaded().then(
					() => new Promise<false>((resolve) => setTimeout(() => resolve(false), GRACE_MS))
				)
			]);
			// Skip a glyph the element no longer renders: a later name has its own check.
			if (registered || customElements.get(tag) || phosphorTag(this.name) !== tag) return;
			if (claimReport(tag)) console.warn(missingGlyphMessage({ name, tag, hosts }));
		} catch {
			// whenDefined rejects a tag that is not a valid custom element name; nothing to report.
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'gv-icon': Icon;
	}
}
