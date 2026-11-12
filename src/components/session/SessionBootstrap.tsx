"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getIdToken } from "@/lib/firebase/client";

// One exchange at a time per page load, even when React runs the effect
// twice in development.
let exchange: Promise<boolean> | null = null;

async function exchangeToken(): Promise<boolean> {
  const idToken = await getIdToken();
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return res.ok;
}

/**
 * Signs the browser in silently and swaps its Firebase ID token for a session
 * cookie whenever the server has none (first visit, expired or cleared
 * cookie). Renders nothing; there is no sign-in screen.
 */
export function SessionBootstrap({ hasSession }: { hasSession: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (hasSession) return;
    let cancelled = false;
    exchange ??= exchangeToken().finally(() => {
      exchange = null;
    });
    exchange
      .then((ok) => {
        if (ok && !cancelled) router.refresh();
      })
      .catch(() => {
        // Offline or Firebase unreachable: the next load tries again.
      });
    return () => {
      cancelled = true;
    };
  }, [hasSession, router]);

  return null;
}
