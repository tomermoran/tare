# Tare user stories (approved, revision 2)

Source: `planning/drafts/epics.md` (final, revision 5, 30 epics),
`planning/drafts/design.md` (approved by the Head of Product after design
review round 2) and `docs/spec.md`, sections S-01 to S-09. S-01 and S-02
override older sections where they differ. `planning/drafts/initiatives.md`
was read for context.

**Status: revision 2, approved by the Head of Product, including the assumptions noted in each story.** Revision 1 was
approved. This revision brings the stories in line with the approved design
and with epics revisions 4 and 5. No GitHub issues have been created.

## Changes in this revision

Revision 1 had 103 stories. Revision 2 has 119: 16 added, 49 updated, none
retired. Every revision 1 ID is kept with the same meaning. Each story's Notes
begin with "New", "Updated", "Lightly updated" or "Unchanged".

**Added (16)**

| ID | Title | Why |
|---|---|---|
| STORY-01-01-05 | Move around the app | App shell (PEC-01) |
| STORY-01-01-06 | See the same loading, empty and error behaviour everywhere | App shell (PEC-01) |
| STORY-01-01-07 | Get started with a short checklist | First-run state on Home (design 2.3) |
| STORY-01-02-05 | Make my first setup in one tap | Setup shortcut (PEC-02) |
| STORY-01-02-06 | Edit a setup | Setup editing (PEC-02) |
| STORY-01-02-07 | Be warned before swapping a setup's machine or grinder | PEC-07 |
| STORY-01-05-04 | See a warning when a shot channelled | Shot warnings (PEC-04) |
| STORY-01-06-06 | Describe a machine I added in my own words | Capability questions (PEC-05) |
| STORY-01-06-07 | Describe a grinder I added in my own words | Capability questions (PEC-05) |
| STORY-01-06-08 | Log shots even when I'm not sure about my setup | "Not sure" fallbacks (DQ-11) |
| STORY-01-06-09 | Answer capability questions later | PEC-08 |
| STORY-02-01-05 | Re-dial a recipe whose setup left its setup | PEC-07 |
| STORY-02-02-06 | Change the drink or coffee before pulling | PEC-03 |
| STORY-02-06-03 | See a shot's details | Shot detail screen (SCR-SHOT) |
| STORY-04-01-04 | See maintenance in my recent shots | Grind period dividers (PEC-06) |
| STORY-05-03-03 | Be reminded once to keep my history safe | Link prompt (design, EPIC-05-03) |

**Updated (49).** Acceptance criteria now follow the approved flows, and
Notes cite the design's screens and its assumptions (DQ-xx). Substantive
updates:

- EPIC-01-01: 01-01-01 (SQ-01 closed), 01-01-03 (profile shows where the
  history lives).
- EPIC-01-02: 01-02-01, 01-02-02, 01-02-03 (SQ-02 closed), 01-02-04 (one
  machine and one grinder is now the design's rule).
- EPIC-01-03: 01-03-01 (context comes pre-chosen; unopened portions offered,
  DQ-06), 01-03-02 (starting values DQ-07, live ratio, finer and coarser
  direction), 01-03-03 (the wheels always hold a value, so the "missing
  value" criterion became "save failed").
- EPIC-01-04: 01-04-01 and 01-04-02 (optional values start unset and can be
  cleared; pre-filled modes start set).
- EPIC-01-05: 01-05-01, 01-05-02 (tasting comes after saving and is
  optional; a choice can be undone), 01-05-03.
- EPIC-01-06: 01-06-01 (link first; capabilities moved to new stories, so 5
  points became 3), 01-06-02, 01-06-04 (the check runs as the link is
  entered; the "check failed" case).
- EPIC-02-01: 02-01-01 (confirmation shows what the pin replaces), 02-01-02,
  02-01-04 (recipes listed per coffee).
- EPIC-02-02: 02-02-01 (defaults DQ-02 and DQ-03; finished-coffee case;
  SQ-06 closed), 02-02-02 (double taps and failed pulls), 02-02-03 (DQ-06),
  02-02-04 (DQ-04), 02-02-05.
- EPIC-02-03: 02-03-01 (DQ-05; SQ-07 closed), 02-03-02 (DQ-12), 02-03-03.
- EPIC-02-06: 02-06-01 (grouped by day, DQ-13 window, markers; 2 points
  became 3), 02-06-02 (context is read-only; SQ-08 closed).
- EPIC-03-01: 03-01-01, 03-01-02, 03-01-03 (DQ-06), 03-01-04 (pantry order;
  2 points became 3).
- EPIC-03-02: 03-02-01 (one portion split off at a time, DQ-14), 03-02-03
  (DQ-06; the "undo finish" criterion was removed as not in the design, now
  SQ-15), 03-02-04 (the five portion states).
- EPIC-03-03: 03-03-01 (estimated, unknown and paused ages).
- EPIC-03-04: 03-04-01 (over-logged portions), 03-04-03 (SQ-10 closed).
- EPIC-04-01: 04-01-02 (recalibration is a flag, DQ-15), 04-01-03 (the
  current period on the unit; 3 points became 2, since the dividers are now
  STORY-04-01-04).
- Next epics: 02-04-01, 02-05-02, 03-05-01, 04-02-06, 04-03-01, 05-03-01,
  05-03-02.

Light updates (wording or one criterion, same scope and size): 01-06-03,
02-05-04, 03-02-02, 03-03-02, 03-04-02, 04-01-01.

**Retired:** none.

**Questions:** SQ-01, SQ-02, SQ-03, SQ-06, SQ-07, SQ-08 and SQ-10 are closed by
the design or the epic revisions; SQ-09 is narrowed; SQ-15 and SQ-16 are new.
See "Open questions" at the end.

## How to read this file

- **IDs:** `STORY-II-EE-SS` (initiative, epic, story). Parent is the epic ID.
  IDs stay stable across revisions, and a retired ID is never reused.
- **Grouping:** by initiative, then by epic in ID order, whatever the
  priority. The priority is on every story and in the summary.
- **Personas:** stories are written for the spec's user type, the everyday
  home enthusiast (S-01), shortened to "home enthusiast". Where the household
  matters, they use the S-04 roles: household member, main persona, sub
  persona. No real people are named.
- **Sizes:** rough points (1, 2, 3, 5, 8). Anything at 8 is flagged.
- **Design references:** acceptance criteria describe behaviour. Notes cite
  the design's screens (`SCR-*`), sheets (`SH-*`) and assumptions (`DQ-*`).
  Where a story depends on a design assumption, that assumption is its working
  assumption until the Head of Product says otherwise.
- **Open questions:** questions carried in `epics.md` and `initiatives.md` are
  referenced by their IDs (`INIT-NN Q#`, `X-1` to `X-3`) or as "EPIC-NN-NN
  open question: topic". Story questions are `SQ-NN`, listed at the end.
- **Cross-cutting constraints** from `epics.md` (localization, Japandi design,
  calculated-never-stored values, no AI in Phase 1, following catalog merge
  pointers) and the design's foundations (section 1) apply to every story and
  aren't repeated in each one.
- **Detail level:** MVP and Next epics have full stories with Given/When/Then
  acceptance criteria. **Later epics have lighter stories**: ID, statement,
  priority, size and two or three brief acceptance criteria. Those epics will
  be re-planned before they're built, so their stories are placeholders for
  scope and size, not ready for build. They are unchanged in this revision
  apart from notes.

## Summary

| Epic | Title | Priority | Stories | Points |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | MVP | 7 | 18 |
| EPIC-01-02 | Describe your setup once | MVP | 7 | 17 |
| EPIC-01-03 | Log a shot in seconds | MVP | 5 | 14 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | MVP | 2 | 6 |
| EPIC-01-05 | Say how it tasted | MVP | 4 | 8 |
| EPIC-01-06 | Add what's missing from the catalog | MVP | 9 | 26 |
| EPIC-02-01 | Pin the recipe that worked | MVP | 5 | 14 |
| EPIC-02-02 | Pull your daily shot in one tap | MVP | 6 | 16 |
| EPIC-02-03 | Fix a bad shot from your recipe | MVP | 3 | 7 |
| EPIC-02-04 | Give one bag its own recipe | Next | 2 | 5 |
| EPIC-02-05 | Make the drink list yours | Next | 4 | 7 |
| EPIC-02-06 | See your recent shots | MVP | 3 | 8 |
| EPIC-03-01 | Add a bag to your pantry | MVP | 4 | 10 |
| EPIC-03-02 | Split and freeze a bag | MVP | 4 | 11 |
| EPIC-03-03 | Know how fresh your beans really are | MVP | 3 | 7 |
| EPIC-03-04 | See how much coffee is left | MVP | 3 | 7 |
| EPIC-03-05 | Know when you'll run out | Next | 3 | 8 |
| EPIC-04-01 | Record maintenance on your setup | MVP | 4 | 8 |
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

| Priority | Epics | Stories | Points | Revision 1 |
|---|---|---|---|---|
| MVP | 15 | 69 | 177 | 54 stories, 138 points |
| Next | 8 | 27 | 74 | 26 stories, 73 points |
| Later | 7 | 23 | 92 | unchanged |
| **Total** | **30** | **119** | **343** | 103 stories, 303 points |

The MVP grew by 39 points, almost all from scope the Head of Product added in
epics revisions 4 and 5:

- EPIC-01-06, capability questions, fallbacks and "answer later": +10.
- EPIC-01-01, app shell and first-run checklist: +9.
- EPIC-01-02, setup shortcut, editing and swap warning: +7.
- EPIC-02-01, re-dialing recipes whose setup left the setup: +3.
- EPIC-02-02, changing drink and coffee on Home: +3.
- EPIC-02-06, shot detail and day grouping: +3.
- EPIC-01-05, the channelling warning: +2.
- EPIC-03-01 (pantry order) and EPIC-04-01 (grind period dividers, less the
  smaller period story): +1 each.

Later points are rough placeholders.

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
- **Notes:** Updated. Design SCR-START. SQ-01 is closed: the design gives the
  failure state (error and retry, nothing partial). Uses Firebase anonymous
  sign-in per device (S-02). Accepted risk: a lost or reset device loses its
  data until EPIC-05-03. X-1 applies to the created and joined timestamps.

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
- **Notes:** Updated. Design SCR-PROFILE, opened from the persona label on
  Home. Criterion 5 is the accepted data-loss risk (S-02), stated without
  alarm; EPIC-05-03 replaces it with the linked state. EPIC-01-01 open
  question: is a rename in the MVP? The epic and the design include it.

#### STORY-01-01-04: Keep my kitchen private to my household

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my setup, coffee, recipes and shots to
  belong to my household only, so that no one else sees or changes them.
- **Acceptance criteria**
  1. Given I add anything (setup, setup, bag, recipe, shot), when it's saved,
     then it belongs to my household.
  2. Given another household exists, when its user browses Tare, then they
     can't see or change anything that belongs to my household.
  3. Given I use Tare, when I browse my setup, pantry, recipes or shots, then I
     only see my household's records, plus shared catalog entries.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged. Visibility of catalog entries a household adds is
  STORY-01-06-03. The household itself is never shown in the MVP (S-04).

#### STORY-01-01-05: Move around the app

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want to reach brewing, my shots, my
  pantry and my setup from anywhere, and to be brought back where I was after a
  side task, so that I never get lost at the machine.
- **Acceptance criteria**
  1. Given I'm on any main screen, when I choose Brew, Shots, Pantry or Setup,
     then I go straight there.
  2. Given a main screen whose feature isn't built yet, when I open it, then I
     see a short explanation, never a blank screen or an action that does
     nothing.
  3. Given I'm in a task (logging a shot, adding a bag, adding setup), when I
     leave it with unsaved changes, then I'm asked once whether to discard
     them; with no changes I leave at once.
  4. Given I start adding something from inside another task (for example a
     bag from the shot log), when I finish, then I return to that task with
     the new item chosen and nothing I'd entered lost.
  5. Given I reopen the app shortly after using it, when it opens, then I'm
     back on the screen I was last on; otherwise I land on Brew.
- **Source sections:** S-06, S-01
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-01). Design 2.1 (screen map, tabs NC-01, full-screen
  tasks, return-to). Criterion 5's "shortly" is the design's "within the last
  few minutes"; the exact time is for the tech lead. The shell is the frame
  only: each screen's content belongs to its own epic.

#### STORY-01-01-06: See the same loading, empty and error behaviour everywhere

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want every screen to behave the same way
  while loading, when empty and when something fails, so that I always know
  what's happening and what to do next.
- **Acceptance criteria**
  1. Given a screen is loading its data, when I look at it, then I see a
     placeholder of its shape, not a blank screen.
  2. Given a list has nothing in it yet, when I see it, then I get one sentence
     saying so and at most one action to fix it.
  3. Given loading or saving fails, when I look, then I'm told what failed and
     can try again, and anything I typed is kept.
  4. Given any failure or empty state, when I see it, then it never uses the
     shot-warning colour.
- **Source sections:** S-01, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-01). Design 1.2 (states), NC-10, NC-11, NC-12. Later
  stories rely on these patterns and don't repeat them, except where a
  failure has its own behaviour.

