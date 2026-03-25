# Quick Reference Guide

**MatMentor Development Cheat Sheet**

Last Updated: October 13, 2025

---

## 📁 File Organization

### Where to Find Things

| What You Need | Location |
|---------------|----------|
| **Product decisions** | `DECISIONS.md` |
| **Task tracking** | `ROADMAP.md` |
| **Requirements** | `PRD.md` |
| **Setup instructions** | `README.md` |
| **User homework** | `docs/mvp-homework/` |
| **Database schema** | `drizzle/schema.ts` (when created) |
| **API routes** | `src/routes/api/` (when created) |
| **Svelte components** | `src/lib/components/` (when created) |
| **AI logic** | `src/lib/server/ai/` (when created) |

---

## 🎯 Current Phase Status

**Phase**: Pre-Development (Documentation Complete)  
**Next Action**: User completes homework templates  
**Blocker**: None (templates ready for user)

---

## ✅ Homework Checklist for User

Before we can start coding, complete these 6 templates:

1. **`docs/mvp-homework/01-onboarding-script.md`**  
   ↳ Define the exact questions Musashi asks during signup

2. **`docs/mvp-homework/02-logging-flow.md`**  
   ↳ Map out the step-by-step UX for logging a training session

3. **`docs/mvp-homework/03-system-prompt.md`**  
   ↳ Write Musashi's personality, tone, and response patterns

4. **`docs/mvp-homework/04-skill-tree-taxonomy.md`**  
   ↳ List 5 domains, 20 positions, 50 techniques

5. **`docs/mvp-homework/05-video-links.md`**  
   ↳ Curate 50 YouTube instructional videos

6. **`docs/mvp-homework/06-wireframes.md`**  
   ↳ Sketch or describe key screens (Chat, Dashboard, Profile)

**Estimated Time**: 4-6 hours total  
**Can Be Done**: Over 2-3 days, no rush

---

## 🔄 Development Workflow (Once Homework is Done)

### Step 1: Initialize Project
```bash
# Create SvelteKit app with TypeScript
npx sv create . --template minimal --types ts

# Install core dependencies
npm install drizzle-orm postgres
npm install -D drizzle-kit
npm install @supabase/supabase-js @supabase/ssr
npm install stripe zod
npm install ai @ai-sdk/anthropic @ai-sdk/openai
npm install layercake

# Install shadcn-svelte
npx shadcn-svelte@latest init

# Install Tailwind CSS (if not included by sv create)
npx sv add tailwindcss
```

### Step 2: Set Up Database
```bash
# Create drizzle/schema.ts (based on homework taxonomy)
# Then push schema to Supabase
npx drizzle-kit push

# Seed database with techniques, positions, video links
npx tsx drizzle/seed.ts
```

### Step 3: Configure Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit .env with:
# - PUBLIC_SUPABASE_URL
# - PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - DATABASE_URL (Supabase Postgres connection string)
# - ANTHROPIC_API_KEY (or OPENAI_API_KEY)
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
```

### Step 4: Run Development Server
```bash
npm run dev
# Open http://localhost:5173
```

---

## 🗃️ Database Schema Preview

Once homework is complete, we'll generate a schema like this:

```typescript
// drizzle/schema.ts
import { pgTable, text, integer, real, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const beltEnum = pgEnum('belt', ['white', 'blue', 'purple', 'brown', 'black']);
export const domainEnum = pgEnum('domain', ['guard', 'passing', 'top_control', 'escapes', 'takedowns']);
export const eventTypeEnum = pgEnum('event_type', ['attempt', 'success', 'against']);

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase Auth UID
  email: text('email').notNull().unique(),
  belt: beltEnum('belt').notNull(),
  experienceYears: real('experience_years').notNull(),
  trainingGoal: integer('training_goal').notNull(), // Days per week
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  date: timestamp('date').defaultNow().notNull(),
  duration: integer('duration').notNull(), // Minutes
  intensity: integer('intensity').notNull(), // RPE 1-10
  energy: integer('energy').notNull(), // 1-5
  mood: text('mood'),
  notes: text('notes'),
});

