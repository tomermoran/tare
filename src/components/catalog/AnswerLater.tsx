"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useState } from "react";
import { notSureCapabilities, parseCapabilities, type Capabilities, type HardwareKind } from "@/domain/capabilities";
import {
  answerFromDose,
  answersFromGrinder,
  answersFromMachine,
  doseFromAnswer,
  grinderFromAnswers,
  machineFromAnswers,
} from "@/domain/capabilityQuestions";
import { updateModelCapabilitiesAction } from "@/server/actions/catalog";
import { BasketQuestions } from "./BasketQuestions";
import { CapabilityEditSheet } from "./CapabilityEditSheet";
import { GrinderQuestions } from "./GrinderQuestions";
import { MachineQuestions } from "./MachineQuestions";
import { useCapabilityLabels } from "./useCapabilityLabels";

/**
 * "Answer these again" on SCR-UNIT, wired (STORY-01-06-09). Prefills the
 * questions from what's stored; saving refreshes the page, so the summary
 * and the next log follow.
 */
export function AnswerLater({ hardwareId, kind, capabilities }: { hardwareId: string; kind: HardwareKind; capabilities: unknown }) {
  const t = useTranslations();
  const router = useRouter();
  const labels = useCapabilityLabels();
  const stored = parseCapabilities(kind, capabilities) ?? notSureCapabilities(kind);
  const as = <K extends HardwareKind>(k: K): Capabilities<K> => (kind === k ? (stored as Capabilities<K>) : notSureCapabilities(k));
  const initial = () => ({
    machine: answersFromMachine(as("machine")),
    grinder: answersFromGrinder(as("grinder")),
    dose: answerFromDose(as("basket").dose),
  });
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");

  // Next keeps a left page's state; closing starts fresh from what's stored.
  useLayoutEffect(() => () => setOpen(false), []);

  const save = async () => {
    setState("saving");
    const next =
      kind === "machine" ? machineFromAnswers(answers.machine) : kind === "grinder" ? grinderFromAnswers(answers.grinder) : { dose: doseFromAnswer(answers.dose) };
    const result = await updateModelCapabilitiesAction({ hardwareId, capabilities: next });
    if (!result.ok) return setState("failed");
    setState("idle");
    setOpen(false);
    router.refresh();
  };

  return (
    <CapabilityEditSheet
      labels={{
        open: t("unit.editCapabilities"),
        hint: t("unit.editCapabilitiesHint"),
        title: t("unit.editCapabilitiesTitle"),
        why: t("catalog.cap.why"),
        save: t("actions.save"),
        close: t("actions.close"),
        saveFailed: t("states.saveFailed"),
      }}
      open={open}
      onOpen={() => {
        setAnswers(initial());
        setState("idle");
        setOpen(true);
      }}
      onClose={() => setOpen(false)}
      onSave={save}
      state={state}
    >
      {kind === "machine" ? (
        <MachineQuestions labels={labels.machine} answers={answers.machine} onChange={(machine) => setAnswers((a) => ({ ...a, machine }))} />
      ) : kind === "grinder" ? (
        <GrinderQuestions labels={labels.grinder} answers={answers.grinder} onChange={(grinder) => setAnswers((a) => ({ ...a, grinder }))} />
      ) : (
        <BasketQuestions labels={labels.basket} answer={answers.dose} onChange={(dose) => setAnswers((a) => ({ ...a, dose }))} />
      )}
    </CapabilityEditSheet>
  );
}
