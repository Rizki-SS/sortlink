import Elysia from "elysia";
import { linkServiceFactory } from "../../services/link.service.factory";
import { LinkCreationSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";

export const linkCreate = new Elysia()
    .post("/", async ({ body, store }: any) => {
        const service = linkServiceFactory.createService(
            body.hash,
            store.user.sub,
            store.user.selected_teamId
        );

        const link = await service.createLink(
            body,
            store.user.sub,
            store.user.selected_teamId
        );

        return successResponse(link);
    }, {
        body: LinkCreationSchema,
        store: true
    });