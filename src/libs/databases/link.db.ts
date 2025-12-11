import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/src/generated/db.links/client";

export const DB_SHARDS = {
    "shard_1": process.env.DATABASE_URL_LINK_SHARD_1,
    "shard_2": process.env.DATABASE_URL_LINK_SHARD_2,
} as const;

export type ShardName = keyof typeof DB_SHARDS;

const linkDbClients = new Map<string, PrismaClient>();

export function getLinkDbClient(shardName: ShardName): PrismaClient {
    const connectionString = DB_SHARDS[shardName];
    
    if (!connectionString) {
        throw new Error(`Database URL for shard "${shardName}" is not configured`);
    }

    // Return cached client if exists
    if (linkDbClients.has(shardName)) {
        return linkDbClients.get(shardName)!;
    }

    // Create new client
    const adapter = new PrismaPg({ connectionString });
    const client = new PrismaClient({ adapter });
    
    // Cache the client
    linkDbClients.set(shardName, client);
    
    return client;
}

// Optional: Get client by custom connection string
export function getLinkDbClientByUrl(connectionString: string): PrismaClient {
    const cacheKey = `custom_${connectionString}`;
    
    if (linkDbClients.has(cacheKey)) {
        return linkDbClients.get(cacheKey)!;
    }

    const adapter = new PrismaPg({ connectionString });
    const client = new PrismaClient({ adapter });
    
    linkDbClients.set(cacheKey, client);
    
    return client;
}

// Cleanup function for graceful shutdown
export async function disconnectAllLinkDbClients() {
    const disconnectPromises = Array.from(linkDbClients.values()).map(
        client => client.$disconnect()
    );
    await Promise.all(disconnectPromises);
    linkDbClients.clear();
}