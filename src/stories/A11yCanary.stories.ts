import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { LitElement, html, css } from 'lit';

/** A tiny element whose only content is a contrast failure inside its open shadow root. */
class A11yCanaryShadow extends LitElement {
	static styles = css`
		p {
			color: #bbb;
			background: #fff;
		}
	`;
	render() {
		return html`<p id="canary-shadow">Planted failure inside a shadow root</p>`;
	}
}
if (!customElements.get('a11y-canary-shadow'))
	customElements.define('a11y-canary-shadow', A11yCanaryShadow);

/**
 * Proves the a11y gate can fail. Two planted SC 1.4.3 violations: one in light DOM, one in a shadow
 * root. Only the a11y-canary project runs it, and `pnpm test:a11y-canary` passes only when this story
 * fails in every theme and axe reports both nodes. Kept out of the sidebar, docs and normal run.
 */
const meta: Meta = {
	title: 'Tests/A11y canary',
	tags: ['!dev', '!autodocs', 'a11y-canary'],
	// Always strict, whatever the preview's gate level, so the canary tests axe itself.
	parameters: { a11y: { test: 'error' } }
};
export default meta;

export const PlantedViolations: StoryObj = {
	render: () => html`
		<p id="canary-light" style="color: #bbb; background: #fff">Planted failure in light DOM</p>
		<a11y-canary-shadow></a11y-canary-shadow>
	`
};
