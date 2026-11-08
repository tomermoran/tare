# Tare planning review (round 4, closing pass)

Reviewer: principal product manager (quality gate), for the Head of Product.
Inputs: `docs/spec.md`, `planning/drafts/initiatives.md`, `epics.md`,
`stories.md`, `design.md` (through the Round 7 addendum) and `tasks.md`
(revision 4). The round 3 review is in git history. No drafts were edited and
no GitHub issues were created.

## Verdict

**Ready for approval.** 0 Blockers, 0 Major, 8 Minor.

All four Major findings from round 3 are resolved, and every total agrees.
Milestone 1 is self-contained and matches S-02. The Minor findings are
one-line text fixes. The tech-lead can make them when picking up the work, and
they don't need another review round.

**The only decision waiting on the Head of Product is DQ-24**, the freshness
thresholds. It doesn't hold up approval or Milestone 1:

- it only affects the suggestion work in wave 12;
- the working assumption is written down in TASK-02-03-05-BE1, as constants:
  under 5 days and over 35 days since roast or packing, and over 21 days open.

It needs an answer before wave 12's suggestion tests are written against those
values.

## Previous findings: status

| Round 3 finding | Status | Evidence / leftover |
|---|---|---|
| N1 Shot detail actions | **Resolved** | TASK-02-06-03-FE1 and FE2 build no actions. Edit, pin and dial in are added by TASK-02-06-02-FE1, TASK-02-01-01-FE2 and TASK-02-06-06-FE1, and each depends on TASK-02-06-03-FE2. 8.1 and the skip table agree. |
| N2 Second setup | **Resolved** | `resolveSetup` refuses a second setup. S-02, 8.1, section 4, TQ-16 and TASK-01-03-01-BE1 agree. R-24 and Q3 are retired. Hand-over details are in m1 to m3. |
| N3 Wave 11 size | **Resolved** | R-25 is corrected. The split adds up: 110 + 36 + 32 + 13 + 7 = 198 h, and 31 + 11 + 10 + 4 + 2 = 58 tasks. |
| N4 Dose-range link | **Resolved (dropped)** | Design's Round 6 and Round 7 addenda and tasks 9.2 agree. No story or task refers to the link. |
| m1 Wave 11 waits on wave 12 | **Resolved** | TASK-02-01-06-FE2 and QA1 are in wave 12. |
| m2 QA skips and re-tests | **Mostly resolved** | The Brew, frozen-pick and checklist re-tests are named in TASK-02-02-01-QA1, TASK-03-02-02-QA1 and TASK-01-01-07-QA1. The wave 9 re-runs state their dependencies in the task text. Leftovers are in m5. |
| m3 Stale cross-references | **Resolved** | All five are fixed. |
| m4 Tab label truncation | **Resolved** | Added to TASK-01-01-05-QA1. |
| m5 Brew's "log a shot" | **Resolved** | TASK-01-03-01-FE2 wires it. |
| m6 S-02 wording | **Resolved** | S-02 says "the earlier, wider cut". |
| m7 Stale questions and initiative scope | **Partly resolved** | `stories.md` is fixed. `initiatives.md` and `epics.md` each keep one stale passage (m7 below). |
| m8 Design headings and SCR-COFFEE row | **Resolved** | Headings at lines 1388, 1514 and 1788 and the row at line 188 now match. |
| m9 DQ-24 and dose chips | **Partly resolved** | Chips are resolved: the 16-20 g story example is gone, and the design explains "other". DQ-24 is knowingly open. |
| Round 2 m9 Design-originated scope | **No action** | Nothing else to do unless cuts are wanted. |

## Coverage summary

**Spec to stories:** not re-run, because the stories' scope didn't change.
Round 3's result stands: every section from S-01 to S-09 has at least one
story.

**Totals:** I added up all 316 task headers by hand, by epic and by wave.

