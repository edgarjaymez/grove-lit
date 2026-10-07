// Records a release in components-since.json: every component directory without an entry gets one.
// Existing entries never change, so re-running is safe. Run by the release flow before the build
// is verified:  pnpm record-release <version>
// Exits 1 with a message on a bad version, an unreadable or unwritable ledger, or a missing
// components directory; exits 0 when it recorded entries or found nothing new.
import {
	COMPONENTS_DIR,
	LEDGER,
	componentDirs,
	compare,
	firstRelease,
	isSemver,
	newestRecorded,
	readLedger,
	recordRelease,
	releaseTags,
	writeLedger
} from './components-since.mjs';

const fail = (message) => {
	console.error(`[grove] record-release: ${message}`);
	process.exit(1);
};

const version = process.argv[2];
if (!isSemver(version))
	fail(`'${version ?? ''}' is not a semver version (usage: record-release 0.46.0)`);

let ledger, dirs;
try {
	ledger = readLedger();
} catch (error) {
	fail(error.message);
}
try {
	dirs = componentDirs();
} catch (error) {
	fail(`cannot read ${COMPONENTS_DIR}: ${error.message}`);
}

const newest = newestRecorded(ledger);
if (newest && compare(version, newest) < 0)
	fail(`${version} is older than ${newest}, already recorded in ${LEDGER}`);

const tags = releaseTags(version);
const { ledger: next, added } = recordRelease(ledger, dirs, version, (dir) =>
	firstRelease(dir, tags)
);

if (!added.length) {
	console.log(`[grove] no new components; ${LEDGER} unchanged`);
} else {
	try {
		writeLedger(next);
	} catch (error) {
		fail(`cannot write ${LEDGER}: ${error.message}`);
	}
	console.log(
		`[grove] recorded in ${LEDGER}: ${added.map((dir) => `${dir} → ${next.components[dir]}`).join(', ')}`
	);
}
