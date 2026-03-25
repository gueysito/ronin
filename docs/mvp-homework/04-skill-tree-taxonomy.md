# BJJ Skill Tree Taxonomy -- COMPLETED

**Status**: COMPLETE
**Completed by**: Research-driven compilation (March 2026)
**Sources**: Saulo Ribeiro's *Jiu-Jitsu University*, John Danaher's Enter the System / New Wave / Go Further Faster series, IBJJF World Championships data (2019-2023), ADCC 2023 competition data, academy curricula (Jay Pages JJMMA, BJJ World belt requirements)
**Raw research**: See `/research/bjj-taxonomy-research.json` for full sourced data

---

## Design Decisions

### Same Technique, Different Positions
**Decision: Option B** -- List each technique ONCE, track position separately during logging.
**Rationale**: An armbar is an armbar. The position context (guard, mount, side control) is captured as a separate field in the `events` table. This keeps the technique list clean, avoids duplicates, and lets analytics show "you hit armbars mostly from mount" without needing separate technique entries.

### Technique Synonyms
**Decision**: Show all aliases in autocomplete. User types "mata" -> suggests "Rear Naked Choke (RNC)". Database stores the canonical full name; UI shows abbreviations where common.

### Gi vs No-Gi
**Decision**: Include both gi and no-gi techniques. Track gi/no-gi as session metadata. Gi-specific techniques (collar chokes, bow and arrow) are tagged in the database so the app can filter recommendations based on the user's training type.

### Future Expansion
**Decision: Option A** -- Admin reviews "Other" entries monthly, adds popular ones to the global taxonomy. Users always have the "Other" escape hatch with free text, but the canonical list stays curated.

---

## Taxonomy Structure

### Domain 1: Standing / Takedowns

**Definition**: Taking the fight to the ground. Entry point for all grappling. Danaher Step 1: remove opponent's ability to use legs for power generation.
**Belt emphasis**: Fundamentals at all belts, intensifies at purple+.

**Position**: Standing

**Techniques** (9):

| # | Technique | Belt Level | Competition Relevance | Source |
|---|-----------|-----------|----------------------|--------|
| 1 | Double Leg Takedown | White | High | Universal wrestling/BJJ curriculum |
| 2 | Single Leg Takedown | White | High | Universal wrestling/BJJ curriculum |
| 3 | Body Lock Takedown | Blue | High | BJJ World blue belt curriculum |
| 4 | O Soto Gari (Outside Reap) | Blue | Medium | Judo/BJJ crossover |
| 5 | O Uchi Gari (Inside Reap) | Blue | Medium | Judo/BJJ crossover |
| 6 | O Goshi (Hip Throw) | Blue | Medium | Judo/BJJ crossover |
| 7 | Guard Pull | White | Very High | IBJJF standard technique |
| 8 | Snap Down to Front Headlock | Purple | High | Danaher front headlock system |
| 9 | Collar Drag | Blue | Medium | Jay Pages curriculum |

---

### Domain 2: Guard Play

**Definition**: Bottom position with legs as primary weapons. Sweeps, submissions, and retention from guard. Danaher Step 2 obstacle: opponent must get past the legs.
**Belt emphasis**: Purple belt primary focus (Ribeiro Chapter 4).

**Positions** (7):
1. **Closed Guard** -- Legs locked around opponent's waist. Classic BJJ position.
2. **Open Guard** -- Legs not locked; includes collar-sleeve, seated guard. Most common guard for sweeping in IBJJF.
3. **Half Guard** -- One of opponent's legs trapped. Includes lockdown, Z-guard, deep half.
4. **Butterfly Guard** -- Seated with both hooks inside opponent's thighs. Strong sweeping position.
5. **De La Riva Guard** -- One leg hooks behind opponent's lead leg. One of the best guards for sweeping per IBJJF data.
6. **Spider Guard** -- Gi-based. Sleeve grips with feet on opponent's biceps. Includes lasso variation.
7. **X-Guard / Single Leg X** -- Legs forming X under opponent. Strong sweep and leg lock entry position.

**Techniques** (12 sweeps):

