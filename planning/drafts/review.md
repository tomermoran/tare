# Tare planning review (round 3)

Reviewer: principal product manager (quality gate), for the Head of Product.
Inputs: `docs/spec.md` (S-02 Milestone 1 bullet now says about 370 h),
`planning/drafts/initiatives.md`, `epics.md` (revision 10), `stories.md`
(revision 4), `design.md` (through the Round 7 addendum) and `tasks.md`
(revision 3). The round 2 review is in git history. No drafts were edited and
no GitHub issues were created.

## Verdict

**Needs fixes.** 0 Blockers, 4 Major, 9 Minor.

Revision 3 fixes what blocked approval. Milestone 1 is 99 tasks and 368 h,
against S-02's roughly 370 h. The spec, the design and the tasks now agree on
dose: it is never suggested without a basket range. The grind-period ordering
is fixed and declared. Milestone 1 is nearly self-contained. What's left is
small but real:

- the shot detail in Milestone 1 still has buttons for features that don't
  exist yet (N1);
- the second-setup rule still has a hole, and it goes against S-02's "one
  setup" (N2);
- wave 11 is about 198 h, not "about 130 h" (N3);
- the design's dose-range link has no story or task (N4).

None of these needs a Head of Product decision except N2 (Q3).

## Previous findings: status

| Finding | Status | Evidence / leftover |
|---|---|---|
| B1 Milestone 1 size | **Resolved** | S-02 says about 370 h; 8.1 has 99 tasks and 368 h; the deferred list matches S-02. The full MVP (1,082 h) is re-forecast after Milestone 1, as S-02 says. |
| M1 Dependencies leave Milestone 1 | **Mostly resolved** | TASK-01-01-01-BE5, 01-03-01-BE1, 02-06-01-FE1, 02-06-03-FE1 and 03-01-03-QA1 are fixed, and the edit mode is fully deferred. Leftover: undeclared links from the shot detail to edit, pin and "dial in from this" (N1), and a stale reference in TASK-01-02-04-BE1 (m3). |
| M2 Second setup, log defaults | **Partly resolved** | Log defaults are now defined (TASK-01-03-01-BE1). The current-setup rule still breaks on reuse (N2). |
| M3 Design schedule and wave order | **Mostly resolved** | 8.2 uses 8.3's wave numbers; every listed inversion is fixed. New: TASK-02-01-06-FE2 and QA1 (wave 11) need TASK-02-03-03-FE1 (wave 12) (m1). |
| M4 Unknown dose range | **Resolved** | Design line 1024, round 6 amended, Round 7 addendum, TASK-02-03-06-BE2 and TASK-01-06-08-BE1 all agree. Leftover: the quiet link (N4). |
| M5 TASK-01-01-05-FE8 | **Resolved (retired)** | Leftover: a design criterion it covered is now untested (m4). |
| M6 TQ-08 and TQ-09 | **Resolved** | Adopted in 9.1; headers say "(assumed)". |
| M7 Grind periods | **Resolved** | TASK-04-01-01-BE2 and 04-01-03-BE1 are in wave 10; TASK-02-03-06-BE1 and BE2 declare them. R-17's wording is reversed (m3). |
| m1 QA skips | **Mostly resolved** | 8.1 has a skip table. Leftovers in m2. |
| m2 Stale open questions | **Not resolved** | `stories.md` lines 1019, 1717, 3553-3608 (SQ-19/20/21 still open); epics and INIT-01 Q3 as before. |
| m3 Initiative scope | **Not resolved** | `initiatives.md` lines 49-50 and 100. |
| m4 Design epic count and headings | **Partly resolved** | The count is fixed to 16. The headings (lines 1388, 1514, 1788) and the SCR-COFFEE row (line 188, "03-01") are unchanged. |
| m5 DQ-24 | **Not resolved** | Still unconfirmed (9.2 Q8; design marks it as waiting). |
| m6 Dose-range chips | **Partly resolved** | Ranges outside 14-22 g are explained. The story example, 16-20 g, sits inside that span and still fits no chip. |
| m7 Seed loader wording | **Resolved** | 8.1 "Seed loader and content". |
| m8 Rules engine on a frontend task | **Resolved** | TASK-01-06-08-BE1 is a pure domain module; TASK-02-03-05-BE1 depends on it. A stale reference remains in TASK-01-03-02-FE2 (m3). |
| m9 Design-originated scope | **Unchanged, smaller** | The checklist is no longer in Milestone 1. Nothing else to do unless cuts are wanted. |

