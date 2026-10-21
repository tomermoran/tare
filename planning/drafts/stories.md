# Tare user stories (revision 4)

Source: `planning/drafts/epics.md` (final, revision 10, 31 epics),
`planning/drafts/design.md` (approved after round 3, with rounds 4 to 6
applied), `planning/drafts/review.md` (the plan review) and `docs/spec.md`,
sections S-01 to S-09. S-01 and S-02 override older sections where they
differ. `planning/drafts/initiatives.md` was read for context.

**Status: revision 4, for the Head of Product's approval.** Revision 2 was
the last approved version. Revision 3 was a draft that was never approved, so
this revision folds it in, and the changes below are listed against revision
2. Where the documents differed, the design was the tiebreaker. No GitHub
issues have been created.

## Changes since revision 2

Revision 2 had 119 stories. Revision 4 has 138:

- 23 added;
- 4 retired;
- 75 updated;
- 40 unchanged.

Retired IDs are never reused. Each story's Notes begin with "New", "Updated",
"Lightly updated" or "Unchanged", relative to revision 2.

### What drove the changes

From revision 3 (the plan review and the Head of Product's decisions on it):

1. **"Setup" replaces "kit" and "toolkit".** A setup is a fixed combination of
   machine, grinder and basket, each part an exact catalog model (S-02, S-04,
   S-08).
   - Any change of parts means a different setup, and the same combination
     reuses its setup and recipes.
   - Recipes belong to one setup. There is no setup editing and no retire.
   - The current setup is the one from the persona's last shot (DQ-18), and
     it can be switched on Brew and in the shot log (PEC-09).
2. **Puck prep:** WDT and puck screen are checkboxes on shots and recipes,
   copied by one-tap pulls.
3. **Two freshness clocks, both paused by freezing** (since roasting, since
   opening). This resolves review blocker B1.
4. **"Open" excludes frozen portions** (review M5). The iOS storage-eviction
   risk is accepted (review M6).
5. **Review findings owned here:** M1, M2, M4, m1, m2, m6, m7, m8 and m10.

New in revision 4 (epics revisions 9 and 10, design rounds 5 and 6):

6. **Taste relative to the persona** (EPIC-01-05, S-02).
   - Four "just right" questions on a -2..2 scale: balance, strength ("lost in
     the milk" for milk drinks), body, and one-sided sweetness.
   - Six observation tags.
   - These replace the 1-5 scores and the defect list. The overall rating and
     the good/off reaction stay, and "all just right" is one tap.
   - On a one-tap shot, "off" opens the SH-OFF sheet, and its answers are
     stored on the one-tap shot (DQ-23). This settles SQ-17 and review M1.
7. **Rule-based dial-in suggestions** (EPIC-02-03, now M).
   - One change per shot, with its reason, pre-filled into the next dial-in,
     and dismissable.
   - Levers in order: puck prep, grind, yield, dose (within the basket's dose
     range), temperature, milk amount.
   - Freshness and shot time are explanations, not levers. The rules are
     tested with scenario tests, not an LLM.
8. **Milk.**
   - A household starter milk list and a typical milk amount per drink.
   - Milk type and amount on shots and recipes, copied by one-tap pulls.
   - Milk isn't part of a recipe's identity. Editing the milk list is Next
     (EPIC-02-05).
9. **Basket dose range** in the catalog and for baskets a household adds.
10. **Journal** (EPIC-02-06, "Look back in your journal", now M).
    - The tab is renamed; entries are still "shots".
    - Drink, coffee and setup filters (setup only when there are several),
      pre-filtered from Brew, with "All" to clear and a filtered empty state.
    - "Dial in from this" on shot detail.
11. **Beans** replaces "pantry" in all wording. On hand groups bags as open,
    unopened and frozen.
12. **New MVP epic EPIC-03-06 "See every coffee you've tried"** (the Tried
    list and the coffee screen). Beans filters are Next (EPIC-03-05).
13. **Later:** palate learning is per persona, drink style and milk, and the
    community learns only from similar palates (EPIC-06-04, 06-05, 06-06).

### Added (23)

| ID | Title | Why |
|---|---|---|
| STORY-01-01-08 | Get a starter milk list | Starter milks (S-02, S-08) |
| STORY-01-02-08 | Change a part and get the right setup | Fixed setups (S-02) |
| STORY-01-02-09 | See my setups and know which one is current | DQ-18, DQ-21 |
| STORY-01-03-06 | Record whether I used WDT or a puck screen | Puck prep (S-02) |
| STORY-01-03-07 | Record the milk in a milk drink | Milk (S-02, DQ-26) |
| STORY-02-01-06 | Dial in on a new setup from my closest setup's recipe | DQ-19, DQ-20 |
| STORY-02-02-07 | Switch setup on Brew and in the shot log | PEC-09 |
| STORY-02-03-04 | Say what was off about a one-tap shot | SH-OFF (DQ-23) |
| STORY-02-03-05 | See one suggested change, with its reason | Suggestions (S-02) |
| STORY-02-03-06 | Get the right change for what was off | Suggestion rules (S-02) |
| STORY-02-03-07 | Try the suggested change, or dismiss it | Pre-fill, dismiss (DQ-25) |
| STORY-02-05-05 | Make the milk list mine (Next) | EPIC-02-05 milk list |
| STORY-02-05-06 | Set how much milk a drink usually gets (Next) | EPIC-02-05 typical amount |
| STORY-02-06-04 | Filter my journal by drink, coffee and setup | Journal filters (S-02) |
| STORY-02-06-05 | Open the journal on what I'm brewing | Default pre-filter (S-02) |
| STORY-02-06-06 | Dial in from a past shot | "Dial in from this" |
| STORY-03-02-05 | See what's on hand grouped by state | On hand groups (S-02) |
| STORY-03-03-04 | See how long each portion has been open | Since-opening clock (S-02) |
| STORY-03-05-04 | Narrow Beans by roaster, roast level, origin or rating (Next) | Beans filters (S-02) |
| STORY-03-06-01 | See every coffee I've tried | Tried (S-02, DQ-27) |
| STORY-03-06-02 | See how a coffee's shots went, in words | Tried summary (DQ-28) |
| STORY-03-06-03 | Open a coffee's own screen | SCR-COFFEE |
| STORY-03-06-04 | Add a bag of a coffee I've tried | "Add a bag of this" |

### Retired (4)

| ID | Title | Why |
|---|---|---|
| STORY-01-02-03 | Retire a unit and keep its history | No retire in the MVP (S-02); setups never change, so past shots keep their parts. |
| STORY-01-02-06 | Edit a setup | Setups are never edited (S-02); see STORY-01-02-08. |
| STORY-01-02-07 | Be warned before swapping a setup's machine or grinder | No swaps exist; PEC-07 is superseded. |
| STORY-02-01-05 | Re-dial a recipe whose kit left its toolkit | Replaced by STORY-02-01-06. Review M3 no longer applies. |

### Updated (75)

Story numbers only; each story's Notes say what changed.

- **EPIC-01-01:** 01, 02, 03, 04, 05, 06, 07.
- **EPIC-01-02:** 01, 02, 04, 05.
- **EPIC-01-03:** 01, 02, 03, 04.
- **EPIC-01-04:** 01, 02.
- **EPIC-01-05:** 01, 02, 03, 04. Rewritten for "just right" tasting.
- **EPIC-01-06:** 01, 03, 06, 08, 09. Includes the basket dose range.
- **EPIC-02-01:** 01, 02, 04. Includes milk on recipes.
- **EPIC-02-02:** 01, 02, 03, 05, 06.
- **EPIC-02-03:** 01, 02, 03. The off path and suggestions.
- **EPIC-02-04:** 01. **EPIC-02-05:** 03.
- **EPIC-02-06:** 01, 02, 03.
- **EPIC-03-01:** 02, 04. **EPIC-03-02:** 02, 03, 04.
- **EPIC-03-03:** 01, 02, 03. **EPIC-03-04:** 03. **EPIC-03-05:** 01, 02.
- **EPIC-04-01:** 01, 02, 03, 04. **EPIC-04-02:** 01, 03, 05, 06.
- **EPIC-04-03:** 01, 03. **EPIC-05-01:** 02, 03, 04. **EPIC-05-03:** 01, 02.
- **Later:** 05-02-02, 06-02-01, 06-04-01, 06-04-02, 06-05-02, 06-06-01 and
  06-06-02.

Every Later story also gains source sections (review m2), and the 5 eval
stories are marked as enabler placeholders. These are format changes and
aren't counted as updates.

### Review findings handled here

| Finding | How |
|---|---|
| B1 | STORY-03-03-01: no estimated age; best-before shows time left (S-02). |
| M1 | One-tap shots carry a reaction and, when off, "just right" answers and tags, never a rating (DQ-23): STORY-02-03-04, 02-06-02, 02-06-03. |
| M2 | STORY-01-05-01: leaving saves; a failed save offers retry or leave without saving. |
| M3 | No longer applies (no retire). |
| M4 | Portion-date criteria say "when a portion's dates are set" (STORY-03-02-02 to 04, 03-03-03, 03-04-03). |
| M5 | "Open" excludes frozen throughout (STORY-02-02-01 to 03, 03-02-04, 03-02-05, 03-04-03). |
| M6 | STORY-01-01-01 and 01-01-03 note the accepted eviction risk. |
| m1 | X-1, INIT-01 Q3, INIT-01 Q5, INIT-03 Q2, DQ-08 and the recalibration question are marked closed. |
| m2 | Every Later story has source sections. |
| m6 | STORY-02-03-03 criteria 4 and 5. |
| m7 | STORY-02-04-01 and 02-02-06 made testable; STORY-05-01-02 and 05-02-02 explicit placeholders; eval stories marked as enabler placeholders. |
| m8 | STORY-01-01-05's "reopen on the last tab" criterion is cut; see "Not covered". |
| m10 | Recipe resolution is owned by STORY-02-01-01 everywhere. |

### Questions

- **Closed:** SQ-02 (no retire), SQ-17 (DQ-23 and epics revision 9), and X-1
  (TQ-04).
- **New:**
  - SQ-18: prep and drift, for EPIC-04-02.
  - SQ-19: suggestion step sizes.
  - SQ-20: no designed flow for a basket's dose range.
  - SQ-21: the temperature lever's trigger.
- **Still open:** SQ-04, 05, 09, 11, 12, 13, 14, 15 and 16.

## How to read this file

- **IDs:** `STORY-II-EE-SS` (initiative, epic, story). Parent is the epic ID.
  IDs stay stable; a retired ID is never reused, so gaps in numbering are
  retired stories.
- **Grouping:** by initiative, then by epic in ID order, whatever the
  priority. The priority is on every story and in the summary.
- **Personas:** stories are written for the spec's user type, the everyday
  home enthusiast (S-01), shortened to "home enthusiast". Where the household
  matters, they use the S-04 roles: household member, main persona, sub
  persona. No real people are named.
- **Words** (S-02):
  - **The four sections:** Brew (what am I making?), Journal (what did I
    make?), Beans (what do I have?) and Setup (what am I making it with?).
    Entries in the Journal are "shots".
  - **Setup and parts:** a "setup" is the machine, grinder and basket; each is
    a "part", named by maker and model.
  - **Open:** opened, not finished and not in the freezer.
  - **"Just right" answers:** taste rated against the persona's own ideal.
- **Sizes:** rough points (1, 2, 3, 5, 8). Anything at 8 is flagged.
- **Design references:** criteria describe behaviour. Notes cite the design's
  screens (`SCR-*`), sheets (`SH-*`) and assumptions (`DQ-*`), which are the
  working assumptions until the Head of Product says otherwise.
- **Open questions:** questions carried in `epics.md` and `initiatives.md` are
  referenced by ID (`INIT-NN Q#`, `X-2`, `X-3`) or as "EPIC-NN-NN open
  question: topic". Story questions are `SQ-NN`, listed at the end.
- **Cross-cutting constraints** from `epics.md` apply to every story and
  aren't repeated in each one:
  - localization and Japandi design;
  - values calculated, never stored (clocks, remaining coffee, suggestions,
    Tried);
  - timestamps in milliseconds, local days in the device's time zone;
  - no AI in Phase 1 (suggestions are rules);
  - catalog merge pointers;
  - setups never change, and milk is never part of a recipe's identity.

  The design's foundations (section 1) apply too.
- **Detail level:** MVP and Next epics have full stories with Given/When/Then
  criteria. **Later epics have lighter stories** (statement, source sections,
  priority, size and two or three brief criteria). They'll be re-planned
  before they're built.

## Summary

| Epic | Title | Priority | Stories | Points |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | MVP | 8 | 20 |
| EPIC-01-02 | Describe your setup once | MVP | 6 | 17 |
| EPIC-01-03 | Log a shot in seconds | MVP | 7 | 19 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | MVP | 2 | 6 |
| EPIC-01-05 | Say how it tasted | MVP | 4 | 9 |
| EPIC-01-06 | Add what's missing from the catalog | MVP | 9 | 26 |
| EPIC-02-01 | Pin the recipe that worked | MVP | 5 | 16 |
| EPIC-02-02 | Pull your daily shot in one tap | MVP | 7 | 21 |
| EPIC-02-03 | Fix a bad shot from your recipe | MVP | 7 | 21 |
| EPIC-02-04 | Give one bag its own recipe | Next | 2 | 5 |
| EPIC-02-05 | Make the drink and milk lists yours | Next | 6 | 11 |
| EPIC-02-06 | Look back in your journal | MVP | 6 | 16 |
| EPIC-03-01 | Add a bag of beans | MVP | 4 | 10 |
| EPIC-03-02 | Split and freeze a bag | MVP | 5 | 13 |
| EPIC-03-03 | Know how fresh your beans really are | MVP | 4 | 10 |
| EPIC-03-04 | See how much coffee is left | MVP | 3 | 7 |
| EPIC-03-05 | Know when you'll run out, and find any coffee | Next | 4 | 11 |
| EPIC-03-06 | See every coffee you've tried | MVP | 4 | 9 |
| EPIC-04-01 | Record maintenance on your equipment | MVP | 4 | 8 |
| EPIC-04-02 | Suggested grind that follows bean age and recent shots | Next | 6 | 21 |
| EPIC-04-03 | Re-dial once after maintenance and keep every recipe | Next | 3 | 11 |
| EPIC-04-04 | Keep recipes right after new burrs of a different design | Next | 2 | 5 |
| EPIC-05-01 | Brew for someone else in the household | Next | 4 | 10 |
| EPIC-05-02 | Invite them to take over their own profile | Later | 4 | 15 |
| EPIC-05-03 | Keep your coffee history when you change phones | Next | 3 | 7 |
| EPIC-06-01 | Scan a bag instead of typing it | Later | 3 | 11 |
| EPIC-06-02 | Get a grounded fix when a shot goes wrong | Later | 3 | 18 |
| EPIC-06-04 | Tare learns your palate as you log | Later | 3 | 11 |
| EPIC-06-05 | Share your shots, with your consent | Later | 3 | 8 |
| EPIC-06-06 | Start a new bag from the community, tuned to you | Later | 4 | 16 |
| EPIC-06-07 | Merge duplicate catalog entries, with AI suggestions | Later | 3 | 13 |

| Priority | Epics | Stories | Points | Revision 2 |
|---|---|---|---|---|
| MVP | 16 | 85 | 228 | 69 stories, 177 points |
| Next | 8 | 30 | 81 | 27 stories, 74 points |
| Later | 7 | 23 | 92 | unchanged |
| **Total** | **31** | **138** | **401** | 119 stories, 343 points |

**Where the MVP's 51 extra points come from:**

- Revision 3 setups, prep, clocks and frozen-portion work: net +13.
  - Retired: −9.
  - Added: change a part, current setup, prep, closest-setup dial-in, setup
    switching, the opened clock (+19).
  - Resized: +3.
- Revision 4: +38.
  - Suggestions and the SH-OFF path: +13 (EPIC-02-03, from 8 to 21).
  - Journal filters, its default and "Dial in from this": +8.
  - The new Tried epic: +9.
  - Milk: +5.
  - On hand groups: +2.
  - The "just right" questions: +1.

Later points are rough placeholders. Review m9 already flagged the MVP's
size; the Head of Product has since confirmed the MVP must be a fully usable
logging tool (epics revision 10). Cut levers are under "Stories to split or
cut".

---

## INIT-01: Log a shot against your real setup in seconds

### EPIC-01-01: Start brewing without setting anything up

#### STORY-01-01-01: Open the app and start, with no sign-in

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want to open Tare for the first time and
  start straight away, without a sign-in screen, so that I can log my first
  shot without any setup.
- **Acceptance criteria**
  1. Given I have never opened Tare on this device, when I open it, then I
     reach the app without being asked to sign in, give consent or answer
     preference questions.
  2. Given I open Tare for the first time, when it starts, then an account,
     one household with me as its owner, and one main persona for me are
     created without my input.
  3. Given setup is taking longer than usual, when I wait, then I'm told it's
     still setting up.
  4. Given my first launch can't create an account (for example, no
     connection), when I open the app, then I'm told it couldn't start and can
     try again, and no partial household is left behind.
  5. Given I have used Tare on this device, when I close and reopen it, then
     I'm in the same account and household, with everything I added before.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (X-1 closed, TQ-04). Design SCR-START. Firebase anonymous
  sign-in per device (S-02). Accepted risks (S-02): a lost or reset device,
  or Safari clearing a site's storage, loses the data until EPIC-05-03.

#### STORY-01-01-02: Get a starter drink list in my language

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my household to start with a list of
  common drinks, each knowing whether it has milk and how much, so that I can
  pick what I'm making without setting anything up.
- **Acceptance criteria**
  1. Given a new household is created, when I look at my drinks, then I see
     Espresso, Ristretto, Lungo, Americano, Cortado, Flat white, Cappuccino,
     Latte and Macchiato.
  2. Given the app is in a supported language other than English, when I see
     the starter drinks, then their names are shown in that language, and
     changing language later changes them without losing or duplicating any.
  3. Given a starter drink with milk (for example a flat white), when I log it,
     then it's treated as a milk drink with a typical milk amount; a drink
     without milk (for example an espresso) has no milk at all.
  4. Given two households, when one is created, then it gets its own copy of
     the list, separate from any other household's.
- **Source sections:** S-02, S-04, S-08, S-07
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (whether a drink has milk, and its typical amount, S-08).
  The typical amount per starter drink isn't in the spec (EPIC-01-01 open
  question; S-02 gives ratios: a cortado about 1:1, a latte 1:3 or more).
  Editing the list is EPIC-02-05 (Next).

