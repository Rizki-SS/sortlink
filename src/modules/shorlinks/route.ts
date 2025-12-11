import Elysia from "elysia";
import { authMiddleware } from "../../middleware";
import { domainCreate } from "./controllers/domains/domain.create.controller";
import { domainFind } from "./controllers/domains/domain.find.controller";
import { domainFetch } from "./controllers/domains/domain.fetch.controller";
import { linkCreate } from "./controllers/links/link.create.controller";
import { linkGet } from "./controllers/links/link.get.controllers";
import { linkFind } from "./controllers/links/link.find.controller";
import { linkUpdate } from "./controllers/links/link.update.controller";
import { linkDelete } from "./controllers/links/link.delete.controller";

export const routes = new Elysia()
    .use(authMiddleware)
    .group("/links", (app) =>
        app
            .use(linkGet)
            .use(linkCreate)
            .use(linkFind)
            .use(linkUpdate)
            .use(linkDelete)
    )
    .group("/domains", (domainApp) =>
        domainApp
            .use(domainFetch)
            .use(domainCreate)
            .use(domainFind)
    );