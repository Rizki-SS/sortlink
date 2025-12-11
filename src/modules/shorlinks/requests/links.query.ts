import { t } from "elysia";

const linkQuery = t.Object({
    page: t.Optional(t.String()),
    limit: t.Optional(t.String()),
    sortBy: t.Optional(t.String()),
    sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
    domainId: t.Optional(t.String()),
    hash: t.Optional(t.String()),
    search: t.Optional(t.String())
})

export type LinkQuery = typeof linkQuery;

export default linkQuery;