#### STORY-01-01-03: See and rename my profile

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my profile to show a simple label
  until I choose a name, and to tell me where my history is kept, so that I
  don't have to give personal details to start and I know what to expect.
- **Acceptance criteria**
  1. Given I haven't named my profile, when I see it anywhere a name would
     appear, then it shows a translated role label (for example "Me" in
     English).
  2. Given my profile shows the role label, when I change the app's language,
     then the label is shown in the new language.
  3. Given I rename my profile, when I see it anywhere in the app, then it
     shows my chosen name in every language.
  4. Given I've renamed my profile, when I clear the name and save, then it
     goes back to the translated role label.
  5. Given I open my profile, when I read it, then I'm told calmly that my
     history lives with this device's account for now, and I can see the
     app's name and version.
  6. Given saving my name fails, when I look, then my typed name is kept and I
     can try again.
- **Source sections:** S-02, S-04, S-08, S-07
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (review M6). Design SCR-PROFILE. Criterion 5 is how the
  accepted risks show (S-02), without alarm; EPIC-05-03 replaces it with the
  linked state. The epic includes a minimal rename (EPIC-01-01 open question).

#### STORY-01-01-04: Keep my kitchen private to my household

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my equipment, setups, beans, recipes
  and shots to belong to my household only, so that no one else sees or
  changes them.
- **Acceptance criteria**
  1. Given I add anything (a part, a setup, a bag, a recipe, a shot), when
     it's saved, then it belongs to my household.
  2. Given another household exists, when its user browses Tare, then they
     can't see or change anything that belongs to my household.
  3. Given I use Tare, when I browse my setups, beans, recipes or Journal, then
     I only see my household's records, plus shared catalog entries.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (wording). Catalog visibility is STORY-01-06-03.

#### STORY-01-01-05: Move around the app

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want to reach Brew, Journal, Beans and
  Setup from anywhere, and to be brought back where I was after a side task,
  so that I never get lost at the machine.
- **Acceptance criteria**
  1. Given I'm on any main screen, when I choose Brew, Journal, Beans or Setup,
     then I go straight there.
  2. Given a main screen whose feature isn't built yet, when I open it, then I
     see a short explanation, never a blank screen or an action that does
     nothing.
  3. Given I'm in a task (logging a shot, adding a bag, adding a part,
     choosing a setup), when I leave it with unsaved changes, then I'm asked
     once whether to discard them; with no changes I leave at once.
  4. Given I start adding something from inside another task (for example a
     bag from the shot log), when I finish, then I return to that task with
     the new item chosen and nothing I'd entered lost.
- **Source sections:** S-02, S-06, S-01
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (the four section names, S-02; revision 2's "reopen on the
  last screen" criterion cut, review m8, see "Not covered"). Design 2.1. The
  shell is the frame only.

#### STORY-01-01-06: See the same loading, empty and error behaviour everywhere

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want every screen to behave the same way
  while loading, when empty and when something fails, so that I always know
  what's happening and what to do next.
- **Acceptance criteria**
  1. Given a screen is loading its data, when I look at it, then I see a
     placeholder of its shape, not a blank screen.
  2. Given a list has nothing in it yet, when I see it, then I get one sentence
     saying so and at most one action to fix it, and that action is the only
     main action on the screen.
  3. Given loading or saving fails, when I look, then I'm told what failed and
     can try again, and anything I typed is kept.
  4. Given any failure or empty state, when I see it, then it never uses the
     shot-warning colour.
- **Source sections:** S-01, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (criterion 2, review m4). Design 1.2, NC-10 to
  NC-12.

#### STORY-01-01-07: Get started with a short checklist

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want Brew to show me the few steps to my
  first shot, so that setup feels short and I always know what's next.
- **Acceptance criteria**
  1. Given nothing is set up, when I open Brew, then I see three steps: add my
     machine, grinder and basket; add a bag of beans; pull my first shot.
  2. Given I start the first step, when I add my parts, then I'm walked
     through machine, grinder and basket in one pass.
  3. Given I've done a step, when I return, then it's marked done and the next
     step is the one offered.
  4. Given I've added a machine, a grinder and a basket but have no setup,
     when I see the first step, then it offers to make them my setup
     (STORY-01-02-05).
  5. Given every step is done, when I open Brew, then the checklist is gone
     and my daily shot shows instead.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (basket required; Beans wording). Design 2.3 and
  DES-02-02-04. Ownership is SQ-16.

#### STORY-01-01-08: Get a starter milk list

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my household to start with the milks
  people commonly use, so that I can say which milk went into a drink without
  setting anything up.
- **Acceptance criteria**
  1. Given a new household is created, when I choose a milk, then I see whole,
     semi-skimmed, skimmed, oat, soy, almond and lactose-free.
  2. Given the app is in another supported language, when I see the milks, then
     their names are in that language and follow a language change.
  3. Given two households, when one is created, then it gets its own copy of
     the milk list.
  4. Given the milk list, when I look for brands, then there are none: milks are
     kinds, not products.
- **Source sections:** S-02, S-08, S-07
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (S-02 milk). Editing the list ("Oat (barista)") is Next
  (STORY-02-05-05).

**Coverage:** all In items covered, including the shell with the four
sections (PEC-01, S-02) and the starter drink and milk lists.

### EPIC-01-02: Describe your setup once

Retired: STORY-01-02-03 (retire), STORY-01-02-06 (edit a setup), STORY-01-02-07
(swap warning).

#### STORY-01-02-01: Find my machine, grinder and basket in the catalog

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to find the exact machine, grinder
  and basket I own by maker and model, so that Tare knows exactly what my
  setup can do.
- **Acceptance criteria**
  1. Given I'm adding a machine, a grinder or a basket, when I search, then
     matching models of that kind are listed with their maker, so one search
     usually finds the model.
  2. Given I haven't searched, when I browse, then I see makers in
     alphabetical order and can open one to see its models of that kind.
  3. Given I'm choosing a basket and my household has a machine, when I
     haven't searched, then the baskets made by my machine's maker are listed
     first.
  4. Given two baskets of the same size from different makers, when I see
     them, then each is shown by its maker and model, never by size alone.
  5. Given a model is sold under a regional name, when I search by that alias,
     then the model is found.
  6. Given a merged entry or one my household added, when I search, then I only
     see the surviving entry, my own unverified entries are marked as added by
     us, and other households' unverified entries never appear; and I can
     always choose to add a model I can't find (STORY-01-06-01).
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (exact models, three kinds, stock baskets first). Design
  SCR-CATALOG-PICK. DQ-22 is the working assumption: the seed includes each
  machine maker's stock baskets, with dose ranges (EPIC-01-02 open question:
  who curates the seed).

#### STORY-01-02-02: Add the parts I own

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to add the machine, grinder and
  basket I own, with an optional nickname and the date I got each one, so
  that my shots and maintenance belong to my actual equipment.
- **Acceptance criteria**
  1. Given I've picked a model, when I add it, then it appears among my parts,
     shown by maker and model and grouped with my other parts of that kind
     (machine, grinder or basket). No other kind of part can be added.
  2. Given I add a part, when I give it a nickname or acquired date, then they
     are saved with it; when I give neither, it still saves.
  3. Given I've picked a machine or grinder, when I review it, then I can see
     what it can control (for example exact temperature and its range); given
     a basket, I can see the dose range it's made for (for example 16 to 20 g).
  4. Given I own two of the same model, when I add both, then they are two
     separate parts, each with its own history.
  5. Given a part, when I open it, then I see which of my setups it's in.
  6. Given I have no parts yet, when I open Setup, then I'm offered to add my
     machine.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (three kinds; the basket's dose range, S-08; the setups a
  part is in). Design SCR-UNIT-ADD, SCR-KIT, SCR-UNIT. There's no retire.
  Adding a part never changes a setup by itself (STORY-01-02-08).

#### STORY-01-02-04: Put my machine, grinder and basket together as a setup

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to say which machine, grinder and
  basket I'm using and have Tare find or make the matching setup, so that I
  pick one setup when brewing instead of each part.
- **Acceptance criteria**
  1. Given I'm choosing parts for a setup, when I choose them, then I pick
     exactly one machine, one grinder and one basket from my parts, and I can
     add a missing part without losing my other choices.
  2. Given my choice, before I confirm, when I look, then I'm told whether
     it's one of my existing setups (by its name, with how many recipes it
     has) or a new one.
  3. Given the combination matches an existing setup, when I confirm, then
     that setup is used, with its recipes, and no duplicate is made.
  4. Given it's a new combination, when I confirm, then a new setup is made; I
     can give it a name, and without one it's shown by its parts.
  5. Given one of the three parts is missing, when I confirm, then I'm told
     which one, and nothing is saved.
  6. Given I confirm, when I return, then that setup is my current setup.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (rewritten for fixed setups). Design SCR-TOOLKIT (the
  setup builder). Setups are matched by their exact set of parts (S-08).
  DQ-22: the basket is required.

#### STORY-01-02-05: Make my first setup in one tap

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want Tare to offer to make my first setup
  as soon as I've added a machine, a grinder and a basket, so that my first
  shot isn't held up by a form.
- **Acceptance criteria**
  1. Given my household has exactly one machine, one grinder and one basket
     and no setup, when I accept the offer, then a setup of those three is made
     without my typing anything, shown by its parts, and it becomes current.
  2. Given my household has more than one part of any kind and no setup, when
     I accept the offer, then I go to choosing parts with the most recently
     added part of each kind already chosen.
  3. Given I've just added the last of the three required parts, when I save
     it, then I'm offered the setup straight away.
  4. Given the offer, when I look at it, then it names the three parts it will
     use, by maker and model.
  5. Given any setup exists, when I look at Setup or the checklist, then the
     offer is gone.
- **Source sections:** S-02, S-04, S-08, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (three parts; no default name, so DQ-01 is closed by
  S-08). Design EPIC-01-02 step 7.

#### STORY-01-02-08: Change a part and get the right setup

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to say I've changed one part, such as
  a new basket, and have Tare switch to the right setup, so that my recipes
  always match what's on my counter.
- **Acceptance criteria**
  1. Given a setup, when I choose to change a part, then I start from that
     setup's three parts and only change the one that changed.
  2. Given the new combination matches a setup I've used before, when I
     confirm, then that setup comes back with its recipes, and no new setup is
     made.
  3. Given the new combination is new, when I confirm, then a new setup is
     made and becomes current, and my previous setup is kept with its recipes.
  4. Given I changed a part, when I look at shots pulled before, then they
     still show the setup and parts they were pulled with.
  5. Given I've just added a new part and already have a setup, when I save
     the part, then I'm asked whether to use it in my setup; yes starts from my
     current setup with the new part in place of the old one, and no changes
     nothing.
  6. Given I want to change a setup's parts in place, when I look for a way to,
     then none is offered.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. Design SCR-TOOLKIT, SCR-UNIT-ADD step 6, SCR-KIT. Servicing
  a part is maintenance, never a new setup (STORY-04-01-01). The same change
  from Brew or the shot log is STORY-02-02-07.

#### STORY-01-02-09: See my setups and know which one is current

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to see my setups with the one I'm
  using now marked, and to switch or name them, so that I always know which
  setup my shots are recorded against.
- **Acceptance criteria**
  1. Given I've logged shots, when I look at my setups, then the current setup
     is the one my last shot (measured or one-tap) was pulled with, shown first
     and marked as current.
  2. Given I haven't logged a shot yet, when I look, then my newest setup is
     current.
  3. Given another setup, when I choose to use it, then it becomes current at
     once, without waiting for a shot.
  4. Given my setups, when I look at them, then each shows its name (or its
     parts), its three parts by maker and model, how many recipes it has and
     when it was last used; setups unused for 90 days are grouped out of the
     way.
  5. Given a setup, when I name or rename it, then only its name changes: it's
     the same setup with the same recipes.
  6. Given two setups share a machine and grinder, when either is shown by its
     parts, then its basket is named too.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. DQ-18 and DQ-21 are the working assumptions. Design SCR-KIT.

**Coverage:** all In items covered, including the basket's dose range.
Selects on Brew and in the log are STORY-02-02-07. Out by S-02: editing a
setup, retire, untracked tools. Not covered: deleting a setup.

### EPIC-01-03: Log a shot in seconds

#### STORY-01-03-01: Start a shot with what I'm brewing already chosen

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want the shot log to open with my setup,
  drink and coffee already chosen, and to change them if I need to, so that
  most shots need no choices before the numbers.
- **Acceptance criteria**
  1. Given I open the shot log, when it opens, then the setup is my current
     setup, and the drink and coffee are the ones on Brew.
  2. Given I want a different drink or coffee, when I change it, then I can
     choose from my household's visible drinks and my unfinished portions,
     each named by its coffee with its bag, state and how long it's been open.
  3. Given I have unopened portions, when I choose the coffee, then they're
     offered; frozen portions are offered last and marked as frozen.
  4. Given I pick a frozen portion, when I save the shot, then it's recorded as
     ground from frozen, and none of the portion's dates change.
  5. Given I have no setup or no unfinished portion, when I open the shot
     log, then I'm told what's missing and can add it, and I come back with it
     chosen and any values I'd set kept.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (current setup; frozen portions). Design SCR-LOG context.
  DQ-18 and DQ-06 (round 3) are the working assumptions. Changing the setup
  here is STORY-02-02-07.

#### STORY-01-03-02: Set grind, dose, yield and time by touch

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to set grind, dose, yield and time
  with large touch controls, so that I can log a shot at the machine without
  typing.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I look at it, then I see all four values at
     once and can change any one of them by dragging, with no text keyboard
     unless I choose to type a number.
  2. Given a blank log, when it opens, then the values start from my last
     measured shot on this setup, or from neutral defaults if there isn't
     one.
  3. Given my setup's grinder is stepped, when I set grind, then I can only
     choose values on its steps, within its range; given it's stepless, any
     value in its range at its finest increment.
  4. Given my grinder's coarser direction is known, when I set grind, then I can
     see which way is finer and which is coarser.
  5. Given I change dose or yield, when I look, then the ratio updates at once.
  6. Given I set the time, when I see it, then it's shown in seconds with one
     decimal (for example 27.6 s).
