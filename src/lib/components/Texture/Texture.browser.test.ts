import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { commands, page } from 'vitest/browser';
import { html, render } from 'lit';
import { applyTheme, themes } from '../../../test/themes.js';
import './Texture.js';
import type { Texture, TextureColor } from './Texture.js';

/** Figma's Texture `color` variants: {track}/700 at 10 %, read from the Grove library. */
const DAY: Record<TextureColor, string> = {
	accent: 'rgba(98, 24, 122, 0.1)',
	brand: 'rgba(38, 77, 40, 0.1)',
	danger: 'rgba(128, 4, 26, 0.1)',
	gray: 'rgba(70, 66, 61, 0.1)',
	information: 'rgba(0, 72, 113, 0.1)',
	success: 'rgba(0, 82, 56, 0.1)'
};
const TRACKS = Object.keys(DAY) as TextureColor[];
/** The night grain: {track}/50 at 10 % (DESIGN_SYSTEM.md, Dark Theme). */
const night = (track: TextureColor) =>
	`color-mix(in srgb, var(--color-${track}-50) 10%, transparent)`;
const LIGHT_DEFAULT = DAY.brand;

const host = document.body.appendChild(document.createElement('div'));
host.id = 'texture-host';

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
const surfaceShot = () => shot(host.querySelector('.surface')!);

/** A colour as the page resolves it under the current theme, through a probe element. */
const resolve = (color: string) => {
	const probe = host.appendChild(document.createElement('span'));
	probe.style.color = color;
	const value = getComputedStyle(probe).color;
	probe.remove();
	return value;
};
const alpha = (color: string) =>
	/\/|rgba/.test(color) ? Number(color.match(/([\d.]+)\)$/)![1]) : 1;
const channels = (color: string) => color.match(/\d+/g)!.slice(0, 3).map(Number);

