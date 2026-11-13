import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { batches, batchPortions, canonicalHardware, extractions, ownedHardware, setups } from "@/db/schema";
import { requireHousehold } from "./scope";

/**
 * How far the household is towards its first shot (STORY-01-01-07): one
 * flag per checklist fact. Each is an existence check, so it stays cheap on
 * every Brew visit.
 */
export type SetupProgress = {
  hasMachine: boolean;
  hasGrinder: boolean;
  hasBasket: boolean;
  hasSetup: boolean;
  hasUnfinishedPortion: boolean;
  hasShot: boolean;
};

export async function getSetupProgress(): Promise<SetupProgress> {
  const { householdId } = await requireHousehold();
  const exists = async (q: Promise<unknown[]>) => (await q).length > 0;
  const part = (kind: "machine" | "grinder" | "basket") =>
    exists(
      db
        .select({ id: ownedHardware.id })
        .from(ownedHardware)
        .innerJoin(canonicalHardware, eq(canonicalHardware.id, ownedHardware.hardwareId))
        .where(and(eq(ownedHardware.householdId, householdId), eq(canonicalHardware.kind, kind)))
        .limit(1),
    );
  const [hasMachine, hasGrinder, hasBasket, hasSetup, hasUnfinishedPortion, hasShot] = await Promise.all([
    part("machine"),
    part("grinder"),
    part("basket"),
    exists(db.select({ id: setups.id }).from(setups).where(eq(setups.householdId, householdId)).limit(1)),
    exists(
      db
        .select({ id: batchPortions.id })
        .from(batchPortions)
        .innerJoin(batches, eq(batches.id, batchPortions.batchId))
        .where(and(eq(batches.householdId, householdId), isNull(batchPortions.finishedAt)))
        .limit(1),
    ),
    exists(db.select({ id: extractions.id }).from(extractions).where(eq(extractions.householdId, householdId)).limit(1)),
  ]);
  return { hasMachine, hasGrinder, hasBasket, hasSetup, hasUnfinishedPortion, hasShot };
}
