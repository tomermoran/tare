"use server";

import type { HardwareKind } from "@/domain/capabilities";
import { fail, runAction, type ActionError } from "@/lib/actionResult";
import { createFirstSetup, MissingPartsError, resolveSetup, SetupExistsError } from "@/server/dal/setups";

/**
 * What saving a setup returns. Besides the usual failures: the parts that
 * are missing (nothing saved), or, in Milestone 1, that a setup already
 * exists; `same` means it's this combination, which callers treat as done.
 */
export type SetupResult =
  | { ok: true; data: { id: string } }
  | { ok: false; error: ActionError }
  | { ok: false; error: "missingParts"; missing: HardwareKind[]; extra: HardwareKind[] }
  | { ok: false; error: "setupExists"; setupId: string; same: boolean };

async function run(body: () => Promise<{ id: string }>): Promise<SetupResult> {
  try {
    return { ok: true, data: await body() };
  } catch (e) {
    if (e instanceof MissingPartsError) return { ok: false, error: "missingParts", missing: e.missing, extra: e.extra };
    if (e instanceof SetupExistsError) return { ok: false, error: "setupExists", setupId: e.setupId, same: e.same };
    return runAction(() => Promise.reject(e));
  }
}

/** SCR-TOOLKIT's save: the three chosen parts, and an optional name. */
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
