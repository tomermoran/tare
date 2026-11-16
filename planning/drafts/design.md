# Tare design (approved, through round 8)

Source: `planning/drafts/epics.md` (final, revision 6, 30 epics, with the
design and plan-review amendments applied), `planning/drafts/review.md` (the
plan review), `docs/spec.md` S-01 to S-09 (S-01 and S-02 override older
sections), and the Phase 0 design system: `src/styles/tokens.css`,
`src/components/ui` (Button, Card, Input, NumberWheel), `src/components/brand`
(Logo) and `src/stories/Tokens.mdx`. `planning/drafts/stories.md` (first
version) was read for context only; this design is per epic, and stories will
be revised against it.

**Status: rounds 7 and 8 approved by the Head of Product (2026-11-15), including
DQ-44 to DQ-49, seven epics in INIT-03 (EPIC-03-07 kept) and the "Leave this
household" screen (DES-05-02-05, designed in EPIC-05-02).** Earlier "draft pending
approval" wording below describes the state before this approval.

**Round 8 (2026-11-15) applies the Head of Product's decisions and `epics.md`
revision 11** to the round-7 draft: PEC-16 to PEC-22 and DQ-29 to DQ-43 are
accepted (DQ-32 revised to a 3-day, time-weighted, cross-persona window; PEC-20
adjusted so EPIC-05-02 is Next, sequenced last); a pinned recipe remembers
"sweetened"; milk variations are custom drinks; EPIC-03-05 is split into
run-out only and the new EPIC-03-07 (Beans filters and origin). Section 5 was
approved after round 8. New questions were DQ-44 to DQ-49 (accepted).

