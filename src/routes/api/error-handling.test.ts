import { describe, it, expect } from 'vitest';
import { chatRequestSchema } from '$lib/server/schemas/chat';
import { sessionSchema } from '$lib/server/schemas/session';

describe('Chat request validation errors', () => {
	it('rejects empty messages array with min(1) error', () => {
		const result = chatRequestSchema.safeParse({ messages: [] });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain('least');
		}
	});

	it('rejects missing messages field', () => {
		expect(chatRequestSchema.safeParse({}).success).toBe(false);
	});

	it('rejects non-array messages', () => {
		expect(chatRequestSchema.safeParse({ messages: 'hello' }).success).toBe(false);
	});

	it('rejects message with invalid role', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ id: '1', role: 'admin' }]
		});
		expect(result.success).toBe(false);
	});

	it('rejects message missing id', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ role: 'user' }]
		});
		expect(result.success).toBe(false);
	});
});

describe('Session validation errors', () => {
	it('rejects missing type', () => {
		expect(sessionSchema.safeParse({ durationMinutes: 60, intensityRpe: 7, energy: 4 }).success).toBe(false);
	});

	it('rejects missing durationMinutes', () => {
		expect(sessionSchema.safeParse({ type: 'rolling', intensityRpe: 7, energy: 4 }).success).toBe(false);
	});

	it('rejects missing intensityRpe', () => {
		expect(sessionSchema.safeParse({ type: 'rolling', durationMinutes: 60, energy: 4 }).success).toBe(false);
	});

	it('rejects missing energy', () => {
		expect(sessionSchema.safeParse({ type: 'rolling', durationMinutes: 60, intensityRpe: 7 }).success).toBe(false);
	});

	it('rejects invalid type', () => {
		expect(sessionSchema.safeParse({
			type: 'yoga', durationMinutes: 60, intensityRpe: 7, energy: 4
		}).success).toBe(false);
	});

	it('provides multiple error messages for multiple failures', () => {
		const result = sessionSchema.safeParse({});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.length).toBeGreaterThan(1);
		}
	});
});
