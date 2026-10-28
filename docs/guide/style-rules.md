# Style rules

> **What you learn here**
>
> - The rules that every page of this guide follows.
> - How to write a Lit box, an open-work box, a diagram and a citation.
> - What to do when an open PR or issue lands.
>
> **Read first:** nothing. **Time:** 15 minutes.

Use these rules when you change any page in `docs/guide/`. They keep the guide easy to read for a
reader whose first language is not English.

## The STE standard

This guide uses the rules for text of ASD-STE100 Issue 9 (15 January 2025). Nobody checked the
guide against the STE dictionary.
[Source: ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/)

The STE dictionary is free, but you must ask for it. Thus the guide does not claim full conformance
to the standard. It applies the rules below.

## Words

- Use one word for one meaning. Use the term that [the glossary](glossary.md) gives.
- You can use technical names (TN). A technical name is a code identifier, a file name, a product
  name or a term from the web platform. Examples are `LitElement`, `tokens.css` and "shadow root".
- You can use technical verbs (TV). A technical verb names a process that a computer does, for
  example render, dispatch, compile, bundle and reflect.
- Do not use a technical name as a verb. Write "put the text in the slot", not "slot the text".
- Do not use a technical verb as a noun.
- Do not use the `-ing` form of a verb, except in a technical name such as "padding".
- Use simple words. Write "use", not "utilize". Write "start", not "commence".
- Do not use phrasal verbs, such as "set up" or "look into", when a single verb is available.
- Use a maximum of three words in a noun cluster. Technical names do not count.

The glossary tags each term as TN or TV.

## Sentences

- Write one instruction in each step, unless the actions occur at the same time.
- Write instructions in the imperative: "Run the tests."
- Use the active voice in steps. Use the active voice as much as possible in descriptions.
- Do not remove the words "the" and "a".
- Use a maximum of 20 words in a step. Use a maximum of 25 words in a description.
- Write one topic in each sentence.
- Use a maximum of six sentences in a paragraph.
- Use the simple present tense, unless the text is about the past or the future.

## Procedures and callouts

Write a procedure as numbered steps. Put the result after the step that causes it.

GitHub shows a blockquote that starts with a marker as a callout.
[Source: GitHub Docs, Alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)
This guide uses four markers:

| Marker           | Use it for                                            |
| ---------------- | ----------------------------------------------------- |
| `> [!CAUTION]`   | A risk of damage to the build, to data or to the repo |
| `> [!TIP]`       | A shortcut                                            |
| `> [!NOTE]`      | A Lit box                                             |
| `> [!IMPORTANT]` | An open-work box                                      |

Put a caution before the step that it applies to. Start the caution with a command. The guide does
not use `> [!WARNING]`, because no step in this repo can cause an injury.

Put each callout at the top level of the page. Do not put a callout in a list, in another
blockquote or in a `<details>` block, because GitHub does not show it there.

## Lit boxes

A Lit box explains one Lit idea at the place where Grove uses it. It has two to five sentences, one
real line from Grove with its file and symbol, and one link to the Lit 3 docs.

```markdown
> [!NOTE]
> **Lit box: reactive properties**
>
> A reactive property is a class field that Lit watches. When its value changes, Lit renders the
> component again. Grove example, `Button.ts`, `disabled`:
> `@property({ type: Boolean, reflect: true }) disabled = false;`
>
> Lit docs: [Reactive properties](https://lit.dev/docs/v3/components/properties/)
```

Always link to `https://lit.dev/docs/v3/`, not to `https://lit.dev/docs/`. The `v3` path does not
move when a new major version of Lit comes out.

## Open-work boxes

An open-work box connects a concept to an open PR or issue. The concept itself goes in the body of
the chapter. The box tells the reader what the item proposes and what changes when it lands.

```markdown
> [!IMPORTANT]
> **Open work: #68 — gv-button link mode and form association** (open PR, no conflict with main on
> 2026-10-27)
>
> What it proposes. The nuance or the trap. The decisions that apply (for example #49 C1, #40 OD2).
> What changes in this chapter when it lands.
> <https://github.com/edgarjaymez/grove-lit/pull/68>
```

Obey these rules:

- Start the bold text with `Open work: #N`. Then this command finds every box for an item:
  `grep -rn "Open work: #68" docs/guide`.
- Do not put a date in the box. The purpose block of each chapter has one line that dates all of
  its boxes: `Open work as of main @ <sha>, <date>.`
- Write a decision code with its issue number: `#49 L2`, `#50 R3`, `#51 F4`, `#54 D1`. Many issues
  use the same letters, so a code without its issue is not clear.
- Use only a status that you can check on GitHub:

| Status                                          | Meaning                                                  |
| ----------------------------------------------- | -------------------------------------------------------- |
| `merged`                                        | The PR is on `main`                                      |
| `open PR, no conflict with main on <date>`      | GitHub found no git conflict with `main` on that date    |
| `branch, no PR`                                 | The work is on a branch, and nobody opened a PR for it   |
| `issue, open: behaviour on main, checks remain` | The code is on `main`; manual or follow-up checks remain |
| `issue, blocked: Needs Figma Spec`              | The issue waits for an answer from the Figma design      |
| `issue, blocked: <decision>`                    | The issue waits for a decision that the issue names      |
| `issue, not started`                            | No code exists for the issue                             |
| `closed`                                        | The issue is closed                                      |

