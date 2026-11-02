# Tare engineering tasks (revision 3, for the Head of Product's approval)

Source:

- `planning/drafts/stories.md` (revision 4, approved, 138 stories, with the
  Head of Product's six answers);
- `planning/drafts/design.md` (approved through round 6, plus the basket
  dose-range addendum);
- `planning/drafts/epics.md` (revision 10, final, MVP build order);
- `planning/drafts/review.md` (the plan review);
- `docs/spec.md` (S-02 decisions including the Milestone 1 bullet, S-04
  ontology, S-08 schema);
- the codebase on branch `planning/breakdown-drafts`, plus open PR #3
  (`design/mvp-screens`), described in section 3.

**Status: revision 3, for the Head of Product's approval.** Revision 1 was
approved by the Head of Product; revision 2 is superseded by this one. Nothing is built, no code is written, and no
GitHub issues are created. Open questions are named in each task's
dependencies and listed in section 9.

**Scope.** Only the 85 MVP stories in the 16 MVP epics are broken down. Next
and Later stories are listed in section 1. **Milestone 1** (a lean walking
skeleton, section 8.1) is a subset of these tasks, not extra work.

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
- 14 retired.

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

### Retired (15)

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
4. Technical approach
5. Definition of done for every task
6. Schema and migrations (first)
7. Tasks by story
8. Build order, Milestone 1 and design schedule
9. Questions
10. Technical risks and tech debt
11. Totals

---

## 1. Not broken down yet

These are **not broken down yet: re-planned before they're built.**

**Next (30 stories, 8 epics).**

| Epic | Stories | Why not now |
|---|---|---|
| EPIC-05-03 Keep your coffee history when you change phones | STORY-05-03-01, 02, 03 | First Next epic. It builds on the MVP's Firebase session (TQ-01). |
| EPIC-02-05 Make the drink and milk lists yours | STORY-02-05-01 to 06 | Next. Hidden drinks and milks with recipes are still open. |
| EPIC-02-04 Give one bag its own recipe | STORY-02-04-01, 02 | Next, and blocked on INIT-02 Q1. |
| EPIC-03-05 Know when you'll run out, and find any coffee | STORY-03-05-01 to 04 | Next. X-2 is open, origin needs a catalog field, and a coffee's "rating" isn't defined. |
| EPIC-05-01 Brew for someone else in the household | STORY-05-01-01 to 04 | Next. Removing a persona is still open. |
| EPIC-04-02 Suggested grind that follows bean age and recent shots | STORY-04-02-01 to 06 | Next. INIT-04 Q2 to Q4 and SQ-18 are open. |
| EPIC-04-03 Re-dial once after maintenance and keep every recipe | STORY-04-03-01 to 03 | Next. It needs EPIC-04-02's aging estimate. |
| EPIC-04-04 Keep recipes right after new burrs of a different design | STORY-04-04-01, 02 | Next. The fitting method is still open. |

**Later (23 stories, 7 epics).** These are AI and community features. Each
needs evals and a model choice first (S-01).

| Epic | Stories | Why not now |
|---|---|---|
| EPIC-05-02 Invite them to take over their own profile | STORY-05-02-01 to 04 | Later (phase 3). Invite delivery and roles are still open. |
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
  - In Milestone 1 there's one setup, so "current" is that setup and no rule
    or cookie is built yet.
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
`frontend` · Parent: STORY-01-01-03 · 3 h · Unchanged · Depends on: TASK-01-01-03-FE2, TASK-01-01-03-BE1, TASK-01-01-05-FE4
- **Build:** `src/app/(task)/profile/page.tsx` with `renamePersona` through
  `useActionState`; the persona label on Brew opens it.
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
  back-button check.
- **Done when:** AC 1 to AC 4 are covered.

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
  run from an empty household to the first shot.
- **Done when:** AC 1 to AC 5 are covered.

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
- **Build:** With the Head of Product, write the seed entries in
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
  (AC 6); picker play tests for no match.
- **Done when:** AC 1 to AC 6 are covered.

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
  uses `findOrCreateSetup` (unique-index insert, read on conflict), then
  makes it current (TASK-01-02-09-BE1).
- **Done when:** A missing part names itself and saves nothing (AC 5); the
  same combination reuses its setup (AC 3); a new one is made with an
  optional name (AC 4); two quick calls make one setup; the preview matches
  (AC 2); it becomes current (AC 6).

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
- **Done when:** Missing context in the log can add a setup and return
  (AC 1); the resulting setup is current on return (AC 6).

##### TASK-01-02-04-QA1 · Test setup creation and matching
`qa` · Parent: STORY-01-02-04 · 3 h · Updated · Depends on: TASK-01-02-04-FE2
- **Build:** Unit tests for `validateParts`; Node tests for reuse, new, race,
  missing part and isolation; play test that the Notice names the part.
- **Done when:** AC 1 to AC 6 are covered.

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
  required part (AC 3); one tap with no typing (AC 1).

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
`frontend` · Parent: STORY-01-02-08 · 4 h · New · Depends on: TASK-01-02-08-BE1, TASK-01-02-04-FE2, TASK-01-01-05-FE2
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
  no shot, the newest setup (DQ-18, TQ-16). Action `useSetup(id)` writes the
  cookie. DAL `getSetups()` returns each setup with parts, recipe count
  (latest per key), last used and an `older` flag (90 days).
- **Done when:** A later shot overrides an earlier choice and the reverse
  (AC 1, AC 3); no shots gives the newest setup (AC 2); counts and dates are
  right (AC 4).

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
`qa` · Parent: STORY-01-02-09 · 4 h · New · Depends on: TASK-01-02-09-FE1
- **Build:** Unit tests for the rule with fixed clocks; Node tests for the
  read, rename and isolation; play tests for the cards.
- **Done when:** AC 1 to AC 6 are covered.

#### EPIC-01-03: Log a shot in seconds

##### STORY-01-03-01: Start a shot with what I'm brewing already chosen

##### TASK-01-03-01-BE1 · Add the shot log context read
`backend` · Parent: STORY-01-03-01 · 4 h · Updated (current setup, frozen portions; revision 3: no TASK-01-02-09-BE1) · Depends on: TASK-01-03-03-BE1, TASK-03-02-04-BE1
- **Build:** DAL `getLogContext({ drinkId?, portionId? })`: the household's
  setups with the current one as default, visible drinks and milks, and
  unfinished portions (unopened included, frozen last and flagged), each
  with bean, bag, state and opened clock; `missingSetup` and
  `missingCoffee` flags.
- **Milestone 1 starting values (revision 3):** a small `defaultSetupId`
  inside this task picks the newest setup by `created_at`; there is no
  cookie. TASK-01-02-09-BE1 (wave 6) replaces this rule. Starting drink:
  the drink of the persona's latest shot, else the first visible drink
  (espresso). Starting coffee: the latest shot's portion if it is not
  finished and not frozen; else the open portion opened earliest
  (`isOpen`); else the newest unopened portion.
- **Done when:** The default setup is current, or in Milestone 1 the newest
  (AC 1); options are complete
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
  TASK-01-03-01-BE1, not from Brew; the setup field is read-only); frozen portions show `portion.frozen`; missing setup or
  coffee open the builder or add-bag with return-to, keeping dial values.
