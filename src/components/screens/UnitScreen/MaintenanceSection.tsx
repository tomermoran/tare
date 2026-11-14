import { Button } from "@/components/ui/Button/Button";
import { ListRow } from "@/components/ui/ListRow/ListRow";

export type MaintenanceRow = {
  id: string;
  /** The kind of work, worded. */
  kind: string;
  /** Already formatted. */
  date: string;
  note: string | null;
  recalibration: boolean;
};

/**
 * SCR-UNIT's maintenance section (STORY-04-01-01): for a grinder, the
 * current grind period first (STORY-04-01-03), then events newest first
 * with kind, date, the start of any note and "recalibration" in words.
 * With none, it says so and offers to add. Props only.
 */
export function MaintenanceSection({
  labels,
  period,
  events,
  onAdd,
}: {
  labels: { title: string; none: string; add: string; recalibration: string };
  /** The grind period line and its shot count, for grinders only. */
  period?: { line: string; shots?: string };
  events: MaintenanceRow[];
  onAdd: () => void;
}) {
  return (
    <section aria-labelledby="unit-maintenance" className="flex flex-col gap-1">
      <h2 id="unit-maintenance" className="text-h3 text-ink">
        {labels.title}
      </h2>
      {period && (
        <p className="flex flex-col pt-1 pb-2">
          <span className="text-body text-ink">{period.line}</span>
          {period.shots && <span className="text-label text-ink-secondary">{period.shots}</span>}
        </p>
      )}
      {events.length ? (
        <>
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                <ListRow
                  primary={e.kind}
                  secondary={
                    <>
                      {e.date}
                      {e.note && <span className="line-clamp-1 break-words">{e.note}</span>}
                    </>
                  }
                  end={
                    e.recalibration ? (
                      <span className="text-overline uppercase text-ink-secondary">{labels.recalibration}</span>
                    ) : undefined
                  }
                />
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="-ms-4 self-start" onClick={onAdd}>
            {labels.add}
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-start gap-3 pt-2">
          <p className="text-body text-ink-secondary">{labels.none}</p>
          <Button variant="secondary" onClick={onAdd}>
            {labels.add}
          </Button>
        </div>
      )}
    </section>
  );
}
