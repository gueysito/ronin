# Onboarding Script Template

**Purpose**: Define the exact conversation flow when a new user signs up.

**Goal**: Get essential info in <3 minutes without feeling like a boring form.

---

## Instructions

Fill in the exact questions Musashi asks, the button options users see, and the order of questions.

**Format**:
```
Musashi: "[EXACT QUESTION TEXT]"
Options: [Button 1] [Button 2] [Button 3]
OR
Input Type: [Free text / Date picker / etc.]

[User responds]

Musashi: "[FOLLOW-UP OR NEXT QUESTION]"
```

---

## Onboarding Flow

### Step 1: Welcome Message
**Musashi**: 
```
[Write the exact welcome message here]
Example: "Hey! I'm Musashi, your BJJ coach. I'll help you track your progress, 
identify your strengths and weaknesses, and level up your game. Let's get started!"
```

**User Action**: [Tap "Let's go" button / Auto-advance after 2 seconds?]

---

### Step 2: Belt Rank
**Musashi**: 
```
[Write the exact question]
Example: "First things first—what's your current belt rank?"
```

**Options**: 
```
[List the exact button labels]
Example:
[White Belt] [Blue Belt] [Purple Belt] [Brown Belt] [Black Belt]
```

**Follow-up** (if White Belt):
```
[Optional: Does Musashi say anything different to white belts vs black belts?]
Example: "Great! We'll focus on defense and fundamentals."
```

---

### Step 3: Experience Duration
**Musashi**: 
```
[Write the exact question]
Example: "How long have you been training?"
```

**Options**: 
```
[List the exact button labels]
Example:
[< 6 months] [6-12 months] [1-2 years] [2-3 years] [3+ years]
```

---

### Step 4: Training Frequency
**Musashi**: 
```
[Write the exact question]
```

**Options**: 
```
[List options]
Example:
[1-2 days/week] [3-4 days/week] [5-6 days/week] [7+ days/week]
```

---

### Step 5: Goals
**Musashi**: 
```
[Write the exact question]
Example: "What are you hoping to achieve in the next 6 months? 
(It's okay to have multiple goals!)"
```

**Input Type**: 
```
[Free text / Pre-written goals with multi-select?]

Option A: Free text input
Option B: Multi-select from common goals:
  [ ] Get promoted to next belt
  [ ] Compete in a tournament
  [ ] Improve guard retention
  [ ] Develop a signature submission
  [ ] Train more consistently
  [ ] Reduce injuries
  [ ] Other: [text input]
```

**Your Choice**: [Specify which approach you prefer]

---

### Step 6: Top Weaknesses
**Musashi**: 
```
[Write the exact question]
Example: "What positions or situations give you the most trouble right now? 
Pick your top 2-3."
```

**Options**: 
```
[List 10-15 common struggle areas, allow multi-select]
Example:
[ ] Escaping mount
[ ] Escaping side control
[ ] Guard retention (getting passed)
[ ] Passing guard
[ ] Defending submissions (getting tapped a lot)
[ ] Cardio / gassing out
[ ] Competition nerves
[ ] Remembering techniques
[ ] Other: [text input]
```

---

### Step 7: Current Physical/Mental State
**Musashi**: 
```
[Write the exact question]
Example: "Last question—how are you feeling right now? 
Any injuries, soreness, or just general vibes?"
```

**Input Type**: 
```
[Free text / Structured quick-checks?]

Option A: Free text
Option B: Quick checks:
  Energy level: [🔥 Great] [😊 Good] [😐 Average] [😓 Low]
  Sleep quality: [😴 Great] [🙂 Decent] [😑 Poor]
  Injuries/soreness: [None] [Minor] [Recovering from injury]
  Optional notes: [text input]
```

**Your Choice**: [Specify which approach]

---

### Step 8: Wrap-Up & First Recommendation
**Musashi**: 
```
[Write the exact closing message]
Example: "Perfect! I've got a good picture of where you're at. 
Based on what you've told me, here's what I'd focus on this week: [specific drill/concept].

Ready to log your first session?"
```

**Options**: 
```
[I just trained!] [I'll train tomorrow]
```

**If "I just trained!"**: → Take user directly to logging flow  
**If "I'll train tomorrow"**: → Show dashboard (empty state)

---

## Questions for You

1. **How many questions is too many?** (Aim for 5-7 max)
2. **Should goals be free text or pre-selected options?** (Free text = more personal but slower)
3. **Do you want to ask about competition experience?** (Yes/No, and if yes, what exactly?)
4. **Should we ask weight class?** (Useful for competition prep features in Phase 2)
5. **Any other info you think is critical to know upfront?**

---

## ✅ Completion Checklist

- [ ] All questions filled in with exact wording
- [ ] Button labels specified for each quick-select question
- [ ] Decided on free text vs structured input for goals/state
- [ ] Wrap-up message written
- [ ] Total estimated time: _____ minutes (aim for <3)

---

**Once complete, move to [02-logging-flow.md](./02-logging-flow.md)**
