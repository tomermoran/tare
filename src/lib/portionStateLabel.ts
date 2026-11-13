import type { PortionState } from "@/domain/portionState";

/** A translator that knows the portion state keys, from useTranslations() or getTranslations(). */
type Translate = (key: `portion.state.${PortionState}`) => string;

/**
 * A portion's state in words (STORY-03-02-04): the one way every screen
 * names it, on Beans and bag rows, the log's coffee options and the portion
 * actions sheet.
 */
export function portionStateLabel(t: Translate, state: PortionState): string {
  return t(`portion.state.${state}`);
}
