import { NotFoundError } from "../../../types/errors";
import { LinkShardsQuery } from "../repositories/prisma/linksShards.query";
import { LinkQuery } from "../repositories/prisma/links.query";
import { redirectionResponse, successResponse } from "@/libs/http/response";
import Redis from "ioredis";
import { DomainQuery } from "../repositories/prisma/domains.query";
import { LinkAction, utmRedirectAction } from "../actions/redirect";
import { pipe } from "@/libs/utils/pipeline";

export interface RedirectionServiceDependencies {
    linkQueryRepo: LinkQuery;
    redisClient: Redis,
    domainQueryRepo: DomainQuery
}

const REDIS_CACHE_KEY = (hash: string, domainId: string) => `sortlink-cache-${hash}-${domainId}`;

type LinkFound = Awaited<ReturnType<LinkQuery["findByHash"]>>;

export class RedirectionService {
    constructor(
        private deps: RedirectionServiceDependencies,
    ) { }

    async handle({
        hash,
        domainId
    }: {
        hash: string,
        domainId: string
    }) {
        const cachedLink = await this.deps.redisClient.get(REDIS_CACHE_KEY(hash, domainId));

        let link: LinkFound | null = null;
        if (cachedLink) {
            link = JSON.parse(cachedLink) as LinkFound;
        } else {
            const domain = await this.deps.domainQueryRepo.findByDomain(domainId);
            if (!domain) {
                throw new NotFoundError("Domain not found");
            }

            link = await this.deps.linkQueryRepo.findByHash(hash, domain.id)
            await this.deps.redisClient.set(REDIS_CACHE_KEY(hash, domain.id), JSON.stringify(link), 'EX', 3600);
        }

        if (!link) {
            throw new NotFoundError("Link not found");
        }

        const url = pipe(
            utmRedirectAction,
        )(link).url;

        return redirectionResponse(url);
    }
}