import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { techniques, conversations, messages } from '$lib/server/db/schema';
import { asc, eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { profile } = await parent();

	const allTechniques = await db.query.techniques.findMany({
		orderBy: [asc(techniques.sortOrder)]
	});

	// Load saved conversation messages
	const conversation = await db.query.conversations.findFirst({
		where: eq(conversations.userId, profile.id),
		orderBy: [desc(conversations.createdAt)]
	});

	let savedMessages: { role: string; content: string }[] = [];
	if (conversation) {
		const dbMessages = await db.query.messages.findMany({
			where: eq(messages.conversationId, conversation.id),
			orderBy: [asc(messages.createdAt)],
			limit: 50
		});
		savedMessages = dbMessages.map((m) => ({
			role: m.role,
			content: m.content
		}));
	}

	return {
		techniques: allTechniques.map((t) => ({
			slug: t.slug,
			name: t.name,
			domain: t.domain,
			beltLevel: t.beltLevel
		})),
		savedMessages
	};
};
