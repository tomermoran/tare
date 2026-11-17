"use client";

import { useRouter } from "next/navigation";
import { googleLinkDeps } from "@/components/account/googleLinkDeps";
import { FirstRunSignIn } from "./FirstRunSignIn";

/** First-run Brew's sign-in link with the real Firebase flow (server components can't pass functions). */
export function FirstRunSignInLive({ label }: { label: string }) {
  const router = useRouter();
  return <FirstRunSignIn label={label} deps={googleLinkDeps} onLinked={() => router.refresh()} />;
}
