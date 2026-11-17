import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { MilksFlow } from "@/components/lists/MilksFlow";
import { ListSkeleton } from "@/components/ui/Skeleton/Skeleton";
import { PROFILE_PATH } from "@/lib/profileRoutes";
import { safeReturnTo } from "@/lib/returnTo";
import { listMilks } from "@/server/dal/milks";
import { unlessSignedOut } from "@/server/dal/scope";

/** SCR-MILKS (STORY-02-05-05, MILKS_PATH): ?returnTo=… goes back where it was opened, else Profile. */
export default async function MilksPage({ searchParams }: PageProps<"/profile/milks">) {
  const t = await getTranslations();
  return (
    <Suspense fallback={<ListSkeleton label={t("states.loading")} rows={6} />}>
      <Milks searchParams={searchParams} />
    </Suspense>
  );
}

async function Milks({ searchParams }: Pick<PageProps<"/profile/milks">, "searchParams">) {
  const params = await searchParams;
  const returnTo = typeof params.returnTo === "string" ? params.returnTo : undefined;
  const milks = await unlessSignedOut(listMilks());
  if (!milks) return <ListSkeleton label={(await getTranslations())("states.loading")} rows={6} />;
  return <MilksFlow milks={milks} backHref={safeReturnTo(returnTo, PROFILE_PATH)} />;
}
