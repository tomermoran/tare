# Tare user stories (approved)

**Status: approved by the Head of Product as written (first version).** Because design now comes before stories, the story-writer will revise these against the approved design and any epic changes. Open questions and the assumptions noted in each story carry forward.

Source: `planning/drafts/epics.md` (approved by the Head of Product, revision 3,
30 epics) and `docs/spec.md`, sections S-01 to S-09. S-01 and S-02 override
older sections where they differ. `planning/drafts/initiatives.md` was read for
context.

Draft for the Head of Product. No GitHub issues have been created.

## How to read this file

- **IDs:** `STORY-II-EE-SS` (initiative, epic, story). Parent is the epic ID.
- **Grouping:** by initiative, then by epic in ID order, whatever the
  priority. The priority is on every story and in the summary.
- **Personas:** stories are written for the spec's user type, the everyday
  home enthusiast (S-01), shortened to "home enthusiast". Where the household
  matters, they use the S-04 roles: household member, main persona, sub
  persona. No real people are named.
- **Sizes:** rough points (1, 2, 3, 5, 8). Anything at 8 is flagged.
- **Open questions:** questions already carried in `epics.md` and
  `initiatives.md` are referenced by their IDs (`INIT-NN Q#`, `X-1` to `X-3`)
  or as "EPIC-NN-NN open question: topic". New questions raised while writing
  stories are numbered `SQ-NN` and listed at the end. None of them is resolved
  here: where a story depends on one, its Notes state the assumption made.
- **Cross-cutting constraints** from `epics.md` (localization, Japandi design,
  calculated-never-stored values, no AI in Phase 1, following catalog merge
  pointers) apply to every story's acceptance criteria and aren't repeated in
  each one.
- **Detail level:** MVP and Next epics have full stories with Given/When/Then
  acceptance criteria. **Later epics have lighter stories**: ID, statement,
  priority, size and two or three brief acceptance criteria. Those epics will
  be re-planned before they're built, so their stories are placeholders for
  scope and size, not ready for design.

## Summary

| Epic | Title | Priority | Stories | Points |
|---|---|---|---|---|
| EPIC-01-01 | Start brewing without setting anything up | MVP | 4 | 9 |
| EPIC-01-02 | Describe your kit once | MVP | 4 | 10 |
| EPIC-01-03 | Log a shot in seconds | MVP | 5 | 14 |
| EPIC-01-04 | Record temperature and pressure when your machine has them | MVP | 2 | 6 |
| EPIC-01-05 | Say how it tasted | MVP | 3 | 6 |
| EPIC-01-06 | Add what's missing from the catalog | MVP | 5 | 16 |
| EPIC-02-01 | Pin the recipe that worked | MVP | 4 | 11 |
| EPIC-02-02 | Pull your daily shot in one tap | MVP | 5 | 13 |
| EPIC-02-03 | Fix a bad shot from your recipe | MVP | 3 | 7 |
| EPIC-02-04 | Give one bag its own recipe | Next | 2 | 5 |
| EPIC-02-05 | Make the drink list yours | Next | 4 | 7 |
| EPIC-02-06 | See your recent shots | MVP | 2 | 5 |
| EPIC-03-01 | Add a bag to your pantry | MVP | 4 | 9 |
| EPIC-03-02 | Split and freeze a bag | MVP | 4 | 11 |
| EPIC-03-03 | Know how fresh your beans really are | MVP | 3 | 7 |
| EPIC-03-04 | See how much coffee is left | MVP | 3 | 7 |
| EPIC-03-05 | Know when you'll run out | Next | 3 | 8 |
| EPIC-04-01 | Record maintenance on your kit | MVP | 3 | 7 |
| EPIC-04-02 | Suggested grind that follows bean age and recent shots | Next | 6 | 21 |
| EPIC-04-03 | Re-dial once after maintenance and keep every recipe | Next | 3 | 11 |
| EPIC-04-04 | Keep recipes right after new burrs of a different design | Next | 2 | 5 |
| EPIC-05-01 | Brew for someone else in the household | Next | 4 | 10 |
| EPIC-05-02 | Invite them to take over their own profile | Later | 4 | 15 |
| EPIC-05-03 | Keep your coffee history when you change phones | Next | 2 | 6 |
| EPIC-06-01 | Scan a bag instead of typing it | Later | 3 | 11 |
| EPIC-06-02 | Get a grounded fix when a shot goes wrong | Later | 3 | 18 |
| EPIC-06-04 | Tare learns your palate as you log | Later | 3 | 11 |
| EPIC-06-05 | Share your shots, with your consent | Later | 3 | 8 |
| EPIC-06-06 | Start a new bag from the community, tuned to you | Later | 4 | 16 |
| EPIC-06-07 | Merge duplicate catalog entries, with AI suggestions | Later | 3 | 13 |

| Priority | Epics | Stories | Points |
|---|---|---|---|
| MVP | 15 | 54 | 138 |
| Next | 8 | 26 | 73 |
| Later | 7 | 23 | 92 |
| **Total** | **30** | **103** | **303** |

Later points are rough placeholders (see "Detail level").

---

## INIT-01: Log a shot against your real kit in seconds

### EPIC-01-01: Start brewing without setting anything up

#### STORY-01-01-01: Open the app and start, with no sign-in

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want to open Tare for the first time and
  start straight away, without a sign-in screen, so that I can log my first
  shot without any setup.
- **Acceptance criteria**
  1. Given I have never opened Tare on this device, when I open it, then I
     reach the app without being asked to sign in or create an account.
  2. Given I open Tare for the first time, when it starts, then an account,
     one household with me as its owner, and one main persona for me are
     created without my input.
  3. Given I have used Tare on this device, when I close and reopen it, then
     I'm in the same account and household, with everything I added before.
  4. Given my first launch can't create an account (for example, no
     connection), when I open the app, then I'm told it couldn't start and can
     try again, and no partial household is left behind.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Uses Firebase anonymous sign-in per device; the user record
  stores the Firebase ID (S-02). Accepted risk: a lost or reset device loses
  its data until EPIC-05-03. Criterion 4 assumes a connection is needed on
  first launch (SQ-01). X-1 applies to the created and joined timestamps.

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
- **Notes:** Editing the list is EPIC-02-05 (Next). `has_milk` must be set on
  each starter row, but no behaviour depends on it yet (EPIC-01-03 open
  question: `has_milk`).

#### STORY-01-01-03: See and rename my profile

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my profile to show a simple label
  until I choose a name, so that I don't have to give personal details to
  start, but can name it if I like.
- **Acceptance criteria**
  1. Given I haven't named my profile, when I see it, then it shows a
     translated role label (for example "Me" in English).
  2. Given my profile shows the role label, when I change the app's language,
     then the label is shown in the new language.
  3. Given I rename my profile, when I see it anywhere in the app, then it
     shows my chosen name in every language.
  4. Given I've renamed my profile, when I clear the name, then it goes back to
     the translated role label.
- **Source sections:** S-02, S-04, S-08, S-07
- **Priority:** MVP
- **Size:** 2
- **Notes:** EPIC-01-01 open question: is a rename in the MVP? This story
  assumes yes, as the epic does. Criterion 4 assumes an empty name means "use
  the label", matching the schema's null name. Could be cut to Next with no
  impact on other MVP stories.

#### STORY-01-01-04: Keep my kitchen private to my household

- **Parent:** EPIC-01-01
- **Story:** As a home enthusiast, I want my kit, coffee, recipes and shots to
  belong to my household only, so that no one else sees or changes them.
- **Acceptance criteria**
  1. Given I add anything (kit, toolkit, bag, recipe, shot), when it's saved,
     then it belongs to my household.
  2. Given another household exists, when its user browses Tare, then they
     can't see or change anything that belongs to my household.
  3. Given I use Tare, when I browse my kit, pantry, recipes or shots, then I
     only see my household's records, plus shared catalog entries.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Visibility of catalog entries a household adds is covered in
  STORY-01-06-03. The household itself is never shown in the MVP (S-04).

**Coverage:** all In items covered. Out items (Google sign-in, drink list
editing, sub personas, consent) are in their own epics.

### EPIC-01-02: Describe your kit once

#### STORY-01-02-01: Find my machine and grinder in the catalog

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to find the machine, grinder, basket
  and accessories I own by maker and model, so that Tare knows exactly what my
  kit can do.
