import { getIdToken } from "@/lib/firebase/client";

// One exchange at a time per page load, even when React runs effects twice
// in development; cleared when it settles so a retry starts a fresh one.
let pending: Promise<void> | null = null;

async function exchange() {
  const idToken = await getIdToken();
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error(`Session exchange failed: ${res.status}`);
}

/**
 * Signs this browser in silently and swaps its Firebase ID token for the
 * session cookie. Throws when offline or when Firebase or the server fails.
 */
export function startSession(): Promise<void> {
  pending ??= exchange().finally(() => {
    pending = null;
  });
  return pending;
}
