/*
 * Database schema (Drizzle ORM, SQLite via libSQL).
 *
 * Tables follow S-08 in docs/spec.md. Conventions:
 *
 * - Store measurements as canonical floats (`real`) in one fixed unit:
 *     dose, yield → grams      temperature → °C
 *     pressure    → bar        grind       → the grinder's own scale value
 *   Convert to the user's preferred units only when displaying.
 * - Shot time is an `integer` in milliseconds (exact, no float noise),
 *   displayed in seconds with one decimal, like a scale timer.
 * - Never store derived values (ratio, flow rate). Compute them on read.
 * - Never store display strings (formatted numbers, labels). Those belong in
 *   the i18n messages.
 * - Timestamps as integer milliseconds since the Unix epoch, UTC.
 */

import { sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  check,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { TasteTag } from "@/domain/taste";

// --- ACCOUNTS ---

// A login: one person. Consent is personal, so it lives here.
// MVP: Firebase anonymous sign-in gives each device a Firebase account without a
// sign-in screen. When Google sign-in arrives, Firebase links it to the same
// account, so firebaseUid and all data stay as they are.
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  shareDataConsent: integer("share_data_consent", { mode: "boolean" }).default(
    false,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// --- TENANT HIERARCHY ---

// The household owns everything shared in the kitchen: beans, hardware, setups,
// personas and their recipes. The MVP creates one household per user at sign-up.
export const households = sqliteTable("households", {
  id: text("id").primaryKey(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// Which logins belong to which household. One row in the MVP; invites add rows later.
export const householdMembers = sqliteTable(
  "household_members",
  {
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    role: text("role").notNull(), // 'owner', 'member'
    joinedAt: integer("joined_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.householdId, t.userId] })],
);

// A taste profile. userId is null for a persona without its own login (phase 2);
// it's set when that person signs up and claims the persona, keeping its history.
export const personas = sqliteTable("personas", {
  id: text("id").primaryKey(),
  householdId: text("household_id")
    .references(() => households.id)
    .notNull(),
  userId: text("user_id").references(() => users.id),
  name: text("name"), // Null shows the translated role label (e.g. "Me")
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
});

// --- HOUSEHOLD LISTS ---

// Drinks a household makes. Each new household gets the starter list (Espresso,
// Ristretto, Lungo, Americano, Cortado, Flat white, Cappuccino, Latte, Macchiato) as
// its own rows, which it can rename, hide or add to. Starter rows use nameKey so
// they are translated; a renamed or added drink stores its own name.
export const drinkTypes = sqliteTable(
  "drink_types",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    nameKey: text("name_key"), // i18n key for starter drinks, e.g. 'drinks.latte'
    name: text("name"), // Set when renamed or custom; overrides nameKey
    hasMilk: integer("has_milk", { mode: "boolean" }).notNull(),
    typicalMilkMl: real("typical_milk_ml"), // Pre-fills milk amount; null without milk
    hidden: integer("hidden", { mode: "boolean" }).default(false),
    sortOrder: integer("sort_order").notNull(),
  },
  (t) => [index("drink_types_household_order").on(t.householdId, t.sortOrder)],
);

// Milks a household uses. New households get a starter list (whole, semi-skimmed,
// skimmed, oat, soy, almond, lactose-free) as their own rows, renamable and extendable.
export const milkTypes = sqliteTable(
  "milk_types",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    nameKey: text("name_key"), // i18n key for starter milks, e.g. 'milks.oat'
    name: text("name"), // Set when renamed or custom, e.g. "Oat (barista)"
    kind: text("kind").notNull(), // 'dairy', 'plant'
    hidden: integer("hidden", { mode: "boolean" }).default(false),
    sortOrder: integer("sort_order").notNull(),
  },
  (t) => [index("milk_types_household_order").on(t.householdId, t.sortOrder)],
);

// --- CANONICAL CATALOG ---
// Two shared catalogs, each a parent and a product: hardware makers -> hardware
// models, and roasters -> beans. Every catalog row follows the same rules:
// - source: 'seed' (curated list) or 'user' (added by a household; needs a product URL)
// - status: 'verified' or 'unverified' (user additions start unverified until reviewed)
// - mergedIntoId: duplicates are merged, never deleted. Anything that references a
//   merged row follows the pointer to the surviving one.
// Regional URLs and names live in catalogUrls and catalogAliases, so "Sage Bambino"
// (UK) and "Breville Bambino" (US) are one model with two names and two URLs.

export const hardwareMakers = sqliteTable("hardware_makers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  source: text("source").notNull(), // 'seed', 'user'
  status: text("status").notNull(), // 'verified', 'unverified'
  mergedIntoId: text("merged_into_id").references(
    (): AnySQLiteColumn => hardwareMakers.id,
  ),
  createdByHouseholdId: text("created_by_household_id").references(
    () => households.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// A hardware model (the catalog row), not a unit someone owns; see ownedHardware.
// Only the kinds that define a setup. Portafilters, tampers, scales and prep tools
// aren't tracked; WDT and puck screen use are checkboxes on shots and recipes.
// capabilities is JSON, typed and checked by src/domain/capabilities.ts.
export const canonicalHardware = sqliteTable(
  "canonical_hardware",
  {
    id: text("id").primaryKey(),
    makerId: text("maker_id")
      .references(() => hardwareMakers.id)
      .notNull(),
    kind: text("kind", { enum: ["machine", "grinder", "basket"] }).notNull(),
    name: text("name").notNull(), // Model name, e.g. "Bambino"
    capabilities: text("capabilities", { mode: "json" }),
    source: text("source").notNull(),
    status: text("status").notNull(),
    mergedIntoId: text("merged_into_id").references(
      (): AnySQLiteColumn => canonicalHardware.id,
    ),
    createdByHouseholdId: text("created_by_household_id").references(
      () => households.id,
    ),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    check(
      "canonical_hardware_kind",
      sql`${t.kind} in ('machine', 'grinder', 'basket')`,
    ),
  ],
);

export const roasters = sqliteTable("roasters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull(),
  mergedIntoId: text("merged_into_id").references(
    (): AnySQLiteColumn => roasters.id,
  ),
  createdByHouseholdId: text("created_by_household_id").references(
    () => households.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const canonicalBeans = sqliteTable("canonical_beans", {
  id: text("id").primaryKey(),
  roasterId: text("roaster_id")
    .references(() => roasters.id)
    .notNull(),
  name: text("name").notNull(),
  roastLevel: text("roast_level"), // One of the S-09 levels, or null if not stated
  tastingNotes: text("tasting_notes", { mode: "json" }).$type<string[]>(),
  source: text("source").notNull(),
  status: text("status").notNull(),
  mergedIntoId: text("merged_into_id").references(
    (): AnySQLiteColumn => canonicalBeans.id,
  ),
  createdByHouseholdId: text("created_by_household_id").references(
    () => households.id,
  ),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export type CatalogEntityType = "maker" | "model" | "roaster" | "bean";

// Product pages, one row per market. A catalog row can have many (UK and US pages).
// entityType + entityId point at a maker, model, roaster or bean (not FK-enforced).
// normalizedUrl strips regional path segments and tracking parameters: an exact match
// on it flags a likely duplicate in the MVP. Later, an LLM suggests fuzzier matches;
// a person or a reviewed rule always confirms the merge.
export const catalogUrls = sqliteTable(
  "catalog_urls",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").$type<CatalogEntityType>().notNull(),
    entityId: text("entity_id").notNull(),
    url: text("url").notNull(),
    normalizedUrl: text("normalized_url").notNull(),
    market: text("market"), // ISO 3166-1 alpha-2, e.g. 'GB', 'US'; null if global
    addedByHouseholdId: text("added_by_household_id").references(
      () => households.id,
    ),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("catalog_urls_normalized").on(t.normalizedUrl)],
);

// Other names for the same catalog row, usually regional ("Sage" for "Breville" in
// the UK). Search matches any alias.
export const catalogAliases = sqliteTable(
  "catalog_aliases",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").$type<CatalogEntityType>().notNull(),
    entityId: text("entity_id").notNull(),
    name: text("name").notNull(),
    market: text("market"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("catalog_aliases_type_name").on(t.entityType, t.name)],
);

// Audit trail of merges: who or what suggested it and who confirmed it.
export const catalogMerges = sqliteTable("catalog_merges", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").$type<CatalogEntityType>().notNull(),
  fromId: text("from_id").notNull(), // The duplicate, which keeps existing as a pointer
  intoId: text("into_id").notNull(), // The surviving row
  suggestedBy: text("suggested_by").notNull(), // 'url-match', 'llm', 'user', 'reviewer'
  confidence: real("confidence"), // 0-1, for automated suggestions
  reason: text("reason"),
  decidedAt: integer("decided_at", { mode: "timestamp_ms" }).notNull(),
});

// --- THE HOUSEHOLD'S EQUIPMENT ---

// The physical units a household owns. Maintenance and grind history belong to a
// unit, not to the model (every Niche Zero) or to a setup (one grinder can be in
// several).
export const ownedHardware = sqliteTable(
  "owned_hardware",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    hardwareId: text("hardware_id")
      .references(() => canonicalHardware.id)
      .notNull(), // The model
    nickname: text("nickname"),
    acquiredAt: integer("acquired_at", { mode: "timestamp_ms" }),
    retiredAt: integer("retired_at", { mode: "timestamp_ms" }), // Not written in the MVP
    // When it was added to Tare (not when it was bought: that's acquiredAt).
    // Orders "most recently added" for the first-setup shortcut. Rows from
    // before this column read as the epoch, i.e. oldest.
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`0`),
  },
  (t) => [index("owned_hardware_household").on(t.householdId)],
);

// A setup: a fixed combination of owned parts. Setups never change; any different
// combination is a different setup. partsKey is the sorted list of part IDs
// (src/domain/setupKey.ts), unique per household, so using the same combination
// again finds the same setup, and its recipes, instead of creating a new one.
export const setups = sqliteTable(
  "setups",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    partsKey: text("parts_key").notNull(),
    name: text("name"), // Optional; otherwise shown by its parts or a translated default
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [uniqueIndex("setups_household_parts").on(t.householdId, t.partsKey)],
);

export const setupParts = sqliteTable(
  "setup_parts",
  {
    setupId: text("setup_id")
      .references(() => setups.id)
      .notNull(),
    ownedHardwareId: text("owned_hardware_id")
      .references(() => ownedHardware.id)
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.setupId, t.ownedHardwareId] }),
    index("setup_parts_owned_hardware").on(t.ownedHardwareId),
  ],
);

// --- BEANS (batches and portions) ---

// The bag as bought. Status, remaining weight and bean age are calculated, not stored.
export const batches = sqliteTable("batches", {
  id: text("id").primaryKey(),
  householdId: text("household_id")
    .references(() => households.id)
    .notNull(),
  beanId: text("bean_id")
    .references(() => canonicalBeans.id)
    .notNull(),
  lotCode: text("lot_code"), // Roaster's lot, if printed on the bag
  roastDate: integer("roast_date", { mode: "timestamp_ms" }), // Null if not printed
  packedAt: integer("packed_at", { mode: "timestamp_ms" }), // When printed instead of a roast date
  bestBefore: integer("best_before", { mode: "timestamp_ms" }),
  bagWeight: real("bag_weight").notNull(), // Grams, as bought
  purchasedAt: integer("purchased_at", { mode: "timestamp_ms" }), // For reorder timing
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// What physically exists: a whole bag is one portion; splitting to freeze creates more.
export const batchPortions = sqliteTable(
  "batch_portions",
  {
    id: text("id").primaryKey(),
    batchId: text("batch_id")
      .references(() => batches.id)
      .notNull(),
    weight: real("weight").notNull(), // Grams
    frozenAt: integer("frozen_at", { mode: "timestamp_ms" }),
    thawedAt: integer("thawed_at", { mode: "timestamp_ms" }),
    openedAt: integer("opened_at", { mode: "timestamp_ms" }),
    finishedAt: integer("finished_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("batch_portions_batch").on(t.batchId)],
);

// Optional: the user weighs what's left, correcting the run-out estimate.
export const stockChecks = sqliteTable(
  "stock_checks",
  {
    id: text("id").primaryKey(),
    portionId: text("portion_id")
      .references(() => batchPortions.id)
      .notNull(),
    remainingWeight: real("remaining_weight").notNull(), // Grams
    checkedAt: integer("checked_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("stock_checks_portion_time").on(t.portionId, t.checkedAt)],
);

// --- SHOTS (extractions) ---

export const extractions = sqliteTable(
  "extractions",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    personaId: text("persona_id")
      .references(() => personas.id)
      .notNull(), // Whose taste it records
    loggedByUserId: text("logged_by_user_id")
      .references(() => users.id)
      .notNull(), // Who tapped; often not the persona
    setupId: text("setup_id")
      .references(() => setups.id)
      .notNull(),
    portionId: text("portion_id")
      .references(() => batchPortions.id)
      .notNull(), // Batch and bean follow from the portion
    drinkTypeId: text("drink_type_id")
      .references(() => drinkTypes.id)
      .notNull(),
    sweetened: integer("sweetened", { mode: "boolean" }).default(false),
    // 'measured': values entered or confirmed at the machine.
    // 'one-tap': "Pull this shot" copied the pinned recipe; nothing was measured.
    // One-tap shots count for coffee used and as "the recipe was fine", but drift
    // detection and palate learning must not treat their values as measurements.
    entryMode: text("entry_mode").$type<"measured" | "one-tap">().notNull(),

    grindSize: real("grind_size").notNull(), // The grinder's own scale
    doseWeight: real("dose_weight").notNull(), // Grams
    yieldWeight: real("yield_weight").notNull(), // Grams
    yieldTime: integer("yield_time").notNull(), // Milliseconds; shown as seconds

    // Only when the machine can set them. At most one of each pair is filled,
    // matching the machine's capability; steps are never converted to °C or bar.
    brewTempC: real("brew_temp_c"),
    brewTempStep: integer("brew_temp_step"),
    pressureBar: real("pressure_bar"), // Exact setting, or peak gauge reading
    pressureStep: integer("pressure_step"),

    // Puck prep, as checkboxes; a one-tap pull copies them from the recipe.
    usedWdt: integer("used_wdt", { mode: "boolean" }).notNull().default(false),
    usedPuckScreen: integer("used_puck_screen", { mode: "boolean" })
      .notNull()
      .default(false),

    // Milk, for milk drinks; pre-filled from the recipe or the drink's typical amount.
    milkTypeId: text("milk_type_id").references(() => milkTypes.id),
    milkMl: real("milk_ml"),

    // Taste, relative to this persona ("just right" scales, -2..2; 0 = just right).
    reaction: text("reaction").$type<"good" | "off">(), // After a one-tap shot
    userRating: integer("user_rating"), // 1-5 overall
    tasteBalance: integer("taste_balance"), // -2 much too sour ... +2 much too bitter
    tasteStrength: integer("taste_strength"), // -2 much too weak ... +2 much too strong
    tasteBody: integer("taste_body"), // -2 much too thin ... +2 much too heavy
    tasteSweetness: integer("taste_sweetness"), // -2 not sweet enough ... 0 just right
    tasteTags: text("taste_tags", { mode: "json" }).$type<TasteTag[]>(),

    // True only for a measured shot with the full payload and a persona claimed by a
    // user who opted in. One-tap shots and personas without a login never qualify.
    isNetworkEligible: integer("is_network_eligible", {
      mode: "boolean",
    }).default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    index("extractions_household_time").on(t.householdId, t.createdAt),
    index("extractions_portion").on(t.portionId),
    index("extractions_setup_time").on(t.setupId, t.createdAt),
  ],
);

// --- RECIPES ---

// Pinned per bean, persona, setup and drink type. A set batchId overrides the
// bean's default for that one bag. Re-pinning adds a row; the latest pinnedAt wins.
export const pinnedRecipes = sqliteTable(
  "pinned_recipes",
  {
    id: text("id").primaryKey(),
    householdId: text("household_id")
      .references(() => households.id)
      .notNull(),
    beanId: text("bean_id")
      .references(() => canonicalBeans.id)
      .notNull(),
    personaId: text("persona_id")
      .references(() => personas.id)
      .notNull(),
    setupId: text("setup_id")
      .references(() => setups.id)
      .notNull(),
    drinkTypeId: text("drink_type_id")
      .references(() => drinkTypes.id)
      .notNull(),
    batchId: text("batch_id").references(() => batches.id), // Null = the bean's default

    grindSize: real("grind_size").notNull(),
    doseWeight: real("dose_weight").notNull(),
    yieldWeight: real("yield_weight").notNull(),
    yieldTime: integer("yield_time").notNull(), // Milliseconds
    brewTempC: real("brew_temp_c"), // Same optional pairs as extractions
    brewTempStep: integer("brew_temp_step"),
    pressureBar: real("pressure_bar"),
    pressureStep: integer("pressure_step"),
    usedWdt: integer("used_wdt", { mode: "boolean" }).notNull().default(false),
    usedPuckScreen: integer("used_puck_screen", { mode: "boolean" })
      .notNull()
      .default(false),
    milkTypeId: text("milk_type_id").references(() => milkTypes.id), // The usual milk
    milkMl: real("milk_ml"),

    sourceExtractionId: text("source_extraction_id").references(
      () => extractions.id,
    ), // The shot it came from, if any
    pinnedAt: integer("pinned_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    index("pinned_recipes_key").on(
      t.beanId,
      t.personaId,
      t.setupId,
      t.drinkTypeId,
      t.pinnedAt,
    ),
  ],
);

// --- MAINTENANCE ---

// Maintenance on one owned unit. For a grinder, each event starts a new grind
// period: shots either side aren't directly comparable. Once the user finalises a
// re-dial after the event, the confirmed shift is stored here (a user decision, so
// kept rather than recalculated). Grind in the new period = old grind x grindScale
// + grindShift. Stored recipes are never rewritten; the mapping applies on read.
// The offset columns stay null in the MVP.
export const maintenanceEvents = sqliteTable(
  "maintenance_events",
  {
    id: text("id").primaryKey(),
    ownedHardwareId: text("owned_hardware_id")
      .references(() => ownedHardware.id)
      .notNull(),
    kind: text("kind").notNull(), // 'burrs', 'clean', 'rezero', 'repair', 'other'
    isRecalibration: integer("is_recalibration", { mode: "boolean" })
      .notNull()
      .default(false),
    note: text("note"),
    occurredAt: integer("occurred_at", { mode: "timestamp_ms" }).notNull(),
    grindShift: real("grind_shift"), // Grinder units; set when a re-dial is confirmed
    grindScale: real("grind_scale"), // Stretch factor; 1 unless 2+ coffees re-dialed
    offsetSourceRecipeId: text("offset_source_recipe_id").references(
      () => pinnedRecipes.id,
    ),
  },
  (t) => [
    index("maintenance_events_unit_time").on(t.ownedHardwareId, t.occurredAt),
  ],
);
