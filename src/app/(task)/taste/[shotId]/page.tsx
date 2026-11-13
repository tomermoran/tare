import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { TasteFlow } from "@/components/taste/TasteFlow";
import { getShot } from "@/server/dal/journal";
import { NotFoundError, unlessSignedOut } from "@/server/dal/scope";

/**
 * SCR-TASTE: say how a just-saved measured shot tasted (EPIC-01-05).
 * One-tap shots are never rated (DQ-23), so they go to their detail.
 */
export default function TastePage({ params }: PageProps<"/taste/[shotId]">) {
  return (
    <Suspense fallback={null}>
      <Taste params={params} />
    </Suspense>
  );
}

async function Taste({ params }: Pick<PageProps<"/taste/[shotId]">, "params">) {
  const { shotId } = await params;
  const shot = await unlessSignedOut(getShot(shotId)).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  if (!shot) return null;
  if (shot.entryMode !== "measured") redirect(`/journal/${shot.id}`);

  return (
    <TasteFlow
      shotId={shot.id}
      values={shot.values}
      milkDrink={shot.milkDrink}
      initial={{ rating: shot.rating, ...shot.taste, tags: shot.tags }}
      leaveTo="/"
    />
  );
}
