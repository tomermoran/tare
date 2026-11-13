import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, extractions } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getShot, listJournal, type JournalShot } from "./journal";
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
