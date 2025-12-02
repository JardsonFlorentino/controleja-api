import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// Loga toda requisição que chega na API
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

// Função de CORS que (por enquanto) libera qualquer origem
function checkOrigin(
  origin: string | undefined,
  cb: (err: Error | null, allow: boolean) => void,
) {
  console.log("[CORS DEBUG] Origin recebido:", origin);
  // Libera todas as origens enquanto debugamos
  cb(null, true);
}

app.register(cors, {
  origin: checkOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
});

// Suas rotas da API, sempre com prefixo /api
app.register(routes, { prefix: "/api" });

export default app;
