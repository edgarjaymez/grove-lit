import { afterEach, describe, expect, it } from 'vitest';
import { commands } from 'vitest/browser';

/**
 * `axNodes` must report what Chrome computed, not a re-implementation (#21 FR-17). A form-associated
 * element labelled by a page `<label>` is the case that tells them apart: Chrome names the role-less
 * host after the label, and only a reader of Chrome's own tree sees that.
 */
class AxProbeField extends HTMLElement {
	static formAssociated = true;
	readonly internals = this.attachInternals();
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).innerHTML =
			'<button role="checkbox" aria-checked="false"></button><span hidden id="d">Hidden text</span>';
	}
}
customElements.define('ax-probe-field', AxProbeField);

const host = document.body.appendChild(document.createElement('div'));
host.id = 'ax-host';
const nodes = (all: { role: string; name: string }[], role: string) =>
	all.filter((n) => n.role === role).map((n) => n.name);
afterEach(() => host.replaceChildren());

describe('axNodes', () => {
	it("reads Chrome's tree: a page label names the form-associated host, not its control", async () => {
		host.innerHTML = '<label for="f">Agree</label><ax-probe-field id="f"></ax-probe-field>';
		const nodes = await commands.axNodes('#ax-host');
		expect(nodes.find((n) => n.node === 'ax-probe-field')).toMatchObject({
			role: 'generic',
			name: 'Agree'
		});
		expect(nodes.find((n) => n.role === 'checkbox')).toMatchObject({ name: '', checked: 'false' });
	});

	it('follows element references across the shadow boundary, which ariaSnapshot misses', async () => {
		host.innerHTML = '<label for="f">Agree</label><ax-probe-field id="f"></ax-probe-field>';
		const field = host.querySelector<AxProbeField>('ax-probe-field')!;
		const control = field.shadowRoot!.querySelector('button')!;
		control.ariaLabelledByElements = [...field.internals.labels] as Element[];
		expect(nodes(await commands.axNodes('#ax-host'), 'checkbox')).toEqual(['Agree']);
		// Playwright's own name computation reports the same checkbox unnamed.
		expect(await commands.ariaSnapshot('#ax-host')).not.toContain('checkbox "Agree"');
	});

	it('walks shadow roots and leaves ignored nodes out', async () => {
		host.innerHTML = '<ax-probe-field></ax-probe-field>';
		const all = await commands.axNodes('#ax-host');
		expect(all.map((n) => n.node)).toContain('button');
		expect(all.some((n) => n.name === 'Hidden text' || n.node === 'span')).toBe(false);
	});

	it('returns no nodes for an element hidden from assistive technology', async () => {
		host.innerHTML = '<div id="gone" aria-hidden="true"><button>Hidden</button></div>';
		expect(await commands.axNodes('#gone')).toEqual([]);
	});
});
