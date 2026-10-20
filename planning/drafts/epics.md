# Tare epics (final, revision 7)

Source: `planning/drafts/initiatives.md` (approved by the Head of Product) and
`docs/spec.md`, sections S-01 to S-09. S-01 and S-02 override older sections
where they differ. Revision 2 applied the Head of Product's answers; revision 3
applied the three changes made at approval, also recorded in S-02; revision 4
applied the epic changes from design review round 1 (PEC-01 to PEC-06 in
`planning/drafts/design.md`); revision 5 applied PEC-07 and PEC-08 from design
review round 2; revision 6 applied the Head of Product's decisions on the plan
review (`planning/drafts/review.md`), recorded in S-02, S-04 and S-08;
revision 7 applies PEC-09 from design round 3 and records the design's working
assumptions DQ-18 to DQ-21.

**Status: final, approved by the Head of Product** (revision 7, with the
review fixes and design round 3 changes below as approved amendments). The
size of the MVP is to be confirmed, or cuts picked, by the Head of Product at
final sign-off (review m9); nothing has been cut. No GitHub issues have been
created.

Initiative open questions are referenced as `INIT-NN Q#`, numbered in the order
they appear in `initiatives.md`. Cross-cutting questions are `X-1` (timestamp
precision, now resolved), `X-2` (success targets) and `X-3` (network
eligibility in Phase 1). Answered questions are listed under "Resolved
questions". A "working assumption" is a design assumption (`DQ-NN` in
`design.md`) that the plan builds on until the Head of Product reverses it.

**Terminology.** Users see "kit"; the code and schema call it `toolkit`
(S-08). A kit's components are its "parts".

## Changes in this revision

Revision 7 (design round 3, approved amendment PEC-09 and working
assumptions):

- **PEC-09, EPIC-02-02 with EPIC-01-02, sizes unchanged (M, M):** the kit line
  on Home and the kit field in the shot log become selects, with a "change a
  part" option; the kit chosen becomes the current kit.
- **Current kit (DQ-18), EPIC-01-02:** the kit of the persona's last shot
  (measured or one-tap); before any shot, the newest kit. Choosing a kit makes
  it current at once. Closes the "which kit is current" questions in EPIC-01-02
  and EPIC-02-02.
- **Closest-kit ties (DQ-19) and grind pre-fill (DQ-20), EPIC-02-01:** ties go
  to the most recently used kit. Grind pre-fills only when the closest kit has
  the same grinder; dose, yield and time always do; temperature and pressure
  only with the same machine. Closes EPIC-02-01's two closest-kit questions.
- **One part per kind (DQ-21), EPIC-01-02:** a kit has one part of each kind,
  with machine and grinder required; its name is a label and can be set or
  changed at any time without changing the kit. Closes "must a kit contain
  exactly one machine and one grinder".
- **Both freshness clocks on Home, one line, EPIC-03-03 (size stays S):** Home
  now shows since roasting and since opening together on one line (Head of
  Product decision; design round 3 had only the opened clock on Home).
- **"Any part change makes a new kit" confirmed** by the Head of Product,
  including for small parts such as a tamper or puck screen. Recorded in
  EPIC-01-02.
- No sizes, priorities or build-order positions changed.

Revision 6 (plan review fixes, decided by the Head of Product):

- **A kit is a fixed combination of parts** (S-02, S-04, S-08). Replaces
  toolkit editing (the editing part of PEC-02) and PEC-07 (re-dial after a
  swap).
  - EPIC-01-02 (size stays M): a kit is defined by the parts that directly
    affect the output (machine, grinder, portafilter, basket, puck screen,
    tamper, distribution tool); no scale, water may come later. Replacing,
    adding or removing any part means a different kit, and the same
    combination reuses its existing kit and recipes. Kits are not edited.
    No "retire" action in the MVP. The "make these your kit" shortcut stays.
    User-facing text says "kit".
  - EPIC-02-01 (size stays M): recipes belong to exactly one kit. On a kit
    with no recipe, Dial in starts pre-filled from the recipe on the closest
    previous kit (most parts in common), never a one-tap pull.
  - EPIC-02-02 (size stays M): uses the kit's recipe; no recipe on this kit
    means Dial in, not one tap.
  - EPIC-01-03, 01-04, 04-01, 04-03 and 06-02: shots and recipes record their
    kit only; grinder and machine follow from the kit. Servicing a part is a
    maintenance event, not a new kit (EPIC-04-01).
- **Bean age is two clocks, both paused by freezing** (S-02). EPIC-03-03
  (size stays S): since roasting (roast date, else packing date, else time
  left to best-before, with no invented age) and since opening (per portion).
  EPIC-03-01 gains the optional packing date. Resolves INIT-03 Q2 (review
  blocker B1). (Where the clocks show on Home is updated in revision 7.)
- **"Open" excludes frozen portions** (S-02, review M5). EPIC-02-02 and
  EPIC-03-02: a portion that was opened and then frozen isn't open until
  thawed; one-tap never uses frozen coffee on its own.
- **iOS storage eviction accepted** (S-02, review M6). The MVP explicitly
  accepts both the lost-device and the Safari storage-eviction risks for a
  prototype. EPIC-05-03 stays the first Next epic. Recorded in EPIC-01-01 and
  EPIC-05-03.
- **Resolved questions cleaned up** (review m1): X-1 (timestamps are integer
  milliseconds, TQ-04), INIT-03 Q2 (two clocks), the EPIC-04-01 recalibration
  question (a flag, TQ-05), INIT-01 Q5 (°C stored, S-08), and the S-09 "days
  open" mismatch (the since-opening clock). Removed from the epics' open
  questions and listed under "Resolved questions".
- **MVP size** (review m9): nothing cut. The Head of Product confirms the size
  or picks cuts at final sign-off.
- No sizes, priorities or build-order positions changed.

Revision 5 (design review round 2, approved amendments PEC-07 and PEC-08):

- **PEC-07, EPIC-02-01 with EPIC-01-02, sizes unchanged (M, M):** a recipe
  whose grinder or machine is no longer in its toolkit can't be pulled with one
  tap. It's kept, and offered for a pre-filled dial-in until a new recipe is
  pinned. EPIC-01-02 warns before swapping a toolkit's machine or grinder when
  recipes were pinned on it. **Superseded in revision 6** by the fixed-kit
  rule.
- **PEC-08, EPIC-01-06, size unchanged (L):** a household can edit the
  capabilities of models it added itself while they're still unverified. Old
  shots keep their stored values.

Revision 4 (design review round 1, approved amendments PEC-01 to PEC-06):

- **PEC-01, EPIC-01-01, resized S to M:** adds the app shell: navigation and
  tab bar, page headers, the shared loading, empty and error patterns, and the
  profile screen's frame.
- **PEC-02, EPIC-01-02, size stays M:** adds a "make these your toolkit"
  shortcut once a machine and a grinder exist, with a translated default name.
  Toolkits can be edited after shots are logged (past shots keep their own
  grinder and machine), which closes the toolkit-editing question. **The
  editing part is reversed in revision 6**; the shortcut stays.
- **PEC-03, EPIC-02-02, size stays M:** the home screen lets the user change
  the drink and the coffee before a one-tap pull. This answers the "can the
  user change it" part of SQ-06; the default coffee (DQ-03) stays open.
- **PEC-04, EPIC-01-05, size stays S:** owns the shot warnings. The channelling
  warning shows in the signal colour when channelling is tagged. "Ran fast"
  stays out until there's a threshold, which stays an open question.
- **PEC-05, EPIC-01-06, resized M to L:** includes entering a user-added
  model's capabilities as simple questions, each with a "not sure" option.
- **PEC-06, EPIC-04-01, size stays S:** owns where grind periods show:
  maintenance dividers in the recent shots list and the current period's start
  on the unit screen. New dependency on EPIC-02-06; the build order doesn't
  change, since EPIC-04-01 already followed EPIC-02-06.

