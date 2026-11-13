import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Meter } from "@/components/ui/Meter/Meter";
import { Notice } from "@/components/ui/Notice/Notice";

export type PortionRow = {
  id: string;
  /** "Unopened", "Open", "Frozen"… */
  state: string;
  /** How long it has been open, or paused in the freezer (EPIC-03-03). */
  opened?: string;
  /** Freezer days the clocks leave out, when there are any (STORY-03-03-02 AC 4). */
  frozenDays?: string;
  /** The amount left, formatted: a number first (EPIC-03-04). */
  remaining: string;
  /** What's left against the portion's weight, supporting the number. */
  meter?: { label: string; value: number; max: number; text: string };
  /** More logged than the portion held: a neutral Notice to weigh it (never signal). */
  overLogged?: { message: string; action: string };
};

/**
 * A bag's portion rows, on Beans and the bag screen: state, what's left and
 * a Meter. A row opens the portion actions; an over-logged portion offers
 * to weigh what's left (STORY-03-04-01 AC 4).
 */
export function PortionRows({
  portions,
  onPortion,
  onWeigh,
  className,
}: {
  portions: PortionRow[];
  onPortion?: (id: string) => void;
  onWeigh?: (id: string) => void;
  className?: string;
}) {
  return (
    <ul className={className}>
      {portions.map((p) => (
        <li key={p.id} className="border-b border-line last:border-b-0">
          <ListRow
            className="border-b-0"
            primary={p.state}
            secondary={p.opened}
            end={<span className="text-body text-ink">{p.remaining}</span>}
            footer={
              (p.meter || p.frozenDays) && (
                <>
                  {p.meter && <Meter label={p.meter.label} value={p.meter.value} max={p.meter.max} valueText={p.meter.text} className="mt-1 basis-full" />}
                  {p.frozenDays && <span className="basis-full text-label text-ink-secondary">{p.frozenDays}</span>}
                </>
              )
            }
            onClick={onPortion ? () => onPortion(p.id) : undefined}
          />
          {p.overLogged && (
            <Notice action={onWeigh ? { label: p.overLogged.action, onClick: () => onWeigh(p.id) } : undefined} className="mb-3">
              {p.overLogged.message}
            </Notice>
          )}
        </li>
      ))}
    </ul>
  );
}
