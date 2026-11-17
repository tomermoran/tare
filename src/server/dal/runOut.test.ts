import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, extractions, personas, stockChecks } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getRunOut } from "./runOut";

/*
 * The run-out read (TASK-03-05-01-BE2): household-wide, following new shots
 * and finished portions, and null rather than an error.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const day = (n: number) => new Date(Date.UTC(2026, 0, 1 + n, 8));

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function portion(p: Partial<typeof batchPortions.$inferInsert> = {}) {
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: day(0) });
  const id = newId();
  await db().insert(batchPortions).values({ id, batchId, weight: 250, createdAt: day(0), ...p });
  return id;
}

async function shot(portionId: string, at: Date, personaId = k.persona.id, entryMode: "measured" | "one-tap" = "measured") {
  await db()
    .insert(extractions)
    .values({ id: newId(), ...shotValues(k), personaId, doseWeight: 18, loggedByUserId: k.user.id, portionId, entryMode, createdAt: at });
}

/** Three bags used a week each; the kitchen's own portion is the one open. */
async function steady() {
  for (const d of [0, 7, 14]) {
    const id = await portion({ openedAt: day(d), finishedAt: day(d + 7) });
    await shot(id, day(d + 1));
  }
  await db().update(batchPortions).set({ openedAt: day(21) }).where(eq(batchPortions.id, k.portion.id));
}

describe("getRunOut", () => {
  it("gives the estimate and its span for a household with history", async () => {
    await steady();
    await shot(k.portion.id, day(22), k.persona.id, "one-tap");
    const r = await getRunOut(day(22));
    expect(r).toMatchObject({ kind: "estimate", weeklyGrams: 250, finished: 3, onHand: { grams: 232 } });
    expect(r?.span).toMatchObject({ kind: "span", unit: "day", value: 6 });
    expect(r?.logged?.share).toBeCloseTo(18 / 250);
  });

  it("is learning for a new household, with no span", async () => {
    expect(await getRunOut(day(1))).toMatchObject({ kind: "learning", finished: 0, onHand: { grams: 250 }, span: null, logged: null });
  });

  it("counts every member's shots, never one persona's", async () => {
    await steady();
    const [other] = await db().insert(personas).values({ id: newId(), householdId: k.household.id, name: "Second member" }).returning();
    await shot(k.portion.id, day(22), other.id);
    expect((await getRunOut(day(22)))?.onHand.grams).toBe(232);
  });

  it("follows a stock check, a new shot and a finished portion (AC 3)", async () => {
    await steady();
    await db().insert(stockChecks).values({ id: newId(), portionId: k.portion.id, remainingWeight: 100, checkedAt: day(22) });
    expect((await getRunOut(day(22)))?.onHand.grams).toBe(100);
    await shot(k.portion.id, day(23));
    expect((await getRunOut(day(23)))?.onHand.grams).toBe(82);
    await db().update(batchPortions).set({ finishedAt: day(24) }).where(eq(batchPortions.id, k.portion.id));
    expect(await getRunOut(day(24))).toMatchObject({ kind: "nothing" });
  });

  it("leaves another household's coffee out", async () => {
    await steady();
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    expect(await getRunOut(day(22))).toMatchObject({ kind: "nothing", onHand: { grams: 0 }, logged: null });
  });

  it("is null when the read fails (AC 5)", async () => {
    vi.spyOn(db(), "select").mockImplementation(() => {
      throw new Error("database gone");
    });
    expect(await getRunOut(day(1))).toBeNull();
  });

  it("is null when signed out", async () => {
    signInAs(null);
    expect(await getRunOut(day(1))).toBeNull();
  });
});
