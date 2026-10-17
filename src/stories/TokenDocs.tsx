"use client";

import { useSyncExternalStore } from "react";

/*
 * Building blocks for the Tokens docs page. Values are read from the CSS
 * variables at runtime, so tokens.css stays the only place they are defined.
 * This is developer documentation, so English copy here is fine.
 */

const noSubscribe = () => () => {};

function useCssVar(name: string) {
  return useSyncExternalStore(
    noSubscribe,
    () =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    () => "",
  );
}

const greySteps = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function GreyScale() {
  return (
    <div className="sb-unstyled grid grid-cols-6 gap-3 sm:grid-cols-12">
      {greySteps.map((step) => (
        <Swatch key={step} token={`--color-grey-${step}`} label={String(step)} />
      ))}
    </div>
  );
}

function Swatch({ token, label }: { token: string; label: string }) {
  const value = useCssVar(token);
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 rounded-md border border-line"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="text-label text-ink">{label}</div>
      <div className="text-overline text-ink-secondary uppercase">{value}</div>
    </div>
  );
}

const semanticColors: { token: string; use: string }[] = [
  { token: "paper", use: "Page background" },
  { token: "surface", use: "Cards" },
  { token: "surface-sunken", use: "Inputs, wheel track" },
  { token: "line", use: "Hairlines" },
  { token: "line-strong", use: "Secondary button, ticks" },
  { token: "ink", use: "Primary text" },
  { token: "ink-secondary", use: "Labels, supporting text" },
  { token: "ink-tertiary", use: "Units; large text only" },
  { token: "ink-disabled", use: "Disabled text" },
  { token: "action", use: "Primary button" },
  { token: "action-hover", use: "Primary button hover" },
  { token: "on-action", use: "Text on primary button" },
  { token: "focus", use: "Keyboard focus ring" },
  { token: "signal", use: "Shot warnings only" },
  { token: "signal-subtle", use: "Shot warning background" },
];

export function SemanticColors() {
  return (
    <div className="sb-unstyled flex flex-col">
      {semanticColors.map(({ token, use }) => (
        <SemanticRow key={token} token={token} use={use} />
      ))}
    </div>
  );
}

function SemanticRow({ token, use }: { token: string; use: string }) {
  const value = useCssVar(`--color-${token}`);
  return (
    <div className="flex items-center gap-4 border-b border-line py-3">
      <div
        className="size-10 shrink-0 rounded-sm border border-line"
        style={{ backgroundColor: `var(--color-${token})` }}
      />
      <code className="w-40 text-label text-ink">{token}</code>
      <span className="flex-1 text-label text-ink-secondary">{use}</span>
      <span className="text-overline text-ink-tertiary uppercase">{value}</span>
    </div>
  );
}

const typeScale: { token: string; className: string; sample: string }[] = [
  { token: "display-xl", className: "text-display-xl", sample: "18.0" },
  { token: "display", className: "text-display", sample: "1:2.1" },
  { token: "h1", className: "text-h1", sample: "Morning shot" },
  { token: "h2", className: "text-h2", sample: "Recent shots" },
  { token: "h3", className: "text-h3", sample: "Ethiopia Guji, washed" },
  {
    token: "body",
    className: "text-body",
    sample: "Slightly sour finish. Grind one step finer.",
  },
  { token: "label", className: "text-label", sample: "Dose in grams" },
  { token: "overline", className: "text-overline uppercase", sample: "Dose" },
];

export function TypeScale() {
  return (
    <div className="sb-unstyled flex flex-col">
      {typeScale.map((row) => (
        <TypeRow key={row.token} {...row} />
      ))}
    </div>
  );
}

function TypeRow({
  token,
  className,
  sample,
}: {
  token: string;
  className: string;
  sample: string;
}) {
  const size = useCssVar(`--text-${token}`);
  const weight = useCssVar(`--text-${token}--font-weight`);
  const leading = useCssVar(`--text-${token}--line-height`);
  const px = size.endsWith("rem") ? `${parseFloat(size) * 16}px` : size;
  return (
    <div className="flex items-baseline gap-6 border-b border-line py-5">
      <div className="w-32 shrink-0">
        <code className="block text-label text-ink">{token}</code>
        <span className="text-overline text-ink-tertiary">
          {px} · {weight} · {leading}
        </span>
      </div>
      <div className={`${className} min-w-0 truncate text-ink`}>{sample}</div>
    </div>
  );
}

const spacingSteps = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];

export function SpacingScale() {
  return (
    <div className="sb-unstyled flex flex-col gap-3">
      {spacingSteps.map((step) => (
        <div key={step} className="flex items-center gap-4">
          <code className="w-12 text-label text-ink">{step}</code>
          <span className="w-14 text-overline text-ink-tertiary">
            {step * 4}px
          </span>
          <div
            className="h-3 rounded-sm bg-ink"
            style={{ width: `calc(var(--spacing) * ${step})` }}
          />
        </div>
      ))}
    </div>
  );
}

const radii = ["sm", "md", "lg", "full"] as const;

export function RadiusScale() {
  return (
    <div className="sb-unstyled flex flex-wrap gap-6">
      {radii.map((radius) => (
        <RadiusSwatch key={radius} radius={radius} />
      ))}
    </div>
  );
}

function RadiusSwatch({ radius }: { radius: (typeof radii)[number] }) {
  const value = useCssVar(`--radius-${radius}`);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="size-20 border border-line-strong bg-surface"
        style={{
          borderRadius: radius === "full" ? "9999px" : `var(--radius-${radius})`,
        }}
      />
      <code className="text-label text-ink">{radius}</code>
      <span className="text-overline text-ink-tertiary">
        {radius === "full" ? "pill" : value}
      </span>
    </div>
  );
}
