import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans, extractions, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getJournalFilterOptions, getShot, listJournal, type JournalFilters, type JournalShot } from "./journal";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
const zone = vi.hoisted(() => ({ value: "Europe/London" }));
vi.mock("@/server/time", () => ({ getTimeZone: async () => zone.value }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const NOW = new Date("2026-03-30T12:00:00Z");
const daysAgo = (d: number, h = 0) => new Date(NOW.getTime() - d * 86_400_000 - h * 3_600_000);

beforeEach(async () => {
  zone.value = "Europe/London";
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(at: Date, over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = over.id ?? newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at, ...over });
  return id;
}

/** Every page, following "show older" to the end. */
async function all(): Promise<JournalShot[]> {
  let page = await listJournal({ now: NOW });
  const out = [...page.shots];
  while (page.older) {
    page = await listJournal({ before: page.older, limit: 3, now: NOW });
    out.push(...page.shots);
  }
  return out;
}

describe("listJournal", () => {
  it("lists the last 30 days newest first, with each shot's details (AC 1)", async () => {
    const latte = await shot(daysAgo(0, 2), {
      drinkTypeId: k.drinks.latte.id,
      milkTypeId: k.milk.id,
      milkMl: 180,
      entryMode: "one-tap",
      reaction: "good",
    });
    const espresso = await shot(daysAgo(3));
    const page = await listJournal({ now: NOW });
    expect(page.shots.map((s) => s.id)).toEqual([latte, espresso]);
    expect(page.older).toBeNull();
    expect(page.shots[0]).toMatchObject({
      drink: { nameKey: "drinks.latte" },
      coffee: { name: "House Blend", roasterName: "Example Roasters" },
      milk: { nameKey: "milks.oat", ml: 180 },
      values: { grind: 15, dose: 18, yield: 36, timeMs: 28_000 },
      entryMode: "one-tap",
      reaction: "good",
      fromFrozen: false,
      grinderId: k.parts[1].id,
    });
    expect(page.shots[1].milk).toBeNull();
  });

  it("offers older shots past 30 days and pages through them with no gaps or repeats (AC 3)", async () => {
    const recent = await shot(daysAgo(1));
    const older: string[] = [];
    for (let d = 31; d <= 37; d++) older.push(await shot(daysAgo(d)));
    // Two shots at the same instant are ordered by id, never lost.
    const same = daysAgo(40);
    older.push(await shot(same, { id: "zz-same" }), await shot(same, { id: "aa-same" }));

    const first = await listJournal({ now: NOW });
    expect(first.shots.map((s) => s.id)).toEqual([recent]);
    expect(first.older).not.toBeNull();

    const ids = (await all()).map((s) => s.id);
    expect(ids).toEqual([recent, ...older]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("offers older shots even when the last 30 days are empty", async () => {
    const old = await shot(daysAgo(45));
    const first = await listJournal({ now: NOW });
    expect(first.shots).toEqual([]);
    expect((await listJournal({ before: first.older!, now: NOW })).shots.map((s) => s.id)).toEqual([old]);
  });

  it("keys days in the device's zone, across midnight and a daylight-saving change", async () => {
    zone.value = "Europe/London";
    // 29 March 2026: clocks go forward at 01:00 UTC in London.
    await shot(new Date("2026-03-28T23:30:00Z")); // 23:30 on the 28th (GMT)
    await shot(new Date("2026-03-29T23:30:00Z")); // 00:30 on the 30th (BST)
    expect((await listJournal({ now: NOW })).shots.map((s) => s.day)).toEqual(["2026-03-30", "2026-03-28"]);
    zone.value = "America/New_York";
    expect((await listJournal({ now: NOW })).shots.map((s) => s.day)).toEqual(["2026-03-29", "2026-03-28"]);
  });

  it("marks a shot ground from frozen, and not one from before or after (AC 2)", async () => {
    const before = await shot(daysAgo(5));
    await db()
      .update(batchPortions)
      .set({ frozenAt: daysAgo(4), thawedAt: daysAgo(2) })
      .where(eq(batchPortions.id, k.portion.id));
    const frozen = await shot(daysAgo(3));
    const thawed = await shot(daysAgo(1));
    const marks = Object.fromEntries((await listJournal({ now: NOW })).shots.map((s) => [s.id, s.fromFrozen]));
    expect(marks).toEqual({ [before]: false, [frozen]: true, [thawed]: false });
  });

  it("shows nothing of another household", async () => {
    await shot(daysAgo(1));
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    expect(await listJournal({ now: NOW })).toEqual({ shots: [], older: null });
  });
});

describe("getShot", () => {
  it("returns every field the detail shows (AC 1, AC 2)", async () => {
    const id = await shot(daysAgo(1), {
      drinkTypeId: k.drinks.latte.id,
      milkTypeId: k.milk.id,
      milkMl: 180,
      sweetened: true,
      usedWdt: true,
      userRating: 4,
      tasteBalance: -1,
      tasteSweetness: 0,
      tasteTags: ["flat"],
    });
    const detail = await getShot(id);
    expect(detail).toMatchObject({
      id,
      at: daysAgo(1),
      drink: { nameKey: "drinks.latte" },
      coffee: { name: "House Blend", roasterName: "Example Roasters" },
      milk: { nameKey: "milks.oat", ml: 180 },
      values: { grind: 15, dose: 18, yield: 36, timeMs: 28_000 },
      entryMode: "measured",
      sweetened: true,
      prep: { wdt: true, puckScreen: false },
      rating: 4,
      taste: { balance: -1, strength: null, body: null, sweetness: 0 },
      tags: ["flat"],
      setup: { id: k.setup.id, name: null },
    });
    expect(detail.setup.parts).toEqual([
      { kind: "machine", maker: "Example Works", model: "Example Machine", nickname: null },
      { kind: "grinder", maker: "Example Works", model: "Example Grinder", nickname: null },
      { kind: "basket", maker: "Example Works", model: "Example Double Basket", nickname: null },
    ]);
  });

  it("returns a one-tap shot's mode and reaction", async () => {
    const id = await shot(daysAgo(1), { entryMode: "one-tap", reaction: "off" });
    expect(await getShot(id)).toMatchObject({ entryMode: "one-tap", reaction: "off", rating: null, milk: null });
  });

  it("doesn't find another household's shot", async () => {
    const id = await shot(daysAgo(1));
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(getShot(id)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("journal filters (STORY-02-06-04)", () => {
  /** A bag of another coffee, optionally merged into an existing catalog entry. */
  async function bagOf(name: string, mergedIntoId?: string) {
    const beanId = newId();
    await db()
      .insert(canonicalBeans)
      .values({ id: beanId, roasterId: k.bean.roasterId, name, source: "user", status: "verified", mergedIntoId, createdAt: NOW });
    const batchId = newId();
    await db().insert(batches).values({ id: batchId, householdId: k.household.id, beanId, bagWeight: 250, createdAt: NOW });
    const portionId = newId();
    await db().insert(batchPortions).values({ id: portionId, batchId, weight: 250, createdAt: NOW });
    return { beanId, portionId };
  }
  async function secondSetup() {
    const id = newId();
    await db().insert(setups).values({ id, householdId: k.household.id, partsKey: "second", createdAt: NOW });
    return id;
  }
  async function every(filters: JournalFilters) {
    let page = await listJournal({ now: NOW, filters });
    const out = [...page.shots];
    while (page.older) {
      page = await listJournal({ before: page.older, limit: 1, now: NOW, filters });
      out.push(...page.shots);
    }
    return out.map((s) => s.id);
  }

  it("filters by drink, coffee and setup, and they combine", async () => {
    const other = await bagOf("Example Single Origin");
    const setupId = await secondSetup();
    const espresso = await shot(daysAgo(1));
    const latte = await shot(daysAgo(2), { drinkTypeId: k.drinks.latte.id });
    const otherCoffee = await shot(daysAgo(3), { portionId: other.portionId });
    const otherSetup = await shot(daysAgo(4), { setupId });
    expect(await every({ drinkId: k.drinks.latte.id })).toEqual([latte]);
    expect(await every({ beanId: other.beanId })).toEqual([otherCoffee]);
    expect(await every({ setupId })).toEqual([otherSetup]);
    expect(await every({ drinkId: k.drinks.espresso.id, beanId: k.bean.id })).toEqual([espresso, otherSetup]);
    expect(await every({ drinkId: k.drinks.latte.id, setupId })).toEqual([]);
  });

  it("keeps the filters on older pages (AC 3)", async () => {
    const old = [await shot(daysAgo(40)), await shot(daysAgo(41)), await shot(daysAgo(42))];
    await shot(daysAgo(43), { drinkTypeId: k.drinks.latte.id });
    await shot(daysAgo(1), { drinkTypeId: k.drinks.latte.id });
    const first = await listJournal({ now: NOW, filters: { drinkId: k.drinks.espresso.id } });
    // Nothing recent matches, but older shots do.
    expect(first.shots).toEqual([]);
    expect(first.older).not.toBeNull();
    expect(await every({ drinkId: k.drinks.espresso.id })).toEqual(old);
    // No more pages once the matching shots run out, even with others older.
    const last = await listJournal({ before: first.older!, limit: 3, now: NOW, filters: { drinkId: k.drinks.espresso.id } });
    expect(last.older).toBeNull();
  });

  it("counts a merged duplicate as the coffee it was merged into", async () => {
    const dup = await bagOf("House Blend (duplicate)", k.bean.id);
    const a = await shot(daysAgo(1));
    const b = await shot(daysAgo(2), { portionId: dup.portionId });
    expect(await every({ beanId: k.bean.id })).toEqual([a, b]);
  });

  it("offers drinks, coffees with shots, and every setup (AC 1)", async () => {
    await bagOf("Never Brewed");
    const dup = await bagOf("House Blend (duplicate)", k.bean.id);
    await shot(daysAgo(1), { portionId: dup.portionId });
    let options = await getJournalFilterOptions();
    expect(options.drinks.map((d) => d.id).sort()).toEqual([k.drinks.espresso.id, k.drinks.latte.id].sort());
    expect(options.coffees).toEqual([{ id: k.bean.id, name: k.bean.name, roasterName: "Example Roasters" }]);
    // One setup: the setup filter isn't offered.
    expect(options.setups).toHaveLength(1);
    await secondSetup();
    options = await getJournalFilterOptions();
    expect(options.setups).toHaveLength(2);
  });

  it("offers Brew's coffee before its first shot, and a duplicate as its survivor (STORY-02-06-05 AC 1)", async () => {
    const fresh = await bagOf("Fresh Bag");
    let options = await getJournalFilterOptions({ beanId: fresh.beanId });
    expect(options.beanId).toBe(fresh.beanId);
    expect(options.coffees.map((c) => c.id)).toEqual([fresh.beanId]);
    const dup = await bagOf("House Blend (duplicate)", k.bean.id);
    options = await getJournalFilterOptions({ beanId: dup.beanId });
    expect(options.beanId).toBe(k.bean.id);
    // Not a coffee this household has: no filter.
    expect((await getJournalFilterOptions({ beanId: newId() })).beanId).toBeNull();
  });

  it("only offers this household's", async () => {
    await shot(daysAgo(1));
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    expect(await getJournalFilterOptions()).toMatchObject({ coffees: [], setups: [] });
    expect((await listJournal({ now: NOW, filters: { beanId: k.bean.id } })).shots).toEqual([]);
  });
});
