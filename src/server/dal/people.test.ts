import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, personas, pinnedRecipes } from "@/db/schema";
import { ListNameError } from "@/domain/listName";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { addPerson, listPeople, PersonInUseError, removePerson, renamePerson } from "./people";
import { getProfile } from "./profile";
import { NotFoundError } from "./scope";

/*
 * The household's people (STORY-05-01-01, 05-01-02). Names are
 * placeholders.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const ME = "Me";
let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

const shot = (personaId: string, day: number) =>
  db().insert(extractions).values({ id: newId(), ...shotValues(k), personaId, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(day) });

describe("adding a profile (STORY-05-01-01)", () => {
  it("lists the main profile first, then by most recently brewed for, with counts (AC 2)", async () => {
    const a = (await addPerson("Person A", ME)).id;
    const b = (await addPerson("Person B", ME)).id;
    const c = (await addPerson("Person C", ME)).id;
    await shot(a, 2);
    await shot(b, 4);
    await shot(b, 5);
    const list = await listPeople();
    expect(list.map((p) => p.id)).toEqual([k.persona.id, b, a, c]);
    expect(list[1]).toMatchObject({ shots: 2, lastShotAt: at(5), main: false, claimed: false });
    expect(list[3]).toMatchObject({ shots: 0, lastShotAt: null });
    expect(list[0]).toMatchObject({ main: true, claimed: true });
  });

  it("refuses an empty name or one already shown, the main profile's role label included (AC 3)", async () => {
    await addPerson("Person A", ME);
    await expect(addPerson("  ", ME)).rejects.toEqual(new ListNameError("required"));
    await expect(addPerson("person a", ME)).rejects.toEqual(new ListNameError("taken"));
    await expect(addPerson("me", ME)).rejects.toEqual(new ListNameError("taken"));
  });

  it("is shared with the household and no one else (AC 4)", async () => {
    await addPerson("Person A", ME);
    expect(await listPeople()).toHaveLength(2);
    signInAs((await makeHousehold(db())).user.firebaseUid);
    expect(await listPeople()).toHaveLength(1);
  });
});

describe("renaming and removing a profile (STORY-05-01-02)", () => {
  it("renames a profile, and the main one through the profile's own rename", async () => {
    const a = (await addPerson("Person A", ME)).id;
    await renamePerson(a, "Person Z", ME);
    expect((await listPeople()).find((p) => p.id === a)?.name).toBe("Person Z");
    await renamePerson(k.persona.id, "Home", ME);
    expect((await getProfile()).name).toBe("Home");
    await renamePerson(k.persona.id, "", ME);
    expect((await getProfile()).name).toBeNull();
    await expect(renamePerson(a, "me", ME)).rejects.toEqual(new ListNameError("taken"));
  });

  it("removes a profile with no shots and no recipes (AC 2)", async () => {
    const a = (await addPerson("Person A", ME)).id;
    await removePerson(a);
    expect(await db().select().from(personas).where(eq(personas.id, a))).toEqual([]);
  });

  it("keeps a profile with shots or recipes, saying how many (AC 3)", async () => {
    const a = (await addPerson("Person A", ME)).id;
    await shot(a, 2);
    await expect(removePerson(a)).rejects.toEqual(new PersonInUseError({ shots: 1, recipes: 0 }));
    const b = (await addPerson("Person B", ME)).id;
    await db().insert(pinnedRecipes).values({
      id: newId(),
      householdId: k.household.id,
      beanId: k.bean.id,
      personaId: b,
      setupId: k.setup.id,
      drinkTypeId: k.drinks.espresso.id,
      grindSize: 12,
      doseWeight: 18,
      yieldWeight: 36,
      yieldTime: 28_000,
      pinnedAt: at(1),
    });
    await expect(removePerson(b)).rejects.toEqual(new PersonInUseError({ shots: 0, recipes: 1 }));
  });

  it("never removes the main profile, a claimed one, or another household's (AC 4)", async () => {
    await expect(removePerson(k.persona.id)).rejects.toBeInstanceOf(NotFoundError);
    const other = await makeHousehold(db());
    const claimed = newId();
    await db().insert(personas).values({ id: claimed, householdId: k.household.id, userId: other.user.id, name: "Member", isDefault: false });
    await expect(removePerson(claimed)).rejects.toBeInstanceOf(NotFoundError);
    signInAs(other.user.firebaseUid);
    const a = newId();
    await db().insert(personas).values({ id: a, householdId: k.household.id, name: "Person A", isDefault: false });
    await expect(removePerson(a)).rejects.toBeInstanceOf(NotFoundError);
  });
});
