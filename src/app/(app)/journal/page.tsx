import { connection } from "next/server";
import { Suspense } from "react";
import { JournalList } from "@/components/journal/JournalList";
import { RecentShotsScreen } from "@/components/screens/RecentShotsScreen/RecentShotsScreen";
import { localDayKey } from "@/domain/localDay";
import { listJournal } from "@/server/dal/journal";
import { unlessSignedOut } from "@/server/dal/scope";
import { getTimeZone } from "@/server/time";

/** SCR-SHOTS, the Journal tab: the last 30 days, then older on request. */
export default function JournalPage() {
  return (
    <Suspense fallback={<RecentShotsScreen state="loading" items={[]} now={new Date(0)} />}>
      <Journal />
    </Suspense>
  );
}

async function Journal() {
  // The 30-day window and "today" depend on the request time.
  await connection();
  const [page, timeZone] = await Promise.all([unlessSignedOut(listJournal()), getTimeZone()]);
  if (!page) return <RecentShotsScreen state="loading" items={[]} now={new Date(0)} />;
  return <JournalList shots={page.shots} older={page.older} today={localDayKey(new Date(), timeZone)} timeZone={timeZone} />;
}
