/** Kinds of maintenance on a part (STORY-04-01-01); words in `maintenance.*`. */
export const MAINTENANCE_KINDS = ["burrs", "clean", "rezero", "repair", "other"] as const;

export type MaintenanceKind = (typeof MAINTENANCE_KINDS)[number];

export function isMaintenanceKind(value: unknown): value is MaintenanceKind {
  return typeof value === "string" && (MAINTENANCE_KINDS as readonly string[]).includes(value);
}

/** Only a grinder's work can be a recalibration (STORY-04-01-02 AC 4). */
export const canRecalibrate = (partKind: string) => partKind === "grinder";

/**
 * Whether grinder work counts as a recalibration unless the household says
 * otherwise (DQ-15): new burrs and a re-zero change what the dial means.
 */
export const recalibrationDefault = (partKind: string, kind: MaintenanceKind) =>
  canRecalibrate(partKind) && (kind === "burrs" || kind === "rezero");
