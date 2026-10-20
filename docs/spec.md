# Tare: The Hardware-Aware Coffee Journal

Master Product & Engineering Specification

> The updates below are newer than the rest of this spec. Where they differ,
> the updates win.

## S-01 Updates (October 2026)

- Target user: everyday home enthusiasts, not semi-pros. Goal: great coffee from every new bag, in fewer shots, tuned to your palate.
- Core differentiators: palate learning and drift-aware dial-in.
- Grind size doesn't transfer between grinders or over time. Treat it as a personal offset per grinder, give more weight to recent shots, and let users mark a recalibration.
- Roadmap: Phase 1 is a basic app for logging shots and managing recipes, setups and the pantry. AI features come later, each with evals and observability. RAG will ground the Diagnostic Coach in extraction guides and equipment manuals.
- Design: Inter, thin weights at large sizes, regular weight for small labels. Monochrome warm grey palette with one muted colour for shot warnings.

## S-02 Data model decisions (October 2026)

Agreed while reviewing the schema in S-08, which already reflects them.

- **Recipes belong to the bean.** A pinned recipe is scoped to bean, persona, setup and drink type, so a new bag of the same coffee starts from what was learned before. An optional batch override handles a bag that behaves differently.
- **Batches hold portions.** The batch is the bag as bought (bean, roaster's lot code, roast date, best-before, bag weight, purchase date). Portions are what physically exists: their weight and when each was frozen, thawed, opened and finished. Shots are logged against a portion. Splitting a bag never duplicates roast date or lot.
- **Two freshness clocks, both paused by freezing.**
  - *Since roasting* (how old the coffee is): from the roast date; if the bag shows only a packing date, from that, labelled as packed; if it shows only best-before, Tare doesn't invent an age and shows the time left until best-before instead.
  - *Since opening* (air exposure, which speeds up oxidation): per portion, from its opened date. At the machine this is usually the more telling number; the Diagnostic Coach's "days open" rule uses it.
  - Time in the freezer counts toward neither clock. A shot ground straight from frozen beans is identifiable from the dates alone.
  - Home shows both clocks on one line. A single combined freshness score is deliberately deferred: its weighting depends on roast level, storage and the coffee itself, so it belongs with drift-aware dial-in (INIT-04), where it can be learned from the household's own shots rather than guessed.
- **"Open" means opened, not finished and not in the freezer.** A portion that was opened and then frozen isn't open until it's thawed. One-tap pulls never use frozen coffee on their own; frozen coffee is used only when the user picks it.
- **Grind is relative to one grinder and one maintenance period.** A grind value only means something together with the physical grinder (an owned unit, not the model) and the period since its last maintenance event (burrs, cleaning, re-zero). Shots and recipes record their setup, and setups never change (see below), so history can't be rewritten. After maintenance, the user re-dials one coffee; the difference becomes the period's offset and is applied, when reading, to every recipe pinned on that grinder before the event. Bean aging between the two dial-ins is subtracted first, so it isn't blamed on the maintenance.
- **Grind offsets are exact values, not percentages.** Dial numbers have an arbitrary zero, and a re-zero or worn burrs move the gap by the same amount at every setting, so a percentage would overcorrect coarse recipes and undercorrect fine ones. The offset is a shift in grinder units (e.g. -3), plus a stretch factor that stays 1 until two or more coffees are re-dialed after the same event (needed when new burrs of a different design change what each step means). Once the user confirms a re-dial, the offset is stored on the event: it's a user decision, kept stable and editable.
- **Run-out prediction uses facts, not stored estimates.** Inputs: portion weights (including frozen stock), doses from logged shots, when portions were finished, optional stock checks (weighing what's left) and purchase dates. The one-tap "Pull This Shot" must record an extraction, or daily use is invisible. Finished portions give each household's real usage rate and how much of it logging captures.
- **Calculated, never stored:** remaining weight, bag status (open, finished), bean age, usage rate, and drift adjustments.
- **Shot time is stored in milliseconds** and shown in seconds with one decimal, like a scale timer.
- **Temperature and pressure are optional and follow the machine.** Canonical hardware declares each machine's control: none (fixed), steps (e.g. 1-3), exact (a PID or adjustable pressure), or manual (lever, paddle, valve; peak pressure only if there's a gauge). Fields only appear when the machine can set them. Shots and recipes store either an exact value (°C, bar) or a step number, never one column whose meaning depends on the machine, so swapping machines can't reinterpret old shots. Pressure profiles (a curve per shot) come later.

- **Households own the kitchen; users are logins.** Modeled on Netflix profiles first, then Spotify Family: the household owns pantry, hardware, setups and personas, and users join through membership. Rollout: MVP, one user and one household created silently at sign-up; phase 2, sub personas (profiles without their own login, managed by a household member); phase 3, invites, so the person behind a sub persona signs in and claims it as their main persona, with its history. Only the UI changes between phases.
- **Shots record whose taste and who logged them.** One person often pulls for both, so the persona (whose taste) and the logging user (who tapped) are separate fields.
- **The network needs the person's own consent.** A persona's shots reach the Cold Start network only when the persona is claimed by a user who opted in. Logging for someone without their own login never shares their data.

- **Accounts use Firebase from day one, with no sign-in screen in the MVP.** Firebase anonymous sign-in gives each device an account; the user record stores its Firebase ID. When Google sign-in arrives, Firebase links it to the same account, so no data moves.
- **A shared catalog: makers and models, roasters and beans.** Hardware is a maker (with its ID) and a model (with its ID); coffee is a roaster and a bean. The catalog starts from a curated seed list. If something is missing, a household can add it, with a link to the product page; user additions start unverified. Modeled on Untappd: duplicates are merged into a surviving entry, never deleted, and anything that referenced the duplicate follows the merge. Every merge is logged.
- **URLs and names are evidence, not identity.** The same product is often sold under regional names and pages (Sage in the UK, Breville in the US), so each catalog entry can have many URLs (one per market) and many aliases. The MVP flags exact matches on a normalised URL. Later, an LLM suggests likely duplicates with a confidence and a reason, and a person or a reviewed rule always confirms the merge. That matcher ships with evals: known duplicates, and look-alikes that must not merge.
- **Drink types are a starter list each household can edit.** New households get Espresso, Ristretto, Lungo, Americano, Cortado, Flat white, Cappuccino, Latte and Macchiato, and can rename, hide or add. Sugar or syrup is a "sweetened" mark on the shot, not a drink type.
- **The default persona has no stored name.** Until renamed, it shows a translated role label (e.g. "Me"), so no personal data is needed to start.
- **One-tap shots are recorded but marked as unmeasured.** "Pull This Shot" copies the pinned recipe's values into a shot marked one-tap. It uses the persona selected on the home screen and, in the MVP, the drink that persona last made at this time of day; the recipe's setup; and the earliest-opened open portion of that bean (asking if none is open). With no pinned recipe, the button becomes "Dial in". No rating is asked: silence counts as a weak "fine", and an optional quick reaction (good or off) turns an off shot into a normal pre-filled log. Undo is possible for a few seconds, and editing afterwards. One-tap shots count toward coffee used, but are never treated as measurements and never reach the network.
- **Unverified catalog entries stay private until verified.** A maker, model, roaster or bean a household adds is visible only to that household. Until the Later merge tooling exists, verification and merges are a manual admin task.
- **Google sign-in comes first after the MVP.** An anonymous account lives on one device, so a lost or reset device loses its data until it's linked to Google. Browsers can also clear it: Safari on iOS may delete a site's storage after a period without use, which would silently start a new, empty household. Linking ships as the first Next item, ahead of invites. The MVP explicitly accepts both risks for a prototype.
- **A setup is a fixed combination of the parts that change the recipe.** For espresso that's the machine, the grinder and the basket: swap any of them and the old recipe no longer applies. Each is a specific product from the catalog (maker and model), not a category: a Normcore 18 g basket and a Crema Coffee 18 g basket are different baskets and make different setups. Setups never change: replacing, adding or removing one of these parts means a different setup, and using the same combination again reuses its existing setup, with its recipes. Recipes belong to exactly one setup; on a new setup, Dial in starts pre-filled from the recipe on the closest previous setup (most parts in common), never as a one-tap pull. There's no "retire" action in the MVP. Servicing a part (new burrs, cleaning) is a maintenance event on that part, not a new setup. Things that don't change the recipe aren't setup parts: a scale, the portafilter (spouted or bottomless doesn't change what happens in the puck) and the tamper aren't tracked. Water may be added later.
- **Puck prep is recorded as checkboxes, not parts.** A WDT (distribution) tool and a puck screen mostly reduce channelling and make shots more repeatable; whether they were used matters, their brand very likely doesn't. Shots and recipes record `usedWdt` and `usedPuckScreen`; a one-tap pull copies them from the recipe. If data later shows a prep tool's brand matters, it can be promoted to a setup part.
- **Recent shots are visible in the MVP.** A simple list of recent shots lets users find and edit a shot, including one-tap shots after the fact.
- **Maintenance events are recorded from Phase 1.** Logging them is small and splits grind history correctly from day one; using them for grind offsets comes later.

- **Technical decisions from the tech-lead review (TQ-01 to TQ-07).**
  - *Sign-in reaches the server through a session cookie.* The browser signs in to Firebase anonymously, sends its Firebase ID token once to the server, which verifies it with the Firebase Admin SDK and sets an httpOnly session cookie. Firebase keys live outside the public repo.
  - *One libSQL client on the server.* Server code talks to the database directly; a deployed prototype uses hosted libSQL (Turso) instead of the local file.
  - *Timestamps are integer milliseconds* (`timestamp_ms`), like shot time.
  - *Server Actions for writes;* Route Handlers only for the session exchange, catalog search and the duplicate-link check.
  - *Recalibration is a flag* on a maintenance event (`is_recalibration`), not an event kind.
  - *"Not sure" capabilities* are stored as unknown values in the capabilities JSON (see S-08).
  - *Local days use the device's time zone,* sent in a cookie, for "today", grouping by day, the time-of-day drink and bean age. Nothing is stored for it.

Still open: whether pinning a better recipe updates the bag's override or the bean's default.

## S-03 The North Star Vision & UVP

**The Vision:** To build the definitive context-aware operating system for the specialty coffee ritual. Tare eliminates the "Cold Start" waste of dialing in espresso by transforming single-player brewing diaries into a dynamic, predictive network matched to the user’s exact hardware and personal palate.

**Unique Value Proposition (UVP):** "The only coffee journal that actually knows your setup and your taste. Stop guessing, start brewing."

## S-04 Core Product Architecture & Ontology

The system is built on a highly structured, real-world physical hierarchy to allow for frictionless, "smart default" daily use.

### The Entity Hierarchy

- **Household (The Tenant):** Owns everything shared in the kitchen: pantry, hardware, setups, personas and recipes. Users sign in with Google and belong to a household through membership. The MVP creates one household per user at sign-up and never shows it.
- **Personas:** Taste profiles for the different people a household brews for, each with its own taste graph. Two types:
  - **Main persona:** a person's own profile, linked to their login. Every login has exactly one.
  - **Sub persona:** a profile with no login of its own, e.g. a partner or a regular guest that a household member brews for. When that person signs up and joins the household, they claim the sub persona, which becomes their main persona and keeps its history.

  The type is not stored: a persona is a main persona when it's linked to a login. Who logs a shot and whose taste it records are separate: one person often pulls for both.
- **Setups (Hardware Groups):** Instead of selecting individual machines daily, hardware is grouped. (e.g., an espresso setup = machine + grinder + basket.) A setup is a fixed combination: changing any of its parts makes a different setup, and recipes belong to one setup. Puck prep (WDT, puck screen) is recorded per shot as checkboxes. Each part is a unit the household owns, pointing to a canonical model that declares what it can control (e.g. a machine's temperature: none, steps or exact; a grinder's scale and which direction is coarser). Only parts that change the recipe belong in a setup.
- **The Pantry (Batches and Portions):** Separates the Canonical Bean (the global product) from the User Batch (the bag as bought: roast date, lot, weight). A batch holds one or more Portions, the physical containers on the counter or in the freezer, so a 1 kg bag split into a fresh and a frozen half stays one batch.
- **Drink Type:** The target output, from a starter list each household can edit (Espresso, Cortado, Flat white, Cappuccino, Latte and more). Additives like sugar are a "sweetened" mark on the shot.
- **The Catalog:** Shared, canonical lists of hardware (maker, then model) and coffee (roaster, then bean). Households can add missing entries with a product link; duplicates are merged, never deleted.
- **The Pinned Recipe:** The exact extraction parameters locked in at the intersection of a Persona, Setup, Drink Type, and Canonical Bean. A recipe can optionally be pinned for one specific Batch, overriding the bean's default for that bag. Day-to-day drift (bean age, the batch's own character, setup maintenance) is calculated from logged shots on top of the pinned recipe, not stored.
- **Maintenance Events:** Dated work on one owned unit (new burrs, cleaning, re-zero, repair). For a grinder, each event starts a new grind period; shots on either side are not directly comparable.

## S-05 Algorithmic Intelligence & Data Trust

### A. The "Cold Start" Baseline & Temporal Anchoring

To prevent algorithmic drift caused by aging beans, the global Cold Start baseline relies on a Freshness Anchor (T=0). When a user scans a new bag, the suggested starting variables are calculated strictly using community extractions logged within the first 7 days of that batch being opened.

### B. Data Tiering & Trust Scores

To protect the global network from incomplete or novice data, telemetry is tiered:

- **Tier 1 (Private/Local):** Partial logs. Saves locally for the user, but `is_network_eligible: false`.
- **Tier 2 (The Network):** Requires the Minimum Viable Payload (MVPayload): Grind Size, Dose, Yield, Time.
- **Trust Weights:** Recipes are weighted by contributor levels (Enthusiast vs. Verified Pro).

### C. Palate Alignment (The Taste Graph Match)

Technical perfection does not equal subjective preference. When displaying a Cold Start recipe from a Verified Pro, the system cross-references the Pro's target flavor profile with the user's historical preferences.

**Output:** If the Pro optimizes for bright acidity but the user prefers chocolate/heavy body, the UI surfaces a Match Score Warning and the AI Coach suggests an automatic variable translation to push the Pro's recipe toward the user's palate.

## S-06 UX/UI Philosophy: The Frictionless Ritual

The interface follows a modern, digital Japandi aesthetic (clean, minimalist, progressive disclosure).

- **Zero-Form Onboarding:** No long preference surveys. The system derives the user's taste graph implicitly through behavioral logging.
- **The Daily Driver (Exploitation):** The home screen defaults to the Pinned Recipe for the active Persona and time-of-day Drink Type. Brewing the daily standard requires exactly zero variable inputs and one tap (`[ Pull This Shot ]`).
- **Exception-Based Logging:** Users do not log every successful shot. They only interact with the extraction UI when dialing in a new bag, or when a shot goes wrong (e.g., due to bean aging), at which point the app pre-fills the Pinned Recipe variables for a quick micro-adjustment.
- **Tactile Inputs:** Large, draggable number wheels/scrubbers for variables. No tiny text keyboards.

## S-07 Privacy, GDPR & Localization (i18n)

- **Consent:** Explicit opt-in required to push anonymized telemetry to the global Cold Start network. Consent is personal: a persona's shots reach the network only once that person has their own login and has opted in, regardless of who logged them.
- **Decoupling:** Network extractions strip PII and use cohort IDs.
- **Localization:** No hardcoded strings. UI respects European vs. US numerical formatting (comma vs. decimal) while saving canonical floats to the database. RTL-ready logical CSS properties (Tailwind).

## S-08 The Database Schema (Drizzle ORM / SQLite)

Instructions for the coding agent: Implement this relational schema to support the Stateful Hardware Ledger, Setups, Batches, and Pinned Recipes.

```ts
import { sqliteTable, text, integer, real, primaryKey, uniqueIndex, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

// --- CANONICAL CATALOG ---
// Two shared catalogs, each a parent and a product: hardware makers -> hardware models,
// and roasters -> beans. Every catalog row follows the same rules:
// - source: 'seed' (curated list) or 'user' (added by a household; needs a product URL)
// - status: 'verified' or 'unverified' (user additions start unverified until reviewed)
// - mergedIntoId: duplicates are merged, never deleted. Anything that references a
//   merged row follows the pointer to the surviving one (the system override).
// Regional URLs and names live in catalogUrls and catalogAliases, so "Sage Bambino"
// (UK) and "Breville Bambino" (US) are one model with two names and two URLs.

export const hardwareMakers = sqliteTable('hardware_makers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  source: text('source').notNull(), // 'seed', 'user'
  status: text('status').notNull(), // 'verified', 'unverified'
  mergedIntoId: text('merged_into_id').references((): AnySQLiteColumn => hardwareMakers.id),
  createdByHouseholdId: text('created_by_household_id').references(() => households.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const roasters = sqliteTable('roasters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  source: text('source').notNull(),
  status: text('status').notNull(),
  mergedIntoId: text('merged_into_id').references((): AnySQLiteColumn => roasters.id),
  createdByHouseholdId: text('created_by_household_id').references(() => households.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const canonicalBeans = sqliteTable('canonical_beans', {
  id: text('id').primaryKey(),
  roasterId: text('roaster_id').references(() => roasters.id).notNull(),
  name: text('name').notNull(),
  roastLevel: text('roast_level'),
  tastingNotes: text('tasting_notes', { mode: 'json' }),
  source: text('source').notNull(),
  status: text('status').notNull(),
  mergedIntoId: text('merged_into_id').references((): AnySQLiteColumn => canonicalBeans.id),
  createdByHouseholdId: text('created_by_household_id').references(() => households.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// Machines, grinders, baskets and accessories, with what each can control.
// capabilities (JSON), for machines:
//   temperature: { control: 'none' }
//              | { control: 'steps', count: 3 }                     // e.g. a 1-3 setting
//              | { control: 'exact', unit: 'C' | 'F', min, max, step }
//   pressure:    { control: 'none' | 'manual', gauge: boolean }    // fixed, or lever/paddle/valve
//              | { control: 'steps', count: n }
//              | { control: 'exact', min, max, step }               // bar
// for grinders:
//   grind: { type: 'stepped' | 'stepless', min, max, step, coarser: 'higher' | 'lower' }
//   (`coarser` turns advice like "grind finer" into the right direction on the dial)
// "Not sure" (household-added models only; seeded rows never use it):
//   temperature/pressure: { control: 'unknown' }; a manual machine's gauge: null;
//   counts, units, min, max and step: null; grind: { type: 'unknown', ..., coarser: 'unknown' }
// A hardware model (the catalog row), not a unit someone owns; see ownedHardware.
export const canonicalHardware = sqliteTable('canonical_hardware', {
  id: text('id').primaryKey(),
  makerId: text('maker_id').references(() => hardwareMakers.id).notNull(),
  // Only the kinds that define a setup. Portafilters, tampers, scales and prep tools aren't
  // tracked as hardware; WDT and puck screen use are checkboxes on shots and recipes.
  kind: text('kind').notNull(), // 'machine', 'grinder', 'basket'
  name: text('name').notNull(), // Model name, e.g. "Bambino"
  capabilities: text('capabilities', { mode: 'json' }),
  source: text('source').notNull(),
  status: text('status').notNull(),
  mergedIntoId: text('merged_into_id').references((): AnySQLiteColumn => canonicalHardware.id),
  createdByHouseholdId: text('created_by_household_id').references(() => households.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// Product pages, one row per market. A catalog row can have many (UK and US pages).
// entityType + entityId point at a maker, model, roaster or bean (not FK-enforced).
// normalizedUrl strips regional path segments and tracking parameters: an exact match
// on it flags a likely duplicate in the MVP. Later, an LLM suggests fuzzier matches
// (names, regional pages, page content) with a confidence and a reason; a person or a
// reviewed rule always confirms the merge. That matcher ships with an eval set of known
// duplicates and known look-alikes that must not merge.
export const catalogUrls = sqliteTable('catalog_urls', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(), // 'maker', 'model', 'roaster', 'bean'
  entityId: text('entity_id').notNull(),
  url: text('url').notNull(),
  normalizedUrl: text('normalized_url').notNull(),
  market: text('market'), // e.g. 'GB', 'US'; null if global
  addedByHouseholdId: text('added_by_household_id').references(() => households.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// Other names for the same catalog row, usually regional ("Sage" for "Breville" in the UK).
// Search matches any alias.
export const catalogAliases = sqliteTable('catalog_aliases', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  name: text('name').notNull(),
  market: text('market'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// Audit trail of merges: who or what suggested it and who confirmed it.
export const catalogMerges = sqliteTable('catalog_merges', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  fromId: text('from_id').notNull(), // The duplicate, which keeps existing as a pointer
  intoId: text('into_id').notNull(), // The surviving row
  suggestedBy: text('suggested_by').notNull(), // 'url-match', 'llm', 'user', 'reviewer'
  confidence: real('confidence'), // 0-1, for automated suggestions
  reason: text('reason'),
  decidedAt: integer('decided_at', { mode: 'timestamp_ms' }).notNull(),
});

// A login: one person. Consent is personal, so it lives here.
// MVP: Firebase anonymous sign-in gives each device a Firebase account without a sign-in
// screen. When Google sign-in arrives, Firebase links it to the same account, so
// firebaseUid and all data stay as they are.
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  firebaseUid: text('firebase_uid').notNull().unique(), // The Firebase account
  shareDataConsent: integer('share_data_consent', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// --- TENANT HIERARCHY ---
// The household owns everything shared in the kitchen: pantry, hardware, setups,
// personas and their recipes. The MVP creates one household per user at sign-up.
export const households = sqliteTable('households', {
  id: text('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// Which logins belong to which household. One row in the MVP; invites add rows later.
export const householdMembers = sqliteTable('household_members', {
  householdId: text('household_id').references(() => households.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  role: text('role').notNull(), // 'owner', 'member'
  joinedAt: integer('joined_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => [primaryKey({ columns: [t.householdId, t.userId] })]);

// A taste profile. userId is null for a persona without its own login (phase 2);
// it's set when that person signs up and claims the persona, keeping its history.
export const personas = sqliteTable('personas', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  userId: text('user_id').references(() => users.id), // The login that claimed it, if any
  name: text('name'), // Null = show the translated role label (e.g. "Me"); user can rename
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
});

// Drinks a household makes. Each new household gets the starter list (Espresso,
// Ristretto, Lungo, Americano, Cortado, Flat white, Cappuccino, Latte, Macchiato) as its
// own rows, which it can rename, hide or add to. Starter rows use nameKey so they are
// translated; a renamed or added drink stores its own name.
export const drinkTypes = sqliteTable('drink_types', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  nameKey: text('name_key'), // i18n key for starter drinks, e.g. 'drinks.latte'
  name: text('name'), // Set when renamed or custom; overrides nameKey
  hasMilk: integer('has_milk', { mode: 'boolean' }).notNull(),
  hidden: integer('hidden', { mode: 'boolean' }).default(false),
  sortOrder: integer('sort_order').notNull(),
});

// The physical units a household owns. Maintenance and grind history belong to a unit,
// not to the model (every Niche Zero) or to a setup (one grinder can be in several).
export const ownedHardware = sqliteTable('owned_hardware', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  hardwareId: text('hardware_id').references(() => canonicalHardware.id).notNull(), // The model
  nickname: text('nickname'),
  acquiredAt: integer('acquired_at', { mode: 'timestamp_ms' }),
  retiredAt: integer('retired_at', { mode: 'timestamp_ms' }), // Not used in the MVP (no retire action)
});

// A setup: a fixed combination of owned parts. Setups never change;
// any different combination is a different setup. partsKey is the sorted list of part
// IDs, unique per household, so using the same combination again finds the same setup
// (and its recipes) instead of creating a new one.
export const setups = sqliteTable('setups', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  partsKey: text('parts_key').notNull(), // Sorted ownedHardware IDs, joined
  name: text('name'), // Optional; otherwise shown by its parts or a translated default
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => [uniqueIndex('setups_household_parts').on(t.householdId, t.partsKey)]);

export const setupParts = sqliteTable('setup_parts', {
  setupId: text('setup_id').references(() => setups.id).notNull(),
  ownedHardwareId: text('owned_hardware_id').references(() => ownedHardware.id).notNull(),
}, (t) => [primaryKey({ columns: [t.setupId, t.ownedHardwareId] })]);

// Maintenance on one owned unit. For a grinder, each event starts a new grind period:
// shots either side aren't directly comparable. Once the user finalises a re-dial after
// the event, the confirmed shift is stored here (a user decision, so it is kept rather
// than recalculated). Grind in the new period = old grind x grindScale + grindShift.
// Stored recipes are never rewritten; the mapping is applied when reading.
export const maintenanceEvents = sqliteTable('maintenance_events', {
  id: text('id').primaryKey(),
  ownedHardwareId: text('owned_hardware_id').references(() => ownedHardware.id).notNull(),
  kind: text('kind').notNull(), // 'burrs', 'clean', 'rezero', 'repair', 'other'
  isRecalibration: integer('is_recalibration', { mode: 'boolean' }).notNull().default(false), // The user marked a recalibration
  note: text('note'),
  occurredAt: integer('occurred_at', { mode: 'timestamp_ms' }).notNull(),
  grindShift: real('grind_shift'), // Grinder units; set when a re-dial is confirmed
  grindScale: real('grind_scale'), // Stretch factor; 1 unless 2+ coffees were re-dialed
  offsetSourceRecipeId: text('offset_source_recipe_id').references(() => pinnedRecipes.id), // The re-dial it came from
});

// --- PANTRY ---
// The bag as bought. Status, remaining weight and bean age are calculated, not stored.
export const batches = sqliteTable('batches', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  beanId: text('bean_id').references(() => canonicalBeans.id).notNull(),
  lotCode: text('lot_code'), // Roaster's lot, if printed on the bag
  roastDate: integer('roast_date', { mode: 'timestamp_ms' }), // Null if not printed
  packedAt: integer('packed_at', { mode: 'timestamp_ms' }), // Packing date, when printed instead of a roast date
  bestBefore: integer('best_before', { mode: 'timestamp_ms' }),
  bagWeight: real('bag_weight').notNull(), // Grams, as bought
  purchasedAt: integer('purchased_at', { mode: 'timestamp_ms' }), // For reorder timing
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// What physically exists: a whole bag is one portion; splitting to freeze creates more.
export const batchPortions = sqliteTable('batch_portions', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').references(() => batches.id).notNull(),
  weight: real('weight').notNull(), // Grams
  frozenAt: integer('frozen_at', { mode: 'timestamp_ms' }),
  thawedAt: integer('thawed_at', { mode: 'timestamp_ms' }),
  openedAt: integer('opened_at', { mode: 'timestamp_ms' }),
  finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// Optional: the user weighs what's left, correcting the run-out estimate.
export const stockChecks = sqliteTable('stock_checks', {
  id: text('id').primaryKey(),
  portionId: text('portion_id').references(() => batchPortions.id).notNull(),
  remainingWeight: real('remaining_weight').notNull(), // Grams
  checkedAt: integer('checked_at', { mode: 'timestamp_ms' }).notNull(),
});

// --- TELEMETRY & EXTRACTIONS ---
export const extractions = sqliteTable('extractions', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  personaId: text('persona_id').references(() => personas.id).notNull(), // Whose taste it records
  loggedByUserId: text('logged_by_user_id').references(() => users.id).notNull(), // Who tapped; often not the persona
  setupId: text('setup_id').references(() => setups.id).notNull(),
  portionId: text('portion_id').references(() => batchPortions.id).notNull(), // Batch and bean follow from the portion
  drinkTypeId: text('drink_type_id').references(() => drinkTypes.id).notNull(),
  sweetened: integer('sweetened', { mode: 'boolean' }).default(false), // Sugar or syrup added
  // 'measured': values entered or confirmed at the machine.
  // 'one-tap': "Pull This Shot" copied the pinned recipe; nothing was measured. One-tap
  // shots count for coffee used and as "the recipe was fine", but drift detection and
  // palate learning must not treat their values as measurements.
  entryMode: text('entry_mode').notNull(), // 'measured', 'one-tap'

  // MVPayload
  grindSize: real('grind_size').notNull(),
  doseWeight: real('dose_weight').notNull(),
  yieldWeight: real('yield_weight').notNull(),
  yieldTime: integer('yield_time').notNull(), // milliseconds; shown as seconds with one decimal

  // Optional, only when the machine can set them. At most one of each pair is filled,
  // matching the machine's capability; steps are never converted to °C or bar.
  brewTempC: real('brew_temp_c'), // Exact temperature, always stored in °C
  brewTempStep: integer('brew_temp_step'), // Stepped setting, e.g. 2 on a 1-3 dial
  pressureBar: real('pressure_bar'), // Exact setting, or peak gauge reading on manual machines
  pressureStep: integer('pressure_step'), // Stepped setting

  // Puck prep, as checkboxes (brand isn't recorded); a one-tap pull copies them from the recipe.
  usedWdt: integer('used_wdt', { mode: 'boolean' }).notNull().default(false),
  usedPuckScreen: integer('used_puck_screen', { mode: 'boolean' }).notNull().default(false),

  // Sensory outputs (1-5) & Diagnostics
  reaction: text('reaction'), // Optional quick reaction after a one-tap shot: 'good', 'off'
  userRating: integer('user_rating'), // 1-5 overall
  scoreSweetness: integer('score_sweetness'),
  scoreAcidity: integer('score_acidity'),
  scoreBitterness: integer('score_bitterness'),
  scoreBody: integer('score_body'),
  defects: text('defects', { mode: 'json' }),

  // True only for a measured shot with the full MVPayload and a persona claimed by a user
  // who opted in. One-tap shots never reach the network.
  // A persona without its own login never reaches the network, whoever logged the shot.
  isNetworkEligible: integer('is_network_eligible', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

// --- RECIPES ---
// Pinned per bean, persona, setup and drink type. A set batchId overrides the
// bean's default for that one bag. Re-pinning adds a row; the latest pinnedAt wins.
export const pinnedRecipes = sqliteTable('pinned_recipes', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  beanId: text('bean_id').references(() => canonicalBeans.id).notNull(),
  personaId: text('persona_id').references(() => personas.id).notNull(),
  setupId: text('setup_id').references(() => setups.id).notNull(),
  drinkTypeId: text('drink_type_id').references(() => drinkTypes.id).notNull(),
  batchId: text('batch_id').references(() => batches.id), // Null = the bean's default

  grindSize: real('grind_size').notNull(),
  doseWeight: real('dose_weight').notNull(),
  yieldWeight: real('yield_weight').notNull(),
  yieldTime: integer('yield_time').notNull(), // Milliseconds
  brewTempC: real('brew_temp_c'), // Same optional pairs as extractions
  brewTempStep: integer('brew_temp_step'),
  pressureBar: real('pressure_bar'),
  pressureStep: integer('pressure_step'),
  usedWdt: integer('used_wdt', { mode: 'boolean' }).notNull().default(false), // Same puck prep checkboxes as shots
  usedPuckScreen: integer('used_puck_screen', { mode: 'boolean' }).notNull().default(false),

  sourceExtractionId: text('source_extraction_id').references(() => extractions.id), // The shot it came from, if any
  pinnedAt: integer('pinned_at', { mode: 'timestamp_ms' }).notNull(),
});
```

## S-09 Core GenAI System Prompts

### Prompt 1: The Vision Scanner (Gemini Flash)

**Objective:** Ingest unstructured images of coffee bags to eliminate manual entry.

```text
You are a highly precise data-extraction engine for specialty coffee. 
The user will provide an image of a coffee bag label.
Extract the metadata and return it STRICTLY as JSON. No markdown, no conversational text.

Rules:
1. "roastLevel" must be exactly one of: ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"].
2. "tastingNotes" must be an array of title-cased strings (max 4).
3. If a field is not present, return null. Do not guess.

Schema:
{
  "roaster": "string",
  "name": "string",
  "roastLevel": "string | null",
  "tastingNotes": ["string"]
}
```

### Prompt 2: The Diagnostic Coach (Gemini Pro)

**Objective:** Translate sensory defects into precise physical hardware adjustments based on the user's active Setup.

```text
You are a master barista diagnostic engine. Analyze the extraction data, Setup components, and sensory ratings to provide a concise hardware adjustment. Output ONLY JSON.

Inputs Provided:
1. MVPayload Variables (Dose, Yield, Time, Grind).
2. Setup parts and puck prep (e.g., Bambino Pro, Niche Zero, 18 g basket; WDT and puck screen used or not).
3. Sensory Scores & Tagged Defects.
4. Days since batch opened (Bean Aging context).

Rules:
- High Acidity + Fast Time = Under-extracted. Action: Grind finer.
- High Bitterness + Slow Time = Over-extracted. Action: Grind coarser.
- If Channelling is tagged and no WDT was used, suggest using a WDT.
- If days_open > 14 and shot is fast, attribute to degassing (pressure loss).

Schema:
{
  "diagnosis": "string", // 4-7 word explanation (e.g., "Fast and under-extracted due to degassing.")
  "action": "string", // Concise instruction (e.g., "Grind 1 step finer on the Niche Zero.")
  "suggested_variables": { "grind_delta": "number", "dose": "number", "yield": "number" }
}
```

### Prompt 3: PM Operations Eval Harness (LLM-as-a-Judge)

**Objective:** Automated regression testing script (`npm run eval`) evaluating the Diagnostic Coach against a Golden Dataset.

```text
You are an expert AI evaluator running automated regression tests.
Compare the 'Generated Advice' against the 'Ground Truth Scenario'.
Score from 1 to 5 on three metrics. Output ONLY JSON.

Metrics:
1. Safety: Is the physical advice possible? (Dose/basket ratios).
2. Science Accuracy: Does the advice adhere to SCA extraction theory?
3. Palate Alignment: Did the AI correctly translate the variables to match the Persona's taste graph?

Schema:
{
  "scores": { "safety": "number", "accuracy": "number", "alignment": "number" },
  "pass": "boolean", // True if all >= 4
  "reasoning": "string"
}
```
