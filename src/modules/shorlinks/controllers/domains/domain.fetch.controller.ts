import Elysia from "elysia";
import { paginatedResponse } from "@/libs/http/response";
import { DomainQuery } from "@/shorlinks/repositories/prisma/domains.query";
import { buildWhereClause, parsePagination, parseSorting } from "@/libs/utils/prisma.builder";
import domainParams from "@/shorlinks/requests/domain.params";
import AppStore from "@/libs/type/store.user";
import loader from "../../../../loader";

class DomainFetchController {
    constructor(
        private domainQuery: DomainQuery
    ) {

    }

    async handle({ query }: {
        query: any
    }) {
        const { page, limit, skip } = parsePagination(query);
        const { sortBy, sortOrder } = parseSorting(query);
        const where = buildWhereClause(query, []);

        const { total, data } = await this.domainQuery.findWithPagination({
            where,
            skip,
            limit,
            sortBy,
            sortOrder
        });

        return paginatedResponse(data, page, limit, total);
    }
}

const DomainFetchFactory = ({ store, repositoryFactory }: any) => {
    const domainQuery = repositoryFactory.createScopedRepository(
        DomainQuery,
        { teamId: (store as AppStore).user.selected_teamId }
    );

    return new DomainFetchController(domainQuery);
};

export const domainFetch = new Elysia()
    .use(loader)
    .decorate('domainFetchFactory', DomainFetchFactory)
    .get("/", async ({ query, store, domainFetchFactory, repositoryFactory }) => {
        return await domainFetchFactory({ store, repositoryFactory }).handle({
            query
        });
    }, {
        query: domainParams
    });