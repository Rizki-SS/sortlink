import Elysia from "elysia";
import { linkServiceFactory, LinkServiceFactory } from "../../services/link.service.factory";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";

class LinkDeleteController {
    constructor(
        protected linkServiceFactory: LinkServiceFactory,
    ) {

    }

    async handle({ store, params, hashId }: {
        store: AppStore,
        params: { id: string },
        hashId: string
    }) {
        const service = this.linkServiceFactory.createService(
            hashId,
            store.user.sub,
            store.user.selected_teamId
        );

        await service.deleteLink(params.id);
        return successResponse({ message: "Link deleted successfully" });
    }
}

const linkDeleteFactory = new LinkDeleteController(linkServiceFactory);

export const linkDelete = new Elysia()
    .decorate("linkDeleteFactory", linkDeleteFactory)
    .delete("/:id", async ({ body, store, params, linkDeleteFactory }) => await linkDeleteFactory.handle({
        store: store as AppStore,
        params,
        hashId: (body as any)?.hashId
    }));