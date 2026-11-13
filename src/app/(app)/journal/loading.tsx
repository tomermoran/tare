import { RecentShotsScreen } from "@/components/screens/RecentShotsScreen/RecentShotsScreen";

export default function JournalLoading() {
  return <RecentShotsScreen state="loading" items={[]} now={new Date(0)} />;
}
