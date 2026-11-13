import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db/client";
import messages from "@/i18n/messages/en.json";
import { drinkTypes, householdMembers, households, milkTypes, personas, users } from "@/db/schema";
import { milkLabel, type MilkKey } from "@/domain/milkName";
import { STARTER_DRINKS } from "@/domain/starterDrinks";
import { STARTER_MILKS } from "@/domain/starterMilks";
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

  it("gives a new household the seven starter milks, kinds not brands (STORY-01-01-08 AC 1, AC 4)", async () => {
    const { householdId } = await ensureAccount(db, "test-uid-a");
    const milks = await db.select().from(milkTypes).where(eq(milkTypes.householdId, householdId)).orderBy(milkTypes.sortOrder);
    expect(milks.map((m) => m.nameKey)).toEqual(STARTER_MILKS.map((m) => m.nameKey));
    expect(milks.every((m) => m.name === null && !m.hidden)).toBe(true);
    const t = (key: MilkKey) => messages.milks[key.split(".")[1] as keyof typeof messages.milks];
    expect(milks.map((m) => milkLabel(m, t))).toEqual(["Whole", "Semi-skimmed", "Skimmed", "Oat", "Soy", "Almond", "Lactose-free"]);
  });

  it("gives each household its own milks, once (STORY-01-01-08 AC 3)", async () => {
    const a = await ensureAccount(db, "test-uid-a");
    await ensureAccount(db, "test-uid-a");
    const b = await ensureAccount(db, "test-uid-b");
    const owners = (await db.select().from(milkTypes)).map((m) => m.householdId);
    expect(owners.filter((h) => h === a.householdId)).toHaveLength(7);
    expect(owners.filter((h) => h === b.householdId)).toHaveLength(7);
  });

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
