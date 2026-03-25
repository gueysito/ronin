import { z } from 'zod';

const uiMessagePartSchema = z.object({
	type: z.string(),
	text: z.string().optional()
}).passthrough();

const uiMessageSchema = z.object({
	id: z.string(),
	role: z.enum(['user', 'assistant', 'system']),
	parts: z.array(uiMessagePartSchema).optional()
}).passthrough();

export const chatRequestSchema = z.object({
	messages: z.array(uiMessageSchema).min(1, 'At least one message is required')
});
