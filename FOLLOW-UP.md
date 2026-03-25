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
