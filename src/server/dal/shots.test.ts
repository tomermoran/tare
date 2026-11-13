import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { batchPortions, extractions, ownedHardware, setupParts } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { saveMeasuredShotAction } from "@/server/actions/shots";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { addBag } from "./bags";
import { getLogContext } from "./logContext";
import { NotFoundError } from "./scope";
import { InvalidShotError, PortionFinishedError, saveMeasuredShot } from "./shots";

const ids = vi.hoisted(() => ({ next: null as string | null }));
vi.mock("@/db/ids", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/db/ids")>();
  return { ...real, newId: () => ids.next ?? real.newId() };
});
vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "Asia/Jerusalem" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const NOW = new Date("2026-01-20T07:30:00Z");

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});
afterEach(() => {
  ids.next = null;
});

const input = (over: Partial<Parameters<typeof saveMeasuredShot>[0]> = {}) => ({
  setupId: k.setup.id,
  drinkTypeId: k.drinks.espresso.id,
  portionId: k.portion.id,
  grind: 12.5,
  dose: 18.2,
  yield: 38.4,
  timeMs: 27_600,
  ...over,
});
const shot = async (id: string) => (await db().select().from(extractions).where(eq(extractions.id, id)))[0];
const portion = async (id = k.portion.id) => (await db().select().from(batchPortions).where(eq(batchPortions.id, id)))[0];

describe("saveMeasuredShot", () => {
  it("stores every field as measured, with persona and logger (AC 1)", async () => {
    const { id } = await saveMeasuredShot(input(), NOW);
    expect(await shot(id)).toMatchObject({
      householdId: k.household.id,
      personaId: k.persona.id,
      loggedByUserId: k.user.id,
      setupId: k.setup.id,
      portionId: k.portion.id,
      drinkTypeId: k.drinks.espresso.id,
      entryMode: "measured",
      grindSize: 12.5,
      doseWeight: 18.2,
      yieldWeight: 38.4,
      yieldTime: 27_600,
      sweetened: false,
      createdAt: NOW,
    });
  });

  it("records sweetened as given, and not sweetened by default (STORY-01-03-04)", async () => {
    const yes = await saveMeasuredShot(input({ sweetened: true, drinkTypeId: k.drinks.latte.id }));
    const no = await saveMeasuredShot(input({ sweetened: false }));
    const unset = await saveMeasuredShot(input());
    expect((await shot(yes.id)).sweetened).toBe(true);
    expect((await shot(no.id)).sweetened).toBe(false);
    expect((await shot(unset.id)).sweetened).toBe(false);
  });

  it("keeps the setup and its parts after parts change (AC 2)", async () => {
    const { id } = await saveMeasuredShot(input());
    const parts = (await db().select().from(setupParts).where(eq(setupParts.setupId, k.setup.id))).map((p) => p.ownedHardwareId);
    // A new grinder joins the household; the old setup is untouched.
    await db().insert(ownedHardware).values({ id: "new-grinder", householdId: k.household.id, hardwareId: k.parts[1].hardwareId });
    expect((await shot(id)).setupId).toBe(k.setup.id);
    const after = (await db().select().from(setupParts).where(eq(setupParts.setupId, k.setup.id))).map((p) => p.ownedHardwareId);
    expect(after.sort()).toEqual(parts.sort());
  });

  it("opens an unopened portion with the shot (STORY-03-01-03 AC 3)", async () => {
    expect((await portion()).openedAt).toBeNull();
    await saveMeasuredShot(input(), NOW);
    expect((await portion()).openedAt).toEqual(NOW);
    // Later shots don't move it.
    await saveMeasuredShot(input(), new Date("2026-01-21T07:00:00Z"));
    expect((await portion()).openedAt).toEqual(NOW);
  });

  it("changes no date of a frozen portion (STORY-01-03-01 AC 4)", async () => {
    const frozenAt = new Date("2026-01-10T10:00:00Z");
    await db().update(batchPortions).set({ frozenAt }).where(eq(batchPortions.id, k.portion.id));
    await saveMeasuredShot(input(), NOW);
    expect(await portion()).toMatchObject({ frozenAt, openedAt: null, thawedAt: null, finishedAt: null });
  });

  it("refuses a finished portion and saves nothing", async () => {
    await db().update(batchPortions).set({ finishedAt: NOW }).where(eq(batchPortions.id, k.portion.id));
    await expect(saveMeasuredShot(input())).rejects.toBeInstanceOf(PortionFinishedError);
    expect(await db().select().from(extractions)).toHaveLength(0);
  });

  it.each([
    ["dose", { dose: 0 }],
    ["yield", { yield: Number.NaN }],
    ["time", { timeMs: -1 }],
    ["grind", { grind: Number.POSITIVE_INFINITY }],
  ])("refuses a bad %s and saves nothing", async (_, over) => {
    await expect(saveMeasuredShot(input(over))).rejects.toBeInstanceOf(InvalidShotError);
    expect(await db().select().from(extractions)).toHaveLength(0);
  });

  it("writes nothing when saving fails partway (AC 4)", async () => {
    const { id } = await saveMeasuredShot(input({ portionId: k.portion.id }));
    // A second, unopened bag; its shot collides with the first shot's id.
    const bag = await addBag({ beanId: k.bean.id, bagWeight: 250 });
    ids.next = id;
    await expect(saveMeasuredShot(input({ portionId: bag.portionId }))).rejects.toThrow();
    ids.next = null;
    expect(await db().select().from(extractions)).toHaveLength(1);
    expect((await portion(bag.portionId)).openedAt).toBeNull();
  });

  it("refuses another household's setup, drink or portion", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(saveMeasuredShot(input())).rejects.toBeInstanceOf(NotFoundError);
    expect(await db().select().from(extractions)).toHaveLength(0);
  });
});

describe("saveMeasuredShotAction", () => {
  it("returns the shot, or a named failure that keeps the log's values", async () => {
    const saved = await saveMeasuredShotAction(input());
    expect(saved).toMatchObject({ ok: true });
    expect(await saveMeasuredShotAction(input({ dose: -2 }))).toEqual({ ok: false, error: "saveFailed" });
    expect(await saveMeasuredShotAction(input({ portionId: "nope" }))).toEqual({ ok: false, error: "notFound" });
    await db().update(batchPortions).set({ finishedAt: NOW }).where(eq(batchPortions.id, k.portion.id));
    expect(await saveMeasuredShotAction(input())).toEqual({ ok: false, error: "portionFinished" });
  });
});

describe("a new bag is ready to brew (STORY-03-01-03)", () => {
  it("is one unopened portion of the whole weight, offered in the log, opened by the first shot", async () => {
    await loadSeed(db(), hardware as HardwareSeed, coffee as CoffeeSeed);
    const { portionId } = await addBag({ beanId: seedIds.bean("portofino", "signia"), bagWeight: 1000 });

    // AC 1: one unopened portion of the full weight.
    expect(await portion(portionId)).toMatchObject({ weight: 1000, openedAt: null, frozenAt: null, finishedAt: null });

    // AC 2: offered in the shot log.
    const context = await getLogContext();
    expect(context.portions.find((p) => p.id === portionId)).toMatchObject({ state: "unopened", frozen: false });

    // AC 3: the first measured shot opens it that day.
    await saveMeasuredShot(input({ portionId }), NOW);
    expect((await portion(portionId)).openedAt).toEqual(NOW);
  });
});
