# Tare: The Hardware-Aware Coffee Journal

Master Product & Engineering Specification

> The updates below are newer than the rest of this spec. Where they differ,
> the updates win.

## S-01 Updates (October 2026)

- Target user: everyday home enthusiasts, not semi-pros. Goal: great coffee from every new bag, in fewer shots, tuned to your palate.
- Core differentiators: palate learning and drift-aware dial-in.
- Grind size doesn't transfer between grinders or over time. Treat it as a personal offset per grinder, give more weight to recent shots, and let users mark a recalibration.
- Roadmap: Phase 1 is a basic app for logging shots and managing recipes, toolkits and the pantry. AI features come later, each with evals and observability. RAG will ground the Diagnostic Coach in extraction guides and equipment manuals.
- Design: Inter, thin weights at large sizes, regular weight for small labels. Monochrome warm grey palette with one muted colour for shot warnings.

## S-02 Data model decisions (October 2026)

Agreed while reviewing the schema in S-08, which already reflects them.

- **Recipes belong to the bean.** A pinned recipe is scoped to bean, persona, toolkit and drink context, so a new bag of the same coffee starts from what was learned before. An optional batch override handles a bag that behaves differently.
- **Batches hold portions.** The batch is the bag as bought (bean, roaster's lot code, roast date, best-before, bag weight, purchase date). Portions are what physically exists: their weight and when each was frozen, thawed, opened and finished. Shots are logged against a portion. Splitting a bag never duplicates roast date or lot.
- **Freezing pauses aging.** Bean age runs from the roast date (best-before as a fallback when no roast date is printed), minus time in the freezer. A shot ground straight from frozen beans is identifiable from the dates alone.
- **Grind is relative to one grinder and one maintenance period.** A grind value only means something together with the physical grinder (an owned unit, not the model) and the period since its last maintenance event (burrs, cleaning, re-zero). Shots and recipes record the grinder and machine units directly, so later toolkit changes can't rewrite history. After maintenance, the user re-dials one coffee; the difference becomes the period's offset and is applied, when reading, to every recipe pinned on that grinder before the event. Bean aging between the two dial-ins is subtracted first, so it isn't blamed on the maintenance.
- **Grind offsets are exact values, not percentages.** Dial numbers have an arbitrary zero, and a re-zero or worn burrs move the gap by the same amount at every setting, so a percentage would overcorrect coarse recipes and undercorrect fine ones. The offset is a shift in grinder units (e.g. -3), plus a stretch factor that stays 1 until two or more coffees are re-dialed after the same event (needed when new burrs of a different design change what each step means). Once the user confirms a re-dial, the offset is stored on the event: it's a user decision, kept stable and editable.
- **Run-out prediction uses facts, not stored estimates.** Inputs: portion weights (including frozen stock), doses from logged shots, when portions were finished, optional stock checks (weighing what's left) and purchase dates. The one-tap "Pull This Shot" must record an extraction, or daily use is invisible. Finished portions give each household's real usage rate and how much of it logging captures.
- **Calculated, never stored:** remaining weight, bag status (open, finished), bean age, usage rate, and drift adjustments.
- **Shot time is stored in milliseconds** and shown in seconds with one decimal, like a scale timer.
- **Temperature and pressure are optional and follow the machine.** Canonical hardware declares each machine's control: none (fixed), steps (e.g. 1-3), exact (a PID or adjustable pressure), or manual (lever, paddle, valve; peak pressure only if there's a gauge). Fields only appear when the machine can set them. Shots and recipes store either an exact value (°C, bar) or a step number, never one column whose meaning depends on the machine, so swapping machines can't reinterpret old shots. Pressure profiles (a curve per shot) come later.

- **Households own the kitchen; users are logins.** Modeled on Netflix profiles first, then Spotify Family: the household owns pantry, hardware, toolkits and personas, and users join through membership. Rollout: MVP, one user and one household created silently at sign-up; phase 2, personas without their own login ([name] as a persona on [name]'s account); phase 3, invites, so [name] signs in and claims her persona with its history. Only the UI changes between phases.
- **Shots record whose taste and who logged them.** One person often pulls for both, so the persona (whose taste) and the logging user (who tapped) are separate fields.
- **The network needs the person's own consent.** A persona's shots reach the Cold Start network only when the persona is claimed by a user who opted in. Logging for someone without their own login never shares their data.

Still open: timestamp precision (seconds or milliseconds), and whether pinning a better recipe updates the bag's override or the bean's default.

## S-03 The North Star Vision & UVP

**The Vision:** To build the definitive context-aware operating system for the specialty coffee ritual. Tare eliminates the "Cold Start" waste of dialing in espresso by transforming single-player brewing diaries into a dynamic, predictive network matched to the user’s exact hardware and personal palate.

**Unique Value Proposition (UVP):** "The only coffee journal that actually knows your setup and your taste. Stop guessing, start brewing."

## S-04 Core Product Architecture & Ontology

The system is built on a highly structured, real-world physical hierarchy to allow for frictionless, "smart default" daily use.

### The Entity Hierarchy

- **Household (The Tenant):** Owns everything shared in the kitchen: pantry, hardware, toolkits, personas and recipes. Users sign in with Google and belong to a household through membership. The MVP creates one household per user at sign-up and never shows it.
- **Personas:** Sub-profiles for different consumers (e.g., "[name]", "[name]") to isolate taste graphs. A persona can exist without its own login and be claimed later when that person signs up. Who logs a shot and whose taste it records are separate: one person often pulls for both.
- **Toolkits (Hardware Groups):** Instead of selecting individual machines daily, hardware is grouped. (e.g., Daily Espresso Toolkit = Bambino Pro + Niche Zero + IMS 18g Basket + WDT). Each component is a unit the household owns, pointing to a canonical model that declares what it can control (e.g. a machine's temperature: none, steps or exact; a grinder's scale and which direction is coarser).
- **The Pantry (Batches and Portions):** Separates the Canonical Bean (the global product) from the User Batch (the bag as bought: roast date, lot, weight). A batch holds one or more Portions, the physical containers on the counter or in the freezer, so a 1 kg bag split into a fresh and a frozen half stays one batch.
- **Drink Context:** The target output (Espresso, Milk Drink, Additives like Sugar).
- **The Pinned Recipe:** The exact extraction parameters locked in at the intersection of a Persona, Toolkit, Drink Context, and Canonical Bean. A recipe can optionally be pinned for one specific Batch, overriding the bean's default for that bag. Day-to-day drift (bean age, the batch's own character, kit maintenance) is calculated from logged shots on top of the pinned recipe, not stored.
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
- **The Daily Driver (Exploitation):** The home screen defaults to the Pinned Recipe for the active Persona and time-of-day Drink Context. Brewing the daily standard requires exactly zero variable inputs and one tap (`[ Pull This Shot ]`).
- **Exception-Based Logging:** Users do not log every successful shot. They only interact with the extraction UI when dialing in a new bag, or when a shot goes wrong (e.g., due to bean aging), at which point the app pre-fills the Pinned Recipe variables for a quick micro-adjustment.
- **Tactile Inputs:** Large, draggable number wheels/scrubbers for variables. No tiny text keyboards.

## S-07 Privacy, GDPR & Localization (i18n)

- **Consent:** Explicit opt-in required to push anonymized telemetry to the global Cold Start network. Consent is personal: a persona's shots reach the network only once that person has their own login and has opted in, regardless of who logged them.
- **Decoupling:** Network extractions strip PII and use cohort IDs.
- **Localization:** No hardcoded strings. UI respects European vs. US numerical formatting (comma vs. decimal) while saving canonical floats to the database. RTL-ready logical CSS properties (Tailwind).

## S-08 The Database Schema (Drizzle ORM / SQLite)

Instructions for the coding agent: Implement this relational schema to support the Stateful Hardware Ledger, Toolkits, Batches, and Pinned Recipes.

```ts
import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

// --- CANONICAL & GLOBAL ---
export const canonicalBeans = sqliteTable('canonical_beans', {
  id: text('id').primaryKey(),
  roaster: text('roaster').notNull(),
  name: text('name').notNull(),
  roastLevel: text('roast_level'),
  tastingNotes: text('tasting_notes', { mode: 'json' }),
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
export const canonicalHardware = sqliteTable('canonical_hardware', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(), // 'machine', 'grinder', 'basket', 'accessory'
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  capabilities: text('capabilities', { mode: 'json' }),
});

// A login: one person with a Google account. Consent is personal, so it lives here.
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Auth UUID
  shareDataConsent: integer('share_data_consent', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// --- TENANT HIERARCHY ---
// The household owns everything shared in the kitchen: pantry, hardware, toolkits,
// personas and their recipes. The MVP creates one household per user at sign-up.
export const households = sqliteTable('households', {
  id: text('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Which logins belong to which household. One row in the MVP; invites add rows later.
export const householdMembers = sqliteTable('household_members', {
  householdId: text('household_id').references(() => households.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  role: text('role').notNull(), // 'owner', 'member'
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
}, (t) => [primaryKey({ columns: [t.householdId, t.userId] })]);

// A taste profile. userId is null for a persona without its own login (phase 2);
// it's set when that person signs up and claims the persona, keeping its history.
export const personas = sqliteTable('personas', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  userId: text('user_id').references(() => users.id), // The login that claimed it, if any
  name: text('name').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
});

// The physical units a household owns. Maintenance and grind history belong to a unit,
// not to the model (every Niche Zero) or to a toolkit (one grinder can be in several).
export const ownedHardware = sqliteTable('owned_hardware', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  hardwareId: text('hardware_id').references(() => canonicalHardware.id).notNull(), // The model
  nickname: text('nickname'),
  acquiredAt: integer('acquired_at', { mode: 'timestamp' }),
  retiredAt: integer('retired_at', { mode: 'timestamp' }),
});

export const toolkits = sqliteTable('toolkits', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  name: text('name').notNull(), // e.g., "Daily Espresso"
  components: text('components', { mode: 'json' }).notNull(), // Array of ownedHardware IDs
});

// Maintenance on one owned unit. For a grinder, each event starts a new grind period:
// shots either side aren't directly comparable. Once the user finalises a re-dial after
// the event, the confirmed shift is stored here (a user decision, so it is kept rather
// than recalculated). Grind in the new period = old grind x grindScale + grindShift.
// Stored recipes are never rewritten; the mapping is applied when reading.
export const maintenanceEvents = sqliteTable('maintenance_events', {
  id: text('id').primaryKey(),
  ownedHardwareId: text('owned_hardware_id').references(() => ownedHardware.id).notNull(),
  kind: text('kind').notNull(), // 'burrs', 'clean', 'rezero', 'repair', 'other'
  note: text('note'),
  occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
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
  roastDate: integer('roast_date', { mode: 'timestamp' }), // Null if only best-before is printed
  bestBefore: integer('best_before', { mode: 'timestamp' }),
  bagWeight: real('bag_weight').notNull(), // Grams, as bought
  purchasedAt: integer('purchased_at', { mode: 'timestamp' }), // For reorder timing
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// What physically exists: a whole bag is one portion; splitting to freeze creates more.
export const batchPortions = sqliteTable('batch_portions', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').references(() => batches.id).notNull(),
  weight: real('weight').notNull(), // Grams
  frozenAt: integer('frozen_at', { mode: 'timestamp' }),
  thawedAt: integer('thawed_at', { mode: 'timestamp' }),
  openedAt: integer('opened_at', { mode: 'timestamp' }),
  finishedAt: integer('finished_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Optional: the user weighs what's left, correcting the run-out estimate.
export const stockChecks = sqliteTable('stock_checks', {
  id: text('id').primaryKey(),
  portionId: text('portion_id').references(() => batchPortions.id).notNull(),
  remainingWeight: real('remaining_weight').notNull(), // Grams
  checkedAt: integer('checked_at', { mode: 'timestamp' }).notNull(),
});

// --- TELEMETRY & EXTRACTIONS ---
export const extractions = sqliteTable('extractions', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  personaId: text('persona_id').references(() => personas.id).notNull(), // Whose taste it records
  loggedByUserId: text('logged_by_user_id').references(() => users.id).notNull(), // Who tapped; often not the persona
  toolkitId: text('toolkit_id').references(() => toolkits.id).notNull(),
  grinderId: text('grinder_id').references(() => ownedHardware.id).notNull(), // Grind only means something for this unit
  machineId: text('machine_id').references(() => ownedHardware.id).notNull(), // Temperature and pressure steps belong to it
  portionId: text('portion_id').references(() => batchPortions.id).notNull(), // Batch and bean follow from the portion
  drinkContext: text('drink_context').notNull(), // 'Espresso', 'Milk', 'Sweetened'

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

  // Sensory outputs (1-5) & Diagnostics
  userRating: integer('user_rating'), // 1-5 overall
  scoreSweetness: integer('score_sweetness'),
  scoreAcidity: integer('score_acidity'),
  scoreBitterness: integer('score_bitterness'),
  scoreBody: integer('score_body'),
  defects: text('defects', { mode: 'json' }),

  // True only with the full MVPayload and a persona claimed by a user who opted in.
  // A persona without its own login never reaches the network, whoever logged the shot.
  isNetworkEligible: integer('is_network_eligible', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// --- RECIPES ---
// Pinned per bean, persona, toolkit and drink context. A set batchId overrides the
// bean's default for that one bag. Re-pinning adds a row; the latest pinnedAt wins.
export const pinnedRecipes = sqliteTable('pinned_recipes', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id).notNull(),
  beanId: text('bean_id').references(() => canonicalBeans.id).notNull(),
  personaId: text('persona_id').references(() => personas.id).notNull(),
  toolkitId: text('toolkit_id').references(() => toolkits.id).notNull(),
  grinderId: text('grinder_id').references(() => ownedHardware.id).notNull(),
  machineId: text('machine_id').references(() => ownedHardware.id).notNull(),
  drinkContext: text('drink_context').notNull(),
  batchId: text('batch_id').references(() => batches.id), // Null = the bean's default

  grindSize: real('grind_size').notNull(),
  doseWeight: real('dose_weight').notNull(),
  yieldWeight: real('yield_weight').notNull(),
  yieldTime: integer('yield_time').notNull(), // Milliseconds
  brewTempC: real('brew_temp_c'), // Same optional pairs as extractions
  brewTempStep: integer('brew_temp_step'),
  pressureBar: real('pressure_bar'),
  pressureStep: integer('pressure_step'),

  sourceExtractionId: text('source_extraction_id').references(() => extractions.id), // The shot it came from, if any
  pinnedAt: integer('pinned_at', { mode: 'timestamp' }).notNull(),
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

**Objective:** Translate sensory defects into precise physical hardware adjustments based on the user's active Toolkit.

```text
You are a master barista diagnostic engine. Analyze the extraction data, Toolkit components, and sensory ratings to provide a concise hardware adjustment. Output ONLY JSON.

Inputs Provided:
1. MVPayload Variables (Dose, Yield, Time, Grind).
2. Toolkit Components (e.g., Bambino Pro, Niche Zero, WDT).
3. Sensory Scores & Tagged Defects.
4. Days since batch opened (Bean Aging context).

Rules:
- High Acidity + Fast Time = Under-extracted. Action: Grind finer.
- High Bitterness + Slow Time = Over-extracted. Action: Grind coarser.
- If Channelling is tagged and Toolkit lacks a WDT, suggest adding WDT.
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
