import { connection } from "next/server";
import { Suspense } from "react";
import { JournalList } from "@/components/journal/JournalList";
import { RecentShotsScreen } from "@/components/screens/RecentShotsScreen/RecentShotsScreen";
import { localDayKey } from "@/domain/localDay";
import { readJournalFilters } from "@/lib/journalFilters";
import { getJournalFilterOptions, listJournal, type JournalFilters } from "@/server/dal/journal";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/**
 * SCR-SHOTS, the Journal tab: the last 30 days, then older on request,
 * narrowed by the filters in the URL (STORY-02-06-04).
 */
export default function JournalPage({ searchParams }: PageProps<"/journal">) {
  return (
    <Suspense fallback={<RecentShotsScreen state="loading" items={[]} now={new Date(0)} />}>
      <Journal searchParams={searchParams} />
    </Suspense>
  );
}

async function Journal({ searchParams }: Pick<PageProps<"/journal">, "searchParams">) {
  const asked = readJournalFilters(await searchParams);
  // The 30-day window and "today" depend on the request time.
  await connection();
  const [options, timeZone] = await Promise.all([unlessSignedOut(getJournalFilterOptions({ beanId: asked.beanId })), getTimeZone()]);
  if (!options) return <RecentShotsScreen state="loading" items={[]} now={new Date(0)} />;
  // A filter that names nothing of this household's is dropped, never shown as a mystery.
  const filters: JournalFilters = {
    ...(asked.drinkId && options.drinks.some((d) => d.id === asked.drinkId) && { drinkId: asked.drinkId }),
    ...(options.beanId && { beanId: options.beanId }),
    ...(asked.setupId && options.setups.length > 1 && options.setups.some((s) => s.id === asked.setupId) && { setupId: asked.setupId }),
  };
  const page = await listJournal({ filters });
  return (
    <JournalList
      key={JSON.stringify(filters)}
      shots={page.shots}
      older={page.older}
      today={localDayKey(new Date(), timeZone)}
      timeZone={timeZone}
      filters={filters}
      options={options}
    />
  );
}
