import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
  if (admin.apps.length > 0) return;

  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    throw new Error("Firebase admin SDK is not properly configured.");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
      }),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase admin SDK.", error);
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;