## Coverage summary

- **Spec to stories:** unchanged since round 2. Every section from S-01 to
  S-09 is covered by at least one story. Nothing new is uncovered.
- **Totals check out:**
  - the MVP: 315 tasks and 1,082 h, which is revision 2 plus 3 added tasks,
    minus 1 retired, with the changed estimates (-2 h);
  - Milestone 1: 99 tasks and 368 h, which is the five epics' 136 tasks and
    490 h, minus 41 deferred tasks (134 h), plus 4 pulled in (12 h);
  - the deferred table: 41 tasks, 134 h;
  - design: 144 h for Milestone 1 and 328 h for the MVP, matching design
    section 9's per-task hours.
- **Milestone 1 closure:** I checked the dependency lines of all 99 tasks.
  Each depends only on Milestone 1 tasks, PR-3, the Head of Product's
  prerequisites, or design tasks scheduled before wave 5. The exception is
  the shot detail's undeclared action targets (N1).
- **New tasks:**
  - TASK-02-06-01-FE2 and TASK-02-06-03-FE3 (2 h each): well sized, with
    clear "done when", parent and dependencies (TASK-01-05-04-FE1, wave 9).
  - TASK-01-06-08-BE1 (2 h): a sound domain module whose only dependencies
    are wave 1 schema and DQ-11.
- **No AI in the MVP**, nothing in the MVP depends on Next or Later work, no
  circular dependencies, no personal data. Every MVP story still has a QA
  task.
- **Wave placement asked about:**
  - **Part screen in wave 6: sound.** FE5 and FE6 depend only on Milestone 1
    work. Wave 6 comes before their consumers (wave 7's answer-later flow and
    TASK-01-06-08-FE2 in wave 8), and DES-01-02-03 is delivered in wave 2.
  - **Checklist in wave 11: sound.** TASK-02-02-01-FE1 (Brew) depends on
    TASK-01-01-07-FE2, so the checklist has to land just before Brew, and
    DES-02-02-04 is scheduled ahead of it.
  - **Profile in wave 11: not well placed.** Nothing in its dependencies ties
    it there. It only adds the persona label to a Brew screen that wave 11
    rebuilds, and that link isn't declared (part of N3).
  - **Wave 11 is too big:** see N3.

---

## Major

### N1. The Milestone 1 shot detail has actions for features that come later

- **Items:**
  - TASK-02-06-03-FE1 still builds `recipe.pin` as the primary action, plus
    `shot.dialInFromThis` and edit.
  - TASK-02-06-03-FE2: "edit opens `/log?mode=edit`; pin opens PinSheet".
    Done when: "Edit is at most two taps from the Journal tab".
  - 8.1 trims "No tasting", which removes only the pin action.
- **Problem:** In Milestone 1 the edit mode doesn't exist until wave 9,
  PinSheet until wave 11 (EPIC-02-01) and "dial in from this" until wave 13.
  As written, the shot detail ships three buttons that lead nowhere. That
  breaks the shell rule "no tab is blank or has a dead action" (design
  EPIC-01-01, TASK-01-01-05-FE3 AC 2). FE2's "done when" can't be met in
  Milestone 1, and its link to PinSheet isn't declared. This is the last
  real gap in "Milestone 1 stays inside itself".
- **Fix:**
  - Add a trim: in Milestone 1 the detail is read-only, with no actions.
  - Move wiring each action into the task that delivers its target, with a
    declared dependency: edit with TASK-02-06-02-FE1, pin with the EPIC-02-01
    PinSheet task, and dial in with TASK-02-06-06-FE1.
  - Add FE2's edit criterion to the 8.1 skip table.
- **Owner:** tech-lead.

### N2. Newest-is-current breaks when an existing setup is reused, and S-02 says "one setup"

- **Items:**
  - 8.1 trim "One setup, newest is current".
  - TASK-01-02-04-BE1: "then makes it current (TASK-01-02-09-BE1)"; done when
    "it becomes current (AC 6)".
  - TASK-01-02-04-FE2 (AC 6) and TASK-01-02-04-QA1 (AC 1 to AC 6, no skip).
  - R-24; 9.2 Q3; S-02: "describe your setup (one setup, from a seeded
    catalog)".
