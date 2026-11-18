import "server-only";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { invites, personas } from "@/db/schema";
import { INVITE_TTL_MS, inviteState } from "@/domain/invites";
import { inviteLink } from "@/server/auth/inviteToken";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * Inviting someone to take over a profile (STORY-05-02-01, 05-02-06, TD-11).
 * Any member may invite for a profile of the household that has no login.
 * A new link withdraws the profile's earlier one. The link is recomputed
 * from the invite's ID, so the pending one can be shown again. Tare asks
 * for no email address and sends nothing.
 */

/** The profile already has its own login: nothing to invite for (AC 4). */
export class ProfileClaimedError extends Error {
  constructor() {
    super("Profile already claimed");
    this.name = "ProfileClaimedError";
  }
}

export type InviteLink = { link: string; expiresAt: Date };

async function ownPersona(householdId: string, personaId: unknown) {
  if (typeof personaId !== "string" || !personaId) throw new NotFoundError();
  const [persona] = await db
    .select({ id: personas.id, userId: personas.userId })
    .from(personas)
    .where(and(eq(personas.id, personaId), eq(personas.householdId, householdId)));
  if (!persona) throw new NotFoundError();
  return persona;
}

/** Still pending: neither used nor withdrawn (expiry is checked by the reader). */
const open = (personaId: string) => and(eq(invites.personaId, personaId), isNull(invites.usedAt), isNull(invites.withdrawnAt));

/** A link for a profile with no login, valid once for 7 days; the earlier one stops working (AC 2, AC 5). */
export async function createInvite(personaId: string, origin: string, now = new Date()): Promise<InviteLink> {
  const { householdId, userId } = await requireHousehold();
  const persona = await ownPersona(householdId, personaId);
  if (persona.userId) throw new ProfileClaimedError();
  const id = newId();
  const expiresAt = new Date(now.getTime() + INVITE_TTL_MS);
  await db.transaction(
    async (tx) => {
      await tx.update(invites).set({ withdrawnAt: now }).where(open(persona.id));
      await tx.insert(invites).values({ id, householdId, personaId: persona.id, createdByUserId: userId, createdAt: now, expiresAt });
    },
    { behavior: "immediate" },
  );
  return { link: inviteLink(id, origin), expiresAt };
}

/** The profile's pending link, shown again (STORY-05-02-06 AC 2); null when none is pending. */
export async function getPendingInvite(personaId: string, origin: string, now = new Date()): Promise<InviteLink | null> {
  const { householdId } = await requireHousehold();
  const persona = await ownPersona(householdId, personaId);
  const [latest] = await db.select().from(invites).where(eq(invites.personaId, persona.id)).orderBy(desc(invites.createdAt)).limit(1);
  if (!latest || inviteState(latest, now) !== "pending") return null;
  return { link: inviteLink(latest.id, origin), expiresAt: latest.expiresAt };
}

/** Withdraws the profile's pending link; it stops working at once (STORY-05-02-06 AC 3). */
export async function withdrawInvite(personaId: string, now = new Date()): Promise<void> {
  const { householdId } = await requireHousehold();
  const persona = await ownPersona(householdId, personaId);
  await db.update(invites).set({ withdrawnAt: now }).where(open(persona.id));
}

/** Profiles with a pending invite, for the people list (STORY-05-02-06 AC 1). */
export async function pendingInvitePersonas(householdId: string, now = new Date()): Promise<Set<string>> {
  const rows = await db
    .select({ personaId: invites.personaId, expiresAt: invites.expiresAt, usedAt: invites.usedAt, withdrawnAt: invites.withdrawnAt })
    .from(invites)
    .where(and(eq(invites.householdId, householdId), isNull(invites.usedAt), isNull(invites.withdrawnAt)));
  return new Set(rows.filter((r) => inviteState(r, now) === "pending").map((r) => r.personaId));
}
