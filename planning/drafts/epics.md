# Tare epics (final, revision 10)

Source: `planning/drafts/initiatives.md` (approved by the Head of Product) and
`docs/spec.md`, sections S-01 to S-09. S-01 and S-02 override older sections
where they differ. Revision 2 applied the Head of Product's answers; revision 3
applied the three changes made at approval, also recorded in S-02; revision 4
applied the epic changes from design review round 1 (PEC-01 to PEC-06 in
`planning/drafts/design.md`); revision 5 applied PEC-07 and PEC-08 from design
review round 2; revision 6 applied the Head of Product's decisions on the plan
review (`planning/drafts/review.md`), recorded in S-02, S-04 and S-08;
revision 7 applied PEC-09 from design round 3 and recorded the design's
working assumptions DQ-18 to DQ-21; revision 8 renamed "kit" to "setup" and
narrowed a setup to machine, grinder and basket, with puck prep as checkboxes;
revision 9 applied the taste model, rule-based dial-in suggestions, milk
tracking, basket dose ranges and the journal filters; revision 10 names the
app's sections for what people ask (Brew, Journal, Beans, Setup), adds the
Tried list of coffees and the coffee screen (S-02, design PEC-15), and gives
Beans filters a Next home.

**Status: final, approved by the Head of Product** (revision 10, with the
review fixes, design round 3 changes, the setup change, the taste and milk
changes and the section names below as approved amendments). The Head of
Product has confirmed the MVP must be a fully usable logging tool, including
choosing a setup and beans. Its size is to be confirmed, or cuts picked, at
final sign-off (review m9); nothing has been cut. No GitHub issues have been
created.

Initiative open questions are referenced as `INIT-NN Q#`, numbered in the order
they appear in `initiatives.md`. Cross-cutting questions are `X-1` (timestamp
precision, now resolved), `X-2` (success targets) and `X-3` (network
eligibility in Phase 1). Answered questions are listed under "Resolved
questions". A "working assumption" is a design assumption (`DQ-NN` in
`design.md`) that the plan builds on until the Head of Product reverses it.

**Terminology.** The app has four sections (S-02): **Brew** (what am I
making?), **Journal** (what did I make?), **Beans** (what do I have?) and
**Setup** (what am I making it with?). A "setup" is the fixed combination of
machine, grinder and basket a shot is pulled with; the schema calls it
`setups` (S-08), and its components are its "parts". The Journal is the
method-neutral list of past brews; an espresso entry in it is still a "shot",
so "log a shot" and "Pull This Shot" stay, and an entry is never called a
"journal entry" in the app. Beans has two parts: **On hand** (the bags in the
house) and **Tried** (every coffee ever used); a coffee's own screen is the
coffee screen (design `SCR-COFFEE`). "Just right" questions are the four taste
scales rated against the persona's own ideal (S-02). Earlier revisions said
"toolkit", then "kit", "pantry" and "recent shots"; the older change-log
entries below keep the names used at the time.

## Changes in this revision

