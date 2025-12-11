import Elysia, { NotFoundError } from "elysia";
import ClientDB from "@/libs/databases/indext";
import { successResponse } from "@/libs/http/response";
import { DomainQuery } from "@/shorlinks/repositories/prisma/domains.query";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import AppStore from "@/libs/type/store.user";

export const domainFind = new Elysia()
    .decorate("domainFactory", new RepositoryFactory(ClientDB))
    .get("/:id", async ({ domainFactory, params, store }) => {
        const domainQuery = domainFactory.createScopedRepository(
            DomainQuery,
            { teamId: (store as AppStore).user.selected_teamId }
        );

        const domain = await domainQuery.findById(params.id);
        if (!domain) {
            throw new NotFoundError('Domain not found');
        }

        return successResponse(domain);
    });