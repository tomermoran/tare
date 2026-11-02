# Tare planning review (round 2)

Reviewer: principal product manager (quality gate), for the Head of Product.
Inputs: `docs/spec.md` (S-01 to S-09; S-01 Updates and S-02 Data model
decisions override older sections), `planning/drafts/initiatives.md`,
`epics.md` (final, revision 10), `design.md` (approved through round 6 plus
the basket dose-range addendum), `stories.md` (revision 4, approved) and
`tasks.md` (revision 2, for approval). The previous review is in git history.
No drafts were edited and no GitHub issues were created.

## Verdict

**Needs fixes.** 1 Blocker, 7 Major, 9 Minor.

The plan is in much better shape than last round. Every finding from the
previous review is resolved or reduced to a small leftover. IDs trace cleanly
from initiative to task. The totals add up: 16 MVP epics, 85 MVP stories
(228 points), 313 tasks (1,084 h), 61 design tasks (328 h). There is no AI or
LLM work in the MVP, and nothing in the MVP depends on a Next or Later item.

What stops approval is Milestone 1. The spec sets it at 300 to 340 hours. The
plan comes to 422 hours and leaves the gap for the Head of Product to decide
(B1). Milestone 1 is a coherent walking skeleton, but it isn't self-contained
as written:

- nine declared dependencies point outside it (M1);
- it defers the current-setup rule while still letting users make a second
  setup (M2);
- the design schedule and the wave order disagree with the task dependencies
  in several places (M3).

## Previous findings: status

| Finding | Status | Evidence |
|---|---|---|
| B1 Estimated bean age | **Resolved** | S-02 two clocks; STORY-03-03-01 AC 3; TASK-03-03-01-BE1 has no estimate |
| M1 One-tap ratings | **Resolved** | DQ-23; STORY-02-06-02 AC 2; TASK-02-06-02-BE1 ("answers and tags but no rating"). Leftover: EPIC-02-06 still calls it open (m2) |
| M2 Leaving the tasting screen | **Resolved** | Design EPIC-01-05 "Leaving saves", no tab reference; STORY-01-05-01 AC 3-4; TASK-01-05-01-FE3 |
| M3 Retired units | **Resolved** (no longer applies) | S-02: no retire action in the MVP |
| M4 Correcting portion dates | **Resolved** | ACs reworded to "when dates are set"; STORY-03-02-02 AC 5; "Not covered" lists date correction as a Next candidate |
| M5 Opened-then-frozen "open" | **Resolved** | S-02; single `isOpen` (TASK-03-02-04-BE1); STORY-02-02-01 AC 5, 02-02-02 AC 3 |
| M6 iOS storage eviction | **Resolved** | Explicitly accepted in S-02; R-02 |
| M7 Design tasks unscheduled | **Resolved, with new ordering gaps** | Design section 9 sizes; tasks 8.2. The schedule's wave numbers don't match 8.3 (see M3) |
| m1 Resolved questions still open | **Mostly resolved** | Leftovers in initiatives, epics and stories (m2) |
| m2 Later stories lack sources | **Resolved** | Every Later story has source sections |
| m3 "Ran fast" as a signal use | **Resolved** | Design 1.1 |
| m4 Two primary buttons on empty Beans | **Resolved** | Design EPIC-03-01 states: header action hidden |
| m5 Undeclared dependencies | **Resolved** | Old cases declared or retired; new ordering issues are in M3 |
| m6 Dial-in with no open portion | **Resolved** | STORY-02-03-03 AC 4-5 |
| m7 Untestable criteria | **Resolved** | Placeholders marked; eval stories are enabler placeholders |
| m8 "Reopen on last tab" | **Resolved** | Cut; TASK-01-01-05-FE6 retired |
| m9 MVP size | **Open, larger** | MVP is now 228 points and 1,084 h, with sign-off still pending (part of B1) |
| m10 Recipe resolution owner | **Resolved** | STORY-02-01-01 owns it everywhere |

## Coverage summary

**Spec sections to stories**