#### STORY-01-01-07: Get started with a short checklist

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want the first screen to show me the few
  steps to my first shot, so that setup feels short and I always know what's
  next.
- **Acceptance criteria**
  1. Given nothing is set up, when I open Brew, then I see three steps: add my
     machine and grinder, add a bag of coffee, pull my first shot.
  2. Given I've done a step, when I return, then it's marked done and the next
     step is the one offered.
  3. Given I start a step from the checklist, when I finish it, then I come
     back to the checklist.
  4. Given I've added a machine and a grinder but have no setup, when I see
     the first step, then it offers to make them my setup
     (STORY-01-02-05).
  5. Given every step is done, when I open Brew, then the checklist is gone
     and my daily shot shows instead.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** New. Design 2.3 (first-run state) and DES-02-02-04. The design
  says first run belongs to EPIC-01-01 but lists its design task under
  EPIC-02-02, so ownership is ambiguous (SQ-16). It's placed here because it
  ships before Home's recipe card exists. It depends on STORY-01-02-02 and
  STORY-03-01-02 for its targets.

**Coverage:** all In items covered, including the app shell (PEC-01). Out
items (Google sign-in, drink list editing, sub personas, consent) are in
their own epics.

### EPIC-01-02: Describe your setup once

#### STORY-01-02-01: Find my machine and grinder in the catalog

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to find the machine, grinder, basket
  and accessories I own by maker and model, so that Tare knows exactly what my
  setup can do.
- **Acceptance criteria**
  1. Given I'm adding a kind of setup, when I search, then matching models of
     that kind are listed with their maker, so one search usually finds the
     model.
  2. Given I haven't searched, when I browse, then I see makers in
     alphabetical order and can open one to see its models of that kind.
  3. Given a model is sold under a regional name, when I search by that alias
     (for example the UK name of a US-branded machine), then the model is
     found.
  4. Given a catalog entry has been merged into another, when I search or
     browse, then I only see the surviving entry.
  5. Given my household added an unverified entry, when I search, then I see it
     marked as added by us; other households' unverified entries never appear.
  6. Given my search finds nothing, when I look at the results, then I'm told
     nothing matched for my search and offered to add it (STORY-01-06-01),
     with my search text carried over.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SCR-CATALOG-PICK (shared with coffee,
  STORY-03-01-01) and SCR-UNIT-ADD. The add-it option is always available at
  the end of the results, not only on no match. Seed coverage and curation:
  EPIC-01-02 open question (who curates).

#### STORY-01-02-02: Add the units I own

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to add each piece of setup I own, with
  an optional nickname and date I got it, so that my shots and maintenance
  belong to my actual unit.
- **Acceptance criteria**
  1. Given I've picked a model, when I add it, then it appears in my setup as a
     unit I own, showing its maker and model, grouped with my other units of
     that kind.
  2. Given I add a unit, when I give it a nickname or acquired date, then they
     are saved with it; when I give neither, it still saves.
  3. Given I've picked a model, when I review it before saving, then I can see
     what it can control (for example exact temperature and its range).
  4. Given I own two units of the same model, when I add both, then they are
     two separate units, each with its own history.
  5. Given my setup is empty, when I open it, then I'm offered to add my machine.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SCR-UNIT-ADD, SCR-KIT and SCR-UNIT. From the
  first-run checklist the kind starts as machine, then grinder. After adding
  the second required unit the flow ends on the setup offer
  (STORY-01-02-05).

#### STORY-01-02-03: Retire a unit and keep its history

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to retire setup I no longer use, so
  that it stops cluttering my choices while my old shots still say what I
  used.
- **Acceptance criteria**
  1. Given I own a unit, when I choose to retire it, then I'm told past shots
     will keep showing it, and asked to confirm.
  2. Given I retired a unit, when I build or edit a setup, then it's no
     longer offered.
  3. Given I logged shots with a unit, when I retire it, then those shots still
     show that unit.
  4. Given I retired a unit, when I look at my setup, then I can still find it
     among retired setup.
  5. Given a retired unit was in a setup, when I see that setup, then the
     unit is shown as retired, and if it was the setup's only machine or
     grinder I'm told the setup needs a new one.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SCR-UNIT, SCR-KIT states. SQ-02 is closed:
  criterion 5 follows the design. Whether recipes pinned on a retired unit
  need a re-dial like a swapped one (STORY-02-01-05) is still open
  (EPIC-02-01 open question: retired units). Un-retiring isn't in the spec.

#### STORY-01-02-04: Group my setup into a setup

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to group my units into a named
  setup such as "Daily Espresso", so that I pick one setup when brewing
  instead of each piece of setup.
- **Acceptance criteria**
  1. Given I own units, when I create a setup with a name, one machine, one
     grinder and any baskets or accessories, then it's saved and I can pick it
     when logging a shot.
  2. Given a unit is already in one setup, when I create another setup,
     then I can add the same unit to it too.
  3. Given I try to save a setup without a name, when I save, then I'm asked
     for a name and nothing is saved.
  4. Given I try to save a setup without exactly one machine and one
     grinder, when I save, then I'm told which part is missing, and nothing is
     saved.
  5. Given I have setups, when I look at my setup, then I see each setup with
     its machine, grinder and basket.
- **Source sections:** S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SCR-TOOLKIT. Criterion 4 is the design's rule,
  explained at save rather than by blocking the action; it still answers the
  EPIC-01-02 open question (setup contents), so confirm.

#### STORY-01-02-05: Make my first setup in one tap

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want Tare to offer to group my machine
  and grinder into a setup as soon as I've added both, so that my first shot
  isn't held up by a form.
- **Acceptance criteria**
  1. Given my household has exactly one machine and one grinder and no
     setup, when I accept the offer, then a setup with both is created with
     a default name in my language, without my typing anything, and I can
     rename it.
  2. Given my household has more than one machine or grinder and no setup,
     when I accept the offer, then I go to setup creation with the most
     recently added machine and grinder and the default name already filled
     in.
  3. Given I've just added my second required unit (a grinder after a machine,
     or the reverse), when I save it, then I'm offered the setup straight
     away.
  4. Given the offer, when I look at it, then it names the machine and grinder
     it will use.
  5. Given any setup exists, when I look at my setup or the checklist, then the
     offer is gone.
- **Source sections:** S-04, S-08, S-06
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-02). Design EPIC-01-02 step 6, SCR-KIT, checklist. DQ-01
  is the working assumption: the default name is stored in the user's
  language when the setup is created, not kept as a translated label.

#### STORY-01-02-06: Edit a setup

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to rename a setup or change its
  setup after I've logged shots with it, so that it keeps matching what's on my
  counter.
