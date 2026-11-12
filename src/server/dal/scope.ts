import "server-only";
import { and, eq, isNull, or, type SQL } from "drizzle-orm";
import { db } from "@/db/client";
import {
  batches,
  batchPortions,
  canonicalBeans,
  canonicalHardware,
  drinkTypes,
  extractions,
  hardwareMakers,
  maintenanceEvents,
  milkTypes,
  ownedHardware,
  personas,
  pinnedRecipes,
  roasters,
  setups,
  stockChecks,
} from "@/db/schema";
import { findAccount, type Account } from "@/server/auth/bootstrap";
import { NoSessionError, requireSession } from "@/server/auth/session";

/** Another household's row, or one that doesn't exist: callers can't tell. */
export class NotFoundError extends Error {
  constructor() {
    super("Not found");
    // Matched by name in runAction, which client code can import.
    this.name = "NotFoundError";
  }
}

/**
 * The signed-in household. Every data access function starts here, and new
 * records take this household, never one passed in by the client.
 */
export async function requireHousehold(): Promise<Account> {
  const { firebaseUid } = await requireSession();
  const account = await findAccount(db, firebaseUid);
  // The session exchange creates the account, so this means a stale cookie.
  if (!account) throw new NotFoundError();
  return account;
}

/**
 * For page reads: null while there's no session yet. On first launch the
 * start screen covers the page and refreshes it once the session exists, so
 * the page renders its loading state instead of an error meanwhile.
 */
export async function unlessSignedOut<T>(read: Promise<T>): Promise<T | null> {
  try {
    return await read;
  } catch (e) {
    if (e instanceof NoSessionError) return null;
    throw e;
  }
}

/** Tables a household owns directly, through a household_id column. */
const direct = {
  drinkTypes,
  milkTypes,
  personas,
  ownedHardware,
  setups,
  batches,
  extractions,
  pinnedRecipes,
} as const;

/** Tables owned through a parent row. */
type Indirect = "batchPortions" | "stockChecks" | "maintenanceEvents";
export type OwnedTable = keyof typeof direct | Indirect;

/**
 * Throws NotFoundError unless the row exists and belongs to the household.
 * Portions belong through their batch, stock checks through their portion,
 * and maintenance events through their part.
 */
export async function assertOwned(
  table: OwnedTable,
  id: string,
  householdId: string,
): Promise<void> {
  let found: unknown[];
  switch (table) {
    case "batchPortions":
      found = await db
        .select({ id: batchPortions.id })
        .from(batchPortions)
        .innerJoin(batches, eq(batches.id, batchPortions.batchId))
        .where(and(eq(batchPortions.id, id), eq(batches.householdId, householdId)));
      break;
    case "stockChecks":
      found = await db
        .select({ id: stockChecks.id })
        .from(stockChecks)
        .innerJoin(batchPortions, eq(batchPortions.id, stockChecks.portionId))
        .innerJoin(batches, eq(batches.id, batchPortions.batchId))
        .where(and(eq(stockChecks.id, id), eq(batches.householdId, householdId)));
      break;
    case "maintenanceEvents":
      found = await db
        .select({ id: maintenanceEvents.id })
        .from(maintenanceEvents)
        .innerJoin(
          ownedHardware,
          eq(ownedHardware.id, maintenanceEvents.ownedHardwareId),
        )
        .where(
          and(
            eq(maintenanceEvents.id, id),
            eq(ownedHardware.householdId, householdId),
          ),
        );
      break;
    default: {
      const t = direct[table];
      found = await db
        .select({ id: t.id })
        .from(t)
        .where(and(eq(t.id, id), eq(t.householdId, householdId)));
    }
  }
  if (found.length === 0) throw new NotFoundError();
}

type CatalogTable =
  | typeof hardwareMakers
  | typeof canonicalHardware
  | typeof roasters
  | typeof canonicalBeans;

/**
 * The catalog rows a household may see: verified entries, plus its own
 * unverified additions (S-01: other households' additions stay private until
 * verified). Merged duplicates are left out; references follow mergedIntoId.
 */
export function visibleCatalog(table: CatalogTable, householdId: string): SQL {
  return and(
    or(
      eq(table.status, "verified"),
      eq(table.createdByHouseholdId, householdId),
    ),
    isNull(table.mergedIntoId),
  )!;
}
