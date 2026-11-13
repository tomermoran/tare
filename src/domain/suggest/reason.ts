import { TASTE_TAGS } from "../taste";
import { TASTE_SCALE } from "../tasting";
import type { TasteQuestion } from "../tastePhrase";
import { TIME_TOLERANCE_MS } from "./constants";
import type { ReasonPart, SuggestInput } from "./types";

const QUESTIONS = Object.keys(TASTE_SCALE) as TasteQuestion[];

/**
 * What points to a change: every answer off just right, then every tag, in
 * their screen order. Rated only, or just right everywhere, is nothing.
 */
export function signals(input: Pick<SuggestInput, "answers" | "tags">): ReasonPart[] {
  const answers: ReasonPart[] = QUESTIONS.flatMap((question) => {
    const value = input.answers[question];
    return value ? [{ kind: "answer" as const, question, value }] : [];
  });
  const tags: ReasonPart[] = TASTE_TAGS.filter((t) => input.tags.includes(t)).map((tag) => ({ kind: "tag" as const, tag }));
  return [...answers, ...tags];
}

/**
 * The reason's parts (STORY-02-03-05 AC 1): what the person said, and how
 * the shot ran against its recipe, as in "too sour and ran fast". Time is
 * added only beside something said, never alone.
 */
export function reasonParts(input: Pick<SuggestInput, "answers" | "tags" | "shot" | "recipe">): ReasonPart[] {
  const said = signals(input);
  if (!said.length || !input.recipe) return said;
  const off = input.shot.timeMs - input.recipe.timeMs;
  if (Math.abs(off) <= TIME_TOLERANCE_MS) return said;
  return [...said, { kind: "time", ran: off < 0 ? "fast" : "slow" }];
}