Revision 3 (approval changes):

- **Added** EPIC-05-03 "Keep your coffee history when you change phones"
  (Next, S): link the anonymous Firebase account to Google. First Next epic,
  ahead of invites. Google linking is taken out of EPIC-05-02, which now
  depends on it. The MVP accepts the anonymous-account data-loss risk.
- **Added** EPIC-02-06 "See your recent shots" (MVP, S): a simple list of recent
  shots to find and edit any shot, one-tap shots included. Editing a one-tap
  shot in EPIC-02-02 now depends on it.
- **Changed** EPIC-01-06: unverified catalog entries are private to the
  household that added them; verification and merges are a manual admin task
  until EPIC-06-07. The related open questions are closed.

Revision 2:

- **Added** EPIC-01-06 "Add what's missing from the catalog" (MVP, M): household
  additions with product URLs, regional URLs and aliases, unverified status,
  exact normalised-URL duplicate flag.
- **Added** EPIC-02-05 "Make the drink list yours" (Next, S): rename, hide or
  add drink types.
- **Added** EPIC-06-07 "Merge duplicate catalog entries, with AI suggestions"
  (Later, L): merges with an audit log, LLM-suggested matches confirmed by a
  person, with evals.
- **Removed** EPIC-06-03 (RAG grounding): folded into EPIC-06-02 so INIT-06
  stays within six epics after adding EPIC-06-07. The ID is retired, not
  reused.
- **Moved** EPIC-04-01 "Record maintenance on your kit" from Next to MVP
  (S-02). Parent stays INIT-04, see the epic for why.
- **Resized** EPIC-01-01 stays S, now scoped to Firebase anonymous accounts with
  no sign-in screen (was "S, or M with Google sign-in"). EPIC-06-02 stays L
  but now includes RAG.
- **Rescoped** EPIC-01-02 and EPIC-03-01 pick from the seeded catalog (search
  matches aliases). EPIC-01-03 uses household drink types plus a "sweetened"
  mark instead of drink context. EPIC-02-02 follows the one-tap rules in S-02.
  EPIC-02-03 now owns the good/off reaction. EPIC-03-04, EPIC-04-02, EPIC-06-04
  and EPIC-06-05 now say how one-tap shots are treated. Google sign-in linking
  is placed in EPIC-05-02.

## Summary

| ID | Title | Parent | Priority | Size |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | INIT-01 | MVP | M |
| EPIC-01-02 | Describe your kit once | INIT-01 | MVP | M |
| EPIC-01-03 | Log a shot in seconds | INIT-01 | MVP | M |
| EPIC-01-04 | Record temperature and pressure when your machine has them | INIT-01 | MVP | S |
| EPIC-01-05 | Say how it tasted | INIT-01 | MVP | S |
| EPIC-01-06 | Add what's missing from the catalog | INIT-01 | MVP | L |
| EPIC-02-01 | Pin the recipe that worked | INIT-02 | MVP | M |
| EPIC-02-02 | Pull your daily shot in one tap | INIT-02 | MVP | M |
| EPIC-02-03 | Fix a bad shot from your recipe | INIT-02 | MVP | S |
| EPIC-02-04 | Give one bag its own recipe | INIT-02 | Next | S |
| EPIC-02-05 | Make the drink list yours | INIT-02 | Next | S |
| EPIC-02-06 | See your recent shots | INIT-02 | MVP | S |
| EPIC-03-01 | Add a bag to your pantry | INIT-03 | MVP | M |
| EPIC-03-02 | Split and freeze a bag | INIT-03 | MVP | M |
| EPIC-03-03 | Know how fresh your beans really are | INIT-03 | MVP | S |
| EPIC-03-04 | See how much coffee is left | INIT-03 | MVP | S |
| EPIC-03-05 | Know when you'll run out | INIT-03 | Next | M |
| EPIC-04-01 | Record maintenance on your kit | INIT-04 | MVP | S |
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

Counts: 15 MVP, 8 Next, 7 Later (30 epics).

## Cross-cutting constraints (not epics)

These apply to every epic's acceptance criteria rather than being separate
scope, so they don't count as overlap:

- Localization (S-07): no hardcoded strings, locale-aware number formatting,
  canonical floats in the database, RTL-ready logical CSS. Starter drink types
  and the default persona's label are translated.
- Japandi design (S-01, S-06): Inter, thin weights at large sizes, monochrome
  warm grey, one muted colour only for shot warnings. Built on the Phase 0
  design system.
- Calculated, never stored (S-02): remaining weight, bag status, bean age (both
  clocks), usage rate, drift adjustments.
- Timestamps are integer milliseconds (S-02, TQ-04); local days use the
  device's time zone (TQ-07).
- Phase 1 has no AI features (S-01): no LLM calls in any MVP or Next epic.
- Catalog merges (S-02, S-08): any code that reads a catalog reference follows
  the merge pointer to the surviving entry. Merges only happen from EPIC-06-07,
  but readers built earlier must respect the pointer.
- Kits never change (S-02, confirmed by the Head of Product in revision 7): no
  epic edits a kit's parts; any different combination, even of a small part,
  is a different kit.

---

## INIT-01: Log a shot against your real kit in seconds

### EPIC-01-01: Start brewing without setting anything up

- **Parent:** INIT-01
- **Description:** A new user opens the app and starts straight away, with no
  sign-in screen. Behind the scenes the device gets an anonymous account, and
  Tare creates the user, one household, one main persona labelled "Me" and the
  household's starter drink list. The app opens on a calm shell: tabs to move
  around, consistent page headers, and the same loading, empty and error
  patterns on every screen.
- **Source sections:** S-02, S-04, S-08 (S-07 translated labels, S-01 and S-06
  design)
- **Scope**
  - In: Firebase anonymous sign-in per device; the user record stores the
    Firebase ID.
  - In: silent creation of household, owner membership and one default main
    persona with no stored name, shown with a translated role label.
  - In: the household's starter drink types (Espresso, Ristretto, Lungo,
    Americano, Cortado, Flat white, Cappuccino, Latte, Macchiato) as its own
    translated rows.
  - In: every later record is scoped to that household.
  - In (PEC-01): the app shell: navigation and tab bar, page headers, the
    shared loading, empty and error patterns, and the profile screen's frame
    (persona rename, about this device). Later epics fill their own tabs and
    screens into it.
  - Out: the content of each tab and screen (the epic that owns it).
  - Out: Google sign-in and linking (EPIC-05-03).
  - Out: renaming the persona beyond a simple rename (in scope: rename only).
  - Out: editing the drink list (EPIC-02-05).
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
  - Is a persona rename part of the MVP? S-02 says "until renamed" but doesn't
    place the rename in a phase. This draft includes a minimal rename.

### EPIC-01-02: Describe your kit once

