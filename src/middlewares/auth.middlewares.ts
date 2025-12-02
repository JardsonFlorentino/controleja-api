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

    // 💡 Corrige o CORS/preflight
    if (request.method === "OPTIONS") {
        return reply.status(200).send();
    }

    const authHeader = request.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        reply.status(401).send({ error: "token not found" });
        return;
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("TOKEN RECEBIDO:", token);

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log(decodedToken);

        request.userId = decodedToken.uid;

    } catch (error) {
        request.log.error(error);
        reply.status(401).send({ error: "invalid token" });
        return;
    }
};
