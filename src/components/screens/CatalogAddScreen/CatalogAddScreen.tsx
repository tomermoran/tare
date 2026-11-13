import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { SelectField } from "@/components/ui/SelectField/SelectField";

/*
 * SCR-CATALOG-ADD (STORY-01-06-01, 01-06-04): adding a missing entry,
 * product link first. Leaving the link checks it; a match is offered
 * before anything else is typed. Then the maker (or roaster), chosen or
 * new with its own link, the name, a preset kind, and slots for the
 * capability questions and "more links and names". Props only; the same
 * screen serves hardware and coffee. Errors are in ink, never signal.
 */

export type CatalogAddLabels = {
  title: string;
  cancel: string;
  url: string;
  urlHint: string;
  checking: string;
  checkFailed: string;
  useExisting: string;
  parent: string;
  chooseParent: string;
  parentName: string;
  parentUrl: string;
  parentUrlHint: string;
  name: string;
  nameHint?: string;
  kindLabel?: string;
  save: string;
  saveFailedTitle: string;
  saveFailed: string;
};

export type CatalogAddErrors = Partial<Record<"url" | "parent" | "parentName" | "parentUrl" | "name", string>>;

export function CatalogAddScreen({
  labels,
  url,
  onUrlChange,
  onUrlBlur,
  check = "idle",
  duplicate,
  onUseExisting,
  parent,
  onChooseParent,
  newParent = false,
  parentName = "",
  onParentNameChange,
  parentUrl = "",
  onParentUrlChange,
  name,
  onNameChange,
  kinds,
  kind,
  onKindChange,
  capabilities,
  more,
  errors = {},
  state = "idle",
  onSave,
  onCancel,
}: {
  labels: CatalogAddLabels;
  url: string;
  onUrlChange: (value: string) => void;
  /** Runs the duplicate check. */
  onUrlBlur: () => void;
  check?: "idle" | "checking" | "failed";
  /** The existing entry with this link, already described ("“Zero” by Niche…"). */
  duplicate?: string;
  onUseExisting?: () => void;
  /** The chosen maker or roaster's name, or null. */
  parent: string | null;
  onChooseParent: () => void;
  /** A maker or roaster that's new to the catalog: name and link fields. */
  newParent?: boolean;
  parentName?: string;
  onParentNameChange?: (value: string) => void;
  parentUrl?: string;
  onParentUrlChange?: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  /** Hardware: the kinds to choose from, preset from the flow. */
  kinds?: { value: string; label: string }[];
  kind?: string;
  onKindChange?: (value: string) => void;
  capabilities?: ReactNode;
  more?: ReactNode;
  errors?: CatalogAddErrors;
  state?: "idle" | "saving" | "failed";
  onSave: () => void;
  onCancel: () => void;
}) {
  const saving = state === "saving";
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

      <div className="flex flex-col gap-2">
        <Input
          type="url"
          inputMode="url"
          autoComplete="url"
          required
          label={labels.url}
          hint={labels.urlHint}
          error={errors.url}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onBlur={onUrlBlur}
        />
        <p role="status" className="text-label text-ink-secondary empty:hidden">
          {check === "checking" ? labels.checking : ""}
        </p>
        {check === "failed" && <Notice>{labels.checkFailed}</Notice>}
        {duplicate && (
          <Notice action={onUseExisting ? { label: labels.useExisting, onClick: onUseExisting } : undefined}>
            {duplicate}
          </Notice>
        )}
      </div>

      {kinds && kind && onKindChange && labels.kindLabel && (
        <ChipGroup label={labels.kindLabel} options={kinds} value={kind} onChange={onKindChange} />
      )}

      <div className="flex flex-col gap-2">
        <SelectField look="field" label={labels.parent} value={parent ?? labels.chooseParent} onClick={onChooseParent} />
        {errors.parent && (
          <p role="alert" className="text-label text-ink">
            {errors.parent}
          </p>
        )}
      </div>
      {newParent && (
        <div className="flex flex-col gap-4 border-s border-line ps-4">
          <Input
            label={labels.parentName}
            error={errors.parentName}
            value={parentName}
            maxLength={80}
            autoComplete="off"
            onChange={(e) => onParentNameChange?.(e.target.value)}
          />
          <Input
            type="url"
            inputMode="url"
            label={labels.parentUrl}
            hint={labels.parentUrlHint}
            error={errors.parentUrl}
            value={parentUrl}
            onChange={(e) => onParentUrlChange?.(e.target.value)}
          />
        </div>
      )}

      <Input
        label={labels.name}
        hint={labels.nameHint}
        error={errors.name}
        value={name}
        maxLength={80}
        autoComplete="off"
        onChange={(e) => onNameChange(e.target.value)}
      />

      {capabilities}
      {more}

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
