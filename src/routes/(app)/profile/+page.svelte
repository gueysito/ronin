<script lang="ts">
	let { data } = $props();
	let upgrading = $state(false);

	async function handleUpgrade() {
		upgrading = true;
		try {
			const res = await fetch('/api/stripe/checkout', { method: 'POST' });
			const { url } = await res.json();
			if (url) window.location.href = url;
		} catch {
			upgrading = false;
		}
	}

	const beltColors: Record<string, string> = {
		white: 'bg-slate-200 text-slate-900',
		blue: 'bg-blue-600 text-white',
		purple: 'bg-purple-600 text-white',
		brown: 'bg-amber-800 text-white',
		black: 'bg-slate-900 text-white border border-slate-600'
	};

	let initials = $derived(
		(data.profile.name ?? data.profile.email)
			.split(' ')
			.map((s: string) => s[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);

	let beltClass = $derived(beltColors[data.profile.belt] ?? beltColors.white);
	let usagePercent = $derived(Math.round((data.messagesThisWeek / data.messageLimit) * 100));
</script>

<svelte:head>
	<title>Profile - MatMentor</title>
</svelte:head>

<div class="flex flex-1 flex-col px-4 py-6 space-y-4">
	<h1 class="text-xl font-semibold">Profile</h1>

	<!-- User Info -->
	<div class="rounded-xl bg-surface p-4">
		<div class="flex items-center gap-4">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-semibold">
				{initials}
			</div>
			<div class="flex-1 min-w-0">
				{#if data.profile.name}
					<p class="font-medium truncate">{data.profile.name}</p>
				{/if}
				<p class="text-sm text-text-muted truncate">{data.profile.email}</p>
				<div class="mt-1 flex items-center gap-2">
					<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {beltClass}">
						{data.profile.belt} belt
					</span>
					<span class="text-xs text-text-muted">
						{data.profile.experienceYears} yr{data.profile.experienceYears !== 1 ? 's' : ''}
					</span>
				</div>
				<p class="mt-1 text-xs text-text-muted">
					Goal: {data.profile.trainingGoalDays}x/week
				</p>
			</div>
		</div>
		<a
			href="/onboarding"
			class="mt-3 inline-flex items-center rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/30 hover:bg-primary/10"
		>
			Edit profile
		</a>
	</div>

	<!-- Goals -->
	<div class="rounded-xl bg-surface p-4">
		<h2 class="text-sm font-medium text-text-muted">Goals</h2>
		{#if data.profile.goals && data.profile.goals.length > 0}
			<ul class="mt-2 space-y-1">
				{#each data.profile.goals as goal}
					<li class="text-sm flex items-start gap-2">
						<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
						{goal}
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-2 text-sm text-text-muted">No goals set yet.</p>
		{/if}

		{#if data.profile.struggles && data.profile.struggles.length > 0}
			<h3 class="mt-3 text-sm font-medium text-text-muted">Struggles</h3>
			<ul class="mt-2 space-y-1">
				{#each data.profile.struggles as struggle}
					<li class="text-sm flex items-start gap-2">
						<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning"></span>
						{struggle}
					</li>
				{/each}
			</ul>
		{/if}

		<a
			href="/onboarding"
			class="mt-3 inline-flex items-center rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/30 hover:bg-primary/10"
		>
			Edit goals
		</a>
	</div>

	<!-- Subscription -->
	<div class="rounded-xl bg-surface p-4">
		<h2 class="text-sm font-medium text-text-muted">Subscription</h2>
		<div class="mt-2 flex items-center gap-2">
			<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {data.profile.subscriptionTier === 'paid' ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300'}">
				{data.profile.subscriptionTier}
			</span>
		</div>
		<div class="mt-3">
			<div class="flex items-center justify-between text-sm">
				<span class="text-text-muted">Messages this week</span>
				<span class="{usagePercent >= 90 ? 'text-danger' : usagePercent >= 70 ? 'text-warning' : 'text-text-primary'}">
					{data.messagesThisWeek} / {data.messageLimit}
				</span>
			</div>
			<div class="mt-1.5 h-2 w-full rounded-full bg-background">
				<div
					class="h-2 rounded-full transition-all {usagePercent >= 90 ? 'bg-danger' : usagePercent >= 70 ? 'bg-warning' : 'bg-primary'}"
					style="width: {Math.min(usagePercent, 100)}%"
				></div>
			</div>
		</div>
		{#if data.profile.subscriptionTier === 'free'}
			<button
				onclick={handleUpgrade}
				disabled={upgrading}
				class="mt-3 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
			>
				{upgrading ? 'Redirecting...' : 'Upgrade to Pro — $9.99/mo'}
			</button>
		{:else}
			<p class="mt-3 text-xs text-text-muted">Manage your subscription in Stripe's customer portal.</p>
		{/if}
	</div>

	<!-- Settings -->
	<div class="rounded-xl bg-surface p-4">
		<h2 class="text-sm font-medium text-text-muted">Settings</h2>
		<div class="mt-2 space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-sm">Push notifications</span>
				<span class="text-xs text-text-muted">Coming soon</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm">Training reminders</span>
				<span class="text-xs text-text-muted">Coming soon</span>
			</div>
		</div>
	</div>

	<!-- Account -->
	<div class="rounded-xl bg-surface p-4">
		<h2 class="text-sm font-medium text-text-muted">Account</h2>
		<div class="mt-2 space-y-3">
			<button
				onclick={() => {
					const blob = new Blob([JSON.stringify(data.profile, null, 2)], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'matmentor-profile.json';
					a.click();
					URL.revokeObjectURL(url);
				}}
				class="text-sm text-primary hover:underline"
			>
				Export data (JSON)
			</button>
			<div>
				<button disabled class="text-sm text-danger opacity-60 cursor-not-allowed">
					Delete account
				</button>
			</div>
			<div class="flex gap-4">
				<a href="/privacy" class="text-sm text-text-muted hover:text-text-primary">Privacy policy</a>
				<a href="/terms" class="text-sm text-text-muted hover:text-text-primary">Terms of service</a>
			</div>
		</div>
	</div>

	<!-- Log out -->
	<form method="POST" action="/auth/logout">
		<button type="submit" class="w-full rounded-xl bg-surface p-4 text-center text-sm font-medium text-danger hover:bg-danger/10 transition-colors">
			Log out
		</button>
	</form>
</div>
