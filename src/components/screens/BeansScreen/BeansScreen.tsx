import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton/Skeleton";

/*
 * SCR-PANTRY, the Beans tab (STORY-03-01-04): On hand first, then Tried.
 * Props only. Each bag on hand is a Card with its coffee, roaster and the
 * roasting clock, and its portions as rows. "Add a bag" is the header's
 * primary only when bags are on hand; otherwise an empty state carries it,
 * so every state has exactly one primary (AC 4, AC 5).
 */

export type PortionRow = {
  id: string;
  /** "Unopened", "Open", "Frozen"… */
  state: string;
  /** How long it has been open, when it is. */
  opened?: string;
  /** The amount left, formatted. */
  remaining: string;
};

export type BagCard = {
  id: string;
  href: string;
  bean: string;
  roaster: string;
  /** The since-roasting clock (EPIC-03-03), when there's a date for it. */
  clock?: string;
  portions: PortionRow[];
};

export type BeansLabels = {
  title: string;
  addBag: string;
  onHand: string;
  tried: string;
  emptyTitle: string;
  empty: string;
  onHandEmptyTitle: string;
  onHandEmpty: string;
  triedEmpty: string;
  loading: string;
};

export function BeansScreen({
  labels,
  state = "ready",
  bags,
  tried,
  addBagHref,
  onPortion,
}: {
  labels: BeansLabels;
  state?: "loading" | "ready";
  /** A portion row opens its actions (EPIC-03-02). */
  onPortion?: (id: string) => void;
  bags: BagCard[];
  /** The Tried rows (EPIC-03-06); none means nothing has been brewed yet. */
  tried?: ReactNode;
  addBagHref: string;
}) {
  if (state === "loading") {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={labels.title} />
        <Skeleton label={labels.loading}>
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg bg-surface p-6">
              <SkeletonBlock shape="title" className="w-3/5" />
              <SkeletonBlock shape="line" className="w-2/5" />
              <SkeletonBlock shape="line" className="w-4/5" />
            </div>
          ))}
        </Skeleton>
      </div>
    );
  }

  if (bags.length === 0 && !tried) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={labels.title} />
        <EmptyState title={labels.emptyTitle} action={{ label: labels.addBag, href: addBagHref }}>
          {labels.empty}
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={labels.title}
        end={
          bags.length > 0 ? (
            <Link href={addBagHref} className={buttonClass({ variant: "primary", size: "sm" })}>
              {labels.addBag}
            </Link>
          ) : undefined
        }
      />

      <section aria-labelledby="beans-on-hand" className="flex flex-col gap-4">
        <h2 id="beans-on-hand" className="text-h2 text-ink">
          {labels.onHand}
        </h2>
        {bags.length === 0 ? (
          <EmptyState
            title={labels.onHandEmptyTitle}
            action={{ label: labels.addBag, href: addBagHref }}
            className="py-8"
          >
            {labels.onHandEmpty}
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {bags.map((bag) => (
              <li key={bag.id}>
                <Card className="flex flex-col gap-2">
                  <Link href={bag.href} className="group flex items-start justify-between gap-4">
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-h3 text-ink group-hover:underline">{bag.bean}</span>
                      <span className="text-label text-ink-secondary">
                        {bag.roaster}
                        {bag.clock && <span className="block">{bag.clock}</span>}
                      </span>
                    </span>
                    <Icon name="chevron" className="mt-2 text-ink-secondary" />
                  </Link>
                  <ul>
                    {bag.portions.map((p) => (
                      <li key={p.id}>
                        <ListRow
                          className="last:border-b-0"
                          primary={p.state}
                          secondary={p.opened}
                          end={<span className="text-body text-ink">{p.remaining}</span>}
                          onClick={onPortion ? () => onPortion(p.id) : undefined}
                        />
                      </li>
                    ))}
                  </ul>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="beans-tried" className="flex flex-col gap-4">
        <h2 id="beans-tried" className="text-h2 text-ink">
          {labels.tried}
        </h2>
        {tried ?? <p className="text-body text-ink-secondary">{labels.triedEmpty}</p>}
      </section>
    </div>
  );
}
