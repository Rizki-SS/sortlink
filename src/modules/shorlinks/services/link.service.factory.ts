import { RepositoryFactory } from "@/libs/databases/repository.factory";
import ClientDB from "@/libs/databases/indext";
import { LinkService, LinkServiceDependencies } from "./link.service.class";
import { DomainQuery } from "../repositories/prisma/domains.query";
import { LinkMutate } from "../repositories/prisma/link.mutate";
import { LinkQuery } from "../repositories/prisma/links.query";
import { ConsistentHashFactory } from "../libs/hash";
import { LinkShardMutate } from "../repositories/prisma/linksShard.mutate";
import { LinkShardsQuery } from "../repositories/prisma/linksShards.query";

export class LinkServiceFactory {
    constructor(
        private repoFactory: RepositoryFactory,
        private hashFactory: typeof ConsistentHashFactory
    ) { }

    createService(hash: string, userId: string, teamId?: string): LinkService {
        const shard = this.hashFactory.getNode(hash);

        const deps: LinkServiceDependencies = {
            linkMutateRepo: this.repoFactory.createScopedRepository(
                LinkMutate,
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
            linkShardMutateRepo: this.repoFactory.createScopedRepository(
                LinkShardMutate,
                { userId: userId, teamId: teamId },
                'main'
            ),
            linkShardQueryRepo: this.repoFactory.createScopedRepository(
                LinkShardsQuery,
                { userId: userId, teamId: teamId },
                'main'
            ),
            domainQueryRepo: this.repoFactory.createScopedRepository(
                DomainQuery,
                { userId: userId, teamId: teamId },
                'main'
            ),
        };

        return new LinkService(deps, shard);
    }
}

// Export singleton
export const linkServiceFactory = new LinkServiceFactory(
    new RepositoryFactory(ClientDB),
    ConsistentHashFactory
);
