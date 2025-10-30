# MatMentor - Product Roadmap

**Project**: MatMentor (BJJ AI Coaching App)  
**Last Updated**: October 13, 2025  
**Current Phase**: 🏗️ Pre-Development (Scaffolding)

---

## 📍 Current Status

**Active Phase**: Foundation & Planning  
**Next Milestone**: User Homework Completion  
**Blockers**: Waiting on user to complete homework templates  
**Completion**: 40% (Documentation & templates complete)

---

## 🗓️ Phase 0: Planning & Setup (Week 0) 🔄 IN PROGRESS

### Documentation ✅ COMPLETE
- [x] Create DECISIONS.md (architectural choices log)
- [x] Create ROADMAP.md (this file)
- [x] Create refined PRD.md
- [x] Create /docs/mvp-homework/ folder structure
- [x] Create README.md with setup instructions

### User Homework (Templates Created) ⏳ WAITING FOR USER
- [ ] Complete onboarding script (exact questions + button options) - Template: `docs/mvp-homework/01-onboarding-script.md`
- [ ] Complete logging flow (step-by-step UX) - Template: `docs/mvp-homework/02-logging-flow.md`
- [ ] Write system prompt v1 (Musashi personality + rules) - Template: `docs/mvp-homework/03-system-prompt.md`
- [ ] Define skill tree taxonomy (5 domains, 20 positions, 50 techniques) - Template: `docs/mvp-homework/04-skill-tree-taxonomy.md`
- [ ] Collect 50 seed video links (map to techniques) - Template: `docs/mvp-homework/05-video-links.md`
- [ ] Create wireframe sketches (Chat + Dashboard + Progress screens) - Template: `docs/mvp-homework/06-wireframes.md`

### Project Scaffolding ⏳ PENDING (Next After Homework)
- [ ] Initialize Next.js 14 with TypeScript
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up Prisma with PostgreSQL schema (requires taxonomy from homework)
- [ ] Configure Clerk authentication
- [ ] Set up project structure (/app, /components, /lib, /prisma)
- [ ] Create design system foundation (tokens, colors, typography)
- [ ] Set up environment variables template (.env.example)
- [ ] Initialize Git repository
- [x] Create README.md with setup instructions

---

## 🚀 Phase 1: MVP Development (Weeks 1-6) ⏳ PENDING

### Week 1-2: Foundation & Auth 📅 NOT STARTED
**Goal**: User can sign up and see basic chat UI

- [ ] Set up Next.js project with App Router
- [ ] Install and configure Tailwind CSS
- [ ] Install shadcn/ui components (Button, Input, Card, Dialog)
- [ ] Create design system (colors, spacing, typography)
- [ ] Set up Clerk authentication
  - [ ] Sign up flow
  - [ ] Sign in flow
  - [ ] Protected routes
- [ ] Create Prisma schema v1
  - [ ] User model
  - [ ] Session model
  - [ ] Event model
  - [ ] Technique model
  - [ ] Position model
  - [ ] Goal model
- [ ] Run initial migration
- [ ] Create basic chat UI shell
  - [ ] Message display
  - [ ] Input field
  - [ ] Send button
  - [ ] Loading states
- [ ] Deploy to Coolify (staging environment)

**Success Criteria**: User can sign up, log in, and see empty chat screen

---

### Week 3: Onboarding Flow 📅 NOT STARTED
**Goal**: New users complete guided onboarding via chat

- [ ] Implement onboarding state machine
- [ ] Create quick-select button components
  - [ ] Belt rank selector
  - [ ] Training frequency selector
  - [ ] Experience duration selector
  - [ ] Position/technique selectors
- [ ] Build onboarding question sequence
  - [ ] Welcome message
  - [ ] Belt rank question
  - [ ] Experience length question
  - [ ] Goals collection (free text)
  - [ ] Top weaknesses selection
  - [ ] Training frequency
  - [ ] Current physical/mental state
- [ ] Create Zod schemas for onboarding data
- [ ] Store onboarding data in Prisma
- [ ] Create profile review screen
- [ ] Add "Edit Profile" functionality
- [ ] Test onboarding flow (5 test users)

