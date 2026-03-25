import { json, error } from '@sveltejs/kit';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { buildSystemPrompt } from '$lib/server/ai/system-prompt';
import type { RequestHandler } from './$types';

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

	const recentSessions = await db.query.sessions.findMany({
		where: eq(sessions.userId, user.id),
		orderBy: [desc(sessions.date)],
		limit: 5
	});

	const anthropic = createAnthropic({ apiKey: ANTHROPIC_API_KEY });

	const result = streamText({
		model: anthropic('claude-haiku-4-5'),
		system: buildSystemPrompt(user, recentSessions),
		messages: await convertToModelMessages(messages),
		maxRetries: 2
	});

	return result.toUIMessageStreamResponse();
};
