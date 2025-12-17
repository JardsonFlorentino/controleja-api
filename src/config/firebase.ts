import admin from "firebase-admin";
import { env } from "./env";
import fs from "fs";

let initialized = false;

/**
 * Lê a private key em qualquer formato válido e limpa caracteres residuais
 */
function getPrivateKey(): string {
  let key = "";

  // --- 1. Tenta BASE64 (Mais seguro para Cloud) ---
  if (env.FIREBASE_PRIVATE_KEY_BASE64) {
    key = Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8");
  } 
  // --- 2. Tenta ARQUIVO ---
  else if (process.env.FIREBASE_PRIVATE_KEY_FILE) {
    key = fs.readFileSync(process.env.FIREBASE_PRIVATE_KEY_FILE, "utf8");
  } 
  // --- 3. Tenta JSON INLINE (O seu caso atual na Koyeb) ---
  else if (env.FIREBASE_PRIVATE_KEY) {
    key = env.FIREBASE_PRIVATE_KEY;
  } 
  else {
    throw new Error("No Firebase private key provided in env.");
  }

  // --- LIMPEZA DA CHAVE ---
  // 1. Remove espaços em branco no início e fim
  // 2. Remove aspas extras (caso a Koyeb ou o Validador de Env as tenha inserido)
  // 3. Converte o texto literal "\n" em quebras de linha reais (caractere 10)
  return key
    .trim()
    .replace(/^['"]|['"]$/g, '') 
    .replace(/\\n/g, "\n")
    .replace(/\r/g, ""); // Remove possíveis retornos de carro de sistemas Windows
}

export default function initializeFirebaseAdmin() {
  if (initialized) return;

  try {
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const projectId = env.FIREBASE_PROJECT_ID;
    const privateKey = getPrivateKey();

    if (!clientEmail || !privateKey || !projectId) {
      throw new Error("Missing Firebase admin environment variables");
    }

    // Inicialização do Admin SDK
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
      console.log("📌 Projeto ID:", projectId);
    }

  } catch (error) {
    console.error("❌ Erro ao inicializar o Firebase Admin:", error);
    // Não mata o processo, mas avisa que o Firebase falhou
  }
}