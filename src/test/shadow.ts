type Updating = Element & { updateComplete?: Promise<unknown> };

/** Every element below `root` in tree order, each open shadow root walked right after its host. */
export const deepElements = (root: ParentNode): Element[] =>
	[...root.querySelectorAll('*')].flatMap((el) => [
		el,
		...(el.shadowRoot ? deepElements(el.shadowRoot) : [])
	]);

/** Waits until every element below `root` has updated and no new nested element appears. */
export const settleDeep = async (root: ParentNode) => {
	for (let count = -1; count !== deepElements(root).length; ) {
		const all = deepElements(root);
		count = all.length;
		await Promise.all(all.map((el) => (el as Updating).updateComplete));
	}
};

/** Resolves after `count` animation frames. */
export const frames = (count = 1) =>
	new Promise<void>((resolve) => {
		const step = (left: number) => (left ? requestAnimationFrame(() => step(left - 1)) : resolve());
		step(count);
	});
