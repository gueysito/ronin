import { json, error } from '@sveltejs/kit';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { users, sessions, events, techniques, conversations, messages } from '$lib/server/db/schema';
import { eq, and, gte, desc, count } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) error(401, 'Unauthorized');

	const user = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});
	if (!user) error(404, 'User not found');

	// Check if a summary was already generated this week
	const weekAgo = new Date(Date.now() - 7 * 86400000);

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
			return json({ summary: recentSummary.content, cached: true });
		}
	}

	const weekSessions = await db.query.sessions.findMany({
		where: and(eq(sessions.userId, user.id), gte(sessions.date, weekAgo)),
		orderBy: [desc(sessions.date)]
	});

	if (weekSessions.length === 0) {
		return json({ summary: null, message: 'No sessions this week' });
	}

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
	const totalMinutes = weekSessions.reduce((s, session) => s + session.durationMinutes, 0);
	const avgEnergy =
		Math.round((weekSessions.reduce((s, session) => s + session.energy, 0) / totalSessions) * 10) /
		10;
	const avgIntensity =
		Math.round(
			(weekSessions.reduce((s, session) => s + session.intensityRpe, 0) / totalSessions) * 10
		) / 10;

	const successTechniques = weekEvents
		.filter((e) => e.eventType === 'success')
		.sort((a, b) => Number(b.total) - Number(a.total));
	const againstTechniques = weekEvents
		.filter((e) => e.eventType === 'against')
		.sort((a, b) => Number(b.total) - Number(a.total));

	const moodCounts: Record<string, number> = {};
	for (const s of weekSessions) {
		if (s.mood) moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
	}

	const summaryData = `
WEEKLY TRAINING DATA:
- Sessions: ${totalSessions} (goal: ${user.trainingGoalDays} days/week)
- Total training time: ${totalMinutes} minutes (${Math.round((totalMinutes / 60) * 10) / 10} hours)
- Average intensity: ${avgIntensity}/10 RPE
- Average energy: ${avgEnergy}/5
- Moods: ${Object.entries(moodCounts).map(([k, v]) => `${k}: ${v}`).join(', ') || 'not tracked'}

TECHNIQUES HIT (successes):
${successTechniques.map((t) => `- ${t.techniqueName}: ${t.total} times`).join('\n') || '- None recorded'}

TECHNIQUES RECEIVED (caught by):
${againstTechniques.map((t) => `- ${t.techniqueName}: ${t.total} times`).join('\n') || '- None recorded'}

USER PROFILE:
- Belt: ${user.belt}
- Goals: ${(user.goals ?? []).join(', ') || 'not set'}
- Struggles: ${(user.struggles ?? []).join(', ') || 'not set'}
`;

	const anthropic = createAnthropic({ apiKey: ANTHROPIC_API_KEY });

	const result = await generateText({
		model: anthropic('claude-haiku-4-5'),
		system: `You are Musashi, a wise BJJ coach. Generate a weekly training summary for your student.

STRUCTURE (4-6 sentences):
1. Consistency check: "You trained X days this week (goal: Y)."
2. Highlight: Best performance moment or trend with specific numbers.
3. Pattern: Something the data reveals -- good or concerning.
4. Focus for next week: One specific drill or concept with reasoning.
5. Brief motivational closing. Use a philosophical quote roughly 1 in 3 weeks.

TONE: Calm, specific, analytical, encouraging. Reference actual numbers from the data. Keep it under 6 sentences.`,
		prompt: summaryData
	});

	let conversation = await db.query.conversations.findFirst({
		where: eq(conversations.userId, user.id),
		orderBy: [desc(conversations.createdAt)]
	});

	if (!conversation) {
		const [newConv] = await db
			.insert(conversations)
			.values({
				userId: user.id
			})
			.returning();
		conversation = newConv;
	}

	await db.insert(messages).values({
		conversationId: conversation.id,
		userId: user.id,
		role: 'assistant',
		content: result.text,
		metadata: { type: 'weekly_summary', weekOf: weekAgo.toISOString() }
	});

	return json({ summary: result.text });
};
