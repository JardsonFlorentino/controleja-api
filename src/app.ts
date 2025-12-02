import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import routes from "./routes";
import { env } from "./config/env";
import cors from "@fastify/cors";

const app: FastifyInstance = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// ---------------------------------------------------------
// CORS CORRIGIDO
// Aceita localhost e domínio oficial
// Não quebra se a variável de ambiente estiver vazia
// ---------------------------------------------------------

const originList = (
  env.CORS_ORIGIN &&
  env.CORS_ORIGIN !== "*" &&
  env.CORS_ORIGIN.split(",").map(o => o.trim())
) || [
  "http://localhost:5173",
  "https://controleja.jardsonflorentino.com.br"
];

app.register(cors, {
  origin: (origin, cb) => {
    // Permite requests sem origin (ex: Insomnia/Postman)
    if (!origin) {
      cb(null, true);
      return;
    }

    if (originList.includes(origin)) {
      cb(null, true);
      return;
    }

    cb(new Error("Not allowed by CORS"), false);
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

// Rotas com prefixo /api
app.register(routes, { prefix: "/api" });

export default app;