- **Source sections:** S-06, S-08, S-02
- **Priority:** MVP
- **Size:** 5
- **Notes:** Updated (the setup's grinder). Design ShotDial (NC-09). DQ-07 for
  defaults. When the coarser direction is "not sure", none is shown
  (STORY-01-06-08).

#### STORY-01-03-03: Save the shot as I measured it

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to save a shot with its values and
  setup, so that my Journal shows exactly what I pulled, even after I change
  parts.
- **Acceptance criteria**
  1. Given my context and values are set, when I save, then the shot is saved
     as measured, with its setup, drink, portion, my persona as whose taste it
     records and me as who logged it.
  2. Given I saved a shot, when I look at it later, after changing to another
     setup, then it still shows the setup and the machine, grinder and basket
     it was pulled with.
  3. Given I saved a shot, when it's saved, then I'm offered to say how it
     tasted, and the shot is already safe if I skip that.
  4. Given saving fails, when I look, then I stay on the log with my values
     kept and can try again; no shot is saved.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (shots record their setup only, S-08). Tasting is
  EPIC-01-05. Network eligibility isn't computed here (X-3).

#### STORY-01-03-04: Mark a shot as sweetened

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to mark a drink as sweetened, so
  that my Journal knows when sugar or syrup was added.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I mark it sweetened, then the saved shot
     records that it was sweetened.
  2. Given I start a shot, when the log opens, then sweetened starts off, and
     if I leave it off the shot records it as not sweetened.
  3. Given any drink type, when I log it, then I can mark it sweetened.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 1
- **Notes:** Lightly updated (criterion 2: always starts off, per the design).

#### STORY-01-03-05: Enter and read numbers in my local format

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want numbers shown in my region's format,
  so that 18,5 g or 18.5 g reads naturally to me.
- **Acceptance criteria**
  1. Given my locale uses a decimal comma, when I set or read dose, yield or
     time, then decimals are shown with a comma.
  2. Given my locale uses a decimal point, when I do the same, then decimals
     are shown with a point.
  3. Given I log a shot in one locale, when I view it in another, then the
     values are the same, shown in the new locale's format.
- **Source sections:** S-07
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged.

#### STORY-01-03-06: Record whether I used WDT or a puck screen

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to tick whether I used a WDT tool
  and a puck screen on a shot, so that my Journal shows how I prepped the puck
  without making prep part of my setup.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I look, then I can tick "WDT" and "puck
     screen" separately, each in one tap, and the saved shot records both.
  2. Given the log starts from a recipe (dial in, fix, or entering a recipe),
     when it opens, then the two ticks start as the recipe has them.
  3. Given a blank log, when it opens, then the two ticks start as on my last
     shot on this setup, or both off if I have none.
  4. Given I change the setup before I've touched a tick, when the setup
     changes, then that tick follows the rule above for the new setup; a tick I
     already changed keeps my choice.
  5. Given I tick or untick WDT or puck screen, when I save, then my setup is
     the same setup as before.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (S-02 puck prep). Design SCR-LOG step 4. Which tool,
  portafilter and tamper aren't tracked. Editing starts from the shot's own
  ticks (STORY-02-06-02).

#### STORY-01-03-07: Record the milk in a milk drink

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to record which milk and how much
  went into a milk drink, so that my Journal shows the drink I actually made.
- **Acceptance criteria**
  1. Given I'm logging a drink with milk, when I look, then I can choose the
     milk from my household's milks and set the amount in millilitres by
     dragging, without a keyboard.
  2. Given I'm logging a drink without milk (for example an espresso), when I
     look, then no milk is asked.
  3. Given the log starts from a recipe, when it opens, then milk type and
     amount start as the recipe has them.
  4. Given a blank log for a milk drink, when it opens, then the milk starts as
     on my last shot of this drink (else the first milk on my list), and the
     amount starts at the drink's typical amount.
  5. Given I switch to another drink, when the drink changes, then milk values
     I haven't touched follow the rule for the new drink, and milk disappears
     if the new drink has none.
  6. Given I save, when I look at the shot, then it records the milk type and
     amount.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (S-02 milk; epics revision 9). DQ-26 is the working
  assumption: amount 0 to 500 ml in steps of 10. Design SCR-LOG step 4 (milk).
  Steamed-milk temperature isn't recorded (S-02).

**Coverage:** all In items covered, including puck prep and milk.

### EPIC-01-04: Record temperature and pressure when your machine has them

#### STORY-01-04-01: Record temperature in the way my machine sets it

- **Parent:** EPIC-01-04
- **Story:** As a home enthusiast, I want to record brew temperature only when
  my machine can set it, and in the form it uses, so that the log matches my
  machine and stays uncluttered.
- **Acceptance criteria**
  1. Given my setup's machine has fixed temperature, when I log a shot, then
     no temperature is asked.
  2. Given my machine can set temperature, when I start a new shot, then the
     temperature starts unset, and I can set it or clear it again.
  3. Given my machine has temperature steps (for example 1-3), when I set it,
     then I pick one of its steps, and the shot records the step, never a
     number of degrees.
  4. Given my machine sets an exact temperature, when I set it, then I choose a
     value within its range at its increment, and the shot records it.
  5. Given my machine shows Fahrenheit, when I set the temperature, then I see
     Fahrenheit, and the shot shows the same temperature in either unit.
  6. Given I start from a recipe or edit a shot that has a temperature, when the
     log opens, then the temperature is already set.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (°F display-only and stored in °C, closed by S-08).
  "Not sure" machines follow STORY-01-06-08.

#### STORY-01-04-02: Record pressure in the way my machine sets it

- **Parent:** EPIC-01-04
- **Story:** As a home enthusiast, I want to record pressure only when my
  machine lets me set or read it, so that I log what I actually control.
- **Acceptance criteria**
  1. Given my setup's machine has fixed pressure, or is manual without a
     gauge, when I log a shot, then no pressure is asked.
  2. Given my machine can set or read pressure, when I start a new shot, then
     pressure starts unset, and I can set it or clear it again.
  3. Given my machine has pressure steps, when I set it, then I pick one of its
     steps, never a number of bar.
  4. Given my machine sets an exact pressure, when I set it, then I choose a
     value in bar within its range.
  5. Given my machine is manual (lever, paddle or valve) with a gauge, when I
     set it, then I record the peak pressure I read, and it's labelled as peak.
  6. Given I start from a recipe or edit a shot that has a pressure, when the
     log opens, then the pressure is already set.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (wording). Criterion 1 for gaugeless manual
  machines is the design's assumption (EPIC-01-04 open question).

**Coverage:** all In items covered.

### EPIC-01-05: Say how it tasted

Rewritten in revision 4 for taste relative to the persona (S-02): four "just
right" questions and six observation tags replace the 1-5 scores and the
defect list. DQ-08 and INIT-01 Q3 are closed by S-02.

#### STORY-01-05-01: Rate a shot overall

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to rate a measured shot from 1 to 5
  right after saving it, if I want to, so that I remember which shots I liked.
- **Acceptance criteria**
  1. Given I've just saved a measured shot, when I'm offered to say how it
     tasted, then I can see the shot's values while I rate it from 1 to 5.
  2. Given I chose a rating, when I choose it again, then it goes back to
     unrated.
  3. Given I've made choices, when I leave in any way (done, back, pinning, or
     dialling in with a suggested change), then all my tasting choices are
     saved without a question; with nothing chosen, nothing more is saved.
  4. Given saving my choices fails, when I try to leave, then I stay, my
     choices are kept, and I can try again or leave without saving the
     tasting; the shot itself is already saved.
  5. Given I rated a shot, when I see it later, then its rating is shown.
- **Source sections:** S-02, S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (review M2: the design's "leaving saves" rule).
  Design SCR-TASTE. Rating is optional (INIT-01 Q3 closed: nothing is
  required). One-tap shots never get a rating (DQ-23).

#### STORY-01-05-02: Say what was off, against my own taste

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to say in seconds whether a shot was
  too sour or too bitter, too weak or too strong, too thin or too heavy, and
  sweet enough, compared with what I like, so that Tare knows which way to fix
  it and, over time, what I like.
- **Acceptance criteria**
  1. Given I'm saying how a shot tasted, when I answer, then I see four
     questions, each with "just right" in the middle and "a bit" and "much" on
     either side: balance (too sour to too bitter), strength (too weak to too
     strong), body (too thin to too heavy), and sweetness (not sweet enough to
     just right, one-sided).
  2. Given the drink has milk, when I see the strength question, then its ends
     read "lost in the milk" and "overpowering".
  3. Given I don't touch a question, when I leave, then nothing is saved for it,
     which is different from "just right".
  4. Given a good shot, when I choose "all just right", then all four are set to
     just right in one tap, and I can still change any of them.
  5. Given I chose an answer, when I choose it again, then it goes back to
     unanswered.
  6. Given a good shot, when I rate it, choose "all just right" and finish, then
     it's recorded in three taps; I'm never asked about flavour notes.
- **Source sections:** S-02, S-08, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (rewritten; title was "Score sweetness, acidity,
  bitterness and body"; 2 points became 3). Stored as -2 to +2 with 0 as just
  right, and sweetness -2 to 0 (S-08). Design SCR-TASTE step 3. The same
  questions are used on SH-OFF (STORY-02-03-04) and in editing
  (STORY-02-06-02). Each question is operable by touch and keyboard.

#### STORY-01-05-03: Note what I noticed

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to tick things I noticed about a
  shot, such as a dry finish or little crema, so that my Journal describes
  what happened without my having to judge it.
- **Acceptance criteria**
  1. Given I'm saying how a shot tasted, when I look at what I noticed, then I
     can tick any of six: sour and bitter at once, dry finish, flat, burnt,
     little crema, channelling seen.
  2. Given I tick none, when I leave, then the shot has none.
  3. Given I ticked one, when I tap it again, then it's unticked.
  4. Given I ticked some, when I see the shot later, then they're shown.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (the six tags replace the defect list; title was "Tag
  what went wrong"). Crema is an observation, never a target (S-02). Design
  SCR-TASTE step 4.

#### STORY-01-05-04: See a warning when a shot channelled

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want a clear warning on any shot where I
  saw channelling, so that problem shots stand out when I look back.
- **Acceptance criteria**
  1. Given I'm saying how a shot tasted (after logging, or after a one-tap shot
     I marked off), when I tick "channelling seen", then a channelling warning
     appears straight away; when I untick it, the warning goes.
  2. Given a shot with "channelling seen", when I see it in my Journal, in its
     details or while editing it, then the same warning is shown.
  3. Given the warning, when anyone sees it, then it's understandable from its
     words alone, not only from its colour.
  4. Given any other tag or answer, including "sour and bitter at once" and
     "dry finish", when I see the shot, then no warning is shown, and nothing
     else in the app looks like a shot warning.
- **Source sections:** S-01, S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (the tag drives it; shown on SH-OFF too). Criterion 4 is
  the epic's working assumption: only "channelling seen" warns (EPIC-01-05
  open question). "Ran fast" is never a warning; it only appears in a
  suggestion's reason (DQ-09).

**Coverage:** all In items covered. Out: flavour notes (S-02), "ran fast".

### EPIC-01-06: Add what's missing from the catalog

#### STORY-01-06-01: Add a missing machine, grinder or basket

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to add my machine, grinder or basket
  when it's not in the catalog, starting from a link to its product page, so
  that I can still describe my real setup.
- **Acceptance criteria**
  1. Given I can't find my model, when I choose to add it, then I start with
     its product page link, and my search text is already filled in as its
     name.
  2. Given the link isn't already in the catalog, when I add the maker, model
     name and kind (machine, grinder or basket), then it's saved and I'm taken
     back to where I was with it chosen.
  3. Given the maker isn't in the catalog either, when I add the model, then I
     can add the maker at the same time, also with a link.
  4. Given I add a basket, when I describe it, then I'm asked the dose range
     it's made for (lowest and highest grams), with "not sure" allowed, and no
     machine or grinder questions.
  5. Given I try to save without a product page link, when I save, then I'm
     asked for one and nothing is saved.
  6. Given I added an entry, when I see it, then it's marked as added by my
     household; and given saving fails, everything I entered is kept.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (baskets and their dose range, epics revision 9). The
  design has no flow yet for the basket's dose-range question (SQ-20). Baskets
  often have no product page of their own (EPIC-01-06 open question).

#### STORY-01-06-02: Add a missing roaster or coffee

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to add a roaster or coffee that's not
  in the catalog, starting from a link to its product page, so that I can add
  the bag I bought.
- **Acceptance criteria**
  1. Given I can't find my coffee, when I add it with its product page link,
     roaster and name, then it's saved and I'm taken back to adding my bag with
     it chosen.
  2. Given the roaster isn't in the catalog either, when I add the coffee, then
     I can add the roaster at the same time, also with a link.
  3. Given I add a coffee, when I want to, then I can give its roast level from
     the fixed list and its tasting notes; both may be left empty.
  4. Given I try to save without a product page link, when I save, then I'm
     asked for one and nothing is saved.
  5. Given I added an entry, when I see it, then it's marked as added by my
     household.
- **Source sections:** S-02, S-04, S-08, S-09
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged.

#### STORY-01-06-03: Keep what I add private until it's verified

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want what my household adds to the
  catalog to stay private until it's checked, so that unchecked entries don't
  confuse anyone else.
- **Acceptance criteria**
  1. Given my household added an unverified entry, when another household
     searches the catalog, then they don't see it.
  2. Given my household added an unverified entry, when I search, then I see
     it and can use it, and apart from its "added by us" mark it looks like any
     other entry.
  3. Given an entry my household added has been verified, when any household
     searches, then they see it, and my parts, setups, bags and shots that use
     it are unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (wording). Manual admin review until EPIC-06-07
  (SQ-12).

#### STORY-01-06-04: Get pointed to an entry that already exists

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want Tare to tell me as soon as I've
  given the link if it belongs to something already in the catalog, so that I
  use the existing entry and don't fill in a form for nothing.
- **Acceptance criteria**
  1. Given a verified entry, or one my household added, has the same product
     page link, when I give the link, then I'm told it probably exists, before
     I fill in anything else, and offered that entry.
  2. Given the link differs only by regional path or tracking parameters, when
     I give it, then it's treated as the same link.
  3. Given another household's unverified entry has the same link, when I give
     mine, then I'm not told about it.
  4. Given I'm offered an existing entry, when I accept it, then I go back to
     where I was with that entry chosen, and no new entry is created.
  5. Given the link can't be checked right now, when I continue, then I can
     still fill in and save, and the check runs again when I save.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged. DQ-10 (add anyway) is off by the review's working
  assumption.

#### STORY-01-06-05: Add regional links and names to an entry

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want an entry I add to hold its product
  pages for different markets and its other names, so that it's found by the
  name I know it by.
- **Acceptance criteria**
  1. Given I'm adding an entry, when I add more product page links, then each
     is saved with the market it's for, or none if it's global.
  2. Given I'm adding an entry, when I add other names it's sold under, then
     each is saved, optionally with its market.
  3. Given an entry has an alias, when anyone who can see the entry searches by
     that alias, then the entry is found.
  4. Given I add an extra link, when it matches another entry's link, then I'm
     told as in STORY-01-06-04.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged. SQ-04 still open.

#### STORY-01-06-06: Describe a machine I added in my own words

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to say what my added machine can do
  by answering a few plain questions, with "not sure" always allowed, so that
  the shot log asks for the right things.
