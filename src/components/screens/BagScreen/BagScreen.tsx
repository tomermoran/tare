import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { cx } from "@/lib/cx";
import type { PortionRow } from "../BeansScreen/BeansScreen";

/*
 * SCR-BAG, one bag (STORY-03-01-04 AC 2): its facts once at the top, then
 * its portions, then the recipes for this coffee. Props only. Portion rows
 * open the portion actions (EPIC-03-02) through the `onPortion` slot when
 * it's given.
 */

export type BagFact = { label: string; value: string };

export type BagLabels = {
  back: string;
  facts: string;
  portions: string;
  recipes: string;
  noRecipes: string;
};

export function BagScreen({
  labels,
  backHref,
  bean,
  roaster,
  facts,
  clocks,
  portions,
  onPortion,
  recipes,
}: {
  labels: BagLabels;
  backHref: string;
  bean: string;
  roaster: string;
  /** Dates, lot, purchase and weight, already formatted, in display order. */
  facts: BagFact[];
  /** The roasting and opening clocks with their explanation (EPIC-03-03). */
  clocks?: ReactNode;
  portions: PortionRow[];
  onPortion?: (id: string) => void;
  /** Recipe rows for this coffee (EPIC-02-01). */
  recipes?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link href={backHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }), "self-start")}>
          <Icon name="back" />
          {labels.back}
        </Link>
        <header className="flex flex-col gap-1">
          <h1 className="text-h1">{bean}</h1>
          <p className="text-body text-ink-secondary">{roaster}</p>
        </header>
      </div>

      <section aria-labelledby="bag-facts" className="flex flex-col gap-3">
        <h2 id="bag-facts" className="text-h3 text-ink">
          {labels.facts}
        </h2>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-label text-ink-secondary">{f.label}</dt>
              <dd className="text-body text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        {clocks}
      </section>

      <section aria-labelledby="bag-portions" className="flex flex-col gap-1">
        <h2 id="bag-portions" className="text-h3 text-ink">
          {labels.portions}
        </h2>
        <ul>
          {portions.map((p) => (
            <li key={p.id}>
              <ListRow
                primary={p.state}
                secondary={p.opened}
                end={<span className="text-body text-ink">{p.remaining}</span>}
                onClick={onPortion ? () => onPortion(p.id) : undefined}
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="bag-recipes" className="flex flex-col gap-2">
        <h2 id="bag-recipes" className="text-h3 text-ink">
          {labels.recipes}
        </h2>
        {recipes ?? <p className="text-body text-ink-secondary">{labels.noRecipes}</p>}
      </section>
    </div>
  );
}
