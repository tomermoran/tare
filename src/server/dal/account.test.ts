import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, drinkTypes, extractions, milkTypes, ownedHardware, pinnedRecipes } from "@/db/schema";
import { ensureAccount, findAccount } from "@/server/auth/bootstrap";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { canSwitchHistory, getAccountLink, getLinkPromptDue, LINK_PROMPT_SHOTS } from "./account";
import { isHouseholdEmpty } from "./emptiness";

/*
 * Keeping a history across phones (EPIC-05-03): the "nothing entered yet"
 * test, whether the account is linked, the reminder's trigger, and the
 * account a sign-in lands on. Firebase Admin is mocked: only the provider
 * IDs are read.
 */

const getUser = vi.fn();
vi.mock("@/server/auth/firebase-admin", () => ({ adminAuth: () => ({ getUser }) }));
vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

const db = () => testContext.db!;
const at = (day: number) => new Date(Date.UTC(2026, 2, day, 8));
const anonymous = { providerData: [] };
const google = { providerData: [{ providerId: "google.com" }] };

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  getUser.mockReset();
  getUser.mockResolvedValue(anonymous);
});

describe("isHouseholdEmpty (STORY-05-03-04, the one definition)", () => {
  it("is empty with only the starter drinks, milks and profile of a new account", async () => {
    const account = await ensureAccount(db(), `uid-${newId()}`);
    expect((await db().select().from(drinkTypes).where(eq(drinkTypes.householdId, account.householdId))).length).toBeGreaterThan(0);
    expect((await db().select().from(milkTypes).where(eq(milkTypes.householdId, account.householdId))).length).toBeGreaterThan(0);
    expect(await isHouseholdEmpty(db(), account.householdId)).toBe(true);
  });

  it("is not empty with a part, a bag or a shot, each on its own", async () => {
    const k = await makeKitchen(db());
    const only = async (keep: "part" | "bag" | "shot") => {
      const h = await makeHousehold(db());
      if (keep === "part") {
        await db().insert(ownedHardware).values({ id: newId(), householdId: h.household.id, hardwareId: k.parts[0].hardwareId });
      } else {
        const batchId = newId();
        await db().insert(batches).values({ id: batchId, householdId: h.household.id, beanId: k.bean.id, bagWeight: 250, createdAt: at(1) });
        if (keep === "shot") {
          // A shot needs a bag; take the bag away again so only the shot is left in this household's own rows.
          await db()
            .insert(extractions)
            .values({ id: newId(), ...shotValues(k), householdId: h.household.id, loggedByUserId: h.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: at(2) });
          await db().delete(batches).where(eq(batches.id, batchId));
        }
      }
      return isHouseholdEmpty(db(), h.household.id);
    };
    expect(await only("part")).toBe(false);
    expect(await only("bag")).toBe(false);
    expect(await only("shot")).toBe(false);
    expect(await isHouseholdEmpty(db(), (await makeHousehold(db())).household.id)).toBe(true);
  });
});

describe("canSwitchHistory (STORY-05-03-04 AC 1, AC 3)", () => {
  it("allows a switch from an empty device only", async () => {
    signInAs((await makeHousehold(db())).user.firebaseUid);
    expect(await canSwitchHistory()).toBe(true);
    signInAs((await makeKitchen(db())).user.firebaseUid);
    expect(await canSwitchHistory()).toBe(false);
  });
});

describe("getAccountLink (STORY-05-03-01)", () => {
  beforeEach(async () => signInAs((await makeHousehold(db())).user.firebaseUid));

  it("is linked when Google is a sign-in provider, asked for this account only", async () => {
    getUser.mockResolvedValue(google);
    expect(await getAccountLink()).toEqual({ linked: true });
    expect(getUser).toHaveBeenCalledWith(testContext.firebaseUid);
  });

  it("is not linked for an anonymous account", async () => {
    expect(await getAccountLink()).toEqual({ linked: false });
  });

  it("reads an admin failure as not linked, without throwing", async () => {
    getUser.mockRejectedValue(new Error("unavailable"));
    expect(await getAccountLink()).toEqual({ linked: false });
  });
});

describe("getLinkPromptDue (STORY-05-03-03 AC 1)", () => {
  let k: Awaited<ReturnType<typeof makeKitchen>>;
  beforeEach(async () => {
    k = await makeKitchen(db());
    signInAs(k.user.firebaseUid);
  });
  const shots = (n: number) =>
    db()
      .insert(extractions)
      .values(
        Array.from({ length: n }, (_, i) => ({ id: newId(), ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured" as const, createdAt: at(i + 1) })),
      );

  it("isn't due before there's a history, and doesn't ask Firebase", async () => {
    await shots(LINK_PROMPT_SHOTS - 1);
    expect(await getLinkPromptDue()).toBe(false);
    expect(getUser).not.toHaveBeenCalled();
  });

  it("is due at the tenth shot", async () => {
    await shots(LINK_PROMPT_SHOTS);
    expect(await getLinkPromptDue()).toBe(true);
  });

  it("is due at the first pinned recipe, even with one shot", async () => {
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: at(1) });
    expect(await getLinkPromptDue()).toBe(true);
  });

  it("is never due once linked", async () => {
    await shots(LINK_PROMPT_SHOTS);
    getUser.mockResolvedValue(google);
    expect(await getLinkPromptDue()).toBe(false);
  });
});

describe("the account a sign-in lands on (STORY-05-03-01 AC 2, STORY-05-03-02 AC 1)", () => {
  it("keeps the same account and household after a link, since the uid doesn't change", async () => {
    const k = await makeKitchen(db());
    const before = await findAccount(db(), k.user.firebaseUid);
    getUser.mockResolvedValue(google);
    expect(await ensureAccount(db(), k.user.firebaseUid)).toEqual(before);
    expect(await isHouseholdEmpty(db(), k.household.id)).toBe(false);
  });

  it("lands a switch on the existing history and merges nothing into it", async () => {
    const existing = await makeKitchen(db());
    const empty = await ensureAccount(db(), `uid-${newId()}`);
    // The session exchange for the other account's uid finds its household.
    expect(await ensureAccount(db(), existing.user.firebaseUid)).toEqual({ userId: existing.user.id, householdId: existing.household.id });
    // The empty device's account is left as it was, unreferenced.
    expect(await findAccount(db(), (await db().query.users.findFirst({ where: (u, { eq }) => eq(u.id, empty.userId) }))!.firebaseUid)).toEqual(empty);
    expect(await isHouseholdEmpty(db(), empty.householdId)).toBe(true);
  });
});
