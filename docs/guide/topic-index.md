# Topic index

> **What you learn here**
>
> - Where the guide explains each concept, file, command and API.
> - Where each decision code and each WCAG 2.2 success criterion comes up.
> - Which sections have an open-work box for each open PR and issue.
>
> **Read first:** nothing. **Time:** use this page as a reference.
>
> Open work as of main @ e251d45, 2026-10-27.

Each entry links to the `##` sections that explain it. The first link is the main section. The sort
ignores case, backticks and punctuation. An entry that starts with a symbol or a number is in
[Symbols and numbers](#symbols-and-numbers). For the meaning of a term, use
[the glossary](glossary.md).

## Symbols and numbers

### Custom properties and token families

- **`--border-radius-*`, `--border-width-*`** —
  [11 · Design tokens, Border](11-design-tokens.md#border),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue)
- **`--color-*` (primitive colours)** —
  [11 · Design tokens, Primitive and semantic colours](11-design-tokens.md#primitive-and-semantic-colours)
- **`--_drop`** — [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties),
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles)
- **`--drop-shadow-under-*`** — [11 · Design tokens, Effects](11-design-tokens.md#effects)
- **`--grid-*` (layout grid)** —
  [11 · Design tokens, Spacing and grids](11-design-tokens.md#spacing-and-grids)
- **`--gv-focus-ring`** —
  [14 · The focus ring, The resolution order](14-the-focus-ring.md#the-resolution-order),
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map)
- **`--gv-icon-fill-display` and `--gv-icon-regular-display`** —
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles),
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary),
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties)
- **`--gv-isotype-size`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [03 · Lit essentials, Lifecycle hooks](03-lit-essentials.md#lifecycle-hooks),
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties)
- **`--letter-spacing-*`** —
  [11 · Design tokens, Typography composites](11-design-tokens.md#typography-composites)
- **`--_ring-default`** —
  [14 · The focus ring, The private default ring](14-the-focus-ring.md#the-private-default-ring),
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [22 · Cookbook, Recipe 14 Add an interactive surface-aware component](22-cookbook.md#recipe-14-add-an-interactive-surface-aware-component)
- **`--ring-on-*`** — [11 · Design tokens, Effects](11-design-tokens.md#effects),
  [14 · The focus ring, The resolution order](14-the-focus-ring.md#the-resolution-order),
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes)
- **`--semantic-color-*`** —
  [11 · Design tokens, Primitive and semantic colours](11-design-tokens.md#primitive-and-semantic-colours),
  [12 · Surfaces and elevation, Text on a surface](12-surfaces-and-elevation.md#text-on-a-surface),
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles)
- **`--soft-grid-*`** —
  [11 · Design tokens, Spacing and grids](11-design-tokens.md#spacing-and-grids),
  [11 · Design tokens, Effects](11-design-tokens.md#effects),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component)
- **`--typography-*` (composite tokens)** —
  [11 · Design tokens, Typography composites](11-design-tokens.md#typography-composites),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component),
  [13 · Themes and page CSS, Typography and effect classes](13-themes-and-page-css.md#typography-and-effect-classes)

### Selectors and at-rules

- **`[data-theme]`** —
  [13 · Themes and page CSS, Theme islands](13-themes-and-page-css.md#theme-islands),
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **`:defined`** — [02 · Web components, Upgrade](02-web-components.md#upgrade)
- **`:focus-visible`** — [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [17 · Tests, Trusted input](17-tests.md#trusted-input)
- **`.gv-surface-*`** —
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes),
  [14 · The focus ring, The resolution order](14-the-focus-ring.md#the-resolution-order),
  [14 · The focus ring, Rings over aurora](14-the-focus-ring.md#rings-over-aurora)
- **`[hidden]` and `hidden="until-found"`** —
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset),
  [06 · Styles inside a component, The shadow cascade](06-styles-inside-a-component.md#the-shadow-cascade)
- **`:host` and `:host()`** —
  [06 · Styles inside a component, The shadow cascade](06-styles-inside-a-component.md#the-shadow-cascade),
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset),
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary)
- **`:lang()`** — [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts)
- **`@media (color-gamut: p3)`** —
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **`@media (forced-colors: active)`** —
  [09 · Accessibility, Forced colours](09-accessibility.md#forced-colours),
  [14 · The focus ring, Forced colours](14-the-focus-ring.md#forced-colours)
- **`@media (prefers-color-scheme: dark)`** —
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file),
  [20 · Grove in an app, Themes in an app](20-grove-in-an-app.md#themes-in-an-app)
- **`@media (prefers-reduced-motion: reduce)`** —
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset)
- **`@media print`** — [13 · Themes and page CSS, Print](13-themes-and-page-css.md#print),
  [11 · Design tokens, Digital and print](11-design-tokens.md#digital-and-print)
- **`?? nothing`** —
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties),
  [03 · Lit essentials, Directives](03-lit-essentials.md#directives)
- **`.skip-link`** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links)
- **`::slotted()`** —
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary)
- **`:state()`** — [10 · Forms, ElementInternals](10-forms.md#elementinternals)
- **`.visually-hidden`** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [06 · Styles inside a component, The visually hidden fragment](06-styles-inside-a-component.md#the-visually-hidden-fragment),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css)
- **`:where()`** —
  [13 · Themes and page CSS, Why where matters](13-themes-and-page-css.md#why-where-matters),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)

### Decorators and JSDoc tags

- **`@cssprop`** —
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads),
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties)
- **`@customElement`** —
  [03 · Lit essentials, Tag registration and types](03-lit-essentials.md#tag-registration-and-types),
  [04 · Anatomy of a component, Stop 4 Registration and the class](04-anatomy-of-a-component.md#stop-4-registration-and-the-class),
  [02 · Web components, Custom elements](02-web-components.md#custom-elements)
- **`@fires`** —
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads),
  [08 · Events, How events are checked](08-events.md#how-events-are-checked),
  [15 · Metadata and the manifest, When check-manifest fails](15-metadata-and-the-manifest.md#when-check-manifest-fails)
- **`@internal`** —
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads),
  [22 · Cookbook, Recipe 19 Build on the FormControl mixin](22-cookbook.md#recipe-19-build-on-the-formcontrol-mixin)
- **`@property`** —
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes)
- **`@query`** —
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use),
  [10 · Forms, Self-disable](10-forms.md#self-disable)
- **`@slot`** —
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads),
  [07 · Slots, How slots are checked](07-slots.md#how-slots-are-checked),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component)
- **`@state`** — [03 · Lit essentials, Internal state](03-lit-essentials.md#internal-state),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [15 · Metadata and the manifest, When check-manifest fails](15-metadata-and-the-manifest.md#when-check-manifest-fails)

### Packages

- **`@custom-elements-manifest/analyzer`** —
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads)
- **`@edgarjaymez/grove`** — [20 · Grove in an app, Install](20-grove-in-an-app.md#install),
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [20 · Grove in an app, Register the elements](20-grove-in-an-app.md#register-the-elements)
- **`@lit-labs/ssr` and `@edgarjaymez/grove/ssr`** —
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server),
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields)
- **`@lit/react`** —
  [02 · Web components, If you know React or Vue](02-web-components.md#if-you-know-react-or-vue)
- **`@phosphor-icons/webcomponents`** —
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [20 · Grove in an app, Install](20-grove-in-an-app.md#install),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map)

### File patterns

- **`*.browser.test.ts`** —
  [17 · Tests, The four test projects](17-tests.md#the-four-test-projects),
  [17 · Tests, A new browser test](17-tests.md#a-new-browser-test),
  [17 · Tests, The test inventory](17-tests.md#the-test-inventory)
- **`*.contrast.test.ts` and `contrast.test.ts`** —
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [17 · Tests, Tests that keep two copies in step](17-tests.md#tests-that-keep-two-copies-in-step),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code)
- **`.js` import extensions** —
  [04 · Anatomy of a component, Stop 1 Imports](04-anatomy-of-a-component.md#stop-1-imports),
  [05 · Component catalogue, How a composite registers its children](05-component-catalogue.md#how-a-composite-registers-its-children)
- **`*.metadata.ts`** —
  [15 · Metadata and the manifest, Component metadata](15-metadata-and-the-manifest.md#component-metadata),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it),
  [00 · The whiteboard, The five layers](00-the-whiteboard.md#the-five-layers)
- **`*.stories.ts`** — [16 · Storybook, A story file](16-storybook.md#a-story-file),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)

### Decision codes

- **#14 FR-01** —
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves)
- **#14 FR-10** — [10 · Forms, Link mode](10-forms.md#link-mode),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes)
- **#14 FR-11** — [10 · Forms, Link mode](10-forms.md#link-mode)
- **#18 FR-04** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#18 FR-10** — [10 · Forms, The form callbacks](10-forms.md#the-form-callbacks),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#18 FR-12** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#20 FR-01** —
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback)
- **#20 FR-DT1** —
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes),
  [21 · House rules and how work moves, Needs Figma Spec](21-house-rules-and-how-work-moves.md#needs-figma-spec)
- **#21 FR-17** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#21 OD1** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#21 OD3** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#21 OD4** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#21 OD5** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#21 OD6** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#25 OD1** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#25 OD3** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#26 FR-07** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#40 FR-15** — [10 · Forms, Disabled fieldsets](10-forms.md#disabled-fieldsets)
- **#40 FR-22** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission),
  [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime)
- **#40 FR-25** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **#40 FR-28** — [10 · Forms, Self-disable](10-forms.md#self-disable)
- **#40 FR-33** — [10 · Forms, Self-disable](10-forms.md#self-disable)
- **#40 FR-34** — [10 · Forms, Self-disable](10-forms.md#self-disable)
- **#40 OD1** — [10 · Forms, ElementInternals](10-forms.md#elementinternals),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing)
- **#40 OD2** —
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes),
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves)
- **#44 OD1** —
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript)
- **#49 C1** —
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes),
  [10 · Forms, The tree rule](10-forms.md#the-tree-rule)
- **#49 C2** — [10 · Forms, The tree rule](10-forms.md#the-tree-rule)
- **#49 C3** — [10 · Forms, The tree rule](10-forms.md#the-tree-rule)
- **#49 C4** — [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [10 · Forms, The tree rule](10-forms.md#the-tree-rule)
- **#49 C5** —
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin)
- **#49 C6** —
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots),
  [10 · Forms, The tree rule](10-forms.md#the-tree-rule),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code)
- **#49 C7** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **#49 L1** — [10 · Forms, Link mode](10-forms.md#link-mode)
- **#49 L2** — [10 · Forms, Link mode](10-forms.md#link-mode),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes)
- **#49 L3** — [10 · Forms, Link mode](10-forms.md#link-mode)
- **#49 R6** — [10 · Forms, Self-disable](10-forms.md#self-disable)
- **#49 S1** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **#49 S2** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes)
- **#49 S3** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **#50 R2** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [17 · Tests, Names in the accessibility tree](17-tests.md#names-in-the-accessibility-tree),
  [22 · Cookbook, Recipe 7 Add a browser test](22-cookbook.md#recipe-7-add-a-browser-test)
- **#50 R3** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#50 R4** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#50 R5** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **#50 R6** —
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes)
- **#50 R8** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#50 R9** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#51 F1** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#51 F2** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [08 · Events, Events on a form](08-events.md#events-on-a-form)
- **#51 F3** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [10 · Forms, Hidden required fields](10-forms.md#hidden-required-fields),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes)
- **#51 F4** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#51 F5** — [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **#54 D1** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **#54 D2** —
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript),
  [12 · Surfaces and elevation, Aurora is a state](12-surfaces-and-elevation.md#aurora-is-a-state),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora),
  [23 · Known drift, Deliberate and left alone](23-known-drift.md#deliberate-and-left-alone)
- **#54 D3** —
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions)
- **#54 D4** —
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **#54 D5** —
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook),
  [19 · Release, No CI](19-release.md#no-ci),
  [22 · Cookbook, Recipe 17 Make a stories file fail on a11y violations](22-cookbook.md#recipe-17-make-a-stories-file-fail-on-a11y-violations)

### WCAG 2.2 success criteria

- **1.1.1 Non-text Content (A)** —
  [09 · Accessibility, Decorative and meaningful images](09-accessibility.md#decorative-and-meaningful-images),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **1.3.1 Info and Relationships (A)** —
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **1.3.5 Identify Input Purpose (AA)** —
  [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **1.4.1 Use of Color (A)** —
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **1.4.3 Contrast (Minimum) (AA)** —
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [09 · Accessibility, The a11y canary](09-accessibility.md#the-a11y-canary)
- **1.4.4 Resize Text (AA)** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links)
- **1.4.10 Reflow (AA)** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links)
- **1.4.11 Non-text Contrast (AA)** —
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue),
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **1.4.12 Text Spacing (AA)** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links)
- **1.4.13 Content on Hover or Focus (AA)** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **2.3.3 Animation from Interactions (AAA)** —
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **2.4.1 Bypass Blocks (A)** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **2.4.3 Focus Order (A)** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links)
- **2.4.7 Focus Visible (AA)** —
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue)
- **2.4.11 Focus Not Obscured (Minimum) (AA)** —
  [14 · The focus ring, Rings over aurora](14-the-focus-ring.md#rings-over-aurora),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links)
- **2.5.3 Label in Name (A)** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **2.5.8 Target Size (Minimum) (AA)** —
  [09 · Accessibility, Target size](09-accessibility.md#target-size),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [16 · Storybook, The global preview](16-storybook.md#the-global-preview)
- **3.1.2 Language of Parts (AA)** —
  [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **3.3.1 Error Identification (A)** —
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **3.3.2 Labels or Instructions (A)** —
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **4.1.2 Name, Role, Value (A)** —
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **4.1.3 Status Messages (AA)** —
  [09 · Accessibility, Live regions](09-accessibility.md#live-regions),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)

## A

- **a11y canary** — [09 · Accessibility, The a11y canary](09-accessibility.md#the-a11y-canary),
  [17 · Tests, The four test projects](17-tests.md#the-four-test-projects),
  [17 · Tests, Mutation checks](17-tests.md#mutation-checks)
- **a11y check in Storybook** —
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook),
  [16 · Storybook, The global preview](16-storybook.md#the-global-preview),
  [22 · Cookbook, Recipe 17 Make a stories file fail on a11y violations](22-cookbook.md#recipe-17-make-a-stories-file-fail-on-a11y-violations)
- **`A11yCanary` story** —
  [09 · Accessibility, The a11y canary](09-accessibility.md#the-a11y-canary),
  [16 · Storybook, Repo-level pages](16-storybook.md#repo-level-pages)
- **`a11y.css`** —
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css)
- **accessible description** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree),
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection)
- **accessible name** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [17 · Tests, Names in the accessibility tree](17-tests.md#names-in-the-accessibility-tree),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **`accessible-name.ts`** — [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **accessor** —
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties),
  [03 · Lit essentials, The decorator setup](03-lit-essentials.md#the-decorator-setup),
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection)
- **activation behaviour** —
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing)
- **`addController()`** —
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [07 · Slots, Reactive controllers](07-slots.md#reactive-controllers)
- **alias (token)** —
  [11 · Design tokens, From JSON path to CSS name](11-design-tokens.md#from-json-path-to-css-name),
  [04 · Anatomy of a component, Stop 2 Local types](04-anatomy-of-a-component.md#stop-2-local-types)
- **alias (TypeScript type)** —
  [04 · Anatomy of a component, Stop 2 Local types](04-anatomy-of-a-component.md#stop-2-local-types),
  [22 · Cookbook, Recipe 3 Add a property](22-cookbook.md#recipe-3-add-a-property)
- **analyzer** —
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads)
- **APCA** — [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)
- **ARIA element reflection** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code)
- **ARIA properties** — [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties),
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes)
- **`aria-describedby`** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree)
- **`aria-hidden`** —
  [09 · Accessibility, Decorative and meaningful images](09-accessibility.md#decorative-and-meaningful-images),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue)
- **`aria-label`** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties),
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection)
- **`ariaLabel`** —
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties)
- **`aria-live`** — [09 · Accessibility, Live regions](09-accessibility.md#live-regions),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **`ariaSnapshot`** —
  [17 · Tests, Names in the accessibility tree](17-tests.md#names-in-the-accessibility-tree),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [22 · Cookbook, Recipe 7 Add a browser test](22-cookbook.md#recipe-7-add-a-browser-test)
- **`assignedNodes()`** —
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots),
  [02 · Web components, Slots](02-web-components.md#slots),
  [07 · Slots, The whitespace problem](07-slots.md#the-whitespace-problem)
- **Astro** — [20 · Grove in an app, Astro types](20-grove-in-an-app.md#astro-types),
  [15 · Metadata and the manifest, Framework types](15-metadata-and-the-manifest.md#framework-types),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server)
- **`astro.d.ts`** —
  [15 · Metadata and the manifest, Framework types](15-metadata-and-the-manifest.md#framework-types),
  [20 · Grove in an app, Astro types](20-grove-in-an-app.md#astro-types),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **`AT_REST` table** —
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **`attachInternals()`** — [10 · Forms, ElementInternals](10-forms.md#elementinternals),
  [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins)
- **attribute** —
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection),
  [20 · Grove in an app, Attributes and properties](20-grove-in-an-app.md#attributes-and-properties),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes)
- **`attributeChangedCallback()`** — [02 · Web components, Upgrade](02-web-components.md#upgrade)
- **aurora** —
  [12 · Surfaces and elevation, Aurora is a state](12-surfaces-and-elevation.md#aurora-is-a-state),
  [14 · The focus ring, Rings over aurora](14-the-focus-ring.md#rings-over-aurora),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)
- **axe** —
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook),
  [09 · Accessibility, The a11y canary](09-accessibility.md#the-a11y-canary),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **`axNodes` command** —
  [17 · Tests, Names in the accessibility tree](17-tests.md#names-in-the-accessibility-tree),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [22 · Cookbook, Recipe 7 Add a browser test](22-cookbook.md#recipe-7-add-a-browser-test)

## B

- **back-date (ledger)** —
  [19 · Release, Dates from release tags](19-release.md#dates-from-release-tags)
- **barrel** — [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists)
- **binding** —
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it)
- **boolean attribute** —
  [20 · Grove in an app, Boolean attributes](20-grove-in-an-app.md#boolean-attributes),
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection),
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings)
- **breakpoints** — [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers),
  [11 · Design tokens, Spacing and grids](11-design-tokens.md#spacing-and-grids)
- **browser instance** —
  [16 · Storybook, How a test picks a theme](16-storybook.md#how-a-test-picks-a-theme),
  [17 · Tests, The four test projects](17-tests.md#the-four-test-projects)
- **`browser-setup.ts`** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field),
  [22 · Cookbook, Recipe 18 Add a glyph a component draws](22-cookbook.md#recipe-18-add-a-glyph-a-component-draws)
- **browsing context** — [02 · Web components, Upgrade](02-web-components.md#upgrade)
- **`Button.ts`** —
  [04 · Anatomy of a component, Stop 1 Imports](04-anatomy-of-a-component.md#stop-1-imports),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it)

## C

- **cancelable event** —
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing)
- **change detector** — [17 · Tests, Change detectors](17-tests.md#change-detectors)
- **`check-dist.mjs`** —
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change),
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule)
- **`check-ledger`** — [19 · Release, The release ledger](19-release.md#the-release-ledger),
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script),
  [23 · Known drift, Deliberate and left alone](23-known-drift.md#deliberate-and-left-alone)
- **`check-manifest.mjs`** —
  [15 · Metadata and the manifest, When check-manifest fails](15-metadata-and-the-manifest.md#when-check-manifest-fails),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **`checkVisibility()`** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **churn in `tokens.css`** —
  [11 · Design tokens, Churn in the generated file](11-design-tokens.md#churn-in-the-generated-file),
  [22 · Cookbook, Recipe 11 Undo churn in the generated tokens](22-cookbook.md#recipe-11-undo-churn-in-the-generated-tokens)
- **CI (none)** — [19 · Release, No CI](19-release.md#no-ci),
  [21 · House rules and how work moves, Mergeable and approved](21-house-rules-and-how-work-moves.md#mergeable-and-approved),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **`classMap`** — [03 · Lit essentials, Directives](03-lit-essentials.md#directives),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it)
- **`color-mix()`** —
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback)
- **`color-scheme`** —
  [13 · Themes and page CSS, Color scheme and native widgets](13-themes-and-page-css.md#color-scheme-and-native-widgets),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file),
  [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime)
- **colour as the only cue** —
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **`ComponentMetadata`** —
  [15 · Metadata and the manifest, Component metadata](15-metadata-and-the-manifest.md#component-metadata)
- **`componentReset`** —
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset),
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **`components-since.json`** —
  [19 · Release, The release ledger](19-release.md#the-release-ledger),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **composed (event option)** — [08 · Events, The event rules](08-events.md#the-event-rules),
  [08 · Events, Event targets across shadow roots](08-events.md#event-targets-across-shadow-roots),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map)
- **composed path** —
  [08 · Events, Event targets across shadow roots](08-events.md#event-targets-across-shadow-roots),
  [08 · Events, Pattern 2 Forward a child event](08-events.md#pattern-2-forward-a-child-event)
- **composite (component)** —
  [05 · Component catalogue, Leaves and composites](05-component-catalogue.md#leaves-and-composites),
  [05 · Component catalogue, How a composite registers its children](05-component-catalogue.md#how-a-composite-registers-its-children),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component)
- **composite token** —
  [11 · Design tokens, Typography composites](11-design-tokens.md#typography-composites),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component)
- **`connectedCallback()`** —
  [03 · Lit essentials, Lifecycle hooks](03-lit-essentials.md#lifecycle-hooks),
  [02 · Web components, Upgrade](02-web-components.md#upgrade),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **constructable stylesheet** —
  [06 · Styles inside a component, Static styles](06-styles-inside-a-component.md#static-styles)
- **container slot** —
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots)
- **contrast gate** —
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [12 · Surfaces and elevation, Text on a surface](12-surfaces-and-elevation.md#text-on-a-surface),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)
- **controller** —
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [07 · Slots, Reactive controllers](07-slots.md#reactive-controllers),
  [07 · Slots, The SlotContent controller](07-slots.md#the-slotcontent-controller)
- **`css` tag** —
  [06 · Styles inside a component, Static styles](06-styles-inside-a-component.md#static-styles),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css),
  [16 · Storybook, The global preview](16-storybook.md#the-global-preview)
- **`currentColor`** —
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Forced colours](09-accessibility.md#forced-colours)
- **custom element** — [02 · Web components, Custom elements](02-web-components.md#custom-elements),
  [20 · Grove in an app, Forms in an app](20-grove-in-an-app.md#forms-in-an-app),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree)
- **custom elements manifest** —
  [15 · Metadata and the manifest, The custom elements manifest](15-metadata-and-the-manifest.md#the-custom-elements-manifest),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **custom properties** —
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties),
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template)
- **custom state** — [10 · Forms, ElementInternals](10-forms.md#elementinternals)
- **`customElements.define()`** —
  [02 · Web components, Custom elements](02-web-components.md#custom-elements),
  [03 · Lit essentials, Tag registration and types](03-lit-essentials.md#tag-registration-and-types),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins)
- **`CustomEvent`** — [08 · Events, The event rules](08-events.md#the-event-rules),
  [21 · House rules and how work moves, Events](21-house-rules-and-how-work-moves.md#events),
  [08 · Events, Event types](08-events.md#event-types)

## D

- **`data-theme`** —
  [13 · Themes and page CSS, Theme islands](13-themes-and-page-css.md#theme-islands),
  [20 · Grove in an app, Themes in an app](20-grove-in-an-app.md#themes-in-an-app),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **decision codes** —
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **declaration merging** — [08 · Events, Event types](08-events.md#event-types)
- **Declarative Shadow DOM** —
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server)
- **decorative image** —
  [09 · Accessibility, Decorative and meaningful images](09-accessibility.md#decorative-and-meaningful-images),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **decorator** —
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators),
  [03 · Lit essentials, The decorator setup](03-lit-essentials.md#the-decorator-setup),
  [00 · The whiteboard, The five layers](00-the-whiteboard.md#the-five-layers)
- **default button** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **default slot** — [07 · Slots, Prop or slot](07-slots.md#prop-or-slot),
  [02 · Web components, Slots](02-web-components.md#slots),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **delegated listener** — [08 · Events, Events on a form](08-events.md#events-on-a-form)
- **`delegatesFocus`** —
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use),
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **depth** —
  [12 · Surfaces and elevation, Tracks and depths](12-surfaces-and-elevation.md#tracks-and-depths),
  [12 · Surfaces and elevation, The nesting rules](12-surfaces-and-elevation.md#the-nesting-rules),
  [00 · The whiteboard, The five layers](00-the-whiteboard.md#the-five-layers)
- **design token** — [11 · Design tokens, What a token is](11-design-tokens.md#what-a-token-is),
  [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline)
- **`DESIGN_SYSTEM.md`** —
  [11 · Design tokens, The design doc and the generated file](11-design-tokens.md#the-design-doc-and-the-generated-file),
  [23 · Known drift, The rule](23-known-drift.md#the-rule)
- **detached head** —
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally)
- **dev server (Storybook)** —
  [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds)
- **development warnings** —
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule),
  [07 · Slots, What may go in a slot](07-slots.md#what-may-go-in-a-slot),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **`dev.ts`** —
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule)
- **digital and print** —
  [11 · Design tokens, Digital and print](11-design-tokens.md#digital-and-print),
  [13 · Themes and page CSS, Print](13-themes-and-page-css.md#print)
- **directive** — [03 · Lit essentials, Directives](03-lit-essentials.md#directives),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template),
  [04 · Anatomy of a component, Stop 1 Imports](04-anatomy-of-a-component.md#stop-1-imports)
- **disabled fieldset** — [10 · Forms, Disabled fieldsets](10-forms.md#disabled-fieldsets),
  [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements),
  [10 · Forms, Link mode](10-forms.md#link-mode)
- **`disabled` property** —
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes),
  [10 · Forms, Disabled fieldsets](10-forms.md#disabled-fieldsets)
- **`disconnectedCallback()`** —
  [03 · Lit essentials, Lifecycle hooks](03-lit-essentials.md#lifecycle-hooks),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [08 · Events, Document-level keys](08-events.md#document-level-keys)
- **dispatch** — [08 · Events, The event rules](08-events.md#the-event-rules),
  [22 · Cookbook, Recipe 4 Add an event](22-cookbook.md#recipe-4-add-an-event),
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event)
- **`dispatchEvent()`** —
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events),
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event),
  [08 · Events, Pattern 1 Wrap a native input](08-events.md#pattern-1-wrap-a-native-input)
- **`dist/`** — [18 · Build and package, What dist holds](18-build-and-package.md#what-dist-holds),
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build)
- **document-level keys** — [08 · Events, Document-level keys](08-events.md#document-level-keys),
  [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **drift** — [23 · Known drift, The rule](23-known-drift.md#the-rule),
  [23 · Known drift, Where drift comes back](23-known-drift.md#where-drift-comes-back),
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate)
- **DTCG** — [11 · Design tokens, DTCG types](11-design-tokens.md#dtcg-types),
  [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline),
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut)

## E

- **effects tokens** — [11 · Design tokens, Effects](11-design-tokens.md#effects),
  [13 · Themes and page CSS, Typography and effect classes](13-themes-and-page-css.md#typography-and-effect-classes)
- **`ElementInternals`** — [10 · Forms, ElementInternals](10-forms.md#elementinternals)
- **epic** —
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves),
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **ESLint** —
  [18 · Build and package, Lint and format scope](18-build-and-package.md#lint-and-format-scope),
  [22 · Cookbook, Recipe 9 Format and lint only what you touched](22-cookbook.md#recipe-9-format-and-lint-only-what-you-touched)
- **event map** — [08 · Events, Event types](08-events.md#event-types),
  [20 · Grove in an app, Listen to events](20-grove-in-an-app.md#listen-to-events),
  [21 · House rules and how work moves, Events](21-house-rules-and-how-work-moves.md#events)
- **`events.ts`** — [08 · Events, Event types](08-events.md#event-types)
- **`events.types.ts`** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [08 · Events, How events are checked](08-events.md#how-events-are-checked)
- **`exports` field** —
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [20 · Grove in an app, Load the CSS](20-grove-in-an-app.md#load-the-css),
  [19 · Release, The release ledger](19-release.md#the-release-ledger)
- **external (Vite)** —
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build)

## F

- **fallback prop** — [07 · Slots, Prop or slot](07-slots.md#prop-or-slot)
- **Figma** —
  [21 · House rules and how work moves, Needs Figma Spec](21-house-rules-and-how-work-moves.md#needs-figma-spec),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **flaky test** — [17 · Tests, Flaky tests](17-tests.md#flaky-tests),
  [14 · The focus ring, Checks](14-the-focus-ring.md#checks)
- **flat selectors** —
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component),
  [21 · House rules and how work moves, Styles](21-house-rules-and-how-work-moves.md#styles)
- **focus fixup rule** — [10 · Forms, Self-disable](10-forms.md#self-disable),
  [14 · The focus ring, Focus after a control disables itself](14-the-focus-ring.md#focus-after-a-control-disables-itself)
- **focus ring** — [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [14 · The focus ring, The resolution order](14-the-focus-ring.md#the-resolution-order),
  [06 · Styles inside a component, The focus ring fragment](06-styles-inside-a-component.md#the-focus-ring-fragment)
- **`focusRing` fragment** —
  [06 · Styles inside a component, The focus ring fragment](06-styles-inside-a-component.md#the-focus-ring-fragment),
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles)
- **`FocusRing` story** — [14 · The focus ring, Checks](14-the-focus-ring.md#checks),
  [16 · Storybook, Repo-level pages](16-storybook.md#repo-level-pages),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook)
- **`focus-ring.browser.test.ts`** — [14 · The focus ring, Checks](14-the-focus-ring.md#checks),
  [14 · The focus ring, Checklist for a new interactive component](14-the-focus-ring.md#checklist-for-a-new-interactive-component),
  [17 · Tests, Nested shadow roots in tests](17-tests.md#nested-shadow-roots-in-tests)
- **`focus.test.ts`** — [14 · The focus ring, Checks](14-the-focus-ring.md#checks),
  [14 · The focus ring, Checklist for a new interactive component](14-the-focus-ring.md#checklist-for-a-new-interactive-component),
  [21 · House rules and how work moves, Styles](21-house-rules-and-how-work-moves.md#styles)
- **fonts** —
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [20 · Grove in an app, Load the CSS](20-grove-in-an-app.md#load-the-css),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css)
- **forced colours mode** —
  [09 · Accessibility, Forced colours](09-accessibility.md#forced-colours),
  [14 · The focus ring, Forced colours](14-the-focus-ring.md#forced-colours)
- **form callbacks** — [10 · Forms, The form callbacks](10-forms.md#the-form-callbacks),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **form owner** — [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today),
  [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements),
  [20 · Grove in an app, Forms in an app](20-grove-in-an-app.md#forms-in-an-app)
- **form-associated custom element** —
  [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements),
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins)
- **`FormControl` mixin** — [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [22 · Cookbook, Recipe 19 Build on the FormControl mixin](22-cookbook.md#recipe-19-build-on-the-formcontrol-mixin),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins)
- **`form-control.ts`** — [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists)
- **`formRole()`** — [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **forms in an app** —
  [20 · Grove in an app, Forms in an app](20-grove-in-an-app.md#forms-in-an-app)
- **`forms.ts` test helper** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **framework types** —
  [15 · Metadata and the manifest, Framework types](15-metadata-and-the-manifest.md#framework-types),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built)

## G

- **generated AI index** —
  [15 · Metadata and the manifest, The generated AI index](15-metadata-and-the-manifest.md#the-generated-ai-index),
  [22 · Cookbook, Recipe 13 The AI index looks stale](22-cookbook.md#recipe-13-the-ai-index-looks-stale),
  [01 · Repo map, Generated but committed](01-repo-map.md#generated-but-committed)
- **generated files** —
  [01 · Repo map, Generated but committed](01-repo-map.md#generated-but-committed),
  [21 · House rules and how work moves, Generated files](21-house-rules-and-how-work-moves.md#generated-files)
- **generic element** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree),
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection)
- **`gh` CLI** —
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally)
- **git worktree** —
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally)
- **`globals.css`** —
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css),
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring),
  [13 · Themes and page CSS, Theme islands](13-themes-and-page-css.md#theme-islands)
- **glyph** — [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field),
  [22 · Cookbook, Recipe 18 Add a glyph a component draws](22-cookbook.md#recipe-18-add-a-glyph-a-component-draws)
- **glyph warning** —
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [22 · Cookbook, Recipe 18 Add a glyph a component draws](22-cookbook.md#recipe-18-add-a-glyph-a-component-draws),
  [15 · Metadata and the manifest, When check-manifest fails](15-metadata-and-the-manifest.md#when-check-manifest-fails)
- **`grove.css`** —
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css),
  [20 · Grove in an app, Load the CSS](20-grove-in-an-app.md#load-the-css),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map)
- **`GroveEventMap`** — [08 · Events, Event types](08-events.md#event-types)
- **`GroveSurface` and `GroveTrack`** —
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript),
  [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [22 · Cookbook, Recipe 14 Add an interactive surface-aware component](22-cookbook.md#recipe-14-add-an-interactive-surface-aware-component)
- **`GROVE_SURFACES`** —
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript),
  [22 · Cookbook, Recipe 14 Add an interactive surface-aware component](22-cookbook.md#recipe-14-add-an-interactive-surface-aware-component)
- **`groveTags`** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists),
  [21 · House rules and how work moves, Exports](21-house-rules-and-how-work-moves.md#exports)
- **`gv-*` prefix** —
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names),
  [15 · Metadata and the manifest, When check-manifest fails](15-metadata-and-the-manifest.md#when-check-manifest-fails),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map)
- **`gv-back` event** —
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event),
  [20 · Grove in an app, Listen to events](20-grove-in-an-app.md#listen-to-events),
  [08 · Events, The event rules](08-events.md#the-event-rules)
- **`gv-back-button`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **`gv-badge` (the example in Recipe 2)** —
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component)
- **`gv-button`** —
  [04 · Anatomy of a component, Stop 4 Registration and the class](04-anatomy-of-a-component.md#stop-4-registration-and-the-class),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today)
- **`gv-card` (proposed)** —
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)
- **`gv-change` and `gv-input`** —
  [08 · Events, Pattern 1 Wrap a native input](08-events.md#pattern-1-wrap-a-native-input),
  [08 · Events, Events on a form](08-events.md#events-on-a-form),
  [08 · Events, Pattern 2 Forward a child event](08-events.md#pattern-2-forward-a-child-event)
- **`gv-checkbox`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots)
- **`gv-color-swatch`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [08 · Events, Document-level keys](08-events.md#document-level-keys),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **`gv-copy` event** — [08 · Events, Event types](08-events.md#event-types)
- **`gv-feedback-strip`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Live regions](09-accessibility.md#live-regions),
  [07 · Slots, Prop or slot](07-slots.md#prop-or-slot)
- **`gv-focusable` class** —
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [06 · Styles inside a component, The focus ring fragment](06-styles-inside-a-component.md#the-focus-ring-fragment),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method)
- **`gv-icon`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Decorative and meaningful images](09-accessibility.md#decorative-and-meaningful-images),
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs)
- **`gv-icon-button`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties)
- **`gv-isotype`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **`gv-journey-rail` (proposed)** —
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components)
- **`gv-menu-item`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Target size](09-accessibility.md#target-size),
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots)
- **`gv-status-chip` (proposed)** —
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [05 · Component catalogue, The catalogue table](05-component-catalogue.md#the-catalogue-table)
- **`gv-textarea` (proposed)** —
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [13 · Themes and page CSS, Color scheme and native widgets](13-themes-and-page-css.md#color-scheme-and-native-widgets)
- **`gv-text-input`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [08 · Events, Pattern 1 Wrap a native input](08-events.md#pattern-1-wrap-a-native-input),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity)
- **`gv-texture`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template)
- **`gv-title`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript),
  [05 · Component catalogue, The catalogue table](05-component-catalogue.md#the-catalogue-table)
- **`gv-todo-category-toggler`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **`gv-todo-list-item`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [08 · Events, Pattern 2 Forward a child event](08-events.md#pattern-2-forward-a-child-event),
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots)
- **`gv-toggle` event** —
  [05 · Component catalogue, The catalogue table](05-component-catalogue.md#the-catalogue-table)
- **`gv-tooltip`** —
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [07 · Slots, Prop or slot](07-slots.md#prop-or-slot),
  [05 · Component catalogue, The catalogue table](05-component-catalogue.md#the-catalogue-table)

## H

- **`has()`** — [07 · Slots, The SlotContent controller](07-slots.md#the-slotcontent-controller),
  [07 · Slots, Text in a slot](07-slots.md#text-in-a-slot),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method)
- **`hasChanged`** —
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties)
- **`heading` and `message`** —
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [07 · Slots, Prop or slot](07-slots.md#prop-or-slot)
- **`Home.mdx`** — [16 · Storybook, The landing page](16-storybook.md#the-landing-page),
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field)
- **`honoursFormDisabled()`** —
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin)
- **host** — [02 · Web components, Shadow DOM](02-web-components.md#shadow-dom),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing)
- **`hostConnected()` and other controller hooks** —
  [07 · Slots, Reactive controllers](07-slots.md#reactive-controllers),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server)
- **`host-hidden.browser.test.ts`** —
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [02 · Web components, Upgrade](02-web-components.md#upgrade),
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset)
- **house rules** —
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it),
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally)
- **`href`** — [10 · Forms, Link mode](10-forms.md#link-mode),
  [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method)
- **`hreflang`** — [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts),
  [10 · Forms, Link mode](10-forms.md#link-mode)
- **`html` tag** —
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings),
  [16 · Storybook, A story file](16-storybook.md#a-story-file),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method)
- **`HTMLElementTagNameMap`** —
  [04 · Anatomy of a component, Stop 8 The tag map](04-anatomy-of-a-component.md#stop-8-the-tag-map),
  [03 · Lit essentials, Tag registration and types](03-lit-essentials.md#tag-registration-and-types)
- **hydration** —
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server),
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)

## I

- **ID references** —
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots)
- **`ifDefined`** — [03 · Lit essentials, Directives](03-lit-essentials.md#directives),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [10 · Forms, Link mode](10-forms.md#link-mode)
- **IME composition** — [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime),
  [10 · Forms, Implicit submission](10-forms.md#implicit-submission)
- **implicit submission** — [10 · Forms, Implicit submission](10-forms.md#implicit-submission),
  [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime)
- **`index.ts` (two export lists)** —
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists),
  [21 · House rules and how work moves, Exports](21-house-rules-and-how-work-moves.md#exports),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it)
- **install** — [20 · Grove in an app, Install](20-grove-in-an-app.md#install),
  [22 · Cookbook, Recipe 1 Set up and run](22-cookbook.md#recipe-1-set-up-and-run)
- **internal state** — [03 · Lit essentials, Internal state](03-lit-essentials.md#internal-state),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators)
- **invalid at computed-value time** —
  [06 · Styles inside a component, Invalid at computed-value time](06-styles-inside-a-component.md#invalid-at-computed-value-time),
  [13 · Themes and page CSS, Without the page CSS](13-themes-and-page-css.md#without-the-page-css)
- **`isAurora`** —
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript)
- **issue template** — [01 · Repo map, The issue template](01-repo-map.md#the-issue-template)
- **`isTrusted`** —
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events),
  [17 · Tests, Trusted input](17-tests.md#trusted-input),
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task)

## J

- **JSDoc tags** —
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads),
  [04 · Anatomy of a component, Stop 3 The JSDoc block](04-anatomy-of-a-component.md#stop-3-the-jsdoc-block),
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties)

## L

- **labelable element** —
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree)
- **`lang` attribute** —
  [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **layers of the repo** —
  [00 · The whiteboard, The five layers](00-the-whiteboard.md#the-five-layers)
- **leaf (component)** —
  [05 · Component catalogue, Leaves and composites](05-component-catalogue.md#leaves-and-composites)
- **ledger** — [19 · Release, The release ledger](19-release.md#the-release-ledger),
  [19 · Release, Dates from release tags](19-release.md#dates-from-release-tags),
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script)
- **library mode (Vite)** —
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule)
- **lifecycle hooks** —
  [03 · Lit essentials, Lifecycle hooks](03-lit-essentials.md#lifecycle-hooks),
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **light DOM** — [02 · Web components, Slots](02-web-components.md#slots),
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots),
  [02 · Web components, Upgrade](02-web-components.md#upgrade)
- **`light-dark()`** —
  [13 · Themes and page CSS, The light-dark function](13-themes-and-page-css.md#the-light-dark-function),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template)
- **link mode** — [10 · Forms, Link mode](10-forms.md#link-mode),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **`link-attributes.ts`** —
  [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [10 · Forms, Link mode](10-forms.md#link-mode)
- **lint** —
  [18 · Build and package, Lint and format scope](18-build-and-package.md#lint-and-format-scope),
  [22 · Cookbook, Recipe 9 Format and lint only what you touched](22-cookbook.md#recipe-9-format-and-lint-only-what-you-touched),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **Lit** —
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators)
- **Lit features that Grove does not use** —
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use)
- **Lit SSR** — [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **`LitElement`** —
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin)
- **literal (raw value)** —
  [11 · Design tokens, Literals and tokens](11-design-tokens.md#literals-and-tokens),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template)
- **live region** — [09 · Accessibility, Live regions](09-accessibility.md#live-regions),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)

## M

- **`main.resolver.json`** — [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline),
  [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers)
- **manifest** —
  [15 · Metadata and the manifest, The custom elements manifest](15-metadata-and-the-manifest.md#the-custom-elements-manifest),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [15 · Metadata and the manifest, When check-manifest fails](15-metadata-and-the-manifest.md#when-check-manifest-fails)
- **merge order** —
  [21 · House rules and how work moves, Merge order](21-house-rules-and-how-work-moves.md#merge-order),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **mergeable** —
  [21 · House rules and how work moves, Mergeable and approved](21-house-rules-and-how-work-moves.md#mergeable-and-approved),
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **Mermaid** — [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map)
- **metadata** —
  [15 · Metadata and the manifest, Component metadata](15-metadata-and-the-manifest.md#component-metadata),
  [15 · Metadata and the manifest, Metadata tests](15-metadata-and-the-manifest.md#metadata-tests),
  [15 · Metadata and the manifest, Metadata versions](15-metadata-and-the-manifest.md#metadata-versions)
- **`metadataByTag`** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers)
- **`metadata.test.ts`** —
  [15 · Metadata and the manifest, Metadata tests](15-metadata-and-the-manifest.md#metadata-tests),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component),
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field)
- **microtask** —
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle)
- **mixin** —
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [22 · Cookbook, Recipe 19 Build on the FormControl mixin](22-cookbook.md#recipe-19-build-on-the-formcontrol-mixin)
- **modifier (token resolver)** —
  [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers),
  [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline)
- **motion tokens** — [11 · Design tokens, DTCG types](11-design-tokens.md#dtcg-types),
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset),
  [17 · Tests, Change detectors](17-tests.md#change-detectors)
- **mutation check** — [17 · Tests, Mutation checks](17-tests.md#mutation-checks)

## N

- **named slot** — [02 · Web components, Slots](02-web-components.md#slots),
  [07 · Slots, The SlotContent controller](07-slots.md#the-slotcontent-controller)
- **nested shadow roots** —
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots),
  [17 · Tests, Nested shadow roots in tests](17-tests.md#nested-shadow-roots-in-tests),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree)
- **nesting rules (surfaces)** —
  [12 · Surfaces and elevation, The nesting rules](12-surfaces-and-elevation.md#the-nesting-rules)
- **net diff** —
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally)
- **`nextTask()`** —
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task)
- **`NODE_ENV`** —
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule),
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds)
- **`nothing`** —
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties)

## O

- **OKLCH** — [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut),
  [23 · Known drift, Deliberate and left alone](23-known-drift.md#deliberate-and-left-alone)
- **`onFormReset()`** — [10 · Forms, The form callbacks](10-forms.md#the-form-callbacks)
- **open work** —
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion),
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves)
- **order of trust** — [23 · Known drift, The rule](23-known-drift.md#the-rule)
- **OS dark** —
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file),
  [16 · Storybook, How a test picks a theme](16-storybook.md#how-a-test-picks-a-theme),
  [13 · Themes and page CSS, Why where matters](13-themes-and-page-css.md#why-where-matters)
- **`outline: none` (banned)** — [14 · The focus ring, Checks](14-the-focus-ring.md#checks),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component),
  [14 · The focus ring, Forced colours](14-the-focus-ring.md#forced-colours)

## P

- **package entry** — [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists)
- **`package.json`** —
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [01 · Repo map, The package and the tools](01-repo-map.md#the-package-and-the-tools),
  [19 · Release, Release by hand](19-release.md#release-by-hand)
- **page-level CSS** —
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css),
  [13 · Themes and page CSS, Without the page CSS](13-themes-and-page-css.md#without-the-page-css),
  [20 · Grove in an app, Load the CSS](20-grove-in-an-app.md#load-the-css)
- **painted box** —
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component)
- **parity test** —
  [17 · Tests, Tests that keep two copies in step](17-tests.md#tests-that-keep-two-copies-in-step)
- **peer dependency** — [20 · Grove in an app, Install](20-grove-in-an-app.md#install),
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields)
- **permutation (tokens)** —
  [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **Phosphor glyphs** —
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [22 · Cookbook, Recipe 18 Add a glyph a component draws](22-cookbook.md#recipe-18-add-a-glyph-a-component-draws),
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field)
- **`phosphor` metadata field** —
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component),
  [22 · Cookbook, Recipe 18 Add a glyph a component draws](22-cookbook.md#recipe-18-add-a-glyph-a-component-draws)
- **phrasing content** —
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots),
  [07 · Slots, What may go in a slot](07-slots.md#what-may-go-in-a-slot)
- **phrasing-only slot** —
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots),
  [07 · Slots, What may go in a slot](07-slots.md#what-may-go-in-a-slot),
  [10 · Forms, The tree rule](10-forms.md#the-tree-rule)
- **Playwright** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [17 · Tests, Trusted input](17-tests.md#trusted-input),
  [17 · Tests, Names in the accessibility tree](17-tests.md#names-in-the-accessibility-tree)
- **`pnpm build`** —
  [18 · Build and package, The build steps](18-build-and-package.md#the-build-steps),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component)
- **`pnpm build-manifest`** —
  [22 · Cookbook, Recipe 12 Regenerate the manifest only](22-cookbook.md#recipe-12-regenerate-the-manifest-only),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [18 · Build and package, The build steps](18-build-and-package.md#the-build-steps)
- **`pnpm build-storybook`** —
  [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds)
- **`pnpm build-tokens`** — [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline),
  [22 · Cookbook, Recipe 5 Add or change a token](22-cookbook.md#recipe-5-add-or-change-a-token),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **`pnpm check`** —
  [18 · Build and package, Type check scope](18-build-and-package.md#type-check-scope),
  [17 · Tests, Commands](17-tests.md#commands),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **`pnpm check-ledger`** — [19 · Release, The release ledger](19-release.md#the-release-ledger),
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script),
  [23 · Known drift, Deliberate and left alone](23-known-drift.md#deliberate-and-left-alone)
- **`pnpm format`** —
  [22 · Cookbook, Recipe 9 Format and lint only what you touched](22-cookbook.md#recipe-9-format-and-lint-only-what-you-touched),
  [18 · Build and package, Lint and format scope](18-build-and-package.md#lint-and-format-scope)
- **`pnpm lint`** —
  [18 · Build and package, Lint and format scope](18-build-and-package.md#lint-and-format-scope),
  [22 · Cookbook, Recipe 9 Format and lint only what you touched](22-cookbook.md#recipe-9-format-and-lint-only-what-you-touched),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook)
- **`pnpm prepack`** —
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script),
  [19 · Release, Release by hand](19-release.md#release-by-hand),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **`pnpm publish`** — [19 · Release, Release by hand](19-release.md#release-by-hand),
  [22 · Cookbook, Recipe 10 Release by hand](22-cookbook.md#recipe-10-release-by-hand)
- **`pnpm record-release`** — [19 · Release, The release ledger](19-release.md#the-release-ledger),
  [19 · Release, Dates from release tags](19-release.md#dates-from-release-tags),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **`pnpm storybook`** —
  [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds)
- **`pnpm test`** — [17 · Tests, Commands](17-tests.md#commands),
  [22 · Cookbook, Recipe 8 Run tests selectively](22-cookbook.md#recipe-8-run-tests-selectively),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **`pnpm test:a11y-canary`** —
  [09 · Accessibility, The a11y canary](09-accessibility.md#the-a11y-canary),
  [17 · Tests, Commands](17-tests.md#commands),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook)
- **`pnpm test:storybook-static`** —
  [16 · Storybook, The static smoke test](16-storybook.md#the-static-smoke-test)
- **`pnpm test:unit`** — [17 · Tests, Watch mode and agents](17-tests.md#watch-mode-and-agents),
  [17 · Tests, Commands](17-tests.md#commands),
  [22 · Cookbook, Recipe 8 Run tests selectively](22-cookbook.md#recipe-8-run-tests-selectively)
- **`pnpm vitest run`** —
  [22 · Cookbook, Recipe 8 Run tests selectively](22-cookbook.md#recipe-8-run-tests-selectively),
  [17 · Tests, Commands](17-tests.md#commands),
  [14 · The focus ring, Checklist for a new interactive component](14-the-focus-ring.md#checklist-for-a-new-interactive-component)
- **PR group** —
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves),
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **practice branch** —
  [22 · Cookbook, Recipe 15 Review and land an open PR locally](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally),
  [17 · Tests, Mutation checks](17-tests.md#mutation-checks)
- **Prettier** —
  [18 · Build and package, Lint and format scope](18-build-and-package.md#lint-and-format-scope),
  [22 · Cookbook, Recipe 9 Format and lint only what you touched](22-cookbook.md#recipe-9-format-and-lint-only-what-you-touched),
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves)
- **`preventDefault()`** —
  [08 · Events, Pattern 3 A cancelable event](08-events.md#pattern-3-a-cancelable-event),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task)
- **`preview.ts` (Storybook)** —
  [16 · Storybook, The global preview](16-storybook.md#the-global-preview),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook),
  [22 · Cookbook, Recipe 17 Make a stories file fail on a11y violations](22-cookbook.md#recipe-17-make-a-stories-file-fail-on-a11y-violations)
- **primitive token** —
  [11 · Design tokens, Primitive and semantic colours](11-design-tokens.md#primitive-and-semantic-colours),
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut),
  [11 · Design tokens, From JSON path to CSS name](11-design-tokens.md#from-json-path-to-css-name)
- **private custom property** —
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties),
  [14 · The focus ring, The mechanism](14-the-focus-ring.md#the-mechanism),
  [21 · House rules and how work moves, Styles](21-house-rules-and-how-work-moves.md#styles)
- **`process.env.NODE_ENV`** —
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule),
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs)
- **prop or slot** — [07 · Slots, Prop or slot](07-slots.md#prop-or-slot)
- **properties and attributes** —
  [20 · Grove in an app, Attributes and properties](20-grove-in-an-app.md#attributes-and-properties),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes),
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection)
- **proportions (surfaces)** —
  [12 · Surfaces and elevation, Proportions](12-surfaces-and-elevation.md#proportions)
- **public custom property** —
  [06 · Styles inside a component, Private and public custom properties](06-styles-inside-a-component.md#private-and-public-custom-properties),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary)
- **publint** —
  [18 · Build and package, The prepack script](18-build-and-package.md#the-prepack-script)

## R

- **reactive controller** — [07 · Slots, Reactive controllers](07-slots.md#reactive-controllers),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins)
- **reactive property** —
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties),
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection),
  [03 · Lit essentials, LitElement and the decorators](03-lit-essentials.md#litelement-and-the-decorators)
- **`reduced-motion.browser.test.ts`** —
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [11 · Design tokens, DTCG types](11-design-tokens.md#dtcg-types)
- **Reference Target (proposal)** —
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **`reflect`** —
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **registration (of a tag)** —
  [03 · Lit essentials, Tag registration and types](03-lit-essentials.md#tag-registration-and-types),
  [20 · Grove in an app, Register the elements](20-grove-in-an-app.md#register-the-elements),
  [05 · Component catalogue, How a composite registers its children](05-component-catalogue.md#how-a-composite-registers-its-children)
- **release by hand** — [19 · Release, Release by hand](19-release.md#release-by-hand),
  [22 · Cookbook, Recipe 10 Release by hand](22-cookbook.md#recipe-10-release-by-hand),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **release notes** — [19 · Release, Release notes](19-release.md#release-notes)
- **release train** — [19 · Release, The release train](19-release.md#the-release-train)
- **`render()`** —
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings)
- **render** —
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings),
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle)
- **render on a server** —
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server),
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **`requestSubmit()`** —
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [10 · Forms, Implicit submission](10-forms.md#implicit-submission),
  [10 · Forms, Self-disable](10-forms.md#self-disable)
- **`requestUpdate()`** —
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle),
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties)
- **required props (metadata)** —
  [15 · Metadata and the manifest, Required props](15-metadata-and-the-manifest.md#required-props)
- **reset (form)** — [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [10 · Forms, The form callbacks](10-forms.md#the-form-callbacks),
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today)
- **resting surface** —
  [12 · Surfaces and elevation, Aurora is a state](12-surfaces-and-elevation.md#aurora-is-a-state),
  [14 · The focus ring, Rings over aurora](14-the-focus-ring.md#rings-over-aurora),
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript)
- **retarget** —
  [08 · Events, Event targets across shadow roots](08-events.md#event-targets-across-shadow-roots)
- **ring reset** —
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring),
  [13 · Themes and page CSS, Theme islands](13-themes-and-page-css.md#theme-islands)
- **roadmap (#54)** —
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)

## S

- **`scripts/`** —
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [19 · Release, The release ledger](19-release.md#the-release-ledger),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change)
- **self-disable** — [10 · Forms, Self-disable](10-forms.md#self-disable),
  [14 · The focus ring, Focus after a control disables itself](14-the-focus-ring.md#focus-after-a-control-disables-itself),
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today)
- **semantic token** —
  [11 · Design tokens, Primitive and semantic colours](11-design-tokens.md#primitive-and-semantic-colours),
  [11 · Design tokens, From JSON path to CSS name](11-design-tokens.md#from-json-path-to-css-name),
  [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps)
- **`setFormValue()`** — [10 · Forms, ElementInternals](10-forms.md#elementinternals),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing)
- **`setValidity()`** —
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [10 · Forms, ElementInternals](10-forms.md#elementinternals)
- **shadow boundary** —
  [06 · Styles inside a component, What crosses the shadow boundary](06-styles-inside-a-component.md#what-crosses-the-shadow-boundary),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree)
- **shadow cascade** —
  [06 · Styles inside a component, The shadow cascade](06-styles-inside-a-component.md#the-shadow-cascade),
  [13 · Themes and page CSS, Why where matters](13-themes-and-page-css.md#why-where-matters),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **shadow DOM** — [02 · Web components, Shadow DOM](02-web-components.md#shadow-dom),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **shadow root** — [02 · Web components, Shadow DOM](02-web-components.md#shadow-dom),
  [14 · The focus ring, Inheritance across shadow roots](14-the-focus-ring.md#inheritance-across-shadow-roots),
  [17 · Tests, Nested shadow roots in tests](17-tests.md#nested-shadow-roots-in-tests)
- **`shadow.ts` test helper** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [17 · Tests, Nested shadow roots in tests](17-tests.md#nested-shadow-roots-in-tests),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **side-effect import** —
  [05 · Component catalogue, How a composite registers its children](05-component-catalogue.md#how-a-composite-registers-its-children),
  [20 · Grove in an app, Register the elements](20-grove-in-an-app.md#register-the-elements),
  [16 · Storybook, Story registration and side effects](16-storybook.md#story-registration-and-side-effects)
- **`sideEffects` field** —
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [16 · Storybook, Story registration and side effects](16-storybook.md#story-registration-and-side-effects),
  [20 · Grove in an app, Register the elements](20-grove-in-an-app.md#register-the-elements)
- **skip link** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion)
- **slot** — [02 · Web components, Slots](02-web-components.md#slots),
  [07 · Slots, The whitespace problem](07-slots.md#the-whitespace-problem)
- **`SlotContent`** —
  [07 · Slots, The SlotContent controller](07-slots.md#the-slotcontent-controller),
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins)
- **`slot-content.ts`** —
  [07 · Slots, The SlotContent controller](07-slots.md#the-slotcontent-controller)
- **`slots.browser.test.ts`** —
  [07 · Slots, How slots are checked](07-slots.md#how-slots-are-checked)
- **smoke test (static Storybook)** —
  [16 · Storybook, The static smoke test](16-storybook.md#the-static-smoke-test)
- **soft grid** — [11 · Design tokens, Spacing and grids](11-design-tokens.md#spacing-and-grids),
  [11 · Design tokens, Effects](11-design-tokens.md#effects),
  [11 · Design tokens, Border](11-design-tokens.md#border)
- **spec (issue)** —
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves),
  [21 · House rules and how work moves, Decision codes](21-house-rules-and-how-work-moves.md#decision-codes)
- **`src/lib/index.ts`** —
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists),
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it)
- **`src/test/`** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **SSR** — [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server)
- **static build (Storybook)** —
  [16 · Storybook, Dev and static builds](16-storybook.md#dev-and-static-builds),
  [16 · Storybook, Deploy](16-storybook.md#deploy),
  [16 · Storybook, The static smoke test](16-storybook.md#the-static-smoke-test)
- **static expression** — [03 · Lit essentials, Directives](03-lit-essentials.md#directives),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **`static formAssociated`** —
  [10 · Forms, Form-associated custom elements](10-forms.md#form-associated-custom-elements),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use)
- **`static styles`** —
  [06 · Styles inside a component, Static styles](06-styles-inside-a-component.md#static-styles),
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template)
- **`stopPropagation()`** —
  [08 · Events, Pattern 2 Forward a child event](08-events.md#pattern-2-forward-a-child-event),
  [08 · Events, Pattern 1 Wrap a native input](08-events.md#pattern-1-wrap-a-native-input),
  [08 · Events, Document-level keys](08-events.md#document-level-keys)
- **story** — [16 · Storybook, A story file](16-storybook.md#a-story-file),
  [22 · Cookbook, Recipe 6 Add a story](22-cookbook.md#recipe-6-add-a-story)
- **Storybook** — [16 · Storybook, A story file](16-storybook.md#a-story-file),
  [16 · Storybook, The global preview](16-storybook.md#the-global-preview),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook)
- **`styleMap`** — [03 · Lit essentials, Directives](03-lit-essentials.md#directives),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **submit (form)** — [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today),
  [20 · Grove in an app, Forms in an app](20-grove-in-an-app.md#forms-in-an-app)
- **surface** —
  [12 · Surfaces and elevation, Tracks and depths](12-surfaces-and-elevation.md#tracks-and-depths),
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes)
- **surface class** —
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map),
  [20 · Grove in an app, Load the CSS](20-grove-in-an-app.md#load-the-css)
- **`surfaces.css`** —
  [12 · Surfaces and elevation, Surface classes](12-surfaces-and-elevation.md#surface-classes),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css)
- **`surfaces.ts`** —
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript)

## T

- **tag** — [02 · Web components, Custom elements](02-web-components.md#custom-elements),
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names)
- **tag map** —
  [04 · Anatomy of a component, Stop 8 The tag map](04-anatomy-of-a-component.md#stop-8-the-tag-map),
  [03 · Lit essentials, Tag registration and types](03-lit-essentials.md#tag-registration-and-types)
- **target size** — [09 · Accessibility, Target size](09-accessibility.md#target-size),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa)
- **task (event loop)** —
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task),
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **template** —
  [03 · Lit essentials, Templates and bindings](03-lit-essentials.md#templates-and-bindings),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **Terrazzo** — [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline),
  [11 · Design tokens, Three modifiers](11-design-tokens.md#three-modifiers),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **`terrazzo.config.js`** — [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **test helpers** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists)
- **test inventory** — [17 · Tests, The test inventory](17-tests.md#the-test-inventory)
- **test project** — [17 · Tests, The four test projects](17-tests.md#the-four-test-projects),
  [16 · Storybook, How a test picks a theme](16-storybook.md#how-a-test-picks-a-theme),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **text on a surface** —
  [12 · Surfaces and elevation, Text on a surface](12-surfaces-and-elevation.md#text-on-a-surface),
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)
- **`text` property** — [07 · Slots, Prop or slot](07-slots.md#prop-or-slot),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary)
- **theme** —
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file),
  [20 · Grove in an app, Themes in an app](20-grove-in-an-app.md#themes-in-an-app),
  [16 · Storybook, How a test picks a theme](16-storybook.md#how-a-test-picks-a-theme)
- **theme island** —
  [13 · Themes and page CSS, Theme islands](13-themes-and-page-css.md#theme-islands),
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring)
- **`title` (banned property name)** —
  [21 · House rules and how work moves, Names](21-house-rules-and-how-work-moves.md#names),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **token folders** — [11 · Design tokens, The folders](11-design-tokens.md#the-folders),
  [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline)
- **token gap** — [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps)
- **`tokens.css`** — [11 · Design tokens, The pipeline](11-design-tokens.md#the-pipeline),
  [11 · Design tokens, Churn in the generated file](11-design-tokens.md#churn-in-the-generated-file),
  [11 · Design tokens, The design doc and the generated file](11-design-tokens.md#the-design-doc-and-the-generated-file)
- **TOON** — [01 · Repo map, Generated but committed](01-repo-map.md#generated-but-committed)
- **track** —
  [12 · Surfaces and elevation, Tracks and depths](12-surfaces-and-elevation.md#tracks-and-depths),
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript),
  [12 · Surfaces and elevation, The nesting rules](12-surfaces-and-elevation.md#the-nesting-rules)
- **tree rule (forms)** — [10 · Forms, The tree rule](10-forms.md#the-tree-rule)
- **trusted input** — [17 · Tests, Trusted input](17-tests.md#trusted-input),
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events)
- **`tsconfig.json`** —
  [03 · Lit essentials, The decorator setup](03-lit-essentials.md#the-decorator-setup),
  [18 · Build and package, Type check scope](18-build-and-package.md#type-check-scope),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **type check** —
  [18 · Build and package, Type check scope](18-build-and-package.md#type-check-scope),
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component)
- **type fixture** — [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [08 · Events, How events are checked](08-events.md#how-events-are-checked),
  [17 · Tests, Commands](17-tests.md#commands)
- **typography composites** —
  [11 · Design tokens, Typography composites](11-design-tokens.md#typography-composites),
  [13 · Themes and page CSS, Typography and effect classes](13-themes-and-page-css.md#typography-and-effect-classes),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component)
- **`typography.css`** —
  [13 · Themes and page CSS, Typography and effect classes](13-themes-and-page-css.md#typography-and-effect-classes),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css)

## U

- **`unplugin-dts`** —
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [18 · Build and package, What dist holds](18-build-and-package.md#what-dist-holds)
- **`unsafeCSS`** —
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles)
- **`unsafeStatic`** — [03 · Lit essentials, Directives](03-lit-essentials.md#directives),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **untrusted event** —
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events),
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task),
  [17 · Tests, Trusted input](17-tests.md#trusted-input)
- **update cycle** — [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle)
- **`updateComplete`** —
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle),
  [17 · Tests, A new browser test](17-tests.md#a-new-browser-test),
  [08 · Events, The event rules](08-events.md#the-event-rules)
- **`updated()`** — [03 · Lit essentials, Lifecycle hooks](03-lit-essentials.md#lifecycle-hooks),
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component)
- **upgrade** — [02 · Web components, Upgrade](02-web-components.md#upgrade),
  [00 · The whiteboard, The runtime map](00-the-whiteboard.md#the-runtime-map),
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom)
- **`useDefault`** —
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection),
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties)
- **`useDefineForClassFields`** —
  [03 · Lit essentials, The decorator setup](03-lit-essentials.md#the-decorator-setup)
- **`userEvent`** — [17 · Tests, Trusted input](17-tests.md#trusted-input),
  [08 · Events, Trusted and untrusted events](08-events.md#trusted-and-untrusted-events)

## V

- **validity** — [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [10 · Forms, Hidden required fields](10-forms.md#hidden-required-fields),
  [10 · Forms, ElementInternals](10-forms.md#elementinternals)
- **`var()` fallback** —
  [06 · Styles inside a component, Invalid at computed-value time](06-styles-inside-a-component.md#invalid-at-computed-value-time),
  [14 · The focus ring, Theme islands and the ring](14-the-focus-ring.md#theme-islands-and-the-ring),
  [11 · Design tokens, What a token is](11-design-tokens.md#what-a-token-is)
- **Vercel** — [16 · Storybook, Deploy](16-storybook.md#deploy),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard),
  [01 · Repo map, The tree](01-repo-map.md#the-tree)
- **visually hidden text** —
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [06 · Styles inside a component, The visually hidden fragment](06-styles-inside-a-component.md#the-visually-hidden-fragment),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css)
- **Vite** —
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build),
  [18 · Build and package, The build steps](18-build-and-package.md#the-build-steps),
  [00 · The whiteboard, Whiteboard](00-the-whiteboard.md#whiteboard)
- **`vite.config.ts`** —
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build),
  [16 · Storybook, How a test picks a theme](16-storybook.md#how-a-test-picks-a-theme),
  [18 · Build and package, Type check scope](18-build-and-package.md#type-check-scope)
- **Vitest** — [17 · Tests, The four test projects](17-tests.md#the-four-test-projects),
  [17 · Tests, Watch mode and agents](17-tests.md#watch-mode-and-agents),
  [17 · Tests, Commands](17-tests.md#commands)

## W

- **watch mode** — [17 · Tests, Watch mode and agents](17-tests.md#watch-mode-and-agents),
  [22 · Cookbook, Recipe 8 Run tests selectively](22-cookbook.md#recipe-8-run-tests-selectively)
- **wave (roadmap)** —
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions),
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion),
  [21 · House rules and how work moves, How work moves](21-house-rules-and-how-work-moves.md#how-work-moves)
- **WCAG 2.2 AA target** —
  [09 · Accessibility, The target WCAG 2.2 AA](09-accessibility.md#the-target-wcag-22-aa),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora)
- **whitespace problem (slots)** —
  [07 · Slots, The whitespace problem](07-slots.md#the-whitespace-problem),
  [02 · Web components, Slots](02-web-components.md#slots)
- **wide gamut** —
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut),
  [13 · Themes and page CSS, How themes layer in one file](13-themes-and-page-css.md#how-themes-layer-in-one-file)
- **`willUpdate()`** —
  [03 · Lit essentials, The update cycle](03-lit-essentials.md#the-update-cycle),
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server)

## Open work by number

Each entry gives the title on GitHub, the status that the open-work boxes use, and a link to each
section that has an open-work box for the item. Find the boxes again with
`grep -rn "Open work: #N" docs/guide`. When an item lands, obey
[When open work lands](style-rules.md#when-open-work-lands).

- **#14** — issue “[Spec] gv-button — href renders a real link”. Status:
  `open PR (no conflict with main on 2026-10-27)`, through PR #68. Boxes:
  [10 · Forms, Link mode](10-forms.md#link-mode).
- **#15** — issue “[Spec] gv-card — typed entry card (surface, elevation, status)”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora).
- **#16** — issue “[Spec] gv-status-chip — dot + label inline status”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue),
  [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora).
- **#17** — issue “[Spec] gv-textarea — multiline text input”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [08 · Events, How events are checked](08-events.md#how-events-are-checked),
  [10 · Forms, Text input and IME](10-forms.md#text-input-and-ime),
  [13 · Themes and page CSS, Color scheme and native widgets](13-themes-and-page-css.md#color-scheme-and-native-widgets).
- **#18** — issue “[Spec] gv-text-input — visible label, helper text, and form association”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps).
- **#19** — issue “[Spec] gv-journey-rail — fixed scroll-journey rail (presentational)”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [07 · Slots, Prop or slot](07-slots.md#prop-or-slot),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue).
- **#20** — issue “[Spec] gv-texture — tintable, tunable grain”. Status:
  `issue, open: behaviour on main, checks remain`; PR #65 closes it. Boxes:
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback).
- **#21** — issue “[Spec] Accessible names and descriptions across the shadow boundary”. Status:
  `branch, no PR`, on the #50 work branch. Boxes:
  [02 · Web components, ID references stay in one tree](02-web-components.md#id-references-stay-in-one-tree),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **#25** — issue “[Spec] gv-checkbox — give the checkbox an accessible name”. Status:
  `branch, no PR`, on the #50 work branch. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity).
- **#26** — issue “[Spec] gv-todo-list-item — name its checkbox, rename the title prop, hide the
  decorative icon”. Status: `branch, no PR`, on the #50 work branch. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [07 · Slots, Slots and nested shadow roots](07-slots.md#slots-and-nested-shadow-roots),
  [08 · Events, Pattern 2 Forward a child event](08-events.md#pattern-2-forward-a-child-event),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary).
- **#27** — issue “[Spec] gv-text-input — autocomplete, a non-colour error cue and associated
  messages”. Status: `issue, blocked: Needs Figma Spec`. Boxes:
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue).
- **#29** — issue “[Spec] gv-todo-category-toggler — a selected state that doesn't rely on colour
  alone”. Status: `issue, blocked: Needs Figma Spec`. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Colour is never the only cue](09-accessibility.md#colour-is-never-the-only-cue).
- **#30** — issue “[Spec] gv-color-swatch — hoverable, dismissible tooltips and names that include
  the values”. Status: `issue, blocked: #30 open decision 1, the name typography`. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [06 · Styles inside a component, Rules for CSS inside a component](06-styles-inside-a-component.md#rules-for-css-inside-a-component),
  [08 · Events, Document-level keys](08-events.md#document-level-keys).
- **#33** — issue “[Spec] Storybook — register components in static builds and make the a11y checks
  gate”. Status: `issue, open: behaviour on main, checks remain`. Boxes:
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change),
  [09 · Accessibility, The a11y checks in Storybook](09-accessibility.md#the-a11y-checks-in-storybook),
  [16 · Storybook, Story registration and side effects](16-storybook.md#story-registration-and-side-effects).
- **#37** — issue “[Spec] gv-feedback-strip — choose how it announces, separately from its type”.
  Status: `issue, open: behaviour on main, checks remain`. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Live regions](09-accessibility.md#live-regions).
- **#39** — issue “[Spec] grove.css — visually-hidden and skip-link utilities”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [09 · Accessibility, Visually hidden text and skip links](09-accessibility.md#visually-hidden-text-and-skip-links),
  [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps),
  [13 · Themes and page CSS, The page-level CSS](13-themes-and-page-css.md#the-page-level-css),
  [14 · The focus ring, Rings over aurora](14-the-focus-ring.md#rings-over-aurora).
- **#40** — issue “[Spec] gv-button — type="submit" and type="reset" act on the surrounding form”.
  Status: `open PR (no conflict with main on 2026-10-27)`, through PR #68. Boxes:
  [10 · Forms, Submit and reset timing](10-forms.md#submit-and-reset-timing),
  [10 · Forms, Self-disable](10-forms.md#self-disable),
  [10 · Forms, Disabled fieldsets](10-forms.md#disabled-fieldsets).
- **#44** — issue “[Spec] gv-button — outlined and ghost on any Grove surface, not only light ones”.
  Status: `issue, blocked: Needs Figma Spec`. Boxes:
  [04 · Anatomy of a component, Stop 6 Styles](04-anatomy-of-a-component.md#stop-6-styles),
  [11 · Design tokens, Token gaps](11-design-tokens.md#token-gaps),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora),
  [22 · Cookbook, Recipe 14 Add an interactive surface-aware component](22-cookbook.md#recipe-14-add-an-interactive-surface-aware-component).
- **#45** — issue “[Epic] Host rules in componentReset: hidden + reduced motion (#35, #42)”. Status:
  `issue, open: behaviour on main, checks remain`; PR #66 closes it. Boxes:
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset).
- **#46** — issue “[Epic] gv-menu-item: 24 px target + hreflang (#28, #43)”. Status:
  `issue, open: behaviour on main, checks remain`; PR #63 is part of it. Boxes:
  [09 · Accessibility, Target size](09-accessibility.md#target-size).
- **#47** — issue “[Epic] gv-icon: decorative by default + unregistered-glyph warning (#24, #38)”.
  Status: `issue, open: behaviour on main, checks remain`; PR #64 is part of it. Boxes:
  [09 · Accessibility, Decorative and meaningful images](09-accessibility.md#decorative-and-meaningful-images),
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs).
- **#48** — issue “[Epic] gv-texture: hidden from AT + tint and frequency (#32, #20)”. Status:
  `issue, open: behaviour on main, checks remain`; PR #65 closes it. Boxes:
  [06 · Styles inside a component, The currentColor fallback](06-styles-inside-a-component.md#the-currentcolor-fallback).
- **#49** — issue “[Epic] gv-button: link mode + form association (#14, #40)”. Status:
  `open PR (no conflict with main on 2026-10-27)`, through PR #68. Boxes:
  [10 · Forms, Implicit submission](10-forms.md#implicit-submission),
  [10 · Forms, The tree rule](10-forms.md#the-tree-rule).
- **#50** — issue “[Epic] Accessible names across the shadow boundary (#21, #25, #26)”. Status:
  `branch, no PR`. Boxes: [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [03 · Lit essentials, ARIA properties and reflection](03-lit-essentials.md#aria-properties-and-reflection),
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use),
  [07 · Slots, Text in a slot](07-slots.md#text-in-a-slot),
  [09 · Accessibility, Accessible names across the shadow boundary](09-accessibility.md#accessible-names-across-the-shadow-boundary),
  [09 · Accessibility, ARIA properties](09-accessibility.md#aria-properties),
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [12 · Surfaces and elevation, Contrast on summit and aurora](12-surfaces-and-elevation.md#contrast-on-summit-and-aurora),
  [17 · Tests, Names in the accessibility tree](17-tests.md#names-in-the-accessibility-tree),
  [21 · House rules and how work moves, Properties and attributes](21-house-rules-and-how-work-moves.md#properties-and-attributes),
  [22 · Cookbook, Recipe 7 Add a browser test](22-cookbook.md#recipe-7-add-a-browser-test),
  [22 · Cookbook, Recipe 19 Build on the FormControl mixin](22-cookbook.md#recipe-19-build-on-the-formcontrol-mixin),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code).
- **#51** — issue “[Epic] gv-text-input as a real form field (#18, #27)”. Status:
  `issue, not started`; its specs #18 and #27 are `issue, blocked: Needs Figma Spec`. Boxes:
  [08 · Events, Events on a form](08-events.md#events-on-a-form),
  [09 · Accessibility, The contrast gate](09-accessibility.md#the-contrast-gate),
  [10 · Forms, Field state and validity](10-forms.md#field-state-and-validity),
  [10 · Forms, Hidden required fields](10-forms.md#hidden-required-fields).
- **#52** — issue “[Epic] Surface property + one shared surface vocabulary (#36, #44)”. Status:
  `issue, blocked: #44 OD1, the outlined border on summit and aurora`. Boxes:
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript).
- **#53** — issue “[Epic] New entry components: gv-status-chip + gv-card (#16, #15)”. Status:
  `issue, blocked: Needs Figma Spec`. Boxes:
  [05 · Component catalogue, Proposed components](05-component-catalogue.md#proposed-components),
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots).
- **#54** — issue “[Epic] Roadmap: PR groups, branches and waves for the open specs (#14 to #44)”.
  Status: `issue, open: behaviour on main, checks remain`. Boxes:
  [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion),
  [21 · House rules and how work moves, The roadmap decisions](21-house-rules-and-how-work-moves.md#the-roadmap-decisions).
- **#56** — issue “[Spec] Server rendering: Lit SSR and Declarative Shadow DOM for gv-\* components”.
  Status: `issue, not started`. Boxes:
  [02 · Web components, Declarative Shadow DOM](02-web-components.md#declarative-shadow-dom),
  [03 · Lit essentials, Lit on the server](03-lit-essentials.md#lit-on-the-server),
  [18 · Build and package, The package fields](18-build-and-package.md#the-package-fields),
  [20 · Grove in an app, Render on a server](20-grove-in-an-app.md#render-on-a-server).
- **#57** — issue “Docs sweep for 0.45: install section, component grid, and consolidation”. Status:
  `issue, open: behaviour on main, checks remain`. Boxes:
  [16 · Storybook, The landing page](16-storybook.md#the-landing-page),
  [19 · Release, Release notes](19-release.md#release-notes),
  [23 · Known drift, Leftovers in the code](23-known-drift.md#leftovers-in-the-code).
- **#58** — issue “[Spec] illustrations palette — Pedregal Grove nature primitives”. Status:
  `issue, not started`. Boxes:
  [11 · Design tokens, OKLCH and wide gamut](11-design-tokens.md#oklch-and-wide-gamut).
- **#63** — PR “fix(gv-menu-item): enforce the a11y check, correct metadata after slots, test
  linkAttribute”. Status: `open PR (no conflict with main on 2026-10-27)`. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [09 · Accessibility, Target size](09-accessibility.md#target-size),
  [15 · Metadata and the manifest, Required props](15-metadata-and-the-manifest.md#required-props),
  [16 · Storybook, The global preview](16-storybook.md#the-global-preview),
  [21 · House rules and how work moves, Merge order](21-house-rules-and-how-work-moves.md#merge-order),
  [22 · Cookbook, Recipe 17 Make a stories file fail on a11y violations](22-cookbook.md#recipe-17-make-a-stories-file-fail-on-a11y-violations),
  [23 · Known drift, Deliberate and left alone](23-known-drift.md#deliberate-and-left-alone).
- **#64** — PR “gv-icon hardening: glyph drift tests, dist gate check, host chain in the warning
  (#47)”. Status: `open PR (no conflict with main on 2026-10-27)`, part of epic #47. Boxes:
  [00 · The whiteboard, The life of a change](00-the-whiteboard.md#the-life-of-a-change),
  [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists),
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [14 · The focus ring, Checks](14-the-focus-ring.md#checks),
  [15 · Metadata and the manifest, The phosphor field](15-metadata-and-the-manifest.md#the-phosphor-field),
  [16 · Storybook, The landing page](16-storybook.md#the-landing-page),
  [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [17 · Tests, Nested shadow roots in tests](17-tests.md#nested-shadow-roots-in-tests),
  [17 · Tests, Tests that keep two copies in step](17-tests.md#tests-that-keep-two-copies-in-step),
  [18 · Build and package, The build steps](18-build-and-package.md#the-build-steps),
  [18 · Build and package, The NODE_ENV rule](18-build-and-package.md#the-node_env-rule),
  [20 · Grove in an app, Phosphor glyphs](20-grove-in-an-app.md#phosphor-glyphs),
  [21 · House rules and how work moves, Merge order](21-house-rules-and-how-work-moves.md#merge-order),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component),
  [22 · Cookbook, Recipe 18 Add a glyph a component draws](22-cookbook.md#recipe-18-add-a-glyph-a-component-draws).
- **#65** — PR “feat(gv-texture): color variants from Figma, final night grain”. Status:
  `open PR (no conflict with main on 2026-10-27)`; it closes #20 and #48. Boxes:
  [05 · Component catalogue, Notes for each component](05-component-catalogue.md#notes-for-each-component),
  [06 · Styles inside a component, Custom properties from a template](06-styles-inside-a-component.md#custom-properties-from-a-template),
  [11 · Design tokens, Literals and tokens](11-design-tokens.md#literals-and-tokens),
  [12 · Surfaces and elevation, The surface types in TypeScript](12-surfaces-and-elevation.md#the-surface-types-in-typescript),
  [13 · Themes and page CSS, The light-dark function](13-themes-and-page-css.md#the-light-dark-function),
  [21 · House rules and how work moves, Needs Figma Spec](21-house-rules-and-how-work-moves.md#needs-figma-spec),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code).
- **#66** — PR “test(componentReset): verify the #35 and #42 FRs the Wave 1 tests skipped”. Status:
  `open PR (no conflict with main on 2026-10-27)`; it closes #45. Boxes:
  [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [02 · Web components, Upgrade](02-web-components.md#upgrade),
  [06 · Styles inside a component, The component reset](06-styles-inside-a-component.md#the-component-reset),
  [09 · Accessibility, Hidden and reduced motion](09-accessibility.md#hidden-and-reduced-motion),
  [14 · The focus ring, Checks](14-the-focus-ring.md#checks),
  [17 · Tests, Nested shadow roots in tests](17-tests.md#nested-shadow-roots-in-tests),
  [17 · Tests, Change detectors](17-tests.md#change-detectors),
  [17 · Tests, Flaky tests](17-tests.md#flaky-tests),
  [21 · House rules and how work moves, Merge order](21-house-rules-and-how-work-moves.md#merge-order),
  [22 · Cookbook, Recipe 2 Add a component](22-cookbook.md#recipe-2-add-a-component),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code).
- **#67** — issue “[Spec] Motion tokens: name Grove's durations and easings”. Status:
  `issue, not started`. Boxes: [11 · Design tokens, DTCG types](11-design-tokens.md#dtcg-types).
- **#68** — PR “feat(gv-button): link mode + form association on one form-control base (#49)”.
  Status: `open PR (no conflict with main on 2026-10-27)`; it closes #14 and #40 and is part of #49.
  Boxes: [00 · The whiteboard, The work in motion](00-the-whiteboard.md#the-work-in-motion),
  [01 · Repo map, The tree](01-repo-map.md#the-tree),
  [01 · Repo map, The two export lists](01-repo-map.md#the-two-export-lists),
  [03 · Lit essentials, Reactive properties](03-lit-essentials.md#reactive-properties),
  [03 · Lit essentials, Attributes and reflection](03-lit-essentials.md#attributes-and-reflection),
  [03 · Lit essentials, Controllers and mixins](03-lit-essentials.md#controllers-and-mixins),
  [03 · Lit essentials, Lit features this repo does not use](03-lit-essentials.md#lit-features-this-repo-does-not-use),
  [04 · Anatomy of a component, Stop 5 Properties](04-anatomy-of-a-component.md#stop-5-properties),
  [04 · Anatomy of a component, Stop 7 The render method](04-anatomy-of-a-component.md#stop-7-the-render-method),
  [04 · Anatomy of a component, The files around it](04-anatomy-of-a-component.md#the-files-around-it),
  [07 · Slots, Phrasing-only and container slots](07-slots.md#phrasing-only-and-container-slots),
  [07 · Slots, What may go in a slot](07-slots.md#what-may-go-in-a-slot),
  [08 · Events, Activation in the next task](08-events.md#activation-in-the-next-task),
  [09 · Accessibility, Language of parts](09-accessibility.md#language-of-parts),
  [10 · Forms, Forms on main today](10-forms.md#forms-on-main-today),
  [10 · Forms, ElementInternals](10-forms.md#elementinternals),
  [10 · Forms, The form callbacks](10-forms.md#the-form-callbacks),
  [10 · Forms, The FormControl mixin](10-forms.md#the-formcontrol-mixin),
  [14 · The focus ring, Focus after a control disables itself](14-the-focus-ring.md#focus-after-a-control-disables-itself),
  [15 · Metadata and the manifest, Required props](15-metadata-and-the-manifest.md#required-props),
  [15 · Metadata and the manifest, How the manifest is built](15-metadata-and-the-manifest.md#how-the-manifest-is-built),
  [15 · Metadata and the manifest, JSDoc tags the manifest reads](15-metadata-and-the-manifest.md#jsdoc-tags-the-manifest-reads),
  [16 · Storybook, A story file](16-storybook.md#a-story-file),
  [17 · Tests, The test helpers](17-tests.md#the-test-helpers),
  [17 · Tests, Trusted input](17-tests.md#trusted-input),
  [18 · Build and package, The Vite library build](18-build-and-package.md#the-vite-library-build),
  [19 · Release, Release notes](19-release.md#release-notes),
  [20 · Grove in an app, Forms in an app](20-grove-in-an-app.md#forms-in-an-app),
  [21 · House rules and how work moves, Merge order](21-house-rules-and-how-work-moves.md#merge-order),
  [22 · Cookbook, Recipe 19 Build on the FormControl mixin](22-cookbook.md#recipe-19-build-on-the-formcontrol-mixin),
  [23 · Known drift, Specs that lag the code](23-known-drift.md#specs-that-lag-the-code).

[Index](README.md)
