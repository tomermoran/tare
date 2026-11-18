"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { JOINED_FLAG } from "@/components/home/SwitchedNote";
import { JoinScreen, type JoinView } from "@/components/screens/JoinScreen/JoinScreen";
import { checkJoinableAction, claimInviteAction } from "@/server/actions/joining";

/** Set across Google's redirect, so the return finishes signing in. */
const REDIRECT_FLAG = "tare:joinRedirect";

type Landing = Extract<JoinView, { kind: "landing" }>;

/**
 * SCR-JOIN wired (STORY-05-02-02, 05-02-03). Sign-in loads Firebase only
 * when chosen, then asks the server whether this account can join; the
 * claim confirmation follows, and nothing changes until it is confirmed.
 * Cancelling Google, or the claim, goes back to the landing with the link
 * still usable. A claim lands on Brew, which says so once.
 */
export function JoinFlow({ token, view: initial, name = "" }: { token: string; view: JoinView; name?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [view, setView] = useState<JoinView>(initial);
  const landing: Landing = initial.kind === "landing" ? initial : { kind: "landing", summary: { title: "", lines: [] } };

  const claim = {
    title: t("claim.title", { name }),
    lines: [t("claim.becomesYours"), t("claim.othersBrew")],
    consent: t("claim.consent"),
    confirm: t("claim.confirm"),
    cancel: t("claim.cancel"),
    final: t("claim.final"),
  };

  const afterSignIn = async () => {
    const result = await checkJoinableAction(token);
    if (!result.ok) return setView(result.error === "invalid" ? { kind: "invalid" } : { ...landing, failure: t("join.failed") });
    if (result.data === "invalid") return setView({ kind: "invalid" });
    if (result.data === "hasHistory") return setView({ ...landing, blocked: t("join.hasHistory") });
    setView({ kind: "confirm", claim });
  };

  // Back from Google's redirect (iOS): finish signing in. Firebase loads only if one was started.
  useEffect(() => {
    let started = false;
    try {
      started = sessionStorage.getItem(REDIRECT_FLAG) === token;
      if (started) sessionStorage.removeItem(REDIRECT_FLAG);
    } catch {
      // No storage: nothing was started here.
    }
    if (!started) return;
    void (async () => {
      setView((v) => (v.kind === "landing" ? { ...v, busy: true, failure: undefined } : v));
      const { completeJoinRedirect } = await import("@/lib/firebase/googleJoin");
      const result = await completeJoinRedirect();
      if (result?.kind === "signedIn") return afterSignIn();
      setView(result?.kind === "failed" ? { ...landing, failure: t("join.failed") } : landing);
    })();
    // Runs once on return; afterSignIn reads the token it was rendered with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async () => {
    setView({ ...landing, busy: true });
    const { prefersRedirect } = await import("@/lib/firebase/google");
    const { signInForJoining } = await import("@/lib/firebase/googleJoin");
    if (prefersRedirect()) {
      try {
        sessionStorage.setItem(REDIRECT_FLAG, token);
      } catch {
        // Without storage the return can't finish; the person can try again.
      }
    }
    const result = await signInForJoining();
    if (result.kind === "redirecting") return;
    if (result.kind === "cancelled") return setView(landing);
    if (result.kind === "failed") return setView({ ...landing, failure: t("join.failed") });
    await afterSignIn();
  };

  const confirm = async () => {
    setView({ kind: "confirm", claim, busy: true });
    const result = await claimInviteAction(token);
    if (result.ok) {
      try {
        sessionStorage.setItem(JOINED_FLAG, "1");
      } catch {
        // No storage: Brew just won't say it.
      }
      router.replace("/");
      router.refresh();
      return;
    }
    if (result.error === "invalid") return setView({ kind: "invalid" });
    if (result.error === "hasHistory") return setView({ ...landing, blocked: t("join.hasHistory") });
    setView({ kind: "confirm", claim, failure: t("join.failed") });
  };

  const notNow = () => {
    // Leave as it came; the link stays usable.
    if (window.history.length > 1) window.history.back();
    else window.close();
  };

  return (
    <JoinScreen
      view={view}
      homeHref="/"
      labels={{
        wordmark: t("app.wordmark"),
        title: t("join.title"),
        sharesIntro: t("join.sharesIntro"),
        shares: [t("join.shares.signIn"), t("join.shares.takeOver"), t("join.shares.household")],
        signIn: t("join.signIn"),
        notNow: t("join.notNow"),
        loading: t("join.loading"),
        invalidTitle: t("join.invalidTitle"),
        invalid: t("join.invalid"),
        openTare: t("join.openTare"),
        retry: t("actions.retry"),
      }}
      onSignIn={() => void signIn()}
      onNotNow={notNow}
      onConfirm={() => void confirm()}
      onCancel={() => setView(landing)}
    />
  );
}
