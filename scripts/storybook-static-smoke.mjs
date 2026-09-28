// Opens every story of the static Storybook build and checks that each custom element in it is
// defined and each gv-* element upgraded (#33 FR-02, FR-03). The dev server and the Vitest projects
// can't catch a build that drops component registrations, so this runs against storybook-static/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const ROOT = 'storybook-static';
const TYPES = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.png': 'image/png'
};

const server = createServer(async (req, res) => {
	const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(
		/^[/\\]+/,
		''
	);
	try {
		const body = await readFile(join(ROOT, path || 'index.html'));
		res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
		res.end(body);
	} catch {
		res.writeHead(404).end();
	}
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf-8'));
const stories = Object.values(index.entries).filter(
	(e) => e.type === 'story' && !e.tags?.includes('a11y-canary')
);

const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];

for (const story of stories) {
	await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`);
	await page.waitForFunction(
		() => document.querySelector('#storybook-root')?.childElementCount > 0,
		null,
		{ timeout: 10_000 }
	);
	const bad = await page.evaluate(() => {
		const problems = [];
		const walk = (root) => {
			for (const el of root.querySelectorAll('*')) {
				const tag = el.localName;
				if (tag.includes('-')) {
					if (!customElements.get(tag)) problems.push(`${tag} (undefined)`);
					else if (tag.startsWith('gv-') && !el.shadowRoot) problems.push(`${tag} (not upgraded)`);
				}
				if (el.shadowRoot) walk(el.shadowRoot);
			}
		};
		walk(document.querySelector('#storybook-root'));
		return [...new Set(problems)];
	});
	// A story tagged missing-glyph renders an unregistered Phosphor tag on purpose.
	const expected = (problem) =>
		story.tags?.includes('missing-glyph') && /^ph-[a-z0-9-]+ \(undefined\)$/.test(problem);
	for (const problem of bad.filter((p) => !expected(p))) failures.push(`${story.id} · ${problem}`);
}

await browser.close();
server.close();

if (failures.length) {
	console.error(
		`storybook static smoke: ${failures.length} problem(s)\n  ${failures.join('\n  ')}`
	);
	process.exit(1);
}
console.log(`storybook static smoke: OK (${stories.length} stories, every custom element defined)`);
