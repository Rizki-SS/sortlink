import { t } from "elysia";

const domainCreateSchema = t.Object({
    name: t.String(),
    type: t.Enum({ PUBLIC: "PUBLIC", PRIVATE: "PRIVATE" }, { default: "PUBLIC" }),
});

export type DomainCreation = typeof domainCreateSchema;

export default domainCreateSchema;