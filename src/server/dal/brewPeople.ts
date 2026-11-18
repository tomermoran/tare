import "server-only";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db/client";
import { extractions } from "@/db/schema";
import { DRINK_LOOKBACK_DAYS, pickDrink } from "@/domain/homeDefaults";
import { getTimeZone } from "@/server/time";
import { getLogContext, type LogDrink } from "./logContext";
import { actingPersona, listPersonas, mainPersona } from "./persona";
import { requireHousehold } from "./scope";

/*
 * Who Brew can be for (STORY-05-01-03 AC 2): the main persona first, then
 * the others by who was brewed for most recently, each with the drink they
 * usually have at this time of day (DQ-02, per person). Null with only one
 * persona: nothing about choosing is in the way then (AC 1).
 */

export type BrewPerson = {
  id: string;
  name: string | null;
  main: boolean;
  /** Their usual drink now; a new person gets the first drink shown (AC 3). */
  usualDrink: LogDrink | null;
};

export type BrewPeople = { actingId: string; people: BrewPerson[] };

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getBrewPeople(at?: Date): Promise<BrewPeople | null> {
  const account = await requireHousehold();
  const list = await listPersonas(account);
  if (list.length < 2) return null;
  const [main, acting, context, timeZone] = await Promise.all([
    mainPersona(account),
    actingPersona(account),
    getLogContext({}, at),
    getTimeZone(),
  ]);
  const now = at ?? new Date();
  const since = new Date(now.getTime() - (DRINK_LOOKBACK_DAYS + 1) * DAY_MS);
  const shots = await db
    .select({ personaId: extractions.personaId, drinkTypeId: extractions.drinkTypeId, at: extractions.createdAt })
    .from(extractions)
    .where(and(eq(extractions.householdId, account.householdId), gte(extractions.createdAt, since)))
    .orderBy(desc(extractions.createdAt));
  // Each person's latest shot, for the fallback drink and the order, even when older than the window.
  const latest = await Promise.all(
    list.map(async (p) => {
      const [row] = await db
        .select({ drinkTypeId: extractions.drinkTypeId, at: extractions.createdAt })
        .from(extractions)
        .where(and(eq(extractions.householdId, account.householdId), eq(extractions.personaId, p.id)))
        .orderBy(desc(extractions.createdAt))
        .limit(1);
      return [p.id, row ?? null] as const;
    }),
  );
  const last = new Map(latest);
  const drinkIds = context.drinks.map((d) => d.id);

  const lastAt = (id: string) => last.get(id)?.at.getTime() ?? 0;
  const people = list.map((p): BrewPerson => {
    const own = shots.filter((s) => s.personaId === p.id);
    const newest = last.get(p.id);
    const drinkId = pickDrink({ shots: newest ? [...own, newest] : own, drinkIds, now, timeZone });
    return {
      id: p.id,
      name: p.name,
      main: p.id === main.id,
      usualDrink: context.drinks.find((d) => d.id === drinkId) ?? null,
    };
  });
  people.sort((a, b) => Number(b.main) - Number(a.main) || lastAt(b.id) - lastAt(a.id));
  return { actingId: acting.id, people };
}
