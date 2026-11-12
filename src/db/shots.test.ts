import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { extractions } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";

let db: Db;
let kitchen: Awaited<ReturnType<typeof makeKitchen>>;
beforeEach(async () => {
  db = await createTestDb();
  kitchen = await makeKitchen(db);
});

describe("extractions", () => {
  it("defaults puck prep to unchecked and stores time in milliseconds", async () => {
    await db.insert(extractions).values({
      id: newId(),
      ...shotValues(kitchen),
      loggedByUserId: kitchen.user.id,
      portionId: kitchen.portion.id,
      entryMode: "measured",
      tasteTags: ["channelling"],
      createdAt: new Date(),
    });
    const [shot] = await db.select().from(extractions);
    expect(shot).toMatchObject({
      usedWdt: false,
      usedPuckScreen: false,
      yieldTime: 28_000,
      isNetworkEligible: false,
      tasteTags: ["channelling"],
    });
  });
});
