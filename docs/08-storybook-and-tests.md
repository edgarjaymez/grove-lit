# 08 · Storybook and tests

> **What you need from this chapter**
>
> - How a story file is written, and what Storybook's global setup does for every story.
> - The four Vitest test projects: what each one runs, where, and how to run just one.
> - The patterns used in browser tests, so you can add one.

## Storybook

Storybook 10 with `@storybook/web-components-vite` renders every component in isolation. Run it with
`pnpm storybook` (port 6006). Vercel builds the static version with `pnpm build-storybook` and
publishes `storybook-static/` (`vercel.json`).

### A story file

`Button.stories.ts`, shortened:

```ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './Button.js';

const meta: Meta<Args> = {
	title: 'Components/gv-button',
	tags: ['autodocs'],
	render: ({ text, variant, color, size, icon, disabled, type, name, value, href, target, rel, hreflang }) => html`
		…
			<gv-button
				text=${text}
				variant=${variant}
				color=${color}
				size=${size}
				icon=${icon}
				?disabled=${disabled}
				type=${type}
				name=${ifDefined(name || undefined)}
				…
			></gv-button>
		…
	`,
	argTypes: {
		…
	},
	args: {
		text: 'Button',
		variant: 'filled',
		color: 'accent',
		size: 'md',
		disabled: false,
		type: 'button',
		…
	}
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const Tonal: Story = { args: { variant: 'tonal' } };
```

- **`import './Button.js';`** registers the element, the same side-effect import as in chapter 03.
  Story files use `.js` too.
- **`title: 'Components/gv-button'`**: component stories are grouped under _Components_ and named by
  their tag.
- **`tags: ['autodocs']`** generates a docs page from the stories and the manifest.
- **`render`** is a Lit `html` template. Each exported story changes `args`.
- Slots are shown by writing light-DOM children, as in the `Slotted` story:
  `<gv-button …>Save changes</gv-button>`. A component with events can attach listeners in the
  template with `@gv-*=${…}`.
- A story can render the page around the component. `InForm` puts `gv-button` in a `<form>`, cancels
  `submit`, and writes each event and its form data into an `<output>` next to it; its handler
  re-enables the button after a one-second stand-in request. Link stories use `href="#…"`, so the
  Storybook iframe never navigates away.

### Global setup: `.storybook/preview.ts`

Every story gets what a consuming page would have:

- the global CSS: `tokens.css`, `globals.css`, `typography.css`, `effects.css`, `surfaces.css`,
  `a11y.css`, `fonts.css`;
- **every** Phosphor glyph (`import '@phosphor-icons/webcomponents';`), so any icon name works in
  Storybook. A real app registers only the glyphs it uses (chapter 07);
- a **theme toolbar** (System, Light, Dark). The `withTheme` decorator sets `data-theme` on `<html>`,
  or removes it for System, exactly as a consumer would;
- the **a11y addon** (axe), report-only by default (`test: 'todo'`): violations show in the panel but
  do not fail tests. A component whose stories are already clean opts in to failing on violations
  with `parameters: { a11y: { test: 'error' } }` in its stories file (`gv-menu-item` does today),
  until #50 switches the library default to `'error'`.

### Repo-level pages

`src/stories/` holds pages that are not one component: `Home.mdx`, `Accessibility.mdx`, a
`FocusRing` story that shows the ring on every surface, and the `A11yCanary` story used by the canary
test (below). The canary story is hidden from the sidebar and the docs (`tags: ['!dev', '!autodocs',
'a11y-canary']`).

## Tests

All tests run on **Vitest 4**, configured in `vite.config.ts` (there is no separate Vitest config).
The config defines **projects**, each with its own files and environment:

| Project       | Runs                                                                     | Where                    |
| ------------- | ------------------------------------------------------------------------ | ------------------------ |
| `unit`        | `src/**/*.test.ts` and `scripts/**/*.test.mjs` (not `*.browser.test.ts`) | Node                     |
| `browser`     | `src/**/*.browser.test.ts`, with `src/test/browser-setup.ts`             | Chromium, via Playwright |
| `storybook`   | every story, as a test, in three themes: light, dark, OS dark            | Chromium, via Playwright |
| `a11y-canary` | only the canary story; enabled only by `pnpm test:a11y-canary`           | Chromium, via Playwright |

