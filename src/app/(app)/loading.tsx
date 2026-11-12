import { getTranslations } from "next-intl/server";
import { BrewSkeleton } from "@/components/ui/Skeleton/Skeleton";

export default async function BrewLoading() {
  const t = await getTranslations("states");
  return <BrewSkeleton label={t("loading")} />;
}
