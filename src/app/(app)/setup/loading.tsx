import { getTranslations } from "next-intl/server";
import { ListSkeleton } from "@/components/ui/Skeleton/Skeleton";

export default async function SetupLoading() {
  const t = await getTranslations("states");
  return <ListSkeleton label={t("loading")} />;
}
