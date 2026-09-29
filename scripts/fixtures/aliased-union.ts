// Fixture for scripts/manifest-types.test.mjs: aliased unions, a nested alias and a @state field.
import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type FixtureSize = 'sm' | 'md';
type FixtureTone = 'light' | 'dark';

@customElement('gv-fixture')
export class Fixture extends LitElement {
	@property({ type: String }) size: FixtureSize = 'md';
	@property({ type: String }) tone: 'auto' | FixtureTone = 'auto';
	@property({ type: Boolean, attribute: 'is-open' }) isOpen = false;
	@property({ type: String }) label?: string;
	@state() private busy = false;
}
