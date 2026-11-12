import { getTableColumns, is, sql } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { beforeAll, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import * as schema from "@/db/schema";
import { createTestDb } from "@/test/db";

/**
 * The S-08 schema as the migrations build it, frozen: `name:type`, with `!`
 * for NOT NULL. A rename, retype or nullability change in a migration fails
 * here, so changing a column means changing the spec and this list together
 * (TASK-01-01-01-QA1).
 */
const EXPECTED: Record<string, string> = {
  batch_portions: "id:text! batch_id:text! weight:real! frozen_at:integer thawed_at:integer opened_at:integer finished_at:integer created_at:integer!",
  batches: "id:text! household_id:text! bean_id:text! lot_code:text roast_date:integer packed_at:integer best_before:integer bag_weight:real! purchased_at:integer created_at:integer!",
  canonical_beans: "id:text! roaster_id:text! name:text! roast_level:text tasting_notes:text source:text! status:text! merged_into_id:text created_by_household_id:text created_at:integer!",
  canonical_hardware: "id:text! maker_id:text! kind:text! name:text! capabilities:text source:text! status:text! merged_into_id:text created_by_household_id:text created_at:integer!",
  catalog_aliases: "id:text! entity_type:text! entity_id:text! name:text! market:text created_at:integer!",
  catalog_merges: "id:text! entity_type:text! from_id:text! into_id:text! suggested_by:text! confidence:real reason:text decided_at:integer!",
  catalog_urls: "id:text! entity_type:text! entity_id:text! url:text! normalized_url:text! market:text added_by_household_id:text created_at:integer!",
  drink_types: "id:text! household_id:text! name_key:text name:text has_milk:integer! typical_milk_ml:real hidden:integer sort_order:integer!",
  extractions: "id:text! household_id:text! persona_id:text! logged_by_user_id:text! setup_id:text! portion_id:text! drink_type_id:text! sweetened:integer entry_mode:text! grind_size:real! dose_weight:real! yield_weight:real! yield_time:integer! brew_temp_c:real brew_temp_step:integer pressure_bar:real pressure_step:integer used_wdt:integer! used_puck_screen:integer! milk_type_id:text milk_ml:real reaction:text user_rating:integer taste_balance:integer taste_strength:integer taste_body:integer taste_sweetness:integer taste_tags:text is_network_eligible:integer created_at:integer!",
  hardware_makers: "id:text! name:text! source:text! status:text! merged_into_id:text created_by_household_id:text created_at:integer!",
  household_members: "household_id:text! user_id:text! role:text! joined_at:integer!",
  households: "id:text! name:text created_at:integer!",
  maintenance_events: "id:text! owned_hardware_id:text! kind:text! is_recalibration:integer! note:text occurred_at:integer! grind_shift:real grind_scale:real offset_source_recipe_id:text",
  milk_types: "id:text! household_id:text! name_key:text name:text kind:text! hidden:integer sort_order:integer!",
  owned_hardware: "id:text! household_id:text! hardware_id:text! nickname:text acquired_at:integer retired_at:integer created_at:integer!",
  personas: "id:text! household_id:text! user_id:text name:text is_default:integer",
  pinned_recipes: "id:text! household_id:text! bean_id:text! persona_id:text! setup_id:text! drink_type_id:text! batch_id:text grind_size:real! dose_weight:real! yield_weight:real! yield_time:integer! brew_temp_c:real brew_temp_step:integer pressure_bar:real pressure_step:integer used_wdt:integer! used_puck_screen:integer! milk_type_id:text milk_ml:real source_extraction_id:text pinned_at:integer!",
  roasters: "id:text! name:text! source:text! status:text! merged_into_id:text created_by_household_id:text created_at:integer!",
  setup_parts: "setup_id:text! owned_hardware_id:text!",
  setups: "id:text! household_id:text! parts_key:text! name:text created_at:integer!",
  stock_checks: "id:text! portion_id:text! remaining_weight:real! checked_at:integer!",
  users: "id:text! firebase_uid:text! share_data_consent:integer created_at:integer!",
};

// Retired designs and derived values that must never come back as columns.
const FORBIDDEN = [
  /toolkit/, // replaced by setups
  /defect/, // replaced by taste tags
  /sensory/, // replaced by the "just right" taste scales
  /ratio/, // derived from dose and yield
  /flow/, // derived from yield and time
  /^status$|^age|remaining$/, // a bag's state is calculated (stock_checks is the exception)
];

let db: Db;
let actual: Record<string, string>;
beforeAll(async () => {
  db = await createTestDb();
  const tables = await db.all<{ name: string }>(
    sql`select name from sqlite_master where type = 'table'
        and name not like 'sqlite_%' and name not like '__drizzle%'`,
  );
  actual = {};
  for (const { name } of tables) {
    const cols = await db.all<{ name: string; type: string; notnull: number }>(
      sql.raw(`pragma table_info(${name})`),
    );
    actual[name] = cols
      .map((c) => `${c.name}:${c.type.toLowerCase()}${c.notnull ? "!" : ""}`)
      .join(" ");
  }
});

describe("schema against S-08", () => {
  it("has exactly the S-08 tables and columns", () => {
    expect(actual).toEqual(EXPECTED);
  });

  it("keeps one setup per household and parts", async () => {
    const indexes = await db.all<{ name: string; unique: number }>(
      sql`select name, "unique" from pragma_index_list('setups')`,
    );
    expect(indexes).toContainEqual({ name: "setups_household_parts", unique: 1 });
  });

  it("stores no retired or derived columns", () => {
    for (const [table, cols] of Object.entries(actual)) {
      for (const col of cols.split(" ").map((c) => c.split(":")[0])) {
        if (table === "stock_checks" && col === "remaining_weight") continue;
        for (const pattern of FORBIDDEN) {
          expect(`${table}.${col}`).not.toMatch(
            new RegExp(`\\.(?:${pattern.source})`),
          );
        }
      }
    }
  });

  it("maps every timestamp column to milliseconds", () => {
    for (const table of Object.values(schema).filter((t) => is(t, SQLiteTable))) {
      for (const col of Object.values(getTableColumns(table))) {
        if (col.columnType === "SQLiteTimestamp") {
          expect(`${col.name}:${(col as unknown as { mode: string }).mode}`).toBe(
            `${col.name}:timestamp_ms`,
          );
        }
        if (/_at$|_date$|^best_before$/.test(col.name)) {
          expect(`${col.name}:${col.columnType}`).toBe(
            `${col.name}:SQLiteTimestamp`,
          );
        }
      }
    }
  });
});
