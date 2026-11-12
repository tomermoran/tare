/*
 * Side tasks (STORY-01-01-05 AC 4): the shot log opens "add a bag", and
 * finishing it comes back to the log with the new item chosen. The caller
 * passes where to come back to as `?returnTo=`; the side task returns there
 * with `selected=<newId>`, or unchanged when cancelled.
 */

export const RETURN_TO = "returnTo";
export const SELECTED = "selected";

/** Only a path on this site: never another origin (no open redirects). */
export function safeReturnTo(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  try {
    // Resolving against a dummy origin catches tricks like "/\t/evil.com".
    const url = new URL(value, "https://tare.invalid");
    if (url.origin !== "https://tare.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

/** A link to a side task that comes back to `from` when done. */
export function withReturnTo(href: string, from: string): string {
  const url = new URL(href, "https://tare.invalid");
  url.searchParams.set(RETURN_TO, from);
  return `${url.pathname}${url.search}`;
}

/** Where a finished side task goes: back, with the new item chosen. */
export function returnWithSelection(returnTo: string, id: string): string {
  const url = new URL(returnTo, "https://tare.invalid");
  url.searchParams.set(SELECTED, id);
  return `${url.pathname}${url.search}${url.hash}`;
}
