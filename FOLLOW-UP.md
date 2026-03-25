# Follow-Up: Decisions Needed Before & After Launch

## Before Implementation

### 1. Stripe Subscription Lifecycle

Decisions to make:

- **When does the free trial start?** At signup? After first message? After onboarding completes?
- **What's the trial length?** 7 days (per paywall wireframe) or something else?
- **What gets locked when trial/limit expires?**
  - All chat? Just new messages? Can they still read history?
  - Dashboard (Game/Progress tabs) still visible or locked?
  - Can they still log sessions but not get AI feedback?
- **Message limit mechanics**: 100 messages/week (per PRD). Does that reset Sunday midnight? Monday? User's timezone or UTC?
- **Failed payment handling**: Grace period? Immediate lock? Downgrade to free tier?
- **Cancellation**: Immediate or end-of-billing-period access?
- **Webhook events to handle**: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`

### 2. First 10 Users — Launch Channel

Who are the first users and how do they find MatMentor?

- **Option A: Gym buddies** — Skip landing page, send direct link. Fastest feedback loop. Risk: they'll be nice and not give honest feedback.
- **Option B: r/bjj or r/jiujitsu** — Needs landing page. Post framing matters ("I built this" vs "check this out"). Risk: Reddit can be brutal, but honest.
- **Option C: BJJ Instagram/TikTok** — Short demo video of the chat experience. Risk: higher effort, unclear conversion.
- **Option D: Local gym bulletin / WhatsApp group** — Low effort, captive audience who trains.

This decision affects build priority:
- Gym buddies → build chat first, skip landing page
- Reddit → landing page + chat both need to be solid
- Social → need a polished demo flow, even if backend is minimal

---

## After You Have Users

These are real features but not worth building until someone is actually using the app:

### 3. PWA / Offline Support
- Service worker for offline session logging
- IndexedDB queue with sync-on-reconnect
- "You're offline" banner in chat
- Install prompt on landing page
- Build this when users complain about losing logs in gym basements with no signal

### 4. Weekly Summary Cron
- Vercel Cron job hitting `POST /api/summaries/generate`
- Batch process all users, generate personalized Musashi summary
- Can fake this manually at first — send summaries yourself for the first 10 users to test if they even read them

### 5. Game & Progress Tab Charts
- Layer Cake charts for submission stats, position breakdown, training calendar
- These tabs can stay as empty states ("Log your first session to see your game here") until you have users with enough data to make charts meaningful
- Build when users ask "where are my stats?"

### 6. Monitoring (PostHog + Sentry)
- Error tracking, session replays, analytics
- Not needed until you have enough traffic to generate actionable data
- Add Sentry first (catch errors), PostHog second (understand behavior)
- **Known gap (2026-03-24):** Ralph's battle-test run removed `console.error` calls from the Stripe webhook and cron summary handlers to prevent sensitive data leakage. The cron handler (`src/routes/api/summary/cron/+server.ts:83-85`) now silently swallows per-user summary failures. Once Sentry is added, replace the bare `catch {}` with structured error reporting so failed summaries are visible without leaking secrets.

---

## Resolved

### Supabase DB Connection (2026-03-24)
- **Issue**: Pooler connection URL used `aws-0-us-east-1.pooler.supabase.com` — returned "Tenant or user not found." Direct host (`db.aclfzsrggbaenstuxpqy.supabase.co`) has no IPv4 A record, only IPv6, and local network doesn't support IPv6.
- **Root cause**: The correct pooler host for this project is `aws-1-us-east-1.pooler.supabase.com` (not `aws-0`). Discovered via `supabase db push --dry-run --debug` which revealed the CLI's actual connection target.
- **Fix**: Updated `DATABASE_URL` in `.env` to use `aws-1-us-east-1.pooler.supabase.com`.
- **Status**: Schema pushed (`db:push`), seed complete (50 techniques + 32 videos). DB fully operational.

---

## Competitor Research

These competitors need thorough research — feature sets, pricing, UX patterns, positioning, and what they do well/poorly. Findings should inform MatMentor's differentiation strategy.

- https://grapplingaiapp.com/
- https://www.bjjnotes.app/
- https://aibjj.com/
- https://www.athleteanalyzer.com/video-analysis-brazilian-jiu-jitsu
- https://brainjiujitsu.com/
- https://digitsu.com/sudo

---

## Not Built Yet

These are required for a complete product but haven't been implemented:

### 7. Data Export (JSON)
- Profile page has a placeholder "Export my data" button — no endpoint behind it
- Build a `GET /api/export` that queries all user data (profile, sessions, events) and returns a JSON download
- Required for GDPR/CCPA compliance

### 8. Account Deletion
- Profile page has a placeholder "Delete my account" button — no endpoint behind it
- Build a `DELETE /api/account` or form action that:
  - Deletes all user data (sessions, events, conversations, messages, message counts)
  - Deletes the Supabase Auth user
  - Deletes the `users` row (cascade should handle related tables)
  - Signs out and redirects to landing page
- Add a confirmation dialog before deletion
- Required for GDPR/CCPA compliance

### 9. Privacy Policy & Terms of Service Pages
- Landing page footer links to these but the pages don't exist
- Create `/privacy` and `/terms` routes with the actual legal text
- Can start with a standard SaaS template, customize for BJJ/training data sensitivity

### 10. Training Reminder Notifications
- No push notifications or email reminders implemented
- Phase 1.5 feature per roadmap, but worth noting here
- Options: Vercel Cron + email (Resend/Postmark), or Web Push API
- Trigger: user hasn't logged in N days, send a nudge
