/**
 * Normalises a product link so the same page compares equal however it was
 * copied (S-01: an exact match flags a likely duplicate). Unknown query
 * parameters are kept: on some shops they pick a different product, e.g.
 * Crema's 54 mm basket page tells single, double and triple apart only by
 * `?variant=`. Only parameters known to be tracking are dropped.
 *
 * Returns `host/path?query` without the scheme, or null for anything that
 * isn't an http(s) URL.
 */

/** Tracking parameters, dropped. Prefixes end with "_" or "*". */
const TRACKING = [
  "utm_*",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "fbclid",
  "msclkid",
  "yclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "_ga",
  "_gl",
  "srsltid",
  "ref",
  "ref_src",
  "spm",
  // Shopify search and recommendation tracking.
  "_pos",
  "_sid",
  "_ss",
  "_psq",
  "pr_prod_strat",
  "pr_rec_id",
  "pr_rec_pid",
  "pr_ref_pid",
  "pr_seq",
];

/** First path segments that only pick a region or language: /en-gb/, /uk/. */
const REGION_SEGMENT = /^[a-z]{2}[-_][a-z]{2}$/;
const REGION_CODES = new Set([
  "uk", "us", "gb", "au", "ca", "nz", "ie", "eu", "de", "fr", "it", "es",
  "nl", "be", "at", "ch", "se", "no", "dk", "fi", "pl", "pt", "jp", "kr",
  "il", "en", "he",
]);

function isTracking(name: string) {
  const key = name.toLowerCase();
  return TRACKING.some((t) =>
    t.endsWith("*") ? key.startsWith(t.slice(0, -1)) : key === t,
  );
}

function isRegionSegment(segment: string) {
  const s = segment.toLowerCase();
  return REGION_SEGMENT.test(s) || REGION_CODES.has(s);
}

/** Percent-escapes in one case, so %d7 and %D7 match. */
function upperEscapes(s: string) {
  return s.replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase());
}

export function normalizeUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!url.hostname.includes(".")) return null;

  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, "");

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length > 1 && isRegionSegment(segments[0])) segments.shift();
  const path = upperEscapes(segments.join("/"));

  const params = [...url.searchParams.entries()]
    .filter(([name]) => !isTracking(name))
    .sort(([a, av], [b, bv]) => a.localeCompare(b) || av.localeCompare(bv));
  const query = new URLSearchParams(params).toString();

  return `${host}${path ? `/${path}` : ""}${query ? `?${query}` : ""}`;
}
