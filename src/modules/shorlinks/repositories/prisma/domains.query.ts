import { PaginationParams } from "@/libs/utils/prisma.builder";
import { PrismaClient, Prisma } from "../../../../../prisma/src/generated/main/prisma/client";

export class DomainQuery {
    constructor(private client: PrismaClient | any) { }

    async findWithPagination({ where, skip, limit, sortBy, sortOrder }: PaginationParams) {
        const [total, domains] = await Promise.all([
            this.client.domains.count({ where }),
            this.client.domains.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder }
            })
        ]);

        return {
            total,
            data: domains
        };
    }

    async findById(id: string) {
        return this.client.domains.findUnique({
            where: { id }
        });
    }
}