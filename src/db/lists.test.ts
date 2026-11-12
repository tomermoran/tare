import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { drinkTypes, milkTypes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";

let db: Db;
let householdId: string;
beforeEach(async () => {
  db = await createTestDb();
  householdId = (await makeHousehold(db)).household.id;
});

describe("drink types", () => {
  it("leaves the typical milk amount empty for a drink without milk", async () => {
    const id = newId();
    await db.insert(drinkTypes).values({
      id,
      householdId,
      nameKey: "drinks.espresso",
      hasMilk: false,
      sortOrder: 0,
    });
    const [row] = await db.select().from(drinkTypes).where(eq(drinkTypes.id, id));
    expect(row).toMatchObject({ typicalMilkMl: null, hidden: false, name: null });
  });
});

describe("milk types", () => {
  it("accepts a starter milk with only a key and a custom one with only a name", async () => {
    await db.insert(milkTypes).values([
      { id: newId(), householdId, nameKey: "milks.oat", kind: "plant", sortOrder: 0 },
      { id: newId(), householdId, name: "Oat (barista)", kind: "plant", sortOrder: 1 },
    ]);
    const rows = await db
      .select()
      .from(milkTypes)
      .where(eq(milkTypes.householdId, householdId));
    expect(rows).toHaveLength(2);
  });
});
