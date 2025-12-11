import { PaginationParams } from "@/libs/utils/prisma.builder";
import { PrismaClient, Prisma } from "../../../../../prisma/src/generated/main/prisma/client";

export class LinkShardMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.links_shardsCreateInput) {
        return this.client.links_shards.create({
            data
        });
    }

    async update(id: string, data: Prisma.links_shardsUpdateInput) {
        return this.client.links_shards.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return this.client.links_shards.delete({
            where: { id }
        });
    }
}