"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createFirstSetupAction } from "@/server/actions/setups";
import { SetupOfferCard } from "./SetupCards";

/**
 * The first-setup offer, wired (STORY-01-02-05). With one of each kind one
 * tap makes the setup; otherwise it opens the builder with the most recent
 * part of each kind chosen. A double tap that finds the setup already made
 * counts as done.
 */
export function SetupOffer({
  title,
  body,
  action,
  parts,
  oneTap,
  builderHref,
  saveFailed,
}: {
  title: string;
  body: string;
  action: string;
  parts: string[];
  oneTap: boolean;
  builderHref: string;
  saveFailed: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const accept = async () => {
    if (!oneTap) {
      router.push(builderHref);
      return;
    }
    setBusy(true);
    setFailed(false);
    const result = await createFirstSetupAction();
    setBusy(false);
    if (!result.ok && result.error !== "missingParts") {
      setFailed(true);
      return;
    }
    // Made (or made by an earlier tap): the refreshed tab shows the setup.
    router.refresh();
  };

  return <SetupOfferCard title={title} body={body} parts={parts} action={action} busy={busy} error={failed ? saveFailed : undefined} onAccept={accept} />;
}
