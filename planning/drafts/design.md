# Tare design (approved)

Source: `planning/drafts/epics.md` (final, revision 6, 30 epics, with the
design and plan-review amendments applied), `planning/drafts/review.md` (the
plan review), `docs/spec.md` S-01 to S-09 (S-01 and S-02 override older
sections), and the Phase 0 design system: `src/styles/tokens.css`,
`src/components/ui` (Button, Card, Input, NumberWheel), `src/components/brand`
(Logo) and `src/stories/Tokens.mdx`. `planning/drafts/stories.md` (first
version) was read for context only; this design is per epic, and stories will
be revised against it.

**Status: design approved by the Head of Product after review round 2;
round 3 (after the plan review) is for the Head of Product's confirmation.**
Round 3 applies epics revision 6 (fixed kits, two freshness clocks, "open"
excludes frozen) and the review findings the designer owns (M2, M4, M7, m3,
m4). Only the affected flows changed; everything else stands as approved.
PEC-07 (accepted in round 2) is superseded by the fixed-kit rule. No GitHub
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
- **Kit words (round 3).** Users see "kit" and "part"; code and schema say
  `toolkit` and `ownedHardware` (S-08). Screen IDs keep their stable names:
  SCR-TOOLKIT is the kit builder, SCR-UNIT is a part's screen, SCR-UNIT-ADD
  adds a part. Message keys use `kit.*` for kits and the builder; the existing
  `unit.*` keys hold copy about parts (key names aren't shown to users).

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
  shot warnings. In the MVP the only shot warning is "possible channelling",
  shown when channelling is tagged (EPIC-01-05); "ran fast" has no threshold
  and is not a current use of signal (DQ-09). Form errors, empty
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
  `pantry.*`, `bag.*`, `portion.*`, `kit.*`, `unit.*`,
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
- **Tasks are full screen, without the tab bar.** The shot log, tasting,
  add-a-bag, add-a-part, kit builder, catalog picker and catalog add flows
  open over the tabs
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
| SCR-KIT | Kit: your kits (current first) and your parts | 01-02 |
| SCR-UNIT | Part detail: capabilities, kits it's in, maintenance | 01-02, 04-01 |
| SCR-UNIT-ADD | Add a part: kind, pick model, details | 01-02 |
| SCR-TOOLKIT | Kit builder: pick a combination of parts; Tare finds the existing kit or makes a new one | 01-02 |
| SCR-CATALOG-PICK | Catalog picker (hardware or coffee), shared | 01-02, 03-01, 01-06 |
| SCR-CATALOG-ADD | Add a missing maker, model, roaster or bean | 01-06 |
| SCR-PROFILE | Profile name and about this device | 01-01 |
| SH-SELECT | Generic single choice (kit, drink, portion, coffee) | many |
| SH-PORTION | Which bag to use, when none of this coffee is open | 02-02 |
| SH-PIN | Confirm a pin, showing what it replaces | 02-01 |
| SH-PORTION-ACTIONS | Open, freeze, thaw, finish, weigh, split | 03-02, 03-04 |
| SH-SPLIT | Split off a portion by weight | 03-02 |
| SH-STOCK | Weigh what's left | 03-04 |
| SH-DATE | Confirm a dated action (default today) | 03-02, 04-01 |
| SH-MAINTENANCE | Add a maintenance event | 04-01 |
| SH-CONFIRM | Discard changes | many |

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
   name, roaster, and the since-opening clock of the portion in use
   (`portion.daysOpen` ["5 days open"], or `portion.notOpened` for a portion
   the next pull will open; EPIC-03-03, round 3). This replaces the ambiguous
   "Day 12": at the machine, time since opening is the more telling number
   (S-02). Tap opens SH-SELECT with beans that have an unfinished portion.
   Default: see DQ-03.
4. **Recipe values (NC-08, large).** Grind, dose, yield and time in
   `text-display` weight 200 on a 2 x 2 grid, each with an overline label
   (`shot.grind`, `shot.dose`, `shot.yield`, `shot.time`) and its unit in
   `ink-tertiary` (large, so allowed). Ratio under dose and yield in
   `text-label` (`shot.ratio`). Temperature and pressure, if the recipe has
   them, in one `text-body` line below.
5. **Kit line**, `text-label` `ink-secondary`, a quiet select (round 3): the
   current kit's name, or its parts name (`kit.partsName`, composed from the
   grinder and machine models) when it has none. The recipe shown is always
   on this kit. Tap opens SH-SELECT with the household's kits (current first,
   marked `kit.current`) and a last row `kit.changePart` that opens the kit
   builder (SCR-TOOLKIT) with return-to. Choosing a kit makes it current
   (DQ-18, PEC-09).
6. **Primary action.** `Button variant="primary" fullWidth` `home.pull`
   [Pull this shot].
7. **Secondary action.** `Button variant="ghost" fullWidth` `home.dialIn`
   [Dial in], opening SCR-LOG pre-filled from the recipe (EPIC-02-03).
8. **Footnote**, `text-label` `ink-secondary`: remaining coffee in the
   portion in use, `home.remaining` ["142 g left in this bag"] (EPIC-03-04).
   Hidden when unknown.

**Changing drink, coffee or kit (EPIC-02-02, PEC-03, revision 4; kit added
in round 3, PEC-09):**

- All three selects open SH-SELECT. The default option is marked with
  `home.usual` [usual] in `text-overline` `ink-secondary`, so the way back is
  always visible without an extra reset button.
- Choosing updates the card in place (drink title, coffee line, values,
  kit line) with a 200 ms cross-fade of the values only; the buttons
  don't move. No navigation.
- If the new drink, coffee and kit have no recipe, the card switches to the
  no-recipe state (`home.noRecipe` or `home.noRecipeOnKit`, primary
  `home.dialIn`) in place.
- The coffee list shows beans with an unfinished portion: bean as primary,
  roaster and since-opening clock as secondary, beans that have a recipe for
  this drink on this kit first. Beans whose only unfinished portions are
  frozen show `portion.frozen` and come last.
- A kit change is not a "next pull only" change like drink and coffee: the
  chosen kit becomes current (DQ-18), because the kit is physical and stays
  on the counter until the user changes parts again.
- **Does a change stick? (DQ-17, assumption.)** A change applies to the next
  pull only and is never saved as a setting:
  - *Drink:* after a pull, the time-of-day rule (DQ-02) picks the drink just
    pulled anyway, so a pulled change sticks naturally through history. A
    change with no pull resets to the time-of-day default after the app has
    been away from the home screen for 30 minutes.
  - *Coffee:* the coffee of the last pull for this persona and drink wins
    over the DQ-03 default while it still has an unfinished portion. That
    keeps a user on the bag they switched to, without a setting. A change with
    no pull resets like the drink.

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
| Kit and coffee, no recipe for this drink on any kit | Drink, coffee and kit lines as normal; the values grid is replaced by one sentence `home.noRecipe` [no recipe yet for this drink and coffee]; the primary button is `home.dialIn`, opening SCR-LOG with drink, coffee and kit chosen and starting values per DQ-07. This is the spec's "Dial in" in place of "Pull This Shot". |
| No recipe on this kit, but one on another kit (round 3) | The values grid is replaced by `home.noRecipeOnKit` [no recipe on this kit yet] and one `text-label` line `home.startsFrom` naming the closest kit the dial-in starts from (DQ-19). Primary `home.dialIn` opens SCR-LOG pre-filled from that recipe (grind per DQ-20). Never a one-tap pull. |
| Recipe, but no portion of that coffee open | Normal layout. Pull opens SH-PORTION (EPIC-02-02). This includes a bean whose only opened portion is in the freezer: frozen isn't open (S-02). |
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
| NC-06 | **SelectField** | Shows the current choice and opens SH-SELECT. Two looks: field (like Input, on `surface-sunken`) and quiet (text only, with a chevron, for the home screen) | Input is for typing | Log context, home drink, coffee and kit, kit builder rows |
| NC-07 | **PulledState** | The in-place result of a one-tap pull: confirmation, undo for the window, good and off chips, live-region announcement | New behaviour | SCR-HOME |
| NC-08 | **ShotValues** | Grind, dose, yield, time (and optional temperature, pressure) as a read-only group. Sizes: large (home, detail, 2 x 2 grid) and compact (one line in rows). Dose-to-yield arrow mirrors | Nothing displays a set of values | Home, shots, bag recipes, pin sheet |
| NC-09 | **ShotDial** | The shot log's editor: a row of compact value tabs (grind, dose, yield, time, plus temperature and pressure when the machine has them) above one full NumberWheel for the selected value. Shows the starting value under any changed value ("was 18.0"). Optional values have an unset state | Four stacked 96 px wheels don't fit a phone screen; optional values need "unset" | SCR-LOG |
| NC-10 | **Notice** | Inline message: neutral (ink on `surface`, for errors, info, empty results) or warning (`signal` on `signal-subtle`, shot warnings only, enforced by the API: the warning tone only takes a shot-warning kind). Two sizes: block (detail and tasting screens) and inline (one line of `signal` text with no fill, for list rows) | Nothing exists; keeps signal use auditable | Errors everywhere; shot warnings |
| NC-11 | **Skeleton** | `surface-sunken` blocks with `radius-sm`, a slow opacity pulse that stops under reduced motion; `aria-busy` on the region | Loading states | All data screens |
| NC-12 | **EmptyState** and **Checklist** | Empty state: `text-h2` line, one `text-body` sentence, one action. Checklist: numbered steps with done, next and later states | Empty and first-run states | All lists; first run |
| NC-13 | **Toggle** | On or off switch with a visible label, `role="switch"` | No boolean control exists | Sweetened, recalibration, freeze the new portion |
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
- **Card**: no change. Used for home recipe, kits and bags.

