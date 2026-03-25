import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { profile } = await parent();

	const allSessions = await db.query.sessions.findMany({
		where: eq(sessions.userId, profile.id),
		orderBy: [desc(sessions.date)]
	});

	const now = new Date();
	const startOfWeek = getStartOfWeek(now);

	const thisWeekSessions = allSessions.filter((s) => s.date >= startOfWeek);

	// Current streak (consecutive days trained)
	const trainedDates = new Set(allSessions.map((s) => toDateString(s.date)));
	let currentStreak = 0;
	let checkDate = new Date(now);
	if (!trainedDates.has(toDateString(checkDate))) {
		checkDate.setDate(checkDate.getDate() - 1);
	}
	while (trainedDates.has(toDateString(checkDate))) {
		currentStreak++;
		checkDate.setDate(checkDate.getDate() - 1);
	}

	// Longest streak
	let longestStreak = 0;
	let tempStreak = 0;
	const sortedDates = [...trainedDates].sort();
	for (let i = 0; i < sortedDates.length; i++) {
		if (i === 0) {
			tempStreak = 1;
		} else {
			const prev = new Date(sortedDates[i - 1]);
			const curr = new Date(sortedDates[i]);
			const diff = (curr.getTime() - prev.getTime()) / 86400000;
			tempStreak = diff === 1 ? tempStreak + 1 : 1;
		}
		longestStreak = Math.max(longestStreak, tempStreak);
	}

	// Calendar data (last 12 weeks = 84 days)
	const calendarStart = new Date(now.getTime() - 84 * 86400000);
	const calendarDays: { date: string; trained: boolean; intensity: number }[] = [];
	for (let i = 0; i < 84; i++) {
		const d = new Date(calendarStart.getTime() + i * 86400000);
		const dateStr = toDateString(d);
		const daySessions = allSessions.filter((s) => toDateString(s.date) === dateStr);
		const maxIntensity =
			daySessions.length > 0 ? Math.max(...daySessions.map((s) => s.intensityRpe)) : 0;
		calendarDays.push({
			date: dateStr,
			trained: daySessions.length > 0,
			intensity: maxIntensity
		});
	}

	// Weekly volume (last 8 weeks): total hours per week
	const weeklyVolume: { week: string; hours: number }[] = [];
	for (let w = 0; w < 8; w++) {
		const weekEnd = new Date(now.getTime() - w * 7 * 86400000);
		const weekStart = new Date(weekEnd.getTime() - 7 * 86400000);
		const weekSessions = allSessions.filter((s) => s.date >= weekStart && s.date < weekEnd);
		const totalMinutes = weekSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
		weeklyVolume.push({
			week: `W${8 - w}`,
			hours: Math.round((totalMinutes / 60) * 10) / 10
		});
	}
	weeklyVolume.reverse();

	// Energy & mood from last 10 sessions
	const recentSessions = allSessions.slice(0, 10);
	const avgEnergy =
		recentSessions.length > 0
			? Math.round(
					(recentSessions.reduce((sum, s) => sum + s.energy, 0) / recentSessions.length) * 10
				) / 10
			: 0;

	const moodCounts: Record<string, number> = {};
	for (const s of recentSessions) {
		if (s.mood) moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
	}

	// Low energy alert: 3+ consecutive sessions with energy <= 2
	const last5 = allSessions.slice(0, 5);
	let consecutiveLow = 0;
	for (const s of last5) {
		if (s.energy <= 2) consecutiveLow++;
		else break;
	}
	const lowEnergyAlert = consecutiveLow >= 3;

	return {
		trainingGoalDays: profile.trainingGoalDays,
		thisWeekCount: thisWeekSessions.length,
		currentStreak,
		longestStreak,
		calendarDays,
		weeklyVolume,
		avgEnergy,
		moodCounts,
		lowEnergyAlert,
		totalSessions: allSessions.length
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

function toDateString(d: Date): string {
	return d.toISOString().split('T')[0];
}
