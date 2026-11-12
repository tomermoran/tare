import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { drinkTypes } from "@/db/schema";
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
