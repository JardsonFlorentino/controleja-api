// server.ts
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";
import initializeFirebaseAdmin from "./config/firebase";
import { env } from "./config/env";

const PORT = Number(env.PORT) || 3001; // Converte para número!

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();
    await initializeGlobalCategories();

    await app.listen({ 
      port: PORT, 
      host: "0.0.0.0" 
    });

    console.log(`🚀 Servidor rodando em 0.0.0.0:${PORT}`);
  } catch (err) {
    console.error("❌ Erro ao iniciar servidor:", err);
    process.exit(1);
  }
};

startServer();