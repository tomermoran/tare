"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Notice } from "@/components/ui/Notice/Notice";
import { SwitchSheet } from "./SwitchSheet";
import { useGoogleLink, type GoogleLinkDeps, type LinkStatus } from "./useGoogleLink";

/** Marks a switch for Brew to announce after the full reload (`switch.done`). */
export const SWITCHED_FLAG = "tare:switchedHistory";

/**
 * One place for the link-or-switch flow and what it says: the trigger is
 * the caller's (a button in Profile, a link on first-run Brew, the reminder
 * Card), drawn by `children`; the failure or "already has a history" Notice
 * goes under it, and SH-SWITCH opens when switching is possible.
 */
/** After a switch: note it for Brew, then a full reload so every page reads the other history (DES-05-03-02). */
function reloadToBrew() {
  try {
    sessionStorage.setItem(SWITCHED_FLAG, "1");
  } catch {
    // No storage: the history shows without the note.
  }
  // A full reload on purpose: router.push would keep client state from the old history.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/");
}

export function GoogleLink({
  deps,
  onLinked,
  onSwitched = reloadToBrew,
  children,
}: {
  deps: GoogleLinkDeps;
  onLinked: () => void;
  onSwitched?: () => void;
  children: (link: { start: () => void; status: LinkStatus }) => ReactNode;
}) {
  const t = useTranslations();
  const { status, start, switchState } = useGoogleLink(deps, {
    linked: onLinked,
    switched: onSwitched,
  });

  return (
    <>
      {children({ start, status })}
      {status === "failed" && (
        <Notice urgent action={{ label: t("actions.retry"), onClick: start }}>
          {t("profile.linkFailed")}
        </Notice>
      )}
      {status === "taken" && <Notice urgent>{t("profile.linkTaken")}</Notice>}
      <SwitchSheet
        open={switchState.open}
        busy={switchState.busy}
        failed={switchState.failed}
        onConfirm={switchState.confirm}
        onCancel={switchState.cancel}
        labels={{
          title: t("switch.title"),
          body: t("switch.body"),
          confirm: t("switch.confirm"),
          cancel: t("actions.cancel"),
          close: t("actions.close"),
          failed: t("switch.failed"),
          retry: t("actions.retry"),
        }}
      />
    </>
  );
}
