# MatMentor - BJJ AI Coaching App

**Your intelligent Brazilian Jiu-Jitsu training companion**

MatMentor helps BJJ practitioners master both the physical and mental aspects of their game through AI-powered coaching, intelligent tracking, and personalized feedback—all in a judgment-free environment.

---

## 📋 Project Status

**Current Phase**: Pre-Development (Scaffolding)  
**Version**: 0.1.0 (MVP Planning)  
**Last Updated**: October 13, 2025

- ✅ Product vision defined
- ✅ Architecture decisions locked in
- ✅ Technical stack selected
- 🔄 User homework templates created (waiting for completion)
- ⏳ Project scaffolding in progress
- ⏳ MVP development pending

---

## 🎯 What is MatMentor?

MatMentor is not just another training tracker—it's your digital BJJ coach named **Musashi** who:

- 💬 **Chats with you** after training (no boring forms to fill out)
- 📊 **Tracks your progress** (submissions, cardio, positions, mental game)
- 🧠 **Provides personalized feedback** (technique tips, drill suggestions, video links)
- 🌳 **Visualizes your game** via an interactive Skill Tree (Phase 2)
- 💪 **Supports your mental game** (confidence, plateaus, competition anxiety)
- 🎥 **Recommends world-class instruction** (Danaher, Giles, Faria, and more)

### The Problem We Solve

BJJ practitioners struggle with:
1. **Unstructured progression** - No clear view of strengths/weaknesses
2. **Psychological barriers** - Fear of asking "stupid questions" in class
3. **Broken feedback loops** - Traditional journals lack intelligence

### Our Solution

An AI coach that makes logging feel like talking to a mentor, provides data-driven insights, and addresses both the physical AND mental aspects of training.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI (accessible by default)
- **Charts**: Recharts
- **Forms/Validation**: Zod

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: PostgreSQL 15+ (with pgvector for Phase 1.5)
- **ORM**: Prisma
- **Auth**: Clerk
- **Payments**: Stripe

### AI / LLM
- **Provider**: OpenAI
- **Models**: 
  - GPT-4o-mini (chat, ~$0.30/user/month)
  - Whisper (voice transcription, Phase 1.5)
- **Memory**: Simple session history (MVP) → pgvector RAG (Phase 1.5)

### Infrastructure
- **Hosting (MVP)**: VPS + Coolify (Docker-based deployments)
- **Hosting (Scale)**: Vercel (frontend) + VPS (database)
- **Monitoring**: PostHog (analytics) + Sentry (errors)
- **Backups**: Daily pg_dump → S3/Backblaze B2

---

## 📂 Project Structure

