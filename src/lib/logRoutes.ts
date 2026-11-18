/** The shot log's route, shared by Brew, the log and its side tasks. */
export const LOG_PATH = "/log";
/** Where a side task from the log comes back to, with the draft restored. */
export const LOG_RESUME = "/log?resume=1";

/** SCR-LOG re-dialling one coffee after a grinder was serviced (STORY-04-03-04 AC 5). */
export const redialHref = (eventId: string, recipeId: string) => `${LOG_PATH}?${new URLSearchParams({ mode: "dialIn", redial: eventId, recipeId })}`;
