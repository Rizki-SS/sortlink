import Elysia from "elysia";
import { linkServiceFactory, LinkServiceFactory } from "../../services/link.service.factory";
import { LinkUpdateSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";

class LinkUpdateController {
    constructor(
        protected linkServiceFactory: LinkServiceFactory,
    ) {

    }

    async handle({ body, store, params }: {
        body: any,
        store: AppStore,
        params: { id: string }
    }) {
        const service = this.linkServiceFactory.createService(
            body.hashId,
            store.user.sub,
            store.user.selected_teamId
        );

        const link = await service.updateLink(
            params.id,
            body
        );

        return successResponse(link);
    }
}

const linkUpdateFactory = new LinkUpdateController(linkServiceFactory);

export const linkUpdate = new Elysia()
    .decorate('linkUpdateFactory', linkUpdateFactory)
    .put("/:id", async ({ body, store, params, linkUpdateFactory }) => await linkUpdateFactory.handle({
        store: store as AppStore,
        body,
        params
    }), {
        body: LinkUpdateSchema,
        store: true
    });