/**
 * Calendar days in the user's time zone. Timestamps are stored in UTC; "today",
 * "opened today" and the Journal's day headings use these helpers so midnight
 * and daylight-saving changes fall on the right side (R-05). `timeZone` is an
 * IANA name such as "Europe/London".
 */

/** The wall-clock parts of an instant in a zone. */
function parts(at: Date, timeZone: string) {
  const fields = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const get = (type: string) =>
    Number(fields.find((f) => f.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** How far the zone's wall clock is ahead of UTC at an instant, in ms. */
function offsetMs(at: Date, timeZone: string) {
  const p = parts(at, timeZone);
  const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wall - Math.floor(at.getTime() / 1000) * 1000;
}

/** The instant a wall-clock time happens in the zone (the earlier one in a fold). */
function zonedInstant(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
) {
  const wall = Date.UTC(year, month - 1, day, hour);
  // Two passes settle the offset, also across a daylight-saving change.
  let at = new Date(wall - offsetMs(new Date(wall), timeZone));
  at = new Date(wall - offsetMs(at, timeZone));
  return at;
}

/** The local calendar day of an instant, as "YYYY-MM-DD". */
export function localDayKey(at: Date, timeZone: string): string {
  const { year, month, day } = parts(at, timeZone);
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

/** The first instant of the local day an instant falls in. */
export function startOfLocalDay(at: Date, timeZone: string): Date {
  const { year, month, day } = parts(at, timeZone);
  const start = zonedInstant(timeZone, year, month, day, 0);
  // Where midnight is skipped by a daylight-saving change, the day starts at
  // the first instant that belongs to it.
  return localDayKey(start, timeZone) === localDayKey(at, timeZone)
    ? start
    : zonedInstant(timeZone, year, month, day, 1);
}

/**
 * Noon on a local day ("YYYY-MM-DD"), as an instant. Dates the user picks
 * without a time (a roast date) are stored at local noon, which no
 * daylight-saving change can push into another day.
 */
export function localNoon(dayKey: string, timeZone: string): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  return zonedInstant(timeZone, year, month, day, 12);
}

/** A real calendar day written YYYY-MM-DD, as a date input gives it. */
export function isValidDayKey(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const [year, month, day] = m.slice(1).map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

/** Whole calendar days from one day key to a later one ("YYYY-MM-DD"). */
export function daysBetween(fromKey: string, toKey: string): number {
  const utc = (key: string) => {
    const [year, month, day] = key.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((utc(toKey) - utc(fromKey)) / 86_400_000);
}

/** Minutes since local midnight, by the wall clock (0 to 1439). */
export function localMinuteOfDay(at: Date, timeZone: string): number {
  const { hour, minute } = parts(at, timeZone);
  return hour * 60 + minute;
}
