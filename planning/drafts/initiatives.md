# Tare initiatives (draft)

Source: `docs/spec.md`, sections S-01 to S-09. S-01 (Updates) and S-02 (Data
model decisions) override older sections where they differ.

Draft for the Head of Product. No GitHub issues have been created.

Revision note: open questions that S-02 has since settled are marked
**Resolved** with a pointer to the decision (review finding m1). The
initiatives themselves are unchanged.

MVP definition used (S-01 roadmap, Phase 1): a basic app for logging shots and
managing recipes, setups and the pantry. No AI features: no LLM calls, bag
scanning, Diagnostic Coach or Cold Start network. AI features come later, each
with evals and observability.

## Summary

| ID | Title | Priority | Source sections |
|---|---|---|---|
| INIT-01 | Log a shot against your real setup in seconds | MVP | S-01, S-02, S-04, S-06, S-07, S-08 |
| INIT-02 | Every new bag starts from what you already learned | MVP | S-01, S-02, S-04, S-06, S-08 |
| INIT-03 | Always know what beans you have and how old they are | MVP | S-02, S-04, S-08 |
| INIT-04 | Grind settings stay meaningful through maintenance and time | Next | S-01, S-02, S-04, S-08 |
| INIT-05 | Brew for the whole household, each to their own taste | Next | S-02, S-04, S-07, S-08 |
| INIT-06 | Dial in a new bag in fewer shots with AI and the community | Later | S-01, S-03, S-05, S-07, S-09 |

---

## INIT-01: Log a shot against your real setup in seconds

**Goal:** A home enthusiast can describe their own equipment once and then
record any shot quickly and accurately, so every later feature has trustworthy
history to work from.

**Success metric:** Share of shots logged with the full MVPayload (grind,
dose, yield, time). Time from opening the log to saving a dial-in shot. Target
not given in the spec.

**In scope**
- Silent setup: one user and one household created at sign-up, never shown;
  one main persona per login (S-02, S-04).
- Owned hardware units pointing to canonical models with declared capabilities
  (temperature, pressure, grind scale and coarser direction) (S-04, S-08).
- Setups grouping owned units, e.g. machine, grinder, basket, accessories
  (S-04).
- Logging an extraction: MVPayload, optional temperature and pressure shown
  only when the machine can set them (exact value or step, never one shared
  column), sensory scores 1-5, overall rating, defects (S-02, S-08).
- Shots record the grinder and machine units directly, plus persona and
  logging user as separate fields (S-02).
- Shot time stored in milliseconds, shown in seconds with one decimal (S-02).
- Tactile number wheels, no text keyboards for variables (S-06).
- Japandi design: Inter, thin weights at large sizes, monochrome warm grey,
  one muted colour only for shot warnings (S-01, S-06).
- Localization: no hardcoded strings, locale-aware number formatting,
  canonical floats in the database, RTL-ready logical CSS (S-07).

**Out of scope**
- Sub personas and invites (INIT-05).
- Pressure profiles (curves per shot) (S-02: "come later").
- Bag scanning, coaching and network sharing (INIT-06).

**Source sections:** S-01, S-02, S-04, S-06, S-07, S-08

**Priority:** MVP

**Open questions**
- **Resolved.** Where do canonical beans and hardware come from in the MVP?
  S-02 "A shared catalog": a curated seed list, plus household additions with
  a product link. Additions start unverified and stay private to the
  household. Until the merge tooling exists, verification is a manual admin
  task.
- **Resolved.** Is Google sign-in part of Phase 1? No. S-02 "Accounts use
  Firebase from day one": Firebase anonymous sign-in, no sign-in screen in the
  MVP. S-02 "Google sign-in comes first after the MVP": linking is the first
  Next item, ahead of invites.
- Which sensory fields are required on a dial-in shot, and which are optional?
- **Resolved.** Which drink list is canonical? S-02 "Drink types are a starter
  list each household can edit": an editable starter list per household.
  Sugar or syrup is a "sweetened" mark on the shot, not a drink type.
