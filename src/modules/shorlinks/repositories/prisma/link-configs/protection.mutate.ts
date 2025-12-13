import { Prisma, PrismaClient } from "prisma/src/generated/db.links/client";

export class ProtectionMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.link_protectionCreateInput) {
        return this.client.link_protection.create({
            data
        });
    }

    async update(id: number, data: Prisma.link_protectionUpdateInput) {
        return this.client.link_protection.update({
            where: { id },
            data
        });
    }
}
