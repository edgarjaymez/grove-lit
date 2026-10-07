import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	checkLedger,
	compare,
	componentDirs,
	isSemver,
	newestRecorded,
	readLedger,
	recordRelease,
	writeLedger
} from './components-since.mjs';

const SCRIPTS = resolve(import.meta.dirname);

describe('semver helpers', () => {
	it('accepts versions and rejects everything else', () => {
		for (const ok of ['0.45.0', '1.0.0', '2.3.4-rc.1', '1.2.3+build.5'])
			expect(isSemver(ok)).toBe(true);
		for (const bad of ['', '0.45', 'v0.45.0', '0.45.0;id', '../0.1.0', 'latest', undefined, 5])
			expect(isSemver(bad)).toBe(false);
	});

	it('orders by major.minor.patch numerically', () => {
		expect(compare('0.9.0', '0.10.0')).toBeLessThan(0);
		expect(compare('1.0.0', '0.99.99')).toBeGreaterThan(0);
		expect(compare('0.45.0', '0.45.0')).toBe(0);
	});
});

describe('recordRelease / checkLedger / newestRecorded', () => {
	const ledger = { components: { Button: '0.3.0', Card: '0.31.0' } };

	it('adds only missing directories and never touches existing entries', () => {
		const { ledger: next, added } = recordRelease(ledger, ['Button', 'Card', 'Tooltip'], '0.45.0');
		expect(added).toEqual(['Tooltip']);
		expect(next.components).toEqual({ Button: '0.3.0', Card: '0.31.0', Tooltip: '0.45.0' });
		expect(ledger.components).not.toHaveProperty('Tooltip');
	});

	it('is idempotent', () => {
		const once = recordRelease(ledger, ['Button', 'Card', 'Tooltip'], '0.45.0').ledger;
		const twice = recordRelease(once, ['Button', 'Card', 'Tooltip'], '0.46.0');
		expect(twice.added).toEqual([]);
		expect(twice.ledger.components).toEqual(once.components);
	});

	it('lets a resolver keep a directory on the release it really shipped in', () => {
		const { ledger: next } = recordRelease(ledger, ['Card', 'Dial', 'Tooltip'], '0.47.0', (dir) =>
			dir === 'Dial' ? '0.45.0' : undefined
		);
		expect(next.components).toMatchObject({ Dial: '0.45.0', Tooltip: '0.47.0' });
	});

	it('reports directories without an entry and entries without a directory', () => {
		expect(checkLedger(ledger, ['Button', 'Tooltip'])).toEqual({
			missing: ['Tooltip'],
			stale: ['Card']
		});
		expect(checkLedger(ledger, ['Button', 'Card'])).toEqual({ missing: [], stale: [] });
	});

	it('finds the newest recorded version', () => {
		expect(newestRecorded(ledger)).toBe('0.31.0');
		expect(newestRecorded({ components: {} })).toBeUndefined();
	});
});

