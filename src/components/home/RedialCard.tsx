import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";

export type RedialCardLabels = { title: string; body: string; start: string; later: string };

/**
 * The calm invitation on Brew after a grinder was serviced (STORY-04-03-04
 * AC 2, DES-04-03-01): an outline Card, one sentence, a secondary "re-dial
 * a coffee" and a ghost "not now". Props only; when it shows is Brew's call.
 */
export function RedialCard({ labels, onStart, onLater }: { labels: RedialCardLabels; onStart: () => void; onLater: () => void }) {
  return (
    <Card tone="outline" padding="md" className="flex flex-col gap-4">
      <section aria-labelledby="redial-card" className="flex flex-col gap-2">
        <h2 id="redial-card" className="text-h3 text-ink">
          {labels.title}
        </h2>
        <p className="text-body text-ink-secondary">{labels.body}</p>
      </section>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onStart}>
          {labels.start}
        </Button>
        <Button variant="ghost" onClick={onLater}>
          {labels.later}
        </Button>
      </div>
    </Card>
  );
}