- **Acceptance criteria**
  1. Given the catalog has makers and models, when I choose a maker, then I
     see that maker's models of the kind I'm adding (machine, grinder, basket,
     accessory).
  2. Given a model is sold under a regional name, when I search by that alias
     (for example the UK name of a US-branded machine), then the model is
     found.
  3. Given a catalog entry has been merged into another, when I search or pick
     it, then I get the surviving entry.
  4. Given my household added an unverified entry, when I search, then I see it
     alongside verified entries; other households' unverified entries never
     appear.
  5. Given my search finds nothing, when I look at the results, then I'm told
     nothing matched and offered to add what's missing (STORY-01-06-01).
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** A model's declared capabilities (temperature and pressure
  control, grind scale, coarser direction) come with it from the catalog.
  Seed coverage and curation: EPIC-01-02 open question (who curates).

#### STORY-01-02-02: Add the units I own

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to add each piece of kit I own, with
  an optional nickname and date I got it, so that my shots and maintenance
  belong to my actual unit.
- **Acceptance criteria**
  1. Given I've picked a model, when I add it, then it appears in my kit as a
     unit I own, showing its maker and model.
  2. Given I add a unit, when I give it a nickname or acquired date, then they
     are saved with it; when I give neither, it still saves.
  3. Given I own two units of the same model, when I add both, then they are
     two separate units, each with its own history.
  4. Given I look at my kit, when it has units, then I see all units I own and
     haven't retired.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Depends on STORY-01-02-01.

#### STORY-01-02-03: Retire a unit and keep its history

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to retire kit I no longer use, so
  that it stops cluttering my choices while my old shots still say what I
  used.
- **Acceptance criteria**
  1. Given I own a unit, when I retire it, then it no longer appears among the
     units I can add to a toolkit.
  2. Given I logged shots with a unit, when I retire it, then those shots still
     show that unit.
  3. Given I retired a unit, when I look for it, then I can still find it among
     retired kit.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** What happens to a toolkit that contains a unit when the unit is
  retired is not in the spec (SQ-02). Un-retiring isn't in the spec either.

#### STORY-01-02-04: Group my kit into a toolkit

- **Parent:** EPIC-01-02
- **Story:** As a home enthusiast, I want to group my units into a named
  toolkit such as "Daily Espresso", so that I pick one toolkit when brewing
  instead of each piece of kit.
- **Acceptance criteria**
  1. Given I own units, when I create a toolkit with a name and the units it
     holds, then it's saved and I can pick it when logging a shot.
  2. Given a unit is already in one toolkit, when I create another toolkit,
     then I can add the same unit to it too.
  3. Given I try to save a toolkit without a name, when I save, then I'm asked
     for a name and nothing is saved.
  4. Given I try to save a toolkit without one machine and one grinder, when I
     save, then I'm told it needs both, and nothing is saved.
  5. Given I have toolkits, when I look at my kit, then I see each toolkit with
     its units.
- **Source sections:** S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Criterion 4 assumes exactly one machine and one grinder, since
  every shot and recipe records one of each (EPIC-01-02 open question: toolkit
  contents). Editing a toolkit after shots are logged is not covered
  (EPIC-01-02 open question: toolkit edits); history is safe either way.

**Coverage:** all In items covered. Not covered pending answers: editing or
deleting a toolkit. INIT-01 Q5 (°F display-only) is handled in STORY-01-04-01.

### EPIC-01-03: Log a shot in seconds

#### STORY-01-03-01: Choose what I'm brewing

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to choose the toolkit, drink and
  coffee for a shot, so that the shot is recorded against what I actually
  used.
- **Acceptance criteria**
  1. Given I start a shot, when I choose a toolkit, then I can choose from my
     household's toolkits.
  2. Given I start a shot, when I choose a drink, then I see my household's
     drink types that aren't hidden.
  3. Given I start a shot, when I choose the coffee, then I see my pantry's
     portions that aren't finished, each named by its bean and bag.
  4. Given I have no toolkit or no unfinished portion, when I start a shot,
     then I'm told what's missing and pointed to add it, rather than being
     stuck.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Depends on STORY-01-02-04 and STORY-03-01-03. Whether unopened
  portions are offered, and whether choosing one marks it opened, is open
  (SQ-03, EPIC-01-03 open question: opening on first shot). Criterion 3
  assumes finished portions are excluded (INIT-03 Q3). Hidden drinks only
  exist once EPIC-02-05 ships.

#### STORY-01-03-02: Set grind, dose, yield and time by touch

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to set grind, dose, yield and time
  with large touch controls, so that I can log a shot at the machine without
  typing.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I set grind, dose, yield and time, then I
     can set each one by dragging, with no text keyboard.
  2. Given my toolkit's grinder is stepped, when I set grind, then I can only
     choose values on its steps, within its range.
  3. Given my toolkit's grinder is stepless, when I set grind, then I can
     choose any value within its range at its finest increment.
  4. Given I set the time, when I see it, then it's shown in seconds with one
     decimal (for example 27.6 s).
- **Source sections:** S-06, S-08, S-02
- **Priority:** MVP
- **Size:** 5
- **Notes:** Builds on the Phase 0 NumberWheel. Sized 5 for the grinder-scale
  rules across stepped and stepless grinders.

#### STORY-01-03-03: Save the shot as I measured it

- **Parent:** EPIC-01-03
- **Story:** As a home enthusiast, I want to save a shot with its values and
  kit, so that my history shows exactly what I pulled, even after my kit
  changes.
- **Acceptance criteria**
  1. Given I've chosen toolkit, drink and coffee and set all four values, when
     I save, then the shot is saved as measured, with my persona as whose taste
     it records and me as who logged it.
  2. Given I save a shot, when it's saved, then it records the grinder and
     machine that were in the toolkit at that moment.
  3. Given a toolkit's units later change, when I look at an older shot, then
     it still shows the grinder and machine it was pulled with.
  4. Given any of grind, dose, yield or time is missing, when I try to save,
     then I'm told which value is missing and nothing is saved.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Network eligibility is not computed here (X-3). X-1 applies to
  the saved timestamp.

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
- **Notes:** None.

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
- **Notes:** Applies to every number in the app; this story makes it testable
  on the shot log, where it matters most.

**Coverage:** all In items covered. Overlap noted in the epic: shots logged
against a portion are here (STORY-01-03-01).

### EPIC-01-04: Record temperature and pressure when your machine has them

#### STORY-01-04-01: Record temperature in the way my machine sets it

- **Parent:** EPIC-01-04
- **Story:** As a home enthusiast, I want to record brew temperature only when
  my machine can set it, and in the form it uses, so that the log matches my
  machine and stays uncluttered.
- **Acceptance criteria**
  1. Given my toolkit's machine has fixed temperature, when I log a shot, then
     no temperature is asked.
  2. Given my machine has temperature steps (for example 1-3), when I log a
     shot, then I can pick one of its steps, and the shot records the step.
  3. Given my machine sets an exact temperature, when I log a shot, then I can
     set a value within its range at its increment, and the shot records it.
  4. Given my machine shows temperature in Fahrenheit, when I set it, then I
     see Fahrenheit, and the shot shows the same temperature in either unit.
  5. Given I leave temperature unset, when I save, then the shot saves without
     one.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Assumes Fahrenheit is display-only and stored in °C (INIT-01 Q5).
  Steps are never converted to degrees, so a later machine can't reinterpret
  old shots (S-02). Criterion 5 assumes temperature is optional, as S-02 says.

#### STORY-01-04-02: Record pressure in the way my machine sets it

- **Parent:** EPIC-01-04
- **Story:** As a home enthusiast, I want to record pressure only when my
  machine lets me set or read it, so that I log what I actually control.
- **Acceptance criteria**
  1. Given my machine has fixed pressure, when I log a shot, then no pressure
     is asked.
  2. Given my machine has pressure steps, when I log a shot, then I can pick
     one of its steps.
  3. Given my machine sets an exact pressure, when I log a shot, then I can set
     a value in bar within its range.
  4. Given my machine is manual (lever, paddle or valve) with a gauge, when I
     log a shot, then I can record the peak pressure I read.
  5. Given my machine is manual without a gauge, when I log a shot, then no
     pressure is asked.
  6. Given I leave pressure unset, when I save, then the shot saves without it.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Criterion 5 assumes no pressure field for gaugeless manual
  machines (EPIC-01-04 open question: manual without gauge). Pressure
  profiles are out of scope (S-02).

