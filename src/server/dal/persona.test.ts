import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batchPortions, extractions, personas } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getHome } from "./home";
import { actingPersona, mainPersona } from "./persona";
import { pullShot } from "./pull";
import { getCoffeeRecipes, pinEnteredRecipe } from "./recipes";

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
