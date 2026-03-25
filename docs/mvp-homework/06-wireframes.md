# Wireframes & Screen Descriptions -- COMPLETED

**Status**: COMPLETE
**Completed by**: Design specification (March 2026)
**Design system**: Tailwind CSS + shadcn-svelte. Dark mode default. Mobile-first.

---

## Navigation Structure

**Bottom tab bar** (4 tabs, always visible):
1. Chat (primary) -- Musashi conversation + logging
2. Game -- Skill analysis (submissions, positions, strengths/weaknesses)
3. Progress -- Consistency tracking (calendar, streaks, energy trends)
4. Profile -- Settings, goals, subscription

**Active tab**: Highlighted icon + label. Inactive: muted icon only.

---

## Screen 1: Chat (Primary Interface)

This is the app's home screen. 80% of user interaction happens here.

### Layout (top to bottom):
```
+------------------------------------------+
|  MatMentor              [Musashi avatar]  |  <- Slim header, no nav clutter
+------------------------------------------+
|                                           |
|  [Musashi message bubble - left aligned]  |
|  "Did you train today?"                   |
|                                           |
|        [User message bubble - right]      |
|        "Yes, I rolled"                    |
|                                           |
|  [Musashi message bubble]                 |
|  "How long was your session?"             |
|                                           |
|  +------+ +------+ +------+              |
|  |30 min| |45 min| |60 min|              |  <- Quick-select buttons
|  +------+ +------+ +------+              |
|  +------+ +------+ +---------+           |
|  |90 min| |2 hrs | |2.5+ hrs|           |
|  +------+ +------+ +---------+           |
|                                           |
+------------------------------------------+
|  [Text input field]        [Send button]  |  <- Always visible at bottom
+------------------------------------------+
|  Chat | Game | Progress | Profile         |  <- Bottom tab bar
+------------------------------------------+
```

### Key behaviors:
- Messages scroll up as conversation grows. Latest at bottom.
- Quick-select buttons appear inline in the chat, below Musashi's question.
- After user taps a button, it's replaced by a user message bubble with their selection.
- AI responses stream in token-by-token (typing indicator: "Musashi is thinking...")
- Weekly summary messages get a distinct style: slightly different background, "Weekly Summary" label above.
- Offline indicator banner appears above the chat when disconnected.

### Message types:
- **User message**: Right-aligned, primary color background, white text.
- **Musashi message**: Left-aligned, muted/card background, with small Musashi avatar.
- **Quick-select buttons**: Grid of outlined buttons below a Musashi message. Disappear after selection.
- **Video recommendation**: Embedded card with thumbnail, title, instructor, duration. Tapping opens YouTube.
- **Weekly summary**: Card-style message with distinct border/background. Includes inline stat highlights.

---

## Screen 2: Game Tab (Skill Analysis)

Answers: "What am I good at? Where are my holes?"

### Layout:
```
+------------------------------------------+
|  Your Game                 [Date filter]  |  <- "Last 7d / 30d / All time"
+------------------------------------------+
|                                           |
|  SUBMISSION STATS                         |
|  +--------------------------------------+|
|  | Total this period: 14  (+40%)        ||
|  |                                      ||
|  | [Pie chart: technique breakdown]     ||
|  | Armbar: 5 | Triangle: 4 | RNC: 3    ||
|  | Kimura: 2                            ||
|  +--------------------------------------+|
|                                           |
|  TOP WEAPONS          COMMON HOLES        |
|  +----------------+  +----------------+  |
|  | 1. Armbar      |  | 1. Half guard  |  |
|  | 2. Triangle    |  |    retention   |  |
|  | 3. Knee cut    |  | 2. Back escape |  |
|  |    pass        |  | 3. Takedowns   |  |
|  +----------------+  +----------------+  |
|                                           |
|  POSITION BREAKDOWN                       |
|  +--------------------------------------+|
|  | [Horizontal bar chart]               ||
|  | Guard (bottom): ████████ 45%         ||
|  | Side ctrl (top): ████ 20%            ||
|  | Mount (top): ███ 15%                 ||
|  | Standing: ██ 10%                     ||
|  | Back (atk): ██ 10%                   ||
|  +--------------------------------------+|
|                                           |
+------------------------------------------+
|  Chat | Game | Progress | Profile         |
+------------------------------------------+
```

