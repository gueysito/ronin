<script lang="ts">
	import BottomNav from '$lib/components/BottomNav.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col pb-16">
	{@render children()}
</div>

<BottomNav />
