import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { canonicalHardware, ownedHardware, setupParts, setups } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { addPart, getPart, getSetupTab } from "./parts";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const BAMBINO = seedIds.model("breville", "bambino-plus");
const ZERO = seedIds.model("niche", "zero");
let householdId: string;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  const h = await makeHousehold(testContext.db);
  householdId = h.household.id;
  signInAs(h.user.firebaseUid);
});

const db = () => testContext.db!;
const row = async (id: string) =>
  (await db().select().from(ownedHardware).where(eq(ownedHardware.id, id)))[0];

describe("addPart", () => {
  it("adds a part with only a model (AC 2)", async () => {
    const { id, kind } = await addPart({ hardwareId: ZERO });
    expect(kind).toBe("grinder");
    const r = await row(id);
    expect(r).toMatchObject({ householdId, hardwareId: ZERO, nickname: null, acquiredAt: null });
    expect(r.createdAt.getTime()).toBeGreaterThan(0);
  });

  it("keeps a trimmed nickname and the date it was bought (AC 2)", async () => {
    const acquiredAt = new Date("2025-06-01T11:00:00Z");
    const { id } = await addPart({ hardwareId: BAMBINO, nickname: "  Kitchen  ", acquiredAt });
    expect(await row(id)).toMatchObject({ nickname: "Kitchen", acquiredAt });
  });

  it("stores a blank nickname as none and caps it at 60 characters", async () => {
    const blank = await addPart({ hardwareId: ZERO, nickname: "   " });
    expect((await row(blank.id)).nickname).toBeNull();
    const long = await addPart({ hardwareId: ZERO, nickname: "x".repeat(80) });
    expect((await row(long.id)).nickname).toHaveLength(60);
  });

  it("keeps two of the same model as separate parts (AC 4)", async () => {
    const a = await addPart({ hardwareId: ZERO });
    const b = await addPart({ hardwareId: ZERO });
    expect(a.id).not.toBe(b.id);
    const tab = await getSetupTab();
    expect(tab.parts.grinder.map((p) => p.id)).toEqual([a.id, b.id]);
  });

  it("stores a merged model as the one it was merged into", async () => {
    const [model] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.id, ZERO));
    const dup = newId();
    await db().insert(canonicalHardware).values({ ...model, id: dup, name: "Zero (dup)", mergedIntoId: ZERO });
    const { id } = await addPart({ hardwareId: dup });
    expect((await row(id)).hardwareId).toBe(ZERO);
  });

  it("accepts my own unverified model", async () => {
    const [model] = await db().select().from(canonicalHardware).where(eq(canonicalHardware.id, ZERO));
    const mine = newId();
    await db().insert(canonicalHardware).values({
      ...model, id: mine, name: "Home build", source: "user", status: "unverified", createdByHouseholdId: householdId,
    });
    await expect(addPart({ hardwareId: mine })).resolves.toMatchObject({ kind: "grinder" });
  });

  it("rejects an unknown model", async () => {
    await expect(addPart({ hardwareId: "no-such-model" })).rejects.toBeInstanceOf(NotFoundError);
  });

  it("doesn't put the part in a setup", async () => {
    await addPart({ hardwareId: ZERO });
    expect(await db().select().from(setupParts)).toHaveLength(0);
  });
});

describe("getSetupTab", () => {
  it("groups parts by kind (AC 1)", async () => {
    await addPart({ hardwareId: ZERO });
    await addPart({ hardwareId: BAMBINO });
    const tab = await getSetupTab();
    expect(tab.parts.machine.map((p) => p.model)).toEqual(["Bambino Plus"]);
    expect(tab.parts.grinder.map((p) => `${p.maker} ${p.model}`)).toEqual(["Niche Zero"]);
    expect(tab.parts.basket).toEqual([]);
    expect(tab.setups).toEqual([]);
  });
});

describe("getPart", () => {
  it("returns the model's capabilities and the setups the part is in (AC 5)", async () => {
    const machine = await addPart({ hardwareId: BAMBINO });
    const grinder = await addPart({ hardwareId: ZERO });
    const setupId = newId();
    await db().insert(setups).values({ id: setupId, householdId, name: null, partsKey: "k", createdAt: new Date() });
    await db().insert(setupParts).values([
      { setupId, ownedHardwareId: machine.id },
      { setupId, ownedHardwareId: grinder.id },
    ]);
    const part = await getPart(grinder.id);
    expect(part.capabilities).toBeTruthy();
    expect(part.setups.map((s) => s.id)).toEqual([setupId]);
    expect(part.setups[0].parts.map((p) => p.kind)).toEqual(["machine", "grinder"]);
  });

  it("treats a missing part as not found", async () => {
    await expect(getPart("no-such-part")).rejects.toBeInstanceOf(NotFoundError);
  });
});
