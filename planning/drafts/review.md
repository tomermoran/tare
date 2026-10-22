# Tare planning review

Reviewer: principal product manager (quality gate), for the Head of Product.
Inputs: `docs/spec.md` (S-01 to S-09), `planning/drafts/initiatives.md`
(approved), `epics.md` (final, revision 5), `design.md` (approved),
`stories.md` (approved, revision 2) and `tasks.md` (approved, MVP only).
No drafts were edited and no GitHub issues were created.

## Verdict

**Needs fixes.** 1 Blocker, 7 Major, 10 Minor.

The plan is in good shape. IDs trace cleanly from initiative to task, every
MVP story has tasks and a QA task, the totals add up, and no personal data
appears anywhere. One MVP task has no number to build with and no working
assumption: the best-before age estimate (INIT-03 Q2). Fix that before build
starts. The Majors are rule gaps the build would otherwise settle by accident.

## Coverage summary

**Spec sections to stories**

| Section | Stories that cite it | Status |
|---|---|---|
| S-01 Updates | STORY-01-01-05, 01-01-06, 01-05-04, 04-01-02 (MVP); 04-02-01, 04-02-04 (Next) | Covered |
| S-02 Data model decisions | Most MVP and Next stories | Covered |
| S-03 Vision and UVP | None directly. Later stories under EPIC-06-02 and 06-06 inherit it from their epics | Covered only through epics (see m2) |
| S-04 Ontology | Many MVP stories (01-01, 01-02, 03-01, 03-02, 04-01) | Covered |
| S-05 Algorithms and data trust | None directly. Later stories under EPIC-06-05 and 06-06 inherit it | Covered only through epics (see m2) |
| S-06 UX philosophy | STORY-01-01-05 to 07, 01-03-02, 01-05-01, 02-02-01 to 06, 02-03-* | Covered |
| S-07 Privacy and i18n | STORY-01-01-02, 01-01-03, 01-03-05 (consent in Later EPIC-06-05) | Covered |
| S-08 Schema | Most stories; TASK schema section 6 matches S-08 | Covered |
| S-09 GenAI prompts | STORY-01-05-03, 01-06-02 (plus Later EPIC-06-01 and 06-02 stories) | Covered |

No spec section is left without stories. S-03 and S-05 reach stories only
through their parent epics, because Later stories carry no source sections.

**Down the chain**

- 6 initiatives, then 30 epics (15 MVP, 8 Next, 7 Later), then 119 stories
  (69 MVP, 27 Next, 23 Later), then 252 MVP tasks (851 h). The summary
  tables in `stories.md` and `tasks.md` re-add correctly: 177 MVP points, and
  per-epic task counts and hours sum to 252 and 851.
- **MVP fully broken down:** all 69 MVP stories have tasks, and every one has
  at least one `qa` task (spot-checked story by story against section 7).
  Next and Later are deliberately not broken down, as `tasks.md` section 1
  says; this is not a gap.
- **Design:** 15 MVP epics have full flows with loading, empty and error
  states, and all 55 DES task IDs referenced by tasks exist.
- **Personal data:** none found. People are described by role throughout,
  and fixtures and seeds are required to be generic. Product names in the
  spec (Bambino, Niche Zero, Sage/Breville) are brands, not people.

**Checks that passed with nothing to report**

- Traceability of parents: every epic, story and task names its parent, and
  task IDs follow their story IDs.
- Circular dependencies: none in the declared task dependencies. A few
  dependencies are implied by the text but not declared (m5).
- Nothing in the MVP depends on a Next or Later item.
- New components (NC-01 to NC-15) are each justified against the Phase 0 set.
  The `signal` rule is enforced in the Notice API and by a grep test.

---

## Blocker

### B1. Estimated bean age has no number and no working assumption (INIT-03 Q2)

- **Items:** STORY-03-03-01 AC 2 (MVP), TASK-03-03-01-BE1, `tasks.md` 9.2
  question 2, design EPIC-03-03 ("about day 12").
- **Problem:** A bag with only a best-before date must show an estimated age,
  but the gap from roast to best-before is undefined. The story notes say
  "still open" with no working assumption. That breaks the pattern every
  other open MVP question follows (DQ-02 to DQ-17 all carry one). The task
  defines `ASSUMED_ROAST_TO_BEST_BEFORE_DAYS` with no value, and
  `tasks.md` itself says this "blocks TASK-03-03-01-BE1". The open question
  has been carried since the initiatives without being answered.
