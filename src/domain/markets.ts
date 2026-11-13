/*
 * Markets for regional links and other names (TQ-12): ISO 3166-1 alpha-2
 * codes, named on screen with Intl.DisplayNames. A short list of where
 * espresso gear and coffee are commonly bought; null means everywhere.
 */
export const MARKETS = ["GB", "US", "CA", "AU", "NZ", "IE", "DE", "FR", "IT", "ES", "NL", "IL", "JP"] as const;
export type Market = (typeof MARKETS)[number];

export function isMarket(v: unknown): v is Market {
  return typeof v === "string" && (MARKETS as readonly string[]).includes(v);
}
