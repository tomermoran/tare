"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MaintenanceSection, type MaintenanceRow } from "@/components/screens/UnitScreen/MaintenanceSection";
import { canRecalibrate, MAINTENANCE_KINDS, recalibrationDefault, type MaintenanceKind } from "@/domain/maintenance";
import { addMaintenanceAction } from "@/server/actions/maintenance";
import { MaintenanceSheet, RecalibrationToggle, type MaintenanceDraft } from "./MaintenanceSheet";

/*
 * Maintenance on SCR-UNIT, wired (EPIC-04-01): the list, and the sheet that
 * saves an event and refreshes the part, its grind period with it. The
 * recalibration toggle follows the kind's default until it's touched
 * (DQ-15), and is offered for grinders only (STORY-04-01-02 AC 4).
 */
export function MaintenanceFlow({
  partId,
  partKind,
  events,
  period,
  today,
}: {
  partId: string;
  partKind: string;
  events: MaintenanceRow[];
  period?: { line: string; shots?: string };
  /** Today in the device's zone, YYYY-MM-DD. */
  today: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const blank: MaintenanceDraft = { kind: null, day: today, note: "" };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(blank);
  const [touched, setTouched] = useState<boolean | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const grinder = canRecalibrate(partKind);
  const recalibration = touched ?? (draft.kind ? recalibrationDefault(partKind, draft.kind) : false);

  const start = () => {
    setDraft(blank);
    setTouched(null);
    setState("idle");
    setOpen(true);
  };

  const save = async () => {
    if (!draft.kind) return;
    setState("saving");
    const result = await addMaintenanceAction(partId, {
      kind: draft.kind,
      ...(draft.day !== today && { day: draft.day }),
      note: draft.note || null,
      ...(grinder && { isRecalibration: recalibration }),
    });
    if (!result.ok) return setState("failed");
    setState("idle");
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <MaintenanceSection
        labels={{
          title: t("maintenance.title"),
          none: t("maintenance.none"),
          add: t("maintenance.add"),
          recalibration: t("maintenance.recalibration"),
        }}
        period={period}
        events={events}
        onAdd={start}
      />
      <MaintenanceSheet
        open={open}
        onClose={() => setOpen(false)}
        labels={{
          title: t("maintenance.sheetTitle"),
          close: t("actions.close"),
          kind: t("maintenance.kindLabel"),
          kinds: Object.fromEntries(MAINTENANCE_KINDS.map((k) => [k, t(`maintenance.kind.${k}`)])) as Record<MaintenanceKind, string>,
          date: t("maintenance.date"),
          dateHint: t("maintenance.dateHint"),
          note: t("maintenance.note"),
          noteHint: t("maintenance.noteHint"),
          save: t("maintenance.save"),
          saveFailed: t("maintenance.saveFailed"),
          retry: t("actions.retry"),
        }}
        value={draft}
        onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
        today={today}
        recalibration={
          grinder ? (
            <RecalibrationToggle
              label={t("maintenance.isRecalibration")}
              hint={t("maintenance.isRecalibrationHint")}
              checked={recalibration}
              onChange={setTouched}
            />
          ) : undefined
        }
        state={state}
        onSave={() => void save()}
      />
    </>
  );
}
