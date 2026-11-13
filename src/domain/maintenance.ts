/** Kinds of maintenance on a part (STORY-04-01-01); words in `maintenance.*`. */
export const MAINTENANCE_KINDS = ["burrs", "clean", "rezero", "repair", "other"] as const;

export type MaintenanceKind = (typeof MAINTENANCE_KINDS)[number];

export function isMaintenanceKind(value: unknown): value is MaintenanceKind {
  return typeof value === "string" && (MAINTENANCE_KINDS as readonly string[]).includes(value);
}
