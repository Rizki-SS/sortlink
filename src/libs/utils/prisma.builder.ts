import AppStore from "../type/store.user";

type PaginationParams = {
    where: any;
    skip: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};

const buildWhereClause = (query: any, filterFns: any[]) => {
    return filterFns.reduce((where, filterFn) => {
        return filterFn(where, query);
    }, {});
};

const parsePagination = (query: any) => {
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

const parseSorting = (query: any): { sortBy: string; sortOrder: 'asc' | 'desc' } => ({
    sortBy: (query.sortBy as string) || 'createdAt',
    sortOrder: ((query.sortOrder as string) || 'desc') as 'asc' | 'desc'
});

export { 
    buildWhereClause, 
    parsePagination, 
    parseSorting,
    PaginationParams,
    filterByTeam
};