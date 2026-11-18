import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Invite links (TD-11): `<id>.<hmac>`, the HMAC-SHA256 of the invite's ID
 * under INVITE_SECRET, base64url. The link can be shown again without
 * storing anything secret, and a database leak yields no working link.
 * The secret is a deployment secret, never in the repository.
 */

export class InviteConfigError extends Error {
  constructor() {
    super("INVITE_SECRET is not set");
    this.name = "InviteConfigError";
  }
}

function secret(): string {
  const s = process.env.INVITE_SECRET;
  if (!s || s.length < 16) throw new InviteConfigError();
  return s;
}

const mac = (id: string) => createHmac("sha256", secret()).update(id).digest("base64url");

/** The token for an invite ID. */
export function inviteToken(id: string): string {
  return `${id}.${mac(id)}`;
}

/** The invite ID a token carries, when its HMAC checks out in constant time; null otherwise. */
export function verifyInviteToken(token: unknown): string | null {
  if (typeof token !== "string" || token.length > 200) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(mac(id));
  return given.length === expected.length && timingSafeEqual(given, expected) ? id : null;
}

/** The full link: APP_ORIGIN (else the request's own origin) and `/join/<token>`. */
export function inviteLink(id: string, requestOrigin: string): string {
  const origin = (process.env.APP_ORIGIN || requestOrigin).replace(/\/+$/, "");
  return `${origin}/join/${inviteToken(id)}`;
}
