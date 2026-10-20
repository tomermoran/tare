# Tare user stories (revision 3, after the plan review)

Source: `planning/drafts/epics.md` (final, revision 8, 30 epics),
`planning/drafts/design.md` (approved after review round 3, with round 4's
applied decisions), `planning/drafts/review.md` (the plan review) and
`docs/spec.md`, sections S-01 to S-09. S-01 and S-02 override older sections
where they differ. `planning/drafts/initiatives.md` was read for context.

**Status: revision 3, for the Head of Product's approval.** Revision 2 was
approved. This revision applies the Head of Product's decisions on the plan
review (recorded in S-02, S-04 and S-08), epics revisions 6 to 8, design
rounds 3 and 4, and the review findings the story-writer owns. Where the
documents differed, the design was the tiebreaker. No GitHub issues have been
created.

## Changes in this revision

Revision 2 had 119 stories. Revision 3 has 121: 6 added, 4 retired, 59
updated (41 substantive, 18 light) and 56 unchanged. Retired IDs are listed
below and are never reused. Each story's Notes begin with "New", "Updated",
"Lightly updated", "Unchanged in substance" or "Unchanged" (relative to
revision 2).

### What drove the changes

1. **"Setup" replaces "kit" and "toolkit".** The mechanical rename was checked
   by hand, and awkward phrases were fixed ("piece of kit" became "part",
   "add a part", "my equipment").
2. **A setup is a fixed combination of machine, grinder and basket** (S-02,
   S-04, S-08). Each part is an exact catalog model, so a Normcore 18 g
   basket and a Crema Coffee 18 g basket are different parts. Any change
   means a different setup, and the same combination reuses its setup and
   recipes. Recipes belong to one setup. There is no setup editing and no
   retire. The current setup is the one from the persona's last shot (DQ-18),
   and it can be switched on Home and in the shot log (PEC-09). Shots record
   their setup, not a separate grinder and machine.
3. **Puck prep:** WDT and puck screen are checkboxes on shots and recipes,
   copied by one-tap pulls. They start from the recipe, else the last shot on
   this setup, else off. Portafilter, tamper and scale aren't tracked.
4. **Two freshness clocks, both paused by freezing** (S-02). Since roasting:
   roast date, else packing date, else "best before in N days", never an
   invented age. Since opening: per portion. Home shows both on one line, and
   the roasting clock alone while the portion is unopened. This resolves
   review blocker B1.
5. **"Open" excludes frozen portions** (S-02, review M5). One-tap never uses
   frozen coffee on its own.
6. **The iOS storage-eviction risk is accepted** for the MVP (S-02, review M6).
7. **Review findings owned here:** M1, M4, m1, m2, m6, m7, m8, m10. See below.

### Added (6)

| ID | Title | Why |
|---|---|---|
| STORY-01-02-08 | Change a part and get the right setup | Fixed setups: the builder finds or makes a setup (S-02, design SCR-TOOLKIT) |
| STORY-01-02-09 | See my setups and know which one is current | Current setup (DQ-18), naming (DQ-21), setup list (SCR-KIT) |
| STORY-01-03-06 | Record whether I used WDT or a puck screen | Puck prep checkboxes (S-02, S-08) |
| STORY-02-01-06 | Dial in on a new setup from my closest setup's recipe | Recipes belong to one setup; closest-setup head start (S-02, DQ-19, DQ-20) |
| STORY-02-02-07 | Switch setup on the home screen and in the shot log | PEC-09 |
| STORY-03-03-04 | See how long each portion has been open | Since-opening clock (S-02) |

### Retired (4)

| ID | Title | Why |
|---|---|---|
| STORY-01-02-03 | Retire a unit and keep its history | No retire action in the MVP (S-02). Past shots keep their setup because setups never change. |
| STORY-01-02-06 | Edit a setup | Setups are never edited (S-02); changing a part is STORY-01-02-08. |
| STORY-01-02-07 | Be warned before swapping a setup's machine or grinder | No swaps exist; PEC-07 is superseded. |
| STORY-02-01-05 | Re-dial a recipe whose kit left its toolkit | "Needs re-dial" is gone; replaced by STORY-02-01-06. Review M3 (retired units) no longer applies. |

### Updated (59)

Substantive updates (41):

- EPIC-01-01:
  - 01-01-01: X-1 is closed.
  - 01-01-03: the eviction risk is noted.
  - 01-01-05: criterion 5 (reopen on the last screen) is cut, review m8.
  - 01-01-07: the checklist step includes the basket.
- EPIC-01-02:
  - 01-02-01: exact models; stock baskets listed first, DQ-22.
  - 01-02-02: three part kinds; the setups a part is in.
  - 01-02-04: rewritten around the setup builder; a basket is required.
  - 01-02-05: three parts; no default name.
- EPIC-01-03:
  - 01-03-01: the current setup; frozen portions last.
  - 01-03-02: grind follows the setup's grinder.
  - 01-03-03: the shot records its setup.
- EPIC-01-04: 01-04-01 (°F is display-only, closed by S-08).
- EPIC-01-05: 01-05-01 (leaving saves, and the failed-save path, review M2).
- EPIC-01-06: 01-06-01 (baskets can be added; no capability questions for
  baskets).
- EPIC-02-01:
  - 02-01-01: pins record the setup and prep; this story now owns recipe
    resolution, review m10.
  - 02-01-02: prep in recipe mode.
  - 02-01-04: recipes per drink and setup; the resolution note moved to
    02-01-01.
- EPIC-02-02:
  - 02-02-01: the current setup, both clocks, the prep line, updated DQ-03.
  - 02-02-02: prep is copied; frozen isn't open, review M5.
  - 02-02-03: frozen portions are listed last and picked only by hand; 2
    points became 3.
  - 02-02-05: the two no-recipe states; 1 point became 2.
  - 02-02-06: the frozen-only coffee case; the reset time is made exact,
    review m7.
- EPIC-02-03:
  - 02-03-02: prep is pre-filled.
  - 02-03-03: dial-in with no open portion, review m6; 2 points became 3.
- EPIC-02-06:
  - 02-06-02: one-tap shots carry a reaction, not taste, review M1.
  - 02-06-03: setup parts by maker and model; prep.
- EPIC-03-01:
  - 03-01-02: packing date and other dates; the best-before toggle is gone.
  - 03-01-04: clocks; "open" excludes frozen.
- EPIC-03-02:
  - 03-02-02: dates are set once and can be backdated, review M4.
  - 03-02-03: same as 03-02-02; frozen picks don't open a portion.
  - 03-02-04: opened-then-frozen portions; review M4 wording.
- EPIC-03-03:
  - 03-03-01: rewritten as the since-roasting clock, review B1.
  - 03-03-02: freezing pauses both clocks.
  - 03-03-03: the since-opening clock in the log; review M4 wording.
- EPIC-03-04: 03-04-03 (frozen isn't open; review M4 wording).
- EPIC-04-01:
  - 04-01-01: maintenance is on a part, and the setup stays the same.
  - 04-01-02: the recalibration flag is closed by TQ-05.
- Next:
  - 02-04-01: an explicit choice; the default is a placeholder, review m7.
  - 04-02-03: open question on prep comparability.
  - 04-03-03: recipes on setups with that grinder.
  - 05-01-02: explicit placeholder, review m7.

Light updates (18): wording for setups, parts or the two clocks in 01-01-04,
01-01-06, 01-03-04, 01-04-02, 01-06-03, 01-06-06, 01-06-08, 02-03-01,
02-06-01, 04-01-03, 04-01-04, 04-02-01, 04-02-05, 04-03-01, 05-01-03,
05-03-01, 05-03-02 and 06-02-01.

All 23 Later stories gain source sections (review m2). The 5 Later eval
stories are marked as enabler placeholders (review m7, SQ-13). These count as
light-format changes, not as updates.

### Review findings handled here

| Finding | How |
|---|---|
| B1 | STORY-03-03-01: no estimated age; best-before shows time left, per S-02. |
| M1 | STORY-02-06-02 and 02-06-03: one-tap shots carry a reaction only, never rating, scores or defects (design SCR-SHOT and S-02 as tiebreakers). Confirm (SQ-17). |
| M2 | STORY-01-05-01 matches the design: leaving saves; a failed save offers retry or leave without saving. |
| M3 | No longer applies: there is no retire (STORY-01-02-03 retired). |
| M4 | STORY-03-02-02, 03-02-03, 03-02-04, 03-03-03 and 03-04-03 say "when a portion's dates are set"; correcting a date isn't in the MVP. |
| M5 | STORY-02-02-01, 02-02-02, 02-02-03, 03-01-04, 03-02-04, 03-04-03: "open" excludes frozen. |
| M6 | STORY-01-01-01 and 01-01-03 note the accepted eviction risk. |
| m1 | X-1, INIT-01 Q5, INIT-03 Q2 and the recalibration question are marked closed. |
| m2 | Every Later story has source sections. |
| m6 | STORY-02-03-03 criteria 4 and 5. |
| m7 | STORY-02-04-01 and 02-02-06 are made testable. STORY-05-01-02 and 05-02-02 carry explicit placeholders. Eval stories are marked as enabler placeholders. |
| m8 | STORY-01-01-05 criterion 5 is cut: it came from the design, not the spec. Listed under "Not covered" for the Head of Product to restore if wanted. |
| m10 | Recipe resolution is owned by STORY-02-01-01 everywhere. |

### Questions

- **Closed:** SQ-02 (no retire, S-02). X-1 is closed by TQ-04 and TQ-07.
- **New:** SQ-17 (one-tap taste, M1) and SQ-18 (prep and drift, for
  EPIC-04-02).
- **Still open:** SQ-04, SQ-05, SQ-09 (narrowed), SQ-11, SQ-12, SQ-13, SQ-14,
  SQ-15 and SQ-16.

See "Open questions" at the end.

## How to read this file

- **IDs:** `STORY-II-EE-SS` (initiative, epic, story). Parent is the epic ID.
  IDs stay stable across revisions, and a retired ID is never reused. Gaps in
  numbering are retired stories.
- **Grouping:** by initiative, then by epic in ID order, whatever the
  priority. The priority is on every story and in the summary.
- **Personas:** stories are written for the spec's user type, the everyday
  home enthusiast (S-01), shortened to "home enthusiast". Where the household
  matters, they use the S-04 roles: household member, main persona, sub
  persona. No real people are named.
- **Words:** a "setup" is the machine, grinder and basket a shot is pulled
  with; each is a "part", always named by maker and model. "Open" means
  opened, not finished and not in the freezer (S-02).
- **Sizes:** rough points (1, 2, 3, 5, 8). Anything at 8 is flagged.
- **Design references:** acceptance criteria describe behaviour. Notes cite
  the design's screens (`SCR-*`), sheets (`SH-*`) and assumptions (`DQ-*`).
  Where a story depends on a design assumption, that assumption is its working
  assumption until the Head of Product says otherwise.
- **Open questions:** questions carried in `epics.md` and `initiatives.md` are
  referenced by their IDs (`INIT-NN Q#`, `X-2`, `X-3`) or as "EPIC-NN-NN open
  question: topic". Story questions are `SQ-NN`, listed at the end.
- **Cross-cutting constraints** from `epics.md` (localization, Japandi design,
  calculated-never-stored values, timestamps in milliseconds with local days
  in the device's time zone, no AI in Phase 1, following catalog merge
  pointers, setups never change) and the design's foundations (section 1)
  apply to every story and aren't repeated in each one.
- **Detail level:** MVP and Next epics have full stories with Given/When/Then
  acceptance criteria. **Later epics have lighter stories**: ID, statement,
  source sections, priority, size and two or three brief acceptance criteria.
  Those epics will be re-planned before they're built, so their stories are
  placeholders for scope and size, not ready for build.

## Summary

| Epic | Title | Priority | Stories | Points |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | MVP | 7 | 18 |
| EPIC-01-02 | Describe your setup once | MVP | 6 | 17 |
| EPIC-01-03 | Log a shot in seconds | MVP | 6 | 16 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | MVP | 2 | 6 |
| EPIC-01-05 | Say how it tasted | MVP | 4 | 8 |
| EPIC-01-06 | Add what's missing from the catalog | MVP | 9 | 26 |
| EPIC-02-01 | Pin the recipe that worked | MVP | 5 | 16 |
| EPIC-02-02 | Pull your daily shot in one tap | MVP | 7 | 21 |
| EPIC-02-03 | Fix a bad shot from your recipe | MVP | 3 | 8 |
| EPIC-02-04 | Give one bag its own recipe | Next | 2 | 5 |
| EPIC-02-05 | Make the drink list yours | Next | 4 | 7 |
| EPIC-02-06 | See your recent shots | MVP | 3 | 8 |
| EPIC-03-01 | Add a bag to your pantry | MVP | 4 | 10 |
| EPIC-03-02 | Split and freeze a bag | MVP | 4 | 11 |
| EPIC-03-03 | Know how fresh your beans really are | MVP | 4 | 10 |
| EPIC-03-04 | See how much coffee is left | MVP | 3 | 7 |
| EPIC-03-05 | Know when you'll run out | Next | 3 | 8 |
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
| MVP | 15 | 71 | 190 | 69 stories, 177 points |
| Next | 8 | 27 | 74 | unchanged |
| Later | 7 | 23 | 92 | unchanged |
| **Total** | **30** | **121** | **356** | 119 stories, 343 points |

The MVP grew by 13 points:

- **Retired, −9:** setup editing (2), the swap warning (2), retire (2) and
  "needs re-dial" (3).
- **Added, +19:** change a part (3), current setup and the setup list (3),
  puck prep (2), the closest-setup dial-in (5), switching setup on Home and
  in the log (3), and the since-opening clock (3).
- **Resized, +3:** frozen portions in the bag chooser, the two no-recipe
  states on Home, and dial-in with no open portion (+1 each).

The review (m9) already flagged the MVP's size. The cut candidates are
under "Stories to split or cut". Later points are rough placeholders.

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
- **Notes:** Updated (X-1 closed: timestamps are integer milliseconds, TQ-04).
  Design SCR-START. Uses Firebase anonymous sign-in per device (S-02).
  Accepted risks (S-02): a lost or reset device, or Safari clearing a site's
  storage after a period without use, loses the data until EPIC-05-03.

#### STORY-01-01-02: Get a starter drink list in my language

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my household to start with a list of
  common drinks, so that I can pick what I'm making without setting anything
  up.
- **Acceptance criteria**
  1. Given a new household is created, when I look at my drinks, then I see
     Espresso, Ristretto, Lungo, Americano, Cortado, Flat white, Cappuccino,
     Latte and Macchiato.
  2. Given the app is in a supported language other than English, when I see
     the starter drinks, then their names are shown in that language.
  3. Given I change the app's language, when I look at the starter drinks
     again, then their names follow the new language and no drink is lost or
     duplicated.
  4. Given two households, when one is created, then it gets its own copy of
     the list, separate from any other household's.
- **Source sections:** S-02, S-04, S-08, S-07
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged. Editing the list is EPIC-02-05 (Next). `has_milk`
  must be set on each starter row, but no behaviour depends on it yet
  (EPIC-01-03 open question: `has_milk`).

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
- **Notes:** Updated (review M6). Design SCR-PROFILE, opened from the persona
  label on Home. Criterion 5 is how the accepted risks show: a lost or reset
  device, and Safari's storage eviction, both accepted for the MVP (S-02). It
  is stated without alarm; EPIC-05-03 replaces it with the linked state.
  EPIC-01-01 open question: is a rename in the MVP? The epic and the design
  include it.

#### STORY-01-01-04: Keep my kitchen private to my household

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my equipment, setups, coffee,
  recipes and shots to belong to my household only, so that no one else sees
  or changes them.
- **Acceptance criteria**
  1. Given I add anything (a part, a setup, a bag, a recipe, a shot), when
     it's saved, then it belongs to my household.
  2. Given another household exists, when its user browses Tare, then they
     can't see or change anything that belongs to my household.
  3. Given I use Tare, when I browse my setups, pantry, recipes or shots, then
     I only see my household's records, plus shared catalog entries.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (wording). Visibility of catalog entries a
  household adds is STORY-01-06-03. The household itself is never shown in the
  MVP (S-04).

#### STORY-01-01-05: Move around the app

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want to reach brewing, my shots, my
  pantry and my setup from anywhere, and to be brought back where I was after
  a side task, so that I never get lost at the machine.
- **Acceptance criteria**
  1. Given I'm on any main screen, when I choose Brew, Shots, Pantry or Setup,
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
- **Source sections:** S-06, S-01
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Revision 2's criterion 5 (reopen on the last screen if
  the app was used a few minutes ago) is cut. It came from the design, not the
  spec (review m8); see "Not covered". Design 2.1 (screen map, tabs NC-01,
  full-screen tasks, return-to). The shell is the frame only: each screen's
  content belongs to its own epic.

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
- **Notes:** Lightly updated (criterion 2, after the design's one-primary fix,
  review m4). Design 1.2 (states), NC-10, NC-11, NC-12. Later stories rely on
  these patterns and don't repeat them, except where a failure has its own
  behaviour.

