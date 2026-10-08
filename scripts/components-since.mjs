// The release ledger: components-since.json maps each component directory to the package version
// it first appeared in. It ships as dist/components-since.json so an installed package can answer
// "which components are new since version X" with no network. Shared by record-release.mjs (adds
// entries at release time) and check-ledger.mjs (the guard); the logic here is pure unless noted.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

export const LEDGER = 'components-since.json';
export const COMPONENTS_DIR = 'src/lib/components';

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export const isSemver = (value) => typeof value === 'string' && SEMVER.test(value);

const triple = (version) => version.split(/[-+]/)[0].split('.').map(Number);

/** Orders by major.minor.patch; prerelease and build suffixes are ignored. */
export const compare = (a, b) => {
	const [x, y] = [triple(a), triple(b)];
	for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
	return 0;
};

/** Component directory names under `dir`, sorted — files such as index.ts are not components. */
export const componentDirs = (dir = COMPONENTS_DIR) =>
	readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

/** Reads and validates the ledger; throws an Error whose message says what is wrong. */
export const readLedger = (file = LEDGER) => {
	let ledger;
	try {
		ledger = JSON.parse(readFileSync(file, 'utf-8'));
	} catch (error) {
		throw new Error(`cannot read ${file}: ${error.message}`, { cause: error });
	}
	const components = ledger?.components;
	if (!components || typeof components !== 'object' || Array.isArray(components))
		throw new Error(`${file} must hold { "components": { "<Directory>": "<version>" } }`);
	for (const [name, version] of Object.entries(components))
		if (!isSemver(version)) throw new Error(`${file}: "${name}" has "${version}", not a semver`);
	return ledger;
};

/** Writes the ledger with sorted keys and tabs, so diffs stay one line per component. */
export const writeLedger = (ledger, file = LEDGER) => {
	const components = Object.fromEntries(
		Object.entries(ledger.components).sort(([a], [b]) => a.localeCompare(b))
	);
	writeFileSync(file, JSON.stringify({ components }, null, '\t') + '\n');
};

/**
 * A new ledger with an entry for every directory that has none; existing entries never change.
 * `resolve(dir)` may name an earlier version a directory is known to have shipped in — when several
 * releases went out without recording, that keeps each component on its real first release. It
 * falls back to `version`, the release being recorded.
 */
export const recordRelease = (ledger, dirs, version, resolve = () => undefined) => {
	const components = { ...ledger.components };
	const added = [];
	for (const dir of dirs) {
		if (dir in components) continue;
		components[dir] = resolve(dir) ?? version;
		added.push(dir);
	}
	return { ledger: { ...ledger, components }, added };
};

/** What disagrees: directories without an entry, entries without a directory. */
export const checkLedger = (ledger, dirs) => ({
	missing: dirs.filter((dir) => !(dir in ledger.components)),
	stale: Object.keys(ledger.components).filter((name) => !dirs.includes(name))
});

/** The newest version already in the ledger, or undefined when it is empty. */
export const newestRecorded = (ledger) => Object.values(ledger.components).sort(compare).at(-1);

// --- git (not pure): release tags are v<semver> on the commit a release was cut from -------------

/** Release tags older than `version`, oldest first. Empty when git or the tags are unavailable. */
export const releaseTags = (version) => {
	let output;
	try {
		output = execFileSync('git', ['tag', '--list', 'v*'], {
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'ignore']
		});
	} catch {
		return [];
	}
	return output
		.split('\n')
		.map((tag) => tag.trim())
		.filter((tag) => isSemver(tag.slice(1)) && compare(tag.slice(1), version) < 0)
		.sort((a, b) => compare(a.slice(1), b.slice(1)));
};

/** The earliest of `tags` whose tree holds the component directory, as a version; else undefined. */
export const firstRelease = (dir, tags) => {
	for (const tag of tags) {
		try {
			execFileSync('git', ['cat-file', '-e', `${tag}:${COMPONENTS_DIR}/${dir}`], {
				stdio: 'ignore'
			});
			return tag.slice(1);
		} catch {
			// not in this tag — try the next
		}
	}
	return undefined;
};
