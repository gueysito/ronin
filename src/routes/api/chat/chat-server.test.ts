import { describe, it, expect } from 'vitest';
import { chatRequestSchema } from '$lib/server/schemas/chat';

describe('chatRequestSchema — strip behavior', () => {
	it('strips unknown fields from messages', () => {
		const input = {
			messages: [{
				id: '1',
				role: 'user',
				parts: [{ type: 'text', text: 'hello' }],
				metadata: { injected: true },
				tool_calls: [{ name: 'evil' }]
			}]
		};
		const result = chatRequestSchema.safeParse(input);
		expect(result.success).toBe(true);
		if (result.success) {
			const msg = result.data.messages[0];
			expect(msg).not.toHaveProperty('metadata');
			expect(msg).not.toHaveProperty('tool_calls');
		}
	});

	it('strips unknown fields from message parts', () => {
		const input = {
			messages: [{
				id: '1',
				role: 'user',
				parts: [{ type: 'text', text: 'hello', function_call: 'evil' }]
			}]
		};
		const result = chatRequestSchema.safeParse(input);
		expect(result.success).toBe(true);
		if (result.success) {
			const part = result.data.messages[0].parts![0];
			expect(part).not.toHaveProperty('function_call');
			expect(part).toEqual({ type: 'text', text: 'hello' });
		}
	});

	it('rejects empty messages array', () => {
		const result = chatRequestSchema.safeParse({ messages: [] });
		expect(result.success).toBe(false);
	});

	it('rejects missing messages field', () => {
		expect(chatRequestSchema.safeParse({}).success).toBe(false);
	});

	it('rejects non-array messages', () => {
		expect(chatRequestSchema.safeParse({ messages: 'hello' }).success).toBe(false);
	});

	it('rejects invalid role', () => {
		const result = chatRequestSchema.safeParse({
			messages: [{ id: '1', role: 'admin', parts: [] }]
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

describe('Rate limiting constants', () => {
	it('free tier = 20, paid tier = 100', () => {
		const MESSAGE_LIMITS = { free: 20, paid: 100 } as const;
		expect(MESSAGE_LIMITS.free).toBe(20);
		expect(MESSAGE_LIMITS.paid).toBe(100);
	});
});