- **Fix:** The Head of Product sets a number, or approves a proposed working
  assumption, recorded in STORY-03-03-01's notes like the DQ assumptions.
  TASK-03-03-01-BE1 then drops the `INIT-03 Q2` dependency and uses the
  value. If no number is wanted, change AC 2 so a best-before-only bag shows
  age as unknown (the existing `portion.ageUnknown` path) and drop the
  estimated kind.
- **Owner of the fix:** story-writer (add the working assumption to
  STORY-03-03-01). The tech-lead then updates TASK-03-03-01-BE1.

---

## Major

### M1. Can a one-tap shot get ratings, scores and defects? The story and tasks disagree

- **Items:** STORY-02-06-02 AC 1 ("any recent shot, including a one-tap
  shot ... taste ... can change any of them"), TASK-01-05-01-BE1
  (`saveTasting`: "the shot must be owned and measured"),
  TASK-02-06-02-BE1 (`updateShot` with `taste?`, depends on
  TASK-01-05-01-BE1), TASK-02-06-02-FE1 (edit mode always shows the tasting
  controls), design SCR-SHOT (one-tap shows only reaction chips).
- **Problem:** If `updateShot` reuses `saveTasting`'s rule, editing a one-tap
  shot's taste fails and STORY-02-06-02 AC 1 fails for one-tap shots. If it
  doesn't, one-tap shots gain scores and defects (and possibly the
  channelling warning), which S-02 and the "one-tap uses reactions" rule
  don't expect. The QA (TASK-02-06-02-QA1) tests neither.
- **Fix:** Decide whether one-tap shots can carry taste. Then make
  STORY-02-06-02 AC 1 say so explicitly, hide or show the taste controls in
  edit mode for one-tap shots (TASK-02-06-02-FE1), state the rule in
  TASK-02-06-02-BE1, and add a QA case. Pairs with the open
  edited-one-tap entry-mode question (`tasks.md` 9.2 Q4).
- **Owner:** story-writer, then tech-lead.

### M2. Leaving the tasting screen: saved or discarded?

