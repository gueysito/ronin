import { describe, it, expect } from 'vitest';
import { chatRequestSchema } from '$lib/server/schemas/chat';

describe('chatRequestSchema', () => {
	const validRequest = {
		messages: [
			{ id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello Musashi' }] }
		]
	};

	it('accepts a valid chat request', () => {
		const result = chatRequestSchema.safeParse(validRequest);
		expect(result.success).toBe(true);
	});

	it('accepts multiple messages', () => {
		const result = chatRequestSchema.safeParse({
			messages: [
				{ id: '1', role: 'user', parts: [{ type: 'text', text: 'Hi' }] },
				{ id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hello!' }] },
				{ id: '3', role: 'user', parts: [{ type: 'text', text: 'How do I pass guard?' }] }
			]
		});
		expect(result.success).toBe(true);
	});

	it('rejects empty messages array', () => {
		const result = chatRequestSchema.safeParse({ messages: [] });
		expect(result.success).toBe(false);
	});

	it('rejects missing messages field', () => {
		const result = chatRequestSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it('rejects message without id', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ role: 'user', parts: [{ type: 'text', text: 'Hi' }] }]
		});
		expect(result.success).toBe(false);
	});

	it('rejects message with invalid role', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ id: '1', role: 'admin', parts: [{ type: 'text', text: 'Hi' }] }]
		});
		expect(result.success).toBe(false);
	});

	it('accepts message without parts (optional)', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ id: '1', role: 'user' }]
		});
		expect(result.success).toBe(true);
	});
});