**Success Criteria**: New user completes onboarding in <3 minutes, data saved correctly

---

### Week 4: Core Logging & AI Integration 📅 NOT STARTED
**Goal**: Users can log training sessions and receive AI feedback

- [ ] Build post-training logging flow
  - [ ] "Did you train today?" prompt
  - [ ] Energy level quick-select (1-5 scale with emojis)
  - [ ] Submission entry interface
    - [ ] Quick-select grid (common techniques)
    - [ ] Position selector
    - [ ] "Add another" flow
  - [ ] Mood/confidence check-in
  - [ ] Optional notes (free text)
- [ ] Create data normalization functions
  - [ ] Map user input → technique_id
  - [ ] Map user input → position_id
  - [ ] Handle "Other" entries
  - [ ] Validate data with Zod
- [ ] Set up OpenAI API integration
  - [ ] Create API route `/api/chat`
  - [ ] Implement rate limiting (20 messages/week for free)
  - [ ] Add streaming support
  - [ ] Error handling + retries
- [ ] Build AI feedback generation
  - [ ] Retrieve last 3 sessions for context
  - [ ] Generate encouragement
  - [ ] Suggest next focus area
  - [ ] Return 1-2 hardcoded video links
- [ ] Store session data in Prisma
  - [ ] Create session record
  - [ ] Create event records (submissions)
  - [ ] Link to user profile
- [ ] Test logging flow (10 sample sessions)

**Success Criteria**: User can log a session in <60 seconds, receives personalized feedback

---

### Week 5: Dashboard & Analytics 📅 NOT STARTED
**Goal**: Users can visualize their progress and patterns

- [ ] Create Dashboard layout
  - [ ] Page shell with tabs/sections
  - [ ] Responsive grid system
  - [ ] Loading skeletons
- [ ] Build "Game" tab (skill analysis)
  - [ ] Submission stats card
    - [ ] Total count with trend indicator
    - [ ] Pie chart (by technique type)
    - [ ] "Top 3 weapons" list
  - [ ] Position struggle heatmap (simple version)
  - [ ] Strengths vs weaknesses comparison
- [ ] Build "Progress" tab (consistency tracking)
  - [ ] Training calendar (streak visualization)
  - [ ] Weekly volume chart (hours trained)
  - [ ] Energy trends (line graph)
  - [ ] Cardio performance over time
- [ ] Create data aggregation functions
  - [ ] Calculate submission counts by type
  - [ ] Compute training frequency
  - [ ] Analyze energy/mood patterns
  - [ ] Identify most common struggles
- [ ] Integrate Recharts
  - [ ] Install library
  - [ ] Create reusable chart components
  - [ ] Style charts to match design system
- [ ] Add date range filters (Last 7 days, 30 days, All time)
- [ ] Test with synthetic data (100 sample sessions)

**Success Criteria**: Dashboard loads in <2s, shows accurate insights from logged data

---

### Week 6: Weekly Summaries & Polish 📅 NOT STARTED
**Goal**: MVP is launch-ready with weekly AI summaries

- [ ] Build weekly summary logic
  - [ ] Cron job (runs every Sunday at 8pm)
  - [ ] Aggregate week's data (sessions, techniques, mood, energy)
  - [ ] Identify patterns (most common submission, biggest struggle)
  - [ ] Calculate consistency (days trained vs goal)
  - [ ] Generate AI summary via OpenAI
- [ ] Deliver summaries in chat
  - [ ] Create "Weekly Digest" message type
  - [ ] Include inline charts (image generation or embeds)
  - [ ] Add "Focus for next week" section
- [ ] Implement session history retrieval
  - [ ] "Show my last 5 sessions" command
  - [ ] Display past sessions in chat (formatted)
- [ ] Add Stripe integration
  - [ ] Create pricing table
  - [ ] Checkout flow
  - [ ] Webhook for subscription events
  - [ ] Update user role on payment
- [ ] Build settings screen
  - [ ] Edit goals
  - [ ] Update profile
  - [ ] Manage subscription
  - [ ] Data export (JSON)
  - [ ] Account deletion
