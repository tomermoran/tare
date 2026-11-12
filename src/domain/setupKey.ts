/**
 * The identity of a setup: its owned part IDs, sorted and joined. The same
 * parts in any order give the same key, so choosing a combination the
 * household already has finds that setup (and its recipes) again.
 */
export function partsKey(ownedHardwareIds: readonly string[]): string {
  return [...new Set(ownedHardwareIds)].sort().join(",");
}
