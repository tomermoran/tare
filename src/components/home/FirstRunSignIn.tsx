"use client";

import { useState } from "react";
import { GoogleLink } from "@/components/account/GoogleLink";
import type { GoogleLinkDeps } from "@/components/account/useGoogleLink";
import { Button } from "@/components/ui/Button/Button";

/**
 * "Already use Tare? Sign in with Google" under Brew's first-run checklist
 * (STORY-05-03-02 AC 3, DES-05-03-03): quiet, ignorable, and only while
 * nothing is entered. It links first, so an unused Google account becomes
 * this device's, and one with a history is offered the switch.
 */
export function FirstRunSignIn({ label, deps, onLinked }: { label: string; deps: GoogleLinkDeps; onLinked?: () => void }) {
  const [linked, setLinked] = useState(false);
  if (linked) return null;
  return (
    <div className="mt-6 flex flex-col items-start gap-4">
      <GoogleLink
        deps={deps}
        onLinked={() => {
          setLinked(true);
          onLinked?.();
        }}
      >
        {({ start, status }) => (
          <Button variant="ghost" size="sm" onClick={start} disabled={status === "linking"} aria-busy={status === "linking" || undefined}>
            {label}
          </Button>
        )}
      </GoogleLink>
    </div>
  );
}
