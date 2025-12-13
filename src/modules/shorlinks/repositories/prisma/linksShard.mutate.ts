import { PaginationParams } from "@/libs/utils/prisma.builder";
import { PrismaClient, Prisma } from "../../../../../prisma/src/generated/main/prisma/client";
import { ValidationError } from "src/types";

export class LinkShardMutate {
    constructor(private client: PrismaClient) { }

    async create(data: Prisma.links_shardsCreateInput) {
        return this.client.links_shards.create({
            data
        });
    }

    async update(id: string, data: Prisma.links_shardsUpdateInput) {
        return this.client.links_shards.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return this.client.links_shards.delete({
            where: { id }
        });
    }

    async linkRelTagsCreate(linkId: string, tagName: string, userId: string | null) {
        let tag = await this.client.link_tags.findFirst({ where: { name: tagName } });
        if (!tag) {
            if (!userId) {
                throw new ValidationError("User not found");
            }

            tag = await this.client.link_tags.create({
                data: {
                    name: tagName,
                    userId: userId
                }
            })
        }

        return this.client.link_rel_tags.create({
            data: {
                linkId,
                tagId: tag.id
            }
        });
    }

    async linkRelTagsDelete(linkId: string, tagName: string) {
        const tag = await this.client.link_tags.findFirst({ where: { name: tagName } });
        if (!tag) {
            throw new Error("Tag not found");
        }

        return this.client.link_rel_tags.delete({
            where: { linkId_tagId: { linkId, tagId: tag.id } }
        });
    }
}