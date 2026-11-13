/*
 * The closest setup (STORY-02-01-06): when the current setup has no recipe
 * for this coffee and drink, the setup that does and shares the most parts
 * with it (0 to 2; three would be the same setup). A tie goes to the one used
 * most recently, then to the lower ID so the answer never wobbles. The setup
 * builder's "closest" line uses it too.
 */

export type SetupParts = { id: string; partIds: readonly string[] };

export function sharedParts(a: SetupParts, b: SetupParts): number {
  const mine = new Set(a.partIds);
  return b.partIds.filter((p) => mine.has(p)).length;
}

export function closestSetup(
  current: SetupParts,
  others: readonly SetupParts[],
  hasRecipe: (setupId: string) => boolean,
  lastUsed: ReadonlyMap<string, Date>,
): { id: string; shared: number } | null {
  const used = (id: string) => lastUsed.get(id)?.getTime() ?? -Infinity;
  const [best] = others
    .filter((s) => s.id !== current.id && hasRecipe(s.id))
    .map((s) => ({ id: s.id, shared: sharedParts(current, s) }))
    .sort((a, b) => b.shared - a.shared || used(b.id) - used(a.id) || (a.id < b.id ? -1 : 1));
  return best ?? null;
}
