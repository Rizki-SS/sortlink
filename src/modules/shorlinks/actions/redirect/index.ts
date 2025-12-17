import { LinkQuery } from "@/shorlinks/repositories/prisma/links.query";
import { utmRedirectAction } from "./utm.redirect.action";

export type LinkFound = NonNullable<
    Awaited<ReturnType<LinkQuery["findByHash"]>>
>;

export type LinkAction = (link: LinkFound) => LinkFound;

export {
    utmRedirectAction
}