import type { RecentItem } from "@/components/screens/RecentShotsScreen/RecentShotsScreen";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import messages from "@/i18n/messages/en.json";

/*
 * Fictional example data for screen stories. Coffee, roaster and toolkit
 * names are user data (they'd come from the catalog and the household), so
 * they live here rather than in the i18n messages. No real people or
 * products' private details.
 */

export const exampleRecipe: ShotValuesData = { grind: 15, dose: 18, yield: 38, timeMs: 27_600 };

export const exampleCoffee = { bean: "Ethiopia Guji, washed", roaster: "Northfield Roasters", ageDays: 12 };
export const exampleToolkit = "Daily espresso";
export const exampleRemainingGrams = 142;

const at = (daysAgo: number, h: number, m: number) => {
  const d = new Date(2026, 9, 18, h, m);
  d.setDate(d.getDate() - daysAgo);
  return d;
};

export const exampleNow = new Date(2026, 9, 18, 9, 0);

export const exampleShots: RecentItem[] = [
  { kind: "shot", id: "s1", drink: messages.drinks.latte, at: at(0, 7, 42), coffee: exampleCoffee.bean, values: exampleRecipe, oneTap: true, reaction: "good" },
  { kind: "shot", id: "s3", drink: messages.drinks.espresso, at: at(1, 15, 10), coffee: exampleCoffee.bean, values: { grind: 14.5, dose: 18, yield: 36, timeMs: 31_200 }, channelling: true },
  { kind: "shot", id: "s2", drink: messages.drinks.latte, at: at(1, 7, 35), coffee: exampleCoffee.bean, values: exampleRecipe, oneTap: true },
  { kind: "maintenance", id: "m1", unit: "Grinder", work: "burrs", at: at(2, 12, 0) },
  { kind: "shot", id: "s4", drink: messages.drinks.latte, at: at(2, 7, 50), coffee: "Colombia Huila", values: { grind: 18, dose: 18, yield: 38, timeMs: 26_100 } },
];
