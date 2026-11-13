import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalHardware, extractions } from "@/db/schema";
import { InvalidBrewControlsError } from "@/domain/brewControls";
import { InvalidMilkError } from "@/domain/milk";
import { InvalidTastingError } from "@/domain/tasting";
import { updateShotAction } from "@/server/actions/shots";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { NotFoundError } from "./scope";
import { InvalidShotError, saveMeasuredShot, updateShot } from "./shots";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const NOW = new Date("2026-02-01T08:00:00Z");

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

const measured = async (over: Partial<Parameters<typeof saveMeasuredShot>[0]> = {}) =>
  (
    await saveMeasuredShot(
      { setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, portionId: k.portion.id, grind: 12, dose: 18, yield: 36, timeMs: 28_000, ...over },
      NOW,
    )
  ).id;
const row = async (id: string) => (await db().select().from(extractions).where(eq(extractions.id, id)))[0];
const setMachine = (capabilities: unknown) =>
  db().update(canonicalHardware).set({ capabilities }).where(eq(canonicalHardware.id, k.parts[0].hardwareId));

describe("updateShot (TASK-02-06-02-BE1)", () => {
  it("changes values, prep, sweetened and taste together, keeping context (AC 1, AC 3, AC 4)", async () => {
    const id = await measured();
    const before = await row(id);
    await updateShot(id, {
      grind: 13.5,
      dose: 18.5,
      yield: 40,
      timeMs: 31_200,
      sweetened: true,
      usedWdt: true,
      usedPuckScreen: true,
      taste: { rating: 4, balance: -1, tags: ["channelling"] },
    });
    const after = await row(id);
    expect(after).toMatchObject({
      grindSize: 13.5,
      doseWeight: 18.5,
      yieldWeight: 40,
      yieldTime: 31_200,
      sweetened: true,
      usedWdt: true,
      usedPuckScreen: true,
      userRating: 4,
      tasteBalance: -1,
      tasteTags: ["channelling"],
    });
    // Whose taste, who logged it, and the rest of the context stay as they were.
    for (const key of ["personaId", "loggedByUserId", "setupId", "portionId", "drinkTypeId", "entryMode", "createdAt", "householdId"] as const) {
      expect(after[key]).toEqual(before[key]);
    }
  });

  it("ignores context fields sent anyway", async () => {
    const id = await measured();
    const other = await makeHousehold(db());
    await updateShot(id, { setupId: other.household.id, entryMode: "one-tap", personaId: "x" } as never);
    expect(await row(id)).toMatchObject({ setupId: k.setup.id, entryMode: "measured", personaId: k.persona.id });
  });

  it("follows the new dose, which remaining coffee is derived from (AC 5)", async () => {
    const id = await measured({ dose: 18 });
    await updateShot(id, { dose: 20 });
    expect((await row(id)).doseWeight).toBe(20);
  });

  it("keeps a one-tap shot one-tap, with its reaction, and never rates it (AC 2, AC 4)", async () => {
    const id = await measured();
    await db().update(extractions).set({ entryMode: "one-tap", reaction: "off" }).where(eq(extractions.id, id));
    await updateShot(id, { dose: 18.4, taste: { strength: 1, tags: ["flat"] } });
    expect(await row(id)).toMatchObject({ entryMode: "one-tap", reaction: "off", doseWeight: 18.4, tasteStrength: 1, tasteTags: ["flat"], userRating: null });
    await expect(updateShot(id, { taste: { rating: 3 } })).rejects.toBeInstanceOf(InvalidTastingError);
    expect((await row(id)).userRating).toBeNull();
  });

  it("changes milk on a milk drink only, from the household's list", async () => {
    const latte = await measured({ drinkTypeId: k.drinks.latte.id, milkTypeId: k.milk.id, milkMl: 150 });
    await updateShot(latte, { milkTypeId: k.milk.id, milkMl: 200 });
    expect((await row(latte)).milkMl).toBe(200);
    const espresso = await measured();
    await expect(updateShot(espresso, { milkTypeId: k.milk.id, milkMl: 100 })).rejects.toBeInstanceOf(InvalidMilkError);
    await expect(updateShot(latte, { milkTypeId: k.milk.id, milkMl: 205 })).rejects.toBeInstanceOf(InvalidMilkError);
  });

  it("keeps a stored value outside today's ranges when it isn't changed (STORY-01-06-09 AC 4)", async () => {
    await setMachine({ temperature: { control: "exact", unit: "C", min: 85, max: 96, step: 0.5 }, pressure: { control: "none", gauge: false } });
    const id = await measured({ brewTempC: 95 });
    // The machine's range is narrowed later; the old 95 °C no longer fits.
    await setMachine({ temperature: { control: "exact", unit: "C", min: 88, max: 94, step: 0.5 }, pressure: { control: "none", gauge: false } });
    await updateShot(id, { dose: 18.2, brewTempC: 95, brewTempStep: null });
    expect(await row(id)).toMatchObject({ brewTempC: 95, doseWeight: 18.2 });
    // A changed value must fit.
    await expect(updateShot(id, { brewTempC: 96 })).rejects.toBeInstanceOf(InvalidBrewControlsError);
    await updateShot(id, { brewTempC: 93 });
    expect((await row(id)).brewTempC).toBe(93);
  });

  it("refuses bad values and another household's shot, changing nothing", async () => {
    const id = await measured();
    await expect(updateShot(id, { dose: -1 })).rejects.toBeInstanceOf(InvalidShotError);
    await expect(updateShot(id, { timeMs: Number.NaN })).rejects.toBeInstanceOf(InvalidShotError);
    expect(await updateShotAction(id, { yield: 900 })).toEqual({ ok: false, error: "saveFailed" });
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(updateShot(id, { dose: 19 })).rejects.toBeInstanceOf(NotFoundError);
    expect(await updateShotAction(id, { dose: 19 })).toEqual({ ok: false, error: "notFound" });
    expect((await row(id)).doseWeight).toBe(18);
  });
});
