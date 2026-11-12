/** The roast levels a coffee can have (S-09), lightest first. */
export const ROAST_LEVELS = ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"] as const;
export type RoastLevel = (typeof ROAST_LEVELS)[number];

export function isRoastLevel(v: unknown): v is RoastLevel {
  return typeof v === "string" && (ROAST_LEVELS as readonly string[]).includes(v);
}
