import ClientDB from "@/libs/databases/indext";
import Elysia, { t } from "elysia";
import linkQuery from "../../requests/links.query";
import link from "../../data/link";
import { paginatedResponse } from "@/libs/http/response";
import { buildWhereClause, parsePagination, parseSorting } from "@/libs/utils/prisma.builder";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import AppStore from "@/libs/type/store.user";
import { LinkShardsQuery } from "@/shorlinks/repositories/prisma/linksShards.query";
import { serializeBigInt } from "@/libs/utils/bigint.serializer";
import loader from "../../../../loader";

const applyDomainFilter = (where: any, query?: any) =>
    query?.domainId ? { ...where, domainId: query.domainId } : where;

const applyHashFilter = (where: any, query?: any) =>
    query?.hash ? { ...where, hash: query.hash } : where;

const applySearchFilter = (where: any, query?: any) =>
    query?.search ? { ...where, url: { contains: query.search } } : where;

class LinkGetController {
    constructor(
        private repositories: LinkShardsQuery
    ) {

    }

    async handle({ query }: {
        query: any
    }) {
        const { page, limit, skip } = parsePagination(query);
        const { sortBy, sortOrder } = parseSorting(query);
        const where = buildWhereClause(query, [
            applyDomainFilter,
            applyHashFilter,
            applySearchFilter
        ]);

        const { total, data } = await this.repositories.findWithPagination({
            where,
            skip,
            limit,
            sortBy,
            sortOrder
        });

        return paginatedResponse(serializeBigInt(data), page, limit, total);
    }
}

const LinkGetFactory = ({ store, repositoryFactory }: any) => {
    const repositories = repositoryFactory.createScopedRepository(LinkShardsQuery, {
        teamId: (store as AppStore).user.selected_teamId
    });

    return new LinkGetController(repositories);
};


export const linkGet = new Elysia()
    .use(loader)
    .decorate('linkGetFactory', LinkGetFactory)
    .get("/", async ({ query, store, linkGetFactory, repositoryFactory }) => {
        return await linkGetFactory({ store, repositoryFactory }).handle({
            query
        });
    }, {
        body: link,
        query: linkQuery
    });