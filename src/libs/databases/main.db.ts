import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/src/generated/main/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.PPG_USER_DATABASE_URL,
});

const getPrisma = () => new PrismaClient({
    adapter,
});

const globalForMainDbClient = global as unknown as {
    mainClient: ReturnType<typeof getPrisma>;
};

export const mainClient =
    globalForMainDbClient.mainClient || getPrisma();    
if (process.env.NODE_ENV !== "production")
    globalForMainDbClient.mainClient = mainClient;