// Generates dist/custom-elements.json from the component sources; see scripts/check-manifest.mjs.
import { expandTypesPlugin } from './scripts/manifest-types.mjs';

export default {
	// The form-control mixin is analyzed too, so components that extend it list its public members.
	globs: ['src/lib/components/*/*.ts', 'src/lib/utils/form-control.ts'],
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
