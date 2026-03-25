import { describe, it, expect } from 'vitest';
import { sessionSchema } from '$lib/server/schemas/session';

describe('sessionSchema', () => {
	const validSession = {
		type: 'rolling',
		durationMinutes: 60,
		intensityRpe: 7,
		energy: 8
	};

	it('accepts a valid minimal session', () => {
		const result = sessionSchema.safeParse(validSession);
		expect(result.success).toBe(true);
	});

	it('accepts a valid full session', () => {
		const result = sessionSchema.safeParse({
			...validSession,
			mood: 'focused',
			notes: 'Good rolls today',
			positionsWorked: ['closed_guard', 'half_guard'],
			techniquesHit: [{ slug: 'armbar', count: 2 }],
			techniquesAgainst: [{ slug: 'triangle' }]
		});
		expect(result.success).toBe(true);
	});

	it('rejects missing required field: type', () => {
		const { type, ...noType } = validSession;
		const result = sessionSchema.safeParse(noType);
		expect(result.success).toBe(false);
	});

	it('rejects missing required field: durationMinutes', () => {
		const { durationMinutes, ...noDuration } = validSession;
		const result = sessionSchema.safeParse(noDuration);
		expect(result.success).toBe(false);
	});

	it('rejects missing required field: intensityRpe', () => {
		const { intensityRpe, ...noRpe } = validSession;
		const result = sessionSchema.safeParse(noRpe);
		expect(result.success).toBe(false);
	});

	it('rejects missing required field: energy', () => {
		const { energy, ...noEnergy } = validSession;
		const result = sessionSchema.safeParse(noEnergy);
		expect(result.success).toBe(false);
	});

	it('rejects invalid session type', () => {
		const result = sessionSchema.safeParse({ ...validSession, type: 'yoga' });
		expect(result.success).toBe(false);
	});

	it('rejects RPE out of range (0)', () => {
		const result = sessionSchema.safeParse({ ...validSession, intensityRpe: 0 });
		expect(result.success).toBe(false);
	});

	it('rejects RPE out of range (11)', () => {
		const result = sessionSchema.safeParse({ ...validSession, intensityRpe: 11 });
		expect(result.success).toBe(false);
	});

	it('rejects negative duration', () => {
		const result = sessionSchema.safeParse({ ...validSession, durationMinutes: -10 });
		expect(result.success).toBe(false);
	});

	it('rejects invalid mood value', () => {
		const result = sessionSchema.safeParse({ ...validSession, mood: 'happy' });
		expect(result.success).toBe(false);
	});

	it('defaults positionsWorked to empty array', () => {
		const result = sessionSchema.parse(validSession);
		expect(result.positionsWorked).toEqual([]);
	});

	it('defaults techniquesHit to empty array', () => {
		const result = sessionSchema.parse(validSession);
		expect(result.techniquesHit).toEqual([]);
	});

	it('rejects technique entry with empty slug', () => {
		const result = sessionSchema.safeParse({
			...validSession,
			techniquesHit: [{ slug: '' }]
		});
		expect(result.success).toBe(false);
	});
});