- **Parent:** INIT-01
- **Description:** The user finds the parts they brew with in the catalog, by
  maker and model: machine, grinder, portafilter, basket, puck screen, tamper
  and distribution tool. They put them together as a kit, so they never pick
  equipment shot by shot. A kit is a fixed combination: using different parts
  means a different kit, and going back to the same parts brings back that
  kit and its recipes.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: pick parts from the seeded catalog: maker, then model, of a kind that
    directly affects the output (machine, grinder, portafilter, basket, puck
    screen, tamper, distribution tool), with declared capabilities (machine
    temperature and pressure control, grinder scale and coarser direction).
    Search matches names and aliases.
  - In: add owned parts (optional nickname, acquired date).
  - In: put owned parts together as a kit. A kit is defined by its parts;
    replacing, adding or removing any part means a different kit, and choosing
    a combination the household already has reuses that kit, with its
    recipes. One part can be in several kits.
  - In (working assumption DQ-21): one part of each kind per kit; machine and
    grinder are required, the other kinds are optional.
  - In: a kit's name is optional; without one it's shown by its parts or a
    translated default (S-08). The name is a label, not a part, so it can be
    set or changed at any time without making a new kit (DQ-21).
  - In (DQ-18): the current kit is the kit of the persona's last shot
    (measured or one-tap); before any shot, the newest kit. Choosing a kit
    makes it current at once, without waiting for a shot.
  - In (PEC-09): "change a part" builds the new combination from the current
    kit with one part swapped, added or removed, and finds or creates the
    matching kit, which becomes current. The selects that offer it on Home and
    in the shot log are EPIC-02-02.
  - In (PEC-02, kept): once the household has a machine and a grinder, offer
    "make these your kit", with both preselected.
  - Out: editing a kit's parts. Kits never change (S-02); this reverses the
    editing part of PEC-02 and replaces PEC-07's swap warning.
  - Out: a "retire" action (not in the MVP, S-02). A part the household stops
    using simply stops appearing in its current kit.
  - Out: parts that don't change the output, such as a scale; water may be
    added later (S-02).
  - Out: servicing a part, which is a maintenance event (EPIC-04-01), not a
    new kit.
  - Out: adding missing makers or models (EPIC-01-06).
- **Dependencies:** EPIC-01-01 (parts and kits belong to a household).
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - Who curates the seed list, and which makers, models and markets does it
    cover at launch? S-02 says "curated" but not by whom.
  - Accepted friction (confirmed by the Head of Product, revision 7): swapping
    even a small part, such as a tamper or puck screen, makes a new kit, so
    the next shot is a dial-in rather than one tap. Grind carries over when
    the grinder is the same (DQ-20). Worth watching in use; if it bites, the
    fix is in which parts define a kit, not the design.
  - Kits can multiply as households try parts. How the kit list stays calm
    (recent first, collapsing unused kits) is a design detail.
  - Closed (S-02): kits are not edited; a different combination is a
    different kit.
  - Closed (S-08, DQ-21): the default kit name is optional and shown from its
    parts or a translated default; it can be changed at any time.
  - Closed (DQ-21, working assumption): one part per kind, machine and grinder
    required.
  - Closed (DQ-18, PEC-09, working assumption): which kit is current, and how
    the user switches.

### EPIC-01-03: Log a shot in seconds

- **Parent:** INIT-01
- **Description:** The user records a shot with grind, dose, yield and time on
  large number wheels, against a kit, a drink type and the coffee they're
  using, and can mark it sweetened. The shot is saved as measured, with whose
  taste it records and who logged it.
- **Source sections:** S-02, S-06, S-08 (S-01 roadmap, S-07 number formatting)
- **Scope**
  - In: the extraction UI for the MVPayload (grind, dose, yield, time) with
    tactile number wheels, no text keyboards.
  - In: kit (pre-chosen as the current kit), drink type (the household's
    visible list) and portion; optional "sweetened" mark. The shot stores kit,
    portion, persona, logging user and entry mode "measured"; grinder and
    machine follow from the kit.
  - In: grind wheel follows the kit grinder's declared scale; time stored in
    ms and shown in seconds with one decimal.
  - In: locale-aware display and entry of decimals, canonical floats stored.
  - Out: the kit field's select with "change a part" (EPIC-02-02, PEC-09).
  - Out: temperature and pressure (EPIC-01-04).
  - Out: sensory scores, rating and defects (EPIC-01-05).
  - Out: pre-fill from a recipe, one-tap shots and reactions (INIT-02).
  - Out: computing `is_network_eligible` (see X-3).
- **Dependencies:** EPIC-01-02 (needs a kit), EPIC-03-01 (every shot needs a
  portion; `portion_id` is required), EPIC-01-01 (drink types).
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - Overlap flag: "shots logged against a portion" is listed in both INIT-01
    and INIT-03. Assigned here, since the portion is picked while logging.
  - Finding and editing saved shots is EPIC-02-06 (recent shots list).
  - Does logging a shot against an unopened portion mark it opened? Not in the
    spec (see EPIC-03-02).
  - INIT-03 Q3: what to do when the chosen portion is already finished.
  - What is `has_milk` on a drink type used for? It's in S-08 but no behaviour
    depends on it yet.
  - X-3.

### EPIC-01-04: Record temperature and pressure when your machine has them

- **Parent:** INIT-01
- **Description:** If the kit's machine can set temperature or pressure, the
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
- **Description:** After a measured shot the user can rate it overall and score
  sweetness, acidity, bitterness and body from 1 to 5, and tag defects. This is
  the taste history later palate learning and coaching build on.
- **Source sections:** S-08 (S-06 tactile inputs, S-01 shot-warning colour)
- **Scope**
  - In: overall rating 1-5, four sensory scores 1-5, defect tags, all on the
    shot.
  - In (PEC-04): shot warnings. When channelling is tagged, a channelling
    warning shows in the signal colour, the only use of that colour. Other
    epics that show a shot (such as the recent shots list, EPIC-02-06) reuse
    this warning.
  - Out: the "ran fast" warning, until a threshold is defined.
  - Out: the good/off reaction on one-tap shots (EPIC-02-03).
  - Out: any interpretation of the scores (EPIC-06-02, EPIC-06-04).
- **Dependencies:** EPIC-01-03.
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - INIT-01 Q3: which sensory fields are required on a dial-in shot.
  - The defect list is not defined. S-09 names "Channelling"; the full set,
    and whether it is fixed or user-defined, is missing (DQ-08).
  - The "ran fast" threshold is not defined, so that warning stays out (DQ-09).
    Until then the only MVP warning repeats a defect the user just tagged.

### EPIC-01-06: Add what's missing from the catalog

- **Parent:** INIT-01
- **Description:** If the user's grinder, machine, roaster or coffee isn't in
  the catalog, they add it with a link to its product page, and can use it
  straight away. If the link matches an entry that already exists, Tare points
  them to it instead of creating a duplicate.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: a household adds a maker, model (any kit part kind), roaster or bean,
    with a required product URL; additions are marked user-sourced and
    unverified and are usable at once.
  - In: unverified entries are visible only to the household that added them
    (S-02); once verified they join the shared catalog.
  - In: an entry can hold several URLs (one per market) and several aliases.
  - In: URLs are normalised (regional path segments and tracking parameters
    stripped); an exact match on the normalised URL flags a likely duplicate
    and offers the existing entry.
  - In: applies to both catalogs (hardware and coffee), from the kit and
    pantry flows.
  - In (PEC-05): for a user-added machine or grinder, enter its capabilities
    by answering simple questions in the user's words (temperature and
    pressure control, dial numbers, step, which way is coarser), each with a
    "not sure" option, stored as unknown values (S-08, TQ-06).
  - In (PEC-08): while a model the household added is still unverified, the
    household can edit its capabilities, for example to answer a "not sure"
    later. Changes apply to the shot log from then on; old shots keep their
    stored values, so nothing is reinterpreted.
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
    fallback ranges. Can the admin correct capabilities on verification?
  - At L, this is the biggest lever on the MVP's size (review m9): coffee
    additions are simpler than hardware additions with capabilities, and could
    ship first.
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
  recipe for this bean, persona, kit and drink type. Every bag of that bean
  then starts from it on that kit, and pinning again replaces it while keeping
  the old ones. On a new kit, the closest previous kit's recipe gives the
  dial-in a head start.
