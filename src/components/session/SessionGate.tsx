import { getSession } from "@/server/auth/session";
import { StartGate } from "./StartGate";

/**
 * Shows the start gate when there's no session. Reads the session cookie, so
 * it sits inside its own Suspense boundary, beside the app rather than
 * around it.
 */
export async function SessionGate() {
  const session = await getSession();
  return session ? null : <StartGate />;
}
