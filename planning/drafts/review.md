# Tare planning review

## Revision 5 review (2026-11-16)

Reviewer: principal product manager (quality gate), for the Head of Product.

Scope: the sweetened-on-recipes change in EPIC-02-01 and the ten Next epics
(EPIC-02-04, 02-05, 03-05, 03-07, 04-02, 04-03, 04-04, 05-01, 05-02, 05-03).
INIT-06 and MVP content not amended by revision 5 were not re-reviewed.

Inputs: `docs/spec.md`, `planning/drafts/epics.md` (revision 11),
`design.md` (approved after round 8), `stories.md` (revision 5, with the
answers to Q1 to Q7), `tasks.md` (revision 5: sections 4a, 6a, 7, 8.4, 9.3,
R-26 to R-40, 11). No drafts were edited and no GitHub issues were created.

### Re-review result (2026-11-16, after the owners' fixes)

**Ready.** 0 Blockers, 1 Major (new), 6 Minor open (3 carried, 3 new).

All three blockers and all four Major findings from the first pass are fixed.
I checked each fix in the current text, not just the owners' summaries. The one
new Major is a narrow spec gap. It should be fixed before the EPIC-03-07 issues
are created, but it doesn't hold up approval. The fixes changed no totals. Story
points (162 stories, 457 points) and tasks (208 tasks, 853 h) still agree, and
no dependency added by the fixes points to a later wave.

The producing-countries list is now `planning/coffee-origins.json`: 81
countries with ISO 3166-1 alpha-2 and alpha-3 codes and descriptive coffee
data. It contains no personal data. `tasks.md` 9.3 (line 6354) points to it.

#### Status of the first-pass findings

| Finding | Owner | Status | Evidence |
|---|---|---|---|
| B1 Epic sizes | epic-planner, story-writer | **Fixed** | `epics.md`: Summary table lines 268 and 276 (both M), Changes list line 59 and lines 81-82 (the re-size). `stories.md`: lines 3103-3104 and 4530-4532 give the Q5 outcome. |
| B2 Leaving and sweetened copy "open" | epic-planner | **Fixed** | `epics.md` lines 2369-2371 move all three to "Closed after revision 11"; line 800 is "Closed (DQ-44a and b ...)". |
| B3 Spec contradicts decisions | strategist | **Fixed** (one gap, N1) | `docs/spec.md`: S-02 line 35 (additive schema changes, named), lines 42 and 95 (sweetened remembered on recipes), line 61 (origin), line 73 (DQ-29 closed); S-08 lines 180, 282, 304, 432, 481-482, 504 and 508. |
| M1 Servicing double count | tech-lead | **Fixed** | TD-2 lines 512-515, TASK-04-02-01-BE1 and TASK-04-03-03-BE2 (lines 5052-5056, with a "shift once, not twice" test) judge shots against the servicing-applied grind. TASK-04-02-09-QA1 has the scenario. See N3 for timing. |
| M2 Leaving not designed | designer | **Fixed** | `design.md`: SH-LEAVE in the 2.4 table (line 371); the full flow, states and copy keys at lines 3125-3162; design ACs at lines 3182-3188; DES-05-02-05 at line 3202; DQ-41b at line 3973. It says "new, empty household" (lines 3138 and 3156), which matches TD-11 and STORY-05-02-07 AC 2. |
| M3 Combined freshness score | epic-planner | **Fixed** | `epics.md` line 1495 puts it Out of EPIC-04-02. |
| M4 Stories without DES | story-writer | **Fixed** | `stories.md` lines 1969, 3269, 3296, 3323, 3345, 3404, 3459 ("none (rules and evals only)") and 4035. |
| m1 Stale questions | story-writer | **Fixed** | Lines 1467-1468, 2019-2020, 3831-3833, 4536-4537 and 4546-4556, and the STORY-03-06-01 pointer at line 2891. |
| m2 Criteria vs answers | story-writer | **Fixed** | STORY-04-03-03 AC 5 (lines 3572-3574), STORY-05-02-07 AC 1 (lines 4046-4047), STORY-05-02-02 AC 6 (lines 3983-3984), STORY-02-01-08 AC 6 (Q2), and the change table at line 17. The QA wording is in N4. |
| m3 Stale epic risks | epic-planner | **Fixed** | `epics.md` lines 730, 1381, 1385, 1517 and 1696. |
| m4 Epic dependencies | epic-planner | **Fixed** | `epics.md` lines 980, 1504 and 1687. |
| m5 Size scale | epic-planner | **Still open** | Not claimed. EPIC-02-04 (S, 9 points), EPIC-05-03 (S, 10) and EPIC-03-05 (M, 8) still sit side by side with no stated scale. Minor. |
| m6 Design labels | designer | **Fixed** | Header lines 14-18, line 436 (EPIC-03-07), DQ-39 at line 3949 (split by part). The remaining "draft" mentions are in the dated review log, which is correct. |
| m7 Placeholders | designer, strategist | **Fixed** | "Alex" replaced by `{name}`; spec S-04 line 90 reads "another household member or a regular guest". |
| m8 Tasks header | tech-lead | **Still open** | Not claimed. `tasks.md` line 1 ("revision 5 draft") and line 27 ("is a draft"); the sources on lines 16-20 still cite stories revision 4, design round 7 and epics revision 10; TASK-02-04-04-BE1 is still under the STORY-02-04-01 heading (line 3163). Minor. |
| m9 DES-03-05-01 orphaned | tech-lead | **Fixed** | Cited by TASK-03-05-01-FE2 and TASK-03-05-02-FE1. |
| m10 BE2 grep gate | tech-lead | **Fixed** | TASK-05-01-03-BE2 depends on BE3. |
| m11 Vague "done when"s | tech-lead | **Fixed** | TASK-02-04-01-FE1 (line 3223), TASK-04-02-06-FE1 (DOM snapshot comparison, line 4799), TASK-05-03-01-FE2 (line 5763); R-28 line 775 sets a budget (at most 4 extra queries, 50 ms); TASK-04-02-09-QA1 names Head of Product sign-off. |
| m12 Technical inconsistencies | tech-lead | **Fixed** | TQ-22 race noted (lines 4786-4788); the stretch decline refits the shift (line 5163) and `epics.md` line 1631 reads "stretch factor at 1 (0 %)"; TASK-03-07-02-FE2's link is soft. |
| m13 STORY-03-07-03 AC 3 | story-writer | **Fixed** | Line 3043-3044: "fill them in if my household added them". |
| m14 MVP minors (round 4) | tech-lead | **Out of scope** | Not re-checked, as before. |

