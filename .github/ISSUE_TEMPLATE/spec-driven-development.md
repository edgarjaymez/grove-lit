---
name: Spec-Driven Development
about: Author a Grove feature/component spec before building — Figma-annotation-grounded
title: '[Spec] <feature or component>'
labels: ['spec', 'sdd']
assignees: ''
---

<!--
Spec-Driven Development (SDD) for Grove.
Fill every <…>. Resolve every ‹?› from the Figma annotations, component source, or existing code —
or move it to "Open decisions" and ask. A spec fails not when it's short but when it leaves
*behavior* ambiguous (defaults, the reverse of each interaction, empty/edge states).
-->

## Context

<!-- Why this exists: the problem/need, what prompted it, the intended outcome. -->

## Source & Inputs

- **Figma:** <file · node ids for EVERY state — default + each interaction result>
- **Design system / stack:** Grove (`gv-*` Lit) · <version>
- **Build target:** <grove (druid) | SvelteKit visitor | React visitor | Next.js visitor | Astro visitor> <!-- silvanus resolves this (verdicts: grove: / visitor:sveltekit / visitor:react / visitor:nextjs / unknown; visitor:svelte = component-framework context, not a build target — migrate to Kit or Astro islands); Astro has no silvanus verdict yet — the druid selects it -->
- **Reuse:** <existing components / stores / utils / tokens to build on>

## Figma Annotations (the behavior spec — durable snapshot)

<!--
From `mcp__figma__get_design_context` — paste each `data-<category>-annotations` block VERBATIM.
Each annotation's category is a SKILL NAME (the skill it briefs), not a generic taxonomy — list each
under its category. The generated reference code (Tailwind/hex) is the wrong stack — ignore it.
This snapshot is the permanent record: after the PR closes this issue, the annotations are CLEARED
from the Figma node (snapshot & clear), so this block must stand on its own. If an annotation carries
a rationale that ships only as code, capture it here AND as a code comment / `*.metadata.ts` field.
-->

- **create-lit-component** (`data-create-lit-component-annotations`): <build / CSS / layout / interaction notes for Grove>
- **sveltekit-visitor** (`data-sveltekit-visitor-annotations`): <build notes for the SvelteKit visitor>
- **care-for-everyone** (`data-a11y-annotations`): <accessibility requirements beyond ARIA — briefs care-for-everyone / the test-wcag-a11y nursery>
- **speak-to-users** (`data-speak-to-users-annotations`): <copy / content rules>

## Architecture / Approach

<!-- Composition tree + surfaces + tokens (from /follow-our-ways); component contract. -->

## Functional Requirements

<!-- Atomic, individually testable — one verifiable behavior each; include the reverse of each interaction. -->

- [ ] FR-01 — <…>
- [ ] FR-02 — <reverse of FR-01, if applicable>

## Files to create / modify

<!-- Name files. For a repeated pattern, describe it once + a few representative paths. -->

## Open decisions

<!-- Ambiguities to resolve with the user before/while building (each ‹?› that's still unresolved). -->

## Verification

<!-- End-to-end: run app, MCP/screenshot checks, tests, `pnpm check`/`pnpm lint` (0 errors / 0 warnings). -->

## Out of scope

<!-- Explicitly excluded behavior. -->
