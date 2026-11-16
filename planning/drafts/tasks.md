# Tare engineering tasks (revisions 4 and 5, approved)

**Revision 5 (approved, 2026-11-16) adds 208 tasks and 853 hours** for the sweetened
change on pinned recipes (EPIC-02-01) and ten Next epics: EPIC-02-04, 02-05,
03-05 (run-out only), 03-07 (new), 04-02, 04-03, 04-04, 05-01, 05-02 and 05-03.
INIT-06 (AI) is not broken down. Revision 4's 316 tasks and 1,085 hours are
unchanged. The new tasks are in section 7 (inside each epic), the technical
approach is section 4a, the schema changes are section 6a, the waves are
section 8.4, the questions are section 9.3, the risks are R-26 to R-40 and the
totals are in section 11. Revision 5 reads the built code, so it names real
files, tables and modules; section 3 still describes the checkout at revision 4
and is not updated.

Source:

- `planning/drafts/stories.md` (revision 5, approved, 162 stories, with the
  Head of Product's answers);
- `planning/drafts/design.md` (approved after round 8);
- `planning/drafts/epics.md` (revision 11, final, build order);
- `planning/drafts/review.md` (the plan review);
- `docs/spec.md` (S-02 decisions including the Milestone 1 bullet, S-04
  ontology, S-08 schema);
- the codebase on branch `planning/breakdown-drafts`, plus open PR #3
  (`design/mvp-screens`), described in section 3.

**Status: revisions 4 and 5 are approved.** Revisions 2 and 3 are
superseded by revision 4. The MVP is now built; no GitHub issues are created
and no code is written by this plan. Open questions are named in each task's
dependencies and listed in section 9 (9.3 for revision 5).

**Scope.** Revisions 1 to 4 broke down the 85 MVP stories in the 16 MVP epics.
Revision 5 adds the ten Next epics (sources: `stories.md` revision 5,
`epics.md` revision 11, `design.md` approved after round 8) and the three new
MVP stories STORY-02-01-07 to 09 with seven one-criterion amendments. Later
stories (INIT-06) are listed in section 1. **Milestone 1** (a lean walking
skeleton, section 8.1) is a subset of these tasks, not extra work.

## Changes since revision 3

Revision 4 has **316 tasks and 1,085 hours** (revision 3: 315 and 1,082).
Milestone 1 is unchanged at 99 tasks and 368 hours. Decisions by the Head of
Product, 2026-11-03, applied after the round 3 review:

1. **The shot detail is read-only in Milestone 1** (review N1).
   TASK-02-06-03-FE1 and FE2 build no pin, edit or "dial in from this"
   action. Each is added by the task that delivers its target, and each
   depends on the detail route (TASK-02-06-03-FE2): edit in TASK-02-06-02-FE1
   (6 h to 7 h), pin in TASK-02-01-01-FE2 and dial in in TASK-02-06-06-FE1.
   The skip table lists the criteria this skips.
2. **One setup until wave 6** (review N2). `resolveSetup` creates a setup only
   when the household has none, so the only setup is current. This replaces
   the "newest setup is current" rule in TASK-01-03-01-BE1. Risk R-24 and
   question 3 in section 9.2 are retired. The new TASK-01-02-04-BE3 (2 h,
   wave 6) lifts the limit; TASK-01-02-09-QA1 re-tests STORY-01-02-04 AC 2
   (the `existing` case), AC 3 and AC 6 with several setups.
3. **Wave 11 is split** (review N3). It was about 198 h (58 tasks), not 130 h;
   R-25 is corrected. The profile (13 h) moves to wave 6, and
   TASK-02-02-01-FE1 keeps its persona label (new dependency on
   TASK-01-01-03-FE3, which now declares the interim Brew screen). The clock
   and remaining-coffee screens (32 h) move to a new wave 12b beside wave 12.
   TASK-02-01-06-FE2 and QA1 move to wave 12. The rest is wave 11a (recipes,
   the checklist, Brew and the pull, with TASK-02-01-06-BE1 pulled forward
   because the pull depends on it) and wave 11b (choosing, setup switching).
   Section 8.2's design rows follow.
4. **The quiet `suggest.noBasketRange` link is dropped** (review N4). With an
   unknown range the suggestion skips dose; the user sets the range from the
   basket's part details. No task changes.
5. **Minor findings:** the Milestone 1 skip table lists the checklist
   criteria and the setup-builder criteria, and the receiving QA tasks name
   the re-tests (m2); stale references fixed in TASK-01-02-04-BE1,
   TASK-01-03-02-FE2, R-17 and wave 7 (m3); TASK-01-01-05-QA1 checks that tab
   labels never truncate (m4); TASK-01-03-01-FE2 wires Brew's "log a shot"
   action (m5). DQ-24 (freshness thresholds) stays open for the Head of
   Product.
6. **Closing review, Minor findings (m1 to m8) applied, no change to hours or
   task counts.** The hand-over to wave 6 and the retired refusal tests are
   named; TASK-01-02-09-BE1 replaces the only-setup default and its QA tests
   it; the refusal of a second setup is success-and-return for the same
   combination, otherwise a neutral Notice on Setup; TASK-02-02-01-QA1 is met
   in wave 11a with the clocks and remaining coffee re-tested in wave 12b;
   the missing re-tests are named; the schema (36 h), schema and harness
   (44 h) and R-13 (109 h) figures are corrected; `setup.closest` is wired in
   TASK-02-01-06-FE1. DQ-24 stays a working value for the Head of Product to
   confirm before wave 12's suggestion tests.

## Changes since revision 2

Revision 3 has **315 tasks and 1,082 hours** (revision 2: 313 and 1,084).
It narrows Milestone 1 to 99 tasks and 368 hours (was 113 and 422). Decisions
by the Head of Product, 2026-11-03:

- 3 tasks added: TASK-02-06-01-FE2, TASK-02-06-03-FE3 and TASK-01-06-08-BE1;
- 1 retired: TASK-01-01-05-FE8 (no defining story; guard dropped);
- about 12 task headers updated (dependencies, estimates, steps).

**Decisions.**

1. **Narrower Milestone 1.** Deferred: the profile story (BE1, FE2, FE3,
   QA1; TASK-01-01-03-FE1 stays), the whole first-run checklist
   (STORY-01-01-07), the part screen (TASK-01-02-02-FE5, FE6) and the edit
   mode (STORY-02-06-02). Brew is a plain screen with one "log a shot"
   action.
2. **Unknown basket dose range.** Dose is never suggested without a range
   (TASK-02-03-06-BE2). Closed.
3. **Guard retired.** TASK-01-01-05-FE8 is retired; its ID is never reused.
4. **Milestone 1 stays inside itself.** Milk seeding moves to wave 6;
   TASK-01-03-01-BE1 no longer needs TASK-01-02-09-BE1 (newest setup is
   current); TASK-02-06-01-FE1 and TASK-02-06-03-FE1 drop
   TASK-01-05-04-FE1 (5 h to 3 h), and the new FE2 and FE3 add the markers
   in wave 9; TASK-03-01-03-QA1 drops TASK-03-02-01-BE1.
5. **Design schedule** uses section 8.3's wave numbers (DES-01-02-05 and
   DES-01-05-03 move before wave 1). Milestone 1 design is 144 h.
6. **Wave order fixes.** TASK-03-01-01-BE2 moves to wave 2; the clock and
   remaining-coffee UI moves to the end of wave 11; grind periods
   (TASK-04-01-01-BE2, TASK-04-01-03-BE1) move to wave 10 and the suggestion
   rules declare them.
7. **TQ-08 and TQ-09** are adopted as working assumptions.
8. **TASK-01-06-08-BE1** puts the DQ-11 fallback ranges in a domain module
   (TASK-01-06-08-FE1 3 h to 2 h; TASK-02-03-05-BE1 depends on the new task).

## Changes since revision 1

Revision 1 had 252 tasks and 851 hours. **Revision 2 has 313 tasks and
1,084 hours:**

- 75 tasks added;
- 129 updated;
- 109 unchanged;
- 14 retired (a 15th, TASK-01-01-05-FE8, was retired in revision 3).

Retired IDs are never reused. Each task's header line says New, Updated or
Unchanged.

### What drove the changes

1. **Setups replace toolkits** (S-02, S-04, S-08).
   - A setup is a machine, a grinder and a basket, each an exact catalog
     model.
   - Setups never change: a different combination is a different setup, and
     the same combination reuses its setup and recipes.
   - The schema has `setups` and `setup_parts`, with a unique `partsKey` per
     household. Shots and recipes store `setupId` only.
   - There's a setup builder, a current setup (DQ-18), switching on Brew and
     in the log (PEC-09), and dial-in from the closest setup (DQ-19, DQ-20).
     There's no editing and no retire.
   - The toolkit tasks are rewritten as setup tasks. The retire, edit, swap
     and re-dial tasks are retired.
2. **Puck prep:** `usedWdt` and `usedPuckScreen` on shots and recipes, copied
   by one-tap pulls (STORY-01-03-06).
3. **Two freshness clocks, both paused by freezing.**
   - `packedAt` on batches.
   - There's no estimated age any more (review B1).
   - The since-opening clock is new (STORY-03-03-04).
4. **"Open" excludes frozen portions** (review M5). One definition,
   `isOpen`, in TASK-03-02-04-BE1, is used by the one-tap rule, Brew's
   defaults, On hand grouping and SH-PORTION.
5. **Taste relative to the persona.**
   - `tasteBalance`, `tasteStrength`, `tasteBody` and `tasteSweetness`
     (-2..2, with sweetness -2..0) plus `tasteTags` replace the 1-5 scores
     and defects.
   - The off path is the SH-OFF sheet, and its answers are stored on the
     one-tap shot (DQ-23, review M1).
   - Leaving the tasting screen saves (review M2).
6. **Rule-based dial-in suggestions** (EPIC-02-03, now M).
   - Levers in order: puck prep, grind, yield, dose (within the basket's dose
     range), temperature, milk.
   - The starting step sizes are answer 1: grind 1 step for "a bit" and 2 for
     "much", yield 2 g, dose 0.5 g, temperature 1 °C, milk about 30 ml.
   - Temperature only when grind can't fix the balance (answer 2).
   - The tech lead writes a scenario test suite. A scenario passes when it
     gets the expected lever and direction. No LLM.
7. **Milk.**
   - A `milk_types` table and a household starter milk list.
   - `typicalMilkMl` on drink types: cortado 60 ml, flat white 120 ml,
     cappuccino 120 ml, latte 200 ml, macchiato 15 ml, and none for the rest
     (answer 3).
   - `milkTypeId` and `milkMl` on shots and recipes.
   - Milk is never part of a recipe's identity.
8. **Basket dose range** in capabilities.
   - The seed carries every basket's range, curated by the Head of Product
     as admin.
   - A household adding a basket answers one small question, with "not sure"
     (answer 4).
9. **Journal** replaces "Shots" (keys `journal.*`, `nav.journal`).
   - Filters by drink, coffee and setup.
   - Pre-filtered from Brew.
   - "Dial in from this".
10. **Beans** replaces "Pantry" (keys `beans.*`, `nav.beans`).
    - On hand is grouped by state.
    - New MVP epic EPIC-03-06: the Tried list and the coffee screen
      (SCR-COFFEE).
11. **Coffee used** (answer 6): an off shot and its fix both count, because
    both used beans. SQ-14 is closed.
12. **Tried and personas** (answer 5): the Tried summary ignores personas
    until sub personas exist (Next).
13. **PR #3** already renames toolkit to setup. Tasks extend its code and
    don't rebuild it.
    - Still missing from it: the Journal and Beans renames, milk, prep
      toggles, the new tasting and the guard against sections shrinking.
    - TASK-01-01-05-FE7 and the extension tasks below cover these. The
      guard task FE8 was retired in revision 3.
14. **Review findings for the tech lead.**
    - **M7:** the design tasks now have hours and are scheduled ahead of the
      waves that need them (section 8, "Design schedule").
    - **m5:** undeclared dependencies are declared; see the notes on
      TASK-01-06-01-BE2 and TASK-01-02-01-BE1.
    - **M3:** gone, because there's no retire action.
    - **M5:** resolved by the single `isOpen` rule.
    - **m8:** "reopen on the last tab" is cut, so TASK-01-01-05-FE6 is
      retired.
15. **Next.js:** no new framework API beyond revision 1 (Server Actions,
    Route Handlers, cookies). The Journal filters use URL search params.
16. **Milestone 1** (S-02, added by the Head of Product during this
    revision): a lean walking skeleton over EPIC-01-01, 01-02, 01-03, 03-01
    and 02-06. Section 8.1 lists exactly which tasks belong to it and which
    are deferred. It adds one task, TASK-01-02-01-BE6 (preparing the seed
    catalog data). The Firebase project is a prerequisite, not a task.

### Retired (14 in revision 2, plus 1 in revision 3)

| Task | Why |
|---|---|
| TASK-01-01-05-FE6 | Reopen on the last tab, cut by review m8 (STORY-01-01-05 AC 5 removed) |
| TASK-01-02-03-BE1, FE1, FE2, QA1 | STORY-01-02-03 retired: no retire in the MVP. The part screen moves to the new TASK-01-02-02-FE5 and FE6. |
| TASK-01-02-06-BE1, FE1, QA1 | STORY-01-02-06 retired: setups are never edited |
| TASK-01-02-07-BE1, FE1, QA1 | STORY-01-02-07 retired: there are no swaps |
| TASK-02-01-05-BE1, FE1, QA1 | STORY-02-01-05 retired: replaced by the closest-setup dial-in (TASK-02-01-06-*) |
| TASK-01-01-05-FE8 | Retired in revision 3: no defining story; guard dropped. The ID is never reused. |

### Added (75)

| Story | New tasks |
|---|---|
| STORY-01-01-05 | FE7 (rename PR #3's tabs and keys) |
| STORY-01-01-08 (new) | BE1 (milk_types schema), BE2, FE1, QA1 |
| STORY-01-02-01 | BE6 (prepare the seed catalog data, Milestone 1) |
| STORY-01-02-02 | FE5 (part screen), FE6 (part route) |
| STORY-01-02-04 | BE2 (setups and setup_parts schema) |
| STORY-01-02-08 (new) | BE1, FE1, QA1 |
| STORY-01-02-09 (new) | BE1, BE2, FE1, QA1 |
| STORY-01-03-06 (new) | BE1, FE1, QA1 |
| STORY-01-03-07 (new) | BE1, FE1, FE2, QA1 |
| STORY-01-05-02 | FE2 |
| STORY-01-06-01 | FE3 (basket dose-range question) |
| STORY-02-01-06 (new) | BE1, BE2, FE1, FE2, QA1 |
| STORY-02-02-07 (new) | FE1, FE2, QA1 |
| STORY-02-03-04 (new) | BE1, FE1, FE2, QA1 |
| STORY-02-03-05 (new) | BE1, FE1, FE2, QA1 |
| STORY-02-03-06 (new) | BE1, BE2, QA1 |
| STORY-02-03-07 (new) | BE1, FE1, QA1 |
| STORY-02-06-04 (new) | BE1, FE1, FE2, QA1 |
| STORY-02-06-05 (new) | FE1, QA1 |
| STORY-02-06-06 (new) | BE1, FE1, QA1 |
| STORY-03-02-05 (new) | BE1, FE1, QA1 |
| STORY-03-03-04 (new) | BE1, FE1, QA1 |
| STORY-03-06-01 to 04 (new epic) | 12 tasks |

## Contents

1. Not broken down yet
2. How to read this file
3. What exists and what this plan assumes
4. Technical approach (4a: the Next epics, revision 5)
5. Definition of done for every task
6. Schema and migrations (first; 6a: revision 5)
7. Tasks by story
8. Build order, Milestone 1 and design schedule (8.4: revision 5 waves)
9. Questions (9.3: revision 5)
10. Technical risks and tech debt (R-26 to R-40: revision 5)
11. Totals (revision 5 table at the end)

---

## 1. Not broken down yet

These are **not broken down yet: re-planned before they're built.**

**Next: broken down in revision 5.** All ten Next epics now have tasks in
section 7, built from `stories.md` revision 5 (their open questions are closed:
DQ-29 to DQ-49 and the Head of Product's answers of 2026-11-16). The old
"blocked on" reasons no longer apply.

| Epic | Stories | Tasks (section 7) |
|---|---|---|
| EPIC-05-03 Keep your coffee history when you change phones | STORY-05-03-01 to 04 | 15 |
| EPIC-02-05 Make the drink and milk lists yours | STORY-02-05-01 to 08 | 29 |
| EPIC-02-04 Give one bag its own recipe | STORY-02-04-01 to 04 | 13 |
| EPIC-03-05 Know when you'll run out (run-out only) | STORY-03-05-01 to 03 | 11 |
| EPIC-03-07 Find any coffee in Beans (new) | STORY-03-07-01 to 05 | 17 |
| EPIC-05-01 Brew for someone else in the household | STORY-05-01-01 to 07 | 25 |
| EPIC-04-02 Suggested grind that follows bean age and recent shots | STORY-04-02-01 to 09 | 22 |
| EPIC-04-03 Re-dial once after maintenance and keep every recipe | STORY-04-03-01 to 05 | 21 |
| EPIC-04-04 Keep recipes right after new burrs of a different design | STORY-04-04-01 to 03 | 11 |
| EPIC-05-02 Invite them to take over their own profile (moved from Later, sequenced last) | STORY-05-02-01 to 07 | 25 |

STORY-03-05-04 is retired (moved to STORY-03-07-01 to 03). The MVP change
STORY-02-01-07 to 09 and its seven amendments have 19 tasks under EPIC-02-01.

**Later (19 stories, 6 epics).** These are AI and community features. Each
needs evals and a model choice first (S-01).

| Epic | Stories | Why not now |
|---|---|---|
| EPIC-06-01 Scan a bag instead of typing it | STORY-06-01-01 to 03 | Later. It's an AI feature, and the model and eval set aren't chosen. |
| EPIC-06-02 Get a grounded fix when a shot goes wrong | STORY-06-02-01 to 03 | Later. It's AI with RAG, and STORY-06-02-02 is flagged to split. |
| EPIC-06-04 Tare learns your palate as you log | STORY-06-04-01 to 03 | Later. What makes a "drink style" isn't defined. |
| EPIC-06-05 Share your shots, with your consent | STORY-06-05-01 to 03 | Later. Consent withdrawal and cohorts are still open. |
| EPIC-06-06 Start a new bag from the community, tuned to you | STORY-06-06-01 to 04 | Later. It depends on four other Later epics. |
| EPIC-06-07 Merge duplicate catalog entries, with AI suggestions | STORY-06-07-01 to 03 | Later. Merges are a manual admin task until then. |

MVP code keeps these epics possible without rework:

- catalog readers follow merge pointers;
- `share_data_consent` and `is_network_eligible` exist but stay false;
- taste is stored per persona, so palate learning can use it later;
- the suggestion rules live in one domain module the Later Coach can build
  on.

---

## 2. How to read this file

- **Task ID:** `TASK-II-EE-SS-XXn`: the story ID, then `BE`, `FE` or `QA`, then
  a number within that story. Example: `TASK-01-01-01-BE1`.
  - IDs are stable. A retired ID is never reused, so gaps are retired tasks.
  - New tasks take the next free number.
- **Header line:** label, parent story, estimate, status (New, Updated or
  Unchanged since revision 1), then dependencies.
- **Build** says what to build and which files it touches. **Done when**
  gives checkable conditions, citing the parent story's acceptance criteria
  as `AC n`.
- **Dependencies** are task IDs, plus:
  - `DES-*`: design tasks;
  - `PR-3`: PR #3 merged;
  - open questions from section 9.
- **Estimates** are focused hours, 2 to 16, including the task's own stories
  or tests. Nothing exceeds 16.
- **"Wire"** means connecting a props-only screen to a route, its reads
  (Server Components) and its writes (Server Actions).
- **Milestone 1** is marked in section 8.1, not on each task. Where a task
  is trimmed inside Milestone 1, section 8.1 says how.

---

## 3. What exists and what this plan assumes

**In this checkout**

- **Next.js 16.4 App Router.** `src/app` has a placeholder page. The root
  layout provides next-intl (`en` only, RTL detection in
  `src/i18n/config.ts`).
- **`src/db/schema.ts`** has the conventions comment only, no tables. The
  whole S-08 schema is still to be implemented, so the setup, milk and taste
  changes need **no data migration**, only different first migrations.
  `drizzle.config.ts` uses the `turso` dialect with `file:./data/tare.db`.
- **`src/lib/units.ts`**:
  - `msToSeconds` and `secondsToMs`;
  - decimal parsing and sanitising;
  - `formatValueParts` and `unitSymbol`;
  - `CanonicalUnit` is `gram | second | celsius` (no Fahrenheit or
    millilitre yet).
- **`src/components/ui`:** Button, Card, Input and NumberWheel, plus
  `src/components/brand/Logo`.
- **Tests:** one Vitest project with Storybook story tests and axe. There's no
  Node test project.

**PR #3 (branch `design/mvp-screens`, not in this checkout), treated as
existing and props-only**

- **Components in `src/components/ui`:**
  - TabBar (NC-01)
  - PageHeader (NC-02)
  - ListRow (NC-03)
  - ChipGroup (NC-04)
  - SelectField (NC-06)
  - Toggle (NC-13)
  - ShotValues (NC-08)
  - ShotDial (NC-09)
- **Screens in `src/components/screens`:** HomeScreen, ShotLogScreen and
  RecentShotsScreen with stories, fixtures and PhoneFrame.
- **Already renamed** from toolkit to setup.
- **Not yet in it** (each planned as an extension here):
  - Shots renamed to Journal, and Pantry to Beans (TASK-01-01-05-FE7);
  - milk (TASK-01-03-07-FE2);
  - prep toggles (TASK-01-03-06-FE1);
  - the just-right tasting (TASK-01-05-02-FE1, TASK-01-05-01-FE2);
  - ChipGroup's just-right and filter variants (TASK-01-05-02-FE1,
    TASK-02-06-04-FE1).
- Each task that extends PR #3 code checks what the PR already covers first.
  The estimates assume the extension is needed.

**Not built yet**

- **Components:**
  - Sheet (NC-05)
  - PulledState (NC-07)
  - Notice (NC-10)
  - Skeleton (NC-11)
  - EmptyState and Checklist (NC-12)
  - Icon (NC-14)
  - Meter (NC-15)
  - SuggestionCard (NC-16)
- **NumberWheel extensions:** finer and coarser captions, and the Fahrenheit
  and millilitre units.
- **Sheets:**
  - SH-SELECT
  - SH-PORTION
  - SH-PIN
  - SH-OFF
  - SH-PORTION-ACTIONS
  - SH-SPLIT
  - SH-STOCK
  - SH-DATE
  - SH-MAINTENANCE
  - SH-CONFIRM
- **Screens:** every screen except the three in PR #3, including the tasting
  screen, the Setup tab, the setup builder, the part screen, Beans, the bag
  screen and the coffee screen.

---

## 4. Technical approach

**Decided** (S-02, TQ-01 to TQ-07): a Firebase ID token exchanged once at
`POST /api/session` for an httpOnly session cookie; one server-side libSQL
client, with Turso when deployed; Server Actions for writes; Route Handlers
only for the session, catalog search and the duplicate-URL check; integer
millisecond timestamps; `is_recalibration` as a flag; "not sure" as unknown
values in the capabilities JSON; and local days from a time-zone cookie.

**Module layout**

| Path | What lives there |
|---|---|
| `src/db/client.ts`, `schema.ts`, `migrations/`, `seed/` | Database client, S-08 tables, migrations, catalog seed and loader |
| `src/domain/` | Pure TypeScript, unit-tested: capabilities, grind scale, setup keys and the closest setup, recipe resolution, home defaults, the two clocks, `isOpen` and portion state, remaining weight, On hand groups, Tried summary, grind periods, URL normalisation, taste tags, local days |
| `src/domain/suggest/` | The dial-in suggestion rules (EPIC-02-03), with no database or React. Its step sizes and freshness thresholds live in one constants file. |
| `src/server/auth/`, `dal/`, `actions/` | Session, household-scoped reads, and Server Actions that each check the session and ownership |
| `src/app/(app)/` | Tabs: `/` (Brew), `/journal`, `/journal/[shotId]`, `/beans`, `/beans/[batchId]`, `/beans/coffee/[beanId]`, `/setup`, `/setup/parts/[unitId]` |
| `src/app/(task)/` | Full-screen tasks: `/log`, `/taste/[shotId]`, `/beans/add`, `/setup/add-part`, `/setup/builder`, `/catalog/pick`, `/catalog/add`, `/profile` |
| `src/app/api/` | `session`, `catalog/search`, `catalog/check-url` |

**Proposals that tasks depend on**

- **Setup identity.**
  - `partsKey` is the three `ownedHardware` IDs, sorted and joined.
  - `findOrCreateSetup` inserts with the unique index, and on conflict reads
    the existing row, so two quick taps never make two setups.
- **Current setup (DQ-18), TQ-16, open.**
  - The current setup is the setup of the persona's latest shot, unless a
    setup was chosen more recently.
  - The choice is stored as a device cookie, `currentSetup`, holding the
    setup ID and the time it was chosen. S-08 has no column for it.
  - Until wave 6 the household can have only one setup (the builder refuses a
    second), so "current" is that setup and no rule or cookie is built yet.
    TASK-01-02-04-BE3 lifts the limit together with the rule.
- **Suggestions.**
  - Calculated on read from the shot, its answers and the setup's
    capabilities, never stored.
  - "Pending" means the latest shot on that coffee, setup and drink has a
    suggestion that hasn't been dismissed.
  - A dismissal is stored on the device only (DQ-25), in localStorage keyed by
    the shot's ID. If localStorage is unavailable, a dismissal lasts for the
    session.
- **Journal filters.**
  - The filters live in URL search params, so the back button keeps them
    (STORY-02-06-05 AC 3).
  - Brew's current drink and coffee are client state (DQ-17). The tab bar's
    Journal link reads them to build its link.
- **Unchanged from revision 1:**
  - return-to and drafts in sessionStorage;
  - one-tap idempotency through a client-generated ID;
  - an 8-second undo window, with 13 seconds accepted on the server.

---

## 4a. Technical approach for the Next epics (revision 5)

Read from the built code. The decisions below are the tech lead's; the ones
that need the Head of Product are in section 9.3. TD-n numbers are cited by
tasks.

- **TD-1 Acting persona (EPIC-05-01).**
  - Fifteen places select "the default persona" with `personas.isDefault`:
    `shots.ts`, `pull.ts`, `home.ts`, `logStart.ts`, `dialIn.ts`,
    `profile.ts`, `recipes.ts` (3), `logContext.ts` (2) and `setups.ts` in
    `src/server/dal`, plus the bootstrap and fixtures.
  - One module, `src/server/dal/persona.ts`, replaces them: `mainPersona()`,
    `listPersonas()` and `actingPersona()`.
  - **Main persona** for a viewer is the persona claimed by the signed-in user
    (`personas.userId`), else the household's `isDefault` persona. This is
    what lets a joiner's claimed profile become "my main persona"
    (STORY-05-02-03) without changing the schema. `isDefault` is never
    cleared (a leaver's profile keeps it, unclaimed), so there is always a
    fallback.
  - The chosen persona is a field on the existing `brewChoice` cookie
    (`src/domain/brewChoice.ts`, `src/lib/brewChoiceCookie.ts`,
    `src/server/brewChoice.ts`). It holds for `BREW_CHOICE_RESET_MS` (30
    minutes away) and, unlike drink and coffee, it survives a pull.
  - The server validates the cookie's persona against the household on every
    request and falls back to the main persona. A persona ID from the client
    is never trusted for another household.
  - Writes that record taste take the acting persona; `loggedByUserId` stays
    the signed-in user.
- **TD-2 Which recipe a shot was brewed from (DQ-45).** No new column. The rule
  is a pure function, `src/domain/drift/recipeInForce.ts`: among pins for the
  same coffee (merge group), persona, setup and drink with `pinnedAt` at or
  before the shot, the newest; a bag-scoped pin for the shot's own bag wins; a
  bag recipe removed after the shot (`removedAt`, TD-6) still counted at the
  time. **Each shot is judged against that recipe's grind with servicing
  applied** (`resolveRecipeGrind`, TD-5), not the stored grind; otherwise the
  age and bag terms absorb a confirmed shift and the composition adds it again
  (about twice the shift on coffees not re-dialled). No match means "left
  out", counted. The follow-up (a nullable recipe
  link on shots) is only for the evals to ask for (R-27).
- **TD-3 Drift is a pure engine (DQ-32 revised, DQ-43).** `src/domain/drift/`
  holds the window, weights, age term, bag term and composition; every number
  is in `src/domain/drift/constants.ts` as a starting value the evals tune
  (3-day window, reach back to at least 3 shots but never past the last
  grinder event, at most 10, a 3-day half-life so today counts about twice as
  much as 3 days ago, a 1-step floor, a cap). Composition order, once:
  recipe grind, servicing shift and stretch (EPIC-04-03/04), age term, bag
  term, clamp to the grinder's range, round to its step. Same input, same
  output. Pooling is by grinder unit across personas and setups, each shot
  judged against its own recipe; the nudge is per recipe in that recipe's own
  units; no persona name is ever returned.
- **TD-4 Where the adjustment is computed and recorded.** Server side only
  (`src/server/dal/grindAdjustment.ts`), called by `getHome`,
  `getDialInStart`, `pullShot`. A one-tap pull recomputes it and records the
  grind it computes (the client never sends a grind); "use my recipe's grind
  for this shot" is a flag on the pull input, not stored. Any failure returns
  no adjustment and never blocks a pull. Fix mode, dial in from a shot, edit
  mode and entering a recipe never call it (DQ-34).
- **TD-5 Servicing on read (EPIC-04-03/04).** `maintenance_events` already has
  `grind_shift`, `grind_scale` (a factor, 1 meaning none) and
  `offset_source_recipe_id`, all unused. Nothing is added. State is derived
  (TD-7). `src/domain/servicing.ts` applies, in date order, every confirmed
  event after the recipe's `pinnedAt` on that grinder: `grind x scale + shift`.
  Stored recipes are never rewritten. One reader, `resolveRecipeGrind`, is
  used by Brew, the log start, the pin sheet's "replaces" block, the bag and
  coffee rows and the pull.
- **TD-6 Bag recipes (EPIC-02-04).** `pinned_recipes.batch_id` exists and the
  readers today skip it. Reads become scope-aware (`getCurrentRecipe(key,
  batchId?)`). Removing a bag recipe ("stops applying, is kept", Head of
  Product Q3) needs one new nullable column, `removed_at`, on
  `pinned_recipes`; every reader of bag recipes filters it (R-33).
- **TD-7 Re-dial state is derived.** For a grinder event: `awaiting` is
  recalibrating, `grind_shift` null and a recipe pinned before it on any setup
  with that grinder; `confirmed` has a shift or scale; `no adjustment` is a
  stored shift of 0 with scale 1; `nothing to map` is no recipe before it. The
  set of re-dials for a stretch fit (EPIC-04-04) is also derived: for each
  coffee/persona/setup/drink with a pin before the event, its first pin after
  the event on a setup with the grinder. No join table; the confirmed values
  on the event are the user's decision and are not recomputed. "Not now" is
  device-only (`src/lib/dismissals.ts` pattern).
- **TD-8 Run-out is calculated on read (EPIC-03-05).** Pure
  `src/domain/runOut.ts` from finished portions, doses of all shots (one-tap
  included), stock checks (`getRemaining`) and `batches.purchasedAt`. Nothing
  stored. Constants (three finished portions, a month of silence, the span
  breaks) in one file.
- **TD-9 Origin (EPIC-03-07).** One nullable `canonical_beans.origin` text
  column holding a key: an ISO 3166-1 alpha-2 code for a producing country,
  the literal `blend`, or a normalised `other:` text (trimmed, collapsed,
  case-folded), all in `src/domain/origin.ts`. Labels come from
  `Intl.DisplayNames` and message keys, never stored. A household may set it
  only on a coffee it added that is still unverified (the
  `canEditCapabilities` pattern in `modelCapabilities.ts`).
- **TD-10 Drink and milk lists (EPIC-02-05).** No schema change. New DALs
  `src/server/dal/drinks.ts` and `milks.ts`, one shared name rule in
  `src/domain/listName.ts` (trim, 1 to 40 characters, unique ignoring case
  against every drink or milk of the household including hidden ones and
  starter rows' translated names). "Has milk" and "kind" are written only on
  creation. Hidden items are excluded by `getLogContext` today; a hidden milk
  or drink that is already chosen or has recipes is added back by the readers
  (STORY-02-05-08).
- **TD-11 Google linking (EPIC-05-03) and invites (EPIC-05-02).**
  - Linking uses Firebase's `linkWithPopup`, or `linkWithRedirect` on iOS
    Safari (`getRedirectResult` on return), in one client module,
    `src/lib/firebase/google.ts`, beside `client.ts`. A successful link keeps
    the Firebase uid, so no data moves. `auth/credential-already-in-use`
    returns the Google credential for the switch path.
  - "Nothing entered yet" is one function, `isHouseholdEmpty`
    (`src/server/dal/emptiness.ts`): no `owned_hardware`, no `batches`, no
    `extractions`. Switching (05-03) only signs in as the other uid. Joining
    (05-02) deletes the joiner's empty household in the same transaction that
    adds the membership and claims the profile.
  - Invites are rows in a new `invites` table (id, household, persona,
    creator, `created_at`, `expires_at`, `used_at`, `used_by_user_id`,
    `withdrawn_at`). Status (pending, used, withdrawn, expired) is derived,
    never stored. The link token is `id.hmac(INVITE_SECRET, id)`: it can be
    shown again without storing the secret part, a database leak yields no
    working link, and use is a conditional update (`used_at IS NULL`) in an
    immediate transaction. `INVITE_SECRET` and `APP_ORIGIN` are deployment
    secrets and names only in `.env.example`.
  - The join page is a public route group outside `(app)` and `(task)`
    (`src/app/(public)/join/[token]`), so it has no `SessionGate` and creates
    no account; it sends `Referrer-Policy: no-referrer` and is not cached or
    indexed.
  - Leaving sets the leaver's persona `userId` to null, removes the
    membership and creates a new household with the bootstrap's own insert
    code, factored out of `createAccount`. A user has one household at a time
    (`findAccount` takes the first membership), and that stays true.
- **TD-12 Evals and observability for drift (STORY-04-02-09).** Scenarios as
  Vitest tests next to the existing suggestion scenarios
  (`src/domain/suggest/__tests__/scenarios.test.ts`), a pass-rate report with
  no target set (X-2), and a constants snapshot test that fails when a number
  changes without the scenarios being re-run. Outcomes (adjusted, none,
  limited, failed, with a reason code, no personal data) are one structured
  log line from one function until an observability stack exists (R-28).
- **Next.js 16.** The Beans filters (URL search params), the public join route
  and the persona cookie touch dynamic request APIs under `cacheComponents`.
  Every FE or BE task that adds a route or reads `searchParams` or cookies
  starts by reading the matching guide in `node_modules/next/dist/docs/`
  (AGENTS.md).

---

## 5. Definition of done for every task

These apply to every task and aren't repeated:

- `npm run lint`, `npx tsc --noEmit` and `npx vitest run` pass: story tests
  with axe, plus the Node project once TASK-01-01-04-QA1 lands.
- **Strings:** no user-facing string in code; keys go in `en.json`, grouped as
  in design section 1.3:
  - `journal.*`, `beans.*` and `coffee.*`;
  - `milks.*`, `taste.tags.*`, `suggest.*` and `off.*`.

  Components take text as props.
- **Numbers and units** go through `Intl` or `src/lib/units.ts`, never joined
  by hand.
- **Logical CSS only,** and an RTL story for every new component.
- **Tokens:** semantic tokens only. `signal` appears only through the Notice
  warning tone, for channelling. Suggestions and empty states use ink.
- **Never stored:** derived values (ratio, clocks, remaining coffee,
  suggestions, Tried).
- **No personal data** in code, fixtures, seed data, stories or tests.
- **Commits** are small and focused.
- **Server code:** actions and DAL functions check the session and household,
  and add their case to the isolation suite (TASK-01-01-04-QA2).

---

## 6. Schema and migrations (first)

These implement S-08 as it now stands, each as its own task with its own
migration, before any feature uses the table. S-08 already has:

- `timestamp_ms` timestamps;
- `is_recalibration` on maintenance events;
- the "not sure" and basket dose values in the capabilities JSON;
- `setups` and `setup_parts`;
- `milk_types`, `typicalMilkMl` and `packedAt`;
- prep, milk and taste columns on shots and recipes.

The tasks add indexes, which change no behaviour.

##### TASK-01-01-01-BE1 · Add the database client and data access layer skeleton
`backend` · Parent: STORY-01-01-01 · 4 h · Unchanged · Depends on: none
- **Build:**
  - `src/db/client.ts`: libSQL and Drizzle, `server-only`, reading
    `DATABASE_URL` and `DATABASE_AUTH_TOKEN` (Turso when deployed, the local
    file otherwise).
  - Check foreign-key enforcement, and turn it on if needed.
  - The ID helper `src/db/ids.ts`.
  - Empty `src/server/dal/` and `src/server/actions/` folders with a
    conventions note.
  - `.env.example` with variable names only, and `data/` in `.gitignore`.
- **Done when:**
  - The dev server connects to the local file.
  - Importing the client from a client component fails the build.
  - Foreign keys are verified on.
  - No secrets are committed.

##### TASK-01-01-01-BE2 · Add users, households, household members and personas tables
`backend` · Parent: STORY-01-01-01 (also 01-01-03, 01-01-04) · 3 h · Unchanged · Depends on: TASK-01-01-01-BE1
- **Build:**
  - The S-08 `users` table (unique `firebase_uid`), `households`,
    `household_members` (composite key) and `personas` (nullable `name`,
    `is_default`).
  - `timestamp_ms` timestamps.
  - A migration.
- **Done when:**
  - The migration applies from empty.
  - Columns match S-08.
  - `firebase_uid` is unique.

##### TASK-01-01-02-BE1 · Add the drink types table with typical milk amounts
`backend` · Parent: STORY-01-01-02 · 2 h · Updated (typical milk) · Depends on: TASK-01-01-01-BE2
- **Build:**
  - `drink_types` per S-08: `name_key`, `name`, `has_milk`,
    `typical_milk_ml` (`real`, nullable), `hidden` and `sort_order`.
  - An index on `(household_id, sort_order)`.
  - A migration.
- **Done when:**
  - The migration applies.
  - A drink without milk has a null `typical_milk_ml`.

##### TASK-01-01-08-BE1 · Add the milk types table
`backend` · Parent: STORY-01-01-08 · 2 h · New · Depends on: TASK-01-01-01-BE2
- **Build:**
  - `milk_types` per S-08: `household_id`, `name_key`, `name`, `kind` (dairy
    or plant), `hidden` and `sort_order`.
  - An index on `(household_id, sort_order)`.
  - A migration.
- **Done when:**
  - The migration applies.
  - A row with only `name_key` and one with only `name` are both valid.

##### TASK-01-02-01-BE1 · Add hardware makers and models, with a typed capabilities shape
`backend` · Parent: STORY-01-02-01 (also 01-02-02, 01-06-01, 06 to 09) · 4 h · Updated (three kinds, basket dose range) · Depends on: TASK-01-01-01-BE2, TASK-01-01-04-QA1
- **Build:**
  - `hardware_makers` and `canonical_hardware` per S-08. `kind` is limited
    to `machine`, `grinder` or `basket`.
  - A migration.
  - `src/domain/capabilities.ts`: the TypeScript type and a
    `parseCapabilities` guard covering:
    - the machine's temperature and pressure;
    - the grinder's grind;
    - the basket's dose `{ min, max }`;
    - S-08's "not sure" values (unknown control, a null gauge, null counts,
      units, min, max and step, and an unknown grind type and coarser
      direction).
  - The guard rejects a capability that doesn't belong to the kind, for
    example a dose range on a grinder.
- **Done when:**
  - The migration applies.
  - The guard accepts every S-08 shape and rejects malformed or wrong-kind
    JSON.
  - Its unit tests run in the Node project (TASK-01-01-04-QA1, declared per
    review m5).

##### TASK-01-02-01-BE2 · Add catalog URLs, aliases and merges tables
`backend` · Parent: STORY-01-02-01 (also 01-06-04, 01-06-05) · 3 h · Unchanged · Depends on: TASK-01-02-01-BE1
- **Build:**
  - `catalog_urls` (index on `normalized_url`), `catalog_aliases` (index on
    `entity_type, name`) and `catalog_merges` per S-08.
  - A migration.
- **Done when:** The migration applies, and URLs and aliases can point at any
  of the four entity types.

##### TASK-03-01-01-BE1 · Add roasters and beans tables
`backend` · Parent: STORY-03-01-01 (also 01-06-02) · 2 h · Unchanged · Depends on: TASK-01-01-01-BE2
- **Build:** `roasters` and `canonical_beans` per S-08, plus a migration.
- **Done when:** The migration applies, and `tasting_notes` round-trips a
  string array.

##### TASK-01-02-02-BE1 · Add the owned hardware table
`backend` · Parent: STORY-01-02-02 (also 01-02-04 to 09) · 2 h · Updated (toolkits removed) · Depends on: TASK-01-02-01-BE1
- **Build:**
  - `owned_hardware` per S-08, with an index on `household_id`.
  - `retired_at` exists but isn't written in the MVP (no retire action).
  - The old `toolkits` table is not created.
  - A migration.
- **Done when:** The migration applies, and no `toolkits` table exists.

##### TASK-01-02-04-BE2 · Add the setups and setup parts tables
`backend` · Parent: STORY-01-02-04 (also 01-02-05, 08, 09, 02-01, 02-02) · 3 h · New · Depends on: TASK-01-02-02-BE1
- **Build:**
  - `setups` per S-08: `parts_key`, a nullable `name` and `created_at`, with
    the unique index `setups_household_parts` on `(household_id, parts_key)`.
  - `setup_parts` with the composite key `(setup_id, owned_hardware_id)`, and
    an index on `owned_hardware_id` to answer "which setups is this part in".
  - `src/domain/setupKey.ts`: `partsKey(ids)` sorts and joins the IDs.
  - A migration.
- **Done when:**
  - The migration applies.
  - The same three parts in any order give the same key.
  - A second insert with the same household and key violates the unique
    index.

##### TASK-03-01-02-BE1 · Add batches, portions and stock checks tables
`backend` · Parent: STORY-03-01-02 (also 03-02, 03-03, 03-04) · 3 h · Updated (packing date) · Depends on: TASK-03-01-01-BE1
- **Build:**
  - `batches` per S-08, including `packed_at`.
  - `batch_portions` (index on `batch_id`) and `stock_checks` (index on
    `portion_id, checked_at`).
  - A migration.
- **Done when:**
  - The migration applies.
  - No status, age or remaining column exists.

##### TASK-01-03-03-BE1 · Add the extractions table
`backend` · Parent: STORY-01-03-03 (also every shot story) · 4 h · Updated (setup only, prep, milk, taste) · Depends on: TASK-01-02-04-BE2, TASK-03-01-02-BE1, TASK-01-01-02-BE1, TASK-01-01-08-BE1
- **Build:** `extractions` per S-08:
  - `setup_id` only (no grinder or machine columns);
  - `used_wdt` and `used_puck_screen`, not null with a default of false;
  - `milk_type_id` and `milk_ml`;
  - `reaction` and `user_rating`;
  - `taste_balance`, `taste_strength`, `taste_body` and `taste_sweetness`
    (integers);
  - `taste_tags` (JSON, typed as the six tag keys from TASK-01-05-03-BE1's
    type);
  - `yield_time` as integer ms;
  - `is_network_eligible` with a default of false.

  Indexes on `(household_id, created_at)`, `(portion_id)` and
  `(setup_id, created_at)`. Plus a migration.
- **Done when:**
  - The migration applies.
  - No sensory-score or defects columns exist.
  - Prep columns default to false.

##### TASK-02-01-01-BE1 · Add the pinned recipes table
`backend` · Parent: STORY-02-01-01 (also 02-01-02 to 06) · 2 h · Updated (setup only, prep, milk) · Depends on: TASK-01-03-03-BE1
- **Build:**
  - `pinned_recipes` per S-08: `setup_id`, the prep columns, `milk_type_id`
    and `milk_ml`, and nullable `batch_id` and `source_extraction_id`.
  - An index on `(bean_id, persona_id, setup_id, drink_type_id, pinned_at)`.
  - A migration.
- **Done when:**
  - The migration applies.
  - Two pins for one key coexist.
  - Milk isn't part of the index.

##### TASK-04-01-01-BE1 · Add the maintenance events table
`backend` · Parent: STORY-04-01-01 (also 04-01-02 to 04) · 2 h · Unchanged · Depends on: TASK-02-01-01-BE1
- **Build:**
  - `maintenance_events` per S-08, with `is_recalibration` (not null, default
    false), and an index on `(owned_hardware_id, occurred_at)`.
  - The offset columns stay null in the MVP.
  - A migration.
- **Done when:** The migration applies, and no MVP code writes the offset
  columns.

##### TASK-01-01-04-QA1 · Add a Node test project with a migrated test database and fixtures
`qa` · Parent: STORY-01-01-04 · 5 h · Updated (setup and milk fixtures) · Depends on: TASK-01-01-01-BE1, TQ-09 (assumed)
- **Build:**
  - A second Vitest project (`unit`, Node) for `src/domain/**` and
    `src/server/**` tests.
  - An in-memory libSQL database migrated for each test file.
  - Generic fixture builders: a household with a user, persona, drinks,
    milks, a machine, a grinder and a basket, a setup, a bag and a portion.
  - A way to call actions with a fake session.
- **Done when:**
  - `npx vitest run` runs both projects.
  - A sample test isolates two households.

##### TASK-01-01-01-QA1 · Verify the schema and migrations against S-08
`qa` · Parent: STORY-01-01-01 · 3 h · Updated (setups, milk, taste) · Depends on: TASK-04-01-01-BE1, TASK-01-01-04-QA1
- **Build:** A schema test that applies every migration and checks:
  - each S-08 table and column, its type and nullability, including
    `timestamp_ms`;
  - the unique `setups` index;
  - no toolkit, defect or sensory-score columns;
  - no stored derived values.
- **Done when:** The test fails on any rename or retype.

---

## 6a. Schema changes for revision 5

Four small migrations (three columns and one table), each its own task and
each before anything that uses it. Everything else in the Next epics runs on the existing tables
(`maintenance_events` already has the shift, stretch and source columns;
`personas.user_id` is already nullable; `household_members.role` exists). The
next free migration number is taken at the time (the latest is `0012`).

| Task | Change | Used by |
|---|---|---|
| TASK-02-01-07-BE1 | `pinned_recipes.sweetened`, not null, default false | Sweetened on recipes, every recipe-based log start |
| TASK-02-04-04-BE1 | `pinned_recipes.removed_at`, nullable | Removing a bag's own recipe, the recipe readers, recipe-in-force |
| TASK-03-07-04-BE1 | `canonical_beans.origin`, nullable text | Origin on Add a coffee, the coffee screen, the Beans origin filter |
| TASK-05-02-01-BE1 | New `invites` table | Inviting, the join page, claiming, withdrawing |

All are additive; no data is moved or backfilled, and none needs the Head of
Product's data (the origin values for the seed are data work, section 9.3).
Each migration task updates `src/db/schema.test.ts` (the
column and type check) and, for `invites`, the isolation suite
`src/server/__tests__/isolation.test.ts`.

---

## 7. Tasks by story

### INIT-01: Log a shot against your real setup in seconds

#### EPIC-01-01: Start brewing without setting anything up

##### STORY-01-01-01: Open the app and start, with no sign-in

Schema and tests: TASK-01-01-01-BE1, BE2 and QA1 (section 6).

##### TASK-01-01-01-BE3 · Add Firebase anonymous sign-in on the client
`backend` · Parent: STORY-01-01-01 · 4 h · Unchanged · Depends on: TASK-01-01-01-BE1
- **Build:** `src/lib/firebase/client.ts` initialises the app from public env
  config, calls `signInAnonymously` and exposes `getIdToken()`. Persistence
  stays the SDK default. Add `firebase` with `npx npm@11 install`.
- **Done when:** A fresh browser gets a uid and a reload keeps it (AC 5);
  there's no sign-in UI (AC 1); no config is committed.

##### TASK-01-01-01-BE4 · Verify the Firebase ID token on the server and keep a session
`backend` · Parent: STORY-01-01-01 · 6 h · Unchanged · Depends on: TASK-01-01-01-BE3, TASK-01-01-01-BE2
- **Build:** `src/app/api/session/route.ts` (POST) verifies the token with
  `firebase-admin` and sets an httpOnly session cookie. `src/server/auth/session.ts`
  has `getSession()` (cached per request) and `requireSession()`. An expired
  cookie is re-exchanged silently by the client. Credentials come from env
  secrets only.
- **Done when:** A forged or expired token is rejected; Server Components and
  Actions can call `getSession()`; clearing the cookie recovers the same
  account (AC 5).

##### TASK-01-01-01-BE5 · Create the user, household, persona and starter drinks in one transaction
`backend` · Parent: STORY-01-01-01 · 4 h · Updated (revision 3: drinks only; milks join in wave 6 through TASK-01-01-08-BE2) · Depends on: TASK-01-01-01-BE4, TASK-01-01-02-BE2
- **Build:** `src/server/auth/bootstrap.ts`, called the first time a uid is
  seen. In one transaction: user, household, owner membership, default
  persona and the nine drinks. It seeds drinks only; TASK-01-01-08-BE2 adds
  the seven milks to it in wave 6. Idempotent on `firebase_uid`.
- **Done when:** A failure midway leaves no rows (AC 4); two concurrent first
  calls make one household; a second launch creates nothing (AC 5); no
  personal data is stored.

##### TASK-01-01-01-FE1 · Build the start screen (SCR-START) with its story
`frontend` · Parent: STORY-01-01-01 · 4 h · Unchanged · Depends on: DES-01-01-01, TASK-01-01-06-FE1
- **Build:** `src/components/screens/StartScreen`, props-only: normal (wordmark
  only), slow (`start.slow`) and failed (`start.failed` with `actions.retry`).
  Stories for each, plus RTL.
- **Done when:** The stories pass axe; no sign-in, consent or survey element
  (AC 1); failed shows retry and nothing partial (AC 4).

##### TASK-01-01-01-FE2 · Wire first launch: sign in, start a session, land on Brew
`frontend` · Parent: STORY-01-01-01 · 5 h · Unchanged · Depends on: TASK-01-01-01-FE1, TASK-01-01-01-BE5, TASK-01-01-05-FE3
- **Build:** The `(app)` layout renders a client `StartGate` when there's no
  session: sign in, post the token, show slow after 3 s, failed with retry on
  error, then `router.refresh()`.
- **Done when:** A first open reaches Brew with no prompts (AC 1, AC 2); slow
  after 3 s (AC 3); offline shows failed and retry works online (AC 4); a
  reopen goes straight in (AC 5).

##### TASK-01-01-01-QA2 · Test first launch, failure and reopening
`qa` · Parent: STORY-01-01-01 · 5 h · Updated (revision 3: milk checks skipped until wave 6) · Depends on: TASK-01-01-01-FE2
- **Build:** Node tests for bootstrap (one user, household, owner, persona
  and nine drinks; atomic; idempotent and concurrency-safe; the milk checks
  are skipped here and run in TASK-01-01-08-QA1);
  session route tests; StartScreen play tests for slow and failed; a manual
  first-launch script.
- **Done when:** AC 1 to AC 5 each map to a test or manual step.

##### STORY-01-01-02: Get a starter drink list in my language

Schema: TASK-01-01-02-BE1 (section 6).

##### TASK-01-01-02-BE2 · Seed the starter drinks, with typical milk amounts, for each new household
`backend` · Parent: STORY-01-01-02 · 2 h · Updated (typical milk) · Depends on: TASK-01-01-02-BE1
- **Build:** `src/domain/starterDrinks.ts`: nine drinks in S-02 order with
  `name_key`, `has_milk`, `typical_milk_ml` (cortado 60, flat white 120,
  cappuccino 120, latte 200, macchiato 15, others null) and `sort_order`.
  An insert function used inside the bootstrap transaction. `drinks.*` keys.
- **Done when:** A new household has these nine rows as its own copy (AC 1,
  AC 4); milk drinks carry their amount and others none (AC 3).

##### TASK-01-01-02-FE1 · Add one helper that shows a drink's name
`frontend` · Parent: STORY-01-01-02 · 2 h · Unchanged · Depends on: TASK-01-01-02-BE2
- **Build:** `src/domain/drinkName.ts` `drinkLabel(drink, t)`: stored name wins
  over the key.
- **Done when:** Every drink name in the app goes through it.

##### TASK-01-01-02-QA1 · Test the starter list, its translation and household separation
`qa` · Parent: STORY-01-01-02 · 3 h · Updated (typical milk) · Depends on: TASK-01-01-02-FE1, TQ-08 (assumed)
- **Build:** Node tests: nine drinks in order (AC 1); milk drinks have an
  amount and espresso none (AC 3); two households separate (AC 4). Story
  tests with a test-only second language (AC 2).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-01-01-03: See and rename my profile

##### TASK-01-01-03-BE1 · Add profile read and persona rename
`backend` · Parent: STORY-01-01-03 · 3 h · Unchanged · Depends on: TASK-01-01-04-BE1
- **Build:** DAL `getProfile()`; action `renamePersona(name)` (trim, empty to
  null, default persona only); `src/domain/personaLabel.ts`.
- **Done when:** Empty names store null (AC 4); another household's persona
  can't be renamed; the label helper is the only way a name is shown.

##### TASK-01-01-03-FE1 · Fix the Input placeholder contrast
`frontend` · Parent: STORY-01-01-03 · 2 h · Unchanged · Depends on: DES-01-01-04
- **Build:** Replace `placeholder:text-ink-tertiary` in `Input` with the token
  DES-01-01-04 picks; add Input stories for `date`, `url` and decimal.
- **Done when:** Input stories pass axe with a placeholder.

##### TASK-01-01-03-FE2 · Build the profile screen (SCR-PROFILE) with its story
`frontend` · Parent: STORY-01-01-03 · 4 h · Unchanged · Depends on: DES-01-01-04, TASK-01-01-03-FE1, TASK-01-01-06-FE1, PR-3
- **Build:** `ProfileScreen`, props-only: PageHeader, `profile.name` Input with
  the role label as hint, the `profile.device` sentence, `profile.about`, a
  save-failed Notice. Stories: unnamed, renamed, failed, RTL.
- **Done when:** Stories pass axe; the device sentence uses no `signal`
  (AC 5); a failed save keeps the input (AC 6).

##### TASK-01-01-03-FE3 · Wire the profile route and the persona label on Brew
`frontend` · Parent: STORY-01-01-03 · 3 h · Updated (revision 4: wave 6, declares the interim Brew) · Depends on: TASK-01-01-03-FE2, TASK-01-01-03-BE1, TASK-01-01-05-FE4, TASK-01-01-05-FE3
- **Build:** `src/app/(task)/profile/page.tsx` with `renamePersona` through
  `useActionState`; the persona label on the interim Brew screen (TASK-01-01-05-FE3) opens it.
  TASK-02-02-01-FE1 keeps the label when it rebuilds Brew.
- **Done when:** A rename shows on Brew and Profile (AC 3); clearing restores
  the label (AC 4); failure keeps the text (AC 6).

##### TASK-01-01-03-QA1 · Test the profile label, rename and failure paths
`qa` · Parent: STORY-01-01-03 · 3 h · Unchanged · Depends on: TASK-01-01-03-FE3
- **Build:** Node tests for `renamePersona`; label tests in `en` and the test
  locale; ProfileScreen play tests; content check of the device sentence.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-01-04: Keep my kitchen private to my household

Test infrastructure: TASK-01-01-04-QA1 (section 6).

##### TASK-01-01-04-BE1 · Enforce household scope in the data access layer and every action
`backend` · Parent: STORY-01-01-04 · 5 h · Unchanged · Depends on: TASK-01-01-01-BE4
- **Build:** `src/server/dal/scope.ts`: `requireHousehold()`,
  `assertOwned(table, id)` (portions through their batch) and
  `visibleCatalog(householdId)`. A convention note in `src/server/actions/`.
- **Done when:** Another household's row throws "not found"; new records get
  the session's household (AC 1).

##### TASK-01-01-04-QA2 · Build the cross-household isolation test suite
`qa` · Parent: STORY-01-01-04 · 4 h · Unchanged · Depends on: TASK-01-01-04-BE1, TASK-01-01-04-QA1
- **Build:** `src/server/__tests__/isolation.test.ts` with two households; each
  DAL read and action adds its case (section 5).
- **Done when:** The suite runs in CI and fails when a scope check is removed
  (AC 1 to AC 3).

##### STORY-01-01-05: Move around the app

##### TASK-01-01-05-FE1 · Build the minimal Icon set (NC-14) with its story
`frontend` · Parent: STORY-01-01-05 · 3 h · Unchanged · Depends on: DES-01-02-05
- **Build:** `src/components/ui/Icon`: chevron, check, plus, close; `currentColor`,
  decorative by default; the chevron mirrors in RTL. Stories incl. RTL.
- **Done when:** Stories pass axe; the chevron points to inline-end in both
  directions.

##### TASK-01-01-05-FE2 · Build Sheet (NC-05) and the confirm sheet SH-CONFIRM with stories
`frontend` · Parent: STORY-01-01-05 · 6 h · Unchanged · Depends on: DES-01-02-05, TASK-01-01-05-FE1
- **Build:** `src/components/ui/Sheet` (bottom sheet on phones, dialog on wide
  screens, focus trap and return, Escape, swipe down, reduced motion) and
  `ConfirmSheet`. Stories: open, long content, confirm, RTL, reduced motion.
- **Done when:** Stories pass axe; a play test covers the focus trap; one
  primary button per sheet.

##### TASK-01-01-05-FE7 · Rename PR #3's tabs and message keys to Brew, Journal, Beans and Setup
`frontend` · Parent: STORY-01-01-05 · 3 h · New · Depends on: PR-3
- **Build:** In the PR #3 code (TabBar usage, RecentShotsScreen, fixtures,
  stories and `en.json`), rename `shots.*` to `journal.*`, `pantry.*` to
  `beans.*`, `nav.shots` to `nav.journal` and `nav.pantry` to `nav.beans`.
  Check what PR #3 already renamed. Entries stay "shots" in copy.
- **Done when:** A search finds no `shots.` or `pantry.` key or "Pantry" copy
  (AC 1); stories still pass; tab labels are the four section names.

##### TASK-01-01-05-FE3 · Add the app route group with the TabBar and interim tab states
`frontend` · Parent: STORY-01-01-05 · 4 h · Updated (four section names) · Depends on: PR-3, TASK-01-01-05-FE7, TASK-01-01-06-FE3, DES-01-01-02, DES-01-01-06
- **Build:** `src/app/(app)/layout.tsx` with TabBar linking `/`, `/journal`,
  `/beans` and `/setup`; each tab starts with its interim EmptyState
  (DES-01-01-06); remove the placeholder `src/app/page.tsx`.
- **Done when:** Each tab is one tap from any tab (AC 1); no tab is blank or
  has a dead action (AC 2); safe area respected.

##### TASK-01-01-05-FE4 · Add the full-screen task frame and the unsaved-changes guard
`frontend` · Parent: STORY-01-01-05 · 5 h · Unchanged · Depends on: TASK-01-01-05-FE2, PR-3
- **Build:** `src/app/(task)/layout.tsx` (no TabBar, ghost cancel) and a
  `useUnsavedChanges(isDirty)` hook that opens SH-CONFIRM once, handles
  `popstate` and `beforeunload`, and leaves at once when clean.
- **Done when:** Dirty leave asks once and clean leave is immediate (AC 3).

##### TASK-01-01-05-FE5 · Add return-to with draft restore for side tasks
`frontend` · Parent: STORY-01-01-05 · 6 h · Unchanged · Depends on: TASK-01-01-05-FE4
- **Build:** `src/lib/returnTo.ts` and `src/lib/drafts.ts` (sessionStorage with
  a memory fallback). Finishing a side task returns with `selected=<newId>`;
  leaving restores the draft unchanged.
- **Done when:** Adding a bag from the log returns with the portion chosen
  and dial values kept (AC 4); the same for a setup from the checklist.

##### TASK-01-01-05-QA1 · Test navigation, leaving tasks and return-to
`qa` · Parent: STORY-01-01-05 · 3 h · Updated (reopen removed; revision 3: guard task retired) · Depends on: TASK-01-01-05-FE5
- **Build:** TabBar active state and 44 px height (AC 1); interim empty
  states (AC 2); the unsaved guard dirty versus clean (AC 3); return-to and
  draft unit tests, including storage unavailable (AC 4); a manual phone
  back-button check; tab labels never truncate in any shipped locale (design
  EPIC-01-01): a story test on the TabBar with the TQ-08 test locale at 320 px,
  in LTR and RTL (no new task).
- **Done when:** AC 1 to AC 4 are covered, and the tab labels are shown in full
  at 320 px in LTR and RTL.

##### STORY-01-01-06: See the same loading, empty and error behaviour everywhere

##### TASK-01-01-06-FE1 · Build Notice (NC-10) with neutral and warning tones and its stories
`frontend` · Parent: STORY-01-01-06 (also 01-05-04) · 5 h · Unchanged · Depends on: DES-01-01-05, DES-01-05-03
- **Build:** `src/components/ui/Notice`: neutral and warning tones, block and
  inline sizes, optional retry action. `tone="warning"` requires
  `warning: ShotWarningKind` (only `'channelling'`). Roles `alert` and
  `status`. Stories for each, plus RTL.
- **Done when:** Stories pass axe including signal on `signal-subtle`; a type
  test shows a warning without a kind fails to compile.

##### TASK-01-01-06-FE2 · Build Skeleton (NC-11) with its story
`frontend` · Parent: STORY-01-01-06 · 3 h · Unchanged · Depends on: DES-01-01-05
- **Build:** `src/components/ui/Skeleton`: `surface-sunken` blocks, a pulse that
  stops under reduced motion, `aria-busy` wrapper, preset shapes.
- **Done when:** Stories pass axe; no spinner (AC 1).

##### TASK-01-01-06-FE3 · Build EmptyState (NC-12) with its story
`frontend` · Parent: STORY-01-01-06 · 2 h · Unchanged · Depends on: DES-01-01-05
- **Build:** `src/components/ui/EmptyState`: heading, one sentence, at most
  one action (API-limited). Stories with and without action, RTL.
- **Done when:** Stories pass axe; at most one action (AC 2).

##### TASK-01-01-06-FE4 · Add the shared loading, error and retry patterns for routes and actions
`frontend` · Parent: STORY-01-01-06 · 5 h · Unchanged · Depends on: TASK-01-01-06-FE1, TASK-01-01-06-FE2, TASK-01-01-05-FE3
- **Build:** a `loading.tsx` per tab, `error.tsx` boundaries with retry,
  `src/lib/actionResult.ts` (`{ ok, error }`), a `useActionForm` that keeps
  field values after a failure, and `states.*` keys.
- **Done when:** A forced failure in each tab shows Notice and retry (AC 3);
  form values survive a failure; no pattern uses signal (AC 4).

##### TASK-01-01-06-QA1 · Test the shared states and the signal rule
`qa` · Parent: STORY-01-01-06 · 4 h · Unchanged · Depends on: TASK-01-01-06-FE4
- **Build:** Play tests for skeleton, empty state, error and retry; a check
  that no neutral component renders `signal`; a grep test for `signal`
  outside Notice, in CI.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-01-01-07: Get started with a short checklist

##### TASK-01-01-07-FE1 · Build Checklist (NC-12) with its story
`frontend` · Parent: STORY-01-01-07 · 3 h · Unchanged · Depends on: DES-02-02-04, TASK-01-01-05-FE1
- **Build:** `src/components/ui/Checklist`: numbered steps in done, next and
  later states, an optional detail slot. Stories: none, one, two done, RTL.
- **Done when:** Stories pass axe; only the next step has a primary action.

##### TASK-01-01-07-BE1 · Add the setup progress read
`backend` · Parent: STORY-01-01-07 · 2 h · Updated (basket) · Depends on: TASK-01-01-04-BE1, TASK-01-03-03-BE1
- **Build:** DAL `getSetupProgress()`: `hasMachine`, `hasGrinder`, `hasBasket`,
  `hasSetup`, `hasUnfinishedPortion`, `hasShot`.
- **Done when:** Correct flags for each combination in fixtures.

##### TASK-01-01-07-FE2 · Wire the first-run checklist on Brew
`frontend` · Parent: STORY-01-01-07 · 4 h · Updated (three parts) · Depends on: TASK-01-01-07-FE1, TASK-01-01-07-BE1, TASK-01-02-05-FE1, TASK-03-01-02-FE2, TASK-01-01-05-FE5
- **Build:** Brew shows Checklist until a shot exists: step 1 opens
  `/setup/add-part` preset to machine, then grinder, then basket in one pass;
  with three parts and no setup it shows the setup offer; step 2 opens
  `/beans/add`; step 3 opens `/log`. Each uses `returnTo=/`.
- **Done when:** Three steps show with nothing set up (AC 1); the walk-through
  covers all three parts (AC 2); done steps are marked (AC 3); the setup offer
  shows (AC 4); the checklist is gone when all are done (AC 5).

##### TASK-01-01-07-QA1 · Test the checklist progression
`qa` · Parent: STORY-01-01-07 · 3 h · Unchanged · Depends on: TASK-01-01-07-FE2
- **Build:** Node tests for `getSetupProgress`; Checklist play tests; a manual
  run from an empty household to the first shot. Re-tests the checklist
  criteria Milestone 1 skips: a setup added from the checklist returns with
  draft restore (TASK-01-01-05-FE5 and QA1), the add-part walk-through that
  continues machine, grinder and basket (TASK-01-02-02-FE4 and QA1), and the
  setup offer in checklist step 1 (TASK-01-02-05-FE1 and QA1).
- **Done when:** AC 1 to AC 5 are covered, plus the three criteria above.

##### STORY-01-01-08: Get a starter milk list

Schema: TASK-01-01-08-BE1 (section 6).

##### TASK-01-01-08-BE2 · Seed the starter milks for each new household
`backend` · Parent: STORY-01-01-08 · 2 h · Updated (revision 3: adds milks to the bootstrap) · Depends on: TASK-01-01-08-BE1, TASK-01-01-01-BE5
- **Build:** `src/domain/starterMilks.ts`: whole, semi-skimmed, skimmed, oat,
  soy, almond, lactose-free with `name_key` (`milks.*`), `kind` and
  `sort_order`; an insert function for the bootstrap transaction. Add milks
  to the bootstrap (TASK-01-01-01-BE5), which until now seeds drinks only.
- **Done when:** A new household has exactly these seven rows as its own copy
  (AC 1, AC 3) and there are no brands (AC 4).

##### TASK-01-01-08-FE1 · Add one helper that shows a milk's name
`frontend` · Parent: STORY-01-01-08 · 2 h · New · Depends on: TASK-01-01-08-BE2
- **Build:** `src/domain/milkName.ts` `milkLabel(milk, t)` (stored name wins),
  and the `milks.*` keys in `en.json`.
- **Done when:** Every milk name goes through it (AC 2).

##### TASK-01-01-08-QA1 · Test the starter milk list
`qa` · Parent: STORY-01-01-08 · 2 h · Updated (revision 3: takes the milk checks TASK-01-01-01-QA2 skips) · Depends on: TASK-01-01-08-FE1
- **Build:** Node tests for the seven milks and household separation; the
  bootstrap milk checks that TASK-01-01-01-QA2 skips (a new household gets
  seven milks, atomically and idempotently); a story test of the labels in
  `en` and the test locale.
- **Done when:** AC 1 to AC 4 are covered.

#### EPIC-01-02: Describe your setup once

Retired: STORY-01-02-03, 01-02-06 and 01-02-07 and their tasks.

##### STORY-01-02-01: Find my machine, grinder and basket in the catalog

Schema: TASK-01-02-01-BE1 and BE2 (section 6).

##### TASK-01-02-01-BE3 · Add the catalog seed loader with the hardware seed list
`backend` · Parent: STORY-01-02-01 · 5 h · Updated (baskets with dose ranges) · Depends on: TASK-01-02-01-BE2, TASK-01-06-01-BE1, TQ-10
- **Build:** `src/db/seed/hardware.json` (makers, models of the three kinds
  with capabilities, aliases, URLs) and an idempotent `src/db/seed/load.ts`
  (`npm run db:seed`). Every machine maker's stock baskets are included, each
  with its dose range, curated by the Head of Product as admin. Capabilities
  are validated; seeded rows never use "not sure". Placeholder content until
  TQ-10; the Milestone 1 content comes from TASK-01-02-01-BE6.
- **Done when:** Running twice changes nothing; invalid or unknown values fail
  the seed; every seeded basket has a dose range; no personal data.

##### TASK-01-02-01-BE4 · Add hardware catalog search and browse
`backend` · Parent: STORY-01-02-01 · 6 h · Updated (basket kind, stock baskets first) · Depends on: TASK-01-02-01-BE5, TASK-01-01-04-BE1
- **Build:** DAL `searchHardware({ kind, query })` over model, maker and alias,
  `listMakers({ kind })`, `listModels({ makerId, kind })`, behind
  `GET /api/catalog/search?catalog=hardware`. For kind `basket` with no query,
  baskets by the household machine's maker come first.
- **Done when:** An alias finds its model (AC 1, AC 5); makers are
  alphabetical (AC 2); stock baskets first (AC 3); results carry maker and
  model (AC 4); merged and private rows are handled (AC 6).

##### TASK-01-02-01-BE5 · Add the merge-pointer resolver for catalog reads
`backend` · Parent: STORY-01-02-01 (also 01-06, 02-01-04, 03-01-04) · 2 h · Unchanged · Depends on: TASK-01-02-01-BE2, TASK-03-01-01-BE1
- **Build:** `src/server/dal/catalogMerge.ts` with `resolveEntity` (cycle and
  depth guard) and `mergeGroup`.
- **Done when:** Chains, a self-cycle and an unmerged row resolve in tests.

##### TASK-01-02-01-BE6 · Prepare the seed catalog data for Milestone 1
`backend` · Parent: STORY-01-02-01 (also 03-01-01) · 6 h · New · Depends on: TASK-01-02-01-BE3, TASK-03-01-01-BE2, the Head of Product's equipment and coffee list (TQ-10)
- **Build:** From `planning/seed-catalog.md`, write the seed entries in
  `src/db/seed/hardware.json` and `coffee.json`: their own machine, grinder
  and baskets (maker, model, kind, capabilities, each basket's dose range,
  regional aliases and public product links) and a few coffees (roaster,
  bean, roast level, tasting notes, links). Entries are public catalog
  facts only: no serial numbers, no owner details, nothing personal.
  Capabilities use known values only, never "not sure".
- **Done when:** `npm run db:seed` loads on an empty database; each part is
  found by search in the picker and each coffee in the coffee picker; every
  basket has a dose range; the loader's validation passes; the Head of
  Product confirms the capabilities match the real equipment.

##### TASK-01-02-01-FE1 · Build the catalog picker screen (SCR-CATALOG-PICK) with its stories
`frontend` · Parent: STORY-01-02-01 (also 03-01-01) · 6 h · Unchanged · Depends on: DES-01-02-02, PR-3, TASK-01-01-06-FE1, TASK-01-01-06-FE2, TASK-01-01-05-FE1
- **Build:** `CatalogPickScreen`, props-only: search Input, browse mode, result
  mode, `catalog.addedByYou` marker, a last `catalog.cantFind` row, skeleton
  rows, a no-match Notice that echoes the query. Hardware and coffee
  variants. Stories incl. RTL.
- **Done when:** Stories pass axe; the unverified marker is text; the add-it
  row ends the results.

##### TASK-01-02-01-FE2 · Wire the hardware picker with debounced search and selection return
`frontend` · Parent: STORY-01-02-01 · 5 h · Unchanged · Depends on: TASK-01-02-01-FE1, TASK-01-02-01-BE4, TASK-01-01-05-FE5
- **Build:** `/catalog/pick?catalog=hardware&kind=`: 200 ms debounce with
  `AbortController`, browse with no query, "can't find" to `/catalog/add`,
  selection returns with `selected`.
- **Done when:** No stale results; the query carries over (AC 6).

##### TASK-01-02-01-QA1 · Test hardware search, aliases, merges and privacy
`qa` · Parent: STORY-01-02-01 · 5 h · Updated (baskets) · Depends on: TASK-01-02-01-FE2
- **Build:** Node tests for name, maker and alias matches by kind (AC 1, AC 5),
  alphabetical makers (AC 2), stock baskets first (AC 3), two same-size
  baskets shown by maker and model (AC 4), merged and private entries
  (AC 6); picker play tests for no match. In Milestone 1 AC 6 (merged and private
  entries) is skipped and re-tested in TASK-01-06-03-QA1 (wave 7).
- **Done when:** AC 1 to AC 5 are covered; AC 6 is covered by
  TASK-01-06-03-QA1.

##### STORY-01-02-02: Add the parts I own

Schema: TASK-01-02-02-BE1 (section 6).

##### TASK-01-02-02-BE2 · Add the add-part action and the Setup tab read
`backend` · Parent: STORY-01-02-02 · 4 h · Updated (three kinds, setups per part) · Depends on: TASK-01-02-02-BE1, TASK-01-02-01-BE4, TASK-01-02-04-BE2
- **Build:** Action `addPart({ hardwareId, nickname?, acquiredAt? })` (visible
  model, merge resolved, kind in the three). DAL `getSetupTab()` (parts
  grouped by kind) and `getPart(id)` with the setups it is in.
- **Done when:** Optional fields are optional (AC 2); two parts of one model
  are separate (AC 4); the setups a part is in are returned (AC 5).

##### TASK-01-02-02-FE1 · Build the add-part screen (SCR-UNIT-ADD) with its stories
`frontend` · Parent: STORY-01-02-02 · 5 h · Updated (three kinds) · Depends on: DES-01-02-01, PR-3, TASK-01-02-02-FE3
- **Build:** `UnitAddScreen`, props-only: a kind ChipGroup of machine, grinder
  and basket only, the chosen model with a change link, nickname and date
  Inputs, the read-only capability summary (a basket's dose range), save and
  a failed Notice. Stories incl. RTL.
- **Done when:** Stories pass axe; no other kind is offered (AC 1); capabilities
  show before saving (AC 3).

##### TASK-01-02-02-FE2 · Build the Setup tab screen (SCR-KIT) with its stories
`frontend` · Parent: STORY-01-02-02 (also 01-02-09) · 6 h · Updated (setups and parts) · Depends on: DES-01-02-03, PR-3, TASK-01-01-06-FE3, TASK-01-01-06-FE2
- **Build:** `SetupScreen`, props-only: a setups section (slots for current,
  actions, older), a setup-offer slot, the parts section grouped by kind, an
  EmptyState with `setup.addMachine`, a loading skeleton. Check PR #3's
  fixtures for existing parts.
- **Done when:** Stories pass axe; parts are grouped by kind (AC 1); one
  primary button in every state (AC 6).

##### TASK-01-02-02-FE3 · Compose the capabilities summary from message keys
`frontend` · Parent: STORY-01-02-02 (also 01-06-09) · 3 h · Updated (basket dose range) · Depends on: TASK-01-02-01-BE1
- **Build:** `CapabilitySummary` turns `capabilities` into lines using
  `unit.cap.*` and `formatValueParts`, including a basket's dose range and
  every "not sure" (`unit.capNotSure`).
- **Done when:** Stories cover none, steps, exact °C and °F, manual, stepped,
  stepless, basket range and unknowns; no hand-joined number and unit.

##### TASK-01-02-02-FE4 · Wire the Setup tab and the add-part flow
`frontend` · Parent: STORY-01-02-02 · 4 h · Updated (basket) · Depends on: TASK-01-02-02-FE1, TASK-01-02-02-FE2, TASK-01-02-02-BE2, TASK-01-02-01-FE2, TASK-01-01-05-FE4
- **Build:** `src/app/(app)/setup/page.tsx` and
  `src/app/(task)/setup/add-part/page.tsx`: kind, picker, details, save.
  `?kind=` presets; from the checklist it continues machine, grinder, basket.
  It ends on the setup offer after the third required part.
- **Done when:** An added part appears grouped by kind (AC 1); an empty Setup
  offers the machine (AC 6); the unsaved guard applies.

##### TASK-01-02-02-FE5 · Build the part screen (SCR-UNIT) with its stories
`frontend` · Parent: STORY-01-02-02 (also 01-06-09, 04-01) · 5 h · New · Depends on: DES-01-02-03, PR-3, TASK-01-02-02-FE3
- **Build:** `UnitScreen`, props-only: model and maker, nickname, acquired
  date, CapabilitySummary with an "answer later" slot, `unit.inSetups`, and
  slots for maintenance and the grind-period line. No retire anywhere.
  Stories: machine, grinder, basket, in two setups, RTL.
- **Done when:** Stories pass axe; the setups a part is in are listed (AC 5);
  there is no retire control.

##### TASK-01-02-02-FE6 · Wire the part route
`frontend` · Parent: STORY-01-02-02 · 3 h · New · Depends on: TASK-01-02-02-FE5, TASK-01-02-02-BE2
- **Build:** `src/app/(app)/setup/parts/[unitId]/page.tsx` with `getPart`;
  part rows on Setup link to it.
- **Done when:** A part opens from Setup and shows its setups (AC 5).

##### TASK-01-02-02-QA1 · Test adding parts
`qa` · Parent: STORY-01-02-02 · 4 h · Updated (three kinds; revision 3: part screen deferred) · Depends on: TASK-01-02-02-FE4
- **Build:** Node tests for `addPart` (optional fields, two of one model,
  invisible model and a fourth kind rejected, isolation) and `getPart`
  setups; story checks for the summary and empty Setup. In Milestone 1 the
  part-screen criteria (AC 5, the setups a part is in) are skipped and
  re-tested in wave 6 with TASK-01-02-02-FE5 and FE6.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-02-04: Put my machine, grinder and basket together as a setup

Schema: TASK-01-02-04-BE2 (section 6).

##### TASK-01-02-04-BE1 · Add finding or making a setup, with its rules
`backend` · Parent: STORY-01-02-04 · 4 h · Updated (fixed setups) · Depends on: TASK-01-02-04-BE2, TASK-01-02-02-BE2
- **Build:** `src/domain/setup.ts` `validateParts` (one machine, one grinder,
  one basket; names the missing one). DAL `previewSetup(ids)` returns
  `existing` (name, recipe count) or `new`. Action `resolveSetup(ids, name?)`
  uses `findOrCreateSetup` (unique-index insert, read on conflict).
  **Milestone 1 limit (revision 4):** `resolveSetup` creates a setup only when
  the household has none; when one exists it refuses with a typed error that
  carries the existing setup's ID and whether the combination is the same
  setup, and changes nothing; the preview always says `new`. The only setup is
  current, so no current-setup rule is needed. TASK-01-02-04-BE3 (wave 6)
  lifts the limit.
- **Done when:** A missing part names itself and saves nothing (AC 5); a new
  one is made with an optional name (AC 4); two quick calls make one setup; a
  second create is refused; the only setup is current (AC 6, first setup). In
  wave 6 (TASK-01-02-04-BE3): the same combination reuses its setup (AC 3) and
  the preview says `existing` (AC 2).

##### TASK-01-02-04-FE1 · Build the setup builder (SCR-TOOLKIT) with its stories
`frontend` · Parent: STORY-01-02-04 (also 01-02-08) · 5 h · Updated (builder) · Depends on: DES-01-02-04, PR-3, TASK-01-01-06-FE1
- **Build:** `SetupBuilderScreen`, props-only: three SelectField rows (machine,
  grinder, basket) each ending in `setup.addPart`, a live match line
  (`setup.matchFound`, `setup.newSetup`, `setup.closest`), a name disclosure,
  primary `setup.useThis` or `setup.makeThis`, and a neutral missing-part
  Notice. Stories: existing, new with a closest setup, missing part, RTL.
- **Done when:** Stories pass axe; the match line is in a polite live region;
  the rule is explained, not a disabled button.

##### TASK-01-02-04-FE2 · Wire the setup builder
`frontend` · Parent: STORY-01-02-04 · 3 h · Updated · Depends on: TASK-01-02-04-FE1, TASK-01-02-04-BE1, TASK-01-02-02-FE4
- **Build:** `src/app/(task)/setup/builder/page.tsx` with `previewSetup` and
  `resolveSetup`, `returnTo` support and add-part with return-to.
  The builder is reached only when the household has no setup (the log's
  missing-setup path, the Setup tab's offer, the end-of-add-part offer).
  **Refusal state (Milestone 1):** when `resolveSetup` refuses and the
  combination is the same setup (a double tap, a back-navigated page), treat it
  as success and return as usual; otherwise return to Setup with a neutral
  Notice (text in `en.json`) and save nothing. The same handling applies to
  `createFirstSetup` in TASK-01-02-05-FE1, so the one-tap double tap lands on
  the setup it made.
- **Done when:** Missing context in the log can add a setup and return
  (AC 1); the resulting (only) setup is current on return (AC 6); a stale
  builder page returns to Setup with the Notice.

##### TASK-01-02-04-QA1 · Test setup creation and matching
`qa` · Parent: STORY-01-02-04 · 3 h · Updated · Depends on: TASK-01-02-04-FE2
- **Build:** Unit tests for `validateParts`; Node tests for new, race, missing
  part, isolation and the refusal of a second setup (including the double tap
  and the stale-page case below); play test that the Notice names the part.
- **Done when:** AC 1, AC 4 and AC 5 are covered, AC 2 for a new setup, and
  the refusal of a second setup, with the user-facing state: a repeat of the
  same combination returns as a success, a different one returns to Setup with
  the neutral Notice and saves nothing. In Milestone 1, AC 3 (reuse), AC 2's
  `existing` case, a second setup (AC 4) and AC 6 with more than one setup are
  skipped; they are re-tested in TASK-01-02-09-QA1 (wave 6) after
  TASK-01-02-04-BE3, which retires the refusal tests.

##### TASK-01-02-04-BE3 · Lift the one-setup limit
`backend` · Parent: STORY-01-02-04 · 2 h · New (revision 4) · Depends on: TASK-01-02-04-BE1, TASK-01-02-09-BE1
- **Build:** Remove the Milestone 1 guard from `resolveSetup`, so a second
  combination makes a second setup, a known one reuses its setup, `previewSetup`
  reports `existing`, and the result becomes current through
  TASK-01-02-09-BE1's `useSetup`. The Setup tab's entry points to the builder
  come from TASK-01-02-08-FE1. It also retires the Milestone 1 refusal tests
  (TASK-01-02-04-BE1's "a second create is refused" and TASK-01-02-04-QA1's
  refusal case), replacing them with a test that a second combination makes a
  second setup.
- **Done when:** A second setup can be made and becomes current (AC 4, AC 6);
  the same combination reuses its setup and recipes (AC 3); the preview says
  `existing` with its name and recipe count (AC 2); two quick calls still make
  one setup.

##### STORY-01-02-05: Make my first setup in one tap

##### TASK-01-02-05-BE1 · Add the first-setup suggestion and one-tap creation
`backend` · Parent: STORY-01-02-05 · 3 h · Updated (three parts, no default name) · Depends on: TASK-01-02-04-BE1
- **Build:** DAL `getSetupSuggestion()`: null if any setup exists; otherwise
  the three parts (`oneTap` when exactly one of each, else the most recently
  added of each). Action `createFirstSetup()` calls `resolveSetup` with no name.
- **Done when:** One of each makes a setup with no input (AC 1); more than one
  returns the preselection (AC 2); null once a setup exists (AC 5).

##### TASK-01-02-05-FE1 · Add the setup offer card and the end-of-add-part offer
`frontend` · Parent: STORY-01-02-05 · 4 h · Updated · Depends on: TASK-01-02-05-BE1, DES-01-02-06, TASK-01-02-04-FE2
- **Build:** `SetupOffer` Card naming the three parts, with story, on Setup and
  in checklist step 1. One tap calls `createFirstSetup`, or opens the builder
  prefilled when `oneTap` is false. The add-part flow ends on it.
- **Done when:** The offer names three parts (AC 4); it appears after the last
  required part (AC 3); one tap with no typing (AC 1); a double tap ends on the one setup, with no error
  (the refusal of the second call counts as success).

##### TASK-01-02-05-QA1 · Test the setup shortcut
`qa` · Parent: STORY-01-02-05 · 3 h · Updated · Depends on: TASK-01-02-05-FE1
- **Build:** Node tests for the suggestion cases; SetupOffer play tests; a
  tap count from Brew to a saved setup (design target: 16).
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-01-02-08: Change a part and get the right setup

##### TASK-01-02-08-BE1 · Add the change-a-part starting points
`backend` · Parent: STORY-01-02-08 · 3 h · New · Depends on: TASK-01-02-04-BE1, TASK-01-02-09-BE1
- **Build:** DAL `getChangePartStart({ setupId, newPartId? })`: the setup's
  three parts, or the current setup with the new part swapped in for the
  same kind. No action edits a setup; changes go through `resolveSetup`.
- **Done when:** A swap keeps the other two parts (AC 1); there's no update
  path for a setup's parts (AC 6).

##### TASK-01-02-08-FE1 · Add change-a-part mode and the "use the new part?" prompt
`frontend` · Parent: STORY-01-02-08 · 4 h · New · Depends on: TASK-01-02-08-BE1, TASK-01-02-04-FE2, TASK-01-02-04-BE3, TASK-01-01-05-FE2
- **Build:** `setup.changePart` on Setup cards opens the builder prefilled
  from that setup. After adding a part while a setup exists, a ConfirmSheet
  asks whether to use it: yes opens the builder with the part swapped in,
  no changes nothing.
- **Done when:** Only the changed row differs (AC 1); a known combination
  brings its setup back (AC 2); a new one becomes current and the old is
  kept (AC 3, AC 5); no in-place edit is offered (AC 6).

##### TASK-01-02-08-QA1 · Test changing a part
`qa` · Parent: STORY-01-02-08 · 3 h · New · Depends on: TASK-01-02-08-FE1
- **Build:** Node tests: return to a previous combination reuses its setup
  and recipes (AC 2); a new combination keeps the old setup (AC 3); old shots
  still show their setup (AC 4); "no" changes nothing (AC 5). Play test of
  the prompt.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-02-09: See my setups and know which one is current

##### TASK-01-02-09-BE1 · Add the current-setup rule and the setups read
`backend` · Parent: STORY-01-02-09 · 4 h · New · Depends on: TASK-01-02-04-BE2, TASK-01-03-03-BE1
- **Build:** `src/domain/currentSetup.ts`: the setup of the persona's latest
  shot, unless the `currentSetup` cookie (setup ID and time) is newer; with
  no shot, the newest setup (DQ-18, TQ-16). It replaces the Milestone 1
  `defaultSetupId` (the only setup) in TASK-01-03-01-BE1's `getLogContext`.
  Action `useSetup(id)` writes the cookie. DAL `getSetups()` returns each setup with parts, recipe count
  (latest per key), last used and an `older` flag (90 days).
- **Done when:** A later shot overrides an earlier choice and the reverse
  (AC 1, AC 3); no shots gives the newest setup (AC 2); counts and dates are
  right (AC 4); with several setups, `getLogContext` defaults to the current
  one, not the only-setup default.

##### TASK-01-02-09-BE2 · Add naming and renaming a setup
`backend` · Parent: STORY-01-02-09 · 2 h · New · Depends on: TASK-01-02-04-BE2
- **Build:** Action `renameSetup(id, name)` (trim, empty to null) and
  `src/domain/setupName.ts` `setupLabel` (name, else the parts name, adding
  the basket when another setup shares machine and grinder).
- **Done when:** Only the name changes (AC 5); two setups sharing machine
  and grinder never look alike (AC 6).

##### TASK-01-02-09-FE1 · Wire setup cards on the Setup tab: current, use, rename, older
`frontend` · Parent: STORY-01-02-09 · 5 h · New · Depends on: TASK-01-02-09-BE1, TASK-01-02-09-BE2, TASK-01-02-02-FE2, DES-01-02-03
- **Build:** Setup cards with the current one first and marked, `setup.useThis`,
  a rename sheet, `setup.older` collapse, recipe count and last used. Add
  a `setup.rename` sheet story.
- **Done when:** AC 1 to AC 6 are visible on the Setup tab; choosing
  "use this" makes it current at once (AC 3).

##### TASK-01-02-09-QA1 · Test current setup and setup cards
`qa` · Parent: STORY-01-02-09 · 4 h · New · Depends on: TASK-01-02-09-FE1, TASK-01-02-04-BE3
- **Build:** Unit tests for the rule with fixed clocks; Node tests for the
  read, rename and isolation; play tests for the cards. Re-tests the
  criteria TASK-01-02-04-QA1 skipped in Milestone 1: reuse of a known
  combination (STORY-01-02-04 AC 3), the `existing` preview (AC 2), a second
  setup (AC 4) and AC 6 with several setups. Also a test that the log
  defaults to the current setup when there are several (see
  TASK-01-02-09-BE1).
- **Done when:** AC 1 to AC 6 are covered, plus the four STORY-01-02-04
  criteria above and the log default with several setups.

#### EPIC-01-03: Log a shot in seconds

##### STORY-01-03-01: Start a shot with what I'm brewing already chosen

##### TASK-01-03-01-BE1 · Add the shot log context read
`backend` · Parent: STORY-01-03-01 · 4 h · Updated (current setup, frozen portions; revision 3: no TASK-01-02-09-BE1) · Depends on: TASK-01-03-03-BE1, TASK-03-02-04-BE1
- **Build:** DAL `getLogContext({ drinkId?, portionId? })`: the household's
  setups with the current one as default, visible drinks and milks, and
  unfinished portions (unopened included, frozen last and flagged), each
  with bean, bag, state and opened clock; `missingSetup` and
  `missingCoffee` flags.
- **Milestone 1 starting values (revision 4):** there is only one setup
  until wave 6 (the builder can't make a second), so `defaultSetupId` is that
  setup; there is no cookie and no ordering rule. TASK-01-02-09-BE1 (wave 6)
  replaces it with the current-setup rule. Starting drink:
  the drink of the persona's latest shot, else the first visible drink
  (espresso). Starting coffee: the latest shot's portion if it is not
  finished and not frozen; else the open portion opened earliest
  (`isOpen`); else the newest unopened portion.
- **Done when:** The default setup is current, or in Milestone 1 the only
  setup (AC 1); options are complete
  and ordered (AC 2, AC 3); a frozen pick is flagged (AC 4); flags are
  correct (AC 5).

##### TASK-01-03-01-FE1 · Build the select sheet (SH-SELECT) with its story
`frontend` · Parent: STORY-01-03-01 (also 02-02-06, 02-02-07, 02-06-04) · 3 h · Unchanged · Depends on: TASK-01-01-05-FE2, PR-3
- **Build:** `SelectSheet`: Sheet plus a single-choice ListRow list, a check,
  an optional overline marker and secondary line, an optional footer row.
  Stories: drinks, portions, usual marker, RTL.
- **Done when:** Stories pass axe; keyboard selection works.

##### TASK-01-03-01-FE2 · Wire the log's context fields and the missing-context paths
`frontend` · Parent: STORY-01-03-01 · 5 h · Updated · Depends on: TASK-01-03-01-BE1, TASK-01-03-01-FE1, TASK-01-01-05-FE5, PR-3
- **Build:** `src/app/(task)/log/page.tsx` renders ShotLogScreen (PR #3) with
  setup, drink and coffee fields; defaults from Brew's drink and coffee and
  the current setup (in Milestone 1, from the starting values in
  TASK-01-03-01-BE1, not from Brew; the setup field is read-only); the interim
  Brew screen's "log a shot" action opens `/log` (added here, because `/log`
  exists only from this task); frozen portions show `portion.frozen`; missing setup or
  coffee open the builder or add-bag with return-to, keeping dial values.
- **Done when:** Context arrives pre-chosen (AC 1); changes go through
  SH-SELECT (AC 2, AC 3); a frozen pick is saved as from frozen (AC 4); a
  missing item returns chosen with values kept (AC 5).

##### TASK-01-03-01-QA1 · Test shot log context and missing context
`qa` · Parent: STORY-01-03-01 · 4 h · Updated (revision 3: Milestone 1 skips AC 1 and AC 4) · Depends on: TASK-01-03-01-FE2
- **Build:** Node tests for the context read (current setup, frozen last,
  finished excluded, isolation); play tests for the missing paths.
- **Done when:** AC 2, AC 3 and AC 5 are covered, plus the Milestone 1
  default rule (the only setup, starting drink and coffee). AC 1 is re-tested
  in TASK-02-02-01-QA1 and AC 4 in TASK-03-02-02-QA1 (both name it in their
  Build).

##### STORY-01-03-02: Set grind, dose, yield and time by touch

##### TASK-01-03-02-FE1 · Add finer and coarser end captions to NumberWheel
`frontend` · Parent: STORY-01-03-02 · 4 h · Unchanged · Depends on: DES-01-03-03
- **Build:** Optional `endCaptions` on NumberWheel, mirrored by inline
  position; stories for `higher`, `lower`, none and RTL.
- **Done when:** Captions point the right way in both directions and RTL.

##### TASK-01-03-02-FE2 · Add the grind scale config from grinder capabilities
`frontend` · Parent: STORY-01-03-02 (also 01-06-08) · 3 h · Unchanged · Depends on: TASK-01-02-01-BE1
- **Build:** `src/domain/grind.ts` `grindWheelConfig(capabilities)`; unknowns
  go to the fallback function (TASK-01-06-08-BE1).
- **Done when:** Unit tests cover stepped, stepless and both directions.

##### TASK-01-03-02-BE1 · Add the starting values for a blank log
`backend` · Parent: STORY-01-03-02 · 2 h · Updated (setup's grinder) · Depends on: TASK-01-03-03-BE1, TASK-01-03-02-FE2
- **Build:** DAL `getStartingValues(setupId)`: the latest measured shot on that
  setup, else DQ-07 defaults (18 g, 36 g, 28 000 ms, middle of the grinder's
  range).
- **Done when:** Both branches are tested; one-tap shots are ignored (AC 2).

##### TASK-01-03-02-FE3 · Wire ShotDial in the shot log with live ratio and units
`frontend` · Parent: STORY-01-03-02 · 5 h · Unchanged · Depends on: TASK-01-03-02-FE1, TASK-01-03-02-FE2, TASK-01-03-02-BE1, TASK-01-03-01-FE2, PR-3, TQ-14
- **Build:** ShotDial gets grind from `grindWheelConfig`, dose and yield in
  grams, time in seconds converted with `secondsToMs`, and a live ratio via
  `Intl`. Ranges follow TQ-14.
- **Done when:** AC 1 to AC 6 hold on 375 × 667.

##### TASK-01-03-02-QA1 · Test the shot values controls
`qa` · Parent: STORY-01-03-02 · 4 h · Unchanged · Depends on: TASK-01-03-02-FE3
- **Build:** ShotDial play tests (four tabs, drag and keyboard, typed entry),
  grind snapping, captions both ways and RTL, live ratio, 27.6 s and
  27 600 ms; a Node test of starting values.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-03-03: Save the shot as I measured it

Schema: TASK-01-03-03-BE1 (section 6).

##### TASK-01-03-03-BE2 · Add saving a measured shot
`backend` · Parent: STORY-01-03-03 (also 01-03-04, 06, 07, 03-01-03, 03-02-03) · 5 h · Updated (setup only) · Depends on: TASK-01-03-03-BE1, TASK-01-01-04-BE1, TASK-01-03-01-BE1
- **Build:** Action `saveMeasuredShot(input)`: checks setup, portion and drink
  are owned and the portion isn't finished; stores `setup_id` (no machine or
  grinder columns), the default persona, the session user, `entry_mode =
  'measured'`, `yield_time` in ms, sweetened, prep and milk (validated by
  later tasks). A frozen portion's dates don't change. An unopened, not
  frozen portion gets `opened_at` in the same transaction.
- **Done when:** Fields are as AC 1 requires; the setup survives later
  changes (AC 2); a failure writes nothing (AC 4).

##### TASK-01-03-03-FE1 · Wire saving the shot and the failure state
`frontend` · Parent: STORY-01-03-03 · 3 h · Unchanged · Depends on: TASK-01-03-03-BE2, TASK-01-01-06-FE4
- **Build:** `log.save` calls the action with a pending state; success goes
  to `/taste/[shotId]` (to Brew until tasting lands); failure shows
  `log.saveFailed` with retry and keeps values.
- **Done when:** Success leads to the tasting offer (AC 3); a failure keeps
  values and saves nothing (AC 4).

##### TASK-01-03-03-QA1 · Test saving shots
`qa` · Parent: STORY-01-03-03 · 4 h · Updated · Depends on: TASK-01-03-03-FE1
- **Build:** Node tests for every stored field, the setup snapshot after a
  setup change, opening an unopened portion, finished rejected, rollback and
  isolation; a play test for the failed state.
- **Done when:** AC 1 to AC 4 are covered (AC 3 with TASK-01-05-01-QA1).

##### STORY-01-03-04: Mark a shot as sweetened

##### TASK-01-03-04-FE1 · Add the sweetened toggle to the shot log
`frontend` · Parent: STORY-01-03-04 · 2 h · Unchanged · Depends on: TASK-01-03-03-FE1, PR-3
- **Build:** Toggle `log.sweetened` under ShotDial for every drink, starting
  off, passed to `saveMeasuredShot`.
- **Done when:** It shows for every drink (AC 3) and its value is saved
  (AC 1, AC 2).

##### TASK-01-03-04-QA1 · Test the sweetened mark
`qa` · Parent: STORY-01-03-04 · 2 h · Unchanged · Depends on: TASK-01-03-04-FE1
- **Build:** Node tests for true, false and default; a play test for milk and
  espresso fixtures.
- **Done when:** AC 1 to AC 3 are covered.

##### STORY-01-03-05: Enter and read numbers in my local format

##### TASK-01-03-05-FE1 · Route every shown number through the shared formatters
`frontend` · Parent: STORY-01-03-05 · 3 h · Unchanged · Depends on: TASK-01-03-02-FE3, PR-3
- **Build:** Audit ShotDial, ShotValues and the log for hand-built numbers and
  replace them with `formatValueParts`, `useFormatter` or `Intl`.
- **Done when:** A search finds no hand-joined number and unit.

##### TASK-01-03-05-QA1 · Test decimal comma and point, and canonical storage
`qa` · Parent: STORY-01-03-05 · 3 h · Unchanged · Depends on: TASK-01-03-05-FE1, TQ-08 (assumed)
- **Build:** Stories with `de-DE` and `en-US`; typed comma entry emits the
  canonical number; `parseDecimal` round-trips; a Node cross-locale test.
- **Done when:** AC 1 to AC 3 are covered.

##### STORY-01-03-06: Record whether I used WDT or a puck screen

##### TASK-01-03-06-BE1 · Add the puck prep starting rule and save prep on shots
`backend` · Parent: STORY-01-03-06 · 3 h · New · Depends on: TASK-01-03-03-BE2
- **Build:** `src/domain/prep.ts` `prepStart({ recipe?, lastShotOnSetup? })`:
  the recipe's ticks in recipe-based modes, else the last shot on this
  setup, else both off. DAL returns it for a setup. `saveMeasuredShot`
  stores `usedWdt` and `usedPuckScreen`; they never change the setup.
- **Done when:** The rule is unit-tested (AC 2, AC 3); a saved shot has both
  ticks (AC 1) and the same setup (AC 5).

##### TASK-01-03-06-FE1 · Add the WDT and puck screen toggles to the shot log
`frontend` · Parent: STORY-01-03-06 · 3 h · New · Depends on: TASK-01-03-06-BE1, TASK-01-03-04-FE1, DES-01-03-01
- **Build:** Extend PR #3's ShotLogScreen with two Toggles under a `log.prep`
  label, before sweetened. Untouched ticks follow the rule when the setup
  changes; a touched tick keeps its value.
- **Done when:** Each tick is one tap (AC 1); starting values follow
  the rule (AC 2, AC 3); touched ticks survive a setup change (AC 4).

##### TASK-01-03-06-QA1 · Test puck prep
`qa` · Parent: STORY-01-03-06 · 3 h · New · Depends on: TASK-01-03-06-FE1
- **Build:** Unit tests for `prepStart`; Node tests for storage; play tests for
  the setup-change rule.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-01-03-07: Record the milk in a milk drink

##### TASK-01-03-07-BE1 · Add the milk starting rule and validate milk on save
`backend` · Parent: STORY-01-03-07 · 3 h · New · Depends on: TASK-01-03-03-BE2, TASK-01-01-08-BE2
- **Build:** `src/domain/milk.ts` `milkStart({ drink, recipe?, lastShotOfDrink?,
  milks })` (recipe, else last milk of this drink or the first visible milk,
  with the drink's typical amount) and `validateMilk` (0 to 500 ml, step 10;
  only for a drink with milk; milk visible to the household).
  `saveMeasuredShot` stores `milk_type_id` and `milk_ml`.
- **Done when:** Starting rules and a drink switch are unit-tested (AC 3 to
  AC 5); a non-milk drink stores none (AC 2); the shot records milk (AC 6).

##### TASK-01-03-07-FE1 · Add the millilitre unit and milk line formatting
`frontend` · Parent: STORY-01-03-07 · 3 h · New · Depends on: DES-01-03-06, DES-01-03-03
- **Build:** `milliliter` in `CanonicalUnit` in `src/lib/units.ts` with
  `Intl` unit formatting; a NumberWheel millilitre story; a `milkLine`
  formatter ("Oat, 150 ml") used by ShotValues.
- **Done when:** Unit tests pass; the story passes axe; no hand-joined value.

##### TASK-01-03-07-FE2 · Add the milk field and amount tab to the shot log
`frontend` · Parent: STORY-01-03-07 · 5 h · New · Depends on: TASK-01-03-07-BE1, TASK-01-03-07-FE1, TASK-01-03-06-FE1, DES-01-03-06
- **Build:** Extend ShotLogScreen and ShotDial (PR #3) with a `log.milk`
  SelectField under the drink and a milk amount tab. Both hide for a drink
  without milk; untouched values follow the rule on drink change. Check
  PR #3 first.
- **Done when:** Milk is chosen and set by dragging, no keyboard (AC 1);
  none for espresso (AC 2); recipe and drink starts (AC 3, AC 4); a
  drink switch behaves (AC 5).

##### TASK-01-03-07-QA1 · Test milk in the log
`qa` · Parent: STORY-01-03-07 · 3 h · New · Depends on: TASK-01-03-07-FE2
- **Build:** Unit tests for the rule; Node tests for storage and rejection;
  play tests for the field, tab and drink switch.
- **Done when:** AC 1 to AC 6 are covered.

#### EPIC-01-04: Record temperature and pressure when your machine has them

##### STORY-01-04-01: Record temperature in the way my machine sets it

##### TASK-01-04-01-FE1 · Add Fahrenheit display support to the units helpers and NumberWheel
`frontend` · Parent: STORY-01-04-01 · 3 h · Unchanged · Depends on: DES-01-03-03
- **Build:** `fahrenheit` in `CanonicalUnit`, conversion helpers that snap to
  the machine's step, and a story.
- **Done when:** Every whole °F from 180 to 212 round-trips (risk R-08).

##### TASK-01-04-01-FE2 · Extend ShotDial with optional value tabs and step chips
`frontend` · Parent: STORY-01-04-01 (also 01-04-02, 01-06-08) · 6 h · Updated (milk tab, scrolling) · Depends on: PR-3, DES-01-04-01, DES-01-04-02
- **Build:** Check what PR #3's ShotDial covers, then add optional tabs
  (temperature, pressure) with an unset em dash, add and clear controls,
  steps and exact panels, a `labelOverride`, and horizontal scrolling when
  tabs exceed 375 px (up to seven with milk). Stories per capability, RTL.
- **Done when:** Stories pass axe; unset differs from set; the tab row scrolls
  rather than clips.

##### TASK-01-04-01-FE3 · Show temperature in the log per the machine's capability
`frontend` · Parent: STORY-01-04-01 · 3 h · Unchanged · Depends on: TASK-01-04-01-FE1, TASK-01-04-01-FE2, TASK-01-03-02-FE3
- **Build:** `src/domain/brewControls.ts` maps the setup machine's
  temperature capability to tab config; new shots start unset; °F converts
  to °C before save.
- **Done when:** AC 1 to AC 6 hold.

##### TASK-01-04-01-BE1 · Validate temperature and pressure pairs on save
`backend` · Parent: STORY-01-04-01 (also 01-04-02, 02-01) · 3 h · Unchanged · Depends on: TASK-01-03-03-BE2
- **Build:** `validateBrewControls(capabilities, input)`: one of each pair, the
  field matches the capability, steps in 1..n, exact in range.
- **Done when:** A step on an exact machine, both columns and out-of-range
  are rejected; unset is allowed.

##### TASK-01-04-01-QA1 · Test temperature recording
`qa` · Parent: STORY-01-04-01 · 4 h · Unchanged · Depends on: TASK-01-04-01-FE3, TASK-01-04-01-BE1
- **Build:** Story tests per machine fixture; Node tests for temperature cases.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-04-02: Record pressure in the way my machine sets it

##### TASK-01-04-02-BE1 · Cover pressure in brew-control validation
`backend` · Parent: STORY-01-04-02 · 2 h · Unchanged · Depends on: TASK-01-04-01-BE1
- **Build:** Extend `validateBrewControls` for pressure (none, manual with or
  without gauge, steps, exact).
- **Done when:** Each case is unit-tested.

##### TASK-01-04-02-FE1 · Show pressure in the log per the machine's capability
`frontend` · Parent: STORY-01-04-02 · 3 h · Unchanged · Depends on: TASK-01-04-01-FE3
- **Build:** `brewControls` maps pressure: no tab, peak wheel `log.peakPressure`,
  steps chips or an exact bar wheel; same unset and prefill rules.
- **Done when:** AC 1 to AC 6 hold.

##### TASK-01-04-02-QA1 · Test pressure recording
`qa` · Parent: STORY-01-04-02 · 3 h · Unchanged · Depends on: TASK-01-04-02-FE1, TASK-01-04-02-BE1
- **Build:** Story tests per machine fixture and Node tests for the pressure
  cases.
- **Done when:** AC 1 to AC 6 are covered.

#### EPIC-01-05: Say how it tasted

##### STORY-01-05-01: Rate a shot overall

##### TASK-01-05-01-FE1 · Add the numbered-scale ChipGroup variant with tap-again to clear
`frontend` · Parent: STORY-01-05-01 · 3 h · Unchanged · Depends on: PR-3, DES-01-05-02
- **Build:** Check PR #3's ChipGroup, then add a radio group with arrow keys,
  `allowDeselect` and optional end words. Stories incl. RTL.
- **Done when:** Stories pass axe; a keyboard play test covers move, select
  and deselect.

##### TASK-01-05-01-FE2 · Build the tasting screen (SCR-TASTE) with its stories
`frontend` · Parent: STORY-01-05-01 (also 01-05-02 to 04, 02-01-01, 02-03-05, 02-03-07) · 8 h · Updated (just-right model) · Depends on: DES-01-05-01, PR-3, TASK-01-05-01-FE1, TASK-01-01-06-FE1
- **Build:** `TasteScreen`, props-only: compact ShotValues, the rating scale,
  slots for the four just-right rows with `taste.allJustRight`, the six tags
  and the block warning, a SuggestionCard slot, adaptive actions (`suggest.tryIt`,
  `taste.done`, `recipe.pin`), and a save-failed Notice with
  `taste.leaveWithout`. Stories: normal, suggestion showing, fix mode,
  failed, 375 × 667, RTL.
- **Done when:** Stories pass axe; the primary stays visible at 375 × 667;
  values are visible while rating (AC 1).

##### TASK-01-05-01-BE1 · Add saving the tasting
`backend` · Parent: STORY-01-05-01 (also 01-05-02, 01-05-03, 02-03-04) · 4 h · Updated (just-right fields) · Depends on: TASK-01-03-03-BE2, TASK-01-05-03-BE1
- **Build:** Action `saveTasting(shotId, { rating?, balance?, strength?, body?,
  sweetness?, tags? })`. Owned shots only. Rating 1 to 5 and only on measured
  shots; balance, strength and body -2..2; sweetness -2..0; tags from the
  six; only provided fields are written. A second variant
  `saveOffAnswers` for one-tap shots (no rating).
- **Done when:** Out-of-range values and a rating on a one-tap shot are
  rejected; nothing chosen means no write; an untouched question stays null
  (STORY-01-05-02 AC 3).

##### TASK-01-05-01-FE3 · Wire the tasting route, leaving saves
`frontend` · Parent: STORY-01-05-01 · 3 h · Updated (leaving saves, failure choice) · Depends on: TASK-01-05-01-FE2, TASK-01-05-01-BE1, TASK-01-03-03-FE1
- **Build:** `src/app/(task)/taste/[shotId]/page.tsx`. Done, back, system back
  and pin save the choices first, with no prompt; nothing chosen means no
  request. A failed save keeps the screen with retry and "leave without
  saving tasting".
- **Done when:** Every way out saves (AC 3); a failure keeps the choices and
  offers both options (AC 4); the rating shows later (AC 5).

##### TASK-01-05-01-QA1 · Test rating a shot
`qa` · Parent: STORY-01-05-01 · 3 h · Updated · Depends on: TASK-01-05-01-FE3
- **Build:** Play tests for visible values, unrate, leaving saves and the
  failure choice; Node tests for validation and isolation.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-01-05-02: Say what was off, against my own taste

##### TASK-01-05-02-FE1 · Add the just-right scale variant to ChipGroup
`frontend` · Parent: STORY-01-05-02 · 4 h · Updated (was four sensory scales) · Depends on: TASK-01-05-01-FE1, DES-01-05-02
- **Build:** Extend ChipGroup with five (or three, one-sided) compact chips, a
  stronger centre, end words that mirror, and accessible names "a bit" and
  "much". Tap again clears. Stories: five-point, one-sided, RTL.
- **Done when:** Stories pass axe; arrow keys move and space selects (AC 5); a
  row fits one line at 375 px.

##### TASK-01-05-02-FE2 · Add the four just-right rows and "all just right" to the tasting screen
`frontend` · Parent: STORY-01-05-02 · 3 h · New · Depends on: TASK-01-05-02-FE1, TASK-01-05-01-FE2, DES-01-05-04
- **Build:** Balance, strength (milk wording for milk drinks), body and
  sweetness rows, plus a ghost `taste.allJustRight` that sets all four in
  one tap. Reused by SH-OFF and edit mode.
- **Done when:** Rows and end words are as AC 1 and AC 2; untouched saves
  nothing (AC 3); all just right is one tap and editable (AC 4); a good shot
  takes three taps (AC 6).

##### TASK-01-05-02-QA1 · Test the just-right questions
`qa` · Parent: STORY-01-05-02 · 3 h · Updated · Depends on: TASK-01-05-02-FE2
- **Build:** Play tests for each row, milk wording, untouched, all just right,
  clear and keyboard; a Node test that untouched stays null.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-05-03: Note what I noticed

##### TASK-01-05-03-BE1 · Define the taste tag list
`backend` · Parent: STORY-01-05-03 · 2 h · Updated (replaces the defect list) · Depends on: none
- **Build:** `src/domain/tasteTags.ts`: the six keys (`sourAndBitter`,
  `dryFinish`, `flat`, `burnt`, `littleCrema`, `channelling`) with
  `taste.tags.*` keys, `isTasteTag`, and the set that points to puck prep.
- **Done when:** It's the single source for options and validation; DQ-08 is
  closed by S-02.

##### TASK-01-05-03-FE1 · Add the tag choices to the tasting screen
`frontend` · Parent: STORY-01-05-03 · 2 h · Updated · Depends on: TASK-01-05-03-BE1, TASK-01-05-01-FE2
- **Build:** A multi-choice ChipGroup under `taste.observed`, monochrome when
  selected, saved as an array.
- **Done when:** Several, none and untick work (AC 1 to AC 3).

##### TASK-01-05-03-QA1 · Test tags
`qa` · Parent: STORY-01-05-03 · 2 h · Updated · Depends on: TASK-01-05-03-FE1
- **Build:** Play tests for several, none and untick; Node tests: unknown tag
  rejected, saved tags returned by the shot read (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-01-05-04: See a warning when a shot channelled

##### TASK-01-05-04-FE1 · Add the shared ShotWarnings component
`frontend` · Parent: STORY-01-05-04 (also 02-06-01 to 03, 02-03-04) · 3 h · Updated (driven by the tag) · Depends on: TASK-01-01-06-FE1, TASK-01-05-03-BE1, DES-01-05-05
- **Build:** `src/domain/shotWarnings.ts` returns `['channelling']` when the tag
  is set; `ShotWarnings` renders a block or inline warning Notice. "Ran fast"
  is out (DQ-09).
- **Done when:** Stories pass axe; it's the only component rendering shot
  warnings; nothing renders without the tag.

##### TASK-01-05-04-FE2 · Show the warning live on the tasting screen
`frontend` · Parent: STORY-01-05-04 · 2 h · Unchanged · Depends on: TASK-01-05-04-FE1, TASK-01-05-03-FE1
- **Build:** A block ShotWarnings under the tags from the local selection,
  with no layout jump above.
- **Done when:** It toggles with the channelling tag (AC 1).

##### TASK-01-05-04-QA1 · Test the channelling warning and the signal rule
`qa` · Parent: STORY-01-05-04 · 3 h · Updated · Depends on: TASK-01-05-04-FE2
- **Build:** Play test for tag and untag; contrast-only check that the words
  carry the meaning (AC 3); unit test for `shotWarnings` including that other
  tags never warn (AC 4); the signal grep test still passes; other places
  covered by TASK-02-06-01-QA1, 02-06-03-QA1, 02-06-02-QA1 and 02-03-04-QA1
  (AC 2).
- **Done when:** AC 1, 3 and 4 are covered here and AC 2 is linked.

#### EPIC-01-06: Add what's missing from the catalog

The epic can split: coffee additions and the duplicate check (STORY-01-06-01
to 05) can ship before the capability stories (06 to 09). In Milestone 1 only
TASK-01-06-01-BE1 (URL normalisation) is built, because the seed loader needs
it.

##### STORY-01-06-01: Add a missing machine, grinder or basket

##### TASK-01-06-01-BE1 · Add URL normalisation
`backend` · Parent: STORY-01-06-01 (also 04, 05, 01-02-01) · 5 h · Unchanged · Depends on: TASK-01-01-04-QA1
- **Build:** `src/domain/url.ts` `normalizeUrl(raw)`: http(s) only, lowercase
  host, strip `www.`, fragment, tracking parameters and regional path
  segments, sort the rest, strip a trailing slash; null for non-URLs. One
  rules list.
- **Done when:** A table of at least 30 cases passes, including regional
  variants and pages that must stay distinct. Unknown query parameters are
  kept: Crema's basket page tells single, double and triple apart only by
  `?variant=` (see `planning/seed-catalog.md`).

##### TASK-01-06-01-BE2 · Add creating a hardware entry
`backend` · Parent: STORY-01-06-01 · 5 h · Updated (baskets, dose range) · Depends on: TASK-01-06-01-BE1, TASK-01-02-01-BE2, TASK-01-01-04-BE1, TASK-01-06-04-BE1
- **Build:** Action `createHardwareEntry({ maker, model: { name, kind, url,
  capabilities? } })`: kind is one of the three; one transaction for maker,
  model and `catalog_urls`; `source='user'`, `status='unverified'`; the
  duplicate check reruns before insert (declared per review m5: build
  TASK-01-06-04-BE1 first); a basket's capabilities carry only `dose`.
- **Done when:** No link means nothing saved (AC 5); a maker and model are
  atomic (AC 2, AC 3); rows are marked user-added (AC 6).

##### TASK-01-06-01-FE1 · Build the catalog add screen (SCR-CATALOG-ADD) for hardware, with stories
`frontend` · Parent: STORY-01-06-01 (also 01-06-02, 04 to 07) · 6 h · Updated (basket kind) · Depends on: DES-01-06-01, PR-3, TASK-01-01-06-FE1
- **Build:** `CatalogAddScreen`, props-only: link Input first, checking line,
  duplicate slot, maker select or new maker, model name with preset kind
  (machine, grinder, basket), a capabilities slot, a `catalog.more` slot,
  save, missing-link error in ink, failed Notice. Stories incl. RTL.
- **Done when:** Stories pass axe; the link is the first field.

##### TASK-01-06-01-FE2 · Wire adding hardware from the picker and return with it chosen
`frontend` · Parent: STORY-01-06-01 · 4 h · Unchanged · Depends on: TASK-01-06-01-FE1, TASK-01-06-01-BE2, TASK-01-02-01-FE2
- **Build:** `/catalog/add?catalog=hardware&kind=&q=`: the query prefills the
  name, save returns with `selected`, failure keeps fields, unsaved guard.
- **Done when:** AC 1, AC 2 and AC 6 hold.

##### TASK-01-06-01-FE3 · Add the basket dose-range question
`frontend` · Parent: STORY-01-06-01 (also 01-06-09) · 4 h · New · Depends on: TASK-01-06-01-FE1, TASK-01-02-01-BE1, DES-01-06-03
- **Build:** `BasketQuestions` in CatalogAddScreen: `catalog.cap.doseQ` as a
  ChipGroup (14 to 16 g, 17 to 19 g, 20 to 22 g, other, not sure; ranges
  formatted with `Intl`), "other" reveals two decimal Inputs. Maps to
  `dose { min, max }` or unknown in `capabilityQuestions.ts`, with the
  reverse for answering later. No machine or grinder questions on a basket.
- **Done when:** Stories pass axe, incl. RTL; "not sure" and unanswered save
  as unknown (AC 4); the mapping is lossless.

##### TASK-01-06-01-QA1 · Test adding hardware
`qa` · Parent: STORY-01-06-01 · 4 h · Updated · Depends on: TASK-01-06-01-FE2, TASK-01-06-01-FE3
- **Build:** Node tests for required link, atomic maker plus model, flags and
  the returned ID; basket dose range stored and "not sure" unknown; play
  tests for prefill and failure.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-06-02: Add a missing roaster or coffee

##### TASK-01-06-02-BE1 · Add creating a coffee entry
`backend` · Parent: STORY-01-06-02 · 4 h · Unchanged · Depends on: TASK-01-06-01-BE1, TASK-03-01-01-BE1, TASK-01-02-01-BE2
- **Build:** Action `createCoffeeEntry` with the hardware rules; roast level
  from the S-09 list (`src/domain/roastLevels.ts`); at most four trimmed
  tasting notes.
- **Done when:** AC 2 to AC 5 hold.

##### TASK-01-06-02-FE1 · Add the coffee variant of catalog add
`frontend` · Parent: STORY-01-06-02 · 4 h · Unchanged · Depends on: TASK-01-06-02-BE1, TASK-01-06-01-FE2, TASK-03-01-01-FE1
- **Build:** Coffee variant of CatalogAddScreen: roaster, bean name, roast level
  ChipGroup, tasting notes; returns to add-bag with the bean chosen.
- **Done when:** Saving returns with the bean chosen (AC 1); stories pass axe.

##### TASK-01-06-02-QA1 · Test adding coffee
`qa` · Parent: STORY-01-06-02 · 3 h · Unchanged · Depends on: TASK-01-06-02-FE1
- **Build:** Node tests for AC 2 to AC 5; a play test for the return.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-01-06-03: Keep what I add private until it's verified

##### TASK-01-06-03-BE1 · Apply catalog visibility to every read and every ID passed to an action
`backend` · Parent: STORY-01-06-03 · 3 h · Unchanged · Depends on: TASK-01-02-01-BE4, TASK-01-06-02-BE1
- **Build:** `visibleCatalog` in search, browse and the duplicate check, and
  `assertVisibleCatalog(type, id)` in every action storing a catalog
  reference.
- **Done when:** Another household's unverified ID is rejected as not found;
  a verified entry is visible to all.

##### TASK-01-06-03-QA1 · Test catalog privacy and verification
`qa` · Parent: STORY-01-06-03 · 4 h · Unchanged · Depends on: TASK-01-06-03-BE1
- **Build:** Two-household Node tests for AC 1 to AC 3, including setting
  `status='verified'` directly, plus isolation cases. Re-tests STORY-01-02-01
  AC 6 (a merged entry, our own marked as added by us, other households'
  unverified entries never in a search), skipped in TASK-01-02-01-QA1.
- **Done when:** AC 1 to AC 3 are covered, plus STORY-01-02-01 AC 6.

##### STORY-01-06-04: Get pointed to an entry that already exists

##### TASK-01-06-04-BE1 · Add the duplicate URL check
`backend` · Parent: STORY-01-06-04 · 4 h · Unchanged · Depends on: TASK-01-06-01-BE1, TASK-01-06-03-BE1
- **Build:** DAL `findByNormalizedUrl(catalog, url)` over visible entities with
  merges resolved, as `GET /api/catalog/check-url`, and rerun in both
  create actions.
- **Done when:** A regional variant matches (AC 2); another household's
  unverified match is not reported (AC 3); it runs before and at save (AC 5).

##### TASK-01-06-04-FE1 · Show the duplicate-found and check-failed states in catalog add
`frontend` · Parent: STORY-01-06-04 · 4 h · Unchanged · Depends on: TASK-01-06-04-BE1, TASK-01-06-01-FE2, DES-01-06-02, DQ-10
- **Build:** The check runs on leaving the URL field; a match shows
  `catalog.duplicateFound` with `catalog.useExisting`; "add anyway" is
  behind a flag, off; a failed check allows save.
- **Done when:** AC 1, AC 4 and AC 5 hold.

##### TASK-01-06-04-QA1 · Test duplicate detection
`qa` · Parent: STORY-01-06-04 · 4 h · Unchanged · Depends on: TASK-01-06-04-FE1
- **Build:** Node tests for AC 1 to AC 3 and the save-time recheck; play tests
  for use-existing and check-failed.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-01-06-05: Add regional links and names to an entry

##### TASK-01-06-05-BE1 · Accept extra URLs and aliases on catalog creates
`backend` · Parent: STORY-01-06-05 · 3 h · Unchanged · Depends on: TASK-01-06-04-BE1, TQ-12
- **Build:** Create actions accept `urls` and `aliases` with markets (TQ-12),
  normalised, duplicate-checked, deduplicated.
- **Done when:** AC 1, AC 2 and AC 4 hold.

##### TASK-01-06-05-FE1 · Add the repeatable links and other-names rows
`frontend` · Parent: STORY-01-06-05 · 4 h · Unchanged · Depends on: TASK-01-06-05-BE1, DES-01-06-04, TASK-01-06-04-FE1
- **Build:** Repeatable rows of URL plus market and of name plus market under
  `catalog.more`, with accessible add and remove buttons.
- **Done when:** Stories pass axe; rows work by keyboard.

##### TASK-01-06-05-QA1 · Test regional links and aliases
`qa` · Parent: STORY-01-06-05 · 3 h · Unchanged · Depends on: TASK-01-06-05-FE1
- **Build:** Node tests for AC 1 to AC 4, including alias search only for the
  adding household while unverified.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-01-06-06: Describe a machine I added in my own words

##### TASK-01-06-06-BE1 · Map the machine answers to capabilities
`backend` · Parent: STORY-01-06-06 · 3 h · Unchanged · Depends on: TASK-01-02-01-BE1
- **Build:** `src/domain/capabilityQuestions.ts` `machineAnswersToCapabilities`
  and the reverse; unanswered and "not sure" map to S-08 unknowns.
- **Done when:** Every row of the design's machine table is unit-tested; the
  reverse is lossless.

##### TASK-01-06-06-FE1 · Build the machine capability questions with follow-ups
`frontend` · Parent: STORY-01-06-06 · 5 h · Unchanged · Depends on: TASK-01-06-06-BE1, TASK-01-06-01-FE1, DES-01-06-03
- **Build:** `MachineQuestions`: temperature and pressure questions with
  follow-ups only when needed, each ending in `catalog.cap.notSure`, and
  `catalog.cap.skipHint`. Stories incl. none-none, all follow-ups, skipped, RTL.
- **Done when:** Stories pass axe; no schema words; two answers suffice for a
  machine with no controls (AC 3).

##### TASK-01-06-06-QA1 · Test the machine capability questions
`qa` · Parent: STORY-01-06-06 · 3 h · Unchanged · Depends on: TASK-01-06-06-FE1
- **Build:** Play tests for AC 1 to AC 4; a Node test that saved capabilities
  drive the log's config (AC 5).
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-01-06-07: Describe a grinder I added in my own words

##### TASK-01-06-07-BE1 · Map the grinder answers to capabilities
`backend` · Parent: STORY-01-06-07 · 2 h · Unchanged · Depends on: TASK-01-06-06-BE1
- **Build:** `grinderAnswersToCapabilities` and the reverse.
- **Done when:** Each combination is unit-tested; the reverse is lossless.

##### TASK-01-06-07-FE1 · Build the grinder capability questions
`frontend` · Parent: STORY-01-06-07 · 4 h · Unchanged · Depends on: TASK-01-06-07-BE1, TASK-01-06-06-FE1
- **Build:** `GrinderQuestions`: dial type, lowest and highest, the step shown
  only for clicks, and coarser, each with not sure. Stories incl. RTL.
- **Done when:** Stories pass axe; the step is hidden for smooth (AC 2).

##### TASK-01-06-07-QA1 · Test the grinder capability questions
`qa` · Parent: STORY-01-06-07 · 3 h · Unchanged · Depends on: TASK-01-06-07-FE1, TASK-01-03-02-FE2
- **Build:** Play tests for AC 1 to AC 3; a unit test that saved capabilities
  give the expected `grindWheelConfig` (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-01-06-08: Log shots even when I'm not sure about my equipment

##### TASK-01-06-08-BE1 · Add the DQ-11 fallback ranges as a domain module
`backend` · Parent: STORY-01-06-08 · 2 h · New (revision 3) · Depends on: TASK-01-02-01-BE1, DQ-11
- **Build:** `src/domain/capabilityFallbacks.ts`: `effectiveCapabilities`
  (DQ-11 table in one constants object) and `doseBound(basket)`, which
  returns null for an unknown range. Pure TypeScript, read by the log and by
  the suggestion rules.
- **Done when:** Every row is unit-tested; an unknown dose range gives no
  bound (AC 5).

##### TASK-01-06-08-FE1 · Add the "not sure" fallbacks for the shot log
`frontend` · Parent: STORY-01-06-08 · 2 h · Updated (basket dose; revision 3: the module moves to BE1) · Depends on: TASK-01-06-08-BE1, TASK-01-03-02-FE2, TASK-01-04-01-FE3, TASK-01-04-02-FE1
- **Build:** Use `effectiveCapabilities` and `doseBound` from
  TASK-01-06-08-BE1 in the shot log, so the wheels, tabs and steps fall back
  to the DQ-11 ranges for "not sure" equipment.
- **Done when:** The log uses the fallbacks for every "not sure" part;
  nothing warns or uses signal (AC 2); an unknown dose range gives no bound
  (AC 5).

##### TASK-01-06-08-FE2 · Add the quiet "tell us about your equipment" link in the log
`frontend` · Parent: STORY-01-06-08 · 2 h · Updated (links to the part screen) · Depends on: TASK-01-06-08-FE1, TASK-01-02-02-FE6
- **Build:** A ghost link `log.capUnknown` once per screen when any part of
  the setup is unknown; it opens that part's screen with return-to.
- **Done when:** At most once; not at all when everything is known (AC 6).

##### TASK-01-06-08-QA1 · Test logging with unknown capabilities
`qa` · Parent: STORY-01-06-08 · 3 h · Updated · Depends on: TASK-01-06-08-FE2, DES-01-06-05
- **Build:** ShotDial stories for an all-"not sure" setup (AC 1 to AC 4, AC 6),
  a Node test that a shot saves, and a unit test that an unknown basket range
  gives no dose bound (AC 5).
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-01-06-09: Answer capability questions later

##### TASK-01-06-09-BE1 · Add updating capabilities of the household's own unverified models
`backend` · Parent: STORY-01-06-09 · 3 h · Updated (baskets) · Depends on: TASK-01-06-07-BE1, TASK-01-06-03-BE1, TASK-01-06-01-FE3
- **Build:** Action `updateModelCapabilities(hardwareId, answers)` for
  `source='user'`, `status='unverified'` models of the session household,
  including a basket's dose range; shots are untouched.
- **Done when:** Seeded, verified or other households' models are rejected
  (AC 5); old shots are untouched (AC 3).

##### TASK-01-06-09-FE1 · Show "not sure" answers on the part screen and reopen the questions
`frontend` · Parent: STORY-01-06-09 · 4 h · Updated (part screen) · Depends on: TASK-01-06-09-BE1, TASK-01-02-02-FE6, TASK-01-06-07-FE1
- **Build:** On the part screen, unknowns are marked; `unit.editCapabilities`
  reopens the machine, grinder or basket questions prefilled; seeded and
  verified models are read-only.
- **Done when:** Own unverified parts are editable (AC 1); others are
  read-only (AC 5); the next log follows (AC 2).

##### TASK-01-06-09-FE2 · Widen a wheel's range in edit mode to show an old value
`frontend` · Parent: STORY-01-06-09 · 2 h · Unchanged · Depends on: TASK-02-06-02-FE1
- **Build:** In edit mode a stored out-of-range grind, temperature or pressure
  widens the wheel to include it; it's never clamped silently.
- **Done when:** The stored value shows and saves unchanged (AC 4).

##### TASK-01-06-09-QA1 · Test answering later
`qa` · Parent: STORY-01-06-09 · 3 h · Updated · Depends on: TASK-01-06-09-FE1, TASK-01-06-09-FE2
- **Build:** Node tests for AC 1, 2, 3 and 5 (including a basket's range and
  its effect on dose suggestions later); a play test for AC 4.
- **Done when:** AC 1 to AC 5 are covered.

---

### INIT-02: Every new bag starts from what you already learned

#### EPIC-02-01: Pin the recipe that worked

Retired: STORY-02-01-05 and its tasks, replaced by STORY-02-01-06.

##### STORY-02-01-01: Pin a recipe from a shot I liked

Schema: TASK-02-01-01-BE1 (section 6).

##### TASK-02-01-01-BE2 · Add current-recipe resolution
`backend` · Parent: STORY-02-01-01 (also 02-01-03, 04, 06, 02-02, 02-03, 03-06-03) · 3 h · Updated (setup scoped, milk not in the key) · Depends on: TASK-02-01-01-BE1, TASK-01-02-01-BE5
- **Build:** `src/server/dal/recipes.ts`: `getCurrentRecipe({ beanId,
  personaId, setupId, drinkTypeId })` returns the latest `pinned_at` with
  `batch_id IS NULL` across the bean's merge group, stable tie-break on ID;
  `listCurrentRecipesForBean(beanId, personaId)` returns one per setup and
  drink. Milk and prep are never part of the key. This is the single
  "which recipe applies now" function (review m10).
- **Done when:** The latest pin wins, only on the given setup (AC 4); a merged
  bean finds recipes pinned on either ID; a pin with different milk replaces
  the same key (AC 3).

##### TASK-02-01-01-BE3 · Add pinning from a measured shot
`backend` · Parent: STORY-02-01-01 · 4 h · Updated (prep, milk, setup) · Depends on: TASK-02-01-01-BE2, TASK-01-04-01-BE1
- **Build:** Action `pinFromShot(shotId)`: owned and measured only; copies
  values, temperature and pressure, prep ticks, milk, setup, drink and
  persona; bean from the portion's batch (resolved); sets
  `source_extraction_id` and `pinned_at`. DAL `pinPreview(shotId)` returns
  what is pinned and the recipe it replaces, with differences.
- **Done when:** The preview shows the replaced recipe and differences
  (AC 1); the recipe has every field (AC 2); one-tap is rejected (AC 5); later
  shot edits don't touch it and a failure saves nothing (AC 6).

##### TASK-02-01-01-FE1 · Build the pin sheet (SH-PIN) with its stories
`frontend` · Parent: STORY-02-01-01 (also 02-01-02) · 4 h · Updated (prep and milk lines) · Depends on: DES-02-01-01, TASK-01-01-05-FE2, PR-3
- **Build:** `PinSheet`: `recipe.pinTitle` naming drink, coffee and setup,
  compact ShotValues with prep and milk lines, the replaced recipe above in
  `ink-secondary` with differences, primary `recipe.confirmPin`, a failed
  Notice. Stories: new, replaces, failed, RTL.
- **Done when:** Stories pass axe; one primary button.

##### TASK-02-01-01-FE2 · Wire pinning from the tasting and shot detail screens
`frontend` · Parent: STORY-02-01-01 · 3 h · Unchanged · Depends on: TASK-02-01-01-FE1, TASK-02-01-01-BE3, TASK-01-05-01-FE3, TASK-02-06-03-FE2
- **Build:** `recipe.pin` on TasteScreen and ShotDetailScreen (measured only;
  added to the detail's `actions` slot here, because the detail is read-only in
  Milestone 1; primary on measured shots, as the design says) opens PinSheet; confirm calls `pinFromShot`, announces `recipe.pinned`.
  On the tasting screen the choices are saved first.
- **Done when:** Pin is reachable from both (AC 1); absent on one-tap (AC 5);
  failure retries (AC 6). The detail's pin is the one that STORY-02-06-03 AC 3
  asks for.

##### TASK-02-01-01-QA1 · Test pinning from a shot
`qa` · Parent: STORY-02-01-01 · 4 h · Updated · Depends on: TASK-02-01-01-FE2
- **Build:** Node tests: fields copied including prep and milk (AC 2); replace
  across different milk (AC 3); resolution only on the setup (AC 4); one-tap
  rejected (AC 5); edit does not change the recipe, forced failure leaves no
  row (AC 6); isolation; sheet play tests (AC 1). Also tests STORY-02-06-03
  AC 3's pin action on the shot detail (present and primary on a measured
  shot, absent on a one-tap shot).
- **Done when:** AC 1 to AC 6 are covered, plus STORY-02-06-03's pin action.

##### STORY-02-01-02: Pin a recipe by entering the values

##### TASK-02-01-02-BE1 · Add pinning entered values
`backend` · Parent: STORY-02-01-02 · 3 h · Updated (prep, milk) · Depends on: TASK-02-01-01-BE2, TASK-01-04-01-BE1, TASK-01-03-07-BE1
- **Build:** Action `pinEnteredRecipe({ batchId, setupId, drinkTypeId, values })`:
  bean from the batch, default persona, `validateBrewControls` and
  `validateMilk` apply, prep ticks stored, `source_extraction_id` null, no
  shot written. Plus `pinPreview` for entered values.
- **Done when:** A recipe saves with no source and no extraction (AC 3);
  temperature, pressure, milk and prep follow the setup and drink (AC 2).

##### TASK-02-01-02-FE1 · Add the recipe mode of the shot log
`frontend` · Parent: STORY-02-01-02 · 4 h · Updated · Depends on: TASK-02-01-02-BE1, TASK-02-01-01-FE1, TASK-01-04-02-FE1, TASK-01-03-07-FE2, DES-02-01-03
- **Build:** `/log?mode=recipe&batchId=`: title `log.titleRecipe`, context is
  drink and setup, ShotDial with temperature, pressure and milk, prep
  toggles, primary `recipe.pinThis` opening PinSheet, no sweetened toggle and
  no tasting. Starts from the current recipe or defaults.
- **Done when:** It is clearly pinning, not logging (AC 4); values as on the
  log (AC 1, AC 2).

##### TASK-02-01-02-QA1 · Test pinning by entering values
`qa` · Parent: STORY-02-01-02 · 3 h · Updated · Depends on: TASK-02-01-02-FE1
- **Build:** Node tests for no extraction and no source (AC 3) and validation
  (AC 2); play tests for the title, button and no save-shot path (AC 1, AC 4).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-01-03: Pin a better recipe and keep the old one

##### TASK-02-01-03-QA1 · Test that the newest pin wins and older pins are kept
`qa` · Parent: STORY-02-01-03 · 3 h · Unchanged · Depends on: TASK-02-01-01-BE3, TASK-02-01-02-BE1
- **Build:** Node tests: two pins for a key, the second is current (AC 1, AC 2);
  each reader (Brew, pre-fill, bag and coffee recipes) uses
  `getCurrentRecipe` (AC 3); the older row is unchanged (AC 4);
  same-millisecond pins resolve deterministically. No code task.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-01-04: See the recipes for a coffee

##### TASK-02-01-04-BE1 · Add the recipes read for a bag and a coffee
`backend` · Parent: STORY-02-01-04 (also 03-06-03) · 3 h · Updated (prep, milk, per setup) · Depends on: TASK-02-01-01-BE2, TASK-03-01-04-BE1
- **Build:** DAL `getBagRecipes(batchId)` and `getCoffeeRecipes(beanId)` call
  `listCurrentRecipesForBean`, returning drink, setup label, values, prep,
  milk and `pinned_at`. Recipes show on every bag of the bean.
- **Done when:** One row per drink and setup (AC 1); a new bag of the same
  bean gets the same recipes (AC 2); the merge group is included (AC 5).

##### TASK-02-01-04-FE1 · Show the recipes section on the bag screen
`frontend` · Parent: STORY-02-01-04 · 4 h · Updated · Depends on: TASK-02-01-04-BE1, TASK-03-01-04-FE3, TASK-02-01-02-FE1, DES-02-01-02
- **Build:** A shared `RecipeRows` component (ListRows with compact ShotValues,
  prep and milk, date) used on the bag and coffee screens. Tapping opens
  an action sheet: `recipe.dialIn` (`/log?mode=dialIn`) and `recipe.edit`.
  Empty state `bag.noRecipes` with `recipe.add`. Stories.
- **Done when:** Rows show values and date (AC 1); dial in and change are
  available (AC 3); the empty state offers add (AC 4).

##### TASK-02-01-04-QA1 · Test bag recipes
`qa` · Parent: STORY-02-01-04 · 3 h · Unchanged · Depends on: TASK-02-01-04-FE1
- **Build:** Node tests for AC 1, 2 and 5 (two bags of one bean, a merged
  bean); play tests for the actions and the empty state.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-01-06: Dial in on a new setup from my closest setup's recipe

##### TASK-02-01-06-BE1 · Add the closest-setup rule
`backend` · Parent: STORY-02-01-06 (also 01-02-04) · 3 h · New · Depends on: TASK-01-02-04-BE2, TASK-02-01-01-BE2
- **Build:** `src/domain/closestSetup.ts` `closestSetup(current, others,
  hasRecipe, lastUsed)`: the setup with a recipe for this bean and drink that
  shares the most parts with the current one (0 to 2); ties to the one used
  most recently. The builder's `setup.closest` line uses it too (wired in
  TASK-02-01-06-FE1).
- **Done when:** Unit tests cover sharing counts, ties and no candidate
  (AC 2).

##### TASK-02-01-06-BE2 · Add the dial-in start from the closest setup
`backend` · Parent: STORY-02-01-06 · 4 h · New · Depends on: TASK-02-01-06-BE1, TASK-01-03-02-BE1, TASK-01-03-06-BE1, TASK-01-03-07-BE1
- **Build:** DAL `getDialInStart({ beanId, drinkId, setupId })`: with no recipe
  on the setup, the closest setup's recipe. Dose, yield, time, prep and milk
  carry over. Grind carries only if the grinder is the same; else the
  grinder's last measured value, else the middle of its range, flagged
  `grindNotCarried` (DQ-20). Temperature and pressure carry only if the
  machine is the same, else unset.
- **Done when:** Each carry-over rule is unit-tested (AC 3, AC 4, AC 5); no
  recipe anywhere gives the blank start (AC 6).

##### TASK-02-01-06-FE1 · Show the no-recipe-on-this-setup state on Brew
`frontend` · Parent: STORY-02-01-06 · 3 h · New · Depends on: TASK-02-01-06-BE2, TASK-02-02-01-FE1, TASK-01-02-04-FE2, DES-02-01-05
- **Build:** HomeScreen state: `home.noRecipeOnSetup`, `home.startsFrom`
  naming the closest setup, and only `home.dialIn` as primary, never a
  pull. Check PR #3's HomeScreen props first. Also wires the setup builder's
  `setup.closest` line (built in TASK-01-02-04-FE1): TASK-01-02-04-FE2's page
  passes the line the result of TASK-02-01-06-BE1's `closestSetup` when the
  new combination shares parts with another setup (a small step, no new
  task; the line stays hidden in Milestone 1, which has one setup).
- **Done when:** The state shows with the setup named and no pull (AC 1); a
  new combination that shares parts shows `setup.closest` in the builder.

##### TASK-02-01-06-FE2 · Open the log from the closest setup with its notes
`frontend` · Parent: STORY-02-01-06 · 3 h · New · Depends on: TASK-02-01-06-BE2, TASK-02-03-03-FE1
- **Build:** In dial-in mode, the log reads `getDialInStart`, shows the
  `log.fromRecipeOn` note naming the setup and `log.grindNotCarried` when
  needed. Saving and pinning gives this setup its own recipe.
- **Done when:** The notes show (AC 3, AC 4); after a pin Brew offers a pull
  (AC 6).

##### TASK-02-01-06-QA1 · Test dialing in from the closest setup
`qa` · Parent: STORY-02-01-06 · 4 h · New · Depends on: TASK-02-01-06-FE2
- **Build:** Node tests for choice, ties, same and different grinder and
  machine, carry-over of prep and milk, and no pull offered; play tests of
  both states.
- **Done when:** AC 1 to AC 6 are covered.

#### EPIC-02-01, revision 5 change: sweetened on pinned recipes

New MVP stories STORY-02-01-07, 08 and 09, plus one-criterion amendments to
STORY-01-03-04, 02-01-04, 02-01-06, 02-02-01, 02-02-02, 02-03-02 and 02-03-03.
**The earlier tasks of those stories are not changed.** Each amendment is
delivered by a task of the three new stories and tested by a small QA task
under the amended story. Design: DES-02-01-06 (design 5.0a). 19 tasks, 52 h,
counted under EPIC-02-01. Built today: `extractions.sweetened`,
`ShotLogFlow`'s toggle and `RecipeLogFlow` ignoring it (its `_sweetened`
parameter); `pull.ts` does not copy it; `recipeLines.ts` is the one place the
Brew and recipe-row quiet lines are made.

##### STORY-02-01-07: Pin whether the drink is sweetened

##### TASK-02-01-07-BE1 · Add the sweetened column to pinned recipes
`backend` · Parent: STORY-02-01-07 · 2 h · New (rev 5) · Depends on: none
- **Build:**
  - `src/db/schema.ts`: add `sweetened: integer("sweetened", { mode: "boolean"
    }).notNull().default(false)` to `pinnedRecipes`, beside the prep columns.
    It is not added to the `pinned_recipes_key` index: sweetened is never part
    of a recipe's identity.
  - `npm run db:generate` for the migration; update `src/db/schema.test.ts`
    and `src/db/recipes.test.ts`.
  - No sugar amount or kind column.
- **Done when:**
  - The migration applies to a database that already holds recipes and leaves
    them false (AC 5).
  - The index is unchanged and the schema test fails on a rename or retype.

##### TASK-02-01-07-BE2 · Carry sweetened through recipe reads, pins and the changes list
`backend` · Parent: STORY-02-01-07 · 4 h · New (rev 5) · Depends on: TASK-02-01-07-BE1
- **Build:**
  - `src/server/dal/recipes.ts`: `RecipeValues` gains `sweetened: boolean`;
    `RECIPE_FIELDS` gains `"sweetened"` so `differ` lists it; `toRecipe`,
    `insert` and `entered` map the column.
  - `fromShot` copies the shot's `sweetened` (DQ-44c); a one-tap shot still
    can't be pinned (`OneTapPinError` stays).
  - `getCurrentRecipe` and `RecipeKey` are unchanged.
  - Fix every TypeScript construction of `RecipeValues` (`dialIn.ts`,
    `logStart.ts`, `home.ts`, tests).
- **Done when:**
  - Pinning a sweetened shot saves true, an unsweetened one false (AC 1).
  - `PinPreview.differences` includes `sweetened` when it differs (AC 2).
  - Pinning an unsweetened flat white after a sweetened one replaces the same
    recipe (AC 4).
  - A failed insert leaves no row (AC 6).

##### TASK-02-01-07-FE1 · Show sweetened in the pin sheet and its changes list
`frontend` · Parent: STORY-02-01-07 · 3 h · New (rev 5) · Depends on: TASK-02-01-07-BE2, DES-02-01-06
- **Build:**
  - `src/components/recipes/PinSheet.tsx`: `PinRecipeView` gains `sweetened`;
    the new-recipe block's quiet lines (beside milk and prep) add
    `recipe.sweetenedLine` only when yes.
  - The changes list shows a `recipe.change` row for field `log.sweetened`
    from no to yes (words from `shot.sweetenedNo` and `shot.sweetenedYes`).
  - `usePinFlow.tsx` passes the value through; keys in `en.json`.
  - Stories in `PinSheet.stories.tsx`: new sweetened, replaces with a
    sweetened change, not sweetened (no line), right-to-left.
- **Done when:** Stories pass axe; a not-sweetened recipe says nothing (AC 1);
  the change reads in the same words as the other changed values (AC 2).

##### TASK-02-01-07-FE2 · Add the sweetened toggle to the recipe mode of the log
`frontend` · Parent: STORY-02-01-07 · 3 h · New (rev 5) · Depends on: TASK-02-01-07-BE2, TASK-02-01-08-BE1, DES-02-01-06
- **Build:**
  - `RecipeLogFlow.tsx` ignores its `_sweetened` argument today, and
    `ShotLogScreen.stories.tsx` asserts there is no sweetened switch in recipe
    mode (STORY-02-01-02 AC 4). Show the Toggle next to the prep ticks in
    `ShotLogScreen.tsx`, starting as the current recipe has it, else off.
  - Pass it into `EnteredRecipe.values.sweetened` and
    `pinEnteredRecipe`; flip that story's assertion.
- **Done when:** Entering a recipe by values saves its sweetened tick (AC 3);
  the story checks the switch is present and starts as the recipe has it.

##### TASK-02-01-07-QA1 · Test pinning sweetened
`qa` · Parent: STORY-02-01-07 · 4 h · New (rev 5) · Depends on: TASK-02-01-07-FE1, TASK-02-01-07-FE2
- **Build:**
  - Node tests (`recipes.test.ts` style, mocked `@/db/client`): pin from a
    sweetened and an unsweetened measured shot, entered values, replacement
    across a sweetened/unsweetened pair, legacy rows read as not sweetened,
    failed insert.
  - Play tests: the pin sheet's line and change row, the recipe-mode toggle.
- **Done when:** AC 1 to AC 6 are covered, including that nothing asks for a
  sugar amount or kind.

##### STORY-02-01-08: Start a log from a recipe with sweetened already ticked

##### TASK-02-01-08-BE1 · Return the recipe's sweetened value in every recipe-based log start
`backend` · Parent: STORY-02-01-08 · 4 h · New (rev 5) · Depends on: TASK-02-01-07-BE2
- **Build:**
  - `src/server/dal/logStart.ts`: `StartValues` and `valuesOf` gain
    `sweetened`; a recipe gives the recipe's, a past shot its own (Head of
    Product Q2: "Dial in from this" starts with the shot's value).
  - Dial in from a recipe and the closest-setup start
    (`src/server/dal/dialIn.ts`, `DialInStart`): carry the source recipe's
    value. Fix mode: the current recipe's, else the one-tap shot's.
  - `getRecipeForBag` (recipe mode) returns the recipe's value.
  - The log page (`src/app/(task)/log/page.tsx`) passes each setup's start
    value so a setup change in the log can re-apply it (AC 4); extend
    `LogApplied` in `ShotLogFlow.tsx` the way prep is.
- **Done when:** Each start mode returns the right value, false for legacy and
  blank starts (AC 1, AC 2, AC 5); unit tests per mode.

##### TASK-02-01-08-FE1 · Start the log with sweetened from the recipe
`frontend` · Parent: STORY-02-01-08 · 4 h · New (rev 5) · Depends on: TASK-02-01-08-BE1, TASK-01-03-04-FE1
- **Build:**
  - `ShotLogFlow.tsx`: the draft's `sweetened: false` becomes the start value;
    a `touched` flag (as prep has) lets a setup change re-apply the new
    setup's value only while untouched.
  - `RecipeLogFlow.tsx` uses the same; `ShotEditFlow.tsx` keeps the saved
    shot's value (AC 5).
  - Unticking and saving records false and does not touch the recipe (AC 3).
- **Done when:** AC 1 to AC 5 hold in the log's play tests.

##### TASK-02-01-08-QA1 · Test starting a log with sweetened
`qa` · Parent: STORY-02-01-08 · 4 h · New (rev 5) · Depends on: TASK-02-01-08-FE1
- **Build:** Node tests per start mode (dial in, fix, closest-setup, entered
  recipe, from a past shot, blank); play tests for unticking then saving,
  following a setup change and keeping a touched tick, edit mode.
- **Done when:** AC 1 to AC 6 and the Q2 answer are covered.

##### STORY-02-01-09: See and copy sweetened on Brew and recipe rows

##### TASK-02-01-09-BE1 · Copy sweetened in the one-tap pull
`backend` · Parent: STORY-02-01-09 · 2 h · New (rev 5) · Depends on: TASK-02-01-07-BE2
- **Build:** `src/server/dal/pull.ts`: the insert adds `sweetened:
  recipe.sweetened`; `PullResult`'s `pulled` kind gains `sweetened` (also
  from `madeAlready` for a repeated tap). Undo already deletes the row, so
  nothing remains (AC 5).
- **Done when:** A pull from a sweetened recipe records true and reports it; a
  plain recipe records false and the result is as before (AC 3).

##### TASK-02-01-09-FE1 · Show sweetened on Brew and in the pulled state
`frontend` · Parent: STORY-02-01-09 · 3 h · New (rev 5) · Depends on: TASK-02-01-09-BE1, TASK-02-01-09-FE2, DES-02-01-06
- **Build:**
  - Brew's page and `HomeScreen.tsx` show the sweetened quiet line from
    `recipeLines` (built in FE2) under the values.
  - `PulledState` (`src/components/ui/PulledState`) gets a second line
    `home.pulledSweetened` only when the pull was sweetened; story added.
  - Brew has no control to change sweetened before a pull (AC 4).
- **Done when:** Stories pass axe; a plain recipe's Brew and pulled state look
  as before (AC 1, AC 3).

##### TASK-02-01-09-FE2 · Add the sweetened line to recipe rows
`frontend` · Parent: STORY-02-01-09 · 2 h · New (rev 5) · Depends on: TASK-02-01-07-BE2, DES-02-01-06
- **Build:** `src/app/(app)/recipeLines.ts` adds `recipe.sweetenedLine` when
  `recipe.sweetened`; used by Brew, `beans/recipeRows.ts` (bag and coffee
  rows) and the pin sheet's blocks. Story added to `RecipeRows.stories.tsx`.
- **Done when:** A sweetened row says so in words, a plain row says nothing
  (AC 2; also STORY-02-01-04 AC 1).

##### TASK-02-01-09-QA1 · Test sweetened on Brew, the pull and recipe rows
`qa` · Parent: STORY-02-01-09 · 3 h · New (rev 5) · Depends on: TASK-02-01-09-FE1
- **Build:** Node tests for the pull's copy, repeated tap and undo; play tests
  for the line, the pulled state, and rows on the bag and coffee screens.
- **Done when:** AC 1 to AC 5 are covered.

##### Amendments to earlier stories (one criterion each)

Each task re-tests the amended criterion once its delivering task has landed.
No earlier task is edited.

##### TASK-01-03-04-QA2 · Re-test the sweetened start rule
`qa` · Parent: STORY-01-03-04 (AC 2) · 2 h · New (rev 5) · Depends on: TASK-02-01-08-FE1
- **Build:** Blank log starts off; a recipe-based log starts as the recipe has
  it; either way the saved shot records what was left.
- **Done when:** AC 2 passes; AC 1 and AC 3 still pass.

##### TASK-02-01-04-QA2 · Re-test sweetened on a bag's recipe rows
`qa` · Parent: STORY-02-01-04 (AC 1) · 2 h · New (rev 5) · Depends on: TASK-02-01-09-FE2
- **Build:** The bag screen's rows say sweetened only when the recipe is.
- **Done when:** AC 1 passes with a sweetened and a plain recipe.

##### TASK-02-01-06-QA2 · Re-test sweetened in the closest-setup dial-in
`qa` · Parent: STORY-02-01-06 (AC 3) · 2 h · New (rev 5) · Depends on: TASK-02-01-08-FE1, TASK-02-01-06-FE2
- **Build:** Dialling in from another setup's sweetened recipe opens the log
  ticked; its note and the other carried values are unchanged.
- **Done when:** AC 3 passes.

##### TASK-02-02-01-QA2 · Re-test sweetened on Brew
`qa` · Parent: STORY-02-02-01 (AC 1) · 2 h · New (rev 5) · Depends on: TASK-02-01-09-FE1
- **Build:** Brew's recipe block shows sweetened only when the recipe is.
- **Done when:** AC 1 passes.

##### TASK-02-02-02-QA2 · Re-test sweetened in the one-tap pull
`qa` · Parent: STORY-02-02-02 (AC 1) · 2 h · New (rev 5) · Depends on: TASK-02-01-09-BE1
- **Build:** The pulled shot records the recipe's sweetened value with the
  prep and milk.
- **Done when:** AC 1 passes for both values.

##### TASK-02-03-02-QA2 · Re-test sweetened in fix mode
`qa` · Parent: STORY-02-03-02 (AC 1) · 2 h · New (rev 5) · Depends on: TASK-02-01-08-FE1
- **Build:** Fixing an off one-tap shot opens ticked as the current recipe has
  it.
- **Done when:** AC 1 passes.

##### TASK-02-03-03-QA2 · Re-test sweetened in dial-in mode
`qa` · Parent: STORY-02-03-03 (AC 1) · 2 h · New (rev 5) · Depends on: TASK-02-01-08-FE1
- **Build:** "Dial in" from Brew opens ticked as the recipe has it.
- **Done when:** AC 1 passes.

#### EPIC-02-02: Pull your daily shot in one tap

##### STORY-02-02-01: See my daily shot on Brew

##### TASK-02-02-01-BE1 · Add the home defaults: time-of-day drink, coffee and recipe
`backend` · Parent: STORY-02-02-01 · 7 h · Updated (current setup, isOpen, prep and milk, states) · Depends on: TASK-02-01-01-BE2, TASK-02-06-01-BE2, TASK-03-02-04-BE1, TASK-01-02-09-BE1
- **Build:** `src/domain/homeDefaults.ts`, pure with an injected clock and time
  zone: `pickDrink` (within ±90 minutes over 14 days, else latest, else
  first) and `pickCoffee` (last pull's coffee while unfinished; else the
  earliest-opened open portion with a recipe for this drink on this setup;
  else the earliest-opened open portion; else the newest unopened not
  frozen; else frozen), all using `isOpen`. DAL `getHome` returns drink,
  coffee, current setup, recipe with prep and milk, the three no-recipe
  cases, a finished-coffee state, the clocks and remaining (hidden until
  their epics land).
- **Done when:** Unit tests cover AC 2 to AC 5 and a DST day, including a
  portion opened then frozen (AC 5); the finished state (AC 6).

##### TASK-02-02-01-FE1 · Wire Brew with the daily shot and its states
`frontend` · Parent: STORY-02-02-01 · 6 h · Updated (clocks line, prep and milk) · Depends on: TASK-02-02-01-BE1, TASK-01-01-07-FE2, TASK-01-01-03-FE3, TASK-01-01-06-FE4, PR-3, DES-02-02-01
- **Build:** `src/app/(app)/page.tsx` renders HomeScreen (PR #3) with
  `getHome()`: keeps the persona label that TASK-01-01-03-FE3 added to the
  interim Brew screen (revision 4), drink title, coffee line (bean and portion; the clocks and the
  remaining-coffee footnote are added by TASK-03-03-04-FE1 and
  TASK-03-04-01-FE2 in wave 12b), large ShotValues
  with prep and milk lines, setup line, `home.pull`, ghost `home.dialIn`;
  states: loading, first run, no recipe, finished coffee, load failed.
  Extend HomeScreen props where PR #3 lacks a state.
- **Done when:** The drink, coffee, values, prep, milk and setup show (AC 1);
  the clocks (AC 2) and "how much coffee is left" (AC 1) are not part of this
  task: TASK-03-03-04-FE1 (wave 12b) shows both clocks and TASK-03-04-01-FE2
  (wave 12b) the remaining coffee; the finished state offers
  choose and add (AC 6); one primary button in every state.

##### TASK-02-02-01-QA1 · Test the home screen defaults and states
`qa` · Parent: STORY-02-02-01 · 5 h · Updated · Depends on: TASK-02-02-01-FE1
- **Build:** Unit tests in `homeDefaults.test.ts` for AC 2 to AC 5 with fixed
  clocks; a Node test for `getHome`; HomeScreen stories for each state with
  axe; a manual phone check.
  Re-tests STORY-01-03-01 AC 1 (context arrives pre-chosen from Brew's
  drink and coffee), skipped in TASK-01-03-01-QA1 in Milestone 1.
  In wave 11a it skips the two criteria that need wave 12b: AC 2 (both
  clocks) and the "how much coffee is left" part of AC 1. They are re-tested
  in TASK-03-03-04-QA1 and TASK-03-04-01-QA1.
- **Done when:** AC 1 (without the remaining-coffee line) and AC 3 to AC 6 are
  covered, plus STORY-01-03-01 AC 1. AC 2 and the remaining-coffee line are
  re-tested in wave 12b.

##### STORY-02-02-02: Pull this shot in one tap

##### TASK-02-02-02-BE1 · Add the one-tap pull
`backend` · Parent: STORY-02-02-02 · 5 h · Updated (prep, milk, frozen never used) · Depends on: TASK-02-02-01-BE1, TASK-02-01-06-BE1, TASK-01-03-03-BE2, TQ-11
- **Build:** Action `pullShot({ clientId, drinkId, beanId, portionId? })`:
  re-resolves the recipe on the current setup server-side and refuses if
  there's none; picks the earliest-opened open portion (`isOpen`, so never
  frozen) or the one given; inserts an extraction with `id = clientId`
  (idempotent), `entry_mode = 'one-tap'`, copying values, temperature and
  pressure, prep and milk, with the recipe's setup; sets `opened_at` as the
  shot time for an unopened, not frozen portion. Returns
  `{ shotId, openedPortion }`.
- **Done when:** Fields as AC 1 and AC 2; the earliest-opened open portion,
  never frozen (AC 3); a duplicate `clientId` writes once (AC 4); a failure
  writes nothing (AC 5).

##### TASK-02-02-02-FE1 · Extract PulledState (NC-07) into a component with its story
`frontend` · Parent: STORY-02-02-02 (also 02-02-04, 02-03-01) · 4 h · Unchanged · Depends on: PR-3, DES-02-02-02, TASK-01-01-06-FE1
- **Build:** Move the pulled state out of HomeScreen into
  `src/components/ui/PulledState`: `home.pulled` live region, ghost undo
  while available, good and off chips, optional Notice. Stories: just
  pulled, after the window, good, reaction failed, reduced motion, RTL.
- **Done when:** Stories pass axe; HomeScreen stories still pass.

##### TASK-02-02-02-FE2 · Wire the pull with optimistic feedback and double-tap protection
`frontend` · Parent: STORY-02-02-02 · 4 h · Unchanged · Depends on: TASK-02-02-02-BE1, TASK-02-02-02-FE1, TASK-02-02-01-FE1
- **Build:** `home.pull` generates a `clientId`, switches to PulledState with
  `useOptimistic`, then calls `pullShot`; the button is gone after the first
  tap; failure reverts with `home.pullFailed` and retry using the same
  `clientId`; the card returns after 30 s.
- **Done when:** The shot is recorded and confirmed (AC 1); a double tap makes
  one shot (AC 4); a failure shows retry with no shot (AC 5).

##### TASK-02-02-02-QA1 · Test the one-tap pull
`qa` · Parent: STORY-02-02-02 · 4 h · Updated (prep, milk, frozen) · Depends on: TASK-02-02-02-FE2
- **Build:** Node tests: copied fields incl. prep and milk and setup (AC 1,
  AC 2); earliest-opened of several open portions and a portion opened then
  frozen never used (AC 3); idempotent `clientId` (AC 4); forced failure
  (AC 5); `is_network_eligible` false; isolation. Play tests for the
  optimistic state, double tap, failure and retry.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-02-03: Choose a bag when none is open

##### TASK-02-02-03-BE1 · Add the portion choice for a pull
`backend` · Parent: STORY-02-02-03 (also 02-03-03, 02-06-06) · 3 h · Updated (frozen) · Depends on: TASK-02-02-02-BE1
- **Build:** DAL `listUnfinishedPortions(beanId)` (counter first, frozen last
  and flagged; bag, state, clocks, remaining once those epics land).
  `pullShot` returns `needsPortion` when none is open and none given, or
  `noneLeft`. An explicit unopened or thawed portion is opened at the shot
  time; a frozen one is used with no date changed, marking the shot from
  frozen.
- **Done when:** The choice is required only when none is open (AC 1); opened
  portions as AC 2; a frozen pick changes no dates (AC 3); `noneLeft`
  records nothing (AC 4).

##### TASK-02-02-03-FE1 · Build the portion sheet (SH-PORTION) with its stories
`frontend` · Parent: STORY-02-02-03 · 3 h · Updated (frozen last) · Depends on: DES-02-02-03, TASK-01-03-01-FE1
- **Build:** `PortionSheet`: `portion.chooseTitle` with ListRows (bag, state,
  freshness, left), frozen ones last marked as ground from the freezer, or
  `portion.noneLeft` with `home.addBag`. Stories: choose, with frozen,
  none left, RTL.
- **Done when:** Stories pass axe.

##### TASK-02-02-03-FE2 · Wire the portion sheet into the pull
`frontend` · Parent: STORY-02-02-03 · 2 h · Unchanged · Depends on: TASK-02-02-03-FE1, TASK-02-02-03-BE1, TASK-02-02-02-FE2
- **Build:** On `needsPortion` or `noneLeft`, withhold the optimistic state and
  open PortionSheet; choosing re-calls `pullShot` with the same `clientId`;
  add bag goes to `/beans/add` with `returnTo=/`.
- **Done when:** Choose records against the portion (AC 2, AC 3); cancel and
  none-left record nothing (AC 4, AC 5).

##### TASK-02-02-03-QA1 · Test choosing a bag when none is open
`qa` · Parent: STORY-02-02-03 · 3 h · Updated · Depends on: TASK-02-02-03-FE2
- **Build:** Node tests for AC 1 to AC 4 including a frozen pick that leaves
  the dates alone; play tests for the sheet and cancel (AC 5).
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-02-04: Undo a shot I didn't mean to pull

##### TASK-02-02-04-BE1 · Add undoing a one-tap pull
`backend` · Parent: STORY-02-02-04 · 3 h · Unchanged · Depends on: TASK-02-02-02-BE1, TQ-15
- **Build:** Action `undoPull(shotId)` for a one-tap shot by the session user
  within 13 s; deletes it and clears `opened_at` when this shot set it and
  there are no other shots.
- **Done when:** Undo removes the shot (AC 1) and restores unopened (AC 2);
  reads no longer count it (AC 3); late undo is rejected (AC 4).

##### TASK-02-02-04-FE1 · Add undo to PulledState on Brew
`frontend` · Parent: STORY-02-02-04 · 2 h · Unchanged · Depends on: TASK-02-02-04-BE1, TASK-02-02-02-FE2
- **Build:** Undo shows for 8 s, then fades with no countdown; it calls
  `undoPull`, announces `home.undone` and refreshes.
- **Done when:** The window is 8 s (DQ-04); the undone shot is gone from the
  lists (AC 3); undo is hidden afterwards (AC 4).

##### TASK-02-02-04-QA1 · Test undo
`qa` · Parent: STORY-02-02-04 · 3 h · Unchanged · Depends on: TASK-02-02-04-FE1
- **Build:** Node tests for AC 1 to AC 4 (opened_at only when this shot set
  it; measured and other users' shots rejected); a fake-timer play test.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-02-05: Dial in when there's no recipe on this setup

##### TASK-02-02-05-FE1 · Open the shot log from the no-recipe state
`frontend` · Parent: STORY-02-02-05 · 2 h · Updated (two no-recipe cases) · Depends on: TASK-02-02-01-FE1, TASK-01-03-02-FE3
- **Build:** HomeScreen's no-recipe state shows `home.noRecipe` with primary
  `home.dialIn`, opening `/log` with drink, portion and current setup chosen.
  When another setup has a recipe the closest-setup state applies
  (TASK-02-01-06-FE1). After a pin, Brew offers the pull.
- **Done when:** AC 1 to AC 4 hold.

##### TASK-02-02-05-QA1 · Test dialing in with no recipe
`qa` · Parent: STORY-02-02-05 · 2 h · Updated · Depends on: TASK-02-02-05-FE1, TASK-02-01-01-FE2
- **Build:** HomeScreen story for the state; Node tests that `getHome` returns
  no recipe, the closest-setup case, and a recipe after a pin; a manual run.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-02-06: Change the drink or coffee before pulling

##### TASK-02-02-06-BE1 · Add the coffee options and recipe lookup for a changed choice
`backend` · Parent: STORY-02-02-06 · 3 h · Updated (frozen-only coffees last, setup) · Depends on: TASK-02-02-01-BE1
- **Build:** DAL `getHomeOptions(drinkId)`: visible drinks and beans with an
  unfinished portion (a recipe for this drink on this setup first,
  frozen-only last and flagged), each marked `usual`. `getHome({ drinkId,
  beanId })` returns the recipe for the changed choice. Nothing is stored.
- **Done when:** Ordering and usual markers are right (AC 1); no settings
  written (AC 5).

##### TASK-02-02-06-FE1 · Add changing the drink and coffee in place on Brew
`frontend` · Parent: STORY-02-02-06 · 5 h · Unchanged · Depends on: TASK-02-02-06-BE1, TASK-01-03-01-FE1, TASK-02-02-01-FE1, DES-02-02-05
- **Build:** Quiet SelectFields open SelectSheet with `home.usual` markers;
  choosing fetches `getHome` via an action and updates the card in place
  with a 200 ms cross-fade; no recipe switches to the no-recipe states; the
  pull uses the chosen pair. The chosen drink and coffee are kept for the
  Journal link (STORY-02-06-05).
- **Done when:** AC 1 to AC 4 hold.

##### TASK-02-02-06-FE2 · Reset an unpulled change after 30 minutes away
`frontend` · Parent: STORY-02-02-06 · 2 h · Unchanged · Depends on: TASK-02-02-06-FE1
- **Build:** Keep the choice in sessionStorage with a timestamp; reset after
  30 minutes away; a pull clears it; changing the drink ends PulledState.
- **Done when:** The next default follows the pull (AC 5); an unpulled change
  resets after 30 minutes (AC 6).

##### TASK-02-02-06-QA1 · Test changing drink and coffee
`qa` · Parent: STORY-02-02-06 · 4 h · Updated · Depends on: TASK-02-02-06-FE2
- **Build:** Node tests for order, usual, frozen-only last and no settings
  written; play tests for in-place update, the pull, no-recipe switch and the
  30-minute reset.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-02-07: Switch setup on Brew and in the shot log

##### TASK-02-02-07-FE1 · Add the setup select on Brew with change-a-part
`frontend` · Parent: STORY-02-02-07 · 4 h · New · Depends on: TASK-01-02-09-BE1, TASK-01-03-01-FE1, TASK-02-02-01-FE1, TASK-01-02-08-FE1, DES-01-02-06
- **Build:** The setup line on Brew is a quiet SelectField opening SelectSheet
  with the household's setups (current first, `setup.current`) and a last
  `setup.changePart` row opening the builder with return-to. Choosing
  calls `useSetup` and updates the card in place.
- **Done when:** AC 1 to AC 3 hold; the shown recipe is always on the current
  setup.

##### TASK-02-02-07-FE2 · Switch setup inside the shot log with the carry-over rules
`frontend` · Parent: STORY-02-02-07 · 4 h · New · Depends on: TASK-02-02-07-FE1, TASK-01-03-06-FE1, TASK-01-03-02-FE3
- **Build:** In the log's setup field, the same select. On a change, dose,
  yield and time stay; grind stays only with the same grinder, else the
  grinder's last measured value or the middle of its range; untouched prep
  ticks re-apply the rule for the new setup. The chosen setup becomes
  current on save.
- **Done when:** AC 4 and AC 5 hold.

##### TASK-02-02-07-QA1 · Test switching setup
`qa` · Parent: STORY-02-02-07 · 3 h · New · Depends on: TASK-02-02-07-FE2
- **Build:** Unit tests for the carry-over rules; play tests for the select on
  Brew and the log, and the return from change-a-part.
- **Done when:** AC 1 to AC 5 are covered.

#### EPIC-02-03: Fix a bad shot from your recipe

##### STORY-02-03-01: Say whether a one-tap shot was good or off

##### TASK-02-03-01-BE1 · Add setting the reaction on a one-tap shot
`backend` · Parent: STORY-02-03-01 · 2 h · Unchanged · Depends on: TASK-02-02-02-BE1
- **Build:** Action `setReaction(shotId, 'good' | 'off' | null)` for owned
  one-tap shots, at any time (DQ-05).
- **Done when:** A measured shot is rejected, null clears, isolation cases
  added.

##### TASK-02-03-01-FE1 · Wire good and off in PulledState
`frontend` · Parent: STORY-02-03-01 · 3 h · Updated (off opens SH-OFF) · Depends on: TASK-02-03-01-BE1, TASK-02-02-02-FE2, TASK-02-03-04-FE2
- **Build:** Good saves and shows selected, nothing else. Off saves, then opens
  SH-OFF; the fix still opens if the save failed. On failure the chip
  returns with a neutral Notice. No reaction means nothing is asked again.
- **Done when:** AC 1 to AC 3 and AC 5 hold.

##### TASK-02-03-01-FE2 · Add the reaction chips to the one-tap shot detail
`frontend` · Parent: STORY-02-03-01 · 2 h · Unchanged · Depends on: TASK-02-03-01-BE1, TASK-02-06-03-FE2
- **Build:** Deselectable good and off chips on ShotDetailScreen for one-tap
  shots calling `setReaction`.
- **Done when:** A reaction can be given or changed later (AC 4).

##### TASK-02-03-01-QA1 · Test reactions
`qa` · Parent: STORY-02-03-01 · 3 h · Updated · Depends on: TASK-02-03-01-FE1, TASK-02-03-01-FE2
- **Build:** Node tests for `setReaction`; play tests for AC 1 to AC 3 and
  AC 5 in PulledState (off opens SH-OFF) and AC 4 on detail.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-03-02: Fix an off shot from my recipe

##### TASK-02-03-02-FE1 · Add the fix mode of the shot log with "was" values
`frontend` · Parent: STORY-02-03-02 · 5 h · Updated (suggestion, prep, milk) · Depends on: TASK-02-03-01-FE1, TASK-02-01-01-BE2, TASK-01-04-02-FE1, TASK-02-03-07-BE1, DES-02-03-01, DES-02-03-02
- **Build:** `/log?mode=fix&shotId=`: title `log.titleFix`, read-only
  portion, drink and setup; values, prep and milk from the current recipe;
  with a chosen suggestion, the change already applied and the
  `log.fromSuggestion` note, else `log.fromRecipe`. ShotDial shows `log.was`
  under changed tabs (check PR #3). Save calls `saveMeasuredShot` (two
  records, DQ-12).
- **Done when:** The log is prefilled (AC 1, AC 2); "was" on changed values
  only (AC 3); a new measured shot is saved and the one-tap shot keeps off
  and its answers (AC 4); leaving saves nothing (AC 5).

##### TASK-02-03-02-FE2 · Make pinning the primary action after a fix or dial-in
`frontend` · Parent: STORY-02-03-02 (also 02-03-03) · 2 h · Unchanged · Depends on: TASK-02-03-02-FE1, TASK-02-01-01-FE2
- **Build:** `/taste/[shotId]?from=fix|dialIn` swaps the actions: primary
  `recipe.pin` when no suggestion shows.
- **Done when:** Pin is the suggested next step after a fix (AC 4).

##### TASK-02-03-02-QA1 · Test fixing an off shot
`qa` · Parent: STORY-02-03-02 · 3 h · Updated (SQ-14 closed) · Depends on: TASK-02-03-02-FE2
- **Build:** Node tests: two records after the fix, the one-tap shot keeping
  off and answers, and both doses counting toward coffee used (answer 6);
  play tests for prefill, suggestion note, "was", pin primary and leaving.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-03-03: Dial in from my recipe

##### TASK-02-03-03-FE1 · Add the dial-in mode of the shot log
`frontend` · Parent: STORY-02-03-03 · 4 h · Updated (suggestion, portion sheet, none left) · Depends on: TASK-02-03-02-FE1, TASK-02-02-01-FE1, TASK-02-02-03-FE2, TASK-02-03-07-BE1
- **Build:** `/log?mode=dialIn&recipeId=` from Brew's `home.dialIn` and from
  recipe rows: title `log.titleDialIn`, values, temperature, pressure, prep
  and milk from the recipe, with a pending suggestion already applied. When
  no portion is open it asks which bag first (SH-PORTION, cancel opens
  nothing); with none left it shows the missing-coffee state. Save makes a
  measured shot, then the tasting screen with pin primary. No one-tap shot.
- **Done when:** AC 1 to AC 5 hold.

##### TASK-02-03-03-QA1 · Test dialing in from a recipe
`qa` · Parent: STORY-02-03-03 · 3 h · Updated · Depends on: TASK-02-03-03-FE1
- **Build:** Play tests for AC 1, AC 2, AC 4 and AC 5; a Node test for a
  measured shot and no one-tap row (AC 3).
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-03-04: Say what was off about a one-tap shot

##### TASK-02-03-04-BE1 · Add the SH-OFF read and the off-answers save
`backend` · Parent: STORY-02-03-04 · 3 h · New · Depends on: TASK-01-05-01-BE1, TASK-02-03-01-BE1
- **Build:** DAL `getOffContext(shotId)`: the one-tap shot, its recipe, setup
  capabilities, dose bound and clocks, for the suggestion rules. The
  `saveOffAnswers` variant is only for the household's one-tap shots that
  are marked off, and never accepts a rating.
- **Done when:** Answers are stored on the one-tap shot (AC 2); a rating or a
  measured shot is rejected; isolation cases.

##### TASK-02-03-04-FE1 · Build the off sheet (SH-OFF) with its stories
`frontend` · Parent: STORY-02-03-04 · 5 h · New · Depends on: DES-02-03-03, TASK-01-01-05-FE2, TASK-01-05-02-FE2, TASK-01-05-03-FE1, TASK-01-05-04-FE1, TASK-02-03-05-FE1
- **Build:** `OffSheet`, props-only: `off.title`, the four just-right rows and
  six tags (no rating), the warning Notice under the tags, a SuggestionCard
  slot, primary `suggest.tryIt` or `off.fix`, ghost `off.skip`, a save-failed
  Notice with retry. Stories: no answer, with suggestion, channelling,
  failed, RTL.
- **Done when:** Stories pass axe; one primary button; the sheet reuses the
  tasting screen's rows (AC 1, AC 5).

##### TASK-02-03-04-FE2 · Wire SH-OFF into Brew and the fix flow
`frontend` · Parent: STORY-02-03-04 · 3 h · New · Depends on: TASK-02-03-04-FE1, TASK-02-03-04-BE1, TASK-02-03-05-FE2
- **Build:** Off in PulledState opens OffSheet over Brew; answers save on any
  way out; fix opens the log with the suggested change, skip with the
  recipe only; a failed save shows retry and skip still opens the fix.
- **Done when:** AC 2 to AC 4 and AC 6 hold.

##### TASK-02-03-04-QA1 · Test the off path
`qa` · Parent: STORY-02-03-04 · 3 h · New · Depends on: TASK-02-03-04-FE2
- **Build:** Node tests for storage on the one-tap shot and rejections; play
  tests for answers, live suggestion, fix, skip, failed save and the
  channelling warning.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-03-05: See one suggested change, with its reason

##### TASK-02-03-05-BE1 · Add the suggestion engine skeleton, reasons and freshness explanations
`backend` · Parent: STORY-02-03-05 (also 06, 07) · 5 h · Updated (revision 3: clocks and fallbacks declared) · Depends on: TASK-01-05-03-BE1, TASK-01-06-08-BE1, TASK-03-03-01-BE1, TASK-03-03-04-BE1
- **Build:** `src/domain/suggest/`: input types (shot, answers, tags, recipe,
  setup capabilities, dose bound, clocks), the result type (one change or
  none, reason parts, freshness line), `constants.ts` (step sizes from
  answer 1; DQ-24 working-value thresholds (the Head of Product confirms them
  before the wave 12 suggestion tests are written): under 5 days, over 35 days since roast or
  packing, over 21 days open, freezer time excluded), the reason builder
  (shot time as a diagnostic only) and the freshness explanation. No lever
  logic yet.
- **Done when:** Only-rated and all-just-right input gives no change (AC 3);
  freshness is returned alone or with a change, never as a change (AC 4);
  nothing is stored; unit tests pass.

##### TASK-02-03-05-FE1 · Build SuggestionCard (NC-16) with its stories
`frontend` · Parent: STORY-02-03-05 · 4 h · New · Depends on: DES-02-03-04, DES-02-03-05, PR-3
- **Build:** `src/components/ui/SuggestionCard`: outline Card, overline, the
  change as a sentence with dial values ("15 → 13", arrow mirrors), a
  one-line reason, an optional freshness line, ghost dismiss, polite live
  region. Ink only. Stories: each lever, direction unknown, freshness only,
  RTL.
- **Done when:** Stories pass axe; no `signal` (AC 5).

##### TASK-02-03-05-FE2 · Show the live suggestion on the tasting screen and SH-OFF
`frontend` · Parent: STORY-02-03-05 · 3 h · New · Depends on: TASK-02-03-05-FE1, TASK-02-03-05-BE1, TASK-01-05-02-FE2
- **Build:** A client hook runs the engine on every answer or tag change; the
  card updates at once; no card with nothing to say.
- **Done when:** One change with a reason shows (AC 1, AC 2); it updates as
  answers change (AC 6).

##### TASK-02-03-05-QA1 · Test the suggestion card and its states
`qa` · Parent: STORY-02-03-05 · 3 h · New · Depends on: TASK-02-03-05-FE2
- **Build:** Unit tests for no-change cases and freshness thresholds; play
  tests for the live update and no `signal`.
- **Done when:** AC 1 to AC 6 are covered (levers by TASK-02-03-06-QA1).

##### STORY-02-03-06: Get the right change for what was off

##### TASK-02-03-06-BE1 · Add the puck prep and grind rules
`backend` · Parent: STORY-02-03-06 · 6 h · Updated (revision 3: grind periods declared) · Depends on: TASK-02-03-05-BE1, TASK-01-03-02-FE2, TASK-04-01-03-BE1
- **Build:** `src/domain/suggest/prep.ts` and `grind.ts`. Channelling signs:
  WDT, then puck screen, else the check-distribution message. Balance off
  with no signs: grind in the grinder's own direction, 1 step for "a bit"
  and 2 for "much", clamped to its range; with an unknown direction only
  "finer" or "coarser" with the tell-us-more link.
- **Done when:** The examples hold (AC 1, AC 2: 15 to 13 for much too sour);
  unknown direction gives no numbers (AC 6).

##### TASK-02-03-06-BE2 · Add the yield, dose, milk and temperature rules
`backend` · Parent: STORY-02-03-06 · 6 h · Updated (revision 3: grind periods declared) · Depends on: TASK-02-03-06-BE1, TASK-04-01-03-BE1
- **Build:** `yield.ts` (2 g, shorter for weak), `dose.ts` (0.5 g within the
  basket's range; skipped at the limit or with an unknown range; milk
  drinks "lost in the milk": dose first, then about 30 ml less milk) and
  `temperature.ts` (1 °C, only when grind is at its limit or a grind change
  didn't help, and only on a machine that can set it). Lever order in one
  place.
- **Done when:** AC 3 to AC 6 examples hold, incl. 18 g in 17 to 19 g giving
  18.5 g and 19 g moving to the next lever.

##### TASK-02-03-06-QA1 · Write the suggestion scenario test suite
`qa` · Parent: STORY-02-03-06 · 8 h · Updated (revision 3: grind-period scenario) · Depends on: TASK-02-03-06-BE2
- **Build:** A table of at least 40 scenarios under `src/domain/suggest/__tests__`
  covering every lever and direction, both step sizes, limits, "not sure"
  cases, milk drinks, lever ordering and no-change cases. A scenario passes
  when it gets the expected lever and direction. No LLM; the suite must
  pass before release.
- **Done when:** All scenarios pass; each AC 1 to AC 6 has at least two.
- **Added in revision 3:** a scenario for the temperature rule with
  grind-period history (a grind change in the same period that didn't help,
  and a recalibration that starts a new period).

##### STORY-02-03-07: Try the suggested change, or dismiss it

##### TASK-02-03-07-BE1 · Add the pending suggestion read and the device dismissal store
`backend` · Parent: STORY-02-03-07 (also 02-03-02, 03) · 3 h · New · Depends on: TASK-02-03-05-BE1, TASK-02-01-01-BE2
- **Build:** DAL `getPendingSuggestion({ beanId, setupId, drinkId })` runs the
  engine on the latest shot of that key. `src/lib/dismissals.ts` stores
  dismissals in localStorage by shot ID, with a session fallback.
- **Done when:** A dismissal lasts until the next shot on that key (AC 4,
  AC 5); with storage unavailable it lasts the session.

##### TASK-02-03-07-FE1 · Wire try-it, dismiss and the Brew label
`frontend` · Parent: STORY-02-03-07 · 4 h · New · Depends on: TASK-02-03-07-BE1, TASK-02-03-05-FE2, TASK-02-03-03-FE1, TASK-02-02-01-FE1
- **Build:** `suggest.tryIt` saves the tasting, then opens the log in dial-in
  mode with the shot's values plus the change (changed tab shows "was");
  leaving saves nothing. Brew's ghost reads `home.dialInSuggested` while a
  suggestion is pending and not dismissed.
- **Done when:** AC 1 to AC 4 hold.

##### TASK-02-03-07-QA1 · Test trying and dismissing
`qa` · Parent: STORY-02-03-07 · 3 h · New · Depends on: TASK-02-03-07-FE1
- **Build:** Unit tests for the dismissal lifetime; play tests for try, leave,
  Brew label and dismiss.
- **Done when:** AC 1 to AC 5 are covered.

#### EPIC-02-06: Look back in your journal

##### STORY-02-06-01: See my journal of shots

##### TASK-02-06-01-BE2 · Capture the device time zone for local-day calculations
`backend` · Parent: STORY-02-06-01 (also 02-02-01, 03-02, 03-03) · 2 h · Unchanged · Depends on: TASK-01-01-01-FE2
- **Build:** The client writes the IANA zone to a `tz` cookie; `src/server/time.ts`
  `getTimeZone()` validates it (UTC fallback); `src/domain/localDay.ts` has
  `localDayKey`, `startOfLocalDay` and `localNoon`.
- **Done when:** Unit tests pass across a DST change and a bad cookie; nothing
  is stored.

##### TASK-02-06-01-BE1 · Add the journal read
`backend` · Parent: STORY-02-06-01 · 4 h · Updated (milk, tags, setup) · Depends on: TASK-02-06-01-BE2, TASK-01-03-03-BE1
- **Build:** DAL `listJournal({ before?, limit, filters? })`: newest first, the
  last 30 days then pages by a cursor on `(created_at, id)`; each with
  drink, time, coffee (resolved), milk line, values, entry mode, reaction,
  tags (for the warning), `fromFrozen` and the grinder for dividers; day
  keys from `localDayKey`. Filters are added by TASK-02-06-04-BE1.
- **Done when:** Order, window and cursor are right with no gaps or
  duplicates; the query uses the `(household_id, created_at)` index.

##### TASK-02-06-01-FE1 · Wire the Journal tab with day groups, markers and older shots
`frontend` · Parent: STORY-02-06-01 · 3 h · Updated (Journal, milk; revision 3: markers and warning move to FE2) · Depends on: TASK-02-06-01-BE1, TASK-01-01-05-FE7, PR-3, DES-02-06-01
- **Build:** `src/app/(app)/journal/page.tsx` renders RecentShotsScreen
  (PR #3, renamed): day headings, rows with drink and time, coffee and milk,
  compact ShotValues, frozen marker and divider
  slots, `journal.showOlder` with skeleton rows, an EmptyState with
  `home.dialIn`, a load-failed Notice. Rows open `/journal/[shotId]`.
- **Done when:** AC 1 to AC 5 hold, except the reaction mark and the
  channelling warning, which TASK-02-06-01-FE2 adds in wave 9.

##### TASK-02-06-01-FE2 · Add the reaction mark and the channelling warning to Journal rows
`frontend` · Parent: STORY-02-06-01 · 2 h · New (revision 3) · Depends on: TASK-02-06-01-FE1, TASK-01-05-04-FE1
- **Build:** Extend the Journal rows from TASK-02-06-01-FE1 with the reaction
  mark in words and the inline channelling warning (Notice, `warning`),
  both read from `listJournal`.
- **Done when:** Rows with a reaction or a warning show them in words and
  without colour alone; the existing TASK-02-06-01-QA1 reaction and warning
  tests pass.

##### TASK-02-06-01-QA1 · Test the journal list
`qa` · Parent: STORY-02-06-01 · 4 h · Updated (revision 3: reaction and warning tests run in wave 9) · Depends on: TASK-02-06-01-FE1
- **Build:** Node tests for order, local-day grouping across midnight and DST,
  the window and cursor, isolation; story tests for markers in words,
  reaction, inline warning, empty and alignment in LTR and RTL; a row opens
  the detail.
- **Done when:** AC 1 to AC 5 are covered. In Milestone 1 the reaction and
  warning markers are skipped; the wave 9 re-run depends on
  TASK-02-06-01-FE2 and tests them.

##### STORY-02-06-02: Fix a shot after the fact

Deferred in revision 3: the whole story (BE1, FE1, QA1) moves to wave 9.
Its dependencies are unchanged.

##### TASK-02-06-02-BE1 · Add updating a shot's values, milk, prep, sweetened mark and taste
`backend` · Parent: STORY-02-06-02 · 4 h · Updated (prep, milk, taste model) · Depends on: TASK-01-05-01-BE1, TASK-01-04-01-BE1, TASK-01-03-07-BE1
- **Build:** Action `updateShot(shotId, { values?, brewControls?, milk?, prep?,
  sweetened?, taste? })`: owned shots; context (portion, drink, setup,
  persona, logger, entry mode) can't change; a one-tap shot gets answers
  and tags but no rating and keeps its reaction and mode; a stored
  out-of-range value may stay; recipes untouched.
- **Done when:** Only allowed fields change (AC 1 to AC 4); a dose change
  shows in remaining (AC 5); the recipe is unchanged (AC 5).

##### TASK-02-06-02-FE1 · Add the edit mode of the shot log with taste on the same screen
`frontend` · Parent: STORY-02-06-02 · 7 h · Updated (revision 4: 6 h to 7 h, adds the edit action to the shot detail) · Depends on: TASK-02-06-02-BE1, TASK-02-06-03-FE2, TASK-01-05-02-FE2, TASK-01-05-03-FE1, TASK-01-05-04-FE1, TASK-01-03-07-FE2, DES-02-06-03
- **Build:** `/log?mode=edit&shotId=`: title `log.titleEdit`, read-only
  context, ShotDial with saved values, prep, milk, sweetened, and the
  tasting controls below (no rating for one-tap), the warning under the tags,
  `log.saveChanges`, the unsaved guard. Also adds `shot.edit` to the shot
  detail's `actions` slot (primary for one-tap shots) and wires it in the
  detail route to open `/log?mode=edit` (TASK-02-06-03-FE2).
- **Done when:** Values and taste show together (AC 1, AC 2); context is
  read-only (AC 3); changes persist (AC 4); leave and confirm leaves the shot
  unchanged (AC 6); edit is at most two taps from the Journal tab, on measured
  and one-tap shots (STORY-02-06-03 AC 3, AC 4).

##### TASK-02-06-02-QA1 · Test editing a shot
`qa` · Parent: STORY-02-06-02 · 4 h · Updated · Depends on: TASK-02-06-02-FE1
- **Build:** Node tests for allowed and forbidden fields, one-tap staying
  one-tap with no rating, and remaining following the new dose; play tests
  for layout, warning and discard. Also tests STORY-02-06-03's edit action
  (AC 3 and AC 4) from the shot detail, on measured and one-tap shots.
- **Done when:** AC 1 to AC 6 are covered, plus STORY-02-06-03's edit action.

##### STORY-02-06-03: See a shot's details

##### TASK-02-06-03-BE1 · Add the shot detail read
`backend` · Parent: STORY-02-06-03 · 3 h · Updated (parts, prep, milk, taste) · Depends on: TASK-01-03-03-BE1, TASK-01-02-01-BE5
- **Build:** DAL `getShot(id)`: values, drink, coffee (resolved), the setup with
  machine, grinder and basket by maker and model, date and time, milk, prep,
  sweetened, rating, answers, tags, entry mode and reaction.
- **Done when:** Every field in AC 1 and AC 2 is returned; another
  household's ID is not found.

##### TASK-02-06-03-FE1 · Build the shot detail screen (SCR-SHOT) with its stories
`frontend` · Parent: STORY-02-06-03 · 3 h · Updated (revision 3: reaction, tags and warning move to FE3) · Depends on: DES-02-06-02, PR-3
- **Build:** `ShotDetailScreen`, props-only: large ShotValues, context with
  parts, date, milk, prep when used and taste phrases ("a bit sour"). The
  reaction, tags and block warning come from TASK-02-06-03-FE3. **Read-only in
  Milestone 1 (revision 4):** no pin, edit or dial-in action. The screen
  takes an optional `actions` slot, which stays empty here; each action is
  added by the task that delivers its target (edit: TASK-02-06-02-FE1; pin:
  TASK-02-01-01-FE2; dial in: TASK-02-06-06-FE1). One-tap shows
  `shot.copiedFromRecipe`. Stories: measured, one-tap, channelling, RTL.
- **Done when:** Stories pass axe; there is no dead action on the screen; the
  `actions` slot renders what it is given (the later tasks' stories add the
  buttons).

##### TASK-02-06-03-FE3 · Add the reaction, tags and warning to the shot detail
`frontend` · Parent: STORY-02-06-03 · 2 h · New (revision 3) · Depends on: TASK-02-06-03-FE1, TASK-01-05-04-FE1
- **Build:** Extend `ShotDetailScreen` with the reaction, the taste tags and
  the block channelling warning, and wire them from `getShot`.
- **Done when:** Stories for channelling and one-tap show them and pass axe;
  the existing TASK-02-06-03-QA1 tests for the warning and taste phrases
  pass.

##### TASK-02-06-03-FE2 · Wire the shot detail route
`frontend` · Parent: STORY-02-06-03 · 2 h · Unchanged · Depends on: TASK-02-06-03-FE1, TASK-02-06-03-BE1
- **Build:** `src/app/(app)/journal/[shotId]/page.tsx` with `getShot`. It
  shows no actions in Milestone 1. Edit (TASK-02-06-02-FE1), pin
  (TASK-02-01-01-FE2) and dial in (TASK-02-06-06-FE1) are wired by those
  tasks, which depend on this route.
- **Done when:** The route shows the shot read-only from the Journal row.

##### TASK-02-06-03-QA1 · Test shot details
`qa` · Parent: STORY-02-06-03 · 3 h · Updated (revision 3: reaction and warning tests run in wave 9) · Depends on: TASK-02-06-03-FE2
- **Build:** Node test for `getShot` fields; story tests for the measured and
  one-tap layouts, taste phrases and the warning. The action checks (pin,
  edit, dial in, AC 3 and AC 4) are tested in TASK-02-06-02-QA1,
  TASK-02-01-01-QA1 and TASK-02-06-06-QA1.
- **Done when:** AC 1 to AC 5 are covered. In Milestone 1 the reaction and
  warning, and the actions of AC 3 and AC 4, are skipped. The reaction and
  warning are tested in the wave 9 re-run, which also depends on
  TASK-02-06-03-FE3.

##### STORY-02-06-04: Filter my journal by drink, coffee and setup

##### TASK-02-06-04-BE1 · Add journal filters to the read and the filter options
`backend` · Parent: STORY-02-06-04 · 3 h · New · Depends on: TASK-02-06-01-BE1
- **Build:** `listJournal` accepts `drinkId`, `beanId` (merge group) and
  `setupId`; DAL `getJournalFilterOptions()` returns drinks, coffees with
  shots and setups, and whether there is more than one setup.
- **Done when:** Filters combine, apply to older pages (AC 3); the setup filter
  is offered only with several setups (AC 1).

##### TASK-02-06-04-FE1 · Add the filter variant of ChipGroup and the Journal filter row
`frontend` · Parent: STORY-02-06-04 · 4 h · New · Depends on: PR-3, TASK-01-01-05-FE1, TASK-01-03-01-FE1, DES-02-06-01
- **Build:** ChipGroup filter variant (shows its value, opens a select, filled
  with a close Icon when active, accessible name with value and "remove") and
  a `JournalFilters` row with the leading `journal.filterAll` chip.
  Stories incl. RTL.
- **Done when:** Stories pass axe; each active filter is removable alone and
  "All" clears them (AC 2, AC 5).

##### TASK-02-06-04-FE2 · Wire the filters into the Journal with URL params and the filtered empty state
`frontend` · Parent: STORY-02-06-04 · 4 h · New · Depends on: TASK-02-06-04-FE1, TASK-02-06-04-BE1, TASK-02-06-01-FE1
- **Build:** Filters live in search params; show older keeps them; the
  filtered empty state `journal.emptyFiltered` names the filters with
  `journal.clearFilters` while the chips stay visible.
- **Done when:** AC 1 to AC 4 hold; the back button keeps the filters.

##### TASK-02-06-04-QA1 · Test journal filters
`qa` · Parent: STORY-02-06-04 · 3 h · New · Depends on: TASK-02-06-04-FE2
- **Build:** Node tests for each filter, combinations, older pages and the
  setup option; play tests for keyboard, announcement, "All" and the empty
  state.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-06-05: Open the journal on what I'm brewing

##### TASK-02-06-05-FE1 · Pre-filter the Journal from Brew and from a coffee
`frontend` · Parent: STORY-02-06-05 · 3 h · New · Depends on: TASK-02-06-04-FE2, TASK-02-02-06-FE1
- **Build:** The tab bar's Journal link adds `drinkId` and `beanId` from Brew's
  current choice (client state); none on first run; a coffee's "all shots"
  link sets the coffee only. Returning from a shot keeps the URL's filters.
- **Done when:** AC 1 to AC 4 hold; the setup is never pre-set.

##### TASK-02-06-05-QA1 · Test the default filters
`qa` · Parent: STORY-02-06-05 · 2 h · New · Depends on: TASK-02-06-05-FE1
- **Build:** Play tests for the link with a selection, first run, back from a
  shot and from a coffee screen.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-06-06: Dial in from a past shot

##### TASK-02-06-06-BE1 · Add the dial-in start from a past shot
`backend` · Parent: STORY-02-06-06 · 3 h · New · Depends on: TASK-02-06-03-BE1, TASK-02-02-03-BE1
- **Build:** DAL `getDialInFromShot(shotId)`: values, prep, milk, the shot's
  setup, drink and coffee, and portion state: the one-tap-rule portion,
  `needsPortion`, or `finished`. Saving a new shot on another setup makes it
  current through `saveMeasuredShot`.
- **Done when:** AC 1 to AC 3 data is right; AC 4 holds after a save; the
  source shot is never written (AC 5).

##### TASK-02-06-06-FE1 · Add "dial in from this" to shot detail and the log note
`frontend` · Parent: STORY-02-06-06 · 4 h · New · Depends on: TASK-02-06-06-BE1, TASK-02-06-03-FE2, TASK-02-03-03-FE1, TASK-02-02-03-FE2
- **Build:** Adds `shot.dialInFromThis` to the shot detail's `actions` slot
  (the detail is read-only in Milestone 1). It opens the log in dial-in mode with the
  `log.fromShot` note; SH-PORTION first when no portion is open; a
  missing-coffee state when finished.
- **Done when:** AC 1 to AC 4 hold; it is two taps from the list.

##### TASK-02-06-06-QA1 · Test dialing in from a past shot
`qa` · Parent: STORY-02-06-06 · 3 h · New · Depends on: TASK-02-06-06-FE1
- **Build:** Node tests for the read, current-setup change on save and the
  untouched source; play tests for the sheet and finished coffee. Also tests
  STORY-02-06-03's dial-in action (AC 3 and AC 4) from the shot detail.
- **Done when:** AC 1 to AC 5 are covered, plus STORY-02-06-03's dial-in
  action.

#### EPIC-02-04: Give one bag its own recipe (revision 5, Next)

Design: DES-02-04-01 to 03. 13 tasks, 53 h. `pinned_recipes.batch_id` exists
and every reader (`getCurrentRecipe`, `listCurrentRecipesForBean`,
`getCoffeeRecipes`) filters `isNull(batchId)`, so this epic changes reads, not
the pin table, except one column for removal (TD-6). Built today: `PinSheet`,
`usePinFlow`, `pinPreview`, `pinFromShot`, `pinEnteredRecipe`,
`getRecipeForBag`, `getBagRecipes` in `src/server/dal/recipes.ts`; every pin
is saved for the coffee.

##### STORY-02-04-01: Pin a recipe for one bag only

##### TASK-02-04-01-BE1 · Make recipe reads scope-aware
`backend` · Parent: STORY-02-04-01 (also 02-04-02, 02-04-03) · 5 h · New (rev 5) · Depends on: TASK-02-04-04-BE1
- **Build:**
  - `src/server/dal/recipes.ts`: `getCurrentRecipe(key, batchId?)` returns the
    bag's newest own pin (`batchId` set, `removedAt` null) for the key, else
    the coffee's (as today). Add `getBagOwnRecipe`, and `getBagRecipes` returns
    `{ own, coffee }` per setup and drink. Same merge-group and `NEWEST`
    ordering; the coffee-level readers keep filtering `isNull(batchId)`.
  - Every caller keeps compiling with the old signature (the `batchId` is
    optional); later tasks pass it.
  - Unit tests with the mocked `@/db/client` (`recipes.test.ts` style).
- **Done when:** The coffee's recipe is never changed by a bag pin; a removed
  bag recipe is skipped; merges are followed.

##### TASK-02-04-01-BE2 · Add the scope to pin previews and pins
`backend` · Parent: STORY-02-04-01 · 5 h · New (rev 5) · Depends on: TASK-02-04-01-BE1, TASK-02-01-07-BE2
- **Build:**
  - `pinPreview(shotId)` and `enteredPinPreview` return `scope`: whether it is
    offered (the coffee already has its own recipe for this drink and setup),
    the default (bag when the bag already has its own recipe, else coffee),
    the bag's id and roast date, whether the bag is finished (no unfinished
    portion), and both replaced blocks so the sheet swaps without loading
    (design step 5).
  - `pinFromShot(shotId, scope, now)` and `pinEnteredRecipe(input, scope)`
    insert with `batchId` for `"batch"`; the shot's portion gives the bag. The
    server refuses `"batch"` when the coffee has no recipe yet (AC 2), when the
    bag is finished (AC 6) or when the bag isn't the household's. Older rows
    are kept.
  - `src/server/actions/recipes.ts` passes the scope.
- **Done when:** Unit tests cover offered/not offered, both defaults, a bag
  pin leaving the coffee's recipe untouched, a second bag pin replacing the
  first while keeping it (AC 5), a finished bag and a failed insert.

##### TASK-02-04-01-FE1 · Add the scope choice to the pin sheet
`frontend` · Parent: STORY-02-04-01 · 5 h · New (rev 5) · Depends on: TASK-02-04-01-BE2, DES-02-04-01, DES-02-04-03
- **Build:**
  - `PinSheet.tsx` / `usePinFlow.tsx`: a scope row under the title,
    `recipe.scope` overline and a two-chip single-choice `ChipGroup`
    (`recipe.scope.bean`, `recipe.scope.batch`), always one chosen; hidden when
    not offered.
  - A polite live region under it says what the choice does
    (`recipe.scope.beanEffect`, `.bagKeeps`, `.batchEffect`). The replaced
    block swaps in place between `recipe.replaces` and `recipe.insteadOf`, and
    the changes list follows it.
  - The bag chip is disabled with `recipe.scope.bagFinished` when finished.
    Status line `recipe.pinned` or `recipe.pinnedBag`. A failed save keeps the
    sheet and the choice, with a retry Notice.
  - Stories in `PinSheet.stories.tsx`: both choices, the bag default, hidden
    for a first pin, finished bag, failed, right-to-left; the primary stays on
    screen at 375 x 667.
- **Done when:** Stories pass axe; AC 1, AC 3, AC 4 and AC 6 are visible in the
  stories, and AC 2 and AC 5 are checked in TASK-02-04-01-BE2's unit tests.

##### TASK-02-04-01-QA1 · Test pinning for one bag only
`qa` · Parent: STORY-02-04-01 · 5 h · New (rev 5) · Depends on: TASK-02-04-01-FE1
- **Build:** Node tests for scope offered/hidden, defaults, the first-pin rule,
  a bag pin leaving the coffee's recipe, re-pinning keeping the older rows, a
  finished bag and a failing save (choice kept); play tests for the helper
  line announcement and the swapping block.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-04-02: Use the bag's recipe while that bag is in use

##### TASK-02-04-02-BE1 · Use the bag's own recipe for Brew, the pull, dial in and fix
`backend` · Parent: STORY-02-04-02 · 6 h · New (rev 5) · Depends on: TASK-02-04-01-BE1
- **Build:**
  - The bag in use is the earliest-opened open portion's batch (`LogPortion`
    in `logContext.ts`). `home.ts` resolves each coffee's recipe with that
    batch; `HomeState`'s `recipe` kind gains `bagOwn`.
  - `pull.ts` picks the portion first and then resolves the recipe with its
    batch (today it resolves before the portion); the "has a recipe" check
    stays at coffee level, since a bag recipe can't exist without one.
  - `getDialInStart` / `getDialInFromRecipe` (`dialIn.ts`, `logStart.ts`) and
    `getFixStart` pass the portion's batch. A new bag has no own recipe, so
    the coffee's recipe applies with no prompt (AC 3). Split and frozen
    portions share the bag's recipe (AC 4). A bag that isn't in use changes
    nothing on Brew (AC 5).
  - Prep, milk and sweetened come with the recipe (AC 2).
- **Done when:** Unit tests cover each call site, a new bag, split and frozen
  portions and a bag not in use; the full suite still passes.

##### TASK-02-04-02-QA1 · Test using the bag's recipe
`qa` · Parent: STORY-02-04-02 · 4 h · New (rev 5) · Depends on: TASK-02-04-02-BE1
- **Build:** Node tests of the pulled shot's values (prep, milk, sweetened),
  dial in and fix from the bag's recipe, moving to a new bag, split/frozen
  portions, and a bag with a recipe that isn't in use.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-04-03: See which recipe is for one bag only

##### TASK-02-04-03-FE1 · Mark a bag's own recipe on Brew and in the portion sheet
`frontend` · Parent: STORY-02-04-03 · 3 h · New (rev 5) · Depends on: TASK-02-04-02-BE1, DES-02-04-02
- **Build:** `HomeScreen.tsx`: when `bagOwn`, the first quiet line is
  `recipe.thisBagOnly`. `PortionSheet.tsx` / `PortionChooser.tsx`: an option
  whose bag has its own recipe carries the same words. Stories for both.
- **Done when:** The marker is text, never colour; stories pass axe and RTL
  (AC 1, AC 3, AC 5).

##### TASK-02-04-03-FE2 · Show both recipes on the bag screen and mark bag rows on the coffee screen
`frontend` · Parent: STORY-02-04-03 · 5 h · New (rev 5) · Depends on: TASK-02-04-01-BE1, DES-02-04-02, DES-02-04-03
- **Build:**
  - `BagScreen.tsx` and `app/(app)/beans/[batchId]/page.tsx`: the bag's own
    recipe first with the overline `recipe.thisBagOnly`, then the coffee's under
    `recipe.coffeeDefault` ("other bags use") in `ink-secondary`. Rows use
    `recipeRows.ts` / `recipeLines.ts`.
  - `CoffeeScreen.tsx` bag rows: `recipe.bagHasOwn` in the secondary line; the
    recipes listed are the coffee's own.
  - The Journal and the shot detail get no marker (AC 5).
  - Stories: bag with own, without, RTL.
- **Done when:** Stories pass axe; AC 2 and AC 4 are visible.

##### TASK-02-04-03-QA1 · Test the bag-only markers
`qa` · Parent: STORY-02-04-03 · 3 h · New (rev 5) · Depends on: TASK-02-04-03-FE2, TASK-02-04-03-FE1
- **Build:** Play tests of each marker's text and position; a check that the
  Journal and shot detail show none.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-02-04-04: Use the coffee's recipe for this bag again

##### TASK-02-04-04-BE1 · Add removed_at to pinned recipes
`backend` · Parent: STORY-02-04-04 (also 02-04-01, 02-04-02) · 2 h · New (rev 5) · Depends on: TASK-02-01-07-BE1
- **Build:** `src/db/schema.ts`: `removedAt: integer("removed_at", { mode:
  "timestamp_ms" })` on `pinnedRecipes`, nullable. Not in the key index. New
  migration; update `schema.test.ts`. Written only when a bag's own recipe is
  removed (Head of Product Q3: it stops applying and is kept, like older
  pins, STORY-02-01-03). Build it first in the epic: the reads depend on it.
- **Done when:** The migration applies; existing rows read null; a column
  rename fails the schema test.

##### TASK-02-04-04-BE2 · Add removing a bag's own recipe
`backend` · Parent: STORY-02-04-04 · 4 h · New (rev 5) · Depends on: TASK-02-04-04-BE1, TASK-02-04-01-BE1
- **Build:**
  - `removeBagRecipe(batchId, setupId, drinkTypeId)` in `recipes.ts` and its
    action: sets `removedAt` on the bag's unremoved rows for the household's
    persona, setup and drink (`assertOwned("batches", ...)`); the coffee's
    recipe and every shot are untouched.
  - Every reader of bag recipes filters `removedAt` (`getCurrentRecipe`,
    `getBagOwnRecipe`, `getBagRecipes`, and the recipe-in-force rule in
    TASK-04-02-02-BE1).
- **Done when:** After removing, Brew and the pre-filled log use the coffee's
  recipe for the bag (AC 2); rows are kept; a second pin for the bag applies
  again; a failure changes nothing (AC 4).

##### TASK-02-04-04-FE1 · Add "use the coffee's recipe for this bag" to the bag screen
`frontend` · Parent: STORY-02-04-04 · 3 h · New (rev 5) · Depends on: TASK-02-04-04-BE2, TASK-02-04-03-FE2, DES-02-04-02
- **Build:** A ghost action `recipe.bagRemove` on the bag's own row opens the
  existing `ConfirmSheet` once; confirming calls the action and refreshes; a
  failure keeps the sheet with a retry Notice; not confirming changes nothing.
  Story added.
- **Done when:** AC 1, AC 3 and AC 4 hold in stories and play tests.

##### TASK-02-04-04-QA1 · Test removing a bag's own recipe
`qa` · Parent: STORY-02-04-04 · 3 h · New (rev 5) · Depends on: TASK-02-04-04-FE1
- **Build:** Node tests for removal, the untouched coffee recipe and kept rows,
  older shots unchanged, re-pinning afterwards; play tests of confirm,
  cancel, and failure.
- **Done when:** AC 1 to AC 5 are covered.

#### EPIC-02-05: Make the drink and milk lists yours (revision 5, Next)

Design: DES-02-05-01 to 04. 29 tasks, 116 h. No schema change (TD-10).
Built today: `drink_types` and `milk_types` with `name`, `nameKey`, `hidden`,
`sortOrder` (drinks also `hasMilk`, `typicalMilkMl`); `getLogContext` already
leaves out hidden drinks and milks; `drinkLabel` / `milkLabel` give a stored
name precedence over the translated key; `SelectSheet` already takes one
`footerRow`; `Toggle` has no `disabled` or `hint`; `NumberWheel` already has
the `milliliter` unit. Screens live under Profile
(`/profile/drinks`, `/profile/milks`, full-screen tasks in `(task)`).

##### STORY-02-05-01: Rename a drink

##### TASK-02-05-01-BE1 · Add the drinks list reads and renaming
`backend` · Parent: STORY-02-05-01 · 4 h · New (rev 5) · Depends on: none
- **Build:**
  - `src/domain/listName.ts`: one name rule for drinks, milks and (later)
    profiles: trim, 1 to 40 characters, unique ignoring case against every
    visible and hidden item of the household, starter rows compared by their
    translated name (the action passes a resolver). Unit tests.
  - `src/server/dal/drinks.ts`: `listDrinks()` (all, hidden included, in
    order) and `renameDrink(id, name | null)`; `null` clears the stored name
    so a starter drink returns to its translated key (AC 2); a custom drink
    can't be reset. `assertOwned("drinkTypes")`. Action in
    `src/server/actions/lists.ts`.
- **Done when:** Empty and duplicate names are refused with a reason code;
  recipes and shots aren't touched (AC 5).

##### TASK-02-05-01-FE1 · Build the drinks list screen and the drink sheet
`frontend` · Parent: STORY-02-05-01 (also 02-05-02, 02-05-03, 02-05-06) · 8 h · New (rev 5) · Depends on: TASK-02-05-01-BE1, DES-02-05-01
- **Build:**
  - `src/components/screens/DrinksScreen/DrinksScreen.tsx` (SCR-DRINKS):
    `PageHeader`, intro sentence, one `ListRow` per drink (name, secondary
    `drinks.withMilk` or `drinks.noMilk`, hidden ones with the overline
    `drinks.hidden` in `ink-secondary`), a plus row `drinks.add`. No primary
    button.
  - The drink sheet (SH-DRINK, `src/components/lists/DrinkSheet.tsx`):
    `Input` for the name (40 characters, wraps rather than truncates), the
    ghost `drinks.resetName` only on a renamed starter drink, the read-only
    `drinks.hasMilk` line, the usual-milk and show/hide controls added by
    their tasks, one primary `actions.save`, a close-with-changes
    `ConfirmSheet`. Add mode is the same sheet empty.
  - Ink-text errors `drinks.nameTaken` and `drinks.nameRequired`; a failed
    save keeps the typed name with a retry Notice.
  - Stories: list (with hidden and long names), edit, rename error, add,
    failed save, loading skeleton, right-to-left.
- **Done when:** Stories pass axe; AC 3, AC 4 and AC 6 of 02-05-01 are visible
  (the sheet's other controls land with their tasks).

##### TASK-02-05-01-FE2 · Wire the drinks route
`frontend` · Parent: STORY-02-05-01 · 4 h · New (rev 5) · Depends on: TASK-02-05-01-FE1
- **Build:** `src/app/(task)/profile/drinks/page.tsx` reading `listDrinks`
  (`unlessSignedOut`, skeleton while loading, `LoadFailed` with retry), server
  actions for save, return-to via `src/lib/returnTo.ts`, route constants in
  `src/lib/profileRoutes.ts`. `en.json` keys `drinks.*`.
- **Done when:** A renamed drink shows its name on Brew, in the log, on past
  shots and in the Journal in every language (AC 1).

##### TASK-02-05-01-QA1 · Test renaming a drink
`qa` · Parent: STORY-02-05-01 · 5 h · New (rev 5) · Depends on: TASK-02-05-01-FE2
- **Build:** Node tests for the name rule (empty, duplicate ignoring case,
  hidden drinks included, 40 characters), reset to the translated name,
  recipes unchanged; a check that `drinkLabel` is used on Brew, the log, the
  Journal and the shot detail; play tests for the long name and a failed save
  keeping the text.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-05-02: Hide drinks I don't make

##### TASK-02-05-02-BE1 · Add hiding and unhiding drinks with the keep-one rule
`backend` · Parent: STORY-02-05-02 · 4 h · New (rev 5) · Depends on: TASK-02-05-01-BE1
- **Build:**
  - `setDrinkHidden(id, hidden)` in `drinks.ts`: in one transaction, refuses
    to hide the last shown drink (`KeepOneError`).
  - `getLogContext` already leaves hidden drinks out of Brew and the log;
    `getJournalFilterOptions` (`journal.ts`) leaves them out of the drink
    chip unless a shot of the drink is in view; confirm `pickDrink` falls to
    the next shown drink when the usual one is hidden (AC 3). Past shots keep
    their drink (AC 2).
- **Done when:** Unit tests cover hide, unhide, the last shown drink and the
  fallback.

##### TASK-02-05-02-FE1 · Extend Toggle with a disabled state and a reason line
`frontend` · Parent: STORY-02-05-02 (also 02-05-05) · 3 h · New (rev 5) · Depends on: DES-02-05-04
- **Build:** `src/components/ui/Toggle/Toggle.tsx`: optional `disabled` and
  `hint` (the reason, linked with `aria-describedby`, shown under the switch).
  Stories in `Toggle.stories.tsx`: disabled with a reason, RTL, axe.
- **Done when:** The story shows a disabled switch with its reason in text
  (AC 5); existing Toggle stories still pass.

##### TASK-02-05-02-FE2 · Add show or hide to the drink sheet
`frontend` · Parent: STORY-02-05-02 · 2 h · New (rev 5) · Depends on: TASK-02-05-02-BE1, TASK-02-05-02-FE1, TASK-02-05-01-FE2
- **Build:** The `drinks.show` Toggle in the drink sheet, disabled with
  `drinks.keepOne` on the last shown drink; saved with the sheet; a failed save
  leaves the setting unchanged with a retry Notice.
- **Done when:** AC 1, AC 4, AC 5 and AC 6 hold in stories and play tests.

##### TASK-02-05-02-QA1 · Test hiding drinks
`qa` · Parent: STORY-02-05-02 · 4 h · New (rev 5) · Depends on: TASK-02-05-02-FE2
- **Build:** Node tests: gone from Brew's select, the log and the Journal
  filter; past shots keep it; time-of-day fallback; unhide; the last shown
  drink; failure. Play test for the disabled switch.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-05-03: Add my own drink

##### TASK-02-05-03-BE1 · Add a custom drink
`backend` · Parent: STORY-02-05-03 · 4 h · New (rev 5) · Depends on: TASK-02-05-01-BE1
- **Build:** `addDrink({ name, hasMilk, typicalMilkMl? })` in `drinks.ts`:
  `sortOrder` last, `typicalMilkMl` 120 when it has milk (0 to 500 step 10),
  none otherwise, unique name by the shared rule. There is no function that
  changes `hasMilk` afterwards, and `updateDrink` rejects it (AC 3). Existing
  drinks are untouched.
- **Done when:** Unit tests cover a milk drink, a plain one, duplicate and
  empty names, and the missing milk change.

##### TASK-02-05-03-FE1 · Add the add mode to the drink sheet
`frontend` · Parent: STORY-02-05-03 · 4 h · New (rev 5) · Depends on: TASK-02-05-03-BE1, TASK-02-05-01-FE1
- **Build:** In add mode: the milk Toggle (default off) with the line that it
  can't be changed later and the hint `drinks.hasMilk.hint` (a variation is its
  own drink), and when on the usual-milk `NumberWheel` (`milliliter`, starting
  120 ml, step 10). Saved at the end of the list. Existing drinks show the
  milk setting as a line, with nothing offering to add milk. Stories.
- **Done when:** AC 1 to AC 3 and AC 5 to AC 6 hold in stories.

##### TASK-02-05-03-QA1 · Test adding a drink
`qa` · Parent: STORY-02-05-03 · 4 h · New (rev 5) · Depends on: TASK-02-05-03-FE1, TASK-02-05-01-FE2
- **Build:** Node tests: added last and offered on Brew and in the log, milk
  fields only with milk, a recipe for it separate from the others, duplicates,
  failure keeping input; play test that milk can't be edited on any existing
  drink.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-05-04: Put my drinks in my order

##### TASK-02-05-04-BE1 · Add moving drinks
`backend` · Parent: STORY-02-05-04 (also 02-05-05) · 3 h · New (rev 5) · Depends on: TASK-02-05-01-BE1
- **Build:** `moveDrink(id, toIndex)` in `drinks.ts` renumbers `sortOrder`
  densely in one transaction (hidden drinks keep their place), used by every
  chooser through the existing `(household_id, sort_order)` index. The same
  function shape for milks in TASK-02-05-05-BE1.
- **Done when:** Moves up, down, first and last are exact; a failed move
  changes nothing.

##### TASK-02-05-04-FE1 · Build ReorderList (NC-17) with its story
`frontend` · Parent: STORY-02-05-04 (also 02-05-05) · 5 h · New (rev 5) · Depends on: DES-02-05-03, DES-02-05-04
- **Build:**
  - `src/components/ui/ReorderList`: `ListRow`s with a reorder mode; move-up
    and move-down buttons (44 px) replace the tap target; the first and last
    disable the impossible one; focus stays on the button just used; a polite
    live region says the new place (`reorder.moved`: "Latte, 2 of 9"). No
    dragging.
  - `Icon.tsx` gains `up` and `down` strokes (block directions, no mirroring).
  - Stories: list, mode on, first/last, long names, RTL, axe, a keyboard play
    test.
- **Done when:** Reordering works with keyboard and screen reader without
  dragging and each move is announced (AC 2).

##### TASK-02-05-04-FE2 · Add reordering to the drinks screen
`frontend` · Parent: STORY-02-05-04 · 3 h · New (rev 5) · Depends on: TASK-02-05-04-BE1, TASK-02-05-04-FE1, TASK-02-05-01-FE2
- **Build:** The header ghost `drinks.reorder` toggles ReorderList and becomes
  `actions.done`; each move saves at once; a failed move returns the row and
  shows `drinks.reorderFailed` with retry. The order shows on Brew, the log
  and the Journal chip.
- **Done when:** AC 1, AC 3 and AC 4 hold.

##### TASK-02-05-04-QA1 · Test reordering drinks
`qa` · Parent: STORY-02-05-04 · 4 h · New (rev 5) · Depends on: TASK-02-05-04-FE2
- **Build:** Node tests for order everywhere a drink is chosen, a new drink
  last, a failed move reverting; play tests with the keyboard, the live-region
  text and RTL.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-05-05: Make the milk list mine

##### TASK-02-05-05-BE1 · Add the milk list: rename, hide, add, move
`backend` · Parent: STORY-02-05-05 · 6 h · New (rev 5) · Depends on: TASK-02-05-01-BE1, TASK-02-05-04-BE1
- **Build:** `src/server/dal/milks.ts`: `listMilks`, `renameMilk`,
  `setMilkHidden` (keep-one in a transaction), `addMilk({ name, kind })`
  (kind `dairy` or `plant` written only here), `moveMilk`. No delete function
  exists (AC 5). Names by the shared rule. Actions in `lists.ts`.
- **Done when:** Unit tests cover each function, the shared name rule across
  hidden milks, the last shown milk and the absence of a delete.

##### TASK-02-05-05-FE1 · Build the milks screen and the milk sheet
`frontend` · Parent: STORY-02-05-05 · 6 h · New (rev 5) · Depends on: TASK-02-05-05-BE1, TASK-02-05-02-FE1, TASK-02-05-04-FE1, DES-02-05-02
- **Build:** `MilksScreen` (SCR-MILKS) and `MilkSheet` (SH-MILK) mirroring the
  drinks pair: rows with `milks.kind.dairy` / `.plant`, no usual amount; the
  sheet's name Input, a two-chip kind `ChipGroup` required when adding and a
  plain line afterwards, the show/hide Toggle with the keep-one reason, one
  primary. Stories like the drinks, RTL included.
- **Done when:** Stories pass axe; AC 1 to AC 3 and AC 5 are visible.

##### TASK-02-05-05-FE2 · Wire the milks route and reordering
`frontend` · Parent: STORY-02-05-05 · 3 h · New (rev 5) · Depends on: TASK-02-05-05-FE1, TASK-02-05-04-FE2
- **Build:** `src/app/(task)/profile/milks/page.tsx`, actions, skeleton and
  `LoadFailed`, ReorderList mode with announcements and revert on failure,
  `milks.*` keys.
- **Done when:** AC 4 and AC 6 hold; the order shows in the log's milk choice.

##### TASK-02-05-05-QA1 · Test the milk list
`qa` · Parent: STORY-02-05-05 · 5 h · New (rev 5) · Depends on: TASK-02-05-05-FE2
- **Build:** Node tests: rename shown on past shots, duplicates across hidden
  milks, hide and keep-one, add with kind, kind not editable, order, no delete
  offered, failure keeping input; play tests (keyboard reorder, RTL).
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-02-05-06: Set how much milk a drink usually gets

##### TASK-02-05-06-BE1 · Set a drink's usual milk amount
`backend` · Parent: STORY-02-05-06 · 2 h · New (rev 5) · Depends on: TASK-02-05-01-BE1
- **Build:** `setUsualMilk(id, ml)` in `drinks.ts`: milk drinks only, 0 to 500,
  step 10 (`validateMilk` rules in `src/domain/milk.ts`). New logs read it as
  before through `getLogContext` (`typicalMilkMl`) when no recipe sets one;
  past shots and recipes are untouched (AC 3).
- **Done when:** Unit tests cover the range, a no-milk drink being refused and
  past data unchanged.

##### TASK-02-05-06-FE1 · Add the usual milk wheel to the drink sheet
`frontend` · Parent: STORY-02-05-06 · 2 h · New (rev 5) · Depends on: TASK-02-05-06-BE1, TASK-02-05-01-FE1
- **Build:** `drinks.usualMilk` with `NumberWheel` (`milliliter`, 0 to 500,
  step 10) in edit mode for a milk drink only. Story.
- **Done when:** A no-milk drink shows no amount (AC 2); the wheel works
  without a keyboard (AC 1).

##### TASK-02-05-06-QA1 · Test the usual milk amount
`qa` · Parent: STORY-02-05-06 · 3 h · New (rev 5) · Depends on: TASK-02-05-06-FE1
- **Build:** A new log starts from the set amount with no recipe and from the
  recipe's when one exists; past shots and recipes unchanged; no-milk drink
  asks nothing.
- **Done when:** AC 1 to AC 3 are covered.

##### STORY-02-05-07: Reach my lists from Profile and from where I choose

##### TASK-02-05-07-BE1 · Add the list summaries for Profile
`backend` · Parent: STORY-02-05-07 · 2 h · New (rev 5) · Depends on: TASK-02-05-05-BE1
- **Build:** `getListSummaries()` in `src/server/dal/lists.ts`: counts of
  drinks, hidden drinks, milks and hidden milks for the one-line secondaries.
- **Done when:** Unit tests cover counts with and without hidden items.

##### TASK-02-05-07-FE1 · Add "your lists" to Profile
`frontend` · Parent: STORY-02-05-07 · 4 h · New (rev 5) · Depends on: TASK-02-05-07-BE1, TASK-05-03-01-FE2, DES-02-05-04
- **Build:** `ProfileScreen.tsx` / `ProfileFlow.tsx` (sections restructured by
  TASK-05-03-01-FE2): a `profile.lists` section with two `ListRow`s, Drinks
  and Milks, each with a mirrored chevron and a plural summary ("9 drinks, 2
  hidden") through next-intl; placed per design pattern 4. Stories.
- **Done when:** AC 1 holds, long summaries wrap, RTL mirrors (AC 4).

##### TASK-02-05-07-FE2 · Add "edit your drinks" and "edit your milks" to the choosers
`frontend` · Parent: STORY-02-05-07 · 5 h · New (rev 5) · Depends on: TASK-02-05-05-FE2, TASK-02-05-04-FE2, DES-02-05-04
- **Build:**
  - Pass `footerRow` (`drinks.manage`, `milks.manage`) to the `SelectSheet`s of
    Brew's drink choice (`HomeScreen.tsx` / `BrewFlow.tsx`), the log's drink
    and milk choices (`ShotLogFlow.tsx`).
  - Open the list with return-to (`src/lib/returnTo.ts`) and keep the log's
    entered values through `src/lib/drafts.ts`; on return the new item is in
    the list.
- **Done when:** From a chooser, "Oat flat white" is two taps and back with
  nothing lost (AC 2, AC 3).

##### TASK-02-05-07-QA1 · Test reaching the lists
`qa` · Parent: STORY-02-05-07 · 4 h · New (rev 5) · Depends on: TASK-02-05-07-FE2, TASK-02-05-07-FE1
- **Build:** Play tests: Profile rows and summaries; both footer rows; return
  with log values kept; long names; RTL.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-02-05-08: Keep recipes and shots that use hidden drinks and milks

##### TASK-02-05-08-BE1 · Keep hidden drinks' recipes and hidden milks readable
`backend` · Parent: STORY-02-05-08 · 5 h · New (rev 5) · Depends on: TASK-02-05-02-BE1, TASK-02-05-05-BE1
- **Build:**
  - Recipe readers for the bag and the coffee (`getBagRecipes`,
    `getCoffeeRecipes`) return rows of hidden drinks with a `hidden` flag
    (today the page maps names from the visible drinks only and would drop
    them). A hidden drink's recipes return on unhide with nothing to restore
    (AC 2).
  - `getLogContext` adds a hidden milk to `milks` (marked `hidden`) only when it
    is the one already chosen (the recipe's, or the shot's being fixed or
    edited); new choices never include hidden milks (AC 4).
  - `validateMilk` callers accept any milk of the household, since the
    "not offered" rule is the chooser's; hiding never swaps a milk silently
    (AC 3).
- **Done when:** Unit tests cover each reader; saving a shot whose milk is
  hidden works; a new log's milk list omits hidden milks.

##### TASK-02-05-08-FE1 · Mark hidden drinks and milks where they still show
`frontend` · Parent: STORY-02-05-08 · 4 h · New (rev 5) · Depends on: TASK-02-05-08-BE1, DES-02-05-01, DES-02-05-02
- **Build:** `RecipeRows` and `beans/recipeRows.ts` show a hidden drink's rows
  in `ink-secondary` with `drinks.hidden`; the log's milk field and the pin
  sheet show a hidden chosen milk by name with `milks.hidden`. Stories.
- **Done when:** AC 1 and AC 3 are visible in stories and RTL.

##### TASK-02-05-08-QA1 · Test hidden drinks and milks keeping their data
`qa` · Parent: STORY-02-05-08 · 4 h · New (rev 5) · Depends on: TASK-02-05-08-FE1
- **Build:** Node tests for recipes of a hidden drink on the bag and coffee,
  unhide restoring use, a hidden chosen milk kept by name, never offered anew;
  play tests of the markers.
- **Done when:** AC 1 to AC 4 are covered.

---

### INIT-03: Always know what beans you have and how old they are

#### EPIC-03-01: Add a bag of beans

##### STORY-03-01-01: Find my coffee in the catalog

Schema: TASK-03-01-01-BE1 (section 6).

##### TASK-03-01-01-BE2 · Add the coffee seed list
`backend` · Parent: STORY-03-01-01 · 3 h · Unchanged · Depends on: TASK-01-02-01-BE3, TASK-03-01-01-BE1, TQ-10
- **Build:** `src/db/seed/coffee.json` (roasters, beans with roast level and
  notes, aliases, URLs) loaded by the same idempotent loader. Placeholder
  content until TQ-10; Milestone 1 content comes from TASK-01-02-01-BE6.
- **Done when:** The seed is idempotent and has no personal data.

##### TASK-03-01-01-BE3 · Add coffee catalog search with recent purchases first
`backend` · Parent: STORY-03-01-01 · 4 h · Unchanged · Depends on: TASK-03-01-01-BE2, TASK-01-02-01-BE4, TASK-03-01-02-BE1
- **Build:** DAL `searchCoffee({ query })` over bean, roaster and alias with
  visibility and merges, behind the same search handler. With an empty query
  it lists beans of the household's recent batches first, then browses
  roasters.
- **Done when:** Results show bean with roaster (AC 1); recent purchases
  first (AC 2); aliases match (AC 3); merged and private entries are handled
  (AC 4, AC 5).

##### TASK-03-01-01-FE1 · Wire the coffee picker
`frontend` · Parent: STORY-03-01-01 · 3 h · Unchanged · Depends on: TASK-03-01-01-BE3, TASK-01-02-01-FE2
- **Build:** `/catalog/pick?catalog=coffee` uses CatalogPickScreen's coffee
  variant; "can't find" goes to `/catalog/add?catalog=coffee`; selection
  returns to add-bag.
- **Done when:** The flow returns a bean to add-bag; the no-match offer is
  present (AC 6).

##### TASK-03-01-01-QA1 · Test coffee search
`qa` · Parent: STORY-03-01-01 · 4 h · Unchanged · Depends on: TASK-03-01-01-FE1
- **Build:** Node tests for AC 1 to AC 5 incl. isolation; a play test for no
  match with add (AC 6).
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-03-01-02: Add a bag with its dates and weight

Schema: TASK-03-01-02-BE1 (section 6).

##### TASK-03-01-02-BE2 · Add creating a bag with one whole-bag portion
`backend` · Parent: STORY-03-01-02 (also 03-01-03) · 4 h · Updated (packing date) · Depends on: TASK-03-01-02-BE1, TASK-03-01-01-BE3, TASK-02-06-01-BE2
- **Build:** Action `addBag({ beanId, bagWeight, roastDate?, packedAt?,
  bestBefore?, lotCode?, purchasedAt? })`: visible bean (resolved), weight
  above zero in grams, all three dates optional and each stored as local
  noon in the device zone, `purchasedAt` defaults to today. One transaction
  inserts the batch and one unopened portion of the full weight.
- **Done when:** One whole portion (AC 1); the three dates optional (AC 2);
  lot and purchase date optional (AC 4); no weight saves nothing (AC 5); two
  bags of one bean are separate (AC 6).

##### TASK-03-01-02-FE1 · Build the add-bag screen (SCR-BAG-ADD) with its stories
`frontend` · Parent: STORY-03-01-02 · 5 h · Updated (other dates disclosure) · Depends on: DES-03-01-01, PR-3, TASK-01-01-03-FE1
- **Build:** `BagAddScreen`, props-only: the chosen coffee with a change link,
  a `bag.weight` ChipGroup (250, 340, 500, 1000 g formatted) plus
  `bag.otherWeight`, the `bag.roastDate` Input, a `bag.otherDates`
  disclosure with packed and best-before dates, the `bag.datesHint`
  (roast date, else packing date, best-before shows time left), a
  `bag.more` disclosure (lot, purchased), a weight error in ink and a failed
  Notice. Stories incl. RTL.
- **Done when:** Stories pass axe; no date blocks saving; the hint is shown
  (AC 3).

##### TASK-03-01-02-FE2 · Wire the add-bag flow
`frontend` · Parent: STORY-03-01-02 · 3 h · Updated (route, start from a coffee) · Depends on: TASK-03-01-02-FE1, TASK-03-01-02-BE2, TASK-03-01-01-FE1, TASK-01-01-05-FE5
- **Build:** `src/app/(task)/beans/add/page.tsx`: the coffee picker, then
  details, or details directly with `?beanId=`; lands on `/beans/[batchId]` or
  on `returnTo` with the portion selected. Unsaved guard.
- **Done when:** The bag is added with its one portion (AC 1); a start from a
  coffee skips the picker; from the log it returns with the portion chosen.

##### TASK-03-01-02-QA1 · Test adding a bag
`qa` · Parent: STORY-03-01-02 · 4 h · Updated · Depends on: TASK-03-01-02-FE2
- **Build:** Node tests for `addBag` (AC 1 to AC 6): weight required, three
  optional dates, purchase date today in the zone, separate batches,
  isolation; play tests for presets, the dates disclosure and the weight
  error; a timing check (under 20 seconds).
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-03-01-03: Start with the whole bag ready to brew

##### TASK-03-01-03-QA1 · Test that a new bag is ready to brew and opens on the first shot
`qa` · Parent: STORY-03-01-03 · 3 h · Updated (revision 3: AC 4 moves to TASK-03-02-01-QA1) · Depends on: TASK-03-01-02-BE2, TASK-01-03-03-BE2
- **Build:** Node tests: one unopened portion of the full weight (AC 1);
  offered in `getLogContext` (AC 2); the first measured shot sets
  `opened_at` that day (AC 3). No code task. AC 4 (after a split it is still
  one bag with one roast date and lot) is re-tested in
  TASK-03-02-01-QA1.
- **Done when:** AC 1 to AC 3 are covered.

##### STORY-03-01-04: See what's on hand

##### TASK-03-01-04-BE1 · Add the Beans and bag reads
`backend` · Parent: STORY-03-01-04 · 4 h · Updated (On hand, finished bags leave) · Depends on: TASK-03-01-02-BE2, TASK-03-02-04-BE1, TASK-01-02-01-BE5
- **Build:** DAL `getOnHand()`: unfinished bags with bean and roaster
  (resolved), roasting clock slot and portions with state, opened clock
  and remaining slots; a bag with every portion finished is left out.
  `getBag(batchId)`: facts and portions. Grouping is added by
  TASK-03-02-05-BE1.
- **Done when:** Only unfinished bags are returned (AC 1, AC 3); merged
  beans show the survivor (AC 6).

##### TASK-03-01-04-FE1 · Build the Beans screen (SCR-PANTRY) with its stories
`frontend` · Parent: STORY-03-01-04 (also 03-02-05, 03-06-01) · 6 h · Updated (Beans, On hand and Tried) · Depends on: DES-03-01-02, PR-3, TASK-01-01-06-FE3, TASK-01-01-06-FE2, TASK-01-01-05-FE7
- **Build:** `BeansScreen`, props-only: title `beans.title`, an On hand
  section with a group slot and bag Cards with portion ListRows (state,
  opened clock, remaining), a Tried section slot, header `beans.addBag` only
  when bags are on hand, three empty states (first run, nothing on hand with
  Tried below, bags but nothing tried) each with one primary, and a loading
  skeleton. Stories for each, plus RTL.
- **Done when:** Stories pass axe; exactly one primary button in every
  state (AC 4, AC 5).

##### TASK-03-01-04-FE2 · Build the bag screen (SCR-BAG) with its stories
`frontend` · Parent: STORY-03-01-04 (also 02-01-04, 03-02, 03-03, 03-04) · 5 h · Updated · Depends on: DES-03-01-03, PR-3
- **Build:** `BagScreen`, props-only: facts once at the top (roast, packed and
  best-before dates, lot, purchased, weight, an explanation slot for the
  clocks), portion ListRows opening the actions slot, a `bag.recipes`
  section slot. Stories: one portion, split portions, finished, RTL.
- **Done when:** Stories pass axe; facts aren't repeated per portion.

##### TASK-03-01-04-FE3 · Wire the Beans tab and bag route
`frontend` · Parent: STORY-03-01-04 · 3 h · Updated · Depends on: TASK-03-01-04-FE1, TASK-03-01-04-FE2, TASK-03-01-04-BE1
- **Build:** `src/app/(app)/beans/page.tsx` (`getOnHand`) and
  `src/app/(app)/beans/[batchId]/page.tsx` (`getBag`), linked to each other.
- **Done when:** Bags and portions show (AC 1); a bag opens its screen (AC 2);
  the empty states offer add (AC 4, AC 5).

##### TASK-03-01-04-QA1 · Test the Beans list
`qa` · Parent: STORY-03-01-04 · 4 h · Updated · Depends on: TASK-03-01-04-FE3
- **Build:** Node tests for the On hand fields, finished bags leaving (AC 3),
  merged beans (AC 6) and isolation; story tests for the empty states.
- **Done when:** AC 1 to AC 6 are covered.

#### EPIC-03-02: Split and freeze a bag

##### STORY-03-02-01: Split a bag into portions

##### TASK-03-02-01-BE1 · Add splitting a portion by weight
`backend` · Parent: STORY-03-02-01 · 4 h · Unchanged · Depends on: TASK-03-04-01-BE1, TASK-03-02-02-BE1, TQ-13
- **Build:** Action `splitPortion(portionId, takeGrams, freezeNew = true)`:
  grams above zero and at most what's left; reduces the source weight;
  writes a stock check at `remaining − takeGrams` when the source has one
  (TQ-13); creates the new portion in the same batch (`frozen_at` now if
  `freezeNew`); one transaction.
- **Done when:** Weights add up (AC 1); freeze defaults on (AC 2); over-take
  is rejected (AC 3); repeated splits work (AC 4); batch facts and old
  shots unchanged (AC 5).

##### TASK-03-02-01-FE1 · Build the split sheet (SH-SPLIT) and wire it
`frontend` · Parent: STORY-03-02-01 · 4 h · Unchanged · Depends on: DES-03-02-02, TASK-03-02-01-BE1, TASK-03-02-02-FE1
- **Build:** `SplitSheet`: a "take out" grams NumberWheel (step 1, up to the
  remaining), a live `portion.splitRemainder`, the `portion.freezeNew`
  Toggle on by default, a primary confirm. Stories incl. RTL.
- **Done when:** Stories pass axe; the remainder updates live (AC 1); the wheel
  can't exceed what's left (AC 3).

##### TASK-03-02-01-QA1 · Test splitting
`qa` · Parent: STORY-03-02-01 · 4 h · Updated (revision 3: takes over AC 4 re-test) · Depends on: TASK-03-02-01-FE1
- **Build:** Node tests for AC 1 to AC 5 incl. the stock-check case; a play
  test for the live remainder.
- **Done when:** AC 1 to AC 5 are covered, plus the check from
  TASK-03-01-03-QA1 AC 4: after a split it is still one bag with one roast
  date and lot.

##### STORY-03-02-02: Record freezing and thawing

##### TASK-03-02-02-BE1 · Add the portion lifecycle rules and freeze and thaw
`backend` · Parent: STORY-03-02-02 (also 03-02-03) · 4 h · Updated (no date edits, review M4) · Depends on: TASK-03-02-04-BE1, TASK-02-06-01-BE2
- **Build:** `src/domain/portionActions.ts` `allowedActions(portion)`
  (unopened: open, freeze, split; counter: weigh, split, freeze, finish;
  frozen: thaw, split; thawed: open, weigh, finish). Actions
  `freezePortion(id, date?)` and `thawPortion(id, date?)`: today by default
  or an earlier local date (local noon), no future dates, thaw not before
  freeze, no second freeze. There is no action that changes a date already
  set.
- **Done when:** Default today and back-dating (AC 1, AC 2); no refreeze
  (AC 3); thaw before freeze rejected (AC 4); only valid actions offered and
  no date-edit action exists (AC 5).

##### TASK-03-02-02-FE1 · Build the portion actions sheet and date sheet (SH-PORTION-ACTIONS, SH-DATE) with stories
`frontend` · Parent: STORY-03-02-02 (also 03-02-01, 03, 03-04-02) · 5 h · Unchanged · Depends on: DES-03-02-01, DES-03-02-03, TASK-01-01-05-FE2, TASK-01-01-03-FE1
- **Build:** `PortionActionsSheet` lists only the given actions; `DateSheet`
  has a date Input defaulting to today, an error in ink and a primary
  confirm. Stories for each portion state, a date error, RTL.
- **Done when:** Stories pass axe; each state shows only its actions.

##### TASK-03-02-02-FE2 · Wire portion actions from the bag and Beans rows
`frontend` · Parent: STORY-03-02-02 · 2 h · Unchanged · Depends on: TASK-03-02-02-FE1, TASK-03-02-02-BE1, TASK-03-01-04-FE3
- **Build:** Tapping a portion row opens PortionActionsSheet with
  `allowedActions`; dated actions go through DateSheet; a failure keeps the
  sheet open with a Notice and retry.
- **Done when:** Freezing and thawing work from both screens; failures retry.

##### TASK-03-02-02-QA1 · Test freezing and thawing
`qa` · Parent: STORY-03-02-02 · 3 h · Updated · Depends on: TASK-03-02-02-FE2
- **Build:** Unit tests for `allowedActions`; Node tests for default today,
  back-dating, future rejected, thaw before freeze and isolation; a play
  test for the date error. Re-tests STORY-01-03-01 AC 4 (a frozen pick is
  saved as from frozen), skipped in TASK-01-03-01-QA1 in Milestone 1.
- **Done when:** AC 1 to AC 5 are covered, plus STORY-01-03-01 AC 4.

##### STORY-03-02-03: Record opening and finishing a portion

##### TASK-03-02-03-BE1 · Add opening and finishing a portion
`backend` · Parent: STORY-03-02-03 · 3 h · Updated (frozen shots don't open) · Depends on: TASK-03-02-02-BE1
- **Build:** Actions `openPortion(id, date?)` (unopened and thawed) and
  `finishPortion(id, date?)` (counter and thawed), with the same date rules.
  A shot against a frozen portion neither opens nor thaws it (checked in
  `saveMeasuredShot` and `pullShot`). A finished portion is excluded from
  options.
- **Done when:** Open and finish save their dates (AC 1, AC 4); a frozen
  portion's shot changes no date (AC 3); the last finish moves the bag out
  of On hand (AC 4).

##### TASK-03-02-03-QA1 · Test opening and finishing
`qa` · Parent: STORY-03-02-03 · 3 h · Updated · Depends on: TASK-03-02-03-BE1, TASK-03-02-02-FE2
- **Build:** Node tests: manual open with back-date (AC 1); auto-open on the
  first measured and one-tap shot (AC 2); a frozen portion's shot leaves
  dates alone (AC 3); finish excludes the portion and the last finish
  leaves On hand (AC 4); a finished portion's shots remain (AC 5); a play
  test for the actions.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-02-04: See where each portion is

##### TASK-03-02-04-BE1 · Add the calculated portion state and the single isOpen rule
`backend` · Parent: STORY-03-02-04 (also 03-01-04, 01-03-01, 02-02, 03-02-05) · 3 h · Updated (isOpen) · Depends on: TASK-03-01-02-BE1
- **Build:** `src/domain/portionState.ts` `portionState(portion)` returns
  `finished`, `frozen` (frozen and not thawed, even if opened before),
  `thawed`, `counter` or `unopened` from dates only, and `isOpen(portion)`:
  opened, not finished, not frozen. Every "open" in the app uses `isOpen`
  (review M5).
- **Done when:** Unit tests cover every date combination and precedence, incl.
  opened then frozen then thawed (AC 3).

##### TASK-03-02-04-FE1 · Show the portion state in words everywhere a portion appears
`frontend` · Parent: STORY-03-02-04 · 2 h · Unchanged · Depends on: TASK-03-02-04-BE1, TASK-03-01-04-FE3
- **Build:** `portion.*` keys used on Beans and bag rows, log coffee options and
  PortionSheet through one `portionStateLabel` helper.
- **Done when:** Every portion row shows its state as text.

##### TASK-03-02-04-QA1 · Test portion states
`qa` · Parent: STORY-03-02-04 · 2 h · Updated · Depends on: TASK-03-02-04-FE1
- **Build:** Unit tests for AC 1 to AC 4; a Node test that dates change the
  state (AC 5); a story check of the labels.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-02-05: See what's on hand grouped by state

##### TASK-03-02-05-BE1 · Add the On hand grouping
`backend` · Parent: STORY-03-02-05 · 3 h · New · Depends on: TASK-03-02-04-BE1, TASK-03-01-04-BE1
- **Build:** `src/domain/onHandGroups.ts`: a bag goes once into the first group
  it qualifies for: open (any `isOpen` portion, earliest opened first,
  same order as the one-tap rule through a shared `pantryOrder`), unopened
  (no open portion, at least one unopened or thawed-unopened on the
  counter), frozen (everything left in the freezer). Empty groups are left
  out. `getOnHand` returns groups.
- **Done when:** A half-open, half-frozen bag appears once under open with
  both portions (AC 4); order matches the pull (AC 1); groups per AC 2 and
  AC 3; empty groups omitted (AC 5).

##### TASK-03-02-05-FE1 · Show the three groups on the Beans screen
`frontend` · Parent: STORY-03-02-05 · 3 h · New · Depends on: TASK-03-02-05-BE1, TASK-03-01-04-FE3
- **Build:** `beans.groupOpen`, `beans.groupUnopened` and `beans.groupFrozen`
  subheadings in the On hand section; groups with no bags are not rendered.
- **Done when:** Groups show in order with one Card per bag (AC 1 to AC 5).

##### TASK-03-02-05-QA1 · Test On hand grouping
`qa` · Parent: STORY-03-02-05 · 2 h · New · Depends on: TASK-03-02-05-FE1
- **Build:** Unit tests for each case incl. tie-breaks and thawed-unopened;
  a story check of omitted groups.
- **Done when:** AC 1 to AC 5 are covered.

#### EPIC-03-03: Know how fresh your beans really are

##### STORY-03-03-01: See how long since my coffee was roasted

##### TASK-03-03-01-BE1 · Add the roasting clock
`backend` · Parent: STORY-03-03-01 (also 03-03-02, 02-02-01, 02-03-05) · 4 h · Updated (no estimate, packing date, time left) · Depends on: TASK-03-02-04-BE1, TASK-02-06-01-BE2
- **Build:** `src/domain/roastingClock.ts` `roastingClock(batch, portion, now,
  tz)` returns `{ kind: 'roasted', days }` from the roast date, `{ kind:
  'packed', days }` from the packing date, `{ kind: 'bestBefore', daysLeft }`
  (negative when passed), or `{ kind: 'unknown' }`; frozen days (freeze to
  thaw, or to now while frozen) are subtracted, and `frozenDays` is
  returned. Calculated, never stored. No assumed roast-to-best-before gap.
- **Done when:** Unit tests cover all four kinds, a rollover (AC 5), DST edges
  and a still-frozen portion.

##### TASK-03-03-01-FE1 · Show the roasting clock phrases on portions, Brew and the bag
`frontend` · Parent: STORY-03-03-01 · 4 h · Updated · Depends on: TASK-03-03-01-BE1, DES-03-03-01, TASK-03-01-04-FE3, TASK-02-02-01-FE1
- **Build:** `bag.daysSinceRoast`, `bag.daysSincePacked`, `bag.bestBeforeIn`,
  `bag.bestBeforePassed` and `bag.ageUnknown` (ICU plurals) through one
  `roastingClockLabel` helper on Beans and bag cards and Brew's coffee line.
  Unknown offers `bag.addRoastDate`, with a small `updateBagDates` action.
  No colour.
- **Done when:** Each kind is worded differently (AC 1 to AC 3); unknown
  offers to add a date (AC 4).

##### TASK-03-03-01-QA1 · Test the roasting clock
`qa` · Parent: STORY-03-03-01 · 4 h · Updated · Depends on: TASK-03-03-01-FE1
- **Build:** Unit tests for AC 1 to AC 5 with fixed clocks; story tests for
  each phrase with no colour classes; a Node test for `updateBagDates` and
  isolation.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-03-02: Freezing pauses both clocks

##### TASK-03-03-02-FE1 · Show paused clocks and the uncounted freezer days on the bag screen
`frontend` · Parent: STORY-03-03-02 · 2 h · Updated (both clocks) · Depends on: TASK-03-03-01-FE1, TASK-03-03-04-FE1
- **Build:** A frozen portion shows `portion.agePaused` in place of the opened
  clock; the bag screen's portion line shows `portion.frozenDays` (plural)
  when above zero.
- **Done when:** The paused and uncounted states show (AC 1, AC 4).

##### TASK-03-03-02-QA1 · Test that freezing pauses both clocks
`qa` · Parent: STORY-03-03-02 · 3 h · Updated · Depends on: TASK-03-03-02-FE1
- **Build:** Unit tests: frozen on day 10 stays at 10 (AC 1); opened 3 days,
  frozen, thawed shows 3 and rises (AC 2); two portions of one bag differ
  (AC 3); a story check of the frozen-days line (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-03-03-03: See freshness when logging, and spot frozen-ground shots

##### TASK-03-03-03-BE1 · Add the "ground from frozen" flag to shot reads
`backend` · Parent: STORY-03-03-03 · 2 h · Unchanged · Depends on: TASK-02-06-01-BE1, TASK-02-06-03-BE1
- **Build:** `src/domain/frozen.ts` `isFromFrozen(shotAt, portion)`: true when
  `frozen_at ≤ shotAt` and (`thawed_at` is null or `shotAt < thawed_at`);
  computed at read time in `listJournal` and `getShot`.
- **Done when:** Unit tests cover before freeze, while frozen, after thaw,
  never frozen and a same-day thaw.

##### TASK-03-03-03-FE1 · Show the opened clock and frozen marker in the log, rows and detail
`frontend` · Parent: STORY-03-03-03 · 2 h · Updated (opened clock) · Depends on: TASK-03-03-03-BE1, TASK-03-03-04-FE1, TASK-02-06-01-FE1
- **Build:** The log's coffee field shows how long the portion has been open
  and `bag.fromFrozen` when it is frozen; Journal rows and the detail show
  the same `bag.fromFrozen` marker.
- **Done when:** The marker is text and identical in all three places
  (AC 1, AC 2).

##### TASK-03-03-03-QA1 · Test the frozen marker
`qa` · Parent: STORY-03-03-03 · 3 h · Updated · Depends on: TASK-03-03-03-FE1
- **Build:** Story tests for the log field; Node tests for marked while
  frozen (AC 2), not after thaw or never frozen (AC 3), and following the
  dates once set, incl. back-dated (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-03-03-04: See how long each portion has been open

##### TASK-03-03-04-BE1 · Add the opened clock
`backend` · Parent: STORY-03-03-04 · 3 h · New · Depends on: TASK-03-02-04-BE1, TASK-02-06-01-BE2
- **Build:** `src/domain/openedClock.ts` `openedClock(portion, now, tz)`:
  `{ kind: 'open', days }` (0 means opened today) from `opened_at`, less
  freezer days; `{ kind: 'paused' }` while frozen; `{ kind: 'notOpened' }`.
  Added to the Beans, bag, Brew and log reads. Calculated, never stored.
- **Done when:** Unit tests cover opened today, rollover (AC 5), opened then
  frozen then thawed (AC 1), unopened (AC 2) and DST edges.

##### TASK-03-03-04-FE1 · Show the opened clock on portions, the bag and Brew
`frontend` · Parent: STORY-03-03-04 · 3 h · New · Depends on: TASK-03-03-04-BE1, TASK-03-03-01-FE1, DES-03-03-01
- **Build:** `portion.openFor` / `portion.openedToday` / `portion.notOpened`
  through an `openedClockLabel` helper on every portion row; Brew's coffee
  line uses `home.coffeeClocks` (pattern over the two clocks, so the order
  and separator belong to the locale); unopened shows the roasting clock
  alone.
- **Done when:** Each portion shows its own clock and the bag one roasting
  clock (AC 3); Brew shows both on one line, worded so they can't be
  confused (AC 4).

##### TASK-03-03-04-QA1 · Test the opened clock
`qa` · Parent: STORY-03-03-04 · 3 h · New · Depends on: TASK-03-03-04-FE1
- **Build:** Unit tests for AC 1, 2, 3 and 5; a story test of Brew's combined
  line in `en` and the test locale. Re-tests STORY-02-02-01 AC 2 (both
  clocks on Brew), skipped in TASK-02-02-01-QA1 in wave 11a.
- **Done when:** AC 1 to AC 5 are covered, plus STORY-02-02-01 AC 2.

#### EPIC-03-04: See how much coffee is left

##### STORY-03-04-01: See how much is left

##### TASK-03-04-01-BE1 · Add the remaining weight calculation
`backend` · Parent: STORY-03-04-01 (also 03-02-01, 02-02-03) · 4 h · Unchanged · Depends on: TASK-01-03-03-BE1, TASK-03-01-02-BE1
- **Build:** `src/domain/remaining.ts` `remainingWeight({ weight, latestCheck,
  doses })`: the latest stock check (else `weight`) minus the doses of every
  shot after it, measured, one-tap, an off shot and its fix alike (answer 6),
  clamped at 0 with `overLogged`. A one-query SQL aggregate per portion and
  bag; added to the Beans, bag, Brew and portion-sheet reads.
- **Done when:** Unit tests cover no shots, a check and doses after it; never
  negative; the aggregate matches the domain function.

##### TASK-03-04-01-FE1 · Build Meter (NC-15) with its story
`frontend` · Parent: STORY-03-04-01 · 3 h · Unchanged · Depends on: DES-03-04-03
- **Build:** `src/components/ui/Meter`: a 2 px `line` track with an `ink` fill,
  `role="meter"` with a text `aria-valuetext`; the fill grows from inline
  start. Stories: 0, partial, full, RTL.
- **Done when:** Stories pass axe; it mirrors in RTL.

##### TASK-03-04-01-FE2 · Show remaining coffee on rows, bags and Brew, with the over-logged notice
`frontend` · Parent: STORY-03-04-01 · 4 h · Unchanged · Depends on: TASK-03-04-01-BE1, TASK-03-04-01-FE1, TASK-03-01-04-FE3, TASK-02-02-01-FE1, DES-03-04-01
- **Build:** Portion rows show `portion.remaining` and a Meter; bag cards the
  total; Brew's footnote `home.remaining`, hidden when unknown; an
  over-logged portion shows 0 g and a neutral Notice with `portion.weigh`.
- **Done when:** AC 1, AC 2 and AC 4 hold.

##### TASK-03-04-01-QA1 · Test remaining coffee
`qa` · Parent: STORY-03-04-01 · 4 h · Unchanged · Depends on: TASK-03-04-01-FE2, TASK-02-02-04-BE1, TASK-02-06-02-BE1
- **Build:** Node tests for measured and one-tap doses, bag totals, undo and
  edit changing the result, over-logged clamp and isolation; story tests for
  the Meter text and neutral Notice. Re-tests the "how much coffee is left" part
  of STORY-02-02-01 AC 1 on Brew, skipped in TASK-02-02-01-QA1 in wave 11a.
- **Done when:** AC 1 to AC 4 are covered, plus the remaining-coffee line on
  Brew.

##### STORY-03-04-02: Weigh what's left

##### TASK-03-04-02-BE1 · Add recording a stock check
`backend` · Parent: STORY-03-04-02 · 2 h · Unchanged · Depends on: TASK-03-04-01-BE1, TASK-03-02-02-BE1
- **Build:** Action `addStockCheck(portionId, grams)` for counter and thawed
  portions, zero or more, `checked_at` now.
- **Done when:** The latest check wins (AC 3); later doses subtract (AC 2).

##### TASK-03-04-02-FE1 · Build the stock sheet (SH-STOCK) and wire it
`frontend` · Parent: STORY-03-04-02 · 3 h · Unchanged · Depends on: TASK-03-04-02-BE1, DES-03-04-02, TASK-03-02-02-FE2
- **Build:** `StockSheet`: a grams NumberWheel and primary
  `portion.saveWeight`; a failure keeps the sheet with retry; opens from
  the actions and the over-logged Notice. Stories.
- **Done when:** Saving updates what's left (AC 1); a failure retries (AC 4).

##### TASK-03-04-02-QA1 · Test weighing what's left
`qa` · Parent: STORY-03-04-02 · 2 h · Unchanged · Depends on: TASK-03-04-02-FE1
- **Build:** Node tests for AC 1 to AC 3; a play test for failure and retry.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-03-04-03: See which bags are open or finished

##### TASK-03-04-03-BE1 · Add the calculated bag status
`backend` · Parent: STORY-03-04-03 · 2 h · Updated (isOpen) · Depends on: TASK-03-02-04-BE1
- **Build:** `src/domain/bagStatus.ts` `bagStatus(portions)`: `finished` when
  every portion is finished; `open` when any portion `isOpen`; else null.
- **Done when:** Unit tests cover each combination, incl. opened then frozen
  (AC 1, AC 3).

##### TASK-03-04-03-FE1 · Show the bag status on Beans cards and the bag screen
`frontend` · Parent: STORY-03-04-03 · 2 h · Updated · Depends on: TASK-03-04-03-BE1, TASK-03-01-04-FE3
- **Build:** `bag.statusOpen` and `bag.statusFinished` text on cards and the bag
  screen. Finished bags are not in On hand; they are listed on the coffee
  screen.
- **Done when:** The status is text; finished bags leave On hand (AC 2).

##### TASK-03-04-03-QA1 · Test bag status
`qa` · Parent: STORY-03-04-03 · 2 h · Updated · Depends on: TASK-03-04-03-FE1
- **Build:** Unit tests for AC 1 to AC 3; a Node test that changing dates
  changes status and grouping (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### EPIC-03-06: See every coffee you've tried

New MVP epic. The screens extend the Beans tab (TASK-03-01-04-FE1) and use
the recipe rows of TASK-02-01-04-FE1.

##### STORY-03-06-01: See every coffee I've tried

##### TASK-03-06-01-BE1 · Add the Tried read
`backend` · Parent: STORY-03-06-01 (also 03-06-02) · 4 h · New · Depends on: TASK-03-01-04-BE1, TASK-01-02-01-BE5, TASK-02-06-01-BE2
- **Build:** DAL `getTried()`: one row per coffee with at least one shot,
  measured or one-tap (DQ-27), grouped by merge survivor; last had (newest
  shot, relative formatting at the screen), bag count (finished or not),
  newest-had first. A coffee with bags but no shot is excluded. Calculated
  in one query, never stored.
- **Done when:** Rows, order, bag count and exclusion are as AC 1 to AC 3;
  two merged entries are one row (AC 4).

##### TASK-03-06-01-FE1 · Add the Tried section to the Beans screen
`frontend` · Parent: STORY-03-06-01 · 4 h · New · Depends on: TASK-03-06-01-BE1, TASK-03-01-04-FE3, DES-03-01-02
- **Build:** Under On hand, a `beans.tried` heading and ListRows: bean,
  roaster, `beans.lastHad`, `beans.bagCount`, and a summary slot; tapping
  opens the coffee screen. `beans.triedEmpty` when bags but no shots.
  Stories.
- **Done when:** AC 1, AC 2, AC 5 and AC 6 hold; the heading stays reachable
  with many bags.

##### TASK-03-06-01-QA1 · Test the Tried list
`qa` · Parent: STORY-03-06-01 · 3 h · New · Depends on: TASK-03-06-01-FE1
- **Build:** Node tests for inclusion, order, bag count, merged entries,
  isolation; story tests for the empty line.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-03-06-02: See how a coffee's shots went, in words

##### TASK-03-06-02-BE1 · Add the Tried summary rule
`backend` · Parent: STORY-03-06-02 · 3 h · New · Depends on: TASK-03-06-01-BE1
- **Build:** `src/domain/triedSummary.ts`: three or more rated shots: "mostly
  good" when most are 4 or 5, "mostly off" when most are 1 or 2, else
  "mixed"; one or two: `lastRated` with the newest rating; none: good or off
  reactions give "mostly good" or "mostly off"; else "no ratings yet".
  Ties count as "mixed". Personas are ignored in the MVP (answer 5).
- **Done when:** Every branch and tie is unit-tested (AC 1 to AC 4).

##### TASK-03-06-02-FE1 · Show the summary line on Tried rows
`frontend` · Parent: STORY-03-06-02 · 2 h · New · Depends on: TASK-03-06-02-BE1, TASK-03-06-01-FE1
- **Build:** `beans.summary.*` keys in `text-label` `ink-secondary`; words
  only, no colour or badge. It describes the shots, not the coffee.
- **Done when:** AC 5 holds in a story with each phrase.

##### TASK-03-06-02-QA1 · Test the Tried summary
`qa` · Parent: STORY-03-06-02 · 2 h · New · Depends on: TASK-03-06-02-FE1
- **Build:** Unit tests for the table of rating and reaction mixes; a story
  check that no colour class is used.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-06-03: Open a coffee's own screen

##### TASK-03-06-03-BE1 · Add the coffee read
`backend` · Parent: STORY-03-06-03 · 3 h · New · Depends on: TASK-03-06-02-BE1, TASK-02-01-04-BE1, TASK-02-06-01-BE1
- **Build:** DAL `getCoffee(beanId)`: name, roaster, roast level and tasting
  notes, the summary, current recipes (`getCoffeeRecipes`), up to five recent
  shots (Journal rows) and the coffee's bags on hand and finished with
  date, state and weight; merge group resolved; household scoped.
- **Done when:** Each section's data is right, incl. empty sections (AC 1 to
  AC 5); another household's coffee is not found.

##### TASK-03-06-03-FE1 · Build the coffee screen (SCR-COFFEE) with its stories
`frontend` · Parent: STORY-03-06-03 · 5 h · New · Depends on: DES-03-01-04, TASK-02-01-04-FE1, TASK-01-01-06-FE1, TASK-01-01-06-FE2
- **Build:** `CoffeeScreen`, props-only: header, summary line, recipes via
  `RecipeRows`, `coffee.recentShots` with `coffee.allShots`, `coffee.bags`,
  one-line empty states per section, a loading skeleton and a load-failed
  Notice with retry. Stories incl. RTL.
- **Done when:** Stories pass axe; each empty section says so in one line
  (AC 5); failure offers retry (AC 6).

##### TASK-03-06-03-FE2 · Wire the coffee route
`frontend` · Parent: STORY-03-06-03 · 3 h · New · Depends on: TASK-03-06-03-FE1, TASK-03-06-03-BE1, TASK-02-06-05-FE1
- **Build:** `src/app/(app)/beans/coffee/[beanId]/page.tsx` with `getCoffee`;
  "all shots" opens the Journal filtered to this coffee only; recipes open
  dial in or edit; bags open the bag screen; opens from Tried and from a
  bag on hand.
- **Done when:** AC 1 to AC 4 hold.

##### TASK-03-06-03-QA1 · Test the coffee screen
`qa` · Parent: STORY-03-06-03 · 3 h · New · Depends on: TASK-03-06-03-FE2
- **Build:** Node tests for `getCoffee` sections and isolation; play tests for
  the links, empty sections and failure.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-03-06-04: Add a bag of a coffee I've tried

##### TASK-03-06-04-FE1 · Add "add a bag of this" to the coffee screen
`frontend` · Parent: STORY-03-06-04 · 2 h · New · Depends on: TASK-03-06-03-FE2, TASK-03-01-02-FE2
- **Build:** `coffee.addBag` opens `/beans/add?beanId=` with the coffee chosen
  and no picker; primary when no bag is on hand, secondary otherwise; the new
  bag then appears under On hand and on the coffee screen.
- **Done when:** AC 1 to AC 3 hold; Tried row to saved bag is three taps plus
  save.

##### TASK-03-06-04-QA1 · Test adding a bag from a coffee
`qa` · Parent: STORY-03-06-04 · 2 h · New · Depends on: TASK-03-06-04-FE1
- **Build:** Play tests for the primary and secondary states and the preset
  coffee; a Node check that the bag lands on the coffee.
- **Done when:** AC 1 to AC 3 are covered.

#### EPIC-03-05: Know when you'll run out (revision 5, Next, run-out only)

Design: DES-03-05-01 and 02. 11 tasks, 44 h. Calculated on every read, never
stored (TD-8); the thresholds (three finished portions, a month of silence,
the span breaks) are starting values in one constants file. Built today:
`getRemaining` (`src/server/dal/remaining.ts`), `remainingWeight` and
`totalRemaining` (`src/domain/remaining.ts`), `batches.purchasedAt`,
`getOnHand`, `BeansScreen` / `BeansFlow`. STORY-03-05-04 is retired; its
filters are EPIC-03-07.

##### STORY-03-05-01: See how fast we use coffee

##### TASK-03-05-01-BE1 · Add the usage-rate rule
`backend` · Parent: STORY-03-05-01 · 8 h · New (rev 5) · Depends on: none
- **Build:**
  - `src/domain/runOut.ts` (pure, with `now`) and
    `src/domain/runOutConstants.ts`: from portions (weight, opened, finished,
    purchase date), the doses of all shots on them (one-tap included) and the
    stock checks, return a state of `learning` (fewer than three finished
    portions, with the count so far), `stale` (no shot in a month),
    `nothing` (nothing on hand) or `estimate` with the weekly grams, the
    finished portion count and the span in weeks it rests on.
  - Edge cases tested: a portion finished the day it was opened, stock checks
    after the last dose, a purchase after the last finish, a zero rate.
- **Done when:** Unit tests cover each state and edge; the same inputs give
  the same answer; no value is stored (AC 1, AC 2, AC 4).

##### TASK-03-05-01-BE2 · Add the run-out read
`backend` · Parent: STORY-03-05-01 · 5 h · New (rev 5) · Depends on: TASK-03-05-01-BE1
- **Build:** `src/server/dal/runOut.ts` `getRunOut(now)`: household-scoped
  query for batches, portions, shot doses and stock checks, `getRemaining` for
  the unfinished portions (frozen included), and `runOut()`; returns `null` on
  any failure so the Beans page can leave the line out (AC 5). Household-wide:
  never filtered by persona.
- **Done when:** Tests with the mocked database cover a normal household, an
  empty one and a thrown error; the read follows new shots and finished
  portions (AC 3).

##### TASK-03-05-01-FE1 · Build the run-out sheet (SH-RUNOUT) with its stories
`frontend` · Parent: STORY-03-05-01 · 5 h · New (rev 5) · Depends on: DES-03-05-02
- **Build:** `src/components/beans/RunOutSheet.tsx`: the `Sheet` with the span
  in `text-display` weight 200, four plain rows (coffee on hand with the frozen
  share, use rate, what it is based on, logged share), the meaning sentence,
  a learning variant ("1 of 3 so far" and the coffee on hand), a "not
  available yet" share, and a load-failed variant with retry. No primary
  button; focus returns to the line. Stories: steady, learning, share
  unavailable, failed, RTL.
- **Done when:** Stories pass axe; every figure is formatted through `Intl`
  and the sheet promises no accuracy (AC 1, AC 2).

##### TASK-03-05-01-FE2 · Add the learning line and the absent states to Beans
`frontend` · Parent: STORY-03-05-01 · 4 h · New (rev 5) · Depends on: TASK-03-05-01-BE2, TASK-03-05-01-FE1, DES-03-05-01
- **Build:** `app/(app)/beans/page.tsx` reads `getRunOut` in its own
  `Suspense`; under the On hand heading a quiet button (a `ListRow`-style
  target, 44 px, mirrored chevron) shows `beans.learning` in `ink-secondary`
  while learning; no line when stale, nothing on hand, or the read failed; a
  one-line skeleton while loading. `BeansFlow` opens the sheet.
- **Done when:** AC 2, AC 4 and AC 5 hold in stories; the rest of Beans works
  when the read fails.

##### TASK-03-05-01-QA1 · Test the usage rate and the learning state
`qa` · Parent: STORY-03-05-01 · 5 h · New (rev 5) · Depends on: TASK-03-05-01-FE2
- **Build:** Node tests of the rate against hand-worked households (two doses
  a day, a busy one, a quiet one, one-tap only), the learning count, the
  stale month and the failing read; play tests for the sheet and the absent
  line.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-05-02: See when we'll run out

##### TASK-03-05-02-BE1 · Add the run-out span and its breaks
`backend` · Parent: STORY-03-05-02 · 3 h · New (rev 5) · Depends on: TASK-03-05-01-BE1
- **Build:** `src/domain/runOutSpan.ts`: grams on hand over the weekly rate
  gives a span as days under two weeks, weeks up to 26, then months, and a
  "more than 6 months" bucket; the "around" date; the frozen share of the
  span. Pure, with unit tests at each boundary.
- **Done when:** The boundaries (13/14 days, 26/27 weeks, 6 months) are exact
  (AC 2).

##### TASK-03-05-02-FE1 · Show the span line and the sheet's span
`frontend` · Parent: STORY-03-05-02 · 3 h · New (rev 5) · Depends on: TASK-03-05-02-BE1, TASK-03-05-01-FE2, DES-03-05-01
- **Build:** The line reads `beans.runOut`, `beans.runOutFrozen` or
  `beans.runOutLong`, with spans from `Intl.NumberFormat` unit style; the
  sheet repeats the span and `beans.runOutBy` ("around 14 December"). The line
  takes a `filtersActive` prop and is hidden when set (the rule belongs to
  EPIC-03-07 and works whichever ships first); calm ink only, no buy prompt.
- **Done when:** AC 1, AC 3, AC 4, AC 5 and AC 6 hold in stories.

##### TASK-03-05-02-QA1 · Test the run-out line
`qa` · Parent: STORY-03-05-02 · 4 h · New (rev 5) · Depends on: TASK-03-05-02-FE1
- **Build:** Node tests of the span formats at each break and in a second
  locale; adding a bag grows the estimate; play tests of the line, the sheet
  and the hidden cases (nothing on hand, a filter on); a `signal` token check.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-03-05-03: See how much of our coffee gets logged

##### TASK-03-05-03-BE1 · Add the logged-share rule
`backend` · Parent: STORY-03-05-03 · 2 h · New (rev 5) · Depends on: TASK-03-05-01-BE1
- **Build:** In `runOut.ts`: the share is the logged doses of finished portions
  over their total weight, as a fraction; `null` when no portion has finished.
  Included in `getRunOut`.
- **Done when:** Unit tests cover the share, no finished portion, and an
  over-logged portion (above 100 %, shown capped or as is, per the existing
  `overLogged` flag).

##### TASK-03-05-03-FE1 · Show the share and its meaning in the sheet
`frontend` · Parent: STORY-03-05-03 · 2 h · New (rev 5) · Depends on: TASK-03-05-03-BE1, TASK-03-05-01-FE1
- **Build:** The `beans.coverage` row with a percentage through `Intl`, the
  `beans.coverage.meaning` sentence when it is low (threshold in the
  constants), "not available yet" before a portion finishes; no accuracy
  claim.
- **Done when:** AC 1 to AC 4 are visible in the sheet's stories.

##### TASK-03-05-03-QA1 · Test the logged share
`qa` · Parent: STORY-03-05-03 · 3 h · New (rev 5) · Depends on: TASK-03-05-03-FE1
- **Build:** Node tests for the share in a high, a low and an empty case; play
  tests of the sentence and the unavailable state.
- **Done when:** AC 1 to AC 4 are covered.

#### EPIC-03-07: Find any coffee in Beans (revision 5, Next, new)

Design: DES-03-07-01 and 02. 17 tasks, 67 h. The 7th INIT-03 epic, by
exception. Built today: `FilterChips` (`src/components/ui/ChipGroup`), the
Journal's URL-parameter filters (`src/lib/journalFilters.ts`),
`ROAST_LEVELS` (`src/domain/roast.ts`), `triedSummary`, `getOnHand` and
`getTried`, `createCoffeeEntry` (`catalogAdd.ts`), `CoffeeAddFlow`,
`CoffeeScreen`, the seed loader `src/db/seed/load.ts` and `coffee.json`. The
origin data for the seed list is the Head of Product's data work, not a task.

##### STORY-03-07-04: Say where a coffee comes from when I add it

##### TASK-03-07-04-BE1 · Add the origin column to canonical beans
`backend` · Parent: STORY-03-07-04 · 2 h · New (rev 5) · Depends on: none
- **Build:** `src/db/schema.ts`: `origin: text("origin")` on `canonicalBeans`,
  nullable; new migration; update `schema.test.ts`. No index (filtering is in
  memory). Existing rows stay null (AC 5).
- **Done when:** The migration applies on a database with coffees and leaves
  them null.

##### TASK-03-07-04-BE2 · Add the origin rules and the list of origins
`backend` · Parent: STORY-03-07-04 · 4 h · New (rev 5) · Depends on: none
- **Build:** `src/domain/origin.ts` (TD-9): the curated list from
  `planning/coffee-origins.json` (81 producing countries with ISO alpha-2
  codes; the code is stored and the name shown with `Intl.DisplayNames`),
  `blend`, and `normaliseOther(text)` (trim,
  collapse whitespace, case-fold, length limit) giving `other:<text>`;
  `parseOrigin`, `labelOrigin(origin, locale)` with `Intl.DisplayNames`. Unit
  tests, including "Hawaiian kona" and "hawaiian  Kona" (an unlisted origin)
  being one value (AC 2).
- **Done when:** The tests pass and nothing in the module holds display copy.

##### TASK-03-07-04-BE3 · Save origin on new coffees and load it from the seed
`backend` · Parent: STORY-03-07-04 · 4 h · New (rev 5) · Depends on: TASK-03-07-04-BE1, TASK-03-07-04-BE2
- **Build:** `CoffeeEntryInput.origin?` validated and stored by
  `createCoffeeEntry` (`catalogAdd.ts`) and its action; `coffeeCatalog.ts`
  results carry `origin`; `src/db/seed/load.ts` and `coffee.json` accept an
  optional `origin` and validate it with `parseOrigin`; merges keep the
  surviving entry's (no change to `catalogMerge.ts`).
- **Done when:** Adding without an origin works exactly as before (AC 3); a bad
  origin is refused; the loader loads a seed with and without origins.

##### TASK-03-07-04-FE1 · Add the optional origin field to Add a coffee
`frontend` · Parent: STORY-03-07-04 · 5 h · New (rev 5) · Depends on: TASK-03-07-04-BE3, DES-03-07-02
- **Build:** `CoffeeAddFlow.tsx` / `CatalogAddScreen.tsx`: an optional
  `SelectField` `catalog.origin` with the list, `catalog.origin.blend` and
  "other" (which reveals one `Input`); hidden when the list can't be built
  (AC 4); never blocks saving. Stories in `CatalogAddScreen.stories.tsx`:
  none chosen, a country, blend, other, list unavailable, RTL.
- **Done when:** AC 1 to AC 4 hold in stories; `en.json` keys added.

##### TASK-03-07-04-QA1 · Test saying where a coffee comes from
`qa` · Parent: STORY-03-07-04 · 4 h · New (rev 5) · Depends on: TASK-03-07-04-FE1
- **Build:** Node tests for save with each kind, the case-folding, no origin,
  the old rows staying null and the seed loader; play tests of the field and
  its absence.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-07-05: See and fill in a coffee's origin

##### TASK-03-07-05-BE1 · Add setting origin on an unverified coffee
`backend` · Parent: STORY-03-07-05 · 3 h · New (rev 5) · Depends on: TASK-03-07-04-BE3
- **Build:** `setCoffeeOrigin(beanId, origin | null)` in `catalogAdd.ts` (or
  beside `modelCapabilities.ts`): allowed only when the coffee was created by
  the household and is `unverified` and not merged (the `canEditCapabilities`
  pattern); otherwise a `NotEditableError`. `getCoffee` (`coffee.ts`) returns
  `origin` and `originEditable`.
- **Done when:** Unit tests cover own unverified, own verified, seeded and
  another household's coffee (AC 2, AC 3).

##### TASK-03-07-05-FE1 · Show origin on the coffee screen and let a household fill it in
`frontend` · Parent: STORY-03-07-05 · 4 h · New (rev 5) · Depends on: TASK-03-07-05-BE1, TASK-03-07-04-FE1
- **Build:** `CoffeeScreen.tsx` / `app/(app)/beans/coffee/[beanId]/page.tsx`:
  the origin in the details line when set, nothing when not; a set-origin
  action opening the same origin choice in a `Sheet`, only when
  `originEditable`. Stories.
- **Done when:** AC 1 to AC 3 hold; AC 4 is met with the filter (TASK-03-07-03-FE1).

##### TASK-03-07-05-QA1 · Test seeing and filling in an origin
`qa` · Parent: STORY-03-07-05 · 3 h · New (rev 5) · Depends on: TASK-03-07-05-FE1
- **Build:** Node tests for who may edit; play tests for the line, the sheet,
  and a verified coffee showing no action.
- **Done when:** AC 1 to AC 4 are covered (AC 4 with the origin filter).

##### STORY-03-07-01: Narrow Beans by roaster, roast level or rating

##### TASK-03-07-01-BE1 · Add the Beans filter rules and URL parameters
`backend` · Parent: STORY-03-07-01 (also 03-07-02, 03-07-03) · 5 h · New (rev 5) · Depends on: none
- **Build:**
  - `src/domain/beansFilter.ts` (pure): the row is offered with six or more
    distinct coffees (constant); `filterOptions` gives only the values present
    with counts; roast levels in `ROAST_LEVELS` order; rating words are
    `triedSummary`'s kinds (mostly good, mixed, mostly off, no ratings yet);
    origin options appear only when some coffee has an origin, with `not
    stated` and `blend`; `applyFilters` combines one value per filter (AND).
  - `src/lib/beansFilters.ts` like `journalFilters.ts`: `readBeansFilters`
    and `beansHref` over `roaster`, `roast`, `origin`, `rating` parameters.
- **Done when:** Unit tests cover the threshold, counts, ordering, combining
  and the parameter round trip.

##### TASK-03-07-01-BE2 · Add the coffees read for the filters
`backend` · Parent: STORY-03-07-01 · 4 h · New (rev 5) · Depends on: TASK-03-07-04-BE1
- **Build:** `src/server/dal/beanFacets.ts`: one distinct list of the coffees on
  hand and tried (merge survivors), each with roaster, roast level, origin
  and the rating kind from the same shots `getTried` reads (refactor
  `getTried` to expose its per-coffee summary rather than recompute); on-hand
  coffees never brewed read "no ratings yet". Takes an optional persona
  (used by TASK-05-01-07-BE1).
- **Done when:** Tests cover a merged coffee, an on-hand-only coffee, a
  tried-only coffee and a coffee that is both.

##### TASK-03-07-01-FE1 · Add the Beans filter row
`frontend` · Parent: STORY-03-07-01 · 6 h · New (rev 5) · Depends on: TASK-03-07-01-BE1, TASK-03-07-01-BE2, DES-03-07-01
- **Build:**
  - `BeansScreen.tsx` / `BeansFlow.tsx`: `FilterChips` (the filter variant)
    under the header with Roaster, Roast level and Rating chips; each opens a
    `SelectSheet` with only existing values and a count in the secondary line
    (`beans.filterCount`); active chips fill and can be removed.
  - `app/(app)/beans/page.tsx` reads `searchParams` (read the Next.js 16
    guide first) and narrows On hand and Tried together; the row is absent
    below six coffees.
  - Stories: no filter, one, several, open choices, below the threshold, RTL;
    the row scrolls sideways without clipping its focus ring.
- **Done when:** AC 1 to AC 5 hold in stories and play tests.

##### TASK-03-07-01-QA1 · Test narrowing Beans
`qa` · Parent: STORY-03-07-01 · 5 h · New (rev 5) · Depends on: TASK-03-07-01-FE1
- **Build:** Node tests of options and counts from a fixed household of 6 and
  5 coffees; play tests of each chip, combining, removing one, and keyboard
  use.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-03-07-02: Keep my filters, clear them, and handle no matches

##### TASK-03-07-02-FE1 · Keep filters across navigation and clear them on the tab
`frontend` · Parent: STORY-03-07-02 · 4 h · New (rev 5) · Depends on: TASK-03-07-01-FE1
- **Build:** Filters live in the address, so Back from a bag or a coffee keeps
  them; the leading ghost "All" (`beans.filterAll`) shows only while a filter
  is on and clears all at once; choosing the Beans tab again links to
  `/beans` without parameters (`AppTabBar.tsx`, `src/lib/appTabs.ts`).
- **Done when:** AC 1 and AC 2 hold in a play test with real navigation.

##### TASK-03-07-02-FE2 · Add the filtered empty states and hide the run-out line
`frontend` · Parent: STORY-03-07-02 · 4 h · New (rev 5) · Depends on: TASK-03-07-02-FE1 (soft: TASK-03-05-02-FE1, only to pass the filter flag to the run-out line)
- **Build:** A one-line `beans.filteredOnHandNone` (and the Tried equivalent)
  when only one section is empty; one `EmptyState` `beans.filteredNone` with a
  `beans.filterClear` action when both are, the chips staying; the run-out
  line gets `filtersActive`; a failed load shows `LoadFailed` with retry as
  elsewhere.
- **Done when:** AC 3 to AC 6 hold in stories.

##### TASK-03-07-02-QA1 · Test keeping, clearing and no matches
`qa` · Parent: STORY-03-07-02 · 4 h · New (rev 5) · Depends on: TASK-03-07-02-FE2
- **Build:** Play tests of Back keeping filters, the tab clearing them, each
  empty state, the run-out line hidden under a filter and a failed load.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-03-07-03: Narrow Beans by origin

##### TASK-03-07-03-FE1 · Add the origin chip
`frontend` · Parent: STORY-03-07-03 · 3 h · New (rev 5) · Depends on: TASK-03-07-01-FE1, TASK-03-07-04-BE2
- **Build:** The Origin chip appears only when at least one coffee has an
  origin; its choices are the origins present (names through
  `Intl.DisplayNames`), `blend`, and `beans.originUnknown`; combines with the
  others. Stories.
- **Done when:** AC 1 to AC 5 hold in stories.

##### TASK-03-07-03-QA1 · Test the origin filter
`qa` · Parent: STORY-03-07-03 · 3 h · New (rev 5) · Depends on: TASK-03-07-03-FE1
- **Build:** Node and play tests: no origin anywhere (no chip), "not stated",
  a blend, combining, and a coffee moving from "not stated" after its origin
  is set (also STORY-03-07-05 AC 4).
- **Done when:** AC 1 to AC 5 are covered.

---

### INIT-04: Grind settings stay meaningful through maintenance and time

#### EPIC-04-01: Record maintenance on your equipment

##### STORY-04-01-01: Log maintenance on a part

Schema: TASK-04-01-01-BE1 (section 6).

##### TASK-04-01-01-BE2 · Add recording maintenance and the part's event list
`backend` · Parent: STORY-04-01-01 · 3 h · Updated (parts, no retire) · Depends on: TASK-04-01-01-BE1, TASK-02-06-01-BE2
- **Build:** Action `addMaintenance(partId, { kind, date?, note?,
  isRecalibration? })`: the kind is burrs, clean, rezero, repair or other;
  the date is today by default or an earlier local date (local noon); any
  of the household's three part kinds. DAL `listMaintenance(partId)`, newest
  first. No setup is touched: servicing never makes a new setup. No offsets
  are written.
- **Done when:** The event saves with kind, date and note (AC 1); the date
  defaults to today (AC 2); the list is newest first (AC 3); the part is in
  the same setups afterwards (AC 4).

##### TASK-04-01-01-FE1 · Build the maintenance sheet (SH-MAINTENANCE) with its stories
`frontend` · Parent: STORY-04-01-01 (also 04-01-02) · 4 h · Unchanged · Depends on: DES-04-01-01, TASK-01-01-05-FE2, PR-3
- **Build:** `MaintenanceSheet`: a kind ChipGroup (`maintenance.kind.*`), a
  date defaulting to today, an optional note Input, a slot for the
  recalibration Toggle, primary `maintenance.save`, a failure Notice.
  Stories: grinder, machine, failed, RTL.
- **Done when:** Stories pass axe; a re-zero today is three taps.

##### TASK-04-01-01-FE2 · Add the maintenance section to the part screen
`frontend` · Parent: STORY-04-01-01 · 3 h · Updated (part screen) · Depends on: TASK-04-01-01-FE1, TASK-04-01-01-BE2, TASK-01-02-02-FE6
- **Build:** On the part screen, `maintenance.title` with event ListRows
  (kind, date, note excerpt, recalibration marker), `maintenance.none` with
  secondary `maintenance.add`, and `maintenance.add` opening the sheet.
- **Done when:** Events show (AC 3); the empty state offers add (AC 5); the
  part's setups are unchanged (AC 4).

##### TASK-04-01-01-QA1 · Test logging maintenance
`qa` · Parent: STORY-04-01-01 · 3 h · Updated · Depends on: TASK-04-01-01-FE2
- **Build:** Node tests: kinds, default date, back-date, future rejected
  (AC 1, AC 2); order (AC 3); the part's setups and their recipes unchanged
  (AC 4); isolation; a story test for empty (AC 5) and a three-tap re-zero.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-04-01-02: Mark a recalibration

##### TASK-04-01-02-BE1 · Store the recalibration flag with its defaults
`backend` · Parent: STORY-04-01-02 · 2 h · Unchanged · Depends on: TASK-04-01-01-BE2
- **Build:** `addMaintenance` writes `is_recalibration` (TQ-05): default true
  for burrs and rezero on grinders, false otherwise; always false and
  rejected if sent true for machines and baskets (DQ-15).
- **Done when:** Grinder events can be marked (AC 1); burrs and re-zero
  default on (AC 2); machines and baskets can't be marked (AC 4).

##### TASK-04-01-02-FE1 · Add the recalibration toggle and marker
`frontend` · Parent: STORY-04-01-02 · 2 h · Updated (Journal dividers) · Depends on: TASK-04-01-02-BE1, TASK-04-01-01-FE2
- **Build:** In MaintenanceSheet, Toggle `maintenance.isRecalibration` for
  grinders only, following the kind's default until touched. The
  `maintenance.recalibration` text marker shows on event rows and on Journal
  dividers (TASK-04-01-04-FE1).
- **Done when:** The default follows the kind (AC 2); the marker is text
  (AC 3); no toggle for machines or baskets (AC 4).

##### TASK-04-01-02-QA1 · Test recalibration marking
`qa` · Parent: STORY-04-01-02 · 2 h · Unchanged · Depends on: TASK-04-01-02-FE1
- **Build:** Node tests for defaults and non-grinder rejection (AC 1, AC 2,
  AC 4); story tests for the toggle by kind and the marker in words (AC 3).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-04-01-03: Know my grinder's current grind period

##### TASK-04-01-03-BE1 · Add the current grind period calculation
`backend` · Parent: STORY-04-01-03 (also 04-01-04) · 3 h · Updated (shots reach a grinder through their setup) · Depends on: TASK-04-01-01-BE2, TASK-01-03-03-BE1, TASK-01-02-04-BE2
- **Build:** `src/domain/grindPeriods.ts` `currentPeriod(events, now)`: the
  latest grinder event at or before now. DAL `getGrindPeriod(grinderPartId)`
  returns `{ since | null, shotCount }`, where the count is shots on any
  setup containing that grinder (through `setup_parts`) with `created_at ≥
  since`. Derived from dates, never stored. Machine and basket events are
  ignored.
- **Done when:** Unit tests cover no events, several, a back-dated one, a
  grinder in two setups; machine events don't affect it (AC 4).

##### TASK-04-01-03-FE1 · Show the current period line on the grinder's part screen
`frontend` · Parent: STORY-04-01-03 · 2 h · Unchanged · Depends on: TASK-04-01-03-BE1, TASK-04-01-01-FE2
- **Build:** Above the maintenance list on grinders: `maintenance.periodSince`
  (formatted date) with `maintenance.periodShots` (plural), or
  `maintenance.periodAll` with no events. Machines and baskets show nothing.
- **Done when:** Start and count are visible without opening anything (AC 1);
  no events shows the all-in-one line (AC 2).

##### TASK-04-01-03-QA1 · Test grind periods
`qa` · Parent: STORY-04-01-03 · 2 h · Updated · Depends on: TASK-04-01-03-FE1
- **Build:** Node tests: start and count with shots through a setup (AC 1); no
  events (AC 2); adding or back-dating an event changes the result and no
  shot row (AC 3); a machine or basket event has no effect (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-04-01-04: See maintenance in my journal

##### TASK-04-01-04-BE1 · Merge grinder events into the Journal feed
`backend` · Parent: STORY-04-01-04 · 3 h · Updated (Journal, filtered lists) · Depends on: TASK-04-01-03-BE1, TASK-02-06-04-BE1
- **Build:** `listJournal` returns shots and divider items sorted by time. A
  divider is included only for a grinder event inside the listed range whose
  grinder (through the setup) has at least one shot in the list, so
  filtered lists show dividers only for the grinders of the shots listed. It
  carries the grinder name (nickname, else model), kind, date and
  recalibration flag, and the shots' day key.
- **Done when:** Two grinders show only relevant dividers (AC 3); an event on
  a shot day sorts by time (AC 2); no divider for machine, basket or
  shotless grinder events (AC 4); older pages don't duplicate dividers.

##### TASK-04-01-04-FE1 · Build the grind period divider and show it in the Journal
`frontend` · Parent: STORY-04-01-04 · 4 h · Updated · Depends on: TASK-04-01-04-BE1, TASK-02-06-01-FE1, DES-04-01-02
- **Build:** `src/components/ui/PeriodDivider`: a `line-strong` hairline with one
  `text-overline` `ink-secondary` line `journal.maintenance` (grinder, kind,
  date) plus `maintenance.recalibration`; a list item with readable text
  linking to the grinder's part screen. Rendered in RecentShotsScreen
  between rows. Stories: plain, recalibration, among a day's rows, RTL.
- **Done when:** Stories pass axe; the divider is announced as a list item and
  is quieter than a shot row (AC 1).

##### TASK-04-01-04-QA1 · Test maintenance dividers
`qa` · Parent: STORY-04-01-04 · 3 h · Updated · Depends on: TASK-04-01-04-FE1
- **Build:** Node tests for content (AC 1), placement within a day (AC 2),
  filtered lists and no divider cases (AC 3, AC 4), and a back-dated event
  moving its divider with no shot changed (AC 5); a play test that the divider
  opens the grinder; a screen-reader text check.
- **Done when:** AC 1 to AC 5 are covered.

#### EPIC-04-02: Suggested grind that follows bean age and recent shots (revision 5, Next)

Design: DES-04-02-01 to 03. 22 tasks, 104 h. The largest Next epic. Rules and
statistics, not AI, shipped with evals (DQ-43). Decisions TD-2 to TD-4 and
TD-12 apply; every number lives in `src/domain/drift/constants.ts`. Built
today: `currentPeriodStart` (`src/domain/grindPeriods.ts`, any grinder event,
a clean included, DQ-47), `getGrindPeriod` (`maintenance.ts`),
`roastingClock` / `openedClock`, `grindWheelConfig` (`src/domain/grind.ts`),
the suggestion engine in `src/domain/suggest/` and its scenario tests,
`ShotDial`'s "was" value, `getDialInStart`, `pullShot`.

##### STORY-04-02-04: Recent shots count most

##### TASK-04-02-04-BE1 · Add the recent-shots window and time weights
`backend` · Parent: STORY-04-02-04 · 6 h · New (rev 5) · Depends on: none
- **Build:** `src/domain/drift/constants.ts` and `window.ts` (pure): from
  measured shots with dates, the current period's start and `now`, pick the
  evidence: shots in the last 3 days; if fewer than 3, reach back until 3 but
  never past the period start; at most 10 (the newest); none if fewer than 3
  even then. Weights fall with age in time (a 3-day half-life: today about
  twice a 3-day-old shot). Ties are settled by shot ID, so the same input
  always gives the same order and weights. Returns whether it reached back
  and since when.
- **Done when:** Unit tests cover the window, each reach-back case, the cap, a
  busy day (many shots, still 10), the weights and determinism (AC 1 to AC 5).

##### TASK-04-02-04-QA1 · Test the window and the weights
`qa` · Parent: STORY-04-02-04 · 3 h · New (rev 5) · Depends on: TASK-04-02-04-BE1
- **Build:** Table tests of the five criteria, including exactly 3 days, 2
  shots in the window with an older third, and a period that starts yesterday.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-04-02-05: Only compare shots from the same grind period

##### TASK-04-02-05-BE1 · Add the grind-period shot read for drift
`backend` · Parent: STORY-04-02-05 · 4 h · New (rev 5) · Depends on: none
- **Build:** `src/server/dal/driftShots.ts`: for a grinder part (an
  `owned_hardware` ID), the grinder's own events (machine and basket events
  never move it), `currentPeriodStart`, and the household's shots on any setup
  containing that grinder from the period start (`setup_parts`). A constant
  `CLEAN_STARTS_PERIOD = true` documents DQ-47 so the evals can flip it. With
  fewer than 3 measured shots in a new period it returns them and the engine
  applies no drift (a servicing shift still applies on its own, TD-5).
- **Done when:** Tests with the mocked database cover shots either side of a
  burrs event, a clean, a machine event and a basket event (AC 1 to AC 3).

##### TASK-04-02-05-QA1 · Test grind periods for drift
`qa` · Parent: STORY-04-02-05 · 3 h · New (rev 5) · Depends on: TASK-04-02-05-BE1
- **Build:** Node tests on the shot read per event kind and a new period with
  too few shots giving no drift.
- **Done when:** AC 1 to AC 3 are covered.

##### STORY-04-02-02: Grind that follows this bag's character

##### TASK-04-02-02-BE1 · Add the recipe-in-force rule
`backend` · Parent: STORY-04-02-02 · 5 h · New (rev 5) · Depends on: TASK-02-04-04-BE1, TASK-02-04-01-BE1
- **Build:** `src/domain/drift/recipeInForce.ts` (pure, TD-2) and a loader in
  `driftShots.ts` that reads the household's pins for the coffees involved
  (merge groups) once and matches each shot in memory. A bag-scoped pin
  for the shot's bag wins; a bag recipe removed after the shot still counted;
  a shot with no earlier pin comes back `unmatched`.
- **Done when:** Unit tests cover a re-pin mid-day, a pin after the shot, a
  bag recipe over the coffee's, a bag recipe removed later, another persona's
  pin not matching, and no pin (AC 4 to AC 6).

##### TASK-04-02-02-BE2 · Add the bag-character signal and the per-recipe nudge
`backend` · Parent: STORY-04-02-02 · 6 h · New (rev 5) · Depends on: TASK-04-02-04-BE1, TASK-04-02-03-BE1, TASK-04-02-07-BE1
- **Build:** `src/domain/drift/bag.ts`: the weighted mean of each measured
  shot's shot time against its own recipe's time gives a relative signal
  ("about 10 % fast"); a constant maps it to grinder steps (starting value in
  `constants.ts`, tuned by the evals), rounded to the recipe grinder's step
  (`grindWheelConfig`), computed for each recipe on its own. Only the bag's
  own shots count; a new bag starts with none.
- **Done when:** Unit tests cover fast, slow and steady bags, two recipes
  getting different nudges from one pool, a new bag, no shots, and a shot on
  another drink or setup judged against its own recipe (AC 1 to AC 4, AC 6).

##### TASK-04-02-02-QA1 · Test the bag's character
`qa` · Parent: STORY-04-02-02 · 3 h · New (rev 5) · Depends on: TASK-04-02-02-BE2
- **Build:** Node tests of the six criteria with hand-worked shots, including
  the unmatched count and a bag with its own recipe.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-02-03: Only measured shots with the recipe's prep count

##### TASK-04-02-03-BE1 · Count only measured shots with matching prep
`backend` · Parent: STORY-04-02-03 · 3 h · New (rev 5) · Depends on: TASK-04-02-02-BE1
- **Build:** `src/domain/drift/eligible.ts`: keep `entryMode = "measured"`
  shots whose WDT and puck screen ticks equal their recipe's; one-tap shots
  are never measurements (a good one-tap reaction is counted for the
  evidence line only, not weighted: see 9.3, question 6); count the shots
  left out for prep and for no recipe; return them for the sheet's evidence.
- **Done when:** Unit tests cover mixed prep, one-tap only (nothing moves) and
  too few left (nothing shown) (AC 1 to AC 5).

##### TASK-04-02-03-QA1 · Test measured shots and prep
`qa` · Parent: STORY-04-02-03 · 3 h · New (rev 5) · Depends on: TASK-04-02-03-BE1
- **Build:** Node tests of the five criteria incl. a household that never
  ticks prep consistently.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-04-02-07: Pool shots from everyone on the same coffee and grinder

##### TASK-04-02-07-BE1 · Pool shots across profiles and setups that share the grinder
`backend` · Parent: STORY-04-02-07 · 4 h · New (rev 5) · Depends on: TASK-04-02-05-BE1, TASK-04-02-02-BE1
- **Build:** In `driftShots.ts`: the pool is every persona's shots of the
  coffee on setups that contain the same grinder unit, each carrying its own
  recipe; never another grinder. Returns the count of distinct personas and
  whether several setups contributed, never a name. A constant
  `POOL_WITHIN_BASKET = false` is the evals' fallback switch (DQ-32).
- **Done when:** Unit tests cover one persona (the pool is theirs and widens
  by itself), several personas, a second setup with the grinder, a different
  grinder, and that no name is in the output (AC 1 to AC 6).

##### TASK-04-02-07-QA1 · Test pooling
`qa` · Parent: STORY-04-02-07 · 3 h · New (rev 5) · Depends on: TASK-04-02-07-BE1
- **Build:** Node tests of the six criteria with two personas and two setups on
  one grinder.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-02-01: Grind that follows bean age

##### TASK-04-02-01-BE1 · Add the bean-age term
`backend` · Parent: STORY-04-02-01 · 6 h · New (rev 5) · Depends on: TASK-04-02-04-BE1, TASK-04-02-03-BE1
- **Build:** `src/domain/drift/age.ts`: with at least 3 measured shots on the
  coffee in the period spread over at least 2 ages, a weighted least-squares
  line of each shot's grind minus its own recipe's servicing-applied grind
  (TD-2; never the stored grind) against its age since
  roasting gives the term at the portion's current age (the since-opening clock
  adds a smaller term, its weight a constant). Ages come from `roastingClock`
  and `openedClock`, so freezing pauses them and an unopened portion uses the
  roasting clock only. Under one grinder step it is none; a stepped grinder
  rounds to its steps, a stepless one to its finest increment; the result is
  kept within the grinder's range and capped (`limited` flag).
- **Done when:** Unit tests cover too few shots or ages (none), a clear ageing
  bag, the sub-step case, stepped and stepless, the cap, the range clamp and
  frozen/unopened portions (AC 1 to AC 6); the stored recipe is untouched.

##### TASK-04-02-01-QA1 · Test the age term
`qa` · Parent: STORY-04-02-01 · 4 h · New (rev 5) · Depends on: TASK-04-02-01-BE1
- **Build:** Node tests of the six criteria with fixed shots and dates in two
  time zones.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-02-06: See the suggested grind where I brew

##### TASK-04-02-06-BE1 · Compose the grind adjustment and the trail
`backend` · Parent: STORY-04-02-06 (also 04-02-08) · 7 h · New (rev 5) · Depends on: TASK-04-02-01-BE1, TASK-04-02-02-BE2, TASK-04-02-07-BE1
- **Build:**
  - `src/domain/drift/index.ts` `adjustGrind(input)`: the composition order of
    TD-3 returns `{ shown, recipeGrind, steps, limited, evidence }`, where
    `steps` is the trail (aged, bag, serviced with its event dates) and
    `evidence` is data only: measured shot count, the window in days, the date
    it reached back to or "since servicing", counts left out for prep and for
    no recipe, one-tap not counted, number of personas, across setups.
  - `src/server/dal/grindAdjustment.ts` `getGrindAdjustment(key, portion,
    now)` loads the recipe, the grinder's events, shots, pins and the grinder
    scale, calls the engine and returns `null` on any error (after the log
    line of TASK-04-02-09-BE1).
  - An adjustment under one step returns `null`.
- **Done when:** Unit tests cover the composition order, the trail adding up to
  the shown grind, the limited flag, and the error path returning `null`.

##### TASK-04-02-06-BE2 · Apply the adjustment on Brew, in dial in and in the one-tap pull
`backend` · Parent: STORY-04-02-06 · 7 h · New (rev 5) · Depends on: TASK-04-02-06-BE1, TASK-02-04-02-BE1
- **Build:**
  - `home.ts`: the `recipe` state carries the adjustment; `dialIn.ts` /
    `getDialInFromRecipe`: the log's start grind is the adjusted one with the
    recipe's as the "was" value, including the closest-setup start when the
    grinder is the same (a different grinder gets none).
  - `pullShot` (TD-4): recomputes server side, records the adjusted grind
    unless the new `useRecipeGrind` flag is set, stays `one-tap` and
    `isNetworkEligible: false`, leaves the recipe unchanged.
  - Not called by `getFixStart`, `getDialInFromShot`, edit or entered
    recipes.
  - Any error returns the recipe's grind; a pull is never blocked.
- **Done when:** Unit tests cover each caller, the recorded grind, the flag, the
  untouched recipe and the error path; a test counts the queries and fails if
  `getHome` with an adjustment makes more than 4 more than without, or takes
  more than 50 ms longer (median of 20 runs, local file database, 500 shots)
  (budget in R-28). Pull wording: a race with another device's shot can make
  the recorded grind differ from the shown one by one step (TQ-22); the test
  fixes `now` and asserts equality, and the story note records the race.

##### TASK-04-02-06-FE1 · Show the adjusted grind and the reason on Brew
`frontend` · Parent: STORY-04-02-06 · 5 h · New (rev 5) · Depends on: TASK-04-02-06-BE2, TASK-04-02-08-FE1, DES-04-02-01
- **Build:** `HomeScreen.tsx`: the grind in the values grid is the adjusted one
  (same size and weight); a quiet ghost line under the grid (`home.grindAdjusted`,
  "recipe 15 · beans have aged", reasons from `home.grindReason.*`) opens the
  trail sheet; nothing is shown when there is no adjustment. "Use my recipe's
  grind for this shot" sets Brew's `useRecipeGrind` for one pull only (client
  state, not saved). Stories: adjusted, none, with and without the line at
  375 x 667 with the Pull button visible, RTL.
- **Done when:** The no-adjustment HomeScreen story renders identically to the
  existing Brew story (a play test compares the two DOM snapshots) (AC 2); the
  Pull button stays on screen (design acceptance).

##### TASK-04-02-06-FE2 · Start the log at the adjusted grind
`frontend` · Parent: STORY-04-02-06 · 4 h · New (rev 5) · Depends on: TASK-04-02-06-BE2, TASK-04-02-08-FE1, DES-04-02-01
- **Build:** `ShotLogFlow.tsx` / `RecipeLogFlow.tsx`: for a dial in from a
  recipe the grind tab opens at the adjusted value, the recipe's grind is the
  "was" value (`ShotDial`), and the same reason line sits under the grind wheel;
  fix, dial in from a shot, edit and entering a recipe are unchanged (AC 4).
- **Done when:** AC 3 and AC 4 hold in the log's play tests.

##### TASK-04-02-06-QA1 · Test seeing the suggested grind
`qa` · Parent: STORY-04-02-06 · 5 h · New (rev 5) · Depends on: TASK-04-02-06-FE2, TASK-04-02-06-FE1
- **Build:** Node tests of all six criteria (the pull records the grind shown;
  fix and edit unadjusted; a failing calculation never blocks a pull); play
  tests of Brew with and without the line.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-02-08: See why this grind

##### TASK-04-02-08-FE1 · Build the grind trail sheet (SH-DRIFT) with its stories
`frontend` · Parent: STORY-04-02-08 · 6 h · New (rev 5) · Depends on: DES-04-02-02, DES-04-02-03
- **Build:** `src/components/recipes/GrindTrailSheet.tsx`: the recipe's grind
  (`text-h3`), one signed row per step (formatted through `Intl`
  `signDisplay`), a hairline and the shown grind in `text-display` weight 200;
  evidence lines (`drift.basedOn`, the reached-back date or `drift.sinceServicing`,
  `drift.onlyMeasured`, `drift.recentMore`, `drift.prepLeftOut`, `drift.pooled`,
  `drift.acrossSetups`, `drift.perRecipe`); "finer" or "coarser" only when the
  grinder's direction is known; a "limited to N steps" line; footer
  `drift.useRecipe`. Ink only. Stories: aged, bag, both, reached back, pooled,
  prep left out, direction unknown, limited, RTL.
- **Done when:** Stories pass axe; the rows add up to the shown grind (AC 1 to
  AC 4, AC 6); the servicing rows come later with EPIC-04-03.

##### TASK-04-02-08-QA1 · Test the reason sheet
`qa` · Parent: STORY-04-02-08 · 4 h · New (rev 5) · Depends on: TASK-04-02-08-FE1, TASK-04-02-06-FE1
- **Build:** Play tests of the arithmetic, each evidence line, the direction
  words with and without a known direction, "use my recipe's grind" lasting
  one pull and the limited line.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-02-09: A grind adjustment that's checked before each release

##### TASK-04-02-09-BE1 · Log the adjustment's outcomes
`backend` · Parent: STORY-04-02-09 · 3 h · New (rev 5) · Depends on: TASK-04-02-06-BE1
- **Build:** `src/server/observe.ts`: one function writing a structured line
  (`drift.outcome` with `applied`, `none`, `limited` or `failed` and a reason
  code, counts only, no IDs of people, no values from the user's profile) used
  by `getGrindAdjustment`; the function is the single place to swap in a real
  observability tool (R-28).
- **Done when:** Each outcome is emitted once per calculation and tests check
  the shape and that no name or ID is logged (AC 3).

##### TASK-04-02-09-QA1 · Write the drift scenario suite and the pass-rate report
`qa` · Parent: STORY-04-02-09 · 10 h · New (rev 5) · Depends on: TASK-04-02-06-BE1
- **Build:**
  - `src/domain/drift/__tests__/scenarios.test.ts` (in the style of
    `suggest/__tests__/scenarios.test.ts`): at least 24 scenarios across an
    ageing bag, a fast bag, a busy multi-person household, mixed prep, a
    low-volume household, a fresh period after servicing, and single against
    double baskets, each with an expected direction and size band.
  - A report (`npm run evals:drift`) printing the pass rate against a target
    constant that stays unset (X-2).
  - A constants snapshot test that fails when any number in `constants.ts`
    changes until the scenarios are re-run and the snapshot updated (AC 2).
  - One scenario for the servicing case (M1): a serviced grinder, an old
    recipe and shots at the shifted grind give no age term and show the shift
    once, not twice. It needs servicing applied on read, so it is added and
    run in wave 24 with TASK-04-03-03-BE2; until then servicing has no effect
    on the adjustment (no event carries a shift before wave 24).
  - The tech lead writes the scenarios; the Head of Product signs off the
    scenario table before release.
- **Done when:** AC 1 to AC 3 are covered; a changed constant fails the build
  until the suite is re-run.

#### EPIC-04-03: Re-dial once after maintenance and keep every recipe (revision 5, Next)

Design: DES-04-03-01 to 05. 21 tasks, 93 h. No schema change (TD-5, TD-7).
Built today: `maintenance_events.grind_shift`, `grind_scale` and
`offset_source_recipe_id` (unused), `addMaintenance` / `listMaintenance`
(`src/server/dal/maintenance.ts`; there is no way to edit or delete an event,
see 9.3 question 3), `canRecalibrate`, `recalibrationDefault`, `UnitScreen`
with plain event rows, `PeriodDivider`, `NumberWheel` (signed ranges work).

##### STORY-04-03-04: Be invited to re-dial one coffee after servicing

##### TASK-04-03-04-BE1 · Add the re-dial state and the candidate read
`backend` · Parent: STORY-04-03-04 (also 04-03-05) · 5 h · New (rev 5) · Depends on: none
- **Build:**
  - `src/domain/redial.ts` (TD-7): the event state (`awaiting`, `confirmed`,
    `noAdjustment`, `nothingToMap`, `notRecalibration`) from the event and
    whether a recipe predates it; "before" means `pinnedAt` earlier than the
    event's time, so a pin earlier today counts for an event logged today.
  - `src/server/dal/redial.ts`: `getGrinderRedial(grinderPartId)` (status for
    the grinder's screen), `getBrewRedialCard(currentSetupId)` (the current
    setup contains this grinder, an event awaits, a recipe predates it on any
    setup with the grinder; names the grinder when the household has two),
    and `listRedialCandidates(eventId)` (coffees on hand with a recipe before
    the event on this grinder, Brew's coffee first, each with drink and
    setup).
  - `listMaintenance` returns the state.
- **Done when:** Unit tests cover each state, a clean, a repair, a machine or
  basket event, no recipe before, two grinders and a same-day pin (AC 1, AC 2,
  AC 4).

##### TASK-04-03-04-BE2 · Add the re-dial dial-in start
`backend` · Parent: STORY-04-03-04 · 3 h · New (rev 5) · Depends on: TASK-04-03-04-BE1
- **Build:** `getRedialStart(eventId, recipeKey)` in `logStart.ts`: the old
  recipe's raw grind as the start and the "was" value, its other values and
  prep, milk and sweetened, no drift adjustment (the old number only means
  something as a starting point), and the event ID so the log can show the
  banner.
- **Done when:** Unit tests cover the start values and that no adjustment is
  applied (AC 5).

##### TASK-04-03-04-FE1 · Build the re-dial card for Brew
`frontend` · Parent: STORY-04-03-04 · 4 h · New (rev 5) · Depends on: DES-04-03-01, DES-04-03-05
- **Build:** `src/components/home/RedialCard.tsx`: an outline `Card` (`padding
  md`) with `home.redial.title`, one sentence, a secondary `home.redial.start`
  and a ghost `home.redial.later`; the grinder's name when two. Stories: one
  grinder, two grinders, 375 x 667 with the Pull button visible, RTL.
- **Done when:** Stories pass axe; Pull and Dial in stay untouched.

##### TASK-04-03-04-FE2 · Show the status on the grinder's screen and the card on Brew
`frontend` · Parent: STORY-04-03-04 · 5 h · New (rev 5) · Depends on: TASK-04-03-04-BE1, TASK-04-03-04-FE1
- **Build:** `UnitScreen.tsx`: the status block above the events
  (`maintenance.redialAwaiting` with `maintenance.redialStart`), only when
  there is something to map. `HomeScreen.tsx` / `BrewFlow.tsx`: the card slot
  (one card at a time: this one wins over the link prompt of EPIC-05-03);
  "not now" is remembered per event on this device
  (`src/lib/dismissals.ts` pattern) and leaves the grinder's status; the
  coffee choice opens a `SelectSheet` (`redial.pick`).
- **Done when:** AC 1 to AC 4 and AC 6 hold in stories and play tests.

##### TASK-04-03-04-FE3 · Open the log in re-dial mode
`frontend` · Parent: STORY-04-03-04 · 5 h · New (rev 5) · Depends on: TASK-04-03-04-BE2, TASK-04-03-04-FE2, DES-04-03-01
- **Build:** `/log` accepts a re-dial context (event and recipe key);
  `ShotLogFlow.tsx` shows the `log.redialing` banner under the header and
  starts from `getRedialStart`; saving and tasting are the normal flow and the
  final pin leads to the offset sheet (TASK-04-03-01-FE1).
- **Done when:** AC 5 holds: the banner shows, the old grind is the "was"
  value and no adjustment is applied.

##### TASK-04-03-04-QA1 · Test the re-dial invitation
`qa` · Parent: STORY-04-03-04 · 5 h · New (rev 5) · Depends on: TASK-04-03-04-FE3
- **Build:** Node tests of every state and condition above; play tests of the
  card, "not now" (card gone, status stays), the coffee pick and the banner,
  and the one-card rule with the link prompt.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-03-01: Re-dial one coffee and get the shift

##### TASK-04-03-01-BE1 · Add the shift proposal rule
`backend` · Parent: STORY-04-03-01 · 4 h · New (rev 5) · Depends on: TASK-04-02-01-BE1
- **Build:** `src/domain/offset.ts` `proposeShift({ oldGrind, newGrind, ageNote
  })`: new minus old, with the bean-ageing change between the two dial-ins
  (the age term of `drift/age.ts` over the days between the pins) taken off
  first, and returned separately for the quiet line; no age estimate means
  nothing is taken off; words ("3 steps finer") only when the grinder's
  direction is known.
- **Done when:** Unit tests cover with and without an age estimate, a zero
  shift and the words rule (AC 2, AC 3).

##### TASK-04-03-01-BE2 · Find the event and the baseline for a new pin
`backend` · Parent: STORY-04-03-01 · 5 h · New (rev 5) · Depends on: TASK-04-03-01-BE1, TASK-04-03-04-BE1
- **Build:** `getOffsetProposal(recipeId)` in `src/server/dal/redial.ts`: for a
  pin on a setup with a grinder, the most recent recalibrating grinder event
  between the previous pin and this one; that previous pin is the baseline;
  with none, no proposal (and on the card path, a `noBaseline` result so the
  sheet can offer another coffee, AC 4). Any failure returns an error the
  caller turns into "no shift could be proposed" (AC 6).
- **Done when:** Unit tests cover no event, no baseline, two events, a same-day
  event and a thrown error; the pin is never rolled back.

##### TASK-04-03-01-FE1 · Open the offset sheet after a pin
`frontend` · Parent: STORY-04-03-01 · 4 h · New (rev 5) · Depends on: TASK-04-03-01-BE2, TASK-04-03-02-FE1
- **Build:** `usePinFlow.tsx`'s `onPinned` asks for a proposal and opens the
  offset sheet when one exists; with the card or the grinder's screen as the
  source and no baseline, the sheet shows `offset.noBaseline` with
  `offset.pickAnother`; a plain pin with no baseline shows nothing; a failed
  proposal says the pin is saved and no shift could be proposed.
- **Done when:** AC 1 and AC 4 to AC 6 hold in play tests.

##### TASK-04-03-01-QA1 · Test proposing a shift
`qa` · Parent: STORY-04-03-01 · 5 h · New (rev 5) · Depends on: TASK-04-03-01-FE1
- **Build:** Node tests of the proposal from hand-worked recipes (including
  ageing taken off and a same-day event); play tests of the flows from the
  card, the grinder's screen and an ordinary pin.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-04-03-02: Confirm, edit or decline the shift

##### TASK-04-03-02-BE1 · Add confirming, editing and declining a shift
`backend` · Parent: STORY-04-03-02 · 4 h · New (rev 5) · Depends on: TASK-04-03-04-BE1
- **Build:** `confirmShift(eventId, shift, sourceRecipeId)` in
  `src/server/dal/redial.ts` stores `grind_shift`, `grind_scale` 1 and
  `offset_source_recipe_id` on a recalibrating grinder event of the household
  (`assertOwned("maintenanceEvents")`); declining stores a shift of 0
  (DQ-42d); its action in `src/server/actions/maintenance.ts`.
- **Done when:** Unit tests cover confirm, edit before saving, decline,
  another household's event and a non-grinder event (AC 2, AC 3).

##### TASK-04-03-02-BE2 · Add the preview of other recipes
`backend` · Parent: STORY-04-03-02 · 3 h · New (rev 5) · Depends on: TASK-04-03-02-BE1
- **Build:** `previewShift(eventId, shift)`: up to three other recipes pinned
  before the event on any setup with the grinder (newest per coffee, drink and
  setup, every profile), each as coffee, drink, old grind and shifted grind,
  and the count of the rest.
- **Done when:** Unit tests cover none, three, more than three ("and 4 more")
  (AC 1).

##### TASK-04-03-02-FE1 · Build the offset sheet (SH-OFFSET) with its stories
`frontend` · Parent: STORY-04-03-02 · 6 h · New (rev 5) · Depends on: TASK-04-03-02-BE2, DES-04-03-02, DES-04-03-05
- **Build:** `src/components/recipes/OffsetSheet.tsx`: the evidence line
  (`offset.line`), the signed shift in `text-display` weight 200 with its unit,
  the words when known, the ageing note, a compact `NumberWheel` for the shift
  (step = the grinder's step; add a story with a negative range), up to three
  preview rows with the arrow `Icon` and "and N more", primary
  `offset.confirm`, ghost `offset.decline`, a failed save keeping the sheet
  with a retry Notice. Variants: no baseline, edit mode (from "your re-dial of
  X on a date", `offset.save`, `offset.remove`). Stories each, RTL.
- **Done when:** Stories pass axe; the sheet shows evidence, shift, ageing
  note and preview, all editable in place.

##### TASK-04-03-02-QA1 · Test confirming, editing and declining
`qa` · Parent: STORY-04-03-02 · 4 h · New (rev 5) · Depends on: TASK-04-03-01-FE1
- **Build:** Node tests of what is stored in each case and that old recipes
  read unshifted after declining; play tests of the preview and a failed save.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-04-03-03: Old recipes read right after maintenance

##### TASK-04-03-03-BE1 · Add the servicing rule
`backend` · Parent: STORY-04-03-03 · 3 h · New (rev 5) · Depends on: none
- **Build:** `src/domain/servicing.ts` (TD-5): `applyServicing(grind,
  pinnedAt, events)` applies, in date order, each confirmed event after the
  pin as `grind x scale + shift` (scale 1 until EPIC-04-04) and returns the
  list of steps with their dates for the trail; events before the pin, on
  another grinder or unconfirmed are ignored.
- **Done when:** Unit tests cover several events in order, an event before the
  pin, a zero shift and a back-dated event slotting into its date place
  (AC 3, AC 4, AC 5).

##### TASK-04-03-03-BE2 · Apply servicing wherever a recipe's grind is read
`backend` · Parent: STORY-04-03-03 · 8 h · New (rev 5) · Depends on: TASK-04-03-03-BE1, TASK-04-03-02-BE1, TASK-04-02-06-BE1
- **Build:**
  - One `resolveRecipeGrind(recipe)` in `src/server/dal/recipes.ts` used by
    `home.ts`, `getDialInStart` / `logStart.ts` (including `getFixStart`,
    which today starts from the recipe's raw grind), `pinPreview`'s "replaces"
    block, `getBagRecipes` / `getCoffeeRecipes` rows and `pullShot` (the pull
    records the grind Brew shows).
  - The drift composition (TASK-04-02-06-BE1) takes the servicing step as its
    first step, so its trail lists the servicing rows with dates.
  - Stored recipes are never rewritten.
  - The drift reads (`recipeInForce`, the age and bag terms) judge each shot
    against its recipe's servicing-applied grind from this same function, so a
    confirmed shift is never absorbed by the age line and added again (TD-2).
- **Done when:** A test with a confirmed shift and shots at the shifted grind
  shows the shift once, not twice; unit tests cover each call site with a shifted and an unshifted
  recipe, a recipe after the event, a different grinder, and the stored row
  staying as pinned (AC 1 to AC 3).

##### TASK-04-03-03-FE1 · Label shifted grinds wherever they show
`frontend` · Parent: STORY-04-03-03 · 5 h · New (rev 5) · Depends on: TASK-04-03-03-BE2, TASK-04-02-08-FE1, DES-04-03-04
- **Build:** Add the servicing rows (with dates, `drift.serviced`) to the trail
  sheet; Brew's reason line gains `home.grindReason.serviced`; the pin
  sheet's replaced block, the recipe rows and the log's "was" label the shifted
  value in words. Stories with one and several events.
- **Done when:** A shifted recipe is always labelled where it shows (AC 1, AC 4).

##### TASK-04-03-03-QA1 · Test old recipes after servicing
`qa` · Parent: STORY-04-03-03 · 4 h · New (rev 5) · Depends on: TASK-04-03-03-FE1
- **Build:** Node tests across Brew, the log, the pin sheet and the rows; play
  tests of the labels and the sheet's rows; a back-dated event reordering at
  once (AC 5, with the limit in 9.3 question 3).
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-04-03-05: Review and change a shift from the grinder's screen

##### TASK-04-03-05-BE1 · Add changing, removing and re-opening a shift
`backend` · Parent: STORY-04-03-05 · 3 h · New (rev 5) · Depends on: TASK-04-03-02-BE1
- **Build:** `setEventShift(eventId, shift)` (0 removes it, a declined event
  can get one later); `getEvent(eventId)` returns the state, the shift, the
  source re-dial's coffee and date, and whether a re-dial can start; later
  reads follow the new value, stored recipes don't change.
- **Done when:** Unit tests cover edit, remove, set after decline and the
  untouched recipes (AC 2 to AC 4).

##### TASK-04-03-05-FE1 · Make the grinder's event rows open the offset sheet
`frontend` · Parent: STORY-04-03-05 · 5 h · New (rev 5) · Depends on: TASK-04-03-05-BE1, TASK-04-03-02-FE1, DES-04-03-03
- **Build:** `UnitScreen.tsx`: grinder events become tappable `ListRow`s with
  their state in words (`maintenance.redialAwaiting`, `maintenance.shift` such
  as "-3 steps", no adjustment, nothing to map) at the end; other parts'
  events stay plain; opening one shows the offset sheet in edit mode, and an
  awaiting event can start the re-dial from there.
- **Done when:** AC 1 to AC 5 hold in stories and play tests.

##### TASK-04-03-05-QA1 · Test the event rows
`qa` · Parent: STORY-04-03-05 · 3 h · New (rev 5) · Depends on: TASK-04-03-05-FE1
- **Build:** Play tests of each state's text, editing, removing, setting after a
  decline and starting a re-dial.
- **Done when:** AC 1 to AC 5 are covered.

#### EPIC-04-04: Keep recipes right after new burrs of a different design (revision 5, Next)

Design: DES-04-04-01 to 03. 11 tasks, 46 h. The lowest-value Next epic, built
after EPIC-04-03. Shift and stretch are fitted by a least-squares line through
the event's re-dials (DQ-43b); the re-dials are derived from pins (TD-7).

##### STORY-04-04-01: Work out a stretch from two or more re-dials

##### TASK-04-04-01-BE1 · Add the shift and stretch fit
`backend` · Parent: STORY-04-04-01 · 6 h · New (rev 5) · Depends on: TASK-04-03-01-BE1
- **Build:** `src/domain/offsetFit.ts`: from (old grind, new grind with the
  ageing taken off) pairs, a least-squares line gives the stretch (the slope)
  and the shift (the intercept) so that new = old x stretch + shift. Returns
  `uncertain` when the residual passes a threshold constant, `tooClose` when
  the old grinds are within about two grinder steps (stretch stays 1), and the
  number of coffees. With one pair it is a plain shift. Constants in one
  file (starting values).
- **Done when:** Unit tests cover two exact points, three or more with noise,
  an uncertain fit, two coffees too close and a single re-dial (AC 1 to AC 4).

##### TASK-04-04-01-BE2 · Propose a stretch with the shift for burrs events
`backend` · Parent: STORY-04-04-01 · 5 h · New (rev 5) · Depends on: TASK-04-04-01-BE1, TASK-04-03-01-BE2
- **Build:** `getOffsetProposal` (TASK-04-03-01-BE2) gathers the event's
  derived re-dials (each coffee/profile/setup/drink's first pin after the event
  with a pin before it) and calls the fit; it proposes a stretch only for
  events of kind burrs (AC 5) and with two or more coffees (AC 2); returns
  the evidence per coffee and the count.
- **Done when:** Unit tests cover non-burrs, one coffee, two, three and the
  too-close case.

##### TASK-04-04-01-FE1 · Add the stretch to the offset sheet
`frontend` · Parent: STORY-04-04-01 · 6 h · New (rev 5) · Depends on: TASK-04-04-01-BE2, TASK-04-04-02-FE1, TASK-04-03-02-FE1, DES-04-04-01
- **Build:** `OffsetSheet.tsx`: with two or more coffees the evidence names each
  coffee, the stretch block shows `offset.stretch` as a percentage in
  `text-display` with the sentence `offset.stretch.explain` and a percent
  `NumberWheel`; the preview covers both effects; `offset.basedOn` for three
  or more; a neutral `offset.uncertain` Notice (never `signal`); the
  `offset.tooClose` line with `offset.pickAnother`. Stories: two, three,
  uncertain, too close, RTL.
- **Done when:** Stories pass axe; nothing about stretch shows with one
  coffee (AC 2).

##### TASK-04-04-01-QA1 · Test proposing a stretch
`qa` · Parent: STORY-04-04-01 · 5 h · New (rev 5) · Depends on: TASK-04-04-01-FE1
- **Build:** Node tests of the fit against hand-worked examples and the five
  criteria; play tests of every sheet variant.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-04-04-02: Confirm or edit the stretch

##### TASK-04-04-02-FE1 · Add the percent unit to NumberWheel with a story
`frontend` · Parent: STORY-04-04-02 · 3 h · New (rev 5) · Depends on: DES-04-04-03
- **Build:** `percent` added to `CanonicalUnit` in `src/lib/units.ts` (display
  only) and handled by `NumberWheel.tsx` (-30 to +30, step 1, signed); a story
  with 0 shown as "steps mean the same"; unit tests in `units.test.ts`.
- **Done when:** The story passes axe and RTL; the value formats through
  `Intl`.

##### TASK-04-04-02-BE1 · Save and apply the stretch
`backend` · Parent: STORY-04-04-02 · 4 h · New (rev 5) · Depends on: TASK-04-04-01-BE2, TASK-04-03-03-BE1
- **Build:** `confirmShift` also takes a stretch: the percent from -30 to +30 is
  validated and stored as the factor in `grind_scale` (1 meaning none);
  declining the stretch stores a scale of 1 and refits the shift with the
  stretch fixed at 1 (the fitted intercept no longer applies); editing later (including
  an event that is not burrs but has one) follows; `applyServicing` already
  uses the scale (TASK-04-03-03-BE1).
- **Done when:** Unit tests cover the range, a factor round trip, decline,
  later edit and the formula on a recipe (AC 1 to AC 5).

##### TASK-04-04-02-FE2 · Edit the stretch from the event and show it in the trail
`frontend` · Parent: STORY-04-04-02 · 3 h · New (rev 5) · Depends on: TASK-04-04-02-BE1, TASK-04-03-05-FE1
- **Build:** The event's edit mode shows the stretch wheel when one exists or
  the event is burrs; the trail shows one row with both parts
  (`drift.servicedStretch`); stored recipes unchanged.
- **Done when:** AC 3 to AC 5 hold in stories.

##### TASK-04-04-02-QA1 · Test confirming and editing the stretch
`qa` · Parent: STORY-04-04-02 · 4 h · New (rev 5) · Depends on: TASK-04-04-02-FE2
- **Build:** Node and play tests of the five criteria incl. 0 % and -30 %/+30 %
  edges.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-04-04-03: Be invited to re-dial a second coffee

##### TASK-04-04-03-BE1 · Order the second-coffee choices by distance
`backend` · Parent: STORY-04-04-03 · 3 h · New (rev 5) · Depends on: TASK-04-04-01-BE1
- **Build:** `listRedialCandidates(eventId)` for a burrs event with one re-dial
  puts the coffee whose old grind is farthest from the first coffee's first and
  flags it `farFromFirst`; other events are unchanged.
- **Done when:** Unit tests cover the ordering and a non-burrs event (AC 2,
  AC 3).

##### TASK-04-04-03-FE1 · Add the second re-dial invitation to the event
`frontend` · Parent: STORY-04-04-03 · 4 h · New (rev 5) · Depends on: TASK-04-04-03-BE1, TASK-04-03-05-FE1, DES-04-04-02
- **Build:** In the event's detail for a burrs event with a confirmed shift and
  one re-dial: `maintenance.redialMore.body` and the action
  `maintenance.redialMore`; the pick marks the farthest coffee
  `offset.farFromFirst`; pinning leads to the stretch proposal. Nothing for
  other events and nothing on Brew (AC 4).
- **Done when:** AC 1 to AC 5 hold in stories and play tests.

##### TASK-04-04-03-QA1 · Test the second re-dial invitation
`qa` · Parent: STORY-04-04-03 · 3 h · New (rev 5) · Depends on: TASK-04-04-03-FE1
- **Build:** Play tests of burrs and non-burrs events, the ordering and mark,
  no Brew card, and the stretch proposal after the second pin.
- **Done when:** AC 1 to AC 5 are covered.

---

### INIT-05: Brew for the whole household, each to their own taste

Revision 5. The epics are in ID order here; the build order is EPIC-05-03,
then EPIC-05-01, and EPIC-05-02 last (section 8.4).

#### EPIC-05-01: Brew for someone else in the household (revision 5, Next)

Design: DES-05-01-01 to 04. 25 tasks, 109 h. The widest change in the plan:
the "default persona" is read in fifteen places (TD-1), so STORY-05-01-03's
first three backend tasks go first and the rest build on them. Built today:
one persona per household (`isDefault`), `renamePersona` and `ProfileScreen`
(`profile.ts`), the brew choice cookie (30-minute reset), `FilterChips` and
the Journal filters, `personaLabel` (`src/domain/personaLabel.ts`). Names in
the examples are placeholders; the app holds no personal data.

##### STORY-05-01-03: Choose who I'm brewing for on Brew

##### TASK-05-01-03-BE1 · Add the main persona resolver and the persona choice
`backend` · Parent: STORY-05-01-03 · 6 h · New (rev 5) · Depends on: none
- **Build:**
  - `src/server/dal/persona.ts` (TD-1): `mainPersona()` (claimed by the signed-in
    user, else the household's `isDefault`), `listPersonas()`, `actingPersona()`
    (the cookie's persona if it belongs to the household, else the main one).
  - The `brewChoice` cookie (`src/domain/brewChoice.ts`,
    `src/lib/brewChoiceCookie.ts`, `src/server/brewChoice.ts`) gains
    `personaId`; it holds until Brew has been away for `BREW_CHOICE_RESET_MS`
    and, unlike drink and coffee, `clearBrewChoice` after a pull keeps it.
  - Add `personas` to `assertOwned`'s checks if not covered.
- **Done when:** Unit tests cover claimed, default-only and foreign IDs
  (falls back to main), expiry after 30 minutes and surviving a pull (AC 6).

##### TASK-05-01-03-BE2 · Thread the acting persona through reads and writes
`backend` · Parent: STORY-05-01-03 (also 05-01-04) · 8 h · New (rev 5) · Depends on: TASK-05-01-03-BE1, TASK-05-01-03-BE3
- **Build:** Replace every `isDefault` lookup in `src/server/dal`: `shots.ts`
  (`saveMeasuredShot` records the acting persona, `loggedByUserId` stays the
  user), `pull.ts`, `home.ts` (the usual drink and the last pulled coffee per
  persona; a new persona gets the first shown drink), `logStart.ts`,
  `dialIn.ts`, `recipes.ts` (`entered`, `getRecipeForBag`, `getCoffeeRecipes`),
  `logContext.ts` (milk memory and the default setup's shot), `profile.ts`.
  Fix the tests and fixtures (`src/test/fixtures.ts`). With one persona every
  result is unchanged.
- **Done when:** A grep finds no `isDefault` outside the resolver, the
  bootstrap and fixtures; the full suite passes; new tests show two personas
  never mixing recipes, drinks or last-pulled coffee; the isolation suite
  still passes.

##### TASK-05-01-03-BE3 · Make the current setup the household's last shot
`backend` · Parent: STORY-05-01-03 · 2 h · New (rev 5) · Depends on: none
- **Build:** `latestShotSetup` in `src/server/dal/setups.ts` drops its join on
  `personas.isDefault` (DQ-36): the current setup follows the household's
  latest shot, whoever it was for. `currentSetupId` and the device cookie are
  unchanged.
- **Done when:** A test with two personas shows switching person never changes
  the setup (AC 7); one-persona results are the same.

##### TASK-05-01-03-FE1 · Add the persona select to Brew
`frontend` · Parent: STORY-05-01-03 · 6 h · New (rev 5) · Depends on: TASK-05-01-03-BE2, TASK-05-01-01-BE1, DES-05-01-01, DES-05-01-04
- **Build:** `HomeScreen.tsx` / `BrewFlow.tsx`: with one persona the label
  opens Profile as today; with more it becomes a quiet `SelectField` (hidden
  label `home.changePerson`) opening a `SelectSheet` (`home.whoFor`): the main
  persona first (`home.usual`) and the others by most recent brewing, each with
  their usual drink, and a footer row `home.profileAndPeople`. Choosing updates
  Brew in place (drink, coffee and recipe of that persona, a 200 ms
  cross-fade) and saves the choice in the cookie; "for {name}"
  (`home.brewingFor`) shows whenever it isn't the main persona. Stories: one
  persona (unchanged), several, chosen, RTL.
- **Done when:** AC 1 to AC 3 hold in stories.

##### TASK-05-01-03-FE2 · Keep the chosen persona across pulls and reset it after 30 minutes
`frontend` · Parent: STORY-05-01-03 · 3 h · New (rev 5) · Depends on: TASK-05-01-03-FE1
- **Build:** `BrewFlow` saves the persona with `saveBrewChoice`, keeps it after
  a pull and a visit away shorter than 30 minutes (`touchBrewChoice`), and
  returns to the main persona after that; a pull, log or tasting from Brew is
  for the chosen persona (AC 5).
- **Done when:** AC 5 and AC 6 hold in play tests with a controllable clock.

##### TASK-05-01-03-QA1 · Test choosing who to brew for
`qa` · Parent: STORY-05-01-03 · 5 h · New (rev 5) · Depends on: TASK-05-01-03-FE2, TASK-05-01-03-BE3
- **Build:** Node tests of the resolver, the persona's usual drink, coffee and
  recipe, no recipe giving Dial in only, the shot recorded for the persona, the
  setup not changing; play tests of one persona, several, hold and reset.
- **Done when:** AC 1 to AC 7 are covered.

##### STORY-05-01-01: Add a profile for someone I brew for

##### TASK-05-01-01-BE1 · Add profiles for people without a login
`backend` · Parent: STORY-05-01-01 (also 05-01-02) · 4 h · New (rev 5) · Depends on: TASK-05-01-03-BE1, TASK-02-05-01-BE1
- **Build:** `src/server/dal/people.ts`: `listPeople()` (the main persona first,
  the rest by most recently brewed for, each with a shot count and the last
  shot's date, from `extractions`) and `addPerson(name)` creating a persona
  with no `userId` and `isDefault` false; name 1 to 40 characters, unique among
  profiles and not equal to the main persona's label, using
  `src/domain/listName.ts`. Every household member sees every profile.
- **Done when:** Unit tests cover ordering, counts, "no shots yet", empty and
  duplicate names (AC 1 to AC 4).

##### TASK-05-01-01-FE1 · Build the people screen and the person sheet
`frontend` · Parent: STORY-05-01-01 · 7 h · New (rev 5) · Depends on: TASK-05-01-01-BE1, DES-05-01-02, DES-05-01-04
- **Build:** `PeopleScreen` (SCR-PEOPLE): `PageHeader`, intro, one `ListRow`
  per profile (the main one first with the overline `people.you`; secondary
  "12 shots, last 3 days ago" or "no shots yet"), a plus row `people.add`.
  `PersonSheet` (SH-PERSON): the name `Input` with the nickname hint, ink
  errors for empty and duplicate, one primary `actions.save`, a failed save
  keeping the name. Stories: list, add, edit, errors, failure, loading,
  RTL.
- **Done when:** Stories pass axe; AC 2, AC 3 and AC 5 are visible.

##### TASK-05-01-01-FE2 · Wire the people route and the Profile row
`frontend` · Parent: STORY-05-01-01 · 4 h · New (rev 5) · Depends on: TASK-05-01-01-FE1, TASK-05-03-01-FE2
- **Build:** `src/app/(task)/profile/people/page.tsx` with its skeleton and
  `LoadFailed`; the Profile section "People" (`profile.people`, secondary "Just
  you" or the count) per design pattern 4; actions with return-to.
- **Done when:** A profile added by one member shows to the others (AC 4).

##### TASK-05-01-01-QA1 · Test adding a profile
`qa` · Parent: STORY-05-01-01 · 4 h · New (rev 5) · Depends on: TASK-05-01-01-FE2
- **Build:** Node tests (ordering, counts, name rules, household sharing,
  isolation); play tests of the list, add and failure.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-05-01-02: Rename or remove a profile

##### TASK-05-01-02-BE1 · Add renaming and removing profiles
`backend` · Parent: STORY-05-01-02 · 4 h · New (rev 5) · Depends on: TASK-05-01-01-BE1
- **Build:** `renamePerson(id, name)` (the main persona's rename is
  `renamePersona`: one function, one place of logic); `removePerson(id)` allowed
  only for a persona with no shots (`extractions`) and no recipes
  (`pinned_recipes`), not the main one and not claimed; otherwise it returns
  the counts for the explanation. The cookie's persona falls back to the main
  one when removed (TASK-05-01-03-BE1).
- **Done when:** Unit tests cover empty, with shots, with only recipes, main
  and claimed (AC 2 to AC 5).

##### TASK-05-01-02-FE1 · Add rename and remove to the person sheet
`frontend` · Parent: STORY-05-01-02 · 4 h · New (rev 5) · Depends on: TASK-05-01-02-BE1, TASK-05-01-01-FE1
- **Build:** The sheet's edit mode shows a ghost `people.remove` only when the
  profile is empty (one `ConfirmSheet`), otherwise `people.cantRemove` with the
  counts and rename still works; the main profile has no remove. Stories.
- **Done when:** AC 1 to AC 4 hold in stories; a removed chosen profile sends
  Brew back to the main one (AC 5).

##### TASK-05-01-02-QA1 · Test renaming and removing a profile
`qa` · Parent: STORY-05-01-02 · 4 h · New (rev 5) · Depends on: TASK-05-01-02-FE1
- **Build:** Node tests of each rule and the rename shown on past shots; play
  tests of confirm, the explanation and Brew returning to the main persona.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-05-01-04: Log, taste and pin for someone else

##### TASK-05-01-04-BE1 · Carry the persona into the log, tasting and pin
`backend` · Parent: STORY-05-01-04 · 3 h · New (rev 5) · Depends on: TASK-05-01-03-BE2
- **Build:** The log context, the tasting and off contexts
  (`reaction.ts`'s `getOffContext`) and `PinPreview` return the shot's persona
  and whether the household has more than one profile, so screens can say
  "for {name}". A pin from a shot uses the shot's persona (`fromShot` already
  does); answers are saved the same way for any persona (AC 4).
- **Done when:** Unit tests show the pin is the sub persona's and the main
  persona's recipes are unchanged (AC 3).

##### TASK-05-01-04-FE1 · Say "for {name}" on the log, tasting, off sheet and pin sheet
`frontend` · Parent: STORY-05-01-04 · 4 h · New (rev 5) · Depends on: TASK-05-01-04-BE1, DES-05-01-03
- **Build:** One quiet `log.forPerson` line under the headers of `ShotLogScreen`,
  `TasteScreen`, `OffSheet` and `recipe.forPerson` in `PinSheet`, only when
  there is more than one profile. Stories with and without.
- **Done when:** With only the main persona nothing extra shows (AC 2).

##### TASK-05-01-04-QA1 · Test logging, tasting and pinning for someone else
`qa` · Parent: STORY-05-01-04 · 4 h · New (rev 5) · Depends on: TASK-05-01-04-FE1
- **Build:** Node tests: shot, one-tap pull and pin for a sub persona record the
  persona and the logger; play tests of the lines.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-05-01-05: Start someone's first dial-in from another profile's recipe

##### TASK-05-01-05-BE1 · Start from another profile's recipe
`backend` · Parent: STORY-05-01-05 · 6 h · New (rev 5) · Depends on: TASK-05-01-03-BE2, TASK-02-01-08-BE1
- **Build:** `getDialInStart` (`dialIn.ts`) order for a persona with no recipe on
  this setup: another profile's recipe for the same coffee, drink and setup (the
  main persona's if it has one, else the most recently pinned; Q4: it wins over
  the closest setup), then the closest setup's as built, then blank. Returns
  the source persona; prep, milk and sweetened come with it. `getHome` gets a
  state for it that never offers a one-tap pull; saving and pinning gives the
  persona their own recipe (AC 6).
- **Done when:** Unit tests cover the ordering, several sources, nobody having
  one (as STORY-02-01-06 and STORY-02-02-05) and the carry-over (AC 1 to AC 5).

##### TASK-05-01-05-FE1 · Show whose recipe a dial-in starts from
`frontend` · Parent: STORY-05-01-05 · 4 h · New (rev 5) · Depends on: TASK-05-01-05-BE1, TASK-05-01-03-FE1
- **Build:** Brew's no-recipe state shows `home.startsFromPerson` and only
  `home.dialIn`; the log's note names the source; stories.
- **Done when:** AC 1 and AC 3 hold in stories.

##### TASK-05-01-05-QA1 · Test starting from another profile's recipe
`qa` · Parent: STORY-05-01-05 · 4 h · New (rev 5) · Depends on: TASK-05-01-05-FE1
- **Build:** Node and play tests of the six criteria.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-05-01-06: Tell whose shots are whose in the Journal

##### TASK-05-01-06-BE1 · Add the person to the Journal reads and its filter
`backend` · Parent: STORY-05-01-06 · 5 h · New (rev 5) · Depends on: TASK-05-01-03-BE2
- **Build:** `src/server/dal/journal.ts`: `JournalShot.person` (the profile's
  name, only for a profile that isn't the viewer's main one),
  `JournalFilters.personaId`, person options in `getJournalFilterOptions` and
  the detail's `forPerson` and `loggedBy` (the logger's claimed profile, else
  the role label). `src/lib/journalFilters.ts` reads and writes the parameter.
- **Done when:** Unit tests cover the marker rule, the filter on every page
  ("show older" too) and the detail fields (AC 1 to AC 3).

##### TASK-05-01-06-FE1 · Add the person marker, the Person chip and the detail lines
`frontend` · Parent: STORY-05-01-06 · 6 h · New (rev 5) · Depends on: TASK-05-01-06-BE1, TASK-05-01-03-FE1, DES-05-01-03
- **Build:** `JournalList.tsx`: a text marker (`journal.forPerson`) among the
  existing ones; a Person chip in `FilterChips` only with more than one
  profile, defaulting to the person chosen on Brew (`AppTabBar.tsx` builds the
  Journal link as it does for drink and coffee), "All" clearing it; the
  filtered empty state offers to clear it; `app/(app)/journal/[shotId]/page.tsx`
  shows `shot.forPerson` and `shot.loggedBy` in text. With only the main
  persona nothing changes (AC 5). Stories.
- **Done when:** AC 1 to AC 5 hold in stories and play tests.

##### TASK-05-01-06-QA1 · Test the persona in the Journal
`qa` · Parent: STORY-05-01-06 · 4 h · New (rev 5) · Depends on: TASK-05-01-06-FE1
- **Build:** Node tests of marker and filter; play tests of the chip default,
  clear, empty and a single-persona household.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-05-01-07: See how a coffee's shots went for the person I'm brewing for

##### TASK-05-01-07-BE1 · Make Tried per profile
`backend` · Parent: STORY-05-01-07 · 3 h · New (rev 5) · Depends on: TASK-05-01-03-BE2, TASK-03-07-01-BE2
- **Build:** `getTried(personaId)` (`src/server/dal/tried.ts`) summarises only
  that persona's shots; `beanFacets` takes the same persona for the rating
  filter; with one persona the result is as today. A coffee only another
  persona brewed stays listed with "no ratings yet".
- **Done when:** Unit tests cover two personas with different ratings on one
  coffee.

##### TASK-05-01-07-FE1 · Say whose shots Tried describes
`frontend` · Parent: STORY-05-01-07 · 2 h · New (rev 5) · Depends on: TASK-05-01-07-BE1, DES-05-01-03
- **Build:** `app/(app)/beans/page.tsx` passes the Brew-chosen persona; when it
  isn't the main one a line under the Tried heading (`beans.triedFor`); no
  chip is added to Beans.
- **Done when:** AC 1 to AC 4 hold in stories.

##### TASK-05-01-07-QA1 · Test Tried per profile
`qa` · Parent: STORY-05-01-07 · 3 h · New (rev 5) · Depends on: TASK-05-01-07-FE1
- **Build:** Node and play tests of the summary and the rating filter following
  the chosen person, and a single-persona household unchanged.
- **Done when:** AC 1 to AC 4 are covered.

#### EPIC-05-02: Invite them to take over their own profile (revision 5, Next, sequenced last)

Design: DES-05-02-01 to 05. 25 tasks, 110 h. Needs EPIC-05-01 (profiles to
claim) and EPIC-05-03 (the Google sign-in and `isHouseholdEmpty`). Decisions in
TD-11. Built today: `household_members` (role, composite key),
`personas.user_id`, `findAccount` (first membership), `ensureAccount` /
`createAccount` in `src/server/auth/bootstrap.ts`, `users.share_data_consent`
(unused), `ConfirmSheet`, `Input`, `EmptyState`, `Notice`, `LogoWordmark`.
Prerequisites that are not tasks: Google sign-in enabled in the Firebase
project and `INVITE_SECRET` and `APP_ORIGIN` set as deployment secrets (names
only in `.env.example`).

##### STORY-05-02-01: Invite someone to my household

##### TASK-05-02-01-BE1 · Add the invites table
`backend` · Parent: STORY-05-02-01 (also 05-02-02, 05-02-03, 05-02-05, 05-02-06) · 3 h · New (rev 5) · Depends on: none
- **Build:** `src/db/schema.ts`: `invites` (`id`, `household_id`, `persona_id`,
  `created_by_user_id`, `created_at`, `expires_at`, `used_at`, `used_by_user_id`,
  `withdrawn_at`, the last three nullable), indexes on `(persona_id,
  created_at)` and `household_id`; foreign keys to the household, persona and
  users. No token or status column (TD-11). New migration; update
  `schema.test.ts`; add the table to `assertOwned` and the isolation suite
  (`src/server/__tests__/isolation.test.ts`).
- **Done when:** The migration applies; another household's invite is not
  found by an owned check.

##### TASK-05-02-01-BE2 · Create an invite link
`backend` · Parent: STORY-05-02-01 · 5 h · New (rev 5) · Depends on: TASK-05-02-01-BE1, TASK-05-01-01-BE1
- **Build:** `src/server/dal/invites.ts` `createInvite(personaId)`: the persona is
  the household's and unclaimed (`userId` null), else refused (AC 4); one
  transaction marks the profile's earlier pending invite withdrawn (AC 5) and
  inserts a row expiring in 7 days (a constant). The link is
  `APP_ORIGIN/join/<id>.<hmac>` (TD-11), built by `src/server/auth/inviteToken.ts`
  with a constant-time check; any member of the household may create one
  (AC 3). Returns the link; asks for and stores no email.
- **Done when:** Unit tests cover create, replace, claimed profile, foreign
  profile, expiry, a wrong or edited token and no secret in the output other
  than the link.

##### TASK-05-02-01-FE1 · Build the invite sheet (SH-INVITE) with its stories
`frontend` · Parent: STORY-05-02-01 · 5 h · New (rev 5) · Depends on: DES-05-02-01, DES-05-02-04
- **Build:** `src/components/people/InviteSheet.tsx`: the three plain lines of
  what a joiner shares (`invite.shares`) before any link exists, primary
  `invite.create`, then the link in a read-only `Input` (with a story added to
  `Input.stories.tsx` for the read-only field with a copy button), a copy
  button announcing "copied", `invite.share` only when `navigator.share`
  exists, `invite.valid` ("works once, for 7 days"), a failed create with a
  retry Notice. Stories: before, created, share available, failed, RTL.
- **Done when:** Stories pass axe; AC 1, AC 2 and AC 6 are visible.

##### TASK-05-02-01-FE2 · Add the invite action to the person sheet
`frontend` · Parent: STORY-05-02-01 · 3 h · New (rev 5) · Depends on: TASK-05-02-01-BE2, TASK-05-02-01-FE1, TASK-05-01-01-FE1
- **Build:** `PersonSheet`: a secondary `people.invite` for a profile with no
  login opening the invite sheet; a claimed profile shows `people.claimed` and
  nothing to invite; wired to the create action.
- **Done when:** AC 3 and AC 4 hold in stories.

##### TASK-05-02-01-QA1 · Test inviting
`qa` · Parent: STORY-05-02-01 · 4 h · New (rev 5) · Depends on: TASK-05-02-01-FE2
- **Build:** Node and play tests of the six criteria, including that the shared
  warning is shown before a link exists and the link is never emailed.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-05-02-06: See and withdraw a pending invite

##### TASK-05-02-06-BE1 · Read and withdraw pending invites
`backend` · Parent: STORY-05-02-06 · 3 h · New (rev 5) · Depends on: TASK-05-02-01-BE2
- **Build:** `getPendingInvite(personaId)` returns the link again (recomputed,
  TD-11) while pending; `withdrawInvite(personaId)` sets `withdrawn_at`;
  `listPeople` flags pending invites; used, withdrawn and expired are derived.
- **Done when:** Unit tests cover each derived state and a foreign profile.

##### TASK-05-02-06-FE1 · Show the pending state and withdraw
`frontend` · Parent: STORY-05-02-06 · 3 h · New (rev 5) · Depends on: TASK-05-02-06-BE1, TASK-05-02-01-FE2
- **Build:** The profile's row shows `people.invitePending`; its sheet shows the
  link again with copy and a ghost `invite.withdraw`; a failed withdraw keeps
  the link pending with a retry Notice.
- **Done when:** AC 1, AC 2 and AC 4 hold in stories.

##### TASK-05-02-06-QA1 · Test pending invites
`qa` · Parent: STORY-05-02-06 · 3 h · New (rev 5) · Depends on: TASK-05-02-06-FE1
- **Build:** Node tests that a withdrawn, expired or used link stops working
  (AC 3); play tests of the row, copy and withdraw.
- **Done when:** AC 1 to AC 4 are covered.

##### STORY-05-02-05: See what I'm being invited to, before signing in

##### TASK-05-02-05-BE1 · Read the invitation preview without an account
`backend` · Parent: STORY-05-02-05 · 5 h · New (rev 5) · Depends on: TASK-05-02-01-BE2
- **Build:** `src/server/dal/invitePreview.ts` `getInvitePreview(token)`: no
  session needed; verifies the token and returns the profile's name, its shot
  count, its most-made drinks and when it was last brewed for, nothing else (no
  other profile, no equipment); a used, withdrawn, expired, claimed or
  malformed token all return the same `invalid` result with no reason. It
  creates nothing.
- **Done when:** Unit tests cover each invalid reason returning the identical
  result, the data returned, and that no user or household row is created.

##### TASK-05-02-05-FE1 · Build the join screen states with their stories
`frontend` · Parent: STORY-05-02-05 (also 05-02-02, 05-02-03) · 6 h · New (rev 5) · Depends on: DES-05-02-02, DES-05-02-03, DES-05-02-04
- **Build:** `src/components/screens/JoinScreen`: the landing (`LogoWordmark`,
  `join.title`, a `Card` summary, `join.shares` lines, primary `join.signIn`,
  ghost `join.notNow`), the loading skeleton card, the invalid-link
  `EmptyState` (`join.invalidTitle`, `join.invalid`, `join.openTare`), the
  blocked notice (`join.hasHistory`) and the claim confirmation with its done
  line (built here for TASK-05-02-03-FE1). Stories for each state at 375 px and
  in RTL.
- **Done when:** Stories pass axe; every state is reachable in Storybook.

##### TASK-05-02-05-FE2 · Add the public join route
`frontend` · Parent: STORY-05-02-05 · 5 h · New (rev 5) · Depends on: TASK-05-02-05-BE1, TASK-05-02-05-FE1
- **Build:** `src/app/(public)/join/[token]/page.tsx` with its own layout:
  no `SessionGate`, no tab bar, `Referrer-Policy: no-referrer`, not indexed
  or cached, a Suspense skeleton (read the Next.js 16 guide for dynamic params
  first). The Firebase client loads only after the user chooses to continue,
  so just opening the page creates nothing. "Not now" leaves with the link
  still usable.
- **Done when:** AC 1 to AC 5 hold; a test shows opening the page writes no
  row.

##### TASK-05-02-05-QA1 · Test the invitation page
`qa` · Parent: STORY-05-02-05 · 4 h · New (rev 5) · Depends on: TASK-05-02-05-FE2
- **Build:** Node tests that the preview shows only the allowed data and no
  account is created; play tests of landing, loading, not now and every
  invalid case with identical text.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-05-02-02: Join a household from an invite

##### TASK-05-02-02-BE1 · Add the joinable check and replacing an empty account
`backend` · Parent: STORY-05-02-02 · 6 h · New (rev 5) · Depends on: TASK-05-02-05-BE1, TASK-05-03-04-BE1
- **Build:** `checkJoinable(token)` after sign-in: `ok`, `hasHistory` (the
  signed-in user's household is not empty by `isHouseholdEmpty`, so nothing is
  merged or lost, AC 5) or `invalid`; and a shared helper
  `replaceEmptyHousehold(tx, userId, toHouseholdId)` that deletes the user's
  empty household (personas, starter drinks and milks, membership, household)
  in foreign-key order and adds the new membership with role `member` (AC 4,
  AC 6). Used by the claim transaction (TASK-05-02-03-BE1); it is irreversible
  (R-31).
- **Done when:** Unit tests cover an empty account replaced, an account with
  history refused untouched, a user already in that household and the
  deletion order with foreign keys on.

##### TASK-05-02-02-FE1 · Sign in with Google from the invitation
`frontend` · Parent: STORY-05-02-02 · 6 h · New (rev 5) · Depends on: TASK-05-02-05-FE2, TASK-05-03-01-FE1, TASK-05-02-02-BE1
- **Build:** On `join.signIn`, `src/lib/firebase/google.ts`'s sign-in for joining:
  a browser with an anonymous Firebase user links Google to it, and on
  `credential-already-in-use` signs in with the credential; otherwise a plain
  Google sign-in (popup, or redirect on iOS Safari, keeping the token in
  `sessionStorage` across the redirect); then the session exchange
  (`startSession.ts`) and `checkJoinable`; success opens the claim
  confirmation, cancelling returns to the landing with the link usable.
- **Done when:** AC 1 to AC 3 hold with the Firebase client mocked; no key is in
  the repository.

##### TASK-05-02-02-FE2 · Handle the blocked and failure cases of joining
`frontend` · Parent: STORY-05-02-02 · 4 h · New (rev 5) · Depends on: TASK-05-02-02-FE1
- **Build:** `hasHistory` shows the neutral `join.hasHistory` notice (nothing
  merged, use a different Google account); a sign-in or join failure shows a
  retry Notice and joins nothing; an empty account joins without a fuss.
- **Done when:** AC 3, AC 4 and AC 5 hold in stories and play tests.

##### TASK-05-02-02-QA1 · Test joining
`qa` · Parent: STORY-05-02-02 · 5 h · New (rev 5) · Depends on: TASK-05-02-02-FE2
- **Build:** Node tests of the empty/history/same-household cases; play tests
  with mocked Firebase for cancel, failure and retry; a manual device
  checklist for popup and redirect sign-in (R-29).
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-05-02-03: Claim my profile and keep its history

##### TASK-05-02-03-BE1 · Claim a profile on confirmation
`backend` · Parent: STORY-05-02-03 · 6 h · New (rev 5) · Depends on: TASK-05-02-02-BE1, TASK-05-01-03-BE1
- **Build:** `claimInvite(token)` (action in `src/server/actions/invites.ts`): one
  immediate transaction re-verifies the token, sets the invite's `used_at`
  with a conditional update (so two claimers can't both win), replaces the
  user's empty household, adds the membership and sets the persona's `userId`;
  from then on `mainPersona` is that profile for the new member. A claim of a
  profile claimed meanwhile, or any invalid token, fails as `invalid`
  (AC 4); nothing changes before confirm (AC 2).
- **Done when:** Unit tests cover success with shots and recipes intact, a
  second concurrent claim failing, an expired or withdrawn token, an
  inviter's People list showing the profile as claimed (AC 6), and rollback
  on error.

##### TASK-05-02-03-FE1 · Wire the claim confirmation and the done state
`frontend` · Parent: STORY-05-02-03 · 5 h · New (rev 5) · Depends on: TASK-05-02-03-BE1, TASK-05-02-05-FE1, TASK-05-02-02-FE1, DES-05-02-03
- **Build:** The confirmation (`claim.title`, what happens, `claim.consent`
  "your shots stay private to this household", the sentence that it is final)
  with primary `claim.confirm` and ghost `claim.cancel`; on success land on
  Brew in the household with a polite `claim.done`; a failure keeps the
  confirmation with a retry Notice.
- **Done when:** AC 1, AC 2, AC 3 and AC 5 hold in stories and play tests.

##### TASK-05-02-03-QA1 · Test claiming a profile
`qa` · Parent: STORY-05-02-03 · 5 h · New (rev 5) · Depends on: TASK-05-02-03-FE1
- **Build:** Node tests of the full path (invite, join, claim, history intact,
  main persona resolution, no re-invite); a concurrent-claim test; play tests
  of confirm, cancel and the final wording.
- **Done when:** AC 1 to AC 6 are covered.

##### STORY-05-02-04: My shots follow my own consent

##### TASK-05-02-04-BE1 · Add the network-eligibility rule for claimed profiles
`backend` · Parent: STORY-05-02-04 · 3 h · New (rev 5) · Depends on: TASK-05-02-03-BE1
- **Build:** `src/domain/networkEligibility.ts` (pure): a shot is eligible only
  if it is measured, has the full payload, its persona is claimed and that
  user's `shareDataConsent` is true; never for an unclaimed profile, whoever
  logged it. Production code still writes `is_network_eligible` false (X-3);
  a test scans the writers to keep it so.
- **Done when:** Unit tests cover each combination (AC 1, AC 2).

##### TASK-05-02-04-QA1 · Test consent
`qa` · Parent: STORY-05-02-04 · 3 h · New (rev 5) · Depends on: TASK-05-02-04-BE1, TASK-05-02-03-FE1
- **Build:** Node tests of the rule and the writer scan; a play test that the
  claim confirmation says shots stay private to the household.
- **Done when:** AC 1 to AC 3 are covered.

##### STORY-05-02-07: Leave a household

##### TASK-05-02-07-BE1 · Factor household creation out of the account bootstrap
`backend` · Parent: STORY-05-02-07 · 3 h · New (rev 5) · Depends on: none
- **Build:** `src/server/auth/bootstrap.ts`: `createAccount` is split so the
  household, owner membership, default persona, starter drinks and milks are one
  reusable function `createHousehold(tx, userId, now)`; `ensureAccount`
  behaves exactly as before.
- **Done when:** The bootstrap tests (`bootstrap.test.ts`,
  `bootstrap-rollback.test.ts`, `bootstrap-milk-rollback.test.ts`) pass
  unchanged.

##### TASK-05-02-07-BE2 · Leave a household
`backend` · Parent: STORY-05-02-07 · 5 h · New (rev 5) · Depends on: TASK-05-02-07-BE1, TASK-05-02-03-BE1
- **Build:** `leaveHousehold()` (action and DAL): in one immediate transaction,
  the leaver's persona `userId` becomes null (it stays, with every shot and
  recipe, as an unclaimed profile that anyone can invite again, AC 2, AC 3,
  AC 6), the membership row is removed, and a new household is created for the
  user with `createHousehold`. If the leaver was the household's only owner
  and members remain, the longest-standing member becomes owner (9.3,
  question 2). The session is unaffected (the uid is the same); device cookies
  naming the old household's persona or setup fall back through their
  existing validation.
- **Done when:** Unit tests cover leaving as a member, as an owner with
  others remaining, as the last member, nothing deleted, the new household
  being empty with starter lists, and a failure changing nothing.

##### TASK-05-02-07-FE1 · Add "leave this household" to the account section
`frontend` · Parent: STORY-05-02-07 · 5 h · New (rev 5) · Depends on: TASK-05-02-07-BE2, TASK-05-03-01-FE2, DES-05-02-05
- **Build:** In Profile's Account section, a ghost action for a member who
  claimed a profile (shown only in a household with more than one login, 9.3
  question 1); one `ConfirmSheet` with the plain statement of what happens
  (profile and history stay, you start a new empty household); after leaving,
  Brew shows the first-run checklist of the new household; cancel or failure
  changes nothing.
- **Done when:** AC 1, AC 4 and AC 5 hold in stories and play tests.

##### TASK-05-02-07-QA1 · Test leaving a household
`qa` · Parent: STORY-05-02-07 · 5 h · New (rev 5) · Depends on: TASK-05-02-07-FE1
- **Build:** Node tests of the six criteria across two logins (the former
  household keeps everything, the leaver sees only an empty one, the old
  profile can be invited again); play tests of the confirmation and cancel.
- **Done when:** AC 1 to AC 6 are covered.

#### EPIC-05-03: Keep your coffee history when you change phones (revision 5, Next)

Design: DES-05-03-01 to 03. 15 tasks, 59 h. The first Next epic after the
sweetened change. Decisions in TD-11. Built today: `src/lib/firebase/client.ts`
(`ensureSignedIn`, anonymous), `/api/session` and `ensureAccount`,
`startSession.ts`, `ProfileScreen` / `ProfileFlow` (name, a device sentence,
about), `Checklist`, `getSetupProgress`, `ConfirmSheet`. Prerequisites that are
not tasks: Google sign-in enabled in the Firebase project and its authorised
domains set; the keys stay deployment secrets. The Google button look is
checked against Google's current guidelines before FE2 (DQ-40a).

##### STORY-05-03-01: Link my account to Google

##### TASK-05-03-01-FE1 · Add Google linking to the Firebase client
`frontend` · Parent: STORY-05-03-01 · 5 h · New (rev 5) · Depends on: none
- **Build:** `src/lib/firebase/google.ts` beside `client.ts` (export
  `firebaseAuth`): `linkGoogle()` using `linkWithPopup`, or `linkWithRedirect`
  with `getRedirectResult` on iOS Safari; returns `linked`, `cancelled`,
  `failed` or `accountTaken` (carrying the credential for the switch path,
  TASK-05-03-04-FE2). The Firebase uid does not change on a link, so no new
  session is needed. Nothing from the Google profile is read or kept.
- **Done when:** Unit tests with `firebase/auth` mocked cover each result,
  offline and the redirect return.

##### TASK-05-03-01-BE1 · Read whether the account is linked
`backend` · Parent: STORY-05-03-01 · 3 h · New (rev 5) · Depends on: none
- **Build:** `src/server/auth/linked.ts` `isLinkedToGoogle()`: asks Firebase
  Admin (`adminAuth().getUser(uid)`) for the sign-in providers only; any
  failure reads as "not linked, unknown" and never blocks the page.
- **Done when:** Unit tests cover linked, anonymous and an admin error.

##### TASK-05-03-01-FE2 · Build the account section of Profile
`frontend` · Parent: STORY-05-03-01 · 5 h · New (rev 5) · Depends on: TASK-05-03-01-BE1, TASK-05-03-01-FE1, DES-05-03-01
- **Build:** `ProfileScreen.tsx` / `ProfileFlow.tsx` are restructured into the
  sections of design pattern 4 (name, Account, About; People and Your lists
  are added by their epics): the Account section replaces the device
  sentence with `profile.accountTitle`, the plain sentence and a plain text
  Button `profile.linkGoogle` (no logo, no colour); busy while linking;
  `profile.linked` and `profile.linkedBody` once linked; cancelled returns
  silently; failed shows `profile.linkFailed` with retry; no unlink or
  sign-out. Stories for each state, RTL.
- **Done when:** Stories pass axe; AC 1, AC 3, AC 4 and AC 5 are visible (AC 2's
  data claim is tested in TASK-05-03-01-QA1); the profile's label
  is unchanged.

##### TASK-05-03-01-QA1 · Test linking a Google account
`qa` · Parent: STORY-05-03-01 · 4 h · New (rev 5) · Depends on: TASK-05-03-01-FE2
- **Build:** Play tests with Firebase mocked (link, cancel, fail, offline);
  a Node check that data and uid are unchanged after a link; a manual device
  checklist (desktop, iOS Safari).
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-05-03-04: Keep two histories apart

##### TASK-05-03-04-BE1 · Add the "nothing entered yet" test
`backend` · Parent: STORY-05-03-04 (also 05-03-02, 05-03-03, 05-02-02) · 3 h · New (rev 5) · Depends on: none
- **Build:** `src/server/dal/emptiness.ts` `isHouseholdEmpty(db, householdId)`:
  true when the household has no `owned_hardware`, no `batches` and no
  `extractions`; the starter drinks, milks and profile do not count. One
  function for the switch, the first-run link and joining.
- **Done when:** Unit tests cover empty, each kind of entry alone, and starter
  lists only.

##### TASK-05-03-04-BE2 · Check that this device can switch to the linked history
`backend` · Parent: STORY-05-03-04 · 5 h · New (rev 5) · Depends on: TASK-05-03-04-BE1
- **Build:** `canSwitchHistoryAction()` (and the DAL call) answers for the
  signed-in session's household: empty means the switch is allowed. After the
  client signs in with the other account's credential, the existing session
  exchange (`/api/session`) finds the other history by its uid. The old,
  empty anonymous account is left unreferenced; no clean-up in this epic
  (R-32).
- **Done when:** Tests cover empty and non-empty households and the exchange
  landing on the existing account; nothing is merged.

##### TASK-05-03-04-FE1 · Build the switch confirmation (SH-SWITCH)
`frontend` · Parent: STORY-05-03-04 · 3 h · New (rev 5) · Depends on: DES-05-03-02
- **Build:** `src/components/account/SwitchSheet.tsx` on `ConfirmSheet`:
  `switch.title`, primary `switch.confirm`, ghost `actions.cancel`; a failed
  switch keeps it with a retry Notice. Stories, RTL.
- **Done when:** Stories pass axe.

##### TASK-05-03-04-FE2 · Handle an account that already has a history
`frontend` · Parent: STORY-05-03-04 · 5 h · New (rev 5) · Depends on: TASK-05-03-04-BE2, TASK-05-03-04-FE1, TASK-05-03-01-FE2
- **Build:** When linking returns `accountTaken`: an empty device opens the
  switch sheet, and on confirm signs in with the credential, runs the session
  exchange and refreshes to Brew with `switch.done`; a device with history
  shows the neutral `profile.linkTaken` notice and changes nothing; decline
  changes nothing; a failure or being offline says so and changes nothing.
- **Done when:** AC 1 to AC 5 hold in play tests with Firebase mocked.

##### TASK-05-03-04-QA1 · Test keeping two histories apart
`qa` · Parent: STORY-05-03-04 · 5 h · New (rev 5) · Depends on: TASK-05-03-04-FE2
- **Build:** Node tests of the empty rule and the account landing; play tests of
  the switch, decline, refusal, failure and offline; a manual two-device
  checklist.
- **Done when:** AC 1 to AC 5 are covered.

##### STORY-05-03-02: Reach my history on another phone

##### TASK-05-03-02-FE1 · Add "already use Tare? Sign in with Google" to first-run Brew
`frontend` · Parent: STORY-05-03-02 · 4 h · New (rev 5) · Depends on: TASK-05-03-04-FE2, TASK-05-03-04-BE1, DES-05-03-03
- **Build:** A quiet ghost link `home.firstRun.haveAccount` under the `Checklist`
  on Brew, shown only while the household is empty (the checklist's own
  condition, from `getSetupProgress` / `isHouseholdEmpty`); it runs the same
  link-or-switch flow as Profile (link first, so an unused Google account
  becomes this device's account and a used one offers the switch). The start
  screen is unchanged and offers no sign-in. Stories.
- **Done when:** AC 3 and AC 6 hold; nothing stands between a new user and
  starting.

##### TASK-05-03-02-QA1 · Test reaching a history on another phone
`qa` · Parent: STORY-05-03-02 · 4 h · New (rev 5) · Depends on: TASK-05-03-02-FE1
- **Build:** Play tests that a first-time user gets an account with no sign-in
  choice and without waiting (AC 4), the link's presence and absence (AC 3,
  AC 6), the same link in Profile after storage is cleared (AC 5), and the
  switch landing on the full history (AC 1, AC 2, AC 7).
- **Done when:** AC 1 to AC 7 are covered.

##### STORY-05-03-03: Be reminded once to keep my history safe

##### TASK-05-03-03-BE1 · Add the history-worth-keeping trigger
`backend` · Parent: STORY-05-03-03 · 3 h · New (rev 5) · Depends on: TASK-05-03-01-BE1
- **Build:** `getLinkPromptDue()`: not linked, and either a pinned recipe exists or
  the household has logged ten shots; returns a boolean only.
- **Done when:** Unit tests cover the first recipe, the tenth shot, either first
  and already linked.

##### TASK-05-03-03-FE1 · Build the link prompt card
`frontend` · Parent: STORY-05-03-03 · 3 h · New (rev 5) · Depends on: DES-05-03-01, DES-05-03-03
- **Build:** `src/components/home/LinkPromptCard.tsx`: an outline `Card`,
  `home.linkPrompt.title`, one sentence, a secondary `home.linkPrompt.action`,
  a ghost `home.linkPrompt.dismiss`. Stories: shown, at 375 x 667 with the Pull
  button visible, RTL.
- **Done when:** Stories pass axe.

##### TASK-05-03-03-FE2 · Show the prompt on Brew with the one-card rule
`frontend` · Parent: STORY-05-03-03 · 4 h · New (rev 5) · Depends on: TASK-05-03-03-BE1, TASK-05-03-03-FE1, TASK-05-03-01-FE1
- **Build:** `HomeScreen.tsx` / `BrewFlow.tsx`: the prompt shows only when due,
  not dismissed, not linked, no re-dial card is due (that one wins,
  TASK-04-03-04-FE2) and no pulled state is showing; "not now" is remembered
  on the device for good (`src/lib/dismissals.ts` pattern); accepting runs the
  linking flow.
- **Done when:** AC 1 to AC 5 hold in play tests; the Pull button stays visible.

##### TASK-05-03-03-QA1 · Test the one-time reminder
`qa` · Parent: STORY-05-03-03 · 3 h · New (rev 5) · Depends on: TASK-05-03-03-FE2
- **Build:** Play tests of the trigger points, dismissal for good, the one-card
  rule with a re-dial card and the pulled state, and accepting.
- **Done when:** AC 1 to AC 5 are covered.

---

## 8. Build order, Milestone 1 and design schedule

Dependencies come first. Within that, the order follows the epics' MVP
build order. **Milestone 1 comes first** (section 8.1), then the rest of the
MVP in waves (section 8.3). Design tasks are scheduled in section 8.2.

### 8.1 Milestone 1: the lean walking skeleton

S-02 defines Milestone 1: start brewing, describe your setup (one setup, from
a seeded catalog), add a bag of beans, log a shot, and look back at shots in
the Journal.

**Prerequisites (not tasks):**

- **A Firebase project**, with its service-account keys stored as deployment
  secrets outside the repo. Needed before TASK-01-01-01-BE4 can be tested
  against a real token.
- **PR #3 merged** (`PR-3`).
- **The Head of Product's equipment and coffee details**, for
  TASK-01-02-01-BE6.

**Totals: 99 tasks, 368 hours.** The Head of Product's rough estimate was
about 370 hours (S-02), so this matches it. Reasons:

- The five epics in full are 137 tasks and 493 hours (revision 4 added
  TASK-01-02-04-BE3 and 1 h on the edit mode). Milestone 1 defers 42
  tasks and 137 hours (the profile screen, the first-run checklist, the part
  screen, the edit mode and the rest in the table below).
- The schema is built whole in Milestone 1 (13 tasks, 36 hours), so the
  later features add no migrations.
- Four tasks from other epics are pulled in (12 hours), and one new task
  (TASK-01-02-01-BE6, 6 hours) prepares the seed data.
- Hours of trimmed tasks are kept at full size (see "Trims" below), so the
  total is slightly conservative.

| Epic | Tasks | Hours |
|---|---|---|
| EPIC-01-01 Start brewing without setting anything up | 30 | 114 |
| EPIC-01-02 Describe your setup once | 24 | 98 |
| EPIC-01-03 Log a shot in seconds | 17 | 60 |
| EPIC-03-01 Add a bag of beans | 16 | 60 |
| EPIC-02-06 Look back in your journal | 8 | 24 |
| Pulled in from other epics | 4 | 12 |
| **Milestone 1** | **99** | **368** |

Design work for Milestone 1 is 144 hours (section 8.2). Revision 4 leaves
Milestone 1 at 99 tasks and 368 hours.

All 99 tasks depend only on Milestone 1 tasks, PR-3, or the Head of
Product's prerequisites. The references to TQ-08 and TQ-09 are resolved as
working assumptions (section 9.1).

#### In Milestone 1

**EPIC-01-01 (30 tasks, 114 h)**

- STORY-01-01-01: BE1, BE2, QA1 (schema), BE3, BE4, BE5, FE1, FE2, QA2.
- STORY-01-01-02: BE1, BE2, FE1, QA1.
- STORY-01-01-03: FE1 only (the Input placeholder contrast fix, which the bag
  form TASK-03-01-02-FE1 needs for axe).
- STORY-01-01-04: QA1 (test project), BE1, QA2.
- STORY-01-01-05: FE1, FE2, FE3, FE4, FE5, FE7, QA1.
- STORY-01-01-06: FE1, FE2, FE3, FE4, QA1.
- STORY-01-01-08: BE1 only (the milk table, because the shots table refers to
  it).

**EPIC-01-02 (24 tasks, 98 h)**

- STORY-01-02-01: BE1, BE2 (schema), BE3, BE4, BE5, BE6 (new), FE1, FE2, QA1.
- STORY-01-02-02: BE1 (schema), BE2, FE1, FE2, FE3, FE4, QA1.
- STORY-01-02-04: BE2 (schema), BE1, FE1, FE2, QA1.
- STORY-01-02-05: BE1, FE1, QA1.

**EPIC-01-03 (17 tasks, 60 h)**

- STORY-01-03-01: BE1, FE1, FE2, QA1.
- STORY-01-03-02: FE1, FE2, BE1, FE3, QA1.
- STORY-01-03-03: BE1 (schema), BE2, FE1, QA1.
- STORY-01-03-04: FE1, QA1.
- STORY-01-03-05: FE1, QA1.

**EPIC-03-01 (16 tasks, 60 h)**

- STORY-03-01-01: BE1 (schema), BE2, BE3, FE1, QA1.
- STORY-03-01-02: BE1 (schema), BE2, FE1, FE2, QA1.
- STORY-03-01-03: QA1.
- STORY-03-01-04: BE1, FE1, FE2, FE3, QA1.

**EPIC-02-06 (8 tasks, 24 h)**

- STORY-02-06-01: BE2, BE1, FE1, QA1.
- STORY-02-06-03: BE1, FE1, FE2, QA1.

**Pulled in from other epics (4 tasks, 12 h)**

| Task | Hours | Why Milestone 1 needs it |
|---|---|---|
| TASK-01-06-01-BE1 (URL normalisation) | 5 | The seed loader computes `normalized_url` |
| TASK-02-01-01-BE1 (pinned recipes table) | 2 | The schema is built whole and `TASK-01-01-01-QA1` checks all of it |
| TASK-04-01-01-BE1 (maintenance events table) | 2 | Same |
| TASK-03-02-04-BE1 (portion state and `isOpen`) | 3 | Beans, the shot log and the Journal read portion state |

#### Trims inside Milestone 1

Each trimmed task keeps its full hours, as above.

- **One setup until wave 6 (revision 4).** The household can have only one
  setup, so the only setup is current. `resolveSetup` (TASK-01-02-04-BE1)
  creates a setup only when the household has none, and the builder is
  reached only from the no-setup paths (the log's missing-setup path and the
  setup offers); there is no entry to a second setup. There is no cookie and
  TASK-01-02-09-BE1 isn't built; a small `defaultSetupId` inside
  TASK-01-03-01-BE1 returns the only setup. The log's setup field is
  read-only. The Setup tab lists the setup with no marker, and its rows
  aren't tappable (the part screen, TASK-01-02-02-FE5 and FE6, is deferred).
  The new TASK-01-02-04-BE3 (wave 6) lifts the limit together with
  TASK-01-02-09-BE1. The setup builder (TASK-01-02-04-*) and the one-tap first
  setup (TASK-01-02-05-*) are kept, because the first setup has to be made.
- **Starting values in the log.** Starting drink: the drink of the persona's
  latest shot, else the first visible drink (espresso). Starting coffee: the
  latest shot's portion if it isn't finished or frozen; else the open
  portion opened earliest (`isOpen`); else the newest unopened portion.
  TASK-01-03-01-BE1 and FE2 use these instead of Brew's choices.
- **Seeded catalog.** The picker's "can't find" row (TASK-01-02-01-FE1,
  TASK-03-01-01-FE1) isn't shown, and the picker shows its no-match Notice
  without an add action. `catalog.addedByYou` markers are not needed.
- **No milk.** TASK-01-01-01-BE5 creates the user, household, persona and
  nine drinks, but no milks; TASK-01-01-08-BE2 adds them to the bootstrap in
  wave 6. TASK-01-01-01-QA2 drops the milk checks, and TASK-01-01-08-QA1
  takes them. Starter drinks keep their typical milk amounts, which nothing
  reads yet. The log, Journal and detail show no milk.
- **No puck prep.** The log has no prep toggles, and
  TASK-01-03-03-BE2 doesn't read them (the columns exist and default to
  false).
- **No tasting.** Saving a shot (TASK-01-03-03-FE1) returns to Brew. The
  Journal rows and shot detail (TASK-02-06-01-FE1, TASK-02-06-03-FE1) leave
  out the channelling warning and the reaction; the new
  TASK-02-06-01-FE2 and TASK-02-06-03-FE3 add them in wave 9. **The shot
  detail is read-only in Milestone 1 (revision 4):** it has no edit, pin or
  "dial in from this" action, so no tab has a dead action. Each is added by
  the task that delivers its target: edit by TASK-02-06-02-FE1 (wave 9, the
  edit mode, wholly deferred), pin by TASK-02-01-01-FE2 (wave 11a) and dial in
  by TASK-02-06-06-FE1 (wave 13). Each of these depends on the detail route
  (TASK-02-06-03-FE2).
- **Brew is the interim screen.** EPIC-02-02 isn't in Milestone 1. Brew is a
  plain screen with one "log a shot" action: TASK-01-01-05-FE3 builds the
  screen and TASK-01-03-01-FE2 wires the action to `/log` in wave 4. No
  checklist and no persona label. The first-run checklist (STORY-01-01-07)
  and the profile screen are deferred. STORY-01-01-07 AC 5 ("my daily shot
  shows instead") completes with TASK-02-02-01-FE1.
- **No clocks, grouping or remaining coffee.** Beans shows bags and portions
  with their state, but no clocks, groups or remaining weight. The
  `isOpen` rule is in place from the start.
- **Seed loader and content.** TASK-01-02-01-BE3 builds the loader and runs
  it on placeholder content. BE6 supplies the real content, which the
  loader reads unchanged. BE6 depends on BE3 and TASK-03-01-01-BE2, never
  the other way.

**Skipped in Milestone 1.** These QA tasks skip some criteria until the
feature they test lands.

| QA task | Skipped criteria | Re-tested in |
|---|---|---|
| TASK-01-03-01-QA1 | AC 1 and AC 4 | wave 11a (TASK-02-02-01-QA1) and wave 10 (TASK-03-02-02-QA1) |
| TASK-01-02-01-QA1 | AC 6 (private entries) | wave 7 (TASK-01-06-03-QA1) |
| TASK-02-06-01-QA1 | reaction and warning markers | wave 9 |
| TASK-02-06-03-QA1 | reaction and warning; the actions of AC 3 and AC 4 (edit, pin, dial in) | wave 9 (reaction, warning, edit), wave 11a (pin), wave 13 (dial in) |
| TASK-01-02-02-QA1 | part-screen criteria | wave 6 |
| TASK-01-01-01-QA2 | milk checks | wave 6 |
| TASK-03-01-03-QA1 | AC 4 | wave 10 |
| TASK-01-02-04-QA1 | STORY-01-02-04 AC 3 (reuse), AC 2's `existing` case, AC 6 with more than one setup | wave 6 (TASK-01-02-09-QA1) |
| TASK-01-01-05-QA1 | AC 4's "a setup from the checklist" | wave 11a (TASK-01-01-07-QA1) |
| TASK-01-02-02-QA1 | "from the checklist it continues" (TASK-01-02-02-FE4) | wave 11a (TASK-01-01-07-QA1) |
| TASK-01-02-05-QA1 | "in checklist step 1" (TASK-01-02-05-FE1) | wave 11a (TASK-01-01-07-QA1) |

#### Deferred after Milestone 1, inside the five epics (42 tasks, 137 h)

| Epic | Story | Tasks | Hours |
|---|---|---|---|
| EPIC-01-01 | STORY-01-01-03 (profile, except the Input fix) | BE1, FE2, FE3, QA1 | 13 |
| EPIC-01-01 | STORY-01-01-07 (first-run checklist) | FE1, BE1, FE2, QA1 | 12 |
| EPIC-01-01 | STORY-01-01-08 (milk list) | BE2, FE1, QA1 | 6 |
| EPIC-01-02 | STORY-01-02-02 (part screen and route) | FE5, FE6 | 8 |
| EPIC-01-02 | STORY-01-02-08 (change a part) | BE1, FE1, QA1 | 10 |
| EPIC-01-02 | STORY-01-02-09 (current setup, setup cards) | BE1, BE2, FE1, QA1 | 15 |
| EPIC-01-03 | STORY-01-03-06 (puck prep) | BE1, FE1, QA1 | 9 |
| EPIC-01-03 | STORY-01-03-07 (milk in the log) | BE1, FE1, FE2, QA1 | 14 |
| EPIC-01-02 | STORY-01-02-04 (lift the one-setup limit, revision 4) | BE3 | 2 |
| EPIC-02-06 | STORY-02-06-02 (edit mode) | BE1, FE1, QA1 | 15 |
| EPIC-02-06 | TASK-02-06-01-FE2, TASK-02-06-03-FE3 (new markers) | FE2, FE3 | 4 |
| EPIC-02-06 | STORY-02-06-04 (Journal filters) | BE1, FE1, FE2, QA1 | 14 |
| EPIC-02-06 | STORY-02-06-05 (open the Journal on what I'm brewing) | FE1, QA1 | 5 |
| EPIC-02-06 | STORY-02-06-06 (dial in from a past shot) | BE1, FE1, QA1 | 10 |
| **Total** | | **42 tasks** | **137 h** |

EPIC-03-01 has nothing deferred. Everything else in the MVP (the other 11
epics, and EPIC-01-06's catalog additions) follows in section 8.3.

#### Levers still unapplied

If Milestone 1 needs to shrink further, these can move out without breaking
the loop. They save about 17 hours in all. This plan doesn't apply them,
because each changes a story's scope.

| Lever | Tasks | Saves |
|---|---|---|
| Local number format work | STORY-01-03-05 (2 tasks) | 6 h |
| Bag-ready check | TASK-03-01-03-QA1 | 3 h |
| Sweetened mark | STORY-01-03-04 (2 tasks) | 4 h |
| One-tap first setup and builder polish: keep the offer, drop the builder's name field and match line | part of STORY-01-02-04 | about 4 h |

### 8.2 Design schedule (review M7)

Design tasks (328 h for the MVP, 61 tasks, from design section 9) are slotted
ahead of the build waves that need them, using section 8.3's wave numbers.
Tasks PR #3 already delivers (DES-01-01-03, DES-01-03-02, DES-01-03-04) are
"likely done"; check them before scheduling.

| Needed before | Design tasks | Hours |
|---|---|---|
| Wave 1 | DES-01-01-01, 02, 03, 04, 05, 06 (30), plus DES-01-02-05 (8) and DES-01-05-03 (4) | 42 |
| Wave 2 | DES-01-02-01, 02, 03, 04, 06 | 31 |
| Wave 3 | DES-03-01-01, 02, 03 | 20 |
| Wave 4 | DES-01-03-01, 02, 03, 04, 05 | 35 |
| Wave 5 | DES-02-06-01, 02 | 16 |
| **Milestone 1** | | **144** |
| Wave 7 | DES-01-06-01 to 05 | 29 |
| Wave 8 | DES-01-04-01, 02, plus DES-01-03-06 (milk, 8) | 18 |
| Wave 9 | DES-01-05-01, 02, 04, 05, plus DES-02-06-03 (edit mode, 4) | 26 |
| Wave 10 | DES-03-02-*, DES-03-03-01, DES-03-04-* | 21 |
| Wave 11a | DES-02-01-01 to 04, DES-02-02-01, 02, 03, 04 (checklist) | 41 |
| Wave 11b | DES-02-01-05 (closest-setup dial-in), DES-02-02-05 (choosing) | 8 |
| Wave 12 | DES-02-03-01 to 05 | 27 |
| Wave 14 | DES-03-01-04 (coffee screen) | 6 |
| Wave 15 | DES-04-01-01, 02 | 8 |
| **MVP** | | **328** |

Notes:

- Waves 6, 12b and 13 need no new design (wave 6's profile uses DES-01-01-04,
  delivered before wave 1; wave 12b uses wave 10's DES-03-03-01 and
  DES-03-04-01).
- Wave 3's DES-03-01-02 includes Beans' Tried section and grouping, even
  though Milestone 1 builds only On hand. The designer does the whole screen
  once.
- DES-01-02-06 (setup select) is used in wave 11b for switching; its
  first-setup shortcut part is needed in wave 2.
- With one designer, design runs about one wave ahead of the developers. The
  critical design path for Milestone 1 is DES-01-02-* and DES-01-03-* (74 h).

### 8.3 Waves

**Wave 0: before any task.**

- PR #3 is merged.
- A Firebase project exists, with its keys stored as deployment secrets.
- The Head of Product's equipment and coffee list for the seed is ready.
- The first design tasks from section 8.2 are delivered.

**Milestone 1**

**Wave 1: schema, test harness and accounts.**

1. TASK-01-01-01-BE1, TASK-01-01-04-QA1, TASK-01-01-01-BE2,
   TASK-01-01-02-BE1, TASK-01-01-08-BE1, TASK-01-02-01-BE1,
   TASK-03-01-01-BE1, TASK-01-02-01-BE2, TASK-01-02-02-BE1,
   TASK-01-02-04-BE2, TASK-03-01-02-BE1, TASK-01-03-03-BE1,
   TASK-02-01-01-BE1, TASK-04-01-01-BE1, TASK-01-01-01-QA1 (sequential).
2. Backend track: TASK-01-01-01-BE3, BE4, TASK-01-01-02-BE2,
   TASK-01-01-01-BE5, TASK-01-01-04-BE1, TASK-01-01-04-QA2,
   TASK-03-02-04-BE1, TASK-01-06-01-BE1, TASK-02-06-01-BE2.
3. Frontend track: TASK-01-01-05-FE1, TASK-01-01-06-FE1, FE2, FE3,
   TASK-01-01-05-FE2, TASK-01-01-01-FE1, TASK-01-01-05-FE7, FE3,
   TASK-01-01-01-FE2, QA2, TASK-01-01-02-FE1, QA1, TASK-01-01-05-FE4, FE5,
   QA1, TASK-01-01-06-FE4, QA1, TASK-01-01-03-FE1.

**Wave 2: setup from a seeded catalog.**

1. Catalog: TASK-01-02-01-BE5, BE3, TASK-03-01-01-BE2 (moved from wave 3;
   BE6 needs it), then TASK-01-02-01-BE6, BE4, FE1, FE2, QA1.
2. Parts: TASK-01-02-02-BE2, FE3, FE1, FE2, FE4, QA1.
3. Setup: TASK-01-02-04-BE1, FE1, FE2, QA1; TASK-01-02-05-BE1, FE1, QA1.

**Wave 3: beans.**

1. Coffee: TASK-03-01-01-BE3, FE1, QA1 (BE2 is in wave 2).
2. Bag: TASK-03-01-02-BE2, FE1, FE2, QA1.
3. Beans list: TASK-03-01-04-BE1, FE1, FE2, FE3, QA1.

**Wave 4: the shot log.**

1. Context: TASK-01-03-01-BE1, TASK-01-03-01-FE1, FE2, QA1.
2. Values: TASK-01-03-02-FE1, FE2, BE1, FE3, QA1.
3. Saving: TASK-01-03-03-BE2, FE1, QA1.
4. Sweetened and formats: TASK-01-03-04-FE1, QA1, TASK-01-03-05-FE1, QA1.
5. Bag-ready check: TASK-03-01-03-QA1 (AC 1 to AC 3).

**Wave 5: the Journal. Milestone 1 ends here.**

1. List: TASK-02-06-01-BE1, FE1, QA1.
2. Detail: TASK-02-06-03-BE1, FE1, FE2, QA1.

After Milestone 1, the actual build pace is measured and the rest of the MVP
is re-forecast from it (S-02). The waves below are the current order.

**Rest of the MVP**

**Wave 6: milk list, the current setup, the part screen and the profile.**

1. Milk: TASK-01-01-08-BE2 (adds milks to the bootstrap), FE1, QA1 (with
   the milk checks TASK-01-01-01-QA2 skips). Milks are seeded for new
   households only.
2. Setups: TASK-01-02-09-BE1 (replaces the only-setup default),
   then TASK-01-02-04-BE3 (lifts the one-setup limit), then
   TASK-01-02-09-BE2, FE1, QA1 (which re-tests the setup builder criteria
   TASK-01-02-04-QA1 skipped); TASK-01-02-08-BE1, FE1, QA1.
3. Part screen: TASK-01-02-02-FE5, FE6; then re-test the part-screen
   criteria of TASK-01-02-02-QA1.
4. Profile (moved from wave 11; nothing in its dependencies ties it to Brew):
   TASK-01-01-03-BE1, FE2, FE3, QA1. FE3 adds the persona label to the
   interim Brew screen (TASK-01-01-05-FE3, now declared), and
   TASK-02-02-01-FE1 in wave 11a keeps it.

**Wave 7: catalog additions (EPIC-01-06).** Can run in parallel with waves 8
and 9.

1. TASK-01-06-03-BE1, TASK-01-06-04-BE1, then TASK-01-06-01-BE2, FE1, FE2,
   FE3, QA1; TASK-01-06-04-FE1, QA1; TASK-01-06-03-QA1.
2. Coffee: TASK-01-06-02-BE1, FE1, QA1; TASK-01-06-05-BE1, FE1, QA1.
3. Capability questions: TASK-01-06-06-BE1, FE1, QA1; TASK-01-06-07-BE1, FE1,
   QA1; TASK-01-06-09-BE1, FE1; TASK-01-06-08-BE1 (a domain module that depends
   only on the wave 1 schema and DQ-11) can run here, and its FE1, FE2 and
   QA1 wait for wave 8; TASK-01-06-09-FE2 and QA1 wait for the edit mode.

**Wave 8: temperature, pressure, prep and milk in the log.**

1. TASK-01-04-01-FE1, FE2, BE1, FE3, QA1; TASK-01-04-02-BE1, FE1, QA1.
2. Prep: TASK-01-03-06-BE1, FE1, QA1.
3. Milk: TASK-01-03-07-BE1, FE1, FE2, QA1.
4. Fallbacks: TASK-01-06-08-FE1, FE2, QA1 (BE1 can already be done in
   wave 7).

**Wave 9: tasting (EPIC-01-05).**

1. TASK-01-05-03-BE1; TASK-01-05-01-FE1, FE2, BE1, FE3, QA1.
2. TASK-01-05-02-FE1, FE2, QA1; TASK-01-05-03-FE1, QA1.
3. TASK-01-05-04-FE1, FE2, QA1.
4. Add the warning and reaction to the Journal and the shot detail
   (TASK-02-06-01-FE2, TASK-02-06-03-FE3, then re-run the skipped checks in
   TASK-02-06-01-QA1 and TASK-02-06-03-QA1); then the edit mode, deferred
   from Milestone 1 (TASK-02-06-02-BE1, FE1, QA1); then TASK-01-06-09-FE2
   and QA1.

**Wave 10: portions, clocks and remaining coffee.**

1. TASK-03-04-01-BE1 (moved earlier for splitting).
   Grind periods (backend): TASK-04-01-01-BE2, TASK-04-01-03-BE1. This moves
   these two out of wave 15 and departs from the epics' order for them
   only, in line with the epics' reason ("grind periods right from the first
   shots"). The suggestion rules (TASK-02-03-06-BE1, BE2) depend on them.
2. Freeze and thaw: TASK-03-02-02-BE1, FE1, FE2, QA1; open and finish:
   TASK-03-02-03-BE1, QA1; split: TASK-03-02-01-BE1, FE1, QA1.
3. TASK-03-02-04-FE1, QA1; grouping: TASK-03-02-05-BE1, FE1, QA1.
4. Clocks (backend halves; the screens are in wave 12b): TASK-03-03-01-BE1;
   TASK-03-03-04-BE1; TASK-03-03-03-BE1. TASK-02-03-05-BE1 takes the
   clocks as inputs and depends on TASK-03-03-01-BE1 and
   TASK-03-03-04-BE1.
5. Remaining: TASK-03-04-01-FE1; TASK-03-04-02-BE1, FE1, QA1;
   TASK-03-04-03-BE1, FE1, QA1.

**Wave 11a: recipes, the checklist, Brew and the pull (EPIC-02-01,
EPIC-02-02).** Wave 11 was split in revision 4 (it was about 198 h).

1. Recipes: TASK-02-01-01-BE2, BE3, FE1, FE2, QA1 (FE2 adds the pin to the
   shot detail); TASK-02-01-02-BE1, FE1, QA1; TASK-02-01-03-QA1;
   TASK-02-01-06-BE1 (the closest-setup rule, pulled forward because the pull
   in step 4 depends on it).
2. First-run checklist (deferred from Milestone 1): TASK-01-01-07-FE1, BE1,
   FE2, QA1. Its QA1 also re-tests the checklist criteria Milestone 1 skips.
   TASK-02-02-01-FE1 depends on FE2, so it runs before Brew.
3. Brew: TASK-02-02-01-BE1, FE1, QA1 (keeps the persona label from wave 6).
4. Pull: TASK-02-02-02-BE1, FE1, FE2, QA1; TASK-02-02-03-BE1, FE1, FE2, QA1;
   TASK-02-02-04-BE1, FE1, QA1.
5. Bag recipes: TASK-02-01-04-BE1, FE1, QA1.

**Wave 11b: choosing, setup switching and the closest setup (EPIC-02-02,
EPIC-02-01).**

1. Choosing: TASK-02-02-06-BE1, FE1, FE2, QA1; TASK-02-02-05-FE1, QA1.
2. Setup switching and the closest setup: TASK-02-01-06-BE2, FE1;
   TASK-02-02-07-FE1, FE2, QA1. TASK-02-01-06-FE2 and QA1 move to wave 12
   (they need wave 12's dial-in mode).

**Wave 12: fixing shots and suggestions (EPIC-02-03).**

1. Engine: TASK-02-03-05-BE1; TASK-02-03-06-BE1, BE2, QA1 (the scenario suite).
2. Card: TASK-02-03-05-FE1, FE2, QA1.
3. Reactions and the off sheet: TASK-02-03-01-BE1, FE1, FE2, QA1;
   TASK-02-03-04-BE1, FE1, FE2, QA1.
4. Pending suggestions: TASK-02-03-07-BE1, FE1, QA1.
5. Log modes: TASK-02-03-02-FE1, FE2, QA1; TASK-02-03-03-FE1, QA1.
6. Dial in from the closest setup (moved from wave 11; it needs
   TASK-02-03-03-FE1): TASK-02-01-06-FE2, QA1.

**Wave 12b: clocks and remaining-coffee screens (beside wave 12).** Moved from
wave 11 in revision 4. The engine needs only the clock backends (wave 10), so
this runs in parallel with wave 12. It follows Brew (wave 11a).

1. Clocks: TASK-03-03-01-FE1 and QA1, TASK-03-03-04-FE1 and QA1,
   TASK-03-03-02-FE1 and QA1, TASK-03-03-03-FE1 and QA1.
2. Remaining coffee: TASK-03-04-01-FE2 and QA1 (QA1 runs after
   TASK-02-02-04-BE1).

**Wave 13: Journal filters and dial in from a shot (rest of EPIC-02-06).**

1. TASK-02-06-04-BE1, FE1, FE2, QA1; TASK-02-06-05-FE1, QA1.
2. TASK-02-06-06-BE1, FE1, QA1.

**Wave 14: Tried and the coffee screen (EPIC-03-06).**

1. TASK-03-06-01-BE1, FE1, QA1; TASK-03-06-02-BE1, FE1, QA1.
2. TASK-03-06-03-BE1, FE1, FE2, QA1; TASK-03-06-04-FE1, QA1.

**Wave 15: maintenance (EPIC-04-01).**

1. TASK-04-01-01-FE1, FE2, QA1 (BE2 is in wave 10).
2. TASK-04-01-02-BE1, FE1, QA1; TASK-04-01-03-FE1, QA1 (BE1 is in wave 10).
3. TASK-04-01-04-BE1, FE1, QA1.

With two developers (one mostly backend, one mostly frontend) and EPIC-01-06
on its own track, the critical path after Milestone 1 runs through waves 8,
9, 10, 11a and 12 (the suggestions need the tasting and the clocks; wave 11b
and the clock screens in wave 12b run beside or just before wave 12). Design
runs one wave ahead. Revision 4 split the old wave 11 (about 198 h): waves
11a, 11b and 12b are now about 110 h, 36 h and 32 h, and the profile (13 h) is
in wave 6.

**Hours per wave** (task headers summed; design hours are in section 8.2):

| Wave | Tasks | Hours |
|---|---|---|
| 1 | 42 | 149 |
| 2 | 21 | 89 |
| 3 | 12 | 49 |
| 4 | 17 | 59 |
| 5 | 7 | 22 |
| **Milestone 1** | **99** | **368** |
| 6 | 17 | 54 |
| 7 | 25 | 92 |
| 8 | 18 | 57 |
| 9 | 21 | 69 |
| 10 | 27 | 79 |
| 11a | 31 | 110 |
| 11b | 11 | 36 |
| 12 | 25 | 93 |
| 12b | 10 | 32 |
| 13 | 9 | 29 |
| 14 | 12 | 36 |
| 15 | 11 | 30 |
| **Rest of the MVP** | **217** | **717** |
| **MVP** | **316** | **1,085** |

### 8.4 Waves for the sweetened change and the Next epics (revision 5)

These follow wave 15 and the epics' build order (`epics.md` revision 11, items
17 to 26), with the cheap sweetened change first and **EPIC-05-02 last**. Wave
numbers continue from section 8.3. Sizes are task hours (design is separate).
Two developers (one mostly backend, one mostly frontend) can overlap adjacent
waves where the dependencies below allow.

**Before wave 17 (not tasks).**

- Done (2026-11-16): Google sign-in is enabled in the Firebase project.
  Localhost is authorised by default; add any hosted domain when there is
  one. Keys stay deployment secrets (waves 18 and 26).
- `INVITE_SECRET` and `APP_ORIGIN` exist as deployment secrets, names only in
  `.env.example` (wave 26).
- The Google button's look is checked against Google's current guidelines
  (DQ-40a, before TASK-05-03-01-FE2).
- Done (2026-11-16): the Head of Product's list of producing countries, 81
  entries with ISO 3166-1 codes, in `planning/coffee-origins.json`. Store the
  code; show the name with `Intl.DisplayNames`. Origins for the seed coffees
  are still optional (wave 21b).
- Design runs one wave ahead (section 8.2 for the MVP; the Next design is 128 h
  plus DES-02-01-06's 4 h). Order: DES-04-02-02 before DES-04-03-04, and
  DES-05-03-02 before DES-05-02-03.

**Wave 17: sweetened on recipes (EPIC-02-01 change), 19 tasks, 52 h.**

1. Backend: TASK-02-01-07-BE1, TASK-02-01-07-BE2, TASK-02-01-08-BE1,
   TASK-02-01-09-BE1.
2. Frontend: TASK-02-01-09-FE2, TASK-02-01-07-FE1, TASK-02-01-08-FE1,
   TASK-02-01-07-FE2, TASK-02-01-09-FE1.
3. QA: TASK-02-01-07-QA1, TASK-02-01-08-QA1, TASK-02-01-09-QA1 and the seven
   amendment tests (TASK-01-03-04-QA2, TASK-02-01-04-QA2, TASK-02-01-06-QA2,
   TASK-02-02-01-QA2, TASK-02-02-02-QA2, TASK-02-03-02-QA2,
   TASK-02-03-03-QA2).

**Wave 18: keep your history across phones (EPIC-05-03), 15 tasks, 59 h.**
Moved ahead of the lists because it restructures the Profile screen that
three later epics add rows to.

1. TASK-05-03-04-BE1 (the emptiness test, reused by wave 26),
   TASK-05-03-01-FE1, TASK-05-03-01-BE1.
2. TASK-05-03-01-FE2 (restructures Profile into sections), QA1.
3. Switching: TASK-05-03-04-BE2, FE1, FE2, QA1.
4. First-run link: TASK-05-03-02-FE1, QA1.
5. Prompt: TASK-05-03-03-BE1, FE1, FE2, QA1 (the re-dial card does not exist
   yet, so the one-card rule is re-run in wave 24).

**Wave 19a: drinks list (EPIC-02-05, stories 01 to 04 and 06), 18 tasks, 68 h.**

1. TASK-02-05-01-BE1, then BE1 of 02, 03, 04 and 06; TASK-02-05-02-FE1 (Toggle)
   and TASK-02-05-04-FE1 (ReorderList and Icon strokes) in parallel.
2. TASK-02-05-01-FE1, FE2; TASK-02-05-02-FE2; TASK-02-05-03-FE1;
   TASK-02-05-04-FE2; TASK-02-05-06-FE1.
3. QA of 01, 02, 03, 04, 06.

**Wave 19b: milks, entry points and hidden items (EPIC-02-05, stories 05, 07,
08), 11 tasks, 48 h.**

1. TASK-02-05-05-BE1, FE1, FE2, QA1.
2. TASK-02-05-07-BE1, FE1, FE2, QA1.
3. TASK-02-05-08-BE1, FE1, QA1.

**Wave 20: one bag's own recipe (EPIC-02-04), 13 tasks, 53 h.** Runs beside
wave 21 (different areas).

1. Backend: TASK-02-04-04-BE1 (the `removed_at` migration first),
   TASK-02-04-01-BE1, TASK-02-04-01-BE2, TASK-02-04-02-BE1,
   TASK-02-04-04-BE2.
2. Frontend: TASK-02-04-01-FE1, TASK-02-04-03-FE1, TASK-02-04-03-FE2,
   TASK-02-04-04-FE1.
3. QA: TASK-02-04-01-QA1, 02-QA1, 03-QA1, 04-QA1.

**Wave 21a: run-out (EPIC-03-05), 11 tasks, 44 h.**

1. TASK-03-05-01-BE1, TASK-03-05-02-BE1, TASK-03-05-03-BE1, then
   TASK-03-05-01-BE2.
2. TASK-03-05-01-FE1, FE2; TASK-03-05-02-FE1; TASK-03-05-03-FE1.
3. QA of 01, 02, 03.

**Wave 21b: Beans filters and origin (EPIC-03-07), 17 tasks, 67 h.** Independent
of wave 21a except one soft link: TASK-03-07-02-FE2 passes the filter flag to
the run-out line, so it follows TASK-03-05-02-FE1 (or ships first and the flag
does nothing).

1. Origin: TASK-03-07-04-BE1 (migration), BE2, BE3, FE1, QA1; then
   TASK-03-07-05-BE1, FE1, QA1.
2. Filters: TASK-03-07-01-BE1, BE2, FE1, QA1.
3. TASK-03-07-02-FE1, FE2, QA1; TASK-03-07-03-FE1, QA1.

**Wave 22: brew for someone else (EPIC-05-01), 25 tasks, 109 h.**

1. The persona foundation, as one focused stretch with other DAL work paused:
   TASK-05-01-03-BE1, BE2, BE3.
2. People: TASK-05-01-01-BE1, FE1, FE2; TASK-05-01-02-BE1, FE1.
3. Brew: TASK-05-01-03-FE1, FE2.
4. Across the app: TASK-05-01-04-BE1, FE1; TASK-05-01-05-BE1, FE1;
   TASK-05-01-06-BE1, FE1; TASK-05-01-07-BE1, FE1.
5. QA of 01 to 07.

**Wave 23: suggested grind (EPIC-04-02), 22 tasks, 104 h.**

1. Engine pieces (backend, mostly parallel): TASK-04-02-04-BE1,
   TASK-04-02-05-BE1, TASK-04-02-02-BE1, TASK-04-02-03-BE1,
   TASK-04-02-07-BE1, TASK-04-02-01-BE1, TASK-04-02-02-BE2; the scenario
   suite TASK-04-02-09-QA1 is drafted alongside.
2. Composition and use: TASK-04-02-06-BE1, TASK-04-02-09-BE1,
   TASK-04-02-06-BE2.
3. Frontend: TASK-04-02-08-FE1 (the sheet, can start earlier), then
   TASK-04-02-06-FE1, FE2.
4. QA of 01 to 08 and the scenario suite run to completion.

**Wave 24: re-dial after maintenance (EPIC-04-03), 21 tasks, 93 h.**

1. TASK-04-03-04-BE1, BE2; TASK-04-03-03-BE1; TASK-04-03-01-BE1, BE2;
   TASK-04-03-02-BE1, BE2.
2. TASK-04-03-03-BE2 (servicing applied on read) straight after wave 23's
   composition, since both touch the same readers.
3. Frontend: TASK-04-03-04-FE1, FE2, FE3; TASK-04-03-02-FE1;
   TASK-04-03-01-FE1; TASK-04-03-03-FE1; TASK-04-03-05-BE1, FE1.
4. QA of 04, 01, 02, 03, 05, and re-run TASK-05-03-03-QA1 for the one-card
   rule.

**Wave 25: stretch (EPIC-04-04), 11 tasks, 46 h.** The lowest-value Next epic;
it can wait or be cut without breaking anything.

1. TASK-04-04-02-FE1 (percent unit), TASK-04-04-01-BE1, BE2,
   TASK-04-04-02-BE1, TASK-04-04-03-BE1.
2. TASK-04-04-01-FE1, TASK-04-04-02-FE2, TASK-04-04-03-FE1.
3. QA of 01, 02, 03.

**Wave 26: invites, claiming and leaving (EPIC-05-02), last, 25 tasks, 110 h.**
Leaving ships with it: TASK-05-02-07-* are part of the release gate, since a
claim cannot be undone otherwise (DQ-41b).

1. TASK-05-02-01-BE1 (the migration), TASK-05-02-07-BE1 (the bootstrap split).
2. Inviting: TASK-05-02-01-BE2, FE1, FE2; TASK-05-02-06-BE1, FE1.
3. The invitation page: TASK-05-02-05-BE1, FE1, FE2.
4. Joining and claiming: TASK-05-02-02-BE1, FE1, FE2; TASK-05-02-03-BE1, FE1;
   TASK-05-02-04-BE1.
5. Leaving: TASK-05-02-07-BE2, FE1.
6. QA of 01, 06, 05, 02, 03, 04, 07, plus the manual device checklist.

**Hours per wave (revision 5).**

| Wave | Tasks | Hours |
|---|---|---|
| 17 Sweetened | 19 | 52 |
| 18 EPIC-05-03 | 15 | 59 |
| 19a EPIC-02-05 drinks | 18 | 68 |
| 19b EPIC-02-05 milks, entry points, hidden | 11 | 48 |
| 20 EPIC-02-04 | 13 | 53 |
| 21a EPIC-03-05 | 11 | 44 |
| 21b EPIC-03-07 | 17 | 67 |
| 22 EPIC-05-01 | 25 | 109 |
| 23 EPIC-04-02 | 22 | 104 |
| 24 EPIC-04-03 | 21 | 93 |
| 25 EPIC-04-04 | 11 | 46 |
| 26 EPIC-05-02 | 25 | 110 |
| **Revision 5** | **208** | **853** |

The critical path is 18, 22, 23, 24, 26: Google linking and the emptiness test
feed joining; the persona refactor feeds the pooled drift and the Journal's
person filter; drift feeds the shift's ageing note; leaving closes the claim.
Waves 19, 20 and 21 are off the critical path and can absorb a second
developer. With the measured pace after Milestone 1, these hours are re-forecast
like the rest (S-02).

---

## 9. Questions

### 9.1 Technical decisions

**Resolved (recorded in S-02 and, where they touch the schema, in S-08).**

- **TQ-01 to TQ-07** (Firebase session, one libSQL client, Server Actions,
  millisecond timestamps, the recalibration flag, "not sure" capabilities and
  local days) were accepted as proposed. They are implemented by
  TASK-01-01-01-BE1, BE3 to BE5, TASK-01-02-01-BE1, TASK-02-06-01-BE2,
  TASK-04-01-01-BE1 and TASK-01-06-06-BE1.
- **TQ-10** is answered for Milestone 1: the Head of Product supplied the
  seed in `planning/seed-catalog.md` (a machine with its four stock baskets,
  a grinder, a Crema basket and two coffees, for TASK-01-02-01-BE6). Who
  curates the full list later is still open.

**Resolved (working assumptions).** TQ-08 and TQ-09 are adopted as working
assumptions, so they don't gate TASK-01-01-04-QA1, TASK-01-01-02-QA1 or
TASK-01-03-05-QA1.

- **TQ-08 A second locale for testing (assumed).** A test-only messages
  fixture plus `de-DE` number formatting; no second shipped language.
- **TQ-09 Test layers (assumed).** Node tests plus Storybook play tests; no
  end-to-end suite. The Playwright option is off (about +16 h only if the
  Head of Product opts in).

**Still open.**

- **TQ-10 (rest).** Who supplies and verifies the seed after Milestone 1?
  Proposal: a developer edits `status` and `merged_into_id` in `db:studio`.
  A small admin script would add about 4 h and isn't planned.
- **TQ-11 IDs.** `crypto.randomUUID()` text keys, with the one-tap pull's ID
  generated on the client. Low impact.
- **TQ-12 Markets for regional links and aliases.** ISO 3166-1 alpha-2 codes
  with names from `Intl.DisplayNames`. Short list or all codes? Low impact.
- **TQ-13 Splitting a portion that has a stock check.** Proposal: the split
  writes a new stock check on the source portion. Alternative: forbid it.
- **TQ-14 Wheel ranges for dose, yield and time.** Proposal: dose 5 to 30 g,
  yield 5 to 100 g, time 5 to 90 s, step 0.1. Low impact.
- **TQ-15 Undo window on the server.** 8 seconds in the UI, 13 seconds on the
  server, only for the user who pulled. Low impact.
- **TQ-16 Where the current setup is stored (new).** S-08 has no column for
  it. Proposal: a device cookie with the setup ID and the time it was
  chosen, and the latest shot decides otherwise (DQ-18). It doesn't follow
  the user to another device. In Milestone 1 it isn't needed.
- **TQ-17 Where suggestion dismissals are stored (new, DQ-25).** Proposal:
  localStorage keyed by shot ID, session-only if unavailable. A dismissal
  doesn't follow the user to another device.

### 9.2 Product questions (for the Head of Product)

1. **Entry mode of an edited one-tap shot.** The plan keeps it one-tap
   (TASK-02-06-02-BE1). The edit mode is now wave 9 work. Confirm.
2. **Milk and the bootstrap.** Milestone 1 households get no milks; milks are
   seeded in wave 6 for new households only. Confirm there are no real
   households to migrate.
3. **Closed in revision 4.** The builder holds to one setup until wave 6.
4. **DQ-11 fallback ranges** for "not sure" equipment live in one domain
   module (TASK-01-06-08-BE1). Confirm before QA.
5. **DQ-10 "add anyway"** on a duplicate link is built behind a flag, off.
   Confirm off or on.
6. **SQ-16: who owns the first-run checklist.** Planned under STORY-01-01-07.
   It doesn't affect the code.
7. **Seed content (TASK-01-02-01-BE6).** Please supply: your machine, grinder
   and baskets with their dose ranges, and the coffees, as public product
   facts only. TASK-01-02-01-BE6 is blocked on it.
8. **DQ-24 freshness thresholds** (under 5 days, over 35 days since roast or
   packing, over 21 days open, freezer time excluded) are confirmed by the
   Head of Product, before wave 12's suggestion tests.

Closed in revision 4: a second setup in Milestone 1 (question 3 and risk
R-24: there is only one setup until wave 6, TASK-01-02-04-BE3), and the quiet
link for an unknown basket dose range (dropped).

Closed in revision 3: the size of Milestone 1 (now 368 h), the section guard
(TASK-01-01-05-FE8 retired), dose with an unknown basket range (never
suggested without a range, TASK-02-03-06-BE2), Brew in Milestone 1 (a plain
screen with one "log a shot" action), TQ-08 and TQ-09.

Closed by the Head of Product's six answers and S-02: step sizes (SQ-19), the
temperature lever (SQ-21), typical milk amounts, the basket dose range
(SQ-20), Tried and personas, and coffee used (SQ-14). Also closed: DQ-08
(taste tags), INIT-03 Q2 (no estimated age) and the retired-unit question
(no retire).

### 9.3 Questions for the Next epics (revision 5)

The Head of Product's answers of 2026-11-16 are applied: leaving stays in
EPIC-05-02 and the leaver starts a new empty household (Q1); "Dial in from
this" starts with the past shot's sweetened value (Q2); a removed bag recipe
stops applying but is kept (Q3, so `removed_at`); another profile's same-setup
recipe wins over a closest-setup recipe (Q4). The questions below are new and
none changes scope; each has the plan's working answer.

**For the Head of Product.**

1. **Who sees "leave this household"** (TASK-05-02-07-FE1). STORY-05-02-07 says
   "a member who claimed a profile", and the household's original owner has a
   claimed profile too. Working answer: show it only when the household has
   more than one login, so a solo user can't strand their own history in an
   orphaned household. Confirm.
2. **Ownership and abandoned households** (TASK-05-02-07-BE2). `owner` and
   `member` have no different rights in the plan (any member invites, any
   member sees every profile). Working answer: if the only owner leaves, the
   longest-standing member becomes owner; if the last member leaves, the
   household stays with its data and no one can open it. Confirm both.
3. **STORY-04-03-03 AC 5, "I change an event's date".** The built app can add an
   event with a past date but has no way to edit or delete one, and no story
   asks for it. Working answer: the criterion is met by back-dating at
   creation (an event slots into date order on read); an edit screen is not
   planned. Confirm, or say it is wanted (about 8 h, new scope).
4. **Joining from a browser that already has history** (STORY-05-02-02 AC 5).
   If the invitee's browser already holds a Tare account with data, signing in
   with Google links that data to the Google account and joining is then
   refused ("use a different Google account"). That is correct but means the
   same browser can't be used to join. Working answer: accept; no new
   story. Confirm.
5. **Does the grind adjustment apply to a borrowed or closest-setup recipe?**
   STORY-04-02-06 names the closest-setup dial-in; STORY-05-01-05 is silent.
   Working answer: yes when the starting recipe's grind is carried over
   (same grinder), no when the grind isn't carried over (different grinder).
   Confirm.
6. **Do good one-tap shots feed the adjustment?** STORY-04-02-03 AC 2 says
   they count "only as the recipe was fine". Working answer: evidence only
   (they appear in the sheet's wording but never weight the result), which is
   the cautious reading. Confirm.
7. **Coffees never brewed under the rating filter** (STORY-03-07-01). They read
   "no ratings yet". Working answer: yes.
8. **Data work, not tasks.** The curated list of producing countries for the
   origin question, and origins for the seed coffees (DQ-49), come from the
   Head of Product as admin; the Google button wording is checked against
   Google's guidelines before TASK-05-03-01-FE2. The spec text in S-02, S-04
   and S-08 about sweetened ("a mark on the shot") needs the spec owner's edit.

**Technical decisions made here (tech lead; shout if you disagree).**

- **TQ-18 Origin storage.** One nullable text key (alpha-2 code, `blend` or
  `other:<folded text>`), TD-9. Alternative: a lookup table (more weight, no
  gain at this size).
- **TQ-19 Invite tokens.** `id.hmac(INVITE_SECRET, id)` rather than a stored
  hash, so the link can be shown again (STORY-05-02-06 AC 2) without keeping a
  working credential in the database. Costs one more secret to manage.
- **TQ-20 Re-dials are derived from pins, not stored.** An event's re-dial set
  is the first pin after the event for each coffee, profile, setup and drink
  that had a pin before it. Only the confirmed shift, stretch and the first
  source recipe are stored. A later re-pin of the same coffee is not a new
  re-dial.
- **TQ-21 Main persona.** The profile claimed by the signed-in user, else
  `isDefault` (TD-1). No schema change.
- **TQ-22 The pull records what the server computes.** Brew shows an adjusted
  grind and the pull recomputes it; if another device logged a shot between the
  two, the recorded grind can differ from the displayed one by a step.
  Alternative: send the shown grind and accept it within a tolerance.
- **TQ-23 Drift constants.** The window, half-life, floor, cap, the steps per
  percent of bag speed, the thresholds of the stretch fit and the run-out
  numbers are starting values in constants files; the scenario suite
  (TASK-04-02-09-QA1) tunes them. The age term and the bag term can overlap
  (both react to the user re-dialling); the evals must include that case.
- **TQ-24 Orphaned empty accounts.** After a switch (EPIC-05-03) the old
  anonymous account stays in the database, unused. Harmless; a clean-up job is
  tech debt.
- **TQ-25 Observability.** Drift outcomes are one structured log line until an
  observability tool is chosen for the AI epics; the function is the single
  place to swap.
- **TQ-26 Name rules.** Drink, milk and profile names share one rule (1 to 40
  characters, unique ignoring case, hidden items included). Starter names are
  compared by the current locale's translation, so a clash that exists only in
  another language isn't detected.

---

## 10. Technical risks and tech debt

- **R-01 Dependency on PR #3.** About 35 tasks wire or extend PR #3's
  components. If their props change in review, or they lack states the
  design needs (ShotDial's unset, "was" and milk tabs, ChipGroup's variants,
  HomeScreen's three no-recipe states), the extension tasks grow. Mitigation:
  merge PR #3 before wave 1. Each extension task checks what's there first.
- **R-02 Anonymous accounts.** A cleared browser profile or reset device
  loses the account, and Safari storage eviction can drop the Firebase user
  after inactivity, creating a new empty household. Accepted (S-02, review
  M6). Cookie expiry must be silent (TASK-01-01-01-BE4).
- **R-03 S-08 deviations: closed.** The schema tasks follow S-08 exactly.
- **R-04 JSON columns and unconstrained references.** `capabilities`,
  `taste_tags` and catalog `entity_id` aren't enforced by the database.
  Setups now have a real join table and a unique index, which removes the old
  JSON risk. Mitigation: one validator per JSON shape and tests.
- **R-05 Local-day maths.** Both clocks, day groups, the time-of-day drink
  and "opened today" depend on the device's time zone. Off-by-one errors at
  midnight and DST are likely without the shared helpers.
- **R-06 Optimistic one-tap.** Showing success before the server confirms can
  hide a failure. Idempotent IDs prevent duplicates on retry. No offline mode.
- **R-07 Server Action ordering.** Pull, undo and reaction run one at a time;
  a slow pull can delay undo inside the 8-second window. The 13-second server
  grace covers it.
- **R-08 Fahrenheit round-trip.** Rounding must keep a stored °C re-displaying
  as the same °F step (TASK-01-04-01-FE1 tests).
- **R-09 Catalog search quality.** SQLite `LIKE` lowercases ASCII only, so
  accented names may not match case-insensitively. Fine for a small seed.
- **R-10 Foreign keys.** Enforcement depends on libSQL connection settings,
  locally and on Turso. Checked in TASK-01-01-01-BE1.
- **R-11 Undo is a hard delete.** The only delete in the MVP; limited to the
  same user, one-tap shots and a short window.
- **R-12 Splitting with stock checks** (TQ-13). Subtle, with its own tests.
- **R-13 EPIC-01-06 size and order.** 109 h. Only URL normalisation is in
  Milestone 1; the rest can trail. The capability mapping is the riskiest
  part.
- **R-14 Test coverage of wiring.** With no end-to-end suite (TQ-09), page and
  action wiring regressions are caught only by Node tests and manual checks.
- **R-15 Secrets in a public repo.** Firebase and Turso keys live in
  deployment secrets only.
- **R-16 Suggestion correctness (new).** The rules are heuristics from dial-in
  practice, tested by a scenario table the tech lead writes
  (TASK-02-03-06-QA1, 8 h, at least 40 scenarios). Passing means expected
  lever and direction, not that advice is good for every grinder. The step
  sizes are starting values (answer 1) and live in one constants file.
  Wrong advice here is more visible than most bugs. Needs a domain review
  of the scenario table before release.
- **R-17 Rule order and temperature (new).** The lever order is encoded once
  (TASK-02-03-06-BE2). The temperature trigger ("grind at its limit or a
  grind change didn't help") needs the previous shot in the same grind
  period, which makes the engine depend on history, not just one shot. The
  grind-period dependency is now declared (TASK-02-03-06-BE1 and BE2 depend
  on TASK-04-01-01-BE2 and TASK-04-01-03-BE1, which moved to wave 10).
- **R-18 Current setup is device state (new, TQ-16).** A second device may show
  a different current setup until a shot is logged. Acceptable in a
  one-device prototype.
- **R-19 Dismissals are device state (new, TQ-17).** Same limitation; storage
  can be cleared by the browser.
- **R-20 ShotDial tab overflow (new).** Up to seven tabs with temperature,
  pressure and milk on 375 px (TASK-01-04-01-FE2). Scrolling tabs hide values
  the design wants visible at once. Needs a design check once milk lands.
- **R-21 Seed curation (new).** The seed is hand-made by the Head of Product
  (basket dose ranges included). A wrong range silently bounds dose
  suggestions. The loader validates shape, not truth.
- **R-22 Milestone 1 estimate (new).** About 368 hours against S-02's roughly
  370 h (section 8.1). The pace measured after Milestone 1 will re-forecast
  the rest.
- **R-23 Tried and coffee queries (new).** Tried groups shots by merge
  survivor in one query. With a large history this may need an index on
  `(household_id, portion_id)`; not planned until measured.
- **R-24 Retired (revision 4).** The Milestone 1 builder can't make a second
  setup, so the only setup is current. Closed by the Head of Product's
  decision (TASK-01-02-04-BE3 lifts the limit in wave 6).
- **R-25 Wave sizes (revision 4).** The old wave 11 was about 198 h (58
  tasks), 28% of the post-Milestone 1 hours. It is now split: wave 11a about
  110 h, wave 11b about 36 h, wave 12b (clock screens) about 32 h, the profile
  in wave 6 (13 h) and TASK-02-01-06-FE2 and QA1 (7 h) in wave 12. Wave 11a is
  still the largest (110 h); the re-forecast after Milestone 1 should measure
  against the per-wave hours in section 8.3.
- **R-26 The persona change is wide (revision 5, highest regression risk).**
  Fifteen reads and writes choose "the default persona". A missed one records
  a shot, a recipe or a last-pulled coffee against the wrong profile, silently.
  Mitigation: one resolver (TD-1); TASK-05-01-03-BE2 is done as one stretch with
  other DAL work paused; a grep gate in its done-when; two-persona tests on
  every call site; the isolation suite.
- **R-27 Drift correctness (revision 5).** The rules are statistics on small
  samples (3 to 10 shots). The age term and the bag term can both react to
  the same re-dial and double count; pooling across personas assumes the signal
  is mechanical; "which recipe a shot came from" is inferred (TD-2). A wrong
  grind number is more visible than most bugs. Mitigation: it never blocks a
  pull and shows nothing under one step; the scenario suite includes a
  mixed-technique household and a re-pin mid-day; every constant is tunable in
  one file; the snapshot test forces a re-run. If misattribution shows up, the
  follow-up is a nullable recipe link on shots (a schema change).
- **R-28 Brew read cost and observability (revision 5).** `getHome` and the pull
  gain the recipe-in-force match, a window of shots and the grinder's events,
  and Brew is the hot path. Mitigation: one query
  per input table, matching in memory, an adjustment that fails or is slow
  returns nothing; the budget is at most 4 extra queries and 50 ms extra (median of 20 runs,
  local file database, 500 shots) for `getHome`, checked in a test in
  TASK-04-02-06-BE2. There is no
  observability tool yet, so outcomes are one structured log line
  (TASK-04-02-09-BE1) and "showed nothing, limited, failed" are countable only
  from logs.
- **R-29 Google linking is hard to test (revision 5).** `auth/credential-already-in-use`,
  popup blockers, the iOS Safari redirect, an anonymous user with data and a
  cleared browser are all real paths. Tests mock `firebase/auth`; the real
  flows need a manual two-device checklist (in TASK-05-03-01-QA1,
  TASK-05-03-04-QA1, TASK-05-02-02-QA1). The Firebase project, its Google
  provider and authorised domains are set up outside the repository; no key is
  ever committed.
- **R-30 An invite link is a credential (revision 5).** It can leak by
  `Referer`, logs, browser history or a shared screenshot. Mitigation: 256-bit
  HMAC token, single use by conditional update, 7-day expiry, withdraw, one
  uniform invalid page, `Referrer-Policy: no-referrer`, no caching or indexing,
  and URLs kept out of the structured logs. There is no rate limiting on the
  public page (tokens are not guessable); accepted.
- **R-31 Joining deletes an empty household (revision 5).** The replace is
  irreversible and runs on the strength of `isHouseholdEmpty`. A bug there
  deletes real data. Mitigation: the test is one function with a test per
  entry kind, the delete runs in the same immediate transaction as the check,
  foreign keys are verified on, and nothing is deleted when anything is found.
- **R-32 Leaving and the one-household rule (revision 5).** `findAccount` takes
  one membership; everything assumes a user has one household. Leaving creates a
  new one in the same transaction so there is never a gap. Abandoned
  households (no members left) and orphaned empty anonymous accounts (after a
  switch) stay in the database; both are harmless but untidy tech debt.
- **R-33 Removed bag recipes (revision 5).** `removed_at` must be honoured by
  every reader of bag recipes (`getCurrentRecipe`, `getBagOwnRecipe`,
  `getBagRecipes`, the recipe-in-force rule, `pullShot`). A missed reader
  resurrects a removed recipe. Mitigation: the reads go through the one
  scope-aware function; a test per reader.
- **R-34 Recipe reads change shape (revision 5).** `getCurrentRecipe` becomes
  scope-aware (about eight call sites), recipe rows must keep hidden drinks, and
  sweetened joins `RecipeValues`. TypeScript finds the callers, but the
  EPIC-02-04 and EPIC-02-05 changes touch the same files
  (`recipes.ts`, `home.ts`, `recipeRows.ts`); wave 20 and wave 19b should not
  run on the same files at once.
- **R-35 Servicing is read at many sites (revision 5).** `resolveRecipeGrind`
  must be used by Brew, the log start, fix mode, the pin sheet, the rows and the
  pull, or one screen shows the old number. Fix mode starts from the recipe's
  raw grind today; it is changed in TASK-04-03-03-BE2. A one-tap shot made
  while a shift applies records the shifted grind.
- **R-36 Run-out quality (revision 5).** No accuracy target (X-2). A household
  that drinks more than it logs, or has few finished portions, gets a
  poor estimate. Mitigation: it shows nothing while learning or stale, and the
  sheet shows its inputs and the logged share rather than a precision.
- **R-37 The Profile screen has four owners (revision 5).** EPIC-05-03, 02-05,
  05-01 and 05-02 all add to it. TASK-05-03-01-FE2 does the restructure first;
  later tasks add one section each in the place design pattern 4 gives.
- **R-38 Size (revision 5).** 853 hours for ten Next epics and the sweetened
  change; EPIC-04-02 (104 h) and EPIC-05-01 (109 h) and EPIC-05-02 (110 h) are
  the big three, each above the 80 to 100 h of a typical MVP epic. The stories
  total about 152 points, so this is about 5.6 hours a point, close to the
  MVP's. The levers in `stories.md` apply: EPIC-04-04 (46 h) can wait; the
  origin fill-in (STORY-03-07-05, 10 h) and the list footer rows
  (TASK-02-05-07-FE2, 5 h) are separable.
- **R-39 Next.js 16 specifics (revision 5).** Filters in `searchParams`, the
  persona in a cookie and the public join route all depend on request-time APIs
  under `cacheComponents`; static shells with Suspense are required. Each task
  that adds one starts from `node_modules/next/dist/docs/` (AGENTS.md).
- **R-40 No way to edit a maintenance event (revision 5).** STORY-04-03-03 AC 5
  and STORY-04-03-05 imply events can be corrected; the built app only adds
  them. Question 3 in 9.3. Without edit, a wrong date can't be fixed and a
  wrong shift is fixed only through the shift.
- **Tech debt accepted for revision 5.**
  - Dismissals of the re-dial card and the link prompt are device state.
  - A drift outcome is a log line, not a metric.
  - The invite page has no rate limit.
  - No unlink or sign-out (out of scope).
  - Starter-name clashes across languages aren't detected.
  - `isNetworkEligible` is still never computed (X-3); the rule is written and
    tested only (TASK-05-02-04-BE1).
- **Accepted as is (new).** TASK-02-03-06-BE1 depends on
  TASK-01-03-02-FE2 (the grind scale config). That task is pure TypeScript
  labelled frontend; the dependency is acceptable.
- **Tech debt accepted for the MVP:**
  - no offline queue;
  - no admin tooling for catalog verification;
  - URL normalisation rules hard-coded in one list;
  - `is_network_eligible` never computed (X-3);
  - `has_milk` stored beside `typical_milk_ml` (redundant, kept for S-08);
  - Tried summary ignores personas (answer 5).

---

## 11. Totals

**By epic (MVP).**

| Epic | Title | Stories | Tasks | Hours |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | 8 | 41 | 145 |
| EPIC-01-02 | Describe your setup once | 6 | 34 | 133 |
| EPIC-01-03 | Log a shot in seconds | 7 | 24 | 83 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | 2 | 8 | 27 |
| EPIC-01-05 | Say how it tasted | 4 | 14 | 45 |
| EPIC-01-06 | Add what's missing from the catalog | 9 | 31 | 109 |
| **INIT-01** | | **36** | **152** | **542** |
| EPIC-02-01 | Pin the recipe that worked | 5 | 18 | 60 |
| EPIC-02-02 | Pull your daily shot in one tap | 7 | 23 | 83 |
| EPIC-02-03 | Fix a bad shot from your recipe | 7 | 23 | 86 |
| EPIC-02-06 | Look back in your journal | 6 | 22 | 72 |
| **INIT-02** | | **25** | **86** | **301** |
| EPIC-03-01 | Add a bag of beans | 4 | 16 | 60 |
| EPIC-03-02 | Split and freeze a bag | 5 | 15 | 47 |
| EPIC-03-03 | Know how fresh your beans really are | 4 | 11 | 33 |
| EPIC-03-04 | See how much coffee is left | 3 | 10 | 28 |
| EPIC-03-06 | See every coffee you've tried | 4 | 12 | 36 |
| **INIT-03** | | **20** | **64** | **204** |
| EPIC-04-01 | Record maintenance on your equipment | 4 | 14 | 38 |
| **INIT-04** | | **4** | **14** | **38** |
| **Total** | | **85** | **316** | **1,085** |

The schema, migrations and test harness (section 6, 15 tasks, 44 hours) are
counted in the epics of the stories they're parented to.

**Compared with revision 1:** 252 tasks and 851 hours became 313 tasks and
1,084 hours (+61 tasks, +233 hours): 75 added, 14 retired, 129 updated and
109 unchanged. The largest increases are EPIC-02-03 (the suggestions, +62 h),
EPIC-03-06 (new, 36 h) and the setup work in EPIC-01-02 (+12 h).

**Milestone 1 (section 8.1):** 99 tasks, 368 hours; design 144 h; the rest of
the MVP is 217 tasks, 717 hours.

**Compared with revision 3:** 315 tasks and 1,082 hours became 316 tasks and
1,085 hours (1 task added, TASK-01-02-04-BE3, 2 h; TASK-02-06-02-FE1 grows
from 6 h to 7 h). Milestone 1 is unchanged.

**Compared with revision 2:** 313 tasks and 1,084 hours became 315 tasks and
1,082 hours (3 added, 1 retired, about 12 headers updated).

**Coverage check:** every one of the 85 MVP stories has at least one `qa`
task.

- Two stories, STORY-02-01-03 and STORY-03-01-03, have only a QA task. Their
  behaviour is built by other stories' tasks.
- Several stories have one FE task and one QA task (for example
  STORY-01-03-04, 01-03-05, 02-02-05, 02-06-05, 03-03-02 and 03-06-04).
- The new stories have a QA task each: 01-01-08, 01-02-08, 01-02-09,
  01-03-06, 01-03-07, 02-01-06, 02-02-07, 02-03-04 to 07, 02-06-04 to 06,
  03-02-05, 03-03-04 and 03-06-01 to 04.

**Not included:** Later epics (INIT-06, section 1), design hours (328 h for
the MVP, section 8.2; 132 h for the Next epics and the sweetened change),
GitHub issues, and any change to scope.

### Revision 5: the sweetened change and the Next epics

**By epic.**

| Epic | Title | Stories | Tasks | Hours |
|---|---|---|---|---|
| EPIC-02-01 (change) | Sweetened on pinned recipes, with 7 amendments | 3 new, 7 amended | 19 | 52 |
| EPIC-02-04 | Give one bag its own recipe | 4 | 13 | 53 |
| EPIC-02-05 | Make the drink and milk lists yours | 8 | 29 | 116 |
| EPIC-03-05 | Know when you'll run out (run-out only) | 3 | 11 | 44 |
| EPIC-03-07 | Find any coffee in Beans (new) | 5 | 17 | 67 |
| EPIC-04-02 | Suggested grind that follows bean age and recent shots | 9 | 22 | 104 |
| EPIC-04-03 | Re-dial once after maintenance and keep every recipe | 5 | 21 | 93 |
| EPIC-04-04 | Keep recipes right after new burrs of a different design | 3 | 11 | 46 |
| EPIC-05-01 | Brew for someone else in the household | 7 | 25 | 109 |
| EPIC-05-02 | Invite them to take over their own profile | 7 | 25 | 110 |
| EPIC-05-03 | Keep your coffee history when you change phones | 4 | 15 | 59 |
| **Revision 5** | | **58 stories, 7 amended** | **208** | **853** |

**By discipline.**

| Epic | Backend | Frontend | QA | Total |
|---|---|---|---|---|
| EPIC-02-01 (change) | 4 tasks, 12 h | 5 tasks, 15 h | 10 tasks, 25 h | 19 tasks, 52 h |
| EPIC-02-04 | 5 tasks, 22 h | 4 tasks, 16 h | 4 tasks, 15 h | 13 tasks, 53 h |
| EPIC-02-05 | 8 tasks, 30 h | 13 tasks, 53 h | 8 tasks, 33 h | 29 tasks, 116 h |
| EPIC-03-05 | 4 tasks, 18 h | 4 tasks, 14 h | 3 tasks, 12 h | 11 tasks, 44 h |
| EPIC-03-07 | 6 tasks, 22 h | 6 tasks, 26 h | 5 tasks, 19 h | 17 tasks, 67 h |
| EPIC-04-02 | 10 tasks, 51 h | 3 tasks, 15 h | 9 tasks, 38 h | 22 tasks, 104 h |
| EPIC-04-03 | 9 tasks, 38 h | 7 tasks, 34 h | 5 tasks, 21 h | 21 tasks, 93 h |
| EPIC-04-04 | 4 tasks, 18 h | 4 tasks, 16 h | 3 tasks, 12 h | 11 tasks, 46 h |
| EPIC-05-01 | 9 tasks, 41 h | 9 tasks, 40 h | 7 tasks, 28 h | 25 tasks, 109 h |
| EPIC-05-02 | 9 tasks, 39 h | 9 tasks, 42 h | 7 tasks, 29 h | 25 tasks, 110 h |
| EPIC-05-03 | 4 tasks, 14 h | 7 tasks, 29 h | 4 tasks, 16 h | 15 tasks, 59 h |
| **Total** | **72 tasks, 305 h** | **71 tasks, 300 h** | **65 tasks, 248 h** | **208 tasks, 853 h** |

**With the MVP.** 316 tasks and 1,085 hours become **524 tasks and 1,938
hours**. Every one of the 58 stories and the 7 amended ones has at least one
`qa` task; STORY-02-01-07 to 09 and the amendments are tested in wave 17.
No task is over 16 hours (the largest is 10 h, TASK-04-02-09-QA1). The
migrations are four small tasks (section 6a).
