import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import type { HardwareKind } from "@/domain/capabilities";

/*
 * SCR-UNIT-ADD: add a part. Props only; the route wires the picker, the
 * draft and saving. Three kinds only (AC 1). The model's capabilities show
 * before saving (AC 3); nickname and date are optional (AC 2). A missing
 * model is explained on save, never by disabling the button.
 */

export const UNIT_KINDS = ["machine", "grinder", "basket"] as const satisfies readonly HardwareKind[];

export type UnitAddLabels = {
  title: string;
  cancel: string;
  kindLabel: string;
  kinds: Record<HardwareKind, string>;
  model: string;
  chooseModel: string;
  changeModel: string;
  modelMissing: string;
  nickname: string;
  nicknameHint: string;
  acquired: string;
  acquiredHint: string;
  aboutModel: string;
  save: string;
  saveFailedTitle: string;
  saveFailed: string;
};

export type ChosenModel = { model: string; maker: string };

export function UnitAddScreen({
  labels,
  kind,
  onKindChange,
  model,
  onChooseModel,
  capabilities,
  nickname,
  onNicknameChange,
  acquired,
  onAcquiredChange,
  maxDate,
  state = "idle",
  modelMissing = false,
  onSave,
  onCancel,
}: {
  labels: UnitAddLabels;
  kind: HardwareKind;
  onKindChange: (kind: HardwareKind) => void;
  /** The picked model, shown by maker and model; null before picking. */
  model: ChosenModel | null;
  onChooseModel: () => void;
  /** The read-only CapabilitySummary for the picked model. */
  capabilities?: ReactNode;
  nickname: string;
  onNicknameChange: (value: string) => void;
  /** YYYY-MM-DD, or "" for none. */
  acquired: string;
  onAcquiredChange: (value: string) => void;
  /** Today, so a future date can't be picked. */
  maxDate?: string;
  state?: "idle" | "saving" | "failed";
  /** Set after saving without a model. */
  modelMissing?: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const saving = state === "saving";

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!saving) onSave();
      }}
    >
      <PageHeader
        variant="task"
        title={labels.title}
        start={
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {labels.cancel}
          </Button>
        }
      />

      <ChipGroup
        label={labels.kindLabel}
        options={UNIT_KINDS.map((k) => ({ value: k, label: labels.kinds[k] }))}
        value={kind}
        onChange={(v) => onKindChange(v as HardwareKind)}
      />

      <section aria-labelledby="unit-model" className="flex flex-col gap-2">
        <h2 id="unit-model" className="text-label text-ink-secondary">
          {labels.model}
        </h2>
        {model ? (
          <div className="flex items-start justify-between gap-4 border-b border-line pb-3">
            <div className="flex min-w-0 flex-col">
              <p className="text-body text-ink">{model.model}</p>
              <p className="text-label text-ink-secondary">{model.maker}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onChooseModel}>
              {labels.changeModel}
            </Button>
          </div>
        ) : (
          <Button onClick={onChooseModel} className="self-start" aria-describedby={modelMissing ? "unit-model-missing" : undefined}>
            {labels.chooseModel}
          </Button>
        )}
        {modelMissing && !model && (
          <p id="unit-model-missing" role="alert" className="text-label text-ink">
            {labels.modelMissing}
          </p>
        )}
        {model && capabilities && (
          <div className="flex flex-col gap-1 pt-2">
            <h3 className="text-label text-ink-secondary">{labels.aboutModel}</h3>
            {capabilities}
          </div>
        )}
      </section>

      <Input
        label={labels.nickname}
        hint={labels.nicknameHint}
        value={nickname}
        maxLength={60}
        autoComplete="off"
        onChange={(e) => onNicknameChange(e.target.value)}
      />
      <Input
        type="date"
        label={labels.acquired}
        hint={labels.acquiredHint}
        value={acquired}
        max={maxDate}
        onChange={(e) => onAcquiredChange(e.target.value)}
      />

      {state === "failed" && (
        <Notice urgent title={labels.saveFailedTitle}>
          {labels.saveFailed}
        </Notice>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={saving} aria-busy={saving || undefined}>
        {labels.save}
      </Button>
    </form>
  );
}
