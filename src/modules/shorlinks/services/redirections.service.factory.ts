import { RepositoryFactory } from "@/libs/databases/repository.factory";
import ClientDB from "@/libs/databases/indext";
import { LinkQuery } from "../repositories/prisma/links.query";
import { ConsistentHashFactory } from "../libs/hash";
import { RedirectionService, RedirectionServiceDependencies } from "./redirections.service.class";
import { redisClient } from "src/config/redis";
import { DomainQuery } from "../repositories/prisma/domains.query";

export class RedirectionServiceFactory {
    constructor(
        private repoFactory: RepositoryFactory,
        private hashFactory: typeof ConsistentHashFactory
    ) { }

    createService(hash: string): RedirectionService {
        const shard = this.hashFactory.getNode(hash);

        const deps: RedirectionServiceDependencies = {
            linkQueryRepo: this.repoFactory.createRepository(
                LinkQuery,
                'links',
                shard
            ),
            redisClient: redisClient,
            domainQueryRepo: this.repoFactory.createRepository(
                DomainQuery,
                'main'
            )
        };

        return new RedirectionService(deps);
    }
}

// Export singleton
export const redirectionServiceFactory = new RedirectionServiceFactory(
    new RepositoryFactory(ClientDB),
    ConsistentHashFactory
);
