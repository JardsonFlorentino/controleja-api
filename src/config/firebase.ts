import admin from "firebase-admin";
import { env } from "./env";
import fs from "fs";

let initialized = false;

/**
 * Função única para obter e limpar a chave privada
 */
function getPrivateKey(): string {
  let key = "";

  // 1. Tenta Base64 (Caminho mais seguro)
  if (env.FIREBASE_PRIVATE_KEY_BASE64) {
    key = Buffer.from(
      env.FIREBASE_PRIVATE_KEY_BASE64,
      "base64",
    ).toString("utf8");
  }
  // 2. Tenta arquivo local
  else if (process.env.FIREBASE_PRIVATE_KEY_FILE) {
    key = fs.readFileSync(process.env.FIREBASE_PRIVATE_KEY_FILE, "utf8");
  }
  // 3. Tenta string direta (O que você está usando na Koyeb)
  else if (env.FIREBASE_PRIVATE_KEY) {
    key = env.FIREBASE_PRIVATE_KEY;
  } else {
    throw new Error("No Firebase private key provided in env.");
  }

  // LIMPEZA CRUCIAL PARA A KOYEB
  return key
    .trim()
    .replace(/^['"]|['"]$/g, "") // Remove aspas extras
    .replace(/\\n/g, "\n") // Converte \n literal em quebra de linha
    .replace(/\r/g, ""); // Remove lixo de formatação
}

/**
 * Função principal de inicialização
 */
export default function initializeFirebaseAdmin() {
  if (initialized) return;

  // Se faltar qualquer env essencial, não tenta inicializar
  if (
    !env.FIREBASE_CLIENT_EMAIL ||
    !env.FIREBASE_PROJECT_ID ||
    (!env.FIREBASE_PRIVATE_KEY &&
      !env.FIREBASE_PRIVATE_KEY_BASE64 &&
      !process.env.FIREBASE_PRIVATE_KEY_FILE)
  ) {
    console.warn(
      "Firebase Admin não inicializado: variáveis de ambiente ausentes ou inválidas.",
    );
    return;
  }

  try {
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const projectId = env.FIREBASE_PROJECT_ID;
    const privateKey = getPrivateKey();

    if (!clientEmail || !privateKey || !projectId) {
      console.warn("Firebase Admin não inicializado: envs incompletas.");
      return;
    }

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      initialized = true;
      console.log("🔥 Firebase Admin inicializado com sucesso");
    }
  } catch (error) {
    console.error(
      "❌ Erro ao inicializar o Firebase Admin (ignorando em produção):",
      error,
    );
  }
}