#### New findings

**Major**

- **N1. The spec's origin field leaves out "other".**
  - **Owner:** strategist (drafts it); the Head of Product owns the spec.
  - **Where:** `docs/spec.md` S-08 line 180 (`// Optional: a country as an ISO
    3166-1 alpha-2 code (e.g. 'ET'), or 'blend'; null if unknown`) and S-02
    line 61 ("a country (as an ISO code) or blend").
  - **Against:** every other file lets a free-text origin be stored:
    - STORY-03-07-04 AC 1 and 2 ("blend" or "other", typed, case-folded);
    - design lines 2447 and 2453;
    - `epics.md` line 1349;
    - TD-9 (`tasks.md` line 565), TASK-03-07-04-BE2 (lines 4325-4332) and TQ-18.
  - **Why it matters:** S-08 is the schema contract, and the S-02 Updates
    override the rest. As written, a column holding "Yirgacheffe region" would
    contradict the spec. This is the same kind of gap B3 closed for the other
    three decisions.
  - **Fix:** add the case-folded free-text "other" value to both lines, or drop
    "other" from the story, design and tasks. The plan's version is the
    approved one.

**Minor**

- **N2. TASK-03-07-04-BE2 doesn't name its source list.** (tech-lead)
  - The task (lines 4325-4332) builds the origin list but doesn't cite
    `planning/coffee-origins.json`; only 9.3 (line 6354) does.
  - Its example for "other" ("ethiopia" and "Ethiopia" are one value, line
    4331) uses a country that is in the list, so it would never reach "other".
  - **Fix:** cite the file and say which fields are read (`iso_alpha_2`,
    `country`). Use a non-country example, such as a region name.
- **N3. The servicing scenario in TASK-04-02-09-QA1 runs before servicing
  exists.** (tech-lead)
  - TASK-04-02-09-QA1 is in wave 23. The servicing-applied grind comes from
    TASK-04-03-03-BE2 in wave 24, which has its own "shift once, not twice"
    test.
  - **Fix:** either move that one scenario to TASK-04-03-03-BE2's test, or
    have TASK-04-02-01-BE1 state that servicing is the identity until wave 24
    and re-run the scenario there.
