import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { cx } from "@/lib/cx";

/*
 * SCR-UNIT, one part (STORY-01-02-02 AC 5): its nickname or model, maker
 * and model, its details, what the model can control, and the setups it's
 * in. Props only. Maintenance (EPIC-04-01, with a grinder's grind period)
 * and the "answer later" capability questions (STORY-01-06-09) are slots their
 * tasks fill. There is no retire: a part the household stops using simply
 * isn't in its current setup any more (S-02).
 */

export type UnitFact = { label: string; value: string };

export type UnitScreenLabels = {
  back: string;
  details: string;
  capabilities: string;
  inSetups: string;
  notInSetup: string;
  current: string;
};

export function UnitScreen({
  labels,
  backHref,
  title,
  subtitle,
  facts,
  capabilities,
  answerLater,
  setups,
  maintenance,
}: {
  labels: UnitScreenLabels;
  backHref: string;
  /** Nickname, or the model when there's none. */
  title: string;
  /** Maker and model, so a nicknamed part still says what it is. */
  subtitle: string;
  /** Nickname and acquired date when set, already formatted. */
  facts: UnitFact[];
  /** What the model can control (CapabilitySummary). */
  capabilities?: ReactNode;
  /** "Answer later" questions for a household-added model's unknowns. */
  answerLater?: ReactNode;
  /** The household's setups with this part, by name or parts name. */
  setups: { id: string; name: string; current?: boolean }[];
  /** Maintenance for this part (EPIC-04-01). */
  maintenance?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link href={backHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }), "self-start")}>
          <Icon name="back" />
          {labels.back}
        </Link>
        <header className="flex flex-col gap-1">
          <h1 className="text-h1">{title}</h1>
          <p className="text-body text-ink-secondary">{subtitle}</p>
        </header>
      </div>

      {facts.length > 0 && (
        <section aria-labelledby="unit-details" className="flex flex-col gap-3">
          <h2 id="unit-details" className="text-h3 text-ink">
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
      )}

      {(capabilities || answerLater) && (
        <section aria-labelledby="unit-capabilities" className="flex flex-col gap-3">
          <h2 id="unit-capabilities" className="text-h3 text-ink">
            {labels.capabilities}
          </h2>
          {capabilities}
          {answerLater}
        </section>
      )}

      <section aria-labelledby="unit-setups" className="flex flex-col gap-1">
        <h2 id="unit-setups" className="text-h3 text-ink">
          {labels.inSetups}
        </h2>
        {setups.length ? (
          <ul>
            {setups.map((s) => (
              <li key={s.id}>
                <ListRow
                  primary={s.name}
                  end={s.current ? <span className="text-overline uppercase text-ink-secondary">{labels.current}</span> : undefined}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="pt-2 text-body text-ink-secondary">{labels.notInSetup}</p>
        )}
      </section>

      {maintenance}
    </div>
  );
}