**Not needed**: no tooltips, no tabs component inside screens, no charts, no
avatars, no badges in colour. Markers such as `shots.oneTap` [One tap],
`catalog.addedByYou` [Added by you] and `bag.fromFrozen` [From frozen] are
plain `text-overline` text in `ink-secondary`.

---

## 4. MVP epics (full detail)

### INIT-01: Log a shot against your real kit in seconds

#### EPIC-01-01: Start brewing without setting anything up

**Scope note (revision 4, PEC-01).** This epic now owns the app shell: TabBar
(NC-01), PageHeader (NC-02), the full-screen task frame, the shared state
patterns (Skeleton NC-11, EmptyState and Checklist NC-12, Notice NC-10) and
the SCR-PROFILE frame. It owns the frame only; each tab's content belongs to
its own epic. Because the shell ships first, each tab shows its EmptyState
(with no action, or an action only once its target exists) until the owning
epic fills it, so no tab is ever blank or broken in between builds.

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
- Every screen built on the shell uses PageHeader and the shared loading,
  empty and error patterns; no screen invents its own spinner or error style.
- Before a tab's owning epic ships, the tab shows an EmptyState, never a
  blank screen or a dead action.
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
- DES-01-01-06 Define the interim empty state for each tab before its owning
  epic ships (round 2).

#### EPIC-01-02: Describe your kit once

**Round 3: fixed kits (epics revision 6, S-02).** A kit is a fixed
combination of parts that directly affect the output: machine, grinder,
portafilter, basket, puck screen, tamper, distribution tool. No scale. Any
change of parts is a different kit, and the same combination brings back its
existing kit and recipes. Kits are never edited and nothing is retired. The
round-2 toolkit editing, swap confirmation and needs-re-dial state are
removed (PEC-07 is superseded). "Changing a part" now means picking a
combination in the kit builder, and Tare finds or makes the kit.

**UX flow: add a part (SCR-UNIT-ADD)**

1. From SCR-KIT `kit.addPart`, from the kit builder's `kit.addPart` row
   (kind preset), or from the first-run checklist.
2. **Kind**: ChipGroup `kit.kind.*` (machine, grinder, portafilter, basket,
   puck screen, tamper, distribution tool). From the checklist the kind is
   preset to machine, then grinder.
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
   (Input, date, optional). For machines and grinders, a capabilities summary
   in `text-label`, read-only (for example "temperature: exact, 85 to 100 °C"
   composed from keys). Other kinds have no capabilities.
5. Save. Back to where the user came from (return-to).
6. **Use the new part?** When a household that already has a kit adds a part
   from SCR-KIT, the flow ends on one quiet offer, `kit.useNewPart` [use it in
   your kit?]: primary opens the kit builder pre-filled with the current kit
   plus the new part (replacing the part of the same kind); ghost
   `kit.notNow` returns to SCR-KIT. Adding a part never changes a kit by
   itself.
7. **First kit shortcut** (PEC-02, kept). When the household has at least one
   machine and one grinder and no kit, a Card on SCR-KIT (and the
   checklist's first step on SCR-HOME) offers `kit.suggest` [make these your
   kit], naming the machine and grinder it will use.
   - With exactly one machine and one grinder: one primary tap makes the kit
     from those two parts, with no name (shown by its parts name, S-08), and
     lands back where the user was with a short confirmation. No form.
   - With more than one of either: the tap opens the kit builder with the
     most recently added machine and grinder preselected.
   - Right after the user adds their second required part (a grinder after a
     machine, or the reverse), the add-a-part flow ends on this offer instead
     of SCR-KIT, so the first kit is never a separate errand.
   - The offer disappears once any kit exists. The new kit becomes current.

**UX flow: kit builder (SCR-TOOLKIT, round 3)**

The one place kits are made or found. Opened from SCR-KIT (`kit.new`, or
`kit.changePart` on a kit's Card), from the kit select on SCR-HOME or SCR-LOG
(`kit.changePart`), from "use the new part?" (step 6) and from the shortcut
when there's a choice. It is "which parts are you using now?", never "edit
this kit".

1. Header `kit.builderTitle` [which parts are you using?].
2. **One row per kind**, in a fixed order: machine, grinder, portafilter,
   basket, puck screen, tamper, distribution tool. Each row is a SelectField
   (field look) listing the household's parts of that kind; optional kinds
   also offer `kit.noPart` [none]; every list ends with `kit.addPart`, which
   opens SCR-UNIT-ADD with that kind preset and returns here with the new part
   chosen. Machine and grinder are required, one each. One part per kind is
   assumed (DQ-21).
3. **Starting point.** From a kit's `kit.changePart`: that kit's parts, so
   the user changes only the row that changed. From `kit.new`: the current
   kit's parts. From "use the new part?": the current kit with the new part
   swapped in.
4. **Match line**, live under the rows (polite live region, `text-body`):
   - the combination already exists: `kit.matchFound` [this is your kit
     "<name>"], with its recipe count (`kit.recipeCount`);
   - it doesn't: `kit.newKit` [this will be a new kit], and when another kit
     shares parts, `kit.closest` [recipes on "<closest kit>" will give your
     dial-in a head start] (DQ-19).
   Matching is by the exact set of parts (S-08 `partsKey`), so it is
   instant; no loading state.
5. **Name** (new kit only): a disclosure `kit.addName` reveals `kit.name`
   (Input, optional). Without a name the kit is shown by its parts name.
6. **Primary**: `kit.useThis` when it matches, `kit.makeThis` when it's new.
   Either way the result becomes the current kit (DQ-18) and the user returns
   where they came from, with that kit chosen.
7. If machine or grinder is missing on save, the row is named in a neutral
   Notice; the button stays enabled, so the rule is explained, not hidden.

**UX flow: kits and parts (SCR-KIT, SCR-UNIT)**

- SCR-KIT, section `kit.kits`: one Card per kit. The current kit comes first,
  marked `kit.current` (overline); the rest follow by last used. Card: kit
  name or parts name (`text-h3`), its parts in kind order (`text-label`),
  `kit.recipeCount` and `kit.lastUsed`. Actions: on the current kit,
  `kit.changePart` (secondary); on the others, `kit.useThis` (secondary,
  makes it current) and `kit.changePart` (ghost). A ghost `kit.rename` opens a
  sheet with `kit.name` (the name is a label, not a part, so naming doesn't
  change the kit; DQ-21). Kits not used for 90 days collapse under
  `kit.older`.
- Section `kit.parts`: the household's parts grouped by kind (ListRows:
  nickname or model, maker and model as secondary), each opening SCR-UNIT.
  Header action `kit.addPart` (secondary).
- SCR-UNIT (a part): model and maker, nickname, acquired date, capabilities
  (machines and grinders), the kits it's in (`unit.inKits`), and maintenance
  (EPIC-04-01). No retire: a part the household stops using simply isn't in
  its current kit any more (S-02).
- Servicing a part (new burrs, a clean) is a maintenance event on SCR-UNIT,
  never a new kit (EPIC-04-01). Replacing a part with a different one is a
  new combination, made in the kit builder.

**States**

| State | Design |
|---|---|
| No parts | EmptyState `kit.empty` with one primary `kit.addMachine`; the header's `kit.addPart` is hidden, so there is one primary. |
| Parts but no kit | Kits section shows the shortcut Card (step 7). |
| Catalog search, no match | Notice (neutral) `catalog.noMatch` with the query echoed, and `catalog.cantFind` as a secondary button. |
| Catalog loading | Skeleton rows. |
| Save failed | Values kept, Notice with retry. |