Revision 10 (section names, Tried and the coffee screen; S-02 "App sections
are named for what people ask" and design PEC-15):

- **"Shots" becomes "Journal"** for the list of past brews. EPIC-02-06 is
  retitled "Look back in your journal" (size stays M); its filters, default
  pre-filter and "Dial in from this" stay. Espresso entries are still
  "shots". The tab-name question is closed. EPIC-01-01's shell names the four
  tabs: Brew, Journal, Beans, Setup.
- **"Pantry" becomes "Beans"** in all user-facing wording, reworded rather
  than replaced: EPIC-03-01 is retitled "Add a bag of beans" (size stays M).
  The data model never used "pantry".
- **Beans has two sections.**
  - **On hand:** open, unopened and frozen bags, grouped by state.
    EPIC-03-01 owns the On hand list (size stays M); EPIC-03-02 groups it by
    state (size stays M).
  - **Tried and the coffee screen (PEC-15):** every coffee ever used, one row
    per coffee, with when it was last had, how many bags and how its shots
    went; calculated, never stored. Each row opens a light coffee screen with
    that coffee's details, its recipes and its shots. **New MVP epic
    EPIC-03-06 "See every coffee you've tried" (M, small end).**
    - Placement decision: the designer proposed EPIC-03-01 (taking it to the
      top of M) or a new small INIT-03 epic. This draft takes the new epic.
      Tried needs shots, taste, recipes and the Journal, which come late in
      the build order, while EPIC-03-01 must ship third so shots can be
      logged at all. Putting Tried in EPIC-03-01 would stall it.
    - Sized M rather than S because it's a calculated list plus a new screen.
  - **Beans filters** (roaster, roast level, origin, rating) are **Next**.
    INIT-03 is now at six epics (the limit), so they join the Next epic
    EPIC-03-05, retitled "Know when you'll run out, and find any coffee" (size
    stays M, now at the top). Both are Next improvements to Beans; the epic
    should be split if INIT-03 is restructured.
- **MVP scope note:** the Head of Product confirmed the MVP must be a fully
  usable logging tool, including choosing a setup and beans. Recorded in the
  header and in "MVP size".
- **Build order:** EPIC-03-06 is added at the end of the MVP (16th), after
  EPIC-03-04. EPIC-03-05 now also follows EPIC-03-06. Next and Later
  positions move down by one.
- Counts: 16 MVP, 8 Next, 7 Later (31 epics).

Revision 9 (taste model, dial-in suggestions, milk, basket dose ranges and
recent-shots filters; S-02, S-05 C, S-08 and the Head of Product):

- **Taste relative to the persona.** EPIC-01-05 (size stays S): the absolute
  1-5 sensory scores and the defect list are replaced by four optional "just
  right" questions on a -2..2 scale and six observation tags. The overall 1-5
  rating and the one-tap good/off reaction stay. Settles DQ-08 and INIT-01 Q3.
- **SQ-17 decided: answers go on the one-tap shot itself**; the fix is a new
  measured shot (DQ-12, two records). EPIC-02-03.
- **Rule-based dial-in suggestions, in the MVP**, folded into EPIC-02-03
  (resized S to M): one change per off shot, with its reason, pre-filled into
  the next dial-in. Levers in order: puck prep, grind, yield, dose (within the
  basket's dose range), temperature (capable machines), milk amount.
  Freshness and shot time are diagnostics.
- **Milk:** EPIC-01-01 (starter milk list, typical milk amounts), EPIC-01-03
  (milk on shots), EPIC-02-01 (milk on recipes, not part of identity),
  EPIC-02-02 (copied on a one-tap pull), EPIC-02-05 (retitled "Make the drink
  and milk lists yours"). Sizes unchanged.
- **Baskets declare a dose range:** EPIC-01-02, EPIC-01-06; sizes unchanged.
- **Recent shots gain filters and "Dial in from this"** (Head of Product):
  EPIC-02-06 resized S to M.
- **Palate learning stays Later** (EPIC-06-04); **learn only from similar
  palates** (EPIC-06-05, EPIC-06-06). EPIC-06-02 builds on the rules.
- **Build order:** EPIC-01-05 moved from 12th to 10th in the MVP.
- Counts: 15 MVP, 8 Next, 7 Later.

Revision 8 (terminology and the narrower setup, S-02 and S-08):

- **"kit" and "toolkit" became "setup"**; EPIC-04-01 renamed "Record
  maintenance on your equipment".
- **A setup is machine + grinder + basket only**, each an exact catalog model.
  EPIC-01-02 stays M.
- **Puck prep checkboxes** (`usedWdt`, `usedPuckScreen`) on shots and recipes,
  copied on a one-tap pull.
- **"Small parts reset recipes" concern largely resolved.**
- No sizes, priorities or build-order positions changed.

Revision 7 (design round 3, approved amendment PEC-09 and working
assumptions):

- **PEC-09:** setup selects with "change a part" on Home and in the shot log
  (EPIC-02-02 with EPIC-01-02).
- **DQ-18** current setup, **DQ-19** closest-setup ties, **DQ-20** grind
  pre-fill, **DQ-21** one part per kind.
- **Both freshness clocks on Home, one line** (EPIC-03-03).
- **"Any part change makes a new setup" confirmed.**
- No sizes, priorities or build-order positions changed.

Revision 6 (plan review fixes, decided by the Head of Product):

- **A setup is a fixed combination of parts**, replacing setup editing and
  PEC-07. **Bean age is two clocks**, resolving INIT-03 Q2 (review B1).
  **"Open" excludes frozen portions** (review M5). **iOS storage eviction
  accepted** (review M6). **Resolved questions cleaned up** (review m1).
  **MVP size** (review m9): nothing cut.
- No sizes, priorities or build-order positions changed.

Revision 5 (design review round 2): **PEC-07** (superseded in revision 6) and
**PEC-08** (EPIC-01-06: edit capabilities of a household's own unverified
models).

Revision 4 (design review round 1): **PEC-01** (EPIC-01-01 app shell, S to
M), **PEC-02** (setup shortcut), **PEC-03** (change drink and coffee on Home),
**PEC-04** (shot warnings), **PEC-05** (EPIC-01-06 capability entry, M to L),
**PEC-06** (where grind periods show).

Revision 3 (approval changes): **added** EPIC-05-03 (Next, S) and EPIC-02-06
(MVP, S); **changed** EPIC-01-06 (unverified entries private; manual admin
review).

Revision 2: **added** EPIC-01-06, EPIC-02-05 and EPIC-06-07; **removed**
EPIC-06-03 (folded into EPIC-06-02; the ID is retired); **moved** EPIC-04-01
to MVP.

## Summary

| ID | Title | Parent | Priority | Size |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | INIT-01 | MVP | M |
| EPIC-01-02 | Describe your setup once | INIT-01 | MVP | M |
| EPIC-01-03 | Log a shot in seconds | INIT-01 | MVP | M |
| EPIC-01-04 | Record temperature and pressure when your machine has them | INIT-01 | MVP | S |
| EPIC-01-05 | Say how it tasted | INIT-01 | MVP | S |
| EPIC-01-06 | Add what's missing from the catalog | INIT-01 | MVP | L |
| EPIC-02-01 | Pin the recipe that worked | INIT-02 | MVP | M |
| EPIC-02-02 | Pull your daily shot in one tap | INIT-02 | MVP | M |
| EPIC-02-03 | Fix a bad shot from your recipe | INIT-02 | MVP | M |
| EPIC-02-04 | Give one bag its own recipe | INIT-02 | Next | S |
| EPIC-02-05 | Make the drink and milk lists yours | INIT-02 | Next | S |
| EPIC-02-06 | Look back in your journal | INIT-02 | MVP | M |
| EPIC-03-01 | Add a bag of beans | INIT-03 | MVP | M |
| EPIC-03-02 | Split and freeze a bag | INIT-03 | MVP | M |
| EPIC-03-03 | Know how fresh your beans really are | INIT-03 | MVP | S |
| EPIC-03-04 | See how much coffee is left | INIT-03 | MVP | S |
| EPIC-03-05 | Know when you'll run out, and find any coffee | INIT-03 | Next | M |
| EPIC-03-06 | See every coffee you've tried | INIT-03 | MVP | M |
| EPIC-04-01 | Record maintenance on your equipment | INIT-04 | MVP | S |
| EPIC-04-02 | Suggested grind that follows bean age and recent shots | INIT-04 | Next | L |
| EPIC-04-03 | Re-dial once after maintenance and keep every recipe | INIT-04 | Next | M |
| EPIC-04-04 | Keep recipes right after new burrs of a different design | INIT-04 | Next | S |
| EPIC-05-01 | Brew for someone else in the household | INIT-05 | Next | M |
| EPIC-05-02 | Invite them to take over their own profile | INIT-05 | Later | L |
| EPIC-05-03 | Keep your coffee history when you change phones | INIT-05 | Next | S |
| EPIC-06-01 | Scan a bag instead of typing it | INIT-06 | Later | M |
| EPIC-06-02 | Get a grounded fix when a shot goes wrong | INIT-06 | Later | L |
| EPIC-06-04 | Tare learns your palate as you log | INIT-06 | Later | M |
| EPIC-06-05 | Share your shots, with your consent | INIT-06 | Later | M |
| EPIC-06-06 | Start a new bag from the community, tuned to you | INIT-06 | Later | L |
| EPIC-06-07 | Merge duplicate catalog entries, with AI suggestions | INIT-06 | Later | L |

Counts: 16 MVP, 8 Next, 7 Later (31 epics).

## Cross-cutting constraints (not epics)

These apply to every epic's acceptance criteria rather than being separate
scope, so they don't count as overlap:

- Section names (S-02): Brew, Journal, Beans and Setup in user-facing text.
  Espresso entries in the Journal are "shots".
- Localization (S-07): no hardcoded strings, locale-aware number formatting,
  canonical floats in the database, RTL-ready logical CSS. Starter drink
  types, starter milks and the default persona's label are translated.
- Japandi design (S-01, S-06): Inter, thin weights at large sizes, monochrome
  warm grey, one muted colour only for shot warnings. Built on the Phase 0
  design system.
- Calculated, never stored (S-02): remaining weight, bag status, bean age (both
  clocks), usage rate, drift adjustments, dial-in suggestions, the Tried list.
- Timestamps are integer milliseconds (S-02, TQ-04); local days use the
  device's time zone (TQ-07).
- Phase 1 has no AI features (S-01): no LLM calls in any MVP or Next epic.
  Dial-in suggestions are rules, not AI (S-02).
- Catalog merges (S-02, S-08): any code that reads a catalog reference follows
  the merge pointer to the surviving entry. Merges only happen from EPIC-06-07,
  but readers built earlier must respect the pointer.
- Setups never change (S-02, confirmed by the Head of Product): no epic edits a
  setup's parts. A setup is machine, grinder and basket; a different
  combination of those is a different setup. Puck prep (WDT, puck screen) is a
  checkbox on shots and recipes, never part of a setup. Milk is part of the
  drink, never part of a recipe's identity.
- Taste is relative to the persona (S-02): "just right" answers and tags, never
  absolute scores; all optional.

---

## INIT-01: Log a shot against your real kit in seconds

(The initiative's title in `initiatives.md` predates the rename to "setup" and
is kept as approved.)

### EPIC-01-01: Start brewing without setting anything up

- **Parent:** INIT-01
- **Description:** A new user opens the app and starts straight away, with no
  sign-in screen. Behind the scenes the device gets an anonymous account, and
  Tare creates the user, one household, one main persona labelled "Me", and the
  household's starter drink and milk lists. The app opens on a calm shell with
  four tabs, Brew, Journal, Beans and Setup, consistent page headers, and the
  same loading, empty and error patterns on every screen.
- **Source sections:** S-02, S-04, S-08 (S-07 translated labels, S-01 and S-06
  design)
- **Scope**
  - In: Firebase anonymous sign-in per device; the user record stores the
    Firebase ID.
  - In: silent creation of household, owner membership and one default main
    persona with no stored name, shown with a translated role label.
  - In: the household's starter drink types (Espresso, Ristretto, Lungo,
    Americano, Cortado, Flat white, Cappuccino, Latte, Macchiato) as its own
    translated rows, each with whether it has milk and its typical milk
    amount (S-08).
  - In: the household's starter milk list (whole, semi-skimmed, skimmed, oat,
    soy, almond, lactose-free) as its own translated rows (S-02, S-08).
  - In: every later record is scoped to that household.
  - In (PEC-01): the app shell: the tab bar with Brew, Journal, Beans and Setup
    (S-02), page headers, the shared loading, empty and error patterns, and the
    profile screen's frame (persona rename, about this device). Later epics
    fill their own tabs and screens into it.
  - Out: the content of each tab and screen (the epic that owns it).
  - Out: Google sign-in and linking (EPIC-05-03).
  - Out: renaming the persona beyond a simple rename (in scope: rename only).
  - Out: editing the drink and milk lists (EPIC-02-05).
  - Out: sub personas, invites, a visible household (INIT-05).
  - Out: data-sharing consent setting (EPIC-06-05).
- **Dependencies:** none. Everything else needs a household and persona.
- **Priority:** MVP
- **Rough size:** M (was S; the app shell was added in revision 4, PEC-01)
- **Risks and open questions**
  - The shell is shared groundwork, not a slice on its own; it ships here
    because this epic is first in the build order and every MVP epic needs it.
    Keep it to the frame so it doesn't absorb other epics' screens.
  - Accepted risks (S-02, decided): an anonymous account lives on one device,
    so a lost or reset device loses its data, and there is no second device.
    Safari on iOS may also delete a site's storage after a period without use,
    which would silently start a new, empty household (review M6). The MVP
    explicitly accepts both for a prototype; linking to Google in EPIC-05-03,
    the first Next epic, removes them.
  - The typical milk amount for each starter drink isn't given in the spec
    (S-02 gives ratios: a cortado about 1:1, a latte 1:3 or more). Who sets
    the starting values?
  - Is a persona rename part of the MVP? S-02 says "until renamed" but doesn't
    place the rename in a phase. This draft includes a minimal rename.
  - Closed (S-02, revision 10): the tab names.

### EPIC-01-02: Describe your setup once

- **Parent:** INIT-01
- **Description:** In the Setup tab, the user finds their machine, grinder and
  basket in the catalog, by maker and model, and puts them together as a
  setup, so they never pick equipment shot by shot. A setup is a fixed
  combination: a different machine, grinder or basket means a different setup,
  and going back to the same three brings back that setup and its recipes.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: pick parts from the seeded catalog: maker, then the exact model, of
    the three kinds that define a setup (machine, grinder, basket), with
    declared capabilities (machine temperature and pressure control, grinder
    scale and coarser direction, basket dose range). Two baskets of the same
    size from different makers are different parts. Search matches names and
    aliases.
  - In: add owned parts (optional nickname, acquired date).
  - In: put a machine, a grinder and a basket together as a setup. A setup is
    defined by its parts; replacing any of them means a different setup, and
    choosing a combination the household already has reuses that setup, with
    its recipes. One part can be in several setups.
  - In (working assumption DQ-21): one part of each kind per setup.
  - In: a setup's name is optional; without one it's shown by its parts or a
    translated default (S-08). The name is a label, not a part, so it can be
    set or changed at any time without making a new setup (DQ-21).
  - In (DQ-18): the current setup is the setup of the persona's last shot
    (measured or one-tap); before any shot, the newest setup. Choosing a setup
    makes it current at once, without waiting for a shot.
  - In (PEC-09): "change a part" builds the new combination from the current
    setup with one part swapped, and finds or creates the matching setup,
    which becomes current. The selects that offer it on Brew and in the shot
    log are EPIC-02-02.
  - In (PEC-02, kept): once the household has a machine and a grinder, offer
    "make these your setup", with them preselected.
  - Out: editing a setup's parts. Setups never change (S-02).
  - Out: a "retire" action (not in the MVP, S-02). A part the household stops
    using simply stops appearing in its current setup.
  - Out: portafilter, tamper and scale, which don't change the recipe and
    aren't tracked; WDT and puck screen, which are prep checkboxes on shots
    and recipes (EPIC-01-03, EPIC-02-01); water, which may come later (S-02).
  - Out: servicing a part, which is a maintenance event (EPIC-04-01), not a
    new setup.
  - Out: adding missing makers or models (EPIC-01-06).
- **Dependencies:** EPIC-01-01 (parts and setups belong to a household).
- **Priority:** MVP (the Head of Product confirmed the MVP must let people
  choose their setup).
- **Rough size:** M, at the small end (three part kinds since revision 8).
- **Risks and open questions**
  - Who curates the seed list, and which makers, models and markets does it
    cover at launch? Baskets matter as exact models and need a dose range
    each, so the seed list needs common baskets as well as machines and
    grinders. S-02 says "curated" but not by whom.
  - Is a basket required to make a setup? S-02 names the basket as a defining
    part, but many users won't know their basket's exact model, and the
    first-setup shortcut starts from machine and grinder. If a basket is
    optional, "no basket recorded" is its own combination and dose suggestions
    have no range. Confirm (updates DQ-21).
  - Setups can multiply as households try parts. How the setup list stays calm
    (recent first, collapsing unused setups) is a design detail.
  - Largely resolved (revision 8): small parts no longer reset recipes; only a
    different machine, grinder or basket makes a new setup.
  - Closed (S-02, revision 8): which parts define a setup.
  - Closed (S-02): setups are not edited.
  - Closed (S-08, DQ-21): a setup's name is optional and can change at any
    time.
  - Closed (DQ-18, PEC-09, working assumption): which setup is current, and how
    the user switches.

### EPIC-01-03: Log a shot in seconds

- **Parent:** INIT-01
- **Description:** The user records a shot with grind, dose, yield and time on
  large number wheels, against a setup, a drink type and the beans they're
  using. They can tick whether they used a WDT tool and a puck screen, set the
  milk for a milk drink, and mark it sweetened. The shot is saved to the
  Journal as measured, with whose taste it records and who logged it.
- **Source sections:** S-02, S-06, S-08 (S-01 roadmap, S-07 number formatting)
- **Scope**
  - In: the extraction UI for the MVPayload (grind, dose, yield, time) with
    tactile number wheels, no text keyboards.
  - In: setup (pre-chosen as the current setup), drink type (the household's
    visible list) and portion of beans; optional "sweetened" mark. The shot
    stores setup, portion, persona, logging user and entry mode "measured";
    grinder, machine and basket follow from the setup.
  - In: puck prep checkboxes, "used WDT" and "used puck screen" (`usedWdt`,
    `usedPuckScreen`, S-02), stored on the shot.
  - In: for a drink with milk, milk type (from the household's visible milk
    list) and milk amount, pre-filled from the recipe, else from the drink's
    typical amount (S-02, S-08). No milk fields for drinks without milk.
  - In: grind wheel follows the setup grinder's declared scale; time stored in
    ms and shown in seconds with one decimal.
  - In: locale-aware display and entry of decimals, canonical floats stored.
  - Out: the setup field's select with "change a part" (EPIC-02-02, PEC-09).
  - Out: temperature and pressure (EPIC-01-04).
  - Out: rating, "just right" answers and tags (EPIC-01-05).
  - Out: steamed-milk temperature (not recorded in the MVP, S-02).
  - Out: pre-fill from a recipe or a past shot, one-tap shots, reactions and
    suggestions (INIT-02).
  - Out: computing `is_network_eligible` (see X-3).
- **Dependencies:** EPIC-01-02 (needs a setup), EPIC-03-01 (every shot needs a
  portion; `portion_id` is required), EPIC-01-01 (drink types and milks).
- **Priority:** MVP
- **Rough size:** M (the prep checkboxes and two milk fields are small)
- **Risks and open questions**
  - Overlap flag: "shots logged against a portion" is listed in both INIT-01
    and INIT-03. Assigned here, since the portion is picked while logging.
  - Finding and editing saved shots is EPIC-02-06 (the Journal).
  - Do the prep checkboxes and milk type on a blank log start from the last
    shot on this setup, or empty? Not in the spec.
  - Does logging a shot against an unopened portion mark it opened? Not in the
    spec (see EPIC-03-02).
  - INIT-03 Q3: what to do when the chosen portion is already finished.
  - X-3.

### EPIC-01-04: Record temperature and pressure when your machine has them

- **Parent:** INIT-01
- **Description:** If the setup's machine can set temperature or pressure, the
  shot log shows those fields in the form the machine supports: an exact value
  or a step. Machines that can't set them show nothing extra.
- **Source sections:** S-02, S-08
- **Scope**
  - In: show temperature and pressure only per machine capability (none,
    steps, exact, manual with gauge for peak pressure).
  - In: store exact values (°C, bar) or step numbers in separate columns, at
    most one of each pair; steps never converted. Machines that display °F
    show °F; the value is stored in °C (S-08).
  - Out: pressure profiles (curves per shot), later per S-02.
- **Dependencies:** EPIC-01-03 (extends the shot log), EPIC-01-02 (machine
  capabilities).
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - Manual machines without a gauge: S-02 implies no pressure field at all;
    confirm.

### EPIC-01-05: Say how it tasted

- **Parent:** INIT-01
- **Description:** After a shot the user can rate it overall and, when it's
  off, say in seconds how it differed from what this persona likes: too sour
  or too bitter, too weak or too strong (for milk drinks, lost in the milk or
  overpowering), too thin or too heavy, sweet enough or not, plus a few things
  they noticed. Every answer is relative to the persona's own taste, and all
  are optional.
- **Source sections:** S-02, S-08 (S-06 tactile inputs, S-01 shot-warning
  colour)
- **Scope**
  - In: overall rating 1-5 (optional).
  - In: four "just right" questions on a five-point scale, -2..2 with 0 as
    just right (S-02): balance (too sour to too bitter), strength (too weak to
    too strong; for drinks with milk, lost in the milk to overpowering), body
    (too thin to too heavy), sweetness (not sweet enough to just right,
    one-sided). They replace the absolute 1-5 sensory scores.
  - In: six observation tags that describe rather than judge: sour and bitter
    at once, dry or astringent finish, flat or dull, burnt or ashy, little or
    no crema, channelling seen. They replace the defect list.
  - In: the screen where these are answered, after saving a measured shot; the
    same controls are reused for an off one-tap shot (EPIC-02-03) and in
    editing (EPIC-02-06).
  - In (PEC-04): shot warnings. When "channelling seen" is tagged, a
    channelling warning shows in the signal colour, the only use of that
    colour. Other epics that show a shot (such as the Journal, EPIC-02-06)
    reuse this warning.
  - Out: flavour notes (not asked; inferred later from ratings and the beans'
    tasting notes, S-02).
  - Out: the "ran fast" warning, until a threshold is defined.
  - Out: the good/off reaction on one-tap shots (EPIC-02-03).
  - Out: suggesting a change from the answers (EPIC-02-03); summarising them
    per coffee (EPIC-03-06); learning the persona's target from them
    (EPIC-06-04).
- **Dependencies:** EPIC-01-03.
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - Crema is an observation, mostly a freshness hint, never a target (S-02).
  - Should "sour and bitter at once" and "dry finish" also raise the
    channelling warning, since S-02 counts them as channelling signs for
    suggestions? This draft shows the warning only for "channelling seen".
  - The "ran fast" threshold is not defined, so that warning stays out (DQ-09).
    Shot time is a diagnostic in suggestions (EPIC-02-03), which may need the
    same threshold.
  - Closed (S-02): DQ-08, the defect list (the six tags), and INIT-01 Q3 (no
    taste field is required).

### EPIC-01-06: Add what's missing from the catalog

- **Parent:** INIT-01
- **Description:** If the user's machine, grinder, basket, roaster or coffee
  isn't in the catalog, they add it with a link to its product page, and can
  use it straight away. If the link matches an entry that already exists, Tare
  points them to it instead of creating a duplicate.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: a household adds a maker, model (machine, grinder or basket), roaster
    or coffee, with a required product URL; additions are marked user-sourced
    and unverified and are usable at once.
  - In: unverified entries are visible only to the household that added them
    (S-02); once verified they join the shared catalog.
  - In: an entry can hold several URLs (one per market) and several aliases.
  - In: URLs are normalised (regional path segments and tracking parameters
    stripped); an exact match on the normalised URL flags a likely duplicate
    and offers the existing entry.
  - In: applies to both catalogs (hardware and coffee), from the Setup and
    Beans flows.
  - In (PEC-05): for a user-added machine or grinder, enter its capabilities
    by answering simple questions in the user's words (temperature and
    pressure control, dial numbers, step, which way is coarser), each with a
    "not sure" option, stored as unknown values (S-08, TQ-06).
  - In (revision 9): for a user-added basket, its dose range (the grams it's
    made for), with "not sure" (S-08).
  - In (PEC-08): while a model the household added is still unverified, the
    household can edit its capabilities, for example to answer a "not sure"
    later. Changes apply to the shot log and suggestions from then on; old
    shots keep their stored values, so nothing is reinterpreted.
  - Out: editing capabilities of seeded or verified models.
  - Out: in-app tooling for verification and merges. Until EPIC-06-07 these
    are a manual admin task (S-02).
  - Out: fuzzy or LLM matching (EPIC-06-07).
