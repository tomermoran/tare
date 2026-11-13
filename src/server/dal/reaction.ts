import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { extractions } from "@/db/schema";
import { InvalidTastingError, tastingColumns, type Tasting } from "@/domain/tasting";
import type { TasteTag } from "@/domain/taste";
import type { Answers } from "@/domain/suggest";
import { assertOwned, NotFoundError, requireHousehold } from "./scope";
import { getSuggestContext, type SuggestContext } from "./suggestContext";

/*
 * Good or off on a one-tap shot (STORY-02-03-01), and what was off
 * (STORY-02-03-04, SH-OFF). Only one-tap shots take a reaction; measured
 * shots are tasted instead. A one-tap shot's answers are judgements, never a
 * rating.
 */

export type Reaction = "good" | "off";

/** A reaction or off answers on a shot that isn't a one-tap shot, or isn't off. */
export class NotOneTapError extends Error {
  constructor() {
    super("Not a one-tap shot");
    this.name = "NotOneTapError";
  }
}

async function oneTap(shotId: string) {
  const { householdId } = await requireHousehold();
  await assertOwned("extractions", shotId, householdId);
  const [shot] = await db.select().from(extractions).where(eq(extractions.id, shotId));
  if (shot.entryMode !== "one-tap") throw new NotOneTapError();
  return shot;
}

/** At any time (DQ-05); null clears it. */
export async function setReaction(shotId: string, reaction: Reaction | null): Promise<void> {
  if (reaction !== null && reaction !== "good" && reaction !== "off") throw new NotFoundError();
  await oneTap(shotId);
  await db.update(extractions).set({ reaction }).where(eq(extractions.id, shotId));
}

/** SH-OFF's answers, on the one-tap shot itself (AC 2). Only on a shot marked off; never a rating. */
export async function saveOffAnswers(shotId: string, tasting: Omit<Tasting, "rating">): Promise<void> {
  if ("rating" in tasting) throw new InvalidTastingError("rating");
  const shot = await oneTap(shotId);
  if (shot.reaction !== "off") throw new NotOneTapError();
  const columns = tastingColumns(tasting, "one-tap");
  if (Object.keys(columns).length === 0) return;
  await db.update(extractions).set(columns).where(eq(extractions.id, shotId));
}

export type OffContext = {
  /** The engine's input apart from the answers. */
  suggest: SuggestContext;
  answers: Answers;
  tags: TasteTag[];
};

/** What SH-OFF opens with: the one-tap shot's answers so far and the suggestion's context. */
export async function getOffContext(shotId: string, now = new Date()): Promise<OffContext> {
  const shot = await oneTap(shotId);
  return {
    suggest: await getSuggestContext(shotId, now),
    answers: { balance: shot.tasteBalance, strength: shot.tasteStrength, body: shot.tasteBody, sweetness: shot.tasteSweetness },
    tags: shot.tasteTags ?? [],
  };
}
