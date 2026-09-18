export const ColorSwatchMetadata = {
	component: {
		name: 'ColorSwatch',
		tag: 'gv-color-swatch',
		path: 'src/lib/components/ColorSwatch/ColorSwatch.ts',
		category: 'molecules',
		description:
			'Displays a primitive color token as a labeled swatch with a color preview, an OKLCH value and a hex value. Both value rows are copy buttons: the OKLCH row copies the DTCG (W3C Design Tokens) colour object, the hex row copies the plain #rrggbb string, and each reveals a gv-tooltip on hover and on focus. Used in design system documentation and Storybook color pages.',
		type: 'documentation',
		version: '1.1.0',
		created: '2026/05/31',
		modified: '2026/09/16'
	},

	usage: {
		useCases: [
			'color-token-documentation',
			'design-system-palette-page',
			'storybook-color-story',
			'copy-token-value-to-clipboard'
		],
		requiredProps: ['color', 'shade'],
		commonPatterns: [
			{
				name: 'light-swatch',
				description: 'Light shade with dark text — use for shades 50–400',
				composition: `<gv-color-swatch color="brand" shade="50" name="Brand 50" text="dark" oklch="0.93 0.035 145" hex="#DAEFDA"></gv-color-swatch>`
			},
			{
				name: 'dark-swatch',
				description: 'Dark shade with light text — use for shades 500–950',
				composition: `<gv-color-swatch color="brand" shade="700" name="Brand 700" text="light" oklch="0.38 0.075 145" hex="#214522"></gv-color-swatch>`
			},
			{
				name: 'base-swatch',
				description: 'Base color (light or dark variant)',
				composition: `<gv-color-swatch color="base" shade="dark" name="Base Dark" text="light" oklch="0.15 0 0" hex="#0B0B0B"></gv-color-swatch>`
			},
			{
				name: 'toast-on-copy',
				description:
					'Listen for the gv-copy CustomEvent to confirm a copy — the component writes to the clipboard but never renders a confirmation itself.',
				composition: `<gv-color-swatch id="brand-50" color="brand" shade="50" name="Brand 50" text="dark" oklch="0.93 0.035 145" hex="#DAEFDA"></gv-color-swatch>
<script>
  document.querySelector('#brand-50').addEventListener('gv-copy', (e) => {
    showToast(\`Copied the \${e.detail.space} value\`, e.detail.value);
  });
</script>`
			},
			{
				name: 'palette-grid',
				description:
					'A row of swatches on the ground surface. The hex tooltip floats to the left of the column, so leave a gutter on the left of the first swatch.',
				composition: `<div style="display: flex; gap: var(--soft-grid-16); padding-left: var(--soft-grid-64)">
  <gv-color-swatch color="brand" shade="50" name="Brand 50" text="dark" oklch="0.93 0.035 145" hex="#DAEFDA"></gv-color-swatch>
  <gv-color-swatch color="brand" shade="700" name="Brand 700" text="light" oklch="0.38 0.075 145" hex="#214522"></gv-color-swatch>
</div>`
			}
		],
		antiPatterns: [
			{
				scenario: 'Using ColorSwatch as a general-purpose color picker or production control',
				reason:
					'Its only interaction is copying its own token values to the clipboard — it has no selection state, no value output and no form semantics.',
				alternative: 'Use semantic surface tokens and surface components for production UI'
			},
			{
				scenario: 'Passing a raw CSS color to background instead of color + shade props',
				reason:
					'The component resolves the background via --color-{family}-{shade} tokens for design system fidelity',
				alternative: 'Always pass color and shade props that correspond to a real Grove color token'
			},
			{
				scenario: 'Adding isCustomHovering / isHexHovering props to drive the tooltips',
				reason:
					'The two hovered variants in Figma are CSS states (:hover and :focus) of the two copy buttons, not part of the public API.',
				alternative:
					'Let the component own the reveal — there is nothing for the consumer to toggle.'
			},
			{
				scenario: 'Relying on gv-copy firing on every click',
				reason:
					'The clipboard write is feature-detected and can be rejected on an insecure origin or by a denied permission; the event is dispatched only after a successful copy.',
				alternative:
					'Treat gv-copy as a success signal, and do not build state that assumes a click always produces one.'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [{ name: 'Tooltip', source: '../Tooltip/Tooltip.js' }],
		commonPartners: ['Title', 'Tooltip'],
		parentConstraints: [
			'Should be placed inside a surface that loads tokens.css — the component relies on CSS custom properties from the Grove token system',
			'The hex tooltip is pinned outside the left edge of the 9rem column — keep a left gutter of at least 62px so it is not clipped by a scroll container',
			'The consuming app must import the Phosphor copy glyph (@phosphor-icons/webcomponents/PhCopy) for the tooltip icon to render'
		]
	},

	behavior: {
		states: ['DEFAULT', 'HOVER', 'FOCUS'],
		interactions: {
			'click .oklch-group':
				'Copies the DTCG (W3C Design Tokens) colour object for this swatch — {"colorSpace":"oklch","components":[l,c,h],"alpha":1,"hex":"#rrggbb"}, 2-space indented — built from the oklch and hex props. If the oklch string cannot be parsed, the raw oklch prop is copied instead. Dispatches gv-copy with detail { space: "oklch", value } after a successful write.',
			'click .hex-value':
				'Copies the plain #rrggbb string from the hex prop — the universal web fallback. Dispatches gv-copy with detail { space: "hex", value } after a successful write.',
			hover:
				'Hovering either copy button reveals its gv-tooltip ("Copy"); leaving hides it again. Accent beside the OKLCH row, gray to the left of the hex row.',
			focus:
				'Focusing either copy button by keyboard reveals the same tooltip; blurring hides it. Keyboard parity with hover.',
			'gv-copy':
				'CustomEvent (bubbles: true, composed: true) with detail { space: "oklch" | "hex", value: string }, dispatched only after navigator.clipboard.writeText resolves.'
		}
	},

	variants: {
		text: {
			options: ['dark', 'light'],
			default: 'dark',
			purpose: {
				dark: 'Use --color-base-dark for the name label — suitable for light swatches (shades 50–400)',
				light:
					'Use --color-base-light for the name label — suitable for dark swatches (shades 500–950)'
			}
		}
	},

	accessibility: {
		role: 'No role on the host — the two native <button> elements carry the interactive semantics',
		keyboardSupport:
			'Two focusable native buttons in DOM order — the OKLCH value then the hex value. Tab reaches each; Enter and Space activate the copy (native button behavior). Focusing a button reveals its tooltip, so the hint is reachable without a pointer.',
		screenReader:
			'Each copy button is labelled "Copy oklch value" / "Copy hex value" and described by its tooltip via aria-describedby. The color values themselves are rendered as plain text inside the buttons and are read as the button content. A hidden tooltip is visibility: hidden, so it is not exposed until revealed.',
		focusManagement:
			'Focus stays on the activated button after a copy — nothing is moved, opened or dismissed. The global surface-scoped focus-ring system supplies the ring; the component declares none.',
		wcag: 'AA',
		notes: [
			'The text prop must be set to ensure the color name meets AA contrast against the swatch background',
			'Use text="dark" (--color-base-dark) for light backgrounds and text="light" (--color-base-light) for dark backgrounds',
			'Copies dispatch a gv-copy CustomEvent (bubbles: true, composed: true) with detail { space: "oklch" | "hex", value: string } — listen with addEventListener("gv-copy", (e) => use(e.detail))',
			'The copy is silent by design: the component gives no visual confirmation, so a host that needs one should announce it from the gv-copy event (e.g. a polite live region)',
			'navigator.clipboard is feature-detected and rejections are swallowed — an insecure origin or a denied permission produces no error and no event',
			'The tooltips are revealed by CSS on :hover, :focus-visible and :focus-within of their owning button, and hidden with opacity/visibility so they leave the accessibility tree while hidden'
		]
	},

	aiHints: {
		priority: 'low',
		keywords: [
			'color',
			'swatch',
			'palette',
			'token',
			'documentation',
			'copy',
			'clipboard',
			'oklch',
			'hex',
			'dtcg'
		],
		selectionCriteria: {
			use: 'When building a color palette documentation page or a Storybook story that showcases Grove color tokens, especially one where a reader should be able to copy a token value straight out of the page.',
			skip: 'Do not use in production UI — it documents a token rather than participating in a layout, and its only interaction is copying its own values.'
		}
	}
};
