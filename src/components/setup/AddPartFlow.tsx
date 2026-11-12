"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useState } from "react";
import { CapabilitySummary } from "@/components/catalog/CapabilitySummary";
import { UnitAddScreen, UNIT_KINDS } from "@/components/screens/UnitAddScreen/UnitAddScreen";
import { useUnsavedChanges } from "@/components/task/useUnsavedChanges";
import type { HardwareKind } from "@/domain/capabilities";
import { clearDraft, loadDraft, saveDraft } from "@/lib/drafts";
import { returnWithSelection, withReturnTo } from "@/lib/returnTo";
import { addPartAction } from "@/server/actions/parts";
import type { PartModel } from "@/server/dal/parts";

/*
 * The add-a-part flow (SCR-UNIT-ADD): kind, pick the model in the catalog
 * picker, details, save. Going to the picker keeps the draft and comes back
 * with `?selected=`. After saving it returns to `returnTo`, continues the
 * walk-through to the next missing kind (machine, grinder, basket), or goes
 * to Setup, where the first-setup offer waits once all three exist.
 */

export const ADD_PART_PATH = "/setup/add-part";
const DRAFT = "add-part";
const SETUP = "/setup";

type Draft = { kind: HardwareKind; model: PartModel | null; nickname: string; acquired: string };

export function AddPartFlow({
  initialKind,
  picked,
  resume,
  walk,
  returnTo,
  haveKinds,
  today,
}: {
  initialKind: HardwareKind;
  /** The model just chosen in the picker, if any. */
  picked: PartModel | null;
  /** Back from the picker: restore the draft. */
  resume: boolean;
  /** The checklist walk-through: carry on to the next missing kind. */
  walk: boolean;
  returnTo: string | null;
  /** Kinds the household already has a part of. */
  haveKinds: HardwareKind[];
  today: string;
}) {
  const t = useTranslations();
  const router = useRouter();

  const withPick = (d: Draft): Draft => (picked ? { ...d, kind: picked.kind, model: picked } : d);
  const fresh = (): Draft => withPick({ kind: initialKind, model: null, nickname: "", acquired: "" });
  const [draft, setDraft] = useState<Draft>(fresh);

  // Session storage only exists in the browser, so the draft is restored
  // after hydration.
  useEffect(() => {
    const saved = resume ? loadDraft<Draft>(DRAFT) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one restore on mount
    if (saved) setDraft(withPick(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, []);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [error, setError] = useState<string>(t("states.saveFailed"));
  const [modelMissing, setModelMissing] = useState(false);

  // Next keeps a left page's state for when it's shown again; a task starts
  // fresh each time (a side trip's values come back from the draft).
  useLayoutEffect(
    () => () => {
      setDraft(fresh());
      setState("idle");
      setModelMissing(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on hide only
    [],
  );

  const dirty = draft.model !== null || draft.nickname.trim() !== "" || draft.acquired !== "";
  const { leave, proceed, confirm } = useUnsavedChanges(dirty, () => {
    clearDraft(DRAFT);
    router.replace(returnTo ?? SETUP);
  });

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  // Where the picker comes back to: this task, resuming the draft.
  const here = () => {
    const params = new URLSearchParams({ kind: draft.kind, resume: "1" });
    if (walk) params.set("walk", "1");
    if (returnTo) params.set("returnTo", returnTo);
    return `${ADD_PART_PATH}?${params}`;
  };

  const chooseModel = () => {
    saveDraft(DRAFT, draft);
    const picker = `/catalog/pick?catalog=hardware&kind=${draft.kind}`;
    proceed(() => router.replace(withReturnTo(picker, here())));
  };

  const save = async () => {
    if (!draft.model) {
      setModelMissing(true);
      return;
    }
    setState("saving");
    const result = await addPartAction({
      hardwareId: draft.model.id,
      nickname: draft.nickname,
      acquired: draft.acquired,
    });
    if (!result.ok) {
      setError(t(`states.${result.error}`));
      setState("failed");
      return;
    }
    clearDraft(DRAFT);
    const have = new Set([...haveKinds, result.data.kind]);
    const next = UNIT_KINDS.find((k) => !have.has(k));
    const to = returnTo
      ? returnWithSelection(returnTo, result.data.id)
      : walk && next
        ? `${ADD_PART_PATH}?kind=${next}&walk=1`
        : SETUP;
    proceed(() => {
      router.replace(to);
      router.refresh();
    });
  };

  return (
    <>
      <UnitAddScreen
        labels={{
          title: t("unit.addTitle"),
          cancel: t("actions.cancel"),
          kindLabel: t("unit.kindLabel"),
          kinds: {
            machine: t("setup.kind.machine"),
            grinder: t("setup.kind.grinder"),
            basket: t("setup.kind.basket"),
          },
          model: t("unit.model"),
          chooseModel: t("unit.chooseModel"),
          changeModel: t("unit.changeModel"),
          modelMissing: t("unit.modelMissing"),
          nickname: t("unit.nickname"),
          nicknameHint: t("unit.nicknameHint"),
          acquired: t("unit.acquired"),
          acquiredHint: t("unit.acquiredHint"),
          aboutModel: t("unit.aboutModel"),
          save: t("unit.save"),
          saveFailedTitle: t("unit.saveFailedTitle"),
          saveFailed: error,
        }}
        kind={draft.kind}
        onKindChange={(kind) =>
          update({ kind, model: draft.model?.kind === kind ? draft.model : null })
        }
        model={draft.model ? { model: draft.model.model, maker: draft.model.maker } : null}
        onChooseModel={chooseModel}
        capabilities={
          draft.model ? (
            <CapabilitySummary kind={draft.model.kind} capabilities={draft.model.capabilities} />
          ) : undefined
        }
        nickname={draft.nickname}
        onNicknameChange={(nickname) => update({ nickname })}
        acquired={draft.acquired}
        onAcquiredChange={(acquired) => update({ acquired })}
        maxDate={today}
        state={state}
        modelMissing={modelMissing}
        onSave={save}
        onCancel={leave}
      />
      {confirm}
    </>
  );
}
