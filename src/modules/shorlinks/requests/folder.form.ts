import { t } from "elysia";

const FolderCreationSchema = t.Object({
    name: t.String({ minLength: 1, maxLength: 255 }),
    parentId: t.Optional(t.String()),
});

const FolderUpdateSchema = t.Object({
    name: t.String({ minLength: 1, maxLength: 255 }),
    parentId: t.Optional(t.String()),
});

export type FolderCreation = typeof FolderCreationSchema;

export type FolderUpdate = typeof FolderUpdateSchema;

export {
    FolderCreationSchema,
    FolderUpdateSchema
};
