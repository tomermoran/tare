"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChipGroup } from "@/components/ui/ChipGroup/ChipGroup";
import { Notice } from "@/components/ui/Notice/Notice";
import type { Reaction } from "@/components/ui/PulledState/PulledState";
import { setReactionAction } from "@/server/actions/reaction";

/**
 * Good and off on a one-tap shot's detail (STORY-02-03-01 AC 4): give or
 * change the reaction later, or tap it again to clear it. A failed save puts
 * the chip back and says so.
 */
export function ReactionChips({ shotId, initial }: { shotId: string; initial: Reaction | null }) {
  const t = useTranslations();
  const router = useRouter();
  const [reaction, setReaction] = useState(initial);
  const [failed, setFailed] = useState(false);

  const choose = async (next: Reaction | null) => {
    const before = reaction;
    setReaction(next);
    setFailed(false);
    const result = await setReactionAction(shotId, next);
    if (!result.ok) {
      setReaction(before);
      setFailed(true);
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      <ChipGroup
        label={t("home.reactionLabel")}
        clearable
        options={[
          { value: "good", label: t("home.reactionGood") },
          { value: "off", label: t("home.reactionOff") },
        ]}
        value={reaction}
        onChange={(v) => void choose(v as Reaction | null)}
      />
      {failed && <Notice>{t("home.reactionFailed")}</Notice>}
    </div>
  );
}
