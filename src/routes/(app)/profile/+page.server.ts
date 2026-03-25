import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { messageCounts } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { getWeekStart } from '$lib/server/utils/week';

export const load: PageServerLoad = async ({ parent }) => {
	const { profile } = await parent();

	const weekStart = getWeekStart();

	const weekCount = await db.query.messageCounts.findFirst({
		where: and(
			eq(messageCounts.userId, profile.id),
			gte(messageCounts.weekStart, weekStart)
		)
	});

	const messageLimit = profile.subscriptionTier === 'paid' ? 100 : 20;

	return {
		messagesThisWeek: weekCount?.count ?? 0,
		messageLimit
	};
};
