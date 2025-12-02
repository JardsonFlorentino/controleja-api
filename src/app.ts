import Fastify from "fastify";
import routes from "./routes";
import { env } from "./config/env";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

// CORS Manual - mais controle
app.addHook('onRequest', async (request, reply) => {
  const origin = request.headers.origin;
  
  // Define headers CORS manualmente
  reply.header('Access-Control-Allow-Origin', origin || '*');
  reply.header('Access-Control-Allow-Credentials', 'true');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  reply.header('Access-Control-Max-Age', '86400');
  
  // Responde imediatamente para OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    reply.status(204).send();
    return;
  }
});

app.register(routes, { prefix: "/api" });

export default app;