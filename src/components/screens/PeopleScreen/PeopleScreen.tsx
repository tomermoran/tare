import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { cx } from "@/lib/cx";

/*
 * SCR-PEOPLE (DES-05-01-02): every profile the household brews for, the
 * user's own first with the overline "you", then by most recently brewed
 * for, each with how many shots and when last. Each row opens its sheet;
 * the list ends with "Add someone". A name is all Tare asks. Props only.
 */

export type PeopleScreenLabels = { title: string; back: string; intro: string; you: string; add: string };

export type PeopleRow = {
  id: string;
  name: string;
  /** "12 shots, last 3 days ago" or "No shots yet". */
  secondary: string;
  main: boolean;
};

export function PeopleScreen({
  labels,
  backHref,
  rows,
  announcement = "",
  notice,
  onOpen,
  onAdd,
}: {
  labels: PeopleScreenLabels;
  backHref: string;
  rows: PeopleRow[];
  /** A polite status, e.g. after adding someone. */
  announcement?: string;
  notice?: ReactNode;
  onOpen: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        variant="task"
        title={labels.title}
        start={
          <Link href={backHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }))}>
            <Icon name="back" />
            {labels.back}
          </Link>
        }
      />
      <p className="text-body text-ink-secondary">{labels.intro}</p>
      {notice}
      <ul className="flex flex-col">
        {rows.map((r) => (
          <li key={r.id}>
            <ListRow
              primary={
                <span className="flex flex-col">
                  {r.main && <span className="text-overline uppercase text-ink-secondary">{labels.you}</span>}
                  <span className="break-words">{r.name}</span>
                </span>
              }
              secondary={r.secondary}
              end={<Icon name="chevron" className="mt-1 text-ink-secondary" />}
              onClick={() => onOpen(r.id)}
            />
          </li>
        ))}
        <li>
          <ListRow primary={labels.add} end={<Icon name="plus" className="text-ink" />} onClick={onAdd} />
        </li>
      </ul>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