- **Problem:** `findOrCreateSetup` reuses an existing setup for a known
  combination, and a reused setup isn't the newest. So in Milestone 1:
  - a user who makes a second setup and then builds the original combination
    again gets "use this", but the newer setup stays current;
  - AC 6 of STORY-01-02-04 fails, and nothing marks it as skipped;
  - R-24's "can't be switched back" understates this: not even by rebuilding
    the combination.

  The plan also never says where a second setup can be started in
  Milestone 1. Change-a-part is deferred, and Setup rows aren't tappable. And
  S-02 asks for one setup.
- **Fix:** Take 9.2 Q3's alternative: in Milestone 1 the builder resolves
  only when the household has no setup, so it matches S-02 and R-24 goes
  away. Then add AC 6's reuse case to the skip table, re-tested in wave 6, and
  drop the stale TASK-01-02-09-BE1 reference from TASK-01-02-04-BE1. If the
  Head of Product prefers to keep second setups, make the rule "the most
  recently resolved setup", which needs a timestamp or the cookie, and list
  the Milestone 1 entry points to the builder.
- **Owner:** Head of Product (Q3), then the tech-lead.

### N3. Wave 11 is about 198 hours, not "about 130 h or more"

- **Items:** 8.3 wave 11; R-25.
- **Problem:** Adding the tasks listed in wave 11 from their headers:

  | Part | Hours |
  |---|---|
  | EPIC-02-01 except TASK-02-01-01-BE1 | 58 |
  | EPIC-02-02 | 83 |
  | First-run checklist | 12 |
  | Profile | 13 |
  | Clock and remaining-coffee UI | 32 |
  | **Total** | **about 198, 58 tasks** |

  That is 28% of the 714 post-Milestone 1 hours in one wave, more than half
  of Milestone 1. It also hides two inversions:
  - TASK-02-01-06-FE2 and QA1 need wave 12 (m1);
  - the profile's Brew label needs TASK-02-02-01-FE1, which isn't declared.

  The re-forecast after Milestone 1 will be measured against waves like this
  one, so its size should be stated correctly.
- **Fix:**
  - Correct R-25 and the 8.3 note.
  - Split wave 11, for example:
    - 11a: recipes, then the checklist, then Brew defaults and Brew;
    - 11b: pull, choosing, setup switching and the closest setup.
  - Move the clock and remaining-coffee UI (32 h) to run beside wave 12. The
    engine needs only the clock backends.
  - Move the profile to wave 6 (no dependency stops it) and have
    TASK-02-02-01-FE1 keep the persona label. Or leave it after Brew and
    declare TASK-02-02-01-FE1 as its dependency.
  - Move TASK-02-01-06-FE2 and QA1 to wave 12.
- **Owner:** tech-lead.

### N4. The design's "set your basket's dose range" link has no story or task

