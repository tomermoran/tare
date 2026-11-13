import type { HardwareKind } from "./capabilities";

/**
 * A shot's setup in words, from what the shot read returns: its name, else
 * its machine and grinder ("A and B"), as setupLabel does. The list format
 * comes from the caller, so it follows the locale.
 */
export function shotSetupName(
  setup: { name: string | null; parts: readonly { kind: HardwareKind; nickname: string | null; model: string }[] },
  list: (items: string[]) => string,
): string {
  const name = setup.name?.trim();
  if (name) return name;
  return list(setup.parts.filter((p) => p.kind !== "basket").map((p) => p.nickname ?? p.model));
}
