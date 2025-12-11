import { Link } from "@/shorlinks/data/link";
import { PrismaClient } from "../../../../../prisma/src/generated/main/prisma/client";
import { PaginationParams } from "@/libs/utils/prisma.builder";

export class LinkShardsQuery {
    constructor(private client: PrismaClient) { }

    async findWithPagination({ where, skip, limit, sortBy, sortOrder }: PaginationParams) {
        const [total, links] = await Promise.all([
            this.client.links_shards.count({ where }),
            this.client.links_shards.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder }
            })
        ]);

        return {
            total,
            data: links
        };
    }

    async findById(id: string) {
        return this.client.links_shards.findUnique({
            where: { id }
        });
    }

    async findByHash(hash: string) {
        return this.client.links_shards.findUnique({
            where: { hashId: hash }
        });
    }
}