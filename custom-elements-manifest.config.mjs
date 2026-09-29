// Generates dist/custom-elements.json from the component sources; see scripts/check-manifest.mjs.
import { expandTypesPlugin } from './scripts/manifest-types.mjs';

export default {
	globs: ['src/lib/components/*/*.ts'],
	exclude: [
		'src/lib/components/**/*.stories.ts',
		'src/lib/components/**/*.test.ts',
		'src/lib/components/**/*.metadata.ts',
		'src/lib/components/Icon/phosphor.ts'
	],
	outdir: 'dist',
	litelement: true,
	plugins: [expandTypesPlugin()]
};
