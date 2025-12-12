import Elysia from "elysia";
import folderQuery from "../../requests/folder.query";
import { paginatedResponse } from "@/libs/http/response";
import { buildWhereClause, parsePagination, parseSorting } from "@/libs/utils/prisma.builder";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import AppStore from "@/libs/type/store.user";
import { FolderQuery } from "@/shorlinks/repositories/prisma/folder.query";
import loader from "../../../../loader";

const applyParentIdFilter = (where: any, query?: any) =>
    query?.parentId !== undefined
        ? { ...where, parentId: query.parentId === 'null' ? null : query.parentId }
        : where;

const applySearchFilter = (where: any, query?: any) =>
    query?.search ? { ...where, name: { contains: query.search, mode: 'insensitive' } } : where;

class FolderGetController {
    constructor(
        private folderQuery: FolderQuery,
        private userId: string,
        private teamId?: string | null
    ) { }

    async handle({ query }: {
        query: any
    }) {
        const { page, limit, skip } = parsePagination(query);
        const { sortBy, sortOrder } = parseSorting(query);

        let where: any = {
            userId: this.userId
        };

        if (this.teamId) {
            where.teamId = this.teamId;
        }

        where = buildWhereClause(query, [
            applyParentIdFilter,
            applySearchFilter
        ]);

        const [data, total] = await Promise.all([
            this.folderQuery.findMany(where, {
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder }
            }),
            this.folderQuery.count(where)
        ]);

        return paginatedResponse(data, page, limit, total);
    }
}

const FolderGetFactory = ({ store, repositoryFactory }: any) => {
    const folderQuery = repositoryFactory.createRepository(FolderQuery);

    return new FolderGetController(
        folderQuery,
        (store as AppStore).user.sub,
        (store as AppStore).user.selected_teamId
    );
};

export const folderGet = new Elysia()
    .use(loader)
    .decorate('folderGetFactory', FolderGetFactory)
    .get("/", async ({ query, store, folderGetFactory, repositoryFactory }) => {
        return await folderGetFactory({ store, repositoryFactory }).handle({
            query
        });
    }, {
        query: folderQuery,
        store: true
    });
