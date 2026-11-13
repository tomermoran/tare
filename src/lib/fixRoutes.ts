/*
 * Where fixing a one-tap shot goes (STORY-02-03-02): the shot log in fix
 * mode from the shot's recipe. With `suggested`, the log works out the
 * suggestion from the shot's saved answers and starts with it applied.
 */
export const fixHref = (shotId: string, suggested = false) =>
  `/log?${new URLSearchParams({ mode: "fix", shotId, ...(suggested && { suggested: "1" }) })}`;
