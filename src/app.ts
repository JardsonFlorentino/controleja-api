// src/app.ts
import Fastify from "fastify";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// Origens permitidas
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://controleja-interface.vercel.app",
  "https://controleja.jardsonflorentino.com.br",
];

// Hook global: log + CORS + tratar OPTIONS
app.addHook("onRequest", (request, reply, done) => {
  const origin = request.headers.origin as string | undefined;

  console.log(
    "[REQ]",
    request.method,
    request.url,
    "origin=",
    origin,
  );

  // Se a origem é permitida, já seta os headers básicos de CORS
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    reply.header("Access-Control-Allow-Origin", origin);
    reply.header("Vary", "Origin");
    reply.header("Access-Control-Allow-Credentials", "true");
  }

  // Tratar preflight CORS aqui mesmo
  if (request.method === "OPTIONS") {
    reply
      .header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,PATCH,OPTIONS",
      )
      .header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      )
      .status(204)
      .send();
    return; // IMPORTANTE: não seguir para rotas / middlewares
  }

  done();
});

// (se quiser, pode manter o authMiddlewares como preHandler nas rotas protegidas)

// Rotas com prefixo /api
app.register(routes, { prefix: "/api" });

export default app;
