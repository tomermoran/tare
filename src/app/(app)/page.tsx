import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";

/** Brew (SCR-HOME). Interim until EPIC-02-02 and the first-run checklist ship. */
export default async function BrewPage() {
  const t = await getTranslations("home");
  return <EmptyState title={t("interimTitle")}>{t("interim")}</EmptyState>;
}
