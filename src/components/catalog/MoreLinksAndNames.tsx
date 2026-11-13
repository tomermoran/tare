"use client";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { SelectField } from "@/components/ui/SelectField/SelectField";

/*
 * SCR-CATALOG-ADD's "more links and other names" (STORY-01-06-05,
 * DES-01-06-04), behind a disclosure: repeatable rows of a product page
 * link plus its market, and another name plus its market. Each link is
 * checked like the first; a match is offered to use instead. Props only;
 * market names come from the caller (Intl.DisplayNames).
 */

export type ExtraKind = "links" | "names";
export type ExtraRow = { value: string; market: string | null };

export type MoreLinksAndNamesLabels = {
  more: string;
  moreHint: string;
  /** "Link 2", "Other name 1": each row's field label, by its number. */
  link: (number: number) => string;
  name: (number: number) => string;
  market: string;
  /** "Market for Link 2". */
  marketFor: (item: string) => string;
  /** The market's name, or "Everywhere" for none. */
  marketName: (market: string | null) => string;
  addLink: string;
  addName: string;
  /** "Remove Link 2". */
  remove: (item: string) => string;
  useExisting: string;
};

export function MoreLinksAndNames({
  labels,
  open,
  onOpen,
  links,
  names,
  onChange,
  onLinkBlur,
  onChooseMarket,
  onAdd,
  onRemove,
  linkDuplicates = [],
  onUseExisting,
}: {
  labels: MoreLinksAndNamesLabels;
  open: boolean;
  onOpen: () => void;
  links: ExtraRow[];
  names: ExtraRow[];
  onChange: (kind: ExtraKind, index: number, value: string) => void;
  onLinkBlur?: (index: number) => void;
  onChooseMarket: (kind: ExtraKind, index: number) => void;
  onAdd: (kind: ExtraKind) => void;
  onRemove: (kind: ExtraKind, index: number) => void;
  /** Per link: the existing entry with that link, already described. */
  linkDuplicates?: (string | undefined)[];
  onUseExisting?: (index: number) => void;
}) {
  if (!open) {
    return (
      <Button variant="ghost" size="sm" onClick={onOpen} className="self-start">
        <Icon name="plus" />
        {labels.more}
      </Button>
    );
  }

  const rows = (kind: ExtraKind, items: ExtraRow[]) =>
    items.map((row, i) => {
      const item = kind === "links" ? labels.link(i + 1) : labels.name(i + 1);
      const duplicate = kind === "links" ? linkDuplicates[i] : undefined;
      return (
        <li key={i} className="flex flex-col gap-2 border-s border-line ps-4">
          <div className="flex items-end gap-2">
            <Input
              className="min-w-0 flex-1"
              label={item}
              value={row.value}
              autoComplete="off"
              maxLength={kind === "links" ? 2000 : 80}
              {...(kind === "links" ? { type: "url", inputMode: "url" as const } : {})}
              onChange={(e) => onChange(kind, i, e.target.value)}
              onBlur={kind === "links" ? () => onLinkBlur?.(i) : undefined}
            />
            <Button variant="ghost" size="sm" onClick={() => onRemove(kind, i)} aria-label={labels.remove(item)} className="mb-1">
              <Icon name="close" />
            </Button>
          </div>
          <SelectField
            look="quiet"
            hiddenLabel={labels.marketFor(item)}
            value={labels.marketName(row.market)}
            valueClassName="text-label text-ink-secondary"
            onClick={() => onChooseMarket(kind, i)}
          />
          {duplicate && (
            <Notice action={onUseExisting ? { label: labels.useExisting, onClick: () => onUseExisting(i) } : undefined}>
              {duplicate}
            </Notice>
          )}
        </li>
      );
    });

  return (
    <section aria-label={labels.more} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-body text-ink">{labels.more}</h2>
        <p className="text-label text-ink-secondary">{labels.moreHint}</p>
      </div>
      {links.length > 0 && <ul className="flex flex-col gap-4">{rows("links", links)}</ul>}
      <Button variant="ghost" size="sm" onClick={() => onAdd("links")} className="self-start">
        <Icon name="plus" />
        {labels.addLink}
      </Button>
      {names.length > 0 && <ul className="flex flex-col gap-4">{rows("names", names)}</ul>}
      <Button variant="ghost" size="sm" onClick={() => onAdd("names")} className="self-start">
        <Icon name="plus" />
        {labels.addName}
      </Button>
    </section>
  );
}
