import Elysia from "elysia";
import { linkServiceFactory } from "../../services/link.service.factory";
import { LinkUpdateSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";

export const linkUpdate = new Elysia()
    .put("/:id", async ({ body, store, params }: any) => {
        const service = linkServiceFactory.createService(
            body.hashId,
            store.user.sub,
            store.user.selected_teamId
        );

        const link = await service.updateLink(
            params.id,
            body
        );

        return successResponse(link);
    }, {
        body: LinkUpdateSchema,
        store: true
    });