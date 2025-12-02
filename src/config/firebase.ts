import admin from "firebase-admin";
import { env } from "./env";
import fs from "fs";

function getPrivateKey(): string {
  if (env.FIREBASE_PRIVATE_KEY_BASE64) {
    return Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64")
      .toString("utf8")
      .replace(/\r/g, "")      
      .replace(/\\n/g, "\n");   
  }
  
  if (process.env.FIREBASE_PRIVATE_KEY_FILE) {
    return fs.readFileSync(process.env.FIREBASE_PRIVATE_KEY_FILE, "utf8");
  }
  if (env.FIREBASE_PRIVATE_KEY) {
    if (env.FIREBASE_PRIVATE_KEY.includes("\\n")) {
      return env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    }
    return env.FIREBASE_PRIVATE_KEY;
  }
  throw new Error("No Firebase private key provided in env.");
}

export default function initializeFirebaseAdmin() {
  
}