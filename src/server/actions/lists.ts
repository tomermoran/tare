"use server";

import { getTranslations } from "next-intl/server";
import { runAction, type ActionError } from "@/lib/actionResult";
import { drinkLabel, type DrinkKey, type NamedDrink } from "@/domain/drinkName";
import { ListNameError } from "@/domain/listName";
import { milkLabel, type MilkKey, type NamedMilk } from "@/domain/milkName";
import { addDrink, KeepOneError, moveDrink, updateDrink, type DrinkChanges } from "@/server/dal/drinks";
import { addMilk, MILK_KINDS, moveMilk, updateMilk, type MilkChanges, type MilkKind } from "@/server/dal/milks";

/*
 * The household's lists (EPIC-02-05). A refused name or hiding the last
 * shown item comes back as its own reason, said in words under the field;
 * anything else is a failed save with the typed values kept.
 */

export type ListError = ActionError | "nameRequired" | "nameTaken" | "keepOne";
export type ListResult<T = void> = { ok: true; data: T } | { ok: false; error: ListError };

async function run<T>(body: () => Promise<T>): Promise<ListResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (e) {
    if (e instanceof ListNameError) return { ok: false, error: e.problem === "required" ? "nameRequired" : "nameTaken" };
    if (e instanceof KeepOneError) return { ok: false, error: "keepOne" };
    return runAction(() => Promise.reject(e));
  }
}

/** Starter drinks are compared by the name they show in this language. */
async function drinkLabeler() {
  const t = await getTranslations();
  return (d: NamedDrink) => drinkLabel(d, (key: DrinkKey) => t(key));
}

const validId = (id: unknown): id is string => typeof id === "string" && id.length > 0;

export async function saveDrinkAction(id: string, changes: DrinkChanges): Promise<ListResult> {
  if (!validId(id) || !changes || typeof changes !== "object") return { ok: false, error: "notFound" };
  // Only these; whether a drink has milk is never changed (STORY-02-05-03 AC 3).
  const { name, hidden, typicalMilkMl } = changes;
  return run(async () => updateDrink(id, { name, hidden, typicalMilkMl }, await drinkLabeler()));
}

export async function addDrinkAction(input: { name: string; hasMilk: boolean; typicalMilkMl?: number }): Promise<ListResult<{ id: string }>> {
  if (!input || typeof input.name !== "string" || typeof input.hasMilk !== "boolean") return { ok: false, error: "saveFailed" };
  return run(async () => addDrink({ name: input.name, hasMilk: input.hasMilk, typicalMilkMl: input.typicalMilkMl }, await drinkLabeler()));
}

export async function moveDrinkAction(id: string, toIndex: number): Promise<ListResult> {
  if (!validId(id)) return { ok: false, error: "notFound" };
  return run(() => moveDrink(id, toIndex));
}

/** Starter milks are compared by the name they show in this language. */
async function milkLabeler() {
  const t = await getTranslations();
  return (m: NamedMilk) => milkLabel(m, (key: MilkKey) => t(key));
}

export async function saveMilkAction(id: string, changes: MilkChanges): Promise<ListResult> {
  if (!validId(id) || !changes || typeof changes !== "object") return { ok: false, error: "notFound" };
  // Only these; a milk's kind is never changed.
  const { name, hidden } = changes;
  return run(async () => updateMilk(id, { name, hidden }, await milkLabeler()));
}

export async function addMilkAction(input: { name: string; kind: MilkKind }): Promise<ListResult<{ id: string }>> {
  if (!input || typeof input.name !== "string" || !MILK_KINDS.includes(input.kind)) return { ok: false, error: "saveFailed" };
  return run(async () => addMilk({ name: input.name, kind: input.kind }, await milkLabeler()));
}

export async function moveMilkAction(id: string, toIndex: number): Promise<ListResult> {
  if (!validId(id)) return { ok: false, error: "notFound" };
  return run(() => moveMilk(id, toIndex));
}
