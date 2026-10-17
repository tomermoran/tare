import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type ButtonProps = ComponentProps<"button"> & {
  /** primary: one per view. secondary: the default for everything else. ghost: low emphasis. */
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-action text-on-action hover:bg-action-hover disabled:bg-surface-sunken disabled:text-ink-disabled",
  secondary:
    "border border-line-strong text-ink hover:bg-surface disabled:border-line disabled:text-ink-disabled",
  ghost: "text-ink hover:bg-surface disabled:text-ink-disabled",
};

const sizes = {
  md: "h-12 px-6 text-body",
  sm: "h-10 px-4 text-label",
};

export function Button({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap",
        "transition-colors disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