**Coverage:** all In items covered.

### EPIC-01-05: Say how it tasted

#### STORY-01-05-01: Rate a shot overall

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to rate a shot from 1 to 5, so that
  I remember which shots I liked.
- **Acceptance criteria**
  1. Given I'm logging a measured shot, when I rate it, then I can choose a
     whole number from 1 to 5 and it's saved on the shot.
  2. Given I don't rate it, when I save, then the shot saves without a rating.
  3. Given I rated a shot, when I see it later, then its rating is shown.
- **Source sections:** S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Assumes rating is optional (INIT-01 Q3). Assumes it's given on
  the shot log; adding it later is through editing (STORY-02-06-02).

#### STORY-01-05-02: Score sweetness, acidity, bitterness and body

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to score sweetness, acidity,
  bitterness and body from 1 to 5, so that my taste history shows what I
  actually tasted.
- **Acceptance criteria**
  1. Given I'm logging a measured shot, when I score any of the four, then each
     takes a whole number from 1 to 5 and is saved on the shot.
  2. Given I score some but not all four, when I save, then the ones I scored
     are saved and the rest are left empty.
  3. Given I set the scores, when I do it, then I can do it by touch, without a
     text keyboard.
- **Source sections:** S-08, S-06
- **Priority:** MVP
- **Size:** 2
- **Notes:** Assumes all four are optional (INIT-01 Q3). The scores aren't
  interpreted in Phase 1.

#### STORY-01-05-03: Tag what went wrong

- **Parent:** EPIC-01-05
- **Story:** As a home enthusiast, I want to tag defects such as channelling on
  a shot, so that I can see what went wrong when I look back.
- **Acceptance criteria**
  1. Given I'm logging a measured shot, when I tag defects, then I can choose
     one or more from the defect list and they're saved on the shot.
  2. Given I tag none, when I save, then the shot saves with no defects.
  3. Given I tagged defects, when I see the shot later, then its defects are
     shown.
- **Source sections:** S-08, S-09
- **Priority:** MVP
- **Size:** 2
- **Notes:** The defect list isn't defined; S-09 names only "Channelling"
  (EPIC-01-05 open question: defect list). This story assumes a fixed list
  the Head of Product supplies. Shot warnings (too fast, channelling) in the
  signal colour are not covered: the thresholds aren't in the spec
  (EPIC-01-05 open question: "too fast").

**Coverage:** all In items covered. Not covered: shot warnings, pending
thresholds.

### EPIC-01-06: Add what's missing from the catalog

#### STORY-01-06-01: Add a missing machine, grinder or other kit

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to add my grinder or machine when
  it's not in the catalog, with a link to its product page, so that I can
  still describe my real kit.
- **Acceptance criteria**
  1. Given my model isn't in the catalog, when I add it with its maker, kind,
     name and product page link, then it's saved and I can add it as a unit
     straight away.
  2. Given the maker isn't in the catalog either, when I add the model, then I
     can add the maker at the same time, also with a link.
  3. Given I try to add an entry without a product page link, when I save, then
     I'm asked for one and nothing is saved.
  4. Given I added an entry, when I see it, then it's marked as added by my
     household and not yet verified.
  5. Given I add a machine or grinder, when it's saved, then the shot log can
     offer the right fields for it (temperature, pressure, grind scale).
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** Who declares a user-added model's capabilities is open
  (EPIC-01-06 open question: capabilities). Criterion 5 assumes the household
  enters them when adding; if not, this story shrinks to 3 and the shot log
  needs a fallback. A product with no web page can't be added
  (EPIC-01-06 open question: no web page).

#### STORY-01-06-02: Add a missing roaster or coffee

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want to add a roaster or coffee that's not
  in the catalog, with a link to its product page, so that I can add the bag I
  bought.
- **Acceptance criteria**
  1. Given my coffee isn't in the catalog, when I add it with its roaster, name
     and product page link, then it's saved and I can add a bag of it straight
     away.
  2. Given the roaster isn't in the catalog either, when I add the coffee, then
     I can add the roaster at the same time, also with a link.
  3. Given I try to save without a product page link, when I save, then I'm
     asked for one and nothing is saved.
  4. Given I added an entry, when I see it, then it's marked as added by my
     household and not yet verified.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Roast level and tasting notes are optional on a bean (S-08); this
  story assumes the household may fill them in. Bag scanning is EPIC-06-01.

#### STORY-01-06-03: Keep what I add private until it's verified

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want what my household adds to the
  catalog to stay private until it's checked, so that unchecked entries don't
  confuse anyone else.
- **Acceptance criteria**
  1. Given my household added an unverified entry, when another household
     searches the catalog, then they don't see it.
  2. Given my household added an unverified entry, when I search, then I see
     it and can use it.
  3. Given an entry my household added has been verified, when any household
     searches, then they see it in the shared catalog, and my existing kit,
     bags and shots that use it are unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Verification and merges are a manual admin task until EPIC-06-07
  (S-02); this story covers the app's behaviour before and after, not the
  admin's tooling. The reviewer role isn't a spec user type (SQ-12).

#### STORY-01-06-04: Get pointed to an entry that already exists

- **Parent:** EPIC-01-06
- **Story:** As a home enthusiast, I want Tare to tell me when the link I'm
  adding belongs to something already in the catalog, so that I use the
  existing entry and keep my history in line with everyone else's.
- **Acceptance criteria**
  1. Given a verified entry has a product page link, when I add an entry with
     the same link, then I'm told it probably already exists and offered that
     entry.
  2. Given the link differs only by regional path or tracking parameters, when
     I add it, then it's treated as the same link and the existing entry is
     offered.
  3. Given my household added an unverified entry, when I add another with the
     same link, then I'm offered my household's existing entry.
  4. Given another household's unverified entry has the same link, when I add
     mine, then I'm not told about it.
  5. Given I'm offered an existing entry, when I accept it, then I continue
     with that entry and no new one is created.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Criterion 4 assumes the privacy rule means private entries are
  never matched across households (EPIC-01-06 open question: cross-household
  check); those duplicates are left to the admin. Whether the user can
  decline and create their own entry anyway is open (EPIC-01-06 open
  question: proceed after flag). Who maintains normalisation rules per market
  is open (EPIC-01-06 open question). Fuzzy matching is EPIC-06-07.

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
     warned as in STORY-01-06-04.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Assumes a household adds links and aliases to its own entries
  only. Whether households can add links or aliases to verified entries is
  open (SQ-04). Seed entries' links and aliases come with the seed list.

**Coverage:** all In items covered, for both catalogs, from the kit
(STORY-01-02-01) and pantry (STORY-03-01-01) flows.

---

## INIT-02: Every new bag starts from what you already learned

### EPIC-02-01: Pin the recipe that worked

#### STORY-02-01-01: Pin a recipe from a shot I liked

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a good shot as my recipe for
  that coffee, drink and toolkit, so that I can make it again without
  dialing in.
- **Acceptance criteria**
  1. Given a measured shot, when I pin it, then a recipe is saved for that
     shot's bean, persona, toolkit and drink, with its grind, dose, yield and
     time.
  2. Given the shot had temperature or pressure, when I pin it, then the recipe
     records them in the same form (exact value or step).
  3. Given I pin a shot, when I look at the recipe, then it records the grinder
     and machine the shot used and shows which shot it came from.
  4. Given a one-tap shot, when I look at it, then I can't pin it.
  5. Given I later edit the shot I pinned from, when I look at the recipe, then
     the recipe is unchanged.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Assumes a pin sets the bean's default, never a batch override
  (INIT-02 Q1). Criterion 4 assumes one-tap shots are excluded (EPIC-02-01
  open question: pinning one-tap). Criterion 5 assumes recipes are separate
  from shots (EPIC-02-06 open question: editing a pinned shot).

#### STORY-02-01-02: Pin a recipe by entering the values

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to pin a recipe by setting its
  values myself, so that I can start from a recipe I already know, such as one
  from the roaster.
