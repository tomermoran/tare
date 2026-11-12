/**
 * Observation tags on a shot's taste (S-08). Stored as keys; the words come
 * from the messages. TASK-01-05-03-BE1 builds the taste rules on this list.
 */
export const TASTE_TAGS = [
  "sourAndBitter",
  "dryFinish",
  "flat",
  "burnt",
  "littleCrema",
  "channelling",
] as const;

export type TasteTag = (typeof TASTE_TAGS)[number];
