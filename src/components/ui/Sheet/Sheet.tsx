"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cx } from "@/lib/cx";
import { Icon } from "../Icon/Icon";

/*
 * Sheet (NC-05): a bottom sheet on phones and a centred dialog on wide
 * screens, for short choices and confirmations. Built on the native modal
 * <dialog>, so the page behind is inert. Tab wraps inside the sheet,
 * Escape, the scrim and a swipe down all close it, and focus goes back to
 * whatever opened it. Under reduced motion it appears without sliding.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** How far, in px, a swipe down has to travel to close the sheet. */
const SWIPE_CLOSE = 80;

export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
}: {
  open: boolean;
  /** Called on Escape, the close button, the scrim or a swipe down. */
  onClose: () => void;
  title: string;
  /** Accessible name of the close button, e.g. "Close". */
  closeLabel: string;
  children?: ReactNode;
  /** Actions pinned under the content. One primary button at most. */
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dragStart = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Closing by any route (including unmounting while open) returns focus.
  useEffect(() => () => opener.current?.focus(), []);

  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "Escape") {
      // Handled here so the native cancel doesn't also fire.
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function startDrag(e: PointerEvent<HTMLDivElement>) {
    if (e.target instanceof Element && e.target.closest("button")) return;
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function moveDrag(e: PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    setDrag(Math.max(0, e.clientY - dragStart.current));
  }

  function endDrag() {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (drag > SWIPE_CLOSE) onClose();
    setDrag(0);
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Fallback for a cancel the keydown didn't catch (e.g. the Android
        // back gesture): stay controlled; the parent decides.
        e.preventDefault();
        onClose();
      }}
      onClose={() => opener.current?.focus()}
      onClick={(e) => {
        // A click on the dialog box itself, not its content, is the scrim.
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      style={drag ? { transform: `translateY(${drag}px)` } : undefined}
      className={cx(
        "m-0 mt-auto flex max-h-[85dvh] w-full max-w-full flex-col p-0",
        "rounded-t-lg border-t border-line bg-paper text-ink",
        "sm:m-auto sm:max-w-md sm:rounded-lg sm:border",
        "[&:not([open])]:hidden",
        "backdrop:bg-ink/30",
        "transition-[translate,opacity] duration-300 starting:translate-y-full sm:starting:translate-y-4 starting:opacity-0",
        "motion-reduce:transition-none",
        drag > 0 && "transition-none",
      )}
    >
      <div
        className="flex shrink-0 cursor-grab touch-none flex-col px-6 pt-2"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-surface-sunken sm:hidden" />
        <div className="flex items-center justify-between gap-4 pt-4 pb-2">
          <h2 id={titleId} className="text-h3">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-me-2 inline-flex size-10 items-center justify-center rounded-md text-ink-secondary hover:bg-surface"
          >
            <Icon name="close" label={closeLabel} />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 text-body">{children}</div>
      {footer && (
        <div className="flex shrink-0 flex-col gap-2 border-t border-line px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </dialog>
  );
}
