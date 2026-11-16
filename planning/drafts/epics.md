# Tare epics (final, revision 11)

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
Beans filters a Next home; revision 11 applies design review round 8
(2026-11-15): the Head of Product accepted PEC-16 to PEC-22 and DQ-29 to DQ-43
for the Next epics (with the adjustments below), splits Beans filters into
their own epic, moves invites into Next, and records the sugar and milk
decisions.

**Status: final, approved by the Head of Product** (revision 11, with the
review fixes, design round 3 changes, the setup change, the taste and milk
changes, the section names and the round 8 decisions below as approved
amendments). The Head of Product has confirmed the MVP must be a fully usable
logging tool, including choosing a setup and beans. Its size is to be
confirmed, or cuts picked, at final sign-off (review m9); nothing has been cut.
No GitHub issues have been created.

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
scales rated against the persona's own ideal (S-02). A "profile" is a persona
as people see it (a name, no login needed). Earlier revisions said "toolkit",
"kit", "pantry" and "recent shots"; the older change-log entries below keep the
names used at the time.

## Changes in this revision

Revision 11 (design review round 8, 2026-11-15; PEC-16 to PEC-22 and DQ-29 to
DQ-43 accepted by the Head of Product, with the adjustments listed):

- **New epic EPIC-03-07 "Find any coffee in Beans" (Next, M after the 2026-11-16 re-size; first listed S), parent INIT-03
  (PEC-17).** Beans filters leave EPIC-03-05, which becomes run-out only
  (retitled "Know when you'll run out", M at the small end). The ID is the next
  free one in INIT-03, so EPIC-03-05 keeps its ID and any issue or story
  written against it stays valid. INIT-03 now has seven epics, one over the
  2-to-6 guideline; the reasoning and the alternative are in the epic's
  "Parent decision". The origin filter needs a catalog field the schema lacks
  (S-08 `canonical_beans` has no origin); that migration and the question in
  Add a coffee are owned by EPIC-03-07.
- **EPIC-02-04 (PEC-16, DQ-29):** pin scope is chosen in the pin sheet; a pin
  defaults to the coffee's recipe, the first recipe for a coffee is always the
  coffee's, and when the bag already has its own recipe the default is "this
  bag only". Adds "remove a bag's own recipe". Closes INIT-02 Q1. Stays S.
- **EPIC-02-01 (sugar, DQ-29 note):** a pinned recipe remembers the shot's
  sweetened toggle (yes or no, no amount) and logs started from the recipe
  start pre-ticked. Today sweetened is on the shot only and always starts off.
  Placed here because the recipe owns pinning and what a recipe remembers; the
  copy points are noted in EPIC-01-03, EPIC-02-02, EPIC-02-03 and EPIC-02-06.
  Needs a new column on recipes (S-08 lacks it). Stays M.
- **EPIC-02-05 (milk decision, DQ-38):** conventional drink types define milk
  inherently (an Americano has none); a variation such as "Americano with
  froth" is a custom drink, added here. No change to milk on any existing
  drink. Also records DQ-38 (hidden drinks and milks). Re-sized from S to M on
  2026-11-16 (Head of Product, stories Q5; 17 story points).
- **EPIC-03-05 (DQ-39):** run-out only. Prediction is in the product now (in
  Next), shown only after about three finished portions, hidden when use is
  stale or any Beans filter is on, and the sheet shows its inputs and the
  logged share rather than promising an accuracy. Closes INIT-03 Q1.
- **EPIC-04-02 (PEC-21, DQ-30, DQ-31, DQ-32 revised, DQ-33, DQ-34, DQ-43):**
  - Scope now shows drift only where a recipe is the starting point (Brew,
    dial in from a recipe), not in fix mode, "Dial in from this" or edit.
  - The bag signal uses the bag's measured shots in the last 3 days of the
    current grind period, at least 3 (reaching further back if needed, never
    past the last maintenance) and at most 10, weighted by age in time (today
    about twice 3 days ago). This **replaces** the earlier "last 5 shots"
    recommendation.
  - Shots from every persona on the same coffee and grinder are pooled as a
    relative signal (for example "running about 10% fast against its recipe"),
    each judged against the recipe it was brewed from, then converted into a
    separate grind nudge per recipe. The window is time-based because personas
    differ in volume (2 versus 5 shots a day; more people means more shots from
    one bag). Fall back to pooling within the same basket if evals show single
    and double baskets diverge. Numbers are starting values the evals tune.
  - Only shots with the recipe's puck prep count; SH-DRIFT says how many were
    left out (DQ-33).
  - Rules and statistics, not AI, but shipped with evals (DQ-43). Stays L.
- **EPIC-04-03 (PEC-22, DQ-42):** only grinder events marked as a recalibration
  prompt a re-dial; declining stores a zero shift; shifts chain in date order;
  non-grinder events have no effect. Stays M.
- **EPIC-04-04 (DQ-43):** the shift and stretch are fitted by a least-squares
  line through all re-dials, flagged uncertain past a threshold and always
  editable; stretch applies to burrs events only. Stays S.
- **EPIC-05-01 (PEC-18, DQ-35, DQ-36, DQ-37):** a profile with history cannot
  be removed (an empty one can); the current setup follows the household's last
  shot, so switching person never switches setup; a profile's first dial-in
  starts from another profile's recipe for the same coffee, drink and setup; the
  Journal gains a Person filter and Tried a per-person summary. Stays M at the
  top.
- **EPIC-05-03 (PEC-19, DQ-40):** the offer to sign in on a new device moves to
  the first-run Brew screen and Profile (not the start screen); a plain
  monochrome text button, no Google logo; a Google account already linked is
  never merged (an empty device may switch to that history after one
  confirmation, a device with history is refused); the one-time prompt's
  dismissal is remembered on the device. STORY-05-03-02 AC 3 needs rewording by
  the story-writer. Stays S.
- **EPIC-05-02 (PEC-20, DQ-41):** **moves from Later to Next, sequenced last
  among the Next epics** (the Head of Product's adjustment: it stays in this
  breakdown and gets stories and tasks now). Scope rules: every invite names a
  profile; an invitee with history is refused; a new invites table is needed. A
  one-use link valid 7 days, sent by the member, with no email collected. Stays
  L.
- **EPIC-01-02 and EPIC-02-02 (DQ-36 wording):** "the current setup is the
  setup of the household's last shot", which is the same as the persona's last
  shot until EPIC-05-01 adds profiles. No scope change.
- **Other DQs accepted as recommended:** DQ-29 to DQ-31, DQ-34 to DQ-43.
- **Spec text to update (Head of Product or spec owner):** S-02, S-04 and S-08
  say sugar is "a mark on the shot" (now also remembered by the recipe, with a
  new `pinned_recipes` column); S-02 says "only the UI changes between phases"
  (invites need a new table, and recipes a new column); S-02's "still open"
  line on pinning is now answered (DQ-29); the S-02 Beans filters line should
  mention origin needs a catalog field.
- **Build order:** EPIC-05-02 moves from 25th (Later) to 26th and last of Next;
  EPIC-03-07 joins Next after EPIC-03-05. Later now starts at 27th.
- Counts: 16 MVP, 10 Next, 6 Later (32 epics).

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
    (Revision 10 joined them to EPIC-03-05; superseded in revision 11, which
    gives them EPIC-03-07.)
- **MVP scope note:** the Head of Product confirmed the MVP must be a fully
  usable logging tool, including choosing a setup and beans. Recorded in the
  header and in "MVP size".
- **Build order:** EPIC-03-06 is added at the end of the MVP (16th), after
  EPIC-03-04. Next and Later positions move down by one.
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
| EPIC-02-05 | Make the drink and milk lists yours | INIT-02 | Next | M |
| EPIC-02-06 | Look back in your journal | INIT-02 | MVP | M |
| EPIC-03-01 | Add a bag of beans | INIT-03 | MVP | M |
| EPIC-03-02 | Split and freeze a bag | INIT-03 | MVP | M |
| EPIC-03-03 | Know how fresh your beans really are | INIT-03 | MVP | S |
| EPIC-03-04 | See how much coffee is left | INIT-03 | MVP | S |
| EPIC-03-05 | Know when you'll run out | INIT-03 | Next | M |
| EPIC-03-06 | See every coffee you've tried | INIT-03 | MVP | M |
| EPIC-03-07 | Find any coffee in Beans | INIT-03 | Next | M |
| EPIC-04-01 | Record maintenance on your equipment | INIT-04 | MVP | S |
| EPIC-04-02 | Suggested grind that follows bean age and recent shots | INIT-04 | Next | L |
| EPIC-04-03 | Re-dial once after maintenance and keep every recipe | INIT-04 | Next | M |
| EPIC-04-04 | Keep recipes right after new burrs of a different design | INIT-04 | Next | S |
| EPIC-05-01 | Brew for someone else in the household | INIT-05 | Next | M |
| EPIC-05-02 | Invite them to take over their own profile | INIT-05 | Next (last) | L |
| EPIC-05-03 | Keep your coffee history when you change phones | INIT-05 | Next | S |
| EPIC-06-01 | Scan a bag instead of typing it | INIT-06 | Later | M |
| EPIC-06-02 | Get a grounded fix when a shot goes wrong | INIT-06 | Later | L |
| EPIC-06-04 | Tare learns your palate as you log | INIT-06 | Later | M |
| EPIC-06-05 | Share your shots, with your consent | INIT-06 | Later | M |
| EPIC-06-06 | Start a new bag from the community, tuned to you | INIT-06 | Later | L |
| EPIC-06-07 | Merge duplicate catalog entries, with AI suggestions | INIT-06 | Later | L |

