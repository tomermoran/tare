"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { StartScreen, type StartState } from "@/components/screens/StartScreen/StartScreen";
import { startSession } from "./startSession";

/**
 * Shown instead of the app when there's no session (first open, or a cleared
 * or expired cookie): starts one behind the start screen, then refreshes so
 * the server renders the app. Slow after 3 seconds; on failure, retry.
 */
/** The app shell's id, made inert while the gate covers it. */
export const APP_SHELL_ID = "app-shell";

export function StartGate() {
  const router = useRouter();

  useEffect(() => {
    const shell = document.getElementById(APP_SHELL_ID);
    shell?.setAttribute("inert", "");
    return () => shell?.removeAttribute("inert");
  }, []);

  return (
    <div className="fixed inset-0 z-10 bg-paper">
      <StartFlow start={startSession} onStarted={router.refresh} />
    </div>
  );
}

/** The gate without the router, so stories and tests can drive it. */
export function StartFlow({
  start,
  onStarted,
  slowAfterMs = 3000,
}: {
  start: () => Promise<void>;
  onStarted: () => void;
  slowAfterMs?: number;
}) {
  const t = useTranslations();
  const [state, setState] = useState<StartState>("starting");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const slow = setTimeout(() => setState("slow"), slowAfterMs);
    start()
      .then(() => {
        if (!cancelled) onStarted();
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      })
      .finally(() => clearTimeout(slow));
    return () => {
      cancelled = true;
      clearTimeout(slow);
    };
  }, [attempt, start, onStarted, slowAfterMs]);

  const retry = useCallback(() => {
    setState("starting");
    setAttempt((n) => n + 1);
  }, []);

  return (
    <StartScreen
      state={state}
      wordmark={t("app.wordmark")}
      slow={t("start.slow")}
      failedTitle={t("start.failedTitle")}
      failed={t("start.failed")}
      retryLabel={t("actions.retry")}
      onRetry={retry}
    />
  );
}
