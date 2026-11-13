/*
 * Where fixing or dialling in goes (STORY-02-03-02, 03, 07). `suggested` is
 * the shot whose suggestion the log starts with applied: the log works it
 * out again from that shot's saved answers, so nothing travels in the URL
 * but IDs.
 */
export const fixHref = (shotId: string, suggested = false) =>
  `/log?${new URLSearchParams({ mode: "fix", shotId, ...(suggested && { suggested: shotId }) })}`;

/**
 * Dial in from a past shot (SCR-SHOT "dial in from this"), on a bag of its
 * coffee when one was chosen; `suggested` applies its suggestion (SCR-TASTE
 * "dial in with this change").
 */
export const dialInFromShotHref = (shotId: string, opts: { suggested?: boolean; portionId?: string } = {}) =>
  `/log?${new URLSearchParams({
    mode: "dialIn",
    fromShot: shotId,
    ...(opts.suggested && { suggested: shotId }),
    ...(opts.portionId && { portionId: opts.portionId }),
  })}`;

/** Dial in from Brew's recipe, with a pending suggestion when one isn't dismissed. */
export const dialInHref = (key: { drinkId: string; beanId: string; portionId?: string | null; suggested?: string | null }) =>
  `/log?${new URLSearchParams({
    mode: "dialIn",
    drinkId: key.drinkId,
    beanId: key.beanId,
    ...(key.portionId && { portionId: key.portionId }),
    ...(key.suggested && { suggested: key.suggested }),
  })}`;
