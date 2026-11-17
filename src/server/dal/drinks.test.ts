import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { drinkTypes, extractions, pinnedRecipes } from "@/db/schema";
import { drinkLabel, type DrinkKey, type NamedDrink } from "@/domain/drinkName";
import { checkListName, LIST_NAME_MAX, ListNameError } from "@/domain/listName";
import messages from "@/i18n/messages/en.json";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import {
  addDrink,
  InvalidUsualMilkError,
  KeepOneError,
  listDrinks,
  moveDrink,
  NEW_DRINK_MILK_ML,
  renameDrink,
  setDrinkHidden,
  setUsualMilk,
  updateDrink,
} from "./drinks";
import { getHome } from "./home";
import { getJournalFilterOptions } from "./journal";
import { getLogContext } from "./logContext";
import { getCurrentRecipe } from "./recipes";
import { NotFoundError } from "./scope";

/*
 * The drink list (EPIC-02-05, wave 19a): renaming with the shared name rule,
 * hiding with the keep-one rule, adding with milk chosen once, moving, and
 * the usual milk amount. Starter drinks are compared by their English name.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number, hour = 8) => new Date(Date.UTC(2026, 2, day, hour));
const en = (key: DrinkKey) => {
  const [, name] = key.split(".");
  return (messages.drinks as Record<string, string>)[name];
};
const label = (d: NamedDrink) => drinkLabel(d, en);
const names = async () => (await listDrinks()).map(label);
const espresso = () => k.drinks.espresso.id;
const latte = () => k.drinks.latte.id;

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

describe("checkListName (the shared rule)", () => {
  it("trims, needs a name, and is unique ignoring case", () => {
    expect(checkListName("  Morning cup ", ["Latte"])).toBe("Morning cup");
    expect(() => checkListName("   ", [])).toThrow(ListNameError);
    expect(() => checkListName("latte", ["Latte"])).toThrow(expect.objectContaining({ problem: "taken" }));
    expect(checkListName("x".repeat(LIST_NAME_MAX), [])).toHaveLength(LIST_NAME_MAX);
    expect(() => checkListName("x".repeat(LIST_NAME_MAX + 1), [])).toThrow();
  });
});

describe("listDrinks", () => {
  it("is every drink, hidden ones included, in order", async () => {
    await db().update(drinkTypes).set({ hidden: true }).where(eq(drinkTypes.id, latte()));
    expect(await listDrinks()).toEqual([
      { id: espresso(), name: null, nameKey: "drinks.espresso", hasMilk: false, typicalMilkMl: null, hidden: false },
      { id: latte(), name: null, nameKey: "drinks.latte", hasMilk: true, typicalMilkMl: 180, hidden: true },
    ]);
  });
});

describe("renaming a drink (STORY-02-05-01)", () => {
  it("shows the new name everywhere a drink is named, and leaves recipes alone (AC 1, AC 5)", async () => {
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, drinkTypeId: latte(), milkMl: 150, pinnedAt: at(1) });
    const before = await getCurrentRecipe({ beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id, drinkTypeId: latte() });
    await renameDrink(latte(), "  Morning latte ", label);
    expect(await names()).toEqual(["Espresso", "Morning latte"]);
    const log = await getLogContext({ drinkId: latte() });
    expect(log.drinks.map(label)).toContain("Morning latte");
    expect(await getCurrentRecipe({ beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id, drinkTypeId: latte() })).toEqual(before);
  });

  it("returns a renamed starter to its translated name (AC 2)", async () => {
    await renameDrink(latte(), "Morning latte", label);
    await renameDrink(latte(), null, label);
    expect((await listDrinks())[1]).toMatchObject({ name: null, nameKey: "drinks.latte" });
  });

  it("refuses an empty name or one in use, hidden drinks and starter names included, changing nothing (AC 3)", async () => {
    await expect(renameDrink(latte(), "  ", label)).rejects.toMatchObject({ problem: "required" });
    await expect(renameDrink(latte(), "ESPRESSO", label)).rejects.toMatchObject({ problem: "taken" });
    await db().update(drinkTypes).set({ hidden: true, name: "Old cup" }).where(eq(drinkTypes.id, espresso()));
    await expect(renameDrink(latte(), "old CUP", label)).rejects.toMatchObject({ problem: "taken" });
    expect((await listDrinks())[1].name).toBeNull();
  });

  it("keeps a 40-character name whole (AC 4)", async () => {
    const long = "A very long name for a weekend flat white";
    expect(long.length).toBeGreaterThan(LIST_NAME_MAX);
    await renameDrink(latte(), long.slice(0, LIST_NAME_MAX), label);
    expect((await listDrinks())[1].name).toBe(long.slice(0, LIST_NAME_MAX));
  });

  it("can't reset a drink of the household's own, or rename another household's", async () => {
    const { id } = await addDrink({ name: "Cold brew", hasMilk: false }, label);
    await expect(renameDrink(id, null, label)).rejects.toBeInstanceOf(ListNameError);
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(renameDrink(latte(), "Mine", label)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("changes nothing at all when one part of a save is refused (AC 6)", async () => {
    await expect(updateDrink(latte(), { name: "Espresso", typicalMilkMl: 200 }, label)).rejects.toBeInstanceOf(ListNameError);
    expect((await listDrinks())[1]).toMatchObject({ name: null, typicalMilkMl: 180 });
  });
});

describe("hiding drinks (STORY-02-05-02)", () => {
  it("takes it off Brew, the log and the Journal filter, and puts it back on unhide (AC 1, AC 4)", async () => {
    await setDrinkHidden(latte(), true, label);
    expect((await getLogContext()).drinks.map((d) => d.id)).toEqual([espresso()]);
    expect((await getJournalFilterOptions()).drinks.map((d) => d.id)).toEqual([espresso()]);
    await setDrinkHidden(latte(), false, label);
    expect((await getLogContext()).drinks.map((d) => d.id)).toEqual([espresso(), latte()]);
  });

  it("keeps it on past shots and as the Journal filter in view (AC 2)", async () => {
    await db().insert(extractions).values({ id: newId(), ...shotValues(k), drinkTypeId: latte(), milkMl: 150, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(1) });
    await setDrinkHidden(latte(), true, label);
    expect((await getJournalFilterOptions({ drinkId: latte() })).drinks.map((d) => d.id)).toContain(latte());
    const [shot] = await db().select({ drink: extractions.drinkTypeId }).from(extractions);
    expect(shot.drink).toBe(latte());
  });

  it("moves Brew to the next shown drink when the one for this time is hidden (AC 3)", async () => {
    await db().insert(extractions).values({ id: newId(), ...shotValues(k), drinkTypeId: latte(), milkMl: 150, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(19) });
    expect((await getHome({}, at(20)))!.drink.id).toBe(latte());
    await setDrinkHidden(latte(), true, label);
    expect((await getHome({}, at(20)))!.drink.id).toBe(espresso());
  });

  it("won't hide the last shown drink (AC 5)", async () => {
    await setDrinkHidden(latte(), true, label);
    await expect(setDrinkHidden(espresso(), true, label)).rejects.toBeInstanceOf(KeepOneError);
    expect((await listDrinks()).filter((d) => !d.hidden)).toHaveLength(1);
  });
});

describe("adding a drink (STORY-02-05-03)", () => {
  it("adds a plain drink last, shown on Brew and in the log, with no milk fields (AC 1)", async () => {
    const { id } = await addDrink({ name: "Cold brew", hasMilk: false }, label);
    expect((await listDrinks()).at(-1)).toEqual({ id, name: "Cold brew", nameKey: null, hasMilk: false, typicalMilkMl: null, hidden: false });
    expect((await getLogContext()).drinks.map((d) => d.id)).toEqual([espresso(), latte(), id]);
  });

  it("gives a milk drink a usual amount, 120 ml unless set (AC 2)", async () => {
    const froth = await addDrink({ name: "Americano with froth", hasMilk: true }, label);
    const small = await addDrink({ name: "Small cortado", hasMilk: true, typicalMilkMl: 30 }, label);
    const list = await listDrinks();
    expect(list.find((d) => d.id === froth.id)?.typicalMilkMl).toBe(NEW_DRINK_MILK_ML);
    expect(list.find((d) => d.id === small.id)?.typicalMilkMl).toBe(30);
  });

  it("never changes whether an existing drink has milk (AC 3)", async () => {
    await expect(updateDrink(espresso(), { hasMilk: true } as never, label)).rejects.toThrow();
    expect((await listDrinks())[0].hasMilk).toBe(false);
  });

  it("keeps its recipes apart from other drinks' (AC 4)", async () => {
    const { id } = await addDrink({ name: "Americano with froth", hasMilk: true, typicalMilkMl: 30 }, label);
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, drinkTypeId: id, milkMl: 30, pinnedAt: at(1) });
    const key = { beanId: k.bean.id, personaId: k.persona.id, setupId: k.setup.id };
    expect(await getCurrentRecipe({ ...key, drinkTypeId: id })).not.toBeNull();
    expect(await getCurrentRecipe({ ...key, drinkTypeId: espresso() })).toBeNull();
  });

  it("refuses no name or a used one, saving nothing (AC 5)", async () => {
    await expect(addDrink({ name: " ", hasMilk: false }, label)).rejects.toMatchObject({ problem: "required" });
    await expect(addDrink({ name: "latte", hasMilk: true }, label)).rejects.toMatchObject({ problem: "taken" });
    expect(await listDrinks()).toHaveLength(2);
  });

  it("refuses a usual amount outside 0 to 500 in tens", async () => {
    await expect(addDrink({ name: "Big one", hasMilk: true, typicalMilkMl: 510 }, label)).rejects.toBeInstanceOf(InvalidUsualMilkError);
    expect(await listDrinks()).toHaveLength(2);
  });
});

describe("moving drinks (STORY-02-05-04)", () => {
  async function four() {
    for (const name of ["Cortado", "Lungo"]) await addDrink({ name, hasMilk: false }, label);
  }

  it("moves up, down, to first and to last exactly, and every chooser follows (AC 1)", async () => {
    await four();
    const id = (await listDrinks())[2].id;
    await moveDrink(id, 0);
    expect(await names()).toEqual(["Cortado", "Espresso", "Latte", "Lungo"]);
    await moveDrink(id, 3);
    expect(await names()).toEqual(["Espresso", "Latte", "Lungo", "Cortado"]);
    await moveDrink(latte(), 2);
    expect(await names()).toEqual(["Espresso", "Lungo", "Latte", "Cortado"]);
    expect((await getLogContext()).drinks.map(label)).toEqual(["Espresso", "Lungo", "Latte", "Cortado"]);
  });

  it("keeps hidden drinks in their place", async () => {
    await four();
    await setDrinkHidden(latte(), true, label);
    await moveDrink(espresso(), 3);
    expect(await names()).toEqual(["Latte", "Cortado", "Lungo", "Espresso"]);
  });

  it("changes nothing when a move fails (AC 3)", async () => {
    await expect(moveDrink(espresso(), 9)).rejects.toThrow();
    expect(await names()).toEqual(["Espresso", "Latte"]);
  });

  it("puts a new drink last (AC 4)", async () => {
    await moveDrink(latte(), 0);
    await addDrink({ name: "Cold brew", hasMilk: false }, label);
    expect(await names()).toEqual(["Latte", "Espresso", "Cold brew"]);
  });
});

describe("the usual milk amount (STORY-02-05-06)", () => {
  it("is where a new log of the drink starts, and leaves past shots and recipes alone (AC 1, AC 3)", async () => {
    const shotId = newId();
    await db().insert(extractions).values({ id: shotId, ...shotValues(k), drinkTypeId: latte(), milkMl: 150, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(1) });
    await setUsualMilk(latte(), 220, label);
    expect((await getLogContext({ drinkId: latte() })).drinks.find((d) => d.id === latte())?.typicalMilkMl).toBe(220);
    expect((await db().select({ ml: extractions.milkMl }).from(extractions).where(eq(extractions.id, shotId)))[0].ml).toBe(150);
  });

  it("asks nothing of a drink without milk, and keeps to 0 to 500 in tens (AC 2)", async () => {
    await expect(setUsualMilk(espresso(), 100, label)).rejects.toBeInstanceOf(InvalidUsualMilkError);
    await expect(setUsualMilk(latte(), 505, label)).rejects.toBeInstanceOf(InvalidUsualMilkError);
    await expect(setUsualMilk(latte(), -10, label)).rejects.toBeInstanceOf(InvalidUsualMilkError);
    await setUsualMilk(latte(), 0, label);
    expect((await listDrinks())[1].typicalMilkMl).toBe(0);
  });
});
