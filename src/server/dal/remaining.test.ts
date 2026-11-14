import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, extractions, stockChecks } from "@/db/schema";
import { remainingWeight, totalRemaining } from "@/domain/remaining";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getRemaining } from "./remaining";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

/*
 * What's left of a portion (STORY-03-04-01): its weight, or its latest
 * check, less every later dose, measured and one-tap. Undo is covered in
 * pull.test.ts and Brew's line in home.test.ts.
 */

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number, hour = 8) => new Date(Date.UTC(2026, 2, day, hour));

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(createdAt: Date, over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt, ...over });
  return id;
}

describe("getRemaining (TASK-03-04-01-BE1)", () => {
  it("matches the domain rule: checks, later doses, both entry modes, never negative", async () => {
    const doses = [
      { grams: 18, at: at(1) },
      { grams: 18.5, at: at(3) },
      { grams: 17, at: at(6) },
    ];
    await shot(doses[0].at, { doseWeight: 18 });
    await shot(doses[1].at, { doseWeight: 18.5, entryMode: "one-tap" });
    expect((await getRemaining([k.portion.id])).get(k.portion.id)).toEqual(remainingWeight({ weight: 250, latestCheck: null, doses: doses.slice(0, 2) }));

    await db().insert(stockChecks).values([
      { id: newId(), portionId: k.portion.id, remainingWeight: 200, checkedAt: at(2) },
      { id: newId(), portionId: k.portion.id, remainingWeight: 150, checkedAt: at(4) },
    ]);
    await shot(doses[2].at, { doseWeight: 17 });
    const check = { grams: 150, at: at(4) };
    expect((await getRemaining([k.portion.id])).get(k.portion.id)).toEqual(remainingWeight({ weight: 250, latestCheck: check, doses }));
    expect((await getRemaining([k.portion.id])).get(k.portion.id)).toEqual({ grams: 133, overLogged: false });

    const small = { id: newId(), batchId: k.batch.id, weight: 20, createdAt: at(1) };
    await db().insert(batchPortions).values(small);
    await shot(at(7), { portionId: small.id, doseWeight: 18 });
    await shot(at(8), { portionId: small.id, doseWeight: 18 });
    expect((await getRemaining([small.id])).get(small.id)).toEqual({ grams: 0, overLogged: true });
  });

  it("follows an edited dose (STORY-03-04-01 AC 3), and leaves out other households' portions", async () => {
    const id = await shot(at(1), { doseWeight: 18 });
    await db().update(extractions).set({ doseWeight: 20 }).where(eq(extractions.id, id));
    expect((await getRemaining([k.portion.id])).get(k.portion.id)?.grams).toBe(230);
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    expect((await getRemaining([k.portion.id])).size).toBe(0);
  });
});

describe("a bag's total (STORY-03-04-01 AC 2)", () => {
  it("adds up what's left in each of its portions", async () => {
    const second = { id: newId(), batchId: k.batch.id, weight: 125, createdAt: at(1) };
    await db().insert(batchPortions).values(second);
    await shot(at(2), { doseWeight: 18 });
    await shot(at(3), { portionId: second.id, doseWeight: 20, entryMode: "one-tap" });
    const left = await getRemaining([k.portion.id, second.id]);
    expect(totalRemaining([...left.values()])).toEqual({ grams: 250 - 18 + 125 - 20, overLogged: false });
  });
});
