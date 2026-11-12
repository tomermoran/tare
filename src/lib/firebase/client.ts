import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";

// The web app config is public by design; it comes from NEXT_PUBLIC_ env
// variables so no project is committed (see .env.example).
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function firebaseAuth(): Auth {
  const app = getApps().length ? getApp() : initializeApp(config);
  return getAuth(app);
}

/**
 * Signs this browser in anonymously, once. The SDK keeps the account in the
 * browser (its default persistence), so a reload or a cleared session cookie
 * gets the same Firebase account back. There is no sign-in screen.
 */
export async function ensureSignedIn() {
  const auth = firebaseAuth();
  await auth.authStateReady();
  return auth.currentUser ?? (await signInAnonymously(auth)).user;
}

/** A fresh Firebase ID token for the session exchange. */
export async function getIdToken(): Promise<string> {
  const user = await ensureSignedIn();
  return user.getIdToken();
}