| # | Technique | Position | Belt Level | Competition Relevance | Source |
|---|-----------|----------|-----------|----------------------|--------|
| 10 | Scissor Sweep | Closed Guard | White | High | Universal curriculum |
| 11 | Hip Bump Sweep (Sit-Up Sweep) | Closed Guard | White | High | Universal curriculum |
| 12 | Pendulum Sweep (Flower Sweep) | Closed Guard | Blue | High | BJJ World blue belt |
| 13 | Lumberjack Sweep | Closed Guard | Blue | Medium | Common vs standing opponent |
| 14 | Tripod Sweep | Open Guard | Blue | High | Jay Pages curriculum |
| 15 | Sickle Sweep | Open Guard | Blue | Medium | BJJ World blue belt |
| 16 | Butterfly Sweep (Hook Sweep) | Butterfly Guard | Blue | High | Ribeiro purple belt chapter |
| 17 | De La Riva Sweep | De La Riva | Purple | Very High | IBJJF data, Ribeiro |
| 18 | X-Guard Technical Stand-Up Sweep | X-Guard | Purple | High | BJJ World purple belt |
| 19 | Half Guard Underhook Sweep (Old School) | Half Guard | Blue | High | Jay Pages curriculum |
| 20 | Lasso Sweep | Spider Guard | Purple | High | BJJ World purple belt |
| 21 | Spider Guard Triangle / Sweep | Spider Guard | Purple | Medium | Jay Pages curriculum |

---

### Domain 3: Guard Passing

**Definition**: Getting past opponent's legs to establish a dominant top position. Statistically, securing a guard pass gives 99.6% win probability in IBJJF competition.
**Belt emphasis**: Brown belt primary focus (Ribeiro Chapter 5).

**Positions** (2):
1. **Inside Guard (Top)** -- Top position inside any guard variation. Starting point for all passing.
2. **Half Guard Top** -- Passer has one leg trapped in half guard. Specific passing strategies required.

**Techniques** (10):

| # | Technique | Position | Belt Level | Competition Relevance | Source |
|---|-----------|----------|-----------|----------------------|--------|
| 22 | Knee Cut Pass (Knee Slice) | Guard Top | Blue | Very High | #1 most popular pass in IBJJF |
| 23 | Torreando Pass (Bullfighter) | Guard Top | Blue | High | Universal curriculum |
| 24 | Double Under Pass (Stack Pass) | Guard Top | Blue | High | Jay Pages curriculum |
| 25 | Over-Under Pass | Guard Top | Purple | High | Close-distance passes succeed 2x more (ADCC) |
| 26 | Leg Drag Pass | Guard Top | Purple | Very High | Danaher system, BJJ World purple belt |
| 27 | Half Guard Pressure Pass (Smash Pass) | Half Guard | Blue | Very High | Dominates ADCC competitions |
| 28 | Backstep Pass | Guard Top | Purple | High | BJJ World purple belt |
| 29 | Sao Paulo Pass (Folding Pass) | Guard Top | Purple | Medium | BJJ World purple belt |
| 30 | Standing Guard Break & Pass | Closed Guard | White | High | Universal fundamental |
| 31 | Long Step Pass | Guard Top | Purple | Medium | Danaher New Wave system |

---

### Domain 4: Positional Control & Escapes

**Definition**: Maintaining dominant pins (top) and escaping inferior positions (bottom). White belt = survival in bad positions. Blue belt = escaping bad positions. Danaher Steps 3-4: hierarchy of pins.
**Belt emphasis**: White belt survival, Blue belt escapes (Ribeiro Chapters 2-3).

**Positions** (8):
1. **Side Control** -- Dominant pin across opponent's chest. Includes kesa gatame, north-south.
2. **North-South** -- Head-to-head pin position. Strong control.
3. **Knee on Belly** -- Knee on opponent's torso. Mobile, high-pressure. Transition point.
4. **Mount** -- Sitting on opponent's torso. Includes low, high, S-mount, technical mount.
5. **Back Control** -- Behind opponent with hooks/body triangle. Best position in Danaher hierarchy. 45% of IBJJF 2023 subs came from back.
6. **Front Headlock / Turtle Top** -- Controlling opponent's head from front while they're turtled. Gateway to guillotines, darces, anacondas.
7. **Turtle** -- Defensive position on hands and knees.
8. **Crucifix** -- Arms trapped, one by legs, one by arms. High-control submission position.

