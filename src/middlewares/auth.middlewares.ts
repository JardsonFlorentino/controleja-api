import { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const authMiddlewares = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {

  // 🔥 NÃO bloquear o preflight do navegador
  if (request.method === "OPTIONS") {
    return; // o app.ts já responde ao OPTIONS
  }

  const authHeader = request.headers.authorization;
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.code(401).send({ error: "token not found" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  console.log("TOKEN RECEBIDO:", token);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("TOKEN DECODIFICADO:", decodedToken);

    request.userId = decodedToken.uid;
  } catch (error) {
    request.log.error(error);
    reply.code(401).send({ error: "invalid token" });
    return;
  }
};
