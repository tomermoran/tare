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