Counts: 16 MVP, 10 Next, 6 Later (32 epics).

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
  clocks), usage rate, drift adjustments, dial-in suggestions, the Tried list,
  run-out.
- Timestamps are integer milliseconds (S-02, TQ-04); local days use the
  device's time zone (TQ-07).
- Phase 1 has no AI features (S-01): no LLM calls in any MVP or Next epic.
  Dial-in suggestions are rules, not AI (S-02). Drift (EPIC-04-02) and offsets
  (EPIC-04-03, EPIC-04-04) are rules and statistics, not AI, but ship with
  evals like the suggestion rules (DQ-43).
- Catalog merges (S-02, S-08): any code that reads a catalog reference follows
  the merge pointer to the surviving entry. Merges only happen from EPIC-06-07,
  but readers built earlier must respect the pointer.
- Setups never change (S-02, confirmed by the Head of Product): no epic edits a
  setup's parts. A setup is machine, grinder and basket; a different
  combination of those is a different setup. Puck prep (WDT, puck screen) is a
  checkbox on shots and recipes, never part of a setup. Milk and sweetened are
  part of the drink, never part of a recipe's identity.
- Taste is relative to the persona (S-02): "just right" answers and tags, never
  absolute scores; all optional.
- Households are never merged (DQ-40, DQ-41): linking Google (EPIC-05-03) and
  joining by invite (EPIC-05-02) may replace an empty household and refuse one
  with history. The "nothing entered yet" test (no parts, no bags, no shots; the
  starter lists don't count) is defined once, in EPIC-05-03.
- Brew shows at most one Card at a time (design pattern): the re-dial Card
  (EPIC-04-03) wins over the link Card (EPIC-05-03), and neither shows beside a
  pulled state.

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
  - **Resolved (Head of Product answer 3).** The typical milk amount for each
    starter drink: cortado 60 ml, flat white 120 ml, cappuccino 120 ml, latte
    200 ml, macchiato 15 ml, none for the rest.
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
  - In (DQ-18, amended by DQ-36 in round 8): the current setup is the setup of
    the household's last shot (measured or one-tap); before any shot, the
    newest setup. With one persona this is the persona's last shot, so nothing
    differs in the MVP; it matters once EPIC-05-01 adds profiles, because the
    machine on the counter is the same for everyone. Choosing a setup makes it
    current at once, without waiting for a shot.
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
  - Closed (DQ-18, PEC-09, working assumption; DQ-36, round 8): which setup is
    current, and how the user switches.

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
  - In: "sweetened" is a yes/no on the shot and starts off on a blank log. When
    the log is started from a recipe that remembers it, it starts ticked
    (EPIC-02-01); the user can untick it.
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
    shot on this setup, or empty? Not in the spec. Sweetened is decided: it
    starts off (Head of Product, round 8).
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
    same threshold. (EPIC-04-02's "running about 10% fast against its recipe"
    is a relative signal for drift, not this warning.)
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
  - Out: an origin question on adding a coffee (EPIC-03-07, which owns the new
    catalog field and extends this flow when it ships).
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
    fallback ranges. **Resolved:** with a "not sure" basket dose range, dose is
    never suggested; the suggestion skips to the next lever. Can the admin correct
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
  while keeping the old ones. The recipe also remembers whether the shot was
  sweetened, so the next log starts pre-ticked. On a new setup, the closest
  previous setup's recipe gives the dial-in a head start.
- **Source sections:** S-02, S-04, S-08 (S-01 roadmap)
- **Scope**
  - In: pin from a logged shot (recipe points back to it) or enter values
    directly; the recipe records its setup, the same optional temperature and
    pressure pairs as shots, the puck prep checkboxes and, for milk drinks,
    the usual milk type and amount, copied from the shot when pinned from one.
  - In (Head of Product, round 8): the recipe remembers the shot's
    **sweetened** toggle: yes or no only, no amount or kind of sugar. Pinning
    from a shot copies it; entering values offers the same toggle. Any log
    started from the recipe (Dial in, fix, the closest-setup dial-in, and the
    one-tap copy in EPIC-02-02) starts with it as the recipe has it. Existing
    recipes read as not sweetened. Needs a new boolean column on recipes (S-08
    has it on shots only).
  - In: milk and sweetened are part of the drink, not the recipe's identity
    (S-02): a recipe stays scoped to coffee, persona, setup and drink type,
    whatever the milk or sugar.
  - In: re-pinning adds a row; the latest pin wins.
  - In: see the current recipe for a coffee, persona, setup and drink type; it
    applies to every bag of that coffee. (A pin updates the coffee's recipe by
    default, DQ-29; choosing "this bag only" is EPIC-02-04.)
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
  - Out: a new profile's first dial-in starting from another profile's recipe
    (EPIC-05-01; it only exists once there are several profiles).
  - Out: listing a coffee's recipes on the coffee screen (EPIC-03-06 shows
    them, using this epic's resolution).
  - Out: the sweetened amount or kind, and sweetened on Brew before a pull
    (see risks).
- **Dependencies:** EPIC-01-03 (pin from a shot), EPIC-01-04 (recipes carry the
  same temperature and pressure fields), EPIC-03-01 (the coffee comes from
  Beans), EPIC-01-02 (setups).
- **Priority:** MVP
- **Rough size:** M, at the top (22 story points with sweetened on recipes; re-sized 2026-11-16)
- **Risks and open questions**
  - **Closed (DQ-29, round 8): INIT-02 Q1.** A pin updates the coffee's
    recipe, as built; "this bag only" is an explicit choice in EPIC-02-04.
  - Sweetened on recipes changes the spec's wording ("a mark on the shot"):
    S-02, S-04 and S-08 need updating, and `pinned_recipes` gets a column. Two
    shots of the same drink, one with sugar and one without, still share one
    recipe, so someone who sometimes sweetens has to untick on those days; the
    toggle is the whole feature and no amount is kept.
  - Which shot's sweetened value wins when a recipe is pinned from a past shot
    is simple (that shot's), but a one-tap shot cannot be pinned (below), so a
    household that only uses one-tap shots has the value only from the last
    manual pin.
  - Is pinning a recipe without a source shot allowed? `source_extraction_id`
    is nullable, so the schema allows it, but no flow is described.
  - Can a one-tap shot be pinned? It only copies a recipe, so pinning it would
    add nothing; confirm it's excluded.
  - Do the prep checkboxes, milk and sweetened carry over in a closest-setup
    pre-fill? Closed (STORY-02-01-06 AC 3): they carry over.
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
  checkboxes, milk and sweetened included, so daily use is counted. With no
  recipe on this setup, the button reads "Dial in". The user can switch setup,
  or change a part, right there.
- **Source sections:** S-06, S-02, S-08
- **Scope**
  - In: Brew uses the persona selected there (in the MVP, the one main
    persona), the current setup (DQ-18 as amended by DQ-36, EPIC-01-02) and
    that persona's last drink type at this time of day. Brew always shows the
    recipe on the current setup, so a one-tap pull always uses that recipe's
    setup.
  - In (PEC-03): before a pull, the user can change the drink and the coffee
    on Brew; the recipe shown updates in place, and the pull uses the chosen
    drink and coffee. The drink and coffee selected here also pre-filter the
    Journal (EPIC-02-06).
  - In (PEC-09): the setup line on Brew and the setup field in the shot log are
    selects offering the household's setups and "change a part". The setup
    chosen becomes the current setup, and the recipe shown updates in place.
  - In: "Pull This Shot" copies the pinned recipe's values, including the
    puck prep checkboxes, the milk type and amount (S-02) and the sweetened
    toggle (EPIC-02-01), into a shot marked one-tap, with the recipe's setup
    and the earliest-opened open portion of that coffee. "Open" means opened,
    not finished and not in the freezer (S-02): an opened-then-frozen portion
    isn't open until thawed, and one-tap never uses frozen coffee on its own.
    If no portion of the coffee is open, it asks; frozen coffee is used only
    when the user picks it.
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
  - Out: the drift-adjusted grind shown on Brew (EPIC-04-02) and the
    servicing shift (EPIC-04-03); this epic's Brew hosts them.
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
  - A one-tap shot copies the recipe's prep checkboxes, milk and sweetened
    toggle, so a day with a different milk, without sugar or without the WDT
    tool is recorded wrongly unless the shot is edited. That's the price of
    zero inputs; editing in EPIC-02-06 fixes it. Should milk or sweetened be
    changeable on Brew before a pull, like drink and coffee? Not in the spec.
    Closed (DQ-44a and b, accepted): a one-tap pull copies sweetened, and
    sweetened isn't changeable on Brew.
  - Opening a portion when none is open: does answering the prompt mark a
    portion opened? Links to the EPIC-03-02 question on who sets "opened".
  - Closed (DQ-18, PEC-09, working assumption; DQ-36, round 8): which setup is
    current, and how the user switches.
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
    without one, the closest previous setup's recipe, EPIC-02-01), prep, milk
    and sweetened included, with the suggested change applied and marked. The
    user can accept, change or ignore it, and saves a normal measured shot.
    Fix mode applies no drift adjustment: it starts from the evidence of the
    off shot plus one suggested change (DQ-34, EPIC-04-02).
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
  - The rules are heuristics, tested against plain scenario tests, not an LLM
    judge (Phase 1 has no AI). Closed by the Head of Product's answers: the
    tech-lead writes the scenarios.
  - Step sizes for "a bit" and "much" per lever (grind steps, grams, degrees,
    millilitres) are set by SQ-19. Closed.
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
  - Closed (DQ-34, round 8): when drift (EPIC-04-02) and a suggestion could
    both apply, they never meet; drift applies only where the recipe is the
    starting point, and fix mode starts from the off shot.

### EPIC-02-04: Give one bag its own recipe

- **Parent:** INIT-02
- **Description:** If one bag behaves differently from the coffee's usual, the
  user chooses "this bag only" when pinning, and the recipe applies to that bag
  alone. The coffee's recipe stays as it was for the next bag, and the user can
  drop the bag's own recipe later to go back to the coffee's.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In (DQ-29): a scope choice in the pin sheet, two options: every bag of this
    coffee, and this bag only. Pinning for this bag only leaves the coffee's
    recipe untouched; the sheet says what the bag would otherwise use.
  - In (DQ-29): defaults. A pin defaults to the coffee's recipe, as the MVP
    does. The first recipe for a coffee (for the drink and setup) is always the
    coffee's, and the scope choice isn't offered then, so a coffee never ends
    up with only a bag recipe. When the bag already has its own recipe for this
    drink and setup, the default is "this bag only". One option is always
    selected; never a silent choice.
  - In: Brew and pre-fill (Dial in, fix) use the bag's recipe while that bag is
    the portion in use (earliest-opened open portion); a new bag of the same
    coffee starts from the coffee's recipe again, with no prompt.
  - In: shown as text, never colour: a marker on Brew, the bag's screen
    (its own recipe first, then the coffee's), the portion picker and the
    coffee screen's bag rows.
  - In (PEC-16): remove a bag's own recipe ("use the coffee's recipe for this
    bag"), after one confirmation. The coffee's recipe is unchanged.
  - In: a finished bag can't be chosen as the scope of a new pin (the choice
    explains why).
  - Out: anything else about recipes (EPIC-02-01).
  - Out: a bag recipe per persona beyond what recipes already scope by
    (recipes are per coffee, persona, setup and drink; so is a bag's).
  - Out: recording which recipe a shot came from; shots store their values only.
- **Dependencies:** EPIC-02-01 (the pin flow and the recipe it overrides),
  EPIC-02-02 (Brew and the portion in use), EPIC-03-06 (the coffee screen's bag
  rows; the bag marker can ship without it).
- **Priority:** Next. Differs from the initiative (MVP): the coffee's default
  delivers the initiative's goal on its own, and deferring it avoids building
  on an unresolved question, now answered (DQ-29).
- **Rough size:** S
- **Risks and open questions**
  - Closed (DQ-29, PEC-16, round 8): INIT-02 Q1. A pin defaults to the
    coffee's recipe; "this bag only" is explicit.
  - Existing data: the `pinned_recipes` table already has an optional bag
    column, and today's readers look only at recipes with no bag; they must
    start reading the bag's recipe first (tech note).
  - Overlap flag: the pin sheet is EPIC-02-01's flow; this epic adds the scope
    choice to it. Pinning itself stays in EPIC-02-01.
  - How the bag's recipe interacts with a servicing shift (EPIC-04-03) and with
    drift (EPIC-04-02): both read the bag's recipe like any other recipe. Not in
    the spec; confirm.
  - Should the Head of Product want it in MVP, it slots in after EPIC-02-03.

### EPIC-02-05: Make the drink and milk lists yours

- **Parent:** INIT-02
- **Description:** The household renames, hides or adds drink types and milks,
  and sets how much milk each drink usually gets, so the lists match what they
  actually make. Hidden entries stop showing on Brew and in the shot log. A
  variation such as "Americano with froth" is added as a custom drink.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: drinks: rename a starter drink (stores its own name over the
    translated one, with a way back to the original), hide or unhide, add a
    custom drink (with or without milk), set the order, and set its typical
    milk amount. The last shown drink can't be hidden.
  - In: milks: rename a starter milk, hide or unhide, add one (for example
    "Oat (barista)"), set the order. No brand catalog (S-02). The last shown
    milk can't be hidden.
  - In (Head of Product, round 8): conventional drink types define milk
    inherently: a starter drink has milk or it doesn't (an Americano has none),
    and that setting is not editable on an existing drink (it would
    reinterpret past shots). A variation such as "Americano with froth" is a
    **custom drink** added here, where the user chooses whether it has milk at
    creation. No change to milk on any existing drink.
  - In (DQ-38): names are unique within the household's drinks and within its
    milks, hidden ones included. Recipes for a hidden drink are kept and return
    on unhide (shown, marked hidden, on the bag and coffee screens). A hidden
    milk that is already chosen on a recipe or shot stays shown by name there
    and is never swapped silently; it just isn't offered as a new choice.
  - In: reordering works without dragging (keyboard and screen reader), each
    move saved at once. A new entry goes last.
  - In: reached from Profile and from a footer row in the selects that use the
    lists, each returning to where it started.
  - Out: the starter lists themselves (EPIC-01-01).
  - Out: the sweetened mark (EPIC-01-03, EPIC-02-01); sugar is never a drink.
  - Out: deleting a drink or milk (hiding is the removal).
  - Out: brand milk catalog; steamed-milk temperature (S-02).
- **Dependencies:** EPIC-01-01, EPIC-02-02 (Brew uses the lists), EPIC-05-03
  (the Profile restructure, used by TASK-02-05-07-FE1).
- **Priority:** Next. Differs from the initiative (MVP): the starter lists
  cover the common drinks and milks, and S-02 doesn't place editing in a phase.
  Moves to MVP if the Head of Product wants it.
- **Rough size:** M (was S; 17 story points with custom drinks and the milks list; re-sized 2026-11-16)
- **Risks and open questions**
  - Placed under INIT-02 because drink type scopes recipes and Brew; it could
    equally sit under INIT-01. Flagged as ambiguous.
  - Until this ships, a household can't add "Oat flat white" to keep separate
    recipes per milk (S-02), and the typical milk amounts are the starter
    values. See EPIC-02-01.
  - Closed (DQ-38, round 8): what happens to recipes and Brew's default when
    their drink type or milk is hidden. If a hidden drink is the one the
    time-of-day rule would pick, it moves on to the next shown drink (DQ-02).
  - Closed (S-08): `has_milk` decides whether a drink shows milk fields and the
    milk wording of the strength question.
  - A custom drink has no typical history; its recipes start empty, and it
    counts as its own drink style for later palate learning (EPIC-06-04 open
    question).

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
    sweetened, rating, "just right" answers and tags, in the shot log UI.
  - In: on a shot's detail, "Dial in from this" opens the shot log pre-filled
    from that past shot (values, prep, milk and sweetened), to log a new
    measured shot. The past shot is unchanged and no drift adjustment is
    applied (DQ-34).
  - In: the Journal can be opened already filtered to one coffee, which the
    coffee screen (EPIC-03-06) uses.
  - Out: a Person filter and a "for {name}" marker on shots (EPIC-05-01, once
    there are several profiles).
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

INIT-03 has seven epics after revision 11, one more than the 2-to-6 guideline;
see EPIC-03-07's parent decision.

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
  - Out: the run-out line (EPIC-03-05, Next) and Beans filters (EPIC-03-07,
    Next); this epic's Beans tab hosts them.
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
    fresh or past its peak), never as levers (EPIC-02-03), and to drift as its
    age input (EPIC-04-02).
  - Out: using age to adjust grind (EPIC-04-02).
- **Dependencies:** EPIC-03-02 (opened, frozen and thawed dates), EPIC-01-03
  (shots to mark), EPIC-03-01 (roast, packing and best-before dates).
- **Priority:** MVP
- **Rough size:** S
- **Risks and open questions**
  - What counts as "too fresh" or "past its peak" for the suggestion
    explanations: design DQ-24 assumes under 5 days since roast or packing, and
    over 35 days since roast or 21 days open, confirmed by the Head of Product
    before wave 12 and tuned by the rule evals.
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

### EPIC-03-05: Know when you'll run out

- **Parent:** INIT-03
- **Description:** Beans tells the household roughly when it will run out of
  coffee, counting frozen stock, based on its real usage rate. One tap shows
  how Tare worked it out: the rate, what it's based on and how much of the
  household's real use logging captures. Until it has enough history it says
  it is still learning and shows no number.
- **Source sections:** S-02, S-08
- **Scope**
  - In: usage rate from finished portions, doses (one-tap included), stock
    checks and purchase dates; calculated, never stored.
  - In: predicted run-out across all portions, frozen included, as one calm
    line under On hand ("about 5 weeks of coffee, 2 of them in the freezer"),
    never a precise date in the line.
  - In: a "how we worked this out" sheet: the span, coffee on hand and how much
    is frozen, usage rate, what it is based on (finished portions over how
    many weeks) and the share of finished portions' weight that logged shots
    account for (S-02), with a sentence on what a low share means.
  - In (DQ-39): shown only after about three finished portions (a threshold the
    rules owner sets); before that, "still learning" with the progress and no
    estimate. Absent when nothing is on hand and when there has been no
    brewing for a month (stale use). Ink only: no warning colour, no buy
    prompt.
  - Out: Beans filters, and hiding this line while a filter is on (EPIC-03-07
    owns the rule).
  - Out: reorder prompts or buying (not in the spec).
  - Out: promising an accuracy: the sheet shows its inputs and the logged
    share instead (DQ-39d; X-2 for this feature).
- **Dependencies:** EPIC-03-04 (remaining weight and doses), EPIC-03-02
  (finished portions), EPIC-02-02 (one-tap doses count), EPIC-03-01 (purchase
  dates).
- **Priority:** Next. Differs from the initiative (MVP): a prediction needs
  weeks of finished portions to be useful, which the MVP epics collect. Closed
  (DQ-39a, round 8): prediction is in the product now, as a Next epic.
- **Rough size:** M, at the small end (was M at the top with the filters;
  PEC-17 split them out).
- **Risks and open questions**
  - Closed (DQ-39, round 8): INIT-03 Q1, whether prediction is Phase 1. Yes,
    in Next; reorder prompts stay out.
  - The three-portion threshold, the stale-use period and the span formats are
    starting values the rules owner can tune.
  - Households that drink more than they log will see run-out sooner than
    shown; the coverage sentence is the honest answer, not a correction.
  - Households with a single person and a single bag a month have very few
    finished portions in the first months; the "still learning" state may show
    for a long time.

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
  - Out: filters by roaster, roast level, origin or rating (EPIC-03-07, Next);
    showing origin on the coffee screen is part of that epic.
  - Out: a per-person summary once there are several profiles (EPIC-05-01).
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
  - "How its shots went" is defined by the design as a working assumption
    (DQ-28): with three or more rated shots, "mostly good", "mixed" or "mostly
    off"; with fewer, "last rated N of 5"; with no ratings but reactions, from
    good and off; otherwise "no ratings yet". Taste is relative to the persona
    (S-02), so a household summary mixes personas once there are several;
    EPIC-05-01 makes it per person. Confirm the words.
  - The summary line can read as a verdict on the coffee ("mostly off") when
    the user simply hadn't dialled it in yet (design concern). It should
    describe the shots, never judge the coffee, and never use colour.
  - Does a coffee count as tried once a bag is added, or only once a shot is
    logged from it? S-02 says "every coffee ever used"; the design assumes a
    shot is needed (DQ-27), so bags never opened appear only in On hand.
  - With many bags on hand, Tried sits below the fold (design concern); the
    design keeps its heading reachable.
  - Merged catalog entries (EPIC-06-07) must collapse into one row.

### EPIC-03-07: Find any coffee in Beans

- **Parent:** INIT-03 (see parent decision)
- **Description:** Once the household has a long list of coffees, they narrow
  Beans, On hand and Tried together, by roaster, roast level, origin or how its
  shots went, to find the coffee they want. Filters only show choices that
  exist, with counts, and one tap clears them.
- **Source sections:** S-02, S-08 (S-02 "Beans filters"; S-08 for the missing
  origin field)
- **Scope**
  - In (DQ-39c): a filter row under the Beans header, shown only once the
    household has six or more distinct coffees (on hand and tried together).
    Beans always opens unfiltered.
  - In: four filters: roaster, roast level (the fixed S-09 scale, light to
    dark), origin and rating. One value per filter; several filters combine
    (AND). Each filter's choices are only values that exist among the
    household's coffees, each with a count. "All" and each filter's own control
    clear them.
  - In (DQ-39b): "rating" for a coffee is Tried's own summary words (mostly
    good, mixed, mostly off, no ratings yet; DQ-28), so nothing new is invented.
  - In: the filters narrow On hand and Tried together; filters are kept when
    returning from a bag or a coffee, and cleared by tapping the Beans tab
    again; a section with no matches says so in one line; when nothing matches,
    one empty state offers "clear filters".
  - In: the run-out line (EPIC-03-05) is hidden while any filter is on, because
    its figure is for all coffee.
  - In (origin, a catalog field the schema lacks): add an optional origin to the
    coffee catalog entry (a nullable column on `canonical_beans`; existing
    entries are unaffected), chosen from a curated list of producing countries
    plus "other", normalised so spellings are one value; ask for it, optionally,
    when a household adds a coffee (EPIC-01-06's flow); fill it in the seed list;
    show it in the coffee screen's details (EPIC-03-06's screen).
  - In: the origin filter is hidden until at least one coffee has an origin;
    coffees without one are findable under "not stated" so they can be filled
    in.
  - Out: free-text search, sorting, saved filters, filters on the Journal
    (EPIC-02-06).
  - Out: a Person filter on Beans: Tried's summary, and so the rating filter,
    follows the person chosen on Brew once there are several profiles
    (EPIC-05-01).
  - Out: editing a verified coffee's origin (admin, then EPIC-06-07).
- **Dependencies:** EPIC-03-06 (Tried, the coffee screen and the rating words),
  EPIC-03-02 (On hand groups), EPIC-03-01 (the Beans tab); EPIC-01-06 (the Add a
  coffee flow it adds a field to; if that epic is split with coffee additions
  first, the origin field goes in with those). Independent of EPIC-03-05; the
  hide rule above works whichever of the two ships first.
- **Priority:** Next (S-02: Beans filters come in Next). Differs from the
  initiative (MVP) because S-02 places them after the MVP.
- **Parent decision (PEC-17):** INIT-03, ID EPIC-03-07 (the next free ID, so
  EPIC-03-05 keeps its number). INIT-03 already has six epics, so this is a
  **seventh, by exception**, which needs the Head of Product's agreement. It is
  thematically right (it is about finding coffee in Beans), and the alternatives
  are worse: INIT-02 is also full, and INIT-04 and INIT-05 have room but are
  about grind drift and households, so a filter epic there would make
  traceability misleading. If the guideline must hold, the fallback is to fold
  it back into EPIC-03-05 as before and ship the filters without the origin chip
  until a coffee has an origin (the design hides the chip then anyway).
- **Rough size:** M, at the small end (was S; 11 story points with the origin field; re-sized 2026-11-16)
- **Risks and open questions**
  - Origin is a data gap: the catalog has no such field (S-08), the seed list
    must be filled in by hand, and a household's own coffees only get one if it
    answers an optional question. Closed (DQ-49): the Head of Product as admin
    fills the seed list (the list of producing countries was supplied on
    2026-11-16, planning/coffee-origins.json); households may set it for coffees
    they add.
  - Closed (DQ-49): a blend is its own origin value, never inferred from a
    coffee's name.
  - A merged coffee (EPIC-06-07) with two different origins: decided with that
    Later epic (DQ-49 keeps the surviving entry's value).
  - Six coffees is a design threshold (DQ-39c), starting value; a household
    with an active Tried list passes it within months.
  - "Rating" depends on Tried's summary words (a working assumption, DQ-28);
    if the words change, so do the filter's choices.
  - INIT-03 now exceeds the epic guideline (see parent decision).

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
    grinder. Any grinder event starts a period, a clean included (as built).
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
  - Closed for drift (DQ-32, round 8): the grind suggestion in EPIC-04-02 looks
    only at shots in the current grind period and never reaches back past the
    last maintenance event. Consequence: because a plain clean starts a new
    period, drift data resets after cleaning (design 7a). Whether a clean
    should start a period at all is a product question for the Head of Product;
    the epic keeps S-02's wording.
  - Should "Dial in from this" (EPIC-02-06) warn when the past shot is from an
    earlier grind period? Its grind may no longer mean the same. Not in the
    spec.
  - Closed (TQ-05): recalibration is a flag on any event, not an event kind.
  - Closed (PEC-06): grind periods show as dividers in the Journal and as the
    period start on the part's screen.
  - Should the recalibration flag default on for burrs and re-zero? Design
    assumes so (DQ-15), and EPIC-04-03 prompts only on flagged grinder events
    (DQ-42); confirm.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

- **Parent:** INIT-04
- **Description:** When the user opens their recipe, Tare shows a grind
  adjusted for how the beans have aged and how this bag has been behaving,
  learned from the household's measured shots on that coffee and grinder with
  the most recent days counting most, and gives a separate nudge for each
  recipe. The stored recipe is unchanged, and the reason is one line away.
- **Source sections:** S-01, S-02, S-04
- **Scope**
  - In: drift adjustments for bean age and the bag's own character,
    calculated from logged shots at read time, never stored.
  - In (DQ-31): the bean-age term is driven by the since-roasting clock (the
    since-opening clock may add a smaller one); it needs at least three
    measured shots on the coffee in the current grind period, spread over at
    least two different ages. With fewer there is no adjustment and nothing
    shown.
  - In (DQ-32, revised): the bag's signal uses the bag's measured shots in the
    last 3 days of the current grind period, at least 3 (reaching further back
    if needed, never past the last maintenance) and at most 10, weighted by
    age in time (today about twice 3 days ago). The window is time-based
    because personas differ in volume (2 versus 5 shots a day; more people
    means more shots from one bag). Same shots in, same answer out.
  - In (DQ-32, revised): shots from every persona on the same coffee and
    grinder are pooled as a relative signal (for example "running about 10%
    fast against its recipe"), each judged against the recipe it was brewed
    from, then converted into a separate grind nudge per recipe (per persona,
    drink and setup). Fall back to pooling within the same basket if evals show
    single and double baskets diverge.
  - In (DQ-33): only shots whose puck prep matches the recipe's count towards
    the adjustment; the others are left out and the "why this grind" sheet
    says how many.
  - In: only measured shots count as measurements; one-tap shots never do
    (S-08 entry mode).
  - In (DQ-30): shown as both a value and a note: the adjusted grind in the
    usual place on Brew, and one quiet line giving the recipe's grind and the
    reason ("recipe 15 · beans have aged"), only when the adjustment is at least
    one grinder step. The line opens a sheet with the trail (recipe's grind,
    each step, the grind shown, the evidence) and "use my recipe's grind for this
    shot" (this pull only, not remembered). Numbers are in the grinder's own
    units; "finer" and "coarser" only when the direction is known.
  - In (DQ-34, PEC-21): drift applies only where the recipe is the starting
    point: Brew and a dial-in from a recipe (including the closest-setup
    dial-in). Not in fix mode, "Dial in from this", edit or entering a recipe.
    A one-tap pull records the grind that was shown.
  - In (DQ-43): rules and statistics, not AI, but shipped with evals like the
    suggestion rules, because it moves a number the user sets a grinder to.
    The window, minimums, weighting and caps are starting values the evals tune.
  - In: with too little evidence, a new grind period or a calculation failure,
    nothing is shown and nothing blocks a pull.
  - Out: a combined freshness score. Drift adjusts grind from shots and bean
    age; no combined score is computed or shown. S-02 defers it (its weighting
    depends on roast level, storage and the coffee) and no epic owns it yet.
  - Out: the one-change suggestion after an off shot (EPIC-02-03).
  - Out: maintenance offsets (EPIC-04-03).
  - Out: AI explanations (EPIC-06-02).
- **Dependencies:** EPIC-03-03 (bean age), EPIC-02-02 and EPIC-02-03 (Brew and
  the pre-filled log, where it is shown), EPIC-04-01 (only shots in the current
  grind period are comparable), EPIC-02-01 (recipes to judge shots against),
  EPIC-02-04 (bag recipes and removed ones, read by TASK-04-02-02-BE1).
  EPIC-05-01 is not required: with one persona the pool is that persona's
  shots, and it widens by itself once profiles exist.
- **Priority:** Next
- **Rough size:** L
- **Risks and open questions**
  - Closed (round 8): INIT-04 Q2 (recency window and weight: DQ-32 revised), Q3
    (bean-aging estimate: DQ-31), Q4 (value, note or both: DQ-30), SQ-18 (prep:
    DQ-33), the overlap with EPIC-02-03 (DQ-34), and whether it needs evals
    (DQ-43).
  - Shots do not record which recipe they were brewed from (nothing stores it).
    "Each judged against the recipe it was brewed from" therefore needs a rule,
    for example the recipe in force for that coffee, persona, setup and drink at
    the shot's time (the latest pin before it). Closed (DQ-45): the latest pin
    in force before the shot, a bag's own recipe winning for its bag; shots
    with no earlier recipe are left out.
  - The "relative signal" is not defined in the spec. The design's example
    ("about 10% fast against its recipe") suggests measured shot time against
    the recipe's time; whether yield counts too, and how a percentage becomes a
    grind nudge in the grinder's own steps, is the rules owner's to define and
    the evals' to tune.
  - Pooling across personas treats the signal as mechanical (the beans are
    running fast), not a matter of taste; one person's habits (a different
    tamp, say) could bias the others' nudge. Prep matching (DQ-33) reduces this;
    the evals should include a mixed-technique household.
  - Low-volume households may rarely have three shots in three days; the rule
    then reaches back, and a clean or burrs change can leave the period with
    fewer than three, in which case nothing is shown.
  - Pooling is "same coffee and grinder", so shots on different setups that
    share the grinder are pooled, each against its own recipe. Closed (DQ-46):
    intended; shots on a different grinder are never pooled.
  - Single and double baskets may behave differently; the fallback (pool within
    the same basket) is decided by the evals, so the pooling unit may change
    after launch.
  - Shots with different prep than the recipe are left out. A household that
    never ticks prep consistently will often see "nothing to show"; that is the
    safe outcome.
  - Closed (round 8) / flagged: a plain clean starts a new grind period (as
    built, S-02), so drift resets after cleaning (see EPIC-04-01).

### EPIC-04-03: Re-dial once after maintenance and keep every recipe

- **Parent:** INIT-04
- **Description:** After maintenance on a grinder that changes what its numbers
  mean, the user re-dials one coffee. Tare turns the difference into an offset,
  the user confirms or edits it (or declines), and every recipe pinned before
  the event reads correctly again.
- **Source sections:** S-02, S-08
- **Scope**
  - In (DQ-42): only a grinder event marked as a recalibration prompts a
    re-dial (on by default for burrs and re-zero, DQ-15). A clean or a repair
    doesn't prompt. Events on a machine or basket never do and have no effect.
  - In: the prompt is a calm Card on Brew and a status block on the grinder's
    screen, shown only when at least one recipe pinned before the event exists
    on a setup with this grinder; "not now" hides the Card for that event.
  - In: re-dial one coffee: pick one with a recipe from before the event, dial in
    and pin as normal. A pin of a recipe whose predecessor was pinned before the
    event, on a setup with the serviced grinder, counts as a re-dial wherever it
    came from.
  - In: propose the shift in grinder units from the old and new recipe, with the
    bean aging between the two dial-ins subtracted first (EPIC-04-02's estimate;
    with none, nothing is subtracted). The user confirms or edits it in the same
    control, and sees up to three other recipes it will change before agreeing.
  - In (DQ-42d): declining stores a shift of zero, with no separate "declined"
    state; the shift stays editable from the event.
  - In (DQ-42e): a re-dial of a coffee with no earlier recipe makes no shift and
    says why, offering another coffee.
  - In: the shift is stored on the event with the re-dial it came from. When
    reading, apply it to recipes pinned before the event on setups that include
    that grinder; stored recipes are never rewritten. Shifted recipes are
    labelled where shown (the "why this grind" trail).
  - In (DQ-42c): several events chain: each confirmed shift after a recipe's
    pin is applied in date order.
  - In: events on the grinder's screen become tappable to view and edit the
    shift.
  - Out: stretch factor from two or more coffees (EPIC-04-04).
  - Out: drift from bean age and the bag (EPIC-04-02); this epic only reuses its
    aging estimate and its "why this grind" sheet.
- **Dependencies:** EPIC-04-01 (events), EPIC-04-02 (bean-aging estimate to
  subtract and the sheet that lists the servicing step), EPIC-02-01 (recipes to
  map).
- **Priority:** Next
- **Rough size:** M
- **Risks and open questions**
  - Closed (round 8): which events prompt a re-dial (DQ-42a), non-grinder
    events (DQ-42b), chaining (DQ-42c), declining (DQ-42d), no baseline
    (DQ-42e); INIT-04 Q3 as shared with EPIC-04-02 (DQ-31).
  - A plain clean still starts a new grind period (EPIC-04-01) although it never
    prompts a re-dial, so grind history is split without an offset after a
    clean. This is a consequence, not a defect (design 7a), but it affects
    EPIC-04-02.
  - Back-dating or editing an event's date moves it in the chain at once; the
    resulting shifts of already-confirmed events need a rule. Not in the spec.
  - Should an event dated today count recipes pinned earlier today as "before"?
    The design says yes (counts from the moment it is saved); confirm.
  - Brew's Card must not show beside the link Card (EPIC-05-03); the re-dial
    Card wins.

### EPIC-04-04: Keep recipes right after new burrs of a different design

- **Parent:** INIT-04
- **Description:** When the user re-dials two or more coffees after the same
  burrs event, Tare also works out a stretch factor, so recipes stay right when
  new burrs change what each step means.
- **Source sections:** S-02, S-08
- **Scope**
  - In: stretch factor from two or more re-dials after one event; stays 1
    otherwise.
  - In (DQ-43b): the shift and stretch are fitted by a least-squares line
    through all the re-dials of that event; flagged as uncertain when the
    re-dials disagree past a threshold; the user can always edit both.
  - In: the invitation to re-dial a second coffee is shown for burrs events only
    (stretch applies to burrs events only); stretch is shown in plain terms and
    as a percentage, and stored as a factor with 1 meaning no stretch (S-02).
  - In: confirmed and editable like the shift; applied at read time.
  - Out: stretch for non-burrs events (not offered; an existing stretch can still
    be edited by hand).
- **Dependencies:** EPIC-04-03.
- **Priority:** Next. The lowest-value Next epic (only people who change to
  different burrs, and only after a second re-dial); it can be the last of the
  Next epics built before invites without harming anything else.
- **Rough size:** S
- **Risks and open questions**
  - Closed (DQ-43b, round 8): how to fit shift and stretch from more than two
    coffees, and what to do when they disagree.
  - Re-dials whose old grinds are close together cannot tell a stretch from a
    shift. The design assumes about two steps apart as the limit and leaves the
    stretch factor at 1 (0 %) with an explanation; the threshold is a starting value for
    the tech lead to confirm.
  - The uncertainty threshold for "re-dials disagree" is a tech-lead number, not
    in the spec.

---

## INIT-05: Brew for the whole household, each to their own taste

### EPIC-05-01: Brew for someone else in the household

- **Parent:** INIT-05
- **Description:** A household member adds profiles for people they brew for
  who don't have a login, such as a guest or another household member who
  doesn't use the app. They pick a profile on Brew, and each has its own pinned
  recipes, usual drinks, taste answers and shots in the Journal. A name is
  enough; a nickname works.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: create, rename and manage sub personas (profiles with no login) from a
    People screen in Profile. Asking for a name only; no other personal data.
  - In (DQ-35): a profile with no shots and no recipes can be removed after one
    confirmation; a profile with history cannot, says why, and can be renamed.
    The main profile is never removed. (An "archive" flag, one column, is the
    follow-up if old guests become a nuisance; not in this epic, since S-02 says
    only the UI changes.)
  - In: choose the persona on Brew; recipes, the time-of-day drink (per person; a
    new person gets the first shown drink), logging, "just right" answers and
    pins follow it. Brew says who it is for in words whenever it isn't the main
    profile.
  - In (DQ-36): a chosen person holds until Brew has been away for 30 minutes
    and doesn't reset after a pull. The **current setup follows the household's
    last shot**, not the persona's, so switching person never switches setup
    (the machine on the counter is the same for everyone; amends DQ-18).
  - In (DQ-37a): a profile's first dial-in on a coffee, drink and setup starts
    from another profile's recipe for the same, and says so; never as a one-tap
    pull. (The resolution of "which recipe applies" otherwise stays in
    EPIC-02-01; this only exists with several profiles.)
  - In (DQ-37b): the log, tasting, off sheet and pin sheet say "for {name}" when
    the household has more than one profile. A taste answer a member gives for
    someone else is asked the same way; nothing extra is stored.
  - In: shots record the sub persona as whose taste and the member as who
    logged.
  - In (DQ-37c): the Journal marks a shot for a non-main profile in text and
    gains a Person filter chip, defaulting to the person chosen on Brew (a
    change to EPIC-02-06's list); shot detail shows whose taste and who logged.
    Tried's "how its shots went" is the summary for the person chosen on Brew,
    with a subtitle saying so; no filter chip on Beans (a change to
    EPIC-03-06's list).
  - Out: invites and claiming (EPIC-05-02).
  - Out: schema changes (S-02: only the UI changes).
  - Out: pooling taste across profiles; learning a profile's palate
    (EPIC-06-04).
- **Dependencies:** EPIC-02-02 (persona selection on Brew), EPIC-01-03,
  EPIC-02-01 (recipes to start a new profile from), EPIC-02-06 (the Journal it
  adds a filter to), EPIC-03-06 (Tried), EPIC-01-05 (taste answers), EPIC-02-05
  (the shared name rule), EPIC-05-03 (the Profile restructure) and EPIC-03-07
  (STORY-05-01-07 AC 3).
- **Priority:** Next
- **Rough size:** M, at the top (PEC-18 adds the pieces above)
- **Risks and open questions**
  - Closed (round 8): can a profile be deleted (DQ-35); does switching person
    switch setup, and does it stick (DQ-36); a new profile's first dial-in,
    second-hand answers, the Journal and Tried (DQ-37).
  - If several other profiles have a recipe for the same coffee, drink and
    setup, which one does a new profile start from? Closed (DQ-48): the main
    profile's, else the most recently pinned or used.
  - Does a profile have a default label, or must it be named? S-02 covers only
    the default persona; the design requires a name.
  - "Just right" answers only mean something for the persona who tasted the
    shot; second-hand answers are indistinguishable from first-hand ones because
    nothing extra is stored (DQ-37b). This limits palate learning later
    (EPIC-06-04); confirm that's acceptable.
  - Drift (EPIC-04-02) pools shots across profiles by design; once this epic
    ships, the pool widens by itself.
  - The design's example copy for the Journal marker must use a neutral
    name, never a relationship (public repo).

### EPIC-05-02: Invite them to take over their own profile

- **Parent:** INIT-05
- **Description:** A member invites the person behind a profile with a one-use
  link they send themselves. That person sees the profile's history, signs in
  with Google, joins the household and claims the profile as their own main
  persona, keeping all its history. An invite always names a profile, and
  someone who already has history of their own is refused, never merged.
- **Source sections:** S-02, S-04, S-07, S-08
- **Scope**
  - In (DQ-41a): any household member can invite for a profile that has no login
    of its own, and can withdraw the invite; the joiner becomes a member
    (owner/member roles, S-08).
  - In (PEC-20a, DQ-41d): every invite names a profile to claim. Joining without
    a profile to claim is not supported.
  - In (DQ-41c): the invite is a link, single use, valid 7 days, that the member
    sends themselves; Tare collects no email address and sends nothing. A
    pending invite can be copied again or withdrawn; a withdrawn, used, expired
    or claimed link says only that it no longer works, revealing nothing.
  - In: before creating the link, the inviter is told what a joiner shares:
    this household's equipment, beans, recipes and everyone's shots.
  - In: the link opens a page that works signed out. It shows the profile's
    history summary (name, shots, most-made drinks, last brewed) and what
    joining means before anything is claimed; the invitee signs in with Google
    (EPIC-05-03's sign-in), then explicitly confirms the claim. Nothing changes
    until Confirm; cancelling at any step leaves the link usable.
  - In: on Confirm, the profile becomes the signed-in user's own persona (the
    persona gets that user) with its shots and recipes, and the user joins the
    household. Others in the household can still brew for them.
  - In (PEC-20b, DQ-41e): an invitee whose own account has history is refused
    with a plain explanation, never merged; an invitee whose account is empty
    (the "nothing entered yet" test, EPIC-05-03) has it replaced silently. No
    undo after Confirm in this epic.
  - In: a claimed persona's shots follow its own user's consent; an unclaimed
    persona never qualifies, whoever logged it (S-02, S-07). The claim screen
    says the shots stay private to the household.
  - In (tech note, PEC-20): a **new invites store** (token, the profile it names,
    who made it, expiry, status). The schema has none today; S-02's "only the UI
    changes" and S-08's note that invites "add rows later" (to membership) do not
    cover it.
  - Out: the consent setting and the network (EPIC-06-05).
  - Out: Google sign-in and account linking (EPIC-05-03).
  - In: leaving the household (DQ-41b, DES-05-02-05, STORY-05-02-07; Head of
    Product, 2026-11-16). The member's profile and history stay with the
    household as an unclaimed profile, and the leaver starts a new, empty
    household of their own with a fresh profile.
  - Out: email delivery, roles beyond owner and member, and merging accounts.
- **Dependencies:** EPIC-05-01 (profiles to claim and the People screen it adds
  the invite to), EPIC-05-03 (the invitee signs in with Google; the "nothing
  entered yet" test is defined there).
- **Priority:** Next, **sequenced last among the Next epics**. Differs from the
  initiative (Later, "phase 3 invites"): the Head of Product moved it into this
  breakdown with stories and tasks now (PEC-20 adjustment). It stays last so
  nothing else in Next waits on it.
- **Rough size:** L
- **Risks and open questions**
  - Closed (round 8): INIT-05 Q2 (anyone can invite and withdraw; other
    permissions are not defined), delivery (DQ-41c), joining without a profile
    (DQ-41d), an invitee with history (DQ-41e), and INIT-05 Q1 for priority
    (Next, last).
  - Closed (2026-11-16): leaving the household (INIT-05 Q3) is folded into this
    epic and ships with invites; the leaver gets a new, empty household.
  - A claimed persona stays brewable by other members (design); does the
    claiming person get a say? The consent rule keeps their shots out of the
    network until they opt in, but not private within the household. Not in the
    spec; confirm.
  - Does opening the link create an anonymous account and household before the
    invitee chooses (EPIC-01-01 creates one silently on any visit)? The design
    says no account is created before the choice; the tech lead decides how the
    landing page is served, and the "nothing entered yet" test covers the case
    where one already exists.
  - Token handling (unguessable, single use, expiry enforced on the server) is a
    tech-lead point; a link is a credential.
  - S-02's "only the UI changes between phases" needs a correction for the
    invites table.
  - A household with several claimed members shares everyone's shots; the
    warning before creating a link is the only protection. Confirm it is enough.

### EPIC-05-03: Keep your coffee history when you change phones

- **Parent:** INIT-05
- **Description:** The user signs in with Google, and Firebase links that to the
  anonymous account they've been using, so nothing moves and nothing is lost.
  Their history is no longer tied to one device and survives a lost or reset
  phone, or a browser clearing its storage. On a new phone, a user who already
  has a linked history can switch to it.
- **Source sections:** S-02, S-04, S-08
- **Scope**
  - In: Google sign-in linked by Firebase to the existing anonymous account;
    `firebase_uid` and all data stay as they are.
  - In (DQ-40a): a plain monochrome text button ("link your Google account")
    with no Google logo, in the Profile's account section, which replaces the
    device section. To be checked against Google's current guidelines before
    build.
  - In: linked state says the history is kept; nothing from the Google account
    (name, email) is shown or stored beyond the sign-in, and the persona's
    label is unchanged. Cancelling returns silently; failing says nothing has
    changed and offers retry. No unlink in this epic.
  - In (DQ-40b): a Google account already linked to another history is never
    merged. An **empty** device (the "nothing entered yet" test: no parts, no
    bags and no shots; the starter lists don't count) may switch to that history
    after one explicit confirmation (the new-phone case); a device **with
    history** is refused with an explanation and keeps its data.
  - In (DQ-40c, PEC-19): where the new-device offer lives: the first-run Brew
    screen (a quiet "already use Tare? sign in with Google" link under the
    first-run checklist) and Profile, not the start screen. The account is
    created silently within a second, so a choice in front of it would break
    "start brewing without setting anything up". EPIC-01-01 is unchanged.
  - In: one gentle prompt on Brew, once, after the first recipe is pinned or the
    tenth shot is logged, whichever comes first; dismissing it means it never
    returns; never beside the re-dial Card or a pulled state, and never once
    linked.
  - In (DQ-40d): the prompt's dismissal is remembered on the device, with no
    schema change; a cleared browser may show it again, which is acceptable.
  - Out: invites, joining a household and claiming a persona (EPIC-05-02).
  - Out: data-sharing consent (EPIC-06-05).
  - Out: signing out, unlinking, or merging two histories.
- **Dependencies:** EPIC-01-01 (the anonymous account to link). The Brew
  prompt waits for the first recipe (EPIC-02-01) but not on any other epic.
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
  - Closed (DQ-40, PEC-19, round 8): the Google button, the account-already-
    linked case, where the new-device offer lives and the prompt's dismissal.
  - STORY-05-03-02 AC 3 says "before a new account is set up" and needs
    rewording by the story-writer: the offer is now on the first-run Brew
    screen and Profile.
  - Redirect versus pop-up for Google on iOS Safari is a build detail (pop-ups
    are unreliable there).
  - Should the app prompt anonymous users to link at other times, such as after
    a lost-data scare? Only the one-time prompt is in scope.
  - Does the default persona's label change once a Google account is linked?
    The design keeps it unchanged and takes no name from Google; confirm.
  - A cleared browser plus a Google link made earlier is the main recovery
    path; a user who never linked and loses the device has nothing to switch to
    (accepted risk, S-02).

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
  - The scanner does not read origin (S-09 schema has none); EPIC-03-07 adds an
    origin field, and whether the scanner should fill it is not in the spec.

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
  - Second-hand taste answers (a member answering for another profile,
    EPIC-05-01) are not flagged, so they can't be told apart from first-hand
    ones.

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
    capabilities, dose ranges, roast level or origin)? Merging two models used
    in setups could also make two setups identical, and merging two coffees
    combines their Tried rows and coffee screens; not in the spec.
  - INIT-06 Q5: model choice for the matcher.

---

## Section coverage

| Initiative | Source sections | Covered by |
|---|---|---|
| INIT-01 | S-01, S-02, S-04, S-06, S-07, S-08 | S-01: 01-01 (app shell), 01-03, 01-05 (shot warnings), and the design constraint; S-02: 01-01 (tab names, starter milks), 01-02 (fixed setups, current setup, basket dose range), 01-03 (prep, milk, sweetened), 01-04, 01-05 ("just right" taste), 01-06; S-04: 01-01, 01-02 (setups), 01-06; S-06: 01-01 (app shell), 01-03, 01-05; S-07: 01-01, 01-03 (and localization constraint); S-08: all |
| INIT-02 | S-01, S-02, S-04, S-06, S-08 | S-01: 02-01 and 02-03 (grind doesn't transfer); S-02: 02-01 to 02-06 (recipes per setup with prep, milk and sweetened in 02-01; setup switching, prep, milk and sweetened copy and "open" excludes frozen in 02-02; rule-based suggestions and SQ-17 in 02-03; bag recipes in 02-04; milk list editing and custom drinks in 02-05; the Journal with filters in 02-06); S-04: 02-01, 02-04, 02-05; S-06: 02-02, 02-03; S-08: 02-01 to 02-06 |
| INIT-03 | S-02, S-04, S-08 | S-02: all (Beans with On hand in 03-01 and 03-02, two freshness clocks in 03-03, packing date in 03-01, open-vs-frozen in 03-02, run-out in 03-05, Tried and the coffee screen in 03-06, Beans filters in 03-07); S-04: 03-01, 03-02; S-08: 03-01, 03-02, 03-04, 03-05, 03-06, 03-07 (origin column) |
| INIT-04 | S-01, S-02, S-04, S-08 | S-01: 04-01, 04-02; S-02: all; S-04: 04-01, 04-02; S-08: 04-01, 04-03, 04-04 |
| INIT-05 | S-02, S-04, S-07, S-08 | S-02, S-04, S-08: 05-01, 05-02, 05-03 (accepted storage risks); S-07: 05-02 |
| INIT-06 | S-01, S-03, S-05, S-07, S-09 | S-01: 06-01, 06-02, 06-04; S-03: 06-02, 06-06; S-05: 06-05, 06-06 (similar palates, S-05 C); S-07: 06-05; S-09: 06-01, 06-02 |

S-02 decisions and where they land: accounts (EPIC-01-01, EPIC-05-03),
Google sign-in first after the MVP and the accepted lost-device and storage
eviction risks (EPIC-01-01, EPIC-05-03), section names Brew, Journal, Beans and
Setup (EPIC-01-01 shell; EPIC-02-02, EPIC-02-06, EPIC-03-01, EPIC-01-02), the
Journal with filters and "Dial in from this" (EPIC-02-06), Beans On hand
(EPIC-03-01, EPIC-03-02), Tried and the coffee screen (EPIC-03-06), Beans
filters (EPIC-03-07), run-out (EPIC-03-05), private unverified entries and
manual admin review (EPIC-01-06, EPIC-06-07), catalog (EPIC-01-02, EPIC-03-01,
EPIC-01-06, EPIC-06-07), drink types (EPIC-01-01, EPIC-01-03, EPIC-02-05),
default persona label (EPIC-01-01), one-tap shots (EPIC-02-02, EPIC-02-03,
EPIC-03-04, EPIC-04-02, EPIC-06-04, EPIC-06-05), maintenance from Phase 1
(EPIC-04-01), setups as machine, grinder and basket (EPIC-01-02, EPIC-01-06,
EPIC-02-01, EPIC-02-02, EPIC-04-01), puck prep checkboxes (EPIC-01-03,
EPIC-02-01, EPIC-02-02, EPIC-02-03, EPIC-02-06, EPIC-06-02), two freshness
clocks (EPIC-03-01, EPIC-03-03, EPIC-06-02), "open" excludes frozen
(EPIC-02-02, EPIC-03-02), taste relative to the persona (EPIC-01-05,
EPIC-02-03, EPIC-02-06, EPIC-03-06), rule-based dial-in suggestions
(EPIC-02-03, EPIC-06-02), palate learning per persona, drink and milk
(EPIC-06-04), learn only from similar palates (EPIC-06-05, EPIC-06-06), milk
(EPIC-01-01, EPIC-01-03, EPIC-02-01, EPIC-02-02, EPIC-02-03, EPIC-02-05),
sweetened on the recipe (EPIC-02-01, with EPIC-01-03, EPIC-02-02), basket dose
range (EPIC-01-02, EPIC-01-06, EPIC-02-03), households, profiles and invites
(EPIC-05-01, EPIC-05-02), drift and offsets (EPIC-04-02, EPIC-04-03,
EPIC-04-04), technical decisions TQ-04 to TQ-07 (cross-cutting constraints,
EPIC-01-06, EPIC-04-01). Design: PEC-09 (EPIC-02-02, EPIC-01-02), PEC-15
(EPIC-03-06), PEC-16 (EPIC-02-04), PEC-17 (EPIC-03-05, EPIC-03-07), PEC-18
(EPIC-05-01), PEC-19 (EPIC-05-03), PEC-20 (EPIC-05-02), PEC-21 (EPIC-04-02),
PEC-22 (EPIC-04-03), DQ-18 and DQ-21 (EPIC-01-02), DQ-19 and DQ-20
(EPIC-02-01).

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
  and the coffee screen (EPIC-03-06) only use it. Two additions live elsewhere
  because they need a later feature: the bag's own recipe (EPIC-02-04) and a new
  profile's first dial-in from another profile's recipe (EPIC-05-01).
- Pin scope: pinning is EPIC-02-01; the choice between every bag and this bag
  only, and removing a bag's recipe, are EPIC-02-04, which extends the same pin
  sheet.
- Sweetened: the mark on a shot is EPIC-01-03; remembering it on a recipe is
  EPIC-02-01; the one-tap copy is EPIC-02-02; editing it on a past shot and
  "Dial in from this" are EPIC-02-06. It is never a drink type or recipe
  identity.
- Pre-filled shot logs: from a recipe, with a suggestion, is EPIC-02-03; from a
  past shot ("Dial in from this"), EPIC-02-06; from the closest setup's
  recipe, EPIC-02-01; from another profile's recipe, EPIC-05-01. All open
  EPIC-01-03's shot log.
- Catalog: picking from the seed list is split by catalog (hardware in
  EPIC-01-02, coffee in EPIC-03-01); adding entries for both is EPIC-01-06;
  merging for both is EPIC-06-07. The catalog serves INIT-01, INIT-03 and
  INIT-06 but has no initiative of its own. The origin field on the coffee
  catalog is the one catalog change owned outside INIT-01 (EPIC-03-07).
- Beans: the tab, its On hand list and a bag's screen are EPIC-03-01; grouping
  On hand by state is EPIC-03-02; freshness and remaining weight shown on it
  are EPIC-03-03 and EPIC-03-04; the run-out line is EPIC-03-05; Tried and the
  coffee screen are EPIC-03-06, which shows recipes (EPIC-02-01) and links to
  the Journal (EPIC-02-06) without owning them; Beans filters, the origin field
  and the rule hiding the run-out line while a filter is on are EPIC-03-07.
- INIT-03 has seven epics (EPIC-03-07 is by exception, PEC-17); needs the
  Head of Product's agreement.
- Taste: the controls (rating, "just right" questions, tags) and the
  channelling warning are EPIC-01-05; the good/off reaction, the off one-tap
  answers (SQ-17) and the suggestion are EPIC-02-03; editing answers later is
  EPIC-02-06; Tried's "how its shots went" summary is EPIC-03-06 (per person
  from EPIC-05-01); learning a target is EPIC-06-04.
- Suggestions: the one change after an off shot is EPIC-02-03; ahead-of-time
  drift from bean age and history is EPIC-04-02, which never applies in fix
  mode (DQ-34); AI advice is EPIC-06-02, building on the rules.
- Drift and offsets: the "why this grind" sheet is built in EPIC-04-02 and
  extended by EPIC-04-03 (the servicing step) and EPIC-04-04 (stretch).
- Milk: starter list and typical amounts are EPIC-01-01; editing both, and
  adding variations as custom drinks, is EPIC-02-05; milk on a measured shot is
  EPIC-01-03; on recipes, EPIC-02-01; the one-tap copy, EPIC-02-02; milk amount
  as a lever, EPIC-02-03. Whether a drink has milk is fixed at creation.
- Journal filters: the filters, the default pre-filter and its clear are
  EPIC-02-06; Brew's drink and coffee selection they follow is EPIC-02-02; the
  Person filter is EPIC-05-01.
- Current setup: the rule is EPIC-01-02 (the household's last shot, DQ-36); the
  selects are EPIC-02-02; EPIC-05-01 relies on it so switching person never
  switches setup.
- "Nothing entered yet": defined in EPIC-05-03, reused by EPIC-05-02.
- Brew Cards: the re-dial Card (EPIC-04-03) and the link Card (EPIC-05-03) are
  mutually exclusive; the re-dial Card wins.
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
  lever, EPIC-02-03; as a drift filter, EPIC-04-02; editing, EPIC-02-06.
- Freshness: both clocks and where they show are owned by EPIC-03-03; Brew
  (EPIC-02-02) and the bag's screen in Beans (EPIC-03-01) host them, and
  suggestions (EPIC-02-03) and drift (EPIC-04-02) use them. The "open" rule for
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
  DQ-18, PEC-09 (amended by DQ-36 in revision 11).
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
- Where Beans filters go: Next (placed in revision 11, EPIC-03-07).
- Whether the MVP must let people choose their setup and beans (MVP size):
  yes, confirmed by the Head of Product.

Closed in revision 11 (design round 8, 2026-11-15; the Head of Product accepted
PEC-16 to PEC-22 and DQ-29 to DQ-43, with the adjustments noted):

- INIT-02 Q1, pin updates the bag's override or the coffee's default
  (EPIC-02-01, EPIC-02-04): the coffee's recipe by default; "this bag only" is
  explicit; the first recipe is always the coffee's (DQ-29).
- Where Beans filters go (EPIC-03-07): their own Next epic under INIT-03 (by
  exception, PEC-17); the origin filter needs a catalog field the schema lacks.
- INIT-03 Q1, is prediction Phase 1 (EPIC-03-05): in the product now, in Next;
  shown after about three finished portions; the sheet shows inputs, no
  accuracy promised (DQ-39).
- "Rating" for the Beans filter (EPIC-03-07): Tried's summary words (DQ-39b);
  filters appear from six coffees (DQ-39c).
- INIT-04 Q2, recency (EPIC-04-02): the bag's measured shots in the last 3 days
  of the current grind period, 3 to 10 shots, age-weighted by time; pooled
  across personas on the same coffee and grinder as a relative signal, judged
  against each shot's own recipe, then a nudge per recipe (DQ-32 revised, which
  replaces "last 5").
- INIT-04 Q3, bean-aging drift (EPIC-04-02, EPIC-04-03): the since-roasting
  clock drives it; at least three measured shots in the current period over at
  least two ages (DQ-31).
- INIT-04 Q4, value or note (EPIC-04-02): both, when at least one grinder step
  (DQ-30).
- SQ-18, prep (EPIC-04-02): only shots with the recipe's puck prep count; the
  sheet says how many were left out (DQ-33).
- Drift versus the one-change suggestion (EPIC-02-03, EPIC-04-02): they never
  meet; drift applies only where the recipe is the starting point (DQ-34).
- Is drift AI (EPIC-04-02): no, rules and statistics, with evals (DQ-43a).
- Fitting shift and stretch from several coffees (EPIC-04-04): least squares,
  flagged uncertain, always editable (DQ-43b).
- Which events prompt a re-dial, non-grinder events, chaining, declining, no
  baseline (EPIC-04-03): DQ-42.
- Removing a profile (EPIC-05-01): only with no shots and no recipes (DQ-35).
- Switching person and the current setup (EPIC-05-01, EPIC-01-02): the setup
  follows the household's last shot (DQ-36).
- A new profile's first dial-in, second-hand answers, Journal and Tried
  (EPIC-05-01): DQ-37.
- Hidden drinks and milks (EPIC-02-05): DQ-38.
- The Google button, an account already linked, where the new-device offer lives,
  prompt dismissal (EPIC-05-03): DQ-40.
- INIT-05 Q1 for priority, Q2, delivery, joining without a profile, an invitee
  with history (EPIC-05-02): Next and last; any member invites; a one-use link
  valid 7 days; every invite names a profile; an invitee with history is
  refused (PEC-20 as adjusted, DQ-41).
- Sugar on recipes (EPIC-02-01): a recipe remembers the sweetened toggle, yes or
  no, and logs from it start pre-ticked (Head of Product).
- Re-sized on 2026-11-16 to match the stories (Head of Product, stories Q5):
  EPIC-02-05 and EPIC-03-07 are now M, and EPIC-02-01 is "M, at the top". No
  splits.
- Milk (EPIC-02-05): conventional drinks define milk inherently; variations are
  custom drinks; no change to milk on any drink (Head of Product).

Closed after revision 11 (2026-11-16): leaving the household is in EPIC-05-02
scope and the leaver starts a new, empty household (DQ-41b); one-tap pulls copy
sweetened (DQ-44a and b); the seventh INIT-03 epic, EPIC-03-07, is approved
(PEC-17, stories Q7); the recipe a shot was brewed from is the latest pin in
force before it (DQ-45).

Still open for the rules owner and the evals: the exact "relative signal" in
EPIC-04-02 (shot time against recipe time, and how a percentage becomes grinder
steps).

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
revision 8. Revision 10 adds Tried and the coffee screen (EPIC-03-06, M).
Revision 11 changes no MVP epic's size: the sweetened toggle on recipes
(EPIC-02-01, with copy points in EPIC-02-02) is a small addition inside M, and
the DQ-36 wording in EPIC-01-02 changes nothing in the MVP. The Head of Product
will confirm the size or pick cuts at final sign-off. Levers that keep the MVP
usable: splitting EPIC-01-06 so coffee additions ship first; the milk-amount and
temperature suggestion levers; the setup filter and "Dial in from this"; the
coffee screen's bag list and Tried's "how its shots went" summary; the
sweetened toggle on recipes (it can follow the MVP at no cost to the rest); and
the cut candidates already listed in the stories.

## Suggested build order

Dependencies first; within a priority, earlier delivers daily value sooner.
Revision 11 adds EPIC-03-07 to Next after EPIC-03-05 and moves EPIC-05-02 from
Later to the end of Next; Later now starts at 27th.

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
    02-01, 02-02, 02-06)

**Next**
17. EPIC-05-03 Keep your coffee history when you change phones (after 01-01;
    first Next epic per S-02)
18. EPIC-02-05 Make the drink and milk lists yours (after 01-01, 02-02)
19. EPIC-02-04 Give one bag its own recipe (after 02-01, 02-02; INIT-02 Q1 is
    now closed)
20. EPIC-03-05 Know when you'll run out (after 03-02, 03-04, 02-02)
21. EPIC-03-07 Find any coffee in Beans (after 03-06, 03-02, 01-06; new in
    revision 11; independent of 03-05)
22. EPIC-05-01 Brew for someone else in the household (after 02-02, 02-01,
    02-06, 03-06)
23. EPIC-04-02 Suggested grind that follows bean age and recent shots (after
    03-03, 02-03, 04-01; sits after 05-01 so the pool already spans profiles,
    though it doesn't require it)
24. EPIC-04-03 Re-dial once after maintenance (after 04-02)
25. EPIC-04-04 Stretch factor after new burrs (after 04-03)
26. EPIC-05-02 Invite them to take over their own profile (after 05-01, 05-03;
    last among Next, moved from Later in revision 11)

**Later**
27. EPIC-06-01 Scan a bag instead of typing it (after 03-01, 01-06)
28. EPIC-06-04 Tare learns your palate as you log (after 01-05, 02-03)
29. EPIC-06-02 Get a grounded fix when a shot goes wrong (after 02-03, 01-05,
    01-03, 03-03; placed after 06-04 so the palate-alignment eval has a
    learned target)
30. EPIC-06-07 Merge duplicate catalog entries, with AI suggestions (after
    01-06)
31. EPIC-06-05 Share your shots, with your consent (after 01-03, 01-05; 05-02
    for claimed sub personas)
32. EPIC-06-06 Start a new bag from the community (after 06-05, 06-04, 06-01,
    06-02, 06-07)
