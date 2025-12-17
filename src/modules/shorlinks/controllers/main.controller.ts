import Elysia, { t } from "elysia";
import { redirectionResponse, successResponse } from "@/libs/http/response";
import loader from "src/loader";
import { redirectionServiceFactory, RedirectionServiceFactory } from "../services/redirections.service.factory";

class MainLinkController {
    constructor(
        private repositoryFactory: RedirectionServiceFactory
    ) { }

    async handle({ params, domainId }: {
        params: { hash: string },
        domainId: string
    }) {
        const service = this.repositoryFactory.createService(params.hash);
        return await service.handle({
            hash: params.hash,
            domainId: domainId
        });
    }
}

const MainLinkFactory =
    new MainLinkController(redirectionServiceFactory)

export const sortlinkHandler = new Elysia()
    .use(loader)
    .decorate('mainLinkFactory', MainLinkFactory)
    .get("/:hash", async ({ params, mainLinkFactory, headers }) => {
        return await mainLinkFactory
            .handle({ params, domainId: headers.host ?? '' })
    }, {
        params: t.Object({
            hash: t.String()
        }),
    });