import { recipeInForce } from "./recipeInForce";
import type { DriftPin, DriftShot } from "./types";

/*
 * Which shots are measurements (STORY-04-02-03): measured shots whose WDT and
 * puck screen match the recipe they were brewed from. One-tap shots copy a
 * recipe, so they never are; a good one is only "the recipe was fine".
 */

export type JudgedShot = DriftShot & { recipe: DriftPin };

export type Eligibility = {
  kept: JudgedShot[];
  leftOutPrep: DriftShot[];
  leftOutNoRecipe: DriftShot[];
  oneTap: DriftShot[];
};

export function eligible(shots: readonly DriftShot[], pins: readonly DriftPin[]): Eligibility {
  const out: Eligibility = { kept: [], leftOutPrep: [], leftOutNoRecipe: [], oneTap: [] };
  for (const s of shots) {
    if (s.entryMode !== "measured") {
      out.oneTap.push(s);
      continue;
    }
    const recipe = recipeInForce(s, pins);
    if (!recipe) out.leftOutNoRecipe.push(s);
    else if (recipe.prep.wdt !== s.prep.wdt || recipe.prep.puckScreen !== s.prep.puckScreen) out.leftOutPrep.push(s);
    else out.kept.push({ ...s, recipe });
  }
  return out;
}
