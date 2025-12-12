import Elysia from "elysia";
import { successResponse } from "@/libs/http/response";
import { LinkShardsQuery } from "@/shorlinks/repositories/prisma/linksShards.query";
import { LinkQuery } from "@/shorlinks/repositories/prisma/links.query";
import AppStore from "@/libs/type/store.user";
import loader from "../../../../loader";

class LinkFindController {
    constructor(
        private linkMetaRepo: LinkShardsQuery,
        private repositoryFactory: any
    ) {

    }

    async handle({ params, store }: {
        params: { id: string },
        store: AppStore
    }) {
        const link = await this.linkMetaRepo.findById(params.id);
        if (!link) {
            throw new Error("Link not found");
        }

        const linkRepo = this.repositoryFactory.createScopedRepository(
            LinkQuery,
            { teamId: store.user.selected_teamId },
            'links',
            link.shardKey as string
        );

        const fullLink = await linkRepo.findByHash(link.hashId);
        return successResponse({
            ...link,
            detail: { ...fullLink }
        });
    }
}

const LinkFindFactory = ({ store, repositoryFactory }: any) => {
    const linkMetaRepo = repositoryFactory.createScopedRepository(
        LinkShardsQuery,
        { teamId: (store as AppStore).user.selected_teamId }
    );

    return new LinkFindController(linkMetaRepo, repositoryFactory);
};

export const linkFind = new Elysia()
    .use(loader)
    .decorate('linkFindFactory', LinkFindFactory)
    .get("/:id", async ({ params, store, linkFindFactory, repositoryFactory }) => {
        return await linkFindFactory({ store, repositoryFactory }).handle({
            params,
            store: store as AppStore
        });
    });