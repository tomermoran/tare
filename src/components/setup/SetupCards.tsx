import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Notice } from "@/components/ui/Notice/Notice";

/*
 * Cards on the Setup tab (SCR-KIT). SetupOfferCard is the first-setup
 * shortcut, naming the three parts it will use (STORY-01-02-05 AC 4).
 * SetupCard is one setup: its name or parts name, its parts in kind order
 * and its recipe count. Props only.
 */

export function SetupOfferCard({
  title,
  body,
  parts,
  action,
  busy = false,
  error,
  onAccept,
}: {
  title: string;
  body: string;
  /** Machine, grinder and basket, each by maker and model. */
  parts: string[];
  action: string;
  busy?: boolean;
  /** Shown when the tap didn't save. */
  error?: string;
  onAccept: () => void;
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-ink">{title}</h3>
        <p className="text-body text-ink-secondary">{body}</p>
      </div>
      <ul className="flex flex-col gap-1 text-label text-ink">
        {parts.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {error && (
        <Notice size="inline" urgent>
          {error}
        </Notice>
      )}
      <Button variant="primary" onClick={onAccept} disabled={busy} aria-busy={busy || undefined} className="self-start">
        {action}
      </Button>
    </Card>
  );
}

export function SetupCard({
  overline,
  name,
  parts,
  recipeCount,
}: {
  /** "Current" on the current setup. */
  overline?: string;
  /** Its name, or its parts name when it has none. */
  name: string;
  parts: string[];
  recipeCount: string;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {overline && <p className="text-overline uppercase text-ink-secondary">{overline}</p>}
        <h3 className="text-h3 text-ink">{name}</h3>
      </div>
      <ul className="flex flex-col gap-1 text-label text-ink-secondary">
        {parts.map((p, i) => (
          <li key={`${i}-${p}`}>{p}</li>
        ))}
      </ul>
      <p className="text-label text-ink-secondary">{recipeCount}</p>
    </Card>
  );
}
