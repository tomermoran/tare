import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";

/*
 * SCR-BAG-ADD: a bag's details, quickly. Props only; the route wires the
 * coffee picker and saving. A common size is one tap; "Other" reveals a
 * grams field. The roast date comes first; the packing and best-before
 * dates sit behind a disclosure, with a hint saying which one the freshness
 * clock uses (AC 3). No date blocks saving; only the weight is required
 * (AC 5), and its error is in ink.
 */

export const OTHER_WEIGHT = "other";

export type BagAddLabels = {
  title: string;
  cancel: string;
  coffee: string;
  chooseCoffee: string;
  change: string;
  coffeeMissing: string;
  weight: string;
  /** The preset sizes, already formatted ("250 g"), and their values in grams. */
  sizes: { value: string; label: string }[];
  otherWeight: string;
  otherWeightLabel: string;
  gramUnit: string;
  weightRequired: string;
  roastDate: string;
  roastDateHint: string;
  otherDates: string;
  packedDate: string;
  bestBefore: string;
  datesHint: string;
  more: string;
  lot: string;
  purchased: string;
  save: string;
  saveFailedTitle: string;
  saveFailed: string;
};

export type BagFields = {
  /** A preset value in grams, OTHER_WEIGHT, or "" for none. */
  size: string;
  /** The "other" field's text. */
  otherWeight: string;
  roastDate: string;
  packedAt: string;
  bestBefore: string;
  lotCode: string;
  purchasedAt: string;
};

export function BagAddScreen({
  labels,
  coffee,
  onChooseCoffee,
  fields,
  onChange,
  otherDatesOpen,
  onOpenOtherDates,
  moreOpen,
  onOpenMore,
  today,
  coffeeMissing = false,
  weightMissing = false,
  state = "idle",
  onSave,
  onCancel,
}: {
  labels: BagAddLabels;
  /** The chosen coffee; null before picking. */
  coffee: { name: string; roaster: string } | null;
  onChooseCoffee: () => void;
  fields: BagFields;
  onChange: (patch: Partial<BagFields>) => void;
  otherDatesOpen: boolean;
  onOpenOtherDates: () => void;
  moreOpen: boolean;
  onOpenMore: () => void;
  /** Today (YYYY-MM-DD): the latest a roast, packing or purchase date can be. */
  today: string;
  coffeeMissing?: boolean;
  weightMissing?: boolean;
  state?: "idle" | "saving" | "failed";
  onSave: () => void;
  onCancel: () => void;
}) {
  const saving = state === "saving";
  const other = fields.size === OTHER_WEIGHT;

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
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

      <section aria-labelledby="bag-coffee" className="flex flex-col gap-2">
        <h2 id="bag-coffee" className="text-label text-ink-secondary">
          {labels.coffee}
        </h2>
        {coffee ? (
          <div className="flex items-start justify-between gap-4 border-b border-line pb-3">
            <div className="flex min-w-0 flex-col">
              <p className="text-body text-ink">{coffee.name}</p>
              <p className="text-label text-ink-secondary">{coffee.roaster}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onChooseCoffee}>
              {labels.change}
            </Button>
          </div>
        ) : (
          <Button onClick={onChooseCoffee} className="self-start">
            {labels.chooseCoffee}
          </Button>
        )}
        {coffeeMissing && !coffee && (
          <p role="alert" className="text-label text-ink">
            {labels.coffeeMissing}
          </p>
        )}
      </section>

      <div className="flex flex-col gap-3">
        {/* Visible label; the group carries the same accessible name. */}
        <p className="text-label text-ink-secondary" aria-hidden="true">
          {labels.weight}
        </p>
        <ChipGroup
          label={labels.weight}
          options={[...labels.sizes, { value: OTHER_WEIGHT, label: labels.otherWeight }]}
          value={fields.size || null}
          onChange={(size) => onChange({ size })}
        />
        {other && (
          <Input
            label={labels.otherWeightLabel}
            unit={labels.gramUnit}
            inputMode="decimal"
            autoComplete="off"
            value={fields.otherWeight}
            onChange={(e) => onChange({ otherWeight: e.target.value })}
            error={weightMissing ? labels.weightRequired : undefined}
          />
        )}
        {weightMissing && !other && (
          <p role="alert" className="text-label text-ink">
            {labels.weightRequired}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Input
          type="date"
          label={labels.roastDate}
          hint={labels.roastDateHint}
          value={fields.roastDate}
          max={today}
          onChange={(e) => onChange({ roastDate: e.target.value })}
        />
        {otherDatesOpen ? (
          <>
            <Input
              type="date"
              label={labels.packedDate}
              value={fields.packedAt}
              max={today}
              onChange={(e) => onChange({ packedAt: e.target.value })}
            />
            <Input
              type="date"
              label={labels.bestBefore}
              value={fields.bestBefore}
              onChange={(e) => onChange({ bestBefore: e.target.value })}
            />
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={onOpenOtherDates} className="self-start">
            <Icon name="plus" />
            {labels.otherDates}
          </Button>
        )}
        <p className="text-label text-ink-secondary">{labels.datesHint}</p>
      </div>

      {moreOpen ? (
        <div className="flex flex-col gap-4">
          <Input
            label={labels.lot}
            autoComplete="off"
            maxLength={60}
            value={fields.lotCode}
            onChange={(e) => onChange({ lotCode: e.target.value })}
          />
          <Input
            type="date"
            label={labels.purchased}
            value={fields.purchasedAt}
            max={today}
            onChange={(e) => onChange({ purchasedAt: e.target.value })}
          />
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={onOpenMore} className="self-start">
          <Icon name="plus" />
          {labels.more}
        </Button>
      )}

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
