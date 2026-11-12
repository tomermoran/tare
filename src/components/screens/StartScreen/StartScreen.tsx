import { LogoWordmark } from "@/components/brand/Logo/Logo";
import { Button } from "@/components/ui/Button/Button";

/*
 * SCR-START: what a first open shows while the account is created behind it.
 * The wordmark alone; after a few seconds a quiet "still setting up" line;
 * on failure a heading, one sentence and retry. Never a sign-in, consent
 * or survey, and nothing of the app until it's ready.
 */

export type StartState = "starting" | "slow" | "failed";

export function StartScreen({
  state,
  wordmark,
  slow,
  failedTitle,
  failed,
  retryLabel,
  onRetry,
}: {
  state: StartState;
  wordmark: string;
  slow: string;
  failedTitle: string;
  failed: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div
      aria-busy={state !== "failed"}
      className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-paper px-6 text-center"
    >
      <h1>
        <LogoWordmark name={wordmark} />
      </h1>
      {/* Always in the tree so screen readers announce the change. */}
      <div role="status" className="min-h-7 text-body text-ink-secondary">
        {state === "slow" && slow}
      </div>
      {state === "failed" && (
        <div role="alert" className="flex max-w-[32ch] flex-col items-center gap-3">
          <h2 className="text-h3 text-ink">{failedTitle}</h2>
          <p className="text-body text-ink-secondary">{failed}</p>
          <Button variant="primary" className="mt-5" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
