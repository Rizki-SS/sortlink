import { t } from "elysia";

const pagination = t.Object({
    page: t.Number(),
    limit: t.Number(),
    total: t.Number(),
    totalPages: t.Number(),
    hasMore: t.Boolean()
})

export type Pagination = typeof pagination;

export type PaginationData = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
};

// Response formatters
export const successResponse = <T>(data: T, paginationData?: PaginationData) => ({
    success: true,
    data,
    ...(paginationData && { pagination: paginationData })
});

export const errorResponse = (message: string, errors?: any) => ({
    success: false,
    message,
    ...(errors && { errors })
});

export const paginatedResponse = <T>(
    data: T[],
    page: number,
    limit: number,
    total: number
) => ({
    success: true,
    data,
    meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: (page - 1) * limit + data.length < total
    }
});