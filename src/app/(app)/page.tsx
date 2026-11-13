import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LogoMark } from "@/components/brand/Logo/Logo";
import { BrewFlow, type BrewAction } from "@/components/home/BrewFlow";
import { BrewSkeleton } from "@/components/ui/Skeleton/Skeleton";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { personaLabel } from "@/domain/personaLabel";
import { setupLabel } from "@/domain/setupName";
import { LOG_PATH } from "@/lib/logRoutes";
import { PROFILE_PATH } from "@/lib/profileRoutes";
import { getHome, type Home } from "@/server/dal/home";
import { getProfile } from "@/server/dal/profile";
import { getSetupProgress } from "@/server/dal/progress";
import { readBrewChoice } from "@/server/brewChoice";
import { unlessSignedOut } from "@/server/dal/scope";
import { portionStateLabel } from "@/lib/portionStateLabel";
import { FirstRun } from "./FirstRun";
import { recipeLines } from "./recipeLines";

/**
 * Brew (SCR-HOME): the persona label, which opens Profile (STORY-01-01-03),
 * then the first-run checklist until the first shot (STORY-01-01-07), then
 * the daily shot (STORY-02-02-01): the drink for this time of day, the
 * coffee in use, the recipe on the current setup and what's left.
 * A drink or coffee chosen here applies to the next pull only (DQ-17).
 */
export default async function BrewPage() {
  const t = await getTranslations();
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-8 items-center justify-between">
        <Suspense fallback={<span className="py-1.5 text-label text-ink-secondary">{t("profile.defaultName")}</span>}>
          <PersonaLink />
        </Suspense>
        <LogoMark size={24} className="text-ink" />
      </div>
      <Suspense fallback={<BrewSkeleton label={t("states.loading")} />}>
        <BrewBody />
      </Suspense>
    </div>
  );
}

async function BrewBody() {
  const progress = await unlessSignedOut(getSetupProgress());
  if (!progress) return null;
  if (!progress.hasShot) return <FirstRun progress={progress} />;
  const choice = await readBrewChoice();
  const home = await getHome({ drinkId: choice?.drinkId, beanId: choice?.beanId });
  if (!home) return <FirstRun progress={progress} />;
  return <Brew home={home} />;
}

async function Brew({ home }: { home: Home }) {
  const [t, format] = await Promise.all([getTranslations(), getFormatter()]);
  const list = (items: string[]) => format.list(items, { type: "conjunction" });
  const drink = drinkLabel(home.drink, (key: DrinkKey) => t(key));
  const setup = (s: Home["setup"]) => setupLabel(s, home.setups, list);
  const { state } = home;

  const dialIn: BrewAction = {
    kind: "link",
    label: t("home.dialIn"),
    href: `${LOG_PATH}?${new URLSearchParams({ drinkId: home.drink.id, ...(home.portion ? { portionId: home.portion.id } : {}) })}`,
  };
  const addBag = { kind: "link", label: t("home.addBag"), href: `/beans/add?${new URLSearchParams({ returnTo: "/" })}` } as const;
  const chooseCoffee: BrewAction = { kind: "chooseCoffee", label: t("home.chooseCoffee") };

  const recipe = state.kind === "recipe" ? state.recipe : state.kind === "finished" ? state.recipe : null;
  const message = {
    recipe: undefined,
    noRecipe: t("home.noRecipe"),
    noRecipeOnSetup: t("home.noRecipeOnSetup"),
    finished: t("home.coffeeFinished"),
    noCoffee: t("home.noCoffee"),
  }[state.kind];
  const [primary, secondary]: [BrewAction, BrewAction?] =
    state.kind === "recipe"
      ? [{ kind: "pull", label: t("home.pull") }, dialIn]
      : state.kind === "finished"
        ? home.coffees.length
          ? [chooseCoffee, addBag]
          : [addBag]
        : state.kind === "noCoffee"
          ? [addBag]
          : [dialIn];

  return (
    <BrewFlow
      screen={{
        drink,
        coffee: home.coffee ? t("home.coffeeLine", { bean: home.coffee.name, roaster: home.coffee.roasterName }) : null,
        values: recipe ? { grind: recipe.grind, dose: recipe.dose, yield: recipe.yield, timeMs: recipe.timeMs } : undefined,
        valuesKey: `${home.drink.id}|${home.coffee?.id ?? ""}`,
        quiet: state.kind === "finished",
        lines: recipe ? recipeLines(recipe, { hasMilk: home.drink.hasMilk, milks: home.milks }, t, format) : [],
        message,
        note: state.kind === "noRecipeOnSetup" ? t("home.startsFrom", { setup: setup(state.from) }) : undefined,
        setup: setup(home.setup),
        footnote:
          home.remaining && state.kind !== "finished"
            ? t("home.remaining", {
                amount: format.number(home.remaining.grams, { style: "unit", unit: "gram", unitDisplay: "short", maximumFractionDigits: 0 }),
              })
            : undefined,
        labels: { changeDrink: t("home.changeDrink"), changeCoffee: t("home.changeCoffee") },
      }}
      primary={primary}
      secondary={secondary}
      pull={state.kind === "recipe" && home.coffee ? { drinkTypeId: home.drink.id, beanId: home.coffee.id } : undefined}
      addBagHref={addBag.href}
      drinks={home.drinks.map((d) => ({
        id: d.id,
        primary: drinkLabel(d, (key: DrinkKey) => t(key)),
        marker: d.id === home.usual.drinkId ? t("home.usual") : undefined,
      }))}
      coffees={home.coffees.map((c) => ({
        id: c.bean.id,
        primary: c.bean.name,
        secondary: c.bean.roasterName,
        marker: c.frozenOnly ? portionStateLabel(t, "frozen") : c.bean.id === home.usual.beanId ? t("home.usual") : undefined,
      }))}
      drinkId={home.drink.id}
      beanId={home.coffee?.id ?? null}
    />
  );
}

async function PersonaLink() {
  const [t, profile] = await Promise.all([getTranslations("profile"), unlessSignedOut(getProfile())]);
  return (
    <Link href={PROFILE_PATH} className="py-1.5 text-label text-ink-secondary hover:text-ink">
      {personaLabel({ name: profile?.name ?? null }, t("defaultName"))}
    </Link>
  );
}
