# MatMentor - Architectural Decisions Log

**Project**: MatMentor (BJJ AI Coaching App)  
**Last Updated**: October 13, 2025  
**Status**: Pre-Development / Scaffolding Phase

---

## 🎯 Core Product Decisions

### Vision & Positioning
- **Problem Solved**: Unstructured BJJ progression + psychological barriers (fear of "stupid questions", mental blocks, lack of feedback loop)
- **Unique Value Prop**: AI coach that addresses BOTH technical AND mental game aspects
- **Target Market**: White to Purple belt practitioners training 2-4x/week
- **Core Differentiator**: Skill Tree visualization + psychological coaching (not just a tracker)

### Pricing & Monetization
- **Model**: Freemium subscription
- **Free Trial**: 1 week full access (email signup only)
- **Viral Hook**: Tweet about app → get 1 extra free week
- **Paid Tier**: $9.99/month or 3-month discounted bundle
- **Unit Economics**: 
  - AI cost: ~$0.30/user/month
  - Net profit: ~$8.60/user/month (86% margin)
  - Breakeven: 3 paying users

### Scope Philosophy
- **MVP Timeline**: 6-8 weeks (solo developer with AI assistance)
- **North Star Principle**: Ship functional over perfect
- **Feature Gating**: Validate core hypothesis (consistent logging) before adding advanced features

---

## 🏗️ Technical Architecture Decisions

### Tech Stack (Final) — Revised March 2026

| Category | Technology | Rationale | Alternatives Rejected |
|----------|-----------|-----------|---------------------|
| **Framework** | SvelteKit | Less boilerplate, smaller bundles (mobile-first), built-in SSR/routing/API routes, excellent DX for solo dev | Next.js 15 (heavier, React ecosystem overhead), Remix (smaller ecosystem) |
| **Language** | TypeScript (strict mode) | Type safety across full stack | JavaScript (too risky for data integrity) |
| **UI Library** | Svelte 5 (runes) | Compiler-based reactivity, no virtual DOM, built-in transitions for chat UX | React 19 (more boilerplate, larger bundles) |
| **API Layer** | SvelteKit server routes (+server.ts) | Co-located with pages, simple and flexible | tRPC (overkill for MVP), separate API server (unnecessary complexity) |
| **Database** | Supabase (PostgreSQL) | Postgres + Auth + pgvector + Realtime + Edge Functions in one platform. Complex relational queries for Skill Tree, analytics aggregations | Raw Postgres (more infra to manage), Convex (document-oriented, poor for relational analytics/aggregations) |
| **ORM** | Drizzle | Lightweight, fast, no binary engine, excellent edge/serverless compat, type-safe SQL | Prisma (heavier, binary engine, slower cold starts) |
| **Validation** | Zod | Runtime type safety, works with Drizzle, validates LLM outputs | Yup (less TS integration) |
| **Auth** | Supabase Auth | Bundled with DB platform, first-class SvelteKit support, eliminates separate auth vendor | Clerk (no first-class SvelteKit SDK), Auth.js (more config) |
| **UI Components** | shadcn-svelte (bits-ui) | Accessible, customizable, Tailwind-native, Svelte-native port of shadcn | Skeleton UI (less customizable), Flowbite Svelte (heavier) |
| **Styling** | Tailwind CSS | Rapid prototyping, easy dark mode | Vanilla CSS (too slow), UnoCSS (less ecosystem) |
| **Charts** | Layer Cake | Svelte-native, composable, SSR-friendly | Chart.js (not Svelte-native), D3 (overkill for MVP) |
| **AI / Chat** | Vercel AI SDK (SvelteKit adapter) | Unified streaming, tool calling, provider switching (swap LLMs without rewriting) | Raw fetch + SSE (more boilerplate, no provider abstraction) |
| **LLM Provider** | Claude Haiku 4.5 or GPT-4.1-mini | Both cheaper and smarter than GPT-4o-mini. Haiku: $0.80/$4 per 1M tokens, 200K context. GPT-4.1-mini: $0.40/$1.60 per 1M tokens | GPT-4o-mini (dated, worse cost/performance), full Opus/Sonnet (overkill for coaching chat) |
| **Voice** | Groq Whisper (Phase 1.5) | Same Whisper model, 10x faster inference, cheaper | OpenAI Whisper (slower, more expensive), Web Speech API (poor accuracy for BJJ terms) |

### Infrastructure Decisions — Revised March 2026

| Component | Solution | Rationale |
|-----------|----------|-----------|
| **Database + Auth** | Supabase (hosted) | Postgres, auth, pgvector, edge functions — one platform, generous free tier |
| **Hosting (MVP)** | Vercel | SvelteKit has first-class Vercel adapter, edge rendering, zero-config deploys |
| **Hosting (Alt)** | VPS + Coolify | Fallback if Vercel costs grow; full control, Docker deploys |
| **DB Backups** | Supabase daily backups (Pro plan) + manual pg_dump to S3/Backblaze B2 | Redundant backup strategy |
| **Monitoring** | PostHog (analytics) + Sentry (errors) | Both have generous free tiers |
| **CI/CD** | GitHub Actions + Vercel auto-deploy | Push to main → auto-deploy |
| **SSL** | Vercel (automatic) or Let's Encrypt (Coolify) | Free, auto-renewal |

