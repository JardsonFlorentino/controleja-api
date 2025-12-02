// server.ts
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";
import initializeFirebaseAdmin from "./config/firebase";
import { env } from "./config/env";

const PORT = env.PORT || 3001;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prismaConnect();
    await initializeGlobalCategories();

    await app.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  } catch (err) {
    console.error(err);
  }
};

startServer();
