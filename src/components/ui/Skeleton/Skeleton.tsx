import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * Loading placeholders (NC-11): surface-sunken blocks with a slow pulse that
 * stops under reduced motion. No spinners anywhere in the app.
 */

const shapes = {
  /** One line of body text. */
  line: "h-4 w-full",
  /** A screen or card title. */
  title: "h-7 w-2/3",
  /** A large value, like a dose on the shot dial. */
  value: "h-16 w-full",
  /** A full-width button. */
  button: "h-12 w-full rounded-md",
};

export type SkeletonShape = keyof typeof shapes;

export function SkeletonBlock({
  shape = "line",
  className,
}: {
  shape?: SkeletonShape;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cx(
        "rounded-sm bg-surface-sunken",
        "animate-breathe motion-reduce:animate-none",
        shapes[shape],
        className,
      )}
    />
  );
}

/**
 * A loading region: marks itself busy and names what's loading for screen
 * readers, while its blocks stay hidden from them.
 */
export function Skeleton({
  label,
  children,
  className,
}: {
  /** Read out while loading, e.g. "Loading". */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cx("flex flex-col gap-3", className)}
    >
      {children}
    </div>
  );
}

/** SCR-HOME loading: drink title, coffee line, four values, the pull button. */
export function BrewSkeleton({ label }: { label: string }) {
  return (
    <Skeleton label={label} className="gap-4">
      <SkeletonBlock shape="title" />
      <SkeletonBlock shape="line" className="w-1/2" />
      <div className="grid grid-cols-4 gap-3">
        <SkeletonBlock shape="value" />
        <SkeletonBlock shape="value" />
        <SkeletonBlock shape="value" />
        <SkeletonBlock shape="value" />
      </div>
      <SkeletonBlock shape="button" />
    </Skeleton>
  );
}

/** A list tab loading: its title, then rows with a primary and secondary line. */
export function ListSkeleton({ label, rows = 4 }: { label: string; rows?: number }) {
  return (
    <Skeleton label={label}>
      <SkeletonBlock shape="title" className="h-10 w-1/2" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex flex-col gap-2 border-b border-line py-3">
          <SkeletonBlock shape="line" className="w-3/5" />
          <SkeletonBlock shape="line" className="w-2/5" />
        </div>
      ))}
    </Skeleton>
  );
}