- **Done when:** Context arrives pre-chosen (AC 1); changes go through
  SH-SELECT (AC 2, AC 3); a frozen pick is saved as from frozen (AC 4); a
  missing item returns chosen with values kept (AC 5).

##### TASK-01-03-01-QA1 · Test shot log context and missing context
`qa` · Parent: STORY-01-03-01 · 4 h · Updated (revision 3: Milestone 1 skips AC 1 and AC 4) · Depends on: TASK-01-03-01-FE2
- **Build:** Node tests for the context read (current setup, frozen last,
  finished excluded, isolation); play tests for the missing paths.
- **Done when:** AC 2, AC 3 and AC 5 are covered, plus the Milestone 1
  default rule (newest setup, starting drink and coffee). AC 1 is re-tested
  in TASK-02-02-01-QA1 and AC 4 in TASK-03-02-02-QA1.

##### STORY-01-03-02: Set grind, dose, yield and time by touch

##### TASK-01-03-02-FE1 · Add finer and coarser end captions to NumberWheel
`frontend` · Parent: STORY-01-03-02 · 4 h · Unchanged · Depends on: DES-01-03-03
- **Build:** Optional `endCaptions` on NumberWheel, mirrored by inline
  position; stories for `higher`, `lower`, none and RTL.
- **Done when:** Captions point the right way in both directions and RTL.

