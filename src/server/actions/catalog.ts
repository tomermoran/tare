"use server";

import type { HardwareKind } from "@/domain/capabilities";
import { runAction, type ActionError } from "@/lib/actionResult";
import {
  createHardwareEntry,
  DuplicateEntryError,
  InvalidLinkError,
  MissingNameError,
  type CatalogMatch,
  type HardwareEntryInput,
} from "@/server/dal/catalogAdd";

/**
 * What saving a catalog entry returns. Besides the usual failures: a link
 * or name that's missing (nothing saved), or a duplicate to offer instead.
 */
export type CatalogAddResult =
  | { ok: true; data: { id: string; kind: HardwareKind } }
  | { ok: false; error: ActionError }
  | { ok: false; error: "invalidLink"; field: "url" | "makerUrl" }
  | { ok: false; error: "missingName"; field: "maker" | "model" }
  | { ok: false; error: "duplicate"; match: CatalogMatch };

/** SCR-CATALOG-ADD's save for a machine, grinder or basket (STORY-01-06-01). */
export async function createHardwareEntryAction(input: HardwareEntryInput): Promise<CatalogAddResult> {
  try {
    return { ok: true, data: await createHardwareEntry(input) };
  } catch (e) {
    if (e instanceof InvalidLinkError) return { ok: false, error: "invalidLink", field: e.field };
    if (e instanceof MissingNameError) return { ok: false, error: "missingName", field: e.field };
    if (e instanceof DuplicateEntryError) return { ok: false, error: "duplicate", match: e.match };
    return runAction(() => Promise.reject(e));
  }
}