---

## 🚀 Feature Phasing Decisions

### Phase 1: MVP (Weeks 1-6) ✅ APPROVED

**Core Loop**: Chat → Log → Feedback → Dashboard

**MUST HAVE:**
- ✅ Text-based chat interface with Musashi AI coach
- ✅ Quick-select buttons for common techniques/responses
- ✅ Post-training logging (duration, energy, submissions, mood)
- ✅ Basic profile setup (belt, experience, goals)
- ✅ Simple dashboard (submission counts, training frequency, energy trends)
- ✅ Weekly AI summary (delivered in chat)
- ✅ Session history retrieval (last 3-5 sessions as context)
- ✅ Clerk authentication
- ✅ PostgreSQL schema with sessions/events/techniques/users
- ✅ Zod validation on all inputs
- ✅ Basic Skill Tree data structure (backend only, no visualization)

**DEFERRED:**
- ❌ Voice input (Phase 1.5)
- ❌ RAG/Vector embeddings (Phase 1.5)
- ❌ Adaptive weekly plans (static suggestions for MVP)
- ❌ Gamification/badges (Phase 2)
- ❌ Email notifications (Phase 1.5)
- ❌ Content curation pipeline (hardcode 50 YouTube links)
- ❌ Skill Tree visualization (Phase 2)

### Phase 1.5: Polish & Voice (Weeks 7-10)
- Whisper API voice transcription
- Email/push notifications (training reminders, weekly digest)
- "Tweet for free week" feature
- pgvector + basic RAG (semantic memory)
- Skill Tree backend logic (proficiency calculation)

### Phase 2: Visualization (Weeks 11-16)
- Interactive Skill Tree UI (D3.js/Visx)
- Proficiency assessment (quizzes + performance data)
- Badge system with social sharing
- MCP YouTube integration (dynamic content search)
- Advanced analytics (position heatmaps, submission chains)

### Phase 3: Community & Scale (Month 5+)
- In-app community chat
- Wearable integrations (Whoop, Garmin)
- Affiliate marketing automation
- White-label coach platform

---

## 🎨 UX/UI Decisions

### Information Architecture

**Bottom Navigation (4 tabs):**
1. **🗨️ Chat** - Primary interface (Musashi conversation + logging)
2. **📊 Game** - Skill visualization (Skill Tree, submission stats, position analysis)
3. **📈 Progress** - Consistency tracking (calendar, streaks, cardio/energy trends)
4. **👤 Profile** - Settings, goals, subscription management

**Rationale**: Separates "What I'm good/bad at" (Game) from "Am I training enough?" (Progress)

### Interaction Design Principles
- **Logging Speed**: Must take <60 seconds per session
- **Chat Response Length**: Max 2-3 sentences unless user requests detail
- **Quick-Select First**: Buttons before free text input
- **Visual Feedback**: Charts/graphs inline in chat (not just text)
- **Progressive Disclosure**: Show simple stats first, details on tap

### Chat Flow Innovation
**Embedded Action Buttons** (not popups):
```
Musashi: "Did you train today?"
[Yes, rolled 🥋] [Yes, drilling] [No, rest day]

Musashi: "How was your cardio?"
[🔥 Great] [😊 Good] [😐 Average] [😓 Gassed]
```

**Rationale**: Natural conversation flow + one-tap responses = low friction

---

## 🧠 AI Agent Decisions

### Persona: "Musashi"
- **Blend of**: Danaher (precision) + Rickson (philosophy) + Saulo (systematics)
- **Tone**: Calm, specific, analytical, encouraging (never patronizing)
- **Adaptation**: Detail level scales with belt rank
- **Constraints**: No medical advice, no content outside whitelist

### AI Integration (Vercel AI SDK)
- **SDK**: Vercel AI SDK with SvelteKit adapter (`ai` + `@ai-sdk/anthropic` or `@ai-sdk/openai`)
- **Streaming**: Built-in SSE streaming via `useChat` (SvelteKit) for real-time chat responses
- **Provider Switching**: Can swap between Claude Haiku 4.5 and GPT-4.1-mini without code changes
- **Tool Calling**: AI SDK supports tool use — useful for structured logging (AI extracts technique/position from free text)

### Context Management (MVP)
- **Strategy**: Retrieve last 3-5 sessions as JSON from Supabase via Drizzle
- **Format**: `{ date, techniques, mood, energy, coach_feedback }`
- **Token Budget**: ~500 tokens context per message
- **Phase 1.5 Upgrade**: Supabase pgvector semantic search for relevant past insights

### Rate Limiting
| Tier | Limit | Cost Impact |
|------|-------|-------------|
| Free Trial | 20 messages/week | $0.02/week |
| Paid | 100 messages/week | $0.10/week |

**Rationale**: Feels generous for normal use, prevents abuse

---

