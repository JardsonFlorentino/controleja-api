import admin from "firebase-admin";
import { env } from "./env";
import { Buffer } from "buffer";

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) return;

  const privateKey = Buffer
    .from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64")
    .toString("utf8");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
};

export default initializeFirebaseAdmin;
