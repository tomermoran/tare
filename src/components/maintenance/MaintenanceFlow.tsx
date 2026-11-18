"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { MaintenanceSection, type MaintenanceRow } from "@/components/screens/UnitScreen/MaintenanceSection";
import { canRecalibrate, MAINTENANCE_KINDS, recalibrationDefault, type MaintenanceKind } from "@/domain/maintenance";
import { addMaintenanceAction, getEventAction } from "@/server/actions/maintenance";
import { useOffsetFlow } from "@/components/recipes/useOffsetFlow";
import type { RedialState } from "@/domain/redial";
import { RedialPick } from "@/components/redial/RedialPick";
import { Button } from "@/components/ui/Button/Button";
import type { SelectOption } from "@/components/ui/SelectSheet/SelectSheet";
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
  redial,
  redialMore,
}: {
  /** The grinder's event awaiting a re-dial, with the coffees to pick from (recipe IDs). */
  redial?: { eventId: string; options: SelectOption[] };
  /** A burrs event with one re-dial, with the coffees for a second, farthest first (STORY-04-04-03). */
  redialMore?: { eventId: string; options: SelectOption[] };
  partId: string;
  partKind: string;
  /** Each with its re-dial state and shift, for a grinder (STORY-04-03-05). */
  events: (Omit<MaintenanceRow, "state" | "onOpen"> & { redial?: RedialState; shift?: number | null; stretch?: number })[];
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
  const [picking, setPicking] = useState<"redial" | "more" | null>(null);
  const format = useFormatter();
  const offset = useOffsetFlow();
  const [opening, setOpening] = useState<"idle" | "failed">("idle");

  // A grinder event that can have a shift opens SH-OFFSET (STORY-04-03-05 AC 1, AC 2, AC 4, AC 5).
  const openEvent = async (id: string) => {
    setOpening("idle");
    const result = await getEventAction(id);
    if (!result.ok) return setOpening("failed");
    offset.edit(result.data, {
      onRedial: redial?.options.length ? () => setPicking("redial") : undefined,
      onRedialMore: redialMore?.eventId === id && redialMore.options.length ? () => setPicking("more") : undefined,
    });
  };
  const stateWords = (e: (typeof events)[number]): string | undefined => {
    switch (e.redial) {
      case "awaiting":
        return t("maintenance.state.awaiting");
      case "confirmed": {
        const value = format.number(e.shift ?? 0, { signDisplay: "exceptZero", maximumFractionDigits: 2 });
        // With one coffee the stretch is none and isn't shown (DES-04-04-01).
        return e.stretch
          ? t("maintenance.state.shiftStretch", { value, percent: format.number(e.stretch, { style: "unit", unit: "percent", signDisplay: "exceptZero" }) })
          : t("maintenance.state.shift", { value });
      }
      case "noAdjustment":
        return t("maintenance.state.noAdjustment");
      case "nothingToMap":
        return t("maintenance.state.nothingToMap");
      default:
        return undefined;
    }
  };
  const rows: MaintenanceRow[] = events.map(({ redial: state, shift: _shift, stretch: _stretch, ...e }) => ({
    ...e,
    state: stateWords({ ...e, redial: state, shift: _shift, stretch: _stretch }),
    onOpen: state === "awaiting" || state === "confirmed" || state === "noAdjustment" ? () => void openEvent(e.id) : undefined,
  }));
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
        events={rows}
        status={
          redial ? (
            <div className="flex flex-col items-start gap-3 pt-1 pb-3">
              <p className="text-body text-ink">{t("maintenance.redialAwaiting")}</p>
              {redial.options.length > 0 && (
                <Button variant="secondary" onClick={() => setPicking("redial")}>
                  {t("maintenance.redialStart")}
                </Button>
              )}
            </div>
          ) : undefined
        }
        onAdd={start}
      />
      {offset.sheet}
      <p role="status" className="text-label text-ink-secondary empty:hidden">
        {opening === "failed" ? t("states.loadFailed") : offset.said}
      </p>
      {redial && (
        <RedialPick
          open={picking === "redial"}
          onClose={() => setPicking(null)}
          eventId={redial.eventId}
          options={redial.options}
          labels={{ title: t("redial.pick"), close: t("actions.close") }}
        />
      )}
      {redialMore && (
        <RedialPick
          open={picking === "more"}
          onClose={() => setPicking(null)}
          eventId={redialMore.eventId}
          options={redialMore.options}
          labels={{ title: t("redial.pick"), close: t("actions.close") }}
        />
      )}
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
