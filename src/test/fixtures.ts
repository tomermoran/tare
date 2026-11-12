import type { Db } from "@/db/client";
import { newId } from "@/db/ids";
import {
  batches,
  batchPortions,
  canonicalBeans,
  canonicalHardware,
  drinkTypes,
  hardwareMakers,
  householdMembers,
  households,
  milkTypes,
  ownedHardware,
  personas,
  roasters,
  setupParts,
  setups,
  users,
} from "@/db/schema";
import { partsKey } from "@/domain/setupKey";

// Generic builders for test data. Every value is obviously fictional.
// Add a builder here when a task adds a table.

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

const catalogRow = { source: "seed", status: "verified", createdAt: fixedNow };

/**
 * A household ready to log a shot: a drink with milk and one without, a milk,
 * a machine, grinder and basket in one setup, and a bag with one portion.
 */
export async function makeKitchen(db: Db) {
  const base = await makeHousehold(db);
  const householdId = base.household.id;

  const espresso = {
    id: newId(),
    householdId,
    nameKey: "drinks.espresso",
    hasMilk: false,
    sortOrder: 0,
  };
  const latte = {
    id: newId(),
    householdId,
    nameKey: "drinks.latte",
    hasMilk: true,
    typicalMilkMl: 180,
    sortOrder: 1,
  };
  await db.insert(drinkTypes).values([espresso, latte]);
  const milk = {
    id: newId(),
    householdId,
    nameKey: "milks.oat",
    kind: "plant",
    sortOrder: 0,
  };
  await db.insert(milkTypes).values(milk);

  const makerId = newId();
  await db
    .insert(hardwareMakers)
    .values({ id: makerId, name: "Example Works", ...catalogRow });
  const models = [
    {
      kind: "machine" as const,
      name: "Example Machine",
      capabilities: {
        temperature: { control: "none" },
        pressure: { control: "none", gauge: false },
      },
    },
    {
      kind: "grinder" as const,
      name: "Example Grinder",
      capabilities: {
        grind: { type: "stepless", min: 0, max: 50, step: 0.5, coarser: "higher" },
      },
    },
    {
      kind: "basket" as const,
      name: "Example Double Basket",
      capabilities: { dose: { min: 16, max: 18 } },
    },
  ].map((m) => ({ id: newId(), makerId, ...m, ...catalogRow }));
  await db.insert(canonicalHardware).values(models);
  const parts = models.map((m) => ({
    id: newId(),
    householdId,
    hardwareId: m.id,
  }));
  await db.insert(ownedHardware).values(parts);
  const setup = {
    id: newId(),
    householdId,
    partsKey: partsKey(parts.map((p) => p.id)),
    createdAt: fixedNow,
  };
  await db.insert(setups).values(setup);
  await db
    .insert(setupParts)
    .values(parts.map((p) => ({ setupId: setup.id, ownedHardwareId: p.id })));

  const roasterId = newId();
  await db
    .insert(roasters)
    .values({ id: roasterId, name: "Example Roasters", ...catalogRow });
  const bean = { id: newId(), roasterId, name: "House Blend", ...catalogRow };
  await db.insert(canonicalBeans).values(bean);
  const batch = {
    id: newId(),
    householdId,
    beanId: bean.id,
    roastDate: new Date("2026-01-05T00:00:00Z"),
    bagWeight: 250,
    createdAt: fixedNow,
  };
  await db.insert(batches).values(batch);
  const portion = {
    id: newId(),
    batchId: batch.id,
    weight: 250,
    createdAt: fixedNow,
  };
  await db.insert(batchPortions).values(portion);

  return {
    ...base,
    drinks: { espresso, latte },
    milk,
    parts,
    setup,
    bean,
    batch,
    portion,
  };
}

/** The values every shot and recipe needs, for a kitchen from makeKitchen. */
export function shotValues(k: Awaited<ReturnType<typeof makeKitchen>>) {
  return {
    householdId: k.household.id,
    personaId: k.persona.id,
    setupId: k.setup.id,
    drinkTypeId: k.drinks.espresso.id,
    grindSize: 15,
    doseWeight: 18,
    yieldWeight: 36,
    yieldTime: 28_000,
  };
}
