import "server-only";
import { and, count, desc, eq, max } from "drizzle-orm";
import { db } from "@/db/client";
import { drinkTypes, extractions, invites, personas } from "@/db/schema";
import { inviteState } from "@/domain/invites";
import { verifyInviteToken } from "@/server/auth/inviteToken";

/*
 * What an invitation is for, read before signing in (STORY-05-02-05,
 * TD-11). No session is needed and nothing is written. Only the invited
 * profile shows: its name, shot count, the drinks it makes most and when it
 * was last brewed for; nothing about other profiles or the equipment. A
 * malformed, used, withdrawn, expired or already claimed link all read the
 * same `invalid`, so a link reveals nothing (AC 4).
 */

export type InvitePreview =
  | {
      kind: "ok";
      name: string | null;
      shots: number;
      /** Up to three, most made first. */
      drinks: { name: string | null; nameKey: string | null }[];
      lastBrewedAt: Date | null;
    }
  | { kind: "invalid" };

const INVALID: InvitePreview = { kind: "invalid" };

/** The invite a token names, while it can still be used and its profile has no login; null otherwise. */
export async function usableInvite(token: unknown, now: Date) {
  let id: string | null;
  try {
    id = verifyInviteToken(token);
  } catch {
    return null;
  }
  if (!id) return null;
  const [row] = await db
    .select({ invite: invites, personaUserId: personas.userId, personaName: personas.name })
    .from(invites)
    .innerJoin(personas, eq(personas.id, invites.personaId))
    .where(eq(invites.id, id));
  if (!row || row.personaUserId !== null || inviteState(row.invite, now) !== "pending") return null;
  return row;
}

export async function getInvitePreview(token: string, now = new Date()): Promise<InvitePreview> {
  const found = await usableInvite(token, now);
  if (!found) return INVALID;
  const { personaId, householdId } = found.invite;
  const scope = and(eq(extractions.personaId, personaId), eq(extractions.householdId, householdId));
  const [[totals], drinks] = await Promise.all([
    db.select({ shots: count(), last: max(extractions.createdAt) }).from(extractions).where(scope),
    db
      .select({ name: drinkTypes.name, nameKey: drinkTypes.nameKey, n: count() })
      .from(extractions)
      .innerJoin(drinkTypes, eq(drinkTypes.id, extractions.drinkTypeId))
      .where(scope)
      .groupBy(drinkTypes.id)
      .orderBy(desc(count()))
      .limit(3),
  ]);
  return {
    kind: "ok",
    name: found.personaName,
    shots: totals?.shots ?? 0,
    drinks: drinks.map((d) => ({ name: d.name, nameKey: d.nameKey })),
    lastBrewedAt: totals?.last ? new Date(totals.last) : null,
  };
}