#### STORY-01-01-07: Get started with a short checklist

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want the first screen to show me the few
  steps to my first shot, so that setup feels short and I always know what's
  next.
- **Acceptance criteria**
  1. Given nothing is set up, when I open Brew, then I see three steps: add my
     machine, grinder and basket; add a bag of coffee; pull my first shot.
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
- **Notes:** Updated (the basket is a required part, S-02). Design 2.3
  (first-run state), DES-02-02-04. Ownership between EPIC-01-01 and
  EPIC-02-02 is still SQ-16; placed here because it ships before Home's
  recipe card. Depends on STORY-01-02-02 and STORY-03-01-02 for its targets.

**Coverage:** all In items covered, including the app shell (PEC-01). Out
items (Google sign-in, drink list editing, sub personas, consent) are in
their own epics.

### EPIC-01-02: Describe your setup once

Retired in this revision: STORY-01-02-03 (retire), STORY-01-02-06 (edit a
setup) and STORY-01-02-07 (swap warning). See "Changes in this revision".

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
  5. Given a model is sold under a regional name, when I search by that alias
     (for example the UK name of a US-branded machine), then the model is
     found.
  6. Given a catalog entry has been merged into another, or my household added
     an unverified entry, when I search, then I only see the surviving entry,
     and my own unverified entries are marked as added by us; other
     households' unverified entries never appear.
  7. Given I can't find it, when I look at the results, then I can always
     choose to add it (STORY-01-06-01), with my search text carried over.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (exact models, three kinds, stock baskets first). Design
  SCR-CATALOG-PICK (shared with coffee, STORY-03-01-01) and SCR-UNIT-ADD.
  DQ-22 is the working assumption: the seed catalog includes each machine
  maker's stock baskets by model. Confirm the seed covers them. Who curates the
  seed list is still the EPIC-01-02 open question.

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
  3. Given I've picked a machine or grinder, when I review it before saving,
     then I can see what it can control (for example exact temperature and its
     range); a basket shows no controls.
  4. Given I own two of the same model, when I add both, then they are two
     separate parts, each with its own history.
  5. Given a part, when I open it, then I see which of my setups it's in.
  6. Given I have no parts yet, when I open the Setup screen, then I'm offered
     to add my machine.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (three kinds; the setups a part is in). Design
  SCR-UNIT-ADD, SCR-KIT and SCR-UNIT. Portafilter, tamper and scale aren't
  tracked; WDT and puck screen are prep checkboxes (STORY-01-03-06). There is
  no retire (S-02). Adding a part never changes a setup by itself
  (STORY-01-02-08).

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
  6. Given I confirm, when I return, then the setup I confirmed is my current
     setup (STORY-01-02-09).
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (rewritten for fixed setups; title was "Group my kit into
  a toolkit"). Design SCR-TOOLKIT (the setup builder, rows and match line).
  Setups are matched by their exact set of parts (S-08). DQ-22 is the working
  assumption: the basket is required, and the machine maker's stock baskets
  are seeded and listed first, so most people can find theirs. Several setups
  can share a part.

#### STORY-01-02-05: Make my first setup in one tap

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want Tare to offer to make my first setup
  as soon as I've added a machine, a grinder and a basket, so that my first
  shot isn't held up by a form.
- **Acceptance criteria**
  1. Given my household has exactly one machine, one grinder and one basket
     and no setup, when I accept the offer, then a setup of those three is made
     without my typing anything, shown by its parts, and it becomes my current
     setup.
  2. Given my household has more than one part of any kind and no setup, when
     I accept the offer, then I go to choosing parts with the most recently
     added part of each kind already chosen.
  3. Given I've just added the last of the three required parts, when I save
     it, then I'm offered the setup straight away.
  4. Given the offer, when I look at it, then it names the three parts it will
     use, by maker and model.
  5. Given any setup exists, when I look at the Setup screen or the checklist,
     then the offer is gone.
- **Source sections:** S-02, S-04, S-08, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (three parts; no default name). DQ-01 is closed by S-08:
  a setup's name is optional, and without one it's shown by its parts. Design
  EPIC-01-02 step 7.

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
     the part, then I'm asked whether to use it in my setup. Saying yes starts
     from my current setup with the new part in place of the old one; saying
     no changes nothing.
  6. Given I want to change a setup's parts in place, when I look for a way to,
     then none is offered: every change of parts goes through choosing a
     combination.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (fixed setups, S-02). Design SCR-TOOLKIT starting points,
  "use the new part?" (SCR-UNIT-ADD step 6), and SCR-KIT's change-a-part
  action. Servicing a part (new burrs, a clean) is maintenance, never a new
  setup (STORY-04-01-01). The same part-change from Home or the shot log is
  STORY-02-02-07.

#### STORY-01-02-09: See my setups and know which one is current

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to see my setups with the one I'm
  using now marked, and to switch or name them, so that I always know which
  setup my shots are recorded against.
- **Acceptance criteria**
  1. Given I've logged shots, when I look at my setups, then the current
     setup is the one my last shot (measured or one-tap) was pulled with, and
     it's shown first and marked as current.
  2. Given I haven't logged a shot yet, when I look, then my newest setup is
     current.
  3. Given another setup, when I choose to use it, then it becomes current at
     once, without waiting for a shot.
  4. Given my setups, when I look at them, then each shows its name (or its
     parts), its three parts by maker and model, how many recipes it has and
     when it was last used. Setups I haven't used for 90 days are grouped out
     of the way.
  5. Given a setup, when I name or rename it, then only its name changes: it's
     the same setup with the same recipes.
  6. Given two setups share a machine and grinder, when either is shown by its
     parts, then its basket is named too, so the two never look alike.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. DQ-18 (current setup) and DQ-21 (naming a setup doesn't
  change it) are the working assumptions. Design SCR-KIT. Criterion 4's
  90-day grouping is the design's way to keep the list calm as setups
  multiply.

**Coverage:** all In items covered: parts from the catalog, owned parts,
setups as fixed combinations with reuse, one part per kind, the optional
name, the current setup (DQ-18), "change a part" (PEC-09; the selects on Home
and in the log are STORY-02-02-07) and the first-setup shortcut. Out by S-02:
editing a setup, retire, untracked tools. Not covered: deleting a setup (not
in the spec).

### EPIC-01-03: Log a shot in seconds

#### STORY-01-03-01: Start a shot with what I'm brewing already chosen

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want the shot log to open with my setup,
  drink and coffee already chosen, and to change them if I need to, so that
  most shots need no choices before the numbers.
- **Acceptance criteria**
  1. Given I open the shot log, when it opens, then the setup is my current
     setup, and the drink and coffee are the ones on my home screen.
  2. Given I want a different drink or coffee, when I change it, then I can
     choose from my household's visible drinks and my unfinished portions,
     each named by its bean with its bag, state and how long it's been open.
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
- **Notes:** Updated (current setup; frozen portions last). Design SCR-LOG
  context. DQ-18 (current setup) and DQ-06 (as updated in design round 3)
  are the working assumptions: the first shot logged on an unopened,
  unfrozen portion marks it opened that day (STORY-03-02-03), and a frozen
  pick doesn't. Changing the setup here is STORY-02-02-07. Finished portions
  are excluded (INIT-03 Q3). Hidden drinks only exist once EPIC-02-05 ships.

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
     choose values on its steps, within its range; given it's stepless, I can
     choose any value in its range at its finest increment.
  4. Given my grinder's coarser direction is known, when I set grind, then I can
     see which way is finer and which is coarser.
  5. Given I change dose or yield, when I look, then the ratio updates at once.
  6. Given I set the time, when I see it, then it's shown in seconds with one
     decimal (for example 27.6 s).
- **Source sections:** S-06, S-08, S-02
- **Priority:** MVP
- **Size:** 5
- **Notes:** Updated (grind follows the setup's grinder). Design SCR-LOG,
  ShotDial (NC-09), NumberWheel end captions. DQ-07 is the working assumption
  for criterion 2 (defaults: dose 18 g, yield 36 g, time 28 s, grind
  mid-range). The ratio is shown, never stored. When the coarser direction is
  "not sure", no direction is shown (STORY-01-06-08).

#### STORY-01-03-03: Save the shot as I measured it

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to save a shot with its values and
  setup, so that my history shows exactly what I pulled, even after I change
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
- **Notes:** Updated. Shots record their setup only; the machine, grinder and
  basket follow from it, and setups never change (S-02, S-08). Tasting is
  STORY-01-05-01 to 04 (SCR-TASTE). Network eligibility is not computed here
  (X-3).

#### STORY-01-03-04: Mark a shot as sweetened

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to mark a drink as sweetened, so
  that my history knows when sugar or syrup was added.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I mark it sweetened, then the saved shot
     records that it was sweetened.
  2. Given I start a shot, when the log opens, then sweetened starts off, and
     if I leave it off the shot records it as not sweetened.
  3. Given any drink type, when I log it, then I can mark it sweetened.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 1
- **Notes:** Lightly updated (criterion 2: sweetened always starts off, per
  the design, because it's per drink, not per recipe).

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
- **Notes:** Unchanged. Applies to every number in the app; this story makes
  it testable on the shot log, where it matters most.

#### STORY-01-03-06: Record whether I used WDT or a puck screen

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to tick whether I used a WDT tool
  and a puck screen on a shot, so that my history shows how I prepped the
  puck without making prep part of my setup.
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
- **Notes:** New (S-02 puck prep; schema `usedWdt`, `usedPuckScreen`). Design
  SCR-LOG step 4. The ticks record whether prep was used, not which tool.
  Which tool, portafilter and tamper aren't tracked (S-02). The starting rule
  is the coordinator's working assumption, matching the design. Editing a
  saved shot starts from its own ticks (STORY-02-06-02).

**Coverage:** all In items covered, including puck prep. The setup field's
select with "change a part" is EPIC-02-02 (STORY-02-02-07).

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
- **Notes:** Updated (closed: °F is display-only and stored in °C, S-08;
  INIT-01 Q5 resolved). Design EPIC-01-04. Machines whose temperature control
  is "not sure" follow STORY-01-06-08.

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
- **Notes:** Lightly updated (wording). Design EPIC-01-04 table. Criterion 1
  for gaugeless manual machines is the design's assumption too (EPIC-01-04
  open question: manual without gauge). Pressure profiles are out of scope
  (S-02).

**Coverage:** all In items covered.

### EPIC-01-05: Say how it tasted

#### STORY-01-05-01: Rate a shot overall

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to rate a measured shot from 1 to 5
  right after saving it, if I want to, so that I remember which shots I liked.
- **Acceptance criteria**
  1. Given I've just saved a measured shot, when I'm offered to say how it
     tasted, then I can see the shot's values while I rate it from 1 to 5.
  2. Given I chose a rating, when I choose it again, then it goes back to
     unrated.
  3. Given I've made choices, when I leave in any way (done, back, or pinning
     the shot), then my choices are saved without any question; with nothing
     chosen, nothing more is saved.
  4. Given saving my choices fails, when I try to leave, then I stay, my
     choices are kept, and I can try again or leave without saving the
     tasting; the shot itself is already saved.
  5. Given I rated a shot, when I see it later, then its rating is shown.
- **Source sections:** S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (review M2: the design's single "leaving saves" rule and
  its failure path). Design SCR-TASTE. Tasting never comes before saving and
  never blocks it. Rating is optional (INIT-01 Q3, still open). Rating later is
  through editing a measured shot (STORY-02-06-02); one-tap shots don't carry
  a rating (SQ-17).

#### STORY-01-05-02: Score sweetness, acidity, bitterness and body

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to score sweetness, acidity,
  bitterness and body from 1 to 5, so that my taste history shows what I
  actually tasted.
- **Acceptance criteria**
  1. Given I'm saying how a measured shot tasted, when I score any of the four,
     then each takes a whole number from 1 to 5, with its low and high ends
     named.
  2. Given I score some but not all four, when I leave, then the ones I scored
     are saved and the rest are left empty.
  3. Given I scored one, when I choose the same score again, then it goes back
     to unscored.
  4. Given I score, when I do it, then I can do it by touch or keyboard, without
     typing.
- **Source sections:** S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged in substance. Design SCR-TASTE. Saving follows
  STORY-01-05-01's rule. All four are optional (INIT-01 Q3). They aren't
  interpreted in Phase 1.

#### STORY-01-05-03: Tag what went wrong

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to tag defects such as channelling on
  a shot, so that I can see what went wrong when I look back.
- **Acceptance criteria**
  1. Given I'm saying how a measured shot tasted, when I tag defects, then I can
     choose one or more from the defect list, and they're saved on the shot.
  2. Given I tag none, when I leave, then the shot saves with no defects.
  3. Given I tagged a defect, when I tap it again, then it's untagged.
  4. Given I tagged defects, when I see the shot later, then its defects are
     shown.
- **Source sections:** S-08, S-09
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged in substance. The defect list is still undefined
  (DQ-08); until it is, only channelling ships (the review's working
  assumption). STORY-01-05-04 depends on channelling.

#### STORY-01-05-04: See a warning when a shot channelled

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want a clear warning on any shot I tagged
  as channelling, so that problem shots stand out when I look back.
- **Acceptance criteria**
  1. Given I'm saying how a shot tasted, when I tag channelling, then a
     channelling warning appears straight away; when I untag it, the warning
     goes.
  2. Given a shot tagged as channelling, when I see it in my recent shots, in
     its details or while editing it, then the same warning is shown.
  3. Given the warning, when anyone sees it, then it's understandable from its
     words alone, not only from its colour.
  4. Given a shot without channelling, when I see it anywhere, then no warning
     is shown, and nothing else in the app looks like a shot warning.
- **Source sections:** S-01, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged. Design EPIC-01-05 "Where the warning appears". This
  epic owns the warning; EPIC-02-06 only shows it. "Ran fast" stays out until
  a threshold exists (DQ-09). Only measured shots can carry defects, so only
  they can show the warning (SQ-17).

**Coverage:** all In items covered. Not covered: the "ran fast" warning, which
the epic puts out of scope.

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
     back to where I was with it chosen, ready to add as a part.
  3. Given the maker isn't in the catalog either, when I add the model, then I
     can add the maker at the same time, also with a link.
  4. Given I add a basket, when I save, then I'm not asked about capabilities.
  5. Given I try to save without a product page link, when I save, then I'm
     asked for one and nothing is saved.
  6. Given I added an entry, when I see it, then it's marked as added by my
     household; and given saving fails, everything I entered is kept and I
     can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (baskets; three kinds). Design SCR-CATALOG-ADD. A basket's
  model name includes what tells it apart (for example "Normcore 18 g").
  Capabilities for machines and grinders are STORY-01-06-06 and 01-06-07.
  Baskets often have no product page of their own, and a product with no web
  page can't be added (EPIC-01-06 open questions: no web page; basket pages).

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
- **Notes:** Unchanged. Design SCR-CATALOG-ADD (coffee). The roast level list
  is S-09's. Bag scanning is EPIC-06-01.

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
     searches, then they see it in the shared catalog, and my existing parts,
     setups, bags and shots that use it are unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (wording). Verification and merges are a manual
  admin task until EPIC-06-07 (S-02). The reviewer role isn't a spec user type
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
- **Notes:** Unchanged. Design SCR-CATALOG-ADD steps 1 and 2 and the "check
  failed" state. Criterion 3 is also the design's assumption (EPIC-01-06 open
  question: cross-household check). Whether the user can add their own entry
  anyway is DQ-10; the working assumption is no (the review's "add anyway"
  flag is off). Normalisation rules per market: EPIC-01-06 open question.
  Fuzzy matching is EPIC-06-07.

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
- **Notes:** Unchanged. Design SCR-CATALOG-ADD step 5. Assumes a household adds
  links and aliases to its own entries only (SQ-04, still open).

