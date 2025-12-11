import Elysia, { NotFoundError } from "elysia";
import ClientDB from "@/libs/databases/indext";
import { paginatedResponse, successResponse } from "@/libs/http/response";
import { DomainQuery } from "@/shorlinks/repositories/prisma/domains.query";
import { buildWhereClause, parsePagination, parseSorting } from "@/libs/utils/prisma.builder";
import domainParams from "@/shorlinks/requests/domain.params";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import AppStore from "@/libs/type/store.user";

export const domainFetch = new Elysia()
    .decorate("domainFactory", new RepositoryFactory(ClientDB))
    .get("/", async ({ domainFactory, query, store }) => {
        const repo = domainFactory.createScopedRepository(
            DomainQuery,
            { teamId: (store as AppStore).user.selected_teamId }
        );

        const { page, limit, skip } = parsePagination(query);
        const { sortBy, sortOrder } = parseSorting(query);
        const where = buildWhereClause(query, []);

        const { total, data } = await repo.findWithPagination({
            where,
            skip,
            limit,
            sortBy,
            sortOrder
        });

        return paginatedResponse(data, page, limit, total);
    }, {
        query: domainParams
    });