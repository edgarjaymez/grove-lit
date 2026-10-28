# 00 · The whiteboard

> **What you learn here**
>
> - The whole repo on one board: what you edit, which tool reads it and what comes out.
> - What happens in the browser when a page uses Grove.
> - The five layers of the repo, and the chapter for each layer.
> - The path of one change from your editor to npm.
> - The open work, and the order in which it can land.
>
> **Read first:** nothing. **Time:** 30 minutes.
>
> Open work as of main @ e251d45, 2026-10-27.

Grove is a library of web components and a design system. It uses Lit 3 and TypeScript. It
publishes one npm package, `@edgarjaymez/grove`, at version 0.45.0 on `main`. The package holds
15 custom elements with the `gv-` prefix, the design tokens, two fonts and the CSS for the page.

This chapter is the map. Each box on each diagram has a chapter that explains it. Use the tables
under the diagrams to find that chapter.

## Whiteboard

The first diagram shows the system map: the files that you edit, the tools that read them, and the
files that go to npm.

```mermaid
flowchart LR
	accTitle: The system map of the Grove repo
	accDescr: Token JSON goes through Terrazzo to tokens.css. Component files go through the Vite library build to dist/index.js and through unplugin-dts to the type files. The JSDoc tags in the component files go through the manifest analyzer to custom-elements.json. check-manifest compares the manifest with the sources and the metadata, and generate-framework-types writes astro.d.ts. A copy step puts tokens.css, the page CSS, the fonts and the ledger into dist. The maintainer publishes dist to npm by hand.

	subgraph edit["You edit"]
		tj["Token JSON<br/>src/lib/tokens/"]
		comp["Component files<br/>src/lib/components/*/*.ts"]
		meta["Metadata files<br/>*.metadata.ts"]
		pcss["Page CSS and fonts<br/>src/lib/styles/*.css, fonts/"]
		ledger["Release ledger<br/>components-since.json"]
	end

	subgraph build["pnpm build"]
		tz["Terrazzo<br/>pnpm build-tokens"]
		vite["Vite library build<br/>vite build"]
		dts["unplugin-dts"]
		copy["copy-static-assets"]
		cem["Manifest analyzer<br/>cem analyze"]
		fw["generate-framework-types.mjs"]
		chk["check-manifest.mjs"]
	end

	tcss["tokens.css<br/>generated, committed"]

	subgraph dist["dist/"]
		js["index.js"]
		types["*.d.ts"]
		assets["tokens/, styles/, fonts/,<br/>components-since.json"]
		cej["custom-elements.json"]
		astro["types/astro.d.ts"]
	end

	npm["npm registry<br/>published by hand"]

	tj --> tz --> tcss --> copy
	pcss --> copy
	ledger --> copy
	copy --> assets
	comp --> vite --> js
	meta --> vite
	comp --> dts --> types
	comp -->|"JSDoc tags"| cem --> cej
	cej --> fw --> astro
	cej --> chk
	comp -.->|compared| chk
	meta -.->|compared| chk
	dist --> npm
```

