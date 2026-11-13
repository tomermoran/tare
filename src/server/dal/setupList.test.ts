import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, ownedHardware, personas, pinnedRecipes, setupParts, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getShot } from "./journal";
import { getLogContext } from "./logContext";
import { NotFoundError } from "./scope";
import { chooseSetup, getChangePartStart, getSetups, previewSetup, resolveSetup } from "./setups";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));
vi.mock("@/server/time", () => ({ getTimeZone: async () => "UTC" }));

/*
 * Several setups (STORY-01-02-09, STORY-01-02-08, and the STORY-01-02-04
 * criteria Milestone 1 skipped): which is current, the list, renaming and
 * where changing a part starts.
 */

let k: Awaited<ReturnType<typeof makeKitchen>>;
let second: { id: string; basketId: string };
const db = () => testContext.db!;
const NOW = new Date("2026-06-01T12:00:00Z");
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000);
const [machine, grinder, basket] = [0, 1, 2];

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
  // A second basket (another of the same model), and a setup with it.
  const basketId = newId();
  await db().insert(ownedHardware).values({ id: basketId, householdId: k.household.id, hardwareId: k.parts[basket].hardwareId });
  const { id } = await resolveSetup([k.parts[machine].id, k.parts[grinder].id, basketId]);
  await db().update(setups).set({ createdAt: daysAgo(30) }).where(eq(setups.id, id));
  second = { id, basketId };
  testContext.setupChoice = null;
});

async function shot(setupId: string, at: Date, personaId = k.persona.id) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), personaId, setupId, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "one-tap", createdAt: at });
  return id;
}

describe("the current setup", () => {
  it("is the newest setup before any shot (AC 2)", async () => {
    const list = await getSetups(NOW);
    expect(list.map((s) => [s.id, s.current])).toEqual([
      [second.id, true],
      [k.setup.id, false],
    ]);
  });

  it("is the setup of the last shot, one-tap included, shown first (AC 1)", async () => {
    await shot(k.setup.id, daysAgo(1));
    const list = await getSetups(NOW);
    expect(list[0]).toMatchObject({ id: k.setup.id, current: true });
  });

  it("follows the default persona's shots, not another persona's", async () => {
    await shot(k.setup.id, daysAgo(2));
    const guest = newId();
    await db().insert(personas).values({ id: guest, householdId: k.household.id, name: "Guest", isDefault: false });
    await shot(second.id, daysAgo(1), guest);
    expect((await getSetups(NOW))[0].id).toBe(k.setup.id);
  });

  it("switches at once on \"use this\", and a later shot switches it back (AC 3, AC 1)", async () => {
    await shot(k.setup.id, daysAgo(1));
    await chooseSetup(second.id);
    expect((await getSetups(NOW))[0]).toMatchObject({ id: second.id, current: true });
    await shot(k.setup.id, new Date(Date.now() + 60_000));
    expect((await getSetups(NOW))[0]).toMatchObject({ id: k.setup.id, current: true });
  });

  it("won't choose another household's setup", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(chooseSetup(k.setup.id)).rejects.toBeInstanceOf(NotFoundError);
    expect(testContext.setupChoice).toBeNull();
  });

  it("is what the shot log defaults to with several setups", async () => {
    await shot(k.setup.id, daysAgo(1));
    expect((await getLogContext()).defaultSetupId).toBe(k.setup.id);
    await chooseSetup(second.id);
    expect((await getLogContext()).defaultSetupId).toBe(second.id);
  });
});