describe('files and CLIs', () => {
	let dir;
	const run = (script, ...args) =>
		spawnSync(process.execPath, [join(SCRIPTS, script), ...args], { cwd: dir, encoding: 'utf-8' });
	const ledgerFile = () => join(dir, 'components-since.json');
	const seed = (components) => writeFileSync(ledgerFile(), JSON.stringify({ components }));
	const makeDirs = (...names) =>
		names.forEach((name) => mkdirSync(join(dir, 'src/lib/components', name), { recursive: true }));

	beforeEach(() => {
		dir = mkdtempSync(join(tmpdir(), 'grove-ledger-'));
	});
	afterEach(() => rmSync(dir, { recursive: true, force: true }));

	it('lists only directories, sorted', () => {
		makeDirs('Tooltip', 'Button');
		writeFileSync(join(dir, 'src/lib/components/index.ts'), '');
		expect(componentDirs(join(dir, 'src/lib/components'))).toEqual(['Button', 'Tooltip']);
	});

	it('rejects a ledger that is missing, malformed or holds a non-semver value', () => {
		expect(() => readLedger(ledgerFile())).toThrow(/cannot read/);
		writeFileSync(ledgerFile(), '{ nope');
		expect(() => readLedger(ledgerFile())).toThrow(/cannot read/);
		writeFileSync(ledgerFile(), JSON.stringify({ components: [] }));
		expect(() => readLedger(ledgerFile())).toThrow(/must hold/);
		seed({ Button: 'latest' });
		expect(() => readLedger(ledgerFile())).toThrow(/not a semver/);
	});

	it('writes sorted keys, tab-indented, ending in a newline', () => {
		writeLedger({ components: { Tooltip: '0.45.0', Button: '0.3.0' } }, ledgerFile());
		expect(readFileSync(ledgerFile(), 'utf-8')).toBe(
			'{\n\t"components": {\n\t\t"Button": "0.3.0",\n\t\t"Tooltip": "0.45.0"\n\t}\n}\n'
		);
	});

	it('record-release adds entries for new directories and reports them', () => {
		seed({ Button: '0.3.0' });
		makeDirs('Button', 'Tooltip');
		const result = run('record-release.mjs', '0.45.0');
		expect(result.status).toBe(0);
		expect(result.stdout).toContain('Tooltip → 0.45.0');
		expect(readLedger(ledgerFile()).components).toEqual({ Button: '0.3.0', Tooltip: '0.45.0' });
	});

	it('record-release is a clean no-op when nothing is new, and leaves the file alone', () => {
		seed({ Button: '0.3.0' });
		makeDirs('Button');
		const before = readFileSync(ledgerFile(), 'utf-8');
		const result = run('record-release.mjs', '0.45.0');
		expect(result.status).toBe(0);
		expect(result.stdout).toContain('unchanged');
		expect(readFileSync(ledgerFile(), 'utf-8')).toBe(before);
	});

	it.each([[[]], [['latest']], [['0.45']], [['0.45.0;id']]])(
		'record-release exits 1 on a bad version %j',
		(args) => {
			seed({});
			makeDirs('Button');
			const result = run('record-release.mjs', ...args);
			expect(result.status).toBe(1);
			expect(result.stderr).toContain('not a semver');
		}
	);

	it('record-release exits 1 for a version older than one already recorded', () => {
		seed({ Button: '0.45.0' });
		makeDirs('Button', 'Tooltip');
		const result = run('record-release.mjs', '0.30.0');
		expect(result.status).toBe(1);
		expect(result.stderr).toContain('older than 0.45.0');
	});

	it('record-release exits 1 on a missing ledger or a missing components directory', () => {
		makeDirs('Button');
		const noLedger = run('record-release.mjs', '0.45.0');
		expect(noLedger.status).toBe(1);
		expect(noLedger.stderr).toContain('cannot read components-since.json');
		seed({ Button: '0.3.0' });
		rmSync(join(dir, 'src'), { recursive: true });
		const noDirs = run('record-release.mjs', '0.45.0');
		expect(noDirs.status).toBe(1);
		expect(noDirs.stderr).toContain('src/lib/components');
	});

	it('check-ledger passes when they agree and names every problem when they do not', () => {
		seed({ Button: '0.3.0' });
		makeDirs('Button');
		const ok = run('check-ledger.mjs');
		expect(ok.status).toBe(0);
		expect(ok.stdout).toContain('covers all 1 components');

		seed({ Button: '0.3.0', Gone: '0.2.0' });
		makeDirs('Tooltip');
		const bad = run('check-ledger.mjs');
		expect(bad.status).toBe(1);
		expect(bad.stderr).toContain('src/lib/components/Tooltip has no entry');
		expect(bad.stderr).toContain('"Gone" has no directory');
	});

	it('record-release keeps each component on the release it shipped in when several went out unrecorded', () => {
		const git = (...args) =>
			execFileSync(
				'git',
				[
					'-c',
					'user.name=t',
					'-c',
					'user.email=t@t',
					'-c',
					'commit.gpgsign=false',
					'-c',
					'tag.gpgsign=false',
					...args
				],
				{ cwd: dir, stdio: 'ignore' }
			);
		const release = (name, tag) => {
			makeDirs(name);
			writeFileSync(join(dir, 'src/lib/components', name, `${name}.ts`), '');
			git('add', '.');
			git('commit', '-m', `feat: ${name}`);
			if (tag) git('tag', tag);
		};
		git('init', '-q');
		seed({});
		release('Button', 'v0.1.0');
		release('Card', 'v0.2.0');
		release('Dial', 'v0.3.0');
		release('Tooltip'); // added after the last tag: it ships in the release being recorded

		const result = run('record-release.mjs', '0.4.0');
		expect(result.status).toBe(0);
		expect(readLedger(ledgerFile()).components).toEqual({
			Button: '0.1.0',
			Card: '0.2.0',
			Dial: '0.3.0',
			Tooltip: '0.4.0'
		});
	});
});