- **Items:** Design line 1024 and the round 6 and 7 addenda
  (`suggest.noBasketRange`, a quiet link "only when dose would have been the
  lever"); STORY-02-03-05 and 02-03-06; TASK-02-03-05-BE1 and FE1;
  TASK-02-03-06-BE2.
- **Problem:** The approved design shows a link the user can see. No story
  criterion asks for it, and no task builds it. The engine would need to
  report a skipped dose lever, and the card would need to render the link and
  route it to the part's capability question (STORY-01-06-09). As it stands,
  either the developer invents the behaviour, or the design silently loses
  it.
- **Fix:** Either:
  - the story-writer adds a criterion to STORY-02-03-06 (or 02-03-05), and
    the tech-lead adds it to TASK-02-03-06-BE2 (a `skippedDose` reason) and
    TASK-02-03-05-FE1 (the link), plus a scenario in TASK-02-03-06-QA1; or
  - the designer drops the link.

  Each takes a few hours at most.
- **Owner:** story-writer and tech-lead, or the designer.

---

## Minor

### m1. Wave 11 tasks wait on wave 12

TASK-02-01-06-FE2 depends on TASK-02-03-03-FE1, and QA1 follows it. 8.3 notes
this but leaves both in wave 11. **Fix:** move them to wave 12. **Owner:**
tech-lead.

### m2. QA skips and re-tests are only partly wired

- TASK-01-03-01-QA1 says AC 1 is re-tested in TASK-02-02-01-QA1 and AC 4 in
  TASK-03-02-02-QA1. Neither of those tasks mentions it, whereas
  TASK-03-02-01-QA1 does this correctly for TASK-03-01-03-QA1.
- TASK-02-06-01-QA1 and 02-06-03-QA1 re-run in wave 9, but they don't depend
  on FE2 and FE3.
- These criteria still mention the deferred checklist and aren't in the skip
  table:
  - TASK-01-01-05-FE5 ("the same for a setup from the checklist");
  - TASK-01-02-02-FE4 ("from the checklist it continues");
  - TASK-01-02-05-FE1 ("in checklist step 1").

**Fix:** add each re-test to the receiving QA task, add the FE2 and FE3
dependencies, and list the checklist criteria in the skip table. **Owner:**
tech-lead.

### m3. Stale cross-references in revision 3

- TASK-01-02-04-BE1 still cites TASK-01-02-09-BE1.
- TASK-01-03-02-FE2 sends unknowns to "TASK-01-06-08-FE1"; it should now be
  BE1.
- R-17 says "TASK-04-01-03-BE1 on TASK-02-03-06-BE1 and BE2", which is the
  wrong way round.
- Wave 7 says TASK-01-06-08-BE1 "waits for wave 8", but it depends only on
  wave 1 schema and DQ-11.
- "Retired (15)" sits under "Changes since revision 1", which also says 14.

**Fix:** correct each one. **Owner:** tech-lead.

### m4. Retiring FE8 left a design criterion untested

Design EPIC-01-01: "labels never truncated in any shipped locale (test with a
long locale)". TASK-01-01-05-QA1 tests the 44 px height but not truncation.
My round 2 finding M5 missed that this criterion exists. **Fix:** add a story
test to TASK-01-01-05-QA1 with the TQ-08 test locale, at 320 px, in LTR and
RTL (no new task). **Owner:** tech-lead.

### m5. No task puts "log a shot" on the interim Brew screen

8.1 says Brew is "a plain screen with one 'log a shot' action from
TASK-01-01-05-FE3". FE3 is in wave 1, but `/log` exists only from wave 4, and
an interim EmptyState gets an action "only once its target exists". **Fix:**
add a step for the Brew action to TASK-01-03-01-FE2, or say that FE3 adds it
in wave 4. **Owner:** tech-lead.

### m6. S-02 wording about revision 2

S-02 says revision 2 "priced the narrower cut at about 422 hours". Revision
2's cut was the wider one. **Fix:** "the earlier, wider cut". **Owner:** Head
of Product.

### m7. Carried over: stale open questions and initiative scope

These are previous m2 and m3, unchanged. In `stories.md`:

- the "Most pressing" list and its open-question list (lines 3553-3608);
- the notes on STORY-01-06-01 (line 1019, SQ-20) and STORY-02-03-06 (line
  1717).

The epics' notes and `initiatives.md` lines 49-50 and 100 are also unchanged.
**Owners:** story-writer, epic-planner, strategist.

### m8. Carried over: design headings and the SCR-COFFEE row

Design lines 1388, 1514 and 1788 still use the old titles, and the SCR-COFFEE
row (line 188) still says "03-01". **Owner:** designer.

### m9. Carried over: DQ-24 thresholds and the dose-range chips

- DQ-24 is still unconfirmed (9.2 Q8).
- A 16-20 g basket, the stories' own example, still needs "other".

**Fix:** confirm DQ-24, or mark it as a tuneable constant. Check the chips
against the seed's real ranges. **Owners:** Head of Product, designer.

---

## Checks that passed

- Traceability: the new tasks have parents, sources and consistent IDs. The
  retired FE8 ID isn't reused.
- Task quality: the three new tasks are 2 h each, testable, with sensible
  dependencies.
- MVP discipline and build order: no Next or Later dependencies and no
  cycles. Milestone 1 is closed apart from N1 and N2.
- Design schedule: every design task comes before the wave that consumes it.
  Wave 0 needs 42 h of design up front, which is realistic for one designer.
