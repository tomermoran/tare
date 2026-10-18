# Tare engineering tasks (draft, MVP)

Source: `planning/drafts/stories.md` (revision 2, approved, 119 stories),
`planning/drafts/design.md` (approved), `planning/drafts/epics.md` (revision 5,
final, MVP build order), `docs/spec.md` (S-02 decisions, S-08 target schema)
and the codebase on branch `planning/breakdown-drafts`, plus open PR #3
(`design/mvp-screens`) as described below.

**Status: draft for the Head of Product.** Nothing is built, no code is
written and no GitHub issues are created. Questions that block a task are
named in that task's dependencies (`TQ-NN`, `DQ-NN`, `X-1` and so on) and
listed in section 9.

**Scope.** Only the 69 MVP stories in the 15 MVP epics are broken down:
**252 tasks, 851 hours** (about 106 developer-days). Next and Later stories are
listed in section 1 and not broken down.

## Contents

1. Not broken down yet
2. How to read this file
3. What exists and what this plan assumes
4. Technical approach (proposed, with flagged decisions)
5. Definition of done for every task
6. Schema and migrations (first)
7. Tasks by story
8. Build order
9. Questions
10. Technical risks and tech debt
11. Totals

---

## 1. Not broken down yet

These are **not broken down yet: re-planned before they're built.**

**Next (27 stories, 8 epics).** These come after the MVP. Several depend on
questions that are still open, and the MVP's code will change what they
need.

| Epic | Stories | Why not now |
|---|---|---|
| EPIC-05-03 Keep your coffee history when you change phones | STORY-05-03-01, 02, 03 | First Next epic. The plan depends on how Firebase auth is wired in the MVP (TQ-01). |
| EPIC-02-05 Make the drink list yours | STORY-02-05-01, 02, 03, 04 | Next. What happens to recipes when their drink is hidden is still open. |
| EPIC-02-04 Give one bag its own recipe | STORY-02-04-01, 02 | Next, and blocked on INIT-02 Q1 (bag override or bean default). |
| EPIC-03-05 Know when you'll run out | STORY-03-05-01, 02, 03 | Next. "Enough history" and the accuracy target (X-2) aren't defined. |
| EPIC-05-01 Brew for someone else in the household | STORY-05-01-01, 02, 03, 04 | Next. Removing a persona is still open. |
| EPIC-04-02 Suggested grind that follows bean age and recent shots | STORY-04-02-01 to 06 | Next. The algorithm depends on INIT-04 Q2 to Q4. |
| EPIC-04-03 Re-dial once after maintenance and keep every recipe | STORY-04-03-01, 02, 03 | Next. It needs EPIC-04-02's aging estimate. |
| EPIC-04-04 Keep recipes right after new burrs of a different design | STORY-04-04-01, 02 | Next. The fitting method is still open. |

**Later (23 stories, 7 epics).** These are AI and community features. The
stories are light placeholders, and each epic needs evals and a model choice
first (S-01).

| Epic | Stories | Why not now |
|---|---|---|
| EPIC-05-02 Invite them to take over their own profile | STORY-05-02-01 to 04 | Later (phase 3). Invite delivery and roles are still open. |
| EPIC-06-01 Scan a bag instead of typing it | STORY-06-01-01, 02, 03 | Later. It's an AI feature, and the model and eval set aren't chosen. |
| EPIC-06-02 Get a grounded fix when a shot goes wrong | STORY-06-02-01, 02, 03 | Later. It's an AI feature with RAG, and STORY-06-02-02 is flagged to split. |
| EPIC-06-04 Tare learns your palate as you log | STORY-06-04-01, 02, 03 | Later. The contents of a taste graph aren't defined. |
| EPIC-06-05 Share your shots, with your consent | STORY-06-05-01, 02, 03 | Later. Consent withdrawal and cohort grouping are still open. |
| EPIC-06-06 Start a new bag from the community, tuned to you | STORY-06-06-01 to 04 | Later. It depends on four other Later epics. |
| EPIC-06-07 Merge duplicate catalog entries, with AI suggestions | STORY-06-07-01, 02, 03 | Later. Merges are a manual admin task until then (S-02). |

MVP code is written so that these epics can follow without rework. Catalog
readers follow merge pointers, `share_data_consent` and
`is_network_eligible` exist but stay false, and persona selection goes
through one function.

---

## 2. How to read this file

- **Task ID:** `TASK-II-EE-SS-XXn`: the story ID, then `BE` (backend), `FE`
  (frontend) or `QA`, then a number within that story. Example:
  `TASK-01-01-01-BE1`.
- **Format.** Each task gives its label, its parent story, its estimate and its
  dependencies, then **Build** (what to build and which files it touches)
  and **Done when** (checkable conditions, with acceptance criteria cited as
  `AC n` of the parent story).
- **Dependencies** are task IDs plus:
  - `DES-*`: design tasks from `design.md`.
  - `PR-3`: open PR #3 merged into `main`.
  - Questions that must be answered first (section 9).
- **Grouping.** Schema and migration tasks are listed first (section 6), each
  with the story that first needs it. Everything else is grouped by epic and
  story (section 7). The suggested order across all tasks is section 8.
- **Estimates** are hours of focused work, 2 to 16, including the task's own
  stories or tests and its review fixes. Nothing exceeds 16.
- **"Wire"** means connecting a props-only screen to a route, its data
  (Server Component reads) and its mutations (Server Actions).

---

## 3. What exists and what this plan assumes

**In this checkout (read before planning)**

- Next.js 16.4 App Router, `src/app` with a placeholder `page.tsx` and a root
  layout that provides next-intl (`en` only, no locale routing,
  `src/i18n/config.ts` has RTL detection).
- `src/db/schema.ts`: conventions comment only, no tables.
  `drizzle.config.ts` uses the `turso` dialect, migrations go to
  `src/db/migrations`, and the default URL is `file:./data/tare.db`. There's
  no `src/db` client yet.
- `src/lib/units.ts`: `msToSeconds`, `secondsToMs`, decimal parsing and
  sanitising, `formatValueParts`, `unitSymbol`. `CanonicalUnit` is
  `gram | second | celsius` (no Fahrenheit yet).
- `src/components/ui`: Button, Card, Input, NumberWheel (drag, flick,
  keyboard, typed entry, RTL), and `src/components/brand/Logo`.
- `src/i18n/messages/en.json`: `app`, `actions`, `shot` keys only.
- Vitest has one project, Storybook story tests in headless Chromium with axe
  (`a11y.test: "error"`). There's **no Node test project**, so nothing can test
  the database or server code yet.
- Dependencies: no Firebase SDKs and no validation library.

**From open PR #3, treated as existing (props-only, no data wiring)**

- `src/components/ui`:
  - TabBar (NC-01)
  - PageHeader (NC-02)
  - ListRow (NC-03)
  - ChipGroup (NC-04)
  - SelectField (NC-06)
  - Toggle (NC-13)
  - ShotValues (NC-08)
  - ShotDial (NC-09)
- `src/components/screens`: HomeScreen, ShotLogScreen and RecentShotsScreen
  with stories, plus fixtures and PhoneFrame.
- Every task that reuses these depends on `PR-3`. Where a task extends one of
  them, the task says so and asks the developer to check what PR #3 already
  covers first. The estimate assumes the extension is needed.

**Not built yet, planned here (each gets its own Storybook task before use)**

- Sheet (NC-05)
- PulledState (NC-07): extracted from HomeScreen
- Notice (NC-10)
- Skeleton (NC-11)
- EmptyState and Checklist (NC-12)
- Icon (NC-14)
- Meter (NC-15)
- NumberWheel finer and coarser captions, and the Fahrenheit unit
- The sheets: SH-SELECT, SH-PORTION, SH-PIN, SH-PORTION-ACTIONS, SH-SPLIT,
  SH-STOCK, SH-DATE and SH-MAINTENANCE. SH-CONFIRM is built with Sheet.
- Every screen except HomeScreen, ShotLogScreen and RecentShotsScreen.

---

## 4. Technical approach (proposed, with flagged decisions)

The spec doesn't settle these decisions, so each one is a question in section
9. The tasks are written against the proposals below, so a different answer
changes only the tasks named.

**Module layout**

| Path | What lives there |
|---|---|
| `src/db/client.ts` | One libSQL client and Drizzle instance, `import "server-only"` |
| `src/db/schema.ts` | All S-08 tables |
| `src/db/migrations/` | Generated by `db:generate`, one migration per schema task |
| `src/db/seed/` | Catalog seed data and an idempotent loader (`npm run db:seed`) |
| `src/domain/` | Pure TypeScript with no database or React: capabilities, grind scale, toolkit rules, recipe resolution, home defaults, bean age, remaining weight, portion state, grind periods, URL normalisation, defects, local-day helpers. Most rules live here and are unit-tested. |
| `src/server/auth/` | Firebase token verification and the session (TQ-01) |
| `src/server/dal/` | Household-scoped reads, `server-only`. Every function takes the session's household. |
| `src/server/actions/` | `"use server"` mutations. Each one verifies the session and household ownership first (STORY-01-01-04). |
| `src/app/(app)/` | Tab routes with the TabBar: `/` (Brew), `/shots`, `/shots/[shotId]`, `/pantry`, `/pantry/[batchId]`, `/kit`, `/kit/units/[unitId]` |
| `src/app/(task)/` | Full-screen tasks without the TabBar: `/log`, `/taste/[shotId]`, `/pantry/add`, `/kit/add`, `/kit/toolkits/new`, `/kit/toolkits/[toolkitId]`, `/catalog/pick`, `/catalog/add`, `/profile` |
| `src/app/api/` | Route Handlers, used only where Server Actions don't fit (TQ-03): `session`, `catalog/search`, `catalog/check-url` |
| `src/components/screens/` | Props-only screens with stories, following PR #3's pattern. Fixtures stay generic and fictional. |

**Proposals that tasks depend on**

- **Auth (TQ-01).**
  - The browser signs in anonymously with the Firebase JS SDK.
  - It posts the ID token to `POST /api/session`. The server verifies the
    token with the Firebase Admin SDK and sets an httpOnly session cookie.
  - The DAL verifies the cookie on each request (cached per request with
    React `cache`) and maps the Firebase uid to a user and household.
  - When the cookie expires, the client silently exchanges a fresh token.
- **Database access (TQ-02).** Server Components and Server Actions call the
  DAL directly on the Node.js runtime. There's no separate API server, and
  migrations run at deploy time, never at request time.
- **Mutations (TQ-03).**
  - Server Actions handle every write, then call `refresh()` or
    `revalidatePath`.
  - Route Handlers serve typeahead search and the URL check, because the
    client dispatches Server Actions one at a time and can't abort them.
- **Timestamps (TQ-04, X-1).** Drizzle `integer(..., { mode: 'timestamp_ms' })`,
  as `CLAUDE.md` and the `schema.ts` comment require. S-08 as written uses
  `mode: 'timestamp'`, which stores seconds.
- **Local days (TQ-07).** The client stores its IANA time zone in a cookie.
  Day grouping, "today", the time-of-day drink and bean age are computed in
  that zone. A back-dated date is stored as local noon of that day.
- **IDs (TQ-11).** `crypto.randomUUID()` text keys. A one-tap pull sends a
  client-generated ID, which makes double taps idempotent.
- **Validation.** Hand-written guards in `src/domain` and `src/server`. No new
  dependency is needed. Adding one (for example zod) is a team choice, not
  planned.
- **Return-to and drafts.** A `returnTo` query parameter, plus a
  sessionStorage draft store keyed by task. A side task returns to the
  original task with the new item selected and nothing lost.
- **Last screen (STORY-01-01-05 AC 5).** "Shortly" is set to **5 minutes**,
  the tech lead's call as the story allows. The path and time are kept in
  localStorage.
- **Undo (DQ-04, TQ-15).** An 8-second window in the UI. The server accepts an
  undo up to 13 seconds after the pull, only for a one-tap shot logged by the
  same user.

---

## 5. Definition of done for every task

These apply to every task and aren't repeated in each one:

- `npm run lint`, `npx tsc --noEmit`, `npx vitest run` (story tests with axe)
  and, from TASK-01-01-04-QA1 onward, the Node test project all pass.
- No user-facing string in code. New keys go in `src/i18n/messages/en.json`,
  grouped as design section 1.3 says (`home.*`, `log.*` and so on).
  Components take text as props, and stories read text from `en.json`.
- Numbers and units go through `Intl`, `useFormatter` or `src/lib/units.ts`.
  Shot time is stored in ms and shown in seconds with one decimal.
- Logical CSS only: no `ml mr pl pr left right text-left text-right border-l
  border-r`. Every new component has an RTL story.
- Semantic tokens only. `signal` appears only through the Notice warning tone.
  `ink-tertiary` is used only at 18 px and above. No shadows.
- No derived values or formatted strings are stored.
- No personal data in code, fixtures, seed data, stories or tests. Example
  data is obviously fictional or generic.
- Small, focused commits with an imperative subject and a body that says why.
- Server Actions and DAL functions check the session and household (from
  TASK-01-01-04-BE1 onward), and each one adds its case to the isolation suite
  (TASK-01-01-04-QA2).

---

## 6. Schema and migrations (first)

These implement S-08 in `src/db/schema.ts`, each as its own task with its own
generated migration, before any feature code uses the table. They differ
from S-08 in three ways, each flagged as a question:

- Timestamps use `timestamp_ms` (TQ-04).
- `maintenance_events` gets an `is_recalibration` column (TQ-05).
- The `capabilities` JSON shape allows "not sure" values (TQ-06).

They also add indexes, which change no behaviour. Circular references
(`maintenance_events.offset_source_recipe_id` to `pinned_recipes`, and
`pinned_recipes.source_extraction_id` to `extractions`) use Drizzle's
lazy `references(() => …)`, as S-08 does.

##### TASK-01-01-01-BE1 · Add the database client and data access layer skeleton
`backend` · Parent: STORY-01-01-01 · 4 h · Depends on: TQ-02
- **Build:**
  - `src/db/client.ts`: a libSQL client and Drizzle instance with
    `server-only`, reading `DATABASE_URL` and `DATABASE_AUTH_TOKEN`. Check
    whether foreign keys are enforced on libSQL connections, and turn them on
    if not.
  - The ID helper `src/db/ids.ts` (TQ-11).
  - The empty `src/server/dal/` and `src/server/actions/` folders with an
    index of conventions.
  - `.env.example` with placeholder variable names only, and `data/` in
    `.gitignore` if it's missing.
- **Done when:**
  - `npm run dev` connects to `file:./data/tare.db`.
  - Importing the client from a client component fails the build.
  - Foreign-key enforcement is verified on.
  - No secrets are committed.

##### TASK-01-01-01-BE2 · Add users, households, household members and personas tables
`backend` · Parent: STORY-01-01-01 (also 01-01-03, 01-01-04) · 3 h · Depends on: TASK-01-01-01-BE1, TQ-04
- **Build:** The S-08 tables `users` (with `firebase_uid` unique),
  `households`, `household_members` (composite primary key) and `personas`
  (nullable `name`, `is_default`), in `src/db/schema.ts`. Timestamps per
  TQ-04, plus a migration.
- **Done when:**
  - The migration applies to an empty database.
  - Column names and types match S-08, except for the timestamp mode.
  - `firebase_uid` uniqueness is enforced.

##### TASK-01-01-02-BE1 · Add the drink types table
`backend` · Parent: STORY-01-01-02 · 2 h · Depends on: TASK-01-01-01-BE2
- **Build:** `drink_types` per S-08 (`name_key`, `name`, `has_milk`, `hidden`,
  `sort_order`), with an index on `(household_id, sort_order)`, and a
  migration.
- **Done when:** The migration applies, and a row with only `name_key` and
  one with only `name` are both valid.

##### TASK-01-02-01-BE1 · Add hardware makers and models, with a typed capabilities shape
`backend` · Parent: STORY-01-02-01 (also 01-02-02, 01-06-06 to 09) · 4 h · Depends on: TASK-01-01-01-BE2, TQ-06
- **Build:**
  - `hardware_makers` and `canonical_hardware` per S-08 (`source`, `status`,
    `merged_into_id`, `created_by_household_id`), plus a migration.
  - `src/domain/capabilities.ts`: the TypeScript type for the `capabilities`
    JSON (machine temperature and pressure, grinder grind), including the
    "not sure" values proposed in TQ-06, a `parseCapabilities` guard that
    rejects malformed JSON, and the column typed with `$type<>()`.
- **Done when:**
  - The migration applies.
  - The guard accepts every shape in S-08 and the TQ-06 unknowns, and rejects
    an unknown `control`.
  - The guard has unit tests (run once TASK-01-01-04-QA1 lands).

##### TASK-01-02-01-BE2 · Add catalog URLs, aliases and merges tables
`backend` · Parent: STORY-01-02-01 (also 01-06-04, 01-06-05) · 3 h · Depends on: TASK-01-02-01-BE1
- **Build:** `catalog_urls` (index on `normalized_url`), `catalog_aliases`
  (index on `entity_type, name`) and `catalog_merges` per S-08, plus a
  migration. `catalog_merges` is only written by the manual admin task in
  the MVP (S-02).
- **Done when:** The migration applies, and an alias or URL can point at a
  maker, model, roaster or bean.

##### TASK-03-01-01-BE1 · Add roasters and beans tables
`backend` · Parent: STORY-03-01-01 (also 01-06-02) · 2 h · Depends on: TASK-01-01-01-BE2
- **Build:** `roasters` and `canonical_beans` per S-08 (`roast_level`,
  `tasting_notes` JSON), plus a migration.
- **Done when:** The migration applies, and `tasting_notes` round-trips a
  string array.

##### TASK-01-02-02-BE1 · Add owned hardware and toolkits tables
`backend` · Parent: STORY-01-02-02 (also 01-02-03 to 07) · 2 h · Depends on: TASK-01-02-01-BE1
- **Build:** `owned_hardware` (`retired_at`, index on `household_id`) and
  `toolkits` (`components` typed as `string[]`) per S-08, plus a migration.
- **Done when:** The migration applies. JSON `components` can be queried with
  `json_each` for "toolkits containing this unit".

##### TASK-03-01-02-BE1 · Add batches, portions and stock checks tables
`backend` · Parent: STORY-03-01-02 (also 03-02, 03-04) · 3 h · Depends on: TASK-03-01-01-BE1
- **Build:** `batches`, `batch_portions` (index on `batch_id`) and
  `stock_checks` (index on `portion_id, checked_at`) per S-08, plus a
  migration. Weights are `real` grams.
