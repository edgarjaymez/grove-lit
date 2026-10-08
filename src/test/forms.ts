// Helpers for browser tests of controls that take part in forms (chapter 10, recipe 14).
import { LitElement } from 'lit';

/** Resolves in the next task, once a control has acted on its form after the click. */
export const nextTask = () => new Promise((resolve) => setTimeout(resolve));

/**
 * Cancels every submission on the test page, so none navigates it. Call it once at the top of the
 * test file, and count submissions with `recordSubmits`.
 */
export const cancelFormSubmits = () => {
	document.addEventListener('submit', (e) => e.preventDefault());
};

/** Logs each submit event on a form, with its submitter and the form data built as it fires. */
export const recordSubmits = (form: HTMLFormElement) => {
	const log: { data: [string, FormDataEntryValue][]; submitter: HTMLElement | null }[] = [];
	form.addEventListener('submit', (e) =>
		log.push({ data: [...new FormData(form)], submitter: (e as SubmitEvent).submitter })
	);
	return log;
};

/**
 * Waits until every Lit element in `root`'s light DOM has finished updating. It waits twice, so an
 * update that one element's update starts in another has finished too.
 */
export const settle = async (root: ParentNode) => {
	for (let i = 0; i < 2; i++) {
		const all = [...root.querySelectorAll('*')].filter((el) => el instanceof LitElement);
		await Promise.all(all.map((el) => (el as LitElement).updateComplete));
	}
};
