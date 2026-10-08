// Fails the build when dist/ no longer carries the development gate for gv-icon's missing-glyph
// warning (src/lib/utils/dev.ts). The gate reads process.env.NODE_ENV so the consumer's bundler
// decides; if Grove's own build replaces it (a `define` in vite.config.ts, or a Vite change), the
// published library never warns, and nothing else would notice.
import { globSync, readFileSync } from 'node:fs';

const bundles = globSync('dist/*.js');
if (!bundles.some((file) => readFileSync(file, 'utf-8').includes('process.env.NODE_ENV'))) {
	console.error(
		`[grove] dist drift:\n  no dist/*.js reads process.env.NODE_ENV, so the development warnings are ` +
			`compiled in or out for every consumer. Keep the expression out of the library build's define.`
	);
	process.exit(1);
}
console.log('[grove] dist leaves process.env.NODE_ENV to the consumer');
