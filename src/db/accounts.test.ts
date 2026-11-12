import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import { householdMembers, personas, users } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

describe("account tables", () => {
  it("rejects a second user with the same Firebase account", async () => {
    const { user } = await makeHousehold(db);
    await expect(
      db.insert(users).values({
        id: newId(),
        firebaseUid: user.firebaseUid,
        createdAt: new Date(),
      }),
    ).rejects.toThrow();
  });

  it("rejects a member row for a household that doesn't exist", async () => {
    const { user } = await makeHousehold(db);
    await expect(
      db.insert(householdMembers).values({
        householdId: "no-such-household",
        userId: user.id,
        role: "owner",
        joinedAt: new Date(),
      }),
    ).rejects.toThrow();
  });

  it("keeps two households' personas apart", async () => {
    const a = await makeHousehold(db);
    const b = await makeHousehold(db);
    const rows = await db
      .select()
      .from(personas)
      .where(eq(personas.householdId, a.household.id));
    expect(rows.map((r) => r.id)).toEqual([a.persona.id]);
    expect(rows.map((r) => r.id)).not.toContain(b.persona.id);
  });

  it("stores a persona without a name or login", async () => {
    const { household } = await makeHousehold(db);
    await db.insert(personas).values({ id: newId(), householdId: household.id });
    const rows = await db
      .select()
      .from(personas)
      .where(eq(personas.householdId, household.id));
    const added = rows.find((r) => !r.isDefault);
    expect(added).toMatchObject({ name: null, userId: null, isDefault: false });
  });
});
