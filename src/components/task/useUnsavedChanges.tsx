"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ConfirmSheet } from "@/components/ui/Sheet/ConfirmSheet";

/**
 * Guards a full-screen task with unsaved changes (STORY-01-01-05 AC 3).
 * Clean: leaving is immediate. Dirty: Cancel, the back button or gesture,
 * and closing the tab all ask once (SH-CONFIRM for the first two, the
 * browser's own prompt for the last). After "Discard" it leaves without
 * asking again.
 *
 * Back is caught with one extra history entry on top while dirty; popping
 * it asks instead of leaving, and a discard then goes back past it.
 *
 * Returns `leave`, for the task's Cancel button, and the `confirm` sheet to
 * render once in the task.
 */
export function useUnsavedChanges(
  isDirty: boolean,
  /** Where Cancel goes, e.g. back to where the task was opened from. */
  onLeave: () => void,
): { leave: () => void; confirm: ReactNode } {
  const t = useTranslations();
  const [asking, setAsking] = useState<null | "cancel" | "back">(null);
  const leaving = useRef(false);
  const guarded = useRef(false);

  // Closing or reloading the tab: only the browser's own prompt is allowed.
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (leaving.current) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // Back: keep one guard entry on top while dirty.
  useEffect(() => {
    if (!isDirty) return;
    if (!guarded.current) {
      window.history.pushState(null, "", window.location.href);
      guarded.current = true;
    }
    const onPopState = () => {
      if (leaving.current) return;
      // The guard entry was popped: put it back and ask.
      window.history.pushState(null, "", window.location.href);
      setAsking("back");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isDirty]);

  const leave = useCallback(() => {
    if (isDirty) setAsking("cancel");
    else onLeave();
  }, [isDirty, onLeave]);

  const discard = useCallback(() => {
    leaving.current = true;
    const via = asking;
    setAsking(null);
    if (!guarded.current) {
      onLeave();
      return;
    }
    guarded.current = false;
    if (via === "back") {
      // Past the guard entry and the task itself.
      window.history.go(-2);
    } else {
      // Drop the guard entry first, so onLeave (often router.back) starts
      // from the task's own entry.
      window.addEventListener("popstate", () => onLeave(), { once: true });
      window.history.back();
    }
  }, [asking, onLeave]);

  const confirm = (
    <ConfirmSheet
      open={asking !== null}
      title={t("confirm.discardTitle")}
      confirmLabel={t("actions.discard")}
      cancelLabel={t("actions.keepEditing")}
      closeLabel={t("actions.close")}
      onConfirm={discard}
      onCancel={() => setAsking(null)}
    >
      {t("confirm.discard")}
    </ConfirmSheet>
  );

  return { leave, confirm };
}
