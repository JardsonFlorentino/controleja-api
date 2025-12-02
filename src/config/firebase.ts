// firebase.ts
import admin from "firebase-admin";
import { env } from "./env";
import fs from "fs";

let initialized = false;

/**
 * Lê a private key em qualquer formato válido:
 * - FIREBASE_PRIVATE_KEY_BASE64 (mais seguro)
 * - FIREBASE_PRIVATE_KEY (JSON inline)
 * - FIREBASE_PRIVATE_KEY_FILE (arquivo)
 */
function getPrivateKey(): string {
  // --- BASE64 ---
  if (env.FIREBASE_PRIVATE_KEY_BASE64) {
    return Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64")
      .toString("utf8")
      .replace(/\r/g, "")
      .replace(/\\n/g, "\n");
  }

  // --- ARQUIVO ---
  if (process.env.FIREBASE_PRIVATE_KEY_FILE) {
    return fs.readFileSync(process.env.FIREBASE_PRIVATE_KEY_FILE, "utf8");
  }

  // --- JSON INLINE ---
  if (env.FIREBASE_PRIVATE_KEY) {
    if (env.FIREBASE_PRIVATE_KEY.includes("\\n")) {
      return env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    }
    return env.FIREBASE_PRIVATE_KEY;
  }

  throw new Error("No Firebase private key provided in env.");
}

export default function initializeFirebaseAdmin() {
  if (initialized) return;

  try {
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const privateKey = getPrivateKey();
    const projectId = env.FIREBASE_PROJECT_ID;

    if (!clientEmail || !privateKey || !projectId) {
      throw new Error("Missing Firebase admin environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    initialized = true;

    console.log("🔥 Firebase Admin inicializado com sucesso");
    console.log("📌 Projeto:", projectId);

  } catch (error) {
    console.error("❌ Erro ao inicializar o Firebase Admin:", error);
  }
}
