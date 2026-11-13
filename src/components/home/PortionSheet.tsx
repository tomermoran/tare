"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/Button/Button";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Sheet } from "@/components/ui/Sheet/Sheet";

export type PortionOption = {
  id: string;
  /** The bag: roasted or added date. */
  primary: string;
  /** State and freshness; a frozen portion says Frozen here. */
  secondary: string;
  /** What's left. */
  end?: string;
  /** In the freezer: listed last and marked as ground from frozen. */
  frozen: boolean;
};

/**
 * SH-PORTION (STORY-02-02-03): which bag a pull uses when none of the coffee
 * is open. Counter portions first, frozen last; choosing one records the
 * shot. With nothing left it says so and offers to add a bag. Closing
 * records nothing.
 */
export function PortionSheet({
  open,
  onClose,
  portions,
  onChoose,
  addBagHref,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  /** Empty: none of the coffee is left. */
  portions: PortionOption[];
  onChoose: (portionId: string) => void;
  addBagHref: string;
  labels: { title: string; body: string; close: string; grindFromFrozen: string; noneLeft: string; addBag: string };
}) {
  const ordered = [...portions.filter((p) => !p.frozen), ...portions.filter((p) => p.frozen)];
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        portions.length ? undefined : (
          <Link href={addBagHref} className={buttonClass({ variant: "ghost", fullWidth: true })}>
            {labels.addBag}
          </Link>
        )
      }
    >
      {portions.length ? (
        <>
          <p className="mb-2 text-body text-ink-secondary">{labels.body}</p>
          <ul>
            {ordered.map((p) => (
              <li key={p.id}>
                <ListRow
                  primary={p.primary}
                  secondary={p.secondary}
                  end={p.end && <span className="text-label text-ink-secondary">{p.end}</span>}
                  footer={p.frozen && <span className="text-label text-ink-secondary">{labels.grindFromFrozen}</span>}
                  onClick={() => onChoose(p.id)}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-body text-ink-secondary">{labels.noneLeft}</p>
      )}
    </Sheet>
  );
}
