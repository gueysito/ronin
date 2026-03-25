import { describe, it, expect } from 'vitest';
import { sessionSchema } from '$lib/server/schemas/session';

describe('sessionSchema — bounds enforcement', () => {
	const valid = { type: 'rolling' as const, durationMinutes: 60, intensityRpe: 7, energy: 4 };

	it('accepts valid session at bounds', () => {
		expect(sessionSchema.safeParse({ ...valid, durationMinutes: 720 }).success).toBe(true);
		expect(sessionSchema.safeParse({ ...valid, energy: 5 }).success).toBe(true);
		expect(sessionSchema.safeParse({ ...valid, energy: 1 }).success).toBe(true);
		expect(sessionSchema.safeParse({ ...valid, intensityRpe: 10 }).success).toBe(true);
		expect(sessionSchema.safeParse({ ...valid, intensityRpe: 1 }).success).toBe(true);
	});

	it('rejects durationMinutes > 720', () => {
		expect(sessionSchema.safeParse({ ...valid, durationMinutes: 721 }).success).toBe(false);
	});

	it('rejects durationMinutes = 0 or negative', () => {
		expect(sessionSchema.safeParse({ ...valid, durationMinutes: 0 }).success).toBe(false);
		expect(sessionSchema.safeParse({ ...valid, durationMinutes: -10 }).success).toBe(false);
	});

	it('rejects energy > 5', () => {
		expect(sessionSchema.safeParse({ ...valid, energy: 6 }).success).toBe(false);
		expect(sessionSchema.safeParse({ ...valid, energy: 10 }).success).toBe(false);
	});

	it('rejects energy = 0', () => {
		expect(sessionSchema.safeParse({ ...valid, energy: 0 }).success).toBe(false);
	});

	it('rejects float durationMinutes', () => {
		expect(sessionSchema.safeParse({ ...valid, durationMinutes: 60.5 }).success).toBe(false);
	});

	it('rejects float energy', () => {
		expect(sessionSchema.safeParse({ ...valid, energy: 3.5 }).success).toBe(false);
	});

	it('all session types are accepted', () => {
		for (const type of ['rolling', 'drilling', 'open_mat', 'competition', 'private_lesson']) {
			expect(sessionSchema.safeParse({ ...valid, type }).success).toBe(true);
		}
	});

	it('all mood values are accepted', () => {
		for (const mood of ['confident', 'focused', 'frustrated', 'anxious', 'flow_state']) {
			expect(sessionSchema.safeParse({ ...valid, mood }).success).toBe(true);
		}
	});

	it('rejects unknown mood', () => {
		expect(sessionSchema.safeParse({ ...valid, mood: 'happy' }).success).toBe(false);
	});

	it('technique entry requires non-empty slug', () => {
		expect(sessionSchema.safeParse({
			...valid, techniquesHit: [{ slug: '' }]
		}).success).toBe(false);
	});

	it('technique count must be positive integer', () => {
		expect(sessionSchema.safeParse({
			...valid, techniquesHit: [{ slug: 'armbar', count: 0 }]
		}).success).toBe(false);
		expect(sessionSchema.safeParse({
			...valid, techniquesHit: [{ slug: 'armbar', count: -1 }]
		}).success).toBe(false);
	});
});
