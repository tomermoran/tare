import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, extractions, personas } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getHome } from "./home";
import { actingPersona, forPersona, mainPersona } from "./persona";
import { getOffContext } from "./reaction";
import { getDialInStart } from "./dialIn";
import { getDialInFromRecipe } from "./logStart";
import { pullShot } from "./pull";
import { getCoffeeRecipes, pinEnteredRecipe, pinFromShot, pinPreview } from "./recipes";

/*
 * Whose taste a read or write is for (TASK-05-01-03-BE1, BE2): the main
 * persona, the one chosen on Brew, and two personas never mixing.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));
vi.mock("@/server/personaChoice", () => import("@/test/mocks/personaChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
let guest: string;
const db = () => testContext.db!;
const NOW = new Date(Date.UTC(2026, 2, 2, 8));

beforeEach(async () => {
  testContext.db = await createTestDb();
  testContext.setupChoice = null;
  testContext.personaChoice = null;
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  guest = newId();
  await db().insert(personas).values({ id: guest, householdId: k.household.id, name: "Guest", isDefault: false });
});

describe("the main and acting persona (STORY-05-01-03)", () => {
  it("is the household's default when nobody has claimed one", async () => {
    expect((await mainPersona()).id).toBe(k.persona.id);
    expect((await actingPersona()).id).toBe(k.persona.id);
  });

  it("is the persona the signed-in user has claimed", async () => {
    await db().update(personas).set({ userId: null }).where(eq(personas.id, k.persona.id));
    await db().update(personas).set({ userId: k.user.id }).where(eq(personas.id, guest));
    expect((await mainPersona()).id).toBe(guest);
  });

  it("acts for the person chosen on Brew", async () => {
    testContext.personaChoice = guest;
    expect((await actingPersona()).id).toBe(guest);
    expect((await mainPersona()).id).toBe(k.persona.id);
  });

  it("falls back to the main persona for another household's or a removed persona", async () => {
    testContext.personaChoice = (await makeHousehold(db())).persona.id;
    expect((await actingPersona()).id).toBe(k.persona.id);
    testContext.personaChoice = "gone";
    expect((await actingPersona()).id).toBe(k.persona.id);
  });
});

const values = (grind: number) => ({
  grind,
  dose: 18,
  yield: 36,
  timeMs: 28_000,
  brewTempC: null,
  brewTempStep: null,
  pressureBar: null,
  pressureStep: null,
  usedWdt: false,
  usedPuckScreen: false,
  milkTypeId: null,
  milkMl: null,
  sweetened: false,
});
const pin = (grind: number) => pinEnteredRecipe({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, values: values(grind) }, NOW);

describe("two personas never mix (TASK-05-01-03-BE2)", () => {
  it("keeps each persona's recipes apart", async () => {
    await pin(12);
    testContext.personaChoice = guest;
    expect(await getCoffeeRecipes(k.bean.id)).toEqual([]);
    await pin(16);
    expect((await getCoffeeRecipes(k.bean.id)).map((r) => r.grind)).toEqual([16]);
    testContext.personaChoice = null;
    expect((await getCoffeeRecipes(k.bean.id)).map((r) => r.grind)).toEqual([12]);
  });

  it("gives Brew the chosen persona's recipe, and none to a persona without one", async () => {
    await pin(12);
    const home = await getHome({ drinkId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    expect(home?.state).toMatchObject({ kind: "recipe", recipe: { grind: 12 } });
    testContext.personaChoice = guest;
    const theirs = await getHome({ drinkId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    expect(theirs?.state.kind).not.toBe("recipe");
  });

  it("records a pull for the chosen persona, logged by the user", async () => {
    await pin(12);
    testContext.personaChoice = guest;
    await pin(14);
    await db().update(batchPortions).set({ openedAt: NOW }).where(eq(batchPortions.id, k.portion.id));
    await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    const [shot] = await db().select().from(extractions);
    expect(shot).toMatchObject({ personaId: guest, loggedByUserId: k.user.id, grindSize: 14 });
  });

  it("gives a persona its own usual drink", async () => {
    await db().insert(extractions).values({
      id: newId(),
      ...shotValues(k),
      drinkTypeId: k.drinks.latte.id,
      loggedByUserId: k.user.id,
      portionId: k.portion.id,
      entryMode: "measured",
      createdAt: new Date(NOW.getTime() - 3_600_000),
    });
    expect((await getHome({}, NOW))?.usual.drinkId).toBe(k.drinks.latte.id);
    testContext.personaChoice = guest;
    expect((await getHome({}, NOW))?.usual.drinkId).not.toBe(k.drinks.latte.id);
  });
});

describe("saying whose it is (TASK-05-01-04-BE1)", () => {
  const measured = (personaId: string) =>
    db().insert(extractions).values({
      id: newId(),
      ...shotValues(k),
      personaId,
      grindSize: 11,
      loggedByUserId: k.user.id,
      portionId: k.portion.id,
      entryMode: "measured",
      createdAt: NOW,
    }).returning({ id: extractions.id }).then(([r]) => r.id);

  it("says nothing with only the main profile (AC 2)", async () => {
    await db().delete(personas).where(eq(personas.id, guest));
    expect(await forPersona()).toBeNull();
  });

  it("names the acting persona, or the one given", async () => {
    expect(await forPersona()).toEqual({ name: null });
    testContext.personaChoice = guest;
    expect(await forPersona()).toEqual({ name: "Guest" });
    expect(await forPersona(k.persona.id)).toEqual({ name: null });
  });

  it("pins a guest's shot as the guest's recipe, leaving the main persona's alone (AC 3)", async () => {
    await pin(12);
    const shotId = await measured(guest);
    expect((await pinPreview(shotId)).persona).toEqual({ name: "Guest" });
    await pinFromShot(shotId, NOW);
    expect((await getCoffeeRecipes(k.bean.id)).map((r) => r.grind)).toEqual([12]);
    testContext.personaChoice = guest;
    expect((await getCoffeeRecipes(k.bean.id)).map((r) => r.grind)).toEqual([11]);
  });

  it("says whose taste a one-tap shot's answers are", async () => {
    await pin(12);
    testContext.personaChoice = guest;
    await pin(14);
    await db().update(batchPortions).set({ openedAt: NOW }).where(eq(batchPortions.id, k.portion.id));
    const pulled = await pullShot({ clientId: newId(), drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id }, NOW);
    testContext.personaChoice = null;
    expect(pulled.kind).toBe("pulled");
    if (pulled.kind === "pulled") expect((await getOffContext(pulled.shotId, NOW)).persona).toEqual({ name: "Guest" });
  });
});

describe("starting from another profile's recipe (TASK-05-01-05-BE1, QA1)", () => {
  const espresso = () => ({ drinkTypeId: k.drinks.espresso.id, beanId: k.bean.id });
  const third = async () => {
    const id = newId();
    await db().insert(personas).values({ id, householdId: k.household.id, name: "Person B", isDefault: false });
    return id;
  };

  it("offers only Dial in, from the main persona's recipe, and says whose (AC 1, AC 3)", async () => {
    await pin(12);
    testContext.personaChoice = guest;
    const home = await getHome(espresso(), NOW);
    expect(home?.state).toEqual({ kind: "borrowed", from: { name: null } });
    const start = await getDialInFromRecipe(espresso());
    expect(start).toMatchObject({ start: { grind: 12 }, borrowedFrom: { name: null }, from: null });
  });

  it("takes the main persona's when several have one, else the most recently pinned (AC 2)", async () => {
    const b = await third();
    testContext.personaChoice = b;
    await pin(14);
    testContext.personaChoice = guest;
    await pinEnteredRecipe({ batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, values: values(16) }, new Date(NOW.getTime() + 1000));
    // The main persona has none: the newest of the others.
    testContext.personaChoice = null;
    expect(await getDialInFromRecipe(espresso())).toMatchObject({ start: { grind: 16 }, borrowedFrom: { name: "Guest" } });
    // Once the main persona has one, theirs wins over a newer one for someone without.
    await pin(12);
    const c = await third();
    testContext.personaChoice = c;
    expect(await getDialInStart({ ...espresso(), setupId: k.setup.id })).toMatchObject({ values: { grind: 12 }, borrowedFrom: { name: null } });
    // Their own recipe still comes first.
    testContext.personaChoice = b;
    expect(await getDialInStart({ ...espresso(), setupId: k.setup.id })).toMatchObject({ values: { grind: 14 }, borrowedFrom: null });
  });

  it("brings prep, milk and sweetened with it (AC 4)", async () => {
    await pinEnteredRecipe(
      { batchId: k.batch.id, setupId: k.setup.id, drinkTypeId: k.drinks.espresso.id, values: { ...values(12), usedWdt: true, sweetened: true } },
      NOW,
    );
    testContext.personaChoice = guest;
    expect(await getDialInStart({ ...espresso(), setupId: k.setup.id })).toMatchObject({ prep: { wdt: true }, sweetened: true });
  });

  it("starts as before when nobody has one (AC 5)", async () => {
    testContext.personaChoice = guest;
    expect((await getHome(espresso(), NOW))?.state.kind).toBe("noRecipe");
    expect(await getDialInFromRecipe(espresso())).toBeNull();
  });

  it("gives the persona their own recipe once they pin (AC 6)", async () => {
    await pin(12);
    testContext.personaChoice = guest;
    await pin(13);
    expect((await getHome(espresso(), NOW))?.state).toMatchObject({ kind: "recipe", recipe: { grind: 13 } });
  });
});
