import { portionState } from "./portionState";
import { remainingWeight } from "./remaining";
import { FINISHED_NEEDED, MIN_SPAN_DAYS, STALE_DAYS } from "./runOutConstants";

/*
 * How fast the household uses coffee (STORY-03-05-01) and how much of it
 * gets logged (STORY-03-05-03). Pure and worked out on every read, never
 * stored (TD-8). Household-wide: every portion and every shot, one-tap
 * included, whoever pulled it.
 *
 * The rate is the weight of the finished portions over the stretch they
 * were used in: from the earliest of them being opened (else bought, else
 * added) to the latest finish. A finished portion was used up, so its whole
 * weight counts whatever was logged. What's on hand is what's left in every
 * unfinished portion, frozen included, by the same rule as Beans shows.
 */

const DAY = 86_400_000;
const WEEK = 7 * DAY;

export type RunOutPortion = {
  id: string;
  /** Grams, as the portion was made. */
  weight: number;
  frozenAt: Date | null;
  thawedAt: Date | null;
  openedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  /** The bag's purchase date, when given. */
  purchasedAt: Date | null;
};

export type RunOutInput = {
  portions: readonly RunOutPortion[];
  /** The dose of every shot on these portions, one-tap included. */
  doses: readonly { portionId: string; grams: number; at: Date }[];
  stockChecks: readonly { portionId: string; grams: number; at: Date }[];
  now: Date;
};

export type OnHand = {
  /** Grams left across every unfinished portion, frozen included. */
  grams: number;
  /** Of which in the freezer. */
  frozenGrams: number;
};

export type LoggedShare = {
  /** Logged doses over the weight of finished portions; can pass 1. */
  share: number;
  /** More was logged than the finished portions weighed. */
  overLogged: boolean;
};

export type RunOut = { onHand: OnHand; logged: LoggedShare | null } & (
  | { kind: "nothing" }
  | { kind: "stale" }
  | { kind: "learning"; finished: number; needed: number }
  | { kind: "estimate"; weeklyGrams: number; finished: number; weeks: number }
);

const round1 = (n: number) => Math.round(n * 10) / 10;

export function runOut({ portions, doses, stockChecks, now }: RunOutInput): RunOut {
  const finished = portions.filter((p) => p.finishedAt);
  const onHand = onHandOf(portions, doses, stockChecks);
  const logged = loggedShare(finished, doses);
  const base = { onHand, logged };

  if (onHand.grams <= 0) return { ...base, kind: "nothing" };
  if (isStale(portions, doses, now)) return { ...base, kind: "stale" };
  if (finished.length < FINISHED_NEEDED) return { ...base, kind: "learning", finished: finished.length, needed: FINISHED_NEEDED };

  const end = Math.max(...finished.map((p) => p.finishedAt!.getTime()));
  const start = Math.min(...finished.map((p) => Math.min(startOf(p), p.finishedAt!.getTime())));
  const spanMs = Math.max(end - start, MIN_SPAN_DAYS * DAY);
  const grams = finished.reduce((sum, p) => sum + p.weight, 0);
  const weeklyGrams = round1((grams / spanMs) * WEEK);
  // A rate of nothing would last for ever: treat it as no recent use.
  if (!(weeklyGrams > 0)) return { ...base, kind: "stale" };
  return { ...base, kind: "estimate", weeklyGrams, finished: finished.length, weeks: Math.max(1, Math.round(spanMs / WEEK)) };
}

/** When a portion started being used: opened, else the bag bought, else added. */
const startOf = (p: RunOutPortion) => (p.openedAt ?? p.purchasedAt ?? p.createdAt).getTime();

function onHandOf(portions: readonly RunOutPortion[], doses: RunOutInput["doses"], checks: RunOutInput["stockChecks"]): OnHand {
  let grams = 0;
  let frozenGrams = 0;
  for (const p of portions) {
    if (p.finishedAt) continue;
    const mine = checks.filter((c) => c.portionId === p.id);
    const latest = mine.reduce<(typeof mine)[number] | null>((a, c) => (!a || c.at > a.at ? c : a), null);
    const left = remainingWeight({
      weight: p.weight,
      latestCheck: latest && { grams: latest.grams, at: latest.at },
      doses: doses.filter((d) => d.portionId === p.id),
    }).grams;
    grams += left;
    if (portionState(p) === "frozen") frozenGrams += left;
  }
  return { grams: round1(grams), frozenGrams: round1(frozenGrams) };
}

/** No shot, opening or finish in the last month (STORY-03-05-01 AC 4). A household with no history yet isn't stale. */
function isStale(portions: readonly RunOutPortion[], doses: RunOutInput["doses"], now: Date): boolean {
  const times = [
    ...doses.map((d) => d.at.getTime()),
    ...portions.flatMap((p) => [p.openedAt, p.finishedAt]).flatMap((d) => (d ? [d.getTime()] : [])),
  ];
  if (times.length === 0) return false;
  return now.getTime() - Math.max(...times) > STALE_DAYS * DAY;
}

/** The share of finished portions' weight that logged shots account for (STORY-03-05-03); null before any finish. */
export function loggedShare(finished: readonly RunOutPortion[], doses: RunOutInput["doses"]): LoggedShare | null {
  const weight = finished.reduce((sum, p) => sum + p.weight, 0);
  if (finished.length === 0 || weight <= 0) return null;
  const ids = new Set(finished.map((p) => p.id));
  const logged = doses.filter((d) => ids.has(d.portionId)).reduce((sum, d) => sum + d.grams, 0);
  const share = logged / weight;
  return { share, overLogged: share > 1 };
}
