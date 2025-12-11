import { PrismaClient } from "prisma/src/generated/db.links/client";

export class LinkQuery {
    constructor(private client: PrismaClient) { }

    async findById(id: number) {
        return this.client.links.findUnique({
            where: { id }
        });
    }

    async findByHash(hash: string) {
        return this.client.links.findUnique({
            where: { hashId:  hash }
        });
    }
}