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

### Tech Stack (Final)

| Category | Technology | Rationale | Alternatives Rejected |
|----------|-----------|-----------|---------------------|
| **Framework** | Next.js 14+ (App Router) | Industry standard, great DX, built-in API routes | Remix (smaller ecosystem) |
| **Language** | TypeScript (strict mode) | Type safety across full stack | JavaScript (too risky for data integrity) |
| **API Layer** | Next.js API Routes | Simpler, more flexible, easier to debug | tRPC (locks into TS ecosystem, overkill for MVP) |
| **Database** | PostgreSQL 15+ | Complex relational queries for Skill Tree, pgvector support | MongoDB (poor for relational analytics) |
| **ORM** | Prisma | Best-in-class migrations, type generation | Drizzle (less mature), Raw SQL (too manual) |
| **Validation** | Zod | Runtime type safety, works with Prisma, validates LLM outputs | Yup (less TS integration) |
| **Auth** | Clerk | Easier setup than Auth.js, good free tier | Auth.js (more config), Supabase Auth (vendor lock-in) |
| **UI Framework** | shadcn/ui + Radix UI | Accessible, customizable, modern | MUI (bloated), Chakra (less momentum) |
| **Styling** | Tailwind CSS | Rapid prototyping, easy dark mode | Vanilla CSS (too slow), Styled Components (runtime cost) |
| **Charts** | Recharts | Simple API, good docs | Chart.js (less React-friendly), D3 (overkill for MVP) |
| **LLM Provider** | OpenAI (GPT-4o-mini) | Best cost/performance ratio ($0.15/$0.60 per 1M tokens) | Claude (more expensive), Gemini (less reliable) |
| **Voice** | Whisper API | Accurate for BJJ terminology ($0.006/min) | Web Speech API (poor accuracy for technical terms) |

### Infrastructure Decisions

| Component | Solution | Rationale |
|-----------|----------|-----------|