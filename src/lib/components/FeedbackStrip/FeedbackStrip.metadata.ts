export const FeedbackStripMetadata = {
	component: {
		name: 'FeedbackStrip',
		tag: 'gv-feedback-strip',
		path: 'src/lib/components/FeedbackStrip/FeedbackStrip.ts',
		category: 'molecules',
		description:
			'A full-width status strip: a summit-depth colored band with a filled Phosphor status icon, a subheading-scale heading, and an indented message. Three semantic types — success, danger, information — each swapping surface, block borders, both text colors, the icon, and the ARIA live role together.',
		type: 'display',
		version: '1.0.0',
		created: '2026/09/16',
		modified: '2026/09/16'
	},

	usage: {
		useCases: [
			'form-submission-feedback',
			'page-level-status-banner',
			'inline-error-notice',
			'informational-callout'
		],
		requiredProps: ['heading'],
		commonPatterns: [
			{
				name: 'success-confirmation',
				description: 'Confirm a completed action with a heading and a supporting message.',
				composition:
					'<gv-feedback-strip type="success" heading="Changes saved" message="Your profile was updated."></gv-feedback-strip>'
			},
			{
				name: 'danger-alert',
				description:
					'Report a failure. The danger type carries role="alert", so screen readers interrupt to announce it.',
				composition:
					'<gv-feedback-strip type="danger" heading="Upload failed" message="The file exceeds the 10 MB limit."></gv-feedback-strip>'
			},
			{
				name: 'information-notice',
				description: 'Share neutral context that does not block the user.',
				composition:
					'<gv-feedback-strip type="information" heading="Scheduled maintenance" message="The service will be unavailable on Sunday from 02:00 to 04:00 UTC."></gv-feedback-strip>'
			},
			{
				name: 'heading-only',
				description:
					'Omit message (or pass an empty string) when the heading says everything — the body row is not rendered, so no orphan gap appears.',
				composition:
					'<gv-feedback-strip type="success" heading="Changes saved"></gv-feedback-strip>'
			},
			{
				name: 'full-bleed-placement',
				description:
					'The strip paints top and bottom borders only and has no radius, so place it edge-to-edge in its container rather than inside a padded card.',
				composition:
					'<main>\n  <gv-feedback-strip type="information" heading="Beta" message="This page is a preview."></gv-feedback-strip>\n</main>'
			}
		],
		antiPatterns: [
			{
				scenario: 'Using it as a dismissible toast or snackbar',
				reason:
					'gv-feedback-strip has no dismiss button, no timer, and no stacking behavior — it is a static in-flow band.',
				alternative: 'Render and remove the element from the DOM under application control'
			},
			{
				scenario: 'Putting links, buttons, or other interactive content in the message',
				reason:
					'The component exposes string props only (no slots) and declares no focus or hover styles; interactive children would be unstyled and unreachable.',
				alternative: 'Place an action next to the strip, outside the component'
			},
			{
				scenario: 'Nesting it inside a rounded card or padded panel',
				reason:
					'The strip is designed full-bleed with block-only borders and responsive page-margin padding; inset placement double-pads it and orphans the borders.',
				alternative: 'Place it as a direct full-width child of the page or section container'
			},
			{
				scenario: 'Using type="danger" for routine, non-urgent information',
				reason:
					'The danger type maps to role="alert", which interrupts assistive technology; overuse trains users to ignore it.',
				alternative: 'Use type="information" (role="status"), which announces politely'
			}
		]
	},

	composition: {
		slots: null,
		nestedComponents: [
			{
				name: 'Icon',
				customElement: 'gv-icon',
				source: '../Icon/Icon.js',
				role: 'Filled status glyph, fixed per type (check-circle / warning-circle / info), aria-hidden and sized by the header font. The host app must import the Phosphor elements: PhCheckCircle, PhWarningCircle, PhInfo.'
			}
		],
		commonPartners: [],
		parentConstraints: [
			'Place as a full-width child of a ground-surface container — the strip spans its container and has no intrinsic max width.'
		]
	},

	behavior: {
		states: ['success', 'danger', 'information'],
		interactions: null
	},

	variants: {
		type: {
			options: ['success', 'danger', 'information'],
			default: 'success',
			purpose: {
				success:
					'Confirms a completed action — success summit surface, check-circle icon, role="status".',
				danger:
					'Reports a failure or blocking problem — danger summit surface, warning-circle icon, role="alert".',
				information:
					'Shares neutral context — information summit surface, info icon, role="status".'
			}
		}
	},

	accessibility: {
		role: 'status for type="success" and type="information"; alert for type="danger"',
		keyboardSupport:
			'None — the strip is not interactive and contains no focusable content, so it is skipped in the tab order.',
		screenReader:
			'The root is an ARIA live region: polite (role="status") for success and information, assertive (role="alert") for danger. The heading is announced first, then the message. The icon is aria-hidden="true" and never announced — the type is conveyed by the role and the text, not by the glyph.',
		wcag: 'AA',
		notes: [
			'The role is derived from type: success → role="status", danger → role="alert", information → role="status".',
			'Because the root is a live region, inserting the element into the DOM (or changing its heading/message while mounted) is what triggers the announcement — a strip already present at page load is not re-announced.',
			'type reflects to the host attribute, so external CSS can target gv-feedback-strip[type="danger"].',
			'An unknown type value falls back to success for styling, icon, and role.',
			'The decorative icon carries aria-hidden="true"; colour is never the only carrier of meaning because the heading text states the outcome.',
			'summit text-on tokens are contrast-verified against their summit surfaces for both base (heading) and subtle (message) roles.',
			'No focus styles are declared in the component — Grove focus rings are handled by the global surface-scoped CSS.'
		]
	},

	aiHints: {
		priority: 'high',
		keywords: [
			'feedback',
			'status',
			'banner',
			'alert',
			'notice',
			'callout',
			'success message',
			'error message',
			'information strip',
			'form feedback'
		],
		selectionCriteria: {
			use: 'Pick this when a page or section needs a full-width, non-dismissible band announcing the outcome or status of something, with a short heading and an optional supporting message in one of three semantic tracks.',
			skip: 'Skip it when the feedback must be dismissible, floats over content (toast), needs actions or links inside it, or attaches to a single form field — none of which this component supports.'
		}
	}
};
