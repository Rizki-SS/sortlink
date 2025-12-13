import { RepositoryFactory } from "@/libs/databases/repository.factory";
import ClientDB from "@/libs/databases/indext";
import { TagService, TagServiceDependencies } from "./tag.service.class";
import { LinkShardMutate } from "../repositories/prisma/linksShard.mutate";
import { LinkShardsQuery } from "../repositories/prisma/linksShards.query";

export class TagServiceFactory {
    constructor(
        private repoFactory: RepositoryFactory,
    ) { }

    createService(userId: string, teamId?: string): TagService {
        const deps: TagServiceDependencies = {
            linkShardMutateRepo: this.repoFactory.createScopedRepository(
                LinkShardMutate,
                { userId: userId, teamId: teamId },
                'main'
            ),
            linkShardQueryRepo: this.repoFactory.createScopedRepository(
                LinkShardsQuery,
                { userId: userId, teamId: teamId },
                'main'
            )
        };

        return new TagService(deps);
    }
}

// Export singleton
export const tagServiceFactory = new TagServiceFactory(
    new RepositoryFactory(ClientDB),
);