| Check | Stated | Result |
|---|---|---|
| MVP | 316 tasks, 1,085 h | Agrees |
| Every epic and initiative row in section 11 | | Agrees |
| Five Milestone 1 epics in full | 137 tasks, 493 h | Agrees |
| Deferred table | 42 tasks, 137 h | Agrees |
| Pulled in from other epics | 4 tasks, 12 h | Agrees |
| Milestone 1 (137 - 42 + 4; 493 - 137 + 12) | 99 tasks, 368 h | Agrees |
| Milestone 1 epic rows in 8.1 | 30/114, 24/98, 17/60, 16/60, 8/24 | Agree |
| Waves 1 to 5 | 42/149, 21/89, 12/49, 17/59, 7/22 | Agree, total 99/368 |
| Waves 6 to 15, including 11a, 11b and 12b | 217 tasks, 717 h | Agree, row by row |
| Design | 144 h for Milestone 1, 328 h for the MVP | Agrees; 11a (41 h) and 11b (8 h) match design section 9 |
| Revision 3 to 4 change | +1 task, +3 h | Agrees (TASK-01-02-04-BE3 2 h, TASK-02-06-02-FE1 +1 h) |

Three smaller figures outside these totals are off (m6).

**Changed areas:**

- **Milestone 1 closure:** every dependency on the 99 tasks is a Milestone 1
  task, PR-3, a Head of Product prerequisite, a design task scheduled by wave
  5, or a working-assumption question.
- **Wave order:** every task's declared dependencies land in the same wave or
  an earlier one, including the moved tasks. Wave 6 and wave 12b need no new
  design, as 8.2 says. There are no circular dependencies on the new links.
- **TASK-01-02-04-BE3:** the task is well placed and sized, with a clear "done
  when" and correct dependencies. Wave 6 runs it after TASK-01-02-09-BE1, and
  TASK-01-02-08-FE1 and TASK-01-02-09-QA1 wait for it. The small gaps around it
  are in m1 to m3.
- **Skip table:** each row points to a wave that delivers the feature. Gaps in
  naming the receiving test are in m5.
- **Wave sizes:** wave 11a (110 h) is the largest after Milestone 1. R-25 says
  so, and it is a reasonable size next to wave 12 (93 h) and wave 7 (92 h).

**Limits of this pass:** I couldn't diff against git, so I judged the fixes by
reading the current text. I didn't revisit unchanged areas apart from the
carried findings.

---

## Blockers

None.

## Major

None.

## Minor

### m1. The hand-over from TASK-01-02-04-QA1 to wave 6 has loose ends

- **Items:** TASK-01-02-04-QA1, TASK-01-02-04-BE3, TASK-01-02-09-QA1.
- **Problems:**
  - QA1's Build still says "Node tests for reuse", but its "done when" skips
    reuse (AC 3).
  - QA1 tests "the refusal of a second setup". That test fails once BE3 removes
    the guard, and no task says to retire it.
  - BE3 claims AC 4 for a second setup, but TASK-01-02-09-QA1's re-test list
    has only AC 2, AC 3 and AC 6.
  - BE3 says the builder's entry points come from TASK-01-02-08-FE1 and
    TASK-01-02-09-FE1, but only 08-FE1 builds one.
- **Fix:** Drop reuse from QA1's Build. Have BE3 retire the refusal test. Add
  AC 4 to the re-test list. Remove 09-FE1 from BE3's sentence.
- **Owner:** tech-lead.

### m2. TASK-01-02-09-BE1 doesn't say it replaces the only-setup default

- **Items:** TASK-01-02-09-BE1 and QA1; TASK-01-03-01-BE1; wave 6 step 2.
- **Problem:** TASK-01-03-01-BE1 and wave 6 both say 09-BE1 replaces
  `defaultSetupId`, but 09-BE1's own Build and "done when" don't. If this is
  missed, the log keeps the wrong default once a second setup exists, and no
  test names that case.
- **Fix:** Add the swap to 09-BE1's Build, and add a test to 09-QA1 that the
  log defaults to the current setup when there are several.
- **Owner:** tech-lead.

### m3. The refusal of a second setup has no user-facing state

- **Items:** TASK-01-02-04-BE1 and FE2; TASK-01-02-05-BE1 and FE1.
- **Problem:** `resolveSetup` returns a typed error when a setup exists. No
  task says what the user sees. It can happen in Milestone 1 in two ways:
  - a double tap on the one-tap first setup, where the second call is refused
    just after the first succeeded;
  - a stale or back-navigated builder page.
- **Fix:** Treat the refusal as success-and-return when the combination is the
  same setup. Otherwise return to Setup with a neutral Notice. Add one test to
  TASK-01-02-04-QA1.
