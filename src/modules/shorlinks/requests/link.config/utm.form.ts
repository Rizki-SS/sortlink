import { t } from "elysia";

const utmFormSchema = t.Object({
    utm_source: t.String(),
    utm_medium: t.String(),
    utm_campaign: t.String(),
    utm_term: t.String(),
    utm_content: t.String(),
});

export type UtmForm = typeof utmFormSchema;

export default utmFormSchema;