#### STORY-01-06-06: Describe a machine I added in my own words

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to say what my added machine can do
  by answering a few plain questions, with "not sure" always allowed, so that
  the shot log asks for the right things.
- **Acceptance criteria**
  1. Given I'm adding a machine, when I describe it, then I'm asked whether I
     can set the brew temperature and whether I can set or read the pressure,
     in plain words, each with "not sure" as an answer.
  2. Given an answer that needs more detail (a few settings, an exact number,
     or a lever with or without a gauge), when I give it, then only the
     follow-up it needs is asked (how many settings, the unit, the lowest and
     highest value, or whether there's a gauge), also with "not sure" where it
     applies.
  3. Given a machine with no temperature or pressure control, when I describe
     it, then two answers are enough.
  4. Given I leave any question unanswered, when I save, then it's saved as
     "not sure", and I was told that before saving.
  5. Given I saved my machine, when I log a shot on a setup with it, then the
     log offers temperature and pressure in the form I described
     (STORY-01-04-01, 02).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (criterion 5 wording). Design SCR-CATALOG-ADD step
  4. "Not sure" is stored as an unknown value (S-08, TQ-06).

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
- **Notes:** Unchanged. Design SCR-CATALOG-ADD step 4 (grinder questions).

#### STORY-01-06-08: Log shots even when I'm not sure about my equipment

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want the shot log to work for equipment
  whose details I didn't know, without guessing anything that matters, so
  that "not sure" never stops me logging.
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
  5. Given any part of my setup is "not sure", when I log a shot, then I'm
     offered, quietly and once, to tell Tare more about it (STORY-01-06-09).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (title wording). DQ-11 is the working assumption:
  settings 1 to 5; °C; 80 to 100 °C, step 0.5; 0 to 12 bar, step 0.5; grind
  0 to 100, step 0.1 (smooth or unknown) or 1 (clicks with unknown step). The
  exact ranges are still to be confirmed.

#### STORY-01-06-09: Answer capability questions later

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to come back and answer what I
  wasn't sure about for equipment I added, so that the shot log gets better
  once I know.
- **Acceptance criteria**
  1. Given a machine or grinder my household added and that's still
     unverified, when I open that part, then I see which answers are "not sure"
     and can answer the same questions again.
  2. Given I change an answer, when I log a new shot, then the log follows the
     new answer.
  3. Given I change an answer, when I look at old shots, then their stored
     values are unchanged and mean what they meant.
  4. Given a new answer narrows the range, when I edit an old shot outside it,
     then the old value is shown as saved, never silently changed.
  5. Given a seeded or verified model, when I open the part, then I can see
     its capabilities but not change them.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged in substance. PEC-08. Design SCR-UNIT "Answer later".
  Whether the admin can correct capabilities on verification is still an
  EPIC-01-06 open question.

**Coverage:** all In items covered, for both catalogs and all three part
kinds, from the setup (STORY-01-02-01) and pantry (STORY-03-01-01) flows.

---

## INIT-02: Every new bag starts from what you already learned

### EPIC-02-01: Pin the recipe that worked

Retired in this revision: STORY-02-01-05 (re-dial a recipe whose kit left its
toolkit), replaced by STORY-02-01-06.

#### STORY-02-01-01: Pin a recipe from a shot I liked

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a good shot as my recipe for
  that coffee, drink and setup, so that I can make it again without dialing
  in.
- **Acceptance criteria**
  1. Given a measured shot, right after saving it or from its details, when I
     choose to pin it, then before confirming I see which drink, coffee and
     setup it applies to, its values and puck prep, and the current recipe it
     replaces, if any, with any differences shown.
  2. Given I confirm, when it's saved, then a recipe is saved for that shot's
     bean, persona, setup and drink, with its grind, dose, yield, time, any
     temperature or pressure in the same form, and its WDT and puck screen
     ticks, and I'm told it's pinned.
  3. Given I pinned a shot, when I look at the recipe, then it shows which shot
     it came from.
  4. Given a recipe exists for a bean, persona, setup and drink, when anything
     in the app needs the recipe for that combination, then it gets the latest
     one pinned, and only for that setup.
  5. Given a one-tap shot, when I look at it, then pinning isn't offered.
  6. Given I later edit the shot I pinned from, or pinning fails, when I look,
     then the recipe is unchanged, or nothing is pinned and I can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (setup and prep; review m10). **This story owns "which
  recipe applies now"** (criterion 4). STORY-02-01-04, Home and every
  pre-fill use it. Design SH-PIN, from SCR-TASTE or SCR-SHOT. Assumes a pin
  sets the bean's default (INIT-02 Q1, still open). One-tap shots are
  excluded, as the design confirms.

#### STORY-02-01-02: Pin a recipe by entering the values

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a recipe for a coffee by
  setting its values myself, so that I can start from a recipe I already know,
  such as one from the roaster.
- **Acceptance criteria**
  1. Given a bag in my pantry, when I add a recipe for its coffee, then I choose
     the drink and setup and set grind, dose, yield and time as on the shot
     log.
  2. Given the setup's machine can set temperature or pressure, when I enter
     the recipe, then I can set them in the machine's form, and I can tick
     WDT and puck screen.
  3. Given I confirm the pin, when it's saved, then a recipe is saved for that
     bean, drink, setup and my persona, with no source shot, and no shot is
     logged.
  4. Given I'm entering a recipe, when I look at the screen, then it's clear I'm
     pinning a recipe, not logging a shot.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (setup and prep). Design SCR-BAG recipes, SCR-LOG recipe
  mode, SH-PIN.

#### STORY-02-01-03: Pin a better recipe and keep the old one

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want a new pin to replace my current
  recipe without deleting the old one, so that I always brew my latest best
  and nothing is lost.
- **Acceptance criteria**
  1. Given a bean, persona, setup and drink already have a recipe, when I pin
     another, then the new one becomes the current recipe.
  2. Given I re-pinned, when I look at the current recipe, then I see only the
     newest one.
  3. Given I re-pinned, when anything in the app needs a recipe for that bean,
     persona, setup and drink, then it uses the newest one.
  4. Given I re-pinned, when the older recipe is checked, then it still exists,
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged in substance. The design has no recipe history screen
  in the MVP, so criterion 4 is a data check. Unpinning or removing a recipe
  isn't in the spec or the design (SQ-05).

#### STORY-02-01-04: See the recipes for a coffee

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to see my recipes for a coffee, per
  drink and setup, so that every new bag of it starts from what worked.
- **Acceptance criteria**
  1. Given recipes are pinned for a bean, when I look at a bag of it, then I see
     one recipe per drink and setup, with its values, puck prep and the date
     it was pinned.
  2. Given I add a new bag of the same bean, when I look at it, then I see the
     recipes pinned for that bean, not blank ones.
  3. Given a recipe, when I open it, then I can dial in from it or change it.
  4. Given no recipe is pinned for that coffee, when I look, then I'm told
     there's none yet and can add one (STORY-02-01-02).
  5. Given the bean was merged into another catalog entry, when I look for its
     recipes, then I see recipes pinned against either entry.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (per setup; review m10). Shows recipes as resolved by
  STORY-02-01-01. Design SCR-BAG section `bag.recipes`. "Change it" opens
  recipe mode (STORY-02-01-02). Drift and offsets are not applied (INIT-04).

#### STORY-02-01-06: Dial in on a new setup from my closest setup's recipe

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want a dial-in on a setup that has no
  recipe yet to start from my recipe on the most similar setup, so that a new
  basket or grinder doesn't mean starting from scratch.
- **Acceptance criteria**
  1. Given my current setup has no recipe for this coffee and drink but another
     setup does, when I look at the home screen, then I'm told there's no
     recipe on this setup yet, which setup the dial-in will start from, and
     only "Dial in" is offered, never a one-tap pull.
  2. Given several setups have such a recipe, when the starting setup is
     chosen, then it's the one with the most parts in common with my current
     setup; ties go to the one I used most recently.
  3. Given I dial in, when the log opens, then I'm told it starts from that
     setup's recipe, and dose, yield, time and puck prep come from it.
  4. Given the starting setup has the same grinder, when the log opens, then
     grind comes from its recipe too; given a different grinder, grind starts
     at this grinder's last measured value (else the middle of its range) and
     I'm told grind wasn't carried over.
  5. Given the starting setup has the same machine, when the log opens, then
     temperature and pressure come from its recipe; otherwise they start unset.
  6. Given I save and pin the dial-in, when I come back, then this setup has its
     own recipe and the next shot is one tap. Given no setup has a recipe for
     this coffee and drink, the dial-in starts blank (STORY-02-02-05).
- **Source sections:** S-02, S-01, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** New (S-02: recipes belong to one setup). It replaces retired
  STORY-02-01-05. Working assumptions: DQ-19 (ties) and DQ-20 (grind and
  temperature and pressure carry-over). Puck prep carries over because it
  isn't tied to a part (design; answers the EPIC-02-01 prep question). Design
  "dial in on a setup with no recipe", the `log.fromOtherSetup` note,
  DES-02-01-05. Each pre-filled value shows its source when changed, as in
  STORY-02-03-02.

**Coverage:** all In items covered, including the closest-setup head start.

### EPIC-02-02: Pull your daily shot in one tap

#### STORY-02-02-01: See my daily shot on the home screen

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want the home screen to show the recipe I
  usually make at this time of day, on my current setup, with the coffee I'm
  on, so that my daily shot needs no choices.
- **Acceptance criteria**
  1. Given my profile is selected, when I open the home screen, then it shows
     the drink I usually make at this time of day, the coffee I'm on, my
     current setup, and my recipe for them on that setup: values, puck prep if
     used, and how much coffee is left.
  2. Given the coffee in use is opened, when I see the home screen, then both
     freshness clocks show on one line (since roast, and how long it's been
     open); while it's unopened, only the roasting clock shows.
  3. Given I usually make different drinks in the morning and the afternoon,
     when I open the home screen at each time, then it shows the matching
     drink; if I've never made a drink at this time of day, it shows the one I
     made most recently, or the first drink on my list.
  4. Given several coffees, when I open the home screen, then it shows the
     earliest-opened open portion whose coffee has a recipe for this drink on
     this setup; with none, the earliest-opened open portion; with none open,
     my newest unopened portion that isn't frozen; with only frozen coffee
     left, a frozen coffee, and pulling asks which bag to use.
  5. Given a portion that was opened and then frozen, when the home screen
     chooses the coffee, then it doesn't count as open.
  6. Given my recipe's coffee is finished, when I open the home screen, then I'm
     told I've finished it and offered to choose another coffee or add a bag.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** Updated (current setup, both clocks, prep line, "open" excludes
  frozen, review M5). Design 2.3 (layout and states). Working assumptions:
  DQ-18 (current setup), DQ-02 (drink: a shot within 90 minutes either side of
  now on any of the last 14 days, else the most recent drink, else the first
  visible drink), DQ-03 as updated in design round 3 (coffee). The clocks are
  STORY-03-03-01 and 03-03-04, and remaining coffee is EPIC-03-04; Home only
  shows them. In the MVP the only persona is the main persona.