- **Acceptance criteria**
  1. Given a setup, when I rename it or change its baskets or accessories,
     then the change is saved without any extra question.
  2. Given a setup with shots, when I edit it, then I'm told past shots keep
     the setup they were pulled with.
  3. Given I edited a setup, when I look at an older shot, then it still
     shows the grinder and machine it was pulled with.
  4. Given an edit leaves the setup without exactly one machine and one
     grinder, when I save, then I'm told what's missing and nothing changes.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (PEC-02, which closes the EPIC-01-02 setup-editing
  question). Design SCR-TOOLKIT edit mode. Swapping the machine or grinder is
  STORY-01-02-07. Deleting a setup isn't in the spec.

#### STORY-01-02-07: Be warned before swapping a setup's machine or grinder

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to be told before I swap my
  setup's grinder or machine that its recipes will need a new dial-in, so
  that losing one tap never surprises me.
- **Acceptance criteria**
  1. Given a setup with recipes pinned on its current machine or grinder,
     when I swap that unit and save, then I'm told how many recipes were
     pinned with the old unit and that they'll need a new dial-in, and asked
     to confirm.
  2. Given I confirm, when the swap is saved, then those recipes are kept and
     treated as needing a re-dial (STORY-02-01-05).
  3. Given I cancel, when I return, then nothing about the setup has changed.
  4. Given a setup with no recipes on the unit I swap, when I save, then no
     warning is shown.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (PEC-07). Design SCR-TOOLKIT step 5 and SH-CONFIRM. The
  reason, for copy: grind and temperature or pressure steps only mean
  something on the unit they were set on (S-02).

**Coverage:** all In items covered, including PEC-02 and PEC-07. Not covered:
deleting a setup (not in the spec). INIT-01 Q5 (°F display-only) is in
STORY-01-04-01.

### EPIC-01-03: Log a shot in seconds

#### STORY-01-03-01: Start a shot with what I'm brewing already chosen

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want the shot log to open with my setup,
  drink and coffee already chosen, and to change them if I need to, so that
  most shots need no choices before the numbers.
- **Acceptance criteria**
  1. Given I open the shot log, when it opens, then the setup is the one I
     last used, and the drink and coffee are the ones on my home screen.
  2. Given I want a different setup, drink or coffee, when I change it, then
     I can choose from my household's setups, its visible drinks, and my
     unfinished portions, each named by its bean with its bag and state.
  3. Given I have unopened portions, when I choose the coffee, then they're
     offered too.
  4. Given I have no setup or no unfinished portion, when I open the shot
     log, then I'm told what's missing and can add it, and I come back with it
     chosen and any values I'd set kept.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated; the title changed from "Choose what I'm brewing". Design
  SCR-LOG context and missing-context paths. SQ-03 is closed by DQ-06, the
  working assumption: unopened portions are offered, and the first shot
  logged against one marks it opened that day (STORY-03-02-03). Finished
  portions are excluded (INIT-03 Q3). Hidden drinks only exist once
  EPIC-02-05 ships.

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
  3. Given my grinder is stepped, when I set grind, then I can only choose
     values on its steps, within its range; given it's stepless, I can choose
     any value in its range at its finest increment.
  4. Given my grinder's coarser direction is known, when I set grind, then I can
     see which way is finer and which is coarser.
  5. Given I change dose or yield, when I look, then the ratio updates at once.
  6. Given I set the time, when I see it, then it's shown in seconds with one
     decimal (for example 27.6 s).
- **Source sections:** S-06, S-08, S-02
- **Priority:** MVP
- **Size:** 5
- **Notes:** Updated. Design SCR-LOG, ShotDial (NC-09), NumberWheel end
  captions. DQ-07 is the working assumption for criterion 2 (defaults: dose
  18 g, yield 36 g, time 28 s, grind mid-range). The ratio is shown, never
  stored. When the coarser direction is "not sure", no direction is shown
  (STORY-01-06-08).

#### STORY-01-03-03: Save the shot as I measured it

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to save a shot with its values and
  setup, so that my history shows exactly what I pulled, even after my setup
  changes.
- **Acceptance criteria**
  1. Given my context and values are set, when I save, then the shot is saved
     as measured, with my persona as whose taste it records and me as who
     logged it.
  2. Given I save a shot, when it's saved, then it records the grinder and
     machine that were in the setup at that moment.
  3. Given a setup's units later change, when I look at an older shot, then
     it still shows the grinder and machine it was pulled with.
  4. Given I saved a shot, when it's saved, then I'm offered to say how it
     tasted, and the shot is already safe if I skip that.
  5. Given saving fails, when I look, then I stay on the log with my values
     kept and can try again; no shot is saved.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. The old "missing value" criterion is replaced by
  criterion 5: in the approved design the wheels always hold a value, so a
  missing value can't happen. Tasting is STORY-01-05-01 to 04 (SCR-TASTE).
  Network eligibility is not computed here (X-3). X-1 applies to the saved
  timestamp.

#### STORY-01-03-04: Mark a shot as sweetened

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to mark a drink as sweetened, so
  that my history knows when sugar or syrup was added.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I mark it sweetened, then the saved shot
     records that it was sweetened.
  2. Given I don't mark it, when I save, then the shot records it as not
     sweetened.
  3. Given any drink type, when I log it, then I can mark it sweetened.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 1
- **Notes:** Unchanged.

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

**Coverage:** all In items covered.

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
- **Notes:** Updated. Design EPIC-01-04 (optional values start unset, with add
  and clear). Assumes °F is display-only and stored in °C (INIT-01 Q5, also
  the design's assumption). Machines whose temperature control is "not sure"
  follow STORY-01-06-08.

#### STORY-01-04-02: Record pressure in the way my machine sets it

- **Parent:** EPIC-01-04
- **Story:** As a home enthusiast, I want to record pressure only when my
  machine lets me set or read it, so that I log what I actually control.
- **Acceptance criteria**
  1. Given my machine has fixed pressure, or is manual without a gauge, when I
     log a shot, then no pressure is asked.
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
- **Notes:** Updated. Design EPIC-01-04 table. Criterion 1 for gaugeless
  manual machines is the design's assumption too (EPIC-01-04 open question:
  manual without gauge). Pressure profiles are out of scope (S-02).

**Coverage:** all In items covered.

### EPIC-01-05: Say how it tasted

#### STORY-01-05-01: Rate a shot overall

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to rate a shot from 1 to 5 right
  after saving it, if I want to, so that I remember which shots I liked.
- **Acceptance criteria**
  1. Given I've just saved a measured shot, when I'm offered to say how it
     tasted, then I can see the shot's values while I rate it from 1 to 5.
  2. Given I chose a rating, when I choose it again, then it goes back to
     unrated.
  3. Given I'm done, when I finish or leave the screen in any way, then my
     choices are saved; with nothing chosen, nothing more is saved and nothing
     asks me to confirm.
  4. Given saving my rating fails, when I look, then my choices are kept and I
     can try again; the shot itself is already saved.
  5. Given I rated a shot, when I see it later, then its rating is shown.
- **Source sections:** S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SCR-TASTE. Tasting never comes before saving and
  never blocks it. Rating is optional (INIT-01 Q3, still open). Rating later
  is through editing (STORY-02-06-02).

#### STORY-01-05-02: Score sweetness, acidity, bitterness and body

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to score sweetness, acidity,
  bitterness and body from 1 to 5, so that my taste history shows what I
  actually tasted.
- **Acceptance criteria**
  1. Given I'm saying how a measured shot tasted, when I score any of the four,
     then each takes a whole number from 1 to 5, with its low and high ends
     named.
  2. Given I score some but not all four, when I finish, then the ones I scored
     are saved and the rest are left empty.
  3. Given I scored one, when I choose the same score again, then it goes back
     to unscored.
  4. Given I score, when I do it, then I can do it by touch or keyboard, without
     typing.
- **Source sections:** S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SCR-TASTE. Scores are saved when the user
  finishes, not on each choice. All four are optional (INIT-01 Q3). They
  aren't interpreted in Phase 1.

#### STORY-01-05-03: Tag what went wrong

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to tag defects such as channelling on
  a shot, so that I can see what went wrong when I look back.
- **Acceptance criteria**
  1. Given I'm saying how a measured shot tasted, when I tag defects, then I can
     choose one or more from the defect list, and they're saved on the shot.
  2. Given I tag none, when I finish, then the shot saves with no defects.
  3. Given I tagged a defect, when I tap it again, then it's untagged.
  4. Given I tagged defects, when I see the shot later, then its defects are
     shown.
- **Source sections:** S-08, S-09
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SCR-TASTE. The defect list is still undefined
  (DQ-08; the designer offered to propose a starter list in DES-01-05-04).
  The list must include channelling, which STORY-01-05-04 depends on.

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
- **Notes:** New (PEC-04). Design EPIC-01-05 "Where the warning appears". This
  epic owns the warning; EPIC-02-06 only shows it. "Ran fast" stays out until
  a threshold exists (DQ-09).

**Coverage:** all In items covered, including PEC-04. Not covered: the "ran
fast" warning, which the epic puts out of scope.

### EPIC-01-06: Add what's missing from the catalog

#### STORY-01-06-01: Add a missing machine, grinder or other setup

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to add my grinder or machine when
  it's not in the catalog, starting from a link to its product page, so that I
  can still describe my real setup.