- **Source sections:** S-02, S-04, S-08 (S-01 roadmap)
- **Scope**
  - In: pin from a logged shot (recipe points back to it) or enter values
    directly; the recipe records its kit and the same optional temperature and
    pressure pairs as shots.
  - In: re-pinning adds a row; the latest pin wins.
  - In: see the current recipe for a bean, persona, kit and drink type; it
    applies to every batch of that bean.
  - In: recipes belong to exactly one kit (S-02). When the current kit has no
    recipe for this bean, persona and drink, Dial in starts pre-filled from the
    recipe on the closest previous kit (most parts in common), never as a
    one-tap pull. Pinning on the new kit gives it its own recipe. Replaces
    PEC-07.
  - In (working assumption DQ-19): ties between equally close kits go to the
    most recently used kit (latest shot on it).
  - In (working assumption DQ-20): dose, yield and time pre-fill from the
    closest kit's recipe. Grind pre-fills only when that kit has the same
    grinder; otherwise it starts at this grinder's last measured value (else
    the middle of its range), and the log says grind wasn't carried over,
    because grind doesn't transfer between grinders (S-01). Temperature and
    pressure carry over only with the same machine.
  - Out: batch overrides (EPIC-02-04).
  - Out: drift or offset adjustments when reading (INIT-04).
- **Dependencies:** EPIC-01-03 (pin from a shot), EPIC-01-04 (recipes carry the
  same temperature and pressure fields), EPIC-03-01 (bean comes from the
  pantry), EPIC-01-02 (kits).
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - INIT-02 Q1 (S-02 still open): does pinning update the bag's override or the
    bean's default? This epic assumes the bean's default only, which is safe
    until EPIC-02-04 exists; confirm.
  - Is pinning a recipe without a source shot allowed? `source_extraction_id`
    is nullable, so the schema allows it, but no flow is described.
  - Can a one-tap shot be pinned? It only copies a recipe, so pinning it would
    add nothing; confirm it's excluded.
  - Closed (DQ-19, DQ-20, working assumptions): closest-kit ties, and whether
    grind pre-fills from a kit with a different grinder.

### EPIC-02-02: Pull your daily shot in one tap

- **Parent:** INIT-02
- **Description:** The home screen shows the pinned recipe for the selected
  persona, the current kit and the drink they usually make at this time of
  day. One tap on "Pull This Shot" records a one-tap shot copied from the
  recipe, so daily use is counted. With no recipe on this kit, the button
  reads "Dial in". The user can switch kit, or change a part, right there.
- **Source sections:** S-06, S-02, S-08
- **Scope**
  - In: home screen uses the persona selected there (in the MVP, the one main
    persona), the current kit (DQ-18, EPIC-01-02) and that persona's last
    drink type at this time of day. Home always shows the recipe on the
    current kit, so a one-tap pull always uses that recipe's kit.
  - In (PEC-03): before a pull, the user can change the drink and the coffee
    on the home screen; the recipe shown updates in place, and the pull uses
    the chosen drink and coffee.
  - In (PEC-09): the kit line on Home and the kit field in the shot log are
    selects offering the household's kits and "change a part". The kit chosen
    becomes the current kit, and the recipe shown updates in place.
  - In: "Pull This Shot" copies the pinned recipe's values into a shot marked
    one-tap, with the recipe's kit and the earliest-opened open portion of
    that bean. "Open" means opened, not finished and not in the freezer
    (S-02): an opened-then-frozen portion isn't open until thawed, and one-tap
    never uses frozen coffee on its own. If no portion of the bean is open, it
    asks; frozen coffee is used only when the user picks it.
  - In: no rating is asked. Undo for a few seconds.
  - In: edit a one-tap shot afterwards, found through the recent shots list
    and its edit flow (EPIC-02-06).
  - In: with no recipe on the current kit, the button becomes "Dial in" and
    opens the shot log (pre-filled from the closest previous kit's recipe when
    there is one, per EPIC-02-01).
  - Out: what "change a part" does to find or create a kit (EPIC-01-02).
  - Out: the good/off reaction and the pre-filled log (EPIC-02-03).
  - Out: switching between several personas (EPIC-05-01).
  - Out: palate learning from these shots (EPIC-06-04).
- **Dependencies:** EPIC-02-01 (needs a pinned recipe), EPIC-01-03 (the shot
  log for "Dial in", and the kit field PEC-09 extends), EPIC-01-02 (kits and
  the current-kit rule), EPIC-03-01 (needs a portion), EPIC-02-06 (editing a
  one-tap shot after the fact).
- **Priority:** MVP
- **Rough size:** M (unchanged; PEC-09 is small, the same pattern as PEC-03)
- **Risks and open questions**
  - What counts as "this time of day" (window size), and which drink is shown
    for a persona with no history at this time? Not in the spec (design
    assumption DQ-02).
  - PEC-03 answers the "can the user change it" part of SQ-06. Which coffee
    the home screen shows by default is a design assumption (DQ-03); confirm.
  - Does a drink or coffee changed on the home screen stick for the next pull?
    Design assumes no saved setting; the change applies to the next pull, and
    history then carries it (DQ-17); confirm.
  - Opening a portion when none is open: does answering the prompt mark a
    portion opened? Links to the EPIC-03-02 question on who sets "opened".
  - Closed (DQ-18, PEC-09, working assumption): which kit is current, and how
    the user switches.
  - Undo window length ("a few seconds") to be set at story level (design
    assumes 8 seconds, DQ-04).
  - X-2: success metric targets.

### EPIC-02-03: Fix a bad shot from your recipe

- **Parent:** INIT-02
- **Description:** After a one-tap shot the user can give a quick "good" or
  "off". An off shot, or dialing in a bag, opens the shot log already filled
  with the pinned recipe; the user nudges one or two wheels and saves a
  measured shot, which they can then pin.
