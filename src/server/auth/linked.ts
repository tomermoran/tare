import "server-only";
import { adminAuth } from "./firebase-admin";

/**
 * Whether this Firebase account has Google among its sign-in providers
 * (STORY-05-03-01). Only the provider IDs are read: nothing from the Google
 * profile. Any failure reads as not linked, so the page still renders and
 * offers the link.
 */
export async function isLinkedToGoogle(firebaseUid: string): Promise<boolean> {
  try {
    const user = await adminAuth().getUser(firebaseUid);
    return user.providerData.some((p) => p.providerId === "google.com");
  } catch {
    return false;
  }
}