- **Dependencies:** EPIC-01-02 and EPIC-03-01 (the pickers it extends).
  Shot logging doesn't depend on it, so it can be built in parallel with
  EPIC-01-03.
- **Priority:** MVP
- **Rough size:** L (was M; capability entry was added in revision 4, PEC-05)
- **Risks and open questions**
  - Ownership: the catalog serves both INIT-01 (hardware) and INIT-03 (coffee).
    Placed under INIT-01 as one epic so URL, alias and flag rules are built
    once. INIT-03 is not one of its sources in `initiatives.md`, which predates
    this decision.
  - Capability entry is the riskiest part of this epic. How the shot log
    behaves for a "not sure" answer is a design assumption (DQ-11: no
    temperature or pressure field, a generic grind scale); confirm the exact
    fallback ranges. With a "not sure" basket dose range, should dose
    suggestions be skipped or use a default range? Can the admin correct
    capabilities on verification?
  - At L, this is the biggest lever on the MVP's size (review m9): coffee
    additions are simpler than hardware additions with capabilities, and could
    ship first. Because the MVP must let people choose a setup and beans
    (Head of Product), a split must still leave a way to add equipment or
    coffee the seed list misses.
  - Exact basket models (S-02) mean more user additions for baskets the seed
    list misses, and baskets often have no product page of their own.
  - Does the URL flag check other households' private entries? Matching
    against them would reveal they exist; checking only verified entries and
    the household's own seems implied by the privacy rule, but confirm.
    Cross-household duplicates would then be left to the admin.
  - When the URL flag fires, can the user still create their own entry? Not in
    the spec (DQ-10).
  - What if a product has no web page (a small local roaster)? A URL is
    required for user additions (S-08).
  - Who maintains the URL normalisation rules per market?

---

## INIT-02: Every new bag starts from what you already learned

### EPIC-02-01: Pin the recipe that worked

- **Parent:** INIT-02
- **Description:** From a good shot, or by entering values, the user pins a
  recipe for this coffee, persona, setup and drink type. Every bag of that
  coffee then starts from it on that setup, and pinning again replaces it
  while keeping the old ones. On a new setup, the closest previous setup's
  recipe gives the dial-in a head start.
- **Source sections:** S-02, S-04, S-08 (S-01 roadmap)
- **Scope**
  - In: pin from a logged shot (recipe points back to it) or enter values
    directly; the recipe records its setup, the same optional temperature and
    pressure pairs as shots, the puck prep checkboxes and, for milk drinks,
    the usual milk type and amount, copied from the shot when pinned from one.
  - In: milk is part of the drink, not the recipe's identity (S-02): a recipe
    stays scoped to coffee, persona, setup and drink type, whatever the milk.
  - In: re-pinning adds a row; the latest pin wins.
  - In: see the current recipe for a coffee, persona, setup and drink type; it
    applies to every bag of that coffee.
  - In: recipes belong to exactly one setup (S-02). When the current setup has
    no recipe for this coffee, persona and drink, Dial in starts pre-filled
    from the recipe on the closest previous setup (most parts in common),
    never as a one-tap pull. Pinning on the new setup gives it its own recipe.
  - In (working assumption DQ-19): ties between equally close setups go to the
    most recently used setup (latest shot on it).
  - In (working assumption DQ-20): dose, yield and time pre-fill from the
    closest setup's recipe. Grind pre-fills only when that setup has the same
    grinder; otherwise it starts at this grinder's last measured value (else
    the middle of its range), and the log says grind wasn't carried over,
    because grind doesn't transfer between grinders (S-01). Temperature and
    pressure carry over only with the same machine.
  - Out: batch overrides (EPIC-02-04).
  - Out: drift or offset adjustments when reading (INIT-04).
  - Out: listing a coffee's recipes on the coffee screen (EPIC-03-06 shows
    them, using this epic's resolution).
- **Dependencies:** EPIC-01-03 (pin from a shot), EPIC-01-04 (recipes carry the
  same temperature and pressure fields), EPIC-03-01 (the coffee comes from
  Beans), EPIC-01-02 (setups).
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - INIT-02 Q1 (S-02 still open): does pinning update the bag's override or the
    coffee's default? This epic assumes the coffee's default only, which is
    safe until EPIC-02-04 exists; confirm.
  - Is pinning a recipe without a source shot allowed? `source_extraction_id`
    is nullable, so the schema allows it, but no flow is described.
  - Can a one-tap shot be pinned? It only copies a recipe, so pinning it would
    add nothing; confirm it's excluded.
  - Do the prep checkboxes and milk carry over in a closest-setup pre-fill?
    They don't depend on the setup, so carrying them over seems natural;
    confirm with DQ-20.
  - Someone who alternates milks shares one recipe per drink unless they add a
    drink such as "Oat flat white" (S-02), which needs drink editing
    (EPIC-02-05, Next). Is that acceptable for the MVP?
  - Closed (DQ-19, DQ-20, working assumptions): closest-setup ties, and
    whether grind pre-fills from a setup with a different grinder.

### EPIC-02-02: Pull your daily shot in one tap

- **Parent:** INIT-02
- **Description:** Brew shows the pinned recipe for the selected persona, the
  current setup and the drink they usually make at this time of day. One tap
  on "Pull This Shot" records a one-tap shot copied from the recipe, prep
  checkboxes and milk included, so daily use is counted. With no recipe on
  this setup, the button reads "Dial in". The user can switch setup, or change
  a part, right there.
- **Source sections:** S-06, S-02, S-08
- **Scope**
  - In: Brew uses the persona selected there (in the MVP, the one main
    persona), the current setup (DQ-18, EPIC-01-02) and that persona's last
    drink type at this time of day. Brew always shows the recipe on the
    current setup, so a one-tap pull always uses that recipe's setup.
  - In (PEC-03): before a pull, the user can change the drink and the coffee
    on Brew; the recipe shown updates in place, and the pull uses the chosen
    drink and coffee. The drink and coffee selected here also pre-filter the
    Journal (EPIC-02-06).
  - In (PEC-09): the setup line on Brew and the setup field in the shot log are
    selects offering the household's setups and "change a part". The setup
    chosen becomes the current setup, and the recipe shown updates in place.
  - In: "Pull This Shot" copies the pinned recipe's values, including the
    puck prep checkboxes and the milk type and amount (S-02), into a shot
    marked one-tap, with the recipe's setup and the earliest-opened open
    portion of that coffee. "Open" means opened, not finished and not in the
    freezer (S-02): an opened-then-frozen portion isn't open until thawed, and
    one-tap never uses frozen coffee on its own. If no portion of the coffee is
    open, it asks; frozen coffee is used only when the user picks it.
  - In: no rating is asked. Undo for a few seconds.
  - In: edit a one-tap shot afterwards, found through the Journal and its edit
    flow (EPIC-02-06).
  - In: with no recipe on the current setup, the button becomes "Dial in" and
    opens the shot log (pre-filled from the closest previous setup's recipe
    when there is one, per EPIC-02-01).
  - Out: what "change a part" does to find or create a setup (EPIC-01-02).
  - Out: the good/off reaction, taste answers, suggestion and pre-filled log
    (EPIC-02-03).
  - Out: switching between several personas (EPIC-05-01).
  - Out: palate learning from these shots (EPIC-06-04).
- **Dependencies:** EPIC-02-01 (needs a pinned recipe), EPIC-01-03 (the shot
  log for "Dial in", and the setup field PEC-09 extends), EPIC-01-02 (setups
  and the current-setup rule), EPIC-03-01 (needs a portion), EPIC-02-06
  (editing a one-tap shot after the fact).
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - What counts as "this time of day" (window size), and which drink is shown
    for a persona with no history at this time? Not in the spec (design
    assumption DQ-02).
  - PEC-03 answers the "can the user change it" part of SQ-06. Which coffee
    Brew shows by default is a design assumption (DQ-03); confirm.
  - Does a drink or coffee changed on Brew stick for the next pull? Design
    assumes no saved setting (DQ-17); confirm.
  - A one-tap shot copies the recipe's prep checkboxes and milk, so a day with
    a different milk or without the WDT tool is recorded wrongly unless the
    shot is edited. That's the price of zero inputs; editing in EPIC-02-06
    fixes it. Should milk be changeable on Brew before a pull, like drink and
    coffee? Not in the spec.
  - Opening a portion when none is open: does answering the prompt mark a
    portion opened? Links to the EPIC-03-02 question on who sets "opened".
  - Closed (DQ-18, PEC-09, working assumption): which setup is current, and how
    the user switches.
  - Undo window length ("a few seconds") to be set at story level (design
    assumes 8 seconds, DQ-04).
  - X-2: success metric targets.

### EPIC-02-03: Fix a bad shot from your recipe

- **Parent:** INIT-02
- **Description:** When a shot is off, the user says in seconds how it
  differed from what they like. Tare then suggests one change for the next
  shot, shows why, and opens the shot log with that change already made. The
  user saves the new shot and, if it's right, pins it. The suggestions are
  plain rules from established practice, not AI.
