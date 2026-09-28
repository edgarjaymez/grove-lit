import { beforeEach, describe, expect, it } from 'vitest';
import {
	claimReport,
	missingGlyphMessage,
	phosphorModule,
	phosphorTag,
	resetReports,
	warningsEnabled
} from './phosphor.js';

describe('phosphor naming (#38 FR-15)', () => {
	it.each([
		['arrow-left', 'PhArrowLeft'],
		['check-circle', 'PhCheckCircle'],
		['info', 'PhInfo'],
		['number-circle-1', 'PhNumberCircle1']
	])('%s → %s', (name, module) => expect(phosphorModule(name)).toBe(module));

	it('sanitises names the way gv-icon renders them', () => {
		expect(phosphorTag('ArrowLeft')).toBe('ph-arrowleft');
		expect(phosphorTag('arrow_left')).toBe('ph-arrowleft');
		expect(phosphorTag('  ')).toBe('');
		expect(phosphorTag('')).toBe('');
	});
});

describe('once-per-tag bookkeeping (#38 FR-02, FR-15)', () => {
	beforeEach(resetReports);

	it('claims a tag once', () => {
		expect(claimReport('ph-tree')).toBe(true);
		expect(claimReport('ph-tree')).toBe(false);
		expect(claimReport('ph-house')).toBe(true);
	});
});

describe('the warning (#38 FR-01, FR-07, FR-08)', () => {
	it('names the tag, the value and the import', () => {
		expect(missingGlyphMessage({ name: 'warning-circle', tag: 'ph-warning-circle' })).toBe(
			`[grove] <ph-warning-circle> is not registered, so gv-icon name="warning-circle" renders nothing. Import it once in your app:\n  import '@phosphor-icons/webcomponents/PhWarningCircle';`
		);
	});

	it('shows the original value when sanitising changed it, and the host', () => {
		const message = missingGlyphMessage({
			name: 'ArrowLeft',
			tag: 'ph-arrowleft',
			host: 'gv-back-button'
		});
		expect(message).toContain('name="ArrowLeft" (read as "arrowleft")');
		expect(message).toContain('(inside <gv-back-button>)');
		expect(message).toContain('PhArrowleft');
	});
});

describe('the development gate (#38 OD1: NODE_ENV)', () => {
	it('is on under test and off when NODE_ENV is production', () => {
		const previous = process.env.NODE_ENV;
		expect(warningsEnabled()).toBe(true);
		process.env.NODE_ENV = 'production';
		expect(warningsEnabled()).toBe(false);
		process.env.NODE_ENV = previous;
	});
});
