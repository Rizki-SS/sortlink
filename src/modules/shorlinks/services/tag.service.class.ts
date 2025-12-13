import { NotFoundError } from "../../../types/errors";
import { LinkShardsQuery } from "../repositories/prisma/linksShards.query";
import { LinkShardMutate } from "../repositories/prisma/linksShard.mutate";

export interface TagServiceDependencies {
    linkShardMutateRepo: LinkShardMutate;
    linkShardQueryRepo: LinkShardsQuery;
}

export class TagService {
    constructor(
        private deps: TagServiceDependencies,
    ) { }

    async addTag(id: string, tagName: string, userId: string) {
        const link = await this.deps.linkShardQueryRepo.findById(id);
        if (!link) {
            throw new NotFoundError(`Link with id ${id} not found`);
        }
        return this.deps.linkShardMutateRepo.linkRelTagsCreate(id, tagName, userId);
    }

    async removeTag(id: string, tagName: string) {
        const link = await this.deps.linkShardQueryRepo.findById(id);
        if (!link) {
            throw new NotFoundError(`Link with id ${id} not found`);
        }
        return this.deps.linkShardMutateRepo.linkRelTagsDelete(id, tagName);
    }
}