- **Acceptance criteria**
  1. Given I choose a bean, toolkit and drink, when I set grind, dose, yield and
     time and pin, then a recipe is saved for them and my persona, with no
     source shot.
  2. Given the toolkit's machine can set temperature or pressure, when I enter
     the recipe, then I can set them in the machine's form, as on the shot log.
  3. Given any of the four values is missing, when I try to pin, then I'm told
     which is missing and nothing is saved.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** In the epic's scope, but no flow is described in the spec
  (EPIC-02-01 open question: pin without a shot). Reuses the shot log's
  controls. Could be cut to Next if the Head of Product prefers pinning from
  shots only.

#### STORY-02-01-03: Pin a better recipe and keep the old one

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want a new pin to replace my current
  recipe without deleting the old one, so that I always brew my latest best
  and nothing is lost.
- **Acceptance criteria**
  1. Given a bean, persona, toolkit and drink already have a recipe, when I pin
     another, then the new one becomes the current recipe.
  2. Given I re-pinned, when I look at the current recipe, then I see only the
     newest one.
  3. Given I re-pinned, when anything in the app needs a recipe for that bean,
     persona, toolkit and drink, then it uses the newest one.
  4. Given I re-pinned, when the older recipe is checked, then it still exists,
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Viewing past recipes isn't in the spec, so criterion 4 is a data
  check, not a screen. Unpinning or removing a recipe isn't in the spec
  (SQ-05).

#### STORY-02-01-04: See the recipe for a coffee

- **Parent:** EPIC-02-01
- **Story:** As a home enthusiast, I want to see my current recipe for a
  coffee, drink and toolkit, so that every new bag of it starts from what
  worked.
- **Acceptance criteria**
  1. Given a recipe is pinned for a bean, persona, toolkit and drink, when I
     look at it, then I see its values, including temperature and pressure if
     set.
  2. Given I add a new bag of the same bean, when I look for its recipe, then I
     see the recipe pinned for that bean, not a blank one.
  3. Given no recipe is pinned for that combination, when I look, then I'm told
     there isn't one yet.
  4. Given the bean was merged into another catalog entry, when I look for its
     recipe, then I see the recipe pinned against either entry.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** This is the single place that decides "which recipe applies now"
  (epic overlap flag); the home screen and pre-fill use it. Drift and offsets
  are not applied (INIT-04). Criterion 4 follows the merge-pointer rule.

**Coverage:** all In items covered.

### EPIC-02-02: Pull your daily shot in one tap

#### STORY-02-02-01: See my daily shot on the home screen

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want the home screen to show the recipe I
  usually make at this time of day, so that my daily shot needs no choices.
- **Acceptance criteria**
  1. Given my profile is selected on the home screen, when I open it, then it
     shows a pinned recipe for my profile and the drink I last made at this
     time of day.
  2. Given I usually make different drinks in the morning and the afternoon,
     when I open the home screen at each time, then it shows the matching
     drink's recipe.
  3. Given the home screen shows a recipe, when I look at it, then I see its
     coffee, drink, toolkit and values.
  4. Given I have no shots yet at this time of day, when I open the home
     screen, then it still shows a drink, chosen by the fallback the Head of
     Product sets.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 5
- **Notes:** In the MVP the only persona is the main persona. The time window
  and the first-use drink are open (EPIC-02-02 open question: time of day).
  Which bean and toolkit are shown when several have recipes for the persona
  and drink isn't in the spec (SQ-06); this story assumes the bean of the
  earliest-opened open portion and its most recently pinned recipe.

#### STORY-02-02-02: Pull this shot in one tap

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want one tap to record my daily shot, so
  that my coffee use counts without logging anything.
- **Acceptance criteria**
  1. Given the home screen shows a recipe, when I tap "Pull This Shot", then a
     shot is recorded with the recipe's values, marked one-tap, and nothing
     else is asked.
  2. Given I pull a shot, when it's recorded, then it uses the recipe's
     toolkit, grinder and machine, the drink shown, my profile as whose taste,
     and me as who logged it.
  3. Given several portions of the recipe's bean are open, when I pull a shot,
     then it's recorded against the one opened earliest.
  4. Given I pull a shot, when it's recorded, then I'm not asked for a rating.
- **Source sections:** S-06, S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** One-tap shots count toward coffee used (STORY-03-04-01) but are
  never measurements or network-eligible (S-02). The quick reaction is
  STORY-02-03-01.

#### STORY-02-02-03: Choose a bag when none is open

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to be asked which bag to use when
  none of that coffee is open, so that my shot is counted against the right
  bag.
- **Acceptance criteria**
  1. Given no portion of the recipe's bean is open, when I tap "Pull This
     Shot", then I'm asked which portion of that bean to use.
  2. Given I choose a portion, when I confirm, then the shot is recorded
     against it.
  3. Given I have no unfinished portion of that bean at all, when I tap "Pull
     This Shot", then I'm told there's none left, and no shot is recorded.
  4. Given I'm asked and cancel, when I return to the home screen, then no shot
     is recorded.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Whether choosing a portion marks it opened is open (EPIC-02-02
  open question: opening a portion; EPIC-03-02 open question: who sets
  "opened"). This story assumes it does, with today's date. Criterion 3 is an
  assumption; the spec doesn't cover it.

#### STORY-02-02-04: Undo a shot I didn't mean to pull

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want to undo a one-tap shot for a few
  seconds, so that a mistaken tap doesn't count.
- **Acceptance criteria**
  1. Given I just pulled a one-tap shot, when I undo within the undo window,
     then the shot is removed as if it was never pulled.
  2. Given I undid a shot, when I look at remaining coffee and recent shots,
     then the shot isn't counted or listed.
  3. Given the undo window has passed, when I look, then undo is no longer
     offered and the shot stays; I can still edit it (STORY-02-06-02).
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Window length ("a few seconds") to be set by the Head of Product
  (EPIC-02-02 open question: undo window); this story assumes 5 seconds as a
  placeholder. If the shot marked a portion opened (STORY-02-02-03), whether
  undo reverts that too isn't in the spec; assumed yes.

#### STORY-02-02-05: Dial in when there's no recipe yet

- **Parent:** EPIC-02-02
- **Story:** As a home enthusiast, I want the home screen to offer "Dial in"
  when I have no recipe for this drink, so that I know to start a shot log
  instead.
- **Acceptance criteria**
  1. Given no recipe is pinned for my profile and the drink shown, when I open
     the home screen, then the button reads "Dial in" instead of "Pull This
     Shot".
  2. Given the button reads "Dial in", when I tap it, then the shot log opens.
  3. Given I then pin a recipe, when I return to the home screen, then the
     button reads "Pull This Shot".
- **Source sections:** S-02, S-06
- **Priority:** MVP
- **Size:** 1
- **Notes:** Whether the log starts blank or from another bean's recipe is open
  (EPIC-02-03 open question: dial-in start). This story assumes blank, with
  the drink pre-chosen.

**Coverage:** all In items covered. Editing a one-tap shot afterwards is
delivered by EPIC-02-06 (STORY-02-06-02), as the epic states.

### EPIC-02-03: Fix a bad shot from your recipe

#### STORY-02-03-01: Say whether a one-tap shot was good or off

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to say "good" or "off" after a
  one-tap shot, or say nothing, so that Tare knows how it went without making
  me fill anything in.
- **Acceptance criteria**
  1. Given I just pulled a one-tap shot, when I choose "good", then the shot
     records that reaction.
  2. Given I just pulled a one-tap shot, when I give no reaction, then the shot
     stays with no reaction, and nothing nags me.
  3. Given I choose "off", when I do, then the shot records that reaction and
     the fix flow opens (STORY-02-03-02).
- **Source sections:** S-02, S-06, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** How long the reaction stays offered, and whether it can be changed
  or given later, isn't in the spec (SQ-07).

#### STORY-02-03-02: Fix an off shot from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want an off shot to open the log already
  filled with my recipe, so that I only nudge one or two values.
- **Acceptance criteria**
  1. Given I marked a one-tap shot "off", when the log opens, then it's filled
     with the current recipe's values, toolkit, drink and the same portion.
  2. Given the pre-filled log, when I change one or two values and save, then a
     measured shot is saved with my changes.
  3. Given I saved the measured shot, when I look at it, then I can pin it as
     my new recipe (STORY-02-01-01).
  4. Given the pre-filled log, when I leave without saving, then no measured
     shot is saved and the one-tap shot keeps its "off" reaction.