export const events = pgTable('events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  type: eventTypeEnum('type').notNull(),
  techniqueId: text('technique_id').notNull().references(() => techniques.id),
  positionId: text('position_id').references(() => positions.id),
});

export const techniques = pgTable('techniques', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  domain: domainEnum('domain').notNull(),
  aliases: text('aliases').array(), // ["RNC", "Mata Leão"]
});

export const positions = pgTable('positions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  domain: domainEnum('domain').notNull(),
});

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text('conversation_id').notNull().references(() => conversations.id),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contentLinks = pgTable('content_links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  techniqueId: text('technique_id').notNull().references(() => techniques.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  instructor: text('instructor').notNull(),
  duration: integer('duration'),
  beltLevel: beltEnum('belt_level'),
});
```

---

## 🤖 AI Integration Pattern

### System Prompt Structure
```typescript
// src/lib/server/ai/prompt.ts

export function buildSystemPrompt(user: User, lastSessions: Session[]) {
  return `
You are Musashi, a wise BJJ coach.

# Identity
[From user's homework: 03-system-prompt.md]

# Tone
[From user's homework]

# Context
User: ${user.belt} belt, ${user.experienceYears} years
Goals: ${user.goals.join(', ')}

Recent Sessions:
${lastSessions.map(s => `- ${s.date}: ${s.techniques.join(', ')}`).join('\n')}

# Rules
1. Keep responses under 3 sentences
2. Reference user's history
3. Only recommend videos from approved whitelist
4. Never give medical advice
`;
}
```

### Chat API Route (SvelteKit + Vercel AI SDK)
```typescript
// src/routes/api/chat/+server.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { buildSystemPrompt } from '$lib/server/ai/prompt';

export async function POST({ request, locals }) {
  const { messages } = await request.json();
  const userId = locals.user.id;

  // Get user context (last 3 sessions)
  const context = await getContext(userId);

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: buildSystemPrompt(context.user, context.sessions),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Chat Component (SvelteKit)
```svelte
<!-- src/routes/(dashboard)/chat/+page.svelte -->
<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';

  const { messages, input, handleSubmit } = useChat({
    api: '/api/chat',
  });
</script>

{#each $messages as message}
  <div class={message.role === 'user' ? 'justify-end' : 'justify-start'}>
    {message.content}
  </div>
{/each}

<form on:submit={handleSubmit}>
  <input bind:value={$input} placeholder="Talk to Musashi..." />
</form>
```

---

## 📊 Dashboard Data Queries

### Submission Stats
```typescript
// src/lib/server/db/stats.ts
import { db } from '$lib/server/db';
import { events, sessions, techniques } from '$drizzle/schema';
import { eq, gte, and, count, sql } from 'drizzle-orm';

export async function getSubmissionStats(userId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return await db
    .select({
      techniqueId: events.techniqueId,
      techniqueName: techniques.name,
      count: count(),
    })
    .from(events)
    .innerJoin(sessions, eq(events.sessionId, sessions.id))
    .innerJoin(techniques, eq(events.techniqueId, techniques.id))
    .where(
      and(
        eq(sessions.userId, userId),
        eq(events.type, 'success'),
        gte(sessions.date, since)
      )
    )
    .groupBy(events.techniqueId, techniques.name);
}
```

### Training Consistency
```typescript
export async function getTrainingStreak(userId: string) {
  const result = await db
    .select({ date: sessions.date })
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(sql`${sessions.date} desc`);

  let streak = 0;
  const today = new Date();

  for (const session of result) {
    const daysDiff = Math.floor(
      (today.getTime() - session.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
```

---

## 🎨 UI Components Pattern

### Chat Message Component
```svelte
<!-- src/lib/components/chat/Message.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import Avatar from '$lib/components/ui/avatar/avatar.svelte';

  let { role, content, timestamp }: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  } = $props();
</script>

<div class={cn('flex mb-4', role === 'user' ? 'justify-end' : 'justify-start')}>
  {#if role === 'assistant'}
    <Avatar src="/musashi.png" />
  {/if}

  <div class={cn(
    'max-w-[70%] px-4 py-2 rounded-lg',
    role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
  )}>
    <p class="text-sm">{content}</p>
    <span class="text-xs opacity-50">
      {timestamp.toLocaleTimeString()}
    </span>
  </div>

  {#if role === 'user'}
    <Avatar src={user.avatar} />
  {/if}
</div>
```

### Quick-Select Buttons
```svelte
<!-- src/lib/components/chat/QuickSelect.svelte -->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';

  let { options, onSelect }: {
    options: string[];
    onSelect: (value: string) => void;
  } = $props();
</script>

<div class="grid grid-cols-2 gap-2">
  {#each options as option}
    <Button variant="outline" class="w-full" onclick={() => onSelect(option)}>
      {option}
    </Button>
  {/each}
</div>
```

---

## 🧪 Testing Checklist

### Manual Testing (MVP)
- [ ] User can sign up and complete onboarding
- [ ] User can log a training session in <60 seconds
- [ ] AI responds with personalized feedback
- [ ] Dashboard shows correct submission counts
- [ ] Training calendar displays logged sessions
- [ ] Weekly summary generates and displays in chat
- [ ] Payment flow works (test mode)

### Automated Testing (Phase 1.5)
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] All environment variables set in production
- [ ] Database migrations run
- [ ] Seed data loaded (techniques, positions, videos)
- [ ] SSL certificate active
- [ ] Database backups configured (daily)
- [ ] Error monitoring (Sentry) active
- [ ] Analytics (PostHog) tracking
- [ ] Stripe webhook endpoint configured
- [ ] Rate limiting enabled (20 msgs/week free, 100 msgs/week paid)

