/**
 * The drinks every new household starts with (S-02), in their display order.
 * Each household gets its own copy, which it can rename, hide or add to.
 * Names come from the `drinks.*` messages; typicalMilkMl pre-fills the milk
 * amount on milk drinks.
 */
export const STARTER_DRINKS = [
  { nameKey: "drinks.espresso", hasMilk: false, typicalMilkMl: null },
  { nameKey: "drinks.ristretto", hasMilk: false, typicalMilkMl: null },
  { nameKey: "drinks.lungo", hasMilk: false, typicalMilkMl: null },
  // Water, not milk: no milk amount.
  { nameKey: "drinks.americano", hasMilk: false, typicalMilkMl: null },
  { nameKey: "drinks.cortado", hasMilk: true, typicalMilkMl: 60 },
  { nameKey: "drinks.flatWhite", hasMilk: true, typicalMilkMl: 120 },
  { nameKey: "drinks.cappuccino", hasMilk: true, typicalMilkMl: 120 },
  { nameKey: "drinks.latte", hasMilk: true, typicalMilkMl: 200 },
  { nameKey: "drinks.macchiato", hasMilk: true, typicalMilkMl: 15 },
] as const;
