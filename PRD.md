# Product Requirements Document (PRD): MatMentor

**Project Codename**: MatMentor (BJJ AI Coaching App)  
**Version**: 2.0 (Refined Post-Discussion)  
**Date**: October 13, 2025  
**Status**: Pre-Development  
**Product Owner**: Carlos Salas-Porras

---

## 1. Executive Summary

### 1.1 Vision Statement
MatMentor is an AI-powered Brazilian Jiu-Jitsu coaching companion that helps practitioners master both the physical and mental aspects of their game through intelligent tracking, personalized feedback, and psychological support—all delivered in a judgment-free environment.

### 1.2 Problem Statement
BJJ practitioners face three core challenges:
1. **Unstructured Progression**: No clear visibility into strengths, weaknesses, or improvement patterns
2. **Psychological Barriers**: Fear of asking "stupid questions," mental blocks, competition anxiety
3. **Broken Feedback Loops**: Traditional journals lack intelligence; gyms can be intimidating

### 1.3 Solution Overview
An AI coach named "Musashi" that:
- Tracks training via conversational chat (not boring forms)
- Provides technique feedback grounded in world-class coaching wisdom
- Offers psychological support for confidence, plateaus, and mental resilience
- Visualizes progress through a "Skill Tree" showing mastery across all positions/techniques

### 1.4 Key Differentiators
- **Mental Game Focus**: Not just a tracker—addresses sports psychology
- **Chat-First UX**: Logging feels like talking to a coach, not filling spreadsheets
- **Skill Tree Visualization**: See your entire BJJ game at a glance (unique to market)
- **Curated Content**: Only links to elite instructors (Danaher, Ribeiro, Giles, etc.)

---

## 2. Target Market

### 2.1 Primary Audience
**White to Purple Belt practitioners** who:
- Train 2-4 times per week
- Are motivated to improve systematically
- Feel intimidated asking basic questions in class
- Want to understand their progress objectively

**Market Size Estimate**:
- ~3.5M BJJ practitioners in US (IBJJF data)
- ~60% are white-purple belt (~2.1M)
- ~30% train consistently (630K addressable market)
- Target 1% penetration Year 1 = 6,300 users

### 2.2 User Personas

#### Beginner Bianca (White Belt, 6 months)
- **Age**: 28, works in tech
- **Goals**: Survive sparring, escape bad positions, build confidence
- **Pain Points**: Feels lost during rolling, embarrassed to ask basic questions
- **Needs**: Structure, encouragement, defense-first curriculum

#### Competitive Chris (Blue/Purple Belt, 3 years)
- **Age**: 24, college student, competes monthly
- **Goals**: Win tournaments, develop signature techniques, optimize training
- **Pain Points**: Plateaus, can't identify weaknesses objectively
- **Needs**: Data-driven insights, competition prep tools, recovery guidance

#### Hobbyist Harry (Brown Belt, 45 years old)
- **Age**: 45, office job, 2 kids
- **Goals**: Stay healthy, refine technique, train smarter (not harder)
- **Pain Points**: Injuries, limited time, needs efficiency
- **Needs**: Injury prevention, technique refinement, longevity focus

---

## 3. Product Goals & Success Metrics

### 3.1 Business Goals
- **Revenue**: $10K MRR by Month 6, $50K MRR by Month 12
- **Users**: 1,000 paying subscribers by Month 6
- **Growth**: 20% MoM user growth post-launch
- **Profitability**: Profitable from Month 2 (high margins: ~85%)

### 3.2 Key Performance Indicators (KPIs)

| Metric | Definition | Target (6 months) | Measurement |
|--------|-----------|-------------------|-------------|
| **Activation Rate** | % of signups who complete onboarding + log 1 session within 48h | >70% | PostHog funnel |
| **Engagement** | Average training sessions logged per active user per week | >2.5 logs/week | Custom SQL query |
| **7-Day Retention** | % of users who return 7 days after signup | >50% | PostHog cohorts |
| **Trial Conversion** | % of free trial users who convert to paid | >20% | Stripe webhooks |
| **Monthly Churn** | % of subscribers who cancel per month | <8% | Stripe metrics |
| **NPS (Net Promoter Score)** | Would you recommend MatMentor? (1-10 scale) | >50 | In-app survey |
| **Content Usefulness** | % of recommended videos rated "useful" by users | >80% | Thumbs up/down |

### 3.3 Success Criteria for MVP Launch
- ✅ 20 beta testers complete 7+ days of usage
- ✅ Trial → Paid conversion >15% in beta cohort
- ✅ Average session log takes <60 seconds
- ✅ AI feedback rated "helpful" by >70% of users
- ✅ Zero critical bugs (login, payment, data loss)

---

## 4. Functional Requirements

### 4.1 Epic 1: User Authentication & Onboarding

#### R1.1: Authentication (via Supabase Auth)
- Users MUST be able to sign up with email (magic link or password)
- Social auth (Google OAuth) optional but recommended
- Session management (persistent login across devices)
- Protected routes (redirect to login if not authenticated)

#### R1.2: Chat-Based Onboarding
- Onboarding MUST occur via chat interface (not a form)
- MUST collect:
  - **Belt Rank**: White, Blue, Purple, Brown, Black (quick-select buttons)
  - **Experience**: Duration training (dropdown: <6mo, 6-12mo, 1-2yr, 2-3yr, 3+yr)
  - **Goals**: Short-term (3 months), medium-term (6 months) via free text
  - **Top Weaknesses**: Select 2-3 positions/techniques from controlled vocabulary
  - **Training Frequency**: Days per week (1-2, 3-4, 5-6, 7+)
  - **Baseline State**: Current energy, sleep quality, any injuries (brief free text)