- **Acceptance criteria**
  1. Given I can't find my model, when I choose to add it, then I start with
     its product page link, and my search text is already filled in as its
     name.
  2. Given the link isn't already in the catalog, when I add the maker, model
     name and kind, then it's saved and I'm taken back to where I was with it
     chosen, ready to add as a unit.
  3. Given the maker isn't in the catalog either, when I add the model, then I
     can add the maker at the same time, also with a link.
  4. Given I try to save without a product page link, when I save, then I'm
     asked for one and nothing is saved.
  5. Given I added an entry, when I see it, then it's marked as added by my
     household.
  6. Given saving fails, when I look, then everything I entered is kept and I
     can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SCR-CATALOG-ADD. Capabilities moved to
  STORY-01-06-06 and 01-06-07, so this went from 5 to 3. The kind is already
  chosen when coming from adding setup. A product with no web page can't be
  added (EPIC-01-06 open question: no web page).

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
- **Notes:** Updated. Design SCR-CATALOG-ADD (coffee). The roast level list is
  S-09's. Bag scanning is EPIC-06-01.

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
     searches, then they see it in the shared catalog, and my existing setup,
     bags and shots that use it are unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (criterion 2). Verification and merges are a
  manual admin task until EPIC-06-07 (S-02). The reviewer role isn't a spec
  user type (SQ-12).

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
- **Notes:** Updated. Design SCR-CATALOG-ADD steps 1 and 2 and the "check
  failed" state. Criterion 3 is also the design's assumption (EPIC-01-06 open
  question: cross-household check). Whether the user can add their own entry
  anyway is DQ-10, still open; the design hides that option unless allowed.
  Normalisation rules per market: EPIC-01-06 open question. Fuzzy matching is
  EPIC-06-07.

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
  5. Given I saved my machine, when I log a shot with it, then the log offers
     temperature and pressure in the form I described (STORY-01-04-01, 02).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-05). Design SCR-CATALOG-ADD step 4 (machine questions).
  The questions use the user's words, never schema terms. The admin doesn't
  fill these in.

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
- **Notes:** New (PEC-05). Design SCR-CATALOG-ADD step 4 (grinder questions).

#### STORY-01-06-08: Log shots even when I'm not sure about my setup

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want the shot log to work for setup whose
  details I didn't know, without guessing anything that matters, so that "not
  sure" never stops me logging.
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
- **Notes:** New. DQ-11 is the working assumption, from the design's "Shot log
  with 'not sure' capabilities" table: settings 1 to 5; °C; 80 to 100 °C,
  step 0.5; 0 to 12 bar, step 0.5; grind 0 to 100, step 0.1 (smooth or
  unknown) or 1 (clicks with unknown step). The exact ranges are still to be
  confirmed (DQ-11).

#### STORY-01-06-09: Answer capability questions later

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to come back and answer what I
  wasn't sure about for setup I added, so that the shot log gets better once I
  know.
- **Acceptance criteria**
  1. Given a model my household added and that's still unverified, when I look
     at my unit, then I see which answers are "not sure" and can answer the same
     questions again.
  2. Given I change an answer, when I log a new shot, then the log follows the
     new answer.
  3. Given I change an answer, when I look at old shots, then their stored
     values are unchanged and mean what they meant.
  4. Given a new answer narrows the range, when I edit an old shot outside it,
     then the old value is shown as saved, never silently changed.
  5. Given a seeded or verified model, when I look at my unit, then I can see
     its capabilities but not change them.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-08). Design SCR-UNIT "Answer later". Whether the admin
  can correct capabilities on verification is still an EPIC-01-06 open
  question.

**Coverage:** all In items covered, including PEC-05 and PEC-08, for both
catalogs, from the setup (STORY-01-02-01) and pantry (STORY-03-01-01) flows.
The epic suggests a split if it runs long: coffee additions (01-06-02) are
independent of the hardware capability stories (01-06-06 to 09).

---

## INIT-02: Every new bag starts from what you already learned

### EPIC-02-01: Pin the recipe that worked

#### STORY-02-01-01: Pin a recipe from a shot I liked

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a good shot as my recipe for
  that coffee, drink and setup, so that I can make it again without
  dialing in.
- **Acceptance criteria**
  1. Given a measured shot, right after saving it or from its details, when I
     choose to pin it, then before confirming I see which drink, coffee and
     setup it applies to, its values, and the current recipe it replaces, if
     any.
  2. Given I confirm, when it's saved, then a recipe is saved for that shot's
     bean, persona, setup and drink, with its grind, dose, yield, time and any
     temperature or pressure in the same form, and I'm told it's pinned.
  3. Given I pinned a shot, when I look at the recipe, then it records the
     grinder and machine the shot used and which shot it came from.
  4. Given a one-tap shot, when I look at it, then pinning isn't offered.
  5. Given I later edit the shot I pinned from, when I look at the recipe, then
     the recipe is unchanged.
  6. Given pinning fails, when I look, then nothing is pinned and I can try
     again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SH-PIN, from SCR-TASTE or SCR-SHOT. After a fix
  or dial-in, pinning is the suggested next step (STORY-02-03-02). Assumes a
  pin sets the bean's default (INIT-02 Q1, still open). One-tap shots are
  excluded, as the design confirms (EPIC-02-01 open question: pinning
  one-tap).

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
     the recipe, then I can set them in the machine's form.
  3. Given I confirm the pin, when it's saved, then a recipe is saved for that
     bean, drink, setup and my persona, with no source shot, and no shot is
     logged.
  4. Given I'm entering a recipe, when I look at the screen, then it's clear I'm
     pinning a recipe, not logging a shot.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SCR-BAG recipes, SCR-LOG recipe mode, SH-PIN. The
  design now describes the flow the EPIC-02-01 open question said was missing
  (pin without a shot). The old "missing value" criterion is gone: the values
  always hold a number.

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
- **Notes:** Unchanged. The design has no recipe history screen in the MVP, so
  criterion 4 is a data check. Unpinning or removing a recipe isn't in the
  spec or the design (SQ-05).

#### STORY-02-01-04: See the recipes for a coffee

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to see my recipes for a coffee, per
  drink and setup, so that every new bag of it starts from what worked.
- **Acceptance criteria**
  1. Given recipes are pinned for a bean, when I look at a bag of it, then I see
     one recipe per drink and setup, with its values and the date it was
     pinned.
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
- **Notes:** Updated; the title is now plural. Design SCR-BAG section
  `bag.recipes`. This is the single place that decides "which recipe applies
  now" (epic overlap flag); Home and pre-fill use it. "Change it" opens
  recipe mode (STORY-02-01-02). Drift and offsets are not applied (INIT-04).

#### STORY-02-01-05: Re-dial a recipe whose setup left its setup

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want a recipe pinned on a grinder or
  machine I've since swapped out to ask for a quick re-dial instead of a
  one-tap pull, so that I never record a shot that didn't happen.
- **Acceptance criteria**
  1. Given a recipe whose grinder or machine is no longer in its setup, when
     it would be shown on my home screen, then I see its values marked as
     pinned on my previous setup, and one-tap pulling isn't offered.
  2. Given that recipe, when I choose to dial in, then the shot log opens
     filled with the recipe's values for the setup's current setup.
  3. Given I pin the new shot, when I return, then one-tap pulling is offered
     again with the new recipe.
  4. Given that recipe, when I look at it, then it's still kept and shown with
     my other recipes.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-07). Design 2.3 state "recipe pinned on a unit no longer
  in its setup". The swap warning is STORY-01-02-07. Whether a retired unit
  triggers the same rule is still an EPIC-02-01 open question. In Next,
  EPIC-04-03 offsets apply only to maintenance on the same unit, never to a
  different unit.

**Coverage:** all In items covered, including PEC-07.

### EPIC-02-02: Pull your daily shot in one tap

#### STORY-02-02-01: See my daily shot on the home screen

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want the home screen to show the recipe I
  usually make at this time of day, with the coffee I'm on, so that my daily
  shot needs no choices.
- **Acceptance criteria**
  1. Given my profile is selected, when I open the home screen, then it shows
     the drink I usually make at this time of day, the coffee I'm on, and my
     recipe for them: values, setup, the coffee's age and how much is left.
  2. Given I usually make different drinks in the morning and the afternoon,
     when I open the home screen at each time, then it shows the matching
     drink.
  3. Given I've never made a drink at this time of day, when I open the home
     screen, then it shows the drink I made most recently, or the first drink
     on my list if I've made none.
  4. Given several coffees are open, when I open the home screen, then it shows
     the earliest-opened one that has a recipe for this drink; with none, the
     earliest-opened; with none open, my newest unopened bag.
  5. Given my recipe's coffee is finished, when I open the home screen, then I'm
     told I've finished it and offered to choose another coffee or add a bag.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** Updated. Design 2.3 (layout and states). Working assumptions:
  DQ-02 for the drink (a shot within 90 minutes either side of now on any of
  the last 14 days, else the most recent drink, else the first visible drink)
  and DQ-03 for the coffee. SQ-06 is closed: the default is DQ-03, and
  changing it is STORY-02-02-06 (PEC-03). Age is EPIC-03-03 and remaining is
  EPIC-03-04; Home only shows them. In the MVP the only persona is the main
  persona.

#### STORY-02-02-02: Pull this shot in one tap

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want one tap to record my daily shot, so
  that my coffee use counts without logging anything.
- **Acceptance criteria**
  1. Given the home screen shows a recipe, when I tap "Pull This Shot", then a
     shot is recorded at once with the recipe's values, marked one-tap, and I'm
     told it's logged; nothing else is asked.
  2. Given I pull a shot, when it's recorded, then it uses the recipe's
     setup, grinder and machine, the drink and coffee shown, my profile as
     whose taste, and me as who logged it.
  3. Given several portions of that coffee are open, when I pull a shot, then
     it's recorded against the one opened earliest.
  4. Given I tap twice quickly, when the shot is recorded, then only one shot is
     recorded.
  5. Given the pull fails, when I look, then I'm told, no shot is recorded, and
     I can try again.
  6. Given the recipe needs a re-dial (STORY-02-01-05), when I look, then
     one-tap pulling isn't offered.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design EPIC-02-02 steps 3 and 4, PulledState (NC-07),
  "pull failed" state. One-tap shots count toward coffee used
  (STORY-03-04-01) but are never measurements or network-eligible (S-02). The
  quick reaction is STORY-02-03-01.

#### STORY-02-02-03: Choose a bag when none is open

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to be asked which bag to use when
  none of that coffee is open, so that my shot is counted against the right
  bag.