- **Source sections:** S-02, S-06, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Assumes two records: the one-tap shot stays, marked "off", and a
  new measured shot is added (EPIC-02-03 open question: one record or two).
  If one record is wanted instead, remaining-coffee counting (STORY-03-04-01)
  changes too. Suggesting what to change is out of scope (INIT-04, EPIC-06-02).

#### STORY-02-03-03: Dial in from my recipe

- **Parent:** EPIC-02-03
- **Story:** As a home enthusiast, I want to start a shot log from my recipe
  instead of pulling it, so that I can dial in a new bag of a coffee I know.
- **Acceptance criteria**
  1. Given the home screen shows a recipe, when I choose to dial in, then the
     log opens filled with the recipe's values, toolkit and drink.
  2. Given the pre-filled log, when I adjust and save, then a measured shot is
     saved; no one-tap shot is recorded.
  3. Given the recipe has temperature or pressure, when the log opens, then
     those are filled too.
- **Source sections:** S-06, S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Assumes the home screen offers dial-in alongside "Pull This Shot";
  how is for design. Portion choice follows the one-tap rule
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
  1. Given a measured shot of a bag, when I choose to pin it for this bag only,
     then a recipe is saved for that bag, persona, toolkit and drink.
  2. Given I pinned for one bag, when I look at the bean's default recipe, then
     it's unchanged.
  3. Given I pin for this bag again, when I look, then the newest bag recipe
     applies.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Assumes the user chooses "this bag only" or "this coffee" at pin
  time (INIT-02 Q1, still open).

#### STORY-02-04-02: Use the bag's recipe while that bag is in use

- **Parent:** EPIC-02-04
- **Story:** As a home enthusiast, I want the home screen and pre-filled log to
  use the bag's own recipe while I'm on that bag, so that I don't have to
  remember the difference.
- **Acceptance criteria**
  1. Given a bag with its own recipe, when the home screen picks that bag, then
     it shows the bag's recipe, not the bean's default.
  2. Given that bag's recipe, when I pull a one-tap shot or open the pre-filled
     log, then the bag's values are used.
  3. Given I move to a new bag of the same coffee, when I open the home screen,
     then the bean's default recipe is used again.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** "In use" relies on the home screen's bean choice (SQ-06).
  Removing an override is open (SQ-11).

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
- **Notes:** Going back to the translated starter name isn't in the spec.

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
  4. Given I try to hide my last visible drink, when I do, then I'm told I need
     at least one.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 2
- **Notes:** What happens to recipes and the home-screen default for a hidden
  drink is open (EPIC-02-05 open question: hidden drinks). Criterion 4 is an
  assumption.

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
- **Notes:** Whether the user says if it has milk is open (EPIC-02-05 open
  question: `has_milk`).

#### STORY-02-05-04: Put my drinks in my order

- **Parent:** EPIC-02-05
- **Story:** As a home enthusiast, I want to reorder my drinks, so that the ones
  I make most come first.
- **Acceptance criteria**
  1. Given my drink list, when I change the order, then drinks appear in that
     order wherever I choose one.
  2. Given I add a drink, when I see the list, then it's placed at the end.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 1
- **Notes:** Criterion 2 is an assumption.

**Coverage:** all In items covered.

### EPIC-02-06: See your recent shots

#### STORY-02-06-01: See my recent shots

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want a list of my recent shots, newest
  first, so that I can find a shot I want to check or fix.
- **Acceptance criteria**
  1. Given my household has logged shots, when I open recent shots, then I see
     them newest first, each with its coffee, drink, when it was pulled and its
     grind, dose, yield and time.
  2. Given the list has measured and one-tap shots, when I look at it, then I
     can tell which is which.
  3. Given the list, when I look at a shot, then I can see whose taste it
     records.
  4. Given my household has no shots yet, when I open recent shots, then I'm
     told there are none and how to log one.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** How many shots, or how far back, counts as "recent" is open
  (EPIC-02-06 open question: recent). Filtering and search are out of scope.
  Criterion 3 matters only once sub personas exist (EPIC-05-01).

#### STORY-02-06-02: Fix a shot after the fact

- **Parent:** EPIC-02-06
- **Story:** As a home enthusiast, I want to open any recent shot, including a
  one-tap shot that didn't go to plan, and correct its values, so that my
  history is right.
- **Acceptance criteria**
  1. Given a shot in the list, when I open it, then I see it in the shot log
     with its saved values, including temperature, pressure, taste and
     sweetened if set.
  2. Given I change values and save, when I look at the shot again, then it
     shows my changes, and whose taste it records and who logged it are
     unchanged.
  3. Given I change a dose, when I look at remaining coffee, then it reflects
     the new dose.
  4. Given I edit a shot a recipe was pinned from, when I look at the recipe,
     then it's unchanged.
  5. Given I leave without saving, when I look at the shot, then it's
     unchanged.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Whether an edited one-tap shot becomes measured is open
  (EPIC-02-06 open question: entry mode); this story assumes it stays
  one-tap. Whether coffee, drink or toolkit can also be changed is open
  (SQ-08); assumed values only, per the epic scope. Deleting a shot is open
  (EPIC-02-06 open question: delete). Criterion 4 assumes recipes are
  separate rows (EPIC-02-06 open question: pinned shots).

**Coverage:** all In items covered.

---

## INIT-03: Always know what beans you have and how old they are

### EPIC-03-01: Add a bag to your pantry

#### STORY-03-01-01: Find my coffee in the catalog

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to find the coffee I bought by
  roaster and name, so that my bag is linked to the right coffee.
- **Acceptance criteria**
  1. Given the catalog has roasters and beans, when I choose a roaster, then I
     see its coffees.
  2. Given a coffee or roaster has another name, when I search by it, then it's
     found.
  3. Given a catalog entry has been merged, when I search or pick it, then I get
     the surviving entry.
  4. Given my household added an unverified coffee, when I search, then I see
     it; other households' unverified coffees never appear.
  5. Given my search finds nothing, when I look at the results, then I'm offered
     to add it (STORY-01-06-02).
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Shares search behaviour with STORY-01-02-01. Seed coverage for
  roasters and beans: EPIC-03-01 open question.

#### STORY-03-01-02: Add a bag with its dates and weight

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to record a bag's roast or
  best-before date and weight, so that Tare knows how fresh it is and how
  much I have.
- **Acceptance criteria**
  1. Given I've picked a coffee, when I enter the bag weight and save, then the
     bag is added to my pantry.
  2. Given I add a bag, when I enter a roast date, best-before date, lot code or
     purchase date, then each is saved with it; each may be left empty.
  3. Given I don't enter a bag weight, when I save, then I'm asked for it and
     nothing is saved.
  4. Given I enter the weight, when I see it, then it's in grams, in my locale's
     number format.
  5. Given I buy another bag of the same coffee, when I add it, then it's a
     separate bag with its own dates and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Assumes neither date is required (INIT-03 Q2); bean age then
  can't be shown (STORY-03-03-01). Whether impossible dates are rejected (for
  example a roast date in the future) isn't in the spec (SQ-09). X-1 applies
  to dates.

#### STORY-03-01-03: Start with the whole bag ready to brew

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want a new bag to be ready to brew from
  straight away, so that I don't have to split or set it up first.
- **Acceptance criteria**
  1. Given I add a bag, when it's saved, then it holds one portion with the
     whole bag's weight.
  2. Given the bag was just added, when I log a shot, then its portion is
     offered as coffee to brew from.
  3. Given I split the bag later (STORY-03-02-01), when I look at it, then it's
     still one bag with one roast date and lot.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 1
- **Notes:** Whether the new portion is opened or unopened is open (SQ-03,
  EPIC-03-02 open question: who sets "opened").

#### STORY-03-01-04: See what's in my pantry

- **Parent:** EPIC-03-01
- **Story:** As a home enthusiast, I want to see all my bags and their
  portions in one place, so that I know what coffee I have.
- **Acceptance criteria**
  1. Given my pantry has bags, when I open it, then I see each bag with its
     coffee, roaster, dates and weight, and its portions under it.
  2. Given my pantry is empty, when I open it, then I'm told it's empty and
     offered to add a bag.
  3. Given a coffee was merged into another catalog entry, when I see my bag,
     then it shows the surviving coffee's details.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Portion state, age and remaining weight are added by
  STORY-03-02-04, STORY-03-03-01 and STORY-03-04-01. Whether finished bags
  stay in the list isn't in the spec; assumed they do, shown as finished.