- Onboarding MUST complete in <3 minutes
- Data MUST be validated via Zod schemas before storage
- User MUST be able to edit profile later (Settings screen)

#### R1.3: Profile Storage
- All onboarding data stored in `users` table (Drizzle)
- Goals stored in separate `goals` table (enables tracking progress toward goals)
- Profile completion status tracked (for analytics: "Did user finish onboarding?")

---

### 4.2 Epic 2: Post-Training Logging (Core Loop)

#### R2.1: Guided Chat Logging
- Primary interface for logging is the chat screen
- Musashi initiates: "Hey! Did you train today?"
- User responds via quick-select buttons OR free text

#### R2.2: Data Capture Requirements
The system MUST capture:
- **Session Metadata**:
  - Date/time (auto-populated, editable)
  - Duration (minutes, via quick-select or manual entry)
  - Type (Rolling, Drilling, Open Mat, Competition, Private Lesson)
  - Intensity (RPE 1-10 scale, presented as emoji grid)
- **Technical Performance**:
  - Submissions Achieved (technique + position + against whom)
  - Submissions Received (technique + position)
  - Positions struggled with (multi-select)
  - Positions dominated (multi-select)
- **Holistic State**:
  - Energy level (1-5 scale: 🔥 Great → 😓 Exhausted)
  - Sleep quality previous night (1-5 scale)
  - Soreness/injuries (free text, optional)
  - Mood/confidence during training (emoji quick-select: Confident, Frustrated, Focused, Anxious, Flow State)
- **Optional Notes**: Free text for any additional context

#### R2.3: Input Methods
- **Quick-Select Buttons**: For all common techniques, positions, and scales
- **Autocomplete**: For technique/position search (type "arm" → see "Armbar, Americana, Arm Triangle")
- **Free Text**: Fallback for uncommon scenarios
- **Voice Input** (Phase 1.5): Record audio → Whisper API → auto-populate chat

#### R2.4: Data Normalization
- Backend MUST parse user input and map to canonical IDs in database
- Example: "armbar from guard" → `{ technique_id: 1, position_id: 3 }`
- Handle synonyms: "RNC" = "Rear Naked Choke" = "Mata Leão"
- Store raw user input in `events.raw_input` for debugging/improvement
- Validate all data with Zod before insertion

#### R2.5: AI Feedback Generation
After logging, Musashi MUST respond with:
1. **Encouragement** (personalized, references their specific techniques)
2. **Technical Insight** (1-2 sentences, e.g., "Your guard retention is improving!")
3. **Next Focus** (Specific drill or concept to work on next session)
4. **Holistic Nudge** (If low energy/sleep → recovery advice; if frustrated → psychological support)
5. **Content Link** (1-2 curated video links relevant to their weakness or next focus)

**Context for AI**:
- Retrieve last 3-5 sessions from database
- Include user profile (belt, goals, known weaknesses)
- Format as JSON and inject into system prompt

**Constraints**:
- Response MUST be <3 sentences unless user asks for detail
- MUST cite only from approved content whitelist
- MUST NOT provide medical advice (injuries → "see a professional")

---

### 4.3 Epic 3: Dashboard & Analytics

#### R3.1: Information Architecture
Dashboard consists of 3 main sections:
1. **Game Tab**: What you're good/bad at (technique analysis)
2. **Progress Tab**: Are you training enough? (consistency, trends)
3. **Profile Tab**: Settings, goals, subscription

#### R3.2: "Game" Tab Requirements
- **Submission Stats Card**:
  - Total submissions this week/month (with % change from previous period)
  - Pie chart breakdown by technique type (armbars, chokes, joint locks, etc.)
  - List of "Top 3 Weapons" (most successful techniques)
  - List of "Common Vulnerabilities" (techniques you get caught with most)
- **Position Heatmap** (Phase 2, simplified version in MVP):
  - Grid showing success rate by position (guard, mount, side control, etc.)
  - Color-coded: Green (strength), Red (weakness)
- **Strengths vs Weaknesses**:
  - Side-by-side comparison (e.g., "Strong at guard, weak at passing")

#### R3.3: "Progress" Tab Requirements
- **Training Calendar**:
  - Month view with logged sessions highlighted
  - Streak counter (current streak + longest streak)
  - Visual indicator for training goal (e.g., "3/4 sessions this week")
- **Weekly Volume Chart**:
  - Bar chart showing hours trained per week (last 8 weeks)
- **Energy & Recovery Trends**:
  - Line graph: Energy level over time (last 30 days)
  - Line graph: Sleep quality over time
  - Alerts if energy consistently low (suggest rest week)
- **Cardio Performance** (Phase 2):
  - Track RPE vs duration (are you building endurance?)

#### R3.4: Data Aggregation Functions
Backend MUST provide API endpoints for:
- `GET /api/stats/submissions` (counts by type, time range)
- `GET /api/stats/positions` (success rates by position)
- `GET /api/stats/consistency` (days trained, streaks)
- `GET /api/stats/trends` (energy, sleep, mood over time)

All queries MUST be optimized (indexed columns, avoid N+1 queries)

#### R3.5: Performance Requirements
- Dashboard MUST load in <2 seconds on 4G connection
- Charts MUST be responsive (mobile + desktop)
- Empty states MUST guide users to log first session

