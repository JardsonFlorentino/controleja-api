import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

function checkOrigin(origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) {
  console.log("[CORS DEBUG] Origin recebido:", origin);
  // por enquanto, libera tudo pra não travar
  cb(null, true);
}

app.register(cors, {
  origin: checkOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
});

app.register(routes, { prefix: "/api" });

export default app;
