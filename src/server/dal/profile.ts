import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { personas } from "@/db/schema";
import { cleanPersonaName } from "@/domain/personaLabel";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * The profile (STORY-01-01-03): the household's default persona, whose
 * name is null until the user picks one. Only that persona can be renamed
 * here; persona switching comes with EPIC-05-01.
 */

export type Profile = { personaId: string; name: string | null };

async function defaultPersona(householdId: string) {
  const [row] = await db
    .select({ personaId: personas.id, name: personas.name })
    .from(personas)
    .where(and(eq(personas.householdId, householdId), eq(personas.isDefault, true)))
    .limit(1);
  if (!row) throw new NotFoundError();
  return row;
}

export async function getProfile(): Promise<Profile> {
  const { householdId } = await requireHousehold();
  return defaultPersona(householdId);
}

/** Names the default persona; an empty name clears it back to the role label (AC 3, AC 4). */
export async function renamePersona(name: string | null): Promise<Profile> {
  const { householdId } = await requireHousehold();
  const { personaId } = await defaultPersona(householdId);
  const clean = cleanPersonaName(name);
  await db
    .update(personas)
    .set({ name: clean })
    .where(and(eq(personas.id, personaId), eq(personas.householdId, householdId)));
  return { personaId, name: clean };
}
