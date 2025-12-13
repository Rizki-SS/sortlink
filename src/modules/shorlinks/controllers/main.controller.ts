import Elysia, { t } from "elysia";
import { successResponse } from "@/libs/http/response";
import { LinkShardsQuery } from "@/shorlinks/repositories/prisma/linksShards.query";
import { LinkQuery } from "@/shorlinks/repositories/prisma/links.query";
import AppStore from "@/libs/type/store.user";
import loader from "src/loader";
import { redirectionServiceFactory, RedirectionServiceFactory } from "../services/redirections.service.factory";

class MainLinkController {
    constructor(
        private repositoryFactory: RedirectionServiceFactory
    ) { }

    async handle({ params }: {
        params: { hash: string }
    }) {
        const service = this.repositoryFactory.createService(params.hash);
        return service.handle(params);
    }
}

const MainLinkFactory =
    new MainLinkController(redirectionServiceFactory)

export const sortlinkHandler = new Elysia()
    .use(loader)
    .decorate('mainLinkFactory', MainLinkFactory)
    .get("/:hash", async ({ params, store, mainLinkFactory }) => {
        return await mainLinkFactory
            .handle({ params })
    }, {
        params: t.Object({
            hash: t.String()
        })
    });