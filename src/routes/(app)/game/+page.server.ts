import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sessions, events, techniques } from '$lib/server/db/schema';
import { eq, and, gte, lt, desc, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, parent }) => {
	const { profile } = await parent();
	const range = url.searchParams.get('range') ?? '30d';

	const now = new Date();
	let since: Date;
	if (range === '7d') since = new Date(now.getTime() - 7 * 86_400_000);
	else if (range === '30d') since = new Date(now.getTime() - 30 * 86_400_000);
	else since = new Date(0);

	const periodMs = now.getTime() - since.getTime();
	const prevSince = new Date(since.getTime() - periodMs);

	const totalExpr = sql<number>`coalesce(sum(${events.count}), 0)::int`;

	// Submission breakdown by technique (type = 'success')
	const submissionStats = await db
		.select({
			techniqueName: techniques.name,
			total: totalExpr
		})
		.from(events)
		.innerJoin(sessions, eq(events.sessionId, sessions.id))
		.innerJoin(techniques, eq(events.techniqueId, techniques.id))
		.where(
			and(
				eq(events.userId, profile.id),
				eq(events.type, 'success'),
				gte(sessions.date, since)
			)
		)
		.groupBy(techniques.name);

	// Previous period total for trend
	const [prevTotal] = await db
		.select({ total: totalExpr })
		.from(events)
		.innerJoin(sessions, eq(events.sessionId, sessions.id))
		.where(
			and(
				eq(events.userId, profile.id),
				eq(events.type, 'success'),
				gte(sessions.date, prevSince),
				lt(sessions.date, since)
			)
		);

	// Common Holes (techniques received against)
	const holesData = await db
		.select({
			techniqueName: techniques.name,
			total: totalExpr
		})
		.from(events)
		.innerJoin(sessions, eq(events.sessionId, sessions.id))
		.innerJoin(techniques, eq(events.techniqueId, techniques.id))
		.where(
			and(
				eq(events.userId, profile.id),
				eq(events.type, 'against'),
				gte(sessions.date, since)
			)
		)
		.groupBy(techniques.name)
		.orderBy(desc(totalExpr))
		.limit(5);

	// Position breakdown from sessions.positionsWorked jsonb
	const sessionPositions = await db
		.select({ positionsWorked: sessions.positionsWorked })
		.from(sessions)
		.where(and(eq(sessions.userId, profile.id), gte(sessions.date, since)));

	const positionCounts: Record<string, number> = {};
	for (const s of sessionPositions) {
		for (const pos of s.positionsWorked ?? []) {
			positionCounts[pos] = (positionCounts[pos] || 0) + 1;
		}
	}

	const currentTotal = submissionStats.reduce((sum, s) => sum + Number(s.total), 0);
	const previousTotal = Number(prevTotal?.total ?? 0);
	const trendPercent =
		previousTotal > 0
			? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
			: currentTotal > 0
				? 100
				: 0;

	const sortedSubs = [...submissionStats].sort((a, b) => Number(b.total) - Number(a.total));

	return {
		range,
		totalSubmissions: currentTotal,
		trendPercent,
		submissionBreakdown: sortedSubs.map((s) => ({
			name: s.techniqueName,
			count: Number(s.total)
		})),
		topWeapons: sortedSubs.slice(0, 3).map((s) => s.techniqueName),
		commonHoles: holesData.map((h) => ({
			name: h.techniqueName,
			count: Number(h.total)
		})),
		positionBreakdown: Object.entries(positionCounts)
			.sort(([, a], [, b]) => b - a)
			.map(([name, count]) => ({ name: formatPositionName(name), count }))
	};
};

function formatPositionName(slug: string): string {
	return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
