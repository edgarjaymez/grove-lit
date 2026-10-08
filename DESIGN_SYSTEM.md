# Grove Design System

**Version 1.1 — Light & Dark** · reconciled against `src/lib/tokens/tokens.css` on 2026-10-07 (package 0.45.0, token set `2025.10`). Where this document and `tokens.css` disagree on a token name or value, `tokens.css` wins.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Elevation](#elevation)
5. [Text-on](#text-on)
6. [Borders & Dividers](#borders--dividers)
7. [Typography](#typography)
8. [Spacing & Grid](#spacing--grid)
9. [Border Width & Radius](#border-width--radius)
10. [Shadows](#shadows)
11. [Token Reference](#token-reference)
12. [Composition Examples](#composition-examples)
13. [Dark Theme — The Grove at Night](#dark-theme--the-grove-at-night)
14. [Component Behaviour](#component-behaviour)

---

## Brand Identity

### Name

**Grove** — A design system rooted in craft.

The name evokes the space between wild forest and manicured garden: structured freedom, designed organicity, cultivated wildness. Grove is where living systems take root.

### Voice

**Calm confidence.** Clear, unhurried prose. The quiet authority of someone who has done the work.

- Warm but not casual
- Approachable but not folksy
- Helpful but not hovering
- Patient growth over rapid scaling
- Depth over breadth

Write like helping a colleague, not instructing a stranger. Use "you" freely. Short sentences. Lead with what matters. Include the why.

### Typography

**Display:** Cakra — Experimental display typeface with unique personality, contemporary vibe, bold cuts, geometric tension.

**Body:** Inclusive Sans — A text font designed for accessibility and readability, with the friendly personality of contemporary neo-grotesques.

**Icons:** Phosphor — SVG web components rendered through `gv-icon`, in Regular and Fill weights.

### Primary Colors

| Role         | Name        | Hex       | Description                                                          |
| ------------ | ----------- | --------- | -------------------------------------------------------------------- |
| Brand        | Grove Grass | `#416943` | Earthy, mossy green. Maturity, groundedness, organic sophistication. |
| Accent       | Grove Prune | `#7F3999` | Rich purple. Used sparingly for high-priority actions and links.     |
| Ground       | Parchment   | `#FAF8F2` | Warm off-white. The surface everything sits on.                      |
| Dark Base    | Obsidian    | `#0B0B0B` | Near-black. Primary text on light surfaces.                          |
| Night Ground | Nightwood   | `#090F0B` | Green-tinted near-black. The surface everything sits on at night.    |

### What Grove Is Not

- **Not precious or twee.** No leaf illustrations, acorns, eco clichés. Borrows from nature conceptually, not literally.
- **Not cold or corporate.** Despite being a system, it has warmth.
- **Not maximalist.** Restraint is a core value. White space is clarity, not emptiness.
- **Not trendy.** Aims for longevity over novelty.
- **Not apologetic.** Makes decisions and stands by them.
- **Not exclusive.** Exists to help people build.

---

## Design Principles

### Living and Intentional

Grove feels organic but not decorative, structured but not rigid. Every element breathes, but nothing is arbitrary. The system grows with purpose—each addition earns its place.

### Quiet Confidence

Grove doesn't shout. It communicates through restraint, precision, and considered choices. Visual hierarchy emerges from thoughtful contrast, not competing for attention. When something stands out, it matters.

### Rooted Flexibility

Like a tree that bends without breaking, Grove provides strong foundations that adapt to context. The system has opinions but not dogma. It guides without constraining, offering clear paths while allowing for intentional deviation.

### Honest Craft

Every token, every value, every relationship exists because it was tested and refined. Grove favors substance over style, durability over trends. The work shows care without showing off.

---

## Color System

### Design Intent

Grove's color system is built in **OKLCH** — a perceptually uniform color space where equal numeric steps produce equal perceived lightness differences. This means the `brand/300` swatch looks exactly as "halfway between light and mid" as `brand/600` does, regardless of the hue. It also allows mixing and transforming colors without producing muddy intermediates.

There are six color families, each with a distinct role in the design language:

| Family                 | Role                                                 | Dominance            |
| ---------------------- | ---------------------------------------------------- | -------------------- |
| **Gray**               | UI chrome, neutral containers, body text backgrounds | ~60% of all surfaces |
| **Brand** (Green)      | Identity moments, marketing, primary CTAs            | ~25%                 |
| **Accent** (Purple)    | Secondary interactive, creative elements             | ~10%                 |
| **Danger** (Red)       | Error states, destructive actions                    | ~5%                  |
| **Success** (Aqua)     | Confirmation, completed states                       | ~5%                  |
| **Information** (Blue) | Informational banners, helper text                   | ~5%                  |

Gray is the workhorse. Brand is used intentionally and sparingly to preserve its emotional weight. Accent is a complement to brand — use it for secondary interactive elements where brand would create too much visual competition. Danger, Success, and Information are reserved exclusively for their semantic meaning; never use them decoratively.

### When to Use Primitives vs Semantic Tokens

**Primitives** are the raw numbered values (`--color-brand-500`, `--color-gray-200`). They carry no meaning beyond their hue and lightness.

**Semantic tokens** are named by role (`--semantic-color-surface-brand-terrace`, `--semantic-color-text-on-ground-base`). They encode the design decision.

| Use case                           | Token type   | Example                                       |
| ---------------------------------- | ------------ | --------------------------------------------- |
| SVG illustrations, isotypes, icons | Primitive    | `--color-brand-500`                           |
| Component backgrounds              | **Semantic** | `--semantic-color-surface-brand-terrace`      |
| Text on surfaces                   | **Semantic** | `--semantic-color-text-on-brand-terrace-base` |
| Borders and dividers               | **Semantic** | `--semantic-color-border-around-ground`       |
| Shadows                            | **Semantic** | `--drop-shadow-under-brand-summit`            |

> **Rule:** If you find yourself picking a primitive for a UI element, stop and find the semantic token. Primitives are not responsive to dark mode; semantic tokens are. An SVG that must use primitives follows the theme by pairing both tones in `light-dark()`, as `gv-isotype` does — see [Dark Theme](#dark-theme--the-grove-at-night).

### Cross-references

- **→ Elevation** — defines which semantic surface colors exist and at what depth
- **→ Text-on** — defines which text colors pair with each surface token

---

### Primitive Colors

Primitive colors are the raw palette. All semantic colors derive from these primitives. Primitives should only be used directly for SVG illustrations—use semantic tokens for all other applications.

#### Base

| Token        | Hex       | Name      |
| ------------ | --------- | --------- |
| `base/light` | `#FAF8F2` | Parchment |
| `base/dark`  | `#0B0B0B` | Obsidian  |
| `base/night` | `#090F0B` | Nightwood |

#### Brand (Green)

| Token       | Hex       | Name        |
| ----------- | --------- | ----------- |
| `brand/50`  | `#DAEFDA` | Honeydew    |
| `brand/100` | `#C2E2C2` | Celadon     |
| `brand/200` | `#9AC59A` | Sage        |
| `brand/300` | `#7BA57C` | Fern        |
| `brand/400` | `#5E865F` | Laurel      |
| `brand/500` | `#416943` | Grove Grass |
| `brand/600` | `#345B35` | Forest      |
| `brand/700` | `#264D28` | Pine        |
| `brand/800` | `#193F1B` | Juniper     |
| `brand/900` | `#0A320F` | Spruce      |
| `brand/950` | `#002503` | Evergreen   |

#### Accent (Purple)

| Token        | Hex       | Name        |
| ------------ | --------- | ----------- |
| `accent/50`  | `#FED8FF` | Thistle     |
| `accent/100` | `#F7BFFF` | Lilac       |
| `accent/200` | `#DF95FC` | Wisteria    |
| `accent/300` | `#BE76DA` | Orchid      |
| `accent/400` | `#9E57B9` | Heather     |
| `accent/500` | `#7F3999` | Grove Prune |
| `accent/600` | `#702989` | Plum        |
| `accent/700` | `#62187A` | Damson      |
| `accent/800` | `#53026A` | Aubergine   |
| `accent/900` | `#45005B` | Nightshade  |
| `accent/950` | `#330046` | Blackberry  |

#### Gray (Rock)

| Token      | Hex       | Name      |
| ---------- | --------- | --------- |
| `gray/50`  | `#EAE7E4` | Chalk     |
| `gray/100` | `#DBD7D2` | Limestone |
| `gray/200` | `#BCB6B1` | Pebble    |
| `gray/300` | `#9C9792` | Flint     |
| `gray/400` | `#7E7974` | Slate     |
| `gray/500` | `#615D58` | Granite   |
| `gray/600` | `#534F4A` | Shale     |
| `gray/700` | `#46423D` | Basalt    |
| `gray/800` | `#393530` | Coal      |
| `gray/900` | `#2C2824` | Onyx      |
| `gray/950` | `#201C18` | Site      |

#### Danger (Red)

| Token        | Hex       | Name      |
| ------------ | --------- | --------- |
| `danger/50`  | `#FFDAD7` | Blush     |
| `danger/100` | `#FFC1BE` | Rose      |
| `danger/200` | `#FF8D8B` | Coral     |
| `danger/300` | `#E66E6D` | Poppy     |
| `danger/400` | `#C34F51` | Vermilion |
| `danger/500` | `#A12F35` | Rust      |
| `danger/600` | `#901D27` | Crimson   |
| `danger/700` | `#80041A` | Carmine   |
| `danger/800` | `#6F000C` | Burgundy  |
| `danger/900` | `#590006` | Maroon    |
| `danger/950` | `#440002` | Oxblood   |

#### Success (Aqua Green)

| Token         | Hex       | Name       |
| ------------- | --------- | ---------- |
| `success/50`  | `#C2F5E0` | Seafoam    |
| `success/100` | `#A3E9CD` | Spearmint  |
| `success/200` | `#72CCAB` | Opal       |
| `success/300` | `#51AC8C` | Cove       |
| `success/400` | `#2E8D6F` | Serpentine |
| `success/500` | `#006F53` | Myrtle     |
| `success/600` | `#006145` | Mangrove   |
| `success/700` | `#005238` | Kelp       |
| `success/800` | `#00432C` | Reef       |
| `success/900` | `#003421` | Grotto     |
| `success/950` | `#002616` | Seabed     |

#### Information (Blue)

| Token             | Hex       | Name     |
| ----------------- | --------- | -------- |
| `information/50`  | `#C3EFFF` | Mist     |
| `information/100` | `#A6E0FF` | Sky      |
| `information/200` | `#77C1F0` | Azure    |
| `information/300` | `#58A1CF` | Cerulean |
| `information/400` | `#3882AE` | Cobalt   |
| `information/500` | `#12648F` | Lapis    |
| `information/600` | `#005680` | Sapphire |
| `information/700` | `#004871` | Navy     |
| `information/800` | `#003A62` | Indigo   |
| `information/900` | `#002D4F` | Midnight |
| `information/950` | `#00203C` | Ink      |

---

## Elevation

### Design Intent

Free color picking leads to arbitrary compositions — a green card inside an orange section inside a purple page, with no systemic logic. Grove solves this with a **track + depth** model: you choose a color family (track) and a depth level, and the system provides exactly one valid surface color for that combination. This eliminates guesswork and ensures every surface composition is deliberate.

The depth axis (Ground → Terrace → Path → Summit) maps to perceived visual weight: the further a surface sits from Ground, the more prominent it is. By day that means darker; at night, lighter (see [Dark Theme](#dark-theme--the-grove-at-night)). The progression is always forward — a nested element must sit further from Ground than its parent within the same track, or start a new track from a lower depth.

### Aurora

**Aurora is a transient surface, not a resting container.** It is the hover and press state of Summit controls, and it can also paint a highlight: a section that is briefly emphasised on top of the surface it rests on. Summit-level interactive elements (buttons, chips, links) use it through `:hover` or `:active`. A highlight section may hold content, such as a `gv-title` with `surface="brand-aurora"`, but it never becomes a nesting parent for further depths.

Aurora has no `emphasis` text role, no focus ring and no drop shadow. A control focused over an aurora highlight keeps the ring of the resting surface underneath it.

```css
.button-primary {
	background-color: var(--semantic-color-surface-brand-summit);
}
.button-primary:hover {
	background-color: var(--semantic-color-surface-brand-aurora);
}
```

### UI Color Distribution — Page Anatomy

The 60/25/10/5 guideline describes the visual proportion of color in a typical page:

```
┌─────────────────────────────────────────────────────────┐
│  GROUND (60%)  — page background, most of the viewport  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  TERRACE (25%) — cards, sections, sidebars        │  │
│  │  ┌──────────────────────────────────────────┐     │  │
│  │  │  PATH / SUMMIT (10%) — nested elements,  │     │  │
│  │  │  buttons, highlighted rows               │     │  │
│  │  └──────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────┘  │
│  AURORA (5%) — hover/active states only                 │
└─────────────────────────────────────────────────────────┘
```

A page that uses Summit for 60% of its surface area will feel visually heavy and fatiguing. Reserve saturated, dark surfaces for elements that need immediate attention.

### Cross-references

- **→ Text-on** — once you've chosen a surface, find its paired text tokens
- **→ Shadows** — when to add shadows to Terrace and Summit surfaces
- **→ Borders & Dividers** — border and divider tokens per surface

### Overview

Elevation in Grove uses **tracks**—color lanes that define which surfaces are available at each depth level. You pick a track, then follow its depth progression.

### Tracks

There are six tracks:

- **Brand** — Grove Grass. Primary brand expression.
- **Accent** — Grove Prune. High-priority actions, links.
- **Gray** — Neutral surfaces. The default for most UI.
- **Danger** — Error states, destructive actions.
- **Success** — Confirmation, positive feedback.
- **Information** — Notices, helpful context.

### Depths

| Depth       | Light        | Dark         | Role                                                          |
| ----------- | ------------ | ------------ | ------------------------------------------------------------- |
| **Ground**  | `base/light` | `base/night` | The base surface. Where everything begins.                    |
| **Terrace** | `100`        | `900`        | Containers, cards, sections.                                  |
| **Path**    | `200`        | `800`        | Elements inside containers. _Brand and Gray only._            |
| **Summit**  | `500`        | `600`        | The most prominent depth. High-priority interactive elements. |
| **Aurora**  | `700`        | `500`        | Hover state for Summit. Not a container.                      |

### Track Definitions (Light Mode)

#### Brand Track

| Depth   | Token                   | Hex       | Name        |
| ------- | ----------------------- | --------- | ----------- |
| Terrace | `surface/brand/terrace` | `#C2E2C2` | Celadon     |
| Path    | `surface/brand/path`    | `#9AC59A` | Sage        |
| Summit  | `surface/brand/summit`  | `#416943` | Grove Grass |
| Aurora  | `surface/brand/aurora`  | `#264D28` | Pine        |

#### Accent Track

| Depth   | Token                    | Hex       | Name        |
| ------- | ------------------------ | --------- | ----------- |
| Terrace | `surface/accent/terrace` | `#F7BFFF` | Lilac       |
| Summit  | `surface/accent/summit`  | `#7F3999` | Grove Prune |
| Aurora  | `surface/accent/aurora`  | `#62187A` | Damson      |

_Accent has no Path depth._

#### Gray Track

| Depth   | Token                  | Hex       | Name      |
| ------- | ---------------------- | --------- | --------- |
| Terrace | `surface/gray/terrace` | `#DBD7D2` | Limestone |
| Path    | `surface/gray/path`    | `#BCB6B1` | Pebble    |
| Summit  | `surface/gray/summit`  | `#615D58` | Granite   |
| Aurora  | `surface/gray/aurora`  | `#46423D` | Basalt    |

#### Danger Track

| Depth   | Token                    | Hex       | Name    |
| ------- | ------------------------ | --------- | ------- |
| Terrace | `surface/danger/terrace` | `#FFC1BE` | Rose    |
| Summit  | `surface/danger/summit`  | `#A12F35` | Rust    |
| Aurora  | `surface/danger/aurora`  | `#80041A` | Carmine |

_Danger has no Path depth._

#### Success Track

| Depth   | Token                     | Hex       | Name      |
| ------- | ------------------------- | --------- | --------- |
| Terrace | `surface/success/terrace` | `#A3E9CD` | Spearmint |
| Summit  | `surface/success/summit`  | `#006F53` | Myrtle    |
| Aurora  | `surface/success/aurora`  | `#005238` | Kelp      |

_Success has no Path depth._

#### Information Track

| Depth   | Token                         | Hex       | Name  |
| ------- | ----------------------------- | --------- | ----- |
| Terrace | `surface/information/terrace` | `#A6E0FF` | Sky   |
| Summit  | `surface/information/summit`  | `#12648F` | Lapis |
| Aurora  | `surface/information/aurora`  | `#004871` | Navy  |

_Information has no Path depth._

### Depth Availability

| Depth   | Brand | Accent | Gray | Danger | Success | Information |
| ------- | ----- | ------ | ---- | ------ | ------- | ----------- |
| Ground  | ✓     | ✓      | ✓    | ✓      | ✓       | ✓           |
| Terrace | ✓     | ✓      | ✓    | ✓      | ✓       | ✓           |
| Path    | ✓     | ✗      | ✓    | ✗      | ✗       | ✗           |
| Summit  | ✓     | ✓      | ✓    | ✓      | ✓       | ✓           |
| Aurora  | ✓     | ✓      | ✓    | ✓      | ✓       | ✓           |

### Composition Rules

#### 1. Ground is the base.

Every layout starts on Ground (`surface/ground`). All tracks can be placed on Ground.

#### 2. Within a track, depths progress forward.

Move from lighter to darker: Terrace → Path → Summit. You can skip depths but never go backward within the same track.

**Correct:**

```
brand/terrace → brand/path → brand/summit
brand/terrace → brand/summit (skipping path)
```

**Wrong:**

```
brand/path → brand/terrace (going backward)
brand/terrace → brand/terrace (restarting)
```

#### 3. Starting a new track requires a depth change.

When nesting a new track inside a parent, the new track cannot start at the same depth. This ensures visible contrast between surfaces.

Preferably, go one depth deeper. Going further is allowed but not recommended.

**From Terrace:** Start new track at Path (preferred) or Summit.

**From Path:** Start new track at Summit (preferred) or return to Ground.

**From Summit:** Return to Ground.

**Examples:**

```
gray/terrace
  └── brand/path ✓ (one depth over, preferred)

gray/terrace
  └── brand/summit ✓ (allowed, not preferred)

gray/terrace
  └── brand/terrace ✗ (same depth, no contrast)

brand/summit
  └── gray/ground ✓ (return to ground)
```

#### 4. Gray is universal.

Gray can appear inside any track at any depth. It's the neutral foundation.

#### 5. Accent can appear inside Gray.

Accent elements (like buttons) can be placed within gray surfaces for emphasis.

#### 6. Brand and semantic tracks don't mix.

Brand and Accent tracks should not contain Danger, Success, or Information tracks inside them. Semantic colors communicate specific states and shouldn't be nested within brand expression.

#### 7. Aurora is a state, not a container.

Aurora is the hover state for Summit elements, or a transient highlight over a resting surface. It is never a resting container and never the parent of another depth. Only Summit changes surface color on hover. Components that take a `surface` (the `GroveSurface` type) accept the aurora values for highlight sections.

#### 8. Floating elements reset context.

Modals, popovers, and tooltips don't inherit the depth of whatever they float over. Modals and popovers start fresh from Ground. A tooltip is the exception by design: `gv-tooltip` is a small accent or gray **Summit** bubble with its summit drop shadow as the attention cue.

### UI Color Distribution

A guideline for visual balance:

- **60%** — Ground
- **25%** — Terrace
- **10%** — Path / Summit
- **5%** — Aurora (interactive states only)

---

## Text-on

Every surface has paired text colors that ensure readable contrast.

### Text Roles

| Role               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| **Emphasis**       | Highest hierarchy. Headings, key content.   |
| **Base**           | Default body text.                          |
| **Subtle**         | De-emphasized. Captions, hints, timestamps. |
| **Unvisited-link** | Link, not yet clicked.                      |
| **Visited-link**   | Link, already clicked.                      |

### Role Availability by Depth

| Role           | Ground | Terrace | Path | Summit | Aurora |
| -------------- | ------ | ------- | ---- | ------ | ------ |
| Emphasis       | ✓      | ✓       | ✗    | ✗      | ✗      |
| Base           | ✓      | ✓       | ✓    | ✓      | ✓      |
| Subtle         | ✓      | ✓       | ✓    | ✓      | ✓      |
| Unvisited-link | ✓      | ✓       | ✓    | ✗      | ✗      |
| Visited-link   | ✓      | ✓       | ✓    | ✗      | ✗      |

Summit and Aurora are terminal elements. They need base and subtle for labels, but not emphasis or links.

### Token Structure

```
text-on/ground/{role}
text-on/{track}/{depth}/{role}
```

**Examples:**

- `text-on/ground/base` — Body text on ground
- `text-on/brand/terrace/emphasis` — Heading on brand terrace
- `text-on/gray/summit/base` — Label on gray summit

---

## Borders & Dividers

### Border-around

Used for component edges: input fields, cards, containers.

```
border-around/ground
border-around/{track}/{depth}
```

### Divider-on

Used for separating content within a surface: list items, table rows.

```
divider-on/ground
divider-on/{track}/{depth}
```

Both provide a single value per surface—no role hierarchy.

---

## Typography

### Design Intent

Grove's type system is built around two contrasting typefaces that never compete with each other: **Cakra** for expressive moments, **Inclusive Sans** for everything readable. The distinction is simple — if it serves communication, it's Inclusive Sans. If it expresses character, it's Cakra.

### Font Pairing Rules

| Family                    | When to use                                                                               | When NOT to use                           |
| ------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Inclusive Sans** (sans) | Body copy, UI labels, navigation, form fields, captions                                   | Full-page hero text, logotypes            |
| **Cakra** (display)       | Hero headings, section titles in marketing contexts, the `hero` and `display` type styles | Body paragraphs, form labels, button text |

> **Rule:** Never use both Cakra and Inclusive Sans on adjacent lines within the same text block. The transition between expressive and functional is always at the component boundary, not mid-paragraph.

### Level Selection Guide

Use the composite typography tokens (via CSS classes) rather than assembling font-size + weight + line-height individually.

| UI role                     | Recommended class        | Family         |
| --------------------------- | ------------------------ | -------------- |
| Page hero / product name    | `.hero.singleline`       | Cakra          |
| Tagline / campaign headline | `.display.singleline`    | Cakra          |
| Page title, section heading | `.title.singleline`      | Inclusive Sans |
| Card heading                | `.heading.singleline`    | Inclusive Sans |
| Sub-section header          | `.subheading.singleline` | Inclusive Sans |
| Body copy                   | `.base.multiline`        | Inclusive Sans |
| Secondary / supportive text | `.subtle.multiline`      | Inclusive Sans |
| Blockquote, callout         | `.quote.multiline`       | Inclusive Sans |
| Form label, tag, chip       | `.label.singleline`      | Inclusive Sans |
| Image caption, timestamp    | `.caption.singleline`    | Inclusive Sans |
| Legal text, footnote        | `.footnote.singleline`   | Inclusive Sans |

### Single-line vs Multi-line

The `.singleline` and `.multiline` suffixes control line-height:

- **`.singleline`** — tight leading (1.0–1.33×). Use for headings, labels, buttons — anything that fits on one line and doesn't need breathing room between lines.
- **`.multiline`** — looser leading (1.2–1.67×). Use for body copy, descriptions, anything that wraps across two or more lines.

> **Rule:** Apply `.singleline` to interactive and heading elements. Apply `.multiline` to any text block that might exceed one line.

### Emphasis

For Inclusive Sans levels (title through footnote), add `.emphasis` to raise the weight one step: semibold (600) for every level except `subtle`, whose base is extra-light (200) and whose emphasis is regular (400). Use sparingly — only to signal hierarchy within a block, never decoratively.

```html
<span class="label singleline emphasis">Required</span>
```

`hero` and `display` (Cakra) have no emphasis variant. Cakra's single weight is already expressive enough.

### Icons

Icons are Phosphor SVG web components (`@phosphor-icons/webcomponents`), rendered through `gv-icon` — there is no icon font. The page registers each glyph module it uses. Phosphor comes in two weights: **Regular** (outline strokes) and **Fill** (solid fills); `gv-icon` shows Fill with the `is-filled` attribute, or when an ancestor flips its `--gv-icon-*-display` custom properties (hover fills in `gv-button`).

| Variant | When to use                                    |
| ------- | ---------------------------------------------- |
| Regular | Decorative, informational, neutral state icons |
| Fill    | Active state, selected, toggled-on state       |

Never use Fill for inactive states — the solid weight implies action or selection.

### Cross-references

- **→ Text-on** — color tokens that pair with surfaces for readable contrast
- **→ Spacing & Grid** — gap values for spacing between text blocks

### Font Families

| Token                    | Value                                     | Usage                        |
| ------------------------ | ----------------------------------------- | ---------------------------- |
| `font-family/sans-serif` | `"Inclusive Sans", system-ui, sans-serif` | Body text, UI elements       |
| `font-family/display`    | `"Cakra", serif`                          | Display, headings, marketing |

### Font Weights

| Token                     | Value | Name       |
| ------------------------- | ----- | ---------- |
| `font-weight/extra-light` | 200   | Extralight |
| `font-weight/regular`     | 400   | Regular    |
| `font-weight/semi-bold`   | 600   | Semibold   |

There are no italic weight tokens: italics come from `font-style: italic`, which `fonts.css` maps to the Inclusive Sans italic face.

### Font Size Scale (Digital)

The scale name and the type level are different things: body copy (`.base`) uses `font-size/md`, not `font-size/base`.

| Token            | Size  | Usage                     |
| ---------------- | ----- | ------------------------- |
| `font-size/2xs`  | 10px  | `footnote` level          |
| `font-size/xs`   | 12px  | `caption` level           |
| `font-size/sm`   | 14px  | `label` level             |
| `font-size/base` | 16px  | `subtle` level            |
| `font-size/md`   | 20px  | `base` (body) and `quote` |
| `font-size/lg`   | 24px  | `subheading` level        |
| `font-size/xl`   | 32px  | `heading` level           |
| `font-size/2xl`  | 40px  | `title` level             |
| `font-size/3xl`  | 80px  | `display` level           |
| `font-size/4xl`  | 240px | `hero` level              |

### Font Size Scale (Print)

Values are soft-grid `rem` steps (shown here in px at 16px root), not points.

| Token            | Size  |
| ---------------- | ----- |
| `font-size/2xs`  | 6px   |
| `font-size/xs`   | 6px   |
| `font-size/sm`   | 8px   |
| `font-size/base` | 8px   |
| `font-size/md`   | 12px  |
| `font-size/lg`   | 16px  |
| `font-size/xl`   | 24px  |
| `font-size/2xl`  | 32px  |
| `font-size/3xl`  | 64px  |
| `font-size/4xl`  | 192px |

### Line Height

Two modes: **single-line** (labels, buttons) and **multi-line** (paragraphs). The tokens are unitless ratios; the px values below are those ratios times the matching font size.

#### Single-line (Digital)

| Token                          | Value |
| ------------------------------ | ----- |
| `line-height/single-line/2xs`  | 12px  |
| `line-height/single-line/xs`   | 16px  |
| `line-height/single-line/sm`   | 16px  |
| `line-height/single-line/base` | 20px  |
| `line-height/single-line/md`   | 24px  |
| `line-height/single-line/lg`   | 28px  |
| `line-height/single-line/xl`   | 36px  |
| `line-height/single-line/2xl`  | 44px  |
| `line-height/single-line/3xl`  | 80px  |
| `line-height/single-line/4xl`  | 240px |

#### Multi-line (Digital)

| Token                         | Value |
| ----------------------------- | ----- |
| `line-height/multi-line/2xs`  | 16px  |
| `line-height/multi-line/xs`   | 20px  |
| `line-height/multi-line/sm`   | 20px  |
| `line-height/multi-line/base` | 24px  |
| `line-height/multi-line/md`   | 28px  |
| `line-height/multi-line/lg`   | 32px  |
| `line-height/multi-line/xl`   | 40px  |
| `line-height/multi-line/2xl`  | 48px  |
| `line-height/multi-line/3xl`  | 96px  |
| `line-height/multi-line/4xl`  | 304px |

### Letter Spacing

| Token                        | Value | Usage                                |
| ---------------------------- | ----- | ------------------------------------ |
| `letter-spacing/tight`       | -2px  | Available; no type level uses it     |
| `letter-spacing/base`        | 0px   | Default — every Inclusive Sans level |
| `letter-spacing/loose`       | 2px   | `display` level                      |
| `letter-spacing/extra-loose` | 4px   | `hero` level                         |

---

## Spacing & Grid

### Design Intent

**The soft grid is a spacing scale, not a CSS grid.** It provides a set of predefined values (1px increments at small sizes, 4px at larger) so spacing decisions are always consistent and intentional — no arbitrary `17px` or `22px` values.

The number in each token name is the value in pixels at the default 16px root font size. In code, all values are expressed in `rem` so they respect user font-size preferences.

### Semantic Groupings

Not all spacing values are equal — they serve different layers of the UI:

| Range         | Values  | Typical use                                                                 |
| ------------- | ------- | --------------------------------------------------------------------------- |
| **Micro**     | 0–8px   | Internal component spacing — icon-to-label gap, input padding, badge insets |
| **Component** | 12–24px | Component padding, gap between related elements in a group                  |
| **Layout**    | 32–64px | Gap between sections, card margins, hero padding                            |
| **Section**   | 72–96px | Page-level vertical rhythm, spacious section breaks                         |

> **Rule:** If you're spacing elements within a component, stay in 0–24px. If you're spacing between components or sections, use 32px+.

### System vs Landing Grid

Two grid presets exist for different contexts:

| Grid type   | Use case                                      | Margin at laptop |
| ----------- | --------------------------------------------- | ---------------- |
| **System**  | Product UI, app shells, dashboards            | 32px             |
| **Landing** | Marketing pages, documentation, hero sections | 64px             |

Landing grids use wider margins to give content more breathing room and center the reading line at large viewports.

### Breakpoints

| Name    | Min-width |
| ------- | --------- |
| Mobile  | 0px       |
| Tablet  | 768px     |
| Laptop  | 1280px    |
| Desktop | 1536px    |

### Cross-references

- **→ Elevation** — padding values used within each surface depth

### Soft Grid

Spacing values for margins, padding, and gaps.

| Token | Value |
| ----- | ----- |
| `0`   | 0px   |
| `1`   | 1px   |
| `2`   | 2px   |
| `4`   | 4px   |
| `6`   | 6px   |
| `8`   | 8px   |
| `10`  | 10px  |
| `12`  | 12px  |
| `14`  | 14px  |
| `16`  | 16px  |
| `18`  | 18px  |
| `20`  | 20px  |
| `24`  | 24px  |
| `28`  | 28px  |
| `32`  | 32px  |
| `36`  | 36px  |
| `40`  | 40px  |
| `44`  | 44px  |
| `48`  | 48px  |
| `52`  | 52px  |
| `56`  | 56px  |
| `60`  | 60px  |
| `64`  | 64px  |
| `72`  | 72px  |
| `80`  | 80px  |
| `88`  | 88px  |
| `96`  | 96px  |

### Layout Grid

Two grid types: **system** (applications) and **landing** (marketing pages).

#### Base / Mobile (< 768px)

| Property | System | Landing |
| -------- | ------ | ------- |
| Columns  | 4      | 4       |
| Margin   | 16px   | 16px    |
| Gutter   | 16px   | 16px    |

#### Tablet (≥ 768px)

| Property | System | Landing |
| -------- | ------ | ------- |
| Columns  | 8      | 8       |
| Margin   | 24px   | 32px    |
| Gutter   | 16px   | 24px    |

#### Laptop (≥ 1280px)

| Property | System | Landing |
| -------- | ------ | ------- |
| Columns  | 12     | 12      |
| Margin   | 32px   | 64px    |
| Gutter   | 20px   | 32px    |

#### Desktop (≥ 1536px)

| Property | System | Landing |
| -------- | ------ | ------- |
| Columns  | 12     | 12      |
| Margin   | 32px   | 96px    |
| Gutter   | 24px   | 48px    |

---

## Border Width & Radius

### Border Width

| Token                   | Value | Usage                |
| ----------------------- | ----- | -------------------- |
| `border-width/none`     | 0px   | No border            |
| `border-width/hairline` | 0.5px | Subtle dividers      |
| `border-width/base`     | 1px   | Default borders      |
| `border-width/heavy`    | 2px   | Emphasized borders   |
| `border-width/thick`    | 4px   | Strong visual weight |

### Border Radius

| Token                | Value | Usage                |
| -------------------- | ----- | -------------------- |
| `border-radius/none` | 0px   | Sharp corners        |
| `border-radius/sm`   | 4px   | Small elements, tags |
| `border-radius/base` | 8px   | Default              |
| `border-radius/md`   | 12px  | Cards                |
| `border-radius/lg`   | 16px  | Large cards          |
| `border-radius/xl`   | 20px  | Modals               |
| `border-radius/2xl`  | 24px  | Large containers     |
| `border-radius/3xl`  | 28px  | Hero elements        |
| `border-radius/4xl`  | 32px  | Full rounded         |
| `border-radius/6xl`  | 40px  | Pills                |
| `border-radius/8xl`  | 48px  | Large pills          |
| `border-radius/10xl` | 56px  | Capsules             |
| `border-radius/12xl` | 64px  | Full capsules        |

---

## Shadows

Shadows come in two depths (Summit and Terrace), each using two layers for a softer, more natural appearance. Shadows use the track's own color family for cohesive integration.

### Design Intent

Shadows serve one purpose: reinforcing depth that surface contrast alone doesn't fully communicate. If two surfaces already have clear contrast (e.g. a dark Summit button on a light Ground), don't add a shadow — it creates visual noise without adding hierarchy information.

Only use shadows on **Terrace and Summit** surfaces. Ground-level elements don't receive shadows because they have nothing to be elevated above.

### When to Use Each Depth

| Depth       | CSS class                           | Visual weight   | Use for                                       |
| ----------- | ----------------------------------- | --------------- | --------------------------------------------- |
| **Summit**  | `drop-shadow-under-{track}-summit`  | Tight, balanced | Cards, panels, buttons, form inputs           |
| **Terrace** | `drop-shadow-under-{track}-terrace` | Wide, airy      | Modals, sheets, floating containers, popovers |

Available tracks: `brand`, `accent`, `gray`, `information`, `danger`, `success`

### Rules

- **Don't combine shadows with heavy borders** on the same element — choose one signal of elevation, not both.
- **Match the shadow track to the surface track** — a brand Summit button uses `drop-shadow-under-brand-*`, not `drop-shadow-under-gray-*`.
- **Don't shadow Ground elements** — a flat page background doesn't need a shadow.

### Usage (CSS class)

The classes live in `effects.css` (part of `grove.css`) and style the light DOM. Inside a component's shadow root, use the `--drop-shadow-under-{track}-{depth}` token instead; a focusable control sets it through its private `--_drop` property so the focus ring can stack on top.

```html
<!-- Card on a surface -->
<div class="drop-shadow-under-gray-summit">...</div>

<!-- Modal -->
<div class="drop-shadow-under-gray-terrace">...</div>

<!-- Brand button -->
<button class="drop-shadow-under-brand-summit">...</button>
```

### Cross-references

- **→ Elevation** — which depths are valid containers for shadows
- **→ Borders & Dividers** — don't use thick borders with shadows on the same element

### Shadow structure (Brand, light mode)

| Depth   | Layer | Offset X/Y  | Blur | Spread | Opacity |
| ------- | ----- | ----------- | ---- | ------ | ------- |
| Summit  | 1     | 4px / 4px   | 8px  | 2px    | 4%      |
| Summit  | 2     | 1px / 1px   | 4px  | 1px    | 12%     |
| Terrace | 1     | 16px / 16px | 32px | 4px    | 4%      |
| Terrace | 2     | 4px / 4px   | 16px | 2px    | 8%      |

Terrace shadows have this structure on every track, in the track's own hue. Summit differs: every track other than brand uses a stronger Summit shadow — layer 1 `8px / 8px`, blur `16px`, spread `4px`, `8%`; layer 2 `2px / 2px`, blur `8px`, spread `2px`, `24%`. At night, shadows become a moonlit rim — see [Dark Theme](#dark-theme--the-grove-at-night).

---

## Token Reference

### Collection Overview

| Collection                                   | Modes                                 | Description                                                               |
| -------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| `color`                                      | Value                                 | Primitive color palette                                                   |
| `semantic-color`                             | Light, Dark                           | Surface, text-on, border-around, divider-on                               |
| `typography`                                 | —                                     | Composite type levels (family, size, weight, line height, letter spacing) |
| `font-size`, `line-height`, `letter-spacing` | Digital, Print (the `media` modifier) | The scales the composites read                                            |
| `font-family`                                | —                                     | Typeface definitions                                                      |
| `font-weight`                                | Value                                 | Weight names                                                              |
| `soft-grid`                                  | —                                     | Spacing scale                                                             |
| `grid`                                       | Mobile, Tablet, Laptop, Desktop       | Layout grid                                                               |
| `breakpoints`                                | —                                     | Min-widths for tablet, laptop, desktop                                    |
| `border-radius`                              | —                                     | Corner radius scale                                                       |
| `border-width`                               | —                                     | Stroke width scale                                                        |
| `dropShadowUnder`, `ringOn`                  | Light, Dark                           | Drop shadows and focus rings (`effects/`)                                 |

### Naming Convention

```
{collection}/{category}/{variant}/{property}
```

**Examples:**

- `color.brand.500` → `--color-brand-500` (primitive green)
- `semanticColor.surface.brand.terrace` → `--semantic-color-surface-brand-terrace`
- `semanticColor.textOn.brand.terrace.base` → `--semantic-color-text-on-brand-terrace-base`
- `fontSize.base` → `--font-size-base` (16px)
- `dropShadowUnder.brand.terrace` → `--drop-shadow-under-brand-terrace` (both layers in one value)

DTCG groups are camelCase (`softGrid`, `fontFamily.sansSerif`, `letterSpacing.extraLoose`); Terrazzo writes them as kebab-case custom properties. This document's slash notation (`font-size/base`) is shorthand for the same path.

### File Structure

```
src/lib/tokens/{group}/{collection}.{mode}.tokens.json
```

**Examples:**

- `palette/color.tokens.json`
- `palette/semantic-color.light.tokens.json`
- `palette/semantic-color.dark.tokens.json`
- `text/font-size.digital.tokens.json`
- `spacing/grid.tablet.tokens.json`

`main.resolver.json` combines them through three modifiers — `theme` (light, dark), `breakpoint` (mobile, tablet, laptop, desktop) and `media` (digital, print) — and Terrazzo compiles the result into `tokens.css` (`pnpm build-tokens`). Never edit `tokens.css` by hand.

---

## Composition Examples

### Example 1: Card on Ground

```
Ground (surface/ground)
  └── gray/terrace (card)
        ├── text-on/gray/terrace/emphasis (heading)
        ├── text-on/gray/terrace/base (body)
        ├── text-on/gray/terrace/subtle (timestamp)
        └── accent/summit (button)
              └── text-on/accent/summit/base (label)
```

### Example 2: Brand Section

```
Ground (surface/ground)
  └── brand/terrace (hero section)
        ├── text-on/brand/terrace/emphasis (headline)
        ├── text-on/brand/terrace/base (description)
        └── brand/summit (primary action)
              └── text-on/brand/summit/base (label)
```

### Example 3: Nested Depth Progression

```
Ground (surface/ground)
  └── brand/terrace (card)
        └── brand/path (highlighted section)
              ├── text-on/brand/path/base (content)
              ├── text-on/brand/path/unvisited-link (link)
              └── brand/summit (action)
                    └── text-on/brand/summit/base (label)
```

### Example 4: Starting New Track (Correct Depth Change)

```
Ground (surface/ground)
  └── gray/terrace (card)
        └── brand/path (nested brand element, one depth over)
              └── brand/summit (action)
```

### Example 5: Danger Banner

```
Ground (surface/ground)
  └── danger/terrace (error banner)
        ├── text-on/danger/terrace/base (message)
        └── danger/summit (dismiss)
              └── text-on/danger/summit/base (label)
```

### Example 6: Modal (Context Reset)

```
[Page: brand/terrace → brand/path]
  └── [Modal opens — returns to Ground]
        └── Ground (surface/ground)
              └── gray/terrace (modal body)
                    ├── text-on/gray/terrace/emphasis (title)
                    ├── text-on/gray/terrace/base (content)
                    └── accent/summit (confirm)
```

### Example 7: Gray with Accent Button

```
Ground (surface/ground)
  └── gray/terrace (card)
        ├── text-on/gray/terrace/base (content)
        └── accent/summit (CTA button)
              └── text-on/accent/summit/base (label)
```

---

## Dark Theme — The Grove at Night

At night the grove keeps its shape: the same tracks, depths, text roles and composition rules. Only the values move. Ground sinks to Nightwood, depth rises toward the light, and text is lit like moonlight on parchment.

### Turning It On

- **Automatic.** The dark theme follows `prefers-color-scheme`. Importing `tokens.css` is all it takes.
- **Pinned.** Set `data-theme="light"` or `data-theme="dark"` on `<html>` to override the operating system. `color-scheme` follows the theme, so native controls, scrollbars and `light-dark()` match it.
- **Theme islands.** `data-theme` on any other element makes it a fresh Ground in that theme: `globals.css` repaints its surface and resets its text colour, and breakpoint grid values still apply inside it.
- **Print** is always light, islands included.

### Principles

1. **Match each role's contrast, not its step number.** Mirroring `100` ↔ `900` doesn't work. The lightness ramp is asymmetric, and light text on a dark surface needs a bigger lightness gap for the same perceived contrast. Steps `300`–`400` carry text in neither theme.
2. **Depth rises toward the light.** The further a surface sits from Ground, the more prominent it is. By day that is darker; at night it is lighter — on the brand track, Ground L 0.16 → Terrace 0.28 → Path 0.33 → Summit 0.43 → Aurora 0.48. Aurora still means hover and press, so at night a touched surface brightens.
3. **Body text sits near APCA Lc 90 on every surface.** Chalk (`gray/50`) on Nightwood; Parchment (`base/light`) on the mid-tone Summit and Aurora solids. Parchment on Nightwood would reach Lc 103 and glare.
4. **One solid-text rule for both themes.** On Summit and Aurora, base is `base/light` and subtle is `{track}/50`, by day and at night.
5. **Tint the darks.** Nightwood is a green-tinted near-black, never pure black, so the night keeps its woodland colour.
6. **A moonlit rim instead of a cast shadow.** Shadows barely read on a dark ground. At night a raised surface gets a 1px rim in its own colour, one step lighter, plus a soft same-hue glow (Summit) or a deep, soft shadow (floating Terrace).
7. **Hue identity is kept.** Every family keeps its hue; only lightness moves.

### Mapping

`X` is the track. ★ marks a value that changed in light mode too.

| Role                                                            | Light                                                     | Dark                                                      |
| --------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `surface/ground`                                                | `base/light` (Parchment)                                  | `base/night` (Nightwood)                                  |
| `surface/X/{terrace, path, summit, aurora}`                     | `100` / `200` / `500` / `700`                             | `900` / `800` / `600` / `500`                             |
| `text-on/ground/{base, subtle, emphasis}`                       | `base/dark` / `gray/700` / `brand/500`                    | `gray/50` / `gray/100` / `brand/100`                      |
| `text-on/ground/{unvisited-link, visited-link}`                 | `accent/500` / `information/500`                          | `accent/100` / `information/100`                          |
| `text-on/X/{terrace, path}/{base, subtle}`                      | `X/950` / `X/800` (Path: `X/900`)                         | `X/50` / `X/100`                                          |
| `text-on/X/terrace/emphasis`                                    | `base/dark`                                               | `base/light`                                              |
| `text-on/X/{terrace, path}/{unvisited-link, visited-link}` ¹    | `accent/800` / `information/800` (Path: `900`–`950`)      | `accent/100` / `information/100`                          |
| ★ `text-on/X/{summit, aurora}/{base, subtle}`                   | `base/light` / `X/50` (was `X/50` / `X/100`)              | `base/light` / `X/50`                                     |
| `border-around/{ground, X/terrace, X/path, X/summit, X/aurora}` | `gray/100` / `X/200` / `X/300` / `X/700` / `X/900`        | `gray/900` / `X/700` / `X/600` / `X/400` / `X/300`        |
| `divider-on/{ground, X/terrace, X/path, X/summit, X/aurora}`    | `gray/200` / `X/300` / `X/400` / `X/50` / `X/100`         | `gray/700` / `X/600` / `X/500` / `X/100` / `X/50`         |
| `selected-text-on/{ground, X/terrace, X/summit, X/aurora}` ²³   | `accent/100` / `accent/500` / `accent/100` / `accent/100` | `accent/800` / `accent/700` / `accent/800` / `accent/800` |
| `ring-on` colour — Ground, Terrace, Path / Summit ²             | `accent/500` / `accent/100`                               | `accent/300` / `accent/100`                               |

¹ Where a track is itself a link colour, that link borrows brand instead: the accent track's unvisited link and the information track's visited link (`brand/800` by day, `brand/100` at night).
² The accent track uses `brand` in place of `accent`.
³ A `selected-text-on` summit token exists only for the brand and gray tracks (no path variant either); the other tracks have ground, terrace and aurora.

#### Shadows at night

| Depth   | Layer      | Offset X/Y | Blur | Spread | Colour               |
| ------- | ---------- | ---------- | ---- | ------ | -------------------- |
| Summit  | 1 — rim    | 0 / 0      | 0    | 1px    | `{track}/500` at 60% |
| Summit  | 2 — glow   | 0 / 0      | 16px | 0      | `{track}/500` at 25% |
| Terrace | 1 — rim    | 0 / 0      | 0    | 1px    | `{track}/800` at 80% |
| Terrace | 2 — shadow | 0 / 16px   | 32px | 4px    | `base/dark` at 60%   |

The same two-layer tokens, so hover-lift and pressed-drop behave exactly as they do by day.

### Contrast

WCAG 3's contrast method is still undecided — its Working Draft (10 September 2026) reads "@@[contrast measure to be determined]", and APCA was taken out of the draft in 2023. Until that settles, Grove gates on what can be measured today: **WCAG 2.2 AA** plus **APCA** at the ARC Bronze floors (`apca-w3` 0.1.9).

APCA is a supplementary measure, not a W3C standard. It comes from the unmodified `apca-w3` package by Andrew Somers (Myndex), used under its W3 License for Compliant Code Only. Its dependency `colorparsley` is AGPL-3.0, used only by the tests and never shipped in the package.

| Pair                                                                                     | Floor           |
| ---------------------------------------------------------------------------------------- | --------------- |
| Body text — base on Ground or a Terrace, including Terrace text drawn straight on Ground | Lc 75 and 4.5:1 |
| Every other text role                                                                    | Lc 60 and 4.5:1 |
| Focus-ring colour against its surface                                                    | 3:1 (SC 1.4.11) |
| Text-input underline against its fill and against Ground                                 | 3:1 (SC 1.4.11) |

`src/lib/tokens/contrast.test.ts` checks every pair in both themes on each `pnpm test`, reading the built `tokens.css`, and fails when that file is out of date with the JSON sources.

Rendered components are checked too. `pnpm test` runs every Storybook story through axe-core (WCAG 2.0 to 2.2 A and AA rules) in headless Chromium, once each in light, dark and OS dark. The gate is report-only by default while the known checkbox-name violations are open (#50) and switches to failing once they are fixed. Meanwhile a component whose stories are already clean opts in to failing in its stories file, as `gv-menu-item` does. Two more local checks keep it honest:

- `pnpm test:a11y-canary` passes only when a story with two planted contrast failures, one inside a shadow root, fails in all three themes.
- `pnpm test:storybook-static` builds the static Storybook and fails if any story ships an undefined or un-upgraded `gv-*` element.

A green run covers only what axe can detect. It is not a conformance claim.

- **Large display type.** APCA suggests Lc 90 as a maximum for very large, bold text and large areas of colour — one more reason Ground text at night is Chalk, not Parchment.
- **Links in running text** are not distinct enough from body text to rely on colour alone (WCAG 1.4.1; technique G183 needs 3:1 against the surrounding text). Underline them.
- **Input boundaries.** A text input's resting underline uses `border-around/{track}/summit`, which holds 3:1 against both the fill and Ground in both themes. `border-around/{track}/terrace` stays for decorative edges.

### SVG Primitives

Illustrations and isotypes may use primitives (see [When to Use Primitives vs Semantic Tokens](#when-to-use-primitives-vs-semantic-tokens)), but primitives don't change with the theme. Pair both tones in `light-dark()` so the artwork follows it. `gv-isotype`'s default `tone="auto"` does exactly that, and falls back to the light tone where `light-dark()` isn't supported.

### Theme Legend

The night keeps Grove's woodland story, told through the druid's grove of D&D lore:

| Token                                                     | Reads as                                                                                     |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Nightwood** (`base/night`)                              | The druid's grove after dusk — dark, but still green; never the void.                        |
| **Chalk and Parchment**                                   | Moonlight: soft enough to read by, never glaring.                                            |
| **Orchid focus ring** (`accent/300`)                      | _Faerie Fire_, the druid spell that outlines what it touches in blue, green or violet light. |
| **Lilac and Sky links** (`accent/100`, `information/100`) | Faerie light: violet for the path not yet walked, blue-white for the path already taken.     |
| **Aurora hover** (`{track}/500`)                          | Grove Grass waking under your hand — at night, a touched surface brightens.                  |
| **Selection**                                             | A violet haze over the chosen words.                                                         |

---

## Component Behaviour

Every `gv-*` component adopts `componentReset` first in its shadow root, and so does any consumer component that imports the public export. It carries two host-level guarantees.

### Hidden

`hidden` hides any Grove element, as it does on a `<div>`, and removing it brings the element back unchanged. The rule is `!important`, so it also wins against a page rule that sets `display` on the host (`gv-title { display: grid }`). That is stronger than on native elements, on purpose: `hidden` is always dependable. `hidden="until-found"` keeps the browser's own behaviour.

### Reduced Motion

With `prefers-reduced-motion: reduce`, every transition and animation inside a Grove shadow root ends instantly, with the same end colours, shadows and visibility. Durations become `0.01ms` rather than `0s`, so `transitionend` still fires, delays drop to `0s`, and animations run once. Timers aren't motion: `gv-color-swatch`'s three-second "Copied!" hold keeps its length. The rule never reaches a page's own light DOM.

A component that needs a gentler alternative instead of no transition at all declares its own `!important` rule on a class selector inside `@media (prefers-reduced-motion: reduce)`. It is more specific than the reset's `*`, so it wins.

### Focus

Every focusable Grove control draws the focus ring of the **surface it sits on**, on `:focus-visible`, around the element inside its shadow root that takes focus. The ring is a `--ring-on-*` token: a 4px gap in the surface colour, then a 4px ring, at 3:1 or more against the surface in both themes.

| Surface the control sits on | Ring                                       |
| --------------------------- | ------------------------------------------ |
| Ground                      | `--ring-on-ground`                         |
| `{track}` Terrace           | `--ring-on-{track}-terrace`                |
| Brand or Gray Path          | `--ring-on-{brand\|gray}-path`             |
| `{track}` Summit            | `--ring-on-{track}-summit`                 |
| Aurora                      | the ring of the resting surface underneath |

- **Declaring a surface.** Paint a section with a `.gv-surface-{surface}` class from `grove.css` (background, text and ring together), or set `--gv-focus-ring: var(--ring-on-…)` next to your own background. Surface names follow the `GroveSurface` type in token spelling. The property inherits into every Grove control inside, nested components included, and the innermost declaration wins.
- **Defaults.** With no declaration, controls use the Ground ring; `gv-menu-item` uses the Brand Terrace ring its parent paints, through its private `--_ring-default` property. A `[data-theme]` island starts again from its own Ground ring.
- **Aurora.** Aurora is a transient highlight, so its classes don't declare a ring. Over an aurora section a control keeps the resting surface's ring. The terrace and path rings fall below 3:1 against their track's aurora fill (recorded, not gated, in `contrast.test.ts`).
- **Drop shadows.** Controls with a drop shadow keep it: the ring is drawn over it. A component sets its shadow through the private `--_drop` property, never `box-shadow` directly, because the ring rule writes `box-shadow` and would replace it.
- **Forced colours.** The ring is a box-shadow, which forced colours remove; a transparent outline in the same rule then shows in the system colour.
- **Never suppress it.** No component sets `outline: none`, and a test enforces it. Custom components can adopt the `focusRing` fragment and the `gv-focusable` class.

### Content and Slots

Text-bearing components take their text as content, projected through a `<slot>`, so it is in the server HTML and names the control it sits in. The string property is the fallback.

| Component           | Slot                           | Fallback property    |
| ------------------- | ------------------------------ | -------------------- |
| `gv-button`         | default                        | `text`               |
| `gv-checkbox`       | default, inside the control    | none                 |
| `gv-title`          | default, inside the `h{level}` | `heading`            |
| `gv-menu-item`      | default, inside the link       | `label`              |
| `gv-feedback-strip` | `heading`, `message`           | `heading`, `message` |
| `gv-tooltip`        | `heading`, `message`           | `heading`, `message` |

```html
<gv-button>Save changes</gv-button>
<gv-title level="1">Getting started</gv-title>
<gv-feedback-strip type="success">
	<span slot="heading">Changes saved</span>
	<span slot="message">Your <strong>profile</strong> was updated.</span>
</gv-feedback-strip>
```

- **Precedence.** Slotted content wins. With nothing slotted, the property renders, and removing the content brings the property back. Whitespace and comments between the tags don't count as content, so `<gv-button text="Save">` with a line break before its closing tag still shows "Save".
- **Phrasing content only, in these slots.** All six slot-bearing components take text and inline elements (`strong`, `em`, `code`, `a` where the component isn't already a link), never a form control. Four slots sit inside an interactive element or a popup (`gv-button`, `gv-checkbox`, `gv-menu-item`, `gv-tooltip`), where a control can't be nested or reached. `gv-title` and `gv-feedback-strip` are static page chrome by design. Outside production builds, these components log one console warning when a slot holds a control.
- **Containers accept controls.** A slot that is not inside a control and not phrasing-only by design, such as a card body or a form layout, may hold Grove controls and native ones. A slotted control stays in the page's light DOM, so it belongs to the page's form like any other control there (see Forms and Slots).
- **Structure stays with the component.** `gv-title`'s heading element still comes from `level`, and `gv-menu-item`'s link from `href`.
- **Declared.** Each component lists its slots in its metadata (`composition.slots`) and in `custom-elements.json`. A test fails if a component renders a slot it doesn't declare.
- **Before upgrade.** Slotted content is plain light DOM, so it renders before the element is defined and with JavaScript off. Rendering the component's own markup on the server (Declarative Shadow DOM) is a separate, later spec.

### Forms and Slots

Grove controls take part in forms the way native controls do: they are form-associated custom elements, built on one shared base. `gv-button` is the first; `gv-checkbox`, `gv-text-input` and `gv-textarea` follow on the same base.

**The rule.** Form association follows the DOM tree, not slots. A control belongs to the `<form>` it sits in, or to the one its `form="id"` names, in its own tree. A slot only changes where the control is shown, so a control slotted into a `<form>` that another component renders in its shadow root has no form.

**Supported compositions.** Each keeps the `<form>` and its controls in one tree.

```html
<!-- A shell component around a light-DOM form: the form is slotted whole -->
<page-section>
	<form action="/contact" method="post">
		<label>Email <input name="email" type="email" required /></label>
		<gv-button type="submit">Send</gv-button>
	</form>
</page-section>

<!-- A layout component inside a form: its slotted controls are still the form's children -->
<form>
	<two-columns>
		<input name="first" />
		<gv-button type="submit">Send</gv-button>
	</two-columns>
</form>
```

A Lit component that renders the `<form>` and its controls in the same template is the third.

**Unsupported.** A component that renders `<form>` in its shadow root and takes its controls through a slot. The controls have no form: submit and reset do nothing, validation and `<fieldset disabled>` skip them, and Enter doesn't submit. Outside production builds, a `type="submit"` or `type="reset"` `gv-button` with no form logs one warning on its first click, naming the component whose shadow root holds the `<form>`. Listeners for `input` or `gv-change` on that `<form>` do hear slotted controls, because events cross slots, but that only moves data: the form still doesn't own them.

**Submit and reset.**

- `<gv-button type="submit">` submits its form like a native submit button: validation first, then a cancelable `submit` event. `type="reset"` resets it. The default `type="button"` does nothing in the form.
- The form acts once the click has finished propagating, so a click listener anywhere, `window` included, can cancel it with `preventDefault()`. `el.click()` submits in the next task.
- `name` and `value`: a named submit button adds its pair to the form data built during its own submission, natively or with `new FormData(form)` in a `submit` listener. Data built later, after an `await`, doesn't have it. `event.submitter` is `null`, and there is no `formaction` family.
- `disabled`, or a `<fieldset disabled>` around the button (outside its first `<legend>`), blocks both. The fieldset doesn't write the `disabled` property.

**Enter.** When a form has no native submit button (`<button>`, `<input type="submit">` or `<input type="image">`), Enter in a text field activates the first rendered `type="submit"` `gv-button` in source order. A disabled one blocks Enter, as a disabled native default button does. To veto Enter, cancel the `keydown` on the field, on the form or an ancestor in its tree, or in the capture phase; a `window` listener runs too late.

**Self-disable.** After a submission it started has fired `submit`, `gv-button` sets its own `disabled` and matches `:state(submitting)`, so a double click or a second Enter sends nothing. It is enabled again when the page sets `disabled = false`, when the form is reset, or when the page comes back from the back/forward cache. A page that handles the submission itself owns the request, so it re-enables the button when the request settles:

```ts
@query('gv-button[type=submit]') private _send!: Button;
@query('#status') private _status!: HTMLElement; // a status message with tabindex="-1"

private async _onSubmit(event: SubmitEvent) {
	event.preventDefault();
	const data = new FormData(event.target as HTMLFormElement); // at once, before any await
	try {
		await fetch('/contact', { method: 'POST', body: data });
		this._status.focus(); // focus left the disabled button for the page body
	} finally {
		this._send.disabled = false;
	}
}
```

Without that last line, a form used more than once without a page load (search, filters, "add item") keeps a dead button. `form.querySelector(':state(submitting)')` finds the button too.

**Links in forms.** A `gv-button` with `href` is a link: it never submits, resets or handles Enter, whatever its `type`. It is still listed in `form.elements`, and inside a `<fieldset disabled>` it stays a working link while its host matches `:disabled`, so style its disabled look with `gv-button[disabled]`, not `:disabled`.

---

_Grove Design System — Where living systems take root._
