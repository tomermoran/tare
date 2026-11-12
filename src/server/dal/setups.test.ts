import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ownedHardware, setupParts, setups } from "@/db/schema";
import coffee from "@/db/seed/coffee.json";
import hardware from "@/db/seed/hardware.json";
import { loadSeed, seedIds, type CoffeeSeed, type HardwareSeed } from "@/db/seed/load";
import { createTestDb } from "@/test/db";
import { makeHousehold } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { addPart } from "./parts";
import { NotFoundError } from "./scope";
import {
  createFirstSetup,
  getSetupSuggestion,
  MissingPartsError,
  previewSetup,
  resolveSetup,
  SetupExistsError,
} from "./setups";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

const BAMBINO = seedIds.model("breville", "bambino-plus");
const ZERO = seedIds.model("niche", "zero");
const BASKET = seedIds.model("breville", "54mm-double-dual-wall");

let me: Awaited<ReturnType<typeof makeHousehold>>;

beforeEach(async () => {
  testContext.db = await createTestDb();
  await loadSeed(testContext.db, hardware as HardwareSeed, coffee as CoffeeSeed);
  me = await makeHousehold(testContext.db);
  signInAs(me.user.firebaseUid);
});

const db = () => testContext.db!;
const three = async () => {
  const m = await addPart({ hardwareId: BAMBINO });
  const g = await addPart({ hardwareId: ZERO });
  const b = await addPart({ hardwareId: BASKET });
  return [m.id, g.id, b.id];
};

describe("resolveSetup", () => {
  it("makes a new setup from one of each, with an optional name (AC 4)", async () => {
    const ids = await three();
    const { id } = await resolveSetup(ids, "  Weekday  ");
    const [row] = await db().select().from(setups).where(eq(setups.id, id));
    expect(row.name).toBe("Weekday");
    const links = await db().select().from(setupParts).where(eq(setupParts.setupId, id));
    expect(links.map((l) => l.ownedHardwareId).sort()).toEqual([...ids].sort());
  });

  it("makes a setup with no name", async () => {
    const { id } = await resolveSetup(await three());
    const [row] = await db().select().from(setups).where(eq(setups.id, id));
    expect(row.name).toBeNull();
  });

  it("names the missing part and saves nothing (AC 5)", async () => {
    const [m, g] = await three();
    const error = await resolveSetup([m, g]).catch((e) => e);
    expect(error).toBeInstanceOf(MissingPartsError);
    expect(error.missing).toEqual(["basket"]);
    expect(await db().select().from(setups)).toHaveLength(0);
  });

  it("refuses two grinders", async () => {
    const ids = await three();
    const g2 = await addPart({ hardwareId: ZERO });
    const error = await resolveSetup([...ids, g2.id]).catch((e) => e);
    expect(error).toMatchObject({ missing: [], extra: ["grinder"] });
  });

  it("makes one setup from two quick calls", async () => {
    const ids = await three();
    const results = await Promise.allSettled([resolveSetup(ids), resolveSetup(ids)]);
    const made = results.filter((r) => r.status === "fulfilled");
    expect(made.length).toBeGreaterThanOrEqual(1);
    expect(await db().select().from(setups)).toHaveLength(1);
    // A call that lost the race is told it's the same setup.
    for (const r of results) {
      if (r.status === "rejected") expect(r.reason).toMatchObject({ same: true });
    }
  });

  it("refuses a second setup and changes nothing (Milestone 1)", async () => {
    const ids = await three();
    const { id } = await resolveSetup(ids);
    const other = await addPart({ hardwareId: ZERO });
    const error = await resolveSetup([ids[0], other.id, ids[2]]).catch((e) => e);
    expect(error).toBeInstanceOf(SetupExistsError);
    expect(error).toMatchObject({ setupId: id, same: false });
    expect(await db().select().from(setups)).toHaveLength(1);
  });

  it("tells a repeat of the same combination that it's the same setup", async () => {
    const ids = await three();
    const { id } = await resolveSetup(ids);
    await expect(resolveSetup([...ids].reverse())).rejects.toMatchObject({ setupId: id, same: true });
  });

  it("won't use a part that isn't the household's", async () => {
    const ids = await three();
    await expect(resolveSetup([ids[0], ids[1], "someone-elses"])).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("previewSetup", () => {
  it("says new for a new combination and existing for a made one (AC 2)", async () => {
    const ids = await three();
    await expect(previewSetup(ids)).resolves.toEqual({ kind: "new" });
    const { id } = await resolveSetup(ids, "Weekday");
    await expect(previewSetup(ids)).resolves.toEqual({ kind: "existing", id, name: "Weekday", recipeCount: 0 });
  });
});

describe("getSetupSuggestion", () => {
  it("is null until there's one of each kind", async () => {
    await addPart({ hardwareId: BAMBINO });
    await addPart({ hardwareId: ZERO });
    await expect(getSetupSuggestion()).resolves.toBeNull();
  });

  it("offers one tap with exactly one of each (AC 1, AC 4)", async () => {
    const [m, g, b] = await three();
    const s = await getSetupSuggestion();
    expect(s?.oneTap).toBe(true);
    expect([s?.parts.machine.id, s?.parts.grinder.id, s?.parts.basket.id]).toEqual([m, g, b]);
    expect(s?.parts.grinder).toMatchObject({ maker: "Niche", model: "Zero" });
  });

  it("preselects the most recently added of each kind otherwise (AC 2)", async () => {
    await three();
    const newer = await addPart({ hardwareId: ZERO });
    await db().update(ownedHardware).set({ createdAt: new Date(Date.now() + 60_000) }).where(eq(ownedHardware.id, newer.id));
    const s = await getSetupSuggestion();
    expect(s?.oneTap).toBe(false);
    expect(s?.parts.grinder.id).toBe(newer.id);
  });

  it("is gone once a setup exists (AC 5)", async () => {
    await resolveSetup(await three());
    await expect(getSetupSuggestion()).resolves.toBeNull();
  });
});

describe("createFirstSetup", () => {
  it("makes the setup with no input (AC 1)", async () => {
    const ids = await three();
    const { id } = await createFirstSetup();
    const links = await db().select().from(setupParts).where(eq(setupParts.setupId, id));
    expect(links.map((l) => l.ownedHardwareId).sort()).toEqual([...ids].sort());
  });

  it("reads a double tap as the same setup", async () => {
    await three();
    const { id } = await createFirstSetup();
    await expect(createFirstSetup()).rejects.toMatchObject({ setupId: id, same: true });
  });
});
