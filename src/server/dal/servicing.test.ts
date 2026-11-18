import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, canonicalHardware, extractions, maintenanceEvents, ownedHardware, pinnedRecipes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getGrindAdjustment } from "./grindAdjustment";
import { getHome } from "./home";
import { getDialInFromRecipe, getFixStart } from "./logStart";
import { pullShot } from "./pull";
import { getBagRecipes, getCoffeeRecipes, getCurrentRecipe, pinPreview } from "./recipes";

/*
 * Servicing on read (TASK-04-03-03-BE2): every reader of a recipe's grind
 * applies the confirmed shifts after its pin on its own grinder; the stored
 * row never changes, and drift judges shots against the shifted grind so the
 * shift is applied once, never twice.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const DAY = 86_400_000;
const ago = (d: number) => new Date(Date.now() - d * DAY);
const key = () => ({ beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id });

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  await db().update(batchPortions).set({ openedAt: ago(20) });
  vi.spyOn(console, "info").mockImplementation(() => {});
});

const pin = (d: number, over: Partial<typeof pinnedRecipes.$inferInsert> = {}) =>
  db()
    .insert(pinnedRecipes)
    .values({ id: newId(), ...shotValues(k), beanId: k.bean.id, grindSize: 15, yieldTime: 28_000, pinnedAt: ago(d), ...over });
const event = (d: number, grindShift: number | null, partId = k.parts[1].id) =>
  db().insert(maintenanceEvents).values({ id: newId(), ownedHardwareId: partId, kind: "burrs", isRecalibration: true, occurredAt: ago(d), grindShift, grindScale: grindShift === null ? null : 1 });

describe("resolveRecipeGrind at each reader", () => {
  it("shifts a recipe pinned before a confirmed event, and keeps the stored row (AC 1, AC 2)", async () => {
    await pin(10);
    await event(5, -2);
    const r = await getCurrentRecipe(key());
    expect(r?.grind).toBe(13);
    expect(r?.servicing).toEqual([expect.objectContaining({ from: 15, to: 13 })]);
    const [row] = await db().select().from(pinnedRecipes);
    expect(row.grindSize).toBe(15);
    expect((await getCoffeeRecipes(k.bean.id))[0].grind).toBe(13);
    expect((await getBagRecipes(k.batch.id)).coffee[0].grind).toBe(13);
  });

  it("leaves a recipe pinned after the event, or on another grinder, unshifted (AC 3)", async () => {
    await event(5, -2);
    await pin(3);
    expect((await getCurrentRecipe(key()))?.grind).toBe(15);
  });

  it("ignores another grinder's shift (AC 3)", async () => {
    const [model] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.kind, "grinder"));
    const other = newId();
    await db().insert(ownedHardware).values({ id: other, householdId: k.household.id, hardwareId: model.id });
    await pin(10);
    await event(5, -2, other);
    expect((await getCurrentRecipe(key()))?.grind).toBe(15);
  });

  it("applies several events in date order (AC 4)", async () => {
    await pin(10);
    await event(5, 1);
    await event(8, -3);
    const r = await getCurrentRecipe(key());
    expect(r?.grind).toBe(13);
    expect(r?.servicing?.map((s) => s.to)).toEqual([12, 13]);
  });

  it("shows on Brew, the dial-in, a fix, the pin sheet and the pull", async () => {
    await pin(10);
    await event(5, -2);
    const home = await getHome({ drinkId: k.drinks.espresso.id });
    expect(home?.state.kind === "recipe" && home.state.recipe.grind).toBe(13);
    expect((await getDialInFromRecipe({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }))?.start.grind).toBe(13);
    const pulled = await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id, useRecipeGrind: true });
    const shotId = (pulled as { shotId: string }).shotId;
    const [shot] = await db().select().from(extractions).where(eq(extractions.id, shotId));
    expect(shot.grindSize).toBe(13);
    expect((await getFixStart(shotId)).start.grind).toBe(13);
    const measured = newId();
    await db().insert(extractions).values({ id: measured, ...shotValues(k), grindSize: 12, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: ago(0.1) });
    expect((await pinPreview(measured)).replaces?.grind).toBe(13);
  });
});

describe("drift with a confirmed shift (TD-2)", () => {
  it("applies the shift once: shots at the shifted grind give no further move", async () => {
    await pin(10);
    await event(5, -2);
    for (const d of [0.1, 1, 2]) {
      await db().insert(extractions).values({ id: newId(), ...shotValues(k), grindSize: 13, yieldTime: 28_000, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: ago(d) });
    }
    expect(await getGrindAdjustment({ recipe: { beanId: k.bean.id, setupId: k.setup.id, grind: 13 }, portionId: k.portion.id })).toBeNull();
  });
});