- [ ] Polish pass
  - [ ] Add loading states everywhere
  - [ ] Error boundaries
  - [ ] Toast notifications
  - [ ] Empty states (no sessions yet)
  - [ ] Onboarding tooltips
- [ ] PWA configuration
  - [ ] Create manifest.json
  - [ ] Add service worker
  - [ ] Test install flow (iOS/Android)
- [ ] Testing & bug fixes
  - [ ] Full user journey test (onboarding → 3 logs → dashboard)
  - [ ] Mobile responsiveness check
  - [ ] Cross-browser testing (Safari, Chrome, Firefox)
  - [ ] Fix critical bugs
- [ ] Documentation
  - [ ] Update README with deployment steps
  - [ ] Create user guide (how to log sessions)
  - [ ] Write launch announcement

**Success Criteria**: App is stable, can onboard and retain users for 7+ days

---

### MVP Launch Checklist ✅ READY TO SHIP
- [ ] All core features functional (onboarding, logging, dashboard, summaries)
- [ ] Rate limiting active (prevent abuse)
- [ ] Stripe payments working (test with $0.01 charge)
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics tracking (PostHog events)
- [ ] SSL certificate active
- [ ] Database backups automated (daily)
- [ ] Beta tester cohort ready (20 BJJ practitioners)
- [ ] Landing page live (explain product, CTA to sign up)
- [ ] Privacy policy + Terms of Service published

**Launch Date**: TBD (Target: End of Week 6)

---

## 🔧 Phase 1.5: Voice & Refinements (Weeks 7-10) ⏳ PENDING

### Week 7: Voice Input (Whisper API) 📅 NOT STARTED
- [ ] Add voice recording UI component
  - [ ] Microphone button (press-and-hold)
  - [ ] Recording indicator (visual feedback)
  - [ ] Audio waveform visualization
- [ ] Implement browser audio recording
  - [ ] Use MediaRecorder API
  - [ ] Convert to proper format (mp3/wav)
  - [ ] Handle permissions (microphone access)
- [ ] Integrate Whisper API
  - [ ] Create `/api/transcribe` route
  - [ ] Send audio blob to OpenAI
  - [ ] Return transcribed text
  - [ ] Error handling (network issues, API limits)
