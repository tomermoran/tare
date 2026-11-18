"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AuthCredential } from "firebase/auth";
import type { LinkResult } from "@/lib/firebase/google";

/*
 * The link-or-switch flow (EPIC-05-03), shared by Profile's Account section,
 * Brew's first-run link and the one-time reminder. Firebase and the server
 * come in as `deps`, so stories and tests can stand in for them.
 *
 * - Linked: `onLinked` (the uid is unchanged; the page refreshes).
 * - Cancelled: back to idle with no message (STORY-05-03-01 AC 3).
 * - Failed or offline: "nothing has changed", with retry (AC 4).
 * - The Google account already has a history: the switch is offered. An empty
 *   device loses nothing (STORY-05-03-04 AC 1); a device with history is
 *   warned that its own history stays behind and can't be reached after
 *   switching (AC 3). Nothing is ever merged.
 */

export type GoogleLinkDeps = {
  link: () => Promise<LinkResult>;
  /** The result of a redirect link on return, or null. */
  completeRedirect: () => Promise<LinkResult | null>;
  /** Whether this device has nothing entered; null when that couldn't be checked. */
  canSwitch: () => Promise<boolean | null>;
  /** Signs in as the other account and starts its session; throws on failure. */
  switchTo: (credential: AuthCredential) => Promise<void>;
};

export type LinkStatus = "idle" | "linking" | "failed";

export type SwitchState = {
  open: boolean;
  /** This device has history of its own, which switching leaves behind. */
  leavesHistory: boolean;
  busy: boolean;
  failed: boolean;
  confirm: () => void;
  cancel: () => void;
};

type Pending = { credential: AuthCredential; leavesHistory: boolean; busy: boolean; failed: boolean };

export function useGoogleLink(deps: GoogleLinkDeps, on: { linked: () => void; switched: () => void }) {
  const [status, setStatus] = useState<LinkStatus>("idle");
  const [pending, setPending] = useState<Pending | null>(null);
  const latest = useRef({ deps, on });
  useEffect(() => {
    latest.current = { deps, on };
  });

  const handle = useCallback(async (result: LinkResult | null) => {
    if (!result) return;
    const { deps, on } = latest.current;
    switch (result.kind) {
      case "linked":
        setStatus("idle");
        on.linked();
        return;
      case "cancelled":
        setStatus("idle");
        return;
      case "redirecting":
        // The page is leaving for Google; it stays busy until then.
        return;
      case "failed":
        setStatus("failed");
        return;
      case "accountTaken": {
        const empty = await deps.canSwitch();
        if (empty === null) return setStatus("failed");
        setStatus("idle");
        setPending({ credential: result.credential, leavesHistory: !empty, busy: false, failed: false });
      }
    }
  }, []);

  // A redirect link (iOS Safari) lands back here with its result.
  useEffect(() => {
    void latest.current.deps.completeRedirect().then(handle);
  }, [handle]);

  const start = useCallback(async () => {
    setStatus("linking");
    await handle(await latest.current.deps.link());
  }, [handle]);

  const confirm = useCallback(async () => {
    if (!pending || pending.busy) return;
    setPending({ ...pending, busy: true, failed: false });
    try {
      await latest.current.deps.switchTo(pending.credential);
      latest.current.on.switched();
    } catch {
      // The sheet stays, says nothing changed, and offers a retry (AC 4, AC 5).
      setPending({ ...pending, busy: false, failed: true });
    }
  }, [pending]);

  const switchState: SwitchState = {
    open: pending !== null,
    leavesHistory: pending?.leavesHistory ?? false,
    busy: pending?.busy ?? false,
    failed: pending?.failed ?? false,
    confirm: () => void confirm(),
    cancel: () => setPending(null),
  };

  return { status, start: () => void start(), switchState };
}
