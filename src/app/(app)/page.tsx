import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { LOG_PATH } from "@/lib/logRoutes";

/** Brew (SCR-HOME). Interim until EPIC-02-02 and the first-run checklist ship. */
export default async function BrewPage() {
  const t = await getTranslations();
  return (
    <EmptyState title={t("home.interimTitle")} action={{ label: t("actions.logShot"), href: LOG_PATH }}>
      {t("home.interim")}
    </EmptyState>
  );
}
