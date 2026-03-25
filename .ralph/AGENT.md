# MatMentor (Ronin) — Agent Build Guide

## Install & Run

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run check        # TypeScript + Svelte check
npm run test         # Run vitest (after you install it)
```

## Key File Paths

| What | Where |
|---|---|
| DB schema (8 tables) | `src/lib/server/db/schema.ts` |
| DB client | `src/lib/server/db/index.ts` |
| Auth hooks | `src/hooks.server.ts` |
| Auth guard + auto-provision | `src/routes/(app)/+layout.server.ts` |
| Login page + action | `src/routes/auth/login/+page.server.ts` |
| OTP confirm | `src/routes/auth/confirm/+server.ts` |
| Logout | `src/routes/auth/logout/+server.ts` |
| Onboarding action | `src/routes/onboarding/+page.server.ts` |
| Chat API (streaming) | `src/routes/api/chat/+server.ts` |
| Session logging API | `src/routes/api/sessions/+server.ts` |
| Summary API | `src/routes/api/summary/+server.ts` |
| Summary cron | `src/routes/api/summary/cron/+server.ts` |
| Stripe checkout | `src/routes/api/stripe/checkout/+server.ts` |
| Stripe webhook | `src/routes/api/stripe/webhook/+server.ts` |
| Stripe client | `src/lib/server/stripe.ts` |
| AI system prompt | `src/lib/server/ai/system-prompt.ts` |
| Components | `src/lib/components/` (BottomNav + shadcn ui/) |
| Env template | `.env.example` |

## External Services (DO NOT call in tests)

- **Supabase Auth** — mock `locals.supabase` and `locals.safeGetUser()`
- **OpenRouter** (chat) — mock `streamText` from `ai` package
- **Anthropic** (summaries) — mock `generateText` from `ai` package
- **Stripe** — mock `stripe` import, use `stripe.webhooks.constructEvent` test patterns

## Gotchas

- No `process.env` — SvelteKit uses `$env/static/private` and `$env/static/public`
- Tailwind v4 has no `tailwind.config.js` — config is in `src/app.css`
- Svelte 5 uses runes — `$props()` not `export let`, `$state()` not `let`
- The DB schema is locked — do NOT modify `schema.ts` or create migrations
- `safeGetUser()` returns `{ user }` not just `user`
