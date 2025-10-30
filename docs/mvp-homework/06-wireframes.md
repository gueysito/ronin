# Wireframes & UI Guidance Template

**Purpose**: Provide visual/descriptive guidance for the UI structure so the app feels cohesive and intuitive.

**Goal**: Define what each screen looks like and how users navigate between them.

---

## Instructions

You can:
- **Draw by hand** and take photos (perfectly fine!)
- **Use Figma/Sketch** (if you're comfortable with design tools)
- **Describe in detail** (if you can't draw, write exactly what's on screen)

**What Matters**:
- Layout (where are elements positioned?)
- Navigation (how do users get from screen A to screen B?)
- Key interactions (what happens when you tap X?)

**What Doesn't Matter**:
- Colors (I'll apply the design system)
- Exact fonts/spacing (handled by Tailwind + shadcn/ui)
- Pixel-perfect alignment

---

## Screen Inventory

Define these 6 core screens:

1. **Landing Page** (pre-signup)
2. **Chat Screen** (primary interface)
3. **Dashboard: Game Tab** (submission stats, skill tree preview)
4. **Dashboard: Progress Tab** (calendar, streaks, trends)
5. **Profile/Settings Screen**
6. **Onboarding Flow** (chat-based, but visual structure matters)

---

## Screen 1: Landing Page (Pre-Signup)

**Purpose**: Convince visitor to sign up for free trial

**Key Elements**:
```
[Describe or sketch what's on the landing page]

Example:
- Hero section:
  - Headline: "Your BJJ Coach, Powered by AI"
  - Subheadline: "Track your training, master your game, level up your mind"
  - CTA Button: "Start Free Trial (1 week)"
- Features section:
  - Icon + text: "AI Feedback on Every Session"
  - Icon + text: "Visualize Your Skill Tree"
  - Icon + text: "Track Submissions, Cardio, Mental Game"
- Social proof:
  - Testimonials from beta users
  - "Join 500+ BJJ practitioners"
- Footer:
  - Privacy Policy, Terms, Contact
```

**Your Wireframe**:
```
[Sketch or describe here]

You can literally write:
"Top: Logo on left, 'Login' button on right
Middle: Big headline, subheadline, CTA button
Bottom: 3 feature boxes with icons"

OR

[Attach a photo of hand-drawn wireframe]
```

---

## Screen 2: Chat Screen (Primary Interface)

**Purpose**: Main interaction point—logging sessions, asking questions, seeing feedback

**Layout**:
```
[Describe the structure]

Example:
┌─────────────────────────────┐
│ [Header: "Musashi" + ⚙️]   │ <- Settings icon top-right
├─────────────────────────────┤
│                             │
│ Musashi: "Hey! Did you..."  │ <- AI messages (left-aligned)
│                             │
│       User: "Yes, I trained"│ <- User messages (right-aligned)
│                             │
│ Musashi: "Nice! How long?"  │
│                             │
│ [60 min] [90 min] [Other]   │ <- Quick-select buttons
│                             │
│       User: *taps 60 min*   │
│                             │
│ [Inline chart: Submissions] │ <- Optional: stats shown in chat
│                             │
├─────────────────────────────┤
│ [Text input field]    [🎤]  │ <- Input + voice button (Phase 1.5)
│ [Send button]               │
├─────────────────────────────┤
│ 🗨️Chat  📊Game  📈Progress 👤│ <- Bottom nav (4 tabs)
└─────────────────────────────┘
```

**Your Wireframe**:
```
[Sketch or describe]

Key Questions:
1. Where do quick-select buttons appear? (Inline with message, or bottom sheet?)
2. How do we show AI is typing? (3 dots animation, "Musashi is thinking...")
3. Do past messages scroll infinitely, or paginate?
4. Where does the "Log New Session" CTA appear if chat is empty?
```

---

## Screen 3: Dashboard - Game Tab

**Purpose**: Show skill analysis (submissions, positions, strengths/weaknesses)

**Layout**:
```
[Describe the structure]

Example:
┌─────────────────────────────┐
│ [Header: "Your Game" + ⚙️]  │
├─────────────────────────────┤
│ [Submission Stats Card]     │
│   Total: 42 (+15% vs last) │
│   [Pie chart by type]       │
│   Top Weapons:              │
│   1. Armbar (12)            │
│   2. Triangle (8)           │
│   3. RNC (6)                │
├─────────────────────────────┤
│ [Position Heatmap]          │ <- Phase 2 (simplified in MVP)
│   Guard:    ■■■■■ (Strong)  │
│   Passing:  ■■□□□ (Weak)    │
│   Mount:    ■■■■□           │
├─────────────────────────────┤
│ [Strengths vs Weaknesses]   │
│   Strengths:                │
│   - Closed guard retention  │
│   - Armbar from mount       │
│                             │
│   Weaknesses:               │
│   - Half guard retention    │
│   - Passing from top        │
└─────────────────────────────┘
```

**Your Wireframe**:
```
[Sketch or describe]

Key Questions:
1. Should stats be cards (shadcn/ui Card component) or full-width sections?
2. Do we show time range filter at top? (Last 7 days, 30 days, All time)
3. Where's the "Skill Tree" link/button? (Or is it a separate tab?)
```

---

## Screen 4: Dashboard - Progress Tab

**Purpose**: Show consistency, training volume, energy/recovery trends

**Layout**:
```
[Describe the structure]

Example:
┌─────────────────────────────┐
│ [Header: "Your Progress"]   │
├─────────────────────────────┤
│ [Training Calendar]         │
│   Mo Tu We Th Fr Sa Su      │
│   ■  ■  ■  □  ■  □  □       │ <- Green = trained, Gray = missed
│   Current Streak: 3 days 🔥 │
│   Longest Streak: 12 days   │
├─────────────────────────────┤
│ [Weekly Volume Chart]       │
│   [Bar chart: Hours/week]   │
│   This week: 4.5h (Goal: 4h)│
├─────────────────────────────┤
│ [Energy Trends]             │
│   [Line graph: Energy 1-5]  │
│   Avg this week: 3.8/5      │
├─────────────────────────────┤
│ [Cardio Performance]        │ <- Phase 2 (optional in MVP)
│   [Bar chart: RPE by week]  │
└─────────────────────────────┘
```

**Your Wireframe**:
```
[Sketch or describe]

Key Questions:
1. Should calendar be month view or week view?
2. Do we show "goal vs actual" prominently? (e.g., "3/4 sessions this week")
3. Where's the CTA to "Log a Session" if they're behind on their goal?
```

---

## Screen 5: Profile / Settings

**Purpose**: Manage account, subscription, goals, preferences

**Layout**:
```
[Describe the structure]

Example:
┌─────────────────────────────┐
│ [Header: "Profile"]         │
├─────────────────────────────┤
│ [Profile Section]           │
│   Alex Johnson              │
│   Blue Belt • 2 years       │
│   [Edit Profile button]     │
├─────────────────────────────┤
│ [Goals Section]             │
│   Short-term:               │
│   - Improve guard retention │
│   [Edit Goals button]       │
├─────────────────────────────┤
│ [Subscription]              │
│   Premium • $9.99/mo        │
│   [Manage Subscription]     │ <- Links to Stripe portal
├─────────────────────────────┤
│ [Preferences]               │
│   [ ] Email notifications   │
│   [ ] Weekly summaries      │
│   Theme: [Dark | Light]     │
├─────────────────────────────┤
│ [Data & Privacy]            │
│   [Export My Data]          │
│   [Delete Account]          │
├─────────────────────────────┤
│ [Sign Out]                  │
└─────────────────────────────┘
```

**Your Wireframe**:
```
[Sketch or describe]

Key Questions:
1. Should subscription status be prominent at top, or buried?
2. Do we show training stats summary here? (e.g., "42 total sessions logged")
3. Where's the link to Privacy Policy / Terms of Service?
```

---

## Screen 6: Onboarding Flow (Chat-Based)

**Purpose**: Collect user info via conversation (from your `01-onboarding-script.md`)

**Visual Structure**:
```
[Describe how this differs from regular chat]

Example:
- Same chat UI, but:
  - Progress indicator at top (e.g., "Step 2 of 6")
  - Quick-select buttons are LARGER (easy thumb tapping)
  - No text input for first few questions (force quick-select)
  - "Skip" button for optional questions?
```

**Your Wireframe**:
```
[Sketch or describe]

Key Questions:
1. Do we show a progress bar? (e.g., "40% complete")
2. Can users go back to previous questions? (Back button, or locked in?)
3. What happens if they close the app mid-onboarding? (Resume later, or restart?)
```

---

## Navigation Flow

Map out how users move between screens:

```
Landing Page
  → [Sign Up] → Onboarding (Chat)
  → [Complete] → Chat Screen (main app)

Chat Screen (Tab 1)
  ↔ Dashboard: Game (Tab 2)
  ↔ Dashboard: Progress (Tab 3)
  ↔ Profile (Tab 4)

All screens:
  → [Settings icon] → Profile/Settings
  → [Bottom nav] → Switch tabs
```

**Key Decisions**:
1. **Back Button Behavior**: If user is in Profile and taps back, where do they go? (Last tab, or always Chat?)
2. **Deep Links**: If notification says "Log your session," does it open Chat with logging flow pre-loaded?
3. **Empty States**: If Dashboard has no data, what does it show? ("Log your first session to see stats!")

**Your Navigation Map**:
```
[Draw or describe the flow]
```

---

## Mobile vs Desktop Considerations

This is a mobile-first PWA, but will people use it on desktop?

**Your Decision**:
- [ ] **Mobile-only optimization** (Desktop is just a wider version, same layout)
- [ ] **Responsive design** (Desktop gets sidebar nav instead of bottom tabs)

**If Responsive**, sketch desktop layout:
```
Example:
Desktop (1200px+):
┌──────────┬────────────────────┐
│ Sidebar  │  Main Content      │
│ [Logo]   │  [Chat messages]   │
│ Chat     │                    │
│ Game     │  [Submission stats]│
│ Progress │                    │
│ Profile  │                    │
└──────────┴────────────────────┘
```

**Your Preference**: [Mobile-only or responsive?]

---

## Design Aesthetic & Vibe

Even without picking colors, describe the feel you want:

**Style**:
- [ ] Calm and minimalist (lots of white space, soft colors)
- [ ] Intense and competitive (bold colors, sharp edges, data-dense)
- [ ] Zen and philosophical (earthy tones, smooth animations)

**Mood Board** (optional):
```
Apps that inspire you:
- Example: "Strava (fitness tracking, clean charts)"
- Example: "Headspace (calm, friendly, not overwhelming)"
- Example: "Duolingo (gamified, encouraging, fun)"
```

**Your Vibe**:
```
[Describe in 2-3 sentences]

Example:
"I want it to feel like a wise coach, not a robot. Calm but focused. Dark mode 
by default (easier on eyes after training). Charts should be clean and easy to 
read at a glance—no clutter."
```

---

## Color Palette (Optional, but helpful)

If you have preferences, note them. Otherwise, I'll pick a sensible default.

**Primary Color** (main actions, accents):
```
Example: Blue (#3B82F6) or Purple (#8B5CF6) or Green (#10B981)
Your preference: [Color or "designer's choice"]
```

**Background**:
```
Dark mode: Dark gray (#1F2937) or True black (#000000)?
Light mode: White (#FFFFFF) or Cream (#FAFAFA)?
Your preference: [Specify or "designer's choice"]
```

**Chart Colors**:
```
Success (submissions hit): Green
Warning (areas to improve): Yellow/Orange
Error (submissions received): Red
Your preference: [Adjust or "standard traffic light colors"]
```

---

## Animations & Interactions

Do you want subtle animations, or keep it snappy/instant?

**Examples**:
- [ ] **Smooth scrolling** (60fps, feels native)
- [ ] **Fade-in for new messages** (Musashi's responses appear gently)
- [ ] **Chart animations** (bars grow, lines draw, etc.)
- [ ] **Haptic feedback** (on mobile, vibrate on button tap) [Phase 1.5]

**Your Preference**:
```
[Choose level: None, Subtle, or Playful]

Example: "Subtle animations—fade-ins and smooth scrolling. No crazy confetti or 
fireworks (save that for hitting big milestones like 100 sessions)."
```

---

## Empty States

What do users see when they have no data yet?

**Chat (No Messages)**:
```
Example:
[Illustration of Musashi avatar]
"Hey! I'm Musashi, your BJJ coach. Let's log your first training session!"
[Log Session button]
```

**Dashboard (No Sessions)**:
```
Example:
[Illustration of empty chart]
"Your stats will appear here after your first training session."
[Log Session button]
```

**Your Empty States**:
```
[Describe or sketch]
```

---

## Error States

What happens when something goes wrong?

**AI Not Responding** (API timeout):
```
Example:
"Hmm, I'm having trouble thinking right now. Try again in a moment?"
[Retry button]
```

**Payment Failed**:
```
Example:
"Your payment didn't go through. Update your card to keep access."
[Update Payment button]
```

**Your Error Messages**:
```
[Define tone: Friendly, Technical, or Apologetic?]
```

---

## ✅ Completion Checklist

- [ ] All 6 core screens sketched or described
- [ ] Navigation flow mapped out
- [ ] Mobile vs desktop decision made
- [ ] Design vibe/aesthetic described
- [ ] Color preferences noted (or deferred to designer)
- [ ] Animation preferences specified
- [ ] Empty states defined
- [ ] Error states defined

---

**Once complete, you've finished all homework! 🎉**

Next step: Share your completed templates, and I'll integrate them into the codebase.