- **Acceptance criteria**
  1. Given no portion of the coffee is open, when I tap "Pull This Shot", then
     I'm asked which of its unfinished portions to use, with each one's bag,
     state, age and amount left.
  2. Given I choose a portion, when I confirm, then the shot is recorded
     against it and the portion is marked opened today.
  3. Given I have no unfinished portion of that coffee at all, when I tap
     "Pull This Shot", then I'm told there's none left and offered to add a bag,
     and no shot is recorded.
  4. Given I'm asked and cancel, when I return to the home screen, then no shot
     is recorded.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SH-PORTION. DQ-06 is the working assumption for
  criterion 2 (EPIC-02-02 and EPIC-03-02 open questions on "opened").

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
- **Notes:** Updated. Design PulledState, EPIC-02-02 step 7. DQ-04 is the
  working assumption: an 8-second window (EPIC-02-02 open question: undo
  window).

#### STORY-02-02-05: Dial in when there's no recipe yet

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want the home screen to offer "Dial in"
  when I have no recipe for this drink and coffee, so that I know to start a
  shot log instead.
- **Acceptance criteria**
  1. Given no recipe is pinned for my profile, the drink and the coffee shown,
     when I open the home screen, then I'm told there's no recipe yet and the
     main action is "Dial in" instead of "Pull This Shot".
  2. Given that, when I choose "Dial in", then the shot log opens with that
     drink, coffee and a setup already chosen, and the values start as in
     STORY-01-03-02.
  3. Given I then pin a recipe, when I return to the home screen, then "Pull
     This Shot" is offered.
- **Source sections:** S-02, S-06
- **Priority:** MVP
- **Size:** 1
- **Notes:** Updated. Design 2.3 "no recipe" state. Starting from a blank log
  rather than another bean's recipe is the design's choice too (EPIC-02-03
  open question: dial-in start). Values follow DQ-07.

#### STORY-02-02-06: Change the drink or coffee before pulling

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to switch the drink or coffee on the
  home screen and still pull in one tap, so that a different drink at my usual
  time doesn't mean a full log.
- **Acceptance criteria**
  1. Given the home screen, when I change the drink or the coffee, then I
     choose from my visible drinks, or from coffees with an unfinished portion
     (those with a recipe for this drink first), and my usual choice is marked
     so I can always go back.
  2. Given I chose another drink or coffee, when I look, then the recipe shown
     updates without leaving the home screen.
  3. Given the new drink and coffee have a recipe, when I tap "Pull This
     Shot", then the shot uses them, with no extra step.
  4. Given they have no recipe, when I look, then the home screen offers "Dial
     in" (STORY-02-02-05).
  5. Given I changed the drink or coffee and pulled, when I next open the home
     screen, then my usual drink and coffee follow from what I pulled, and no
     setting was saved.
  6. Given I changed them but didn't pull, when I come back after some time
     away, then the home screen is back to my usual drink and coffee.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** New (PEC-03). Design 2.3 "Changing drink or coffee". DQ-17 is the
  working assumption for criteria 5 and 6: no saved setting, the last pulled
  coffee for this persona and drink wins over DQ-03 while it has an
  unfinished portion, and an unpulled change resets after 30 minutes away
  (EPIC-02-02 open question: does a change stick). Changing the drink right
  after a pull ends the reaction prompt; the reaction stays available on the
  shot (STORY-02-03-01).

**Coverage:** all In items covered, including PEC-03. Editing a one-tap shot
afterwards is delivered by EPIC-02-06 (STORY-02-06-02), as the epic states.

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
- **Notes:** Updated. Design PulledState and SCR-SHOT. SQ-07 is closed by DQ-05,
  the working assumption: the reaction can be given or changed at any time
  from the shot's details. On Home, the reaction stays offered for 30 seconds
  or until the user leaves.

#### STORY-02-03-02: Fix an off shot from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want an off shot to open the log already
  filled with my recipe, so that I only nudge one or two values.
- **Acceptance criteria**
  1. Given I marked a one-tap shot "off", when the log opens, then it's filled
     with the current recipe's values, setup, drink and the same portion, and
     I'm told it starts from my recipe.
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
- **Notes:** Updated. Design SCR-LOG fix mode, ShotDial "was" values. DQ-12 is
  the working assumption: two records (EPIC-02-03 open question: one record
  or two). See SQ-14 on doses. Suggesting what to change is out of scope.

#### STORY-02-03-03: Dial in from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to start a shot log from my recipe
  instead of pulling it, so that I can dial in a new bag of a coffee I know.
- **Acceptance criteria**
  1. Given the home screen shows a recipe, when I choose "Dial in", then the
     log opens filled with the recipe's values, including any temperature and
     pressure, its setup and drink.
  2. Given the pre-filled log, when I change a value, then I can see what it
     was in the recipe.
  3. Given I adjust and save, when it's saved, then a measured shot is saved,
     no one-tap shot is recorded, and pinning is the suggested next step.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. Design SCR-HOME secondary action and SCR-LOG dial-in
  mode. "Dial in" is always offered next to "Pull This Shot", which confirms
  the revision 1 assumption. Portion choice follows the one-tap rule
  (STORY-02-02-02).

**Coverage:** all In items covered.

### EPIC-02-04: Give one bag its own recipe

Blocked on INIT-02 Q1 (does a pin update the bag's override or the bean's
default?). The stories below are written on the stated assumption and will
need revisiting once it's answered.

#### STORY-02-04-01: Pin a recipe for one bag only

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want to pin a recipe for one bag that
  behaves differently, so that my usual recipe for that coffee stays as it is.
- **Acceptance criteria**
  1. Given I'm pinning a recipe, when I confirm, then I choose whether it's for
     every bag of this coffee or this bag only, with the default set by the
     Head of Product.
  2. Given I pinned for one bag, when I look at the bean's default recipe, then
     it's unchanged.
  3. Given a bag's own recipe, when I see it on the home screen or with the
     bag, then it's marked as for this bag only.
  4. Given I pin for this bag again, when I look, then the newest bag recipe
     applies.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated. Design EPIC-02-04 (scope choice in SH-PIN). The default
  depends on INIT-02 Q1, still open.

#### STORY-02-04-02: Use the bag's recipe while that bag is in use

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want the home screen and pre-filled log to
  use the bag's own recipe while I'm on that bag, so that I don't have to
  remember the difference.
- **Acceptance criteria**
  1. Given a bag with its own recipe, when the home screen shows that bag, then
     it shows the bag's recipe, not the bean's default.
  2. Given that bag's recipe, when I pull a one-tap shot or open the pre-filled
     log, then the bag's values are used.
  3. Given I move to a new bag of the same coffee, when I open the home screen,
     then the bean's default recipe is used again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. "In use" follows the home screen's coffee choice
  (DQ-03, DQ-17). Removing an override is open (SQ-11).

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
- **Notes:** Updated: the design confirms criterion 4. What happens to recipes
  and the home-screen default for a hidden drink is still open (EPIC-02-05
  open question: hidden drinks).

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
- **Notes:** Lightly updated (criterion 2, from the design's accessible
  reordering). Criterion 3 is an assumption.

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
  3. Given I have shots older than the recent window, when I reach the end of
     the list, then I can choose to show older shots.
  4. Given my household has no shots yet, when I open my shots, then I'm told
     there are none and offered to dial in.
  5. Given a shot in the list, when I open it, then I see its details
     (STORY-02-06-03).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated; 2 points became 3 for day grouping and loading older
  shots. Design SCR-SHOTS. DQ-13 is the working assumption: the last 30 days,
  then "show older" (EPIC-02-06 open question: recent). The warning is
  STORY-01-05-04, the frozen marker STORY-03-03-03, and the grind period
  dividers STORY-04-01-04; this list only shows them. Whose taste a shot
  records shows once sub personas exist (STORY-05-01-04).

#### STORY-02-06-02: Fix a shot after the fact

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to edit any recent shot, including a
  one-tap shot that didn't go to plan, so that my history is right.
- **Acceptance criteria**
  1. Given a shot, when I edit it, then I see its saved values, sweetened mark
     and taste together, and can change any of them.
  2. Given I'm editing, when I look at the coffee, drink, setup and persona,
     then I can see them but not change them.
  3. Given I change values and save, when I look at the shot again, then it
     shows my changes, and whose taste it records and who logged it are
     unchanged.
  4. Given I change a dose, when I look at remaining coffee, then it reflects
     the new dose.
  5. Given I edit a shot a recipe was pinned from, when I look at the recipe,
     then it's unchanged.
  6. Given I leave with unsaved changes, when I confirm, then the shot is
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SCR-LOG edit mode (taste on the same screen).
  SQ-08 is closed: only values, sweetened and taste change; context is
  read-only. Whether an edited one-tap shot becomes measured is still open
  (EPIC-02-06 open question: entry mode); assumed it stays one-tap. Deleting
  a shot is open (EPIC-02-06 open question: delete).

#### STORY-02-06-03: See a shot's details

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to open a shot and see everything
  about it, so that I understand what I pulled and what to do next.
- **Acceptance criteria**
  1. Given a shot, when I open it, then I see its values, drink, coffee,
     setup, the grinder and machine it was pulled with, its date and time,
     whether it was sweetened, and its taste and defects if any.
  2. Given a measured shot, when I open it, then I can pin it as a recipe or
     edit it.
  3. Given a one-tap shot, when I open it, then I'm told its values were copied
     from my recipe, I can edit it, and I can give or change its reaction; I
     can't pin it.
  4. Given the shot was tagged as channelling, when I open it, then I see the
     warning (STORY-01-05-04).
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** New. Design SCR-SHOT. Editing a one-tap shot is at most two taps
  from the shots list. Whose taste and who logged show once sub personas
  exist (EPIC-05-01).

**Coverage:** all In items covered.

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
- **Notes:** Updated. Design SCR-BAG-ADD step 2, SCR-CATALOG-PICK (coffee).
  Seed coverage for roasters and coffees: EPIC-03-01 open question.

