"use server";

import type { ActionError } from "@/lib/actionResult";
import { runAction } from "@/lib/actionResult";
import { renamePersona } from "@/server/dal/profile";

/**
 * The profile form's state for useActionState: the name as typed (kept on
 * failure, AC 6), and how the last save went.
 */
export type ProfileFormState = {
  name: string;
  status: "idle" | "saved" | "failed";
  error?: ActionError;
};

export async function renamePersonaAction(_prev: ProfileFormState, form: FormData): Promise<ProfileFormState> {
  const raw = form.get("name");
  const name = typeof raw === "string" ? raw : "";
  const result = await runAction(() => renamePersona(name));
  if (!result.ok) return { name, status: "failed", error: result.error };
  return { name: result.data.name ?? "", status: "saved" };
}
