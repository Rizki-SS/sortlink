import { Prisma, PrismaClient } from "prisma/src/generated/main/prisma/client";

export class FolderMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.links_foldersCreateInput) {
        return this.client.links_folders.create({
            data
        });
    }

    async updateById(id: string, data: Prisma.links_foldersUpdateInput) {
        return this.client.links_folders.update({
            where: { id },
            data
        });
    }

    async deleteById(id: string) {
        return this.client.links_folders.delete({
            where: { id }
        });
    }

    async deleteMany(where: Prisma.links_foldersWhereInput) {
        return this.client.links_folders.deleteMany({
            where
        });
    }
}
