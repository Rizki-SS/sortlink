import { t } from "elysia";

const tagQuery = t.Object({
    search: t.Optional(t.String()),
    page: t.Optional(t.String()),
    limit: t.Optional(t.String()),
    sortBy: t.Optional(t.String()),
    sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
});

export default tagQuery;
