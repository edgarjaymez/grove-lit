// Fails when components-since.json and the component directories disagree:
// - a component directory with no entry (the release step `pnpm record-release <version>` was skipped);
// - an entry with no directory (a component was removed or renamed).
// It deliberately does not compare entries with package.json's version: the bump comes later in the
// release flow than recording does.
import {
	COMPONENTS_DIR,
	LEDGER,
	checkLedger,
	componentDirs,
	readLedger
} from './components-since.mjs';

let ledger, dirs;
try {
	ledger = readLedger();
	dirs = componentDirs();
} catch (error) {
	console.error(`[grove] ledger: ${error.message}`);
	process.exit(1);
}

const { missing, stale } = checkLedger(ledger, dirs);
const problems = [
	...missing.map(
		(dir) => `${COMPONENTS_DIR}/${dir} has no entry — run pnpm record-release <version>`
	),
	...stale.map((name) => `"${name}" has no directory under ${COMPONENTS_DIR} — remove its entry`)
];
if (problems.length) {
	console.error(`[grove] ${LEDGER} drift:\n  ${problems.join('\n  ')}`);
	process.exit(1);
}
console.log(`[grove] ${LEDGER} covers all ${dirs.length} components`);
