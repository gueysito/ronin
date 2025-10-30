# BJJ Skill Tree Taxonomy Template

**Purpose**: Define the hierarchical structure of BJJ knowledge that powers analytics, recommendations, and the future Skill Tree visualization.

**Goal**: Create a comprehensive but manageable taxonomy (5 Domains, 20 Positions, 50 Techniques for MVP).

---

## Instructions

Fill in the taxonomy below. This will become seed data in the database.

**Format**:
```yaml
Domain Name:
  Position 1:
    - Technique A
    - Technique B
  Position 2:
    - Technique C
```

**Principles**:
- **Coverage > Completeness**: Choose techniques that cover 80% of training sessions
- **Allow "Other"**: Users can always log unlisted techniques (we'll add them later)
- **Be Opinionated**: There's no perfect taxonomy—just pick one that makes sense to YOU

---

## Taxonomy Structure

### Domain 1: Guard

**Definition**: Positions where you're on your back, using your legs to control opponent

**Positions** (list 3-5):
```
Example:
1. Closed Guard (legs locked around opponent's waist)
2. Open Guard (generic - legs not locked, maintaining distance)
3. Half Guard (one of opponent's legs trapped between yours)
4. Butterfly Guard (hooks under opponent's legs)
5. [Add more if needed: X-Guard, De La Riva, Spider Guard, etc.]
```

**Techniques** (list 10-15 total across all guard positions):
```
Submissions:
  - Armbar
  - Triangle Choke
  - Kimura
  - Omoplata
  - Guillotine
  - [Add more]

Sweeps:
  - Scissor Sweep
  - Flower Sweep
  - Butterfly Sweep
  - Hip Bump Sweep
  - [Add more]
```

**Your Guard Taxonomy**:
```
[Fill in here]
```

---

### Domain 2: Passing

**Definition**: Techniques to get past opponent's guard and establish top control

**Positions** (list 2-4 passing styles):
```
Example:
1. Knee Slice Pass
2. Toreando (Bullfighter) Pass
3. Leg Drag Pass
4. Pressure Passing (stack pass, smash pass, etc.)
```

**Techniques** (list 5-8):
```
Example:
- Knee Slice Pass
- Toreando Pass
- Leg Drag to Back Take
- Stack Pass
- [Add more]
```

**Your Passing Taxonomy**:
```
[Fill in here]
```

---

### Domain 3: Top Control

**Definition**: Dominant positions where you're on top, controlling opponent

**Positions** (list 4-6):
```
Example:
1. Mount (full mount)
2. Side Control
3. Knee on Belly
4. Back Mount (hooks in)
5. North-South
6. Crucifix
```

**Techniques** (list 12-15 total):
```
Submissions from Mount:
  - Armbar
  - Americana
  - Ezekiel Choke
  - [Add more]

Submissions from Side Control:
  - Kimura
  - Americana
  - Arm Triangle
  - [Add more]

Submissions from Back:
  - Rear Naked Choke (RNC)
  - Bow & Arrow Choke
  - Armbar from Back
  - [Add more]

Submissions from North-South:
  - North-South Choke
  - Kimura
  - [Add more]
```

**Your Top Control Taxonomy**:
```
[Fill in here]
```

---

### Domain 4: Escapes

**Definition**: Techniques to escape bad positions and return to neutral or guard

**Positions** (list 3-5):
```
Example:
1. Mount Escape
2. Side Control Escape
3. Back Escape
4. Turtle Escape
5. [Add more if needed]
```

**Techniques** (list 6-10):
```
Example:
- Upa (Bridge) Escape from Mount
- Elbow-Knee Escape from Mount
- Frame and Shrimp from Side Control
- Back Door Escape from Side Control
- Hand Fighting from Back Control
- Sit-Up Escape from Turtle
- [Add more]
```

**Your Escapes Taxonomy**:
```
[Fill in here]
```

---

### Domain 5: Takedowns / Standup

**Definition**: Techniques to take opponent from standing to ground (or defend takedowns)

**Positions** (list 2-4):
```
Example:
1. Wrestling Takedowns
2. Judo Throws
3. Guard Pulls (technical standup to guard)
4. Takedown Defense
```

**Techniques** (list 6-10):
```
Example:
- Double Leg Takedown
- Single Leg Takedown
- Arm Drag to Back Take
- Ankle Pick
- Osoto Gari (Judo throw)
- Seoi Nage (Judo throw)
- Guard Pull (technical)
- Sprawl (takedown defense)
- [Add more]
```

**Your Takedowns Taxonomy**:
```
[Fill in here]
```

---

## Optional: Domain 6+ (Advanced / Future)

Do you want to add more domains? Examples:
- **Leg Locks** (if you train no-gi or modern BJJ)
- **Transitions** (position changes that aren't submissions/sweeps)
- **Defense** (as its own domain, separate from escapes)

**Your Decision**: Stick with 5 domains for MVP, or add more?

---

## Technique List Summary

Once you've filled in the taxonomy above, create a flat list of ALL 50 techniques (for the database seed data):

**Format**: Technique Name | Domain | Position (if applicable)

```
Example:
1. Armbar | Guard | Closed Guard
2. Armbar | Top Control | Mount
3. Triangle Choke | Guard | Closed Guard
4. Rear Naked Choke | Top Control | Back Mount
5. Kimura | Guard | Closed Guard
6. Kimura | Top Control | Side Control
7. Scissor Sweep | Guard | Closed Guard
... (continue to 50)
```

**Your Complete Technique List** (50 total):
```
[Fill in here - this will become the database seed data]

1. 
2. 
3. 
... (continue to 50)
```

---

## Handling Ambiguity

### Same Technique, Different Positions

Example: "Armbar" can be done from guard, mount, side control, back, etc.

**Your Decision**:
- [ ] **Option A**: List each variation separately (Armbar from Guard, Armbar from Mount, etc.)
- [ ] **Option B**: List "Armbar" once, then track position separately in logging
- [ ] **Option C**: Hybrid (list common ones separately, others generic)

**Rationale**: [Explain your choice]

---

### Technique Synonyms

Example: "Rear Naked Choke" = "RNC" = "Mata Leão" (Portuguese)

**Your Decision**: How should we handle this in the UI?
- [ ] Show primary name only (RNC)
- [ ] Show all aliases in autocomplete (user types "mata" → suggests RNC)

**List Common Synonyms**:
```
Example:
- Rear Naked Choke = RNC = Mata Leão
- D'Arce Choke = Darce = D'arce
- Guillotine = Guillotine Choke
- Armbar = Arm Bar = Juji Gatame
[Add more]
```

---

### Gi vs No-Gi Differences

Some techniques only work in gi (e.g., collar chokes). Others are universal.

**Your Decision**:
- [ ] Include gi-specific techniques (Ezekiel, Bow & Arrow, collar chokes)
- [ ] MVP focuses on universal techniques (works for both gi and no-gi)
- [ ] Track gi vs no-gi as session metadata, allow both technique types

**Rationale**: [Explain]

---

## Data Validation Rules

To keep the database clean, define rules:

**Required Fields**:
- [ ] Every technique MUST belong to a Domain
- [ ] Every technique SHOULD have a Position (unless domain-agnostic like takedowns)
- [ ] Technique names MUST be unique (no duplicates)

**Naming Conventions**:
- [ ] Title Case (e.g., "Triangle Choke" not "triangle choke")
- [ ] Full names preferred over abbreviations in database (RNC stored as "Rear Naked Choke", but UI can show "RNC")

---

## Future Expansion Path

As users log techniques not in this list, how should we handle it?

**Option A**: Admin reviews "Other" entries monthly, adds popular ones to taxonomy  
**Option B**: Auto-add user-submitted techniques (risky: data gets messy)  
**Option C**: Users can create custom techniques (private to them, not global)

**Your Preference**: [Choose one]

---

## ✅ Completion Checklist

- [ ] All 5 domains defined with clear descriptions
- [ ] 20 positions listed across domains
- [ ] 50 techniques listed with domain/position mappings
- [ ] Synonym list created (optional but helpful)
- [ ] Ambiguity decisions made (same technique/different positions, gi vs no-gi)
- [ ] Data validation rules defined
- [ ] Future expansion strategy chosen

---

**Once complete, move to [05-video-links.md](./05-video-links.md)**
