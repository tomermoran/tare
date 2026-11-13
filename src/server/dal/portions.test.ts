import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, extractions, stockChecks } from "@/db/schema";
import { allowedActions } from "@/domain/portionActions";
import { portionState } from "@/domain/portionState";
import { addStockCheckAction, setPortionDateAction, splitPortionAction } from "@/server/actions/portions";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getOnHand } from "./bags";
import { getLogContext } from "./logContext";
import { addStockCheck, InvalidPortionActionError, setPortionDate, splitPortion } from "./portions";
import { getRemaining } from "./remaining";
import { NotFoundError } from "./scope";
import { saveMeasuredShot } from "./shots";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "Europe/London" }));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const ZONE = "Europe/London";
const NOW = new Date("2026-03-20T09:00:00Z");
const when = (day?: string) => ({ day, now: NOW, timeZone: ZONE });
const portion = async (id = k.portion.id) => (await db().select().from(batchPortions).where(eq(batchPortions.id, id)))[0];
const state = async (id = k.portion.id) => portionState(await portion(id));

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

describe("allowedActions (STORY-03-02-02 AC 5)", () => {
  it("offers only each state's actions, and no date edits", () => {
    expect(allowedActions("unopened")).toEqual(["open", "freeze", "split"]);
    expect(allowedActions("counter")).toEqual(["weigh", "split", "freeze", "finish"]);
    expect(allowedActions("frozen")).toEqual(["thaw", "split"]);
    expect(allowedActions("thawed")).toEqual(["open", "weigh", "finish"]);
    expect(allowedActions("finished")).toEqual([]);
  });
});

describe("freezing and thawing (TASK-03-02-02-BE1)", () => {
  it("dates today by default, or an earlier day at local noon (AC 1, AC 2)", async () => {
    await setPortionDate(k.portion.id, "freeze", when());
    expect((await portion()).frozenAt).toEqual(NOW);
    await setPortionDate(k.portion.id, "thaw", when());
    expect(await state()).toBe("thawed");

    const other = { id: newId(), batchId: k.batch.id, weight: 100, createdAt: NOW };
    await db().insert(batchPortions).values(other);
    await setPortionDate(other.id, "freeze", when("2026-03-02"));
    expect((await portion(other.id)).frozenAt).toEqual(new Date("2026-03-02T12:00:00Z"));
  });

  it("never takes a future day", async () => {
    await expect(setPortionDate(k.portion.id, "freeze", when("2026-03-21"))).rejects.toMatchObject({ reason: "future" });
    expect((await portion()).frozenAt).toBeNull();
  });

  it("never freezes twice (AC 3)", async () => {
    await setPortionDate(k.portion.id, "freeze", when("2026-03-02"));
    await expect(setPortionDate(k.portion.id, "freeze", when())).rejects.toMatchObject({ reason: "notAllowed" });
    await setPortionDate(k.portion.id, "thaw", when());
    await expect(setPortionDate(k.portion.id, "freeze", when())).rejects.toMatchObject({ reason: "notAllowed" });
  });

  it("refuses a thaw before the freeze (AC 4)", async () => {
    await setPortionDate(k.portion.id, "freeze", when("2026-03-10"));
    expect(await setPortionDateAction(k.portion.id, "thaw", "2026-03-05")).toEqual({ ok: false, error: "thawBeforeFreeze" });
    expect(await state()).toBe("frozen");
  });

  it("refuses another household's portion", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(setPortionDate(k.portion.id, "freeze", when())).rejects.toBeInstanceOf(NotFoundError);
    expect(await setPortionDateAction(k.portion.id, "freeze")).toEqual({ ok: false, error: "notFound" });
  });

  it("saves a shot from a frozen portion as from frozen, changing no date (STORY-01-03-01 AC 4, STORY-03-02-03 AC 3)", async () => {
    await setPortionDate(k.portion.id, "freeze", when("2026-03-02"));
    const before = await portion();
    const { id } = await saveMeasuredShot({ setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, portionId: k.portion.id, grind: 12, dose: 18, yield: 36, timeMs: 28_000 }, NOW);
    expect(await portion()).toEqual(before);
    expect(await state()).toBe("frozen");
    const [shot] = await db().select().from(extractions).where(eq(extractions.id, id));
    expect(shot.portionId).toBe(k.portion.id);
  });
});

describe("opening and finishing (TASK-03-02-03-BE1)", () => {
  it("opens by hand, back-dated (AC 1), and the first shot opens an unopened portion (AC 2)", async () => {
    await setPortionDate(k.portion.id, "open", when("2026-03-15"));
    expect((await portion()).openedAt).toEqual(new Date("2026-03-15T12:00:00Z"));
    const fresh = { id: newId(), batchId: k.batch.id, weight: 100, createdAt: NOW };
    await db().insert(batchPortions).values(fresh);
    await saveMeasuredShot({ setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, portionId: fresh.id, grind: 12, dose: 18, yield: 36, timeMs: 28_000 }, NOW);
    expect((await portion(fresh.id)).openedAt).toEqual(NOW);
  });

  it("finishes, leaving the log's options, and the last finish leaves On hand with the shots kept (AC 4, AC 5)", async () => {
    await setPortionDate(k.portion.id, "open", when());
    await db().insert(extractions).values({ id: newId(), ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: NOW });
    expect((await getOnHand()).flatMap((g) => g.bags.map((b) => b.id))).toContain(k.batch.id);
    await setPortionDate(k.portion.id, "finish", when());
    expect(await state()).toBe("finished");
    expect((await getLogContext()).portions.map((p) => p.id)).not.toContain(k.portion.id);
    expect((await getOnHand()).flatMap((g) => g.bags.map((b) => b.id))).not.toContain(k.batch.id);
    expect(await db().select().from(extractions)).toHaveLength(1);
    await expect(setPortionDate(k.portion.id, "open", when())).rejects.toBeInstanceOf(InvalidPortionActionError);
  });
});

