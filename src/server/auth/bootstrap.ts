import "server-only";
import { eq } from "drizzle-orm";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import {
  drinkTypes,
  householdMembers,
  households,
  milkTypes,
  personas,
  users,
} from "@/db/schema";
import { STARTER_DRINKS } from "@/domain/starterDrinks";
import { STARTER_MILKS } from "@/domain/starterMilks";

export type Account = { userId: string; householdId: string };

/**
 * Finds the account for a Firebase uid, creating it the first time the uid is
 * seen: the user, a household, the owner membership, the default persona and
 * the starter drinks, all in one write transaction. Safe to call on every
 * sign-in; a second or concurrent call creates nothing. Stores no personal
 * data: the uid is the only link to the person.
 */
export async function ensureAccount(
  db: Db,
  firebaseUid: string,
): Promise<Account> {
  for (let attempt = 1; ; attempt++) {
    const existing = await findAccount(db, firebaseUid);
    if (existing) return existing;
    try {
      return await createAccount(db, firebaseUid);
    } catch (error) {
      // A concurrent first call holds the write lock (SQLITE_BUSY) or got
      // there first (unique uid). The transaction rolled back, so look again.
      if (attempt >= 5) throw error;
      await new Promise((r) => setTimeout(r, 25 * attempt));
    }
  }
}

function createAccount(db: Db, firebaseUid: string): Promise<Account> {
  return db.transaction(
    async (tx) => {
      const now = new Date();
      const userId = newId();
      const householdId = newId();
      await tx.insert(users).values({ id: userId, firebaseUid, createdAt: now });
      await tx.insert(households).values({ id: householdId, createdAt: now });
      await tx.insert(householdMembers).values({
        householdId,
        userId,
        role: "owner",
        joinedAt: now,
      });
      await tx.insert(personas).values({
        id: newId(),
        householdId,
        userId,
        isDefault: true,
      });
      await tx.insert(drinkTypes).values(
        STARTER_DRINKS.map((drink, sortOrder) => ({
          id: newId(),
          householdId,
          ...drink,
          sortOrder,
        })),
      );
      await tx.insert(milkTypes).values(
        STARTER_MILKS.map((milk, sortOrder) => ({
          id: newId(),
          householdId,
          ...milk,
          sortOrder,
        })),
      );
      return { userId, householdId };
    },
    { behavior: "immediate" },
  );
}

/** The account for a Firebase uid, or null before its first sign-in. */
export async function findAccount(
  db: Db,
  firebaseUid: string,
): Promise<Account | null> {
  const [row] = await db
    .select({ userId: users.id, householdId: householdMembers.householdId })
    .from(users)
    .innerJoin(householdMembers, eq(householdMembers.userId, users.id))
    .where(eq(users.firebaseUid, firebaseUid))
    .limit(1);
  return row ?? null;
}

/**
 * Gives a household made before the starter milk list (wave 6) its milks,
 * once: only when it has none at all, so a household that hid or renamed
 * its milks is never touched. Idempotent under concurrent calls.
 */
export async function ensureStarterMilks(db: Db, householdId: string): Promise<void> {
  await db.transaction(
    async (tx) => {
      const [any] = await tx.select({ id: milkTypes.id }).from(milkTypes).where(eq(milkTypes.householdId, householdId)).limit(1);
      if (any) return;
      await tx.insert(milkTypes).values(
        STARTER_MILKS.map((milk, sortOrder) => ({ id: newId(), householdId, ...milk, sortOrder })),
      );
    },
    { behavior: "immediate" },
  );
}