- **Owner:** tech-lead.

### m4. TASK-02-02-01-QA1's "done when" can't be met until wave 12b

- **Items:** TASK-02-02-01-FE1 and QA1 (wave 11a); TASK-03-03-04-FE1 and
  TASK-03-04-01-FE2 (wave 12b).
- **Problem:** QA1 says "AC 1 to AC 6 are covered". STORY-02-02-01 AC 2 (both
  clocks) and AC 1's "how much coffee is left" only appear in wave 12b. FE1's
  Build lists "coffee line with both clocks", and its "once TASK-03-03-04
  lands" doesn't say that the screen task is what's needed.
- **Fix:** In QA1, hand those two criteria to TASK-03-03-04-QA1 and
  TASK-03-04-01-QA1. In FE1, cite TASK-03-03-04-FE1 (wave 12b) and remove the
  clocks from the Build.
- **Owner:** tech-lead.

### m5. A few re-tests still aren't named by the receiving task

- **Items:**
  - The skip table sends TASK-01-02-01-QA1 AC 6 (private entries) to "wave 7",
    but no wave 7 task names it, and QA1 still says "AC 1 to AC 6 are covered".
  - TASK-02-06-03-QA1 sends the actions of AC 3 and AC 4 to TASK-02-06-02-QA1,
    TASK-02-01-01-QA1 and TASK-02-06-06-QA1. None of them mentions
    STORY-02-06-03.
  - TASK-02-01-01-FE2 doesn't say pin is primary on measured shots (design line
    1445).
- **Fix:** Name AC 6 in TASK-01-06-03-QA1 and add the skip to
  TASK-01-02-01-QA1. Add one line to each receiving QA task. Add "primary" to
  TASK-02-01-01-FE2.
- **Owner:** tech-lead.

### m6. Small figures and references in `tasks.md` are off

These don't affect any total.

- 8.1 says the schema is "13 tasks, 38 hours". The headers add up to 36 h.
- Section 11 says "15 tasks, 45 hours". The headers add up to 44 h.
- R-13 says EPIC-01-06 is 108 h. Section 11 correctly says 109 h.
- The header (lines 7-8) cites the design "through round 6"; it now runs to
  Round 7.
- 9.2 Q8 and the changes section cite "review m5" for DQ-24. That numbering is
  out of date.

**Fix:** Correct each one, and cite DQ-24 by name. **Owner:** tech-lead.

### m7. One stale passage each in `initiatives.md` and `epics.md`

- `initiatives.md` lines 52-53: "Shots record the grinder and machine units
  directly". S-08 records `setupId` on the shot, and the parts follow from the
  setup.
- `epics.md` lines 732-736 still ask who writes the scenario set and say step
  sizes "aren't defined". The Head of Product's answers closed both (the
  tech-lead writes the scenarios; SQ-19 sets the step sizes).

**Fix:** Update both passages. **Owners:** strategist, epic-planner.

### m8. No task wires the builder's `setup.closest` line

- **Items:** Design line 536; TASK-01-02-04-FE1 and FE2; TASK-02-01-06-BE1.
- **Problem:** FE1 builds the line and a story for it, and TASK-02-01-06-BE1
  says "the builder's `setup.closest` line uses it too". But TASK-01-02-04-FE2
  can't use it in Milestone 1, and no later task connects the two.
- **Fix:** Add the wiring to TASK-02-01-06-FE1 (a small step, no new task), or
  have the designer drop the line.
- **Owner:** tech-lead, or the designer.

---

## Checks that passed

- **Traceability:** TASK-01-02-04-BE3 has a parent, consistent IDs and
  references across the files.
- **Scope creep and duplicates:** revision 4 adds nothing the spec doesn't
  support. It narrows Milestone 1 to S-02's "one setup". BE3 doesn't overlap
  TASK-01-02-08-FE1 or TASK-01-02-09-FE1.
- **Design consistency:** the design matches the dropped link. The read-only
  detail is a build-order trim, and the full screen stays as designed. No new
  components.
- **MVP discipline:** no AI in the MVP, and nothing depends on Next or Later
  work. Every MVP story still has a QA task.
- **Build order:** no cycles, and the order is realistic. Milestone 1 ends at
  wave 5, and the rest is re-forecast from the measured pace, as S-02 says.
