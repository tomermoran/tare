import { and, eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, extractions, maintenanceEvents, ownedHardware, personas, pinnedRecipes, setupParts, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getGrindAdjustment } from "./grindAdjustment";

/*
 * The adjustment from the database (TASK-04-02-05-BE1, 07-BE1, 06-BE1,
 * 09-BE1): grind periods per event kind, pooling on one grinder unit,
 * never another, and failures giving null with one outcome line.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const DAY = 86_400_000;
const NOW = new Date("2026-01-20T09:00:00Z");
const ago = (d: number) => new Date(NOW.getTime() - d * DAY);
const grinder = () => k.parts[1].id;
const lines: unknown[] = [];

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  await db().update(batchPortions).set({ openedAt: ago(10) });
  lines.length = 0;
  vi.spyOn(console, "info").mockImplementation((line: string) => void lines.push(JSON.parse(line)));
});
afterEach(() => vi.restoreAllMocks());

const pin = (over: Partial<typeof pinnedRecipes.$inferInsert> = {}) =>
  db()
    .insert(pinnedRecipes)
    .values({
      id: newId(),
      householdId: k.household.id,
      beanId: k.bean.id,
      personaId: k.persona.id,
      setupId: k.setup.id,
      drinkTypeId: k.drinks.espresso.id,
      grindSize: 15,
      doseWeight: 18,
      yieldWeight: 36,
      yieldTime: 28_000,
      pinnedAt: ago(30),
      ...over,
    });
const shot = (d: number, over: Partial<typeof extractions.$inferInsert> = {}) =>
  db()
    .insert(extractions)
    .values({ id: newId(), ...shotValues(k), grindSize: 15, yieldTime: 24_000, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: ago(d), ...over });
const fastShots = async (over: Partial<typeof extractions.$inferInsert> = {}) => {
  for (const d of [0.2, 1, 2]) await shot(d, over);
};
const adjust = () => getGrindAdjustment({ recipe: { beanId: k.bean.id, setupId: k.setup.id, grind: 15 }, portionId: k.portion.id, now: NOW });
const event = (partId: string, kind: string, d: number) =>
  db().insert(maintenanceEvents).values({ id: newId(), ownedHardwareId: partId, kind, occurredAt: ago(d) });

/** A second setup with these parts. */
async function setupWith(partIds: string[]) {
  const id = newId();
  await db().insert(setups).values({ id, householdId: k.household.id, partsKey: partIds.join("|"), createdAt: ago(40) });
  await db().insert(setupParts).values(partIds.map((ownedHardwareId) => ({ setupId: id, ownedHardwareId })));
  return id;
}

describe("getGrindAdjustment", () => {
  it("adjusts for a fast bag on the recipe's grinder, and logs one outcome", async () => {
    await pin();
    await fastShots();
    const a = await adjust();
    expect(a?.shown).toBeLessThan(15);
    expect(a?.rows.map((r) => r.kind)).toContain("bag");
    expect(lines).toEqual([{ event: "drift.outcome", outcome: expect.stringMatching(/applied|limited/), measured: 3, people: 1, leftOut: 0 }]);
  });

  it("starts a new period at a grinder event, a clean included, but not at a machine's (STORY-04-02-05)", async () => {
    await pin();
    await fastShots();
    await event(k.parts[0].id, "clean", 0.5);
    await event(k.parts[2].id, "other", 0.5);
    expect(await adjust()).not.toBeNull();
    await event(grinder(), "clean", 0.5);
    expect(await adjust()).toBeNull();
    expect(lines.at(-1)).toEqual({ event: "drift.outcome", outcome: "none", reason: "tooFew" });
  });

  it("pools every profile's shots on setups sharing the grinder, never another grinder (STORY-04-02-07)", async () => {
    const guest = newId();
    await db().insert(personas).values({ id: guest, householdId: k.household.id, name: "Guest", isDefault: false });
    const sharing = await setupWith([k.parts[0].id, grinder()]);
    await pin();
    await pin({ personaId: guest, setupId: sharing });
    await shot(0.2);
    await shot(1, { personaId: guest, setupId: sharing });
    await shot(2, { personaId: guest, setupId: sharing });
    const pooled = await adjust();
    expect(pooled?.evidence).toMatchObject({ people: 2, acrossSetups: true, measured: 3 });
    expect(JSON.stringify(pooled)).not.toContain("Guest");

    // The same shots on another grinder don't count.
    const otherGrinder = newId();
    await db().insert(ownedHardware).values({ id: otherGrinder, householdId: k.household.id, hardwareId: (await db().select().from(ownedHardware))[1].hardwareId });
    await db()
      .update(setupParts)
      .set({ ownedHardwareId: otherGrinder })
      .where(and(eq(setupParts.setupId, sharing), eq(setupParts.ownedHardwareId, grinder())));
    expect(await adjust()).toBeNull();
  });

  it("gives null with no grinder, and on any error (STORY-04-02-06 AC 6)", async () => {
    expect(await getGrindAdjustment({ recipe: { beanId: k.bean.id, setupId: "nowhere", grind: 15 }, portionId: null, now: NOW })).toBeNull();
    const real = testContext.db!;
    testContext.db = new Proxy(real, { get: (t, p) => (p === "select" ? () => { throw new Error("boom"); } : Reflect.get(t, p)) });
    expect(await adjust()).toBeNull();
    testContext.db = real;
    expect(lines.at(-1)).toEqual({ event: "drift.outcome", outcome: "failed", reason: "error" });
  });

  it("logs counts only: no ID or name in any line (STORY-04-02-09 AC 3)", async () => {
    await pin();
    await fastShots();
    await adjust();
    const text = JSON.stringify(lines);
    for (const id of [k.household.id, k.persona.id, k.user.id, k.bean.id, k.setup.id]) expect(text).not.toContain(id);
  });
});
