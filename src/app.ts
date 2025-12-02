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

// CORS FINAL E CORRETÍSSIMO
app.register(cors, {
  origin: env.CORS_ORIGIN === "*" 
    ? true 
    : env.CORS_ORIGIN.split(",").map((o) => o.trim()),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

// ROTAS REGISTRADAS DEPOIS do CORS
app.register(routes, { prefix: "/api" });

export default app;
