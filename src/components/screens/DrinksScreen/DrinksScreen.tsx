import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { ReorderList, type ReorderLabels } from "@/components/ui/ReorderList/ReorderList";
import { cx } from "@/lib/cx";

export type DrinksScreenLabels = {
  title: string;
  back: string;
  intro: string;
  add: string;
  reorder: string;
  done: string;
  hidden: string;
};

export type DrinkRow = {
  id: string;
  name: string;
  /** "With milk, 120 ml usual" or "No milk". */
  secondary: string;
  hidden: boolean;
};

/**
 * SCR-DRINKS (DES-02-05-01): the household's drinks in its order, hidden
 * ones too, quieter and marked. Each row opens the drink; the list ends
 * with "Add a drink". Reorder mode swaps the taps for move buttons, and the
 * header's Reorder becomes Done. No primary button: every row is an
 * action. Props only.
 */
export function DrinksScreen({
  labels,
  reorderLabels,
  backHref,
  rows,
  reordering = false,
  announcement = "",
  notice,
  onToggleReorder,
  onMove,
  onOpen,
  onAdd,
}: {
  labels: DrinksScreenLabels;
  reorderLabels: ReorderLabels;
  backHref: string;
  rows: DrinkRow[];
  reordering?: boolean;
  announcement?: string;
  /** E.g. a failed move or save. */
  notice?: ReactNode;
  onToggleReorder: () => void;
  onMove: (id: string, toIndex: number) => void;
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
        end={
          <Button variant="ghost" size="sm" onClick={onToggleReorder} aria-pressed={reordering}>
            {reordering ? labels.done : labels.reorder}
          </Button>
        }
      />
      <p className="text-body text-ink-secondary">{labels.intro}</p>
      {notice}
      <div className="flex flex-col">
        <ReorderList
          reordering={reordering}
          labels={reorderLabels}
          announcement={announcement}
          onMove={onMove}
          items={rows.map((r) => ({
            id: r.id,
            name: r.name,
            quiet: r.hidden,
            primary: (
              <span className="flex flex-col">
                {r.hidden && <span className="text-overline uppercase text-ink-secondary">{labels.hidden}</span>}
                <span className="break-words">{r.name}</span>
              </span>
            ),
            secondary: r.secondary,
            onClick: () => onOpen(r.id),
          }))}
        />
        {!reordering && <ListRow primary={labels.add} end={<Icon name="plus" className="text-ink" />} onClick={onAdd} />}
      </div>
    </div>
  );
}