### Key behaviors:
- Date filter toggles between 7 days, 30 days, all time.
- Pie chart is interactive: tap a slice to see technique details.
- "Top Weapons" and "Common Holes" are computed from event data.
- Empty state (no sessions yet): "Log your first session to see your game here. Tap Chat to get started."
- Tapping a technique name opens a detail view: stats over time, related videos, drill suggestions.

---

## Screen 3: Progress Tab (Consistency)

Answers: "Am I training enough? How's my body holding up?"

### Layout:
```
+------------------------------------------+
|  Your Progress             [Date filter]  |
+------------------------------------------+
|                                           |
|  THIS WEEK                                |
|  +--------------------------------------+|
|  | Sessions: 3 / 4 goal  [██████░░] 75%||
|  | Current streak: 12 days              ||
|  | Longest streak: 18 days              ||
|  +--------------------------------------+|
|                                           |
|  TRAINING CALENDAR                        |
|  +--------------------------------------+|
|  | [Month grid - GitHub contribution    ||
|  |  style. Green = trained, gray = rest,||
|  |  dark green = high intensity]        ||
|  |                                      ||
|  | M  T  W  T  F  S  S                 ||
|  | .  G  .  G  G  .  .    <- this week ||
|  | G  .  G  G  .  G  .    <- last week ||
|  +--------------------------------------+|
|                                           |
|  WEEKLY VOLUME (last 8 weeks)             |
|  +--------------------------------------+|
|  | [Bar chart: hours trained per week]  ||
|  | W1: ██ 3h                            ||
|  | W2: ████ 5h                          ||
|  | W3: ███ 4h                           ||
|  | ...                                  ||
|  +--------------------------------------+|
|                                           |
|  ENERGY & RECOVERY                        |
|  +--------------------------------------+|
|  | [Line chart: energy over last 30d]   ||
|  | [Line chart: mood over last 30d]     ||
|  | Avg energy: 3.2/5                    ||
|  | Low energy alert: "Energy has been   ||
|  | below average for 5 sessions.        ||
|  | Consider a rest week."              ||
|  +--------------------------------------+|
|                                           |
+------------------------------------------+
|  Chat | Game | Progress | Profile         |
+------------------------------------------+
```

### Key behaviors:
- Training calendar uses color intensity (like GitHub contributions) to show volume.
- Streak counter is prominent -- gamification through visibility, not badges (Phase 2).
- Energy trend alerts trigger when energy is below average for 3+ consecutive sessions.
- "Last updated: [timestamp]" shown when viewing cached offline data.

---

## Screen 4: Profile / Settings

### Layout:
```
+------------------------------------------+
|  Profile                                  |
+------------------------------------------+
|                                           |
|  [User avatar / initials]                |
|  Carlos S.                                |
|  Blue Belt | 2 years | 3-4 days/week    |
|  [Edit profile]                           |
|                                           |
|  GOALS                                    |
|  +--------------------------------------+|
|  | - Compete in tournament              ||
|  | - Improve guard retention            ||
|  | [Edit goals]                         ||
|  +--------------------------------------+|
|                                           |
|  SUBSCRIPTION                             |
|  +--------------------------------------+|
|  | Plan: Paid ($9.99/mo)               ||
|  | Messages this week: 34 / 100        ||
|  | [Manage subscription]                ||
|  +--------------------------------------+|
|                                           |
|  SETTINGS                                 |
|  +--------------------------------------+|
|  | Weekly summaries     [toggle ON]     ||
|  | Summary day          [Sunday]        ||
|  | Training type        [Gi & No-gi]    ||
|  | Dark mode            [toggle ON]     ||
|  +--------------------------------------+|
|                                           |
|  ACCOUNT                                  |
|  +--------------------------------------+|
|  | Export my data (JSON)                ||
|  | Delete my account                    ||
|  | Privacy policy                       ||
|  | Terms of service                     ||
|  +--------------------------------------+|
|                                           |
|  [Log out]                                |
|                                           |
+------------------------------------------+
|  Chat | Game | Progress | Profile         |
+------------------------------------------+
```

