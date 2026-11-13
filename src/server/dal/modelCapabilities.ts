import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { canonicalHardware } from "@/db/schema";
import { parseCapabilities } from "@/domain/capabilities";
import { NotFoundError, requireHousehold } from "./scope";

/*
 * Answering later (STORY-01-06-09): a household changes what its own
 * unverified model can do. Seeded, verified and other households' models
 * are read-only (AC 5). Only the model changes: shots keep their stored
 * values, so nothing is reinterpreted (AC 3); the next log follows (AC 2).
 */

const editableBy = (householdId: string, hardwareId: string) =>
  and(
    eq(canonicalHardware.id, hardwareId),
    eq(canonicalHardware.source, "user"),
    eq(canonicalHardware.status, "unverified"),
    eq(canonicalHardware.createdByHouseholdId, householdId),
  );

/** Whether the household may answer this model's questions again. */
export async function canEditCapabilities(householdId: string, hardwareId: string): Promise<boolean> {
  const [row] = await db.select({ id: canonicalHardware.id }).from(canonicalHardware).where(editableBy(householdId, hardwareId));
  return !!row;
}

/** Saves new answers for the household's own unverified model, checked against its kind. */
export async function updateModelCapabilities(hardwareId: string, capabilities: unknown): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  const [row] = await db
    .select({ kind: canonicalHardware.kind })
    .from(canonicalHardware)
    .where(editableBy(householdId, hardwareId));
  if (!row) throw new NotFoundError();
  const parsed = parseCapabilities(row.kind, capabilities);
  if (!parsed) throw new NotFoundError();
  await db.update(canonicalHardware).set({ capabilities: parsed }).where(editableBy(householdId, hardwareId));
  return { id: hardwareId };
}
