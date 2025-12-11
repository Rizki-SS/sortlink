import { PrismaClient } from "../../../prisma/src/generated/main/prisma/client";

export type DatabaseClient = PrismaClient | any; // Allow any Prisma client type

export type ScopedClient = any; // Flexible type for extended Prisma clients

export interface DatabaseScope {
    teamId?: string;
    userId?: string;
    [key: string]: any;
}

export interface IDatabaseProvider {
    getClient(name: string, shardOrUrl?: string): DatabaseClient;
    withScope(name: string, filters: DatabaseScope, shardOrUrl?: string): ScopedClient;
}