#### STORY-02-02-02: Pull this shot in one tap

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want one tap to record my daily shot, so
  that my coffee use counts without logging anything.
- **Acceptance criteria**
  1. Given the home screen shows a recipe on my current setup, when I tap
     "Pull This Shot", then a shot is recorded at once with the recipe's values
     and its WDT and puck screen ticks, marked one-tap, and I'm told it's
     logged; nothing else is asked.
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
- **Notes:** Updated (prep copied; setup; frozen isn't open, review M5).
  Design EPIC-02-02 steps 3 and 4, PulledState (NC-07). One-tap shots count
  toward coffee used (STORY-03-04-01) but are never measurements or
  network-eligible (S-02). A day without WDT records "used WDT" unless the
  shot is edited (STORY-02-06-02); that's the accepted price of zero inputs.
  The quick reaction is STORY-02-03-01.

#### STORY-02-02-03: Choose a bag when none is open

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to be asked which bag to use when
  none of that coffee is open, so that my shot is counted against the right
  bag, and frozen coffee is only used when I say so.
- **Acceptance criteria**
  1. Given no portion of the coffee is open, when I tap "Pull This Shot", then
     I'm asked which of its unfinished portions to use, with each one's bag,
     state, freshness and amount left; portions on the counter come first,
     frozen ones last and marked as ground straight from the freezer.
  2. Given I choose an unopened or thawed portion, when I confirm, then the
     shot is recorded against it, and an unopened one is marked opened today.
  3. Given I choose a frozen portion, when I confirm, then the shot is recorded
     as ground from frozen, and none of the portion's dates change.
  4. Given I have no unfinished portion of that coffee at all, when I tap
     "Pull This Shot", then I'm told there's none left and offered to add a bag,
     and no shot is recorded.
  5. Given I'm asked and cancel, when I return to the home screen, then no shot
     is recorded.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (frozen portions; 2 points became 3). Design SH-PORTION
  (round 3). DQ-06 (as updated in round 3) is the working assumption. "Open"
  means opened, not finished and not in the freezer (S-02).

#### STORY-02-02-04: Undo a shot I didn't mean to pull

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to undo a one-tap shot for a few
  seconds, so that a mistaken tap doesn't count.
- **Acceptance criteria**
  1. Given I just pulled a one-tap shot, when I undo within the undo window,
     then the shot is removed as if it was never pulled, and I'm told.
  2. Given the shot marked a portion opened, when I undo it, then the portion
     is back to unopened.
  3. Given I undid a shot, when I look at remaining coffee and recent shots,
     then the shot isn't counted or listed.
  4. Given the undo window has passed, when I look, then undo is no longer
     offered, without a countdown, and the shot stays; I can still edit it
     (STORY-02-06-02).
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged. DQ-04 is the working assumption: an 8-second window.

#### STORY-02-02-05: Dial in when there's no recipe on this setup

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want the home screen to offer "Dial in"
  instead of a one-tap pull when my current setup has no recipe for this
  drink and coffee, so that I know to log a shot instead.
- **Acceptance criteria**
  1. Given no setup has a recipe for my profile, the drink and the coffee shown,
     when I open the home screen, then I'm told there's no recipe yet and the
     main action is "Dial in" instead of "Pull This Shot".
  2. Given that, when I choose "Dial in", then the shot log opens with that
     drink, coffee and my current setup already chosen, and the values start as
     in STORY-01-03-02.
  3. Given another setup has a recipe for them, when I open the home screen,
     then it's the no-recipe-on-this-setup case of STORY-02-01-06 instead.
  4. Given I then pin a recipe on this setup, when I return to the home screen,
     then "Pull This Shot" is offered.
- **Source sections:** S-02, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (two no-recipe cases; 1 point became 2). Design 2.3 "no
  recipe" states. Starting blank rather than from another bean's recipe is
  the design's choice (EPIC-02-03 open question: dial-in start). Values
  follow DQ-07.

#### STORY-02-02-06: Change the drink or coffee before pulling

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to switch the drink or coffee on the
  home screen and still pull in one tap, so that a different drink at my usual
  time doesn't mean a full log.
- **Acceptance criteria**
  1. Given the home screen, when I change the drink or the coffee, then I
     choose from my visible drinks, or from coffees with an unfinished portion
     (those with a recipe for this drink on this setup first, and coffees with
     only frozen portions last, marked frozen), and my usual choice is marked
     so I can always go back.
  2. Given I chose another drink or coffee, when I look, then the recipe shown
     updates without leaving the home screen.
  3. Given the new drink and coffee have a recipe on this setup, when I tap
     "Pull This Shot", then the shot uses them, with no extra step.
  4. Given they have no recipe on this setup, when I look, then the home screen
     offers "Dial in" (STORY-02-02-05 or STORY-02-01-06).
  5. Given I changed the drink or coffee and pulled, when I next open the home
     screen, then my usual drink and coffee follow from what I pulled, and no
     setting was saved.
  6. Given I changed them but didn't pull, when I come back after 30 minutes
     away from the home screen, then it's back to my usual drink and coffee.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (frozen-only coffees; criterion 6 made exact, review
  m7). PEC-03. Design 2.3 "Changing drink, coffee or setup". DQ-17 is the
  working assumption for criteria 5 and 6. The setup is the exception: a
  setup change sticks (STORY-02-02-07).

