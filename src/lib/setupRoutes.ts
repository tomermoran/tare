/** Setup routes shared by the Setup tab, the builder and the add-part task. */
import { SETUP_KINDS } from "@/domain/setup";
import { returnWithSelection } from "@/lib/returnTo";

export const SETUP_PATH = "/setup";
export const ADD_PART_PATH = "/setup/add-part";
export const BUILDER_PATH = "/setup/builder";

/** The builder, starting from a setup's three parts (STORY-01-02-08 AC 1). */
export const changePartHref = (setupId: string) => `${BUILDER_PATH}?from=${encodeURIComponent(setupId)}`;

/** The builder, starting from the current setup with a new part swapped in (AC 5). */
export const newPartBuilderHref = (partId: string) => `${BUILDER_PATH}?newPart=${encodeURIComponent(partId)}`;

/** One part (SCR-UNIT). */
export const partHref = (partId: string) => `${SETUP_PATH}/parts/${encodeURIComponent(partId)}`;

/**
 * Where the add-part task goes after a save. In the walk-through it carries
 * on to the next missing kind (machine, grinder, basket), keeping
 * `returnTo` as where the walk ends: the checklist (STORY-01-01-07 AC 2).
 * Otherwise it returns to `returnTo` with the new part selected, or to Setup.
 */
export function afterAddPart({
  partId,
  have,
  walk,
  returnTo,
}: {
  partId: string;
  /** Kinds the household owns, the new part's included. */
  have: ReadonlySet<string>;
  walk: boolean;
  returnTo: string | null;
}): string {
  if (!walk) return returnTo ? returnWithSelection(returnTo, partId) : SETUP_PATH;
  const next = SETUP_KINDS.find((k) => !have.has(k));
  if (!next) return returnTo ?? SETUP_PATH;
  return `${ADD_PART_PATH}?${new URLSearchParams({ kind: next, walk: "1", ...(returnTo ? { returnTo } : {}) })}`;
}