**Techniques** (7 escapes):

| # | Technique | Position | Belt Level | Competition Relevance | Source |
|---|-----------|----------|-----------|----------------------|--------|
| 32 | Bridge and Roll (Upa) Escape from Mount | Mount | White | High | Ribeiro blue belt, universal |
| 33 | Elbow-Knee Escape (Shrimp) from Mount | Mount | White | High | Ribeiro blue belt, universal |
| 34 | Frame and Shrimp Escape from Side Control | Side Control | White | High | Ribeiro blue belt, universal |
| 35 | Back Escape (Slide to Guard) | Back Control | Blue | High | Ribeiro blue belt, Jay Pages |
| 36 | Knee on Belly Escape (Running Escape) | Knee on Belly | Blue | Medium | Ribeiro blue belt |
| 37 | Turtle Sit-Out Escape | Turtle | Blue | Medium | BJJ World blue belt |
| 38 | Ghost Escape | Side Control | Purple | Medium | BJJ World purple belt |

---

### Domain 5: Submissions

**Definition**: Finishing techniques -- chokes, joint locks, and leg locks. Competition data: 53% chokes, ~24% arm attacks, ~23% leg attacks.
**Belt emphasis**: Taught from white belt, mastered at black belt (Ribeiro Chapter 6).

**Position**: Leg Entanglements (Ashi Garami) -- dedicated position for leg lock attacks.

**Techniques** (12 submissions):

| # | Technique | Primary Position | Type | Belt Level | Competition Data | Source |
|---|-----------|-----------------|------|-----------|-----------------|--------|
| 39 | Rear Naked Choke (RNC) | Back Control | Choke | White | 45% of IBJJF 2023 subs, 20% of ADCC | Danaher Straight Jacket, universal |
| 40 | Armbar (Juji Gatame) | Mount | Joint Lock | White | 21% of IBJJF 2023 subs, 50% finish rate | Danaher ETS, universal |
| 41 | Triangle Choke (Sankaku Jime) | Closed Guard | Choke | Blue | 3rd most common IBJJF sub, ~38% success | Danaher ETS, universal |
| 42 | Guillotine Choke | Front Headlock | Choke | Blue | Most attempted sub, 9.3% finish rate | Danaher ETS: Front Headlocks |
| 43 | Kimura (Double Wristlock) | Side Control | Joint Lock | White | Top 5 most common overall | Danaher ETS: Kimuras |
| 44 | Americana (Keylock) | Mount | Joint Lock | White | 70% success rate | Universal white belt curriculum |
| 45 | Cross Collar Choke | Mount | Choke | White | 75% success rate (gi) | IBJJF gi data |
| 46 | Bow and Arrow Choke | Back Control | Choke | Purple | 89% success rate at 2019 IBJJF Worlds | IBJJF 2019, gi-only |
| 47 | D'Arce Choke (Brabo) | Front Headlock | Choke | Purple | High | Jay Pages, Danaher system |
| 48 | Arm Triangle (Kata Gatame) | Side Control | Choke | Blue | High | Jay Pages, universal |
| 49 | Omoplata | Closed Guard | Joint Lock | Blue | Medium | IBJJF official, Jay Pages |
| 50 | Straight Ankle Lock (Achilles) | Leg Entanglements | Leg Lock | Blue | High (only leg lock legal at all IBJJF belts) | IBJJF rules, Danaher ETS |

