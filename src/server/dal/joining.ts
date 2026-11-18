import "server-only";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db, type Db } from "@/db/client";
import {
  canonicalBeans,
  canonicalHardware,
  catalogUrls,
  drinkTypes,
  hardwareMakers,
  householdMembers,
  households,
  invites,
  milkTypes,
  personas,
  roasters,
  setupParts,
  setups,
} from "@/db/schema";
import { isHouseholdEmpty } from "./emptiness";
import { usableInvite } from "./invitePreview";
import { requireHousehold } from "./scope";

/*
 * Joining a household from an invite and claiming its profile
 * (STORY-05-02-02, 05-02-03, TD-11). After Google sign-in the joiner's own
 * account must have nothing entered and no one else in it; then one
 * immediate transaction marks the invite used (only if still unused, so two
 * claimers can't both win), gives the profile its login, deletes the
 * joiner's empty household and adds them as a member. Irreversible (R-31):
 * the way out is leaving the household.
 */

export type Joinable = "ok" | "hasHistory" | "invalid";

/** The link no longer works: used, withdrawn, expired, claimed meanwhile, or not for this account. */
export class InvalidInviteError extends Error {
  constructor() {
    super("Invite no longer usable");
    this.name = "InvalidInviteError";
  }
}

/** The joiner already uses Tare with history of their own (STORY-05-02-02 AC 5): nothing is merged. */
export class HasHistoryError extends Error {
  constructor() {
    super("Account has history");
    this.name = "HasHistoryError";
  }
}

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

/** The joiner's own household can go: nothing entered, and no one else in it. */
async function replaceable(database: Db | Tx, householdId: string, userId: string): Promise<boolean> {
  const members = await database.select({ userId: householdMembers.userId }).from(householdMembers).where(eq(householdMembers.householdId, householdId));
  if (members.some((m) => m.userId !== userId)) return false;
  return isHouseholdEmpty(database as Db, householdId);
}

/** After sign-in: whether this account can join from the token (AC 4, AC 5). */
export async function checkJoinable(token: string, now = new Date()): Promise<Joinable> {
  const { householdId, userId } = await requireHousehold();
  const found = await usableInvite(token, now);
  // A link for one's own household isn't for this account.
  if (!found || found.invite.householdId === householdId) return "invalid";
  return (await replaceable(db, householdId, userId)) ? "ok" : "hasHistory";
}

/**
 * Deletes the joiner's empty household and makes them a member of another,
 * in the caller's transaction (STORY-05-02-02 AC 4, AC 6). Children first,
 * with foreign keys on. Catalog entries they added move with them, so
 * nothing they typed is lost and nothing becomes visible to others.
 */
export async function replaceEmptyHousehold(tx: Tx, userId: string, fromHouseholdId: string, toHouseholdId: string, now: Date): Promise<void> {
  const from = fromHouseholdId;
  await tx.delete(invites).where(eq(invites.householdId, from));
  const setupIds = (await tx.select({ id: setups.id }).from(setups).where(eq(setups.householdId, from))).map((s) => s.id);
  if (setupIds.length) {
    await tx.delete(setupParts).where(inArray(setupParts.setupId, setupIds));
    await tx.delete(setups).where(inArray(setups.id, setupIds));
  }
  await tx.delete(personas).where(eq(personas.householdId, from));
  await tx.delete(drinkTypes).where(eq(drinkTypes.householdId, from));
  await tx.delete(milkTypes).where(eq(milkTypes.householdId, from));
  for (const table of [hardwareMakers, canonicalHardware, roasters, canonicalBeans]) {
    await tx.update(table).set({ createdByHouseholdId: toHouseholdId }).where(eq(table.createdByHouseholdId, from));
  }
  await tx.update(catalogUrls).set({ addedByHouseholdId: toHouseholdId }).where(eq(catalogUrls.addedByHouseholdId, from));
  await tx.delete(householdMembers).where(eq(householdMembers.householdId, from));
  await tx.delete(households).where(eq(households.id, from));
  await tx.insert(householdMembers).values({ householdId: toHouseholdId, userId, role: "member", joinedAt: now });
}

/**
 * Claims the invited profile (STORY-05-02-03): from then on it is the new
 * member's main profile, with all its shots and recipes. A link used,
 * withdrawn, expired or claimed meanwhile fails as invalid and changes
 * nothing (AC 4).
 */
export async function claimInvite(token: string, now = new Date()): Promise<{ householdId: string }> {
  const { householdId, userId } = await requireHousehold();
  const found = await usableInvite(token, now);
  if (!found || found.invite.householdId === householdId) throw new InvalidInviteError();
  const { id, personaId, householdId: to } = found.invite;
  await db.transaction(
    async (tx) => {
      if (!(await replaceable(tx, householdId, userId))) throw new HasHistoryError();
      const used = await tx
        .update(invites)
        .set({ usedAt: now, usedByUserId: userId })
        .where(and(eq(invites.id, id), isNull(invites.usedAt), isNull(invites.withdrawnAt)))
        .returning({ id: invites.id });
      if (!used.length) throw new InvalidInviteError();
      const claimed = await tx
        .update(personas)
        .set({ userId })
        .where(and(eq(personas.id, personaId), eq(personas.householdId, to), isNull(personas.userId)))
        .returning({ id: personas.id });
      if (!claimed.length) throw new InvalidInviteError();
      await replaceEmptyHousehold(tx, userId, householdId, to, now);
    },
    { behavior: "immediate" },
  );
  return { householdId: to };
}
