import Elysia, { Context } from "elysia";
import { linkServiceFactory, LinkServiceFactory } from "../../services/link.service.factory";
import { LinkCreation, LinkCreationSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";

class LinkCreateController {
    constructor(
        protected linkServiceFactory: LinkServiceFactory,
    ) {

    }
    async handle({ body, store }: {
        body: LinkCreation,
        store: AppStore
    }) {
        const service = this.linkServiceFactory.createService(
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
    }
}

const linkCreateFactory = new LinkCreateController(linkServiceFactory);

const linkCreate = new Elysia()
    .decorate('linkCreateFactory', linkCreateFactory)
    .post("/", async ({ store, body, linkCreateFactory }) => await linkCreateFactory.handle({
        store: store as AppStore,
        body: body as unknown as LinkCreation
    }), {
        body: LinkCreationSchema,
        store: true
    });

export default linkCreate;