/** The 0.44.0 overlay, before tint, verbatim apart from the filter id: the default grain's pixel reference. */
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

	it('leaves no node in the accessibility tree at any opacity', async () => {
		const [el] = await mount(
			surface(
				html`<gv-texture opacity="0"></gv-texture>
					<p>Surface copy</p>`
			)
		);
		for (const opacity of [0, 1]) {
			el.opacity = opacity;
			await el.updateComplete;
			const tree = await commands.ariaSnapshot('#texture-host');
			expect(tree).toContain('Surface copy');
			expect(tree).not.toMatch(/- img\b/);
		}
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

describe('gv-texture stacking (#32 FR-05)', () => {
	// The test frame is scaled, so a screenshot's edge pixels blend with what lies just outside the
	// element. The probe sits inset in the box, so its edges blend only with the box's own white.
	const box = (style: string) =>
		html`<div style="${style} padding: 8px; background: white">
			<div class="content" style="width: 64px; height: 44px; background: white"></div>
		</div>`;
	const boxShot = () => shot(host.querySelector('.content')!);

	it('paints positioned content that follows it above the grain', async () => {
		await mount(
			surface(html`<gv-texture tint="rgb(255, 0, 0)"></gv-texture>${box('position: relative;')}`)
		);
		const over = await boxShot();
		await mount(surface(box('position: relative;')));
		expect(over === (await boxShot())).toBe(true);
	});

	it('paints over unpositioned content, which is why the rule exists', async () => {
		await mount(surface(html`<gv-texture tint="rgb(255, 0, 0)"></gv-texture>${box('')}`));
		const under = await boxShot();
		await mount(surface(box('')));
		expect(under === (await boxShot())).toBe(false);
	});
});

describe('gv-texture tint (#20)', () => {
	// Filter output depends on where the surface sits on the page, so both renders use the same spot.
	it('renders the default grain pixel-identical to 0.44.0 in the light theme', async () => {
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

	it('repaints the grain when a tint is set, replaced by an invalid one, or removed', async () => {
		await applyTheme(themes[0]);
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		const plain = await surfaceShot();
		el.tint = 'rgb(255, 0, 0)';
		await el.updateComplete;
		expect(plain === (await surfaceShot())).toBe(false);
		el.tint = 'not-a-colour';
		await el.updateComplete;
		expect(plain === (await surfaceShot())).toBe(true);
		el.tint = 'rgb(255, 0, 0)';
		await el.updateComplete;
		el.removeAttribute('tint');
		await el.updateComplete;
		expect(plain === (await surfaceShot())).toBe(true);
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
		const expected = resolve(tint);
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
	it('uses brand/700 at 10 % by day and brand/50 at 10 % at night', async () => {
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		for (const theme of themes) {
			await applyTheme(theme);
			expect(grain(el)).toBe(theme.name === 'light' ? LIGHT_DEFAULT : resolve(night('brand')));
		}
	});

	it('repaints the default on a data-theme switch, without a re-render, and back', async () => {
		await applyTheme(themes[0]);
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		const before = svg(el);
		const day = await surfaceShot();
		await applyTheme(themes[1]);
		expect(grain(el)).toBe(resolve(night('brand')));
		expect(day === (await surfaceShot())).toBe(false);
		await applyTheme(themes[0]);
		expect(grain(el)).toBe(LIGHT_DEFAULT);
		expect(day === (await surfaceShot())).toBe(true);
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

describe('gv-texture color, the Figma variants (#48)', () => {
	it.each(TRACKS)('paints the %s grain from its day and night tones', async (track) => {
		const [el] = await mount(surface(html`<gv-texture color=${track}></gv-texture>`));
		for (const theme of themes) {
			await applyTheme(theme);
			const expected = theme.name === 'light' ? DAY[track] : resolve(night(track));
			expect(grain(el)).toBe(expected);
			expect(alpha(grain(el))).toBeLessThanOrEqual(0.1);
		}
		await applyTheme(themes[0]);
	});

	it.each(['', 'purple', 'toString'])('treats color="%s" as brand', async (color) => {
		await applyTheme(themes[0]);
		const [el] = await mount(surface(html`<gv-texture color=${color}></gv-texture>`));
		expect(grain(el)).toBe(DAY.brand);
	});

	// Figma rounds its noise colours to 8 bits; the literals must stay on the palette they come from.
	it.each(TRACKS)('keeps the %s day tone on its --color-…-700 token', async (track) => {
		await applyTheme(themes[0]);
		const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
		ctx.fillStyle = resolve(`var(--color-${track}-700)`);
		ctx.fillRect(0, 0, 1, 1);
		const token = [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
		channels(DAY[track]).forEach((channel, i) =>
			expect(Math.abs(channel - token[i])).toBeLessThanOrEqual(1)
		);
	});

	it('lets tint override the colour in every theme', async () => {
		const [el] = await mount(
			surface(html`<gv-texture color="accent" tint="rgb(255, 0, 0)"></gv-texture>`)
		);
		for (const theme of themes) {
			await applyTheme(theme);
			expect(grain(el)).toBe('rgb(255, 0, 0)');
		}
		await applyTheme(themes[0]);
	});

	it.each(['not-a-colour', 'var(--missing)'])(
		'falls back to the colour’s own default for tint="%s", not to brand',
		async (tint) => {
			const [plain, el] = await mount(
				surface(html`
					<gv-texture color="accent"></gv-texture>
					<gv-texture color="accent" tint=${tint}></gv-texture>
				`)
			);
			for (const theme of themes) {
				await applyTheme(theme);
				expect(grain(el)).toBe(grain(plain));
			}
			await applyTheme(themes[0]);
			expect(grain(el)).toBe(DAY.accent);
		}
	);

	it('repaints a colour change in place, and back', async () => {
		await applyTheme(themes[0]);
		const [el] = await mount(surface(html`<gv-texture></gv-texture>`));
		const before = svg(el);
		const brand = await surfaceShot();
		el.color = 'accent';
		await el.updateComplete;
		expect(grain(el)).toBe(DAY.accent);
		expect(brand === (await surfaceShot())).toBe(false);
		el.color = 'brand';
		await el.updateComplete;
		expect(brand === (await surfaceShot())).toBe(true);
		expect(svg(el)).toBe(before);
	});
});