| Box                                                  | What it is                                                                | Chapter                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Token JSON, Terrazzo, `tokens.css`                   | The design values in DTCG JSON, and the CSS that Terrazzo makes from them | [11 · Design tokens](11-design-tokens.md#the-pipeline)                                      |
| Component files                                      | One Lit class for each `gv-*` tag                                         | [04 · Anatomy of a component](04-anatomy-of-a-component.md#whiteboard)                      |
| Metadata files                                       | A description of each component for tools and AI assistants               | [15 · Metadata and the manifest](15-metadata-and-the-manifest.md#component-metadata)        |
| Page CSS and fonts                                   | `grove.css` and the files it imports                                      | [13 · Themes and page CSS](13-themes-and-page-css.md#the-page-level-css)                    |
| Release ledger                                       | The first version of each component                                       | [19 · Release](19-release.md#the-release-ledger)                                            |
| Vite library build, unplugin-dts, copy-static-assets | The bundle, the type files and the copied files                           | [18 · Build and package](18-build-and-package.md#the-vite-library-build)                    |
| Manifest analyzer, `check-manifest.mjs`              | The custom elements manifest, and the check that fails the build          | [15 · Metadata and the manifest](15-metadata-and-the-manifest.md#when-check-manifest-fails) |
| `generate-framework-types.mjs`, `astro.d.ts`         | Attribute types for Astro templates                                       | [15 · Metadata and the manifest](15-metadata-and-the-manifest.md#framework-types)           |
| `dist/`                                              | The only folder that npm gets                                             | [18 · Build and package](18-build-and-package.md#what-dist-holds)                           |
| npm, published by hand                               | No CI publishes the package                                               | [19 · Release](19-release.md#release-by-hand)                                               |

`pnpm build` runs three steps in this order: `pnpm build-tokens`, `vite build` and
`pnpm build-manifest`. The last step runs the analyzer, writes `astro.d.ts` and then runs
`check-manifest.mjs`. Thus a component that breaks the manifest rules fails at the end of the build,
not in `pnpm check`.

The second diagram shows the checks and the documentation around the library. None of these files
go to npm.

```mermaid
flowchart LR
	accTitle: The checks and the documentation around the library
	accDescr: Story files go to Storybook. The static Storybook build goes to Vercel. pnpm test runs three test projects, unit in Node, browser in Chromium and storybook, which renders every story in three themes. A fourth project, the a11y canary, runs only from its own script.

	subgraph files["Files"]
		unitf["*.test.ts and<br/>scripts/*.test.mjs"]
		brf["*.browser.test.ts"]
		stf["*.stories.ts and<br/>src/stories/*.mdx"]
	end

	subgraph vitest["pnpm test (Vitest)"]
		unit["unit project<br/>Node"]
		browser["browser project<br/>Chromium"]
		sbt["storybook project<br/>light, dark, OS dark"]
	end

	canary["a11y-canary project<br/>pnpm test:a11y-canary"]

	subgraph sb["Storybook 10"]
		dev["pnpm storybook<br/>dev server"]
		static["pnpm build-storybook<br/>storybook-static/"]
	end

	vercel["Vercel<br/>public Storybook"]

	unitf --> unit
	brf --> browser
	stf --> sbt
	stf --> dev
	stf --> static --> vercel
	stf --> canary
```

| Box                                          | What it is                            | Chapter                                                   |
| -------------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| Test files and the test projects             | Four projects in one `vite.config.ts` | [17 · Tests](17-tests.md#the-four-test-projects)          |
| Story files, Storybook dev and static builds | The catalogue of every component      | [16 · Storybook](16-storybook.md#a-story-file)            |
| a11y canary                                  | A check that the a11y checks can fail | [09 · Accessibility](09-accessibility.md#the-a11y-canary) |
| Vercel                                       | The host of the static Storybook      | [16 · Storybook](16-storybook.md#deploy)                  |

## The runtime map

The diagram shows what happens in the browser when a page uses Grove.

```mermaid
flowchart TB
	accTitle: The runtime map of a page that uses Grove
	accDescr: The page imports grove.css, which puts every token on the root as a custom property. The page imports the package, which registers 15 tags. The browser upgrades each host. Lit renders each host into its shadow root and adopts its static styles. The tokens reach inside through inherited custom properties. A surface class sets the focus ring colour. User input inside a shadow root comes out as a composed gv event that the page hears on the host.

	css["Page imports grove.css"]
	root["Tokens on :root<br/>as CSS custom properties"]
	mod["Page imports @edgarjaymez/grove"]
	reg["15 tags registered<br/>gv-button, gv-icon and more"]
	up["Browser upgrades each host"]
	sr["Lit renders into the shadow root<br/>and adopts static styles"]
	inh["var(--token) resolves inside<br/>custom properties inherit"]
	surf["A .gv-surface-* class<br/>sets --gv-focus-ring"]
	ring["The focus ring inside<br/>reads --gv-focus-ring"]
	act["User clicks or types<br/>inside the shadow root"]
	ev["Component dispatches gv-* event<br/>bubbles: true, composed: true"]
	page["Page listener on the host<br/>or on document"]

	css --> root --> inh
	mod --> reg --> up --> sr --> inh
	surf --> ring
	inh --> ring
	sr --> act --> ev --> page
```

| Box                                                     | Chapter                                                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `grove.css`, tokens on `:root`, themes                  | [13 · Themes and page CSS](13-themes-and-page-css.md#the-page-level-css)                                                                   |
| The import of the package, the registration of the tags | [20 · Grove in an app](20-grove-in-an-app.md#register-the-elements)                                                                        |
| Upgrade                                                 | [02 · Web components](02-web-components.md#upgrade)                                                                                        |
| The shadow root and `static styles`                     | [02 · Web components](02-web-components.md#shadow-dom) and [06 · Styles inside a component](06-styles-inside-a-component.md#static-styles) |
| Inherited custom properties                             | [06 · Styles inside a component](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary)                                         |
| Surface classes and the focus ring                      | [12 · Surfaces and elevation](12-surfaces-and-elevation.md#surface-classes) and [14 · The focus ring](14-the-focus-ring.md#the-mechanism)  |
| `gv-*` events                                           | [08 · Events](08-events.md#the-event-rules)                                                                                                |

The sequence diagram shows the same work in time order, for one `gv-button`.

```mermaid
sequenceDiagram
	accTitle: One gv-button from page load to the first event
	accDescr: The page parses the gv-button tag before the script runs, so the element is undefined. The Grove module registers the tag, and the browser upgrades the element. Lit renders the template into the shadow root in a microtask. A click on the inner button is a composed event, so the page sees it on the host.

	participant P as Page
	participant B as Browser
	participant G as Grove module
	participant H as gv-button host
	participant S as Shadow root

	P->>B: Parse HTML with a gv-button tag
	Note over B,H: The element is undefined. It shows only its light DOM text.
	P->>G: import '@edgarjaymez/grove'
	G->>B: customElements.define('gv-button', Button)
	B->>H: Upgrade. Run the constructor, then connectedCallback
	H->>S: Lit creates the shadow root
	H->>S: In a microtask, render() writes the inner button
	Note over S: var(--token) values come in from the page
	P->>S: User clicks the inner button
	S->>P: The click is composed, so it leaves the shadow root
	Note over P: The listener sees event.target as the host
```

Two facts on this board cause most of the surprises in this repo:

- **The page CSS does not go into a shadow root.** Only inherited properties and custom properties
  go in. Thus each component uses `var(--token)` values directly, and the page cannot style the
  inner markup with a class.
  [Source: MDN, Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- **An event leaves a shadow root only when its `composed` flag is true.** Grove dispatches every
  `gv-*` event with `bubbles: true, composed: true`. The page then sees the host as the target.
  [Source: MDN, Event: composed property](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed)

The page must also import each Phosphor glyph that it or a component draws, for example
`import '@phosphor-icons/webcomponents/PhTree';`. `@phosphor-icons/webcomponents` is an optional
peer dependency. [20 · Grove in an app](20-grove-in-an-app.md#phosphor-glyphs) tells
which glyphs each component needs.

## The five layers

The diagram shows the five layers of the repo. Each layer uses the layer above it.

```mermaid
flowchart TB
	accTitle: The five layers of the repo
	accDescr: Layer 1 is the tokens. Layer 2 is the page CSS, which imports the tokens. Layer 3 is the components, which read the tokens. Layer 4 is the metadata and the manifest, which describe the components. Layer 5 is the tools: tests, Storybook, build and release. They check and ship the other four layers.

	l1["1 Tokens<br/>src/lib/tokens/"]
	l2["2 Page CSS<br/>src/lib/styles/*.css"]
	l3["3 Components<br/>src/lib/components/"]
	l4["4 Metadata and manifest<br/>*.metadata.ts, custom-elements.json"]
	l5["5 Tools<br/>tests, Storybook, build, release"]

	l1 --> l2
	l1 --> l3
	l3 --> l4
	l2 --> l5
	l3 --> l5
	l4 --> l5
```

**Layer 1, tokens.** A token is a named design value: a colour, a spacing, a radius, a shadow or a
type style. The source is 24 DTCG token files and one resolver file in `src/lib/tokens/`.
Terrazzo writes them into one file, `tokens.css`, with a light theme, a dark theme, four
breakpoints and a print variant. Read
[11 · Design tokens](11-design-tokens.md#what-a-token-is) first. Then read
[12 · Surfaces and elevation](12-surfaces-and-elevation.md#tracks-and-depths) for the surface
system that the colour tokens describe.

**Layer 2, page CSS.** `grove.css` imports `tokens.css`, the fonts and five more CSS files for the
page. The five files hold the globals, the typography classes, the effect classes, the surface
classes and the `.visually-hidden` class. These rules style the light DOM only. The page imports
`grove.css` one time.
[13 · Themes and page CSS](13-themes-and-page-css.md#the-page-level-css) explains each file.

**Layer 3, components.** Each component is one LitElement class in its own directory. It registers
its tag, declares its properties, adopts `static styles` and renders a template into its shadow
root. Read [02 · Web components](02-web-components.md#custom-elements) and
[03 · Lit essentials](03-lit-essentials.md#litelement-and-the-decorators), then walk one file in
[04 · Anatomy of a component](04-anatomy-of-a-component.md#whiteboard).
[05 · Component catalogue](05-component-catalogue.md#the-catalogue-table) lists all 15.

**Layer 4, metadata and manifest.** Each component has a `*.metadata.ts` file. It is a description
of the component for tools and AI assistants. The build also writes `custom-elements.json` from the
JSDoc tags and the decorators. A script fails the build when the two do not agree with the code.
[15 · Metadata and the manifest](15-metadata-and-the-manifest.md#component-metadata) explains both.

**Layer 5, tools.** Vitest runs the unit tests, the browser tests and every story in three
themes. Storybook shows each component, and Vercel hosts the static build. Vite builds the package,
and the maintainer publishes it by hand. Read [16 · Storybook](16-storybook.md#a-story-file),
[17 · Tests](17-tests.md#the-four-test-projects),
[18 · Build and package](18-build-and-package.md#the-build-steps)
and [19 · Release](19-release.md#no-ci).

### Where to go next

**Part 1, Foundations**

- [01 · Repo map](01-repo-map.md): each folder and file, and what goes to npm.
- [02 · Web components](02-web-components.md): custom elements, upgrade, shadow DOM and slots.
- [03 · Lit essentials](03-lit-essentials.md): the Lit features that Grove uses, and the ones it
  does not use.

**Part 2, Components**

- [04 · Anatomy of a component](04-anatomy-of-a-component.md): `Button.ts` from the top to the
  bottom.
- [05 · Component catalogue](05-component-catalogue.md): all 15 tags and the proposed tags.
- [06 · Styles inside a component](06-styles-inside-a-component.md): `static styles`, the reset
  and what crosses the shadow boundary.
- [07 · Slots](07-slots.md): the `SlotContent` controller and the slot rules.
- [08 · Events](08-events.md): the `gv-*` events and the three event patterns.

**Part 3, Accessibility and forms**

- [09 · Accessibility](09-accessibility.md): the WCAG 2.2 AA target, names and the a11y checks.
- [10 · Forms](10-forms.md): why no component takes part in a form on `main`, and the open work
  that changes it.

**Part 4, Design system**

- [11 · Design tokens](11-design-tokens.md): the token files, the pipeline and the names.
- [12 · Surfaces and elevation](12-surfaces-and-elevation.md): tracks, depths and the nesting
  rules.
- [13 · Themes and page CSS](13-themes-and-page-css.md): light, dark, print and `grove.css`.
- [14 · The focus ring](14-the-focus-ring.md): how a surface sets the colour of the ring.

**Part 5, Tools**

- [15 · Metadata and the manifest](15-metadata-and-the-manifest.md): the metadata files, the
  manifest and its checks.
- [16 · Storybook](16-storybook.md): stories, the global preview and the deploy.
- [17 · Tests](17-tests.md): the four test projects and the test helpers.
- [18 · Build and package](18-build-and-package.md): the build steps and the `package.json` fields.
- [19 · Release](19-release.md): the release by hand and the ledger.

**Part 6, Use and change Grove**

- [20 · Grove in an app](20-grove-in-an-app.md): install, import and use the package.
- [21 · House rules and how work moves](21-house-rules-and-how-work-moves.md): the conventions,
  the roadmap decisions and the merge order.
- [22 · Cookbook](22-cookbook.md): step-by-step recipes.
- [23 · Known drift](23-known-drift.md): the places where two sources do not agree.

**Back matter:** [the syllabus](syllabus.md#progress-checklist),
[the glossary](glossary.md#grove), [the topic index](topic-index.md#open-work-by-number) and
[the style rules](style-rules.md#the-ste-standard).

## The life of a change

The diagram shows the path of one change, from your editor to npm.

```mermaid
flowchart LR
	accTitle: The life of a change
	accDescr: Edit the source. Run pnpm check, then pnpm vitest run, then pnpm build, which ends with the manifest check. Add or update the story. Format and lint only the files that you changed. Open a PR. No CI runs, so the local checks are the gate. The PR merges with a merge commit. Later the maintainer records the release in the ledger and publishes to npm by hand.

	edit["Edit the source"]
	check["pnpm check<br/>type check"]
	test["pnpm vitest run<br/>unit, browser, storybook"]
	build["pnpm build<br/>tokens, bundle, manifest check"]
	story["Add or update the story"]
	lint["prettier and eslint<br/>on your paths only"]
	pr["Open a PR"]
	gate["No CI<br/>your local checks are the gate"]
	merge["Merge commit on main"]
	rel["Release by hand<br/>record-release, prepack, publish"]

	edit --> check --> test --> build --> story --> lint --> pr --> gate --> merge --> rel
	build -.->|fails| edit
	test -.->|fails| edit
```

Do these steps for each change:

1. Edit the source files.
2. Run `pnpm check`. TypeScript checks the files in `src/` only.
3. Run `pnpm vitest run`. Vitest runs the `unit`, `browser` and `storybook` projects one time,
   and then it stops.
4. Run `pnpm build`. The last step of the build is the manifest check.
5. Add or update the story of the component, and look at it in `pnpm storybook`.
6. Format and lint only the paths that you changed: `prettier --write <paths>`, then
   `eslint <paths>`.
7. Push the branch and open a PR.

`pnpm test` runs the same three projects. In a terminal, Vitest then stays in watch mode after the
first run. Press `q` to stop it. Under CI or an AI agent, Vitest turns watch mode off, and the
command stops after one run.
[17 · Tests](17-tests.md#watch-mode-and-agents) tells more.

> [!CAUTION]
> Revert `src/lib/tokens/tokens.css` before you commit, if you did not change a token JSON file.
> `pnpm build` runs `build-tokens` first, and Terrazzo can rewrite the file with no real change. Use
> `git checkout -- src/lib/tokens/tokens.css`.
> [22 · Cookbook](22-cookbook.md#recipe-11-undo-churn-in-the-generated-tokens) has the recipe.

`pnpm lint` checks the whole repo, so it can fail on old format drift in files that you did not
touch. Do not run `prettier --write .` to fix it. That command changes many unrelated files.
[18 · Build and package](18-build-and-package.md#lint-and-format-scope) explains the scope.

The repo has no CI. No workflow runs on a PR or on a push. Thus "no conflict" on GitHub does not
mean that the tests pass. Run the checks on your machine before you ask for a merge.
[21 · House rules and how work moves](21-house-rules-and-how-work-moves.md#mergeable-and-approved)
explains what "mergeable" means here.

A release goes out by hand. The maintainer runs `pnpm record-release <version>` to write the
ledger. Then `pnpm prepack` runs `check-ledger`, the build and `publint`. The package manager runs
`prepack` again when it packs. After the merge, the maintainer runs `pnpm publish` from `main`.
[19 · Release](19-release.md#release-by-hand) gives the full steps.

> [!IMPORTANT]
> **Open work: #64 — gv-icon glyph tests and the dist gate** (open PR, no conflict with main on
> 2026-10-27)
>
> The PR adds `scripts/check-dist.mjs` to the build. It fails when no `dist/*.js` file reads
> `process.env.NODE_ENV`, because then the development warnings are on or off for every consumer.
> When the PR lands, `pnpm build` has four steps: `pnpm build-tokens`, `vite build`,
> `node scripts/check-dist.mjs` and `pnpm build-manifest`. Then change the step count in this
> chapter and in the system map. <https://github.com/edgarjaymez/grove-lit/pull/64>

> [!IMPORTANT]
> **Open work: #33 — the a11y gate in Storybook** (issue, open: behaviour on main, checks remain)
>
> The test harness and the static Storybook build of #33 are on `main`. The a11y checks in the
> `storybook` project are report-only: `.storybook/preview.ts` sets `a11y.test` to `'todo'`. Thus
> an axe violation does not fail `pnpm test` today. The gate changes to `'error'` after #46 (PR
> #63) and #50 land, and after a decision about the contrast failures in the FocusRing stories.
> When it changes, step 3 above also fails on a11y violations.
> <https://github.com/edgarjaymez/grove-lit/issues/33>

## The work in motion

The open work follows the roadmap in issue #54. The roadmap puts the specs into PR groups and
sorts the groups into five waves. A wave is a set of epics that can go in parallel. Some items must
wait for others, because they change the same file or need the same helper.

The diagram shows the waves and the chains between them. A solid arrow means "must land before".

```mermaid
flowchart LR
	accTitle: The roadmap waves and the chains between the open items
	accDescr: Wave 1 holds the browser test harness #33, the componentReset epic #45 with PR #66, the a11y utilities #39 and the menu item epic #46 with PR #63. Wave 2 holds the slots spec #34, the icon epic #47 with PR #64, the texture epic #48 with PR #65, the button epic #49 with PR #68, and #37, #30 and #29. Wave 3 holds the focus ring #22, the names epic #50 and the text input epic #51. Wave 4 holds the textarea #17 and the surface epic #52 with #44. Wave 5 holds the chip and card epic #53, the journey rail #19 and the docs sweep #57. Outside the waves are #56, #58 and #67. The harness is under every browser test. The slots work #34 comes before #50, #53 and #19. #49 comes before #50, then #51, then #17. #49 also comes before #44. The focus ring #22 comes before #53, #19 and #17. The AT_REST table of #66 comes before #67 and #30.

	subgraph w1["Wave 1"]
		i33["#33 browser harness<br/>on main, gate report-only"]
		i45["#45 componentReset<br/>PR #66"]
		i39["#39 a11y CSS utilities<br/>skip link not built,<br/>Needs Figma Spec"]
		i46["#46 menu item<br/>PR #63"]
	end

	subgraph w2["Wave 2"]
		i34["#34 slots<br/>closed"]
		i47["#47 icon<br/>PR #64"]
		i48["#48 texture<br/>PR #65, held"]
		i49["#49 button link and form<br/>PR #68"]
		i37["#37 feedback strip live<br/>on main, checks remain"]
		i30["#30 colour swatch<br/>not started"]
		i29["#29 toggler cue<br/>Needs Figma Spec"]
	end

	subgraph w3["Wave 3"]
		i22["#22 focus ring<br/>closed"]
		i50["#50 accessible names<br/>branch, no PR"]
		i51["#51 text input field<br/>Needs Figma Spec"]
	end

	subgraph w4["Wave 4"]
		i17["#17 textarea<br/>Needs Figma Spec"]
		i52["#52 surface property"]
		i44["#44 outlined and ghost<br/>Needs Figma Spec"]
	end

	subgraph w5["Wave 5"]
		i53["#53 chip and card<br/>Needs Figma Spec"]
		i19["#19 journey rail<br/>Needs Figma Spec"]
		i57["#57 docs sweep"]
	end

	subgraph out["Outside the waves"]
		i56["#56 render on the server<br/>not started"]
		i58["#58 illustrations palette<br/>not started"]
		i67["#67 motion tokens<br/>not started"]
	end

	i33 -->|"under every<br/>browser test"| i47
	i33 --> i49
	i33 --> i50
	i34 --> i50
	i34 --> i53
	i34 --> i19
	i49 --> i50 --> i51 --> i17
	i49 --> i44
	i44 -.->|"part of"| i52
	i22 --> i53
	i22 --> i19
	i22 --> i17
	i45 -->|"AT_REST table"| i67
	i45 --> i30
```

| Box                           | Chapter                                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| #33 harness and the a11y gate | [17 · Tests](17-tests.md#the-four-test-projects) and [09 · Accessibility](09-accessibility.md#the-a11y-checks-in-storybook) |
| #45 componentReset and PR #66 | [06 · Styles inside a component](06-styles-inside-a-component.md#the-component-reset)                                       |
| #39 skip link                 | [09 · Accessibility](09-accessibility.md#visually-hidden-text-and-skip-links)                                               |
| #46 menu item and PR #63      | [05 · Component catalogue](05-component-catalogue.md#notes-for-each-component)                                              |
| #34 slots                     | [07 · Slots](07-slots.md#the-slotcontent-controller)                                                                        |
| #47 icon and PR #64           | [05 · Component catalogue](05-component-catalogue.md#notes-for-each-component)                                              |
| #48 texture and PR #65        | [06 · Styles inside a component](06-styles-inside-a-component.md#the-currentcolor-fallback)                                 |
| #49 button and PR #68         | [10 · Forms](10-forms.md#the-formcontrol-mixin)                                                                             |
| #37, #30, #29                 | [09 · Accessibility](09-accessibility.md#live-regions) and [08 · Events](08-events.md#document-level-keys)                  |
| #22 focus ring                | [14 · The focus ring](14-the-focus-ring.md#the-mechanism)                                                                   |
| #50 accessible names          | [09 · Accessibility](09-accessibility.md#accessible-names-across-the-shadow-boundary)                                       |
| #51 and #17                   | [10 · Forms](10-forms.md#field-state-and-validity)                                                                          |
| #52 and #44                   | [12 · Surfaces and elevation](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)                                   |
| #53 and #19                   | [05 · Component catalogue](05-component-catalogue.md#proposed-components)                                                   |
| #57 docs sweep                | [16 · Storybook](16-storybook.md#the-landing-page)                                                                          |
| #56 render on the server      | [03 · Lit essentials](03-lit-essentials.md#lit-on-the-server)                                                               |
| #58 and #67                   | [11 · Design tokens](11-design-tokens.md#token-gaps)                                                                        |

Read the chains in this way:

- **#33 is under all browser tests.** It built the `browser` test project and the static
  Storybook build. Every PR with a `*.browser.test.ts` file uses it.
- **#34 comes before #50, #53 and #19.** These items name controls or build cards with slotted
  content, so they need the slots of #34. #34 is closed.
- **#49 comes before #50, then #51, then #17.** #49 (PR #68) adds the `FormControl` mixin. #50
  builds the accessible names on that mixin. #51 builds the text field on both, and #17 copies the
  text field.
- **#49 comes before #44.** Both change `Button.ts`. #44 also waits for its Figma design and for
  its decision 1.
- **#22 comes before #53, #19 and #17.** New components use the focus ring from the start. #22 is
  closed.
- **#66 comes before #67 and #30.** PR #66 adds the `AT_REST` timing table to
  `reduced-motion.browser.test.ts`. #67 changes the timing values, and #30 changes the swatch
  timing. Thus both must update that table.

The second diagram shows the merge train. The merge train is the recommended merge order of the
open PRs.

```mermaid
flowchart LR
	accTitle: The merge train of the open PRs
	accDescr: Merge PR #63 first, then #64, then #66, then #68. PR #68 already contains the commits of #63. PR #65 waits, because it has the Needs Figma Spec label. The guide branch goes last and rebases one time.

	p63["PR #63<br/>menu item"]
	p64["PR #64<br/>icon glyph tests<br/>and dist gate"]
	p66["PR #66<br/>componentReset tests"]
	p68["PR #68<br/>button link and form"]
	p65["PR #65<br/>texture colours<br/>held: Needs Figma Spec"]
	guide["This guide<br/>last, one rebase"]

	p63 --> p64 --> p66 --> p68 --> guide
	p68 -.->|"already contains"| p63
	p65 -.->|"after its questions<br/>have answers"| guide
```

All five PRs had no git conflict with `main` on 2026-10-27. They can still conflict with each
other, because they change some of the same files. For example, #64 and #66 both add
`src/test/shadow.ts`, with the same content. #68 contains the merge of #63. Thus a merge of #68
also lands the commits of #63.

PR #65 has the label "Needs Figma Spec". That label means that the item waits for an answer from
the Figma design.
[21 · House rules and how work moves](21-house-rules-and-how-work-moves.md#merge-order) gives the
order and the reasons.

> [!IMPORTANT]
> **Open work: #54 — the roadmap: PR groups and waves** (issue, open: behaviour on main, checks
> remain)
>
> #54 groups the open specs into 23 PRs in five waves and records five decisions, #54 D1 to #54 D5.
> PR #55 landed much of waves 1 to 4 on `main` and closed 13 specs. The open part is on the board
> above.
>
> There are two traps. First, #54 names a branch for each PR group, but most of those branches were
> never made. Find the work through the PR or the epic link. Second, the release that #54 planned as
> 0.46.0 shipped as 0.45.0 on 2026-10-08. Its list also names the submit change of #40, but #40 did
> not ship. It is in #68, which is now the plan for 0.46.0.
>
> When an item on the board lands, change its box label and its arrows. When #54 closes, delete the
> board or replace it with the next roadmap. <https://github.com/edgarjaymez/grove-lit/issues/54>

> [!IMPORTANT]
> **Open work: #68 — gv-button link mode and form association** (open PR, no conflict with main on
> 2026-10-27)
>
> #68 is the largest open PR and the start of the longest chain. It adds
> `src/lib/utils/form-control.ts`, makes `gv-button` a form-associated custom element and adds a
> link mode with `href`. It closes #14 and #40, and it is part of epic #49. Merge it after #63, #64
> and #66. When it lands, change the label of #49 on the board, and draw #50 as the next item.
> <https://github.com/edgarjaymez/grove-lit/pull/68>

## See it in the code

| File                                  | Look for                                                      |
| ------------------------------------- | ------------------------------------------------------------- |
| `package.json`                        | `scripts.build`, `scripts.prepack`, `files`, `exports`        |
| `vite.config.ts`                      | `build.lib`, the `copy-static-assets` plugin, `test.projects` |
| `terrazzo.config.js`                  | `tokens`, `outDir` and the CSS permutations                   |
| `custom-elements-manifest.config.mjs` | `globs` and the `expandTypesPlugin`                           |
| `src/lib/index.ts`                    | The package entry: every public export                        |
| `src/lib/styles/grove.css`            | The seven `@import` lines                                     |
| `.storybook/preview.ts`               | `a11y.test: 'todo'`                                           |
| `vercel.json`                         | `buildCommand` and `outputDirectory`                          |

## Sources

**Platform reference**

- [MDN, Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM).
  Read 2026-10-27.
- [MDN, Event: composed property](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed).
  Read 2026-10-27.

## Check yourself

Do [Lesson 0 Find your way](syllabus.md#lesson-0-find-your-way) in the syllabus. Without this page,
draw the system map on paper: the five sources, the tools of `pnpm build` and the files in `dist/`.
Then draw the chain from #49 to #17, and say why #44 waits for #49.

[Index](README.md) · [01 · Repo map →](01-repo-map.md)
