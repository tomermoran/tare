import { generateKeyPairSync } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";

// A throwaway service account, so the test needs no real Firebase project.
beforeAll(() => {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  process.env.FIREBASE_PROJECT_ID = "demo-tare-test";
  process.env.FIREBASE_CLIENT_EMAIL =
    "test@demo-tare-test.iam.gserviceaccount.com";
  process.env.FIREBASE_PRIVATE_KEY = privateKey
    .export({ type: "pkcs8", format: "pem" })
    .toString();
});

async function post(body: unknown) {
  const { POST } = await import("@/app/api/session/route");
  return POST(
    new Request("http://localhost/api/session", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/session", () => {
  it("rejects a request without a token", async () => {
    const res = await post({});
    expect(res.status).toBe(400);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("rejects a forged token and sets no cookie", async () => {
    const forged = [
      Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url"),
      Buffer.from(JSON.stringify({ sub: "someone", aud: "demo-tare-test" })).toString("base64url"),
      "",
    ].join(".");
    const res = await post({ idToken: forged });
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
  });
});
