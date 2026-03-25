export function getWeekStart(now: Date = new Date()): Date {
	const day = now.getUTCDay();
	const diff = day === 0 ? 6 : day - 1; // Monday = 0
	const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff));
	return monday;
}
