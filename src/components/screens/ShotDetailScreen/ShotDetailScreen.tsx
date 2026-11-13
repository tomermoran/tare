import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { cx } from "@/lib/cx";

/*
 * SCR-SHOT, one shot (STORY-02-06-03): large values, then what it was made
 * with (setup parts by maker and model, coffee, milk, prep, sweetened), then
 * taste when there is some. Props only, and read-only in Milestone 1: the
 * `actions` slot stays empty until edit, pin and dial in each arrive, so
 * there is never a dead button.
 */

export type ShotFact = { label: string; value: string };

export type ShotDetailLabels = {
  back: string;
  details: string;
  taste: string;
};

export function ShotDetailScreen({
  labels,
  backHref,
  drink,
  when,
  values,
  note,
  facts,
  taste,
  actions,
}: {
  labels: ShotDetailLabels;
  backHref: string;
  drink: string;
  /** Date and time, already formatted. */
  when: string;
  values: ShotValuesData;
  /** A line under the values, e.g. "copied from your recipe" for one-tap shots. */
  note?: string;
  /** Context in display order, already formatted. */
  facts: ShotFact[];
  /** Rating and just-right phrases; omitted when the shot has no taste. */
  taste?: { rating?: ShotFact; phrases: string[] };
  /** Pin, dial in and edit, added by the tasks that build them. */
  actions?: ReactNode;
}) {
  const hasTaste = taste && (taste.rating || taste.phrases.length > 0);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link href={backHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }), "self-start")}>
          <Icon name="back" />
          {labels.back}
        </Link>
        <header className="flex flex-col gap-1">
          <h1 className="text-h1">{drink}</h1>
          <p className="text-body text-ink-secondary">{when}</p>
        </header>
      </div>

      <div className="flex flex-col gap-3">
        <ShotValues values={values} />
        {note && <p className="text-label text-ink-secondary">{note}</p>}
      </div>

      {actions && <div className="flex flex-col gap-2">{actions}</div>}

      <section aria-labelledby="shot-details" className="flex flex-col gap-3">
        <h2 id="shot-details" className="text-h3 text-ink">
          {labels.details}
        </h2>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-label text-ink-secondary">{f.label}</dt>
              <dd className="text-body text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {hasTaste && (
        <section aria-labelledby="shot-taste" className="flex flex-col gap-3">
          <h2 id="shot-taste" className="text-h3 text-ink">
            {labels.taste}
          </h2>
          {taste.rating && (
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6">
              <dt className="text-label text-ink-secondary">{taste.rating.label}</dt>
              <dd className="text-body text-ink">{taste.rating.value}</dd>
            </dl>
          )}
          {taste.phrases.length > 0 && (
            <ul className="flex flex-col gap-1">
              {taste.phrases.map((p) => (
                <li key={p} className="text-body text-ink">
                  {p}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
