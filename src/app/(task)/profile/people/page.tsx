import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PeopleFlow, type PeopleFlowRow } from "@/components/people/PeopleFlow";
import { ListSkeleton } from "@/components/ui/Skeleton/Skeleton";
import { daysBetween, localDayKey } from "@/domain/localDay";
import { personaLabel } from "@/domain/personaLabel";
import { lastHadLabel } from "@/lib/lastHad";
import { PROFILE_PATH } from "@/lib/profileRoutes";
import { safeReturnTo } from "@/lib/returnTo";
import { listPeople } from "@/server/dal/people";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/** SCR-PEOPLE (STORY-05-01-01): ?returnTo=… goes back where it was opened, else Profile. */
export default async function PeoplePage({ searchParams }: PageProps<"/profile/people">) {
  const t = await getTranslations();
  return (
    <Suspense fallback={<ListSkeleton label={t("states.loading")} rows={3} />}>
      <People searchParams={searchParams} />
    </Suspense>
  );
}

async function People({ searchParams }: Pick<PageProps<"/profile/people">, "searchParams">) {
  const [params, t, locale, timeZone, people] = await Promise.all([searchParams, getTranslations(), getLocale(), getTimeZone(), unlessSignedOut(listPeople())]);
  if (!people) return <ListSkeleton label={t("states.loading")} rows={3} />;
  const returnTo = typeof params.returnTo === "string" ? params.returnTo : undefined;
  const today = localDayKey(new Date(), timeZone);
  const rows: PeopleFlowRow[] = people.map((p) => ({
    id: p.id,
    name: personaLabel(p, t("profile.defaultName")),
    main: p.main,
    secondary: p.lastShotAt
      ? t("people.summary", { count: p.shots, when: lastHadLabel(daysBetween(localDayKey(p.lastShotAt, timeZone), today), locale) })
      : t("people.noShots"),
    editName: p.name ?? "",
    sheet: {
      removable: !p.main && !p.claimed && p.shots === 0 && p.recipes === 0,
      cantRemove: !p.main && (p.shots > 0 || p.recipes > 0) ? t("people.cantRemove", { shots: p.shots, recipes: p.recipes }) : undefined,
    },
  }));
  return <PeopleFlow rows={rows} backHref={safeReturnTo(returnTo, PROFILE_PATH)} />;
}
