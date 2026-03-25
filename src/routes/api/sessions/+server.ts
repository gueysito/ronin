import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, sessions, events, techniques } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { RequestHandler } from './$types';

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

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) error(401, 'Unauthorized');

	const user = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});
	if (!user) error(404, 'User not found');

	const rawBody = await request.json();
	const parsed = sessionSchema.safeParse(rawBody);
	if (!parsed.success) {
		error(400, `Invalid session data: ${parsed.error.issues.map((i) => i.message).join(', ')}`);
	}
	const body = parsed.data;

	const [session] = await db.insert(sessions).values({
		userId: user.id,
		date: new Date(),
		type: body.type,
		durationMinutes: body.durationMinutes,
		intensityRpe: body.intensityRpe,
		energy: body.energy,
		mood: body.mood || null,
		notes: body.notes || null,
		positionsWorked: body.positionsWorked || []
	}).returning();

	if (body.techniquesHit?.length) {
		for (const tech of body.techniquesHit) {
			const technique = await db.query.techniques.findFirst({
				where: eq(techniques.slug, tech.slug)
			});
			if (technique) {
				await db.insert(events).values({
					sessionId: session.id,
					userId: user.id,
					techniqueId: technique.id,
					type: 'success',
					count: tech.count || 1
				});
			}
		}
	}

	if (body.techniquesAgainst?.length) {
		for (const tech of body.techniquesAgainst) {
			const technique = await db.query.techniques.findFirst({
				where: eq(techniques.slug, tech.slug)
			});
			if (technique) {
				await db.insert(events).values({
					sessionId: session.id,
					userId: user.id,
					techniqueId: technique.id,
					type: 'against',
					count: 1
				});
			}
		}
	}

	return json({ id: session.id });
};
