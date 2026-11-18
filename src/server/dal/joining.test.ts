import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { drinkTypes, extractions, householdMembers, households, invites, milkTypes, ownedHardware, personas, pinnedRecipes, roasters } from "@/db/schema";
import { ensureAccount } from "@/server/auth/bootstrap";
import { createTestDb } from "@/test/db";
import { makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { createInvite } from "./invites";
import { claimInvite, checkJoinable, HasHistoryError, InvalidInviteError } from "./joining";
import { usableInvite } from "./invitePreview";
import { addPerson, listPeople } from "./people";
import { mainPersona } from "./persona";

/*
 * Joining and claiming (TASK-05-02-02-BE1, 05-02-03-BE1). Names are
 * placeholders; the secret is a test value.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));
// A read taken before another claim landed, to reach the guards inside the transaction.
let stale: Awaited<ReturnType<typeof usableInvite>> | null = null;
vi.mock("./invitePreview", async (original) => {
  const real = await original<typeof import("./invitePreview")>();
  return { ...real, usableInvite: (...args: Parameters<typeof real.usableInvite>) => stale ?? real.usableInvite(...args) };
});

let k: Awaited<ReturnType<typeof makeKitchen>>;
let guest: string;
let token: string;
let joiner: { userId: string; householdId: string };
const JOINER_UID = "test-uid-joiner";
const db = () => testContext.db!;

beforeAll(() => {
  process.env.INVITE_SECRET = "test-only-invite-secret-0123456789";
});

beforeEach(async () => {
  testContext.setupChoice = null;
  stale = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  guest = (await addPerson("Guest", "Me")).id;
  await db().insert(extractions).values({ id: newId(), ...shotValues(k), personaId: guest, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: new Date() });
  await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), personaId: guest, beanId: k.bean.id, pinnedAt: new Date() });
  token = (await createInvite(guest, "https://tare.test")).link.split("/join/")[1];
  // The joiner signed in with Google: a new, empty account with the starter lists.
  joiner = await ensureAccount(db(), JOINER_UID);
  signInAs(JOINER_UID);
});

describe("checkJoinable (TASK-05-02-02-BE1)", () => {
  it("lets an empty account join (AC 4)", async () => {
    expect(await checkJoinable(token)).toBe("ok");
  });

  it("refuses an account with history, untouched (AC 5)", async () => {
    await db().insert(ownedHardware).values({ id: newId(), householdId: joiner.householdId, hardwareId: k.parts[0].hardwareId, createdAt: new Date() });
    expect(await checkJoinable(token)).toBe("hasHistory");
    await expect(claimInvite(token)).rejects.toBeInstanceOf(HasHistoryError);
    expect(await db().select().from(households).where(eq(households.id, joiner.householdId))).toHaveLength(1);
    expect((await db().select().from(invites))[0].usedAt).toBeNull();
  });

  it("says a link for one's own household isn't usable", async () => {
    signInAs(k.user.firebaseUid);
    expect(await checkJoinable(token)).toBe("invalid");
  });
});

describe("claimInvite (TASK-05-02-03-BE1)", () => {
  it("makes the profile the new member's own, with its history, and replaces the empty household (AC 3, AC 6)", async () => {
    const roasterId = newId();
    await db().insert(roasters).values({ id: roasterId, name: "Example Roaster", source: "user", status: "unverified", createdByHouseholdId: joiner.householdId, createdAt: new Date() });
    expect(await claimInvite(token)).toEqual({ householdId: k.household.id });

    const [member] = await db().select().from(householdMembers).where(eq(householdMembers.userId, joiner.userId));
    expect(member).toMatchObject({ householdId: k.household.id, role: "member" });
    expect(await mainPersona()).toMatchObject({ id: guest, userId: joiner.userId });
    expect(await db().select().from(extractions).where(eq(extractions.personaId, guest))).toHaveLength(1);
    expect(await db().select().from(pinnedRecipes).where(eq(pinnedRecipes.personaId, guest))).toHaveLength(1);
    // The empty household and its starter lists are gone; what they typed moved with them.
    expect(await db().select().from(households).where(eq(households.id, joiner.householdId))).toEqual([]);
    expect(await db().select().from(drinkTypes).where(eq(drinkTypes.householdId, joiner.householdId))).toEqual([]);
    expect(await db().select().from(milkTypes).where(eq(milkTypes.householdId, joiner.householdId))).toEqual([]);
    expect(await db().select().from(personas).where(eq(personas.householdId, joiner.householdId))).toEqual([]);
    expect((await db().select().from(roasters).where(eq(roasters.id, roasterId)))[0].createdByHouseholdId).toBe(k.household.id);

    signInAs(k.user.firebaseUid);
    const people = await listPeople();
    expect(people.find((p) => p.id === guest)).toMatchObject({ claimed: true, invitePending: false });
  });

  it("lets only one claim win, even from a read taken before the other landed (AC 4)", async () => {
    stale = await usableInvite(token, new Date());
    const second = await ensureAccount(db(), "test-uid-second-joiner");
    await claimInvite(token);
    signInAs("test-uid-second-joiner");
    await expect(claimInvite(token)).rejects.toBeInstanceOf(InvalidInviteError);
    expect(await db().select().from(households).where(eq(households.id, second.householdId))).toHaveLength(1);
    expect((await db().select().from(personas).where(eq(personas.id, guest)))[0].userId).toBe(joiner.userId);
  });

  it("fails for a withdrawn or expired link, changing nothing", async () => {
    await db().update(invites).set({ withdrawnAt: new Date() });
    await expect(claimInvite(token)).rejects.toBeInstanceOf(InvalidInviteError);
    await db().update(invites).set({ withdrawnAt: null, expiresAt: new Date(Date.now() - 1000) });
    await expect(claimInvite(token)).rejects.toBeInstanceOf(InvalidInviteError);
    expect((await db().select().from(personas).where(eq(personas.id, guest)))[0].userId).toBeNull();
    expect(await db().select().from(households).where(eq(households.id, joiner.householdId))).toHaveLength(1);
  });

  it("rolls back when a later step fails", async () => {
    // The profile was claimed after the read: the invite is marked, then the persona's update finds nothing.
    stale = await usableInvite(token, new Date());
    await db().update(personas).set({ userId: k.user.id }).where(eq(personas.id, guest));
    await expect(claimInvite(token)).rejects.toBeInstanceOf(InvalidInviteError);
    expect((await db().select().from(invites))[0].usedAt).toBeNull();
    expect(await db().select().from(households).where(eq(households.id, joiner.householdId))).toHaveLength(1);
  });
});