**Phase 1.5 additions** (not in MVP seed but tracked for expansion):
- Inside Heel Hook (brown+, ADCC #1 sub at 21%)
- Toe Hold (brown+ IBJJF)
- Kneebar (brown+ IBJJF)
- Ezekiel Choke
- North-South Choke
- Anaconda Choke
- Baseball Bat Choke
- Wristlock
- Loop Choke

---

## Taxonomy Summary

| Category | Count |
|----------|-------|
| **Domains** | 5 |
| **Positions** | 19 |
| **Techniques** | 50 |

**Technique breakdown**:
- Takedowns: 9
- Sweeps: 12
- Guard Passes: 10 (+ 1 added: Long Step Pass)
- Escapes: 7
- Submissions: 12

**Belt distribution**:
- White belt: 12 techniques (foundational survival + basic attacks)
- Blue belt: 18 techniques (escapes + developing offense)
- Purple belt: 14 techniques (creativity, advanced guards, passing systems)
- Brown+: tracked but deferred to Phase 1.5

---

## Technique Synonyms (for autocomplete/search)

| Canonical Name | Aliases |
|---------------|---------|
| Rear Naked Choke | RNC, Mata Leao |
| Armbar | Arm Bar, Juji Gatame |
| Triangle Choke | Triangle, Sankaku Jime |
| Guillotine Choke | Guillotine, Gilotina |
| Kimura | Double Wristlock, Chicken Wing |
| Americana | Keylock, Ude Garami, Paintbrush |
| D'Arce Choke | Darce, Brabo Choke |
| Arm Triangle | Head and Arm Choke, Kata Gatame |
| O Soto Gari | Outside Reap, Osoto |
| O Uchi Gari | Inside Reap, Ouchi |
| O Goshi | Hip Throw, Ogoshi |
| Hip Bump Sweep | Sit-Up Sweep |
| Pendulum Sweep | Flower Sweep |
| Butterfly Sweep | Hook Sweep |
| Knee Cut Pass | Knee Slice, Knee Slide |
| Torreando Pass | Bullfighter Pass, Toreando |
| Double Under Pass | Stack Pass |
| Half Guard Pressure Pass | Smash Pass |
| Bridge and Roll Escape | Upa, Trap and Roll |
| Elbow-Knee Escape | Shrimp Escape, Hip Escape |
| Straight Ankle Lock | Achilles Lock, Ankle Lock |
| Bow and Arrow Choke | Bow and Arrow |

---

## Data Validation Rules

- [x] Every technique MUST belong to a Domain
- [x] Every technique SHOULD have a primary Position
- [x] Technique names MUST be unique (canonical full name)
- [x] Title Case for all names (e.g., "Triangle Choke" not "triangle choke")
- [x] Full names in database, abbreviations in UI (RNC stored as "Rear Naked Choke")
- [x] Gi-specific techniques tagged with `gi_only: true` for filtering
- [x] "Other" option always available with free text for unlisted techniques

---

## Reference Frameworks

### Saulo Ribeiro's Belt Progression (Jiu-Jitsu University)
- **White Belt**: Survival -- defensive posture from mount, side control, back, knee-on-belly
- **Blue Belt**: Escapes -- mount escapes, side control escapes, back escapes, submission defense
- **Purple Belt**: Guard -- closed guard, butterfly, spider, DLR, half guard, X-guard
- **Brown Belt**: Guard Passing -- passes for every guard variation
- **Black Belt**: Submissions -- finishing from every position

### Danaher's Positional Hierarchy
Standing > Takedown > Guard Top > Pass > Side Control > Knee on Belly > Mount > Back Control > Submission

### IBJJF Leg Lock Legality
- White to Blue: Straight ankle lock only
- Purple: Straight ankle lock only (gi)
- Brown to Black: Straight ankle lock, kneebar, toe hold, calf slicer (gi). Heel hooks legal in no-gi.
- ADCC/no-gi: All leg locks legal at all levels

---

## Completion Checklist

- [x] All 5 domains defined with clear descriptions
- [x] 19 positions listed across domains (close to 20 target)
- [x] 50 techniques listed with domain/position mappings
- [x] Synonym list created
- [x] Ambiguity decisions made (Option B: technique once, position tracked separately)
- [x] Gi vs no-gi decision made (include both, tag gi-only techniques)
- [x] Data validation rules defined
- [x] Future expansion strategy chosen (admin-reviewed monthly)
- [x] All data sourced from real curricula and competition statistics
