# MVP Homework - README

**Purpose**: These templates define the core content and UX flows that YOU (Carlos) need to complete before full development begins.

**Why This Matters**: These are the creative/domain-specific decisions that only someone with BJJ knowledge can make properly. The AI can scaffold code, but you define the experience.

---

## 📋 Your Assignments

Complete these 6 templates in order:

1. **[01-onboarding-script.md](./01-onboarding-script.md)** ⭐ START HERE
   - Define the exact questions Musashi asks new users
   - What buttons/options appear?
   - How long should it take?

2. **[02-logging-flow.md](./02-logging-flow.md)** ⭐ CRITICAL FOR MVP
   - Step-by-step UX for logging a training session
   - What quick-select options appear?
   - How does Musashi respond?

3. **[03-system-prompt.md](./03-system-prompt.md)** 🧠 DEFINES AI PERSONALITY
   - Musashi's personality, tone, and rules
   - How should he respond to different scenarios?
   - Safety constraints (medical advice, etc.)

4. **[04-skill-tree-taxonomy.md](./04-skill-tree-taxonomy.md)** 📊 DATA FOUNDATION
   - List of 5 Domains, 20 Positions, 50 Techniques
   - This is what powers analytics and recommendations

5. **[05-video-links.md](./05-video-links.md)** 🎥 CONTENT CURATION
   - 50 YouTube video links mapped to techniques
   - Only elite instructors (Danaher, Giles, etc.)

6. **[06-wireframes.md](./06-wireframes.md)** 🎨 VISUAL GUIDE
   - Sketches/descriptions of key screens
   - Chat, Dashboard, Profile layouts
   - Can be hand-drawn and photographed!

---

## ⏱️ Time Estimate

- **Total Time**: 4-6 hours (spread over 2-3 days is fine)
- **Quickest Path**: Focus on #1, #2, #3 first (get coding started)
- **Can Be Refined Later**: #4, #5, #6 can evolve as we build

---

## ✅ How to Submit

Once you've filled out each template:

1. Save your changes to each `.md` file
2. Commit to git (or just tell me "homework done")
3. I'll integrate your content into the codebase:
   - Onboarding script → React components
   - Logging flow → Chat UI logic
   - System prompt → AI agent configuration
   - Skill tree → Database seed data
   - Video links → `content_links` table
   - Wireframes → Component structure

---

## 💡 Tips for Success

### For Onboarding & Logging Flows
- **Be Specific**: Don't write "ask about belt rank"—write the EXACT question Musashi says
- **Think Mobile-First**: Users will be on their phone right after training (sweaty, tired)
- **Keep It Short**: Every extra question reduces completion rate
- **Use Examples**: "How was your energy? [🔥 Great] [😊 Good] [😓 Tired]"

### For System Prompt
- **Show, Don't Tell**: Instead of "be encouraging," write an example encouraging response
- **Cover Edge Cases**: What if someone says they're injured? Frustrated? Plateaued?
- **Set Boundaries**: What should Musashi NEVER say?

### For Skill Tree
- **Start Simple**: Don't try to map all of BJJ in one sitting
- **Allow "Other"**: Users can always add unlisted techniques later
- **Think Coverage**: What 50 techniques cover 80% of training sessions?

### For Video Links
- **Quality Over Quantity**: 10 great links > 50 mediocre ones
- **Free Only (MVP)**: No paid content yet (affiliate links in Phase 2)
- **Test Links**: Make sure they're not region-blocked or deleted

### For Wireframes
- **Low-Fi is Fine**: Pen and paper sketches work great
- **Focus on Flow**: How does user navigate between screens?
- **Annotate**: Label buttons, explain what happens on tap

---

## 🚫 What NOT to Worry About

- **Code**: I'll handle all implementation
- **Perfection**: We can refine after seeing it live
- **Completeness**: If you're missing 5 techniques, just put "TBD" and we'll add later
- **Design**: Don't worry about colors, fonts, spacing—I'll apply the design system

---

## 📞 Need Help?

If you get stuck on any template:
- **Ask Me**: I can provide examples or clarify what I need
- **Skip & Return**: Move to next template, come back later
- **Partial is OK**: Better to submit incomplete than to block progress

---

**Let's build this! 🥋🤖**

Once you complete these, we'll have everything needed to start coding the MVP.