## 📊 Data Model Decisions

### Skill Tree Taxonomy (MVP)
**Simplified Structure**:
- 5 Domains (Guard, Passing, Top Control, Escapes, Takedowns)
- 20 Positions (Closed Guard, Mount, Half Guard, etc.)
- 50 Techniques (Armbar, Triangle, RNC, etc.)
- Allow "Other" with free text for edge cases

**Expansion Path**: Crowdsource improvements post-launch, multi-node mappings in Phase 2

### Content Strategy
**MVP**: Hardcoded seed data
- 50 curated YouTube links → techniques
- Markdown files for mindset/philosophy content
- Whitelist: Danaher, Lachlan Giles, Bernardo Faria, Gordon Ryan

**Phase 2**: MCP-powered dynamic search
- Agent searches YouTube via MCP
- Filters by approved channel whitelist
- Returns top 3 results per technique

**Affiliate Links**:
- BJJ Fanatics (10-15% commission)
- Disclose affiliate status in agent responses

---

## 🔒 Security & Privacy Decisions

### Data Protection
- All user data encrypted in transit (TLS) and at rest (Postgres encryption)
- Session data (mood, energy, mental state) treated as sensitive
- GDPR/CCPA compliance: data export + account deletion features

### Safety Rails
- **Medical Disclaimer**: "I'm a training assistant, not a doctor. For injuries, see a professional."
- **Mental Health Boundaries**: If serious issues detected, refer to therapist
- **Content Moderation**: Agent cannot recommend unvetted sources

---

## 💰 Cost Projections & Monitoring

### Per-User Monthly Costs
```
AI (GPT-4o-mini): $0.30
Whisper (12 sessions × 3 min): $0.22 (Phase 1.5)
Hosting (amortized): $0.50
Payment processing: $0.59
─────────────────────────────
Total: $1.61/user/month
Net profit: $8.38 (84% margin)
```

### Scaling Checkpoints
- **100 users**: $860/month profit → validate retention
- **500 users**: $4,300/month → consider Vercel migration
- **1,000 users**: $8,600/month → hire part-time support

### Monitoring KPIs
| Metric | Target | Tool |
|--------|--------|------|
| 7-day retention | >50% | PostHog |
| Trial conversion | >20% | Stripe webhooks |
| Avg logs/user/week | >2.5 | Custom SQL |
| Monthly churn | <8% | Stripe metrics |

---

## 🛠️ Development Workflow Decisions

### File Organization
```
/src/routes          # SvelteKit pages + server routes
/src/lib             # Utilities, AI logic, normalizers, components
/src/lib/components  # Svelte components (shadcn-svelte)
/src/lib/server      # Server-only code (db, ai, auth)
/drizzle             # Schema + migrations
/docs                # Product docs + homework templates
/docs/mvp-homework   # User's assignments
/static              # Static assets
```

### Code Quality Standards
- **TypeScript**: Strict mode, no `any` types
- **Zod**: Validate all external inputs (user, API, LLM)
- **Prisma**: All DB queries typed
- **ESLint**: Standard Next.js config
- **Prettier**: Auto-format on save

### Git Strategy
- **Main branch**: Production-ready code
- **Feature branches**: `feature/chat-ui`, `feature/dashboard`
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`)
- **Deployment**: Push to main → auto-deploy via Coolify

---

## 📚 Documentation Philosophy

### Living Documents
- **DECISIONS.md**: This file (updated with each major choice)
- **ROADMAP.md**: Past/present/future tasks with checkboxes
- **PRD.md**: Product requirements (updated as scope evolves)
- **/docs/mvp-homework**: Templates for user to complete
- **README.md**: Setup instructions, deployment guide

### Update Cadence
- **Daily**: ROADMAP.md (check off completed tasks)
- **Weekly**: DECISIONS.md (new architecture choices)
- **Per Phase**: PRD.md (scope adjustments)

---

## ❓ Open Questions & Future Decisions

### To Be Resolved
- [ ] **Domain name**: TBD (needed for SSL setup)
- [ ] **Color scheme**: Dark mode vs light? Calm/zen vs intense/competitive?
- [ ] **Onboarding length**: 5 questions vs 10? (User to decide)
- [ ] **Weekly summary timing**: Sunday night vs Monday morning?
- [ ] **Free tier restrictions**: Can view old data but not log new, or hard cutoff?

### Deferred to Phase 2+
- Mobile app (React Native vs PWA-only)
- Internationalization (Spanish for Brazilian users?)
- Coach white-label platform architecture
- Video analysis (computer vision for technique recognition)

---

## 🔄 Decision Revision Process

When reconsidering a decision:
1. Document the **trigger** (user feedback, technical blocker, cost issue)
2. List **alternatives** with pros/cons
3. Run a **small test** if possible (spike, user interview)
4. Update this doc with **new decision + rationale**
5. Mark old decision as `~~DEPRECATED~~`

---

**Last Review**: October 13, 2025  
**Next Review**: After MVP launch (Week 6)  
**Decision Authority**: Carlos (Product Owner + Solo Dev)
