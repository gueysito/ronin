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
| **Database schema** | `prisma/schema.prisma` (when created) |
| **API routes** | `app/api/` (when created) |
| **React components** | `components/` (when created) |
| **AI logic** | `lib/ai/` (when created) |

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
# Create Next.js app with TypeScript
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false

# Install core dependencies
npm install @prisma/client prisma
npm install @clerk/nextjs
npm install stripe
npm install zod
npm install recharts
npm install openai

# Install shadcn/ui
npx shadcn-ui@latest init
```

### Step 2: Set Up Database
```bash
# Initialize Prisma
npx prisma init

# Edit prisma/schema.prisma (based on homework taxonomy)
# Then create initial migration
npx prisma migrate dev --name init

# Seed database with techniques, positions, video links
npx prisma db seed
```

### Step 3: Configure Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit .env with:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - OPENAI_API_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
```

### Step 4: Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🗃️ Database Schema Preview

Once homework is complete, we'll generate a schema like this:

```prisma
// prisma/schema.prisma

model User {
  id              String    @id @default(cuid())
  clerkId         String    @unique
  email           String    @unique
  belt            Belt
  experienceYears Float
  trainingGoal    Int       // Days per week
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  sessions        Session[]
  goals           Goal[]
}

model Session {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @default(now())
  duration    Int      // Minutes
  intensity   Int      // RPE 1-10
  energy      Int      // 1-5
  mood        String?
  notes       String?
  
  user        User     @relation(fields: [userId], references: [id])
  events      Event[]
}

model Event {
  id          String   @id @default(cuid())
  sessionId   String
  type        EventType // ATTEMPT, SUCCESS, AGAINST
  techniqueId String
  positionId  String?
  
  session     Session    @relation(fields: [sessionId], references: [id])
  technique   Technique  @relation(fields: [techniqueId], references: [id])
  position    Position?  @relation(fields: [positionId], references: [id])
}

model Technique {
  id      String @id @default(cuid())
  name    String @unique
  domain  Domain
  aliases String[] // ["RNC", "Mata Leão"]
  
  events       Event[]
  contentLinks ContentLink[]
}

model Position {
  id     String @id @default(cuid())
  name   String @unique
  domain Domain
  
  events Event[]
}

model ContentLink {
  id          String @id @default(cuid())
  techniqueId String
  title       String
  url         String
  instructor  String
  duration    Int?
  beltLevel   Belt?
  
  technique Technique @relation(fields: [techniqueId], references: [id])
}

enum Belt {
  WHITE
  BLUE
  PURPLE
  BROWN
  BLACK
}

enum Domain {
  GUARD
  PASSING
  TOP_CONTROL
  ESCAPES
  TAKEDOWNS
}

enum EventType {
  ATTEMPT
  SUCCESS
  AGAINST
}
```

---

## 🤖 AI Integration Pattern

### System Prompt Structure
```typescript
// lib/ai/prompt.ts

export const systemPrompt = `
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
...
`;
```

### Chat API Route
```typescript
// app/api/chat/route.ts

export async function POST(req: Request) {
  const { message, userId } = await req.json();
  
  // 1. Validate with Zod
  const schema = z.object({
    message: z.string().min(1).max(500),
    userId: z.string()
  });
  
  // 2. Get user context (last 3 sessions)
  const context = await getContext(userId);
  
  // 3. Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt(context) },
      { role: 'user', content: message }
    ],
    stream: true
  });
  
  // 4. Stream response back
  return new Response(response.body);
}
```

---

## 📊 Dashboard Data Queries

### Submission Stats
```typescript
// lib/db/stats.ts

export async function getSubmissionStats(userId: string, days: number = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return await prisma.event.groupBy({
    by: ['techniqueId'],
    where: {
      session: { userId },
      type: 'SUCCESS',
      session: { date: { gte: since } }
    },
    _count: true
  });
}
```

### Training Consistency
```typescript
export async function getTrainingStreak(userId: string) {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    select: { date: true }
  });
  
  // Calculate current streak
  let streak = 0;
  const today = new Date();
  
  for (const session of sessions) {
    const daysDiff = Math.floor((today - session.date) / (1000 * 60 * 60 * 24));
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
```typescript
// components/chat/message.tsx

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function Message({ role, content, timestamp }: MessageProps) {
  return (
    <div className={cn(
      "flex mb-4",
      role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {role === 'assistant' && <Avatar src="/musashi.png" />}
      
      <div className={cn(
        "max-w-[70%] px-4 py-2 rounded-lg",
        role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      )}>
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-50">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
      
      {role === 'user' && <Avatar src={user.avatar} />}
    </div>
  );
}
```

### Quick-Select Buttons
```typescript
// components/chat/quick-select.tsx

interface QuickSelectProps {
  options: string[];
  onSelect: (value: string) => void;
}

export function QuickSelect({ options, onSelect }: QuickSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(option => (
        <Button
          key={option}
          variant="outline"
          onClick={() => onSelect(option)}
          className="w-full"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
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
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npx prisma studio              # Open DB GUI
npx prisma migrate dev         # Create migration
npx prisma db seed             # Seed data
npx prisma generate            # Regenerate Prisma Client

# Code Quality
npm run lint                   # ESLint
npm run format                 # Prettier
npm run type-check             # TypeScript

# Deployment
git push origin main           # Auto-deploys via Coolify

# Monitoring
# PostHog: https://app.posthog.com
# Sentry: https://sentry.io
# Stripe: https://dashboard.stripe.com
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
| **Clerk Dashboard** | https://dashboard.clerk.com |

---

**Last Updated**: October 13, 2025  
**Maintained By**: Carlos (Product Owner + Developer)