- **Resolved.** Is Fahrenheit display-only? Yes. S-02 "Temperature and
  pressure are optional": exact values are stored in °C (and bar).

---

## INIT-02: Every new bag starts from what you already learned

**Goal:** The daily shot takes one tap and no inputs, and a fresh bag of a
known coffee starts from the recipe that worked last time, instead of a blank
dial-in.

**Success metric:** Brewing the daily standard needs zero variable inputs and
exactly one tap (S-06 target). Share of daily shots recorded through
"Pull This Shot". Number of shots to re-dial a repeat bean (S-01 "fewer
shots"; no numeric target given).

**In scope**
- Pinned recipes scoped to bean, persona, setup and drink context, with the
  grinder and machine units recorded directly (S-02, S-04, S-08).
- Optional batch override for a bag that behaves differently (S-02, S-04).
- Re-pinning adds a row; the latest pin wins; a recipe can point back to the
  shot it came from (S-08).
- Home screen defaults to the pinned recipe for the active persona and
  time-of-day drink context (S-06).
- One-tap "Pull This Shot" that records an extraction, so daily use is visible
  (S-02, S-06).
- Exception-based logging: dial-in or a bad shot opens the extraction UI
  pre-filled with the pinned recipe for a quick micro-adjustment (S-06).

**Out of scope**
- Automatic drift adjustments to the pinned recipe (INIT-04).
- AI-suggested adjustments (INIT-06).
- Palate learning from logged shots (INIT-06).

**Source sections:** S-01, S-02, S-04, S-06, S-08

**Priority:** MVP

**Open questions**
- When a user pins a better recipe during a bag, does it update the bag's
  override or the bean's default? (S-02 still lists this as open.)
- **Resolved.** How is the time-of-day drink decided? S-02 "One-tap shots are
  recorded but marked as unmeasured": in the MVP, the drink that persona last
  made at this time of day. S-02 TQ-07: local days use the device's time zone.
- **Resolved.** What does a one-tap shot record? S-02 "One-tap shots are
  recorded but marked as unmeasured": the pinned recipe's values, marked
  one-tap. No rating is asked; silence is a weak "fine", and an optional good
  or off reaction turns an off shot into a normal pre-filled log. One-tap shots
  count toward coffee used but are never measurements and never reach the
  network.
- **Resolved.** How is the active persona chosen in the MVP? S-02 (one-tap
  shots): the persona selected on the home screen. S-02 "The default persona
  has no stored name": it shows a translated role label until renamed.
- **Resolved.** What happens on "Pull This Shot" with no pinned recipe? S-02
  (one-tap shots): the button becomes "Dial in". On a new setup, Dial in starts
  pre-filled from the closest previous setup's recipe (S-02 "A setup is a fixed
  combination of parts").

---

## INIT-03: Always know what beans you have and how old they are

**Goal:** The household sees what coffee is on the counter and in the freezer,
how old each portion really is, and when it will run out, without manual
bookkeeping.

**Success metric:** Share of portions finished with a recorded finish date.
Run-out prediction error against actual finish dates. Target not given in the
spec.

**In scope**
- Batches as the bag as bought: bean, lot code, roast date, best-before, bag
  weight, purchase date (S-02, S-08).
- Portions as what physically exists: weight, frozen, thawed, opened and
  finished dates. Splitting a bag never duplicates roast date or lot (S-02,
  S-04).
- Shots logged against a portion; batch and bean follow from it (S-02, S-08).
- Bean age from roast date (best-before as fallback), minus time frozen; a shot
  ground from frozen beans is identifiable from the dates (S-02).
- Optional stock checks (weighing what's left) (S-02, S-08).
- Calculated, never stored: remaining weight, bag status, bean age, usage rate
  (S-02).
- Run-out prediction from facts: portion weights including frozen stock, shot
  doses, finish dates, stock checks, purchase dates (S-02).

**Out of scope**
- Bag scanning to fill in batch details (INIT-06).
- Ordering or purchasing beans. Not in the spec.

**Source sections:** S-02, S-04, S-08

**Priority:** MVP

**Open questions**
- Is run-out prediction (and any reorder prompt) part of Phase 1, or only the
  inputs it needs? The MVP definition says "managing the pantry" but doesn't
  say how far.
- **Resolved.** How is bean age computed without a roast date? S-02 "Two
  freshness clocks, both paused by freezing". Time since roasting runs from
  the roast date, or from a packing date (labelled as packed). With only a
  best-before date, Tare invents no age and shows the time left until
  best-before. Time since opening runs per portion. Freezer time counts toward
  neither clock. (Note: this supersedes the "best-before as fallback" wording
  in this initiative's scope.)
- What should the app do with a shot whose portion is already finished, or a
  portion that runs negative against logged doses?

---

## INIT-04: Grind settings stay meaningful through maintenance and time

**Goal:** A user's grind history and pinned recipes stay trustworthy after
burr changes, cleaning, re-zeroing and bean aging, so advice accounts for drift
instead of starting over (a core differentiator, S-01).

**Success metric:** Shots needed to re-dial after a maintenance event. Share of
maintenance events with a confirmed offset. Target not given in the spec.

**In scope**
- Maintenance events on one owned unit (burrs, clean, re-zero, repair,
  other); for a grinder, each event starts a new grind period (S-02, S-04,
  S-08).
- Users can mark a recalibration (S-01).
- Re-dial one coffee after an event; the difference becomes the period's
  offset in grinder units, with bean aging between the two dial-ins
  subtracted first (S-02).
- Offset as an exact shift plus a stretch factor that stays 1 until two or
  more coffees are re-dialed after the same event (S-02).
- Confirmed offsets stored on the event as a stable, editable user decision;
  stored recipes are never rewritten, the mapping is applied when reading
  (S-02, S-08).
- Recent shots weighted more heavily than older ones (S-01).
- Drift adjustments (bean age, batch character, setup maintenance) calculated
  from logged shots, never stored (S-02, S-04).

**Out of scope**
- AI explanations of drift (INIT-06).
- Pressure profile drift. Pressure profiles come later (S-02).

**Source sections:** S-01, S-02, S-04, S-08

**Priority:** Next

**Open questions**
- **Resolved.** Should recording maintenance events ship in the MVP? Yes.
  S-02 "Maintenance events are recorded from Phase 1": logging them ships in
  Phase 1; using them for grind offsets comes later. Recalibration is a flag
  on the event (S-02 TQ-05).
- How strongly should recent shots be weighted, and over what window?
- How is bean-aging drift estimated well enough to subtract it from a
  maintenance offset, and from how many shots?
- How are drift adjustments shown to the user: as a changed suggested grind,
  a note, or both?

---

## INIT-05: Brew for the whole household, each to their own taste

**Goal:** One person can brew for others in the household, each with their own
taste profile and recipes, and those people can later sign in and take over
their own history.

**Success metric:** Share of households with more than one persona. Share of
sub personas later claimed by a login. Target not given in the spec.

**In scope**
- Phase 2: sub personas, profiles without their own login, managed by a
  household member (S-02, S-04).
- Phase 3: invites, so the person behind a sub persona signs in, joins the
  household and claims it as their main persona, keeping its history (S-02,
  S-04, S-08).
- Household membership roles (owner, member) (S-08).
- Shots and recipes keep persona and logging user separate (S-02).
- Consent is personal: a sub persona's data never reaches the network until
  claimed by a user who opts in (S-02, S-07).

**Out of scope**
- The network itself (INIT-06).
- Data model changes: S-02 says only the UI changes between phases; the schema
  is built in INIT-01.

**Source sections:** S-02, S-04, S-07, S-08

**Priority:** Next (phase 2 sub personas), Later (phase 3 invites). The spec
orders the phases but does not say when phase 2 ships relative to other work.

**Open questions**
- Are phases 2 and 3 in the Next bucket together, or is phase 3 Later? (S-02
  only says Google linking is the first Next item, ahead of invites.)
- What can a member do versus an owner?
- What happens to a claimed persona's history and shared pantry if the person
  leaves the household?

---

## INIT-06: Dial in a new bag in fewer shots with AI and the community

**Goal:** Fulfil the vision (S-03): a new bag starts from a recipe matched to
the user's exact hardware and palate, with bag scanning, a Diagnostic Coach and
a consented Cold Start network, so dial-in takes fewer shots.

**Success metric:** Shots to dial in a new bag, compared with users without
these features (target not given). Diagnostic Coach eval pass rate on the
Golden Dataset, where a pass needs safety, accuracy and palate alignment all
at 4 or above (S-09).

**In scope**
- Vision Scanner: extract roaster, name, roast level and tasting notes from a
  bag photo as strict JSON, null when absent (S-09).
- Diagnostic Coach: turn sensory scores, defects, setup and bean aging into
  a hardware adjustment, using the grinder's coarser direction (S-08, S-09).
- RAG grounding the Coach in extraction guides and equipment manuals (S-01).
- Eval harness (`npm run eval`, LLM-as-a-judge) and observability for every AI
  feature (S-01, S-09).
- Palate learning: taste graph derived implicitly from logging, no preference
  surveys (S-01, S-06).
- Cold Start baseline anchored to community shots from the first 7 days after
  a batch is opened (S-05 A).
- Data tiers: private partial logs vs network-eligible shots with the full
  MVPayload; trust weights by contributor level (S-05 B).
- Palate alignment: Match Score Warning and a suggested translation of a Pro
  recipe toward the user's palate (S-05 C).
- Explicit personal opt-in, PII stripped, cohort IDs (S-07).

**Out of scope**
- Anything in Phase 1 (S-01: no AI features yet).

**Source sections:** S-01, S-03, S-05, S-07, S-09

**Priority:** Later

**Open questions**
- This initiative is large. Should it be split (for example coaching and
  scanning versus the Cold Start network) when it comes up for planning?
- Is palate learning a Later AI feature, or should a simple non-AI taste
  profile ship earlier, given it is named a core differentiator (S-01)?
- How is a contributor's level (Enthusiast vs Verified Pro) determined? The
  schema has no field for it.
- What are cohort IDs grouped by?
- S-09 names specific models (Gemini Flash, Gemini Pro). Are these fixed
  choices or placeholders?
- Where does the Golden Dataset come from, and who maintains it?
- How does a user withdraw consent or delete their data (GDPR), and what
  happens to shots already shared?

---

## Section coverage

| Section | Initiatives |
|---|---|
| S-01 Updates | INIT-01, INIT-02, INIT-04, INIT-06 |
| S-02 Data model decisions | INIT-01, INIT-02, INIT-03, INIT-04, INIT-05 |
| S-03 North Star Vision & UVP | INIT-06 (and the framing of all initiatives) |
| S-04 Core Product Architecture & Ontology | INIT-01, INIT-02, INIT-03, INIT-04, INIT-05 |
| S-05 Algorithmic Intelligence & Data Trust | INIT-06 |
| S-06 UX/UI Philosophy | INIT-01, INIT-02, INIT-06 |
| S-07 Privacy, GDPR & Localization | INIT-01 (localization), INIT-05, INIT-06 (consent, decoupling) |
| S-08 Database Schema | INIT-01, INIT-02, INIT-03, INIT-04, INIT-05 |
| S-09 Core GenAI System Prompts | INIT-06 |

## Unmapped sections

None. Every section S-01 to S-09 maps to at least one initiative.

## Cross-cutting open questions

- **Resolved.** Timestamp precision: integer milliseconds (`timestamp_ms`),
  like shot time. S-02 TQ-04.
- **Success targets:** the spec gives the goal "fewer shots" but no baseline or
  target. What number should the MVP and later phases aim for?
- **Network eligibility in Phase 1:** should `is_network_eligible` be computed
  and stored from day one (so history is ready when the network ships), or
  left false until then? (S-02 settles only that one-tap shots never reach the
  network.)
