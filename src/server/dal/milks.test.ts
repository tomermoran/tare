import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, milkTypes } from "@/db/schema";
import { ListNameError } from "@/domain/listName";
import { milkLabel, type MilkKey, type NamedMilk } from "@/domain/milkName";
import messages from "@/i18n/messages/en.json";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { KeepOneError } from "./drinks";
import * as milksModule from "./milks";
import { addMilk, listMilks, moveMilk, renameMilk, setMilkHidden, updateMilk } from "./milks";
import { setDrinkHidden } from "./drinks";
import { getLogContext, withChosenMilk } from "./logContext";
import { getBagRecipes, pinEnteredRecipe } from "./recipes";
import { saveMeasuredShot } from "./shots";

/*
 * The milk list (STORY-02-05-05): renaming with the shared name rule across
 * hidden milks, hiding with the keep-one rule, adding with a kind, moving,
 * and no delete. Starter milks are compared by their English name.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const en = (key: MilkKey) => (messages.milks as Record<string, string>)[key.split(".")[1]];
const label = (m: NamedMilk) => milkLabel(m, en);
const names = async () => (await listMilks()).map(label);
const oat = () => k.milk.id;

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

const whole = async () => (await addMilk({ name: "Whole milk", kind: "dairy" }, label)).id;

describe("listMilks", () => {
  it("is every milk, hidden ones included, in order, with its kind", async () => {
    const id = await whole();
    await db().update(milkTypes).set({ hidden: true }).where(eq(milkTypes.id, id));
    expect(await listMilks()).toEqual([
      { id: oat(), name: null, nameKey: "milks.oat", kind: "plant", hidden: false },
      { id, name: "Whole milk", nameKey: null, kind: "dairy", hidden: true },
    ]);
  });
});

describe("renaming a milk (AC 1)", () => {
  it("renames, and past shots keep pointing at the milk", async () => {
    const shot = newId();
    await db()
      .insert(extractions)
      .values({ id: shot, ...shotValues(k), drinkTypeId: k.drinks.latte.id, milkTypeId: oat(), milkMl: 180, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: new Date() });
    await renameMilk(oat(), "Oat (barista)", label);
    expect(await names()).toEqual(["Oat (barista)"]);
    const [row] = await db().select({ milk: extractions.milkTypeId }).from(extractions).where(eq(extractions.id, shot));
    expect(row.milk).toBe(oat());
  });

  it("refuses a name in use ignoring case, hidden milks included, and an empty one", async () => {
    const id = await whole();
    await setMilkHidden(id, true, label);
    await expect(renameMilk(oat(), "whole MILK", label)).rejects.toThrow(expect.objectContaining({ problem: "taken" }));
    await expect(renameMilk(oat(), "  ", label)).rejects.toThrow(ListNameError);
    expect(await names()).toEqual(["Oat", "Whole milk"]);
  });

  it("returns a renamed starter to its translated name, and a custom milk has none", async () => {
    await renameMilk(oat(), "Oat (barista)", label);
    await renameMilk(oat(), null, label);
    expect(await names()).toEqual(["Oat"]);
    await expect(renameMilk(await whole(), null, label)).rejects.toThrow(ListNameError);
  });
});

describe("hiding a milk (AC 2)", () => {
  it("hides and unhides, and keeps one shown", async () => {
    const id = await whole();
    await setMilkHidden(id, true, label);
    expect((await listMilks()).find((m) => m.id === id)?.hidden).toBe(true);
    await expect(setMilkHidden(oat(), true, label)).rejects.toThrow(KeepOneError);
    await setMilkHidden(id, false, label);
    await setMilkHidden(oat(), true, label);
    expect((await listMilks()).map((m) => m.hidden)).toEqual([true, false]);
  });

  it("leaves a hidden milk out of a new log's choices", async () => {
    const id = await whole();
    await setMilkHidden(id, true, label);
    expect((await getLogContext()).milks.map((m) => m.id)).toEqual([oat()]);
  });
});

describe("adding a milk (AC 3)", () => {
  it("adds it last and shown, with the kind given", async () => {
    const id = await whole();
    expect((await listMilks()).at(-1)).toEqual({ id, name: "Whole milk", nameKey: null, kind: "dairy", hidden: false });
  });

  it("refuses a taken name or an unknown kind, adding nothing", async () => {
    await expect(addMilk({ name: "oat", kind: "plant" }, label)).rejects.toThrow(ListNameError);
    await expect(addMilk({ name: "Rice", kind: "grain" as never }, label)).rejects.toThrow();
    expect(await names()).toEqual(["Oat"]);
  });

  it("never changes the kind afterwards", async () => {
    await updateMilk(oat(), { kind: "dairy" } as never, label);
    expect((await listMilks())[0].kind).toBe("plant");
  });
});

describe("moving a milk (AC 4)", () => {
  it("moves and renumbers densely", async () => {
    const w = await whole();
    const soy = (await addMilk({ name: "Soy drink", kind: "plant" }, label)).id;
    await moveMilk(soy, 0);
    expect((await listMilks()).map((m) => m.id)).toEqual([soy, oat(), w]);
    const order = await db().select({ o: milkTypes.sortOrder }).from(milkTypes).where(eq(milkTypes.householdId, k.household.id));
    expect(order.map((r) => r.o).sort()).toEqual([0, 1, 2]);
    await expect(moveMilk(soy, 3)).rejects.toThrow(RangeError);
  });
});

describe("no delete (AC 5)", () => {
  it("has no way to delete a milk", () => {
    expect(Object.keys(milksModule).filter((n) => /delete|remove/i.test(n))).toEqual([]);
  });
});

describe("hidden drinks and milks keep their data (STORY-02-05-08)", () => {
  const drinkLabelEn = () => "x";

  it("keeps a hidden drink's recipes on the bag, back in use on unhide (AC 1, AC 2)", async () => {
    const latte = k.drinks.latte.id;
    await pinEnteredRecipe({
      batchId: k.batch.id,
      setupId: k.setup.id,
      drinkTypeId: latte,
      values: {
        grind: 12,
        dose: 18,
        yield: 36,
        timeMs: 28_000,
        usedWdt: false,
        usedPuckScreen: false,
        milkTypeId: oat(),
        milkMl: 180,
        sweetened: false,
        brewTempC: null,
        brewTempStep: null,
        pressureBar: null,
        pressureStep: null,
      },
    });
    await setDrinkHidden(latte, true, drinkLabelEn);
    expect((await getBagRecipes(k.batch.id)).map((r) => r.drinkTypeId)).toEqual([latte]);
    await setDrinkHidden(latte, false, drinkLabelEn);
    expect((await getLogContext()).drinks.map((d) => d.id)).toContain(latte);
  });

  it("keeps a hidden milk that is already chosen, marked, and never offers it anew (AC 3, AC 4)", async () => {
    const w = await whole();
    await setMilkHidden(w, true, label);
    const { milks } = await getLogContext();
    expect(milks.map((m) => m.id)).toEqual([oat()]);
    expect(await withChosenMilk(milks, w)).toEqual([...milks, { id: w, name: "Whole milk", nameKey: null, hidden: true }]);
    expect(await withChosenMilk(milks, oat())).toBe(milks);
    expect(await withChosenMilk(milks, null)).toBe(milks);
  });

  it("saves a shot whose milk is hidden, without swapping it", async () => {
    const w = await whole();
    await setMilkHidden(w, true, label);
    const { id } = await saveMeasuredShot({
      setupId: k.setup.id,
      drinkTypeId: k.drinks.latte.id,
      portionId: k.portion.id,
      grind: 12,
      dose: 18,
      yield: 36,
      timeMs: 28_000,
      milkTypeId: w,
      milkMl: 180,
    });
    const [row] = await db().select({ milk: extractions.milkTypeId }).from(extractions).where(eq(extractions.id, id));
    expect(row.milk).toBe(w);
  });
});
