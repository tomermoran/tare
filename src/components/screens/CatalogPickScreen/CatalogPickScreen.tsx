import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { ListRow } from "@/components/ui/ListRow/ListRow";
import { Notice } from "@/components/ui/Notice/Notice";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton/Skeleton";

/*
 * SCR-CATALOG-PICK: one search field over a catalog (hardware or coffee).
 * Props only; the route wires search, browse and return. With no query the
 * list is browse rows (makers or roasters, or one maker's models); with a
 * query it's results. "Can't find it? Add it" always ends the list.
 */

export type PickRow = {
  id: string;
  /** Model or coffee name. */
  primary: string;
  /** Maker or roaster; always shown for models so baskets aren't bare sizes. */
  secondary?: string;
  /** The household's own unverified entry: a text marker, never a colour. */
  addedByYou?: boolean;
  /** The alias that matched, when the name didn't. */
  alias?: string;
  /** Browse rows lead somewhere (a maker's models): shows a chevron. */
  drillIn?: boolean;
};

export type PickGroup = { label?: string; rows: PickRow[] };

export type CatalogPickLabels = {
  title: string;
  search: string;
  searchHint: string;
  addedByYou: string;
  /** Formats the matched alias, e.g. "Also known as BES500". */
  alsoKnownAs: (alias: string) => string;
  cantFind: string;
  /** Already formatted with the query. */
  noMatch: string;
  loading: string;
  cancel: string;
  /** Shown above a maker's models in browse; returns to all makers. */
  back?: string;
};

export function CatalogPickScreen({
  labels,
  query,
  onQueryChange,
  state,
  groups,
  onPick,
  onCantFind,
  onCancel,
  onBack,
}: {
  labels: CatalogPickLabels;
  query: string;
  onQueryChange: (query: string) => void;
  /** loading: skeleton rows; ready: the groups (empty with a query = no match). */
  state: "loading" | "ready";
  groups: PickGroup[];
  onPick: (row: PickRow) => void;
  onCantFind: () => void;
  onCancel: () => void;
  /** Set while browsing one maker's models. */
  onBack?: () => void;
}) {
  const empty = groups.every((g) => g.rows.length === 0);
  const noMatch = state === "ready" && empty && query.trim() !== "";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        variant="task"
        title={labels.title}
        start={
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {labels.cancel}
          </Button>
        }
      />
      <Input
        type="search"
        label={labels.search}
        hint={labels.searchHint}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        autoComplete="off"
        enterKeyHint="search"
      />

      {onBack && labels.back && (
        <Button variant="ghost" size="sm" onClick={onBack} className="self-start">
          <Icon name="back" />
          {labels.back}
        </Button>
      )}

      {state === "loading" ? (
        <Skeleton label={labels.loading}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2 border-b border-line py-3">
              <SkeletonBlock shape="line" className="w-3/5" />
              <SkeletonBlock shape="line" className="w-2/5" />
            </div>
          ))}
        </Skeleton>
      ) : noMatch ? (
        <div className="flex flex-col gap-3">
          <Notice>{labels.noMatch}</Notice>
          <Button onClick={onCantFind} className="self-start">
            {labels.cantFind}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          {groups
            .filter((g) => g.rows.length > 0)
            .map((group, gi) => (
              <section key={group.label ?? gi} aria-label={group.label} className="flex flex-col">
                {group.label && (
                  <h2 className="pt-4 pb-1 text-overline uppercase text-ink-secondary">{group.label}</h2>
                )}
                <ul>
                  {group.rows.map((row) => (
                    <li key={row.id}>
                      <ListRow
                        primary={row.primary}
                        secondary={row.secondary}
                        onClick={() => onPick(row)}
                        end={row.drillIn ? <Icon name="chevron" className="mt-0.5 text-ink-secondary" /> : undefined}
                        footer={
                          row.addedByYou || row.alias ? (
                            <>
                              {row.alias && (
                                <span className="text-label text-ink-secondary">{labels.alsoKnownAs(row.alias)}</span>
                              )}
                              {row.addedByYou && (
                                <span className="text-overline uppercase text-ink-secondary">{labels.addedByYou}</span>
                              )}
                            </>
                          ) : undefined
                        }
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          {/* Always last: the way out when the catalog doesn't have it. */}
          <ListRow primary={labels.cantFind} onClick={onCantFind} end={<Icon name="plus" className="mt-0.5" />} />
        </div>
      )}
    </div>
  );
}
