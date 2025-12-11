import Elysia from "elysia";
import ClientDB from "@/libs/databases/indext";
import { successResponse } from "@/libs/http/response";
import { DomainQuery } from "@/shorlinks/repositories/prisma/domains.query";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import { LinkShardsQuery } from "@/shorlinks/repositories/prisma/linksShards.query";
import { LinkQuery } from "@/shorlinks/repositories/prisma/links.query";

export const linkFind = new Elysia()
    .decorate("linkFactory", new RepositoryFactory(ClientDB))
    .get("/:id", async ({ linkFactory, params, store }) => {
        const linkMetaRepo = linkFactory.createScopedRepository(
            LinkShardsQuery,
            { teamId: (store as any).user.selected_teamId }
        );
        
        const link = await linkMetaRepo.findById(params.id);
        if (!link) {
            throw new Error("Link not found");
        }

        const linkRepo = linkFactory.createScopedRepository(
            LinkQuery,
            { teamId: (store as any).user.selected_teamId },
            'links',
            link.shardKey as string
        );

        const fullLink = await linkRepo.findByHash(link.hashId);
        return successResponse({
            ...link,
            detail: { ...fullLink }
        });
    });