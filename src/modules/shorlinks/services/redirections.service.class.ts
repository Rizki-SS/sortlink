import { NotFoundError } from "../../../types/errors";
import { LinkShardsQuery } from "../repositories/prisma/linksShards.query";
import { LinkQuery } from "../repositories/prisma/links.query";
import { redirectionResponse } from "@/libs/http/response";
import Redis from "ioredis";

export interface RedirectionServiceDependencies {
    linkQueryRepo: LinkQuery;
    redisClient: Redis
}

const REDIS_CACHE_KEY = (hash: string) => `sortlink-cache-${hash}`;

type LinkFound = Awaited<ReturnType<LinkQuery["findByHash"]>>;

export class RedirectionService {
    constructor(
        private deps: RedirectionServiceDependencies,
    ) { }

    async handle({
        hash
    }: {
        hash: string
    }) {
        const cachedLink = await this.deps.redisClient.get(REDIS_CACHE_KEY(hash));

        let link: LinkFound | null = null;
        if (cachedLink) {
            link = JSON.parse(cachedLink) as LinkFound;
        } else {
            link = await this.deps.linkQueryRepo.findByHash(hash)
            await this.deps.redisClient.set(REDIS_CACHE_KEY(hash), JSON.stringify(link), 'EX', 3600);
        }

        if (!link) {
            throw new NotFoundError("Link not found");
        }

        return link.url;
    }
}
