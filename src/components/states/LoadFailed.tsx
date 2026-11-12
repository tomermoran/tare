"use client";

import { useTranslations } from "next-intl";
import { Notice } from "@/components/ui/Notice/Notice";

/**
 * What a screen shows when it couldn't load (NC-10, neutral, never signal):
 * a heading, one sentence and retry. Used by every route's error.tsx.
 */
export function LoadFailed({ retry }: { retry: () => void }) {
  const t = useTranslations();
  return (
    <Notice
      urgent
      title={t("states.loadFailedTitle")}
      action={{ label: t("actions.retry"), onClick: retry }}
      className="mt-6"
    >
      {t("states.loadFailed")}
    </Notice>
  );
}
