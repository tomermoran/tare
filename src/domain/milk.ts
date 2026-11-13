/*
 * Milk in a milk drink (STORY-01-03-07). The milk type and amount start
 * from the recipe in recipe-based modes; otherwise the type of the last
 * shot of this drink (if that milk is still on the list), else the first
 * milk on the list, with the drink's typical amount. Amounts are 0 to 500
 * ml in steps of 10 (DQ-26). A drink without milk records none.
 */

export const MILK_RANGE = { min: 0, max: 500, step: 10 } as const;

/** When a milk drink has no typical amount, a common latte size. */
export const MILK_FALLBACK_ML = 150;

export type MilkChoice = { milkTypeId: string | null; ml: number };
export type MilkKey = keyof MilkChoice;

const snap = (ml: number) =>
  Math.min(MILK_RANGE.max, Math.max(MILK_RANGE.min, Math.round(ml / MILK_RANGE.step) * MILK_RANGE.step));

export function milkStart({
  drink,
  recipe,
  lastMilkOfDrink,
  milks,
}: {
  drink: { hasMilk: boolean; typicalMilkMl: number | null };
  recipe?: { milkTypeId: string | null; ml: number | null } | null;
  lastMilkOfDrink?: string | null;
  milks: readonly { id: string }[];
}): MilkChoice | null {
  if (!drink.hasMilk) return null;
  const visible = (id: string | null | undefined) => (id && milks.some((m) => m.id === id) ? id : null);
  if (recipe && (recipe.milkTypeId || recipe.ml !== null)) {
    return { milkTypeId: visible(recipe.milkTypeId), ml: snap(recipe.ml ?? drink.typicalMilkMl ?? MILK_FALLBACK_ML) };
  }
  return {
    milkTypeId: visible(lastMilkOfDrink) ?? milks[0]?.id ?? null,
    ml: snap(drink.typicalMilkMl ?? MILK_FALLBACK_ML),
  };
}

/** After a drink change (AC 5): untouched values follow the new drink; none if it has no milk. */
export function milkAfterDrinkChange(current: MilkChoice | null, touched: ReadonlySet<MilkKey>, next: MilkChoice | null): MilkChoice | null {
  if (!next) return null;
  if (!current) return next;
  return {
    milkTypeId: touched.has("milkTypeId") ? current.milkTypeId : next.milkTypeId,
    ml: touched.has("ml") ? current.ml : next.ml,
  };
}

export class InvalidMilkError extends Error {
  constructor() {
    super("Invalid milk");
    this.name = "InvalidMilkError";
  }
}

/** Milk on save: only for a milk drink, a milk on the household's list, 0 to 500 in tens. */
export function validateMilk({
  hasMilk,
  milkTypeId,
  ml,
  visibleMilkIds,
}: {
  hasMilk: boolean;
  milkTypeId: string | null;
  ml: number | null;
  visibleMilkIds: readonly string[];
}): void {
  if (milkTypeId === null && ml === null) return;
  if (!hasMilk || milkTypeId === null || ml === null) throw new InvalidMilkError();
  if (!visibleMilkIds.includes(milkTypeId)) throw new InvalidMilkError();
  if (!Number.isFinite(ml) || ml < MILK_RANGE.min || ml > MILK_RANGE.max || ml % MILK_RANGE.step !== 0) throw new InvalidMilkError();
}
