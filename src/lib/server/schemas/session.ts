import { z } from 'zod';

const techniqueEntrySchema = z.object({
	slug: z.string().min(1),
	count: z.number().int().positive().optional()
});

export const sessionSchema = z.object({
	type: z.enum(['rolling', 'drilling', 'open_mat', 'competition', 'private_lesson']),
	durationMinutes: z.number().int().positive(),
	intensityRpe: z.number().int().min(1).max(10),
	energy: z.number().int().min(1).max(10),
	mood: z.enum(['confident', 'focused', 'frustrated', 'anxious', 'flow_state']).optional(),
	notes: z.string().optional(),
	positionsWorked: z.array(z.string()).optional().default([]),
	techniquesHit: z.array(techniqueEntrySchema).optional().default([]),
	techniquesAgainst: z.array(techniqueEntrySchema).optional().default([])
});
