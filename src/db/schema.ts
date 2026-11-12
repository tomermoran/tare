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

import {
  type AnySQLiteColumn,
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
