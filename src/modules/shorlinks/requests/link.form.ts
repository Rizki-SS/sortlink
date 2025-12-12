import { t } from "elysia";

const LinkCreationSchema = t.Object({
    url: t.String(),
    hash: t.String(),
    domainId: t.String(),
    folderId: t.Optional(t.String()),
});

const LinkUpdateSchema = t.Object({
    hashId: t.String(),
    url: t.String(),
    folderId: t.Optional(t.String()),
});

export type LinkCreation = typeof LinkCreationSchema;

export type LinkUpdate = typeof LinkUpdateSchema;

export {
    LinkCreationSchema,
    LinkUpdateSchema
};