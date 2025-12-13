import { Prisma, PrismaClient } from "prisma/src/generated/db.links/client";

export class PreviewMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.link_previewCreateInput) {
        return this.client.link_preview.create({
            data
        });
    }

    async update(id: number, data: Prisma.link_previewUpdateInput) {
        return this.client.link_preview.update({
            where: { id },
            data
        });
    }
}