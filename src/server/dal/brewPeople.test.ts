import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, personas } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getBrewPeople } from "./brewPeople";

/* Who Brew can be for (TASK-05-01-03-FE1, QA1): order, usual drink, one persona. */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));
vi.mock("@/server/personaChoice", () => import("@/test/mocks/personaChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const NOW = new Date(Date.UTC(2026, 2, 2, 8));
const person = async (name: string) => {
  const id = newId();
  await db().insert(personas).values({ id, householdId: k.household.id, name, isDefault: false });
  return id;
};
const shot = (personaId: string, drinkTypeId: string, at: Date) =>
  db().insert(extractions).values({ ...shotValues(k), id: newId(), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", personaId, drinkTypeId, createdAt: at });

beforeEach(async () => {
  testContext.db = await createTestDb();
  testContext.setupChoice = null;
  testContext.personaChoice = null;
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

describe("getBrewPeople", () => {
  it("is null with only the main persona (AC 1)", async () => {
    expect(await getBrewPeople(NOW)).toBeNull();
  });

  it("puts the main persona first, then the others by most recent shot (AC 2)", async () => {
    const a = await person("Person A");
    const b = await person("Person B");
    await shot(b, k.drinks.espresso.id, new Date(NOW.getTime() - 3_600_000));
    await shot(a, k.drinks.espresso.id, new Date(NOW.getTime() - 86_400_000));
    const got = await getBrewPeople(NOW);
    expect(got!.people.map((p) => p.id)).toEqual([k.persona.id, b, a]);
    expect(got!.people[0].main).toBe(true);
    expect(got!.actingId).toBe(k.persona.id);
  });

  it("gives each person their own usual drink, and a new person the first shown (AC 3)", async () => {
    const a = await person("Person A");
    await shot(k.persona.id, k.drinks.latte.id, new Date(NOW.getTime() - 3_600_000));
    const got = await getBrewPeople(NOW);
    expect(got!.people.find((p) => p.main)!.usualDrink!.id).toBe(k.drinks.latte.id);
    expect(got!.people.find((p) => p.id === a)!.usualDrink!.id).not.toBe(k.drinks.latte.id);
  });

  it("says who is chosen", async () => {
    const a = await person("Person A");
    testContext.personaChoice = a;
    expect((await getBrewPeople(NOW))!.actingId).toBe(a);
  });
});
