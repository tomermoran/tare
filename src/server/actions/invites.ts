"use server";

import { fail, runAction, type ActionResult } from "@/lib/actionResult";
import { createInvite, getPendingInvite, withdrawInvite, type InviteLink } from "@/server/dal/invites";
import { requestOrigin } from "@/server/requestOrigin";

/*
 * SH-INVITE's actions (STORY-05-02-01, 05-02-06). A claimed profile, an
 * unset secret or any other failure reads as a failed save with a retry.
 */

const validId = (id: unknown): id is string => typeof id === "string" && id.length > 0;

export async function createInviteAction(personaId: string): Promise<ActionResult<InviteLink>> {
  if (!validId(personaId)) return fail("notFound");
  return runAction(async () => createInvite(personaId, await requestOrigin()));
}

export async function pendingInviteAction(personaId: string): Promise<ActionResult<InviteLink | null>> {
  if (!validId(personaId)) return fail("notFound");
  return runAction(async () => getPendingInvite(personaId, await requestOrigin()));
}

export async function withdrawInviteAction(personaId: string): Promise<ActionResult<null>> {
  if (!validId(personaId)) return fail("notFound");
  return runAction(async () => {
    await withdrawInvite(personaId);
    return null;
  });
}
