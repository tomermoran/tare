"use client";

import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { GoogleLink } from "@/components/account/GoogleLink";
import type { GoogleLinkDeps } from "@/components/account/useGoogleLink";
import { dismissForGood, isDismissedForGood } from "@/lib/dismissals";
import { LinkPromptCard } from "./LinkPromptCard";

export const LINK_PROMPT = "linkGoogle";

/**
 * The one-time reminder on Brew (STORY-05-03-03): due comes from the server
 * (a pinned recipe or the tenth shot, not linked) without holding Brew up;
 * "not now" is remembered on this device for good. Accepting runs the same
 * flow as Profile. Brew leaves it out beside a pulled state.
 */
export function LinkPrompt({ due, deps, onLinked }: { due: Promise<boolean>; deps: GoogleLinkDeps; onLinked?: () => void }) {
  const isDue = use(due);
  const t = useTranslations();
  // Hidden until this device's dismissals are read, after hydration.
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the device store on mount
    setHidden(isDismissedForGood(LINK_PROMPT));
  }, []);
  if (!isDue || hidden) return null;
  return (
    <div className="mt-8 flex flex-col gap-4">
      <GoogleLink
        deps={deps}
        onLinked={() => {
          setHidden(true);
          onLinked?.();
        }}
      >
        {({ start, status }) => (
          <LinkPromptCard
            labels={{
              title: t("home.linkPrompt.title"),
              body: t("home.linkPrompt.body"),
              action: t("home.linkPrompt.action"),
              dismiss: t("home.linkPrompt.dismiss"),
            }}
            busy={status === "linking"}
            onLink={start}
            onDismiss={() => {
              dismissForGood(LINK_PROMPT);
              setHidden(true);
            }}
          />
        )}
      </GoogleLink>
    </div>
  );
}
