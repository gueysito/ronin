# Ronin (MatMentor) — Project Instructions

## Tech Stack (Locked March 2026)
- SvelteKit 2.55 + Svelte 5.55 (runes) + TypeScript 5 (strict)
- Tailwind CSS v4 (CSS-only config, no tailwind.config.js) + shadcn-svelte (bits-ui, nova style)
- Supabase (Postgres + Auth via @supabase/ssr + pgvector)
- Drizzle ORM + postgres-js driver
- Vercel AI SDK 5.0 + @ai-sdk/anthropic + @ai-sdk/openai
- Stripe (payments)
- Layer Cake (charts)
- Vercel (hosting via @sveltejs/adapter-vercel)

## Research Before Implementing
- Before implementing any library or integration, use Context7 to fetch current documentation first. Do not rely on training data for API signatures, config options, or patterns — check the docs.
- For edge cases, bugs, or issues not covered by official docs, use the Exa skill to search for community solutions and real-world usage.
- This applies to all stack dependencies: SvelteKit, Svelte 5, Drizzle, Supabase, Vercel AI SDK, shadcn-svelte, Layer Cake, Stripe, Zod.

## Critical API Patterns (Verified March 2026)
- **Svelte 5**: `$props()` not `export let`, `$state()` for reactivity, `$derived()` not `$:`, `{@render children()}` not `<slot />`
- **Tailwind v4**: Config is CSS-only in `src/app.css` via `@theme {}`. No `tailwind.config.js`. Plugin order in vite.config.ts: `tailwindcss()` before `sveltekit()`.
- **AI SDK 5.0**: Use `Chat` class from `@ai-sdk/svelte` (not old `useChat` function). Messages use `parts` array. Server uses `convertToModelMessages()` + `toUIMessageStreamResponse()`.
- **Supabase Auth**: Use `@supabase/ssr` with `createServerClient` in hooks.server.ts. Use `getClaims()` (not `getSession()`) for JWT validation. Env var is `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not ANON_KEY).
- **Drizzle**: Schema in `src/lib/server/db/schema.ts`. Use `createAnthropic({ apiKey })` since Vite doesn't populate `process.env`.

## Conventions
- Use Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`) — never legacy `export let` or `$:` syntax
- Use `+server.ts` for API routes, `+page.svelte` / `+page.server.ts` for pages
- Server-only code lives in `src/lib/server/` — never import from there in client code
- Components go in `src/lib/components/` with PascalCase filenames
- Use Drizzle query builder — no raw SQL unless aggregation requires it
- Validate all external inputs (user, API, LLM responses) with Zod
- Use Vercel AI SDK's `Chat` class / `streamText` for all LLM interactions — never raw fetch to AI providers

## File Locations
- Database schema: `src/lib/server/db/schema.ts`
- Database client: `src/lib/server/db/index.ts`
- Drizzle config: `drizzle.config.ts`
- Migrations: `drizzle/migrations/`
- AI prompts: `src/lib/server/ai/`
- Supabase hooks: `src/hooks.server.ts`
- UI components: `src/lib/components/` (shadcn in `ui/` subfolder)
- Product docs: `docs/`
- Homework templates: `docs/mvp-homework/`

## Key Decisions (see DECISIONS.md for full rationale)
- Supabase Auth replaces Clerk (first-class SvelteKit support)
- Drizzle over Prisma (lighter, no binary engine, better edge compat)
- Chat messages are persisted in `messages` + `conversations` tables
- AI content recommendations are whitelist-only (approved instructors)
- Musashi (AI coach) must NEVER give medical advice

## Don't
- Don't use React patterns (useEffect, useState, JSX) — this is Svelte
- Don't use Prisma — we use Drizzle
- Don't import `@clerk/*` — we use Supabase Auth
- Don't call AI providers directly — go through Vercel AI SDK
- Don't commit .env or any file containing credentials
- Don't use `export let` or `$:` — Svelte 5 runes only
- Don't use `<slot />` — use `{@render children()}`
- Don't create `tailwind.config.js` — Tailwind v4 uses CSS-only config
- Don't use `useChat` function — AI SDK 5.0 uses `Chat` class
- Don't use `getSession()` for Supabase auth — use `getClaims()`
