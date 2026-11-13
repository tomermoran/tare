import "server-only";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/db/client";
import { newId } from "@/db/ids";
import { extractions, maintenanceEvents, setupParts } from "@/db/schema";
import { currentPeriodStart } from "@/domain/grindPeriods";
import { isValidDayKey, localDayKey, localNoon } from "@/domain/localDay";
import { isMaintenanceKind, type MaintenanceKind } from "@/domain/maintenance";
import { assertOwned, requireHousehold } from "./scope";

/*
 * Maintenance on a part (STORY-04-01-01): dated events on a machine,
 * grinder or basket. Servicing never makes a new setup, so no setup is
 * touched, and no grind offsets are written in the MVP.
 */

export class InvalidMaintenanceError extends Error {
  constructor(field: string) {
    super(`Invalid maintenance ${field}`);
    this.name = "InvalidMaintenanceError";
  }
}

export type MaintenanceInput = {
  kind: MaintenanceKind;
  /** A local day (YYYY-MM-DD), today or earlier; today when left out (AC 2). */
  day?: string;
  note?: string | null;
  isRecalibration?: boolean;
};

export type MaintenanceEvent = {
  id: string;
  kind: MaintenanceKind;
  at: Date;
  note: string | null;
  isRecalibration: boolean;
};

const NOTE_MAX = 500;

export async function addMaintenance(
  partId: string,
  input: MaintenanceInput,
  { now = new Date(), timeZone = "UTC" }: { now?: Date; timeZone?: string } = {},
): Promise<{ id: string }> {
  const { householdId } = await requireHousehold();
  await assertOwned("ownedHardware", partId, householdId);
  if (!isMaintenanceKind(input?.kind)) throw new InvalidMaintenanceError("kind");
  const today = localDayKey(now, timeZone);
  const day = input.day ?? today;
  if (!isValidDayKey(day) || day > today) throw new InvalidMaintenanceError("day");
  const note = typeof input.note === "string" ? input.note.trim().slice(0, NOTE_MAX) || null : null;

  const id = newId();
  // Today's event is at the moment it was logged; an earlier day at its local noon.
  const at = day === today ? now : localNoon(day, timeZone);
  await db.insert(maintenanceEvents).values({
    id,
    ownedHardwareId: partId,
    kind: input.kind,
    note,
    isRecalibration: input.isRecalibration === true,
    occurredAt: at,
  });
  return { id };
}

/** A part's events, newest first (AC 3). */
export async function listMaintenance(partId: string): Promise<MaintenanceEvent[]> {
  const { householdId } = await requireHousehold();
  await assertOwned("ownedHardware", partId, householdId);
  const rows = await db
    .select()
    .from(maintenanceEvents)
    .where(eq(maintenanceEvents.ownedHardwareId, partId))
    .orderBy(desc(maintenanceEvents.occurredAt));
  return rows.map((r) => ({
    id: r.id,
    kind: isMaintenanceKind(r.kind) ? r.kind : "other",
    at: r.occurredAt,
    note: r.note,
    isRecalibration: r.isRecalibration,
  }));
}

/**
 * A grinder's current grind period (STORY-04-01-03): since its latest event,
 * with the shots on any setup containing it from then on. With no events,
 * all its shots are one period. Only this part's own events count, so a
 * machine or basket event never moves it (AC 4).
 */
export async function getGrindPeriod(grinderPartId: string, now = new Date()): Promise<{ since: Date | null; shotCount: number }> {
  const { householdId } = await requireHousehold();
  await assertOwned("ownedHardware", grinderPartId, householdId);
  const events = await db
    .select({ at: maintenanceEvents.occurredAt })
    .from(maintenanceEvents)
    .where(and(eq(maintenanceEvents.ownedHardwareId, grinderPartId), lte(maintenanceEvents.occurredAt, now)));
  const since = currentPeriodStart(events, now);
  const setupIds = db.select({ id: setupParts.setupId }).from(setupParts).where(eq(setupParts.ownedHardwareId, grinderPartId));
  const shots = await db
    .select({ id: extractions.id })
    .from(extractions)
    .where(
      and(
        eq(extractions.householdId, householdId),
        inArray(extractions.setupId, setupIds),
        ...(since ? [gte(extractions.createdAt, since)] : []),
        lte(extractions.createdAt, now),
      ),
    );
  return { since, shotCount: shots.length };
}