- **N4. TASK-02-01-08-QA1 cites the Q2 answer, not AC 6.** (tech-lead)
  - Its "done when" (line 2424) says "AC 1 to AC 5 and the Q2 answer". Q2 is now
    STORY-02-01-08 AC 6.
  - **Fix:** say "AC 1 to AC 6".

**Remaining blockers:** none.

---

### First-pass verdict (superseded by the re-review above)

**Needs fixes.** 3 Blockers, 4 Major, 14 Minor.

The breakdown itself is sound:
- every in-scope story has tasks and a QA task;
- every total adds up;
- no task depends on a later wave;
- DQ-32 (revised) reads the same in all four files.

The blockers are contradictions between documents on exactly the points the
Head of Product decided on 2026-11-15/16:
- epic sizes;
- leaving the household and the one-tap sweetened copy, still listed as open;
- the spec, which still states the opposite of three approved decisions.

All three are text fixes. None changes scope or estimates.

### Coverage summary

**Spec to epics to stories (in-scope epics).**

| Spec decision | Epic | Stories |
|---|---|---|
| S-02 batch override, S-04 pinned recipe per batch, S-02 "still open" on pin scope (DQ-29) | EPIC-02-04 | 02-04-01 to 04 |
| S-02 / S-04 sweetened (amended by the Head of Product, round 8) | EPIC-02-01 | 02-01-07 to 09, 7 amended ACs |
| S-02 drink types editable, milk list, typical milk amounts | EPIC-02-05 | 02-05-01 to 08 |
| S-02 run-out from facts, usage rate, logged share | EPIC-03-05 | 03-05-01 to 03 |
| S-02 Beans filters (roaster, roast level, origin, rating) | EPIC-03-07 | 03-07-01 to 05 |
| S-01 recency weighting, S-02 drift calculated not stored | EPIC-04-02 | 04-02-01 to 09 |
| S-02 grind offsets as exact shifts, re-dial after maintenance | EPIC-04-03 | 04-03-01 to 05 |
| S-02 stretch factor after two or more re-dials | EPIC-04-04 | 04-04-01 to 03 |
| S-02 phase 2 sub personas, S-04 personas, whose taste vs who logged | EPIC-05-01 | 05-01-01 to 07 |
| S-02 phase 3 invites and claiming, S-07 personal consent | EPIC-05-02 | 05-02-01 to 07 |
| S-02 Google sign-in first after the MVP, Firebase linking | EPIC-05-03 | 05-03-01 to 04 |

One gap: the S-02 combined freshness score is assigned to INIT-04, but no
in-scope epic places it as in or out (M3).

**Totals.** I re-added every header in revision 5. All of these agree:

| Check | Stated | Result |
|---|---|---|
| Stories (Next) | 55 stories, 146 points | Agrees (per epic and in total) |
| Stories (MVP after sweetened) | 88 stories, 234 points | Agrees |
| New stories, retired | 25 new, 1 retired (STORY-03-05-04) | Agrees; 138 + 25 - 1 = 162 |
| Tasks per epic (section 1 and section 11) | 19, 13, 29, 11, 17, 25, 22, 21, 11, 25, 15 | Agrees, header by header |
| Revision 5 tasks and hours | 208 tasks, 853 h | Agrees |
| By discipline | BE 72 / 305 h, FE 71 / 300 h, QA 65 / 248 h | Agrees |
| Waves 17 to 26 (8.4) | Each row, 208 / 853 | Agrees row by row |
| Design (section 9, Next) | 34 tasks, 128 h (+ DES-02-01-06, 4 h) | Agrees |
| R-38 ratio | 853 h / 152 points | Agrees |

**Structure checks.**

- **QA coverage:** every one of the 58 stories (55 Next, 3 MVP) has at least
  one QA task, and each of the 7 amended criteria has a re-test.
- **Wave order:** I checked all 208 dependency lines against 8.4:
  - no task depends on a later wave;
  - no cycles;
  - cross-wave links go backwards only (for example 22 on 19a and 21b; 23 on
    20; 24 on 23; 26 on 18).
  - The one soft link is m12.
