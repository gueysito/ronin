# Ralph Mission: MatMentor (Ronin) Battle Test

## Context

You are testing **MatMentor** (codename Ronin), a BJJ AI coaching app built with SvelteKit 2.55, Svelte 5, TypeScript 5, Supabase, Drizzle ORM, Vercel AI SDK, and Stripe. The AI coach persona is called "Musashi."

The app has **zero tests** and **no test framework installed**. Your first priority is setting up vitest, then systematically working through the fix plan.

## Your Mission

Work through `.ralph/fix_plan.md` one checkbox at a time:

1. Read the current state of `.ralph/fix_plan.md` to find the next unchecked `- [ ]` item
2. Implement the fix, test, or verification described by that checkbox
3. **CRITICAL: Edit `.ralph/fix_plan.md` and change `- [ ]` to `- [x]` for that specific checkbox.**
   This is how progress is tracked. If you do not edit the file, the loop will not know you completed the task.
4. Commit your changes (including the updated fix_plan.md) with a clear message
5. Move to the next unchecked item

## Important Rules

- **Start with P5's vitest setup** — you need a test runner before you can write tests for P0-P4
- For auth-related items (P0 auth flow, magic link), you cannot test real OTP — write integration tests that mock Supabase auth and verify the server-side logic
- For AI/chat items, mock the AI SDK calls — don't make real API calls in tests
- For Stripe items, use Stripe's test mode patterns and mock webhook events
- For "verify X doesn't happen" items, write a test that would fail if the bad behavior occurred
- When adding Zod validation (P5), write the schema AND a test for it
- Read `AGENT.md` for build commands and project structure
- Do NOT modify the Drizzle schema or run migrations — the DB schema is locked
- Do NOT install packages beyond vitest, @testing-library/svelte, and their peer deps unless absolutely necessary

## Tech Stack Quick Reference

- Svelte 5 runes: `$props()`, `$state()`, `$derived()`, `{@render children()}`
- Tailwind v4: CSS-only config in `src/app.css` via `@theme {}`
- AI SDK 5.0: `Chat` class, `streamText`, `convertToModelMessages`, `toUIMessageStreamResponse`
- Supabase: `createServerClient` in hooks, `safeGetUser()` helper
- Drizzle: schema in `src/lib/server/db/schema.ts`, query builder syntax
- Env vars: never use `process.env` — use `$env/static/private` or `$env/static/public`

## Exit Protocol

- When ALL checkboxes in fix_plan.md are marked `[x]`, output exactly: `EXIT_SIGNAL=true`
- If you have nothing left to do, output exactly: `EXIT_SIGNAL=true`
- Do NOT keep looping after all tasks are complete
- Do NOT say "nothing to do" — instead output `EXIT_SIGNAL=true`
