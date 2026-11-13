import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { addBagAction } from "@/server/actions/bags";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { addBag, getBag, getOnHand, WeightRequiredError } from "./bags";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "Asia/Jerusalem" }));

const SIGNIA = seedIds.bean("portofino", "signia");
let householdId: string;
let otherId: string;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  const h = await makeHousehold(testContext.db);
  householdId = h.household.id;
  otherId = (await makeHousehold(testContext.db)).household.id;
  signInAs(h.user.firebaseUid);
});
afterEach(() => vi.useRealTimers());

const db = () => testContext.db!;
const bag = async (id: string) => (await db().select().from(batches).where(eq(batches.id, id)))[0];
const portions = (batchId: string) => db().select().from(batchPortions).where(eq(batchPortions.batchId, batchId));

describe("addBag", () => {
  it("adds the bag with one unopened portion of the whole weight (AC 1)", async () => {
    const { batchId, portionId } = await addBag({ beanId: SIGNIA, bagWeight: 250 });
    expect(await bag(batchId)).toMatchObject({ householdId, beanId: SIGNIA, bagWeight: 250 });
    const [p] = await portions(batchId);
    expect(p).toMatchObject({ id: portionId, weight: 250, openedAt: null, frozenAt: null, finishedAt: null });
  });

  it.each([0, -5, Number.NaN, 20_000])("refuses a weight of %s and saves nothing (AC 5)", async (bagWeight) => {
    await expect(addBag({ beanId: SIGNIA, bagWeight })).rejects.toBeInstanceOf(WeightRequiredError);
    expect(await db().select().from(batches)).toHaveLength(0);
  });

  it("keeps two bags of one coffee separate (AC 6)", async () => {
    const a = await addBag({ beanId: SIGNIA, bagWeight: 250, lotCode: "A1" });
    const b = await addBag({ beanId: SIGNIA, bagWeight: 1000, lotCode: "B2" });
    expect(a.batchId).not.toBe(b.batchId);
    expect((await bag(b.batchId)).lotCode).toBe("B2");
  });

  it("stores a merged coffee as its survivor", async () => {
    const dup = newId();
    await db().insert(canonicalBeans).values({
      id: dup, roasterId: seedIds.roaster("portofino"), name: "dup", source: "user", status: "verified", mergedIntoId: SIGNIA, createdAt: new Date(),
    });
    const { batchId } = await addBag({ beanId: dup, bagWeight: 250 });
    expect((await bag(batchId)).beanId).toBe(SIGNIA);
  });

  it("won't use another household's unverified coffee", async () => {
    const id = newId();
    await db().insert(canonicalBeans).values({
      id, roasterId: seedIds.roaster("portofino"), name: "Theirs", source: "user", status: "unverified", createdByHouseholdId: otherId, createdAt: new Date(),
    });
    await expect(addBag({ beanId: id, bagWeight: 250 })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("addBagAction", () => {
  it("leaves every date optional (AC 2, AC 4)", async () => {
    const result = await addBagAction({ beanId: SIGNIA, bagWeight: 340 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(await bag(result.data.batchId)).toMatchObject({ roastDate: null, packedAt: null, bestBefore: null, lotCode: null });
  });

  it("stores each date at local noon (AC 2)", async () => {
    const result = await addBagAction({
      beanId: SIGNIA, bagWeight: 250, roastDate: "2026-01-02", packedAt: "2026-01-03", bestBefore: "2026-07-01", purchasedAt: "2026-01-05",
    });
    if (!result.ok) throw new Error(result.error);
    const b = await bag(result.data.batchId);
    expect(b.roastDate?.toISOString()).toBe("2026-01-02T10:00:00.000Z");
    expect(b.packedAt?.toISOString()).toBe("2026-01-03T10:00:00.000Z");
    expect(b.bestBefore?.toISOString()).toBe("2026-07-01T09:00:00.000Z");
    expect(b.purchasedAt?.toISOString()).toBe("2026-01-05T10:00:00.000Z");
  });

  it("defaults the purchase date to today in the device's zone (AC 4)", async () => {
    // 23:30 UTC on 14 January is already 15 January in Jerusalem.
    vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-01-14T23:30:00Z") });
    const result = await addBagAction({ beanId: SIGNIA, bagWeight: 250 });
    if (!result.ok) throw new Error(result.error);
    expect((await bag(result.data.batchId)).purchasedAt?.toISOString()).toBe("2026-01-15T10:00:00.000Z");
  });

  it("asks for the weight and saves nothing (AC 5)", async () => {
    await expect(addBagAction({ beanId: SIGNIA, bagWeight: 0 })).resolves.toEqual({ ok: false, error: "weightRequired" });
    expect(await db().select().from(batches)).toHaveLength(0);
  });

  it("rejects a malformed date", async () => {
    await expect(addBagAction({ beanId: SIGNIA, bagWeight: 250, roastDate: "02/01/2026" })).resolves.toEqual({ ok: false, error: "saveFailed" });
  });
});

describe("getOnHand", () => {
  const finish = (portionId: string) =>
    db().update(batchPortions).set({ finishedAt: new Date() }).where(eq(batchPortions.id, portionId));

  it("shows each bag with its coffee, roaster and portions (AC 1)", async () => {
    const { batchId, portionId } = await addBag({ beanId: SIGNIA, bagWeight: 250 });
    const [{ group, bags: [b] }] = await getOnHand();
    expect(group).toBe("unopened");
    expect(b).toMatchObject({ id: batchId, bean: { id: SIGNIA, name: "Signia", roasterName: "Portofino" } });
    expect(b.portions).toEqual([{ id: portionId, weight: 250, state: "unopened", openedAt: null, openSince: null, frozenAt: null,
      opened: { kind: "notOpened" }, roasting: { kind: "unknown" }, remaining: { grams: 250, overLogged: false } }]);
  });

  it("drops a bag once every portion is finished (AC 3)", async () => {
    const { batchId, portionId } = await addBag({ beanId: SIGNIA, bagWeight: 250 });
    const other = await db().insert(batchPortions).values({ id: newId(), batchId, weight: 100, createdAt: new Date() }).returning();
    await finish(portionId);
    const [b] = (await getOnHand())[0].bags;
    expect(b.portions.map((p) => p.id)).toEqual([other[0].id]);
    await finish(other[0].id);
    expect(await getOnHand()).toEqual([]);
    // Still reachable on its own screen.
    expect((await getBag(batchId)).portions.map((p) => p.state)).toEqual(["finished", "finished"]);
  });

  it("groups bags into open, unopened and frozen, each bag once (STORY-03-02-05)", async () => {
    const day = (n: number) => new Date(Date.UTC(2026, 0, n));
    const add = async (dates: Partial<typeof batchPortions.$inferInsert>[]) => {
      const { batchId, portionId } = await addBag({ beanId: SIGNIA, bagWeight: 250 });
      await db().update(batchPortions).set(dates[0]).where(eq(batchPortions.id, portionId));
      for (const d of dates.slice(1)) await db().insert(batchPortions).values({ id: newId(), batchId, weight: 100, createdAt: new Date(), ...d });
      return batchId;
    };
    const ice = await add([{ frozenAt: day(2) }]);
    const half = await add([{ openedAt: day(5) }, { frozenAt: day(5) }]);
    const sealed = await add([{ frozenAt: day(2), thawedAt: day(6) }]);
    const early = await add([{ openedAt: day(3) }]);

    const groups = await getOnHand();
    expect(groups.map((g) => [g.group, g.bags.map((b) => b.id)])).toEqual([
      ["open", [early, half]],
      ["unopened", [sealed]],
      ["frozen", [ice]],
    ]);
    expect(groups[0].bags[1].portions.map((p) => p.state)).toEqual(["counter", "frozen"]);
  });

  it("gives each portion its clocks and the bag the clock of the portion in use (STORY-03-03-04 AC 3)", async () => {
    const now = new Date();
    const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);
    const { batchId, portionId } = await addBag({ beanId: SIGNIA, bagWeight: 250, roastDate: daysAgo(20) });
    await db().update(batchPortions).set({ openedAt: daysAgo(4) }).where(eq(batchPortions.id, portionId));
    await db().insert(batchPortions).values({ id: newId(), batchId, weight: 100, createdAt: now, frozenAt: daysAgo(15) });
    const b = await getBag(batchId);
    expect(b.portions.map((p) => [p.opened, p.roasting])).toEqual([
      [{ kind: "open", days: 4 }, { kind: "roasted", days: 20, frozenDays: 0 }],
      [{ kind: "paused" }, { kind: "roasted", days: 5, frozenDays: 15 }],
    ]);
    expect(b.roasting).toEqual({ kind: "roasted", days: 20, frozenDays: 0 });
  });

  it("shows a merged coffee's survivor (AC 6)", async () => {
    const dup = newId();
    await db().insert(canonicalBeans).values({
      id: dup, roasterId: seedIds.roaster("portofino"), name: "Signia (old)", source: "user", status: "verified", createdAt: new Date(),
    });
    const { batchId } = await addBag({ beanId: dup, bagWeight: 250 });
    await db().update(canonicalBeans).set({ mergedIntoId: SIGNIA }).where(eq(canonicalBeans.id, dup));
    expect((await getBag(batchId)).bean).toMatchObject({ id: SIGNIA, name: "Signia" });
  });
});

describe("getBag", () => {
  it("treats a missing bag as not found", async () => {
    await expect(getBag("no-such-bag")).rejects.toBeInstanceOf(NotFoundError);
  });
});
