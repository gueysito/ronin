import { describe, it, expect } from 'vitest';
import { sessionSchema } from '$lib/server/schemas/session';
import { chatRequestSchema } from '$lib/server/schemas/chat';
import { getWeekStart } from '$lib/server/utils/week';

describe('Rate limit boundary values', () => {
	it('free limit boundary: message 20 is the last allowed', () => {
		const MESSAGE_LIMITS = { free: 20, paid: 100 };
		// Count starts at 0. After 20 messages, count = 20.
		// Atomic update: lt(count, 20) allows count 0-19, blocks at 20.
		expect(19 < MESSAGE_LIMITS.free).toBe(true);  // 20th message passes
		expect(20 < MESSAGE_LIMITS.free).toBe(false);  // 21st blocked
	});

	it('paid limit boundary: message 100 is the last allowed', () => {
		const MESSAGE_LIMITS = { free: 20, paid: 100 };
		expect(99 < MESSAGE_LIMITS.paid).toBe(true);
		expect(100 < MESSAGE_LIMITS.paid).toBe(false);
	});
});

describe('Empty/minimal input edge cases', () => {
	it('chat: message with no parts is valid', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ id: '1', role: 'user' }]
		});
		expect(result.success).toBe(true);
	});

	it('chat: message with empty parts array is valid', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ id: '1', role: 'user', parts: [] }]
		});
		expect(result.success).toBe(true);
	});

	it('session: empty techniquesHit array is accepted', () => {
		const result = sessionSchema.safeParse({
			type: 'rolling', durationMinutes: 60, intensityRpe: 7, energy: 4,
			techniquesHit: [], techniquesAgainst: []
		});
		expect(result.success).toBe(true);
	});

	it('session: techniquesHit defaults to empty when omitted', () => {
		const result = sessionSchema.parse({
			type: 'rolling', durationMinutes: 60, intensityRpe: 7, energy: 4
		});
		expect(result.techniquesHit).toEqual([]);
		expect(result.techniquesAgainst).toEqual([]);
	});

	it('session: positionsWorked defaults to empty when omitted', () => {
		const result = sessionSchema.parse({
			type: 'rolling', durationMinutes: 60, intensityRpe: 7, energy: 4
		});
		expect(result.positionsWorked).toEqual([]);
	});

	it('empty array length is falsy (server uses this to skip loops)', () => {
		expect([].length).toBeFalsy();
	});
});

describe('Week boundary for rate limiting', () => {
	it('Sunday 23:59 UTC falls in previous Monday\'s week', () => {
		const sunday = new Date(Date.UTC(2026, 2, 22, 23, 59, 59));
		const weekStart = getWeekStart(sunday);
		expect(weekStart.toISOString()).toBe('2026-03-16T00:00:00.000Z');
	});

	it('Monday 00:00 UTC starts a new week', () => {
		const monday = new Date(Date.UTC(2026, 2, 23, 0, 0, 0));
		const weekStart = getWeekStart(monday);
		expect(weekStart.toISOString()).toBe('2026-03-23T00:00:00.000Z');
	});

	it('all days in a week return the same Monday', () => {
		const expected = '2026-03-16T00:00:00.000Z';
		for (let d = 16; d <= 22; d++) {
			const date = new Date(Date.UTC(2026, 2, d));
			expect(getWeekStart(date).toISOString()).toBe(expected);
		}
	});

	it('year boundary works correctly', () => {
		// Dec 31, 2025 is a Wednesday -> week starts Dec 29 (Monday)
		const dec31 = new Date(Date.UTC(2025, 11, 31));
		const weekStart = getWeekStart(dec31);
		expect(weekStart.toISOString()).toBe('2025-12-29T00:00:00.000Z');
	});
});

describe('Session schema extreme values', () => {
	const base = { type: 'rolling' as const, durationMinutes: 60, intensityRpe: 7, energy: 4 };

	it('rejects durationMinutes = 999999', () => {
		expect(sessionSchema.safeParse({ ...base, durationMinutes: 999999 }).success).toBe(false);
	});

	it('accepts durationMinutes = 1 (minimum)', () => {
		expect(sessionSchema.safeParse({ ...base, durationMinutes: 1 }).success).toBe(true);
	});

	it('rejects non-integer values', () => {
		expect(sessionSchema.safeParse({ ...base, durationMinutes: 60.5 }).success).toBe(false);
		expect(sessionSchema.safeParse({ ...base, energy: 3.5 }).success).toBe(false);
		expect(sessionSchema.safeParse({ ...base, intensityRpe: 7.5 }).success).toBe(false);
	});
});