- **IDs:** epic, story, task and DES IDs are unique. They are consistent
  across files, apart from the pointers in m1 and m6.
- **Personal data:** no real names in the drafts. The only notes are m7.

---

### Blockers

#### B1. Epic sizes contradict each other in `epics.md`

- **Owner:** epic-planner (and the story-writer for the echo in `stories.md`).
- **Where:**
  - `epics.md` Summary table, line 267 (EPIC-02-05 "S") and line 275
    (EPIC-03-07 "S").
  - Changes in revision 11, lines 59-60 ("EPIC-03-07 ... (Next, S)") and line 81
    (EPIC-02-05 "Stays S").
- **Against:**
  - The epic bodies, re-sized on 2026-11-16 by the Head of Product's answer to
    stories Q5: line 985 (EPIC-02-05 "M, 17 story points") and line 1377
    (EPIC-03-07 "M, at the small end"). Line 711 (EPIC-02-01 "M, at the top")
    agrees with the table.
  - `stories.md` lines 4519-4523 and 3101-3102 still say the epics are "listed
    S" and the sizes "no longer match", which Q5 has closed.
- **Fix:**
  - Set both rows to M in the Summary table.
  - Add the 2026-11-16 re-size to the Changes list, replacing "Stays S" and
    "(Next, S)".
  - In `stories.md`, replace the "Epic sizes ... no longer match" bullet and the
    EPIC-03-07 coverage sentence with the Q5 outcome.

#### B2. Leaving and the one-tap sweetened copy are still "open" in `epics.md`

