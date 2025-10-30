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

#### R1.1: Authentication (via Clerk)
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
- All onboarding data stored in `users` table (Prisma)
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

#### R4.3: User Controls
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

#### R7.4: Access Control
- Middleware checks `user.subscriptionStatus` before allowing:
  - AI chat (free trial: 20 messages/week; paid: 100 messages/week)
  - New session logging (free tier: blocked; trial/paid: allowed)
- Clear messaging when limits hit: "Upgrade to continue logging"

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

### 7.1 Tech Stack Summary
See [DECISIONS.md](./DECISIONS.md) for full rationale.

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Backend | Next.js API Routes, TypeScript |
| Database | PostgreSQL 15+ (with pgvector for Phase 1.5) |
| ORM | Prisma |
| Validation | Zod |
| Auth | Clerk |
| Payments | Stripe |
| AI | OpenAI (GPT-4o-mini, Whisper) |
| Charts | Recharts |
| Hosting | VPS + Coolify (MVP), Vercel (at scale) |
| Monitoring | PostHog (analytics), Sentry (errors) |

### 7.2 Data Model Overview

**Core Tables**:
- `users`: Profile, belt, goals, subscription status
- `sessions`: Training logs (date, duration, intensity, energy, mood)
- `events`: Specific techniques hit/received during sessions (links to techniques + positions)
- `techniques`: Canonical list of BJJ techniques (armbar, triangle, etc.)
- `positions`: Canonical list of BJJ positions (guard, mount, etc.)
- `goals`: User goals (short/medium/long term)
- `content_links`: Curated video links (technique_id → YouTube URL)
- `memories` (Phase 1.5): Vector embeddings for semantic search (pgvector)

**Relationships**:
- `sessions` → `users` (many-to-one)
- `events` → `sessions` (many-to-one)
- `events` → `techniques` (many-to-one)
- `events` → `positions` (many-to-one)
- `content_links` → `techniques` (many-to-one)

See `/prisma/schema.prisma` for full schema.

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
- Store in `memories` table (pgvector)
- Semantic search: retrieve top 3 relevant memories
- Inject into prompt alongside recent sessions

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
- ✅ Clerk auth + Stripe payments
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
| **Users abuse free trial** | Low (manageable cost) | Medium | 20 message/week limit, require email (no burner accounts via Clerk) |

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

## 12. Appendices

### 12.1 Glossary of BJJ Terms
- **Guard**: Position where one person is on their back, using legs to control opponent
- **Mount**: Top position where attacker sits on opponent's chest
- **Submission**: Technique that forces opponent to "tap out" (yield)
- **RPE**: Rate of Perceived Exertion (1-10 scale, how hard did you work?)
- **Gi**: Traditional BJJ uniform (vs No-Gi: without uniform)

### 12.2 References
- Saulo Ribeiro, "Jiu-Jitsu University" (progression philosophy)
- John Danaher, "Enter the System" (systematic approach)
- Rickson Gracie interviews (mental game, breathing, philosophy)
- IBJJF (International Brazilian Jiu-Jitsu Federation) rules and belt requirements

### 12.3 Related Documents
- [DECISIONS.md](./DECISIONS.md) - Architectural decisions log
- [ROADMAP.md](./ROADMAP.md) - Detailed task breakdown and timeline
- `/docs/mvp-homework/` - User templates for onboarding script, skill tree, etc.

---

**Document Owner**: Carlos Salas-Porras  
**Last Updated**: October 13, 2025  
**Next Review**: After MVP launch (Week 6)  
**Status**: Approved for Development ✅
