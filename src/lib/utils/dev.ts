declare const process: { env: { NODE_ENV?: string } };

/**
 * Development-only diagnostics are off only when the consumer's bundler has replaced
 * `process.env.NODE_ENV` with "production". Grove's own library build leaves the expression alone,
 * and an unbundled page (a CDN import) has no `process`, so both keep the warnings.
 */
export const warningsEnabled = () => {
	try {
		return process.env.NODE_ENV !== 'production';
	} catch {
		return true;
	}
};
