// app.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// 🔥 CORS COMPLETO E CORRETÍSSIMO
app.register(cors, {
  origin: env.CORS_ORIGIN === "*"
    ? true
    : env.CORS_ORIGIN.split(",").map((o) => o.trim()),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
});

// 🔥 Resposta manual ao OPTIONS (ESSENCIAL NA KOYEB)
app.addHook("onRequest", async (req, reply) => {
  if (req.method === "OPTIONS") {
    reply
      .code(204)
      .header("Access-Control-Allow-Origin", req.headers.origin || "*")
      .header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      )
      .header(
        "Access-Control-Allow-Headers",
        "Authorization, Content-Type, Accept"
      )
      .send();
    return;
  }
});

// 🔥 Suas rotas (prefixo /api)
app.register(routes, { prefix: "/api" });

export default app;
