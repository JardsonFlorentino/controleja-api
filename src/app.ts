// src/app.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// Log de toda request (inclusive OPTIONS)
app.addHook("onRequest", (request, reply, done) => {
  console.log(
    "[REQ]",
    request.method,
    request.url,
    "origin=",
    request.headers.origin,
  );
  done();
});

// CORS: refletir qualquer origem automaticamente
app.register(cors, {
  origin: true, // reflect origin para todas as requests [web:142][web:148]
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
});

// Rotas com prefixo /api
app.register(routes, { prefix: "/api" });

export default app;
