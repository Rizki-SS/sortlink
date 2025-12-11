import { t } from "elysia";

const link = t.Object({
    id: t.String(),
    hash: t.String(),
    url: t.String(),
    domainId: t.String(),
    userId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date()
})

export type Link = typeof link;

export default link;