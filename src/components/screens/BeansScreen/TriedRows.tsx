import { ListRow } from "@/components/ui/ListRow/ListRow";

export type TriedRow = {
  id: string;
  /** The coffee's screen (SCR-COFFEE). */
  href: string;
  bean: string;
  roaster: string;
  /** "3 weeks ago". */
  lastHad: string;
  /** "2 bags". */
  bagCount: string;
  /** How its shots went, in words only (DQ-28). */
  summary: string;
};

/**
 * Tried on Beans (STORY-03-06-01): one row per coffee brewed, with when it
 * was last had, how many bags, and a line on how its shots went. The summary
 * is plain secondary text: never a colour or a badge (STORY-03-06-02 AC 5).
 */
export function TriedRows({ rows }: { rows: TriedRow[] }) {
  return (
    <ul>
      {rows.map((r) => (
        <li key={r.id}>
          <ListRow
            href={r.href}
            primary={r.bean}
            secondary={r.roaster}
            end={
              <span className="flex flex-col text-label text-ink-secondary">
                <span>{r.lastHad}</span>
                <span>{r.bagCount}</span>
              </span>
            }
            footer={<span className="text-label text-ink-secondary">{r.summary}</span>}
          />
        </li>
      ))}
    </ul>
  );
}
