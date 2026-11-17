import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { DrinksFlow } from "@/components/lists/DrinksFlow";
import { ListSkeleton } from "@/components/ui/Skeleton/Skeleton";
import { PROFILE_PATH } from "@/lib/profileRoutes";
import { safeReturnTo } from "@/lib/returnTo";
import { listDrinks } from "@/server/dal/drinks";
import { unlessSignedOut } from "@/server/dal/scope";

/** SCR-DRINKS (EPIC-02-05, DRINKS_PATH): ?returnTo=… goes back where it was opened, else Profile. */
export default async function DrinksPage({ searchParams }: PageProps<"/profile/drinks">) {
  const t = await getTranslations();
  return (
    <Suspense fallback={<ListSkeleton label={t("states.loading")} rows={6} />}>
      <Drinks searchParams={searchParams} />
    </Suspense>
  );
}

async function Drinks({ searchParams }: Pick<PageProps<"/profile/drinks">, "searchParams">) {
  const params = await searchParams;
  const returnTo = typeof params.returnTo === "string" ? params.returnTo : undefined;
  const drinks = await unlessSignedOut(listDrinks());
  if (!drinks) return <ListSkeleton label={(await getTranslations())("states.loading")} rows={6} />;
  return <DrinksFlow drinks={drinks} backHref={safeReturnTo(returnTo, PROFILE_PATH)} />;
}
