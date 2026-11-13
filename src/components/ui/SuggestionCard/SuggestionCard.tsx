import Link from "next/link";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Icon } from "../Icon/Icon";

export type SuggestionCardLabels = {
  /** The overline, "Next shot". */
  title: string;
  dismiss: string;
  /** Read between the two values, "15 to 13". */
  to: string;
};

/**
 * SuggestionCard (NC-16): one change for the next shot, its dial values, a
 * one-line reason and an optional freshness line. Advice, not a warning, so
 * ink only, never `signal`. The whole card is a polite live region, so a
 * change as answers move is announced. Props only: the words are formatted
 * by the caller. With only a freshness line there's no change or values.
 */
export function SuggestionCard({
  labels,
  change,
  values,
  reason,
  freshness,
  link,
  onDismiss,
}: {
  labels: SuggestionCardLabels;
  change?: string;
  /** The current and suggested values, formatted with their units. */
  values?: { from: string; to: string };
  reason?: string;
  freshness?: string;
  /** For example, telling Tare which way the grinder goes coarser. */
  link?: { label: string; href: string };
  onDismiss?: () => void;
}) {
  return (
    <Card tone="outline" padding="md" role="status" aria-live="polite" className="flex flex-col gap-1 text-start">
      <p className="text-overline text-ink-secondary uppercase">{labels.title}</p>
      {change && <p className="mt-1 text-h3">{change}</p>}
      {values && (
        <p className="flex items-center gap-1.5 text-label text-ink-secondary">
          <span>{values.from}</span>
          <Icon name="arrow" size={14} label={labels.to} />
          <span>{values.to}</span>
        </p>
      )}
      {reason && <p className="mt-1 text-label text-ink-secondary first-letter:uppercase">{reason}</p>}
      {freshness && <p className="mt-1 text-label text-ink-secondary">{freshness}</p>}
      {link && (
        <Link href={link.href} className="mt-1 self-start text-label text-ink underline underline-offset-4">
          {link.label}
        </Link>
      )}
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss} className="mt-2 self-end">
          {labels.dismiss}
        </Button>
      )}
    </Card>
  );
}
