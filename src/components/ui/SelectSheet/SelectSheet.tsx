"use client";

import { Icon, type IconName } from "../Icon/Icon";
import { ListRow } from "../ListRow/ListRow";
import { Sheet } from "../Sheet/Sheet";

/*
 * SH-SELECT: one choice from a short list, in a Sheet. Each option is a
 * ListRow with an optional overline marker ("usual", "frozen") and a
 * secondary line; the chosen one has a check and is announced as current.
 * An optional last row leads elsewhere (add a bag, change a part).
 * Choosing closes nothing by itself: the caller decides.
 */

export type SelectOption = {
  id: string;
  primary: string;
  secondary?: string;
  /** A short overline above the name, e.g. "usual" or "frozen". */
  marker?: string;
};

export function SelectSheet({
  open,
  onClose,
  title,
  closeLabel,
  options,
  value,
  onChoose,
  footerRow,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  options: SelectOption[];
  /** The chosen option's id. */
  value: string | null;
  onChoose: (id: string) => void;
  /** A last row that leads to another task. */
  footerRow?: { label: string; icon?: IconName; onClick: () => void };
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title} closeLabel={closeLabel}>
      <ul>
        {options.map((o) => (
          <li key={o.id}>
            <ListRow
              primary={
                <>
                  {o.marker && <span className="block text-overline uppercase text-ink-secondary">{o.marker}</span>}
                  {o.primary}
                </>
              }
              secondary={o.secondary}
              current={o.id === value}
              onClick={() => onChoose(o.id)}
              end={o.id === value ? <Icon name="check" className="mt-0.5" /> : undefined}
            />
          </li>
        ))}
        {footerRow && (
          <li>
            <ListRow
              primary={footerRow.label}
              onClick={footerRow.onClick}
              end={<Icon name={footerRow.icon ?? "plus"} className="mt-0.5" />}
            />
          </li>
        )}
      </ul>
    </Sheet>
  );
}