- **Acceptance criteria**
  1. Given I'm adding a machine, when I describe it, then I'm asked whether I
     can set the brew temperature and whether I can set or read the pressure,
     in plain words, each with "not sure" as an answer.
  2. Given an answer that needs more detail, when I give it, then only the
     follow-up it needs is asked (how many settings, the unit, the lowest and
     highest value, or whether there's a gauge), also with "not sure".
  3. Given a machine with no temperature or pressure control, when I describe
     it, then two answers are enough.
  4. Given I leave any question unanswered, when I save, then it's saved as
     "not sure", and I was told that before saving.
  5. Given I saved my machine, when I log a shot on a setup with it, then the
     log offers temperature and pressure in the form I described.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (wording). "Not sure" is stored as unknown
  (TQ-06).

#### STORY-01-06-07: Describe a grinder I added in my own words

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to say how my added grinder's dial
  works by answering a few plain questions, with "not sure" always allowed, so
  that the grind setting matches my real dial.
- **Acceptance criteria**
  1. Given I'm adding a grinder, when I describe it, then I'm asked whether the
     dial clicks into steps or turns smoothly, the lowest and highest numbers on
     it, and which way is coarser, each with "not sure" or left empty.
  2. Given the dial clicks, when I answer, then I'm also asked the smallest
     change I can make; given it turns smoothly, I'm not.
  3. Given I leave any question unanswered, when I save, then it's saved as
     "not sure".
  4. Given I saved my grinder, when I log a shot with it, then the grind
     setting follows what I described, including which way is finer and
     coarser.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged.

#### STORY-01-06-08: Log shots even when I'm not sure about my equipment

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want the shot log and suggestions to work
  for equipment whose details I didn't know, without guessing anything that
  matters, so that "not sure" never stops me logging.
- **Acceptance criteria**
  1. Given my machine's temperature or pressure control is "not sure", when I
     log a shot, then that value isn't asked.
  2. Given the number of settings, the unit or the range is "not sure", when I
     log a shot, then simple defaults are used (settings 1 to 5, °C, a common
     range), and nothing is shown as a warning.
  3. Given my grinder's dial range or click size is "not sure", when I log a
     shot, then I can still set any grind in a wide default range.
  4. Given which way is coarser is "not sure", when I set grind, then no finer
     or coarser direction is shown, never a guessed one.
  5. Given my basket's dose range is "not sure", when a suggestion is worked
     out, then dose is never suggested (STORY-02-03-06).
  6. Given any part of my setup is "not sure", when I log a shot, then I'm
     offered, quietly and once, to tell Tare more about it (STORY-01-06-09).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (the basket's dose range; title wording). DQ-11 is the
  working assumption for the fallback ranges. Criterion 5 is the epic's
  working assumption (EPIC-01-06 open question: skip or default range).

#### STORY-01-06-09: Answer capability questions later

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to come back and answer what I
  wasn't sure about for equipment I added, so that the shot log and
  suggestions get better once I know.
- **Acceptance criteria**
  1. Given a machine, grinder or basket my household added that's still
     unverified, when I open that part, then I see which answers are "not sure"
     and can answer the same questions again, including a basket's dose range.
  2. Given I change an answer, when I log a new shot or get a suggestion, then
     it follows the new answer.
  3. Given I change an answer, when I look at old shots, then their stored
     values are unchanged and mean what they meant.
  4. Given a new answer narrows the range, when I edit an old shot outside it,
     then the old value is shown as saved, never silently changed.
  5. Given a seeded or verified model, when I open the part, then I can see
     its capabilities but not change them.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (baskets; suggestions follow answers). PEC-08. Design
  SCR-UNIT "Answer later".

**Coverage:** all In items covered, for both catalogs and all three part
kinds, including the basket's dose range.

---

## INIT-02: Every new bag starts from what you already learned

### EPIC-02-01: Pin the recipe that worked

Retired: STORY-02-01-05, replaced by STORY-02-01-06.

#### STORY-02-01-01: Pin a recipe from a shot I liked

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a good shot as my recipe for
  that coffee, drink and setup, so that I can make it again without dialing
  in.
- **Acceptance criteria**
  1. Given a measured shot, right after tasting it or from its details, when I
     choose to pin it, then before confirming I see which drink, coffee and
     setup it applies to, its values, puck prep and milk, and the recipe it
     replaces, if any, with differences shown.
  2. Given I confirm, when it's saved, then a recipe is saved for that shot's
     coffee, persona, setup and drink, with its grind, dose, yield, time, any
     temperature or pressure, its WDT and puck screen ticks and, for a milk
     drink, its milk type and amount.
  3. Given I pinned a flat white made with oat milk, when I later pin a flat
     white of the same coffee on the same setup made with whole milk, then it
     replaces the same recipe: milk is never part of which recipe it is.
  4. Given a recipe exists for a coffee, persona, setup and drink, when anything
     in the app needs the recipe for that combination, then it gets the latest
     one pinned, and only for that setup.
  5. Given a one-tap shot, when I look at it, then pinning isn't offered.
  6. Given I later edit the shot I pinned from, or pinning fails, when I look,
     then the recipe is unchanged, or nothing is pinned and I can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (setup, prep and milk; review m10). **This story owns
  "which recipe applies now"** (criterion 4); STORY-02-01-04, Brew, every
  pre-fill and the coffee screen (STORY-03-06-03) use it. Someone who
  alternates milks can add a drink such as "Oat flat white" once drink editing
  ships (EPIC-02-01 open question; EPIC-02-05). Assumes a pin sets the
  coffee's default (INIT-02 Q1).

#### STORY-02-01-02: Pin a recipe by entering the values

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a recipe for a coffee by
  setting its values myself, so that I can start from a recipe I already know,
  such as one from the roaster.
- **Acceptance criteria**
  1. Given a bag in Beans, when I add a recipe for its coffee, then I choose the
     drink and setup and set grind, dose, yield and time as on the shot log.
  2. Given the setup's machine can set temperature or pressure, or the drink has
     milk, when I enter the recipe, then I can set those too, and I can tick WDT
     and puck screen.
  3. Given I confirm the pin, when it's saved, then a recipe is saved for that
     coffee, drink, setup and my persona, with no source shot, and no shot is
     logged.
  4. Given I'm entering a recipe, when I look at the screen, then it's clear I'm
     pinning a recipe, not logging a shot.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (setup, prep, milk). Design SCR-LOG recipe mode, SH-PIN.

#### STORY-02-01-03: Pin a better recipe and keep the old one

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want a new pin to replace my current
  recipe without deleting the old one, so that I always brew my latest best
  and nothing is lost.
- **Acceptance criteria**
  1. Given a coffee, persona, setup and drink already have a recipe, when I pin
     another, then the new one becomes the current recipe.
  2. Given I re-pinned, when I look at the current recipe, then I see only the
     newest one.
  3. Given I re-pinned, when anything in the app needs that recipe, then it uses
     the newest one.
  4. Given I re-pinned, when the older recipe is checked, then it still exists,
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged. Criterion 4 is a data check. SQ-05 still open.

#### STORY-02-01-04: See the recipes for a coffee

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to see my recipes for a coffee, per
  drink and setup, so that every new bag of it starts from what worked.
- **Acceptance criteria**
  1. Given recipes are pinned for a coffee, when I look at a bag of it, then I
     see one recipe per drink and setup, with its values, puck prep, milk and
     the date it was pinned.
  2. Given I add a new bag of the same coffee, when I look at it, then I see
     the recipes pinned for that coffee, not blank ones.
  3. Given a recipe, when I open it, then I can dial in from it or change it.
  4. Given no recipe is pinned for that coffee, when I look, then I'm told
     there's none yet and can add one (STORY-02-01-02).
  5. Given the coffee was merged into another catalog entry, when I look for its
     recipes, then I see recipes pinned against either entry.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (per setup; milk; review m10). Shows recipes as resolved
  by STORY-02-01-01. The same rows appear on the coffee screen
  (STORY-03-06-03).

#### STORY-02-01-06: Dial in on a new setup from my closest setup's recipe

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want a dial-in on a setup that has no
  recipe yet to start from my recipe on the most similar setup, so that a new
  basket or grinder doesn't mean starting from scratch.
- **Acceptance criteria**
  1. Given my current setup has no recipe for this coffee and drink but another
     setup does, when I look at Brew, then I'm told there's no recipe on this
     setup yet and which setup the dial-in will start from, and only "Dial in"
     is offered, never a one-tap pull.
  2. Given several setups have such a recipe, when the starting setup is chosen,
     then it's the one with the most parts in common with my current setup;
     ties go to the one I used most recently.
  3. Given I dial in, when the log opens, then I'm told it starts from that
     setup's recipe, and dose, yield, time, puck prep and milk come from it.
  4. Given the starting setup has the same grinder, when the log opens, then
     grind comes from its recipe too; given a different grinder, grind starts at
     this grinder's last measured value (else the middle of its range) and I'm
     told grind wasn't carried over.
  5. Given the starting setup has the same machine, when the log opens, then
     temperature and pressure come from its recipe; otherwise they start unset.
  6. Given I save and pin the dial-in, when I come back, then this setup has its
     own recipe and the next shot is one tap. Given no setup has a recipe, the
     dial-in starts blank (STORY-02-02-05).
- **Source sections:** S-02, S-01, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** New. DQ-19 and DQ-20 are the working assumptions. Prep and milk
  carry over because they aren't tied to a part (design; answers the
  EPIC-02-01 carry-over question). Design DES-02-01-05.

**Coverage:** all In items covered, including milk on recipes.

### EPIC-02-02: Pull your daily shot in one tap

#### STORY-02-02-01: See my daily shot on Brew

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want Brew to show the recipe I usually
  make at this time of day, on my current setup, with the coffee I'm on, so
  that my daily shot needs no choices.
- **Acceptance criteria**
  1. Given my profile is selected, when I open Brew, then it shows the drink I
     usually make at this time of day, the coffee I'm on, my current setup, and
     my recipe for them on that setup: values, puck prep if used, milk for a
     milk drink, and how much coffee is left.
  2. Given the coffee in use is opened, when I see Brew, then both freshness
     clocks show on one line; while it's unopened, only the roasting clock.
  3. Given I usually make different drinks in the morning and the afternoon,
     when I open Brew at each time, then it shows the matching drink; with no
     drink at this time of day, the most recent drink, or the first on my list.
  4. Given several coffees, when I open Brew, then it shows the earliest-opened
     open portion whose coffee has a recipe for this drink on this setup; else
     the earliest-opened open portion; else my newest unopened portion that
     isn't frozen; else a frozen coffee, and pulling asks which bag to use.
  5. Given a portion that was opened and then frozen, when Brew chooses the
     coffee, then it doesn't count as open.
  6. Given my recipe's coffee is finished, when I open Brew, then I'm told I've
     finished it and offered to choose another coffee or add a bag.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** Updated (current setup, clocks, prep and milk lines, "open"
  excludes frozen). Working assumptions: DQ-18, DQ-02, DQ-03 (round 3).
  Design 2.3. A pending suggestion changes the "Dial in" label
  (STORY-02-03-07).

#### STORY-02-02-02: Pull this shot in one tap

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want one tap to record my daily shot, so
  that my coffee use counts without logging anything.
- **Acceptance criteria**
  1. Given Brew shows a recipe on my current setup, when I tap "Pull This Shot",
     then a shot is recorded at once with the recipe's values, its WDT and puck
     screen ticks and its milk type and amount, marked one-tap, and I'm told
     it's logged; nothing else is asked.
  2. Given I pull a shot, when it's recorded, then it uses the recipe's setup,
     the drink and coffee shown, my profile as whose taste, and me as who
     logged it.
  3. Given several portions of that coffee are open, when I pull a shot, then
     it's recorded against the one opened earliest; a portion in the freezer is
     never used, even if it was opened before freezing.
  4. Given I tap twice quickly, when the shot is recorded, then only one shot is
     recorded.
  5. Given the pull fails, when I look, then I'm told, no shot is recorded, and
     I can try again.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (prep and milk copied; frozen isn't open, review M5).
  One-tap shots count toward coffee used but are never measurements or
  network-eligible (S-02). A day with a different milk or no WDT needs an edit
  (STORY-02-06-02); changing milk on Brew before a pull isn't in the spec
  (EPIC-02-02 open question).

#### STORY-02-02-03: Choose a bag when none is open

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to be asked which bag to use when
  none of that coffee is open, so that my shot is counted against the right
  bag, and frozen coffee is only used when I say so.
- **Acceptance criteria**
  1. Given no portion of the coffee is open, when I tap "Pull This Shot", then
     I'm asked which of its unfinished portions to use, with each one's bag,
     state, freshness and amount left; portions on the counter first, frozen
     ones last and marked as ground straight from the freezer.
  2. Given I choose an unopened or thawed portion, when I confirm, then the
     shot is recorded against it, and an unopened one is marked opened today.
  3. Given I choose a frozen portion, when I confirm, then the shot is recorded
     as ground from frozen, and none of the portion's dates change.
  4. Given I have no unfinished portion of that coffee, when I tap "Pull This
     Shot", then I'm told there's none left and offered to add a bag, and no
     shot is recorded.
  5. Given I'm asked and cancel, when I return to Brew, then no shot is
     recorded.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (frozen portions; 2 points became 3). Design SH-PORTION.
  DQ-06 (round 3).

#### STORY-02-02-04: Undo a shot I didn't mean to pull

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to undo a one-tap shot for a few
  seconds, so that a mistaken tap doesn't count.
- **Acceptance criteria**
  1. Given I just pulled a one-tap shot, when I undo within the undo window,
     then the shot is removed as if it was never pulled, and I'm told.
  2. Given the shot marked a portion opened, when I undo it, then the portion
     is back to unopened.
  3. Given I undid a shot, when I look at remaining coffee and my Journal, then
     the shot isn't counted or listed.
  4. Given the undo window has passed, when I look, then undo is no longer
     offered, without a countdown, and the shot stays; I can still edit it.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged (wording only). DQ-04: 8 seconds.

#### STORY-02-02-05: Dial in when there's no recipe on this setup

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want Brew to offer "Dial in" instead of a
  one-tap pull when my current setup has no recipe for this drink and coffee,
  so that I know to log a shot instead.
- **Acceptance criteria**
  1. Given no setup has a recipe for my profile, the drink and the coffee shown,
     when I open Brew, then I'm told there's no recipe yet and the main action
     is "Dial in" instead of "Pull This Shot".
  2. Given that, when I choose "Dial in", then the shot log opens with that
     drink, coffee and my current setup chosen, and values start as in
     STORY-01-03-02.
  3. Given another setup has a recipe for them, when I open Brew, then it's the
     no-recipe-on-this-setup case of STORY-02-01-06 instead.
  4. Given I then pin a recipe on this setup, when I return to Brew, then "Pull
     This Shot" is offered.
- **Source sections:** S-02, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (two no-recipe cases; 1 point became 2). DQ-07.

#### STORY-02-02-06: Change the drink or coffee before pulling

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to switch the drink or coffee on Brew
  and still pull in one tap, so that a different drink at my usual time
  doesn't mean a full log.
- **Acceptance criteria**
  1. Given Brew, when I change the drink or the coffee, then I choose from my
     visible drinks, or from coffees with an unfinished portion (those with a
     recipe for this drink on this setup first, frozen-only coffees last and
     marked), and my usual choice is marked so I can always go back.
  2. Given I chose another drink or coffee, when I look, then the recipe shown
     updates without leaving Brew.
  3. Given the new drink and coffee have a recipe on this setup, when I tap
     "Pull This Shot", then the shot uses them, with no extra step.
  4. Given they have no recipe on this setup, when I look, then Brew offers
     "Dial in" (STORY-02-02-05 or STORY-02-01-06).
  5. Given I changed the drink or coffee and pulled, when I next open Brew, then
     my usual drink and coffee follow from what I pulled, and no setting was
     saved.
  6. Given I changed them but didn't pull, when I come back after 30 minutes
     away from Brew, then it's back to my usual drink and coffee.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (frozen-only coffees; criterion 6 exact, review m7).
  DQ-17. The drink and coffee chosen here also pre-filter the Journal
  (STORY-02-06-05).

#### STORY-02-02-07: Switch setup on Brew and in the shot log

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to switch setup, or say I've changed
  a part, right where I brew, so that the recipe shown and the shot I log
  always match what's on my counter.
- **Acceptance criteria**
  1. Given Brew or the shot log, when I change the setup, then I choose from my
     setups (current first, marked) or choose to change a part.
  2. Given I choose a setup, when I return, then it becomes current at once and
     stays current until I change it or log a shot on another setup; the recipe
     shown updates in place.
  3. Given I choose to change a part, when I finish (STORY-01-02-08), then I
     come back to where I was with the resulting setup chosen and current.
  4. Given I change the setup in the shot log, when the log updates, then dose,
     yield and time stay, and grind stays only if the new setup has the same
     grinder; otherwise it moves to that grinder's last measured value, or the
     middle of its range.
  5. Given I change the setup in the shot log, when the log updates, then prep
     ticks I haven't touched follow STORY-01-03-06 for the new setup.
- **Source sections:** S-02, S-01, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-09). DQ-18.

**Coverage:** all In items covered, including prep and milk on one-tap pulls.

### EPIC-02-03: Fix a bad shot from your recipe

Now M (epics revision 9): the off path, the SH-OFF sheet and rule-based
suggestions. The rules are plain rules, not AI (S-02).

#### STORY-02-03-01: Say whether a one-tap shot was good or off

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to say "good" or "off" after a
  one-tap shot, or say nothing, so that Tare knows how it went without making
  me fill anything in.
- **Acceptance criteria**
  1. Given I just pulled a one-tap shot, when I choose "good", then the shot
     records that reaction and nothing else happens.
  2. Given I just pulled a one-tap shot, when I give no reaction, then the shot
     stays with no reaction, and I'm never asked again.
  3. Given I choose "off", when I do, then the shot records that reaction and I'm
     asked what was off (STORY-02-03-04).
  4. Given a one-tap shot, when I open it later from my Journal, then I can give
     or change its reaction.
  5. Given saving the reaction fails, when I look, then I'm told and the
     reaction isn't recorded; choosing "off" still lets me go on to fix it.
- **Source sections:** S-02, S-06, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated ("off" now opens SH-OFF, DQ-23). DQ-05 for criterion 4.

#### STORY-02-03-02: Fix an off shot from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want an off shot to open the log already
  filled with my recipe, and the suggested change if there is one, so that I
  only nudge one or two values.
- **Acceptance criteria**
  1. Given I'm fixing an off one-tap shot, when the log opens, then it's filled
     with the current recipe's values, puck prep and milk, its setup, drink and
     the same portion.
  2. Given I chose to try a suggested change, when the log opens, then that
     change is already made and I'm told what was changed (for example "grind 2
     steps finer"); given I skipped, the log is the recipe as it is.
  3. Given the pre-filled log, when I or the suggestion change a value, then I
     can see what it was in the recipe; unchanged values show nothing extra.
  4. Given I save, when it's saved, then a new measured shot is saved, the
     one-tap shot keeps its "off" reaction and answers, and I'm offered to say
     how the new shot tasted.
  5. Given the pre-filled log, when I leave without saving, then no measured
     shot is saved, and the one-tap shot keeps its reaction and answers.
- **Source sections:** S-02, S-06, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (suggestion pre-fill; prep and milk). DQ-12: two records
  (SQ-14 on doses). Design SCR-LOG fix mode.

#### STORY-02-03-03: Dial in from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to start a shot log from my recipe
  instead of pulling it, so that I can dial in a new bag of a coffee I know.
- **Acceptance criteria**
  1. Given Brew shows a recipe on my current setup, when I choose "Dial in",
     then the log opens filled with the recipe's values, temperature, pressure,
     puck prep and milk, its setup and drink.
  2. Given a suggestion is pending for this recipe, when I choose "Dial in",
     then the log starts with the suggested change already made (STORY-02-03-07).
  3. Given I adjust and save, when it's saved, then a measured shot is saved and
     no one-tap shot is recorded.
  4. Given no portion of the coffee is open, when I choose "Dial in", then I'm
     first asked which bag to use, as for a pull (STORY-02-02-03), and
     cancelling opens nothing.
  5. Given I have no unfinished portion of that coffee, when I choose "Dial in",
     then I'm told there's none left and offered to add a bag.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (review m6, criteria 4 and 5; pending suggestion; 2
  points became 3). On a setup without a recipe, see STORY-02-01-06.

#### STORY-02-03-04: Say what was off about a one-tap shot

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to say what was off about a one-tap
  shot in a few taps, right after marking it off, so that Tare can suggest
  what to change before I pull the next one.
- **Acceptance criteria**
  1. Given I marked a one-tap shot "off", when I'm asked what was off, then I
     see the same four "just right" questions and six tags as after a logged
     shot (STORY-01-05-02, 01-05-03), with no rating.
  2. Given I answer, when I leave in any way (fix it, skip, or close), then my
     answers are saved on the one-tap shot itself.
  3. Given I answer, when an answer gives Tare something to change, then a
     suggested change appears below, and updates as I change answers
     (STORY-02-03-05).
  4. Given I choose to fix it, when the log opens, then it starts from the
     recipe with the suggested change made; given I choose to skip, it starts
     from the recipe only (STORY-02-03-02).
  5. Given I tick "channelling seen", when I look, then the channelling warning
     shows (STORY-01-05-04).
  6. Given saving the answers fails, when I look, then I'm told and can try
     again, and skipping still opens the fix.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (DQ-23, closes SQ-17 and review M1 for the off path: one-tap
  shots carry "just right" answers and tags, never a rating). Design SH-OFF.
  A user may feel asked twice (here, then about the fix shot); the design
  accepts this.

#### STORY-02-03-05: See one suggested change, with its reason

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want Tare to suggest exactly one change for
  my next shot, and say why, so that I know what to try and can check it
  against what I said.
- **Acceptance criteria**
  1. Given I gave an answer or tag that points to a change (after a logged shot,
     or on an off one-tap shot), when I look, then I see one change for the next
     shot and a one-line reason drawn from my answers (for example "too sour and
     ran fast").
  2. Given several answers point different ways, when the suggestion is worked
     out, then I still see only one change, chosen by the lever order
     (STORY-02-03-06).
  3. Given I only rated the shot, or answered "just right" everywhere, when I
     look, then no change is suggested.
  4. Given the coffee is very fresh or likely past its peak, when I look, then
     that's shown as an explanation, with or without a change, and never as a
     change to make.
  5. Given a suggestion, when I see it, then it's advice in plain ink, never in
     the warning colour.
  6. Given a suggestion, when I change my answers, then it updates at once.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (S-02). DQ-24 is the working assumption for freshness: "very
  fresh, may channel" under 5 days since roast or packing, and "likely past
  its peak" over 35 days since roast or over 21 days open, freezer time
  excluded. Freshness lines need EPIC-03-03; until it ships, suggestions work
  without them. Shot time is a diagnostic in reasons, never a lever or a
  warning (DQ-09). Calculated on the device, never stored. Design
  SuggestionCard (NC-16).

#### STORY-02-03-06: Get the right change for what was off

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want the suggested change to follow
  established dial-in practice on my own equipment, so that I can trust it
  and fix a bad shot in as few tries as possible.
- **Acceptance criteria**
  1. Given channelling signs (channelling seen, sour and bitter at once, or a
     dry finish), when the change is worked out, then puck prep comes first:
     use WDT if it wasn't used; else a puck screen if it wasn't used; if both
     were used, no grind change is suggested and I'm told to check distribution
     and tamping.
  2. Given balance is off and there are no channelling signs, when the change is
     worked out, then it's grind, in my grinder's own direction and steps.
     *Example:* "much too sour" on a grinder at 15, whose steps are 1 and where
     higher is coarser, suggests 2 steps finer, to 13. "A bit too bitter"
     suggests 1 step coarser, to 16.
  3. Given strength is off and balance is just right or unanswered, when the
     change is worked out, then it's yield: a shorter yield (a more
     concentrated shot) when too weak, and a longer one when too strong.
     *Example:* "a bit too weak" at 36 g suggests stopping at 34 g. For a milk
     drink that's "lost in the milk", it's dose first, within the basket's
     dose range, then less milk. *Example:* "try about 30 ml less milk".
  4. Given body is off, when the change is worked out, then it's dose, and only
     within the basket's dose range. *Example:* "a bit too thin" at 18 g in a
     basket made for 16 to 20 g suggests 18.5 g; at 20 g, dose isn't suggested
     and the next lever in order is considered.
  5. Given balance is still off and grind is at the end of its range, when the
     change is worked out, then temperature is suggested, only on a machine
     that can set it (for example "brew 1 °C hotter" when too sour).
  6. Given my grinder's direction or my basket's dose range is "not sure", when
     the change is worked out, then grind is suggested only as "finer" or
     "coarser" without dial numbers, with a link to tell Tare more, and dose is
     never suggested.
- **Source sections:** S-02, S-08, S-01
- **Priority:** MVP
- **Size:** 5
- **Notes:** New (S-02 lever order). "A bit" is one step and "much" two
  (design). The gram, degree and millilitre sizes in the examples come from
  the design's examples and are working assumptions (SQ-19). The rules are
  tested against a fixed set of scenarios covering every lever, both
  directions, the limits and the "not sure" cases, and all must pass before
  release. These are plain scenario tests, not an LLM judge (EPIC-02-03 open
  question: who writes the set). Grind suggestions use shots in the current
  grind period (EPIC-04-01 open question, assumed yes). When the temperature
  lever applies is SQ-21: S-02 lists it after dose, and the design triggers it
  only when grind is at its limit; the design is followed here.

#### STORY-02-03-07: Try the suggested change, or dismiss it

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to try the suggested change in one
  tap, or set it aside, so that it helps without getting in my way.
- **Acceptance criteria**
  1. Given a suggestion after tasting a logged shot, when I choose to dial in
     with it, then my tasting is saved and the shot log opens with that shot's
     values plus the change, the changed value showing what it was.
  2. Given I opened the log with a suggested change, when I leave without
     saving, then nothing is saved: the change only becomes real in the next
     shot I save.
  3. Given a suggestion I haven't dismissed, when I go back to Brew, then "Dial
     in" says it will use the suggested change.
  4. Given a suggestion, when I dismiss it, then it's gone in one tap, the next
     dial-in starts without it, and Brew's "Dial in" goes back to normal.
  5. Given I dismissed a suggestion, when I log the next shot on that coffee,
     setup and drink, then a new suggestion can appear from that shot.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** New. DQ-25 is the working assumption: a dismissal lasts until the
  next shot on that coffee, setup and drink, on this device only. Design
  SCR-TASTE step 7, EPIC-02-03 "Pre-fill" and "Dismiss".

**Coverage:** all In items covered: the reaction, SH-OFF with answers on the
one-tap shot, the one-change suggestion in lever order with reasons,
freshness and time as explanations, pre-fill, dismiss, dial-in from Brew
with a pending suggestion, and scenario tests. Out: "Dial in from this"
(EPIC-02-06), drift (EPIC-04-02), AI advice (EPIC-06-02).

### EPIC-02-04: Give one bag its own recipe

Blocked on INIT-02 Q1. The stories are testable either way; only the default
is a placeholder.

#### STORY-02-04-01: Pin a recipe for one bag only

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want to pin a recipe for one bag that
  behaves differently, so that my usual recipe for that coffee stays as it is.
- **Acceptance criteria**
  1. Given I'm pinning a recipe, when I confirm, then I can choose between every
     bag of this coffee and this bag only, and the recipe is saved for the
     choice I made.
  2. Given I pinned for one bag, when I look at the coffee's default recipe on
     that setup, then it's unchanged.
  3. Given a bag's own recipe, when I see it on Brew or with the bag, then it's
     marked as for this bag only.
  4. Given I pin for this bag again, when I look, then the newest bag recipe
     applies.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (review m7). **Placeholder:** the pre-selected option
  depends on INIT-02 Q1.

#### STORY-02-04-02: Use the bag's recipe while that bag is in use

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want Brew and the pre-filled log to use
  the bag's own recipe while I'm on that bag, so that I don't have to
  remember the difference.
- **Acceptance criteria**
  1. Given a bag with its own recipe on my current setup, when Brew shows that
     bag, then it shows the bag's recipe, not the coffee's default.
  2. Given that bag's recipe, when I pull a one-tap shot or open the pre-filled
     log, then the bag's values are used.
  3. Given I move to a new bag of the same coffee, when I open Brew, then the
     coffee's default recipe is used again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged (wording only). SQ-11.

**Coverage:** all In items covered.

### EPIC-02-05: Make the drink and milk lists yours

#### STORY-02-05-01: Rename a drink

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to rename a drink, so that the list
  uses the words my household uses.
- **Acceptance criteria**
  1. Given a starter drink, when I rename it, then my name is shown everywhere,
     including on past shots, in every language.
  2. Given I try to save an empty name, when I save, then I'm asked for a name
     and nothing changes.
  3. Given a renamed drink, when I look at its recipes, then they're unchanged.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged.

#### STORY-02-05-02: Hide drinks I don't make

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to hide drinks I never make, so that
  my choices stay short.
- **Acceptance criteria**
  1. Given a drink, when I hide it, then it no longer appears when I log a shot
     or on Brew.
  2. Given a hidden drink, when I look at past shots of it, then they still show
     it.
  3. Given a hidden drink, when I unhide it, then it's offered again.
  4. Given only one drink is visible, when I try to hide it, then I can't, and
     I'm told at least one must stay visible.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. Recipes for hidden drinks: EPIC-02-05 open question.

#### STORY-02-05-03: Add my own drink

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to add a drink that's not on the
  list, such as "Oat flat white", so that I can log what I actually make and
  keep a separate recipe for it.
- **Acceptance criteria**
  1. Given my drink list, when I add a drink with a name and say whether it has
     milk, then it's offered when logging and on Brew, with milk fields only if
     it has milk.
  2. Given I try to add a drink without a name, when I save, then I'm asked for
     one and nothing is saved.
  3. Given I add a drink, when I see it, then it shows the name I gave in every
     language.
  4. Given I added a drink, when I pin a recipe for it, then that recipe is
     separate from other drinks' recipes.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Updated (with or without milk; `has_milk` closed by S-08).

#### STORY-02-05-04: Put my drinks in my order

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to reorder my drinks, so that the ones
  I make most come first.
- **Acceptance criteria**
  1. Given my drink list, when I move a drink up or down, then drinks appear in
     that order wherever I choose one.
  2. Given I reorder, when I do it, then I can do it without dragging.
  3. Given I add a drink, when I see the list, then it's placed at the end.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 1
- **Notes:** Unchanged.

#### STORY-02-05-05: Make the milk list mine

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to rename, hide, add and reorder
  milks, such as adding "Oat (barista)", so that the list matches what's in
  my fridge.
- **Acceptance criteria**
  1. Given a starter milk, when I rename it, then my name is shown everywhere,
     including on past shots.
  2. Given a milk, when I hide it, then it's no longer offered when logging, and
     past shots still show it.
  3. Given my milk list, when I add a milk with a name, then it's offered when
     logging; without a name, nothing is saved.
  4. Given my milk list, when I move a milk up or down, then milks appear in that
     order wherever I choose one.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** New (PEC-13, epics revision 9). No brand catalog (S-02). What
  happens to a recipe whose milk is hidden is an EPIC-02-05 open question.

#### STORY-02-05-06: Set how much milk a drink usually gets

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to set the usual milk amount for each
  milk drink, so that new shots start from the amount I really use.
- **Acceptance criteria**
  1. Given a drink with milk, when I set its usual amount in millilitres, then
     new shots of it start from that amount when no recipe sets one.
  2. Given a drink without milk, when I look at it, then no amount is asked.
  3. Given I change the usual amount, when I look at past shots, then they're
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 1
- **Notes:** New.

**Coverage:** all In items covered, including the milk list.

### EPIC-02-06: Look back in your journal

Now M (epics revision 9): the Journal with filters, a default from Brew, and
"Dial in from this". The tab is "Journal"; its entries are still "shots"
(S-02).

#### STORY-02-06-01: See my journal of shots

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want a journal of what I've made, newest
  first and grouped by day, so that I can find a shot I want to check or fix.
- **Acceptance criteria**
  1. Given my household has logged shots, when I open the Journal, then I see
     them newest first, grouped by day (today, yesterday, then dates), each with
     its drink, time, coffee, milk for a milk drink, and grind, dose, yield and
     time.
  2. Given the Journal has measured and one-tap shots, when I look at it, then
     I can tell which is which in words, and see each shot's reaction, whether
     it was ground from frozen, and any channelling warning.
  3. Given I have shots older than the last 30 days, when I reach the end of
     the list, then I can choose to show older shots.
  4. Given my household has no shots yet, when I open the Journal, then I'm told
     there are none and offered to dial in.
  5. Given a shot in the Journal, when I open it, then I see its details
     (STORY-02-06-03).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (Journal; milk on rows; title was "See my recent
  shots"). DQ-13. Design SCR-SHOTS. Rows don't show prep. An entry is never
  called a "journal entry".

#### STORY-02-06-02: Fix a shot after the fact

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to edit any shot, including a
  one-tap shot that didn't go to plan, so that my Journal is right.
- **Acceptance criteria**
  1. Given a measured shot, when I edit it, then I see its values, milk, puck
     prep, sweetened mark, rating, "just right" answers and tags together, and
     can change any of them.
  2. Given a one-tap shot, when I edit it, then I can change its values, milk,
     puck prep, sweetened mark, "just right" answers and tags, but no rating is
     offered, and its reaction stays as it was.
  3. Given I'm editing, when I look at the coffee, drink, setup and persona,
     then I can see them but not change them.
  4. Given I save, when I look at the shot again, then it shows my changes,
     whose taste it records and who logged it are unchanged, and a one-tap shot
     is still marked one-tap.
  5. Given I change a dose, or edit a shot a recipe was pinned from, when I
     look, then remaining coffee reflects the new dose and the recipe is
     unchanged.
  6. Given I leave with unsaved changes, when I confirm, then the shot is
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (review M1 via DQ-23; prep, milk, the new taste model).
  Design SCR-LOG edit mode, which saves only on "save changes" (the exception
  to STORY-01-05-01's rule). Entry mode stays one-tap after editing (the
  review's working assumption). Deleting a shot is an EPIC-02-06 open
  question.

#### STORY-02-06-03: See a shot's details

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to open a shot and see everything
  about it, so that I understand what I pulled and what to do next.
- **Acceptance criteria**
  1. Given a shot, when I open it, then I see its values, drink, coffee, its
     setup with the machine, grinder and basket by maker and model, its date and
     time, milk for a milk drink, sweetened, and its puck prep when used.
  2. Given the shot has taste, when I open it, then I see its rating, each
     "just right" answer as a short phrase (for example "a bit sour"; questions
     not answered aren't shown) and its tags.
  3. Given a measured shot, when I open it, then I can pin it, dial in from it
     (STORY-02-06-06) or edit it.
  4. Given a one-tap shot, when I open it, then I'm told its values were copied
     from my recipe, I can edit it, dial in from it, and give or change its
     reaction; I can't pin it.
  5. Given the shot has "channelling seen", when I open it, then I see the
     warning (STORY-01-05-04).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (setup parts, prep, milk, taste phrases, "Dial in from
  this"). Design SCR-SHOT.

#### STORY-02-06-04: Filter my journal by drink, coffee and setup

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to narrow my Journal to one drink,
  coffee or setup, and widen it again in one tap, so that I can find the shots
  that matter right now.
- **Acceptance criteria**
  1. Given the Journal, when I filter, then I can filter by drink and by coffee;
     and by setup only when my household has more than one setup.
  2. Given any filter is set, when I look, then each one is visible with its
     value and can be removed on its own, and "All" clears every filter in one
     tap.
  3. Given filters are set, when I show older shots, then the filters still
     apply.
  4. Given no shot matches the filters, when I look, then I'm told no shots
     match those filters and offered to clear them, with the filters still
     visible.
  5. Given a filter, when I use it, then it works by keyboard and is announced
     with its value and how to remove it.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (S-02, PEC-14). Design SCR-SHOTS step 2. Free-text search and
  charts are out. Grind period dividers follow the shots listed
  (STORY-04-01-04).

#### STORY-02-06-05: Open the journal on what I'm brewing

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want the Journal to open on the drink and
  coffee I've got on Brew, so that the shots I care about are already in
  front of me.
- **Acceptance criteria**
  1. Given a drink and coffee are selected on Brew (including one I just
     changed there), when I open the Journal from the tab bar, then it's
     filtered to that drink and coffee, and the setup isn't filtered.
  2. Given nothing is selected on Brew yet (first run), when I open the Journal,
     then no filter is set.
  3. Given I opened a shot from the Journal, when I come back, then the filters
     I left are kept.
  4. Given I open the Journal from a coffee's screen, when it opens, then it's
     filtered to that coffee only, with no drink filter.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (S-02 "opens pre-filtered"). Wired in when EPIC-02-02 ships;
  until then the Journal opens unfiltered (epic dependency note). Whether
  people expect the tab to remember their last filters instead is a design
  concern to watch.

#### STORY-02-06-06: Dial in from a past shot

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to start a new shot from one I made
  before, so that I can get back to a shot that worked without re-entering
  it.
- **Acceptance criteria**
  1. Given a shot's details, when I choose "dial in from this", then the shot log
     opens with that shot's values, puck prep and milk, on its setup, drink and
     coffee, and I'm told which shot it starts from.
  2. Given that coffee has no open portion, when I dial in from the shot, then
     I'm first asked which bag to use, as for a pull (STORY-02-02-03).
  3. Given that coffee is finished, when I dial in from the shot, then I'm told
     there's no coffee left and can add a bag.
  4. Given the shot's setup isn't my current setup, when I save the new shot,
     then that setup becomes current.
  5. Given I dial in from a shot and save or leave, when I look at the past
     shot, then it's unchanged; nothing is saved unless I save the new shot.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. Design SCR-SHOT "Dial in from this", which answers two
  EPIC-02-06 open questions: it uses the past shot's setup, and it's offered
  on one-tap shots too. Warning when the past shot is from an earlier grind
  period isn't in scope (EPIC-04-01 open question).

**Coverage:** all In items covered: the Journal, filters, the default from
Brew, the coffee filter for the coffee screen, editing and "Dial in from
this".

---

## INIT-03: Always know what beans you have and how old they are

### EPIC-03-01: Add a bag of beans

#### STORY-03-01-01: Find my coffee in the catalog

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to find the coffee I bought by
  roaster and name, so that my bag is linked to the right coffee.
- **Acceptance criteria**
  1. Given the catalog has roasters and coffees, when I search, then matching
     coffees are listed with their roaster.
  2. Given I haven't searched, when I look, then coffees I've bought recently
     come first.
  3. Given a coffee or roaster has another name, when I search by it, then it's
     found.
  4. Given a catalog entry has been merged, when I search or pick it, then I get
     the surviving entry.
  5. Given my household added an unverified coffee, when I search, then I see it
     marked as added by us; other households' unverified coffees never appear.
  6. Given my search finds nothing, when I look at the results, then I'm offered
     to add it (STORY-01-06-02).
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged.

#### STORY-03-01-02: Add a bag with its dates and weight

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to record a bag's weight and
  whichever dates it shows, quickly, so that Tare knows how much I have and how
  fresh it is.
- **Acceptance criteria**
  1. Given I've picked a coffee, or started from that coffee's own screen, when
     I choose a common bag size or enter another weight and save, then the bag
     is added and I see it with one portion holding the whole bag.
  2. Given I add a bag, when I enter dates, then I can give a roast date and,
     if the bag shows them, a packing date and a best-before date; none is
     required.
  3. Given I add a bag, when I look at the dates, then I'm told the freshness
     clock uses the roast date, else the packing date, and with only a
     best-before date shows the time left instead.
  4. Given I add a bag, when I want to, then I can also give its lot code and
     purchase date; the purchase date starts as today.
  5. Given I don't give a weight, when I save, then I'm asked for it and nothing
     is saved.
  6. Given I buy another bag of the same coffee, when I add it, then it's a
     separate bag with its own dates and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (packing date; started from a coffee screen,
  STORY-03-06-04). Design SCR-BAG-ADD. SQ-09.

#### STORY-03-01-03: Start with the whole bag ready to brew

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want a new bag to be ready to brew from
  straight away, so that I don't have to split or set it up first.
- **Acceptance criteria**
  1. Given I add a bag, when it's saved, then it holds one portion with the
     whole bag's weight, shown as unopened.
  2. Given the bag was just added, when I log a shot, then its portion is
     offered as coffee to brew from.
  3. Given I log the first shot against it, when the shot is saved, then the
     portion is marked opened that day.
  4. Given I split the bag later, when I look at it, then it's still one bag with
     one roast date and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 1
- **Notes:** Unchanged. DQ-06.

#### STORY-03-01-04: See what's on hand

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want Beans to show every bag I still have,
  with its portions, so that I know what coffee is in the house.
- **Acceptance criteria**
  1. Given I have bags that aren't finished, when I open Beans, then On hand
     shows each one with its coffee, roaster and roasting clock, and its
     portions with their state, how long each has been open and the amount
     left.
  2. Given a bag, when I open it, then I see its own screen with its facts,
     portions and recipes.
  3. Given every portion of a bag is finished, when I look at On hand, then the
     bag is no longer there; it lives on in Tried and on its coffee's screen.
  4. Given I have nothing on hand and have never brewed, when I open Beans, then
     I'm told there are no beans yet and offered to add a bag, as the only main
     action.
  5. Given I have nothing on hand but have tried coffees, when I open Beans, then
     On hand says so and offers to add a bag, and Tried shows below.
  6. Given a coffee was merged into another catalog entry, when I see my bag,
     then it shows the surviving coffee's details.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (Beans and On hand, S-02; title was "See what's in my
  pantry"). Grouping by state is STORY-03-02-05. Tried is EPIC-03-06. Design
  SCR-PANTRY (Beans).

**Coverage:** all In items covered, including the Beans tab and On hand.

### EPIC-03-02: Split and freeze a bag

#### STORY-03-02-01: Split a bag into portions

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to split off part of a bag by
  weight, such as half for the freezer, so that Tare tracks each part on its
  own.
- **Acceptance criteria**
  1. Given a portion, when I split off a weight, then a new portion with that
     weight is created in the same bag, and I see what remains as I choose.
  2. Given I split, when I look at the options, then the new portion is set to
     go in the freezer, which I can turn off.
  3. Given a portion, when I choose how much to split off, then I can't take
     more than what's left in it.
  4. Given I want more than two portions, when I split again, then I can keep
     splitting one portion at a time.
  5. Given I split a portion, when I look at the bag and its old shots, then the
     roast date, lot and other bag details are unchanged and shown once, and
     the old shots are still there.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged. DQ-14.

#### STORY-03-02-02: Record freezing and thawing

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to record when I froze and thawed a
  portion, so that its freshness and state are right.
- **Acceptance criteria**
  1. Given a portion that isn't frozen, when I mark it frozen, then the date is
     saved; it's today unless I choose an earlier date when I set it.
  2. Given a frozen portion, when I mark it thawed, then the date is saved the
     same way.
  3. Given a portion that was frozen and thawed, when I look at what I can do,
     then freezing it again isn't offered.
  4. Given I choose a thaw date before its freeze date, when I confirm, then I'm
     told and nothing is saved.
  5. Given a portion in any state, when I look at what I can do, then only the
     actions that make sense for that state are offered, and there's no action
     to change a date already set.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (review M4). Design SH-PORTION-ACTIONS, SH-DATE.

#### STORY-03-02-03: Record opening and finishing a portion

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to record when I opened and finished
  a portion, so that Tare knows which coffee is in use.
- **Acceptance criteria**
  1. Given an unopened or thawed portion, when I mark it opened, then the date
     is saved; it's today unless I choose an earlier date when I set it.
  2. Given an unopened portion that isn't frozen, when I log the first shot
     against it, then it's marked opened that day without my doing anything.
  3. Given a frozen portion, when I log a shot against it, then it isn't marked
     opened or thawed.
  4. Given an open or thawed portion, when I mark it finished, then the date is
     saved and it's no longer offered for new shots; once every portion of its
     bag is finished, the bag leaves On hand.
  5. Given a finished portion, when I look at its shots, then they're still
     there.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (frozen picks; review M4; On hand). DQ-06 (round 3).
  SQ-15.

#### STORY-03-02-04: See where each portion is

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to see each portion's state in
  words, so that I know what I can brew with.
- **Acceptance criteria**
  1. Given a portion never opened or frozen, when I see it, then it shows as
     unopened.
  2. Given an opened portion not frozen and not finished, when I see it, then it
     shows as on the counter.
  3. Given a portion frozen and not thawed, when I see it, then it shows as
     frozen, even if it was opened before freezing, and isn't treated as open;
     once thawed, it shows as thawed and is open again.
  4. Given a finished portion, when I see it, then it shows as finished.
  5. Given a portion's dates are set, when I see it, then its state follows
     those dates.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (review M5; review M4 wording).

#### STORY-03-02-05: See what's on hand grouped by state

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want On hand grouped into open, unopened
  and frozen, so that I can tell at a glance what's in use, what's waiting and
  what's in the freezer.
- **Acceptance criteria**
  1. Given bags with an open portion, when I look at On hand, then they're
     under "open", earliest opened first, matching the bag a one-tap pull would
     use.
  2. Given bags with no open portion but at least one on the counter (unopened,
     or thawed and not yet opened), when I look, then they're under
     "unopened".
  3. Given bags whose remaining portions are all in the freezer, when I look,
     then they're under "frozen".
  4. Given a bag that's half open and half frozen, when I look, then it appears
     once, under "open", with both portions and their states.
  5. Given a group has no bags, when I look, then that group isn't shown.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (S-02 "On hand, grouped by state"; epics revision 10). Design
  SCR-PANTRY (Beans): a bag appears once, in its first qualifying group.
  Calculated, never stored.

**Coverage:** all In items covered, including On hand groups.

### EPIC-03-03: Know how fresh your beans really are

#### STORY-03-03-01: See how long since my coffee was roasted

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want each bag to show how long since its
  coffee was roasted, worked out from whatever date the bag shows, so that I
  know how old my coffee is without Tare guessing.
- **Acceptance criteria**
  1. Given a bag with a roast date, when I see it, then it shows the days since
     roast, less any days in the freezer.
  2. Given a bag with no roast date but a packing date, when I see it, then it
     shows how long since packing, labelled as packed, less any freezer days.
  3. Given a bag with only a best-before date, when I see it, then no age is
     shown; it shows the time left until best-before, or how long ago it passed.
  4. Given a bag with no dates, when I see it, then I'm told its age is unknown
     and offered to add a date.
  5. Given a day passes while the coffee isn't frozen, when I see it again, then
     the roasting clock has gone up by one.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (rewritten; resolves review B1: no estimated age, INIT-03
  Q2 closed). Design EPIC-03-03. Shown on the bag, On hand and Brew. A single
  combined freshness score is deferred to INIT-04 (S-02).

#### STORY-03-03-02: Freezing pauses both clocks

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want time in the freezer not to count
  toward either freshness clock, so that frozen coffee shows its real
  freshness.
- **Acceptance criteria**
  1. Given a portion frozen 10 days after roast and still frozen, when I see it
     later, then its roasting clock stays at 10 days, and in place of its opened
     clock it shows as paused in the freezer.
  2. Given a portion opened for 3 days, then frozen, then thawed, when I see it,
     then it shows 3 days open, rising again from there.
  3. Given two portions of the same bag, one frozen and one not, when I see
     them, then their clocks differ.
  4. Given a bag's own screen, when I look at a portion that has been frozen,
     then I can see how many freezer days weren't counted.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (both clocks).

#### STORY-03-03-03: See freshness when logging, and spot frozen-ground shots

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want to see how long a portion has been
  open while logging, and know which shots were ground from frozen, so that I
  can explain shots that behaved differently.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I've chosen the coffee, then I see how long
     that portion has been open, and if it's frozen, that it's from frozen.
  2. Given a shot was pulled while its portion was frozen and not yet thawed,
     when I see it in my Journal or its details, then it's marked as from
     frozen.
  3. Given a shot was pulled after the portion was thawed, or never frozen,
     when I see it, then it's not marked.
  4. Given a portion's freeze and thaw dates are set, including backdated when
     set, when I see its shots, then the mark follows those dates.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (opened clock; review M4). X-1 is closed (TQ-04).

#### STORY-03-03-04: See how long each portion has been open

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want each portion to show how long it's
  been open to the air, so that I know the freshness that matters most at the
  machine.
- **Acceptance criteria**
  1. Given an opened portion, when I see it, then it shows how many days it's
     been open (or that it was opened today), less any freezer days.
  2. Given an unopened portion, when I see it, then it shows as not opened, and
     no opened clock is counted.
  3. Given a bag with several portions, when I see the bag, then each portion
     shows its own opened clock, and the bag shows one roasting clock.
  4. Given the coffee in use on Brew is opened, when I look, then Brew shows its
     roasting clock and opened clock together on one line, worded so the two
     can't be confused.
  5. Given a day passes while the portion isn't frozen, when I see it again, then
     its opened clock has gone up by one.
- **Source sections:** S-02, S-09
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. The S-09 "days open" input. Both clocks also feed
  suggestion explanations (STORY-02-03-05).

**Coverage:** all In items covered, including clocks as suggestion
explanations.

### EPIC-03-04: See how much coffee is left

#### STORY-03-04-01: See how much is left

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each portion, bag and Brew to show
  how much coffee is left, so that I know when to buy more.
- **Acceptance criteria**
  1. Given a portion with shots, when I see it, then it shows its weight minus
     the doses of every shot against it, measured and one-tap, in grams.
  2. Given a bag with several portions, when I see it, then it shows the total
     left; Brew shows what's left in the portion in use, and nothing if it's
     unknown.
  3. Given I undo or edit a shot, when I see the portion, then what's left
     follows.
  4. Given logged doses add up to more than the portion, when I see it, then it
     shows zero, never a negative amount, and I'm offered to weigh what's left.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged (wording only). SQ-14 (both doses count).

#### STORY-03-04-02: Weigh what's left

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want to weigh what's left in a portion and
  record it, so that Tare's count matches my real stock.
- **Acceptance criteria**
  1. Given an open or thawed portion, when I record its weight now, then what's
     left shows that weight.
  2. Given I recorded a weight, when I log shots afterwards, then their doses
     are taken off that weight.
  3. Given I recorded several weights, when I see the portion, then the latest
     one is used.
  4. Given saving the weight fails, when I look, then I'm told and can try
     again.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged.

#### STORY-03-04-03: See which bags are open or finished

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each bag to show whether it's open or
  finished, so that I know at a glance which coffee is in use.
- **Acceptance criteria**
  1. Given a bag with at least one portion open (opened, not finished and not in
     the freezer), when I see it, then it shows as open.
  2. Given every portion of a bag is finished, when I see it, then it shows as
     finished and is no longer on hand; it's listed on its coffee's screen.
  3. Given a bag with no open portion, when I see it, then its portions show
     their states.
  4. Given a portion's dates are set, when I see the bag, then its status
     follows those dates.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (review M5, M4; finished bags leave On hand).

**Coverage:** all In items covered.

### EPIC-03-05: Know when you'll run out, and find any coffee

#### STORY-03-05-01: See how fast we use coffee

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see how much coffee my household
  really uses, so that I know how fast we go through it.
- **Acceptance criteria**
  1. Given enough finished portions, when I look at Beans, then I see a usage
     rate worked out from finished portions, doses, stock checks and purchase
     dates, and can see what it's based on.
  2. Given not enough history yet, when I look, then I'm told Tare is still
     learning, rather than shown a guess.
  3. Given new shots or finished portions, when I look again, then the rate
     follows.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (Beans wording). X-2.

#### STORY-03-05-02: See when we'll run out

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see roughly when we'll run out,
  counting the freezer, so that I can buy coffee in time.
- **Acceptance criteria**
  1. Given a usage rate and coffee left across all portions, when I look at On
     hand, then I see roughly how many days of coffee we have, and how much of it
     is in the freezer.
  2. Given no usage rate yet, when I look, then no estimate is shown.
  3. Given I add a bag, when I look again, then the estimate grows.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (On hand, design round 6). INIT-03 Q1.

#### STORY-03-05-03: See how much of our coffee gets logged

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see how much of the coffee we
  finish shows up in our logs, so that I know how far to trust the numbers.
- **Acceptance criteria**
  1. Given finished portions with logged doses, when I look at what the
     estimate is based on, then I see the share of their weight that logged
     shots account for.
  2. Given no finished portions yet, when I look, then I'm told it isn't
     available.
- **Source sections:** S-02
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged.

#### STORY-03-05-04: Narrow Beans by roaster, roast level, origin or rating

- **Parent:** EPIC-03-05
- **Story:** As a home enthusiast, I want to narrow Beans to a roaster, roast
  level, origin or rating, so that I can find a coffee in a long Tried list.
- **Acceptance criteria**
  1. Given On hand and Tried, when I filter by roaster, roast level, origin or
     rating, then both show only matching coffees.
  2. Given any filter is set, when I look, then it's visible with its value,
     removable on its own, and "All" clears every filter.
  3. Given no coffee matches, when I look, then I'm told and offered to clear the
     filters.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** New (S-02 Beans filters; epics revision 10). Origin needs a
  catalog field the schema doesn't have yet, and "rating" for a coffee isn't
  defined (EPIC-03-05 open questions). Reuses the Journal's filter pattern.

**Coverage:** all In items covered, including Beans filters.

### EPIC-03-06: See every coffee you've tried

New MVP epic (epics revision 10, PEC-15).

#### STORY-03-06-01: See every coffee I've tried

- **Parent:** EPIC-03-06
- **Story:** As a home enthusiast, I want Beans to list every coffee I've ever
  brewed, even after the bag is gone, so that I can find one worth buying
  again.
- **Acceptance criteria**
  1. Given my household has brewed coffees, when I open Beans, then Tried,
     below On hand, shows one row per coffee with at least one shot (measured
     or one-tap), newest-had first.
  2. Given a row, when I look at it, then I see the coffee, its roaster, when
     it was last had (for example "3 weeks ago") and how many bags of it we've
     had, finished or not.
  3. Given a bag added but never brewed, when I look at Tried, then its coffee
     isn't there until its first shot; it shows under On hand only.
  4. Given two catalog entries were merged, when I look at Tried, then they show
     as one row.
  5. Given I have bags but haven't brewed yet, when I look at Tried, then I'm told
     coffees I brew will appear here.
  6. Given a row, when I tap it, then the coffee's screen opens (STORY-03-06-03).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (S-02). DQ-27 is the working assumption (tried means at least
  one shot). No filters in the MVP (STORY-03-05-04, Next). Calculated, never
  stored. With many bags on hand, Tried can sit below the fold; its heading
  stays reachable (design concern).

#### STORY-03-06-02: See how a coffee's shots went, in words

- **Parent:** EPIC-03-06
- **Story:** As a home enthusiast, I want each tried coffee to say in a few
  words how its shots went, so that I remember which coffees worked for me.
- **Acceptance criteria**
  1. Given a coffee with three or more rated shots, when I see its row, then it
     says "mostly good" when most ratings are 4 or 5, "mostly off" when most are
     1 or 2, and "mixed" otherwise.
  2. Given a coffee with one or two rated shots, when I see its row, then it says
     "last rated N of 5".
  3. Given a coffee with no ratings but good or off reactions, when I see its
     row, then it says "mostly good" or "mostly off" from those reactions.
  4. Given a coffee with neither, when I see its row, then it says "no ratings
     yet".
  5. Given any summary, when I see it, then it's words only, never a colour or a
     score badge, and it describes the shots, not the coffee.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** New. DQ-28 is the working assumption. It ignores personas in the
  MVP (one persona); once sub personas exist it should be per persona
  (EPIC-03-06 and EPIC-05-01 open questions). How ties are counted in
  "most" is for the tech lead.

#### STORY-03-06-03: Open a coffee's own screen

- **Parent:** EPIC-03-06
- **Story:** As a home enthusiast, I want one screen per coffee with its
  details, recipes, recent shots and bags, so that everything I know about a
  coffee is in one place.
- **Acceptance criteria**
  1. Given I open a coffee from Tried or from a bag on hand, when the screen
     opens, then I see its name, roaster, roast level and tasting notes when the
     catalog has them, and its summary line.
  2. Given the coffee has recipes, when I look, then I see one per setup and
     drink, as resolved by STORY-02-01-01, and can dial in from one or change
     it.
  3. Given the coffee has shots, when I look, then I see up to five recent ones,
     and "all shots of this coffee" opens the Journal filtered to this coffee
     only.
  4. Given the coffee's bags, when I look, then I see each bag, on hand or
     finished, with its date, state and weight, and can open it.
  5. Given a section has nothing in it (no recipes, shots or bags), when I look,
     then that section says so in one line.
  6. Given the screen fails to load, when I look, then I'm told and can try
     again.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. Design SCR-COFFEE (light). Editing the coffee's catalog
  entry isn't in the MVP, apart from STORY-01-06-09 for a household's own
  unverified entries.

#### STORY-03-06-04: Add a bag of a coffee I've tried

- **Parent:** EPIC-03-06
- **Story:** As a home enthusiast, I want to add a new bag straight from a
  coffee's screen, so that buying a coffee again takes a few taps.
- **Acceptance criteria**
  1. Given a coffee's screen, when I choose to add a bag of it, then I go
     straight to the bag details with that coffee chosen, without searching.
  2. Given I save the bag, when I return, then it's under On hand and listed on
     the coffee's screen.
  3. Given no bag of this coffee is on hand, when I open its screen, then adding
     a bag is the main action; given one is on hand, it's still offered, but not
     as the main action.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 1
- **Notes:** New. Design SCR-COFFEE "add a bag of this". From a Tried row to a
  new bag is three taps plus save. Depends on STORY-03-01-02.

**Coverage:** all In items covered. Out: filters (Next), editing catalog
entries, recommendations (Later).

---

## INIT-04: Grind settings stay meaningful through maintenance and time

### EPIC-04-01: Record maintenance on your equipment

#### STORY-04-01-01: Log maintenance on a part

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want to log dated maintenance on my
  machine, grinder or basket, such as new burrs or a clean, so that I have a
  record of what was done and when, without losing my setup.
- **Acceptance criteria**
  1. Given a part I own, when I add maintenance with its kind (new burrs, clean,
     re-zero, repair, other), its date and an optional note, then it's saved on
     that part.
  2. Given I add maintenance, when I set its date, then it's today unless I
     choose an earlier date.
  3. Given a part with maintenance, when I look at it, then I see its events,
     newest first, with kind, date and the start of any note.
  4. Given I logged maintenance on a part, when I look at my setups, then the
     part is in the same setups as before, and their recipes are still one tap
     away.
  5. Given a part with no maintenance, when I look at it, then I'm told there's
     none and can add some.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (on a part; no retire; servicing never makes a new setup).
  Design SCR-UNIT, SH-MAINTENANCE.

#### STORY-04-01-02: Mark a recalibration

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want to mark grinder maintenance as a
  recalibration, so that it's clear my dial numbers changed meaning.
- **Acceptance criteria**
  1. Given I'm logging maintenance on a grinder, when I record it, then I can
     mark it as a recalibration.
  2. Given I choose new burrs or a re-zero, when I log it, then it's marked as a
     recalibration unless I turn that off.
  3. Given a recalibration, when I see the grinder's events or the dividers in
     my Journal, then it's marked in words.
  4. Given maintenance on a machine or basket, when I log it, then no
     recalibration mark is offered.
- **Source sections:** S-01, S-02
- **Priority:** MVP
- **Size:** 1
- **Notes:** Updated (a flag, closed by TQ-05). DQ-15 for the default.

#### STORY-04-01-03: Know my grinder's current grind period

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want my grinder to show when its current
  grind period started and how many shots are in it, so that I know which of
  my settings still compare.
- **Acceptance criteria**
  1. Given a grinder with maintenance, when I look at it, then I see when its
     current grind period started and how many shots on setups with that grinder
     are in it.
  2. Given a grinder with no maintenance, when I look at it, then I'm told all
     its shots are in one period.
  3. Given I add or back-date an event, when I look again, then the period start
     and shot count follow, and no past shot is changed.
  4. Given maintenance on a machine or basket, when I look at shots, then grind
     periods aren't affected.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (title was "Split grind history at each grinder event"; 3
  points became 2; shots reach a grinder through their setup). PEC-06.

#### STORY-04-01-04: See maintenance in my journal

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want my Journal to show where I serviced
  my grinder, so that I can see which shots came before and after.
- **Acceptance criteria**
  1. Given a grinder event inside the listed period, when I look at my Journal,
     then a divider appears at the event's place in time, naming the grinder (by
     nickname, else model), the kind of work, the date, and whether it was a
     recalibration.
  2. Given an event on a day I also pulled shots, when I look, then the divider
     sits among that day's shots at its time.
  3. Given the Journal is filtered, when I look, then dividers show only for the
     grinders of the shots listed.
  4. Given maintenance on a machine or basket, or on a grinder with no shots in
     the list, when I look, then no divider is shown.
  5. Given I add or back-date an event, when I look again, then its divider moves
     and no shot changes; and opening a divider shows that grinder.
- **Source sections:** S-02, S-04
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (Journal; filtered lists; title was "See maintenance in
  my recent shots"). PEC-06. Design EPIC-04-01 step 3. Read aloud to
  screen-reader users.

**Coverage:** all In items covered.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

#### STORY-04-02-01: Grind that follows bean age

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want my recipe's grind adjusted for how my
  coffee has aged, so that I don't have to re-dial as a bag ages.
- **Acceptance criteria**
  1. Given a recipe and enough measured shots to estimate aging, when I open the
     recipe, then I see a suggested grind adjusted for the coffee's current
     freshness.
  2. Given there aren't enough shots, when I open the recipe, then I see the
     pinned grind unchanged.
  3. Given I see a suggestion, when I check the stored recipe, then it's
     unchanged.
  4. Given the suggestion, when I see it, then it moves in the grinder's own
     coarser or finer direction.
- **Source sections:** S-01, S-02, S-04
- **Priority:** Next
- **Size:** 5
- **Notes:** Lightly updated (the two clocks). INIT-04 Q3 (which clock, or
  both); size may grow.

#### STORY-04-02-02: Grind that follows this bag's character

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want my recipe's grind adjusted for how
  this particular bag has been behaving, so that a bag that runs a bit fast or
  slow is accounted for.
- **Acceptance criteria**
  1. Given measured shots of this bag that differ consistently from the recipe,
     when I open the recipe, then the suggested grind accounts for that
     difference.
  2. Given a new bag of the same coffee, when I open the recipe, then the
     previous bag's character isn't applied.
  3. Given no measured shots of this bag yet, when I open the recipe, then no
     bag adjustment is applied.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 5
- **Notes:** Unchanged.

#### STORY-04-02-03: Only measured shots count as measurements

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want only the shots I actually measured to
  shape the suggestion, so that one-tap shots don't fake a trend.
- **Acceptance criteria**
  1. Given one-tap and measured shots, when the suggestion is worked out, then
     only measured shots' values are used as measurements.
  2. Given one-tap shots with no "off" reaction, when it's worked out, then they
     count only as "the recipe was fine".
  3. Given a bag with only one-tap shots, when I open the recipe, then the
     suggestion isn't moved by them.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (prep). **SQ-18:** are shots with and without WDT or a
  puck screen compared as equals? Open for this epic.

#### STORY-04-02-04: Recent shots count most

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want recent shots to count more than old
  ones, so that the suggestion follows how my coffee behaves now.
- **Acceptance criteria**
  1. Given older and newer measured shots that disagree, when the suggestion is
     worked out, then it's closer to the newer shots.
  2. Given shots older than the window, when it's worked out, then they have
     little or no effect.
  3. Given the same shots, when it's worked out twice, then it's the same both
     times.
- **Source sections:** S-01, S-02
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. INIT-04 Q2.

#### STORY-04-02-05: Only compare shots from the same grind period

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want shots from before my last grinder
  maintenance left out of the suggestion, so that a burr change or re-zero
  isn't mistaken for drift.
- **Acceptance criteria**
  1. Given shots before and after a grinder event, when the suggestion is
     worked out, then only shots in the current period are used.
  2. Given a new period with no measured shots yet, when I open the recipe, then
     no drift adjustment is applied.
  3. Given maintenance on a machine or basket, when it's worked out, then periods
     aren't affected.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 2
- **Notes:** Lightly updated (part kinds).

#### STORY-04-02-06: See the suggested grind where I brew

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want to see the suggested grind, with my
  recipe's grind and a short reason, on Brew and in the pre-filled log, so
  that I trust it and use it without looking it up.
- **Acceptance criteria**
  1. Given a suggestion differs from the pinned grind, when I see Brew, then I
     see the suggested grind, my recipe's grind, and a short reason.
  2. Given the pre-filled log, when it opens, then grind starts at the
     suggestion, with the recipe's grind shown as what it was.
  3. Given I pull a one-tap shot with a suggestion shown, when it's recorded,
     then it records the grind I was shown.
  4. Given no suggestion applies, when I see Brew, then only the pinned grind is
     shown.
- **Source sections:** S-02, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (overlap note). When this drift adjustment and an MVP
  one-change suggestion (EPIC-02-03) both apply to a pre-filled log, which wins
  isn't in the spec (EPIC-04-02 open question). INIT-04 Q4.

**Coverage:** all In items covered.

### EPIC-04-03: Re-dial once after maintenance and keep every recipe

#### STORY-04-03-01: Re-dial one coffee and get the shift

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want to be prompted to re-dial one coffee
  after grinder maintenance and have Tare work out how far my dial moved, so
  that I don't have to re-dial every coffee.
- **Acceptance criteria**
  1. Given I logged a grinder event, when I open Brew, then I'm invited, calmly,
     to re-dial one coffee, and accepting opens a dial-in.
  2. Given a recipe pinned before the event on a setup with that grinder, when I
     pin a new recipe for the same coffee on that setup after it, then Tare
     proposes a shift in grinder units, with a one-line explanation.
  3. Given the beans aged between the two dial-ins, when the shift is proposed,
     then the aging estimate is taken off first.
  4. Given there's no recipe from before the event for the coffee I re-dial,
     when I pin, then no shift is proposed and I'm told why.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 5
- **Notes:** Updated (prompt; setups). INIT-04 Q3.

#### STORY-04-03-02: Confirm or edit the shift

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want to confirm or change the proposed
  shift, so that I decide how my old recipes are mapped.
- **Acceptance criteria**
  1. Given a proposed shift, when I confirm it, then it's saved on the event with
     the re-dial it came from.
  2. Given a proposed shift, when I change it and confirm, then my value is
     saved.
  3. Given a confirmed shift, when I later edit it, then the new value is used
     from then on.
  4. Given I decline, when I look at old recipes, then they're shown unshifted.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged.

#### STORY-04-03-03: Old recipes read right after maintenance

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want every recipe pinned before the
  maintenance to show the right grind now, so that all my coffees work again
  after one re-dial.
- **Acceptance criteria**
  1. Given a confirmed shift on a grinder event, when I open any recipe pinned
     before the event on a setup with that grinder, then its grind is shown with
     the shift applied.
  2. Given the shifted recipe, when I check what's stored, then it's unchanged.
  3. Given a recipe on a setup with a different grinder, when I open it, then no
     shift is applied.
  4. Given several events on one grinder, when I open an old recipe, then each
     confirmed shift after it is applied in order.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (setups). EPIC-04-03 open question: chaining.

**Coverage:** all In items covered.

### EPIC-04-04: Keep recipes right after new burrs of a different design

#### STORY-04-04-01: Work out a stretch from two or more re-dials

- **Parent:** EPIC-04-04
- **Story:** As a home enthusiast, I want Tare to notice when new burrs change
  what each dial step means, so that both fine and coarse recipes stay right.
- **Acceptance criteria**
  1. Given two or more coffees re-dialed after the same grinder event, when the
     second re-dial is pinned, then Tare proposes a stretch factor as well as a
     shift, explained in plain words.
  2. Given only one coffee re-dialed, when I look at the event, then the stretch
     stays at 1.
  3. Given the re-dials disagree too much to fit, when Tare proposes, then I'm
     told the fit is uncertain.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged.

#### STORY-04-04-02: Confirm or edit the stretch

- **Parent:** EPIC-04-04
- **Story:** As a home enthusiast, I want to confirm or change the stretch,
  like the shift, so that I stay in control of how old recipes are mapped.
- **Acceptance criteria**
  1. Given a proposed stretch, when I confirm or change it, then it's saved on
     the event.
  2. Given a confirmed stretch and shift, when I open an old recipe, then its
     grind is shown as old grind times stretch plus shift.
  3. Given I edit the stretch later, when I open old recipes, then they follow
     the new value; stored recipes are unchanged.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged.

**Coverage:** all In items covered.

---

## INIT-05: Brew for the whole household, each to their own taste

### EPIC-05-01: Brew for someone else in the household

#### STORY-05-01-01: Add a profile for someone I brew for

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want to add a sub persona for someone I
  brew for who doesn't use Tare, so that their coffee is tracked separately
  from mine.
- **Acceptance criteria**
  1. Given my household, when I add a sub persona with a name, then it's saved in
     my household with no login of its own.
  2. Given I try to add one without a name, when I save, then I'm asked for a
     name and nothing is saved.
  3. Given I added a sub persona, when anyone in my household looks at profiles,
     then they see it.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged.

#### STORY-05-01-02: Rename or remove a profile

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want to rename or remove a sub persona,
  so that our profiles stay up to date.
- **Acceptance criteria**
  1. Given a sub persona, when I rename it, then the new name is shown
     everywhere, including on its past shots.
  2. **Placeholder, not testable until decided (EPIC-05-01 open question:
     delete):** given a sub persona with shots, when I remove it, then what
     happens to its shots and recipes follows the Head of Product's decision.
     If removal is ruled out, this becomes "removing isn't offered".
  3. Given the main persona, when I look at removing it, then I can't.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 2
- **Notes:** Updated (review m7: explicit placeholder).

#### STORY-05-01-03: Choose who I'm brewing for on Brew

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want to pick a profile on Brew, so that
  the drink, coffee and recipe shown are theirs.
- **Acceptance criteria**
  1. Given my household has more than one persona, when I pick one on Brew, then
     it shows that persona's usual drink at this time of day, the coffee and
     their recipe on the current setup.
  2. Given I pick a persona with no recipe for the drink shown on this setup,
     when I look, then "Dial in" is offered.
  3. Given I pull a shot, log one, or answer how it tasted after picking a
     persona, when it's saved, then it's for that persona.
  4. Given a household with only the main persona, when I open Brew, then
     nothing about picking a persona is in my way.
- **Source sections:** S-02, S-04, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (setup; taste answers follow the persona). DQ-18: the
  current setup follows that persona's last shot (EPIC-05-01 open question:
  confirm that's wanted).

#### STORY-05-01-04: Log and pin for someone else

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want shots I pull for someone else to
  record their taste and that I made them, so that their history is theirs and
  mine stays clean.
- **Acceptance criteria**
  1. Given I log a shot for a sub persona, when it's saved, then it records the
     sub persona as whose taste and me as who logged it.
  2. Given I pin a recipe from that shot, when it's saved, then it's that sub
     persona's recipe, not mine.
  3. Given my Journal or a shot's details, when I look, then I can tell whose
     taste each shot records.
  4. Given my own recipes, when I brew for a sub persona, then mine are
     unchanged.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (Journal). "Just right" answers given on someone's
  behalf are second-hand; a persona filter for the Journal and Tried isn't in
  the spec (EPIC-05-01 open questions).

**Coverage:** all In items covered.

### EPIC-05-02: Invite them to take over their own profile (Later, light)

#### STORY-05-02-01: Invite someone to my household

- **Parent:** EPIC-05-02
- **Story:** As a household member, I want to invite the person behind a sub
  persona to join my household, so that they can use Tare themselves.
- **Acceptance criteria**
  1. Given a sub persona, when I invite its person, then an invite is created
     that only they can use to join my household.
  2. Given an invite, when it's used or withdrawn, then it can't be used again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged. INIT-05 Q2.

#### STORY-05-02-02: Join a household from an invite

- **Parent:** EPIC-05-02
- **Story:** As the person behind a sub persona, I want to sign in with Google
  and join the household that invited me, so that I share its kitchen.
- **Acceptance criteria**
  1. Given an invite, when I accept it and sign in with Google, then I become a
     member of that household with a role.
  2. **Placeholder (EPIC-05-02 open question):** given I already have my own
     Tare account and household, when I join, then what happens to it is
     decided when this epic is re-planned.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Later
- **Size:** 5
- **Notes:** Updated (review m7: explicit placeholder).

#### STORY-05-02-03: Claim my profile and keep its history

- **Parent:** EPIC-05-02
- **Story:** As a newly joined household member, I want to claim the sub
  persona made for me, so that it becomes my main persona with all its
  history.
- **Acceptance criteria**
  1. Given I joined from an invite for a sub persona, when I claim it, then it
     becomes my main persona, with all its shots and recipes.
  2. Given a sub persona is claimed, when anyone else tries to claim it, then
     they can't.
  3. Given I join without a sub persona to claim, when I start, then I get a new
     main persona (pending confirmation).
- **Source sections:** S-02, S-04, S-08
- **Priority:** Later
- **Size:** 5
- **Notes:** Unchanged. INIT-05 Q3.

#### STORY-05-02-04: My shots follow my own consent

- **Parent:** EPIC-05-02
- **Story:** As a main persona who claimed my profile, I want my shots shared
  only if I opt in, whoever logged them, so that no one shares my data for me.
- **Acceptance criteria**
  1. Given a claimed persona whose user hasn't opted in, when shots are logged
     for it by anyone, then none are eligible for the network.
  2. Given an unclaimed sub persona, when shots are logged for it, then none are
     ever eligible.
- **Source sections:** S-02, S-07, S-08
- **Priority:** Later
- **Size:** 2
- **Notes:** Unchanged.

### EPIC-05-03: Keep your coffee history when you change phones

#### STORY-05-03-01: Link my account to Google

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google from my
  profile and keep everything I've logged, so that my history isn't lost if my
  phone is, or if my browser clears its storage.
- **Acceptance criteria**
  1. Given I've been using Tare without signing in, when I link Google from my
     profile, then all my parts, setups, beans, recipes and shots are still
     there, unchanged, and my profile says my account is linked.
  2. Given I linked Google, when I see my profile, then its name or label is
     unchanged; nothing is taken from my Google account.
  3. Given the Google account is already linked to another Tare account, when I
     try to link it, then I'm told, and my current data stays as it is.
  4. Given linking fails or I cancel, when I return, then I'm still in my account
     with all my data, and can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (eviction risk; wording). DQ-16 is a design
  question.

#### STORY-05-03-02: Reach my history on another phone

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google on a new
  phone and find my history, so that changing phones doesn't mean starting
  again.
- **Acceptance criteria**
  1. Given I linked Google on one device, when I sign in with the same Google
     account on another, then I reach the same account and household.
  2. Given I'm signed in on a new device, when I look, then I see all my parts,
     setups, beans, recipes and shots.
  3. Given I open Tare on a new device for the first time, when it starts, then
     I'm offered, quietly, to sign in with Google before a new account is set up,
     and I can ignore it.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (wording).

#### STORY-05-03-03: Be reminded once to keep my history safe

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want one gentle reminder to link my
  account once I've built up some history, so that I don't lose it without
  being nagged.
- **Acceptance criteria**
  1. Given I haven't linked Google, when I pin my first recipe or log my tenth
     shot, whichever comes first, then Brew invites me to link, once.
  2. Given the invitation, when I dismiss it, then it never comes back; I can
     still link from my profile.
  3. Given I accept it, when I link, then it behaves as STORY-05-03-01.
- **Source sections:** S-02
- **Priority:** Next
- **Size:** 1
- **Notes:** Unchanged (wording only).

**Coverage:** all In items covered.

---

## INIT-06: Dial in a new bag in fewer shots with AI and the community

All Later and light; the design gives direction only (section 6). Each AI
feature ships with evals and observability (S-01). Eval stories are
**enabler placeholders** (review m7, SQ-13), to be re-framed when INIT-06 is
re-planned. AI output is always a suggestion the user can accept or ignore.

### EPIC-06-01: Scan a bag instead of typing it

#### STORY-06-01-01: Photograph a bag to fill in its details

- **Parent:** EPIC-06-01
- **Story:** As a home enthusiast, I want to photograph a bag and have its
  roaster, name, roast level and tasting notes filled in, so that I don't
  type them.
- **Acceptance criteria**
  1. Given a clear bag photo, when I scan it, then roaster, name, roast level
     (from the fixed list) and up to four tasting notes are filled in.
  2. Given a detail isn't on the label, when I scan, then it's left empty, not
     guessed.
- **Source sections:** S-09, S-01
- **Priority:** Later
- **Size:** 5
- **Notes:** Unchanged. INIT-06 Q5.

#### STORY-06-01-02: Review a scan before adding the bag

- **Parent:** EPIC-06-01
- **Story:** As a home enthusiast, I want to check and correct what was scanned
  before saving, so that a wrong read doesn't end up in Beans.
- **Acceptance criteria**
  1. Given a scan result, when I review it, then I can correct any field before
     the bag is added.
  2. Given the scanned coffee isn't in the catalog, when I continue, then I can
     add it (EPIC-01-06).
- **Source sections:** S-09, S-02
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged (wording only).

#### STORY-06-01-03: A scanner that's checked before each release (enabler placeholder)

- **Parent:** EPIC-06-01
- **Story:** As a home enthusiast, I want the scanner tested against known
  labels and monitored, so that it stays accurate as it changes.
- **Acceptance criteria**
  1. Given a set of labelled bag photos, when the scanner is evaluated, then a
     pass rate is reported against a target.
  2. Given the scanner is live, when it runs, then failures and results are
     observable.
- **Source sections:** S-01, S-09
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged. Enabler placeholder.

### EPIC-06-02: Get a grounded fix when a shot goes wrong

#### STORY-06-02-01: Get a fix for a bad shot

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want a deeper explanation of what to
  change after a bad shot, on my own setup and in the right direction on my
  dial, so that the next shot is better.
- **Acceptance criteria**
  1. Given an off shot with "just right" answers or tags, when I ask the Coach,
     then I get a short diagnosis and one action for my setup, consistent with
     the MVP's suggestion rules (STORY-02-03-06).
  2. Given my grinder's coarser direction and my basket's dose range, when the
     action changes grind or dose, then it stays in the right direction and
     range.
  3. Given "channelling seen" and no WDT ticked on the shot, when the Coach
     advises, then it suggests WDT.
- **Source sections:** S-09, S-08, S-01, S-02, S-03
- **Priority:** Later
- **Size:** 5
- **Notes:** Updated (builds on the rules; the "just right" model; the shot's
  WDT tick). S-09's prompt still names scores and defects and should be
  updated when re-planned (EPIC-06-02 open question).

#### STORY-06-02-02: Advice grounded in guides and my manuals

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want the Coach's advice based on
  extraction guides and the manuals for my equipment, so that I can trust it.
- **Acceptance criteria**
  1. Given my setup, when the Coach advises, then its advice draws on the guides
     and the manuals for my machine and grinder.
  2. Given no manual exists for my equipment, when it advises, then it falls
     back to the guides.
- **Source sections:** S-01, S-09, S-03
- **Priority:** Later
- **Size:** 8
- **Notes:** Unchanged. **Flagged at 8: split** when re-planned.

#### STORY-06-02-03: A Coach that's checked before each release (enabler placeholder)

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want the Coach tested against known
  scenarios and monitored, so that its advice is safe and accurate.
- **Acceptance criteria**
  1. Given the Golden Dataset, when the eval runs, then each case is scored on
     safety, accuracy and palate alignment, and passes only if all are 4 or
     above.
  2. Given the Coach is live, when it runs, then results are observable.
- **Source sections:** S-09, S-01
- **Priority:** Later
- **Size:** 5
- **Notes:** Unchanged. The MVP's rule scenarios (STORY-02-03-06) could seed
  the Golden Dataset (INIT-06 Q6).

### EPIC-06-04: Tare learns your palate as you log

#### STORY-06-04-01: Learn my taste without a survey

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want Tare to learn what I like for each
  kind of drink and milk from how I answer and rate, so that advice fits my
  taste without filling in forms.
- **Acceptance criteria**
  1. Given a persona's "just right" answers and ratings, when their target is
     learned, then it's learned per drink style and milk (an ideal straight
     espresso and an ideal oat flat white are different targets), with no
     preference questions asked.
  2. Given two personas, when their targets are learned, then each uses only its
     own shots.
  3. Given ratings and the coffees' catalog tasting notes, when flavour
     preferences are inferred, then no flavour question is ever asked.
- **Source sections:** S-01, S-02, S-06, S-04
- **Priority:** Later
- **Size:** 5
- **Notes:** Updated (S-02 per persona, drink style and milk). What makes two
  drinks one "style" isn't defined (EPIC-06-04 open question). INIT-06 Q2.

#### STORY-06-04-02: One-tap shots and reactions count the right way

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want my quiet one-tap shots and quick
  reactions to count as light signals, so that my taste isn't skewed by
  copied values.
- **Acceptance criteria**
  1. Given one-tap shots, when the target is learned, then their values are never
     used as measurements.
  2. Given silence, reactions and the answers on off one-tap shots, when the
     target is learned, then silence counts as a weak "fine", reactions as
     stronger signals, and the answers as the persona's own judgement.
- **Source sections:** S-02, S-06
- **Priority:** Later
- **Size:** 3
- **Notes:** Updated (answers on off one-tap shots, DQ-23).

#### STORY-06-04-03: Palate learning that's checked and monitored (enabler placeholder)

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want palate learning tested and
  monitored, so that it doesn't drift away from my taste.
- **Acceptance criteria**
  1. Given an eval set of logging histories, when it runs, then the learned
     targets are scored against expected ones.
  2. Given it's live, when it runs, then results are observable.
- **Source sections:** S-01
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged. Enabler placeholder.

### EPIC-06-05: Share your shots, with your consent

#### STORY-06-05-01: Opt in or out of sharing

- **Parent:** EPIC-06-05
- **Story:** As a main persona, I want to choose whether my own shots are
  shared with the community, so that sharing is always my decision.
- **Acceptance criteria**
  1. Given I haven't opted in, when I use Tare, then none of my shots are shared.
  2. Given I opt in, when I later opt out, then no further shots are shared.
- **Source sections:** S-07, S-05, S-02
- **Priority:** Later
- **Size:** 2
- **Notes:** Unchanged. INIT-06 Q7.

#### STORY-06-05-02: Only complete, measured shots are shared, with how they tasted to me

- **Parent:** EPIC-06-05
- **Story:** As a home enthusiast, I want only my complete measured shots
  shared, together with how they tasted to me, so that others can tell
  whether my palate is like theirs.
- **Acceptance criteria**
  1. Given a measured shot with grind, dose, yield and time, for a persona
     claimed by a user who opted in, when it's saved, then it's eligible, and it
     carries the persona's "just right" answers and rating.
  2. Given a one-tap shot, a partial log, or a shot for an unclaimed persona,
     when it's saved, then it's never eligible.
- **Source sections:** S-05, S-07, S-02
- **Priority:** Later
- **Size:** 3
- **Notes:** Updated (taste answers shared to compare palates, S-02). X-3.

#### STORY-06-05-03: Shared shots can't be traced to me

- **Parent:** EPIC-06-05
- **Story:** As a home enthusiast, I want shared shots stripped of anything
  personal, so that sharing doesn't expose me.
- **Acceptance criteria**
  1. Given a shared shot, when it reaches the network, then it carries no
     personal details, only a cohort ID.
  2. Given my shared shots, when they're in the network, then they can't be
     traced back to my account.
- **Source sections:** S-07
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged. INIT-06 Q4.

### EPIC-06-06: Start a new bag from the community, tuned to you

#### STORY-06-06-01: Start a new bag from shots by people with my taste

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want a starting recipe for a new bag from
  community shots of the same coffee by people whose palate resembles mine,
  so that I dial in with fewer shots.
- **Acceptance criteria**
  1. Given community shots of the same coffee logged within 7 days of their bag
     being opened, when I add a new bag, then I'm offered starting values from
     them, with where they came from.
  2. Given those shots, when the start is worked out, then each counts only as
     far as its contributor's palate resembles mine; using the same coffee isn't
     enough on its own.
  3. Given no such shots, when I add a bag, then no community start is offered.
- **Source sections:** S-05, S-03, S-02
- **Priority:** Later
- **Size:** 5
- **Notes:** Updated (learn only from similar palates, S-02 and S-05 C). How a
  community grind maps to my grinder is open (EPIC-06-06 open question).

#### STORY-06-06-02: Trust the right contributors more

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want shots from verified pros to count
  more than others, among people with a palate like mine, so that my starting
  point is reliable.
- **Acceptance criteria**
  1. Given shots from enthusiasts and verified pros, when the start is worked
     out, then they're weighted by contributor level on top of palate
     similarity.
  2. Given a contributor's level changes, when the start is worked out again,
     then the new weight is used.
- **Source sections:** S-05, S-02
- **Priority:** Later
- **Size:** 3
- **Notes:** Updated (combined with palate similarity). INIT-06 Q3.

#### STORY-06-06-03: Warn me when a pro's recipe aims for another taste

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want to be warned when a pro's recipe
  aims for a different taste from mine, with a version nudged toward my
  palate, so that I don't chase someone else's cup.
- **Acceptance criteria**
  1. Given a pro's recipe whose target differs from mine, when it's offered, then
     I see a Match Score Warning, which isn't styled as a shot warning.
  2. Given the warning, when I look, then I'm offered a version adjusted toward
     my palate.
- **Source sections:** S-05, S-03
- **Priority:** Later
- **Size:** 5
- **Notes:** Unchanged.

#### STORY-06-06-04: Community starts that are checked and monitored (enabler placeholder)

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want community starts tested and
  monitored, so that they actually save me shots.
- **Acceptance criteria**
  1. Given an eval set, when it runs, then the starts are scored against known
     good recipes.
  2. Given it's live, when it runs, then results are observable.
- **Source sections:** S-01, S-05
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged. Enabler placeholder.

### EPIC-06-07: Merge duplicate catalog entries, with AI suggestions

#### STORY-06-07-01: Merge a duplicate into one entry

- **Parent:** EPIC-06-07
- **Story:** As a home enthusiast, I want duplicates of my grinder, basket or
  coffee merged into one entry, so that my history lines up with everyone
  else's.
- **Acceptance criteria**
  1. Given a confirmed merge, when it's applied, then the duplicate stays as a
     pointer and everything that used it now shows the surviving entry.
  2. Given a merge, when it's decided, then who or what suggested it, its
     confidence, reason and time are logged.
  3. Given a merge, when it's applied, then nothing is deleted.
- **Source sections:** S-02, S-08
- **Priority:** Later
- **Size:** 5
- **Notes:** Unchanged. SQ-12. Merged parts may make two setups identical; for
  the re-plan.

#### STORY-06-07-02: Get suggested duplicates with a reason

- **Parent:** EPIC-06-07
- **Story:** As a home enthusiast, I want likely duplicates suggested with a
  confidence and reason, so that duplicates are caught without guesswork.
- **Acceptance criteria**
  1. Given catalog entries, when the matcher runs, then it suggests likely
     duplicates from names, regional pages and page content, each with a
     confidence and reason.
  2. Given a suggestion, when no person or reviewed rule confirms it, then
     nothing is merged.
- **Source sections:** S-02, S-08
- **Priority:** Later
- **Size:** 5
- **Notes:** Unchanged.

#### STORY-06-07-03: A matcher that's checked before each release (enabler placeholder)

- **Parent:** EPIC-06-07
- **Story:** As a home enthusiast, I want the matcher tested on known
  duplicates and look-alikes, so that different products are never merged.
- **Acceptance criteria**
  1. Given known duplicates, when the eval runs, then the share found is
     reported.
  2. Given known look-alikes that must not merge, when the eval runs, then any
     suggested merge among them is a failure.
  3. Given it's live, when it runs, then results are observable.
- **Source sections:** S-02, S-08
- **Priority:** Later
- **Size:** 3
- **Notes:** Unchanged. Enabler placeholder.

---

## Stories to split or cut

- **Split:** STORY-06-02-02 (8), when EPIC-06-02 is re-planned.
- **Watch:**
  - STORY-02-03-06 (5, the suggestion rules). If it runs long, ship puck prep
    and grind first, then yield, dose, temperature and milk.
  - STORY-02-01-06 (5).
  - STORY-04-02-01 and 04-02-02 (5 each).
- **MVP size (review m9):** the MVP is 228 points. The Head of Product wants a
  fully usable logging tool, so these levers keep that intact:
  - EPIC-01-06 (26): ship coffee additions and the duplicate check (01-06-01
    to 05) first, then the capability stories (01-06-06 to 09).
  - Defer pieces of the new work. STORY-03-06-02 (Tried summary, 2) and
    STORY-02-06-05 (the Journal's default filter, 2) are small and separable.
  - STORY-01-06-09 (3), STORY-01-01-03 (2) and STORY-02-01-02 (3), as before.
  - STORY-01-02-09 criterion 4 (90-day grouping) can wait.
- **Could merge:** STORY-01-01-06 into 01-01-05; STORY-02-03-07 into 02-03-05.

## Not covered

- The "ran fast" warning: never a warning; time appears only in suggestion
  reasons (DQ-09).
- Reopening on the last screen used (revision 2's STORY-01-01-05 criterion 5):
  cut as unrequested scope (review m8); the design still describes it.
- Correcting a portion's dates after they're set (review M4): a Next
  candidate.
- Changing the milk on Brew before a one-tap pull (EPIC-02-02 open question).
- Steamed-milk temperature and flavour notes (S-02: not recorded or asked).
- Editing or deleting a maintenance event, deleting a setup or a shot,
  removing a recipe (SQ-05) or bag override (SQ-11), and reopening a finished
  portion (SQ-15).

## Open questions for the Head of Product

### Most pressing

These shape MVP stories:

1. **SQ-19, suggestion step sizes.**
   - "A bit" is one step and "much" two for grind.
   - The other levers use the design's examples (2 g yield, 0.5 g dose,
     1 °C, about 30 ml milk) as working assumptions.
   - Confirm them, along with who writes the scenario set and what passing
     means (EPIC-02-03 open question). STORY-02-03-06 depends on both.
2. **SQ-21, when temperature is suggested.** S-02 puts it after dose. The
   design suggests it only when balance is still off and grind is at its
   limit. The stories follow the design.
3. **Typical milk amounts per starter drink** (EPIC-01-01 open question). S-02
   gives only ratios. STORY-01-01-02 and 01-03-07 need numbers.
4. **SQ-20, the basket's dose-range question.**
   - It's in scope (STORY-01-06-01) but has no designed flow yet.
   - The seed list must give every basket a dose range (DQ-22).
   - Who curates the seed is still open.
5. **DQ-28, the Tried summary** ignores personas in the MVP. Confirm it's
   acceptable until sub personas arrive.
6. **SQ-14, doses from an "off" shot and its fix.** Both count (DQ-12).
7. **DQ-11 fallback ranges** for equipment marked "not sure".
8. **INIT-02 Q1** still blocks EPIC-02-04 (Next).

The design's working assumptions DQ-02 to DQ-07, DQ-12 to DQ-15 and DQ-17 to
DQ-28 are used as written and cited where they apply.

### Story questions (SQ)

Closed:

- **SQ-02** (retire): no retire exists (S-02).
- **SQ-17** (one-tap taste, review M1): one-tap shots carry "just right"
  answers and tags, never a rating (DQ-23, epics revision 9).
- **X-1** (timestamps; listed for completeness): closed by TQ-04.

Still open:

- **SQ-04** (STORY-01-06-05): can a household add links or aliases to verified
  entries?
- **SQ-05** (STORY-02-01-03): can a recipe be unpinned?
- **SQ-09** (STORY-03-01-02), narrowed: should future roast or packing dates be
  rejected?
- **SQ-11** (EPIC-02-04): can a bag's own recipe be removed?
- **SQ-12** (STORY-01-06-03, 06-07-01): the catalog reviewer isn't a spec user
  type.
- **SQ-13** (Later eval stories): re-frame them when re-planning, or name a team
  role.
- **SQ-14** (STORY-03-04-01): doses from an "off" one-tap shot and its fix.
- **SQ-15** (STORY-03-02-03): can a finished portion be reopened?
- **SQ-16** (STORY-01-01-07): first-run checklist ownership.

New:

- **SQ-18** (STORY-04-02-03, Next): should drift detection compare shots with
  and without prep as equals?
- **SQ-19** (STORY-02-03-06): step sizes per lever (see "Most pressing").
- **SQ-20** (STORY-01-06-01): no designed flow for a basket's dose range.
- **SQ-21** (STORY-02-03-06): when the temperature lever applies.
