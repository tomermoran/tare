import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * `signal` is only for shot warnings (CLAUDE.md, STORY-01-01-06 AC 4), and
 * the only component that renders it is Notice's warning tone. Any other
 * use of a signal colour class fails here, so a neutral state, a form error
 * or a failure can never turn red by accident.
 */

const ROOT = join(__dirname, "../../..");
const SRC = join(ROOT, "src");

/** Where signal may appear: the component, the tokens and the token docs. */
const ALLOWED = new Set([
  "src/components/ui/Notice/Notice.tsx",
  "src/styles/tokens.css",
  "src/stories/TokenDocs.tsx",
]);

// A Tailwind class or CSS variable that paints with signal.
const SIGNAL_CLASS =
  /\b(?:text|bg|border|border-[trblxyse]|ring|outline|fill|stroke|decoration|divide|from|via|to|shadow|caret|accent)-signal(?:-subtle)?\b|--color-signal/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|css|mdx)$/.test(name) ? [path] : [];
  });
}

describe("the signal rule", () => {
  it("finds signal classes only in Notice, the tokens and their docs", () => {
    const offenders = files(SRC)
      .map((path) => relative(ROOT, path))
      .filter((path) => !ALLOWED.has(path) && path !== "src/lib/__tests__/signal-rule.test.ts")
      .flatMap((path) =>
        readFileSync(join(ROOT, path), "utf8")
          .split("\n")
          .map((line, i) => ({ path, line: i + 1, text: line.trim() }))
          .filter(({ text }) => SIGNAL_CLASS.test(text)),
      )
      .map(({ path, line, text }) => `${path}:${line}  ${text}`);
    expect(offenders).toEqual([]);
  });

  it("catches a signal class (the pattern isn't vacuous)", () => {
    expect(SIGNAL_CLASS.test('className="text-signal"')).toBe(true);
    expect(SIGNAL_CLASS.test('className="bg-signal-subtle"')).toBe(true);
    expect(SIGNAL_CLASS.test("// signal is reserved for shot warnings")).toBe(false);
  });
});
