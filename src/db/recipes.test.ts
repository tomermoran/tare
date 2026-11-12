import { desc, sql } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { pinnedRecipes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";

let db: Db;
let kitchen: Awaited<ReturnType<typeof makeKitchen>>;
beforeEach(async () => {
  db = await createTestDb();
  kitchen = await makeKitchen(db);
});

describe("pinned recipes", () => {
  it("keeps every pin for one key, and the latest wins", async () => {
    const pin = (grindSize: number, pinnedAt: string) => ({
      id: newId(),
      ...shotValues(kitchen),
      beanId: kitchen.bean.id,
      grindSize,
      pinnedAt: new Date(pinnedAt),
    });
    await db.insert(pinnedRecipes).values(pin(15, "2026-01-10T08:00:00Z"));
    await db.insert(pinnedRecipes).values(pin(14.5, "2026-01-12T08:00:00Z"));
    const rows = await db
      .select()
      .from(pinnedRecipes)
      .orderBy(desc(pinnedRecipes.pinnedAt));
    expect(rows.map((r) => r.grindSize)).toEqual([14.5, 15]);
  });

  it("leaves milk out of the recipe key index", async () => {
    const cols = await db.all<{ name: string }>(
      sql`select name from pragma_index_info('pinned_recipes_key')`,
    );
    expect(cols.map((c) => c.name)).toEqual([
      "bean_id",
      "persona_id",
      "setup_id",
      "drink_type_id",
      "pinned_at",
    ]);
  });
});
