import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { ensureAccount } from "@/server/auth/bootstrap";
import { adminAuth } from "@/server/auth/firebase-admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/server/auth/session";

/**
 * Exchanges a Firebase ID token for an httpOnly session cookie (TQ-01).
 * The browser calls this once, and again only when the cookie has gone.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const idToken =
    typeof body === "object" && body && "idToken" in body
      ? body.idToken
      : undefined;
  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  let cookie: string;
  let uid: string;
  try {
    uid = (await adminAuth().verifyIdToken(idToken)).uid;
    cookie = await adminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  // The first sign-in creates the household; later ones find it.
  await ensureAccount(db, uid);

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(SESSION_COOKIE, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });
  return response;
}
