import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";

export type LinkPromptLabels = { title: string; body: string; action: string; dismiss: string };

/**
 * The one-time reminder on Brew to keep the history safe (STORY-05-03-03,
 * DES-05-03-01): an outline Card, one sentence, a secondary action and a
 * ghost "not now". Props only; when it shows is Brew's call.
 */
export function LinkPromptCard({
  labels,
  onLink,
  onDismiss,
  busy = false,
}: {
  labels: LinkPromptLabels;
  onLink: () => void;
  onDismiss: () => void;
  busy?: boolean;
}) {
  return (
    <Card tone="outline" padding="md" className="flex flex-col gap-4">
      <section aria-labelledby="link-prompt" className="flex flex-col gap-2">
        <h2 id="link-prompt" className="text-h3 text-ink">
          {labels.title}
        </h2>
        <p className="text-body text-ink-secondary">{labels.body}</p>
      </section>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onLink} disabled={busy} aria-busy={busy || undefined}>
          {labels.action}
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          {labels.dismiss}
        </Button>
      </div>
    </Card>
  );
}