Lit's docs recommend testing components in a real browser rather than in Node with a fake DOM
(<https://lit.dev/docs/tools/testing/>). That is why anything that renders a component is a
`*.browser.test.ts`, and the `unit` project only holds tests that read files or check pure logic.

**Every test must assert something.** The config sets `expect.requireAssertions: true`, so a test with
no `expect` call fails. The Storybook projects turn it off, because a story that renders cleanly makes
no assertion.

### Commands

| Command                                                       | What it does                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------- |
| `pnpm test`                                                   | every project, once                                               |
| `pnpm test:unit`                                              | Vitest in watch mode, every project (despite the name)            |
| `pnpm vitest run --project browser`                           | one project                                                       |
| `pnpm vitest run --project unit src/lib/styles/focus.test.ts` | one file in one project                                           |
| `pnpm test:a11y-canary`                                       | proves the a11y gate still catches planted faults (below)         |
| `pnpm test:storybook-static`                                  | builds static Storybook and checks every story's elements upgrade |

The browser projects need Chromium for Playwright: `pnpm exec playwright install chromium`, once.

**When a browser test times out during a full `pnpm test`**, run that file alone before treating it as
a regression. Under the load of every project at once, a browser test can hit its timeout and then
pass on its own. This has happened here with `focus-ring.browser.test.ts` and
`FeedbackStrip.browser.test.ts`.

### Writing a browser test

`MenuItem.browser.test.ts` shows the usual shape:

```ts
import { afterEach, describe, expect, it } from 'vitest';
import { html, render } from 'lit';
import './MenuItem.js';
import type { MenuItem } from './MenuItem.js';

const host = document.body.appendChild(document.createElement('div'));
host.style.width = '240px';

afterEach(() => render(html``, host));

const mount = async (template: unknown) => {
	render(template, host);
	const items = [...host.querySelectorAll('gv-menu-item')] as MenuItem[];
	await Promise.all(items.map((el) => el.updateComplete));
	return items;
};
```

1. Import the component for its side effect, and its type for TypeScript.
2. Render real markup into a host element with Lit's `render`.
3. **Wait for `updateComplete`** before reading the DOM: Lit renders asynchronously (chapter 02).
4. Read inside the component through `el.shadowRoot`.
5. Clear the host after each test.

`src/test/browser-setup.ts` loads the token CSS and registers the glyphs every component uses by
default, so layout and icons are real.

Two custom commands, defined in `vite.config.ts` and typed in `src/test/commands.d.ts`, are available
through `commands` from `vitest/browser`:

- **`emulateMedia`** sets reduced motion, colour scheme or forced colours for the page.
- **`ariaSnapshot`** returns what the accessibility tree exposes for a selector.

For behaviour that depends on real input, use **`userEvent`** from `vitest/browser`. It sends trusted
clicks and keys through Playwright, as a person would; `el.click()` and `dispatchEvent` send
untrusted ones. `Button.browser.test.ts` relies on it: `userEvent.click(inner)`,
`userEvent.keyboard('{Enter}')`, `userEvent.keyboard('[Space]')`. Playwright waits for an element it
considers disabled; pass `{ force: true }` to click one on purpose.

`src/test/forms.ts` has the helpers for controls in forms: `cancelFormSubmits()` stops every
submission from navigating the page, `recordSubmits()` logs each submit with its form data,
`nextTask()` waits until a control has acted on its form, and `settle()` waits until every Lit
element under a root has updated.

`src/test/themes.ts` gives a `themes` list and `applyTheme()`, for tests that must hold in light,
dark and OS dark.

The `browser` project picks up every `src/**/*.browser.test.ts`, so a new browser test needs no
entry here: a shared test sits next to the code it checks, a component's own test in its directory.
`git ls-files '*.browser.test.ts'` lists them all.

### Tests that keep two copies in step

Some rules exist in two places and a unit test guards that they match:

- `visually-hidden.test.ts`: `.visually-hidden` in `a11y.css` and in `visually-hidden.ts`.
- `focus.test.ts`: the `.gv-surface-*` classes and the `GroveSurface` type.
- `contrast.test.ts`: `tokens.css` and the token JSON.
- `metadata.test.ts`: metadata glyphs and the Phosphor package.

If one of these fails after your change, update the other copy; don't loosen the test.

### The a11y canary

The Storybook project runs axe on every story. It only reports, except where a stories file opts in
to `test: 'error'` (today `gv-menu-item`) until #50 makes that the default. To prove that the
checking itself still works, `src/stories/A11yCanary.stories.ts` plants known faults, and
`pnpm test:a11y-canary` runs only that story and **inverts the result**: it passes only if the run
failed in every theme and reported both planted nodes (`scripts/a11y-canary.mjs`).

## Where to see it in Button.ts

- `Button.stories.ts` imports `./Button.js` and has 18 stories: variants, colours, sizes, icon,
  disabled, a `Slotted` story that passes the label as light-DOM text, link stories, and `InForm` and
  `NamedSubmits` with a visible event log.
- The `storybook` project runs all of them three times, once per theme, with axe reporting.
- `Button.browser.test.ts` covers the form and link behaviour with trusted input: submit, reset,
  `form="id"`, a disabled fieldset, Enter, self-disable, named submits, the supported form
  compositions, and link mode's look in all three themes. Shared tests cover it too: `slots`,
  `host-hidden` and `reduced-motion` loop over every tag in `groveTags`, and `focus-ring` renders
  `gv-button` directly.