- [ ] Auto-fill chat with transcription
- [ ] Add cost tracking for Whisper usage
- [ ] Test with BJJ terminology (armbar, kimura, d'arce, etc.)
- [ ] A/B test: voice vs text logging speed

**Success Criteria**: Voice logging is 30% faster than typing

---

### Week 8: Notifications & Email 📅 NOT STARTED
- [ ] Set up email service (Resend or SendGrid)
- [ ] Design email templates
  - [ ] Weekly summary digest
  - [ ] Training reminder (day before usual session)
  - [ ] Milestone celebration (10 sessions, 50 submissions, etc.)
- [ ] Implement email sending logic
  - [ ] Cron jobs for scheduled sends
  - [ ] User preferences (opt-in/out)
- [ ] Add web push notifications (PWA)
  - [ ] "Did you train today?" reminder
  - [ ] Weekly summary notification
- [ ] Create notification settings screen
  - [ ] Toggle email/push per notification type
  - [ ] Set reminder times

**Success Criteria**: 30% of users enable notifications, 10% click through from email

---

### Week 9: "Tweet for Free Week" Feature 📅 NOT STARTED
- [ ] Create social share card generator
  - [ ] Template with app branding
  - [ ] Include user's key stat (e.g., "10 sessions this month!")
  - [ ] Generate image via Canvas API
- [ ] Add Twitter/X integration
  - [ ] OAuth flow
  - [ ] Post tweet with pre-filled text + image
  - [ ] Verify tweet posted (check via API)
- [ ] Extend trial logic
  - [ ] Add 7 days to `trialEndsAt` in database
  - [ ] Show confirmation message
  - [ ] Limit to once per user
- [ ] Track conversion funnel (tweet → signups)

**Success Criteria**: 15% of trial users tweet, each tweet brings 2+ signups

---

### Week 10: Basic RAG (Semantic Memory) 📅 NOT STARTED
- [ ] Install pgvector extension in Postgres
- [ ] Update Prisma schema
  - [ ] Add `memories` table with vector column
  - [ ] Migration script
- [ ] Create embedding generation function
  - [ ] Use OpenAI `text-embedding-3-small` ($0.02/1M tokens)
  - [ ] Generate embeddings for session summaries
  - [ ] Store in `memories` table
- [ ] Implement semantic search
  - [ ] Query similar memories via cosine similarity
  - [ ] Return top 3 relevant memories
  - [ ] Inject into AI context
- [ ] Update AI prompt
  - [ ] Include retrieved memories
  - [ ] Instruct model to reference past insights
- [ ] Test memory recall
  - [ ] Log 20 sessions over 4 weeks
  - [ ] Ask "What are my patterns?" (should reference old data)

**Success Criteria**: AI references insights from 3+ weeks ago accurately

---

## 📊 Phase 2: Advanced Features (Weeks 11-16) ⏳ PENDING

### Skill Tree Visualization 📅 NOT STARTED
- [ ] Design Skill Tree UI (Figma/sketch)
- [ ] Choose visualization library (D3.js vs Visx)
- [ ] Build interactive tree component
  - [ ] Expandable/collapsible nodes
  - [ ] Color-coded by proficiency (belt colors)
  - [ ] Click for details (success rate, videos, drills)
- [ ] Implement proficiency calculation
  - [ ] Success rate (submissions hit / attempts)
  - [ ] Conceptual quizzes (AI-generated questions)
  - [ ] Blend quantitative + qualitative data
- [ ] Add "Recommend what to train" button
  - [ ] Identify weakest nodes
  - [ ] Suggest drill sequences
  - [ ] Link to relevant videos

**Success Criteria**: Users spend 5+ min exploring Skill Tree per week

---

### Proficiency Quizzes 📅 NOT STARTED
- [ ] Build quiz generation system
  - [ ] AI creates multiple-choice questions (e.g., "Best escape from side control?")
  - [ ] Store questions in database
  - [ ] Track user answers
- [ ] Create quiz UI
  - [ ] Card-based interface
  - [ ] Immediate feedback (correct/incorrect)
  - [ ] Explanation for wrong answers
- [ ] Update proficiency scores based on quiz results
- [ ] Deliver quizzes contextually
  - [ ] After logging technique 5+ times
  - [ ] Weekly "test your knowledge" prompt

**Success Criteria**: 40% of users complete at least one quiz per week

---

### Badge System & Gamification 📅 NOT STARTED
- [ ] Define badge types
  - [ ] Consistency (7-day streak, 30-day streak)
  - [ ] Volume (10 sessions, 50 sessions, 100 sessions)
  - [ ] Technique mastery (50 armbars, 100 triangles)
  - [ ] Milestone (first submission, first tournament)
- [ ] Create badge artwork (SVG icons)
- [ ] Build badge engine
  - [ ] Deterministic rules (SQL queries)
  - [ ] Check on each session log
  - [ ] Award badges and notify user
- [ ] Add badge display
  - [ ] Profile screen (showcase earned badges)
  - [ ] Achievement unlocked animation
- [ ] Social share cards for badges
  - [ ] Generate branded image
  - [ ] Pre-fill tweet text

**Success Criteria**: 50% of users earn at least one badge in first month

---

### MCP YouTube Integration 📅 NOT STARTED
- [ ] Set up MCP server for YouTube
  - [ ] YouTube Data API v3 credentials
  - [ ] Create MCP tool: `search_youtube`
- [ ] Implement channel whitelist filter
  - [ ] Hardcode approved channel IDs
  - [ ] Reject results from unapproved sources
- [ ] Update AI agent
  - [ ] Give access to MCP YouTube tool
  - [ ] Instruct to search when user asks for content
  - [ ] Return top 3 results
- [ ] Add "Flag bad content" button
  - [ ] User reports inappropriate video
  - [ ] Remove from recommendations
- [ ] Track click-through rate on recommended videos

**Success Criteria**: 80% of recommended videos rated "useful" by users

---

### Advanced Analytics 📅 NOT STARTED
- [ ] Position heatmap
  - [ ] Track submissions by position
  - [ ] Visualize as grid (guard, mount, side, back, etc.)
  - [ ] Highlight strengths (green) and weaknesses (red)
- [ ] Submission chains
  - [ ] Identify common sequences (e.g., armbar → triangle → back take)
  - [ ] Suggest building "chain game"
- [ ] Training partners analysis
  - [ ] Tag partners during logging (optional)
  - [ ] Show stats vs each partner (win rate, common struggles)
- [ ] Competition prep dashboard
  - [ ] Set competition date
  - [ ] Track weight cut progress
  - [ ] Ramp intensity in final weeks

**Success Criteria**: Users engage with at least 2 advanced analytics features/month

---

## 🌐 Phase 3: Community & Scale (Month 5+) ⏳ PENDING

### Community Features 📅 NOT STARTED
- [ ] In-app community chat
  - [ ] Belt-level channels (white belt chat, blue belt chat, etc.)
  - [ ] Moderation tools (report, ban)
  - [ ] Coach Q&A sessions (live or async)
- [ ] Technique discussion threads
  - [ ] Comment on techniques in Skill Tree
  - [ ] Share tips and experiences
- [ ] Leaderboards (optional, privacy-aware)
  - [ ] Training consistency (most sessions logged)
  - [ ] Submission variety (most different techniques)

**Success Criteria**: 30% of users engage with community features monthly

---

### Wearable Integrations 📅 NOT STARTED
- [ ] Whoop integration
  - [ ] OAuth flow
  - [ ] Pull HRV, recovery, sleep data
  - [ ] Display in Progress dashboard
  - [ ] AI incorporates recovery data into recommendations
- [ ] Garmin integration (similar flow)
- [ ] Auto-detect training sessions
  - [ ] Prompt user to log details after detected activity

**Success Criteria**: 10% of users connect a wearable, report better insights

---

### Affiliate Marketing Automation 📅 NOT STARTED
- [ ] BJJ Fanatics affiliate program
  - [ ] Automatic link injection (when recommending courses)
  - [ ] Track conversions via UTM parameters
  - [ ] Monthly payout reports
- [ ] Gear recommendations
  - [ ] Affiliate links for gis, rash guards, etc.
  - [ ] Personalized (e.g., "lightweight gi" for smaller practitioners)
- [ ] MatMentor-branded gear (future)
  - [ ] Partner with manufacturer
  - [ ] Offer in-app with discount for subscribers

**Success Criteria**: $500/month in affiliate revenue by Month 6

---

### White-Label Coach Platform 📅 NOT STARTED
- [ ] Multi-tenant architecture
  - [ ] Coaches can create their own branded instance
  - [ ] Custom domain support
  - [ ] Revenue sharing (coach gets 70%, platform 30%)
- [ ] Coach admin panel
  - [ ] View student progress
  - [ ] Send custom messages/assignments
  - [ ] Customize curriculum
- [ ] Student assignment features
  - [ ] Coach sets weekly drills
  - [ ] Student marks complete
  - [ ] Coach reviews video submissions (future)

**Success Criteria**: 10 coaches onboarded, 100 students under coach accounts

---

## 🧪 Testing & Quality (Ongoing)

### Automated Testing 🔄 ONGOING
- [ ] Set up Vitest for unit tests
  - [ ] Test data normalization functions
  - [ ] Test proficiency calculation logic
  - [ ] Test badge award rules
- [ ] Set up Playwright for E2E tests
  - [ ] Onboarding flow test
  - [ ] Logging flow test
  - [ ] Payment flow test
- [ ] CI/CD integration
  - [ ] Run tests on every PR
  - [ ] Block merge if tests fail

### Performance Monitoring 🔄 ONGOING
- [ ] Set up Lighthouse CI
  - [ ] Track performance scores
  - [ ] Alert if score drops below 90
- [ ] Database query optimization
  - [ ] Add indexes on frequently queried columns
  - [ ] Monitor slow queries (pg_stat_statements)
- [ ] LLM cost monitoring
  - [ ] Track token usage per user
  - [ ] Alert if cost exceeds $0.50/user/month

### User Testing 🔄 ONGOING
- [ ] Recruit 5 beta testers per phase
- [ ] Weekly feedback sessions (30 min each)
- [ ] Track feature requests in GitHub Issues
- [ ] Prioritize top 3 requests each sprint

---

## 📈 Growth & Marketing (Post-Launch)

### Content Marketing 📅 NOT STARTED
- [ ] Start BJJ + tech blog
  - [ ] "How to structure BJJ training" (SEO)
  - [ ] "Data-driven approach to guard retention"
  - [ ] Case studies (user transformations)
- [ ] YouTube channel
  - [ ] App tutorials
  - [ ] BJJ data analysis videos
  - [ ] Interviews with users

### Community Outreach 📅 NOT STARTED
- [ ] Reddit (r/bjj)
  - [ ] Share free value (training tips)
  - [ ] Mention app when relevant (not spammy)
- [ ] Instagram
  - [ ] Daily training insights
  - [ ] User-generated content (badge shares)
- [ ] Partnerships with BJJ influencers
  - [ ] Sponsor podcast ads
  - [ ] Affiliate program for influencers

### SEO & Paid Ads 📅 NOT STARTED
- [ ] Optimize landing page for keywords
  - [ ] "BJJ training tracker"
  - [ ] "BJJ AI coach"
  - [ ] "Jiu-jitsu progress app"
- [ ] Google Ads (small budget test)
  - [ ] Target "BJJ training" searches
  - [ ] $200/month budget
  - [ ] Track CAC (customer acquisition cost)
- [ ] Meta Ads (Facebook/Instagram)
  - [ ] Target BJJ gym check-ins
  - [ ] Lookalike audiences from existing users

---

## 🔍 Metrics & Success Tracking

### Weekly KPIs 📊
- [ ] New signups (target: 20/week post-launch)
- [ ] Trial → Paid conversion (target: >20%)
- [ ] 7-day retention (target: >50%)
- [ ] Average sessions logged per user (target: >2.5/week)
- [ ] AI message count (track costs)

### Monthly KPIs 📊
- [ ] MRR (Monthly Recurring Revenue)
- [ ] Churn rate (target: <8%)
- [ ] NPS (Net Promoter Score, target: >50)
- [ ] Support ticket volume (track time to resolution)

### Quarterly Reviews 📊
- [ ] Review roadmap priorities (kill/pivot features)
- [ ] User interviews (5-10 power users)
- [ ] Competitive analysis (new BJJ apps?)
- [ ] Update pricing based on LTV data

---

## 🚧 Parked Ideas (Good, but unclear value)

These are intentionally NOT on the roadmap yet:

- [ ] Video analysis (CV for technique recognition) - Too complex, unclear demand
- [ ] Live training timer - Low value vs effort
- [ ] Gym roster/check-ins - Requires gym partnerships
- [ ] Tournament bracket management - Niche use case
- [ ] Nutrition tracking - Crowded market, low differentiation
- [ ] Meditation/mindfulness integration - Outside core competency
- [ ] Desktop app (Electron) - PWA is sufficient

---

## 📝 Changelog & Updates

### October 13, 2025
- ✅ Created ROADMAP.md with full phase breakdown
- ✅ Defined MVP scope (Weeks 1-6)
- ✅ Planned Phase 1.5 (Voice, RAG, notifications)
- ✅ Outlined Phase 2 & 3 (Skill Tree, community, wearables)
- ✅ Created DECISIONS.md (architectural decisions log)
- ✅ Created PRD.md (refined product requirements)
- ✅ Created 6 homework templates in /docs/mvp-homework/:
  - 01-onboarding-script.md
  - 02-logging-flow.md
  - 03-system-prompt.md
  - 04-skill-tree-taxonomy.md
  - 05-video-links.md
  - 06-wireframes.md
- ✅ Created comprehensive README.md
- ⏳ Waiting for user to complete homework templates before continuing scaffold

### Future Updates
- Add completion dates as tasks are checked off
- Track blockers and mitigations
- Adjust timelines based on actual velocity

---

**Next Action**: Complete project scaffolding, then user completes homework templates  
**Review Cadence**: Update this file daily during active development  
**Accountability**: Solo dev (Carlos) owns all tasks until delegation
