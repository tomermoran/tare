"use client";

import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { NumberWheel } from "@/components/ui/NumberWheel/NumberWheel";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { Toggle } from "@/components/ui/Toggle/Toggle";

/*
 * The portion sheets (EPIC-03-02), props only:
 * - SH-PORTION-ACTIONS lists only the actions the portion's state allows;
 * - SH-DATE confirms a dated action, today by default, with an error in
 *   ink (never signal) for a date that can't be;
 * - SH-SPLIT takes grams out with a wheel that can't pass what's left, the
 *   remainder live as text, and "freeze the new portion" on by default;
 * - SH-STOCK corrects what's left: read off a scale, or by taking grams
 *   off for spills and shots that weren't logged, the result live as text.
 * A failed action keeps its sheet open with a Notice and retry.
 */

type Failure = { message: string; retryLabel: string; onRetry: () => void };

export function PortionActionsSheet({
  open,
  onClose,
  title,
  closeLabel,
  actions,
  onChoose,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  actions: { action: string; label: string }[];
  onChoose: (action: string) => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title} closeLabel={closeLabel}>
      <ul>
        {actions.map((a) => (
          <li key={a.action}>
            <ListRow primary={a.label} onClick={() => onChoose(a.action)} className="last:border-b-0" />
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

export function DateSheet({
  open,
  onClose,
  title,
  closeLabel,
  label,
  hint,
  value,
  max,
  onChange,
  error,
  confirmLabel,
  onConfirm,
  saving = false,
  failure,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  label: string;
  hint: string;
  /** A local day, YYYY-MM-DD. */
  value: string;
  /** Today, as YYYY-MM-DD: no later day can be chosen. */
  max: string;
  onChange: (day: string) => void;
  error?: string;
  confirmLabel: string;
  onConfirm: () => void;
  saving?: boolean;
  failure?: Failure;
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={title}
      closeLabel={closeLabel}
      footer={
        <Button variant="primary" fullWidth disabled={saving || !value} aria-busy={saving || undefined} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Input type="date" label={label} hint={hint} value={value} max={max} error={error} onChange={(e) => onChange(e.target.value)} />
        {failure && (
          <Notice urgent action={{ label: failure.retryLabel, onClick: failure.onRetry }}>
            {failure.message}
          </Notice>
        )}
      </div>
    </Sheet>
  );
}

export function SplitSheet({
  open,
  onClose,
  labels,
  remaining,
  take,
  onTakeChange,
  freezeNew,
  onFreezeNewChange,
  onConfirm,
  saving = false,
  failure,
}: {
  open: boolean;
  onClose: () => void;
  labels: {
    title: string;
    close: string;
    takeOut: string;
    /** "128 g stays in this portion", from the grams left after taking. */
    remainder: (grams: number) => string;
    freezeNew: string;
    confirm: string;
  };
  /** Grams left in the portion: the most that can be taken. */
  remaining: number;
  take: number;
  onTakeChange: (grams: number) => void;
  freezeNew: boolean;
  onFreezeNewChange: (freeze: boolean) => void;
  onConfirm: () => void;
  saving?: boolean;
  failure?: Failure;
}) {
  const max = Math.max(1, Math.floor(remaining));
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <Button variant="primary" fullWidth disabled={saving || take <= 0} aria-busy={saving || undefined} onClick={onConfirm}>
          {labels.confirm}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <NumberWheel label={labels.takeOut} value={take} onChange={onTakeChange} min={1} max={max} step={1} majorEvery={10} unit="gram" />
        <p aria-live="polite" className="text-center text-label text-ink-secondary">
          {labels.remainder(Math.max(0, Math.round((remaining - take) * 10) / 10))}
        </p>
        <Toggle label={labels.freezeNew} checked={freezeNew} onChange={onFreezeNewChange} className="border-t border-line py-3" />
        {failure && (
          <Notice urgent action={{ label: failure.retryLabel, onClick: failure.onRetry }}>
            {failure.message}
          </Notice>
        )}
      </div>
    </Sheet>
  );
}

export type StockMode = "weigh" | "takeOff";

export function StockSheet({
  open,
  onClose,
  labels,
  mode = "weigh",
  onModeChange,
  grams,
  max,
  onGramsChange,
  remaining,
  takeOff = 1,
  onTakeOffChange,
  onSave,
  saving = false,
  failure,
}: {
  open: boolean;
  onClose: () => void;
  labels: {
    title: string;
    close: string;
    weight: string;
    hint: string;
    save: string;
    /** Taking some off; without these the sheet only weighs. */
    takeOff?: { mode: string; weigh: string; takeOff: string; amount: string; hint: string; remainder: (grams: number) => string; save: string };
  };
  mode?: StockMode;
  onModeChange?: (mode: StockMode) => void;
  /** What the scale read. */
  grams: number;
  /** The wheel's top: the portion's weight, or more if what's left says so. */
  max: number;
  onGramsChange: (grams: number) => void;
  /** Grams left now, which taking off can't pass. */
  remaining?: number;
  /** Grams to take off. */
  takeOff?: number;
  onTakeOffChange?: (grams: number) => void;
  onSave: () => void;
  saving?: boolean;
  failure?: Failure;
}) {
  const left = remaining ?? 0;
  // Nothing to take off an empty portion: only weighing is offered.
  const off = labels.takeOff && left > 0 ? labels.takeOff : undefined;
  const taking = !!off && mode === "takeOff";
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <Button variant="primary" fullWidth disabled={saving} aria-busy={saving || undefined} onClick={onSave}>
          {taking ? off.save : labels.save}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {off && (
          <ChipGroup
            label={off.mode}
            options={[
              { value: "weigh", label: off.weigh },
              { value: "takeOff", label: off.takeOff },
            ]}
            value={mode}
            onChange={(v) => onModeChange?.(v as StockMode)}
          />
        )}
        {taking ? (
          <>
            <NumberWheel
              key="takeOff"
              label={off.amount}
              value={takeOff}
              onChange={(g) => onTakeOffChange?.(g)}
              min={1}
              max={Math.max(1, Math.ceil(left))}
              step={1}
              majorEvery={10}
              unit="gram"
            />
            <p className="text-center text-label text-ink-secondary">{off.hint}</p>
            <p className="text-center text-body text-ink" aria-live="polite">
              {off.remainder(Math.max(0, Math.round((left - takeOff) * 10) / 10))}
            </p>
          </>
        ) : (
          <>
            <NumberWheel key="weigh" label={labels.weight} value={grams} onChange={onGramsChange} min={0} max={Math.max(1, Math.ceil(max))} step={1} majorEvery={10} unit="gram" />
            <p className="text-center text-label text-ink-secondary">{labels.hint}</p>
          </>
        )}
        {failure && (
          <Notice urgent action={{ label: failure.retryLabel, onClick: failure.onRetry }}>
            {failure.message}
          </Notice>
        )}
      </div>
    </Sheet>
  );
}
