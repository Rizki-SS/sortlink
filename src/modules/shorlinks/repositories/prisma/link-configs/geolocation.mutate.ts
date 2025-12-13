import { Prisma, PrismaClient } from "prisma/src/generated/db.links/client";

export class GeolocationMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.link_geolocationCreateInput) {
        return this.client.link_geolocation.create({
            data
        });
    }

    async update(id: number, data: Prisma.link_geolocationUpdateInput) {
        return this.client.link_geolocation.update({
            where: { id },
            data
        });
    }
}