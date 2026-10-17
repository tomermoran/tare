import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type CardProps = ComponentProps<"div"> & {
  /** surface: filled, the default. outline: paper with a hairline, for nesting on a surface. */
  tone?: "surface" | "outline";
  padding?: "md" | "lg";
};

export function Card({
  tone = "surface",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cx(
        "rounded-lg",
        tone === "surface" ? "bg-surface" : "border border-line bg-paper",
        padding === "md" ? "p-6" : "p-8",
        className,
      )}
      {...props}
    />
  );
}
