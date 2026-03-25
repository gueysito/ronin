<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Profile - MatMentor</title>
</svelte:head>

<div class="flex flex-1 flex-col px-4 py-6">
	<h1 class="text-xl font-semibold">Profile</h1>

	<div class="mt-6 flex items-center gap-4">
		<div class="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-xl font-semibold">
			{data.user.email?.[0]?.toUpperCase() ?? '?'}
		</div>
		<div>
			<p class="font-medium">{data.user.email}</p>
		</div>
	</div>

	<div class="mt-8 space-y-4">
		<div class="rounded-xl bg-surface p-4">
			<h2 class="text-sm font-medium text-text-muted">Account</h2>
			<form method="POST" action="/auth/logout" class="mt-3">
				<button type="submit" class="text-danger text-sm">Log out</button>
			</form>
		</div>
	</div>
</div>
