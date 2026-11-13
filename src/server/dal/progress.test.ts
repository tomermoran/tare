import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, extractions, ownedHardware, setupParts, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getSetupProgress } from "./progress";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

describe("getSetupProgress (STORY-01-01-07)", () => {
  it("is all false for a new household", async () => {
    const fresh = await makeHousehold(db());
    signInAs(fresh.user.firebaseUid);
    expect(await getSetupProgress()).toEqual({
      hasMachine: false, hasGrinder: false, hasBasket: false, hasSetup: false, hasUnfinishedPortion: false, hasShot: false,
    });
  });

  it("follows parts, the setup, coffee and shots", async () => {
    expect(await getSetupProgress()).toEqual({
      hasMachine: true, hasGrinder: true, hasBasket: true, hasSetup: true, hasUnfinishedPortion: true, hasShot: false,
    });

    await db().delete(setupParts);
    await db().delete(setups);
    await db().delete(ownedHardware).where(eq(ownedHardware.id, k.parts[2].id));
    await db().update(batchPortions).set({ finishedAt: new Date() });
    expect(await getSetupProgress()).toMatchObject({ hasBasket: false, hasSetup: false, hasUnfinishedPortion: false });
  });

  it("counts a shot", async () => {
    await db().insert(extractions).values({ id: newId(), ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: new Date() });
    expect((await getSetupProgress()).hasShot).toBe(true);
  });

  it("never counts another household's things", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await db().insert(batches).values({ id: newId(), householdId: k.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: new Date() });
    expect(Object.values(await getSetupProgress()).some(Boolean)).toBe(false);
  });
});
