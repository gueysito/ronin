import { json, error } from '@sveltejs/kit';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { users, sessions, messageCounts, contentLinks, conversations, messages as messagesTable } from '$lib/server/db/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { buildSystemPrompt } from '$lib/server/ai/system-prompt';
import type { RequestHandler } from './$types';

const MESSAGE_LIMITS = { free: 20, paid: 100 } as const;

function getWeekStart(): Date {
	const now = new Date();
	const day = now.getUTCDay();
	const diff = day === 0 ? 6 : day - 1; // Monday = 0
	const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff));
	return monday;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) {
		error(401, 'Unauthorized');
	}

	const { messages }: { messages: UIMessage[] } = await request.json();

	const user = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});

	if (!user) {
		error(404, 'User profile not found');
	}

	// Rate limiting
	const weekStart = getWeekStart();
	const limit = MESSAGE_LIMITS[user.subscriptionTier];

	const existing = await db.query.messageCounts.findFirst({
		where: and(
			eq(messageCounts.userId, user.id),
			gte(messageCounts.weekStart, weekStart)
		)
	});

	if (existing) {
		if (existing.count >= limit) {
			error(429, 'Message limit reached. Upgrade to Pro for 100 messages/week.');
		}
		await db.update(messageCounts)
			.set({ count: sql`${messageCounts.count} + 1` })
			.where(eq(messageCounts.id, existing.id));
	} else {
		await db.insert(messageCounts).values({
			userId: user.id,
			weekStart,
			count: 1
		});
	}

	const recentSessions = await db.query.sessions.findMany({
		where: eq(sessions.userId, user.id),
		orderBy: [desc(sessions.date)],
		limit: 5
	});

	// Fetch relevant videos (belt-appropriate, limit context size)
	const videos = await db.query.contentLinks.findMany({
		where: eq(contentLinks.isPrimary, true),
		limit: 15
	});

	const anthropic = createAnthropic({ apiKey: ANTHROPIC_API_KEY });

	// Ensure conversation exists for persistence
	let conversation = await db.query.conversations.findFirst({
		where: eq(conversations.userId, user.id),
		orderBy: [desc(conversations.createdAt)]
	});
	if (!conversation) {
		const [newConv] = await db.insert(conversations).values({ userId: user.id }).returning();
		conversation = newConv;
	}

	// Save the latest user message
	const lastUserMsg = messages.filter(m => m.role === 'user').pop();
	if (lastUserMsg) {
		const textContent = lastUserMsg.parts
			?.filter((p: any) => p.type === 'text')
			.map((p: any) => p.text)
			.join('') ?? '';
		if (textContent) {
			await db.insert(messagesTable).values({
				conversationId: conversation.id,
				role: 'user',
				content: textContent
			});
		}
	}

	const result = streamText({
		model: anthropic('claude-haiku-4-5'),
		system: buildSystemPrompt(user, recentSessions, videos),
		messages: await convertToModelMessages(messages),
		maxRetries: 2,
		onFinish: async ({ text }) => {
			// Save assistant response
			await db.insert(messagesTable).values({
				conversationId: conversation.id,
				role: 'assistant',
				content: text
			});
		}
	});

	return result.toUIMessageStreamResponse();
};
