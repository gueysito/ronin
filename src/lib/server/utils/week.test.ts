import { describe, it, expect } from 'vitest';
import { getWeekStart } from './week';

describe('getWeekStart', () => {
	it('returns Monday for a Wednesday', () => {
		// 2026-03-18 is Wednesday
		const wed = new Date(Date.UTC(2026, 2, 18, 15, 0, 0));
		const result = getWeekStart(wed);
		expect(result.getUTCDay()).toBe(1); // Monday
		expect(result.toISOString()).toBe('2026-03-16T00:00:00.000Z');
	});

	it('returns Monday for a Monday', () => {
		// 2026-03-16 is Monday
		const mon = new Date(Date.UTC(2026, 2, 16, 10, 0, 0));
		const result = getWeekStart(mon);
		expect(result.toISOString()).toBe('2026-03-16T00:00:00.000Z');
	});

	it('returns previous Monday for a Sunday', () => {
		// 2026-03-22 is Sunday
		const sun = new Date(Date.UTC(2026, 2, 22, 23, 59, 59));
		const result = getWeekStart(sun);
		expect(result.toISOString()).toBe('2026-03-16T00:00:00.000Z');
	});

	it('handles Sunday midnight UTC boundary', () => {
		// 2026-03-23 00:00:00 UTC is Monday
		const mondayMidnight = new Date(Date.UTC(2026, 2, 23, 0, 0, 0));
		const result = getWeekStart(mondayMidnight);
		expect(result.toISOString()).toBe('2026-03-23T00:00:00.000Z');
	});

	it('handles Saturday', () => {
		// 2026-03-21 is Saturday
		const sat = new Date(Date.UTC(2026, 2, 21, 12, 0, 0));
		const result = getWeekStart(sat);
		expect(result.toISOString()).toBe('2026-03-16T00:00:00.000Z');
	});

	it('handles week crossing month boundary', () => {
		// 2026-04-01 is Wednesday, Monday is 2026-03-30
		const wed = new Date(Date.UTC(2026, 3, 1, 12, 0, 0));
		const result = getWeekStart(wed);
		expect(result.toISOString()).toBe('2026-03-30T00:00:00.000Z');
	});

	it('handles week crossing year boundary', () => {
		// 2026-01-01 is Thursday, Monday is 2025-12-29
		const thu = new Date(Date.UTC(2026, 0, 1, 12, 0, 0));
		const result = getWeekStart(thu);
		expect(result.toISOString()).toBe('2025-12-29T00:00:00.000Z');
	});
});
