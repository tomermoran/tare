"use client";

import type { ReactNode } from "react";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { ShotValues, type ShotValuesData } from "@/components/ui/ShotValues/ShotValues";

type HomeScreenProps = {
  /** The drink title. */
  drink: string;
  /** The coffee line: bean and roaster (the clocks join in wave 12b). Null when there's no coffee. */
  coffee: string | null;
  /** The recipe on this setup; with `quiet`, shown in ink-secondary (finished coffee). */
  values?: ShotValuesData;
  quiet?: boolean;
  /** Changes when the drink or coffee does, so the values cross-fade in place. */
  valuesKey?: string;
  /** Quiet lines under the values: milk, puck prep, temperature, pressure. */
  lines?: string[];
  /** A sentence in place of the values, or above quiet ones: no recipe, finished, no coffee. */
  message?: string;
  /** One quiet line under the message, e.g. the setup the dial-in starts from. */
  note?: string;
  /** The current setup's name. */
  setup: string;
  /** The buttons, or the pulled state in their place. */
  actions: ReactNode;
  /** Remaining coffee in the portion in use; hidden when unknown. */
  footnote?: string;
  labels: { changeDrink: string; changeCoffee: string };
  onChangeDrink?: () => void;
  onChangeCoffee?: () => void;
};

/**
 * Brew (SCR-HOME): today's recipe, one tap to log it. Drink and coffee are
 * quiet selects; the values, setup and buttons follow. See
 * planning/drafts/design.md section 2.3.
 */
export function HomeScreen({
  drink,
  coffee,
  values,
  valuesKey,
  quiet = false,
  lines = [],
  message,
  note,
  setup,
  actions,
  footnote,
  labels,
  onChangeDrink,
  onChangeCoffee,
}: HomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col [&>*]:shrink-0">
      <SelectField
        look="quiet"
        value={drink}
        onClick={onChangeDrink}
        hiddenLabel={labels.changeDrink}
        valueClassName="text-h1"
        className="mt-7"
      />
      {coffee && (
        <SelectField
          look="quiet"
          value={coffee}
          onClick={onChangeCoffee}
          hiddenLabel={labels.changeCoffee}
          valueClassName="text-body text-ink-secondary"
          className="mt-1.5 text-ink-secondary"
        />
      )}

      <div key={valuesKey} className="motion-safe:animate-fade-in">
        {message && <p className="mt-9 max-w-[30ch] text-body text-ink-secondary">{message}</p>}
        {note && <p className="mt-1 text-label text-ink-secondary">{note}</p>}
        {values && (
          <div className={quiet ? "mt-6 text-ink-secondary" : "mt-9"}>
            <ShotValues values={values} quiet={quiet} />
            {lines.map((line) => (
              <p key={line} className="mt-1 text-label text-ink-secondary">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 text-label text-ink-secondary">{setup}</p>

      <div className="mt-auto grid min-h-38 content-end gap-2 pt-7">
        {actions}
        {footnote && <p className="mt-2 text-center text-label text-ink-secondary">{footnote}</p>}
      </div>
    </div>
  );
}
