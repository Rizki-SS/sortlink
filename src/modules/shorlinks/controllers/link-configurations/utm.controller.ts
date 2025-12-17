import Elysia, { t } from "elysia";
import { LinkTagSchema } from "../../requests/link.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import utmFormSchema from "@/shorlinks/requests/link.config/utm.form";
import { UtmBody } from "@/shorlinks/data/utm.link";
import { UtmServiceFactory, utmServiceFactory } from "@/shorlinks/services/link-config/utm.service.factory";
import { LinkShardsQuery } from "@/shorlinks/repositories/prisma/linksShards.query";
import { NotFoundError } from "src/types";
import loader from "src/loader";

class UtmController {
    constructor(
        private linkMetaRepo: LinkShardsQuery,
        protected utmServiceFactory: UtmServiceFactory,
    ) { }

    async handle({ body, store, params }: {
        body: UtmBody,
        store: AppStore,
        params: { id: string }
    }) {
        const link = await this.linkMetaRepo.findById(params.id);
        if (!link) {
            throw new NotFoundError("Link not found");
        }

        const service = this.utmServiceFactory.createService(
            link.hashId,
            store.user.sub,
            store.user.selected_teamId
        );

        const result = await service.update({
            hashId: link.hashId,
            domainId: link.domainId,
            body
        });

        return successResponse(result);
    }
}

const utmControllerFactory = ({ store, repositoryFactory }: any) => {
    const linkMetaRepo = repositoryFactory.createScopedRepository(
        LinkShardsQuery,
        { teamId: (store as AppStore).user.selected_teamId }
    );

    return new UtmController(linkMetaRepo, utmServiceFactory);
};

export const updateUtm = new Elysia()
    .use(loader)
    .decorate('utmController', utmControllerFactory)
    .post("/utm", async ({ body, store, params, utmController, repositoryFactory }) => {
        return await utmController({ store, repositoryFactory }).handle({
            store: store as AppStore,
            body,
            params
        })
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: utmFormSchema,
        store: true
    });