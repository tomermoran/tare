"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { ActionError, ActionResult } from "./actionResult";

/**
 * Submits a form to a server action without React's automatic form reset,
 * so a failure keeps every value the user typed (STORY-01-01-06 AC 3). The
 * caller shows `error` with a neutral Notice, `states.<error>`.
 */
export function useActionForm<T>(
  action: (data: FormData) => Promise<ActionResult<T>>,
  { onSuccess }: { onSuccess?: (data: T) => void } = {},
) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<ActionError | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      let result: ActionResult<T>;
      try {
        result = await action(data);
      } catch {
        // Network failure or an unexpected throw: same as a failed save.
        result = { ok: false, error: "saveFailed" };
      }
      if (result.ok) {
        setError(null);
        onSuccess?.(result.data);
      } else {
        setError(result.error);
      }
    });
  }

  return { onSubmit, pending, error };
}
