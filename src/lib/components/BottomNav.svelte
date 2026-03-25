<script lang="ts">
	import { page } from '$app/state';

	const tabs = [
		{ href: '/chat', label: 'Chat', icon: 'chat' },
		{ href: '/game', label: 'Game', icon: 'game' },
		{ href: '/progress', label: 'Progress', icon: 'progress' },
		{ href: '/profile', label: 'Profile', icon: 'profile' }
	] as const;

	function isActive(href: string): boolean {
		return page.url.pathname.startsWith(href);
	}
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-surface">
	<div class="mx-auto flex max-w-lg">
		{#each tabs as tab}
			<a
				href={tab.href}
				class="flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors
					{isActive(tab.href) ? 'text-primary' : 'text-text-muted hover:text-text-primary'}"
			>
				{#if tab.icon === 'chat'}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
				{:else if tab.icon === 'game'}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
				{:else if tab.icon === 'progress'}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
				{:else}
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
				{/if}
				{#if isActive(tab.href)}
					<span>{tab.label}</span>
				{/if}
			</a>
		{/each}
	</div>
</nav>
