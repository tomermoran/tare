/*
 * What every server action returns: success with its data, or a failure the
 * UI can name. Actions never throw to the client for expected failures, so
 * forms keep their values and say what happened (STORY-01-01-06 AC 3).
 */

/** Each failure maps to a `states.*` message. */
export type ActionError = "saveFailed" | "notFound" | "noSession";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

export function ok(): ActionResult<void>;
export function ok<T>(data: T): ActionResult<T>;
export function ok<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}

export function fail(error: ActionError): { ok: false; error: ActionError } {
  return { ok: false, error };
}

/**
 * Runs an action body and turns thrown errors into a result. The data
 * layer's NotFoundError and NoSessionError are recognised by name, so this
 * file stays importable from client code.
 */
export async function runAction<T>(body: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return ok(await body());
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "NotFoundError") return fail("notFound");
    if (name === "NoSessionError") return fail("noSession");
    console.error(error);
    return fail("saveFailed");
  }
}
