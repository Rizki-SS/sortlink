import { DomainQuery } from "../repositories/prisma/domains.query";
import { LinkMutate } from "../repositories/prisma/link.mutate";
import { LinkQuery } from "../repositories/prisma/links.query";
import { NotFoundError, ValidationError } from "../../../types/errors";
import CRC32 from "crc-32";
import { LinkShardsQuery } from "../repositories/prisma/linksShards.query";
import { LinkShardMutate } from "../repositories/prisma/linksShard.mutate";
import { LinkCreation, LinkUpdate } from "../requests/link.form";

export interface LinkServiceDependencies {
    linkMutateRepo: LinkMutate;
    linkQueryRepo: LinkQuery;
    linkShardMutateRepo: LinkShardMutate;
    linkShardQueryRepo: LinkShardsQuery;
    domainQueryRepo: DomainQuery;
}

export class LinkService {
    constructor(
        private deps: LinkServiceDependencies,
        private shard: string
    ) { }

    async createLink(input: LinkCreation, userId: string, teamId?: string) {
        const domain = await this.deps.domainQueryRepo.findById(input.domainId);
        if (!domain) {
            throw new NotFoundError(`Domain with id ${input.domainId} not found`);
        }

        if (!this.isValidUrl(input.url)) {
            throw new ValidationError("Invalid URL format");
        }

        // Generate hash if not provided
        const hash = input.hash || this.generateHash(input.url);

        // Check if hash already exists
        const existingLink = await this.deps.linkShardQueryRepo.findByHash(hash);
        if (existingLink) {
            throw new ValidationError(`Hash ${hash} already exists`);
        }

        await this.deps.linkMutateRepo.create({
            hashId: hash,
            url: input.url,
            domainId: input.domainId,
            userId,
            teamId: teamId || null,
        })

        // Create link
        return this.deps.linkShardMutateRepo.create({
            hashId: hash,
            shardKey: this.shard,
            domainId: input.domainId,
            hashRange: CRC32.str(hash) >>> 0,
            userId,
            teamId: teamId || null,
        });
    }

    async getLinkByHash(hash: string) {

    }

    async updateLink(id: string, data: LinkUpdate) {
        const linkMeta = await this.deps.linkShardQueryRepo.findById(id);
        if (!linkMeta || linkMeta.hashId !== data.hashId) {
            throw new NotFoundError(`Link with id ${id} not found`);
        }

        await this.deps.linkShardMutateRepo.update(id, {
            folder: data.folderId ? { connect: { id: data.folderId } } : undefined
        })

        const link_updated = await this.deps.linkMutateRepo.updateByHash(linkMeta.hashId, {
            url: data.url
        });

        return {
            ...linkMeta,
            detail: { ...link_updated }
        }
    }

    async deleteLink(id: string) {
        const linkMeta = await this.deps.linkShardQueryRepo.findById(id);
        if (!linkMeta) {
            throw new NotFoundError(`Link with id ${id} not found`);
        }

        await this.deps.linkMutateRepo.deleteByHash(linkMeta.hashId);
        await this.deps.linkShardMutateRepo.delete(id);
    }

    private generateHash(url: string, length: number = 8): string {
        const crc = CRC32.str(url + Date.now());
        return Math.abs(crc).toString(36).substring(0, length);
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
