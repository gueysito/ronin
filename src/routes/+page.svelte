<script lang="ts">
	let faqOpen = $state<number | null>(null);

	function toggleFaq(index: number) {
		faqOpen = faqOpen === index ? null : index;
	}

	const faqs = [
		{
			q: 'Do I need to type a lot?',
			a: "Nope. Most logging is tap-to-select. You can type if you want to, but it's designed for tired hands after rolling."
		},
		{
			q: 'Will it work for my style? (gi/no-gi/competition/hobbyist)',
			a: 'Yes. Musashi adapts to your belt level, goals, and training style during onboarding.'
		},
		{
			q: 'Is my training data private?',
			a: 'Completely. Your data is encrypted, never shared, and you can export or delete it anytime.'
		},
		{
			q: 'What if I train somewhere with bad wifi?',
			a: 'MatMentor works offline. Log your session in the locker room and it syncs automatically when you have signal.'
		},
		{
			q: 'Can I cancel anytime?',
			a: 'Yes. No contracts, no cancellation fees. You keep access through the end of your billing period.'
		}
	];
</script>

<svelte:head>
	<title>MatMentor — AI BJJ Coach</title>
	<meta
		name="description"
		content="MatMentor is an AI coach that tracks your BJJ, spots your patterns, and tells you exactly what to work on next."
	/>
</svelte:head>