**Coverage:** all In items covered.

### EPIC-03-02: Split and freeze a bag

#### STORY-03-02-01: Split a bag into portions

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to split a bag into portions by
  weight, such as half for the counter and half for the freezer, so that
  Tare tracks each part on its own.
- **Acceptance criteria**
  1. Given a portion, when I split it into two or more by weight, then each new
     portion has its own weight and belongs to the same bag.
  2. Given I split a portion, when I look at the bag, then its roast date, lot
     and other bag details are unchanged and not repeated per portion.
  3. Given I split a portion, when I look at old shots against it, then they're
     still there.
  4. Given the weights I enter add up to more than the portion, when I save,
     then I'm told and nothing is split.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Whether split weights must add up to the bag weight is open
  (EPIC-03-02 open question: split weights). Criterion 4 assumes "not more
  than"; less is allowed. What the original portion becomes after a split
  (kept with the remainder, or replaced) is for the tech lead, as long as old
  shots stay linked.

#### STORY-03-02-02: Record freezing and thawing

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to record when I froze and thawed a
  portion, so that its age and state are right.
- **Acceptance criteria**
  1. Given a portion not in the freezer, when I mark it frozen, then the date is
     saved; it defaults to today and I can choose an earlier date.
  2. Given a frozen portion, when I mark it thawed, then the date is saved.
  3. Given a portion was frozen and thawed, when I look at it, then I can't
     freeze it again.
  4. Given I enter a thaw date before its freeze date, when I save, then I'm
     told and nothing is saved.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Criterion 3 assumes one freeze and one thaw per portion, as the
  schema implies (EPIC-03-02 open question: refreezing). Criterion 4 is an
  assumption (SQ-09).

#### STORY-03-02-03: Record opening and finishing a portion

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to record when I opened and finished
  a portion, so that Tare knows which coffee is in use.
- **Acceptance criteria**
  1. Given an unopened portion, when I mark it opened, then the date is saved;
     it defaults to today and I can choose an earlier date.
  2. Given a portion, when I mark it finished, then the date is saved and it's no
     longer offered for new shots.
  3. Given I marked a portion finished by mistake, when I undo it, then it's
     offered for shots again.
  4. Given a finished portion, when I look at its shots, then they're still
     there.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Assumes the user sets "opened"; whether a first shot sets it is
  open (EPIC-03-02 open question: who sets "opened"). The one-tap portion rule
  depends on it. Criterion 3 is an assumption.

#### STORY-03-02-04: See where each portion is

- **Parent:** EPIC-03-02
- **Story:** As a home enthusiast, I want to see whether each portion is on the
  counter, in the freezer or finished, so that I know what I can brew with.
- **Acceptance criteria**
  1. Given a portion that's frozen and not thawed, when I see it, then it shows
     as in the freezer.
  2. Given a portion that's not frozen, or thawed, and not finished, when I see
     it, then it shows as on the counter.
  3. Given a finished portion, when I see it, then it shows as finished.
  4. Given I change a portion's dates, when I see it, then its state follows.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** The state is calculated from dates, never stored.

**Coverage:** all In items covered.

### EPIC-03-03: Know how fresh your beans really are

#### STORY-03-03-01: See how old my beans are

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want each portion to show its bean age,
  so that I know how fresh it really is.
- **Acceptance criteria**
  1. Given a bag with a roast date, when I see its portions, then each shows the
     days since roast, less any days it spent frozen.
  2. Given a bag with only a best-before date, when I see its portions, then
     their age is worked out from best-before.
  3. Given a bag with neither date, when I see its portions, then no age is
     shown, and I'm told why.
  4. Given a day passes, when I see the portion again, then its age has gone up
     by one, unless it's frozen.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 3
- **Notes:** The assumed gap between roast and best-before, and the
  no-dates case, are open (INIT-03 Q2); criterion 3 is an assumption. Age is
  from roast only; "days since opened" (S-09) is not covered (EPIC-03-03 open
  question). Calculated, never stored.

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
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Depends on STORY-03-02-02.

#### STORY-03-03-03: See bean age when logging, and spot frozen-ground shots

- **Parent:** EPIC-03-03
- **Story:** As a home enthusiast, I want to see bean age on the shot log and
  know which shots were ground from frozen, so that I can explain shots that
  behaved differently.
- **Acceptance criteria**
  1. Given I'm logging a shot, when I've chosen the coffee, then I see that
     portion's bean age.
  2. Given a shot was pulled while its portion was frozen and not yet thawed,
     when I see the shot, then it's marked as ground from frozen.
  3. Given a shot was pulled after the portion was thawed, or never frozen,
     when I see it, then it's not marked.
  4. Given I later correct a portion's freeze or thaw date, when I see its
     shots, then the mark follows the corrected dates.
- **Source sections:** S-02
- **Priority:** MVP
- **Size:** 2
- **Notes:** Worked out from dates alone; nothing extra is stored (S-02).
  X-1 matters here: a shot and a thaw on the same day need time precision.

**Coverage:** all In items covered.

### EPIC-03-04: See how much coffee is left

#### STORY-03-04-01: See how much is left

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each portion and bag to show how much
  coffee is left, so that I know when to buy more.
- **Acceptance criteria**
  1. Given a portion with shots, when I see it, then it shows its weight minus
     the doses of every shot against it, measured and one-tap.
  2. Given a bag with several portions, when I see it, then it shows the total
     left across its portions.
  3. Given I undo or edit a shot, when I see the portion, then what's left
     follows.
  4. Given logged doses add up to more than the portion, when I see it, then it
     shows nothing left rather than a negative amount.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Criterion 4 is an assumption (INIT-03 Q3). Calculated, never
  stored. With STORY-02-03-02's two-record assumption, an "off" one-tap shot
  and its fix both count (see "Double counting" in the open questions).

#### STORY-03-04-02: Weigh what's left

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want to weigh what's left in a portion and
  record it, so that Tare's count matches my real stock.
- **Acceptance criteria**
  1. Given a portion, when I record its weight now, then what's left shows that
     weight.
  2. Given I recorded a weight, when I log shots afterwards, then their doses
     are taken off that weight.
  3. Given I recorded several weights, when I see the portion, then the latest
     one is used.
  4. Given I don't weigh, when I see the portion, then what's left is still
     worked out from doses.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** Whether the app should prompt a stock check is open (EPIC-03-04
  open question: prompting).

#### STORY-03-04-03: See which bags are open or finished

- **Parent:** EPIC-03-04
- **Story:** As a home enthusiast, I want each bag to show whether it's open or
  finished, so that I know at a glance which coffee is in use.
- **Acceptance criteria**
  1. Given a bag with at least one portion opened and not finished, when I see
     it, then it shows as open.
  2. Given every portion of a bag is finished, when I see it, then it shows as
     finished.
  3. Given I change a portion's dates, when I see the bag, then its status
     follows.
- **Source sections:** S-02, S-08
- **Priority:** MVP
- **Size:** 2
- **Notes:** S-02 names only "open" and "finished"; how to show a bag with no
  portion opened yet is open (SQ-10). Calculated, never stored.

**Coverage:** all In items covered.

### EPIC-03-05: Know when you'll run out

#### STORY-03-05-01: See how fast we use coffee

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see how much coffee my household
  really uses, so that I know how fast we go through it.
- **Acceptance criteria**
  1. Given finished portions, doses, stock checks and purchase dates, when I
     look at the pantry, then I see a usage rate worked out from them.
  2. Given not enough history yet, when I look, then I'm told a rate isn't
     available yet rather than shown a guess.
  3. Given new shots or finished portions, when I look again, then the rate
     follows.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** "Enough history" and the accuracy target are open (X-2).
  Calculated, never stored.

#### STORY-03-05-02: See when we'll run out

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see roughly when we'll run out,
  counting the freezer, so that I can buy coffee in time.
- **Acceptance criteria**
  1. Given a usage rate and coffee left across all portions, frozen included,
     when I look at the pantry, then I see a predicted run-out date.
  2. Given no usage rate yet, when I look, then no date is shown.
  3. Given I add a bag, when I look again, then the date moves later.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Reorder prompts are out of scope. Whether prediction is Phase 1
  at all is INIT-03 Q1.

