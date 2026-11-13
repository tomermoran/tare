"use server";

import type { HardwareKind } from "@/domain/capabilities";
import { runAction, type ActionError } from "@/lib/actionResult";
import {
  createCoffeeEntry,
  createHardwareEntry,
  DuplicateEntryError,
  InvalidLinkError,
  MissingNameError,
  type CatalogMatch,
  type CoffeeEntryInput,
  type HardwareEntryInput,
} from "@/server/dal/catalogAdd";

/**
 * What saving a catalog entry returns. Besides the usual failures: a link
 * or name that's missing (nothing saved), or a duplicate to offer instead.
 */
export type CatalogResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError }
  | { ok: false; error: "invalidLink"; field: "url" | "makerUrl" }
  | { ok: false; error: "missingName"; field: "maker" | "model" }
  | { ok: false; error: "duplicate"; match: CatalogMatch };

export type CatalogAddResult = CatalogResult<{ id: string; kind: HardwareKind }>;

async function run<T>(body: () => Promise<T>): Promise<CatalogResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (e) {
    if (e instanceof InvalidLinkError) return { ok: false, error: "invalidLink", field: e.field };
    if (e instanceof MissingNameError) return { ok: false, error: "missingName", field: e.field };
    if (e instanceof DuplicateEntryError) return { ok: false, error: "duplicate", match: e.match };
    return runAction(() => Promise.reject(e));
  }
}

/** SCR-CATALOG-ADD's save for a machine, grinder or basket (STORY-01-06-01). */
export async function createHardwareEntryAction(input: HardwareEntryInput): Promise<CatalogAddResult> {
  return run(() => createHardwareEntry(input));
}

/** SCR-CATALOG-ADD's save for a coffee (STORY-01-06-02). */
export async function createCoffeeEntryAction(input: CoffeeEntryInput): Promise<CatalogResult<{ id: string }>> {
  return run(() => createCoffeeEntry(input));
}
