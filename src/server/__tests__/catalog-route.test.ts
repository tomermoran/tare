import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { canonicalHardware } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

let mine: Awaited<ReturnType<typeof makeHousehold>>;
let theirs: Awaited<ReturnType<typeof makeHousehold>>;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  mine = await makeHousehold(testContext.db);
  theirs = await makeHousehold(testContext.db);
  signInAs(mine.user.firebaseUid);
});

async function get(query: string) {
  const { GET } = await import("@/app/api/catalog/search/route");
  return GET(new NextRequest(`http://localhost/api/catalog/search?${query}`));
}

describe("GET /api/catalog/search", () => {
  it("searches the hardware catalog", async () => {
    const res = await get("catalog=hardware&kind=grinder&q=niche");
    expect(res.status).toBe(200);
    const { results } = await res.json();
    expect(results[0]).toMatchObject({ id: seedIds.model("niche", "zero"), makerName: "Niche", name: "Zero" });
  });

  it("browses makers and one maker's models", async () => {
    const { makers } = await (await get("catalog=hardware&kind=basket&browse=makers")).json();
    expect(makers.map((m: { name: string }) => m.name)).toEqual(["Breville", "Crema Coffee Products"]);
    const { results } = await (await get(`catalog=hardware&kind=basket&maker=${seedIds.maker("crema-coffee-products")}`)).json();
    expect(results).toHaveLength(1);
  });

  it("rejects an unknown catalog or kind", async () => {
    expect((await get("catalog=hardware&kind=tamper")).status).toBe(400);
    expect((await get("catalog=tea")).status).toBe(400);
  });

  it("searches and browses the coffee catalog", async () => {
    const { results } = await (await get("catalog=coffee&q=house%20blend")).json();
    expect(results[0]).toMatchObject({ id: seedIds.bean("portofino", "signia"), roasterName: "Portofino" });
    const browse = await (await get("catalog=coffee&browse=roasters")).json();
    expect(browse.roasters.map((r: { name: string }) => r.name)).toEqual(["Coffee4U", "Portofino"]);
    expect(browse.recent).toEqual([]);
    const one = await (await get(`catalog=coffee&roaster=${seedIds.roaster("coffee4u")}`)).json();
    expect(one.results).toHaveLength(1);
  });

  it("needs a session", async () => {
    signInAs(null);
    expect((await get("catalog=hardware&kind=grinder")).status).toBe(401);
  });

  it("never returns another household's unverified addition", async () => {
    await testContext.db!.insert(canonicalHardware).values({
      id: "theirs", makerId: seedIds.maker("niche"), kind: "grinder", name: "Zero Secret", capabilities: null,
      source: "user", status: "unverified", createdByHouseholdId: theirs.household.id, createdAt: new Date(),
    });
    const { results } = await (await get("catalog=hardware&kind=grinder&q=secret")).json();
    expect(results).toEqual([]);
  });
});