| Section | Stories that cite it | Status |
|---|---|---|
| S-01 Updates | STORY-01-01-05, 01-01-06, 01-05-04, 02-01-06, 02-02-07, 02-03-06, 04-01-02 (MVP); Later 06-01-*, 06-02-* | Covered |
| S-02 Data model decisions | Nearly every MVP and Next story; Milestone 1 in tasks 8.1 | Covered |
| S-03 Vision and UVP | STORY-06-02-01, 06-02-02, 06-06-01, 06-06-03 (Later) | Covered |
| S-04 Ontology | Most MVP stories in EPIC-01-01, 01-02, 02-01, 03-01, 03-02, 04-01 | Covered |
| S-05 Algorithms and data trust | STORY-06-05-01, 02; 06-06-01 to 04 (Later) | Covered |
| S-06 UX philosophy | STORY-01-01-05, 07; 01-03-02; 01-05-01, 02; 02-02-*; 02-03-03 | Covered |
| S-07 Privacy and i18n | STORY-01-01-02, 03, 08; 01-03-05; 06-05-01, 02 | Covered |
| S-08 Schema | Most stories; tasks section 6 builds it whole | Covered |
| S-09 GenAI prompts | STORY-01-06-02, 03-03-04 (MVP inputs); 06-01-*, 06-02-* (Later) | Covered |

No spec section is left without stories.

**Down the chain**

- 6 initiatives, then 31 epics (16 MVP, 8 Next, 7 Later), then 138 stories
  (85 MVP, 30 Next, 23 Later; 401 points), then 313 MVP tasks (1,084 h).
- The per-epic task and hour tables in `tasks.md` section 11 add up. So does
  the Milestone 1 table in 8.1: 113 tasks and 422 h, which is the five epics'
  135 tasks and 493 h, minus 26 deferred tasks (83 h), plus 4 pulled-in tasks
  (12 h).
- Every MVP story has at least one `qa` task.
- Design: 61 MVP design tasks (328 h). The 148 h scheduled for Milestone 1 add
  up.
- No AI in the MVP: no LLM, model or RAG work appears in any MVP task. The
  suggestion engine is plain rules with a scenario suite (TASK-02-03-06-QA1).
- MVP discipline: no MVP epic, story or task depends on a Next or Later item.
- Personal data: none found. Seed content is limited to "public product facts
  only" (TASK-01-02-01-BE6).

**Checks that passed with nothing to report**

- Parents and IDs: every epic, story and task names its parent, and the IDs
  match across files. Retired IDs aren't reused.
- Circular dependencies: none among the declared task dependencies.
- New components: NC-16 SuggestionCard is justified. No other components were
  added since the last review.

---

## Blocker

### B1. Milestone 1 is about 422 hours against the spec's 300 to 340

