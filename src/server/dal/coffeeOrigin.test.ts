import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { batches, batchPortions, canonicalBeans } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { createCoffeeEntry, InvalidOriginError, setCoffeeOrigin } from "./catalogAdd";
import { getCoffee } from "./coffee";
import { searchCoffee } from "./coffeeCatalog";
import { NotFoundError } from "./scope";

/*
 * A coffee's origin (EPIC-03-07): saved when it's added, shown on its
 * screen, and set later only on the household's own unverified coffee.
 */

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

const db = () => testContext.db!;
let me: Awaited<ReturnType<typeof makeHousehold>>;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  me = await makeHousehold(testContext.db);
  signInAs(me.user.firebaseUid);
});

let n = 0;
const add = (origin?: string | null) =>
  createCoffeeEntry({
    roaster: { name: "Example Roastery", url: "https://example.com/roastery" },
    bean: { name: `Example Coffee ${++n}`, url: `https://example.com/coffee/${n}`, origin },
  });
const originOf = async (id: string) => (await db().select({ o: canonicalBeans.origin }).from(canonicalBeans).where(eq(canonicalBeans.id, id)))[0].o;

/** A bag of the coffee, so the household can open its screen. */
async function bag(beanId: string) {
  const batchId = newId();
  await db().insert(batches).values({ id: batchId, householdId: me.household.id, beanId, bagWeight: 250, createdAt: new Date() });
  await db().insert(batchPortions).values({ id: newId(), batchId, weight: 250, createdAt: new Date() });
}

describe("saying where a coffee comes from when it's added (STORY-03-07-04)", () => {
  it("saves a country, a blend or other text (AC 1)", async () => {
    expect(await originOf((await add("ET")).id)).toBe("ET");
    expect(await originOf((await add("blend")).id)).toBe("blend");
    expect(await originOf((await add("other:Hawaiian  Kona")).id)).toBe("other:hawaiian kona");
  });

  it("makes other spellings that differ in capitals one origin (AC 2)", async () => {
    const [a, b] = [await add("other:Hawaiian kona"), await add("other: hawaiian KONA ")];
    expect(await originOf(a.id)).toBe(await originOf(b.id));
  });

  it("adds without an origin exactly as before (AC 3)", async () => {
    expect(await originOf((await add()).id)).toBeNull();
    expect(await originOf((await add(null)).id)).toBeNull();
    expect(await originOf((await add("")).id)).toBeNull();
  });

  it("refuses an origin that isn't one, saving nothing", async () => {
    await expect(add("Atlantis")).rejects.toBeInstanceOf(InvalidOriginError);
    expect(await db().select().from(canonicalBeans).where(eq(canonicalBeans.source, "user"))).toHaveLength(0);
  });

  it("leaves seeded coffees with no origin (AC 5), and search carries it", async () => {
    const seeded = await db().select({ origin: canonicalBeans.origin }).from(canonicalBeans).where(eq(canonicalBeans.source, "seed"));
    expect(seeded.length).toBeGreaterThan(0);
    expect(seeded.every((r) => r.origin === null)).toBe(true);
    const { id } = await add("KE");
    expect((await searchCoffee(db(), me.household.id, { query: "example coffee" })).find((r) => r.id === id)?.origin).toBe("KE");
  });
});

describe("seeing and filling in a coffee's origin (STORY-03-07-05)", () => {
  it("shows it on the coffee and lets the household set it on its own unverified coffee (AC 1, AC 2)", async () => {
    const { id } = await add();
    await bag(id);
    expect(await getCoffee(id)).toMatchObject({ bean: { origin: null }, originEditable: true });
    await setCoffeeOrigin(id, "CO");
    expect((await getCoffee(id)).bean.origin).toBe("CO");
    await setCoffeeOrigin(id, null);
    expect(await originOf(id)).toBeNull();
  });

  it("refuses a verified coffee (AC 3)", async () => {
    const { id } = await add();
    await bag(id);
    await db().update(canonicalBeans).set({ status: "verified" }).where(eq(canonicalBeans.id, id));
    expect((await getCoffee(id)).originEditable).toBe(false);
    await expect(setCoffeeOrigin(id, "CO")).rejects.toBeInstanceOf(NotFoundError);
    expect(await originOf(id)).toBeNull();
  });

  it("refuses a seeded coffee", async () => {
    const [seeded] = await db().select({ id: canonicalBeans.id }).from(canonicalBeans).where(eq(canonicalBeans.source, "seed")).limit(1);
    await bag(seeded.id);
    expect((await getCoffee(seeded.id)).originEditable).toBe(false);
    await expect(setCoffeeOrigin(seeded.id, "CO")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("refuses another household's coffee", async () => {
    const { id } = await add();
    signInAs((await makeHousehold(db())).user.firebaseUid);
    await expect(setCoffeeOrigin(id, "CO")).rejects.toBeInstanceOf(NotFoundError);
    signInAs(me.user.firebaseUid);
    expect(await originOf(id)).toBeNull();
  });

  it("refuses a bad origin", async () => {
    const { id } = await add();
    await expect(setCoffeeOrigin(id, "Atlantis")).rejects.toBeInstanceOf(InvalidOriginError);
  });
});