#### STORY-02-02-07: Switch setup on the home screen and in the shot log

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to switch setup, or say I've changed
  a part, right where I brew, so that the recipe shown and the shot I log
  always match what's on my counter.
- **Acceptance criteria**
  1. Given the home screen or the shot log, when I change the setup, then I
     choose from my setups (current first, marked) or choose to change a part.
  2. Given I choose a setup, when I return, then it becomes my current setup at
     once and stays current until I change it or log a shot on another setup;
     the recipe shown updates without leaving the screen.
  3. Given I choose to change a part, when I finish (STORY-01-02-08), then I
     come back to where I was with the resulting setup chosen and current.
  4. Given I change the setup in the shot log, when the log updates, then dose,
     yield and time stay as they were, and grind stays only if the new setup
     has the same grinder; otherwise it moves to that grinder's last measured
     value, or the middle of its range.
  5. Given I change the setup in the shot log, when the log updates, then puck
     prep ticks I haven't touched follow STORY-01-03-06 for the new setup.
- **Source sections:** S-02, S-01, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-09). Design 2.3 setup line, SCR-LOG context.
  DQ-18 is the working assumption. Grind doesn't transfer between grinders
  (S-01). "Change a part" itself is STORY-01-02-08.

**Coverage:** all In items covered, including PEC-03, PEC-09 and puck prep.
Editing a one-tap shot afterwards is delivered by EPIC-02-06
(STORY-02-06-02).

### EPIC-02-03: Fix a bad shot from your recipe

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
  3. Given I choose "off", when I do, then the shot records that reaction and
     the fix flow opens (STORY-02-03-02).
  4. Given a one-tap shot, when I open it later from my recent shots, then I can
     give or change its reaction.
  5. Given saving the reaction fails, when I look, then I'm told and the
     reaction isn't recorded; choosing "off" still opens the fix flow.
- **Source sections:** S-02, S-06, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (the reaction is a one-tap shot's only taste
  signal, SQ-17). DQ-05 is the working assumption for criterion 4. On Home,
  the reaction stays offered for 30 seconds or until the user leaves.

#### STORY-02-03-02: Fix an off shot from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want an off shot to open the log already
  filled with my recipe, so that I only nudge one or two values.
- **Acceptance criteria**
  1. Given I marked a one-tap shot "off", when the log opens, then it's filled
     with the current recipe's values and puck prep, its setup, drink and the
     same portion, and I'm told it starts from my recipe.
  2. Given the pre-filled log, when I change a value, then I can see what it
     was in the recipe; unchanged values show nothing extra.
  3. Given I change one or two values and save, when it's saved, then a new
     measured shot is saved and the one-tap shot keeps its "off" reaction.
  4. Given I saved the measured shot, when I'm offered to say how it tasted,
     then pinning it as my new recipe is the suggested next step
     (STORY-02-01-01).
  5. Given the pre-filled log, when I leave without saving, then no measured
     shot is saved and the one-tap shot keeps its "off" reaction.
- **Source sections:** S-02, S-06, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (prep pre-filled). Design SCR-LOG fix mode. DQ-12 is the
  working assumption: two records. See SQ-14 on doses. Suggesting what to
  change is out of scope.

#### STORY-02-03-03: Dial in from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to start a shot log from my recipe
  instead of pulling it, so that I can dial in a new bag of a coffee I know.
- **Acceptance criteria**
  1. Given the home screen shows a recipe on my current setup, when I choose
     "Dial in", then the log opens filled with the recipe's values, including
     any temperature, pressure and puck prep, its setup and drink.
  2. Given the pre-filled log, when I change a value, then I can see what it
     was in the recipe.
  3. Given I adjust and save, when it's saved, then a measured shot is saved,
     no one-tap shot is recorded, and pinning is the suggested next step.
  4. Given no portion of the coffee is open, when I choose "Dial in", then I'm
     first asked which bag to use, as for a pull (STORY-02-02-03), and
     cancelling opens nothing.
  5. Given I have no unfinished portion of that coffee, when I choose "Dial
     in", then I'm told there's none left and offered to add a bag.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (review m6: criteria 4 and 5 follow the design, "with no
  open portion, SH-PORTION opens first, as for a pull"; 2 points became 3).
  Design SCR-HOME and SCR-LOG dial-in mode. On a setup without a recipe, the
  dial-in starts from the closest setup (STORY-02-01-06). Portion choice
  otherwise follows the one-tap rule (STORY-02-02-02).

**Coverage:** all In items covered.

### EPIC-02-04: Give one bag its own recipe

Blocked on INIT-02 Q1 (does a pin update the bag's override or the bean's
default?). The stories below are testable either way; only the default is a
placeholder.

#### STORY-02-04-01: Pin a recipe for one bag only

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want to pin a recipe for one bag that
  behaves differently, so that my usual recipe for that coffee stays as it is.
- **Acceptance criteria**
  1. Given I'm pinning a recipe, when I confirm, then I can choose between
     every bag of this coffee and this bag only, and the recipe is saved for
     the choice I made.
  2. Given I pinned for one bag, when I look at the bean's default recipe on
     that setup, then it's unchanged.
  3. Given a bag's own recipe, when I see it on the home screen or with the
     bag, then it's marked as for this bag only.
  4. Given I pin for this bag again, when I look, then the newest bag recipe
     applies.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (review m7: criterion 1 no longer depends on a decision).
  **Placeholder:** which option is pre-selected depends on INIT-02 Q1. Design
  EPIC-02-04 (scope choice in SH-PIN). A bag's own recipe still belongs to one
  setup (S-02).

#### STORY-02-04-02: Use the bag's recipe while that bag is in use

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want the home screen and pre-filled log to
  use the bag's own recipe while I'm on that bag, so that I don't have to
  remember the difference.
- **Acceptance criteria**
  1. Given a bag with its own recipe on my current setup, when the home screen
     shows that bag, then it shows the bag's recipe, not the bean's default.
  2. Given that bag's recipe, when I pull a one-tap shot or open the pre-filled
     log, then the bag's values are used.
  3. Given I move to a new bag of the same coffee, when I open the home screen,
     then the bean's default recipe is used again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged in substance. "In use" follows the home screen's coffee
  choice (DQ-03, DQ-17). Removing an override is open (SQ-11).

**Coverage:** all In items covered.

### EPIC-02-05: Make the drink list yours

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
- **Notes:** Unchanged. Design EPIC-02-05 (drinks screen from Profile). Going
  back to the translated starter name isn't in the spec.

#### STORY-02-05-02: Hide drinks I don't make

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to hide drinks I never make, so that
  my choices stay short.
- **Acceptance criteria**
  1. Given a drink, when I hide it, then it no longer appears when I log a shot
     or on the home screen.
  2. Given a hidden drink, when I look at past shots of it, then they still show
     it.
  3. Given a hidden drink, when I unhide it, then it's offered again.
  4. Given only one drink is visible, when I try to hide it, then I can't, and
     I'm told at least one drink must stay visible.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. What happens to recipes and the home-screen default
  for a hidden drink is still open (EPIC-02-05 open question).

#### STORY-02-05-03: Add my own drink

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to add a drink that's not on the
  list, so that I can log what I actually make.
- **Acceptance criteria**
  1. Given my drink list, when I add a drink with a name, then it's offered when
     logging and on the home screen.
  2. Given I try to add a drink without a name, when I save, then I'm asked for
     one and nothing is saved.
  3. Given I add a drink, when I see it, then it shows the name I gave in every
     language.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. Whether the user says if it has milk is open
  (EPIC-02-05 open question: `has_milk`).

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
- **Notes:** Unchanged. Criterion 3 is an assumption.

**Coverage:** all In items covered.

### EPIC-02-06: See your recent shots

#### STORY-02-06-01: See my recent shots

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want a list of my recent shots, newest
  first and grouped by day, so that I can find a shot I want to check or fix.
- **Acceptance criteria**
  1. Given my household has logged shots, when I open my shots, then I see them
     newest first, grouped by day (today, yesterday, then dates), each with its
     drink, time, coffee and grind, dose, yield and time.
  2. Given the list has measured and one-tap shots, when I look at it, then I
     can tell which is which in words, and see each shot's reaction, whether it
     was ground from frozen, and any channelling warning.
  3. Given I have shots older than the last 30 days, when I reach the end of
     the list, then I can choose to show older shots.
  4. Given my household has no shots yet, when I open my shots, then I'm told
     there are none and offered to dial in.
  5. Given a shot in the list, when I open it, then I see its details
     (STORY-02-06-03).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (criterion 3 states the window, review m7).
  Design SCR-SHOTS. DQ-13 is the working assumption: 30 days. Rows don't show
  puck prep. The warning is STORY-01-05-04, the frozen marker STORY-03-03-03,
  and the grind period dividers STORY-04-01-04. Whose taste a shot records
  shows once sub personas exist (STORY-05-01-04).

#### STORY-02-06-02: Fix a shot after the fact

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to edit any recent shot, including a
  one-tap shot that didn't go to plan, so that my history is right.
