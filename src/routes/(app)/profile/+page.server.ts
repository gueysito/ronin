import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { messageCounts } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { profile } = await parent();

	const now = new Date();
	const startOfWeek = getStartOfWeek(now);

	const weekCount = await db.query.messageCounts.findFirst({
		where: and(
			eq(messageCounts.userId, profile.id),
			gte(messageCounts.weekStart, startOfWeek)
		)
	});

	const messageLimit = profile.subscriptionTier === 'paid' ? 100 : 20;

	return {
		messagesThisWeek: weekCount?.count ?? 0,
		messageLimit
	};
};

function getStartOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	d.setDate(diff);
	d.setHours(0, 0, 0, 0);
	return d;
}
