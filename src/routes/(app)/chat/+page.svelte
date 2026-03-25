<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';

	let { data } = $props();

	// --- AI Chat ---
	let input = $state('');
	const chat = new Chat({});

	// --- Logging state machine ---
	type LogStep =
		| null
		| 'type'
		| 'duration'
		| 'intensity'
		| 'techniques_hit'
		| 'techniques_hit_count'
		| 'techniques_against'
		| 'positions'
		| 'energy'
		| 'mood'
		| 'notes'
		| 'saving';

	type LocalMessage = { role: 'musashi' | 'user'; text: string };
	type TechEntry = { slug: string; name: string; count: number };

	let logStep = $state<LogStep>(null);
	let localMessages = $state<LocalMessage[]>([]);
	let showTrigger = $state(data.savedMessages.length === 0);

	// Logging data
	let logType = $state('');
	let logDuration = $state(0);
	let logIntensity = $state(0);
	let logTechniquesHit = $state<TechEntry[]>([]);
	let logTechniquesAgainst = $state<string[]>([]);
	let logPositions = $state<string[]>([]);
	let logEnergy = $state(0);
	let logMood = $state('');
	let logNotes = $state('');

	// Temp state for technique count
	let pendingTechSlug = $state('');
	let pendingTechName = $state('');

	let chatEndRef = $state<HTMLDivElement | null>(null);

	// Technique list for quick-select (top 12 by belt relevance)
	const topTechniques = $derived(
		data.techniques
			.filter((t) => {
				const beltOrder = ['white', 'blue', 'purple', 'brown', 'black'];
				return beltOrder.indexOf(t.beltLevel) <= 2; // up to purple
			})
			.slice(0, 12)
	);

	function scrollToBottom() {
		setTimeout(() => chatEndRef?.scrollIntoView({ behavior: 'smooth' }), 50);
	}

	function addLocal(role: 'musashi' | 'user', text: string) {
		localMessages = [...localMessages, { role, text }];
		scrollToBottom();
	}

	function startLogging(type: string) {
		showTrigger = false;
		const typeLabels: Record<string, string> = {
			rolling: 'Yes, I rolled',
			drilling: 'Yes, drilling only',
			open_mat: 'Open mat',
			competition: 'Competition',
			private_lesson: 'Private lesson'
		};
		addLocal('user', typeLabels[type] || type);
		logType = type;

		if (type === 'rest') {
			addLocal('musashi', 'Smart. Recovery is training. See you next session. 💤');
			logStep = null;
			return;
		}

		logStep = 'duration';
		setTimeout(() => addLocal('musashi', 'How long was your session?'), 300);
	}

	function selectDuration(minutes: number, label: string) {
		logDuration = minutes;
		addLocal('user', label);
		logStep = 'intensity';
		setTimeout(() => addLocal('musashi', 'How hard did you go?'), 300);
	}

	function selectIntensity(rpe: number, label: string) {
		logIntensity = rpe;
		addLocal('user', label);

		if (logType === 'drilling') {
			logStep = 'positions';
			setTimeout(
				() => addLocal('musashi', 'What technique(s) were you drilling? Pick the positions you worked.'),
				300
			);
		} else {
			logStep = 'techniques_hit';
			setTimeout(
				() => addLocal('musashi', 'Any submissions, sweeps, or passes you hit today?'),
				300
			);
		}
	}

	function selectTechniqueHit(slug: string, name: string) {
		pendingTechSlug = slug;
		pendingTechName = name;
		logStep = 'techniques_hit_count';
	}

	function selectTechniqueHitCount(count: number) {
		logTechniquesHit = [...logTechniquesHit, { slug: pendingTechSlug, name: pendingTechName, count }];
		addLocal('user', `${pendingTechName} × ${count}`);
		pendingTechSlug = '';
		pendingTechName = '';
		logStep = 'techniques_hit';
	}

	function doneWithHits() {
		if (logTechniquesHit.length === 0) {
			addLocal('user', 'None today');
		}
		logStep = 'techniques_against';
		setTimeout(
			() => addLocal('musashi', "Anything catch you today? No judgment — this is how we find the holes."),
			300
		);
	}

	function selectTechniqueAgainst(slug: string, name: string) {
		logTechniquesAgainst = [...logTechniquesAgainst, slug];
		addLocal('user', name);
	}

	function doneWithAgainst() {
		if (logTechniquesAgainst.length === 0) {
			addLocal('user', 'Nothing caught me');
			setTimeout(() => addLocal('musashi', "Clean day! Let's keep that going."), 300);
		}
		logStep = 'positions';
		setTimeout(() => addLocal('musashi', 'Which positions did you spend the most time in?'), 400);
	}

	function togglePosition(pos: string) {
		if (logPositions.includes(pos)) {
			logPositions = logPositions.filter((p) => p !== pos);
		} else {
			logPositions = [...logPositions, pos];
		}
	}

	function doneWithPositions() {
		const posLabels = logPositions
			.map((p) => p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
			.join(', ');
		addLocal('user', posLabels || 'Varied');
		logStep = 'energy';
		setTimeout(() => addLocal('musashi', "How's the body and mind? First — energy level:"), 300);
	}

	function selectEnergy(level: number, label: string) {
		logEnergy = level;
		addLocal('user', label);
		logStep = 'mood';
		setTimeout(() => addLocal('musashi', 'And how was the mental side?'), 300);
	}

	function selectMood(mood: string, label: string) {
		logMood = mood;
		addLocal('user', label);
		logStep = 'notes';
		setTimeout(
			() => addLocal('musashi', 'Anything else you want to remember about today?'),
			300
		);
	}

	async function submitLog(withNotes: boolean) {
		if (withNotes && logNotes.trim()) {
			addLocal('user', logNotes);
		} else {
			addLocal('user', 'Submit log');
		}

		logStep = 'saving';
		addLocal('musashi', 'Logging your session... 📝');

		try {
			const res = await fetch('/api/sessions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: logType,
					durationMinutes: logDuration,
					intensityRpe: logIntensity,
					energy: logEnergy,
					mood: logMood || null,
					notes: logNotes || null,
					positionsWorked: logPositions,
					techniquesHit: logTechniquesHit.map((t) => ({ slug: t.slug, count: t.count })),
					techniquesAgainst: logTechniquesAgainst.map((slug) => ({ slug }))
				})
			});

			if (!res.ok) throw new Error('Failed to save');

			logStep = null;

			// Build summary for AI feedback
			const hitSummary = logTechniquesHit.length
				? logTechniquesHit.map((t) => `${t.name} (×${t.count})`).join(', ')
				: 'no successful techniques';
			const againstSummary = logTechniquesAgainst.length
				? logTechniquesAgainst
						.map((slug) => {
							const t = data.techniques.find((tech) => tech.slug === slug);
							return t?.name || slug;
						})
						.join(', ')
				: 'nothing';
			const energyLabels = ['', 'Gassed', 'Low', 'Average', 'Good', 'Great'];
			const moodLabel = logMood.replace(/_/g, ' ');

			const summary = `I just logged a training session: ${logType.replace(/_/g, ' ')}, ${logDuration} minutes, RPE ${logIntensity}/10. Techniques I hit: ${hitSummary}. Caught by: ${againstSummary}. Energy: ${energyLabels[logEnergy] || logEnergy}/5. Mood: ${moodLabel}.${logNotes ? ` Notes: ${logNotes}` : ''}`;

			chat.sendMessage({ text: summary });

			resetLogData();
		} catch {
			addLocal('musashi', 'Something went wrong saving your session. Try again?');
			logStep = null;
		}
	}

	function resetLogData() {
		logType = '';
		logDuration = 0;
		logIntensity = 0;
		logTechniquesHit = [];
		logTechniquesAgainst = [];
		logPositions = [];
		logEnergy = 0;
		logMood = '';
		logNotes = '';
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!input.trim()) return;
		showTrigger = false;
		chat.sendMessage({ text: input });
		input = '';
	}

	// Options
	const sessionTypes = [
		{ value: 'rolling', label: 'Yes, I rolled 🥋' },
		{ value: 'drilling', label: 'Yes, drilling' },
		{ value: 'open_mat', label: 'Open mat' },
		{ value: 'competition', label: 'Competition' },
		{ value: 'private_lesson', label: 'Private lesson' },
		{ value: 'rest', label: 'Rest day 💤' }
	];
	const durationOptions = [
		{ minutes: 30, label: '30 min' },
		{ minutes: 45, label: '45 min' },
		{ minutes: 60, label: '60 min' },
		{ minutes: 90, label: '90 min' },
		{ minutes: 120, label: '2 hours' },
		{ minutes: 150, label: '2.5+ hours' }
	];
	const intensityOptions = [
		{ rpe: 2, label: '1-2 Light drilling' },
		{ rpe: 4, label: '3-4 Technical' },
		{ rpe: 6, label: '5-6 Moderate' },
		{ rpe: 8, label: '7-8 Hard rounds' },
		{ rpe: 10, label: '9-10 Competition pace' }
	];
	const positionOptions = [
		{ slug: 'closed_guard', label: 'Closed Guard' },
		{ slug: 'open_guard', label: 'Open Guard' },
		{ slug: 'half_guard', label: 'Half Guard' },
		{ slug: 'mount_top', label: 'Mount (top)' },
		{ slug: 'mount_bottom', label: 'Mount (bottom)' },
		{ slug: 'side_control_top', label: 'Side Control (top)' },
		{ slug: 'side_control_bottom', label: 'Side Control (bottom)' },
		{ slug: 'back_attacking', label: 'Back (attacking)' },
		{ slug: 'back_defending', label: 'Back (defending)' },
		{ slug: 'standing', label: 'Standing / Takedowns' },
		{ slug: 'turtle', label: 'Turtle' }
	];
	const energyOptions = [
		{ level: 5, label: '🔥 Great' },
		{ level: 4, label: '😊 Good' },
		{ level: 3, label: '😐 Average' },
		{ level: 2, label: '😓 Low' },
		{ level: 1, label: '💀 Gassed' }
	];
	const moodOptions = [
		{ value: 'confident', label: '💪 Confident' },
		{ value: 'focused', label: '🎯 Focused' },
		{ value: 'frustrated', label: '😤 Frustrated' },
		{ value: 'anxious', label: '😰 Anxious' },
		{ value: 'flow_state', label: '🌊 Flow state' }
	];

	let isLogging = $derived(logStep !== null);
