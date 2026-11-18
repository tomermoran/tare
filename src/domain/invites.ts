/*
 * An invite's state (TD-11, STORY-05-02-06): derived from its timestamps,
 * never stored. Used wins over withdrawn, withdrawn over expired.
 */

/** A link works for 7 days (STORY-05-02-01 AC 2). */
export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type InviteState = "pending" | "used" | "withdrawn" | "expired";

export type InviteTimes = { expiresAt: Date; usedAt: Date | null; withdrawnAt: Date | null };

export function inviteState(invite: InviteTimes, now: Date): InviteState {
  if (invite.usedAt) return "used";
  if (invite.withdrawnAt) return "withdrawn";
  return invite.expiresAt.getTime() <= now.getTime() ? "expired" : "pending";
}
