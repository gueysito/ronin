<script lang="ts">
	let { data } = $props();

	let maxVolume = $derived(Math.max(...data.weeklyVolume.map((w) => w.hours), 1));

	let progressPercent = $derived(
		Math.min(100, Math.round((data.thisWeekCount / Math.max(data.trainingGoalDays, 1)) * 100))
	);

	let energyEmoji = $derived(
		data.avgEnergy >= 4 ? '🔥' : data.avgEnergy >= 3 ? '😊' : data.avgEnergy >= 2 ? '😐' : '😓'
	);

	let energyLabel = $derived(
		data.avgEnergy >= 4
			? 'Great'
			: data.avgEnergy >= 3
				? 'Good'
				: data.avgEnergy >= 2
					? 'Average'
					: 'Low'
	);

	const moodColors: Record<string, string> = {
		confident: 'bg-success/20 text-success',
		focused: 'bg-primary/20 text-primary',
		frustrated: 'bg-danger/20 text-danger',
		anxious: 'bg-warning/20 text-warning',
		flow_state: 'bg-success/30 text-success'
	};

	const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

	function intensityClass(intensity: number, trained: boolean): string {
		if (!trained) return 'bg-surface';
		if (intensity >= 8) return 'bg-success';
		if (intensity >= 5) return 'bg-success/60';
		return 'bg-success/30';
	}
</script>

<svelte:head>
	<title>Your Progress - MatMentor</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-6 px-4 py-6">
	<h1 class="text-xl font-semibold">Your Progress</h1>

	{#if data.totalSessions === 0}
		<!-- Empty state -->
		<div class="rounded-xl bg-surface p-8 text-center">
			<p class="text-4xl">📊</p>
			<p class="mt-3 text-text-muted">
				Your training calendar and consistency stats will appear here after you log sessions.
			</p>
		</div>
	{:else}
		<!-- This Week -->
		<div class="rounded-xl bg-surface p-4">
			<h2 class="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">This Week</h2>
			<div class="flex items-baseline justify-between">
				<p class="text-text-primary">
					<span class="font-mono text-2xl font-bold">{data.thisWeekCount}</span>
					<span class="text-text-muted"> / {data.trainingGoalDays} sessions</span>
				</p>
			</div>
			<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
				<div
					class="h-full rounded-full bg-primary transition-all"
					style="width: {progressPercent}%"
				></div>
			</div>

			<div class="mt-4 grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-text-muted">Current streak</p>
					<p class="font-mono text-2xl font-bold">
						{data.currentStreak}<span class="ml-1 text-sm font-normal text-text-muted">days</span>
					</p>
				</div>
				<div>
					<p class="text-sm text-text-muted">Longest streak</p>
					<p class="font-mono text-2xl font-bold">
						{data.longestStreak}<span class="ml-1 text-sm font-normal text-text-muted">days</span>
					</p>
				</div>
			</div>
		</div>

		<!-- Training Calendar -->
		<div class="rounded-xl bg-surface p-4">
			<h2 class="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">
				Training Calendar
			</h2>
			<div class="flex gap-1">
				<!-- Day labels column -->
				<div class="flex flex-col gap-1">
					{#each dayLabels as label}
						<div class="flex h-4 w-4 items-center justify-center text-[10px] text-text-muted">
							{label}
						</div>
					{/each}
				</div>
				<!-- Calendar grid: 12 columns (weeks), 7 rows (days) -->
				{#each Array(12) as _, weekIdx}
					<div class="flex flex-col gap-1">
						{#each Array(7) as _, dayIdx}
							{@const cellIdx = weekIdx * 7 + dayIdx}
							{@const day = data.calendarDays[cellIdx]}
							{#if day}
								<div
									class="h-4 w-4 rounded-sm {intensityClass(day.intensity, day.trained)}"
									title="{day.date}{day.trained ? ` (RPE ${day.intensity})` : ''}"
								></div>
							{:else}
								<div class="h-4 w-4 rounded-sm bg-surface"></div>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
			<div class="mt-2 flex items-center gap-2 text-[10px] text-text-muted">
				<span>Less</span>
				<div class="h-3 w-3 rounded-sm bg-surface"></div>
				<div class="h-3 w-3 rounded-sm bg-success/30"></div>
				<div class="h-3 w-3 rounded-sm bg-success/60"></div>
				<div class="h-3 w-3 rounded-sm bg-success"></div>
				<span>More</span>
			</div>
		</div>

		<!-- Weekly Volume -->
		<div class="rounded-xl bg-surface p-4">
			<h2 class="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">
				Weekly Volume
			</h2>
			<div class="flex flex-col gap-2">
				{#each data.weeklyVolume as week}
					<div class="flex items-center gap-3">
						<span class="w-8 text-right font-mono text-xs text-text-muted">{week.week}</span>
						<div class="flex-1">
							<div class="h-5 w-full overflow-hidden rounded bg-background">
								{#if week.hours > 0}
									<div
										class="flex h-full items-center rounded bg-primary px-2 text-xs font-medium text-text-primary transition-all"
										style="width: {(week.hours / maxVolume) * 100}%"
									>
										{#if (week.hours / maxVolume) * 100 > 20}
											{week.hours}h
										{/if}
									</div>
								{/if}
							</div>
						</div>
						{#if week.hours > 0 && (week.hours / maxVolume) * 100 <= 20}
							<span class="text-xs text-text-muted">{week.hours}h</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Energy & Recovery -->
		<div class="rounded-xl bg-surface p-4">
			<h2 class="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">
				Energy & Recovery
			</h2>

			{#if data.lowEnergyAlert}
				<div class="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
					<p class="text-sm font-medium text-warning">
						⚠️ Low energy detected in 3+ consecutive sessions. Consider rest or reduced intensity.
					</p>
				</div>
			{/if}

			<div class="flex items-center gap-4">
				<div class="text-center">
					<p class="text-3xl">{energyEmoji}</p>
					<p class="font-mono text-2xl font-bold">{data.avgEnergy}</p>
					<p class="text-xs text-text-muted">{energyLabel}</p>
				</div>
				<div class="flex-1">
					<p class="mb-2 text-sm text-text-muted">Mood (last 10 sessions)</p>
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(data.moodCounts) as [mood, count]}
							<span
								class="rounded-full px-2.5 py-0.5 text-xs font-medium {moodColors[mood] ?? 'bg-surface text-text-muted'}"
							>
								{mood.replace('_', ' ')} ({count})
							</span>
						{/each}
						{#if Object.keys(data.moodCounts).length === 0}
							<span class="text-xs text-text-muted">No mood data yet</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
