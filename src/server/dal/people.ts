import "server-only";
import { and, count, eq, max } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { extractions, personas, pinnedRecipes } from "@/db/schema";
import { checkListName } from "@/domain/listName";
import { personaLabel } from "@/domain/personaLabel";
import { pickMain } from "./persona";
import { renamePersona } from "./profile";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * The household's people (STORY-05-01-01, 05-01-02): a profile for each
 * person brewed for, most without a login. Every member sees every
 * profile. Names follow the list rule (1 to 40 characters, unique ignoring
 * case), compared as shown, so the main profile counts by its role label
 * while it has no name. A profile can be removed only while nothing
 * refers to it: no shots, no recipes, not claimed, not the main one.
 */

export type Person = {
  id: string;
  name: string | null;
  /** The signed-in user's own profile, listed first. */
  main: boolean;
  /** Someone has signed up as this person. */
  claimed: boolean;
  shots: number;
  lastShotAt: Date | null;
  recipes: number;
};

/** A profile still in use; nothing was removed. The counts are for the explanation. */
export class PersonInUseError extends Error {
  constructor(readonly counts: { shots: number; recipes: number }) {
    super("Person in use");
    this.name = "PersonInUseError";
  }
}

async function people(householdId: string, userId: string): Promise<Person[]> {
  const [rows, shots, recipes] = await Promise.all([
    db
      .select({ id: personas.id, name: personas.name, userId: personas.userId, isDefault: personas.isDefault })
      .from(personas)
      .where(eq(personas.householdId, householdId)),
    db
      .select({ personaId: extractions.personaId, n: count(), last: max(extractions.createdAt) })
      .from(extractions)
      .where(eq(extractions.householdId, householdId))
      .groupBy(extractions.personaId),
    db
      .select({ personaId: pinnedRecipes.personaId, n: count() })
      .from(pinnedRecipes)
      .where(eq(pinnedRecipes.householdId, householdId))
      .groupBy(pinnedRecipes.personaId),
  ]);
  const main = pickMain(
    rows.map((r) => ({ ...r, isDefault: r.isDefault === true })),
    userId,
  );
  const shotsOf = new Map(shots.map((s) => [s.personaId, s]));
  const recipesOf = new Map(recipes.map((r) => [r.personaId, r.n]));
  const list = rows.map((r) => ({
    id: r.id,
    name: r.name,
    main: r.id === main.id,
    claimed: r.userId !== null,
    shots: shotsOf.get(r.id)?.n ?? 0,
    lastShotAt: shotsOf.get(r.id)?.last ? new Date(shotsOf.get(r.id)!.last!) : null,
    recipes: recipesOf.get(r.id) ?? 0,
  }));
  // The main one first, then by most recently brewed for; never brewed for last.
  return list.sort(
    (a, b) => Number(b.main) - Number(a.main) || (b.lastShotAt?.getTime() ?? -1) - (a.lastShotAt?.getTime() ?? -1) || (a.name ?? "").localeCompare(b.name ?? ""),
  );
}

/** Every profile in the household, the main one first, the rest by most recently brewed for. */
export async function listPeople(): Promise<Person[]> {
  const { householdId, userId } = await requireHousehold();
  return people(householdId, userId);
}

/** How each profile shows, for the name rule: its name, else the role label. */
const shown = (list: readonly Person[], roleLabel: string, except?: string) =>
  list.filter((p) => p.id !== except).map((p) => personaLabel(p, roleLabel));

/** A profile for someone without a login (AC 1); `roleLabel` is how an unnamed profile shows. */
export async function addPerson(name: string, roleLabel: string): Promise<{ id: string }> {
  const { householdId, userId } = await requireHousehold();
  const list = await people(householdId, userId);
  const clean = checkListName(name, shown(list, roleLabel));
  const id = newId();
  await db.insert(personas).values({ id, householdId, userId: null, name: clean, isDefault: false });
  return { id };
}

/** Renames a profile. The main one's rename is the profile's own (one place), where empty returns to the role label. */
export async function renamePerson(id: string, name: string, roleLabel: string): Promise<void> {
  const { householdId, userId } = await requireHousehold();
  const list = await people(householdId, userId);
  const person = list.find((p) => p.id === id);
  if (!person) throw new NotFoundError();
  if (person.main) {
    if (name.trim()) checkListName(name, shown(list, roleLabel, id));
    await renamePersona(name);
    return;
  }
  const clean = checkListName(name, shown(list, roleLabel, id));
  await db.update(personas).set({ name: clean }).where(and(eq(personas.id, id), eq(personas.householdId, householdId)));
}

/** Removes a profile nothing refers to (STORY-05-01-02 AC 2 to AC 4); the main and claimed ones can't be removed. */
export async function removePerson(id: string): Promise<void> {
  const { householdId, userId } = await requireHousehold();
  const person = (await people(householdId, userId)).find((p) => p.id === id);
  if (!person || person.main || person.claimed) throw new NotFoundError();
  if (person.shots || person.recipes) throw new PersonInUseError({ shots: person.shots, recipes: person.recipes });
  await db.delete(personas).where(and(eq(personas.id, id), eq(personas.householdId, householdId)));
}
