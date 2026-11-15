/*
 * The milk line for a milk drink (TASK-01-03-07-FE1): "Oat, 150 ml", or the
 * milk's name alone when no amount was recorded. The amount is formatted
 * with Intl as millilitres, never joined by hand.
 */

type Translate = {
  (key: "shot.milkLine", values: { milk: string; amount: string }): string;
};
type Format = {
  number(value: number, options: { style: "unit"; unit: "milliliter"; unitDisplay: "short" }): string;
};

export function milkLine(name: string, ml: number | null, t: Translate, format: Format): string {
  if (ml === null) return name;
  return t("shot.milkLine", { milk: name, amount: format.number(ml, { style: "unit", unit: "milliliter", unitDisplay: "short" }) });
}
