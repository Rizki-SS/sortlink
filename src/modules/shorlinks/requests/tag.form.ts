import { t } from "elysia";

const TagCreationSchema = t.Object({
    name: t.String({ minLength: 1, maxLength: 50 }),
});

const TagUpdateSchema = t.Object({
    name: t.String({ minLength: 1, maxLength: 50 }),
});

export type TagCreation = typeof TagCreationSchema;

export type TagUpdate = typeof TagUpdateSchema;

export {
    TagCreationSchema,
    TagUpdateSchema
};
