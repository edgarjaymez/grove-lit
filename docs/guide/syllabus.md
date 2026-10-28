# Syllabus

> **What you learn here**
>
> - A path through the guide in 17 lessons, from the map of the repo to a capstone.
> - For each lesson: the goals, the chapters to read, a core exercise on `main` and a lab on open
>   work.
> - How to check yourself after each lesson.
>
> **Read first:** [00 · The whiteboard](00-the-whiteboard.md). **Time:** each lesson gives its
> own time.
>
> Open work as of main @ e251d45, 2026-10-27.

Each lesson has the same parts: a purpose, the goals, the chapters and files to read, an exercise,
an open-work lab and some questions. Do the lessons in order. Each lesson uses the lessons before
it.

The exercise uses `main`. The lab uses an open PR, a work branch or an issue. Each lab pins the
item to a commit, so the lab still works after the PR merges or after somebody deletes its branch.
Each step tells you the result that you must see. A result can show a different time or a
different path on your machine.

## Before you start

Do these steps one time, before Lesson 0.

### Install and check the browser

1. Clone the repo and go into its folder:

   ```sh
   git clone https://github.com/edgarjaymez/grove-lit.git
   cd grove-lit
   ```

2. Install the dependencies:

   ```sh
   pnpm install --frozen-lockfile
   ```

   [Source: pnpm, pnpm install](https://pnpm.io/cli/install#--frozen-lockfile)

3. Run `git status --short`.

   Result: no output. If the list shows `pnpm-workspace.yaml`, the install changed it. Restore it
   with `git restore pnpm-workspace.yaml`.

4. Install the Chromium browser for the tests:

   ```sh
   pnpm exec playwright install chromium
   ```

   [Source: Playwright, Browsers](https://playwright.dev/docs/browsers)

   Result: Playwright downloads Chromium, or it does nothing because Chromium is already there.

These commands need Chromium: `pnpm test`, `pnpm test:a11y-canary`,
`pnpm test:storybook-static`, and each `pnpm vitest run --project browser …` or
`pnpm vitest run --project storybook …`.

The lessons run Vitest with `pnpm vitest run …` or `pnpm test`. The command `pnpm test:unit` can
start watch mode in a terminal. [17 · Tests](17-tests.md#watch-mode-and-agents) tells when.

### Make a practice branch

Do the exercises on a practice branch, never on `main`.

1. Make the branch:

   ```sh
   git switch -c practice/<name>
   ```

   [Source: Git, git-switch](https://git-scm.com/docs/git-switch)

   Result: `Switched to a new branch 'practice/<name>'`.

2. When a lesson tells you to throw your changes away, restore the tracked files:

   ```sh
   git restore .
   ```

   [Source: Git, git-restore](https://git-scm.com/docs/git-restore)

   `git checkout -- .` does the same work.

3. Remove each file that you made, for example `rm src/practice.browser.test.ts`. `git restore`
   does not remove a file that git does not track.

4. After `pnpm build`, restore the generated tokens if you did not change a token JSON file:

   ```sh
   git checkout -- src/lib/tokens/tokens.css
   ```

5. When you finish the syllabus, delete the branch:

   ```sh
   git switch main
   git branch -D practice/<name>
   ```

### Check out a PR at a pinned commit

A lab uses a PR at a fixed commit. The commit does not change when somebody pushes to the PR.

1. Fetch the head of the PR, for example PR #68:

   ```sh
   git fetch origin pull/68/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach ccba0a3
   ```

   Result: `HEAD is now at ccba0a3 feat(gv-menu-item): forward target and rel`.

3. Compare the lock file with `main`:

   ```sh
   git diff --stat main -- pnpm-lock.yaml
   ```

   Result: no output for the labs in Lessons 0 to 8. If the command lists the file, run
   `pnpm install --frozen-lockfile`.

4. Do the lab. Then restore each file that you changed with `git restore .`.

5. Go back to your branch:

   ```sh
   git switch practice/<name>
   ```

   `git switch -` also goes back, if your last switch was from the practice branch.

An untracked file, such as a practice test, stays in the folder when you switch. Thus you can run
the same practice test at the PR commit and on your branch.

Do not use `gh pr checkout`. It makes a local branch that follows the PR, and the PR can change.
Each lab gives a fixed commit instead. Any branch name that a command prints is shown in this
syllabus as `<PR branch>`.

| Item                | Pinned commit |
| ------------------- | ------------- |
| PR #63              | `07d3d75`     |
| PR #64              | `631bcd1`     |
| PR #65              | `80c3060`     |
| PR #66              | `c29308e`     |
| PR #68              | `ccba0a3`     |
| The #50 work branch | `ef5865a`     |

The #50 work has a branch but no PR. GitHub has no `pull/N/head` ref for it. Open
[epic #50](https://github.com/edgarjaymez/grove-lit/issues/50), find the branch link in its
"Branch" section, and fetch that branch:

```sh
git fetch origin <branch from the epic>
git switch --detach ef5865a
```

### The practice test file

Many exercises ask you to write `src/practice.browser.test.ts`. The `browser` Vitest project runs
every `src/**/*.browser.test.ts` file in Chromium. Run the file alone:

```sh
pnpm vitest run --project browser src/practice.browser.test.ts
```

Delete the file at the end of each lesson. Never commit it.

## Progress checklist

Copy this list into your notes, and tick each lesson when you can answer all of its questions.

- [ ] Lesson 0 Find your way
- [ ] Lesson 1 Web components
- [ ] Lesson 2 Lit
- [ ] Lesson 3 Read a component
- [ ] Lesson 4 Styles
- [ ] Lesson 5 Slots
- [ ] Lesson 6 Events
- [ ] Lesson 7 Accessibility
- [ ] Lesson 8 Forms
- [ ] Lesson 9 Tokens
- [ ] Lesson 10 Surfaces and themes
- [ ] Lesson 11 Focus ring
- [ ] Lesson 12 Metadata and manifest
- [ ] Lesson 13 Storybook and tests
- [ ] Lesson 14 Build and release
- [ ] Lesson 15 Use Grove in an app
- [ ] Lesson 16 Capstone

## Module 0 Orientation

### Lesson 0 Find your way

Learn the map of the repo and the order of the open work. **Time:** 75 minutes.

**Goals**

- After this lesson, you can name the five sources that you edit and the files that go to npm.
- After this lesson, you can tell which folder becomes the package and which folders are tools.
- After this lesson, you can name the two export lists that a new component joins.
- After this lesson, you can read the roadmap in #54 and draw one chain of open items.

**Read**

- [00 · The whiteboard](00-the-whiteboard.md#whiteboard), all sections, and the
  [work in motion](00-the-whiteboard.md#the-work-in-motion).
- [01 · Repo map](01-repo-map.md#the-tree), all sections.
- Files: `package.json`, `src/lib/index.ts`, `src/lib/components/index.ts`,
  `src/test/grove-tags.ts`.

**Exercise**

1. Switch to your practice branch.
2. List the component folder:

   ```sh
   ls src/lib/components
   ```

   Result: 15 directories, from `BackButton` to `Tooltip`, plus `index.ts`, `metadata.test.ts` and
   `metadata.ts`.

3. Count the lines of the barrel:

   ```sh
   grep -c "export \* from" src/lib/components/index.ts
   ```

   Result: `15`.

4. Find the Button lines in the package entry:

   ```sh
   grep -n "Button" src/lib/index.ts
   ```

   Result: six lines. Two export `BackButton` and `BackButtonMetadata`, two export `Button` and
   `ButtonMetadata`, and two export `IconButton` and `IconButtonMetadata`.

5. Show the paths that npm puts into the package:

   ```sh
   node -e "console.log(require('./package.json').files)"
   ```

   Result: `[ 'dist', '!dist/**/*.test.*', '!dist/**/*.spec.*' ]`.

6. Count the files of the generated AI index:

   ```sh
   git ls-files src/.ai | wc -l
   ```

   Result: `7`.

> [!CAUTION]
> Restore `src/lib/tokens/tokens.css` after the next step, if you did not change a token JSON file.
> `pnpm build` runs `build-tokens` first, and Terrazzo can rewrite the file with no real change.

7. Run the full build:

   ```sh
   pnpm build
   ```

   Result: the last two lines are `[grove] wrote dist/types/astro.d.ts (15 elements)` and
   `[grove] manifest matches the sources (15 elements)`.

8. List the build output with `ls dist`.

   Result: `components`, `components-since.json`, `custom-elements.json`, `events.d.ts`, `fonts`,
   `index.d.ts`, `index.js`, `styles`, `surfaces.d.ts`, `tokens`, `types`, and the `.map` files.

9. Run `git status --short`.

   Result: no output, because `.gitignore` excludes `dist/`. If the list shows
   `src/lib/tokens/tokens.css`, the build rewrote it. Restore it with
   `git checkout -- src/lib/tokens/tokens.css`.

**Open-work lab: the chain from #49 to #17**

This lab uses issues only, so it needs no commit.

1. Read the roadmap:

   ```sh
   gh issue view 54
   ```

   [Source: GitHub CLI, gh issue view](https://cli.github.com/manual/gh_issue_view)

   Result: the title is "[Epic] Roadmap: PR groups, branches and waves for the open specs (#14 to
   #44)", and the state is open.

2. Find the table "PR groups and branches". Do not use the branch column. Find work through its PR
   or its epic.
3. Find the row of the `gv-textarea` spec, #17. Read its "Gated on" column.

   Result: `#51, #22, Figma spec`.

4. Find the row of #51. Read its "Gated on" column.

   Result: `#50, #49, Figma spec`.

5. Find the row of #50. Read its "Gated on" column.

   Result: `the #34 slots PR, #49`.

6. Draw the chain on paper: #49, then #50, then #51, then #17.
7. Read the reason under "Why this order" for #49.

   Result: "#49 lands before #50 and #51: it shares `Button.ts` with #50 and owns the
   implicit-submit helper that #51 calls."

8. Get the state of each item in the chain:

   ```sh
   for n in 49 50 51 17; do gh issue view $n --json number,state,labels; done
   ```

   Result: all four are open. Only #17 has the label `Needs Figma Spec`.

9. Get the state of the PR for #49:

   ```sh
   gh pr view 68 --json state,title
   ```

   Result: the state is `OPEN`, and the title starts with "feat(gv-button): link mode + form
   association".

10. Compare your chain with the board in
    [The work in motion](00-the-whiteboard.md#the-work-in-motion).

If #54 has closed, do the lab on `main` instead: read the closed issue with `gh issue view 54`,
and compare its table with the board in chapter 00.

**Check yourself**

1. Which folder does npm get, and which field of `package.json` says so?

   <details><summary>Answer</summary>

   `dist/`. The `files` field lists `dist` and excludes the test files in it.

   </details>

2. A new component is in `src/lib/components/index.ts` but not in `src/lib/index.ts`. What
   happens?

   <details><summary>Answer</summary>

   It is not in the package, because Vite builds `dist/index.js` from `src/lib/index.ts`. The
   tests that use `groveTags` also do not see it, because `groveTags` reads the exports of
   `src/lib/index.ts`.

   </details>

3. Which two generated outputs are in git, and why?

   <details><summary>Answer</summary>

   `src/lib/tokens/tokens.css` and `src/.ai/`. Other tools read them with no build: Storybook,
   the Vercel deploy and the unit tests read `tokens.css`.

   </details>

4. Why does #44 wait for #49?

   <details><summary>Answer</summary>

   Both change `Button.ts`. #44 also waits for its Figma design.

   </details>

5. Why is "no conflict with main" not the same as "the tests pass" in this repo?

   <details><summary>Answer</summary>

   The repo has no CI. No workflow runs on a PR, so GitHub checks only for git conflicts. You must
   run the checks on your machine.

   </details>

## Module 1 Foundations

### Lesson 1 Web components

See upgrade, shadow DOM and ID references in a real browser. **Time:** 60 minutes.

**Goals**

- After this lesson, you can tell what a custom element is before and after its upgrade.
- After this lesson, you can find markup inside a shadow root from a test.
- After this lesson, you can explain why a page `<label for>` does not find an ID in a shadow
  root.
- After this lesson, you can explain why an element in an inert document stays undefined.

**Read**

- [02 · Web components](02-web-components.md#custom-elements), all sections.
- Files: `src/lib/components/Button/Button.ts`, `src/lib/components/TextInput/TextInput.ts`,
  `src/lib/styles/host-hidden.browser.test.ts`.

**Exercise**

1. Switch to your practice branch.
2. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { expect, it } from 'vitest';

   type LitHost = HTMLElement & { updateComplete: Promise<unknown> };

   it('upgrades gv-button when its module loads', async () => {
   	document.body.innerHTML = '<gv-button>Save</gv-button>';
   	const el = document.querySelector('gv-button') as LitHost;
   	expect(el.matches(':defined')).toBe(false);
   	expect(el.shadowRoot).toBeNull();

   	await import('./lib/components/Button/Button.js');
   	expect(el.matches(':defined')).toBe(true);
   	await el.updateComplete;
   	expect(document.querySelector('.btn')).toBeNull();
   	expect(el.shadowRoot?.querySelector('.btn')).not.toBeNull();
   });

   it('does not let a page label find an id in a shadow root', async () => {
   	await import('./lib/components/TextInput/TextInput.js');
   	document.body.innerHTML =
   		'<label for="email">Email</label><gv-text-input input-id="email"></gv-text-input>';
   	const field = document.querySelector('gv-text-input') as LitHost;
   	await field.updateComplete;
   	expect(field.shadowRoot?.querySelector('#email')).not.toBeNull();
   	expect(document.querySelector('label')?.control).toBeNull();
   });
   ```

3. Read the first test. The file does not import Grove at the top, so `gv-button` is not
   registered when the test starts.
4. Read the second test. `label.control` is the control that a label names, or `null`.
   [Source: MDN, HTMLLabelElement: control property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control)
5. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  2 passed (2)`. The input with the ID `email` exists, but the page label cannot
   find it.

6. Run `pnpm check`.

   Result: `tsc --noEmit` prints no error.

7. Delete `src/practice.browser.test.ts`.

**Open-work lab: #66, an upgrade from an inert document**

1. Fetch PR #66:

   ```sh
   git fetch origin pull/66/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach c29308e
   ```

   Result: `HEAD is now at c29308e docs: leave src/test/shadow.ts to #64's repo map and test guide
entries`.

3. Open `src/lib/styles/host-hidden.browser.test.ts`, and find the test "stays hidden through
   upgrade".
4. Run that test:

   ```sh
   pnpm vitest run --project browser src/lib/styles/host-hidden.browser.test.ts -t "stays hidden through upgrade"
   ```

   Result: `Tests  45 passed | 181 skipped (226)`. The test runs for 15 tags in 3 themes.

5. In the test, put `//` before the line `document.body.append(el);`.
6. Run the same command again.

   Result: `Tests  45 failed | 181 skipped (226)`, with
   `AssertionError: expected null not to be null`. Without the append, the element has no shadow
   root.

7. Restore the file:

   ```sh
   git restore src/lib/styles/host-hidden.browser.test.ts
   ```

8. Write two sentences in your notes. Why does the element stay undefined in the inert document?
   What upgrades it?
9. Go back to your practice branch.

If #66 has merged, do the lab on `main` instead: the test "stays hidden through upgrade" is then
in `src/lib/styles/host-hidden.browser.test.ts` on `main`.

**Check yourself**

1. What crosses a shadow boundary into a component? What crosses out?

   <details><summary>Answer</summary>

   Inherited CSS properties, every custom property and the light DOM children (through a slot) go
   in. An event with `composed: true` goes out, retargeted to the host.

   </details>

2. Why does `<label for="email">` in the page not name the input inside `gv-text-input`?

   <details><summary>Answer</summary>

   An ID reference looks only in its own tree. The input with the ID `email` is in the shadow
   root, and the label is in the document tree. Thus `label.control` is `null`.

   </details>

3. Why does the element in the #66 test stay undefined until the test appends it?

   <details><summary>Answer</summary>

   A document from `createHTMLDocument('')` has no browsing context, so it does not upgrade custom
   elements. When the test appends the element to the live document, the browser upgrades it.

   </details>

4. Before its upgrade, what does `<gv-button>Save</gv-button>` show?

   <details><summary>Answer</summary>

   Only its light DOM text, "Save". It has no shadow root yet. The CSS pseudo-class `:defined`
   does not match it.

   </details>

5. Which part of the browser reads `<template shadowrootmode="open">`?

   <details><summary>Answer</summary>

   The HTML parser, when the page loads. Script that sets `innerHTML` does not make a shadow root
   from it.

   </details>

### Lesson 2 Lit

See attributes, reflection and the update cycle work, and see why the form work needs a mixin.
**Time:** 75 minutes.

**Goals**

- After this lesson, you can predict the attribute name of a reactive property.
- After this lesson, you can explain why a Boolean attribute works by presence.
- After this lesson, you can tell when a reflected attribute and the shadow root change.
- After this lesson, you can explain what breaks when `useDefineForClassFields` is `true`.
- After this lesson, you can explain why `FormControl` in #68 is a mixin and not a controller.

**Read**

- [03 · Lit essentials](03-lit-essentials.md#litelement-and-the-decorators), all sections.
- Files: `src/lib/components/ToDoListItem/ToDoListItem.ts`,
  `src/lib/components/Checkbox/Checkbox.ts`, `src/lib/utils/slot-content.ts`, `tsconfig.json`.

**Exercise**

1. Switch to your practice branch.
2. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import './lib/index.js';
   import type { Checkbox, ToDoListItem } from './lib/index.js';

   afterEach(() => document.body.replaceChildren());

   it('reads an attribute by presence', async () => {
   	document.body.innerHTML = '<gv-todo-list-item is-done="false"></gv-todo-list-item>';
   	const item = document.querySelector('gv-todo-list-item') as ToDoListItem;
   	expect(item.isDone).toBe(true);
   });

   it('ignores the lowercase attribute name', async () => {
   	document.body.innerHTML = '<gv-todo-list-item isdone></gv-todo-list-item>';
   	const item = document.querySelector('gv-todo-list-item') as ToDoListItem;
   	expect(item.isDone).toBe(false);
   });

   it('reflects the property after the update', async () => {
   	const item = document.body.appendChild(document.createElement('gv-todo-list-item'));
   	item.isDone = true;
   	expect(item.hasAttribute('is-done')).toBe(false);
   	await item.updateComplete;
   	expect(item.hasAttribute('is-done')).toBe(true);
   });

   it('dispatches gv-change before the render', async () => {
   	const box = document.body.appendChild(document.createElement('gv-checkbox')) as Checkbox;
   	await box.updateComplete;
   	const inner = box.shadowRoot!.querySelector('button')!;
   	let seen = '';
   	box.addEventListener('gv-change', () => {
   		seen = `${box.checked} ${inner.getAttribute('aria-checked')}`;
   	});
   	inner.click();
   	expect(seen).toBe('true false');
   	await box.updateComplete;
   	expect(inner.getAttribute('aria-checked')).toBe('true');
   });
   ```

3. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  4 passed (4)`. `is-done="false"` gives `true`, and `isdone` does nothing. The
   attribute and the shadow root change only after `updateComplete`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `tsconfig.json`. Restore the file in step 6.

4. In `tsconfig.json`, change `"useDefineForClassFields": false` to
   `"useDefineForClassFields": true`.
5. Run the file again.

   Result: two tests fail. The error starts with "The following properties on element
   gv-todo-list-item will not trigger updates as expected because they are set using class
   fields: heading, category, icon, isDone." Lit finds the class fields that hide its accessors.
   [Source: Lit, Reactive properties](https://lit.dev/docs/v3/components/properties/)

6. Restore the file:

   ```sh
   git restore tsconfig.json
   ```

7. Delete `src/practice.browser.test.ts`.

**Open-work lab: #68, a mixin and a controller**

1. Fetch PR #68:

   ```sh
   git fetch origin pull/68/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach ccba0a3
   ```

   Result: `HEAD is now at ccba0a3 feat(gv-menu-item): forward target and rel`.

3. Compare where the mixin and the controller connect:

   ```sh
   grep -n "static formAssociated\|attachInternals\|addController" src/lib/utils/form-control.ts src/lib/utils/slot-content.ts
   ```

   Result: three lines. `slot-content.ts` calls `host.addController(this)`. `form-control.ts` has
   `static formAssociated = true;` and `this.attachInternals()`.

4. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { expect, it } from 'vitest';
   import './lib/index.js';

   it('reads formAssociated only when the tag is defined', () => {
   	class Early extends HTMLElement {
   		static formAssociated = true;
   	}
   	class Late extends HTMLElement {}
   	customElements.define('practice-early', Early);
   	customElements.define('practice-late', Late);
   	Object.assign(Late, { formAssociated: true });

   	expect(document.createElement('practice-early').attachInternals().form).toBeNull();
   	const late = document.createElement('practice-late').attachInternals();
   	expect(() => late.form).toThrow();
   });

   it('lists gv-button in form.elements', () => {
   	document.body.innerHTML = '<form><gv-button type="submit">Send</gv-button></form>';
   	expect(document.querySelector('form')!.elements.length).toBe(1);
   });
   ```

5. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  2 passed (2)`. `Late` gets `formAssociated` after the definition, so the
   browser treats it as a plain custom element, and `internals.form` throws.

6. Go back to your practice branch. The untracked test file stays.
7. Run the same command again.

   Result: `Tests  1 failed | 1 passed (2)`, with `AssertionError: expected +0 to be 1`. On
   `main`, `gv-button` is not form-associated, so `form.elements` does not list it.

8. Write one sentence in your notes: why must the form code be on the class, and not in a
   controller?
9. Delete `src/practice.browser.test.ts`.

If #68 has merged, do the lab on `main` instead: both tests then pass on `main`.

**Check yourself**

1. Why does `isDone` need `attribute: 'is-done'`?

   <details><summary>Answer</summary>

   By default, Lit uses the property name in lowercase, `isdone`. The house style is kebab case,
   so the code sets the name by hand. The exercise shows that `isdone` does nothing.

   </details>

2. Why does `is-done="false"` give `true`?

   <details><summary>Answer</summary>

   A Boolean attribute works by presence. Any value, `"false"` included, gives `true`.

   </details>

3. A listener on `gv-change` reads the `aria-checked` of the inner button. Why does it see the old
   value?

   <details><summary>Answer</summary>

   `_toggle()` sets `checked` and dispatches the event in the same call. Lit renders later, in a
   microtask. Wait for `updateComplete` before you read the shadow root.

   </details>

4. What breaks when `useDefineForClassFields` is `true`?

   <details><summary>Answer</summary>

   Each class field becomes an own property of the instance. It hides the Lit accessor on the
   prototype, so a write does not start an update. In development, Lit throws an error that names
   the fields.

   </details>

5. Why is `FormControl` in #68 a mixin and not a controller?

   <details><summary>Answer</summary>

   The browser reads `static formAssociated` and the form callbacks from the class when
   `customElements.define()` runs. A controller is a separate object, so the browser never sees
   it. The `Late` class in the lab shows that a change after the definition has no effect.

   </details>

## Module 2 Components

### Lesson 3 Read a component

Walk `Button.ts` stop by stop, and find the same parts in the other components. **Time:** 100
minutes.

**Goals**

- After this lesson, you can find the eight stops in any component file.
- After this lesson, you can name the side-effect imports and the components that need them.
- After this lesson, you can tell a leaf from a composite.
- After this lesson, you can say how #68 changes the walk of `Button.ts`.

**Read**

- [04 · Anatomy of a component](04-anatomy-of-a-component.md#stop-1-imports), all sections.
- [05 · Component catalogue](05-component-catalogue.md#the-catalogue-table), all sections.
- Files: `src/lib/components/Button/Button.ts`, `Button.metadata.ts`, `Button.stories.ts`.

**Exercise**

1. Switch to your practice branch.
2. List the imports of the button:

   ```sh
   grep -n "^import" src/lib/components/Button/Button.ts
   ```

   Result: eight lines. One line, `import '../Icon/Icon.js';`, imports no names.

3. Count the properties:

   ```sh
   grep -c "@property" src/lib/components/Button/Button.ts
   ```

   Result: `8`.

4. Find the property that reflects and the property with a hand-written attribute name:

   ```sh
   grep -n "reflect: true\|attribute:" src/lib/components/Button/Button.ts
   ```

   Result: two lines, `disabled` with `reflect: true` and `ariaLabel` with
   `attribute: 'aria-label'`.

5. List the side-effect imports of all composites:

   ```sh
   grep -rn "^import '\.\./" src/lib/components | grep -v test
   ```

   Result: 11 lines. Nine composites import `../Icon/Icon.js`, `ToDoListItem.ts` also imports
   `../Checkbox/Checkbox.js`, and `ColorSwatch.ts` imports only `../Tooltip/Tooltip.js`.

6. List the files of the button directory:

   ```sh
   git ls-files src/lib/components/Button
   ```

   Result: `Button.metadata.ts`, `Button.stories.ts` and `Button.ts`. The button has no browser
   test file on `main`.

7. Count the categories in the metadata files:

   ```sh
   grep -h "category:" src/lib/components/*/*.metadata.ts | sort | uniq -c
   ```

   Result: `10` atoms and `5` molecules.

8. Run `pnpm build`, if `dist/` is not there from Lesson 0.
9. Read the type of `variant` in the manifest:

   ```sh
   node -e "const m=require('./dist/custom-elements.json');const d=m.modules.flatMap(x=>x.declarations||[]).find(d=>d.tagName==='gv-button');console.log(d.members.find(x=>x.name==='variant').type.text)"
   ```

   Result: `'filled' | 'tonal' | 'outlined' | 'ghost'`. The build changes the alias
   `ButtonVariant` into its union.

10. Restore `src/lib/tokens/tokens.css` if `git status --short` lists it.

**Open-work lab: #68, Button.ts at the PR head**

1. Fetch PR #68, and switch to `ccba0a3`, as in
   [Before you start](#before-you-start).
2. Count the properties again:

   ```sh
   grep -c "@property" src/lib/components/Button/Button.ts
   ```

   Result: `13`. The PR adds `name`, `value`, `href`, `target`, `rel` and `hreflang`. `disabled`
   moves into the `FormControl` mixin.

3. Find the class declaration:

   ```sh
   grep -n "export class" src/lib/components/Button/Button.ts
   ```

   Result: `export class Button extends FormControl(LitElement) {`.

4. Find the new methods between the styles and `render()`:

   ```sh
   grep -n "protected" src/lib/components/Button/Button.ts
   ```

   Result: four hooks, `formRole()`, `renderedControl()`, `submissionValue()` and
   `honoursFormDisabled()`. Each one has an `@internal` comment above it.

5. Count the stories:

   ```sh
   grep -c "^export const" src/lib/components/Button/Button.stories.ts
   ```

   Result: `18`. On `main`, the count is `10`.

6. Show what the PR changes in the button directory:

   ```sh
   git diff --stat e251d45 ccba0a3 -- src/lib/components/Button
   ```

   Result: four files. The new file `Button.browser.test.ts` has 912 lines.

7. Name the new stop in your notes, and write where it goes in the walk.
8. Go back to your practice branch.

If #68 has merged, do the lab on `main` instead: run the same commands on `main`, and compare
the results with the steps of the exercise.

**Check yourself**

1. Why does `Button.ts` import `../Icon/Icon.js` with no names?

   <details><summary>Answer</summary>

   Button renders `<gv-icon>`. The import runs `@customElement('gv-icon')`, which registers the
   tag. The button never uses the `Icon` class by name.

   </details>

2. Which composite has two levels of children, and which module registers the deepest tag?

   <details><summary>Answer</summary>

   `gv-color-swatch` renders `gv-tooltip`, which renders `gv-icon`. `Tooltip.ts` imports
   `../Icon/Icon.js`, so `ColorSwatch.ts` imports only `../Tooltip/Tooltip.js`.
   `gv-todo-list-item` also has two children, `gv-checkbox` and `gv-icon`, but at one level.

   </details>

3. Which three components fire no `gv-*` event, but still give the page a `click`?

   <details><summary>Answer</summary>

   `gv-button`, `gv-icon-button` and `gv-menu-item`. The native `click` of the inner `<button>` or
   `<a>` is composed, so the page gets it on the host.

   </details>

4. What is the new stop in `Button.ts` at the head of #68, and how many stops has the walk then?

   <details><summary>Answer</summary>

   "The form hooks": `formRole()`, `renderedControl()`, `submissionValue()` and
   `honoursFormDisabled()`, before `render()`. The walk then has nine stops.

   </details>

5. Why can `Title.ts` use `unsafeStatic()` with a value that comes from a property?

   <details><summary>Answer</summary>

   `render()` accepts only an integer from 1 to 6 for `level`, and uses `2` for any other value.
   Thus the tag is always `h1` to `h6`, made from a checked number.

   </details>

### Lesson 4 Styles

See the shadow cascade on the host, and see why the `hidden` rule needs `!important`. **Time:**
75 minutes.

**Goals**

- After this lesson, you can predict which declaration wins when the page and a component style
  the host.
- After this lesson, you can explain why `componentReset` uses `!important` and `0.01ms`.
- After this lesson, you can explain why `hidden="until-found"` hides nothing on an inline host.
- After this lesson, you can name the private and public custom properties of a component.

**Read**

- [06 · Styles inside a component](06-styles-inside-a-component.md#static-styles), all sections.
- Files: `src/lib/styles/component-reset.ts`, `src/lib/styles/focus-ring.ts`,
  `src/lib/components/Texture/Texture.ts`, `src/lib/components/Isotype/Isotype.ts`.

**Exercise**

1. Switch to your practice branch.
2. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import { commands } from 'vitest/browser';
   import './lib/index.js';

   afterEach(async () => {
   	document.body.replaceChildren();
   	document.head.querySelectorAll('style[data-practice]').forEach((s) => s.remove());
   	await commands.emulateMedia({ reducedMotion: 'no-preference' });
   });

   const pageStyle = (css: string) => {
   	const style = document.head.appendChild(document.createElement('style'));
   	style.dataset.practice = '';
   	style.append(css);
   };

   it('the page wins a normal declaration on the host', async () => {
   	pageStyle('gv-title { display: grid; }');
   	const title = document.body.appendChild(document.createElement('gv-title'));
   	await title.updateComplete;
   	expect(getComputedStyle(title).display).toBe('grid');
   });

   it('the hidden rule wins over an important page rule', async () => {
   	pageStyle('gv-title { display: grid !important; }');
   	const title = document.body.appendChild(document.createElement('gv-title'));
   	title.hidden = true;
   	await title.updateComplete;
   	expect(getComputedStyle(title).display).toBe('none');
   });

   it('ends motion in 0.01ms under reduced motion', async () => {
   	await commands.emulateMedia({ reducedMotion: 'reduce' });
   	const button = document.body.appendChild(document.createElement('gv-button'));
   	await button.updateComplete;
   	const inner = button.shadowRoot!.querySelector('button')!;
   	expect(getComputedStyle(inner).transitionDuration).toBe('1e-05s');
   });

   it('until-found hides nothing on an inline host', async () => {
   	document.body.innerHTML = '<gv-button hidden="until-found">Save</gv-button>';
   	const button = document.querySelector('gv-button')!;
   	await button.updateComplete;
   	expect(getComputedStyle(button).display).toBe('inline');
   	expect(button.getBoundingClientRect().width).toBeGreaterThan(0);
   });
   ```

3. Read the four tests. `emulateMedia` is a browser command from `vite.config.ts`. Chromium writes
   `0.01ms` as `1e-05s`.
4. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  4 passed (4)`.

5. Write in your notes which test shows that the outer tree wins. Then write which test shows that
   the inner tree wins.
6. Delete `src/practice.browser.test.ts`.

**Open-work lab: #45 and PR #66, why the hidden rule needs !important**

1. Fetch PR #66:

   ```sh
   git fetch origin pull/66/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach c29308e
   ```

3. Run the host tests:

   ```sh
   pnpm vitest run --project browser src/lib/styles/host-hidden.browser.test.ts
   ```

   Result: `Tests  226 passed (226)`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `componentReset`, which every component uses. Restore the file in step 6.

4. In `src/lib/styles/component-reset.ts`, change `display: none !important;` to
   `display: none;`.
5. Run the host tests again.

   Result: `Tests  45 failed | 181 passed (226)`. Each failure is "beats page display rules on the
   host, !important included", with `{ display: grid; }: expected 'grid' to be 'none'`. A normal
   page rule wins over a normal shadow rule.

6. Restore the file:

   ```sh
   git restore src/lib/styles/component-reset.ts
   ```

7. Run the `until-found` tests:

   ```sh
   pnpm vitest run --project browser src/lib/styles/host-hidden.browser.test.ts -t "until-found"
   ```

   Result: `Tests  45 passed | 181 skipped (226)`. The test checks that `display` is not `none`
   and that `content-visibility` is `hidden`.

8. Go back to your practice branch.

If #66 has merged, do the lab on `main` instead: run the same steps on your practice branch. On
`main` today, step 5 also gives 45 failures, under the name "beats a page display rule on the
host".

**Check yourself**

1. A page writes `gv-title { display: grid !important }` and sets `hidden` on the title. Which
   declaration wins, and why?

   <details><summary>Answer</summary>

   The shadow rule `display: none !important` wins. When both declarations are important, the
   inner tree wins. The second practice test shows it.

   </details>

2. Why does `componentReset` use `0.01ms` and not `0s`?

   <details><summary>Answer</summary>

   A transition with a duration of `0s` does not run, so `transitionend` never fires. Code that
   waits for the event then waits for ever. With `0.01ms`, the event fires.

   </details>

3. Why does `hidden="until-found"` hide nothing on `gv-button`?

   <details><summary>Answer</summary>

   The browser gives `hidden="until-found"` the value `content-visibility: hidden`, and the reset
   leaves it alone. `gv-button` has no `display` rule, so its host is `inline`, and
   `content-visibility` has no effect on an inline box.

   </details>

4. A page sets `--_drop` on a ghost `gv-icon-button`. Does the button show a shadow at rest?

   <details><summary>Answer</summary>

   Yes. The ghost rules at rest in `IconButton.ts` set no `--_drop`. Only the hover and active
   rules set it. Thus the inner element inherits the page value, and `box-shadow` shows it. The
   underscore is a convention only.

   </details>

5. Why does `gv-texture` paint its grain with `currentColor`?

   <details><summary>Answer</summary>

   `color` inherits, so a tint that is invalid at computed-value time takes the default from the
   SVG. `flood-color` does not inherit, and its initial value is black.

   </details>

### Lesson 5 Slots

See how `SlotContent` chooses between the slot and the prop, and sort slots by content.
**Time:** 60 minutes.

**Goals**

- After this lesson, you can explain why Grove does not use the native slot fallback.
- After this lesson, you can predict when the fallback prop renders.
- After this lesson, you can tell a phrasing-only slot from a container slot.
- After this lesson, you can say what #68 changes in the slot warning.

**Read**

- [07 · Slots](07-slots.md#the-whitespace-problem), all sections.
- Files: `src/lib/utils/slot-content.ts`, `src/lib/slots.browser.test.ts`,
  `src/lib/components/FeedbackStrip/FeedbackStrip.ts`.

**Exercise**

1. Switch to your practice branch.
2. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it, vi } from 'vitest';
   import { commands } from 'vitest/browser';
   import './lib/index.js';

   afterEach(() => {
   	document.body.replaceChildren();
   	vi.restoreAllMocks();
   });

   it('shows the prop when the slot holds only whitespace', async () => {
   	document.body.innerHTML = '<div id="host"><gv-button text="Save">\n</gv-button></div>';
   	await document.querySelector('gv-button')!.updateComplete;
   	expect(await commands.ariaSnapshot('#host')).toContain('button "Save"');
   });

   it('hides the prop when an icon fills the slot', async () => {
   	document.body.innerHTML =
   		'<div id="host"><gv-button text="Save"><gv-icon name="tree"></gv-icon></gv-button></div>';
   	await document.querySelector('gv-button')!.updateComplete;
   	const tree = await commands.ariaSnapshot('#host');
   	expect(tree).toBe('- button');
   });

   it('warns about a form control in a slot', async () => {
   	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
   	document.body.innerHTML = '<gv-tooltip><input slot="message" /></gv-tooltip>';
   	await document.querySelector('gv-tooltip')!.updateComplete;
   	expect(warn).toHaveBeenCalledTimes(1);
   	expect(String(warn.mock.calls[0][0])).toContain('slot "message" contains <input>');
   });
   ```

3. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  3 passed (3)`. The whitespace does not hide "Save". The icon hides "Save", and
   the ARIA snapshot is `- button`, a button with no name.

4. Open `src/lib/slots.browser.test.ts`. Find the test "ignores whitespace between the tags, so
   the prop still renders", and compare it with your first test.
5. Delete `src/practice.browser.test.ts`.

**Open-work lab: #53 and #49 C6, phrasing-only and container slots**

1. Read the card epic:

   ```sh
   gh issue view 53
   ```

   Result: the epic groups #16 and #15, and it plans the card slots `heading`, `body`, `meta`,
   `status` and the default slot.

2. Write each card slot in your notes as phrasing-only or container, by the rule of #49 C6.
3. Fetch PR #68, and switch to `ccba0a3`, as in
   [Before you start](#before-you-start).
4. Find the components that ask for phrasing-only slots:

   ```sh
   grep -rl "phrasingOnly: true" src/lib/components
   ```

   Result: six files, `Button.ts`, `Checkbox.ts`, `FeedbackStrip.ts`, `MenuItem.ts`, `Title.ts`
   and `Tooltip.ts`.

5. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it, vi } from 'vitest';
   import './lib/index.js';

   afterEach(() => vi.restoreAllMocks());

   it('warns about a gv-button in a phrasing-only slot', async () => {
   	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
   	const tooltip = document.body.appendChild(document.createElement('gv-tooltip'));
   	const button = Object.assign(document.createElement('gv-button'), { slot: 'message' });
   	tooltip.append(button);
   	await new Promise((resolve) => setTimeout(resolve));
   	expect(warn).toHaveBeenCalledTimes(1);
   });
   ```

6. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  1 passed (1)`. At the PR head, `gv-button` is form-associated, so the tooltip
   warns.

7. Go back to your practice branch, and run the same command.

   Result: `Tests  1 failed (1)`, with
   `AssertionError: expected "Mock" to be called 1 times, but got 0 times`. On `main`, a slotted
   `gv-button` does not cause a warning.

8. Delete `src/practice.browser.test.ts`.

If #68 has merged, do the lab on `main` instead: steps 4 and 6 then give the PR results on
`main`.

**Check yourself**

1. Why does `<gv-button text="Save"> </gv-button>` still show "Save"?

   <details><summary>Answer</summary>

   `SlotContent` counts a text node only when it has text that is not whitespace. The space does
   not count, so `has()` is `false`, and the prop renders.

   </details>

2. A page writes `<gv-button text="Save"><gv-icon name="tree"></gv-icon></gv-button>`. What does
   the button show, and what is its name?

   <details><summary>Answer</summary>

   It shows only the icon. An element always counts as content, so `text` does not render. The
   icon is decorative, so the button has no name: the ARIA snapshot is `- button`.

   </details>

3. Why can a page not fill the label slot of the checkbox inside `gv-todo-list-item`?

   <details><summary>Answer</summary>

   A slot shows only the light DOM children of its own host. The light DOM of the inner
   `gv-checkbox` is in the shadow root of the item. Only the template of the item can fill it.

   </details>

4. Sort the planned card slots of #53 into phrasing-only and container slots.

   <details><summary>Answer</summary>

   `body`, `meta` and the default slot are containers. `heading` and `status` are phrasing-only.
   If the whole card becomes a link, every slot inside the link is phrasing-only.

   </details>

5. At the head of #68, which slots warn about a form control?

   <details><summary>Answer</summary>

   Only the slots of a component that passes `{ phrasingOnly: true }`. A slot is a container by
   default. All six current components pass the option, so nothing changes for them.

   </details>

### Lesson 6 Events

Follow one click through two shadow roots, and reproduce the double event of #26. **Time:** 80
minutes.

**Goals**

- After this lesson, you can find the real origin of a retargeted event.
- After this lesson, you can explain why a composite stops the event of its child.
- After this lesson, you can use a cancelable event to guard a default action.
- After this lesson, you can name the tests that check the event rules.

**Read**

- [08 · Events](08-events.md#the-event-rules), all sections.
- Files: `src/lib/components/ToDoListItem/ToDoListItem.ts`,
  `src/lib/components/TextInput/TextInput.ts`, `src/lib/components/BackButton/BackButton.ts`,
  `src/lib/events.ts`, `src/lib/events.browser.test.ts`.

**Exercise**

1. Switch to your practice branch.
2. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it, vi } from 'vitest';
   import './lib/index.js';

   afterEach(() => {
   	document.body.replaceChildren();
   	vi.restoreAllMocks();
   });

   it('retargets a click to the outer host', async () => {
   	const item = document.body.appendChild(document.createElement('gv-todo-list-item'));
   	await item.updateComplete;
   	const checkbox = item.shadowRoot!.querySelector('gv-checkbox')!;
   	await checkbox.updateComplete;
   	const inner = checkbox.shadowRoot!.querySelector('button')!;

   	let target: EventTarget | null = null;
   	let origin: EventTarget | undefined;
   	const onClick = (e: Event) => {
   		target = e.target;
   		origin = e.composedPath()[0];
   	};
   	document.addEventListener('click', onClick);
   	inner.click();
   	document.removeEventListener('click', onClick);
   	expect(target).toBe(item);
   	expect(origin).toBe(inner);
   });

   it('sends one gv-change for one click on the inner checkbox', async () => {
   	const item = document.body.appendChild(document.createElement('gv-todo-list-item'));
   	await item.updateComplete;
   	const checkbox = item.shadowRoot!.querySelector('gv-checkbox')!;
   	await checkbox.updateComplete;
   	let count = 0;
   	const onChange = () => count++;
   	document.addEventListener('gv-change', onChange);
   	checkbox.shadowRoot!.querySelector('button')!.click();
   	document.removeEventListener('gv-change', onChange);
   	expect(count).toBe(1);
   });

   it('lets the page cancel gv-back', async () => {
   	const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
   	const button = document.body.appendChild(document.createElement('gv-back-button'));
   	await button.updateComplete;
   	button.addEventListener('gv-back', (e) => e.preventDefault());
   	button.shadowRoot!.querySelector('button')!.click();
   	expect(back).not.toHaveBeenCalled();
   });
   ```

3. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  3 passed (3)`. The document sees the item as the target. `composedPath()[0]` is
   the inner button.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `ToDoListItem.ts`. Restore the file in step 6.

4. In `ToDoListItem.ts`, delete the line `e.stopPropagation();` in `_onCheckboxChange()`.
5. Run the practice file and the event tests together:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts src/lib/events.browser.test.ts
   ```

   Result: `Tests  2 failed | 9 passed (11)`. The practice test gives
   `AssertionError: expected 2 to be 1`. The event test "gv-todo-list-item dispatches exactly one
   gv-change per toggle > on a checkbox click" also fails.

6. Restore the file:

   ```sh
   git restore src/lib/components/ToDoListItem/ToDoListItem.ts
   ```

7. Delete `src/practice.browser.test.ts`.

**Open-work lab: #26 on the #50 work branch, the double event**

The single `gv-change` of #26 is on `main`. The rest of #26, the name of the inner checkbox, is on
the #50 work branch. This lab shows that the name work keeps the single event.

1. Open [epic #50](https://github.com/edgarjaymez/grove-lit/issues/50), and copy the branch name
   from its "Branch" section.
2. Fetch the branch:

   ```sh
   git fetch origin <branch from the epic>
   ```

3. Switch to the pinned commit:

   ```sh
   git switch --detach ef5865a
   ```

   Result: `HEAD is now at ef5865a docs: names and descriptions across the shadow boundary`.

4. Find the name binding and the stop:

   ```sh
   grep -n "stopPropagation\|label=" src/lib/components/ToDoListItem/ToDoListItem.ts
   ```

   Result: two lines, `e.stopPropagation();` and `label=${this.heading}`.

5. Run the #26 name tests:

   ```sh
   pnpm vitest run --project browser src/lib/names.browser.test.ts -t "gv-todo-list-item"
   ```

   Result: `Tests  3 passed | 36 skipped (39)`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `ToDoListItem.ts`. Restore the file in step 9.

6. In `ToDoListItem.ts`, delete the line `e.stopPropagation();` in `_onCheckboxChange()`.
7. Run the event tests:

   ```sh
   pnpm vitest run --project browser src/lib/events.browser.test.ts
   ```

   Result: `Tests  1 failed | 7 passed (8)`, with
   `expected [ { type: 'gv-change', …(2) }, …(1) ] to deeply equal [ { type: 'gv-change', …(2) } ]`.
   The document gets two events for one click.

8. Run the #26 name tests again.

   Result: the test "keeps the name through toggles, each one firing gv-change once" fails with
   `expected [ true, true, false ] to deeply equal [ true, false ]`.

9. Restore the file:

   ```sh
   git restore src/lib/components/ToDoListItem/ToDoListItem.ts
   ```

10. Go back to your practice branch.

If #26 has closed, do the lab on `main` instead: steps 6, 7 and 9 work on `main`. Then
`src/lib/names.browser.test.ts` is on `main` too, if its PR has merged.

**Check yourself**

1. A listener on `document` gets a `click` from the checkbox inside `gv-todo-list-item`. What is
   `event.target`, and how does the listener find the inner button?

   <details><summary>Answer</summary>

   `event.target` is the `gv-todo-list-item` host. `event.composedPath()[0]` is the inner button,
   while the event is in dispatch.

   </details>

2. Without `e.stopPropagation()` in `_onCheckboxChange()`, how many `gv-change` events does the
   page get for one click?

   <details><summary>Answer</summary>

   Two. The composed `gv-change` of the checkbox leaves both shadow roots, and the item then
   dispatches its own.

   </details>

3. Why does `gv-text-input` stop the native `change` event, which is not composed?

   <details><summary>Answer</summary>

   The native `change` stops at the shadow root in any case. The component stops it too, so the
   rule is the same for `input` and `change`.

   </details>

4. A listener calls `preventDefault()` on `gv-back` after an `await`. Does the navigation stop?

   <details><summary>Answer</summary>

   No. `BackButton.ts` reads the return value of `dispatchEvent()` at once, after all listeners
   ran. A call after an `await` comes too late.

   </details>

5. Why must a document-level Escape listener never call `stopPropagation()`?

   <details><summary>Answer</summary>

   Other listeners in the page need the key too, for example a modal `<dialog>`.

   </details>

## Module 3 Accessibility and forms

### Lesson 7 Accessibility

Run the a11y checks, see a name that does not cross the shadow boundary, and make one stories
file strict. **Time:** 100 minutes.

**Goals**

- After this lesson, you can name the checks that `pnpm test` and `pnpm test:a11y-canary` run.
- After this lesson, you can explain why a page `<label>` does not name a Grove control on `main`.
- After this lesson, you can read a name from an ARIA snapshot.
- After this lesson, you can make one stories file fail on axe violations, as #63 does.

**Read**

- [09 · Accessibility](09-accessibility.md#the-target-wcag-22-aa), all sections.
- Files: `.storybook/preview.ts`, `src/lib/tokens/contrast.test.ts`,
  `src/stories/A11yCanary.stories.ts`, `scripts/a11y-canary.mjs`.

**Exercise**

1. Switch to your practice branch.
2. Run the contrast gate:

   ```sh
   pnpm vitest run --project unit src/lib/tokens/contrast.test.ts
   ```

   Result: `Tests  19 passed (19)`.

3. Run the a11y canary:

   ```sh
   pnpm test:a11y-canary
   ```

   Result: the last line is `a11y canary: OK (both planted nodes reported in 3 themes)`.

4. Run the stories of the checkbox:

   ```sh
   pnpm vitest run --project storybook src/lib/components/Checkbox
   ```

   Result: `Test Files  3 passed (3)` and `Tests  24 passed (24)`. The project runs 8 stories in 3
   themes. No test fails, because `a11y.test` is `'todo'` in `.storybook/preview.ts`.

5. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import { commands } from 'vitest/browser';
   import './lib/index.js';

   afterEach(() => document.body.replaceChildren());

   const snapshot = async (markup: string) => {
   	document.body.innerHTML = `<div id="host">${markup}</div>`;
   	await document.querySelector('gv-checkbox')!.updateComplete;
   	return commands.ariaSnapshot('#host');
   };

   it('slotted text names the checkbox', async () => {
   	expect(await snapshot('<gv-checkbox>Agree</gv-checkbox>')).toContain('checkbox "Agree"');
   });

   it('a page label does not name the checkbox', async () => {
   	expect(await snapshot('<label>Agree <gv-checkbox></gv-checkbox></label>')).not.toContain(
   		'checkbox "Agree"'
   	);
   });
   ```

6. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  2 passed (2)`. For the page label, the snapshot is
   `- text: Agree` then `- checkbox`, a checkbox with no name.

7. Delete `src/practice.browser.test.ts`.

**Open-work lab: #63, make a clean stories file strict**

1. Fetch PR #63:

   ```sh
   git fetch origin pull/63/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach 07d3d75
   ```

   Result: `HEAD is now at 07d3d75 docs: say how a stories file opts in to the a11y gate`.

3. Find the stricter parameter:

   ```sh
   grep -n "a11y" src/lib/components/MenuItem/MenuItem.stories.ts
   ```

   Result: `parameters: { a11y: { test: 'error' } },` in the meta of the file.

4. Run the stories of the menu item:

   ```sh
   pnpm vitest run --project storybook src/lib/components/MenuItem
   ```

   Result: `Tests  21 passed (21)`. The menu item has no axe violation.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next steps change two stories
> files. Restore them in step 8.

5. In `src/lib/components/Button/Button.stories.ts`, add this line after `tags: ['autodocs'],` in
   the meta:

   ```ts
   	parameters: { a11y: { test: 'error' } },
   ```

6. Add the same line to the meta in `src/lib/components/Checkbox/Checkbox.stories.ts`.
7. Run the stories of both components:

   ```sh
   pnpm vitest run --project storybook src/lib/components/Checkbox src/lib/components/Button
   ```

   Result: `Tests  18 failed | 36 passed (54)`. Each failure is a checkbox story without slotted
   text: Default, Checked, Disabled, Disabled Checked, XL and XL Checked, in 3 themes. The message
   is "Buttons must have discernible text (button-name)". All button stories pass.

8. Restore the two files:

   ```sh
   git restore src/lib/components
   ```

9. Write in your notes which component is clean enough to opt in now, and which item fixes the
   other.
10. Go back to your practice branch.

If #63 has merged, do the lab on `main` instead: steps 3 to 8 then work on `main`.

**Check yourself**

1. Why does `<label>Agree <gv-checkbox></gv-checkbox></label>` not name the checkbox?

   <details><summary>Answer</summary>

   A `<label>` names only a labelable element. A custom element is labelable only when it is
   form-associated, and no Grove component is form-associated on `main`.

   </details>

2. Which two nodes carry the name in `<gv-button aria-label="Close">`?

   <details><summary>Answer</summary>

   The inner `<button>`, because the component copies `ariaLabel` to it, and the host, because the
   attribute stays on it. The host has no role, so it is a named generic element.

   </details>

3. Why does no story fail on an axe violation in `pnpm test` on `main`?

   <details><summary>Answer</summary>

   `.storybook/preview.ts` sets `a11y.test` to `'todo'`, so a violation shows as a warning only.
   Only the canary story sets `'error'`. #33 tracks the flip to `'error'`.

   </details>

4. Why are the checkbox stories not clean, and which item fixes them?

   <details><summary>Answer</summary>

   Six stories have no slotted text, so the inner `<button role="checkbox">` has no name
   (`button-name`). #25 on the #50 work branch adds a page label and a `label` property.

   </details>

5. What must the canary report before `pnpm test:a11y-canary` passes?

   <details><summary>Answer</summary>

   The planted story must fail three times, one time for each theme, and each failure must name
   both planted nodes, `#canary-light` and `#canary-shadow`.

   </details>

### Lesson 8 Forms

See why Grove controls do not join a form on `main`, and why #68 waits for the next task.
**Time:** 120 minutes.

**Goals**

- After this lesson, you can explain why an inner control in a shadow root has no form owner.
- After this lesson, you can list what a form-associated custom element gets from the browser.
- After this lesson, you can run the form tests of #68 and read their results.
- After this lesson, you can explain why a microtask is too early for a trusted click (#40 OD2).

**Read**

- [10 · Forms](10-forms.md#forms-on-main-today), all sections.
- [08 · Events](08-events.md#activation-in-the-next-task).
- Files on `main`: `src/lib/components/TextInput/TextInput.ts`, `src/lib/utils/slot-content.ts`.
- Files at `ccba0a3`: `src/lib/utils/form-control.ts`,
  `src/lib/components/Button/Button.browser.test.ts`, `src/test/forms.ts`.

**Exercise**

1. Switch to your practice branch.
2. Search the library for form association:

   ```sh
   grep -rn -E "formAssociated|attachInternals" src/lib
   ```

   Result: one line, in `src/lib/utils/slot-content.ts`. `SlotContent` reads `formAssociated` to
   warn. No component sets it.

3. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import './lib/index.js';

   afterEach(() => document.body.replaceChildren());

   it('adds no gv-text-input value to the form data', async () => {
   	document.body.innerHTML =
   		'<form><gv-text-input name="email" value="a@b.c"></gv-text-input></form>';
   	await document.querySelector('gv-text-input')!.updateComplete;
   	expect([...new FormData(document.querySelector('form')!)]).toEqual([]);
   });

   it('does not submit from a gv-button with type submit', async () => {
   	document.body.innerHTML = '<form><gv-button type="submit">Send</gv-button></form>';
   	const form = document.querySelector('form')!;
   	let submits = 0;
   	form.addEventListener('submit', (e) => {
   		e.preventDefault();
   		submits++;
   	});
   	const button = document.querySelector('gv-button')!;
   	await button.updateComplete;
   	button.shadowRoot!.querySelector('button')!.click();
   	await new Promise((resolve) => setTimeout(resolve));
   	expect(submits).toBe(0);
   });
   ```

4. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  2 passed (2)`. The form data is empty, and the form gets no `submit`.

5. Keep the file for the lab.

**Open-work lab: #68 and #40, the form tests and the next task**

1. Fetch PR #68, and switch to `ccba0a3`, as in
   [Before you start](#before-you-start).
2. Run the practice file from the exercise:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  1 failed | 1 passed (2)`, with `AssertionError: expected 1 to be +0`. At the PR
   head, `gv-button` submits the form. `gv-text-input` still adds no form data.

3. Delete `src/practice.browser.test.ts`.
4. Run the form tests of the PR:

   ```sh
   pnpm vitest run --project browser src/lib/utils/form-control.browser.test.ts src/lib/components/Button/Button.browser.test.ts
   ```

   Result: `Test Files  2 passed (2)` and `Tests  78 passed (78)`.

5. Find the next-task line:

   ```sh
   grep -n "setTimeout" src/lib/utils/form-control.ts
   ```

   Result: `if (event instanceof MouseEvent) setTimeout(() => this._activate(event));`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes the
> `FormControl` mixin. Restore the file in step 8.

6. In that line, change `setTimeout` to `queueMicrotask`.
7. Run the form tests again.

   Result: `Tests  2 failed | 76 passed (78)`. Both failures are in `Button.browser.test.ts`:
   - "is cancelled by preventDefault on a trusted click anywhere on its path (FR-11)" ends with
     `TimeoutError: locator.click`. The first click submitted, the button disabled itself, and the
     next click waited for an enabled button. This test takes about 15 seconds.
   - "gives exactly one submit with or without a consumer click bridge (FR-12)" fails with
     `expected [ … ] to have a length of 1 but got 2`. The form submitted two times.

8. Restore the file:

   ```sh
   git restore src/lib/utils/form-control.ts
   ```

9. Read the test "lets a window listener added later still cancel the click (FR-11)" in
   `form-control.browser.test.ts`. It passed with the microtask. Write in your notes why: find the
   kind of click that it uses.
10. Go back to your practice branch.

If #68 has merged, do the lab on `main` instead: step 2 then fails on `main` in the same way, and
steps 4 to 8 work on `main`.

**Check yourself**

1. On `main`, why does `<gv-text-input name="email">` add nothing to `new FormData(form)`?

   <details><summary>Answer</summary>

   The `name` goes to the inner `<input>`, in the shadow root. The shadow root has no `<form>`, so
   the input has no form owner. The host is not form-associated.

   </details>

2. Why can a controller not make an element form-associated?

   <details><summary>Answer</summary>

   The browser reads `static formAssociated` and the form callbacks from the class when the tag is
   defined. A controller is a separate object, so the browser never reads it.

   </details>

3. For a trusted click, why does a microtask at the host run before a listener on the form?

   <details><summary>Answer</summary>

   The browser calls each listener as a separate callback. After each callback, the script stack
   is empty, so the browser runs the microtask queue. A task from `setTimeout()` runs after the
   whole dispatch.

   </details>

4. Why did the `form-control.browser.test.ts` test for FR-11 still pass with `queueMicrotask`?

   <details><summary>Answer</summary>

   It calls `submitter.click()`, an untrusted click from script. The script stays on the stack, so
   microtasks wait until the whole dispatch ends. Only a trusted click from `userEvent`, as in
   `Button.browser.test.ts`, shows the problem.

   </details>

5. At the head of PR #68, why does the Enter listener call `preventDefault()` before it clicks the
   default button?

   <details><summary>Answer</summary>

   Without it, the browser can also submit a form with one field by itself, and the form submits
   two times. The click then takes the same path as a real click.

   </details>

## Module 4 Design system

### Lesson 9 Tokens

Follow one token from its JSON file to the CSS, and see why #67 needs the change detector of #66.
**Time:** 90 minutes.

**Goals**

- After this lesson, you can find the CSS name of a token from its JSON path.
- After this lesson, you can explain why one primitive has three values in the base block.
- After this lesson, you can tell which contrast test fails when you skip `pnpm build-tokens`.
- After this lesson, you can write a DTCG `duration` and `cubicBezier` token.
- After this lesson, you can explain why a `cubicBezier` token breaks the `AT_REST` table of #66.

**Read**

- [11 · Design tokens](11-design-tokens.md#what-a-token-is), all sections.
- Files: `src/lib/tokens/main.resolver.json`, `terrazzo.config.js`,
  `src/lib/tokens/palette/semantic-color.light.tokens.json`, `src/lib/tokens/contrast.test.ts`.
- Files at `c29308e`: `src/lib/styles/reduced-motion.browser.test.ts`.

**Exercise**

1. Switch to your practice branch.
2. Find the CSS name of `semanticColor.selectedTextOn.ground`:

   ```sh
   grep -m1 -- "--semantic-color-selected-text-on-ground:" src/lib/tokens/tokens.css
   ```

   Result: `--semantic-color-selected-text-on-ground: var(--color-accent-100);`. The alias becomes a
   `var()` reference to its primitive.

3. Find the first three values of `--color-accent-900`:

   ```sh
   grep -m3 -- "--color-accent-900:" src/lib/tokens/tokens.css
   ```

   Result: three lines, `oklch(29.22% 0.1441 314.7)`, `oklch(28.65% 0.1507 315.1)` and
   `oklch(28% 0.16 316)`. They are the sRGB, Display P3 and Rec. 2020 values of the light theme.

4. Run the contrast gate:

   ```sh
   pnpm vitest run --project unit src/lib/tokens/contrast.test.ts
   ```

   Result: `Tests  19 passed (19)`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next steps change a token JSON
> file and `tokens.css`. Restore both in step 10.

5. In `src/lib/tokens/palette/semantic-color.light.tokens.json`, find `textOn.ground`. Change
   `"subtle": { "$value": "{color.gray.700}" }` to `"subtle": { "$value": "{color.gray.300}" }`.
6. Run the contrast gate again, before you build the tokens.

   Result: `Tests  1 failed | 18 passed (19)`. The failure is "the built CSS matches the JSON
   sources (run pnpm build-tokens after editing them) > light", with
   `--semantic-color-text-on-ground-subtle: built var(--color-gray-700), source var(--color-gray-300)`.

7. Build the tokens:

   ```sh
   pnpm build-tokens
   ```

   [Source: Terrazzo CLI](https://terrazzo.app/docs/reference/cli/)

   Result: `✔  382 tokens built`.

8. Run `git diff --stat`.

   Result: two files. `tokens.css` changes 34 lines, because each light block declares the token.

9. Run the contrast gate again.

   Result: `Tests  1 failed | 18 passed (19)`. The failure is "light theme > keeps every text-on pair
   readable: APCA Bronze and WCAG 2.2 AA (4.5:1)", with
   `--semantic-color-text-on-ground-subtle on --semantic-color-surface-ground: Lc 51.1 (needs 60), 2.73:1`.
   The pair is under
   [1.4.3 Contrast (Minimum) (AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

10. Restore the two files:

    ```sh
    git restore src/lib/tokens
    ```

11. Run `git status --short`.

    Result: no output.

**Open-work lab: #67 and PR #66, motion tokens and the AT_REST table**

1. Fetch PR #66:

   ```sh
   git fetch origin pull/66/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach c29308e
   ```

   Result: `HEAD is now at c29308e docs: leave src/test/shadow.ts to #64's repo map and test guide
entries`.

3. Open `src/lib/styles/reduced-motion.browser.test.ts`, and find `AT_REST`. Read the row for
   `gv-button`.

   Result: `fade(['background', 'color', 'box-shadow', 'border-color'], '0.3s', 'ease-in-out')`.
   The table compares computed strings.

4. Run the reduced-motion tests:

   ```sh
   pnpm vitest run --project browser src/lib/styles/reduced-motion.browser.test.ts
   ```

   Result: `Tests  63 passed (63)`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next steps change the resolver,
> `tokens.css` and `Button.ts`. Restore them in step 12.

5. Make the file `src/lib/tokens/motion/motion.tokens.json` with this content.

   Example (a draft of the #67 set, not in the repo):

   ```json
   {
   	"motion": {
   		"duration": {
   			"$type": "duration",
   			"quick": { "$value": { "value": 200, "unit": "ms" } },
   			"base": { "$value": { "value": 300, "unit": "ms" } }
   		},
   		"easing": {
   			"$type": "cubicBezier",
   			"standard": { "$value": [0.42, 0, 0.58, 1] },
   			"exit": { "$value": [0, 0, 0.58, 1] }
   		}
   	}
   }
   ```

   [Source: Design Tokens Format Module 2025.10, duration](https://www.designtokens.org/tr/2025.10/format/#duration)
   [Source: Design Tokens Format Module 2025.10, cubic-bezier](https://www.designtokens.org/tr/2025.10/format/#cubic-bezier)

6. In `src/lib/tokens/main.resolver.json`, add this set to `sets`, before `"palette-primitives"`.

   Example:

   ```json
   		"motion": {
   			"description": "Draft motion tokens for #67",
   			"sources": [{ "$ref": "motion/motion.tokens.json" }]
   		},
   ```

7. In the same file, add `{ "$ref": "#/sets/motion" },` to `resolutionOrder`, after the `border`
   line.
8. Build the tokens with `pnpm build-tokens`.

   Result: `✔  386 tokens built`. The four motion tokens are new.

9. Find the new names:

   ```sh
   grep -m4 -- "--motion-" src/lib/tokens/tokens.css
   ```

   Result: `--motion-duration-base: 300ms;`, `--motion-duration-quick: 200ms;`,
   `--motion-easing-exit: cubic-bezier(0, 0, 0.58, 1);` and
   `--motion-easing-standard: cubic-bezier(0.42, 0, 0.58, 1);`.

10. In `Button.ts`, in the `transition` of `.btn`, change each `300ms ease-in-out` to
    `var(--motion-duration-base, 300ms) var(--motion-easing-standard, ease-in-out)`.
11. Run the reduced-motion tests again.

    Result: `Tests  1 failed | 62 passed (63)`. The failure is "without a motion preference >
    gv-button keeps its timings at rest". Each duration is still `"0.3s"`. Each easing is
    `"cubic-bezier(0.42, 0, 0.58, 1)"`, not `"ease-in-out"`.

12. Restore the changed files, and remove the new folder:

    ```sh
    git restore .
    rm -r src/lib/tokens/motion
    ```

13. Write two sentences in your notes. Why can #67 FR-03 ("`AT_REST` passes unchanged") not hold?
    What must the #67 PR change in the test?
14. Go back to your practice branch.

If #66 has merged, do the lab on `main` instead: `AT_REST` is then on `main`, and steps 3 to 12
work on your practice branch. If #67 has merged too, read its `motion` set in place of the draft.

**Check yourself**

1. Which CSS name does `semanticColor.selectedTextOn.ground` get, and what is its value?

   <details><summary>Answer</summary>

   `--semantic-color-selected-text-on-ground`. Each camelCase segment becomes kebab-case. The value
   is `var(--color-accent-100)` in the light theme, because the semantic files hold only aliases.

   </details>

2. Why does `--color-accent-900` appear three times in the light theme?

   <details><summary>Answer</summary>

   The colour is outside the sRGB gamut. Terrazzo writes a value mapped into sRGB, one for
   `@media (color-gamut: p3)` and one for `@media (color-gamut: rec2020)`.

   </details>

3. You edit a token JSON file and forget `pnpm build-tokens`. Which test tells you?

   <details><summary>Answer</summary>

   `contrast.test.ts`, the group "the built CSS matches the JSON sources". It compares the aliases
   in `tokens.css` with the aliases in the JSON.

   </details>

4. Which typography level uses `--font-size-base`, and which shadow goes on a modal?

   <details><summary>Answer</summary>

   The `subtle` level uses `--font-size-base` (16 px). The body level `base` uses `fontSize.md`. A
   modal gets the Terrace shadow, the wide one.

   </details>

5. Why does a `cubicBezier` token break `AT_REST`, but a `duration` token does not?

   <details><summary>Answer</summary>

   Chromium computes `300ms` and the token `300ms` as the same string, `0.3s`. It keeps the keyword
   `ease-in-out`, but it writes the token as `cubic-bezier(0.42, 0, 0.58, 1)`. The curve is the
   same, but the strings differ.

   </details>

### Lesson 10 Surfaces and themes

See a surface class, a theme island and the OS-dark selector in a real browser, and measure the
outlined button of #44. **Time:** 100 minutes.

**Goals**

- After this lesson, you can check a composition against the eight nesting rules.
- After this lesson, you can name what a resting surface class sets and what an aurora class omits.
- After this lesson, you can explain why `<html data-theme="light">` wins on a dark OS.
- After this lesson, you can measure a pair of tokens with the helpers of the contrast gate.
- After this lesson, you can explain which part of #44 a token change must fix.

**Read**

- [12 · Surfaces and elevation](12-surfaces-and-elevation.md#tracks-and-depths), all sections.
- [13 · Themes and page CSS](13-themes-and-page-css.md#how-themes-layer-in-one-file), all sections.
- Files: `src/lib/surfaces.ts`, `src/lib/styles/surfaces.css`, `src/lib/styles/globals.css`,
  `terrazzo.config.js`, `src/lib/components/Button/Button.ts`.

**Exercise**

1. Switch to your practice branch.
2. Read two surface classes:

   ```sh
   grep -A4 -E "^\.gv-surface-accent-(summit|aurora) \{" src/lib/styles/surfaces.css
   ```

   Result: the summit class sets `background-color`, `color` and `--gv-focus-ring`. The aurora
   class sets only `background-color` and `color`.

3. Count the surface classes:

   ```sh
   grep -c "^\.gv-surface-" src/lib/styles/surfaces.css
   ```

   Result: `21`, one class for each value of `GROVE_SURFACES`.

4. Make the file `src/practice.browser.test.ts` with this content. The browser setup does not load
   `surfaces.css`, so the test imports it.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import { commands } from 'vitest/browser';
   import './lib/index.js';
   import './lib/styles/surfaces.css';

   afterEach(async () => {
   	document.body.replaceChildren();
   	delete document.documentElement.dataset.theme;
   	await commands.emulateMedia({ colorScheme: 'light' });
   });

   const ring = (el: Element) => getComputedStyle(el).getPropertyValue('--gv-focus-ring');

   it('a resting surface class sets the ring, an aurora class does not', () => {
   	document.body.innerHTML = `
   		<div class="gv-surface-brand-terrace"><p id="rest">Rest</p></div>
   		<div class="gv-surface-brand-aurora"><p id="aurora">Aurora</p></div>`;
   	expect(ring(document.querySelector('#rest')!)).not.toBe('');
   	expect(ring(document.querySelector('#aurora')!)).toBe('');
   });

   it('an island resets the ring of the surface around it', () => {
   	document.body.innerHTML = `
   		<div class="gv-surface-gray-terrace">
   			<section data-theme="dark"><p id="inside">Inside</p></section>
   		</div>`;
   	const section = document.querySelector('section')!;
   	expect(getComputedStyle(section).colorScheme).toBe('dark');
   	expect(ring(document.querySelector('#inside')!)).toBe('');
   });

   it('data-theme="light" on html opts out of OS dark', async () => {
   	const ground = () => getComputedStyle(document.body).backgroundColor;
   	const light = ground();
   	await commands.emulateMedia({ colorScheme: 'dark' });
   	const osDark = ground();
   	document.documentElement.dataset.theme = 'light';
   	expect(osDark).not.toBe(light);
   	expect(ground()).toBe(light);
   });
   ```

5. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  3 passed (3)`. The empty string is the guaranteed-invalid value of
   `--gv-focus-ring`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next steps change
> `terrazzo.config.js` and `tokens.css`. Restore both in step 10.

6. In `terrazzo.config.js`, change the line that starts with `const OS_DARK_ROOT =` to
   `const OS_DARK_ROOT = ':root';`.
7. Build the tokens with `pnpm build-tokens`.
8. Run the practice file again.

   Result: `Tests  1 failed | 2 passed (3)`, with
   `AssertionError: expected 'oklch(0.16 0.012 155)' to be 'oklch(0.98 0.008 91)'`. The OS-dark
   block comes later in the file, so it wins over the light block.

9. Run the contrast gate:

   ```sh
   pnpm vitest run --project unit src/lib/tokens/contrast.test.ts
   ```

   Result: `Tests  3 failed | 16 passed (19)`. All three failures are in "theme cascade
   (terrazzo.config.js)".

10. Restore the two files:

    ```sh
    git restore terrazzo.config.js src/lib/tokens/tokens.css
    ```

11. Delete `src/practice.browser.test.ts`.

**Open-work lab: #44, outlined text and border on a summit**

#44 is an issue with no code, so this lab uses `main`. The contrast helpers are private functions in
`contrast.test.ts`. Thus you add a practice test to that file, and you restore it at the end.

1. Read the issue:

   ```sh
   gh issue view 44
   ```

   Result: the title is "[Spec] gv-button — outlined and ghost on any Grove surface, not only light
   ones", and the state is open. It has the label `Needs Figma Spec`.

2. Find the tokens of the outlined accent button:

   ```sh
   grep -n -A3 "\.btn--outlined\.btn--accent {" src/lib/components/Button/Button.ts
   ```

   Result: the border is `--semantic-color-border-around-accent-aurora`, and the text is
   `--semantic-color-text-on-accent-terrace-base`. The background is `transparent`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next steps change
> `contrast.test.ts`. Restore it in step 7.

3. Add this block at the end of `src/lib/tokens/contrast.test.ts`.

   Example:

   ```ts
   describe.each(Object.entries(THEMES))('practice #44, %s theme', (_theme, tokens) => {
   	const rgb = (name: string) => toRgb(parseOklch(resolve(tokens, `var(${name})`)));

   	it('measures the outlined accent button on each summit', () => {
   		const tracks = ['accent', 'brand', 'danger', 'gray', 'information', 'success'];
   		const failures = tracks.flatMap((track) => {
   			const bg = rgb(`--semantic-color-surface-${track}-summit`);
   			const text = ratio(rgb('--semantic-color-text-on-accent-terrace-base'), bg);
   			const border = ratio(rgb('--semantic-color-border-around-accent-aurora'), bg);
   			return text >= 4.5 && border >= 3
   				? []
   				: [`${track}-summit: text ${text.toFixed(2)}:1, border ${border.toFixed(2)}:1`];
   		});
   		expect(failures).toEqual([]);
   	});
   });
   ```

4. Run the contrast gate:

   ```sh
   pnpm vitest run --project unit src/lib/tokens/contrast.test.ts
   ```

   Result: `Tests  2 failed | 19 passed (21)`. By day, the text measures 2.40 to 2.76:1 and the
   border 2.10 to 2.42:1. At night, the text measures 5.89 to 6.96:1 and the border 2.43 to
   2.87:1.

5. Apply the #44 label fix in your test. Change the `text` line to use
   ``rgb(`--semantic-color-text-on-${track}-summit-base`)``.
6. Run the contrast gate again.

   Result: still `Tests  2 failed | 19 passed (21)`. Each text value is now 5.82:1 or more. Each
   border value is the same as in step 4.

7. Restore the file:

   ```sh
   git restore src/lib/tokens/contrast.test.ts
   ```

8. Write in your notes which WCAG 2.2 criterion each failure breaks. The text needs
   [1.4.3 Contrast (Minimum) (AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
   The border needs
   [1.4.11 Non-text Contrast (AA)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
9. Write one sentence: why does epic #52 ship the label fix and keep the border as a known gap?

If #44 has closed, do the lab on `main` instead: read the new outlined rules in `Button.ts`, and put
their tokens into the practice test of step 3.

**Check yourself**

1. Which of these four compositions are correct? A brand path inside a gray terrace. A brand
   terrace inside a brand path. A danger terrace inside a brand terrace. A card inside a brand aurora.

   <details><summary>Answer</summary>

   The brand path in the gray terrace is permitted (rule 3, one depth deeper). The brand terrace in
   the brand path is not permitted (rule 2, you cannot go back). The danger terrace in the brand
   terrace is not permitted (rule 6). The card in the aurora is not permitted (rule 7).

   </details>

2. Which three things does `.gv-surface-accent-summit` set, and which one does
   `.gv-surface-accent-aurora` leave out?

   <details><summary>Answer</summary>

   The background, the base text colour and `--gv-focus-ring`. The aurora class leaves out the
   ring, so a control over an aurora keeps the ring of the resting surface under it.

   </details>

3. On a dark OS, why does the OS-dark block not match `<html data-theme="light">`?

   <details><summary>Answer</summary>

   Its selector is `:root:where(:not([data-theme="light"]))`. The `:not()` excludes the element,
   and `:where()` adds no specificity. Thus the light block applies. With a plain `:root`, the
   OS-dark block comes later and wins, as step 8 shows.

   </details>

4. Why does a light island need extra grid blocks, but a dark island does not?

   <details><summary>Answer</summary>

   The `[data-theme="light"]` block has only the mobile grid. The island declares it on itself,
   so it does not inherit the larger grid of the page. Each breakpoint already has a full
   `[data-theme="dark"]` block.

   </details>

5. After the #44 label fix, what still fails on a summit? Why does a token change alone not fix it?

   <details><summary>Answer</summary>

   The outlined border, at 2.10 to 2.87:1. No border token reaches 3:1 on summit and aurora. The
   options are a new token, `currentColor`, no border, or no support for those surfaces. The Figma
   design must decide.

   </details>

### Lesson 11 Focus ring

Break the ring in three ways, and record the timing of the flaky ring test of #66. **Time:** 80
minutes.

**Goals**

- After this lesson, you can explain the resolution order of the ring.
- After this lesson, you can explain why a control sets `--_drop` and never `box-shadow`.
- After this lesson, you can explain why a theme island resets `--gv-focus-ring`.
- After this lesson, you can name the tests that guard the ring.
- After this lesson, you can record a flaky test without a retry or a longer timeout.

**Read**

- [14 · The focus ring](14-the-focus-ring.md#the-mechanism), all sections.
- [17 · Tests](17-tests.md#flaky-tests).
- Files: `src/lib/styles/focus-ring.ts`, `src/lib/styles/globals.css`,
  `src/lib/styles/focus.test.ts`, `src/lib/styles/focus-ring.browser.test.ts`.

**Exercise**

1. Switch to your practice branch.
2. Run the unit check of the ring:

   ```sh
   pnpm vitest run --project unit src/lib/styles/focus.test.ts
   ```

   Result: `Tests  38 passed (38)`.

3. Run the browser tests of the ring:

   ```sh
   pnpm vitest run --project browser src/lib/styles/focus-ring.browser.test.ts
   ```

   Result: `Tests  50 passed (50)`, in about 7 seconds.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `globals.css`. Restore it in step 6.

4. In `src/lib/styles/globals.css`, delete the line `--gv-focus-ring: initial;`.
5. Run the browser tests of the ring again.

   Result: `Tests  3 failed | 47 passed (50)`. The test "gives a [data-theme] island its own Ground
   ring" fails in light, dark and OS dark, with `AssertionError: expected false to be true`.

6. Restore the file:

   ```sh
   git restore src/lib/styles/globals.css
   ```

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes `Button.ts`.
> Restore it in step 9.

7. In `Button.ts`, in `.btn--filled.btn--accent`, change
   `--_drop: var(--drop-shadow-under-accent-summit);` to
   `box-shadow: var(--drop-shadow-under-accent-summit);`.
8. Run the browser tests of the ring again.

   Result: `Tests  19 failed | 31 passed (50)`. The first failure is "`<gv-button>` draws the
   Ground ring on keyboard focus and drops it on blur". The variant rule comes after `focusRing`,
   so its `box-shadow` replaces the ring.

9. Restore the file:

   ```sh
   git restore src/lib/components/Button/Button.ts
   ```

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes `Button.ts`.
> Restore it in step 12.

10. In `Button.ts`, add the line `outline: none;` to the rule `.btn--filled.btn--accent`.
11. Run the unit check of the ring again.

    Result: `Tests  1 failed | 37 passed (38)`. The failure is "no component suppresses the focus
    indicator (#22 FR-04) > ../components/Button/Button.ts".

12. Restore the file:

    ```sh
    git restore src/lib/components/Button/Button.ts
    ```

**Open-work lab: #66, the flaky OS-dark swatch test**

The PR records one flaky test: "focus ring in OS dark › `<gv-color-swatch>` draws the Ground ring
on keyboard focus". It failed in 2 of 17 full runs on the PR branch. In this lab you repeat the runs
and keep a record. A run with no failure is a correct result too.

1. Fetch PR #66:

   ```sh
   git fetch origin pull/66/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach c29308e
   ```

3. Run the ring tests alone, and show the time of the swatch test:

   ```sh
   pnpm vitest run --project browser src/lib/styles/focus-ring.browser.test.ts --reporter=verbose | grep "OS dark.*gv-color-swatch> draws"
   ```

   Result: one line that starts with `✓` and ends with the time of the test, about `84ms`.

4. Do step 3 two more times. Write each time in your notes.
5. Run all projects, and keep the log outside the repo:

   ```sh
   pnpm vitest run --reporter=verbose > ../full-1.log 2>&1
   ```

   Result: the command exits after one run, in about 25 seconds.

6. Read the result and the line of the swatch test:

   ```sh
   grep -E "OS dark.*gv-color-swatch> draws|Test Files |Tests " ../full-1.log
   ```

   Result: `Test Files  65 passed | 3 skipped (68)` and `Tests  976 passed (976)`, if the test did
   not fail. The swatch line has a time of about `84ms`.

7. Do steps 5 and 6 four more times, with `../full-2.log` to `../full-5.log`.
8. Make a table in your notes: the run, the kind of run (alone or full), the result and the time.
9. If the test failed in a full run, do the steps of [17 · Tests](17-tests.md#flaky-tests). Copy
   the error message into your table. Do not add a retry or a longer timeout.
10. Compare your counts with the record of the PR. The PR records 2 failures in 17 full runs. It
    records 0 failures in 10 runs of the `browser` project alone.
11. Delete the five log files, and go back to your practice branch.

If #66 has merged, do the lab on `main` instead: steps 3 to 10 work on `main`. Then the full run has
more tests than 976.

**Check yourself**

1. Which ring does a `gv-menu-item` draw inside `.gv-surface-gray-terrace`, and which does it draw
   with no surface class?

   <details><summary>Answer</summary>

   Inside the class, `--ring-on-gray-terrace`, because `--gv-focus-ring` comes first. With no
   class, `--ring-on-brand-terrace`, from its private `--_ring-default`.

   </details>

2. Which ring does a button draw over a brand aurora inside a brand path?

   <details><summary>Answer</summary>

   `--ring-on-brand-path`. The aurora class sets no ring, so the button inherits the ring of the
   resting surface under it.

   </details>

3. Why does a dark island need `--gv-focus-ring: initial`?

   <details><summary>Answer</summary>

   Without it, a control in the island inherits the ring of the surface outside. That value was
   resolved outside the island, in the wrong theme. With the reset, the control falls back to
   `--_ring-default` or `--ring-on-ground`, which resolve inside the island.

   </details>

4. Why did step 8 of the exercise fail 19 tests, when you changed only one rule?

   <details><summary>Answer</summary>

   Many tests focus a default `gv-button`, which is filled and accent. The variant rule
   `.btn--filled.btn--accent` comes after the `focusRing` fragment in `static styles`, so its
   `box-shadow` replaces the ring of every focused default button.

   </details>

5. What is the focus indicator in forced colours mode, and which test checks it?

   <details><summary>Answer</summary>

   The transparent outline of the `focusRing` rule. The browser forces `box-shadow` to `none` and
   paints the outline in a system colour. The test "shows a system-colour outline under forced
   colours, and no outline otherwise" checks it.

   </details>

## Module 5 Tools

### Lesson 12 Metadata and manifest

Make the manifest check fail on purpose, and see the glyph parity tests of #64 fail. **Time:** 80
minutes.

**Goals**

- After this lesson, you can name the three sections that `ComponentMetadata` requires.
- After this lesson, you can tell which check catches a camelCase attribute in a snippet.
- After this lesson, you can fix each message that `check-manifest.mjs` prints.
- After this lesson, you can name the four copies of the glyph names and the tests of #64 that
  guard them.

**Read**

- [15 · Metadata and the manifest](15-metadata-and-the-manifest.md#component-metadata), all
  sections.
- Files: `src/lib/components/metadata.ts`, `src/lib/components/Button/Button.metadata.ts`,
  `src/lib/components/metadata.test.ts`, `scripts/check-manifest.mjs`,
  `custom-elements-manifest.config.mjs`.
- Files at `631bcd1`: `src/lib/components/glyphs.browser.test.ts`,
  `src/test/component-metadata.ts`.

**Exercise**

1. Switch to your practice branch.
2. Count the metadata files that use `satisfies`:

   ```sh
   grep -l "satisfies ComponentMetadata" src/lib/components/*/*.metadata.ts | wc -l
   ```

   Result: `15`.

3. Run the manifest steps only:

   ```sh
   pnpm build-manifest
   ```

   Result: the last two lines are `[grove] wrote dist/types/astro.d.ts (15 elements)` and
   `[grove] manifest matches the sources (15 elements)`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `Button.metadata.ts`. Restore it in step 7.

4. In `Button.metadata.ts`, in the `page-level-cta` snippet, change `size="lg"` to
   `buttonSize="lg"`.
5. Run the metadata tests:

   ```sh
   pnpm vitest run --project unit src/lib/components/metadata.test.ts
   ```

   Result: `Tests  1 failed | 45 passed (46)`. The failure is "ButtonMetadata snippets use no
   camelCase attribute", and the received list is `[ "buttonSize" ]`.

6. Run `pnpm build-manifest`.

   Result: `[grove] manifest drift:`, then
   `src/lib/components/Button/Button.metadata.ts: snippet sets "buttonSize" on <gv-button>, which declares no such attribute`.
   The command exits with code 1.

7. Restore the file:

   ```sh
   git restore src/lib/components/Button/Button.metadata.ts
   ```

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `Checkbox.ts`. Restore it in step 11.

8. In `Checkbox.ts`, delete the JSDoc line
   ``* @fires {CustomEvent<boolean>} gv-change - with the new `checked`.``.
9. Run `pnpm check`.

   Result: `tsc --noEmit` prints no error. TypeScript does not know the manifest rules.

10. Run `pnpm build-manifest`.

    Result: the command fails with
    `src/lib/components/Checkbox/Checkbox.ts: <gv-checkbox> dispatches "gv-change" without a typed @fires tag (@fires {CustomEvent<…>} gv-change)`.

11. Restore the file:

    ```sh
    git restore src/lib/components/Checkbox/Checkbox.ts
    ```

**Open-work lab: #64, break a glyph list**

1. Fetch PR #64:

   ```sh
   git fetch origin pull/64/head
   ```

2. Switch to the pinned commit:

   ```sh
   git switch --detach 631bcd1
   ```

   Result: `HEAD is now at 631bcd1 test(glyphs): require each metadata component.name to be the
registered class`.

3. Compare the lock file with `main`:

   ```sh
   git diff --stat main -- pnpm-lock.yaml
   ```

   Result: no output. The PR changes the `build` script in `package.json`, but no dependency.

4. Run the metadata tests:

   ```sh
   pnpm vitest run --project unit src/lib/components/metadata.test.ts
   ```

   Result: `Tests  48 passed (48)`. The PR adds two tests to the 46 on `main`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next steps change three files.
> Restore each one before the next change.

5. In `src/test/browser-setup.ts`, delete the line
   `import '@phosphor-icons/webcomponents/PhHouse';`.
6. Run the metadata tests again.

   Result: `Tests  1 failed | 47 passed (48)`. The failure is "glyph lists copied from the metadata
   (#47) > the browser test setup registers exactly the declared glyphs". The expected list has
   `"PhHouse"`.

7. Restore the file with `git restore src/test/browser-setup.ts`.
8. In `src/stories/Home.mdx`, find the `PhHouse` import line. Change its comment `// gv-menu-item`
   to `// gv-menu-item, gv-button`.
9. Run the metadata tests again.

   Result: `Tests  1 failed | 47 passed (48)`. The failure is "the Home.mdx recipe pairs each
   component with exactly the glyphs it declares", and the received list has
   `"gv-button PhHouse"`.

10. Restore the file with `git restore src/stories/Home.mdx`.
11. In `MenuItem.ts`, change `icon = 'house'` to `icon = 'list'`.
12. Run the glyph tests:

    ```sh
    pnpm vitest run --project browser src/lib/components/glyphs.browser.test.ts
    ```

    Result: `Tests  1 failed | 39 passed (40)`. The failure is "`<gv-menu-item>` draws exactly its
    default and fixed glyphs", with `AssertionError: expected [ 'list' ] to deeply equal [ 'house' ]`.

13. Restore the file with `git restore src/lib/components/MenuItem/MenuItem.ts`.

> [!CAUTION]
> Remove the screenshot folder of the failed test before you continue. Vitest writes it to
> `src/lib/components/__screenshots__/`. Git ignores it, but `pnpm check-ledger` reads it as a
> component directory and fails.

14. Remove the folder:

    ```sh
    rm -rf src/lib/components/__screenshots__
    ```

15. Go back to your practice branch.
16. Do step 5 again on `main`, and run the metadata tests.

    Result: `Tests  46 passed (46)`. On `main`, no test sees that the glyph import is gone.

17. Restore the file with `git restore src/test/browser-setup.ts`.

If #64 has merged, do the lab on `main` instead: steps 4 to 14 then work on `main`, and step 16
fails as step 6 does.

**Check yourself**

1. Which three sections does `ComponentMetadata` require, and why does each file use `satisfies`?

   <details><summary>Answer</summary>

   `component`, `phosphor` and `composition.slots`. `satisfies` checks the object against the type,
   but keeps the real type of each free section. An annotation would make each free section
   `unknown`.

   </details>

2. A snippet has `buttonSize="lg"`. Which two checks fail, and which commands run them?

   <details><summary>Answer</summary>

   "snippets use no camelCase attribute" in `metadata.test.ts`, in the `unit` project. The snippet
   check of `check-manifest.mjs`, in `pnpm build-manifest` or `pnpm build`. `pnpm check` runs
   neither.

   </details>

3. You delete a `@fires` tag. Which command finds it?

   <details><summary>Answer</summary>

   Only `pnpm build-manifest`, or `pnpm build`, which runs it last. `pnpm check` passes, because
   TypeScript accepts a dispatched event with no JSDoc tag.

   </details>

4. Name the four copies of the glyph names. Which ones does a test check on `main`, and which ones
   at the head of #64?

   <details><summary>Answer</summary>

   The default in the component source, the `phosphor` field of the metadata, the recipe in
   `Home.mdx` and the imports in `browser-setup.ts`. On `main`, a test checks only that the
   metadata glyphs exist in Phosphor. At `631bcd1`, `metadata.test.ts` compares `Home.mdx` and
   `browser-setup.ts` with the metadata, and `glyphs.browser.test.ts` compares the source.

   </details>

5. Why does the manifest not contain the field `copied` of `ColorSwatch.ts`?

   <details><summary>Answer</summary>

   It is a `@state()` field. The plugin `expandTypesPlugin()` removes internal state from the
   manifest, and `check-manifest.mjs` fails if a `@state` field comes back.

   </details>

### Lesson 13 Storybook and tests

Run each test project, write a test with trusted input, and break the static Storybook as #33 found
it. **Time:** 100 minutes.

**Goals**

- After this lesson, you can tell what each of the four test projects runs, and where.
- After this lesson, you can explain how a Storybook test run picks its theme.
- After this lesson, you can tell a trusted click from an untrusted click in a test.
- After this lesson, you can explain why the `storybook` project cannot catch the bug of #33.
- After this lesson, you can run the static smoke test and read its result.

**Read**

- [16 · Storybook](16-storybook.md#a-story-file), all sections.
- [17 · Tests](17-tests.md#the-four-test-projects), all sections.
- Files: `.storybook/preview.ts`, `.storybook/vitest.setup.ts`, `vite.config.ts`,
  `scripts/storybook-static-smoke.mjs`, `package.json`.

**Exercise**

1. Switch to your practice branch.
2. Run the stories of the button:

   ```sh
   pnpm vitest run --project storybook src/lib/components/Button
   ```

   Result: `Test Files  3 passed (3)` and `Tests  30 passed (30)`. The ten stories run in three
   browser instances.

3. Find where the theme of each instance comes from:

   ```sh
   grep -n "groveTheme" vite.config.ts .storybook/vitest.setup.ts
   ```

   Result: `provide: { groveTheme: theme },` in `vite.config.ts`, and
   `globalThis.__GROVE_TEST_THEME__ = inject('groveTheme');` in the setup file.

4. Run the `unit` project:

   ```sh
   pnpm vitest run --project unit
   ```

   Result: `Test Files  7 passed (7)` and `Tests  137 passed (137)`.

5. Make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import { userEvent } from 'vitest/browser';
   import './lib/index.js';

   afterEach(() => document.body.replaceChildren());

   const mountButton = async () => {
   	const button = document.body.appendChild(document.createElement('gv-button'));
   	await button.updateComplete;
   	return button.shadowRoot!.querySelector('button')!;
   };

   it('userEvent gives a trusted click, el.click() does not', async () => {
   	const inner = await mountButton();
   	const seen: boolean[] = [];
   	inner.addEventListener('click', (e) => seen.push(e.isTrusted));
   	await userEvent.click(inner);
   	inner.click();
   	expect(seen).toEqual([true, false]);
   });

   it('Tab shows the focus ring, a pointer click does not', async () => {
   	const before = document.body.appendChild(document.createElement('button'));
   	const inner = await mountButton();
   	await userEvent.click(inner);
   	expect(inner.matches(':focus-visible')).toBe(false);
   	before.focus();
   	await userEvent.keyboard('{Tab}');
   	expect(inner.matches(':focus-visible')).toBe(true);
   });

   it('fails with no assertion', async () => {
   	await mountButton();
   });
   ```

   [Source: Vitest, Interactivity API](https://vitest.dev/api/browser/interactivity)
   [Source: MDN, Event.isTrusted](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted)

6. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  1 failed | 2 passed (3)`. The third test fails with
   `Error: expected any number of assertion, but got none`, because the config sets
   `requireAssertions: true`.
   [Source: Vitest, expect.requireAssertions](https://vitest.dev/config/expect#expect-requireassertions)

7. Delete the third test, and run the file again.

   Result: `Tests  2 passed (2)`.

8. Delete `src/practice.browser.test.ts`.
9. Run all projects one time:

   ```sh
   pnpm vitest run
   ```

   Result: `Test Files  65 passed | 3 skipped (68)` and `Tests  960 passed (960)`, in about 25
   seconds. The command exits. Do not use `pnpm test` here: in a terminal, it stays in watch mode.
   [Source: Vitest, watch](https://vitest.dev/config/watch)

**Open-work lab: #33, the static build and the smoke test**

#33 is an issue. Its registration fix and the smoke test are on `main`, so this lab uses `main`.

1. Read the issue:

   ```sh
   gh issue view 33
   ```

   Result: the title is "[Spec] Storybook — register components in static builds and make the a11y
   checks gate", and the state is open.

2. Run the smoke test:

   ```sh
   pnpm test:storybook-static
   ```

   Result: after the build, the last line is
   `storybook static smoke: OK (121 stories, every custom element defined)`. The command takes about
   30 seconds.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `package.json`. Restore it in step 6.

3. In `package.json`, in `sideEffects`, delete the line `"./src/lib/components/**/*.ts"`. Delete
   the comma after `"**/*.js"` too.
4. Run the stories of the button again:

   ```sh
   pnpm vitest run --project storybook src/lib/components/Button
   ```

   Result: `Tests  30 passed (30)`. The test project serves the modules as the dev server does, so
   it does not see the problem.

5. Run the smoke test again.

   Result: `storybook static smoke: 212 problem(s)`, and the command exits with code 1. Each line
   names a story and an undefined tag, for example
   `components-gv-button--default · gv-button (undefined)`.

6. Restore the file:

   ```sh
   git restore package.json
   ```

7. Write two sentences in your notes. Why did the deployed Storybook show empty tags before #33?
   Why does the Vercel deploy not stop such a build?
8. Read `a11y` in `.storybook/preview.ts`. Write which items must land before #33 changes `'todo'`
   to `'error'`.

If #33 has closed, do the lab on `main` instead: steps 2 to 6 still work. Then check if
`.storybook/preview.ts` sets `test: 'error'`.

**Check yourself**

1. Which project runs `src/lib/tokens/contrast.test.ts`, and which project runs
   `src/lib/styles/focus-ring.browser.test.ts`?

   <details><summary>Answer</summary>

   The `unit` project runs `contrast.test.ts` in Node. The `browser` project runs
   `focus-ring.browser.test.ts` in one Chromium instance, with `src/test/browser-setup.ts`.

   </details>

2. Why does `focus-ring.browser.test.ts` use `userEvent.keyboard('{Tab}')` and not `el.focus()`?

   <details><summary>Answer</summary>

   The ring shows on `:focus-visible`. That pseudo-class depends on how focus arrived. A real Tab
   from Playwright is trusted keyboard input, so the button matches `:focus-visible`, as the
   second practice test shows.

   </details>

3. Which pattern in `sideEffects` keeps `import './Button.js';` in the static build?

   <details><summary>Answer</summary>

   `./src/lib/components/**/*.ts`. The stories import the source files. The other two patterns
   match no `.ts` file.

   </details>

4. Which file turns the `groveTheme` value into a global variable, and what reads it?

   <details><summary>Answer</summary>

   `.storybook/vitest.setup.ts` sets `__GROVE_TEST_THEME__` from `inject('groveTheme')`. The
   `withTheme` decorator in `.storybook/preview.ts` prefers it to the toolbar value.

   </details>

5. A test has no `expect` call. What happens in the `browser` project, and in the `storybook`
   project?

   <details><summary>Answer</summary>

   In the `browser` project, it fails, because the root config sets `requireAssertions: true`. The
   two Storybook projects turn it off, because the a11y addon calls `expect()` only when it finds a
   violation.

   </details>

### Lesson 14 Build and release

Read what the build puts into `dist/`, use the ledger commands, and see the dist gate of #64 fail.
**Time:** 100 minutes.

**Goals**

- After this lesson, you can name the three steps of `pnpm build` and the wrapper of `prepack`.
- After this lesson, you can explain why `process.env.NODE_ENV` must stay in `dist/index.js`.
- After this lesson, you can tell when `pnpm check-ledger` fails, and when that failure is correct.
- After this lesson, you can list the steps of a release by hand.

**Read**

- [18 · Build and package](18-build-and-package.md#the-build-steps), all sections.
- [19 · Release](19-release.md#no-ci), all sections.
- Files: `package.json`, `vite.config.ts`, `src/lib/utils/dev.ts`, `components-since.json`,
  `scripts/record-release.mjs`, `scripts/check-ledger.mjs`.
- Files at `631bcd1`: `scripts/check-dist.mjs`.

**Exercise**

1. Switch to your practice branch.
2. Run the full build:

   ```sh
   pnpm build
   ```

   Result: the last line is `[grove] manifest matches the sources (15 elements)`. Restore
   `tokens.css` if `git status --short` lists it.

3. Find the expression that the consumer decides:

   ```sh
   grep -n "process.env.NODE_ENV" dist/index.js
   ```

   Result: one line, `return process.env.NODE_ENV !== "production";`.

4. List the imports of Lit in the bundle:

   ```sh
   grep -o 'from "lit[^"]*"' dist/index.js | sort -u
   ```

   Result: six lines, from `"lit"`, `"lit/decorators.js"`, `"lit/directives/class-map.js"`,
   `"lit/directives/if-defined.js"`, `"lit/directives/style-map.js"` and `"lit/static-html.js"`.
   The bundle does not contain Lit.

5. List the component directory with `ls src/lib/components`.

   Result: the 15 component directories and three files. If you see `__screenshots__`, a failed
   test wrote it. Remove it with `rm -rf src/lib/components/__screenshots__`.

6. Check the ledger:

   ```sh
   pnpm check-ledger
   ```

   Result: `[grove] components-since.json covers all 15 components`.

7. Give `record-release` a version that is not semver:

   ```sh
   pnpm record-release 0.45
   ```

   Result: `[grove] record-release: '0.45' is not a semver version (usage: record-release 0.46.0)`.

8. Give it an older version with `pnpm record-release 0.44.0`.

   Result: `[grove] record-release: 0.44.0 is older than 0.45.0, already recorded in components-since.json`.

9. Give it the current version with `pnpm record-release 0.45.0`.

   Result: `[grove] no new components; components-since.json unchanged`. You can run it again with
   no risk.

10. Make an empty component directory with `mkdir src/lib/components/Badge`.
11. Run `pnpm check-ledger`.

    Result: `[grove] components-since.json drift:`, then
    `src/lib/components/Badge has no entry — run pnpm record-release <version>`.

12. Remove the directory with `rmdir src/lib/components/Badge`.
13. Pack the package into the parent folder:

    ```sh
    pnpm pack --pack-destination ..
    ```

    [Source: pnpm, pnpm pack](https://pnpm.io/cli/pack)

    Result: the first line is `prepack$ pnpm check-ledger && pnpm build && publint`. Then
    `All good!` from publint. The tarball is `../edgarjaymez-grove-0.45.0.tgz`, with 100 files:
    `dist/`, `LICENSE`, `package.json` and `README`.
    [Source: publint, Rules](https://publint.dev/rules)

14. Keep the tarball for Lesson 15. Restore `tokens.css` if `git status --short` lists it.
15. Get the version on npm:

    ```sh
    pnpm view @edgarjaymez/grove version
    ```

    Result: `0.45.0`, the same as `"version"` in `package.json`.

**Open-work lab: #64, the dist gate**

1. Fetch PR #64, and switch to `631bcd1`, as in [Before you start](#before-you-start).
2. Run the full build with `pnpm build`.

   Result: a new line between the Vite build and the manifest,
   `[grove] dist leaves process.env.NODE_ENV to the consumer`.

> [!CAUTION]
> Make a practice branch first: `git switch -c practice/<name>`. The next step changes
> `vite.config.ts`. Restore it in step 6.

3. In `vite.config.ts`, add a second entry to `define`.

   Example:

   ```ts
   	define: {
   		__APP_VERSION__: JSON.stringify(pkg.version),
   		'process.env.NODE_ENV': '"production"'
   	},
   ```

4. Run `pnpm build` again.

   Result: `[grove] dist drift:`, then "no dist/\*.js reads process.env.NODE_ENV, so the development
   warnings are compiled in or out for every consumer." The command exits with code 1, and the
   manifest step does not run.

5. Run `grep -c "process.env.NODE_ENV" dist/index.js`.

   Result: `0`. Vite replaced the expression.

6. Restore the file:

   ```sh
   git restore vite.config.ts
   ```

7. Go back to your practice branch, and do step 3 again.
8. Run `pnpm build`.

   Result: the build passes, and the last line is
   `[grove] manifest matches the sources (15 elements)`. On `main`, nothing checks the rule.

9. Restore the file with `git restore vite.config.ts`, and run `pnpm build` one more time.
10. Restore `tokens.css` if `git status --short` lists it.

If #64 has merged, do the lab on `main` instead: steps 2 to 6 then work on `main`, and step 8 fails
as step 4 does.

**Check yourself**

1. Which step of `pnpm build` fails when a `@fires` tag is absent?

   <details><summary>Answer</summary>

   Step 3, `pnpm build-manifest`, in `check-manifest.mjs`. The tokens and the bundle build first,
   with no error.

   </details>

2. Why must `process.env.NODE_ENV` stay in `dist/index.js`?

   <details><summary>Answer</summary>

   The bundler of each consumer decides. A production build of the app replaces it, so the
   development warnings stop. If Grove replaced it in its own build, it would decide for every
   consumer.

   </details>

3. A component first shipped in 0.40.2. Which version does `record-release` give it, and why?

   <details><summary>Answer</summary>

   0.41.0. It gives the first `v*` tag that contains the directory. `origin` has no tag between
   v0.33.0 and v0.41.0.

   </details>

4. Why does `pnpm prepack` pass on `main` today, and when does it fail again?

   <details><summary>Answer</summary>

   The ledger has an entry for all 15 component directories. It fails when a new component
   directory exists, until a release records it. A stray `__screenshots__` folder in
   `src/lib/components/` makes it fail too.

   </details>

5. Why do you run `pnpm publish` on `main`, after the merge?

   <details><summary>Answer</summary>

   The version on npm must match a commit on `main`. By default, `pnpm publish` stops when the
   branch is not `main` or `master`, or when the tree has changes. It runs `prepack` again.

   </details>

## Module 6 Practice

### Lesson 15 Use Grove in an app

Install the packed package in a small app, use the tags as an app does, and reproduce the
double-submit trap of #68. **Time:** 100 minutes.

**Goals**

- After this lesson, you can install Grove from a tarball and list what the package gives an app.
- After this lesson, you can tell which import paths `exports` permits.
- After this lesson, you can write kebab-case attributes and listen for `gv-input` and
  `gv-change`.
- After this lesson, you can explain the two traps of #68 for app code.

**Read**

- [20 · Grove in an app](20-grove-in-an-app.md#install), all sections.
- [19 · Release](19-release.md#the-release-ledger), the part "How a consumer reads the ledger".
- Files: `package.json` (`exports`, `peerDependencies`), `src/stories/Home.mdx`.
- Files at `ccba0a3`: `src/lib/utils/form-control.ts`.

**Exercise**

1. Switch to your practice branch.
2. If you do not have `../edgarjaymez-grove-0.45.0.tgz` from Lesson 14, run
   `pnpm pack --pack-destination ..`.
3. Make an empty app next to the repo:

   ```sh
   mkdir ../grove-app
   cd ../grove-app
   pnpm init
   ```

   Result: `pnpm init` writes a `package.json`.

4. Install Grove from the tarball, and Lit:

   ```sh
   pnpm add ../edgarjaymez-grove-0.45.0.tgz lit
   ```

   [Source: pnpm, pnpm add](https://pnpm.io/cli/add)

   Result: the list of dependencies shows `@edgarjaymez/grove 0.45.0` and `lit` with a 3.x
   version.

5. List the package files with `ls node_modules/@edgarjaymez/grove/dist`.

   Result: `components`, `components-since.json`, `custom-elements.json`, `fonts`, `index.js`,
   `styles`, `tokens`, `types`, and the `.d.ts` and `.map` files.

6. Resolve the CSS entry:

   ```sh
   node -e "console.log(require.resolve('@edgarjaymez/grove/grove.css'))"
   ```

   Result: a path that ends with `dist/styles/grove.css`.

7. Resolve the ledger by its package path:

   ```sh
   node -e "try { require.resolve('@edgarjaymez/grove/components-since.json') } catch (e) { console.log(e.code) }"
   ```

   Result: `ERR_PACKAGE_PATH_NOT_EXPORTED`. `exports` does not list the file.
   [Source: Node.js, Package entry points](https://nodejs.org/api/packages.html#exports)

8. Make the file `ledger.mjs` with the example from
   [19 · Release](19-release.md#the-release-ledger). Add this line at the end:
   `console.log(components.Tooltip, Object.keys(components).length);`.
9. Run `node ledger.mjs`.

   Result: `0.45.0 15`.

10. Import the bundle in Node, as server code does:

    ```sh
    node --input-type=module -e "await import('@edgarjaymez/grove'); console.log(typeof customElements, Boolean(customElements.get('gv-button')))"
    ```

    Result: `object true`. The import does not throw. The Node build of Lit gives Node a minimal
    `customElements` registry. It does not render a shadow root.

11. Go back to the repo with `cd -`.
12. Make the file `src/practice.browser.test.ts` with this content.

    Example:

    ```ts
    import { afterEach, expect, it } from 'vitest';
    import { userEvent } from 'vitest/browser';
    import './lib/index.js';
    import type { MenuItem, TextInput } from './lib/index.js';

    afterEach(() => document.body.replaceChildren());

    it('reads the kebab-case attribute, not the camelCase one', () => {
    	document.body.innerHTML = `
    		<gv-menu-item id="kebab" is-active></gv-menu-item>
    		<gv-menu-item id="camel" isActive></gv-menu-item>`;
    	expect((document.querySelector('#kebab') as MenuItem).isActive).toBe(true);
    	expect((document.querySelector('#camel') as MenuItem).isActive).toBe(false);
    });

    it('gives a form gv-input and gv-change, not input and change', async () => {
    	document.body.innerHTML = '<form><gv-text-input value="a"></gv-text-input></form>';
    	const field = document.querySelector('gv-text-input') as TextInput;
    	await field.updateComplete;
    	const seen: string[] = [];
    	for (const type of ['input', 'change', 'gv-input', 'gv-change']) {
    		document.querySelector('form')!.addEventListener(type, () => seen.push(type));
    	}
    	const inner = field.shadowRoot!.querySelector('input')!;
    	await userEvent.type(inner, 'bc');
    	inner.blur();
    	expect(new Set(seen)).toEqual(new Set(['gv-input', 'gv-change']));
    	expect(field.value).toBe('abc');
    	expect(field.getAttribute('value')).toBe('a');
    });
    ```

13. Run the file:

    ```sh
    pnpm vitest run --project browser src/practice.browser.test.ts
    ```

    Result: `Tests  2 passed (2)`. The parser makes `isActive` into `isactive`, so it does
    nothing. The `value` attribute keeps the start value.

14. Delete `src/practice.browser.test.ts`.

**Open-work lab: #68, the click bridge that submits two times**

On `main`, an app that wants a `gv-button` to submit adds a click bridge that calls
`form.requestSubmit()`. At the head of #68, the button submits by itself. This lab shows what the
old bridge then does.

1. On your practice branch, make the file `src/practice.browser.test.ts` with this content.

   Example:

   ```ts
   import { afterEach, expect, it } from 'vitest';
   import { userEvent } from 'vitest/browser';
   import './lib/index.js';

   afterEach(() => document.body.replaceChildren());

   const page = async (bridge: (e: Event, form: HTMLFormElement) => void) => {
   	document.body.innerHTML = '<form><gv-button type="submit">Send</gv-button></form>';
   	const form = document.querySelector('form')!;
   	const button = document.querySelector('gv-button')!;
   	await button.updateComplete;
   	const submits: (Element | null)[] = [];
   	form.addEventListener('submit', (e) => {
   		e.preventDefault();
   		submits.push(e.submitter);
   	});
   	button.addEventListener('click', (e) => bridge(e, form));
   	await userEvent.click(button.shadowRoot!.querySelector('button')!);
   	await new Promise((resolve) => setTimeout(resolve, 50));
   	return submits;
   };

   it('a click bridge that does not cancel the click submits two times', async () => {
   	const submits = await page((_e, form) => form.requestSubmit());
   	expect(submits).toHaveLength(2);
   	expect(document.querySelector('gv-button')!.disabled).toBe(true);
   });

   it('a click bridge that cancels the click submits one time', async () => {
   	const submits = await page((e, form) => {
   		e.preventDefault();
   		form.requestSubmit();
   	});
   	expect(submits).toHaveLength(1);
   });
   ```

2. Run the file:

   ```sh
   pnpm vitest run --project browser src/practice.browser.test.ts
   ```

   Result: `Tests  1 failed | 1 passed (2)`, with
   `AssertionError: expected [ null ] to have a length of 2 but got 1`. On `main`, only the bridge
   submits.

3. Fetch PR #68, and switch to `ccba0a3`, as in [Before you start](#before-you-start).
4. Run the same command again. The untracked test file stays.

   Result: `Tests  2 passed (2)`. The bridge submits, and then the button submits in the next task.
   After its own submission, the button disables itself.

5. Write in your notes the two changes that an app makes when #68 lands. Use the release note in
   [19 · Release](19-release.md#release-notes).
6. Go back to your practice branch, and delete `src/practice.browser.test.ts`.
7. Remove the practice app and the tarball:

   ```sh
   rm -rf ../grove-app ../edgarjaymez-grove-0.45.0.tgz
   ```

If #68 has merged, do the lab on `main` instead: both tests then pass on `main`.

**Check yourself**

1.  Which import registers the tags, and which import does not?

              <details><summary>Answer</summary>

        `import '@edgarjaymez/grove';` registers all 15 tags. `import type { TextInput } from

    '@edgarjaymez/grove'` does not, because TypeScript removes it from the output.

              </details>

2.  Why is `is-done="false"` true, and how does an Astro template write false?

    <details><summary>Answer</summary>

    A boolean attribute is true when it is present, whatever its value. Astro writes `{false}` as
    the string `"false"`. Pass `undefined` for false, for example `is-active={isCurrent || undefined}`.

    </details>

3.  Which events must a form-level listener use for a Grove field?

    <details><summary>Answer</summary>

    `gv-input` and `gv-change`. `gv-text-input` stops the native `input` and `change` of its inner
    `<input>`, as the practice test shows.

    </details>

4.  Why does an app read `components-since.json` by its file path?

    <details><summary>Answer</summary>

    `exports` does not list the file, so Node refuses the package path with
    `ERR_PACKAGE_PATH_NOT_EXPORTED`. `./package.json` is in `exports`, so the app finds the package
    folder from it.

    </details>

5.  At the head of #68, a page handles `submit` with `preventDefault()` and `fetch`. What must it do
    when the request ends?

    <details><summary>Answer</summary>

    Set `disabled = false` on the button. The button disables itself after its own submission, so
    it stays disabled until the page enables it.

    </details>

### Lesson 16 Capstone

Review the repo against the house rules, rehearse the merge train, and plan one issue that is not
blocked. **Time:** 180 minutes.

**Goals**

- After this lesson, you can review a change with the checklist of chapter 21.
- After this lesson, you can tell "mergeable" from "the checks pass".
- After this lesson, you can merge the open PRs in train order on a practice branch and run every
  check.
- After this lesson, you can plan an issue from its FR codes, its open decisions and its
  dependencies.

**Read**

- [21 · House rules and how work moves](21-house-rules-and-how-work-moves.md#names), all sections.
- [22 · Cookbook](22-cookbook.md#recipe-15-review-and-land-an-open-pr-locally), recipes 15 and 16.
- [23 · Known drift](23-known-drift.md#the-rule), all sections.
- Issues: #54, and the issue that you plan in part (b) of the lab.

**Exercise**

1. Switch to your practice branch.
2. Find each boolean property that does not reflect:

   ```sh
   grep -rn "@property({ type: Boolean" src/lib/components | grep -v "reflect: true"
   ```

   Result: two lines in `Icon.ts`, `isFilled` and `fillInHover`. Each `disabled` property
   reflects.

3. Write in your notes if `isFilled` or `fillInHover` is a toggled state. The rule names only
   `disabled` and toggled state.
4. Check a known drift item:

   ```sh
   grep -c '"customElements"' package.json
   ```

   Result: `2`. [23 · Known drift](23-known-drift.md#leftovers-in-the-code) lists it.

5. Check that nothing reads `__APP_VERSION__`:

   ```sh
   grep -rn "__APP_VERSION__" src
   ```

   Result: no output.

6. List the open issues that wait for the Figma design:

   ```sh
   gh issue list --label "Needs Figma Spec" --state open --json number
   ```

   [Source: GitHub CLI, gh issue list](https://cli.github.com/manual/gh_issue_list)

   Result: nine issues: #15, #16, #17, #18, #19, #27, #29, #39 and #44.

7. List the open PRs and what GitHub says about them:

   ```sh
   gh pr list --state open --json number,mergeable,labels
   ```

   Result: five PRs, #63, #64, #65, #66 and #68. Each one is `MERGEABLE`, and #65 has the label
   `Needs Figma Spec`.

8. Write one sentence in your notes: what does `MERGEABLE` tell you in a repo with no CI?

**Open-work lab: (a) the merge train, (b) plan an issue**

Part (a) merges the open PRs in the order of
[Merge order](21-house-rules-and-how-work-moves.md#merge-order) on a practice branch. You never push
this branch.

1. Fetch the four PRs of the train:

   ```sh
   git fetch origin pull/63/head pull/64/head pull/66/head pull/68/head
   ```

2. Make a practice branch from `main`:

   ```sh
   git switch -c practice/train main
   ```

3. Merge #63:

   ```sh
   git merge --no-edit 07d3d75
   ```

   [Source: Git, git-merge](https://git-scm.com/docs/git-merge)

   Result: git makes a merge commit with no conflict.

4. Merge #64 with `git merge --no-edit 631bcd1`.

   Result: a merge commit with no conflict.

5. Merge #66 with `git merge --no-edit c29308e`.

   Result: a merge commit with no conflict. `src/test/shadow.ts` has the same bytes in #64 and #66.

6. Merge #68 with `git merge --no-edit ccba0a3`.

   Result: a merge commit with no conflict. The #63 commits in #68 are already on the branch.

7. Compare the lock file with `main`:

   ```sh
   git diff --stat main -- pnpm-lock.yaml
   ```

   Result: no output, so you do not install again.

8. Run `pnpm check`.

   Result: `tsc --noEmit` prints no error.

9. Run `pnpm build`.

   Result: the build has four steps. It prints
   `[grove] dist leaves process.env.NODE_ENV to the consumer` and
   `[grove] manifest matches the sources (15 elements)`. Restore `tokens.css` if
   `git status --short` lists it.

10. Run all test projects one time:

    ```sh
    pnpm vitest run
    ```

    Result: `Test Files  69 passed | 3 skipped (72)` and `Tests  1145 passed (1145)`, in about 27
    seconds.

11. Write the result of each check in your notes, in the form of a comment on a PR.
12. Go back to your practice branch, and delete the train branch:

    ```sh
    git switch practice/<name>
    git branch -D practice/train
    ```

Part (b) plans one issue that waits for no Figma answer. Select #67 (motion tokens), #30
(`gv-color-swatch` tooltips) or #56 (server render). #39 (the skip link) has the label
`Needs Figma Spec`, so a plan for it lists only its questions for the design.

13. Read the issue, for example `gh issue view 67`.
14. List its FR codes with the issue number, for example `#67 FR-03`.
15. List its open decisions, for example `#67 OD2`.
16. List the items that must land first. #67 and #30 wait for #66, because #66 adds `AT_REST`.
17. List the files that the issue changes, and the tests that guard each file.
18. List the checks that you run before you open the PR. Use
    [Checks before you open a PR](21-house-rules-and-how-work-moves.md#how-work-moves).
19. Find the open-work boxes that the issue changes, for example
    `grep -rn "Open work: #67" docs/guide`.
20. Write the plan in one page: the FR codes, the order, the files, the checks and the boxes.

If a PR of the train has merged, do part (a) on `main` instead: leave out its merge step. If all of
them have merged, run steps 7 to 10 on `main`. If the issue of part (b) has closed, select a
different one.

**Check yourself**

1. Why do you write `#49 C1`, and not `C1`?

   <details><summary>Answer</summary>

   Many issues use the same letters for their codes. `C1` alone does not tell which issue it comes
   from.

   </details>

2. What does "mergeable" tell you in this repo?

   <details><summary>Answer</summary>

   Only that GitHub found no git conflict with `main`, at the time it last checked. No workflow
   runs, so it does not tell you that the tests pass. Part (a) of the lab shows how to run the
   checks yourself.

   </details>

3. Why does #65 wait, and what does a merge now close by mistake?

   <details><summary>Answer</summary>

   It has the label `Needs Figma Spec`, and it waits for answers to Q1 and Q2. The PR says
   `Closes #20`, so a merge now closes #20 with #20 FR-DT1 still open.

   </details>

4. Which source wins over `DESIGN_SYSTEM.md`, and what do you do when they disagree?

   <details><summary>Answer</summary>

   The code on `main`, then `tokens.css`. Fix the document or report the drift. Do not change the
   code to agree with a stale document.

   </details>

5. Why do you keep the `src` glob in `sideEffects`, and why does #67 wait for #66?

   <details><summary>Answer</summary>

   The glob keeps the component imports of the stories in the static Storybook build, as Lesson 13
   shows. #67 changes timings that the `AT_REST` table pins, and that table exists only in #66, as
   Lesson 9 shows.

   </details>

## Sources

**Standards**

- [Understanding WCAG 2.2, 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
  Read 2026-10-27.
- [Understanding WCAG 2.2, 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
  Read 2026-10-27.
- [Design Tokens Format Module 2025.10, duration](https://www.designtokens.org/tr/2025.10/format/#duration)
  and [cubic-bezier](https://www.designtokens.org/tr/2025.10/format/#cubic-bezier). Read
  2026-10-27.

**Platform reference**

- [MDN, HTMLLabelElement: control property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/control).
  Read 2026-10-27.
- [MDN, Event.isTrusted](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted). Read
  2026-10-27.
- [Node.js, Package entry points](https://nodejs.org/api/packages.html#exports). Read 2026-10-27.

**Tool docs**

- [Lit, Reactive properties](https://lit.dev/docs/v3/components/properties/). Read 2026-10-27.
- [Terrazzo CLI](https://terrazzo.app/docs/reference/cli/). Read 2026-10-27.
- [Vitest, Interactivity API](https://vitest.dev/api/browser/interactivity). Read 2026-10-27.
- [Vitest, expect.requireAssertions](https://vitest.dev/config/expect#expect-requireassertions).
  Read 2026-10-27.
- [Vitest, watch](https://vitest.dev/config/watch). Read 2026-10-27.
- [Playwright, Browsers](https://playwright.dev/docs/browsers). Read 2026-10-27.
- [pnpm, pnpm install](https://pnpm.io/cli/install#--frozen-lockfile). Read 2026-10-27.
- [pnpm, pnpm add](https://pnpm.io/cli/add). Read 2026-10-27.
- [pnpm, pnpm pack](https://pnpm.io/cli/pack). Read 2026-10-27.
- [publint, Rules](https://publint.dev/rules). Read 2026-10-27.
- [Git, git-switch](https://git-scm.com/docs/git-switch). Read 2026-10-27.
- [Git, git-restore](https://git-scm.com/docs/git-restore). Read 2026-10-27.
- [Git, git-merge](https://git-scm.com/docs/git-merge). Read 2026-10-27.
- [GitHub CLI, gh issue view](https://cli.github.com/manual/gh_issue_view). Read 2026-10-27.
- [GitHub CLI, gh issue list](https://cli.github.com/manual/gh_issue_list). Read 2026-10-27.

[Index](README.md)