- **Done when:** The migration applies, and no status, age or remaining column
  exists (they're calculated, never stored).

##### TASK-01-03-03-BE1 · Add the extractions table
`backend` · Parent: STORY-01-03-03 (also every shot story) · 3 h · Depends on: TASK-01-02-02-BE1, TASK-03-01-02-BE1, TASK-01-01-02-BE1
- **Build:**
  - `extractions` per S-08: `entry_mode`, the MVPayload, `yield_time` as
    integer ms, the optional temperature and pressure pairs, sensory fields,
    `defects` JSON, `reaction`, and `is_network_eligible` defaulting to false.
  - Indexes on `(household_id, created_at)`, `(portion_id)` and
    `(grinder_id, created_at)`.
  - A migration.
- **Done when:**
  - The migration applies.
  - `yield_time` is an integer.
  - A row needs the toolkit, grinder, machine, portion, drink, persona and
    logging user.

##### TASK-02-01-01-BE1 · Add the pinned recipes table
`backend` · Parent: STORY-02-01-01 (also 02-01-02 to 05, 01-02-07) · 2 h · Depends on: TASK-01-03-03-BE1
- **Build:** `pinned_recipes` per S-08 (nullable `batch_id` and
  `source_extraction_id`), with an index on `(bean_id, persona_id,
  toolkit_id, drink_type_id, pinned_at)`, plus a migration.
- **Done when:** The migration applies. Two pins for the same key can coexist,
  so re-pinning adds a row.

##### TASK-04-01-01-BE1 · Add the maintenance events table
`backend` · Parent: STORY-04-01-01 (also 04-01-02 to 04) · 2 h · Depends on: TASK-02-01-01-BE1, TQ-05
- **Build:**
  - `maintenance_events` per S-08 (`grind_shift`, `grind_scale` and
    `offset_source_recipe_id` stay null in the MVP), with an index on
    `(owned_hardware_id, occurred_at)`.
  - If TQ-05 is approved, add `is_recalibration` (boolean, not null, default
    false). Otherwise ship without it and add it in its own migration later.
  - A migration.
- **Done when:** The migration applies, and the offset columns exist but no MVP
  code writes them.

##### TASK-01-01-04-QA1 · Add a Node test project with a migrated test database and fixtures
`qa` · Parent: STORY-01-01-04 · 5 h · Depends on: TASK-01-01-01-BE1, TQ-09
- **Build:**
  - A second Vitest project (`unit`, Node environment) in `vitest.config.ts`,
    next to the existing storybook project. It covers `src/domain/**/*.test.ts`
    and `src/server/**/*.test.ts`.
  - A helper that creates an in-memory libSQL database and applies
    `src/db/migrations` for each test file.
  - Fixture builders for a household with a user, persona, drinks, kit,
    toolkit, bag and portion, all with generic data.
  - A way to call Server Actions with a fake session.
- **Done when:**
  - `npx vitest run` runs both projects.
  - A sample test creates two households in isolation.
  - The CLAUDE.md commands section is noted for update in the PR description
    (not edited by this plan).

##### TASK-01-01-01-QA1 · Verify the schema and migrations against S-08
`qa` · Parent: STORY-01-01-01 · 3 h · Depends on: TASK-04-01-01-BE1, TASK-01-01-04-QA1
- **Build:** A schema test that applies all migrations from empty and checks:
  - every S-08 table and column exists with the right type and nullability;
  - `yield_time` is an integer and measurements are `real`;
  - the documented deviations (TQ-04, TQ-05) are present;
  - none of the calculated values (remaining weight, status, age) has a
    column.
- **Done when:** The test passes and fails if a column is renamed or retyped.

---

## 7. Tasks by story

### EPIC-01-01: Start brewing without setting anything up

#### STORY-01-01-01: Open the app and start, with no sign-in

Schema: TASK-01-01-01-BE1, TASK-01-01-01-BE2, TASK-01-01-01-QA1 (section 6).

##### TASK-01-01-01-BE3 · Add Firebase anonymous sign-in on the client
`backend` · Parent: STORY-01-01-01 · 4 h · Depends on: TASK-01-01-01-BE1, TQ-01
- **Build:**
  - `src/lib/firebase/client.ts`: initialises the Firebase app from public env
    config (`NEXT_PUBLIC_FIREBASE_*`), signs in with `signInAnonymously`, and
    exposes `getIdToken()`.
  - Persistence stays the SDK default (IndexedDB), so a reopen keeps the same
    uid.
  - Add the `firebase` dependency with `npx npm@11 install` (CLAUDE.md).
- **Done when:**
  - A fresh browser gets a uid, and a reload keeps it (AC 5).
  - There's no sign-in UI (AC 1).
  - Config comes only from env, and none is committed.

##### TASK-01-01-01-BE4 · Verify the Firebase ID token on the server and keep a session
`backend` · Parent: STORY-01-01-01 · 6 h · Depends on: TASK-01-01-01-BE3, TASK-01-01-01-BE2, TQ-01, TQ-03
- **Build:**
  - `src/app/api/session/route.ts` (POST) verifies the ID token with
    `firebase-admin` `verifyIdToken`, then sets an httpOnly, Secure,
    SameSite=Lax session cookie made with `createSessionCookie`.
  - `src/server/auth/session.ts` provides `getSession()`, which verifies the
    cookie and resolves user, household and default persona, with a
    per-request `cache`, and `requireSession()`, which throws if the session
    is missing.
  - On an expired or invalid cookie the client re-exchanges a fresh token
    silently.
  - Service-account credentials come from env secrets only.
- **Done when:**
  - A forged or expired token is rejected.
  - A valid one yields a session.
  - Server Components and Server Actions can both call `getSession()`.
  - Clearing the cookie recovers the same account with no user action
    (AC 5).

##### TASK-01-01-01-BE5 · Create the user, household, persona and starter drinks in one transaction
`backend` · Parent: STORY-01-01-01 · 4 h · Depends on: TASK-01-01-01-BE4, TASK-01-01-02-BE2
- **Build:**
  - `src/server/auth/bootstrap.ts`, called from the session route the first
    time a uid is seen. In one transaction it creates the `users` row,
    `households`, a `household_members` row with role `owner`, a default
    persona (`name` null, `is_default` true) and the starter drinks
    (TASK-01-01-02-BE2).
  - It's idempotent on `firebase_uid`: a retry after a failure finds the
    existing user or creates everything.
- **Done when:**
  - A failure midway leaves no partial rows (AC 4).
  - Two concurrent first calls create exactly one household.
  - A second launch creates nothing new (AC 5).
  - No personal data is stored (S-02).

##### TASK-01-01-01-FE1 · Build the start screen (SCR-START) with its story
`frontend` · Parent: STORY-01-01-01 · 4 h · Depends on: DES-01-01-01, TASK-01-01-06-FE1
- **Build:** `src/components/screens/StartScreen`, props-only. It shows
  `LogoWordmark` centred on `paper` in these states:
  - normal: wordmark only, no spinner;
  - slow: `start.slow` under the wordmark;
  - failed: `start.failed` in `text-h3`, one sentence, and a primary
    `actions.retry`.

  Stories cover each state, plus RTL.
- **Done when:**
  - The stories pass axe.
  - There's no sign-in, consent or survey element (AC 1).
  - Failed shows retry and nothing partial (AC 4).

##### TASK-01-01-01-FE2 · Wire first launch: sign in, start a session, land on Brew
`frontend` · Parent: STORY-01-01-01 · 5 h · Depends on: TASK-01-01-01-FE1, TASK-01-01-01-BE5, TASK-01-01-05-FE3
- **Build:**
  - The `(app)` layout checks `getSession()`. With no session it renders a
    client `StartGate` that:
    - signs in;
    - posts the token to `/api/session`;
    - shows the slow state after 3 seconds;
    - shows failed with retry on error;
    - calls `router.refresh()` on success.
  - With a session it renders the app shell.
- **Done when:**
  - A first open reaches Brew with no prompts (AC 1, AC 2).
  - The slow message appears after 3 seconds (AC 3).
  - Offline shows failed and retry, and retrying online succeeds (AC 4).
  - A reopen goes straight to the app (AC 5).

##### TASK-01-01-01-QA2 · Test first launch, failure and reopening
`qa` · Parent: STORY-01-01-01 · 5 h · Depends on: TASK-01-01-01-FE2
- **Build:**
  - Node tests for bootstrap: creates exactly one user, household, owner
    membership, default persona and 9 drinks (AC 2); is atomic when a step
    throws (AC 4); is idempotent on retry and under concurrent calls (AC 4,
    AC 5).
  - Session route tests: invalid, expired and valid tokens.
  - StartScreen play tests for slow and failed with retry (AC 3, AC 4).
  - A manual check script in the PR description: first launch in a private
    window, then offline.
- **Done when:** All tests pass, and each AC 1 to AC 5 maps to at least one
  test or manual step.

#### STORY-01-01-02: Get a starter drink list in my language

Schema: TASK-01-01-02-BE1.

##### TASK-01-01-02-BE2 · Seed the starter drinks for each new household
`backend` · Parent: STORY-01-01-02 · 2 h · Depends on: TASK-01-01-02-BE1
- **Build:**
  - `src/domain/starterDrinks.ts`: the nine drinks in S-02 order, each with
    `name_key` (`drinks.espresso` and so on), `has_milk` and `sort_order`.
  - `has_milk` is true for cortado, flat white, cappuccino, latte and
    macchiato. No behaviour uses it yet (EPIC-01-03 open question).
  - A function that inserts them for a household inside the bootstrap
    transaction.
  - `drinks.*` keys in `en.json`.
- **Done when:** A new household has exactly these nine rows, its own copy,
  and no stored names (AC 1, AC 4).

##### TASK-01-01-02-FE1 · Add one helper that shows a drink's name
`frontend` · Parent: STORY-01-01-02 · 2 h · Depends on: TASK-01-01-02-BE2
- **Build:** `src/domain/drinkName.ts` with
  `drinkLabel(drink, t) = drink.name ?? t(drink.nameKey)`, plus a typed hook
  wrapper. Every screen that shows a drink uses it.
- **Done when:** The helper is used everywhere a drink name appears (searched
  at review), and stored names win over keys.

##### TASK-01-01-02-QA1 · Test the starter list, its translation and household separation
`qa` · Parent: STORY-01-01-02 · 3 h · Depends on: TASK-01-01-02-FE1, TQ-08
- **Build:**
  - Node tests: nine drinks in order (AC 1), and two households get separate
    rows (AC 4).
  - Story tests that render the drink list with `en` and a test-only messages
    fixture for a second language (TQ-08): names follow the language, with
    the same count and IDs (AC 2, AC 3).
- **Done when:** The tests pass. If TQ-08 picks a shipped second language,
  the fixture is replaced by its messages file.

#### STORY-01-01-03: See and rename my profile

##### TASK-01-01-03-BE1 · Add profile read and persona rename
`backend` · Parent: STORY-01-01-03 · 3 h · Depends on: TASK-01-01-04-BE1
- **Build:**
  - DAL `getProfile()`: the default persona's name, plus the app version from
    `package.json` at build time.
  - Action `renamePersona(name)`: trims the name, stores an empty name as
    `null`, and only for the household's default persona.
  - `src/domain/personaLabel.ts`: `name ?? t('profile.defaultName')`.
- **Done when:**
  - Empty and whitespace names store null (AC 4).
  - Another household's persona can't be renamed.
  - The label helper is the only way a persona name is shown (AC 1, AC 3).

##### TASK-01-01-03-FE1 · Fix the Input placeholder contrast
`frontend` · Parent: STORY-01-01-03 · 2 h · Depends on: DES-01-01-04
- **Build:** In `src/components/ui/Input`, replace
  `placeholder:text-ink-tertiary` (fails contrast at 16 px) with the token
  DES-01-01-04 picks. Add Input stories for `type="date"`, `type="url"` and
  `inputMode="decimal"` (design section 3).
- **Done when:** The Input stories pass axe with a placeholder, and the new
  type stories exist.

##### TASK-01-01-03-FE2 · Build the profile screen (SCR-PROFILE) with its story
`frontend` · Parent: STORY-01-01-03 · 4 h · Depends on: DES-01-01-04, TASK-01-01-03-FE1, TASK-01-01-06-FE1, PR-3
- **Build:** `src/components/screens/ProfileScreen`, props-only:
  - PageHeader with back;
  - a `profile.name` Input with the role label as its hint, not its
    placeholder;
  - the `profile.device` sentence in ink;
  - `profile.about` with name and version;
  - a save-failed Notice that keeps the typed value.

  Stories: unnamed, renamed, save failed, RTL.
- **Done when:**
  - The stories pass axe.
  - The device sentence uses no `signal` (AC 5).
  - Save failed keeps the input (AC 6).

##### TASK-01-01-03-FE3 · Wire the profile route and the persona label on Brew
`frontend` · Parent: STORY-01-01-03 · 3 h · Depends on: TASK-01-01-03-FE2, TASK-01-01-03-BE1, TASK-01-01-05-FE4
- **Build:** `src/app/(task)/profile/page.tsx` reads `getProfile()` and saves
  through `renamePersona` with `useActionState`. The persona label at the top
  of Brew opens it.
- **Done when:**
  - Renaming shows the new name on Brew and Profile (AC 3).
  - Clearing restores the label (AC 4).
  - A failure keeps the text and allows retry (AC 6).

##### TASK-01-01-03-QA1 · Test the profile label, rename and failure paths
`qa` · Parent: STORY-01-01-03 · 3 h · Depends on: TASK-01-01-03-FE3
- **Build:**
  - Node tests for `renamePersona`: trim, empty to null, cross-household
    rejected.
  - Label helper tests with `en` and the TQ-08 fixture (AC 1 to AC 3).
  - ProfileScreen play tests for clear-and-save and save failed (AC 4,
    AC 6).
  - A content check that the device sentence and version show (AC 5).
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-01-01-04: Keep my kitchen private to my household

Test infrastructure: TASK-01-01-04-QA1 (section 6).

##### TASK-01-01-04-BE1 · Enforce household scope in the data access layer and every action
`backend` · Parent: STORY-01-01-04 · 5 h · Depends on: TASK-01-01-01-BE4
- **Build:**
  - `src/server/dal/scope.ts`:
    - `requireHousehold()`, from the session;
    - `assertOwned(table, id)` for household-owned rows (units, toolkits,
      batches, recipes, shots), with portions checked through their batch;
    - `visibleCatalog(householdId)`, the catalog visibility predicate (shared
      entries plus the household's own; detail in TASK-01-06-03-BE1).
  - A short convention note at the top of `src/server/actions/` saying every
    action calls these before reading or writing.
- **Done when:**
  - Reading or writing a row from another household throws "not found" (not
    "forbidden", so existence isn't revealed).
  - New records always get the session's household (AC 1).

##### TASK-01-01-04-QA2 · Build the cross-household isolation test suite
`qa` · Parent: STORY-01-01-04 · 4 h · Depends on: TASK-01-01-04-BE1, TASK-01-01-04-QA1
- **Build:** `src/server/__tests__/isolation.test.ts`, using two households.
  For each DAL read and each action it checks that household B can't see or
  change household A's records (AC 2, AC 3), and that creates are scoped
  (AC 1). Later backend tasks add their own cases here, as section 5 requires.
- **Done when:** The suite runs in CI and fails when a scope check is
  removed (checked by temporarily removing one).

#### STORY-01-01-05: Move around the app

##### TASK-01-01-05-FE1 · Build the minimal Icon set (NC-14) with its story
`frontend` · Parent: STORY-01-01-05 · 3 h · Depends on: DES-01-02-05
- **Build:** `src/components/ui/Icon`: chevron, check, plus and close, drawn
  like the Logo (round caps, `currentColor`). Icons are decorative by default
  (`aria-hidden`), and the chevron mirrors in RTL. Stories cover all four,
  plus RTL.
- **Done when:** The stories pass axe, and the chevron points to inline-end
  in both directions.

##### TASK-01-01-05-FE2 · Build Sheet (NC-05) and the confirm sheet SH-CONFIRM with stories
`frontend` · Parent: STORY-01-01-05 · 6 h · Depends on: DES-01-02-05, TASK-01-01-05-FE1
- **Build:** `src/components/ui/Sheet`:
  - a bottom sheet on phones and a centred dialog on wide screens;
  - `paper` with a `border-line` top edge and a grabber, an `ink` scrim at low
    opacity, and no shadow;
  - a focus trap, focus returned on close, Escape and swipe-down to close,
    and `role="dialog"` with a label;
  - motion that respects reduced motion.

  Also a `ConfirmSheet` (SH-CONFIRM) with a title, one sentence, a primary
  button and cancel. Stories: open, long content, confirm, RTL, reduced
  motion.
- **Done when:**
  - The stories pass axe.
  - A play test checks the focus trap and focus return.
  - There's one primary button per sheet.

##### TASK-01-01-05-FE3 · Add the app route group with the TabBar and interim tab states
`frontend` · Parent: STORY-01-01-05 · 4 h · Depends on: PR-3, TASK-01-01-06-FE3, DES-01-01-02, DES-01-01-06
- **Build:**
  - `src/app/(app)/layout.tsx` with TabBar (PR #3) linking `/`, `/shots`,
    `/pantry` and `/kit`, with the active tab from the pathname.
  - Each tab page starts with its interim EmptyState from DES-01-01-06
    (no action, or an action only once its target exists).
  - The placeholder `src/app/page.tsx` is removed.
- **Done when:**
  - Each tab is one tap from any tab (AC 1).
  - No tab is blank or has a dead action (AC 2).
  - The TabBar respects the safe area.

##### TASK-01-01-05-FE4 · Add the full-screen task frame and the unsaved-changes guard
`frontend` · Parent: STORY-01-01-05 · 5 h · Depends on: TASK-01-01-05-FE2, PR-3
- **Build:**
  - `src/app/(task)/layout.tsx`: no TabBar, PageHeader with ghost
    `actions.cancel` at the start.
  - A `useUnsavedChanges(isDirty)` hook that opens SH-CONFIRM once on cancel,
    back or tab navigation when dirty, and leaves at once when clean. It also
    handles browser back (`popstate`) and `beforeunload`.
- **Done when:**
  - Dirty leave asks once, and clean leave is immediate (AC 3).
  - The guard is reused by the log, add-bag and add-kit tasks.

##### TASK-01-01-05-FE5 · Add return-to with draft restore for side tasks
`frontend` · Parent: STORY-01-01-05 · 6 h · Depends on: TASK-01-01-05-FE4
- **Build:** `src/lib/returnTo.ts` and `src/lib/drafts.ts`:
  - Starting a side task saves the current task's draft to sessionStorage
    (try/catch, falls back to memory) and passes `returnTo` and a draft key.
  - Finishing the side task navigates to `returnTo` with `selected=<newId>`.
  - The origin task restores its draft and applies the selection.
  - Leaving without finishing restores the draft unchanged.
- **Done when:** In a play test, adding a bag from the log returns to the log
  with the new portion chosen and dial values kept (AC 4). The same holds for
  kit from the checklist.

##### TASK-01-01-05-FE6 · Reopen on the last screen within five minutes
`frontend` · Parent: STORY-01-01-05 · 2 h · Depends on: TASK-01-01-05-FE3
- **Build:** A client effect in the `(app)` layout records the tab path and
  time in localStorage. On cold start, within 5 minutes it routes to that
  tab, otherwise to Brew. Task routes aren't restored (only tabs).
- **Done when:** Reopening within 5 minutes lands on the last tab, after that
  on Brew (AC 5), and a storage failure falls back to Brew.

##### TASK-01-01-05-QA1 · Test navigation, leaving tasks, return-to and reopen
`qa` · Parent: STORY-01-01-05 · 4 h · Depends on: TASK-01-01-05-FE5, TASK-01-01-05-FE6
- **Build:**
  - Story play tests for the TabBar's active state and a 44 px minimum height
    (AC 1).
  - Interim empty states present per tab (AC 2).
  - The unsaved guard, dirty versus clean (AC 3).
  - Unit tests for the return-to and draft modules, including storage
    unavailable (AC 4).
  - A unit test for the 5-minute rule with fake timers (AC 5).
  - A manual check of browser back on a phone viewport.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-01-06: See the same loading, empty and error behaviour everywhere

##### TASK-01-01-06-FE1 · Build Notice (NC-10) with neutral and warning tones and its stories
`frontend` · Parent: STORY-01-01-06 (also 01-05-04) · 5 h · Depends on: DES-01-01-05, DES-01-05-03
- **Build:** `src/components/ui/Notice`:
  - Tones: `neutral` (ink on `surface`) and `warning` (`signal` on
    `signal-subtle`).
  - Sizes: `block`, and `inline` (one line of `signal` text with no fill, for
    warnings in rows).
  - Optional action slot (retry).
  - The API enforces the shot-warning rule: `tone="warning"` requires
    `warning: ShotWarningKind` (only `'channelling'` in the MVP), so a
    neutral message can't use signal.
  - Errors use `role="alert"` and info uses `status`.

  Stories cover every tone and size, with and without an action, plus RTL.
- **Done when:**
  - The stories pass axe, including signal contrast on `signal-subtle`.
  - A type test shows `tone="warning"` without a warning kind fails to
    compile.

##### TASK-01-01-06-FE2 · Build Skeleton (NC-11) with its story
`frontend` · Parent: STORY-01-01-06 · 3 h · Depends on: DES-01-01-05
- **Build:** `src/components/ui/Skeleton`: `surface-sunken` blocks with
  `radius-sm`, a slow pulse that stops under reduced motion, a wrapper that
  sets `aria-busy`, and preset shapes (row, card, home card). Stories:
  shapes, reduced motion.
- **Done when:** The stories pass axe, and there's no spinner (AC 1).

##### TASK-01-01-06-FE3 · Build EmptyState (NC-12) with its story
`frontend` · Parent: STORY-01-01-06 · 2 h · Depends on: DES-01-01-05
- **Build:** `src/components/ui/EmptyState`: a `text-h2` line, one
  `text-body` sentence and at most one action (API-limited). Stories: with
  action, without action, RTL.
- **Done when:** The stories pass axe, and the API allows at most one action
  (AC 2).

##### TASK-01-01-06-FE4 · Add the shared loading, error and retry patterns for routes and actions
`frontend` · Parent: STORY-01-01-06 · 5 h · Depends on: TASK-01-01-06-FE1, TASK-01-01-06-FE2, TASK-01-01-05-FE3
- **Build:**
  - A `loading.tsx` template per tab segment using Skeleton presets.
  - `error.tsx` boundaries that render Notice (neutral) with `actions.retry`
    calling `reset()`.
  - `src/lib/actionResult.ts`, a typed `{ ok, error }` result that actions
    return instead of throwing for expected failures.
  - A `useActionForm` pattern on top of `useActionState` that keeps field
    values after a failure.
  - `states.*` keys.
- **Done when:**
  - A forced failure in each tab shows the Notice with retry, and retry
    reloads (AC 3).
  - Form values survive a failed action (AC 3).
  - No pattern uses signal (AC 4).

##### TASK-01-01-06-QA1 · Test the shared states and the signal rule
`qa` · Parent: STORY-01-01-06 · 4 h · Depends on: TASK-01-01-06-FE4
- **Build:**
  - Play tests: skeleton shape and `aria-busy` (AC 1); empty state with one
    action (AC 2); error with retry, and a form keeping its values after a
    failed action (AC 3).
  - A check that no neutral Notice, EmptyState or Skeleton renders with
    `signal` classes (AC 4).
  - A lint-style test that greps `src/components` and `src/app` for
    `signal` outside Notice and fails if found.
- **Done when:** AC 1 to AC 4 are covered, and the grep test is in CI.

#### STORY-01-01-07: Get started with a short checklist

##### TASK-01-01-07-FE1 · Build Checklist (NC-12) with its story
`frontend` · Parent: STORY-01-01-07 · 3 h · Depends on: DES-02-02-04, TASK-01-01-05-FE1
- **Build:** `src/components/ui/Checklist`: numbered steps with done (check
  icon, `ink-secondary`), next (the only primary button) and later states,
  plus an optional detail slot in a step (for the toolkit offer). Stories:
  none done, one done, two done, RTL.
- **Done when:** The stories pass axe, and only the next step has a primary
  action.

##### TASK-01-01-07-BE1 · Add the setup progress read
`backend` · Parent: STORY-01-01-07 · 2 h · Depends on: TASK-01-01-04-BE1, TASK-01-03-03-BE1
- **Build:** DAL `getSetupProgress()`: `hasMachine`, `hasGrinder` (unretired
  units), `hasToolkit`, `hasUnfinishedPortion` and `hasShot`, from
  household-scoped queries.
- **Done when:** It returns correct flags for each combination in fixtures.

##### TASK-01-01-07-FE2 · Wire the first-run checklist on Brew
`frontend` · Parent: STORY-01-01-07 · 4 h · Depends on: TASK-01-01-07-FE1, TASK-01-01-07-BE1, TASK-01-02-05-FE1, TASK-03-01-02-FE2, TASK-01-01-05-FE5
- **Build:** Brew (`src/app/(app)/page.tsx`, using HomeScreen's first-run
  state from PR #3) shows Checklist until a shot exists:
  - step 1 opens `/kit/add` preset to machine, then grinder; with a machine
    and a grinder but no toolkit, it shows the toolkit offer
    (TASK-01-02-05-FE1);
  - step 2 opens `/pantry/add`;
  - step 3 opens `/log`.

  Each step uses `returnTo=/`.
- **Done when:**
  - The three steps show with nothing set up (AC 1).
  - Done steps are marked and the next step is offered (AC 2).
  - Finishing a step returns to Brew (AC 3).
  - The toolkit offer shows in step 1 (AC 4).
  - With every step done, the checklist is gone (AC 5).

##### TASK-01-01-07-QA1 · Test the checklist progression
`qa` · Parent: STORY-01-01-07 · 3 h · Depends on: TASK-01-01-07-FE2
- **Build:**
  - Node tests for `getSetupProgress` across states.
  - Checklist play tests for each progression.
  - A manual run: from an empty household to the first shot via the
    checklist, checking the return to Brew after each step.
- **Done when:** AC 1 to AC 5 are covered, and the ownership question
  (SQ-16) is noted as unaffected by the code.

### EPIC-01-02: Describe your kit once

#### STORY-01-02-01: Find my machine and grinder in the catalog

Schema: TASK-01-02-01-BE1, TASK-01-02-01-BE2.

##### TASK-01-02-01-BE3 · Add the catalog seed loader with the hardware seed list
`backend` · Parent: STORY-01-02-01 · 5 h · Depends on: TASK-01-02-01-BE2, TASK-01-06-01-BE1, TQ-10
- **Build:**
  - `src/db/seed/hardware.json` (makers, models with kind and capabilities,
    aliases with market, URLs with market) and `src/db/seed/load.ts`.
  - The loader is an idempotent upsert by stable seed ID, with
    `source='seed'` and `status='verified'`, and computes `normalized_url`
    with TASK-01-06-01-BE1's function.
  - An `npm run db:seed` script, and capabilities validated with
    `parseCapabilities`.
  - The initial content is a small placeholder list until TQ-10 names a
    curator.
- **Done when:**
  - Running the seed twice changes nothing.
  - Invalid capabilities fail the seed with a clear error.
  - The seed has no personal data.

##### TASK-01-02-01-BE4 · Add hardware catalog search and browse
`backend` · Parent: STORY-01-02-01 · 6 h · Depends on: TASK-01-02-01-BE5, TASK-01-01-04-BE1, TQ-03
- **Build:**
  - DAL `searchHardware({ kind, query })`: case-insensitive match on model
    name, maker name and aliases; returns surviving models with their maker,
    plus an `addedByUs` flag; visibility is `visibleCatalog`.
  - `listMakers({ kind })`: alphabetical, only makers with visible models of
    that kind.
  - `listModels({ makerId, kind })`.
  - Exposed through `GET /api/catalog/search?catalog=hardware` (TQ-03) for
    typeahead.
- **Done when:**
  - An alias query finds its model (AC 1, AC 3).
  - Merged rows never appear (AC 4).
  - Another household's unverified rows never appear (AC 5).
  - An empty result is distinguishable (AC 6).

##### TASK-01-02-01-BE5 · Add the merge-pointer resolver for catalog reads
`backend` · Parent: STORY-01-02-01 (also 01-06, 02-01-04, 03-01-04) · 2 h · Depends on: TASK-01-02-01-BE2, TASK-03-01-01-BE1
- **Build:** `src/server/dal/catalogMerge.ts`:
  - `resolveEntity(type, id)` follows `merged_into_id` to the surviving row,
    with a cycle and depth guard.
  - `mergeGroup(type, id)` returns every ID that resolves to the same
    survivor.

  These are used by every reader that shows or groups catalog references
  (epics cross-cutting constraint).
- **Done when:** Chains of two or more, a self-cycle and an unmerged row all
  resolve correctly in tests.

##### TASK-01-02-01-FE1 · Build the catalog picker screen (SCR-CATALOG-PICK) with its stories
`frontend` · Parent: STORY-01-02-01 (also 03-01-01) · 6 h · Depends on: DES-01-02-02, PR-3, TASK-01-01-06-FE1, TASK-01-01-06-FE2, TASK-01-01-05-FE1
- **Build:** `src/components/screens/CatalogPickScreen`, props-only:
  - a search Input;
  - browse mode (makers or roasters as ListRows, then a parent's products);
  - result mode (product primary, parent secondary);
  - a `catalog.addedByYou` overline marker;
  - a last row `catalog.cantFind`;
  - loading skeleton rows;
  - a no-match Notice that echoes the query, with a secondary
    `catalog.cantFind`.

  Hardware and coffee variants. Stories for each state, plus RTL.
- **Done when:**
  - The stories pass axe.
  - The unverified marker is text only.
  - The add-it row always ends the results.

##### TASK-01-02-01-FE2 · Wire the hardware picker with debounced search and selection return
`frontend` · Parent: STORY-01-02-01 · 5 h · Depends on: TASK-01-02-01-FE1, TASK-01-02-01-BE4, TASK-01-01-05-FE5
- **Build:** `src/app/(task)/catalog/pick/page.tsx?catalog=hardware&kind=`:
  - search debounced at 200 ms with `AbortController`;
  - browse with no query;
  - "can't find" opens `/catalog/add` with the query and `returnTo`;
  - choosing a model returns to the caller with `selected`.
- **Done when:**
  - Typing never queues stale results.
  - The query carries over to add (AC 6).
  - Selection returns to add-kit.

##### TASK-01-02-01-QA1 · Test hardware search, aliases, merges and privacy
`qa` · Parent: STORY-01-02-01 · 5 h · Depends on: TASK-01-02-01-FE2
- **Build:**
  - Node tests for `searchHardware`: name, maker and alias matches, kind
    filter (AC 1, AC 3); makers alphabetical, models per maker (AC 2); a
    merged entry shows only its survivor (AC 4); own unverified entries
    marked, other households' hidden (AC 5).
  - Case and accent behaviour documented (risk R-09).
  - Picker play tests for no match with the query echoed and the add
    carry-over (AC 6).
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-01-02-02: Add the units I own

Schema: TASK-01-02-02-BE1.

##### TASK-01-02-02-BE2 · Add the add-unit action and the kit read
`backend` · Parent: STORY-01-02-02 · 4 h · Depends on: TASK-01-02-02-BE1, TASK-01-02-01-BE4
- **Build:**
  - Action `addUnit({ hardwareId, nickname?, acquiredAt? })`: the model must
    be visible to the household; the merge is resolved before storing.
  - DAL `getKit()`: toolkits with machine, grinder and basket names, active
    units grouped by kind, and retired units.
- **Done when:**
  - The unit saves with or without the optional fields (AC 2).
  - Two units of one model are separate rows (AC 4).
  - An invisible model is rejected.

##### TASK-01-02-02-FE1 · Build the add-kit screen (SCR-UNIT-ADD) with its stories
`frontend` · Parent: STORY-01-02-02 · 5 h · Depends on: DES-01-02-01, PR-3, TASK-01-02-02-FE3
- **Build:** `src/components/screens/UnitAddScreen`, props-only:
  - a kind ChipGroup (`kit.kind.*`);
  - the chosen model with a change link;
  - nickname and acquired-date Inputs;
  - the read-only capabilities summary;
  - save, and a save-failed Notice.

  Stories: kind preset, model chosen, failed, RTL.
- **Done when:** The stories pass axe, and capabilities are shown before
  save (AC 3).

##### TASK-01-02-02-FE2 · Build the kit screen (SCR-KIT) with its stories
`frontend` · Parent: STORY-01-02-02 (also 01-02-03 to 05) · 6 h · Depends on: DES-01-02-03, PR-3, TASK-01-01-06-FE3, TASK-01-01-06-FE2
- **Build:** `src/components/screens/KitScreen`, props-only:
  - a `kit.toolkits` section (Cards with name, machine, grinder and basket,
    plus slots for a retired marker and `toolkit.needsUnit`);
  - a toolkit-offer slot;
  - `kit.units` grouped by kind (ListRow: nickname or model, with maker and
    model secondary);
  - a collapsed `kit.retired`;
  - EmptyState `kit.empty` with `kit.addMachine`;
  - a loading skeleton.

  Stories for each state, plus RTL.
- **Done when:** The stories pass axe, and units are grouped by kind (AC 1).

##### TASK-01-02-02-FE3 · Compose the capabilities summary from message keys
`frontend` · Parent: STORY-01-02-02 (also 01-02-03, 01-06-09) · 3 h · Depends on: TASK-01-02-01-BE1
- **Build:** `src/components/ui/CapabilitySummary` (or a domain formatter
  with a component). It turns `capabilities` into lines such as temperature
  exact with its range, using `unit.cap.*` keys and `formatValueParts` for
  numbers, and shows "not sure" with `unit.capNotSure`.
- **Done when:**
  - The summary has stories for none, steps, exact °C and °F, manual with a
    gauge, stepped and stepless grinders, and every unknown.
  - No number is concatenated with a unit by hand.

##### TASK-01-02-02-FE4 · Wire the kit tab and the add-kit flow
`frontend` · Parent: STORY-01-02-02 · 4 h · Depends on: TASK-01-02-02-FE1, TASK-01-02-02-FE2, TASK-01-02-02-BE2, TASK-01-02-01-FE2, TASK-01-01-05-FE4
- **Build:**
  - `src/app/(app)/kit/page.tsx` reads `getKit()`.
  - `src/app/(task)/kit/add/page.tsx`: kind, then the picker, then details,
    then save. `?kind=machine` presets the kind, and from the checklist it
    continues to grinder.
  - It ends on the toolkit offer when the second required unit is added
    (TASK-01-02-05-FE1), otherwise on Kit or `returnTo`.
- **Done when:**
  - An added unit appears on Kit grouped by kind (AC 1).
  - An empty Kit offers the machine (AC 5).
  - The unsaved guard applies.

##### TASK-01-02-02-QA1 · Test adding units
`qa` · Parent: STORY-01-02-02 · 4 h · Depends on: TASK-01-02-02-FE4
- **Build:**
  - Node tests for `addUnit`: optional fields, two units of one model, an
    invisible model rejected, isolation cases added (AC 2, AC 4).
  - `getKit` grouping (AC 1).
  - Story checks for the capabilities summary (AC 3) and the empty Kit
    (AC 5).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-02-03: Retire a unit and keep its history

##### TASK-01-02-03-BE1 · Add retiring a unit and the toolkit "needs a unit" state
`backend` · Parent: STORY-01-02-03 · 3 h · Depends on: TASK-01-02-02-BE2
- **Build:**
  - Action `retireUnit(id)` sets `retired_at`.
  - `getKit` and toolkit reads mark retired components and compute
    `needsMachine` and `needsGrinder` when a toolkit's only one is retired.
  - The toolkit editor's unit options exclude retired units.
  - Shot reads keep joining units by ID, so they're unaffected.
- **Done when:**
  - A retired unit is listed under retired (AC 4) and not offered in the
    editor (AC 2).
  - Toolkits show the state (AC 5).

##### TASK-01-02-03-FE1 · Build the unit screen (SCR-UNIT) with its stories
`frontend` · Parent: STORY-01-02-03 (also 01-06-09, 04-01) · 5 h · Depends on: DES-01-02-03, PR-3, TASK-01-02-02-FE3, TASK-01-01-05-FE2
- **Build:** `src/components/screens/UnitScreen`, props-only:
  - model and maker, nickname and acquired date;
  - CapabilitySummary, with a slot for "answer later" (TASK-01-06-09-FE1);
  - slots for the maintenance section and the current-period line
    (EPIC-04-01);
  - the retired marker;
  - a secondary `unit.retire` at the end, opening ConfirmSheet.

  Stories: active, retired, RTL.
- **Done when:** The stories pass axe, and the retire confirmation says past
  shots keep showing the unit (AC 1).

##### TASK-01-02-03-FE2 · Wire the unit route and retiring
`frontend` · Parent: STORY-01-02-03 · 3 h · Depends on: TASK-01-02-03-FE1, TASK-01-02-03-BE1
- **Build:** `src/app/(app)/kit/units/[unitId]/page.tsx` with `retireUnit`
  through ConfirmSheet. The Kit retired section and toolkit cards render the
  retired states.
- **Done when:** Confirming retires the unit and returns to Kit. Cancel does
  nothing (AC 1).

##### TASK-01-02-03-QA1 · Test retiring and history
`qa` · Parent: STORY-01-02-03 · 3 h · Depends on: TASK-01-02-03-FE2, TASK-01-03-03-BE2
- **Build:**
  - Node tests: retired units are excluded from editor options (AC 2) and
    still listed (AC 4).
  - Shots with a retired unit still show it (AC 3, via fixtures).
  - Toolkit `needsGrinder` (AC 5).
  - ConfirmSheet play test (AC 1).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-02-04: Group my kit into a toolkit

##### TASK-01-02-04-BE1 · Add creating a toolkit with its rules
`backend` · Parent: STORY-01-02-04 · 4 h · Depends on: TASK-01-02-02-BE2
- **Build:**
  - `src/domain/toolkit.ts`: `validateToolkit({ name, units })` returns the
    missing parts (`name`, `machine`, `grinder`, `tooManyMachines`,
    `tooManyGrinders`).
  - Action `createToolkit`: units must be owned, unretired and of known kind,
    and units may be shared across toolkits.
  - DAL `getToolkit(id)` and `listToolkits()`.
- **Done when:**
  - A missing name or the wrong machine or grinder count returns the
    specific problem and saves nothing (AC 3, AC 4).
  - The same unit in two toolkits works (AC 2).

##### TASK-01-02-04-FE1 · Build the toolkit screen (SCR-TOOLKIT) with its stories
`frontend` · Parent: STORY-01-02-04 (also 01-02-06, 07) · 5 h · Depends on: DES-01-02-04, PR-3, TASK-01-01-06-FE1
- **Build:** `src/components/screens/ToolkitScreen`, props-only, in create
  and edit modes:
  - a `toolkit.name` Input;
  - a radio list of machines and of grinders;
  - checkbox lists of baskets and accessories;
  - save always enabled, with a neutral Notice naming what's missing;
  - an edit note slot.

  Stories: create, missing grinder, edit, RTL.
- **Done when:** The stories pass axe, and the rule is explained at save,
  not by a disabled button.

##### TASK-01-02-04-FE2 · Wire creating a toolkit and the toolkit cards
`frontend` · Parent: STORY-01-02-04 · 3 h · Depends on: TASK-01-02-04-FE1, TASK-01-02-04-BE1, TASK-01-02-02-FE4
- **Build:** `src/app/(task)/kit/toolkits/new/page.tsx` with `createToolkit`
  and `returnTo` support, so the log's missing-toolkit path returns to the
  log. Kit shows toolkit cards with machine, grinder and basket.
- **Done when:**
  - A saved toolkit appears on Kit (AC 5) and can be picked in the log
    (AC 1, checked once TASK-01-03-01-FE2 lands).

##### TASK-01-02-04-QA1 · Test toolkit creation rules
`qa` · Parent: STORY-01-02-04 · 3 h · Depends on: TASK-01-02-04-FE2
- **Build:**
  - Unit tests for `validateToolkit` over every combination.
  - Node tests for `createToolkit`: rejected cases save nothing, shared unit,
    retired unit rejected.
  - Play test that the missing-part Notice names the part (AC 4).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-02-05: Make my first toolkit in one tap

##### TASK-01-02-05-BE1 · Add the first-toolkit suggestion and one-tap creation
`backend` · Parent: STORY-01-02-05 · 3 h · Depends on: TASK-01-02-04-BE1
- **Build:**
  - DAL `getToolkitSuggestion()`: null if any toolkit exists; otherwise the
    machine and grinder (exactly one each, so `oneTap: true`; else the most
    recently added of each).
  - Action `createDefaultToolkit()`: stores the translated
    `toolkit.defaultName` in the user's language at creation (DQ-01) and
    returns the toolkit ID.
- **Done when:**
  - One machine and one grinder create a toolkit with no input (AC 1).
  - More than one returns the preselection (AC 2).
  - The suggestion is null once a toolkit exists (AC 5).

##### TASK-01-02-05-FE1 · Add the toolkit offer card and the end-of-add-kit offer
`frontend` · Parent: STORY-01-02-05 · 4 h · Depends on: TASK-01-02-05-BE1, DES-01-02-06, TASK-01-02-04-FE2
- **Build:**
  - A `ToolkitOffer` Card naming the machine and grinder (with story), shown
    on Kit and in checklist step 1.
  - One tap calls `createDefaultToolkit` and shows a short confirmation with
    a ghost `toolkit.rename`, or opens SCR-TOOLKIT prefilled when `oneTap` is
    false.
  - The add-kit flow ends on this offer after the second required unit.
- **Done when:**
  - The offer names both units (AC 4).
  - It appears right after the second unit is saved (AC 3).
  - The toolkit is one tap away with no typing (AC 1).

##### TASK-01-02-05-QA1 · Test the toolkit shortcut
`qa` · Parent: STORY-01-02-05 · 3 h · Depends on: TASK-01-02-05-FE1
- **Build:**
  - Node tests for the suggestion cases and the stored default name in `en`.
  - ToolkitOffer play tests for one tap and the prefill path.
  - A manual tap count from Brew to a saved toolkit (design target: 12 taps
    at most).
- **Done when:** AC 1 to AC 5 are each covered, and the tap count is recorded
  in the PR.

#### STORY-01-02-06: Edit a toolkit

##### TASK-01-02-06-BE1 · Add updating a toolkit
`backend` · Parent: STORY-01-02-06 · 3 h · Depends on: TASK-01-02-04-BE1
- **Build:** Action `updateToolkit(id, changes)` with the same validation as
  create. `getToolkit` includes `hasShots`. A machine or grinder swap goes
  through TASK-01-02-07-BE1's check first.
- **Done when:**
  - A rename or a basket or accessory change saves directly (AC 1).
  - An invalid result changes nothing (AC 4).
  - Shots keep their own `grinder_id` and `machine_id` (AC 3).

##### TASK-01-02-06-FE1 · Wire the toolkit edit mode with its note
`frontend` · Parent: STORY-01-02-06 · 3 h · Depends on: TASK-01-02-06-BE1, TASK-01-02-04-FE1
- **Build:** `src/app/(task)/kit/toolkits/[toolkitId]/page.tsx`, with title
  `toolkit.editTitle` and `toolkit.editNote` when `hasShots`, opened from the
  toolkit card.
- **Done when:** The note shows only with shots (AC 2), and invalid saves
  show the Notice (AC 4).

##### TASK-01-02-06-QA1 · Test toolkit editing keeps history
`qa` · Parent: STORY-01-02-06 · 2 h · Depends on: TASK-01-02-06-FE1, TASK-01-03-03-BE2
- **Build:** Node tests: edit, then read older shots, which still have their
  original grinder and machine (AC 3); an invalid edit is rejected (AC 4);
  a rename doesn't prompt (AC 1). Play test for the note (AC 2).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-01-02-07: Be warned before swapping a toolkit's machine or grinder

##### TASK-01-02-07-BE1 · Count recipes affected by a machine or grinder swap
`backend` · Parent: STORY-01-02-07 · 3 h · Depends on: TASK-01-02-06-BE1, TASK-02-01-01-BE1
- **Build:**
  - DAL `swapImpact(toolkitId, newMachineId, newGrinderId)` counts current
    recipes (latest per key) on that toolkit whose `grinder_id` or
    `machine_id` is the outgoing unit.
  - `updateToolkit` requires a `confirmSwap` flag when the count is above
    zero.
  - Recipes are never changed: the needs-re-dial rule reads the toolkit
    (TASK-02-01-05-BE1).
- **Done when:**
  - A swap with recipes is refused without confirmation (AC 1).
  - A confirmed swap keeps the recipes unchanged (AC 2).
  - A swap with no affected recipes needs no flag (AC 4).

##### TASK-01-02-07-FE1 · Add the swap confirmation to toolkit edit
`frontend` · Parent: STORY-01-02-07 · 3 h · Depends on: TASK-01-02-07-BE1, DES-01-02-06, TASK-01-01-05-FE2
- **Build:** On save of a swap, ToolkitScreen shows ConfirmSheet with
  `toolkit.swapTitle` (the count, formatted with ICU plural) and the reason,
  with primary `toolkit.swapConfirm` and `actions.cancel`.
- **Done when:**
  - The count and reason show (AC 1).
  - Cancel leaves the form and database unchanged (AC 3).
  - There's no sheet when the count is zero (AC 4).

##### TASK-01-02-07-QA1 · Test the swap warning
`qa` · Parent: STORY-01-02-07 · 2 h · Depends on: TASK-01-02-07-FE1
- **Build:**
  - Node tests: `swapImpact` counts only current recipes on the outgoing unit
    (AC 1); confirm keeps the recipes (AC 2); no flag needed at zero (AC 4).
  - Play test: cancel restores (AC 3).
  - Once TASK-02-01-05-BE1 lands, an extra case checks that confirmed-swap
    recipes report `needsRedial` (AC 2).
- **Done when:** AC 1 to AC 4 are covered.

### EPIC-01-03: Log a shot in seconds

#### STORY-01-03-01: Start a shot with what I'm brewing already chosen

##### TASK-01-03-01-BE1 · Add the shot log context read
`backend` · Parent: STORY-01-03-01 · 4 h · Depends on: TASK-01-03-03-BE1, TASK-03-02-04-BE1, TASK-01-02-04-BE1
- **Build:** DAL `getLogContext({ drinkId?, portionId? })` returns:
  - the household's toolkits, with the default being the one on this user's
    latest shot, else the first;
  - the visible drinks;
  - the unfinished portions, unopened included (DQ-06), each with bean (merge
    resolved), bag and state;
  - `missingToolkit` and `missingCoffee` flags.

  Finished portions are excluded (INIT-03 Q3).
- **Done when:** Defaults follow the last-used toolkit (AC 1), the options
  are complete (AC 2, AC 3) and the missing flags are correct (AC 4).

##### TASK-01-03-01-FE1 · Build the select sheet (SH-SELECT) with its story
`frontend` · Parent: STORY-01-03-01 (also 02-02-06) · 3 h · Depends on: TASK-01-01-05-FE2, PR-3
- **Build:** `src/components/ui/SelectSheet`: Sheet plus a single-choice
  ListRow list, a selected check, an optional overline marker per option
  (used for `home.usual`), an optional secondary line and an optional footer
  action. It opens from SelectField (PR #3). Stories: drinks, portions with
  secondary lines, the usual marker, RTL.
- **Done when:** The stories pass axe, and keyboard selection works.

##### TASK-01-03-01-FE2 · Wire the log's context fields and the missing-context paths
`frontend` · Parent: STORY-01-03-01 · 5 h · Depends on: TASK-01-03-01-BE1, TASK-01-03-01-FE1, TASK-01-01-05-FE5, PR-3
- **Build:**
  - `src/app/(task)/log/page.tsx` (new mode) renders ShotLogScreen (PR #3)
    with three SelectFields: toolkit, drink, coffee.
  - Defaults come from Home's current drink and coffee (query params) and
    the last-used toolkit.
  - `log.missingToolkit` and `log.missingCoffee` open `/kit/toolkits/new` or
    `/pantry/add` with return-to. Dial values are kept as a draft.
- **Done when:**
  - Context arrives pre-chosen (AC 1) and changes through SH-SELECT (AC 2).
  - Unopened portions are offered (AC 3).
  - A missing item can be added and returns chosen with values kept (AC 4).

##### TASK-01-03-01-QA1 · Test shot log context and missing context
`qa` · Parent: STORY-01-03-01 · 4 h · Depends on: TASK-01-03-01-FE2
- **Build:**
  - Node tests for `getLogContext`: last-used toolkit, visible drinks,
    unfinished portions including unopened, finished excluded, isolation
    cases.
  - Play tests on ShotLogScreen for missing toolkit and missing coffee.
  - Return-to with values kept (AC 4).
- **Done when:** AC 1 to AC 4 are each covered.

#### STORY-01-03-02: Set grind, dose, yield and time by touch

##### TASK-01-03-02-BE1 · Add the starting values for a blank log
`backend` · Parent: STORY-01-03-02 · 2 h · Depends on: TASK-01-03-03-BE1, TASK-01-03-02-FE2
- **Build:** DAL `getStartingValues(toolkitId)` returns the latest measured
  shot on that toolkit, else the DQ-07 defaults: dose 18 g, yield 36 g, time
  28 000 ms, and grind at the middle of the grinder's effective range
  (TASK-01-03-02-FE2).
- **Done when:** Both branches are tested, and one-tap shots are ignored.

##### TASK-01-03-02-FE1 · Add finer and coarser end captions to NumberWheel
`frontend` · Parent: STORY-01-03-02 · 4 h · Depends on: DES-01-03-03
- **Build:** An optional `endCaptions: { min: string; max: string }` on
  `src/components/ui/NumberWheel`, rendered under the ruler's ends
  (inline-start for min, inline-end for max, so they mirror) in
  `text-label` `ink-secondary`. The caller places finer and coarser using the
  grinder's `coarser` direction. Stories: `coarser: higher`,
  `coarser: lower`, none, RTL.
- **Done when:** The captions point the right way in both directions and in
  RTL (design acceptance criteria), and the stories pass axe.

##### TASK-01-03-02-FE2 · Add the grind scale config from grinder capabilities
`frontend` · Parent: STORY-01-03-02 (also 01-06-08) · 3 h · Depends on: TASK-01-02-01-BE1
- **Build:** `src/domain/grind.ts`: `grindWheelConfig(capabilities)` returns
  `{ min, max, step, captions: 'higherCoarser' | 'lowerCoarser' | null }`.
  Stepped grinders use their step, stepless ones their finest increment.
  Unknowns are delegated to the fallback function (TASK-01-06-08-FE1), with
  a stub until then.
- **Done when:** Unit tests cover stepped, stepless and both directions.

##### TASK-01-03-02-FE3 · Wire ShotDial in the shot log with live ratio and units
`frontend` · Parent: STORY-01-03-02 · 5 h · Depends on: TASK-01-03-02-FE1, TASK-01-03-02-FE2, TASK-01-03-02-BE1, TASK-01-03-01-FE2, PR-3, TQ-14
- **Build:** ShotLogScreen's ShotDial (PR #3) gets:
  - grind from `grindWheelConfig`, with captions when known;
  - dose and yield in grams, step 0.1;
  - time in seconds, step 0.1, converted with `secondsToMs` and
    `msToSeconds`;
  - the ratio (`shot.ratio`) updated live and formatted with `Intl`.

  Ranges follow TQ-14. The first tab is selected on open.
- **Done when:**
  - All four values are visible at once on 375 × 667 (AC 1).
  - Starting values apply (AC 2).
  - The grind respects its steps and range (AC 3) and shows its direction
    (AC 4).
  - The ratio updates (AC 5).
  - Time shows one decimal (AC 6).

##### TASK-01-03-02-QA1 · Test the shot values controls
`qa` · Parent: STORY-01-03-02 · 4 h · Depends on: TASK-01-03-02-FE3
- **Build:**
  - ShotDial play tests on a 375 × 667 viewport: four tabs visible, one wheel,
    drag and keyboard change, typed entry only on tapping the number (AC 1).
  - Grind snapping to steps for a stepped fixture and 0.1 for stepless
    (AC 3).
  - Captions for both directions and RTL (AC 4).
  - Ratio live (AC 5).
  - 27.6 s shown and 27 600 ms emitted (AC 6).
  - Node test for starting values (AC 2).
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-01-03-03: Save the shot as I measured it

Schema: TASK-01-03-03-BE1.

##### TASK-01-03-03-BE2 · Add saving a measured shot
`backend` · Parent: STORY-01-03-03 (also 01-03-04, 03-01-03, 03-02-03) · 5 h · Depends on: TASK-01-03-03-BE1, TASK-01-01-04-BE1, TASK-01-03-01-BE1
- **Build:** Action `saveMeasuredShot(input)`:
  - checks that the toolkit, portion and drink are owned and visible, and
    the portion isn't finished;
  - copies the toolkit's current machine and grinder into `machine_id` and
    `grinder_id`;
  - sets `persona_id` to the default persona, `logged_by_user_id` from the
    session, and `entry_mode='measured'`;
  - stores `yield_time` as integer ms, plus `sweetened`;
  - leaves `is_network_eligible` false (X-3);
  - in the same transaction, sets the portion's `opened_at` to the shot time
    if it was unopened (DQ-06);
  - returns `{ ok, shotId }` or a typed error.
- **Done when:**
  - The fields are as AC 1 and AC 2 require.
  - The unit snapshot survives toolkit changes (AC 3).
  - A failure writes nothing (AC 5).

##### TASK-01-03-03-FE1 · Wire saving the shot and the failure state
`frontend` · Parent: STORY-01-03-03 · 3 h · Depends on: TASK-01-03-03-BE2, TASK-01-01-06-FE4
- **Build:** Save (`log.save`, pinned above the safe area) calls the action
  with a pending state. On success it goes to `/taste/[shotId]`; until
  TASK-01-05-01-FE3 lands, it goes to Brew. On failure it shows Notice
  `log.saveFailed` with retry and keeps the values. The draft is cleared on
  success.
- **Done when:**
  - Success leads to the tasting offer (AC 4).
  - A failure stays with values kept and no shot saved (AC 5).

##### TASK-01-03-03-QA1 · Test saving shots
`qa` · Parent: STORY-01-03-03 · 4 h · Depends on: TASK-01-03-03-FE1
- **Build:**
  - Node tests for `saveMeasuredShot`:
    - every stored field (AC 1);
    - the unit snapshot, with a toolkit edit afterwards (AC 2, AC 3);
    - an unopened portion opened that day;
    - a finished portion rejected;
    - rollback on a forced error (AC 5);
    - isolation cases.
  - Play test for the save-failed state (AC 5).
- **Done when:** AC 1 to AC 5 are covered (AC 4 together with
  TASK-01-05-01-QA1).

#### STORY-01-03-04: Mark a shot as sweetened

##### TASK-01-03-04-FE1 · Add the sweetened toggle to the shot log
`frontend` · Parent: STORY-01-03-04 · 2 h · Depends on: TASK-01-03-03-FE1, PR-3
- **Build:** Toggle (PR #3) `log.sweetened` under ShotDial, for every drink
  type, defaulting off and passed to `saveMeasuredShot`.
- **Done when:** The toggle shows for every drink (AC 3), and its value is
  saved (AC 1, AC 2).

##### TASK-01-03-04-QA1 · Test the sweetened mark
`qa` · Parent: STORY-01-03-04 · 2 h · Depends on: TASK-01-03-04-FE1
- **Build:** Node tests: sweetened true and false are stored, and the default
  is false (AC 1, AC 2). Play test: the toggle appears for a milk drink and an
  espresso fixture (AC 3).
- **Done when:** AC 1 to AC 3 are covered.

#### STORY-01-03-05: Enter and read numbers in my local format

##### TASK-01-03-05-FE1 · Route every shown number through the shared formatters
`frontend` · Parent: STORY-01-03-05 · 3 h · Depends on: TASK-01-03-02-FE3, PR-3
- **Build:**
  - Audit ShotDial, ShotValues (PR #3) and the log for direct `toFixed` or
    string joins, and replace them with `formatValueParts`, `useFormatter` or
    `Intl`.
  - Add `formatGrams`, `formatSeconds` and `formatRatio` helpers in
    `src/lib/units.ts` if PR #3 doesn't have them.
- **Done when:** A search finds no hand-joined number and unit in
  `src/components` or `src/app`.

##### TASK-01-03-05-QA1 · Test decimal comma and point, and canonical storage
`qa` · Parent: STORY-01-03-05 · 3 h · Depends on: TASK-01-03-05-FE1, TQ-08
- **Build:**
  - Story tests that render ShotDial and ShotValues with `de-DE` and `en-US`
    (comma versus point) (AC 1, AC 2).
  - Typed entry with a comma emits the canonical number.
  - Unit tests for `parseDecimal` and `sanitizeDecimal` round-trips.
  - A Node test: a value saved under one locale reads back identical
    (AC 3).
- **Done when:** AC 1 to AC 3 are covered.

### EPIC-01-04: Record temperature and pressure when your machine has them

#### STORY-01-04-01: Record temperature in the way my machine sets it

##### TASK-01-04-01-FE1 · Add Fahrenheit display support to the units helpers and NumberWheel
`frontend` · Parent: STORY-01-04-01 · 3 h · Depends on: DES-01-03-03
- **Build:**
  - Add `fahrenheit` to `CanonicalUnit` in `src/lib/units.ts`.
  - Add `celsiusToFahrenheit` and `fahrenheitToCelsius`, keeping full
    precision on store and snapping to the machine's step on display, so a
    stored value reads back as the same °F.
  - A NumberWheel Fahrenheit story.
- **Done when:** Unit tests show the round-trip for every whole °F from 180
  to 212 returns the same displayed °F (risk R-08).

##### TASK-01-04-01-FE2 · Extend ShotDial with optional value tabs and step chips
`frontend` · Parent: STORY-01-04-01 (also 01-04-02, 01-06-08) · 6 h · Depends on: PR-3, DES-01-04-01, DES-01-04-02
- **Build:** Check what PR #3's ShotDial already does, then add what's
  missing:
  - optional tabs after the core four (temperature, then pressure);
  - an unset state shown as an em dash;
  - a panel with secondary `log.addTemperature` or `log.addPressure`, which
    reveals the control at the last used value;
  - a ghost `log.clear`;
  - a steps panel using ChipGroup's numbered scale;
  - an exact panel using NumberWheel;
  - a `labelOverride` for `log.peakPressure`;
  - the tab row fitting six tabs on 375 px, scrolling horizontally beyond
    that.

  Stories for every machine capability combination, plus RTL.
- **Done when:**
  - The stories pass axe.
  - Unset is visibly different from set.
  - Six tabs fit at 375 px.

##### TASK-01-04-01-FE3 · Show temperature in the log per the machine's capability
`frontend` · Parent: STORY-01-04-01 · 3 h · Depends on: TASK-01-04-01-FE1, TASK-01-04-01-FE2, TASK-01-03-02-FE3
- **Build:**
  - `src/domain/brewControls.ts` maps the toolkit machine's `temperature`
    capability to the tab config: none means no tab; steps means chips 1 to
    n; exact means a wheel in the machine's unit, range and step.
  - New shots start unset. Prefilled modes (recipe, edit) start set when the
    source has a value.
  - Values convert from °F to °C before save.
- **Done when:**
  - A fixed machine shows no tab (AC 1).
  - A new shot starts unset and can be cleared (AC 2).
  - Steps show no degrees (AC 3), and exact respects range and step (AC 4).
  - °F displays as °F (AC 5).
  - Prefill is set (AC 6).

##### TASK-01-04-01-BE1 · Validate temperature and pressure pairs on save
`backend` · Parent: STORY-01-04-01 (also 01-04-02, 02-01) · 3 h · Depends on: TASK-01-03-03-BE2
- **Build:**
  - `src/domain/brewControls.ts` `validateBrewControls(capabilities, input)`:
    at most one of `brew_temp_c` or `brew_temp_step`, and one of
    `pressure_bar` or `pressure_step`; the field must match the machine's
    capability; steps must be within 1 to n; exact values within range;
    `brew_temp_c` is always °C.
  - Used by `saveMeasuredShot`, and later by the update and pin actions.
- **Done when:**
  - A step on an exact machine is rejected, as are both columns set and an
    out-of-range value.
  - Unset is allowed.

##### TASK-01-04-01-QA1 · Test temperature recording
`qa` · Parent: STORY-01-04-01 · 4 h · Depends on: TASK-01-04-01-FE3, TASK-01-04-01-BE1
- **Build:**
  - Story tests for each machine fixture: fixed shows no tab (AC 1); unset,
    add and clear (AC 2); steps chips with no unit (AC 3); exact range and
    step (AC 4); °F shown and °C stored (AC 5); prefilled set (AC 6).
  - Node tests for `validateBrewControls`, temperature cases.
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-01-04-02: Record pressure in the way my machine sets it

##### TASK-01-04-02-BE1 · Cover pressure in brew-control validation
`backend` · Parent: STORY-01-04-02 · 2 h · Depends on: TASK-01-04-01-BE1
- **Build:** Extend `validateBrewControls` for pressure:
  - none, and manual without a gauge, accept nothing;
  - manual with a gauge accepts `pressure_bar` (peak);
  - steps accept `pressure_step` within 1 to n;
  - exact accepts bar within range.
- **Done when:** Each case is unit-tested.

##### TASK-01-04-02-FE1 · Show pressure in the log per the machine's capability
`frontend` · Parent: STORY-01-04-02 · 3 h · Depends on: TASK-01-04-01-FE3
- **Build:** `brewControls` maps `pressure`:
  - none, or manual without a gauge: no tab;
  - manual with a gauge: a wheel in bar labelled `log.peakPressure`;
  - steps: chips;
  - exact: a wheel in bar, with the `shot.units.bar` label.

  It follows the same unset and prefill rules as temperature.
- **Done when:**
  - A gaugeless manual machine shows no tab (AC 1).
  - Unset and clear work (AC 2).
  - Steps show no bar (AC 3), and exact is in range (AC 4).
  - Peak is labelled (AC 5).
  - Prefill is set (AC 6).

##### TASK-01-04-02-QA1 · Test pressure recording
`qa` · Parent: STORY-01-04-02 · 3 h · Depends on: TASK-01-04-02-FE1, TASK-01-04-02-BE1
- **Build:** Story tests per machine fixture for AC 1 to AC 6, plus Node
  tests for the pressure cases in `validateBrewControls`.
- **Done when:** AC 1 to AC 6 are each covered.

### EPIC-01-05: Say how it tasted

#### STORY-01-05-01: Rate a shot overall

##### TASK-01-05-01-FE1 · Add the numbered-scale ChipGroup variant with tap-again to clear
`frontend` · Parent: STORY-01-05-01 (also 01-05-02, 01-04) · 3 h · Depends on: PR-3, DES-01-05-02
- **Build:** Check PR #3's ChipGroup for a numbered 1-to-n scale and add
  what's missing:
  - a radio-group role with its label;
  - arrow keys to move, Space or Enter to select;
  - tapping the selected chip clears it (`allowDeselect`);
  - optional low and high end words.

  Stories: scale 1 to 5 with end words, deselect, RTL.
- **Done when:** The stories pass axe, and a keyboard play test covers move,
  select and deselect.

##### TASK-01-05-01-FE2 · Build the tasting screen (SCR-TASTE) with its stories
`frontend` · Parent: STORY-01-05-01 (also 01-05-02 to 04, 02-01-01, 02-03-02) · 5 h · Depends on: DES-01-05-01, PR-3, TASK-01-05-01-FE1, TASK-01-01-06-FE1
- **Build:** `src/components/screens/TasteScreen`, props-only:
  - `taste.title` with compact ShotValues;
  - the overall rating scale;
  - four sensory scales;
  - a defects multi-choice;
  - a warning slot under the defects;
  - actions: `taste.done` primary with `recipe.pin` secondary, swapped in
    fix and dial-in modes;
  - a save-failed Notice that keeps the choices.

  Stories: normal, fix mode, dial-in mode, failed, 375 × 667, RTL.
- **Done when:**
  - The stories pass axe.
  - Done stays visible at 375 × 667.
  - The shot's values are visible while rating (AC 1).

##### TASK-01-05-01-BE1 · Add saving the tasting
`backend` · Parent: STORY-01-05-01 (also 01-05-02, 01-05-03) · 3 h · Depends on: TASK-01-03-03-BE2, TASK-01-05-03-BE1
- **Build:** Action `saveTasting(shotId, { rating?, sweetness?, acidity?,
  bitterness?, body?, defects? })`:
  - the shot must be owned and measured (one-tap shots use reactions);
  - integers from 1 to 5, or null;
  - defects validated against the defect list (TASK-01-05-03-BE1);
  - only the fields provided are written.
- **Done when:**
  - Out-of-range values are rejected.
  - Nothing chosen means no write.
  - The shot exists before tasting, so the shot itself is never at risk
    (AC 4).

##### TASK-01-05-01-FE3 · Wire the tasting route
`frontend` · Parent: STORY-01-05-01 · 3 h · Depends on: TASK-01-05-01-FE2, TASK-01-05-01-BE1, TASK-01-03-03-FE1
- **Build:** `src/app/(task)/taste/[shotId]/page.tsx`. Choices stay in local
  state and are saved on Done. Leaving by tab or back counts as Done without
  changes and needs no confirmation. With nothing chosen, no request is made.
  Retry on failure.
- **Done when:**
  - Done and leave both save the choices (AC 3).
  - A failure keeps the choices and allows retry (AC 4).
  - The rating shows later on the shot (AC 5, with TASK-02-06-03-FE1).

##### TASK-01-05-01-QA1 · Test rating a shot
`qa` · Parent: STORY-01-05-01 · 3 h · Depends on: TASK-01-05-01-FE3
- **Build:**
  - Play tests: values visible (AC 1); tap again to unrate (AC 2); Done with
    nothing saves nothing (AC 3); failure keeps the choices (AC 4).
  - Node tests for `saveTasting` validation, measured only, isolation cases.
  - A check that the rating is returned in the shot detail read (AC 5).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-05-02: Score sweetness, acidity, bitterness and body

##### TASK-01-05-02-FE1 · Add the four sensory scales to the tasting screen
`frontend` · Parent: STORY-01-05-02 · 2 h · Depends on: TASK-01-05-01-FE2
- **Build:** Four numbered ChipGroups with `taste.sweetness`,
  `taste.acidity`, `taste.bitterness` and `taste.body`, end words
  `taste.low` and `taste.high`, and deselect allowed, saved together on Done.
- **Done when:** Each scale is operable by touch and keyboard (AC 4) and
  partial scores save only those chosen (AC 2).

##### TASK-01-05-02-QA1 · Test sensory scores
`qa` · Parent: STORY-01-05-02 · 2 h · Depends on: TASK-01-05-02-FE1
- **Build:** Play tests: whole numbers 1 to 5 with end words (AC 1), partial
  save (AC 2), deselect (AC 3), keyboard (AC 4). Node test: unscored values
  stay null.
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-01-05-03: Tag what went wrong

##### TASK-01-05-03-BE1 · Define the defect list
`backend` · Parent: STORY-01-05-03 · 2 h · Depends on: DQ-08
- **Build:** `src/domain/defects.ts`: a fixed `DefectKind` list, including
  `channelling` and `defects.*` keys. Until DQ-08 is answered it holds only
  `channelling`, plus the designer's DES-01-05-04 proposal if approved. It
  also provides `isDefect` validation and a mapping to shot warnings
  (`channelling` maps to the channelling warning).
- **Done when:** The list is the single source for UI options and
  validation, and adding a defect needs one edit plus its message key.

##### TASK-01-05-03-FE1 · Add the defect choices to the tasting screen
`frontend` · Parent: STORY-01-05-03 · 2 h · Depends on: TASK-01-05-03-BE1, TASK-01-05-01-FE2
- **Build:** A multi-choice ChipGroup from `defects.ts`. Chips stay
  monochrome when selected. The choices are saved as a JSON array on Done.
- **Done when:** Selecting several, none, and untagging all work.

##### TASK-01-05-03-QA1 · Test defect tagging
`qa` · Parent: STORY-01-05-03 · 2 h · Depends on: TASK-01-05-03-FE1
- **Build:** Play tests for several defects (AC 1), none (AC 2) and untag
  (AC 3). Node tests: an unknown defect is rejected, and saved defects are
  returned by the shot read (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-01-05-04: See a warning when a shot channelled

##### TASK-01-05-04-FE1 · Add the shared ShotWarnings component
`frontend` · Parent: STORY-01-05-04 (also 02-06-01, 02-06-02, 02-06-03) · 3 h · Depends on: TASK-01-01-06-FE1, TASK-01-05-03-BE1, DES-01-05-05
- **Build:**
  - `src/domain/shotWarnings.ts`: `shotWarnings(shot)` returns
    `['channelling']` when tagged. "Ran fast" is out (DQ-09).
  - `src/components/ui/ShotWarnings` renders a block or inline Notice in the
    warning tone with `shot.warnings.channelling`. Text is always present.

  Stories: block, inline, none, RTL.
- **Done when:**
  - The stories pass axe.
  - It's the only component that renders shot warnings.
  - With no channelling it renders nothing.

##### TASK-01-05-04-FE2 · Show the warning live on the tasting screen
`frontend` · Parent: STORY-01-05-04 · 2 h · Depends on: TASK-01-05-04-FE1, TASK-01-05-03-FE1
- **Build:** A block ShotWarnings directly under the defects group, driven by
  the current local selection. It appears on tagging and goes on untagging,
  with no layout jump above the defects.
- **Done when:** The warning toggles with the channelling chip (AC 1).

##### TASK-01-05-04-QA1 · Test the channelling warning and the signal rule
`qa` · Parent: STORY-01-05-04 · 3 h · Depends on: TASK-01-05-04-FE2
- **Build:**
  - Play test: tag and untag on the tasting screen (AC 1).
  - Story checks that the text alone carries the meaning, with a
    contrast-only run (AC 3).
  - Unit test for `shotWarnings`.
  - The signal grep test (TASK-01-01-06-QA1) still passes (AC 4).
  - Recent shots, detail and edit are covered by their QA tasks
    (TASK-02-06-01-QA1, TASK-02-06-03-QA1, TASK-02-06-02-QA1) (AC 2).
- **Done when:** AC 1, AC 3 and AC 4 are covered here, and AC 2 is linked to
  those tasks.

### EPIC-01-06: Add what's missing from the catalog

The epic suggests a split if it runs long. Coffee additions and the duplicate
check (STORY-01-06-01 to 05) can ship before the capability stories
(STORY-01-06-06 to 09). The build order allows that.

#### STORY-01-06-01: Add a missing machine, grinder or other kit

##### TASK-01-06-01-BE1 · Add URL normalisation
`backend` · Parent: STORY-01-06-01 (also 01-06-04, 01-06-05, 01-02-01) · 5 h · Depends on: TASK-01-01-04-QA1
- **Build:** `src/domain/url.ts` `normalizeUrl(raw)`:
  - requires http or https;
  - lowercases the host and strips `www.`;
  - drops the fragment;
  - strips tracking parameters (`utm_*`, `gclid`, `fbclid`, `mc_*`, `ref`,
    `srsltid` and similar) and sorts the remaining parameters;
  - strips regional path segments (locale and country segments such as
    `/en-gb/`, `/en_us/`, `/uk/`, `/us/`, `/de-de/`) using one rules list;
  - removes a trailing slash.

  It returns null when the input isn't a URL. The rules live in one place,
  so the per-market maintenance question stays open.
- **Done when:** A test table of at least 30 cases passes, including the
  regional variants of one product page and pages that must stay distinct.

##### TASK-01-06-01-BE2 · Add creating a hardware entry
`backend` · Parent: STORY-01-06-01 · 5 h · Depends on: TASK-01-06-01-BE1, TASK-01-02-01-BE2, TASK-01-01-04-BE1
- **Build:** Action `createHardwareEntry({ maker: { id } | { name, url },
  model: { name, kind, url, capabilities? } })`. In one transaction it:
  - creates the maker if it's new, with its own URL;
  - creates the model with `source='user'`, `status='unverified'` and
    `created_by_household_id`;
  - writes `catalog_urls` rows with `normalized_url`.

  The URL is required for each new row. The duplicate check
  (TASK-01-06-04-BE1) reruns before insert. It returns the new model ID.
- **Done when:**
  - A missing URL is rejected with nothing saved (AC 4).
  - A new maker plus model is atomic (AC 3).
  - Rows are marked user-added and unverified (AC 5).

##### TASK-01-06-01-FE1 · Build the catalog add screen (SCR-CATALOG-ADD) for hardware, with stories
`frontend` · Parent: STORY-01-06-01 (also 01-06-02, 04 to 07) · 6 h · Depends on: DES-01-06-01, PR-3, TASK-01-01-06-FE1
- **Build:** `src/components/screens/CatalogAddScreen`, props-only:
  - the `catalog.url` Input (`type="url"`, required) first, with a hint;
  - a `catalog.checking` line;
  - a duplicate slot and a check-failed Notice;
  - maker SelectField or `catalog.newMaker` (name and URL);
  - model name, with the kind preset;
  - a capabilities slot;
  - a `catalog.more` disclosure slot;
  - `catalog.save`;
  - a missing-link error in ink, and a save-failed Notice.

  Stories for each state, plus RTL.
- **Done when:** The stories pass axe, and the link is the first field.

##### TASK-01-06-01-FE2 · Wire adding hardware from the picker and return with it chosen
`frontend` · Parent: STORY-01-06-01 · 4 h · Depends on: TASK-01-06-01-FE1, TASK-01-06-01-BE2, TASK-01-02-01-FE2
- **Build:** `src/app/(task)/catalog/add/page.tsx?catalog=hardware&kind=&q=`:
  - the search text prefills the name;
  - save calls the action and returns to `returnTo` (add-kit) with
    `selected`;
  - a failure keeps everything;
  - the unsaved guard applies.
- **Done when:**
  - The name is prefilled (AC 1).
  - Saving returns to add-kit with the model chosen (AC 2).
  - A failure keeps all fields (AC 6).

##### TASK-01-06-01-QA1 · Test adding hardware
`qa` · Parent: STORY-01-06-01 · 4 h · Depends on: TASK-01-06-01-FE2
- **Build:**
  - Node tests for `createHardwareEntry`: required URL (AC 4); maker plus
    model atomic (AC 3); flags (AC 5); returns the ID used by add-kit (AC 2).
  - Play tests: the name prefill (AC 1) and failure keeps fields (AC 6).
  - The new entry appears in search marked as added by us (AC 5).
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-01-06-02: Add a missing roaster or coffee

##### TASK-01-06-02-BE1 · Add creating a coffee entry
`backend` · Parent: STORY-01-06-02 · 4 h · Depends on: TASK-01-06-01-BE1, TASK-03-01-01-BE1, TASK-01-02-01-BE2
- **Build:** Action `createCoffeeEntry({ roaster: { id } | { name, url },
  bean: { name, url, roastLevel?, tastingNotes? } })`, with the same rules as
  hardware:
  - `roastLevel` must be one of the S-09 list (`src/domain/roastLevels.ts`
    with `bean.roast.*` keys);
  - tasting notes are an array of trimmed strings, at most 4 (S-09);
  - one transaction, plus URL rows.
- **Done when:**
  - A missing URL is rejected (AC 4).
  - A new roaster plus bean is atomic (AC 2).
  - The optional fields can be empty (AC 3).
  - The rows are flagged (AC 5).

##### TASK-01-06-02-FE1 · Add the coffee variant of catalog add
`frontend` · Parent: STORY-01-06-02 · 4 h · Depends on: TASK-01-06-02-BE1, TASK-01-06-01-FE2, TASK-03-01-01-FE1
- **Build:** CatalogAddScreen's coffee variant: roaster SelectField or new
  roaster, bean name, a roast level ChipGroup (deselectable) and a
  tasting-notes Input. Wired with `catalog=coffee`, it returns to add-bag
  with the bean chosen. Stories.
- **Done when:** Saving returns to add-bag with the bean chosen (AC 1), and
  the stories pass axe.

##### TASK-01-06-02-QA1 · Test adding coffee
`qa` · Parent: STORY-01-06-02 · 3 h · Depends on: TASK-01-06-02-FE1
- **Build:** Node tests for AC 2 to AC 5 (roast level validation, at most four
  notes, required URL, flags). Play test for the return to add-bag with
  selection (AC 1).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-06-03: Keep what I add private until it's verified

##### TASK-01-06-03-BE1 · Apply catalog visibility to every read and every ID passed to an action
`backend` · Parent: STORY-01-06-03 · 3 h · Depends on: TASK-01-02-01-BE4, TASK-01-06-02-BE1
- **Build:**
  - `visibleCatalog(householdId)` is `status='verified' OR
    created_by_household_id = :household`.
  - It's applied in search, browse, the duplicate check and
    `assertVisibleCatalog(type, id)`, which every action that stores a
    catalog reference calls (add unit, add bag, the creates).
  - Verification is a manual admin update of `status` (TQ-10). No code
    changes when it happens.
- **Done when:**
  - Another household's unverified ID is rejected by actions as not found.
  - A verified entry is visible to all.

##### TASK-01-06-03-QA1 · Test catalog privacy and verification
`qa` · Parent: STORY-01-06-03 · 4 h · Depends on: TASK-01-06-03-BE1
- **Build:** Node tests with two households:
  - B can't find or use A's unverified maker, model, roaster or bean (AC 1);
  - A sees and uses its own, marked (AC 2);
  - after setting `status='verified'` directly in the test database, B
    finds it, and A's existing units, bags and shots are unchanged (AC 3).

  Plus isolation suite cases.
- **Done when:** AC 1 to AC 3 are covered.

#### STORY-01-06-04: Get pointed to an entry that already exists

##### TASK-01-06-04-BE1 · Add the duplicate URL check
`backend` · Parent: STORY-01-06-04 · 4 h · Depends on: TASK-01-06-01-BE1, TASK-01-06-03-BE1, TQ-03
- **Build:**
  - DAL `findByNormalizedUrl(catalog, url)` matches `catalog_urls` whose
    entity is visible (verified or own household only) and resolves merges.
  - Exposed as `GET /api/catalog/check-url`, and rerun inside both create
    actions.
  - It returns the existing entry (name, parent, kind) or none.
- **Done when:**
  - A regional variant matches (AC 2).
  - Another household's unverified match is not reported (AC 3).
  - The check runs before save and again at save (AC 5).

##### TASK-01-06-04-FE1 · Show the duplicate-found and check-failed states in catalog add
`frontend` · Parent: STORY-01-06-04 · 4 h · Depends on: TASK-01-06-04-BE1, TASK-01-06-01-FE2, DES-01-06-02, DQ-10
- **Build:**
  - On leaving the URL field, the check runs (aborting a stale one) with
    `catalog.checking`.
  - On a match: Notice `catalog.duplicateFound` naming the entry, with
    primary `catalog.useExisting`, which returns to the caller with that
    entry selected and creates nothing.
  - A ghost `catalog.addAnyway` sits behind a flag, off until DQ-10 allows
    it.
  - A network failure shows a neutral Notice, and save stays allowed.
- **Done when:**
  - A match is offered before other fields are filled (AC 1).
  - Accepting it returns with the entry chosen (AC 4).
  - Check failed still allows save (AC 5).

##### TASK-01-06-04-QA1 · Test duplicate detection
`qa` · Parent: STORY-01-06-04 · 4 h · Depends on: TASK-01-06-04-FE1
- **Build:**
  - Node tests: a verified match and an own-household match (AC 1); regional
    and tracking variants (AC 2); another household's unverified entry not
    reported (AC 3); the save-time recheck blocks a duplicate created during
    a network failure (AC 5).
  - Play tests: use-existing returns with selection and no row created
    (AC 4); check failed then save (AC 5).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-06-05: Add regional links and names to an entry

##### TASK-01-06-05-BE1 · Accept extra URLs and aliases on catalog creates
`backend` · Parent: STORY-01-06-05 · 3 h · Depends on: TASK-01-06-04-BE1, TQ-12
- **Build:** Both create actions accept `urls: { url, market | null }[]` and
  `aliases: { name, market | null }[]`. Each URL is normalised and checked
  for duplicates, rejecting with the matched entry. Aliases are trimmed and
  deduplicated. Markets are validated against the TQ-12 list.
- **Done when:**
  - Extra URLs save with their markets (AC 1), and aliases save (AC 2).
  - A duplicate extra URL is reported like the first one (AC 4).

##### TASK-01-06-05-FE1 · Add the repeatable links and other-names rows
`frontend` · Parent: STORY-01-06-05 · 4 h · Depends on: TASK-01-06-05-BE1, DES-01-06-04, TASK-01-06-04-FE1
- **Build:** Under `catalog.more`:
  - repeatable rows of URL Input plus market SelectField (names from
    `Intl.DisplayNames`, so no country names in messages);
  - repeatable rows of name plus market;
  - add and remove row buttons with accessible labels;
  - each extra URL checked on blur, like the first.

  Stories.
- **Done when:** The stories pass axe, and rows can be added and removed by
  keyboard.

##### TASK-01-06-05-QA1 · Test regional links and aliases
`qa` · Parent: STORY-01-06-05 · 3 h · Depends on: TASK-01-06-05-FE1
- **Build:** Node tests:
  - URLs with and without a market (AC 1);
  - aliases with and without a market (AC 2);
  - search by a new alias finds the entry for the adding household only
    while unverified (AC 3);
  - a duplicate extra URL is reported (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-01-06-06: Describe a machine I added in my own words

##### TASK-01-06-06-BE1 · Map the machine answers to capabilities
`backend` · Parent: STORY-01-06-06 · 3 h · Depends on: TASK-01-02-01-BE1, TQ-06
- **Build:** `src/domain/capabilityQuestions.ts`:
  - `machineAnswersToCapabilities(answers)` and the reverse
    (`capabilitiesToMachineAnswers`, for answering later);
  - every unanswered or "not sure" answer maps to the TQ-06 unknowns;
  - "no" maps to `control: 'none'`;
  - lever, paddle or valve maps to `manual`, with the gauge as yes, no or
    unknown;
  - settings map to `steps` with count or unknown;
  - exact maps to the unit (°C, °F or unknown) and an optional min and max.

  `createHardwareEntry` stores the result.
- **Done when:**
  - Unit tests cover every row of the design's machine question table.
  - The reverse mapping is lossless.

##### TASK-01-06-06-FE1 · Build the machine capability questions with follow-ups
`frontend` · Parent: STORY-01-06-06 · 5 h · Depends on: TASK-01-06-06-BE1, TASK-01-06-01-FE1, DES-01-06-03
- **Build:** `src/components/screens/CatalogAddScreen/MachineQuestions`:
  - `catalog.cap.title` with one sentence;
  - the temperature question, with follow-ups (how many, or unit then lowest
    and highest);
  - the pressure question, with follow-ups (gauge, how many, or lowest and
    highest bar);
  - every ChipGroup ends with `catalog.cap.notSure`;
  - follow-ups appear only when needed;
  - `catalog.cap.skipHint` says that unanswered means not sure.

  Stories: none-none (two taps), every follow-up, all skipped, RTL.
- **Done when:**
  - The stories pass axe, and the wording uses no schema terms.
  - A machine with no controls takes two answers (AC 3).

##### TASK-01-06-06-QA1 · Test the machine capability questions
`qa` · Parent: STORY-01-06-06 · 3 h · Depends on: TASK-01-06-06-FE1
- **Build:**
  - Play tests: the two questions with not sure (AC 1); follow-ups appear only
    as needed (AC 2); no-control is two taps (AC 3); the skip hint shows and
    unanswered saves as unknown (AC 4).
  - A Node test that a saved machine's capabilities drive the log's
    temperature and pressure config (AC 5, through `brewControls`).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-06-07: Describe a grinder I added in my own words

##### TASK-01-06-07-BE1 · Map the grinder answers to capabilities
`backend` · Parent: STORY-01-06-07 · 2 h · Depends on: TASK-01-06-06-BE1
- **Build:** `grinderAnswersToCapabilities` and the reverse:
  - clicks, smooth or unknown maps to `type`;
  - the lowest and highest numbers map to `min` and `max`, or null;
  - the step applies only for clicks, else null;
  - coarser maps to `higher`, `lower` or `unknown`.
- **Done when:** Unit tests cover each combination, and the reverse is
  lossless.

##### TASK-01-06-07-FE1 · Build the grinder capability questions
`frontend` · Parent: STORY-01-06-07 · 4 h · Depends on: TASK-01-06-07-BE1, TASK-01-06-06-FE1
- **Build:** `GrinderQuestions`: the dial question, two decimal Inputs for
  lowest and highest (optional), the step Input shown only for clicks, and
  the coarser question, each with not sure. Stories: clicks, smooth, all
  skipped, RTL.
- **Done when:** The stories pass axe, and the step question is hidden for
  smooth (AC 2).

##### TASK-01-06-07-QA1 · Test the grinder capability questions
`qa` · Parent: STORY-01-06-07 · 3 h · Depends on: TASK-01-06-07-FE1, TASK-01-03-02-FE2
- **Build:**
  - Play tests for AC 1 to AC 3.
  - A unit test that the saved capabilities produce the expected
    `grindWheelConfig` (range, step and direction captions) (AC 4).
- **Done when:** AC 1 to AC 4 are each covered.

#### STORY-01-06-08: Log shots even when I'm not sure about my kit

##### TASK-01-06-08-FE1 · Add the "not sure" fallbacks for the shot log
`frontend` · Parent: STORY-01-06-08 · 3 h · Depends on: TASK-01-03-02-FE2, TASK-01-04-01-FE3, TASK-01-04-02-FE1, DQ-11
- **Build:** `src/domain/capabilityFallbacks.ts` `effectiveCapabilities(caps)`
  applies the DQ-11 table:
  - unknown temperature or pressure control means no tab;
  - an unknown count means steps 1 to 5;
  - an unknown unit means °C;
  - an unknown exact range means 80 to 100 °C at step 0.5, or 0 to 12 bar at
    step 0.5;
  - an unknown gauge means no tab;
  - unknown clicks or smooth means step 0.1;
  - an unknown dial range means 0 to 100;
  - an unknown click step means 1;
  - an unknown coarser direction means no captions.

  The values live in one constants object, so DQ-11 changes are one edit.
  `grindWheelConfig` and `brewControls` read through it.
- **Done when:** Unit tests cover every row, and nothing produces a warning or
  uses signal (AC 2).

##### TASK-01-06-08-FE2 · Add the quiet "tell us about your kit" link in the log
`frontend` · Parent: STORY-01-06-08 · 2 h · Depends on: TASK-01-06-08-FE1, TASK-01-02-03-FE2
- **Build:** When any part of the toolkit's kit is unknown, a ghost link
  `log.capUnknown` appears once per screen, under the affected wheel, and
  opens that unit's capabilities on SCR-UNIT with return-to. It's not a
  Notice, and it disappears once nothing is unknown.
- **Done when:** It shows at most once per screen, and not at all when
  everything is known (AC 5).

##### TASK-01-06-08-QA1 · Test logging with unknown capabilities
`qa` · Parent: STORY-01-06-08 · 3 h · Depends on: TASK-01-06-08-FE2, DES-01-06-05
- **Build:**
  - ShotDial stories for a fully "not sure" grinder and machine: no
    temperature or pressure tab (AC 1); default steps and range (AC 2); wide
    grind range (AC 3); no direction captions (AC 4); one link (AC 5).
  - A Node test that a shot saves with these fallbacks.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-01-06-09: Answer capability questions later

##### TASK-01-06-09-BE1 · Add updating capabilities of the household's own unverified models
`backend` · Parent: STORY-01-06-09 · 3 h · Depends on: TASK-01-06-07-BE1, TASK-01-06-03-BE1
- **Build:** Action `updateModelCapabilities(hardwareId, answers)`: only when
  `source='user'`, `status='unverified'` and `created_by_household_id` is the
  session's household. It's rejected otherwise. It writes the mapped JSON and
  touches no shot.
- **Done when:**
  - Seeded, verified or another household's models are rejected (AC 5).
  - Old shots are untouched (AC 3).

##### TASK-01-06-09-FE1 · Show "not sure" answers on the unit screen and reopen the questions
`frontend` · Parent: STORY-01-06-09 · 4 h · Depends on: TASK-01-06-09-BE1, TASK-01-02-03-FE2, TASK-01-06-07-FE1
- **Build:** On SCR-UNIT, CapabilitySummary marks unknowns with
  `unit.capNotSure`. When editable, `unit.editCapabilities` opens the same
  Machine or Grinder questions prefilled through the reverse mapping, then
  saves. Seeded or verified models show the summary read-only.
- **Done when:**
  - Unknowns are marked and editable for own unverified models (AC 1).
  - Others are read-only (AC 5).
  - The next log follows the new answer (AC 2).

##### TASK-01-06-09-FE2 · Widen a wheel's range in edit mode to show an old value
`frontend` · Parent: STORY-01-06-09 · 2 h · Depends on: TASK-02-06-02-FE1
- **Build:** In SCR-LOG edit mode, if a stored grind, temperature or pressure
  value falls outside the current range, the wheel's min or max widens to
  include it, so it's shown as saved and never clamped silently.
- **Done when:** A stored value outside the new range is shown unchanged and
  saves unchanged when not touched (AC 4).

##### TASK-01-06-09-QA1 · Test answering later
`qa` · Parent: STORY-01-06-09 · 3 h · Depends on: TASK-01-06-09-FE1, TASK-01-06-09-FE2
- **Build:**
  - Node tests: own unverified model editable (AC 1); new log config follows
    (AC 2); old shots' stored values are unchanged (AC 3); seeded and
    verified models are rejected (AC 5).
  - Play test: edit an old shot outside the narrowed range (AC 4).
- **Done when:** AC 1 to AC 5 are each covered.

### EPIC-02-01: Pin the recipe that worked

#### STORY-02-01-01: Pin a recipe from a shot I liked

Schema: TASK-02-01-01-BE1.

##### TASK-02-01-01-BE2 · Add current-recipe resolution
`backend` · Parent: STORY-02-01-01 (also 02-01-03 to 05, 02-02, 02-03) · 3 h · Depends on: TASK-02-01-01-BE1, TASK-01-02-01-BE5
- **Build:** `src/server/dal/recipes.ts`:
  - `getCurrentRecipe({ beanId, personaId, toolkitId, drinkTypeId })` returns
    the latest `pinned_at` with `batch_id IS NULL` across the bean's merge
    group, with a stable tie-break on ID;
  - `listCurrentRecipesForBean(beanId, personaId)` returns one per drink and
    toolkit.

  This is the single "which recipe applies now" function (epic overlap
  flag). No drift or offset is applied (INIT-04).
- **Done when:** The latest pin wins, older ones are ignored, and a merged
  bean finds recipes pinned on either ID.

##### TASK-02-01-01-BE3 · Add pinning from a measured shot
`backend` · Parent: STORY-02-01-01 · 4 h · Depends on: TASK-02-01-01-BE2, TASK-01-04-01-BE1
- **Build:**
  - Action `pinFromShot(shotId)`:
    - the shot must be owned and `measured` (one-tap is rejected);
    - it copies the values, temperature and pressure pairs, grinder,
      machine, toolkit, drink and persona;
    - it takes the bean from the shot's portion's batch, resolved;
    - it sets `source_extraction_id` and `pinned_at`.
  - DAL `pinPreview(shotId)` returns the drink, coffee and toolkit, the new
    values and the current recipe it replaces.
- **Done when:**
  - The preview shows what the pin replaces (AC 1).
  - The saved recipe has every field (AC 2, AC 3).
  - One-tap is rejected (AC 4).
  - Later shot edits don't touch the recipe (AC 5).
  - A failure saves nothing (AC 6).

##### TASK-02-01-01-FE1 · Build the pin sheet (SH-PIN) with its stories
`frontend` · Parent: STORY-02-01-01 (also 02-01-02) · 4 h · Depends on: DES-02-01-01, TASK-01-01-05-FE2, PR-3
- **Build:** `src/components/ui/PinSheet` (or a screens sheet):
  - `recipe.pinTitle` naming drink, coffee and toolkit;
  - compact ShotValues of the new values;
  - when one exists, the current recipe above in `ink-secondary` with
    `recipe.replaces`;
  - primary `recipe.confirmPin`;
  - a pin-failed Notice that keeps the sheet open.

  Stories: new, replaces, failed, RTL.
- **Done when:** The stories pass axe, and one primary button.

##### TASK-02-01-01-FE2 · Wire pinning from the tasting and shot detail screens
`frontend` · Parent: STORY-02-01-01 · 3 h · Depends on: TASK-02-01-01-FE1, TASK-02-01-01-BE3, TASK-01-05-01-FE3, TASK-02-06-03-FE2
- **Build:** `recipe.pin` on TasteScreen and ShotDetailScreen (measured only)
  opens PinSheet with `pinPreview`. Confirm calls `pinFromShot`, announces
  `recipe.pinned` in a polite live region and refreshes.
- **Done when:**
  - Pin is reachable from both screens (AC 1) and confirmed in place (AC 2).
  - It's absent on one-tap shots (AC 4).
  - Failure retries (AC 6).

##### TASK-02-01-01-QA1 · Test pinning from a shot
`qa` · Parent: STORY-02-01-01 · 4 h · Depends on: TASK-02-01-01-FE2
- **Build:**
  - Node tests for `pinFromShot` and `pinPreview`: fields copied, including
    the temperature and pressure form (AC 2, AC 3); replaces shown (AC 1);
    one-tap rejected (AC 4); edit the source shot and the recipe is unchanged
    (AC 5); forced failure leaves no row (AC 6); isolation cases.
  - Play tests for the sheet states.
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-02-01-02: Pin a recipe by entering the values

##### TASK-02-01-02-BE1 · Add pinning entered values
`backend` · Parent: STORY-02-01-02 · 3 h · Depends on: TASK-02-01-01-BE2, TASK-01-04-01-BE1
- **Build:** Action `pinEnteredRecipe({ batchId (for the bean), toolkitId,
  drinkTypeId, values })`: the bean comes from the batch (resolved); the
  persona is the default; machine and grinder come from the toolkit now;
  `validateBrewControls` applies; `source_extraction_id` is null; no shot is
  written. Plus `pinPreview` for entered values.
- **Done when:** A recipe saves with no source and no extraction row
  (AC 3), and temperature and pressure follow the machine (AC 2).

##### TASK-02-01-02-FE1 · Add the recipe mode of the shot log
`frontend` · Parent: STORY-02-01-02 · 4 h · Depends on: TASK-02-01-02-BE1, TASK-02-01-01-FE1, TASK-01-04-02-FE1, DES-02-01-03
- **Build:** `/log?mode=recipe&batchId=`:
  - title `log.titleRecipe`;
  - context is drink and toolkit only (the coffee is fixed to the bag's
    bean);
  - ShotDial with temperature and pressure;
  - primary `recipe.pinThis` opens PinSheet, with no sweetened toggle and no
    tasting;
  - start values come from the current recipe or the defaults.
- **Done when:**
  - The title and button make clear it's pinning a recipe (AC 4).
  - The values are set as on the log (AC 1, AC 2).

##### TASK-02-01-02-QA1 · Test pinning by entering values
`qa` · Parent: STORY-02-01-02 · 3 h · Depends on: TASK-02-01-02-FE1
- **Build:** Node tests: no extraction written and no source (AC 3);
  temperature and pressure validated (AC 2). Play tests: recipe mode title,
  button, no save-shot path (AC 1, AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-02-01-03: Pin a better recipe and keep the old one

##### TASK-02-01-03-QA1 · Test that the newest pin wins and older pins are kept
`qa` · Parent: STORY-02-01-03 · 3 h · Depends on: TASK-02-01-01-BE3, TASK-02-01-02-BE1
- **Build:** Node tests:
  - pin twice for one key: the second is current (AC 1, AC 2);
  - every reader (home read, pre-fill, bag recipes) uses
    `getCurrentRecipe`, checked by a test per reader as each lands (AC 3);
  - the older row still exists unchanged (AC 4);
  - same-millisecond pins resolve deterministically.

  No code task is needed: resolution is TASK-02-01-01-BE2.
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-02-01-04: See the recipes for a coffee

##### TASK-02-01-04-BE1 · Add the recipes read for a bag
`backend` · Parent: STORY-02-01-04 · 3 h · Depends on: TASK-02-01-01-BE2, TASK-03-01-04-BE1
- **Build:** DAL `getBagRecipes(batchId)` calls `listCurrentRecipesForBean`
  for the bag's resolved bean and the default persona, returning drink,
  toolkit, values, `pinned_at` and `needsRedial`
  (TASK-02-01-05-BE1). Recipes pinned for the bean show on every bag of it.
- **Done when:**
  - One row per drink and toolkit (AC 1).
  - A new bag of the same bean gets the same recipes (AC 2).
  - The merge group is included (AC 5).

##### TASK-02-01-04-FE1 · Show the recipes section on the bag screen
`frontend` · Parent: STORY-02-01-04 · 4 h · Depends on: TASK-02-01-04-BE1, TASK-03-01-04-FE3, TASK-02-01-02-FE1, DES-02-01-02
- **Build:** On BagScreen's `bag.recipes` section, one ListRow per recipe
  with compact ShotValues and the formatted date. Tapping a row opens a
  SelectSheet-style action sheet: `recipe.dialIn` (opens `/log?mode=dialIn`,
  TASK-02-03-03-FE1) and `recipe.edit` (recipe mode). The empty state is
  `bag.noRecipes` with secondary `recipe.add`. Stories.
- **Done when:**
  - The rows show values and date (AC 1).
  - Dial in and change are available (AC 3).
  - The empty state offers add (AC 4).

##### TASK-02-01-04-QA1 · Test bag recipes
`qa` · Parent: STORY-02-01-04 · 3 h · Depends on: TASK-02-01-04-FE1
- **Build:** Node tests for AC 1, AC 2 and AC 5 (two bags of one bean, a
  merged bean). Play tests for the actions (AC 3) and the empty state
  (AC 4).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-02-01-05: Re-dial a recipe whose kit left its toolkit

##### TASK-02-01-05-BE1 · Mark recipes whose machine or grinder left their toolkit
`backend` · Parent: STORY-02-01-05 · 2 h · Depends on: TASK-02-01-01-BE2, TASK-01-02-06-BE1
- **Build:** `src/domain/recipes.ts` `needsRedial(recipe, toolkit)` is true
  when `recipe.grinderId` or `recipe.machineId` isn't in the toolkit's
  current components. Retired units are handled per the open question
  (section 9.2, question 3). It's included in every recipe read. The pull
  action refuses when it's true.
- **Done when:**
  - A swapped toolkit's recipe reports `needsRedial`.
  - Pinning a new recipe on the new unit makes the current one pullable
    (AC 3).

##### TASK-02-01-05-FE1 · Show the needs-re-dial state on Brew
`frontend` · Parent: STORY-02-01-05 · 3 h · Depends on: TASK-02-01-05-BE1, TASK-02-02-01-FE1, TASK-02-03-03-FE1
- **Build:** In the HomeScreen state for a recipe on a unit no longer in its
  toolkit:
  - values in `ink-secondary` with `home.needsRedial`;
  - primary `home.dialIn`, prefilled from the recipe with the toolkit's
    current kit;
  - no pull button.

  Bag recipes show the same marker.
- **Done when:**
  - The values are marked and no pull is offered (AC 1).
  - Dial in opens prefilled (AC 2).
  - The recipe is still listed on the bag (AC 4).

##### TASK-02-01-05-QA1 · Test re-dialing after a swap
`qa` · Parent: STORY-02-01-05 · 3 h · Depends on: TASK-02-01-05-FE1, TASK-02-02-02-BE1
- **Build:**
  - Node tests: swap a grinder, and the recipe needs a re-dial and is still
    listed (AC 1, AC 4); the pull is refused (STORY-02-02-02 AC 6); pin a new
    shot and it's pullable again (AC 3).
  - Play test on the Home state (AC 1, AC 2).
- **Done when:** AC 1 to AC 4 are each covered.

### EPIC-02-02: Pull your daily shot in one tap

#### STORY-02-02-01: See my daily shot on the home screen

##### TASK-02-02-01-BE1 · Add the home defaults: time-of-day drink, coffee and recipe
`backend` · Parent: STORY-02-02-01 · 6 h · Depends on: TASK-02-01-01-BE2, TASK-02-06-01-BE2, TASK-03-02-04-BE1
- **Build:**
  - `src/domain/homeDefaults.ts`, pure and testable with an injected "now"
    and time zone:
    - `pickDrink(shots, visibleDrinks, now, tz)`: the most recent drink with
      a shot within ±90 minutes of now's local time on any of the last 14
      days, else the most recent drink, else the first visible drink (DQ-02);
    - `pickCoffee(portions, recipes, lastPulled, drinkId)`: the coffee of the
      last pull for this persona and drink while it has an unfinished
      portion (DQ-17); else the earliest-opened open portion with a recipe;
      else the earliest-opened open portion; else the newest unopened
      (DQ-03).
  - DAL `getHome({ drinkId?, beanId? })` returns the drink, coffee (bean,
    roaster, portion in use), recipe (with `needsRedial`), toolkit name, a
    finished-coffee state and the persona label.

  Age and remaining are added by EPIC-03-03 and 03-04 and hidden until then.
- **Done when:** Unit tests cover:
  - morning versus afternoon (AC 2);
  - the ±90-minute boundary;
  - no history at this time of day, and no history at all (AC 3);
  - each coffee fallback (AC 4);
  - a finished recipe coffee (AC 5);
  - a DST change day.

##### TASK-02-02-01-FE1 · Wire Brew with the daily shot and its states
`frontend` · Parent: STORY-02-02-01 · 6 h · Depends on: TASK-02-02-01-BE1, TASK-01-01-07-FE2, TASK-01-01-06-FE4, PR-3, DES-02-02-01
- **Build:** `src/app/(app)/page.tsx` renders HomeScreen (PR #3) with
  `getHome()`:
  - the persona label, drink title, coffee line, large ShotValues (with
    temperature and pressure), toolkit line, `home.pull` and ghost
    `home.dialIn`;
  - the states: loading (Skeleton home card), first run (checklist), no
    recipe, finished coffee (`home.coffeeFinished` with
    `home.chooseCoffee` and `home.addBag`), and load failed.

  Check that PR #3's HomeScreen props cover each state, and extend them if
  not.
- **Done when:**
  - The drink, coffee, values and toolkit show (AC 1).
  - The finished state offers choose and add (AC 5).
  - There's one primary button in every state.

##### TASK-02-02-01-QA1 · Test the home screen defaults and states
`qa` · Parent: STORY-02-02-01 · 5 h · Depends on: TASK-02-02-01-FE1
- **Build:**
  - Unit tests in `homeDefaults.test.ts` for AC 2 to AC 4 with fixed clocks
    and time zones.
  - Node test for `getHome` with fixtures (AC 1, AC 5).
  - HomeScreen stories for each state, with axe and one primary button.
  - A manual check on a phone viewport.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-02-02-02: Pull this shot in one tap

##### TASK-02-02-02-BE1 · Add the one-tap pull
`backend` · Parent: STORY-02-02-02 · 5 h · Depends on: TASK-02-02-01-BE1, TASK-02-01-05-BE1, TASK-01-03-03-BE2, TQ-11
- **Build:** Action `pullShot({ clientId, drinkId, beanId, portionId? })`:
  - re-resolves the current recipe server-side and refuses if there's none or
    it needs a re-dial;
  - picks the earliest-opened open portion of the bean, or uses the given
    one (TASK-02-02-03-BE1);
  - inserts an extraction with `id = clientId` (idempotent: a second call
    returns the same shot) and `entry_mode='one-tap'`, copying the recipe's
    values, temperature and pressure, toolkit, grinder and machine, with the
    drink and coffee shown, the default persona and the session user;
  - sets the portion's `opened_at` if this shot opened it, with the exact
    same timestamp as the shot, for undo;
  - returns `{ shotId, openedPortion: boolean }`.
- **Done when:**
  - The fields are as AC 1 and AC 2 require.
  - The earliest-opened portion is used (AC 3).
  - A duplicate `clientId` writes once (AC 4).
  - A failure writes nothing (AC 5).
  - A needs-re-dial recipe is refused (AC 6).

##### TASK-02-02-02-FE1 · Extract PulledState (NC-07) into a component with its story
`frontend` · Parent: STORY-02-02-02 (also 02-02-04, 02-03-01) · 4 h · Depends on: PR-3, DES-02-02-02, TASK-01-01-06-FE1
- **Build:** Move the inline pulled state out of HomeScreen into
  `src/components/ui/PulledState`, props-only:
  - `home.pulled` in `text-h3` in a polite live region;
  - a ghost undo, visible while `undoAvailable` and then faded, with no
    countdown;
  - good and off chips (ChipGroup);
  - an optional neutral Notice.

  It occupies the same space as the buttons. HomeScreen uses it. Stories:
  just pulled, after the undo window, good selected, reaction failed,
  reduced motion, RTL.
- **Done when:**
  - The stories pass axe.
  - HomeScreen's existing stories still pass.
  - The live region is announced (checked in a play test).

##### TASK-02-02-02-FE2 · Wire the pull with optimistic feedback and double-tap protection
`frontend` · Parent: STORY-02-02-02 · 4 h · Depends on: TASK-02-02-02-BE1, TASK-02-02-02-FE1, TASK-02-02-01-FE1
- **Build:**
  - `home.pull` generates a `clientId` and switches to PulledState at once
    (`useOptimistic`, under 100 ms), then calls `pullShot`.
  - The button is gone after the first tap, so a second tap can't pull.
  - On failure it reverts to the normal card with Notice `home.pullFailed`
    and `actions.retry`, reusing the same `clientId`.
  - After 30 seconds, or on leaving, the normal card returns.
- **Done when:**
  - The shot is recorded and confirmed (AC 1).
  - A double tap records one shot (AC 4).
  - A failure shows retry with no shot (AC 5).
  - A re-dial recipe offers no pull (AC 6).

##### TASK-02-02-02-QA1 · Test the one-tap pull
`qa` · Parent: STORY-02-02-02 · 4 h · Depends on: TASK-02-02-02-FE2
- **Build:**
  - Node tests for `pullShot`: copied fields and mode (AC 1, AC 2); the
    earliest-opened of several open portions (AC 3); idempotent `clientId`
    (AC 4); a forced failure writes nothing (AC 5); a needs-re-dial refusal
    (AC 6); `is_network_eligible` false; isolation cases.
  - Play tests: optimistic state, double tap, failure and retry.
  - A manual check of the timing on a phone.
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-02-02-03: Choose a bag when none is open

##### TASK-02-02-03-BE1 · Add the portion choice for a pull
`backend` · Parent: STORY-02-02-03 · 2 h · Depends on: TASK-02-02-02-BE1
- **Build:**
  - DAL `listUnfinishedPortions(beanId)` returns bag, state, age and
    remaining (age and remaining once EPIC-03-03 and 03-04 land).
  - `pullShot` returns `needsPortion` when no portion is open and none was
    given, or `noneLeft` when no unfinished portion exists.
  - With an explicit `portionId`, it marks that portion opened at the shot
    time (DQ-06).
- **Done when:**
  - The choice is required only when none is open (AC 1).
  - The chosen portion is opened (AC 2).
  - `noneLeft` records nothing (AC 3).

##### TASK-02-02-03-FE1 · Build the portion sheet (SH-PORTION) with its stories
`frontend` · Parent: STORY-02-02-03 · 3 h · Depends on: DES-02-02-03, TASK-01-03-01-FE1
- **Build:** `PortionSheet`: `portion.chooseTitle` with ListRows of
  unfinished portions (bag, state, age, remaining), or `portion.noneLeft`
  with secondary `home.addBag`. Cancel records nothing. Stories: choose,
  none left, RTL.
- **Done when:** The stories pass axe.

##### TASK-02-02-03-FE2 · Wire the portion sheet into the pull
`frontend` · Parent: STORY-02-02-03 · 2 h · Depends on: TASK-02-02-03-FE1, TASK-02-02-03-BE1, TASK-02-02-02-FE2
- **Build:** On `needsPortion` or `noneLeft`, the optimistic state is
  withheld and PortionSheet opens. Choosing re-calls `pullShot` with the
  portion (same `clientId`). Add bag goes to `/pantry/add` with
  `returnTo=/`.
- **Done when:**
  - Choose records against the chosen portion (AC 2).
  - Cancel and none-left record nothing (AC 3, AC 4).

##### TASK-02-02-03-QA1 · Test choosing a bag when none is open
`qa` · Parent: STORY-02-02-03 · 3 h · Depends on: TASK-02-02-03-FE2
- **Build:** Node tests for AC 1 to AC 3 (needs portion, opened that day,
  none left). Play tests for the sheet with cancel (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-02-02-04: Undo a shot I didn't mean to pull

##### TASK-02-02-04-BE1 · Add undoing a one-tap pull
`backend` · Parent: STORY-02-02-04 · 3 h · Depends on: TASK-02-02-02-BE1, TQ-15
- **Build:** Action `undoPull(shotId)`, accepted only when all of these hold:
  - the shot is `one-tap`;
  - it was logged by the session user;
  - it's within 13 seconds of `created_at`.

  In one transaction it deletes the extraction. If the portion's `opened_at`
  equals the shot's `created_at` and the portion has no other shots, it
  clears `opened_at`.
- **Done when:**
  - Undo removes the shot (AC 1) and restores unopened (AC 2).
  - Reads no longer count it (AC 3).
  - After the window it's rejected and the shot stays (AC 4).

##### TASK-02-02-04-FE1 · Add undo to PulledState on Brew
`frontend` · Parent: STORY-02-02-04 · 2 h · Depends on: TASK-02-02-04-BE1, TASK-02-02-02-FE2
- **Build:** The undo ghost is shown for 8 seconds, then fades with no
  countdown. Undo calls `undoPull`, announces `home.undone`, returns to the
  normal card and refreshes.
- **Done when:**
  - The undo window is 8 seconds (DQ-04).
  - The undone shot is gone from the lists (AC 3).
  - After the window, undo is hidden (AC 4).

##### TASK-02-02-04-QA1 · Test undo
`qa` · Parent: STORY-02-02-04 · 3 h · Depends on: TASK-02-02-04-FE1
- **Build:**
  - Node tests: undo deletes (AC 1); `opened_at` is restored only when this
    shot set it (AC 2); remaining and recent shots exclude it (AC 3); after
    13 seconds it's rejected, and a measured shot or another user's shot is
    rejected (AC 4).
  - Play test with fake timers for the fade and no countdown.
- **Done when:** AC 1 to AC 4 are each covered.

#### STORY-02-02-05: Dial in when there's no recipe yet

##### TASK-02-02-05-FE1 · Open the shot log from the no-recipe state
`frontend` · Parent: STORY-02-02-05 · 2 h · Depends on: TASK-02-02-01-FE1, TASK-01-03-02-FE3
- **Build:** HomeScreen's no-recipe state shows `home.noRecipe` with primary
  `home.dialIn`, which opens `/log` (new mode) with `drinkId`, `portionId`
  and the toolkit preselected. After a pin, Brew refreshes to the pull.
- **Done when:**
  - The no-recipe state shows dial in (AC 1).
  - The log opens with context chosen and the starting values (AC 2).
  - After a pin, the pull is offered (AC 3).

##### TASK-02-02-05-QA1 · Test dialing in with no recipe
`qa` · Parent: STORY-02-02-05 · 2 h · Depends on: TASK-02-02-05-FE1, TASK-02-01-01-FE2
- **Build:** HomeScreen story for the no-recipe state (AC 1). A Node test
  that `getHome` returns no recipe, then a recipe after a pin (AC 3). A
  manual run from Brew to log to pin and back (AC 2, AC 3).
- **Done when:** AC 1 to AC 3 are covered.

#### STORY-02-02-06: Change the drink or coffee before pulling

##### TASK-02-02-06-BE1 · Add the coffee options and recipe lookup for a changed choice
`backend` · Parent: STORY-02-02-06 · 3 h · Depends on: TASK-02-02-01-BE1
- **Build:**
  - DAL `getHomeOptions(drinkId)` returns the visible drinks and the beans
    with an unfinished portion (those with a recipe for this drink first),
    each marked as `usual` when it's the default.
  - `getHome({ drinkId, beanId })` returns the recipe for a changed choice.

  The DQ-17 last-pulled-coffee rule is in `pickCoffee`. Nothing is stored as
  a setting.
- **Done when:**
  - The ordering and usual markers are correct (AC 1).
  - No settings table or column is written (AC 5).

##### TASK-02-02-06-FE1 · Add changing the drink and coffee in place on Brew
`frontend` · Parent: STORY-02-02-06 · 5 h · Depends on: TASK-02-02-06-BE1, TASK-01-03-01-FE1, TASK-02-02-01-FE1, DES-02-02-05
- **Build:**
  - The drink title and coffee line are quiet SelectFields opening
    SelectSheet with `home.usual` markers.
  - Choosing fetches `getHome` for the new pair through a Server Action, and
    updates the card in place with a 200 ms cross-fade of the values only.
    The buttons don't move.
  - A choice with no recipe switches to the no-recipe state.
  - The pull uses the chosen pair.
- **Done when:**
  - The options and usual markers show (AC 1).
  - The card updates without navigation (AC 2).
  - The pull uses the choice (AC 3).
  - No recipe offers dial in (AC 4).

##### TASK-02-02-06-FE2 · Reset an unpulled change after 30 minutes away
`frontend` · Parent: STORY-02-02-06 · 2 h · Depends on: TASK-02-02-06-FE1
- **Build:**
  - The current drink and coffee choice is kept in sessionStorage with a
    timestamp (try/catch).
  - On return to Brew after 30 minutes away, the choice resets to the
    defaults.
  - A pull clears it, since history now decides (DQ-17).
  - Changing the drink while PulledState shows ends PulledState.
- **Done when:**
  - The next default follows the pulled choice (AC 5).
  - An unpulled change resets after 30 minutes (AC 6).

##### TASK-02-02-06-QA1 · Test changing drink and coffee
`qa` · Parent: STORY-02-02-06 · 4 h · Depends on: TASK-02-02-06-FE2
- **Build:**
  - Node tests: option order and usual (AC 1); after a pull with a changed
    coffee, `pickCoffee` returns it while unfinished (AC 5); no settings
    written (AC 5).
  - Play tests: in-place update with buttons fixed (AC 2); the pull uses the
    choice (AC 3); no-recipe switch (AC 4); a fake-timer reset after 30
    minutes (AC 6).
- **Done when:** AC 1 to AC 6 are each covered.

### EPIC-02-03: Fix a bad shot from your recipe

#### STORY-02-03-01: Say whether a one-tap shot was good or off

##### TASK-02-03-01-BE1 · Add setting the reaction on a one-tap shot
`backend` · Parent: STORY-02-03-01 · 2 h · Depends on: TASK-02-02-02-BE1
- **Build:** Action `setReaction(shotId, 'good' | 'off' | null)`, for owned
  one-tap shots only, at any time (DQ-05).
- **Done when:** A measured shot is rejected, null clears the reaction, and
  isolation cases are added.

##### TASK-02-03-01-FE1 · Wire good and off in PulledState
`frontend` · Parent: STORY-02-03-01 · 3 h · Depends on: TASK-02-03-01-BE1, TASK-02-02-02-FE2
- **Build:**
  - Good saves and shows the chip selected, with nothing else.
  - Off saves, then opens `/log?mode=fix&shotId=`. The fix opens even if the
    save failed.
  - On failure the chip returns to unselected with a neutral Notice in
    PulledState.
  - No reaction means nothing is asked again.
- **Done when:**
  - Good is recorded (AC 1).
  - Silence leads to no prompt (AC 2).
  - Off is recorded and opens the fix (AC 3).
  - A failure is handled as described (AC 5).

##### TASK-02-03-01-FE2 · Add the reaction chips to the one-tap shot detail
`frontend` · Parent: STORY-02-03-01 · 2 h · Depends on: TASK-02-03-01-BE1, TASK-02-06-03-FE2
- **Build:** On ShotDetailScreen for one-tap shots, good and off chips
  (deselectable) call `setReaction`.
- **Done when:** A reaction can be given or changed later (AC 4).

##### TASK-02-03-01-QA1 · Test reactions
`qa` · Parent: STORY-02-03-01 · 3 h · Depends on: TASK-02-03-01-FE1, TASK-02-03-01-FE2
- **Build:** Node tests for `setReaction` (one-tap only, change, clear).
  Play tests for AC 1 to AC 3 and AC 5 in PulledState, and AC 4 on shot
  detail.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-02-03-02: Fix an off shot from my recipe

##### TASK-02-03-02-FE1 · Add the fix mode of the shot log with "was" values
`frontend` · Parent: STORY-02-03-02 · 4 h · Depends on: TASK-02-03-01-FE1, TASK-02-01-01-BE2, TASK-01-04-02-FE1, DES-02-03-01, DES-02-03-02
- **Build:** `/log?mode=fix&shotId=`:
  - title `log.titleFix`;
  - context is the one-tap shot's portion, drink and toolkit, read-only;
  - values come from the current recipe;
  - a `log.fromRecipe` line;
  - ShotDial shows `log.was` under changed tabs only. Check PR #3's ShotDial
    "was" support and add it if missing.

  Save calls `saveMeasuredShot`, which creates a new shot (DQ-12, two
  records). Leaving without saving keeps the off reaction.
- **Done when:**
  - The log is prefilled with the same portion and the note (AC 1).
  - "was" shows on changed values only (AC 2).
  - A new measured shot is saved, and the one-tap shot keeps off (AC 3).
  - Leaving saves nothing (AC 5).

##### TASK-02-03-02-FE2 · Make pinning the primary action after a fix or dial-in
`frontend` · Parent: STORY-02-03-02 (also 02-03-03) · 2 h · Depends on: TASK-02-03-02-FE1, TASK-02-01-01-FE2
- **Build:** `/taste/[shotId]?from=fix|dialIn` swaps the actions: primary
  `recipe.pin` and secondary `taste.done` (TasteScreen mode prop).
- **Done when:** Pin is the suggested next step after a fix (AC 4).

##### TASK-02-03-02-QA1 · Test fixing an off shot
`qa` · Parent: STORY-02-03-02 · 3 h · Depends on: TASK-02-03-02-FE2
- **Build:**
  - Node tests: after the fix there are two records, the one-tap shot with
    off and the new measured one (AC 3); the doses of both count, per SQ-14
    pending, noted in the test name.
  - Play tests: prefill and note (AC 1); "was" on changed values only (AC 2);
    pin primary (AC 4); leave keeps off (AC 5).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-02-03-03: Dial in from my recipe

##### TASK-02-03-03-FE1 · Add the dial-in mode of the shot log
`frontend` · Parent: STORY-02-03-03 · 3 h · Depends on: TASK-02-03-02-FE1, TASK-02-02-01-FE1
- **Build:** `/log?mode=dialIn&recipeId=` (from Brew's `home.dialIn`
  secondary and from bag recipes):
  - title `log.titleDialIn`;
  - values from the recipe, including temperature and pressure;
  - the recipe's toolkit and drink;
  - the portion picked by the one-tap rule (earliest-opened open portion);
  - "was" values.

  Save creates a measured shot, then tasting with pin primary. No one-tap
  shot is recorded.
- **Done when:**
  - The log is prefilled from the recipe (AC 1), with "was" on changes
    (AC 2).
  - Save makes a measured shot only, then pin is suggested (AC 3).

##### TASK-02-03-03-QA1 · Test dialing in from a recipe
`qa` · Parent: STORY-02-03-03 · 2 h · Depends on: TASK-02-03-03-FE1
- **Build:** Play tests for AC 1 and AC 2. A Node test: a measured shot and no
  one-tap row (AC 3). A check that the portion follows the one-tap rule.
- **Done when:** AC 1 to AC 3 are covered.

### EPIC-02-06: See your recent shots

#### STORY-02-06-01: See my recent shots

##### TASK-02-06-01-BE2 · Capture the device time zone for local-day calculations
`backend` · Parent: STORY-02-06-01 (also 02-02-01, 03-02, 03-03) · 2 h · Depends on: TASK-01-01-01-FE2, TQ-07
- **Build:**
  - The client writes `Intl.DateTimeFormat().resolvedOptions().timeZone`
    to a `tz` cookie at start and when it changes.
  - `src/server/time.ts` `getTimeZone()` validates the cookie, falling back
    to UTC.
  - `src/domain/localDay.ts`: `localDayKey(ms, tz)`, `startOfLocalDay` and
    `localNoon(dateString, tz)` for back-dated dates.
- **Done when:** Unit tests pass across a DST change and an invalid cookie.

##### TASK-02-06-01-BE1 · Add the recent shots read
`backend` · Parent: STORY-02-06-01 · 4 h · Depends on: TASK-02-06-01-BE2, TASK-01-03-03-BE1, TQ-04
- **Build:** DAL `listRecentShots({ before?, limit })`:
  - the household's shots newest first, the last 30 days (DQ-13), then
    older pages by a cursor on `(created_at, id)`;
  - each with drink, time, coffee (resolved bean), values, entry mode,
    reaction, defects (for warnings) and grinder ID (for dividers);
  - a `fromFrozen` flag added by TASK-03-03-03-BE1;
  - day grouping keys from `localDayKey`.
- **Done when:**
  - The order and window are right, and the cursor has no gaps or duplicates.
  - The query uses the `(household_id, created_at)` index.

##### TASK-02-06-01-FE1 · Wire the shots tab with day groups, markers and older shots
`frontend` · Parent: STORY-02-06-01 · 5 h · Depends on: TASK-02-06-01-BE1, TASK-01-05-04-FE1, PR-3, DES-02-06-01
- **Build:** `src/app/(app)/shots/page.tsx` renders RecentShotsScreen
  (PR #3):
  - day headings (`shots.today`, `shots.yesterday`, formatted dates);
  - rows with drink and time, coffee, and compact ShotValues;
  - markers `shots.oneTap`, `shots.good` and `shots.off`;
  - inline ShotWarnings;
  - a slot for the frozen marker and dividers;
  - `shots.showOlder` loading more with skeleton rows;
  - an EmptyState with `home.dialIn`;
  - a load-failed Notice.

  Rows open `/shots/[id]`.
- **Done when:**
  - The rows show every field (AC 1).
  - Markers are in words, and the warning is inline (AC 2).
  - Show older works (AC 3).
  - The empty state offers dial in (AC 4).
  - A row opens the detail (AC 5).

##### TASK-02-06-01-QA1 · Test the recent shots list
`qa` · Parent: STORY-02-06-01 · 4 h · Depends on: TASK-02-06-01-FE1
- **Build:**
  - Node tests: order, grouping by local day across midnight and DST
    (AC 1); the 30-day window and cursor (AC 3); isolation cases.
  - Story tests: one-tap versus measured in words, reaction, inline
    channelling warning (AC 2 and STORY-01-05-04 AC 2); empty (AC 4); values
    aligned in LTR and RTL.
  - Play test: a row opens the detail (AC 5).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-02-06-02: Fix a shot after the fact

##### TASK-02-06-02-BE1 · Add updating a shot's values, sweetened mark and taste
`backend` · Parent: STORY-02-06-02 · 4 h · Depends on: TASK-01-05-01-BE1, TASK-01-04-01-BE1
- **Build:** Action `updateShot(shotId, { values?, brewControls?,
  sweetened?, taste? })`:
  - the shot must be owned;
  - the context (portion, drink, toolkit, units, persona, logger and entry
    mode) can't be changed and is rejected if sent;
  - one-tap stays one-tap (open question);
  - brew controls are validated against the shot's own machine
    capabilities, allowing a stored out-of-range value to be kept unchanged;
  - recipes are never touched.
- **Done when:**
  - Only the allowed fields change (AC 1 to AC 3).
  - A dose change shows in remaining (AC 4, via reads).
  - The recipe is unchanged (AC 5).

##### TASK-02-06-02-FE1 · Add the edit mode of the shot log with taste on the same screen
`frontend` · Parent: STORY-02-06-02 · 5 h · Depends on: TASK-02-06-02-BE1, TASK-01-05-02-FE1, TASK-01-05-03-FE1, TASK-01-05-04-FE1, DES-02-06-03
- **Build:** `/log?mode=edit&shotId=`:
  - title `log.titleEdit`;
  - read-only context lines;
  - ShotDial with the saved values;
  - the sweetened toggle;
  - the tasting controls below, with the block warning under the defects;
  - `log.saveChanges`;
  - the unsaved guard with SH-CONFIRM.
- **Done when:**
  - Saved values and taste show together (AC 1).
  - The context isn't editable (AC 2).
  - Changes persist (AC 3).
  - Leave and confirm leaves the shot unchanged (AC 6).

##### TASK-02-06-02-QA1 · Test editing a shot
`qa` · Parent: STORY-02-06-02 · 4 h · Depends on: TASK-02-06-02-FE1
- **Build:**
  - Node tests: allowed and forbidden fields (AC 1 to AC 3); persona and
    logger unchanged (AC 3); one-tap stays one-tap; remaining follows the new
    dose once TASK-03-04-01-BE1 lands (AC 4); the source recipe is unchanged
    (AC 5).
  - Play tests: the edit layout and warning (STORY-01-05-04 AC 2); discard
    (AC 6).
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-02-06-03: See a shot's details

##### TASK-02-06-03-BE1 · Add the shot detail read
`backend` · Parent: STORY-02-06-03 · 2 h · Depends on: TASK-01-03-03-BE1, TASK-01-02-01-BE5
- **Build:** DAL `getShot(id)` returns the values, drink, coffee (resolved),
  toolkit name, the grinder and machine the shot was pulled with (even if
  retired), date and time, sweetened, taste and defects, entry mode and
  reaction.
- **Done when:** Every field in AC 1 is returned, and another household's ID
  returns not found.

##### TASK-02-06-03-FE1 · Build the shot detail screen (SCR-SHOT) with its stories
`frontend` · Parent: STORY-02-06-03 · 5 h · Depends on: DES-02-06-02, PR-3, TASK-01-05-04-FE1
- **Build:** `src/components/screens/ShotDetailScreen`, props-only:
  - large ShotValues, the context lines, date and time, sweetened, and
    scores and defects if any;
  - the block warning under the values;
  - measured shots: primary `recipe.pin` and secondary `actions.edit`;
  - one-tap shots: `shot.copiedFromRecipe`, primary edit, and a slot for the
    reaction chips, with no pin.

  Stories: measured, one-tap, channelling, retired unit, RTL.
- **Done when:** The stories pass axe, and pin is absent for one-tap shots.

##### TASK-02-06-03-FE2 · Wire the shot detail route
`frontend` · Parent: STORY-02-06-03 · 2 h · Depends on: TASK-02-06-03-FE1, TASK-02-06-03-BE1
- **Build:** `src/app/(app)/shots/[shotId]/page.tsx` with `getShot`. Edit
  opens `/log?mode=edit`, and pin opens PinSheet once TASK-02-01-01-FE2
  lands.
- **Done when:** Edit is at most two taps from the Shots tab (design
  acceptance criteria).

##### TASK-02-06-03-QA1 · Test shot details
`qa` · Parent: STORY-02-06-03 · 3 h · Depends on: TASK-02-06-03-FE2
- **Build:** Node test for `getShot` fields, including a retired unit (AC 1).
  Story tests: measured actions (AC 2); one-tap note, edit and no pin
  (AC 3); warning (AC 4).
- **Done when:** AC 1 to AC 4 are each covered.

### EPIC-03-01: Add a bag to your pantry

#### STORY-03-01-01: Find my coffee in the catalog

Schema: TASK-03-01-01-BE1.

##### TASK-03-01-01-BE2 · Add the coffee seed list
`backend` · Parent: STORY-03-01-01 · 3 h · Depends on: TASK-01-02-01-BE3, TASK-03-01-01-BE1, TQ-10
- **Build:** `src/db/seed/coffee.json` (roasters, beans with roast level and
  notes, aliases, URLs), loaded by the same idempotent loader. The content is
  a placeholder until TQ-10 names a curator.
- **Done when:** The seed is idempotent and has no personal data.

##### TASK-03-01-01-BE3 · Add coffee catalog search with recent purchases first
`backend` · Parent: STORY-03-01-01 · 4 h · Depends on: TASK-03-01-01-BE2, TASK-01-02-01-BE4, TASK-03-01-02-BE1
- **Build:** DAL `searchCoffee({ query })` matches bean names, roaster names
  and aliases with visibility and merges, like hardware. With an empty query
  it lists the beans of this household's recent batches first (by
  `purchased_at` or `created_at`), then browses roasters. It's exposed
  through the same search Route Handler.
- **Done when:**
  - Results show bean with roaster (AC 1).
  - Recent purchases come first when the query is empty (AC 2).
  - Aliases match (AC 3).
  - Merged and private entries are handled (AC 4, AC 5).

##### TASK-03-01-01-FE1 · Wire the coffee picker
`frontend` · Parent: STORY-03-01-01 · 3 h · Depends on: TASK-03-01-01-BE3, TASK-01-02-01-FE2
- **Build:** `/catalog/pick?catalog=coffee` uses CatalogPickScreen's coffee
  variant. "Can't find" goes to `/catalog/add?catalog=coffee` with the query.
  Selection returns to add-bag.
- **Done when:**
  - The flow returns a bean to add-bag.
  - The no-match offer is present (AC 6).

##### TASK-03-01-01-QA1 · Test coffee search
`qa` · Parent: STORY-03-01-01 · 4 h · Depends on: TASK-03-01-01-FE1
- **Build:** Node tests for AC 1 to AC 5 (names, recent first, alias, merged,
  private, isolation cases). Play test for no match with add (AC 6).
- **Done when:** AC 1 to AC 6 are each covered.

#### STORY-03-01-02: Add a bag with its dates and weight

Schema: TASK-03-01-02-BE1.

##### TASK-03-01-02-BE2 · Add creating a bag with one whole-bag portion
`backend` · Parent: STORY-03-01-02 (also 03-01-03) · 4 h · Depends on: TASK-03-01-02-BE1, TASK-03-01-01-BE3, TASK-02-06-01-BE2
- **Build:** Action `addBag({ beanId, bagWeight, roastDate?, bestBefore?,
  lotCode?, purchasedAt? })`:
  - the bean must be visible (resolved);
  - the weight is required and above zero, in grams;
  - only one of roast date or best-before may be set;
  - dates are stored as local noon (TQ-07);
  - `purchasedAt` defaults to today.

  In one transaction it inserts the batch and one portion with
  `weight = bagWeight`, unopened. It returns the batch ID.
- **Done when:**
  - The bag has one whole portion (AC 1).
  - Neither date is required (AC 2), and optional fields save (AC 3).
  - No weight means nothing saved (AC 4).
  - Two bags of one bean are separate (AC 5).

##### TASK-03-01-02-FE1 · Build the add-bag screen (SCR-BAG-ADD) with its stories
`frontend` · Parent: STORY-03-01-02 · 5 h · Depends on: DES-03-01-01, PR-3, TASK-01-01-03-FE1
- **Build:** `src/components/screens/BagAddScreen`, props-only:
  - the chosen coffee with a change link;
  - a `bag.weight` ChipGroup (250, 340, 500 and 1000 g formatted) plus
    `bag.otherWeight`, which reveals a grams Input;
  - a `bag.roastDate` date Input, with the `bag.onlyBestBefore` Toggle
    swapping it for `bag.bestBefore`, and a hint that age needs one of them;
  - a `bag.more` disclosure with lot and purchased date (default today);
  - the weight error in ink, and a save-failed Notice.

  Stories for each state, plus RTL.
- **Done when:** The stories pass axe, and no date blocks saving.

##### TASK-03-01-02-FE2 · Wire the add-bag flow
`frontend` · Parent: STORY-03-01-02 · 3 h · Depends on: TASK-03-01-02-FE1, TASK-03-01-02-BE2, TASK-03-01-01-FE1, TASK-01-01-05-FE5
- **Build:** `src/app/(task)/pantry/add/page.tsx`: the coffee picker, then
  details, then `addBag`. It lands on `/pantry/[batchId]`, or on `returnTo`
  with the new portion selected (for example back to the log). The unsaved
  guard applies.
- **Done when:**
  - The bag is added and shown with its portion (AC 1).
  - From the log, it returns with the portion chosen.

##### TASK-03-01-02-QA1 · Test adding a bag
`qa` · Parent: STORY-03-01-02 · 4 h · Depends on: TASK-03-01-02-FE2
- **Build:**
  - Node tests for `addBag` (AC 1 to AC 5): weight required, both dates
    optional, only one date stored, purchased defaults to today in the time
    zone, separate batches, isolation cases.
  - Play tests for size presets and other weight, the best-before toggle and
    hint, and the missing-weight error.
  - A manual timing check (design target: under 20 seconds).
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-03-01-03: Start with the whole bag ready to brew

##### TASK-03-01-03-QA1 · Test that a new bag is ready to brew and opens on the first shot
`qa` · Parent: STORY-03-01-03 · 3 h · Depends on: TASK-03-01-02-BE2, TASK-01-03-03-BE2, TASK-03-02-01-BE1
- **Build:** Node tests:
  - a new bag has one unopened portion of the full weight (AC 1);
  - the portion is offered in `getLogContext` (AC 2);
  - the first measured shot sets `opened_at` that day (AC 3);
  - after a split it's still one batch with one roast date and lot (AC 4).

  No code task is needed: the behaviour is in TASK-03-01-02-BE2 and
  TASK-01-03-03-BE2.
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-03-01-04: See what's in my pantry

##### TASK-03-01-04-BE1 · Add the pantry and bag reads
`backend` · Parent: STORY-03-01-04 · 4 h · Depends on: TASK-03-01-02-BE2, TASK-03-02-04-BE1, TASK-01-02-01-BE5
- **Build:**
  - DAL `getPantry()` returns the unfinished bags with their bean and
    roaster (resolved) and portions with state, in pantry order: an open
    portion first (earliest opened first), then unopened, then freezer-only.
    It also returns a finished group. The order uses
    `src/domain/pantryOrder.ts`, shared with the one-tap rule.
  - `getBag(batchId)` returns the facts and portions.
  - Age and remaining are added by later tasks.
- **Done when:** The order matches the one-tap rule in tests, and merged
  beans show the survivor (AC 5).

##### TASK-03-01-04-FE1 · Build the pantry screen (SCR-PANTRY) with its stories
`frontend` · Parent: STORY-03-01-04 · 5 h · Depends on: DES-03-01-02, PR-3, TASK-01-01-06-FE3, TASK-01-01-06-FE2
- **Build:** `src/components/screens/PantryScreen`, props-only:
  - a header with `pantry.addBag`;
  - one Card per bag (bean `text-h3`, roaster `text-label`) with portion
    ListRows showing state, age and remaining slots;
  - a collapsed `pantry.finished` section;
  - an EmptyState with `pantry.addBag`;
  - two skeleton cards for loading.

  Stories for each state, plus RTL.
- **Done when:** The stories pass axe.

##### TASK-03-01-04-FE2 · Build the bag screen (SCR-BAG) with its stories
`frontend` · Parent: STORY-03-01-04 (also 02-01-04, 03-02, 03-03, 03-04) · 5 h · Depends on: DES-03-01-03, PR-3
- **Build:** `src/components/screens/BagScreen`, props-only:
  - the facts once at the top (roast or best-before date, lot, purchased,
    bag weight, an explanation slot for age);
  - portion ListRows that open the actions slot;
  - a `bag.recipes` section slot.

  Stories: one portion, split portions, finished, RTL.
- **Done when:** The stories pass axe, and the bag facts aren't repeated per
  portion.

##### TASK-03-01-04-FE3 · Wire the pantry tab and bag route
`frontend` · Parent: STORY-03-01-04 · 3 h · Depends on: TASK-03-01-04-FE1, TASK-03-01-04-FE2, TASK-03-01-04-BE1
- **Build:** `src/app/(app)/pantry/page.tsx` (`getPantry`) and
  `src/app/(app)/pantry/[batchId]/page.tsx` (`getBag`), with links between
  them.
- **Done when:**
  - The bags and portions show (AC 1) in order (AC 2), with the finished
    group (AC 3).
  - The empty state offers add (AC 4).

##### TASK-03-01-04-QA1 · Test the pantry list
`qa` · Parent: STORY-03-01-04 · 4 h · Depends on: TASK-03-01-04-FE3
- **Build:** Node tests for `getPantry`:
  - the fields (AC 1);
  - the order with open, unopened and freezer-only mixed, plus a tie-break
    (AC 2);
  - the finished group (AC 3);
  - a merged bean shows the survivor (AC 5);
  - isolation cases.

  Story test for empty (AC 4).
- **Done when:** AC 1 to AC 5 are each covered.

### EPIC-03-02: Split and freeze a bag

#### STORY-03-02-01: Split a bag into portions

##### TASK-03-02-01-BE1 · Add splitting a portion by weight
`backend` · Parent: STORY-03-02-01 · 4 h · Depends on: TASK-03-04-01-BE1, TASK-03-02-02-BE1, TQ-13
- **Build:** Action `splitPortion(portionId, takeGrams, freezeNew = true)`:
  - `takeGrams` must be above zero and at most the current remaining
    (`remainingWeight`);
  - the source portion's `weight` is reduced by `takeGrams`;
  - per TQ-13, if the source has a stock check, a new stock check is written
    at `remaining − takeGrams`;
  - a new portion is created in the same batch with `weight = takeGrams`,
    `frozen_at` now if `freezeNew`, and `opened_at` null;
  - all in one transaction.
- **Done when:**
  - The new portion has the weight, and the remainder is correct (AC 1).
  - Freeze defaults on (AC 2).
  - Taking more than is left is rejected (AC 3).
  - Repeated splits work (AC 4).
  - The batch facts and old shots are unchanged (AC 5).

##### TASK-03-02-01-FE1 · Build the split sheet (SH-SPLIT) and wire it
`frontend` · Parent: STORY-03-02-01 · 4 h · Depends on: DES-03-02-02, TASK-03-02-01-BE1, TASK-03-02-02-FE1
- **Build:** `SplitSheet`:
  - a "take out" NumberWheel in grams, step 1, from 1 to the remaining
    amount;
  - a live `portion.splitRemainder` text;
  - the `portion.freezeNew` Toggle, on by default;
  - a primary confirm.

  Opened from the portion actions. Stories, plus RTL.
- **Done when:**
  - The stories pass axe.
  - The remainder updates live (AC 1).
  - The wheel can't exceed the remaining amount (AC 3).

##### TASK-03-02-01-QA1 · Test splitting
`qa` · Parent: STORY-03-02-01 · 4 h · Depends on: TASK-03-02-01-FE1
- **Build:** Node tests for AC 1 to AC 5:
  - the weights add up;
  - freeze defaults on;
  - over-take rejected;
  - three-way split by repetition;
  - the batch roast date and lot unchanged;
  - old shots still on the source;
  - the stock-check case per TQ-13.

  Play test for the live remainder.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-03-02-02: Record freezing and thawing

##### TASK-03-02-02-BE1 · Add the portion lifecycle rules and freeze and thaw
`backend` · Parent: STORY-03-02-02 (also 03-02-03) · 4 h · Depends on: TASK-03-02-04-BE1, TASK-02-06-01-BE2
- **Build:**
  - `src/domain/portionActions.ts` `allowedActions(portion)` follows the
    design's state table:
    - unopened: open, freeze, split;
    - counter: weigh, split, freeze, finish;
    - frozen: thaw, split;
    - thawed: open, weigh, finish.
  - Actions `freezePortion(id, date?)` and `thawPortion(id, date?)`:
    - the date is today by default, or an earlier local date (stored as
      local noon);
    - future dates are rejected;
    - thaw before freeze is rejected;
    - no second freeze after a thaw.
- **Done when:**
  - Today is the default and backdating works (AC 1, AC 2).
  - Refreezing isn't allowed (AC 3), and a thaw before the freeze date is
    rejected (AC 4).
  - Only the valid actions are offered (AC 5).

##### TASK-03-02-02-FE1 · Build the portion actions sheet and date sheet (SH-PORTION-ACTIONS, SH-DATE) with stories
`frontend` · Parent: STORY-03-02-02 (also 03-02-01, 03, 03-04-02) · 5 h · Depends on: DES-03-02-01, DES-03-02-03, TASK-01-01-05-FE2, TASK-01-01-03-FE1
- **Build:**
  - `PortionActionsSheet` lists only the given actions, each as a ListRow.
  - `DateSheet` (SH-DATE) has a date Input defaulting to today, an error in
    ink, and a primary confirm, so "today" is one tap.

  Stories for each portion state, a date error, and RTL.
- **Done when:** The stories pass axe, and each state shows only its actions.

##### TASK-03-02-02-FE2 · Wire portion actions from the bag and pantry rows
`frontend` · Parent: STORY-03-02-02 · 2 h · Depends on: TASK-03-02-02-FE1, TASK-03-02-02-BE1, TASK-03-01-04-FE3
- **Build:** Tapping a portion row opens PortionActionsSheet with
  `allowedActions`. Dated actions go through DateSheet to their action. A
  failure keeps the sheet open with a Notice and retry. The page refreshes on
  success.
- **Done when:** Freezing and thawing work from both screens, and failures
  retry.

##### TASK-03-02-02-QA1 · Test freezing and thawing
`qa` · Parent: STORY-03-02-02 · 3 h · Depends on: TASK-03-02-02-FE2
- **Build:**
  - Unit tests for `allowedActions` per state (AC 3, AC 5).
  - Node tests: default today, backdate, future rejected (AC 1, AC 2); thaw
    before freeze rejected (AC 4); isolation cases.
  - Play test for the DateSheet error.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-03-02-03: Record opening and finishing a portion

##### TASK-03-02-03-BE1 · Add opening and finishing a portion
`backend` · Parent: STORY-03-02-03 · 2 h · Depends on: TASK-03-02-02-BE1
- **Build:** Actions `openPortion(id, date?)` (allowed for unopened and
  thawed) and `finishPortion(id, date?)` (allowed for counter and thawed),
  with the same date rules. A finished portion is excluded from log and pull
  options (already true in those reads). Automatic opening on the first shot
  is in TASK-01-03-03-BE2 and TASK-02-02-02-BE1.
- **Done when:**
  - Open and finish save their dates (AC 1, AC 3).
  - A finished portion isn't offered.
  - A bag with every portion finished is in the finished group (AC 3).

##### TASK-03-02-03-QA1 · Test opening and finishing
`qa` · Parent: STORY-03-02-03 · 3 h · Depends on: TASK-03-02-03-BE1, TASK-03-02-02-FE2
- **Build:** Node tests:
  - manual open with a backdate (AC 1);
  - auto-open on the first measured and one-tap shot (AC 2);
  - finish excludes the portion from options, and the last finish moves the
    bag to finished (AC 3);
  - a finished portion's shots are still listed (AC 4).

  Play test for the actions from a row.
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-03-02-04: See where each portion is

##### TASK-03-02-04-BE1 · Add the calculated portion state
`backend` · Parent: STORY-03-02-04 (also 03-01-04, 01-03-01, 02-02) · 2 h · Depends on: TASK-03-01-02-BE1
- **Build:** `src/domain/portionState.ts` `portionState(portion)` returns
  `finished`, `frozen` (frozen and not thawed), `thawed`, `counter` (opened
  and not frozen) or `unopened`, from the dates only. It's never stored.
- **Done when:** Unit tests cover every date combination, including the order
  of precedence.

##### TASK-03-02-04-FE1 · Show the portion state in words everywhere a portion appears
`frontend` · Parent: STORY-03-02-04 · 2 h · Depends on: TASK-03-02-04-BE1, TASK-03-01-04-FE3
- **Build:** `portion.unopened`, `portion.counter`, `portion.frozen`,
  `portion.thawed` and `portion.finished` keys, used on pantry and bag rows,
  log coffee options and PortionSheet through one `portionStateLabel` helper.
- **Done when:** Every portion row shows its state as text (design acceptance
  criteria).

##### TASK-03-02-04-QA1 · Test portion states
`qa` · Parent: STORY-03-02-04 · 2 h · Depends on: TASK-03-02-04-FE1
- **Build:** Unit tests for AC 1 to AC 4. A Node test that changing dates
  changes the state (AC 5). Story check of the labels.
- **Done when:** AC 1 to AC 5 are covered.

### EPIC-03-03: Know how fresh your beans really are

#### STORY-03-03-01: See how old my beans are

##### TASK-03-03-01-BE1 · Add the bean age calculation
`backend` · Parent: STORY-03-03-01 (also 03-03-02, 02-02-01) · 4 h · Depends on: TASK-03-02-04-BE1, TASK-02-06-01-BE2, INIT-03 Q2
- **Build:** `src/domain/beanAge.ts`
  `beanAge(batch, portion, now, tz)` returns one of:
  - `{ kind: 'exact', days }`: local calendar days from the roast date to
    now, minus frozen days (freeze to thaw, or to now if still frozen);
  - `{ kind: 'estimated', days }`: from best-before, using the
    `ASSUMED_ROAST_TO_BEST_BEFORE_DAYS` constant (INIT-03 Q2, open);
  - `{ kind: 'unknown' }`;
  - `{ kind: 'paused', days }` while frozen.

  It also returns `frozenDays`. It's calculated, never stored, and added to
  the pantry, bag, home and log reads.
- **Done when:**
  - Unit tests cover all four kinds.
  - A day rollover adds one (AC 5).
  - The DST and time-zone edges pass.

##### TASK-03-03-01-FE1 · Show the bean age phrases on portions, Brew and the bag
`frontend` · Parent: STORY-03-03-01 · 4 h · Depends on: TASK-03-03-01-BE1, DES-03-03-01, TASK-03-01-04-FE3, TASK-02-02-01-FE1
- **Build:**
  - `portion.age`, `portion.ageEstimated`, `portion.ageUnknown` and
    `portion.agePaused` (ICU plurals) through one `beanAgeLabel` helper,
    shown on pantry and bag rows and on Brew's coffee line (`home.age`).
  - SCR-BAG explains the estimate, and offers `bag.addRoastDate` when the age
    is unknown, which needs a small `updateBagDates` action, included here.
  - No colour.
- **Done when:**
  - Exact, estimated, unknown and paused are worded differently (AC 1 to
    AC 4).
  - Unknown offers to add a date (AC 3).

##### TASK-03-03-01-QA1 · Test bean age
`qa` · Parent: STORY-03-03-01 · 4 h · Depends on: TASK-03-03-01-FE1
- **Build:** Unit tests for AC 1 to AC 5 with fixed clocks. Story tests for
  each phrase, with no colour classes. A Node test for `updateBagDates` and
  isolation.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-03-03-02: Freezing pauses aging

##### TASK-03-03-02-FE1 · Show the uncounted frozen days on the bag screen
`frontend` · Parent: STORY-03-03-02 · 2 h · Depends on: TASK-03-03-01-FE1
- **Build:** On SCR-BAG's portion detail line, `portion.frozenDays` (a plural)
  shows when `frozenDays` is above zero.
- **Done when:** A frozen-then-thawed portion shows its uncounted days
  (AC 4).

##### TASK-03-03-02-QA1 · Test that freezing pauses aging
`qa` · Parent: STORY-03-03-02 · 3 h · Depends on: TASK-03-03-02-FE1
- **Build:** Unit tests:
  - frozen on day 10 and still frozen stays at 10 (AC 1);
  - thawed, it resumes from 10 (AC 2);
  - two portions of one bag differ (AC 3).

  Story check for the frozen-days line (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-03-03-03: See bean age when logging, and spot frozen-ground shots

##### TASK-03-03-03-BE1 · Add the "ground from frozen" flag to shot reads
`backend` · Parent: STORY-03-03-03 · 2 h · Depends on: TASK-02-06-01-BE1, TASK-02-06-03-BE1, TQ-04
- **Build:** `src/domain/frozen.ts` `isFromFrozen(shotAt, portion)` is true
  when `frozen_at ≤ shotAt` and (`thawed_at` is null or `shotAt < thawed_at`).
  It's computed at read time in `listRecentShots` and `getShot`, so
  corrected dates apply immediately.
- **Done when:** Unit tests cover before freeze, while frozen, after thaw,
  never frozen and the same-day thaw (which needs TQ-04 precision).

##### TASK-03-03-03-FE1 · Show the bean age and frozen marker in the log, rows and detail
`frontend` · Parent: STORY-03-03-03 · 2 h · Depends on: TASK-03-03-03-BE1, TASK-03-03-01-FE1, TASK-02-06-01-FE1
- **Build:** The log's coffee field shows the portion's age, plus
  `bag.fromFrozen` when the portion is frozen. Shot rows and the detail show
  the `bag.fromFrozen` overline marker.
- **Done when:** The marker is text and identical on rows and detail (design
  acceptance criteria).

##### TASK-03-03-03-QA1 · Test the frozen marker
`qa` · Parent: STORY-03-03-03 · 3 h · Depends on: TASK-03-03-03-FE1
- **Build:** Story tests: the log coffee field with age and the frozen
  marker (AC 1). Node tests: a shot while frozen is marked (AC 2); after thaw
  or never frozen it isn't (AC 3); correcting the freeze or thaw date moves
  the mark (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

### EPIC-03-04: See how much coffee is left

#### STORY-03-04-01: See how much is left

##### TASK-03-04-01-BE1 · Add the remaining weight calculation
`backend` · Parent: STORY-03-04-01 (also 03-02-01, 02-02-03) · 4 h · Depends on: TASK-01-03-03-BE1, TASK-03-01-02-BE1
- **Build:**
  - `src/domain/remaining.ts` `remainingWeight({ weight, latestCheck, doses })`
    returns the latest stock check (else `weight`) minus the doses of every
    shot after it, measured and one-tap alike, clamped at 0, with
    `overLogged: boolean`.
  - A DAL aggregate per portion and per bag (a sum over portions), in SQL:
    one query, not one per row.
  - Added to the pantry, bag, home and portion-sheet reads.
- **Done when:**
  - Unit tests pass, including no shots, a check, and doses after the check.
  - The result is never negative.
  - The aggregate matches the domain function on fixtures.

##### TASK-03-04-01-FE1 · Build Meter (NC-15) with its story
`frontend` · Parent: STORY-03-04-01 · 3 h · Depends on: DES-03-04-03
- **Build:** `src/components/ui/Meter`: a 2 px `line` track with an `ink`
  fill, `role="meter"` with `aria-valuenow`, `aria-valuemax` and a text
  `aria-valuetext` passed in. The fill grows from inline-start. Stories: 0,
  partial, full, RTL.
- **Done when:** The stories pass axe, and it mirrors in RTL.

##### TASK-03-04-01-FE2 · Show remaining coffee on rows, bags and Brew, with the over-logged notice
`frontend` · Parent: STORY-03-04-01 · 4 h · Depends on: TASK-03-04-01-BE1, TASK-03-04-01-FE1, TASK-03-01-04-FE3, TASK-02-02-01-FE1, DES-03-04-01
- **Build:**
  - Portion rows show `portion.remaining` (formatted grams) and a Meter.
  - Bag cards show the total.
  - Brew's footnote shows `home.remaining`, hidden when unknown.
  - An over-logged portion shows 0 g and a neutral Notice
    `portion.overLogged` with `portion.weigh`.
- **Done when:**
  - Grams show on portions (AC 1).
  - The bag total and Brew portion show (AC 2).
  - Over-logged shows zero and offers to weigh (AC 4).

##### TASK-03-04-01-QA1 · Test remaining coffee
`qa` · Parent: STORY-03-04-01 · 4 h · Depends on: TASK-03-04-01-FE2, TASK-02-02-04-BE1, TASK-02-06-02-BE1
- **Build:**
  - Node tests: measured and one-tap doses (AC 1); bag totals (AC 2); undo
    and edit of a dose change the result (AC 3); over-logged clamps and sets
    the flag (AC 4); isolation cases.
  - Story tests for the Meter text and the neutral Notice, with no signal.
- **Done when:** AC 1 to AC 4 are each covered.

#### STORY-03-04-02: Weigh what's left

##### TASK-03-04-02-BE1 · Add recording a stock check
`backend` · Parent: STORY-03-04-02 · 2 h · Depends on: TASK-03-04-01-BE1, TASK-03-02-02-BE1
- **Build:** Action `addStockCheck(portionId, grams)`, allowed for counter
  and thawed portions. The weight must be zero or more. `checked_at` is now.
- **Done when:** The latest check wins in `remainingWeight` (AC 3), and later
  doses subtract from it (AC 2).

##### TASK-03-04-02-FE1 · Build the stock sheet (SH-STOCK) and wire it
`frontend` · Parent: STORY-03-04-02 · 3 h · Depends on: TASK-03-04-02-BE1, DES-03-04-02, TASK-03-02-02-FE2
- **Build:** `StockSheet`: a grams NumberWheel (typed entry encouraged) and
  primary `portion.saveWeight`. A failure keeps the sheet with a Notice and
  retry. It opens from `portion.weigh` in the actions and from the
  over-logged Notice. Stories.
- **Done when:**
  - The stories pass axe.
  - Saving updates what's left (AC 1).
  - A failure retries (AC 4).

##### TASK-03-04-02-QA1 · Test weighing what's left
`qa` · Parent: STORY-03-04-02 · 2 h · Depends on: TASK-03-04-02-FE1
- **Build:** Node tests for AC 1 to AC 3 (set, doses after, latest of
  several). Play test for the failure and retry (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-03-04-03: See which bags are open or finished

##### TASK-03-04-03-BE1 · Add the calculated bag status
`backend` · Parent: STORY-03-04-03 · 2 h · Depends on: TASK-03-02-04-BE1
- **Build:** `src/domain/bagStatus.ts` `bagStatus(portions)` returns
  `finished` when every portion is finished, `open` when any portion is
  opened and not finished, else `null` (not yet open; shown through portion
  states, SQ-10). It's used by `getPantry` grouping and order.
- **Done when:** Unit tests cover each combination.

##### TASK-03-04-03-FE1 · Show the bag status on pantry cards and the bag screen
`frontend` · Parent: STORY-03-04-03 · 2 h · Depends on: TASK-03-04-03-BE1, TASK-03-01-04-FE3
- **Build:** `bag.statusOpen` and `bag.statusFinished` text on cards and
  SCR-BAG. Finished bags appear only in `pantry.finished`.
- **Done when:** The status is shown as text, and finished bags are grouped.

##### TASK-03-04-03-QA1 · Test bag status
`qa` · Parent: STORY-03-04-03 · 2 h · Depends on: TASK-03-04-03-FE1
- **Build:** Unit tests for AC 1 to AC 3. A Node test that changing a
  portion's dates changes the status and grouping (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

### EPIC-04-01: Record maintenance on your kit

#### STORY-04-01-01: Log maintenance on a piece of kit

Schema: TASK-04-01-01-BE1.

##### TASK-04-01-01-BE2 · Add recording maintenance and the unit's event list
`backend` · Parent: STORY-04-01-01 · 3 h · Depends on: TASK-04-01-01-BE1, TASK-02-06-01-BE2
- **Build:**
  - Action `addMaintenance(unitId, { kind, date?, note?, isRecalibration? })`:
    - the kind is one of burrs, clean, rezero, repair or other;
    - the date is today by default, or an earlier local date;
    - retired units are allowed.
  - DAL `listMaintenance(unitId)`, newest first.
  - No offsets are written (EPIC-04-03).
- **Done when:**
  - The event saves with its kind, date and note (AC 1).
  - The date defaults to today (AC 2).
  - The list is newest first (AC 3).
  - Retired units are listed (AC 5).

##### TASK-04-01-01-FE1 · Build the maintenance sheet (SH-MAINTENANCE) with its stories
`frontend` · Parent: STORY-04-01-01 (also 04-01-02) · 4 h · Depends on: DES-04-01-01, TASK-01-01-05-FE2, PR-3
- **Build:** `MaintenanceSheet`: a kind ChipGroup (`maintenance.kind.*`), a
  date defaulting to today, an optional note Input, a slot for the
  recalibration Toggle, primary `maintenance.save`, and a failure Notice.
  Stories: grinder, machine, failed, RTL.
- **Done when:** The stories pass axe, and a re-zero today is three taps.

##### TASK-04-01-01-FE2 · Add the maintenance section to the unit screen
`frontend` · Parent: STORY-04-01-01 · 3 h · Depends on: TASK-04-01-01-FE1, TASK-04-01-01-BE2, TASK-01-02-03-FE2
- **Build:** SCR-UNIT `maintenance.title`: event ListRows (kind, date, note
  excerpt, recalibration marker), `maintenance.none` with secondary
  `maintenance.add`, and `maintenance.add` opening the sheet.
- **Done when:**
  - The events show (AC 3).
  - The empty state offers add (AC 4).
  - Retired units show their events (AC 5).

##### TASK-04-01-01-QA1 · Test logging maintenance
`qa` · Parent: STORY-04-01-01 · 3 h · Depends on: TASK-04-01-01-FE2
- **Build:** Node tests:
  - the kinds, default date, backdate and future rejected (AC 1, AC 2);
  - list order (AC 3);
  - a retired unit (AC 5);
  - isolation cases.

  Story tests for empty (AC 4) and a three-tap re-zero.
- **Done when:** AC 1 to AC 5 are each covered.

#### STORY-04-01-02: Mark a recalibration

##### TASK-04-01-02-BE1 · Store the recalibration flag with its defaults
`backend` · Parent: STORY-04-01-02 · 2 h · Depends on: TASK-04-01-01-BE2, TQ-05
- **Build:** `addMaintenance` stores `is_recalibration`. It defaults to true
  for burrs and rezero on grinders, and false otherwise. It's always false,
  and rejected if sent true, for non-grinder units (DQ-15).
- **Done when:**
  - Grinder events can be marked (AC 1).
  - Burrs and re-zero default on (AC 2).
  - Machines can't be marked (AC 4).

##### TASK-04-01-02-FE1 · Add the recalibration toggle and marker
`frontend` · Parent: STORY-04-01-02 · 2 h · Depends on: TASK-04-01-02-BE1, TASK-04-01-01-FE2
- **Build:** In MaintenanceSheet, Toggle `maintenance.isRecalibration` for
  grinders only. It follows the kind's default until the user touches it.
  The `maintenance.recalibration` text marker shows on event rows (and
  dividers, TASK-04-01-04-FE1).
- **Done when:**
  - The default follows the kind (AC 2).
  - The marker is text (AC 3).
  - There's no toggle for a machine (AC 4).

##### TASK-04-01-02-QA1 · Test recalibration marking
`qa` · Parent: STORY-04-01-02 · 2 h · Depends on: TASK-04-01-02-FE1
- **Build:** Node tests for the defaults and the non-grinder rejection
  (AC 1, AC 2, AC 4). Story tests for the toggle by kind and the marker in
  words (AC 3).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-04-01-03: Know my grinder's current grind period

##### TASK-04-01-03-BE1 · Add the current grind period calculation
`backend` · Parent: STORY-04-01-03 (also 04-01-04) · 2 h · Depends on: TASK-04-01-01-BE2, TASK-01-03-03-BE1
- **Build:** `src/domain/grindPeriods.ts` `currentPeriod(events, now)` gives
  the latest grinder event at or before now. DAL
  `getGrindPeriod(grinderUnitId)` returns `{ since | null, shotCount }`,
  where the count is shots with that `grinder_id` and `created_at ≥ since`.
  It's derived from dates and never stored. Machine events are ignored.
- **Done when:**
  - Unit tests cover no events, several events and a backdated event.
  - Machine events don't affect it.

##### TASK-04-01-03-FE1 · Show the current period line on the grinder's unit screen
`frontend` · Parent: STORY-04-01-03 · 2 h · Depends on: TASK-04-01-03-BE1, TASK-04-01-01-FE2
- **Build:** Above the maintenance list on grinder units:
  `maintenance.periodSince` (formatted date) with `maintenance.periodShots`
  (plural), or `maintenance.periodAll` with no events. Machines show
  nothing.
- **Done when:**
  - The start and count are visible without opening anything (AC 1).
  - No events shows the all-in-one line (AC 2).

##### TASK-04-01-03-QA1 · Test grind periods
`qa` · Parent: STORY-04-01-03 · 2 h · Depends on: TASK-04-01-03-FE1
- **Build:** Node tests:
  - period start and count (AC 1);
  - no events (AC 2);
  - adding or backdating an event updates the result with no shot rows
    changed (AC 3);
  - a machine event has no effect (AC 4).
- **Done when:** AC 1 to AC 4 are covered.

#### STORY-04-01-04: See maintenance in my recent shots

##### TASK-04-01-04-BE1 · Merge grinder events into the recent shots feed
`backend` · Parent: STORY-04-01-04 · 3 h · Depends on: TASK-04-01-03-BE1, TASK-02-06-01-BE1
- **Build:** `listRecentShots` returns a merged feed of shots and divider
  items, sorted by time. A divider is included only when all of these hold:
  - it's a grinder event;
  - it's inside the listed time range;
  - that grinder has at least one shot in the list.

  Each divider carries the grinder name (nickname, else model), kind, date
  and recalibration flag, and gets the same day key as the shots, so it sits
  among that day's rows.
- **Done when:**
  - Two grinders show only the relevant dividers.
  - An event on a shot day sorts by time.
  - Paging older shots doesn't duplicate dividers.

##### TASK-04-01-04-FE1 · Build the grind period divider and show it in recent shots
`frontend` · Parent: STORY-04-01-04 · 4 h · Depends on: TASK-04-01-04-BE1, TASK-02-06-01-FE1, DES-04-01-02
- **Build:** `src/components/ui/PeriodDivider`:
  - a `line-strong` hairline with one `text-overline` `ink-secondary` line
    `shots.maintenance` (grinder, kind, date) plus
    `maintenance.recalibration`;
  - a list item with readable text (not a decorative `hr`) that links to the
    grinder's SCR-UNIT.

  Rendered in RecentShotsScreen between rows. Stories: plain,
  recalibration, among a day's rows, RTL.
- **Done when:**
  - The stories pass axe, and the divider is announced as a list item.
  - It's quieter than a shot row.

##### TASK-04-01-04-QA1 · Test maintenance dividers
`qa` · Parent: STORY-04-01-04 · 3 h · Depends on: TASK-04-01-04-FE1
- **Build:**
  - Node tests: the divider's content (AC 1); placement within a shot day
    (AC 2); no divider for machine events or grinders without listed shots
    (AC 3); a backdated event moves its divider and no shot changes (AC 4).
  - Play test: the divider opens the grinder (AC 5).
  - Screen reader text check.
- **Done when:** AC 1 to AC 5 are each covered.

---

## 8. Build order

Dependencies come first. Within that, the order follows the epics' MVP build
order, with these changes at task level (stated here so the change isn't
silent):

- **EPIC-01-05 (tasting) moves up, to just after EPIC-01-04.** Saving a shot
  lands on the tasting screen (STORY-01-03-03 AC 4), and pinning starts there
  (STORY-02-01-01).
- **Four shared tasks move earlier, without their screens.**
  - Portion state (TASK-03-02-04-BE1) moves up for the pantry and the log.
  - Time zone (TASK-02-06-01-BE2) moves before adding a bag.
  - URL normalisation (TASK-01-06-01-BE1) moves before the seed loader.
  - Remaining weight (TASK-03-04-01-BE1) moves before splitting.
- **EPIC-01-06 runs in parallel** with EPIC-01-03 to EPIC-01-05, as the epics
  allow. Its capability stories (06 to 09) can trail its coffee and duplicate
  stories (01 to 05).

**Wave 0: before any task.**
- PR #3 is merged (`PR-3`).
- The blocking questions TQ-01, TQ-02 and TQ-04 are answered.
- TQ-06 is answered before TASK-01-02-01-BE1, and TQ-05 before
  TASK-04-01-01-BE1.
- The DES-* tasks named in each task are delivered. Several, such as
  DES-01-01-03, DES-01-03-02, DES-01-03-04 and DES-02-01-04, are likely
  covered by PR #3.

**Wave 1: schema, migrations and test harness.** These are sequential.
1. TASK-01-01-01-BE1
2. TASK-01-01-04-QA1
3. TASK-01-01-01-BE2
4. TASK-01-01-02-BE1
5. TASK-01-02-01-BE1
6. TASK-03-01-01-BE1
7. TASK-01-02-01-BE2
8. TASK-01-02-02-BE1
9. TASK-03-01-02-BE1
10. TASK-01-03-03-BE1
11. TASK-02-01-01-BE1
12. TASK-04-01-01-BE1
13. TASK-01-01-01-QA1

**Wave 2: accounts, privacy and the app shell.** The two tracks run in
parallel, each in the order given.
- Backend:
  1. TASK-01-01-01-BE3
  2. TASK-01-01-01-BE4
  3. TASK-01-01-02-BE2
  4. TASK-01-01-01-BE5
  5. TASK-01-01-04-BE1
  6. TASK-01-01-04-QA2
  7. TASK-01-01-03-BE1
  8. TASK-03-02-04-BE1
  9. TASK-01-06-01-BE1
  10. TASK-02-06-01-BE2, after the frontend's TASK-01-01-01-FE2
- Frontend:
  1. TASK-01-01-05-FE1
  2. TASK-01-01-06-FE1
  3. TASK-01-01-06-FE2
  4. TASK-01-01-06-FE3
  5. TASK-01-01-05-FE2
  6. TASK-01-01-01-FE1
  7. TASK-01-01-05-FE3
  8. TASK-01-01-01-FE2, after the backend's TASK-01-01-01-BE5
  9. TASK-01-01-01-QA2
  10. TASK-01-01-02-FE1
  11. TASK-01-01-02-QA1
  12. TASK-01-01-05-FE4
  13. TASK-01-01-05-FE5
  14. TASK-01-01-05-FE6
  15. TASK-01-01-05-QA1
  16. TASK-01-01-06-FE4
  17. TASK-01-01-06-QA1
  18. TASK-01-01-03-FE1
  19. TASK-01-01-03-FE2
  20. TASK-01-01-03-FE3
  21. TASK-01-01-03-QA1
  22. TASK-01-01-07-FE1

**Wave 3: EPIC-01-02 (kit).**
1. Catalog search: TASK-01-02-01-BE5, TASK-01-02-01-BE3, TASK-01-02-01-BE4,
   TASK-01-02-01-FE1, TASK-01-02-01-FE2 and TASK-01-02-01-QA1.
2. Units: TASK-01-02-02-BE2, TASK-01-02-02-FE3, TASK-01-02-02-FE1,
   TASK-01-02-02-FE2, TASK-01-02-02-FE4 and TASK-01-02-02-QA1.
3. Retiring: TASK-01-02-03-BE1, TASK-01-02-03-FE1 and TASK-01-02-03-FE2.
   Its QA, TASK-01-02-03-QA1, moves to wave 5, after TASK-01-03-03-BE2.
4. Toolkits: TASK-01-02-04-BE1, TASK-01-02-04-FE1, TASK-01-02-04-FE2 and
   TASK-01-02-04-QA1.
5. Toolkit shortcut: TASK-01-02-05-BE1, TASK-01-02-05-FE1 and
   TASK-01-02-05-QA1.
6. Toolkit editing: TASK-01-02-06-BE1 and TASK-01-02-06-FE1. Its QA,
   TASK-01-02-06-QA1, moves to wave 5.
7. Swap warning: TASK-01-02-07-BE1, TASK-01-02-07-FE1 and TASK-01-02-07-QA1.

**Wave 4: EPIC-03-01 (pantry) and the checklist.**
1. Coffee search: TASK-03-01-01-BE2, TASK-03-01-01-BE3, TASK-03-01-01-FE1
   and TASK-03-01-01-QA1.
2. Adding a bag: TASK-03-01-02-BE2, TASK-03-01-02-FE1, TASK-03-01-02-FE2 and
   TASK-03-01-02-QA1.
3. Pantry list: TASK-03-01-04-BE1, TASK-03-01-04-FE1, TASK-03-01-04-FE2,
   TASK-03-01-04-FE3 and TASK-03-01-04-QA1.
4. Checklist: TASK-01-01-07-BE1, TASK-01-01-07-FE2 and TASK-01-01-07-QA1.
   The checklist's third step works fully only once wave 5 lands.

**Wave 5: EPIC-01-03 (shot log). Track A.**
1. Context: TASK-01-03-01-BE1, TASK-01-03-01-FE1, TASK-01-03-01-FE2 and
   TASK-01-03-01-QA1.
2. Values: TASK-01-03-02-FE1, TASK-01-03-02-FE2, TASK-01-03-02-BE1,
   TASK-01-03-02-FE3 and TASK-01-03-02-QA1.
3. Saving: TASK-01-03-03-BE2, TASK-01-03-03-FE1 and TASK-01-03-03-QA1.
4. Sweetened: TASK-01-03-04-FE1 and TASK-01-03-04-QA1.
5. Local formats: TASK-01-03-05-FE1 and TASK-01-03-05-QA1.
6. QA moved from wave 3: TASK-01-02-03-QA1 and TASK-01-02-06-QA1.

**Wave 5b: EPIC-01-06 (catalog additions). Track B, in parallel with waves 5
to 7.**
1. Hardware entries: TASK-01-06-01-BE2, TASK-01-06-01-FE1, TASK-01-06-01-FE2
   and TASK-01-06-01-QA1.
2. Coffee entries: TASK-01-06-02-BE1, TASK-01-06-02-FE1 and
   TASK-01-06-02-QA1.
3. Privacy: TASK-01-06-03-BE1 and TASK-01-06-03-QA1.
4. Duplicates: TASK-01-06-04-BE1, TASK-01-06-04-FE1 and TASK-01-06-04-QA1.
5. Links and aliases: TASK-01-06-05-BE1, TASK-01-06-05-FE1 and
   TASK-01-06-05-QA1.
6. Machine questions: TASK-01-06-06-BE1, TASK-01-06-06-FE1 and
   TASK-01-06-06-QA1.
7. Grinder questions: TASK-01-06-07-BE1, TASK-01-06-07-FE1 and
   TASK-01-06-07-QA1.
8. Answering later: TASK-01-06-09-BE1 and TASK-01-06-09-FE1.
9. The fallbacks wait for wave 6: TASK-01-06-08-FE1, TASK-01-06-08-FE2 and
   TASK-01-06-08-QA1.

**Wave 6: EPIC-01-04 (temperature and pressure).**
1. Temperature: TASK-01-04-01-FE1, TASK-01-04-01-FE2, TASK-01-04-01-BE1,
   TASK-01-04-01-FE3 and TASK-01-04-01-QA1.
2. Pressure: TASK-01-04-02-BE1, TASK-01-04-02-FE1 and TASK-01-04-02-QA1.
3. Then the 5b fallbacks: TASK-01-06-08-FE1, TASK-01-06-08-FE2 and
   TASK-01-06-08-QA1.

**Wave 7: EPIC-01-05 (tasting, moved up).**
1. Defect list first: TASK-01-05-03-BE1.
2. Rating: TASK-01-05-01-FE1, TASK-01-05-01-FE2, TASK-01-05-01-BE1,
   TASK-01-05-01-FE3 and TASK-01-05-01-QA1.
3. Scores: TASK-01-05-02-FE1 and TASK-01-05-02-QA1.
4. Defect choices: TASK-01-05-03-FE1 and TASK-01-05-03-QA1.
5. Warning: TASK-01-05-04-FE1, TASK-01-05-04-FE2 and TASK-01-05-04-QA1.

**Wave 8: EPIC-02-06 (recent shots).**
1. List: TASK-02-06-01-BE1, TASK-02-06-01-FE1 and TASK-02-06-01-QA1.
2. Detail: TASK-02-06-03-BE1, TASK-02-06-03-FE1, TASK-02-06-03-FE2 and
   TASK-02-06-03-QA1.
3. Editing: TASK-02-06-02-BE1, TASK-02-06-02-FE1 and TASK-02-06-02-QA1.
4. Finishing EPIC-01-06: TASK-01-06-09-FE2 and TASK-01-06-09-QA1.

**Wave 9: EPIC-04-01 (maintenance).**
1. Logging: TASK-04-01-01-BE2, TASK-04-01-01-FE1, TASK-04-01-01-FE2 and
   TASK-04-01-01-QA1.
2. Recalibration: TASK-04-01-02-BE1, TASK-04-01-02-FE1 and
   TASK-04-01-02-QA1.
3. Grind period: TASK-04-01-03-BE1, TASK-04-01-03-FE1 and TASK-04-01-03-QA1.
4. Dividers: TASK-04-01-04-BE1, TASK-04-01-04-FE1 and TASK-04-01-04-QA1.

**Wave 10: EPIC-02-01 (recipes).**
1. Pin from a shot: TASK-02-01-01-BE2, TASK-02-01-01-BE3, TASK-02-01-01-FE1,
   TASK-02-01-01-FE2 and TASK-02-01-01-QA1.
2. Pin by values: TASK-02-01-02-BE1, TASK-02-01-02-FE1 and
   TASK-02-01-02-QA1.
3. Newest pin wins: TASK-02-01-03-QA1.
4. Bag recipes: TASK-02-01-04-BE1, TASK-02-01-04-FE1 (its dial-in action
   is completed in wave 12) and TASK-02-01-04-QA1.
5. Re-dial rule: TASK-02-01-05-BE1.

**Wave 11: EPIC-02-02 (one tap).**
1. Daily shot: TASK-02-02-01-BE1, TASK-02-02-01-FE1 and TASK-02-02-01-QA1.
2. Pull: TASK-02-02-02-BE1, TASK-02-02-02-FE1, TASK-02-02-02-FE2 and
   TASK-02-02-02-QA1.
3. Choosing a bag: TASK-02-02-03-BE1, TASK-02-02-03-FE1, TASK-02-02-03-FE2
   and TASK-02-02-03-QA1.
4. Undo: TASK-02-02-04-BE1, TASK-02-02-04-FE1 and TASK-02-02-04-QA1.
5. No recipe: TASK-02-02-05-FE1 and TASK-02-02-05-QA1.
6. Changing drink and coffee: TASK-02-02-06-BE1, TASK-02-02-06-FE1,
   TASK-02-02-06-FE2 and TASK-02-02-06-QA1.

**Wave 12: EPIC-02-03 (fixing shots) and the re-dial state.**
1. Reactions: TASK-02-03-01-BE1, TASK-02-03-01-FE1, TASK-02-03-01-FE2 and
   TASK-02-03-01-QA1.
2. Fix mode: TASK-02-03-02-FE1, TASK-02-03-02-FE2 and TASK-02-03-02-QA1.
3. Dial-in mode: TASK-02-03-03-FE1 and TASK-02-03-03-QA1.
4. Re-dial state: TASK-02-01-05-FE1 and TASK-02-01-05-QA1.

**Wave 13: EPIC-03-02 (split and freeze).**
1. TASK-03-04-01-BE1 (remaining weight, moved earlier).
2. Freezing and thawing: TASK-03-02-02-BE1, TASK-03-02-02-FE1,
   TASK-03-02-02-FE2 and TASK-03-02-02-QA1.
3. Opening and finishing: TASK-03-02-03-BE1 and TASK-03-02-03-QA1.
4. Splitting: TASK-03-02-01-BE1, TASK-03-02-01-FE1 and TASK-03-02-01-QA1.
5. QA for the new bag: TASK-03-01-03-QA1.
6. Portion states: TASK-03-02-04-FE1 and TASK-03-02-04-QA1.

**Wave 14: EPIC-03-03 (bean age).**
1. Age: TASK-03-03-01-BE1, TASK-03-03-01-FE1 and TASK-03-03-01-QA1.
2. Frozen days: TASK-03-03-02-FE1 and TASK-03-03-02-QA1.
3. Frozen marker: TASK-03-03-03-BE1, TASK-03-03-03-FE1 and
   TASK-03-03-03-QA1.

**Wave 15: EPIC-03-04 (remaining coffee).**
1. Remaining: TASK-03-04-01-FE1, TASK-03-04-01-FE2 and TASK-03-04-01-QA1.
2. Weighing: TASK-03-04-02-BE1, TASK-03-04-02-FE1 and TASK-03-04-02-QA1.
3. Bag status: TASK-03-04-03-BE1, TASK-03-04-03-FE1 and TASK-03-04-03-QA1.

With two developers (one mostly backend, one mostly frontend) and EPIC-01-06
on its own track from wave 5, the critical path runs through waves 1, 2, 3,
5, 7, 8, 10, 11 and 12.

---

## 9. Questions

### 9.1 Technical decisions the spec doesn't make (TQ)

These are flagged rather than decided. **Blocking** means no task depending
on it can start.

- **TQ-01 (blocking) How Firebase anonymous auth reaches the server.**
  - Proposal:
    - The Firebase JS SDK signs the browser in anonymously.
    - It posts the ID token to `POST /api/session`.
    - The server verifies it with the Firebase Admin SDK (`verifyIdToken`)
      and sets an httpOnly session cookie (`createSessionCookie`, at most 14
      days).
    - The DAL verifies the cookie per request.
    - On expiry the client re-exchanges a fresh token silently.
  - Alternatives:
    - (a) Verify the ID token JWT ourselves with `jose` against Google's
      public keys. This needs no service account, but we own key rotation
      and expiry.
    - (b) Send the token as a header on each request. This doesn't work for
      Server Component page loads.
  - Needs:
    - a Firebase project and who owns it;
    - service-account credentials as deployment secrets, never in the public
      repo;
    - the new dependencies `firebase` and `firebase-admin`.
  - Blocks: TASK-01-01-01-BE3, TASK-01-01-01-BE4.
- **TQ-02 (blocking) How the server talks to libSQL, and where the
  prototype runs.**
  - Proposal:
    - One libSQL client and Drizzle instance in `src/db/client.ts`,
      `server-only`, on the Node.js runtime.
    - Server Components and Server Actions call a household-scoped DAL
      directly, with no separate API.
    - Migrations run at deploy, never per request.
  - The question: a serverless host can't keep `./data/tare.db`, so it would
    need hosted libSQL (Turso, with `DATABASE_URL` and
    `DATABASE_AUTH_TOKEN`, already supported by `drizzle.config.ts`). A single
    long-running Node server can keep the file. Where will it run?
  - Blocks: TASK-01-01-01-BE1.
- **TQ-03 Server Actions or Route Handlers.**
  - Proposal:
    - Server Actions for all mutations, each verifying the session and
      household, as Next's data-security guide requires, since actions are
      reachable by direct POST.
    - Server Components for reads.
    - Route Handlers only for the session exchange, typeahead catalog search
      and the URL duplicate check. The client dispatches Server Actions one
      at a time and can't abort them, which would make as-you-type search
      queue.
  - Sequential dispatch is a benefit for pull, then undo, then reaction.
  - Affects: TASK-01-01-01-BE4, TASK-01-02-01-BE4, TASK-01-06-04-BE1.
- **TQ-04 (blocking, X-1) Timestamp precision.**
  - S-08 declares `integer(..., { mode: 'timestamp' })`, which Drizzle stores
    as **seconds**. `CLAUDE.md` and the `schema.ts` conventions say integer
    **milliseconds**.
  - Proposal: `timestamp_ms` everywhere, which also gives same-day ordering
    for the frozen marker, maintenance dividers and re-pins. The spec owner
    updates S-08.
  - Blocks: all schema tasks.
- **TQ-05 Recalibration flag column.**
  - S-08's `maintenance_events` has nowhere to store DQ-15's flag.
  - Proposal: add `is_recalibration` (boolean, not null, default false).
  - Affects: TASK-04-01-01-BE1, TASK-04-01-02-BE1.
- **TQ-06 "Not sure" in the capabilities JSON.**
  - S-08's capability shapes have no unknown values.
  - Proposal: extend the JSON only, with no new columns:
    - `temperature: { control: 'unknown' }`;
    - `count: null`, `unit: null`, `min` and `max` null;
    - `pressure: { control: 'manual', gauge: null }`;
    - `grind: { type: 'unknown', min: null, max: null, step: null,
      coarser: 'unknown' }`.

    Seeded rows never use unknowns. The spec owner updates S-08.
  - Affects: TASK-01-02-01-BE1, TASK-01-06-06-BE1, TASK-01-06-07-BE1.
- **TQ-07 Time zone for local days.**
  - Grouping by day, "today", the time-of-day drink (DQ-02), bean age in days
    and back-dated dates all need the user's local day. Server Components
    don't know the device's zone, and S-08 stores none.
  - Proposal: a `tz` cookie set by the client, and back-dated dates stored as
    local noon.
  - Alternative: a `time_zone` column on `users`, which is a schema change.
  - Also confirm that bean age counts local calendar days.
  - Affects: TASK-02-06-01-BE2 and its dependents.
- **TQ-08 A second locale for testing.**
  - Several acceptance criteria need a language other than English:
    STORY-01-01-02 AC 2 and AC 3, STORY-01-01-03 AC 2, and STORY-01-03-05.
    Only `en` exists.
  - Proposal: a test-only messages fixture and `de-DE` number formatting,
    with no second shipped language in the MVP. Or name the MVP's second
    language.
- **TQ-09 Test layers.**
  - Story tests run in a browser with no database, and the screens are
    props-only. Route wiring is therefore covered by Node tests of the
    DAL and actions, play tests of the screens, and manual checks, not by a
    real end-to-end run.
  - Proposal: the Node test project (TASK-01-01-04-QA1), with no end-to-end
    suite.
  - Option: Playwright end-to-end tests for first launch, first shot, and
    one-tap pull with undo, about +16 h. Decide.
- **TQ-10 Catalog seed content and admin verification.**
  - Who supplies the seed list (makers, models with capabilities, roasters,
    beans, aliases, URLs)? The epics' "who curates" question is still open.
  - How is "manual admin verification" done in the MVP? Proposal: a
    developer edits `status` and `merged_into_id` in `db:studio` and writes a
    `catalog_merges` row by hand.
  - A small admin script would add about 4 h and isn't planned, since the
    epic puts tooling out of scope.
- **TQ-11 IDs.** Proposal: `crypto.randomUUID()` text keys, with the one-tap
  pull's ID generated on the client as an idempotency key. Low impact.
- **TQ-12 Markets for regional links and aliases.** Proposal: ISO 3166-1
  alpha-2 codes, with names from `Intl.DisplayNames`. Which markets are
  offered: all codes, or a short list? Low impact.
- **TQ-13 Splitting a portion that has a stock check.**
  - Proposal: the split writes a new stock check on the source portion, so
    remaining stays right. That adds a stock-check row the user didn't weigh.
  - Alternative: forbid splitting after a stock check.
- **TQ-14 Wheel ranges for dose, yield and time** (not in the spec).
  Proposal: dose 5 to 30 g, yield 5 to 100 g and time 5 to 90 s, each at step
  0.1. The split wheel uses steps of 1 g. Low impact.
- **TQ-15 How long the server accepts an undo.** Proposal: 8 seconds in the
  UI and 13 seconds on the server (a grace period for slow networks), only by
  the user who pulled. After that it's edit only. Low impact.

### 9.2 Product questions that block or shape MVP tasks (for the Head of Product)

1. **DQ-08 defect list.** It blocks the content of TASK-01-05-03-BE1. Until
   it's answered, only `channelling` ships, plus DES-01-05-04's proposal if
   approved.
2. **INIT-03 Q2: the assumed gap from roast date to best-before.** Without
   it, "estimated" bean age (STORY-03-03-01 AC 2) has no number. It blocks
   TASK-03-03-01-BE1.
3. **Retired units and recipes (EPIC-02-01 open question).** A retired unit
   stays in its toolkit's components (STORY-01-02-03 AC 5), so without a rule
   a one-tap pull would record a shot on a retired grinder. Proposal: treat a
   retired unit as "not in the toolkit", so the recipe needs a re-dial.
   Confirm. It affects TASK-02-01-05-BE1.
4. **Entry mode of an edited one-tap shot (EPIC-02-06).** The plan keeps it
   one-tap (TASK-02-06-02-BE1). Confirm.
5. **SQ-14: doses from an "off" one-tap shot and its fix.** Under DQ-12 (two
   records) both count toward coffee used, which may double-count. Confirm,
   or say which one counts. It affects TASK-03-04-01-BE1.
6. **DQ-11 fallback ranges** for "not sure" kit. They're one constants
   object (TASK-01-06-08-FE1), so changing them is cheap, but confirm before
   QA.
7. **DQ-10 "add anyway" when a duplicate link is found.** The option is built
   behind a flag that's off. Confirm off or on.
8. **SQ-16: who owns the first-run checklist.** It's planned under
   STORY-01-01-07 (EPIC-01-01). This doesn't affect the code.
9. **Build order change.** Tasting (EPIC-01-05) is built right after
   EPIC-01-04 rather than 12th, so that saving a shot lands on the tasting
   screen from the start. Confirm.
10. **TQ-08 and TQ-10** also need a product answer: a second language, and
    who curates the seed list.

---

## 10. Technical risks and tech debt

- **R-01 Dependency on PR #3.** About 30 tasks wire or extend PR #3's
  components. If their props change in review, or they lack states the
  design needs (for example ShotDial's unset and "was" states, ChipGroup's
  numbered deselect, HomeScreen's needs-re-dial state), the extension tasks
  grow. Mitigation: merge PR #3 before wave 2. Each extension task checks
  what's there first.
- **R-02 Anonymous accounts.** A cleared browser profile or a reset device
  loses the account. The MVP accepts this (S-02). Session cookie expiry must
  be silent (TASK-01-01-01-BE4), or users see the start screen again. Safari
  storage eviction (ITP) can drop the IndexedDB-held Firebase user after
  periods of inactivity, which would create a new empty household. The risk
  is high on iOS. Needs a decision on whether to accept it or prioritise
  EPIC-05-03.
- **R-03 S-08 deviations.** The timestamp mode (TQ-04), the recalibration
  column (TQ-05) and the "not sure" JSON (TQ-06) change the agreed schema.
  Each needs the spec updated, or the schema drifts from its source of
  truth.
- **R-04 JSON columns.** `toolkits.components`, `capabilities` and `defects`
  aren't enforced by the database. "Toolkits containing a unit" and
  "exactly one machine and one grinder" are application rules, so a bug can
  store a toolkit with two grinders. Mitigation: one validator per JSON
  shape, used on every write, and tests. Tech debt: a join table for toolkit
  components would be safer, but S-08 chose JSON.
- **R-05 Local-day maths.** Bean age, day groups, the time-of-day drink and
  "opened today" all depend on the time zone (TQ-07). Off-by-one errors near
  midnight and DST changes are likely without the shared `localDay` helpers
  and their tests.
- **R-06 Optimistic one-tap.** "Visible within 100 ms" means showing success
  before the server confirms. With a poor kitchen connection, the shot can
  fail after the user walks away. The design shows a retry Notice, but
  only if the user looks. There's no offline mode (design concern).
  Idempotent IDs prevent duplicates on retry.
- **R-07 Server Action dispatch.** The client dispatches actions one at a
  time. Pull, then undo, then reaction in quick succession are queued, which
  is correct, but a slow pull delays undo inside the 8-second window. The
  server grace period (TQ-15) covers this.
- **R-08 Fahrenheit round-trip.** °F is display-only and °C is stored
  (`real`). Rounding must be chosen so a stored value always re-displays as
  the same °F step, or a re-pinned recipe could drift by one degree.
  Covered by TASK-01-04-01-FE1's tests.
- **R-09 Catalog search quality.** SQLite `LIKE` lowercases ASCII only, so
  accented names ("Café") and other scripts may not match case-insensitively.
  This is fine for a small seed list. A normalised search column or SQLite
  FTS5 would be a schema addition and isn't planned.
- **R-10 Foreign keys.** Foreign-key enforcement depends on the libSQL
  connection settings. If it's off, household and catalog references aren't
  enforced at all. Checked in TASK-01-01-01-BE1.
- **R-11 Undo is a hard delete.** Undo deletes the extraction row (STORY-02-02-04
  AC 1, "as if it was never pulled"). That's the specified behaviour, but it's
  the only delete in the MVP. It's limited to the same user, one-tap shots and
  a short window.
- **R-12 Splitting with stock checks** (TQ-13). Without the extra stock check,
  remaining weight would be wrong after a split. This is subtle and has its
  own tests.
- **R-13 EPIC-01-06 size.** 104 h, the third-largest epic after EPIC-01-01
  (137 h) and EPIC-01-02 (119 h). The capability questions and their mapping
  are the riskiest part, as the epic says. The split option (stories 01 to 05
  first) is kept in the build order.
- **R-14 Test coverage of wiring.** Without an end-to-end suite (TQ-09), page
  and action wiring regressions are caught only by Node tests and manual
  checks.
- **R-15 Secrets in a public repo.** Firebase service-account keys must live
  only in deployment secrets. `.env.example` holds names, never values.
- **Tech debt accepted for the MVP:**
  - no offline queue;
  - no admin tooling for verification;
  - URL normalisation rules hard-coded in one list;
  - `is_network_eligible` never computed (X-3);
  - `has_milk` stored but unused.

---

## 11. Totals

**By epic (MVP)**

| Epic | Title | Stories | Tasks | Hours |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | 7 | 37 | 137 |
| EPIC-01-02 | Describe your kit once | 7 | 32 | 119 |
| EPIC-01-03 | Log a shot in seconds | 5 | 17 | 59 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | 2 | 8 | 27 |
| EPIC-01-05 | Say how it tasted | 4 | 13 | 35 |
| EPIC-01-06 | Add what's missing from the catalog | 9 | 29 | 104 |
| EPIC-02-01 | Pin the recipe that worked | 5 | 16 | 51 |
| EPIC-02-02 | Pull your daily shot in one tap | 6 | 20 | 70 |
| EPIC-02-03 | Fix a bad shot from your recipe | 3 | 9 | 24 |
| EPIC-02-06 | See your recent shots | 3 | 11 | 40 |
| EPIC-03-01 | Add a bag to your pantry | 4 | 16 | 59 |
| EPIC-03-02 | Split and freeze a bag | 4 | 12 | 37 |
| EPIC-03-03 | Know how fresh your beans really are | 3 | 8 | 24 |
| EPIC-03-04 | See how much coffee is left | 3 | 10 | 28 |
| EPIC-04-01 | Record maintenance on your kit | 4 | 14 | 37 |
| **Total** | | **69** | **252** | **851** |

The schema, migrations and test harness (section 6, 13 tasks, 38 h) are
counted in the epics of the stories they're parented to. EPIC-01-01 is large
because it carries the account, privacy and app-shell groundwork that every
other epic builds on.

**Coverage check:** every one of the 69 MVP stories has at least one `qa`
task.

- Two stories, STORY-02-01-03 and STORY-03-01-03, have only a QA task. Their
  behaviour is built by other stories' tasks, and the QA task tests it
  against their own acceptance criteria.
- Four stories, STORY-01-03-04, 01-03-05, 01-05-02 and 02-02-05, have one FE
  task and one QA task.

**Not included:**

- design tasks (DES-*, owned by the designer);
- Next and Later stories;
- the optional end-to-end suite (TQ-09, about +16 h);
- the optional catalog admin script (TQ-10, about +4 h).
