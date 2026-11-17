"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { BLEND, normaliseOther, OTHER_MAX, originParts, parseOrigin } from "@/domain/origin";

/*
 * The origin choice (DES-03-07-02): not stated, blend, the producing
 * countries by name, or other, which asks for the origin in words. Used by
 * Add a coffee and by the coffee screen. Choosing a row chooses at once;
 * other is confirmed with Done. Props only: the caller saves.
 */

const NONE = "";
const OTHER = "other";

export type OriginSheetLabels = {
  title: string;
  close: string;
  notStated: string;
  blend: string;
  other: string;
  otherLabel: string;
  otherHint: string;
  done: string;
};

export function OriginSheet({
  open,
  onClose,
  value,
  countries,
  onChoose,
  busy = false,
  error,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  /** The origin as stored, or null when not stated. */
  value: string | null;
  /** The countries by name in the locale (originChoices). */
  countries: { code: string; name: string }[];
  /** The chosen origin, or null for not stated. */
  onChoose: (origin: string | null) => void;
  busy?: boolean;
  /** A failed save, with its retry being another choice. */
  error?: string;
  labels: OriginSheetLabels;
}) {
  const current = parseOrigin(value);
  const parts = current ? originParts(current) : null;
  const [chosen, setChosen] = useState(parts?.kind === "other" ? OTHER : parts?.kind === "country" ? parts.code : (current ?? NONE));
  const [text, setText] = useState(parts?.kind === "other" ? parts.text : "");
  const other = normaliseOther(text);

  const choose = (id: string) => {
    setChosen(id);
    if (id !== OTHER) onChoose(id === NONE ? null : id);
  };
  const rows = [
    { id: NONE, label: labels.notStated },
    { id: BLEND, label: labels.blend },
    ...countries.map((c) => ({ id: c.code, label: c.name })),
    { id: OTHER, label: labels.other },
  ];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        chosen === OTHER ? (
          <Button variant="primary" fullWidth disabled={!other || busy} onClick={() => other && onChoose(other)}>
            {labels.done}
          </Button>
        ) : undefined
      }
    >
      {error && (
        <Notice urgent className="mb-3">
          {error}
        </Notice>
      )}
      {chosen === OTHER && (
        <Input
          label={labels.otherLabel}
          hint={labels.otherHint}
          value={text}
          maxLength={OTHER_MAX}
          autoComplete="off"
          className="mb-3"
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <ul>
        {rows.map((r) => (
          <li key={r.id || "none"}>
            <ListRow
              primary={r.label}
              current={r.id === chosen}
              onClick={busy ? undefined : () => choose(r.id)}
              end={r.id === chosen ? <Icon name="check" className="mt-0.5" /> : undefined}
            />
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