describe("splitting (TASK-03-02-01-BE1)", () => {
  it("takes grams into a new frozen portion of the same bag; the weights add up (AC 1, AC 2, AC 5)", async () => {
    const { id } = await splitPortion(k.portion.id, 100, { now: NOW });
    expect((await portion()).weight).toBe(150);
    expect(await portion(id)).toMatchObject({ batchId: k.batch.id, weight: 100, frozenAt: NOW });
    const left = await getRemaining([k.portion.id, id]);
    expect(left.get(k.portion.id)!.grams + left.get(id)!.grams).toBe(250);
    // Still one bag, with one roast date.
    const bags = await db().select().from(batches);
    expect(bags).toHaveLength(1);
    expect(bags[0].roastDate).toEqual(k.batch.roastDate);
  });

  it("can leave the new portion unfrozen", async () => {
    const { id } = await splitPortion(k.portion.id, 50, { freezeNew: false, now: NOW });
    expect(await state(id)).toBe("unopened");
  });

  it("never takes more than is left, or nothing (AC 3)", async () => {
    await db().insert(extractions).values({ id: newId(), ...shotValues(k), doseWeight: 50, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: NOW });
    expect(await splitPortionAction(k.portion.id, 201)).toEqual({ ok: false, error: "badWeight" });
    expect(await splitPortionAction(k.portion.id, 0)).toEqual({ ok: false, error: "badWeight" });
    expect(await splitPortionAction(k.portion.id, Number.NaN)).toEqual({ ok: false, error: "badWeight" });
    expect(await db().select().from(batchPortions)).toHaveLength(1);
    expect(await splitPortionAction(k.portion.id, 200)).toMatchObject({ ok: true });
  });

  it("splits again and again (AC 4), keeping a stock check in step (TQ-13)", async () => {
    await setPortionDate(k.portion.id, "open", when("2026-03-01"));
    await db().insert(stockChecks).values({ id: newId(), portionId: k.portion.id, remainingWeight: 200, checkedAt: new Date("2026-03-10T08:00:00Z") });
    const a = await splitPortion(k.portion.id, 60, { now: NOW });
    const b = await splitPortion(k.portion.id, 40, { now: new Date(NOW.getTime() + 1000) });
    const left = await getRemaining([k.portion.id, a.id, b.id]);
    expect(left.get(k.portion.id)!.grams).toBe(100);
    expect(left.get(a.id)!.grams + left.get(b.id)!.grams).toBe(100);
  });

  it("isn't offered on a thawed or finished portion", async () => {
    await setPortionDate(k.portion.id, "freeze", when("2026-03-01"));
    await setPortionDate(k.portion.id, "thaw", when());
    await expect(splitPortion(k.portion.id, 10)).rejects.toMatchObject({ reason: "notAllowed" });
  });
});

describe("weighing what's left (TASK-03-04-02-BE1)", () => {
  const dose = (grams: number, at: Date) =>
    db().insert(extractions).values({ id: newId(), ...shotValues(k), doseWeight: grams, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at });
  const left = async () => (await getRemaining([k.portion.id])).get(k.portion.id)!;
  const at = (minutes: number) => new Date(NOW.getTime() + minutes * 60_000);

  beforeEach(() => setPortionDate(k.portion.id, "open", when("2026-03-01")));

  it("shows the weight recorded now (AC 1)", async () => {
    await dose(18, at(-60));
    await addStockCheck(k.portion.id, 120, { now: NOW });
    expect(await left()).toEqual({ grams: 120, overLogged: false });
  });

  it("takes later doses off the weight (AC 2) and uses the latest weighing (AC 3)", async () => {
    await addStockCheck(k.portion.id, 150, { now: at(0) });
    await addStockCheck(k.portion.id, 140, { now: at(10) });
    await dose(18, at(5));
    await dose(18.5, at(20));
    expect(await left()).toEqual({ grams: 121.5, overLogged: false });
  });

  it("clears an over-logged portion", async () => {
    await dose(260, at(-60));
    expect(await left()).toEqual({ grams: 0, overLogged: true });
    await addStockCheck(k.portion.id, 30, { now: NOW });
    expect(await left()).toEqual({ grams: 30, overLogged: false });
  });

  it("accepts zero but not a negative or missing weight", async () => {
    expect(await addStockCheckAction(k.portion.id, 0)).toMatchObject({ ok: true });
    expect(await addStockCheckAction(k.portion.id, -1)).toEqual({ ok: false, error: "badWeight" });
    expect(await addStockCheckAction(k.portion.id, Number.NaN)).toEqual({ ok: false, error: "badWeight" });
    expect(await addStockCheckAction(k.portion.id, "12" as unknown as number)).toEqual({ ok: false, error: "badWeight" });
  });

  it("is only for open or thawed portions", async () => {
    await setPortionDate(k.portion.id, "freeze", when());
    await expect(addStockCheck(k.portion.id, 100)).rejects.toMatchObject({ reason: "notAllowed" });
  });

  it("can't weigh another household's portion", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(addStockCheck(k.portion.id, 100)).rejects.toBeInstanceOf(NotFoundError);
  });
});
