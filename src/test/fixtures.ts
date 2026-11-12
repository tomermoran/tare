import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { householdMembers, households, personas, users } from "@/db/schema";

// Generic builders for test data. Every value is obviously fictional.
// Add a builder here when a task adds a table (drinks, milks, parts, setups,
// bags and portions follow in later wave 1 and wave 2 tasks).

const fixedNow = new Date("2026-01-15T08:00:00Z");

/** A household with one owner login and its default persona. */
export async function makeHousehold(db: Db, opts: { name?: string } = {}) {
  const user = {
    id: newId(),
    firebaseUid: `test-uid-${newId()}`,
    createdAt: fixedNow,
  };
  const household = { id: newId(), name: opts.name ?? null, createdAt: fixedNow };
  const persona = {
    id: newId(),
    householdId: household.id,
    userId: user.id,
    name: null,
    isDefault: true,
  };
  await db.insert(users).values(user);
  await db.insert(households).values(household);
  await db.insert(householdMembers).values({
    householdId: household.id,
    userId: user.id,
    role: "owner",
    joinedAt: fixedNow,
  });
  await db.insert(personas).values(persona);
  return { user, household, persona };
}
