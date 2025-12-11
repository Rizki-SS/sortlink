import { Prisma, PrismaClient } from "prisma/src/generated/db.links/client";

export class LinkMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.linksCreateInput) {
        return this.client.links.create({
            data
        });
    }

    async updateByHash(hash: string, data: Prisma.linksUpdateInput) {
        return this.client.links.update({
            where: { hashId: hash },
            data
        });
    }

    async deleteByHash(hash: string) {
        return this.client.links.delete({
            where: { hashId: hash }
        });
    }
}