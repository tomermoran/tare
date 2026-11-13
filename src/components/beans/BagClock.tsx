"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { updateBagRoastDateAction } from "@/server/actions/bags";
import { DateSheet } from "./PortionSheets";

/**
 * The bag's roasting clock on SCR-BAG (STORY-03-03-01). With no dates at all
 * it says the age is unknown and offers to add a roast date (AC 4).
 */
export function BagClock({ batchId, label, unknown, today }: { batchId: string; label: string; unknown: boolean; today: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");

  const save = async () => {
    setState("saving");
    const result = await updateBagRoastDateAction(batchId, day);
    if (!result.ok) return setState("failed");
    setState("idle");
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-body text-ink">{label}</p>
      {unknown && (
        <>
          <Button variant="ghost" size="sm" className="-ms-4" onClick={() => setOpen(true)}>
            {t("bag.addRoastDate")}
          </Button>
          <DateSheet
            open={open}
            onClose={() => setOpen(false)}
            title={t("bag.addRoastDate")}
            closeLabel={t("actions.close")}
            label={t("bag.roastDate")}
            hint={t("bag.roastDateHint")}
            value={day}
            max={today}
            onChange={setDay}
            confirmLabel={t("actions.save")}
            onConfirm={() => void save()}
            saving={state === "saving"}
            failure={state === "failed" ? { message: t("bag.datesSaveFailed"), retryLabel: t("actions.retry"), onRetry: () => void save() } : undefined}
          />
        </>
      )}
    </div>
  );
}