Do not write "ready to merge". This repo has no CI, so "no conflict" does not mean "the tests pass".
Refer to [Mergeable and approved](21-house-rules-and-how-work-moves.md#mergeable-and-approved).

## When open work lands

Do these steps when a PR merges or an issue closes:

1. Find each box for the item:

   ```sh
   grep -rln "Open work: #68" docs/guide
   ```

2. Get the state of the item:

   ```sh
   gh pr view 68 --json state,mergedAt
   ```

3. In each box, read the text that tells what changes when the item lands.
4. Write that change into the body of the chapter.
5. Delete the box.
6. Update the entry for the item in [the topic index](topic-index.md#open-work-by-number).
7. Update [Known drift](23-known-drift.md) if the item removes or adds drift.
8. Update the `Open work as of main` line of each chapter that you changed.
9. Update the lab for the item in [the syllabus](syllabus.md), if the lab uses the item.

A lab pins the item to a commit. Thus a lab still works after its PR merges or after somebody
deletes its branch.

## Diagrams

- Use Mermaid `flowchart` or `sequenceDiagram` only.
  [Source: GitHub Docs, Creating diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
- Use Mermaid version 10 syntax. Do not use the version 11 shape syntax `A@{ shape: … }`.
- Put quotes around a label that contains `@`, `#` or `:`.
- Give each diagram an `accTitle` and an `accDescr`.
  [Source: Mermaid accessibility options](https://mermaid.js.org/config/accessibility.html)
- Put one sentence before the diagram that tells what the diagram shows. A screen reader user gets
  the same information from that sentence.
- Write the labels in STE.

## Headings and links

- Use only letters, numbers, spaces and hyphens in a `##` heading. Do not use backticks or other
  punctuation. Then the anchor of the heading is easy to predict.
- Do not change a `##` heading. Other pages link to it.
- Link to a `##` heading, or to a lesson heading in the syllabus.
- Use relative links between pages, for example `[Slots](07-slots.md#prop-or-slot)`.

## Code and references

- Copy code from the repo exactly. Name the file above the code block.
- Label code that is not from the repo as "Example".
- Refer to a file and a symbol, for example "`Button.ts`, `render()`". Do not refer to a line
  number, because line numbers change.
- Put a line break in prose before column 100. Tables, URLs and code blocks can be longer.

## Facts

- Take each fact from the code, from GitHub or from an official source.
- When the guide cannot confirm a fact, write that it is not confirmed. Then name the check that
  can confirm it.
- The order of trust is in [When two sources disagree](README.md#when-two-sources-disagree).

## Citations

Each chapter cites official sources for claims about the web platform, accessibility, file formats
and tools.

**Where a citation goes**

- Each Lit box ends with one link to the Lit 3 docs.
- A claim about the platform, accessibility, a format or a tool gets one inline link. Put the link
  at the end of the sentence, the first time that the chapter makes the claim:
  `[Source: <title>](<url>)`.
- Each chapter ends with `## Sources`. It lists every link that the chapter uses, in three groups:
  Standards, Platform reference and Tool docs. Give the date that you read each source.
- A fact about the repo cites a file and a symbol. A fact about open work cites its issue or PR.
  These facts do not need an external source.

**Which source to use.** Use the first source in this list that has the fact:

1. A normative specification. These are the WHATWG HTML and DOM standards, and the DTCG Format
   Module 2025.10. W3C Recommendations are normative too, for example WCAG 2.2, WAI-ARIA 1.2,
   accname 1.2, HTML-AAM and the CSS specifications.
2. A W3C WAI page that is not normative: Understanding WCAG 2.2, the WCAG techniques, the
   "ARIA Authoring Practices Guide".
3. The official docs of a tool, for the version in `package.json`. These are lit.dev v3, vite.dev,
   vitest.dev, storybook.js.org, terrazzo.app and custom-elements-manifest.open-wc.org. Also
   playwright.dev, pnpm.io, docs.npmjs.com, nodejs.org, publint.dev and mermaid.js.org. Also
   docs.github.com, git-scm.com, cli.github.com and docs.astro.build.
4. MDN Web Docs, for browser behaviour and support. When the claim is normative, add a link to the
   specification also.
5. A proposal or an explainer. Label it "proposal, not shipped".
6. A secondary source, such as web.dev, only when sources 1 to 5 do not have the fact. Label it
   "secondary".

**Versions**

- Write "WCAG 2.2", not "WCAG". Use the `/WAI/WCAG22/` and `/TR/WCAG22/` URLs.
- Write each WCAG success criterion with its number, its name and its level, for example
  "2.5.8 Target Size (Minimum) (AA)".
- Use `https://lit.dev/docs/v3/` for Lit and `https://www.designtokens.org/tr/2025.10/` for DTCG.
- The Storybook site shows only the latest Storybook 10 docs. Write "Storybook 10 docs (read
  <date>)".
- APCA is a supplementary measure. It is not a W3C standard.

**Format**

- Use the final URL after all redirects. Do not add parameters that track the reader.
- Add a `#fragment` only when the target page has an element with that `id`.

## Links last checked

The maintainer checked every external link in this guide on 2026-10-27.

## Sources

**Standards**

- [ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/), Issue 9. Read 2026-10-27.

**Tool docs**

- [GitHub Docs, Alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts).
  Read 2026-10-27.
- [GitHub Docs, Creating diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams).
  Read 2026-10-27.
- [GitHub Docs, Collapsed sections](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections).
  Read 2026-10-27.
- [Mermaid accessibility options](https://mermaid.js.org/config/accessibility.html). Read
  2026-10-27.
- [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html). Read 2026-10-27.
- [Mermaid sequence diagram syntax](https://mermaid.js.org/syntax/sequenceDiagram.html). Read
  2026-10-27.
- [github-slugger](https://github.com/Flet/github-slugger), the rule that GitHub uses to make
  heading anchors. Read 2026-10-27.

[Index](README.md)