#### STORY-03-01-02: Add a bag with its dates and weight

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to record a bag's weight and roast
  or best-before date quickly, so that Tare knows how much I have and how
  fresh it is.
- **Acceptance criteria**
  1. Given I've picked a coffee, when I choose a common bag size or enter
     another weight and save, then the bag is added and I see it with one
     portion holding the whole bag.
  2. Given only a best-before date is printed, when I say so, then I can enter
     that instead of a roast date; neither date is required, and I'm told age
     needs one of them.
  3. Given I add a bag, when I want to, then I can also give its lot code and
     purchase date; the purchase date starts as today.
  4. Given I don't give a weight, when I save, then I'm asked for it and
     nothing is saved.
  5. Given I buy another bag of the same coffee, when I add it, then it's a
     separate bag with its own dates and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design SCR-BAG-ADD step 3 (common sizes 250, 340, 500
  and 1000 g; best-before toggle). Started from the shot log, it returns there
  with the bag chosen (STORY-01-01-05). Neither date is required (INIT-03 Q2).
  Rejecting a future roast date is still open (SQ-09). X-1 applies to dates.

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
- **Notes:** Updated. SQ-03 is closed by DQ-06, the working assumption: a new
  portion starts unopened, and the first shot (or the user) opens it.

#### STORY-03-01-04: See what's in my pantry

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to see all my bags and their
  portions in one place, in the order I'll use them, so that I know what
  coffee I have.
- **Acceptance criteria**
  1. Given my pantry has bags, when I open it, then I see each unfinished bag
     with its coffee and roaster, and its portions with their state, age and
     amount left.
  2. Given several bags, when I look at the order, then bags with an open
     portion come first (earliest opened first), then unopened bags, then bags
     only in the freezer.
  3. Given I have finished bags, when I open the pantry, then they're kept in a
     separate finished group I can open.
  4. Given my pantry is empty, when I open it, then I'm told it's empty and
     offered to add a bag.
  5. Given a coffee was merged into another catalog entry, when I see my bag,
     then it shows the surviving coffee's details.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated; 2 points became 3 for ordering and the finished group.
  Design SCR-PANTRY and SCR-BAG. The order matches the one-tap portion rule.
  Portion state, age and remaining weight come from STORY-03-02-04,
  STORY-03-03-01 and STORY-03-04-01.

**Coverage:** all In items covered.

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
- **Notes:** Updated. Design SH-SPLIT. DQ-14 is the working assumption:
  splitting into several portions is done one at a time. It answers the
  EPIC-03-02 split-weights question: a split can never exceed what's left.

#### STORY-03-02-02: Record freezing and thawing

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to record when I froze and thawed a
  portion, so that its age and state are right.
- **Acceptance criteria**
  1. Given a portion that isn't frozen, when I mark it frozen, then the date is
     saved; it's today unless I choose an earlier date.
  2. Given a frozen portion, when I mark it thawed, then the date is saved the
     same way.
  3. Given a portion that was frozen and thawed, when I look at what I can do,
     then freezing it again isn't offered.
  4. Given I enter a thaw date before its freeze date, when I save, then I'm
     told and nothing is saved.
  5. Given a portion in any state, when I look at what I can do, then only the
     actions that make sense for that state are offered.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated (criterion 5). Design SH-PORTION-ACTIONS and
  SH-DATE. Criterion 3 is the design's assumption too: one freeze and one thaw
  (EPIC-03-02 open question: refreezing). Criterion 4 is in the design; this
  narrows SQ-09.

#### STORY-03-02-03: Record opening and finishing a portion

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to record when I opened and finished
  a portion, so that Tare knows which coffee is in use.
- **Acceptance criteria**
  1. Given an unopened or thawed portion, when I mark it opened, then the date
     is saved; it's today unless I choose an earlier date.
  2. Given an unopened portion, when I log the first shot against it, then it's
     marked opened that day without my doing anything.
  3. Given an open or thawed portion, when I mark it finished, then the date is
     saved, it's no longer offered for new shots, and once every portion of its
     bag is finished the bag moves to the finished group.
  4. Given a finished portion, when I look at its shots, then they're still
     there.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. DQ-06 is the working assumption for criteria 1 and 2
  (EPIC-03-02 open question: who sets "opened"). Revision 1's "undo a
  mistaken finish" criterion is removed: the design doesn't offer it, so it's
  now SQ-15.

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
     frozen; once thawed, as thawed.
  4. Given a finished portion, when I see it, then it shows as finished.
  5. Given I change a portion's dates, when I see it, then its state follows.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated with the design's five states (`portion.unopened`,
  `counter`, `frozen`, `thawed`, finished). Calculated from dates, never
  stored.

**Coverage:** all In items covered.

### EPIC-03-03: Know how fresh your beans really are

#### STORY-03-03-01: See how old my beans are

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want each portion and my home screen to
  show bean age, so that I know how fresh my coffee really is.
- **Acceptance criteria**
  1. Given a bag with a roast date, when I see its portions or the home screen,
     then each shows its age in days since roast, less any days frozen.
  2. Given a bag with only a best-before date, when I see its portions, then
     the age is shown as estimated, and the bag explains the estimate.
  3. Given a bag with neither date, when I see its portions, then the age is
     shown as unknown, and I'm offered to add a roast date.
  4. Given a frozen portion, when I see it, then its age is shown as paused.
  5. Given a day passes, when I see an unfrozen portion again, then its age has
     gone up by one.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** Updated. Design EPIC-03-03 age phrases. The assumed gap between
  roast and best-before is still open (INIT-03 Q2). Age is from roast only;
  "days since opened" (S-09) isn't covered (EPIC-03-03 open question). Age
  never uses colour to show freshness. Calculated, never stored.

#### STORY-03-03-02: Freezing pauses aging

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want time in the freezer not to count
  toward bean age, so that frozen coffee shows its real freshness.
- **Acceptance criteria**
  1. Given a portion frozen 10 days after roast and still frozen, when I see it
     later, then its age stays at 10 days.
  2. Given that portion is thawed, when days pass, then its age goes up again
     from 10.
  3. Given two portions of the same bag, one frozen and one not, when I see
     them, then they show different ages.
  4. Given a bag's details, when I look at a portion, then I can see how many
     frozen days weren't counted.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Lightly updated (criterion 4, from the design's
  `portion.frozenDays`). Depends on STORY-03-02-02.

#### STORY-03-03-03: See bean age when logging, and spot frozen-ground shots

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want to see bean age on the shot log and
  know which shots were ground from frozen, so that I can explain shots that
  behaved differently.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I've chosen the coffee, then I see that
     portion's bean age, and if it's frozen, that it's from frozen.
  2. Given a shot was pulled while its portion was frozen and not yet thawed,
     when I see it in my shots or its details, then it's marked as from frozen.
  3. Given a shot was pulled after the portion was thawed, or never frozen,
     when I see it, then it's not marked.
  4. Given I later correct a portion's freeze or thaw date, when I see its
     shots, then the mark follows the corrected dates.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Unchanged in substance. Worked out from dates alone (S-02). X-1
  matters here: a shot and a thaw on the same day need time precision.

**Coverage:** all In items covered.

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
- **Notes:** Updated. Design EPIC-03-04 (Meter NC-15, over-logged notice).
  Criterion 4 is the design's answer to INIT-03 Q3 and the working assumption;
  it isn't a shot warning. See SQ-14 on doses from an "off" shot and its fix.
  Calculated, never stored.

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
- **Notes:** Lightly updated. Design SH-STOCK. Whether to prompt a stock check
  on a schedule is still open (EPIC-03-04 open question); the design prompts
  only when a portion is over-logged.

#### STORY-03-04-03: See which bags are open or finished

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each bag to show whether it's open or
  finished, so that I know at a glance which coffee is in use.
- **Acceptance criteria**
  1. Given a bag with at least one portion opened and not finished, when I see
     it, then it shows as open.
  2. Given every portion of a bag is finished, when I see it, then it shows as
     finished and is in the finished group.
  3. Given a bag with no portion opened yet, when I see it, then its portions
     show as unopened, or frozen, and it's listed after open bags.
  4. Given I change a portion's dates, when I see the bag, then its status
     follows.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated. SQ-10 is closed by the design: bag status stays open or
  finished (S-02), and a bag that isn't open yet is shown through its
  portions' states and its place in the pantry order. Calculated, never
  stored.

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
- **Notes:** Updated. Design EPIC-03-05 (run-out line and its explanation,
  "learning" state). "Enough history" and the accuracy target are open (X-2).
  Calculated, never stored.

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
- **Notes:** Unchanged in substance; the design shows days, not a date.
  Reorder prompts are out of scope. Whether prediction is Phase 1 at all is
  INIT-03 Q1.

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
- **Notes:** Unchanged. Shown in the run-out explanation (design EPIC-03-05).

**Coverage:** all In items covered.

---

## INIT-04: Grind settings stay meaningful through maintenance and time

### EPIC-04-01: Record maintenance on your setup

#### STORY-04-01-01: Log maintenance on a piece of setup

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want to log dated maintenance on my
  grinder or machine, such as new burrs or a clean, so that I have a record of
  what was done and when.
- **Acceptance criteria**
  1. Given a unit I own, when I add maintenance with its kind (new burrs, clean,
     re-zero, repair, other), its date and an optional note, then it's saved on
     that unit.
  2. Given I add maintenance, when I set its date, then it's today unless I
     choose an earlier date.
  3. Given a unit with maintenance, when I look at it, then I see its events,
     newest first, with kind, date and the start of any note.
  4. Given a unit with no maintenance, when I look at it, then I'm told there's
     none and can add some.
  5. Given a retired unit, when I look at it, then I can still see its events.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Lightly updated. Design SCR-UNIT maintenance section,
  SH-MAINTENANCE. Logging a re-zero today takes three taps. Offsets are Next
  (EPIC-04-03). Editing or deleting an event isn't in scope.

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
  4. Given maintenance on a machine, basket or accessory, when I log it, then
     no recalibration mark is offered.