- **Acceptance criteria**
  1. Given a measured shot, when I edit it, then I see its saved values, puck
     prep, sweetened mark and taste (rating, scores, defects) together, and can
     change any of them.
  2. Given a one-tap shot, when I edit it, then I can change its values, puck
     prep and sweetened mark; rating, scores and defects aren't offered, and its
     reaction stays as it was.
  3. Given I'm editing, when I look at the coffee, drink, setup and persona,
     then I can see them but not change them.
  4. Given I change values and save, when I look at the shot again, then it
     shows my changes, whose taste it records and who logged it are unchanged,
     and a one-tap shot is still marked one-tap.
  5. Given I change a dose, or edit a shot a recipe was pinned from, when I
     look, then remaining coffee reflects the new dose and the recipe is
     unchanged.
  6. Given I leave with unsaved changes, when I confirm, then the shot is
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (review M1; prep; setup). Design SCR-LOG edit mode, which
  saves only on "save changes" and asks before discarding (the deliberate
  exception to STORY-01-05-01's rule). **M1, working assumption (SQ-17):**
  one-tap shots carry a reaction, never a rating, scores or defects. The
  tiebreakers are the design (SCR-SHOT shows a one-tap shot's reaction only)
  and S-02 (one-tap shots use reactions, not ratings). So no one-tap shot can
  show the channelling warning. Entry mode stays one-tap after editing
  (EPIC-02-06 open question; the review's working assumption). Deleting a
  shot is open (EPIC-02-06 open question).

#### STORY-02-06-03: See a shot's details

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to open a shot and see everything
  about it, so that I understand what I pulled and what to do next.
- **Acceptance criteria**
  1. Given a shot, when I open it, then I see its values, drink, coffee, its
     setup with the machine, grinder and basket by maker and model, its date
     and time, whether it was sweetened, and its puck prep when used.
  2. Given a measured shot, when I open it, then I also see its taste and
     defects if any, and I can pin it as a recipe or edit it.
  3. Given a one-tap shot, when I open it, then I'm told its values were copied
     from my recipe, I can edit it, and I can give or change its reaction; I
     can't pin it, and no taste scores are shown.
  4. Given the shot was tagged as channelling, when I open it, then I see the
     warning (STORY-01-05-04).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (setup parts, prep, review M1). Design SCR-SHOT. Setups
  never change, so the parts shown are always what was used. Editing a one-tap
  shot is at most two taps from the shots list. Whose taste and who logged show
  once sub personas exist (EPIC-05-01).

**Coverage:** all In items covered, including editing prep.

---

## INIT-03: Always know what beans you have and how old they are

### EPIC-03-01: Add a bag to your pantry

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
- **Notes:** Unchanged. Design SCR-BAG-ADD step 2, SCR-CATALOG-PICK (coffee).
  Seed coverage for roasters and coffees: EPIC-03-01 open question.

#### STORY-03-01-02: Add a bag with its dates and weight

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to record a bag's weight and
  whichever dates it shows, quickly, so that Tare knows how much I have and how
  fresh it is.
- **Acceptance criteria**
  1. Given I've picked a coffee, when I choose a common bag size or enter
     another weight and save, then the bag is added and I see it with one
     portion holding the whole bag.
  2. Given I add a bag, when I enter dates, then I can give a roast date and,
     if the bag shows them, a packing date and a best-before date; none is
     required.
  3. Given I add a bag, when I look at the dates, then I'm told the freshness
     clock uses the roast date, else the packing date, and with only a
     best-before date shows the time left instead.
  4. Given I add a bag, when I want to, then I can also give its lot code and
     purchase date; the purchase date starts as today.
  5. Given I don't give a weight, when I save, then I'm asked for it and
     nothing is saved.
  6. Given I buy another bag of the same coffee, when I add it, then it's a
     separate bag with its own dates and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (packing date; revision 2's best-before toggle is
  removed). Design SCR-BAG-ADD step 3 (common sizes 250, 340, 500 and 1000 g;
  roast date first, other dates under a disclosure). Started from the shot
  log, it returns there with the bag chosen (STORY-01-01-05). Rejecting a
  future roast date is still open (SQ-09).

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
  4. Given I split the bag later (STORY-03-02-01), when I look at it, then it's
     still one bag with one roast date and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 1
- **Notes:** Unchanged. DQ-06 is the working assumption.

#### STORY-03-01-04: See what's in my pantry

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to see all my bags and their
  portions in one place, in the order I'll use them, so that I know what
  coffee I have.
- **Acceptance criteria**
  1. Given my pantry has bags, when I open it, then I see each unfinished bag
     with its coffee, roaster and roasting clock, and its portions with their
     state, how long each has been open and the amount left.
  2. Given several bags, when I look at the order, then bags with an open
     portion come first (earliest opened first), then unopened bags, then bags
     only in the freezer.
  3. Given a bag whose only opened portion is now frozen, when I look at the
     order, then it doesn't count as open.
  4. Given I have finished bags, when I open the pantry, then they're kept in a
     separate finished group I can open.
  5. Given my pantry is empty, when I open it, then I'm told it's empty and
     offered to add a bag, as the only main action.
  6. Given a coffee was merged into another catalog entry, when I see my bag,
     then it shows the surviving coffee's details.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (clocks; "open" excludes frozen, review M5; one primary
  when empty, review m4). Design SCR-PANTRY and SCR-BAG. The order matches the
  one-tap portion rule. State, clocks and remaining weight come from
  STORY-03-02-04, STORY-03-03-01, 03-03-04 and STORY-03-04-01.

**Coverage:** all In items covered, including the packing date.

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
- **Notes:** Unchanged. Design SH-SPLIT. DQ-14 is the working assumption:
  splitting into several portions is done one at a time.

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
- **Notes:** Updated (review M4: dates are set once, backdated only when set;
  correcting a date isn't in the MVP, per the design). Design
  SH-PORTION-ACTIONS and SH-DATE. Criterion 3 is the design's assumption: one
  freeze and one thaw (EPIC-03-02 open question). Criterion 4 narrows SQ-09.

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
     saved, it's no longer offered for new shots, and once every portion of its
     bag is finished the bag moves to the finished group.
  5. Given a finished portion, when I look at its shots, then they're still
     there.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (frozen picks, review M4 wording). DQ-06 (as updated in
  design round 3) is the working assumption. Reopening a finished portion is
  still SQ-15.

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
     frozen, even if it was opened before freezing, and it isn't treated as
     open; once thawed, it shows as thawed and is open again.
  4. Given a finished portion, when I see it, then it shows as finished.
  5. Given a portion's dates are set (opened, frozen, thawed, finished), when I
     see it, then its state follows those dates.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (opened-then-frozen, review M5; criterion 5 wording,
  review M4). Calculated from dates, never stored.

**Coverage:** all In items covered. Correcting a date already set is out of
the MVP (design EPIC-03-02).

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
     shows how long since packing, labelled as packed, less any days in the
     freezer.
  3. Given a bag with only a best-before date, when I see it, then no age is
     shown; it shows the time left until best-before, or how long ago it
     passed.
  4. Given a bag with no dates, when I see it, then I'm told its age is
     unknown and offered to add a date.
  5. Given a day passes while the coffee isn't frozen, when I see it again,
     then the roasting clock has gone up by one.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated (rewritten; title was "See how old my beans are").
  **Resolves review blocker B1:** there's no estimated age, so no
  roast-to-best-before number is needed (S-02; INIT-03 Q2 closed). Design
  EPIC-03-03 clock table. Shown on the bag's facts, its pantry card and Home.
  Clocks never use colour. Calculated, never stored. A single combined
  freshness score is deferred to INIT-04 (S-02).

#### STORY-03-03-02: Freezing pauses both clocks

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want time in the freezer not to count
  toward either freshness clock, so that frozen coffee shows its real
  freshness.
- **Acceptance criteria**
  1. Given a portion frozen 10 days after roast and still frozen, when I see it
     later, then its roasting clock stays at 10 days, and in place of its
     opened clock it shows as paused in the freezer.
  2. Given a portion opened for 3 days, then frozen, then thawed, when I see it,
     then it shows 3 days open, rising again from there.
  3. Given two portions of the same bag, one frozen and one not, when I see
     them, then their clocks differ.
  4. Given a bag's details, when I look at a portion that has been frozen,
     then I can see how many days in the freezer weren't counted.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (both clocks; title was "Freezing pauses aging").
  Depends on STORY-03-02-02.

#### STORY-03-03-03: See freshness when logging, and spot frozen-ground shots

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want to see how long a portion has been
  open while logging, and know which shots were ground from frozen, so that I
  can explain shots that behaved differently.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I've chosen the coffee, then I see how long
     that portion has been open, and if it's frozen, that it's from frozen.
  2. Given a shot was pulled while its portion was frozen and not yet thawed,
     when I see it in my shots or its details, then it's marked as from frozen.
  3. Given a shot was pulled after the portion was thawed, or never frozen,
     when I see it, then it's not marked.
  4. Given a portion's freeze and thaw dates are set, including backdated when
     they were set, when I see its shots, then the mark follows those dates.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated (the since-opening clock; criterion 4 reworded, review
  M4). Worked out from dates alone (S-02). X-1 is closed: timestamps are in
  milliseconds (TQ-04), so a shot and a thaw on the same day are ordered.

#### STORY-03-03-04: See how long each portion has been open

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want each portion to show how long it's
  been open to the air, so that I know the freshness that matters most at the
  machine.
- **Acceptance criteria**
  1. Given an opened portion, when I see it, then it shows how many days it's
     been open (or that it was opened today), less any days in the freezer.
  2. Given an unopened portion, when I see it, then it shows as not opened, and
     no opened clock is counted.
  3. Given a bag with several portions, when I see the bag, then each portion
     shows its own opened clock, and the bag shows one roasting clock.
  4. Given the coffee in use on the home screen, when it's opened, then the
     home screen shows its roasting clock and opened clock together on one
     line, worded so the two can't be confused.
  5. Given a day passes while the portion isn't frozen, when I see it again,
     then its opened clock has gone up by one.
- **Source sections:** S-02, S-09
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (S-02 since-opening clock). Shown on portion rows, SCR-BAG,
  the bag chooser, the shot log's coffee field and Home. This is the S-09
  "days open" input, so the S-09 mismatch is closed. Design EPIC-03-03 and
  2.3 (`home.coffeeClocks`). Calculated, never stored.

**Coverage:** all In items covered: both clocks, freezer pauses, Home's one
line, the bag screen, and frozen-ground shots.

### EPIC-03-04: See how much coffee is left

#### STORY-03-04-01: See how much is left

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each portion, bag and my home screen
  to show how much coffee is left, so that I know when to buy more.
- **Acceptance criteria**
  1. Given a portion with shots, when I see it, then it shows its weight minus
     the doses of every shot against it, measured and one-tap, as a number in
     grams.
  2. Given a bag with several portions, when I see it, then it shows the total
     left across its portions; the home screen shows what's left in the portion
     in use, and nothing if it's unknown.
  3. Given I undo or edit a shot, when I see the portion, then what's left
     follows.
  4. Given logged doses add up to more than the portion, when I see it, then it
     shows zero, never a negative amount, and I'm offered to weigh what's left.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Unchanged in substance. Design EPIC-03-04. Criterion 4 is the
  design's answer to INIT-03 Q3. Weighing is the only remedy for a wrong
  remaining weight in the MVP. See SQ-14 on doses from an "off" shot and its
  fix (the working assumption is that both count). Calculated, never stored.

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
- **Notes:** Unchanged. Design SH-STOCK. Prompting a stock check on a schedule
  is still open (EPIC-03-04 open question).

#### STORY-03-04-03: See which bags are open or finished

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each bag to show whether it's open or
  finished, so that I know at a glance which coffee is in use.
- **Acceptance criteria**
  1. Given a bag with at least one portion open (opened, not finished and not
     in the freezer), when I see it, then it shows as open.
  2. Given every portion of a bag is finished, when I see it, then it shows as
     finished and is in the finished group.
  3. Given a bag with no open portion (all unopened or frozen), when I see it,
     then its portions show their states, and it's listed after open bags.
  4. Given a portion's dates are set, when I see the bag, then its status
     follows those dates.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated ("open" excludes frozen, review M5; criterion 4 wording,
  review M4). Calculated, never stored.

**Coverage:** all In items covered.

### EPIC-03-05: Know when you'll run out

#### STORY-03-05-01: See how fast we use coffee

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see how much coffee my household
  really uses, so that I know how fast we go through it.
- **Acceptance criteria**
  1. Given enough finished portions, when I look at the pantry, then I see a
     usage rate worked out from finished portions, doses, stock checks and
     purchase dates, and can see what it's based on.
  2. Given not enough history yet, when I look, then I'm told Tare is still
     learning, rather than shown a guess.
  3. Given new shots or finished portions, when I look again, then the rate
     follows.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. "Enough history" and the accuracy target are open
  (X-2). Calculated, never stored.

#### STORY-03-05-02: See when we'll run out

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see roughly when we'll run out,
  counting the freezer, so that I can buy coffee in time.
- **Acceptance criteria**
  1. Given a usage rate and coffee left across all portions, when I look at the
     pantry, then I see roughly how many days of coffee we have, and how much of
     it is in the freezer.
  2. Given no usage rate yet, when I look, then no estimate is shown.
  3. Given I add a bag, when I look again, then the estimate grows.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. Reorder prompts are out of scope. Whether prediction
  is Phase 1 at all is INIT-03 Q1.

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

**Coverage:** all In items covered.

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
- **Notes:** Updated (on a part; servicing never makes a new setup, S-02;
  title was "Log maintenance on a piece of kit"). Revision 2's "retired unit"
  criterion is removed (no retire). Design SCR-UNIT maintenance section,
  SH-MAINTENANCE. Offsets are Next (EPIC-04-03). Editing or deleting an event
  isn't in scope.

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
     my shots, then it's marked in words.
  4. Given maintenance on a machine or basket, when I log it, then no
     recalibration mark is offered.
- **Source sections:** S-01, S-02
- **Priority:** MVP
- **Size:** 1
- **Notes:** Updated (closed: recalibration is a flag on the event, TQ-05).
  DQ-15 (on by default for burrs and re-zero) is still the working assumption
  to confirm. Every grinder event starts a new grind period, flagged or not.

#### STORY-04-01-03: Know my grinder's current grind period

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want my grinder to show when its current
  grind period started and how many shots are in it, so that I know which of
  my settings still compare.
- **Acceptance criteria**
  1. Given a grinder with maintenance, when I look at it, then I see when its
     current grind period started and how many shots on setups with that
     grinder are in it.
  2. Given a grinder with no maintenance, when I look at it, then I'm told all
     its shots are in one period.
  3. Given I add or back-date an event, when I look again, then the period
     start and shot count follow, and no past shot is changed.
  4. Given maintenance on a machine or basket, when I look at shots, then grind
     periods aren't affected.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (shots belong to a grinder through their setup).
  Design SCR-UNIT current-period line (PEC-06). Periods come from dates, never
  stored.

#### STORY-04-01-04: See maintenance in my recent shots

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want my recent shots list to show where I
  serviced my grinder, so that I can see which shots came before and after.
- **Acceptance criteria**
  1. Given a grinder event inside the listed period, when I look at my recent
     shots, then a divider appears at the event's place in time, naming the
     grinder (by nickname, else model), the kind of work and the date, and
     whether it was a recalibration.
  2. Given an event happened on a day I also pulled shots, when I look, then the
     divider sits among that day's shots at its time.
  3. Given maintenance on a machine or basket, or on a grinder with no shots in
     the list, when I look, then no divider is shown.
  4. Given I add or back-date an event, when I look again, then its divider
     moves to the new place and no shot changes.
  5. Given a divider, when I open it, then I see that grinder.
- **Source sections:** S-02, S-04
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (part kinds). PEC-06. Design EPIC-04-01 step 3.
  Depends on STORY-02-06-01. Dividers are read aloud to screen-reader users.

**Coverage:** all In items covered.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

#### STORY-04-02-01: Grind that follows bean age

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want my recipe's grind adjusted for how
  my coffee has aged, so that I don't have to re-dial as a bag ages.
- **Acceptance criteria**
  1. Given a recipe and enough measured shots to estimate aging, when I open the
     recipe, then I see a suggested grind adjusted for the coffee's current
     freshness.
  2. Given there aren't enough shots to estimate aging, when I open the recipe,
     then I see the pinned grind unchanged.
  3. Given I see a suggestion, when I check the stored recipe, then it's
     unchanged.
  4. Given the suggestion, when I see it, then it moves in the grinder's own
     coarser or finer direction.
- **Source sections:** S-01, S-02, S-04
- **Priority:** Next
- **Size:** 5
- **Notes:** Lightly updated (wording for the two clocks). Which clock drives
  aging, or both, is part of INIT-04 Q3, which is still open; the size may
  grow once answered. No AI (EPIC-04-02 open question: algorithm vs AI).

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
- **Notes:** Unchanged. "Batch character" isn't defined beyond S-02; assumed
  to be the bag's consistent offset from the recipe. INIT-04 Q3.

#### STORY-04-02-03: Only measured shots count as measurements

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want only the shots I actually measured to
  shape the suggestion, so that one-tap shots don't fake a trend.
- **Acceptance criteria**
  1. Given one-tap and measured shots, when the suggestion is worked out, then
     only measured shots' values are used as measurements.
  2. Given one-tap shots with no "off" reaction, when the suggestion is worked
     out, then they count only as "the recipe was fine".
  3. Given a bag with only one-tap shots, when I open the recipe, then the
     suggestion is not moved by them.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (prep note). How an "off" reaction is treated isn't in
  the spec; assumed "off" one-tap shots carry no signal of their own (their
  measured fix does, DQ-12). **Open (SQ-18, EPIC-04-02 open question):** are
  shots with and without WDT or a puck screen compared as equals? Decide
  before this epic is specified in full.

#### STORY-04-02-04: Recent shots count most

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want recent shots to count more than old
  ones, so that the suggestion follows how my coffee behaves now.
- **Acceptance criteria**
  1. Given older and newer measured shots that disagree, when the suggestion is
     worked out, then it's closer to the newer shots.
  2. Given shots older than the window, when the suggestion is worked out, then
     they have little or no effect.
  3. Given the same shots, when the suggestion is worked out twice, then it's
     the same both times.
- **Source sections:** S-01, S-02
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. Weighting strength and window are open (INIT-04 Q2).

#### STORY-04-02-05: Only compare shots from the same grind period

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want shots from before my last grinder
  maintenance left out of the suggestion, so that a burr change or re-zero
  isn't mistaken for drift.
- **Acceptance criteria**
  1. Given shots before and after a grinder event, when the suggestion is worked
     out, then only shots in the current period are used.
  2. Given a new period with no measured shots yet, when I open the recipe,
     then no drift adjustment is applied.
  3. Given maintenance on a machine or basket, when the suggestion is worked
     out, then periods aren't affected.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 2
- **Notes:** Lightly updated (part kinds). Depends on STORY-04-01-03.
  Maintenance offsets are EPIC-04-03.

#### STORY-04-02-06: See the suggested grind where I brew

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want to see the suggested grind, with my
  recipe's grind and a short reason, on the home screen and in the pre-filled
  log, so that I trust it and use it without looking it up.
- **Acceptance criteria**
  1. Given a suggestion differs from the pinned grind, when I see the home
     screen, then I see the suggested grind, my recipe's grind, and a short
     reason (for example that the beans have aged).
  2. Given the pre-filled log (STORY-02-03-02, STORY-02-03-03), when it opens,
     then grind starts at the suggestion, with the recipe's grind shown as what
     it was.
  3. Given I pull a one-tap shot with a suggestion shown, when it's recorded,
     then it records the grind I was shown.
  4. Given no suggestion applies, when I see the home screen, then only the
     pinned grind is shown.
- **Source sections:** S-02, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. Design EPIC-04-02 shows both the value and the
  reason; INIT-04 Q4 is still open. Criterion 3 is an assumption the spec
  doesn't settle.

**Coverage:** all In items covered. Maintenance drift is EPIC-04-03 (epic
overlap flag).

### EPIC-04-03: Re-dial once after maintenance and keep every recipe

#### STORY-04-03-01: Re-dial one coffee and get the shift

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want to be prompted to re-dial one coffee
  after grinder maintenance and have Tare work out how far my dial moved, so
  that I don't have to re-dial every coffee.
- **Acceptance criteria**
  1. Given I logged a grinder event, when I open the home screen, then I'm
     invited, calmly, to re-dial one coffee, and accepting opens a dial-in.
  2. Given a recipe pinned before the event on a setup with that grinder, when
     I pin a new recipe for the same coffee on that setup after it, then Tare
     proposes a shift in grinder units, with a one-line explanation.
  3. Given the beans aged between the two dial-ins, when the shift is proposed,
     then the aging estimate is taken off first.
  4. Given there's no recipe from before the event for the coffee I re-dial,
     when I pin, then no shift is proposed and I'm told why.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 5
- **Notes:** Lightly updated (setups). Depends on STORY-04-02-01 for the aging
  estimate (INIT-04 Q3). Servicing doesn't change the setup (S-02), so the
  re-dial is on the same setup.

#### STORY-04-03-02: Confirm or edit the shift

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want to confirm or change the proposed
  shift, so that I decide how my old recipes are mapped.
- **Acceptance criteria**
  1. Given a proposed shift, when I confirm it, then it's saved on the event with
     the re-dial it came from.
  2. Given a proposed shift, when I change it and confirm, then my value is
     saved.
  3. Given a confirmed shift, when I later edit it from the grinder's events,
     then the new value is used from then on.
  4. Given I decline, when I look at old recipes, then they're shown unshifted.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. A confirmed shift is a user decision: stored, not
  recalculated (S-02).

#### STORY-04-03-03: Old recipes read right after maintenance

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want every recipe pinned before the
  maintenance to show the right grind now, so that all my coffees work again
  after one re-dial.
- **Acceptance criteria**
  1. Given a confirmed shift on a grinder event, when I open any recipe pinned
     before the event on a setup with that grinder, then its grind is shown
     with the shift applied.
  2. Given the shifted recipe, when I check what's stored, then the recipe is
     unchanged.
  3. Given a recipe on a setup with a different grinder, when I open it, then
     no shift is applied.
  4. Given several events on one grinder, when I open an old recipe, then each
     confirmed shift after it is applied in order.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated (recipes reach the grinder through their setup). Criterion
  4 assumes shifts chain (EPIC-04-03 open question). Offsets never move a
  recipe to a different setup; a new setup starts from the closest one
  (STORY-02-01-06).

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
- **Notes:** Unchanged. The fitting method and what counts as disagreeing are
  open (EPIC-04-04 open question). Criterion 3 is an assumption.

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
- **Notes:** Unchanged. Formula from S-08.

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
  1. Given my household, when I add a sub persona with a name, then it's saved
     in my household with no login of its own.
  2. Given I try to add one without a name, when I save, then I'm asked for a
     name and nothing is saved.
  3. Given I added a sub persona, when anyone in my household looks at
     profiles, then they see it.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. Design EPIC-05-01 (people screen from Profile).
  Criterion 2 assumes a sub persona must be named (EPIC-05-01 open question:
  default label). Sub personas never share data (S-02).

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
     If removal is ruled out, this criterion becomes "removing isn't offered".
  3. Given the main persona, when I look at removing it, then I can't.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 2
- **Notes:** Updated (review m7: criterion 2 is marked as an explicit
  placeholder). The design covers add and rename only. Criterion 3 assumes
  every login keeps its one main persona (S-04).

#### STORY-05-01-03: Choose who I'm brewing for on the home screen

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want to pick a profile on the home
  screen, so that the drink, coffee and recipe shown are theirs.
- **Acceptance criteria**
  1. Given my household has more than one persona, when I pick one on the home
     screen, then it shows that persona's usual drink at this time of day, the
     coffee and their recipe on the current setup.
  2. Given I pick a persona with no recipe for the drink shown on this setup,
     when I look, then "Dial in" is offered.
  3. Given I pull a shot or open the log after picking a persona, when the shot
     is saved, then it's for that persona.
  4. Given a household with only the main persona, when I open the home screen,
     then nothing about picking a persona is in my way.
- **Source sections:** S-02, S-04, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (setup). Design EPIC-05-01. The current setup is
  per persona (DQ-18: the setup of that persona's last shot). Whether the
  chosen persona is remembered between visits isn't in the spec; for the tech
  lead and designer.

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
  3. Given my recent shots or a shot's details, when I look, then I can tell
     whose taste each shot records.
  4. Given my own recipes, when I brew for a sub persona, then mine are
     unchanged.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. No schema change (S-02).

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
- **Notes:** Delivery (link, email) and owner vs member permissions are open
  (EPIC-05-02 open question; INIT-05 Q2).

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
- **Notes:** Criterion 2 is marked as a placeholder (review m7). Depends on
  EPIC-05-03.

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
- **Notes:** Design direction: the joiner sees the history before claiming,
  and the claim is reversible until confirmed. Criterion 3 is open
  (EPIC-05-02 open question). Leaving the household is open (INIT-05 Q3).

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
- **Notes:** The opt-in itself is EPIC-06-05.

### EPIC-05-03: Keep your coffee history when you change phones

#### STORY-05-03-01: Link my account to Google

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google from my
  profile and keep everything I've logged, so that my history isn't lost if my
  phone is, or if my browser clears its storage.
- **Acceptance criteria**
  1. Given I've been using Tare without signing in, when I link Google from my
     profile, then all my parts, setups, pantry, recipes and shots are still
     there, unchanged, and my profile says my account is linked.
  2. Given I linked Google, when I see my profile, then its name or label is
     unchanged; nothing is taken from my Google account.
  3. Given the Google account is already linked to another Tare account, when I
     try to link it, then I'm told, and my current data stays as it is.
  4. Given linking fails or I cancel, when I return, then I'm still in my
     account with all my data, and can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (the eviction risk in the story's benefit, S-02).
  Design EPIC-05-03. Firebase links Google to the same anonymous account
  (S-02). Criterion 3 assumes no merge of households (EPIC-05-03 open
  question). DQ-16 (Google's branded button) is a design question.

#### STORY-05-03-02: Reach my history on another phone

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google on a new
  phone and find my history, so that changing phones doesn't mean starting
  again.
- **Acceptance criteria**
  1. Given I linked Google on one device, when I sign in with the same Google
     account on another, then I reach the same account and household.
  2. Given I'm signed in on a new device, when I look, then I see all my parts,
     setups, pantry, recipes and shots.
  3. Given I open Tare on a new device for the first time, when it starts, then
     I'm offered, quietly, to sign in with Google before a new account is set
     up, and I can ignore it.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 3
- **Notes:** Lightly updated (wording). Design SCR-START sign-in option, never
  a wall. Using two devices at once isn't in the spec.

#### STORY-05-03-03: Be reminded once to keep my history safe

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want one gentle reminder to link my
  account once I've built up some history, so that I don't lose it without
  being nagged.
- **Acceptance criteria**
  1. Given I haven't linked Google, when I pin my first recipe or log my tenth
     shot, whichever comes first, then my home screen invites me to link, once.
  2. Given the invitation, when I dismiss it, then it never comes back; I can
     still link from my profile.
  3. Given I accept it, when I link, then it behaves as STORY-05-03-01.
- **Source sections:** S-02
- **Priority:** Next
- **Size:** 1
- **Notes:** Unchanged. The design answers the EPIC-05-03 prompting question;
  confirm the trigger.

**Coverage:** all In items covered.

---

## INIT-06: Dial in a new bag in fewer shots with AI and the community

All stories in this initiative are Later and light; the design gives
direction only (section 6). Each AI feature ships with evals and
observability (S-01). The eval stories are marked **enabler placeholders**
(review m7, SQ-13): they hold scope and size, but aren't user value as
written, and will be re-framed when the initiative is re-planned. All AI
output is offered as a suggestion the user can accept or ignore.

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
- **Notes:** Model choice is open (INIT-06 Q5).

#### STORY-06-01-02: Review a scan before adding the bag

- **Parent:** EPIC-06-01
- **Story:** As a home enthusiast, I want to check and correct what was scanned
  before saving, so that a wrong read doesn't end up in my pantry.
- **Acceptance criteria**
  1. Given a scan result, when I review it, then I can correct any field before
     the bag is added.
  2. Given the scanned coffee isn't in the catalog, when I continue, then I can
     add it (EPIC-01-06).
- **Source sections:** S-09, S-02
- **Priority:** Later
- **Size:** 3
- **Notes:** How a scan is matched to a catalog entry is open (EPIC-06-01 open
  question).

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
- **Notes:** Enabler placeholder (SQ-13). The scanner's eval set isn't
  described (EPIC-06-01 open question).

### EPIC-06-02: Get a grounded fix when a shot goes wrong

#### STORY-06-02-01: Get a fix for a bad shot

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want to be told what to change after a bad
  shot, on my own setup and in the right direction on my dial, so that the
  next shot is better.
- **Acceptance criteria**
  1. Given a bad measured shot with scores or defects, when I ask for help in
     the fix flow, then I get a short diagnosis and one action for my setup.
  2. Given my grinder's coarser direction, when the action says finer or
     coarser, then it names the right way on my dial.
  3. Given one-tap shots in my history, when the Coach advises, then it uses
     only measured shots.
- **Source sections:** S-09, S-08, S-01, S-03
- **Priority:** Later
- **Size:** 5
- **Notes:** The Coach's "suggest a WDT" rule reads the shot's WDT tick, not
  the setup's parts (epics revision 8). The S-09 "days open" input is the
  since-opening clock (STORY-03-03-04). With "not sure" about the coarser
  direction (STORY-01-06-07), the Coach can't name a direction on the dial;
  to resolve when re-planned.

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
- **Notes:** **Flagged at 8: split** into ingesting guides and manuals, and
  using them in advice, when this epic is re-planned. Sources and licensing
  are open (EPIC-06-02 open question).

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
- **Notes:** Enabler placeholder (SQ-13). Golden Dataset source and owner are
  open (INIT-06 Q6). Palate alignment needs EPIC-06-04 first.

### EPIC-06-04: Tare learns your palate as you log

#### STORY-06-04-01: Learn my taste without a survey

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want Tare to learn what I like from what I
  log and rate, so that advice fits my taste without filling in forms.
- **Acceptance criteria**
  1. Given a persona's logged shots and ratings, when the taste graph is built,
     then it reflects them, with no preference questions asked.
  2. Given two personas, when their graphs are built, then each uses only its
     own shots.
- **Source sections:** S-01, S-06, S-04
- **Priority:** Later
- **Size:** 5
- **Notes:** What a taste graph contains is open (EPIC-06-04 open question). A
  non-AI slice could move to Next (INIT-06 Q2).

#### STORY-06-04-02: One-tap shots and reactions count the right way

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want my quiet one-tap shots and quick
  reactions to count as light signals, so that my taste isn't skewed by
  copied values.
- **Acceptance criteria**
  1. Given one-tap shots, when the graph is built, then their values are never
     used as measurements.
  2. Given silence and reactions, when the graph is built, then silence counts
     as a weak "fine" and reactions as stronger signals.
- **Source sections:** S-02, S-06
- **Priority:** Later
- **Size:** 3
- **Notes:** One-tap shots carry a reaction only, never taste scores (SQ-17).

#### STORY-06-04-03: Palate learning that's checked and monitored (enabler placeholder)

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want palate learning tested and
  monitored, so that it doesn't drift away from my taste.
- **Acceptance criteria**
  1. Given an eval set of logging histories, when it runs, then the graphs are
     scored against expected tastes.
  2. Given it's live, when it runs, then results are observable.
- **Source sections:** S-01
- **Priority:** Later
- **Size:** 3
- **Notes:** Enabler placeholder (SQ-13). Eval set not defined in the spec.

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
- **Notes:** Design direction: a plain-language consent screen in Profile, off
  by default. Withdrawing and deleting already-shared data is open (INIT-06
  Q7). Whether an anonymous account can opt in is open (EPIC-06-05 open
  question).

#### STORY-06-05-02: Only complete, measured shots are shared

- **Parent:** EPIC-06-05
- **Story:** As a home enthusiast, I want only my complete measured shots
  shared, so that the community isn't fed partial or copied data.
- **Acceptance criteria**
  1. Given a measured shot with grind, dose, yield and time, for a persona
     claimed by a user who opted in, when it's saved, then it's eligible.
  2. Given a one-tap shot, a partial log, or a shot for an unclaimed persona,
     when it's saved, then it's never eligible.
- **Source sections:** S-05, S-07, S-02
- **Priority:** Later
- **Size:** 3
- **Notes:** Whether eligibility is computed from day one is open (X-3).

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
- **Notes:** Cohort grouping is open (INIT-06 Q4).

### EPIC-06-06: Start a new bag from the community, tuned to you

#### STORY-06-06-01: Start a new bag from community shots

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want a starting recipe for a new bag from
  community shots of the same coffee, so that I dial in with fewer shots.
- **Acceptance criteria**
  1. Given community shots of the same coffee logged within 7 days of their
     bag being opened, when I add a new bag, then I'm offered starting values
     from them, with where they came from.
  2. Given no such shots, when I add a bag, then no community start is offered.
- **Source sections:** S-05, S-03
- **Priority:** Later
- **Size:** 5
- **Notes:** How a community grind maps to my grinder is open (EPIC-06-06 open
  question). Needs EPIC-06-07 so the same coffee is one entry.

#### STORY-06-06-02: Trust the right contributors more

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want shots from verified pros to count
  more than others, so that my starting point is reliable.
- **Acceptance criteria**
  1. Given shots from enthusiasts and verified pros, when the start is worked
     out, then they're weighted by contributor level.
  2. Given a contributor's level changes, when the start is worked out again,
     then the new weight is used.
- **Source sections:** S-05
- **Priority:** Later
- **Size:** 3
- **Notes:** How contributor level is determined is open (INIT-06 Q3).

#### STORY-06-06-03: Warn me when a pro's recipe aims for another taste

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want to be warned when a pro's recipe
  aims for a different taste from mine, with a version nudged toward my
  palate, so that I don't chase someone else's cup.
- **Acceptance criteria**
  1. Given a pro's recipe whose target differs from my taste graph, when it's
     offered, then I see a Match Score Warning, which isn't styled as a shot
     warning.
  2. Given the warning, when I look, then I'm offered a version adjusted toward
     my palate.
- **Source sections:** S-05, S-03
- **Priority:** Later
- **Size:** 5
- **Notes:** Needs EPIC-06-04 and EPIC-06-02. Design direction: neutral, not
  the signal colour.

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
- **Notes:** Enabler placeholder (SQ-13). Eval set not defined in the spec.

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
- **Notes:** Who confirms is open (EPIC-06-07 open question; SQ-12).
  Conflicting data between entries is open, including capabilities a
  household answered (STORY-01-06-06 to 09). Merging parts may make two
  setups identical; how they combine is a question for the re-plan.

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
- **Notes:** Model choice is open (INIT-06 Q5).

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
- **Notes:** Enabler placeholder (SQ-13).

---

## Stories to split or cut

- **Split:** STORY-06-02-02 (RAG grounding, 8), when EPIC-06-02 is re-planned.
- **Watch:** STORY-04-02-01 and STORY-04-02-02 (5 each) may reach 8 once
  INIT-04 Q3 is answered. STORY-02-01-06 (5) is the largest new MVP story; if
  it runs long, ship the same-grinder case first and the different-grinder
  grind rule next.
- **MVP size (review m9):** the MVP is now 190 points. The biggest levers:
  - EPIC-01-06 split (26 points): ship coffee additions and the duplicate
    check (01-06-01 to 05) first, then the hardware capability stories
    (01-06-06 to 09).
  - STORY-01-06-09 (answer capabilities later, 3), approved as PEC-08.
  - STORY-01-01-03 (rename the profile, 2) and STORY-02-01-02 (pin by entering
    values, 3).
  - STORY-01-02-09 criterion 4's 90-day grouping can wait until setups
    actually multiply.
- **Could merge:** STORY-01-01-06 (shared states) into STORY-01-01-05.

## Not covered

- The "ran fast" shot warning: out of scope until a threshold exists (DQ-09).
- Reopening the app on the last screen used (revision 2's STORY-01-01-05
  criterion 5): cut as unrequested scope (review m8). The design still
  describes it; the Head of Product can restore it.
- Correcting a portion's dates after they're set (review M4): not in the MVP;
  the design names it a Next candidate.
- Editing or deleting a maintenance event, deleting a setup or a shot,
  removing a recipe (SQ-05) or a bag override (SQ-11), and reopening a
  finished portion (SQ-15): in neither the epic scope nor the design.

## Open questions for the Head of Product

### Most pressing

These shape MVP stories:

1. **SQ-17, one-tap taste (review M1).** STORY-02-06-02 now assumes one-tap
   shots carry a reaction only, never a rating, scores or defects. Confirm,
   so the tech lead can align `updateShot` and the edit screen.
2. **DQ-22, stock baskets in the seed.** A basket is required for every setup
   (S-02). That only works if the seed catalog lists each machine maker's
   stock baskets by model. Who curates the seed (EPIC-01-02) is still open.
3. **DQ-08, the defect list.** Only channelling ships until it's defined;
   STORY-01-05-03 and the only shot warning depend on it.
4. **SQ-14, doses from an "off" shot and its fix.** Both count today (DQ-12).
5. **DQ-11 fallback ranges** for "not sure" equipment (STORY-01-06-08).
6. **INIT-02 Q1** still blocks EPIC-02-04 (Next).

The design's working assumptions DQ-02 to DQ-07, DQ-12 to DQ-15 and DQ-17 to
DQ-22 are used as written. Each is cited in the stories that depend on it.

### Story questions (SQ)

Closed in this revision:

- **SQ-02** (retired part in a setup): no retire exists (S-02), and
  STORY-01-02-03 is retired.
- **X-1** (timestamp precision; not an SQ, listed for completeness): closed by
  TQ-04 and TQ-07, and removed from story notes (review m1).

Still open:

- **SQ-04** (STORY-01-06-05): can a household add links or aliases to a
  verified or seed entry, or only to its own?
- **SQ-05** (STORY-02-01-03): can a recipe be unpinned or removed?
- **SQ-09** (STORY-03-01-02), narrowed: thaw-before-freeze is rejected. Should
  a roast or packing date in the future also be rejected?
- **SQ-11** (EPIC-02-04): can a bag's own recipe be removed? Answer it with
  INIT-02 Q1.
- **SQ-12** (STORY-01-06-03, STORY-06-07-01): the catalog reviewer (admin) is
  not a spec user type. Should the spec name the role?
- **SQ-13** (INIT-06 eval stories): they're now marked as enabler
  placeholders. Re-frame them when INIT-06 is re-planned, or name a team role
  in the spec.
- **SQ-14** (STORY-03-04-01, STORY-02-03-02): doses from an "off" one-tap shot
  and its fix (see "Most pressing").
- **SQ-15** (STORY-03-02-03): can a portion marked finished by mistake be
  reopened?
- **SQ-16** (STORY-01-01-07): who owns the first-run checklist, EPIC-01-01 or
  EPIC-02-02? Ownership only; it doesn't affect the code.

New:

- **SQ-17** (STORY-02-06-02, 02-06-03, review M1): can a one-tap shot carry a
  rating, scores and defects when edited? Working assumption: no, a reaction
  only.
- **SQ-18** (STORY-04-02-03, EPIC-04-02 open question): should drift detection
  compare shots with and without WDT or a puck screen as equals? Open for the
  Next epic; it doesn't affect the MVP, which only records the ticks.