**Components:** Button, Input, Card, PageHeader, ListRow (NC-03), ChipGroup
(NC-04), SelectField (NC-06), Sheet (NC-05), Notice, Skeleton, EmptyState,
Icon (NC-14). No new component: the builder is SelectField rows plus a text
match line.

**Design acceptance criteria**

- A first-time user can go from SCR-HOME to a first kit (machine, grinder,
  kit) in at most 12 taps, without typing more than search terms.
- Search finds a model by alias in one query; results show maker and model
  together.
- Unverified entries are marked by text only (`catalog.addedByYou`), not by
  colour.
- Kit rules are explained before or at save, never by silently disabling the
  button.
- With one machine and one grinder, the first kit takes exactly one tap after
  adding the second part, with no typing.
- Nowhere offers to edit a kit's parts; every change of parts goes through
  the builder and lands on an existing or a new kit.
- The builder says before saving whether the combination is an existing kit
  (by name, with its recipes) or a new one.
- Going back to a previous combination of parts brings back that kit and its
  recipes, with no duplicate kit.
- Changing one part from a kit's Card takes: change a part, pick the new
  part, use or make the kit. Three taps when the part is already owned.
- There is no retire action anywhere; past shots always show the kit and
  parts they were pulled with.

**Design tasks** (`design`)

- DES-01-02-01 Wireframe the add-a-part flow, including the first-kit
  shortcut and "use the new part?" (updated round 3).
- DES-01-02-02 Design SCR-CATALOG-PICK for hardware and coffee (shared), with
  search, two-level browse and no-match states.
- DES-01-02-03 Design SCR-KIT (kits with the current marker, parts) and
  SCR-UNIT (a part) (updated round 3).
- DES-01-02-04 Design SCR-TOOLKIT as the kit builder: kind rows, starting
  points, the live match line (updated round 3).
- DES-01-02-05 Add Storybook stories for ListRow (NC-03), ChipGroup (NC-04),
  Icon (NC-14) and Sheet (NC-05).
- DES-01-02-06 Design the one-tap first-kit shortcut and the kit select on
  SCR-HOME and SCR-LOG, with its `kit.changePart` row (redefined round 3;
  replaces round 2's editing and swap work).

#### EPIC-01-03: Log a shot in seconds

**UX flow: SCR-LOG, new shot**

The shot log is one full-screen task, laid out so a shot is saved in seconds:

1. **Header** (NC-02): ghost `actions.cancel` at the start, title `log.title`
   (mode-specific, see below).
2. **Context**, three SelectFields (NC-06, field look) in one compact block:
   `log.kit`, `log.drink`, `log.coffee`. They arrive pre-chosen: kit = the
   current kit (DQ-18), drink = the home screen's drink, coffee = the home
   screen's coffee portion. Most shots never touch them. The kit options are
   the household's kits plus `kit.changePart` (the kit builder, return-to).
   The coffee options are unfinished portions, named by bean, with bag, state
   and since-opening clock as the secondary line; unopened portions are
   offered (DQ-06), and frozen ones come last, marked `portion.frozen`.
   - Changing the kit here keeps dose, yield and time. Grind keeps its value
     only if the new kit has the same grinder; otherwise it moves to that
     grinder's last measured value, or the middle of its range (grind doesn't
     transfer between grinders, S-01).
3. **ShotDial (NC-09).** A row of compact value tabs, each showing its overline
   label and current value in `text-h3`: grind, dose, yield, time. Tapping a
   tab shows its full NumberWheel below (96 px value, ruler, typed entry).
   The first tab is selected on open. The ruler scrolls with drag, flick,
   keyboard and typed entry, exactly as Phase 0 built it.
   - **Grind** follows the kit grinder's declared scale: stepped grinders use the
     grinder's step; stepless use its finest increment. End captions show
     finer and coarser per the grinder's `coarser` direction.
   - **Dose** grams, step 0.1. **Yield** grams, step 0.1. **Time** seconds,
     step 0.1 (stored in ms). Ratio (`shot.ratio`) shown under the tabs and
     updated live.
   - Starting values for a blank log: the last measured shot on this kit,
     or neutral defaults (DQ-07).
4. **Sweetened**: Toggle (NC-13) `log.sweetened`.
5. **Save**: primary `log.save`, full width, pinned to the bottom of the
   screen above the safe area so it's reachable with a thumb.
6. Saved: go to SCR-TASTE (EPIC-01-05). Shot is already saved; tasting is
   optional.

**Missing context** (no kit, no coffee): the matching SelectField shows
`log.missingKit` or `log.missingCoffee` and opens the add flow
(SCR-TOOLKIT, SCR-BAG-ADD) with return-to. The dial still works, so values
aren't lost while adding.

**Modes of SCR-LOG** (same screen, different title and starting values):

| Mode | Title key | Starting values | Save does | Epic |
|---|---|---|---|---|
| New | `log.titleNew` | Last shot or defaults | Saves a measured shot | 01-03 |
| Dial in from recipe | `log.titleDialIn` | The pinned recipe on this kit; on a kit without one, the closest kit's recipe (DQ-19, grind per DQ-20) | Saves a measured shot | 02-03, 02-01 |
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
- DES-01-03-05 Design the missing-context and return-to paths, and the kit
  select with grind handling when the grinder changes (updated round 3).

#### EPIC-01-04: Record temperature and pressure when your machine has them

**UX flow**

ShotDial gains extra tabs only when the kit's machine declares them:

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

