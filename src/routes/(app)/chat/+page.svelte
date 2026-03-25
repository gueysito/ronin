<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';

	let input = $state('');

	const chat = new Chat({});

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!input.trim()) return;
		chat.sendMessage({ text: input });
		input = '';
	}
</script>

<svelte:head>
	<title>Chat - MatMentor</title>
</svelte:head>

<div class="flex flex-1 flex-col">
	<!-- Header -->
	<header class="flex items-center justify-between border-b border-slate-800 px-4 py-3">
		<h1 class="text-lg font-semibold">MatMentor</h1>
		<div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">M</div>
	</header>

	<!-- Messages -->
	<div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
		{#if chat.messages.length === 0}
			<div class="flex items-start gap-3">
				<div class="h-8 w-8 shrink-0 rounded-full bg-musashi flex items-center justify-center text-xs text-text-muted">M</div>
				<div class="rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px]">
					Did you train today?
				</div>
			</div>
		{/if}

		{#each chat.messages as message}
			{#if message.role === 'user'}
				<div class="flex justify-end">
					<div class="rounded-xl rounded-tr-none bg-primary px-4 py-3 text-[15px] text-white max-w-[80%]">
						{#each message.parts as part}
							{#if part.type === 'text'}
								{part.text}
							{/if}
						{/each}
					</div>
				</div>
			{:else}
				<div class="flex items-start gap-3">
					<div class="h-8 w-8 shrink-0 rounded-full bg-musashi flex items-center justify-center text-xs text-text-muted">M</div>
					<div class="rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px] max-w-[80%]">
						{#each message.parts as part}
							{#if part.type === 'text'}
								{part.text}
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/each}

		{#if chat.status === 'streaming'}
			<div class="flex items-start gap-3">
				<div class="h-8 w-8 shrink-0 rounded-full bg-musashi flex items-center justify-center text-xs text-text-muted">M</div>
				<div class="rounded-xl rounded-tl-none bg-musashi px-4 py-3 text-[15px] text-text-muted">
					Musashi is thinking...
				</div>
			</div>
		{/if}
	</div>

	<!-- Input -->
	<form onsubmit={handleSubmit} class="border-t border-slate-800 px-4 py-3">
		<div class="flex gap-2">
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
		</div>
	</form>
</div>
