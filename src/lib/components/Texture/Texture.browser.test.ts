import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { html, render } from 'lit';
import { applyTheme, themes } from '../../../test/themes.js';
import './Texture.js';
import type { Texture } from './Texture.js';

const LIGHT_DEFAULT = 'rgba(38, 77, 40, 0.1)';

const host = document.body.appendChild(document.createElement('div'));

afterEach(() => {
	render(html``, host);
	host.removeAttribute('style');
});
afterAll(() => applyTheme(themes[0]));

const surface = (content: unknown) => html`
	<div
		class="surface"
		style="position: relative; overflow: hidden; width: 160px; height: 120px; background: white"
	>
		${content}
	</div>
`;

const mount = async (template: unknown) => {
	render(template, host);
	const textures = [...host.querySelectorAll('gv-texture')] as Texture[];
	await Promise.all(textures.map((el) => el.updateComplete));
	return textures;
};

const svg = (el: Texture) => el.shadowRoot!.querySelector('svg')!;
const flood = (el: Texture) => el.shadowRoot!.querySelector('feFlood[result="color1Flood"]')!;
const grain = (el: Texture) => getComputedStyle(flood(el)).floodColor;
const baseFrequency = (el: Texture) =>
	el.shadowRoot!.querySelector('feTurbulence')!.getAttribute('baseFrequency');

const shot = (element: Element) => page.screenshot({ element, save: false });

/** The 0.45.0 overlay, verbatim apart from the filter id, as the pixel reference for the default grain. */
const legacy = html`
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		style="position: absolute; inset: 0; display: block; width: 100%; height: 100%; opacity: 1"
	>
		<g filter="url(#legacy-noise)"><rect width="100%" height="100%" fill="black" /></g>
		<defs>
			<filter
				id="legacy-noise"
				x="0"
				y="0"
				width="100%"
				height="100%"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.25 0.25"
					stitchTiles="stitch"
					numOctaves="3"
					result="noise"
					seed="7165"
				/>
				<feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
				<feComponentTransfer in="alphaNoise" result="coloredNoise1">
					<feFuncA
						type="discrete"
						tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
					/>
				</feComponentTransfer>
				<feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
				<feFlood flood-color="rgba(38, 77, 40, 0.1)" result="color1Flood" />
				<feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
				<feMerge><feMergeNode in="color1" /></feMerge>
			</filter>
		</defs>
	</svg>
`;

describe('gv-texture is hidden from assistive technology (#32)', () => {
	it('marks its only rendering, the svg, aria-hidden and leaves the host alone', async () => {
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		expect(svg(el).getAttribute('aria-hidden')).toBe('true');
		expect(el.hasAttribute('role')).toBe(false);
		expect(el.hasAttribute('aria-hidden')).toBe(false);
	});

	it('stays hidden at every opacity and after opacity changes', async () => {
		const [el] = await mount(surface(html`<gv-texture opacity="0"></gv-texture>`));
		for (const opacity of [0, 0.25, 0.4, 1]) {
			el.opacity = opacity;
			await el.updateComplete;
			expect(svg(el).getAttribute('aria-hidden')).toBe('true');
		}
	});

	it('lets pointer input through to content under it', async () => {
		let clicks = 0;
		await mount(
			surface(html`
				<a
					href="#"
					style="position: absolute; inset: 0"
					@click=${(e: Event) => (e.preventDefault(), clicks++)}
					>Link</a
				>
				<gv-texture style="z-index: 1"></gv-texture>
			`)
		);
		await page.getByText('Link').click();
		expect(clicks).toBe(1);
	});
});

describe('gv-texture tint (#20)', () => {
	// Filter output depends on where the surface sits on the page, so both renders use the same spot.
	it('renders the default grain pixel-identical to 0.45.0 in the light theme', async () => {
		await applyTheme(themes[0]);
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		expect(grain(el)).toBe(LIGHT_DEFAULT);
		const current = await shot(host.querySelector('.surface')!);
		await mount(surface(legacy));
		expect(current === (await shot(host.querySelector('.surface')!))).toBe(true);
	});

	it('recolours the grain and restores the default when tint is removed', async () => {
		const [el] = await mount(surface(html`<gv-texture tint="rgb(255, 0, 0)"></gv-texture>`));
		expect(grain(el)).toBe('rgb(255, 0, 0)');
		el.removeAttribute('tint');
		await el.updateComplete;
		expect(grain(el)).toBe(LIGHT_DEFAULT);
	});

	it.each(['not-a-colour', 'var(--gv-missing)', ''])(
		'falls back to the default for tint="%s" instead of painting black',
		async (tint) => {
			await applyTheme(themes[0]);
			const [el] = await mount(surface(html`<gv-texture tint=${tint}></gv-texture>`));
			expect(grain(el)).toBe(LIGHT_DEFAULT);
		}
	);

	it('resolves Grove tokens through var() against the page', async () => {
		const tint = 'color-mix(in srgb, var(--color-accent-700) 12%, transparent)';
		const probe = host.appendChild(document.createElement('span'));
		probe.style.color = tint;
		const expected = getComputedStyle(probe).color;
		probe.remove();
		const [el] = await mount(surface(html`<gv-texture tint=${tint}></gv-texture>`));
		expect(expected).not.toBe('rgb(0, 0, 0)');
		expect(grain(el)).toBe(expected);
	});

	it('ignores an inherited --gv-texture-tint: the tint attribute is the only override', async () => {
		await applyTheme(themes[0]);
		host.style.setProperty('--gv-texture-tint', 'rgb(0, 0, 255)');
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		expect(grain(el)).toBe(LIGHT_DEFAULT);
		host.style.removeProperty('--gv-texture-tint');
	});

	it('updates in place: the host and its svg survive a tint or frequency change', async () => {
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		const before = svg(el);
		el.tint = 'rgb(255, 0, 0)';
		el.frequency = 0.12;
		await el.updateComplete;
		expect(el.isConnected).toBe(true);
		expect(svg(el)).toBe(before);
	});
});

