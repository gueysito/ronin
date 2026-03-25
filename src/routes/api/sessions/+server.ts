import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, sessions, events, techniques } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) error(401, 'Unauthorized');

	const user = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});
	if (!user) error(404, 'User not found');

	const body = await request.json();

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
