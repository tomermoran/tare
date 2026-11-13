"use server";

import type { HardwareKind } from "@/domain/capabilities";
import { fail, runAction, type ActionError, type ActionResult } from "@/lib/actionResult";
import { chooseSetup, createFirstSetup, MissingPartsError, renameSetup, resolveSetup } from "@/server/dal/setups";

/**
 * What saving a setup returns. Besides the usual failures: the parts that
 * are missing, and nothing was saved.
 */
export type SetupResult =
  | { ok: true; data: { id: string } }
  | { ok: false; error: ActionError }
  | { ok: false; error: "missingParts"; missing: HardwareKind[]; extra: HardwareKind[] };

async function run(body: () => Promise<{ id: string }>): Promise<SetupResult> {
  try {
    return { ok: true, data: await body() };
  } catch (e) {
    if (e instanceof MissingPartsError) return { ok: false, error: "missingParts", missing: e.missing, extra: e.extra };
    return runAction(() => Promise.reject(e));
  }
}

/** SCR-TOOLKIT's save: the three chosen parts, and an optional name. The result becomes current. */
export async function resolveSetupAction(input: { partIds: string[]; name?: string }): Promise<SetupResult> {
  if (!Array.isArray(input?.partIds) || !input.partIds.every((id) => typeof id === "string")) {
    return fail("notFound");
  }
  return run(() => resolveSetup(input.partIds, typeof input.name === "string" ? input.name : null));
}

/** The setup offer's one tap. */
export async function createFirstSetupAction(): Promise<SetupResult> {
  return run(() => createFirstSetup());
}

/**
 * "Use this" on a setup card: it becomes current at once (STORY-01-02-09
 * AC 3). The plan calls it `useSetup`; the name avoids reading as a hook.
 */
export async function chooseSetupAction(id: string): Promise<ActionResult<{ id: string }>> {
  if (typeof id !== "string" || !id) return fail("notFound");
  return runAction(() => chooseSetup(id));
}

/** Names or renames a setup; an empty name clears it (AC 5). */
export async function renameSetupAction(input: { id: string; name: string }): Promise<ActionResult<{ id: string }>> {
  if (typeof input?.id !== "string" || typeof input.name !== "string") return fail("notFound");
  return runAction(() => renameSetup(input.id, input.name));
}
