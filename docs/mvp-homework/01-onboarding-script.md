# Onboarding Script -- COMPLETED

**Status**: COMPLETE
**Completed by**: Research-driven design (March 2026)
**Target**: Complete in under 2.5 minutes (7 steps, mostly quick-select)

---

## Onboarding Flow

### Step 1: Welcome Message

**Musashi**:
"Hey -- I'm Musashi, your BJJ coach. I'll track your training, spot patterns in your game, and tell you what to work on next. Let's get to know each other. Takes about 2 minutes."

**User Action**: [Let's go]

---

### Step 2: Belt Rank

**Musashi**:
"What belt are you wearing right now?"

**Options** (single-select buttons):
[White Belt] [Blue Belt] [Purple Belt] [Brown Belt] [Black Belt]

**Follow-up by belt**:
- White: "Welcome to the journey. We'll focus on survival, defense, and building your confidence."
- Blue: "The real work starts here. Let's make sure you don't become a statistic -- we'll build your game."
- Purple: "Time to get creative. Let's sharpen your A-game and patch the holes."
- Brown/Black: "You know the art. I'll help you see patterns in your data you might miss in the grind."

---

### Step 3: Experience Duration

**Musashi**:
"How long have you been training?"

**Options** (single-select buttons):
[Less than 6 months] [6-12 months] [1-2 years] [2-3 years] [3-5 years] [5+ years]

---

### Step 4: Training Frequency

**Musashi**:
"How many days a week do you typically train?"

**Options** (single-select buttons):
[1-2 days] [3-4 days] [5-6 days] [Every day]

---

### Step 5: Goals

**Musashi**:
"What are you working toward right now? Pick your top priorities."

**Options** (multi-select, pick 1-3):
- [ ] Get promoted to next belt
- [ ] Compete in a tournament
- [ ] Improve guard retention
- [ ] Develop a submission game
- [ ] Train more consistently
- [ ] Recover from / prevent injuries
- [ ] Build confidence on the mats
- [ ] Get in better shape for rolling
- [ ] Other: [free text input]

---

### Step 6: Biggest Struggles

**Musashi**:
"What gives you the most trouble right now? Pick your top 2-3."

**Options** (multi-select, pick 2-3):
- [ ] Escaping mount
- [ ] Escaping side control
- [ ] Escaping back control
- [ ] Guard retention (getting passed)
- [ ] Passing guard
- [ ] Finishing submissions
- [ ] Cardio / gassing out
- [ ] Takedowns / standing game
- [ ] Remembering techniques under pressure
- [ ] Competition nerves
- [ ] Staying motivated
- [ ] Other: [free text input]

---

### Step 7: Wrap-Up & First Recommendation

**Musashi** (dynamically generated based on belt + goals + struggles):

Example for a blue belt who struggles with guard retention and wants to compete:
"Got it. You're a blue belt working toward competition with guard retention as your main hole. That's a solvable problem. Here's your first focus: before your next session, watch this guard retention breakdown from Lachlan Giles -- [video link]. It's 10 minutes and covers the frames that matter most. Ready to log a session, or training tomorrow?"

**Options**:
[I just trained!] [Training tomorrow]

- **"I just trained!"** -> Opens logging flow immediately
- **"Training tomorrow"** -> Shows dashboard (empty state with encouraging message: "Your first session log will go here. Train hard tomorrow.")

---

## Design Notes

**Total steps**: 7 (including welcome and wrap-up)
**Estimated time**: 1.5-2.5 minutes
**Input types**: 5 quick-select, 2 multi-select, 0 required free text (optional "Other" fields only)
**No physical/mental state questions at onboarding** -- that's captured per-session in the logging flow. Onboarding should be fast and painless.
**No weight class question** -- deferred to Phase 2 competition prep features.

---

## Completion Checklist

- [x] All questions filled in with exact wording
- [x] Button labels specified for each question
- [x] Multi-select vs single-select specified per question
- [x] Belt-specific follow-up messages written
- [x] Wrap-up message is dynamic (references user's belt + struggles)
- [x] Post-onboarding routing defined (log now vs dashboard)
- [x] Estimated time: under 2.5 minutes