##### TASK-01-03-02-FE2 · Add the grind scale config from grinder capabilities
`frontend` · Parent: STORY-01-03-02 (also 01-06-08) · 3 h · Unchanged · Depends on: TASK-01-02-01-BE1
- **Build:** `src/domain/grind.ts` `grindWheelConfig(capabilities)`; unknowns
  go to the fallback function (TASK-01-06-08-FE1).
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
  variants and pages that must stay distinct.

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
  `status='verified'` directly, plus isolation cases.
- **Done when:** AC 1 to AC 3 are covered.

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
- **Build:** `recipe.pin` on TasteScreen and ShotDetailScreen (measured only)
  opens PinSheet; confirm calls `pinFromShot`, announces `recipe.pinned`.
  On the tasting screen the choices are saved first.
- **Done when:** Pin is reachable from both (AC 1); absent on one-tap (AC 5);
  failure retries (AC 6).

##### TASK-02-01-01-QA1 · Test pinning from a shot
`qa` · Parent: STORY-02-01-01 · 4 h · Updated · Depends on: TASK-02-01-01-FE2
- **Build:** Node tests: fields copied including prep and milk (AC 2); replace
  across different milk (AC 3); resolution only on the setup (AC 4); one-tap
  rejected (AC 5); edit does not change the recipe, forced failure leaves no
  row (AC 6); isolation; sheet play tests (AC 1).
- **Done when:** AC 1 to AC 6 are covered.

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
  most recently. The builder's `setup.closest` line uses it too.
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
`frontend` · Parent: STORY-02-01-06 · 3 h · New · Depends on: TASK-02-01-06-BE2, TASK-02-02-01-FE1, DES-02-01-05
- **Build:** HomeScreen state: `home.noRecipeOnSetup`, `home.startsFrom`
  naming the closest setup, and only `home.dialIn` as primary, never a
  pull. Check PR #3's HomeScreen props first.