#### STORY-03-05-03: See how much of our coffee gets logged

- **Parent:** EPIC-03-05
- **Story:** As a household member, I want to see how much of the coffee we
  finish shows up in our logs, so that I know how far to trust the numbers.
- **Acceptance criteria**
  1. Given finished portions with logged doses, when I look, then I see the
     share of their weight that logged shots account for.
  2. Given no finished portions yet, when I look, then I'm told it isn't
     available.
- **Source sections:** S-02
- **Priority:** Next
- **Size:** 2
- **Notes:** None.

**Coverage:** all In items covered.

---

## INIT-04: Grind settings stay meaningful through maintenance and time

### EPIC-04-01: Record maintenance on your kit

#### STORY-04-01-01: Log maintenance on a piece of kit

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want to log dated maintenance on my
  grinder or machine, such as new burrs or a clean, so that I have a record of
  what was done and when.
- **Acceptance criteria**
  1. Given a unit I own, when I add maintenance with its kind (new burrs, clean,
     re-zero, repair, other), date and an optional note, then it's saved on that
     unit.
  2. Given I add maintenance, when I set its date, then it defaults to today and
     I can choose an earlier date.
  3. Given a unit with maintenance, when I look at it, then I see its events,
     newest first.
  4. Given I don't choose a kind, when I save, then I'm asked for one and
     nothing is saved.
  5. Given a retired unit, when I look at it, then I can still see its events.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Offsets are Next (EPIC-04-03). Editing or deleting an event isn't
  in the epic's scope and isn't covered.

#### STORY-04-01-02: Mark a recalibration

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want to mark that I recalibrated my
  grinder, so that Tare doesn't compare my grind settings across the change.
- **Acceptance criteria**
  1. Given my grinder, when I mark a recalibration, then it's recorded as
     maintenance on that grinder with its date.
  2. Given I marked a recalibration, when I look at the grinder's events, then I
     can tell it apart from other kinds.
  3. Given I marked a recalibration, when I look at shots and recipes, then it
     splits them into grind periods like any other event (STORY-04-01-03).
- **Source sections:** S-01, S-02
- **Priority:** MVP
- **Size:** 1
- **Notes:** Assumes a recalibration is the "re-zero" kind of event, not a flag
  on any event (EPIC-04-01 open question: recalibration). If it's a flag, size
  stays 1 but the data changes. Could merge into STORY-04-01-01 if confirmed.

#### STORY-04-01-03: Split grind history at each grinder event

- **Parent:** EPIC-04-01
- **Story:** As a home enthusiast, I want my grind history split at each
  grinder maintenance, so that settings from before and after aren't mixed up.
- **Acceptance criteria**
  1. Given a grinder with maintenance, when I look at a shot or recipe made on
     it, then I can see which grind period it belongs to (before or after which
     event).
  2. Given I add an event with an earlier date, when I look at older shots,
     then they're placed in periods by the new dates.
  3. Given maintenance on a machine, when I look at shots, then grind periods
     aren't affected.
  4. Given a grinder with no maintenance, when I look at its shots, then they're
     all in one period.
- **Source sections:** S-02, S-04, S-08
- **Priority:** MVP
- **Size:** 3
- **Notes:** Periods are derived from dates, never stored. Where the user sees
  periods is open (EPIC-04-01 open question: where shown); this story assumes
  on the recent shots list (EPIC-02-06) and the grinder's events. Criterion 3
  assumes machine events don't split grind (EPIC-04-03 open question:
  non-grinder events).

**Coverage:** all In items covered.

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
- **Notes:** How aging drift is estimated, and from how many shots, is open
  (INIT-04 Q3); size may grow once answered. Calculated at read time. No AI
  (EPIC-04-02 open question: algorithm vs AI).

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
- **Notes:** "Batch character" isn't defined beyond S-02; this story assumes
  it's the bag's consistent offset from the recipe. INIT-04 Q3.

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
- **Notes:** How "the recipe was fine" weighs in, and how an "off" reaction is
  treated, aren't in the spec; assumed "off" one-tap shots carry no signal of
  their own (their measured fix does).

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
- **Notes:** Weighting strength and window are open (INIT-04 Q2).

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
- **Notes:** Depends on STORY-04-01-03. Maintenance offsets are EPIC-04-03.

#### STORY-04-02-06: See the suggested grind where I brew

- **Parent:** EPIC-04-02
- **Story:** As a home enthusiast, I want to see the suggested grind on the
  home screen and in the pre-filled log, so that I use it without looking it
  up.
- **Acceptance criteria**
  1. Given a suggestion differs from the pinned grind, when I see the home
     screen, then I see the suggested grind and that it differs from my
     recipe.
  2. Given the pre-filled log (STORY-02-03-02, STORY-02-03-03), when it opens,
     then grind is filled with the suggestion.
  3. Given I pull a one-tap shot with a suggestion shown, when it's recorded,
     then it records the grind I was shown.
  4. Given no suggestion applies, when I see the home screen, then only the
     pinned grind is shown.
- **Source sections:** S-02, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Shown as a changed grind, a note or both is open (INIT-04 Q4).
  Criterion 3 is an assumption the spec doesn't settle: a one-tap shot
  "copies the recipe", which may mean the pinned grind.

**Coverage:** all In items covered. Kit maintenance drift is EPIC-04-03 (epic
overlap flag).

### EPIC-04-03: Re-dial once after maintenance and keep every recipe

#### STORY-04-03-01: Re-dial one coffee and get the shift

- **Parent:** EPIC-04-03
- **Story:** As a home enthusiast, I want to re-dial one coffee after grinder
  maintenance and have Tare work out how far my dial moved, so that I don't
  have to re-dial every coffee.
- **Acceptance criteria**
  1. Given a grinder event and a recipe pinned before it, when I pin a new
     recipe for the same coffee after the event, then Tare proposes a shift in
     grinder units.
  2. Given the beans aged between the two dial-ins, when the shift is proposed,
     then the aging estimate is taken off first.
  3. Given there's no recipe from before the event for the coffee I re-dial,
     when I pin, then no shift is proposed and I'm told why.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 5
- **Notes:** Depends on STORY-04-02-01 for the aging estimate (INIT-04 Q3).
  Assumes a re-dial is "a recipe pinned after the event on that grinder".

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
- **Notes:** A confirmed shift is a user decision: stored, not recalculated
  (S-02).

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
- **Notes:** Criterion 4 assumes shifts chain (EPIC-04-03 open question:
  chaining). Machine events are assumed to have no effect (EPIC-04-03 open
  question: non-grinder events).

**Coverage:** all In items covered.

### EPIC-04-04: Keep recipes right after new burrs of a different design

#### STORY-04-04-01: Work out a stretch from two or more re-dials

- **Parent:** EPIC-04-04
- **Story:** As a home enthusiast, I want Tare to notice when new burrs change
  what each dial step means, so that both fine and coarse recipes stay right.
- **Acceptance criteria**
  1. Given two or more coffees re-dialed after the same grinder event, when the
     second re-dial is pinned, then Tare proposes a stretch factor as well as a
     shift.
  2. Given only one coffee re-dialed, when I look at the event, then the stretch
     stays at 1.
  3. Given the re-dials disagree too much to fit, when Tare proposes, then I'm
     told the fit is uncertain.
- **Source sections:** S-02, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** The fitting method for more than two coffees, and what counts as
  disagreeing, are open (EPIC-04-04 open question). Criterion 3 is an
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
- **Notes:** Formula from S-08.

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
- **Notes:** Criterion 2 assumes a sub persona must be named (EPIC-05-01 open
  question: default label). Sub personas never share data (S-02).

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
- **Notes:** Whether removal is allowed, and what happens to its shots, is open
  (EPIC-05-01 open question: delete); criterion 2 is a placeholder until
  answered. Criterion 3 assumes every login keeps its one main persona (S-04).

#### STORY-05-01-03: Choose who I'm brewing for on the home screen

- **Parent:** EPIC-05-01
- **Story:** As a household member, I want to pick a profile on the home
  screen, so that the recipe and drink shown are theirs.
