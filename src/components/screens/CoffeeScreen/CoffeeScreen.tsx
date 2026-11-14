import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton/Skeleton";
import { cx } from "@/lib/cx";

/*
 * SCR-COFFEE, one coffee (STORY-03-06-03): its catalog details and how its
 * shots went, then recipes, recent shots and bags. Each section says so in
 * one line when it's empty, so the screen never looks broken (AC 5). "Add a
 * bag of this" is the primary only when none is on hand (STORY-03-06-04).
 * Props only.
 */

export type CoffeeLabels = {
  back: string;
  addBag: string;
  recipes: string;
  noRecipes: string;
  recentShots: string;
  noShots: string;
  allShots: string;
  bags: string;
  loading: string;
  loadFailedTitle: string;
  loadFailed: string;
  retry: string;
};

export type CoffeeShotRow = { id: string; href: string; primary: string; secondary: string; values: ShotValuesData };
export type CoffeeBagRow = { id: string; href: string; primary: string; secondary?: string; end: string };

export function CoffeeScreen({
  labels,
  backHref,
  state = "ready",
  onRetry,
  name,
  roaster,
  details,
  summary,
  addBag,
  recipes,
  shots = [],
  allShotsHref,
  bags = [],
}: {
  labels: CoffeeLabels;
  backHref: string;
  state?: "ready" | "loading" | "failed";
  onRetry?: () => void;
  name?: string;
  roaster?: string;
  /** Roast level and tasting notes when the catalog has them, formatted. */
  details?: string;
  /** How its shots went, in words only (DQ-28). */
  summary?: string;
  addBag?: { href: string; primary: boolean };
  /** Recipe rows (EPIC-02-01); none says so. */
  recipes?: ReactNode;
  shots?: CoffeeShotRow[];
  /** The Journal filtered to this coffee only. */
  allShotsHref?: string;
  bags?: CoffeeBagRow[];
}) {
  const back = (
    <Link href={backHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }), "self-start")}>
      <Icon name="back" />
      {labels.back}
    </Link>
  );
  if (state === "loading")
    return (
      <div className="flex flex-col gap-8">
        {back}
        <Skeleton label={labels.loading}>
          <div className="flex flex-col gap-3">
            <SkeletonBlock shape="line" className="h-8 w-3/5" />
            <SkeletonBlock shape="line" className="w-2/5" />
            <SkeletonBlock shape="line" className="mt-6 w-full" />
            <SkeletonBlock shape="line" className="w-full" />
          </div>
        </Skeleton>
      </div>
    );
  if (state === "failed")
    return (
      <div className="flex flex-col gap-8">
        {back}
        <Notice urgent title={labels.loadFailedTitle} action={onRetry ? { label: labels.retry, onClick: onRetry } : undefined}>
          {labels.loadFailed}
        </Notice>
      </div>
    );

  const section = (id: string, title: string, body: ReactNode) => (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="text-h3 text-ink">
        {title}
      </h2>
      {body}
    </section>
  );
  const none = (text: string) => <p className="text-body text-ink-secondary">{text}</p>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {back}
        <header className="flex flex-col gap-1">
          <h1 className="text-h1">{name}</h1>
          <p className="text-body text-ink-secondary">{roaster}</p>
          {details && <p className="text-label text-ink-secondary">{details}</p>}
          {summary && <p className="text-label text-ink-secondary">{summary}</p>}
        </header>
        {addBag && (
          <Link href={addBag.href} className={buttonClass({ variant: addBag.primary ? "primary" : "secondary", fullWidth: true })}>
            {labels.addBag}
          </Link>
        )}
      </div>

      {section("coffee-recipes", labels.recipes, recipes ?? none(labels.noRecipes))}

      {section(
        "coffee-shots",
        labels.recentShots,
        shots.length ? (
          <>
            <ul>
              {shots.map((s) => (
                <li key={s.id}>
                  <ListRow href={s.href} primary={s.primary} secondary={s.secondary} end={<ShotValues values={s.values} size="compact" />} />
                </li>
              ))}
            </ul>
            {allShotsHref && (
              <Link href={allShotsHref} className={cx(buttonClass({ variant: "ghost", size: "sm" }), "-ms-4 self-start")}>
                {labels.allShots}
              </Link>
            )}
          </>
        ) : (
          none(labels.noShots)
        ),
      )}

      {section(
        "coffee-bags",
        labels.bags,
        <ul>
          {bags.map((b) => (
            <li key={b.id}>
              <ListRow href={b.href} primary={b.primary} secondary={b.secondary} end={<span className="text-label text-ink-secondary">{b.end}</span>} />
            </li>
          ))}
        </ul>,
      )}
    </div>
  );
}
