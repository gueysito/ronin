<script lang="ts">
	import { enhance } from '$app/forms';

	type Message = {
		role: 'musashi' | 'user';
		text: string;
	};

	let currentStep = $state(0);
	let belt = $state('');
	let experience = $state('');
	let trainingFrequency = $state('');
	let selectedGoals = $state<string[]>([]);
	let selectedStruggles = $state<string[]>([]);
	let destination = $state('');
	let chatMessages = $state<Message[]>([
		{
			role: 'musashi',
			text: "Hey! I'm Musashi, your BJJ training coach. 🥋 I'm here to help you track your progress, improve your game, and stay consistent on the mats."
		}
	]);
	let isSubmitting = $state(false);

	let formRef = $state<HTMLFormElement | null>(null);
	let chatEndRef = $state<HTMLDivElement | null>(null);

	const beltOptions = ['White Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt'];
	const experienceOptions = ['Less than 6 months', '6-12 months', '1-2 years', '2-3 years', '3-5 years', '5+ years'];
	const frequencyOptions = ['1-2 days', '3-4 days', '5-6 days', 'Every day'];
	const goalOptions = [
		'Get promoted',
		'Compete',
		'Improve guard',
		'Develop submissions',
		'Train consistently',
		'Recover/prevent injuries',
		'Build confidence',
		'Get in shape'
	];
	const struggleOptions = [
		'Escaping mount',
		'Escaping side control',
		'Escaping back control',
		'Guard retention',
		'Passing guard',
		'Finishing submissions',
		'Cardio',
		'Takedowns',
		'Remembering techniques',
		'Competition nerves',
		'Staying motivated'
	];

	const beltFollowUps: Record<string, string> = {
		'White Belt': "Welcome to the journey! 🤙 Every black belt started exactly where you are. Let's build a strong foundation.",
		'Blue Belt': "Nice! Blue belt is where things start clicking. Let's sharpen that game. 💪",
		'Purple Belt': "Purple belt — you're getting dangerous! Let's refine your A-game. 🔥",
		'Brown Belt': "Brown belt! You're almost at the summit. Let's polish those details. 🏔️",
		'Black Belt': "Oss! Black belt — the journey continues. Let's keep evolving your game. 🥇"
	};

	function scrollToBottom() {
		setTimeout(() => {
			chatEndRef?.scrollIntoView({ behavior: 'smooth' });
		}, 50);
	}

	function addMusashiMessage(text: string) {
		chatMessages = [...chatMessages, { role: 'musashi', text }];
		scrollToBottom();
	}

	function addUserMessage(text: string) {
		chatMessages = [...chatMessages, { role: 'user', text }];
		scrollToBottom();
	}

	function handleWelcome() {
		addUserMessage("Let's go! 🤙");
		currentStep = 1;
		setTimeout(() => {
			addMusashiMessage("First things first — what belt are you currently?");
		}, 400);
	}

	function handleBeltSelect(option: string) {
		const beltValue = option.replace(' Belt', '').toLowerCase();
		belt = beltValue;
		addUserMessage(option);
		currentStep = 1.5;
		setTimeout(() => {
			addMusashiMessage(beltFollowUps[option] || "Great!");
			setTimeout(() => {
				currentStep = 2;
				addMusashiMessage("How long have you been training?");
			}, 600);
		}, 400);
	}

	function handleExperienceSelect(option: string) {
		experience = option;
		addUserMessage(option);
		currentStep = 3;
		setTimeout(() => {
			addMusashiMessage("How many days a week do you want to train?");
		}, 400);
	}

	function handleFrequencySelect(option: string) {
		trainingFrequency = option;
		addUserMessage(option);
		currentStep = 4;
		setTimeout(() => {
			addMusashiMessage("What are your main goals right now? Pick 1-3.");
		}, 400);
	}

	function toggleGoal(goal: string) {
		if (selectedGoals.includes(goal)) {
			selectedGoals = selectedGoals.filter((g) => g !== goal);
		} else if (selectedGoals.length < 3) {
			selectedGoals = [...selectedGoals, goal];
		}
	}

	function confirmGoals() {
		if (selectedGoals.length === 0) return;
		addUserMessage(selectedGoals.join(', '));
		currentStep = 5;
		setTimeout(() => {
			addMusashiMessage("What do you struggle with the most? Pick 2-3.");
		}, 400);
	}

	function toggleStruggle(struggle: string) {
		if (selectedStruggles.includes(struggle)) {
			selectedStruggles = selectedStruggles.filter((s) => s !== struggle);
		} else if (selectedStruggles.length < 3) {
			selectedStruggles = [...selectedStruggles, struggle];
		}
	}

	function confirmStruggles() {
		if (selectedStruggles.length < 2) return;
		addUserMessage(selectedStruggles.join(', '));
		currentStep = 6;
		setTimeout(() => {
			const goalText = selectedGoals[0]?.toLowerCase() || 'your goals';
			addMusashiMessage(
				`Got it! I'll tailor your experience around ${goalText} and help you work through ${selectedStruggles[0]?.toLowerCase() || 'your weak spots'}. You're all set! 🎉`
			);
			setTimeout(() => {
				addMusashiMessage("One last thing — did you train today, or is your next session coming up?");
			}, 600);
		}, 400);
	}

	function handleFinish(dest: string) {
		destination = dest;
		addUserMessage(dest === 'log' ? 'I just trained!' : 'Training tomorrow');
		currentStep = 7;
		isSubmitting = true;
		setTimeout(() => {
			formRef?.requestSubmit();
		}, 300);
	}

	let progress = $derived(Math.min((currentStep / 7) * 100, 100));
	let displayStep = $derived(Math.min(Math.ceil(currentStep === 0 ? 1 : currentStep), 7));
