"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TasteScreen } from "@/components/screens/TasteScreen/TasteScreen";
import type { ShotValuesData } from "@/components/ui/ShotValues/ShotValues";
import type { TasteTag } from "@/domain/taste";
import type { Tasting } from "@/domain/tasting";
import { saveTastingAction } from "@/server/actions/shots";
import { TasteQuestions } from "./TasteQuestions";
import { TasteTags } from "./TasteTags";
import { useTasteLabels } from "./useTasteLabels";

/*
 * SCR-TASTE, wired (STORY-01-05-01 AC 3, AC 4). Leaving saves: Done, close
 * and the system back gesture all save what changed first, with no prompt,
 * and with nothing changed there's no request. A failed save keeps the
 * screen and the choices, with retry and "leave without saving tasting".
 * Back is caught with one extra history entry while there are choices.
 */

export type TasteAnswers = {
  rating: number | null;
  balance: number | null;
  strength: number | null;
  body: number | null;
  sweetness: number | null;
  tags: TasteTag[];
};

/** Only what differs from what the shot already had. */
function changes(from: TasteAnswers, to: TasteAnswers): Tasting {
  const out: Tasting = {};
  for (const key of ["rating", "balance", "strength", "body", "sweetness"] as const) {
    if (to[key] !== from[key]) out[key] = to[key];
  }
  if (to.tags.join() !== from.tags.join()) out.tags = to.tags;
  return out;
}

export function TasteFlow({
  shotId,
  values,
  milkDrink,
  initial,
  leaveTo,
}: {
  shotId: string;
  values: ShotValuesData;
  milkDrink: boolean;
  initial: TasteAnswers;
  /** Where Done and close go. */
  leaveTo: string;
}) {
  const t = useTranslations();
  const words = useTasteLabels(milkDrink);
  const router = useRouter();
  const [answers, setAnswers] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const pending = useRef<() => void>(() => {});
  const guarded = useRef(false);
  const leaving = useRef(false);

  const tasting = changes(initial, answers);
  const dirty = Object.keys(tasting).length > 0;
  const toLeaveTo = () => {
    router.replace(leaveTo);
    router.refresh();
  };

  // Drops the back guard first, so the next page replaces this one.
  const leave = (go: () => void) => {
    leaving.current = true;
    if (!guarded.current) return go();
    guarded.current = false;
    window.addEventListener("popstate", () => go(), { once: true });
    window.history.back();
  };

  const saveThen = async (go: () => void) => {
    pending.current = go;
    if (!dirty) return leave(go);
    setState("saving");
    const result = await saveTastingAction(shotId, tasting);
    if (result.ok) return leave(go);
    // The shot itself is saved; keep the choices and let the user decide.
    if (!guarded.current) {
      window.history.pushState(null, "", window.location.href);
      guarded.current = true;
    }
    setState("failed");
  };

  // The system back gesture saves too: one guard entry while there are choices.
  const latest = useRef(saveThen);
  useEffect(() => {
    latest.current = saveThen;
  });
  useEffect(() => {
    if (!dirty) return;
    if (!guarded.current) {
      window.history.pushState(null, "", window.location.href);
      guarded.current = true;
    }
    const onPopState = () => {
      if (leaving.current || !guarded.current) return;
      guarded.current = false;
      void latest.current(() => router.back());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [dirty, router]);

  const set = (patch: Partial<TasteAnswers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
    if (state === "failed") setState("idle");
  };

  return (
    <TasteScreen
      labels={{
        title: t("taste.title"),
        close: t("actions.close"),
        rating: t("taste.rating"),
        saveFailed: t("taste.saveFailed"),
        retry: t("actions.retry"),
        leaveWithout: t("taste.leaveWithout"),
      }}
      values={values}
      rating={answers.rating}
      onRatingChange={(rating) => set({ rating })}
      questions={<TasteQuestions labels={words.questions} value={answers} onChange={set} />}
      tags={<TasteTags labels={words} value={answers.tags} onChange={(tags) => set({ tags })} />}
      primary={{ label: t("taste.done"), onClick: () => void saveThen(toLeaveTo) }}
      state={state}
      onClose={() => void saveThen(toLeaveTo)}
      onRetry={() => void saveThen(pending.current)}
      onLeaveWithout={() => leave(pending.current)}
    />
  );
}
