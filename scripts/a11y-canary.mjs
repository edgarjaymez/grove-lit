// Runs the a11y-canary project and inverts the result: exit 0 only if the planted story failed in
// every theme and axe reported both planted nodes each time (#33 FR-17, FR-18).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const THEMES = ['light', 'dark', 'os-dark'];
const NODES = ['#canary-light', '#canary-shadow'];

const out = join(mkdtempSync(join(tmpdir(), 'a11y-canary-')), 'report.json');
spawnSync(
	'pnpm',
	['vitest', 'run', '--project', 'a11y-canary', '--reporter=json', `--outputFile=${out}`],
	{ stdio: 'inherit', env: { ...process.env, GROVE_A11Y_CANARY: '1' } }
);

let report;
try {
	report = JSON.parse(readFileSync(out, 'utf-8'));
} catch {
	console.error('a11y canary: no report, the run did not complete');
	process.exit(1);
}

const tests = report.testResults.flatMap((file) =>
	file.assertionResults.map((t) => ({
		...t,
		file: file.name,
		message: t.failureMessages.join('\n')
	}))
);
const problems = [];

// The JSON reporter doesn't carry the browser instance, so count: one failure per theme.
const planted = tests.filter((t) => /Planted/.test(t.title));
if (planted.length !== THEMES.length)
	problems.push(`expected ${THEMES.length} canary runs, found ${planted.length}`);
for (const t of planted) {
	if (t.status !== 'failed') problems.push(`a canary run passed: the gate did not fail`);
	for (const node of NODES)
		if (!t.message.includes(node)) problems.push(`a canary run did not report ${node}`);
}

if (problems.length) {
	console.error(`a11y canary: FAILED\n  ${[...new Set(problems)].join('\n  ')}`);
	process.exit(1);
}
console.log(`a11y canary: OK (both planted nodes reported in ${THEMES.length} themes)`);
