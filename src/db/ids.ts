/**
 * Primary keys are random UUIDs stored as text (TQ-11). They can be made on
 * the client too, e.g. for the one-tap pull, so a retried save can't
 * create a second row.
 */
export function newId(): string {
  return crypto.randomUUID();
}