- **Done when:** The state shows with the setup named and no pull (AC 1).

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
`frontend` · Parent: STORY-02-02-01 · 6 h · Updated (clocks line, prep and milk) · Depends on: TASK-02-02-01-BE1, TASK-01-01-07-FE2, TASK-01-01-06-FE4, PR-3, DES-02-02-01
- **Build:** `src/app/(app)/page.tsx` renders HomeScreen (PR #3) with
  `getHome()`: drink title, coffee line with both clocks, large ShotValues
  with prep and milk lines, setup line, `home.pull`, ghost `home.dialIn`;
  states: loading, first run, no recipe, finished coffee, load failed.
  Extend HomeScreen props where PR #3 lacks a state.
- **Done when:** The drink, coffee, values, prep, milk and setup show (AC 1);
  clocks show as AC 2 says once TASK-03-03-04 lands; the finished state offers
  choose and add (AC 6); one primary button in every state.

##### TASK-02-02-01-QA1 · Test the home screen defaults and states
`qa` · Parent: STORY-02-02-01 · 5 h · Updated · Depends on: TASK-02-02-01-FE1
- **Build:** Unit tests in `homeDefaults.test.ts` for AC 2 to AC 5 with fixed
  clocks; a Node test for `getHome`; HomeScreen stories for each state with
  axe; a manual phone check.
- **Done when:** AC 1 to AC 6 are covered.

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
  answer 1; DQ-24 thresholds: under 5 days, over 35 days since roast or
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
- **Done when:** AC 3 to AC 6 examples hold, incl. 18 g in 16 to 20 g giving
  18.5 g and 20 g moving to the next lever.

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
  warning markers are skipped; they are tested when TASK-02-06-01-FE2 lands
  in wave 9.

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
`frontend` · Parent: STORY-02-06-02 · 6 h · Updated · Depends on: TASK-02-06-02-BE1, TASK-01-05-02-FE2, TASK-01-05-03-FE1, TASK-01-05-04-FE1, TASK-01-03-07-FE2, DES-02-06-03
- **Build:** `/log?mode=edit&shotId=`: title `log.titleEdit`, read-only
  context, ShotDial with saved values, prep, milk, sweetened, and the
  tasting controls below (no rating for one-tap), the warning under the tags,
  `log.saveChanges`, the unsaved guard.
- **Done when:** Values and taste show together (AC 1, AC 2); context is
  read-only (AC 3); changes persist (AC 4); leave and confirm leaves the shot
  unchanged (AC 6).

##### TASK-02-06-02-QA1 · Test editing a shot
`qa` · Parent: STORY-02-06-02 · 4 h · Updated · Depends on: TASK-02-06-02-FE1
- **Build:** Node tests for allowed and forbidden fields, one-tap staying
  one-tap with no rating, and remaining following the new dose; play tests
  for layout, warning and discard.
- **Done when:** AC 1 to AC 6 are covered.

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
  reaction, tags and block warning come from TASK-02-06-03-FE3. Measured: `recipe.pin` primary, `shot.dialInFromThis`,
  edit. One-tap: `shot.copiedFromRecipe`, edit primary, dial in, reaction
  slot, no pin. Stories: measured, one-tap, channelling, RTL.
- **Done when:** Stories pass axe; pin is absent for one-tap.

##### TASK-02-06-03-FE3 · Add the reaction, tags and warning to the shot detail
`frontend` · Parent: STORY-02-06-03 · 2 h · New (revision 3) · Depends on: TASK-02-06-03-FE1, TASK-01-05-04-FE1
- **Build:** Extend `ShotDetailScreen` with the reaction, the taste tags and
  the block channelling warning, and wire them from `getShot`.
- **Done when:** Stories for channelling and one-tap show them and pass axe;
  the existing TASK-02-06-03-QA1 tests for the warning and taste phrases
  pass.

##### TASK-02-06-03-FE2 · Wire the shot detail route
`frontend` · Parent: STORY-02-06-03 · 2 h · Unchanged · Depends on: TASK-02-06-03-FE1, TASK-02-06-03-BE1
- **Build:** `src/app/(app)/journal/[shotId]/page.tsx` with `getShot`; edit
  opens `/log?mode=edit`; pin opens PinSheet.
- **Done when:** Edit is at most two taps from the Journal tab.

##### TASK-02-06-03-QA1 · Test shot details
`qa` · Parent: STORY-02-06-03 · 3 h · Updated (revision 3: reaction and warning tests run in wave 9) · Depends on: TASK-02-06-03-FE2
- **Build:** Node test for `getShot` fields; story tests for the measured and
  one-tap actions, taste phrases and the warning.
- **Done when:** AC 1 to AC 5 are covered. In Milestone 1 the reaction and
  warning are skipped; they are tested when TASK-02-06-03-FE3 lands in
  wave 9.

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
- **Build:** `shot.dialInFromThis` opens the log in dial-in mode with the
  `log.fromShot` note; SH-PORTION first when no portion is open; a
  missing-coffee state when finished.
- **Done when:** AC 1 to AC 4 hold; it is two taps from the list.

##### TASK-02-06-06-QA1 · Test dialing in from a past shot
`qa` · Parent: STORY-02-06-06 · 3 h · New · Depends on: TASK-02-06-06-FE1
- **Build:** Node tests for the read, current-setup change on save and the
  untouched source; play tests for the sheet and finished coffee.
- **Done when:** AC 1 to AC 5 are covered.

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
  test for the date error.
- **Done when:** AC 1 to AC 5 are covered.

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
  line in `en` and the test locale.
- **Done when:** AC 1 to AC 5 are covered.

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
  the Meter text and neutral Notice.
- **Done when:** AC 1 to AC 4 are covered.

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

- The five epics in full are 136 tasks and 490 hours. Milestone 1 defers 41
  tasks and 134 hours (the profile screen, the first-run checklist, the part
  screen, the edit mode and the rest in the table below).
- The schema is built whole in Milestone 1 (13 tasks, 38 hours), so the
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

Design work for Milestone 1 is 144 hours (section 8.2).

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

- **One setup, newest is current.** The current setup in Milestone 1 is the
  newest setup by `created_at`. There is no cookie, and
  TASK-01-02-09-BE1 isn't built; a small `defaultSetupId` lives inside
  TASK-01-03-01-BE1. The log's setup field is read-only. The Setup tab lists
  all setups with no marker, and its rows aren't tappable (the part screen,
  TASK-01-02-02-FE5 and FE6, is deferred). TASK-01-02-09-BE1 (wave 6)
  replaces this rule. Consequence: a second setup becomes current and can't
  be switched back until wave 6 (risk R-24, question 3 in section 9.2). The
  setup builder (TASK-01-02-04-*) and the one-tap first setup
  (TASK-01-02-05-*) are kept, because the first setup has to be made.
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
  out the channelling warning, the reaction and the pin action; the new
  TASK-02-06-01-FE2 and TASK-02-06-03-FE3 add them in wave 9. The edit mode
  (STORY-02-06-02) is wholly deferred to wave 9.