- **Source sections:** S-06, S-02, S-08
- **Scope**
  - In: optional quick reaction (good, off) on a one-tap shot; silence is
    allowed.
  - In: "off", or a dial-in from the home screen, opens the extraction UI
    pre-filled from the current pinned recipe (or, on a kit without one, the
    closest previous kit's recipe, EPIC-02-01) for a micro-adjustment; it
    saves as a normal measured shot.
  - Out: suggesting what to change (EPIC-06-02, INIT-04).
  - Out: rating and sensory scores (EPIC-01-05).
- **Dependencies:** EPIC-02-02 (one-tap shots and the home screen), EPIC-02-01
  (recipe to pre-fill), EPIC-01-03 (the log itself).
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - Does an "off" reaction stay on the one-tap shot as well as producing a
    new measured shot, or does the one-tap shot become the measured one? S-02
    says it "turns into" a normal log; confirm whether one record or two
    (design assumes two, DQ-12).
  - For a new bean with no pin on any kit, does "Dial in" start from a blank
    log or from another bean's recipe? Not in the spec.

### EPIC-02-04: Give one bag its own recipe

- **Parent:** INIT-02
- **Description:** If one bag behaves differently from the bean's usual, the
  user pins a recipe for that bag only. The bean's default stays as it was for
  the next bag.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: pin a recipe for one batch; it overrides the bean's default for that
    batch only.
  - In: the home screen and pre-fill use the override while that batch is in
    use.
  - Out: anything else about recipes (EPIC-02-01).
- **Dependencies:** EPIC-02-01, EPIC-02-02.
- **Priority:** Next. Differs from the initiative (MVP): the spec calls the
  override optional, the bean default delivers the initiative's goal on its
  own, and deferring it avoids building on the unresolved override-vs-default
  question (INIT-02 Q1).
- **Rough size:** S
- **Risks and open questions**
  - INIT-02 Q1 (still open) decides how a pin chooses between override and
    default; this epic can't be specified until it's answered.
  - Should the Head of Product want it in MVP, it slots in after EPIC-02-03.

### EPIC-02-05: Make the drink list yours

- **Parent:** INIT-02
- **Description:** The household renames, hides or adds drink types, so the
  list matches what they actually make. Hidden drinks stop showing on the home
  screen and in the shot log.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: rename a starter drink (stores its own name over the translated one),
    hide or unhide, add a custom drink, set the order.
  - Out: the starter list itself (EPIC-01-01); the sweetened mark
    (EPIC-01-03).
- **Dependencies:** EPIC-01-01, EPIC-02-02 (home screen uses the list).
- **Priority:** Next. Differs from the initiative (MVP): the starter list
  covers the common drinks, and S-02 doesn't place editing in a phase. Moves
  to MVP if the Head of Product wants it.
- **Rough size:** S
- **Risks and open questions**
  - Placed under INIT-02 because drink type scopes recipes and the home screen;
    it could equally sit under INIT-01. Flagged as ambiguous.
  - What happens to recipes and the home-screen default when their drink type
    is hidden? Not in the spec.
  - Is `has_milk` set by the user for a custom drink? Its purpose isn't
    described.

### EPIC-02-06: See your recent shots

- **Parent:** INIT-02
- **Description:** The user sees a simple list of their recent shots, newest
  first, and can open any of them to fix it. That includes a one-tap shot that
  didn't actually go to plan.
- **Source sections:** S-02, S-08
- **Scope**
  - In: a list of recent shots (measured and one-tap, marked as such) for the
    household.
  - In: open a shot and edit its values in the shot log UI.
  - Out: filtering, search, charts or analysis (not in the spec).
  - Out: undo right after a one-tap shot (EPIC-02-02).
  - Out: grind period dividers in the list (EPIC-04-01) and the shot warning
    itself (EPIC-01-05); this list only hosts them.
- **Dependencies:** EPIC-01-03 (shots to list, and the log UI to edit in),
  EPIC-01-04 (edits include temperature and pressure).
- **Priority:** MVP (S-02: recent shots are visible in the MVP).
- **Parent decision:** INIT-02, because its MVP purpose is fixing one-tap
  shots after the fact, part of the daily one-tap flow. INIT-01 already has six
  epics, the limit.
- **Rough size:** S
- **Risks and open questions**
  - Overlap flag: editing a one-tap shot is listed in EPIC-02-02; the list and
    the edit flow live here, and EPIC-02-02 links to them.
  - How many shots, or how far back, counts as "recent"? Not in the spec
    (design assumes 30 days, DQ-13).
  - When a one-tap shot is edited, does it become measured? S-02 doesn't say;
    the working assumption is that it stays one-tap. Confirm.
  - Can a one-tap shot carry taste scores and defects when edited, or only a
    reaction? Not in the spec (review M1).
  - Can a shot be deleted from the list? Not in the spec.
  - Does editing a shot that a recipe was pinned from change the recipe? S-08
    implies not (recipes are separate rows); confirm.

---

## INIT-03: Always know what beans you have and how old they are

### EPIC-03-01: Add a bag to your pantry

- **Parent:** INIT-03
- **Description:** The user adds a bag they bought: which coffee it is, found in
  the catalog by roaster and bean, whichever of roast date, packing date and
  best-before the bag shows, its weight, and optionally lot code and purchase
  date. It appears in the pantry as one whole-bag portion, ready to brew from.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: pick roaster, then bean, from the seeded catalog; search matches names
    and aliases.
  - In: create a batch with bean, lot code, roast date, packing date (new,
    optional, for bags that print it instead of a roast date), best-before,
    bag weight, purchase date. No date is required.
  - In: the batch starts with one portion for the whole bag.
  - In: a pantry list of batches and their portions.
  - Out: adding missing roasters or beans (EPIC-01-06).
  - Out: splitting, freezing and lifecycle dates (EPIC-03-02).
  - Out: bean age (EPIC-03-03).
  - Out: bag scanning (EPIC-06-01); buying beans (not in the spec).
- **Dependencies:** EPIC-01-01.
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - Seed list coverage for roasters and beans, and who curates it (as in
    EPIC-01-02).

### EPIC-03-02: Split and freeze a bag

- **Parent:** INIT-03
- **Description:** The user splits a bag into portions, for example half on the
  counter and half in the freezer, and records when each was frozen, thawed,
  opened and finished. The bag stays one batch with one roast date and lot.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: split a portion into several by weight, within one batch.
  - In: mark a portion frozen, thawed, opened or finished, with dates.
  - In: pantry shows each portion's state (unopened, open on the counter,
    frozen, thawed, finished). A portion that was opened and then frozen shows
    as frozen and isn't open until thawed (S-02).
  - Out: bean age (EPIC-03-03); remaining weight and stock checks
    (EPIC-03-04).
- **Dependencies:** EPIC-03-01.
- **Priority:** MVP
- **Rough size:** M
- **Risks and open questions**
  - Is "opened" set by the user or by the first shot logged? Not in the spec
    (design assumes both, DQ-06). The one-tap rule (earliest-opened open
    portion) depends on it.
  - Can a portion be frozen and thawed more than once? The schema holds one
    date of each, so it implies not; confirm.
  - Must split weights add up to the bag weight? Not in the spec.
  - Correcting a date already set (freeze, thaw, open, finish) isn't in scope;
    stories should only promise what's built (review M4).

### EPIC-03-03: Know how fresh your beans really are

- **Parent:** INIT-03
- **Description:** Tare keeps two freshness clocks, both paused while coffee is
  in the freezer: how long since the coffee was roasted, and how long each
  portion has been open to the air. The home screen shows both for the coffee
  in use, on one line; the bag screen shows both. Shots ground straight from
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
  - In: the home screen shows both clocks for the coffee in use on one line
    (Head of Product decision, revision 7); the bag screen shows both, the
    roasting clock in the bag's facts and the opened clock on each portion.
  - In: identify shots ground from frozen and mark them where shots and
    portions are shown.
  - Out: using age to adjust grind (EPIC-04-02).
- **Dependencies:** EPIC-03-02 (opened, frozen and thawed dates), EPIC-01-03
  (shots to mark), EPIC-03-01 (roast, packing and best-before dates).
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - Closed (S-02): INIT-03 Q2, the age rule for best-before-only and undated
    bags (review blocker B1).
  - Closed (S-02): the S-09 "days since batch opened" input is the
    since-opening clock.
  - Closed (Head of Product, revision 7): Home shows both clocks on one line,
    so an old coffee in a freshly opened bag reads as both.
  - Before a portion is opened, or when only best-before is known, the home
    line has one clock or a best-before phrase instead; the exact wording is a
    design detail. The two clocks must never be confusable.

### EPIC-03-04: See how much coffee is left

- **Parent:** INIT-03
- **Description:** Each portion shows how much is left, worked out from its
  weight and the doses of every shot against it, one-tap shots included. The
  user can weigh what's left to correct it, and bags show as open or finished.
- **Source sections:** S-02, S-08
- **Scope**
  - In: remaining weight per portion and batch from weight minus doses of
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

### EPIC-03-05: Know when you'll run out

- **Parent:** INIT-03
- **Description:** The pantry tells the household roughly when it will run out
  of coffee, counting frozen stock, based on its real usage rate.
- **Source sections:** S-02, S-08
- **Scope**
  - In: usage rate from finished portions, doses (one-tap included), stock
    checks and purchase dates; calculated, never stored.
  - In: predicted run-out date across all portions, frozen included.
  - In: how much of real usage logging captures (S-02).
  - Out: reorder prompts or buying (not in the spec).
- **Dependencies:** EPIC-03-04.
- **Priority:** Next. Differs from the initiative (MVP): INIT-03 Q1 asks whether
  prediction is Phase 1, and a prediction needs weeks of finished portions to
  be useful, which the MVP epics collect. Moves back to MVP if the Head of
  Product says so.
- **Rough size:** M
- **Risks and open questions**
  - INIT-03 Q1: is prediction (and any reorder prompt) Phase 1?
  - Accuracy method and target are not given (X-2).

---

## INIT-04: Grind settings stay meaningful through maintenance and time

### EPIC-04-01: Record maintenance on your kit

- **Parent:** INIT-04
- **Description:** The user logs dated work on one part, such as new burrs, a
  clean, a re-zero or a repair, and can mark it as a recalibration. Servicing
  a part keeps the same kit. For a grinder, each event starts a new grind
  period, so history is split correctly from day one.