**Round 7 (2026-11-15), approved after round 8.** The Phase 1 MVP epics
are built, so round 7 takes the nine Next epics (EPIC-02-04, 02-05, 03-05,
04-02, 04-03, 04-04, 05-01, 05-02, 05-03) from "lighter flows" to the full
detail of section 4, written against the app as built. It rewrites section 5
and adds only what it needs elsewhere: screens in 2.4, one new component
and the extensions in section 3, proposed epic changes PEC-16 to PEC-22 in
section 7, concerns in 7a, questions DQ-29 to DQ-43 in section 8, the Next
rows of section 9, and a review log entry. Sections 1, 2.1 to 2.3, 4 and 6
(apart from EPIC-05-02's pointer) are unchanged and stay approved.
**Status of rounds 1 to 6: design approved by the Head of Product after review round 3**
(PEC-09 accepted, applied in epics revision 7; Home shows both clocks).
**Round 6 applies naming and Beans decisions already made** (S-02): tabs
are Brew, Journal, Beans and Setup, and Beans has On hand and Tried
sections, with a light coffee screen. Epic placement is proposed as PEC-15.
**Round 5 applies further decisions already made** (S-02, S-05 C, S-08):
"just right" tasting with six observation tags, rules-based dial-in
suggestions in the MVP, and milk type and amount on milk drinks. Its epic
placement is proposed as PEC-10 to PEC-13. **Round 4 applies decisions the
Head of Product has already made** (not a proposal): "kit" is now "setup"; a setup is machine, grinder and basket only,
each an exact catalog model; WDT and puck screen are puck-prep checkboxes on
shots and recipes (S-02, S-08). Round 3 applies epics revision 6 (fixed setups, two freshness clocks, "open"
excludes frozen) and the review findings the designer owns (M2, M4, M7, m3,
m4). Only the affected flows changed; everything else stands as approved.
PEC-07 (accepted in round 2) is superseded by the fixed-setup rule. No GitHub
issues have been created. Nothing here is production code.

## How to read this file

- **Detail level.** MVP epics (16) have full UX flows with empty, loading and
  error states, components, design acceptance criteria and design tasks.
  **Next epics (10, rounds 7 and 8, approved) have the same detail in section 5**,
  including EPIC-05-02 (Next since `epics.md` revision 11, sequenced last) and
  EPIC-03-07. **The Later epics (6) have brief direction only**, because they will be re-planned
  before they are built.
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
- **Setup words (round 3, renamed in round 4).** Users see "setup" and
  "part"; the schema says `setups` and `ownedHardware` (S-08). The tab is
  labelled "Setup" (`nav.setup`). Screen IDs keep their stable names: SCR-KIT
  is the Setup tab, SCR-TOOLKIT is the setup builder, SCR-UNIT is a part's
  screen, SCR-UNIT-ADD adds a part. Message keys use `setup.*` for setups and
  the builder; the existing `unit.*` keys hold copy about parts (key names
  aren't shown to users).
- **Parts are named by maker and model** in every example and in the UI, for
  example a "Normcore 18 g" basket versus a "Crema Coffee 18 g" basket, never
  a bare "18 g basket" (S-02: each part is a specific catalog product).

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
  `taste.*`, `journal.*` (the Journal tab; was `shots.*` before round 6),
  `shot.*` (existing field labels, and one shot's detail), `recipe.*`,
  `beans.*` (the Beans tab; was `pantry.*` before round 6), `coffee.*` (the
  coffee screen, round 6), `bag.*`, `portion.*`, `setup.*`, `unit.*`,
  `maintenance.*`, `catalog.*`, `profile.*`, `drinks.*` (starter drink names,
  already planned as `drinks.latte` and so on), `milks.*` (starter milk
  names, round 5), `suggest.*` and `off.*` (round 5), `states.*` (shared
  loading, empty and error copy). The round-1 `defects.*` group is replaced
  by `taste.tags.*` (round 5).
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
| Brew              Journal            Beans              Setup       |
| SCR-HOME          SCR-SHOTS          SCR-PANTRY         SCR-KIT     |
|   |                 |                  |                  |         |
|   |-> SCR-LOG       |-> SCR-SHOT       |-> SCR-BAG        |-> SCR-UNIT
|   |   (new, dial-in,|     |-> SCR-LOG  |     |-> SH-PORTION-ACTIONS
|   |    fix, recipe) |        (edit)    |     |-> SCR-LOG (recipe)
|   |   |-> SCR-TASTE |-> SH-PIN         |-> SCR-BAG-ADD    |-> SCR-UNIT-ADD
|   |   |-> SH-PIN    |                  |     |-> SCR-CATALOG-PICK
|   |-> SH-PORTION    |                  |           |-> SCR-CATALOG-ADD
|   |-> SH-OFF        |                  |-> SCR-COFFEE     |
|   |                 |                  |     (Tried)      |
|   |-> SH-SELECT     |                  |                  |-> SCR-TOOLKIT
|   |-> SCR-PROFILE   |                  |                  |-> SH-MAINTENANCE
+---------------------------------------------------------------------+
```

- **Tabs (NC-01).** Four destinations, text labels only, at the bottom of the
  screen: `nav.brew` [Brew], `nav.journal` [Journal], `nav.beans` [Beans],
  `nav.setup` [Setup] (round 6, S-02). Each answers one question: what am I
  making, what did I make, what do I have, what am I making it with. Journal
  is method-neutral; single espresso entries are still "shots" everywhere
  ("Pull this shot", "Shot logged"). Screen IDs stay SCR-SHOTS (Journal) and
  SCR-PANTRY (Beans). No icons in the MVP: the design system has no icon
  set, and four short words are calmer and clearer than four pictograms. Active tab: `ink`, weight 400, with a 2 px
  `ink` bar at its top edge; inactive tabs: `ink-secondary`. The bar sits on
  `paper` with a `border-line` hairline above it. It respects the safe-area
  inset at the bottom.
- **Tasks are full screen, without the tab bar.** The shot log, tasting,
  add-a-bag, add-a-part, setup builder, catalog picker and catalog add flows
  open over the tabs with a page header (NC-02) that has a ghost `actions.cancel` at the start
  and the screen title. Leaving with changes asks once (SH-CONFIRM).
- **Profile and settings** (SCR-PROFILE) open from the persona label at the
  top of SCR-HOME, not from a tab: the MVP has almost nothing to set, and the
  persona label is where Next adds persona switching (EPIC-05-01).
- **Sheets (NC-05)** for short choices and confirmations: pick a portion, pin
  a recipe, portion actions, add maintenance, generic select.
- **Return-to.** Any flow started from inside another (add a bag from the shot
  log, add a part from the first-run checklist) returns to where it started with
  the new item selected.

### 2.2 MVP screens and sheets

| ID | Screen | Epics |
|---|---|---|
| SCR-START | Launch: logo while the account is created; error and retry | 01-01 |
| SCR-HOME | Brew: today's recipe, Pull this shot, Dial in; first-run checklist | 02-02, 02-03, 01-01, 03-03, 03-04 |
| SCR-LOG | Shot log, five modes: new, dial-in from recipe, fix an off shot, edit, enter a recipe | 01-03, 01-04, 02-03, 02-06, 02-01 |
| SCR-TASTE | Shot saved: rating, just-right questions, tags, suggestion, pin | 01-05, 02-03, 02-01 |
| SCR-SHOTS | Journal: recent shots, filtered by drink, coffee and setup (renamed round 6) | 02-06, 04-01 |
| SCR-SHOT | Shot detail | 02-06, 02-01, 01-05 |
| SCR-PANTRY | Beans: On hand (bags by state, with portions) and Tried (every coffee used) (round 6) | 03-01 to 03-04 (Tried: PEC-15) |
| SCR-COFFEE | One coffee: its recipes per setup and drink, recent shots, add a bag of it (round 6) | 03-06 (PEC-15), 02-01, 02-06 |
| SCR-BAG | Bag detail: facts, portions, recipes for this coffee | 03-01 to 03-04, 02-01 |
| SCR-BAG-ADD | Add a bag: pick coffee, then bag details | 03-01 |
| SCR-KIT | Setup tab: your setups (current first) and your parts | 01-02 |
| SCR-UNIT | Part detail: capabilities, setups it's in, maintenance | 01-02, 04-01 |
| SCR-UNIT-ADD | Add a part: kind, pick model, details | 01-02 |
| SCR-TOOLKIT | Setup builder: pick a machine, grinder and basket; Tare finds the existing setup or makes a new one | 01-02 |
| SCR-CATALOG-PICK | Catalog picker (hardware or coffee), shared | 01-02, 03-01, 01-06 |
| SCR-CATALOG-ADD | Add a missing maker, model, roaster or bean | 01-06 |
| SCR-PROFILE | Profile name and about this device | 01-01 |
| SH-SELECT | Generic single choice (setup, drink, portion, coffee) | many |
| SH-PORTION | Which bag to use, when none of this coffee is open | 02-02 |
| SH-PIN | Confirm a pin, showing what it replaces | 02-01 |
| SH-OFF | What was off? Just-right questions and tags after an off one-tap shot, with the suggestion (round 5) | 02-03, 01-05 |
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
   name, roaster, and both freshness clocks on one line (EPIC-03-03; Head of
   Product decision at round-3 approval). This replaces the ambiguous
   "Day 12".
   - Opened portion: `home.coffeeClocks` with the pattern
     ["{roastClock} · {openClock}"], for example "18 days since roast · 1 day
     open". The separator lives in the message pattern, so each locale
     orders and joins the clocks itself; nothing is hand-joined.
   - The roasting clock uses its fallback wording when there's no roast date:
     `bag.daysSincePacked` ["packed 10 days ago"], else `bag.bestBeforeIn`
     ["best before in 140 days"], else nothing.
   - Unopened portion (the next pull will open it): the roasting clock alone,
     with no opened clock, until the portion is opened.
   - A frozen portion shows `portion.agePaused` in place of the opened clock.
   Tap opens SH-SELECT with beans that have an unfinished portion. Default:
   see DQ-03.
4. **Recipe values (NC-08, large).** Grind, dose, yield and time in
   `text-display` weight 200 on a 2 x 2 grid, each with an overline label
   (`shot.grind`, `shot.dose`, `shot.yield`, `shot.time`) and its unit in
   `ink-tertiary` (large, so allowed). Ratio under dose and yield in
   `text-label` (`shot.ratio`). Temperature and pressure, if the recipe has
   them, in one `text-body` line below. **Puck prep (round 4):** when the
   recipe uses WDT or a puck screen, one quiet `text-label` `ink-secondary`
   line names it (`home.prep`, a pattern over `log.prepWdt` and
   `log.prepPuckScreen`), so the user knows the one-tap pull records it.
   Nothing shows when the recipe uses neither. **Milk (round 5):** for a milk
   drink, the same quiet line leads with the recipe's milk,
   `shot.milkLine` ["Oat, 150 ml"], since the one-tap pull copies it too.
5. **Setup line**, `text-label` `ink-secondary`, a quiet select (round 3): the
   current setup's name, or its parts name when it has none
   (`setup.partsName`, a pattern over the machine and grinder models, adding
   the basket's maker and model when another setup shares that machine and
   grinder, so two setups never look alike). The recipe shown is always
   on this setup. Tap opens SH-SELECT with the household's setups (current first,
   marked `setup.current`) and a last row `setup.changePart` that opens the setup
   builder (SCR-TOOLKIT) with return-to. Choosing a setup makes it current
   (DQ-18, PEC-09).
6. **Primary action.** `Button variant="primary" fullWidth` `home.pull`
   [Pull this shot].
7. **Secondary action.** `Button variant="ghost" fullWidth` `home.dialIn`
   [Dial in], opening SCR-LOG pre-filled from the recipe (EPIC-02-03).
8. **Footnote**, `text-label` `ink-secondary`: remaining coffee in the
   portion in use, `home.remaining` ["142 g left in this bag"] (EPIC-03-04).
   Hidden when unknown.

**Changing drink, coffee or setup (EPIC-02-02, PEC-03, revision 4; setup added
in round 3, PEC-09):**

- All three selects open SH-SELECT. The default option is marked with
  `home.usual` [usual] in `text-overline` `ink-secondary`, so the way back is
  always visible without an extra reset button.
- Choosing updates the card in place (drink title, coffee line, values,
  setup line) with a 200 ms cross-fade of the values only; the buttons
  don't move. No navigation.
- If the new drink, coffee and setup have no recipe, the card switches to the
  no-recipe state (`home.noRecipe` or `home.noRecipeOnSetup`, primary
  `home.dialIn`) in place.
- The coffee list shows beans with an unfinished portion: bean as primary,
  roaster and since-opening clock as secondary, beans that have a recipe for
  this drink on this setup first. Beans whose only unfinished portions are
  frozen show `portion.frozen` and come last.
- A setup change is not a "next pull only" change like drink and coffee: the
  chosen setup becomes current (DQ-18), because the setup is physical and stays
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
| First run, nothing set up | Checklist (NC-12) `home.firstRun.*`: 1 add your machine, grinder and basket (to SCR-UNIT-ADD), 2 add a bag of coffee (to SCR-BAG-ADD), 3 pull your first shot. Done steps show a check and `ink-secondary`; the next step is the only primary button. No drink title yet. |
| Setup and coffee, no recipe for this drink on any setup | Drink, coffee and setup lines as normal; the values grid is replaced by one sentence `home.noRecipe` [no recipe yet for this drink and coffee]; the primary button is `home.dialIn`, opening SCR-LOG with drink, coffee and setup chosen and starting values per DQ-07. This is the spec's "Dial in" in place of "Pull This Shot". |
| No recipe on this setup, but one on another setup (round 3) | The values grid is replaced by `home.noRecipeOnSetup` [no recipe on this setup yet] and one `text-label` line `home.startsFrom` naming the closest setup the dial-in starts from (DQ-19). Primary `home.dialIn` opens SCR-LOG pre-filled from that recipe (grind per DQ-20). Never a one-tap pull. |
| Recipe, but no portion of that coffee open | Normal layout. Pull opens SH-PORTION (EPIC-02-02). This includes a bean whose only opened portion is in the freezer: frozen isn't open (S-02). |
| Recipe, but the coffee is finished | Values shown in `ink-secondary`; `home.coffeeFinished` [you've finished this coffee]; primary `home.chooseCoffee` opens the coffee select; secondary `home.addBag`. |
| Pull failed | Card stays in its normal state; inline notice (NC-10, neutral) `home.pullFailed` with `actions.retry`. No shot is recorded. |
| Load failed | Inline notice `states.loadFailed` with `actions.retry`, in place of the card. |

### 2.4 Screens and sheets added by the Next epics (rounds 7 and 8, approved)

New IDs, and the existing screens each Next epic touches. Detail is in
section 5.

| ID | Screen or sheet | Epic |
|---|---|---|
| SCR-DRINKS | Your drinks: list, order, add | 02-05 |
| SCR-MILKS | Your milks: list, order, add | 02-05 |
| SH-DRINK | Edit or add a drink: name, usual milk, shown or hidden | 02-05 |
| SH-MILK | Edit or add a milk: name, dairy or plant, shown or hidden | 02-05 |
| SH-RUNOUT | How the run-out estimate was worked out | 03-05 |
| SH-DRIFT | Why this grind: the recipe's grind and each step that moved it | 04-02, 04-03, 04-04 |
| SH-OFFSET | Confirm or edit what a grinder's servicing moved (shift, and stretch) | 04-03, 04-04 |
| SCR-PEOPLE | The household's profiles: add, rename, remove, invite | 05-01, 05-02 |
| SH-PERSON | Add or edit a profile | 05-01, 05-02 |
| SH-INVITE | Create or withdraw an invite link for a profile | 05-02 |
| SCR-JOIN | Open an invite: see the profile, sign in, claim it | 05-02 |
| SH-SWITCH | Switch to the history already linked to this Google account | 05-03 |
| SH-LEAVE | Leave this household: what stays, what starts new | 05-02 |

Existing screens that change: SCR-HOME (persona select, adjusted grind line,
bag-only marker, re-dial Card, link Card), SCR-LOG (persona line, re-dial
banner, grind reason), SCR-TASTE and SH-OFF (persona line), SH-PIN (scope,
persona), SCR-SHOTS and SCR-SHOT (whose taste, persona filter), SCR-PANTRY
(run-out line, filters), SCR-BAG and SH-PORTION (bag-only marker), SCR-COFFEE
(origin), SCR-CATALOG-ADD (origin), SCR-UNIT (event rows open SH-OFFSET),
SCR-PROFILE (people, lists, account) and SH-SELECT (footer rows).

---

## 3. New components

Phase 0 has Button, Card, Input, NumberWheel and Logo. Every MVP flow below
reuses them first. These new components are needed; each gets a Storybook
story with text from `en.json`, axe checks and a right-to-left story.

| ID | Component | What it is | Why existing ones don't cover it | First used by |
|---|---|---|---|---|
| NC-01 | **TabBar** | Bottom navigation, four text tabs, active bar, safe-area aware | No navigation exists | App shell (EPIC-01-01) |
| NC-02 | **PageHeader** | Screen title (`text-h1` or `text-h2`), optional back or cancel at the start, optional action at the end | No header exists | All screens |
| NC-03 | **ListRow** | Hairline-separated row: primary text, secondary line, end slot (value, label, chevron that mirrors), whole row tappable | Card is too heavy for lists | Journal, Beans, Setup, pickers |
| NC-04 | **ChipGroup** | Single choice (radio group) or multiple choice (checkbox group) chips, `border-line-strong`, selected = `ink` fill with `on-action` text; keyboard arrows; optional numbered scale variant (1 to 5); **just-right scale variant (round 5):** five (or three, one-sided) compact chips with a stronger centre "just right" chip, end words under the outer chips, "a bit" and "much" in the accessible names; **filter variant (round 5):** a chip that shows its current value, opens a select, and when active is filled with a close Icon to remove it | No choice control exists | Reaction, rating, just-right questions, observation tags, part kind, temperature and pressure steps, bag size presets |
| NC-05 | **Sheet** | Bottom sheet on phones, centred dialog on wide screens; `paper` with a `border-line` top edge and a `surface` grabber, no shadow; scrim in `ink` at low opacity; focus trap; Escape and swipe down close | No overlay exists | SH-* |
| NC-06 | **SelectField** | Shows the current choice and opens SH-SELECT. Two looks: field (like Input, on `surface-sunken`) and quiet (text only, with a chevron, for the home screen) | Input is for typing | Log context, home drink, coffee and setup, setup builder rows |
| NC-07 | **PulledState** | The in-place result of a one-tap pull: confirmation, undo for the window, good and off chips, live-region announcement | New behaviour | SCR-HOME |
| NC-08 | **ShotValues** | Grind, dose, yield, time (and optional temperature, pressure, a milk line for milk drinks, and a puck-prep line when WDT or a puck screen was used) as a read-only group. Sizes: large (home, detail, 2 x 2 grid) and compact (one line in rows). Dose-to-yield arrow mirrors | Nothing displays a set of values | Home, Journal, bag and coffee recipes, pin sheet |
| NC-09 | **ShotDial** | The shot log's editor: a row of compact value tabs (grind, dose, yield, time, plus temperature and pressure when the machine has them) above one full NumberWheel for the selected value. Shows the starting value under any changed value ("was 18.0"). Optional values have an unset state | Four stacked 96 px wheels don't fit a phone screen; optional values need "unset" | SCR-LOG |
| NC-10 | **Notice** | Inline message: neutral (ink on `surface`, for errors, info, empty results) or warning (`signal` on `signal-subtle`, shot warnings only, enforced by the API: the warning tone only takes a shot-warning kind). Two sizes: block (detail and tasting screens) and inline (one line of `signal` text with no fill, for list rows) | Nothing exists; keeps signal use auditable | Errors everywhere; shot warnings |
| NC-11 | **Skeleton** | `surface-sunken` blocks with `radius-sm`, a slow opacity pulse that stops under reduced motion; `aria-busy` on the region | Loading states | All data screens |
| NC-12 | **EmptyState** and **Checklist** | Empty state: `text-h2` line, one `text-body` sentence, one action. Checklist: numbered steps with done, next and later states | Empty and first-run states | All lists; first run |
| NC-13 | **Toggle** | On or off switch with a visible label, `role="switch"` | No boolean control exists | Sweetened, puck prep (WDT, puck screen), recalibration, freeze the new portion |
| NC-14 | **Icon** (minimal) | Four strokes drawn like the Logo (round caps, `currentColor`): chevron, check, plus, close. Chevron mirrors in right-to-left | No icons exist; text alone doesn't work for a row chevron or a sheet close | ListRow, Sheet, Checklist |
| NC-15 | **Meter** | A 2 px hairline track (`line`) with an `ink` fill, for remaining coffee; `role="meter"` with a text value | New display | Beans, bag |
| NC-16 | **SuggestionCard** (round 5) | One suggested change for the next shot: overline, the change as a short sentence with the dial values, a one-line reason, an optional freshness line, and dismiss. Outline Card, ink only, never `signal`; polite live region so updates are announced | A suggestion combines rule output, values and actions in one recurring unit on two screens; a plain Card would be rebuilt twice | SCR-TASTE, SH-OFF |
| NC-17 | **ReorderList** (round 7, **new**, draft) | A list of ListRows with a "reorder" mode: each row gets move-up and move-down icon buttons (44 px), the first and last disable the impossible one, focus stays on the button just used, and a polite live region says the new place ("Latte, 2 of 9"). No dragging, so it works with a keyboard, a switch and a screen reader | Two screens need identical accessible reordering (drinks and milks) and the focus and announcement behaviour is fiddly enough that it should be built and tested once; ListRow alone has no such mode | SCR-DRINKS, SCR-MILKS (EPIC-02-05) |

**Extensions to existing components** (flagged, not new):

- **NumberWheel**: optional end captions for grinders (`unit.finer` and
  `unit.coarser` under the ruler's ends, placed by the grinder's declared
  `coarser` direction), so "which way is finer" is never a guess. Also a
  `fahrenheit` unit (add to `CanonicalUnit` in `src/lib/units.ts`) for
  machines that display °F (INIT-01 Q5, display only). Round 5: a
  `milliliter` unit (also added to `CanonicalUnit`) for the milk amount.
- **Input**: used with `type="date"` and `type="url"` and
  `inputMode="decimal"`; add stories for these. No new component.
- **Card**: no change. Used for home recipe, setups and bags.

**Extensions needed by the Next epics (rounds 7 and 8, approved; flagged, not new):**

- **Toggle**: optional `disabled` with a reason line under it (`hint`). The
  last visible drink or milk can't be hidden, and a disabled switch must say
  why (EPIC-02-05). Today's Toggle has neither.
- **Icon**: two more strokes, `up` and `down`, for ReorderList (EPIC-02-05).
  They are block directions and don't mirror.
- **NumberWheel**: a `percent` unit (add to `CanonicalUnit` in
  `src/lib/units.ts`, display only) for the stretch (EPIC-04-04). Signed ranges
  already work (`min` and `max` are free); add a story with a negative range for
  the shift (EPIC-04-03).
- **Input**: a read-only story with a copy button beside it, for the invite
  link (EPIC-05-02). No new component.
- **PinSheet** (the screen-level SH-PIN): a scope ChipGroup (EPIC-02-04) and an
  optional persona line (EPIC-05-01). Not a design-system component.
- **FilterChips**: reused as it is by the Beans filters (EPIC-03-07) and the
  Journal's persona chip (EPIC-05-01).
- **Notice**: unchanged. It carries one action; the cases that need two
  actions use a Card (re-dial, link prompt).

**Not needed**: no tooltips, no tabs component inside screens, no charts, no
avatars, no badges in colour. Markers such as `journal.oneTap` [One tap],
`catalog.addedByYou` [Added by you] and `bag.fromFrozen` [From frozen] are
plain `text-overline` text in `ink-secondary`.

---

## 4. MVP epics (full detail)

### INIT-01: Log a shot against your real setup in seconds

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
   `app.wordmark`. The account, household, default persona, starter drinks
   and (round 5) starter milks are created behind it. No sign-in, no survey, no welcome carousel.
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

#### EPIC-01-02: Describe your setup once

**Fixed setups (round 3; parts narrowed in round 4, S-02 and S-08).** A setup
is a fixed combination of the three parts that change the recipe: machine,
grinder and basket. Each is an exact catalog product (maker and model), so a
setup with a Normcore 18 g basket and one with a Crema Coffee 18 g basket are
different setups. Portafilter, tamper, scale and prep tools are not parts and
aren't tracked as hardware; WDT and puck screen use are puck-prep checkboxes on
the shot (EPIC-01-03). Any change of parts is a different setup, and the same
combination brings back its existing setup and recipes. Setups are never
edited and nothing is retired. The round-2 editing, swap confirmation and
needs-re-dial state stay removed (PEC-07 superseded). "Changing a part" means
picking a combination in the setup builder, and Tare finds or makes the setup.

**UX flow: add a part (SCR-UNIT-ADD)**

1. From SCR-KIT `setup.addPart`, from the setup builder's `setup.addPart` row
   (kind preset), or from the first-run checklist.
2. **Kind**: ChipGroup `setup.kind.*` with three kinds: machine, grinder,
   basket. From the checklist the kind is preset to machine, then grinder,
   then basket.
3. **Pick the model** in SCR-CATALOG-PICK (hardware): one search field
   (Input, `catalog.search`) that matches makers, models and aliases.
   - With no query: makers as ListRows, alphabetical; tap a maker to see its
     models of the chosen kind.
   - With a query: models directly, `model` as the primary text, maker as the
     secondary line, so one search usually finds the model.
   - The household's own unverified entries appear with `catalog.addedByYou`.
   - A merged entry shows only its surviving entry.
   - **Baskets (round 4):** results always show maker and model, for example
     "Normcore 18 g" and "Crema Coffee 18 g", never a bare size. With no
     query, the baskets made by the household's machine maker come first
     under `setup.stockBaskets` [made for your machine], because many people
     use the basket that came with the machine and may not know its model
     (DQ-22).
   - Last row always: `catalog.cantFind` [Can't find it? Add it], to
     SCR-CATALOG-ADD (EPIC-01-06).
4. **Details**: `unit.nickname` (Input, optional) and `unit.acquired`
   (Input, date, optional). For machines and grinders, a capabilities summary
   in `text-label`, read-only (for example "temperature: exact, 85 to 100 °C"
   composed from keys). For baskets, its dose range (round-6 addendum;
   every seeded basket has one, curated by the Head of Product as admin).
5. Save. Back to where the user came from (return-to).
6. **Use the new part?** When a household that already has a setup adds a part
   from SCR-KIT, the flow ends on one quiet offer, `setup.useNewPart` [use it in
   your setup?]: primary opens the setup builder pre-filled with the current setup
   plus the new part (replacing the part of the same kind); ghost
   `setup.notNow` returns to SCR-KIT. Adding a part never changes a setup by
   itself.
7. **First setup shortcut** (PEC-02, kept; three parts from round 4). When
   the household has at least one machine, one grinder and one basket and no
   setup, a Card on SCR-KIT (and the checklist's first step on SCR-HOME)
   offers `setup.suggest` [make these your setup], naming the three parts it
   will use by maker and model.
   - With exactly one of each: one primary tap makes the setup from those
     three parts, with no name (shown by its parts name, S-08), and lands back
     where the user was with a short confirmation. No form.
   - With more than one of any kind: the tap opens the setup builder with the
     most recently added part of each kind preselected.
   - Right after the user adds their third required part (whichever comes
     last), the add-a-part flow ends on this offer instead of SCR-KIT, so the
     first setup is never a separate errand. The checklist walks machine,
     grinder, basket in one pass, so this is usually straight after the
     basket.
   - The offer disappears once any setup exists. The new setup becomes current.

**UX flow: setup builder (SCR-TOOLKIT, round 3)**

The one place setups are made or found. Opened from SCR-KIT (`setup.new`, or
`setup.changePart` on a setup's Card), from the setup select on SCR-HOME or SCR-LOG
(`setup.changePart`), from "use the new part?" (step 6) and from the shortcut
when there's a choice. It is "which parts are you using now?", never "edit
this setup".

1. Header `setup.builderTitle` [which parts are you using?].
2. **Three rows** (round 4), in a fixed order: machine, grinder, basket. Each
   row is a SelectField (field look) listing the household's parts of that
   kind by maker and model; every list ends with `setup.addPart`, which opens
   SCR-UNIT-ADD with that kind preset and returns here with the new part
   chosen. All three are required, one each (S-02); there is no "none".
3. **Starting point.** From a setup's `setup.changePart`: that setup's parts, so
   the user changes only the row that changed. From `setup.new`: the current
   setup's parts. From "use the new part?": the current setup with the new part
   swapped in.
4. **Match line**, live under the rows (polite live region, `text-body`):
   - the combination already exists: `setup.matchFound` [this is your setup
     "<name>"], with its recipe count (`setup.recipeCount`);
   - it doesn't: `setup.newSetup` [this will be a new setup], and when another setup
     shares parts, `setup.closest` [recipes on "<closest setup>" will give your
     dial-in a head start] (DQ-19).
   Matching is by the exact set of parts (S-08 `partsKey`), so it is
   instant; no loading state.
5. **Name** (new setup only): a disclosure `setup.addName` reveals `setup.name`
   (Input, optional). Without a name the setup is shown by its parts name.
6. **Primary**: `setup.useThis` when it matches, `setup.makeThis` when it's new.
   Either way the result becomes the current setup (DQ-18) and the user returns
   where they came from, with that setup chosen.
7. If any of the three is missing on save, the row is named in a neutral
   Notice; the button stays enabled, so the rule is explained, not hidden.

**UX flow: setups and parts (SCR-KIT, SCR-UNIT)**

- SCR-KIT, section `setup.setups`: one Card per setup. The current setup comes first,
  marked `setup.current` (overline); the rest follow by last used. Card: setup
  name or parts name (`text-h3`), its three parts in kind order, each by maker
  and model (`text-label`; for example machine, grinder, then "Normcore 18 g"),
  `setup.recipeCount` and `setup.lastUsed`. Actions: on the current setup,
  `setup.changePart` (secondary); on the others, `setup.useThis` (secondary,
  makes it current) and `setup.changePart` (ghost). A ghost `setup.rename` opens a
  sheet with `setup.name` (the name is a label, not a part, so naming doesn't
  change the setup; DQ-21). Setups not used for 90 days collapse under
  `setup.older`.
- Section `setup.parts`: the household's parts grouped by the three kinds
  (ListRows: nickname or model, maker and model as secondary), each opening
  SCR-UNIT.
  Header action `setup.addPart` (secondary).
- SCR-UNIT (a part): model and maker, nickname, acquired date, capabilities
  (machines and grinders), the setups it's in (`unit.inSetups`), and maintenance
  (EPIC-04-01). No retire: a part the household stops using simply isn't in
  its current setup any more (S-02).
- Servicing a part (new burrs, a clean) is a maintenance event on SCR-UNIT,
  never a new setup (EPIC-04-01). Replacing a part with a different one is a
  new combination, made in the setup builder.

**States**

| State | Design |
|---|---|
| No parts | EmptyState `setup.empty` with one primary `setup.addMachine`; the header's `setup.addPart` is hidden, so there is one primary. |
| Parts but no setup | Setups section shows the shortcut Card (step 7). |
| Catalog search, no match | Notice (neutral) `catalog.noMatch` with the query echoed, and `catalog.cantFind` as a secondary button. |
| Catalog loading | Skeleton rows. |
| Save failed | Values kept, Notice with retry. |

**Components:** Button, Input, Card, PageHeader, ListRow (NC-03), ChipGroup
(NC-04), SelectField (NC-06), Sheet (NC-05), Notice, Skeleton, EmptyState,
Icon (NC-14). No new component: the builder is SelectField rows plus a text
match line.

**Design acceptance criteria**

- A first-time user can go from SCR-HOME to a first setup (machine, grinder,
  basket, setup) in at most 16 taps, without typing more than search terms.
- Only three part kinds exist anywhere (machine, grinder, basket); no screen
  offers portafilter, tamper, puck screen or distribution tool as parts.
- Every part is shown by maker and model, never by a bare size or category.
- Search finds a model by alias in one query; results show maker and model
  together.
- Unverified entries are marked by text only (`catalog.addedByYou`), not by
  colour.
- Setup rules are explained before or at save, never by silently disabling the
  button.
- With one machine, one grinder and one basket, the first setup takes exactly
  one tap after adding the third part, with no typing.
- Nowhere offers to edit a setup's parts; every change of parts goes through
  the builder and lands on an existing or a new setup.
- The builder says before saving whether the combination is an existing setup
  (by name, with its recipes) or a new one.
- Going back to a previous combination of parts brings back that setup and its
  recipes, with no duplicate setup.
- Changing one part from a setup's Card takes: change a part, pick the new
  part, use or make the setup. Three taps when the part is already owned.
- There is no retire action anywhere; past shots always show the setup and
  parts they were pulled with.

**Design tasks** (`design`)

- DES-01-02-01 Wireframe the add-a-part flow, including the first-setup
  shortcut and "use the new part?" (updated round 3).
- DES-01-02-02 Design SCR-CATALOG-PICK for hardware and coffee (shared), with
  search, two-level browse and no-match states.
- DES-01-02-03 Design SCR-KIT (setups with the current marker, parts) and
  SCR-UNIT (a part) (updated round 3).
- DES-01-02-04 Design SCR-TOOLKIT as the setup builder: the three part rows,
  starting points, the live match line (updated rounds 3 and 4).
- DES-01-02-05 Add Storybook stories for ListRow (NC-03), ChipGroup (NC-04),
  Icon (NC-14) and Sheet (NC-05).
- DES-01-02-06 Design the one-tap first-setup shortcut and the setup select on
  SCR-HOME and SCR-LOG, with its `setup.changePart` row (redefined round 3;
  replaces round 2's editing and swap work).

#### EPIC-01-03: Log a shot in seconds

**UX flow: SCR-LOG, new shot**

The shot log is one full-screen task, laid out so a shot is saved in seconds:

1. **Header** (NC-02): ghost `actions.cancel` at the start, title `log.title`
   (mode-specific, see below).
2. **Context**, three SelectFields (NC-06, field look) in one compact block:
   `log.setup`, `log.drink`, `log.coffee`. They arrive pre-chosen: setup = the
   current setup (DQ-18), drink = the home screen's drink, coffee = the home
   screen's coffee portion. Most shots never touch them. The setup options are
   the household's setups plus `setup.changePart` (the setup builder, return-to).
   The coffee options are unfinished portions, named by bean, with bag, state
   and since-opening clock as the secondary line; unopened portions are
   offered (DQ-06), and frozen ones come last, marked `portion.frozen`.
   - Changing the setup here keeps dose, yield and time. Grind keeps its value
     only if the new setup has the same grinder; otherwise it moves to that
     grinder's last measured value, or the middle of its range (grind doesn't
     transfer between grinders, S-01).
3. **ShotDial (NC-09).** A row of compact value tabs, each showing its overline
   label and current value in `text-h3`: grind, dose, yield, time. Tapping a
   tab shows its full NumberWheel below (96 px value, ruler, typed entry).
   The first tab is selected on open. The ruler scrolls with drag, flick,
   keyboard and typed entry, exactly as Phase 0 built it.
   - **Grind** follows the setup grinder's declared scale: stepped grinders use the
     grinder's step; stepless use its finest increment. End captions show
     finer and coarser per the grinder's `coarser` direction.
   - **Dose** grams, step 0.1. **Yield** grams, step 0.1. **Time** seconds,
     step 0.1 (stored in ms). Ratio (`shot.ratio`) shown under the tabs and
     updated live.
   - Starting values for a blank log: the last measured shot on this setup,
     or neutral defaults (DQ-07).
4. **Puck prep and sweetened (round 4).** One compact block of three Toggles
   (NC-13) under the dial, in this order: `log.prepWdt` [WDT],
   `log.prepPuckScreen` [Puck screen], then `log.sweetened`. The first two
   sit under a `text-overline` `ink-secondary` label `log.prep` [puck prep],
   so they read as one group and stay separate from sweetened, which is about
   the drink, not the puck. They record whether the prep was used, not which
   tool (S-02).
   - **Starting values:** the recipe's prep in the modes that start from a
     recipe (dial in, fix, enter a recipe, and the closest-setup dial-in); the
     saved shot's prep in edit mode; otherwise the last shot on this setup;
     with no shot on this setup, both off.
   - Changing the setup in the context block re-applies that rule to any prep
     Toggle the user hasn't touched; a touched Toggle keeps its value.
   - Sweetened always starts off (it's per drink, not per recipe).
   - **Milk (round 5, milk drinks only).** For a drink type with milk, the
     context block gains a fourth SelectField, `log.milk`, under the drink:
     the household's milk list in SH-SELECT (starter list: whole,
     semi-skimmed, skimmed, oat, soy, almond, lactose-free, as `milks.*`).
     The amount is a ShotDial tab, `log.milkAmount`, after the shot values
     and any temperature and pressure tabs: a NumberWheel in millilitres,
     step 10, range 0 to 500 (DQ-26). A wheel, not an Input, keeps the log
     free of text keyboards and reuses the dial; it's the "small NumberWheel"
     option, sized like the other tabs.
     - Starting values: the recipe's milk type and amount in recipe-based
       modes; the saved shot's in edit mode; otherwise the type from the last
       shot of this drink, else the first visible milk, and the amount from
       the drink's typical amount (`typicalMilkMl`).
     - Changing the drink to one without milk hides the field and the tab;
       changing to another milk drink re-applies the starting rule to
       untouched milk values.
     - Not in the MVP: milk temperature, and editing the milk list (Next,
       PEC-13).
5. **Save**: primary `log.save`, full width, pinned to the bottom of the
   screen above the safe area so it's reachable with a thumb.
6. Saved: go to SCR-TASTE (EPIC-01-05). Shot is already saved; tasting is
   optional.

**Missing context** (no setup, no coffee): the matching SelectField shows
`log.missingSetup` or `log.missingCoffee` and opens the add flow
(SCR-TOOLKIT, SCR-BAG-ADD) with return-to. The dial still works, so values
aren't lost while adding.

**Modes of SCR-LOG** (same screen, different title and starting values):

| Mode | Title key | Starting values | Save does | Epic |
|---|---|---|---|---|
| New | `log.titleNew` | Last shot or defaults | Saves a measured shot | 01-03 |
| Dial in from recipe | `log.titleDialIn` | The pinned recipe on this setup; on a setup without one, the closest setup's recipe (DQ-19, grind per DQ-20) | Saves a measured shot | 02-03, 02-01 |
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
- Milk appears only for drinks with milk, starts from the recipe or the
  drink's typical amount, and never needs a keyboard.
- Puck prep is two labelled switches, each operable in one tap and announced
  with its label and state; they start from the recipe (or the last shot on
  this setup) so the usual case needs no tap.
- The prep, sweetened and Save controls fit on 375 x 667 with the dial; the
  toggle block may scroll under the pinned Save, but never hides it.

**Design tasks** (`design`)

- DES-01-03-01 Wireframe the shot log flow (new shot) on a 375 x 667 and a
  430 x 932 viewport, including the puck-prep and sweetened block (updated
  round 4).
- DES-01-03-02 Design ShotDial (NC-09): compact tabs, selected state, "was"
  value, unset state; add its Storybook story.
- DES-01-03-03 Add NumberWheel end captions (finer and coarser) and a
  Fahrenheit story.
- DES-01-03-04 Add Storybook stories for SelectField (NC-06) and Toggle
  (NC-13), including the puck-prep group (updated round 4).
- DES-01-03-05 Design the missing-context and return-to paths, and the setup
  select with grind handling when the grinder changes (updated round 3).
- DES-01-03-06 Design milk in the shot log (milk field, amount tab, starting
  rules) and the milk line in ShotValues, SCR-SHOT, SCR-SHOTS rows, SH-PIN
  and Home; write copy direction for the starter milk list (round 5).

#### EPIC-01-04: Record temperature and pressure when your machine has them

**UX flow**

ShotDial gains extra tabs only when the setup's machine declares them:

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

**Round 5: "just right" tasting (S-02, applied decision).** Taste is recorded
against the persona's own ideal, not as absolute scores. The round-1 four
1-to-5 scores (sweetness, acidity, bitterness, body) and the defect list are
replaced by four "just right" questions and six observation tags. The overall
rating stays. Channelling stays the only signal-coloured warning. DQ-08
(defect list) is closed by the spec.

**UX flow: SCR-TASTE (after saving a measured shot)**

The design goal is seconds, not a form: one or two taps for most shots, and
nothing is ever required.

1. Header `taste.title` [shot saved] in `text-h2`, with the compact
   ShotValues (NC-08) of the saved shot underneath, so the user sees what
   they're rating.
2. **Overall**: ChipGroup numbered scale 1 to 5, `taste.rating`.
3. **"Just right" questions**: four rows, each a just-right scale (the
   ChipGroup just-right variant, NC-04, round 5). A row is a label at the
   start, then five compact chips in one line, with the end words in
   `text-label` `ink-secondary` under the outer chips. The centre chip reads
   `taste.justRight` [just right] and is drawn a step stronger
   (`line-strong` outline) as the resting point, so the eye lands there.
   Nothing is selected until tapped: an untouched row saves nothing, which is
   not the same as "just right".

   | Row | Key | Start end | Centre | End end | Points |
   |---|---|---|---|---|---|
   | Balance | `taste.balance` | `taste.balance.sour` [too sour] | just right | `taste.balance.bitter` [too bitter] | 5 (-2 to +2) |
   | Strength | `taste.strength` | `taste.strength.weak` [too weak] | just right | `taste.strength.strong` [too strong] | 5 |
   | Strength, milk drinks | `taste.strength` | `taste.strength.lost` [lost in the milk] | just right | `taste.strength.overpowering` [overpowering] | 5 |
   | Body | `taste.body` | `taste.body.thin` [too thin] | just right | `taste.body.heavy` [too heavy] | 5 |
   | Sweetness | `taste.sweetness` | `taste.sweetness.not` [not sweet enough] | just right | none | 3 (-2 to 0), one-sided |

   The two chips either side of the centre are "a bit" and "much"; their
   accessible names say so (`taste.aBit`, `taste.much` with the end word),
   while the chips themselves are unlabelled dots of increasing size, so a
   row stays one line on 375 px.
   - **`taste.allJustRight`** [all just right]: a ghost chip above the four
     rows that sets all four to just right in one tap (each can still be
     changed). The easy path for a good shot.
4. **Observations**: a multi-choice ChipGroup of six tags, `taste.tags.*`:
   `sourAndBitter` [sour and bitter at once], `dryFinish` [dry finish],
   `flat` [flat], `burnt` [burnt], `littleCrema` [little crema],
   `channelling` [channelling seen]. They describe, they don't judge, so
   they sit under a quieter overline `taste.observed` [noticed anything?].
5. **Shot warning** (PEC-04): when `channelling` is tagged, a block Notice in
   the warning tone, `shot.warnings.channelling`, appears directly under the
   tags (no layout jump above the user's thumb); untagging removes it. No
   other tag or answer uses `signal`. "Ran fast" is never a warning; it is
   only part of a suggestion's reason (DQ-09).
6. **Suggestion** (round 5, EPIC-02-03): as soon as an answer or tag gives
   Tare a lever, a SuggestionCard (NC-16) appears above the actions with one
   change and a one-line reason, and updates live as answers change. With no
   lever but a freshness explanation, the card shows only the explanation.
   With nothing to say, there's no card. Full rules under EPIC-02-03.
7. **Actions** (one primary, chosen by what the user said):
   - A suggestion is showing: primary `suggest.tryIt` [dial in with this
     change], which saves the tasting and opens SCR-LOG in dial-in mode
     pre-filled with this shot plus the change. Secondary `taste.done`;
     ghost `recipe.pin` is still available.
   - No suggestion, in fix and dial-in modes: primary `recipe.pin`, secondary
     `taste.done` (pinning is why the user came).
   - No suggestion, otherwise: primary `taste.done`, secondary `recipe.pin`.
   - The SuggestionCard's own ghost `suggest.dismiss` hides it; the primary
     falls back as if there were no suggestion.
8. Everything is optional. Done with nothing chosen saves nothing more.

**The seconds budget.** A good shot: rating, all just right, Done (three
taps), or just Done. A sour shot: one tap on Balance, then "dial in with this
change" (two taps). The primary is pinned to the bottom, so it's never more
than one scroll away. The tags are the only part that may need a scroll on
375 x 667, and they are the least-needed part.

**Where the warning appears.** This epic owns the warning; other screens reuse
it, never restyle it:

| Place | Form |
|---|---|
| SCR-TASTE | Block Notice under the tags, on tagging |
| SH-OFF (round 5) | Block Notice under the tags, on tagging |
| SCR-SHOT | Block Notice under the values |
| SCR-SHOTS rows | Inline Notice: one line of `signal` text, after the markers |
| SCR-LOG edit mode | Block Notice under the tags, as on SCR-TASTE |

Nowhere else uses `signal`. The tag chip itself stays monochrome when
selected, like every other chip: the warning is the Notice, not the chip.

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

**Components:** ChipGroup (NC-04: numbered scale, just-right scale, multi),
ShotValues (NC-08), Notice (warning tone, NC-10), SuggestionCard (NC-16,
new in round 5), Button.

**Design acceptance criteria**

- Tasting never blocks saving a shot, and never appears before Save.
- A good shot can be recorded in at most three taps (rating, all just right,
  Done); a single off answer reaches a suggested next shot in two taps.
- No question is required, and an untouched scale saves nothing (never a
  silent "just right").
- Each just-right row fits on one line at 375 px wide, with end words that
  mirror in right-to-left (the sour end is at the inline start in both
  directions).
- For milk drinks, Strength uses the milk wording; nothing else changes.
- No flavour-note question is asked (S-02).
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
- The screen fits without scrolling on 430 x 932; on 375 x 667, the tags may
  scroll but the primary action stays visible.

**Design tasks** (`design`)

- DES-01-05-01 Wireframe SCR-TASTE in normal, fix and dial-in modes, with
  the leaving-saves rule and its failure state, the just-right rows, tags,
  "all just right" and the adaptive primary (updated rounds 3 and 5).
- DES-01-05-02 Design the numbered-scale and just-right ChipGroup variants
  and their stories, including the one-sided sweetness row and right-to-left
  (updated round 5).
- DES-01-05-03 Design Notice (NC-10) warning tone and the rule that limits it
  to shot warnings; add stories.
- DES-01-05-04 Write copy direction for the four just-right questions (both
  strength wordings) and the six observation tags (redefined round 5; was the
  defect list, now given by S-02).
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
   (preset from the add-a-part flow; machine, grinder or basket). A basket's
   model name includes what tells it apart, for example "18 g" in "Normcore
   18 g". For coffee: roaster (same pattern), bean name, and optional roast level (ChipGroup of the fixed list, S-09) and
   tasting notes (Input).
4. **Capabilities (machines, grinders and, from the round-6 addendum,
   baskets; in scope, PEC-05).** The user
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
   | Basket (round-6 addendum): `catalog.cap.doseQ` [how many grams is it made for?] | 14–16 g; 17–19 g; 20–22 g; other; not sure (chips, ranges formatted with `Intl`, not hand-joined) | Other (also for baskets outside the chips, such as 7–10 g singles or 23 g and up): lowest and highest grams (two Inputs, decimal, optional; empty saves as not sure) |

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
| Basket dose range (round-6 addendum) | Nothing changes in the shot log (the dose wheel keeps its normal range). A dose change is never suggested: the suggestion skips dose and moves to the next lever. The reason line is the next lever's own and doesn't mention dose. There is no link on the card. The user sets the range from the basket's part details (link dropped 2026-11-03, see Round 7). |

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
- A machine, grinder or basket can be saved with every capability question
  unanswered, and the shot log still works for it.
- A basket's dose range is one compact question: a chip for a common range,
  "other" or "not sure". It can be answered later, like the others (PEC-08).
- Follow-up questions appear only when an answer needs them; a machine with
  no temperature or pressure control is two taps.
- With "not sure" about the coarser direction, the grind wheel shows no
  direction captions, never a guessed one.
- No "not sure" fallback ever shows as a warning or uses `signal`.

**Design tasks** (`design`)

- DES-01-06-01 Wireframe SCR-CATALOG-ADD for hardware and for coffee.
- DES-01-06-02 Design the duplicate-found state and its two outcomes.
- DES-01-06-03 Design the capability questions and follow-ups, with copy
  direction for the story writer, including the basket dose-range question
  (updated round-6 addendum).
- DES-01-06-04 Design the repeatable links and other names rows.
- DES-01-06-05 Design the shot log's "not sure" fallbacks, the
  `log.capUnknown` link, and the "answer later" capabilities on SCR-UNIT; add
  ShotDial stories for a fully "not sure" grinder and machine (round 2), and
  the "no basket range" dose suggestion and answer-later path for baskets
  (updated round-6 addendum).

### INIT-02: Every new bag starts from what you already learned

#### EPIC-02-01: Pin the recipe that worked

**UX flow: pin from a shot**

1. From SCR-TASTE (`recipe.pin`) or SCR-SHOT (`recipe.pin`, measured shots
   only; one-tap shots don't show it).
2. SH-PIN opens: `recipe.pinTitle` naming drink, coffee and setup; the new
   values (ShotValues compact, with the milk line for milk drinks, round 5,
   and the puck-prep line when WDT or a puck screen was used, round 4); and, if a recipe exists, the current one above
   it in `ink-secondary` with `recipe.replaces`. A prep difference between
   the two shows like any other changed value. Primary `recipe.confirmPin`.
   The recipe stores the shot's prep and milk, and one-tap pulls copy them
   (S-02).
3. Confirmed: sheet closes; a short confirmation in place (`recipe.pinned`,
   live region). The home screen now shows this recipe.

**UX flow: pin by entering values**

1. From SCR-BAG, section `bag.recipes`: `recipe.add`.
2. SCR-LOG in recipe mode: context is drink and setup (the coffee is this
   bag's bean), then ShotDial, then primary `recipe.pinThis` which opens
   SH-PIN. No shot is saved.

**UX flow: see recipes**

- SCR-BAG, section `bag.recipes` [recipes for this coffee]: one ListRow per
  drink and setup with compact ShotValues and the date pinned. Tap: actions
  `recipe.dialIn` (SCR-LOG pre-filled) and `recipe.edit` (recipe mode).
- SCR-HOME shows the current recipe for its drink and coffee on the current
  setup.
- No recipe history screen in the MVP (older pins are kept as data only).

**UX flow: dial in on a setup with no recipe (round 3, replaces PEC-07)**

Recipes belong to exactly one setup (S-02). When the current setup has no recipe
for this bean, persona and drink:

1. SCR-HOME shows `home.noRecipeOnSetup` and `home.startsFrom` naming the
   closest setup with such a recipe (section 2.3); primary `home.dialIn`. There
   is never a one-tap pull here.
2. SCR-LOG opens in dial-in mode with a one-line note `log.fromOtherSetup`
   [starting from your recipe on "<setup>"]. "Closest" means the setup with the
   most parts in common with the current setup, among setups that have a recipe
   for this bean, persona and drink; ties go to the most recently used setup
   (DQ-19).
3. **What pre-fills (DQ-20).** Dose, yield and time always come from that
   recipe. Grind comes from it only if the closest setup has the same grinder.
   Otherwise grind starts at this grinder's last measured value, or the middle
   of its range, and the grind tab shows `log.grindNotCarried` [grind starts
   fresh on this grinder], because grind doesn't transfer between grinders
   (S-01). Temperature and pressure carry over only when the machine is the
   same; otherwise they start unset. Puck prep carries over from that recipe
   (it isn't tied to a part). With only three parts, "most in common" is
   two of three; a setup that differs only in its basket is the usual closest
   one, and its grind does carry (same grinder).
4. Each pre-filled value shows its source as "was" when changed, as in fix
   mode.
5. Save, then SCR-TASTE with pin as the primary action. Pinning gives this
   setup its own recipe, and the next visit is one tap.
6. No setup with a recipe for this bean, persona and drink: a blank dial-in
   (DQ-07), as in the round-1 no-recipe state.

**States**

| State | Design |
|---|---|
| No recipes for this coffee | `bag.noRecipes` one line, with `recipe.add` secondary. |
| Pin failed | SH-PIN stays open; Notice with retry. |

**Components:** Sheet (SH-PIN), ShotValues, ListRow, ShotDial, Button.

**Design acceptance criteria**

- Before confirming, the user sees exactly what the pin applies to (drink,
  coffee, setup) and what it replaces.
- A recipe from another setup is only ever a starting point for a dial-in,
  named as such (`log.fromOtherSetup`), never pulled with one tap.
- Grind is never carried from a different grinder; the grind tab says so.
- Pin is never offered on a one-tap shot.
- Recipe mode looks like the shot log but its title and button say it pins a
  recipe, so no one thinks they logged a shot.

**Design tasks** (`design`)

- DES-02-01-01 Design SH-PIN, with and without an existing recipe, including
  the puck-prep line (updated round 4).
- DES-02-01-02 Design the recipe section of SCR-BAG.
- DES-02-01-03 Design recipe mode of SCR-LOG.
- DES-02-01-04 Add Storybook story for ShotValues (NC-08), large and compact,
  with and without temperature, pressure and puck prep (updated round 4).
- DES-02-01-05 Design the dial-in from the closest setup: the home state, the
  `log.fromOtherSetup` note and the grind-not-carried state (round 3).
- DES-02-01-06 (round 8, approved) Design sweetened on recipes: the pin sheet line
  and changes row, the toggle in enter-values pinning, pre-ticked logs from a
  recipe, recipe rows and the pulled state. Specified in section 5.0a (4 h).

#### EPIC-02-02: Pull your daily shot in one tap

**UX flow**

1. SCR-HOME shows the recipe for the persona, the drink (time-of-day default)
   and the coffee (default per DQ-03), on the current setup (DQ-18). See
   section 2.3 for layout. The setup line is a select too (round 3, PEC-09).
2. **Optional: change drink or coffee** (in scope, PEC-03). Tap the drink
   title or the coffee line; SH-SELECT opens with the usual choice marked;
   choosing updates the card in place, and the pull uses the chosen drink and
   coffee. A change applies to the next pull; whether it sticks is assumed in
   section 2.3 (DQ-17). The user can change the drink while PulledState is
   showing; that ends PulledState (the reaction stays available on the shot
   in SCR-SHOTS) and shows the new recipe ready to pull.
3. Tap `home.pull`. The shot is recorded at once (optimistic, then confirmed),
   with the recipe's values, puck prep (WDT, puck screen; round 4) and milk
   type and amount (round 5), its setup, and the earliest-opened open portion
   of the coffee. "Open" means opened, not finished and not in the freezer
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
9. **No recipe** for the drink and coffee on this setup, including after a
   change: primary becomes `home.dialIn`, pre-filled from the closest setup's
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
  history alone (DQ-17). The setup is the exception: choosing a setup makes it
  current, and the setup line always shows which setup that is.
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
   reaction is saved on the one-tap shot, and **SH-OFF** opens over the home
   screen (round 5, DQ-23): `off.title` [what was off?], the same four
   just-right rows and six tags as SCR-TASTE (no rating, the user just said
   "off"), and the SuggestionCard below them, live.
   - Primary `suggest.tryIt` (or `off.fix` [fix it] when there's no
     suggestion yet) opens SCR-LOG in fix mode with the recipe's values plus
     the suggested change. Ghost `off.skip` [skip] opens the same fix mode
     with the recipe's values only, as before round 5.
   - Answers are saved on the one-tap shot as its taste (they're judgements,
     not measurements), whichever way the sheet is left, like SCR-TASTE.
   SCR-LOG fix mode: title `log.titleFix`, the same portion, drink and setup,
   and a one-line note: `log.fromSuggestion` [suggested: grind 2 steps finer]
   when a change was applied, else `log.fromRecipe` [starting from your
   recipe].
2. The user nudges one or two wheels, or none if the suggestion is enough.
   Each changed tab shows the recipe value under it (`log.was`), so the
   adjustment is clear, including a change the suggestion made.
3. Save: a new measured shot (DQ-12, two records). SCR-TASTE opens for the
   new shot, with its adaptive primary (a new suggestion if it's still off,
   else pin).
4. **Dial in from the home screen:** `home.dialIn` with a recipe opens SCR-LOG
   in dial-in mode; same as above without a reaction or a one-tap shot. On a
   setup with no recipe, it starts from the closest setup's recipe (EPIC-02-01).
   The portion follows the one-tap rule; with no open portion, SH-PORTION
   opens first, as for a pull. When a suggestion is pending for this recipe
   (from the last tasting or SH-OFF, not dismissed), the ghost button reads
   `home.dialInSuggested` [dial in with the suggested change] and the log
   starts with the change applied.
5. **Good:** saved on the one-tap shot; chip shows selected; nothing else
   happens.
6. Leaving fix mode without saving keeps the "off" reaction and the SH-OFF
   answers, and saves nothing else.

**UX flow: the suggestion (round 5, S-02 "dial-in suggestions are rules")**

One suggested change for the next shot, with a one-line reason, pre-filled
into the next dial-in. Rules, not AI; tested with evals. Shown in two places:
SCR-TASTE (after tasting a measured shot) and SH-OFF (the off path from a
one-tap shot). Home only changes the Dial in label (step 4).

- **SuggestionCard (NC-16)**, `Card tone="outline"`, no colour:
  - overline `suggest.title` [next shot];
  - the change in `text-h3`, as a pattern per lever, for example
    `suggest.grindFiner` ["grind {steps} steps finer"] with the dial values
    under it in `text-label` ("15 → 13", tabular, arrow mirrors);
  - the reason, one line in `text-label` `ink-secondary`, a pattern over the
    answers that drove it, for example `suggest.reason` ["too sour and ran
    fast"];
  - optional freshness line (below);
  - ghost `suggest.dismiss` [not now] at the end.
- **Lever order** (S-02), first match wins, one change only:

  | Signs | Lever | Example copy |
  |---|---|---|
  | Channelling seen, sour and bitter at once, or dry finish | Puck prep first: WDT, then puck screen, if not used; if both used, grind (uneven extraction) is not suggested and the card shows `suggest.prepAlready` [prep was used; check distribution and tamping] | "Use WDT next time" |
  | Balance off | Grind, in the grinder's own direction and steps; time is a diagnostic in the reason (fast and sour, slow and bitter) | "Grind 2 steps finer" (sour, much) |
  | Strength off | Yield (shorter for weak, longer for strong); for milk drinks, dose, then milk amount | "Stop at 34 g instead of 36 g"; "Try about 30 ml less milk" |
  | Body off | Dose, within the basket's dose range (with a "not sure" range, dose is never suggested: skip to the next lever, temperature if it applies, otherwise freshness or no change; see the "not sure" table) | "Dose 0.5 g more" |
  | Balance still off and grind at its limit | Temperature, only on machines that can set it | "Brew 1 °C hotter" |

  Step size follows "a bit" (one step) or "much" (two). Grind direction uses
  the grinder's declared `coarser`; with "not sure" direction the card says
  "grind finer" without dial numbers and adds `suggest.directionUnknown`
  linking to the grinder's capabilities (EPIC-01-06). Milk amounts use the
  NumberWheel's `milliliter` formatting.
- **Freshness, an explanation, never a lever** (from the two clocks): a
  `text-label` line under the reason, for example `suggest.fresh.pastPeak`
  ["36 days since roast: likely past its peak"] or `suggest.fresh.tooFresh`
  ["3 days since roast: very fresh, may channel"]. It can appear with a
  lever or alone (then the card has no change and no "try it"). Thresholds
  are rule parameters (DQ-24).
- **Pre-fill.** "Dial in with this change" opens SCR-LOG with the shot's (or
  recipe's) values plus the change, the changed tab showing "was", and the
  `log.fromSuggestion` note. The change is never saved on its own; it only
  becomes real when the user saves the next shot.
- **Dismiss.** `suggest.dismiss` hides the card; the next dial-in starts
  without the change, and Home's label returns to `home.dialIn`
  (DQ-25 for how long a dismissal lasts).
- **No colour.** A suggestion is advice, not a warning: ink only. Channelling
  keeps its own Notice above it.

**States:** as SCR-LOG. Reaction save failure: the chip returns to unselected
with a Notice in PulledState; the fix flow still opens. SH-OFF answers that
fail to save: Notice in the sheet with retry; "skip" still opens the fix
mode. The suggestion is calculated on the device from the answers and the
shot, so it has no loading state.

**Components:** PulledState, ChipGroup, ShotDial ("was" values), Sheet
(SH-OFF), SuggestionCard (NC-16), SCR-LOG, SCR-TASTE.

**Design acceptance criteria**

- From "off" to a saved, adjusted shot is: off, one answer, "try it", save.
  Skip keeps the round-1 path: off, skip, one drag, save.
- A suggestion is always one change, with a reason the user can check
  against what they answered.
- Grind suggestions name the direction and, when known, the dial values on
  the user's own grinder; they never guess a direction.
- Puck prep is suggested before grind whenever there are channelling signs.
- Freshness never appears as a change to make, only as an explanation.
- Dismissing is one tap and leaves no trace on Home.
- Good and off are optional, equal in weight (two secondary chips, neither
  primary), and never reappear as a prompt.

**Design tasks** (`design`)

- DES-02-03-01 Wireframe the off-to-fix flow from PulledState through SH-OFF
  to SCR-TASTE (updated round 5).
- DES-02-03-02 Design the "was" value treatment in ShotDial.
- DES-02-03-03 Design SH-OFF: just-right rows and tags without a rating, the
  live suggestion, fix and skip (round 5).
- DES-02-03-04 Design SuggestionCard (NC-16) with each lever, the
  direction-unknown and freshness-only states, and dismiss; add its
  Storybook story (round 5).
- DES-02-03-05 Write the suggestion copy patterns (change, reason,
  freshness), so every lever reads as one short sentence in every locale
  (round 5).

#### EPIC-02-06: Look back in your journal

**UX flow: SCR-SHOTS (the Journal)**

1. Tab `nav.journal` [Journal]. Title `journal.title` [Journal]. (Round 6:
   the tab and title are "Journal", answering "what did I make?". The entries
   in it are still shots: "12 shots", "one-tap shot". The screen ID stays
   SCR-SHOTS.)
2. **Filters (round 5, Head of Product decision; PEC-14).** A single row of
   filter chips under the title, scrolling sideways if it overflows:
   - `journal.filterDrink` and `journal.filterCoffee`, and
     `journal.filterSetup` only when the household has more than one setup.
   - Each chip shows its current value ("Flat white", a coffee name) or
     `journal.filterAnyDrink` / `journal.filterAnyCoffee` /
     `journal.filterAnySetup` when off. Tapping opens SH-SELECT with the
     household's drinks, coffees with shots, or setups.
   - An active chip is filled (`ink` with `on-action` text) and carries a
     close Icon (NC-14) with its own accessible name
     (`journal.removeFilter`); one tap removes that filter.
   - When any filter is active, a ghost chip `journal.filterAll` [All] leads
     the row and clears every filter in one tap.
   - **Default:** each time the tab is opened from the tab bar, drink and
     coffee are pre-set to what's currently selected on SCR-HOME (including a
     change made there; DQ-17). Setup is not pre-set. With nothing selected on
     Home (first run), no filter is set. Coming back from SCR-SHOT keeps the
     filters the user left.
   - The filters always show as chips, so a short list is never a mystery:
     what's filtered is on screen, and "All" is one tap.
   - Filters apply to "show older" too. Grind period dividers still follow
     their EPIC-04-01 rule, for the grinders of the shots listed.
3. ListRows grouped by day (`journal.today`, `journal.yesterday`, then a
   formatted date as a `text-overline` group heading). Each row is one shot:
   - primary: drink and time of day (formatted);
   - secondary: coffee name, and for milk drinks the milk type and amount
     (`journal.coffeeAndMilk` pattern, round 5);
   - end: compact ShotValues (dose to yield, time; grind on a second line);
   - markers in `text-overline` `ink-secondary`: `journal.oneTap` for
     one-tap shots, the reaction (`journal.good`, `journal.off`),
     `bag.fromFrozen`;
   - the channelling warning as an inline Notice (EPIC-01-05 owns it).
   - Grind period dividers: owned by EPIC-04-01 and specified there.
4. The list shows the last 30 days, then `journal.showOlder` [show older
   shots] (DQ-13).
5. Tap a row: SCR-SHOT.

**UX flow: SCR-SHOT (shot detail)**

- ShotValues large, context (drink, coffee, and the setup with its machine,
  grinder and basket by maker and model; setups never change, so this is
  always what was used), date and time, whose taste and who logged (shown
  once sub personas exist), milk (`shot.milkLine`, milk drinks only; round
  5), puck prep (`log.prepWdt`, `log.prepPuckScreen`, shown only when used;
  round 4), sweetened, and taste if any: the rating, each just-right answer
  as a short phrase (for example "a bit sour"; untouched questions aren't
  shown) and the observation tags (round 5).
  Journal rows don't show prep, to keep them to one glance.
- Actions (updated round 5):
  - Measured shots: `recipe.pin` (primary), next to it `shot.dialInFromThis`
    [dial in from this] (secondary), and `actions.edit` (ghost).
  - One-tap shots: `actions.edit` (primary) and `shot.dialInFromThis`
    (secondary). There's no pin. A line `shot.copiedFromRecipe` explains where
    the values came from, and the reaction chips are shown so a reaction can
    be given or changed later (DQ-05).
  - **Dial in from this** opens SCR-LOG in dial-in mode pre-filled with that
    shot's values, milk and puck prep, on that shot's setup, drink and
    coffee. The portion follows the one-tap rule for that coffee (SH-PORTION
    if none is open, as for a pull), and the note `log.fromShot` [starting
    from your shot on <date>] names the source. If that setup isn't current,
    the setup field shows it and saving makes it current (DQ-18). If the
    coffee is finished, the coffee field opens on its missing-coffee state.

**UX flow: edit**

- SCR-LOG edit mode with the saved values, then the taste controls below the
  dial (in edit mode taste is on the same screen, since the user came to fix
  something specific). Only values, milk, puck prep, sweetened and taste
  change; context is read-only (SQ-08). For one-tap shots the taste controls
  are the just-right rows and tags (no rating), matching SH-OFF (DQ-23). Save `log.saveChanges`. Leave with changes: SH-CONFIRM.

**States**

| State | Design |
|---|---|
| Loading | Skeleton rows (five). |
| Empty | EmptyState `journal.empty` [no shots yet] with primary `home.dialIn` (opens SCR-LOG). No filter row. |
| Empty with filters (round 5) | EmptyState `journal.emptyFiltered` ["No shots of this drink and coffee yet"; the pattern names whichever filters are set], with primary `journal.clearFilters` that does the same as "All". The filter chips stay visible above it. |
| Load failed | Notice with retry in place of the list. |
| Older loading | Skeleton rows under the list; button disabled. |

**Components:** ListRow, ShotValues (compact and large), PageHeader,
EmptyState, Skeleton, Notice, Button, ChipGroup (with the filter variant,
round 5), Sheet (SH-SELECT), Icon (close).

**Design acceptance criteria**

- One-tap and measured shots are distinguishable by a text marker, without
  colour.
- A row is readable in one glance: drink, coffee, values, markers, in that
  order.
- Values in rows align across rows (tabular numbers, end-aligned in
  left-to-right, start-aligned mirror in right-to-left).
- Editing a one-tap shot is at most two taps from the Journal tab.
- The tab and title say "Journal"; each entry is still called a shot.
- Every active filter is visible as a chip with its own remove control, and
  "All" clears them in one tap; the list is never filtered by something the
  user can't see.
- Opening the tab shows the shots for the drink and coffee on Brew by
  default; a filtered empty list says so and offers to clear.
- The setup filter appears only for households with more than one setup.
- Filter chips are operable by keyboard and announced with their value and
  "remove" action; the row mirrors in right-to-left.
- "Dial in from this" is two taps from the list (row, then the button) and
  never saves anything by itself.

**Design tasks** (`design`)

- DES-02-06-01 Design SCR-SHOTS (the Journal), including grouping, markers,
  dividers, the filter row with its default from Brew, "All" and the
  filtered empty state (updated rounds 5 and 6).
- DES-02-06-02 Design SCR-SHOT for measured and one-tap shots, with puck
  prep, milk, parts by maker and model, and "Dial in from this" (updated
  rounds 4 and 5).
- DES-02-06-03 Design SCR-LOG edit mode with taste on the same screen.

### INIT-03: Always know what beans you have and how old they are

#### EPIC-03-01: Add a bag of beans

**UX flow: SCR-BAG-ADD**

1. From Beans (SCR-PANTRY) `beans.addBag`, the checklist, the shot log's
   coffee field, or a coffee screen's `coffee.addBag` (round 6), which
   skips step 2 with that coffee already chosen.
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

**UX flow: SCR-PANTRY (Beans, round 6)**

The Beans tab answers "what do I have?", and below that "what have I tried?"
(S-02). One scrolling screen with two sections under `text-h2` headings, On
hand first. There's no segmented control, so no new component.

- Title `beans.title` [Beans]. `beans.addBag` is a primary action in the
  header end **only when there are bags on hand**. Otherwise the header
  action is hidden and the empty state's button is the one primary (round 3,
  review m4).
- **On hand** (`beans.onHand`). Bags that aren't finished, grouped under
  three `text-overline` subheadings in this order:
  - `beans.groupOpen` [open]: a bag with any open portion. Open means opened,
    not finished and not frozen (S-02). Earliest opened first, matching the
    one-tap rule.
  - `beans.groupUnopened` [unopened]: no open portion, but at least one on
    the counter (unopened, or thawed and not yet opened).
  - `beans.groupFrozen` [frozen]: everything left is in the freezer.

  A bag appears once, in the first group it qualifies for, so a half-open,
  half-frozen bag sits under "open" and its Card shows both portions with
  their states. Each Card is as before: bean (`text-h3`), roaster and the
  since-roasting clock (`text-label`), and its portions as ListRows (state,
  since-opening clock, remaining with the Meter, NC-15). A group with no
  bags is left out.
- **Tried** (`beans.tried`, round 6, PEC-15). One ListRow per coffee the
  household has ever brewed (at least one shot, DQ-27). It's calculated, not
  stored. Newest last-had first. Each row shows:
  - primary: bean name; secondary: roaster;
  - end: when it was last had (`beans.lastHad`, relative: "today", "3 weeks
    ago") and the bag count (`beans.bagCount` [2 bags]);
  - a one-line summary of how its shots went, in `text-label`
    `ink-secondary` (`beans.summary.*`, DQ-28), for example "mostly good",
    "mixed", "last rated 4 of 5" or "no ratings yet". Text only, never a
    colour or a score badge.
  Tapping a row opens SCR-COFFEE. No filters in the MVP. **Beans filters**
  (roaster, roast level, origin, rating) are Next (S-02); see section 5.
- Finished bags no longer have their own section: they're counted in Tried,
  and each one is listed on its coffee's screen.

**UX flow: SCR-COFFEE (one coffee, round 6, designed lightly)**

- Header: bean name (`text-h1`), roaster, and the catalog's roast level and
  tasting notes when known (`text-label`). The Tried summary line sits
  under them.
- Primary `coffee.addBag` [add a bag of this] opens SCR-BAG-ADD with this
  coffee chosen (bag details only). When a bag of it is on hand, the button
  is secondary and there's no primary.
- **Recipes** (`coffee.recipes`): one ListRow per setup and drink, with
  compact ShotValues (milk and prep lines included) and the date pinned; tap
  for `recipe.dialIn` or `recipe.edit`, as on SCR-BAG (the same rows,
  EPIC-02-01). None: one line `coffee.noRecipes`.
- **Recent shots** (`coffee.recentShots`): up to five Journal rows, then
  `coffee.allShots` [all shots of this coffee], which opens the Journal with
  the coffee filter set to it (and no drink filter). None: one line.
- **Bags** (`coffee.bags`): this coffee's bags, on hand and finished, as
  ListRows (bought or roast date, state, weight), each opening SCR-BAG.
- States: loading skeleton; load failed Notice with retry. Each section has
  its own one-line empty state, so the screen never looks broken.

**States**

| State | Design |
|---|---|
| Loading | Skeleton cards (two) under On hand, skeleton rows (three) under Tried. |
| First run: nothing on hand, nothing tried | One EmptyState for the whole screen, `beans.empty` [no beans yet], with primary `beans.addBag`. No section headings. |
| No bags on hand, but coffees tried | On hand shows a compact EmptyState `beans.onHandEmpty` [nothing on hand] with primary `beans.addBag`; header action hidden. Tried shows as normal, and each coffee's screen offers "add a bag of this". |
| Bags on hand, nothing tried yet | Tried shows one `text-body` line, `beans.triedEmpty` [coffees you brew will appear here], with no action. |
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
- The On hand order matches the order the one-tap rule uses, and every bag
  appears exactly once, under open, unopened or frozen.
- The Beans screen has exactly one primary button in every state.
- Tried lists each coffee once, with last had, bag count and a summary in
  words. It can be reached and read without any filters.
- From a Tried row to adding a new bag of that coffee is three taps (row, add
  a bag, a size), plus save.
- Dates use the locale's format and the native date picker.

**Design tasks** (`design`)

- DES-03-01-01 Wireframe the add-a-bag flow, with the other-dates disclosure
  (updated round 3).
- DES-03-01-02 Design SCR-PANTRY as Beans: On hand grouped by open, unopened
  and frozen, Tried with its summary line, and the three empty states, with
  one primary in each (updated rounds 3 and 6).
- DES-03-01-03 Design SCR-BAG (facts, both clocks, portions, recipes)
  (updated round 3).
- DES-03-01-04 Design SCR-COFFEE lightly: header and summary, recipes per
  setup and drink, recent shots with the link to the filtered Journal, bags,
  and "add a bag of this" (round 6, PEC-15).

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
| Since roasting (per bag) | From the roast date; else from the packing date, labelled as packed; minus freezer time | `bag.daysSinceRoast` [18 days since roast], `bag.daysSincePacked` [packed 10 days ago] | SCR-HOME coffee line, SCR-BAG facts, bag Cards under On hand in Beans |
| Best-before only (no age) | Time left until best-before, not an age | `bag.bestBeforeIn` [best before in 140 days], `bag.bestBeforePassed` [best before passed 3 days ago] | Same places as since roasting |
| No date at all | Nothing to count | `bag.ageUnknown`, with ghost `bag.addDate` on SCR-BAG | Same places |
| Since opening (per portion) | From the portion's opened date, minus freezer time | `portion.daysOpen` [5 days open], `portion.openedToday`, `portion.notOpened` | SCR-HOME coffee line, portion rows, SH-PORTION, SCR-LOG coffee field |

- **Freezing pauses both.** A frozen portion's row shows `portion.agePaused`
  [paused in the freezer] in place of its clock. SCR-BAG adds one line per
  portion that has been frozen, `portion.frozenDays` [N days in the freezer
  not counted].
- **Home** shows both clocks on one line through the `home.coffeeClocks`
  pattern, for example "18 days since roast · 1 day open". While the portion
  is unopened it shows the roasting clock alone (section 2.3; Head of Product
  decision at round-3 approval).
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
- Bag status: open and finished shown as text on cards. Finished bags leave
  On hand and are counted under their coffee in Tried (round 6).

**States:** as Beans. Stock check failure: sheet stays, Notice with retry.

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

#### EPIC-04-01: Record maintenance on your equipment

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
     `ink-secondary` text, `journal.maintenance` [grinder name, event kind,
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
5. Servicing a part is a maintenance event on that part, never a new setup
   (S-02). The part stays in the same setups, so recipes stay one tap away.

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

## 5. Next epics (full detail, rounds 7 and 8, approved)

**Status: approved by the Head of Product after round 8 (2026-11-15).** The ten epics
(EPIC-02-04, 02-05, 03-05, 03-07, 04-02, 04-03, 04-04, 05-01, 05-02, 05-03) are
in ID order; build order is in `tasks.md` (EPIC-05-02 is last). Round 8 applies
`epics.md` revision 11: PEC-16 to PEC-22 and DQ-29 to DQ-43 are **accepted**
(DQ-32 revised; EPIC-05-02 moved from Later to Next, sequenced last), EPIC-03-05
is split, and sugar on recipes is added (5.0a). INIT-06 (AI, scanning, network
cold start) is out of scope. Each epic has: entry points, screens and sheets
touched, the flow, states, copy direction (message keys and what they say, not
final wording), components, design acceptance criteria and `design` tasks with
hours. Questions that block an epic point to section 8 (DQ-29 to DQ-49, each
with an answer or recommendation); epic changes are in section 7.

### 5.0 What these epics build on

**What shipped, checked in the code (round 7):**

- SH-PIN is `PinSheet`, driven by `usePinFlow`. Every pin is saved for the
  coffee (no bag), and the recipe readers look only at recipes with no bag.
  The `pinned_recipes` table already has an optional bag column.
- Brew keeps a drink or coffee chosen for the next pull in a device cookie
  (`readBrewChoice`, DQ-17). A chosen persona uses the same mechanism.
- SCR-PROFILE renames the household's one default persona; the persona label
  on Brew is a plain link to it. Profile has name, a device sentence and
  about.
- Beans has On hand (grouped) and Tried; no filters and no run-out line yet.
  The Journal's `FilterChips` already exist.
- SCR-UNIT lists maintenance events as plain rows (not tappable). The
  `maintenance_events` table already has the shift, stretch and source columns,
  unused. A grind period starts at **any** grinder event, a clean included
  (`currentPeriodStart`).
- The suggestion engine runs on the device from the saved shot, its recipe and
  the clocks, and shows in `SuggestionCard`. Nothing it returns is stored.
- `SelectSheet` takes one footer row. `Notice` takes one action. `Toggle` has
  no disabled state. `Icon` has chevron, back, check, plus, close and arrow.

**Patterns shared by several epics (decided once here):**

1. **The grind trail (SH-DRIFT).** One sheet, "why this grind", lists the
   recipe's grind and then every step that moved it, in order: grinder
   servicing (EPIC-04-03/04), beans have aged and this bag's character
   (EPIC-04-02), ending in the grind shown. Home, SCR-LOG and the recipe rows
   open it from one quiet line, so there is one place and one vocabulary for
   "this isn't the number you pinned".
2. **"Nothing entered yet" is the safe-to-switch test.** A household counts as
   empty when it has no parts, no bags and no shots (the starter lists don't
   count). EPIC-05-03 (switching to a linked history) and EPIC-05-02 (joining a
   household) may replace an empty household and refuse a non-empty one. Nothing
   is ever merged (DQ-40, DQ-41).
3. **At most one card on Brew.** Brew can now show a re-dial Card (04-03) or a
   link Card (05-03), never both and never beside a pulled state. Re-dial wins;
   the link Card waits. Both fit with the Pull button still visible on 375 x 667
   (checked in DES-05-03-03).
4. **Profile after the Next epics.** Top to bottom: name (as built), People
   (05-01), Your lists with Drinks and Milks (02-05), Account (05-03, replaces
   the device section), About. Rows are ListRows with a mirrored chevron and a
   one-line secondary ("Just you", "9 drinks, 2 hidden", "Not linked").
5. **Persona on Brew.** With one persona, the label opens Profile as it does
   today. With more than one it becomes the persona select (05-01). A persona
   is always shown by name where it isn't the household's main one, and never
   as "for Me".
6. **Configuration is quiet.** Lists, people and the account are set up
   rarely, so they favour clarity over speed (a sheet and a Save) and are
   reached from Profile, with a footer row in the select that needs them.

### 5.0a Sweetened on recipes (round 8, amends EPIC-02-01; Head of Product)

A pinned recipe remembers the shot's **sweetened** toggle: yes or no only, no
amount or kind of sugar. Logs started from the recipe start pre-ticked. Today
sweetened is on the shot only and always starts off (EPIC-01-03). It stays out of
the recipe's identity: a recipe is still scoped to coffee, persona, setup and
drink, so someone who sometimes sweetens unticks on those days. The recipe needs
a new column (a tech note). Existing recipes read as not sweetened. Design,
touch point by touch point:

1. **SH-PIN.** The new-recipe block's quiet lines (milk, prep) gain
   `recipe.sweetenedLine` [sweetened], shown only when it is yes (a recipe that
   is not sweetened says nothing, like prep). When it differs from the recipe
   being replaced, the "changes" list gains a row in the same words as the other
   fields (`recipe.change`, field `log.sweetened`, from "no" to "yes"). Pinning
   from a shot copies that shot's value.
2. **Enter-values pinning (SCR-LOG recipe mode).** The sweetened Toggle (NC-13)
   sits in the same block as puck prep, as in a normal log, and starts as the
   current recipe has it, else off.
3. **SCR-LOG, every mode that starts from a recipe** (dial in, fix, the
   closest-setup dial-in, enter a recipe): sweetened starts pre-ticked as the
   recipe has it. Edit mode starts from the saved shot. A blank new log still
   starts off. Changing the setup in the context block re-applies this to a
   Toggle the user hasn't touched, like prep. This replaces EPIC-01-03's "always
   starts off" for recipe-based logs.
4. **Recipe rows and Brew.** Home's quiet line under the values (where milk and
   prep already show) gains `recipe.sweetenedLine` when yes. SCR-BAG, SCR-COFFEE
   recipe rows carry the same word in their quiet line. Text
   only, nothing for "no".
5. **The one-tap pull and its pulled state.** Whether a pull copies sweetened is
   DQ-44. Recommended: yes, it copies (the same rule as prep and milk), and
   the pulled state (NC-07) shows `home.pulledSweetened` [shot logged, sweetened]
   in its second line only when it was; no extra control. Brew shows the recipe's
   sweetened line before the pull, so it is never a surprise. Unticking before a
   pull isn't offered (DQ-44); a wrong one is corrected from the shot (edit).
6. **Out:** sweetened amount or kind; changing it on Brew before a pull.

**Tasks:** DES-02-01-06 (4 h), section 9.

---

### EPIC-02-04: Give one bag its own recipe (#19)

**INIT-02 Q1 is closed (DQ-29, accepted):** a pin updates the coffee's recipe by
default and "this bag only" is explicit. **Removing a bag's recipe is in scope**
(PEC-16, accepted; step 7).

**Entry points.** The same places a recipe is pinned today: SCR-TASTE and
SCR-SHOT ("Pin this recipe"), SCR-LOG recipe mode, and SCR-BAG "add a recipe".
The choice lives in SH-PIN, so there is no new screen.

**Screens and sheets touched.** SH-PIN (scope), SCR-HOME (marker), SCR-BAG
(recipes), SH-PORTION (marker), SCR-COFFEE (bag rows), SCR-LOG (dial-in and
fix start from the bag's recipe).

**UX flow**

1. Pin as today. SH-PIN opens with the new recipe, the one it replaces and
   what changes. **New:** a scope row directly under the title: overline
   `recipe.scope` [use this for], then a single-choice ChipGroup (NC-04) of two
   chips, `recipe.scope.bean` [every bag of this coffee] and
   `recipe.scope.batch` [this bag only].
2. **Default.** Every bag of this coffee, so the MVP behaviour is unchanged.
   Exception: when the bag in question already has its own recipe for this
   drink and setup, the default is this bag only (the user is continuing in that
   bag's context). Never a silent choice: one chip is always filled.
3. **Hidden when it would be a trap.** If the coffee has no recipe of its own
   yet for this drink and setup, the first pin is always the coffee's and the
   scope row isn't shown, so a new coffee can't end up with only a bag recipe.
4. **A line under the chips** says what the choice does (`text-label`
   `ink-secondary`, a polite live region so a change is announced):
   - every bag: `recipe.scope.beanEffect` [replaces the recipe every bag of
     this coffee starts from]. If this bag has its own recipe, add
     `recipe.scope.bagKeeps` [this bag keeps its own recipe];
   - this bag only: `recipe.scope.batchEffect` [only for this bag, roasted
     3 October. Other bags keep the coffee's recipe].
5. **The replaced block follows the choice.** Every bag: the coffee's current
   recipe (heading `recipe.replaces`, as built). This bag only: the bag's
   current recipe if it has one, else the coffee's recipe under a different
   heading, `recipe.insteadOf` [this bag would otherwise use]. The changes list
   compares against whichever is shown. Switching chips swaps the block in place
   from data already loaded (the preview returns both), so nothing loads.
6. Confirm with the one primary `recipe.confirmPin`. The status line reads
   `recipe.pinned`, or `recipe.pinnedBag` [pinned for this bag only].
7. **Seeing it.**
   - SCR-HOME: while the bag in use has its own recipe, the first quiet line
     under the values is `recipe.thisBagOnly` [this bag's own recipe]. No other
     change to Brew.
   - SCR-BAG, section recipes: the bag's own recipe first, with the overline
     `recipe.thisBagOnly`, then the coffee's recipe under `recipe.coffeeDefault`
     [other bags use] in `ink-secondary`. The bag's row has a ghost
     `recipe.bagRemove` [use the coffee's recipe for this bag], opening
     SH-CONFIRM (PEC-16). Confirming removes the bag's recipe at once; the
     coffee's recipe is unchanged.
   - SH-PORTION: a portion of a bag with its own recipe carries the marker, so
     the pick is informed. Choosing it uses that bag's recipe for the pull.
   - SCR-COFFEE: a bag row says `recipe.bagHasOwn` [has its own recipe] in its
     secondary line. Coffee recipes shown there are the coffee's own.
   - SCR-SHOT and the Journal: no change. A shot records the values it was
     pulled with; nothing records which recipe it came from.
8. **Using it.** One-tap pulls, Dial in and Fix start from the bag's recipe
   while that bag is the portion in use (earliest-opened open portion, DQ-03).
   A new bag of the same coffee starts from the coffee's recipe again, with no
   prompt.

**States**

| State | Design |
|---|---|
| Preview loading | As built: SH-PIN opens when the preview is ready; a failed preview says `states.saveFailed` where the user pinned, with retry. |
| Save failed | The sheet stays on the chosen scope; Notice with `actions.retry`. |
| Bag finished (pinning from an old shot of a finished bag) | The bag-only chip is disabled with `recipe.scope.bagFinished` [this bag is finished]; every bag is selected. |
| Removing the bag's recipe fails | SH-CONFIRM stays; Notice with retry. |
| Bag has a recipe but is not the bag in use | Shown on SCR-BAG only; Brew is unaffected. |
| Portion frozen or split | The recipe belongs to the bag, so all its portions share it. |

**Copy direction.** Keys `recipe.scope.*`, `recipe.thisBagOnly`,
`recipe.coffeeDefault`, `recipe.insteadOf`, `recipe.bagRemove`,
`recipe.bagHasOwn`, `recipe.pinnedBag`. Plain words: "bag" for the batch (the
UI never says "batch" or "override"); "every bag of this coffee" for the
default.

**Components:** PinSheet (extended), ChipGroup, ShotValues, ListRow, Button,
Notice, SH-CONFIRM (ConfirmSheet), Sheet. No new component.

**Design acceptance criteria**

- Pinning a coffee's first recipe for a drink and setup never shows the scope
  row; later pins show it, with one chip always selected.
- Choosing "this bag only" leaves the coffee's recipe untouched, visibly: the
  sheet shows what the bag would otherwise use, and SCR-BAG shows both.
- A bag's own recipe is marked by text (`recipe.thisBagOnly`) on Brew, SCR-BAG
  and SH-PORTION, never by colour.
- Switching scope changes the replaced block and the helper line without
  closing or reloading the sheet, and the change is announced.
- Moving to a new bag of the same coffee returns Brew to the coffee's recipe
  with no extra tap.
- A bag recipe can be removed in one confirmed action (PEC-16).
- The sheet has one primary button and fits a 375 x 667 viewport without the
  primary leaving the screen.

**Design tasks** (`design`)

- DES-02-04-01 Add the scope choice and helper copy to SH-PIN, including the
  replaced block, the hidden-for-first-pin rule and the finished-bag state
  (4 h; was 2).
- DES-02-04-02 Design the markers on Brew, SCR-BAG (both recipes, remove),
  SH-PORTION and SCR-COFFEE bag rows (3 h).
- DES-02-04-03 Add or extend Storybook stories for PinSheet scope states and
  the SCR-BAG recipe section (2 h).

---

### EPIC-02-05: Make the drink and milk lists yours (#20)

**Entry points.** SCR-PROFILE, section "Your lists" (`profile.lists`), two
ListRows: `profile.drinks` [Drinks] with a one-line summary ("9 drinks, 2
hidden") and `profile.milks` [Milks]. In place, a footer row in the selects
that use the lists: `drinks.manage` [Edit your drinks] in Brew's drink select
and SCR-LOG's drink select; `milks.manage` [Edit your milks] in the milk
select (SCR-LOG, EPIC-01-03). Each opens the list screen with return-to, so
"I want an Oat flat white" is two taps from where the need arises.

**Screens and sheets touched.** New: SCR-DRINKS, SCR-MILKS, SH-DRINK, SH-MILK.
Changed: SCR-PROFILE (rows), SH-SELECT (footer row), Brew, SCR-LOG, SCR-SHOTS
filter, SCR-COFFEE and SCR-BAG recipe rows (hidden-drink recipes).

**UX flow: drinks (SCR-DRINKS)**

1. Full-screen task with PageHeader (`drinks.title` [Drinks]); cancel is
   "back". Below it, one `text-body` `ink-secondary` sentence: `drinks.intro`
   [these are the drinks you choose from; hidden ones are kept for old shots].
2. **The list**, in the household's order: one ListRow per drink (hidden ones
   too). Primary: the drink's name (custom name, else the translated starter
   name). Secondary: `drinks.withMilk` [with milk, 120 ml usual] or
   `drinks.noMilk`. A hidden drink carries the overline `drinks.hidden` and
   shows in `ink-secondary`. Tapping a row opens SH-DRINK.
3. **Add:** the list ends with a plus row, `drinks.add` [Add a drink], the same
   pattern as the selects' footer rows. There is no primary button on the
   screen (it is configuration, and every row is an action).
4. **Reorder:** a ghost `drinks.reorder` in the header end puts the list into
   ReorderList mode (NC-17): each row shows move-up and move-down buttons in
   place of its tap target, the header ghost becomes `actions.done`, and each
   move is announced ("Latte, 2 of 9"). A new drink is last (STORY-02-05-04
   AC 3). Reordering saves each move at once; a failed move reverts and shows a
   Notice.
5. **SH-DRINK (edit):** a Sheet with
   - `drinks.name` Input (required, 40 characters; shows the current name,
     never the key). A ghost `drinks.resetName` [use the original name] appears
     only on a renamed starter drink.
   - If the drink has milk: `drinks.usualMilk` [usual milk] with a NumberWheel
     in millilitres, step 10, range 0 to 500 (the log's wheel, DQ-26). Without
     milk nothing about milk is asked (STORY-02-05-06 AC 2).
   - `drinks.hasMilk` shown **read-only** on an existing drink as a line ("with
     milk"), not a control: changing it would reinterpret past shots (S-02, as
     milk fields appear only for milk drinks). Only a new drink chooses it.
   - A Toggle (NC-13) `drinks.show` [show in my lists]. Off hides the drink.
     The last shown drink's switch is disabled with the reason line
     `drinks.keepOne` [at least one drink has to stay visible] (the Toggle
     extension, section 3).
   - One primary `actions.save`. Closing with changes asks once (SH-CONFIRM).
6. **SH-DRINK (add):** the same sheet, empty: name (required), `drinks.hasMilk`
   as a Toggle (default off) with a line saying it can't be changed later, and,
   when on, the usual-milk wheel at 120 ml. Saving adds the drink at the end,
   shown.
   - **Milk decision (round 8, Head of Product).** Conventional drinks define
     milk inherently (an Americano has none, a latte has). No existing drink gains
     or loses milk. A variation is a **custom drink**, with the milk choice made
     here at creation. Example: "Americano with froth": name it, switch
     `drinks.hasMilk` on, set a small usual amount (say 30 ml); it then gets its
     own recipes, milk field and tasting wording. The hint under the milk
     Toggle says so in one line (`drinks.hasMilk.hint` [for a variation such as
     "Americano with froth", add it as its own drink]). Nothing is offered on the
     existing drinks to "add milk".
7. **Names must be unique** within the household's visible and hidden drinks
   (case-insensitive). A duplicate or empty name shows ink text under the Input
   (`drinks.nameTaken` / `drinks.nameRequired`) and nothing saves; the Input uses
   the stronger error border it already has.
8. **What hiding does.** The drink disappears from Brew's select, SCR-LOG's
   select, and the Journal's drink chip options. It stays on past shots and as
   a Journal filter value if a shot of it is in view. If the hidden drink is the
   one the time-of-day rule would pick, the rule moves on to the next shown
   drink (DQ-02). **Recipes for a hidden drink are kept** and come back on
   unhide; on SCR-BAG and SCR-COFFEE their rows keep showing, in `ink-secondary`
   with `drinks.hidden` (DQ-38).
9. **What renaming does.** The new name shows everywhere, including past shots
   and in every language (a stored name overrides the translated key). Recipes
   are untouched (STORY-02-05-01 AC 3).

**UX flow: milks (SCR-MILKS)**

The same screen and sheet pattern as drinks, with these differences:

- Header `milks.title` [Milks]; rows show the name and the secondary
  `milks.kind.dairy` [dairy] or `milks.kind.plant` [plant]. No usual amount.
- SH-MILK: name Input; kind as a two-chip ChipGroup (required when adding; read
  as a line afterwards, since it drives the starter ordering and nothing else);
  the same Toggle with the same keep-one rule. Add: `milks.add` [Add a milk],
  for example "Oat (barista)". There is no brand catalog (S-02).
- **A hidden milk already chosen stays visible where it is chosen** (DQ-38): a
  recipe or a shot that uses a hidden milk still shows its name, marked
  `milks.hidden`, in SCR-LOG's milk field and the pin sheet. Tare never swaps
  it silently. Hidden milks aren't offered as a new choice.
- A milk is never deleted; hiding is the removal.

**States**

| State | Design |
|---|---|
| Loading | Skeleton rows (NC-11), `aria-busy`. |
| Load failed | `LoadFailed` with `actions.retry`, as other screens. |
| Empty | Not possible: starter lists exist, and the last shown item can't be hidden. If every item were somehow hidden, an EmptyState with the add action. |
| Save failed (sheet) | The sheet stays with the values; Notice with `actions.retry`. |
| Reorder failed | The row returns to its place; Notice `drinks.reorderFailed` with retry. |
| Offline | As elsewhere: nothing is saved; the failure notice. |

**Copy direction.** Keys `drinks.*` (title, intro, add, reorder, manage,
withMilk, noMilk, hidden, show, keepOne, usualMilk, hasMilk, resetName,
nameTaken, nameRequired), `milks.*` (the same, minus the amount), and
`profile.lists`, `profile.drinks`, `profile.milks`. Starter names stay under
`drinks.*` and `milks.*` as already planned. Calm, no "delete".

**Components:** PageHeader, ListRow, ReorderList (NC-17, **new**), Sheet,
Input, Toggle (extended), NumberWheel (`milliliter`), ChipGroup, Button,
Notice, Skeleton, ConfirmSheet, Icon (`up`, `down`, extended).

**Design acceptance criteria**

- Hiding a drink takes: open the drink, switch off, Save. It disappears from
  Brew and the log at once and stays on past shots.
- The last shown drink and milk can't be hidden, and the disabled switch says
  why in text.
- Reordering works with a keyboard and a screen reader, without dragging, and
  every move is announced with the new position.
- A renamed drink shows its name on Brew, in the log, on past shots and in the
  Journal; "use the original name" restores the translated one.
- A drink without milk never asks for an amount; an existing drink's milk
  setting is shown but not editable.
- A hidden milk used by a recipe or shot is still shown by name where it is
  already chosen, and is never swapped silently.
- Empty and duplicate names are explained in ink text, never by colour, and
  nothing is saved.
- Both screens mirror in right-to-left and work with long names (a 40-character
  name wraps rather than truncating).
- Reached from Profile and from the selects' footer rows, each returning to
  where it started.

**Design tasks** (`design`)

- DES-02-05-01 Design SCR-DRINKS and SH-DRINK (edit, add, rename, reset name,
  usual milk, keep-one rule, duplicate and empty names), with states (6 h; was
  5).
- DES-02-05-02 Design SCR-MILKS and SH-MILK, including the hidden-but-chosen
  behaviour in the log and the pin sheet (3 h).
- DES-02-05-03 Design ReorderList (NC-17): reorder mode, focus and
  announcements, first and last row; add its story with a right-to-left
  story (4 h).
- DES-02-05-04 Design the entry points (Profile rows with summaries, selects'
  footer rows with return-to) and add stories for the Toggle `disabled` and
  `hint` extension and the Icon `up` and `down` strokes (3 h).

---

### EPIC-03-05: Know when you'll run out (#26)

**Run-out only (round 8).** `epics.md` revision 11 split the Beans filters into
the new EPIC-03-07 (below, PEC-17 accepted). This epic keeps the run-out line
and its explanation sheet. Prediction is in the product now (DQ-39a, accepted).

**Entry points.** The Beans tab (SCR-PANTRY). The run-out line sits under the
On hand heading and opens SH-RUNOUT.

**Screens and sheets touched.** SCR-PANTRY (the line), new SH-RUNOUT. While a
Beans filter is on the line is hidden; that rule is owned by EPIC-03-07 and
works whichever epic ships first.

**UX flow: run-out**

1. Under the `beans.onHand` heading, one line in `text-body` `ink`:
   `beans.runOut` [about 5 weeks of coffee] or, with stock in the freezer,
   `beans.runOutFrozen` [about 5 weeks of coffee, 2 of them in the freezer].
   Spans come from `Intl` unit formatting: days under two weeks, weeks up to 26,
   then months (`beans.runOutLong` [more than 6 months]). "About" is part of
   the message, never a precise date in the line. Counting frozen stock is the
   point, so the line always includes it.
2. The line is a quiet button with a mirrored chevron (a ListRow-style target of
   at least 44 px). It opens **SH-RUNOUT** (Sheet, `beans.runOutTitle` [how we
   worked this out]):
   - The span again in `text-display` weight 200 with the overline
     `beans.runOutBy` [around 14 December].
   - Four plain rows (label start, value end): coffee on hand (and how much is
     frozen), how much you use (`beans.useRate` [about 85 g a week]), what it is
     based on (`beans.basedOn` [6 finished portions over 11 weeks]), and logged
     shots' share of the weight of finished portions (`beans.coverage`
     [78 %]).
   - One sentence for the share (`beans.coverage.meaning`): when it is low, the
     household drinks more than it logs, so coffee runs out sooner than shown.
   - Formats through `Intl`; weights in grams (or the user's unit helper), rates
     per week.
   - No primary button (information only); the Sheet's close returns focus to
     the line.
3. **Learning.** Before there is enough history (a threshold the rules owner
   sets; recommended three finished portions, DQ-39) the same slot shows
   `beans.learning` [still learning how fast you use coffee] in
   `ink-secondary`, also opening SH-RUNOUT: "Tare needs a few finished bags. 1
   of 3 so far", and the coffee on hand. No estimate is shown rather than a
   guess (STORY-03-05-01 AC 2). The coverage row says "not available yet" until a
   portion has finished.
4. **No line at all** when: nothing is on hand (the On hand empty state already
   says so); there has been no brewing for a month (the rate would be a guess,
   so the line is simply absent); or any Beans filter is on (the figure is for
   all coffee, so it would mislead under a narrowed list).
5. It is **calm information**: ink only, no `signal`, no buy prompt, no
   reorder button (out of scope).

**States**

| State | Design |
|---|---|
| Loading | The run-out line is a single `text-body` skeleton line in Beans' skeleton. |
| Run-out error | The line is simply absent (it is secondary information); the rest of Beans is unaffected. SH-RUNOUT, if open, shows `states.loadFailed` with retry. |
| Learning, steady, stale | As above. |

**Copy direction.** Keys `beans.runOut*`, `beans.learning`, `beans.useRate`,
`beans.basedOn`, `beans.coverage*`. Durations and weights via `Intl`; "about"
and "around" are in the message so a language can place them.

**Components:** ListRow-style button, Sheet (SH-RUNOUT), Skeleton, Icon. No new
component.

**Design acceptance criteria**

- With enough history the run-out line is one sentence naming the span and the
  freezer share; with too little it says Tare is still learning and shows no
  number.
- SH-RUNOUT shows the inputs (rate, finished portions, share of weight logged)
  with units, and a sentence about what a low share means; it promises no
  accuracy (DQ-39).
- The run-out figure never uses `signal` or any call to buy; it reads as calm
  information.
- The line is absent when nothing is on hand, when use is stale, and while any
  Beans filter is on.
- The sheet works with a keyboard and a screen reader and mirrors in
  right-to-left.

**Design tasks** (`design`)

- DES-03-05-01 Design the run-out line on SCR-PANTRY: spans, freezer share,
  learning, absent states (4 h; was 3).
- DES-03-05-02 Design SH-RUNOUT: the inputs, coverage sentence, learning and
  "not available" variants (3 h).

(DES-03-05-03 and 04, the filters and origin, moved to EPIC-03-07 as
DES-03-07-01 and 02.)

---

### EPIC-03-07: Find any coffee in Beans (new in `epics.md` revision 11)

**Split from EPIC-03-05 (PEC-17, accepted).** INIT-03 now has seven epics, by
exception. If the Head of Product wants the guideline kept, the fallback in
`epics.md` is to fold this back into EPIC-03-05 and ship it without the origin
chip until a coffee has an origin; the design already hides the chip then.

**Entry points.** The Beans tab (SCR-PANTRY): the filter row under the page
header. Origin is asked on SCR-CATALOG-ADD's coffee step and shown on
SCR-COFFEE.

**Screens and sheets touched.** SCR-PANTRY (filter row, filtered empty states),
SH-SELECT (filter choices), SCR-COFFEE (origin line), SCR-CATALOG-ADD (origin
field).

**UX flow: Beans filters**

1. **When shown.** The filter row appears once the household has six or more
   distinct coffees (on hand and tried together), because below that the list is
   short and the row is clutter (DQ-39c). Not a default filter: Beans opens
   unfiltered.
2. **The row** is the Journal's `FilterChips` (NC-04 filter variant) under the
   page header: **Roaster**, **Roast level**, **Origin**, **Rating**. Each chip
   shows "Roaster" when off, and its value when on; active chips fill with `ink`
   and carry a close control; a ghost "All" leads the row while any filter is
   on and clears them all (`beans.filterAll`).
3. **Choosing:** a chip opens SH-SELECT with only the values that exist in the
   household's coffees, each with a count in its secondary line ("3 coffees").
   - Roaster: roasters of the household's coffees.
   - Roast level: the roast levels present (S-09 scale), light to dark.
   - Origin: the origins present; coffees with no origin recorded are in the
     list as `beans.originUnknown` [not stated] so they can be found and
     filled in. The chip is shown only when at least one coffee has an origin.
   - Rating: `beans.rating.good` [mostly good], `.mixed`, `.off` [mostly off],
     `.none` [no ratings yet]. **"Rating" for a coffee is Tried's own summary
     line** (DQ-28, DQ-39b), the same words, so nothing new is invented. With
     several profiles it follows the person chosen on Brew (EPIC-05-01); there
     is no Person chip on Beans.
4. **Behaviour.** One value per chip; several chips combine (AND). The filter
   narrows On hand and Tried together. Filters live in the page address so Back
   from a bag or a coffee keeps them; tapping the Beans tab again clears them.
   **While any filter is on, the run-out line (EPIC-03-05) is not shown.**
5. **Filtered results.** Each section shows only matching coffees. If On hand has
   none but Tried has some, On hand says `beans.filteredOnHandNone` in one line,
   and the reverse. If neither matches, both sections are replaced by one
   EmptyState `beans.filteredNone` [no coffee matches] with a secondary
   `beans.filterClear` [clear filters]; the chips stay. (The same pattern as the
   Journal's filtered empty state.)

**UX flow: origin (the data gap)**

The catalog has no origin field (S-08); `epics.md` makes this epic own the
migration and the question.
1. An optional `catalog.origin` SelectField on SCR-CATALOG-ADD's coffee step,
   from a curated list of producing countries plus "other" (typed once,
   normalised so "ethiopia" and "Ethiopia" are one value). Leaving it empty is
   fine and never blocks adding the coffee.
2. **Who fills it:** the Head of Product fills origin in the seed list as admin;
   a household fills it for coffees it adds, if it wants (DQ-49).
3. **Blends:** the list has `catalog.origin.blend` [blend] as its own choice, and
   "other" for anything else. A blend is not a country, so it filters under its
   own value and is never guessed from a name.
4. SCR-COFFEE shows origin in its details line when set (`catalog.origin`).
5. A household can set origin later on a coffee it added itself while it is
   unverified (the PEC-08 pattern); verified coffees are admin's (out, then
   EPIC-06-07).
6. Until at least one coffee has an origin the chip stays hidden, so the filter
   never offers an empty choice.

**States**

| State | Design |
|---|---|
| Loading | Beans skeleton as built; the filter row a row of pill skeletons. |
| Filter option list empty | The chip is not shown. |
| Filtered empty | As step 5; one primary is not needed (the clear action is secondary; Add a bag remains the header's primary only when bags are on hand). |
| Origin list failed to load | The origin field is hidden on Add a coffee; adding still works. |
| Load failed | `LoadFailed` with retry, as built. |

**Copy direction.** Keys `beans.filter*`, `beans.rating.*`,
`beans.originUnknown`, `catalog.origin`, `catalog.origin.blend`.

**Components:** FilterChips, SelectSheet, SelectField, EmptyState, Notice,
Skeleton, Icon. No new component.

**Design acceptance criteria**

- Filters appear only with six or more coffees; each chip's options are only
  values that exist, with counts; "All" and each chip's close control clear
  filters; filtered-empty offers "clear filters".
- Filtering narrows both On hand and Tried, Back from a bag keeps the filters,
  and the run-out line is not shown while one is on.
- Rating options use the same words as Tried's summary line.
- Origin is optional wherever it is asked, blends have their own value, and the
  origin chip is hidden until some coffee has one.
- Chips and sheets work with a keyboard and a screen reader and mirror in
  right-to-left; the filter row scrolls sideways without clipping its focus
  ring.

**Design tasks** (`design`)

- DES-03-07-01 Design Beans filters: row, option sheets with counts, combined
  filters, filtered empty states for each section, the six-coffee rule and the
  hide-the-run-out rule (4 h; was DES-03-05-03).
- DES-03-07-02 Design origin: the optional field and blend choice on
  SCR-CATALOG-ADD, the line on SCR-COFFEE, the "not stated" option (3 h; was
  DES-03-05-04).

---

### EPIC-04-02: Suggested grind that follows bean age and recent shots (#29)

**Questions closed in round 8 (accepted, section 8):** INIT-04 Q2 (DQ-32,
**revised**: the bag's measured shots in the last 3 days of the current grind
period, pooled across personas), Q3 (DQ-31), Q4 (DQ-30), SQ-18 (DQ-33, prep),
the overlap with EPIC-02-03 (DQ-34) and evals (DQ-43). Still open and design
relevant: which recipe a shot was brewed from (DQ-45), pooling across setups
that share a grinder (DQ-46) and a clean resetting drift (DQ-47). The
designer's needs stay small: one number, one reason phrase, and an honest "not
enough yet" that shows nothing. The window and pooling are the rules owner's
and the evals tune their numbers; the design only has to say them in plain
words.

**Entry points.** None of its own. It appears where a recipe is the starting
point: Brew, and SCR-LOG opened to dial in from a recipe (including the
closest-setup dial-in).

**Screens and sheets touched.** SCR-HOME (grind value, one reason line),
SCR-LOG (starting grind, "was", reason), new SH-DRIFT, the one-tap pull. Not
touched: fix mode and "Dial in from this" (see step 5), SCR-TASTE's
SuggestionCard, edit mode.

**UX flow**

1. **Brew.** When Tare has an adjustment of at least one grinder step, the
   grind in the 2 x 2 values grid shows the **adjusted** grind (the same size
   and weight as before, so nothing looks new). Directly under the grid, one
   quiet line in `text-label` `ink-secondary`, a ghost button (`size="sm"`, at
   least 40 px, 8 px clear around it) with a mirrored chevron:
   `home.grindAdjusted` [recipe 15 · beans have aged]. The pattern puts the
   recipe's own grind first and the reason second. The reason is one of
   `home.grindReason.aged` [beans have aged], `.bag` [this bag runs fine],
   `.both`, and, after servicing (04-03), `.serviced`, joined by the message
   pattern, never by hand.
2. **Tap the line** to open SH-DRIFT (Sheet, `drift.title` [why this grind]):
   - The recipe's grind (`text-h3`), then one row per step that moved it,
     value at the end with its sign: `drift.aged` [beans have aged, roasted 18
     days ago], `drift.bag` [this bag has been running fast, from its recent
     shots], `drift.serviced` (04-03). Then a hairline and the grind shown, in
     `text-display` weight 200.
   - **Evidence lines (round 8, DQ-32 revised).** `drift.basedOn` says what
     the bag step rests on, in time not in a shot count: [based on 5 measured
     shots of this bag in the last 3 days]. When Tare had to reach further back
     to find enough shots: [based on 4 measured shots of this bag since 12
     November], and never back past the last servicing of the grinder (it then
     says `drift.sinceServicing` [since your grinder was serviced]). One-tap
     shots aren't counted (`drift.onlyMeasured`). Recent shots count more, in a
     short sentence `drift.recentMore` [today's shots count about twice as much
     as shots from 3 days ago].
   - **Pooled across people (round 8).** Shots from everyone who brewed this
     coffee on this grinder count as one signal about the bag, each compared with
     the recipe it was brewed from, so a bag running fast is seen faster in a
     busy household. When more than one profile contributed, a line says so
     without names: `drift.pooled` [includes shots made for 2 people]. The nudge
     shown is for **this** recipe only, in its own units (`drift.perRecipe`
     [applied to your recipe, not to everyone's]). Persona names never appear.
   - If shots with different puck prep were left out, a further line says how
     many (`drift.prepLeftOut`, DQ-33; kept as before).
   - Footer: a secondary `drift.useRecipe` [use my recipe's 15 for this shot],
     which sets Brew back to the recipe's grind **for this pull only** (DQ-17
     pattern; not a saved setting). Close returns focus to the line.
3. **Dial in.** SCR-LOG opens from a recipe with the grind tab at the adjusted
   value and the recipe's value as "was 15" (ShotDial's existing "was", NC-09),
   and under the grind wheel the same quiet reason line opening SH-DRIFT. The
   other values start from the recipe as usual.
4. **One-tap pull.** The shot records the grind that was shown (STORY-04-02-06
   AC 3); that is why Brew states it so plainly. The pulled state is unchanged.
   One-tap shots are never used as measurements, so a pull at the adjusted grind
   doesn't confirm the adjustment; only measured shots do.
5. **Where it does not apply.** Fix mode starts from the off shot's own values
   plus one suggested change, which is already the freshest evidence; adding
   drift on top would double-count (DQ-34). "Dial in from this" starts from a
   past shot's values. Edit mode is the saved shot. Entering a recipe starts
   from what the user types. In all four the grind is the shot's or the user's.
6. **Wording by what Tare knows.** The numbers are always in the grinder's own
   units, so they are correct even when the grinder's coarser direction is "not
   sure". Words "finer" and "coarser" appear in SH-DRIFT only when the direction
   is known; they are never guessed (as in EPIC-02-03).

**States and edge cases**

| State | Design |
|---|---|
| Too little evidence (fewer measured shots than the rule needs, or none in the current grind period) | Nothing changes. Brew shows the recipe's grind with no line. No "learning" message on Brew: it would nag every day. |
| Fewer than 3 measured shots even after reaching back to the last servicing | Nothing shown. At most 10 shots are used, so a busy household's evidence line never reads like a long history. |
| Shots from several people, or from several setups with the same grinder | Pooled as the relative signal (DQ-46); the sheet says "includes shots made for N people" and, across setups, `drift.acrossSetups` [includes shots on your other setup with this grinder] (DQ-46). |
| Shots can't be matched to a recipe | A shot with no recipe before it is left out of the pool, counted in the same left-out line (DQ-45). |
| Adjustment under one grinder step | Treated as none; nothing shown. |
| Stepped grinder | The adjusted value is rounded to the grinder's step; stepless uses its finest increment. |
| A very large adjustment | Capped by the rule (tuned by its evals); the value shown is the capped one and SH-DRIFT says "limited to N steps". |
| Beyond the grinder's range | Clamped to the range. |
| Grinder direction unknown | Numbers only, no finer or coarser words. |
| Frozen or unopened portion | The clocks pause with freezing as elsewhere; an unopened portion uses the roasting clock only. |
| New grind period after servicing | No drift adjustment until measured shots exist in the new period; the servicing shift (04-03) applies on its own. |
| Calculation fails | Brew silently shows the recipe's grind. The adjustment is an aid and must never block a pull. |
| Past shots | Show the grind they recorded. Nothing extra is stored or shown on them (calculated values are never stored). |

**Copy direction.** Keys `home.grindAdjusted`, `home.grindReason.*`,
`drift.*`, `log.grindAdjusted`. Phrases describe what happened ("beans have
aged"), never a verdict; ink only; no percentages shown to users.

**Components:** ShotValues (large, unchanged), ShotDial ("was"), Button ghost,
Sheet, ListRow, Icon. No new component and no extension: the reason line is a
ghost Button, SH-DRIFT is a Sheet of ListRows.

**Design acceptance criteria**

- When an adjustment applies, Brew shows the adjusted grind in the usual
  place and size, and one line giving the recipe's grind and the reason; when it
  doesn't, Brew looks exactly as it does today.
- Opening SH-DRIFT shows the recipe's grind, each step and the grind shown,
  adding up; units and signs are formatted through `Intl`.
- "Use my recipe's grind for this shot" works once and isn't remembered.
- The pre-filled log starts at the adjusted grind with the recipe's grind as
  "was"; fix mode and "Dial in from this" start unadjusted.
- A one-tap pull records the grind shown; the stored recipe is unchanged.
- No new colour: ink and `ink-secondary` only, no `signal`.
- With low evidence, a new period or a failure, nothing about drift is shown
  and nothing blocks a pull.
- The Pull button stays visible on 375 x 667 with the reason line present.

**Design tasks** (`design`)

- DES-04-02-01 Design the adjusted-grind treatment on Brew and in the
  pre-filled log: value, reason line, "was", one-tap behaviour (6 h; was 4).
- DES-04-02-02 Design SH-DRIFT: step rows, the 3-day and reach-back evidence
  lines, the pooled-across-people and prep left-out lines, "use my recipe for
  this shot", direction-unknown and capped variants, with the rows 04-03 and
  04-04 add (4 h; was 3, round 8).
- DES-04-02-03 Add stories for Brew with and without an adjustment, SH-DRIFT
  variants and a right-to-left check (3 h).

---

### EPIC-04-03: Re-dial once after maintenance and keep every recipe (#30)

**Open questions that block it (section 8):** INIT-04 Q3 (DQ-31, the aging
estimate it subtracts, shared with EPIC-04-02), how offsets chain over several
events, non-grinder events and which events prompt (DQ-42). Recommended answers
are used here.

**Entry points.** (1) A Card on Brew after a servicing. (2) SCR-UNIT: a
grinder's maintenance events become tappable, and an event awaiting a re-dial
has a button. (3) Any ordinary dial-in and pin of a coffee that had a recipe
before the event triggers the same confirmation, because the pin, not the
Card, is what Tare listens to.

**Screens and sheets touched.** SCR-HOME (Card), SCR-UNIT (event rows),
SCR-LOG (re-dial banner), SH-PIN then new SH-OFFSET, SH-SELECT (choose the
coffee), SH-DRIFT (shows the servicing step), recipe rows everywhere the grind
is shown.

**Which events count.** Only a grinder event marked `maintenance.isRecalibration`
(on by default for burrs and re-zero, DQ-15) starts a re-dial. A clean or repair
does not prompt. Events on a machine never do. (A clean still starts a new grind
period for dividers and drift, as built; see UX concern, round 7.)

**UX flow**

1. **After saving a recalibrating grinder event** in SH-MAINTENANCE, the sheet
   closes as today. SCR-UNIT then shows, above the events list, a status block
   in `text-body`: `maintenance.redialAwaiting` [recipes pinned before this
   still use the old numbers. Re-dial one coffee and they all follow] with a
   secondary `maintenance.redialStart`. If the grinder has no recipe pinned
   before the event on any setup, nothing is shown (nothing to map).
2. **The Brew Card** (Card, outline, `padding md`, one quiet card; pattern 3 of
   5.0) appears on Brew when: the current setup contains this grinder, the event
   awaits a re-dial, and at least one recipe pinned before it exists on a setup
   with this grinder. Content: title `home.redial.title` [your grinder was
   serviced], one sentence `home.redial.body` [re-dial one coffee and the rest
   follow], a secondary `home.redial.start` [re-dial a coffee], a ghost
   `home.redial.later` [not now]. "Not now" hides the Card for this event on
   this device; the SCR-UNIT block stays. Pull and Dial in are untouched.
3. **Start.** `home.redial.start` opens SH-SELECT (`redial.pick` [which coffee?])
   listing coffees on hand that have a recipe pinned before the event on this
   grinder, the Brew coffee first, each with its drink and setup as the
   secondary line. Choosing opens SCR-LOG in dial-in mode for that coffee, drink
   and setup, with the banner `log.redialing` [re-dialling after servicing your
   grinder] in `text-label` under the header. The grind starts at the old
   recipe's grind, shown as "was". (No drift adjustment, pattern 1; the old
   number means nothing on new burrs, so this is only a starting point.)
4. **Dial in as usual,** tasting included, then pin (SH-PIN). A pin of a recipe
   whose predecessor was pinned before the event, on a setup with the serviced
   grinder, is a re-dial wherever it came from.
5. **SH-OFFSET** opens right after the pin is confirmed (Sheet, `offset.title`
   [what did the servicing change?]):
   - A one-line statement of the evidence: `offset.line` [your recipe for
     {coffee} was 15 and is now 12].
   - The proposed shift in `text-display` weight 200, signed ("-3"), with its
     unit under it (`offset.unit` [grinder steps]) and, when the grinder's
     direction is known, words (`offset.finer` [3 steps finer]).
   - If beans aged between the two dial-ins and that was taken off first, one
     quiet line `offset.agedNote` [0.5 of that was the beans ageing, taken off
     first]. Without an aging estimate the line is absent and nothing is taken
     off.
   - **Editable:** a compact NumberWheel for the shift (step = the grinder's
     step), so "confirm" and "edit" are one control.
   - **Preview:** up to three other recipes that would change, as rows "Coffee
     name, drink: 15 to 12" (text with the arrow Icon, not ShotValues), and "and
     4 more" if there are more. The reader sees the effect before agreeing.
   - Primary `offset.confirm` [use this for my other recipes]; ghost
     `offset.decline` [don't adjust my old recipes].
6. **What confirming does.** The shift and the re-dial it came from are stored on
   the event. From then on every recipe pinned before the event, on any setup
   with this grinder, is read with the shift applied; stored recipes are never
   rewritten. Brew shows the shifted grind with the reason line (pattern 1,
   `.serviced`), and the same in the log, the pin sheet's "replaces" block,
   SCR-BAG and SCR-COFFEE recipe rows. Recipes pinned after the event are not
   shifted.
7. **What declining does.** It confirms a shift of zero and says so: old
   recipes are shown unshifted, the awaiting block and Card go away, and the
   shift stays editable from the event (DQ-42).
8. **No baseline.** If the user started from the Card or SCR-UNIT but the coffee
   they pinned has no recipe from before the event, SH-OFFSET shows no shift and
   says why (`offset.noBaseline` [this coffee had no recipe before the
   servicing, so there's nothing to compare. Pick one that did]) with a primary
   `offset.pickAnother`. On an ordinary pin of such a coffee, nothing is shown
   (no interruption).
9. **Edit later.** On SCR-UNIT an event row opens SH-OFFSET in edit mode: the
   same wheel, "from your re-dial of {coffee} on 9 October", `offset.save` and a
   ghost `offset.remove` (sets zero). A row shows its shift at the end next to the
   recalibration marker (`maintenance.shift` [-3 steps]). Events with no shift
   yet show `maintenance.redialAwaiting`.
10. **Several events.** Confirmed shifts after a recipe's pin are applied in date
    order (STORY-04-03-03 AC 4), and SH-DRIFT lists each with its date.
    Back-dating an event moves its place in that order at once.

**States**

| State | Design |
|---|---|
| No recipe predates the event | No block, no Card; the event row has no "awaiting" marker. |
| Re-dial started, then left | The log's usual leave confirmation (SH-CONFIRM). The Card and block remain. |
| Two grinders | The Card and block name the grinder (nickname, else model). |
| Save failed (SH-OFFSET) | The sheet stays; Notice with retry; nothing applied. |
| Event dated today | Counts from the moment it is saved; recipes pinned earlier today are "before". |
| Non-grinder event, or a clean | No prompt, no marker. |
| Loading | SH-OFFSET opens when the proposal is ready; a failed proposal says so and leaves the pin saved. |

**Copy direction.** Keys `home.redial.*`, `log.redialing`, `redial.*`,
`offset.*`, `maintenance.redialAwaiting`, `maintenance.redialStart`,
`maintenance.shift`. Calm and factual: "serviced", never "broken" or
"recalibrate now". Numbers and units through `Intl`.

**Components:** Card, Button, SelectSheet, Sheet, NumberWheel (signed range
story, section 3), ListRow, Icon (arrow), Notice, ConfirmSheet, Toggle (event
flag, as built). No new component.

**Design acceptance criteria**

- After a recalibrating grinder event with prior recipes, Brew shows one calm
  Card with one secondary action and a "not now"; with no prior recipes, or
  after a clean, it shows nothing.
- From the Card to a confirmed shift takes: re-dial, pick the coffee, dial in
  and pin as normal, confirm. No form beyond the pin.
- SH-OFFSET shows the evidence ("was 15, now 12"), the proposed shift, what was
  taken off for ageing, and a preview of other recipes, and the shift can be
  edited in the same sheet.
- Declining leaves old recipes unshifted and stops the prompts; the shift stays
  editable from SCR-UNIT.
- A shifted recipe is always labelled where it is shown (the reason line), and
  stored recipes are unchanged.
- A re-dial of a coffee with no earlier recipe says why and offers another
  coffee.
- Event rows on SCR-UNIT are buttons with visible state in text ("awaiting
  re-dial", "-3 steps").
- Brew never shows this Card and the link Card together.

**Design tasks** (`design`)

- DES-04-03-01 Design the re-dial prompt and start: the Brew Card, the
  SCR-UNIT block, the coffee pick and the log banner (5 h; redefined, was the
  prompt and the sheet together at 6).
- DES-04-03-02 Design SH-OFFSET: proposal, aging note, editable shift,
  preview, decline, no-baseline and edit variants (6 h).
- DES-04-03-03 Design SCR-UNIT's tappable event rows and their states
  (awaiting, confirmed, declined, nothing to map) (3 h).
- DES-04-03-04 Design how a shifted grind reads on Brew, the log, SH-PIN and
  recipe rows, adding the servicing step to SH-DRIFT, with several events
  (3 h).
- DES-04-03-05 Add stories for the Card, SH-OFFSET variants and event rows,
  including the signed NumberWheel range (3 h).

---

### EPIC-04-04: Keep recipes right after new burrs of a different design (#31)

**Depends on EPIC-04-03** and extends its sheet. Open question (DQ-43): how a
stretch is fitted from more than two coffees, and what to do when re-dials
disagree. The design shows the result and its uncertainty; the method is the
tech lead's.

**Entry points.** (1) SH-OFFSET itself: the pin of a second re-dial after the
same event. (2) SCR-UNIT: on a burrs event with a confirmed shift and no second
re-dial, a quiet ghost `maintenance.redialMore` [re-dial a second coffee to
refine]. Brew's Card does **not** return for it (calm).

**Screens and sheets touched.** SH-OFFSET (stretch), SCR-UNIT (event detail),
SH-SELECT (second coffee), SH-DRIFT (stretch in the trail).

**UX flow**

1. **Who sees the invitation.** Only events of kind burrs, because only new
   burrs of a different design change what a step means (S-02). The event's
   detail (SH-OFFSET in edit mode, 04-03 step 9) shows a short
   `maintenance.redialMore.body` [changed to a different kind of burrs? Re-dial
   a second coffee, one much finer or coarser than the first, and Tare can tell
   whether each step now means something different].
2. **Pick the second coffee.** `maintenance.redialMore` opens the same coffee
   pick as 04-03 step 3, with the recipes ordered so the coffee whose old grind
   is **farthest from the first coffee's** comes first, marked
   `offset.farFromFirst` [very different grind from your first]. The spread is
   what lets Tare tell a stretch from a shift.
3. Dial in and pin as before (log banner `log.redialing`).
4. **SH-OFFSET with two (or more) coffees** shows, in this order:
   - the evidence as before, now naming each coffee ("Coffee A: 6 to 4.5,
     Coffee B: 22 to 19");
   - the **shift** (wheel, as 04-03);
   - the **stretch**, in plain terms, as a second control: label
     `offset.stretch` [how much each step changed], value in `text-display`
     as a percentage (`+10 %`), a NumberWheel in percent (-30 to +30, step 1; 0
     means "steps mean the same as before", shown as `offset.stretch.none`), and a
     sentence `offset.stretch.explain` [each step now moves your grind about 10
     % more than before, so coarse recipes move further than fine ones];
   - the preview, now covering both effects ("15 to 12");
   - primary `offset.confirm`, ghost `offset.decline` (back to the shift
     alone, stretch 0 %).
5. **Stored as a factor.** The wheel is in percent for people; what is stored is
   the factor (1.10), with 1 for "no stretch" (S-02). Editing later works the
   same.
6. **Uncertain fit.** When the re-dials disagree too much to fit one line,
   SH-OFFSET leads with a neutral Notice `offset.uncertain` [these two coffees
   don't quite agree, so treat these numbers as a guess]; the values are still
   shown and editable. Never `signal`: it is not a shot warning.
7. **Too close.** If the two coffees' old grinds are within about two steps of
   each other, a stretch can't be told: stretch stays 0 % and a quiet line
   explains (`offset.tooClose` [those two coffees are too similar in grind to
   tell; try one much finer or coarser]), with `offset.pickAnother` offered.
8. **Three or more** coffees use the same sheet, with `offset.basedOn` [based
   on 3 coffees].
9. **SH-DRIFT** lists the servicing step as one row with both parts
   (`drift.servicedStretch` [serviced 9 October: steps 10 % larger, then -3]),
   and several events apply in order.

**States**

| State | Design |
|---|---|
| Only one coffee re-dialled | Stretch is 0 % and isn't shown on the event row; the invitation shows for burrs. |
| Fit uncertain, or grinds too close | As steps 6 and 7. |
| Save failed | As 04-03. |
| Stretch edited to 0 % | Saves as "steps mean the same". |
| Event is not burrs | No invitation. A stretch can still be edited by hand from the event if one exists. |

**Copy direction.** Keys `offset.stretch*`, `offset.farFromFirst`,
`offset.uncertain`, `offset.tooClose`, `offset.basedOn`,
`maintenance.redialMore*`, `drift.servicedStretch`. Plain terms: "each step
now means more or less than before", never "scale factor" or a formula.

**Components:** SH-OFFSET (extended), NumberWheel (`percent` unit, extension),
SelectSheet, Notice, ListRow, Button. No new component.

**Design acceptance criteria**

- A second re-dial after a burrs event shows the shift and the stretch in one
  sheet, each editable, with the stretch in plain terms and as a percentage.
- Only burrs events invite a second re-dial, and Brew's Card never returns for
  it.
- The coffee pick marks the coffee whose grind is farthest from the first.
- An uncertain fit and too-close coffees are said in neutral ink text; the
  user can still confirm or edit.
- With one coffee re-dialled, the stretch is 0 % and nothing about stretch is
  shown on the event.
- Applied recipes read "grind times stretch plus shift" and SH-DRIFT lists it
  as one labelled step; stored recipes never change.

**Design tasks** (`design`)

- DES-04-04-01 Extend SH-OFFSET with the stretch: plain-terms value, percent
  wheel, evidence per coffee, preview (4 h; was 2).
- DES-04-04-02 Design the second-re-dial invitation on SCR-UNIT, the "farthest
  from the first" marker in the coffee pick, and the uncertain, too-close and
  three-coffee states (3 h).
- DES-04-04-03 Add stories for the stretch variants and the `percent`
  NumberWheel (2 h).

---

### EPIC-05-01: Brew for someone else in the household (#32)

**Questions closed in round 8 (accepted):** removing a profile (DQ-35),
persona switching and the current setup (DQ-36), a new profile's first dial-in
and second-hand taste answers (DQ-37). One refinement: when several other
profiles have a recipe for the same coffee, drink and setup, which one a new
profile starts from is DQ-48. Names in this file are always the `{name}`
placeholder or a role; the app and docs never use real or first-name examples
or describe people by relationship.

**Entry points.** (1) Brew's persona label becomes a select once the household
has more than one persona. (2) SCR-PROFILE, section `profile.people` ("People",
secondary "Just you"), opening SCR-PEOPLE; this is where the first extra profile
is added.

**Screens and sheets touched.** New: SCR-PEOPLE, SH-PERSON. Changed: SCR-HOME
(label, persona select, no-recipe start), SCR-LOG, SCR-TASTE, SH-OFF, SH-PIN
(persona line), SCR-SHOTS and SCR-SHOT (whose taste, persona chip), SCR-PANTRY
(Tried subtitle), SH-SELECT (footer row).

**UX flow: the people screen (SCR-PEOPLE)**

1. Full-screen task with PageHeader (`people.title` [People]). A sentence,
   `people.intro` [add people you brew for. Each gets their own recipes, usual
   drinks and taste answers]. **A name is enough**: the hint on the name field
   says a nickname works (`people.nameHint`); Tare asks for nothing else, so no
   personal data is needed.
2. **The list:** one ListRow per profile. First the household's main profile
   (shown by its name, or the translated role label; overline `people.you`).
   Then the others, by most recently brewed for. Secondary line: how many shots
   and when last ("12 shots, last 3 days ago"; "no shots yet"). Chevron opens
   SH-PERSON. The last row is a plus row `people.add` [Add someone].
3. **SH-PERSON (add or edit):** `people.name` Input (required, 40 characters,
   unique among profiles, empty and duplicate explained in ink text). Primary
   `actions.save`.
   - Edit shows the same field and, below it, a ghost `people.remove` that is
     present **only when the profile has no shots and no recipes**. With
     history, a line takes its place: `people.cantRemove` [N shots and N
     recipes belong to this profile, so it stays. You can rename it] (DQ-35).
   - The main profile has no remove, and renaming it here is the same as
     renaming it in Profile (one field, one place's worth of logic).
   - Removing an empty profile asks once (SH-CONFIRM) and cannot affect any
     shot.
4. After saving an add, the screen returns with the new row in place and a
   polite status `people.added`. Nothing else is asked.

**UX flow: choosing who on Brew**

1. **One persona:** nothing changes (the label opens Profile). Nothing about
   choosing a person is in the way (STORY-05-01-03 AC 4).
2. **More than one:** the label becomes a quiet SelectField (NC-06, text-label,
   mirrored chevron) with the hidden label `home.changePerson`. It opens SH-SELECT
   `home.whoFor` [who is it for?]:
   - options: the main profile first (`home.usual`), then the others by most
     recently brewed for; secondary line shows that person's usual drink
     ("usually a flat white");
   - footer row `home.profileAndPeople` [profile and people] to SCR-PROFILE,
     because the label no longer links there.
3. **Choosing a person** updates Brew in place, as drink and coffee do (200 ms
   cross-fade, buttons don't move): that person's usual drink for this time of
   day (DQ-02, per person; a new person gets the first shown drink), the coffee
   in use, their recipe on the current setup. The label shows who it's for in
   words (`home.brewingFor` [for {name}]) whenever it isn't the household's main
   profile.
4. **How long it holds (DQ-36, extends DQ-17).** A chosen person holds until
   Brew has been away for 30 minutes. It does **not** reset after a pull, because
   back-to-back drinks for one person are common. The setup does **not** follow
   the person: the current setup is the setup of the household's last shot,
   because the machine on the counter is physical (this amends DQ-18; PEC-18).
5. **No recipe for them.** A person without a recipe for the drink and coffee on
   this setup gets Brew's no-recipe state with primary `home.dialIn`
   (STORY-05-01-03 AC 2). Dial in starts from another profile's recipe for the
   same coffee, drink and setup if one exists, with the line `home.startsFromPerson`
   [starts from {name}'s recipe], because dose, grind and time for the same
   coffee on the same machine are a better start than blank values, and the
   tasting will correct it (DQ-37, PEC-18). It never becomes a one-tap pull.
6. **Logging and tasting for them.** The person is carried into SCR-LOG, SCR-TASTE,
   SH-OFF and SH-PIN. Each shows one quiet line `log.forPerson` [for {name}]
   under its header (the pin sheet: `recipe.forPerson`) whenever the household
   has more than one profile, so it is always clear whose taste the answers are.
   Pins from those shots are that person's (STORY-05-01-04 AC 2). **Second-hand
   answers** (the member answers for someone else) are asked the same way; the
   line "for {name}" is the only cue, and no extra flag is stored (DQ-37).
7. **Journal and shot detail.** In SCR-SHOTS a shot for someone other than the
   household's main profile carries a text marker, `journal.forPerson` [for
   {name}], among the existing markers; the main profile's shots carry none
   (it would be noise on every row). With more than one profile, the filter row
   gains a **Person** chip (FilterChips), whose default is the person chosen on
   Brew, like drink and coffee; "All" clears it. SCR-SHOT shows who the taste
   is for and who logged it, in text (`shot.forPerson`, `shot.loggedBy`).
8. **Beans.** Tried's "how its shots went" is per profile once there are
   several (DQ-28). The summary is for the person chosen on Brew, and when that
   isn't the main profile, a line under the Tried heading says so
   (`beans.triedFor` [how shots went for {name}]). No chip is added to Beans for
   this.

**States**

| State | Design |
|---|---|
| Loading | Skeleton rows on SCR-PEOPLE; the label shows the last known name. |
| Load failed | `LoadFailed` with retry. |
| Save failed | The sheet stays with the value; Notice with retry. |
| Person with no shots | Brew's no-recipe state; the people row says "no shots yet". |
| Chosen person later removed | Cannot happen: only empty profiles can be removed; if it is the chosen one, Brew returns to the main profile. |
| Reset after 30 minutes away | As drink and coffee: back to the main profile. |

**Copy direction.** Keys `people.*`, `home.whoFor`, `home.brewingFor`,
`home.changePerson`, `home.profileAndPeople`, `home.startsFromPerson`,
`log.forPerson`, `recipe.forPerson`, `journal.forPerson`, `shot.forPerson`,
`shot.loggedBy`, `beans.triedFor`, `profile.people`. Never "for Me": the main
profile is simply the label as it is today. Names are whatever the user types;
the app and its docs hold no personal examples.

**Components:** SelectField (quiet), SelectSheet, ListRow, Sheet, Input,
FilterChips, ConfirmSheet, Button, PageHeader, Notice, Skeleton. No new
component.

**Design acceptance criteria**

- With one profile, Brew, the log and the Journal look exactly as they do now.
- With more than one, switching person on Brew takes one tap to open and one
  to choose, updates the values in place, and says who it's for in words.
- A person with no recipe gets the no-recipe state, never a one-tap pull; when
  another profile has a recipe for the same coffee, drink and setup, Dial in
  starts from it and says so.
- Shots, taste answers and pins made after choosing a person are that person's
  and the member who tapped is the logger; the log, tasting and pin screens say
  "for {name}".
- The Journal marks shots for non-main profiles in text and filters by person,
  defaulting to the person chosen on Brew.
- A profile with shots or recipes can't be removed, and says why; an empty one
  can, after one confirmation; the main profile never.
- A name is the only thing asked, and the hint says a nickname is enough.
- Switching person never changes the current setup.

**Design tasks** (`design`)

- DES-05-01-01 Design persona switching on Brew: the label as a select, the
  sheet, in-place update, "for {name}", hold and reset, the no-recipe start from
  another profile (6 h; was 4).
- DES-05-01-02 Design SCR-PEOPLE and SH-PERSON: list, add, rename, the
  remove-only-when-empty rule and its explanation (4 h; was 3).
- DES-05-01-03 Design the persona across SCR-LOG, SCR-TASTE, SH-OFF, SH-PIN,
  the Journal (marker and Person chip), SCR-SHOT and the Tried subtitle (5 h).
- DES-05-01-04 Add stories for the persona select, SCR-PEOPLE states and the
  Journal with several profiles (2 h).

---

### EPIC-05-02: Invite them to take over their own profile (#33)

**Priority: Next, sequenced last** (`epics.md` revision 11; PEC-20 as adjusted
by the Head of Product, it stays in this breakdown). Depends on EPIC-05-01 (profiles to claim) and
EPIC-05-03 (the invitee signs in with Google). **Needs a store for invites**
(a token, the profile, who made it, expiry, status): not in the schema today, a
note for the tech lead. Questions closed (DQ-41, accepted): permissions
(any member invites), leaving (designed below), delivery (a link) and an invitee
who already has history (refused).

**Entry points.** Inviter: SH-PERSON for a profile without its own login, a
secondary `people.invite` [invite {name} to take over]. Invitee: a link opened
in a browser. There is no invite entry on Brew or in Profile's top level.

**Screens and sheets touched.** SCR-PEOPLE and SH-PERSON (invite state), new
SH-INVITE, new SCR-JOIN, SCR-PROFILE (account, 05-03), SH-SWITCH (reused logic).

**UX flow: inviting**

1. In SH-PERSON for a profile with no login: `people.invite`. A profile that is
   already claimed shows `people.claimed` [has their own login] and no invite.
2. **SH-INVITE** (Sheet, `invite.title` [invite {name}]):
   - Three plain lines of what happens: they sign in with Google; they take
     over this profile with its history; they share this household's machine,
     grinder, beans, recipes and **everyone's shots** (`invite.shares`). This is
     said before sending, not only to the invitee.
   - Primary `invite.create` [create a link]. After creating: the link in a
     read-only Input with a secondary `invite.copy`, and `invite.share` when the
     device offers sharing. Under it: `invite.valid` [works once, for 7 days].
   - Delivery is a link the member sends themselves (DQ-41): Tare collects no
     email address and sends nothing.
3. **Pending state.** The profile's row shows the overline `people.invitePending`
   and its SH-PERSON shows the link again, `invite.copy` and a ghost
   `invite.withdraw` [withdraw the link]. A withdrawn or expired link can't be
   used; creating a new one replaces it.
4. **Who can.** Any household member can invite for a profile and withdraw it
   (DQ-41). A joiner becomes a member.

**UX flow: joining (SCR-JOIN)**

SCR-JOIN is a full-screen page outside the tabs, reachable signed out. It has
five states:

1. **Landing.** `LogoWordmark`, then `join.title` [you've been invited to share
   a coffee kitchen]. A Card summarises **the profile's history before anything
   is claimed**: its name, number of shots, the drinks it makes most and when it
   was last brewed for (`join.summary`), and nothing about other profiles or the
   household's equipment. Under it, plain text of what joining means
   (`join.shares`, the same lines as the invite), and one primary `join.signIn`
   [sign in with Google to continue]. A ghost `join.notNow`. No account is
   created before the user chooses.
2. **After Google sign-in: confirm (the claim).** `claim.title` [take over
   {name}'s profile?]. The profile becomes the signed-in person's own, with its
   shots and recipes; others in the household can still brew for them;
   `claim.consent` [your shots stay private to this household. If sharing with
   other brewers ever comes, it will be your choice]. Primary `claim.confirm`
   [yes, this is my profile]; ghost `claim.cancel`. **Nothing changes until
   Confirm**, and Cancel leaves the link usable. After Confirm the claim can't be
   undone on this screen; the way out is leaving the household (below), and the
   sentence under the button says so.
3. **Done.** The user lands on Brew in the household, the label shows the
   profile's name, with a polite status `claim.done`. The inviter's People
   screen shows `people.claimed`.
4. **Invalid link.** Used, withdrawn, expired or claimed by someone else:
   EmptyState `join.invalidTitle` [this link no longer works] with one sentence
   (`join.invalid` [ask them for a new one]) and a secondary `join.openTare`.
   No detail about why, so a link reveals nothing.
5. **Blocked.** The person already uses Tare with history of their own
   (pattern 2): Notice, neutral, `join.hasHistory` [you already use Tare with
   your own history, and one login belongs to one household for now. Sign in with
   a different Google account to join this one]. Nothing is merged or lost. If
   their account is empty, joining replaces it silently (a new device case).

**States**

| State | Design |
|---|---|
| Creating a link | Primary busy; failure shows a Notice with retry in the sheet. |
| Loading the landing | Skeleton card; the wordmark stays. |
| Google sign-in cancelled | Back to the landing; the link stays valid. |
| Sign-in or claim fails | Notice, urgent, with retry; nothing is claimed. |
| Profile claimed meanwhile | Invalid link. |
| Joiner without a profile to claim | Not supported: every invite names a profile (DQ-41). |

**UX flow: leaving the household (SH-LEAVE; INIT-05 Q3, DQ-41b; DES-05-02-05)**

The claim itself can't be undone from the claim screen; leaving is the way out,
and it ships with invites (a release gate for this epic).

1. **Entry point.** SCR-PROFILE, Account section: a ghost row `leave.row`
   [leave this household]. **Shown only when the household has more than one
   login**, so a household of one never sees a way out of itself.
2. **SH-LEAVE** (ConfirmSheet, `leave.title` [leave this household?]) states
   plainly what happens, in four short lines:
   - `leave.staysBehind`: your profile, with its shots and recipes, stays with
     this household as a profile nobody has claimed, so the others can keep
     using it.
   - `leave.startFresh`: you start a **new, empty household of your own, with a
     fresh profile**. The machine, grinder, beans, setups and recipes here stay
     with this household, so your new one starts empty.
   - `leave.account`: you stay signed in with the same Google account.
   - `leave.canReturn`: nothing is deleted, and the household can invite you
     back to take your old profile over again.
   - **Only owner.** If you are the household's only owner, add `leave.ownerNote`
     [the member who has been here longest becomes the owner].
   One primary `leave.confirm` [leave this household]; ghost `actions.cancel`.
   Ink only, no `signal` (it is not a shot warning).
3. **Success.** The app reloads into the new household's first-run Brew screen
   (checklist, no setup yet) with a polite status `leave.done` [you've left. This
   is your own household now].
4. **Cancel.** The sheet closes and nothing changes.
5. **Failure.** The sheet stays; Notice, urgent, `leave.failed` [couldn't leave
   right now. Nothing has changed] with `actions.retry`. Nothing is half-done:
   the household and the new one are created together or not at all.
6. **Rules.** The leaver's profile and history stay with the household as an
   unclaimed profile; the leaver starts a new, empty household with a fresh
   profile. If the only owner leaves, the longest-standing member becomes owner.
   If, by the time of confirming, the leaver is the household's only login (the
   others left), the sheet shows a neutral Notice `leave.alone` [you're the only
   one here, so there's nothing to leave] and no primary.
7. **After leaving,** the household's People screen shows the former member's
   profile as unclaimed and it can be invited again (no special state).

**Copy direction.** Keys `invite.*`, `join.*`, `claim.*`, `people.invite`,
`people.invitePending`, `people.claimed`. Plain and warm, and honest about what
is shared. No names beyond the profile's, no email shown anywhere.

**Components:** Sheet, Input (read-only), Button, Card, EmptyState, Notice,
LogoWordmark, ListRow, ConfirmSheet, Skeleton. No new component.

**Design acceptance criteria**

- The inviter is told what a joiner shares before the link is made, and the
  link needs no email address.
- The invitee sees the profile's history summary and what joining shares
  before signing in, and nothing is claimed until an explicit Confirm.
- Cancelling at any step leaves everything as it was and the link usable.
- A used, expired or withdrawn link says only that it no longer works.
- A person with history of their own is told plainly that joining isn't
  possible with that account, and nothing is merged or deleted.
- A claimed profile shows as claimed in People and cannot be invited again.
- "Leave this household" is in Profile, Account, only when the household has
  more than one login; its sheet says what stays, what starts new (an empty
  household with a fresh profile), that the only owner's role passes to the
  longest-standing member, and that nothing is deleted.
- Leaving has one primary, a cancel that changes nothing, a failure that leaves
  everything as it was, and a success that lands on the new household's
  first-run Brew.
- Nothing from Google is shown or stored beyond the sign-in.
- Every state works at 375 px, with a screen reader, and in right-to-left.

**Design tasks** (`design`)

- DES-05-02-01 Design the inviting side: SH-PERSON's invite state and SH-INVITE
  (create, copy, share, pending, withdraw, expired) (4 h).
- DES-05-02-02 Design SCR-JOIN's landing with the history summary and the
  sharing lines, and the invalid-link state (5 h).
- DES-05-02-03 Design the claim confirmation, the done state and the blocked
  cases (4 h).
- DES-05-02-04 Add stories for SH-INVITE and each SCR-JOIN state, including
  the read-only Input with copy, in right-to-left (3 h).
- DES-05-02-05 Design leaving the household: the Account row (only with more
  than one login), SH-LEAVE with the plain statement and the only-owner line,
  and its success, failure, cancel and alone states (3 h).

---

### EPIC-05-03: Keep your coffee history when you change phones (#34)

**Questions closed in round 8 (accepted):** DQ-16 and DQ-40 (the plain button,
an account already linked, where the new-device offer lives). **For the
story-writer:** STORY-05-03-02 AC 3 says the offer comes "before a new account
is set up"; it must be reworded, because the offer is now on the first-run Brew
screen and in Profile (step 7, PEC-19).

**Entry points.** (1) SCR-PROFILE, section Account. (2) A one-time Card on Brew.
(3) On a device with nothing set up, a quiet link on Brew's first-run checklist
for people who already use Tare elsewhere. SCR-START is **not** changed (see
step 7).

**Screens and sheets touched.** SCR-PROFILE (the device section becomes
Account), SCR-HOME (Card, first-run link), new SH-SWITCH (ConfirmSheet),
SCR-START unchanged.

**UX flow: linking**

1. **Account section** (`profile.accountTitle` [account]) replaces the device
   section. Not linked: the existing calm sentence, now with its action: your
   history lives on this phone; link a Google account to keep it if you change
   phones or the browser clears its storage. A secondary Button
   `profile.linkGoogle` [link your Google account]. It is a plain monochrome
   button with text, no Google logo, which keeps the system monochrome and
   avoids the logo rules (DQ-16; to be checked against Google's current
   guidelines before build).
2. **While linking.** The button is busy; Google opens in its own window (a
   redirect on iOS Safari, where pop-ups are unreliable). On return the user is
   back on Profile.
3. **Linked.** The section reads `profile.linked` [linked to Google] in `text-h3`
   and `profile.linkedBody` [your history is kept even if you change phones].
   Nothing from the Google account is shown or taken: no name, no email, and
   the profile's label is unchanged (STORY-05-03-01 AC 2). There is no unlink
   or sign-out in this epic.
4. **Cancelled.** Back to the unlinked state with no message: the user did it.
   **Failed:** a neutral Notice, urgent, `profile.linkFailed` [couldn't link
   right now. Nothing has changed] with `actions.retry`.
5. **This Google account is already linked to another Tare history** (the
   epic's open question, DQ-40). Two cases, decided by the "nothing entered
   yet" test of this device (pattern 2):
   - **This device has nothing entered:** SH-SWITCH (ConfirmSheet) says
     `switch.title` [this Google account already has a Tare history] and offers
     the primary `switch.confirm` [switch to that history] and a ghost
     `actions.cancel`. Because this phone is empty, nothing is lost. This is the
     new-phone path: STORY-05-03-02.
   - **This device has history:** a neutral Notice, `profile.linkTaken` [that
     Google account already has a Tare history, so it can't be linked to this
     one. Your data here is unchanged. Use a different Google account]. Tare
     never merges two histories (S-02 has no rule for it).
6. **One gentle prompt on Brew.** A Card (outline, `padding md`) shows once,
   after the first recipe is pinned or the tenth shot is logged, whichever
   comes first: `home.linkPrompt.title` [keep your history safe], one sentence,
   a secondary `home.linkPrompt.action` [link Google], a ghost
   `home.linkPrompt.dismiss` [not now]. Dismissing means it never returns; the
   Account section stays. Never beside the re-dial Card, never during a pulled
   state, never once linked. Dismissal is remembered on the device (no schema
   change; DQ-40), so a cleared browser can show it again, which is acceptable.
7. **Signing in on a new phone.** The account is created at once and silently
   (EPIC-01-01), so asking "sign in first?" before it exists would put a choice
   in front of the 1-second start, which the MVP rejects. Instead, a device with
   nothing entered shows, under the first-run checklist, a quiet ghost link
   `home.firstRun.haveAccount` [already use Tare? Sign in with Google]. It opens
   Google; the account-already-linked case in step 5 (empty device) switches to
   the existing history. The same link is in Profile's Account section, so a
   user whose storage was cleared finds it in either place. This changes
   STORY-05-03-02 AC 3, which says "before a new account is set up" (PEC-19).

**States**

| State | Design |
|---|---|
| Not linked, linking, linked, cancelled, failed | As steps 1 to 4. |
| Account taken, device empty or not | Step 5. |
| Switch fails | SH-SWITCH stays; Notice with retry; nothing changes. |
| After a successful switch | A full refresh to Brew with the existing history; a polite status `switch.done`. |
| Prompt dismissed or linked | Never shown. |
| Offline | Linking fails with the failure Notice. |

**Copy direction.** Keys `profile.accountTitle`, `profile.linkGoogle`,
`profile.linked*`, `profile.linkFailed`, `profile.linkTaken`, `switch.*`,
`home.linkPrompt.*`, `home.firstRun.haveAccount`. Factual, never alarming
(7a "data-loss risk"); no mention of a name or email.

**Components:** Button, Card, Notice, ConfirmSheet (SH-SWITCH), Checklist
(a ghost link under it), PageHeader. No new component.

**Design acceptance criteria**

- Linking from Profile is two taps (link, Google's own flow), and afterwards
  everything is as it was; the profile's label is unchanged.
- No colour, logo or name from Google appears in the app.
- A cancelled link returns silently; a failed one says nothing changed and
  offers retry.
- A Google account already in use never merges histories: an empty device can
  switch with one explicit confirmation, a device with history is told no and
  keeps its data.
- The Brew prompt appears at most once, never beside another Card, and the Pull
  button stays visible on 375 x 667 with it shown.
- A person on a new or cleared phone can reach their history from the first-run
  Brew screen or Profile without a wall at start-up.

**Design tasks** (`design`)

- DES-05-03-01 Design the Account section (unlinked, linking, linked, failed)
  and the one-time prompt Card (5 h; was 4).
- DES-05-03-02 Design SH-SWITCH and the account-taken Notice, with the empty
  and non-empty device rules and copy (3 h).
- DES-05-03-03 Design the first-run "already use Tare?" link and verify Brew's
  one-card rule at 375 x 667 with the re-dial and link Cards (3 h).

---

## 6. Later epics (brief direction only)

These will be re-planned before they are built, so only a direction is given
here; flows, states and tasks come with the re-plan. All AI output follows
the same rules: shown as a suggestion the user can accept or ignore, never as
a fact, in ink, with signal reserved for shot warnings.

- **EPIC-05-02 Invite them to take over their own profile:** now fully
  designed in section 5 (rounds 7 and 8, approved). It moved from Later to Next
  (sequenced last) in `epics.md` revision 11.
- **EPIC-06-01 Scan a bag instead of typing it:** a "scan" entry at the top of
  SCR-BAG-ADD; results fill the same form for review, with empty fields left
  empty (no guessed values shown as filled).
- **EPIC-06-02 Get a grounded fix when a shot goes wrong:** the coach's
  advice appears on SCR-TASTE and in fix mode as one sentence of diagnosis and
  one action, with the suggested values applied as "was" changes in ShotDial
  that the user can accept. Sources available on request. *Round 5:* it
  should reuse the MVP's rules-based SuggestionCard (NC-16) and only change
  where the advice comes from, so users see one familiar card.
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
- **PEC-02 EPIC-01-02: first-setup shortcut and setup editing.** To keep
  time to first shot short, offer "make these your setup" once a machine
  and grinder exist, with a translated default name stored at creation
  (DQ-01). Also resolve the open question by allowing setup edits (history
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

- **PEC-07 EPIC-02-01 (with EPIC-01-02): recipes after a setup's machine or
  grinder changes.** Setup editing (PEC-02) lets a user swap the grinder or
  machine in a setup that has recipes. A recipe's grind (and any temperature
  or pressure step) only means something on the unit it was pinned with
  (S-02), so pulling it with one tap on the new unit would record a shot that
  never happened. Proposal: EPIC-02-01, which owns "which recipe applies now",
  treats a recipe whose grinder or machine is no longer in its setup as
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

- **PEC-02, editing part: reversed** in epics revision 6 (setups never change).
  The first-setup shortcut stays.
- **PEC-07: superseded** in epics revision 6 by the fixed-setup rule. Its
  swap confirmation and needs-re-dial state are removed from this design;
  "dial in from the closest setup" (EPIC-02-01) replaces them.
- **PEC-08:** stands, as designed.

### New in round 3 (accepted, applied in epics revision 7)

**PEC-09 was accepted by the Head of Product at round-3 approval** and is
applied in `epics.md` revision 7.

- **PEC-09 EPIC-02-02 (with EPIC-01-02): switch setup on the home screen and in
  the shot log.** Revision 6 leaves open which setup is current and how the user
  switches. Proposal: the current setup is the setup of the persona's last shot
  (DQ-18), and the user switches by choosing a setup, or "change a part", from
  the setup line on SCR-HOME and the setup field in SCR-LOG; the choice becomes
  current. Same pattern and cost as PEC-03. Small; no size change expected.
  It answers EPIC-01-02's and EPIC-02-02's "current setup" questions.

### New in round 5 (proposed, pending the Head of Product and the epic-planner)

The round-5 decisions are already made in S-02 and S-08, but epics revision
8 doesn't place them yet. These say where the design assumes they live.

- **PEC-10 EPIC-02-03: own the dial-in suggestion.** The rules-based
  suggestion (S-02) ships in the MVP, but no MVP epic has it in scope;
  EPIC-06-02 is the Later AI Coach. EPIC-02-03 already owns the off path and
  the pre-filled log, so the suggestion, SH-OFF and the pre-fill belong
  there. The rules need evals (S-02), so this likely moves EPIC-02-03 from S
  to M. The alternative is a new MVP epic under INIT-04 (drift-aware
  dial-in), which would also be the natural home for the freshness
  explanations.
- **PEC-11 EPIC-01-05: rescope to "just right" tasting.** Replace the four
  absolute scores and defect tags with the four just-right questions and six
  observation tags (S-02). Asking them on the off path (SH-OFF) and on
  one-tap shots in edit mode is included (DQ-23). Size probably stays S.
- **PEC-12 EPIC-01-03 (with EPIC-01-01, 02-01, 02-02): milk.** The starter
  milk list is created with the household (EPIC-01-01). Milk type and amount
  are logged for milk drinks (EPIC-01-03), stored on recipes (EPIC-02-01)
  and copied by one-tap pulls (EPIC-02-02). Each piece is small; EPIC-01-03
  may sit at the top of M.
- **PEC-13 EPIC-02-05 (Next): edit the milk list too.** Milk-list editing is
  not in the MVP: the starter list covers most households, and a household
  that alternates milks can add a drink such as "Oat flat white" (S-02),
  which is Next work anyway. Proposal: EPIC-02-05 becomes "Make the drink and
  milk lists yours", with the same rename, hide, add and order flow for
  milks. Small; stays S.
- **PEC-14 EPIC-02-06: filters and "dial in from this" (an applied Head of
  Product decision, for the epic-planner to record).** EPIC-02-06's scope
  has "filtering, search, charts or analysis" out. The Head of Product has
  now put filters by drink, coffee and setup in, with Brew's drink and coffee
  as the default, plus "Dial in from this" on shot detail. Search, charts and
  analysis stay out. EPIC-02-06 probably moves from S to the small end of M.
  *Round 6:* the tab is now "Journal" (S-02).

### New in round 6 (for the epic-planner)

- **PEC-15 EPIC-03-01: the Tried section and the coffee screen; Beans
  filters in Next.** This is an applied Head of Product decision (S-02), to
  record. The Tried section of Beans and SCR-COFFEE ship in the MVP, but no
  epic has them in scope.
  - Proposal: EPIC-03-01, which owns the pantry list, also owns Tried and
    the coffee screen. That probably takes it from M to the top of M. The
    alternative is a small new MVP epic under INIT-03 ("See every coffee
    you've tried").
  - Beans filters (roaster, roast level, origin, rating) are Next and need
    an epic. Origin also needs a catalog field the schema doesn't have yet.
  - The renames (Journal, Beans) need no epic change beyond wording.

### New in round 7 (accepted in round 8, applied in epics revision 11)

Raised while designing the nine Next epics (section 5). **Round 8 status: the
Head of Product accepted PEC-16 to PEC-22, with PEC-20 adjusted (EPIC-05-02
stays in this breakdown as Next, sequenced last, not Later), and the
epic-planner applied them in `epics.md` revision 11.** The text below is kept as
proposed, for the record, with the accepted outcome noted per item.

**Also applied in round 8 (Head of Product decisions, not proposals):**
- **Sugar on recipes (EPIC-02-01).** A pinned recipe remembers the sweetened
  toggle (yes or no); logs from it start pre-ticked. Design in 5.0a, DES-02-01-06.
  Needs a new recipe column and updated S-02, S-04 and S-08 wording (spec owner).
- **Milk (EPIC-02-05).** Conventional drinks define milk inherently; a variation
  such as "Americano with froth" is a custom drink with has-milk chosen at
  creation. No milk-on-any-drink change.

- **PEC-16 EPIC-02-04: add "use the coffee's recipe for this bag again".** A
  bag recipe that can be created but not removed is a trap: once a bag has an
  override, it can only be outranked by pinning another. Proposal: add to
  scope "remove a bag's own recipe", a ghost action on SCR-BAG with a
  confirmation. Small; stays S. Also records the recommended answer to INIT-02
  Q1 (DQ-29): a pin defaults to the coffee's recipe, and the first recipe for a
  coffee is always the coffee's.
- **PEC-17 EPIC-03-05: split run-out from Beans filters (or park the origin
  filter).** The two have nothing in common but the screen, and filters depend
  on a catalog field (origin) that the schema doesn't have and that needs a
  place on Add a coffee and in the seed list. Proposal: two epics, run-out
  (S to M) and Beans filters (S, with origin). INIT-03 already has six epics,
  the limit, so the filters epic needs a parent decision (for example a seventh
  INIT-03 epic by exception). *Accepted: new EPIC-03-07 "Find any coffee in
  Beans", by exception; EPIC-03-05 is run-out only.* If the epics stay merged, ship the filters without
  the origin chip until a coffee has an origin (the design hides the chip then).
- **PEC-18 EPIC-05-01: three scope clarifications.** (a) A profile with
  history can't be removed; an empty one can (DQ-35). (b) The current setup
  follows the household's last shot, not the persona's, so switching person
  never switches setup: this amends DQ-18 and answers the epic's own question
  (DQ-36). (c) A profile's first dial-in on a coffee, drink and setup starts
  from another profile's recipe for the same, and the Journal gains a Person
  filter (DQ-37). Stays M, at the top.
- **PEC-19 EPIC-05-03 (story level): the "offer to sign in on a new device"
  moves from SCR-START to the first-run Brew screen and Profile.** The account
  is created silently within a second; a choice in front of that would break
  "start brewing without setting anything up". STORY-05-03-02 AC 3 ("before a new
  account is set up") needs rewording for the story-writer. The epic itself
  stays as written. Also: the one-time prompt's dismissal is remembered on the
  device, with no schema change (DQ-40).
- **PEC-20 EPIC-05-02: two scope notes** (*adjusted by the Head of Product: it
  is Next, sequenced last, not Later*). (a) Every invite is
  tied to a profile to claim, so the epic's open question about joining
  "without a persona" is closed as not supported. (b) An invitee whose own
  account has history is refused, never merged (DQ-41). Invites also need a new
  table, which the epic doesn't mention (a tech note). Size stays L.
- **PEC-21 EPIC-04-02: scope the starting points and say it isn't AI.**
  (a) Drift applies only where the recipe is the starting point (Brew, dial in
  from a recipe), not in fix mode, "Dial in from this" or edit (DQ-34).
  (b) It is rules and statistics, so the "no AI" rule holds, but it ships with
  evals like the suggestion rules (DQ-43), which probably keeps it at L rather
  than letting it shrink.
- **PEC-22 EPIC-04-03: say which events prompt and that a decline is a zero
  shift.** Only grinder events marked as a recalibration prompt a re-dial; a
  clean or a repair doesn't (DQ-42). Declining stores a zero shift, so there is
  no separate "declined" state to build. No size change. The design also flags a
  consequence for EPIC-04-02 that is not a change: a plain clean starts a new
  grind period (as built, per S-02), so drift data resets after cleaning (7a).

Considered and **not** proposed: reordering the Next epics (the build order in
`tasks.md` stands) and any merge. EPIC-04-04 is the lowest-value Next epic
(only people who change to different burrs, and only after a second re-dial),
so it can be the last Next epic built without harming anything else; that is
the planner's call.

---

## 7a. UX concerns

- **Time to the first shot.** Before the first shot, a new user has to add a
  machine, a grinder, a basket, a setup and a bag, with three catalog
  searches. That's the opposite of "start brewing without setting anything
  up". The checklist, the first-setup shortcut (PEC-02), stock baskets listed
  first and return-to flows keep it to about two minutes, but it is still the
  weakest moment in the product. *Round 4:* with only three part kinds there
  is no temptation to describe every tool up front.
- **Connectivity at the machine.** There is no offline mode: a pull or a log
  fails without a connection. The design handles failure (nothing is
  recorded, retry offered), but a kitchen with poor signal will feel it.
- **Data-loss risk is invisible.** The MVP accepts that a lost device loses
  everything. The design adds one calm sentence in Profile and nothing else;
  confirm that's the right level, neither silent nor alarming.
- **Signal colour has almost nothing to show.** With no "ran fast" threshold,
  the only shot warning in the MVP is the "channelling seen" tag, which the
  user just told us about. *Round 5:* that's now by design. "Ran fast" lives
  on as part of a suggestion's reason, in ink, so it informs without alarm.
- **Is tasting still "seconds"? (round 5).** Yes, if the defaults hold: a
  good shot is three taps at most, and an off shot is two taps to a
  suggestion. But the screen now holds eleven controls (rating, four rows,
  six tags), so it can *look* like a form even when it isn't one. The
  mitigations: nothing is required; "all just right" in one tap; dot chips
  instead of labelled chips; tags behind a quieter overline; the primary
  always pinned. The risk to watch is the four rows reading as a survey. If
  usability tests show hesitation, show Balance and Strength first and fold
  Body and Sweetness under "more", without changing the data.
- **Suggestions must earn trust (round 5).** One wrong grind suggestion early
  on, especially in the wrong direction, could teach users to ignore them.
  That's why the direction is never guessed, the reason is always shown, and
  dismissing is one tap. The evals the spec requires matter more than the
  card.
- **A pre-filtered list can hide the shot you want (round 5).** Opening the
  Journal on Brew's drink and coffee is right most of the time. But someone looking
  for yesterday's shot of a different drink lands on a shorter list. The
  filled chips and the one-tap "All" make that visible and cheap to undo.
  Watch whether people expect the tab to remember their last filters instead.
- **Tried below On hand can be missed (round 6).** On one scroll, a
  household with many bags on hand pushes Tried below the fold. That's the
  right priority ("what do I have" first), but the Tried heading should stay
  reachable. If testing shows people miss it, a sticky section heading is the
  next step, not tabs inside the tab.
- **The summary line is a judgement (round 6).** "Mostly off" for a coffee
  the user simply hadn't dialled in yet could put them off a good bean. The
  line is worded as what happened ("shots"), not a verdict on the coffee, and
  it never uses colour.
- **"Journal" alongside "shots" (round 6).** The tab says Journal and its
  entries say shots. That's deliberate and reads naturally ("your journal of
  shots"). Copy must never call an entry a "journal entry".
- **Two places to taste a one-tap shot (round 5).** SH-OFF asks about the
  one-tap shot, and then SCR-TASTE asks about the fix shot. That's correct
  (two shots), but a user may feel asked twice. The design keeps SCR-TASTE
  for the fix shot because that's where the next suggestion comes from.
- **Phase 0 contrast issue.** `Input` styles placeholders in `ink-tertiary`
  at 16 px, which breaks the large-text-only rule (DES-01-01-04).
- **Six value tabs in ShotDial.** Machines with exact temperature and
  pressure give six tabs; on a 375 px screen they fit only as compact values.
  Needs testing with real locales (long labels in some languages).
- **"Not sure" degrades quietly (round 2).** Most people won't know their
  grinder's dial range or which way is coarser. The fallbacks keep logging
  working, but a grind wheel without direction captions and a 0 to 100 range
  is a weaker experience exactly where Tare promises to know your setup. The
  quiet `log.capUnknown` link and "answer later" (PEC-08) are the only nudges;
  a seed list that covers common grinders matters more than this form.
- **Setup swaps lose one tap (round 2).** *Superseded in round 3:* there
  are no swaps. The same effect remains in a calmer form: a new setup has no
  recipes, so each coffee and drink needs one dial-in on it before one tap
  returns. The home screen says so and starts from the closest setup.
- **Setups multiply (round 3).** Every combination is a setup, so a household
  that tries a new basket for a week gains a setup with no recipes, and
  going back brings the old one back. That's correct, but the setup list can
  grow. Recently used first, plus collapsing setups unused for 90 days, keeps it
  calm. Setups shown only by parts can look alike; the parts name adds the
  basket when needed, and naming is one tap away. *Round 4:* with three parts
  this grows far more slowly.
- **Small parts reset recipes (round 3).** *Largely resolved in round 4:*
  tamper, portafilter and prep tools are no longer setup parts, and WDT and
  puck screen are checkboxes on the shot, so changing them never makes a new
  setup or costs the one-tap pull. Only a basket swap (which does change the
  recipe) still makes a new setup, and its grind carries over because the
  grinder is the same. Original concern, for the record: swapping only a
  tamper or a puck screen made a new setup, so the next shot was a dial-in
  rather than one tap.
  Grind does carry over when the grinder is the same (DQ-20), so it's one
  quick dial-in, but users may feel it as friction for a small change. Worth
  watching in use. If it bites, the fix is in the rule (which parts define a
  setup), not the design. *Accepted at round-3 approval:* the Head of Product
  confirmed that any part change makes a new setup. This concern is accepted
  and will be revisited if users find it fussy.
- **Two clocks, one line (round 3).** *Resolved at round-3 approval:* Home
  shows both clocks on one line, so an old coffee opened yesterday reads "N
  days since roast · 1 day open".
- **Which basket is mine? (round 4).** Many people use the basket that came
  with the machine and don't know its maker and model. Because the basket is
  now a required part, that's a new question at the first setup. Listing the
  machine maker's baskets first helps only if the seed catalog has them
  (DQ-22).
- **One-tap copies prep (round 4).** A user who sometimes skips the WDT will
  have one-tap shots recorded with the recipe's prep. That's the intended rule
  (S-02), and the home screen's quiet prep line makes it visible, but such
  shots need an edit to be accurate.

**Round 7 (Next epics, approved after round 8):**

- **Brew gets busier (round 7).** Five Next epics add something to Brew: a
  person select, a bag-only line, an adjusted-grind line, a re-dial Card and a
  link Card. Each is quiet and most appear rarely, and the rule is one card at a
  time, but the home screen is the product's calmest surface and the one most
  likely to be crowded by well-meant additions. DES-05-03-03 checks the
  375 x 667 case; if the Pull button ever leaves the screen, the card loses, not
  the button.
- **An adjusted grind is a claim about the user's own beans (round 7).** If
  Tare moves the grind by two steps and the shot is worse, trust in every later
  suggestion falls, the same risk as the dial-in suggestions (round 5). The
  mitigations: show nothing without real evidence, never adjust fix mode, show
  the recipe's number beside it, a one-tap "use my recipe", and a cap. The
  evals matter more than the sheet.
- **A clean wipes the drift data (round 7).** As built, and per S-02, every
  grinder event starts a grind period, so the shots before a routine clean
  stop counting for drift (EPIC-04-02) although a clean rarely changes the dial.
  The re-dial prompt avoids it (only recalibrating events prompt), but the drift
  data does reset. If users clean weekly, the adjustment may rarely have enough
  shots. The fix, if it bites, is in the rule (periods start only at
  recalibrating events), not in the design.
- **Second-hand taste answers (round 7).** When a member answers "just right"
  for someone else, the answers are the member's reading. The screens say "for
  {name}" and nothing more; no flag is stored. If the profile is later claimed,
  its history includes answers that the person never gave themselves.
- **Joining shares everything in the kitchen (round 7).** Taking over a profile
  means seeing the household's equipment, beans, recipes and every profile's
  shots. The invite and the landing say so before sign-in and again at the
  claim. A joiner can leave later from Profile, Account (SH-LEAVE, designed in
  EPIC-05-02), keeping nothing of the household's kitchen, which is the price of
  the shared kitchen; the leave sheet says so (INIT-05 Q3, DQ-41b).
- **Switching to a linked history looks destructive (round 7).** On a new phone
  the user is told "this Google account already has a history" and offered to
  switch away from the empty one just created. For an empty device nothing is
  lost, but the wording must make that obvious. For a device with history the
  answer is a refusal, which can feel like a dead end to someone who set up a
  second phone first; the Notice names the way out (a different account), and a
  merge is out of scope.
- **People's names are personal data the user types (round 7).** Profiles need
  a name, and the app stores whatever is typed. The design asks for nothing
  else and the hint says a nickname is enough, but it is worth a line in the
  privacy copy when the network arrives (S-07).
- **Origin has no data yet (round 7).** The origin filter is useless until the
  seed list and Add a coffee carry origin. The chip hides itself until then, so
  nothing is broken, but the filter row may launch with three chips.
- **A run-out estimate that is wrong costs trust (round 7).** Households that
  log little will see a long estimate and run out early. SH-RUNOUT shows the
  share of weight logged for that reason, and the line is hidden when use is
  stale, but the share should be visible without opening the sheet if testing
  shows people miss it.
- **Configuration screens grow Profile (round 7).** Profile goes from three
  sections to five. Rows with one-line summaries keep it a list, not a page of
  forms; if it grows again, People and Lists can move under a "Household" row.

## 8. Design questions for the Head of Product

Design-level questions this draft answered with an assumption. Each can be
reversed without changing the structure.

- **DQ-01** Default setup name. *Closed in round 3 by S-08:* a setup's name
  is optional; without one it's shown by its parts name.
- **DQ-02** Time-of-day drink: assumed the persona's most recent drink with a
  shot within 90 minutes either side of now on any of the last 14 days; else
  the most recent drink at all; else the first visible drink (Espresso).
- **DQ-03** Which coffee the home screen shows (SQ-06): assumed the
  earliest-opened open portion whose bean has a recipe for this persona and
  drink on the current setup; else the earliest-opened open portion; else the
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
  shot on this setup; with none, dose 18 g, yield 36 g, time 28 s, grind at
  the middle of the grinder's range.
- **DQ-08** Defect list. *Closed in round 5 by S-02:* six observation tags
  replace defects.
- **DQ-09** "Ran fast" threshold: not defined; the warning is left out until
  it is. *Round 5:* "ran fast" appears only inside a suggestion's reason
  (time is a diagnostic, S-02), never as a `signal` warning.
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
  guidelines allow? *Round 7:* recommended answer in DQ-40 (a plain text
  button, no Google logo).
- **DQ-17** (round 2, the EPIC-02-02 open question) Does a drink or coffee
  changed on the home screen stick for the next pull? Assumed: no saved
  setting. A change applies to the next pull. Once pulled, the drink sticks
  through history (the time-of-day rule picks the drink just pulled), and the
  coffee sticks because the last pulled coffee for this persona and drink wins
  over the DQ-03 default while it has an unfinished portion. A change with no
  pull resets after 30 minutes away from the home screen. Details in section
  2.3.
- **DQ-18** (round 3, EPIC-01-02 and 02-02) Which setup is current? Assumed:
  the setup of the persona's last shot (measured or one-tap); before any shot,
  the newest setup. Choosing a setup on SCR-HOME, in SCR-LOG or with
  `setup.useThis` makes it current at once, without waiting for a shot. Home
  always shows the recipe on the current setup, so a one-tap pull always uses
  the recipe's setup and the two can't disagree (PEC-09).
- **DQ-19** (round 3, EPIC-02-01) Closest setup ties: among setups with a recipe
  for this bean, persona and drink, the one with the most parts in common
  with the current setup; ties go to the most recently used setup (latest shot
  on it).
- **DQ-20** (round 3, EPIC-02-01) Grind from a closest setup with a different
  grinder: dose, yield and time pre-fill from that recipe; grind doesn't. It
  starts at this grinder's last measured value, else the middle of its range,
  and the grind tab says so (`log.grindNotCarried`), because grind doesn't
  transfer between grinders (S-01). With the same grinder, grind pre-fills
  too. Temperature and pressure carry over only with the same machine.
- **DQ-21** (round 3, EPIC-01-02) Setup builder details. *Updated round 4:*
  one part per kind is now given by S-02 (one machine, one grinder, one
  basket, all required). Still assumed: a setup's name can be set or changed
  at any time, because the name is a label and not a part, so it doesn't
  change the setup.
- **DQ-22** (round 4, EPIC-01-02) The basket people don't know: assumed the
  seed catalog includes each machine maker's stock baskets by model, and the
  basket picker lists the household machine's maker's baskets first. Someone
  who still can't tell adds it through "Can't find it?" (EPIC-01-06). Confirm
  the seed covers stock baskets.
- **DQ-23** (round 5, answers SQ-17) Where does the one-tap off path ask the
  taste questions? Assumed: in SH-OFF, a sheet over Home straight after
  "off", before the fix log, so the suggestion can pre-fill the fix. No
  rating there. Answers are saved on the one-tap shot as its taste (this
  also settles review M1 for the off path: one-tap shots can carry just-right
  answers and tags, never a rating). "Skip" goes straight to the fix log, as
  before.
- **DQ-24** (round 5) Freshness thresholds for the explanations: assumed
  "very fresh, may channel" under 5 days since roast (or packing), and
  "likely past its peak" over 35 days since roast or over 21 days open, with
  freezer time excluded as usual. **Confirmed** by the Head of Product
  before wave 12. These are rule parameters, to be tuned by
  the rule evals; the design only needs the two phrases.
- **DQ-25** (round 5) How long a dismissal lasts: assumed until the next shot
  on that coffee, setup and drink. A new shot gives a fresh suggestion. On
  the device only; nothing new is stored.
- **DQ-26** (round 5) Milk amount control: a NumberWheel tab in millilitres,
  step 10, range 0 to 500, pre-filled from the recipe or the drink's typical
  amount. The milk type starts from the last shot of this drink, else the
  first visible milk.
- **DQ-27** (round 6) What counts as "tried": assumed a coffee with at least
  one shot (measured or one-tap) in this household. A bag added but never
  brewed shows only under On hand until its first shot.
- **DQ-28** (round 6) The Tried summary line, in words and calculated:
  - With three or more rated shots: "mostly good" (most ratings 4 or 5),
    "mostly off" (most 1 or 2), else "mixed".
  - With fewer: "last rated N of 5".
  - With no ratings but reactions: "mostly good" or "mostly off" from good
    and off.
  - Otherwise: "no ratings yet".
  Persona-blind in the MVP (one persona); per persona once sub personas
  exist.

### Rounds 7 and 8: questions that block a Next epic

**Round 8 status: the Head of Product accepted DQ-29 to DQ-43 as recommended,
except DQ-32, which is revised (below).** The "recommended" and "confirm" wording
in DQ-29 to DQ-43 is kept as written in round 7 and now reads as decided. New
open questions from `epics.md` revision 11 follow as DQ-44 to DQ-49, each with
a recommended answer. Each names what it **blocks**. Each can change without
changing the structure.

- **DQ-29** (INIT-02 Q1, the spec's "still open"; **blocks EPIC-02-04**). Does
  pinning update the bag's override or the coffee's default? *Recommended:* a pin
  updates the **coffee's** recipe by default, as the built MVP does; "this bag
  only" is an explicit choice in SH-PIN. Exceptions: the first recipe for a coffee
  is always the coffee's (no scope row), and when the bag already has its own
  recipe the chip defaults to this bag only. Reason: an odd bag should never
  overwrite the recipe a household relies on without being asked, and a new bag
  must always have something to start from. *Head of Product to confirm.*
- **DQ-30** (INIT-04 Q4; **blocks EPIC-04-02**). Is the suggested grind a
  changed value, a note, or both? *Recommended:* both, as designed: the grind
  value shown is the adjusted one, with the recipe's grind and the reason on one
  quiet line, and the full trail in SH-DRIFT. Only when the adjustment is at  
  least one grinder step. *Head of Product to confirm.*
- **DQ-31** (INIT-04 Q3; **blocks EPIC-04-02 and 04-03**). How is bean-aging drift
  estimated, from how many shots, and which clock? *Recommended:* the
  since-roasting clock drives the age trend (that is when grind needs move), the
  since-opening clock may add a smaller term, and the estimate needs at least
  three measured shots on the coffee in the current grind period, spread over at
  least two different ages; fewer means no adjustment and nothing shown. The
  design only needs to say it in one phrase ("beans have aged") and to list the
  evidence in SH-DRIFT. *For the rules owner; Head of Product to confirm the
  minimum.*
- **DQ-32** (INIT-04 Q2; **EPIC-04-02**). **Revised by the Head of Product,
  round 8; replaces "last 5 shots".** The window is time, not a shot count,
  because households differ in volume (2 versus 5 shots a day, several people on
  one bag). The rule:
  - Use the bag's measured shots from the **last 3 days of the current grind
    period**; at least 3, reaching further back if needed but **never past the
    last maintenance**; at most 10.
  - Weight by age in time: today's shots count about twice as much as shots from
    3 days ago.
  - **Pool shots from every persona** on the same coffee and grinder as a
    relative signal (for example "running about 10% fast against its recipe"),
    each judged against the recipe it was brewed from, then turn that signal into
    a **separate grind nudge per recipe**.
  - Fall back to pooling within the same basket if the evals show single and
    double baskets diverge. All numbers are starting values the evals tune; the
    same shots always give the same answer (STORY-04-02-04).
  - *Design consequence:* SH-DRIFT states the window in time ("in the last 3
    days", or "since 12 November" when it reached back), never a fixed shot count,
    says when the pool includes several people (without names), and keeps the
    prep "left out" line. See EPIC-04-02, step 2. Open follow-ups: DQ-45, DQ-46.
- **DQ-33** (SQ-18, prep; **blocks EPIC-04-02**). Are shots with and without WDT
  or a puck screen compared as equals? *Recommended:* no. Only shots whose puck
  prep matches the recipe's count towards the adjustment; the others are left
  out, and SH-DRIFT says how many ("2 shots with different prep weren't
  counted"). Reason: prep changes how a shot runs (S-02), and mixing would blame
  the beans for the user's technique. *Head of Product to confirm.*
- **DQ-34** (the overlap with EPIC-02-03; **blocks EPIC-04-02**). When the
  drift adjustment and a one-change suggestion both apply on a pre-filled log,
  which wins? *Recommended:* they never meet. Drift applies only where the recipe
  is the starting point (Brew, dial in from a recipe). Fix mode starts from the
  off shot plus the suggestion, which is fresher evidence; "Dial in from this"
  and edit use the shot's own values. *Head of Product to confirm (PEC-21).*
- **DQ-35** (persona removal; **blocks EPIC-05-01**). Can a profile be deleted,
  and what happens to its shots? *Recommended:* only a profile with no shots and
  no recipes can be removed (after one confirmation). With history it stays, and
  can be renamed; the screen says why. Reason: shots, recipes and taste answers
  belong to the household's history and to a future claim (EPIC-05-02), and the
  schema has no archive column (S-02: only the UI changes). If lists of old
  guests become a nuisance, the follow-up is an "archive" flag (one column) that
  hides a profile from Brew while keeping its history. *Head of Product to
  decide (PEC-18).*
- **DQ-36** (persona switching; **blocks EPIC-05-01**). Does switching person
  also switch setup (DQ-18), and does it stick? *Recommended:* no on setup: the
  current setup is the setup of the **household's** last shot, since the machine
  on the counter is the same for everyone. A chosen person holds for 30 minutes
  away from Brew (DQ-17) and does not reset after a pull. Amends DQ-18's
  wording ("the persona's last shot"). *Head of Product to confirm (PEC-18).*
- **DQ-37** (profiles; **blocks EPIC-05-01**). (a) Does a new profile start a
  dial-in from another profile's recipe? *Recommended:* yes, for the same coffee,
  drink and setup, saying so, never as a one-tap pull. (b) Are taste answers a
  member gives for someone else treated differently? *Recommended:* no, they are
  asked the same way with "for {name}" as the only cue, and nothing extra is
  stored. (c) Do the Journal and Tried gain a person filter? *Recommended:*
  the Journal yes (a chip, defaulting to the person chosen on Brew); Tried shows
  the summary for the person chosen on Brew with a subtitle, no chip.
  *Head of Product to confirm (PEC-18).*
- **DQ-38** (hidden items; **EPIC-02-05**, the epic's open question). What
  happens to a recipe for a hidden drink, or a recipe or shot that uses a hidden
  milk? *Recommended:* recipes are kept and return on unhide; a hidden drink's
  recipes stay visible, marked, on SCR-BAG and SCR-COFFEE. A hidden milk that is
  already chosen stays shown by name where it is chosen and is never swapped
  silently; it just isn't offered as a new choice. A drink's "has milk" can't be
  changed after creation (it would reinterpret past shots). Names are unique.
  *Head of Product to confirm.*
- **DQ-39** (INIT-03 Q1, X-2 and filters; **(a) and (d): EPIC-03-05; (b) and (c): EPIC-03-07**). (a) Is
  prediction in the product now? *Recommended:* yes, it is already in Next and
  the MVP collects its data; shown only after about three finished portions and
  hidden when use is stale or filters are on. (b) What does a coffee's "rating"
  mean for the Beans filter? *Recommended:* Tried's own summary words (mostly
  good, mixed, mostly off, no ratings yet; DQ-28), so nothing new is invented.
  (c) When do Beans filters appear? *Recommended:* from six coffees; below that
  the row is clutter. (d) Accuracy target (X-2): the sheet shows its inputs
  and the logged share, rather than promising a precision. *(a) and (d): Head of
  Product; (b) and (c): confirm.*
- **DQ-40** (EPIC-05-03; DQ-16 resolved here). (a) The Google button (DQ-16):
  *recommended* a plain monochrome text button ("link your Google account")
  with no Google logo, which keeps the system monochrome and sidesteps logo
  rules; check against Google's current guidelines before build. (b) This Google
  account is already linked to another history: *recommended* never merge; an
  **empty** device may switch to that history after one confirmation (the
  new-phone case), a device **with history** is refused with an explanation.
  (c) Where the new-device offer lives: *recommended* on the first-run Brew screen
  and in Profile, not on SCR-START (PEC-19). (d) Is the link prompt's dismissal
  remembered on the device? *Recommended:* yes, no schema change. *Head of
  Product to decide (b), confirm (a), (c), (d).*
- **DQ-41** (INIT-05 Q2, Q3 and the epic's open questions; **EPIC-05-02**,
  Next since revision 11, sequenced last). (a) Who can invite: *recommended* any
  household member, for a profile they can see; the joiner becomes a member.
  (b) Leaving the household, **accepted and designed (SH-LEAVE, DES-05-02-05)**:
  the leaver's profile and history stay with the household as an unclaimed
  profile, and the leaver starts a new, empty household of their own with a fresh
  profile; if the only owner leaves, the longest-standing member becomes owner.
  It ships with invites. (c) Delivery:
  *recommended* a one-use link valid 7 days that the member sends themselves; no
  email collected. (d) Joining without a profile to claim: *recommended* not
  supported; an invite always names a profile. (e) An invitee with their own
  history: *recommended* refused, never merged, same "nothing entered yet" test
  as DQ-40. *Head of Product to decide when the epic is re-planned.*
- **DQ-42** (EPIC-04-03 open questions). (a) Which events prompt a re-dial:
  *recommended* only grinder events marked as a recalibration (default on for
  burrs and re-zero, DQ-15). (b) Machine repair or other non-grinder events:
  *recommended* no effect. (c) Chaining: *recommended* each confirmed shift
  after a recipe's pin is applied in date order. (d) Declining: *recommended*
  stores a zero shift, no separate state. (e) A re-dial with no earlier recipe:
  no shift, and it says why. *Head of Product to confirm (PEC-22).*
- **DQ-43** (EPIC-04-02 and 04-04; method). (a) Is drift AI? *Recommended:* no,
  rules and statistics, but with evals like the suggestion rules (S-02), because
  it moves a number the user will set a grinder to. (b) How to fit shift and
  stretch from more than two coffees and what to do when they disagree:
  *recommended* a least-squares line through all re-dials, flagged uncertain
  past a threshold, with the user always able to edit; stretch shown only for
  burrs events. *For the tech lead and rules owner.*

**New in round 8 (from `epics.md` revision 11). Accepted as recommended by the Head of Product after round 8 (DQ-44 to DQ-49):**

- **DQ-44** (EPIC-02-01 sugar and EPIC-02-02; **blocks EPIC-02-02's copy**).
  (a) Does a one-tap pull copy sweetened? *Recommended:* yes, the same rule as
  prep and milk, so daily use records what the recipe describes; Brew's quiet
  recipe line shows "sweetened" before the pull so it is never a surprise, and
  the pulled state says "sweetened" only when it was. (b) Can sweetened change on
  Brew before a pull? *Recommended:* no (it is out of scope in revision 11 and
  Brew has no controls beyond drink, coffee, person and setup); a user who
  sweetens on some days pulls via Dial in, where the toggle is one tap, or
  edits the shot after. (c) Which shot's value wins when pinning from a past
  shot: that shot's. A one-tap shot can't be pinned, so a household that only
  uses one-tap has the value from its last manual pin. *Head of Product to
  confirm (a) and (b).*
- **DQ-45** (EPIC-04-02; **blocks the rules**). Shots store no link to the recipe
  they were brewed from, so "judged against the recipe it was brewed from" needs a
  rule. *Recommended:* the recipe in force at the time of the shot, that is the
  latest pin for the same coffee, persona, setup and drink (with a bag's own
  recipe winning for its bag) pinned before the shot; a shot with no recipe before
  it is left out and counted in SH-DRIFT's "left out" line. No new column. A
  shot pulled by one-tap is already excluded (not a measurement). The follow-up
  if the evals show this misattributes (for example after a re-pin mid-day) is a
  nullable recipe link on shots, which is a schema change for the tech lead.
  *For the rules owner; Head of Product to confirm.*
- **DQ-46** (EPIC-04-02). Pooling spans setups that share a grinder: is that
  intended? *Recommended:* yes. Grind is relative to one grinder and one period
  (S-02), so the same bag on the same grinder under two machines tells the same
  story about the bag; each shot is still judged against its own recipe, and the
  nudge is per recipe. The sheet says "includes shots on your other setup with
  this grinder". Baskets are the known divergence (the basket fallback in
  DQ-32). Shots on a different grinder are never pooled. *Head of Product to
  confirm.*
- **DQ-47** (EPIC-04-02; 7a). Keep "a clean resets drift"? *Recommended:* keep it
  for now, because S-02 defines a period by any maintenance event and the 3-day,
  reach-back-to-maintenance window already needs only 3 shots to recover. If
  weekly cleans mean the adjustment rarely shows, change the rule so periods
  start only at recalibrating events, which is a rule change, not a design
  change. *Head of Product to confirm; revisit with the evals.*
- **DQ-48** (EPIC-05-01). Which recipe does a new profile start from when several
  profiles have one for the same coffee, drink and setup? *Recommended:* the
  household's main profile's recipe if it has one; otherwise the most recently
  pinned or used by any profile. Always named on Brew's line (`home.startsFromPerson`,
  with that profile's name) so the source is visible, and never a one-tap pull.
  *For the Head of Product to confirm.*
- **DQ-49** (EPIC-03-07). Who fills coffee origin, and how are blends handled?
  *Recommended:* the Head of Product as admin fills the seed list (as with the
  seed hardware); households fill it for coffees they add, optionally, and can set
  it later while the coffee is unverified. A blend has its own value
  (`catalog.origin.blend`) and "other" covers the rest; origin is never inferred
  from a coffee's name. A merged coffee with two origins keeps the surviving
  entry's, an EPIC-06-07 matter. *Accepted.*

DQ-44 to DQ-49 are all **accepted as recommended** (approval after round 8).
DQ-41b is resolved: the "Leave this household" screen ships with invites.

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
| EPIC-01-02 | DES-01-02-01: 6 · 02: 8 · 03: 5 · 04: 6 · 05: 8 · 06: 6 | 39 h |
| EPIC-01-03 | DES-01-03-01: 10 · 02: 12 · 03: 4 · 04: 5 · 05: 4 · 06: 8 | 43 h |
| EPIC-01-04 | DES-01-04-01: 6 · 02: 4 | 10 h |
| EPIC-01-05 | DES-01-05-01: 10 · 02: 6 · 03: 4 · 04: 3 · 05: 3 | 26 h |
| EPIC-01-06 | DES-01-06-01: 8 · 02: 4 · 03: 7 · 04: 3 · 05: 7 | 29 h |
| EPIC-02-01 | DES-02-01-01: 5 · 02: 4 · 03: 3 · 04: 5 · 05: 4 · 06: 4 (round 8, sweetened) | 25 h |
| EPIC-02-02 | DES-02-02-01: 11 · 02: 6 · 03: 3 · 04: 4 · 05: 4 | 28 h |
| EPIC-02-03 | DES-02-03-01: 5 · 02: 3 · 03: 6 · 04: 8 · 05: 5 | 27 h |
| EPIC-02-06 | DES-02-06-01: 9 · 02: 7 · 03: 4 | 20 h |
| EPIC-03-01 | DES-03-01-01: 4 · 02: 10 · 03: 6 · 04: 6 | 26 h |
| EPIC-03-02 | DES-03-02-01: 4 · 02: 3 · 03: 2 | 9 h |
| EPIC-03-03 | DES-03-03-01: 4 | 4 h |
| EPIC-03-04 | DES-03-04-01: 3 · 02: 3 · 03: 2 | 8 h |
| EPIC-04-01 | DES-04-01-01: 4 · 02: 4 | 8 h |
| **MVP** | **62 tasks** | **332 h** |
| EPIC-02-04 | DES-02-04-01: 4 · 02: 3 · 03: 2 | 9 h |
| EPIC-02-05 | DES-02-05-01: 6 · 02: 3 · 03: 4 · 04: 3 | 16 h |
| EPIC-03-05 (run-out only) | DES-03-05-01: 4 · 02: 3 | 7 h |
| EPIC-03-07 (new, Beans filters and origin) | DES-03-07-01: 4 · 02: 3 | 7 h |
| EPIC-04-02 | DES-04-02-01: 6 · 02: 4 · 03: 3 | 13 h |
| EPIC-04-03 | DES-04-03-01: 5 · 02: 6 · 03: 3 · 04: 3 · 05: 3 | 20 h |
| EPIC-04-04 | DES-04-04-01: 4 · 02: 3 · 03: 2 | 9 h |
| EPIC-05-01 | DES-05-01-01: 6 · 02: 4 · 03: 5 · 04: 2 | 17 h |
| EPIC-05-02 (Next, last) | DES-05-02-01: 4 · 02: 5 · 03: 4 · 04: 3 · 05: 3 (leaving) | 19 h |
| EPIC-05-03 | DES-05-03-01: 5 · 02: 3 · 03: 3 | 11 h |
| **Next (rounds 7 and 8, approved)** | **34 tasks** | **128 h** |

MVP: 56 design tasks, 275 h (round 3 added DES-02-01-05 and redefined or
updated DES-01-02-01, 03, 04, 06, DES-01-03-05, DES-01-05-01, DES-02-02-03,
DES-03-01-01 to 03 and DES-03-03-01). Round 4 resized seven tasks, a net +3 h:
DES-01-02-03 (6 to 5 h) and DES-01-02-04 (8 to 6 h) shrink with three part
kinds, while DES-01-03-01 (8 to 10 h), DES-01-03-04 (4 to 5 h), DES-02-01-01,
DES-02-01-04 and DES-02-06-02 (each +1 h) grow with puck prep. No new tasks.

Round 5 adds four tasks and 37 h, taking the MVP from 275 h to 312 h:
- **New tasks:** DES-01-03-06 milk (8 h), DES-02-03-03 SH-OFF (6 h),
  DES-02-03-04 SuggestionCard (8 h) and DES-02-03-05 suggestion copy (5 h).
- **Grown tasks:**
  - DES-01-05-01 tasting screen: 6 to 10 h;
  - DES-01-05-02 just-right scale: 4 to 6 h;
  - DES-01-05-04, redefined as copy for the questions and tags: 2 to 3 h;
  - DES-02-02-01 home: 10 to 11 h, for the "dial in with the suggested
    change" label and the milk line;
  - DES-02-03-01 off-to-fix flow: 4 to 5 h;
  - DES-02-06-02 shot detail: 5 to 6 h, for taste phrases.

The EPIC-02-03 tasks assume PEC-10.

The round-5 addition for recent-shot filters (PEC-14) adds 4 h with no new
tasks: DES-02-06-01 grows from 6 to 9 h for the filter row, default and
filtered empty state, and DES-02-06-02 from 6 to 7 h for "Dial in from
this". That makes the MVP 60 tasks and 316 h.

Round 6 adds one task and 10 h, taking the MVP to 61 tasks and 326 h:
- new DES-03-01-04, the coffee screen (6 h);
- DES-03-01-02 grows from 6 to 10 h, for Beans' two sections, the grouping
  and three empty states.
The renames (Journal, Beans) cost no design time beyond copy keys. These
tasks assume PEC-15.

The round-6 addendum (basket dose range) adds 2 h with no new tasks:
DES-01-06-03 and DES-01-06-05 each grow by 1 h. That makes the MVP 61 tasks
and 328 h.

Next (before round 7): 9 tasks, 33 h. Later: none until re-planned.

**Round 7 (2026-11-15, draft pending approval)** brings the Next epics to full
detail and takes them from 9 tasks and 33 h to **33 tasks and 124 h** (+24
tasks, +91 h). The MVP was unchanged at 61 tasks and 328 h (round 8 below
changes both).
- **Grown tasks (same IDs):** DES-02-04-01 (2 to 4 h), DES-02-05-01 (5 to 6 h),
  DES-03-05-01 (3 to 4 h), DES-04-02-01 (4 to 6 h), DES-04-03-01 (6 h to 5 h,
  redefined: the prompt and start only; the sheet is now DES-04-03-02),
  DES-04-04-01 (2 to 4 h), DES-05-01-01 (4 to 6 h), DES-05-01-02 (3 to 4 h),
  DES-05-03-01 (4 to 5 h).
- **New tasks:** DES-02-04-02 and 03; DES-02-05-02 to 04; DES-03-05-02 to 04;
  DES-04-02-02 and 03; DES-04-03-02 to 05; DES-04-04-02 and 03; DES-05-01-03
  and 04; DES-05-02-01 to 04 (EPIC-05-02 had none); DES-05-03-02 and 03.
- **Order:** each epic's tasks should land before its build wave. Shared work
  goes first: DES-04-02-02 (SH-DRIFT) before DES-04-03-04, and DES-05-03-02
  (the "nothing entered yet" rule) before DES-05-02-03.
- **Assumptions:** the estimates assume the recommended answers in DQ-29 to
  DQ-49; PEC-16 is already counted in DES-02-04-02.

**Round 8 (2026-11-15, draft pending approval)** applies `epics.md` revision 11
and changes the totals to: **MVP 62 tasks and 332 h** (+1 task, +4 h) and **Next
34 tasks and 128 h** (was 33 and 124 h; +1 task, +4 h).
- **New:** DES-02-01-06 (4 h), sweetened on recipes across the pin sheet,
  enter-values pinning, recipe-based log pre-fills, recipe rows and the pulled
  state (an MVP epic, EPIC-02-01); DES-05-02-05 (3 h), leaving the
  household.
- **Grown:** DES-04-02-02 (3 to 4 h), the "why this grind" sheet for the 3-day
  window and pooled evidence.
- **Moved (no change in hours):** the split of EPIC-03-05. DES-03-05-03 becomes
  DES-03-07-01 (4 h) and DES-03-05-04 becomes DES-03-07-02 (3 h) under the new
  EPIC-03-07; EPIC-03-05 keeps DES-03-05-01 and 02 (7 h).
- **Edited, same hours:** EPIC-02-05 (custom drink example), EPIC-05-01
  (placeholder name), EPIC-05-02 (priority, open item), EPIC-05-03 (story note).

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
  - EPIC-01-02: the setup shortcut detailed (one tap with one machine and
    one grinder, offered at the end of adding the second unit); setup
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
  whose grinder or machine left their setup need a re-dial, not a one-tap
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
  - setups are fixed combinations of parts (user word "setup"), with no editing
    and no retire;
  - two freshness clocks, both paused by freezing, plus an optional packing
    date;
  - "open" excludes frozen portions.
  The coordinator also asked for working assumptions on the epic-planner's
  three new setup questions. Review findings owned by the designer: M2, M7, m3
  and m4. The designer was named tiebreaker on M4.
- **What changed** (only what these affect; all IDs kept):
  - Fixed setups, EPIC-01-02: SCR-TOOLKIT is now the setup builder. The user
    picks a combination, and a live match line says whether it's an existing
    setup or a new one. SCR-KIT shows setups (current first) and parts. "Use the
    new part?" was added after adding a part, and the first-setup shortcut was
    kept. Removed: setup editing, the swap confirmation, the needs-re-dial
    state and every retire path, along with their acceptance criteria. Part
    kinds are now the seven in S-08. DES-01-02-01, 03, 04 and 06 were updated
    or redefined.
  - Setups elsewhere:
    - Home's setup line is a select (PEC-09).
    - There's a new home state for a setup with no recipe that starts from the
      closest setup, and a new "dial in from the closest setup" flow under
      EPIC-02-01 (DES-02-01-05).
    - The shot log's setup field, and grind handling when the grinder changes
      (DES-01-03-05).
    - The word "toolkit" was replaced by "kit" in user-facing places (now
      "setup", round 4).
  - New DQ-18 (current setup), DQ-19 (ties), DQ-20 (grind pre-fill) and DQ-21
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
- **Sent to the epic-planner:** PEC-09 (switch setup on the home screen and in
  the shot log; the current setup is the setup of the last shot), pending the
  Head of Product. The M4 decision goes to the story-writer.

### Approval after round 3 (2026-10-20)

- **Outcome:** the Head of Product approved design round 3.
  - PEC-09 accepted (applied in epics revision 7).
  - Home's coffee line shows both clocks on one line through the
    `home.coffeeClocks` pattern ("18 days since roast · 1 day open"), with the
    roasting clock's fallback wording ("packed 10 days ago", "best before in
    140 days"), and the roasting clock alone until the portion is opened.
    Section 2.3, EPIC-03-03 and the UX concerns were updated to match.
  - The rule that any part change makes a new setup is confirmed. The "small
    parts reset recipes" concern is accepted, to be revisited if users find
    it fussy.
- **Sent to the epic-planner:** nothing new.

### Round 4 (2026-10-20, applied decisions)

- **Feedback received:** decisions the Head of Product had already made,
  recorded in S-02 and S-08, to apply rather than review:
  - "kit" and "toolkit" become "setup" everywhere, with the tab labelled
    "Setup" and first-run keys under `home.firstRun.*`;
  - a setup is machine, grinder and basket only, each an exact catalog model;
  - WDT and puck screen are puck-prep checkboxes on shots and recipes,
    copied by one-tap pulls;
  - parts are named by maker and model in every example.
- **What changed** (all IDs kept; SCR-KIT and SCR-TOOLKIT keep their names):
  - Terminology: checked the mechanical rename for natural reading. I fixed
    the screen map, the task-frame list, the return-to example and a
    self-referencing line in the round-3 log, and added the "Setup" tab and
    maker-and-model notes to "How to read this file".
  - EPIC-01-02:
    - Three part kinds everywhere (add a part, the builder, setup cards, the
      parts list), all required. Portafilter, puck screen, tamper and
      distribution tool are removed as kinds.
    - The builder has three rows with no "none".
    - The first-setup shortcut needs one of each of the three parts.
    - The basket picker lists the machine maker's baskets first (new DQ-22).
    - Parts names add the basket when two setups share a machine and
      grinder.
    - The first-setup tap budget goes from 12 to 16.
  - EPIC-01-03: a puck-prep group of two Toggles (NC-13), WDT and Puck
    screen, next to Sweetened. They start from the recipe, else the saved
    shot (edit), else the last shot on this setup, else off. Changing the
    setup re-applies that rule to untouched prep Toggles. New acceptance
    criteria.
  - Prep is shown in ShotValues (NC-08), SH-PIN, SCR-SHOT and edit mode. It
    is copied by one-tap pulls and by the closest-setup dial-in. Home shows
    one quiet prep line only when the recipe uses prep. Rows in SCR-SHOTS
    don't show prep.
  - DQ-21 updated. UX concerns:
    - "small parts reset recipes" is largely resolved and recorded;
    - "time to first shot" and "setups multiply" are updated;
    - new: "which basket is mine?" and "one-tap copies prep".
  - Hours: seven tasks resized, a net +3 h. The MVP is now 56 tasks, 275 h
    (was 272 h); Next is unchanged at 32 h.
  - No new components.
- **Sent to the epic-planner:** nothing new. DQ-22 (does the seed catalog
  cover stock baskets?) is for the Head of Product.

### Round 5 (2026-10-20, applied decisions)

- **Feedback received:** decisions the Head of Product had already made,
  recorded in S-02, S-05 C and S-08:
  - "just right" tasting: four questions on five-point scales, plus six
    observation tags replacing scores and defects, with the rating kept;
  - rules-based dial-in suggestions in the MVP, with freshness as an
    explanation only;
  - milk type and amount on milk drinks, with a household milk list.

  The coordinator asked me to decide where the one-tap off path asks the
  taste questions (SQ-17), and to check that tasting still takes seconds.
- **What changed** (all IDs kept):
  - EPIC-01-05, SCR-TASTE:
    - Rebuilt around the rating, four just-right rows, a one-tap "all just
      right" and six tags.
    - Strength gets milk wording for milk drinks.
    - Channelling stays the only `signal` warning, now from the "channelling
      seen" tag.
    - The primary action adapts: "dial in with this change" when there's a
      suggestion, else pin or Done.
    - Leaving saves, as before.
    - A seconds budget and new acceptance criteria were added.
    - DES-01-05-01, 02 and 04 were updated or redefined.
  - EPIC-02-03:
    - The off path now goes through the new SH-OFF sheet (DQ-23, answering
      SQ-17).
    - The new suggestion flow covers lever order, step size, the grinder's
      own direction (never guessed), freshness explanations, pre-fill and
      dismiss.
    - Home's Dial in label shows a pending suggestion.
    - New tasks DES-02-03-03 to 05.
  - EPIC-01-03:
    - A milk field and a milk-amount tab (millilitres) for milk drinks, with
      starting rules and a starter milk list created with the household.
    - Milk is shown in ShotValues, SCR-SHOT, SCR-SHOTS rows, SH-PIN and
      Home's quiet line, and one-tap pulls copy it.
    - New task DES-01-03-06.
  - Components:
    - New NC-16 SuggestionCard.
    - ChipGroup (NC-04) gains a just-right variant.
    - NumberWheel gains a `milliliter` unit.
    - ShotValues (NC-08) gains a milk line.
  - Questions: DQ-08 closed (tags); DQ-09 noted ("ran fast" only in reasons);
    new DQ-23 to DQ-26.
  - UX concerns: tasting as "seconds", suggestion trust, and tasting twice on
    the off path.
  - Recent shots (an addition in the same pass, a Head of Product decision):
    - SCR-SHOTS gets filter chips for drink and coffee, and setup when there
      are several. Opening the tab pre-sets the filters to Brew's drink and
      coffee.
    - Active filters are filled chips that can be removed, and "All" clears
      them in one tap.
    - There's a filtered empty state with "clear filters".
    - SCR-SHOT gains "Dial in from this".
    - ChipGroup gains a filter variant; there's a new UX concern about the
      pre-filtered list.
    - The tab stays "Shots" pending the Head of Product's naming decision.
  - Hours: four new tasks and +41 h in total, so the MVP is 60 tasks and
    316 h (was 56 tasks and 275 h; 312 h before the filters). Next is 33 h
    (was 32 h).
- **Sent to the epic-planner:**
  - Proposed, pending the Head of Product: PEC-10 (suggestions in EPIC-02-03,
    S to M), PEC-11 (EPIC-01-05 rescoped to just-right tasting), PEC-12 (milk
    across EPIC-01-01, 01-03, 02-01 and 02-02) and PEC-13 (milk-list editing
    in Next, with EPIC-02-05).
  - To record, as the Head of Product has already decided it: PEC-14 (filters
    and "dial in from this" in EPIC-02-06).

### Round 6 (2026-10-21, applied decisions)

- **Feedback received:** decisions the Head of Product had already made,
  recorded in S-02 ("App sections are named for what people ask"):
  - the tabs are Brew, Journal, Beans and Setup;
  - Beans has On hand (bags grouped by state) and Tried (every coffee used,
    calculated);
  - there's a light coffee screen;
  - Beans filters are Next.
- **What changed** (IDs kept: SCR-SHOTS is the Journal, SCR-PANTRY is
  Beans):
  - Journal:
    - The tab and title are "Journal", and the keys moved from `shots.*` to
      `journal.*` (`nav.journal`).
    - Entries are still "shots" in copy ("show older shots", "Pull this
      shot", "Shot logged").
    - The round-5 filters and "Dial in from this" are unchanged.
  - Beans:
    - The tab is "Beans" (`nav.beans`), with keys moved from `pantry.*` to
      `beans.*`, reworded rather than swapped.
    - On hand groups bags under open, unopened and frozen. Each bag appears
      once, in its first qualifying group, and the clocks and remaining
      coffee are as before.
    - The old finished section is gone: finished bags are counted in Tried
      and listed on their coffee's screen.
    - Tried has one row per coffee, with roaster, last had, bag count and a
      summary in words.
    - There are three empty states (first run, nothing on hand, nothing
      tried), each with one primary.
  - New SCR-COFFEE (light): header and summary, recipes per setup and drink,
    up to five recent shots with a link to the Journal filtered by that
    coffee, its bags, and "add a bag of this", which skips the coffee pick.
  - Beans filters noted as Next direction only, reusing the filter chips.
  - The run-out line (EPIC-03-05, Next) moved under On hand.
  - New DQ-27 (what counts as tried) and DQ-28 (the summary line). New UX
    concerns: Tried below the fold, the summary as a judgement, and
    "Journal" alongside "shots".
  - Hours: one new task (DES-03-01-04) and +10 h, so the MVP is 61 tasks and
    326 h (was 60 tasks and 316 h). Next is unchanged at 33 h.
  - No new components.
- **Sent to the epic-planner:** PEC-15 (Tried and the coffee screen in
  EPIC-03-01, or a small new INIT-03 epic; Beans filters need a Next epic and
  an origin field), to record the Head of Product's decision.

#### Round 6 addendum (2026-10-21): basket dose range

- **Feedback received:** a Head of Product decision (`stories.md` revision
  4, answer 4). A household adding a basket that isn't in the catalog is
  asked what dose it's made for, with "not sure". The seed catalog carries
  every seeded basket's dose range, curated by the Head of Product as admin.
- **What changed:**
  - EPIC-01-06's capability questions gain one basket row,
    `catalog.cap.doseQ`: chips for 14–16 g, 17–19 g and 20–22 g, "other"
    (two optional gram Inputs) and "not sure". It can be answered later, as
    in PEC-08. Baskets outside the chips (7–10 g singles, 23 g and up) use
    "other" and type their lowest and highest grams; no extra chip is needed.
    If "other" is left empty, it saves as "not sure".
  - With a "not sure" range, the shot log is unchanged. A dose change is
    never suggested (amended 2026-11-03, see Round 7): the suggestion skips
    dose and moves to the next lever. The reason line doesn't mention dose, and
    there is no link on the card (the quiet `suggest.noBasketRange` link was
    dropped on 2026-11-03, see Round 7).
  - The part details show a basket's dose range.
  - Acceptance criteria, DES-01-06-03 and DES-01-06-05 were updated, at +2 h
    in total; the MVP is 61 tasks and 328 h.
  - No new components.
- **Sent to the epic-planner:** nothing new. It fits PEC-05 and PEC-08 in
  EPIC-01-06.

#### Round 7 addendum (2026-11-03): no dose suggestion without a basket range
- **Feedback received:** a Head of Product decision. When a basket's dose
  range is "not sure", a dose change is never suggested. This matches
  01-06-08 AC 5, 02-03-06 AC 6, the epics and S-02.
- **What changed:**
  - The "not sure" table, the lever table and the round 6 addendum now say
    the suggestion skips dose and moves to the next lever. The reason line
    doesn't mention dose.
  - The quiet `suggest.noBasketRange` link was dropped (Head of Product,
    2026-11-03). With an unknown range the suggestion simply skips dose, and
    the user sets the range from the basket's part details (PEC-08).
  - The basket dose-range chips now say what happens outside 14–22 g:
    "other" with typed lowest and highest grams, and empty saves as "not sure".
  - The MVP epic count is corrected to 16.
  - DQ-24 freshness thresholds are marked as still awaiting confirmation.
- **Sent to the epic-planner:** nothing new.

### Round 7 (2026-11-15): Next epics to full detail
(Round 8 follows this entry, at the end of the log.)

- **Feedback received:** the Head of Product asked for the nine Next epics
  (EPIC-02-04, 02-05, 03-05, 04-02, 04-03, 04-04, 05-01, 05-02, 05-03) to be
  brought from "lighter flows" to the detail of section 4, so stories and tech
  tasks can be written from them. The Phase 1 MVP epics are built, so the flows
  were written against the code in `src/` (screens under `src/app/(app)`,
  components, tokens, domain, DAL) and the shipped behaviour, not the original
  plan. INIT-06 and anything with an LLM, scanning or network cold start are out
  of scope. No real names or personal details appear anywhere.
- **What changed** (all IDs kept; this entry follows the 2026-11-03 addendum):
  - Section 5 rewritten as full detail, in epic ID order, each with entry points,
    screens and sheets touched, the flow, empty, error and edge states, copy
    direction, components, design acceptance criteria and `design` tasks. A new
    5.0 records what shipped and six patterns shared by several epics (the grind
    trail, the "nothing entered yet" test, one card on Brew, the Profile layout,
    persona on Brew, quiet configuration).
  - Design decisions worth reading first:
    - EPIC-02-04: a scope choice in SH-PIN, hidden for a coffee's first recipe,
      with a way to remove a bag's recipe.
    - EPIC-02-05: drinks and milks screens reached from Profile and from the
      selects, a sheet per item, reorder by buttons, keep-one rule.
    - EPIC-03-05: a run-out line with an explanation sheet, hidden when it would
      mislead; Beans filters from six coffees; origin hides until the data
      exists.
    - EPIC-04-02: the adjusted grind on Brew and in the pre-filled log, with one
      reason line and a "why this grind" sheet; never in fix mode.
    - EPIC-04-03 and 04-04: a calm Card on Brew, a confirmation sheet that
      previews the effect, a stretch in plain terms, and tappable event rows.
    - EPIC-05-01: a person select on Brew, a People screen, profiles removable
      only when empty, "for {name}" through the log, tasting and Journal.
    - EPIC-05-02: an invite link, a landing that shows the history first, an
      explicit claim, and refusal rather than merging.
    - EPIC-05-03: an Account section, one prompt, a switch to a linked history
      only from an empty device, and the new-device offer on first-run Brew rather
      than at start-up.
  - Section 2.4 (new screens and sheets), section 3 (**one new component, NC-17
    ReorderList**, and extensions to Toggle, Icon, NumberWheel and Input), section 6
    (EPIC-05-02's pointer), 7a (ten concerns), section 8 (DQ-29 to DQ-43, each
    with a recommended answer) and section 9.
  - Hours: Next goes from 9 tasks and 33 h to 33 tasks and 124 h; the MVP is
    unchanged at 61 tasks and 328 h. The header and "How to read this file"
    mark round 7 as draft pending approval.
  - Sections 1, 2.1 to 2.3, 4 and the rest of 6 are unchanged and stay approved.
- **Sent to the epic-planner:** nothing yet; proposed, **pending the Head of
  Product**: PEC-16 (a bag's recipe can be removed, EPIC-02-04), PEC-17 (split
  run-out from Beans filters, EPIC-03-05), PEC-18 (profile removal, household-level
  current setup, first dial-in from another profile and a Journal person filter,
  EPIC-05-01), PEC-19 (the new-device sign-in offer moves off SCR-START;
  STORY-05-03-02 AC 3 needs rewording, EPIC-05-03), PEC-20 (invites tied to a
  profile, an invitee with history is refused; stays Later, EPIC-05-02), PEC-21
  (drift only where a recipe is the starting point, with evals, EPIC-04-02) and
  PEC-22 (which events prompt a re-dial, a decline is a zero shift, EPIC-04-03).
  Decisions needed from the Head of Product are DQ-29, DQ-35, DQ-36, DQ-37,
  DQ-39 (a, d), DQ-40 (b) and DQ-41; the rest are confirmations or for the tech
  lead.

### Round 8 (2026-11-15)

- **Feedback received:** the Head of Product accepted all of DQ-29 to DQ-43 and
  PEC-16 to PEC-22 as recommended, except: DQ-32 revised (the bag's measured
  shots in the last 3 days of the current grind period, at least 3 and at most
  10, never past the last maintenance, weighted by age in time, pooled across
  personas on the same coffee and grinder and judged against each shot's own
  recipe, a separate nudge per recipe; basket fallback if evals diverge); sugar
  (a pinned recipe remembers sweetened, yes or no, logs start pre-ticked); milk
  (variations are custom drinks, no milk on any drink); PEC-20 adjusted
  (EPIC-05-02 is Next, sequenced last). From the epic-planner, `epics.md`
  revision 11 (read first), with the design-owned follow-ups listed below.
- **What changed:**
  - Header, "How to read" and section 5 intro: round 8 status, ten Next epics,
    counts; section 2.4 unchanged except by reference.
  - New 5.0a and DES-02-01-06: sweetened on recipes (pin sheet and changes
    list, enter-values pinning, pre-ticked recipe-based logs, recipe rows, the
    pulled state). Task also noted under EPIC-02-01 in section 4.
  - EPIC-02-04: INIT-02 Q1 closed; removal of a bag recipe in scope.
  - EPIC-02-05: "Americano with froth" custom-drink example with has-milk
    chosen at creation; no change to milk on existing drinks.
  - EPIC-03-05 split: run-out only (DES-03-05-01 and 02), and new EPIC-03-07
    "Find any coffee in Beans" with the filters and origin (DES-03-07-01 and
    02, renumbered from 03-05-03 and 04). "No run-out line while a filter is
    on" kept in both. Blend as an origin value added.
  - EPIC-04-02: SH-DRIFT evidence lines rewritten for the 3-day, reach-back,
    cross-persona rule; new edge states; prep "left out" line kept; DQ-32
    rewritten (DES-04-02-02 3 to 4 h).
  - EPIC-05-01: example placeholder changed to a neutral name; DQ-48 added.
  - EPIC-05-02: now Next, sequenced last; the claim has no undo and leaving is
    undesigned, flagged with a recommendation and a proposed DES-05-02-05
    (since designed, see "Round 8 review fixes").
  - EPIC-05-03: note that STORY-05-03-02 AC 3 needs rewording.
  - Section 7: PEC-16 to PEC-22 marked accepted (PEC-17 as a new epic, PEC-20
    adjusted); sugar and milk recorded as applied decisions. Section 8: DQ-29 to
    DQ-43 marked accepted; DQ-32 and DQ-41b revised; new DQ-44 to DQ-49.
  - Section 9: MVP 62 tasks and 332 h (+4 h); Next 34 tasks and 128 h (+4 h).
  - No new components; no real names or relationships in examples.
- **Sent to the epic-planner:** the new questions DQ-44 (one-tap copies
  sweetened; sweetened not changeable on Brew), DQ-45 (the recipe a shot was
  brewed from: the latest pin in force before the shot), DQ-46 (pooling across
  setups that share a grinder: intended), DQ-47 (keep a clean resetting drift),
  DQ-48 (which recipe a new profile starts from), DQ-49 (origin: admin fills the
  seed list; a blend is its own value), and the leaving-the-household open item
  (DQ-41b). For the story-writer: reword STORY-05-03-02 AC 3.

### Approval after round 8 (2026-11-15)

- **Outcome:** the Head of Product approved the design and epics after round 8.
  - DQ-44 to DQ-49 accepted as recommended.
  - INIT-03 keeps seven epics (EPIC-03-07 kept).
  - The "Leave this household" screen is kept: DES-05-02-05 is no longer
    proposed, and DQ-41b is resolved (it ships with invites).
- **What changed:** the title, header and section 5 intro now read rounds 7 and
  8 as approved; DQ-44 to DQ-49 are marked accepted; DES-05-02-05 is marked
  approved. No hours change (MVP 62 tasks and 332 h; Next 34 tasks and 128 h).
- **Sent to the epic-planner:** nothing new.

### Round 8 review fixes (2026-11-16)

Design-owned findings from the "Revision 5 review" in `review.md` (M2, m6, m7);
targeted edits only, no scope, hours or ID changes.
- **M2, leaving the household:** designed in EPIC-05-02 as SH-LEAVE (entry in
  Profile, Account, shown only with more than one login; plain statement of what
  stays and what starts new; success, failure, cancel and "alone" states;
  acceptance criteria), with the rule that the leaver's profile and history stay
  as an unclaimed profile, the leaver starts a new, empty household with a fresh
  profile, and if the only owner leaves the longest-standing member becomes
  owner. Added to the 2.4 table; "open" and "proposed" labels removed (intro,
  open item, DQ-41b, section 9, the round 8 and 7a notes).
- **m7:** "Alex" replaced by `{name}`; the note now says only `{name}` or a role
  is used.
- **m6:** stale "draft" labels (2.4 and extensions headings, header, section 5
  pointers, section 9, DES-02-01-06) now say approved; the FilterChips line
  points to EPIC-03-07; DQ-39 names which parts belong to EPIC-03-05 and 03-07.
- **Not design-owned or not trivial:** m1 to m5, m8 to m14 and M1, M3, M4, B1 to
  B3 belong to other roles. The `spec.md` "partner" example (m7) is the
  strategist's.
- **Sent to the epic-planner:** nothing new.
