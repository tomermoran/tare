import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { cx } from "@/lib/cx";
import { PortionRows, type PortionRow } from "../BeansScreen/PortionRows";

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
  onWeigh,
  status,
  total,
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
  /** An over-logged portion's Notice opens SH-STOCK. */
  onWeigh?: (id: string) => void;
  /** "Open" or "Finished" as text (STORY-03-04-03). */
  status?: string;
  /** The total left in the bag, formatted. */
  total?: string;
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
          {status && <p className="text-label text-ink-secondary">{status}</p>}
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
        {total && <p className="text-label text-ink-secondary">{total}</p>}
        <PortionRows portions={portions} onPortion={onPortion} onWeigh={onWeigh} />
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