### Launch Day
- [ ] Deploy to production (Coolify or Vercel)
- [ ] Test full user flow (signup → onboard → log → dashboard)
- [ ] Invite 20 beta testers
- [ ] Monitor error logs (Sentry)
- [ ] Monitor costs (OpenAI dashboard)

---

## 📈 Key Metrics to Track

### Daily
- [ ] New signups
- [ ] Active users (logged a session today)
- [ ] Error rate (Sentry)
- [ ] AI cost per user (OpenAI dashboard)

### Weekly
- [ ] 7-day retention cohort
- [ ] Trial → Paid conversion rate
- [ ] Average sessions logged per user
- [ ] Top 3 most common techniques logged

### Monthly
- [ ] MRR (Monthly Recurring Revenue)
- [ ] Churn rate
- [ ] NPS (Net Promoter Score)
- [ ] Feature requests (from user feedback)

---

## 🐛 Common Issues & Solutions

### Issue: AI responses are too slow
**Solution**: 
- Use streaming (SSE) to show partial responses
- Switch to GPT-4o-mini (faster, cheaper)
- Add loading state with "Musashi is thinking..."

### Issue: Database queries are slow
**Solution**:
- Add indexes on frequently queried columns (userId, date)
- Use connection pooling (pgBouncer)
- Cache dashboard stats (Redis in Phase 2)

### Issue: Users aren't logging consistently
**Solution**:
- Add push notifications (Phase 1.5)
- Gamify with streaks and badges (Phase 2)
- Reduce logging friction (add voice input)

---

## 📞 Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server (localhost:5173)
npm run build                  # Build for production
npm run preview                # Preview production build locally

# Database
npx drizzle-kit studio         # Open Drizzle Studio (DB GUI)
npx drizzle-kit push           # Push schema changes to database
npx drizzle-kit generate       # Generate migration files
npx tsx drizzle/seed.ts        # Seed data

# Code Quality
npm run lint                   # ESLint
npm run format                 # Prettier
npm run check                  # SvelteKit type checking (svelte-check)

# Deployment
git push origin main           # Auto-deploys via Vercel

# Monitoring
# PostHog: https://app.posthog.com
# Sentry: https://sentry.io
# Stripe: https://dashboard.stripe.com
# Supabase: https://supabase.com/dashboard
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Project Repo** | [TBD] |
| **Staging App** | [TBD after deploy] |
| **Production App** | [TBD after launch] |
| **PostHog Analytics** | https://app.posthog.com |
| **Sentry Errors** | https://sentry.io |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **OpenAI Usage** | https://platform.openai.com/usage |
| **Supabase Dashboard** | https://supabase.com/dashboard |

---

**Last Updated**: March 24, 2026
**Maintained By**: Carlos (Product Owner + Developer)
