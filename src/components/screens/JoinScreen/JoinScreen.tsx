import Link from "next/link";
import { LogoWordmark } from "@/components/brand/Logo/Logo";
import { Button, buttonClass } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Notice } from "@/components/ui/Notice/Notice";
import { SkeletonBlock, Skeleton } from "@/components/ui/Skeleton/Skeleton";

/*
 * SCR-JOIN (DES-05-02-02, 03; STORY-05-02-05, 02, 03): a full screen
 * outside the tabs, reachable signed out. The landing shows the invited
 * profile's history and what joining shares, then sign in with Google or
 * not now; a skeleton card while it loads; one plain "this link no longer
 * works" with no reason; a neutral notice when the person already has
 * history of their own; and, after sign-in, the claim confirmation, which
 * says it is final. Props only.
 */

export type JoinLabels = {
  wordmark: string;
  title: string;
  sharesIntro: string;
  shares: string[];
  signIn: string;
  notNow: string;
  loading: string;
  invalidTitle: string;
  invalid: string;
  openTare: string;
  retry: string;
};

export type ClaimLabels = {
  title: string;
  lines: string[];
  consent: string;
  confirm: string;
  cancel: string;
  final: string;
};

export type JoinView =
  | { kind: "loading" }
  | { kind: "invalid" }
  | {
      kind: "landing";
      /** "Guest's profile", then its lines: shots, drinks, last brewed for. */
      summary: { title: string; lines: string[] };
      busy?: boolean;
      /** Sign-in or joining failed: nothing was joined (STORY-05-02-02 AC 3). */
      failure?: string;
      /** The signed-in account has history of its own (AC 5). */
      blocked?: string;
    }
  | { kind: "confirm"; claim: ClaimLabels; busy?: boolean; failure?: string };

export function JoinScreen({
  view,
  labels,
  homeHref,
  onSignIn,
  onNotNow,
  onConfirm,
  onCancel,
}: {
  view: JoinView;
  labels: JoinLabels;
  homeHref: string;
  onSignIn: () => void;
  onNotNow: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-8 bg-paper px-4 py-12">
      <LogoWordmark name={labels.wordmark} size={32} />
      {view.kind === "loading" && (
        <Skeleton label={labels.loading} className="gap-6">
          <SkeletonBlock shape="title" />
          <div className="flex flex-col gap-3 rounded-lg bg-surface p-6">
            <SkeletonBlock shape="title" />
            <SkeletonBlock />
            <SkeletonBlock className="w-1/2" />
          </div>
          <SkeletonBlock shape="button" />
        </Skeleton>
      )}

      {view.kind === "invalid" && (
        <section className="flex flex-col items-start gap-3 pt-8">
          <h1 className="text-h2 font-light text-ink">{labels.invalidTitle}</h1>
          <p className="text-body text-ink-secondary">{labels.invalid}</p>
          <Link href={homeHref} className={buttonClass({ variant: "secondary" })}>
            {labels.openTare}
          </Link>
        </section>
      )}

      {view.kind === "landing" && (
        <>
          <h1 className="text-h1 font-light text-ink">{labels.title}</h1>
          <Card className="flex flex-col gap-1">
            <h2 className="text-h3 text-ink">{view.summary.title}</h2>
            {view.summary.lines.map((line) => (
              <p key={line} className="text-body text-ink-secondary">
                {line}
              </p>
            ))}
          </Card>
          <section className="flex flex-col gap-2">
            <p className="text-body text-ink-secondary">{labels.sharesIntro}</p>
            <ul className="flex list-disc flex-col gap-1 ps-5 text-body text-ink">
              {labels.shares.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          {view.blocked && <Notice>{view.blocked}</Notice>}
          {view.failure && (
            <Notice urgent action={{ label: labels.retry, onClick: onSignIn }}>
              {view.failure}
            </Notice>
          )}
          <div className="mt-auto flex flex-col gap-2">
            <Button variant="primary" fullWidth onClick={onSignIn} disabled={view.busy} aria-busy={view.busy || undefined}>
              {labels.signIn}
            </Button>
            <Button variant="ghost" fullWidth onClick={onNotNow} disabled={view.busy}>
              {labels.notNow}
            </Button>
          </div>
        </>
      )}

      {view.kind === "confirm" && (
        <>
          <h1 className="text-h1 font-light text-ink">{view.claim.title}</h1>
          <ul className="flex list-disc flex-col gap-1 ps-5 text-body text-ink">
            {view.claim.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="text-body text-ink">{view.claim.consent}</p>
          {view.failure && (
            <Notice urgent action={{ label: labels.retry, onClick: onConfirm }}>
              {view.failure}
            </Notice>
          )}
          <div className="mt-auto flex flex-col gap-2">
            <Button variant="primary" fullWidth onClick={onConfirm} disabled={view.busy} aria-busy={view.busy || undefined}>
              {view.claim.confirm}
            </Button>
            <p className="text-label text-ink-secondary">{view.claim.final}</p>
            <Button variant="ghost" fullWidth onClick={onCancel} disabled={view.busy}>
              {view.claim.cancel}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
