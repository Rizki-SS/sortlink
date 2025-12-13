import { Prisma, PrismaClient } from "prisma/src/generated/db.links/client";

export class AbTestMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.link_ab_testingCreateInput) {
        return this.client.link_ab_testing.create({
            data
        });
    }

    async update(id: number, data: Prisma.link_ab_testingUpdateInput) {
        return this.client.link_ab_testing.update({
            where: { id },
            data
        });
    }
}