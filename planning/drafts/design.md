# Tare design (draft, round 1)

Source: `planning/drafts/epics.md` (approved by the Head of Product, revision
3, 30 epics), `docs/spec.md` S-01 to S-09 (S-01 and S-02 override older
sections), and the Phase 0 design system: `src/styles/tokens.css`,
`src/components/ui` (Button, Card, Input, NumberWheel), `src/components/brand`
(Logo) and `src/stories/Tokens.mdx`. `planning/drafts/stories.md` (first
version) was read for context only; this design is per epic, and stories will
be revised against it.

**Status: draft for the Head of Product, design review round 1.** No GitHub
issues have been created. Nothing here is production code.

## How to read this file

- **Detail level.** MVP epics (15) have full UX flows with empty, loading and
  error states, components, design acceptance criteria and design tasks.
  **Next epics (8) have lighter flows.** **Later epics (7) have brief
  direction only**, because they will be re-planned before they are built.
- **IDs.** Screens are `SCR-*`, sheets are `SH-*`, new components are
  `NC-NN`, design tasks are `DES-II-EE-NN` (initiative, epic, number), all
  labelled `design`. Design questions raised here are `DQ-NN`. Story
  questions from `stories.md` keep their `SQ-NN` IDs. IDs stay stable across
  review rounds.
