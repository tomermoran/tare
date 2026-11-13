"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { allowedActions, isDatedAction, type DatedAction, type PortionAction } from "@/domain/portionActions";
import type { PortionState } from "@/domain/portionState";
import { localDayKey } from "@/domain/localDay";
import { portionStateLabel } from "@/lib/portionStateLabel";
import { addStockCheckAction, setPortionDateAction, splitPortionAction, type PortionResult } from "@/server/actions/portions";
import { DateSheet, PortionActionsSheet, SplitSheet, StockSheet } from "./PortionSheets";

/*
 * Portion actions, wired (TASK-03-02-02-FE2, 03-02-01-FE1): a portion row
 * opens SH-PORTION-ACTIONS with only its state's actions; dated ones go
 * through SH-DATE and split through SH-SPLIT. A failure keeps the sheet
 * open with retry. Weighing (SH-STOCK) joins with EPIC-03-04's screens.
 */

export type PortionInfo = {
  id: string;
  state: PortionState;
  /** Grams left. */
  remaining: number;
  /** Grams the portion was made with. */
  weight: number;
  /** When it went in the freezer, already formatted, for the thaw error. */
  frozenOn: string | null;
};

const today = () => localDayKey(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);

export function usePortionActions(portions: PortionInfo[]): { open: (id: string) => void; weigh: (id: string) => void; sheets: ReactNode } {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [chosen, setChosen] = useState<string | null>(null);
  const [step, setStep] = useState<"actions" | DatedAction | "split" | "weigh" | null>(null);
  const [day, setDay] = useState("");
  const [take, setTake] = useState(1);
  const [weighed, setWeighed] = useState(0);
  const [freezeNew, setFreezeNew] = useState(true);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [dateError, setDateError] = useState<string | undefined>();

  const portion = portions.find((p) => p.id === chosen);
  const grams = (g: number) => format.number(g, { style: "unit", unit: "gram", unitDisplay: "narrow", maximumFractionDigits: 1 });
  const close = () => {
    setStep(null);
    setState("idle");
    setDateError(undefined);
  };
  const done = () => {
    close();
    router.refresh();
  };

  const open = (id: string) => {
    setChosen(id);
    setStep("actions");
  };
  /** Straight to SH-STOCK, from the over-logged Notice. */
  const weigh = (id: string) => {
    const p = portions.find((x) => x.id === id);
    setChosen(id);
    setState("idle");
    setWeighed(Math.round(p?.remaining ?? 0));
    setStep("weigh");
  };

  const choose = (action: string) => {
    if (!portion) return;
    setState("idle");
    setDateError(undefined);
    if (isDatedAction(action as PortionAction)) {
      setDay(today());
      setStep(action as DatedAction);
    } else if (action === "weigh") {
      setWeighed(Math.round(portion.remaining));
      setStep("weigh");
    } else if (action === "split") {
      setTake(Math.max(1, Math.floor(portion.remaining / 2)));
      setFreezeNew(true);
      setStep("split");
    }
  };

  const settle = (result: PortionResult<unknown>) => {
    if (result.ok) return done();
    if (result.error === "future" || result.error === "badDay") {
      setState("idle");
      return setDateError(t("portion.dateFuture"));
    }
    if (result.error === "thawBeforeFreeze") {
      setState("idle");
      return setDateError(t("portion.thawBeforeFreeze", { date: portion?.frozenOn ?? "" }));
    }
    setState("failed");
  };

  const dated = step && step !== "actions" && step !== "split" && step !== "weigh" ? step : null;
  const confirmDate = async () => {
    if (!portion || !dated) return;
    if (day > today()) return setDateError(t("portion.dateFuture"));
    setState("saving");
    settle(await setPortionDateAction(portion.id, dated, day));
  };
  const confirmSplit = async () => {
    if (!portion) return;
    setState("saving");
    settle(await splitPortionAction(portion.id, take, freezeNew));
  };

  const confirmWeigh = async () => {
    if (!portion) return;
    setState("saving");
    settle(await addStockCheckAction(portion.id, weighed));
  };

  const failure = (retry: () => void) =>
    state === "failed" ? { message: t("states.saveFailed"), retryLabel: t("actions.retry"), onRetry: retry } : undefined;

  const sheets = (
    <>
      <PortionActionsSheet
        open={step === "actions" && !!portion}
        onClose={close}
        title={portion ? t("portion.actionsTitle", { state: portionStateLabel(t, portion.state), remaining: grams(portion.remaining) }) : ""}
        closeLabel={t("actions.close")}
        actions={(portion ? allowedActions(portion.state) : []).map((a) => ({ action: a, label: t(`portion.action.${a}`) }))}
        onChoose={choose}
      />
      <DateSheet
        open={!!dated}
        onClose={close}
        title={dated ? t(`portion.dateTitle.${dated}`) : ""}
        closeLabel={t("actions.close")}
        label={t("portion.date")}
        hint={t("portion.dateHint")}
        value={day}
        max={today()}
        onChange={(v) => {
          setDay(v);
          setDateError(undefined);
        }}
        error={dateError}
        confirmLabel={dated ? t(`portion.confirm.${dated}`) : ""}
        onConfirm={() => void confirmDate()}
        saving={state === "saving"}
        failure={failure(() => void confirmDate())}
      />
      <SplitSheet
        open={step === "split" && !!portion}
        onClose={close}
        labels={{
          title: t("portion.splitTitle"),
          close: t("actions.close"),
          takeOut: t("portion.takeOut"),
          remainder: (g) => t("portion.splitRemainder", { grams: grams(g) }),
          freezeNew: t("portion.freezeNew"),
          confirm: t("portion.splitConfirm"),
        }}
        remaining={portion?.remaining ?? 0}
        take={take}
        onTakeChange={setTake}
        freezeNew={freezeNew}
        onFreezeNewChange={setFreezeNew}
        onConfirm={() => void confirmSplit()}
        saving={state === "saving"}
        failure={failure(() => void confirmSplit())}
      />
      <StockSheet
        open={step === "weigh" && !!portion}
        onClose={close}
        labels={{
          title: t("portion.stockTitle"),
          close: t("actions.close"),
          weight: t("portion.stockWeight"),
          hint: t("portion.stockHint"),
          save: t("portion.saveWeight"),
        }}
        grams={weighed}
        max={Math.max(portion?.weight ?? 0, portion?.remaining ?? 0)}
        onGramsChange={setWeighed}
        onSave={() => void confirmWeigh()}
        saving={state === "saving"}
        failure={failure(() => void confirmWeigh())}
      />
    </>
  );

  return { open, weigh, sheets };
}