</script>

<div class="flex min-h-screen flex-col bg-background">
	<!-- Progress bar -->
	<div class="sticky top-0 z-10 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-sm">
		<div class="flex items-center justify-between text-sm text-text-muted">
			<span>Step {displayStep} of 7</span>
			<span class="text-xs">{Math.round(progress)}%</span>
		</div>
		<div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface">
			<div
				class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
				style="width: {progress}%"
			></div>
		</div>
	</div>

	<!-- Chat messages -->
	<div class="flex-1 overflow-y-auto px-4 py-4">
		<div class="mx-auto flex max-w-lg flex-col gap-3">
			{#each chatMessages as message, i}
				<div
					class="flex gap-2 animate-in fade-in {message.role === 'user'
						? 'flex-row-reverse'
						: 'flex-row'}"
					style="animation-delay: {i === chatMessages.length - 1 ? '0ms' : '0ms'}"
				>
					{#if message.role === 'musashi'}
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-musashi text-sm font-bold text-text-primary"
						>
							M
						</div>
					{/if}
					<div
						class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed {message.role ===
						'musashi'
							? 'rounded-tl-sm bg-musashi text-text-primary'
							: 'rounded-tr-sm bg-primary text-white'}"
					>
						{message.text}
					</div>
				</div>
			{/each}
			<div bind:this={chatEndRef}></div>
		</div>
	</div>

	<!-- Quick-select area -->
	<div class="sticky bottom-0 border-t border-slate-800/50 bg-background/95 px-4 py-4 backdrop-blur-sm">
		<div class="mx-auto max-w-lg">
			{#if currentStep === 0}
				<!-- Welcome -->
				<button
					onclick={handleWelcome}
					class="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
				>
					Let's go! 🤙
				</button>
			{:else if currentStep === 1}
				<!-- Belt selection -->
				<div class="flex flex-wrap gap-2">
					{#each beltOptions as option}
						<button
							onclick={() => handleBeltSelect(option)}
							class="rounded-lg border border-slate-700/50 bg-surface px-4 py-2.5 text-sm text-text-primary transition hover:border-primary"
						>
							{option}
						</button>
					{/each}
				</div>
			{:else if currentStep === 2}
				<!-- Experience -->
				<div class="flex flex-wrap gap-2">
					{#each experienceOptions as option}
						<button
							onclick={() => handleExperienceSelect(option)}
							class="rounded-lg border border-slate-700/50 bg-surface px-4 py-2.5 text-sm text-text-primary transition hover:border-primary"
						>
							{option}
						</button>
					{/each}
				</div>
			{:else if currentStep === 3}
				<!-- Training frequency -->
				<div class="flex flex-wrap gap-2">
					{#each frequencyOptions as option}
						<button
							onclick={() => handleFrequencySelect(option)}
							class="rounded-lg border border-slate-700/50 bg-surface px-4 py-2.5 text-sm text-text-primary transition hover:border-primary"
						>
							{option}
						</button>
					{/each}
				</div>
			{:else if currentStep === 4}
				<!-- Goals multi-select -->
				<div class="flex flex-wrap gap-2">
					{#each goalOptions as option}
						<button
							onclick={() => toggleGoal(option)}
							class="rounded-lg border px-4 py-2.5 text-sm transition {selectedGoals.includes(option)
								? 'border-primary bg-primary/20 text-text-primary'
								: 'border-slate-700/50 bg-surface text-text-primary hover:border-primary'}"
						>
							{option}
						</button>
					{/each}
				</div>
				{#if selectedGoals.length > 0}
					<button
						onclick={confirmGoals}
						class="mt-3 w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
					>
						Continue ({selectedGoals.length}/3)
					</button>
				{/if}
			{:else if currentStep === 5}
				<!-- Struggles multi-select -->
				<div class="flex flex-wrap gap-2">
					{#each struggleOptions as option}
						<button
							onclick={() => toggleStruggle(option)}
							class="rounded-lg border px-4 py-2.5 text-sm transition {selectedStruggles.includes(option)
								? 'border-primary bg-primary/20 text-text-primary'
								: 'border-slate-700/50 bg-surface text-text-primary hover:border-primary'}"
						>
							{option}
						</button>
					{/each}
				</div>
				{#if selectedStruggles.length >= 2}
					<button
						onclick={confirmStruggles}
						class="mt-3 w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
					>
						Continue ({selectedStruggles.length}/3)
					</button>
				{/if}
			{:else if currentStep === 6}
				<!-- Final destination -->
				<div class="flex gap-3">
					<button
						onclick={() => handleFinish('log')}
						class="flex-1 rounded-lg border border-slate-700/50 bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-primary"
					>
						I just trained! 💪
					</button>
					<button
						onclick={() => handleFinish('chat')}
						class="flex-1 rounded-lg border border-slate-700/50 bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-primary"
					>
						Training tomorrow 📅
					</button>
				</div>
			{:else if currentStep === 7}
				<!-- Submitting -->
				<div class="flex items-center justify-center py-3 text-sm text-text-muted">
					<svg
						class="mr-2 h-4 w-4 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						></path>
					</svg>
					Setting up your profile...
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Hidden form for submission -->
<form
	bind:this={formRef}
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}
	class="hidden"
>
	<input type="hidden" name="belt" value={belt} />
	<input type="hidden" name="experience" value={experience} />
	<input type="hidden" name="trainingFrequency" value={trainingFrequency} />
	<input type="hidden" name="goals" value={JSON.stringify(selectedGoals)} />
	<input type="hidden" name="struggles" value={JSON.stringify(selectedStruggles)} />
	<input type="hidden" name="destination" value={destination} />
</form>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-in {
		animation: fade-in 0.3s ease-out forwards;
	}

	.fade-in {
		opacity: 0;
		animation-fill-mode: forwards;
	}
</style>
