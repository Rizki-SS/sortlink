import Elysia from "elysia";
import { DomainMutate } from "@/shorlinks/repositories/prisma/domain.mutate";
import domainCreateSchema from "@/shorlinks/requests/domain.form";
import AppStore from "@/libs/type/store.user";
import { successResponse } from "@/libs/http/response";
import loader from "../../../../loader";

class DomainCreateController {
    constructor(
        private domainMutate: DomainMutate
    ) {

    }

    async handle({ body, store }: {
        body: any,
        store: AppStore
    }) {
        const newDomain = await this.domainMutate.create({
            name: body.name,
            userId: store.user.sub,
            teamId: store.user.selected_teamId || null,
            type: body.type,
        });

        return successResponse(newDomain);
    }
}

const DomainCreateFactory = ({ store, repositoryFactory }: any) => {
    const domainMutate = repositoryFactory.createScopedRepository(
        DomainMutate,
        { teamId: (store as AppStore).user.selected_teamId }
    );

    return new DomainCreateController(domainMutate);
};

export const domainCreate = new Elysia()
    .use(loader)
    .decorate('domainCreateFactory', DomainCreateFactory)
    .post("/", async ({ body, store, domainCreateFactory, repositoryFactory }) => {
        return await domainCreateFactory({ store, repositoryFactory }).handle({
            body,
            store: store as AppStore
        });
    }, {
        body: domainCreateSchema
    });