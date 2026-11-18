import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { householdMembers, personas } from "@/db/schema";
import { createHousehold } from "@/server/auth/bootstrap";
import { requireHousehold } from "./scope";

/*
 * Leaving a household (STORY-05-02-07, TD-11, DQ-41b): the way out of a
 * claim. In one immediate transaction the leaver's profile loses its login
 * and stays, with every shot and recipe, as a profile anyone can invite
 * again; their membership goes; and they start a new, empty household of
 * their own. If they were its only owner, the longest-standing member
 * becomes owner. Nothing is deleted. The session is unchanged (same uid).
 */

/** Only one login in the household: there is nothing to leave (DES-05-02-05 step 6). */
export class AloneInHouseholdError extends Error {
  constructor() {
    super("Only login in the household");
    this.name = "AloneInHouseholdError";
  }
}

export type LeaveInfo = {
  /** More than one login: leaving is offered (AC 1). */
  canLeave: boolean;
  /** The leaver is the only owner, so another member becomes owner. */
  onlyOwner: boolean;
};

export async function getLeaveInfo(): Promise<LeaveInfo> {
  const { householdId, userId } = await requireHousehold();
  const members = await db.select().from(householdMembers).where(eq(householdMembers.householdId, householdId));
  const me = members.find((m) => m.userId === userId);
  const owners = members.filter((m) => m.role === "owner");
  return { canLeave: members.length > 1, onlyOwner: me?.role === "owner" && owners.length === 1 };
}

/** Leaves the household for a new, empty one of the user's own; returns its ID. */
export async function leaveHousehold(now = new Date()): Promise<{ householdId: string }> {
  const { householdId, userId } = await requireHousehold();
  return db.transaction(
    async (tx) => {
      const members = await tx.select().from(householdMembers).where(eq(householdMembers.householdId, householdId)).orderBy(asc(householdMembers.joinedAt));
      const me = members.find((m) => m.userId === userId);
      if (!me || members.length < 2) throw new AloneInHouseholdError();
      const others = members.filter((m) => m.userId !== userId);
      if (me.role === "owner" && !others.some((m) => m.role === "owner")) {
        await tx
          .update(householdMembers)
          .set({ role: "owner" })
          .where(and(eq(householdMembers.householdId, householdId), eq(householdMembers.userId, others[0].userId)));
      }
      // The profile and its history stay, unclaimed (AC 2, AC 3, AC 6).
      await tx.update(personas).set({ userId: null }).where(and(eq(personas.householdId, householdId), eq(personas.userId, userId)));
      await tx.delete(householdMembers).where(and(eq(householdMembers.householdId, householdId), eq(householdMembers.userId, userId)));
      return { householdId: await createHousehold(tx, userId, now) };
    },
    { behavior: "immediate" },
  );
}