- **Items:** S-02 "The MVP is built in milestones" ("roughly 300-340
  developer hours (about two-thirds of the five epics in full)"); `tasks.md`
  8.1, 9.2 Q1, R-22.
- **Problem:** The spec gives Milestone 1 a target. The plan is 80 to 120
  hours over it, plus about 148 design hours, and asks the Head of Product to
  choose. The plan defers exactly what S-02 lists (Journal filters, "Dial in
  from this", milk, puck prep, setup switching, catalog additions), and the
  result is still 86% of the five epics, not two-thirds. So S-02's defer list
  and its hour estimate disagree with each other. Some of what remains goes
  beyond what S-02 says Milestone 1 is ("start brewing, describe your setup,
  add a bag, log a shot, look back in the Journal"):
  - the profile and rename screen (15 h);
  - the shot edit mode (14 h);
  - the first-run checklist (12 h);
  - the part screen (8 h);
  - the section-shrink guard (3 h; see M5).

  The whole MVP (1,084 h) also still needs its size confirmed (previous m9).
- **Fix:** The Head of Product decides before approval. Either:
  - accept about 420 hours and update the S-02 bullet, so the plan and the
    spec agree and the re-forecast after Milestone 1 starts from the right
    baseline; or
  - apply the levers in 8.1. Profile, edit mode, checklist, part screen and
    the guard together come to about 52 h, which lands near 370 h.

  Either way, record the MVP size decision.
- **Owner:** Head of Product, then the tech-lead (8.1 tables) and the
  story-writer (if a story's Milestone 1 scope changes).

---

## Major

### M1. Milestone 1's declared dependencies leave Milestone 1

- **Items:** `tasks.md` 8.1 "Trims" versus these task headers:
  - TASK-01-01-01-BE5 depends on TASK-01-01-08-BE2 (deferred milk seeding).
  - TASK-01-03-01-BE1 depends on TASK-01-02-09-BE1 (deferred current-setup
    rule).
  - TASK-01-01-06-FE1 (Notice) depends on DES-01-05-03. That task is
    scheduled before wave 9, and no trim covers it.
  - TASK-02-06-01-FE1 and TASK-02-06-03-FE1 depend on TASK-01-05-04-FE1
    (ShotWarnings, wave 9).
  - TASK-02-06-02-BE1 depends on TASK-01-05-01-BE1, TASK-01-04-01-BE1 and
    TASK-01-03-07-BE1.
  - TASK-02-06-02-FE1 depends on TASK-01-05-02-FE2, 01-05-03-FE1,
    01-05-04-FE1 and 01-03-07-FE2.
  - TASK-03-01-03-QA1 depends on TASK-03-02-01-BE1. 8.1 moves this one, but
    the header still lists it.
- **Problem:** The trims say in prose what each task leaves out, but the
  dependency lines still point at wave 6 to 9 tasks. Anyone building or
  tracking from the headers (or from issues created later) will see 9 of the
  113 Milestone 1 tasks as blocked until after Milestone 1. The edit mode is
  the worst case: as written, both of its build tasks need EPIC-01-05 and
  milk.
- **Fix:** Split each trimmed task into a Milestone 1 part and a later
  extension with its own ID (for example TASK-02-06-02-BE2 for taste, milk
  and brew controls). Or mark each out-of-milestone dependency "(after
  Milestone 1)" and point it at the extension. Then confirm the 113-task set
  is closed under its dependencies.
- **Owner:** tech-lead.

### M2. Milestone 1 lets users make a second setup but defers the rule for which one is current

- **Items:** 8.1 trim "One setup" ("'Current setup' is the household's only
  setup"); STORY-01-02-04 AC 4 and AC 6 and TASK-01-02-04-* (in Milestone 1);
  STORY-01-02-09 and TASK-01-02-09-BE1 (deferred); TASK-01-03-01-FE2
  ("defaults from Brew's drink and coffee").
- **Problem:** The builder in Milestone 1 makes a new setup for any new
  combination, and the add-part flow allows a second basket. A household that
  adds one has two setups, and nothing in Milestone 1 defines which is
  current, what the Setup tab's "one setup Card" shows, or what the log
  defaults to. The log's other defaults are undefined too: in Milestone 1
  Brew has no drink or coffee selection (EPIC-02-02 is out), so STORY-01-03-01
  AC 1 has nothing to default from. Something Milestone 1 needs has been
  deferred.
- **Fix:** Choose one:
  - keep a minimal rule in Milestone 1: the newest setup is current, a slice
    of TASK-01-02-09-BE1 with no cookie; or
  - stop the builder from making a second setup until wave 6.

  Then state the Milestone 1 log defaults (for example the first visible
  drink and the earliest-opened open portion, else the newest unopened), and
  say which ACs TASK-01-03-01-QA1 skips.
- **Owner:** tech-lead (with a one-line note from the story-writer if a
  story's Milestone 1 behaviour changes).

### M3. The design schedule and the wave order disagree with the task dependencies

- **Items:** `tasks.md` 8.2 versus 8.3 and the task headers.
  - **Design tasks scheduled after the tasks that need them:**
    - DES-01-02-05 is slotted for wave 2, but TASK-01-01-05-FE1 (Icon) and
      FE2 (Sheet) need it in wave 1.
    - DES-02-02-04 (checklist) is slotted for wave 3, but TASK-01-01-07-FE1 is
      in wave 1.
    - DES-01-05-03 is slotted for wave 9, but TASK-01-01-06-FE1 is in wave 1.
    - DES-01-03-06 (milk) is slotted for wave 13, but TASK-01-03-07-FE1 and
      FE2 are in wave 8.
    - DES-03-01-04 (coffee screen) is slotted for wave 15, but the coffee
      screen is built in wave 14.
    - DES-04-01-* are slotted for wave 16, but maintenance is wave 15, the
      last wave.
    - DES-01-02-06 is said to be "used from wave 13 for switching", but
      switching is wave 11.
  - **Tasks waiting on a later wave:**
    - TASK-01-02-01-BE6 (wave 2) depends on TASK-03-01-01-BE2 (wave 3).
    - TASK-03-03-01-FE1 and TASK-03-04-01-FE2 (wave 10) depend on
      TASK-02-02-01-FE1 (wave 11).
    - TASK-03-04-01-QA1 (wave 10) depends on TASK-02-02-04-BE1 (wave 11).
- **Problem:** 8.2 seems to use an older wave numbering. As written, the
  designer and developers would each be waiting on the other in several
  waves, including Milestone 1's first wave. Previous finding M7 is only
  partly fixed.
- **Fix:**
  - Renumber 8.2 against 8.3.
  - Move DES-01-02-05, DES-02-02-04 and DES-01-05-03 (or the parts the
    wave-1 components need) ahead of wave 1. This adds them to the Milestone
    1 design total.
  - Move TASK-03-01-01-BE2 into wave 2, or BE6 into wave 3.
  - Either move the Brew parts of the wave-10 clock and remaining tasks to
    wave 11, or move Brew's wiring earlier.
- **Owner:** tech-lead (schedule), designer (confirm the moved design tasks).

### M4. Unknown basket dose range: stories say never suggest dose, the design says suggest it with no bound

- **Items:**
  - Stories: STORY-01-06-08 AC 5 and STORY-02-03-06 AC 6 ("dose is never
    suggested").
  - Epics: EPIC-02-03 risks ("skips that lever").
  - Design: EPIC-01-06 "not sure" table (line 1024, "Dose suggestions skip
    the basket bound and say so", `suggest.noBasketRange`), the EPIC-02-03
    lever table ("no bound, and the reason says so") and the round 6
    addendum.
  - Tasks: TASK-02-03-06-BE2 (follows the stories) and 9.2 Q3.
- **Problem:** Two approved documents disagree on what the user sees. If the
  stories win, the design's `suggest.noBasketRange` copy and part of
  DES-01-06-05 describe behaviour that never happens. If the design wins, an
  unbounded dose suggestion breaks S-02 ("dose ... within the basket's dose
  range"). It also breaks the safety idea behind S-09's eval ("Is the
  physical advice possible? (Dose/basket ratios)").
- **Fix:** Adopt the stories' rule: never suggest dose without a range, and
  move on to the next lever. It's safer and matches S-02. The designer then
  amends design line 1024, the lever table and the addendum. If a reason line
  is wanted, reword `suggest.noBasketRange` to say why dose isn't suggested,
  and add it to STORY-02-03-05 or 02-03-06.
- **Owner:** Head of Product (confirm), then the designer.

### M5. TASK-01-01-05-FE8 has no defining story and overlaps its QA task

- **Items:** TASK-01-01-05-FE8 ("the four sections never shrink or
  truncate"); STORY-01-01-05 AC 1 and AC 2; TASK-01-01-05-QA1; `tasks.md`
  "What drove the changes" 13 and 9.2 Q2 (Q-T1).
- **Problem:** No story, design item or spec line asks for a "guard against
  sections shrinking". The tech lead has guessed what it means: labels
  untruncated at 320 px in a long locale and RTL, at least 44 px tall, and
  never-blank tabs. FE8 cites AC 1 and AC 2, which are about reaching each
  tab and never seeing a blank screen, not about truncation. QA1 already
  tests the 44 px height and the interim states, and it depends on FE8, so
  an undefined requirement gates Milestone 1's navigation QA.
- **Fix:** The Head of Product answers Q-T1. If it means the tech lead's
  reading, the story-writer adds a criterion to STORY-01-01-05 (labels never
  truncate at 320 px, in any supported locale or direction), and FE8's
  never-blank check is folded into QA1. If it means something else, or
  nothing, rewrite or retire FE8 and drop QA1's dependency on it.
- **Owner:** Head of Product, then the story-writer and the tech-lead.

### M6. Two open technical questions gate wave 1, despite "none blocks Milestone 1's first wave"

- **Items:** `tasks.md` 9.1 "Still open. None of these blocks Milestone 1's
  first wave".
  - TASK-01-01-04-QA1 (the first item in wave 1) depends on TQ-09.
  - TASK-01-01-02-QA1 (wave 1) and TASK-01-03-05-QA1 (wave 4) depend on
    TQ-08.
  - TASK-01-02-01-BE3 and BE6 depend on TQ-10, which is only partly
    answered.
- **Problem:** The claim is wrong. Both questions have proposals, but they
  aren't adopted, so the test harness and the locale tests in Milestone 1
  are formally blocked.
- **Fix:** The Head of Product or tech lead adopts the TQ-08 proposal
  (test-only messages and `de-DE` formatting) and the TQ-09 proposal (Node
  plus play tests, no end-to-end suite) as working assumptions. Then correct
  the 9.1 sentence.
- **Owner:** tech-lead (with the Head of Product's nod).

### M7. The temperature rule needs grind periods, but maintenance is built last

- **Items:** STORY-02-03-06 notes ("Grind suggestions use shots in the
  current grind period"); R-17 (temperature needs "the previous shot in the
  same grind period"); TASK-02-03-06-BE2 (wave 12; no dependency on
  TASK-04-01-03-BE1); TASK-04-01-03-BE1 (wave 15); epics build order
  (EPIC-04-01 is 8th, "early so grind periods are right from the first
  shots").
- **Problem:**
  - The suggestion engine depends on grind periods that don't exist until
    three waves later, and the dependency isn't declared.
  - The task plan moves maintenance from 8th to last without saying why,
    against the epics' stated reason for putting it early.
- **Fix:** Either:
  - declare TASK-04-01-03-BE1 as a dependency of TASK-02-03-06-BE2 (and
    TASK-02-03-06-BE1) and move EPIC-04-01's backend ahead of wave 12; or
  - state that until wave 15, "same grind period" means "same grinder since
    the beginning", and add a scenario for it once periods land.

  Note the change from the epic order in 8.3.
- **Owner:** tech-lead.

---

## Minor

### m1. Milestone 1 QA tasks don't say which criteria they skip

TASK-01-03-01-QA1 (AC 1 defaults from Brew), TASK-01-02-01-QA1 (AC 6:
private entries, which can't exist until wave 7), TASK-02-06-01-QA1
(reaction and warning markers), TASK-01-01-07-QA1 (AC 5) and TASK-02-06-02-QA1
(taste, milk and remaining coffee) all cite their full criteria. Only
TASK-03-01-03-QA1 and the edit mode say what's trimmed. **Fix:** list the
deferred criteria per QA task in 8.1, and add the re-test to the wave that
completes them. **Owner:** tech-lead.

### m2. Leftover "open" questions that are now answered

- `stories.md` "Most pressing" items 1 to 6 (SQ-19, SQ-21, milk amounts,
  SQ-20, DQ-28, SQ-14) are answered in the status block but still listed as
  open.
- The notes on STORY-01-01-02, 01-06-01 ("no flow yet", SQ-20) and 02-03-06
  ("working assumptions", SQ-19, SQ-21) are out of date.
- In `epics.md`:
  - EPIC-01-01 still says typical milk amounts aren't in the spec (S-02 now
    gives them);
  - EPIC-02-03 still says step sizes aren't defined;
  - EPIC-02-06 still calls the one-tap rating question open (DQ-23 settles
    it).
- `initiatives.md` INIT-01 Q3 (required sensory fields) is still open there,
  though S-02 closes it.

**Fix:** mark each closed with its answer. **Owners:** story-writer,
epic-planner, strategist.

### m3. Initiative scope predates S-02

INIT-01's scope still says:

- "sensory scores 1-5, overall rating, defects";
- "Setups grouping owned units, e.g. machine, grinder, basket, accessories";
- "Shots record the grinder and machine units directly".

INIT-02's scope also has "units recorded directly". All of these contradict
S-02 and S-08. Rule-based suggestions in the MVP don't appear in any
initiative's scope. **Fix:** a light revision note in `initiatives.md`, as
was done for its questions. **Owner:** strategist.

### m4. The design still counts 15 MVP epics and gives EPIC-03-06 no section of its own

The design's "How to read" says 15 MVP epics with full flows. EPIC-03-06 is
designed inside EPIC-03-01 (DES-03-01-04), and SCR-COFFEE's epic column says
"03-01". Section 4's headings still use old titles ("See your recent
shots", "Add a bag to your pantry", "Record maintenance on your setup").
**Fix:** update the count, the SCR-COFFEE row (03-06) and the headings, or
note the mapping. **Owner:** designer.

### m5. The freshness thresholds are numbers that nobody has approved

DQ-24 (under 5 days "very fresh", over 35 days since roast or 21 days open
"past its peak") drives STORY-02-03-05 AC 4 and TASK-02-03-05-BE1. Unlike the
step sizes, the Head of Product never confirmed it. **Fix:** confirm DQ-24,
or mark it as a tuneable constant to be reviewed with the scenario table
(R-16). **Owner:** Head of Product.

### m6. The design's basket dose-range chips leave gaps

The addendum offers 14–16 g, 17–19 g and 20–22 g. A basket made for 16 to
20 g (the example in STORY-01-02-02 AC 3 and STORY-02-03-06 AC 4) fits none
of them and needs "other". **Fix:** check the chips against the seed's real
ranges, or present them as typical sizes rather than ranges. **Owner:**
designer.

### m7. The seed loader and seed content are described as depending on each other

TASK-01-02-01-BE6 depends on BE3. The trim says "BE3 loads the seed from
BE6's content", while BE3 says it uses "placeholder content until TQ-10".
The order works (BE3 first, with placeholders), but the trim wording reads
like a loop. **Fix:** reword the trim. **Owner:** tech-lead.

### m8. A rules-engine task depends on a frontend task

TASK-02-03-05-BE1 (`src/domain/suggest/`, pure TypeScript) depends on
TASK-01-06-08-FE1 (the shot log's "not sure" fallbacks in EPIC-01-06). That
ties the MVP suggestions to the catalog-additions track, which 8.3 says
"can run in parallel". **Fix:** move the fallback constants (DQ-11) into a
domain module that both depend on. **Owner:** tech-lead.

### m9. Small items of design-originated scope remain in the MVP

These have no basis in the spec, are small, and were approved through the
design rather than the spec:

- the first-run checklist (STORY-01-01-07, 3 points, in Milestone 1);
- 90-day setup grouping (STORY-01-02-09 AC 4);
- the 30-minute reset of an unpulled change (STORY-02-02-06 AC 6);
- "add a bag of this" (STORY-03-06-04).

Each is already a listed lever or cut candidate. **Fix:** none needed unless
cuts are wanted under B1. **Owner:** Head of Product.

---

## Open questions checked and not flagged

These are open, but each has a working assumption, so none blocks the MVP:

- INIT-02 Q1 (pin updates the override or the default): blocks only
  EPIC-02-04, which is Next.
- Entry mode of an edited one-tap shot: it stays one-tap (9.2 Q4).
- DQ-10 "add anyway": off, behind a flag.
- DQ-11 fallback ranges: kept in one constants object.
- TQ-11 to TQ-17: each has a proposal and low or contained impact.
- SQ-04, 05, 09, 11, 12, 15 and 16: they don't affect MVP code paths, or
  they have a stated default.
- 9.2 Q5 (interim Brew in Milestone 1) and Q6 (milk bootstrap): reasonable
  for a prototype. Confirm alongside B1.
