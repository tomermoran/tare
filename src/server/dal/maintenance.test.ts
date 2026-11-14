import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { extractions, maintenanceEvents, setupParts, setups } from "@/db/schema";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { addMaintenance, getGrindPeriod, InvalidMaintenanceError, listMaintenance } from "./maintenance";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const ZONE = "Europe/London";
const NOW = new Date("2026-03-20T09:00:00Z");
const at = (day: number, hour = 8) => new Date(Date.UTC(2026, 2, day, hour));

beforeEach(async () => {
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

const grinder = () => k.parts[1].id;
const machine = () => k.parts[0].id;
async function shot(createdAt: Date, over: Partial<typeof extractions.$inferInsert> = {}) {
  const id = newId();
  await db()
    .insert(extractions)
    .values({ id, ...shotValues(k), loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt, ...over });
  return id;
}

describe("addMaintenance and listMaintenance (TASK-04-01-01-BE2)", () => {
  it("saves kind, date and note on the part, today by default (AC 1, AC 2)", async () => {
    const { id } = await addMaintenance(grinder(), { kind: "burrs", note: "  New 64 mm burrs  " }, { now: NOW, timeZone: ZONE });
    const [row] = await db().select().from(maintenanceEvents).where(eq(maintenanceEvents.id, id));
    expect(row).toMatchObject({ ownedHardwareId: grinder(), kind: "burrs", note: "New 64 mm burrs", occurredAt: NOW, isRecalibration: true });
  });

  it("takes an earlier local day at its noon, never a future one", async () => {
    const { id } = await addMaintenance(machine(), { kind: "clean", day: "2026-03-10" }, { now: NOW, timeZone: ZONE });
    expect((await listMaintenance(machine()))[0]).toMatchObject({ id, kind: "clean", at: new Date("2026-03-10T12:00:00Z"), note: null });
    await expect(addMaintenance(machine(), { kind: "clean", day: "2026-03-21" }, { now: NOW, timeZone: ZONE })).rejects.toBeInstanceOf(
      InvalidMaintenanceError,
    );
    await expect(addMaintenance(machine(), { kind: "clean", day: "10/03/2026" }, { now: NOW, timeZone: ZONE })).rejects.toBeInstanceOf(
      InvalidMaintenanceError,
    );
    await expect(addMaintenance(machine(), { kind: "polish" as never }, { now: NOW })).rejects.toBeInstanceOf(InvalidMaintenanceError);
  });

  it("lists newest first, on any part kind (AC 3)", async () => {
    await addMaintenance(k.parts[2].id, { kind: "other", day: "2026-03-01" }, { now: NOW, timeZone: ZONE });
    await addMaintenance(k.parts[2].id, { kind: "repair", day: "2026-03-15" }, { now: NOW, timeZone: ZONE });
    await addMaintenance(k.parts[2].id, { kind: "clean", day: "2026-03-08" }, { now: NOW, timeZone: ZONE });
    expect((await listMaintenance(k.parts[2].id)).map((e) => e.kind)).toEqual(["repair", "clean", "other"]);
    expect(await listMaintenance(grinder())).toEqual([]);
  });

  it("leaves the part in the same setups (AC 4)", async () => {
    const before = await db().select().from(setupParts);
    await addMaintenance(grinder(), { kind: "burrs" }, { now: NOW });
    expect(await db().select().from(setupParts)).toEqual(before);
    expect(await db().select().from(setups)).toHaveLength(1);
  });

  it("refuses another household's part", async () => {
    const other = await makeHousehold(db());
    signInAs(other.user.firebaseUid);
    await expect(addMaintenance(grinder(), { kind: "burrs" })).rejects.toBeInstanceOf(NotFoundError);
    await expect(listMaintenance(grinder())).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("recalibration (TASK-04-01-02-BE1)", () => {
  const flag = async (partId: string, input: Parameters<typeof addMaintenance>[1]) => {
    const { id } = await addMaintenance(partId, input, { now: NOW, timeZone: ZONE });
    return (await listMaintenance(partId)).find((e) => e.id === id)!.isRecalibration;
  };

  it("is on by default for a grinder's new burrs and re-zero, off otherwise (AC 2)", async () => {
    expect(await flag(grinder(), { kind: "burrs" })).toBe(true);
    expect(await flag(grinder(), { kind: "rezero" })).toBe(true);
    expect(await flag(grinder(), { kind: "clean" })).toBe(false);
    expect(await flag(grinder(), { kind: "repair" })).toBe(false);
    expect(await flag(grinder(), { kind: "other" })).toBe(false);
  });

  it("can be marked or turned off on a grinder (AC 1)", async () => {
    expect(await flag(grinder(), { kind: "clean", isRecalibration: true })).toBe(true);
    expect(await flag(grinder(), { kind: "burrs", isRecalibration: false })).toBe(false);
  });

  it("is never set on a machine or basket, and refused if asked (AC 4)", async () => {
    expect(await flag(machine(), { kind: "burrs" })).toBe(false);
    expect(await flag(k.parts[2].id, { kind: "rezero" })).toBe(false);
    await expect(addMaintenance(machine(), { kind: "rezero", isRecalibration: true }, { now: NOW })).rejects.toBeInstanceOf(InvalidMaintenanceError);
    await expect(addMaintenance(k.parts[2].id, { kind: "other", isRecalibration: true }, { now: NOW })).rejects.toBeInstanceOf(InvalidMaintenanceError);
    expect(await listMaintenance(machine())).toHaveLength(1);
  });
});

describe("getGrindPeriod (TASK-04-01-03-BE1)", () => {
  it("is one period of every shot without events (AC 2)", async () => {
    await shot(at(1));
    await shot(at(5));
    expect(await getGrindPeriod(grinder(), NOW)).toEqual({ since: null, shotCount: 2 });
  });

  it("starts at the latest event, and follows a back-dated one (AC 1, AC 3)", async () => {
    await shot(at(1));
    await shot(at(6));
    await shot(at(12));
    await addMaintenance(grinder(), { kind: "clean", day: "2026-03-04" }, { now: NOW, timeZone: ZONE });
    expect(await getGrindPeriod(grinder(), NOW)).toEqual({ since: new Date("2026-03-04T12:00:00Z"), shotCount: 2 });
    await addMaintenance(grinder(), { kind: "burrs", day: "2026-03-10" }, { now: NOW, timeZone: ZONE });
    expect(await getGrindPeriod(grinder(), NOW)).toEqual({ since: new Date("2026-03-10T12:00:00Z"), shotCount: 1 });
    // No past shot changed.
    expect(await db().select().from(extractions)).toHaveLength(3);
  });

  it("counts shots on every setup with the grinder", async () => {
    const second = { id: newId(), householdId: k.household.id, partsKey: "second", createdAt: at(1) };
    await db().insert(setups).values(second);
    await db().insert(setupParts).values([{ setupId: second.id, ownedHardwareId: grinder() }]);
    await shot(at(2));
    await shot(at(3), { setupId: second.id });
    expect((await getGrindPeriod(grinder(), NOW)).shotCount).toBe(2);
  });

  it("ignores machine and basket events (AC 4)", async () => {
    await shot(at(2));
    await addMaintenance(machine(), { kind: "clean", day: "2026-03-10" }, { now: NOW, timeZone: ZONE });
    await addMaintenance(k.parts[2].id, { kind: "other", day: "2026-03-11" }, { now: NOW, timeZone: ZONE });
    expect(await getGrindPeriod(grinder(), NOW)).toEqual({ since: null, shotCount: 1 });
  });
});