- **Owner:** epic-planner.
- **Where:**
  - `epics.md` lines 2358-2361 ("Still open after revision 11: leaving the
    household ... the seventh INIT-03 epic; whether one-tap pulls copy
    sweetened").
  - EPIC-02-02 risks, lines 799-802 ("Also confirm that a one-tap pull copies
    sweetened").
- **Against:**
  - EPIC-05-02 scope, lines 1743-1746 and 1761-1762: leaving is in scope and
    closed on 2026-11-16.
  - Design DQ-44 is accepted (`design.md` lines 3963-3974 and 4013).
  - The seven-epic INIT-03 is approved (`design.md` line 13; stories Q7).
  - STORY-02-01-09 and TASK-02-01-09-BE1 build the copy.
- **Why it blocks:** issues for EPIC-02-02 and EPIC-05-02 would carry open
  questions that are already decided. Leaving is a release gate for wave 26.
- **Fix:**
  - Move all four items to "Closed in revision 11", citing DQ-41b (as answered
    2026-11-16), DQ-44a and b, and PEC-17 with Q7.
  - Leave only the two EPIC-04-02 items, which DQ-45 and DQ-46 also answer
    (see m3).
  - Remove the "Also confirm" sentence from EPIC-02-02.

#### B3. The spec still says the opposite of three approved decisions

- **Owner:** strategist. The strategist drafts the S-02, S-04 and S-08 edits;
  the Head of Product owns the spec.
- **Where in `docs/spec.md`, which says its Updates section overrides the
  rest:**
  - S-02 line 42 and S-04 line 95: sugar is "a 'sweetened' mark on the shot".
    Recipes now remember it, and a `pinned_recipes.sweetened` column is added
    (TASK-02-01-07-BE1).
  - S-02 line 35: "Only the UI changes between phases". Invites add a new
    `invites` table (TASK-05-02-01-BE1), and removing a bag recipe adds
    `pinned_recipes.removed_at` (TASK-02-04-04-BE1).
  - S-02 line 73: "Still open: whether pinning a better recipe updates the
    bag's override or the bean's default". DQ-29 answers it.
  - S-02 line 61 (Beans filters) and S-08 `canonicalBeans` (line 174): no
    origin field. TASK-03-07-04-BE1 adds one.
  - S-08 line 280 comment: "invites add rows later" (to membership only).
- **Why it blocks:** every other decision of this kind was recorded in S-02
  before the plan relied on it (revisions 6 to 10). As written, four new
  migrations in tasks 6a contradict the section that governs the plan.
  `epics.md` lines 133-138 and tasks 9.3 Q8 both list this as pending.
- **Fix:** record the four decisions in S-02 and update the S-08 snippets
  before the Next issues are created:
  - sweetened remembered by the recipe, never its identity;
  - the invites table and leaving;
  - `removed_at`;
  - an optional origin on coffees.

---

### Major

#### M1. The drift age term will double-count a servicing shift

- **Owner:** tech-lead.
- **Where in `tasks.md`:**
  - TD-2 (lines 507-513) and TASK-04-02-02-BE1: the recipe in force is the
    stored pin.
  - TASK-04-02-01-BE1 (lines 4723-4736): the age term is a line through "each
    shot's grind minus its own recipe's grind".
  - TASK-04-03-03-BE2 (lines 5027-5040): servicing becomes the first step of
    the composition.
- **Problem:** after a confirmed shift on a grinder event, the current period
  starts at the event, and every measured shot in it is pulled near the shifted
  grind. Each shot is compared with its old recipe's raw grind, so the age line
  picks up the whole shift as its intercept. The composition then adds the
  shift again (recipe + servicing + age), which shows roughly twice the shift
  on every coffee that wasn't re-dialled. R-27 names the age/bag double count
  but not this one.
- **Fix:**
  - In TASK-04-03-03-BE2, judge each shot against its recipe-in-force grind
    with servicing applied (the same `resolveRecipeGrind`).
  - Add a scenario to TASK-04-02-09-QA1: a serviced grinder, an old recipe and
    shots at the shifted grind give no age term.

#### M2. The leaving flow is not designed in `design.md`, and its text is stale

- **Owner:** designer.
- **Where in `design.md`:**
  - EPIC-05-02 intro, lines 3046-3047: Q3 is listed as open.
  - "Open item", lines 3122-3132: "leaving the household is undesigned ...
    proposed".
  - DQ-41b, lines 3936-3940: "still open after revision 11". Line 4014 says
    it is resolved.
  - Section 9, line 4057 "(proposed, leaving)", and line 4123 "*proposed*".
  - The 2.4 screen table (lines 357-370) has no leave confirmation.
- **Problem:** STORY-05-02-07 and TASK-05-02-07-FE1 depend on DES-05-02-05.
  The only design text is a recommendation paragraph:
  - no entry point detail, copy keys, states (loading, failure, last login)
    or design acceptance criteria, unlike every other screen;
  - it says the leaver gets "a new, empty profile of their own", while the
    Head of Product's answer (stories Q1, EPIC-05-02, TD-11) is a new, empty
    household.
- **Fix:**
  - Replace the Open item with the approved flow: Profile, Account, one
    ConfirmSheet, then the new household's first-run Brew.
  - Name the new household explicitly.
  - Add states and acceptance criteria, including "shown only with more than
    one login" (tasks 9.3 Q1).
  - Clear the "open" and "proposed" labels.

#### M3. The S-02 combined freshness score has no home

- **Owner:** epic-planner.
- **Where:** `docs/spec.md` S-02 line 26 defers "a single combined freshness
  score" to drift-aware dial-in (INIT-04). EPIC-04-02 (`epics.md` lines
  1443-1536), 04-03 and 04-04 neither include nor exclude it, and `stories.md`
  line 2638 only repeats the deferral.
- **Problem:** this is a spec decision with no In or Out placement in the
  initiative it was assigned to.
- **Fix:** add one scope line to EPIC-04-02. Either say the bean-age term
  (DQ-31) is that learned effect and no separate score is shown, or put the
  score Out with a pointer to where it will go.

#### M4. Eight in-scope stories cite no design task

- **Owner:** story-writer.
- **Where in `stories.md`:** STORY-02-04-02 (line 1968), 04-02-02 (line 3267),
  04-02-03 (line 3293), 04-02-04 (line 3319), 04-02-05 (line 3340), 04-02-07
  (line 3398), 04-02-09 (line 3452) and 05-02-04 (line 4026).
- **Problem:** line 12-13 says every Next story "cites the design tasks
  (DES-*) it depends on". Several of these have visible behaviour that depends
  on a design task:
  - 04-02-03 AC 4 and 04-02-07 AC 6 depend on SH-DRIFT (DES-04-02-02);
  - 05-02-04 AC 3 depends on the claim screen (DES-05-02-03);
  - 02-04-02 AC 1 depends on Brew's marker (DES-02-04-02).
- **Fix:** add the DES ID, or "Design: none (rules only)", to each Notes line.

---

### Minor

#### m1. Answered questions still read as open in `stories.md`

The story-writer should fix these:
- STORY-02-01-08 Notes (line 1465), STORY-02-04-04 Notes (line 2017) and
  STORY-05-01-05 Notes (line 3822) still ask Q2, Q3 and Q4.
- "Not covered" (lines 4540-4541) lists the bag-recipe question and the
  leaver's household.
- "Levers" (line 4527) calls leaving "the open scope decision".
- STORY-03-06-01 Notes (line 2890) points to the retired STORY-03-05-04
  instead of EPIC-03-07.

**Fix:** mark each one answered (2026-11-16) and correct the pointer.

#### m2. Story criteria that don't match accepted answers

The story-writer should fix these:
- **STORY-04-03-03 AC 5:** "I change an event's date". There is no event edit
  (tasks 9.3 Q3, accepted). Reword it to "an event saved with an earlier date".
- **STORY-05-02-07 AC 1:** add "in a household with more than one login"
  (9.3 Q1).
- **STORY-05-02-02 AC 6:** "a role (owner or member)" can't be tested. A
  joiner is a member (DQ-41a, TASK-05-02-02-BE1).
- **Q2 ("Dial in from this" starts with the past shot's sweetened):**
  - It isn't in STORY-02-06-06 AC 1, STORY-01-03-04 AC 2 or STORY-02-01-08
    AC 1. Add it to one of them.
  - Name it in TASK-02-01-08-QA1, which already tests it.
- **The revision 5 change table (line 17):** it lists EPIC-02-01 stories 02
  and 03 as amended. The amended set is 01-03-04, 02-01-04, 02-01-06,
  02-02-01, 02-02-02, 02-03-02 and 02-03-03, which `tasks.md` uses.

#### m3. Stale risk lines in `epics.md`

The epic-planner should mark these closed:
- EPIC-04-02, lines 1508-1513 and 1526-1528: the recipe a shot came from is
  DQ-45, and pooling across setups is DQ-46.
- EPIC-05-01, lines 1687-1689: the source profile is DQ-48.
- EPIC-03-07, lines 1379-1386: the seed list, blends and merged origins are
  DQ-49. "Other" is no longer the escape hatch for blends.
- EPIC-02-01, lines 728-730: the closest-setup carry-over is answered by
  STORY-02-01-06.

#### m4. Epic dependency lists miss links the tasks rely on

The epic-planner should add these. The build order already satisfies them.
- EPIC-04-02 needs EPIC-02-04: TASK-04-02-02-BE1 reads bag recipes and
  `removed_at`.
- EPIC-05-01 needs:
  - EPIC-02-05 (the shared name rule);
  - EPIC-05-03 (the Profile restructure);
  - EPIC-03-07 (STORY-05-01-07 AC 3).
- EPIC-02-05 needs EPIC-05-03 (TASK-02-05-07-FE1).

#### m5. The size scale is uneven

The epic-planner should check these against each other:
- EPIC-03-05 is "M" at 8 points;
- EPIC-02-04 is "S" at 9 points;
- EPIC-05-03 is "S" at 10 points.

**Fix:** align them, or state the scale.

#### m6. Stale status labels and pointers in `design.md`

The designer should fix these:
- Lines 22-23 ("Section 5 stays draft pending approval") and line 55
  ("rounds 7 and 8, draft").
- Section headings 2.4 and 3 still say "(round 7, draft)".
- Line 4059 ("draft").
- Line 435: "Beans filters (EPIC-03-05)" should be EPIC-03-07.
- DQ-39 (line 3912) "blocks EPIC-03-05", although parts (b) and (c) are
  EPIC-03-07.

#### m7. Placeholders and relationships

- `design.md` lines 2896 and 2975 use "Alex". It is labelled a placeholder,
  but it is a common real first name rather than obviously fictional. Prefer
  `{name}` or an obviously invented label. Owner: designer.
- `docs/spec.md` S-04 line 90 gives "a partner" as a sub-persona example, a
  relationship in a public file. Suggest "another household member or a
  regular guest". Owner: strategist.

#### m8. The `tasks.md` header and status still say draft

Owner: tech-lead.
- Line 1 and line 27 say revision 5 is a draft.
- Lines 14-25 list the sources as stories revision 4, design round 7 and epics
  revision 10.
- TASK-02-04-04-BE1 sits under the STORY-02-04-01 heading (line 3159),
  although its parent is 02-04-04.

#### m9. DES-03-05-01 is orphaned

No task depends on DES-03-05-01 (the run-out line). TASK-03-05-01-FE2 and
TASK-03-05-02-FE1 build that line. **Fix:** add it to both. Owner: tech-lead.

#### m10. TASK-05-01-03-BE2's grep gate needs BE3

BE2's "done when" requires no `isDefault` outside the resolver. The one in
`setups.ts` is removed by TASK-05-01-03-BE3, which BE2 doesn't depend on.
**Fix:** add the dependency. Owner: tech-lead.

#### m11. "Done when"s that can't be checked as written

Owner: tech-lead.
- **TASK-02-04-01-FE1 and TASK-05-03-01-FE2:** "AC ... visible in the
  stories", but AC 5 and AC 2 are data claims.
- **TASK-04-02-06-BE2:** "measured against the budget in R-28", but R-28
  gives no number.
- **TASK-04-02-09-QA1:** "a domain review checks them" has no owner.
- **TASK-04-02-06-FE1:** "looks as it does today". Name the story or snapshot
  comparison.

#### m12. Smaller technical inconsistencies

Owner: tech-lead.
- **TQ-22 versus STORY-04-02-06 AC 5:** in a race, the pull can record a grind
  one step off from the grind shown. Note it on the story, or test a tolerance.
- **TASK-04-04-02-BE1:** declining the stretch "keeps the shift", but that is
  the fitted intercept. Refit with stretch 1. `epics.md` line 1625 says
  "stretch at zero" where the factor is 1 (0 %).
- **TASK-03-07-02-FE2:** it declares a hard dependency on TASK-03-05-02-FE1,
  while 8.4 and EPIC-03-07 call the two independent. Make it a soft link.

#### m13. STORY-03-07-03 AC 3 promises more than STORY-03-07-05 AC 3 allows

STORY-03-07-03 AC 3 says "not stated" coffees can be found "and filled in".
Seeded and verified coffees can't be filled in (STORY-03-07-05 AC 3).
**Fix:** say "found, and filled in if your household added them". Owner:
story-writer.

#### m14. The previous review's MVP minors

The round 4 minors m1 to m8 below are outside this revision's scope. They are
not re-checked here.

---

### Checks that passed

- **Traceability:** every new story has a parent epic, source sections and
  Given/When/Then criteria. Every task has a parent story, an estimate,
  dependencies and a "done when".
- **DQ-32 (revised):** epics, design, stories and tasks agree:
  - 3 days, at least 3 and at most 10 shots;
  - never past maintenance;
  - pooled across personas and shared-grinder setups, with a nudge per recipe;
  - the evals' basket fallback;
  - "last 5" appears only as the replaced rule.
- **EPIC-03-05/03-07 split:** stories, DES tasks and tasks moved cleanly
  (STORY-03-05-04 is retired; DES-03-05-03 and 04 became DES-03-07-01 and 02).
  The only stale pointers are in m1 and m6.
- **Sweetened:** stories, design 5.0a, DQ-44 and the 19 tasks agree:
  - yes or no only;
  - never part of a recipe's identity;
  - legacy rows read as not sweetened;
  - a pull copies it;
  - no control on Brew.
- **Leaving:** stories, tasks (TD-11, wave 26 release gate) and the EPIC-05-02
  scope agree that the leaver gets a new household. The exceptions are B2 and
  M2.
- **Scope creep:** nothing beyond the spec and the recorded Head of Product
  decisions. INIT-06 is untouched, and there are no LLM calls in any Next
  epic.
- **Design consistency:** one new component (NC-17 ReorderList), justified.
  Extensions are flagged. Empty, loading and error states are present for
  every new screen except leaving (M2). There is no `signal` outside shot
  warnings.
- **MVP discipline:** the MVP change (wave 17) depends only on MVP code.
  Nothing in the MVP depends on Next work.
- **Build order:** EPIC-05-03 is the first Next epic, as S-02 requires, and
  EPIC-05-02 is last. Tasks need no new design inside a wave beyond the design
  schedule note in 8.4.

---

## Earlier reviews

### Round 4 review (closing pass)

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
