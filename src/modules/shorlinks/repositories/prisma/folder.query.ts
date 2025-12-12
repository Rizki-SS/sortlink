import { Prisma, PrismaClient } from "prisma/src/generated/main/prisma/client";

export class FolderQuery {
    constructor(private client: PrismaClient) { }

    async findById(id: string) {
        return this.client.links_folders.findUnique({
            where: { id },
            include: {
                links: true,
                children: true,
                parent: true
            }
        });
    }

    async findByUserId(userId: string, options?: {
        parentId?: string | null;
        teamId?: string | null;
    }) {
        return this.client.links_folders.findMany({
            where: {
                userId,
                ...(options?.parentId !== undefined && { parentId: options.parentId }),
                ...(options?.teamId !== undefined && { teamId: options.teamId })
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findByParentId(parentId: string | null, userId: string) {
        return this.client.links_folders.findMany({
            where: {
                parentId,
                userId
            },
            orderBy: {
                name: 'asc'
            }
        });
    }

    async findByTeamId(teamId: string) {
        return this.client.links_folders.findMany({
            where: { teamId },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findMany(where: Prisma.links_foldersWhereInput, options?: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.links_foldersOrderByWithRelationInput;
    }) {
        return this.client.links_folders.findMany({
            where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' }
        });
    }

    async count(where: Prisma.links_foldersWhereInput) {
        return this.client.links_folders.count({
            where
        });
    }
}