- **Source sections:** S-01, S-02
- **Priority:** MVP
- **Size:** 1
- **Notes:** Updated. DQ-15 is the working assumption: a recalibration is a
  flag on any grinder event, on by default for burrs and re-zero (EPIC-04-01
  open question: recalibration). Revision 1 assumed it was the re-zero kind;
  that's replaced. Every grinder event starts a new grind period, flagged or
  not.

#### STORY-04-01-03: Know my grinder's current grind period

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want my grinder to show when its current
  grind period started and how many shots are in it, so that I know which of
  my settings still compare.
- **Acceptance criteria**
  1. Given a grinder with maintenance, when I look at it, then I see when its
     current grind period started and how many shots are in it.
  2. Given a grinder with no maintenance, when I look at it, then I'm told all
     its shots are in one period.
  3. Given I add or back-date an event, when I look again, then the period
     start and shot count follow, and no past shot is changed.
  4. Given maintenance on a machine, when I look at shots, then grind periods
     aren't affected.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Updated; the title changed from "Split grind history at each
  grinder event" and 3 points became 2, since the dividers in the shots list
  are now STORY-04-01-04. Design SCR-UNIT current-period line (PEC-06, which
  closes the EPIC-04-01 "where shown" question). Periods come from dates,
  never stored.

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
  3. Given maintenance on a machine, basket or accessory, or on a grinder with
     no shots in the list, when I look, then no divider is shown.
  4. Given I add or back-date an event, when I look again, then its divider
     moves to the new place and no shot changes.
  5. Given a divider, when I open it, then I see that grinder.
- **Source sections:** S-02, S-04
- **Priority:** MVP
- **Size:** 2
- **Notes:** New (PEC-06). Design EPIC-04-01 step 3. Depends on
  STORY-02-06-01. Dividers are read aloud to screen-reader users.

**Coverage:** all In items covered, including PEC-06.

### EPIC-04-02: Suggested grind that follows bean age and recent shots

#### STORY-04-02-01: Grind that follows bean age

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want my recipe's grind adjusted for how
  old the beans have become, so that I don't have to re-dial as a bag ages.
- **Acceptance criteria**
  1. Given a recipe and enough measured shots to estimate aging, when I open the
     recipe, then I see a suggested grind adjusted for the portion's current
     bean age.
  2. Given there aren't enough shots to estimate aging, when I open the recipe,
     then I see the pinned grind unchanged.
  3. Given I see a suggestion, when I check the stored recipe, then it's
     unchanged.
  4. Given the suggestion, when I see it, then it moves in the grinder's own
     coarser or finer direction.
- **Source sections:** S-01, S-02, S-04
- **Priority:** Next
- **Size:** 5
- **Notes:** Unchanged. How aging drift is estimated, and from how many shots,
  is open (INIT-04 Q3); the size may grow once answered. No AI (EPIC-04-02
  open question: algorithm vs AI).

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
- **Notes:** Unchanged. How an "off" reaction is treated isn't in the spec;
  assumed "off" one-tap shots carry no signal of their own (their measured
  fix does, DQ-12).

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
  3. Given a machine event, when the suggestion is worked out, then periods
     aren't affected.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. Depends on STORY-04-01-03. Maintenance offsets are
  EPIC-04-03.

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
- **Notes:** Updated. Design EPIC-04-02 shows both the value and the reason;
  INIT-04 Q4 (value, note or both) is still open. Criterion 3 is an
  assumption the spec doesn't settle.

