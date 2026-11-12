import type { HardwareKind } from "./capabilities";
import { partsKey } from "./setupKey";

/*
 * Setup rules (STORY-01-02-04, S-02): a setup is exactly one machine, one
 * grinder and one basket. It's identified by its set of parts (partsKey), so
 * the same combination is always the same setup.
 */

export const SETUP_KINDS = ["machine", "grinder", "basket"] as const satisfies readonly HardwareKind[];

export type ChosenPart = { id: string; kind: HardwareKind };

export type PartsCheck =
  | { ok: true; key: string; ids: string[] }
  /** The kinds with no part, or more than one, in kind order. */
  | { ok: false; missing: HardwareKind[]; extra: HardwareKind[] };

export function validateParts(parts: readonly ChosenPart[]): PartsCheck {
  const unique = [...new Map(parts.map((p) => [p.id, p])).values()];
  const count = (k: HardwareKind) => unique.filter((p) => p.kind === k).length;
  const missing = SETUP_KINDS.filter((k) => count(k) === 0);
  const extra = SETUP_KINDS.filter((k) => count(k) > 1);
  if (missing.length || extra.length || unique.length !== SETUP_KINDS.length) {
    return { ok: false, missing, extra };
  }
  const ids = unique.map((p) => p.id);
  return { ok: true, key: partsKey(ids), ids };
}

export type KnownSetup = { id: string; key: string };

/** Whether a combination is one of the household's setups (AC 2). */
export function matchSetup<S extends KnownSetup>(ids: readonly string[], setups: readonly S[]) {
  const key = partsKey(ids);
  return setups.find((s) => s.key === key) ?? null;
}
