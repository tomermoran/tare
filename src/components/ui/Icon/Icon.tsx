import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

/*
 * The minimal icon set (NC-14): four strokes drawn like the Logo, with round
 * caps and currentColor, so colour comes from a text-* token class. Icons are
 * decorative by default; pass `label` when one stands alone, e.g. a close
 * button with no visible text. The chevron points to the inline end and
 * back to the inline start; both mirror in right-to-left.
 */

const paths = {
  chevron: "M9 5.5 15.5 12 9 18.5",
  /** Points to the inline start: "back". */
  back: "M15 5.5 8.5 12 15 18.5",
  check: "M5 12.5 10 17.5 19 7",
  plus: "M12 5v14M5 12h14",
  close: "M6.5 6.5l11 11M17.5 6.5l-11 11",
};

export type IconName = keyof typeof paths;

type IconProps = Omit<ComponentProps<"svg">, "children"> & {
  name: IconName;
  /** Size in px. */
  size?: number;
  /** Accessible name. Leave out when the icon sits next to visible text. */
  label?: string;
};

export function Icon({ name, size = 20, label, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx("shrink-0", (name === "chevron" || name === "back") && "rtl:-scale-x-100", className)}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