- **Items:** STORY-01-05-01 AC 3 ("when I finish or leave the screen in any
  way, then my choices are saved"), design EPIC-01-05 states ("Leave by tab
  or back: treated as Done without changes"), TASK-01-05-01-FE3 (its Build
  says leaving "counts as Done without changes"; its Done when says "Done and
  leave both save the choices"), TASK-01-05-01-QA1 (no leave-path test).
- **Problem:** Three documents give two answers, and one task contradicts
  itself. The design also mentions leaving "by tab", but SCR-TASTE is a
  full-screen task with no tab bar (design 2.1).
- **Fix:** Pick one rule (the story's "leave saves" fits "tasting is
  optional, never lost"). Align the design's state row and TASK-01-05-01-FE3,
  remove the tab reference, and add a leave-path case to TASK-01-05-01-QA1.
- **Owner:** designer for the state rule, then tech-lead.

### M3. Retired units are not guarded in the MVP shot paths

- **Items:** STORY-01-02-03 AC 5, STORY-02-01-05, TASK-02-01-05-BE1
  ("handled per the open question"), TASK-01-03-01-BE1, TASK-01-03-03-BE2,
  TASK-02-02-02-BE1, `tasks.md` 9.2 Q3.
- **Problem:** A retired unit stays in its toolkit's components. Without a
  rule, both a one-tap pull and a measured save copy the toolkit's current
  (retired) grinder or machine into a new shot. `getLogContext` can also
  default to a toolkit flagged `needsGrinder`. The tech lead already has a
  proposal (treat a retired unit as "not in the toolkit"), but it isn't
  adopted as the working assumption, so TASK-02-01-05-BE1 has no defined
  behaviour.
- **Fix:** Adopt the proposal as the working assumption in STORY-02-01-05 and
  TASK-02-01-05-BE1. Make `saveMeasuredShot` and the log context refuse or
  flag a toolkit whose only machine or grinder is retired. Add QA cases.
- **Owner:** tech-lead (with a one-line story note from the story-writer).

### M4. Acceptance criteria assume you can correct a portion's dates, but nothing builds it

- **Items:** STORY-03-03-03 AC 4 ("I later correct a portion's freeze or
  thaw date"); also the phrasing of STORY-03-02-04 AC 5 and STORY-03-04-03
  AC 4; design SH-PORTION-ACTIONS; TASK-03-02-02-BE1 (`allowedActions` has
  no edit action); TASK-03-03-03-QA1 (tests it by changing data, not through
  the product).
- **Problem:** Freeze, thaw, open and finish each set a date once. No design
  flow, story scope or task lets a user correct an existing date, so AC 4
  can't be met by a user, and the over-logged or wrong-age states have no
  remedy beyond weighing. (SQ-15 covers reopening a finished portion, not
  this.)
- **Fix:** Either reword the ACs to "when a portion's dates are set" (what
  is actually built), or add a small "edit date" action to
  SH-PORTION-ACTIONS with a design note and a task. The first is cheaper and
  keeps the MVP tight.
- **Owner:** story-writer (reword), or designer plus tech-lead (add the
  action).

### M5. "Open portion" isn't defined for a portion that was opened and then frozen

- **Items:** S-02 one-tap rule, STORY-02-02-02 AC 3, STORY-02-02-03,
  TASK-02-02-02-BE1 ("earliest-opened open portion"), `pantryOrder.ts`
  (TASK-03-01-04-BE1), DQ-03 home default, design SH-PORTION-ACTIONS (counter
  portions can be frozen).
- **Problem:** Freezing an opened half is a normal flow (counter, then
  freeze). Such a portion keeps `opened_at` and has no `finished_at`. A rule
  built on "opened and not finished" would pick a portion that is in the
  freezer, record one-tap shots against it, and skip the "which bag?" sheet
  the design intends. `portionState` says `frozen`, but the pull rule isn't
  tied to it.
- **Fix:** Define "open" for the one-tap, home and pantry-order rules as
  state `counter` (or opened and thawed), never `frozen`. State it in
  TASK-02-02-02-BE1 and `pantryOrder`, and add an opened-then-frozen fixture
  to TASK-02-02-02-QA1 and TASK-03-01-04-QA1.
- **Owner:** tech-lead.

### M6. The iOS storage-eviction risk needs a decision, not just a note

- **Items:** `tasks.md` R-02, EPIC-01-01 accepted risk, S-02 ("a lost or
  reset device loses its data"), EPIC-05-03 (Next).
- **Problem:** S-02 accepts data loss from a *lost or reset* device. R-02
  adds a different and likelier failure: Safari can evict the IndexedDB
  Firebase user after inactivity, so a normal user may silently get a new,
  empty household. The tech lead says "needs a decision" and no one has made
  it. For a prototype shown on iPhones this is the most likely way to lose
  data.
- **Fix:** The Head of Product either explicitly widens the accepted risk to
  cover eviction, or brings EPIC-05-03 (Google linking, S) into the MVP or
  right behind it. Record the answer in S-02 or as an epic note.
- **Owner:** epic-planner (priority of EPIC-05-03), on the Head of Product's
  call.

### M7. Design tasks gate the build but aren't scheduled or estimated

- **Items:** `tasks.md` section 8 wave 0 ("the DES-* tasks named in each task
  are delivered"), design section 9 (55 MVP DES tasks), the critical-path
  statement (waves 1 to 12).
- **Problem:** Most frontend tasks depend on one or more DES tasks, but
  those have no estimates, owner capacity or order. The 851 h and the stated
  critical path assume design is already done. Only a few are "likely
  covered by PR #3".
- **Fix:** Give the DES tasks rough sizes and slot them ahead of the waves
  that need them (for example DES-01-01-* before wave 2, DES-01-02-* before
  wave 3). Mark the ones PR #3 already delivers as done.
- **Owner:** designer (sizes), tech-lead (schedule).

---

## Minor

### m1. Resolved questions are still listed as open

- X-1 (timestamp precision) was closed by TQ-04 (S-02), but it's still open
  in EPIC-01-01 and EPIC-01-03, in STORY-01-01-01, 01-03-03, 03-01-02 and
  03-03-03, and as "most pressing" item 6 in `stories.md`.
- The EPIC-04-01 recalibration question is closed by TQ-05.
- `initiatives.md` still asks questions S-02 has answered (Google sign-in,
  drink context, maintenance in the MVP, timestamp precision). Its scope
  also predates the catalog epic, EPIC-04-01 moving to MVP, and Google
  linking under INIT-05.
- **Fix:** mark them closed with the deciding ID in each file.
- **Owners:** strategist, epic-planner and story-writer, each for their
  own file.

### m2. Later stories have no source sections

All 23 Later stories omit "Source sections", so S-03 and S-05 reach stories
only through epics. **Fix:** add a source line to each, even in the light
format. **Owner:** story-writer.

### m3. The design still lists "ran fast" as a signal use

Design 1.1 names "ran fast" as a shot warning, but PEC-04 and DQ-09 keep it
out of the MVP. **Fix:** say that only channelling uses signal in the MVP.
**Owner:** designer.

### m4. The empty pantry may show two primary buttons

SCR-PANTRY puts the primary `pantry.addBag` in the header, and its
EmptyState also has a primary `pantry.addBag`. That breaks the
one-primary-per-view rule. **Fix:** make the header action secondary, or hide
it when empty. **Owner:** designer.

### m5. Some dependencies are implied by the text but not declared

- TASK-01-06-01-BE2 reruns the duplicate check from TASK-01-06-04-BE1, which
  is built later.
- TASK-02-01-04-BE1 returns `needsRedial` from TASK-02-01-05-BE1, which comes
  after it in wave 10.
- TASK-01-02-06-BE1 and TASK-01-02-07-BE1 refer to each other.
- TASK-01-02-07-BE1 needs "current recipe per key" (wave 3), but
  TASK-02-01-01-BE2 owns that resolution (wave 10).
- TASK-01-02-01-BE1 says its tests run "once TASK-01-01-04-QA1 lands", but
  that task comes earlier.

**Fix:** declare the dependencies, or say which task adds the behaviour
later. **Owner:** tech-lead.

### m6. Dial-in from a recipe with no open portion is undefined

STORY-02-03-03 and TASK-02-03-03-FE1 use the one-tap portion rule. Neither
says what happens when the bean has no open portion, or none left (the pull
has SH-PORTION for this). **Fix:** add an AC that reuses the missing-coffee
path or SH-PORTION. **Owner:** story-writer.

### m7. Some acceptance criteria can't be tested

- These criteria depend on "as the Head of Product decides": STORY-02-04-01
  AC 1, STORY-05-01-02 AC 2 and STORY-05-02-02 AC 2. The first two are Next
  stories, which are meant to be full.
- The Later eval stories are written for the home enthusiast (SQ-13), which
  isn't real user value under INVEST.

**Fix:** turn them into explicit placeholders or decide them when re-planned.
**Owner:** story-writer.

### m8. A small piece of scope isn't in the spec

STORY-01-01-05 AC 5 and TASK-01-01-05-FE6 reopen the app on the last tab
within 5 minutes. That comes from the design, not the spec. It's small
(2 h), but it's unrequested scope. **Fix:** keep it if the Head of Product
wants it, otherwise cut it. **Owner:** story-writer.

### m9. The MVP is no longer small

The MVP is 177 points, 851 h, about 106 developer-days for a "basic app"
(S-01). It grew 39 points from approved additions. The stories file already
names cut candidates (STORY-01-06-09, 02-01-02, 01-01-03). The EPIC-01-06
split (stories 01 to 05 first) is the biggest lever. **Fix:** the Head of
Product confirms the size or picks cuts. **Owner:** epic-planner.

### m10. The recipe-resolution owner differs between stories and tasks

STORY-02-01-04's notes call it the single "which recipe applies now" place,
but the resolver is TASK-02-01-01-BE2 under STORY-02-01-01. **Fix:** align
the note. **Owner:** story-writer.

---

## Open questions checked and not flagged

These are open, but each has a working assumption, so none blocks the MVP:

- DQ-08: only `channelling` ships.
- SQ-14: both doses count, and the test name records it.
- Entry mode of an edited one-tap shot: it stays one-tap.
- DQ-10: the "add anyway" flag is off.
- DQ-11: the fallback ranges live in one constants object.
- TQ-08 to TQ-15: each has a proposal.
- SQ-16: ownership only; it doesn't affect the code.
- INIT-02 Q1: blocks only EPIC-02-04, which is Next.
