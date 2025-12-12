import { PrismaClient } from "prisma/src/generated/db.links/client";

export class LinkQuery {
    constructor(private client: PrismaClient) { }

    async findById(id: number) {
        return this.client.links.findUnique({
            where: { id },
            include: {
                link_utm: true,
                link_geolocation: true,
                link_ab_testing: true,
                link_protection: true,
                link_preview: true
            }
        });
    }

    async findByHash(hash: string) {
        return this.client.links.findUnique({
            where: { hashId: hash },
            include: {
                link_utm: true,
                link_geolocation: true,
                link_ab_testing: true,
                link_protection: true,
                link_preview: true
            }
        });
    }
}