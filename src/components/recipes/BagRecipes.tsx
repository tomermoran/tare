import { RecipeRows, type RecipeRow, type RemoveLabels } from "./RecipeRows";

/*
 * A bag's recipes (STORY-02-04-03 AC 2): its own first under "For this bag
 * only", then the coffee's under "Other bags use", quieter. With no own
 * recipe, the coffee's are shown as before, with no heading. Props only.
 */
export function BagRecipes({
  own,
  coffee,
  labels,
  remove,
}: {
  own: RecipeRow[];
  coffee: RecipeRow[];
  labels: { dialIn: string; change: string; close: string; thisBagOnly: string; coffeeDefault: string };
  remove: { labels: RemoveLabels; onRemove: (row: RecipeRow) => Promise<boolean> };
}) {
  const rowLabels = { dialIn: labels.dialIn, change: labels.change, close: labels.close };
  if (!own.length) return <RecipeRows rows={coffee} labels={rowLabels} />;
  return (
    <div className="flex flex-col gap-6">
      <section aria-label={labels.thisBagOnly} className="flex flex-col gap-2">
        <h3 className="text-overline uppercase text-ink-secondary">{labels.thisBagOnly}</h3>
        <RecipeRows rows={own.map((r) => ({ ...r, removable: true }))} labels={rowLabels} remove={remove} />
      </section>
      {coffee.length > 0 && (
        <section aria-label={labels.coffeeDefault} className="flex flex-col gap-2">
          <h3 className="text-overline uppercase text-ink-secondary">{labels.coffeeDefault}</h3>
          <RecipeRows rows={coffee.map((r) => ({ ...r, quiet: true }))} labels={rowLabels} />
        </section>
      )}
    </div>
  );
}
