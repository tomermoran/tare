"use server";

import { getTranslations } from "next-intl/server";
import { ListNameError } from "@/domain/listName";
import { runAction, type ActionError } from "@/lib/actionResult";
import { addPerson, PersonInUseError, removePerson, renamePerson } from "@/server/dal/people";

/*
 * The people screen's saves (STORY-05-01-01, 05-01-02). A refused name
 * comes back as its reason, said under the field; a profile in use comes
 * back with its counts; anything else is a failed save.
 */

export type PeopleError = ActionError | "nameRequired" | "nameTaken" | "inUse";
export type PeopleResult<T = void> = { ok: true; data: T } | { ok: false; error: PeopleError };

async function run<T>(body: () => Promise<T>): Promise<PeopleResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (e) {
    if (e instanceof ListNameError) return { ok: false, error: e.problem === "required" ? "nameRequired" : "nameTaken" };
    if (e instanceof PersonInUseError) return { ok: false, error: "inUse" };
    return runAction(() => Promise.reject(e));
  }
}

/** How an unnamed profile shows in this language, for the name rule. */
const roleLabel = async () => (await getTranslations())("profile.defaultName");
const validId = (id: unknown): id is string => typeof id === "string" && id.length > 0;

export async function addPersonAction(name: string): Promise<PeopleResult<{ id: string }>> {
  if (typeof name !== "string") return { ok: false, error: "saveFailed" };
  return run(async () => addPerson(name, await roleLabel()));
}

export async function renamePersonAction(id: string, name: string): Promise<PeopleResult> {
  if (!validId(id) || typeof name !== "string") return { ok: false, error: "notFound" };
  return run(async () => renamePerson(id, name, await roleLabel()));
}

export async function removePersonAction(id: string): Promise<PeopleResult> {
  if (!validId(id)) return { ok: false, error: "notFound" };
  return run(() => removePerson(id));
}
