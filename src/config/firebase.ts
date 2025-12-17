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
    key = Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8");
  } 
  // 2. Tenta arquivo local
  else if (process.env.FIREBASE_PRIVATE_KEY_FILE) {
    key = fs.readFileSync(process.env.FIREBASE_PRIVATE_KEY_FILE, "utf8");
  } 
  // 3. Tenta string direta (O que você está usando na Koyeb)
  else if (env.FIREBASE_PRIVATE_KEY) {
    key = env.FIREBASE_PRIVATE_KEY;
  } 
  else {
    throw new Error("No Firebase private key provided in env.");
  }

  // LIMPEZA CRUCIAL PARA A KOYEB
  return key
    .trim()
    .replace(/^['"]|['"]$/g, '') // Remove aspas extras
    .replace(/\\n/g, "\n")       // Converte \n literal em quebra de linha
    .replace(/\r/g, "");         // Remove lixo de formatação
}

/**
 * Função principal de inicialização
 */
export default function initializeFirebaseAdmin() {
  if (initialized) return;

  try {
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const projectId = env.FIREBASE_PROJECT_ID;
    const privateKey = getPrivateKey();

    if (!clientEmail || !privateKey || !projectId) {
      throw new Error("Missing Firebase admin environment variables");
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
    console.error("❌ Erro ao inicializar o Firebase Admin:", error);
  }
}