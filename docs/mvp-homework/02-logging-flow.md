# Logging Flow -- COMPLETED

**Status**: COMPLETE
**Completed by**: Research-driven design (March 2026)
**Target**: Complete session log in under 60 seconds

---

## Core Principle

Logging happens IN the chat, not in a separate form. Musashi guides the conversation with quick-select buttons. The user should be able to log a full session by tapping 5-7 buttons and typing 0 words. Free text is always optional.

---

## Logging Flow

### Trigger

Musashi initiates when user opens the app (if they haven't logged today):
"Did you train today?"

**Options**:
[Yes, I rolled] [Yes, drilling only] [Open mat] [Competition] [Private lesson] [Rest day]

- **"Rest day"** -> "Smart. Recovery is training. See you next session." (End flow, no log created.)
- Any training option -> Continue to Step 1.

---

### Step 1: Duration

**Musashi**:
"How long was your session?"

**Options** (single-select):
[30 min] [45 min] [60 min] [90 min] [2 hours] [2.5+ hours]

---

### Step 2: Intensity (RPE)

**Musashi**:
"How hard did you go?"

**Options** (emoji scale, single-select):
[1-2 Light drilling] [3-4 Technical] [5-6 Moderate] [7-8 Hard rounds] [9-10 Competition pace]

---

### Step 3: What You Hit (Submissions / Sweeps / Passes)

**Musashi**:
"Any submissions, sweeps, or passes you hit today?"

**Options** (multi-select grid of common techniques, pulled from taxonomy):

**Quick-select grid** (shows top 12 most relevant to user's belt and recent activity):
[Armbar] [Triangle] [RNC] [Kimura] [Guillotine] [Americana]
[Scissor Sweep] [Hip Bump] [Butterfly Sweep] [Knee Cut Pass] [Torreando] [Other]

- User taps techniques they hit. Each tap adds to list.
- **[Other]** -> Opens autocomplete search field (searches full technique list + synonyms)
- **[None today]** button at bottom if no successful techniques

For each technique selected, Musashi asks:
"How many times?" -> [1] [2] [3] [4+]

**If user hits a technique for the first time ever** -> Flag for special celebration response in AI feedback.

---

### Step 4: What Caught You (Submissions Received)

**Musashi**:
"Anything catch you today? No judgment -- this is how we find the holes."

**Options** (same grid as Step 3, but framed as "received"):
[Armbar] [Triangle] [RNC] [Kimura] [Guillotine] [Choke (other)]
[Got swept] [Got passed] [Got taken down] [Nothing caught me] [Other]

- **[Nothing caught me]** -> "Clean day! Let's keep that going."
- If same technique catches them 2+ sessions in a row, Musashi flags the pattern in feedback.

---

### Step 5: Positions Worked

**Musashi**:
"Which positions did you spend the most time in?"

**Options** (multi-select, pick 1-4):
[Closed Guard] [Open Guard] [Half Guard] [Mount (top)] [Mount (bottom)]
[Side Control (top)] [Side Control (bottom)] [Back (attacking)] [Back (defending)]
[Standing / Takedowns] [Turtle]

This data feeds the position heatmap on the dashboard.

---

### Step 6: Energy & Mood

**Musashi**:
"How's the body and mind?"

**Energy** (single-select):
[Great] [Good] [Average] [Low] [Gassed]

**Mood** (single-select):
[Confident] [Focused] [Frustrated] [Anxious] [Flow state]

---

### Step 7: Notes (Optional)

**Musashi**:
"Anything else you want to remember about today?"

**Input**: Free text field (optional, placeholder: "e.g., 'Worked on a new guard entry with Coach Mike'")

**Options**:
[Submit log] [Skip notes & submit]

---

### Step 8: AI Feedback (Musashi Responds)

After submission, Musashi generates a response following the system prompt structure:

1. **Acknowledgment** (specific to what they logged)
2. **Insight** (pattern, improvement, or concern)
3. **Forward action** (drill, focus, or video recommendation)

Example (blue belt, logged 2 armbars from guard, got swept twice, average energy, frustrated mood):

"Two armbars from guard -- your attack from bottom is developing. Getting swept twice though, that's been a theme the last 3 sessions. Your base might be the issue. Before your next class, watch this base and posture breakdown by Bernardo Faria: [video]. And don't let the frustration stick -- bad days are just data."

---

## Flow Summary

| Step | Question | Input Type | Time |
|------|----------|-----------|------|
| Trigger | Did you train? | Single-select (6 options) | 2s |
| 1 | Duration | Single-select (6 options) | 2s |
| 2 | Intensity | Single-select (5 options) | 2s |
| 3 | What you hit | Multi-select grid + count | 10-15s |
| 4 | What caught you | Multi-select grid | 5-10s |
| 5 | Positions worked | Multi-select (11 options) | 5s |
| 6 | Energy & mood | Two single-selects | 4s |
| 7 | Notes | Optional free text | 0-15s |
| **Total** | | | **30-55 seconds** |

---

## Adaptive Behavior

- **Quick-select grid order**: Techniques are sorted by frequency for this user. Their most-used techniques appear first. New users get the default order (most common by belt level from taxonomy data).
- **Repeat patterns**: If a user logs the same struggle 3+ sessions in a row, Musashi proactively addresses it in the feedback without the user asking.
- **Low-effort mode**: If user responds with just "yes" or minimal input, Musashi gently guides but never nags. One prompt per step, move on if skipped.
- **Session type adaptation**: "Drilling only" sessions skip Step 3 (what you hit) and Step 4 (what caught you), and instead ask: "What technique(s) were you drilling?" with the same grid.

---

## Data Stored Per Log

```json
{
  "session": {
    "date": "auto (editable)",
    "type": "rolling | drilling | open_mat | competition | private_lesson",
    "duration_minutes": 60,
    "intensity_rpe": 7,
    "energy": 3,
    "mood": "frustrated",
    "notes": "optional free text"
  },
  "events": [
    { "type": "success", "technique_id": "armbar", "count": 2 },
    { "type": "success", "technique_id": "scissor_sweep", "count": 1 },
    { "type": "against", "technique_id": "triangle_choke", "count": 1 }
  ],
  "positions_worked": ["closed_guard", "mount_top", "side_control_bottom"]
}
```

---

## Completion Checklist

- [x] Step-by-step flow defined with exact Musashi prompts
- [x] All quick-select options specified per step
- [x] Multi-select vs single-select specified
- [x] Session type variations handled (drilling, competition, etc.)
- [x] Data schema for stored log defined
- [x] AI feedback structure specified
- [x] Adaptive behavior rules defined (grid ordering, repeat patterns)
- [x] Total estimated time: 30-55 seconds