describe("getSetups", () => {
  it("gives each setup its parts, recipe count (latest per key) and last use (AC 4)", async () => {
    await shot(k.setup.id, daysAgo(5));
    await shot(k.setup.id, daysAgo(3));
    const recipe = (pinnedAt: Date, batchId: string | null = null) => ({
      id: newId(),
      ...shotValues(k),
      beanId: k.bean.id,
      batchId,
      pinnedAt,
    });
    // A recipe re-pinned twice is one recipe; a bag-specific one is another.
    await db().insert(pinnedRecipes).values([recipe(daysAgo(9)), recipe(daysAgo(4)), recipe(daysAgo(2), k.batch.id)]);

    const list = await getSetups(NOW);
    const first = list.find((s) => s.id === k.setup.id)!;
    expect(first).toMatchObject({ recipeCount: 2, lastUsedAt: daysAgo(3), older: false });
    expect(first.parts.map((p) => p.kind)).toEqual(["machine", "grinder", "basket"]);
    expect(list.find((s) => s.id === second.id)).toMatchObject({ recipeCount: 0, lastUsedAt: null });
  });

  it("groups setups unused for 90 days as older, never the current one (AC 4)", async () => {
    await shot(k.setup.id, daysAgo(120));
    await chooseSetup(second.id);
    const list = await getSetups(NOW);
    expect(list.map((s) => [s.id, s.older])).toEqual([
      [second.id, false],
      [k.setup.id, true],
    ]);
  });

  it("shows nothing of another household", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(getSetups(NOW)).resolves.toEqual([]);
  });
});

describe("a known combination (STORY-01-02-04, skipped in Milestone 1)", () => {
  it("previews as existing, with its name and recipe count (AC 2)", async () => {
    await db().update(setups).set({ name: "Weekday" }).where(eq(setups.id, k.setup.id));
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: daysAgo(1) });
    await expect(previewSetup(k.parts.map((p) => p.id))).resolves.toEqual({
      kind: "existing",
      id: k.setup.id,
      name: "Weekday",
      recipeCount: 1,
    });
  });
});

describe("changing a part (STORY-01-02-08)", () => {
  it("starts from a setup's own three parts (AC 1)", async () => {
    await expect(getChangePartStart({ setupId: k.setup.id })).resolves.toEqual({
      machine: k.parts[machine].id,
      grinder: k.parts[grinder].id,
      basket: k.parts[basket].id,
    });
  });

  it("starts from the current setup with a new part swapped in, keeping the other two (AC 5)", async () => {
    await chooseSetup(k.setup.id);
    const fresh = newId();
    await db().insert(ownedHardware).values({ id: fresh, householdId: k.household.id, hardwareId: k.parts[grinder].hardwareId });
    await expect(getChangePartStart({ newPartId: fresh })).resolves.toEqual({
      machine: k.parts[machine].id,
      grinder: fresh,
      basket: k.parts[basket].id,
    });
  });

  it("ignores another household's setup and starts from the current one", async () => {
    await expect(getChangePartStart({ setupId: "not-mine" })).resolves.toMatchObject({ basket: second.basketId });
  });

  it("brings back a previous setup and its recipes, making nothing new (AC 2)", async () => {
    await chooseSetup(second.id);
    const { id } = await resolveSetup(k.parts.map((p) => p.id));
    expect(id).toBe(k.setup.id);
    expect(await db().select().from(setups)).toHaveLength(2);
    expect((await getSetups(NOW))[0].id).toBe(k.setup.id);
  });

  it("makes a new combination current and keeps the old setup and its recipes (AC 3)", async () => {
    await db().insert(pinnedRecipes).values({ id: newId(), ...shotValues(k), beanId: k.bean.id, pinnedAt: daysAgo(1) });
    const fresh = newId();
    await db().insert(ownedHardware).values({ id: fresh, householdId: k.household.id, hardwareId: k.parts[grinder].hardwareId });
    const { id } = await resolveSetup([k.parts[machine].id, fresh, k.parts[basket].id]);
    const list = await getSetups(NOW);
    expect(list[0]).toMatchObject({ id, current: true });
    expect(list.find((s) => s.id === k.setup.id)).toMatchObject({ recipeCount: 1 });
    expect(await db().select().from(setups)).toHaveLength(3);
  });

  it("leaves shots pulled before with the setup and parts they were pulled with (AC 4)", async () => {
    const before = await shot(k.setup.id, daysAgo(2));
    const fresh = newId();
    await db().insert(ownedHardware).values({ id: fresh, householdId: k.household.id, hardwareId: k.parts[grinder].hardwareId });
    await resolveSetup([k.parts[machine].id, fresh, k.parts[basket].id]);
    const detail = await getShot(before);
    expect(detail.setup.id).toBe(k.setup.id);
    const links = await db().select().from(setupParts).where(eq(setupParts.setupId, k.setup.id));
    expect(links.map((l) => l.ownedHardwareId).sort()).toEqual(k.parts.map((p) => p.id).sort());
  });
});