describe('gv-texture frequency (#20)', () => {
	it('defaults to 0.25, coarsens when set, and restores when removed', async () => {
		const [el] = await mount(surface(html`<gv-texture frequency="0.12"></gv-texture>`));
		expect(baseFrequency(el)).toBe('0.12 0.12');
		el.removeAttribute('frequency');
		await el.updateComplete;
		expect(baseFrequency(el)).toBe('0.25 0.25');
	});

	it.each(['0', '-1', 'coarse'])('treats frequency="%s" as the default', async (frequency) => {
		const [el] = await mount(surface(html`<gv-texture frequency=${frequency}></gv-texture>`));
		expect(baseFrequency(el)).toBe('0.25 0.25');
	});

	it('changes the rendered grain', async () => {
		await mount(surface(html`<gv-texture></gv-texture>`));
		const fine = await shot(host.querySelector('.surface')!);
		await mount(surface(html`<gv-texture frequency="0.12"></gv-texture>`));
		expect(fine === (await shot(host.querySelector('.surface')!))).toBe(false);
	});

	it('leaves opacity independent of tint and frequency', async () => {
		const [el] = await mount(
			surface(html`<gv-texture opacity="0.4" tint="rgb(255, 0, 0)" frequency="0.12"></gv-texture>`)
		);
		expect(svg(el).style.opacity).toBe('0.4');
	});
});

describe('gv-texture in the dark theme (#20 FR-DT1 to FR-DT4)', () => {
	it('uses a lighter default at night and the light default by day', async () => {
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		for (const theme of themes) {
			await applyTheme(theme);
			const expected =
				theme.name === 'light' ? LIGHT_DEFAULT : expect.not.stringMatching(/^rgba\(38, 77, 40/);
			expect(grain(el)).toEqual(expected);
		}
	});

	it('switches the default with data-theme at runtime, without a re-render, and back', async () => {
		await applyTheme(themes[0]);
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		const before = svg(el);
		await applyTheme(themes[1]);
		const night = grain(el);
		expect(night).not.toBe(LIGHT_DEFAULT);
		await applyTheme(themes[0]);
		expect(grain(el)).toBe(LIGHT_DEFAULT);
		expect(svg(el)).toBe(before);
	});

	it('keeps an explicit tint in every theme, and lets a light-dark() tint follow the theme', async () => {
		const [fixed, paired] = await mount(
			surface(html`
				<gv-texture tint="rgb(255, 0, 0)"></gv-texture>
				<gv-texture tint="light-dark(rgb(1, 1, 1), rgb(2, 2, 2))"></gv-texture>
			`)
		);
		for (const theme of themes) {
			await applyTheme(theme);
			expect(grain(fixed)).toBe('rgb(255, 0, 0)');
			expect(grain(paired)).toBe(theme.name === 'light' ? 'rgb(1, 1, 1)' : 'rgb(2, 2, 2)');
		}
	});

	it('drops the previous tint when an invalid one replaces it at runtime', async () => {
		await applyTheme(themes[0]);
		const [plain, el] = await mount(
			surface(html`<gv-texture></gv-texture><gv-texture tint="rgb(255, 0, 0)"></gv-texture>`)
		);
		expect(grain(el)).toBe('rgb(255, 0, 0)');
		el.tint = 'not-a-colour';
		await el.updateComplete;
		expect(grain(el)).toBe(grain(plain));
		el.tint = 'light-dark(rgb(1, 1, 1), rgb(2, 2, 2))';
		await el.updateComplete;
		expect(grain(el)).toBe('rgb(1, 1, 1)');
	});

	it('keeps a var() tint on update, even one that resolves only at computed-value time', async () => {
		await applyTheme(themes[0]);
		host.style.setProperty('--grain', 'rgb(3, 3, 3)');
		const [plain, el] = await mount(
			surface(html`<gv-texture></gv-texture><gv-texture tint="rgb(255, 0, 0)"></gv-texture>`)
		);
		el.tint = 'var(--grain)';
		await el.updateComplete;
		expect(grain(el)).toBe('rgb(3, 3, 3)');
		el.tint = 'var(--missing)';
		await el.updateComplete;
		expect(grain(el)).toBe(grain(plain));
	});

	it('falls back to the night default for an invalid tint in the dark theme', async () => {
		await applyTheme(themes[1]);
		const [plain, invalid] = await mount(
			surface(html`<gv-texture></gv-texture><gv-texture tint="not-a-colour"></gv-texture>`)
		);
		expect(grain(invalid)).toBe(grain(plain));
		await applyTheme(themes[0]);
	});
});
