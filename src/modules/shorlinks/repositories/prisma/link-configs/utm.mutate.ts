import { Prisma, PrismaClient } from "prisma/src/generated/db.links/client";

export class UtmMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.link_utmCreateInput) {
        return this.client.link_utm.create({
            data
        });
    }

    async update(id: number, data: Prisma.link_utmUpdateInput) {
        return this.client.link_utm.update({
            where: { id },
            data
        });
    }

    async updateOrCreate(linkId: number, data: Prisma.link_utmCreateInput) {
        return this.client.link_utm.upsert({
            where: { linkId: linkId },
            create: data,
            update: data
        });
    }
}