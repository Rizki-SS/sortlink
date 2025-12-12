import Elysia, { NotFoundError } from "elysia";
import { successResponse } from "@/libs/http/response";
import { DomainQuery } from "@/shorlinks/repositories/prisma/domains.query";
import AppStore from "@/libs/type/store.user";
import loader from "../../../../loader";

class DomainFindController {
    constructor(
        private domainQuery: DomainQuery
    ) {

    }

    async handle({ params }: {
        params: { id: string }
    }) {
        const domain = await this.domainQuery.findById(params.id);
        if (!domain) {
            throw new NotFoundError('Domain not found');
        }

        return successResponse(domain);
    }
}

const DomainFindFactory = ({ store, repositoryFactory }: any) => {
    const domainQuery = repositoryFactory.createScopedRepository(
        DomainQuery,
        { teamId: (store as AppStore).user.selected_teamId }
    );

    return new DomainFindController(domainQuery);
};

export const domainFind = new Elysia()
    .use(loader)
    .decorate('domainFindFactory', DomainFindFactory)
    .get("/:id", async ({ params, store, domainFindFactory, repositoryFactory }) => {
        return await domainFindFactory({ store, repositoryFactory }).handle({
            params
        });
    });