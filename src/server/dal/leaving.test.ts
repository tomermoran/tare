import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { drinkTypes, extractions, householdMembers, households, milkTypes, personas, pinnedRecipes } from "@/db/schema";
import { ensureAccount, findAccount } from "@/server/auth/bootstrap";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { createInvite } from "./invites";
import { claimInvite } from "./joining";
import { AloneInHouseholdError, getLeaveInfo, leaveHousehold } from "./leaving";
import { addPerson, listPeople } from "./people";
import { isHouseholdEmpty } from "./emptiness";

/*
 * Leaving a household (TASK-05-02-07-BE2), across two logins. Names are
 * placeholders; the secret is a test value.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

const JOINER = "test-uid-joiner";
let k: Awaited<ReturnType<typeof makeKitchen>>;
let guest: string;
let joinerUserId: string;
const db = () => testContext.db!;

beforeAll(() => {
  process.env.INVITE_SECRET = "test-only-invite-secret-0123456789";
});

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  guest = (await addPerson("Guest", "Me")).id;
  await db().insert(extractions).values({ id: newId(), ...shotValues(k), personaId: guest, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: new Date() });
  await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), personaId: guest, beanId: k.bean.id, pinnedAt: new Date() });
  const token = (await createInvite(guest, "https://tare.test")).link.split("/join/")[1];
  joinerUserId = (await ensureAccount(db(), JOINER)).userId;
  signInAs(JOINER);
  await claimInvite(token);
});

describe("leaveHousehold (TASK-05-02-07-BE2)", () => {
  it("is offered with more than one login (AC 1)", async () => {
    expect(await getLeaveInfo()).toEqual({ canLeave: true, onlyOwner: false });
  });

  it("leaves the profile and its history behind, unclaimed, for a new empty household (AC 2, AC 3, AC 6)", async () => {
    const { householdId } = await leaveHousehold();
    expect(householdId).not.toBe(k.household.id);
    expect(await findAccount(db(), JOINER)).toEqual({ userId: joinerUserId, householdId });
    expect(await isHouseholdEmpty(db(), householdId)).toBe(true);
    expect(await db().select().from(drinkTypes).where(eq(drinkTypes.householdId, householdId))).not.toEqual([]);
    expect(await db().select().from(milkTypes).where(eq(milkTypes.householdId, householdId))).not.toEqual([]);
    const [fresh] = await db().select().from(personas).where(eq(personas.householdId, householdId));
    expect(fresh).toMatchObject({ userId: joinerUserId, isDefault: true });

    expect((await db().select().from(personas).where(eq(personas.id, guest)))[0].userId).toBeNull();
    expect(await db().select().from(extractions).where(eq(extractions.personaId, guest))).toHaveLength(1);
    expect(await db().select().from(pinnedRecipes).where(eq(pinnedRecipes.personaId, guest))).toHaveLength(1);
    signInAs(k.user.firebaseUid);
    expect((await listPeople()).find((p) => p.id === guest)).toMatchObject({ claimed: false });
    await expect(createInvite(guest, "https://tare.test")).resolves.toHaveProperty("link");
  });

  it("hands ownership to the longest-standing member when the only owner leaves", async () => {
    signInAs(k.user.firebaseUid);
    expect(await getLeaveInfo()).toEqual({ canLeave: true, onlyOwner: true });
    await leaveHousehold();
    const members = await db().select().from(householdMembers).where(eq(householdMembers.householdId, k.household.id));
    expect(members).toEqual([expect.objectContaining({ userId: joinerUserId, role: "owner" })]);
    expect(await db().select().from(households).where(eq(households.id, k.household.id))).toHaveLength(1);
  });

  it("refuses the last login, changing nothing", async () => {
    await leaveHousehold();
    signInAs(k.user.firebaseUid);
    expect(await getLeaveInfo()).toEqual({ canLeave: false, onlyOwner: true });
    await expect(leaveHousehold()).rejects.toBeInstanceOf(AloneInHouseholdError);
    expect(await findAccount(db(), k.user.firebaseUid)).toEqual({ userId: k.user.id, householdId: k.household.id });
  });
});
