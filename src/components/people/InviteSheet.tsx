"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Notice } from "@/components/ui/Notice/Notice";
import { Sheet } from "@/components/ui/Sheet/Sheet";

/*
 * SH-INVITE (DES-05-02-01, STORY-05-02-01, 05-02-06): before any link
 * exists, three plain lines of what the person would share, said to the
 * inviter; then the link in a read-only field with copy (and share where
 * the device offers it), how long it works, and that Tare sends nothing.
 * A pending link can be withdrawn. A failure keeps the sheet with a retry.
 * Props only.
 */

export type InviteSheetLabels = {
  title: string;
  close: string;
  sharesIntro: string;
  shares: string[];
  create: string;
  link: string;
  copy: string;
  copied: string;
  share: string;
  sendYourself: string;
  withdraw: string;
  retry: string;
};

export function InviteSheet({
  open,
  onClose,
  labels,
  link,
  valid,
  busy = false,
  failure,
  onCreate,
  onShare,
  onWithdraw,
}: {
  open: boolean;
  onClose: () => void;
  labels: InviteSheetLabels;
  /** The link, once made or when one is pending; null before. */
  link: string | null;
  /** "Works once, until 25 November." */
  valid?: string;
  busy?: boolean;
  /** A failed create or withdraw, with its retry. */
  failure?: { message: string; onRetry: () => void };
  onCreate: () => void;
  /** Only where the device offers sharing (`navigator.share`). */
  onShare?: () => void;
  onWithdraw?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        link ? (
          <div className="flex flex-col gap-2">
            {onShare && (
              <Button variant="primary" fullWidth onClick={onShare}>
                {labels.share}
              </Button>
            )}
            {onWithdraw && (
              <Button variant="ghost" fullWidth onClick={onWithdraw} disabled={busy} aria-busy={busy || undefined}>
                {labels.withdraw}
              </Button>
            )}
          </div>
        ) : (
          <Button variant="primary" fullWidth onClick={onCreate} disabled={busy} aria-busy={busy || undefined}>
            {labels.create}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <p className="text-body text-ink-secondary">{labels.sharesIntro}</p>
          <ul className="flex list-disc flex-col gap-1 ps-5 text-body text-ink">
            {labels.shares.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
        {link && (
          <div className="flex flex-col gap-2">
            <Input
              label={labels.link}
              value={link}
              readOnly
              dir="ltr"
              onFocus={(e) => e.currentTarget.select()}
              end={
                <Button variant="ghost" size="sm" className="-me-3 shrink-0" onClick={() => void copy()}>
                  {labels.copy}
                </Button>
              }
            />
            {valid && <p className="text-label text-ink-secondary">{valid}</p>}
            <p className="text-label text-ink-secondary">{labels.sendYourself}</p>
          </div>
        )}
        {failure && <Notice urgent action={{ label: labels.retry, onClick: failure.onRetry }}>{failure.message}</Notice>}
        <p role="status" className="sr-only">
          {copied ? labels.copied : ""}
        </p>
      </div>
    </Sheet>
  );
}
