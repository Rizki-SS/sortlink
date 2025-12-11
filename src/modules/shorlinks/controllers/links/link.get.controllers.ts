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

const applyDomainFilter = (where: any, query?: any) => 
    query?.domainId ? { ...where, domainId: query.domainId } : where;

const applyHashFilter = (where: any, query?: any) => 
    query?.hash ? { ...where, hash: query.hash } : where;

const applySearchFilter = (where: any, query?: any) => 
    query?.search ? { ...where, url: { contains: query.search } } : where;

export const linkGet  = new Elysia()
    .decorate("linkFactory", new RepositoryFactory(ClientDB))
    .get("/", async ({ linkFactory, query, store }) => {
        const repositories = linkFactory.createScopedRepository(LinkShardsQuery, {
            teamId: (store as AppStore).user.selected_teamId
        });

        const { page, limit, skip } = parsePagination(query);
        const { sortBy, sortOrder } = parseSorting(query);
        const where = buildWhereClause(query, [
            applyDomainFilter,
            applyHashFilter,
            applySearchFilter
        ]);

        const { total, data } = await repositories.findWithPagination({
            where,
            skip,
            limit,
            sortBy,
            sortOrder
        });
        
        return paginatedResponse(serializeBigInt(data), page, limit, total);
    }, { 
        body: link,
        query: linkQuery
    });