import type { ComponentProps, CSSProperties } from "react";
import { cx } from "@/lib/cx";

/*
 * The Tare mark: a digit-style zero (the scale's "tare" reset) with a coffee
 * bean's crease running through it. The outer line is about 3x the crease.
 *
 * Geometry lives in a 112 x 160 box. Stroke widths are set in that box's
 * units but never drop below a minimum on-screen width, so the mark stays
 * legible at favicon sizes. Colour comes from `currentColor`: set it with a
 * text-* token class.
 */

const BOX_WIDTH = 112;
const BOX_HEIGHT = 160;
const CORNER = 38;
const OUTER_STROKE = 4.5; // at design size, in box units
const CREASE_RATIO = 3; // outer : crease
const MIN_OUTER_PX = 1.5;
const MIN_CREASE_PX = 0.75;

function strokes(heightPx: number) {
  const unitsPerPx = BOX_HEIGHT / heightPx;
  const outer = Math.max(OUTER_STROKE, MIN_OUTER_PX * unitsPerPx);
  const crease = Math.max(outer / CREASE_RATIO, MIN_CREASE_PX * unitsPerPx);
  return { outer, crease };
}

type LogoMarkProps = Omit<ComponentProps<"svg">, "children"> & {
  /** Height in px. Width follows the mark's 0.7 aspect ratio. */
  size?: number;
  /** Accessible name. Leave out when the mark sits next to visible text. */
  label?: string;
};

export function LogoMark({ size = 64, label, className, ...props }: LogoMarkProps) {
  const { outer, crease } = strokes(size);
  const half = outer / 2;
  const midX = BOX_WIDTH / 2;
  const midY = BOX_HEIGHT / 2;
  return (
    <svg
      viewBox={`0 0 ${BOX_WIDTH} ${BOX_HEIGHT}`}
      height={size}
      width={(size * BOX_WIDTH) / BOX_HEIGHT}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx("shrink-0", className)}
      {...props}
    >
      <rect
        x={half}
        y={half}
        width={BOX_WIDTH - outer}
        height={BOX_HEIGHT - outer}
        rx={CORNER - half}
        strokeWidth={outer}
      />
      <path
        d={`M${midX} ${midY - 59} C ${midX - 20} ${midY - 25}, ${midX + 20} ${midY + 25}, ${midX} ${midY + 59}`}
        strokeWidth={crease}
      />
    </svg>
  );
}

type LogoWordmarkProps = ComponentProps<"span"> & {
  /** The brand name as shown, from `app.wordmark`. */
  name: string;
  /** Height of the mark in px; the type scales with it. */
  size?: number;
};

/** Mark plus the name in Inter Light. The name is real text, so it is the accessible name. */
export function LogoWordmark({ name, size = 48, className, style, ...props }: LogoWordmarkProps) {
  const wordStyle: CSSProperties = {
    fontSize: size * 0.85,
    lineHeight: 1,
    letterSpacing: "0.12em",
  };
  return (
    <span
      className={cx("inline-flex items-center", className)}
      style={{ gap: size * 0.4, ...style }}
      {...props}
    >
      <LogoMark size={size} />
      <span className="font-light" style={wordStyle}>
        {name}
      </span>
    </span>
  );
}

type LogoAppIconProps = Omit<ComponentProps<"span">, "children"> & {
  /** light: charcoal mark on a pale tile. dark: paper mark on charcoal. */
  tone?: "light" | "dark";
  /** Tile size in px. */
  size?: number;
  /** Accessible name, from `app.name`. */
  label: string;
};

/** The mark on a rounded square tile, for the home screen and favicons. */
export function LogoAppIcon({
  tone = "light",
  size = 128,
  label,
  className,
  style,
  ...props
}: LogoAppIconProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cx(
        "inline-flex shrink-0 items-center justify-center",
        tone === "light" ? "bg-surface-sunken text-ink" : "bg-action text-on-action",
        className,
      )}
      style={{ width: size, height: size, borderRadius: size * 0.225, ...style }}
      {...props}
    >
      <LogoMark size={size * 0.64} />
    </span>
  );
}
