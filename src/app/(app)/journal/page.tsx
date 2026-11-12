import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";

/** Journal tab. Interim empty state until its own epic fills it (DES-01-01-06). */
export default async function JournalPage() {
  const t = await getTranslations("journal");
  return (
    <>
      <PageHeader title={t("title")} />
      <EmptyState title={t("emptyTitle")}>{t("empty")}</EmptyState>
    </>
  );
}
