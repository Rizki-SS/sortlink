import { Prisma, PrismaClient } from "prisma/src/generated/main/prisma/client";

export class TagQuery {
    constructor(private client: PrismaClient) { }

    async findById(id: string) {
        return this.client.link_tags.findUnique({
            where: { id }
        });
    }

    async findByIdWithLinks(id: string) {
        return this.client.link_tags.findUnique({
            where: { id },
            include: {
                links: {
                    include: {
                        link: true
                    }
                }
            }
        });
    }

    async findByUserId(userId: string, options?: {
        teamId?: string | null;
    }) {
        return this.client.link_tags.findMany({
            where: {
                userId,
                ...(options?.teamId !== undefined && { teamId: options.teamId })
            },
            orderBy: {
                name: 'asc'
            }
        });
    }

    async findByTeamId(teamId: string) {
        return this.client.link_tags.findMany({
            where: { teamId },
            orderBy: {
                name: 'asc'
            }
        });
    }

    async findByName(name: string, userId: string) {
        return this.client.link_tags.findFirst({
            where: {
                name,
                userId
            }
        });
    }

    async findMany(where: Prisma.link_tagsWhereInput, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.link_tagsOrderByWithRelationInput;
        includeLinks?: boolean;
    }) {
        return this.client.link_tags.findMany({
            where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { name: 'asc' },
            ...(options?.includeLinks && {
                include: {
                    links: {
                        include: {
                            link: true
                        }
                    }
                }
            })
        });
    }

    async count(where: Prisma.link_tagsWhereInput) {
        return this.client.link_tags.count({
            where
        });
    }

    // Tag-Link relationship queries
    async findTagsByLinkId(linkId: string) {
        return this.client.link_rel_tags.findMany({
            where: { linkId },
            include: {
                tag: true
            }
        });
    }

    async findLinksByTagId(tagId: string, options?: {
        skip?: number;
        take?: number;
    }) {
        return this.client.link_rel_tags.findMany({
            where: { tagId },
            skip: options?.skip,
            take: options?.take,
            include: {
                link: true
            }
        });
    }

    async isTagAssignedToLink(linkId: string, tagId: string) {
        const relation = await this.client.link_rel_tags.findUnique({
            where: {
                linkId_tagId: {
                    linkId,
                    tagId
                }
            }
        });
        return relation !== null;
    }

    async countLinksByTagId(tagId: string) {
        return this.client.link_rel_tags.count({
            where: { tagId }
        });
    }

    async countTagsByLinkId(linkId: string) {
        return this.client.link_rel_tags.count({
            where: { linkId }
        });
    }
}
