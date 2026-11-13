import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newId } from "@/db/ids";
import { canonicalHardware, extractions } from "@/db/schema";
import { grinderFromAnswers } from "@/domain/capabilityQuestions";
import { doseBound } from "@/domain/capabilityFallbacks";
import { createTestDb } from "@/test/db";
import { makeHousehold, makeKitchen, shotValues } from "@/test/fixtures";
import { signInAs, testContext } from "@/test/mocks/context";
import { getLogContext } from "./logContext";
import { updateModelCapabilities } from "./modelCapabilities";
import { getPart } from "./parts";
import { NotFoundError } from "./scope";

vi.mock("@/db/client", () => import("@/test/mocks/db"));
vi.mock("@/server/auth/session", () => import("@/test/mocks/session"));
vi.mock("@/server/setupChoice", () => import("@/test/mocks/setupChoice"));

let k: Awaited<ReturnType<typeof makeKitchen>>;
const db = () => testContext.db!;
const [machinePart, grinderPart, basketPart] = [0, 1, 2];
const modelOf = (i: number) => k.parts[i].hardwareId;

/** Makes the kitchen's models the household's own unverified additions. */
async function ownModels() {
  await db()
    .update(canonicalHardware)
    .set({ source: "user", status: "unverified", createdByHouseholdId: k.household.id });
}

const caps = async (i: number) =>
  (await db().select({ c: canonicalHardware.capabilities }).from(canonicalHardware).where(eq(canonicalHardware.id, modelOf(i))))[0].c;

beforeEach(async () => {
  testContext.setupChoice = null;
  testContext.db = await createTestDb();
  k = await makeKitchen(testContext.db);
  signInAs(k.user.firebaseUid);
});

describe("answering later (STORY-01-06-09)", () => {
  it("lets the household answer its own unverified model's questions again (AC 1)", async () => {
    await ownModels();
    expect((await getPart(k.parts[grinderPart].id)).capabilitiesEditable).toBe(true);
    const grind = grinderFromAnswers({ dial: "stepped", min: "1", max: "30", step: "1", coarser: "lower" });
    await updateModelCapabilities(modelOf(grinderPart), grind);
    expect(await caps(grinderPart)).toEqual(grind);
  });

  it("makes the next log follow the new answers (AC 2)", async () => {
    await ownModels();
    const grind = { grind: { type: "stepped", min: 1, max: 30, step: 1, coarser: "lower" } };
    await updateModelCapabilities(modelOf(grinderPart), grind);
    expect((await getLogContext()).setups[0].grind).toEqual(grind.grind);
  });

  it("leaves old shots as they were (AC 3)", async () => {
    await ownModels();
    const id = newId();
    await db().insert(extractions).values({
      id, ...shotValues(k), grindSize: 42.5, loggedByUserId: k.user.id, portionId: k.portion.id, entryMode: "measured", createdAt: new Date(),
    });
    await updateModelCapabilities(modelOf(grinderPart), { grind: { type: "stepped", min: 0, max: 20, step: 1, coarser: "higher" } });
    const [shot] = await db().select().from(extractions).where(eq(extractions.id, id));
    expect(shot.grindSize).toBe(42.5);
  });

  it("saves a basket's range, which then bounds dose suggestions", async () => {
    await ownModels();
    await updateModelCapabilities(modelOf(basketPart), { dose: null });
    expect(doseBound((await caps(basketPart)) as { dose: null })).toBeNull();
    await updateModelCapabilities(modelOf(basketPart), { dose: { min: 7, max: 10 } });
    expect(doseBound((await caps(basketPart)) as { dose: { min: number; max: number } })).toEqual({ min: 7, max: 10 });
  });

  it("refuses seeded, verified and other households' models (AC 5)", async () => {
    const before = await caps(machinePart);
    // Seeded (the kitchen's models as made).
    expect((await getPart(k.parts[machinePart].id)).capabilitiesEditable).toBe(false);
    await expect(updateModelCapabilities(modelOf(machinePart), { temperature: { control: "unknown" }, pressure: { control: "unknown" } })).rejects.toBeInstanceOf(NotFoundError);

    // Added by this household but since verified.
    await ownModels();
    await db().update(canonicalHardware).set({ status: "verified" }).where(eq(canonicalHardware.id, modelOf(machinePart)));
    await expect(updateModelCapabilities(modelOf(machinePart), { temperature: { control: "none" }, pressure: { control: "unknown" } })).rejects.toBeInstanceOf(NotFoundError);

    // Another household's unverified model.
    const other = await makeHousehold(db());
    await db().update(canonicalHardware).set({ status: "unverified", createdByHouseholdId: other.household.id }).where(eq(canonicalHardware.id, modelOf(machinePart)));
    await expect(updateModelCapabilities(modelOf(machinePart), { temperature: { control: "none" }, pressure: { control: "unknown" } })).rejects.toBeInstanceOf(NotFoundError);
    expect(await caps(machinePart)).toEqual(before);
  });

  it("refuses capabilities of the wrong kind", async () => {
    await ownModels();
    await expect(updateModelCapabilities(modelOf(grinderPart), { dose: { min: 7, max: 10 } })).rejects.toBeInstanceOf(NotFoundError);
  });
});