- **Copy.** No copy is baked in. Screens name message keys
  (`home.pull`, `log.save`) and describe the copy in brackets where it helps,
  for example `home.pull` [the spec's "Pull This Shot"]. Final wording is for
  the story and build stage, in `src/i18n/messages/en.json`.
- **Direction.** "Start" and "end" mean inline-start and inline-end, so every
  layout mirrors in right-to-left. "Top" and "bottom" are block directions and
  don't mirror.
- **People.** Roles only: household member, main persona, sub persona, Head of
  Product.

---

## 1. Design foundations for every screen

These apply to every flow below and are not repeated per epic.

### 1.1 Principles applied

- **Japandi.** Paper background, generous space (48 to 96 px between
  sections), hairlines (`border-line`) and surface steps (`paper`, `surface`,
  `surface-sunken`) instead of boxes and shadows. When in doubt, remove.
- **Hierarchy from type, not colour.** Numbers in `text-display-xl` (wheel
  values) and `text-display` (hero values) at weight 200; titles `text-h1` and
  `text-h2` at 300; card titles `text-h3`; small text `text-body`,
  `text-label` and `text-overline` at 400. All numbers tabular (set globally).
- **Colour.** Semantic tokens only. `ink` for primary text, `ink-secondary`
  for labels and meta, `ink-tertiary` only at 18 px and larger (units next to
  display numbers, large placeholders). `signal` and `signal-subtle` only for
  shot warnings ("ran fast", "possible channelling"). Form errors, empty
  states and failures use ink with a stronger border (as `Input` already
  does).
- **One primary button per view.** `Button variant="primary"` once per screen
  or sheet; everything else is secondary or ghost.
- **Fast logging.** The daily shot is one tap. A dial-in shot is: open log
  (context already chosen), move one to four wheels, save. Tasting notes come
  after saving, never before.

### 1.2 Layout

- **Mobile first**, portrait phone at the machine, one hand. Content column
  max 36rem, centred on wider screens, with 24 px (`px-6`) side padding.
- **Touch targets** at least 44 px for anything used at the machine. Use
  `Button size="md"` (48 px) there; `size="sm"` (40 px) only for secondary
  actions in lists, with 8 px clear space around.
- **States.** Every data screen designs four states: loading (skeleton, no
  spinner over 300 ms of nothing), empty (one sentence and one action), error
  (what failed, in ink, and a retry), and normal.
- **Motion.** `--ease-calm`, 200 ms default. All motion respects
  `prefers-reduced-motion` (already global in `tokens.css`).
- **Right-to-left.** Logical utilities only. Directional glyphs (chevrons,
  the dose-to-yield arrow) mirror. NumberWheel already mirrors.
- **Accessibility.** Story tests with axe (`a11y.test: "error"`) on every new
  component; visible focus (`--color-focus` outline, already global);
  headings in order on every screen; sheets trap focus and return it on close;
  live regions announce one-tap results and undo.

### 1.3 Copy and formatting

- Keys are grouped by screen: `nav.*`, `start.*`, `home.*`, `log.*`,
  `taste.*`, `shots.*`, `shot.*` (existing field labels), `recipe.*`,
  `pantry.*`, `bag.*`, `portion.*`, `kit.*`, `unit.*`, `toolkit.*`,
  `maintenance.*`, `catalog.*`, `profile.*`, `drinks.*` (starter drink names,
  already planned as `drinks.latte` and so on), `defects.*`, `states.*`
  (shared loading, empty and error copy).
- Numbers and units through `Intl` / `useFormatter` or `src/lib/units.ts`;
  never a hand-joined number and unit. Shot time in seconds, one decimal.
  Dates through `useFormatter().dateTime` and relative time where it reads
  better ("today", "yesterday").
- Ratio uses the existing `shot.ratio` key, calculated, never stored.

---

## 2. App structure

### 2.1 Screen map

```
SCR-START  Launch (first run: create anonymous account)
   |
   v
+-------------------------- tab bar (NC-01) --------------------------+
| Brew              Shots              Pantry             Kit         |
| SCR-HOME          SCR-SHOTS          SCR-PANTRY         SCR-KIT     |
|   |                 |                  |                  |         |
|   |-> SCR-LOG       |-> SCR-SHOT       |-> SCR-BAG        |-> SCR-UNIT
|   |   (new, dial-in,|     |-> SCR-LOG  |     |-> SH-PORTION-ACTIONS
|   |    fix, recipe) |        (edit)    |     |-> SCR-LOG (recipe)
|   |   |-> SCR-TASTE |-> SH-PIN         |-> SCR-BAG-ADD    |-> SCR-UNIT-ADD
|   |   |-> SH-PIN    |                  |     |-> SCR-CATALOG-PICK
|   |-> SH-PORTION    |                  |           |-> SCR-CATALOG-ADD
|   |-> SH-SELECT     |                  |                  |-> SCR-TOOLKIT
|   |-> SCR-PROFILE   |                  |                  |-> SH-MAINTENANCE
+---------------------------------------------------------------------+
```

- **Tabs (NC-01).** Four destinations, text labels only, at the bottom of the
  screen: `nav.brew`, `nav.shots`, `nav.pantry`, `nav.kit`. No icons in the
  MVP: the design system has no icon set, and four short words are calmer and
  clearer than four pictograms. Active tab: `ink`, weight 400, with a 2 px
  `ink` bar at its top edge; inactive tabs: `ink-secondary`. The bar sits on
  `paper` with a `border-line` hairline above it. It respects the safe-area
  inset at the bottom.
- **Tasks are full screen, without the tab bar.** The shot log, add-a-bag,
  add-kit, toolkit, catalog picker and catalog add flows open over the tabs
  with a page header (NC-02) that has a ghost `actions.cancel` at the start
  and the screen title. Leaving with changes asks once (SH-CONFIRM).
- **Profile and settings** (SCR-PROFILE) open from the persona label at the
  top of SCR-HOME, not from a tab: the MVP has almost nothing to set, and the
  persona label is where Next adds persona switching (EPIC-05-01).
- **Sheets (NC-05)** for short choices and confirmations: pick a portion, pin
  a recipe, portion actions, add maintenance, generic select.
- **Return-to.** Any flow started from inside another (add a bag from the shot
  log, add kit from the first-run checklist) returns to where it started with
  the new item selected.

### 2.2 MVP screens and sheets

| ID | Screen | Epics |
|---|---|---|
| SCR-START | Launch: logo while the account is created; error and retry | 01-01 |
| SCR-HOME | Brew: today's recipe, Pull this shot, Dial in; first-run checklist | 02-02, 02-03, 01-01, 03-03, 03-04 |
| SCR-LOG | Shot log, five modes: new, dial-in from recipe, fix an off shot, edit, enter a recipe | 01-03, 01-04, 02-03, 02-06, 02-01 |
| SCR-TASTE | Shot saved: rate, score, defects, pin | 01-05, 02-01 |
| SCR-SHOTS | Recent shots | 02-06, 04-01 |
| SCR-SHOT | Shot detail | 02-06, 02-01, 01-05 |
| SCR-PANTRY | Pantry: bags and their portions | 03-01 to 03-04 |
| SCR-BAG | Bag detail: facts, portions, recipes for this coffee | 03-01 to 03-04, 02-01 |
| SCR-BAG-ADD | Add a bag: pick coffee, then bag details | 03-01 |
| SCR-KIT | Kit: toolkits and units | 01-02 |
| SCR-UNIT | Unit detail: capabilities, maintenance, retire | 01-02, 04-01 |
| SCR-UNIT-ADD | Add kit: kind, pick model, details | 01-02 |
| SCR-TOOLKIT | Create or edit a toolkit | 01-02 |
| SCR-CATALOG-PICK | Catalog picker (hardware or coffee), shared | 01-02, 03-01, 01-06 |
| SCR-CATALOG-ADD | Add a missing maker, model, roaster or bean | 01-06 |
| SCR-PROFILE | Profile name and about this device | 01-01 |
| SH-SELECT | Generic single choice (toolkit, drink, portion, coffee) | many |
| SH-PORTION | Which bag to use, when none of this coffee is open | 02-02 |
| SH-PIN | Confirm a pin, showing what it replaces | 02-01 |
| SH-PORTION-ACTIONS | Open, freeze, thaw, finish, weigh, split | 03-02, 03-04 |
| SH-SPLIT | Split off a portion by weight | 03-02 |
| SH-STOCK | Weigh what's left | 03-04 |
| SH-DATE | Confirm a dated action (default today) | 03-02, 04-01 |
| SH-MAINTENANCE | Add a maintenance event | 04-01 |
| SH-CONFIRM | Discard changes, retire a unit | many |

### 2.3 Home screen (SCR-HOME)

The home screen is the daily driver (S-06): one recipe, one tap. It is
designed here because every MVP flow starts from it; its behaviour is owned by
EPIC-02-02 (one tap), EPIC-02-03 (dial in, good or off), EPIC-01-01 (first
run) and EPIC-03-03 and 03-04 (age and remaining coffee).

**Layout, top to bottom (recipe pinned, coffee open):**

1. **Header row.** At the start, the persona label in `text-label`
   `ink-secondary` (the translated role label `profile.defaultName` ["Me"]
   until renamed), a button to SCR-PROFILE. At the end, the small
   `LogoMark` (24 px, in `ink`), decorative.
2. **Drink**, `text-h1` weight 300, as a quiet select (NC-06): the drink name
   with a small mirrored chevron. Tap opens SH-SELECT with the household's
   visible drinks. Default: the persona's last drink at this time of day
   (DQ-02).
3. **Coffee line**, `text-body` `ink-secondary`, also a quiet select: bean
   name, roaster, and bean age (`home.age` ["Day 12"], EPIC-03-03). Tap opens
   SH-SELECT with beans that have an open or unopened portion. Default: see
   DQ-03.
4. **Recipe values (NC-08, large).** Grind, dose, yield and time in
   `text-display` weight 200 on a 2 x 2 grid, each with an overline label
   (`shot.grind`, `shot.dose`, `shot.yield`, `shot.time`) and its unit in
   `ink-tertiary` (large, so allowed). Ratio under dose and yield in
   `text-label` (`shot.ratio`). Temperature and pressure, if the recipe has
   them, in one `text-body` line below.
5. **Toolkit line**, `text-label` `ink-secondary`: the recipe's toolkit name.
6. **Primary action.** `Button variant="primary" fullWidth` `home.pull`
   [Pull this shot].
7. **Secondary action.** `Button variant="ghost" fullWidth` `home.dialIn`
   [Dial in], opening SCR-LOG pre-filled from the recipe (EPIC-02-03).
8. **Footnote**, `text-label` `ink-secondary`: remaining coffee in the
   portion in use, `home.remaining` ["142 g left in this bag"] (EPIC-03-04).
   Hidden when unknown.

**After a pull (in place, no toast, no navigation):** the two buttons are
replaced by the pulled state (NC-07), in the same space so nothing jumps:

- `home.pulled` ["Shot logged"] in `text-h3`, announced in a polite live
  region.
- `home.undo` ghost button, available for the undo window (DQ-04), then it
  fades out (no countdown: a ticking number is stressful at the machine).
- The quick reaction (EPIC-02-03): two chips (NC-04) `home.reactionGood`
  [Good] and `home.reactionOff` [Off]. Silence is fine: nothing nags. "Off"
  opens SCR-LOG in fix mode. "Good" confirms with a check and stays.
- After 30 seconds, or on leaving the screen, the card returns to its normal
  state with `home.pull` ready for the next shot. The reaction can still be
  given later from the shot in SCR-SHOTS (DQ-05).

**States:**

| State | What shows |
|---|---|
| Loading | Skeleton (NC-11): a drink-title bar, a coffee line, four value blocks, a button-height block. |
| First run, nothing set up | Checklist (NC-12) `home.setup.*`: 1 add your machine and grinder (to SCR-UNIT-ADD), 2 add a bag of coffee (to SCR-BAG-ADD), 3 pull your first shot. Done steps show a check and `ink-secondary`; the next step is the only primary button. No drink title yet. |
| Kit and coffee, no recipe for this drink | Drink and coffee lines as normal; the values grid is replaced by one sentence `home.noRecipe` [no recipe yet for this drink and coffee]; the primary button is `home.dialIn`, opening a blank SCR-LOG with drink, coffee and toolkit chosen. This is the spec's "Dial in" in place of "Pull This Shot". |
| Recipe, but no portion of that coffee open | Normal layout. Pull opens SH-PORTION (EPIC-02-02). |
| Recipe, but the coffee is finished | Values shown in `ink-secondary`; `home.coffeeFinished` [you've finished this coffee]; primary `home.chooseCoffee` opens the coffee select; secondary `home.addBag`. |
| Pull failed | Card stays in its normal state; inline notice (NC-10, neutral) `home.pullFailed` with `actions.retry`. No shot is recorded. |
| Load failed | Inline notice `states.loadFailed` with `actions.retry`, in place of the card. |

---

## 3. New components

Phase 0 has Button, Card, Input, NumberWheel and Logo. Every MVP flow below
reuses them first. These new components are needed; each gets a Storybook
story with text from `en.json`, axe checks and a right-to-left story.

| ID | Component | What it is | Why existing ones don't cover it | First used by |
|---|---|---|---|---|
| NC-01 | **TabBar** | Bottom navigation, four text tabs, active bar, safe-area aware | No navigation exists | App shell (EPIC-01-01) |
| NC-02 | **PageHeader** | Screen title (`text-h1` or `text-h2`), optional back or cancel at the start, optional action at the end | No header exists | All screens |
| NC-03 | **ListRow** | Hairline-separated row: primary text, secondary line, end slot (value, label, chevron that mirrors), whole row tappable | Card is too heavy for lists | Shots, pantry, kit, pickers |
| NC-04 | **ChipGroup** | Single choice (radio group) or multiple choice (checkbox group) chips, `border-line-strong`, selected = `ink` fill with `on-action` text; keyboard arrows; optional numbered scale variant (1 to 5) | No choice control exists | Reaction, scores, rating, defects, kind, temperature and pressure steps, bag size presets |
| NC-05 | **Sheet** | Bottom sheet on phones, centred dialog on wide screens; `paper` with a `border-line` top edge and a `surface` grabber, no shadow; scrim in `ink` at low opacity; focus trap; Escape and swipe down close | No overlay exists | SH-* |
| NC-06 | **SelectField** | Shows the current choice and opens SH-SELECT. Two looks: field (like Input, on `surface-sunken`) and quiet (text only, with a chevron, for the home screen) | Input is for typing | Log context, home drink and coffee |
| NC-07 | **PulledState** | The in-place result of a one-tap pull: confirmation, undo for the window, good and off chips, live-region announcement | New behaviour | SCR-HOME |
| NC-08 | **ShotValues** | Grind, dose, yield, time (and optional temperature, pressure) as a read-only group. Sizes: large (home, detail, 2 x 2 grid) and compact (one line in rows). Dose-to-yield arrow mirrors | Nothing displays a set of values | Home, shots, bag recipes, pin sheet |
| NC-09 | **ShotDial** | The shot log's editor: a row of compact value tabs (grind, dose, yield, time, plus temperature and pressure when the machine has them) above one full NumberWheel for the selected value. Shows the starting value under any changed value ("was 18.0"). Optional values have an unset state | Four stacked 96 px wheels don't fit a phone screen; optional values need "unset" | SCR-LOG |
| NC-10 | **Notice** | Inline message: neutral (ink on `surface`, for errors, info, empty results) or warning (`signal` on `signal-subtle`, shot warnings only, enforced by the API: the warning tone only takes a shot-warning kind) | Nothing exists; keeps signal use auditable | Errors everywhere; shot warnings |
| NC-11 | **Skeleton** | `surface-sunken` blocks with `radius-sm`, a slow opacity pulse that stops under reduced motion; `aria-busy` on the region | Loading states | All data screens |
| NC-12 | **EmptyState** and **Checklist** | Empty state: `text-h2` line, one `text-body` sentence, one action. Checklist: numbered steps with done, next and later states | Empty and first-run states | All lists; first run |
| NC-13 | **Toggle** | On or off switch with a visible label, `role="switch"` | No boolean control exists | Sweetened, recalibration, "only best-before printed" |
| NC-14 | **Icon** (minimal) | Four strokes drawn like the Logo (round caps, `currentColor`): chevron, check, plus, close. Chevron mirrors in right-to-left | No icons exist; text alone doesn't work for a row chevron or a sheet close | ListRow, Sheet, Checklist |
| NC-15 | **Meter** | A 2 px hairline track (`line`) with an `ink` fill, for remaining coffee; `role="meter"` with a text value | New display | Pantry, bag |

**Extensions to existing components** (flagged, not new):

- **NumberWheel**: optional end captions for grinders (`unit.finer` and
  `unit.coarser` under the ruler's ends, placed by the grinder's declared
  `coarser` direction), so "which way is finer" is never a guess. Also a
  `fahrenheit` unit (add to `CanonicalUnit` in `src/lib/units.ts`) for
  machines that display °F (INIT-01 Q5, display only).
- **Input**: used with `type="date"` and `type="url"` and
  `inputMode="decimal"`; add stories for these. No new component.
- **Card**: no change. Used for home recipe, toolkits and bags.

**Not needed**: no tooltips, no tabs component inside screens, no charts, no
avatars, no badges in colour. Markers such as `shots.oneTap` [One tap],
`catalog.addedByYou` [Added by you] and `bag.fromFrozen` [From frozen] are
plain `text-overline` text in `ink-secondary`.

---

## 4. MVP epics (full detail)

### INIT-01: Log a shot against your real kit in seconds

#### EPIC-01-01: Start brewing without setting anything up

**UX flow**

1. First open: SCR-START. `LogoWordmark` centred on `paper`, name from
   `app.wordmark`. The account, household, default persona and starter drinks
   are created behind it. No sign-in, no survey, no welcome carousel.
2. On success (target under 1 second on a normal connection) the app goes
   straight to SCR-HOME in its first-run state (checklist, section 2.3).
3. Later opens skip SCR-START and land on SCR-HOME, or on the tab the user was
   last on if it was within the last few minutes.
4. SCR-PROFILE, from the persona label on SCR-HOME:
   - `profile.name` Input, empty until renamed, with the role label shown as
     its hint (`Input hint`, `ink-secondary`) rather than as a placeholder.
     Saving an empty name returns to the role label. Note: Phase 0 `Input`
     styles placeholders in `ink-tertiary` at 16 px, which breaks the
     large-text-only rule; see DES-01-01-04.
   - `profile.device` section, `text-body`: a calm, factual sentence that the
     history lives with this device's account for now, and linking arrives
     later (accepted risk, S-02). No warning colour, no nag.
   - `profile.about`: app name, version.

**States**

| State | Design |
|---|---|
| Loading | SCR-START logo only. After 3 seconds, `start.slow` [still setting up] appears under it. |
| Error | `start.failed` in `text-h3` and one sentence, `actions.retry` as the primary button. Nothing partial is shown (SQ-01). |
| Profile save failed | Input keeps the typed value; Notice `profile.saveFailed` with retry. |

**Components:** LogoWordmark, Button, Input, PageHeader (NC-02), Notice
(NC-10). App shell: TabBar (NC-01).

**Design acceptance criteria**

- First open shows no sign-in, consent or preference screen.
- SCR-START shows only the wordmark until it is slow or fails; no spinner.
- The role label appears wherever the persona name would, translated.
- The device notice uses ink and `text-body`, never `signal`.
- Tab bar: four text tabs, the active tab marked by its bar, not by colour
  alone (ink against ink-secondary is too subtle on its own), each tab at least 44 px
  tall, labels never truncated in any shipped locale (test with a long
  locale), works in right-to-left.

**Design tasks** (`design`)

- DES-01-01-01 Design SCR-START (normal, slow, failed).
- DES-01-01-02 Design the app shell: TabBar, PageHeader, full-screen task
  frame, safe areas.
- DES-01-01-03 Add Storybook stories for TabBar (NC-01) and PageHeader (NC-02),
  including right-to-left.
- DES-01-01-04 Design SCR-PROFILE, and fix the Phase 0 Input placeholder
  colour (`ink-tertiary` at 16 px) to a token that passes contrast.
- DES-01-01-05 Define the shared state patterns: Skeleton (NC-11), EmptyState
  and Checklist (NC-12), Notice (NC-10); add their stories.

#### EPIC-01-02: Describe your kit once

**UX flow: add a unit (SCR-UNIT-ADD)**

1. From SCR-KIT `kit.add`, or from the first-run checklist.
2. **Kind**: ChipGroup `kit.kind.*` (machine, grinder, basket, accessory).
   From the checklist the kind is preset to machine, then grinder.
3. **Pick the model** in SCR-CATALOG-PICK (hardware): one search field
   (Input, `catalog.search`) that matches makers, models and aliases.
   - With no query: makers as ListRows, alphabetical; tap a maker to see its
     models of the chosen kind.
   - With a query: models directly, `model` as the primary text, maker as the
     secondary line, so one search usually finds the model.
   - The household's own unverified entries appear with `catalog.addedByYou`.
   - A merged entry shows only its surviving entry.
   - Last row always: `catalog.cantFind` [Can't find it? Add it], to
     SCR-CATALOG-ADD (EPIC-01-06).
4. **Details**: `unit.nickname` (Input, optional) and `unit.acquired`
   (Input, date, optional). A capabilities summary in `text-label`, read-only
   (for example "temperature: exact, 85 to 100 °C" composed from keys).
5. Save. Back to SCR-KIT, or return-to.
6. **First toolkit shortcut.** When the household has at least one machine and
   one grinder and no toolkit, SCR-KIT (and the checklist) offers
   `toolkit.suggest` [make these your toolkit], opening SCR-TOOLKIT with both
   preselected and a translated default name (DQ-01, proposed epic change
   PEC-02). This saves a step for nearly everyone.

**UX flow: toolkit (SCR-TOOLKIT)**

1. `toolkit.name` Input (required).
2. **Machine**: radio list of owned, unretired machines. **Grinder**: radio
   list of grinders. **Basket and accessories**: checkbox lists. A unit may be
   in several toolkits.
3. Save. Exactly one machine and one grinder are required (shots and recipes
   record one of each); the save button stays enabled and on save the missing
   part is named in a neutral Notice, so the rule is explained, not hidden.
4. Edit: the same screen. Proposed: editing is allowed, with a one-line note
   `toolkit.editNote` that past shots keep the kit they were pulled with
   (history is safe, S-02).

**UX flow: kit and units (SCR-KIT, SCR-UNIT)**

- SCR-KIT: section `kit.toolkits` (Cards: toolkit name `text-h3`, then
  machine, grinder, basket names in `text-label`), then section `kit.units`
  grouped by kind (ListRows: nickname or model, maker and model as secondary),
  then `kit.retired` collapsed (a ListRow that expands).
- SCR-UNIT: model and maker, nickname, acquired date, capabilities,
  maintenance (EPIC-04-01), and at the very end a secondary `unit.retire`
  with SH-CONFIRM explaining that past shots keep showing it.

**States**

| State | Design |
|---|---|
| Kit empty | EmptyState `kit.empty` with one primary `kit.addMachine`. |
| Units but no toolkit | Toolkits section shows the shortcut card (step 6), or `kit.noToolkit` with `toolkit.create`. |
| Catalog search, no match | Notice (neutral) `catalog.noMatch` with the query echoed, and `catalog.cantFind` as a secondary button. |
| Catalog loading | Skeleton rows. |
| Save failed | Values kept, Notice with retry. |
| Retired unit in a toolkit | Toolkit card shows the retired unit with `unit.retiredMark`, and a line `toolkit.needsUnit` if it was its only machine or grinder (SQ-02). |

**Components:** Button, Input, Card, PageHeader, ListRow (NC-03), ChipGroup
(NC-04), Sheet (NC-05) for SH-CONFIRM, Notice, Skeleton, EmptyState, Icon
(NC-14).

**Design acceptance criteria**

- A first-time user can go from SCR-HOME to a saved toolkit (machine,
  grinder, toolkit) in at most 12 taps, without typing more than search terms.
- Search finds a model by alias in one query; results show maker and model
  together.
- Unverified entries are marked by text only (`catalog.addedByYou`), not by
  colour.
- Toolkit rules are explained before or at save, never by silently disabling
  the button.
- Retired units are never offered when building a toolkit, and still show on
  past shots.

**Design tasks** (`design`)

- DES-01-02-01 Wireframe the add-kit flow, including the first-toolkit
  shortcut.
- DES-01-02-02 Design SCR-CATALOG-PICK for hardware and coffee (shared), with
  search, two-level browse and no-match states.
- DES-01-02-03 Design SCR-KIT and SCR-UNIT.
- DES-01-02-04 Design SCR-TOOLKIT (create and edit).
- DES-01-02-05 Add Storybook stories for ListRow (NC-03), ChipGroup (NC-04),
  Icon (NC-14) and Sheet (NC-05).

#### EPIC-01-03: Log a shot in seconds

**UX flow: SCR-LOG, new shot**

The shot log is one full-screen task, laid out so a shot is saved in seconds:

1. **Header** (NC-02): ghost `actions.cancel` at the start, title `log.title`
   (mode-specific, see below).
2. **Context**, three SelectFields (NC-06, field look) in one compact block:
   `log.toolkit`, `log.drink`, `log.coffee`. They arrive pre-chosen: toolkit =
   last used, drink = the home screen's drink, coffee = the home screen's
   coffee portion. Most shots never touch them. The coffee options are
   unfinished portions, named by bean, with bag and state (`portion.counter`,
   `portion.thawed`) as the secondary line; unopened portions are offered
   (DQ-06).
3. **ShotDial (NC-09).** A row of compact value tabs, each showing its overline
   label and current value in `text-h3`: grind, dose, yield, time. Tapping a
   tab shows its full NumberWheel below (96 px value, ruler, typed entry).
   The first tab is selected on open. The ruler scrolls with drag, flick,
   keyboard and typed entry, exactly as Phase 0 built it.
   - **Grind** follows the grinder's declared scale: stepped grinders use the
     grinder's step; stepless use its finest increment. End captions show
     finer and coarser per the grinder's `coarser` direction.
   - **Dose** grams, step 0.1. **Yield** grams, step 0.1. **Time** seconds,
     step 0.1 (stored in ms). Ratio (`shot.ratio`) shown under the tabs and
     updated live.
   - Starting values for a blank log: the last measured shot on this toolkit,
     or neutral defaults (DQ-07).
4. **Sweetened**: Toggle (NC-13) `log.sweetened`.
5. **Save**: primary `log.save`, full width, pinned to the bottom of the
   screen above the safe area so it's reachable with a thumb.
6. Saved: go to SCR-TASTE (EPIC-01-05). Shot is already saved; tasting is
   optional.

**Missing context** (no toolkit, no coffee): the matching SelectField shows
`log.missingToolkit` or `log.missingCoffee` and opens the add flow
(SCR-TOOLKIT, SCR-BAG-ADD) with return-to. The dial still works, so values
aren't lost while adding.

**Modes of SCR-LOG** (same screen, different title and starting values):

| Mode | Title key | Starting values | Save does | Epic |
|---|---|---|---|---|
| New | `log.titleNew` | Last shot or defaults | Saves a measured shot | 01-03 |
| Dial in from recipe | `log.titleDialIn` | The pinned recipe | Saves a measured shot | 02-03 |
| Fix an off shot | `log.titleFix` | The pinned recipe, same portion | Saves a new measured shot | 02-03 |
| Edit | `log.titleEdit` | The saved shot | Saves changes to that shot | 02-06 |
| Enter a recipe | `log.titleRecipe` | Current recipe or defaults | Opens SH-PIN, no shot | 02-01 |

**States**

| State | Design |
|---|---|
| Loading | Context skeleton; ShotDial shows with defaults disabled until context loads (well under a second). |
| Missing value | Not possible from the dial (wheels always hold a value). Typed entry clamps to range, as built. |
| Save failed | Stays on SCR-LOG with values; Notice `log.saveFailed` with `actions.retry`. |
| Leave with changes | SH-CONFIRM `log.discard`. |

**Components:** NumberWheel, Button, PageHeader, SelectField (NC-06), Sheet
(SH-SELECT), ShotDial (NC-09), Toggle (NC-13), Notice.

**Design acceptance criteria**

- With context pre-chosen, logging a shot that differs from the starting
  values in one value takes: open, one drag, save (three interactions).
- All four values are visible at once (compact tabs) and one is editable at a
  time, without scrolling, on a 375 x 667 viewport.
- No text keyboard opens unless the user taps a big number to type it.
- Time shows seconds with one decimal; all decimals use the locale's mark.
- Grind captions point the correct way for both `coarser: higher` and
  `coarser: lower`, and in right-to-left.
- Save is always visible and is the only primary button.

**Design tasks** (`design`)

- DES-01-03-01 Wireframe the shot log flow (new shot) on a 375 x 667 and a
  430 x 932 viewport.
- DES-01-03-02 Design ShotDial (NC-09): compact tabs, selected state, "was"
  value, unset state; add its Storybook story.
- DES-01-03-03 Add NumberWheel end captions (finer and coarser) and a
  Fahrenheit story.
- DES-01-03-04 Add Storybook stories for SelectField (NC-06) and Toggle
  (NC-13).
- DES-01-03-05 Design the missing-context and return-to paths.

#### EPIC-01-04: Record temperature and pressure when your machine has them

**UX flow**

ShotDial gains extra tabs only when the toolkit's machine declares them:

| Capability | Tab | Panel below the tabs |
|---|---|---|
| Temperature none | No tab | |
| Temperature steps (count n) | `shot.temperature` | ChipGroup 1 to n, numbered scale |
| Temperature exact (°C or °F) | `shot.temperature` | NumberWheel in the machine's unit, range and step |
| Pressure none, or manual without gauge | No tab | |
| Pressure manual with gauge | `log.peakPressure` | NumberWheel bar, label says peak |
| Pressure steps | `shot.pressure` | ChipGroup 1 to n |
| Pressure exact | `shot.pressure` | NumberWheel bar |

- These values are optional. Their tab starts **unset**, showing an em dash.
  The panel shows a secondary button `log.addTemperature` or
  `log.addPressure`; tapping it reveals the wheel or chips at the last used
  value. A ghost `log.clear` returns the value to unset.
- Pre-filled modes (recipe, edit) start set if the source has the value.
- °F is display only: the wheel shows °F with the machine's step, and the
  stored value is °C (INIT-01 Q5).

**States:** as SCR-LOG. If a machine's capabilities are missing (user-added
model without them), no extra tabs show.

**Components:** ShotDial (NC-09), NumberWheel (with `fahrenheit`), ChipGroup
(NC-04), Button.

**Design acceptance criteria**

- A machine with no control shows exactly the four core tabs.
- Steps never show degrees or bar; exact values never show steps.
- An unset optional value is visibly different from a set one, and saving
  with it unset is allowed and obvious.
- Temperature and pressure tabs follow the core four, in that order, and the
  tab row fits six tabs on 375 px wide (scrolls horizontally only beyond that).

**Design tasks** (`design`)

- DES-01-04-01 Design the optional value states in ShotDial (unset, add,
  clear) for every capability in the table.
- DES-01-04-02 Add ShotDial stories for each machine capability combination.

#### EPIC-01-05: Say how it tasted

**UX flow: SCR-TASTE (after saving a measured shot)**

1. Header `taste.title` [shot saved] in `text-h2`, with the compact
   ShotValues (NC-08) of the saved shot underneath, so the user sees what
   they're rating.
2. **Overall**: ChipGroup numbered scale 1 to 5, `taste.rating`.
3. **Sweetness, acidity, bitterness, body**: four numbered-scale ChipGroups,
   each with its label at the start, low and high end words in `text-label`
   (`taste.low`, `taste.high`).
4. **Defects**: multi-choice ChipGroup with the defect list (`defects.*`,
   list not yet defined, DQ-08).
5. **Shot warning**: if channelling is tagged, Notice (warning tone)
   `shot.warnings.channelling`. "Ran fast" waits for a threshold (DQ-09).
6. Actions: primary `taste.done`, and secondary `recipe.pin` [pin as recipe]
   (EPIC-02-01). In fix and dial-in modes, pin is the primary action and done
   is secondary, because pinning is why the user came.
7. Everything is optional. Done with nothing chosen saves nothing more.
   Scores are saved on Done, not on each tap.

The same controls appear in SCR-SHOT for rating later, through edit.

**States**

| State | Design |
|---|---|
| Save failed | Choices kept; Notice with retry. The shot itself was already saved. |
| Leave by tab or back | Treated as Done without changes; no confirm (the shot is safe). |

**Components:** ChipGroup (NC-04, numbered scale and multi), ShotValues
(NC-08), Notice (warning tone, NC-10), Button.

**Design acceptance criteria**

- Tasting never blocks saving a shot, and never appears before Save.
- Each scale is operable by touch and keyboard (arrow keys move, space or
  enter selects) and announced as a radio group with its label.
- Choosing a score can be undone by tapping it again (back to unscored).
- Signal colour appears only for the channelling warning.
- The screen fits without scrolling on 430 x 932; on 375 x 667, defects may
  scroll but Done stays visible.

**Design tasks** (`design`)

- DES-01-05-01 Wireframe SCR-TASTE in normal, fix and dial-in modes.
- DES-01-05-02 Design the numbered-scale ChipGroup variant and its stories.
- DES-01-05-03 Design Notice (NC-10) warning tone and the rule that limits it
  to shot warnings; add stories.
- DES-01-05-04 Propose a starter defect list for the Head of Product (DQ-08).

#### EPIC-01-06: Add what's missing from the catalog

**UX flow: SCR-CATALOG-ADD**

Opened from `catalog.cantFind` in SCR-CATALOG-PICK, with the search text
carried over as the name.

1. **Product link first.** `catalog.url` Input (`type="url"`, required) at the
   top, with hint `catalog.urlHint`. Putting the link first lets Tare check it
   before the user types anything else.
2. **Duplicate check** on leaving the field (normalised URL, exact match,
   against verified entries and this household's own entries only). On a
   match: Notice (neutral) `catalog.duplicateFound` naming the existing entry,
   with primary `catalog.useExisting`. A ghost `catalog.addAnyway` is shown
   only if the Head of Product allows it (DQ-10). Using the existing entry
   returns to the picker flow with it selected.
3. **Names.** For hardware: maker (SelectField from the catalog, or
   `catalog.newMaker` to type one, which also needs a link), model name, kind
   (preset from the add-kit flow). For coffee: roaster (same pattern), bean
   name, and optional roast level (ChipGroup of the fixed list, S-09) and
   tasting notes (Input).
4. **Capabilities (machines and grinders only).** Plain-language questions,
   each with a "not sure" option that keeps the shot log simple (DQ-11):
   - Machine temperature: ChipGroup `catalog.cap.none`, `catalog.cap.steps`
     (then a count), `catalog.cap.exact` (then unit, min, max, step);
     pressure: none, manual with gauge (Toggle), steps, exact.
   - Grinder: stepped or stepless, lowest and highest number on the dial,
     step, and "which way is coarser" (ChipGroup with
     `catalog.cap.coarserHigher` and `catalog.cap.coarserLower`).
5. **More links and other names**, under a disclosure `catalog.more`: repeatable
   rows of URL plus market (SelectField), and name plus market. Each extra
   link is checked like the first.
6. Save: primary `catalog.save`. The new entry is marked `catalog.addedByYou`
   and selected in the flow that opened this screen, ready to use.

**States**

| State | Design |
|---|---|
| Checking link | A short `catalog.checking` line under the field; the rest of the form stays usable. |
| Missing link | On save, the URL field shows its error in ink (`Input error`). |
| Check failed (network) | Neutral Notice; save still allowed, the check reruns on save. |
| Save failed | Form kept; Notice with retry. |

**Components:** Input (url, text), SelectField, ChipGroup, Toggle, Notice,
Button, PageHeader, ListRow.

**Design acceptance criteria**

- The link is the first field, and a duplicate is offered before the user
  fills anything else.
- Private and unverified entries look the same as any other row except for
  the `catalog.addedByYou` text marker.
- Capability questions use the user's words (dial numbers, "which way is
  coarser"), not schema terms, and every one has a "not sure" answer.
- After saving, the user lands back in the flow they came from with the new
  entry selected, in one step.

**Design tasks** (`design`)

- DES-01-06-01 Wireframe SCR-CATALOG-ADD for hardware and for coffee.
- DES-01-06-02 Design the duplicate-found state and its two outcomes.
- DES-01-06-03 Design the capability questions, with copy direction for
  the story writer.
- DES-01-06-04 Design the repeatable links and other names rows.

### INIT-02: Every new bag starts from what you already learned

#### EPIC-02-01: Pin the recipe that worked

**UX flow: pin from a shot**

1. From SCR-TASTE (`recipe.pin`) or SCR-SHOT (`recipe.pin`, measured shots
   only; one-tap shots don't show it).
2. SH-PIN opens: `recipe.pinTitle` naming drink, coffee and toolkit; the new
   values (ShotValues compact); and, if a recipe exists, the current one
   above it in `ink-secondary` with `recipe.replaces`. Primary
   `recipe.confirmPin`.
3. Confirmed: sheet closes; a short confirmation in place (`recipe.pinned`,
   live region). The home screen now shows this recipe.

**UX flow: pin by entering values**

1. From SCR-BAG, section `bag.recipes`: `recipe.add`.
2. SCR-LOG in recipe mode: context is drink and toolkit (the coffee is this
   bag's bean), then ShotDial, then primary `recipe.pinThis` which opens
   SH-PIN. No shot is saved.

**UX flow: see recipes**

- SCR-BAG, section `bag.recipes` [recipes for this coffee]: one ListRow per
  drink and toolkit with compact ShotValues and the date pinned. Tap: actions
  `recipe.dialIn` (SCR-LOG pre-filled) and `recipe.edit` (recipe mode).
- SCR-HOME shows the current recipe for its drink and coffee.
- No recipe history screen in the MVP (older pins are kept as data only).

**States**

| State | Design |
|---|---|
| No recipes for this coffee | `bag.noRecipes` one line, with `recipe.add` secondary. |
| Pin failed | SH-PIN stays open; Notice with retry. |

**Components:** Sheet (SH-PIN), ShotValues, ListRow, ShotDial, Button.

**Design acceptance criteria**

- Before confirming, the user sees exactly what the pin applies to (drink,
  coffee, toolkit) and what it replaces.
- Pin is never offered on a one-tap shot.
- Recipe mode looks like the shot log but its title and button say it pins a
  recipe, so no one thinks they logged a shot.

**Design tasks** (`design`)

- DES-02-01-01 Design SH-PIN, with and without an existing recipe.
- DES-02-01-02 Design the recipe section of SCR-BAG.
- DES-02-01-03 Design recipe mode of SCR-LOG.
- DES-02-01-04 Add Storybook story for ShotValues (NC-08), large and compact,
  with and without temperature and pressure.

#### EPIC-02-02: Pull your daily shot in one tap

**UX flow**

1. SCR-HOME shows the recipe for the persona, the drink (time-of-day default,
   changeable) and the coffee (default per DQ-03, changeable). See section
   2.3 for layout.
2. Tap `home.pull`. The shot is recorded at once (optimistic, then confirmed),
   with the recipe's values, its toolkit, and the earliest-opened open
   portion of the coffee. No rating is asked.
3. PulledState (NC-07) appears in place: confirmation, undo for the window,
   good and off (EPIC-02-03).
4. **No open portion of the coffee:** SH-PORTION opens before recording:
   `portion.chooseTitle`, ListRows of unfinished portions of this coffee
   (bag, state, age, remaining). Choosing one records the shot against it and
   marks it opened today (DQ-06). Cancel records nothing.
5. **No portion of the coffee at all:** SH-PORTION shows `portion.noneLeft`
   with secondary `home.addBag`; nothing is recorded.
6. **Undo:** removes the shot entirely, and the portion's opened date if this
   shot set it. Announced (`home.undone`).
7. **Edit later** through SCR-SHOTS (EPIC-02-06).
8. **No recipe:** primary becomes `home.dialIn` (section 2.3).

**States:** see section 2.3. Pull is protected against double taps: the
button turns into PulledState immediately, so a second tap can't pull twice.

**Components:** Card, Button, SelectField (quiet), ShotValues (large),
PulledState (NC-07), ChipGroup, Sheet (SH-SELECT, SH-PORTION), Skeleton,
Checklist, Notice.

**Design acceptance criteria**

- The daily shot is exactly one tap from opening the app, with no choices,
  when a recipe and an open portion exist.
- The result is visible in place within 100 ms of the tap (optimistic), and
  announced to screen readers.
- Undo is offered for the whole window and disappears quietly, with no
  countdown.
- Changing drink or coffee on the home screen updates the recipe shown
  without leaving the screen.
- Only one primary button is on screen in every state.

**Design tasks** (`design`)

- DES-02-02-01 Design SCR-HOME in all states (section 2.3 table).
- DES-02-02-02 Design PulledState (NC-07) and its timing; add its story.
- DES-02-02-03 Design SH-PORTION (choose, none left).
- DES-02-02-04 Design the first-run Checklist on SCR-HOME.

#### EPIC-02-03: Fix a bad shot from your recipe

**UX flow**

1. **Off after a one-tap shot:** tap `home.reactionOff` in PulledState. The
   reaction is saved on the one-tap shot. SCR-LOG opens in fix mode: title
   `log.titleFix`, starting values from the current recipe, the same portion,
   drink and toolkit, and a one-line note `log.fromRecipe` [starting from
   your recipe].
2. The user nudges one or two wheels. Each changed tab shows the recipe value
   under it (`log.was`), so the adjustment is clear.
3. Save: a new measured shot (DQ-12, two records). SCR-TASTE opens with pin as
   the primary action.
4. **Dial in from the home screen:** `home.dialIn` with a recipe opens SCR-LOG
   in dial-in mode; same as above without a reaction or a one-tap shot.
5. **Good:** saved on the one-tap shot; chip shows selected; nothing else
   happens.
6. Leaving fix mode without saving keeps the "off" reaction and saves nothing
   else.

**States:** as SCR-LOG. Reaction save failure: the chip returns to unselected
with a Notice in PulledState; the fix flow still opens.

**Components:** PulledState, ChipGroup, ShotDial ("was" values), SCR-LOG,
SCR-TASTE.

**Design acceptance criteria**

- From "off" to a saved, adjusted shot is: off, one drag, save.
- Every changed value shows what it was changed from; unchanged values show
  nothing extra.
- Good and off are optional, equal in weight (two secondary chips, neither
  primary), and never reappear as a prompt.

**Design tasks** (`design`)

- DES-02-03-01 Wireframe the off-to-fix flow from PulledState to SCR-TASTE.
- DES-02-03-02 Design the "was" value treatment in ShotDial.

#### EPIC-02-06: See your recent shots

**UX flow: SCR-SHOTS**

1. Tab `nav.shots`. Title `shots.title`.
2. ListRows grouped by day (`shots.today`, `shots.yesterday`, then a formatted
   date as a `text-overline` group heading). Each row:
   - primary: drink and time of day (formatted);
   - secondary: coffee name;
   - end: compact ShotValues (dose to yield, time; grind on a second line);
   - markers in `text-overline` `ink-secondary`: `shots.oneTap` for one-tap
     shots, the reaction (`shots.good`, `shots.off`), `bag.fromFrozen`;
   - shot warnings as warning-tone text (`signal`) only for channelling.
   - Grind period dividers (EPIC-04-01): a hairline with `shots.maintenance`
     [grinder maintenance, date] between shots on either side of a grinder
     event.
3. The list shows the last 30 days, then `shots.showOlder` (DQ-13).
4. Tap a row: SCR-SHOT.

**UX flow: SCR-SHOT (shot detail)**

- ShotValues large, context (drink, coffee, toolkit, grinder and machine as
  they were), date and time, whose taste and who logged (shown once sub
  personas exist), sweetened, taste scores and defects if any.
- Actions: `actions.edit` (secondary) opens SCR-LOG in edit mode; for
  measured shots, `recipe.pin` (primary). For one-tap shots, edit is the only
  action and is primary; a line `shot.copiedFromRecipe` explains where the
  values came from, and the reaction chips are shown so a reaction can be
  given or changed later (DQ-05).

**UX flow: edit**

- SCR-LOG edit mode with the saved values, then the taste controls below the
  dial (in edit mode taste is on the same screen, since the user came to fix
  something specific). Only values, sweetened and taste change; context is
  read-only (SQ-08). Save `log.saveChanges`. Leave with changes: SH-CONFIRM.

**States**

| State | Design |
|---|---|
| Loading | Skeleton rows (five). |
| Empty | EmptyState `shots.empty` with primary `home.dialIn` (opens SCR-LOG). |
| Load failed | Notice with retry in place of the list. |
| Older loading | Skeleton rows under the list; button disabled. |

**Components:** ListRow, ShotValues (compact and large), PageHeader,
EmptyState, Skeleton, Notice, Button, ChipGroup.

**Design acceptance criteria**

- One-tap and measured shots are distinguishable by a text marker, without
  colour.
- A row is readable in one glance: drink, coffee, values, markers, in that
  order.
- Values in rows align across rows (tabular numbers, end-aligned in
  left-to-right, start-aligned mirror in right-to-left).
- Editing a one-tap shot is at most two taps from the Shots tab.

**Design tasks** (`design`)

- DES-02-06-01 Design SCR-SHOTS, including grouping, markers and dividers.
- DES-02-06-02 Design SCR-SHOT for measured and one-tap shots.
- DES-02-06-03 Design SCR-LOG edit mode with taste on the same screen.

### INIT-03: Always know what beans you have and how old they are

#### EPIC-03-01: Add a bag to your pantry

**UX flow: SCR-BAG-ADD**

1. From SCR-PANTRY `pantry.addBag`, the checklist, or the shot log's coffee
   field.
2. **Pick the coffee**: SCR-CATALOG-PICK (coffee): search matches roasters,
   beans and aliases; results show bean as primary and roaster as secondary.
   Recently bought coffees first when the query is empty.
3. **Bag details** (one screen):
   - `bag.weight`: ChipGroup of common sizes (`bag.size.*`, formatted grams:
     250, 340, 500, 1000) plus `bag.otherWeight`, which reveals an Input with
     a grams unit and decimal keyboard. Required.
   - `bag.roastDate`: Input type date. A Toggle `bag.onlyBestBefore` swaps it
     for `bag.bestBefore`. Both optional; a hint says age needs one of them.
   - Disclosure `bag.more`: `bag.lot` (Input), `bag.purchased` (date, default
     today).
4. Save `bag.save`. Lands on SCR-BAG for the new bag (or return-to), which
   shows one portion holding the whole bag.

**UX flow: SCR-PANTRY**

- Title `pantry.title`, primary action `pantry.addBag` in the header end.
- One Card per bag that isn't finished: bean (`text-h3`), roaster
  (`text-label`), and its portions as ListRows inside: state
  (`portion.unopened`, `portion.counter`, `portion.frozen`, `portion.thawed`),
  age (EPIC-03-03), remaining (EPIC-03-04, NC-15 Meter).
- Order: bags with an open portion first (earliest opened first, matching
  the one-tap rule), then unopened, then bags only in the freezer.
- `pantry.finished` collapsed section at the end.

**States**

| State | Design |
|---|---|
| Loading | Skeleton cards (two). |
| Empty | EmptyState `pantry.empty`, primary `pantry.addBag`. |
| Coffee search, no match | Notice `catalog.noMatch`, secondary `catalog.cantFind`. |
| Missing weight on save | Error on the weight group in ink. |
| Save failed | Form kept, Notice with retry. |

**Components:** Card, ListRow, ChipGroup, Input (date, decimal), Toggle,
SelectField, PageHeader, EmptyState, Skeleton, Notice, Button, Meter.

**Design acceptance criteria**

- A bag of a coffee that's in the catalog is added in under 20 seconds:
  search, pick, tap a size, set roast date, save.
- Neither date blocks saving.
- The pantry list order matches the order the one-tap rule uses.
- Dates use the locale's format and the native date picker.

**Design tasks** (`design`)

- DES-03-01-01 Wireframe the add-a-bag flow.
- DES-03-01-02 Design SCR-PANTRY (bags with portions, order, finished).
- DES-03-01-03 Design SCR-BAG (facts, portions, recipes).

#### EPIC-03-02: Split and freeze a bag

**UX flow**

1. On SCR-BAG (or SCR-PANTRY), tap a portion row: SH-PORTION-ACTIONS lists
   only the actions that apply to its state:
   - unopened: `portion.open`, `portion.freeze`, `portion.split`;
   - open (counter): `portion.weigh`, `portion.split`, `portion.freeze`,
     `portion.finish`;
   - frozen: `portion.thaw`, `portion.split`;
   - thawed: `portion.open`, `portion.weigh`, `portion.finish`.
   (Freeze is not offered after a thaw: one freeze and one thaw per portion,
   as the schema implies.)
2. Dated actions (open, freeze, thaw, finish) go through SH-DATE: the date,
   default today, and a primary confirm. One tap for "today".
3. **Split** (SH-SPLIT): "take out" weight as a NumberWheel in grams (step 1,
   up to the portion's remaining), with the remainder shown live as text
   (`portion.splitRemainder`), and a Toggle `portion.freezeNew` [freeze the
   new portion] on by default, because that's the usual reason to split.
   Confirm creates one new portion. To split into several, split again; this
   keeps one simple control (proposed, see DQ-14).
4. The bag's facts (roast date, lot) are shown once at the top of SCR-BAG,
   never per portion.

**States**

| State | Design |
|---|---|
| Thaw date before freeze date | Error in ink on the date (SQ-09). |
| Split more than remaining | Not possible (wheel range). |
| Action failed | Sheet stays open; Notice with retry. |

**Components:** Sheet, ListRow, NumberWheel, Toggle, Input (date), Button,
Notice.

**Design acceptance criteria**

- Splitting a bag in half and freezing one half is: tap portion, split, drag
  (or type) the weight, confirm. Four interactions.
- Only valid actions for the portion's state are offered.
- Every dated action defaults to today and can be backdated.
- Portion state is shown as text on every portion row.

**Design tasks** (`design`)

- DES-03-02-01 Design SH-PORTION-ACTIONS for each portion state.
- DES-03-02-02 Design SH-SPLIT with the live remainder.
- DES-03-02-03 Design SH-DATE.

#### EPIC-03-03: Know how fresh your beans really are

**UX flow**

- Every portion row and the home coffee line show age as a short phrase,
  `portion.age` [day 12] (days since roast, minus freezer time).
- From best-before only: `portion.ageEstimated` [about day 12], and the
  assumption is explained on SCR-BAG (INIT-03 Q2).
- No dates: `portion.ageUnknown`, with `bag.addRoastDate` on SCR-BAG.
- While frozen: `portion.agePaused` [paused at day 12].
- SCR-BAG portion detail line: frozen days not counted (`portion.frozenDays`).
- Shots ground from frozen beans show `bag.fromFrozen` on SCR-SHOTS rows and
  on SCR-SHOT. In SCR-LOG, choosing a frozen portion shows the same marker on
  the coffee field.

**States:** age is calculated, never loading on its own; it appears with the
row.

**Components:** ListRow, SelectField, text markers. No new component.

**Design acceptance criteria**

- Age never uses colour to signal freshness (no green to red).
- Estimated and paused ages are worded differently from exact ages.
- The frozen marker is text, the same on rows and detail.

**Design tasks** (`design`)

- DES-03-03-01 Define the age phrases and where each appears; hand copy
  direction to the story writer.

#### EPIC-03-04: See how much coffee is left

**UX flow**

- Portion rows: remaining weight (`portion.remaining`, formatted grams) and a
  Meter (NC-15) against the portion's weight. Bag cards: total remaining.
- SCR-HOME footnote: remaining in the portion in use.
- **Weigh what's left** (SH-STOCK): NumberWheel in grams (typed entry
  encouraged, since the user reads a scale), primary `portion.saveWeight`.
- **Logged doses exceed the portion**: remaining shows zero grams, and a
  neutral Notice on the portion `portion.overLogged` with `portion.weigh`
  (INIT-03 Q3). Not signal: it's not a shot warning.
- Bag status: open and finished shown as text on cards; finished bags move to
  `pantry.finished`.

**States:** as pantry. Stock check failure: sheet stays, Notice with retry.

**Components:** Meter (NC-15), Sheet, NumberWheel, Notice, ListRow.

**Design acceptance criteria**

- Remaining weight is a number first; the meter only supports it and has a
  text equivalent for assistive tech.
- One-tap shots are counted (no difference in display).
- A negative remainder never shows as a negative number.

**Design tasks** (`design`)

- DES-03-04-01 Design remaining weight on rows, cards and home.
- DES-03-04-02 Design SH-STOCK and the over-logged notice.
- DES-03-04-03 Add Storybook story for Meter (NC-15).

### INIT-04: Grind settings stay meaningful through maintenance and time

#### EPIC-04-01: Record maintenance on your kit

**UX flow**

1. SCR-UNIT, section `maintenance.title`: events newest first (ListRows:
   kind, date, note excerpt, `maintenance.recalibration` marker).
2. `maintenance.add` opens SH-MAINTENANCE: kind ChipGroup (`maintenance.kind.*`:
   burrs, clean, re-zero, repair, other), date (default today), note
   (Input, optional), and for grinders a Toggle `maintenance.isRecalibration`
   (on by default for burrs and re-zero, DQ-15). Primary `maintenance.save`.
3. For grinders, events split history into grind periods: SCR-UNIT shows the
   current period's start (`maintenance.periodSince`), and SCR-SHOTS shows
   dividers between periods (EPIC-02-06).
4. No offset or re-dial prompt in the MVP (EPIC-04-03 is Next).

**States**

| State | Design |
|---|---|
| No events | One line `maintenance.none` with `maintenance.add` secondary. |
| Save failed | Sheet stays, Notice with retry. |

**Components:** ListRow, Sheet, ChipGroup, Input, Toggle, Button, Notice.

**Design acceptance criteria**

- Logging a re-zero today is three taps: add, re-zero, save.
- The recalibration mark is text, not a colour or icon alone.
- Period dividers in SCR-SHOTS appear only for the shot's own grinder.

**Design tasks** (`design`)

- DES-04-01-01 Design SH-MAINTENANCE and the maintenance section of SCR-UNIT.
- DES-04-01-02 Design grind period dividers in SCR-SHOTS.

---

## 5. Next epics (lighter flows)

### EPIC-05-03: Keep your coffee history when you change phones

- **Flow:** SCR-PROFILE's device section gains `profile.linkGoogle`
  (secondary button, Google's own sign-in button guidelines followed only as
  far as they fit the monochrome system; DQ-16). Success: the section reads
  `profile.linked`. Another device: SCR-START offers `start.signIn` as a
  quiet ghost button under the wordmark, never a wall.
- **Prompt:** one calm, dismissible Card on SCR-HOME after the first pinned
  recipe or the tenth shot, whichever comes first (`home.linkPrompt`), then
  never again unless the user opens Profile.
- **States:** linking failed (Notice), account already linked elsewhere
  (Notice explaining, no merge; epic open question).
- **Components:** Button, Card, Notice.
- **Design tasks:** DES-05-03-01 Design the link section and the one-time
  prompt.
- **Note:** the "device only" sentence in SCR-PROFILE (EPIC-01-01) is
  replaced by the linked state here.

### EPIC-02-05: Make the drink list yours

- **Flow:** SCR-PROFILE gains `profile.drinks`, opening a drinks screen:
  ListRows with a visibility Toggle per drink, move up and move down buttons
  (accessible reordering, no drag-only), tap to rename (Input sheet), and
  `drinks.add`. At least one drink stays visible (the last Toggle is
  disabled with a reason).
- **Components:** ListRow, Toggle, Sheet, Input, Button.
- **Design tasks:** DES-02-05-01 Design the drinks screen and rename sheet.

### EPIC-02-04: Give one bag its own recipe

- **Flow:** SH-PIN gains a ChipGroup `recipe.scope.bean` [every bag of this
  coffee] and `recipe.scope.batch` [this bag only], default per INIT-02 Q1.
  The home screen and SCR-BAG mark a bag recipe with `recipe.thisBagOnly`.
- **Design tasks:** DES-02-04-01 Add the scope choice to SH-PIN.

### EPIC-03-05: Know when you'll run out

- **Flow:** SCR-PANTRY header gains one line: `pantry.runOut` [about N days
  of coffee, M in the freezer], with an explanation sheet of the inputs and
  how much of real use is logged. Shown only once enough finished portions
  exist; before that, `pantry.learning`.
- **Design tasks:** DES-03-05-01 Design the run-out line and its explanation.

### EPIC-05-01: Brew for someone else in the household

- **Flow:** the persona label on SCR-HOME becomes a quiet SelectField when the
  household has more than one persona; choosing one changes the drink,
  coffee and recipe shown. SCR-PROFILE gains `profile.people` (add, rename).
  SCR-SHOTS rows and SCR-SHOT show whose taste a shot records.
- **Design tasks:** DES-05-01-01 Design persona switching on SCR-HOME.
  DES-05-01-02 Design the people screen.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

- **Flow:** on SCR-HOME the grind value shows the adjusted grind, with the
  pinned value and a short reason underneath (`home.grindAdjusted`, for
  example "recipe 15, beans have aged"). SCR-LOG pre-fills the adjusted value
  with the recipe value shown as "was". The stored recipe is untouched.
  INIT-04 Q4 decides note, value or both; this design shows both.
- **Design tasks:** DES-04-02-01 Design the adjusted-grind treatment on home
  and log.

### EPIC-04-03: Re-dial once after maintenance and keep every recipe

- **Flow:** after a grinder event, SCR-HOME shows a calm Card `home.redial`
  [your grinder was serviced: re-dial one coffee]. It opens SCR-LOG in
  dial-in mode. After saving and pinning, a sheet proposes the shift in
  grinder units (NumberWheel, editable) with a one-line explanation; confirm
  stores it. SCR-UNIT shows the confirmed shift on the event, editable.
- **Design tasks:** DES-04-03-01 Design the re-dial prompt and the offset
  confirmation sheet.

### EPIC-04-04: Keep recipes right after new burrs of a different design

- **Flow:** the same confirmation sheet, after a second re-dial on the same
  event, also shows the stretch factor, editable. Copy explains it in plain
  terms (each step now means more or less than before).
- **Design tasks:** DES-04-04-01 Extend the offset sheet with stretch.

---

## 6. Later epics (brief direction only)

These will be re-planned before they are built, so only a direction is given
here; flows, states and tasks come with the re-plan. All AI output follows
the same rules: shown as a suggestion the user can accept or ignore, never as
a fact, in ink, with signal reserved for shot warnings.

- **EPIC-05-02 Invite them to take over their own profile:** invite from the
  people screen; the joiner sees the profile's history before claiming it.
  Keep the claim moment explicit and reversible until confirmed.
- **EPIC-06-01 Scan a bag instead of typing it:** a "scan" entry at the top of
  SCR-BAG-ADD; results fill the same form for review, with empty fields left
  empty (no guessed values shown as filled).
- **EPIC-06-02 Get a grounded fix when a shot goes wrong:** the coach's
  advice appears on SCR-TASTE and in fix mode as one sentence of diagnosis and
  one action, with the suggested values applied as "was" changes in ShotDial
  that the user can accept. Sources available on request.
- **EPIC-06-04 Tare learns your palate as you log:** no survey; a quiet "your
  taste" summary in Profile, in words, not charts.
- **EPIC-06-05 Share your shots, with your consent:** a plain-language consent
  screen in Profile, off by default, with what is and isn't shared.
- **EPIC-06-06 Start a new bag from the community, tuned to you:** a starting
  recipe offered on a new bag with where it came from; a Match Score Warning
  uses neutral Notice, not signal, since it isn't a shot warning.
- **EPIC-06-07 Merge duplicate catalog entries:** mostly admin tooling; the
  user only sees merged entries resolve to the surviving one.

---

## 7. Proposed epic changes

For the epic-planner, who owns epics. Not designed around silently.

- **PEC-01 EPIC-01-01: add the app shell.** No epic owns navigation (TabBar),
  page headers, the shared state patterns (loading, empty, error) or
  SCR-PROFILE's frame, yet every MVP epic needs them. Proposal: add them to
  EPIC-01-01's scope, since it's first in the build order. This likely moves
  it from S to M.
- **PEC-02 EPIC-01-02: first-toolkit shortcut and toolkit editing.** To keep
  time to first shot short, offer "make these your toolkit" once a machine
  and grinder exist, with a translated default name stored at creation
  (DQ-01). Also resolve the open question by allowing toolkit edits (history
  is safe, S-02). Size stays M.
- **PEC-03 EPIC-02-02: change drink and coffee on the home screen.** The
  epic's home screen picks a drink and coffee but gives no way to change them.
  Without it, a user who wants a different drink at the usual time can't use
  one tap and must do a full log. Proposal: add "change drink and coffee on
  the home screen for this pull" to scope. Small; size stays M. Answers part
  of SQ-06.
- **PEC-04 EPIC-01-05: own the shot warnings.** No epic has shot warnings in
  scope (only as a risk in EPIC-01-05), yet they are the only use of the
  signal colour. Proposal: add to EPIC-01-05 "show the channelling warning
  when channelling is tagged"; leave "ran fast" out until a threshold is
  defined (DQ-09).
- **PEC-05 EPIC-01-06: include capability entry.** The shot log depends on a
  model's capabilities, so a user-added machine or grinder needs them.
  Proposal: put the plain-language capability questions (section 4,
  EPIC-01-06 step 4) in scope, with "not sure" defaults. This is the riskiest
  part of the epic; it may push it from M to L. Alternative: user-added
  models get no temperature or pressure fields and a generic grind scale, and
  capabilities are filled in by the admin on verification.
- **PEC-06 EPIC-04-01: own where grind periods are visible.** Proposal: the
  period dividers in SCR-SHOTS and the period start on SCR-UNIT belong to
  EPIC-04-01, answering its open question. No size change.

---

## 7a. UX concerns

- **Time to the first shot.** Before the first shot, a new user has to add a
  machine, a grinder, a toolkit and a bag, with two catalog searches. That's
  the opposite of "start brewing without setting anything up". The checklist,
  the first-toolkit shortcut (PEC-02) and return-to flows keep it to about two
  minutes, but it is still the weakest moment in the product.
- **Connectivity at the machine.** There is no offline mode: a pull or a log
  fails without a connection. The design handles failure (nothing is
  recorded, retry offered), but a kitchen with poor signal will feel it.
- **Data-loss risk is invisible.** The MVP accepts that a lost device loses
  everything. The design adds one calm sentence in Profile and nothing else;
  confirm that's the right level, neither silent nor alarming.
- **Signal colour has almost nothing to show.** With no "ran fast" threshold
  and an undefined defect list, the only shot warning in the MVP is a tagged
  channelling defect, which the user just told us about. The warning system
  is built but barely visible until DQ-08 and DQ-09 are answered.
- **Phase 0 contrast issue.** `Input` styles placeholders in `ink-tertiary`
  at 16 px, which breaks the large-text-only rule (DES-01-01-04).
- **Six value tabs in ShotDial.** Machines with exact temperature and
  pressure give six tabs; on a 375 px screen they fit only as compact values.
  Needs testing with real locales (long labels in some languages).

## 8. Design questions for the Head of Product

Design-level questions this draft answered with an assumption. Each can be
reversed without changing the structure.

- **DQ-01** Default toolkit name: stored once in the user's language at
  creation (from a message key), or the schema changed to allow a null name
  shown as a translated label, like the persona? Assumed: stored at creation.
- **DQ-02** Time-of-day drink: assumed the persona's most recent drink with a
  shot within 90 minutes either side of now on any of the last 14 days; else
  the most recent drink at all; else the first visible drink (Espresso).
- **DQ-03** Which coffee the home screen shows (SQ-06): assumed the
  earliest-opened open portion whose bean has a recipe for this persona and
  drink; else the earliest-opened open portion; else the newest unopened.
- **DQ-04** Undo window: assumed 8 seconds, with no visible countdown. Undo is
  a convenience: editing stays possible, so the time limit is acceptable for
  accessibility.
- **DQ-05** Reaction later: assumed the good and off reaction can be given or
  changed from SCR-SHOT at any time (SQ-07).
- **DQ-06** Who sets "opened": assumed the first shot logged against an
  unopened portion sets its opened date to that day, and the user can also
  open a portion by hand (EPIC-03-02 open question, SQ-03). Unopened portions
  are offered in the shot log.
- **DQ-07** Starting values for a blank shot log: assumed the last measured
  shot on this toolkit; with none, dose 18 g, yield 36 g, time 28 s, grind at
  the middle of the grinder's range.
- **DQ-08** Defect list: not defined. A starter list is needed before
  EPIC-01-05 can be designed in full; the designer can propose one
  (DES-01-05-04).
- **DQ-09** "Ran fast" threshold: not defined; the warning is left out until
  it is.
- **DQ-10** Duplicate link found: may the user still add their own entry?
  Design supports both; the ghost "add anyway" is hidden if not.
- **DQ-11** "Not sure" capabilities: assumed no temperature or pressure field,
  and for grinders a stepless 0 to 50 scale with step 0.5. Confirm, or prefer
  the admin to fill them in.
- **DQ-12** Off reaction plus fix: assumed two records (the one-tap shot keeps
  "off", the fix is a new measured shot), as in `stories.md` (SQ-14 on doses).
- **DQ-13** "Recent": assumed the last 30 days, then "show older".
- **DQ-14** Splitting into several portions: assumed by splitting one at a
  time. Confirm this meets "split into several".
- **DQ-15** Recalibration: assumed a flag on any grinder event, on by default
  for burrs and re-zero (EPIC-04-01 open question).
- **DQ-16** Google sign-in button (Next): Google's branded button is colourful.
  Use it as-is in the one place it appears, or a monochrome variant if their
  guidelines allow?

---

## 9. Design tasks summary

All labelled `design`.

| Epic | Tasks |
|---|---|
| EPIC-01-01 | DES-01-01-01 to 05 |
| EPIC-01-02 | DES-01-02-01 to 05 |
| EPIC-01-03 | DES-01-03-01 to 05 |
| EPIC-01-04 | DES-01-04-01, 02 |
| EPIC-01-05 | DES-01-05-01 to 04 |
| EPIC-01-06 | DES-01-06-01 to 04 |
| EPIC-02-01 | DES-02-01-01 to 04 |
| EPIC-02-02 | DES-02-02-01 to 04 |
| EPIC-02-03 | DES-02-03-01, 02 |
| EPIC-02-06 | DES-02-06-01 to 03 |
| EPIC-03-01 | DES-03-01-01 to 03 |
| EPIC-03-02 | DES-03-02-01 to 03 |
| EPIC-03-03 | DES-03-03-01 |
| EPIC-03-04 | DES-03-04-01 to 03 |
| EPIC-04-01 | DES-04-01-01, 02 |
| Next (8 epics) | DES-05-03-01, DES-02-05-01, DES-02-04-01, DES-03-05-01, DES-05-01-01, 02, DES-04-02-01, DES-04-03-01, DES-04-04-01 |

MVP: 50 design tasks. Next: 9. Later: none until re-planned.

---

## Review log

### Round 1 (2026-10-18)

- **Feedback received:** none yet; this is the first draft, written from the
  approved epics (revision 3), spec S-01 to S-09 and the Phase 0 design
  system.
- **What changed:** first version. App structure (four text tabs, full-screen
  tasks, sheets), home screen, full MVP flows for 15 epics, lighter flows for
  8 Next epics, brief direction for 7 Later epics. 15 new components proposed
  (NC-01 to NC-15) and two extensions to NumberWheel.
- **Sent to the epic-planner:** proposed epic changes PEC-01 to PEC-06
  (section 7), pending the Head of Product's review. Not yet sent.
