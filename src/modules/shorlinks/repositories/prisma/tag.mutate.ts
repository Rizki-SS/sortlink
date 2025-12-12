import { Prisma, PrismaClient } from "prisma/src/generated/main/prisma/client";

export class TagMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.link_tagsCreateInput) {
        return this.client.link_tags.create({
            data
        });
    }

    async updateById(id: string, data: Prisma.link_tagsUpdateInput) {
        return this.client.link_tags.update({
            where: { id },
            data
        });
    }

    async deleteById(id: string) {
        return this.client.link_tags.delete({
            where: { id }
        });
    }

    async deleteMany(where: Prisma.link_tagsWhereInput) {
        return this.client.link_tags.deleteMany({
            where
        });
    }

    // Tag-Link relationship operations
    async addTagToLink(linkId: string, tagId: string) {
        return this.client.link_rel_tags.create({
            data: {
                linkId,
                tagId
            }
        });
    }

    async removeTagFromLink(linkId: string, tagId: string) {
        return this.client.link_rel_tags.delete({
            where: {
                linkId_tagId: {
                    linkId,
                    tagId
                }
            }
        });
    }

    async removeAllTagsFromLink(linkId: string) {
        return this.client.link_rel_tags.deleteMany({
            where: { linkId }
        });
    }

    async removeTagFromAllLinks(tagId: string) {
        return this.client.link_rel_tags.deleteMany({
            where: { tagId }
        });
    }
}
