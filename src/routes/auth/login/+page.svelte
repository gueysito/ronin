<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Log in - MatMentor</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center px-6">
	<div class="w-full max-w-sm">
		<h1 class="text-2xl font-semibold">MatMentor</h1>
		<p class="mt-2 text-text-muted">Train smarter. Know your game.</p>

		{#if form?.success}
			<div class="mt-6 rounded-xl bg-success/10 p-4 text-success text-sm">
				Check your email for a magic link to sign in.
			</div>
		{:else}
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="mt-8 space-y-4"
			>
				<input
					name="email"
					type="email"
					required
					placeholder="your@email.com"
					class="w-full rounded-lg bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
				/>
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-primary py-3 font-medium text-white disabled:opacity-50"
				>
					{loading ? 'Sending...' : 'Sign in with Magic Link'}
				</button>
			</form>

			{#if form?.message}
				<p class="mt-4 text-sm text-danger">{form.message}</p>
			{/if}
		{/if}
	</div>
</div>
