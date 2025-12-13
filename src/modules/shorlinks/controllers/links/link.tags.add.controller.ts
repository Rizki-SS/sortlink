import Elysia, { t } from "elysia";
import { LinkTagSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import { TagServiceFactory, tagServiceFactory } from "@/shorlinks/services/tag.service.factory";

class TagAddController {
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

        const result = await service.addTag(
            params.id,
            body.tagName,
            (store as AppStore).user.sub
        );

        return successResponse(result);
    }
}

const tagAddController = new TagAddController(tagServiceFactory);

export const linkTagsAdd = new Elysia()
    .decorate('tagAddController', tagAddController)
    .post("/", async ({ body, store, params, tagAddController }) => await tagAddController.handle({
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
