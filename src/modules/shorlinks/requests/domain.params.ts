import { t } from "elysia";

const domainParams = t.Object({
    page: t.Optional(t.String()),
    limit: t.Optional(t.String()),
    sortBy: t.Optional(t.String()),
    sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
    search: t.Optional(t.String())
})

export type DomainParams = typeof domainParams;

export default domainParams;