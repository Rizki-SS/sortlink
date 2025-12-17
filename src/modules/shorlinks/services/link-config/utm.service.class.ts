import { UtmBody } from "@/shorlinks/data/utm.link";
import { UtmMutate } from "@/shorlinks/repositories/prisma/link-configs/utm.mutate";
import { LinkQuery } from "@/shorlinks/repositories/prisma/links.query";
import { NotFoundError } from "src/types";

export interface UtmServiceDependencies {
    utmMutateRepo: UtmMutate;
    linkQueryRepo: LinkQuery
}


export class UtmService {
    constructor(
        private deps: UtmServiceDependencies,
    ) { }

    async update({
        hashId,
        domainId,
        body
    }: {
        hashId: string;
        domainId: string;
        body: UtmBody;
    }) {
        const link = await this.deps.linkQueryRepo.findByHash(hashId, domainId);
        if (!link) {
            throw new NotFoundError('Link not found');
        }

        this.deps.utmMutateRepo.updateOrCreate(Number(link.id), {
            utmCampaign: body.utm_campaign,
            utmMedium: body.utm_medium,
            utmSource: body.utm_source,
            utmTerm: body.utm_term,
            utmContent: body.utm_content,
            link: {
                connect: {
                    id: link.id
                }
            }
        });
    }
}
