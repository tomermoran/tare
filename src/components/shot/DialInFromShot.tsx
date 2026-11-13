"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PortionChooser } from "@/components/home/PortionChooser";
import { Button } from "@/components/ui/Button/Button";
import { dialInFromShotHref } from "@/lib/fixRoutes";
import { dialInPortionAction } from "@/server/actions/pull";
import type { PortionChoice } from "@/server/dal/pull";

/**
 * SCR-SHOT "Dial in from this" (STORY-02-06-06): the log opens with this
 * shot's values on its setup, drink and coffee. When none of the coffee is
 * open SH-PORTION asks which bag first (AC 2); when it's finished it says so
 * and offers to add a bag (AC 3). Nothing is written until the new shot is saved.
 */
export function DialInFromShot({ shotId, label, addBagHref }: { shotId: string; label: string; addBagHref: string }) {
  const router = useRouter();
  const [choosing, setChoosing] = useState<PortionChoice[] | null>(null);
  const busy = useRef(false);

  const open = async () => {
    if (busy.current) return;
    busy.current = true;
    const result = await dialInPortionAction(shotId);
    busy.current = false;
    // Unknown: the log keeps the shot's own bag while it lasts.
    if (!result.ok) return router.push(dialInFromShotHref(shotId));
    if (result.data.kind === "portion") return router.push(dialInFromShotHref(shotId, { portionId: result.data.portionId }));
    setChoosing(result.data.portions);
  };

  return (
    <>
      <Button variant="secondary" fullWidth onClick={() => void open()}>
        {label}
      </Button>
      <PortionChooser
        portions={choosing}
        onClose={() => setChoosing(null)}
        onChoose={(portionId) => {
          setChoosing(null);
          router.push(dialInFromShotHref(shotId, { portionId }));
        }}
        addBagHref={addBagHref}
      />
    </>
  );
}
