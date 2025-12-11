import Elysia from "elysia";
import { linkServiceFactory } from "../../services/link.service.factory";
import { successResponse } from "@/libs/http/response";

export const linkDelete = new Elysia()
    .delete("/:id", async ({ body, store, params }: any) => {
        const service = linkServiceFactory.createService(
            body.hashId,
            store.user.sub,
            store.user.selected_teamId
        );

        await service.deleteLink(params.id);
        return successResponse({ message: "Link deleted successfully" });
    });