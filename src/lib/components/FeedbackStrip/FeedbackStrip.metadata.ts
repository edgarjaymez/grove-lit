import type { ComponentMetadata } from '../metadata.js';

export const FeedbackStripMetadata = {
	component: {
		name: 'FeedbackStrip',
		tag: 'gv-feedback-strip',
		path: 'src/lib/components/FeedbackStrip/FeedbackStrip.ts',
		category: 'molecules',
		description:
			'A full-width status strip: a summit-depth colored band with a filled Phosphor status icon, a subheading-scale heading, and an indented message. Three semantic types — success, danger, information — each swapping surface, block borders, both text colors and the icon. The live region follows the type (polite, or assertive for danger) unless live chooses the announcement separately.',
		type: 'display',
		version: '1.2.1',
		created: '2026/09/16',
		modified: '2026/10/08'
	},
	phosphor: {
		prop: null,
		default: null,
		fixed: ['check-circle', 'warning-circle', 'info']
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
				name: 'slotted-content',
				description:
					'Pass heading and message as slotted content, for inline emphasis; the props are the fallbacks.',
				composition:
					'<gv-feedback-strip type="success"><span slot="heading">Changes saved</span><span slot="message">Your <strong>profile</strong> was updated.</span></gv-feedback-strip>'
			},
			{
				name: 'success-confirmation',
				description: 'Confirm a completed action with a heading and a supporting message.',
				composition:
					'<gv-feedback-strip type="success" heading="Changes saved" message="Your profile was updated."></gv-feedback-strip>'
			},
			{
				name: 'danger-alert',
				description:
					'Report a failure. With live unset, the danger type carries role="alert", so screen readers interrupt to announce it.',
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
				name: 'static-notice',
				description:
					'A notice rendered with the page that is part of its content, not a status message: live="off" renders no live region, so it is read in document order and never interrupts.',
				composition:
					'<gv-feedback-strip type="information" live="off" heading="Not connected yet" message="The contact form goes live next week."></gv-feedback-strip>'
			},
			{
				name: 'quiet-failure',
				description:
					'A failure that should be announced without interrupting: danger colours with a polite region.',
				composition:
					'<gv-feedback-strip type="danger" live="polite" heading="Draft not synced" message="We will retry in a minute."></gv-feedback-strip>'
			},
			{
				name: 'reliable-announcement',
				description:
					'Keep one strip connected and change its heading and message: changes inside a live region that already exists are what assistive technology announces most reliably.',
				composition:
					'<gv-feedback-strip type="information" live="polite" heading=""></gv-feedback-strip>'
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
				scenario: 'Putting buttons, form controls or other interactive content in a slot',
				reason:
					'Slots take text and phrasing content only. The strip is a static band: it styles no focus or hover state for a control, and gives an action no room of its own.',
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
				alternative:
					'Use type="information" (role="status"), which announces politely; if the danger colours are right but the message is not urgent, keep type="danger" and set live="polite"'
			},
			{
				scenario:
					'Wrapping the strip in your own role="status", role="alert" or aria-live element, or setting those on the host',
				reason:
					'That nests live regions around the same text. ARIA does not define how nested regions are announced, so the message may be read twice, once, or dropped, and an outer polite region cannot quieten the strip’s own alert.',
				alternative: 'Use the live property: polite, assertive or off'
			},
			{
				scenario:
					'live="off" on a message shown in response to a user action without moving focus to it',
				reason:
					'That is a status message with no programmatic role, so assistive technology is never told about it: it fails WCAG 2.2 SC 4.1.3 Status Messages (AA).',
				alternative:
					'Leave live unset or set polite/assertive; use off only for notices that are part of the page, or when focus moves to the strip'
			}
		]
	},

	composition: {
		slots: [
			{
				name: 'heading',
				description: 'The strip heading. Phrasing content only.',
				fallback: 'heading'
			},
			{
				name: 'message',
				description:
					'The message line; may carry inline links. With neither the slot nor message, the row is not rendered.',
				fallback: 'message'
			}
		],
		nestedComponents: [
			{
				name: 'Icon',
				customElement: 'gv-icon',
				source: '../Icon/Icon.js',
				role: 'Filled status glyph, fixed per type (check-circle / warning-circle / info), aria-hidden and sized by the header font. The host app must register the fixed glyphs listed in the phosphor field (PhCheckCircle, PhWarningCircle, PhInfo).'
			}
		],
		commonPartners: [],
		parentConstraints: [
			'Place as a full-width child of a ground-surface container — the strip spans its container and has no intrinsic max width.'
		]
	},

	behavior: {
		states: ['success', 'danger', 'information'],
		announcement: {
			'live unset or unknown':
				'Follows type: role="status" aria-live="polite" for success and information, role="alert" aria-live="assertive" for danger.',
			polite: 'role="status" aria-live="polite" for every type.',
			assertive: 'role="alert" aria-live="assertive" for every type.',
			off: 'No role and no aria-live: ordinary content, never announced by itself.'
		},
		interactions: null
	},

	variants: {
		type: {
			options: ['success', 'danger', 'information'],
			default: 'success',
			purpose: {
				success:
					'Confirms a completed action — success summit surface, check-circle icon; polite (role="status") unless live says otherwise.',
				danger:
					'Reports a failure or blocking problem — danger summit surface, warning-circle icon; assertive (role="alert") unless live says otherwise.',
				information:
					'Shares neutral context — information summit surface, info icon; polite (role="status") unless live says otherwise.'
			}
		},
		live: {
			options: ['polite', 'assertive', 'off'],
			default: 'unset (follows type)',
			purpose: {
				polite: 'Announce without interrupting: outcomes such as a save or a sent message.',
				assertive: 'Interrupt: failures that need immediate attention.',
				off: 'No live region: static notices that are part of the page, or a strip that receives focus when shown.'
			}
		}
	},

	accessibility: {
		role: 'From live: status (polite), alert (assertive) or none (off). With live unset: status for success and information, alert for danger.',
		keyboardSupport:
			'None — the strip is not interactive and contains no focusable content, so it is skipped in the tab order.',
		screenReader:
			'Unless live="off", the root is an ARIA live region with the politeness live chooses (or, unset, polite for success and information and assertive for danger). The heading is announced first, then the message. The icon is aria-hidden="true" and never announced — the type is conveyed by the text, not by the glyph.',
		wcag: 'AA',
		notes: [
			'live chooses the announcement independently of type; unset or unknown, it follows type (success → role="status", danger → role="alert", information → role="status"). Each role is paired with its explicit aria-live value.',
			'Changes to heading or message while the strip is connected and has a live region are announced with its politeness.',
			'Whether inserting a strip, or upgrading a server-rendered one, is announced is not guaranteed: it depends on the browser and screen reader (WCAG technique ARIA22). To announce something reliably, keep a strip connected and change its text.',
			'live="off" strips are never announced by themselves.',
			'type reflects to the host attribute, so external CSS can target gv-feedback-strip[type="danger"].',
			'An unknown type value falls back to success for styling, icon, and (with live unset) role.',
			'The decorative icon carries aria-hidden="true"; colour is never the only carrier of meaning because the heading text states the outcome.',
			'summit text-on tokens are contrast-verified against their summit surfaces for both base (heading) and subtle (message) roles.',
			'The strip is not focusable, so it draws no focus ring.'
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
} satisfies ComponentMetadata;
