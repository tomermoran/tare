import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import { drinkTypes, householdMembers, households, personas, users } from "@/db/schema";
import { STARTER_DRINKS } from "@/domain/starterDrinks";
import { createTestDb } from "@/test/db";
import { ensureAccount } from "./bootstrap";

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

describe("ensureAccount", () => {
  it("creates a household with a default persona and its own nine drinks", async () => {
    const { householdId } = await ensureAccount(db, "test-uid-a");
    const [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.householdId, householdId));
    expect(persona).toMatchObject({ isDefault: true, name: null });

    const drinks = await db
      .select()
      .from(drinkTypes)
      .where(eq(drinkTypes.householdId, householdId))
      .orderBy(drinkTypes.sortOrder);
    expect(drinks.map((d) => d.nameKey)).toEqual(STARTER_DRINKS.map((d) => d.nameKey));
    expect(drinks.find((d) => d.nameKey === "drinks.latte")?.typicalMilkMl).toBe(200);
    expect(drinks.filter((d) => !d.hasMilk).every((d) => d.typicalMilkMl === null)).toBe(true);
  });

  it("makes the new user the household's owner (AC 2)", async () => {
    const { householdId } = await ensureAccount(db, "test-uid-a");
    const members = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.householdId, householdId));
    expect(members).toHaveLength(1);
    expect(members[0].role).toBe("owner");
  });

  // Starter milks arrive in wave 6; TASK-01-01-08-QA1 adds these checks.
  it.todo("gives a new household the seven starter milks, atomically and idempotently");

  it("returns the same account on a second launch and creates nothing", async () => {
    const first = await ensureAccount(db, "test-uid-a");
    const second = await ensureAccount(db, "test-uid-a");
    expect(second).toEqual(first);
    expect(await db.select().from(households)).toHaveLength(1);
    expect(await db.select().from(drinkTypes)).toHaveLength(9);
  });

  it("makes one household when two first calls race", async () => {
    db = await createTestDb({ file: true });
    const results = await Promise.all([
      ensureAccount(db, "test-uid-a"),
      ensureAccount(db, "test-uid-a"),
    ]);
    expect(results[0]).toEqual(results[1]);
    expect(await db.select().from(users)).toHaveLength(1);
    expect(await db.select().from(households)).toHaveLength(1);
  });

  it("gives each household its own copy of the drinks", async () => {
    const a = await ensureAccount(db, "test-uid-a");
    const b = await ensureAccount(db, "test-uid-b");
    expect(a.householdId).not.toBe(b.householdId);
    expect(await db.select().from(drinkTypes)).toHaveLength(18);
  });
});
