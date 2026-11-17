import { completeLinkRedirect, linkGoogle, switchToHistory } from "@/lib/firebase/google";
import { canSwitchHistoryAction } from "@/server/actions/account";
import type { GoogleLinkDeps } from "./useGoogleLink";

/** The real link-or-switch flow: Firebase in the browser, the server for the empty check. */
export const googleLinkDeps: GoogleLinkDeps = {
  link: () => linkGoogle(),
  completeRedirect: completeLinkRedirect,
  canSwitch: async () => {
    const result = await canSwitchHistoryAction();
    return result.ok ? result.data : null;
  },
  switchTo: switchToHistory,
};
