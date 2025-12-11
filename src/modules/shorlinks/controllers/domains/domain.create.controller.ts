import Elysia from "elysia";
import ClientDB from "@/libs/databases/indext";
import { DomainMutate } from "@/shorlinks/repositories/prisma/domain.mutate";
import domainCreateSchema from "@/shorlinks/requests/domain.form";
import AppStore from "@/libs/type/store.user";
import { successResponse } from "@/libs/http/response";
import { RepositoryFactory } from "@/libs/databases/repository.factory";

export const domainCreate = new Elysia()
    .decorate("domainFactory", new RepositoryFactory(ClientDB))
    .post("/", async ({ domainFactory, store, body }) => {
        const domainMutate = domainFactory.createScopedRepository(
            DomainMutate,
            { teamId: (store as AppStore).user.selected_teamId }
        );

        const newLink = await domainMutate.create({
            name: body.name,
            userId: (store as AppStore).user?.sub!,
            teamId: (store as AppStore).user?.selected_teamId || null,
            type: body.type,
        });

        return successResponse(newLink);
    }, {
        body: domainCreateSchema
    });