/*
 * Whether a shot may ever go to the brewer network (STORY-05-02-04, X-3).
 * Only a measured shot with its full payload, logged for a profile someone
 * has claimed, and only while that person has opted in. An unclaimed
 * profile's shots are never eligible, whoever logged them: no one shares
 * another person's data for them. Production code still stores false
 * until the network exists.
 */

export type EligibilityInput = {
  entryMode: "measured" | "one-tap";
  /** Grind, dose, yield, time and how it tasted are all there. */
  fullPayload: boolean;
  /** The user who claimed the shot's profile; null for a profile with no login. */
  claimedByUserId: string | null;
  /** That user's own sharing choice (`users.share_data_consent`). */
  claimantConsents: boolean;
};

export function isNetworkEligible(shot: EligibilityInput): boolean {
  return shot.entryMode === "measured" && shot.fullPayload && shot.claimedByUserId !== null && shot.claimantConsents;
}
