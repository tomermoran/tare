import type { HardwareKind } from "./capabilities";

/*
 * How a setup is shown (S-08, STORY-01-02-09 AC 6): its name, or, without
 * one, its parts name: the machine and grinder by nickname or model ("A and
 * B"). When another setup shares that machine and grinder, the basket is
 * added ("A, B and C"), so the two never look alike. The list format comes
 * from the caller's formatter, so it follows the locale.
 */

type LabelPart = { id: string; kind: HardwareKind; nickname: string | null; model: string };
type LabelSetup = { id: string; name: string | null; parts: readonly LabelPart[] };

const partOf = (s: LabelSetup, kind: HardwareKind) => s.parts.find((p) => p.kind === kind);

export function setupLabel(
  setup: LabelSetup,
  all: readonly LabelSetup[],
  list: (items: string[]) => string,
): string {
  const name = setup.name?.trim();
  if (name) return name;
  const machine = partOf(setup, "machine");
  const grinder = partOf(setup, "grinder");
  const twin = all.some(
    (o) => o.id !== setup.id && partOf(o, "machine")?.id === machine?.id && partOf(o, "grinder")?.id === grinder?.id,
  );
  const kinds: HardwareKind[] = twin ? ["machine", "grinder", "basket"] : ["machine", "grinder"];
  return list(
    kinds
      .map((k) => partOf(setup, k))
      .filter((p): p is LabelPart => !!p)
      .map((p) => p.nickname ?? p.model),
  );
}
