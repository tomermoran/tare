import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getFormatter, getTranslations } from "next-intl/server";
import { TasteFlow } from "@/components/taste/TasteFlow";
import { drinkLabel, type DrinkKey } from "@/domain/drinkName";
import { shotSetupName } from "@/domain/shotSetupName";
import { partHref } from "@/lib/setupRoutes";
import { getShot } from "@/server/dal/journal";
import { getSuggestContext } from "@/server/dal/suggestContext";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";

/**
 * SCR-TASTE: say how a just-saved measured shot tasted (EPIC-01-05).
 * One-tap shots are never rated (DQ-23), so they go to their detail.
 */
export default function TastePage({ params }: PageProps<"/taste/[shotId]">) {
  return (
    <Suspense fallback={null}>
      <Taste params={params} />
    </Suspense>
  );
}

async function Taste({ params }: Pick<PageProps<"/taste/[shotId]">, "params">) {
  const { shotId } = await params;
  const shot = await unlessSignedOut(getShot(shotId)).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!shot) return null;
  if (shot.entryMode !== "measured") redirect(`/journal/${shot.id}`);
  const [t, format, { grinderPartId, ...context }] = await Promise.all([getTranslations(), getFormatter(), getSuggestContext(shot.id)]);
  const directionHref = grinderPartId ? `${partHref(grinderPartId)}?${new URLSearchParams({ returnTo: `/taste/${shot.id}` })}` : null;
  const pinTitle = t("recipe.pinTitle", {
    drink: drinkLabel(shot.drink, (key: DrinkKey) => t(key)),
    coffee: shot.coffee.name,
    setup: shotSetupName(shot.setup, (items) => format.list(items, { type: "conjunction" })),
  });

  return (
    <TasteFlow
      shotId={shot.id}
      values={shot.values}
      milkDrink={shot.milkDrink}
      initial={{ rating: shot.rating, ...shot.taste, tags: shot.tags }}
      leaveTo="/"
      pinTitle={pinTitle}
      suggestion={{ context, directionHref }}
    />
  );
}
