import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { personas } from "@/db/schema";
import { cleanPersonaName } from "@/domain/personaLabel";
import type { Account } from "@/server/auth/bootstrap";
import { mainPersona } from "./persona";
import { requireHousehold } from "./scope";

/*
 * The profile (STORY-01-01-03): the household's default persona, whose
 * name is null until the user picks one. Only that persona can be renamed
 * here; persona switching comes with EPIC-05-01.
 */

export type Profile = { personaId: string; name: string | null };

/** The main persona: claimed by this user, else the household's default (TD-1). */
async function defaultPersona(account: Account): Promise<Profile> {
  const main = await mainPersona(account);
  return { personaId: main.id, name: main.name };
}

export async function getProfile(): Promise<Profile> {
  return defaultPersona(await requireHousehold());
}

/** Names the main persona; an empty name clears it back to the role label (AC 3, AC 4). */
export async function renamePersona(name: string | null): Promise<Profile> {
  const account = await requireHousehold();
  const { householdId } = account;
  const { personaId } = await defaultPersona(account);
  const clean = cleanPersonaName(name);
  await db
    .update(personas)
    .set({ name: clean })
    .where(and(eq(personas.id, personaId), eq(personas.householdId, householdId)));
  return { personaId, name: clean };
}