**Coverage:** all In items covered. Setup maintenance drift is EPIC-04-03 (epic
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
  2. Given a recipe pinned before the event, when I pin a new recipe for the
     same coffee on that grinder after it, then Tare proposes a shift in grinder
     units, with a one-line explanation.
  3. Given the beans aged between the two dial-ins, when the shift is proposed,
     then the aging estimate is taken off first.
  4. Given there's no recipe from before the event for the coffee I re-dial,
     when I pin, then no shift is proposed and I'm told why.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 5
- **Notes:** Updated (criteria 1 and 2, from the design's re-dial prompt).
  Depends on STORY-04-02-01 for the aging estimate (INIT-04 Q3). Assumes a
  re-dial is "a recipe pinned after the event on that grinder".

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
- **Notes:** Unchanged in substance. A confirmed shift is a user decision:
  stored, not recalculated (S-02).

#### STORY-04-03-03: Old recipes read right after maintenance

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want every recipe pinned before the
  maintenance to show the right grind now, so that all my coffees work again
  after one re-dial.
- **Acceptance criteria**
  1. Given a confirmed shift on a grinder event, when I open any recipe pinned
     on that grinder before the event, then its grind is shown with the shift
     applied.
  2. Given the shifted recipe, when I check what's stored, then the recipe is
     unchanged.
  3. Given a recipe on a different grinder, when I open it, then no shift is
     applied.
  4. Given several events on one grinder, when I open an old recipe, then each
     confirmed shift after it is applied in order.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged. Criterion 4 assumes shifts chain (EPIC-04-03 open
  question: chaining). Offsets never map a recipe to a different unit; that
  case is STORY-02-01-05.

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
- **Notes:** Unchanged in substance. The fitting method and what counts as
  disagreeing are open (EPIC-04-04 open question). Criterion 3 is an
  assumption.

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
  2. Given a sub persona with shots, when I remove it, then its shots and
     recipes are handled as the Head of Product decides.
  3. Given the main persona, when I look at removing it, then I can't.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 2
- **Notes:** Unchanged. The design covers add and rename only; removal is
  still open (EPIC-05-01 open question: delete), and criterion 2 is a
  placeholder until it's answered.

#### STORY-05-01-03: Choose who I'm brewing for on the home screen

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want to pick a profile on the home
  screen, so that the drink, coffee and recipe shown are theirs.
- **Acceptance criteria**
  1. Given my household has more than one persona, when I pick one on the home
     screen, then it shows that persona's usual drink at this time of day, the
     coffee and their recipe.
  2. Given I pick a persona with no recipe for the drink shown, when I look,
     then "Dial in" is offered.
  3. Given I pull a shot or open the log after picking a persona, when the shot
     is saved, then it's for that persona.
  4. Given a household with only the main persona, when I open the home screen,
     then nothing about picking a persona is in my way.
- **Source sections:** S-02, S-04, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Unchanged in substance. Design EPIC-05-01. Whether the chosen
  persona is remembered between visits isn't in the spec; for the tech lead
  and designer.

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
- **Notes:** Unchanged in substance. No schema change (S-02).

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
  2. Given I already have my own Tare account and household, when I join, then
     what happens to it follows the Head of Product's decision.
- **Priority:** Later
- **Size:** 5
- **Notes:** Depends on EPIC-05-03. Existing-account handling is open
  (EPIC-05-02 open question).

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
- **Priority:** Later
- **Size:** 2
- **Notes:** The opt-in itself is EPIC-06-05.

### EPIC-05-03: Keep your coffee history when you change phones

#### STORY-05-03-01: Link my account to Google

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google from my
  profile and keep everything I've logged, so that my history isn't lost if my
  phone is.
- **Acceptance criteria**
  1. Given I've been using Tare without signing in, when I link Google from my
     profile, then all my setup, pantry, recipes and shots are still there,
     unchanged, and my profile says my account is linked.
  2. Given I linked Google, when I see my profile, then its name or label is
     unchanged; nothing is taken from my Google account.
  3. Given the Google account is already linked to another Tare account, when I
     try to link it, then I'm told, and my current data stays as it is.
  4. Given linking fails or I cancel, when I return, then I'm still in my
     account with all my data, and can try again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated. Design EPIC-05-03 (link section in SCR-PROFILE, which
  replaces the "lives with this device" sentence from STORY-01-01-03).
  Firebase links Google to the same anonymous account (S-02). Criterion 3
  assumes no merge of households (EPIC-05-03 open question). DQ-16 (Google's
  branded button) is a design question, not a behaviour.

#### STORY-05-03-02: Reach my history on another phone

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google on a new
  phone and find my history, so that changing phones doesn't mean starting
  again.
- **Acceptance criteria**
  1. Given I linked Google on one device, when I sign in with the same Google
     account on another, then I reach the same account and household.
  2. Given I'm signed in on a new device, when I look, then I see all my setup,
     pantry, recipes and shots.
  3. Given I open Tare on a new device for the first time, when it starts, then
     I'm offered, quietly, to sign in with Google before a new account is set
     up, and I can ignore it.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 3
- **Notes:** Updated. Design SCR-START sign-in option, never a wall.
  Criterion 3 avoids the "second device set up anonymously first" case
  (EPIC-05-03 open question). Using two devices at once isn't in the spec.

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
- **Notes:** New. The design answers the EPIC-05-03 open question on prompting
  (first recipe or tenth shot); confirm the trigger.

**Coverage:** all In items covered.

---

## INIT-06: Dial in a new bag in fewer shots with AI and the community

All stories in this initiative are Later and light, and unchanged in this
revision apart from notes; the design gives direction only (section 6). Each
AI feature ships with evals and observability (S-01). The eval stories use the
home enthusiast's benefit, since the spec has no user type for the team that
runs them (SQ-13). All AI output is offered as a suggestion the user can
accept or ignore.

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
- **Priority:** Later
- **Size:** 3
- **Notes:** How a scan is matched to a catalog entry is open (EPIC-06-01 open
  question: matching).

#### STORY-06-01-03: A scanner that's checked before each release

- **Parent:** EPIC-06-01
- **Story:** As a home enthusiast, I want the scanner tested against known
  labels and monitored, so that it stays accurate as it changes.
- **Acceptance criteria**
  1. Given a set of labelled bag photos, when the scanner is evaluated, then a
     pass rate is reported against a target.
  2. Given the scanner is live, when it runs, then failures and results are
     observable.
- **Priority:** Later
- **Size:** 3
- **Notes:** The scanner's eval set isn't described (EPIC-06-01 open question).

### EPIC-06-02: Get a grounded fix when a shot goes wrong

#### STORY-06-02-01: Get a fix for a bad shot

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want to be told what to change after a bad
  shot, on my own setup and in the right direction on my dial, so that the next
  shot is better.
- **Acceptance criteria**
  1. Given a bad measured shot with scores or defects, when I ask for help in
     the fix flow, then I get a short diagnosis and one action for my setup.
  2. Given my grinder's coarser direction, when the action says finer or
     coarser, then it names the right way on my dial.
  3. Given one-tap shots in my history, when the Coach advises, then it uses
     only measured shots.
- **Priority:** Later
- **Size:** 5
- **Notes:** S-09 uses days since opened; EPIC-03-03 computes age from roast
  (EPIC-06-02 open question). With "not sure" about the coarser direction
  (STORY-01-06-07), the Coach can't name a direction on the dial; to resolve
  when re-planned.

#### STORY-06-02-02: Advice grounded in guides and my manuals

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want the Coach's advice based on
  extraction guides and the manuals for my setup, so that I can trust it.
- **Acceptance criteria**
  1. Given my setup, when the Coach advises, then its advice draws on the
     guides and the manuals for my equipment.
  2. Given no manual exists for my setup, when it advises, then it falls back to
     the guides.
- **Priority:** Later
- **Size:** 8
- **Notes:** **Flagged at 8: split** into ingesting guides and manuals, and
  using them in advice, when this epic is re-planned. Sources and licensing
  are open (EPIC-06-02 open question).

#### STORY-06-02-03: A Coach that's checked before each release

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want the Coach tested against known
  scenarios and monitored, so that its advice is safe and accurate.
- **Acceptance criteria**
  1. Given the Golden Dataset, when the eval runs, then each case is scored on
     safety, accuracy and palate alignment, and passes only if all are 4 or
     above.
  2. Given the Coach is live, when it runs, then results are observable.
- **Priority:** Later
- **Size:** 5
- **Notes:** Golden Dataset source and owner are open (INIT-06 Q6). Palate
  alignment needs EPIC-06-04 first (EPIC-06-02 open question).

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
- **Priority:** Later
- **Size:** 3
- **Notes:** None.

#### STORY-06-04-03: Palate learning that's checked and monitored

- **Parent:** EPIC-06-04
- **Story:** As a home enthusiast, I want palate learning tested and
  monitored, so that it doesn't drift away from my taste.
- **Acceptance criteria**
  1. Given an eval set of logging histories, when it runs, then the graphs are
     scored against expected tastes.
  2. Given it's live, when it runs, then results are observable.
- **Priority:** Later
- **Size:** 3
- **Notes:** Eval set not defined in the spec.

### EPIC-06-05: Share your shots, with your consent

#### STORY-06-05-01: Opt in or out of sharing

- **Parent:** EPIC-06-05
- **Story:** As a main persona, I want to choose whether my own shots are
  shared with the community, so that sharing is always my decision.
- **Acceptance criteria**
  1. Given I haven't opted in, when I use Tare, then none of my shots are shared.
  2. Given I opt in, when I later opt out, then no further shots are shared.
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
- **Priority:** Later
- **Size:** 5
- **Notes:** Needs EPIC-06-04 and EPIC-06-02. Design direction: neutral, not
  the signal colour.

#### STORY-06-06-04: Community starts that are checked and monitored

- **Parent:** EPIC-06-06
- **Story:** As a home enthusiast, I want community starts tested and
  monitored, so that they actually save me shots.
- **Acceptance criteria**
  1. Given an eval set, when it runs, then the starts are scored against known
     good recipes.
  2. Given it's live, when it runs, then results are observable.
- **Priority:** Later
- **Size:** 3
- **Notes:** Eval set not defined in the spec.

### EPIC-06-07: Merge duplicate catalog entries, with AI suggestions

#### STORY-06-07-01: Merge a duplicate into one entry

- **Parent:** EPIC-06-07
- **Story:** As a home enthusiast, I want duplicates of my grinder or coffee
  merged into one entry, so that my history lines up with everyone else's.
- **Acceptance criteria**
  1. Given a confirmed merge, when it's applied, then the duplicate stays as a
     pointer and everything that used it now shows the surviving entry.
  2. Given a merge, when it's decided, then who or what suggested it, its
     confidence, reason and time are logged.
  3. Given a merge, when it's applied, then nothing is deleted.
- **Priority:** Later
- **Size:** 5
- **Notes:** Who confirms is open (EPIC-06-07 open question; SQ-12).
  Conflicting data between entries is open, including capabilities a
  household answered (STORY-01-06-06 to 09).

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
- **Priority:** Later
- **Size:** 5
- **Notes:** Model choice is open (INIT-06 Q5).

#### STORY-06-07-03: A matcher that's checked before each release

- **Parent:** EPIC-06-07
- **Story:** As a home enthusiast, I want the matcher tested on known
  duplicates and look-alikes, so that different products are never merged.
- **Acceptance criteria**
  1. Given known duplicates, when the eval runs, then the share found is
     reported.
  2. Given known look-alikes that must not merge, when the eval runs, then any
     suggested merge among them is a failure.
  3. Given it's live, when it runs, then results are observable.
- **Priority:** Later
- **Size:** 3
- **Notes:** None.

---

## Stories to split or cut

- **Split:** STORY-06-02-02 (RAG grounding, 8), when EPIC-06-02 is re-planned.
- **Watch:** STORY-04-02-01 and STORY-04-02-02 (5 each) may reach 8 once
  INIT-04 Q3 is answered.
- **Epic split option:** EPIC-01-06 is now 26 points. If it runs long, ship
  coffee additions and the duplicate check (01-06-01 to 05) first, and the
  hardware capability stories (01-06-06 to 09) next. The epic itself suggests
  this split.
- **Could cut from the MVP:**
  - STORY-01-06-09 (answer capabilities later, 3): the fallbacks in
    STORY-01-06-08 keep logging working without it. It was approved as PEC-08,
    so cutting it would need the Head of Product.
  - STORY-01-01-03 (rename the profile) and STORY-02-01-02 (pin by entering
    values), as in revision 1, if those features aren't MVP.
- **Could merge:** STORY-01-01-06 (shared states) into the shell work of
  STORY-01-01-05, if the tech lead prefers one shell story.

## Not covered

- The "ran fast" shot warning: out of scope until a threshold exists (DQ-09).
- Editing or deleting a maintenance event, deleting a setup or a shot,
  removing a recipe (SQ-05) or a bag override (SQ-11), un-retiring a unit, and
  reopening a finished portion (SQ-15): in neither the epic scope nor the
  design.

## Open questions for the Head of Product

### Most pressing

These block or shape MVP stories:

1. **DQ-08 defect list.** STORY-01-05-03 and the only MVP shot warning
   (STORY-01-05-04) depend on it. The designer offered to propose a starter
   list.
2. **EPIC-02-06 entry mode of an edited one-tap shot.** STORY-02-06-02 assumes
   it stays one-tap. This decides whether an edit makes the shot count for
   drift, palate and the network later.
3. **SQ-14 doses from an "off" shot and its fix.** Under DQ-12 (two records)
   both doses count toward coffee used. Is that right?
4. **DQ-11 fallback ranges** for "not sure" setup (STORY-01-06-08).
5. **EPIC-02-01 retired units.** Do recipes on a retired unit need a re-dial
   like a swapped one (STORY-02-01-05, STORY-01-02-03)?
6. **X-1 timestamp precision.** The frozen-ground marker (STORY-03-03-03) and
   period dividers (STORY-04-01-04) need same-day ordering.
7. **INIT-02 Q1** still blocks EPIC-02-04 (Next).

The design's working assumptions DQ-01 to DQ-07 and DQ-12 to DQ-17 are used as
written. Each is cited in the stories that depend on it.

### Story questions (SQ)

Closed in this revision:

- **SQ-01** (first launch with no connection): closed by the design's
  SCR-START failure state (STORY-01-01-01).
- **SQ-02** (retired unit in a setup): closed by the design's SCR-KIT state
  (STORY-01-02-03). Its follow-on, recipes on a retired unit, is the EPIC-02-01
  open question above.
- **SQ-03** (unopened portions, and whether new portions start opened):
  closed by DQ-06.
- **SQ-06** (which coffee and recipe Home shows): closed by PEC-03 (the user
  can change it) and DQ-03 (the default).
- **SQ-07** (giving or changing the reaction later): closed by DQ-05.
- **SQ-08** (what can change when editing a shot): closed by the design: only
  values, sweetened and taste.
- **SQ-10** (showing a bag that isn't open yet): closed by the design's
  portion states and pantry order.

Still open:

- **SQ-04** (STORY-01-06-05): can a household add links or aliases to a
  verified or seed entry, or only to its own?
- **SQ-05** (STORY-02-01-03): can a recipe be unpinned or removed?
- **SQ-09** (STORY-03-01-02), narrowed: thaw-before-freeze is rejected per the
  design. Should a roast date in the future also be rejected?
- **SQ-11** (EPIC-02-04): can a bag's own recipe be removed? Answer it with
  INIT-02 Q1.
- **SQ-12** (STORY-01-06-03, STORY-06-07-01): the catalog reviewer (admin) is
  not a spec user type. Should the spec name the role?
- **SQ-13** (INIT-06 eval stories): is it acceptable to write eval stories for
  the home enthusiast's benefit?
- **SQ-14** (STORY-03-04-01, STORY-02-03-02): doses from an "off" one-tap shot
  and its fix (see "Most pressing").

New:

- **SQ-15** (STORY-03-02-03): can a portion marked finished by mistake be
  reopened? The design offers no action for it, so revision 1's criterion was
  removed.
- **SQ-16** (STORY-01-01-07): who owns the first-run checklist? Design section
  2.3 assigns first run to EPIC-01-01, but its design task DES-02-02-04 sits
  under EPIC-02-02. The story is placed in EPIC-01-01; confirm.
