import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {
    try {
        await prisma.$connect();
        console.log("DB connected successfully");
    } catch (err) {
        console.error("DB connection error");
    }

}

export default prisma;