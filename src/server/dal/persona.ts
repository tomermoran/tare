import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { personas } from "@/db/schema";
import type { Account } from "@/server/auth/bootstrap";
import { readPersonaChoice } from "@/server/personaChoice";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * Whose taste a read or write is for (TD-1, STORY-05-01-03). The main
 * persona is the one the signed-in user has claimed, else the household's
 * default. The acting persona is the one chosen on Brew on this device, if
 * it still belongs to the household, else the main one. Every "the
 * persona" in the DAL comes from here.
 */

export type PersonaRow = { id: string; name: string | null; userId: string | null; isDefault: boolean };

const rows = (householdId: string): Promise<PersonaRow[]> =>
  db
    .select({ id: personas.id, name: personas.name, userId: personas.userId, isDefault: personas.isDefault })
    .from(personas)
    .where(eq(personas.householdId, householdId))
    .then((list) => list.map((p) => ({ ...p, isDefault: p.isDefault === true })));

/** The main persona among a household's: claimed by this user, else the default. */
export function pickMain(list: readonly PersonaRow[], userId: string): PersonaRow {
  const main = list.find((p) => p.userId === userId) ?? list.find((p) => p.isDefault);
  if (!main) throw new NotFoundError();
  return main;
}

/** The household's personas. */
export async function listPersonas(account?: Account): Promise<PersonaRow[]> {
  const { householdId } = account ?? (await requireHousehold());
  return rows(householdId);
}

export async function mainPersona(account?: Account): Promise<PersonaRow> {
  const a = account ?? (await requireHousehold());
  return pickMain(await rows(a.householdId), a.userId);
}

/** The persona chosen on Brew if it's the household's, else the main one. */
export async function actingPersona(account?: Account): Promise<PersonaRow> {
  const a = account ?? (await requireHousehold());
  const [list, chosen] = await Promise.all([rows(a.householdId), readPersonaChoice()]);
  return list.find((p) => p.id === chosen) ?? pickMain(list, a.userId);
}

/**
 * Whose a log, tasting, answer or pin is, to say "for {name}" (STORY-05-01-04
 * AC 2): the given persona, else the acting one. Null with only one profile,
 * when saying so would be noise.
 */
export async function forPersona(personaId?: string, account?: Account): Promise<{ name: string | null } | null> {
  const a = account ?? (await requireHousehold());
  const [list, chosen] = await Promise.all([rows(a.householdId), personaId ? null : readPersonaChoice()]);
  if (list.length < 2) return null;
  const p = list.find((x) => x.id === (personaId ?? chosen)) ?? pickMain(list, a.userId);
  return { name: p.name };
}

/** The acting persona when it isn't the main one, to say whose a list is (STORY-05-01-07 AC 2); else null. */
export async function actingOther(account?: Account): Promise<{ name: string | null } | null> {
  const a = account ?? (await requireHousehold());
  const [acting, main] = await Promise.all([actingPersona(a), mainPersona(a)]);
  return acting.id === main.id ? null : { name: acting.name };
}

export const actingPersonaId = async (account?: Account) => (await actingPersona(account)).id;