```
ronin-bjj-warp/
├── app/                    # Next.js App Router (pages, layouts)
│   ├── (auth)/            # Auth-related routes (sign-in, sign-up)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes (chat, stats, payments)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── chat/              # Chat-specific components
│   ├── dashboard/         # Dashboard widgets
│   └── shared/            # Reusable components
├── lib/                   # Utilities, helpers, business logic
│   ├── ai/                # LLM integration, prompts
│   ├── db/                # Database utilities
│   ├── normalizers/       # Input parsing (technique mapping)
│   └── utils/             # General utilities
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Prisma schema (source of truth)
│   ├── migrations/        # Migration history
│   └── seed.ts            # Seed data (techniques, positions, videos)
├── public/                # Static assets (images, icons)
├── docs/                  # Documentation
│   ├── mvp-homework/      # User templates (onboarding, system prompt, etc.)
│   └── architecture/      # Technical documentation
├── DECISIONS.md           # Architectural decisions log
├── ROADMAP.md             # Detailed task breakdown
├── PRD.md                 # Product requirements document
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 15+ (local or hosted)
- OpenAI API key
- Clerk account (for auth)
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ronin-bjj-warp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Set up database
npx prisma migrate dev

# Seed initial data (techniques, positions)
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📖 Documentation

### For Developers
- **[DECISIONS.md](./DECISIONS.md)** - All architectural and technical decisions
- **[ROADMAP.md](./ROADMAP.md)** - Detailed task breakdown and timeline
- **[PRD.md](./PRD.md)** - Complete product requirements

### For Product/Content Work
- **[docs/mvp-homework/](./docs/mvp-homework/)** - Templates to complete before full development:
  1. `01-onboarding-script.md` - Define onboarding questions
  2. `02-logging-flow.md` - Define daily logging UX
  3. `03-system-prompt.md` - Define Musashi's personality
  4. `04-skill-tree-taxonomy.md` - List domains/positions/techniques
  5. `05-video-links.md` - Curate 50 instructional videos
  6. `06-wireframes.md` - Sketch key screens

---

## 🎯 MVP Scope (Phase 1)

**Goal**: Validate core hypothesis - will users log consistently and find AI feedback valuable?

**Timeline**: 6-8 weeks (solo developer with AI assistance)

**Features**:
- ✅ Text-based chat interface (Musashi AI coach)
- ✅ Quick-select buttons for logging (minimize typing)
- ✅ Post-training session logging (techniques, energy, mood)
- ✅ Basic AI feedback (encouragement + tips + video links)
- ✅ Simple dashboard (submission stats, training calendar, trends)
- ✅ Weekly AI summaries (delivered in chat)
- ✅ Clerk authentication + Stripe payments
- ✅ Skill Tree data structure (backend only, visualization in Phase 2)

**NOT in MVP** (deferred to Phase 1.5+):
- ❌ Voice input (Whisper)
- ❌ RAG / semantic memory (pgvector)
- ❌ Email/push notifications
- ❌ Skill Tree visualization
- ❌ Gamification/badges
- ❌ MCP YouTube integration

---

## 💰 Pricing & Business Model

**Free Trial**: 1 week full access (email signup only)

**Paid Subscription**: $9.99/month (or 3-month bundle at discount)

**Viral Growth Hook**: Tweet about the app → get 1 extra free week

**Unit Economics**:
- AI cost: ~$0.30/user/month
- Hosting: ~$0.50/user/month (amortized)
- Payment processing: ~$0.59/user
- **Net profit**: ~$8.60/user/month (86% margin)

**Breakeven**: 3 paying subscribers (cover VPS hosting)

---

## 🧪 Development Workflow

### Branching Strategy
- `main` - Production-ready code (auto-deploys via Coolify)
- `feature/*` - Feature branches (PR to main)
- `fix/*` - Bug fix branches

### Commit Convention
```
feat: Add voice transcription button to chat
fix: Correct submission count calculation
docs: Update system prompt examples
```

### Testing (Phase 1.5+)
- Unit tests: Vitest
- E2E tests: Playwright
- Run on every PR (GitHub Actions)

---

## 📊 Key Metrics (KPIs)

| Metric | Target (6 months) | How We Measure |
|--------|-------------------|----------------|
| **Activation** | >70% complete onboarding + log 1 session | PostHog funnel |
| **Engagement** | >2.5 logs/week per active user | Custom SQL |
| **7-Day Retention** | >50% return after signup | PostHog cohorts |
| **Trial Conversion** | >20% free → paid | Stripe webhooks |
| **Monthly Churn** | <8% | Stripe metrics |
| **NPS** | >50 | In-app survey |

---

## 🛠️ Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma migrate dev   # Create and apply migration
npx prisma db seed       # Seed database with initial data
npx prisma generate      # Regenerate Prisma Client

# Code Quality
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run type-check       # TypeScript type checking

# Testing (Phase 1.5+)
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
```

---

## 🚧 Current Blockers

**Waiting on**:
- [ ] User to complete homework templates (`/docs/mvp-homework/`)
  - Onboarding script
  - Logging flow
  - System prompt
  - Skill tree taxonomy
  - Video links
  - Wireframes

**Once complete**, we can:
1. Generate Prisma schema with actual taxonomy data
2. Build chat components with exact Musashi responses
3. Create dashboard layouts matching wireframes
4. Seed database with curated video links

---

## 🤝 Contributing (Future)

Currently a solo project. Post-launch, contributions welcome for:
- BJJ taxonomy improvements (add techniques/positions)
- Video link curation (flag broken links, suggest better content)
- Bug reports and feature requests

---

## 📄 License

[To be determined]

---

## 🙏 Acknowledgments

**Inspiration from BJJ Masters**:
- John Danaher (systematic approach)
- Rickson Gracie (philosophy and mental game)
- Saulo Ribeiro (progression framework)

**Tech Stack Credits**:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)

---

## 📞 Contact

**Project Owner**: Carlos Salas-Porras  
**Status**: Pre-Launch (MVP in development)

---

**Last Updated**: October 13, 2025  
**Version**: 0.1.0-alpha