---

## Screen 5: Onboarding (New User)

Full-screen chat interface (no bottom tabs). Musashi guides through 7 steps.

### Layout:
Same as Chat screen, but:
- No bottom tab bar (focused experience)
- Progress indicator at top: "Step 2 of 7" with thin progress bar
- Back button to revisit previous answers
- Skip not available (all questions are important for personalization)

After onboarding completes, bottom tab bar appears and user lands on Chat tab.

---

## Screen 6: Landing Page (Pre-Auth)

See PRD Section 12 for full copy. Layout summary:

### Mobile layout (primary):
```
+------------------------------------------+
| [Logo]                         [Log in]   |
+------------------------------------------+
| "Train smarter. Know your game.           |
|  Stop guessing."                          |
|                                           |
| "MatMentor is an AI coach that tracks     |
|  your BJJ, spots your patterns, and       |
|  tells you what to work on next."         |
|                                           |
| [===== Start Free Trial =====]            |
|                                           |
| [Chat screenshot / demo video]            |
+------------------------------------------+
| "Sound familiar?"                         |
| - You train 3x a week but can't tell...  |
| - You get tapped by the same stuff...     |
| - You have questions after class...       |
+------------------------------------------+
| ... (remaining sections per PRD spec)     |
+------------------------------------------+
```

Key: Single-column mobile layout. CTA button is full-width, high-contrast. Minimal navigation. Each section is one viewport height or less.

---

## Screen 7: Paywall / Upgrade

Shown when free trial expires or message limit hit.

### Layout:
```
+------------------------------------------+
|  Upgrade to keep training with Musashi    |
+------------------------------------------+
|                                           |
|  You've used your free messages this      |
|  week. Upgrade to continue.              |
|                                           |
|  +--------------------------------------+|
|  |  $9.99/month                         ||
|  |                                      ||
|  |  - AI coaching after every session   ||
|  |  - 100 messages/week                 ||
|  |  - Submission & position analytics   ||
|  |  - Weekly personalized game plans    ||
|  |  - Curated video recommendations     ||
|  |                                      ||
|  |  [======= Upgrade Now =======]      ||
|  |                                      ||
|  |  7-day free trial. Cancel anytime.   ||
|  +--------------------------------------+|
|                                           |
|  "One private lesson costs $80-150.       |
|   Musashi is available after every        |
|   session for $10/month."                |
|                                           |
|  [Maybe later]                            |
|                                           |
+------------------------------------------+
```

---

## Design Tokens

### Colors (dark mode default):
- Background: Slate 950 (`#020617`)
- Card/Surface: Slate 900 (`#0f172a`)
- Primary (CTA, user bubbles): Blue 600 (`#2563eb`)
- Musashi bubble: Slate 800 (`#1e293b`)
- Text primary: Slate 50 (`#f8fafc`)
- Text muted: Slate 400 (`#94a3b8`)
- Success/positive: Emerald 500 (`#10b981`)
- Warning/concern: Amber 500 (`#f59e0b`)
- Danger/alert: Red 500 (`#ef4444`)

### Typography:
- Headings: Inter (or system font stack), semibold
- Body: Inter, regular, 14-16px
- Chat messages: 15px for readability on mobile
- Mono (stats/numbers): JetBrains Mono or system monospace

### Spacing:
- Chat message gap: 12px
- Section padding: 16px horizontal, 24px vertical
- Card border radius: 12px
- Button border radius: 8px

---

## Completion Checklist

- [x] All 7 screens described with ASCII wireframes
- [x] Navigation structure defined (bottom tab bar, 4 tabs)
- [x] Chat message types specified (user, Musashi, quick-select, video card, weekly summary)
- [x] Dashboard sections specified (Game tab + Progress tab)
- [x] Profile/Settings layout defined
- [x] Onboarding screen behavior specified
- [x] Landing page layout summarized (references PRD Section 12)
- [x] Paywall/upgrade screen defined
- [x] Design tokens specified (colors, typography, spacing)
- [x] Empty states described
- [x] Offline behavior noted
