"use client";

import { Button } from "@/components/ui/Button/Button";
import { usePinFlow } from "./usePinFlow";

/** "Pin as recipe" for a measured shot, opening SH-PIN (STORY-02-01-01 AC 1). */
export function PinAction({ shotId, title, label }: { shotId: string; title: string; label: string }) {
  const { pinShot, sheet, status } = usePinFlow({ title });
  return (
    <>
      <Button variant="primary" fullWidth onClick={() => void pinShot(shotId)}>
        {label}
      </Button>
      {status}
      {sheet}
    </>
  );
}
