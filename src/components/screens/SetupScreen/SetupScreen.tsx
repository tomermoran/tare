import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button/Button";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton/Skeleton";
import type { HardwareKind } from "@/domain/capabilities";

/*
 * SCR-KIT, the Setup tab: the household's setups, then its parts grouped by
 * kind (AC 1). Props only. Setups and the first-setup offer are slots the
 * setup screens fill. With no parts it's one EmptyState whose only action is
 * adding the machine, and the header's "Add a part" hides, so every state
 * has at most one primary button (AC 6).
 */

const KINDS = ["machine", "grinder", "basket"] as const satisfies readonly HardwareKind[];

export type PartRow = {
  id: string;
  /** Nickname, or the model when there's none. */
  primary: string;
  /** Maker and model, so a nicknamed part still says what it is. */
  secondary: string;
  /** Opens the part (SCR-UNIT). */
  href?: string;
};

export type SetupLabels = {
  title: string;
  addPart: string;
  setups: string;
  parts: string;
  kindPlural: Record<HardwareKind, string>;
  emptyTitle: string;
  empty: string;
  addMachine: string;
  loading: string;
};

export function SetupScreen({
  labels,
  state = "ready",
  parts,
  setups,
  setupOffer,
  addPartHref,
  addMachineHref,
  notice,
}: {
  labels: SetupLabels;
  state?: "loading" | "ready";
  parts: Record<HardwareKind, PartRow[]>;
  /** The setup Cards, current first. */
  setups?: ReactNode;
  /** The first-setup offer, shown when there are parts but no setup. */
  setupOffer?: ReactNode;
  addPartHref: string;
  addMachineHref: string;
  /** A neutral Notice under the header, e.g. after a refused save. */
  notice?: ReactNode;
}) {
  if (state === "loading") {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={labels.title} />
        <Skeleton label={labels.loading}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2 border-b border-line py-3">
              <SkeletonBlock shape="line" className="w-3/5" />
              <SkeletonBlock shape="line" className="w-2/5" />
            </div>
          ))}
        </Skeleton>
      </div>
    );
  }

  const hasParts = KINDS.some((k) => parts[k].length > 0);
  if (!hasParts) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={labels.title} />
        {notice}
        <EmptyState title={labels.emptyTitle} action={{ label: labels.addMachine, href: addMachineHref }}>
          {labels.empty}
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={labels.title}
        end={
          <Link href={addPartHref} className={buttonClass({ size: "sm" })}>
            {labels.addPart}
          </Link>
        }
      />
      {notice}

      {(setups || setupOffer) && (
        <section aria-labelledby="setup-setups" className="flex flex-col gap-4">
          <h2 id="setup-setups" className="text-h3 text-ink">
            {labels.setups}
          </h2>
          {setupOffer}
          {setups}
        </section>
      )}

      <section aria-labelledby="setup-parts" className="flex flex-col gap-2">
        <h2 id="setup-parts" className="text-h3 text-ink">
          {labels.parts}
        </h2>
        {KINDS.filter((k) => parts[k].length > 0).map((kind) => (
          <section key={kind} aria-labelledby={`setup-parts-${kind}`} className="flex flex-col">
            <h3 id={`setup-parts-${kind}`} className="pt-4 pb-1 text-overline uppercase text-ink-secondary">
              {labels.kindPlural[kind]}
            </h3>
            <ul>
              {parts[kind].map((p) => (
                <li key={p.id}>
                  <ListRow primary={p.primary} secondary={p.secondary} href={p.href} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>
    </div>
  );
}
