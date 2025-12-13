import Elysia, { t } from "elysia";
import { LinkTagSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import { tagServiceFactory, TagServiceFactory } from "@/shorlinks/services/tag.service.factory";

class LinkTagsRemoveController {
    constructor(
        protected tagServiceFactory: TagServiceFactory,
    ) { }

    async handle({ body, store, params }: {
        body: { tagName: string },
        store: AppStore,
        params: { id: string }
    }) {
        const service = this.tagServiceFactory.createService(
            store.user.sub,
            (store as AppStore).user.selected_teamId
        );

        const result = await service.removeTag(
            params.id,
            body.tagName
        );

        return successResponse(result);
    }
}

const linkTagsRemoveFactory = new LinkTagsRemoveController(tagServiceFactory);

export const linkTagsRemove = new Elysia()
    .decorate('linkTagsRemoveFactory', linkTagsRemoveFactory)
    .delete("/", async ({ body, store, params, linkTagsRemoveFactory }) => await linkTagsRemoveFactory.handle({
        store: store as AppStore,
        body,
        params
    }), {
        params: t.Object({
            id: t.String()
        }),
        body: LinkTagSchema,
        store: true
    });
