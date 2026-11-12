import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { SelectField } from "@/components/ui/SelectField/SelectField";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import type { HardwareKind } from "@/domain/capabilities";

/*
 * SCR-TOOLKIT, the setup builder: "which parts are you using?" Three rows
 * in a fixed order, each choosing one of the household's parts of that kind
 * or adding one. A live line says whether the combination is an existing
 * setup or a new one. A missing part is explained on save in a neutral
 * Notice; the button never greys out. Props only.
 */

const KINDS = ["machine", "grinder", "basket"] as const satisfies readonly HardwareKind[];

export type BuilderOption = { id: string; primary: string; secondary: string };

export type BuilderMatch =
  | { kind: "existing"; name: string; recipeCount: string }
  | { kind: "new"; closest?: string };

export type SetupBuilderLabels = {
  title: string;
  cancel: string;
  close: string;
  kinds: Record<HardwareKind, string>;
  /** Sheet titles: "Machines", "Grinders", "Baskets". */
  kindPlural: Record<HardwareKind, string>;
  notChosen: string;
  addPart: string;
  /** Already formatted with the name. */
  matchFound: (name: string) => string;
  newSetup: string;
  closest: (name: string) => string;
  addName: string;
  name: string;
  nameHint: string;
  useThis: string;
  makeThis: string;
  saveFailedTitle: string;
  saveFailed: string;
};

export function SetupBuilderScreen({
  labels,
  options,
  chosen,
  openKind,
  onOpenKind,
  onChoose,
  onAddPart,
  match,
  nameOpen,
  onOpenName,
  name,
  onNameChange,
  missing,
  state = "idle",
  onSave,
  onCancel,
}: {
  labels: SetupBuilderLabels;
  /** The household's parts of each kind. */
  options: Record<HardwareKind, BuilderOption[]>;
  chosen: Record<HardwareKind, string | null>;
  /** The kind whose list is open, or null. */
  openKind: HardwareKind | null;
  onOpenKind: (kind: HardwareKind | null) => void;
  onChoose: (kind: HardwareKind, id: string) => void;
  onAddPart: (kind: HardwareKind) => void;
  /** Null until all three are chosen. */
  match: BuilderMatch | null;
  nameOpen: boolean;
  onOpenName: () => void;
  name: string;
  onNameChange: (name: string) => void;
  /** After saving with parts missing: already formatted, naming them. */
  missing?: string;
  state?: "idle" | "saving" | "failed";
  onSave: () => void;
  onCancel: () => void;
}) {
  const valueOf = (kind: HardwareKind) =>
    options[kind].find((o) => o.id === chosen[kind])?.primary ?? labels.notChosen;
  const isNew = match?.kind !== "existing";

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (state !== "saving") onSave();
      }}
    >
      <PageHeader
        variant="task"
        title={labels.title}
        start={
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {labels.cancel}
          </Button>
        }
      />

      <div className="flex flex-col gap-2">
        {KINDS.map((kind) => (
          <SelectField
            key={kind}
            label={labels.kinds[kind]}
            value={valueOf(kind)}
            onClick={() => onOpenKind(kind)}
          />
        ))}
      </div>

      {/* Polite, so changing a row reads out the result without interrupting. */}
      <p aria-live="polite" className="min-h-6 text-body text-ink">
        {match?.kind === "existing" && (
          <>
            {labels.matchFound(match.name)} <span className="text-ink-secondary">{match.recipeCount}</span>
          </>
        )}
        {match?.kind === "new" && (
          <>
            {labels.newSetup}
            {match.closest && <span className="block text-ink-secondary">{labels.closest(match.closest)}</span>}
          </>
        )}
      </p>

      {isNew &&
        (nameOpen ? (
          <Input label={labels.name} hint={labels.nameHint} value={name} maxLength={60} autoComplete="off" onChange={(e) => onNameChange(e.target.value)} />
        ) : (
          <Button variant="ghost" size="sm" onClick={onOpenName} className="self-start">
            <Icon name="plus" />
            {labels.addName}
          </Button>
        ))}

      {missing && <Notice>{missing}</Notice>}
      {state === "failed" && (
        <Notice urgent title={labels.saveFailedTitle}>
          {labels.saveFailed}
        </Notice>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={state === "saving"} aria-busy={state === "saving" || undefined}>
        {isNew ? labels.makeThis : labels.useThis}
      </Button>

      <Sheet
        open={openKind !== null}
        onClose={() => onOpenKind(null)}
        title={openKind ? labels.kindPlural[openKind] : ""}
        closeLabel={labels.close}
      >
        {openKind && (
          <ul>
            {options[openKind].map((o) => (
              <li key={o.id}>
                <ListRow
                  primary={o.primary}
                  secondary={o.secondary}
                  onClick={() => onChoose(openKind, o.id)}
                  end={chosen[openKind] === o.id ? <Icon name="check" className="mt-0.5" /> : undefined}
                />
              </li>
            ))}
            <li>
              <ListRow primary={labels.addPart} onClick={() => onAddPart(openKind)} end={<Icon name="plus" className="mt-0.5" />} />
            </li>
          </ul>
        )}
      </Sheet>
    </form>
  );
}
