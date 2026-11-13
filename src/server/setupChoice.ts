import "server-only";
import { cookies } from "next/headers";
import { CURRENT_SETUP_COOKIE, decodeSetupChoice, encodeSetupChoice, type SetupChoice } from "@/domain/currentSetup";

/*
 * The device's setup choice (TQ-16): a cookie, so it stays on this device.
 * Reading it makes a page dynamic, so callers render behind Suspense.
 * Writing only works in a server action.
 */

export async function readSetupChoice(): Promise<SetupChoice | null> {
  return decodeSetupChoice((await cookies()).get(CURRENT_SETUP_COOKIE)?.value);
}

export async function writeSetupChoice(setupId: string, at = new Date()): Promise<void> {
  (await cookies()).set(CURRENT_SETUP_COOKIE, encodeSetupChoice({ setupId, at: at.getTime() }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
