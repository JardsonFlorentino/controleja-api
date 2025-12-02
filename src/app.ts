import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
 logger: {
  // Log level baseado no ambiente
  level: env.NODE_ENV === "dev" ? "info" : "error",
 },
});

const allowedOrigins = env.CORS_ORIGIN === "*"
 ? true // Permite todas as origens (somente para testes ou APIs públicas)
 : env.CORS_ORIGIN.split(",").map((o) => o.trim());

app.register(cors, {

 origin: allowedOrigins,

 methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

 allowedHeaders: ["Content-Type", "Authorization"],
 credentials: true,

 maxAge: 86400,
});



app.register(routes, { prefix: "/api" });

export default app;