- **Brew is the interim screen.** EPIC-02-02 isn't in Milestone 1. Brew is a
  plain screen with one "log a shot" action from TASK-01-01-05-FE3: no
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
| TASK-01-03-01-QA1 | AC 1 and AC 4 | wave 11 and wave 10 |
| TASK-01-02-01-QA1 | AC 6 (private entries) | wave 7 |
| TASK-02-06-01-QA1 | reaction and warning markers | wave 9 |
| TASK-02-06-03-QA1 | reaction and warning | wave 9 |
| TASK-01-02-02-QA1 | part-screen criteria | wave 6 |
| TASK-01-01-01-QA2 | milk checks | wave 6 |
| TASK-03-01-03-QA1 | AC 4 | wave 10 |

#### Deferred after Milestone 1, inside the five epics (41 tasks, 134 h)

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
| EPIC-02-06 | STORY-02-06-02 (edit mode) | BE1, FE1, QA1 | 14 |
| EPIC-02-06 | TASK-02-06-01-FE2, TASK-02-06-03-FE3 (new markers) | FE2, FE3 | 4 |
| EPIC-02-06 | STORY-02-06-04 (Journal filters) | BE1, FE1, FE2, QA1 | 14 |
| EPIC-02-06 | STORY-02-06-05 (open the Journal on what I'm brewing) | FE1, QA1 | 5 |
| EPIC-02-06 | STORY-02-06-06 (dial in from a past shot) | BE1, FE1, QA1 | 10 |
| **Total** | | **41 tasks** | **134 h** |

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
| Wave 11 | DES-02-01-01 to 05, DES-02-02-01, 02, 03, 04 (checklist), 05 | 49 |
| Wave 12 | DES-02-03-01 to 05 | 27 |
| Wave 14 | DES-03-01-04 (coffee screen) | 6 |
| Wave 15 | DES-04-01-01, 02 | 8 |
| **MVP** | | **328** |

Notes:

- Waves 6 and 13 need no new design.
- Wave 3's DES-03-01-02 includes Beans' Tried section and grouping, even
  though Milestone 1 builds only On hand. The designer does the whole screen
  once.
- DES-01-02-06 (setup select) is used in wave 11 for switching; its
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

**Wave 6: milk list, and the current setup.**

1. Milk: TASK-01-01-08-BE2 (adds milks to the bootstrap), FE1, QA1 (with
   the milk checks TASK-01-01-01-QA2 skips). Milks are seeded for new
   households only.
2. Setups: TASK-01-02-09-BE1 (replaces the newest-setup rule),
   BE2, FE1, QA1; TASK-01-02-08-BE1, FE1, QA1.
3. Part screen: TASK-01-02-02-FE5, FE6; then re-test the part-screen
   criteria of TASK-01-02-02-QA1.

**Wave 7: catalog additions (EPIC-01-06).** Can run in parallel with waves 8
and 9.

1. TASK-01-06-03-BE1, TASK-01-06-04-BE1, then TASK-01-06-01-BE2, FE1, FE2,
   FE3, QA1; TASK-01-06-04-FE1, QA1; TASK-01-06-03-QA1.
2. Coffee: TASK-01-06-02-BE1, FE1, QA1; TASK-01-06-05-BE1, FE1, QA1.
3. Capability questions: TASK-01-06-06-BE1, FE1, QA1; TASK-01-06-07-BE1, FE1,
   QA1; TASK-01-06-09-BE1, FE1; the fallbacks TASK-01-06-08-BE1, FE1, FE2, QA1
   wait for wave 8; TASK-01-06-09-FE2 and QA1 wait for the edit mode.

**Wave 8: temperature, pressure, prep and milk in the log.**

1. TASK-01-04-01-FE1, FE2, BE1, FE3, QA1; TASK-01-04-02-BE1, FE1, QA1.
2. Prep: TASK-01-03-06-BE1, FE1, QA1.
3. Milk: TASK-01-03-07-BE1, FE1, FE2, QA1.
4. Fallbacks: TASK-01-06-08-BE1, FE1, FE2, QA1.

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
4. Clocks (backend halves; the screens move to wave 11): TASK-03-03-01-BE1;
   TASK-03-03-04-BE1; TASK-03-03-03-BE1. TASK-02-03-05-BE1 takes the
   clocks as inputs and depends on TASK-03-03-01-BE1 and
   TASK-03-03-04-BE1.
5. Remaining: TASK-03-04-01-FE1; TASK-03-04-02-BE1, FE1, QA1;
   TASK-03-04-03-BE1, FE1, QA1.

**Wave 11: recipes and Brew (EPIC-02-01, EPIC-02-02).**

1. Recipes: TASK-02-01-01-BE2, BE3, FE1, FE2, QA1; TASK-02-01-02-BE1, FE1,
   QA1; TASK-02-01-03-QA1.
2. Brew: TASK-02-02-01-BE1, FE1, QA1.
3. Pull: TASK-02-02-02-BE1, FE1, FE2, QA1; TASK-02-02-03-BE1, FE1, FE2, QA1;
   TASK-02-02-04-BE1, FE1, QA1.
4. Bag recipes: TASK-02-01-04-BE1, FE1, QA1.
5. Choosing: TASK-02-02-06-BE1, FE1, FE2, QA1; TASK-02-02-05-FE1, QA1.
6. Setup switching and the closest setup: TASK-02-01-06-BE1, BE2, FE1, FE2,
   QA1 (FE2 needs wave 12's dial-in mode); TASK-02-02-07-FE1, FE2, QA1.
7. Deferred from Milestone 1: the first-run checklist (TASK-01-01-07-FE1,
   BE1, FE2, QA1; it shows on Brew, and TASK-02-02-01-FE1 depends on FE2,
   so it runs before step 2) and the profile (TASK-01-01-03-BE1,
   FE2, FE3, QA1; it adds the persona label to Brew).
8. At the end of the wave, after Brew and the pull (moved from wave 10 to
   fix an inversion): TASK-03-03-01-FE1 and QA1, TASK-03-03-04-FE1 and QA1,
   TASK-03-03-02-FE1 and QA1, TASK-03-03-03-FE1 and QA1, TASK-03-04-01-FE2
   and QA1. TASK-03-04-01-QA1 runs after TASK-02-02-04-BE1.

**Wave 12: fixing shots and suggestions (EPIC-02-03).**

1. Engine: TASK-02-03-05-BE1; TASK-02-03-06-BE1, BE2, QA1 (the scenario suite).
2. Card: TASK-02-03-05-FE1, FE2, QA1.
3. Reactions and the off sheet: TASK-02-03-01-BE1, FE1, FE2, QA1;
   TASK-02-03-04-BE1, FE1, FE2, QA1.
4. Pending suggestions: TASK-02-03-07-BE1, FE1, QA1.
5. Log modes: TASK-02-03-02-FE1, FE2, QA1; TASK-02-03-03-FE1, QA1.

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
9, 10, 11 and 12 (the suggestions need the tasting and the clocks). Design
runs one wave ahead. Wave 11 is large (about 130 h or more); the clocks' UI
is the easiest part to peel off if it needs splitting.

---

## 9. Questions

### 9.1 Technical decisions

**Resolved (recorded in S-02 and, where they touch the schema, in S-08).**

- **TQ-01 to TQ-07** (Firebase session, one libSQL client, Server Actions,
  millisecond timestamps, the recalibration flag, "not sure" capabilities and
  local days) were accepted as proposed. They are implemented by
  TASK-01-01-01-BE1, BE3 to BE5, TASK-01-02-01-BE1, TASK-02-06-01-BE2,
  TASK-04-01-01-BE1 and TASK-01-06-06-BE1.
- **TQ-10** is supplied by the Head of Product for Milestone 1: the Head of Product supplies
  the seed (their own equipment and a few coffees, TASK-01-02-01-BE6). Who
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
3. **Second setup in Milestone 1.** A second setup becomes current and can't
   be switched back until wave 6. Alternative: hold the builder to one setup
   until wave 6.
4. **DQ-11 fallback ranges** for "not sure" equipment live in one domain
   module (TASK-01-06-08-BE1). Confirm before QA.
5. **DQ-10 "add anyway"** on a duplicate link is built behind a flag, off.
   Confirm off or on.
6. **SQ-16: who owns the first-run checklist.** Planned under STORY-01-01-07.
   It doesn't affect the code.
7. **Seed content (TASK-01-02-01-BE6).** Please supply: your machine, grinder
   and baskets with their dose ranges, and the coffees, as public product
   facts only. TASK-01-02-01-BE6 is blocked on it.
8. **DQ-24 freshness thresholds** (review m5) are still to confirm.

Closed in revision 3: the size of Milestone 1 (now 368 h), the section guard
(TASK-01-01-05-FE8 retired), dose with an unknown basket range (never
suggested without a range, TASK-02-03-06-BE2), Brew in Milestone 1 (a plain
screen with one "log a shot" action), TQ-08 and TQ-09.

Closed by the Head of Product's six answers and S-02: step sizes (SQ-19), the
temperature lever (SQ-21), typical milk amounts, the basket dose range
(SQ-20), Tried and personas, and coffee used (SQ-14). Also closed: DQ-08
(taste tags), INIT-03 Q2 (no estimated age) and the retired-unit question
(no retire).

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
- **R-13 EPIC-01-06 size and order.** 108 h. Only URL normalisation is in
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
  grind-period dependency is now declared (TASK-04-01-03-BE1 on
  TASK-02-03-06-BE1 and BE2, and moved to wave 10).
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
- **R-24 Second setup in Milestone 1 (new).** The newest setup is current, so
  a second setup becomes current and can't be switched back until wave 6
  (TASK-01-02-09-BE1). Question 3 in section 9.2.
- **R-25 Wave 11 size (new).** Wave 11 is large (about 130 h or more). The
  clocks' UI is the easiest to peel off if it needs splitting.
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
| EPIC-01-02 | Describe your setup once | 6 | 33 | 131 |
| EPIC-01-03 | Log a shot in seconds | 7 | 24 | 83 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | 2 | 8 | 27 |
| EPIC-01-05 | Say how it tasted | 4 | 14 | 45 |
| EPIC-01-06 | Add what's missing from the catalog | 9 | 31 | 109 |
| **INIT-01** | | **36** | **151** | **540** |
| EPIC-02-01 | Pin the recipe that worked | 5 | 18 | 60 |
| EPIC-02-02 | Pull your daily shot in one tap | 7 | 23 | 83 |
| EPIC-02-03 | Fix a bad shot from your recipe | 7 | 23 | 86 |
| EPIC-02-06 | Look back in your journal | 6 | 22 | 71 |
| **INIT-02** | | **25** | **86** | **300** |
| EPIC-03-01 | Add a bag of beans | 4 | 16 | 60 |
| EPIC-03-02 | Split and freeze a bag | 5 | 15 | 47 |
| EPIC-03-03 | Know how fresh your beans really are | 4 | 11 | 33 |
| EPIC-03-04 | See how much coffee is left | 3 | 10 | 28 |
| EPIC-03-06 | See every coffee you've tried | 4 | 12 | 36 |
| **INIT-03** | | **20** | **64** | **204** |
| EPIC-04-01 | Record maintenance on your equipment | 4 | 14 | 38 |
| **INIT-04** | | **4** | **14** | **38** |
| **Total** | | **85** | **315** | **1,082** |

The schema, migrations and test harness (section 6, 15 tasks, 45 hours) are
counted in the epics of the stories they're parented to.

**Compared with revision 1:** 252 tasks and 851 hours became 313 tasks and
1,084 hours (+61 tasks, +233 hours): 75 added, 14 retired, 129 updated and
109 unchanged. The largest increases are EPIC-02-03 (the suggestions, +62 h),
EPIC-03-06 (new, 36 h) and the setup work in EPIC-01-02 (+12 h).

**Milestone 1 (section 8.1):** 99 tasks, 368 hours; design 144 h; the rest of
the MVP is 216 tasks, 714 hours.

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

**Not included:** Next and Later epics (section 1), design hours (328 h for
the MVP, section 8.2), GitHub issues, and any change to scope.
