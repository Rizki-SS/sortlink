import { LinkAction, LinkFound } from ".";

export const utmRedirectAction: LinkAction = (link) => {
    if (!link.link_utm || !link.url) {
        return link;
    }

    const {
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
    } = link.link_utm;

    const url = new URL(link.url);

    const utmParams: Record<string, string | null | undefined> = {
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
    };

    Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        }
    });

    link.url = url.toString();

    return link;
};