- **Acceptance criteria**
  1. Given my household has more than one persona, when I pick one on the home
     screen, then it shows that persona's recipe and their usual drink at this
     time of day.
  2. Given I pick a persona with no recipe for the drink shown, when I look,
     then the button reads "Dial in".
  3. Given I pull a shot or open the log after picking a persona, when the shot
     is saved, then it's for that persona.
  4. Given a household with only the main persona, when I open the home screen,
     then nothing about picking a persona is in my way.
- **Source sections:** S-02, S-04, S-06
- **Priority:** Next
- **Size:** 3
- **Notes:** Whether the chosen persona is remembered between visits isn't in
  the spec; for design.

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
  3. Given recent shots, when I look, then I can tell whose taste each shot
     records.
  4. Given my own recipes, when I brew for a sub persona, then mine are
     unchanged.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** No schema change (S-02).

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
- **Notes:** Criterion 3 is open (EPIC-05-02 open question). Leaving the
  household is open (INIT-05 Q3).

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
- **Story:** As a home enthusiast, I want to sign in with Google and keep
  everything I've logged, so that my history isn't lost if my phone is.
- **Acceptance criteria**
  1. Given I've been using Tare without signing in, when I sign in with Google,
     then all my kit, pantry, recipes and shots are still there, unchanged.
  2. Given I linked Google, when I see my profile, then its name or label is
     unchanged; nothing is taken from my Google account.
  3. Given the Google account is already linked to another Tare account, when I
     try to link it, then I'm told, and my current data stays as it is.
  4. Given linking fails or I cancel, when I return, then I'm still in my
     account with all my data.
- **Source sections:** S-02, S-04, S-08
- **Priority:** Next
- **Size:** 3
- **Notes:** Firebase links Google to the same anonymous account, so nothing
  moves (S-02). Criterion 2 assumes no personal data from Google (EPIC-05-03
  open question: label). Criterion 3 assumes no merge of households
  (EPIC-05-03 open question: already linked). Whether and when to prompt
  linking is open (EPIC-05-03 open question: prompting).

#### STORY-05-03-02: Reach my history on another phone

- **Parent:** EPIC-05-03
- **Story:** As a home enthusiast, I want to sign in with Google on a new
  phone and find my history, so that changing phones doesn't mean starting
  again.
- **Acceptance criteria**
  1. Given I linked Google on one device, when I sign in with the same Google
     account on another, then I reach the same account and household.
  2. Given I'm signed in on a new device, when I look, then I see all my kit,
     pantry, recipes and shots.
  3. Given I open Tare on a new device for the first time, when I start, then I
     can choose to sign in with Google before a new anonymous account is made.
- **Source sections:** S-02, S-04
- **Priority:** Next
- **Size:** 3
- **Notes:** Criterion 3 is an assumption to avoid the "second device set up
  anonymously first" case (EPIC-05-03 open question: already linked). Using
  two devices at once isn't in the spec.

**Coverage:** all In items covered.

---

## INIT-06: Dial in a new bag in fewer shots with AI and the community

All stories in this initiative are Later and light. Each AI feature ships with
evals and observability (S-01). The eval stories use the home enthusiast's
benefit, since the spec has no user type for the team that runs them (SQ-13).

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
  shot, on my own kit and in the right direction on my dial, so that the next
  shot is better.
- **Acceptance criteria**
  1. Given a bad measured shot with scores or defects, when I ask for help in
     the fix flow, then I get a short diagnosis and one action for my kit.
  2. Given my grinder's coarser direction, when the action says finer or
     coarser, then it names the right way on my dial.
  3. Given one-tap shots in my history, when the Coach advises, then it uses
     only measured shots.
- **Priority:** Later
- **Size:** 5
- **Notes:** S-09 uses days since opened; EPIC-03-03 computes age from roast
  (EPIC-06-02 open question).

#### STORY-06-02-02: Advice grounded in guides and my manuals

- **Parent:** EPIC-06-02
- **Story:** As a home enthusiast, I want the Coach's advice based on
  extraction guides and the manuals for my kit, so that I can trust it.
- **Acceptance criteria**
  1. Given my toolkit, when the Coach advises, then its advice draws on the
     guides and the manuals for my equipment.
  2. Given no manual exists for my kit, when it advises, then it falls back to
     the guides.
- **Priority:** Later
- **Size:** 8
- **Notes:** **Flagged at 8: split** into ingesting guides and manuals, and
  using them in advice, when this epic is re-planned (the epic suggests RAG
  becomes its own epic if INIT-06 is split). Sources and licensing are open
  (EPIC-06-02 open question).

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
- **Notes:** Withdrawing and deleting already-shared data is open (INIT-06
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
     from them.
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
     offered, then I see a Match Score Warning.
  2. Given the warning, when I look, then I'm offered a version adjusted toward
     my palate.
- **Priority:** Later
- **Size:** 5
- **Notes:** Needs EPIC-06-04 and EPIC-06-02.

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
  Conflicting data between entries is open (EPIC-06-07 open question).

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

- **Split:** STORY-06-02-02 (RAG grounding, 8): split when EPIC-06-02 is
  re-planned, as the epic already suggests.
- **Watch:** STORY-04-02-01 and STORY-04-02-02 (5 each) may grow to 8 once
  INIT-04 Q3 (how aging drift is estimated) is answered; split then if so.
- **Watch:** STORY-01-06-01 (5) drops to 3 if households don't declare
  capabilities for kit they add.
- **Could cut from MVP:** STORY-01-01-03 (rename the profile), if the rename
  isn't MVP; STORY-02-01-02 (pin by entering values), if pinning from shots is
  enough.
- **Could merge:** STORY-04-01-02 into STORY-04-01-01, if a recalibration is
  just the re-zero kind.

## Not covered

- Shot warnings (too fast, channelling) in the signal colour (EPIC-01-05):
  thresholds not in the spec.
- Editing or deleting a toolkit (EPIC-01-02), deleting a shot (EPIC-02-06),
  editing or deleting a maintenance event, removing a recipe (SQ-05) or a bag
  override (SQ-11): not in epic scope or the spec.

## Open questions for the Head of Product

New questions raised while writing stories. Questions already carried in
`epics.md` and `initiatives.md` are referenced in each story's Notes and
aren't repeated here.

- **SQ-01** (STORY-01-01-01): what happens on first launch with no
  connection? Assumed: the app says it couldn't start and offers to retry.
- **SQ-02** (STORY-01-02-03): what happens to a toolkit when one of its units
  is retired?
- **SQ-03** (STORY-01-03-01, STORY-03-01-03): are unopened portions offered
  when logging, and is a new bag's portion opened or unopened? Tied to the
  EPIC-03-02 question on who sets "opened".
- **SQ-04** (STORY-01-06-05): can a household add links or aliases to a
  verified or seed entry, or only to its own?
- **SQ-05** (STORY-02-01-03): can a recipe be unpinned or removed, leaving no
  recipe for that combination?
- **SQ-06** (STORY-02-02-01): when a persona has recipes for several beans or
  toolkits for the same drink, which one does the home screen show? Assumed:
  the bean of the earliest-opened open portion, most recently pinned recipe.
  This affects the core one-tap flow, so it's the most pressing.
- **SQ-07** (STORY-02-03-01): how long is the good/off reaction offered, and
  can it be changed or given later?
- **SQ-08** (STORY-02-06-02): when editing a shot, can its coffee, drink,
  toolkit or persona change, or only its values?
- **SQ-09** (STORY-03-01-02, STORY-03-02-02): should impossible dates be
  rejected (roast date in the future, thaw before freeze)?
- **SQ-10** (STORY-03-04-03): S-02 names bag statuses "open" and "finished";
  how should a bag with no portion opened yet be shown?
- **SQ-11** (EPIC-02-04): can a bag's own recipe be removed so the bag goes
  back to the bean's default? Answer with INIT-02 Q1.
- **SQ-12** (STORY-01-06-03, STORY-06-07-01): the catalog reviewer (admin) is
  not a spec user type. Should the spec name the role, so admin stories can
  be written for it?
- **SQ-13** (INIT-06 eval stories): eval and observability work has no user
  type in the spec; these stories use the home enthusiast's benefit. Fine, or
  should a team role be named?
- **SQ-14** (STORY-03-04-01, STORY-02-03-02): if an "off" one-tap shot and its
  measured fix are two records, both doses count toward coffee used. Is that
  right (two shots pulled), or should the one-tap dose be dropped? Answer
  with the EPIC-02-03 "one record or two" question.
