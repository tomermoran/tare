"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ShotWarnings } from "@/components/shot/ShotWarnings";
import { useLiveSuggestion } from "@/components/suggest/useLiveSuggestion";
import { TasteQuestions, type TasteAnswerValues } from "@/components/taste/TasteQuestions";
import { TasteTags } from "@/components/taste/TasteTags";
import { useTasteLabels } from "@/components/taste/useTasteLabels";
import { SuggestionCard } from "@/components/ui/SuggestionCard/SuggestionCard";
import { shotWarnings } from "@/domain/shotWarnings";
import type { TasteTag } from "@/domain/taste";
import type { Tasting } from "@/domain/tasting";
import { dismissSuggestion } from "@/lib/dismissals";
import { fixHref } from "@/lib/fixRoutes";
import { partHref } from "@/lib/setupRoutes";
import { saveOffAnswersAction } from "@/server/actions/reaction";
import type { OffContext } from "@/server/dal/reaction";
import { OffSheet } from "./OffSheet";

type Answers = TasteAnswerValues & { tags: TasteTag[] };

function changes(from: Answers, to: Answers): Omit<Tasting, "rating"> {
  const out: Omit<Tasting, "rating"> = {};
  for (const key of ["balance", "strength", "body", "sweetness"] as const) if (to[key] !== from[key]) out[key] = to[key];
  if (to.tags.join() !== from.tags.join()) out.tags = to.tags;
  return out;
}

/**
 * SH-OFF wired (STORY-02-03-04): the answers save on the one-tap shot on
 * every way out, with nothing sent when nothing changed. "Fix it" or "dial
 * in with this change" opens the fix log once saved; a failed save keeps the
 * sheet with retry, and "skip" opens the fix from the recipe whatever
 * happened (AC 6).
 */
export function OffFlow({ shotId, context, onClose }: { shotId: string; context: OffContext; onClose: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  const milkDrink = context.suggest.shot.milkDrink;
  const words = useTasteLabels(milkDrink);
  const initial: Answers = { ...context.answers, tags: context.tags };
  const [answers, setAnswers] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const [retry, setRetry] = useState<() => void>(() => () => {});
  const [dismissed, setDismissed] = useState(false);
  const { grinderPartId, ...suggestContext } = context.suggest;
  const card = useLiveSuggestion(suggestContext, answers, answers.tags);
  const suggesting = !!card?.change && !dismissed;

  const saveThen = async (go: () => void, always = false) => {
    const tasting = changes(saved, answers);
    if (!Object.keys(tasting).length) return go();
    setState("saving");
    const result = await saveOffAnswersAction(shotId, tasting);
    if (result.ok) {
      setSaved(answers);
      setState("idle");
      return go();
    }
    setState("failed");
    setRetry(() => () => void saveThen(go, always));
    if (always) go();
  };

  const set = (patch: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
    if (state === "failed") setState("idle");
  };

  const directionHref = grinderPartId ? `${partHref(grinderPartId)}?${new URLSearchParams({ returnTo: "/" })}` : null;
  return (
    <OffSheet
      open
      onClose={() => void saveThen(onClose)}
      labels={{ title: t("off.title"), close: t("actions.close"), skip: t("off.skip"), saveFailed: t("off.saveFailed"), retry: t("actions.retry") }}
      questions={<TasteQuestions labels={words.questions} value={answers} onChange={set} />}
      tags={<TasteTags labels={words} value={answers.tags} onChange={(tags) => set({ tags })} />}
      warning={<ShotWarnings warnings={shotWarnings(answers.tags)} labels={{ channelling: t("shot.warnings.channelling") }} />}
      suggestion={
        card &&
        !dismissed && (
          <SuggestionCard
            labels={{ title: t("suggest.title"), dismiss: t("suggest.dismiss"), to: t("suggest.to") }}
            change={card.change}
            values={card.values}
            reason={card.reason}
            freshness={card.freshness}
            link={card.askDirection && directionHref ? { label: t("suggest.directionUnknown"), href: directionHref } : undefined}
            onDismiss={() => {
              dismissSuggestion(shotId);
              setDismissed(true);
            }}
          />
        )
      }
      primary={{
        label: suggesting ? t("suggest.tryIt") : t("off.fix"),
        onClick: () => void saveThen(() => router.push(fixHref(shotId, suggesting))),
      }}
      onSkip={() => void saveThen(() => router.push(fixHref(shotId)), true)}
      state={state}
      onRetry={retry}
    />
  );
}