- **Source sections:** S-02, S-06, S-08 (S-01 grind doesn't transfer)
- **Scope**
  - In: optional quick reaction (good, off) on a one-tap shot; silence is
    allowed and counts as a weak "fine".
  - In (SQ-17, decided): "off" on a one-tap shot opens the "just right"
    questions and tags (EPIC-01-05's controls). The answers are stored on the
    one-tap shot itself, because that's the shot the persona tasted. The fix
    is a new measured shot (DQ-12, two records).
  - In: after an off shot (an off one-tap shot, or a measured shot with
    "just right" answers or tags pointing away from 0), one suggested change
    for the next shot, with its reason shown, considered in this order
    (S-02):
    1. Puck prep, when there are channelling signs (sour and bitter at once,
       dry finish, channelling seen): use WDT or a puck screen if not ticked,
       because grind won't fix uneven extraction.
    2. Grind, for balance: finer when too sour, coarser when too bitter, in
       the grinder's own direction and steps.
    3. Yield, for strength.
    4. Dose, for body, or for strength in milk drinks, within the basket's
       dose range.
    5. Temperature, only on machines that can set it.
    6. Milk amount, when the coffee is lost in a large milk drink ("try less
       milk").
    Step size follows "a bit" or "much".
  - In: freshness (from the two clocks) and shot time are shown as
    explanations, never as levers: coffee past its peak or too fresh, fast and
    sour means under-extracted.
  - In: the shot log opens pre-filled from the pinned recipe (or, on a setup
    without one, the closest previous setup's recipe, EPIC-02-01), prep and
    milk included, with the suggested change applied and marked. The user can
    accept, change or ignore it, and saves a normal measured shot.
  - In: a dial-in from Brew opens the same pre-filled log, with a suggestion
    when the last shot on this recipe was off.
  - In: the rules are tested against a fixed set of scenarios, like any advice
    feature (S-02).
  - Out: the taste controls themselves (EPIC-01-05).
  - Out: "Dial in from this" on a past shot (EPIC-02-06).
  - Out: drift from bean age and recent shots (EPIC-04-02) and maintenance
    offsets (EPIC-04-03).
  - Out: AI advice (EPIC-06-02, which builds on these rules).
- **Dependencies:** EPIC-02-02 (one-tap shots and Brew), EPIC-02-01 (recipe to
  pre-fill), EPIC-01-03 (the log itself), EPIC-01-05 (taste answers),
  EPIC-01-04 (temperature lever), EPIC-01-02 (grinder direction and basket
  dose range). Freshness explanations appear once EPIC-03-03 ships; until then
  the suggestion works without them.
- **Priority:** MVP (S-02: suggestions ship in the MVP).
- **Rough size:** M (was S; the suggestion rules were added in revision 9)
- **Placement decision:** folded into this epic rather than a new one, because
  the suggestion is the "fix" in "fix a bad shot" and shares its flow, and
  INIT-02 already has six epics (the limit). If the rules grow, they can be
  split out when INIT-02 is next restructured.
- **Risks and open questions**
  - The rules are heuristics. Who writes the scenario set they're tested
    against, and what counts as passing? Since there's no AI in Phase 1, this
    draft assumes plain scenario tests, not an LLM judge; confirm.
  - Step sizes for "a bit" and "much" per lever (grind steps, grams, degrees,
    millilitres) aren't defined.
  - When answers point in several directions (too sour and too thin), only
    one change is suggested; the order above decides. Confirm that the user
    never sees two at once.
  - Shot time as a diagnostic needs a sense of "fast" and "slow", which links
    to the undefined "ran fast" threshold (DQ-09).
  - With an unknown grinder direction or basket dose range ("not sure",
    EPIC-01-06), the grind or dose lever can't be suggested safely; this draft
    skips that lever.
  - Should the overall rating alone, with no answers, trigger a suggestion?
    This draft says no: a rating has no direction.
  - For a new coffee with no pin on any setup, does "Dial in" start from a
    blank log or from another coffee's recipe? Not in the spec.

### EPIC-02-04: Give one bag its own recipe

- **Parent:** INIT-02
- **Description:** If one bag behaves differently from the coffee's usual, the
  user pins a recipe for that bag only. The coffee's default stays as it was
  for the next bag.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: pin a recipe for one bag (batch); it overrides the coffee's default for
    that bag only.
  - In: Brew and pre-fill use the override while that bag is in use.
  - Out: anything else about recipes (EPIC-02-01).
- **Dependencies:** EPIC-02-01, EPIC-02-02.
- **Priority:** Next. Differs from the initiative (MVP): the spec calls the
  override optional, the coffee's default delivers the initiative's goal on
  its own, and deferring it avoids building on the unresolved
  override-vs-default question (INIT-02 Q1).
- **Rough size:** S
- **Risks and open questions**
  - INIT-02 Q1 (still open) decides how a pin chooses between override and
    default; this epic can't be specified until it's answered.
  - Should the Head of Product want it in MVP, it slots in after EPIC-02-03.

### EPIC-02-05: Make the drink and milk lists yours

- **Parent:** INIT-02
- **Description:** The household renames, hides or adds drink types and milks,
  and sets how much milk each drink usually gets, so the lists match what they
  actually make. Hidden entries stop showing on Brew and in the shot log.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: drinks: rename a starter drink (stores its own name over the
    translated one), hide or unhide, add a custom drink (with or without
    milk), set the order, and set its typical milk amount.
  - In: milks: rename a starter milk, hide or unhide, add one (for example
    "Oat (barista)"), set the order. No brand catalog (S-02).
  - Out: the starter lists themselves (EPIC-01-01); the sweetened mark
    (EPIC-01-03).
- **Dependencies:** EPIC-01-01, EPIC-02-02 (Brew uses the lists).
- **Priority:** Next. Differs from the initiative (MVP): the starter lists
  cover the common drinks and milks, and S-02 doesn't place editing in a phase.
  Moves to MVP if the Head of Product wants it.
- **Rough size:** S
- **Risks and open questions**
  - Placed under INIT-02 because drink type scopes recipes and Brew; it could
    equally sit under INIT-01. Flagged as ambiguous.
  - Until this ships, a household can't add "Oat flat white" to keep separate
    recipes per milk (S-02), and the typical milk amounts are the starter
    values. See EPIC-02-01.
  - What happens to recipes and Brew's default when their drink type or milk is
    hidden? Not in the spec.
  - Closed (S-08): `has_milk` decides whether a drink shows milk fields and the
    milk wording of the strength question.

### EPIC-02-06: Look back in your journal

- **Parent:** INIT-02
- **Description:** The Journal lists what the user has made, newest first,
  narrowed by default to the drink and coffee they've chosen on Brew, and
  widened with one tap. They can open any shot to fix it, including a one-tap
  shot that didn't actually go to plan, or start a new dial-in from a past
  shot that worked.
- **Source sections:** S-02, S-08
- **Scope**
  - In: the Journal tab (S-02): past shots, measured and one-tap (marked as
    such), for the household, newest first.
  - In: filters for drink type and coffee, plus setup when the household has
    more than one setup (S-02).
  - In: by default the Journal is pre-filtered to the drink and coffee
    currently selected on Brew (EPIC-02-02), with a one-tap clear that shows
    everything.
  - In: open a shot and edit its values, including the prep checkboxes, milk,
    rating, "just right" answers and tags, in the shot log UI.
  - In: on a shot's detail, "Dial in from this" opens the shot log pre-filled
    from that past shot (values, prep and milk), to log a new measured shot.
    The past shot is unchanged.
  - In: the Journal can be opened already filtered to one coffee, which the
    coffee screen (EPIC-03-06) uses.
  - Out: free-text search, charts or analysis (not in the spec).
  - Out: undo right after a one-tap shot (EPIC-02-02).
  - Out: the suggestion after an off shot (EPIC-02-03).
  - Out: grind period dividers (EPIC-04-01) and the shot warning itself
    (EPIC-01-05); the Journal only hosts them.
- **Dependencies:** EPIC-01-03 (shots to list, and the log UI to edit in and
  pre-fill), EPIC-01-04 (edits include temperature and pressure), EPIC-01-02
  (setups for the setup filter). The default pre-filter needs Brew's selection
  (EPIC-02-02); since EPIC-02-02 depends on this epic for editing one-tap
  shots, the pre-filter is wired in when EPIC-02-02 ships. Until then the
  Journal opens unfiltered.
- **Priority:** MVP (S-02: past shots are visible in the MVP).
- **Parent decision:** INIT-02, because its MVP purpose is fixing one-tap
  shots after the fact, part of the daily one-tap flow. INIT-01 already has six
  epics, the limit.
- **Rough size:** M (was S; filters, the default pre-filter and "Dial in from
  this" were added in revision 9)
- **Risks and open questions**
  - Overlap flag: editing a one-tap shot is listed in EPIC-02-02; the Journal
    and the edit flow live here, and EPIC-02-02 links to them.
  - Overlap flag: "Dial in from this" pre-fills from a past shot; the pre-fill
    from a recipe, with a suggestion, is EPIC-02-03. Both open the same shot
    log (EPIC-01-03).
  - "Dial in from this" on a shot from a different setup than the current one:
    does it use the past shot's setup, or the current setup with the DQ-20
    carry-over rules (no grind from a different grinder)? Not in the spec.
  - "Dial in from this" on a one-tap shot copies recipe values that were never
    measured; should it be offered there? Not in the spec.
  - How far back the Journal reaches before "show older" isn't in the spec
    (design assumes 30 days, DQ-13). With filters on, should older matching
    shots be reachable?
  - A pre-filtered Journal can hide the shot someone is looking for (design
    concern); the one-tap clear is the remedy. Watch whether people expect the
    tab to remember their last filters instead.
  - When a one-tap shot is edited, does it become measured? S-02 doesn't say;
    the working assumption is that it stays one-tap. Confirm.
  - Review M1, in part: a one-tap shot marked off carries "just right" answers
    and tags (SQ-17, EPIC-02-03). Whether it can also get an overall rating
    when edited is still open.
  - Can a shot be deleted from the Journal? Not in the spec.
  - Does editing a shot that a recipe was pinned from change the recipe? S-08
    implies not (recipes are separate rows); confirm.
  - Closed (S-02, revision 10): the tab is named Journal.

---

## INIT-03: Always know what beans you have and how old they are

### EPIC-03-01: Add a bag of beans

- **Parent:** INIT-03
- **Description:** The user adds a bag they bought: which coffee it is, found in
  the catalog by roaster and coffee, whichever of roast date, packing date and
  best-before the bag shows, its weight, and optionally lot code and purchase
  date. It appears under On hand in Beans as one whole-bag portion, ready to
  brew from.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: pick roaster, then coffee, from the seeded catalog; search matches
    names and aliases.
  - In: create a batch with the coffee, lot code, roast date, packing date
    (optional, for bags that print it instead of a roast date), best-before,
    bag weight, purchase date. No date is required.
  - In: the batch starts with one portion for the whole bag.
  - In: the Beans tab with its On hand section (S-02): the bags in the house,
    their portions, and a bag's own screen.
  - Out: grouping On hand by state (EPIC-03-02).
  - Out: the Tried section and the coffee screen (EPIC-03-06).
  - Out: Beans filters (EPIC-03-05, Next).
  - Out: adding missing roasters or coffees (EPIC-01-06).
  - Out: splitting, freezing and lifecycle dates (EPIC-03-02).
  - Out: bean age (EPIC-03-03).
  - Out: bag scanning (EPIC-06-01); buying beans (not in the spec).
- **Dependencies:** EPIC-01-01.
- **Priority:** MVP (the Head of Product confirmed the MVP must let people
  choose their beans).
- **Rough size:** M
- **Risks and open questions**
  - PEC-15 proposed that this epic also own Tried and the coffee screen, at the
    top of M. Not taken: this epic must ship third so shots can be logged, and
    Tried needs shots, taste, recipes and the Journal first (see EPIC-03-06).
  - Seed list coverage for roasters and coffees, and who curates it (as in
    EPIC-01-02). Coffees' tasting notes in the catalog will later feed flavour
    preferences (S-02), so the seed should carry them where known.

### EPIC-03-02: Split and freeze a bag

- **Parent:** INIT-03
- **Description:** The user splits a bag into portions, for example half on the
  counter and half in the freezer, and records when each was frozen, thawed,
  opened and finished. The bag stays one batch with one roast date and lot.
  On hand groups bags by state, so open, unopened and frozen coffee are easy to
  tell apart.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: split a portion into several by weight, within one batch.
  - In: mark a portion frozen, thawed, opened or finished, with dates.
  - In: On hand grouped by state (S-02): open, unopened and frozen. A portion
    that was opened and then frozen is grouped as frozen and isn't open until
    thawed (S-02). Finished portions leave On hand.
  - Out: bean age (EPIC-03-03); remaining weight and stock checks
    (EPIC-03-04).
  - Out: coffees whose bags are all finished, which live on in Tried
    (EPIC-03-06).
- **Dependencies:** EPIC-03-01.
- **Priority:** MVP
- **Rough size:** M (grouping by state is small)
- **Risks and open questions**
  - Is "opened" set by the user or by the first shot logged? Not in the spec
    (design assumes both, DQ-06). The one-tap rule (earliest-opened open
    portion) depends on it.
  - A bag split into an open half and a frozen half sits in two groups. Is it
    shown once per group, or once with its portions inside? A design detail.
  - Can a portion be frozen and thawed more than once? The schema holds one
    date of each, so it implies not; confirm.
  - Must split weights add up to the bag weight? Not in the spec.
  - Correcting a date already set (freeze, thaw, open, finish) isn't in scope;
    stories should only promise what's built (review M4).

### EPIC-03-03: Know how fresh your beans really are

- **Parent:** INIT-03
- **Description:** Tare keeps two freshness clocks, both paused while coffee is
  in the freezer: how long since the coffee was roasted, and how long each
  portion has been open to the air. Brew shows both for the coffee in use, on
  one line; the bag's screen in Beans shows both. Shots ground straight from
  frozen beans are marked as such from the dates alone.
- **Source sections:** S-02 (S-09 "days open")
- **Scope**
  - In: since roasting, per batch: from the roast date; if the bag shows only
    a packing date, from that, labelled as packed; if it shows only
    best-before, no age is invented and the time left until best-before is
    shown instead; with no date, no roasting age.
  - In: since opening, per portion: from its opened date (air exposure).
  - In: time in the freezer counts toward neither clock. Both are calculated,
    never stored.
  - In: Brew shows both clocks for the coffee in use on one line (Head of
    Product decision, revision 7); the bag's screen shows both, the roasting
    clock in the bag's facts and the opened clock on each portion.
  - In: identify shots ground from frozen and mark them where shots and
    portions are shown.
  - In: the clocks are available to dial-in suggestions as explanations (too
    fresh or past its peak), never as levers (EPIC-02-03).
  - Out: using age to adjust grind (EPIC-04-02).
- **Dependencies:** EPIC-03-02 (opened, frozen and thawed dates), EPIC-01-03
  (shots to mark), EPIC-03-01 (roast, packing and best-before dates).
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - What counts as "too fresh" or "past its peak" for the suggestion
    explanations isn't defined in the spec.
  - Closed (S-02): INIT-03 Q2, the age rule for best-before-only and undated
    bags (review blocker B1).
  - Closed (S-02): the S-09 "days since batch opened" input is the
    since-opening clock.
  - Closed (Head of Product, revision 7): Brew shows both clocks on one line.
  - Before a portion is opened, or when only best-before is known, the line on
    Brew has one clock or a best-before phrase instead; the exact wording is a
    design detail. The two clocks must never be confusable.

### EPIC-03-04: See how much coffee is left

- **Parent:** INIT-03
- **Description:** Each portion shows how much is left, worked out from its
  weight and the doses of every shot against it, one-tap shots included. The
  user can weigh what's left to correct it, and bags show as open or finished.
- **Source sections:** S-02, S-08
- **Scope**
  - In: remaining weight per portion and bag from weight minus doses of
    measured and one-tap shots, corrected by the latest stock check;
    calculated, never stored.
  - In: optional stock check (weigh what's left).
  - In: bag status (open, finished) calculated from portion dates.
  - Out: usage rate and run-out prediction (EPIC-03-05).
- **Dependencies:** EPIC-03-02 (portion dates), EPIC-01-03 (doses), EPIC-02-02
  (one-tap shots make doses complete).
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - INIT-03 Q3: a portion that runs negative against logged doses.
  - Unlogged shots make remaining weight overstate stock. Should the app prompt
    a stock check, and when? Not in the spec.

### EPIC-03-05: Know when you'll run out, and find any coffee

- **Parent:** INIT-03
- **Description:** Beans tells the household roughly when it will run out of
  coffee, counting frozen stock, based on its real usage rate. It also lets
  them narrow Beans down by roaster, roast level, origin or rating, to find a
  coffee in a long Tried list.
- **Source sections:** S-02, S-08
- **Scope**
  - In: usage rate from finished portions, doses (one-tap included), stock
    checks and purchase dates; calculated, never stored.
  - In: predicted run-out date across all portions, frozen included.
  - In: how much of real usage logging captures (S-02).
  - In (revision 10): Beans filters by roaster, roast level, origin and rating
    (S-02), over On hand and Tried.
  - Out: reorder prompts or buying (not in the spec).
- **Dependencies:** EPIC-03-04 (run-out), EPIC-03-06 (Tried, which the filters
  narrow), EPIC-03-02 (On hand groups).
- **Priority:** Next. Run-out differs from the initiative (MVP): INIT-03 Q1
  asks whether prediction is Phase 1, and a prediction needs weeks of
  finished portions to be useful, which the MVP epics collect. Beans filters
  are Next by S-02. Either part moves to MVP if the Head of Product says so.
- **Rough size:** M, at the top (the filters are small on their own).
- **Placement decision:** Beans filters needed a Next home and INIT-03 has six
  epics (the limit), so they join this epic, the only Next epic about Beans.
  Run-out and filters are separate pieces of value; split them if INIT-03 is
  restructured.
- **Risks and open questions**
  - INIT-03 Q1: is prediction (and any reorder prompt) Phase 1?
  - Accuracy method and target are not given (X-2).
  - The catalog has no origin field (S-08), so filtering by origin needs one,
    filled in the seed list and asked for user-added coffees.
  - What "rating" means for a coffee isn't defined: the same summary as
    Tried's "how its shots went" (EPIC-03-06), or something else?

### EPIC-03-06: See every coffee you've tried

- **Parent:** INIT-03
- **Description:** The Tried section of Beans lists every coffee the household
  has ever used, one row per coffee, with when it was last had, how many bags
  they've bought and how its shots went. Opening a coffee shows a light coffee
  screen with its details, its recipes and its shots, so a coffee worth buying
  again is easy to find long after the bag is gone.
- **Source sections:** S-02, S-08 (design PEC-15)
- **Scope**
  - In: one row per coffee ever used (any bag, finished or not), with when it
    was last had (latest shot), the bag count, and how its shots went (S-02).
    All calculated from bags, shots and taste, never stored.
  - In: newest-had first, below On hand.
  - In (PEC-15): the coffee screen (design `SCR-COFFEE`), light: the coffee's
    roaster, name, roast level and tasting notes from the catalog; its bags
    (on hand and finished); its current recipes per drink and setup
    (EPIC-02-01's resolution); and a link to the Journal filtered to this
    coffee (EPIC-02-06).
  - In: the coffee screen is reachable from Tried and from a bag in On hand.
  - Out: filters by roaster, roast level, origin or rating (EPIC-03-05, Next).
  - Out: editing the coffee's catalog entry (EPIC-01-06 for a household's own
    unverified coffee; otherwise not in the MVP).
  - Out: recommending coffees to buy (EPIC-06-04, EPIC-06-06).
- **Dependencies:** EPIC-03-01 (bags and the Beans tab), EPIC-01-03 (shots),
  EPIC-02-02 (one-tap shots count as "had"), EPIC-01-05 (ratings and answers
  for "how its shots went"), EPIC-02-01 (recipes to show), EPIC-02-06 (the
  Journal to link to).
- **Priority:** MVP (S-02: Tried ships in the MVP, without filters).
- **Placement decision (PEC-15):** a new epic in INIT-03 (which had five, so
  room for one) rather than EPIC-03-01. Tried and the coffee screen need
  shots, taste, recipes and the Journal, which come late in the build order,
  while EPIC-03-01 must ship third.
- **Rough size:** M, at the small end (a calculated list plus one light screen
  over existing data).
- **Risks and open questions**
  - "How its shots went" isn't defined: the average overall rating, the share
    of shots marked good or off, or a summary of "just right" answers? Taste
    is relative to the persona (S-02), so a household summary mixes personas
    once there are several (EPIC-05-01). This draft assumes a simple summary
    for the one MVP persona; confirm.
  - The summary line can read as a verdict on the coffee ("mostly off") when
    the user simply hadn't dialled it in yet (design concern). It should
    describe the shots, never judge the coffee, and never use colour.
  - Does a coffee count as tried once a bag is added, or only once a shot is
    logged from it? S-02 says "every coffee ever used"; this draft assumes a
    shot is needed, so bags never opened appear only in On hand.
  - With many bags on hand, Tried sits below the fold (design concern); the
    design keeps its heading reachable.
  - Merged catalog entries (EPIC-06-07) must collapse into one row.

---

## INIT-04: Grind settings stay meaningful through maintenance and time

### EPIC-04-01: Record maintenance on your equipment

- **Parent:** INIT-04
- **Description:** In Setup, the user logs dated work on one part (machine,
  grinder or basket), such as new burrs, a clean, a re-zero or a repair, and
  can mark it as a recalibration. Servicing a part keeps the same setup. For a
  grinder, each event starts a new grind period, so history is split
  correctly from day one.
- **Source sections:** S-01, S-02, S-04, S-08
- **Scope**
  - In: add a maintenance event (kind, date, note) to an owned part, and see a
    part's events. The setup doesn't change (S-02).
  - In: for grinders, each event starts a new grind period (derived from the
    dates); shots and recipes are placed in a period through their setup's
    grinder.
  - In: mark an event as a recalibration, a flag on the event (S-01, TQ-05).
  - In (PEC-06): where grind periods show: maintenance dividers between shots
    in the Journal, for the grinders of the shots listed (including when the
    Journal is filtered), and the current period's start on the part's screen.
  - Out: offsets (EPIC-04-03, EPIC-04-04).
- **Dependencies:** EPIC-01-02 (parts), EPIC-02-06 (the Journal the dividers
  sit in).
- **Priority:** MVP. Differs from the initiative (Next): S-02 says maintenance
  events are recorded from Phase 1, so grind history is split correctly from
  day one.
- **Parent decision:** stays under INIT-04. The approved `initiatives.md` lists
  maintenance events in INIT-04's scope, INIT-01 already has six epics (the
  limit), and keeping the ID avoids churn.
- **Rough size:** S
- **Risks and open questions**
  - Should a grind suggestion (EPIC-02-03) look only at shots in the current
    grind period? It reacts to the last off shot, so this draft assumes yes.
  - Should "Dial in from this" (EPIC-02-06) warn when the past shot is from an
    earlier grind period? Its grind may no longer mean the same. Not in the
    spec.
  - Closed (TQ-05): recalibration is a flag on any event, not an event kind.
  - Closed (PEC-06): grind periods show as dividers in the Journal and as the
    period start on the part's screen.
  - Should the recalibration flag default on for burrs and re-zero? Design
    assumes so (DQ-15); confirm.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

- **Parent:** INIT-04
- **Description:** When the user opens their recipe, Tare shows a grind
  adjusted for how the beans have aged and how this bag has been behaving,
  learned from their own measured shots with recent ones counting most. The
  stored recipe is unchanged.
- **Source sections:** S-01, S-02, S-04
- **Scope**
  - In: drift adjustments for bean age and the bag's own character,
    calculated from logged shots at read time, never stored.
  - In: only measured shots count as measurements; one-tap shots count only as
    "the recipe was fine" (S-08 entry mode).
  - In: recent shots weighted more than older ones.
  - In: show the adjustment on Brew and in the pre-filled log.
  - Out: the one-change suggestion after an off shot (EPIC-02-03).
  - Out: maintenance offsets (EPIC-04-03).
  - Out: AI explanations (EPIC-06-02).
- **Dependencies:** EPIC-03-03 (bean age), EPIC-02-02 and EPIC-02-03 (where it
  is shown), EPIC-04-01 (only shots in the current grind period are
  comparable).
- **Priority:** Next
- **Rough size:** L
- **Risks and open questions**
  - Overlap flag: EPIC-02-03 suggests one change after an off shot and treats
    freshness only as an explanation; this epic adjusts the starting grind
    ahead of time from history. When both apply, which one wins on the
    pre-filled log? Not in the spec.
  - Overlap flag: S-02 and S-04 list "kit maintenance" as a drift adjustment.
    It is assigned to EPIC-04-03 (offsets).
  - INIT-04 Q2: recency weighting strength and window.
  - INIT-04 Q3: how bean-aging drift is estimated, and from how many shots.
    Which of the two freshness clocks (S-02) drives it, or both?
  - INIT-04 Q4: shown as a changed grind, a note, or both.
  - Should shots with and without WDT or puck screen be compared as equals?
    Prep changes how a shot runs; not in the spec.
  - Is this an algorithm, not AI? Confirm it fits the "no AI" rule when it
    ships, or whether it needs evals like the AI features.

### EPIC-04-03: Re-dial once after maintenance and keep every recipe

- **Parent:** INIT-04
- **Description:** After maintenance on a grinder, the user re-dials one
  coffee. Tare turns the difference into an offset, the user confirms or edits
  it, and every recipe pinned before the event reads correctly again.
- **Source sections:** S-02, S-08
- **Scope**
  - In: after an event, re-dial one coffee and propose the shift in grinder
    units, with bean aging between the two dial-ins subtracted first.
  - In: user confirms or edits; the shift is stored on the event with the
    re-dial it came from, and stays editable.
  - In: apply the shift when reading recipes pinned before the event on
    setups that include that grinder; stored recipes are never rewritten.
  - Out: stretch factor from two or more coffees (EPIC-04-04).
- **Dependencies:** EPIC-04-01 (events), EPIC-04-02 (bean-aging estimate to
  subtract), EPIC-02-01 (recipes to map).
- **Priority:** Next
- **Rough size:** M
- **Risks and open questions**
  - INIT-04 Q3: the aging estimate this epic subtracts.
  - How are offsets chained across several events on one grinder? S-08 gives
    one formula per event; chaining is implied but not stated.
  - Non-grinder events (machine repair): do they affect anything? Not in the
    spec.

### EPIC-04-04: Keep recipes right after new burrs of a different design

- **Parent:** INIT-04
- **Description:** When the user re-dials two or more coffees after the same
  event, Tare also works out a stretch factor, so recipes stay right when new
  burrs change what each step means.
- **Source sections:** S-02, S-08
- **Scope**
  - In: stretch factor from two or more re-dials after one event; stays 1
    otherwise.
  - In: confirmed and editable like the shift; applied at read time.
- **Dependencies:** EPIC-04-03.
- **Priority:** Next
- **Rough size:** S
- **Risks and open questions**
  - How to fit shift and stretch from more than two coffees (which method),
    and what to do when re-dials disagree. Not in the spec.

---

## INIT-05: Brew for the whole household, each to their own taste

### EPIC-05-01: Brew for someone else in the household

- **Parent:** INIT-05
- **Description:** A household member adds profiles for people they brew for
  who don't have a login, such as a partner or a regular guest. They pick a
  profile on Brew, and each has its own pinned recipes, usual drinks, taste
  answers and shots in the Journal.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: create, rename and manage sub personas (no login).
  - In: choose the persona on Brew; recipes, the time-of-day drink, logging
    and "just right" answers follow it.
  - In: shots record the sub persona as whose taste and the member as who
    logged.
  - Out: invites and claiming (EPIC-05-02).
  - Out: schema changes (S-02: only the UI changes).
- **Dependencies:** EPIC-02-02 (persona selection on Brew), EPIC-01-03.
- **Priority:** Next
- **Rough size:** M
- **Risks and open questions**
  - Can a sub persona be deleted, and what happens to its shots? Not in the
    spec.
  - Does a sub persona have a default label like "Me", or must it be named?
    S-02 covers only the default persona.
  - The current setup follows the persona's last shot (DQ-18), so switching
    persona can switch setup too; confirm that's wanted.
  - "Just right" answers only mean something for the persona who tasted the
    shot; when one member answers for another, the answers are second-hand.
    Not in the spec.
  - Should the Journal (EPIC-02-06) and Tried (EPIC-03-06) gain a persona
    filter once there are several personas? Tried's "how its shots went"
    mixes personas otherwise. Not in the spec.

### EPIC-05-02: Invite them to take over their own profile

- **Parent:** INIT-05
- **Description:** A member invites the person behind a sub persona. That
  person signs in with Google, joins the household and claims the profile as
  their own main persona, keeping all its history.
- **Source sections:** S-02, S-04, S-07, S-08
- **Scope**
  - In: send an invite to join the household; joining adds a membership with a
    role (owner, member).
  - In: the joiner claims a sub persona, which becomes their main persona with
    its history.
  - In: a claimed persona's shots follow its own user's consent; an unclaimed
    persona never qualifies, whoever logged it (S-02, S-07).
  - Out: the consent setting and the network (EPIC-06-05).
  - Out: Google sign-in and account linking (EPIC-05-03).
- **Dependencies:** EPIC-05-01 (sub personas to claim), EPIC-05-03 (the invitee
  signs in with Google).
- **Priority:** Later, per the initiative (phase 3 invites).
- **Rough size:** L
- **Risks and open questions**
  - INIT-05 Q1: phase 2 and 3 timing (this epic's priority).
  - INIT-05 Q2: owner versus member permissions.
  - INIT-05 Q3: what happens if the person leaves the household.
  - Can an invitee join without a sub persona to claim (getting a new main
    persona)? Every login has one main persona (S-04), but this path isn't
    described.
  - How an invite is delivered (link, email) is not in the spec.
  - An invitee who already has their own anonymous account and household:
    what happens to it on joining? Not in the spec.

### EPIC-05-03: Keep your coffee history when you change phones

- **Parent:** INIT-05
- **Description:** The user signs in with Google, and Firebase links that to the
  anonymous account they've been using, so nothing moves and nothing is lost.
  Their history is no longer tied to one device and survives a lost or reset
  phone, or a browser clearing its storage.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: Google sign-in linked by Firebase to the existing anonymous account;
    `firebase_uid` and all data stay as they are.
  - In: signing in with Google on another device reaches the same account.
  - Out: invites, joining a household and claiming a persona (EPIC-05-02).
  - Out: data-sharing consent (EPIC-06-05).
- **Dependencies:** EPIC-01-01 (the anonymous account to link).
- **Priority:** Next, ordered first among the Next epics and ahead of invites
  (S-02). Decided (S-02, review M6): it stays Next. The MVP explicitly accepts,
  for a prototype, both the lost-or-reset-device risk and the risk that Safari
  on iOS deletes the site's storage after a period without use, silently
  starting a new, empty household.
- **Parent decision:** INIT-05, because it's about logins and households
  (S-02 "users are logins") and invites build on it. INIT-01 already has six
  epics, the limit. Note that INIT-05 doesn't list Google sign-in in its
  scope in `initiatives.md`, which predates this decision.
- **Rough size:** S
- **Risks and open questions**
  - What happens if the Google account is already linked to a different
    Firebase account (for example the user set up a second device anonymously
    first)? Two households would exist; merging them isn't in the spec.
  - Should the app prompt anonymous users to link, and when? Not in the spec.
  - Does the default persona's label change once a Google account is linked?
    S-02 keeps no personal data by default; confirm the name isn't taken from
    Google.

---

## INIT-06: Dial in a new bag in fewer shots with AI and the community

Every epic here ships with its own evals and observability (S-01). INIT-06
holds six epics, the limit. INIT-06 Q1 (split the initiative) is more pressing:
a natural split is coaching and scanning (EPIC-06-01, 06-02, 06-04) versus
community and catalog (EPIC-06-05, 06-06, 06-07), which would also let RAG
become its own epic again.

### EPIC-06-01: Scan a bag instead of typing it

- **Parent:** INIT-06
- **Description:** The user photographs a bag and Tare fills in roaster, name,
  roast level and tasting notes. Anything not on the label stays empty rather
  than guessed.
- **Source sections:** S-09, S-01
- **Scope**
  - In: Vision Scanner: image to strict JSON, roast level from the fixed list,
    up to four title-cased notes, null when absent.
  - In: result fills the add-a-bag flow in Beans for review.
  - In: evals and observability for the scanner.
  - Out: dates, weight and lot from the label (not in the S-09 schema).
- **Dependencies:** EPIC-03-01, EPIC-01-06 (a scanned coffee may need adding).
- **Priority:** Later
- **Rough size:** M
- **Risks and open questions**
  - INIT-06 Q5: model choices fixed or placeholders.
  - How a scan is matched to an existing roaster and coffee: by name and alias
    search, or by the EPIC-06-07 matcher? Not in the spec.
  - The eval set for the scanner isn't described; S-09 only defines one for
    the Coach.

### EPIC-06-02: Get a grounded fix when a shot goes wrong

- **Parent:** INIT-06
- **Description:** After a bad shot the Diagnostic Coach reads the numbers,
  the persona's "just right" answers and tags, the setup, puck prep, milk and
  freshness, and tells the user what to change on their own equipment, in the
  right direction on their dial. It builds on the MVP's suggestion rules and
  draws on extraction guides and the manuals for their equipment.
- **Source sections:** S-09, S-08, S-01, S-02, S-03
- **Scope**
  - In: Diagnostic Coach: diagnosis, action and suggested variables as JSON,
    using the grinder's coarser direction, the basket's dose range and the
    setup's parts, from measured shots and off one-tap shots' answers. Its
    "days open" input is the since-opening clock (S-02).
  - In: builds on the rule-based suggestions of EPIC-02-03 (S-02): the same
    lever order and limits, explained in more depth.
  - In: S-09's rule "if channelling is tagged and the toolkit lacks a WDT,
    suggest WDT" reads the shot's `usedWdt` checkbox and the "channelling
    seen" tag (S-02).
  - In: RAG over extraction guides and equipment manuals (folded in from the
    retired EPIC-06-03).
  - In: shown in the fix-a-bad-shot flow.
  - In: eval harness (`npm run eval`, LLM-as-a-judge on safety, accuracy,
    alignment, pass if all at 4 or above) against a Golden Dataset, plus
    observability.
  - Out: palate inputs beyond the shot's own answers (EPIC-06-04).
- **Dependencies:** EPIC-02-03 (the rules it builds on), EPIC-01-05 (taste
  answers and tags), EPIC-03-03 (freshness clocks), EPIC-01-03 (prep
  checkboxes and milk).
- **Priority:** Later
- **Rough size:** L
- **Risks and open questions**
  - Size: with RAG folded in this is at the top of L. If INIT-06 is split, RAG
    should become its own epic again, shipping after the Coach.
  - INIT-06 Q6: source and owner of the Golden Dataset. The MVP's rule
    scenarios (EPIC-02-03) could seed it.
  - INIT-06 Q5: model choices.
  - S-09's prompt still says "Toolkit Components" and "Sensory Scores & Tagged
    Defects"; it should be updated to the setup, prep checkboxes, milk and the
    "just right" model when this epic is re-planned.
  - The eval scores palate alignment, but the Coach has no learned taste
    target until EPIC-06-04. Either the metric waits or EPIC-06-04 ships
    first.
  - Which guides and manuals, their licensing, and who maintains them. Not in
    the spec.

### EPIC-06-04: Tare learns your palate as you log

- **Parent:** INIT-06
- **Description:** Without any survey, Tare learns each persona's target for
  each drink style and milk, their ideal straight espresso and their ideal
  oat flat white being different targets, from their "just right" answers and
  ratings, and uses it to shape advice.
- **Source sections:** S-01, S-02, S-06, S-04
- **Scope**
  - In: per-persona taste target per drink style and milk (S-02), derived
    implicitly from "just right" answers, ratings and reactions captured from
    the MVP on; no preference forms.
  - In: flavour preferences inferred from ratings and the coffees' catalog
    tasting notes (S-02).
  - In: one-tap shots are never treated as measurements; silence counts as a
    weak "fine" and reactions as stronger signals (S-02).
  - In: evals and observability.
  - Out: matching against community recipes (EPIC-06-06).
- **Dependencies:** EPIC-01-05 (ratings and "just right" answers), EPIC-02-03
  (reactions and off one-tap answers).
- **Priority:** Later (S-02: palate learning comes later; the data is captured
  from the MVP on).
- **Rough size:** M
- **Risks and open questions**
  - INIT-06 Q2: should a simple non-AI taste profile ship earlier, as a core
    differentiator? The "just right" answers make a rule-based target
    feasible; if wanted, a non-AI slice of this epic moves to Next.
  - What makes two drinks the same "drink style" (a household's custom
    drinks) isn't defined.

### EPIC-06-05: Share your shots, with your consent

- **Parent:** INIT-06
- **Description:** A user opts in to share their own shots, anonymized, with the
  community. Only complete, measured shots from personas claimed by a
  consenting user qualify, along with enough of the persona's taste answers to
  compare palates.
- **Source sections:** S-05, S-07, S-02
- **Scope**
  - In: explicit personal opt-in on the user.
  - In: tiering: partial logs stay private; network-eligible shots need a
    measured shot with the full MVPayload and a claimed persona whose user
    opted in. One-tap shots are never eligible.
  - In: shared shots carry the persona's "just right" answers and ratings, so
    palates can be compared (S-02 "learn only from similar palates").
  - In: PII stripped and cohort IDs on shared extractions.
  - Out: using shared data for baselines (EPIC-06-06).
- **Dependencies:** EPIC-01-03, EPIC-01-05 (taste answers); EPIC-05-02 only for
  claimed sub personas (main personas qualify without it).
- **Priority:** Later
- **Rough size:** M
- **Risks and open questions**
  - INIT-06 Q4: what cohort IDs are grouped by.
  - INIT-06 Q7: withdrawing consent and deleting data, and shots already
    shared.
  - Is a palate summary personal data under S-07? Sharing it needs the same
    consent and decoupling as the shots.
  - X-3: whether eligibility is computed from day one.
  - Can an anonymous (not yet Google-linked) user opt in? S-07 ties consent to
    "their own login"; unclear whether an anonymous account counts.

### EPIC-06-06: Start a new bag from the community, tuned to you

- **Parent:** INIT-06
- **Description:** When a user adds a new bag, Tare suggests starting variables
  from community shots of the same coffee in its first week, counting each
  contributor only as far as their palate resembles the user's. If a pro's
  recipe aims for a different taste, it warns the user and suggests a version
  nudged toward their palate.
- **Source sections:** S-05, S-03, S-02
- **Scope**
  - In: Cold Start baseline from community extractions logged within 7 days of
    a batch being opened (freshness anchor).
  - In: learn only from similar palates (S-02, S-05 C): a contributor's shots
    count as evidence for the user only to the degree their palate resembles
    the user's, never just because they used the same coffee.
  - In: trust weights by contributor level (Enthusiast vs Verified Pro).
  - In: Match Score Warning and suggested translation toward the user's
    palate.
  - In: evals and observability.
- **Dependencies:** EPIC-06-05 (shared data with taste answers), EPIC-06-04
  (the user's palate), EPIC-06-01 (S-05 triggers on scanning a new bag),
  EPIC-06-02 (the Coach suggests the translation), EPIC-06-07 (the same coffee
  across households must be one catalog entry).
- **Priority:** Later
- **Rough size:** L
- **Risks and open questions**
  - INIT-06 Q3: how contributor level is determined; no schema field. How
    trust weights combine with palate similarity isn't defined.
  - Grind doesn't transfer between grinders (S-01), so how a community grind
    becomes a starting point for the user's grinder is open.
  - Palate similarity needs enough answers on both sides; new users have few.
  - Could be split (baseline vs palate alignment) if it proves too large.

### EPIC-06-07: Merge duplicate catalog entries, with AI suggestions

- **Parent:** INIT-06
- **Description:** When the same grinder, basket or coffee has been added
  twice, for example under its UK and US names, the entries are merged into one
  so every household's history and the community data line up. An AI suggests
  likely duplicates with a confidence and a reason, and a person always
  confirms.
- **Source sections:** S-02, S-08
- **Scope**
  - In: merge a duplicate into a surviving entry; the duplicate stays as a
    pointer, never deleted, and everything that referenced it follows.
  - In: every merge logged: who or what suggested it, confidence, reason,
    when decided.
  - In: LLM suggestions of likely duplicates from names, regional pages and
    page content; a person or a reviewed rule confirms each merge.
  - In: evals with known duplicates and known look-alikes that must not merge,
    plus observability.
  - Out: exact normalised-URL flagging at add time (EPIC-01-06).
- **Dependencies:** EPIC-01-06 (user additions, URLs and aliases to compare).
- **Priority:** Later (AI feature, per S-01 and S-02).
- **Rough size:** L
- **Risks and open questions**
  - Placement: put under INIT-06 because it's an AI feature with evals and is
    what makes community data line up across households (EPIC-06-06). S-02 and
    S-08 are not among INIT-06's sources in `initiatives.md`.
  - Closed (S-02): until this epic ships, verification and merges are a
    manual admin task. This epic replaces that with tooling.
  - Who is the "person" who confirms an LLM-suggested merge here: the admin,
    or the households involved? Not in the spec.
  - What happens when two merged entries carry conflicting data (different
    capabilities, dose ranges or roast level)? Merging two models used in
    setups could also make two setups identical, and merging two coffees
    combines their Tried rows and coffee screens; not in the spec.
  - INIT-06 Q5: model choice for the matcher.

---

## Section coverage

| Initiative | Source sections | Covered by |
|---|---|---|
| INIT-01 | S-01, S-02, S-04, S-06, S-07, S-08 | S-01: 01-01 (app shell), 01-03, 01-05 (shot warnings), and the design constraint; S-02: 01-01 (tab names, starter milks), 01-02 (fixed setups, current setup, basket dose range), 01-03 (prep, milk), 01-04, 01-05 ("just right" taste), 01-06; S-04: 01-01, 01-02 (setups), 01-06; S-06: 01-01 (app shell), 01-03, 01-05; S-07: 01-01, 01-03 (and localization constraint); S-08: all |
| INIT-02 | S-01, S-02, S-04, S-06, S-08 | S-01: 02-01 and 02-03 (grind doesn't transfer); S-02: 02-01 to 02-06 (recipes per setup with prep and milk in 02-01; setup switching, prep and milk copy and "open" excludes frozen in 02-02; rule-based suggestions and SQ-17 in 02-03; milk list editing in 02-05; the Journal with filters in 02-06); S-04: 02-01, 02-04, 02-05; S-06: 02-02, 02-03; S-08: 02-01 to 02-06 |
| INIT-03 | S-02, S-04, S-08 | S-02: all (Beans with On hand in 03-01 and 03-02, two freshness clocks in 03-03, packing date in 03-01, open-vs-frozen in 03-02, Beans filters in 03-05, Tried and the coffee screen in 03-06); S-04: 03-01, 03-02; S-08: 03-01, 03-02, 03-04, 03-05, 03-06 |
| INIT-04 | S-01, S-02, S-04, S-08 | S-01: 04-01, 04-02; S-02: all; S-04: 04-01, 04-02; S-08: 04-01, 04-03, 04-04 |
| INIT-05 | S-02, S-04, S-07, S-08 | S-02, S-04, S-08: 05-01, 05-02, 05-03 (accepted storage risks); S-07: 05-02 |
| INIT-06 | S-01, S-03, S-05, S-07, S-09 | S-01: 06-01, 06-02, 06-04; S-03: 06-02, 06-06; S-05: 06-05, 06-06 (similar palates, S-05 C); S-07: 06-05; S-09: 06-01, 06-02 |

S-02 decisions and where they land: accounts (EPIC-01-01, EPIC-05-03),
Google sign-in first after the MVP and the accepted lost-device and storage
eviction risks (EPIC-01-01, EPIC-05-03), section names Brew, Journal, Beans and
Setup (EPIC-01-01 shell; EPIC-02-02, EPIC-02-06, EPIC-03-01, EPIC-01-02), the
Journal with filters and "Dial in from this" (EPIC-02-06), Beans On hand
(EPIC-03-01, EPIC-03-02), Tried and the coffee screen (EPIC-03-06), Beans
filters (EPIC-03-05), private unverified entries and manual admin review
(EPIC-01-06, EPIC-06-07), catalog (EPIC-01-02, EPIC-03-01, EPIC-01-06,
EPIC-06-07), drink types (EPIC-01-01, EPIC-01-03, EPIC-02-05), default persona
label (EPIC-01-01), one-tap shots (EPIC-02-02, EPIC-02-03, EPIC-03-04,
EPIC-04-02, EPIC-06-04, EPIC-06-05), maintenance from Phase 1 (EPIC-04-01),
setups as machine, grinder and basket (EPIC-01-02, EPIC-01-06, EPIC-02-01,
EPIC-02-02, EPIC-04-01), puck prep checkboxes (EPIC-01-03, EPIC-02-01,
EPIC-02-02, EPIC-02-03, EPIC-02-06, EPIC-06-02), two freshness clocks
(EPIC-03-01, EPIC-03-03, EPIC-06-02), "open" excludes frozen (EPIC-02-02,
EPIC-03-02), taste relative to the persona (EPIC-01-05, EPIC-02-03,
EPIC-02-06, EPIC-03-06), rule-based dial-in suggestions (EPIC-02-03,
EPIC-06-02), palate learning per persona, drink and milk (EPIC-06-04), learn
only from similar palates (EPIC-06-05, EPIC-06-06), milk (EPIC-01-01,
EPIC-01-03, EPIC-02-01, EPIC-02-02, EPIC-02-03, EPIC-02-05), basket dose range
(EPIC-01-02, EPIC-01-06, EPIC-02-03), technical decisions TQ-04 to TQ-07
(cross-cutting constraints, EPIC-01-06, EPIC-04-01). Design: PEC-09
(EPIC-02-02, EPIC-01-02), PEC-15 (EPIC-03-06, EPIC-03-05), DQ-18 and DQ-21
(EPIC-01-02), DQ-19 and DQ-20 (EPIC-02-01).

## Overlap and ambiguity flags

- Shots logged against a portion: in INIT-01 and INIT-03; assigned to
  EPIC-01-03.
- Maintenance drift: S-02 and S-04 call it a drift adjustment; assigned to
  EPIC-04-03 (offsets), not EPIC-04-02.
- Personal consent: INIT-05 and INIT-06 both cite S-07. The rule that claimed
  personas follow their user's consent is in EPIC-05-02; the opt-in and
  eligibility computation are in EPIC-06-05.
- Recipe resolution ("which recipe applies now", including the closest
  previous setup's recipe for a dial-in on a new setup, its ties and what
  carries over) lives in EPIC-02-01; Brew (EPIC-02-02), pre-fill (EPIC-02-03)
  and the coffee screen (EPIC-03-06) only use it.
- Pre-filled shot logs: from a recipe, with a suggestion, is EPIC-02-03; from a
  past shot ("Dial in from this"), EPIC-02-06; from the closest setup's
  recipe, EPIC-02-01. All open EPIC-01-03's shot log.
- Catalog: picking from the seed list is split by catalog (hardware in
  EPIC-01-02, coffee in EPIC-03-01); adding entries for both is EPIC-01-06;
  merging for both is EPIC-06-07. The catalog serves INIT-01, INIT-03 and
  INIT-06 but has no initiative of its own.
- Beans (revision 10): the tab, its On hand list and a bag's screen are
  EPIC-03-01; grouping On hand by state is EPIC-03-02; freshness and remaining
  weight shown on it are EPIC-03-03 and EPIC-03-04; Tried and the coffee
  screen are EPIC-03-06, which shows recipes (EPIC-02-01) and links to the
  Journal (EPIC-02-06) without owning them; Beans filters are EPIC-03-05.
- EPIC-03-05 holds two Next pieces of Beans value (run-out and filters)
  because INIT-03 is at its six-epic limit; flagged for splitting.
- Taste: the controls (rating, "just right" questions, tags) and the
  channelling warning are EPIC-01-05; the good/off reaction, the off one-tap
  answers (SQ-17) and the suggestion are EPIC-02-03; editing answers later is
  EPIC-02-06; Tried's "how its shots went" summary is EPIC-03-06; learning a
  target is EPIC-06-04.
- Suggestions: the one change after an off shot is EPIC-02-03; ahead-of-time
  drift from bean age and history is EPIC-04-02; AI advice is EPIC-06-02,
  building on the rules.
- Milk: starter list and typical amounts are EPIC-01-01; editing both is
  EPIC-02-05; milk on a measured shot is EPIC-01-03; on recipes, EPIC-02-01;
  the one-tap copy, EPIC-02-02; milk amount as a lever, EPIC-02-03.
- Journal filters: the filters, the default pre-filter and its clear are
  EPIC-02-06; Brew's drink and coffee selection they follow is EPIC-02-02.
- Drink and milk list editing (EPIC-02-05) could sit under INIT-01 or INIT-02.
- Google sign-in and linking is its own epic (EPIC-05-03); EPIC-05-02 only
  depends on it.
- Editing shots: the Journal and edit flow are EPIC-02-06; EPIC-02-02 only
  links to them for one-tap shots; undo stays in EPIC-02-02.
- App shell: the frame and the four tabs are EPIC-01-01; each tab's content
  belongs to the epic that owns it.
- Shot warnings: owned by EPIC-01-05; the Journal (EPIC-02-06) only displays
  them.
- Grind period display: owned by EPIC-04-01; the Journal (EPIC-02-06) and the
  part's screen in Setup (EPIC-01-02) host it.
- Catalog capabilities: seeded models' capabilities and basket dose ranges
  come with the seed list (EPIC-01-02); user-added models' capabilities and
  dose ranges are entered, and edited while unverified, in EPIC-01-06.
- Setups: setup identity is EPIC-01-02; recipes per setup and the
  closest-setup pre-fill are EPIC-02-01; servicing a part is EPIC-04-01.
- Setup switching (PEC-09): the current-setup rule and what "change a part"
  does are EPIC-01-02; the selects on Brew and in the shot log are EPIC-02-02,
  even though the shot log is EPIC-01-03's screen.
- Puck prep: the checkboxes on a measured shot are EPIC-01-03; on recipes and
  pinning, EPIC-02-01; the one-tap copy, EPIC-02-02; prep as a suggestion
  lever, EPIC-02-03; editing, EPIC-02-06.
- Freshness: both clocks and where they show are owned by EPIC-03-03; Brew
  (EPIC-02-02) and the bag's screen in Beans (EPIC-03-01) host them, and
  suggestions (EPIC-02-03) use them as explanations. The "open" rule for
  portions is stated in EPIC-03-02 and applied by EPIC-02-02.

## Resolved questions

Answered by the Head of Product and recorded in S-02:

- INIT-01 Q1 (catalog source): curated seed list, extendable by households
  with a product URL; verification is a manual admin task in the MVP.
  Remaining: who curates the seed list (EPIC-01-02).
- INIT-01 Q2 (Google sign-in): not in the MVP; Firebase anonymous accounts.
- INIT-01 Q4 (drink context): replaced by an editable per-household drink type
  list plus a "sweetened" mark.
- INIT-02 Q2 (time-of-day drink): in the MVP, the persona's last drink at this
  time of day. Remaining: the window and the first-use case (EPIC-02-02).
- INIT-02 Q3 (what a one-tap shot records): the recipe's values, marked
  one-tap; no rating, optional reaction.
- INIT-02 Q4 (active persona): the persona selected on Brew.
- INIT-02 Q5 (no pinned recipe): the button becomes "Dial in".
- INIT-04 Q1 (maintenance in MVP): yes, recording only; offsets stay Next.
- Gap: default persona name: none stored; translated role label.
- Gaps: which portion and which setup a one-tap shot uses: earliest-opened
  open portion of the coffee (asking if none), and the recipe's setup.
- Anonymous-account data loss (EPIC-01-01): accepted for the MVP; Google
  linking is the first Next epic (EPIC-05-03).
- Shot history screen (EPIC-01-03, EPIC-02-02): the Journal, in the MVP
  (EPIC-02-06).
- Visibility of unverified catalog additions and who verifies in the MVP
  (EPIC-01-06): private to the adding household; manual admin task until
  EPIC-06-07.
- Person-confirmed merges before the AI matcher (EPIC-06-07): manual admin
  task until then.
- X-3, in part: one-tap shots are never network-eligible. Whether eligibility
  is computed from day one for measured shots stays open.

Closed by the design review round 1 amendments (revision 4):

- Who declares a user-added model's capabilities (EPIC-01-06): the household,
  through simple questions with "not sure" (PEC-05).
- Where grind periods are visible in the MVP (EPIC-04-01): Journal dividers
  and the part's screen (PEC-06).
- Changing drink and coffee before a one-tap pull (EPIC-02-02, part of SQ-06):
  allowed on Brew (PEC-03).
- (Setup editing after shots are logged was closed by PEC-02; that answer is
  reversed in revision 6, see below.)

Closed by the plan review decisions (revision 6):

- Setup editing (EPIC-01-02): setups are never edited (S-02). Replaces
  PEC-02's editing part and PEC-07.
- Retired units in setups and shot paths (EPIC-01-02, EPIC-02-01; review M3):
  no retire action in the MVP; shots take their parts from the setup.
- Default setup name (EPIC-01-02, DQ-01): optional; shown by its parts or a
  translated default (S-08).
- INIT-03 Q2, bean age without a roast date (EPIC-03-03; review blocker B1):
  packing date if printed, else time left to best-before, with no invented
  age (S-02).
- S-09 "days since opened" versus age from roast (EPIC-03-03, EPIC-06-02): two
  clocks; the Coach uses the since-opening clock (S-02).
- Whether a roast date or best-before is required (EPIC-03-01): neither.
- "Open" for an opened-then-frozen portion (EPIC-02-02, EPIC-03-02; review
  M5): not open until thawed (S-02).
- iOS storage eviction (EPIC-01-01, EPIC-05-03; review M6): explicitly
  accepted for the prototype (S-02).
- X-1, timestamp precision (review m1): integer milliseconds (S-02, TQ-04).
- Recalibration as an event kind or a flag (EPIC-04-01; review m1): a flag
  (S-02, TQ-05).
- INIT-01 Q5, Fahrenheit (EPIC-01-04): display only; stored in °C (S-08).

Closed in revision 7 (PEC-09, design working assumptions and Head of Product
decisions):

- Which setup is current, and how the user switches (EPIC-01-02, EPIC-02-02):
  DQ-18, PEC-09.
- Closest-setup ties (EPIC-02-01): the most recently used setup wins (DQ-19).
- Grind pre-fill from a setup with a different grinder (EPIC-02-01): DQ-20.
- One part per kind (EPIC-01-02): DQ-21. Whether a basket is required is
  reopened in revision 8.
- Which freshness clock Brew shows (EPIC-03-03): both, on one line.
- Whether any part change should make a new setup (EPIC-01-02): yes.

Closed in revision 8 (S-02, S-08):

- Which parts define a setup (EPIC-01-02): machine, grinder and basket.
- How WDT and puck screen are recorded: checkboxes on shots and recipes,
  copied on a one-tap pull.
- Small parts resetting recipes (EPIC-01-02): largely resolved.

Closed in revision 9 (S-02, S-05 C, S-08 and the Head of Product):

- DQ-08, the defect list (EPIC-01-05): replaced by six observation tags.
- INIT-01 Q3, which taste fields are required (EPIC-01-05): none; all are
  optional.
- SQ-17, where an off one-tap shot's taste answers go (EPIC-02-03): on the
  one-tap shot itself; the fix is a new measured shot.
- Review M1, in part (EPIC-02-06): an off one-tap shot carries "just right"
  answers and tags; whether it can also carry an overall rating stays open.
- Whether dial-in suggestions are AI and when they ship (EPIC-02-03): rules,
  in the MVP.
- What `has_milk` is for (EPIC-01-03, EPIC-02-05): milk fields and the milk
  wording of the strength question.
- What bounds dose (EPIC-01-02, EPIC-01-06, EPIC-02-03): the basket's dose
  range.
- Whose community shots count (EPIC-06-06): only from similar palates, never
  just the same coffee.
- Whether past shots can be filtered (EPIC-02-06): yes, by drink type, coffee
  and (with several setups) setup, pre-filtered to Brew's drink and coffee.

Closed in revision 10 (S-02 "App sections are named for what people ask",
design PEC-15 and the Head of Product):

- What the list of past brews is called (EPIC-01-01, EPIC-02-06): the Journal.
  Espresso entries are still shots.
- The section names (EPIC-01-01): Brew, Journal, Beans, Setup.
- Whether past coffees can be found after the bag is gone (EPIC-03-06): Tried
  and the coffee screen, in the MVP, without filters.
- Where Beans filters go (EPIC-03-05): Next, joined with run-out.
- Whether the MVP must let people choose their setup and beans (MVP size):
  yes, confirmed by the Head of Product.

DQ-18 to DQ-21 are working assumptions: the plan builds on them, and the Head
of Product can reverse any of them without changing the epic structure.

## MVP size (review m9)

The Head of Product has confirmed that the MVP must be a fully usable logging
tool, including choosing a setup and beans. Cuts therefore can't remove the
ability to set up equipment (EPIC-01-02), add beans (EPIC-03-01), log a shot
(EPIC-01-03) or find past shots (EPIC-02-06).

The MVP is 16 epics. The reviewer counted 177 story points and about 851
hours of MVP tasks before revision 9, large for a "basic app" (S-01). Nothing
has been cut. Revision 9 added rule-based suggestions (EPIC-02-03, S to M),
Journal filters and "Dial in from this" (EPIC-02-06, S to M) and milk fields
across logging, recipes and one-tap, partly offset by the simpler setup of
revision 8. Revision 10 adds Tried and the coffee screen (EPIC-03-06, M). The
Head of Product will confirm the size or pick cuts at final sign-off. Levers
that keep the MVP usable: splitting EPIC-01-06 so coffee additions ship first;
the milk-amount and temperature suggestion levers; the setup filter and "Dial
in from this"; the coffee screen's bag list and Tried's "how its shots went"
summary; and the cut candidates already listed in the stories.

## Suggested build order

Dependencies first; within a priority, earlier delivers daily value sooner.
Revision 10 adds EPIC-03-06 at the end of the MVP; Next and Later move down by
one.

**MVP**
1. EPIC-01-01 Start brewing without setting anything up (none)
2. EPIC-01-02 Describe your setup once (after 01-01)
3. EPIC-03-01 Add a bag of beans (after 01-01)
4. EPIC-01-06 Add what's missing from the catalog (after 01-02, 03-01; can run
   in parallel with 5)
5. EPIC-01-03 Log a shot in seconds (after 01-01, 01-02, 03-01)
6. EPIC-01-04 Record temperature and pressure (after 01-03)
7. EPIC-02-06 Look back in your journal (after 01-02, 01-03, 01-04; the
   default pre-filter is wired in with 02-02)
8. EPIC-04-01 Record maintenance on your equipment (after 01-02, 02-06; early
   so grind periods are right from the first shots)
9. EPIC-02-01 Pin the recipe that worked (after 01-02, 01-03, 01-04, 03-01)
10. EPIC-01-05 Say how it tasted (after 01-03)
11. EPIC-02-02 Pull your daily shot in one tap (after 01-02, 02-01, 02-06)
12. EPIC-02-03 Fix a bad shot from your recipe (after 02-02, 02-01, 01-05,
    01-04, 01-02; freshness explanations once 03-03 ships)
13. EPIC-03-02 Split and freeze a bag (after 03-01)
14. EPIC-03-03 Know how fresh your beans really are (after 03-01, 03-02,
    01-03)
15. EPIC-03-04 See how much coffee is left (after 03-02, 02-02)
16. EPIC-03-06 See every coffee you've tried (after 03-01, 01-03, 01-05,
    02-01, 02-02, 02-06; new in revision 10)

**Next**
17. EPIC-05-03 Keep your coffee history when you change phones (after 01-01;
    first Next epic per S-02)
18. EPIC-02-05 Make the drink and milk lists yours (after 01-01, 02-02)
19. EPIC-02-04 Give one bag its own recipe (after 02-02; needs INIT-02 Q1)
20. EPIC-03-05 Know when you'll run out, and find any coffee (after 03-02,
    03-04, 03-06)
21. EPIC-05-01 Brew for someone else in the household (after 02-02)
22. EPIC-04-02 Suggested grind that follows bean age and recent shots (after
    03-03, 02-03, 04-01)
23. EPIC-04-03 Re-dial once after maintenance (after 04-02)
24. EPIC-04-04 Stretch factor after new burrs (after 04-03)

**Later**
25. EPIC-05-02 Invite them to take over their own profile (after 05-01, 05-03)
26. EPIC-06-01 Scan a bag instead of typing it (after 03-01, 01-06)
27. EPIC-06-04 Tare learns your palate as you log (after 01-05, 02-03)
28. EPIC-06-02 Get a grounded fix when a shot goes wrong (after 02-03, 01-05,
    01-03, 03-03; placed after 06-04 so the palate-alignment eval has a
    learned target)
29. EPIC-06-07 Merge duplicate catalog entries, with AI suggestions (after
    01-06)
30. EPIC-06-05 Share your shots, with your consent (after 01-03, 01-05; 05-02
    for claimed sub personas)
31. EPIC-06-06 Start a new bag from the community (after 06-05, 06-04, 06-01,
    06-02, 06-07)
