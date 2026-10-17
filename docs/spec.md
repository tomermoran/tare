# Tare: The Hardware-Aware Coffee Journal

Master Product & Engineering Specification

> The updates below are newer than the rest of this spec. Where they differ,
> the updates win.

## Updates (October 2026)

- Target user: everyday home enthusiasts, not semi-pros. Goal: great coffee from every new bag, in fewer shots, tuned to your palate.
- Core differentiators: palate learning and drift-aware dial-in.
- Grind size doesn't transfer between grinders or over time. Treat it as a personal offset per grinder, give more weight to recent shots, and let users mark a recalibration.
- Roadmap: Phase 1 is a basic app for logging shots and managing recipes, toolkits and the pantry. AI features come later, each with evals and observability. RAG will ground the Diagnostic Coach in extraction guides and equipment manuals.
- Design: Inter, thin weights at large sizes, regular weight for small labels. Monochrome warm grey palette with one muted colour for shot warnings.

## Data model decisions (October 2026)

Agreed while reviewing the schema in section 6, which already reflects them.

- **Recipes belong to the bean.** A pinned recipe is scoped to bean, persona, toolkit and drink context, so a new bag of the same coffee starts from what was learned before. An optional batch override handles a bag that behaves differently.
- **Batches hold portions.** The batch is the bag as bought (bean, roaster's lot code, roast date, best-before, bag weight, purchase date). Portions are what physically exists: their weight and when each was frozen, thawed, opened and finished. Shots are logged against a portion. Splitting a bag never duplicates roast date or lot.
- **Freezing pauses aging.** Bean age runs from the roast date (best-before as a fallback when no roast date is printed), minus time in the freezer. A shot ground straight from frozen beans is identifiable from the dates alone.
- **Calibration events mark breaks in grind history.** Re-zeroing, new burrs, deep cleans and toolkit component swaps are logged with a date, so shots before and after aren't compared as equals.
- **Run-out prediction uses facts, not stored estimates.** Inputs: portion weights (including frozen stock), doses from logged shots, when portions were finished, optional stock checks (weighing what's left) and purchase dates. The one-tap "Pull This Shot" must record an extraction, or daily use is invisible. Finished portions give each household's real usage rate and how much of it logging captures.
- **Calculated, never stored:** remaining weight, bag status (open, finished), bean age, usage rate, and drift adjustments.
- **Shot time is stored in milliseconds** and shown in seconds with one decimal, like a scale timer.

Still open: timestamp precision (seconds or milliseconds), whether one login equals one household, storing temperature and pressure, grind as a per-grinder offset, and whether pinning a better recipe updates the bag's override or the bean's default.

## 1. The North Star Vision & UVP

**The Vision:** To build the definitive context-aware operating system for the specialty coffee ritual. Tare eliminates the "Cold Start" waste of dialing in espresso by transforming single-player brewing diaries into a dynamic, predictive network matched to the user’s exact hardware and personal palate.

**Unique Value Proposition (UVP):** "The only coffee journal that actually knows your setup and your taste. Stop guessing, start brewing."

## 2. Core Product Architecture & Ontology

The system is built on a highly structured, real-world physical hierarchy to allow for frictionless, "smart default" daily use.

### The Entity Hierarchy

- **Household (The Auth Tenant):** Managed via a single Google OAuth login.
- **Personas:** Sub-profiles for different consumers (e.g., "[name]", "[name]") to isolate taste graphs.
- **Toolkits (Hardware Groups):** Instead of selecting individual machines daily, hardware is grouped. (e.g., Daily Espresso Toolkit = Bambino Pro + Niche Zero + IMS 18g Basket + WDT).
- **The Pantry (Batches and Portions):** Separates the Canonical Bean (the global product) from the User Batch (the bag as bought: roast date, lot, weight). A batch holds one or more Portions, the physical containers on the counter or in the freezer, so a 1 kg bag split into a fresh and a frozen half stays one batch.
- **Drink Context:** The target output (Espresso, Milk Drink, Additives like Sugar).
- **The Pinned Recipe:** The exact extraction parameters locked in at the intersection of a Persona, Toolkit, Drink Context, and Canonical Bean. A recipe can optionally be pinned for one specific Batch, overriding the bean's default for that bag. Day-to-day drift (bean age, the batch's own character, kit calibration) is calculated from logged shots on top of the pinned recipe, not stored.
- **Calibration Events:** Dated changes to a Toolkit (grinder re-zeroed, new burrs, deep clean, component swapped). Shots on either side of an event are not directly comparable.

## 3. Algorithmic Intelligence & Data Trust

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

## 4. UX/UI Philosophy: The Frictionless Ritual

The interface follows a modern, digital Japandi aesthetic (clean, minimalist, progressive disclosure).

- **Zero-Form Onboarding:** No long preference surveys. The system derives the user's taste graph implicitly through behavioral logging.
- **The Daily Driver (Exploitation):** The home screen defaults to the Pinned Recipe for the active Persona and time-of-day Drink Context. Brewing the daily standard requires exactly zero variable inputs and one tap (`[ Pull This Shot ]`).
- **Exception-Based Logging:** Users do not log every successful shot. They only interact with the extraction UI when dialing in a new bag, or when a shot goes wrong (e.g., due to bean aging), at which point the app pre-fills the Pinned Recipe variables for a quick micro-adjustment.
- **Tactile Inputs:** Large, draggable number wheels/scrubbers for variables. No tiny text keyboards.

## 5. Privacy, GDPR & Localization (i18n)

- **Consent:** Explicit opt-in required to push anonymized telemetry to the global Cold Start network.
- **Decoupling:** Network extractions strip PII and use cohort IDs.
- **Localization:** No hardcoded strings. UI respects European vs. US numerical formatting (comma vs. decimal) while saving canonical floats to the database. RTL-ready logical CSS properties (Tailwind).

## 6. The Database Schema (Drizzle ORM / SQLite)

Instructions for the coding agent: Implement this relational schema to support the Stateful Hardware Ledger, Toolkits, Batches, and Pinned Recipes.

```ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// --- CANONICAL & GLOBAL ---
export const canonicalBeans = sqliteTable('canonical_beans', {
  id: text('id').primaryKey(),
  roaster: text('roaster').notNull(),
  name: text('name').notNull(),
  roastLevel: text('roast_level'),
  tastingNotes: text('tasting_notes', { mode: 'json' }),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Auth UUID
  shareDataConsent: integer('share_data_consent', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// --- TENANT HIERARCHY ---
export const personas = sqliteTable('personas', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
});

export const toolkits = sqliteTable('toolkits', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(), // e.g., "Daily Espresso"
  components: text('components', { mode: 'json' }).notNull(), // Array of canonical hardware IDs
});

// Calibration history: shots either side of an event aren't directly comparable.
export const calibrationEvents = sqliteTable('calibration_events', {
  id: text('id').primaryKey(),
  toolkitId: text('toolkit_id').references(() => toolkits.id).notNull(),
  component: text('component').notNull(), // Canonical hardware ID, e.g. the grinder
  kind: text('kind').notNull(), // 'rezero', 'burrs', 'clean', 'swap'
  note: text('note'),
  occurredAt: integer('occurred_at', { mode: 'timestamp' }).notNull(),
});

// --- PANTRY ---
// The bag as bought. Status, remaining weight and bean age are calculated, not stored.
export const userBatches = sqliteTable('user_batches', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
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
  batchId: text('batch_id').references(() => userBatches.id).notNull(),
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
  userId: text('user_id').references(() => users.id).notNull(),
  personaId: text('persona_id').references(() => personas.id).notNull(),
  toolkitId: text('toolkit_id').references(() => toolkits.id).notNull(),
  portionId: text('portion_id').references(() => batchPortions.id).notNull(), // Batch and bean follow from the portion
  drinkContext: text('drink_context').notNull(), // 'Espresso', 'Milk', 'Sweetened'

  // MVPayload
  grindSize: real('grind_size').notNull(),
  doseWeight: real('dose_weight').notNull(),
  yieldWeight: real('yield_weight').notNull(),
  yieldTime: integer('yield_time').notNull(), // milliseconds; shown as seconds with one decimal

  // Sensory outputs (1-5) & Diagnostics
  userRating: integer('user_rating'), // 1-5 overall
  scoreSweetness: integer('score_sweetness'),
  scoreAcidity: integer('score_acidity'),
  scoreBitterness: integer('score_bitterness'),
  scoreBody: integer('score_body'),
  defects: text('defects', { mode: 'json' }),

  isNetworkEligible: integer('is_network_eligible', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// --- RECIPES ---
// Pinned per bean, persona, toolkit and drink context. A set batchId overrides the
// bean's default for that one bag. Re-pinning adds a row; the latest pinnedAt wins.
export const pinnedRecipes = sqliteTable('pinned_recipes', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  beanId: text('bean_id').references(() => canonicalBeans.id).notNull(),
  personaId: text('persona_id').references(() => personas.id).notNull(),
  toolkitId: text('toolkit_id').references(() => toolkits.id).notNull(),
  drinkContext: text('drink_context').notNull(),
  batchId: text('batch_id').references(() => userBatches.id), // Null = the bean's default

  grindSize: real('grind_size').notNull(),
  doseWeight: real('dose_weight').notNull(),
  yieldWeight: real('yield_weight').notNull(),
  yieldTime: integer('yield_time').notNull(), // Milliseconds

  sourceExtractionId: text('source_extraction_id').references(() => extractions.id), // The shot it came from, if any
  pinnedAt: integer('pinned_at', { mode: 'timestamp' }).notNull(),
});
```

## 7. Core GenAI System Prompts

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
