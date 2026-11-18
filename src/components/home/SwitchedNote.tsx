"use client";

import { useEffect, useState } from "react";
import { SWITCHED_FLAG } from "@/components/account/GoogleLink";

/** Set by SCR-JOIN after a claim, for Brew's one-time "you've joined" (STORY-05-02-03 AC 3). */
export const JOINED_FLAG = "tare:joinedHousehold";
/** Set after leaving a household, for Brew's one-time "you've left" (STORY-05-02-07). */
export const LEFT_FLAG = "tare:leftHousehold";

/**
 * After switching to another history (DES-05-03-02), or joining a
 * household, Brew says so once, politely. `flag` names which.
 */
export function SwitchedNote({ label, flag = SWITCHED_FLAG }: { label: string; flag?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(flag) !== "1") return;
      sessionStorage.removeItem(flag);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the one-time flag on mount
      setShown(true);
    } catch {
      // No storage: nothing to say.
    }
  }, [flag]);
  return (
    <p role="status" className="text-label text-ink-secondary">
      {shown ? label : ""}
    </p>
  );
}