- **Source sections:** S-01, S-02, S-04, S-08
- **Scope**
  - In: add a maintenance event (kind, date, note) to an owned part, and see a
    part's events. The kit doesn't change (S-02).
  - In: for grinders, each event starts a new grind period (derived from the
    dates); shots and recipes are placed in a period through their kit's
    grinder.
  - In: mark an event as a recalibration, a flag on the event (S-01, TQ-05).
  - In (PEC-06): where grind periods show: maintenance dividers between shots
    in the recent shots list, for the shot's own grinder, and the current
    period's start on the part's screen.
  - Out: offsets (EPIC-04-03, EPIC-04-04).
- **Dependencies:** EPIC-01-02 (parts), EPIC-02-06 (the recent shots list the
  dividers sit in).
- **Priority:** MVP. Differs from the initiative (Next): S-02 says maintenance
  events are recorded from Phase 1, so grind history is split correctly from
  day one.
- **Parent decision:** stays under INIT-04. The approved `initiatives.md` lists
  maintenance events in INIT-04's scope, INIT-01 already has six epics (the
  limit), and keeping the ID avoids churn. Re-parenting to INIT-01 would need
  `initiatives.md` updated and an INIT-01 epic merged.
- **Rough size:** S
- **Risks and open questions**
  - Closed (TQ-05): recalibration is a flag on any event, not an event kind.
  - Closed (PEC-06): grind periods show as dividers in the recent shots list
    and as the period start on the part's screen.
  - Should the recalibration flag default on for burrs and re-zero? Design
    assumes so (DQ-15); confirm.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

- **Parent:** INIT-04
- **Description:** When the user opens their recipe, Tare shows a grind
  adjusted for how the beans have aged and how this batch has been behaving,
  learned from their own measured shots with recent ones counting most. The
  stored recipe is unchanged.
- **Source sections:** S-01, S-02, S-04
- **Scope**
  - In: drift adjustments for bean age and the batch's own character,
    calculated from logged shots at read time, never stored.
  - In: only measured shots count as measurements; one-tap shots count only as
    "the recipe was fine" (S-08 entry mode).
  - In: recent shots weighted more than older ones.
  - In: show the adjustment on the home screen and pre-filled log.
  - Out: kit maintenance offsets (EPIC-04-03).
  - Out: AI explanations (EPIC-06-02).
- **Dependencies:** EPIC-03-03 (bean age), EPIC-02-02 and EPIC-02-03 (where it
  is shown), EPIC-04-01 (only shots in the current grind period are
  comparable).
- **Priority:** Next
- **Rough size:** L
- **Risks and open questions**
  - Overlap flag: S-02 and S-04 list "kit maintenance" as a drift adjustment.
    It is assigned to EPIC-04-03 (offsets); this epic covers bean age and
    batch character only.
  - INIT-04 Q2: recency weighting strength and window.
  - INIT-04 Q3: how bean-aging drift is estimated, and from how many shots.
    Which of the two freshness clocks (S-02) drives it, or both?
  - INIT-04 Q4: shown as a changed grind, a note, or both.
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
  - In: apply the shift when reading recipes pinned before the event on kits
    that include that grinder; stored recipes are never rewritten.
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
  profile on the home screen, and each has its own pinned recipes, usual
  drinks and shot history.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: create, rename and manage sub personas (no login).
  - In: choose the persona on the home screen; recipes, the time-of-day drink
    and logging follow it.
  - In: shots record the sub persona as whose taste and the member as who
    logged.
  - Out: invites and claiming (EPIC-05-02).
  - Out: schema changes (S-02: only the UI changes).
- **Dependencies:** EPIC-02-02 (home screen persona selection), EPIC-01-03.
- **Priority:** Next
- **Rough size:** M
- **Risks and open questions**
  - Can a sub persona be deleted, and what happens to its shots? Not in the
    spec.
  - Does a sub persona have a default label like "Me", or must it be named?
    S-02 covers only the default persona.
  - The current kit follows the persona's last shot (DQ-18), so switching
    persona can switch kit too; confirm that's wanted.

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

Every epic here ships with its own evals and observability (S-01). INIT-06 now
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
  - In: result fills the add-a-bag flow for review.
  - In: evals and observability for the scanner.
  - Out: dates, weight and lot from the label (not in the S-09 schema).
- **Dependencies:** EPIC-03-01, EPIC-01-06 (a scanned coffee may need adding).
- **Priority:** Later
- **Rough size:** M
- **Risks and open questions**
  - INIT-06 Q5: model choices fixed or placeholders.
  - How a scan is matched to an existing roaster and bean: by name and alias
    search, or by the EPIC-06-07 matcher? Not in the spec.
  - The eval set for the scanner isn't described; S-09 only defines one for
    the Coach.

### EPIC-06-02: Get a grounded fix when a shot goes wrong

- **Parent:** INIT-06
- **Description:** After a bad shot the Diagnostic Coach reads the numbers,
  scores, defects, kit and freshness, and tells the user what to change on
  their own hardware, in the right direction on their dial. Its advice draws
  on extraction guides and the manuals for their equipment.
- **Source sections:** S-09, S-08, S-01, S-03
- **Scope**
  - In: Diagnostic Coach: diagnosis, action and suggested variables as JSON,
    using the grinder's coarser direction and the kit's parts, from measured
    shots only. Its "days open" input is the since-opening clock (S-02).
  - In: RAG over extraction guides and equipment manuals (folded in from the
    retired EPIC-06-03).
  - In: shown in the fix-a-bad-shot flow.
  - In: eval harness (`npm run eval`, LLM-as-a-judge on safety, accuracy,
    alignment, pass if all at 4 or above) against a Golden Dataset, plus
    observability.
  - Out: palate inputs (EPIC-06-04).
- **Dependencies:** EPIC-02-03, EPIC-01-05 (scores and defects), EPIC-03-03
  (freshness clocks).
- **Priority:** Later
- **Rough size:** L
- **Risks and open questions**
  - Size: with RAG folded in this is at the top of L. If INIT-06 is split, RAG
    should become its own epic again, shipping after the Coach.
  - INIT-06 Q6: source and owner of the Golden Dataset.
  - INIT-06 Q5: model choices.
  - The eval scores palate alignment, but the Coach has no taste graph until
    EPIC-06-04. Either the metric waits or EPIC-06-04 ships first.
  - Which guides and manuals, their licensing, and who maintains them. Not in
    the spec.

### EPIC-06-04: Tare learns your palate as you log

- **Parent:** INIT-06
- **Description:** Without any survey, Tare builds each persona's taste graph
  from what they log and rate, and uses it to shape advice.
- **Source sections:** S-01, S-06, S-04
- **Scope**
  - In: per-persona taste graph derived implicitly from logged shots, ratings
    and reactions; no preference forms.
  - In: one-tap shots are never treated as measurements; silence counts as a
    weak "fine" and reactions as stronger signals (S-02).
  - In: evals and observability.
  - Out: matching against community recipes (EPIC-06-06).
- **Dependencies:** EPIC-01-05 (ratings and scores), EPIC-02-03 (reactions).
- **Priority:** Later
- **Rough size:** M
- **Risks and open questions**
  - INIT-06 Q2: should a simple non-AI taste profile ship earlier, as a core
    differentiator? If yes, a non-AI slice of this epic moves to Next.
  - What a taste graph contains is not defined.

### EPIC-06-05: Share your shots, with your consent

- **Parent:** INIT-06
- **Description:** A user opts in to share their own shots, anonymized, with the
  community. Only complete, measured shots from personas claimed by a
  consenting user qualify.
- **Source sections:** S-05, S-07
- **Scope**
  - In: explicit personal opt-in on the user.
  - In: tiering: partial logs stay private; network-eligible shots need a
    measured shot with the full MVPayload and a claimed persona whose user
    opted in. One-tap shots are never eligible.
  - In: PII stripped and cohort IDs on shared extractions.
  - Out: using shared data for baselines (EPIC-06-06).
