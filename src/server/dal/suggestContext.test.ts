import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, maintenanceEvents } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { NotFoundError } from "./scope";
import { getSuggestContext } from "./suggestContext";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));
const GRINDER = 1;

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

async function shot(day: number, over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(day), ...over });
  return id;
}

describe("getSuggestContext", () => {
  it("reads the shot, what its setup can do and the portion's clocks", async () => {
    const id = await shot(10, { usedWdt: true });
    const c = await getSuggestContext(id, at(12));
    expect(c.shot).toMatchObject({ grind: 15, dose: 18, yield: 36, timeMs: 28_000, prep: { wdt: true, puckScreen: false }, milkDrink: false });
    expect(c.setup).toEqual({ grind: expect.objectContaining({ coarser: "higher", step: 0.5 }), temperature: false, doseRange: { min: 16, max: 18 } });
    expect(c.grinderPartId).toBe(k.parts[GRINDER].id);
    expect(c.recipe).toBeNull();
    expect(c.clocks.roasting).toMatchObject({ kind: "roasted" });
    expect(c.previous).toBeNull();
  });

  it("gives the shot before on the same coffee, setup and drink", async () => {
    await shot(8, { grindSize: 17, tasteBalance: -2 });
    await shot(9, { grindSize: 99, drinkTypeId: k.drinks.latte.id });
    await shot(9, { grindSize: 98, entryMode: "one-tap" });
    const id = await shot(10);
    expect((await getSuggestContext(id, at(12))).previous).toEqual({ grind: 17, balance: -2 });
  });

  it("leaves out a shot before a grinder event, which starts a new grind period", async () => {
    await shot(8, { grindSize: 17, tasteBalance: -2 });
    await db().insert(maintenanceEvents).values({ id: newId(), ownedHardwareId: k.parts[GRINDER].id, kind: "burrs", occurredAt: at(9) });
    const id = await shot(10);
    expect((await getSuggestContext(id, at(12))).previous).toBeNull();
  });

  it("doesn't read another household's shot", async () => {
    const id = await shot(10);
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(getSuggestContext(id)).rejects.toThrow(NotFoundError);
  });
});
