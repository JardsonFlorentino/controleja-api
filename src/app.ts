import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// CORS configurado corretamente para Fastify
app.register(cors, {
  origin: (origin, cb) => {
    // Durante desenvolvimento/teste, aceita qualquer origem
    // Você pode restringir depois se quiser
    if (!origin || origin === 'null') {
      cb(null, true);
      return;
    }
    cb(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

app.register(routes, { prefix: "/api" });

export default app;