- **Dependencies:** EPIC-01-03; EPIC-05-02 only for claimed sub personas (main
  personas qualify without it).
- **Priority:** Later
- **Rough size:** M
- **Risks and open questions**
  - INIT-06 Q4: what cohort IDs are grouped by.
  - INIT-06 Q7: withdrawing consent and deleting data, and shots already
    shared.
  - X-3: whether eligibility is computed from day one.
  - Can an anonymous (not yet Google-linked) user opt in? S-07 ties consent to
    "their own login"; unclear whether an anonymous account counts.

### EPIC-06-06: Start a new bag from the community, tuned to you

- **Parent:** INIT-06
- **Description:** When a user adds a new bag, Tare suggests starting variables
  from community shots of the same coffee in its first week, weighted by
  contributor trust. If a pro's recipe aims for a different taste, it warns the
  user and suggests a version nudged toward their palate.
- **Source sections:** S-05, S-03
- **Scope**
  - In: Cold Start baseline from community extractions logged within 7 days of
    a batch being opened (freshness anchor).
  - In: trust weights by contributor level (Enthusiast vs Verified Pro).
  - In: Match Score Warning and suggested translation toward the user's
    palate.
  - In: evals and observability.
- **Dependencies:** EPIC-06-05 (shared data), EPIC-06-04 (palate), EPIC-06-01
  (S-05 triggers on scanning a new bag), EPIC-06-02 (the Coach suggests the
  translation), EPIC-06-07 (the same coffee across households must be one
  catalog entry).
- **Priority:** Later
- **Rough size:** L
- **Risks and open questions**
  - INIT-06 Q3: how contributor level is determined; no schema field.
  - Grind doesn't transfer between grinders (S-01), so how a community grind
    becomes a starting point for the user's grinder is open.
  - Could be split (baseline vs palate alignment) if it proves too large.

### EPIC-06-07: Merge duplicate catalog entries, with AI suggestions

- **Parent:** INIT-06
- **Description:** When the same grinder or coffee has been added twice, for
  example under its UK and US names, the entries are merged into one so every
  household's history and the community data line up. An AI suggests likely
  duplicates with a confidence and a reason, and a person always confirms.
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
    capabilities or roast level)? Merging two parts that sit in kits could
    also make two kits identical; not in the spec.
  - INIT-06 Q5: model choice for the matcher.

---

## Section coverage

