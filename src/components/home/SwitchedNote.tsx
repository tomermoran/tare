"use client";

import { useEffect, useState } from "react";
import { SWITCHED_FLAG } from "@/components/account/GoogleLink";

/** After switching to another history, Brew says so once, politely (DES-05-03-02). */
export function SwitchedNote({ label }: { label: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SWITCHED_FLAG) !== "1") return;
      sessionStorage.removeItem(SWITCHED_FLAG);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the one-time flag on mount
      setShown(true);
    } catch {
      // No storage: nothing to say.
    }
  }, []);
  return (
    <p role="status" className="text-label text-ink-secondary">
      {shown ? label : ""}
    </p>
  );
}
