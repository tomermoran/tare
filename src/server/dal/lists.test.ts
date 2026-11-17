import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { drinkTypes } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeKitchen } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getListSummaries } from "./lists";

/* The summaries of Your lists on Profile (STORY-02-05-07 AC 1). */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

describe("getListSummaries", () => {
  it("counts drinks and milks with none hidden", async () => {
    expect(await getListSummaries()).toEqual({ drinks: { count: 2, hidden: 0 }, milks: { count: 1, hidden: 0 } });
  });

  it("counts hidden ones, for this household only", async () => {
    await testContext.db!.update(drinkTypes).set({ hidden: true }).where(eq(drinkTypes.id, k.drinks.latte.id));
    await makeKitchen(testContext.db!);
    expect(await getListSummaries()).toEqual({ drinks: { count: 2, hidden: 1 }, milks: { count: 1, hidden: 0 } });
  });
});
