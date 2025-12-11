import { PrismaClient, Prisma } from "../../../../../prisma/src/generated/main/prisma/client";

export class DomainMutate {
    constructor(private client?: PrismaClient) { }

    async create(data: Prisma.domainsCreateInput) {
        return this.client?.domains.create({
            data
        });
    }

    async update(id: string, data: Prisma.domainsUpdateInput) {
        return this.client?.domains.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return this.client?.domains.delete({
            where: { id }
        });
    }
}