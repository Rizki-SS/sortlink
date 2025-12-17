import { RepositoryFactory } from "@/libs/databases/repository.factory";
import ClientDB from "@/libs/databases/indext";
import { UtmService, UtmServiceDependencies } from "./utm.service.class";
import { UtmMutate } from "@/shorlinks/repositories/prisma/link-configs/utm.mutate";
import { LinkShardsQuery } from "@/shorlinks/repositories/prisma/linksShards.query";
import { ConsistentHashFactory } from "@/shorlinks/libs/hash";
import { LinkQuery } from "@/shorlinks/repositories/prisma/links.query";

export class UtmServiceFactory {
    constructor(
        private repoFactory: RepositoryFactory,
        private hashFactory: typeof ConsistentHashFactory
    ) { }

    createService(hash: string, userId: string, teamId?: string): UtmService {
        const shard = this.hashFactory.getNode(hash);

        const deps: UtmServiceDependencies = {
            utmMutateRepo: this.repoFactory.createScopedRepository(
                UtmMutate,
                { userId: userId, teamId: teamId },
                'links',
                shard
            ),
            linkQueryRepo: this.repoFactory.createScopedRepository(
                LinkQuery,
                { userId: userId, teamId: teamId },
                'links',
                shard
            ),
        };

        return new UtmService(deps);
    }
}

// Export singleton
export const utmServiceFactory = new UtmServiceFactory(
    new RepositoryFactory(ClientDB),
    ConsistentHashFactory
);