<div class="min-h-screen bg-background text-text-primary">
	<!-- Top Bar -->
	<header class="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-background/80 backdrop-blur-md">
		<div class="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
			<span class="text-lg font-bold tracking-tight">🥋 MatMentor</span>
			<a
				href="/auth/login"
				class="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
			>
				Log In
			</a>
		</div>
	</header>

	<main>
		<!-- Section 1: Hero -->
		<section class="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
			<div class="mx-auto max-w-2xl text-center">
				<h1 class="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
					Train smarter. Know your game. Stop&nbsp;guessing.
				</h1>
				<p class="mt-6 text-lg text-text-muted md:text-xl">
					MatMentor is an AI coach that tracks your BJJ, spots your patterns, and tells you exactly
					what to work on next.
				</p>
				<a
					href="/auth/login"
					class="mt-8 inline-block w-full rounded-xl bg-primary py-4 text-center text-lg font-semibold text-white transition-opacity hover:opacity-90 md:w-auto md:px-12"
				>
					Start Free Trial
				</a>

				<!-- Chat Mockup -->
				<div class="mx-auto mt-12 max-w-sm">
					<div class="overflow-hidden rounded-2xl border border-slate-700/50 bg-surface shadow-2xl shadow-primary/5">
						<!-- Phone header -->
						<div class="border-b border-slate-800/50 bg-musashi px-4 py-3">
							<div class="flex items-center gap-3">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm">
									⚔️
								</div>
								<div class="text-left">
									<p class="text-sm font-semibold">Musashi</p>
									<p class="text-xs text-text-muted">AI BJJ Coach</p>
								</div>
							</div>
						</div>
						<!-- Messages -->
						<div class="space-y-3 px-4 py-4">
							<!-- Musashi -->
							<div class="flex gap-2">
								<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs">
									⚔️
								</div>
								<div class="rounded-2xl rounded-tl-sm bg-musashi px-3 py-2 text-left text-sm">
									Hey! Did you train today? 🤙
								</div>
							</div>
							<!-- User -->
							<div class="flex justify-end">
								<div class="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-right text-sm text-white">
									Yeah, open mat — got tapped by a loop choke twice 😅
								</div>
							</div>
							<!-- Musashi -->
							<div class="flex gap-2">
								<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs">
									⚔️
								</div>
								<div class="rounded-2xl rounded-tl-sm bg-musashi px-3 py-2 text-left text-sm">
									Loop choke means your posture is breaking in half guard. Try framing on the collar bone before they get the cross-collar grip. Here's a drill 👇
								</div>
							</div>
							<!-- Quick-select buttons -->
							<div class="flex flex-wrap gap-2 pl-8">
								<span class="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
									🎥 Watch drill
								</span>
								<span class="rounded-full border border-slate-700 bg-surface px-3 py-1 text-xs text-text-muted">
									Log full session
								</span>
								<span class="rounded-full border border-slate-700 bg-surface px-3 py-1 text-xs text-text-muted">
									How do I feel?
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 2: Problem -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">Sound familiar?</h2>
				<ul class="mt-8 space-y-5">
					<li class="flex items-start gap-3 text-lg text-text-muted">
						<span class="mt-1 text-danger">✕</span>
						You train 3x a week but can't tell if you're actually improving.
					</li>
					<li class="flex items-start gap-3 text-lg text-text-muted">
						<span class="mt-1 text-danger">✕</span>
						You get tapped by the same stuff and don't know how to fix it.
					</li>
					<li class="flex items-start gap-3 text-lg text-text-muted">
						<span class="mt-1 text-danger">✕</span>
						You have questions after class but don't want to look clueless asking them.
					</li>
				</ul>
				<p class="mt-10 text-lg font-medium text-text-primary">
					You don't need another training journal. You need a coach who's always available.
				</p>
			</div>
		</section>

		<!-- Section 3: Solution -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">Meet Musashi — your AI BJJ&nbsp;coach</h2>
				<p class="mt-6 text-lg text-text-muted">
					Musashi blends the precision of Danaher, the philosophy of Rickson, and the systematic
					approach of Saulo. After every session, he'll ask what happened, spot patterns in your
					game, and tell you exactly what to drill next — with video links from world-class
					instructors.
				</p>

				<!-- Solution Chat Mockup -->
				<div class="mx-auto mt-10 max-w-sm">
					<div class="overflow-hidden rounded-2xl border border-slate-700/50 bg-surface shadow-lg">
						<div class="border-b border-slate-800/50 bg-musashi px-4 py-3">
							<div class="flex items-center gap-3">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm">
									⚔️
								</div>
								<div class="text-left">
									<p class="text-sm font-semibold">Musashi</p>
									<p class="text-xs text-text-muted">Post-training debrief</p>
								</div>
							</div>
						</div>
						<div class="space-y-3 px-4 py-4">
							<div class="flex gap-2">
								<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs">
									⚔️
								</div>
								<div class="rounded-2xl rounded-tl-sm bg-musashi px-3 py-2 text-left text-sm">
									Nice work this week — 3 sessions logged. Your guard retention is trending up 📈
								</div>
							</div>
							<div class="flex gap-2">
								<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs">
									⚔️
								</div>
								<div class="rounded-2xl rounded-tl-sm bg-musashi px-3 py-2 text-left text-sm">
									I noticed you're getting passed from half guard a lot. Try the knee shield — here's a Danaher breakdown:
								</div>
							</div>
							<div class="flex gap-2 pl-8">
								<span class="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
									🎥 Half Guard Retention — Danaher (12 min)
								</span>
							</div>
							<div class="flex gap-2">
								<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs">
									⚔️
								</div>
								<div class="rounded-2xl rounded-tl-sm bg-musashi px-3 py-2 text-left text-sm">
									How's your energy today? ⚡
								</div>
							</div>
							<div class="flex flex-wrap gap-2 pl-8">
								<span class="rounded-full border border-slate-700 bg-surface px-3 py-1 text-xs text-text-muted">🔥 Great</span>
								<span class="rounded-full border border-slate-700 bg-surface px-3 py-1 text-xs text-text-muted">😊 Good</span>
								<span class="rounded-full border border-slate-700 bg-surface px-3 py-1 text-xs text-text-muted">😐 Okay</span>
								<span class="rounded-full border border-slate-700 bg-surface px-3 py-1 text-xs text-text-muted">😓 Tired</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 4: How It Works -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">
					Log a session in 60 seconds. Get smarter every&nbsp;week.
				</h2>
				<div class="mt-10 grid gap-8 md:grid-cols-3">
					<!-- Step 1 -->
					<div class="text-center md:text-left">
						<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl md:mx-0">
							🥋
						</div>
						<h3 class="mt-4 text-lg font-semibold">Train at your gym</h3>
						<p class="mt-2 text-sm text-text-muted">Do your thing on the mats.</p>
					</div>
					<!-- Step 2 -->
					<div class="text-center md:text-left">
						<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl md:mx-0">
							💬
						</div>
						<h3 class="mt-4 text-lg font-semibold">Chat with Musashi</h3>
						<p class="mt-2 text-sm text-text-muted">
							Tap a few buttons — what you drilled, who you rolled with, how you felt. Done before
							you're out of the parking lot.
						</p>
					</div>
					<!-- Step 3 -->
					<div class="text-center md:text-left">
						<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl md:mx-0">
							📈
						</div>
						<h3 class="mt-4 text-lg font-semibold">See your game evolve</h3>
						<p class="mt-2 text-sm text-text-muted">
							Watch your strengths, weaknesses, and streaks emerge. Get weekly AI summaries and
							targeted drill recommendations.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 5: Feature Highlights -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-2xl bg-surface p-6">
						<div class="text-2xl">⚡</div>
						<h3 class="mt-3 text-lg font-semibold">Chat, don't type</h3>
						<p class="mt-2 text-sm text-text-muted">
							Quick-select buttons mean logging takes 60 seconds — not 10 minutes of journaling.
						</p>
					</div>
					<div class="rounded-2xl bg-surface p-6">
						<div class="text-2xl">🎯</div>
						<h3 class="mt-3 text-lg font-semibold">Know your A-game (and your holes)</h3>
						<p class="mt-2 text-sm text-text-muted">
							See which submissions you hit most, which positions eat you alive, and what to focus
							on.
						</p>
					</div>
					<div class="rounded-2xl bg-surface p-6">
						<div class="text-2xl">📋</div>
						<h3 class="mt-3 text-lg font-semibold">Weekly game plan</h3>
						<p class="mt-2 text-sm text-text-muted">
							Every Sunday, Musashi reviews your week and gives you a specific drill to own before
							next class.
						</p>
					</div>
					<div class="rounded-2xl bg-surface p-6">
						<div class="text-2xl">📶</div>
						<h3 class="mt-3 text-lg font-semibold">Works offline</h3>
						<p class="mt-2 text-sm text-text-muted">
							Log right after rolling — even in the locker room with no signal. It syncs when you're
							ready.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 6: Social Proof -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">What practitioners are saying</h2>
				<div class="mt-10 space-y-6">
					<div class="rounded-2xl bg-surface p-6">
						<p class="text-lg italic text-text-muted">
							"I've been training 2 years and this is the first time I can actually see what I'm
							good at."
						</p>
						<p class="mt-4 text-sm font-medium">
							— Alex M., <span class="text-primary">Blue Belt</span>, 10th Planet San Diego
						</p>
					</div>
					<div class="rounded-2xl bg-surface p-6">
						<p class="text-lg italic text-text-muted">
							"I used to forget everything after class. Now I log it in 60 seconds and Musashi tells
							me exactly what to drill."
						</p>
						<p class="mt-4 text-sm font-medium">
							— Priya R., <span class="text-primary">White Belt</span>, Gracie Barra Austin
						</p>
					</div>
					<div class="rounded-2xl bg-surface p-6">
						<p class="text-lg italic text-text-muted">
							"The weekly summary alone is worth it. It's like having a private coach review your
							week for ten bucks."
						</p>
						<p class="mt-4 text-sm font-medium">
							— Marcus T., <span class="text-primary">Purple Belt</span>, Alliance NYC
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Section 7: Pricing -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">
					Less than a single private lesson. Every&nbsp;month.
				</h2>
				<div class="mx-auto mt-10 max-w-md">
					<div class="rounded-2xl border border-primary/30 bg-surface p-8 text-center">
						<div class="text-5xl font-bold">
							$9.99<span class="text-lg font-normal text-text-muted">/month</span>
						</div>
						<ul class="mt-8 space-y-3 text-left text-sm text-text-muted">
							<li class="flex items-center gap-3">
								<span class="text-success">✓</span> AI coaching after every session
							</li>
							<li class="flex items-center gap-3">
								<span class="text-success">✓</span> Submission & position analytics
							</li>
							<li class="flex items-center gap-3">
								<span class="text-success">✓</span> Weekly personalized game plans
							</li>
							<li class="flex items-center gap-3">
								<span class="text-success">✓</span> Curated video recommendations
							</li>
							<li class="flex items-center gap-3">
								<span class="text-success">✓</span> Works offline
							</li>
						</ul>
						<p class="mt-6 text-sm font-medium text-text-primary">
							Start with 7 days free. Cancel anytime.
						</p>
						<a
							href="/auth/login"
							class="mt-6 inline-block w-full rounded-xl bg-primary py-4 text-center text-lg font-semibold text-white transition-opacity hover:opacity-90"
						>
							Start Free Trial
						</a>
					</div>
					<p class="mt-4 text-center text-sm text-text-muted">
						One private lesson costs $80–150. Musashi is available after every single session for
						$10/month.
					</p>
				</div>
			</div>
		</section>

		<!-- Section 8: FAQ -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">Questions?</h2>
				<div class="mt-10 space-y-2">
					{#each faqs as faq, i}
						<div class="rounded-2xl bg-surface">
							<button
								onclick={() => toggleFaq(i)}
								class="flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium transition-colors hover:text-primary"
							>
								{faq.q}
								<svg
									class="h-5 w-5 shrink-0 text-text-muted transition-transform {faqOpen === i ? 'rotate-180' : ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							{#if faqOpen === i}
								<div class="px-6 pb-4 text-sm text-text-muted">
									{faq.a}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Section 9: PWA Install -->
		<section class="border-t border-slate-800/50 py-20">
			<div class="mx-auto max-w-2xl px-6">
				<h2 class="text-3xl font-bold md:text-4xl">
					Add it to your home screen — use it like an&nbsp;app
				</h2>
				<p class="mt-6 text-lg text-text-muted">
					MatMentor works as a full-screen app straight from your phone. No app store needed —
					install it in 10 seconds.
				</p>
				<div class="mt-8 grid gap-4 md:grid-cols-2">
					<div class="rounded-2xl bg-surface p-6">
						<div class="text-2xl">🍎</div>
						<h3 class="mt-3 text-base font-semibold">iPhone</h3>
						<p class="mt-2 text-sm text-text-muted">
							Tap the <span class="font-medium text-text-primary">Share</span> button →
							<span class="font-medium text-text-primary">"Add to Home Screen"</span> → Done
						</p>
					</div>
					<div class="rounded-2xl bg-surface p-6">
						<div class="text-2xl">🤖</div>
						<h3 class="mt-3 text-base font-semibold">Android</h3>
						<p class="mt-2 text-sm text-text-muted">
							Tap the menu <span class="font-medium text-text-primary">(⋮)</span> →
							<span class="font-medium text-text-primary">"Install app"</span> → Done
						</p>
					</div>
				</div>
				<p class="mt-6 text-sm text-text-muted">
					A dedicated mobile app is on the way. Install now and you'll be first to know when it
					drops.
				</p>
			</div>
		</section>

		<!-- Section 10: Final CTA -->
		<section class="border-t border-slate-800/50 py-24">
			<div class="mx-auto max-w-2xl px-6 text-center">
				<h2 class="text-3xl font-bold md:text-4xl">Your next session deserves a&nbsp;debrief.</h2>
				<p class="mt-6 text-lg text-text-muted">
					Start your free trial — log your first session tonight.
				</p>
				<a
					href="/auth/login"
					class="mt-8 inline-block w-full rounded-xl bg-primary py-4 text-center text-lg font-semibold text-white transition-opacity hover:opacity-90 md:w-auto md:px-12"
				>
					Start Free Trial
				</a>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-slate-800/50 py-8">
		<div class="mx-auto max-w-2xl px-6">
			<div class="flex flex-col items-center gap-4 text-center text-sm text-text-muted md:flex-row md:justify-between md:text-left">
				<span>🥋 Built for the BJJ community</span>
				<div class="flex gap-6">
					<a href="/privacy" class="transition-colors hover:text-text-primary">Privacy Policy</a>
					<a href="/terms" class="transition-colors hover:text-text-primary">Terms of Service</a>
				</div>
			</div>
		</div>
	</footer>
</div>