---

### 4.4 Epic 4: Weekly AI Summaries

#### R4.1: Summary Generation Logic
Every Sunday at 8:00 PM (user's timezone):
- Query all sessions from past 7 days for user
- Aggregate:
  - Total sessions (vs weekly goal)
  - Total submissions by type
  - Most common position struggles
  - Energy/mood patterns
  - Consistency (vs previous week)
- Generate AI summary via OpenAI:
  - Highlight wins (e.g., "You hit 5 armbars this week—new record!")
  - Identify patterns (e.g., "You struggle with half guard when tired")
  - Suggest focus for next week (specific drill or concept)

#### R4.2: Delivery Method
- Post summary as a special message in chat (styled differently than regular messages)
- Include inline chart (submission trend, for example)
- Add actionable CTAs: "Start this drill tomorrow" (links to video)

#### R4.3: Scheduling & Hosting (Vercel Cron)
- Weekly summaries are triggered by a **Vercel Cron Job** defined in `vercel.json`
- Cron schedule: `0 20 * * 0` (every Sunday at 8:00 PM UTC — adjust for user timezone in logic)
- Cron hits a protected SvelteKit API route: `POST /api/summaries/generate`
- The route is authenticated via a `CRON_SECRET` env var (Vercel sets this automatically; the route rejects requests without a matching `Authorization: Bearer <CRON_SECRET>` header)
- **Flow**:
  1. Route queries all active users who have logged at least 1 session in the past 7 days
  2. For each user, aggregates weekly data via Drizzle (sessions, techniques, mood, energy)
  3. Sends aggregated context to LLM (Claude Haiku 4.5) with summary prompt
  4. Writes the AI-generated summary as a new message in the user's active conversation (message type: `weekly_summary`)
  5. Logs success/failure per user to Sentry
- **Timeout**: Vercel cron functions have a 60s limit on Hobby, 300s on Pro. Batch users if needed (process 50 users per invocation, chain if more)
- **Idempotency**: The route MUST check if a summary was already generated for this user + week to avoid duplicates on retry

#### R4.4: User Controls
- User can disable weekly summaries (Settings > Notifications)
- User can request summary on-demand: "Show me this week's summary"

---

### 4.5 Epic 5: The BJJ Skill Tree (Data Foundation in MVP)

#### R5.1: Hierarchical Data Structure
The system MUST organize BJJ knowledge in a tree:
```
Domain (5 total)
├─ Position (20 total)
│  ├─ Action (e.g., Sweeps, Submissions, Escapes)
│  │  └─ Technique (50 total in MVP)
```

**Example**:
```
Guard (Domain)
├─ Closed Guard (Position)
│  ├─ Submissions (Action)
│  │  ├─ Armbar (Technique)
│  │  ├─ Triangle (Technique)
│  │  └─ Kimura (Technique)
│  └─ Sweeps (Action)
│     ├─ Scissor Sweep (Technique)
│     └─ Flower Sweep (Technique)
```

#### R5.2: MVP Taxonomy
**Domains** (5):
- Guard
- Passing
- Top Control
- Escapes
- Takedowns

**Positions** (20 - user to define exact list):
- Examples: Closed Guard, Open Guard, Half Guard, Mount, Side Control, Back, etc.

**Techniques** (50 - user to define exact list):
- Examples: Armbar, Triangle, RNC, Kimura, Guillotine, Scissor Sweep, etc.
- Include "Other" option for techniques not in list

#### R5.3: Data Mapping
- Every logged event (submission, struggle) MUST be mapped to technique_id + position_id
- Stored in `events` table with foreign keys to `techniques` and `positions`
- This enables future Skill Tree visualization and proficiency calculations

#### R5.4: Phase 2 Requirements (NOT MVP)
- Interactive tree visualization (D3.js or Visx)
- Proficiency scores (success rate + conceptual quizzes)
- Belt-level coloring (e.g., "You're purple belt level at armbars but blue belt level at passing")
- Click node → see videos, drills, stats

---

### 4.6 Epic 6: Content Curation & Recommendations

#### R6.1: Approved Content Whitelist
The system MUST only recommend content from:
- **Approved Instructors**: John Danaher, Lachlan Giles, Bernardo Faria, Gordon Ryan, Marcelo Garcia, Saulo Ribeiro, Roger Gracie
- **Approved Channels**: YouTube channels verified to be high-quality, free instructionals

#### R6.2: Seed Data Requirements
- User MUST provide 50 YouTube video links mapped to techniques
- Format: `{ technique_id, title, url, instructor, quality_tier }`
- Stored in `content_links` table

#### R6.3: Recommendation Rules
- When AI suggests a technique to work on, it MUST include 1-2 video links from whitelist
- If NO video exists for a technique, AI MUST suggest a drill prescription instead (text-based)
- AI MUST disclose affiliate links if present

#### R6.4: Future: MCP YouTube Integration (Phase 2)
- Agent can search YouTube dynamically via MCP
- Results filtered by approved channel whitelist
- Returns top 3 results for any technique

---

### 4.7 Epic 7: Payments & Subscription Management

#### R7.1: Pricing Model
- **Free Trial**: 1 week full access (requires email signup only)
- **Paid Subscription**: $9.99/month (or 3-month bundle at discounted rate)
- **Free Tier (post-trial)**: Can view old data, but cannot log new sessions or get AI feedback

#### R7.2: "Tweet for Free Week" Feature
- User can extend trial by 7 days if they tweet about the app
- Tweet MUST include pre-filled text + app link + auto-generated share card
- System verifies tweet posted (check Twitter/X API)
- Limit: Once per user

#### R7.3: Payment Processing (Stripe)
- Checkout flow MUST use Stripe Checkout (hosted page for simplicity)
- Webhooks MUST handle:
  - `checkout.session.completed` → activate subscription
  - `customer.subscription.updated` → sync subscription status
  - `customer.subscription.deleted` → downgrade to free tier
- User MUST be able to manage subscription (cancel, update card) via Stripe Customer Portal

#### R7.4: Access Control & Rate Limiting

**Subscription Gating**:
- SvelteKit server hook (`hooks.server.ts`) checks `user.subscriptionStatus` on every protected request
- New session logging: free tier (post-trial) → blocked; trial/paid → allowed
- Dashboard viewing: all tiers → allowed (users can always see their historical data)

**AI Message Rate Limiting**:
- **Tracking**: `message_counts` table in Supabase with columns: `user_id`, `week_start` (date), `count` (integer)
- **Increment**: On every user message to the chat API, increment `count` via Drizzle. Use `week_start` = Monday 00:00 UTC of the current week
- **Check**: Before processing a chat message, query the user's current week count. If at or above limit, reject before calling the LLM (saves AI cost)
- **Limits**:
  - Free trial: 20 messages/week
  - Paid: 100 messages/week
- **Reset**: No cron needed — the `week_start` column naturally rotates. A new week means a new row (or upsert with new `week_start` value)
- **Enforcement point**: SvelteKit server hook runs before the `/api/chat` route handler. This ensures rate limiting is centralized, not scattered across routes

**User-Facing Messaging When Limit Hit**:
- Musashi responds in-character (not a system error):
  > "We've had a great conversation this week — you've used all your messages. Upgrade to keep going, or I'll be back next week."
- Include an inline "Upgrade" button that links to the Stripe checkout flow
- The message MUST be stored in the conversation so the user sees it if they return later
- Logging quick-select buttons are hidden when limit is reached (prevent confusion where user taps but nothing happens)

**Abuse Prevention**:
- If a user creates multiple accounts (same email domain pattern or device fingerprint), flag via Sentry alert for manual review
- Stripe checkout requires a valid payment method — prevents infinite trial abuse after the free week

**Scaling Path** (not MVP):
- At 1,000+ concurrent users, add Redis (or Supabase Realtime cache) as a read-through cache for rate limit checks to reduce DB queries
- At that scale, consider per-minute rate limiting (not just weekly) to prevent burst abuse

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Page Load**: App MUST become interactive within 3 seconds on 4G connection
- **AI Response**: Chat messages MUST stream back within 1 second (using SSE or streaming)
- **Dashboard**: All charts MUST render in <2 seconds
- **Database Queries**: No query should exceed 500ms (optimize with indexes)

### 5.2 Security & Privacy
- **Data Encryption**: All data encrypted in transit (TLS) and at rest (Postgres encryption)
- **GDPR/CCPA Compliance**:
  - Data export: User can download all their data as JSON
  - Right to deletion: User can delete account + all data (hard delete)
- **Sensitive Data Handling**: Mental state, injuries, and mood data treated as highly sensitive
- **Auth**: Sessions expire after 30 days of inactivity

### 5.3 Scalability
- **MVP Target**: Support 1,000 concurrent users
- **Database**: Postgres with connection pooling (pgBouncer)
- **Hosting**: VPS can handle 500-1,000 users; migrate frontend to Vercel at scale
- **Rate Limiting**: Per-user limits on AI messages (prevent abuse)

### 5.4 Accessibility
- **WCAG 2.1 AA Compliance**: Use Radix UI (accessible by default)
- **Keyboard Navigation**: All actions accessible via keyboard
- **Screen Readers**: Proper ARIA labels on all interactive elements
- **Color Contrast**: Minimum 4.5:1 ratio (test with tools)

### 5.5 Browser Support
- **Desktop**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile**: iOS Safari, Chrome Android (last 2 versions)
- **PWA**: Must be installable on iOS and Android

### 5.6 Offline Resilience & Connectivity UX

#### Design Principle
Training logs are captured in gyms — sweaty hands, spotty wifi, locker rooms with no signal. The app MUST treat offline as a normal state, not an error. Users should feel confident capturing their thoughts immediately after training, knowing nothing will be lost.

#### Connectivity Detection & User Messaging
- The app MUST detect connectivity state in real time (online/offline/slow)
- **When offline or on weak signal**, display a persistent but non-alarming banner:
  > "You're offline — no worries. Log your session now and it'll sync when you're back in range."
- The banner MUST appear BEFORE the user tries to interact, not after a failed request
- **When connectivity returns**, the banner transitions to:
  > "Back online — syncing your session..." → "All caught up ✓" (auto-dismiss after 3 seconds)
- The chat input and logging quick-select buttons MUST remain fully functional while offline

#### Offline Data Capture (IndexedDB Queue)
- All training logs (session data, events, mood, notes) MUST be stored locally in IndexedDB immediately on submit
- Chat messages the user sends while offline MUST be queued locally with timestamps
- The app MUST show the user's queued messages in the chat thread (styled normally, with a subtle "pending sync" indicator like a small clock icon)
- Dashboard data from the last successful load MUST be cached and viewable offline
- Previous conversation history MUST be cached and readable offline

#### Sync Behavior
- When connectivity returns, the app MUST flush the IndexedDB queue to Supabase in chronological order
- Sync MUST be automatic — no user action required
- If a queued log syncs successfully, the pending indicator on that message resolves silently
- If sync fails (e.g., auth expired), queue is preserved and retried on next connectivity change
- Queued logs MUST never be lost — IndexedDB data persists across app restarts and device reboots

#### What Requires Connectivity
These features gracefully degrade when offline:
- **AI chat responses**: Musashi needs the LLM — queued user messages get AI responses once back online. Show: "Musashi will respond when you're back online."
- **Real-time dashboard updates**: Stale cached data is shown with a "Last updated: [timestamp]" label
- **Payment flows**: Stripe requires connectivity — disable payment buttons with: "Payments require an internet connection"
- **Weekly summaries**: Generated server-side, delivered on next sync

#### Service Worker & PWA Requirements
- Service worker MUST cache the app shell, UI assets, and last-loaded data for instant offline startup
- PWA install prompt MUST be shown after 2nd visit (not immediately — avoid annoying new users)
- App MUST launch from home screen in standalone mode (no browser chrome)

---

## 6. User Experience Requirements

### 6.1 Onboarding Flow
1. User lands on landing page
2. Clicks "Start Free Trial"
3. Signs up via email (magic link or password)
4. Sees welcome message from Musashi in chat
5. Completes 5-7 onboarding questions (belt, goals, etc.)
6. Receives personalized welcome message + first drill suggestion
7. Prompted to log first session (or "I'll train tomorrow")

**Success Criteria**: 70% of signups complete onboarding

### 6.2 Daily Logging Flow
1. User trains at gym
2. Receives reminder notification (optional, Phase 1.5)
3. Opens app → Musashi asks "Did you train today?"
4. Taps "Yes" → Quick-select flow (duration, energy, techniques)
5. Submits log → AI generates feedback in <2 seconds
6. Sees updated dashboard stats (inline in chat or swipe to Dashboard tab)

**Success Criteria**: Logging takes <60 seconds; 80% of users log within 24h of training

### 6.3 Dashboard Exploration
1. User taps "Game" tab
2. Sees submission stats card (top of page)
3. Scrolls to see position heatmap (Phase 2) or strengths/weaknesses list
4. Taps on a technique → sees detailed stats + recommended videos
5. Taps video link → opens in new tab (YouTube)

**Success Criteria**: Users spend >2 minutes on dashboard per week

---

## 7. Technical Architecture

### 7.1 Tech Stack Summary — Revised March 2026
See [DECISIONS.md](./DECISIONS.md) for full rationale.

| Layer | Technology |
|-------|-----------|
| Frontend | SvelteKit, Svelte 5 (runes), TypeScript |
| Styling | Tailwind CSS, shadcn-svelte (bits-ui) |
| Backend | SvelteKit server routes, TypeScript |
| Platform | Supabase (PostgreSQL + Auth + pgvector + Edge Functions) |
| ORM | Drizzle |
| Validation | Zod |
| Auth | Supabase Auth |
| Payments | Stripe |
| AI | Vercel AI SDK + Claude Haiku 4.5 / GPT-4.1-mini (chat), Groq Whisper (voice, Phase 1.5) |
| Charts | Layer Cake |
| Hosting | Vercel (SvelteKit adapter) |
| Monitoring | PostHog (analytics), Sentry (errors) |

### 7.2 Data Model Overview

**Core Tables**:
- `users`: Profile, belt, goals, subscription status
- `sessions`: Training logs (date, duration, intensity, energy, mood)
- `events`: Specific techniques hit/received during sessions (links to techniques + positions)
- `techniques`: Canonical list of BJJ techniques (armbar, triangle, etc.)
- `positions`: Canonical list of BJJ positions (guard, mount, etc.)
- `goals`: User goals (short/medium/long term)
- `messages`: Chat message history (user + AI messages, per conversation)
- `conversations`: Chat conversation threads (groups messages by context)
- `content_links`: Curated video links (technique_id → YouTube URL)
- `memories` (Phase 1.5): Vector embeddings for semantic search (Supabase pgvector)

**Relationships**:
- `sessions` → `users` (many-to-one)
- `events` → `sessions` (many-to-one)
- `events` → `techniques` (many-to-one)
- `events` → `positions` (many-to-one)
- `content_links` → `techniques` (many-to-one)
- `messages` → `conversations` (many-to-one)
- `conversations` → `users` (many-to-one)

See `/drizzle/schema.ts` for full schema.

### 7.3 AI Agent Architecture

**System Prompt Structure**:
```markdown
# Identity
You are Musashi, a wise BJJ coach blending Danaher's precision, 
Rickson's philosophy, and Saulo's systematic approach.

# Tone
Calm, specific, analytical, encouraging. Adapt detail level to user's belt rank.

# Core Rules
1. Keep responses <3 sentences unless asked for detail
2. Reference user's history (past sessions, goals)
3. Only recommend content from approved whitelist
4. NEVER give medical advice (injuries → "see a professional")
5. Provide psychological support for mental blocks, frustration, plateaus

# Context
[Last 3 sessions injected here as JSON]
[User profile: belt, goals, known weaknesses]

# Output Format
1. Encouragement (specific to their performance)
2. Technical insight (1-2 sentences)
3. Next focus (specific drill or concept)
4. Optional: Video link (only from whitelist)
```

**Context Management (MVP)**:
- Retrieve last 3-5 sessions from database as JSON
- Format: `[{ date, techniques, energy, mood, coach_feedback }]`
- Inject into prompt under `# Context` section
- Token budget: ~500 tokens for context

**Phase 1.5 Upgrade (RAG)**:
- Generate embeddings for session summaries (OpenAI `text-embedding-3-small`)
- Store in `memories` table (Supabase pgvector)
- Semantic search: retrieve top 3 relevant memories
- Inject into prompt alongside recent sessions

### 7.4 LLM Error Handling & Resilience

#### Provider Fallback Chain
The system MUST implement automatic provider fallback via Vercel AI SDK:
1. **Primary**: Claude Haiku 4.5
2. **Fallback**: GPT-4.1-mini
3. **Last resort**: Graceful in-character error message

If the primary provider fails (timeout, 5xx, rate limit), the SDK switches to the fallback provider transparently. The user never sees a provider name or technical error.

#### Retry Strategy
- **Max retries**: 3 attempts per provider before falling through to next
- **Backoff**: Exponential — 1s, 2s, 4s between retries
- **Timeout**: 10-second hard limit per request. Streaming MUST begin within 2 seconds; if no tokens arrive in 10s, treat as failure
- **Idempotency**: Retries MUST NOT create duplicate messages in the database

#### User-Facing Error Behavior
- On transient failure (retries exhausted on all providers), Musashi responds in-character:
  > "I'm having trouble thinking clearly right now. Try sending that again in a moment."
- On persistent failure (3+ consecutive errors for same user), display a non-blocking banner:
  > "Musashi is temporarily unavailable. Your message has been saved and he'll respond when back online."
- NEVER expose stack traces, provider names, HTTP status codes, or token counts to the user

#### Cost Monitoring & Provider Rate Limits
- Track per-user token usage in the database (input tokens + output tokens per message)
- Alert via Sentry if any single user exceeds $1.00/day in AI cost (abuse detection)
- Alert if aggregate daily cost exceeds 2x the 7-day rolling average
- If approaching provider rate limits, queue requests with a "Musashi is typing..." indicator rather than failing

---

## 8. MVP Scope & Phasing

### 8.1 MVP (Phase 1) - Weeks 1-6
**Goal**: Validate core hypothesis (will users log consistently and find AI feedback valuable?)

**Included**:
- ✅ Text-based chat interface
- ✅ Quick-select buttons for techniques/positions
- ✅ Post-training logging (duration, energy, submissions, mood)
- ✅ Basic AI feedback (encouragement + tip + video link)
- ✅ Simple dashboard (submission stats, training calendar, energy trends)
- ✅ Weekly summaries (delivered in chat)
- ✅ Supabase Auth + Stripe payments
- ✅ Skill Tree data structure (backend only)

**Excluded** (deferred to Phase 1.5 or later):
- ❌ Voice input (Whisper)
- ❌ RAG / semantic memory
- ❌ Email/push notifications
- ❌ Skill Tree visualization
- ❌ Gamification/badges
- ❌ MCP YouTube integration
- ❌ Wearables integration

### 8.2 Phase 1.5 - Weeks 7-10
- Voice input (Whisper API)
- Email notifications (weekly digest, training reminders)
- "Tweet for free week" feature
- Basic RAG (pgvector + semantic search)

### 8.3 Phase 2 - Weeks 11-16
- Interactive Skill Tree visualization
- Proficiency assessment (quizzes + success rate analysis)
- Badge system
- MCP YouTube integration
- Advanced analytics (position heatmaps, submission chains)

### 8.4 Phase 3 - Month 5+
- Community features (in-app chat, discussion threads)
- Wearable integrations (Whoop, Garmin)
- Affiliate marketing automation
- White-label coach platform

---

## 9. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Users don't log consistently** | High (no value if no data) | Medium | Make logging <60s, show value immediately (charts), notifications |
| **AI gives bad advice** | High (trust loss, potential injury) | Low | Strict content whitelist, system prompt constraints, human review of edge cases |
| **Skill Tree too subjective** | Medium (user confusion) | High | Start simple (5/20/50 taxonomy), allow "Other," crowdsource improvements post-launch |
| **LLM costs spiral** | Medium (margin compression) | Low | Rate limiting, use GPT-4o-mini (cheap), monitor per-user costs |
| **Competition launches similar product** | Medium (market share loss) | Medium | Ship fast (6 weeks), build community moat, focus on mental game (harder to copy) |
| **Users abuse free trial** | Low (manageable cost) | Medium | 20 message/week limit, require email (no burner accounts via Supabase Auth) |

---

## 10. Success Criteria & Launch Readiness

### 10.1 MVP Launch Checklist
- [ ] All core features functional (onboarding, logging, dashboard, weekly summaries)
- [ ] 20 beta testers complete 7+ days of usage
- [ ] Trial → Paid conversion >15% in beta cohort
- [ ] No critical bugs (P0: login, payment, data loss)
- [ ] Performance benchmarks met (3s load, <2s dashboard)
- [ ] SSL active, database backups automated
- [ ] Privacy policy + Terms of Service published
- [ ] Landing page live with signup CTA
- [ ] PostHog + Sentry configured

### 10.2 Post-Launch Monitoring (First 30 Days)
- **Weekly**: Review retention cohorts (7-day, 14-day, 30-day)
- **Weekly**: Check conversion rate (trial → paid)
- **Daily**: Monitor error rate (Sentry alerts)
- **Daily**: Check AI cost per user (alert if >$0.50/user/month)
- **Weekly**: User interviews (2-3 power users)

### 10.3 Pivot Triggers
If after 30 days:
- **Retention <30%** → Problem with onboarding or value prop (run user interviews, simplify flow)
- **Conversion <10%** → Pricing too high or free tier too generous (test $4.99/month, shorten trial)
- **Avg logs <1.5/week** → Logging too hard (add voice ASAP, simplify buttons)

---

## 11. Open Questions (To Be Resolved)

### 11.1 Product Questions
- [ ] **Onboarding length**: 5 questions or 10? (User to decide after testing)
- [ ] **Weekly summary timing**: Sunday 8pm or Monday 7am?
- [ ] **Free tier access**: Can view old data but not log, or hard paywall?
- [ ] **Belt progression tracking**: Should app suggest "you're ready for blue belt"? (Phase 2?)

### 11.2 Technical Questions
- [ ] **Domain name**: TBD (needed for SSL, email sending)
- [ ] **Color scheme**: Dark mode default? Light mode option?
- [ ] **Mobile app**: React Native in Phase 3, or PWA-only forever?
- [ ] **Backup frequency**: Daily at 2am sufficient, or real-time replication?

### 11.3 Marketing Questions
- [ ] **Launch channels**: r/bjj, Instagram, YouTube ads?
- [ ] **Influencer partnerships**: Which BJJ influencers to approach?
- [ ] **Content marketing**: Start blog before launch or after?

---

## 12. Landing Page Spec

### 12.1 Purpose & Goals
- **Primary goal**: Convert visitor → free trial signup
- **Secondary goal**: Communicate what MatMentor is in under 10 seconds
- **Target conversion rate**: >5% visitor → signup (industry avg for niche SaaS: 3-5%)
- **Design**: Mobile-first (most BJJ practitioners will arrive via phone from Reddit/Instagram/DM)

### 12.2 Page Structure

#### Section 1: Hero (Above the Fold)
The hero must answer three questions in under 5 seconds: *What is this? Who is it for? What do I do next?*

**Headline** (outcome-first, not feature-first):
> "Train smarter. Know your game. Stop guessing."

**Subheadline** (one sentence — who it's for + what it does):
> "MatMentor is an AI coach that tracks your BJJ, spots your patterns, and tells you exactly what to work on next."

**CTA Button**:
> "Start Free Trial" (high-contrast, full-width on mobile)

**Supporting element**: A single screenshot or short looping video (~5s) showing the chat interface — Musashi asking "Did you train today?" with quick-select buttons visible. This immediately communicates "it's a chat app, not a spreadsheet."

**No navigation links above the fold.** Keep focus on the CTA. Minimal nav (logo + "Log In" link only) in a slim top bar.

---

#### Section 2: Problem (Emotional Hook)
Speak directly to the frustration. Use second person. Keep it to 3 short bullets — the reader should feel *seen*.

**Section heading**:
> "Sound familiar?"

**Three pain points** (each 1 sentence max):
> - "You train 3x a week but can't tell if you're actually improving."
> - "You get tapped by the same stuff and don't know how to fix it."
> - "You have questions after class but don't want to look clueless asking them."

**Transition line**:
> "You don't need another training journal. You need a coach who's always available."

---

#### Section 3: Solution (Product Intro)
Introduce Musashi. Make it personal — this isn't a feature list, it's meeting someone.

**Section heading**:
> "Meet Musashi — your AI BJJ coach"

**Short description** (2-3 sentences):
> "Musashi blends the precision of Danaher, the philosophy of Rickson, and the systematic approach of Saulo. After every session, he'll ask what happened, spot patterns in your game, and tell you exactly what to drill next — with video links from world-class instructors."

**Visual**: Chat conversation mockup showing a realistic post-training exchange. Musashi gives feedback, links a Danaher video, and asks about energy level. Quick-select buttons visible.

---

#### Section 4: How It Works (3-Step Flow)
Reduce perceived effort. Show that logging is fast and the payoff is immediate.

**Section heading**:
> "Log a session in 60 seconds. Get smarter every week."

**Step 1**: "Train at your gym"
> Icon: gi/mat illustration. Brief: "Do your thing on the mats."

**Step 2**: "Chat with Musashi"
> Icon: chat bubble. Brief: "Tap a few buttons — what you drilled, who you rolled with, how you felt. Done before you're out of the parking lot."

**Step 3**: "See your game evolve"
> Icon: chart/tree. Brief: "Watch your strengths, weaknesses, and streaks emerge. Get weekly AI summaries and targeted drill recommendations."

---

#### Section 5: Feature Highlights (3-4 Cards)
Not an exhaustive list. Pick the 3-4 things that make someone think "I want that."

**Card 1: "Chat, don't type"**
> "Quick-select buttons mean logging takes 60 seconds — not 10 minutes of journaling."

**Card 2: "Know your A-game (and your holes)"**
> "See which submissions you hit most, which positions eat you alive, and what to focus on."

**Card 3: "Weekly game plan"**
> "Every Sunday, Musashi reviews your week and gives you a specific drill to own before next class."

**Card 4: "Works offline"**
> "Log right after rolling — even in the locker room with no signal. It syncs when you're ready."

---

#### Section 6: Social Proof
Critical for trust. At launch, use beta tester quotes. Replace with real testimonials as they come in.

**Section heading**:
> "What practitioners are saying"

**Format**: 2-3 short quotes with name, belt rank, and gym (with permission). Example placeholder:
> "I've been training 2 years and this is the first time I can actually see what I'm good at."
> — *Alex M., Blue Belt, 10th Planet San Diego*

**If no testimonials at launch**: Replace with a "Join 50+ beta testers" counter or a Reddit/community endorsement.

---

#### Section 7: Pricing (Simple, One Tier)
Don't overcomplicate. One price, one CTA. Address the objection ("is it worth $10?") before they think it.

**Section heading**:
> "Less than a single private lesson. Every month."

**Pricing card**:
> **$9.99/month**
> - AI coaching after every session
> - Submission & position analytics
> - Weekly personalized game plans
> - Curated video recommendations
> - Works offline
>
> **Start with 7 days free. Cancel anytime.**
>
> [Start Free Trial]

**Objection buster** (small text below pricing):
> "One private lesson costs $80-150. Musashi is available after every single session for $10/month."

---

#### Section 8: FAQ (3-5 Questions)
Handle remaining objections. Keep answers to 1-2 sentences.

Suggested questions:
1. **"Do I need to type a lot?"** → "Nope. Most logging is tap-to-select. You can type if you want to, but it's designed for tired hands after rolling."
2. **"Will it work for my style? (gi/no-gi/competition/hobbyist)"** → "Yes. Musashi adapts to your belt level, goals, and training style during onboarding."
3. **"Is my training data private?"** → "Completely. Your data is encrypted, never shared, and you can export or delete it anytime."
4. **"What if I train somewhere with bad wifi?"** → "MatMentor works offline. Log your session in the locker room and it syncs automatically when you have signal."
5. **"Can I cancel anytime?"** → "Yes. No contracts, no cancellation fees. You keep access through the end of your billing period."

---

#### Section 9: Install on Your Phone (PWA Prompt)
Bridge the gap between web app and native app expectation. Make installation feel like downloading a real app, and set the expectation that a native app is coming.

**Section heading**:
> "Add it to your home screen — use it like an app"

**Subtext**:
> "MatMentor works as a full-screen app straight from your phone. No app store needed — install it in 10 seconds."

**Step-by-step** (detect iOS vs Android, show the relevant instructions):
> **iPhone**: Tap the Share button → "Add to Home Screen" → Done
> **Android**: Tap the menu (⋮) → "Install app" or "Add to Home Screen" → Done

**Future promise** (small text below):
> "A dedicated mobile app is on the way. Install now and you'll be first to know when it drops."

**Visual**: Short GIF or 3-step illustration showing the install flow on a phone.

---

#### Section 10: Final CTA (Closing)
Repeat the primary CTA. Add urgency or identity reinforcement.

**Heading**:
> "Your next session deserves a debrief."

**Subtext**:
> "Start your free trial — log your first session tonight."

**CTA Button**: "Start Free Trial"

---

#### Footer
- Links: Privacy Policy, Terms of Service, Contact
- "Built for the BJJ community" tagline
- Social links (Instagram, Reddit, X) if applicable

### 12.3 Copywriting Principles Applied
- **Outcome over feature**: Headlines describe what the user gets, not what the product does
- **Second person throughout**: "You" and "your" — never "our users" or "one can"
- **Specificity**: "60 seconds" not "fast"; "$9.99/month" not "affordable"; "Danaher video" not "instructional content"
- **One CTA action**: Every button says "Start Free Trial" — no competing actions
- **Objection handling inline**: Price justified before they do the math; privacy addressed before they worry; offline mentioned before they doubt
- **Progressive disclosure**: Problem → solution → proof → price → action. Each section earns the right to the next scroll
- **Mobile-first copy length**: Every block is scannable in 3-5 seconds on a phone screen. No paragraphs longer than 2 sentences outside the FAQ

### 12.4 Assets Needed for Launch
- [ ] 2-3 chat interface screenshots (realistic Musashi conversation)
- [ ] 1 dashboard screenshot (submission stats, training calendar)
- [ ] Musashi avatar/illustration (used in chat + landing page)
- [ ] OG image for social sharing (1200x630, headline + screenshot + CTA)
- [ ] Favicon + PWA icons

---

## 13. Appendices

### 13.1 Glossary of BJJ Terms
- **Guard**: Position where one person is on their back, using legs to control opponent
- **Mount**: Top position where attacker sits on opponent's chest
- **Submission**: Technique that forces opponent to "tap out" (yield)
- **RPE**: Rate of Perceived Exertion (1-10 scale, how hard did you work?)
- **Gi**: Traditional BJJ uniform (vs No-Gi: without uniform)

### 13.2 References
- Saulo Ribeiro, "Jiu-Jitsu University" (progression philosophy)
- John Danaher, "Enter the System" (systematic approach)
- Rickson Gracie interviews (mental game, breathing, philosophy)
- IBJJF (International Brazilian Jiu-Jitsu Federation) rules and belt requirements

### 13.3 Related Documents
- [DECISIONS.md](./DECISIONS.md) - Architectural decisions log
- [ROADMAP.md](./ROADMAP.md) - Detailed task breakdown and timeline
- `/docs/mvp-homework/` - User templates for onboarding script, skill tree, etc.

---

**Document Owner**: Carlos Salas-Porras  
**Last Updated**: October 13, 2025  
**Next Review**: After MVP launch (Week 6)  
**Status**: Approved for Development ✅