| Initiative | Source sections | Covered by |
|---|---|---|
| INIT-01 | S-01, S-02, S-04, S-06, S-07, S-08 | S-01: 01-01 (app shell), 01-03, 01-05 (shot warnings), and the design constraint; S-02: 01-01, 01-02 (fixed kits, current kit), 01-03, 01-04, 01-06; S-04: 01-01, 01-02 (kits), 01-06; S-06: 01-01 (app shell), 01-03, 01-05; S-07: 01-01, 01-03 (and localization constraint); S-08: all |
| INIT-02 | S-01, S-02, S-04, S-06, S-08 | S-01: 02-01 (grind doesn't transfer, DQ-20); S-02: 02-01 to 02-06 (recipes per kit in 02-01, kit switching and "open" excludes frozen in 02-02); S-04: 02-01, 02-04, 02-05; S-06: 02-02, 02-03; S-08: 02-01 to 02-06 |
| INIT-03 | S-02, S-04, S-08 | S-02: all (two freshness clocks in 03-03, packing date in 03-01, open-vs-frozen in 03-02); S-04: 03-01, 03-02; S-08: 03-01, 03-02, 03-04, 03-05 |
| INIT-04 | S-01, S-02, S-04, S-08 | S-01: 04-01, 04-02; S-02: all; S-04: 04-01, 04-02; S-08: 04-01, 04-03, 04-04 |
| INIT-05 | S-02, S-04, S-07, S-08 | S-02, S-04, S-08: 05-01, 05-02, 05-03 (accepted storage risks); S-07: 05-02 |
| INIT-06 | S-01, S-03, S-05, S-07, S-09 | S-01: 06-01, 06-02, 06-04; S-03: 06-02, 06-06; S-05: 06-05, 06-06; S-07: 06-05; S-09: 06-01, 06-02 |

S-02 decisions and where they land: accounts (EPIC-01-01, EPIC-05-03),
Google sign-in first after the MVP and the accepted lost-device and storage
eviction risks (EPIC-01-01, EPIC-05-03), recent shots (EPIC-02-06), private
unverified entries and manual admin review (EPIC-01-06, EPIC-06-07), catalog
(EPIC-01-02, EPIC-03-01, EPIC-01-06, EPIC-06-07), drink types (EPIC-01-01,
EPIC-01-03, EPIC-02-05), default persona label (EPIC-01-01), one-tap shots
(EPIC-02-02, EPIC-02-03, EPIC-03-04, EPIC-04-02, EPIC-06-04, EPIC-06-05),
maintenance from Phase 1 (EPIC-04-01), fixed kits (EPIC-01-02, EPIC-02-01,
EPIC-02-02, EPIC-04-01), two freshness clocks (EPIC-03-01, EPIC-03-03,
EPIC-06-02), "open" excludes frozen (EPIC-02-02, EPIC-03-02), technical
decisions TQ-04 to TQ-07 (cross-cutting constraints, EPIC-01-06, EPIC-04-01).
Design round 3: PEC-09 (EPIC-02-02, EPIC-01-02), DQ-18 and DQ-21
(EPIC-01-02), DQ-19 and DQ-20 (EPIC-02-01).

## Overlap and ambiguity flags

- Shots logged against a portion: in INIT-01 and INIT-03; assigned to
  EPIC-01-03.
- Kit maintenance drift: S-02 and S-04 call it a drift adjustment; assigned to
  EPIC-04-03 (offsets), not EPIC-04-02.
- Personal consent: INIT-05 and INIT-06 both cite S-07. The rule that claimed
  personas follow their user's consent is in EPIC-05-02; the opt-in and
  eligibility computation are in EPIC-06-05.
- Recipe resolution ("which recipe applies now", including the closest
  previous kit's recipe for a dial-in on a new kit, its ties and what carries
  over) lives in EPIC-02-01; the home screen (EPIC-02-02) and pre-fill
  (EPIC-02-03) only use it.
- Catalog: picking from the seed list is split by catalog (hardware in
  EPIC-01-02, coffee in EPIC-03-01); adding entries for both is EPIC-01-06;
  merging for both is EPIC-06-07. The catalog serves INIT-01, INIT-03 and
  INIT-06 but has no initiative of its own.
- One-tap reaction: the good/off reaction is in EPIC-02-03, not EPIC-02-02 or
  EPIC-01-05.
- Drink list editing (EPIC-02-05) could sit under INIT-01 or INIT-02.
- Google sign-in and linking is its own epic (EPIC-05-03); EPIC-05-02 only
  depends on it.
- Editing shots: the recent shots list and edit flow are EPIC-02-06; EPIC-02-02
  only links to them for one-tap shots; undo stays in EPIC-02-02.
- App shell (revision 4): the frame (tabs, headers, shared state patterns,
  profile screen frame) is EPIC-01-01; each screen's content belongs to the
  epic that owns it.
- Shot warnings (revision 4): owned by EPIC-01-05; the recent shots list
  (EPIC-02-06) only displays them.
- Grind period display (revision 4): owned by EPIC-04-01; the recent shots
  list (EPIC-02-06) and part screen (EPIC-01-02) host it.
- Catalog capabilities (revision 4): seeded models' capabilities come with the
  seed list (EPIC-01-02); user-added models' capabilities are entered, and
  edited while unverified (revision 5), in EPIC-01-06.
- Kits (revision 6): kit identity (fixed combinations, reusing a matching kit,
  one part per kind) is EPIC-01-02; recipes per kit and the closest-kit
  pre-fill are EPIC-02-01; servicing a part is EPIC-04-01.
- Kit switching (revision 7, PEC-09): the current-kit rule and what "change a
  part" does (find or create the matching kit) are EPIC-01-02; the selects on
  Home and in the shot log that offer it are EPIC-02-02, even though the shot
  log is EPIC-01-03's screen. EPIC-01-03 only pre-chooses the current kit.
- Freshness (revisions 6 and 7): both clocks and where they show (one line on
  Home, both on the bag screen) are owned by EPIC-03-03; the home screen
  (EPIC-02-02) and bag screen (EPIC-03-01) host them. The "open" rule for
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
- INIT-02 Q4 (active persona): the persona selected on the home screen.
- INIT-02 Q5 (no pinned recipe): the button becomes "Dial in".
- INIT-04 Q1 (maintenance in MVP): yes, recording only; offsets stay Next.
- Gap: default persona name: none stored; translated role label.
- Gaps: which portion and which kit a one-tap shot uses: earliest-opened open
  portion of the bean (asking if none), and the recipe's kit.
- Anonymous-account data loss (EPIC-01-01): accepted for the MVP; Google
  linking is the first Next epic (EPIC-05-03).
- Shot history screen (EPIC-01-03, EPIC-02-02): a recent shots list in the MVP
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
- Where grind periods are visible in the MVP (EPIC-04-01): recent shots
  dividers and the part's screen (PEC-06).
- Changing drink and coffee before a one-tap pull (EPIC-02-02, part of SQ-06):
  allowed on the home screen (PEC-03).
- (Toolkit editing after shots are logged was closed by PEC-02; that answer is
  reversed in revision 6, see below.)

Closed by the plan review decisions (revision 6):

- Toolkit editing (EPIC-01-02): kits are never edited; a different
  combination of parts is a different kit, and the same combination reuses its
  kit and recipes (S-02). Replaces PEC-02's editing part and PEC-07.
- Retired units in kits and shot paths (EPIC-01-02, EPIC-02-01; review M3): no
  retire action in the MVP; shots take their parts from the kit.
- Default kit name (EPIC-01-02, DQ-01): optional; shown by its parts or a
  translated default (S-08).
- INIT-03 Q2, bean age without a roast date (EPIC-03-03; review blocker B1):
  packing date if printed, else time left to best-before, with no invented
  age (S-02).
- S-09 "days since opened" versus age from roast (EPIC-03-03, EPIC-06-02): two
  clocks; the Coach uses the since-opening clock (S-02).
- Whether a roast date or best-before is required (EPIC-03-01): neither; the
  age rule covers missing dates.
- "Open" for an opened-then-frozen portion (EPIC-02-02, EPIC-03-02; review
  M5): not open until thawed; one-tap never uses frozen coffee on its own
  (S-02).
- iOS storage eviction (EPIC-01-01, EPIC-05-03; review M6): explicitly
  accepted for the prototype; EPIC-05-03 stays first in Next (S-02).
- X-1, timestamp precision (EPIC-01-01, EPIC-01-03; review m1): integer
  milliseconds (S-02, TQ-04).
- Recalibration as an event kind or a flag (EPIC-04-01; review m1): a flag on
  the event (S-02, TQ-05).
- INIT-01 Q5, Fahrenheit (EPIC-01-04): display only; stored in °C (S-08).

Closed in revision 7 (PEC-09, design working assumptions and Head of Product
decisions):

- Which kit is current, and how the user switches (EPIC-01-02, EPIC-02-02):
  the kit of the persona's last shot, else the newest kit; choosing a kit, or
  "change a part", on Home or in the shot log makes it current at once (DQ-18,
  PEC-09).
- Closest-kit ties (EPIC-02-01): the most recently used kit wins (DQ-19).
- Grind pre-fill from a kit with a different grinder (EPIC-02-01): grind
  doesn't carry over; dose, yield and time do; temperature and pressure only
  with the same machine (DQ-20).
- Must a kit contain exactly one machine and one grinder (EPIC-01-02): one
  part per kind, machine and grinder required; the name can change at any time
  (DQ-21).
- Which freshness clock Home shows (EPIC-03-03): both, on one line (Head of
  Product).
- Whether small parts should make a new kit (EPIC-01-02): yes; "any part change
  makes a new kit" is confirmed by the Head of Product.

DQ-18 to DQ-21 are working assumptions: the plan builds on them, and the Head
of Product can reverse any of them without changing the epic structure.

## MVP size (review m9)

The MVP is 15 epics. The reviewer counts 177 story points and about 851 hours
of MVP tasks, large for a "basic app" (S-01). Nothing has been cut. The Head
of Product will confirm the size or pick cuts at final sign-off. The levers the
reviewer names: splitting EPIC-01-06 so coffee additions ship first, and the
cut candidates already listed in the stories.

## Suggested build order

Dependencies first; within a priority, earlier delivers daily value sooner.
Unchanged in revisions 6 and 7.

**MVP**
1. EPIC-01-01 Start brewing without setting anything up (none)
2. EPIC-01-02 Describe your kit once (after 01-01)
3. EPIC-03-01 Add a bag to your pantry (after 01-01)
4. EPIC-01-06 Add what's missing from the catalog (after 01-02, 03-01; can run
   in parallel with 5)
5. EPIC-01-03 Log a shot in seconds (after 01-02, 03-01)
6. EPIC-01-04 Record temperature and pressure (after 01-03)
7. EPIC-02-06 See your recent shots (after 01-03, 01-04)
8. EPIC-04-01 Record maintenance on your kit (after 01-02, 02-06; early so
   grind periods are right from the first shots)
9. EPIC-02-01 Pin the recipe that worked (after 01-02, 01-03, 01-04, 03-01)
10. EPIC-02-02 Pull your daily shot in one tap (after 01-02, 02-01, 02-06)
11. EPIC-02-03 Fix a bad shot from your recipe (after 02-02)
12. EPIC-01-05 Say how it tasted (after 01-03)
13. EPIC-03-02 Split and freeze a bag (after 03-01)
14. EPIC-03-03 Know how fresh your beans really are (after 03-01, 03-02,
    01-03)
15. EPIC-03-04 See how much coffee is left (after 03-02, 02-02)

**Next**
16. EPIC-05-03 Keep your coffee history when you change phones (after 01-01;
    first Next epic per S-02)
17. EPIC-02-05 Make the drink list yours (after 01-01, 02-02)
18. EPIC-02-04 Give one bag its own recipe (after 02-02; needs INIT-02 Q1)
19. EPIC-03-05 Know when you'll run out (after 03-04)
20. EPIC-05-01 Brew for someone else in the household (after 02-02)
21. EPIC-04-02 Suggested grind that follows bean age and recent shots (after
    03-03, 02-03, 04-01)
22. EPIC-04-03 Re-dial once after maintenance (after 04-02)
23. EPIC-04-04 Stretch factor after new burrs (after 04-03)

**Later**
24. EPIC-05-02 Invite them to take over their own profile (after 05-01, 05-03)
25. EPIC-06-01 Scan a bag instead of typing it (after 03-01, 01-06)
26. EPIC-06-04 Tare learns your palate as you log (after 01-05, 02-03)
27. EPIC-06-02 Get a grounded fix when a shot goes wrong (after 02-03, 01-05,
    03-03; placed after 06-04 so the palate-alignment eval has a taste graph)
28. EPIC-06-07 Merge duplicate catalog entries, with AI suggestions (after
    01-06)
29. EPIC-06-05 Share your shots, with your consent (after 01-03; 05-02 for
    claimed sub personas)
30. EPIC-06-06 Start a new bag from the community (after 06-05, 06-04, 06-01,
    06-02, 06-07)