**States:** as SCR-LOG. If a user-added machine's temperature or pressure
answer is "not sure", that tab doesn't show (see "Shot log with 'not sure'
capabilities" under EPIC-01-06).

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
5. **Shot warning** (in scope, PEC-04): as soon as channelling is tagged, a
   block Notice in the warning tone, `shot.warnings.channelling`, appears
   directly under the defects group (no layout jump above the user's thumb);
   untagging removes it. "Ran fast" is out until a threshold exists (DQ-09).

**Where the warning appears.** This epic owns the warning; other screens reuse
it, never restyle it:

| Place | Form |
|---|---|
| SCR-TASTE | Block Notice under the defects, on tagging |
| SCR-SHOT | Block Notice under the values |
| SCR-SHOTS rows | Inline Notice: one line of `signal` text, after the markers |
| SCR-LOG edit mode | Block Notice under the defects, as on SCR-TASTE |

Nowhere else uses `signal`. The defect chip itself stays monochrome when
selected, like every other chip: the warning is the Notice, not the chip.
6. Actions: primary `taste.done`, and secondary `recipe.pin` [pin as recipe]
   (EPIC-02-01). In fix and dial-in modes, pin is the primary action and done
   is secondary, because pinning is why the user came.
7. Everything is optional. Done with nothing chosen saves nothing more.

**Leaving saves (round 3, review M2).** One rule: whatever the user has
chosen on SCR-TASTE is saved however they leave it. That means Done, pin (which
saves the choices before opening SH-PIN), the header's back or close, and the
system back gesture. There is no tab bar here (SCR-TASTE is a full-screen
task), so there is no "leave by tab". There is never a discard prompt, because
tasting is optional and never lost. The screen saves before it navigates;
the save is small and local to one shot, so this is near-instant.

The same controls appear in SCR-LOG edit mode for rating later. Edit mode is
the deliberate exception: it changes a saved shot's values, so it saves only
on `log.saveChanges` and asks before discarding (SH-CONFIRM). The difference
is stated in the edit mode's header (`log.titleEdit`).

**States**

| State | Design |
|---|---|
| Save failed (on any way out) | The screen stays, choices kept, Notice `taste.saveFailed` with `actions.retry`, and a ghost `taste.leaveWithout` [leave without saving tasting]. The shot itself was already saved. |
| Leave by Done, back or system back | Choices saved, then navigate; no prompt. |

**Components:** ChipGroup (NC-04, numbered scale and multi), ShotValues
(NC-08), Notice (warning tone, NC-10), Button.

**Design acceptance criteria**

- Tasting never blocks saving a shot, and never appears before Save.
- Leaving SCR-TASTE in any way saves what was chosen; no path discards it
  silently, and no path asks first. Only a failed save keeps the user on the
  screen.
- Each scale is operable by touch and keyboard (arrow keys move, space or
  enter selects) and announced as a radio group with its label.
- Choosing a score can be undone by tapping it again (back to unscored).
- Signal colour appears only for the channelling warning, and only while
  channelling is tagged.
- The warning reads the same everywhere a shot is shown (SCR-TASTE, SCR-SHOT,
  SCR-SHOTS, edit), using the shared Notice in block or inline size.
- The warning is text plus colour, never colour alone, so it passes without
  colour vision.
- The screen fits without scrolling on 430 x 932; on 375 x 667, defects may
  scroll but Done stays visible.

**Design tasks** (`design`)

- DES-01-05-01 Wireframe SCR-TASTE in normal, fix and dial-in modes, with
  the leaving-saves rule and its failure state (updated round 3).
- DES-01-05-02 Design the numbered-scale ChipGroup variant and its stories.
- DES-01-05-03 Design Notice (NC-10) warning tone and the rule that limits it
  to shot warnings; add stories.
- DES-01-05-04 Propose a starter defect list for the Head of Product (DQ-08).
- DES-01-05-05 Design the channelling warning in each place it appears
  (block and inline Notice) and add stories for both sizes (round 2).

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
   (preset from the add-a-part flow; one of the seven part kinds). For coffee: roaster (same pattern), bean
   name, and optional roast level (ChipGroup of the fixed list, S-09) and
   tasting notes (Input).
4. **Capabilities (machines and grinders only; in scope, PEC-05).** The user
   answers; the admin doesn't fill them in. A section `catalog.cap.title`
   with one sentence on why (so the shot log shows the right fields). Each
   question is a single ChipGroup whose last chip is `catalog.cap.notSure`.
   Follow-up questions appear only after the answer that needs them. An
   unanswered question saves as "not sure", and the section says so
   (`catalog.cap.skipHint`), so the user can save without answering anything.

   | Question | Answers | Follow-ups |
   |---|---|---|
   | Machine: `catalog.cap.tempQ` [can you set the brew temperature?] | no; a few settings; an exact number; not sure | Settings: `catalog.cap.howMany` (chips 2 to 5, not sure). Exact: unit (°C, °F, not sure), then lowest and highest (Input, decimal, optional) |
   | Machine: `catalog.cap.pressureQ` [can you set or read the pressure?] | no; a lever, paddle or valve; a few settings; an exact number; not sure | Lever etc.: `catalog.cap.gaugeQ` [is there a pressure gauge?] yes, no, not sure. Settings: how many. Exact: lowest and highest bar (optional) |
   | Grinder: `catalog.cap.dialQ` [does the dial click into steps?] | clicks; turns smoothly; not sure | |
   | Grinder: `catalog.cap.rangeQ` [lowest and highest number on the dial] | two Inputs, decimal, each optional | |
   | Grinder: `catalog.cap.stepQ` [smallest change you can make] | Input, decimal, optional; shown only for "clicks" | |
   | Grinder: `catalog.cap.coarserQ` [which way is coarser?] | higher numbers; lower numbers; not sure | |

   Every question is phrased around what the user sees on the machine or
   grinder, never schema words (control, stepless, capabilities).

**Shot log with "not sure" capabilities (DQ-11, updated round 2).** A "not
sure" answer never blocks logging and never invents a guess that matters.
Unknown parts fall back to the simplest honest behaviour:

| Not sure about | Shot log behaviour |
|---|---|
| Temperature control | No temperature tab (as "none"). |
| Number of temperature or pressure settings | Tab shows a numbered ChipGroup 1 to 5. |
| Temperature unit | °C. |
| Exact temperature range | NumberWheel 80 to 100 °C, step 0.5. |
| Pressure control, or gauge on a lever machine | No pressure tab (as "none"). |
| Exact pressure range | NumberWheel 0 to 12 bar, step 0.5. |
| Clicks or smooth | Treated as smooth: grind step 0.1. |
| Dial range | Grind wheel 0 to 100. Typed entry is the quickest way in, and the ruler only draws visible ticks, so a wide range costs nothing. |
| Step (clicks) | Step 1. |
| Which way is coarser | No finer and coarser captions on the grind wheel. Direction is never guessed, because a wrong caption is worse than none. |

- When any part is "not sure", the grind tab or the affected tab shows a quiet
  ghost link under its wheel, `log.capUnknown` [tell us about your grinder],
  opening SCR-UNIT's capabilities. It shows at most once per screen, never as
  a Notice, and disappears once answered.
- **Answer later.** SCR-UNIT shows the capabilities with "not sure" ones
  marked `unit.capNotSure`, and `unit.editCapabilities` reopens the same
  questions for models the household added itself (unverified). Answering
  later changes the shot log from then on; old shots keep their stored values
  (grind is a number, steps are steps), so nothing is reinterpreted. This
  "answer later" path is in scope (PEC-08, accepted, epics revision 5).
- **Old values outside a new range.** If a later answer narrows the range,
  editing an old shot widens that wheel's range to include its stored value,
  so it's shown as saved and never clamped silently.
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
- A machine or grinder can be saved with every capability question
  unanswered, and the shot log still works for it.
- Follow-up questions appear only when an answer needs them; a machine with
  no temperature or pressure control is two taps.
- With "not sure" about the coarser direction, the grind wheel shows no
  direction captions, never a guessed one.
- No "not sure" fallback ever shows as a warning or uses `signal`.

**Design tasks** (`design`)

- DES-01-06-01 Wireframe SCR-CATALOG-ADD for hardware and for coffee.
- DES-01-06-02 Design the duplicate-found state and its two outcomes.
- DES-01-06-03 Design the capability questions and follow-ups, with copy
  direction for the story writer.
- DES-01-06-04 Design the repeatable links and other names rows.
- DES-01-06-05 Design the shot log's "not sure" fallbacks, the
  `log.capUnknown` link, and the "answer later" capabilities on SCR-UNIT; add
  ShotDial stories for a fully "not sure" grinder and machine (round 2).

### INIT-02: Every new bag starts from what you already learned

#### EPIC-02-01: Pin the recipe that worked

**UX flow: pin from a shot**

1. From SCR-TASTE (`recipe.pin`) or SCR-SHOT (`recipe.pin`, measured shots
   only; one-tap shots don't show it).
2. SH-PIN opens: `recipe.pinTitle` naming drink, coffee and kit; the new
   values (ShotValues compact); and, if a recipe exists, the current one
   above it in `ink-secondary` with `recipe.replaces`. Primary
   `recipe.confirmPin`.
3. Confirmed: sheet closes; a short confirmation in place (`recipe.pinned`,
   live region). The home screen now shows this recipe.

**UX flow: pin by entering values**

1. From SCR-BAG, section `bag.recipes`: `recipe.add`.
2. SCR-LOG in recipe mode: context is drink and kit (the coffee is this
   bag's bean), then ShotDial, then primary `recipe.pinThis` which opens
   SH-PIN. No shot is saved.

**UX flow: see recipes**

- SCR-BAG, section `bag.recipes` [recipes for this coffee]: one ListRow per
  drink and kit with compact ShotValues and the date pinned. Tap: actions
  `recipe.dialIn` (SCR-LOG pre-filled) and `recipe.edit` (recipe mode).
- SCR-HOME shows the current recipe for its drink and coffee on the current
  kit.
- No recipe history screen in the MVP (older pins are kept as data only).

**UX flow: dial in on a kit with no recipe (round 3, replaces PEC-07)**

Recipes belong to exactly one kit (S-02). When the current kit has no recipe
for this bean, persona and drink:

1. SCR-HOME shows `home.noRecipeOnKit` and `home.startsFrom` naming the
   closest kit with such a recipe (section 2.3); primary `home.dialIn`. There
   is never a one-tap pull here.
2. SCR-LOG opens in dial-in mode with a one-line note `log.fromOtherKit`
   [starting from your recipe on "<kit>"]. "Closest" means the kit with the
   most parts in common with the current kit, among kits that have a recipe
   for this bean, persona and drink; ties go to the most recently used kit
   (DQ-19).
3. **What pre-fills (DQ-20).** Dose, yield and time always come from that
   recipe. Grind comes from it only if the closest kit has the same grinder.
   Otherwise grind starts at this grinder's last measured value, or the middle
   of its range, and the grind tab shows `log.grindNotCarried` [grind starts
   fresh on this grinder], because grind doesn't transfer between grinders
   (S-01). Temperature and pressure carry over only when the machine is the
   same; otherwise they start unset.
4. Each pre-filled value shows its source as "was" when changed, as in fix
   mode.
5. Save, then SCR-TASTE with pin as the primary action. Pinning gives this
   kit its own recipe, and the next visit is one tap.
6. No kit with a recipe for this bean, persona and drink: a blank dial-in
   (DQ-07), as in the round-1 no-recipe state.

**States**

| State | Design |
|---|---|
| No recipes for this coffee | `bag.noRecipes` one line, with `recipe.add` secondary. |
| Pin failed | SH-PIN stays open; Notice with retry. |

**Components:** Sheet (SH-PIN), ShotValues, ListRow, ShotDial, Button.

**Design acceptance criteria**

- Before confirming, the user sees exactly what the pin applies to (drink,
  coffee, kit) and what it replaces.
- A recipe from another kit is only ever a starting point for a dial-in,
  named as such (`log.fromOtherKit`), never pulled with one tap.
- Grind is never carried from a different grinder; the grind tab says so.
- Pin is never offered on a one-tap shot.
- Recipe mode looks like the shot log but its title and button say it pins a
  recipe, so no one thinks they logged a shot.

**Design tasks** (`design`)

- DES-02-01-01 Design SH-PIN, with and without an existing recipe.
- DES-02-01-02 Design the recipe section of SCR-BAG.
- DES-02-01-03 Design recipe mode of SCR-LOG.
- DES-02-01-04 Add Storybook story for ShotValues (NC-08), large and compact,
  with and without temperature and pressure.
- DES-02-01-05 Design the dial-in from the closest kit: the home state, the
  `log.fromOtherKit` note and the grind-not-carried state (round 3).

#### EPIC-02-02: Pull your daily shot in one tap

**UX flow**

1. SCR-HOME shows the recipe for the persona, the drink (time-of-day default)
   and the coffee (default per DQ-03), on the current kit (DQ-18). See
   section 2.3 for layout. The kit line is a select too (round 3, PEC-09).
2. **Optional: change drink or coffee** (in scope, PEC-03). Tap the drink
   title or the coffee line; SH-SELECT opens with the usual choice marked;
   choosing updates the card in place, and the pull uses the chosen drink and
   coffee. A change applies to the next pull; whether it sticks is assumed in
   section 2.3 (DQ-17). The user can change the drink while PulledState is
   showing; that ends PulledState (the reaction stays available on the shot
   in SCR-SHOTS) and shows the new recipe ready to pull.
3. Tap `home.pull`. The shot is recorded at once (optimistic, then confirmed),
   with the recipe's values, its kit, and the earliest-opened open portion of
   the coffee. "Open" means opened, not finished and not in the freezer
   (S-02): one-tap never uses frozen coffee on its own. No rating is asked.
4. PulledState (NC-07) appears in place: confirmation, undo for the window,
   good and off (EPIC-02-03).
5. **No open portion of the coffee:** SH-PORTION opens before recording:
   `portion.chooseTitle`, ListRows of unfinished portions of this coffee
   (bag, state, clock, remaining). Order (round 3): thawed and unopened
   portions on the counter first, then frozen portions last, marked
   `portion.frozen` with a `text-label` line `portion.grindFromFrozen`
   [ground straight from the freezer]. Choosing a counter portion records the
   shot and marks it opened today (DQ-06). Choosing a frozen portion records
   the shot as ground from frozen and changes none of the portion's dates
   (it isn't opened or thawed by this). Frozen coffee is only ever used this
   way: by the user's explicit pick. Cancel records nothing.
6. **No portion of the coffee at all:** SH-PORTION shows `portion.noneLeft`
   with secondary `home.addBag`; nothing is recorded.
7. **Undo:** removes the shot entirely, and the portion's opened date if this
   shot set it. Announced (`home.undone`).
8. **Edit later** through SCR-SHOTS (EPIC-02-06).
9. **No recipe** for the drink and coffee on this kit, including after a
   change: primary becomes `home.dialIn`, pre-filled from the closest kit's
   recipe when there is one (section 2.3, EPIC-02-01).

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
  without leaving the screen, and the buttons don't move.
- After a change, the one-tap pull is still one tap: two taps to choose, one
  to pull, with no confirmation in between.
- The usual drink and coffee are always marked in the select, so the way back
  needs no reset control.
- A change never becomes a hidden setting: the next default is explained by
  history alone (DQ-17). The kit is the exception: choosing a kit makes it
  current, and the kit line always shows which kit that is.
- A one-tap pull never records a shot against a frozen portion; frozen coffee
  appears only in SH-PORTION, last and marked.
- Only one primary button is on screen in every state.

**Design tasks** (`design`)

- DES-02-02-01 Design SCR-HOME in all states (section 2.3 table).
- DES-02-02-02 Design PulledState (NC-07) and its timing; add its story.
- DES-02-02-03 Design SH-PORTION (choose, frozen last, none left) (updated
  round 3).
- DES-02-02-04 Design the first-run Checklist on SCR-HOME.
- DES-02-02-05 Design changing drink and coffee on SCR-HOME: SH-SELECT with
  the usual marker, the in-place update, and the switch to the no-recipe
  state (round 2).

#### EPIC-02-03: Fix a bad shot from your recipe

**UX flow**

1. **Off after a one-tap shot:** tap `home.reactionOff` in PulledState. The
   reaction is saved on the one-tap shot. SCR-LOG opens in fix mode: title
   `log.titleFix`, starting values from the current recipe, the same portion,
   drink and kit, and a one-line note `log.fromRecipe` [starting from
   your recipe].
2. The user nudges one or two wheels. Each changed tab shows the recipe value
   under it (`log.was`), so the adjustment is clear.
3. Save: a new measured shot (DQ-12, two records). SCR-TASTE opens with pin as
   the primary action.
4. **Dial in from the home screen:** `home.dialIn` with a recipe opens SCR-LOG
   in dial-in mode; same as above without a reaction or a one-tap shot. On a
   kit with no recipe, it starts from the closest kit's recipe (EPIC-02-01).
   The portion follows the one-tap rule; with no open portion, SH-PORTION
   opens first, as for a pull.
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
   - the channelling warning as an inline Notice (EPIC-01-05 owns it).
   - Grind period dividers: owned by EPIC-04-01 and specified there.
3. The list shows the last 30 days, then `shots.showOlder` (DQ-13).
4. Tap a row: SCR-SHOT.

**UX flow: SCR-SHOT (shot detail)**

- ShotValues large, context (drink, coffee, and the kit with its parts; kits
  never change, so this is always what was used), date and time, whose taste and who logged (shown once sub
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
   - **Dates (round 3).** `bag.roastDate` (Input, date) is shown first,
     because it's what Tare uses. A disclosure `bag.otherDates` [other dates
     on the bag] reveals `bag.packedDate` (packing date, new, optional) and
     `bag.bestBefore` (optional). All three are optional and none blocks
     saving. A hint `bag.datesHint` says the since-roasting clock uses the
     roast date, else the packing date, and with only best-before shows the
     time left instead (EPIC-03-03). The round-1 Toggle
     `bag.onlyBestBefore` is removed.
   - Disclosure `bag.more`: `bag.lot` (Input), `bag.purchased` (date, default
     today).
4. Save `bag.save`. Lands on SCR-BAG for the new bag (or return-to), which
   shows one portion holding the whole bag.

**UX flow: SCR-PANTRY**

- Title `pantry.title`, with `pantry.addBag` as a primary action in the
  header end, **only when the pantry has bags**. When it's empty, the header
  action is hidden and the EmptyState's button is the one primary (round 3,
  review m4).
- One Card per bag that isn't finished: bean (`text-h3`), roaster and the
  since-roasting clock (`text-label`), and its portions as ListRows inside:
  state (`portion.unopened`, `portion.counter`, `portion.frozen`,
  `portion.thawed`), the since-opening clock (EPIC-03-03), remaining
  (EPIC-03-04, NC-15 Meter).
- Order: bags with an open portion first (earliest opened first, matching
  the one-tap rule; "open" excludes frozen, so an opened-then-frozen portion
  doesn't count), then unopened, then bags only in the freezer.
- `pantry.finished` collapsed section at the end.

**States**

| State | Design |
|---|---|
| Loading | Skeleton cards (two). |
| Empty | EmptyState `pantry.empty`, primary `pantry.addBag`; header action hidden, so it's the only primary. |
| Coffee search, no match | Notice `catalog.noMatch`, secondary `catalog.cantFind`. |
| Missing weight on save | Error on the weight group in ink. |
| Save failed | Form kept, Notice with retry. |

**Components:** Card, ListRow, ChipGroup, Input (date, decimal),
SelectField, PageHeader, EmptyState, Skeleton, Notice, Button, Meter.

**Design acceptance criteria**

- A bag of a coffee that's in the catalog is added in under 20 seconds:
  search, pick, tap a size, set roast date, save.
- No date blocks saving; packing date and best-before are one tap away, not
  in the way.
- The pantry list order matches the order the one-tap rule uses.
- The pantry has exactly one primary button in every state.
- Dates use the locale's format and the native date picker.

**Design tasks** (`design`)

- DES-03-01-01 Wireframe the add-a-bag flow, with the other-dates disclosure
  (updated round 3).
- DES-03-01-02 Design SCR-PANTRY (bags with portions, order, finished, one
  primary when empty) (updated round 3).
- DES-03-01-03 Design SCR-BAG (facts, both clocks, portions, recipes)
  (updated round 3).

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
   as the schema implies.) A portion opened and then frozen shows as frozen,
   is not open (S-02), and isn't used by one-tap until thawed; after thawing
   it is open again, and its since-opening clock resumes without the freezer
   time.
2. Dated actions (open, freeze, thaw, finish) go through SH-DATE: the date,
   default today, and a primary confirm. One tap for "today".
   - **Correcting a date is not in the MVP (round 3, review M4).** Each date
     is set once, through its action, and can be backdated when set. There is
     no "edit date" action on SH-PORTION-ACTIONS, SH-DATE or SCR-BAG. So
     acceptance criteria should talk about "when a portion's dates are set",
     not "when I correct a date". The only remedy for a wrong remaining
     weight in the MVP is weighing what's left (SH-STOCK, EPIC-03-04). A
     small "edit date" action is a candidate for Next if it proves needed.
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
- Every dated action defaults to today and can be backdated when it is set;
  set dates can't be changed afterwards in the MVP.
- Portion state is shown as text on every portion row.

**Design tasks** (`design`)

- DES-03-02-01 Design SH-PORTION-ACTIONS for each portion state.
- DES-03-02-02 Design SH-SPLIT with the live remainder.
- DES-03-02-03 Design SH-DATE.

#### EPIC-03-03: Know how fresh your beans really are

**UX flow**

**Round 3: two clocks, both paused by freezing (S-02, epics revision 6).**
The single "day 12" age and the estimated "about day 12" are removed. Tare
never invents an age (this resolves review B1).

| Clock | What it counts | Phrases | Where |
|---|---|---|---|
| Since roasting (per bag) | From the roast date; else from the packing date, labelled as packed; minus freezer time | `bag.daysSinceRoast` [12 days since roast], `bag.daysSincePacked` [12 days since packing] | SCR-BAG facts, bag Cards on SCR-PANTRY |
| Best-before only (no age) | Time left until best-before, not an age | `bag.bestBeforeIn` [best before in 40 days], `bag.bestBeforePassed` [best before passed 3 days ago] | Same places as since roasting |
| No date at all | Nothing to count | `bag.ageUnknown`, with ghost `bag.addDate` on SCR-BAG | Same places |
| Since opening (per portion) | From the portion's opened date, minus freezer time | `portion.daysOpen` [5 days open], `portion.openedToday`, `portion.notOpened` | SCR-HOME coffee line, portion rows, SH-PORTION, SCR-LOG coffee field |

- **Freezing pauses both.** A frozen portion's row shows `portion.agePaused`
  [paused in the freezer] in place of its clock. SCR-BAG adds one line per
  portion that has been frozen, `portion.frozenDays` [N days in the freezer
  not counted].
- **Home** shows only the since-opening clock (section 2.3): at the machine
  it's the more telling number (S-02).
- **SCR-BAG** shows both: the since-roasting line (or best-before, or
  unknown) in the bag's facts at the top, and each portion's since-opening
  clock on its row.
- Shots ground from frozen beans show `bag.fromFrozen` on SCR-SHOTS rows and
  on SCR-SHOT. In SCR-LOG, choosing a frozen portion shows the same marker on
  the coffee field.

**States:** clocks are calculated, never loading on their own; they appear
with the row.

**Components:** ListRow, SelectField, text markers. No new component.

**Design acceptance criteria**

- Clocks never use colour to signal freshness (no green to red).
- The two clocks are worded so they can't be confused: "since roast" or
  "since packing" for the bag, "open" for the portion. No bare "day N"
  anywhere.
- With only a best-before date, no age is shown, only the time left.
- Paused clocks are worded differently from running ones.
- The frozen marker is text, the same on rows and detail.

**Design tasks** (`design`)

- DES-03-03-01 Define the two clocks' phrases and where each appears; hand
  copy direction to the story writer (updated round 3).

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
3. For grinders, events split history into grind periods. This epic owns
   where periods show (in scope, PEC-06):
   - **SCR-UNIT:** above the maintenance list, one line `maintenance.periodSince`
     [current grind period since 3 October], with the number of shots in it
     (`maintenance.periodShots`). With no events: `maintenance.periodAll`
     [all shots are in one period].
   - **SCR-SHOTS dividers:** at the event's place in time, a full-width
     divider: a `line-strong` hairline with one line of `text-overline`
     `ink-secondary` text, `shots.maintenance` [grinder name, event kind,
     date], plus `maintenance.recalibration` when marked. The grinder is named
     by nickname, else model, so two grinders are never confused.
   - A divider shows only for grinder events (not work on the machine or
     other parts), and only when the list holds at least one shot with that
     grinder; a household with two grinders sees only the dividers that
     matter to its listed shots.
   - Dividers sit between day groups' rows without breaking them: an event on
     a day with shots appears among that day's rows at its time.
   - Tapping a divider opens SCR-UNIT for that grinder. It is a list item with
     its text read aloud, not a decorative `hr`.
   - Adding or back-dating an event moves its divider at once; past shots are
     never changed.
4. No offset or re-dial prompt in the MVP (EPIC-04-03 is Next).
5. Servicing a part is a maintenance event on that part, never a new kit
   (S-02). The part stays in the same kits, so recipes stay one tap away.

**States**

| State | Design |
|---|---|
| No events | One line `maintenance.none` with `maintenance.add` secondary. |
| Save failed | Sheet stays, Notice with retry. |

**Components:** ListRow, Sheet, ChipGroup, Input, Toggle, Button, Notice.

**Design acceptance criteria**

- Logging a re-zero today is three taps: add, re-zero, save.
- The recalibration mark is text, not a colour or icon alone.
- Period dividers in SCR-SHOTS appear only for grinder events, and only for
  grinders with shots in the list.
- A divider names its grinder, the kind of work and the date, in text, and is
  quieter than a shot row (overline size, no values) so the list still reads
  as shots first.
- The current period's start is visible on SCR-UNIT without opening anything.
- Dividers mirror in right-to-left and are announced by screen readers.

**Design tasks** (`design`)

- DES-04-01-01 Design SH-MAINTENANCE and the maintenance section of SCR-UNIT.
- DES-04-01-02 Design grind period dividers in SCR-SHOTS, including two
  grinders and an event on a day with shots, and the current-period line on
  SCR-UNIT (updated round 2).

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

### Accepted and applied

PEC-01 to PEC-06 were **accepted by the Head of Product in round 2 and applied
by the epic-planner in `epics.md` revision 4**. For PEC-05 the Head of Product
chose the main proposal: users answer the capability questions, each with
"not sure"; the admin does not fill them in. The text below is kept as
proposed, for the record.

| PEC | Epic | Status | Size in revision 4 |
|---|---|---|---|
| PEC-01 | EPIC-01-01 | Accepted, applied | S to M |
| PEC-02 | EPIC-01-02 | Accepted, applied | M |
| PEC-03 | EPIC-02-02 | Accepted, applied | M |
| PEC-04 | EPIC-01-05 | Accepted, applied | S |
| PEC-05 | EPIC-01-06 | Accepted, applied (user-answered) | M to L |
| PEC-06 | EPIC-04-01 | Accepted, applied | S |

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

### New in round 2 (accepted, applied in epics revision 5)

Both came out of designing the revision 4 changes. **Both were accepted by
the Head of Product at approval and are applied in `epics.md` revision 5.**

- **PEC-07 EPIC-02-01 (with EPIC-01-02): recipes after a toolkit's machine or
  grinder changes.** Toolkit editing (PEC-02) lets a user swap the grinder or
  machine in a toolkit that has recipes. A recipe's grind (and any temperature
  or pressure step) only means something on the unit it was pinned with
  (S-02), so pulling it with one tap on the new unit would record a shot that
  never happened. Proposal: EPIC-02-01, which owns "which recipe applies now",
  treats a recipe whose grinder or machine is no longer in its toolkit as
  needing a re-dial: it is kept, shown, and offered for a pre-filled dial-in,
  but never for a one-tap pull, until a new recipe is pinned. EPIC-01-02's
  edit flow warns before such a swap. Small; no size change expected. In
  Next, EPIC-04-03 offsets could later map such recipes instead, but only for
  maintenance on the same unit, not for a different unit.
- **PEC-08 EPIC-01-06: answer capabilities later.** With "not sure" accepted,
  a user who later learns the answer has no way to give it, short of the admin.
  Proposal: a household can edit the capabilities of models it added itself
  while they are unverified, from SCR-UNIT, with the same questions. Old shots
  are unaffected. Small within L. Whether verified entries' capabilities can
  be corrected by households stays out (admin, then EPIC-06-07).

### Round 3 status

- **PEC-02, editing part: reversed** in epics revision 6 (kits never change).
  The first-kit shortcut stays.
- **PEC-07: superseded** in epics revision 6 by the fixed-kit rule. Its
  swap confirmation and needs-re-dial state are removed from this design;
  "dial in from the closest kit" (EPIC-02-01) replaces them.
- **PEC-08:** stands, as designed.

### New in round 3 (proposed, pending the Head of Product)

- **PEC-09 EPIC-02-02 (with EPIC-01-02): switch kit on the home screen and in
  the shot log.** Revision 6 leaves open which kit is current and how the user
  switches. Proposal: the current kit is the kit of the persona's last shot
  (DQ-18), and the user switches by choosing a kit, or "change a part", from
  the kit line on SCR-HOME and the kit field in SCR-LOG; the choice becomes
  current. Same pattern and cost as PEC-03. Small; no size change expected.
  It answers EPIC-01-02's and EPIC-02-02's "current kit" questions.

---

## 7a. UX concerns

- **Time to the first shot.** Before the first shot, a new user has to add a
  machine, a grinder, a kit and a bag, with two catalog searches. That's
  the opposite of "start brewing without setting anything up". The checklist,
  the first-kit shortcut (PEC-02) and return-to flows keep it to about two
  minutes, but it is still the weakest moment in the product. Seven part
  kinds make it tempting to describe everything up front; the design asks
  only for machine and grinder first, and the rest are optional rows in the
  builder.
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
- **"Not sure" degrades quietly (round 2).** Most people won't know their
  grinder's dial range or which way is coarser. The fallbacks keep logging
  working, but a grind wheel without direction captions and a 0 to 100 range
  is a weaker experience exactly where Tare promises to know your kit. The
  quiet `log.capUnknown` link and "answer later" (PEC-08) are the only nudges;
  a seed list that covers common grinders matters more than this form.
- **Toolkit swaps lose one tap (round 2).** *Superseded in round 3:* there
  are no swaps. The same effect remains in a calmer form: a new kit has no
  recipes, so each coffee and drink needs one dial-in on it before one tap
  returns. The home screen says so and starts from the closest kit.
- **Kits multiply (round 3).** Every combination is a kit, so a household
  that tries a new puck screen for a week gains a kit with no recipes, and
  going back brings the old one back. That's correct, but the kit list can
  grow. Recently used first, plus collapsing kits unused for 90 days, keeps it
  calm. Kits shown only by parts can look alike; naming is one tap away.
- **Small parts reset recipes (round 3).** Swapping only a tamper or a puck
  screen makes a new kit, so the next shot is a dial-in rather than one tap.
  Grind does carry over when the grinder is the same (DQ-20), so it's one
  quick dial-in, but users may feel it as friction for a small change. Worth
  watching in use. If it bites, the fix is in the rule (which parts define a
  kit), not the design.
- **Two clocks, one line (round 3).** Home shows only the since-opening
  clock. A freshly opened bag of old coffee reads "1 day open". That's
  correct, but the roast age is a tap away on SCR-BAG, not on Home.

## 8. Design questions for the Head of Product

Design-level questions this draft answered with an assumption. Each can be
reversed without changing the structure.

- **DQ-01** Default toolkit name. *Closed in round 3 by S-08:* a kit's name
  is optional; without one it's shown by its parts name.
- **DQ-02** Time-of-day drink: assumed the persona's most recent drink with a
  shot within 90 minutes either side of now on any of the last 14 days; else
  the most recent drink at all; else the first visible drink (Espresso).
- **DQ-03** Which coffee the home screen shows (SQ-06): assumed the
  earliest-opened open portion whose bean has a recipe for this persona and
  drink on the current kit; else the earliest-opened open portion; else the
  newest unopened portion that isn't frozen; else a bean whose only portions
  are frozen, so Pull opens SH-PORTION. *Updated round 3:* "open" excludes
  frozen portions (S-02), so an opened-then-frozen portion never becomes the
  default by itself.
- **DQ-04** Undo window: assumed 8 seconds, with no visible countdown. Undo is
  a convenience: editing stays possible, so the time limit is acceptable for
  accessibility.
- **DQ-05** Reaction later: assumed the good and off reaction can be given or
  changed from SCR-SHOT at any time (SQ-07).
- **DQ-06** Who sets "opened": assumed the first shot logged against an
  unopened portion sets its opened date to that day, and the user can also
  open a portion by hand (EPIC-03-02 open question, SQ-03). Unopened portions
  are offered in the shot log. *Round 3:* a shot on a frozen portion, picked
  by the user, is ground from frozen and doesn't set the opened date.
- **DQ-07** Starting values for a blank shot log: assumed the last measured
  shot on this kit; with none, dose 18 g, yield 36 g, time 28 s, grind at
  the middle of the grinder's range.
- **DQ-08** Defect list: not defined. A starter list is needed before
  EPIC-01-05 can be designed in full; the designer can propose one
  (DES-01-05-04).
- **DQ-09** "Ran fast" threshold: not defined; the warning is left out until
  it is.
- **DQ-10** Duplicate link found: may the user still add their own entry?
  Design supports both; the ghost "add anyway" is hidden if not.
- **DQ-11** "Not sure" capabilities. *Updated round 2:* the Head of Product
  chose user-answered questions with "not sure" (PEC-05). The shot log's
  fallbacks are specified under EPIC-01-06 ("Shot log with 'not sure'
  capabilities"): no temperature or pressure tab when control is unknown;
  grind 0 to 100, step 0.1 (or 1 for clicking dials), no direction captions
  when the coarser direction is unknown. Still to confirm: the exact fallback
  ranges.
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
- **DQ-17** (round 2, the EPIC-02-02 open question) Does a drink or coffee
  changed on the home screen stick for the next pull? Assumed: no saved
  setting. A change applies to the next pull. Once pulled, the drink sticks
  through history (the time-of-day rule picks the drink just pulled), and the
  coffee sticks because the last pulled coffee for this persona and drink wins
  over the DQ-03 default while it has an unfinished portion. A change with no
  pull resets after 30 minutes away from the home screen. Details in section
  2.3.
- **DQ-18** (round 3, EPIC-01-02 and 02-02) Which kit is current? Assumed:
  the kit of the persona's last shot (measured or one-tap); before any shot,
  the newest kit. Choosing a kit on SCR-HOME, in SCR-LOG or with
  `kit.useThis` makes it current at once, without waiting for a shot. Home
  always shows the recipe on the current kit, so a one-tap pull always uses
  the recipe's kit and the two can't disagree (PEC-09).
- **DQ-19** (round 3, EPIC-02-01) Closest kit ties: among kits with a recipe
  for this bean, persona and drink, the one with the most parts in common
  with the current kit; ties go to the most recently used kit (latest shot
  on it).
- **DQ-20** (round 3, EPIC-02-01) Grind from a closest kit with a different
  grinder: dose, yield and time pre-fill from that recipe; grind doesn't. It
  starts at this grinder's last measured value, else the middle of its range,
  and the grind tab says so (`log.grindNotCarried`), because grind doesn't
  transfer between grinders (S-01). With the same grinder, grind pre-fills
  too. Temperature and pressure carry over only with the same machine.
- **DQ-21** (round 3, EPIC-01-02) Kit builder details: one part per kind is
  assumed (one basket, one tamper and so on; machine and grinder required).
  A kit's name can be set or changed at any time, because the name is a label
  and not a part, so it doesn't change the kit. Confirm both.

---

## 9. Design tasks summary

All labelled `design`.

**Sizes (round 3, review M7).** Rough hours for one designer, including one
review iteration. "Add Storybook story" tasks are sized for the story's
states, text and axe-clean setup, not the component's production build (that
is a tech-lead task). Tasks touched in round 3 are sized for their new scope.
Order: each epic's DES tasks should land before the first build wave that
needs them (for example DES-01-01-* before wave 2, DES-01-02-* before wave 3);
the tech-lead slots them against the waves in `tasks.md` and marks any that
Phase 0 work (PR #3) already delivers as done.

| Epic | Task: hours | Epic total |
|---|---|---|
| EPIC-01-01 | DES-01-01-01: 4 · 02: 8 · 03: 4 · 04: 4 · 05: 8 · 06: 2 | 30 h |
| EPIC-01-02 | DES-01-02-01: 6 · 02: 8 · 03: 6 · 04: 8 · 05: 8 · 06: 6 | 42 h |
| EPIC-01-03 | DES-01-03-01: 8 · 02: 12 · 03: 4 · 04: 4 · 05: 4 | 32 h |
| EPIC-01-04 | DES-01-04-01: 6 · 02: 4 | 10 h |
| EPIC-01-05 | DES-01-05-01: 6 · 02: 4 · 03: 4 · 04: 2 · 05: 3 | 19 h |
| EPIC-01-06 | DES-01-06-01: 8 · 02: 4 · 03: 6 · 04: 3 · 05: 6 | 27 h |
| EPIC-02-01 | DES-02-01-01: 4 · 02: 4 · 03: 3 · 04: 4 · 05: 4 | 19 h |
| EPIC-02-02 | DES-02-02-01: 10 · 02: 6 · 03: 3 · 04: 4 · 05: 4 | 27 h |
| EPIC-02-03 | DES-02-03-01: 4 · 02: 3 | 7 h |
| EPIC-02-06 | DES-02-06-01: 6 · 02: 4 · 03: 4 | 14 h |
| EPIC-03-01 | DES-03-01-01: 4 · 02: 6 · 03: 6 | 16 h |
| EPIC-03-02 | DES-03-02-01: 4 · 02: 3 · 03: 2 | 9 h |
| EPIC-03-03 | DES-03-03-01: 4 | 4 h |
| EPIC-03-04 | DES-03-04-01: 3 · 02: 3 · 03: 2 | 8 h |
| EPIC-04-01 | DES-04-01-01: 4 · 02: 4 | 8 h |
| **MVP** | **56 tasks** | **272 h** |
| EPIC-05-03 | DES-05-03-01: 4 | 4 h |
| EPIC-02-05 | DES-02-05-01: 4 | 4 h |
| EPIC-02-04 | DES-02-04-01: 2 | 2 h |
| EPIC-03-05 | DES-03-05-01: 3 | 3 h |
| EPIC-05-01 | DES-05-01-01: 4 · 02: 3 | 7 h |
| EPIC-04-02 | DES-04-02-01: 4 | 4 h |
| EPIC-04-03 | DES-04-03-01: 6 | 6 h |
| EPIC-04-04 | DES-04-04-01: 2 | 2 h |
| **Next** | **9 tasks** | **32 h** |

MVP: 56 design tasks, 272 h (round 3 added DES-02-01-05 and redefined or
updated DES-01-02-01, 03, 04, 06, DES-01-03-05, DES-01-05-01, DES-02-02-03,
DES-03-01-01 to 03 and DES-03-03-01). Next: 9 tasks, 32 h. Later: none until
re-planned.

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

### Round 2 (2026-10-18)

- **Feedback received:** the Head of Product accepted all six proposed epic
  changes, PEC-01 to PEC-06. For PEC-05, users answer the simple capability
  questions, each with "not sure"; the admin does not fill them in. The
  epic-planner applied them in `epics.md` revision 4. No feedback on the rest
  of the design.
- **What changed** (only what revision 4 affects; all IDs kept):
  - EPIC-01-01: scope note for the app shell; interim empty state per tab
    before its epic ships; shell acceptance criteria; DES-01-01-06.
  - EPIC-01-02: the toolkit shortcut detailed (one tap with one machine and
    one grinder, offered at the end of adding the second unit); toolkit
    editing after shots exist; swap confirmation and the home screen's
    needs-re-dial state (new row in the section 2.3 states table);
    DES-01-02-06.
  - EPIC-01-05: the channelling warning, when it appears, and where it is
    reused (block and inline Notice); NC-10 gains an inline size (a variant,
    not a new component); DES-01-05-05.
  - EPIC-01-06: the capability questions and follow-ups, "not sure" on every
    one, unanswered saves as "not sure"; the shot log's "not sure" fallbacks
    (DQ-11 updated); "answer later" on SCR-UNIT; DES-01-06-05. EPIC-01-04's
    states note points to the fallbacks.
  - EPIC-02-02 and section 2.3: changing drink and coffee on the home screen
    (usual marker, in-place update, no-recipe switch); the stickiness
    assumption (new DQ-17); DES-02-02-05.
  - EPIC-04-01: grind period dividers and the current-period line specified
    (two grinders, events on a day with shots, accessibility); EPIC-02-06 now
    points to EPIC-04-01 for them; DES-04-01-02 updated.
  - Section 7: PEC-01 to PEC-06 marked accepted and applied.
  - No new components.
- **Sent to the epic-planner:** two new proposed changes, PEC-07 (recipes
  whose grinder or machine left their toolkit need a re-dial, not a one-tap
  pull; EPIC-02-01 with EPIC-01-02) and PEC-08 (a household can answer
  capabilities later for models it added; EPIC-01-06), pending the Head of
  Product.

### Approval (2026-10-18)

- **Outcome of round 2:** the Head of Product approved the design, and
  accepted PEC-07 and PEC-08; the epic-planner applies them as epics
  revision 5. No further feedback.

### Round 3 (2026-10-20, after the plan review)

- **Feedback received:** the plan review (`planning/drafts/review.md`) and
  the Head of Product's decisions on it, recorded in S-02, S-04 and S-08 and
  applied in `epics.md` revision 6:
  - kits are fixed combinations of parts (user word "kit"), with no editing
    and no retire;
  - two freshness clocks, both paused by freezing, plus an optional packing
    date;
  - "open" excludes frozen portions.
  The coordinator also asked for working assumptions on the epic-planner's
  three new kit questions. Review findings owned by the designer: M2, M7, m3
  and m4. The designer was named tiebreaker on M4.
- **What changed** (only what these affect; all IDs kept):
  - Fixed kits, EPIC-01-02: SCR-TOOLKIT is now the kit builder. The user
    picks a combination, and a live match line says whether it's an existing
    kit or a new one. SCR-KIT shows kits (current first) and parts. "Use the
    new part?" was added after adding a part, and the first-kit shortcut was
    kept. Removed: toolkit editing, the swap confirmation, the needs-re-dial
    state and every retire path, along with their acceptance criteria. Part
    kinds are now the seven in S-08. DES-01-02-01, 03, 04 and 06 were updated
    or redefined.
  - Kits elsewhere:
    - Home's kit line is a select (PEC-09).
    - There's a new home state for a kit with no recipe that starts from the
      closest kit, and a new "dial in from the closest kit" flow under
      EPIC-02-01 (DES-02-01-05).
    - The shot log's kit field, and grind handling when the grinder changes
      (DES-01-03-05).
    - The word "toolkit" was replaced by "kit" in user-facing places.
  - New DQ-18 (current kit), DQ-19 (ties), DQ-20 (grind pre-fill) and DQ-21
    (one part per kind, renaming). DQ-01 is closed by S-08.
  - Two clocks, EPIC-03-03: rewritten as a table of the two clocks and their
    phrases. Home's coffee line shows the since-opening clock instead of
    "Day 12"; SCR-BAG shows both. The estimated age was removed (B1).
    EPIC-03-01 gains the optional packing date under "other dates", and the
    only-best-before toggle was removed.
  - Frozen isn't open: SH-PORTION lists frozen portions last, marked, and a
    pick doesn't change their dates. DQ-03 and DQ-06 were updated, and the
    pantry order and EPIC-03-02 note it.
  - M2: one rule, leaving SCR-TASTE in any way saves. Removed the tab
    reference and stated edit mode as the explicit-save exception.
  - M4 (designer as tiebreaker): correcting a portion's dates is **not in the
    MVP**. It's stated in EPIC-03-02, so the story-writer can reword those
    criteria to "when a portion's dates are set".
  - M7: every DES task has an hour size (section 9). MVP is 56 tasks, 272 h;
    Next is 9 tasks, 32 h.
  - m3: section 1.1 now says only channelling uses signal in the MVP.
  - m4: the pantry's header action is hidden when empty, so there's one
    primary.
  - Section 7: PEC-02's editing part is marked reversed and PEC-07
    superseded. UX concerns updated.
  - No new components.
- **Sent to the epic-planner:** PEC-09 (switch kit on the home screen and in
  the shot log; the current kit is the kit of the last shot), pending the
  Head of Product. The M4 decision goes to the story-writer.