</script>

<svelte:head>
	<title>Chat - MatMentor</title>
</svelte:head>

<div class="flex flex-1 flex-col">
	<!-- Header -->
	<header class="flex items-center justify-between border-b border-slate-800 px-4 py-3">
		<h1 class="text-lg font-semibold">MatMentor</h1>
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold"
		>
			M
		</div>
	</header>

	<!-- Messages -->
	<div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
		<!-- Saved messages from DB -->
		{#each data.savedMessages as message}
			{#if message.role === 'user'}
				<div class="flex justify-end">
					<div
						class="max-w-[80%] rounded-xl rounded-tr-none bg-primary px-4 py-3 text-[15px] text-white"
					>
						{message.content}
					</div>
				</div>
			{:else}
				<div class="flex items-start gap-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-musashi text-xs text-text-muted"
					>
						M
					</div>
					<div
						class="max-w-[80%] rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px]"
					>
						{message.content}
					</div>
				</div>
			{/if}
		{/each}

		<!-- Initial trigger -->
		{#if showTrigger && chat.messages.length === 0 && localMessages.length === 0}
			<div class="flex items-start gap-3">
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-musashi text-xs text-text-muted"
				>
					M
				</div>
				<div class="rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px]">
					Did you train today?
				</div>
			</div>
		{/if}

		<!-- Local messages (logging flow) -->
		{#each localMessages as message}
			{#if message.role === 'user'}
				<div class="flex justify-end">
					<div
						class="max-w-[80%] rounded-xl rounded-tr-none bg-primary px-4 py-3 text-[15px] text-white"
					>
						{message.text}
					</div>
				</div>
			{:else}
				<div class="flex items-start gap-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-musashi text-xs text-text-muted"
					>
						M
					</div>
					<div
						class="max-w-[80%] rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px]"
					>
						{message.text}
					</div>
				</div>
			{/if}
		{/each}

		<!-- AI messages -->
		{#each chat.messages as message}
			{#if message.role === 'user'}
				<div class="flex justify-end">
					<div
						class="max-w-[80%] rounded-xl rounded-tr-none bg-primary px-4 py-3 text-[15px] text-white"
					>
						{#each message.parts as part}
							{#if part.type === 'text'}
								{part.text}
							{/if}
						{/each}
					</div>
				</div>
			{:else}
				<div class="flex items-start gap-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-musashi text-xs text-text-muted"
					>
						M
					</div>
					<div
						class="max-w-[80%] rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px]"
					>
						{#each message.parts as part}
							{#if part.type === 'text'}
								{part.text}
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/each}

		{#if chat.status === 'streaming' || chat.status === 'submitted'}
			<div class="flex items-start gap-3">
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-musashi text-xs text-text-muted"
				>
					M
				</div>
				<div
					class="rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px] text-text-muted"
				>
					Musashi is thinking...
				</div>
			</div>
		{/if}

		<div bind:this={chatEndRef}></div>
	</div>

	<!-- Bottom area: quick-select buttons OR text input -->
	<div class="border-t border-slate-800 px-4 py-3">
		{#if showTrigger && chat.messages.length === 0 && localMessages.length === 0}
			<!-- Logging trigger buttons -->
			<div class="flex flex-wrap gap-2">
				{#each sessionTypes as st}
					<button
						onclick={() => startLogging(st.value)}
						class="rounded-lg border border-slate-700/50 bg-surface px-3 py-2.5 text-sm text-text-primary transition hover:border-primary"
					>
						{st.label}
					</button>
				{/each}
			</div>

		{:else if logStep === 'duration'}
			<div class="flex flex-wrap gap-2">
				{#each durationOptions as opt}
					<button
						onclick={() => selectDuration(opt.minutes, opt.label)}
						class="rounded-lg border border-slate-700/50 bg-surface px-4 py-2.5 text-sm text-text-primary transition hover:border-primary"
					>
						{opt.label}
					</button>
				{/each}
			</div>

		{:else if logStep === 'intensity'}
			<div class="flex flex-wrap gap-2">
				{#each intensityOptions as opt}
					<button
						onclick={() => selectIntensity(opt.rpe, opt.label)}
						class="rounded-lg border border-slate-700/50 bg-surface px-3 py-2.5 text-sm text-text-primary transition hover:border-primary"
					>
						{opt.label}
					</button>
				{/each}
			</div>

		{:else if logStep === 'techniques_hit'}
			<div class="space-y-2">
				{#if logTechniquesHit.length > 0}
					<div class="flex flex-wrap gap-1 text-xs text-text-muted">
						{#each logTechniquesHit as t}
							<span class="rounded bg-primary/20 px-2 py-1">{t.name} ×{t.count}</span>
						{/each}
					</div>
				{/if}
				<div class="flex flex-wrap gap-2">
					{#each topTechniques as tech}
						{#if !logTechniquesHit.some((t) => t.slug === tech.slug)}
							<button
								onclick={() => selectTechniqueHit(tech.slug, tech.name)}
								class="rounded-lg border border-slate-700/50 bg-surface px-3 py-2 text-sm text-text-primary transition hover:border-primary"
							>
								{tech.name}
							</button>
						{/if}
					{/each}
				</div>
				<button
					onclick={doneWithHits}
					class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white"
				>
					{logTechniquesHit.length > 0 ? 'Done' : 'None today'}
				</button>
			</div>

		{:else if logStep === 'techniques_hit_count'}
			<div>
				<p class="mb-2 text-sm text-text-muted">How many times did you hit {pendingTechName}?</p>
				<div class="flex gap-2">
					{#each [1, 2, 3, 4] as count}
						<button
							onclick={() => selectTechniqueHitCount(count)}
							class="flex-1 rounded-lg border border-slate-700/50 bg-surface py-2.5 text-sm text-text-primary transition hover:border-primary"
						>
							{count === 4 ? '4+' : count}
						</button>
					{/each}
				</div>
			</div>

		{:else if logStep === 'techniques_against'}
			<div class="space-y-2">
				{#if logTechniquesAgainst.length > 0}
					<div class="flex flex-wrap gap-1 text-xs text-text-muted">
						{#each logTechniquesAgainst as slug}
							{@const tech = data.techniques.find((t) => t.slug === slug)}
							<span class="rounded bg-danger/20 px-2 py-1">{tech?.name || slug}</span>
						{/each}
					</div>
				{/if}
				<div class="flex flex-wrap gap-2">
					{#each topTechniques as tech}
						{#if !logTechniquesAgainst.includes(tech.slug)}
							<button
								onclick={() => selectTechniqueAgainst(tech.slug, tech.name)}
								class="rounded-lg border border-slate-700/50 bg-surface px-3 py-2 text-sm text-text-primary transition hover:border-primary"
							>
								{tech.name}
							</button>
						{/if}
					{/each}
				</div>
				<button
					onclick={doneWithAgainst}
					class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white"
				>
					{logTechniquesAgainst.length > 0 ? 'Done' : 'Nothing caught me'}
				</button>
			</div>

		{:else if logStep === 'positions'}
			<div class="space-y-2">
				<div class="flex flex-wrap gap-2">
					{#each positionOptions as pos}
						<button
							onclick={() => togglePosition(pos.slug)}
							class="rounded-lg border px-3 py-2 text-sm transition {logPositions.includes(
								pos.slug
							)
								? 'border-primary bg-primary/20 text-text-primary'
								: 'border-slate-700/50 bg-surface text-text-primary hover:border-primary'}"
						>
							{pos.label}
						</button>
					{/each}
				</div>
				{#if logPositions.length > 0}
					<button
						onclick={doneWithPositions}
						class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white"
					>
						Continue ({logPositions.length} selected)
					</button>
				{/if}
			</div>

		{:else if logStep === 'energy'}
			<div class="flex flex-wrap gap-2">
				{#each energyOptions as opt}
					<button
						onclick={() => selectEnergy(opt.level, opt.label)}
						class="rounded-lg border border-slate-700/50 bg-surface px-4 py-2.5 text-sm text-text-primary transition hover:border-primary"
					>
						{opt.label}
					</button>
				{/each}
			</div>

		{:else if logStep === 'mood'}
			<div class="flex flex-wrap gap-2">
				{#each moodOptions as opt}
					<button
						onclick={() => selectMood(opt.value, opt.label)}
						class="rounded-lg border border-slate-700/50 bg-surface px-3 py-2.5 text-sm text-text-primary transition hover:border-primary"
					>
						{opt.label}
					</button>
				{/each}
			</div>

		{:else if logStep === 'notes'}
			<div class="space-y-2">
				<input
					bind:value={logNotes}
					placeholder="e.g., 'Worked on a new guard entry with Coach Mike'"
					class="w-full rounded-lg bg-surface px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
				/>
				<div class="flex gap-2">
					<button
						onclick={() => submitLog(true)}
						class="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white"
					>
						Submit log
					</button>
					<button
						onclick={() => submitLog(false)}
						class="rounded-lg border border-slate-700/50 bg-surface px-4 py-2.5 text-sm text-text-muted transition hover:border-primary"
					>
						Skip & submit
					</button>
				</div>
			</div>

		{:else if logStep === 'saving'}
			<div class="flex items-center justify-center py-3 text-sm text-text-muted">
				<svg
					class="mr-2 h-4 w-4 animate-spin"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
				Saving your session...
			</div>

		{:else}
			<!-- Normal chat input -->
			<form onsubmit={handleSubmit} class="flex gap-2">
				<input
					bind:value={input}
					placeholder="Message Musashi..."
					class="flex-1 rounded-lg bg-surface px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
				/>
				<button
					type="submit"
					disabled={chat.status !== 'ready' || !input.trim()}
					class="rounded-lg bg-primary px-4 py-3 font-medium text-white disabled:opacity-50"
				>
					Send
				</button>
			</form>
		{/if}
	</div>
</div>
