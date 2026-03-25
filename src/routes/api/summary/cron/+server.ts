import { json, error } from '@sveltejs/kit';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { users, sessions, events, techniques, conversations, messages } from '$lib/server/db/schema';
import { eq, and, gte, desc, count } from 'drizzle-orm';
import { CRON_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

const BATCH_SIZE = 5;

export const GET: RequestHandler = async ({ request }) => {
	// Verify this is called by Vercel Cron (or allow in dev)
	const authHeader = request.headers.get('authorization');
	if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
		error(401, 'Unauthorized');
	}

	const allUsers = await db.query.users.findMany({
		where: eq(users.onboardingCompleted, true)
	});

	const weekAgo = new Date(Date.now() - 7 * 86400000);
	const anthropic = createAnthropic({ apiKey: ANTHROPIC_API_KEY });
	let processed = 0;
	let skipped = 0;

	// Process users in batches to avoid timeout
	for (let i = 0; i < allUsers.length; i += BATCH_SIZE) {
		const batch = allUsers.slice(i, i + BATCH_SIZE);

		const results = await Promise.allSettled(
			batch.map(async (user) => {
				// Skip if already summarized this week
				const existingConv = await db.query.conversations.findFirst({
					where: eq(conversations.userId, user.id),
					orderBy: [desc(conversations.createdAt)]
				});
				if (existingConv) {
					const recentSummary = await db.query.messages.findFirst({
						where: and(
							eq(messages.conversationId, existingConv.id),
							gte(messages.createdAt, weekAgo)
						)
					});
					if (recentSummary && typeof recentSummary.metadata === 'object' && recentSummary.metadata !== null && 'type' in recentSummary.metadata && recentSummary.metadata.type === 'weekly_summary') {
						return 'skipped';
					}
				}

				const weekSessions = await db.query.sessions.findMany({
					where: and(eq(sessions.userId, user.id), gte(sessions.date, weekAgo)),
					orderBy: [desc(sessions.date)]
				});

				if (weekSessions.length === 0) return 'skipped';

				const weekEvents = await db
					.select({
						techniqueName: techniques.name,
						eventType: events.type,
						total: count()
					})
					.from(events)
					.innerJoin(sessions, eq(events.sessionId, sessions.id))
					.innerJoin(techniques, eq(events.techniqueId, techniques.id))
					.where(and(eq(events.userId, user.id), gte(sessions.date, weekAgo)))
					.groupBy(techniques.name, events.type);

				const totalSessions = weekSessions.length;
				const totalMinutes = weekSessions.reduce((s, sess) => s + sess.durationMinutes, 0);
				const avgEnergy = Math.round((weekSessions.reduce((s, sess) => s + sess.energy, 0) / totalSessions) * 10) / 10;

				const successTechniques = weekEvents.filter(e => e.eventType === 'success').sort((a, b) => Number(b.total) - Number(a.total));
				const againstTechniques = weekEvents.filter(e => e.eventType === 'against').sort((a, b) => Number(b.total) - Number(a.total));

				const summaryData = `
WEEKLY DATA: ${totalSessions} sessions (goal: ${user.trainingGoalDays}/week), ${Math.round(totalMinutes / 60 * 10) / 10}h, avg energy ${avgEnergy}/5.
HIT: ${successTechniques.map(t => `${t.techniqueName}(${t.total})`).join(', ') || 'none'}
CAUGHT BY: ${againstTechniques.map(t => `${t.techniqueName}(${t.total})`).join(', ') || 'none'}
PROFILE: ${user.belt} belt, goals: ${(user.goals ?? []).join(', ') || 'none'}`;

				const result = await generateText({
					model: anthropic('claude-haiku-4-5'),
					system: `You are Musashi, a wise BJJ coach. Generate a weekly summary in 4-6 sentences. Be specific with numbers. Include: consistency check, highlight, pattern, focus for next week, brief closing.`,
					prompt: summaryData
				});

				let conversation = existingConv;
				if (!conversation) {
					const [newConv] = await db.insert(conversations).values({ userId: user.id }).returning();
					conversation = newConv;
				}

				await db.insert(messages).values({
					conversationId: conversation.id,
					userId: user.id,
					role: 'assistant',
					content: result.text,
					metadata: { type: 'weekly_summary', weekOf: weekAgo.toISOString() }
				});

				return 'processed';
			})
		);

		for (const result of results) {
			if (result.status === 'fulfilled') {
				if (result.value === 'processed') processed++;
				else skipped++;
			} else {
				console.error('[cron] summary failed:', result.reason);
			}
		}
	}

	return json({ processed, skipped, total: allUsers.length });
};
