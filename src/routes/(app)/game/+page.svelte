<script lang="ts">
	import { pie, arc, type PieArcDatum } from 'd3-shape';

	let { data } = $props();

	const ranges = [
		{ value: '7d', label: '7 days' },
		{ value: '30d', label: '30 days' },
		{ value: 'all', label: 'All time' }
	] as const;

	const COLORS = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

	let hasData = $derived(data.totalSubmissions > 0 || data.positionBreakdown.length > 0);

	// Pie chart geometry
	type BreakdownItem = { name: string; count: number };

	const pieGenerator = pie<BreakdownItem>()
		.value((d: BreakdownItem) => d.count)
		.sort(null);

	const arcGenerator = arc().innerRadius(40).outerRadius(80);

	let pieArcs = $derived(pieGenerator(data.submissionBreakdown));

	let maxPosition = $derived(
		data.positionBreakdown.length > 0
			? Math.max(...data.positionBreakdown.map((p) => p.count))
			: 1
	);

	const medalEmoji = ['🥇', '🥈', '🥉'];
</script>

<svelte:head>
	<title>Your Game - MatMentor</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-6 px-4 py-6">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold">Your Game</h1>

		<div class="flex gap-1 rounded-lg bg-surface p-1">
			{#each ranges as r}
				<a
					href="?range={r.value}"
					class="rounded-md px-3 py-1 text-xs font-medium transition-colors
						{data.range === r.value
						? 'bg-primary text-white'
						: 'text-text-muted hover:text-text-primary'}"
				>
					{r.label}
				</a>
			{/each}
		</div>
	</div>

	{#if !hasData}
		<div class="mt-12 flex flex-col items-center gap-4 text-center">
			<div class="text-4xl">🥋</div>
			<p class="text-text-muted">
				Log your first session to see your game here.
			</p>
			<a
				href="/chat"
				class="rounded-button bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
			>
				Tap Chat to get started
			</a>
		</div>
	{:else}
		<!-- Submission Stats -->
		<section class="rounded-xl bg-surface p-4">
			<h2 class="text-sm font-medium uppercase tracking-wide text-text-muted">
				Submissions
			</h2>
			<div class="mt-3 flex items-baseline gap-3">
				<span class="font-mono text-2xl font-bold">{data.totalSubmissions}</span>
				{#if data.trendPercent !== 0}
					<span
						class="flex items-center gap-0.5 text-sm font-medium
							{data.trendPercent > 0 ? 'text-success' : 'text-danger'}"
					>
						{#if data.trendPercent > 0}
							<svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
								<path d="M8 4l5 8H3z" />
							</svg>
						{:else}
							<svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
								<path d="M8 12L3 4h10z" />
							</svg>
						{/if}
						{Math.abs(data.trendPercent)}%
					</span>
				{/if}
			</div>

			{#if data.submissionBreakdown.length > 0}
				<div class="mt-4 flex items-center gap-6">
					<svg viewBox="-90 -90 180 180" class="h-40 w-40 shrink-0">
						{#each pieArcs as slice, i}
							<path
								d={arcGenerator(slice as any) ?? ''}
								fill={COLORS[i % COLORS.length]}
								class="transition-opacity hover:opacity-80"
							/>
						{/each}
					</svg>

					<ul class="flex flex-col gap-1.5 text-sm">
						{#each data.submissionBreakdown as item, i}
							<li class="flex items-center gap-2">
								<span
									class="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
									style="background: {COLORS[i % COLORS.length]}"
								></span>
								<span class="text-text-muted">{item.name}</span>
								<span class="font-mono font-medium">{item.count}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>

		<!-- Weapons & Holes -->
		<div class="grid grid-cols-2 gap-4">
			<!-- Top Weapons -->
			<section class="rounded-xl bg-surface p-4">
				<h2 class="text-sm font-medium uppercase tracking-wide text-text-muted">
					Top Weapons
				</h2>
				{#if data.topWeapons.length > 0}
					<ul class="mt-3 flex flex-col gap-2">
						{#each data.topWeapons as weapon, i}
							<li class="flex items-center gap-2 text-sm">
								<span>{medalEmoji[i]}</span>
								<span>{weapon}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-3 text-sm text-text-muted">No data yet</p>
				{/if}
			</section>

			<!-- Common Holes -->
			<section class="rounded-xl bg-surface p-4">
				<h2 class="text-sm font-medium uppercase tracking-wide text-text-muted">
					Common Holes
				</h2>
				{#if data.commonHoles.length > 0}
					<ul class="mt-3 flex flex-col gap-2">
						{#each data.commonHoles as hole}
							<li class="flex items-center justify-between text-sm">
								<span>{hole.name}</span>
								<span class="font-mono text-text-muted">{hole.count}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-3 text-sm text-text-muted">No data yet</p>
				{/if}
			</section>
		</div>

		<!-- Position Breakdown -->
		{#if data.positionBreakdown.length > 0}
			<section class="rounded-xl bg-surface p-4">
				<h2 class="text-sm font-medium uppercase tracking-wide text-text-muted">
					Position Breakdown
				</h2>
				<ul class="mt-3 flex flex-col gap-3">
					{#each data.positionBreakdown as position}
						<li>
							<div class="mb-1 flex items-center justify-between text-sm">
								<span>{position.name}</span>
								<span class="font-mono text-text-muted">{position.count}</span>
							</div>
							<div class="h-2 overflow-hidden rounded-full bg-musashi">
								<div
									class="h-full rounded-full bg-primary transition-all"
									style="width: {(position.count / maxPosition) * 100}%"
								></div>
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/if}
</div>
